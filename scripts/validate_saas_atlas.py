#!/usr/bin/env python3
"""Check the SaaS atlas research contract; does not run business behavior or browse."""
import argparse
from collections import Counter
from copy import deepcopy
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / 'vault/distilled/saas-engineering-atlas'
PROVENANCE = ROOT / 'vault/provenance/saas-engineering-atlas'
EXPECTED_CASES = {f'H{i:02}' for i in range(1, 10)} | {f'V{i:02}' for i in range(1, 23)} | {'X01', 'X02'}
REQUIRED_CHECKS = {'happy_path', 'duplicate', 'out_of_order', 'concurrency', 'tenant_isolation', 'unknown_outcome', 'recovery'}


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def require_fields(item, keys, context, errors):
    if not isinstance(item, dict):
        errors.append(f'{context}: expected object')
        return False
    for key in keys:
        if key not in item or item[key] in (None, ''):
            errors.append(f'{context}: missing {key}')
    return True


def unique(values, context, errors):
    for value, count in Counter(values).items():
        if count > 1:
            errors.append(f'{context}: duplicate {value}')


def validate_case(data, source_ids, claim_ids, definitions, relations):
    errors = []
    fields = ('contract_version', 'case_id', 'title', 'scope', 'synthetic', 'source_ids', 'nodes', 'edges', 'lifecycles', 'algorithm_ids', 'claim_ids', 'checks')
    if not require_fields(data, fields, 'case', errors):
        return errors
    case = data.get('case_id', '')
    if case not in EXPECTED_CASES or data.get('contract_version') != '1.0':
        errors.append('unknown case or contract version')
    if not isinstance(data.get('synthetic'), bool):
        errors.append('synthetic must be boolean')
    arrays = ('source_ids', 'nodes', 'edges', 'lifecycles', 'algorithm_ids', 'claim_ids', 'checks')
    for key in arrays:
        if not isinstance(data.get(key), list):
            errors.append(f'{key}: expected array')
    if any(not isinstance(data.get(k), list) for k in arrays):
        return errors
    for key, known in [('source_ids', source_ids), ('claim_ids', claim_ids), ('algorithm_ids', {a['id'] for a in definitions['algorithms']})]:
        unique(data[key], key, errors)
        for value in data[key]:
            if value not in known:
                errors.append(f'{key}: unknown {value}')
    if not data['algorithm_ids']:
        errors.append('at least one relevant algorithm required')
    nodes = {}
    for n in data['nodes']:
        if not require_fields(n, ('id', 'type', 'label', 'authority', 'tenant_scope'), 'node', errors):
            continue
        nid, kind = n.get('id', ''), n.get('type', '')
        if kind not in definitions['node_types'] or not re.fullmatch(re.escape(f'{case}:{kind}:') + r'[a-z0-9][a-z0-9-]*', nid):
            errors.append(f'node identity/type: {nid}')
        if nid in nodes:
            errors.append(f'duplicate node {nid}')
        nodes[nid] = n
    for needed in ('actor', 'object', 'ui', 'service', 'store'):
        if needed not in {n.get('type') for n in nodes.values()}:
            errors.append(f'missing node type {needed}')
    unique([e.get('id') for e in data['edges'] if isinstance(e, dict)], 'edges', errors)
    relation_map = {r['id']: r for r in relations['relations']}
    for e in data['edges']:
        if not require_fields(e, relations['edge_required'], 'edge', errors):
            continue
        if not re.fullmatch(re.escape(case + ':edge:') + r'[a-z0-9][a-z0-9-]*', e.get('id', '')):
            errors.append('edge ID prefix or slug')
        rule = relation_map.get(e.get('type'))
        start, end = nodes.get(e.get('from')), nodes.get(e.get('to'))
        if not rule or not start or not end:
            errors.append(f"unresolved edge {e.get('id')}")
        elif start['type'] not in rule['from_types'] or end['type'] not in rule['to_types']:
            errors.append(f"typed endpoint mismatch {e.get('id')}")
        if e.get('timing') not in definitions['timing_values'] or e.get('basis') not in definitions['basis_values']:
            errors.append(f"edge timing/basis {e.get('id')}")
        refs = e.get('claim_ids', [])
        if not isinstance(refs, list) or any(c not in data['claim_ids'] for c in refs):
            errors.append('edge claim outside case claim_ids')
        if e.get('basis') == 'source_fact' and not refs:
            errors.append('source_fact edge requires claim')
    for life in data['lifecycles']:
        if not require_fields(life, ('object_id', 'states', 'transitions'), 'lifecycle', errors):
            continue
        if nodes.get(life.get('object_id'), {}).get('type') != 'object':
            errors.append('lifecycle object missing or wrong type')
        states, transitions = life.get('states', []), life.get('transitions', [])
        if not isinstance(states, list) or not isinstance(transitions, list):
            errors.append('lifecycle states/transitions must be arrays')
            continue
        unique(states, 'states', errors)
        if not states or not transitions:
            errors.append('empty lifecycle')
        for t in transitions:
            if require_fields(t, ('from', 'to', 'trigger', 'guard', 'durable_effect', 'recovery'), 'transition', errors):
                if t.get('from') not in states or t.get('to') not in states:
                    errors.append('transition references unknown state')
    if not data['lifecycles']:
        errors.append('at least one lifecycle required')
    unique([c.get('id') for c in data['checks'] if isinstance(c, dict)], 'checks', errors)
    kinds = set()
    for check in data['checks']:
        if require_fields(check, ('id', 'kind', 'given', 'when', 'then', 'evidence_required'), 'check', errors):
            kinds.add(check.get('kind'))
            if not check.get('id', '').startswith(case + ':check:'):
                errors.append('check ID prefix')
    if REQUIRED_CHECKS - kinds:
        errors.append('missing checks: ' + ', '.join(sorted(REQUIRED_CHECKS - kinds)))
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--self-test', action='store_true', help='also reject deliberately damaged copies of the example')
    args = parser.parse_args()
    definitions, relations = read(ATLAS / 'identifiers.json'), read(ATLAS / 'relation-types.json')
    sources = read(PROVENANCE / 'catalog.json')['sources']
    source_ids = {s['id'] for s in sources}
    claims = {c['claim_id'] for s in sources for c in s['supported_claims']}
    errors = []
    unique([s['id'] for s in sources], 'sources', errors)
    unique([s['url'] for s in sources], 'source URLs', errors)
    for s in sources:
        if not s['url'].startswith('https://'):
            errors.append(f"source URL must be public HTTPS: {s['id']}")
        if s['status'] == 'unverified' and s['supported_claims']:
            errors.append(f"unverified seed has supported claims: {s['id']}")
    cases = read(ATLAS / 'case-index.json')['cases']
    unique([c['case_id'] for c in cases], 'case index', errors)
    if {c['case_id'] for c in cases} != EXPECTED_CASES:
        errors.append('case index must preserve all 33 baseline identities')
    packages = read(ATLAS / 'packages/manifest.json')['packages']
    unique([p['package_id'] for p in packages], 'packages', errors)
    assigned = [c for p in packages for c in p['case_ids']]
    unique(assigned, 'package ownership', errors)
    if set(assigned) != EXPECTED_CASES:
        errors.append('package coverage mismatch')
    for c in cases:
        owners = [p['package_id'] for p in packages if c['case_id'] in p['case_ids']]
        if owners != [c['package_id']]:
            errors.append(f"case owner mismatch: {c['case_id']}")
        if not set(c['source_ids']) <= source_ids:
            errors.append(f"unknown case seed: {c['case_id']}")
    examples = [ATLAS / 'example-h01.json']
    for p in packages:
        expected = f"vault/distilled/saas-engineering-atlas/packages/{p['slug']}/"
        if p['write_root'] != expected or not (ROOT / expected / 'README.md').is_file():
            errors.append(f"package write boundary/README: {p['package_id']}")
        directory = ROOT / expected
        evidence_path = directory / 'evidence.json'
        local_sources, local_claims = set(source_ids), set(claims)
        if evidence_path.exists():
            evidence = read(evidence_path)
            for source in evidence.get('sources', []):
                if require_fields(source, ('id', 'url', 'title'), 'new source', errors):
                    if not source['id'].startswith(p['package_id'] + '-SRC-') or not source['url'].startswith('https://'):
                        errors.append('invalid package source identity/URL')
                    local_sources.add(source['id'])
            reviewed = set()
            for review in evidence.get('reviews', []):
                if require_fields(review, ('source_id', 'date', 'locator', 'supported_claims', 'limitations'), 'source review', errors):
                    if review['source_id'] not in local_sources:
                        errors.append('review references unknown source')
                    reviewed.add(review['source_id'])
            for claim in evidence.get('claims', []):
                if require_fields(claim, ('id', 'case_id', 'kind', 'statement', 'source_ids', 'locator', 'limitations'), 'claim', errors):
                    if claim['case_id'] not in p['case_ids'] or not claim['id'].startswith(claim['case_id'] + ':claim:'):
                        errors.append('claim outside package ownership')
                    if claim['kind'] not in definitions['basis_values'] or not set(claim['source_ids']) <= local_sources:
                        errors.append('invalid claim kind/source')
                    if claim['kind'] == 'source_fact' and (not claim['source_ids'] or not set(claim['source_ids']) <= reviewed):
                        errors.append('source fact requires local source review')
                    local_claims.add(claim['id'])
        for path in directory.rglob('*.json'):
            if path.name == 'evidence.json':
                continue
            data = read(path)
            if 'case_id' not in data:
                continue
            if data['case_id'] not in p['case_ids'] or path.name != data['case_id'] + '.json':
                errors.append(f'case outside assigned ownership: {path.relative_to(ROOT)}')
            if not path.with_suffix('.md').is_file():
                errors.append(f'case prose missing: {path.name}')
            errors.extend(f'{path.name}: {e}' for e in validate_case(data, local_sources, local_claims, definitions, relations))
            examples.append(path)
    example = read(examples[0])
    errors.extend(validate_case(example, source_ids, claims, definitions, relations))
    self_tests = 0
    if args.self_test:
        mutations = [
            lambda d: d['edges'][0].update(type='magic'),
            lambda d: d['edges'][0].update(to=d['nodes'][0]['id']),
            lambda d: d['source_ids'].append('UNKNOWN'),
            lambda d: d['nodes'].append(deepcopy(d['nodes'][0])),
            lambda d: d['lifecycles'][0]['transitions'][0].update(to='missing'),
            lambda d: d.update(checks=[x for x in d['checks'] if x['kind'] != 'unknown_outcome']),
            lambda d: d['edges'][0].update(basis='source_fact', claim_ids=[]),
            lambda d: d['edges'][0].update(claim_ids=['missing-claim']),
        ]
        for mutate in mutations:
            broken = deepcopy(example)
            mutate(broken)
            if not validate_case(broken, source_ids, claims, definitions, relations):
                errors.append(f'self-test {self_tests + 1}: invalid fixture accepted')
            self_tests += 1
    print(json.dumps({'status': 'fail' if errors else 'pass', 'cases': len(cases), 'packages': len(packages), 'sources': len(sources), 'structured_examples': len(examples), 'negative_self_tests': self_tests, 'errors': errors, 'scope': 'structural validation only; no provider, demo, factual, performance or end-to-end execution'}, ensure_ascii=False, indent=2))
    return bool(errors)


if __name__ == '__main__':
    raise SystemExit(main())
