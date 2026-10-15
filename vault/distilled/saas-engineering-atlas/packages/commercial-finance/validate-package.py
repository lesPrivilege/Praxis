#!/usr/bin/env python3
"""Package metadata cross-check; complements shared schema validation, not factual review."""
import json,re
from pathlib import Path
from collections import Counter
p=Path(__file__).resolve().parent
root=p.parents[4]
e=json.loads((p/'evidence.json').read_text())
catalog=json.loads((root/'vault/provenance/saas-engineering-atlas/catalog.json').read_text())
sources={s['id']:s for s in catalog['sources']}
local={s['id']:s for s in e['sources']}
assert len(local)==len(e['sources'])
assert len({s['url'] for s in e['sources']})==len(e['sources'])
sources.update(local)
claims={c['id']:c for c in e['claims']}
assert len(claims)==len(e['claims'])
legacy={c['claim_id']:s['id'] for s in catalog['sources'] for c in s['supported_claims']}
reviews={r['source_id']:r for r in e['reviews']}
assert len(reviews)==len(e['reviews'])
for cid,c in claims.items():
 assert c['case_id'] in ['H01','H02','H03','V12','V13','V14','X02']
 assert set(c['source_ids'])<=sources.keys(),cid
 if c['kind']=='source_fact':
  assert c['source_ids'],cid
  for sid in c['source_ids']:
   r=reviews[sid]
   assert cid in r['supported_claims'],(cid,sid)
   assert r.get('status') in ['verified-in-scope','read-primary'],(cid,r.get('status'))
for r in e['reviews']:
 assert set(r['supported_claims']) <= (claims.keys()|legacy.keys()),r['source_id']
for case in ['H01','H02','H03','V12','V13','V14','X02']:
 d=json.loads((p/f'{case}.json').read_text())
 for cid in d['claim_ids']:
  if cid in claims: assert set(claims[cid]['source_ids'])<=set(d['source_ids']),(case,cid)
 text=(root/'books/saas-engineering/packages/commercial-finance'/f'{case}.md').read_text()
 cited=set(re.findall(r'(?:H\d{2}|V\d{2}|X\d{2}):claim:[a-z0-9-]+',text))
 assert cited<=set(d['claim_ids']),(case,cited-set(d['claim_ids']))
 assert len(re.findall(r'\*\*练习',text))>=2,case
 assert len({n['id'] for n in d['nodes']})==len(d['nodes'])
 print(f"{case}: nodes={len(d['nodes'])}, edges={len(d['edges'])}, lifecycles={len(d['lifecycles'])}, check_definitions={len(d['checks'])}, exercises={len(re.findall(r'[*][*]练习',text))}")
print(json.dumps({'status':'pass','new_sources':len(local),'reviews':len(reviews),'review_statuses':dict(Counter(r.get('status') for r in e['reviews'])),'claims':len(claims),'claim_kinds':dict(Counter(c['kind'] for c in e['claims'])),'scope':'IDs, source-review-claim linkage, duplicate metadata, prose citations, exercise presence; no semantic/factual validation'},ensure_ascii=False))
