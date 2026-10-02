#!/usr/bin/env python3
"""Build the Chinese Schema Engineering reader.

The Markdown under ``papers/src`` is the Chinese editorial source. This
compiler turns those three source files into a self-contained reader; the
English compiler imports the rendering primitives below and reads its own
derived translation cache.

The text edition and the reader revision are deliberately separate. A new
reader skin or a new text edition gets a new filename; every dated release
already tracked under ``papers/dist`` keeps its bytes.
"""

from __future__ import annotations

import hashlib
import html
import json
import re
import subprocess
from pathlib import Path
from typing import Mapping, Sequence

import markdown2


SCRIPT_DIR = Path(__file__).resolve().parent
SRC_DIR = SCRIPT_DIR / "src"
DIST_DIR = SCRIPT_DIR / "dist"
TRANSLATIONS_DIR = SCRIPT_DIR / "translations"
EN_DIR = TRANSLATIONS_DIR / "en"

EDITION = "2026-09-14"
TEXT_REVISION = "9.8"
READER_REVISION = "2026-09-15"
# Publication-view candidate. The dated 2026-09-11 reader files stay untouched; the
# candidate keeps its own dated path; integration must not overwrite historical releases.
READER_CANDIDATE = "paper-v1"
SIGNATURE_FAMILY = "black"  # "black" (default reading masthead) or "color" (cover / publishing use)

OUT_FILE = DIST_DIR / f"schema-engineering-{EDITION}-reader-{READER_REVISION}-{READER_CANDIDATE}.html"
INDEX_FILE = DIST_DIR / "index.html"
EN_OUT_FILE = DIST_DIR / f"schema-engineering-{EDITION}-reader-{READER_REVISION}-{READER_CANDIDATE}-en.html"
EN_INDEX_FILE = DIST_DIR / "index-en.html"

SOURCE_FILES: dict[str, Path] = {
    "canonical": SRC_DIR / "canonical.md",
    "practice": SRC_DIR / "practice.md",
    "index": SRC_DIR / "practice-index.md",
}
TRANSLATION_FILES: dict[str, Path] = {
    name: EN_DIR / f"{name if name != 'index' else 'practice-index'}.md"
    for name in SOURCE_FILES
}


COVER_ALT = {
    "zh": "编辑插画：承载面保留经治理的成果、提交记录与未完义务；右侧弧线表示更替的模型执行实例。",
    "en": "Editorial illustration: the bearing surface retains governed results, commit records, and unfinished obligations; arcs on the right represent successive model execution instances.",
}


def reader_asset(name: str) -> str:
    """Read a required reader asset; missing or empty files must stop the build."""

    path = SCRIPT_DIR / "reader" / name
    content = path.read_text(encoding="utf-8").strip()
    if not content:
        raise ValueError(f"Required reader asset is empty: {path}")
    return content


def with_cover(markup: str, alt: str) -> str:
    """Mount the editorial cover after the paper's own title and subtitle.

    The cover is a reader-layer asset; the Markdown source is not edited. Wide
    and compact drawings are both inlined; CSS shows one per viewport.
    """

    wide = reader_asset("cover.svg")
    compact = reader_asset("cover-compact.svg")
    escaped = html.escape(alt, quote=True)
    figure = (
        '<figure class="paper-cover" role="img" aria-label="' + escaped + '">'
        + wide.replace("<svg ", '<svg class="cover-wide" aria-hidden="true" ', 1)
        + compact.replace("<svg ", '<svg class="cover-compact" aria-hidden="true" ', 1)
        + "</figure>"
    )
    match = re.search(r"</h2>", markup)
    if not match:
        return figure + markup
    return markup[: match.end()] + figure + markup[match.end() :]


def strip_front_matter(text: str) -> str:
    """Remove YAML-style front matter before Markdown conversion."""
    if text.startswith("---"):
        match = re.match(r"^---\n(.*?\n)---\n", text, re.DOTALL)
        if match:
            return text[match.end() :]
    return text


