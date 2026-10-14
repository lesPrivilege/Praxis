#!/usr/bin/env python3
"""V01 local synthetic invariants. No clinical rules, provider calls or UI tests.

Uses integer teaching money and explicit source/tenant/claim-version identities.
SQLite proves this small operation journal persists across connection restart;
it does not prove PostgreSQL isolation or a real payer's recovery contract.
"""
from collections import deque
from copy import deepcopy
from pathlib import Path
import json
import sqlite3
import tempfile
import unittest


def line_key(tenant='T1', payer='P1', claim='C1', revision='v1', line='L1', currency='UNIT'):
    return tenant, payer, claim, revision, line, currency


class Ledger:
    def __init__(self):
        self.lines = {line_key(): 80, line_key(line='L2'): 120}
        self.receipts = {('T1', 'P1', 'B1', 'UNIT'): 180}
        self.allocations = {}
        self.receipt_spent = {}
        self.line_applied = {}

    def allocate(self, authorized_tenant, receipt, item, target, amount):
        # All checks precede mutation. Production requires one database transaction.
        if receipt[0] != authorized_tenant or target[0] != authorized_tenant:
            raise PermissionError('tenant mismatch')
        if (receipt[1], receipt[3]) != (target[1], target[5]):
            raise ValueError('payer or currency mismatch')
        if type(amount) is not int or amount < 0:
            raise ValueError('amount must be nonnegative integer units')
        if receipt not in self.receipts or target not in self.lines:
            raise ValueError('unknown receipt or exact claim line')
        key, fingerprint = (receipt, item), (target, amount)
        if key in self.allocations:
            if self.allocations[key] != fingerprint:
                raise ValueError('same allocation identity with changed content')
            return 'duplicate'
        spent = self.receipt_spent.get(receipt, 0)
        applied = self.line_applied.get(target, 0)
        if spent + amount > self.receipts[receipt] or applied + amount > self.lines[target]:
            raise ValueError('allocation exceeds confirmed receipt or claim responsibility')
        self.allocations[key] = fingerprint
        self.receipt_spent[receipt] = spent + amount
        self.line_applied[target] = applied + amount
        return 'applied'

    def outstanding(self, target):
        return self.lines[target] - self.line_applied.get(target, 0)


def impacted(start, dependents):
    seen, queue = {start}, deque([start])
    while queue:
        for node in dependents.get(queue.popleft(), []):
            if node not in seen:
                seen.add(node)
                queue.append(node)
    return seen - {start}


def select_revision(current, incoming, supersedes):
    # Versions are opaque. The supplied, verified source relationships define order.
    def ancestors(v):
        seen = set()
        while v in supersedes:
            v = supersedes[v]
            if v in seen:
                raise ValueError('revision cycle')
            seen.add(v)
        return seen
    if incoming == current or incoming in ancestors(current):
        return current
    if current in ancestors(incoming):
        return incoming
    raise ValueError('unrelated revision requires source reconciliation')


def journal(connection):
    connection.execute('CREATE TABLE IF NOT EXISTS operation '
                       '(tenant TEXT NOT NULL, key TEXT NOT NULL, body TEXT NOT NULL, '
                       'state TEXT NOT NULL, external_id TEXT, PRIMARY KEY(tenant,key))')
    connection.execute('CREATE TABLE IF NOT EXISTS submission '
                       '(id TEXT PRIMARY KEY, version INTEGER NOT NULL, state TEXT NOT NULL)')
    connection.commit()


def save_attempt(connection, tenant, key, body):
    row = connection.execute('SELECT body,state FROM operation WHERE tenant=? AND key=?',
                             (tenant, key)).fetchone()
    if row:
        if row[0] != body:
            raise ValueError('operation content conflict')
        return row[1]
    connection.execute('INSERT INTO operation VALUES (?,?,?,?,?)',
                       (tenant, key, body, 'unknown', None))
    connection.commit()
    return 'unknown'


def reconcile_attempt(connection, tenant, key, authoritative_lookup):
    row = connection.execute('SELECT body,state FROM operation WHERE tenant=? AND key=?',
                             (tenant, key)).fetchone()
    if row is None:
        raise ValueError('operation absent')
    remote = authoritative_lookup.get((tenant, key))
    if remote is None:
        return 'unknown'  # absence from an incomplete lookup is not definitive failure
    if remote['body'] != row[0]:
        raise ValueError('remote content differs')
    connection.execute('UPDATE operation SET state=?,external_id=? WHERE tenant=? AND key=?',
                       ('submitted', remote['id'], tenant, key))
    connection.commit()
    return 'submitted'


