#!/usr/bin/env python3
"""Local synthetic invariant checks for H04/H05; no live API, UI, load or AI eval.

Run from any directory: python3 /path/to/checks-h04-h05.py
Fixtures contain only fictional IDs and integer day/minute/money units.
A separate external stub models outcome loss; SQLite models durable local effects.
These checks deliberately expose bad calculations, then verify rejecting guards.
"""
import json
import sqlite3
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory


def accrual(employment, period, rates):
    """Integer minor-unit daily rates; reject overlap and gaps in active pay range."""
    lo, hi = max(employment[0], period[0]), min(employment[1], period[1])
    if employment[1] < employment[0] or period[1] < period[0]:
        raise ValueError('invalid interval')
    if hi <= lo:
        return 0
    ordered = sorted(rates)
    prior_end = None
    for start, end, cents in ordered:
        if end <= start or cents < 0 or (prior_end is not None and start < prior_end):
            raise ValueError('invalid or overlapping rate intervals')
        prior_end = end
    total, covered = 0, 0
    for start, end, cents in ordered:
        days = max(0, min(hi, end) - max(lo, start))
        covered += days
        total += days * cents
    if covered != hi - lo:
        raise ValueError('missing effective rate')
    return total


def elapsed(start, end, pauses):
    if end < start:
        raise ValueError('end before start')
    segments = sorted((max(a, start), min(b, end)) for a, b in pauses
                      if min(b, end) > max(a, start))
    merged = []
    for a, b in segments:
        if merged and a <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], b))
        else:
            merged.append((a, b))
    return end - start - sum(b-a for a, b in merged), merged


def consumers(target, edges):
    """Input edges: consumer -> dependency. Output excludes target even in cycles."""
    reverse = {}
    for user, dependency in edges:
        reverse.setdefault(dependency, set()).add(user)
    seen, todo = {target}, [target]
    while todo:
        item = todo.pop()
        for user in reverse.get(item, ()):
            if user not in seen:
                seen.add(user)
                todo.append(user)
    return seen - {target}


def can_close_incident(state, required_paths, observations, accepted):
    return (state == 'restored' and accepted and bool(required_paths)
            and all(observations.get(path) is True for path in required_paths))


def can_close_offboarding(required_apps, observed, handed_over, payroll_explained):
    return (all(observed.get(app) == 'revoked' for app in required_apps)
            and handed_over and payroll_explained)


class ExternalStub:
    def __init__(self):
        self.effects = {}
        self.accepted_count = 0

    def accept(self, tenant, operation, payload):
        # No automatic deduplication in this fake: a second call is a test failure.
        key = (tenant, operation)
        if key in self.effects:
            raise AssertionError('unsafe repeated external accept')
        self.accepted_count += 1
        self.effects[key] = payload
        return payload

    def read(self, tenant, operation):
        return self.effects.get((tenant, operation))


class AccessTarget(ExternalStub):
    """Synthetic target with revision-aware writes; not a SCIM guarantee."""
    def __init__(self):
        super().__init__()
        self.active = None
        self.revision = 0

    def accept(self, tenant, operation, payload):
        command = json.loads(payload)
        if command['revision'] < self.revision:
            raise ValueError('stale target revision')
        result = super().accept(tenant, operation, payload)
        self.active, self.revision = command['active'], command['revision']
        return result


def dispatch_access(current, task, ledger, external, lose_reply=False):
    payload = {'revision': task['revision'], 'active': task['active']}
    known = ledger.status(task['tenant'], task['operation'])
    if known is not None:
        # Validate the same operation's parameters before returning its state.
        # Ledger.submit preserves unknown and does not send another effect.
        return ledger.submit(task['tenant'], task['operation'], payload,
                             external, lose_reply=lose_reply)
    if (task['revision'], task['active']) != (current['revision'], current['active']):
        return 'stale_task'
    return ledger.submit(task['tenant'], task['operation'], payload,
                         external, lose_reply=lose_reply)


