"""Synthetic behavioral checks and an independent loopback provider."""
from collections import Counter
from contextlib import contextmanager
from copy import deepcopy
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import socket
import tempfile
import threading
import unittest
from urllib.parse import parse_qs, urlsplit
from mechanism_lab import (Change, ContractError, FakeAdapter, HttpAdapter,
    OperationJournal, PurchaseLedger, RuleError, UnknownResult, migrate_work)


class ReferenceProvider:
    """Independent teaching protocol implementation, not a vendor simulator."""
    def __init__(self):
        self.ledger, self.versions, self.values = {}, {}, {}
        self.effect_count = 0
        self.lose_next_response = False
        self.response_override = None
        self.lock = threading.Lock()

    def post(self, body):
        key = (body['tenant'], body['operation_id'])
        with self.lock:
            if key in self.ledger:
                request, result = self.ledger[key]
                return (200, deepcopy(result)) if request == body else (409, {'error':'key_reused'})
            result = {k:body[k] for k in ('tenant','operation_id','target')}
            result.update(state='applied',receipt='http-'+body['operation_id'])
            if body['kind'] == 'payment':
                result.update(amount_minor=body['amount_minor'],currency=body['currency'])
            else:
                target=(body['tenant'],body['target'])
                version=self.versions.get(target,8)
                if body['expected_version'] != version:
                    result['state']='rejected'
                else:
                    result.update(version=version+1,desired=body['desired'])
                    self.versions[target]=version+1
                    self.values[target]=body["desired"]
            self.effect_count += int(result['state']=='applied')
            self.ledger[key]=(deepcopy(body),deepcopy(result))
            return 200,result


