#!/usr/bin/env python3
"""P06 executable teaching fixtures. Standard library only; no app/provider/EDA.

Run from the repository root:
  python3 vault/distilled/saas-engineering-atlas/packages/industry-networks/synthetic_checks.py
The independent constants in assertions are the hand-worked answers in the prose.
Negative fixtures deliberately demonstrate why plausible shortcuts are unsafe.
"""
from collections import defaultdict, deque
from decimal import Decimal as D
from itertools import product
import sqlite3
import unittest


def manufacturable(bom, stock):
    if not bom or any(v <= 0 for v in bom.values()):
        raise ValueError('positive component quantities required')
    return min(stock.get(k, 0) // v for k, v in bom.items())


def material_balance(inputs, outputs):
    if any(x < 0 for x in inputs + outputs) or sum(inputs) != sum(outputs):
        raise ValueError('material balance mismatch')
    return True


def descendants(start, adjacency):
    seen, queue = set(), deque([start])
    while queue:
        item = queue.popleft()
        if item in seen:
            continue
        seen.add(item)
        queue.extend(adjacency.get(item, []))
    return seen


def critical_finish(duration, predecessors):
    """Topological dynamic program, rejecting cycles instead of hanging."""
    indegree = {n: len(predecessors.get(n, [])) for n in duration}
    successors = defaultdict(list)
    for n, ps in predecessors.items():
        for p in ps:
            if p not in duration:
                raise ValueError('unknown predecessor')
            successors[p].append(n)
    queue = deque(n for n, degree in indegree.items() if degree == 0)
    finish = {}
    while queue:
        n = queue.popleft()
        finish[n] = duration[n] + max((finish[p] for p in predecessors.get(n, [])), default=0)
        for s in successors[n]:
            indegree[s] -= 1
            if indegree[s] == 0:
                queue.append(s)
    if len(finish) != len(duration):
        raise ValueError('dependency cycle')
    return finish


def release_allowed(required, evidence, manifest):
    """Missing reports and mismatched inputs fail even if every present row passes."""
    return bool(required) and all(
        name in evidence and evidence[name]['manifest'] == manifest
        and evidence[name]['passed'] for name in required
    )


def half_open_overlap(start, end, other_start, other_end):
    if start >= end or other_start >= other_end:
        raise ValueError('empty or reversed interval')
    return max(0, min(end, other_end) - max(start, other_start))


def usage_charge(records, billable_interval, allowance, unit_price, scope=('t1', 's1')):
    seen, usage = {}, D(0)
    for tenant, service, usage_id, occurred, received, amount in records:
        if (tenant, service) != scope:
            raise ValueError('usage outside selected tenant/service scope')
        key = (tenant, service, usage_id)
        canonical = (occurred, D(amount))
        if key in seen:
            if seen[key] != canonical:
                raise ValueError('same usage ID with conflicting payload')
            continue
        seen[key] = canonical
        if billable_interval[0] <= occurred < billable_interval[1]:
            usage += D(amount)
    return max(D(0), usage - D(allowance)) * D(unit_price)


def supply_candidates(capacity=10):
    loads = (6, 5, 5)
    penalties = (9, 7, 7)
    result = []
    for days in product((1, 2), repeat=3):
        if any(sum(q for q, d in zip(loads, days) if d == day) > capacity for day in (1, 2)):
            continue
        cost = 100 * len(set(days)) + sum(q * p * (d - 1) for q, p, d in zip(loads, penalties, days))
        result.append((cost, days))
    return sorted(result)


class StockReservation:
    """Serial conditional-update model; version conflict is not stock shortage."""
    def __init__(self, available=16):
        self.available, self.version = available, 1
        self.reserved = {}

    def reserve(self, identity, qty, expected_version):
        if type(qty) is not int or qty <= 0:
            raise ValueError('invalid_quantity')
        if identity in self.reserved:
            if self.reserved[identity] != qty:
                raise ValueError('identity_conflict')
            return 'reserved'
        if expected_version != self.version:
            return 'version_conflict'
        if qty > self.available:
            return 'insufficient_stock'
        self.available -= qty
        self.version += 1
        self.reserved[identity] = qty
        return 'reserved'


class ManufacturingTests(unittest.TestCase):
    def test_v07_component_bottleneck(self):
        self.assertEqual(manufacturable({'blank': 1, 'fastener': 2}, {'blank': 14, 'fastener': 22}), 11)
        self.assertEqual(12 * 2 - 22, 2)

    def test_v07_missing_component_rejected(self):
        self.assertEqual(manufacturable({'blank': 1, 'fastener': 2}, {'blank': 14}), 0)
        with self.assertRaises(ValueError):
            manufacturable({'blank': 0}, {'blank': 14})

    def test_v07_rework_not_double_counted(self):
        # Twelve started; the two rework units are already inside twelve.
        self.assertTrue(material_balance([12], [9, 2, 1]))
        self.assertTrue(material_balance([2], [1, 1]))
        accepted, scrap = 9 + 1, 1 + 1
        self.assertEqual((accepted, scrap), (10, 2))
        self.assertTrue(material_balance([12], [accepted, scrap]))
        with self.assertRaises(ValueError):
            material_balance([12], [accepted, scrap, 2])
        self.assertEqual(accepted * 50 - 300, 200)

    def test_v08_transformations_conserve_material(self):
        self.assertTrue(material_balance([100, 50], [145, 3, 2]))
        self.assertTrue(material_balance([145], [80, 65]))
        self.assertTrue(material_balance([20, 30], [49, 1]))
        with self.assertRaises(ValueError):
            material_balance([20, 30], [50, 1])

    def test_v08_forward_quarantine_not_intermediate_sum(self):
        graph = {'A': ['bulk'], 'B': ['bulk'], 'bulk': ['pack80', 'split65'],
                 'split65': ['remaining45', 'mixed49'], 'C': ['mixed49']}
        live = {'pack80': 80, 'remaining45': 45, 'mixed49': 49}
        affected = descendants('A', graph)
        self.assertEqual(set(live) & affected, set(live))
        self.assertEqual(sum(q for n, q in live.items() if n in affected), 174)
        self.assertNotIn('C', affected)  # C's other inventory is not a descendant of A.
        self.assertEqual(sum(q for n, q in live.items() if n in descendants('C', graph)), 49)

    def test_v08_external_stale_release_requires_version_fence(self):
        commands = [(5, 'blocked'), (4, 'released')]
        unsafe_state = None
        version, protected_state = 0, None
        for incoming_version, state in commands:
            unsafe_state = state  # counterexample: arrival order overwrites prohibition
            if incoming_version > version:
                version, protected_state = incoming_version, state
        self.assertEqual(unsafe_state, 'released')
        self.assertEqual((version, protected_state), (5, 'blocked'))
        local_decision, external_known = 'blocked', False
        self.assertFalse(local_decision == 'released' and external_known)

    def test_v08_cycle_defensive_traversal_terminates(self):
        # A bad genealogy cycle must not hang a query; separate validation should reject it.
        self.assertEqual(descendants('A', {'A': ['B'], 'B': ['A']}), {'A', 'B'})


class DesignEvidenceTests(unittest.TestCase):
    duration = {'S': 4, 'E': 3, 'P': 6, 'T': 2, 'D': 5, 'R': 1}
    predecessors = {'E': ['S'], 'P': ['S'], 'T': ['P'], 'D': ['P'], 'R': ['E', 'T', 'D']}

    def test_v09_dag_critical_path(self):
        self.assertEqual(critical_finish(self.duration, self.predecessors)['R'], 16)
        self.assertEqual(critical_finish(dict(self.duration, T=1), self.predecessors)['R'], 16)
        self.assertEqual(critical_finish(dict(self.duration, D=3), self.predecessors)['R'], 14)

    def test_v09_single_license_changes_lower_bound(self):
        constrained = dict(self.predecessors, D=['P', 'T'])
        self.assertEqual(critical_finish(self.duration, constrained)['R'], 18)

    def test_v09_cycle_is_configuration_error(self):
        with self.assertRaises(ValueError):
            critical_finish(self.duration, dict(self.predecessors, S=['R']))

    def test_v09_invalidation_scope(self):
        graph = {'S': ['E', 'P'], 'P': ['T', 'D'], 'E': ['R'], 'T': ['R'], 'D': ['R']}
        self.assertEqual(descendants('P', graph), {'P', 'T', 'D', 'R'})

    def test_v09_positive_average_is_unsafe(self):
        slacks = [D('1.00') - D('.10') - D('.82'), D('1.00') - D('.10') - D('.95')]
        self.assertEqual(slacks, [D('.08'), D('-.05')])
        self.assertEqual(sum(slacks) / 2, D('.015'))
        self.assertFalse(all(x >= 0 for x in slacks))
        self.assertEqual(D('.04') - D('.07'), D('-.03'))

    def test_v09_missing_and_wrong_version_evidence(self):
        reports = {'A': {'manifest': 'B1', 'passed': True}}
        self.assertTrue(release_allowed({'A'}, reports, 'B1'))
        self.assertFalse(release_allowed({'A', 'B'}, reports, 'B1'))
        self.assertFalse(release_allowed({'A'}, reports, 'B2'))
        self.assertFalse(release_allowed(set(), {}, 'B1'))


def alert_window(samples, start=0, width=5):
    """Rows are (event minute, comparable integer source revision, value).

    The fixture already belongs to one authorized asset/channel; this function
    does not implement authorization or clock-trust validation.
    """
    revisions, selected = {}, {}
    for minute, rev, value in samples:
        key = (minute, rev)
        value = D(str(value))
        if key in revisions and revisions[key] != value:
            raise ValueError('conflicting sample revision')
        revisions[key] = value
        if minute not in selected or rev > selected[minute][0]:
            selected[minute] = (rev, value)
    minutes = range(start, start + width)
    if any(m not in selected for m in minutes):
        return None  # unknown is not a healthy result
    return sum(selected[m][1] > D('7.0') for m in minutes) >= 3


def vee_bill(raw, maximum_estimated_share=D('.30')):
    """Exactly the four-interval, two-tariff teaching policy in V11."""
    if len(raw) != 4:
        raise ValueError('this fixture requires four intervals')
    original = [None if x is None else D(str(x)) for x in raw]
    result, estimated = [], D(0)
    for i, value in enumerate(original):
        if value is None:
            if i == 0 or i == len(raw)-1 or original[i-1] is None or original[i+1] is None:
                raise ValueError('unsupported gap; human review required')
            value = (original[i-1] + original[i+1]) / 2
            estimated += value
        if value < 0:
            raise ValueError('negative energy outside this channel policy')
        result.append(value)
    total = sum(result)
    if total > 0 and estimated / total > maximum_estimated_share:
        raise ValueError('estimated energy share exceeds publication policy')
    return result, estimated, sum(result[:2]) * D('.50') + sum(result[2:]) + D('2.00')


class AssetAndMeterTests(unittest.TestCase):
    def test_v10_window_duplicate_and_out_of_order(self):
        rows = [(0, 1, '4.0'), (1, 1, '7.2'), (2, 1, '7.4'), (3, 1, '3.8'), (4, 1, '7.3')]
        self.assertTrue(alert_window(rows))
        self.assertTrue(alert_window(list(reversed(rows)) + [rows[2]]))
        self.assertFalse(alert_window(rows + [(2, 2, '4.0')]))

    def test_v10_missing_not_zero_or_healthy(self):
        self.assertIsNone(alert_window([(0, 1, 8), (10, 1, 8), (20, 1, 8)]))
        with self.assertRaises(ValueError):
            alert_window([(0, 1, 8), (0, 1, 3)])

    def test_v10_resource_capacity(self):
        duration = {'A': 10, 'B': 30, 'C': 20, 'D': 15}
        dependencies = {'B': ['A'], 'C': ['A'], 'D': ['B', 'C']}
        self.assertEqual(critical_finish(duration, dependencies)['D'], 55)
        self.assertEqual(critical_finish(duration, dict(dependencies, C=['A', 'B']))['D'], 75)

    def test_v10_shared_permit_cannot_release_early(self):
        dependent_work = {'W1': 'complete', 'W2': 'in_progress'}
        self.assertFalse(all(x == 'complete' for x in dependent_work.values()))
        dependent_work['W2'] = 'complete'
        # All completed is a necessary condition; explicit field-authority confirmation remains required.
        authorized_confirmation = False
        self.assertFalse(all(x == 'complete' for x in dependent_work.values()) and authorized_confirmation)

    def test_v11_vee_bill_and_quality_denominator(self):
        values, estimated, bill = vee_bill([2, 3, None, 5])
        self.assertEqual(values, list(map(D, [2, 3, 4, 5])))
        self.assertEqual(estimated, D(4))
        self.assertEqual(sum(values), D(14))
        self.assertEqual(bill, D('13.50'))
        self.assertEqual(bill - D(10), D('3.50'))
        with self.assertRaises(ValueError):
            vee_bill([2, 3, None, 5], maximum_estimated_share=D('.25'))
        # 1/4 estimated intervals would incorrectly pass a 25% energy-share limit.
        self.assertLessEqual(D(1) / 4, D('.25'))

    def test_v11_unsupported_gap_and_negative_rejected(self):
        with self.assertRaises(ValueError):
            vee_bill([2, None, None, 5])
        with self.assertRaises(ValueError):
            vee_bill([None, 3, 4, 5])
        with self.assertRaises(ValueError):
            vee_bill([2, 3, -1, 5])

    def test_v11_late_actual_adjusts_not_overwrites_payment(self):
        _, _, old = vee_bill([2, 3, None, 5])
        _, _, corrected = vee_bill([2, 3, 6, 5])
        paid = D('13.50')
        adjustment = corrected - old
        self.assertEqual((old, corrected, adjustment), (D('13.50'), D('15.50'), D('2.00')))
        self.assertEqual(old + adjustment - paid, D('2.00'))
        self.assertEqual(paid, old)  # the previous settlement still exists

    def test_v11_average_tariff_and_meter_change(self):
        self.assertEqual(D(14) * D('.75') + 2, D('12.50'))
        _, estimated, unchanged_amount = vee_bill([2, 3, D(2)*2, D('2.5')*2])
        self.assertEqual((unchanged_amount, estimated), (D('13.50'), D(0)))
        self.assertEqual(vee_bill([2, 3, 2, D('2.5')])[2], D('9.00'))


class SupplyAndTelecomTests(unittest.TestCase):
    def test_v21_exhaustive_small_plan(self):
        self.assertEqual(supply_candidates(), [(254, (2, 1, 1)), (270, (1, 2, 2))])

    def test_v21_changed_capacity_can_make_plan_infeasible(self):
        self.assertEqual(supply_candidates(9), [])  # cannot split B or C across days

    def test_v21_error_declaration_preserves_original_fields(self):
        original = {'eventID': 'E1', 'eventTime': 1, 'quantity': 10, 'recordTime': 2}
        declaration = dict(original, recordTime=3, errorDeclaration={'declarationTime': 3, 'correctiveEventIDs': ['E2']})
        ignored = {'recordTime', 'errorDeclaration'}
        base = lambda e: {k: v for k, v in e.items() if k not in ignored}
        self.assertEqual(base(declaration), base(original))
        stored = {(e['eventID'], 'errorDeclaration' in e): e for e in [original, original, declaration]}
        self.assertEqual(len(stored), 2)  # plain UNIQUE(eventID) would lose the declaration
        invalid = dict(declaration, quantity=9)
        self.assertNotEqual(base(invalid), base(original))
        # The corrected quantity belongs to a separate E2, not to mutation of E1.

    def test_v21_model_penalty_not_payable_freight(self):
        contract, invoice, authorized_extra = 200, 250, 0
        payable = min(invoice, contract + authorized_extra)
        self.assertEqual((payable, invoice - payable), (200, 50))
        self.assertNotEqual(payable, contract - 54)

    def test_v22_proration_and_event_time(self):
        days = half_open_overlap(0, 30, 5, 20)
        self.assertEqual(days, 15)
        rows = [('t1', 's1', 'u1', 6, 6, '4'), ('t1', 's1', 'u2', 18, 22, '8')]
        usage = usage_charge(rows, (5, 20), 10, 200)
        self.assertEqual(usage, D(400))
        self.assertEqual(D(3000) * days / 30 + usage, D(1900))

    def test_v22_duplicate_boundary_and_conflicting_payload(self):
        rows = [('t1', 's1', 'u1', 6, 6, '4'), ('t1', 's1', 'u2', 18, 22, '8')]
        self.assertEqual(usage_charge(rows + rows + [('t1', 's1', 'u3', 20, 20, '100')], (5, 20), 10, 200), D(400))
        with self.assertRaises(ValueError):
            usage_charge(rows + [('t1', 's1', 'u1', 6, 25, '99')], (5, 20), 10, 200)

    def test_v22_technical_delay_does_not_extend_billable_window(self):
        rows = [('t1', 's1', 'u1', 6, 6, '4'), ('t1', 's1', 'u2', 18, 22, '8'),
                ('t1', 's1', 'after-stop', 21, 22, '3')]
        self.assertEqual(usage_charge(rows, (5, 20), 10, 200), D(400))
        # Counterexample: charging until technical retirement at day25 overcharges by 600.
        self.assertEqual(usage_charge(rows, (5, 25), 10, 200), D(1000))
        with self.assertRaises(ValueError):
            usage_charge(rows + [('t2', 's1', 'u1', 6, 6, '99')], (5, 20), 10, 200)

    def test_v22_empty_reversed_and_adjacent_intervals(self):
        self.assertEqual(half_open_overlap(0, 5, 5, 20), 0)
        with self.assertRaises(ValueError):
            half_open_overlap(0, 0, 5, 20)


class DurableEffectTests(unittest.TestCase):
    """SQLite only: show atomicity, compare-and-swap and business uniqueness.

    This is not a concurrency stress test or a claim about remote side effects.
    A simulated process-stop raises before COMMIT, then replay uses the same key.
    """
    def setUp(self):
        self.db = sqlite3.connect(':memory:')
        self.db.executescript('''
          CREATE TABLE commands(tenant TEXT, operation TEXT, payload TEXT,
                                PRIMARY KEY(tenant, operation));
          CREATE TABLE releases(tenant TEXT, business_key TEXT, manifest TEXT,
                                PRIMARY KEY(tenant, business_key));
          CREATE TABLE candidates(tenant TEXT PRIMARY KEY, version INTEGER);
          INSERT INTO candidates VALUES ('a', 1);
        ''')

    def tearDown(self):
        self.db.close()

    def apply(self, tenant, operation, key, payload, crash=False):
        with self.db:
            old = self.db.execute('SELECT payload FROM commands WHERE tenant=? AND operation=?', (tenant, operation)).fetchone()
            if old:
                if old[0] != payload:
                    raise ValueError('operation reused with changed payload')
                return
            self.db.execute('INSERT INTO commands VALUES(?,?,?)', (tenant, operation, payload))
            self.db.execute('INSERT OR IGNORE INTO releases VALUES(?,?,?)', (tenant, key, payload))
            actual = self.db.execute('SELECT manifest FROM releases WHERE tenant=? AND business_key=?', (tenant, key)).fetchone()[0]
            if actual != payload:
                raise ValueError('business key already bound to another manifest')
            if crash:
                raise RuntimeError('synthetic failure before commit')

    def test_replay_and_second_event_one_business_effect(self):
        self.apply('a', 'op1', 'M1', 'hash1')
        self.apply('a', 'op1', 'M1', 'hash1')
        self.apply('a', 'op2', 'M1', 'hash1')
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM releases').fetchone()[0], 1)
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM commands').fetchone()[0], 2)

    def test_before_commit_failure_then_recovery(self):
        with self.assertRaises(RuntimeError):
            self.apply('a', 'op1', 'M1', 'hash1', crash=True)
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM commands').fetchone()[0], 0)
        self.apply('a', 'op1', 'M1', 'hash1')
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM releases').fetchone()[0], 1)

    def test_payload_conflict_preserves_original(self):
        self.apply('a', 'op1', 'M1', 'hash1')
        with self.assertRaises(ValueError):
            self.apply('a', 'op1', 'M1', 'hash2')
        with self.assertRaises(ValueError):
            self.apply('a', 'op2', 'M1', 'hash2')
        self.assertEqual(self.db.execute('SELECT manifest FROM releases').fetchone()[0], 'hash1')

    def test_tenant_key_isolation_only(self):
        # Keys are tested; authentication and object-store authorization are NOT implemented.
        self.apply('a', 'op1', 'M1', 'hash1')
        self.apply('b', 'op1', 'M1', 'hash2')
        self.assertEqual(self.db.execute('SELECT manifest FROM releases WHERE tenant=?', ('a',)).fetchall(), [('hash1',)])
        self.assertEqual(self.db.execute('SELECT manifest FROM releases WHERE tenant=?', ('b',)).fetchall(), [('hash2',)])

    def test_stale_expected_version_rejected(self):
        first = self.db.execute('UPDATE candidates SET version=2 WHERE tenant=? AND version=1', ('a',)).rowcount
        stale = self.db.execute('UPDATE candidates SET version=3 WHERE tenant=? AND version=1', ('a',)).rowcount
        self.assertEqual((first, stale), (1, 0))


if __name__ == '__main__':
    unittest.main(verbosity=2)
