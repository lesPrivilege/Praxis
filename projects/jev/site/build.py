#!/usr/bin/env python3
"""Build jev/site/index.html from src/page.html, src/data.json and the research ledger.

- Figures marked {{FIG:name}} are drawn here from data.json, so every number on the
  page has one home.
- Every <p class="src" data-src="IDs"></p> is filled with links to the public URLs of
  the sources behind those claim or source IDs; an unknown ID stops the build.
- {{SOURCE_LIST}} becomes the list of every source the page cites.

Usage: python3 jev/site/build.py
"""
import html
import json
import math
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent
RESEARCH = SITE.parent / 'research'
data = json.loads((SITE / 'src' / 'data.json').read_text())
ledger = json.loads((RESEARCH / 'sources.json').read_text())
sources = {s['id']: s for s in ledger['sources']}
claims = {}
for line in (RESEARCH / 'claims.jsonl').read_text().splitlines():
    c = json.loads(line)
    claims[c['id']] = c

# Display names for sources the page cites often; others use publisher and title.
NAMES = {
    'A-02': 'TypeSafe，Introducing System One Models & Jev',
    'D-04': 'Knowviq，Decision models compared',
    'D-02': 'Wu，SAG2（arXiv 2610.22588）',
    'D-06': 'Do Rosario 与 Atef，Jev-as-a-Judge（arXiv 2610.20634）',
    'B-25': 'Fastino，GLiNER2.5-Decide',
    'B-26': 'Shanghua-Gao，RSI-Jev',
    'B-32': 'Kotoba Labs，open-jev-deberta-v3-large',
    'B-18': 'Liquid AI，d1-3B 与 d1-omni-600M 模型卡',
    'B-22': 'Perplexity，pplx-decider-v1-27b 模型卡',
    'A-30': 'Decision Index（Hugging Face Space）',
    'B-01': 'Laya（NandhaKishorM/laya）',
    'B-06': 'Kev（jaredpalmer/kev）',
    'A-31': 'Kev（jaredpalmer/kev）',
    'B-24': 'Fastino，Introducing GLiDE',
}
esc = html.escape


def expand(ids):
    out = []
    for token in re.split(r'[,，\s]+', ids.strip()):
        rng = re.fullmatch(r'([A-E](?:-C)?)-(\d+)至([A-E](?:-C)?)-(\d+)', token)
        if rng:
            out += [f'{rng[1]}-{n:02d}' for n in range(int(rng[2]), int(rng[4]) + 1)]
        elif token:
            out.append(token)
    return out


# Several streams registered the same URL under their own IDs; show each URL once.
canonical = {}
for sid, s in sources.items():
    canonical.setdefault(s['url'].rstrip('/'), sid)


def source_of(i):
    if i in claims:
        i = claims[i]['source_id']
    if i not in sources:
        raise SystemExit(f'unknown ID on page: {i}')
    return canonical[sources[i]['url'].rstrip('/')]


def name(sid):
    s = sources[sid]
    if sid in NAMES:
        return NAMES[sid]
    who = s.get('author_or_publisher', '').split(';')[0]
    who = re.sub(r'\s*\(.*?\)|\s+-\s.*$|,.*$', '', who).strip()
    if len(who) > 28 or 'mirror' in who.lower():
        who = ''
    # Ledger titles carry reading notes such as "(GitHub repo + README)"; drop them for display.
    title = re.sub(r'\s*\((?:GitHub|HF|Hugging Face|abs|HTML|BenchLM|model card|introducing-)[^)]*\)', '', s['title'])
    title = re.sub(r'\s+and HF adapters$|\s*\+.*$', '', title).strip()
    return f'{who}，{title}' if who and who.lower() not in title.lower() else title


def link(sid):
    s = sources[sid]
    return f'<a href="{esc(s["url"])}">{esc(name(sid))}</a>'


cited = []


def fill_src(match):
    ids = expand(match.group(1))
    sids = []
    for i in ids:
        sid = source_of(i)
        if sid not in sids:
            sids.append(sid)
        if sid not in cited:
            cited.append(sid)
    return f'<p class="src" data-ids="{esc(match.group(1))}">来源：' + '；'.join(link(s) for s in sids) + '</p>'