@contextmanager
def http_fixture():
    provider=ReferenceProvider()
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*_): pass
        def send_json(self,status,body):
            if provider.response_override is not None: body=provider.response_override
            data=json.dumps(body).encode()
            self.send_response(status)
            self.send_header('Content-Type','application/json')
            self.send_header('Content-Length',str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        def do_POST(self):
            if self.path != '/operations':
                self.send_json(404,{'error':'route'}); return
            body=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
            status,result=provider.post(body)
            if provider.lose_next_response:
                provider.lose_next_response=False
                self.connection.shutdown(socket.SHUT_RDWR)
                self.connection.close(); return
            self.send_json(status,result)
        def do_GET(self):
            parsed=urlsplit(self.path)
            if parsed.path != '/operations':
                self.send_json(404,{'error':'route'}); return
            query=parse_qs(parsed.query)
            value=provider.ledger.get((query['tenant'][0],query['operation_id'][0]))
            self.send_json(200,value[1]) if value else self.send_json(404,{'error':'not_observed'})
    server=ThreadingHTTPServer(('127.0.0.1',0),Handler)
    worker=threading.Thread(target=lambda:server.serve_forever(poll_interval=.01),daemon=True)
    worker.start()
    try: yield HttpAdapter('http://127.0.0.1:'+str(server.server_port)),provider
    finally:
        server.shutdown(); server.server_close(); worker.join(timeout=2)


@contextmanager
def fake_fixture():
    fake=FakeAdapter()
    yield fake,fake


def change_intent():
    change=Change(); change.approve('owner','service-owner')
    return change.intent('operator','executor')


class AdapterContract:
    fixture=None
    def test_same_intent_replay_has_one_effect(self):
        with self.fixture() as (adapter,provider):
            self.assertEqual(4,provider.values.get(('T-1','SVC-7'),4))
            first=adapter.submit(change_intent())
            self.assertEqual(6,provider.values[('T-1','SVC-7')])
            self.assertEqual(first,adapter.submit(change_intent()))
            self.assertEqual((1,9),(provider.effect_count,first['version']))
    def test_reused_key_with_different_content_is_refused(self):
        with self.fixture() as (adapter,provider):
            body=change_intent(); adapter.submit(body); body['desired']=8
            with self.assertRaisesRegex(RuleError,'idempotency_conflict'): adapter.submit(body)
            self.assertEqual(1,provider.effect_count)
    def test_tenant_identity_is_not_shared(self):
        with self.fixture() as (adapter,provider):
            body=change_intent(); adapter.submit(body)
            self.assertIsNone(adapter.lookup('T-2','OP-42'))
            body['tenant']='T-2'
            self.assertEqual('T-2',adapter.submit(body)['tenant'])
            self.assertEqual(2,provider.effect_count)
    def test_lost_response_recovers_original_operation(self):
        with self.fixture() as (adapter,provider):
            provider.lose_next_response=True
            with self.assertRaises(UnknownResult): adapter.submit(change_intent())
            result=adapter.lookup('T-1','OP-42')
            self.assertEqual('applied',result['state'])
            self.assertEqual(result,adapter.submit(change_intent()))
            self.assertEqual(1,provider.effect_count)
    def test_absence_is_not_rejection(self):
        with self.fixture() as (adapter,_): self.assertIsNone(adapter.lookup('T-1','missing'))
    def test_unrecognized_state_is_not_success(self):
        with self.fixture() as (adapter,provider):
            adapter.submit(change_intent())
            ledger=provider.entries if isinstance(provider,FakeAdapter) else provider.ledger
            ledger[('T-1','OP-42')][1]['state']='applied_with_warning'
            with self.assertRaises(ContractError): adapter.submit(change_intent())
            with self.assertRaises(ContractError): adapter.lookup('T-1','OP-42')
    def test_stale_config_has_no_new_effect(self):
        with self.fixture() as (adapter,provider):
            body=change_intent(); adapter.submit(body)
            body.update(operation_id='OP-new',business_key='CHG-other')
            self.assertEqual('rejected',adapter.submit(body)['state'])
            self.assertEqual(1,provider.effect_count)


class TestFakeContract(AdapterContract,unittest.TestCase): fixture=staticmethod(fake_fixture)
class TestHttpContract(AdapterContract,unittest.TestCase): fixture=staticmethod(http_fixture)


class TestWorkflows(unittest.TestCase):
    def journal(self):
        j=OperationJournal(); self.addCleanup(j.close); return j
    def purchase(self):
        p=PurchaseLedger(); self.addCleanup(p.close); return p
    def test_e01_end_to_end_both_adapters(self):
        for fixture in (fake_fixture,http_fixture):
            with self.subTest(adapter=fixture.__name__),fixture() as (adapter,provider):
                po,j=self.purchase(),self.journal()
                po.approve('owner','budget-owner',1)
                with self.assertRaisesRegex(RuleError,'insufficient_accepted'): po.allocate('INV-9',1)
                po.revise_invoice(9,1,'supplier-revision-2')
                result=po.allocate('INV-9',2)
                self.assertEqual((9,720000),(result['qty'],result['amount']))
                self.assertEqual(result,po.allocate('INV-9',2))
                po.add_invoice('INV-extra',1)
                with self.assertRaisesRegex(RuleError,'insufficient_accepted'): po.allocate('INV-extra',1)
                j.enqueue(po.payment_intent('treasury-person','treasury'))
                provider.lose_next_response=True
                self.assertEqual('unknown',j.dispatch('T-1','PAY-17',adapter))
                self.assertEqual('settled',j.reconcile('T-1','PAY-17',adapter))
                self.assertEqual(1,provider.effect_count)
    def test_e02_end_to_end_both_adapters(self):
        for fixture in (fake_fixture,http_fixture):
            with self.subTest(adapter=fixture.__name__),fixture() as (adapter,provider):
                j=self.journal(); j.enqueue(change_intent()); provider.lose_next_response=True
                self.assertEqual('unknown',j.dispatch('T-1','OP-42',adapter))
                with self.assertRaisesRegex(RuleError,'effect_not_confirmed'):
                    j.accept('T-1','OP-42','owner','service-owner',10,10,'probe')
                self.assertEqual('awaiting_acceptance',j.reconcile('T-1','OP-42',adapter))
                with self.assertRaisesRegex(RuleError,'acceptance_failed'):
                    j.accept('T-1','OP-42','owner','service-owner',8,10,'probe-fail')
                self.assertEqual('closed',j.accept('T-1','OP-42','owner','service-owner',10,10,'probe-pass'))
                self.assertEqual('closed',j.reconcile('T-1','OP-42',adapter))
                self.assertEqual(1,provider.effect_count)
    def test_purchase_role_separation(self):
        po=self.purchase()
        with self.assertRaisesRegex(RuleError,'not_authorized'): po.approve('requester','budget-owner',1)
        with self.assertRaisesRegex(RuleError,'not_authorized'): po.payment_intent('ap-clerk','treasury')
    def test_price_change_invalidates_approval(self):
        po=self.purchase(); po.approve('owner','budget-owner',1); po.change_price(82000)
        po.revise_invoice(9,1,'new-evidence')
        with self.assertRaisesRegex(RuleError,'approval_required'): po.allocate('INV-9',2)
        with self.assertRaisesRegex(RuleError,'stale_version'): po.approve('owner','budget-owner',1)
    def test_old_invoice_version_cannot_revive(self):
        po=self.purchase(); po.approve('owner','budget-owner',1)
        po.revise_invoice(9,1,'supplier-revision'); po.allocate('INV-9',2)
        history=po.db.execute('SELECT version,qty FROM invoice_revision ORDER BY version').fetchall()
        self.assertEqual([(1,10),(2,9)],[tuple(row) for row in history])
        with self.assertRaisesRegex(RuleError,'stale_version'): po.allocate('INV-9',1)
        with self.assertRaisesRegex(RuleError,'allocated_change_requires_adjustment'):
            po.revise_invoice(10,2,'later-revision')
    def test_two_connections_compete_for_last_unit(self):
        with tempfile.TemporaryDirectory() as directory:
            path=str(Path(directory)/'po.db'); po=PurchaseLedger(path)
            po.approve('owner','budget-owner',1); po.revise_invoice(8,1,'revision'); po.allocate('INV-9',2)
            po.add_invoice('A',1); po.add_invoice('B',1); po.close()
            barrier=threading.Barrier(2); outcomes=[]
            def run(name):
                p=PurchaseLedger(path)
                try:
                    barrier.wait(timeout=3); p.allocate(name,1); outcomes.append('allocated')
                except RuleError as exc: outcomes.append(str(exc))
                finally: p.close()
            threads=[threading.Thread(target=run,args=(name,)) for name in ('A','B')]
            for t in threads: t.start()
            for t in threads: t.join(timeout=5); self.assertFalse(t.is_alive())
            self.assertCountEqual(['allocated','insufficient_accepted_quantity'],outcomes)
            p=PurchaseLedger(path)
            try: self.assertEqual(9,p.db.execute('SELECT sum(qty) FROM allocation').fetchone()[0])
            finally: p.close()
    def test_scope_change_and_expiry_refuse_submission(self):
        c=Change(); c.approve('owner','service-owner')
        with self.assertRaisesRegex(RuleError,'approval_expired'): c.intent('operator','executor',1230)
        c.desired=8
        with self.assertRaisesRegex(RuleError,'approval_stale'): c.intent('operator','executor')
    def test_queued_expiry_refuses_send(self):
        j=self.journal(); adapter=FakeAdapter(); j.enqueue(change_intent())
        self.assertEqual('expired',j.dispatch('T-1','OP-42',adapter,1230)); self.assertEqual(0,adapter.effect_count)
    def test_new_key_cannot_bypass_existing_business_intent(self):
        j=self.journal(); body=change_intent(); j.enqueue(body); body['operation_id']='OP-43'
        with self.assertRaisesRegex(RuleError,'business_intent_exists'): j.enqueue(body)
        body=change_intent(); body['desired']=8
        with self.assertRaisesRegex(RuleError,'idempotency_conflict'): j.enqueue(body)
    def test_restart_reconciles_without_reexecution(self):
        with tempfile.TemporaryDirectory() as directory:
            path=str(Path(directory)/'ops.db'); adapter=FakeAdapter(); j=OperationJournal(path)
            j.enqueue(change_intent()); adapter.lose_next_response=True
            j.dispatch('T-1','OP-42',adapter); j.close(); j=OperationJournal(path)
            try:
                self.assertEqual('unknown',j.row('T-1','OP-42')['state'])
                with self.assertRaisesRegex(RuleError,'reconcile_existing_operation'): j.dispatch('T-1','OP-42',adapter)
                self.assertEqual('awaiting_acceptance',j.reconcile('T-1','OP-42',adapter))
                self.assertEqual(1,adapter.effect_count)
            finally: j.close()
    def test_sending_crash_window_is_recoverable(self):
        j=self.journal(); a=FakeAdapter(); body=change_intent(); j.enqueue(body)
        j._state('T-1','OP-42','sending'); a.submit(body)
        self.assertEqual('awaiting_acceptance',j.reconcile('T-1','OP-42',a)); self.assertEqual(1,a.effect_count)
    def test_absent_lookup_keeps_unknown(self):
        j=self.journal(); j.enqueue(change_intent()); j._state('T-1','OP-42','unknown')
        self.assertEqual('unknown',j.reconcile('T-1','OP-42',FakeAdapter()))
    def test_agent_cannot_accept_for_owner(self):
        j=self.journal(); j.enqueue(change_intent()); j.dispatch('T-1','OP-42',FakeAdapter())
        with self.assertRaisesRegex(RuleError,'not_authorized'):
            j.accept('T-1','OP-42','operator','executor',10,10,'probe')
    def test_late_message_does_not_regress_confirmed_effect(self):
        j=self.journal(); a=FakeAdapter(); j.enqueue(change_intent()); j.dispatch('T-1','OP-42',a)
        late=a.lookup('T-1','OP-42'); late['state']='accepted'
        self.assertEqual('awaiting_acceptance',j._observe('T-1','OP-42',late))
    def test_late_send_failure_preserves_concurrent_confirmation(self):
        for failure in (UnknownResult, ContractError, RuleError):
            with self.subTest(failure=failure.__name__):
                j=self.journal(); j.enqueue(change_intent())
                class ObservedBeforeFailure(FakeAdapter):
                    def submit(self, intent):
                        result=super().submit(intent)
                        # A reconciliation worker saves the effect before the sender resumes.
                        j._observe('T-1','OP-42',result)
                        raise failure('late_sender_failure')
                adapter=ObservedBeforeFailure()
                if failure is RuleError:
                    with self.assertRaises(RuleError): j.dispatch('T-1','OP-42',adapter)
                else:
                    self.assertEqual('awaiting_acceptance',j.dispatch('T-1','OP-42',adapter))
                self.assertEqual('awaiting_acceptance',j.row('T-1','OP-42')['state'])
                self.assertEqual(1,adapter.effect_count)
    def test_concurrent_observations_cannot_regress_applied(self):
        with tempfile.TemporaryDirectory() as directory:
            path=str(Path(directory)/'observe.db')
            journal=OperationJournal(path); journal.enqueue(change_intent())
            journal._state('T-1','OP-42','sending'); journal.close()
            applied=FakeAdapter().submit(change_intent())
            accepted={**applied,'state':'accepted'}
            barrier=threading.Barrier(2); errors=[]
            def observe(result):
                local=OperationJournal(path)
                try:
                    barrier.wait(timeout=3); local._observe('T-1','OP-42',result)
                except Exception as exc: errors.append(str(exc))
                finally: local.close()
            threads=[threading.Thread(target=observe,args=(result,)) for result in (applied,accepted)]
            for thread in threads: thread.start()
            for thread in threads: thread.join(timeout=5); self.assertFalse(thread.is_alive())
            final=OperationJournal(path)
            try:
                self.assertEqual([],errors)
                self.assertEqual('awaiting_acceptance',final.row('T-1','OP-42')['state'])
            finally: final.close()
    def test_http_malformed_identity_state_and_effect_are_refused(self):
        with http_fixture() as (adapter,p):
            valid=adapter.submit(change_intent())
            for value in ({},{**valid,'state':'applied_with_warning'},{**valid,'tenant':'other'},
                          {**valid,'version':99},{**valid,'desired':8}):
                with self.subTest(response=value):
                    p.response_override=value
                    with self.assertRaises(ContractError): adapter.submit(change_intent())
    def test_http_unknown_shape_stays_unknown_then_reconciles(self):
        with http_fixture() as (adapter,p):
            j=self.journal(); j.enqueue(change_intent()); p.response_override={'state':'applied_with_warning'}
            self.assertEqual('unknown',j.dispatch('T-1','OP-42',adapter)); self.assertEqual(1,p.effect_count)
            p.response_override=None
            self.assertEqual('awaiting_acceptance',j.reconcile('T-1','OP-42',adapter))
    def test_adapter_does_not_accept_external_hosts(self):
        for url in ('https://example.com','http://localhost','http://127.0.0.1@example.com'):
            with self.subTest(url=url),self.assertRaises(ValueError): HttpAdapter(url)


class TestCutover(unittest.TestCase):
    def setUp(self): self.fixture=json.loads(Path(__file__).with_name('fixtures.json').read_text())
    def test_twenty_obligations_keep_their_state_and_identity(self):
        records=migrate_work(self.fixture['cutover'])
        self.assertEqual(Counter(ready=12,awaiting_acceptance=5,unknown=2,blocked=1),Counter(x['state'] for x in records))
        records[17].update(state='awaiting_acceptance',effect_ref='query-confirmed-18')
        self.assertEqual(Counter(ready=12,awaiting_acceptance=6,unknown=1,blocked=1),Counter(x['state'] for x in records))
        self.assertEqual(20,len(records)); self.assertEqual('OLD-OP-19',records[18]['operation_id'])
    def test_missing_evidence_and_unknown_mapping_are_refused(self):
        for index,field in ((0,'approval_ref'),(12,'effect_ref'),(17,'operation_id'),(19,'reason')):
            bad=deepcopy(self.fixture['cutover']); del bad[index][field]
            with self.subTest(index=index),self.assertRaises(RuleError): migrate_work(bad)
        bad=deepcopy(self.fixture['cutover']); bad[0]['state']='done'
        with self.assertRaisesRegex(RuleError,'unmapped_source_state'): migrate_work(bad)
    def test_duplicate_identity_is_refused(self):
        records=deepcopy(self.fixture['cutover']); records.append(deepcopy(records[0]))
        with self.assertRaisesRegex(RuleError,'duplicate_business_identity'): migrate_work(records)
        records[-1]['tenant']='T-2'; self.assertEqual(21,len(migrate_work(records)))
    def test_manuscript_arithmetic_and_variants(self):
        n=self.fixture['expected']
        observed={'purchase_total_minor':12*80000,'settlement_minor':9*80000,
                  'prepayment_minor':12*80000*30//100,'standard_person_days':8+8*1,
                  'custom_person_days':20+8*4,'saved_person_days':.5*220*2/8,
                  'changed_saved_person_days':1*220*2/8,'training_rate_percent_rounded':round(5/6*100,1)}
        self.assertEqual(n,observed); self.assertEqual(.75,9/12); self.assertEqual(.9,9/10)


if __name__=='__main__': unittest.main(verbosity=2)