def md_to_html(text: str) -> str:
    """Render Markdown without host-dependent syntax highlighting."""
    return markdown2.markdown(
        text,
        extras=[
            "tables",
            "fenced-code-blocks",
            "highlightjs-lang",
            "footnotes",
            "header-ids",
        ],
    )


def wrap_tables(markup: str, *, label: str = "Table") -> str:
    """Give wide tables a keyboard and touch scroll surface."""

    pattern = re.compile(r"<table(?:\s[^>]*)?>.*?</table>", re.DOTALL)

    def replace(match: re.Match[str]) -> str:
        return (
            '<div class="table-scroll" role="region" tabindex="0" '
            f'aria-label="{html.escape(label, quote=True)}">{match.group(0)}</div>'
        )

    return pattern.sub(replace, markup)


def heading_ids(markup: str) -> list[str]:
    """Return generated heading IDs in document order."""
    return re.findall(r'<h[1-6]\s+id="([^"]+)"', markup)


def apply_heading_ids(markup: str, ids: Sequence[str]) -> str:
    """Use source heading IDs for a translated document.

    Markdown headings can have different text in English, but the section
    position and old deep links must remain stable. The independent English
    compiler calls this after checking that the heading count is unchanged.
    """

    pattern = re.compile(r'(<h[1-6]\s+)id="[^"]+"')
    found = list(pattern.finditer(markup))
    if len(found) != len(ids):
        raise ValueError(
            f"heading count changed while assigning stable IDs: "
            f"source={len(ids)} rendered={len(found)}"
        )
    position = 0

    def replace(match: re.Match[str]) -> str:
        nonlocal position
        value = f'{match.group(1)}id="{html.escape(ids[position], quote=True)}"'
        position += 1
        return value

    return pattern.sub(replace, markup)


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def file_digests(paths: Mapping[str, Path]) -> dict[str, str]:
    return {name: sha256_file(path) for name, path in paths.items()}


def combined_digest(digests: Mapping[str, str]) -> str:
    material = "\n".join(f"{name}:{digest}" for name, digest in sorted(digests.items()))
    return hashlib.sha256(material.encode("ascii")).hexdigest()


def source_commit_matches(manifest: dict, source_digests: Mapping[str, str]) -> bool:
    """Confirm the manifest commit contains the exact current source bytes."""

    commit = manifest_source_commit(manifest)
    if not commit:
        return False
    repo = SCRIPT_DIR.parent
    for name, path in SOURCE_FILES.items():
        relative = path.relative_to(repo).as_posix()
        result = subprocess.run(
            ["git", "show", f"{commit}:{relative}"],
            cwd=repo,
            capture_output=True,
        )
        if result.returncode or hashlib.sha256(result.stdout).hexdigest() != source_digests[name]:
            return False
    return True


def load_manifest() -> dict:
    """Read the optional translation manifest.

    English is discoverable only after a manifest explicitly marks the
    complete cache as reviewed. The parent workflow owns that review record.
    """

    path = TRANSLATIONS_DIR / "manifest.json"
    if not path.is_file():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return payload if isinstance(payload, dict) else {}


def _manifest_entries(manifest: dict) -> dict[str, dict]:
    entries = manifest.get("files", {})
    return entries if isinstance(entries, dict) else {}


def manifest_source_commit(manifest: dict | None = None) -> str:
    value = (manifest or load_manifest()).get("source_commit", "")
    return value if re.fullmatch(r"[0-9a-fA-F]{40}", str(value)) else ""


