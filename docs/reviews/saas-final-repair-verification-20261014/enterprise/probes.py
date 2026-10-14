#!/usr/bin/env python3
"""Independent bounded repair verification; temp SQLite and loopback HTTP only."""
import argparse
from copy import deepcopy
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[4]
SOURCE = ROOT / 'vault/distilled/saas-engineering-atlas/enterprise-mechanisms'
FROZEN = '5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--module', type=Path, default=SOURCE / 'mechanism_lab.py')
parser.add_argument('--case')
parser.add_argument('--output', type=Path)
parser.add_argument('--mutations', action='store_true')
args = parser.parse_args()
sys.path.insert(0, str(SOURCE))
spec = importlib.util.spec_from_file_location('mechanism_lab', args.module)
M = importlib.util.module_from_spec(spec)
sys.modules['mechanism_lab'] = M
spec.loader.exec_module(M)
import test_mechanism_lab as T  # Reuse transport fixture, not author test assertions.
OBS = {}


def intent(revision=3, version=8, desired=6):
    c = M.Change(revision=revision, config_version=version, desired=desired)
    c.approve('owner', 'service-owner')
    return c.intent('executor-person', 'executor')


def alter(provider, result):
    if isinstance(provider, M.FakeAdapter):
        key = (result['tenant'], result['operation_id'])
        old = provider.entries[key]
        provider.entries[key] = (old[0], deepcopy(result))
    else:
        provider.response_override = deepcopy(result)


