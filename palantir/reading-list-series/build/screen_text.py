"""Inventory of every piece of text that becomes visible on screen, for the review of structural text.

  python3 build/screen_text.py ep01         writes verification/screen-text-ep01.md and .json
  options: --step S (sampling interval in seconds, default 0.5)

A text block is the smallest element whose children are only inline tags; text split into single
characters for animation is read back as one string. For each distinct string the tool records the
scene, the element's classes, the largest font size it was shown at, when it was first and last
seen, the narration segment being spoken at first sight, and the claim IDs it carries.
Adapted from demos/role-baseline-film/build/screen_text.py.
"""
import argparse, json, re, sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).parent))
from common import ROOT, open_page, seg_at, timeline

NUM = re.compile(r'[\d.,%+\- ×倍折]+')

JS = r"""
() => {
  const INLINE = new Set(['SPAN', 'B', 'I', 'EM', 'STRONG', 'BR', 'SMALL', 'SUP', 'SUB', 'TSPAN']);
  const out = [];
  const visible = (el) => {
    let a = 1;
    const r0 = el.getBoundingClientRect();
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none') return 0;
      a *= parseFloat(cs.opacity);
      if (a < 0.25) return 0;
      if (e !== el && cs.overflow !== 'visible') {      // masked lines: outside the clip box means not shown
        const c = e.getBoundingClientRect();
        if (r0.bottom - c.top < r0.height * 0.5 || c.bottom - r0.top < r0.height * 0.5 || r0.right < c.left || r0.left > c.right) return 0;
      }
    }
    return a;
  };
  const isBlock = (el) => [...el.children].every((c) => INLINE.has(c.tagName) && [...c.querySelectorAll('*')].every((d) => INLINE.has(d.tagName)));
  // Text of a block as it is shown now: parts of it are often revealed one by one, so each text node is tested on its own.
  // Its size is the smallest font among the shown parts (a block's own size is often not the size of its spans).
  const shown = (el) => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let text = '', px = Infinity;
    for (let n = w.nextNode(); n; n = w.nextNode()) if (n.nodeValue.trim() && visible(n.parentElement)) {
      text += n.nodeValue; px = Math.min(px, parseFloat(getComputedStyle(n.parentElement).fontSize));
    }
    return { text: text.replace(/\s+/g, ' ').trim(), px };
  };
  const walk = (el, scene) => {
    if (el.classList && el.classList.contains('scene')) scene = el.dataset.scene || el.id || scene;
    if (!(el.textContent || '').trim()) return;
    if (el.tagName === 'text' || (el.children.length === 0) || isBlock(el)) {
      if (INLINE.has(el.tagName) && el.parentElement && isBlock(el.parentElement)) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight) return;
      const { text, px } = shown(el);
      if (!text) return;
      const tagged = el.closest('[data-claim]');
      out.push({ scene, cls: (el.getAttribute('class') || el.tagName.toLowerCase()), text, px: Math.round(px * (r.height / (el.offsetHeight || r.height) || 1)),
                 x: Math.round(r.left), y: Math.round(r.top), claim: tagged ? tagged.dataset.claim : '' });
      return;
    }
    for (const c of el.children) walk(c, scene);
  };
  walk(Film.stage, '');
  return out;
}
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('assembly')
    ap.add_argument('--step', type=float, default=0.5)
    a = ap.parse_args()
    tl = timeline(a.assembly)
    seen = {}
    with sync_playwright() as pw:
        browser, page = open_page(pw, a.assembly)
        t = 0.0
        while t < tl['duration']:
            page.evaluate('t => Film.seek(t)', t)
            for b in page.evaluate(JS):
                k = (b['scene'], b['cls'], b['text'])
                e = seen.setdefault(k, {**b, 'first': t, 'last': t, 'at': seg_at(tl, t)})
                e['last'] = t
                e['px'] = max(e['px'], b['px'])
            t += a.step
        browser.close()

    # running counters leave one entry per sampled value: keep the last value shown by each element class
    last = {}
    for k, e in seen.items():
        if NUM.fullmatch(e['text']):
            j = (e['scene'], e['cls'], e['x'] // 40, e['y'] // 40)
            if j not in last or e['last'] > seen[last[j]]['last']:
                last[j] = k
    keep = set(last.values())
    rows = sorted((e for k, e in seen.items() if not NUM.fullmatch(e['text']) or k in keep), key=lambda e: (e['first'], e['y'], e['x']))
    (ROOT / 'verification' / f'screen-text-{a.assembly}.json').write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    md = [f'# 画面文字清单 · {a.assembly}', '', f'由 `build/screen_text.py` 生成，每 {a.step} 秒取样一次。共 {len(rows)} 条。', '',
          '| 首次出现 | 末次 | 旁白段 | 位置类别（class） | 字号 | 主张 | 文字 |', '|---|---|---|---|---|---|---|']
    for e in rows:
        md.append(f"| {e['first']:.1f}s | {e['last']:.1f}s | {e['at']} | {e['cls']} | {e['px']} | {e['claim']} | {e['text'].replace('|', '｜')} |")
    md += ['', '返回 [验收记录](README.md)。', '']
    (ROOT / 'verification' / f'screen-text-{a.assembly}.md').write_text('\n'.join(md))
    print(len(rows), 'text blocks')


if __name__ == '__main__':
    main()