def reviewed_translation_cache() -> bool:
    """Require a complete cache, per-file review, and exact byte binding."""

    manifest = load_manifest()
    top_status = str(
        manifest.get("review_status", manifest.get("status", ""))
    ).strip().lower()
    if top_status != "reviewed" or not manifest_source_commit(manifest):
        return False
    if not all(path.is_file() for path in TRANSLATION_FILES.values()):
        return False
    entries = _manifest_entries(manifest)
    if set(entries) != set(SOURCE_FILES):
        return False
    source_digests = file_digests(SOURCE_FILES)
    translation_digests = file_digests(TRANSLATION_FILES)
    if not source_commit_matches(manifest, source_digests):
        return False
    for name, entry in entries.items():
        if not isinstance(entry, dict):
            return False
        translated = TRANSLATION_FILES[name].read_text(encoding="utf-8")
        front = translated.split("---", 2)[1] if translated.startswith("---\n") else ""
        if not re.search(r"(?m)^Language: en$", front):
            return False
        if not re.search(r"(?m)^Source commit: " + re.escape(manifest_source_commit(manifest)) + r"$", front):
            return False
        status = str(entry.get("review_status", entry.get("status", ""))).strip().lower()
        if status != "reviewed":
            return False
        source_value = entry.get("source_sha256", entry.get("source_hash", ""))
        translation_value = entry.get(
            "translation_sha256", entry.get("translation_hash", "")
        )
        if isinstance(source_value, dict):
            source_value = source_value.get("sha256", source_value.get("hash", ""))
        if isinstance(translation_value, dict):
            translation_value = translation_value.get(
                "sha256", translation_value.get("hash", "")
            )
        source_hash = str(source_value).lower()
        translation_hash = str(translation_value).lower()
        if source_hash != source_digests[name] or translation_hash != translation_digests[name]:
            return False
    return True


def english_ready() -> bool:
    """Whether a reviewed, complete English cache may be linked from the UI."""

    return reviewed_translation_cache()


def render_paper(markdown: str, *, stable_ids: Sequence[str] | None = None) -> str:
    markup = md_to_html(strip_front_matter(markdown))
    if stable_ids is not None:
        markup = apply_heading_ids(markup, stable_ids)
    return wrap_tables(markup)


def unique_document_ids(papers: Mapping[str, str]) -> dict[str, str]:
    """Namespace duplicate IDs across and within the three paper views.

    The old release had repeated Chinese IDs such as ``#摘要`` in separate
    hidden views. The canonical occurrence remains unchanged; later views get
    a stable mode prefix so DOM lookup and language switching are unambiguous.
    Reader JavaScript still resolves the old unprefixed hash as an alias.
    """

    used: set[str] = set()
    result: dict[str, str] = {}
    id_pattern = re.compile(r'(\s)id="([^"]+)"')
    for mode in ("canonical", "practice", "index"):
        markup = papers[mode]

        def replace(match: re.Match[str]) -> str:
            prefix, old = match.groups()
            new = old
            if new in used:
                new = f"{mode}-{old}"
                suffix = 2
                while new in used:
                    new = f"{mode}-{old}-{suffix}"
                    suffix += 1
            used.add(new)
            return f'{prefix}id="{html.escape(new, quote=True)}"'

        result[mode] = id_pattern.sub(replace, markup)
    return result


def _labels(language: str) -> dict[str, str]:
    if language == "en":
        return {
            "lang": "en",
            "html_lang": "en",
            "canonical": "Canonical",
            "practice": "Practice",
            "index": "Index",
            "reader": "Working Papers",
            "switch": "中文",
            "aria": "Paper view",
            "theme": "Theme",
            "toc": "Sections",
            "skip": "Skip to papers",
            "source": "Chinese editorial source",
            "translation_note": "AI translation · Source comparison and review record",
            "noscript": "JavaScript is optional; all three papers remain readable on this page.",
            "maker": "les Privilege",
            "meta_canonical": "Canonical",
            "meta_practice": "Practice Snapshot",
            "meta_index": "Practice Index",
            "meta_edition": "Edition",
            "meta_revision": "Text revision",
            "meta_reader": "Reader revision",
            "cover_alt": COVER_ALT["en"],
        }
    return {
        "lang": "zh",
        "html_lang": "zh-CN",
        "canonical": "Canonical",
        "practice": "Practice",
        "index": "Index",
        "reader": "工作论文",
        "switch": "English",
        "aria": "论文视图",
        "theme": "主题",
        "toc": "章节目录",
        "skip": "跳至论文",
        "source": "中文编订源",
        "translation_note": "",
        "noscript": "未启用 JavaScript 时，三份论文仍可完整阅读。",
        "maker": "les Privilege",
        "meta_canonical": "Canonical",
        "meta_practice": "Practice Snapshot",
        "meta_index": "Practice Index",
        "meta_edition": "Edition",
        "meta_revision": "文本版本",
        "meta_reader": "阅读版本",
        "cover_alt": COVER_ALT["zh"],
    }


