#!/usr/bin/env python3
"""Independent bounded verification of IR-01–04 and WB-12. Standard library only.

Run from repository root. Mutant source and SQLite databases live in temporary
directories; the original implementation and historic reports remain untouched.
"""
import argparse
from dataclasses import replace
from decimal import Decimal
from fractions import Fraction
import hashlib
import importlib.util
import itertools
import json
import os
from pathlib import Path
import random
import sqlite3
import subprocess
import sys
import tempfile
import traceback

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[4]
PKG = ROOT / 'vault/distilled/saas-engineering-atlas/packages'
PATHS = {
    'h7': PKG/'data-ai-control/check_h07.py',
    'h8': PKG/'data-ai-control/check_h08.py',
    'x': PKG/'data-ai-control/check_x01.py',
    'h4': PKG/'people-service/checks-h04-h05.py',
}
COUNTS = {}
def check(value, label):
    if not value:
        raise AssertionError(label)
    COUNTS[label.split(':')[0]] = COUNTS.get(label.split(':')[0], 0) + 1

def rejects(kind, fn, label):
    try:
        fn()
    except kind:
        check(True, label)
    else:
        raise AssertionError(label + ': accepted invalid input')

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

def h7_contract(m):
    # An independent set-and-sort oracle for each snapshot, not the shared helper.
    def oracle(rows, cutoff, first=False):
        visible = [r for r in rows if r.tenant == 'alpha' and r.received <= cutoff]
        ids = {(r.order, r.revision) for r in visible}
        for key in ids:
            bodies = {(r.completed, r.status, r.cents) for r in visible if (r.order, r.revision) == key}
            if len(bodies) > 1:
                raise ValueError('conflicting identity')
        total = 0
        for order in {r.order for r in visible}:
            candidates = [r for r in visible if r.order == order and (not first or r.status == 'completed')]
            if not candidates:
                continue
            chosen = sorted(candidates, key=lambda r: r.revision, reverse=not first)[0]
            if chosen.status == 'completed' and m.START <= chosen.completed < m.END:
                total += chosen.cents
        return total
    original = m.ROWS
    replay = replace(original[1], received=m.D2)
    for rows in itertools.permutations(original + (replay,)):
        for cutoff, expected in ((m.D1, 22000), (m.D2, 20000)):
            check(m.current_completed(iter(rows), 'alpha', cutoff) == expected, 'IR-01: snapshot permutation M1')
            check(m.first_completed(iter(rows), 'alpha', cutoff) == oracle(rows, cutoff, True), 'IR-01: snapshot permutation M2')
    # All immutable fields; conflicts can be outside the window, non-completed,
    # or on an older revision superseded by an otherwise valid newer revision.
    for index in (0, 2, 4):
        base = original[index]
        for field, value in [('cents', base.cents + 1), ('status', 'pending'), ('completed', m.START)]:
            changed = replace(base, **{field: value})
            for rows in (original + (changed,), (changed,) + original):
                for fn in (m.current_completed, m.first_completed):
                    rejects(ValueError, lambda: fn(iter(rows), 'alpha', m.D2), 'IR-01: hidden collision rejected')
    for fn, expected in ((m.current_completed, 20000), (m.first_completed, 30000)):
        future = replace(original[1], cents=999, received=m.stamp('2026-01-02T00:36:00'))
        other = replace(original[1], tenant='beta', cents=999)
        check(fn(original + (future, other), 'alpha', m.D2) == expected, 'IR-01: scoped snapshot')
    rng = random.Random(20261014)
    for _ in range(160):
        rows = []
        for order in ('A', 'B', 'C'):
            for revision in range(1, rng.randrange(2, 6)):
                rows.append(replace(original[0], order=order, revision=revision,
                                    cents=rng.randrange(1000), status=rng.choice(['completed', 'cancelled']),
                                    completed=rng.choice([m.START, m.END, original[0].completed]),
                                    received=rng.choice([m.D1, m.D2])))
        rng.shuffle(rows)
        for fn, first in ((m.current_completed, False), (m.first_completed, True)):
            check(fn(iter(rows), 'alpha', m.D2) == oracle(rows, m.D2, first), 'IR-01: independent generated oracle')

