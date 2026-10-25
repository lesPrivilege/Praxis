#!/usr/bin/env python3
"""Probe Praxis MCP/CLI acceptance in disposable repositories; exit 1 on unmet expectations.

Uses real child processes, the repository's registry/snapshot builders, and a local
HTTP source. No dependencies are installed and no live Praxis data is changed.
"""
import json
import os
import platform
import re
import selectors
import shutil
import subprocess
import sys
import tempfile
import threading
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
CATALOG = 'vault/provenance/demo/catalog.json'
SOURCE = 'provenance-demo:source'
TARGET_A = 'dsh-praxis/kit/design/controls.md'
TARGET_B = 'dsh-praxis/kit/design/motion.md'
BINDING_A = f'{SOURCE}@{TARGET_A}'
BINDING_B = f'{SOURCE}@{TARGET_B}'


def write(root, relative, value):
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value if isinstance(value, str) else json.dumps(value), encoding='utf-8')


def build(root):
    subprocess.run(['python3', 'scripts/build_registry.py'], cwd=root,
                   check=True, capture_output=True, text=True, timeout=30)


def fixture(root, source_url):
    for relative in ['scripts/build_registry.py', 'scripts/build_snapshot_manifest.py',
                     'dsh-praxis/package.json', 'dsh-praxis/layers.md']:
        (root / relative).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(REPO / relative, root / relative)
    for directory in ['core', 'adapters']:
        shutil.copytree(REPO / 'dsh-praxis' / directory, root / 'dsh-praxis' / directory)
    for layer in ['task', 'writing', 'design', 'publish']:
        write(root, f'dsh-praxis/kit/{layer}/README.md', f'# {layer}\n\nFixture entry.\n')
    for unit in ['writing/evidence', 'design/foundations/grammar', 'design/controls', 'design/motion']:
        write(root, f'dsh-praxis/kit/{unit}.md', f'# {unit}\n\nFixture description.\n')
    write(root, 'vault/references/catalog.json', {'resources': [], 'citationPlaceholders': []})
    write(root, 'vault/chat-inventory.json', {'threads': [], 'counts': {}})
    empty_catalog = {'sources': [], 'occurrences': [], 'as_of': None, 'cards': 'maintained'}
    for relative in ['vault/provenance/catalog.json', 'vault/provenance/reporting/catalog.json',
                     'vault/provenance/work-system/catalog.json']:
        write(root, relative, empty_catalog)
    # Empty inputs satisfy the real builder's fixed historical intake dependencies.
    builder = (root / 'scripts/build_registry.py').read_text(encoding='utf-8')
    for relative in set(re.findall(r"'(vault/intake/[^']+\.json)'", builder)):
        identity = Path(relative).stem
        write(root, relative, {
            'turns': [], 'materials': [], 'messages': [], 'explicit_url_identities': [],
            'citation_placeholders': [], 'id': identity, 'kind': 'local-fixture',
            'topic': identity, 'title': 'Empty fixture', 'source_root': 'fixture',
            'created_at': None, 'evidence_status': 'partial', 'summary': 'Empty fixture',
            'local_card': None, 'limitations': [], 'revisit_when': 'never',
        })
    write(root, 'vault/intake/local-projects.json', {'projects': []})
    write(root, 'vault/intake/downloads.json', {'entries': []})
    catalog = {**empty_catalog, 'registry_extensions': True, 'sources': [{
        'slug': 'source', 'url': source_url, 'title': 'Existing source', 'status': 'partial',
        'summary_zh': 'Fixture source', 'limits': 'fixture', 'revisit_trigger': 'fixture',
        'grammar_paths': [TARGET_A],
    }]}
    write(root, CATALOG, catalog)
    build(root)
    return catalog


class LocalSource(BaseHTTPRequestHandler):
    body = b'version one'

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        self.wfile.write(self.body)

    def log_message(self, *_args):
        pass