class Independent(unittest.TestCase):
    def test_acceptance_matrix_and_persistence(self):
        counts = {}
        for fixture in (T.fake_fixture, T.http_fixture):
            with fixture() as (a, p), tempfile.TemporaryDirectory() as tmp:
                db = str(Path(tmp) / 'j.db')
                j = M.OperationJournal(db)
                body = intent()
                j.enqueue(body)
                body['acceptance_policy']['probe_total'] = 1
                j.dispatch('T-1', 'OP-42', a)
                j.close()
                j = M.OperationJournal(db)
                try:
                    self.assertEqual(json.loads(j.row('T-1', 'OP-42')['payload'])['acceptance_policy']['probe_total'], 10)
                    count = 0
                    for passed in range(-1, 13):
                        for total in range(-1, 13):
                            if (passed, total) == (10, 10):
                                continue
                            with self.assertRaisesRegex(M.RuleError, 'acceptance_failed'):
                                j.accept('T-1', 'OP-42', 'owner', 'service-owner', passed, total, 'evidence')
                            count += 1
                    for passed, total, evidence in [(10.0, 10, 'e'), (10, 10.0, 'e'), (True, 10, 'e'), (10, True, 'e'), (10, 10, '')]:
                        with self.assertRaisesRegex(M.RuleError, 'acceptance_failed'):
                            j.accept('T-1', 'OP-42', 'owner', 'service-owner', passed, total, evidence)
                    self.assertEqual(j.accept('T-1', 'OP-42', 'owner', 'service-owner', 10, 10, 'evidence'), 'closed')
                    self.assertEqual(json.loads(j.row('T-1', 'OP-42')['acceptance'])['policy_version'], 'SVC-ACCEPT-1')
                    self.assertEqual(p.effect_count, 1)
                    counts[fixture.__name__] = count
                finally:
                    j.close()
        for policy in [None, {}, {'version': 'SVC-ACCEPT-2', 'required_probes_passed': 10, 'probe_total': 10}, {'version': 'SVC-ACCEPT-1', 'required_probes_passed': 1, 'probe_total': 1}]:
            j = M.OperationJournal()
            try:
                body = intent()
                body['acceptance_policy'] = policy
                with self.assertRaisesRegex(M.RuleError, 'invalid_acceptance_policy'):
                    j.enqueue(body)
                self.assertEqual(j.db.execute('SELECT count(*) FROM operations').fetchone()[0], 0)
            finally:
                j.close()
        OBS['WB-01'] = {'invalid_integer_pairs_rejected_per_adapter': counts, 'policy_copy_reopen_and_bad_policy_controls': 'pass'}

    def test_valid_terminal_conflict_sequences(self):
        observations = []
        for fixture in (T.fake_fixture, T.http_fixture):
            for first, later in [('applied', 'rejected'), ('rejected', 'applied'), ('applied', 'applied'), ('rejected', 'rejected')]:
                with fixture() as (a, p), tempfile.TemporaryDirectory() as tmp:
                    db = str(Path(tmp) / 'j.db')
                    j = M.OperationJournal(db)
                    body = intent()
                    base = a.submit(body)
                    alter(p, dict(base, state=first))
                    j.enqueue(body)
                    j.dispatch('T-1', 'OP-42', a)
                    saved = j.row('T-1', 'OP-42')
                    later_result = dict(base, state=later, receipt='later-terminal-receipt')
                    alter(p, later_result)
                    self.assertEqual(j.reconcile('T-1', 'OP-42', a), 'evidence_conflict')
                    self.assertEqual(j.reconcile('T-1', 'OP-42', a), 'evidence_conflict')
                    j.close()
                    j = M.OperationJournal(db)
                    try:
                        row = j.row('T-1', 'OP-42')
                        self.assertEqual((row['state'], row['result']), (saved['state'], saved['result']))
                        self.assertEqual(row['conflict_count'], 1)
                        self.assertEqual(json.loads(j.conflicts('T-1', 'OP-42')[0]['observed_result']), later_result)
                        alter(p, dict(base, state='accepted', receipt='older-progress'))
                        self.assertEqual(j.reconcile('T-1', 'OP-42', a), 'evidence_conflict')
                        self.assertEqual(j.row('T-1', 'OP-42')['conflict_count'], 1)
                        with self.assertRaises(M.RuleError):
                            j.accept('T-1', 'OP-42', 'owner', 'service-owner', 10, 10, 'evidence')
                        self.assertEqual(p.effect_count, 1)
                        observations.append([fixture.__name__, first, later, row['state'], row['conflict_count']])
                    finally:
                        j.close()
        OBS['WB-02-valid'] = observations

    def test_terminal_conflict_with_invalid_effect(self):
        observations = []
        OBS['WB-02-residual'] = observations
        for fixture in (T.fake_fixture, T.http_fixture):
            for changed in ({'version': 10}, {'desired': 8}):
                with self.subTest(adapter=fixture.__name__, changed=changed), fixture() as (a, p), tempfile.TemporaryDirectory() as tmp:
                    db = str(Path(tmp) / 'j.db')
                    j = M.OperationJournal(db)
                    try:
                        j.enqueue(intent())
                        j.dispatch('T-1', 'OP-42', a)
                        old = j.row('T-1', 'OP-42')
                        wire = dict(json.loads(old['result']), receipt='contradictory-receipt', **changed)
                        alter(p, wire)
                        self.assertEqual(a.lookup('T-1', 'OP-42'), wire)
                        state = j.reconcile('T-1', 'OP-42', a)
                        conflicts = j.conflicts('T-1', 'OP-42')
                        j.close()
                        j = M.OperationJournal(db)
                        after_reopen = j.row('T-1', 'OP-42')
                        try:
                            acceptance = j.accept('T-1', 'OP-42', 'owner', 'service-owner', 10, 10, 'evidence')
                        except M.RuleError as exc:
                            acceptance = str(exc)
                        observations.append({'adapter': fixture.__name__, 'wire': wire, 'reconcile': state, 'conflicts': conflicts, 'reopened_state': after_reopen['state'], 'reopened_conflict_count': after_reopen['conflict_count'], 'accept': acceptance, 'old_result_preserved': j.row('T-1', 'OP-42')['result'] == old['result'], 'effects': p.effect_count})
                        self.assertEqual(state, 'evidence_conflict', 'same operation terminal receipt contradiction discarded before diagnostic')
                        self.assertEqual(acceptance, 'evidence_conflict')
                    finally:
                        j.close()

    def test_late_conflicts_after_closure(self):
        for fixture in (T.fake_fixture, T.http_fixture):
            with fixture() as (a, p):
                j = M.OperationJournal()
                try:
                    j.enqueue(intent())
                    j.dispatch('T-1', 'OP-42', a)
                    j.accept('T-1', 'OP-42', 'owner', 'service-owner', 10, 10, 'evidence')
                    before = j.row('T-1', 'OP-42')
                    alter(p, dict(json.loads(before['result']), state='rejected'))
                    self.assertEqual(j.reconcile('T-1', 'OP-42', a), 'evidence_conflict')
                    after = j.row('T-1', 'OP-42')
                    self.assertEqual(after['state'], 'closed')
                    self.assertEqual(after['acceptance'], before['acceptance'])
                    self.assertEqual(after['result'], before['result'])
                finally:
                    j.close()
        OBS['WB-02-closed'] = 'historical closure and acceptance preserved; visible conflict reported'

    def test_wire_precondition_and_negative_effects(self):
        observed = []
        for fixture in (T.fake_fixture, T.http_fixture):
            with fixture() as (a, p):
                body = intent()
                result = a.submit(body)
                self.assertEqual(set(result), {'tenant', 'operation_id', 'target', 'state', 'receipt', 'version', 'desired'})
                self.assertEqual((body['expected_version'], result['version'], result['desired']), (8, 9, 6))
                for delta in ({'version': 8}, {'version': 10}, {'desired': 7}, {'tenant': 'T-2'}, {'operation_id': 'OP-other'}, {'target': 'other'}, {'version': True}):
                    with self.assertRaises(M.ContractError):
                        M.validate_result(dict(result, **delta), body)
                observed.append({'adapter': fixture.__name__, 'request_expected_version': body['expected_version'], 'wire': result})
        OBS['WB-10'] = observed

    def test_new_revisions_retry_and_duplicates(self):
        observed = []
        for fixture in (T.fake_fixture, T.http_fixture):
            with fixture() as (a, p), tempfile.TemporaryDirectory() as tmp:
                path = str(Path(tmp) / 'j.db')
                j = M.OperationJournal(path)
                prior = []
                try:
                    for rev in (3, 4, 5):
                        c = M.Change(revision=rev, config_version=rev + 5, desired=rev * 2)
                        c.approve('owner', 'service-owner')
                        c.desired += 1
                        with self.assertRaisesRegex(M.RuleError, 'approval_stale'):
                            c.intent('executor-person', 'executor')
                        c.approve('owner', 'service-owner')
                        body = c.intent('executor-person', 'executor')
                        op = 'OP-42' if rev == 3 else f'OP-42-r{rev}'
                        self.assertEqual((body['operation_id'], body['business_key'], body['approval_ref']), (op, f'CHG-42/r{rev}/apply', f'APR-42-r{rev}'))
                        j.enqueue(body)
                        p.lose_next_response = True
                        self.assertEqual(j.dispatch('T-1', op, a), 'unknown')
                        j.close()
                        j = M.OperationJournal(path)
                        self.assertEqual(j.reconcile('T-1', op, a), 'awaiting_acceptance')
                        prior.append(deepcopy(body))
                        for old in prior:
                            response = a.submit(old)
                            self.assertEqual(response['version'], old['expected_version'] + 1)
                            self.assertEqual(j.enqueue(old), 'awaiting_acceptance')
                        with self.assertRaisesRegex(M.RuleError, 'business_intent_exists'):
                            j.enqueue(dict(body, operation_id='replacement-' + op))
                        with self.assertRaisesRegex(M.RuleError, 'idempotency_conflict'):
                            j.enqueue(dict(body, desired=99))
                        self.assertEqual(p.effect_count, rev - 2)
                    observed.append({'adapter': fixture.__name__, 'effects': p.effect_count, 'identities': [[b['approval_ref'], b['business_key'], b['operation_id']] for b in prior]})
                finally:
                    j.close()
        OBS['WB-11'] = observed

    def test_quantity_and_prose_sidecars(self):
        examples = json.loads((SOURCE / 'examples.json').read_text())['examples']
        p = examples[0]['policy']
        final = examples[0]['steps'][-1]['effect']
        accepted = p['accepted_qty']
        pending = p['received_qty'] - accepted
        outstanding_delivery = p['requested_qty'] - p['received_qty']
        self.assertEqual((accepted, pending, outstanding_delivery), (9, 1, 2))
        self.assertEqual(final['pending_inspection_qty'], pending)
        self.assertEqual(final['not_received_qty'], outstanding_delivery)
        self.assertNotIn('remaining_delivery_qty', final)
        self.assertEqual(final['amount_minor'], accepted * p['price_minor'])
        OBS['WB-09'] = {'accepted': accepted, 'received_pending_inspection': pending, 'not_received': outstanding_delivery, 'outstanding_fulfillment': pending + outstanding_delivery, 'partition_total': accepted + pending + outstanding_delivery, 'settlement_minor': final['amount_minor']}


