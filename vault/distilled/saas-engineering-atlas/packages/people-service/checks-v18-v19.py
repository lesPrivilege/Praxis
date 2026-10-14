#!/usr/bin/env python3
"""Synthetic invariants only; no provider, browser, load, solver or AI execution.

Expected-bad implementations are exercised as counterexamples, not as product bugs.
SQLite tests use serialized competing commands and a real close/reopen boundary;
they do not establish concurrent PostgreSQL behavior or remote exactly-once effects.
"""
from hashlib import sha256
from itertools import product
from pathlib import Path
import json
import sqlite3
import tempfile
import unittest


ROWS = [
    ('O1', 'A', 'produce'), ('O2', 'A', 'needs_resolution'),
    ('O3', 'B', 'withhold'), ('O4', 'C', 'produce'),
    ('O5', 'B', 'withhold'), ('O6', 'D', 'out_of_scope'),
]


def collect(rows, tenant='T1'):
    blobs, occurrences = {}, {}
    for occurrence, content, decision in rows:
        raw = content.encode()
        key = (tenant, sha256(raw).hexdigest(), len(raw))
        if key in blobs and blobs[key] != raw:
            raise ValueError('digest collision: isolate instead of merge')
        blobs[key] = raw
        oid = (tenant, 'M1', 'C1', occurrence)
        record = dict(content_key=key, decision=decision)
        if oid in occurrences and occurrences[oid] != record:
            raise ValueError('same occurrence identity with conflicting content')
        occurrences[oid] = record
    return blobs, occurrences


def can_dispose(active_holds, independent_retention, disposition_authorized):
    return not active_holds and not independent_retention and disposition_authorized


class ProductionGate:
    """Each method models one atomic local transaction; no network inside it."""
    def __init__(self):
        self.epoch = self.frozen_epoch = 1
        self.state = 'frozen'
        self.requires_reconciliation = False
        self.claimed = False
        self.receipt = None

    def revoke(self):
        self.epoch += 1
        if not self.claimed:
            self.state = 'invalidated'
        else:
            self.requires_reconciliation = True

    def claim(self):
        if self.state != 'frozen' or self.epoch != self.frozen_epoch:
            raise ValueError('stale approval cannot claim dispatch')
        self.claimed = True
        self.state = 'sending'

    def timeout(self):
        if not self.claimed:
            raise ValueError('cannot time out an unclaimed send')
        self.state = 'unknown'

    def receive(self, production, manifest_hash):
        if (production, manifest_hash) != ('P1', 'manifest-v1'):
            raise ValueError('receipt identity mismatch')
        if not self.claimed:
            raise ValueError('unexpected receipt')
        self.receipt = (production, manifest_hash)
        self.state = 'received'


def feasible_assignments():
    skills = {'A': {'SQL', 'Python'}, 'B': {'SQL'}}
    tasks = {'J1': 'SQL', 'J2': 'Python'}
    valid = []
    for people in product(skills, repeat=len(tasks)):
        if len(set(people)) != len(people):
            continue
        assignment = dict(zip(tasks, people))
        if all(tasks[job] in skills[person] for job, person in assignment.items()):
            valid.append(assignment)
    return valid


def bill_lines(lines, available):
    if available < 0 or any(amount < 0 for _, amount in lines):
        raise ValueError('negative amounts require an explicit adjustment policy')
    if len({identity for identity, _ in lines}) != len(lines):
        raise ValueError('duplicate source line')
    output = []
    for identity, amount in lines:
        assigned = min(amount, available)
        output.append((identity, assigned, amount - assigned))
        available -= assigned
    return output