class Ledger:
    def __init__(self, path):
        self.db = sqlite3.connect(path)
        self.db.execute('CREATE TABLE IF NOT EXISTS operations(tenant TEXT, op TEXT, payload TEXT, state TEXT, PRIMARY KEY(tenant, op))')
        self.db.execute('CREATE TABLE IF NOT EXISTS effects(tenant TEXT, op TEXT, payload TEXT, PRIMARY KEY(tenant, op))')
        self.db.execute('CREATE TABLE IF NOT EXISTS employment(tenant TEXT, id TEXT, revision INT, state TEXT, PRIMARY KEY(tenant, id))')
        self.db.commit()

    def close(self):
        self.db.close()

    def submit(self, tenant, op, payload, external, lose_reply=False):
        wire = json.dumps(payload, sort_keys=True)
        row = self.db.execute('SELECT payload,state FROM operations WHERE tenant=? AND op=?', (tenant, op)).fetchone()
        if row:
            if row[0] != wire:
                raise ValueError('operation identity reused with changed payload')
            return row[1]  # unknown is not permission to create another side effect.
        with self.db:
            self.db.execute('INSERT INTO operations VALUES(?,?,?,?)', (tenant, op, wire, 'unknown'))
        external.accept(tenant, op, wire)
        if not lose_reply:
            self.reconcile(tenant, op, external)
        return self.status(tenant, op)

    def reconcile(self, tenant, op, external, crash_after_effect=False):
        row = self.db.execute('SELECT payload FROM operations WHERE tenant=? AND op=?', (tenant, op)).fetchone()
        if not row:
            raise LookupError('no local intent')
        result = external.read(tenant, op)
        if result is None:
            return 'unknown'
        if result != row[0]:
            raise ValueError('external result does not match intent')
        with self.db:
            self.db.execute('INSERT OR IGNORE INTO effects VALUES(?,?,?)', (tenant, op, result))
        if crash_after_effect:
            raise RuntimeError('injected crash after effect before completion marker')
        with self.db:
            self.db.execute('UPDATE operations SET state=? WHERE tenant=? AND op=?', ('confirmed', tenant, op))
        return 'confirmed'

    def status(self, tenant, op):
        row = self.db.execute('SELECT state FROM operations WHERE tenant=? AND op=?', (tenant, op)).fetchone()
        return row[0] if row else None

    def advance(self, tenant, identifier, expected, revision, state):
        if revision <= expected:
            raise ValueError('revision must advance')
        with self.db:
            cur = self.db.execute('UPDATE employment SET revision=?,state=? WHERE tenant=? AND id=? AND revision=?', (revision,state,tenant,identifier,expected))
        return cur.rowcount == 1


class H04Checks(unittest.TestCase):
    rates = [(1, 16, 30000), (16, 31, 40000)]

    def test_interval_accrual_and_retro_correction(self):
        self.assertEqual(accrual((6,26),(1,31),self.rates), 700000)
        corrected = accrual((6,24),(1,31),self.rates)
        self.assertEqual(corrected, 620000)
        self.assertEqual(corrected-700000, -80000)
        self.assertEqual(accrual((8,26),(1,31),self.rates), 640000)

    def test_empty_employment_and_exact_boundary(self):
        self.assertEqual(accrual((31,40),(1,31),self.rates),0)
        self.assertEqual(accrual((16,17),(1,31),self.rates),40000)

    def test_overlap_gap_and_invalid_interval_are_rejected(self):
        with self.assertRaisesRegex(ValueError,'overlapping'):
            accrual((6,26),(1,31),[(1,18,30000),(16,31,40000)])
        with self.assertRaisesRegex(ValueError,'missing'):
            accrual((6,26),(1,31),[(1,15,30000),(16,31,40000)])
        with self.assertRaisesRegex(ValueError,'invalid interval'):
            accrual((26,6),(1,31),self.rates)

    def test_inclusive_end_mutant_has_counterexample(self):
        wrong = (16-6+1)*30000 + (26-16+1)*40000
        self.assertEqual(wrong,770000)
        self.assertNotEqual(wrong,accrual((6,26),(1,31),self.rates))

    def test_partial_offboarding_is_not_complete(self):
        args=(['A','B'], {'A':'revoked','B':'unknown'}, True, True)
        self.assertFalse(can_close_offboarding(*args))
        self.assertTrue(can_close_offboarding(['A','B'],{'A':'revoked','B':'revoked'},True,True))
        self.assertFalse(can_close_offboarding(['A'],{'A':'revoked'},False,True))

    def test_desired_state_after_rehire(self):
        # Model the source of desired state, not a claim of atomic SCIM operations.
        spells = {'E1': {'start':6,'end':26,'approved':True},
                  'E2': {'start':30,'end':50,'approved':True}}
        def desired(day):
            return any(s['approved'] and s['start'] <= day < s['end'] for s in spells.values())
        self.assertFalse(desired(27))
        self.assertTrue(desired(32))
        historical_e1_revoke = False
        self.assertNotEqual(historical_e1_revoke,desired(32))

    def test_revision_aware_delivery_in_both_orders(self):
        old = dict(tenant='T', operation='E1-revoke', revision=1, active=False)
        new = dict(tenant='T', operation='E2-enable', revision=2, active=True)
        current = dict(revision=2, active=True)
        for tasks in ((new, old), (old, new)):
            ledger, target = Ledger(':memory:'), AccessTarget()
            try:
                outcomes = [dispatch_access(current, task, ledger, target) for task in tasks]
                self.assertCountEqual(outcomes, ['confirmed', 'stale_task'])
                self.assertTrue(target.active)
                self.assertEqual(target.accepted_count, 1)
            finally:
                ledger.close()
        naive_active = None
        for task in (new, old):
            naive_active = task['active']
        self.assertFalse(naive_active)  # The same schedule defeats blind replay.

    def test_access_unknown_requires_original_operation_reconciliation(self):
        task = dict(tenant='T', operation='E2-enable', revision=2, active=True)
        current = dict(revision=2, active=True)
        ledger, target = Ledger(':memory:'), AccessTarget()
        try:
            self.assertEqual(dispatch_access(current, task, ledger, target, lose_reply=True), 'unknown')
            self.assertEqual(dispatch_access(current, task, ledger, target), 'unknown')
            self.assertEqual(target.accepted_count, 1)
            with self.assertRaisesRegex(ValueError, 'changed payload'):
                dispatch_access(current, dict(task, active=False), ledger, target)
            self.assertEqual(ledger.status('T', 'E2-enable'), 'unknown')
            self.assertEqual(target.accepted_count, 1)
            self.assertEqual(ledger.reconcile('T', 'E2-enable', target), 'confirmed')
            self.assertTrue(target.active)
        finally:
            ledger.close()


