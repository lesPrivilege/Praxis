#!/usr/bin/env python3
"""Check this project's registration, not SVG behavior or consumer effectiveness."""
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROJECT = Path(__file__).resolve().parent


def check():
    catalog = json.loads((PROJECT / 'catalog.json').read_text())
    fixtures = json.loads((PROJECT / 'fixtures.json').read_text())
    intake = json.loads((ROOT / 'vault/intake/editable-native-svg-20261004.json').read_text())
    sources = json.loads((ROOT / 'vault/provenance/editable-native-svg-20261004/catalog.json').read_text())
    errors = []
    items = catalog['requirements']
    ids = [item['id'] for item in items]
    if len(ids) != len(set(ids)):
        errors.append('Duplicate requirement ID')
    counts = dict(Counter(item['kind'] for item in items))
    if counts != catalog['counts'] or len(items) != intake['scope']['requirements']:
        errors.append('Requirement counts disagree')
    source_ids = {s['ledger_id'] for s in sources['sources']}
    basis = source_ids | {'L01', 'L02', 'L03', 'L04', 'L05'}
    for item in items:
        for field in ['job', 'input_shape', 'invariants', 'editable', 'bounds', 'avoid_when', 'basis']:
            if not item.get(field):
                errors.append(f"{item['id']}: empty {field}")
        if set(item['compose_with']) - set(ids) or item['id'] in item['compose_with']:
            errors.append(f"{item['id']}: invalid composition target")
        if set(item['basis']) - basis:
            errors.append(f"{item['id']}: unknown basis")
        if item['work_order'] not in {'SVG-01', 'SVG-02', 'SVG-03', 'none'}:
            errors.append(f"{item['id']}: unknown initial work order")
        for field in ['artifact_entry', 'preview_entry']:
            if item[field] is not None and not (PROJECT / item[field]).exists():
                errors.append(f"{item['id']}: missing {field}")
    fids = [f['id'] for f in fixtures['fixtures']]
    if len(fids) != len(set(fids)) or not fixtures['synthetic']:
        errors.append('Invalid fixture identities or synthetic boundary')
    for fixture in fixtures['fixtures']:
        if set(fixture['requirements']) - set(ids) or not fixture['expected'] or not fixture['negative']:
            errors.append(f"{fixture['id']}: missing expectation or unknown requirement")
    for picture in intake['images']:
        path = ROOT / picture['path']
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != picture['sha256']:
            errors.append(f"Image changed: {picture['path']}")
    for rel in intake['deliverables']:
        if not (ROOT / rel).is_file():
            errors.append(f'Missing deliverable: {rel}')
    kind_counts = dict(Counter(s['access'] for s in sources['sources']))
    if kind_counts != {'text-read-online': 15, 'outline-only-body-incomplete': 1, 'failed': 2}:
        errors.append('Source read scope disagrees')
    if any(s['image_viewed'] for s in sources['sources']):
        errors.append('External image claim exceeds actual review')
    return {'status': 'fail' if errors else 'pass', 'requirements': counts,
            'fixtures': len(fids), 'composition_links': sum(len(i['compose_with']) for i in items),
            'external_sources': len(source_ids), 'source_read_scope': kind_counts,
            'existing_image_hashes': len(intake['images']), 'errors': errors,
            'boundary': 'Registration, links by repository validator, and recorded image hashes only; no SVG, rendering, runtime, Flash, accessibility or audience validation.'}


if __name__ == '__main__':
    result = check()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(result['status'] != 'pass')
