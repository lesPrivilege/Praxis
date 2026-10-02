#!/usr/bin/env python3
"""Build index.html: one source text shown as a pure projection and as an adaptation, plus the owner map.

The projection re-renders three sections of the work-order-2 receipt without changing a word; this script
checks that. The adaptation (slides.json) cuts and reorders; the script checks that every fragment it claims
to carry exists in the source, and writes both results to checks/content-report.json.
"""
import html
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
SOURCE = ROOT / 'docs/verification/design-kit-wo2-20261002.md'
START, END = '## 结果', '## 改了什么'
esc = html.escape


def source_block():
    text = SOURCE.read_text()
    a, b = text.index(START), text.index(END)
    return text[a:b].strip()


def inline(s):
    s = esc(s)
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)          # links keep their text; the page is a specimen
    return re.sub(r'`([^`]+)`', r'<code>\1</code>', s)


def plain(s):
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)
    return re.sub(r'[`\s]', '', s)


def render(md):
    out, lines, i = [], md.split('\n'), 0
    while i < len(lines):
        ln = lines[i]
        if not ln.strip():
            i += 1
        elif ln.startswith('## '):
            out.append(f'<h3>{inline(ln[3:])}</h3>'); i += 1
        elif ln.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append([c.strip() for c in lines[i].strip('|').split('|')]); i += 1
            head, body = rows[0], rows[2:]
            out.append('<table><thead><tr>' + ''.join(f'<th>{inline(c)}</th>' for c in head) + '</tr></thead><tbody>'
                       + ''.join('<tr>' + ''.join(f'<td data-h="{esc(h)}">{inline(c)}</td>' for h, c in zip(head, r)) + '</tr>'
                                 for r in body) + '</tbody></table>')
        elif ln.startswith('- '):
            items = []
            while i < len(lines) and lines[i].startswith('- '):
                items.append(lines[i][2:]); i += 1
            out.append('<ul>' + ''.join(f'<li>{inline(x)}</li>' for x in items) + '</ul>')
        else:
            out.append(f'<p>{inline(ln)}</p>'); i += 1
    return '\n'.join(out)


def text_of(fragment):
    return re.sub(r'\s', '', html.unescape(re.sub(r'<[^>]+>', '', fragment)))


src = source_block()
projection = render(src)

# --- check 1: the projection carries every word of the source, in order -------------------------
want = ''.join(plain(re.sub(r'^(## |- )', '', ln)) for ln in src.split('\n')
               if ln.strip() and not re.fullmatch(r'\|[-| ]+\|', ln.strip())).replace('|', '')
got = text_of(projection)
projection_ok = want == got

# --- check 2: every fragment the slides claim to carry is in the source --------------------------
deck = json.loads((HERE / 'slides.json').read_text())
src_plain = plain(src)
missing = [(n + 1, f) for n, s in enumerate(deck['slides']) for f in s['source'] if plain(f) not in src_plain]
slide_chars = sum(len(plain(s['title'])) + sum(len(plain(b)) for b in s.get('body', []))
                  + sum(len(plain(c)) for r in s.get('table', {}).get('rows', []) for c in r) for s in deck['slides'])
changes = json.loads((HERE / 'changes.json').read_text())['rows']

