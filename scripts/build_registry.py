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
                'original_locator': None, 'canonical_url': s['url'],
                'reviewed_at': data['as_of'], 'evidence_status': s['status'],
                'summary': s['summary_zh'], 'purpose_tags': s.get('purpose_tags', []),
                'local_card': s.get('card_path') or str(Path(rel).parent / 'cards' / (s['slug'] + '.md')), 'record_path': rel,
                'limitations': [s['limits']], 'revisit_when': s['revisit_trigger'],
            })
        for c in data['occurrences']:
            citations.append({'turn_id': c['archive_turn_id'], 'item_id': c['message_item_id'],
                              'index': int(c['index']), 'claim': c['claim'],
                              'source_ids': [namespace + ':' + slug for slug in c['source_refs']],
                              'mapping': 'supplemental-original-missing',
                              'support': c['support'], 'record_path': rel})
        collections.append({'id': namespace, 'path': rel, 'source_count': len(data['sources'])})
    chats = read('vault/chat-inventory.json')
    materials = []
    chat_lookup = {(m['turn_id'], m['item_id']): t['id']
                   for t in chats['threads'] for m in t['messages']}

    def add_message(turn_id, item_id, role, classification, paths, record_path):
        paths = [p if p.startswith('vault/') else 'vault/distilled/' + p for p in paths]
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
    for path in sorted((ROOT / 'vault/intake').glob('work-system-increment-r*.json')):
        rel = path.relative_to(ROOT).as_posix()
        for turn in read(rel)['turns']:
            for item in turn['items']:
                add_message(turn['turn_id'], item['item_id'], item['role'], item['classification'],
                            item['distilled_paths'], rel)
    return {'schema_version': '1.0', 'generated_from': 'scripts/build_registry.py',
            'note': 'Derived index; edit source catalogs, then rebuild. Snapshot processing status remains in intake.',
            'collections': collections, 'chat_counts': chats['counts'],
            'sources': sources, 'materials': materials, 'citation_mappings': citations,
            'counts': {'distilled_messages': len(materials), 'source_records': len(sources),
                       'unique_canonical_urls': len({s['canonical_url'] for s in sources}),
                       'citation_mappings': len(citations)}}


if __name__ == '__main__':
    result = build()
    (ROOT / 'vault/registry.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result['counts'], ensure_ascii=False))
