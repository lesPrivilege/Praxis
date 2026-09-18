#!/usr/bin/env python3
"""Build the active message inventory and explicit archive revision history."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel):
    return json.loads((ROOT / rel).read_text())


threads, revisions = [], []
for entry in read('vault/intake/chat-captures.json')['threads']:
    rel = entry['active_archive']
    data = read(rel)
    if data['thread']['id'] != entry['conversation_id'] or data['page']['hasMore']:
        raise SystemExit(f'Incomplete or mismatched active capture: {rel}')
    messages = []
    for turn in data['turns']:
        for item in turn['items']:
            text = item.get('text') or '\n'.join(c.get('text', '') for c in item.get('content', []) if c.get('type') == 'text')
            messages.append({'turn_id': turn['id'], 'item_id': item['id'], 'role': item['type'],
                             'characters': len(text),
                             'citation_indices': re.findall(r':chatgpt-content-reference\{index="(\d+)"\}', text),
                             'explicit_urls': re.findall(r'https?://[^\s)<>]+', text)})
    threads.append({'id': data['thread']['id'], 'title': data['thread']['title'],
                    'archive_path': rel, 'sha256': hashlib.sha256((ROOT / rel).read_bytes()).hexdigest(),
                    'turn_count': len(data['turns']), 'message_count': len(messages), 'has_more': False,
                    'attachments_exposed': len(data.get('attachments', [])), 'messages': messages})
    for previous, current in zip(entry['versions'], entry['versions'][1:]):
        old = {t['id']: t for t in read(previous)['turns']}
        new = {t['id']: t for t in read(current)['turns']}
        added = [t for id_, t in new.items() if id_ not in old]
        revisions.append({'conversation_id': entry['conversation_id'], 'previous_archive': previous,
                          'current_archive': current, 'added_turns': len(added),
                          'added_messages': sum(len(t['items']) for t in added),
                          'changed_existing_turns': [id_ for id_ in new.keys() & old.keys() if new[id_]['items'] != old[id_]['items']],
                          'missing_previous_turns': sorted(old.keys() - new.keys())})
result = {'schema_version': '1.0', 'generated_from': 'scripts/build_chat_inventory.py',
          'purpose': 'Latest complete captures; older versions and preview receipts remain archived.',
          'threads': threads, 'revision_history': revisions,
          'counts': {'threads': len(threads), 'turns': sum(t['turn_count'] for t in threads),
                     'messages': sum(t['message_count'] for t in threads),
                     'citation_occurrences': sum(len(m['citation_indices']) for t in threads for m in t['messages']),
                     'explicit_url_occurrences': sum(len(m['explicit_urls']) for t in threads for m in t['messages'])}}
(ROOT / 'vault/chat-inventory.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result['counts']))
