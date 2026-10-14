#!/usr/bin/env python3
"""H09 synthetic invariants only: no network, database, UI, provider or real model."""
from collections import deque
from copy import deepcopy
from hashlib import sha256
from itertools import permutations
import json


def earliest_finish(durations, dependencies):
    successors = {task: [] for task in durations}
    remaining = {task: 0 for task in durations}
    for task, predecessors in dependencies.items():
        if task not in durations or any(p not in durations for p in predecessors):
            raise ValueError('unknown task')
        remaining[task] = len(predecessors)
        for p in predecessors:
            successors[p].append(task)
    ready = deque(t for t in durations if remaining[t] == 0)
    finish = {}
    while ready:
        task = ready.popleft()
        finish[task] = max((finish[p] for p in dependencies.get(task, [])), default=0) + durations[task]
        for nxt in successors[task]:
            remaining[nxt] -= 1
            if remaining[nxt] == 0:
                ready.append(nxt)
    if len(finish) != len(durations):
        raise ValueError('cycle')
    return finish


def exhaustive_path_oracle(durations, dependencies, target):
    """Independent tiny-fixture oracle enumerates all predecessor paths."""
    def totals(task, visiting):
        if task in visiting:
            raise ValueError('cycle')
        preds = dependencies.get(task, [])
        if not preds:
            return [durations[task]]
        return [durations[task] + value for p in preds
                for value in totals(p, visiting | {task})]
    return max(totals(target, set()))


