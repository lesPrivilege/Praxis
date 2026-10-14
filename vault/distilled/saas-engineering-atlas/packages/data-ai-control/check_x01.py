#!/usr/bin/env python3
"""Synthetic X01 invariants; no provider, browser, model, IAM or load execution."""
import itertools
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from decimal import Decimal


class Ledger:
    def __init__(self, path):
        self.db = sqlite3.connect(path)
        self.db.execute('''CREATE TABLE IF NOT EXISTS usage (
            tenant TEXT, run TEXT, meter TEXT, revision INTEGER,
            units INTEGER CHECK(units >= 0), eligible INTEGER, event_time INTEGER,
            PRIMARY KEY(tenant, run, meter, revision))''')
        self.db.execute('''CREATE TABLE IF NOT EXISTS conflicts (
            tenant TEXT, run TEXT, meter TEXT, revision INTEGER,
            observed_payload TEXT, PRIMARY KEY(tenant, run, meter, revision))''')

    def record(self, tenant, run, units, eligible, event_time, revision=1):
        row = (tenant, run, 'work', revision, units, int(eligible), event_time)
        conflict = False
        with self.db:
            old = self.db.execute('SELECT * FROM usage WHERE tenant=? AND run=? AND meter=? AND revision=?', row[:4]).fetchone()
            if old is not None:
                if old != row:
                    self.db.execute('INSERT OR IGNORE INTO conflicts VALUES (?,?,?,?,?)', (*row[:4], json.dumps(row)))
                    conflict = True
                else:
                    return 'duplicate'
            else:
                self.db.execute('INSERT INTO usage VALUES (?,?,?,?,?,?,?)', row)
        # Raise after committing the conflict: a rollback must not erase the gate.
        if conflict:
            raise ValueError('quarantine: same identity has conflicting payload')
        return 'recorded'

    def totals(self, tenant, start, end):
        if self.db.execute('SELECT 1 FROM conflicts WHERE tenant=? LIMIT 1', (tenant,)).fetchone():
            raise ValueError('quarantine blocks tenant billing until reviewed')
        # Fetch all revisions before window selection: moving an event to a new
        # window must not leave the old revision counted in its former window.
        by_run = {}
        for row in self.db.execute('SELECT * FROM usage WHERE tenant=? ORDER BY run, revision', (tenant,)):
            by_run.setdefault(row[1], []).append(row)
        cost = billable = 0
        for revisions in by_run.values():
            if [r[3] for r in revisions] != list(range(1, len(revisions) + 1)):
                raise ValueError('revision gap: cannot freeze bill')
            row = revisions[-1]
            if start <= row[6] < end:
                cost += row[4]
                billable += row[4] * row[5]
        return cost, billable, Decimal(billable) * Decimal('2') / Decimal('1000')

    def close(self):
        self.db.close()


class Quota:
    """Serial state model of an atomic transaction, not a concurrency test."""
    def __init__(self, limit=1500):
        self.limit, self.spent, self.reservations = limit, 0, {}

    def reserve(self, run, maximum):
        if maximum < 0:
            raise ValueError('negative reservation')
        if run in self.reservations:
            if self.reservations[run] != maximum:
                raise ValueError('conflicting request identity')
            return True
        if self.spent + sum(self.reservations.values()) + maximum > self.limit:
            return False
        self.reservations[run] = maximum
        return True

    def settle(self, run, actual):
        if not 0 <= actual <= self.reservations[run]:
            raise ValueError('assumption violated: actual exceeds reservation')
        self.spent += actual
        del self.reservations[run]


def may_deliver(tenant, member_tenant, captured_epoch, current_epoch, active):
    return tenant == member_tenant and active and captured_epoch == current_epoch


