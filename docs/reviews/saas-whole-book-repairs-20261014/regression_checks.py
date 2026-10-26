#!/usr/bin/env python3
"""Targeted whole-book regressions; synthetic state, SQLite and loopback HTTP only."""
import argparse
import importlib.util
import json
from pathlib import Path
import re
import sys
import tempfile
import unittest
from itertools import permutations

ROOT=Path(__file__).resolve().parents[3]
ATLAS=ROOT/'vault/distilled/saas-engineering-atlas'
BOOK=ROOT/'projects/books/saas-engineering'
sys.path.insert(0,str(ATLAS/'enterprise-mechanisms'))
import mechanism_lab as M
import test_mechanism_lab as T

def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec)
    sys.modules[name]=module;spec.loader.exec_module(module);return module
X=load('wb_x01',ATLAS/'packages/data-ai-control/check_x01.py')
S=load('wb_stock',ATLAS/'packages/industry-networks/synthetic_checks.py')
C=load('wb_finance',ATLAS/'packages/commercial-finance/checks.py')
OBS={}

class EnterpriseRepairs(unittest.TestCase):
    def test_fixed_policy_cannot_accept_smaller_perfect_denominator(self):
        for fixture in (T.fake_fixture,T.http_fixture):
            with fixture() as (adapter,provider),tempfile.TemporaryDirectory() as temp:
                path=str(Path(temp)/'journal.db');j=M.OperationJournal(path)
                try:
                    body=T.change_intent();j.enqueue(body)
                    with self.assertRaisesRegex(M.RuleError,'effect_not_confirmed'):
                        j.accept('T-1','OP-42','owner','service-owner',10,10,'evidence')
                    j.dispatch('T-1','OP-42',adapter);j.close();j=M.OperationJournal(path)
                    self.assertEqual(json.loads(j.row('T-1','OP-42')['payload'])['acceptance_policy']['probe_total'],10)
                    for passed,total in ((1,1),(9,9),(8,10),(True,10),(10,True)):
                        with self.assertRaisesRegex(M.RuleError,'acceptance_failed'):
                            j.accept('T-1','OP-42','owner','service-owner',passed,total,'evidence')
                    with self.assertRaisesRegex(M.RuleError,'not_authorized'):
                        j.accept('T-1','OP-42','operator','executor',10,10,'evidence')
                    self.assertEqual(j.accept('T-1','OP-42','owner','service-owner',10,10,'evidence'),'closed')
                    self.assertEqual(provider.effect_count,1)
                finally:j.close()
        OBS['WB-01']='persisted 10/10 policy; 1/1, 9/9, 8/10 and wrong role rejected; confirmed 10/10 closes on both adapters after reopen'

    def test_forged_narrow_acceptance_policy_rejected_before_enqueue(self):
        body=T.change_intent();body['acceptance_policy']['probe_total']=1
        j=M.OperationJournal()
        try:
            with self.assertRaisesRegex(M.RuleError,'invalid_acceptance_policy'):j.enqueue(body)
            self.assertEqual(j.db.execute('SELECT count(*) FROM operations').fetchone()[0],0)
        finally:j.close()

    def test_terminal_conflicts_preserve_facts_and_survive_reopen(self):
        for first_state,later_state,changed_receipt in [('applied','rejected',False),('rejected','applied',False),('applied','applied',True)]:
            with tempfile.TemporaryDirectory() as temp:
                path=str(Path(temp)/'journal.db');j=M.OperationJournal(path);a=M.FakeAdapter();body=T.change_intent()
                try:
                    j.enqueue(body);base=a.submit(body);j._state('T-1','OP-42','sending')
                    first=dict(base,state=first_state);j._observe('T-1','OP-42',first)
                    before=j.row('T-1','OP-42')
                    second=dict(base,state=later_state)
                    if changed_receipt:second['receipt']='different-receipt'
                    class Observation:
                        def lookup(self,*_):return second
                    self.assertEqual(j.reconcile('T-1','OP-42',Observation()),'evidence_conflict')
                    self.assertEqual(j.reconcile('T-1','OP-42',Observation()),'evidence_conflict')
                    j.close();j=M.OperationJournal(path);row=j.row('T-1','OP-42')
                    self.assertEqual((row['state'],row['result']),(before['state'],before['result']))
                    self.assertEqual(row['conflict_count'],1)
                    conflict=j.conflicts('T-1','OP-42')[0]
                    self.assertEqual(json.loads(conflict['prior_result']),first)
                    self.assertEqual(json.loads(conflict['observed_result']),second)
                    self.assertEqual(j.db.execute('SELECT count(*) FROM operations').fetchone()[0],1)
                    self.assertEqual(a.effect_count,1)
                    if first_state=='applied':
                        with self.assertRaisesRegex(M.RuleError,'evidence_conflict'):
                            j.accept('T-1','OP-42','owner','service-owner',10,10,'evidence')
                finally:j.close()
        OBS['WB-02']='applied/rejected in both orders and changed same-state receipt persist visible conflicts; prior facts and one operation remain'

    def test_late_accepted_is_weaker_evidence_not_terminal_conflict(self):
        j=M.OperationJournal();a=M.FakeAdapter()
        try:
            j.enqueue(T.change_intent());j.dispatch('T-1','OP-42',a)
            late=dict(a.lookup('T-1','OP-42'),state='accepted',receipt='earlier-accepted-receipt')
            self.assertEqual(j._observe('T-1','OP-42',late),'awaiting_acceptance')
            self.assertEqual(j.row('T-1','OP-42')['conflict_count'],0)
        finally:j.close()

    def test_received_accepted_pending_and_not_received_are_distinct(self):
        e=json.loads((ATLAS/'enterprise-mechanisms/examples.json').read_text())['examples'][0]
        p=e['policy'];final=e['steps'][-1]['effect']
        self.assertEqual((p['accepted_qty'],final['pending_inspection_qty'],final['not_received_qty']),(9,1,2))
        self.assertEqual(p['accepted_qty']+final['pending_inspection_qty'],p['received_qty'])
        self.assertEqual(p['received_qty']+final['not_received_qty'],p['requested_qty'])
        self.assertNotIn('remaining_delivery_qty',final)
        OBS['WB-09']='9 accepted + 1 received/pending inspection + 2 not received = 12'

    def test_receipt_reports_result_version_compared_with_persisted_prerequisite(self):
        for fixture in (T.fake_fixture,T.http_fixture):
            with fixture() as (adapter,_):
                body=T.change_intent();result=adapter.submit(body)
                self.assertNotIn('expected_version',result)
                self.assertEqual(result['version'],body['expected_version']+1)
                with self.assertRaisesRegex(M.ContractError,'mismatched_change_effect'):
                    M.validate_result(dict(result,version=8),body)
        OBS['WB-10']='both adapters return version9; expected_version8 comes from request; wrong result version rejects'

    def test_new_approved_revision_has_new_intent_and_old_retries_stay_bound(self):
        for fixture in (T.fake_fixture,T.http_fixture):
            with fixture() as (adapter,provider):
                j=M.OperationJournal();c=M.Change()
                try:
                    c.approve('owner','service-owner');old=c.intent('operator','executor');j.enqueue(old);j.dispatch('T-1','OP-42',adapter)
                    c.revision=4;c.config_version=9;c.desired=8
                    with self.assertRaisesRegex(M.RuleError,'approval_stale'):c.intent('operator','executor')
                    c.approve('owner','service-owner');new=c.intent('operator','executor')
                    self.assertEqual((new['approval_ref'],new['business_key'],new['operation_id']),('APR-42-r4','CHG-42/r4/apply','OP-42-r4'))
                    j.enqueue(new);self.assertEqual(j.dispatch('T-1','OP-42-r4',adapter),'awaiting_acceptance')
                    self.assertEqual((provider.effect_count,provider.values[('T-1','SVC-7')]),(2,8))
                    self.assertEqual(adapter.submit(old)['version'],9);self.assertEqual(adapter.submit(new)['version'],10)
                    self.assertEqual(provider.effect_count,2)
                    with self.assertRaisesRegex(M.RuleError,'idempotency_conflict'):j.enqueue(dict(new,desired=9))
                    with self.assertRaisesRegex(M.RuleError,'business_intent_exists'):j.enqueue(dict(new,operation_id='replacement'))
                finally:j.close()
        OBS['WB-11']='r4 reapproval succeeds with new identities on fake/HTTP; stale approval, changed same key and replacement key for same intent reject'

