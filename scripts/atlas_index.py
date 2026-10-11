#!/usr/bin/env python3
"""Build, check or query the bounded art/software atlas without network access.

Catalogs, entities and grammar.json remain the editing sources. Query and check
are read-only. jsonschema is required only for checking or writing a projection.
"""
from __future__ import annotations
import argparse
from collections import Counter
import json
import os
from pathlib import Path
import re
from urllib.parse import urlsplit, urlunsplit, unquote

R = Path(__file__).resolve().parents[1]
B = R / 'vault/provenance/art-software-atlas'
DEST = B / 'index.json'


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def build():
    source_rows = []
    entities = []
    relations = []
    reused = []
    for p in sorted(B.glob('*/catalog.json')):
        d = read(p)
        for s in d['sources']:
            source_rows.append({**s, 'kind': 'source-record', 'catalog_path': p.relative_to(R).as_posix()})
        for s in d.get('reused_sources', []):
            reused.append({'id': s.get('id', s.get('source_id')), 'kind': 'source-record', 'url': s['url'], 'card_path': s['card_path'], 'grammar_paths': s['grammar_paths'], 'limits': s['limits']})
    for p in sorted(B.glob('*/entities.json')):
        d = read(p)
        entities += d['entities']
        relations += d['relations']
    byid = {s['id']: s for s in source_rows}
    grammar = []
    paths = {}
    for row in read(B / 'grammar.json')['grammar']:
        g = {**row, 'facets': dict(row['facets'])}
        g['evidence_modalities'] = sorted({m for sid in g['source_ids'] for m in byid[sid]['evidence_modality']})
        g['facets']['operation'] = {'values': g['operations'], 'state': 'known', 'basis': 'inferred', 'evidence': [g['id']], 'rationale': '由本库 grammar.operations 单点投影；这是本库操作命名，不声称原作者使用相同分类。'}
        grammar.append(g)
        paths.setdefault(g['path'], []).append(g['id'])
        for sid in g['source_ids']:
            relations.append({'from': sid, 'type': 'informs', 'to': g['id'], 'basis': 'derived', 'limits': '来源支持的主张范围见原卡；本仓库软件转译不是原作者主张。'})
    for s in reused:
        for p in s['grammar_paths']:
            for gid in paths[p]:
                relations.append({'from': s['id'], 'type': 'informs', 'to': gid, 'basis': 'reused-reference', 'limits': s['limits']})
    unique = {}
    for e in relations:
        unique.setdefault((e['from'], e['type'], e['to']), e)
    defs = read(R / 'vault/provenance/design-writing-encyclopedia/index.json')['facet_definitions']
    facet_index = {}
    for dim in defs:
        post = {'values': {}, 'states': {s: [] for s in ['known', 'unknown', 'not-applicable', 'unreviewed']}}
        for n in source_rows + reused + entities + grammar:
            f = n.get('facets', {}).get(dim)
            state = f['state'] if f else 'unreviewed'
            post['states'][state].append(n['id'])
            if state == 'known':
                for value in f['values']:
                    post['values'].setdefault(value, []).append(n['id'])
        for k in post['values']:
            post['values'][k].sort()
        for k in post['states']:
            post['states'][k].sort()
        post['values'] = dict(sorted(post['values'].items()))
        facet_index[dim] = post
    index = {'schema_version': '1.1', 'scope': 'Bounded art/software atlas; source/entity/grammar registrations remain canonical; existing sources reused by identity.', 'levels': {'L0': 'task route', 'L1': 'selection abstract', 'L2': 'deep grammar', 'L3': 'source and rights evidence', 'L4': 'verification and history'}, 'facet_definitions': defs, 'grammar': grammar, 'sources': source_rows, 'reused_sources': reused, 'entities': entities, 'relations': list(unique.values()), 'redirects': [], 'facet_index': facet_index}
    return index


