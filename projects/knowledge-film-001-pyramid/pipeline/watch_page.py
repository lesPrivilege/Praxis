"""Build out/watch.html: the film with captions, chapters, the script and its sources on one page.
Reads script/timeline.json and research/dossier.md; the page refers to the video and captions beside it.

  python3 pipeline/watch_page.py
"""
import html, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / 'script' / 'timeline.json').read_text())
esc = html.escape


def mmss(t):
    return f'{int(t // 60)}:{int(t % 60):02d}'


def table_rows(md, heading):
    """Rows of the first Markdown table under a heading."""
    body = md.split(heading, 1)[1]
    rows = []
    for line in body.splitlines():
        if line.startswith('## ') and rows: break
        if line.startswith('|') and not re.match(r'\|\s*-', line):
            rows.append([c.strip() for c in line.strip().strip('|').split('|')])
    return rows[1:]


def inline(s):
    s = esc(s)
    s = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', s)
    return s


def main():
    chapters = TL['chapters'] + [{'t': TL['duration']}]
    script = []
    for a, b in zip(chapters[:-1], chapters[1:]):
        segs = [s for s in TL['segments'] if s.get('text') and a['t'] <= s['start'] < b['t']]
        paras = ''.join(f'<p><button data-t="{s["start"]:.2f}">{mmss(s["start"])}</button>{esc(s["text"])}</p>' for s in segs)
        script.append(f'<section><h3>{esc(a["title"])}</h3>{paras}</section>')
    nav = ''.join(f'<li><button data-t="{c["t"]:.2f}"><b>{mmss(c["t"])}</b>{esc(c["title"])}</button></li>' for c in TL['chapters'])

    md = (ROOT / 'research' / 'dossier.md').read_text()
    src = ''.join(f'<tr><td>{inline(r[1])}</td><td>{inline(r[2])}</td><td>{inline(r[3])}</td></tr>' for r in table_rows(md, '## 片中用到的事实'))
    cut = ''.join(f'<tr><td>{inline(r[0])}</td><td>{inline(r[1])}</td><td>{inline(r[2])}</td></tr>' for r in table_rows(md, '## 研究里有、片中没用或改掉的'))

    page = f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>金字塔原理｜写不清楚，是因为还没想完</title>