def render_page(
    papers: Mapping[str, str],
    *,
    language: str,
    source_digests: Mapping[str, str],
    translation_digests: Mapping[str, str] | None = None,
    language_href: str | None = None,
    language_ready: bool = False,
    source_commit: str = "",
) -> str:
    """Render one language's three-view, self-contained reader."""

    labels = _labels(language)
    source_digest = combined_digest(source_digests)
    translation_digest = (
        combined_digest(translation_digests) if translation_digests else ""
    )
    language_link = ""
    if language_ready and language_href:
        escaped_href = html.escape(language_href, quote=True)
        language_link = (
            '<a class="language-switch" data-language-switch '
            f'data-language-target="{escaped_href}" href="{escaped_href}">'
            f'{html.escape(labels["switch"])}</a>'
        )

    return TEMPLATE.format(
        html_lang=labels["html_lang"],
        language=labels["lang"],
        reader_label=html.escape(labels["reader"]),
        skip_label=html.escape(labels["skip"]),
        noscript_label=html.escape(labels["noscript"]),
        paper_aria=html.escape(labels["aria"], quote=True),
        canonical_label=html.escape(labels["canonical"]),
        practice_label=html.escape(labels["practice"]),
        index_label=html.escape(labels["index"]),
        theme_label=html.escape(labels["theme"], quote=True),
        language_link=language_link,
        source_link=(
            f'<a href="https://github.com/lesPrivilege/Schema-Engineering/tree/{source_commit or "main"}/papers/src">'
            f'{html.escape(labels["source"])}</a>'
        ),
        translation_note=(
            '<a href="https://github.com/lesPrivilege/Schema-Engineering/blob/main/papers/translations/review-2026-09-10.md">'
            f'{html.escape(labels["translation_note"])}</a>' if language == "en" else ""
        ),
        source_digest=source_digest,
        translation_digest=translation_digest,
        source_commit=html.escape(source_commit, quote=True),
        edition=EDITION,
        text_revision=TEXT_REVISION,
        reader_revision=READER_REVISION,
        reader_candidate=READER_CANDIDATE,
        signature_family=SIGNATURE_FAMILY,
        maker=html.escape(labels["maker"]),
        signature=reader_asset("signature.svg"),
        css=(SCRIPT_DIR / "reader" / "reader.css").read_text(encoding="utf-8"),
        js=(SCRIPT_DIR / "reader" / "reader.js").read_text(encoding="utf-8"),
        canonical=with_toc(papers["canonical"], "canonical", labels),
        practice=with_toc(papers["practice"], "practice", labels),
        index=with_toc(papers["index"], "index", labels),
    )


def with_toc(markup: str, mode: str, labels: Mapping[str, str]) -> str:
    """Add a compact, no-JS chapter navigator without changing paper text."""

    headings = re.findall(r'<h([2-6])\s+id="([^"]+)"[^>]*>(.*?)</h[2-6]>', markup, re.DOTALL)
    if not headings:
        return markup
    links = []
    for level, anchor, title in headings:
        plain = re.sub(r"<[^>]+>", "", title).strip()
        links.append(
            f'<li class="toc-level-{level}"><a data-mode-link="{mode}" '
            f'data-toc-link href="#{html.escape(anchor, quote=True)}">{plain}</a></li>'
        )
    summary = f'{labels[mode]} · {labels["toc"]}'
    meta = (
        '<p class="paper-meta">'
        f'<span>{html.escape(labels["meta_" + mode])}</span>'
        f'<span>{html.escape(labels["meta_edition"])} {EDITION}</span>'
        f'<span>{html.escape(labels["meta_revision"])} {TEXT_REVISION}</span>'
        f'<span>{html.escape(labels["meta_reader"])} {READER_REVISION}</span>'
        "</p>"
    )
    if mode == "canonical":
        markup = with_cover(markup, labels["cover_alt"])
    return (
        f'<details class="reader-toc"><summary>{html.escape(summary)}</summary>'
        f'<nav aria-label="{html.escape(summary)}"><ol>{"".join(links)}</ol></nav></details>'
        f'<div class="paper-body">{meta}{markup}</div>'
    )


