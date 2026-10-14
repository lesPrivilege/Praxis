#!/usr/bin/env python3
"""Re-run delivered acceptance entry points without changing frozen teaching files."""
import hashlib
import io
import json
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
FROZEN = '5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b'


def run(command, cwd=ROOT):
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True)
    return dict(command=command, exit_code=result.returncode,
                stdout=result.stdout.replace(str(ROOT), '<review-worktree>'),
                stderr=result.stderr.replace(str(ROOT), '<review-worktree>'))


def main():
    commands = [
        ['python3', 'scripts/build_saas_atlas_indexes.py', '--check'],
        ['python3', 'scripts/validate_saas_atlas.py', '--self-test'],
        ['python3', 'scripts/validate_saas_atlas_integration.py', '--self-test'],
        ['python3', 'scripts/run_saas_atlas_checks.py', '--output',
         str(HERE.relative_to(ROOT) / 'delivered-entry-points.json')],
        ['python3', 'scripts/validate_repository.py'],
        ['git', 'diff', '--check'],
    ]
    results = []
    for command in commands:
        results.append(run(command))
        print(results[-1]['exit_code'], ' '.join(command), flush=True)

    # The documented registry command writes a generated file. Run its exact
    # entry point in an isolated tree containing all tracked JSON inputs, and
    # compare the resulting bytes with the frozen registry without publishing it.
    tracked = subprocess.check_output(
        ['git', 'ls-tree', '-r', '--name-only', FROZEN], cwd=ROOT, text=True).splitlines()
    inputs = [p for p in tracked if p.endswith('.json') and p.startswith('vault/')]
    with tempfile.TemporaryDirectory(prefix='saas-final-registry-') as directory:
        archive = subprocess.check_output(
            ['git', 'archive', FROZEN, 'scripts/build_registry.py', *inputs], cwd=ROOT)
        with tarfile.open(fileobj=io.BytesIO(archive)) as bundle:
            bundle.extractall(directory, filter='data')
        registry = Path(directory) / 'vault/registry.json'
        before = registry.read_bytes()
        result = run(['python3', 'scripts/build_registry.py'], cwd=directory)
        after = registry.read_bytes()
        result.update(isolated_frozen_tree=True, byte_identical=before == after,
                      frozen_sha256=hashlib.sha256(before).hexdigest(),
                      rebuilt_sha256=hashlib.sha256(after).hexdigest())
        results.append(result)
        print(result['exit_code'], 'isolated registry rebuild', result['byte_identical'], flush=True)
    report = dict(reviewed_commit=FROZEN, results=results,
                  status='pass' if all(r['exit_code'] == 0 and r.get('byte_identical', True)
                                       for r in results) else 'fail',
                  scope='Delivered local entry points; no remote workflow, provider, deployment or dependency installation.')
    (HERE / 'delivered-checks.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    return report['status'] != 'pass'


if __name__ == '__main__':
    sys.exit(main())