def h8_contract(m):
    base = m.row('evt', 0, severity=40)
    replay = dict(base, received='later', received_at=999)
    for rows in ([base, replay], [replay, base]):
        check(len(m.deduplicate(iter(rows))) == 1, 'IR-02: metadata replay')
        check(m.score(iter(rows)) == 40, 'IR-02: metadata score')
    changes = {'minute':10, 'principal':'other-subject', 'family':'data', 'severity':99,
               'critical':True, 'ip':'other-egress', 'raw_digest':'new-digest'}
    for key, value in changes.items():
        conflict = dict(base, **{key:value})
        for rows in itertools.permutations([base, replay, conflict]):
            for fn in (m.deduplicate, m.score, m.windows):
                rejects(ValueError, lambda: fn(iter(rows)), 'IR-02: collision blocks trusted output')
    for key in ('tenant', 'connection'):
        other = dict(base, **{key:'other'})
        check(len(m.deduplicate([base, other])) == 2, 'IR-02: scoped identities')
        check(len(m.windows([base, other])) == 2, 'IR-02: scoped groups')
    evidence = [m.row('a',0), m.row('b',3,family='endpoint',severity=55),
                m.row('c',4,family='data',severity=35,critical=True)]
    for rows in itertools.permutations(evidence):
        check(m.score(rows) == 100, 'IR-02: recomputed rank')
        check(m.score([r for r in rows if r['family'] != 'endpoint']) == 90, 'IR-02: evidence subtraction')

def x_contract(m):
    with tempfile.TemporaryDirectory(prefix='case-ledger-') as tmp:
        path = Path(tmp)/'ledger.db'
        l = m.Ledger(path)
        try:
            l.record('A', 'existing', 7, True, 1)
            baseline = l.db.execute('SELECT * FROM usage').fetchall()
            bad_eligibility = ('1', 2, -1, '0', 'true', '', None, 1.0, 0.0, Decimal(1), [], {})
            bad_usage = (True, False, -1, 1.1, 0.0, '1', None, Decimal(1), 2**63)
            for run in ('new', 'existing'):
                for value in bad_eligibility:
                    rejects(ValueError, lambda: l.record('A',run,7,value,1), 'IR-03: API eligibility')
                for value in bad_usage:
                    rejects(ValueError, lambda: l.record('A',run,value,True,1), 'IR-03: API usage')
            check(l.db.execute('SELECT * FROM usage').fetchall() == baseline, 'IR-03: rejects preserve ledger')
            check(l.db.execute('SELECT count(*) FROM conflicts').fetchone()[0] == 0, 'IR-03: invalid API input is not billing conflict')
            for i, (units, eligible) in enumerate(itertools.product((0, 1, 999, 1000, 2**63-1), (False,True,0,1))):
                l.record('B',str(i),units,eligible,1)
            total = sum(units for units, eligible in itertools.product((0,1,999,1000,2**63-1),(False,True,0,1)))
            billable = total//2
            cost, charged, amount = l.totals('B',0,2)
            check((cost, charged, Fraction(amount)) == (total,billable,Fraction(billable,500)), 'IR-03: exact full-range money oracle')
            for units, eligibility in ((-1,1),(0.5,1),(None,1),(1,2),(1,-1),(1,None),(1,'bad'),(1,0.5)):
                def insert():
                    with l.db:
                        l.db.execute('INSERT INTO usage VALUES(?,?,?,?,?,?,?)', ('C','bad','work',1,units,eligibility,1))
                rejects(sqlite3.IntegrityError, insert, 'IR-03: raw SQL insert')
            for field, value in (('units',-1),('units',1.5),('units',None),('eligible',2),('eligible',None)):
                def update():
                    with l.db:
                        l.db.execute('UPDATE usage SET '+field+'=? WHERE tenant=?', (value,'A'))
                rejects(sqlite3.IntegrityError, update, 'IR-03: raw SQL update')
            l.close(); l = m.Ledger(path)
            check(l.totals('A',0,2) == (7,7,Decimal('0.014')), 'IR-03: reopened preserved original')
        finally:
            l.close()

def h4_contract(m):
    old = dict(tenant='T',operation='old',revision=1,active=False)
    new = dict(tenant='T',operation='new',revision=2,active=True)
    current = dict(revision=2,active=True)
    for schedule in sorted(set(itertools.permutations(('old','old','new','new')))):
        l, target = m.Ledger(':memory:'), m.AccessTarget()
        try:
            result = [m.dispatch_access(current, {'old':old,'new':new}[key], l,target) for key in schedule]
            check(result.count('stale_task') == 2, 'IR-04: stale deliveries blocked')
            check(target.active is True and target.revision == 2 and target.accepted_count == 1, 'IR-04: target final state')
            check(l.status('T','old') is None, 'IR-04: no stale intent created')
        finally:
            l.close()
    with tempfile.TemporaryDirectory(prefix='case-access-') as tmp:
        path = Path(tmp)/'access.db'
        l, target = m.Ledger(path), m.AccessTarget()
        try:
            check(m.dispatch_access(dict(revision=1,active=False),old,l,target,lose_reply=True) == 'unknown', 'IR-04: old accepted reply lost')
            check(m.dispatch_access(current,new,l,target) == 'confirmed', 'IR-04: later authorized state')
            l.close(); l=m.Ledger(path)
            check(m.dispatch_access(current,old,l,target) == 'unknown', 'IR-04: old retry remains unresolved')
            rejects(ValueError, lambda: m.dispatch_access(current,dict(old,active=True),l,target), 'IR-04: operation payload bound')
            check(l.reconcile('T','old',target) == 'confirmed', 'IR-04: historical effect reconciled')
            check(target.active is True and target.revision == 2 and target.accepted_count == 2, 'IR-04: reconciliation cannot replay stale revoke')
            rejects(ValueError, lambda: target.accept('T','late-direct',json.dumps({'revision':1,'active':False})), 'IR-04: target conditional version')
        finally:
            l.close()

