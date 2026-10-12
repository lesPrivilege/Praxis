#!/usr/bin/env python3
"""Build Drift's four-file static demonstration for GitHub Pages.

Usage: python3 scripts/build_drift_pages.py --output DEDICATED_EXTERNAL_DIR
The destination must be absent or empty and outside this repository. Symlink
paths are rejected. Nothing is published and the local source HTML is unchanged.
"""
import argparse
import hashlib
import json
import re
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "demos" / "drift"
ASSETS = ("index.html", "app.js", "style.css")
ARTIFACT_FILES = frozenset((*ASSETS, ".nojekyll"))


class BuildError(ValueError):
    """A source or destination is unsafe or unsuitable for this artifact."""


def reject_symlinks(path, label):
    for component in (path, *path.parents):
        if component.is_symlink():
            raise BuildError(f"{label} contains a symlink; use a dedicated canonical path.")


def build_site(output, source=SOURCE):
    output = Path(output).expanduser().absolute()
    source = Path(source).expanduser().absolute()
    reject_symlinks(output, "Output")
    reject_symlinks(source, "Source")
    destination = output.resolve()
    if destination == destination.parent or destination == Path.home().resolve() or destination.is_relative_to(ROOT):
        raise BuildError("Output must be a dedicated directory outside the repository and filesystem/home roots.")
    if not destination.parent.is_dir():
        raise BuildError("Output parent must already exist; parent directories are not created.")
    if destination.exists() and (not destination.is_dir() or any(destination.iterdir())):
        raise BuildError("Output must be absent or empty; existing files are never overwritten or removed.")
    for name in ASSETS:
        asset = source / name
        reject_symlinks(asset, f"Source {name}")
        if not asset.is_file():
            raise BuildError(f"Source {name} must be a regular file.")
    payload = {name: (source / name).read_bytes() for name in ASSETS}
    opening = list(re.finditer(rb"<html\b[^>]*>", payload["index.html"], re.IGNORECASE))
    if len(opening) != 1:
        raise BuildError("Source HTML must contain one html opening tag.")
    tag = opening[0]
    if re.search(rb"\bdata-drift-static(?:\s|=|>)", tag.group(), re.IGNORECASE):
        raise BuildError("Source HTML is already marked static; use the local source HTML.")
    payload["index.html"] = payload["index.html"][:tag.end() - 1] + b" data-drift-static" + payload["index.html"][tag.end() - 1:]
    payload[".nojekyll"] = b""
    # Stage only this build's four public assets. Rename cannot replace a
    # nonempty directory, so an unrelated concurrent file is never deleted.
    with tempfile.TemporaryDirectory(prefix=".drift-pages-build-", dir=destination.parent) as staging:
        stage = Path(staging)
        for name, data in payload.items():
            path = stage / name
            path.write_bytes(data)
            path.chmod(0o644)
        stage.chmod(0o755)
        stage.rename(destination)
    return {"files": sorted(ARTIFACT_FILES), "sha256": {name: hashlib.sha256(data).hexdigest() for name, data in payload.items()}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        result = build_site(args.output)
    except (BuildError, OSError) as error:
        parser.exit(1, f"Build refused: {error}\n")
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
