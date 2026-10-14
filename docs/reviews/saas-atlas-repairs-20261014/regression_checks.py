#!/usr/bin/env python3
"""Regression evidence for the imported reviews; standard-library synthetic tests.

Original audit scripts remain frozen defect reproducers. This suite tests repairs.
No provider, model, browser, PostgreSQL, load, or process-crash execution.
"""
import argparse
from copy import deepcopy
from dataclasses import replace
from decimal import Decimal
import importlib.util
from itertools import product
import json
from pathlib import Path
import sqlite3
import sys
import types
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
ATLAS = ROOT / 'vault/distilled/saas-engineering-atlas'

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

F = load('repair_foundations', ATLAS/'foundations/check_examples.py')
H7 = load('repair_h07', ATLAS/'packages/data-ai-control/check_h07.py')
H8 = load('repair_h08', ATLAS/'packages/data-ai-control/check_h08.py')
X = load('repair_x01', ATLAS/'packages/data-ai-control/check_x01.py')
ORACLE = load('frozen_review_oracles', ROOT/'docs/reviews/saas-foundations-independent-review-20261014/audit_checks.py')
EXAMPLES = {e['id'].split(':')[-1]:e for e in json.loads((ATLAS/'foundations/examples.json').read_text())['examples']}
OBSERVED = {}

class CaseRepairs(unittest.TestCase):
    def test_h07_both_metrics_conflict_orders_and_late_identical_replay(self):
        first = H7.ROWS[1]
        for metric, expected in ((H7.current_completed,20000),(H7.first_completed,30000)):
            self.assertEqual(metric(H7.ROWS,'alpha',H7.D2), expected)
            for order in ((first,replace(first,cents=8100)),(replace(first,cents=8100),first)):
                with self.assertRaisesRegex(ValueError,'conflicting business content'):
                    metric(order,'alpha',H7.D2)
            repeated = replace(first,received=H7.stamp('2026-01-02T00:34:00'))
            self.assertEqual(metric(H7.ROWS+(repeated,),'alpha',H7.D2),expected)
        OBSERVED['IR-01'] = 'M1=20000, M2=30000; both reject both conflict orders; later identical reception harmless'

    def test_h08_conflicting_evidence_cannot_enter_score_or_window(self):
        first = H8.row('same',0,severity=40)
        repeated = dict(first,received_at='later')
        self.assertEqual(len(H8.deduplicate([first,repeated])),1)
        self.assertEqual(H8.score([first,repeated]),40)
        for change in (dict(first,severity=99),dict(first,principal='different')):
            for rows in ([first,change],[change,first]):
                for fn in (H8.deduplicate,H8.score,H8.windows):
                    with self.assertRaisesRegex(ValueError,'quarantine'):
                        fn(rows)
        OBSERVED['IR-02'] = 'identical replay one signal; content/identity-subject conflicts reject scoring and grouping in both orders'

    def test_x01_api_domains_and_no_charge_after_rejection(self):
        ledger = X.Ledger(':memory:')
        try:
            for bad in (2,-1,'1','true',None,1.0):
                with self.assertRaisesRegex(ValueError,'eligible'):
                    ledger.record('T','bad',400,bad,1)
            for bad in (-1,1.5,'2',None,True,2**63):
                with self.assertRaisesRegex(ValueError,'units'):
                    ledger.record('T','bad',bad,True,1)
            self.assertEqual(ledger.db.execute('SELECT COUNT(*) FROM usage').fetchone()[0],0)
            for i, valid in enumerate((True,False,0,1)):
                ledger.record('T',str(i),1,valid,1)
            self.assertEqual(ledger.totals('T',0,2),(4,2,Decimal('0.004')))
        finally:
            ledger.close()
        OBSERVED['IR-03'] = 'strict API domains reject before write; allowed boolean/0/1 inputs retain exact Decimal amount'

    def test_x01_database_constraints_survive_direct_insert(self):
        ledger = X.Ledger(':memory:')
        try:
            for units, eligible in ((1,2),(1,-1),(1,None),(1,'bad'),(-1,1),(1.5,1),(None,1)):
                with self.assertRaises(sqlite3.IntegrityError):
                    with ledger.db:
                        ledger.db.execute('INSERT INTO usage VALUES(?,?,?,?,?,?,?)',('T','bad','work',1,units,eligible,1))
            self.assertEqual(ledger.db.execute('SELECT COUNT(*) FROM usage').fetchone()[0],0)
        finally:
            ledger.close()

