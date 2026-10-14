#!/usr/bin/env python3
"""Local synthetic invariants only: no UI, database, provider, AI or load execution.

Run from the repository root with the path shown in README. The deliberately
wrong algorithms are counterexamples, not implementations of any provider.
"""
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from fractions import Fraction
import unittest


def cumulative(amount, start, end, day):
    if not all(isinstance(x, int) for x in (amount, start, end, day)):
        raise ValueError('integer minor units and equal-day boundaries required')
    if amount < 0 or start >= end:
        raise ValueError('nonnegative amount and nonempty service interval required')
    return amount * min(max(day - start, 0), end - start) // (end - start)


def window(amount, start, end, a, b):
    if a > b:
        raise ValueError('observation window reversed')
    return cumulative(amount, start, end, b) - cumulative(amount, start, end, a)


def match_quantity(ordered, received, accepted, allocated, requested):
    if min(ordered, received, accepted, allocated, requested) < 0:
        raise ValueError('negative quantity is an explicit correction, not a new allocation')
    if accepted > received or allocated > min(ordered, received, accepted):
        raise ValueError('inconsistent evidence or an unresolved downward correction')
    return requested <= min(ordered, received, accepted) - allocated


def reconcile(left, right):
    """Rows are (full source identity, signed minor units). No fuzzy matching."""
    l, r = defaultdict(list), defaultdict(list)
    for key, amount in left:
        l[key].append(amount)
    for key, amount in right:
        r[key].append(amount)
    result = []
    for key in sorted(l.keys() | r.keys()):
        a, b = l[key], r[key]
        delta = sum(b) - sum(a)
        # This fixture uses 1:1 source effects; aggregated posting requires a manifest.
        if not a or not b or len(a) != 1 or len(b) != 1 or delta:
            result.append((key, delta, len(a), len(b)))
    return result


def earliest_finish(durations, dependencies):
    finish, remaining = {}, set(durations)
    while remaining:
        ready = sorted(k for k in remaining if set(dependencies.get(k, [])) <= finish.keys())
        if not ready:
            raise ValueError('dependency cycle')
        for k in ready:
            finish[k] = durations[k] + max((finish[p] for p in dependencies.get(k, [])), default=0)
            remaining.remove(k)
    return finish


