#!/usr/bin/env python3
"""H07 deterministic teaching checks. No database, network, UI or provider execution."""
from collections import deque
from dataclasses import dataclass, replace
from datetime import datetime, timezone
from hashlib import sha256
import json


def stamp(value):
    return datetime.fromisoformat(value).replace(tzinfo=timezone.utc)


@dataclass(frozen=True)
class Revision:
    tenant: str
    order: str
    revision: int
    completed: datetime
    received: datetime
    status: str
    cents: int


START = stamp('2026-01-01T00:00:00')
END = stamp('2026-01-02T00:00:00')
D1 = stamp('2026-01-02T00:10:00')
D2 = stamp('2026-01-02T00:35:00')
ROWS = (
    Revision('alpha', 'A', 1, stamp('2026-01-01T23:50:00'), stamp('2026-01-01T23:51:00'), 'completed', 10000),
    Revision('alpha', 'B', 1, stamp('2026-01-01T23:55:00'), stamp('2026-01-02T00:20:00'), 'completed', 8000),
    Revision('alpha', 'C', 1, stamp('2026-01-02T00:00:00'), stamp('2026-01-02T00:01:00'), 'completed', 5000),
    Revision('alpha', 'D', 1, stamp('2026-01-01T12:00:00'), stamp('2026-01-01T12:01:00'), 'completed', 12000),
    Revision('alpha', 'A', 2, stamp('2026-01-01T23:50:00'), stamp('2026-01-02T00:30:00'), 'cancelled', 10000),
)


def select_latest(rows, tenant, cutoff):
    latest, versions = {}, {}
    for row in rows:
        if row.tenant != tenant or row.received > cutoff:
            continue
        identity = (row.tenant, row.order, row.revision)
        # A redelivery may have another received time; business content must agree.
        content = (row.completed, row.status, row.cents)
        if identity in versions and versions[identity] != content:
            raise ValueError('same revision identity has conflicting business content')
        versions[identity] = content
        key = (row.tenant, row.order)
        if key not in latest or row.revision > latest[key].revision:
            latest[key] = row
    return latest.values()


def current_completed(rows, tenant, cutoff, start=START, end=END):
    return sum(row.cents for row in select_latest(rows, tenant, cutoff)
               if row.status == 'completed' and start <= row.completed < end)


def first_completed(rows, tenant, cutoff):
    # M2 requires retained revision history; do not invoke on a current-row-only store.
    first = {}
    for row in rows:
        if row.tenant != tenant or row.received > cutoff or row.status != 'completed':
            continue
        key = (row.tenant, row.order)
        if key not in first or row.revision < first[key].revision:
            first[key] = row
    return sum(r.cents for r in first.values() if START <= r.completed < END)