class CaseAndReaderRepairs(unittest.TestCase):
    def test_reservation_quantities_and_version_retry_are_separate(self):
        outcomes={}
        for requests in [(('Q1',16),('Q2',16)),(('S1',10),('S2',6))]:
            for order in permutations(requests):
                stock=S.StockReservation(16);first,second=order
                self.assertEqual(stock.reserve(*first,1),'reserved')
                self.assertEqual(stock.reserve(*second,1),'version_conflict')
                retried=stock.reserve(*second,stock.version)
                self.assertEqual(retried,'insufficient_stock' if first[1]==16 else 'reserved')
                self.assertEqual(stock.available+sum(stock.reserved.values()),16)
                self.assertEqual(stock.available,0)
                version=stock.version;self.assertEqual(stock.reserve(*first,1),'reserved');self.assertEqual(stock.version,version)
                outcomes[str(order)]=retried
        OBS['WB-03']={'retry_outcomes':outcomes,'scope':'serialized conditional state model, not real database concurrency'}

    def test_rounding_clipping_and_array_indices(self):
        self.assertEqual([C.cumulative(100,0,3,t) for t in (-2,0,1,2,3,5)],[0,0,33,66,100,100])
        self.assertEqual([C.window(100,0,3,t,t+1) for t in range(3)],[33,33,34])
        values=[2,1,3,0,4];prefix=[sum(values[:i]) for i in range(6)]
        self.assertEqual(values[1:4],[1,3,0]);self.assertEqual(prefix[4]-prefix[1],4)
        OBS['WB-07']='clamped cumulative boundaries 0/100; interval allocations33/33/34; zero-based positions1/2/3 sum4'

    def test_buffered_answer_revocation_before_first_chunk(self):
        answer=X.BufferedAnswer('T','T',1,['part0','part1'],300)
        with self.assertRaisesRegex(ValueError,'not_verified'):answer.emit(0,1,True)
        answer.verified=True
        with self.assertRaises(PermissionError):answer.emit(0,2,False)
        self.assertEqual(answer.delivered_indices,set());self.assertEqual(answer.consumed_units,300)

    def test_revocation_between_chunks_preserves_prior_delivery(self):
        answer=X.BufferedAnswer('T','T',1,['part0','part1'],300);answer.verified=True
        self.assertEqual(answer.emit(0,1,True),'part0')
        with self.assertRaises(PermissionError):answer.emit(1,2,False)
        self.assertEqual(answer.delivered_indices,{0});self.assertEqual(answer.consumed_units,300)

    def test_reconnect_replay_requires_current_authorization(self):
        answer=X.BufferedAnswer('T','T',1,['part0','part1'],300);answer.verified=True
        answer.emit(0,1,True);self.assertEqual(answer.emit(0,1,True),'part0')
        self.assertEqual(answer.delivered_indices,{0});self.assertEqual(answer.delivery_attempts,[0,0])
        for index in (0,1):
            with self.assertRaises(PermissionError):answer.emit(index,2,False)
            with self.assertRaises(PermissionError):answer.emit(index,3,True)
        self.assertEqual(answer.delivered_indices,{0});self.assertEqual(answer.consumed_units,300)
        OBS['WB-12']='before-first, between-chunks and reconnect revocations block new delivery; prior authorized chunks/attempts and consumed units retained; renewed epoch does not revive old run; synchronous fake receiver only'

    def test_transfer_target_and_advertised_commands(self):
        chapter=(BOOK/'packages/commercial-finance/H03.md').read_text();new='TR:H03:V07:dependency-not-capacity'
        self.assertIn(new,chapter);self.assertNotIn('TR:H03:H07:dependency-not-capacity',chapter)
        self.assertIn('../industry-networks/V07.md',chapter)
        proposal=next(x for x in json.loads((ATLAS/'transfer-proposals.json').read_text())['proposals'] if x['id']==new)
        self.assertIn('TR:H03:H07:dependency-not-capacity',proposal['previous_ids'])
        self.assertIn(new,proposal['occurrences'][0]['context'])
        finance=(BOOK/'packages/commercial-finance/README.md').read_text()
        for name in ('checks.py','validate-package.py'):
            self.assertIn('python3 vault/distilled/saas-engineering-atlas/packages/commercial-finance/'+name,finance)
            self.assertTrue((ATLAS/'packages/commercial-finance'/name).is_file())
        self.assertIn('synthetic-v02.py',(BOOK/'packages/health-science/V02.md').read_text())
        self.assertNotIn('正文旁的同名 JSON',(BOOK/'packages/README.md').read_text())
        OBS['WB-04-05']='manufacturing destination V07 and old alias preserved; executable finance and health routes point to Vault'

    def test_term_first_uses_and_removed_production_narration(self):
        review=json.loads(Path(__file__).with_name('term-review.json').read_text())
        definitions={x['source_term']:x for x in review['terms']}
        for use in review['first_uses']:
            body=(ROOT/use['path']).read_text()
            visible=re.sub(r'\]\([^)]*\)',']',body)
            expansion=definitions[use['term']]['english_expansion']
            self.assertIn(expansion,visible)
            for target in re.findall(r'\]\(([^)]*)\)',body):self.assertNotIn(expansion,target)
        self.assertIn('不是标准货币代码',(BOOK/'packages/commercial-finance/V13.md').read_text())
        prohibited=['HTML/motion','便于后续动效','本地实现自由选择布局与 motion','HTML 与动效形式留给后续实现','HTML 和动效可以自由组织','HTML 和动效不限定','后续可视化的布局和交互由本地实现者选择','不限定页面、动效或多 agent','HTML 和 motion 的组织方式留给本地实现者']
        for path in (BOOK/'packages').glob('*/*.md'):
            for fragment in prohibited:self.assertNotIn(fragment,path.read_text(),str(path))
        OBS['WB-06-08']={'new_glossary_entries':len(definitions),'first_use_occurrences_checked':len(review['first_uses']),'distinct_reader_paths':len({u['path'] for u in review['first_uses']}),'meaning':'reader experiments and domain qualifications retained; production freedom remains in Claude handoff'}

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--output',type=Path);args=parser.parse_args()
    suite=unittest.TestSuite(unittest.defaultTestLoader.loadTestsFromTestCase(c) for c in (EnterpriseRepairs,CaseAndReaderRepairs))
    result=unittest.TextTestRunner(verbosity=2).run(suite)
    report={'status':'pass' if result.wasSuccessful() else 'fail','test_methods':result.testsRun,'observations':OBS,'scope':__doc__}
    if args.output:args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False,indent=2));return not result.wasSuccessful()
if __name__=='__main__':raise SystemExit(main())
