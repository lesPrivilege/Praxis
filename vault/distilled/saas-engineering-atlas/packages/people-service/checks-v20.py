#!/usr/bin/env python3
"""Synthetic V20 invariants only: no UI, production DB, network, or provider API.

Negative fixtures must raise; mutant examples deliberately produce wrong results
and are compared against independently stated business expectations. Reordering
uses exhaustive permutations of four fixed events. The reservation race is an
explicit sequential interleaving of stale versions, not a threaded DB test.
"""
import itertools
import json
import unittest
from fractions import Fraction


def first_slot(windows, ready, duration):
    if duration <= 0:
        raise ValueError('invalid-duration')
    slots = [(max(start, ready), max(start, ready) + duration)
             for start, end in windows
             if start < end and max(start, ready) + duration <= end]
    return min(slots) if slots else None


def calibration_slot(installation_end):
    ready = installation_end + 30
    windows = {'lin': [(0, 120), (180, 300)], 'chen': [(60, 240)]}
    feasible = [(slot[1], name, slot) for name, w in windows.items()
                if (slot := first_slot(w, ready, 60)) is not None]
    return min(feasible)[1:] if feasible else None


# (device operation ID, sequence, minute, resulting state)
INSTALLATION = [('a', 1, 0, 'in_progress'), ('b', 2, 40, 'on_break'),
                ('c', 3, 50, 'in_progress'), ('d', 4, 100, 'completed')]
CALIBRATION = [('e', 1, 130, 'in_progress'), ('f', 2, 190, 'completed')]


def work_minutes(events):
    by_operation = {}
    for event in events:
        if event[0] in by_operation and by_operation[event[0]] != event:
            raise ValueError('operation-content-conflict')
        by_operation[event[0]] = event
    ordered = sorted(by_operation.values(), key=lambda e: e[1])
    if [e[1] for e in ordered] != list(range(1, len(ordered) + 1)):
        raise ValueError('sequence-gap-or-conflict')
    if not ordered or ordered[-1][3] != 'completed':
        raise ValueError('incomplete-journal')
    allowed = {'scheduled': {'in_progress'}, 'in_progress': {'on_break', 'completed'},
               'on_break': {'in_progress'}, 'completed': set()}
    state, previous, total = 'scheduled', None, 0
    for _, _, minute, next_state in ordered:
        if next_state not in allowed[state] or minute < 0:
            raise ValueError('invalid-transition')
        if previous is not None:
            if minute < previous:
                raise ValueError('time-reversal')
            if state == 'in_progress':
                total += minute - previous
        state, previous = next_state, minute
    return total


def accepts(scope_version, result_scope, required, qualified, attachments, supervisor):
    return (scope_version == result_scope and bool(required)
            and required <= qualified and required <= attachments and supervisor)


class Reservations:
    def __init__(self):
        self.version, self.rows = {}, []

    def reserve(self, tenant, resource, interval, expected):
        key = tenant, resource
        if self.version.get(key, 0) != expected:
            raise ValueError('version-conflict')
        start, end = interval
        if start >= end:
            raise ValueError('invalid-interval')
        if any(t == tenant and r == resource and start < b and a < end
               for t, r, a, b in self.rows):
            raise ValueError('time-conflict')
        self.rows.append((tenant, resource, start, end))
        self.version[key] = expected + 1


class FakeFinance:
    def __init__(self):
        self.invoices, self.calls = {}, 0

    def create(self, ref, amount):
        self.calls += 1
        if ref in self.invoices:
            raise ValueError('duplicate-create-would-be-unsafe')
        self.invoices[ref] = amount


class Posting:
    def __init__(self, ledger, finance):
        self.ledger, self.finance = ledger, finance

    def start(self, ref, amount, lose_response=False):
        if ref in self.ledger:
            if self.ledger[ref]['amount'] != amount:
                raise ValueError('operation-content-conflict')
            return self.ledger[ref]['state']
        self.ledger[ref] = {'amount': amount, 'state': 'prepared'}
        self.finance.create(ref, amount)
        self.ledger[ref]['state'] = 'unknown' if lose_response else 'confirmed'
        return self.ledger[ref]['state']

    def reconcile(self, ref):
        operation = self.ledger[ref]
        if self.finance.invoices.get(ref) == operation['amount']:
            operation['state'] = 'confirmed'
        return operation['state']