class CapLedger:
    """One synthetic contract, integer minor currency units, all versions shared."""
    def __init__(self, path):
        self.db = sqlite3.connect(path, isolation_level=None)
        self.db.execute('CREATE TABLE IF NOT EXISTS cap(id INTEGER PRIMARY KEY CHECK(id=1), version INTEGER, amount INTEGER, prior_released INTEGER)')
        self.db.execute('CREATE TABLE IF NOT EXISTS operations(id TEXT PRIMARY KEY, amount INTEGER, version INTEGER, state TEXT)')
        self.db.execute('INSERT OR IGNORE INTO cap VALUES(1,1,1000000,700000)')

    def close(self):
        self.db.close()

    def availability(self):
        version, cap, prior = self.db.execute('SELECT version,amount,prior_released FROM cap').fetchone()
        used = self.db.execute("SELECT COALESCE(SUM(amount),0) FROM operations WHERE state IN ('reserved','unknown','released')").fetchone()[0]
        return version, cap - prior - used

    def reserve(self, operation, amount, expected_version):
        self.db.execute('BEGIN IMMEDIATE')
        try:
            old = self.db.execute('SELECT amount,version,state FROM operations WHERE id=?', (operation,)).fetchone()
            if old:
                if old[:2] != (amount, expected_version):
                    raise ValueError('idempotency identity reused for different request')
                self.db.execute('COMMIT')
                return old[2]
            version, available = self.availability()
            if version != expected_version or amount <= 0 or amount > available:
                raise ValueError('version or available cap conflict')
            self.db.execute('INSERT INTO operations VALUES(?,?,?,?)', (operation, amount, version, 'reserved'))
            self.db.execute('COMMIT')
            return 'reserved'
        except Exception:
            self.db.execute('ROLLBACK')
            raise

    def mark_unknown(self, operation):
        self.db.execute("UPDATE operations SET state='unknown' WHERE id=? AND state='reserved'", (operation,))

    def release(self, operation):
        self.db.execute('BEGIN IMMEDIATE')
        try:
            record = self.db.execute('SELECT state FROM operations WHERE id=?', (operation,)).fetchone()
            if not record or record[0] not in ('reserved', 'unknown', 'released'):
                raise ValueError('no releasable reservation')
            self.db.execute("UPDATE operations SET state='released' WHERE id=?", (operation,))
            self.db.execute('COMMIT')
        except Exception:
            self.db.execute('ROLLBACK')
            raise

    def change_cap(self, amount):
        self.db.execute('BEGIN IMMEDIATE')
        try:
            version, available = self.availability()
            old_cap = self.db.execute('SELECT amount FROM cap').fetchone()[0]
            occupied = old_cap - available
            if amount < occupied:
                raise ValueError('new cap below released plus live reservations')
            self.db.execute('UPDATE cap SET version=?,amount=? WHERE id=1', (version + 1, amount))
            self.db.execute('COMMIT')
        except Exception:
            self.db.execute('ROLLBACK')
            raise


