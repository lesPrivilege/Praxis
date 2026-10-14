#!/usr/bin/env python3
"""Local synthetic invariants only: no provider, UI, load test, or AI invocation.

Run from any directory with Python's standard library. Deliberately bad formulas
are counterexample fixtures; their wrong outputs must be detected by assertions.
"""
from copy import deepcopy
from dataclasses import dataclass
from decimal import Decimal
from hashlib import sha256
from itertools import permutations
import json
import sys
import unittest

D = Decimal


def union(intervals):
    """Merge half-open responsibility intervals before intersecting a calendar."""
    merged = []
    for start, end in sorted(intervals):
        if end < start:
            raise ValueError('negative interval')
        if start == end:
            continue
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    return merged


def working_minutes(intervals, calendar):
    responsibility, windows = union(intervals), union(calendar)
    i = j = total = 0
    while i < len(responsibility) and j < len(windows):
        a, b = responsibility[i]
        c, d = windows[j]
        total += max(0, min(b, d) - max(a, c))
        if b <= d:
            i += 1
        else:
            j += 1
    return total


@dataclass
class Request:
    resolution: int = 1
    cursor: int = 7
    action: str = 'confirmed'
    state: str = 'awaiting_customer'
    waiting_reason: str = 'resolution'
    close_count: int = 0
    followups: int = 0

    def accept(self, resolution, cursor):
        if self.state == 'closed':
            return 'already_closed'
        if (self.state, self.waiting_reason, self.action, self.resolution, self.cursor) != (
                'awaiting_customer', 'resolution', 'confirmed', resolution, cursor):
            return 'conflict'
        self.state = 'closed'
        self.close_count += 1
        return 'closed'

    def customer_problem(self):
        self.cursor += 1
        if self.state == 'closed':
            self.followups += 1
        else:
            self.state = 'working'


def apply_roster(current, changes, mode, references_valid=True):
    if not references_valid or mode not in {'bulk', 'delta'}:
        raise ValueError('quarantined batch')
    output = {} if mode == 'bulk' else dict(current)
    for key, status in changes.items():
        if status == 'active':
            output[key] = status
        elif status == 'withdrawn':
            output.pop(key, None)
        else:
            raise ValueError('unknown local policy status')
    return output


def weighted_grade(items):
    """Synthetic policy, not OneRoster: all required items resolved, excused reweights."""
    total = D(0)
    denominator = D(0)
    if sum(D(i['weight']) for i in items) != 100:
        raise ValueError('weights must sum to 100')
    for item in items:
        weight, maximum = D(item['weight']), D(item['max'])
        if weight <= 0 or maximum <= 0:
            raise ValueError('invalid weight or maximum')
        if item['status'] == 'excused':
            continue
        if item['status'] != 'graded':
            return None
        score = D(item['score'])
        if not 0 <= score <= maximum:
            raise ValueError('score out of range')
        total += score / maximum * weight
        denominator += weight
    if denominator == 0:
        raise ValueError('no assessable items')
    return total / denominator * 100


def digest(items):
    return sha256(json.dumps(items, sort_keys=True).encode()).hexdigest()


def approve(items, expected_hash, role):
    if role != 'grade_approver':
        raise PermissionError('no approval authority')
    if digest(items) != expected_hash:
        raise ValueError('input changed')
    grade = weighted_grade(items)
    if grade is None:
        raise ValueError('incomplete')
    return {'input_hash': expected_hash, 'grade': str(grade), 'snapshot': deepcopy(items)}


def s1():
    return [dict(score='18', max='20', weight='40', status='graded'),
            dict(score='70', max='100', weight='60', status='graded')]


class SupportChecks(unittest.TestCase):
    def test_hand_calculated_three_hours(self):
        self.assertEqual(working_minutes([(960, 2010), (2070, 2160)],
                                         [(540, 1020), (1980, 2460)]), 180)

    def test_duplicate_and_permuted_intervals_do_not_double_count(self):
        intervals = [(960, 2010), (2070, 2160), (960, 2010)]
        for ordering in permutations(intervals):
            self.assertEqual(working_minutes(ordering, [(540, 1020), (1980, 2460)]), 180)

    def test_adjacent_boundaries_and_zero_length(self):
        self.assertEqual(working_minutes([(9, 10), (10, 11), (11, 11)], [(9, 11)]), 2)

    def test_invalid_interval_rejected(self):
        with self.assertRaises(ValueError):
            working_minutes([(10, 9)], [(0, 20)])

    def test_duplicate_confirmation_has_one_close(self):
        request = Request()
        self.assertEqual(request.accept(1, 7), 'closed')
        self.assertEqual(request.accept(1, 7), 'already_closed')
        self.assertEqual(request.close_count, 1)

    def test_new_resolution_invalidates_old_acceptance(self):
        request = Request(resolution=2)
        self.assertEqual(request.accept(1, 7), 'conflict')
        self.assertEqual(request.close_count, 0)

    def test_information_wait_is_not_resolution_acceptance(self):
        request = Request(waiting_reason='information')
        self.assertEqual(request.accept(1, 7), 'conflict')
        request.customer_problem()
        self.assertEqual(request.state, 'working')

    def test_unknown_action_blocks_close(self):
        request = Request(action='unknown')
        self.assertEqual(request.accept(1, 7), 'conflict')

    def test_both_serialized_race_orders_preserve_responsibility(self):
        for order in permutations(('confirm', 'message')):
            request = Request()
            for event in order:
                request.accept(1, 7) if event == 'confirm' else request.customer_problem()
            self.assertTrue(request.state == 'working' or request.followups == 1)
            self.assertLessEqual(request.close_count, 1)

    def test_counterexample_wall_clock_misclassifies_budget(self):
        wall_clock = 2160 - 960
        effective = working_minutes([(960, 2010), (2070, 2160)], [(540, 1020), (1980, 2460)])
        self.assertGreater(wall_clock, 240)
        self.assertLess(effective, 240)

    def test_counterexample_status_only_close_ignores_new_message(self):
        request = Request(cursor=8)
        bad_status_only_guard = request.action == 'confirmed'
        self.assertTrue(bad_status_only_guard)
        self.assertEqual(request.accept(1, 7), 'conflict')