def queued_exit_trace(order):
    """Enumerate serialized conditional claims, not real concurrent workers."""
    quota, active, state = Quota(), True, 'queued'
    quota.reserve('run', 800)
    for action in order:
        if action == 'dispatch' and active and state == 'queued':
            state = 'running'
        elif action == 'offboard':
            active = False
            if state == 'queued':
                state = 'failed'
                quota.settle('run', 0)
            elif state == 'running':
                state = 'unknown'
    return state, quota


def eval_synthetic_predictions():
    # Frozen handcrafted labels and predictions, deliberately not all correct.
    fixtures = [
        dict(id='grounded', group='answerable', correct=True, cited=True, abstain=False, leak=False),
        dict(id='missing-citation', group='answerable', correct=True, cited=False, abstain=False, leak=False),
        dict(id='right-abstention', group='absent', correct=False, cited=False, abstain=True, leak=False),
        dict(id='fabrication', group='absent', correct=False, cited=False, abstain=False, leak=False),
        dict(id='other-tenant', group='protected', correct=False, cited=True, abstain=False, leak=True),
        dict(id='revoked-abstention', group='protected', correct=False, cited=False, abstain=True, leak=False),
    ]
    good = lambda f: (f['correct'] and f['cited'] and not f['abstain'] and not f['leak']) if f['group'] == 'answerable' else (f['abstain'] and not f['leak'])
    return dict(grounded=[sum(good(f) for f in fixtures if f['group'] == 'answerable'), 2],
                absent_abstention=[sum(good(f) for f in fixtures if f['group'] == 'absent'), 2],
                protected_violations=[sum(f['leak'] for f in fixtures if f['group'] == 'protected'), 2],
                strict=[sum(good(f) for f in fixtures), len(fixtures)],
                failed_fixture_ids=[f['id'] for f in fixtures if not good(f)],
                provenance='handcrafted synthetic predictions; no model was called')