class V20Checks(unittest.TestCase):
    def test_planned_and_replanned_schedule(self):
        self.assertEqual(first_slot([(0, 120), (180, 300)], 0, 90), (0, 90))
        self.assertEqual(calibration_slot(90), ('chen', (120, 180)))
        self.assertEqual(calibration_slot(100), ('chen', (130, 190)))
        self.assertIsNone(calibration_slot(300))

    def test_greedy_without_dependency_is_counterexample(self):
        naive = first_slot([(60, 240)], 0, 60)
        self.assertEqual(naive, (60, 120))
        self.assertLess(naive[0], 90 + 30)  # exposes a feasible-looking invalid plan

    def test_hours_and_invoice(self):
        minutes = work_minutes(INSTALLATION) + work_minutes(CALIBRATION)
        self.assertEqual(minutes, 150)
        self.assertEqual(Fraction(minutes * 120, 60) + 200, 500)
        self.assertEqual(500 - 300, 200)
        self.assertEqual(500 - 300 - 200, 0)

    def test_every_arrival_order_and_duplicate_keeps_90_minutes(self):
        for arrival in itertools.permutations(INSTALLATION):
            self.assertEqual(work_minutes(list(arrival) + [INSTALLATION[2]]), 90)

    def test_gap_does_not_invent_minutes(self):
        with self.assertRaisesRegex(ValueError, 'sequence-gap'):
            work_minutes([INSTALLATION[0], INSTALLATION[1], INSTALLATION[3]])

    def test_identity_conflict_is_not_deduplicated_silently(self):
        with self.assertRaisesRegex(ValueError, 'operation-content-conflict'):
            work_minutes(INSTALLATION + [('c', 3, 60, 'in_progress')])

    def test_bad_transition_and_time_are_rejected(self):
        for events in [[('x', 1, 10, 'completed')],
                       [('x', 1, 10, 'in_progress'), ('y', 2, 5, 'completed')],
                       [('x', 1, 0, 'in_progress')]]:
            with self.assertRaises(ValueError):
                work_minutes(events)

    def test_elapsed_time_mutant_overcharges(self):
        wrong_installation = INSTALLATION[-1][2] - INSTALLATION[0][2]
        self.assertEqual(wrong_installation, 100)
        self.assertEqual(Fraction((wrong_installation - work_minutes(INSTALLATION)) * 120, 60), 20)

    def test_canceled_booking_does_not_satisfy_scope(self):
        required = {'install', 'calibrate'}
        # The product's completed/canceled aggregation is deliberately insufficient.
        booking_states = ['completed', 'canceled']
        naive_complete = all(s in {'completed', 'canceled'} for s in booking_states)
        self.assertTrue(naive_complete)
        self.assertFalse(accepts(1, 1, required, {'install'}, {'install'}, True))
        self.assertTrue(accepts(1, 1, required, required, required, True))

    def test_evidence_scope_and_authority_guards(self):
        required = {'install', 'calibrate'}
        self.assertFalse(accepts(2, 1, required, required, required, True))
        self.assertFalse(accepts(1, 1, required, required, {'install'}, True))
        self.assertFalse(accepts(1, 1, required, required, required, False))
        self.assertFalse(accepts(1, 1, set(), set(), set(), True))

    def test_stale_interleaving_and_overlapping_interval_rejected(self):
        slots = Reservations()
        slots.reserve('tenant-a', 'lin', (0, 90), expected=0)
        with self.assertRaisesRegex(ValueError, 'version-conflict'):
            slots.reserve('tenant-a', 'lin', (10, 100), expected=0)
        with self.assertRaisesRegex(ValueError, 'time-conflict'):
            slots.reserve('tenant-a', 'lin', (10, 100), expected=1)
        slots.reserve('tenant-a', 'lin', (90, 120), expected=1)  # half-open adjacency
        self.assertEqual(len(slots.rows), 2)

    def test_tenant_is_part_of_resource_and_object_keys(self):
        slots = Reservations()
        slots.reserve('tenant-a', '42', (0, 90), 0)
        slots.reserve('tenant-b', '42', (0, 90), 0)
        scoped = {('tenant-a', '42'): 'a-result', ('tenant-b', '42'): 'b-result'}
        self.assertEqual(scoped[('tenant-b', '42')], 'b-result')
        with self.assertRaises(KeyError):
            _ = scoped[('tenant-c', '42')]

    def test_timeout_reconcile_and_restart_do_not_recreate_invoice(self):
        finance, ledger = FakeFinance(), {}
        app = Posting(ledger, finance)
        self.assertEqual(app.start(('tenant-a', 'wo1', 1, 1), 500, True), 'unknown')
        # Rehydrate local ledger: in-memory fake finance stands in for external durability.
        saved = dict(ledger)
        restarted = Posting(saved, finance)
        self.assertEqual(restarted.start(('tenant-a', 'wo1', 1, 1), 500), 'unknown')
        self.assertEqual(restarted.reconcile(('tenant-a', 'wo1', 1, 1)), 'confirmed')
        self.assertEqual(restarted.start(('tenant-a', 'wo1', 1, 1), 500), 'confirmed')
        self.assertEqual(finance.calls, 1)
        self.assertEqual(len(finance.invoices), 1)

    def test_lookup_absence_keeps_unknown_and_changed_amount_rejected(self):
        finance = FakeFinance()
        ref = ('tenant-a', 'wo2', 1, 1)
        app = Posting({ref: {'amount': 500, 'state': 'unknown'}}, finance)
        self.assertEqual(app.reconcile(ref), 'unknown')
        with self.assertRaisesRegex(ValueError, 'operation-content-conflict'):
            app.start(ref, 520)
        self.assertEqual(finance.calls, 0)


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(V20Checks)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    print(json.dumps({'case': 'V20', 'tests': result.testsRun,
                      'status': 'pass' if result.wasSuccessful() else 'fail',
                      'negative_examples': ['greedy-without-dependency', 'elapsed-time-overcharge',
                                            'completed-or-canceled-is-not-acceptance'],
                      'scope': 'synthetic functions and fake ledger; no real concurrency, database, API, UI, performance, or AI eval'},
                     ensure_ascii=False))
    raise SystemExit(not result.wasSuccessful())
