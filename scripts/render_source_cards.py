#!/usr/bin/env python3
"""Render one stable-URL source card for every entry in the provenance catalogs.

The catalogs are the source of truth.  This script only writes the card files
for source slugs that are present in those catalogs; it never removes files.
Summaries and statuses are projected from existing catalog entries.  It does
not browse, re-check URLs, or expose internal search-result references.
"""

from __future__ import annotations

import argparse
from collections import Counter
import json
import os
import re
from pathlib import Path
from typing import Any


CATALOGS = (
    ("enterprise", "vault/provenance/catalog.json", "vault/provenance/cards"),
    ("reporting", "vault/provenance/reporting/catalog.json", "vault/provenance/reporting/cards"),
    ("work-system", "vault/provenance/work-system/catalog.json", "vault/provenance/work-system/cards"),
)
SAFE_SLUG = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def quoted(value: Any) -> str:
    """Use JSON quoting, which is also valid for a simple YAML scalar."""
    return json.dumps("" if value is None else str(value), ensure_ascii=False)


def tags(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item) for item in value]
    return [str(value)]


def render_card(source: dict[str, Any], catalog_rel: str) -> str:
    required = ("title", "summary_zh", "status", "url", "limits", "revisit_trigger")
    missing = [key for key in required if not source.get(key)]
    if missing:
        raise ValueError(f"source {source.get('slug', '<unknown>')} missing fields: {', '.join(missing)}")
    url = str(source["url"])
    if not url.startswith(("https://", "http://")):
        raise ValueError(f"source {source['slug']} has a non-URL locator: {url}")

    purpose_tags = tags(source.get("purpose_tags"))
    lines = [
        "---",
        f"id: {quoted(source['slug'])}",
        f"status: {quoted(source['status'])}",
        f"url: {quoted(url)}",
        "---",
        "",
        f"# {source['title']}",
        "",
        f"来源：[原始页面]({url}) · 状态：`{source['status']}`",
        "",
        "用途：" + (" / ".join(purpose_tags) if purpose_tags else "待分类，按具体消费目标复核"),
        "",
        "## 摘要",
        "",
        str(source['summary_zh']),
        "",
        "## 证据与使用边界",
        "",
        str(source['limits']),
        "",
        "## 何时重访",
        "",
        str(source['revisit_trigger']),
        "",
        "引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。",
        "",
    ]
    return "\n".join(lines)


def render_indexes(root: Path, namespace: str, catalog_rel: str, cards_rel: str, catalog: dict[str, Any]) -> None:
    sources = catalog['sources']
    statuses = Counter(source['status'] for source in sources)
    status_text = '、'.join(f"{count} `{status}`" for status, count in sorted(statuses.items()))
    citation_count = len(catalog['occurrences'])
    title = {'enterprise': 'Enterprise 早期来源', 'reporting': 'Reporting 来源',
             'work-system': 'Work System 来源（含增量）'}.get(namespace, str(catalog.get('catalog_id', namespace)))
    header = (f"# {title}\n\n"
              f"登记 {len(sources)} 个来源记录、{citation_count} 个引用占位映射；状态：{status_text}。\n\n"
              "默认阅读 [逐源摘要](cards/README.md)，机器登记见 [catalog.json](catalog.json)。"
              "这里的来源URL是另行找到的补充证据；原Chat隐藏引用未恢复。"
              "验证状态针对摘要中写明的主张，不能扩大为对整个历史回答的背书。\n\n")
    if namespace == 'enterprise':
        header += ("## 其他主题\n\n- [Reporting](reporting/README.md)\n"
                   "- [Work System 与增量](work-system/README.md)\n"
                   "- [原对话明确URL](../references/README.md)\n"
                   "- [统一登记投影](../registry.json)\n")
    else:
        parent = (root / catalog_rel).parent
        home = os.path.relpath(root / 'vault/provenance/README.md', parent)
        distilled = os.path.relpath(root / 'vault/distilled/README.md', parent)
        header += f"[追溯总入口]({home}) · [结构化主题]({distilled})\n"
    parent = (root / catalog_rel).parent
    children = sorted(p for p in parent.glob('*/catalog.json') if p.parent.name != 'cards')
    if children:
        header += "\n## 增量批次\n\n"
        for child in children:
            relative = child.parent.relative_to(parent).as_posix()
            header += f"- [{relative}]({relative}/README.md)\n"
    if str(catalog_rel) == 'vault/provenance/work-system/catalog.json':
        header += '\nr4 已消费，无新的外部 citation，因此没有新增来源卡；见 [r4 登记](../../intake/work-system-increment-r4.json)。\n'
    (root / catalog_rel).parent.joinpath('README.md').write_text(header, encoding='utf-8')
    lines = [f"# {title} · 摘要索引", "",
             f"{len(sources)} 个来源；{citation_count} 个引用映射。详细记录见 [catalog](../catalog.json)。", "",
             "| 来源 | 证据状态 | 用途 |", "|---|---|---|"]
    for source in sources:
        label = str(source['title']).replace('|', '/')
        purpose = ' / '.join(tags(source.get('purpose_tags'))) or '待分类'
        lines.append(f"| [{label}]({source['slug']}.md) | {source['status']} | {purpose} |")
    lines += ["", "卡片与此索引由 catalog 生成；修改登记后重跑 scripts/render_source_cards.py。", ""]
    (root / cards_rel / 'README.md').write_text('\n'.join(lines), encoding='utf-8')


def render_catalog(root: Path, namespace: str, catalog_rel: str, cards_rel: str) -> int:
    catalog_path = root / catalog_rel
    cards_dir = root / cards_rel
    cards_dir.mkdir(parents=True, exist_ok=True)
    catalog = load_json(catalog_path)
    written = 0
    seen: set[str] = set()
    for source in catalog.get("sources", []):
        slug = source.get("slug")
        if not isinstance(slug, str) or not SAFE_SLUG.fullmatch(slug):
            raise ValueError(f"{catalog_rel}: unsafe or missing slug: {slug!r}")
        if slug in seen:
            raise ValueError(f"{catalog_rel}: duplicate slug: {slug}")
        seen.add(slug)
        card_path = cards_dir / f"{slug}.md"
        card_path.write_text(render_card(source, catalog_rel), encoding="utf-8")
        written += 1
    render_indexes(root, namespace, catalog_rel, cards_rel, catalog)
    print(json.dumps({"namespace": namespace, "catalog": catalog_rel, "cards_written": written}, ensure_ascii=False))
    return written


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    root = args.root.resolve()
    specs = list(CATALOGS)
    known = {rel for _, rel, _ in specs}
    for path in sorted((root / 'vault/provenance').rglob('catalog.json')):
        rel = path.relative_to(root).as_posix()
        if rel not in known:
            name = path.parent.relative_to(root / 'vault/provenance').as_posix().replace('/', '-')
            specs.append((name, rel, path.parent.relative_to(root).as_posix() + '/cards'))
    total = sum(render_catalog(root, *spec) for spec in specs)
    print(json.dumps({"total_cards_written": total}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
