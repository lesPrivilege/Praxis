#!/usr/bin/env python3
"""Validate specimens.json against the HTML pages and render the readable entry points.

  python3 tools/catalog.py          # validate, then write index.html and catalog.md
  python3 tools/catalog.py --check  # validate only

specimens.json is the single source; index.html and catalog.md are generated views.
"""
import html
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

LAB = Path(__file__).resolve().parents[1]
DATA = json.loads((LAB / 'specimens.json').read_text())
AXES = DATA['axes']
FAMILIES = DATA['families']
SPECS = DATA['specimens']
esc = html.escape


def ids_in(path, cache={}):
    if path not in cache:
        cache[path] = set(re.findall(r'\sid="([^"]+)"', (LAB / path).read_text())) if (LAB / path).exists() else None
    return cache[path]


def validate():
    errors, seen = [], set()
    for s in SPECS:
        if s['id'] in seen:
            errors.append(f"duplicate id {s['id']}")
        seen.add(s['id'])
        page, _, anchor = s['href'].partition('#')
        ids = ids_in(page)
        if ids is None:
            errors.append(f"{s['id']}: missing page {page}")
            continue
        if anchor and anchor not in ids:
            errors.append(f"{s['id']}: missing anchor #{anchor} in {page}")
        for v in s.get('variants', []):
            if v['id'] in seen:
                errors.append(f"duplicate variant id {v['id']}")
            seen.add(v['id'])
            if v['id'] not in ids:
                errors.append(f"{v['id']}: missing anchor in {page}")
            for axis, value in v.get('axes', {}).items():
                values = value if isinstance(value, list) else [value]
                for val in values:
                    if axis not in AXES or val not in AXES[axis]['values']:
                        errors.append(f"{v['id']}: unknown axis value {axis}:{val}")
            if v.get('status') not in ('candidate', 'stress', 'failed'):
                errors.append(f"{v['id']}: bad status {v.get('status')}")
    known = {s['id'] for s in SPECS}
    for s in SPECS:
        for r in s.get('related', []) + s.get('uses', []):
            if r not in known:
                errors.append(f"{s['id']}: unknown related/uses id {r}")
    return errors


def axis_values(v, axis):
    val = v.get('axes', {}).get(axis)
    return [] if val is None else (val if isinstance(val, list) else [val])


def group_key(s):
    return s['family'] if s['level'] == 'atom' else s['level']


def matrix_rows():
    rows = [(f['id'], f['name']) for f in FAMILIES] + [('pattern', 'Pattern'), ('composition', 'Composition')]
    counts = {axis: defaultdict(Counter) for axis in AXES}
    for s in SPECS:
        for v in s.get('variants', []):
            for axis in AXES:
                for val in axis_values(v, axis):
                    counts[axis][group_key(s)][val] += 1
    return rows, counts


def status_counts():
    c = Counter()
    for s in SPECS:
        for v in s.get('variants', []):
            c[v['status']] += 1
    return c


