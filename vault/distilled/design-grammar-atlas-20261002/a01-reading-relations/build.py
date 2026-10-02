#!/usr/bin/env python3
"""Build the A01 specimen page: one fixture, one DOM, five stylesheets.

Reads fixture.json, variants.json and specimen.css; writes a single offline index.html and
checks/content-report.json (every specimen must carry the fixture text unchanged).
"""
import html
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
fx = json.loads((HERE / 'fixture.json').read_text())
meta = json.loads((HERE / 'variants.json').read_text())
esc = html.escape


def minutes(clock):
    h, m = clock.split(':')
    return int(h) * 60 + int(m)


for c in fx['conditions'].values():
    assert ''.join(c['title_phrases']) == c['title'], c['title']
starts = [minutes(item['at']) for item in fx['programme']]
spans = [b - a for a, b in zip(starts, starts[1:] + [minutes(fx['hours']['end'])])]


def specimen(variant, cond):
    c, lab, d, h = fx['conditions'][cond], fx['labels'], fx['date'], fx['hours']
    cols = ' '.join(f'minmax(0,{n}fr)' for n in spans)
    items = ''.join(
        f'<li style="--min:{n}"><time>{esc(i["at"])}</time> <span>{esc(i["what"])}</span></li>'
        for i, n in zip(fx['programme'], spans))
    return (
        f'<article class="sp {variant["class"]}">'
        f'<h3 class="t">{"<wbr>".join(esc(p) for p in c["title_phrases"])}</h3>'
        f'<p class="lede">{esc(c["lede"])}</p>'
        '<dl class="facts">'
        f'<div class="f time"><dt>{esc(lab["time"])}</dt><dd><time datetime="{d["iso"]}T{h["start"]}">'
        f'<span class="y">{esc(d["year"])}</span><span class="d">{esc(d["day"])}</span> '
        f'<span class="h">{esc(h["start"])}–{esc(h["end"])}</span></time></dd></div>'
        f'<div class="f place"><dt>{esc(lab["place"])}</dt><dd>{esc(fx["place"])}</dd></div>'
        f'<div class="f prog"><dt>{esc(lab["programme"])}</dt><dd><ol style="--cols:{cols}">{items}</ol></dd></div>'
        f'<div class="f join"><dt>{esc(lab["join"])}</dt><dd><strong class="act">{esc(fx["join"]["action"])}</strong>'
        f'<span class="rest">{esc(fx["join"]["rest"])}</span></dd></div>'
        '</dl></article>')


def expected(cond):
    c, lab, d, h = fx['conditions'][cond], fx['labels'], fx['date'], fx['hours']
    parts = [c['title'], c['lede'], lab['time'], f'{d["year"]}{d["day"]} {h["start"]}–{h["end"]}', lab['place'], fx['place'],
             lab['programme'], *[f'{i["at"]} {i["what"]}' for i in fx['programme']],
             lab['join'], fx['join']['action'] + fx['join']['rest']]
    return ''.join(parts).replace(' ', '')


def text_of(markup):
    return html.unescape(re.sub(r'<[^>]+>', '', markup)).replace(' ', '')


report, sections = [], []
for v in meta['variants']:
    stages = []
    for cond in ('short', 'long'):
        markup = specimen(v, cond)
        sid = f'{v["id"]}-{cond}'
        report.append({'id': sid, 'content_intact': text_of(markup) == expected(cond)})
        stages.append(f'<div><p class="cap">{esc(fx["conditions"][cond]["name"])}</p>'
                      f'<div class="stage" id="{sid}" data-check-root>{markup}</div></div>')
    sections.append(
        f'<section class="variant" id="{v["id"]}"><h2>{esc(v["name"])}</h2><p class="rel">{esc(v["relation"])}</p>'
        f'<div class="pair">{"".join(stages)}</div>'
        f'<details><summary>来路与自由选择</summary><p>{esc(v["borrowed"])}</p><p>{esc(v["free"])}</p></details></section>')

rows = ''.join(
    f'<tr><th scope="row">{esc(v["name"])}</th><td data-h="先读到">{esc(v["first"])}</td>'
    f'<td data-h="加长或变窄后">{esc(v["stress"])}</td><td data-h="处置">{esc(v["verdict"])}</td></tr>'
    for v in meta['variants'])
page = f'''<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(meta["title"])}</title>
<style>
{(HERE / "specimen.css").read_text()}</style>
</head>
<body>
<div class="page">
<header>
<h1>{esc(meta["title"])}</h1>
<p class="lead">{esc(meta["lead"])}</p>
<p class="meta">{esc(meta["meta"])}</p>
</header>
{"".join(sections)}
<section class="notes" id="notes">
<h2>看图后的记录</h2>
<table>
<thead><tr><th scope="col">变体</th><th scope="col">先读到</th><th scope="col">加长或变窄后</th><th scope="col">处置</th></tr></thead>
<tbody>{rows}</tbody>
</table>
{"".join(f"<p>{esc(p)}</p>" for p in meta["notes"])}
</section>
</div>
</body>
</html>
'''
(HERE / 'index.html').write_text(page)
(HERE / 'checks').mkdir(exist_ok=True)
(HERE / 'checks' / 'content-report.json').write_text(json.dumps(
    {'fixture': fx['id'], 'segment_minutes': spans, 'specimens': report}, ensure_ascii=False, indent=1) + '\n')
failed = [r['id'] for r in report if not r['content_intact']]
print(f'{len(report)} specimens, segment minutes {spans}, content mismatches: {failed or "none"}')
raise SystemExit(1 if failed else 0)