def delivery_contract(m):
    answer=m.BufferedAnswer('T','T',5,['unverified'],17)
    rejects(ValueError, lambda: answer.emit(0,5,True), 'WB-12: authorized but unverified content blocked')
    # Vary each independent condition; author's revocation uses epoch+active
    # changes together, so a missing active or epoch check could escape that test.
    for same_tenant, active, epoch in itertools.product((False,True),(False,True),(4,5,6)):
        answer = m.BufferedAnswer('T','T' if same_tenant else 'U',5,['a','b','c'],17)
        rejects(ValueError, lambda: answer.emit(0,epoch,active), 'WB-12: unverified content blocked')
        answer.verified=True
        permitted = same_tenant and active and epoch==5
        if permitted:
            for index in (2,0,2,1):
                check(answer.emit(index,epoch,active) == ['a','b','c'][index], 'WB-12: authorized indexed delivery')
            check(answer.delivered_indices == {0,1,2} and answer.delivery_attempts == [2,0,2,1], 'WB-12: replay identity retained')
        else:
            rejects(PermissionError, lambda: answer.emit(0,epoch,active), 'WB-12: independent authorization condition')
            check(answer.delivery_attempts == [] and not answer.delivered_indices, 'WB-12: rejection has no delivery effect')
        check(answer.consumed_units == 17, 'WB-12: usage independent of rejection')
    for prefix in (0,1,3):
        answer=m.BufferedAnswer('T','T',5,['a','b','c'],17); answer.verified=True
        for index in range(prefix): answer.emit(index,5,True)
        for index in range(3):
            for epoch,active in ((5,False),(6,True),(6,False)):
                rejects(PermissionError, lambda: answer.emit(index,epoch,active), 'WB-12: new and replay after revocation')
        check(answer.delivered_indices == set(range(prefix)), 'WB-12: previous legal receipt preserved')
        check(answer.delivery_attempts == list(range(prefix)) and answer.consumed_units == 17, 'WB-12: complete or partial evidence preserved')
    answer=m.BufferedAnswer('T','T',5,['a'],17); answer.verified=True
    for index in (-1,1,True,0.0,'0',None):
        rejects(ValueError, lambda: answer.emit(index,5,True), 'WB-12: invalid sequence rejected')

def mutation_run(key, name, before, after, contract):
    source = PATHS[key].read_text()
    if source.count(before) != 1:
        raise AssertionError('mutation anchor must occur exactly once: '+name)
    with tempfile.TemporaryDirectory(prefix='case-mutant-') as tmp:
        path=Path(tmp)/'mutant.py'; path.write_text(source.replace(before,after))
        mutant=load('mutant_'+name,path)
        try:
            contract(mutant)
        except (AssertionError, ValueError) as error:
            return dict(name=name, status='killed', reason=str(error), change={'before':before,'after':after})
        raise AssertionError('surviving mutant: '+name)