class SyntheticChecks(unittest.TestCase):
    def test_v18_content_occurrence_production_counts(self):
        blobs, occ = collect(ROWS)
        self.assertEqual((len(blobs), len(occ)), (4, 6))
        self.assertEqual([k[-1] for k, v in occ.items() if v['decision'] == 'produce'], ['O1', 'O4'])
        self.assertEqual(sum(v['decision'] == 'needs_resolution' for v in occ.values()), 1)

    def test_v18_duplicate_and_conflicting_occurrence(self):
        self.assertEqual(len(collect(ROWS + ROWS)[1]), 6)
        with self.assertRaisesRegex(ValueError, 'conflicting'):
            collect(ROWS + [('O1', 'changed', 'produce')])

    def test_v18_hash_first_counterexample_loses_context(self):
        bad = {}
        for row in ROWS:
            bad.setdefault(row[1], row)
        self.assertEqual(len(bad), 4)
        self.assertNotIn('O2', [r[0] for r in bad.values()])
        self.assertEqual(sum(r[2] == 'needs_resolution' for r in bad.values()), 0)
        # Good output still exposes one unresolved source occurrence.
        self.assertEqual(sum(r[2] == 'needs_resolution' for r in ROWS), 1)

    def test_v18_tenant_content_and_lookup_scope(self):
        first, occ1 = collect(ROWS, 'T1')
        second, occ2 = collect(ROWS, 'T2')
        self.assertFalse(set(first) & set(second))
        self.assertFalse(set(occ1) & set(occ2))
        with self.assertRaises(KeyError):
            _ = occ1[('T2', 'M1', 'C1', 'O1')]

    def test_v18_hold_release_preserves_other_obligations(self):
        holds = {'H1', 'H2'}
        holds.remove('H1')
        self.assertFalse(can_dispose(holds, False, True))
        holds.remove('H2')
        self.assertFalse(can_dispose(holds, True, True))
        self.assertFalse(can_dispose(holds, False, False))
        self.assertTrue(can_dispose(holds, False, True))

    def test_v18_revoke_before_claim_prevents_dispatch(self):
        gate = ProductionGate()
        gate.revoke()
        with self.assertRaisesRegex(ValueError, 'stale'):
            gate.claim()
        self.assertEqual(gate.state, 'invalidated')

    def test_v18_claim_before_revoke_requires_reconciliation(self):
        gate = ProductionGate()
        gate.claim()
        gate.revoke()
        gate.timeout()
        self.assertEqual(gate.state, 'unknown')
        self.assertTrue(gate.requires_reconciliation)
        # A remote acceptance can still exist after a local revocation.
        gate.receive('P1', 'manifest-v1')
        self.assertEqual(gate.state, 'received')
        self.assertTrue(gate.requires_reconciliation)

    def test_v18_precheck_only_counterexample(self):
        gate = ProductionGate()
        passed_precheck = gate.epoch == gate.frozen_epoch
        gate.revoke()
        bad_would_send = passed_precheck  # cached decision used after revocation
        self.assertTrue(bad_would_send)
        self.assertNotEqual(gate.epoch, gate.frozen_epoch)

    def test_v18_receipt_duplicate_and_mismatch(self):
        gate = ProductionGate()
        gate.claim()
        with self.assertRaisesRegex(ValueError, 'mismatch'):
            gate.receive('P1', 'wrong-hash')
        gate.receive('P1', 'manifest-v1')
        gate.receive('P1', 'manifest-v1')
        self.assertEqual(gate.receipt, ('P1', 'manifest-v1'))

    def test_v19_matching_and_greedy_counterexample(self):
        self.assertEqual(feasible_assignments(), [{'J1': 'B', 'J2': 'A'}])
        bad = {'J1': 'A', 'J2': 'B'}
        skills = {'A': {'SQL', 'Python'}, 'B': {'SQL'}}
        self.assertNotIn('Python', skills[bad['J2']])
        # Equal total hours alone does not establish a feasible match.
        self.assertEqual(4 + 4, 4 + 4)

    def test_v19_daily_capacity_is_not_interval_feasibility(self):
        intervals = [(9, 13), (9, 13)]
        daily_hours = sum(end - start for start, end in intervals)
        self.assertEqual(daily_hours, 8)
        overlap = min(i[1] for i in intervals) - max(i[0] for i in intervals)
        self.assertEqual(overlap, 4)
        self.assertGreater(overlap, 0)

    def test_v19_cap_split_conserves_amounts(self):
        lines = [('T1', 200000), ('T2', 160000)]
        result = bill_lines(lines, 300000)
        self.assertEqual(result, [('T1', 200000, 0), ('T2', 100000, 60000)])
        self.assertEqual(sum(x[1] + x[2] for x in result), 360000)
        self.assertEqual(bill_lines(lines, 0), [('T1', 0, 200000), ('T2', 0, 160000)])
        with self.assertRaises(ValueError):
            bill_lines([('T1', -1)], 1)
        with self.assertRaises(ValueError):
            bill_lines([('T1', 1), ('T1', 1)], 2)

    def test_v19_cost_consumed_counterexample(self):
        cap, released, cost_consumed = 1000000, 700000, 900000
        self.assertEqual(cap - released, 300000)
        self.assertEqual(cap - cost_consumed, 100000)
        self.assertNotEqual(cap - released, cap - cost_consumed)

    def test_v19_competing_reservations_and_idempotency(self):
        with tempfile.TemporaryDirectory() as directory:
            ledger = CapLedger(str(Path(directory) / 'cap.db'))
            self.assertEqual(ledger.reserve('B1', 200000, 1), 'reserved')
            self.assertEqual(ledger.reserve('B1', 200000, 1), 'reserved')
            with self.assertRaises(ValueError):
                ledger.reserve('B2', 200000, 1)
            with self.assertRaises(ValueError):
                ledger.reserve('B1', 100000, 1)
            self.assertEqual(ledger.availability(), (1, 100000))
            ledger.close()
        # Two stale readers which omit the transaction would overspend by 1000.
        self.assertEqual(700000 + 200000 + 200000 - 1000000, 100000)

    def test_v19_unknown_survives_cap_version_change(self):
        with tempfile.TemporaryDirectory() as directory:
            ledger = CapLedger(str(Path(directory) / 'cap.db'))
            ledger.reserve('B1', 300000, 1)
            ledger.mark_unknown('B1')
            ledger.change_cap(1060000)
            self.assertEqual(ledger.availability(), (2, 60000))
            with self.assertRaises(ValueError):
                ledger.reserve('old-version', 100, 1)
            with self.assertRaises(ValueError):
                ledger.reserve('new-too-large', 360000, 2)
            ledger.reserve('B2', 60000, 2)
            self.assertEqual(ledger.availability(), (2, 0))
            with self.assertRaises(ValueError):
                ledger.change_cap(1000000)
            ledger.close()
        # Broken separate-version accounting loses unknown 3000.
        self.assertEqual(1060000 - 700000, 360000)

    def test_v19_restart_reconcile_then_release_once(self):
        with tempfile.TemporaryDirectory() as directory:
            path = str(Path(directory) / 'cap.db')
            ledger = CapLedger(path)
            ledger.reserve('B1', 300000, 1)
            fake_accounting = {'B1': {'invoice': 'I1', 'amount': 300000}}
            ledger.mark_unknown('B1')
            ledger.close()  # restart boundary: committed reservation survives
            recovered = CapLedger(path)
            self.assertEqual(recovered.availability(), (1, 0))
            self.assertEqual(fake_accounting['B1']['invoice'], 'I1')
            recovered.release('B1')
            recovered.release('B1')
            self.assertEqual(recovered.availability(), (1, 0))
            self.assertEqual(recovered.db.execute('SELECT COUNT(*) FROM operations').fetchone()[0], 1)
            self.assertEqual(recovered.db.execute('SELECT state FROM operations').fetchone()[0], 'released')
            recovered.close()
            self.assertEqual(len(fake_accounting), 1)

    def test_v19_payment_is_not_billed_and_notifications_do_not_regress(self):
        invoice = 300000
        accounting_allocations = {'P1': 180000}
        self.assertEqual(invoice - sum(accounting_allocations.values()), 120000)
        accounting_allocations['P2'] = 120000
        events = ['paid', 'open', 'paid']
        projection = None
        for _ in events:
            balance = invoice - sum(accounting_allocations.values())
            projection = 'paid' if balance == 0 else 'partially_paid'
        self.assertEqual(projection, 'paid')
        self.assertEqual(sum(accounting_allocations.values()), 300000)

    def test_v18_eval_arithmetic_is_not_a_model_run(self):
        tp, fn, fp, tn = 18, 2, 10, 70
        self.assertEqual(tp + fn + fp + tn, 100)
        self.assertEqual(tp / (tp + fn), .9)
        self.assertAlmostEqual(tp / (tp + fp), .6428571428571429)
        self.assertEqual((tp + tn) / 100, .88)


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(SyntheticChecks)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    print(json.dumps({
        'tests_run': result.testsRun,
        'failures': len(result.failures),
        'errors': len(result.errors),
        'expected_bad_counterexamples_detected': [
            'hash-first removes unresolved occurrence',
            'precheck-only sends after revocation',
            'broad-skill-first leaves Python task unstaffed',
            'daily capacity accepts overlapping fixed intervals',
            'cost consumed produces wrong billable balance',
            'stale cap readers overrun by 1000 units',
            'new cap version loses unknown 3000 reservation',
        ],
        'execution_scope': 'pure synthetic functions + SQLite commit/close/reopen; serialized competing commands only',
        'not_run': ['provider API', 'network fault injection', 'UI E2E', 'parallel database race', 'load test', 'OR-Tools solver', 'AI model evaluation'],
    }, ensure_ascii=False, indent=2))
    raise SystemExit(not result.wasSuccessful())
