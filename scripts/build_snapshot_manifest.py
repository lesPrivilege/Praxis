#!/usr/bin/env python3
"""Register source snapshots; refuse silent changes to already registered bytes."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'vault/snapshot-manifest.json'


def read(rel):
    return json.loads((ROOT / rel).read_text())


expected = {}
for project in read('vault/intake/local-projects.json')['projects']:
    for item in project['files']:
        expected[item['snapshotPath']] = {'sha256': item['sha256'],
                                         'original_locator': item['originalPath'],
                                         'source_mtime': item['originalMtime'],
                                         'record_path': 'vault/intake/local-projects.json'}
for item in read('vault/intake/downloads.json')['entries']:
    expected[item['snapshotPath']] = {'sha256': item['sha256'],
                                     'original_locator': item['originalPath'],
                                     'source_mtime': item['mtimeUtc'],
                                     'record_path': 'vault/intake/downloads.json'}
# Versioned intake copies and independently captured external source bodies.
for intake in sorted((ROOT / 'vault/intake').glob('*.json')):
    rel = intake.relative_to(ROOT).as_posix()
    for item in read(rel).get('source_snapshots', []):
        expected[item['snapshot_path']] = {'sha256': item['sha256'],
                                           'original_locator': item['original_path'],
                                           'source_mtime': item['source_mtime'],
                                           'record_path': rel}
for catalog in sorted((ROOT / 'vault/provenance').rglob('catalog.json')):
    rel = catalog.relative_to(ROOT).as_posix()
    for source in read(rel)['sources']:
        if not source.get('snapshot_path'):
            continue
        expected[source['snapshot_path']] = {'sha256': source['snapshot_sha256'],
                                             'original_locator': source.get('original_url') or source['url'],
                                             'source_mtime': None,
                                             'record_path': rel}
old = {item['path']: item['sha256'] for item in read('vault/snapshot-manifest.json')['files']} if DEST.exists() else {}
paths = []
for name in ['courtwork', 'career-kit', 'downloads']:
    paths.extend(p for p in (ROOT / 'vault/snapshots/local' / name).rglob('*') if p.is_file())
paths.extend((ROOT / 'vault/archive/chat').glob('*.json'))
paths.extend(ROOT / rel for rel in expected)
paths = set(paths)
records = []
for p in sorted(paths):
    rel = p.relative_to(ROOT).as_posix()
    sha = hashlib.sha256(p.read_bytes()).hexdigest()
    original = expected.get(rel)
    if original and original['sha256'] != sha:
        raise SystemExit(f'Source copy does not match intake hash: {rel}')
    if rel in old and old[rel] != sha:
        raise SystemExit(f'Immutable snapshot changed: {rel}; create a new versioned path')
    records.append({'path': rel, 'sha256': sha, 'size_bytes': p.stat().st_size,
                    'kind': 'source-copy' if original else ('chat-capture' if '/archive/' in rel else 'extracted-or-support'),
                    'original_locator': original['original_locator'] if original else None,
                    'source_mtime': original['source_mtime'] if original else None,
                    'record_path': original['record_path'] if original else
                        ('vault/chat-inventory.json' if '/archive/' in rel else 'vault/intake/downloads.json')})
missing = set(expected) - {r['path'] for r in records}
if missing:
    raise SystemExit('Missing registered copies: ' + ', '.join(sorted(missing)))
result = {'schema_version': '1.0', 'generated_from': 'scripts/build_snapshot_manifest.py',
          'counts': {'files': len(records), 'unique_content_hashes': len({r['sha256'] for r in records}),
                     'bytes': sum(r['size_bytes'] for r in records)}, 'files': records}
DEST.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result['counts']))