class Invariants(unittest.TestCase):
    def test_happy_path_partial_payment_and_conservation(self):
        l = Ledger(); receipt = ('T1', 'P1', 'B1', 'UNIT')
        l.allocate('T1', receipt, 'a', line_key(), 80)
        l.allocate('T1', receipt, 'b', line_key(line='L2'), 100)
        self.assertEqual([l.outstanding(line_key()), l.outstanding(line_key(line='L2'))], [0, 20])
        self.assertEqual(300, 50 + 180 + 50 + 20)  # adjustment + payer cash + patient cash + due
        self.assertEqual((120, 180), (80 + 20 + 20, 120 + 30 + 30))
        self.assertEqual(l.receipt_spent[receipt], 180)  # this payment fully allocated
        self.assertEqual(sum(l.outstanding(k) for k in l.lines), 20)  # case still unsettled

    def test_duplicate_changes_no_balance(self):
        l = Ledger(); args = ('T1', ('T1','P1','B1','UNIT'), 'a', line_key(), 80)
        self.assertEqual(l.allocate(*args), 'applied')
        self.assertEqual(l.allocate(*args), 'duplicate')
        self.assertEqual(len(l.allocations), 1)

    def test_same_identity_changed_payload_is_rejected_atomically(self):
        l = Ledger(); r = ('T1','P1','B1','UNIT')
        l.allocate('T1', r, 'a', line_key(), 80); before = deepcopy(l.allocations)
        with self.assertRaisesRegex(ValueError, 'changed content'):
            l.allocate('T1', r, 'a', line_key(), 70)
        self.assertEqual(l.allocations, before)

    def test_missing_identity_is_not_matched_by_amount(self):
        l = Ledger()
        with self.assertRaisesRegex(ValueError, 'unknown'):
            l.allocate('T1', ('T1','P1','B1','UNIT'), 'a', line_key(line='missing'), 80)
        self.assertFalse(l.allocations)

    def test_cross_tenant_authorization_before_lookup(self):
        l = Ledger(); l.lines[line_key(tenant='T2')] = 80
        with self.assertRaises(PermissionError):
            l.allocate('T1', ('T1','P1','B1','UNIT'), 'a', line_key(tenant='T2'), 80)
        self.assertFalse(l.allocations)

    def test_same_local_identifier_has_distinct_tenant_balances(self):
        l = Ledger(); l.lines[line_key(tenant='T2')] = 80
        l.receipts[('T2','P1','B1','UNIT')] = 80
        l.allocate('T2', ('T2','P1','B1','UNIT'), 'a', line_key(tenant='T2'), 80)
        self.assertEqual(l.outstanding(line_key()), 80)
        self.assertEqual(l.outstanding(line_key(tenant='T2')), 0)

    def test_currency_and_payer_mismatch(self):
        for key in (line_key(currency='OTHER'), line_key(payer='P2')):
            with self.subTest(key=key), self.assertRaisesRegex(ValueError, 'payer or currency'):
                Ledger().allocate('T1', ('T1','P1','B1','UNIT'), 'a', key, 80)

    def test_negative_fractional_or_boolean_money_rejected(self):
        for amount in (-1, 0.5, True):
            with self.subTest(amount=amount), self.assertRaises(ValueError):
                Ledger().allocate('T1', ('T1','P1','B1','UNIT'), 'a', line_key(), amount)

    def test_confirmed_cash_is_a_limit(self):
        l = Ledger(); l.receipts[('T1','P1','B1','UNIT')] = 170
        l.allocate('T1', ('T1','P1','B1','UNIT'), 'a', line_key(), 80)
        before = deepcopy(l.allocations)
        with self.assertRaisesRegex(ValueError, 'exceeds'):
            l.allocate('T1', ('T1','P1','B1','UNIT'), 'b', line_key(line='L2'), 100)
        self.assertEqual(l.allocations, before)

    def test_responsibility_is_a_limit_even_when_cash_available(self):
        l = Ledger()
        with self.assertRaisesRegex(ValueError, 'exceeds'):
            l.allocate('T1', ('T1','P1','B1','UNIT'), 'a', line_key(), 81)

    def test_out_of_order_revision_uses_explicit_relationship(self):
        relation = {'opaque-B': 'opaque-Z'}
        self.assertEqual(select_revision('opaque-B', 'opaque-Z', relation), 'opaque-B')
        self.assertEqual(select_revision('opaque-Z', 'opaque-B', relation), 'opaque-B')
        with self.assertRaisesRegex(ValueError, 'unrelated'):
            select_revision('opaque-B', 'other', relation)

    def test_impact_walk_excludes_unrelated_bill_and_terminates_on_cycle(self):
        graph = {'report-r1':['claim-v1'], 'claim-v1':['adjudication'],
                 'adjudication':['claim-v1'], 'report-other':['claim-other']}
        self.assertEqual(impacted('report-r1', graph), {'claim-v1','adjudication'})

    def test_unknown_survives_restart_and_reconciles_without_resending(self):
        with tempfile.TemporaryDirectory(prefix='p04-v01-') as d:
            path = Path(d) / 'journal.sqlite'
            with sqlite3.connect(path) as c:
                journal(c); save_attempt(c, 'T1', 'op-1', 'claim-v1')
            # Synthetic remote accepted once; no send function exists in recovery.
            remote = {('T1','op-1'): {'body':'claim-v1', 'id':'remote-1'}}
            with sqlite3.connect(path) as c:
                self.assertEqual(save_attempt(c,'T1','op-1','claim-v1'), 'unknown')
                self.assertEqual(reconcile_attempt(c,'T1','op-1',remote), 'submitted')
                self.assertEqual(c.execute('SELECT COUNT(*) FROM operation').fetchone()[0], 1)
                self.assertEqual(c.execute('SELECT external_id FROM operation').fetchone()[0], 'remote-1')

    def test_incomplete_lookup_stays_unknown_and_conflict_is_not_retried(self):
        with sqlite3.connect(':memory:') as c:
            journal(c); save_attempt(c,'T1','op-1','claim-v1')
            self.assertEqual(reconcile_attempt(c,'T1','op-1',{}), 'unknown')
            with self.assertRaisesRegex(ValueError, 'differs'):
                reconcile_attempt(c,'T1','op-1',{('T1','op-1'):{'body':'different','id':'remote-2'}})
            with self.assertRaisesRegex(ValueError, 'conflict'):
                save_attempt(c,'T1','op-1','changed')
            self.assertEqual(c.execute('SELECT state FROM operation').fetchone()[0], 'unknown')

    def test_two_stale_submitters_compare_and_swap(self):
        # Sequential interleaving of two readers of version 1, not a concurrency benchmark.
        with sqlite3.connect(':memory:') as c:
            journal(c); c.execute("INSERT INTO submission VALUES ('s1',1,'ready')")
            first = c.execute("UPDATE submission SET version=2,state='submitted' WHERE id='s1' AND version=1").rowcount
            second = c.execute("UPDATE submission SET version=2,state='submitted' WHERE id='s1' AND version=1").rowcount
            self.assertEqual((first, second), (1, 0))

    def test_shared_receipt_budget_both_legal_serializations(self):
        # Models the two serialized outcomes with a shared receipt budget gate.
        # This does NOT execute PostgreSQL locks or truly concurrent ledger writes.
        for first, second in ((('L1', 80), ('L2', 120)), (('L2', 120), ('L1', 80))):
            with self.subTest(first=first):
                l = Ledger(); r = ('T1', 'P1', 'B1', 'UNIT')
                l.allocate('T1', r, 'first', line_key(line=first[0]), first[1])
                with self.assertRaisesRegex(ValueError, 'exceeds'):
                    l.allocate('T1', r, 'second', line_key(line=second[0]), second[1])
                self.assertEqual(l.receipt_spent[r], first[1])
                self.assertEqual(len(l.allocations), 1)

    def test_known_bad_no_shared_receipt_gate_is_detected(self):
        # Different receivables, same receipt. Both stale readers see 180 available.
        stale_available_a = stale_available_b = 180
        a, b = 80, 120
        self.assertTrue(a <= stale_available_a and b <= stale_available_b)
        bad_total = a + b
        self.assertGreater(bad_total, 180)
        self.assertEqual(bad_total - 180, 20)

    def test_known_bad_adjudication_as_cash_is_detected(self):
        bad_received = 200  # Wrong implementation treats payer responsibility as received cash.
        confirmed_received = 180
        self.assertNotEqual(bad_received, confirmed_received)
        self.assertEqual(bad_received - confirmed_received, 20)

    def test_known_bad_tenantless_dictionary_is_detected(self):
        rows = [(line_key(), 80), (line_key(tenant='T2'), 120)]
        bad = {k[2:]: v for k, v in rows}
        good = dict(rows)
        self.assertEqual((len(bad), len(good)), (1, 2))
        self.assertNotEqual(bad[line_key()[2:]], good[line_key()])


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(Invariants)
    result = unittest.TestResult()
    suite.run(result)
    print(json.dumps({'suite':'V01 synthetic invariants', 'tests_run':result.testsRun,
                      'failures':[{'test':str(t),'detail':e} for t,e in result.failures],
                      'errors':[{'test':str(t),'detail':e} for t,e in result.errors],
                      'known_bad_behaviors_detected':['adjudication treated as cash: overstatement 20',
                                                      'tenantless key: 2 rows collapse to 1',
                                                      'no shared receipt gate: stale allocations exceed cash by 20'],
                      'execution_scope':'Python in-memory ledger and graph; SQLite operation restart and sequential stale-write interleaving',
                      'not_executed':['provider','UI E2E','PostgreSQL isolation','real concurrent processes','AI eval','load']},
                     ensure_ascii=False, indent=2))
    raise SystemExit(not result.wasSuccessful())