suite = unittest.defaultTestLoader.loadTestsFromName('Independent.' + args.case, sys.modules[__name__]) if args.case else unittest.defaultTestLoader.loadTestsFromTestCase(Independent)
stream = io.StringIO()
run = unittest.TextTestRunner(stream=stream, verbosity=2).run(suite)
report = {'frozen_sha': FROZEN, 'role': 'independent enterprise repair adjudicator', 'model': 'gpt-6-astra (parent-selected)', 'status': 'pass' if run.wasSuccessful() else 'fail', 'test_methods': run.testsRun, 'failing_subtests_or_methods': len(run.failures), 'errors': len(run.errors), 'observations': OBS, 'unittest_output': stream.getvalue(), 'source_sha256': {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in [SOURCE / 'mechanism_lab.py', SOURCE / 'test_mechanism_lab.py', SOURCE / 'examples.json']}}
if args.mutations:
    source = (SOURCE / 'mechanism_lab.py').read_text()
    mutations = [
        ('narrow-denominator', 'passed != policy["required_probes_passed"] or total != policy["probe_total"]', 'passed != total', 'test_acceptance_matrix_and_persistence'),
        ('caller-policy', 'if intent["kind"] == "change" and intent.get("acceptance_policy") != CHANGE_ACCEPTANCE_POLICY:', 'if False:', 'test_acceptance_matrix_and_persistence'),
        ('discard-terminal-conflict', 'if prior != result:', 'if False:', 'test_valid_terminal_conflict_sequences'),
        ('result-version-check', 'result["version"] != intent["expected_version"]+1 or', 'False or', 'test_wire_precondition_and_negative_effects'),
        ('fixed-revision-operation', 'operation_id = "OP-42" if self.revision == 3 else f"OP-42-r{self.revision}"', 'operation_id = "OP-42"', 'test_new_revisions_retry_and_duplicates'),
        ('business-identity-constraint', 'PRIMARY KEY(tenant,id), UNIQUE(tenant,business_key)', 'PRIMARY KEY(tenant,id)', 'test_new_revisions_retry_and_duplicates'),
    ]
    report['guard_mutations'] = []
    for name, before, after, case in mutations:
        assert source.count(before) == 1, name
        with tempfile.TemporaryDirectory() as tmp:
            module = Path(tmp) / 'mechanism_lab.py'
            module.write_text(source.replace(before, after))
            command = [sys.executable, str(Path(__file__).resolve()), '--module', str(module), '--case', case]
            outcome = subprocess.run(command, capture_output=True, text=True, env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'})
            detail = json.loads(outcome.stdout)
            report['guard_mutations'].append({'mutation': name, 'case': case, 'detected': outcome.returncode != 0 and detail['errors'] == 0 and detail['failing_subtests_or_methods'] > 0, 'exit_code': outcome.returncode, 'unittest_output': detail['unittest_output']})
if args.output:
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(not run.wasSuccessful())
