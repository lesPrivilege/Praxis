"""Download the external images listed in research/assets.jsonl and check them against the ledger.

Only rows marked `use`, with a `file_url`, a `local_path` under assets/files/ and a status the build
accepts are fetched. A row that already has a `sha256` must match it; a new download is reported with its hash
so the ledger can record it. Files stay out of Git.

  python3 build/fetch_assets.py           fetch what is missing, verify everything
  python3 build/fetch_assets.py --check   verify only
"""
import hashlib, json, sys, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = 'PraxisSeriesBuild/0.1 (https://github.com/lesPrivilege/Praxis; personal research video) python-urllib'
OK = {'approved', 'commentary-review'}


def main():
    rows = [json.loads(l) for l in (ROOT / 'research' / 'assets.jsonl').read_text().splitlines() if l.strip()]
    bad = 0
    for r in rows:
        if not r.get('use') or r.get('rights_status') not in OK or not r.get('file_url') or not r.get('local_path'):
            continue
        p = ROOT / r['local_path']
        if not p.exists():
            if '--check' in sys.argv:
                print('missing ', r['asset_id']); bad += 1; continue
            p.parent.mkdir(parents=True, exist_ok=True)
            req = urllib.request.Request(r['file_url'], headers={'User-Agent': UA})
            try:
                p.write_bytes(urllib.request.urlopen(req, timeout=60).read())
            except Exception as e:
                print('FAILED  ', r['asset_id'], e); bad += 1; continue
            time.sleep(1.0)
        h = hashlib.sha256(p.read_bytes()).hexdigest()
        if r.get('sha256') and r['sha256'] != h:
            print('MISMATCH', r['asset_id'], h); bad += 1
        else:
            print('ok      ', r['asset_id'], h if not r.get('sha256') else '', p.stat().st_size)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
