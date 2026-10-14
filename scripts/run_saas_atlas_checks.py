#!/usr/bin/env python3
"""Run the atlas authors' local Python checks; no provider or application E2E."""
import argparse
import json
from pathlib import Path
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[1]
ATLAS=ROOT/'vault/distilled/saas-engineering-atlas'

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,help='Optional JSON receipt (default prints summary only)')
    args=parser.parse_args()
    paths=sorted((ATLAS/'packages').glob('*/*.py'))
    if (ATLAS/'foundations').is_dir():
        paths+=sorted((ATLAS/'foundations').rglob('*.py'))
    results=[]
    for p in paths:
        cmd=[sys.executable,str(p.relative_to(ROOT))]
        if p.name == 'check_examples.py' and p.parent.name == 'foundations':
            cmd.append('--self-test')
        run=subprocess.run(cmd,cwd=ROOT,capture_output=True,text=True)
        results.append({'command':['python3',*cmd[1:]],'exit_code':run.returncode,'stdout':run.stdout,'stderr':run.stderr})
        print(f"{'PASS' if run.returncode==0 else 'FAIL'} {p.relative_to(ROOT)}",flush=True)
    report={'status':'pass' if all(x['exit_code']==0 for x in results) else 'fail','entry_points':len(results),'results':results,
            'scope':'author synthetic models and metadata checks; no provider, browser E2E, load or AI model execution'}
    if args.output:args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k!='results'},ensure_ascii=False))
    return report['status']!='pass'

if __name__=='__main__':raise SystemExit(main())