def query(index, filters):
    if not isinstance(filters, dict):
        raise ValueError('Filters must be a JSON object')
    scopes = {'grammar': {'derived-grammar'}, 'source': {'source-record'}, 'exemplar': {'exemplar'}, 'implementation': {'implementation-substrate'}, 'corpus': {'discovery-corpus'}}
    nodes = {n['id']: n for key in ['sources', 'reused_sources', 'entities', 'grammar'] for n in index[key]}
    wanted = {}
    for key, criterion in filters.items():
        if '.' not in key:
            raise ValueError('Expected scope.dimension: ' + key)
        scope, dimension = key.split('.', 1)
        if scope not in scopes or dimension not in index['facet_index']:
            raise ValueError('Unknown query scope/facet: ' + key)
        post = index['facet_index'][dimension]
        if isinstance(criterion, dict):
            if set(criterion) != {'state'} or not isinstance(criterion['state'], str) or criterion['state'] not in post['states']:
                raise ValueError('Invalid state query')
            ids = set(post['states'][criterion['state']])
        else:
            values = criterion if isinstance(criterion, list) else [criterion]
            if not values or not all((isinstance(v, str) for v in values)):
                raise ValueError('Expected nonempty exact values')
            ids = set(nodes)
            for value in values:
                ids &= set(post['values'].get(value, []))
        ids = {sid for sid in ids if nodes[sid]['kind'] in scopes[scope]}
        wanted[scope] = ids if scope not in wanted else wanted[scope] & ids
    out = []
    for g in index['grammar']:
        source_ids = set(g['source_ids']) | {e['from'] for e in index['relations'] if e['to'] == g['id'] and e['type'] == 'informs' and (nodes[e['from']]['kind'] == 'source-record')}
        direct = {e['from']: e for e in index['relations'] if e['to'] == g['id'] and e['type'] in ['informs', 'implements'] and (nodes[e['from']]['kind'] != 'source-record')}
        lanes = {'grammar': {g['id']}, 'source': source_ids, 'exemplar': set(), 'implementation': set(), 'corpus': set()}
        routes = {}
        for n in index['entities']:
            overlap = source_ids & set(n['source_ids'])
            if n['id'] not in direct and (not overlap):
                continue
            lane = {'exemplar': 'exemplar', 'implementation-substrate': 'implementation', 'discovery-corpus': 'corpus'}[n['kind']]
            lanes[lane].add(n['id'])
            routes[n['id']] = {'route': 'typed-relation', 'relation': direct[n['id']]} if n['id'] in direct else {'route': 'shared-evidence', 'source_ids': sorted(overlap)}
        witnesses = {scope: sorted(ids & lanes[scope]) for scope, ids in wanted.items()}
        if any((not ids for ids in witnesses.values())):
            continue
        out.append({'grammar_id': g['id'], 'title': g['title'], 'path': g['path'] + '#' + g['section'], 'witnesses': witnesses, 'routes': {sid: routes[sid] for ids in witnesses.values() for sid in ids if sid in routes}})
    return out