# ---- figures -------------------------------------------------------------

def t(x, y, s, cls='', anchor='start'):
    return f'<text x="{x:.1f}" y="{y:.1f}" class="{cls}" text-anchor="{anchor}">{esc(s)}</text>'





def fig_ecosystem():
    e = data['ecosystem']
    lo, hi = math.log10(0.3), math.log10(35)
    x0, x1, label_w, row = 200, 640, 190, 22
    X = lambda b: x0 + (math.log10(b) - lo) / (hi - lo) * (x1 - x0)
    rows = []
    for lane in e['lanes']:
        rows.append(('lane', (lane['label'], lane['key'])))
        rows += [('pt', p) for p in e['points'] if p['lane'] == lane['key']]
        if e['range']['lane'] == lane['key']:
            rows.append(('range', e['range']))
        rows += [('und', p) for p in e['undisclosed'] if p['lane'] == lane['key']]
    top = 34
    h = top + len(rows) * row + 34
    out = [f'<svg viewBox="0 0 760 {h}" role="img" aria-labelledby="eco-t eco-d" class="chart">',
           '<title id="eco-t">开放与托管决策模型的规模</title>',
           '<desc id="eco-d">按实现路线分组，横轴为参数量（对数刻度，0.3B 到 35B）；实心点为开放权重，空心点为只有托管服务。</desc>']
    for b in (0.3, 1, 3, 10, 30):
        x = X(b)
        out.append(f'<line x1="{x:.1f}" x2="{x:.1f}" y1="{top - 8}" y2="{h - 30}" class="grid"/>')
        out.append(t(x, h - 12, f'{b:g}B', 'tick', 'middle'))
    out.append(t(700, top - 14, '规模未公开', 'tick', 'middle'))
    out.append(t((x0 + x1) / 2, top - 14, '参数量（对数刻度）', 'tick', 'middle'))
    out.append(f'<line x1="668" x2="668" y1="{top - 8}" y2="{h - 30}" class="rule"/>')
    y = top
    for kind, p in rows:
        cy = y + row / 2
        if kind == 'lane':
            out.append(t(0, cy + 4, p[0], 'lane'))
            out.append(f'<line x1="0" x2="760" y1="{y + row - 2}" y2="{y + row - 2}" class="rule"/>')
        elif kind == 'pt':
            x = X(p['b'])
            cls = 'dot fill-ink' if p['open'] else 'dot hollow stroke-ink'
            label = p['name'] + (f'（{p["note"]}）' if p.get('note') else '')
            out.append(t(14, cy + 4, label, 'name'))
            out.append(f'<circle cx="{x:.1f}" cy="{cy:.1f}" r="5" class="{cls}"><title>{esc(p["name"])}：约 {p["b"]:g}B</title></circle>')
        elif kind == 'range':
            out.append(t(14, cy + 4, p['name'], 'name'))
            out.append(f'<line x1="{X(p["from"]):.1f}" x2="{X(p["to"]):.1f}" y1="{cy:.1f}" y2="{cy:.1f}" class="band stroke-ink"/>')
        else:
            label = p['name'] + (f'（{p["note"]}）' if p.get('note') else '')
            out.append(t(14, cy + 4, label, 'name'))
            hue = 'blue' if p['name'] == 'Jev' else 'ink'
            out.append(f'<circle cx="700" cy="{cy:.1f}" r="5" class="dot hollow stroke-{hue}"/>')
        y += row
    out.append('</svg>')
    return '\n'.join(out)


