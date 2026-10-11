#!/usr/bin/env python3
"""Build/check/filter the bounded Design/Write cross-index from source catalogs.

No external access, source-card generation, historical migration, or adoption.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'vault/provenance/design-writing-encyclopedia'
DEST = BASE / 'index.json'
FACETS = {
    'industry_author': '来源作者/组织的行业语境，不代表方法已经在该行业验证',
    'industry_applicability': '有依据或明示为推断的适用行业，可多值',
    'task': '读者需要完成的判断或动作',
    'artifact': '交付媒介或产物形态',
    'operation': '可复用的视觉、交互、表达操作',
    'stack_runtime': '来源的实现语境，可替换，不等于语法',
    'style_lineage': '作者明示或有依据的视觉谱系，不是全局审美偏好',
    'language': '来源或产物的语言语境，不代表规则可直接翻译',
}


def records():
    for path in sorted(BASE.glob('*/catalog.json')):
        data = json.loads(path.read_text())
        for source in data['sources']:
            yield path, data, source


def targets(path):
    text = path.read_text()
    for target in re.findall(r'\[[^\]]*\]\(([^\n]+?)\)', text):
        if urlsplit(target).scheme or target.startswith('#'):
            continue
        yield (path.parent / unquote(target.split('#')[0])).resolve()


def canonical(url):
    u = urlsplit(url)
    return urlunsplit((u.scheme.lower(), u.netloc.lower(), u.path.rstrip('/'), u.query, ''))


def build():
    sources, grammar = [], {}
    for catalog, data, s in records():
        namespace = 'provenance-' + catalog.parent.relative_to(ROOT / 'vault/provenance').as_posix().replace('/', '-')
        entry = {key: s[key] for key in ('id', 'title', 'url', 'card_path', 'status',
                  'evidence_modality', 'license_state', 'grammar_paths', 'history_record')}
        entry['registry_id'] = namespace + ':' + s['slug']
        for key in ('aliases', 'facets', 'implementation_maturity', 'adoption', 'redirect_to'):
            if key in s:
                entry[key] = s[key]
        sources.append(entry)
        for rel in s['grammar_paths']:
            p = ROOT / rel
            body = p.read_text()
            found = re.search(r'(?m)^id: (DWG-[A-Z-]+)\s*$', body) or re.search(r'`(DWG-[A-Z-]+)`', body)
            title = re.search(r'(?m)^# (.+)$', body)
            g = grammar.setdefault(rel, {'id': found.group(1) if found else None, 'path': rel,
                                         'title': title.group(1), 'source_ids': []})
            g['source_ids'].append(s['id'])
    return {'schema_version': '1.0', 'generated_from': 'scripts/reference_index.py',
            'scope': 'Only this collection; canonical historical sources remain at their own cards.',
            'facet_definitions': FACETS, 'sources': sources, 'grammar': list(grammar.values())}


def validate(data):
    errors = []
    rows = list(records())
    identities = {s['id'] for _, _, s in rows}
    claims = {c['claim_id'] for _, _, s in rows for c in s['supported_claims']}
    if len(identities) != len(rows):
        errors.append('Duplicate source ID')
    known = identities | claims
    urls = {}
    for catalog in (ROOT / 'vault/provenance').rglob('catalog.json'):
        for s in json.loads(catalog.read_text())['sources']:
            urls.setdefault(canonical(s['url']), []).append((catalog, s.get('card_path')))
    for path, catalog, s in rows:
        sid = s['id']
        if catalog['as_of'] is not None:
            errors.append(f'{sid}: chronology belongs in history_record')
        for field in ('card_path', 'history_record'):
            if not (ROOT / s[field]).is_file():
                errors.append(f'{sid}: missing {field}')
        if len(urls[canonical(s['url'])]) > 1:
            errors.append(f'{sid}: duplicate canonical URL; reuse existing source card')
        card = ROOT / s['card_path']
        body = card.read_text()
        if s['url'] not in body or sid not in body:
            errors.append(f'{sid}: source card must identify URL and ID')
        if not s.get('evidence_modality') or not s.get('license_state'):
            errors.append(f'{sid}: evidence/rights boundary absent')
        for c in s['supported_claims']:
            if not c.get('locator') or not c.get('claim'):
                errors.append(f'{sid}: claim has no usable evidence locator')
        for rel in s['grammar_paths']:
            grammar = ROOT / rel
            if grammar not in set(targets(card)):
                errors.append(f'{sid}: source card lacks grammar backlink {rel}')
            if card not in set(targets(grammar)):
                errors.append(f'{sid}: grammar lacks direct source route {rel}')
        for dimension, facet in s.get('facets', {}).items():
            if dimension not in FACETS:
                errors.append(f'{sid}: unregistered facet dimension {dimension}')
            if facet.get('state') not in ('known', 'unknown', 'not-applicable') or facet.get('basis') not in ('explicit', 'inferred'):
                errors.append(f'{sid}: invalid facet state/basis')
            if not isinstance(facet.get('values'), list) or not isinstance(facet.get('evidence'), list):
                errors.append(f'{sid}: facet values/evidence must be lists')
                continue
            if facet['state'] != 'known' and facet['values']:
                errors.append(f'{sid}: unknown/N/A facet carries values')
            if not facet['evidence'] or any(x not in known for x in facet['evidence']):
                errors.append(f'{sid}: facet has unresolved evidence IDs')
        if s.get('snapshot_path'):
            p = ROOT / s['snapshot_path']
            if hashlib.sha256(p.read_bytes()).hexdigest() != s['snapshot_sha256']:
                errors.append(f'{sid}: excerpt hash mismatch')
    # Also discover actual grammar-to-card edges; validating declared edges alone
    # misses a real citation omitted from the catalog. Shared cards use their union.
    card_routes = {}
    for _, _, s in rows:
        card_routes.setdefault((ROOT / s['card_path']).resolve(), set()).update(s['grammar_paths'])
    for g in data['grammar']:
        for card in set(targets(ROOT / g['path'])) & card_routes.keys():
            if g['path'] not in card_routes[card]:
                errors.append(f"{g['path']}: undeclared source edge to {card.relative_to(ROOT)}")
    # New mounted entries and ordinary cards contain current guidance; links may
    # legitimately contain dated paths. Historical work and all old sources stay out.
    paths = {ROOT / g['path'] for g in data['grammar']} | {ROOT / s['card_path'] for s in data['sources']}
    gids = [g['id'] for g in data['grammar']]
    if None in gids or len(gids) != len(set(gids)):
        errors.append('Missing/duplicate grammar ID')
    for p in paths:
        body = re.sub(r'\]\([^)]*\)', ']', p.read_text())
        body = re.sub(r'https?://\S+', '', body)
        if re.search(r'\b20\d{2}-\d{2}-\d{2}\b|^## (使用记录|审阅裁决记录|增量|版本历史)', body, re.M):
            errors.append(f'{p.relative_to(ROOT)}: body contains chronology')
    # Registry's stable existing IDs and new aliases must resolve to one card.
    registry = json.loads((ROOT / 'vault/registry.json').read_text())
    by_alias = {}
    for s in registry['sources']:
        for alias in [s['id'], *s.get('aliases', [])]:
            by_alias.setdefault(alias, set()).add(s['local_card'])
    for s in data['sources']:
        if by_alias.get(s['id']) != {s['card_path']}:
            errors.append(f"{s['id']}: registry alias does not resolve to canonical card")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='validate and compare generated index without writing')
    parser.add_argument('--facet', action='append', default=[], metavar='DIMENSION=VALUE', help='AND-filter sources; no file writes')
    args = parser.parse_args()
    result = build()
    if args.facet:
        rows = result['sources']
        for f in args.facet:
            dimension, value = f.split('=', 1)
            rows = [s for s in rows if value in s.get('facets', {}).get(dimension, {}).get('values', [])]
        print(json.dumps([{k: s[k] for k in ('id', 'card_path', 'grammar_paths')} for s in rows], ensure_ascii=False, indent=2))
        return 0
    if args.check:
        errors = validate(result)
        if not DEST.exists() or json.loads(DEST.read_text()) != result:
            errors.append('Cross-index stale; run python3 scripts/reference_index.py')
        print(json.dumps({'sources': len(result['sources']), 'grammar': len(result['grammar']), 'errors': errors,
                          'status': 'fail' if errors else 'pass'}, ensure_ascii=False, indent=2))
        return bool(errors)
    DEST.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'sources': len(result['sources']), 'grammar': len(result['grammar'])}))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
