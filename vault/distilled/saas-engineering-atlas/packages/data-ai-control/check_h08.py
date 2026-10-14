#!/usr/bin/env python3
"""H08 synthetic arithmetic, authorization guards and local SQLite uniqueness.

No provider, model, UI, production detector or distributed exactly-once claim.
Intentional invalid inputs are checked for rejection; naive counterexamples are
reported separately from valid-path checks. Python standard library only.
"""
from collections import defaultdict
from fractions import Fraction
import json
from pathlib import Path
import sqlite3
import tempfile
import threading

RESULTS = []


def record(name, observation, category='invariant'):
    RESULTS.append({'name': name, 'category': category, 'observation': observation})


def deduplicate(rows):
    result = {}
    for row in rows:
        key = (row['tenant'], row['connection'], row['event'])
        result.setdefault(key, row)
    return list(result.values())


def windows(rows, width=10):
    buckets = defaultdict(list)
    for row in deduplicate(rows):
        buckets[(row['tenant'], row['connection'], row['principal'])].append(row)
    groups = []
    for key, events in sorted(buckets.items()):
        current, start = [], None
        for row in sorted(events, key=lambda x: (x['minute'], x['event'])):
            if start is None or row['minute'] >= start + width:
                if current:
                    groups.append((key, current))
                start, current = row['minute'], []
            current.append(row)
        groups.append((key, current))
    return groups


def score(rows):
    if not rows:
        raise ValueError('empty incident')
    families = len({row['family'] for row in rows})
    return min(100, max(row['severity'] for row in rows)
               + 10 * (families - 1) + 20 * any(row['critical'] for row in rows))


def row(event, minute, principal='U17', family='identity', severity=60,
        critical=False, tenant='T-A', ip='shared-egress'):
    return dict(event=event, minute=minute, tenant=tenant, connection='C1',
                principal=principal, family=family, severity=severity,
                critical=critical, ip=ip)


def authorize(grant, plan, now, run, step_state='prepared'):
    """A synthetic gate: authorization does not send or prove any side effect."""
    if grant is None:
        return 'missing_authorization'
    if step_state != 'prepared':
        return 'reconcile_or_skip'
    if grant['status'] not in {'granted', 'consumed'}:
        return 'inactive_authorization'
    if now >= grant['expires']:
        return 'expired'
    if grant['bound_run'] not in {None, run}:
        return 'different_run'
    for field in ['tenant', 'plan_hash', 'target', 'policy_version']:
        if grant[field] != plan[field]:
            return 'mismatch:' + field
    if not plan['current_role_allows'] or plan['superseded']:
        return 'current_authority_denied'
    return 'allow'


def eval_counts(table):
    if set(table) != {'escalate', 'routine', 'abstain'}:
        raise ValueError('three mutually exclusive prediction categories required')
    positives = sum(v[0] for v in table.values())
    negatives = sum(v[1] for v in table.values())
    if (positives, negatives) != (20, 80):
        raise ValueError('fixture denominator mismatch')
    tp, fp = table['escalate']
    return {
        'precision': Fraction(tp, tp + fp),
        'direct_recall': Fraction(tp, positives),
        'false_escalation_rate': Fraction(fp, negatives),
        'abstention_rate': Fraction(sum(table['abstain']), positives + negatives),
        'human_coverage': Fraction(tp + table['abstain'][0], positives),
        'human_queue': sum(table['escalate']) + sum(table['abstain']),
    }