class FoundationRepairs(unittest.TestCase):
    def test_recovery_reads_database_and_kills_missing_writes(self):
        F.evaluate(EXAMPLES['recovery'])
        source = (ATLAS/'foundations/check_examples.py').read_text()
        inserts = "local.execute('INSERT INTO outbox VALUES(?,?)', (tenant, op))"
        confirms = "local.execute('UPDATE operations SET state=?,external_id=? WHERE tenant=? AND id=?', ('confirmed', effect[0], tenant, op))"
        dispatch = "dispatch = local.execute('SELECT o.tenant,o.operation,p.amount FROM outbox o JOIN operations p ON p.tenant=o.tenant AND p.id=o.operation WHERE o.tenant=? AND o.operation=?', (tenant,op)).fetchall()"
        mutants = {
            'missing_outbox_insert':(inserts,'pass  # injected lost handoff'),
            'missing_confirmation_update':(confirms,'pass  # injected lost confirmation'),
            'lost_outbox_after_commit':(dispatch,"local.execute('DELETE FROM outbox WHERE tenant=? AND operation=?', (tenant,op))\n        "+dispatch),
        }
        for name,(before,after) in mutants.items():
            self.assertEqual(source.count(before),1)
            module = types.ModuleType('mutant_'+name); module.__file__ = F.__file__
            exec(compile(source.replace(before,after),F.__file__,'exec'),module.__dict__)
            with self.assertRaises(AssertionError):
                module.evaluate(EXAMPLES['recovery'])
        OBSERVED['R1'] = {'actual_baseline_trace':F.recovery_model(EXAMPLES['recovery']['input'])[1], 'implementation_mutants_rejected':list(mutants)}

    def test_cache_extension_has_distinct_hits_and_scan_oracle(self):
        e = EXAMPLES['caches']; F.evaluate(e)
        variant = e['variants'][0]
        lru, lh = ORACLE.cache_scan(variant['input']['requests'],2,'LRU')
        lfu, fh = ORACLE.cache_scan(variant['input']['requests'],2,'LFU')
        self.assertEqual((lru,lh,sorted(lfu),fh),(['B','A'],2,['A','B'],3))
        self.assertEqual((variant['expected']['lru_misses'],variant['expected']['lfu_misses']),(5,4))
        OBSERVED['R2'] = {'LRU':[2,5],'LFU':[3,4],'sequence':variant['input']['requests']}

    def test_top_k_one_shot_stream_and_bounded_heap(self):
        class Once:
            def __init__(self): self.used=False
            def __iter__(self):
                if self.used: raise AssertionError('stream iterated twice')
                self.used=True
                yield from ((f'N{i:05}',i%17) for i in range(5000))
        expected = [n for n,s in sorted(((f'N{i:05}',i%17) for i in range(5000)),key=lambda r:(-r[1],r[0]))[:7]]
        maximum = [0]; push,replace_heap = F.heappush,F.heapreplace
        def checked(fn):
            def operation(heap,entry):
                result=fn(heap,entry);maximum[0]=max(maximum[0],len(heap));self.assertLessEqual(len(heap),7);return result
            return operation
        with patch.object(F,'heappush',checked(push)),patch.object(F,'heapreplace',checked(replace_heap)):
            self.assertEqual(F.top_k(Once(),7),expected)
        OBSERVED['R3_top_k'] = {'stream_records':5000,'retained_heap_max':maximum[0],'k':7}

    def test_graph_chain_and_union_do_not_rescan_node_set(self):
        class Node(str):
            calls=0
            def __hash__(self):
                Node.calls+=1
                return str.__hash__(self)
        nodes=[Node(str(i)) for i in range(2000)]
        edges=list(zip(nodes,nodes[1:])); Node.calls=0
        layers,order,cycle=F.graph_walk(nodes,edges,nodes[0]); graph_hashes=Node.calls
        self.assertEqual([v[0] for v in layers],nodes);self.assertEqual(order,nodes);self.assertEqual(cycle,[])
        self.assertLess(graph_hashes,100*len(nodes))
        Node.calls=0
        self.assertEqual(F.union_counts(nodes,edges),list(range(2000,0,-1)))
        union_hashes=Node.calls;self.assertLess(union_hashes,100*len(nodes))
        self.assertEqual(F.union_counts(['A','B','C'],[('A','B'),('B','A'),('B','C'),('A','C')]),[3,2,2,1,1])
        OBSERVED['R3_graph_union'] = {'chain_nodes':len(nodes),'graph_hash_calls':graph_hashes,'union_hash_calls':union_hashes,'limit_each':100*len(nodes),'scope':'finite operation-count regression, not a benchmark or universal complexity proof'}

    def test_ann_rejects_invalid_dimensions_candidates_and_k(self):
        for update, message in (({'query':[0]},'dimensions'),({'candidate_ids':['A','A']},'identities'),({'candidate_ids':['missing']},'identities'),({'k':0},'k must'),({'k':True},'k must'),({'query':[float('nan'),0]},'finite')):
            e=deepcopy(EXAMPLES['ann']);e['input'].update(update)
            with self.assertRaisesRegex(AssertionError,message):F.evaluate(e)
        F.evaluate(EXAMPLES['ann'])

    def test_confusion_counts_and_zero_denominators(self):
        for invalid in (-1,1.5,True,'1',None):
            with self.assertRaisesRegex(AssertionError,'nonnegative integers'):
                F.confusion_metrics(dict(tp=invalid,fn=0,fp=0,tn=0))
        self.assertEqual(F.confusion_metrics(dict(tp=0,fn=0,fp=0,tn=0)),dict(n=0,precision_fraction=None,recall_fraction=None,accuracy_fraction=None))
        self.assertEqual(F.confusion_metrics(dict(tp=0,fn=0,fp=0,tn=3)),dict(n=3,precision_fraction=None,recall_fraction=None,accuracy_fraction=[3,3]))

    def test_shortest_path_isolated_unreachable_invalid_and_parallel(self):
        self.assertEqual(F.dijkstra([],'A'),({'A':0},{}))
        for target, expected in [('A',{'distances':{'A':0,'B':None},'path':['A']}),('B',{'distances':{'A':0,'B':None},'path':[]})]:
            e=deepcopy(EXAMPLES['shortest-path']);e['input']={'nodes':['A','B'],'edges':[],'start':'A','target':target};e['expected']=expected
            F.evaluate(e)
        self.assertEqual(F.dijkstra([('A','B',3),('A','B',1),('B','A',0)],'A')[0],{'A':0,'B':1})
        for weight in (-1,float('nan'),float('inf'),True):
            with self.assertRaisesRegex(AssertionError,'finite nonnegative'):F.dijkstra([('A','B',weight)],'A')
        with self.assertRaisesRegex(AssertionError,'endpoint'):F.dijkstra([('A','B',1)],'A',['A'])
        with self.assertRaisesRegex(AssertionError,'source'):F.dijkstra([],'A',['B'])

    def test_all_three_node_nonnegative_graphs_against_simple_paths(self):
        arcs=[(a,b) for a in 'ABC' for b in 'ABC' if a!=b];count=0
        for options in product((None,0,1,2),repeat=len(arcs)):
            edges=[(a,b,w) for (a,b),w in zip(arcs,options) if w is not None]
            for start in 'ABC':
                expected={}
                for route,cost in ORACLE.paths(edges,start):
                    expected[route[-1]]=min(expected.get(route[-1],float('inf')),cost)
                self.assertEqual(F.dijkstra(edges,start,list('ABC'))[0],expected);count+=1
        self.assertEqual(count,12288)
        OBSERVED['R4'] = {'directed_graph_source_cases':count,'domain':'all non-self arcs on 3 nodes absent or weight 0/1/2; all sources; simple-path oracle','invalid_inputs':'ANN dimensions/candidates/k/nonfinite; confusion counts; graph negative/nonfinite/missing endpoints','valid_boundaries':'isolated source, unreachable target, zero metrics denominators, parallel edges and cycles'}

    def test_btree_balance_occupancy_and_partitions(self):
        self.assertEqual(F.btree_values(EXAMPLES['lookup']['input']['btree']),[2,5,10,12,17,20,23,29])
        unbalanced={'keys':[10],'children':[{'keys':[1]},{'keys':[20],'children':[{'keys':[15]},{'keys':[25]}]}]}
        for tree, message in ((unbalanced,'equal leaf depth'),({'keys':[10],'children':[{'keys':[]},{'keys':[20]}]},'occupancy'),({'keys':[1,2,3,4]},'occupancy'),({'keys':[10],'children':[{'keys':[11]},{'keys':[20]}]},'partition')):
            with self.assertRaisesRegex(AssertionError,message):F.btree_values(tree)
        self.assertEqual(F.btree_values({'keys':[]}),[])
        OBSERVED['R5']='original tree valid; unbalanced, underfilled, overfilled and wrong-partition trees rejected; empty root allowed'

    def test_prevalence_and_small_denominator_changes(self):
        F.evaluate(EXAMPLES['ai-eval'])
        metrics=F.confusion_metrics(dict(tp=9,fn=1,fp=198,tn=792))
        self.assertEqual(metrics['precision_fraction'],[9,207])
        self.assertAlmostEqual(9/207*100,4.3478260869565215)
        self.assertEqual(100/40,2.5);self.assertEqual(100/20,5)
        OBSERVED['R6']={'hypothetical_matrix':{'TP':9,'FN':1,'FP':198,'TN':792},'precision_fraction':[9,207],'accuracy_one_corrected_case_pp':2.5,'recall_one_recovered_positive_pp':5,'scope':'assumed conditional rates; no model inference'}