def render_index():
    rows, counts = matrix_rows()
    st = status_counts()
    by_group = defaultdict(list)
    for s in SPECS:
        by_group[group_key(s)].append(s)
    n_atoms = sum(1 for s in SPECS if s['level'] == 'atom')
    n_var = sum(len(s.get('variants', [])) for s in SPECS)
    out = []
    w = out.append
    w('<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n'
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
      '<title>编排样张实验室</title>\n<link rel="stylesheet" href="shared/lab.css">\n'
      '<link rel="stylesheet" href="shared/index.css">\n</head>\n<body class="lab">\n')
    w('<header class="lab-bar">\n  <a class="lab-home" href="index.html" aria-current="page">编排样张实验室</a>\n'
      '  <nav aria-label="样张家族">\n')
    for f in FAMILIES:
        w(f'    <a href="{esc(f["href"])}">{esc(f["name"])}</a>\n')
    w('    <a href="patterns/patterns.html">Pattern</a>\n    <a href="#compositions">Composition</a>\n'
      '    <a href="catalog.md">catalog.md</a>\n  </nav>\n</header>\n<main class="lab-main idx">\n')
    w('<header class="idx-head">\n<p class="synthetic-note">SYNTHETIC · 实验样张 · 未经采纳</p>\n'
      '<h1>内容如何被编排：原子、变体与组合</h1>\n')
    w(f'<p class="idx-lead">{esc(DATA["summary"])}</p>\n')
    w(f'<p class="idx-count"><span>{n_atoms} 个原子</span><span>{sum(1 for s in SPECS if s["level"] == "pattern")} 个 pattern</span>'
      f'<span>{sum(1 for s in SPECS if s["level"] == "composition")} 个 composition</span><span>{n_var} 个样张</span>'
      f'<span>候选 {st["candidate"]} · 压力 {st["stress"]} · 失败 {st["failed"]}</span></p>\n')
    w(f'<p class="idx-status">{esc(DATA["status"])}</p>\n</header>\n')

    # families
    w('<section class="idx-fams" aria-labelledby="fam-h">\n<h2 id="fam-h">按语义职责找原子</h2>\n')
    for f in FAMILIES:
        w(f'<section class="idx-fam">\n<h3><a href="{esc(f["href"])}">{esc(f["name"])}</a></h3>\n'
          f'<p class="idx-fam-job">{esc(f["job"])}</p>\n<ol class="idx-atoms">\n')
        for s in by_group[f['id']]:
            vs = s.get('variants', [])
            fails = sum(1 for v in vs if v['status'] == 'failed')
            stress = sum(1 for v in vs if v['status'] == 'stress')
            w(f'<li><a href="{esc(s["href"])}"><span class="idx-id">{esc(s["id"])}</span> {esc(s["name"])}</a>'
              f'<span class="idx-job">{esc(s["job"])}</span>'
              f'<span class="idx-n">{len(vs)} 变体{f" · 压力 {stress}" if stress else ""}{f" · 失败 {fails}" if fails else ""}</span></li>\n')
        w('</ol>\n</section>\n')
    w('</section>\n')

    # patterns + compositions
    for level, title, anchor in (('pattern', 'Pattern：原子的局部组合', 'patterns'), ('composition', 'Composition：完整页面', 'compositions')):
        w(f'<section class="idx-level" id="{anchor}" aria-labelledby="{anchor}-h">\n<h2 id="{anchor}-h">{title}</h2>\n<ol class="idx-atoms idx-atoms--wide">\n')
        for s in by_group[level]:
            uses = ' '.join(s.get('uses', []))
            w(f'<li><a href="{esc(s["href"])}"><span class="idx-id">{esc(s["id"])}</span> {esc(s["name"])}</a>'
              f'<span class="idx-job">{esc(s["job"])}</span><span class="idx-n">用到 {esc(uses) or "—"}</span></li>\n')
        w('</ol>\n</section>\n')

    # coverage matrix
    w('<section class="idx-matrix" id="coverage" aria-labelledby="cov-h">\n<h2 id="cov-h">覆盖矩阵</h2>\n'
      f'<p>{esc(DATA["matrix_note"])}</p>\n')
    for axis, spec in AXES.items():
        w(f'<div class="idx-table" data-allow-scroll tabindex="0" role="region" aria-label="{esc(spec["label"])} 覆盖">\n'
          f'<table>\n<caption>{esc(spec["label"])}<span> · 每格为该家族在此取值上的样张数；0 为未覆盖</span></caption>\n<thead><tr><th scope="col">家族</th>')
        for val in spec['values']:
            w(f'<th scope="col">{esc(val)}</th>')
        w('</tr></thead>\n<tbody>\n')
        for key, name in rows:
            w(f'<tr><th scope="row">{esc(name)}</th>')
            for val in spec['values']:
                n = counts[axis][key][val]
                w(f'<td class="{"zero" if not n else ""}">{n if n else "0"}</td>')
            w('</tr>\n')
        w('</tbody>\n</table>\n</div>\n')
    w('</section>\n')

    # gaps & invalid combos
    w('<section class="idx-gaps" aria-labelledby="gap-h">\n<h2 id="gap-h">未覆盖、合并与不成立的组合</h2>\n')
    w('<h3>跨家族缺口</h3>\n<ul>\n')
    for g in DATA.get('gaps', []):
        w(f'<li>{esc(g)}</li>\n')
    w('</ul>\n<h3>按原子记录的不成立组合</h3>\n<ul class="idx-invalid">\n')
    for s in SPECS:
        for inv in s.get('invalid', []):
            w(f'<li><a href="{esc(s["href"])}">{esc(s["id"])}</a> <code>{esc(inv["combo"])}</code> {esc(inv["reason"])}</li>\n')
    w('</ul>\n</section>\n')
    w('</main>\n<script src="shared/lab.js"></script>\n</body>\n</html>\n')
    return ''.join(out)


def render_catalog_md():
    out = ['# 样张清单（生成）\n',
           '由 `tools/catalog.py` 从 [specimens.json](specimens.json) 生成，勿手改。可视入口见 [index.html](index.html)。全部内容为 synthetic 实验样张，状态均未经采纳。\n']
    for s in SPECS:
        out.append(f"\n## {s['id']} · {s['name']}{' · ' + s['name_en'] if s.get('name_en') else ''}\n")
        out.append(f"- 层级：{s['level']}；家族：{s['family']}；位置：[{s['href']}]({s['href']})")
        out.append(f"- 职责：{s['job']}")
        if s.get('input_shape'):
            out.append(f"- 输入：{s['input_shape']}")
        if s.get('uses'):
            out.append(f"- 组合自：{', '.join(s['uses'])}")
        if s.get('use_when'):
            out.append(f"- 适用：{s['use_when']}")
        if s.get('avoid_when'):
            out.append(f"- 不适合：{s['avoid_when']}")
        if s.get('capacity'):
            out.append(f"- 容量：{s['capacity']}")
        if s.get('failure_modes'):
            out.append(f"- 已见失败：{'；'.join(s['failure_modes'])}")
        lin = s.get('lineage', {})
        borrowed = '；'.join(f"{b['ref']}（{b.get('scope', '')}；改动：{b.get('change', '')}）" for b in lin.get('borrowed', []))
        out.append(f"- 来路：{lin.get('origin', '')}{'；借用 ' + borrowed if borrowed else ''}")
        out.append(f"- 检查：{s.get('checked', '未检查')}")
        out.append('\n| 变体 | 名称 | 轴 | 状态 | 说明 |\n|---|---|---|---|---|')
        for v in s.get('variants', []):
            ax = ' '.join(f"{k}:{'/'.join(x) if isinstance(x, list) else x}" for k, x in v.get('axes', {}).items())
            note = v.get('note', '').replace('|', '\\|').replace('\n', ' ')
            out.append(f"| {v['id']} | {v['name']} | {ax} | {v['status']} | {note} |")
    return '\n'.join(out) + '\n'


def main():
    errors = validate()
    for e in errors:
        print('ERROR', e, file=sys.stderr)
    if '--check' in sys.argv:
        sys.exit(1 if errors else 0)
    (LAB / 'index.html').write_text(render_index())
    (LAB / 'catalog.md').write_text(render_catalog_md())
    print(f'wrote index.html, catalog.md; {len(errors)} validation errors', file=sys.stderr)
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