TEMPLATE = """<!doctype html>
<html lang="{html_lang}" data-language="{language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="paper-edition" content="{edition}">
  <meta name="text-revision" content="{text_revision}">
  <meta name="reader-revision" content="{reader_revision}">
  <meta name="reader-candidate" content="{reader_candidate}">
  <meta name="source-sha256" content="{source_digest}">
  <meta name="source-commit" content="{source_commit}">
  <meta name="translation-sha256" content="{translation_digest}">
  <title>Schema Engineering · {edition} · {language}</title>
  <style>{css}</style>
</head>
<body data-reader data-reader-revision="{reader_revision}" data-reader-candidate="{reader_candidate}" data-language="{language}" data-signature="{signature_family}">
  <a class="skip-link" href="#reader-content">{skip_label}</a>
  <header class="reader-masthead">
    <div class="reader-brand">
      <h1>Schema Engineering</h1>
      <p>{reader_label} · {edition}</p>
    </div>
    <p class="maker">{signature}<span>{maker}</span></p>
  </header>
  <nav class="view-controls" aria-label="{paper_aria}">
    <div class="mode-controls">
      <a href="?mode=canonical#paper-canonical" data-mode-link="canonical" aria-current="page">{canonical_label}</a>
      <a href="?mode=practice#paper-practice" data-mode-link="practice">{practice_label}</a>
      <a href="?mode=index#paper-index" data-mode-link="index">{index_label}</a>
    </div>
    <div class="reader-actions">
      <button type="button" data-theme-toggle aria-label="{theme_label}">◐</button>
{language_link}
    </div>
  </nav>
  <main id="reader-content" class="reader-content">
    <article class="paper" id="paper-canonical" data-paper-mode="canonical" data-active="true">{canonical}</article>
    <article class="paper" id="paper-practice" data-paper-mode="practice" aria-hidden="false">{practice}</article>
    <article class="paper" id="paper-index" data-paper-mode="index" aria-hidden="false">{index}</article>
  </main>
  <footer class="reader-footer"><span>Schema Engineering · {text_revision} · {edition} · {source_link} · <a href="https://lesprivilege.github.io/Courtwork/">CourtWork</a> {translation_note}</span><span>{maker} · {reader_candidate} · {reader_revision}</span></footer>
  <noscript><p class="noscript-note">{noscript_label}</p></noscript>
  <script>{js}</script>
</body>
</html>
"""


def build() -> None:
    source_markdown = {
        name: path.read_text(encoding="utf-8") for name, path in SOURCE_FILES.items()
    }
    source_digests = file_digests(SOURCE_FILES)
    source_html = {
        name: render_paper(markdown) for name, markdown in source_markdown.items()
    }
    source_html = unique_document_ids(source_html)
    page = render_page(
        source_html,
        language="zh",
        source_digests=source_digests,
        language_href="index-en.html",
        language_ready=english_ready(),
        source_commit=manifest_source_commit() if reviewed_translation_cache() else "",
    )

    DIST_DIR.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(page, encoding="utf-8")
    INDEX_FILE.write_text(page, encoding="utf-8")
    print(f"Built: {OUT_FILE}  ({OUT_FILE.stat().st_size:,} bytes)")
    print(f"Current: {INDEX_FILE}")
    if english_ready():
        print("English switch: enabled by reviewed translation manifest")
    else:
        print("English switch: withheld until the reviewed translation cache is complete")


if __name__ == "__main__":
    build()