def fig_knowviq():
    m = data['knowviq']['models']
    row, top = 30, 46
    h = top + len(m) * row + 30
    L = (130, 380, 0.95, 1.0)      # x from, x to, value from, value to
    R = (450, 740, 0, 25)
    X = lambda p, v: p[0] + (v - p[2]) / (p[3] - p[2]) * (p[1] - p[0])
    out = [f'<svg viewBox="0 0 760 {h}" role="img" aria-labelledby="kv-t kv-d" class="chart">',
           '<title id="kv-t">可回答性闸门：AUC 与 0.75 阈值下隐藏的好答案</title>',
           '<desc id="kv-d">五个模型的 AUC 在 0.979 到 0.984 之间；同一 0.75 阈值下隐藏的好答案从 6.2% 到 22.2%，Jev 最高。</desc>',
           t(L[0], 16, 'AUC（647 项）', 'head'), t(R[0], 16, '0.75 阈值下隐藏的好答案', 'head')]
    for v in (0.95, 0.975, 1.0):
        x = X(L, v)
        out += [f'<line x1="{x:.1f}" x2="{x:.1f}" y1="{top - 12}" y2="{h - 26}" class="grid"/>', t(x, h - 10, f'{v:g}', 'tick', 'middle')]
    for v in (0, 10, 20):
        x = X(R, v)
        out += [f'<line x1="{x:.1f}" x2="{x:.1f}" y1="{top - 12}" y2="{h - 26}" class="grid"/>', t(x, h - 10, f'{v}%', 'tick', 'middle')]
    for i, r in enumerate(m):
        cy = top + i * row
        hot = r['name'] == 'Jev'
        out.append(t(0, cy + 4, r['name'], 'name'))
        out.append(f'<circle cx="{X(L, r["auc"]):.1f}" cy="{cy}" r="5" class="dot"><title>{esc(r["name"])}：AUC {r["auc"]:.3f}</title></circle>')
        out.append(t(X(L, r['auc']) + 10, cy + 4, f'{r["auc"]:.3f}', 'val'))
        out.append(f'<line x1="{X(R, 0):.1f}" x2="{X(R, r["hidden"]):.1f}" y1="{cy}" y2="{cy}" class="{"stem hot" if hot else "stem"}"/>')
        out.append(f'<circle cx="{X(R, r["hidden"]):.1f}" cy="{cy}" r="5" class="{"dot hot" if hot else "dot"}"><title>{esc(r["name"])}：隐藏 {r["hidden"]}%</title></circle>')
        out.append(t(X(R, r['hidden']) + 10, cy + 4, f'{r["hidden"]}%', 'val hot' if hot else 'val'))
    out.append('</svg>')
    return '\n'.join(out)


def fig_judge():
    rows = data['judge']['rows']
    out = ['<svg viewBox="0 0 760 170" role="img" aria-labelledby="jd-t jd-d" class="chart">',
           '<title id="jd-t">Jev 与 GPT-6 Astra 在 495 条陈述上的对照</title>',
           '<desc id="jd-d">balanced accuracy 73.27 对 73.83，差异不显著；不受支持陈述被放行 23.23% 对 14.14%。</desc>']
    X = lambda v: 200 + v / 100 * 460
    y = 20
    for r in rows:
        out.append(t(0, y + 14, r['metric'], 'name'))
        for k, (who, v) in enumerate((('Jev', r['jev']), ('Astra', r['astra']))):
            yy = y + k * 22
            hue = 'blue' if who == 'Jev' else 'slate'
            out.append(f'<rect x="200" y="{yy}" width="{X(v) - 200:.1f}" height="14" rx="2" class="fill-{hue}"><title>{who} · {esc(r["metric"])}：{v:.2f}%</title></rect>')
            out.append(t(X(v) + 8, yy + 11, f'{who} {v:.2f}%', 'val'))
        out.append(t(200, y + 60, r['note'], 'note' if r['metric'] == 'balanced accuracy' else 'note risk'))
        y += 78
    out.append('</svg>')
    return '\n'.join(out)


