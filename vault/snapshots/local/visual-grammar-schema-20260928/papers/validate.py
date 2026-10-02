#!/usr/bin/env python3
"""Validate paper sources, the additive Chinese reader, and reviewed English output."""

from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote

import build


SCRIPT_DIR = Path(__file__).resolve().parent
DIST_DIR = SCRIPT_DIR / "dist"
EDITION = build.EDITION
READER_FILE = build.OUT_FILE
INDEX_FILE = build.INDEX_FILE
EN_READER_FILE = build.EN_OUT_FILE
EN_INDEX_FILE = build.EN_INDEX_FILE
SOURCE_FILES = build.SOURCE_FILES
TRANSLATION_FILES = build.TRANSLATION_FILES


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def validate_fragment_links(markup: str, name: str) -> None:
    class Links(HTMLParser):
        def __init__(self):
            super().__init__()
            self.ids = []
            self.links = []

        def handle_starttag(self, tag, attrs):
            values = dict(attrs)
            if "id" in values:
                self.ids.append(values["id"])
            if tag == "a" and values.get("href", "").startswith("#"):
                self.links.append(unquote(values["href"][1:]))

    parsed = Links()
    parsed.feed(markup)
    duplicates = [value for value, count in Counter(parsed.ids).items() if count > 1]
    missing = set(parsed.links) - set(parsed.ids)
    if duplicates or missing:
        fail(f"{name} fragment links: duplicate IDs={duplicates}, missing targets={sorted(missing)}")


def front_matter(text: str, name: str) -> dict[str, str]:
    match = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not match:
        fail(f"{name} has no YAML-style front matter")
    fields: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            fields[key.strip()] = value.strip()
    return fields


def validate_source(name: str, path: Path) -> str:
    if not path.is_file():
        fail(f"missing source: {path}")
    text = path.read_text(encoding="utf-8")
    fields = front_matter(text, name)
    if fields.get("Edition") != EDITION:
        fail(f"{name} Edition is not {EDITION}")
    if text.count("```") % 2:
        fail(f"{name} has an unclosed fenced block")
    used = set(re.findall(r"\[\^([^\]]+)\]", text))
    defined = set(re.findall(r"(?m)^\[\^([^\]]+)\]:", text))
    missing = used - defined
    if missing:
        fail(f"{name} has undefined footnotes: {sorted(missing)}")
    if name != "index" and re.search(r"https?://", text):
        fail(f"{name} contains an external URL; move it to Practice Index")
    return text


def head_blob(relative: str) -> bytes:
    # The checkout is shallow in some local environments. cat-file gives a
    # byte comparison without relying on the index or a clean worktree.
    result = subprocess.run(
        ["git", "cat-file", "blob", f"HEAD:{relative}"],
        cwd=SCRIPT_DIR.parent,
        capture_output=True,
    )
    if result.returncode:
        fail(f"cannot read historical release from HEAD: {relative}")
    return result.stdout


def historical_releases() -> list[str]:
    """Tracked dist files other than the outputs of the current build."""

    result = subprocess.run(
        ["git", "ls-files", "--", "papers/dist"],
        cwd=SCRIPT_DIR.parent,
        capture_output=True,
        text=True,
    )
    if result.returncode:
        fail("cannot list tracked release files")
    current = {READER_FILE.name, EN_READER_FILE.name}
    return [line for line in result.stdout.splitlines() if Path(line).name not in current]


def read_manifest() -> dict:
    path = build.TRANSLATIONS_DIR / "manifest.json"
    if not path.is_file():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"invalid translation manifest: {exc}")
    return payload if isinstance(payload, dict) else {}


