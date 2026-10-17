#!/usr/bin/env python3
"""Inline src/, the vendored ELK bundle and samples/ into one offline HTML file."""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / 'src'
OUT = HERE / 'equity-chart.html'


def inline(match):
    kind, rel = match.group(1), match.group(2)
    path = (SRC / rel).resolve()
    if kind == 'inline-json':
        samples = {p.stem: json.loads(p.read_text()) for p in sorted(path.glob('*.json'))}
        text = json.dumps(samples, ensure_ascii=False, separators=(',', ':'))
    else:
        text = path.read_text()
    # Keep inlined code from closing the surrounding <script>/<style> element.
    return text.replace('</script', '<\\/script').replace('</style', '<\\/style')


html = re.sub(r'/\*@(inline|inline-json) ([^*]+?)\*/', inline, (SRC / 'index.html').read_text())
OUT.write_text(html)
print(f'{OUT.relative_to(HERE)}: {len(html.encode()) / 1024:.0f} KB')