def authors():
    commands = [[sys.executable,str(path.relative_to(ROOT))] for path in PATHS.values()]
    selections = [
        ('docs/reviews/saas-atlas-repairs-20261014/regression_checks.py',['CaseRepairs']),
        ('docs/reviews/saas-whole-book-repairs-20261014/regression_checks.py',[
            'CaseAndReaderRepairs.test_buffered_answer_revocation_before_first_chunk',
            'CaseAndReaderRepairs.test_revocation_between_chunks_preserves_prior_delivery',
            'CaseAndReaderRepairs.test_reconnect_replay_requires_current_authorization']),
    ]
    for path,names in selections:
        code = ('import importlib.util,sys,unittest; '
                f's=importlib.util.spec_from_file_location("selected_author",{path!r}); '
                'm=importlib.util.module_from_spec(s);sys.modules[s.name]=m;s.loader.exec_module(m); '
                f'suite=unittest.defaultTestLoader.loadTestsFromNames({names!r},m); '
                'r=unittest.TextTestRunner(verbosity=2).run(suite);sys.exit(not r.wasSuccessful())')
        commands.append([sys.executable,'-c',code])
    outputs=[]
    for command in commands:
        result=subprocess.run(command,cwd=ROOT,text=True,capture_output=True,
                              env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'},timeout=120)
        outputs.append(dict(argv=command,cwd='repository root',exit_code=result.returncode,stdout=result.stdout,stderr=result.stderr))
    return outputs

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,default=Path(__file__).with_name('results.json'));args=parser.parse_args()
    receipt={'reviewed_sha':'5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b',
             'actual_head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
             'scope':'IR-01, IR-02, IR-03, IR-04, WB-12 only; synchronous synthetic helpers and local SQLite; no live provider or global runner',
             'role':'Independent case repair verifier and critical adjudicator',
             'model':'gpt-6-astra, high reasoning; requested model confirmed by parent orchestration metadata',
             'reproduction_command':'python3 docs/reviews/saas-final-repair-verification-20261014/cases/probes.py',
             'source_sha256':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in PATHS.values()},
             'author_commands':authors(), 'independent':[], 'mutations':[]}
    modules={key:load('independent_'+key,path) for key,path in PATHS.items()}
    for identifier,key,contract in [('IR-01','h7',h7_contract),('IR-02','h8',h8_contract),('IR-03','x',x_contract),('IR-04','h4',h4_contract),('WB-12','x',delivery_contract)]:
        before_count=COUNTS.get(identifier,0)
        try:
            contract(modules[key]);receipt['independent'].append(dict(id=identifier,status='pass',assertions=COUNTS.get(identifier,0)-before_count))
        except Exception:
            receipt['independent'].append(dict(id=identifier,status='fail',traceback=traceback.format_exc()))
    mutants=[
        ('h7','drop_shared_identity_guard',"if versions[identity] != content:","if False:",h7_contract),
        ('h7','M2_bypasses_shared_guard',"for row in validated_revisions(rows, tenant, cutoff):\n        if row.status", "for row in (r for r in rows if r.tenant == tenant and r.received <= cutoff):\n        if row.status",h7_contract),
        ('h8','first_wins_conflicting_signal',"if prior != content:","if False:",h8_contract),
        ('h8','scoring_bypasses_identity_guard',"rows = deduplicate(rows)","rows = list(rows)",h8_contract),
        ('h8','windowing_bypasses_identity_guard',"for row in deduplicate(rows):","for row in rows:",h8_contract),
        ('x','eligibility_API_guard_removed',"if type(eligible) not in (bool, int) or eligible not in (0, 1):","if False:",x_contract),
        ('x','units_API_guard_removed',"if type(units) is not int or not 0 <= units <= 2**63 - 1:","if False:",x_contract),
        ('x','eligibility_SQL_guard_removed',"eligible INTEGER NOT NULL CHECK(typeof(eligible)='integer' AND eligible IN (0,1))","eligible INTEGER",x_contract),
        ('x','units_SQL_guard_removed',"units INTEGER NOT NULL CHECK(typeof(units)='integer' AND units >= 0)","units INTEGER",x_contract),
        ('h4','stale_task_gate_removed',"if (task['revision'], task['active']) != (current['revision'], current['active']):","if False:",h4_contract),
        ('h4','target_version_gate_removed',"if command['revision'] < self.revision:","if False:",h4_contract),
        ('x','verification_gate_removed',"if not self.verified:","if False:",delivery_contract),
        ('x','epoch_gate_removed',"and captured_epoch == current_epoch","and True",delivery_contract),
        ('x','membership_active_gate_removed',"and active and captured_epoch","and captured_epoch",delivery_contract),
        ('x','tenant_gate_removed',"return tenant == member_tenant and active", "return active",delivery_contract),
        ('x','replayed_chunk_skips_current_authority',"if not may_deliver(self.tenant, self.member_tenant, self.captured_epoch, current_epoch, active):", "if index not in self.delivered_indices and not may_deliver(self.tenant, self.member_tenant, self.captured_epoch, current_epoch, active):",delivery_contract),
    ]
    for key,name,before,after,contract in mutants:
        try:
            receipt['mutations'].append(mutation_run(key,name,before,after,contract))
        except Exception:
            receipt['mutations'].append(dict(name=name,status='fail',traceback=traceback.format_exc()))
    receipt['assertion_counts_including_mutant_prefixes']=COUNTS
    receipt['status']='pass' if (receipt['actual_head']==receipt['reviewed_sha'] and all(x['exit_code']==0 for x in receipt['author_commands']) and all(x['status']=='pass' for x in receipt['independent']) and all(x['status']=='killed' for x in receipt['mutations'])) else 'fail'
    args.output.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in receipt.items() if k in ('status','actual_head','independent','assertion_counts_including_mutant_prefixes')},indent=2))
    print('mutations:',len(receipt['mutations']),'killed:',sum(x['status']=='killed' for x in receipt['mutations']))
    return receipt['status']!='pass'

if __name__=='__main__': raise SystemExit(main())