report = {
    'source': {'path': str(SOURCE.relative_to(ROOT)), 'from': START, 'until': END, 'chars': len(want)},
    'projection': {'chars': len(got), 'identical_text': projection_ok},
    'adaptation': {'slides': len(deck['slides']), 'chars': slide_chars,
                   'share_of_source': round(slide_chars / len(want), 2),
                   'claimed_fragments': sum(len(s['source']) for s in deck['slides']),
                   'fragments_not_in_source': missing},
    'change_note_rows': len(changes),
}
(HERE / 'checks').mkdir(exist_ok=True)
(HERE / 'checks/content-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
assert projection_ok, 'projection text differs from source'
assert not missing, missing


def slide(n, s):
    if 'table' in s:
        t = s['table']
        body = ('<table><thead><tr>' + ''.join(f'<th>{esc(c)}</th>' for c in t['head']) + '</tr></thead><tbody>'
                + ''.join('<tr>' + ''.join(f'<td>{esc(c)}</td>' for c in r) + '</tr>' for r in t['rows']) + '</tbody></table>')
    else:
        body = '<ul>' + ''.join(f'<li>{esc(b)}</li>' for b in s['body']) + '</ul>'
    return f'<li class="slide"><div class="frame"><p class="no">{n}</p><h4>{esc(s["title"])}</h4>{body}</div></li>'


slides = '\n'.join(slide(n + 1, s) for n, s in enumerate(deck['slides']))
change_rows = '\n'.join(
    f'<tr class="k-{ {"保留": "keep", "删去": "cut", "压缩": "cut", "挪动": "move", "新增": "add"}[r["kind"]] }">'
    f'<th>{esc(r["kind"])}</th><td data-h="内容">{esc(r["what"])}</td><td data-h="理由与代价">{esc(r["why"])}</td></tr>'
    for r in changes)

# --- owner map and routes -------------------------------------------------------------------------
owners = json.loads((HERE / 'owners.json').read_text())
cols = [b for g in owners['groups'] for b in g['branches']]
group_head = ''.join(f'<th colspan="{len(g["branches"])}" class="g">{esc(g["name"])}<span>{esc(g["decides"])}</span></th>'
                     for g in owners['groups'])
branch_head = ''.join(f'<th class="b">{esc(b["name"])}</th>' for b in cols)
MARK = {'use': ('●', '取用'), 'maybe': ('○', '按需'), '': ('', '')}


def route_row(r):
    cells = ''
    for b in cols:
        m = r['marks'].get(b['id'], '')
        sym, word = MARK[m]
        note = r.get('notes', {}).get(b['id'], '')
        label = f'{b["name"]}：{word}' + (f'（{note}）' if note else '')
        cells += (f'<td class="m {m}" data-h="{esc(label)}"><span aria-hidden="true">{sym}</span>'
                  f'<span class="sr">{esc(label) if m else ""}</span></td>')
    return f'<tr><th>{esc(r["task"])}</th>{cells}</tr>'


routes = '\n'.join(route_row(r) for r in owners['routes'])
owns_rows = '\n'.join(f'<tr><th>{esc(b["name"])}</th><td data-h="维护什么">{esc(b["owns"])}</td>'
                      f'<td data-h="在哪里"><code>{esc(b["path"])}</code></td></tr>' for b in cols)
feedback = '\n'.join(f'<tr><th>{esc(f["when"])}</th><td data-h="回到">{esc(f["back_to"])}</td></tr>' for f in owners['feedback'])

page = f'''<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>同一份内容：投影与改编 · 表达能力的归属</title>
<style>
{(HERE / 'page.css').read_text()}
</style>
</head>
<body>
<div class="page">
<header>
<h1>同一份内容：投影与改编</h1>
<p class="lead">左边把一份回执的三节原样重排成一页，一个字没有动。右边把同样三节改成五分钟现场汇报的五页，删了、挪了、压缩了。前者可以说“内容没有变”，后者不可以，所以附一张变动表。</p>
<p class="meta">原稿是 2026-10-02 工单二回执的“结果”“这一轮支持什么，不支持什么”“失败与观察”三节，共 {len(want)} 字（不计空白）。改编后五页共 {slide_chars} 字，约为原稿的 {round(slide_chars / len(want) * 100)}%。</p>
</header>

<section class="pair" id="pair" aria-label="投影与改编">
<article class="proj">
<p class="cap">投影 · 一页 · 文字与原稿逐字相同</p>
<div class="sheet">
{projection}
</div>
</article>
<article class="adapt">
<p class="cap">改编 · 五页现场幻灯片 · {esc(deck["audience"])}</p>
<ol class="deck">
{slides}
</ol>
</article>
</section>

<section class="notes" id="changes">
<h2>改编的变动</h2>
<p>投影不需要这张表。改编需要：它说明哪些话还在、哪些不在了、谁因此看不到什么。</p>
<table>
<thead><tr><th>处理</th><th>内容</th><th>理由与代价</th></tr></thead>
<tbody>
{change_rows}
</tbody>
</table>
<p class="meta">{esc(deck["slides"][-1]["added"])}</p>
</section>

<section class="notes" id="owners">
<h2>谁维护哪一类决定</h2>
<p>三个入口按所作的决定分工，任务只取用得着的分支。下表每一行是一个任务，实心点是要读的分支，空心点是碰到问题才读的分支，空格是不加载。</p>
<div class="scroll">
<table class="map">
<thead>
<tr><th rowspan="2" class="corner">任务</th>{group_head}</tr>
<tr>{branch_head}</tr>
</thead>
<tbody>
{routes}
</tbody>
</table>
</div>
<p class="meta">英文改写只取成文里的审阅方法，中文约定不适用；改成幻灯片按改编处理，附变动说明；图表任务回到底线只为核对数据口径。点的位置是入口调整后预期的取用路线，不是实测结果。</p>

<h3>做到一半要回头的情况</h3>
<p>四个分支不是一条流水线。编排、图形或运动改变了意义时，回到受影响的那一支重新判断。</p>
<table class="fb">
<thead><tr><th>出现什么</th><th>回到哪里</th></tr></thead>
<tbody>
{feedback}
</tbody>
</table>

<h3>各分支维护什么</h3>
<table class="own">
<thead><tr><th>分支</th><th>维护什么</th><th>在哪里</th></tr></thead>
<tbody>
{owns_rows}
</tbody>
</table>
</section>

<footer class="meta">
<p>本页是样张，不是规范。原稿与页面文字的逐字比对、改编里每个片段是否出自原稿，由 build.py 检查，结果在 checks/content-report.json。单文件，不加载远端资源，不需要脚本。</p>
</footer>
</div>
</body>
</html>
'''
(HERE / 'index.html').write_text(page)
print(json.dumps(report, ensure_ascii=False))
