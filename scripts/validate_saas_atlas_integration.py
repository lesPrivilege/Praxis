#!/usr/bin/env python3
"""Validate complete atlas navigation, source preservation and typed transfer graph."""
import argparse
from collections import Counter
from copy import deepcopy
import json
from pathlib import Path
import re
from build_saas_atlas_indexes import build, ROOT, ATLAS, PROV
from validate_saas_atlas import EXPECTED_CASES

def read(p): return json.loads(p.read_text())

def check_transfers(graph, cases):
    errors=[]
    nodes=graph.get('nodes',[]); edges=graph.get('edges',[])
    ids=[n['id'] for n in nodes]; types={t['id'] for t in graph.get('edge_types',[])}
    if set(ids)!=EXPECTED_CASES or len(ids)!=33: errors.append('transfer node coverage')
    if len({e['id'] for e in edges})!=len(edges): errors.append('duplicate transfer ID')
    for e in edges:
        if not re.fullmatch(r'TR:'+re.escape(e.get('from',''))+':'+re.escape(e.get('to',''))+r':[a-z0-9-]+',e['id']): errors.append('transfer identity/direction')
        if e.get('from') not in cases or e.get('to') not in cases or e.get('type') not in types: errors.append('transfer typed endpoints')
        for k in ['preserved_mechanism','precondition','changed_condition','counterexample','observable_check','proposal_paths']:
            if not e.get(k): errors.append('missing transfer '+k)
        if e.get('basis')!='inference': errors.append('transfer cannot inherit source facts')
        for end in ['from','to']:
            if e.get(end) in cases and e.get(end+'_path')!=cases[e[end]]['prose_path']: errors.append('transfer case path')
    # An undirected teaching route must connect every case; direction still matters per edge.
    reached={'H01'}
    while True:
        nxt=reached|{e[k] for e in edges for k in ['from','to'] if e.get('from') in reached or e.get('to') in reached}
        if nxt==reached: break
        reached=nxt
    if reached!=EXPECTED_CASES: errors.append('disconnected transfer coverage')
    return errors

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--self-test',action='store_true');args=parser.parse_args()
    errors=[]
    for path,content in build().items():
        if not path.exists() or path.read_text()!=content:errors.append('stale projection '+str(path.relative_to(ROOT)))
    catalog=read(PROV/'catalog.json')['sources']; aliases=read(PROV/'source-aliases.json')['aliases']; claims=read(PROV/'claims.json')['claims'];history=read(PROV/'reviews.json')
    ids=[x for s in catalog for x in [s['id'],*s['aliases']]]
    if len(ids)!=len(set(ids)) or set(ids)!=set(aliases):errors.append('source identities lost or duplicated')
    if len({s['url'] for s in catalog})!=len(catalog):errors.append('canonical URL duplicate')
    if len({c['id'] for c in claims})!=len(claims):errors.append('duplicate claim identity')
    claimmap={c['id']:c for c in claims}
    originals={s['source_id'] for s in history['source_records']}
    if originals!=set(aliases):errors.append('original source identity lost')
    for sid,canonical in aliases.items():
        if canonical not in {s['id'] for s in catalog}:errors.append('unresolved alias '+sid)
    for ep in sorted((ATLAS/'packages').glob('*/evidence.json')):
        evidence=read(ep)
        for c in evidence['claims']:
            if any(claimmap.get(c['id'],{}).get(k)!=v for k,v in c.items()):errors.append('claim changed '+c['id'])
            if c['kind']=='source_fact':
                for sid in c['source_ids']:
                    matching=[r for r in evidence['reviews'] if r['source_id']==sid and c['id'] in r['supported_claims']]
                    if not matching:errors.append('claim lacks scoped supporting review '+c['id']+' '+sid)
    index=read(ATLAS/'case-index.json')['cases']; cases={c['case_id']:c for c in index}
    if set(cases)!=EXPECTED_CASES or len(index)!=33:errors.append('case coverage')
    terms=read(ATLAS/'terminology.json')['terms']
    term_ids={t['id'] for t in terms}
    if len(term_ids)!=len(terms):errors.append('duplicate terminology identity')
    nodes=edges=lives=checks=0
    for c in index:
        for k in ['prose_path','topology_path']:
            if not (ATLAS/c[k]).is_file():errors.append('missing case route '+c['case_id'])
        d=read(ATLAS/c['topology_path']); prose=(ATLAS/c['prose_path']).read_text()
        if d['case_id']!=c['case_id'] or d['source_ids']!=c['source_ids'] or d['algorithm_ids']!=c['algorithm_ids']:errors.append('case index mismatch '+c['case_id'])
        if not set(d['source_ids'])<=set(aliases):errors.append('unresolved case source '+c['case_id'])
        refs=set(re.findall(r'(?:H\d{2}|V\d{2}|X\d{2}):claim:[a-z0-9-]+',prose))
        if not refs<=set(d['claim_ids']):errors.append('prose claim mismatch '+c['case_id'])
        for node in d['nodes']:
            if not set(node.get('reader_term_ids',[]))<=term_ids:errors.append('unknown reader term '+node['id'])
        nodes+=len(d['nodes']);edges+=len(d['edges']);lives+=len(d['lifecycles']);checks+=len(d['checks'])
    graph=read(ATLAS/'transfer-map.json'); errors+=check_transfers(graph,cases)
    proposals={p['id']:p for p in read(ATLAS/'transfer-proposals.json')['proposals']}
    for edge in graph['edges']:
        if edge['id'] not in proposals or proposals[edge['id']]['selection']!='integrated':errors.append('missing proposal provenance')
    for prop in proposals.values():
        for occ in prop['occurrences']:
            if prop['id'] not in (ATLAS/occ['path']).read_text() or occ['context'] not in (ATLAS/occ['path']).read_text():errors.append('stale proposal occurrence '+prop['id'])
    negative=0
    if args.self_test:
        for mutate in [lambda g:g['edges'][0].update(to='MISSING'),lambda g:g['edges'][0].update(type='flow'),lambda g:g['edges'][0].update(basis='source_fact'),lambda g:g['edges'][0].update(counterexample=''),lambda g:g['nodes'].pop(),lambda g:g['edges'].append(deepcopy(g['edges'][0]))]:
            broken=deepcopy(graph);mutate(broken)
            if not check_transfers(broken,cases):errors.append('negative integration self-test accepted')
            negative+=1
    result={'status':'fail' if errors else 'pass','case_count':len(cases),'case_nodes':nodes,'case_edges':edges,'lifecycles':lives,'defined_checks':checks,'canonical_sources':len(catalog),'source_identities':len(aliases),'source_reviews':len(history['reviews']),'claims':len(claims),'claim_kinds':dict(Counter(c['kind'] for c in claims)),'transfers':len(graph['edges']),'proposals':len(proposals),'negative_self_tests':negative,'errors':errors,'scope':'structure, navigation and evidence preservation; no provider, browser, load or AI execution'}
    print(json.dumps(result,ensure_ascii=False,indent=2));return bool(errors)

if __name__=='__main__':raise SystemExit(main())