def fig_sag2():
    s = data['sag2']
    X = lambda v: 160 + v / 100 * 540
    out = ['<svg viewBox="0 0 760 210" role="img" aria-labelledby="sg-t sg-d" class="chart stepper-fig">',
           '<title id="sg-t">SAG2 在 MuSiQue 上的消融</title>',
           '<desc id="sg-d">Recall@10：BM25 54.41；加 Jev 判断 67.93；按已选证据扩展一轮 83.36，两轮 86.62。同等判断次数的一次性 BM25 + Jev 为 69.82。</desc>']
    for v in (0, 50, 100):
        out += [f'<line x1="{X(v):.1f}" x2="{X(v):.1f}" y1="6" y2="170" class="grid"/>', t(X(v), 188, f'{v}', 'tick', 'middle')]
    for i, st in enumerate(s['steps']):
        y = 12 + i * 38
        out.append(f'<g class="step" data-step="{i}">')
        out.append(t(0, y + 15, st['label'], 'name'))
        hue = ('slate-2', 'blue-2', 'blue', 'blue-3')[i]
        out.append(f'<rect x="160" y="{y}" width="{X(st["v"]) - 160:.1f}" height="20" rx="2" class="fill-{hue}"><title>{esc(st["label"])}：{st["v"]:.2f}（{esc(st["note"])}）</title></rect>')
        out.append(t(X(st['v']) + 8, y + 15, f'{st["v"]:.2f}', 'val'))
        out.append('</g>')
    c = s['control']
    xc = X(c['v'])
    out.append(f'<g class="step" data-step="3"><line x1="{xc:.1f}" x2="{xc:.1f}" y1="4" y2="172" class="ref"/>')
    out.append(t(xc - 6, 204, f'{c["label"]} {c["v"]:.2f}', 'note', 'end') + '</g>')
    out.append('</svg>')
    return '\n'.join(out)


def fig_ece():
    rows = data['ece']['rows']
    Y = lambda v: 30 + (0.5 - v) / 0.5 * 170
    xa, xb = 300, 520
    out = ['<svg viewBox="0 0 760 240" role="img" aria-labelledby="ec-t ec-d" class="chart">',
           '<title id="ec-t">温度缩放前后的校准误差</title>',
           '<desc id="ec-d">Laya 英文 0.466 到 0.081；Laya 多语言 0.314 到 0.106；Kev-9B 在新来源上 0.103 到 0.041。</desc>',
           t(xa, 16, '发布版本', 'head', 'middle'), t(xb, 16, '温度缩放后', 'head', 'middle')]
    for v in (0, 0.25, 0.5):
        out += [f'<line x1="{xa - 40}" x2="{xb + 40}" y1="{Y(v):.1f}" y2="{Y(v):.1f}" class="grid"/>', t(xa - 50, Y(v) + 4, f'{v:g}', 'tick', 'end')]
    for r in rows:
        a, b = Y(r['before']), Y(r['after'])
        out.append(f'<line x1="{xa}" x2="{xb}" y1="{a:.1f}" y2="{b:.1f}" class="slope stroke-slate"/>')
        out += [f'<circle cx="{xa}" cy="{a:.1f}" r="5" class="dot fill-slate"/>', f'<circle cx="{xb}" cy="{b:.1f}" r="5" class="dot fill-blue"/>']
        out.append(t(xa - 14, a + 4, f'{r["name"]} {r["before"]:.3f}', 'val', 'end') if r['before'] > 0.2 else t(xa + 10, a - 6, f'{r["name"]} {r["before"]:.3f}', 'val'))
        out.append(t(xb + 12, b + 4 + (8 if r['name'].startswith('Laya 多') else 0) - (6 if r['name'].startswith('Kev') else 0), f'{r["after"]:.3f}', 'val'))
    out.append('</svg>')
    return '\n'.join(out)


def table_coverage():
    c = data['coverage']
    head = ''.join(f'<th scope="col">{esc(u)}</th>' for u in c['units'])
    body = []
    for b in c['benchmarks']:
        cells = ''.join(f'<td>{"●" if i in b["hits"] else ""}</td>' for i in range(len(c['units'])))
        body.append(f'<tr><th scope="row">{esc(b["name"])}</th>{cells}</tr>')
    counts = ''.join(f'<td>{sum(i in b["hits"] for b in c["benchmarks"])}</td>' for i in range(len(c['units'])))
    return (f'<table class="matrix"><thead><tr><th scope="col">公开数据</th>{head}</tr></thead>'
            f'<tbody>{"".join(body)}</tbody><tfoot><tr><th scope="row">覆盖的数据组数</th>{counts}</tr></tfoot></table>')


