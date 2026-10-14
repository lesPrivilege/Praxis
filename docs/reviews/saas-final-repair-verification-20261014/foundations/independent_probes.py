#!/usr/bin/env python3
"""Bounded independent R1–R6 verification. Only writes its optional JSON output.
No network/providers; implementation mutants execute in memory, never edit sources.
"""
import argparse
from copy import deepcopy
from fractions import Fraction
import gc
import hashlib
import importlib.util
import itertools
import json
from pathlib import Path
import random
import sqlite3
import subprocess
import sys
import types
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[4]
PACKAGE = ROOT / 'vault/distilled/saas-engineering-atlas/foundations'
SOURCE = PACKAGE / 'check_examples.py'
FROZEN = '5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b'

def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

F = load(SOURCE, 'final_foundations')
EX = {e['id'].split(':')[-1]: e for e in json.loads((PACKAGE/'examples.json').read_text())['examples']}

def rejects(fn):
    try:
        fn()
    except AssertionError as error:
        return str(error)
    raise AssertionError('invalid input or broken implementation was accepted')

def mutate(before, after):
    source = SOURCE.read_text()
    assert source.count(before) == 1, before
    module = types.ModuleType('independent_mutant')
    module.__file__ = str(SOURCE)
    exec(compile(source.replace(before, after), str(SOURCE), 'exec'), module.__dict__)
    return module

def integer_guard_regression():
    """One historical comparison requested for classification, not a fresh audit."""
    observations=[]
    relative=str(SOURCE.relative_to(ROOT))
    for revision in ('ee597ceaa3675f818746c6122353858872af17e4',
                     'cd8d77b6166a6fc566f6aa09b4d9af3e11537408', FROZEN):
        command=['git','show',revision+':'+relative]
        source=subprocess.check_output(command,cwd=ROOT,text=True)
        module=types.ModuleType('integer_guard_historical')
        module.__file__=str(SOURCE)
        exec(compile(source,relative,'exec'),module.__dict__)
        observation={'sha':revision,'source_command':command,
                     'source_sha256':hashlib.sha256(source.encode()).hexdigest()}
        try:
            distances,parents=module.dijkstra([('A','B',10**400)],'A')
            assert distances=={'A':0,'B':10**400} and parents=={'B':'A'}
            observation.update(status='returned',distance_B_matches_exact_integer=True,parents=parents)
        except OverflowError as error:
            assert revision==FROZEN
            observation.update(status='raised',exception_type=type(error).__name__,message=str(error))
        observations.append(observation)
    assert [x['status'] for x in observations]==['returned','returned','raised']
    return {'expression':"dijkstra([('A','B',10**400)], 'A')",'observations':observations,
            'classification':'New guard regression: math.isfinite converts the Python integer to float and raises OverflowError. Both pre-repair implementations computed this exact integer path correctly. Distinct from pre-existing floating-point range/rounding limits; part of R4-N1, not another finding.'}