class H05Checks(unittest.TestCase):
    def test_pause_union_exposes_false_sla_pass(self):
        good, merged = elapsed(0,70,[(20,35),(30,40)])
        bad = 70-sum(b-a for a,b in [(20,35),(30,40)])
        self.assertEqual((good,merged),(50,[(20,40)]))
        self.assertEqual(bad,45)
        self.assertTrue(bad <= 45)
        self.assertFalse(good <= 45)

    def test_pause_clipping_order_and_duplicate_invariance(self):
        original=[(20,35),(30,40),(60,80)]
        self.assertEqual(elapsed(0,70,original),(40,[(20,40),(60,70)]))
        self.assertEqual(elapsed(0,70,list(reversed(original))+original),elapsed(0,70,original))
        self.assertEqual(elapsed(0,70,[]),(70,[]))
        self.assertEqual(elapsed(0,70,[(-10,90)]),(0,[(0,70)]))

    def test_reverse_graph_and_cycle_termination(self):
        edges=[('Checkout','API'),('API','DB'),('Invoice','DB'),('Search','Index')]
        self.assertEqual(consumers('DB',edges),{'API','Checkout','Invoice'})
        self.assertEqual(consumers('DB',edges+[('DB','Checkout')]),{'API','Checkout','Invoice'})
        # A missing inventory edge is an explicit limitation, not fixed by BFS.
        self.assertNotIn('Invoice',consumers('DB',[e for e in edges if e != ('Invoice','DB')]))

    def test_partial_recovery_blocks_close_even_after_execution_success(self):
        required={'read-order','create-order'}
        observed={'read-order':True,'create-order':False}
        self.assertFalse(can_close_incident('restored',required,observed,True))
        observed['create-order']=True
        self.assertTrue(can_close_incident('restored',required,observed,True))
        self.assertFalse(can_close_incident('restored',required,observed,False))
        self.assertFalse(can_close_incident('investigating',required,observed,True))

    def test_plan_change_invalidates_authorization(self):
        def permitted(plan_hash,approved_hash,state,within_window):
            return plan_hash==approved_hash and state=='authorized' and within_window
        self.assertTrue(permitted('r17','r17','authorized',True))
        self.assertFalse(permitted('r16','r17','authorized',True))
        self.assertFalse(permitted('r17','r17','authorized',False))

    def test_old_attempt_result_cannot_erase_new_restoration_evidence(self):
        attempts={'C1':'running','C2':'succeeded'}
        restoration={'execution':'C2','paths_pass':True}
        attempts['C1']='failed'
        self.assertEqual(attempts[restoration['execution']],'succeeded')
        self.assertEqual(attempts['C1'],'failed')