class Probe:
    def __init__(self, root, temporary):
        self.root = root
        self.env = {**os.environ, 'PRAXIS_ROOT': str(root), 'TMPDIR': str(temporary),
                    'USER': 'acceptance-fixture'}
        self.sequence = 0
        self.mcp = subprocess.Popen(
            ['node', str(root / 'dsh-praxis/adapters/mcp.js')], env=self.env,
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    def close(self):
        self.mcp.terminate()
        try:
            self.mcp.wait(timeout=5)
        except subprocess.TimeoutExpired:
            self.mcp.kill()
            self.mcp.wait()
        for stream in [self.mcp.stdin, self.mcp.stdout, self.mcp.stderr]:
            stream.close()

    def cli(self, name, args=None, root=None):
        command = ['node', str(self.root / 'dsh-praxis/adapters/cli.js'), name]
        if isinstance(args, list):
            command.extend(args)
        elif args is not None:
            command.append(args if isinstance(args, str) else json.dumps(args))
        result = subprocess.run(command, env={**self.env, 'PRAXIS_ROOT': str(root or self.root)},
                                text=True, capture_output=True, timeout=30)
        return {'exit': result.returncode,
                'value': json.loads(result.stdout) if result.stdout.strip() else None,
                'stderr': result.stderr.strip()}

    def ok(self, name, args=None, root=None):
        result = self.cli(name, args, root)
        if result['exit']:
            raise RuntimeError(f'{name} failed: {result["stderr"]}')
        return result['value']

    def rpc(self, method, params=None):
        self.sequence += 1
        request = {'jsonrpc': '2.0', 'id': self.sequence, 'method': method, 'params': params or {}}
        self.mcp.stdin.write(json.dumps(request) + '\n')
        self.mcp.stdin.flush()
        with selectors.DefaultSelector() as selector:
            selector.register(self.mcp.stdout, selectors.EVENT_READ)
            if not selector.select(timeout=30):
                raise RuntimeError(f'MCP timeout: {method}')
        line = self.mcp.stdout.readline()
        if not line:
            raise RuntimeError(f'MCP exited before replying to {method}')
        response = json.loads(line)
        if response.get('id') != self.sequence or 'error' in response:
            raise RuntimeError(f'MCP request failed: {response}')
        return response['result']

    def call(self, name, args=None):
        return self.rpc('tools/call', {'name': f'praxis_{name}', 'arguments': args or {}})


def run_checks(probe, temporary, baseline, checks):
    def check(identity, expected, observed, passed):
        checks.append({'id': identity, 'expected': expected, 'observed': observed, 'passed': bool(passed)})

    initialized = probe.rpc('initialize', {'protocolVersion': '2025-11-25',
                                         'clientInfo': {'name': 'acceptance', 'version': '1'}})
    tools = probe.rpc('tools/list')['tools']
    check('mcp_initialize_list', 'Negotiate 2025-11-25 and expose core operations.',
          {'protocol': initialized['protocolVersion'], 'tools': len(tools)},
          initialized['protocolVersion'] == '2025-11-25'
          and {'praxis_curate', 'praxis_bindings', 'praxis_consume'} <= {t['name'] for t in tools})
    first = probe.call('curate', {'binding': BINDING_A, 'expected_revision': 0,
                                 'description': 'Original description', 'favorite': True})
    cli_read = probe.ok('bindings')[0]
    probe.ok('curate', {'binding': BINDING_A, 'expected_revision': 1,
                        'description': 'Replacement description'})
    second = probe.call('bindings')
    mcp_read = json.loads(second['content'][0]['text'])[0]
    check('mcp_cli_shared_state', 'Each process immediately reads the other process write.',
          {'cli_revision': cli_read['revision'], 'mcp_revision': mcp_read['revision'],
           'cli_description': cli_read['description'], 'mcp_description': mcp_read['description']},
          not first.get('isError') and not second.get('isError')
          and cli_read['description'] == 'Original description' and cli_read['revision'] == 1
          and mcp_read['description'] == 'Replacement description' and mcp_read['revision'] == 2)
    for name, args in [('unit', {'ref': 'not-here'}), ('source', {'id': 'not-here'}),
                       ('resolve', {'task_type': 'not-here'})]:
        cli = probe.cli(name, args)
        mcp = probe.call(name, args)
        check(f'{name}_lookup_error', 'Missing lookup returns CLI nonzero and MCP isError:true.',
              {'cli_exit': cli['exit'], 'mcp_isError': mcp.get('isError')},
              cli['exit'] != 0 and mcp.get('isError') is True)

    history = [h for h in probe.ok('history') if h.get('id') == BINDING_A]
    history_text = json.dumps(history)
    check('description_history_values', 'History retains both successive description values.',
          {'entries': len(history), 'old_value_retained': 'Original description' in history_text,
           'new_value_retained': 'Replacement description' in history_text},
          'Original description' in history_text and 'Replacement description' in history_text)
    probe.ok('curate', {'binding': BINDING_B, 'expected_revision': 0, 'description': 'New target'})
    probe.ok('remove', {'binding': BINDING_A, 'expected_revision': 2})
    first_snapshot = probe.ok('refresh', {'source': SOURCE})
    consumed = probe.ok('consume', {'title': 'Source-only consumption', 'sources': [SOURCE]})
    LocalSource.body = b'version two'
    second_snapshot = probe.ok('refresh', {'source': SOURCE})
    stale = probe.ok('stale')
    upkeep = probe.ok('upkeep')
    check('source_refresh_stale', 'A consumed source with changed snapshot marks its run stale.',
          {'snapshot_changed': first_snapshot['snapshot']['sha256'] != second_snapshot['snapshot']['sha256'],
           'stale_runs': len(stale), 'upkeep_stale_runs': len(upkeep['stale']),
           'binding_changed_signal': any('changed' in b['signals'] for b in upkeep['bindings'])},
          any(r['run'] == consumed['id'] for r in stale)
          and any(r['run'] == consumed['id'] for r in upkeep['stale']))

    probe.ok('preset_save', {'pipeline': 'html', 'title': 'A', 'default': True})
    b = probe.ok('preset_save', {'pipeline': 'html', 'title': 'B', 'default': False})
    probe.ok('preset_save', {'id': b['id'], 'expected_revision': b['revision'],
                             'description': 'Advanced revision'})
    before = probe.ok('presets')['presets']
    rejected = probe.cli('preset_save', {'id': b['id'], 'expected_revision': b['revision'], 'default': True})
    after = probe.ok('presets')['presets']
    check('stale_preset_no_partial_write', 'Reject stale save without changing any preset.',
          {'exit': rejected['exit'], 'defaults_before': [p['id'] for p in before if p['default']],
           'defaults_after': [p['id'] for p in after if p['default']], 'state_unchanged': before == after},
          rejected['exit'] != 0 and before == after)

    archive = str(temporary / 'state.tar.gz')
    exported = probe.ok('export', archive)
    checked = probe.ok('check', archive)
    restored_root = temporary / 'restored'
    shutil.copytree(probe.root, restored_root)
    for relative in ['dsh-praxis/data', 'vault/snapshots/local/praxis']:
        shutil.rmtree(restored_root / relative, ignore_errors=True)
    write(restored_root, CATALOG, baseline)
    for relative in ['vault/intake/praxis-captures.json', 'vault/snapshot-manifest.json']:
        (restored_root / relative).unlink(missing_ok=True)
    build(restored_root)
    # The baseline catalog intentionally differs; authorize overwrite only in this fixture.
    restored = probe.ok('restore', [archive, '--force'], restored_root)
    # Verify even after explicitly regenerating projections from restored source data.
    build(restored_root)
    bindings = probe.ok('bindings', {'include_removed': True}, restored_root)
    active = [b['id'] for b in bindings if b['state'] == 'active']
    source = probe.ok('source', {'id': SOURCE}, restored_root)
    snapshot = source.get('snapshot', {})
    check('backup_existing_catalog', 'Restore added/removed relations and latest source snapshot pointer.',
          {'archive_valid': checked['ok'], 'exported_files': exported['files'],
           'restored_files': restored['restored'], 'active_targets': [b['target'] for b in bindings if b['state'] == 'active'],
           'latest_snapshot_pointer_restored': snapshot.get('sha256') == second_snapshot['snapshot']['sha256'],
           'snapshot_bytes_restored': (restored_root / second_snapshot['snapshot']['path']).exists()},
          checked['ok'] and BINDING_B in active and BINDING_A not in active
          and snapshot.get('sha256') == second_snapshot['snapshot']['sha256'])


def main():
    report = {
        'checked_at': datetime.now(timezone.utc).isoformat(),
        'commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=REPO, text=True).strip(),
        'environment': {'node': subprocess.check_output(['node', '--version'], text=True).strip(),
                        'python': platform.python_version(), 'system': platform.system()},
        'command': 'python3 scripts/check_praxis_acceptance.py',
        'scope': 'Isolated fixture; real CLI/MCP processes, registry/snapshot builders and loopback HTTP.',
        'not_checked': ['DSH desktop/UI', 'external network', 'concurrent writes', 'corrupt or malicious archives'],
        'checks': [],
    }
    try:
        with tempfile.TemporaryDirectory(prefix='praxis-acceptance-runtime-') as directory:
            temporary = Path(directory).resolve()
            root = temporary / 'fixture'
            LocalSource.body = b'version one'
            server = ThreadingHTTPServer(('127.0.0.1', 0), LocalSource)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            probe = None
            try:
                baseline = fixture(root, f'http://127.0.0.1:{server.server_port}/source')
                probe = Probe(root, temporary)
                run_checks(probe, temporary, baseline, report['checks'])
            finally:
                if probe:
                    probe.close()
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)
    except Exception as error:
        report['harness_error'] = f'{type(error).__name__}: {error}'
    report['passed'] = bool(report['checks']) and all(c['passed'] for c in report['checks']) and 'harness_error' not in report
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