FIGS = {'ecosystem': fig_ecosystem, 'knowviq': fig_knowviq, 'judge': fig_judge,
        'sag2': fig_sag2, 'ece': fig_ece, 'coverage': table_coverage}

page = (SITE / 'src' / 'page.html').read_text()
LANE_NAME = {lane['key']: lane['label'] for lane in data['ecosystem']['lanes']}


def table(head, rows):
    th = ''.join(f'<th scope="col"{" class=\"num\"" if i else ""}>{esc(h)}</th>' for i, h in enumerate(head))
    tr = ''.join('<tr>' + ''.join(f'<td{" class=\"num\"" if i else ""}>{esc(str(c))}</td>' for i, c in enumerate(r)) + '</tr>' for r in rows)
    return f'<details class="data"><summary>数据表</summary><div class="scroll"><table><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div></details>'


def data_table(key):
    if key == 'ecosystem':
        e = data['ecosystem']
        rows = [(p['name'], LANE_NAME[p['lane']], f'约 {p["b"]:g}B', '开放' if p['open'] else '未开放或未写明') for p in e['points']]
        rows.append((e['range']['name'], LANE_NAME[e['range']['lane']], '随所接模型', '—'))
        rows += [(p['name'], LANE_NAME[p['lane']], '未公开', '未开放' if p['lane'] != 'extract' else '未开放（称即将开放）') for p in e['undisclosed']]
        return table(('实现', '路线', '参数量', '权重'), rows)
    if key == 'knowviq':
        return table(('模型', '可回答性 AUC', '0.75 阈值下隐藏的好答案'), [(m['name'], f'{m["auc"]:.3f}', f'{m["hidden"]}%') for m in data['knowviq']['models']])
    if key == 'judge':
        return table(('指标', 'Jev', 'GPT-6 Astra'), [(r['metric'], f'{r["jev"]:.2f}%', f'{r["astra"]:.2f}%') for r in data['judge']['rows']])
    if key == 'sag2':
        s2 = data['sag2']
        return table(('步骤', 'Recall@10'), [(st['label'], f'{st["v"]:.2f}') for st in s2['steps']] + [(s2['control']['label'], f'{s2["control"]["v"]:.2f}')])
    if key == 'ece':
        return table(('实现', '发布版本', '温度缩放后'), [(r['name'], f'{r["before"]:.3f}', f'{r["after"]:.3f}') for r in data['ece']['rows']])
    return ''


def place(m):
    out = FIGS[m.group(1)]()
    return out if out.startswith('<table') else f'<div class="chart-wrap">{out}</div>{data_table(m.group(1))}'


page = re.sub(r'\{\{FIG:(\w+)\}\}', place, page)
page = re.sub(r'<p class="src" data-src="([^"]+)"></p>', fill_src, page)
for key in ('ecosystem', 'knowviq', 'judge', 'sag2', 'ece', 'coverage'):
    for i in expand(data[key]['src']):
        sid = source_of(i)
        if sid not in cited:
            cited.append(sid)
items = []
for sid in sorted(cited, key=lambda s: (s[0], int(s.split('-')[-1]))):
    s = sources[sid]
    date = s.get('date', '')
    date = date[:10] if re.match(r'\d{4}-\d{2}', date) else ''
    items.append(f'<li><span class="sid">{sid}</span> {link(sid)}{"，" + date if date else ""}</li>')
page = page.replace('{{SOURCE_LIST}}', '<ol class="sources">' + ''.join(items) + '</ol>')
page = page.replace('{{SOURCE_COUNT}}', str(len(cited)))
assert '{{' not in page, re.findall(r'\{\{[^}]+\}\}', page)
(SITE / 'index.html').write_text(page)
print(f'index.html: {len(page):,} bytes, {len(cited)} sources cited')