def digest(plan):
    return sha256(json.dumps(plan, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def affected(start, derived_from):
    # Atlas edge direction is output -> input; build the reverse adjacency for impact.
    consumers = {}
    for output, inputs in derived_from.items():
        for input_name in inputs:
            consumers.setdefault(input_name, []).append(output)
    seen, pending = {start}, deque([start])
    while pending:
        for child in consumers.get(pending.popleft(), []):
            if child not in seen:
                seen.add(child)
                pending.append(child)
    return sorted(seen - {start})


def run():
    observations = []
    negative_controls = []

    def expect(name, actual, expected):
        if actual != expected:
            raise AssertionError(f'{name}: got {actual!r}, expected {expected!r}')
        observations.append({'name': name, 'observed': actual})

    expect('D1 current completed cents', current_completed(ROWS, 'alpha', D1), 22000)
    expect('D2 current completed cents', current_completed(ROWS, 'alpha', D2), 20000)
    expect('difference bridge cents', 22000 + 8000 - 10000, 20000)
    expect('right boundary excluded', current_completed((ROWS[2],), 'alpha', D2), 0)
    expect('right boundary belongs to next window', current_completed((ROWS[2],), 'alpha', D2, END, stamp('2026-01-03T00:00:00')), 5000)
    expect('duplicate B is one contribution', current_completed(ROWS + (ROWS[1], ROWS[1]), 'alpha', D2), 20000)
    delayed_old = replace(ROWS[0], received=stamp('2026-01-02T00:34:00'))
    expect('late old revision cannot revive A', current_completed(tuple(reversed(ROWS)) + (delayed_old,), 'alpha', D2), 20000)
    beta = replace(ROWS[0], tenant='beta', cents=990000)
    expect('same order ID in another tenant is excluded', current_completed(ROWS + (beta,), 'alpha', D2), 20000)
    expect('M2 first completed cents', first_completed(ROWS, 'alpha', D2), 30000)

    original_plan = {'tenant':'alpha','data':'D2','metric':'M1','window':'2026-01-01/2026-01-02 UTC', 'policy':'P1','code':'synthetic-v1'}
    approved_digest = digest(original_plan)
    changed_plan = dict(original_plan, metric='M2')
    expect('approved digest rejects changed metric', digest(changed_plan) == approved_digest, False)
    expect('fixed historical release recomputes D1', current_completed(ROWS, 'alpha', D1), 22000)

    manifest = {'current_orders':['orders'], 'daily_completed':['current_orders','eligible_regions'], 'refund_monitor':['current_orders'], 'operations_dashboard':['daily_completed']}
    expect('filter-only input impacts metric and dashboard', affected('eligible_regions', manifest), ['daily_completed','operations_dashboard'])
    expect('source change reaches both branches once', affected('orders', manifest), ['current_orders','daily_completed','operations_dashboard','refund_monitor'])

    # Negative controls demonstrate tempting implementations produce known wrong outcomes.
    append_only_total = sum(r.cents for r in ROWS if r.received <= D2 and r.status == 'completed' and START <= r.completed < END)
    if append_only_total == 20000:
        raise AssertionError('negative control unexpectedly agreed with M1')
    negative_controls.append({'name':'sum completed revisions without retracting superseded A', 'wrong_cents':append_only_total, 'correct_cents':20000})
    receive_time_total = sum(r.cents for r in select_latest(ROWS,'alpha',D2) if r.status == 'completed' and START <= r.received < END)
    if receive_time_total == 20000:
        raise AssertionError('receive-time negative control did not expose late B')
    negative_controls.append({'name':'assign business day by receipt time', 'wrong_cents':receive_time_total, 'correct_cents':20000})
    incomplete_graph = {'current_orders':['orders'],'daily_completed':['current_orders'],'operations_dashboard':['daily_completed']}
    expect('provider-only missing filter edge gives empty reachability', affected('eligible_regions', incomplete_graph), [])
    negative_controls.append({'name':'treat missing provider lineage edge as no impact','wrong_affected':[],'manifest_affected':['daily_completed','operations_dashboard']})
    conflict_rejected = False
    try:
        current_completed(ROWS + (replace(ROWS[1],cents=8100),),'alpha',D2)
    except ValueError:
        conflict_rejected = True
    expect('conflicting duplicate revision is rejected', conflict_rejected, True)
    negative_controls.append({'name':'same revision identity with different amount','observed':'rejected','reason':'immutable business identity violated'})

    print(json.dumps({
        'status':'pass',
        'scope':'Pure Python synthetic arithmetic, revision selection, dependency traversal and approval fingerprint checks only; no database, UI, Snowflake, BI API, load or end-to-end execution.',
        'assertions':len(observations),
        'negative_controls_detected':len(negative_controls),
        'observations':observations,
        'negative_controls':negative_controls,
        'unexecuted':['real authorization enforcement','persistent transaction boundaries','concurrent worker behavior','connector retention recovery','external conditional switching','browser feedback','performance goals'],
    }, ensure_ascii=False,indent=2))


if __name__ == '__main__':
    run()