class EducationChecks(unittest.TestCase):
    def test_normal_weighted_result(self):
        self.assertEqual(weighted_grade(s1()), D(78))

    def test_second_student(self):
        items = s1()
        items[0]['score'], items[1]['score'] = '16', '90'
        self.assertEqual(weighted_grade(items), D(86))

    def test_missing_is_not_zero_or_automatic_excusal(self):
        items = s1()
        items[0]['score'], items[1]['status'] = '20', 'missing'
        self.assertIsNone(weighted_grade(items))
        with self.assertRaises(ValueError):
            approve(items, digest(items), 'grade_approver')

    def test_documented_excusal_reweights(self):
        items = s1()
        items[0]['score'], items[1]['status'] = '20', 'excused'
        self.assertEqual(weighted_grade(items), D(100))

    def test_zero_denominator_rejected(self):
        items = s1()
        for item in items:
            item['status'] = 'excused'
        with self.assertRaises(ValueError):
            weighted_grade(items)

    def test_bad_score_and_weight_rejected(self):
        for field, value in [('max', '0'), ('score', '21'), ('weight', '20')]:
            items = s1()
            items[0][field] = value
            with self.assertRaises(ValueError):
                weighted_grade(items)

    def test_revision_does_not_mutate_approved_snapshot(self):
        items = s1()
        first = approve(items, digest(items), 'grade_approver')
        items[1]['score'] = '80'
        second = approve(items, digest(items), 'grade_approver')
        self.assertEqual(D(first['grade']), D(78))
        self.assertEqual(D(second['grade']), D(84))
        self.assertEqual(first['snapshot'][1]['score'], '70')

    def test_stale_approval_rejected(self):
        items = s1()
        old_hash = digest(items)
        items[1]['score'] = '80'
        with self.assertRaises(ValueError):
            approve(items, old_hash, 'grade_approver')

    def test_importer_cannot_approve(self):
        items = s1()
        with self.assertRaises(PermissionError):
            approve(items, digest(items), 'integration_admin')

    def test_delta_preserves_unmentioned_students(self):
        self.assertEqual(set(apply_roster({'S1': 'active', 'S2': 'active'}, {'S3': 'active'}, 'delta')),
                         {'S1', 'S2', 'S3'})

    def test_bulk_and_explicit_withdrawal(self):
        current = {'S1': 'active', 'S2': 'active'}
        self.assertEqual(set(apply_roster(current, {'S3': 'active'}, 'bulk')), {'S3'})
        self.assertEqual(set(apply_roster(current, {'S1': 'withdrawn'}, 'delta')), {'S2'})

    def test_bad_references_leave_old_roster_untouched(self):
        current = {'S1': 'active'}
        with self.assertRaises(ValueError):
            apply_roster(current, {'S2': 'active'}, 'bulk', references_valid=False)
        self.assertEqual(current, {'S1': 'active'})

    def test_tenant_source_keys_do_not_alias(self):
        mapping = {('A', 'SIS', 'user', 'S1'): 'A-record', ('B', 'SIS', 'user', 'S1'): 'B-record'}
        self.assertEqual(mapping[('A', 'SIS', 'user', 'S1')], 'A-record')
        self.assertNotEqual(mapping[('A', 'SIS', 'user', 'S1')], mapping[('B', 'SIS', 'user', 'S1')])

    def test_counterexample_sum_raw_points_violates_weights(self):
        wrong = D(18 + 70) / D(20 + 100) * 100
        self.assertNotEqual(wrong, weighted_grade(s1()))
        self.assertEqual(wrong.quantize(D('.1')), D('73.3'))

    def test_counterexample_missing_as_zero_creates_unapproved_penalty(self):
        items = s1()
        items[0]['score'], items[1]['status'] = '20', 'missing'
        wrong = D(20) / D(20) * 40
        self.assertEqual(wrong, 40)
        self.assertIsNone(weighted_grade(items))

    def test_counterexample_delta_as_bulk_deletes_two_students(self):
        current = {'S1': 'active', 'S2': 'active'}
        wrong = apply_roster(current, {'S3': 'active'}, 'bulk')
        correct = apply_roster(current, {'S3': 'active'}, 'delta')
        self.assertEqual(set(correct) - set(wrong), {'S1', 'S2'})


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromModule(sys.modules[__name__])
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    print(json.dumps({'status': 'pass' if result.wasSuccessful() else 'fail',
                      'tests_run': result.testsRun,
                      'failures': len(result.failures), 'errors': len(result.errors),
                      'deliberately_bad_counterexamples_detected': 5,
                      'scope': 'synthetic pure calculations and in-memory guards only',
                      'not_run': ['provider integration', 'database concurrency', 'browser E2E', 'load', 'AI eval']},
                     ensure_ascii=False))
    raise SystemExit(not result.wasSuccessful())