def fingerprint(bundle):
    return sha256(json.dumps(bundle, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def freeze(bundle):
    # Toy fixture has explicit human-confirmed document_amount; no PDF parsing or AI.
    if bundle['document_amount'] != bundle['metadata_amount']:
        raise ValueError('document/metadata mismatch')
    return fingerprint(bundle)


def may_send(bundle, decision):
    return (decision['tenant'] == bundle['tenant'] and decision['status'] == 'approved'
            and decision['fingerprint'] == freeze(bundle))


class StaleWrite(ValueError):
    pass


class SyntheticERP:
    """In-memory atomic operation is an assumed interface, not an ERP integration."""
    def __init__(self):
        self.records = {}

    def write(self, key, generation, expected_version, payload):
        current = self.records.get(key)
        version = 0 if current is None else current['version']
        if current is not None:
            if generation == current['generation']:
                if payload == current['payload']:
                    return deepcopy(current)
                raise StaleWrite('same generation, different payload')
            if generation < current['generation']:
                raise StaleWrite('older export generation')
        if expected_version != version:
            raise StaleWrite('destination version conflict')
        self.records[key] = {'generation': generation, 'version': version + 1,
                             'payload': deepcopy(payload)}
        return deepcopy(self.records[key])


def claim_send(state):
    if state != 'queued':
        raise ValueError('already claimed or cancelled')
    return 'dispatching'


def cancel_local(state):
    if state != 'queued':
        raise ValueError('possibly dispatched: reconcile first')
    return 'cancelled'


def reconcile_signature(external_state, cancel_intent):
    if external_state == 'cancelled':
        return 'cancelled'
    if external_state == 'fully_signed':
        return 'disputed' if cancel_intent else 'fully_signed'
    if external_state in ('sent', 'partially_signed'):
        return 'cancel_pending' if cancel_intent else external_state
    return 'unknown'  # absence is not proof of never accepted


observations = []
def observe(name, assertion, detail):
    if not assertion:
        raise AssertionError(name)
    observations.append({'check': name, 'result': 'pass', 'observation': detail})


def rejects(fn, message):
    try:
        fn()
    except ValueError as exc:
        return message in str(exc)
    return False


def main():
    durations = {'P': 2, 'L': 3, 'F': 1, 'R': .5}
    deps = {'P': [], 'L': [], 'F': ['P'], 'R': ['F', 'L']}
    result = earliest_finish(durations, deps)
    oracle = exhaustive_path_oracle(durations, deps, 'R')
    observe('parallel-and-serial', result['R'] == oracle == 3.5 and sum(durations.values()) == 6.5,
            {'finish': result, 'critical_path_oracle': oracle, 'serial_hours': 6.5})
    high_duration = {**durations, 'E': 1}
    high_deps = {**deps, 'E': ['F', 'L'], 'R': ['E']}
    observe('extra-approval', earliest_finish(high_duration, high_deps)['R'] ==
            exhaustive_path_oracle(high_duration, high_deps, 'R') == 4.5,
            'E adds 1 hour on every path into R; earliest R=4.5')
    shorter = {**durations, 'F': .2}
    observe('noncritical-speedup', earliest_finish(shorter, deps)['R'] == 3.5,
            'F shortened from 1h to .2h; L still determines R=3.5')
    cycle = {**deps, 'P': ['R']}
    observe('cycle-negative', rejects(lambda: earliest_finish(durations, cycle), 'cycle'),
            'P→F→R→P rejected; retry cannot repair the configuration')
    # Independent exhaustive serial ordering of shared person's L/F; P uses another person.
    completions = []
    for order in permutations(['L', 'F']):
        clock = 0
        for task in order:
            clock = max(clock, 2 if task == 'F' else 0) + durations[task]
        completions.append(clock + .5)
    observe('shared-resource', min(completions) == 4.5,
            {'possible_finish_hours': completions, 'best': 4.5})

    bundle = dict(tenant='T1', contract='C100', version=7, policy='P1', schema='S1',
                  ordered_file_digests=['body-hash-7', 'annex-hash-7'],
                  document_amount=80000, metadata_amount=80000,
                  signers=['customer', 'company'])
    decision = dict(tenant='T1', status='approved', fingerprint=freeze(bundle))
    observe('exact-approved-input', may_send(bundle, decision), 'unchanged package can pass the synthetic gate')
    stale = deepcopy(bundle)
    stale['document_amount'] = 120000
    stale['ordered_file_digests'][0] = 'body-hash-8'
    observe('stale-metadata-negative', rejects(lambda: may_send(stale, decision), 'mismatch'),
            'changed document with old metadata cannot freeze, even though naive approved=true would pass')
    revised = {**stale, 'version': 8, 'metadata_amount': 120000}
    observe('old-approval-negative', not may_send(revised, decision),
            'consistent v8 still cannot reuse v7 approval fingerprint')
    reordered = {**bundle, 'ordered_file_digests': list(reversed(bundle['ordered_file_digests']))}
    observe('attachment-order-negative', not may_send(reordered, decision), 'signed attachment order is part of the approved input')
    other_tenant = {**bundle, 'tenant': 'T2'}
    observe('tenant-binding-negative', not may_send(other_tenant, decision), 'same C100 in T2 cannot use T1 decision')

    erp = SyntheticERP()
    key = ('T1', 'C100', 'ERP')
    original = erp.write(key, 1, 0, {'amount': 80000})
    # Simulate response loss: local status unknown, then read back external state.
    local_status = 'unknown'
    readback = deepcopy(erp.records[key])
    local_status = 'confirmed' if readback == original else local_status
    observe('unknown-result-recovery', local_status == 'confirmed' and len(erp.records) == 1,
            'in-memory readback confirms one existing effect; no second create')
    duplicate = erp.write(key, 1, 0, {'amount': 80000})
    observe('duplicate-generation', duplicate == original and original['version'] == 1 and duplicate['version'] == 1 and len(erp.records) == 1,
            'expected before=0, committed after=1, same generation replay still=1; no second version increment')
    erp.write(key, 2, 1, {'amount': 120000})
    stale_version = rejects(lambda: erp.write(key, 3, 0, {'amount': 130000}), 'version conflict')
    old_export = rejects(lambda: erp.write(key, 1, 0, {'amount': 80000}), 'older export')
    old_export_with_new_cas = rejects(lambda: erp.write(key, 1, 2, {'amount': 80000}), 'older export')
    observe('late-old-export-negative', stale_version and old_export and old_export_with_new_cas and
            erp.records[key] == {'generation': 2, 'version': 2, 'payload': {'amount': 120000}},
            'old generation cannot overwrite new value, even if caller refreshes expected destination version')
    observe('same-generation-different-payload-negative',
            rejects(lambda: erp.write(key, 2, 2, {'amount': 1}), 'different payload'),
            'one export generation cannot be rebound to another payload')
    erp.write(('T2', 'C100', 'ERP'), 1, 0, {'amount': 300})
    observe('erp-tenant-key', erp.records[key]['payload']['amount'] == 120000 and len(erp.records) == 2,
            'same contract number in two tenants creates two isolated synthetic keys')

    claimed = claim_send('queued')
    observe('dispatch-claim-negative', claimed == 'dispatching' and
            rejects(lambda: cancel_local(claimed), 'reconcile first') and
            rejects(lambda: claim_send(cancel_local('queued')), 'cancelled'),
            'claim wins => no local cancellation; cancellation wins => no worker claim')
    outcomes = {state: reconcile_signature(state, True)
                for state in ['sent', 'partially_signed', 'fully_signed', 'cancelled', 'absent']}
    observe('signature-terminal-recovery', outcomes == dict(sent='cancel_pending',
            partially_signed='cancel_pending', fully_signed='disputed', cancelled='cancelled', absent='unknown')
            and reconcile_signature('fully_signed', False) == 'fully_signed'
            and reconcile_signature('partially_signed', False) == 'partially_signed', outcomes)

    precision, recall, accuracy = 8/12, 8/10, (8+26)/40
    observe('synthetic-eval-counts', round(precision * 100, 1) == 66.7 and recall == .8 and accuracy == .85
            and 36/40 == .9 and round(34/36*100, 1) == 94.4 and 6/40 == .15,
            'fixed confusion counts and extraction denominators only; no model inference')
    print(json.dumps({'status': 'pass', 'checks': len(observations), 'observations': observations,
                      'scope': 'stdlib synthetic calculation and in-memory invariant fixtures only',
                      'not_executed': ['real provider API', 'database transactions/concurrency', 'browser E2E',
                                       'network failure injection', 'load tests', 'real AI model eval']},
                     ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
