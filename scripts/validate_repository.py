#!/usr/bin/env python3
"""Validate maintained entries, JSON, local links and registered immutable snapshots."""
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
OWNED = ['docs', 'kit', 'scenarios', 'templates', 'demos', 'vault', 'scripts']
errors = []
counts = {'markdown': 0, 'json': 0, 'snapshots': 0}


def managed(path):
    rel = path.relative_to(ROOT).as_posix()
    return not rel.startswith('vault/snapshots/local/')


def markdown_targets(content):
    # Balanced parentheses and angle-wrapped paths are both valid CommonMark links.
    for match in re.finditer(r'\[[^\]]*\]\(', content):
        start = match.end()
        if content[start:start + 1] == '<':
            end = content.find('>', start + 1)
            if end >= 0:
                yield content[start + 1:end]
            continue
        depth, cursor = 1, start
        while cursor < len(content) and depth:
            if content[cursor] == '\\':
                cursor += 2
                continue
            if content[cursor] == '(':
                depth += 1
            elif content[cursor] == ')':
                depth -= 1
            cursor += 1
        if depth == 0:
            yield content[start:cursor - 1]


for name in OWNED:
    base = ROOT / name
    for directory in [base, *sorted(p for p in base.rglob('*') if p.is_dir())]:
        if '__pycache__' in directory.parts or not managed(directory):
            continue
        if not (directory / 'README.md').exists():
            errors.append(f'Missing README: {directory.relative_to(ROOT)}')

paths = [ROOT / 'README.md', ROOT / 'AGENTS.md', ROOT / 'CHANGELOG.md']
for name in OWNED:
    paths.extend(p for p in (ROOT / name).rglob('*') if p.is_file() and managed(p))
for path in paths:
    if path.suffix == '.json':
        counts['json'] += 1
        try:
            json.loads(path.read_text())
        except (ValueError, UnicodeError) as e:
            errors.append(f'Invalid JSON: {path.relative_to(ROOT)}: {e}')
    if path.suffix != '.md':
        continue
    counts['markdown'] += 1
    content = re.sub(r'```.*?```', '', path.read_text(), flags=re.S)
    for raw_target in markdown_targets(content):
        target = raw_target.strip().split(' "')[0].strip('<>')
        if not target or target.startswith('#') or urlsplit(target).scheme:
            continue
        clean = unquote(target.split('#')[0].split('?')[0])
        if clean.startswith('/'):
            errors.append(f'Nonportable link: {path.relative_to(ROOT)} -> {target}')
            continue
        resolved = (path.parent / clean).resolve()
        if not resolved.is_relative_to(ROOT):
            errors.append(f'External local dependency: {path.relative_to(ROOT)} -> {target}')
        elif not resolved.exists():
            errors.append(f'Broken link: {path.relative_to(ROOT)} -> {target}')

manifest = ROOT / 'vault' / 'snapshot-manifest.json'
if manifest.exists():
    data = json.loads(manifest.read_text())
    seen = set()
    for item in data['files']:
        rel = item['path']
        if rel in seen:
            errors.append(f'Duplicate snapshot: {rel}')
        seen.add(rel)
        path = ROOT / rel
        if not path.is_file():
            errors.append(f'Missing snapshot: {rel}')
        elif hashlib.sha256(path.read_bytes()).hexdigest() != item['sha256']:
            errors.append(f'Hash mismatch: {rel}')
        counts['snapshots'] += 1

for capture in json.loads((ROOT / 'vault/intake/chat-captures.json').read_text())['threads']:
    for archive in capture['versions']:
        data = json.loads((ROOT / archive).read_text())
        if data['page']['hasMore'] or data['thread']['id'] != capture['conversation_id']:
            errors.append(f'Incomplete or mismatched chat capture: {archive}')

inventory_path = ROOT / 'vault/chat-inventory.json'
if inventory_path.exists():
    inventory = json.loads(inventory_path.read_text())
    identities = set()
    for thread in inventory['threads']:
        path = ROOT / thread['archive_path']
        if hashlib.sha256(path.read_bytes()).hexdigest() != thread['sha256']:
            errors.append(f"Chat archive changed: {thread['archive_path']}")
        for message in thread['messages']:
            identity = (thread['id'], message['turn_id'], message['item_id'])
            if identity in identities:
                errors.append(f'Duplicate message identity: {identity}')
            identities.add(identity)
    if len(identities) != inventory['counts']['messages']:
        errors.append('Chat message count does not match inventory')

registry_path = ROOT / 'vault/registry.json'
if registry_path.exists():
    registry = json.loads(registry_path.read_text())
    source_ids = [source['id'] for source in registry['sources']]
    for source in registry['sources']:
        if not source['summary'] or not source['evidence_status']:
            errors.append(f"Incomplete source record: {source['id']}")
        if not source['local_card'] or not (ROOT / source['local_card']).is_file():
            errors.append(f"Missing source card: {source['id']}")
    if len(source_ids) != len(set(source_ids)):
        errors.append('Duplicate source IDs in registry')
    expected_citations = {(m['turn_id'], m['item_id'], int(i))
                          for t in inventory['threads'] for m in t['messages']
                          for i in m['citation_indices']}
    actual_citations = set()
    for mapping in registry['citation_mappings']:
        identity = (mapping['turn_id'], mapping['item_id'], mapping['index'])
        if identity in actual_citations:
            errors.append(f'Duplicate citation mapping: {identity}')
        actual_citations.add(identity)
        for source_id in mapping['source_ids']:
            if source_id not in source_ids:
                errors.append(f'Unknown source in citation mapping: {source_id}')
    if expected_citations != actual_citations:
        errors.append(f'Citation coverage: {len(expected_citations - actual_citations)} missing, '
                      f'{len(actual_citations - expected_citations)} unexpected')
    expected_urls = {u for t in inventory['threads'] for m in t['messages'] for u in m['explicit_urls']}
    actual_urls = {s['original_locator'] for s in registry['sources'] if s['original_locator']}
    if not expected_urls.issubset(actual_urls):
        errors.append(f'Explicit source URLs missing: {len(expected_urls - actual_urls)}')
    mapped_messages = set()
    for material in registry['materials']:
        identity = (material['conversation_id'], material['turn_id'], material['item_id'])
        if identity in mapped_messages:
            errors.append(f'Duplicate material mapping: {identity}')
        mapped_messages.add(identity)
        if not material['distilled_paths']:
            errors.append(f'Missing distillation destination: {identity}')
        for rel in material['distilled_paths']:
            if not (ROOT / rel).is_file():
                errors.append(f'Missing distillation file: {rel}')
    if mapped_messages != identities:
        errors.append(f'Message coverage: {len(identities - mapped_messages)} missing, '
                      f'{len(mapped_messages - identities)} unexpected')
    counts['distilled_messages'] = len(mapped_messages)
    from build_registry import build
    if registry != build():
        errors.append('Registry is stale; run python3 scripts/build_registry.py')
    counts['source_records'] = len(source_ids)
    counts['citation_mappings'] = len(actual_citations)

print(json.dumps({'counts': counts, 'errors': errors, 'status': 'fail' if errors else 'pass'}, ensure_ascii=False, indent=2))
sys.exit(bool(errors))
