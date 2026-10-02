#!/usr/bin/env python3
"""Build a uniform, local consumer index from source-specific intake records."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel):
    return json.loads((ROOT / rel).read_text())


def build():
    sources, citations, collections = [], [], []
    refs_path = 'vault/references/catalog.json'
    refs = read(refs_path)
    for r in refs['resources']:
        sources.append({
            'id': r['id'], 'kind': 'external-url', 'collection': 'enterprise-references',
            'title': r['name'], 'original_locator': r['originalUrl'],
            'canonical_url': r['canonicalUrl'], 'reviewed_at': r['accessDate'],
            'evidence_status': r['verification']['status'],
            'summary': r['verification']['summary'], 'purpose_tags': r['purpose'],
            'local_card': r['cardPath'], 'record_path': refs_path,
            'limitations': r['doNotCopy'], 'revisit_when': r['revisitTrigger'],
        })
    for c in refs['citationPlaceholders']:
        citations.append({'turn_id': c['sourceTurnId'], 'item_id': c['sourceItemId'],
                          'index': int(c['index']), 'claim': c['claim'],
                          'source_ids': [c['resourceId']], 'mapping': 'contextual',
                          'record_path': refs_path})
    collections.append({'id': 'enterprise-references', 'path': refs_path,
                        'source_count': len(refs['resources'])})
    base_specs = [
        ('enterprise-provenance', 'vault/provenance/catalog.json'),
        ('reporting-provenance', 'vault/provenance/reporting/catalog.json'),
        ('work-system-provenance', 'vault/provenance/work-system/catalog.json'),
    ]
    known = {rel for _, rel in base_specs}
    extras = [('provenance-' + p.parent.relative_to(ROOT / 'vault/provenance').as_posix().replace('/', '-'),
               p.relative_to(ROOT).as_posix())
              for p in sorted((ROOT / 'vault/provenance').rglob('catalog.json'))
              if p.relative_to(ROOT).as_posix() not in known]
    for namespace, rel in base_specs + extras:
        data = read(rel)
        for s in data['sources']:
            sources.append({
                'id': namespace + ':' + s['slug'], 'kind': 'external-url',
                'collection': namespace, 'title': s['title'],
                'original_locator': s.get('original_url'), 'canonical_url': s['url'],
                'reviewed_at': data['as_of'], 'evidence_status': s['status'],
                'summary': s['summary_zh'], 'purpose_tags': s.get('purpose_tags', []),
                'local_card': s.get('card_path') or str(Path(rel).parent / 'cards' / (s['slug'] + '.md')), 'record_path': rel,
                'limitations': [s['limits']], 'revisit_when': s['revisit_trigger'],
            })
        for c in data['occurrences']:
            citations.append({'turn_id': c['archive_turn_id'], 'item_id': c['message_item_id'],
                              'index': int(c['index']), 'claim': c['claim'],
                              'source_ids': [namespace + ':' + slug for slug in c['source_refs']],
                              'mapping': c.get('mapping', 'supplemental-original-missing'),
                              'support': c['support'], 'record_path': rel})
        collections.append({'id': namespace, 'path': rel, 'source_count': len(data['sources'])})
    chats = read('vault/chat-inventory.json')
    materials = []
    chat_lookup = {(m['turn_id'], m['item_id']): t['id']
                   for t in chats['threads'] for m in t['messages']}
    # A newly captured Chat may be registered in intake before the compact
    # inventory is regenerated. Use its explicit conversation_id for this
    # batch so the derived registry remains buildable during handoff.
    for rel in ['vault/intake/sourceweft-praxis-20260928.json']:
        data = read(rel)
        for turn in data['turns']:
            for item in turn['items']:
                chat_lookup.setdefault(
                    (turn['turn_id'], item['item_id']), data['conversation_id']
                )

    def add_message(turn_id, item_id, role, classification, paths, record_path):
        paths = [p if p.startswith(('vault/', 'palantir/', 'tally/'))
                 else 'vault/distilled/' + p for p in paths]
        materials.append({'id': 'chat:' + chat_lookup[(turn_id, item_id)] + ':' + item_id,
                          'kind': 'chat-message', 'conversation_id': chat_lookup[(turn_id, item_id)],
                          'turn_id': turn_id, 'item_id': item_id, 'role': role,
                          'classification': classification, 'processing_status': 'distilled',
                          'distilled_paths': paths, 'record_path': record_path})

    for rel in ['vault/intake/materials.json', 'vault/intake/reporting-materials.json']:
        for turn in read(rel)['materials']:
            for item in turn['items']:
                add_message(turn['turnId'], item['itemId'], item['actor'], item['role'],
                            item['mappedTo'], rel)
    rel = 'vault/intake/work-system-materials.json'
    for item in read(rel)['messages']:
        add_message(item['turn_id'], item['item_id'], item['role'], item['classification'],
                    item['distilled_paths'], rel)
    for path in sorted([*(ROOT / 'vault/intake').glob('work-system-increment-r*.json'),
                        ROOT / 'vault/intake/material-classification.json']):
        rel = path.relative_to(ROOT).as_posix()
        for turn in read(rel)['turns']:
            for item in turn['items']:
                add_message(turn['turn_id'], item['item_id'], item['role'], item['classification'],
                            item['distilled_paths'], rel)
    for rel in ['vault/intake/architecture-review-2026-09-20.json']:
        for turn in read(rel)['turns']:
            for item in turn['items']:
                add_message(turn['turn_id'], item['item_id'], item['role'], item['classification'],
                            item['distilled_paths'], rel)
    for rel in ['vault/intake/platform-grammar-20260922.json',
                'vault/intake/ai-capability-assessment-20260923.json',
                'vault/intake/opus-remotion-video-20260927.json',
                'vault/intake/design-grammar-20260927.json',
                'vault/intake/sourceweft-praxis-20260928.json',
                'vault/intake/visual-grammar-20260928.json']:
        for turn in read(rel)['turns']:
            for item in turn['items']:
                add_message(turn['turn_id'], item['item_id'], item['role'], item['classification'],
                            item['distilled_paths'], rel)
    for rel in ['vault/intake/opus-remotion-video-20260927.json',
                'vault/intake/design-grammar-20260927.json']:
        for item in read(rel).get('external_reference_placeholders', {}).get('items', []):
            citations.append({
                'turn_id': item['turn_id'], 'item_id': item['message_item_id'],
                'index': int(item['index']), 'claim': item['claim'],
                'source_ids': item.get('source_ids', []),
                'mapping': item.get('mapping', 'missing-original'),
                'support': item.get('support', 'unavailable'), 'record_path': rel,
            })
    # Reading-list intake registers leads without claiming source consumption.
    rel = 'vault/intake/palantir-20261001.json'
    data = read(rel)
    for turn in data['turns']:
        for item in turn['items']:
            add_message(turn['turn_id'], item['item_id'], item['role'],
                        item['classification'], item['distilled_paths'], rel)
            materials[-1]['processing_status'] = 'registered'
    for source in data['explicit_url_identities']:
        sources.append({
            'id': source['source_id'], 'kind': 'external-url', 'collection': data['id'],
            'title': source['original_url'], 'original_locator': source['original_url'],
            'canonical_url': source['canonical_url'], 'reviewed_at': source['accessed_at'],
            'evidence_status': source['status'], 'summary': source['summary'],
            'purpose_tags': ['reading-list'], 'local_card': source['local_card'],
            'record_path': rel, 'limitations': source['limitations'],
            'revisit_when': source['revisit_when'],
        })
    for item in data['citation_placeholders']:
        citations.append({
            'turn_id': item['turn_id'], 'item_id': item['message_item_id'],
            'index': int(item['index']), 'claim': '历史 Chat 引用；原始映射未恢复',
            'source_ids': [], 'mapping': item['mapping'],
            'support': item['support'], 'record_path': rel,
        })
    collections.append({'id': data['id'], 'path': rel,
                        'source_count': len(data['explicit_url_identities'])})
    # Whole local packages snapshotted from disk: one source record each.
    for rel in ['vault/intake/tally-saas-20261001.json',
                'vault/intake/design-grammar-atlas-20261002.json',
                'vault/intake/design-kit-workorders-20261002.json',
                'vault/intake/write-present-supplement-20261002.json',
                'vault/intake/content-architecture-review-20261002.json']:
        data = read(rel)
        sources.append({
            'id': data['id'], 'kind': data['kind'], 'collection': data['topic'],
            'title': data['title'], 'original_locator': data['source_root'],
            'canonical_url': None, 'reviewed_at': data['created_at'],
            'evidence_status': data['evidence_status'], 'summary': data['summary'],
            'purpose_tags': data.get('purpose_tags', ['reading-list']), 'local_card': data['local_card'],
            'record_path': rel, 'limitations': data['limitations'],
            'revisit_when': data['revisit_when'],
        })
        collections.append({'id': data['topic'], 'path': rel, 'source_count': 1})
    return {'schema_version': '1.0', 'generated_from': 'scripts/build_registry.py',
            'note': 'Derived index; edit source catalogs, then rebuild. Snapshot processing status remains in intake.',
            'collections': collections, 'chat_counts': chats['counts'],
            'sources': sources, 'materials': materials, 'citation_mappings': citations,
            'counts': {'distilled_messages': len(materials), 'source_records': len(sources),
                       'unique_canonical_urls': len({s['canonical_url'] for s in sources if s['canonical_url']}),
                       'citation_mappings': len(citations)}}


if __name__ == '__main__':
    result = build()
    (ROOT / 'vault/registry.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result['counts'], ensure_ascii=False))