def recovery():
    snapshots = []
    real_connect = sqlite3.connect
    class ObservedConnection(sqlite3.Connection):
        def close(self):
            tables = [r[0] for r in self.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")]
            snapshots.append({t: self.execute('SELECT * FROM '+t).fetchall() for t in tables})
            super().close()
    def connect(*args, **kwargs):
        return real_connect(*args, factory=ObservedConnection, **kwargs)
    with patch.object(F.sqlite3, 'connect', connect):
        actual, trace = F.recovery_model(EX['recovery']['input'])
    x = EX['recovery']['input']; tenant, op = x['tenant'], x['operation']
    assert snapshots[0]['objects'] == [(tenant,x['object'],x['expected_version']+1,'cancelled')]
    assert snapshots[0]['operations'] == [(tenant,op,x['refund_amount'],'confirmed','R1')]
    assert snapshots[0]['outbox'] == [(tenant,op)]
    assert snapshots[1]['effects'] == [(tenant,op,x['refund_amount'],'R1')]
    assert actual == {'refund_total':40,'effect_count':1}
    changes = {
      'omit_handoff': ("local.execute('INSERT INTO outbox VALUES(?,?)', (tenant, op))", 'pass'),
      'omit_confirmation': ("local.execute('UPDATE operations SET state=?,external_id=? WHERE tenant=? AND id=?', ('confirmed', effect[0], tenant, op))", 'pass'),
      'omit_unknown_state': ("local.execute('UPDATE operations SET state=?', ('unknown',))", 'pass'),
      'wrong_confirmation_external_id': ("('confirmed', effect[0], tenant, op)", "('confirmed', 'wrong-id', tenant, op)"),
      'wrong_dispatch_amount': ("(*dispatch[0], 'R1')", "(dispatch[0][0], dispatch[0][1], dispatch[0][2]+1, 'R1')"),
      'handoff_wrong_operation': ("local.execute('INSERT INTO outbox VALUES(?,?)', (tenant, op))", "local.execute('INSERT INTO outbox VALUES(?,?)', (tenant, op+'-wrong'))"),
      'lose_work_after_commit': ("dispatch = local.execute(", "local.execute('DELETE FROM outbox')\n        dispatch = local.execute("),
      'write_outbox_before_rollback_fault': ("if fail:\n                    raise RuntimeError", "if fail:\n                    local.execute('INSERT INTO outbox VALUES(?,?)', (tenant, op))\n                    raise RuntimeError"),
    }
    killed = {}
    for name, (before, after) in changes.items():
        mutant = mutate(before, after)
        if name == 'write_outbox_before_rollback_fault':
            assert mutant.evaluate(EX['recovery']) == actual
            killed[name] = 'valid stronger rollback schedule passes; outbox write is rolled back'
        else:
            killed[name] = rejects(lambda: mutant.evaluate(EX['recovery']))
    return {'status':'pass','persisted_rows_on_connection_close':snapshots,'trace':trace,'mutations':killed,
            'boundary':'in-memory SQLite commits/rollback and fake provider only; no restart, durable disk, concurrency or multi-tenant dispatch certification'}

def cache_oracle(requests, capacity, policy):
    resident = []
    history = []
    hits = 0
    for tick, key in enumerate(requests):
        if key in resident:
            hits += 1
        else:
            if len(resident) == capacity:
                def priority(k):
                    accesses = [t for t,item in history if item == k]
                    return (len(accesses), accesses[-1]) if policy == 'LFU' else (accesses[-1],)
                victim = min(resident, key=priority)
                resident.remove(victim)
                history = [(t,k) for t,k in history if k != victim]
            resident.append(key)
        history.append((tick,key))
    last = {key: max(t for t,k in history if k == key) for key in resident}
    return sorted(resident, key=last.get) if policy == 'LRU' else sorted(resident), hits

def caches():
    count=0
    for n in range(8):
        for seq in itertools.product('ABC',repeat=n):
            for cap in (1,2,3,4):
                a,ah = cache_oracle(seq,cap,'LRU'); b,bh=cache_oracle(seq,cap,'LFU')
                assert F.caches(seq,cap) == (a,b,[ah,bh])
                count+=1
    for e in [EX['caches'], *[{**EX['caches'],'input':v['input'],'expected':v['expected'],'variants':[]} for v in EX['caches']['variants']]]:
        assert F.evaluate(e) == e['expected']
    return {'status':'pass','independent_sequence_capacity_cases':count,'domain':'all A/B/C sequences lengths 0..7; capacity 1..4; resident LFU frequencies reset on eviction','seventh_A':EX['caches']['variants'][0]['expected']}

def resources_and_graphs():
    rng=random.Random(61014)
    count=0
    for n in range(21):
        records=[(f'N{i:03}',rng.randrange(-5,6)) for i in range(n)]
        for k in range(n+3):
            assert F.top_k(iter(records),k)==[r[0] for r in sorted(records,key=lambda r:(-r[1],r[0]))[:k]]
            count+=1
    live=maximum=0
    base=F.HeapEntry
    class TrackedEntry(base):
        def __init__(self,*args):
            nonlocal live,maximum
            super().__init__(*args); live+=1; maximum=max(maximum,live)
        def __del__(self):
            nonlocal live
            live-=1
    class Once:
        used=False
        def __iter__(self):
            assert not self.used
            self.used=True
            yield from ((f'N{i:06}',i%31) for i in range(20000))
    def bounded_sort(iterable,**kwargs):
        assert len(iterable)<=5
        return sorted(iterable,**kwargs)
    with patch.object(F,'HeapEntry',TrackedEntry),patch.object(F,'sorted',bounded_sort,create=True):
        result=F.top_k(Once(),5)
    assert result == [f'N{i:06}' for i in (30,61,92,123,154)]
    gc.collect(); assert maximum<=7 and live==0
    arcs=list(itertools.product('ABC',repeat=2)); graphs=0
    for flags in itertools.product((False,True),repeat=9):
        edges=[e for e,flag in zip(arcs,flags) if flag]
        for start in 'ABC':
            layers,order,cycle=F.graph_walk(list('ABC'),edges,start)
            reachable={start}; expected=[{start}]
            while True:
                new={b for a,b in edges if a in reachable}-reachable
                if not new: break
                expected.append(new);reachable|=new
            assert list(map(set,layers))==expected
            assert len(order)==len(set(order)) and set(order)==reachable
            has_cycle=False
            def walk(path):
                nonlocal has_cycle
                for a,b in edges:
                    if a==path[-1]:
                        if b in path: has_cycle=True
                        else: walk(path+[b])
            walk([start])
            assert bool(cycle)==has_cycle
            if cycle:
                assert cycle[0]==cycle[-1] and len(set(cycle[:-1]))==len(cycle)-1
                assert all((a,b) in edges for a,b in zip(cycle,cycle[1:]))
            graphs+=1
    nodes=list(range(12000)); edges=list(zip(nodes,nodes[1:]))
    layers,order,cycle=F.graph_walk(nodes,edges,0)
    assert layers==[[n] for n in nodes] and order==nodes and not cycle
    unions=0
    for _ in range(500):
        nodes=list(range(rng.randrange(1,9))); edges=[(rng.choice(nodes),rng.choice(nodes)) for _ in range(20)]
        groups=[{n} for n in nodes]; expected=[len(groups)]
        for a,b in edges:
            touching=[g for g in groups if a in g or b in g]
            groups=[g for g in groups if g not in touching]+[set.union(*touching)]
            expected.append(len(groups))
        assert F.union_counts(nodes,edges)==expected
        unions+=1
    return {'status':'pass','top_k_changed_cases':count,'stream_size':20000,'k':5,'maximum_live_heap_entries':maximum,'maximum_sort_input':5,'graph_source_cases_including_self_loops':graphs,'deep_chain_nodes':12000,'incremental_union_sequences':unions,'limits':'finite probes plus code inspection; not timing or universal complexity proof'}

def contracts():
    rejected={}
    for name,update in {
      'ANN_extra_coordinate':{'vectors':{**EX['ann']['input']['vectors'],'A':[1,0,100]}},
      'ANN_empty_dimension':{'query':[]}, 'ANN_missing_candidate':{'candidate_ids':['missing']},
      'ANN_duplicate_candidate':{'candidate_ids':['A','A']}, 'ANN_boolean_coordinate':{'query':[True,0]},
      'ANN_infinite_coordinate':{'query':[float('inf'),0]}, 'ANN_fractional_k':{'k':1.5},
      'ANN_excess_k':{'k':5},
    }.items():
        e=deepcopy(EX['ann']);e['input'].update(update)
        rejected[name]=rejects(lambda:F.evaluate(e))
    for key in ('tp','fn','fp','tn'):
        for value in (-1,0.5,True,'1',None):
            x=dict(tp=0,fn=0,fp=0,tn=0);x[key]=value
            rejected[f'confusion_{key}_{value!r}']=rejects(lambda:F.confusion_metrics(x))
    assert F.confusion_metrics(dict(tp=0,fn=0,fp=0,tn=0))==dict(n=0,precision_fraction=None,recall_fraction=None,accuracy_fraction=None)
    rng=random.Random(46014); routes=0
    for _ in range(600):
        nodes=list('ABCDE')
        edges=[(rng.choice(nodes),rng.choice(nodes),rng.randrange(5)) for _ in range(rng.randrange(15))]
        start=rng.choice(nodes)
        # Synchronous edge relaxation, no heap or author helper as oracle.
        dist={start:0}
        for _ in range(len(nodes)-1):
            old=dist.copy()
            for a,b,w in edges:
                if a in old: dist[b]=min(dist.get(b,float('inf')),old[a]+w)
        got,parents=F.dijkstra(edges,start,nodes)
        assert got==dist
        for target in nodes:
            path=[]
            if target in got:
                path=[target]
                while path[-1]!=start:
                    assert len(path)<=len(nodes)
                    path.append(parents[path[-1]])
                path.reverse()
                total=sum(min(w for u,v,w in edges if (u,v)==(a,b)) for a,b in zip(path,path[1:]))
                assert total==got[target]
            e=deepcopy(EX['shortest-path']);e['input']=dict(nodes=nodes,edges=edges,start=start,target=target)
            e['expected']=dict(distances={n:dist.get(n) for n in nodes},path=path)
            F.evaluate(e);routes+=1
    # Residual: finite input checks do not bound derived arithmetic.
    overflow_edges=[('A','B',1e308),('B','C',1e308)]
    overflow_dist=F.dijkstra(overflow_edges,'A',list('ABC'))[0]
    assert 'C' not in overflow_dist
    mathematical_distance=sum(Fraction.from_float(w) for _,_,w in overflow_edges)
    ann=deepcopy(EX['ann']);ann['input']=dict(query=[-1e308],vectors={'A':[1e308],'B':[9e307]},candidate_ids=['A','B'],k=1)
    ann['expected']=dict(exact_top=['A'],approximate_top=['A'],recall=1)
    accepted_wrong=F.evaluate(ann)
    exact_distances={k:sum((Fraction.from_float(a)-Fraction.from_float(b))**2 for a,b in zip(ann['input']['query'],vector)) for k,vector in ann['input']['vectors'].items()}
    exact_order=sorted(exact_distances,key=exact_distances.get)
    assert exact_order==['B','A']
    near_tie=deepcopy(EX['ann'])
    near_tie['input']=dict(query=[0.0,0.0],vectors={'A':[100000000,1],'B':[100000000,0]},candidate_ids=['A','B'],k=1)
    near_tie['expected']=dict(exact_top=['A'],approximate_top=['A'],recall=1)
    near_tie_actual=F.evaluate(near_tie)
    integer_control=deepcopy(near_tie)
    integer_control['input']['query']=[0,0]
    integer_control['expected']=dict(exact_top=['B'],approximate_top=['B'],recall=1)
    integer_actual=F.evaluate(integer_control)
    precision_note={'input':near_tie['input'],'floating_result':near_tie_actual,'exact_squared_distances':{'A':100000000**2+1,'B':100000000**2},'integer_query_control_result':integer_actual,'classification':'Nonblocking ordinary float near-tie rounding; numeric precision boundary, not a separate blocker or claim that finite checks imply exact real arithmetic.'}
    return {'status':'fail','original_R4_repairs':'pass','semantic_negative_cases':len(rejected),'rejection_messages':rejected,'random_route_target_cases':routes,'precision_boundary':precision_note,'integer_guard_regression':integer_guard_regression(),'residual':{'id':'R4-N1','severity':'low','reason':'Finite inputs overflow derived path or squared-distance arithmetic; reachable route becomes unreachable and ANN exact ranking can be wrong.','dijkstra':{'edges':overflow_edges,'actual':overflow_dist,'exact_reachable_C_distance_integer':str(mathematical_distance.numerator//mathematical_distance.denominator)},'ann':{'input':ann['input'],'accepted_result':accepted_wrong,'independent_exact_order':exact_order},'repair':'Reject nonrepresentable derived arithmetic with an explicit numeric-domain error, or use an exact/scaled calculation; preserve unreachable exclusively for absent paths. Avoid float conversion when checking finiteness of arbitrary-size integers, or explicitly reject out-of-domain magnitudes.'}}

def btrees_and_prevalence():
    valid=0
    def tree(t,depth,counter):
        keys=[];children=[]
        for i in range(t):
            if depth: children.append(tree(t,depth-1,counter))
            if i<t-1:
                keys.append(next(counter))
        return dict(keys=keys,**({'children':children} if depth else {}))
    invalid={}
    for degree in range(2,7):
        for depth in range(4):
            node=tree(degree,depth,iter(range(100000)))
            values=F.btree_values(node,degree)
            assert values==list(range(len(values)))
            valid+=1
    defects={
      'unequal_leaf_depth':{'keys':[10],'children':[{'keys':[1]},{'keys':[20],'children':[{'keys':[15]},{'keys':[25]}]}]},
      'child_count':{'keys':[10],'children':[{'keys':[1]}]},
      'empty_nonroot':{'keys':[10],'children':[{'keys':[]},{'keys':[20]}]},
      'ancestor_partition':{'keys':[10],'children':[{'keys':[5],'children':[{'keys':[1]},{'keys':[11]}]},{'keys':[20],'children':[{'keys':[15]},{'keys':[25]}]}]},
      'duplicate_separator':{'keys':[1,1]},'unsorted':{'keys':[2,1]},'overfull':{'keys':[1,2,3,4]},
    }
    for name,node in defects.items():invalid[name]=rejects(lambda:F.btree_values(node))
    assert F.btree_values({'keys':[]})==[]
    population=1000;positive=population//100;negative=population-positive
    tp=positive*9//10;fn=positive-tp;fp=negative//5;tn=negative-fp
    metrics=F.confusion_metrics(dict(tp=tp,fn=fn,fp=fp,tn=tn))
    assert metrics==dict(n=1000,precision_fraction=[9,207],recall_fraction=[9,10],accuracy_fraction=[801,1000])
    variant=EX['ai-eval']['variants'][0]
    assert metrics==variant['expected'] and variant['input']==dict(tp=tp,fn=fn,fp=fp,tn=tn)
    assert Fraction(100,40)==Fraction(5,2) and Fraction(100,20)==5
    return {'R5':{'status':'pass','valid_degree_depth_cases':valid,'invalid_tree_rejections':invalid},'R6':{'status':'pass','independently_constructed_matrix':variant['input'],'metrics':metrics,'precision_percent':float(Fraction(tp,tp+fp)*100),'one_corrected_prediction_accuracy_pp':2.5,'one_recovered_positive_recall_pp':5,'assumption':'conditional true-positive/false-positive rates held fixed, hypothetical arithmetic only'}}

def author_commands():
    commands=[
      ['python3','vault/distilled/saas-engineering-atlas/foundations/check_examples.py','--self-test'],
      ['python3','vault/distilled/saas-engineering-atlas/foundations/validate_foundations.py'],
      ['python3','-c',"import runpy,unittest; d=runpy.run_path('docs/reviews/saas-atlas-repairs-20261014/regression_checks.py'); r=unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(d['FoundationRepairs'])); raise SystemExit(not r.wasSuccessful())"],
    ]
    receipts=[]
    for command in commands:
        p=subprocess.run(command,cwd=ROOT,capture_output=True,text=True)
        receipts.append(dict(argv=command,exit_code=p.returncode,stdout=p.stdout,stderr=p.stderr))
        assert p.returncode==0, receipts[-1]
    return receipts

def independent_examples():
    # Previously published independent mathematical oracles, explicitly reused.
    oracle=load(ROOT/'docs/reviews/saas-foundations-independent-review-20261014/audit_checks.py','historical_independent_oracle')
    results={}
    for name,e in EX.items():
        if name=='caches':
            lru,lh=cache_oracle(e['input']['requests'],e['input']['capacity'],'LRU')
            lfu,fh=cache_oracle(e['input']['requests'],e['input']['capacity'],'LFU')
            actual=dict(lru_keys_old_to_new=lru,lfu_keys=lfu,lru_hits=lh,lru_misses=len(e['input']['requests'])-lh,lfu_hits=fh,lfu_misses=len(e['input']['requests'])-fh)
        else: actual=oracle.independent(name,e['input'])
        assert actual==e['expected'],(name,actual,e['expected'])
        results[name]=actual
    return {'status':'pass','count':len(results),'method':'Original independent audit oracles reused for 17 fixtures; new event-history oracle for repaired cache schema. New probes below independently challenge repaired domains.','results':results}

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path);args=parser.parse_args()
    assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()==FROZEN
    result={'frozen_sha':FROZEN,'role':'Independent foundations repair verifier','model':'gpt-6-astra (explicit parent spawn selection)','date':'2026-10-14','author_commands':author_commands(),'fixture_recomputation':independent_examples(),'R1':recovery(),'R2':caches(),'R3':resources_and_graphs(),'R4':contracts(),**btrees_and_prevalence()}
    result['status']='fail' if any(result[k]['status']=='fail' for k in ('R1','R2','R3','R4','R5','R6')) else 'pass'
    result['source_hashes']={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [SOURCE,PACKAGE/'examples.json',ROOT/'docs/reviews/saas-atlas-repairs-20261014/dispositions.json']}
    if args.output: args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'status':result['status'],'per_id':{k:result[k]['status'] for k in ('R1','R2','R3','R4','R5','R6')},'output':str(args.output) if args.output else None},indent=2))
    return 1 if result['status']=='fail' else 0

if __name__=='__main__':raise SystemExit(main())
