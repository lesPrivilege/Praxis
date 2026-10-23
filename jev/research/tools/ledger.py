#!/usr/bin/env python3
"""Merge the stream ledgers into sources.json and claims.jsonl, then check that
every source or claim ID cited in the draft and the site exists.

Usage: python3 jev/research/tools/ledger.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]          # jev/
RESEARCH = ROOT / 'research'
STREAMS = sorted((RESEARCH / 'streams').glob('*.json'))
REVIEW = RESEARCH / 'review.json'                    # main-session adjudications

review = json.loads(REVIEW.read_text()) if REVIEW.exists() else {}
sources, claims, discrepancies, gaps = [], [], [], []
for path in STREAMS:
    data = json.loads(path.read_text())
    stream = data['stream']
    for s in data['sources']:
        sources.append({'stream': stream, **s})
    for c in data['claims']:
        row = {'stream': stream, **c}
        if c['id'] in review:
            row['review'] = review[c['id']]
        claims.append(row)
    for d in data['gpt_discrepancies']:
        discrepancies.append({'stream': stream, **d})
    gaps += [{'stream': stream, 'gap': g} for g in data['gaps']]

(RESEARCH / 'sources.json').write_text(json.dumps(
    {'as_of': '2026-10-23', 'sources': sources, 'gpt_discrepancies': discrepancies, 'gaps': gaps},
    ensure_ascii=False, indent=1) + '\n')
(RESEARCH / 'claims.jsonl').write_text(
    ''.join(json.dumps(c, ensure_ascii=False) + '\n' for c in claims))

known = {s['id'] for s in sources} | {c['id'] for c in claims}
cited, missing = set(), []
targets = list((ROOT / 'draft').glob('*.md')) + list((ROOT / 'site').glob('*.html'))
for path in targets:
    text = path.read_text()
    for group in re.findall(r'〔([^〕]*)〕', text) + re.findall(r'data-src="([^"]*)"', text):
        for token in re.split(r'[,，;；\s]+', group):
            rng = re.fullmatch(r'([A-E](?:-C)?)-(\d+)至([A-E](?:-C)?)-(\d+)', token)
            ids = [f'{rng[1]}-{n:02d}' for n in range(int(rng[2]), int(rng[4]) + 1)] if rng else [token]
            for i in ids:
                if re.fullmatch(r'[A-E](?:-C)?-\d+', i):
                    cited.add(i)
                    if i not in known:
                        missing.append(f'{path.relative_to(ROOT)}: {i}')
print(f'{len(sources)} sources, {len(claims)} claims, {len(cited)} cited IDs, {len(review)} reviewed')
for m in missing:
    print('missing', m)
raise SystemExit(1 if missing else 0)