<style>
:root {{ --paper:#f4f6f9; --ink:#0d1826; --ink2:#3a4658; --ink3:#6f7d90; --rule:#cfd6e0; --blue:#1f4fe0; }}
* {{ box-sizing: border-box; margin: 0; }}
body {{ background: var(--paper); color: var(--ink); font: 17px/1.75 "PingFang SC", "Helvetica Neue", sans-serif; -webkit-font-smoothing: antialiased; }}
main {{ max-width: 1120px; margin: 0 auto; padding: 40px 24px 96px; }}
header h1 {{ font: 900 44px/1.2 "Songti SC", serif; letter-spacing: .02em; }}
header p {{ color: var(--ink2); margin-top: 8px; font-size: 19px; }}
video {{ display: block; width: 100%; aspect-ratio: 16/9; background: #05080d; margin: 28px 0 14px; }}
.chapters {{ list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 10px; }}
button {{ font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }}
.chapters button {{ border: 1px solid var(--rule); border-radius: 4px; padding: 5px 12px 6px; background: #fff; }}
.chapters button:hover, .chapters button:focus-visible {{ border-color: var(--blue); outline: none; }}
.chapters b {{ font: 600 14px/1 "Avenir Next", sans-serif; color: var(--blue); margin-right: 8px; font-variant-numeric: tabular-nums; }}
h2 {{ font: 900 28px/1.3 "Songti SC", serif; margin: 64px 0 6px; padding-top: 22px; border-top: 2px solid var(--ink); }}
h2 + p {{ color: var(--ink2); margin-bottom: 18px; max-width: 46em; }}
h3 {{ font: 700 20px/1.4 "Songti SC", serif; margin: 30px 0 8px; }}
.script p {{ max-width: 44em; display: grid; grid-template-columns: 52px 1fr; gap: 0 10px; margin: 2px 0; }}
.script p button {{ font: 500 13px/2.3 "Avenir Next", sans-serif; color: var(--ink3); text-align: left; font-variant-numeric: tabular-nums; }}
.script p button:hover {{ color: var(--blue); }}
.script p.on {{ color: var(--blue); }}
table {{ width: 100%; border-collapse: collapse; font-size: 15px; line-height: 1.6; }}
th, td {{ text-align: left; vertical-align: top; padding: 10px 14px 10px 0; border-bottom: 1px solid var(--rule); }}
th {{ font-weight: 600; color: var(--ink3); font-size: 13px; letter-spacing: .08em; }}
td:first-child {{ width: 34%; }} td:last-child {{ width: 20%; color: var(--ink2); }}
.notes li {{ margin: 6px 0 6px 1.2em; max-width: 46em; }}
footer {{ margin-top: 64px; color: var(--ink3); font-size: 14px; }}
@media (max-width: 640px) {{ header h1 {{ font-size: 32px; }} td:first-child, td:last-child {{ width: auto; }} table, tbody, tr, td {{ display: block; }} thead {{ display: none; }} td {{ border: 0; padding: 2px 0; }} tr {{ border-bottom: 1px solid var(--rule); padding: 10px 0; }} }}
@media print {{ video, .chapters, .script p button {{ display: none; }} .script p {{ display: block; }} body {{ background: #fff; }} }}
</style>
</head>
<body>
<main>
<header>
<h1>金字塔原理</h1>
<p>写不清楚，是因为还没想完 · {mmss(TL['duration'])}</p>
</header>
<video controls preload="metadata" poster="poster.png">
<source src="pyramid-principle.mp4" type="video/mp4">
<track kind="captions" srclang="zh" label="中文" src="captions.vtt" default>
</video>
<ol class="chapters">{nav}</ol>

<h2>文稿</h2>
<p>旁白全文。点时间可以跳到那一句。</p>
<div class="script">{''.join(script)}</div>

<h2>出处</h2>
<p>片中每一条事实的来源和核对方式。“主会话亲核”是写稿的会话自己打开原件读到的；“代理核查”是只由研究代理读过的。</p>
<table><thead><tr><th>片中说法</th><th>来源与定位</th><th>核对</th></tr></thead><tbody>{src}</tbody></table>

<h2>没有采用的说法</h2>
<p>研究里出现过、核对后没有进片子或改了写法的。</p>
<table><thead><tr><th>原先的说法</th><th>处理</th><th>原因</th></tr></thead><tbody>{cut}</tbody></table>

<h2>制作说明</h2>
<ul class="notes">
<li>第二章的公司、数字和材料全部是合成的。</li>
<li>旁白是合成语音（{esc(TL.get('voice', ''))}），配乐和音效由程序合成。</li>
<li>画面由代码逐帧生成，时间跟着旁白走。</li>
<li>没有使用明托本人的照片；哥伦比亚号一段只用文字和重排的幻灯片文字。</li>
</ul>
<footer>Praxis Knowledge Film 001 · 2026-10-04</footer>
</main>
<script>
const v = document.querySelector('video');
document.addEventListener('click', e => {{
  const b = e.target.closest('button[data-t]');
  if (b) {{ v.currentTime = parseFloat(b.dataset.t); v.play(); v.scrollIntoView({{ block: 'nearest' }}); }}
}});
const lines = [...document.querySelectorAll('.script p')].map(p => [parseFloat(p.querySelector('button').dataset.t), p]);
v.addEventListener('timeupdate', () => {{
  let cur = null;
  for (const [t, p] of lines) {{ if (t <= v.currentTime + 0.05) cur = p; p.classList.remove('on'); }}
  if (cur) cur.classList.add('on');
}});
</script>
</body>
</html>
'''
    (ROOT / 'out' / 'watch.html').write_text(page)
    print(ROOT / 'out' / 'watch.html')


if __name__ == '__main__':
    main()