def main():
    signals = [row('a1', 0), row('a1', 0),
               row('a2', 3, family='endpoint', severity=55),
               row('a3', 4, family='data', severity=35, critical=True)]
    b = [row('b' + str(i), i, principal='U22', severity=70) for i in range(1, 5)]
    unique = deduplicate(signals)
    assert len(unique) == 3 and score(unique) == score(signals) == 100
    record('duplicate_signal', '4 receptions -> 3 independent signals; score remains 100')
    assert (score(unique), score(b)) == (100, 70)
    assert sum(x['severity'] for x in b) > sum(x['severity'] for x in unique)
    record('ranking_counterexample', 'naive sum ranks B=280 over A=150; R1 ranks A=100 over B=70', 'counterexample')
    assert len(windows(unique + b)) == 2
    record('shared_ip_is_not_identity', 'same egress IP retains two scoped principals')
    groups = windows([row('t0', 0), row('t9', 9), row('t18', 18)])
    assert [[x['minute'] for x in g] for _, g in groups] == [[0, 9], [18]]
    record('anchored_window', '[0,9] and [18]; adjacent-gap chaining would incorrectly span 18 minutes', 'counterexample')
    boundary = windows([row('t0', 0), row('t10', 10)])
    assert len(boundary) == 2
    record('half_open_boundary', 'minute 10 enters a new window, never both')
    cross = windows([row('same', 0), row('same', 0, tenant='T-B')])
    assert len(cross) == 2 and len(deduplicate([row('same', 0), row('same', 0, tenant='T-B')])) == 2
    record('tenant_identity', 'identical source IDs in two tenants remain two independent objects')
    remaining = [x for x in unique if x['family'] != 'endpoint']
    assert score(remaining) == 90
    record('remove_weak_relation', 'removing endpoint evidence changes 100 to 90 with critical asset retained')

    plan = dict(tenant='T-A', plan_hash='P3-HASH', target='C1/U17',
                policy_version='R1', current_role_allows=True, superseded=False)
    grant = {k: plan[k] for k in ['tenant', 'plan_hash', 'target', 'policy_version']}
    grant.update(status='consumed', expires=300, bound_run='RUN3')
    assert authorize(grant, plan, 100, 'RUN3') == 'allow'
    record('valid_bound_authorization', 'consumed means bound to RUN3, not expired or reusable by other runs')
    rejections = [
        ('expired', grant, plan, 360, 'RUN3', 'prepared', 'expired'),
        ('revoked', {**grant, 'status': 'revoked'}, plan, 100, 'RUN3', 'prepared', 'inactive_authorization'),
        ('changed_target', grant, {**plan, 'target': 'C1/U22'}, 100, 'RUN3', 'prepared', 'mismatch:target'),
        ('changed_version', grant, {**plan, 'plan_hash': 'P4-HASH'}, 100, 'RUN3', 'prepared', 'mismatch:plan_hash'),
        ('other_tenant', grant, {**plan, 'tenant': 'T-B'}, 100, 'RUN3', 'prepared', 'mismatch:tenant'),
        ('old_role', grant, {**plan, 'current_role_allows': False}, 100, 'RUN3', 'prepared', 'current_authority_denied'),
        ('second_run', grant, plan, 100, 'RUN4', 'prepared', 'different_run'),
        ('unknown_not_replayable', grant, plan, 100, 'RUN3', 'unknown', 'reconcile_or_skip'),
        ('confirmed_not_replayable', grant, plan, 100, 'RUN3', 'confirmed', 'reconcile_or_skip'),
        ('high_score_without_authority', None, plan, 100, 'RUN3', 'prepared', 'missing_authorization'),
    ]
    for name, g, p, now, run, state, reason in rejections:
        actual = authorize(g, p, now, run, state)
        assert actual == reason, (name, actual, reason)
        record(name, 'rejected: ' + actual, 'expected_rejection')
    first_target, later_all_sessions = {'old-session'}, {'old-session', 'new-session'}
    assert later_all_sessions - first_target == {'new-session'}
    record('time_varying_retry_scope', 'repeating all-sessions operation would add new-session beyond first fixed target', 'counterexample')
    old_roles, current_roles = {'reader', 'finance-admin'}, {'reader'}
    assert old_roles & current_roles == {'reader'}
    assert old_roles - current_roles == {'finance-admin'}
    record('recovery_current_rights', 'restoring old snapshot would wrongly restore finance-admin; minimal current scope is reader', 'counterexample')

    # Real local SQLite contention, not a mocked uniqueness assertion.
    with tempfile.TemporaryDirectory(prefix='h08-local-check-') as directory:
        db = str(Path(directory) / 'ledger.sqlite')
        with sqlite3.connect(db) as conn:
            conn.execute('CREATE TABLE runs (tenant TEXT, plan TEXT, version INTEGER, request TEXT, UNIQUE(tenant,plan,version))')
        barrier = threading.Barrier(2)
        outcomes = []
        lock = threading.Lock()
        def contender(request):
            with sqlite3.connect(db, timeout=5) as conn:
                barrier.wait()
                try:
                    conn.execute('INSERT INTO runs VALUES (?, ?, ?, ?)', ('T-A', 'P3', 3, request))
                    conn.commit()
                    result = 'created'
                except sqlite3.IntegrityError:
                    result = 'duplicate_plan_rejected'
            with lock:
                outcomes.append(result)
        threads = [threading.Thread(target=contender, args=(name,)) for name in ['R-A', 'R-B']]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        with sqlite3.connect(db) as conn:
            count = conn.execute('SELECT COUNT(*) FROM runs').fetchone()[0]
        assert sorted(outcomes) == ['created', 'duplicate_plan_rejected'] and count == 1
        record('sqlite_concurrent_plan', 'two concurrent inserts -> one persisted run and one uniqueness rejection', 'local_storage')

    table = {'escalate': (16, 8), 'routine': (1, 67), 'abstain': (3, 5)}
    metrics = eval_counts(table)
    assert metrics == dict(precision=Fraction(2, 3), direct_recall=Fraction(4, 5),
                          false_escalation_rate=Fraction(1, 10), abstention_rate=Fraction(2, 25),
                          human_coverage=Fraction(19, 20), human_queue=32)
    assert metrics['human_queue'] * 6 == 192
    cost = table['routine'][0] * 100 + table['escalate'][1] * 3 + sum(table['abstain'])
    assert cost == 132
    record('synthetic_eval_arithmetic', '100 items; precision 16/24; recall 16/20; human coverage 19/20; 32 reviews; 192 min; hypothetical cost 132')
    invalid = {**table, 'routine': (1, 66)}
    try:
        eval_counts(invalid)
    except ValueError as err:
        record('missing_eval_item', 'rejected: ' + str(err), 'expected_rejection')
    else:
        raise AssertionError('missing denominator item was accepted')
    try:
        score([])
    except ValueError as err:
        record('empty_incident', 'rejected: ' + str(err), 'expected_rejection')
    else:
        raise AssertionError('empty incident accepted')
    summary = dict(status='pass', checks=len(RESULTS),
                   expected_rejections=sum(x['category'] == 'expected_rejection' for x in RESULTS),
                   counterexamples=sum(x['category'] == 'counterexample' for x in RESULTS),
                   scope='synthetic calculations and gates plus local SQLite uniqueness only; no provider/model/UI/load/distributed failure execution',
                   results=RESULTS)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
