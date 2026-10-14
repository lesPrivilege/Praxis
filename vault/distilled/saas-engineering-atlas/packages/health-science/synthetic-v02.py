#!/usr/bin/env python3
"""V02 synthetic invariants. Standard library + temporary SQLite, no provider/UI/E2E.

SQLite BEGIN IMMEDIATE serializes all database writers, a deliberately coarser
model than the PostgreSQL scope gate described in prose. Passing here proves
only the tested model and local transaction behavior, never a deployed system.
"""
import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest


class Rejected(Exception):
    pass


def encode(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


class Trial:
    def __init__(self, path):
        self.path = str(path)

    def connect(self):
        connection = sqlite3.connect(self.path, timeout=5)
        connection.row_factory = sqlite3.Row
        return connection

    def setup(self):
        with self.connect() as c:
            c.executescript('''
            CREATE TABLE scopes(scope TEXT PRIMARY KEY, locked INTEGER NOT NULL DEFAULT 0);
            CREATE TABLE forms(scope TEXT, form TEXT, revision INTEGER, definition INTEGER,
              value INTEGER, submitted INTEGER, PRIMARY KEY(scope,form));
            CREATE TABLE queries(scope TEXT, query TEXT, status TEXT, PRIMARY KEY(scope,query));
            CREATE TABLE signatures(scope TEXT, operation TEXT, manifest TEXT,
              PRIMARY KEY(scope,operation));
            CREATE TABLE operations(scope TEXT, operation TEXT, request TEXT, result TEXT,
              PRIMARY KEY(scope,operation));
            CREATE TABLE locks(scope TEXT, operation TEXT, manifest TEXT,
              PRIMARY KEY(scope,operation));
            CREATE TABLE audit(sequence INTEGER PRIMARY KEY, scope TEXT, operation TEXT, action TEXT);
            ''')

    def fixture(self, scope):
        with self.connect() as c:
            c.execute('INSERT INTO scopes(scope) VALUES (?)', (scope,))
            c.executemany('INSERT INTO forms VALUES (?,?,?,?,?,1)',
                          [(scope, 'A1', 3, 1, 12), (scope, 'A2', 8, 1, 29),
                           (scope, 'A3', 2, 1, 16)])
            c.execute('INSERT INTO queries VALUES (?, ?, ?)', (scope, 'Q4', 'closed'))

    @staticmethod
    def _manifest(c, scope):
        return [list(row) for row in c.execute(
            'SELECT form, revision, definition FROM forms WHERE scope=? ORDER BY form', (scope,))]

    def snapshot(self, scope):
        with self.connect() as c:
            return self._manifest(c, scope)

    def operation(self, scope, operation):
        with self.connect() as c:
            row = c.execute('SELECT result FROM operations WHERE scope=? AND operation=?',
                            (scope, operation)).fetchone()
            return json.loads(row[0]) if row else None

    def apply(self, scope, op, kind, payload, actor_scope, role):
        # scope represents tenant/study/site/subject together, not a bare subject number.
        if scope != actor_scope:
            raise Rejected('scope_forbidden')
        required_role = {'edit': 'CRC', 'query': 'DM', 'sign': 'PI',
                         'lock': 'DM', 'definition': 'DESIGNER', 'add': 'CRC'}[kind]
        if role != required_role:
            raise Rejected('role_forbidden')
        request = encode([kind, payload, actor_scope, role])
        c = self.connect()
        try:
            c.execute('BEGIN IMMEDIATE')
            old = c.execute('SELECT request,result FROM operations WHERE scope=? AND operation=?',
                            (scope, op)).fetchone()
            if old:
                if old['request'] != request:
                    raise Rejected('operation_payload_conflict')
                c.commit()
                return json.loads(old['result'])
            gate = c.execute('SELECT locked FROM scopes WHERE scope=?', (scope,)).fetchone()
            if not gate:
                raise Rejected('scope_missing')
            if gate['locked']:
                raise Rejected('locked')
            if kind == 'edit':
                n = c.execute('UPDATE forms SET value=?,revision=revision+1 '
                              'WHERE scope=? AND form=? AND revision=?',
                              (payload['value'], scope, payload['form'], payload['expected'])).rowcount
                if n != 1:
                    raise Rejected('revision_conflict')
            elif kind == 'query':
                c.execute('INSERT INTO queries VALUES (?,?,?) ON CONFLICT(scope,query) '
                          'DO UPDATE SET status=excluded.status',
                          (scope, payload['query'], payload['status']))
            elif kind == 'definition':
                c.execute('UPDATE forms SET definition=definition+1 WHERE scope=? AND form=?',
                          (scope, payload['form']))
            elif kind == 'add':
                c.execute('INSERT INTO forms VALUES (?,?,1,1,0,1)', (scope, payload['form']))
            else:
                current = self._manifest(c, scope)
                if not current or current != payload['expected_manifest']:
                    raise Rejected('manifest_conflict')
                incomplete = c.execute('SELECT count(*) FROM forms WHERE scope=? AND submitted=0',
                                       (scope,)).fetchone()[0]
                pending = c.execute("SELECT count(*) FROM queries WHERE scope=? AND status!='closed'",
                                    (scope,)).fetchone()[0]
                if incomplete or pending:
                    raise Rejected('closure_blocker')
                serialized = encode(current)
                if kind == 'sign':
                    c.execute('INSERT INTO signatures VALUES (?,?,?)', (scope, op, serialized))
                else:
                    signed = c.execute('SELECT 1 FROM signatures WHERE scope=? AND manifest=?',
                                       (scope, serialized)).fetchone()
                    if not signed:
                        raise Rejected('signature_stale_or_missing')
                    c.execute('INSERT INTO locks VALUES (?,?,?)', (scope, op, serialized))
                    c.execute('UPDATE scopes SET locked=1 WHERE scope=?', (scope,))
            result = {'operation': op, 'kind': kind, 'scope': scope,
                      'manifest_hash': hashlib.sha256(encode(self._manifest(c, scope)).encode()).hexdigest()}
            c.execute('INSERT INTO operations VALUES (?,?,?,?)', (scope, op, request, encode(result)))
            c.execute('INSERT INTO audit(scope,operation,action) VALUES (?,?,?)', (scope, op, kind))
            c.commit()
            return result
        except BaseException:
            c.rollback()
            raise
        finally:
            c.close()

    def signed_current(self, scope):
        with self.connect() as c:
            manifest = encode(self._manifest(c, scope))
            return bool(c.execute('SELECT 1 FROM signatures WHERE scope=? AND manifest=?',
                                  (scope, manifest)).fetchone())

    def assert_invariant(self, scope):
        with self.connect() as c:
            locked = c.execute('SELECT locked FROM scopes WHERE scope=?', (scope,)).fetchone()[0]
            if locked:
                current = encode(self._manifest(c, scope))
                assert c.execute('SELECT 1 FROM locks WHERE scope=? AND manifest=?', (scope, current)).fetchone()
                assert c.execute('SELECT 1 FROM signatures WHERE scope=? AND manifest=?', (scope, current)).fetchone()
                assert c.execute("SELECT count(*) FROM queries WHERE scope=? AND status!='closed'", (scope,)).fetchone()[0] == 0


class Invariants(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='v02-synthetic-')
        self.trial = Trial(Path(self.tmp.name) / 'trial.sqlite3')
        self.trial.setup()
        self.scope = 'tenant-A/study-1/site-A/subject-001'
        self.other = 'tenant-B/study-1/site-A/subject-001'
        self.trial.fixture(self.scope)
        self.trial.fixture(self.other)

    def tearDown(self):
        self.tmp.cleanup()

    def run_op(self, op, kind, payload, scope=None):
        scope = scope or self.scope
        role = {'edit': 'CRC', 'query': 'DM', 'sign': 'PI', 'lock': 'DM',
                'definition': 'DESIGNER', 'add': 'CRC'}[kind]
        return self.trial.apply(scope, op, kind, payload, scope, role)

    def sign(self, op='sign-1'):
        return self.run_op(op, 'sign', {'expected_manifest': self.trial.snapshot(self.scope)})

    def lock(self, op='lock-1', manifest=None):
        return self.run_op(op, 'lock', {'expected_manifest': manifest or self.trial.snapshot(self.scope)})

    def test_01_happy_lock_binds_exact_manifest(self):
        self.sign()
        self.lock()
        self.trial.assert_invariant(self.scope)
        with self.trial.connect() as c:
            self.assertEqual(c.execute('SELECT value FROM forms WHERE scope=? AND form=?',
                                      (self.scope, 'A2')).fetchone()[0], 29)

    def test_02_answered_query_is_not_closed(self):
        self.run_op('q-answer', 'query', {'query': 'Q4', 'status': 'answered'})
        with self.assertRaisesRegex(Rejected, 'closure_blocker'):
            self.sign()
        self.run_op('q-close', 'query', {'query': 'Q4', 'status': 'closed'})
        with self.assertRaisesRegex(Rejected, 'signature_stale_or_missing'):
            self.lock()

    def test_03_duplicate_and_mutated_replay(self):
        before = self.trial.snapshot(self.scope)
        first = self.run_op('same-op', 'sign', {'expected_manifest': before})
        self.assertEqual(first, self.run_op('same-op', 'sign', {'expected_manifest': before}))
        with self.assertRaisesRegex(Rejected, 'operation_payload_conflict'):
            self.run_op('same-op', 'sign', {'expected_manifest': []})
        with self.trial.connect() as c:
            self.assertEqual(c.execute('SELECT count(*) FROM signatures WHERE scope=?', (self.scope,)).fetchone()[0], 1)

    def test_04_edit_invalidates_and_value_reversion_does_not_revive(self):
        self.sign()
        self.run_op('edit-1', 'edit', {'form': 'A2', 'expected': 8, 'value': 92})
        self.run_op('edit-2', 'edit', {'form': 'A2', 'expected': 9, 'value': 29})
        self.assertFalse(self.trial.signed_current(self.scope))
        with self.assertRaisesRegex(Rejected, 'signature_stale_or_missing'):
            self.lock()

    def test_05_definition_change_same_value_invalidates(self):
        self.sign()
        self.run_op('amend', 'definition', {'form': 'A2'})
        self.assertFalse(self.trial.signed_current(self.scope))
        with self.assertRaisesRegex(Rejected, 'signature_stale_or_missing'):
            self.lock()

    def test_06_new_required_form_invalidates_membership(self):
        self.sign()
        self.run_op('new-form', 'add', {'form': 'A4'})
        with self.assertRaisesRegex(Rejected, 'signature_stale_or_missing'):
            self.lock()

    def test_07_old_signature_receipt_cannot_cover_new_revision(self):
        old = self.trial.snapshot(self.scope)
        self.sign()
        self.run_op('edit-new', 'edit', {'form': 'A2', 'expected': 8, 'value': 30})
        # Local operation lookup simulates a late duplicate receipt, not a webhook implementation.
        self.assertEqual(self.trial.operation(self.scope, 'sign-1')['kind'], 'sign')
        self.assertFalse(self.trial.signed_current(self.scope))
        with self.assertRaisesRegex(Rejected, 'manifest_conflict'):
            self.run_op('late-sign', 'sign', {'expected_manifest': old})

    def test_08_scope_and_role_denial(self):
        with self.assertRaisesRegex(Rejected, 'scope_forbidden'):
            self.trial.apply(self.other, 'cross', 'edit', {'form': 'A2', 'expected': 8, 'value': 99}, self.scope, 'CRC')
        with self.assertRaisesRegex(Rejected, 'role_forbidden'):
            self.trial.apply(self.scope, 'impersonate', 'sign', {}, self.scope, 'CRC')
        self.sign()
        self.assertIsNone(self.trial.operation(self.other, 'sign-1'))
        self.assertFalse(self.trial.signed_current(self.other))

    def test_09_unknown_response_reconciles_after_connection_reopen(self):
        self.sign('lost-response')  # Result deliberately discarded, commit remains durable.
        reopened = Trial(self.trial.path)
        result = reopened.operation(self.scope, 'lost-response')
        self.assertEqual(result['kind'], 'sign')
        self.assertTrue(reopened.signed_current(self.scope))
        self.assertIsNone(reopened.operation(self.scope, 'never-committed'))

    def test_10_mutation_first_and_lock_first_have_explicit_outcomes(self):
        self.sign()
        preview = self.trial.snapshot(self.scope)
        self.run_op('first-edit', 'edit', {'form': 'A2', 'expected': 8, 'value': 30})
        with self.assertRaisesRegex(Rejected, 'manifest_conflict'):
            self.lock(manifest=preview)
        self.sign('sign-new')
        self.lock('lock-new')
        with self.assertRaisesRegex(Rejected, 'locked'):
            self.run_op('late-edit', 'edit', {'form': 'A2', 'expected': 9, 'value': 31})
        self.trial.assert_invariant(self.scope)

    def test_11_concurrent_query_insert_and_lock_no_phantom_blocker(self):
        self.sign()
        start = threading.Barrier(3)
        outcomes = []
        outcome_guard = threading.Lock()
        manifest = self.trial.snapshot(self.scope)
        def worker(name, kind, payload):
            start.wait()
            try:
                self.run_op(name, kind, payload)
                result = name + ':committed'
            except Rejected as exc:
                result = name + ':' + str(exc)
            except Exception as exc:
                result = name + ':unexpected:' + repr(exc)
            with outcome_guard:
                outcomes.append(result)
        threads = [threading.Thread(target=worker, args=('concurrent-lock', 'lock', {'expected_manifest': manifest})),
                   threading.Thread(target=worker, args=('concurrent-query', 'query', {'query': 'Q-new', 'status': 'open'}))]
        for thread in threads:
            thread.start()
        start.wait()
        for thread in threads:
            thread.join(timeout=6)
            self.assertFalse(thread.is_alive())
        legal = [sorted(['concurrent-lock:committed', 'concurrent-query:locked']),
                 sorted(['concurrent-query:committed', 'concurrent-lock:closure_blocker'])]
        self.assertIn(sorted(outcomes), legal)
        self.trial.assert_invariant(self.scope)

    def test_12_counterexample_counts_do_not_prove_coverage(self):
        required = {'A1', 'A2', 'A3'}
        signed = {'A1', 'A2', 'X9'}
        self.assertTrue(len(required) == len(signed))  # Deliberately bad check accepts.
        self.assertEqual(required - signed, {'A3'})  # Correct invariant detects omission.

    def test_13_counterexample_unguarded_check_then_write(self):
        # Explicit deterministic interleaving of a deliberately broken implementation.
        data = {'open_queries': 0, 'locked': False}
        t1_cached_ready = data['open_queries'] == 0
        data['open_queries'] += 1  # T2 inserts after T1 checked.
        if t1_cached_ready:
            data['locked'] = True
        self.assertTrue(data['locked'] and data['open_queries'] == 1)
        # The test succeeds because it demonstrates an invariant VIOLATION in bad code.


if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(Invariants)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    print(json.dumps({'scope': 'synthetic SQLite model; no provider/UI/E2E/load/AI eval',
                      'executed': result.testsRun, 'unexpected_failures': len(result.failures),
                      'errors': len(result.errors), 'bad_implementation_counterexamples': 2,
                      'limits': ['single SQLite file uses global writer serialization',
                                 'no authentication, external callbacks, export jobs or consent engine implemented',
                                 'thread race checks one observed legal order; sequential test covers both orders']},
                     ensure_ascii=False))
    raise SystemExit(not result.wasSuccessful())