def validate(data):
    """Reject malformed shapes before inspecting identities and projections."""
    try:
        import jsonschema
    except ImportError:
        return ['Missing jsonschema; use an environment with it already available.']
    validator = jsonschema.Draft202012Validator(
        read(B / 'schema.json'), format_checker=jsonschema.FormatChecker())
    errors = ['schema ' + str(list(e.path)) + ': ' + e.message
              for e in validator.iter_errors(data)]
    if errors:
        return errors

    nodes = sum((data[key] for key in ('sources', 'reused_sources', 'entities', 'grammar')), [])
    ids = {node['id']: node for node in nodes}
    claims = [c['claim_id'] for s in data['sources'] for c in s['supported_claims']]
    for label, values in [('ID', [n['id'] for n in nodes]), ('claim', claims)]:
        errors.extend('duplicate ' + label + ' ' + key
                      for key, count in Counter(values).items() if count > 1)
    known = set(ids) | set(claims)
    for node in nodes:
        for sid in node.get('source_ids', []):
            if sid not in ids or ids[sid]['kind'] != 'source-record':
                errors.append(node['id'] + ' invalid source ' + sid)
        for key in ('card_path', 'history_record', 'path'):
            if node.get(key) and not (R / node[key]).is_file():
                errors.append(node['id'] + ' missing ' + key)
        for path in node.get('grammar_paths', []):
            if not (R / path).is_file():
                errors.append(node['id'] + ' missing grammar ' + path)
        for dimension, facet in node.get('facets', {}).items():
            if (facet['state'] == 'known') != bool(facet['values']):
                errors.append(node['id'] + ' invalid state/value ' + dimension)
            if not facet['evidence'] or set(facet['evidence']) - known:
                errors.append(node['id'] + ' unresolved facet evidence ' + dimension)
            owner_dims = {
                'source-record': {'industry_author', 'language'},
                'derived-grammar': {'industry_applicability', 'task', 'artifact', 'operation', 'language'},
            }.get(node['kind'], {'artifact', 'style_lineage', 'stack_runtime'})
            if dimension in owner_dims and not facet.get('rationale'):
                errors.append(node['id'] + ' missing facet rationale ' + dimension)

    # Exact rebuild checks all projections, including relations, reused sources,
    # facet posting lists and absent/unreviewed states. Never repair on --check.
    try:
        if data != build():
            errors.append('Atlas projection stale; run python3 scripts/atlas_index.py --build')
    except (KeyError, TypeError, ValueError, OSError) as exc:
        errors.append('Cannot build canonical atlas: ' + str(exc))

    allowed = {
        'documents': ({'source-record'}, {'discovery-corpus', 'exemplar', 'implementation-substrate'}),
        'contains': ({'discovery-corpus'}, {'exemplar', 'implementation-substrate', 'discovery-corpus'}),
        'implements': ({'implementation-substrate'}, {'derived-grammar'}),
        'informs': ({'source-record', 'exemplar', 'implementation-substrate', 'discovery-corpus'},
                    {'derived-grammar', 'implementation-substrate'}),
        'contrasts': ({'derived-grammar', 'exemplar'}, {'derived-grammar', 'exemplar'}),
        'discovered-via': ({'source-record', 'exemplar', 'implementation-substrate'}, {'discovery-corpus'}),
    }
    for edge in data['relations']:
        if edge['from'] not in ids or edge['to'] not in ids:
            errors.append('unresolved edge ' + str(edge))
            continue
        left, right = allowed[edge['type']]
        if ids[edge['from']]['kind'] not in left or ids[edge['to']]['kind'] not in right:
            errors.append('edge kind ' + str(edge))

    def canonical(url):
        parts = urlsplit(url)
        return urlunsplit((parts.scheme.lower(), parts.netloc.lower(),
                           parts.path.rstrip('/'), parts.query, ''))

    urls = Counter(canonical(s['url'])
                   for path in (R / 'vault/provenance').rglob('catalog.json')
                   for s in read(path)['sources'])
    registry = read(R / 'vault/registry.json')
    aliases = {}
    for source in registry['sources']:
        for alias in [source['id'], *source.get('aliases', [])]:
            aliases.setdefault(alias, set()).add(source['local_card'])
    # Reused references belong to their original catalogs. Rebuilding this
    # atlas cannot by itself prove that an edited reuse still has that identity.
    for source in data['reused_sources']:
        matches = [s for s in registry['sources']
                   if s['local_card'] == source['card_path']
                   and canonical(s['canonical_url']) == canonical(source['url'])]
        if len(matches) != 1:
            errors.append(source['id'] + ' reused URL/card does not resolve to one registry source')
            continue
        original = matches[0]
        catalog_path = R / original['record_path']
        owner_rows = []
        for row in read(catalog_path)['sources']:
            card_path = row.get('card_path') or (catalog_path.parent / 'cards' / (row['slug'] + '.md')).relative_to(R).as_posix()
            if card_path == source['card_path'] and canonical(row['url']) == canonical(source['url']):
                owner_rows.append(row)
        if len(owner_rows) != 1:
            errors.append(source['id'] + ' reused source does not resolve to its owning catalog')
            continue
        owner = owner_rows[0]
        # Legacy catalogs may use ledger_id without opting into registry aliases.
        identities = {original['id'], *original.get('aliases', []), owner.get('id'), owner.get('ledger_id')}
        if source['id'] not in identities:
            errors.append(source['id'] + ' reused ID does not match canonical source identity')
    for source in data['sources']:
        sid = source['id']
        if urls[canonical(source['url'])] > 1:
            errors.append('duplicate canonical URL ' + sid)
        if aliases.get(sid) != {source['card_path']}:
            errors.append(sid + ' registry alias does not resolve to canonical card')
        card = R / source['card_path']
        if not card.is_file():
            continue
        body = card.read_text(encoding='utf-8')
        if source['url'] not in body or sid not in body:
            errors.append(sid + ' missing identity in card')
        for path in source['grammar_paths']:
            grammar = R / path
            if os.path.relpath(grammar, card.parent) not in body:
                errors.append(sid + ' missing grammar backlink')
            if grammar.is_file() and os.path.relpath(card, grammar.parent) not in grammar.read_text(encoding='utf-8'):
                errors.append(sid + ' missing direct card link in grammar')
        paths_from_grammar = {g['path'] for g in data['grammar'] if sid in g['source_ids']}
        if paths_from_grammar != set(source['grammar_paths']):
            errors.append(sid + ' source/grammar path declarations disagree')

    # A file may contain several grammar IDs or a card may cover several URLs.
    # Compare their path unions; do not assign every citation to every section.
    card_routes = {}
    for source in data['sources'] + data['reused_sources']:
        card_routes.setdefault((R / source['card_path']).resolve(), set()).update(source['grammar_paths'])
    for grammar_path in {g['path'] for g in data['grammar']}:
        path = R / grammar_path
        if not path.is_file():
            continue
        linked = set()
        for target in re.findall(r'\[[^\]]*\]\(([^\n]+?)\)', path.read_text(encoding='utf-8')):
            if not urlsplit(target).scheme and not target.startswith('#'):
                linked.add((path.parent / unquote(target.split('#')[0])).resolve())
        for card in linked & card_routes.keys():
            if grammar_path not in card_routes[card]:
                errors.append(grammar_path + ' undeclared source citation ' + str(card.relative_to(R)))
    for grammar in data['grammar']:
        path = R / grammar['path']
        if path.is_file():
            body = path.read_text(encoding='utf-8')
            if grammar['id'] not in body:
                errors.append(grammar['id'] + ' absent in grammar body')
            if 'id="' + grammar['section'] + '"' not in body:
                errors.append(grammar['id'] + ' missing grammar anchor')

    paths = set(B.rglob('*.md'))
    paths.update((R / 'docs/verification/art-software-atlas-20261011').rglob('*.md'))
    paths.update(R / g['path'] for g in data['grammar'])
    for path in paths:
        if not path.is_file():
            continue
        for target in re.findall(r'\[[^\]]*\]\(([^\n]+?)\)', path.read_text(encoding='utf-8')):
            if urlsplit(target).scheme or target.startswith('#'):
                continue
            if not (path.parent / unquote(target.split('#')[0])).resolve().exists():
                errors.append(str(path.relative_to(R)) + ' broken ' + target)
    for directory in [B, *(p for p in B.rglob('*') if p.is_dir())]:
        if not (directory / 'README.md').is_file():
            errors.append('missing README ' + str(directory.relative_to(R)))
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_mutually_exclusive_group(required=True)
    modes.add_argument('--build', action='store_true', help='validate then write the generated index')
    modes.add_argument('--check', action='store_true', help='validate the stored index without writing')
    modes.add_argument('--query', metavar='JSON', help='query scope.dimension values or states; read-only')
    args = parser.parse_args()
    try:
        data = build() if args.build else read(DEST)
        if args.query is not None:
            print(json.dumps(query(data, json.loads(args.query)), ensure_ascii=False, indent=2))
            return 0
        errors = validate(data)
        if args.build and not errors:
            DEST.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        result = {key: len(data[key]) for key in ('sources', 'reused_sources', 'entities', 'grammar', 'relations')
                  if isinstance(data, dict) and isinstance(data.get(key), list)}
        result.update(status='fail' if errors else 'pass', errors=errors)
    except (KeyError, TypeError, ValueError, OSError) as exc:
        result = {'status': 'fail', 'errors': [str(exc)]}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return int(result['status'] == 'fail')


if __name__ == '__main__':
    raise SystemExit(main())