class Invariants(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / 'ledger.sqlite'
        self.ledger = Ledger(self.path)

    def tearDown(self):
        self.ledger.close()
        self.tmp.cleanup()

    def test_cost_billing_and_tenant_identity(self):
        for data in [('A', 'a', 400, True, 2), ('A', 'b', 600, True, 3), ('A', 'c', 300, False, 4), ('B', 'a', 900, True, 2)]:
            self.ledger.record(*data)
        self.assertEqual(self.ledger.totals('A', 0, 10), (1300, 1000, Decimal('2')))
        self.assertEqual(self.ledger.totals('B', 0, 10), (900, 900, Decimal('1.8')))

    def test_duplicate_survives_close_reopen(self):
        self.ledger.record('A', 'a', 400, True, 2)
        self.ledger.close()
        self.ledger = Ledger(self.path)
        self.assertEqual(self.ledger.record('A', 'a', 400, True, 2), 'duplicate')
        self.assertEqual(self.ledger.totals('A', 0, 10)[1], 400)

    def test_conflicting_payload_is_rejected(self):
        self.ledger.record('A', 'a', 400, True, 2)
        with self.assertRaisesRegex(ValueError, 'quarantine'):
            self.ledger.record('A', 'a', 900, True, 2)
        self.ledger.close()
        self.ledger = Ledger(self.path)
        with self.assertRaisesRegex(ValueError, 'quarantine blocks'):
            self.ledger.totals('A', 0, 10)
        self.assertEqual(self.ledger.db.execute('SELECT units FROM usage').fetchone()[0], 400)

    def test_quarantine_is_scoped_to_tenant(self):
        self.ledger.record('A', 'a', 400, True, 2)
        with self.assertRaises(ValueError):
            self.ledger.record('A', 'a', 999, True, 2)
        self.ledger.record('B', 'a', 900, True, 2)
        self.assertEqual(self.ledger.totals('B', 0, 10)[1], 900)

    def test_revision_gap_blocks_then_replacement_does_not_double_count(self):
        self.ledger.record('A', 'a', 600, True, 2, revision=2)
        with self.assertRaisesRegex(ValueError, 'revision gap'):
            self.ledger.totals('A', 0, 10)
        self.ledger.record('A', 'a', 400, True, 2, revision=1)
        self.assertEqual(self.ledger.totals('A', 0, 10)[1], 600)

    def test_half_open_window_and_late_replacement(self):
        self.ledger.record('A', 'a', 400, True, 9)
        self.ledger.record('A', 'b', 600, True, 10)
        self.assertEqual(self.ledger.totals('A', 0, 10)[1], 400)
        self.assertEqual(self.ledger.totals('A', 10, 20)[1], 600)
        self.ledger.record('A', 'a', 400, True, 10, revision=2)
        self.assertEqual(self.ledger.totals('A', 0, 10)[1], 0)
        self.assertEqual(self.ledger.totals('A', 10, 20)[1], 1000)

    def test_negative_usage_is_rejected(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.ledger.record('A', 'a', -1, True, 0)

    def test_both_serialized_admission_orders(self):
        for order in itertools.permutations(('a', 'b')):
            q = Quota()
            self.assertEqual([q.reserve(run, 800) for run in order], [True, False])
            q.settle(order[0], 400)
            self.assertTrue(q.reserve(order[1], 800))
            q.settle(order[1], 600)
            self.assertTrue(q.reserve('c', 300))
            q.settle('c', 300)
            self.assertEqual(q.spent, 1300)
            self.assertFalse(q.reserve('d', 201))

    def test_unknown_reservation_not_released_without_settlement(self):
        q = Quota()
        q.reserve('unknown', 800)
        self.assertFalse(q.reserve('next', 800))
        self.assertEqual(q.reservations['unknown'], 800)

    def test_excess_actual_detects_design_assumption_failure(self):
        q = Quota()
        q.reserve('a', 800)
        with self.assertRaisesRegex(ValueError, 'assumption violated'):
            q.settle('a', 801)
        self.assertEqual(q.spent, 0)
        self.assertEqual(q.reservations['a'], 800)

    def test_cached_permission_cannot_survive_revoke(self):
        self.assertTrue(may_deliver('A', 'A', 1, 1, True))
        self.assertFalse(may_deliver('A', 'A', 1, 2, True))
        self.assertFalse(may_deliver('A', 'B', 1, 1, True))
        self.assertFalse(may_deliver('A', 'A', 1, 1, False))

    def test_offboard_before_dispatch_terminates_queued_run(self):
        state, quota = queued_exit_trace(['offboard', 'dispatch'])
        self.assertEqual(state, 'failed')
        self.assertEqual(quota.spent, 0)
        self.assertEqual(quota.reservations, {})

    def test_dispatch_before_offboard_preserves_unknown_reservation(self):
        state, quota = queued_exit_trace(['dispatch', 'offboard'])
        self.assertEqual(state, 'unknown')
        self.assertEqual(quota.reservations, {'run': 800})
        quota.settle('run', 400)  # Synthetic later reconciliation, not an API result.
        self.assertEqual(quota.spent, 400)
        self.assertEqual(quota.reservations, {})

    def test_eval_reports_failures_instead_of_inflated_success(self):
        result = eval_synthetic_predictions()
        self.assertEqual(result['grounded'], [1, 2])
        self.assertEqual(result['absent_abstention'], [1, 2])
        self.assertEqual(result['protected_violations'], [1, 2])
        self.assertEqual(result['strict'], [3, 6])
        self.assertEqual(result['failed_fixture_ids'], ['missing-citation', 'fabrication', 'other-tenant'])


if __name__ == '__main__':
    result = unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(Invariants))
    print(json.dumps({'synthetic_eval': eval_synthetic_predictions(), 'scope': 'SQLite local ledger, serial quota model, pure epoch guard and scorer only; no actual model, provider, RLS, concurrent DB, browser or load test'}, ensure_ascii=False, indent=2))
    raise SystemExit(not result.wasSuccessful())