class PersistenceChecks(unittest.TestCase):
    def setUp(self):
        self.temp=TemporaryDirectory(); self.path=str(Path(self.temp.name)/'ledger.sqlite')
        self.ledger=Ledger(self.path); self.external=ExternalStub()

    def tearDown(self):
        self.ledger.close(); self.temp.cleanup()

    def test_duplicate_identity_and_payload_conflict(self):
        self.assertEqual(self.ledger.submit('A','op1',{'amount':700000},self.external),'confirmed')
        self.assertEqual(self.ledger.submit('A','op1',{'amount':700000},self.external),'confirmed')
        self.assertEqual(self.external.accepted_count,1)
        with self.assertRaisesRegex(ValueError,'changed payload'):
            self.ledger.submit('A','op1',{'amount':620000},self.external)

    def test_unknown_outcome_is_reconciled_without_second_execution(self):
        self.assertEqual(self.ledger.submit('A','op2',{'plan':'r17'},self.external,lose_reply=True),'unknown')
        self.assertEqual(self.ledger.submit('A','op2',{'plan':'r17'},self.external),'unknown')
        self.assertEqual(self.external.accepted_count,1)
        self.assertEqual(self.ledger.reconcile('A','op2',self.external),'confirmed')
        self.assertEqual(self.external.accepted_count,1)

    def test_restart_after_effect_before_completion_marker(self):
        self.ledger.submit('A','op3',{'active':False},self.external,lose_reply=True)
        with self.assertRaisesRegex(RuntimeError,'injected crash'):
            self.ledger.reconcile('A','op3',self.external,crash_after_effect=True)
        self.ledger.close(); self.ledger=Ledger(self.path)
        self.assertEqual(self.ledger.status('A','op3'),'unknown')
        self.assertEqual(self.ledger.reconcile('A','op3',self.external),'confirmed')
        count=self.ledger.db.execute('SELECT count(*) FROM effects').fetchone()[0]
        self.assertEqual(count,1)
        self.assertEqual(self.external.accepted_count,1)

    def test_tenant_scope_in_same_local_id(self):
        self.ledger.submit('A','42',{'amount':700000},self.external)
        self.assertIsNone(self.ledger.status('B','42'))
        self.ledger.submit('B','42',{'amount':100000},self.external)
        self.assertNotEqual(self.external.read('A','42'),self.external.read('B','42'))
        self.assertEqual(self.external.accepted_count,2)

    def test_competing_writers_and_stale_revision(self):
        with self.ledger.db:
            self.ledger.db.execute('INSERT INTO employment VALUES(?,?,?,?)',('A','E1',7,'active'))
        other=Ledger(self.path)
        try:
            self.assertTrue(self.ledger.advance('A','E1',7,8,'ended'))
            self.assertFalse(other.advance('A','E1',7,8,'active'))
            self.assertFalse(other.advance('B','E1',8,9,'active'))
            self.assertEqual(other.db.execute('SELECT revision,state FROM employment WHERE tenant=? AND id=?',('A','E1')).fetchone(),(8,'ended'))
        finally:
            other.close()

    def test_external_mismatch_is_not_confirmation(self):
        self.ledger.submit('A','op4',{'plan':'r17'},self.external,lose_reply=True)
        self.external.effects[('A','op4')]='{"plan": "r16"}'
        with self.assertRaisesRegex(ValueError,'does not match'):
            self.ledger.reconcile('A','op4',self.external)
        self.assertEqual(self.ledger.status('A','op4'),'unknown')


if __name__=='__main__':
    suite=unittest.defaultTestLoader.loadTestsFromModule(__import__(__name__))
    result=unittest.TextTestRunner(verbosity=2).run(suite)
    print(json.dumps({
        'scope':'Synthetic pure calculations, guards and SQLite/stub local persistence only',
        'tests_run':result.testsRun,'failures':len(result.failures),'errors':len(result.errors),
        'counterexamples_observed':{
            'inclusive_payroll_end':'bad=7700, correct=7000 teaching yuan',
            'sum_overlapping_pauses':'bad=45 and false pass, correct=50 and breach by 5 minutes',
            'missing_graph_edge':'Invoice omitted when its dependency is absent',
            'old_revoke_after_rehire':'historical E1=false differs from current desired E2=true'
        },
        'not_executed':['provider APIs','browser/UI E2E','real concurrent network races','session/token revocation','load/latency measurements','AI eval']
    },ensure_ascii=False,indent=2))
    raise SystemExit(not result.wasSuccessful())