def largest_remainders(total, weights):
    if total < 0 or not weights or min(weights) < 0 or sum(weights) <= 0:
        raise ValueError('invalid allocation input')
    quotas = [Fraction(total * w, sum(weights)) for w in weights]
    allocations = [q.numerator // q.denominator for q in quotas]
    remainder = total - sum(allocations)
    order = sorted(range(len(weights)), key=lambda i: (-(quotas[i] - allocations[i]), i))
    for i in order[:remainder]:
        allocations[i] += 1
    return allocations


def intercompany_pairs(rows):
    """Each row contains complete pair identity, side and integer amount."""
    groups = defaultdict(lambda: {'AR': [], 'AP': []})
    for key, side, amount in rows:
        if side not in ('AR', 'AP') or amount < 0:
            raise ValueError('invalid side/amount')
        groups[key][side].append(amount)
    return {key: {'delta': sum(sides['AR']) - sum(sides['AP']),
                  'ar_count': len(sides['AR']), 'ap_count': len(sides['AP'])}
            for key, sides in groups.items()
            if len(sides['AR']) != 1 or len(sides['AP']) != 1
            or sum(sides['AR']) != sum(sides['AP'])}


class ServiceWindows(unittest.TestCase):
    def test_contract_amendment_and_credit(self):
        base = cumulative(27000, 0, 30, 20)
        extra = cumulative(9000, 12, 30, 20)
        credit = window(9000, 12, 30, 20, 30)
        self.assertEqual((base, extra, credit), (18000, 4000, 5000))
        self.assertEqual(36000 - credit, base + extra + 9000)
        # Before refund confirmation: cash remains 36000, liability is 5000.
        self.assertEqual(36000 - 5000, 31000)

    def test_rounding_counterexample(self):
        correct = [window(100, 0, 3, d, d + 1) for d in range(3)]
        wrong = sum(round(Fraction(100, 3)) for _ in range(3))
        self.assertEqual(correct, [33, 33, 34])
        self.assertEqual(wrong, 99)
        self.assertNotEqual(wrong, sum(correct))

    def test_adjacent_windows_and_boundaries(self):
        for amount in (0, 1, 100, 30001):
            for start, end in ((0, 3), (12, 30)):
                for a in range(start - 1, end + 2):
                    for b in range(a, end + 2):
                        self.assertEqual(window(amount, start, end, start - 1, a)
                                         + window(amount, start, end, a, b),
                                         window(amount, start, end, start - 1, b))
                self.assertEqual(window(amount, start, end, start, end), amount)

    def test_invalid_inputs_rejected(self):
        for args in ((-1, 0, 30, 10), (100, 3, 3, 3), (100, 3, 2, 3), (1.5, 0, 3, 1)):
            with self.assertRaises(ValueError):
                cumulative(*args)
        with self.assertRaises(ValueError):
            window(100, 0, 3, 2, 1)


class ProcurementAndClose(unittest.TestCase):
    def test_cumulative_allocation(self):
        self.assertTrue(match_quantity(100, 80, 75, 0, 70))
        self.assertFalse(match_quantity(100, 80, 75, 70, 10))
        self.assertTrue(match_quantity(100, 80, 75, 70, 5))
        self.assertFalse(match_quantity(100, 80, 75, 75, 5))
        self.assertTrue(match_quantity(100, 80, 80, 70, 10))
        self.assertEqual((70 * 1010, 5 * 1010, 75 * 1010), (70700, 5050, 75750))
        self.assertEqual(Fraction(1010 - 1000, 1000), Fraction(1, 100))

    def test_per_invoice_comparison_is_wrong(self):
        self.assertTrue(70 <= 75 and 10 <= 75)
        self.assertGreater(70 + 10, 75)
        with self.assertRaises(ValueError):
            match_quantity(100, 80, 68, 70, 1)
        with self.assertRaises(ValueError):
            match_quantity(100, 80, 75, 0, -1)

    def test_reconciliation_and_correction(self):
        left = [('A', 70700), ('B', 5050), ('PAY-A', -70700)]
        right = [('A', 70700), ('A', 70700), ('PAY-A', -70700)]
        self.assertEqual(reconcile(left, right), [('A', 70700, 1, 2), ('B', -5050, 1, 0)])
        self.assertEqual(100000 + sum(v for _, v in right), 170700)
        self.assertEqual(100000 + sum(v for _, v in left), 105050)
        self.assertEqual(170700 - 70700 + 5050, 105050)
        # Corrections remain linked history; the 1:1 comparator above does not
        # pretend it can infer an effective projection from reversal rows alone.
        effective_projection = [('A', 70700), ('B', 5050), ('PAY-A', -70700)]
        self.assertEqual(reconcile(left, effective_projection), [])
        self.assertEqual(200000 - 70700, 129300)
        self.assertEqual(105050 + 5000, 110050)

    def test_zero_net_is_not_complete(self):
        left = [('invoice', 10000), ('payment', -10000)]
        self.assertEqual(sum(v for _, v in left), 0)
        self.assertEqual(len(reconcile(left, [])), 2)
        self.assertEqual(len(reconcile([('tenant-A:INV', 10000)], [('tenant-B:INV', 10000)])), 2)

    def test_dependency_schedule_and_cycle(self):
        durations = dict(A=2, B=3, C=4, D=1, E=1)
        deps = dict(A=[], B=['A'], C=[], D=['B', 'C'], E=['D'])
        self.assertEqual(earliest_finish(durations, deps), dict(A=2, C=4, B=5, D=6, E=7))
        # B and C share a nonpreemptive resource. This feasible schedule reaches
        # the 3+4+1+1=9 lower bound; A has its own resource.
        schedule = dict(A=(0, 2), C=(0, 4), B=(4, 7), D=(7, 8), E=(8, 9))
        for task, predecessors in deps.items():
            self.assertEqual(schedule[task][1] - schedule[task][0], durations[task])
            self.assertTrue(all(schedule[p][1] <= schedule[task][0] for p in predecessors))
        self.assertLessEqual(schedule['C'][1], schedule['B'][0])
        self.assertEqual(schedule['E'][1], 9)
        with self.assertRaises(ValueError):
            earliest_finish(durations, dict(deps, A=['E']))


class MarketsAndGroup(unittest.TestCase):
    def test_fills_allocation_and_cash(self):
        quantity, cents = 40 + 25, 40 * 1000 + 25 * 1004
        shares = largest_remainders(quantity, [50, 30, 20])
        cash = largest_remainders(cents, shares)
        self.assertEqual((quantity, cents), (65, 65100))
        self.assertEqual(shares, [33, 19, 13])
        self.assertEqual(cash, [33051, 19029, 13020])
        self.assertEqual(sum(cash), cents)
        self.assertEqual(65100 + 35 * 1010, 100450)
        self.assertEqual(100 * 1010, 101000)

    def test_rounded_average_and_lot_counterexamples(self):
        avg = (Decimal('651') / Decimal(65)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
        self.assertEqual(avg * 65, Decimal('651.30'))
        self.assertNotEqual(avg * 65, Decimal('651'))
        independent = [int(q.quantize(Decimal('1'), rounding=ROUND_HALF_UP))
                       for q in [Decimal('32.5'), Decimal('19.5'), Decimal('13')]]
        self.assertEqual(sum(independent), 66)
        self.assertNotEqual(65 % 10, 0)
        self.assertGreater(largest_remainders(65, [50, 30, 20])[0], 30)

    def test_trade_correction_and_partial_settlement(self):
        self.assertEqual(40 + 20, 60)
        amount = 40 * 1000 + 20 * 1004
        self.assertEqual(amount, 60080)
        shares = largest_remainders(60, [50, 30, 20])
        self.assertEqual(shares, [30, 18, 12])
        self.assertEqual(largest_remainders(amount, shares), [30040, 18024, 12016])
        self.assertEqual((33 + 10 + 13, 65 - (33 + 10 + 13)), (56, 9))

    def test_intercompany_elimination_and_cash(self):
        external, internal, cost = 60 * 12, 60 * 9, 60 * 6
        self.assertEqual((external, internal, cost), (720, 540, 360))
        gross_revenue, gross_cost = external + internal, internal + cost
        self.assertEqual((gross_revenue, gross_cost), (1260, 900))
        self.assertEqual((gross_revenue - internal, gross_cost - internal), (720, 360))
        self.assertEqual((720 - 540) + 540, 720)
        self.assertEqual((10 * 12, 10 * 9, 10 * 6), (120, 90, 60))
        self.assertEqual(((60 - 10) * 12, (60 - 10) * 6), (600, 300))
        self.assertEqual((40 * 12, 40 * 6), (480, 240))
        self.assertEqual((40 * 9, 40 * 6, 40 * (9 - 6)), (360, 240, 120))

    def test_pair_zero_net_and_currency_mismatch(self):
        rows = [('T1:CU:P', 'AR', 540), ('T1:CU:P', 'AP', 530),
                ('T2:CU:P', 'AR', 360), ('T2:CU:P', 'AP', 370)]
        exceptions = intercompany_pairs(rows)
        self.assertEqual(len(exceptions), 2)
        self.assertEqual(sum(item['delta'] for item in exceptions.values()), 0)
        self.assertEqual(intercompany_pairs([('T1:CU:P', 'AR', 540), ('T1:CU:P', 'AP', 540)]), {})
        self.assertEqual(len(intercompany_pairs([('T1:U:P', 'AR', 540), ('T1:V:P', 'AP', 540)])), 2)
        self.assertEqual(len(intercompany_pairs([('T1:CU:P', 'AR', 540), ('T1:CU:P+1', 'AP', 540)])), 2)
        # Distinct roles are legal derivatives of one physical line.
        keys = {('B:L1:v1', 'A', role) for role in ['virtual-receipt', 'virtual-issue', 'virtual-receipt']}
        self.assertEqual(len(keys), 2)
        self.assertEqual(len({('B:L1:v1', 'A') for _ in range(3)}), 1)


def payoff(principal, rate, payment, value_day, as_of):
    if not (0 <= value_day <= as_of) or min(principal, rate, payment) < 0:
        raise ValueError('invalid loan time or amount')
    first_interest = (principal * rate * value_day).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
    if not first_interest <= payment <= principal + first_interest:
        raise ValueError('fixture assumes interest covered and no overpayment')
    outstanding = principal - (payment - first_interest)
    later_interest = (outstanding * rate * (as_of - value_day)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
    return outstanding + later_interest


def covered_loss(loss, deductible=500, limit=8000):
    if min(loss, deductible, limit) < 0:
        raise ValueError('negative insurance policy input')
    return min(max(loss - deductible, 0), limit)


def payment_capacity(approved_reserve, decision, paid, unresolved):
    if min(approved_reserve, decision, paid, unresolved) < 0:
        raise ValueError('negative balance')
    available = min(approved_reserve, decision) - paid - unresolved
    if available < 0:
        raise ValueError('new decision conflicts with existing paid or unresolved amount')
    return available


class CreditAndInsurance(unittest.TestCase):
    def test_effective_time_payoff(self):
        p, r, paid = Decimal('1000'), Decimal('.001'), Decimal('310')
        self.assertEqual(payoff(p, r, paid, 10, 15), Decimal('703.50'))
        self.assertEqual(payoff(p, r, paid, 8, 15), Decimal('702.89'))
        self.assertEqual(payoff(p, r, paid, 11, 15), Decimal('703.80'))
        self.assertNotEqual(payoff(p, r, paid, 11, 15), payoff(p, r, paid, 8, 15))
        self.assertEqual(Decimal('310') + Decimal('703.50'), Decimal('1013.50'))

    def test_expired_quote_reversal_and_tranches(self):
        self.assertEqual(payoff(Decimal('1000'), Decimal('.001'), Decimal('310'), 10, 16), Decimal('704.20'))
        self.assertEqual(Decimal('704.20') - Decimal('703.50'), Decimal('.70'))
        self.assertEqual(Decimal('1000') + Decimal('1000') * Decimal('.001') * 15, Decimal('1015'))
        self.assertEqual(Decimal('500') * Decimal('.001') * 10, Decimal('5'))
        with self.assertRaises(ValueError):
            payoff(Decimal('1000'), Decimal('.001'), Decimal('310'), 16, 15)

    def test_deductible_limit_and_counterexample(self):
        self.assertEqual([covered_loss(x) for x in (0, 400, 500, 6000, 10000)], [0, 0, 0, 5500, 8000])
        wrong = min(10000, 8000) - 500
        self.assertEqual(wrong, 7500)
        self.assertNotEqual(wrong, covered_loss(10000))
        self.assertTrue(0 <= 360 < 365)
        self.assertFalse(0 <= 370 < 365)
        with self.assertRaises(ValueError):
            covered_loss(-1)

    def test_reserve_capacity_and_group_boundaries(self):
        self.assertEqual(payment_capacity(5500, 5500, 2000, 1000), 2500)
        self.assertEqual(payment_capacity(5500, 5500, 2000, 3000), 500)
        with self.assertRaises(ValueError):
            payment_capacity(5500, 5500, 2000, 5000)
        with self.assertRaises(ValueError):
            payment_capacity(2500, 5500, 2000, 1000)
        # An estimate can exist before the coverage decision; it is not permission to pay.
        self.assertEqual(payment_capacity(5500, 0, 0, 0), 0)
        key = ('tenant-A', 'claim-1', 'exposure-1', 'indemnity', 'CU')
        estimates = {key: 5500,
                     ('tenant-A', 'claim-1', 'exposure-1', 'expense', 'CU'): 300,
                     ('tenant-A', 'claim-1', 'exposure-2', 'indemnity', 'CU'): 2000,
                     ('tenant-A', 'claim-1', 'exposure-1', 'indemnity', 'FX'): 1000}
        self.assertEqual(estimates[key], 5500)
        self.assertNotEqual(sum(estimates.values()), estimates[key])
        self.assertGreater(4000 + 300, 3000)
        self.assertLessEqual(4000 + 300, 6000)


if __name__ == '__main__':
    unittest.main(verbosity=2)
