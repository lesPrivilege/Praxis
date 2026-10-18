"""Read, edit and validate the two ledgers: research/claims.jsonl and research/assets.jsonl.

  python3 build/ledger.py check                      schema, unique IDs, known sources, status words
  python3 build/ledger.py export                     write assembly/ledgers.js for the stage (also after every edit)
  python3 build/ledger.py show iu.hh-stop            one row
  python3 build/ledger.py set iu.hh-stop quote_zh='…' screen_locator='…' review_state=checked
  python3 build/ledger.py add claims '{"claim_id": "…", …}'     (found_by and reviewer default to main)
  python3 build/ledger.py used                       claims and assets the stage pages use, by unit
  python3 build/ledger.py batch patch.json           {"set": {id: {field: value}}, "add": {"claims": [rows]}}

`set` and `add` take values as plain strings; a value that parses as JSON (a list, true, a number) is stored
as that JSON. Rows edited here record reviewer=main.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = {'claims': ROOT / 'research' / 'claims.jsonl', 'assets': ROOT / 'research' / 'assets.jsonl'}
KEY = {'claims': 'claim_id', 'assets': 'asset_id'}
CLAIM_TYPES = {'direct-source', 'eyewitness', 'official-record', 'inference', 'unresolved', 'synthetic'}
REVIEW = {'checked', 'checked-with-limits', 'needs-fix', 'explorer-only', 'unchecked', 'unverified'}
RIGHTS = {'approved', 'commentary-review', 'research-only', 'unknown', 'blocked'}


def export():
    """assembly/ledgers.js: the fields the stage needs from both ledgers and the source list."""
    claims = {c['claim_id']: c for c in load('claims')}
    assets = {a['asset_id']: a for a in load('assets')}
    sources = {s['source_id']: s for s in json.loads((ROOT / 'research' / 'sources.json').read_text())['sources']}
    keep_c = ('claim_id', 'unit', 'source_id', 'claim_type', 'statement_zh', 'quote_en', 'quote_zh', 'screen_locator', 'review_state')
    keep_a = ('asset_id', 'title', 'creator', 'license', 'credit_text', 'rights_status', 'local_path')
    keep_s = ('source_id', 'title', 'author', 'credit_zh', 'kind')
    # an episode builder may add the Chinese rendering and on-screen locator of its own unit's claims
    # in episodes/<dir>/ledger-patch.json; nothing else is taken from those files
    for patch in sorted((ROOT / 'episodes').glob('*/ledger-patch.json')):
        unit = json.loads((patch.parent / 'script.json').read_text())['unit']
        for cid, fields in json.loads(patch.read_text()).get('set', {}).items():
            c = claims.get(cid)
            if c and c.get('unit') == unit:
                for f in ('quote_zh', 'screen_locator'):
                    if fields.get(f) and not c.get(f): c[f] = fields[f]
    pick = lambda d, keep: {k: {f: v.get(f) for f in keep} for k, v in d.items()}
    (ROOT / 'assembly' / 'ledgers.js').write_text(
        'window.CLAIMS = ' + json.dumps(pick(claims, keep_c), ensure_ascii=False) + ';\n'
        + 'window.ASSETS = ' + json.dumps(pick(assets, keep_a), ensure_ascii=False) + ';\n'
        + 'window.SOURCES = ' + json.dumps(pick(sources, keep_s), ensure_ascii=False) + ';\n')


def load(kind):
    return [json.loads(l) for l in FILES[kind].read_text().splitlines() if l.strip()]


def save(kind, rows):
    FILES[kind].write_text(''.join(json.dumps(r, ensure_ascii=False) + '\n' for r in rows))
    if (ROOT / 'research' / 'sources.json').exists(): export()


def kind_of(ident):
    return 'claims' if any(r['claim_id'] == ident for r in load('claims')) else 'assets'


def value(v):
    try:
        return json.loads(v)
    except ValueError:
        return v


def check():
    errs = []
    sources = {s['source_id'] for s in json.loads((ROOT / 'research' / 'sources.json').read_text())['sources']}
    for kind in FILES:
        rows = load(kind)
        ids = [r[KEY[kind]] for r in rows]
        dup = {i for i in ids if ids.count(i) > 1}
        if dup: errs.append(f'{kind}: duplicate IDs {sorted(dup)}')
        for r in rows:
            i = r[KEY[kind]]
            if kind == 'claims':
                if r.get('claim_type') not in CLAIM_TYPES: errs.append(f'{i}: claim_type {r.get("claim_type")}')
                if r.get('review_state') not in REVIEW: errs.append(f'{i}: review_state {r.get("review_state")}')
                if r.get('source_id') not in sources: errs.append(f'{i}: unknown source {r.get("source_id")}')
                if not r.get('statement_zh') or not r.get('locators'): errs.append(f'{i}: statement or locator missing')
            else:
                if r.get('rights_status') not in RIGHTS: errs.append(f'{i}: rights_status {r.get("rights_status")}')
                if r.get('use') and r.get('rights_status') in ('approved', 'commentary-review') and not r.get('license_evidence'):
                    errs.append(f'{i}: used without licence evidence')
    print('\n'.join(errs) if errs else 'ledgers ok')
    return not errs


def used():
    for kind, attr, fn in (('claims', 'claim', 'K.quote|K.source|Film.claim'), ('assets', 'asset', 'K.figure|Film.asset')):
        pat = re.compile(r"['\"]((?:ov|iu|im|gtd|pr|lt|all)\.[\w\-]+)['\"]")
        for p in sorted((ROOT / 'episodes').glob('*/scenes.js')):
            ids = sorted(set(pat.findall(p.read_text())))
            known = {r[KEY[kind]] for r in load(kind)}
            hits = [i for i in ids if i in known]
            print(f'{kind:6s} {p.parent.name:28s} {len(hits)}', ' '.join(hits))


def main():
    a = sys.argv[1:]
    if a and a[0] == 'export':
        export(); print('assembly/ledgers.js written'); return
    if not a or a[0] == 'check':
        sys.exit(0 if check() else 1)
    if a[0] == 'show':
        k = kind_of(a[1]); print(json.dumps(next(r for r in load(k) if r[KEY[k]] == a[1]), ensure_ascii=False, indent=1)); return
    if a[0] == 'set':
        k = kind_of(a[1]); rows = load(k)
        row = next(r for r in rows if r[KEY[k]] == a[1])
        for kv in a[2:]:
            f, _, v = kv.partition('='); row[f] = value(v)
        row['reviewer'] = 'main'
        save(k, rows); print('set', a[1]); return
    if a[0] == 'add':
        k = a[1]; rows = load(k); row = json.loads(a[2])
        row.setdefault('found_by', 'main'); row.setdefault('reviewer', 'main')
        if any(r[KEY[k]] == row[KEY[k]] for r in rows): raise SystemExit(f'{row[KEY[k]]} exists')
        rows.append(row); save(k, rows); print('added', row[KEY[k]]); return
    if a[0] == 'used':
        used(); return
    if a[0] == 'batch':
        patch = json.loads(Path(a[1]).read_text())
        for k in FILES:
            rows = load(k); byid = {r[KEY[k]]: r for r in rows}
            for ident, fields in patch.get('set', {}).items():
                if ident in byid:
                    byid[ident].update(fields); byid[ident]['reviewer'] = 'main'
            for row in patch.get('add', {}).get(k, []):
                if row[KEY[k]] in byid: raise SystemExit(f'{row[KEY[k]]} exists')
                row.setdefault('found_by', 'main'); row.setdefault('reviewer', 'main'); rows.append(row)
            save(k, rows)
        missing = [i for i in patch.get('set', {}) if not any(i == r[KEY[k]] for k in FILES for r in load(k))]
        if missing: raise SystemExit(f'not found: {missing}')
        print('batch applied'); check(); return
    raise SystemExit(__doc__)


if __name__ == '__main__':
    main()
