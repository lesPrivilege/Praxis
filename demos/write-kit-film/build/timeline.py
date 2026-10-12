"""Scene clock for the silent film: script/beats.json → film/timeline.js and out/timeline.json.

There is no narration to follow, so every time in film/scenes.js is a number of seconds after the
start of its scene, T('floor', 3.5). Change a scene's `dur` here and everything after it moves.

  python3 build/timeline.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
beats = json.loads((ROOT / 'script' / 'beats.json').read_text())

t, segs, chapters = 0.0, [], []
for s in beats['scenes']:
    segs.append({'id': s['id'], 'start': round(t, 3), 'end': round(t + s['dur'], 3), 'plain': '', 'text': '', 'words': []})
    if s['chapter']:
        chapters.append({'id': s['id'], 't': round(t, 3), 'title': ' '.join(s['chapter'])})
    t += s['dur']
tl = {'duration': round(t, 3), 'segments': segs, 'chapters': [{'id': 'open', 't': 0, 'title': '开场'}] + chapters}
(ROOT / 'film' / 'timeline.js').write_text('window.TIMELINE = ' + json.dumps(tl, ensure_ascii=False) + ';\n')
(ROOT / 'out' / 'timeline.json').write_text(json.dumps(tl, ensure_ascii=False, indent=1))
print(f"{len(segs)} scenes, {t:.0f} s")