class EditorialRepairs(unittest.TestCase):
    def test_repaired_navigation_punctuation_and_pinned_sources(self):
        book=ROOT/'books/saas-engineering/packages'
        for path in book.glob('*/*.md'):
            prose=path.read_text()
            for residue in ('见 。','对应 。','。、','记录这组原创演算。',' 为上述构造例子，金额只用于教学。'):
                self.assertNotIn(residue,prose,str(path))
        v1=(book/'health-science/V01.md').read_text()
        for resource in ('servicerequest','observation','diagnosticreport'):
            self.assertIn(f'https://hl7.org/fhir/R5/{resource}.html',v1)
        self.assertNotIn('https://hl7.org/fhir/servicerequest.html',v1)
        v6=(book/'commerce-property/V06.md').read_text()
        self.assertIn('btree_gist',v6);self.assertIn('逐夜库存行',v6)
        OBSERVED['IR-05-08']='all chapter residue checks pass; three FHIR R5 URLs, scalar GiST prerequisite and locking alternative present'


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--output',type=Path);args=parser.parse_args()
    suite=unittest.TestSuite(unittest.defaultTestLoader.loadTestsFromTestCase(c) for c in (CaseRepairs,FoundationRepairs,EditorialRepairs))
    result=unittest.TextTestRunner(verbosity=2).run(suite)
    receipt={'status':'pass' if result.wasSuccessful() else 'fail','test_methods':result.testsRun,'observations':OBSERVED,'scope':__doc__}
    if args.output:args.output.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(receipt,ensure_ascii=False,indent=2))
    return not result.wasSuccessful()
if __name__=='__main__':raise SystemExit(main())