def validate_chinese(sources: dict[str, str]) -> list[str]:
    canonical_base = f"Canonical base: {EDITION} Canonical Edition"
    for name in ("practice", "index"):
        if canonical_base not in sources[name]:
            fail(f"{name} does not declare the expected Canonical base")
    if f"Practice base: {EDITION} Generalized Practice Snapshot" not in sources["index"]:
        fail("index does not declare the expected Practice base")

    if not READER_FILE.is_file() or not INDEX_FILE.is_file():
        fail("missing current Chinese reader output; run papers/build.py")
    release = READER_FILE.read_text(encoding="utf-8")
    current = INDEX_FILE.read_text(encoding="utf-8")
    validate_fragment_links(release, "Chinese")
    if release != current:
        fail("Chinese Pages entry point differs from the dated reader")

    checks = {
        "three paper views": all(
            f'id="paper-{mode}" data-paper-mode="{mode}"' in release
            for mode in ("canonical", "practice", "index")
        ),
        "canonical default": 'id="paper-canonical" data-paper-mode="canonical" data-active="true"' in release,
        "reader revision metadata": f'name="reader-revision" content="{build.READER_REVISION}"' in release,
        "text edition metadata": f'name="paper-edition" content="{EDITION}"' in release,
        "cold reading palette": "--canvas: #edf1f3" in release and "--ink: #242d33" in release,
        "dark mode": "prefers-color-scheme: dark" in release and "--canvas: #202b32" in release,
        "reader candidate metadata": f'name="reader-candidate" content="{build.READER_CANDIDATE}"' in release,
        "maker signature": 'class="maker"' in release and "les Privilege" in release,
        "table scroll surface": 'class="table-scroll"' in release,
        "review attention hook": '[data-attention="review"]' in release,
        "responsive metadata": 'name="viewport"' in release,
        "self-contained runtime": '<script src=' not in release and '<link rel=' not in release,
        "no-js readable": 'body[data-reader][data-reader-ready] .paper:not([data-active="true"])' in release,
        "stable deep-link code": "modeFromHash" in release and "scrollIntoView" in release,
    }
    failed = [name for name, passed in checks.items() if not passed]
    if failed:
        fail("Chinese reader checks failed: " + ", ".join(failed))
    return [f"{name}" for name in checks]


def validate_historical() -> list[str]:
    releases = historical_releases()
    if not releases:
        fail("no historical release is tracked under papers/dist")
    for relative in releases:
        path = SCRIPT_DIR.parent / relative
        if not path.is_file():
            fail(f"missing historical release: {relative}")
        expected = head_blob(relative)
        current = path.read_bytes()
        if current != expected:
            fail(
                f"historical release bytes changed: {relative} "
                f"(HEAD sha256={hashlib.sha256(expected).hexdigest()[:12]}, "
                f"working sha256={hashlib.sha256(current).hexdigest()[:12]})"
            )
    return releases


def validate_english_if_present(sources: dict[str, str]) -> bool:
    manifest = read_manifest()
    translations_present = all(path.is_file() for path in TRANSLATION_FILES.values())
    reviewed = build.reviewed_translation_cache()
    if not reviewed or not translations_present:
        if EN_INDEX_FILE.exists():
            fail("English index-en.html exists without a complete reviewed translation cache")
        if 'data-language-switch ' in READER_FILE.read_text(encoding="utf-8"):
            fail("Chinese reader links an English cache that is not current and reviewed")
        return False

    if not EN_READER_FILE.is_file() or not EN_INDEX_FILE.is_file():
        fail("reviewed translation cache has no English reader output; run papers/build_en.py")
    release = EN_READER_FILE.read_text(encoding="utf-8")
    current = EN_INDEX_FILE.read_text(encoding="utf-8")
    validate_fragment_links(release, "English")
    if release != current:
        fail("English Pages entry point differs from the dated reader")
    source_digests = build.file_digests(SOURCE_FILES)
    translation_digests = build.file_digests(TRANSLATION_FILES)
    checks = {
        "English language": '<html lang="en" data-language="en">' in release,
        "Chinese switch": 'data-language-target="index.html"' in release,
        "three English views": release.count('class="paper"') == 3,
        "source binding": f'name="source-sha256" content="{build.combined_digest(source_digests)}"' in release,
        "translation binding": f'name="translation-sha256" content="{build.combined_digest(translation_digests)}"' in release,
        "source commit binding": f'name="source-commit" content="{build.manifest_source_commit(manifest)}"' in release,
        "stable reader IDs": all(f'id="paper-{mode}"' in release for mode in ("canonical", "practice", "index")),
        "self-contained runtime": '<script src=' not in release and '<link rel=' not in release,
    }
    failed = [name for name, passed in checks.items() if not passed]
    if failed:
        fail("English reader checks failed: " + ", ".join(failed))
    return True


def main() -> None:
    sources = {name: validate_source(name, path) for name, path in SOURCE_FILES.items()}
    chinese_checks = validate_chinese(sources)
    historical = validate_historical()
    english = validate_english_if_present(sources)
    print(
        f"PASS: {len(SOURCE_FILES)} Chinese sources, {len(chinese_checks)} reader checks, "
        f"Edition {EDITION}; English={'reviewed' if english else 'withheld'}"
    )
    print(f"PASS: {READER_FILE.name} == index.html ({READER_FILE.stat().st_size:,} bytes)")
    if english:
        print(f"PASS: {EN_READER_FILE.name} == index-en.html ({EN_READER_FILE.stat().st_size:,} bytes)")
    print(f"PASS: {len(historical)} historical release files unchanged")


if __name__ == "__main__":
    main()
