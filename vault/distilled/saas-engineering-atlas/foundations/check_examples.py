#!/usr/bin/env python3
"""Recompute synthetic examples; no network, services, installs, or output files.

SQLite below is an in-memory transaction model, not a process-crash or provider test.
Run from any directory with Python 3.9+; optional --self-test rejects damaged inputs.
"""
import argparse
from bisect import bisect_left
from collections import OrderedDict, deque
from copy import deepcopy
from fractions import Fraction
from graphlib import TopologicalSorter, CycleError
from heapq import heappush, heappop, heapreplace
from itertools import combinations, product, permutations
import json
from math import isfinite
from pathlib import Path
import sqlite3

HERE = Path(__file__).resolve().parent


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def equal(actual, expected, where):
    require(actual == expected, f'{where}: actual={actual!r}, expected={expected!r}')


class HeapEntry:
    """Worst retained candidate compares smallest: low score, then larger ID."""
    __slots__ = ('name', 'score')
    def __init__(self, name, score):
        self.name, self.score = name, score
    def __lt__(self, other):
        return self.score < other.score or (self.score == other.score and self.name > other.name)


def top_k(records, k):
    require(type(k) is int and k >= 0, 'nonnegative integer k')
    if k == 0:
        return []
    heap = []
    for name, score in records:
        entry = HeapEntry(name, score)
        if len(heap) < k:
            heappush(heap, entry)
        elif heap[0] < entry:
            heapreplace(heap, entry)
    return [e.name for e in sorted(heap, key=lambda e: (-e.score, e.name))]


def pair_sum(values, target):
    require(values == sorted(values), 'two pointers require sorted input')
    left, right, trace = 0, len(values) - 1, []
    while left < right:
        a, b = values[left], values[right]
        trace.append([a, b, a + b])
        if a + b == target:
            return [a, b], trace
        if a + b < target:
            left += 1
        else:
            right -= 1
    return None, trace


def prefix(values):
    result = [0]
    for value in values:
        result.append(result[-1] + value)
    return result


def rolling(values, width):
    require(0 < width <= len(values), 'window width')
    total = sum(values[:width])
    result = [total]
    for i in range(width, len(values)):
        total += values[i] - values[i - width]
        result.append(total)
    return result


def trie_matches(words, query):
    root = {}
    for word in words:
        node = root
        for letter in word:
            node = node.setdefault(letter, {})
        node[None] = True
    node = root
    for letter in query:
        if letter not in node:
            return []
        node = node[letter]
    result = []

    def collect(node, word):
        if None in node:
            result.append(word)
        for letter in sorted(k for k in node if k is not None):
            collect(node[letter], word + letter)

    collect(node, query)
    return result


def btree_values(node, minimum_degree=2):
    """Validate a B-tree with minimum degree t, then return its inorder values."""
    require(type(minimum_degree) is int and minimum_degree >= 2, 'B-tree minimum degree')
    values, leaf_depth = [], None
    def visit(current, depth, lower, upper, root=False):
        nonlocal leaf_depth
        keys, children = current['keys'], current.get('children', [])
        require(keys == sorted(set(keys)), 'B-tree node keys')
        minimum = (1 if children else 0) if root else minimum_degree - 1
        require(minimum <= len(keys) <= 2 * minimum_degree - 1, 'B-tree occupancy')
        require(all((lower is None or lower < key) and (upper is None or key < upper) for key in keys), 'B-tree partition')
        if not children:
            if leaf_depth is None:
                leaf_depth = depth
            require(depth == leaf_depth, 'B-tree equal leaf depth')
            values.extend(keys)
            return
        require(len(children) == len(keys) + 1, 'B-tree child count')
        for i, child in enumerate(children):
            visit(child, depth + 1, lower if i == 0 else keys[i-1], upper if i == len(keys) else keys[i])
            if i < len(keys):
                values.append(keys[i])
    visit(node, 0, None, None, True)
    return values


def btree_search(node, target):
    visited = []
    while node:
        visited.append(node['keys'])
        i = bisect_left(node['keys'], target)
        if i < len(node['keys']) and node['keys'][i] == target:
            return True, visited
        node = node['children'][i] if node.get('children') else None
    return False, visited


def graph_walk(nodes, edges, start):
    adj = {n: [] for n in nodes}
    require(start in adj, 'graph source must exist')
    for a, b in edges:
        require(a in adj and b in adj, 'graph endpoints must exist')
        adj[a].append(b)
    distance, queue, layers = {start: 0}, deque([start]), [[start]]
    while queue:
        a = queue.popleft()
        for b in adj[a]:
            if b not in distance:
                d = distance[a] + 1
                distance[b] = d
                if len(layers) == d:
                    layers.append([])
                layers[d].append(b)
                queue.append(b)
    color, order, cycle = {start: 1}, [start], []
    path, positions, stack = [start], {start: 0}, [(start, iter(adj[start]))]
    while stack:
        a, neighbors = stack[-1]
        try:
            b = next(neighbors)
        except StopIteration:
            stack.pop(); path.pop(); positions.pop(a); color[a] = 2
            continue
        if color.get(b, 0) == 0:
            color[b] = 1; order.append(b); positions[b] = len(path); path.append(b)
            stack.append((b, iter(adj[b])))
        elif color[b] == 1 and not cycle:
            cycle = path[positions[b]:] + [b]
    return layers, order, cycle


def dijkstra(edges, start, nodes=None):
    edges = list(edges)
    require(all(type(w) in (int, float) and isfinite(w) and w >= 0 for _, _, w in edges), 'Dijkstra requires finite nonnegative weights')
    known = set(nodes) if nodes is not None else {start} | {n for edge in edges for n in edge[:2]}
    require(start in known, 'source must be in node set')
    adj = {n: [] for n in known}
    for a, b, w in edges:
        require(a in known and b in known, 'edge endpoint outside node set')
        adj[a].append((b, w))
    dist, parent, heap = {start: 0}, {}, [(0, start)]
    while heap:
        d, a = heappop(heap)
        if d != dist[a]:
            continue
        for b, w in adj[a]:
            if d + w < dist.get(b, float('inf')):
                dist[b], parent[b] = d + w, a
                heappush(heap, (d + w, b))
    return dist, parent


def union_counts(nodes, edges):
    parent, size = {n: n for n in nodes}, {n: 1 for n in nodes}

    def find(n):
        while n != parent[n]:
            parent[n] = parent[parent[n]]
            n = parent[n]
        return n

    components = len(nodes)
    counts = [components]
    for a, b in edges:
        a, b = find(a), find(b)
        if a != b:
            if size[a] < size[b]:
                a, b = b, a
            parent[b], size[a] = a, size[a] + size[b]
            components -= 1
        counts.append(components)
    return counts


def knapsack(items, budget):
    require(budget >= 0 and all(x['cost'] > 0 for x in items), 'positive item costs')
    rows = [[0] * (budget + 1)]
    for item in items:
        prev = rows[-1]
        row = prev[:]
        for b in range(item['cost'], budget + 1):
            row[b] = max(prev[b], prev[b - item['cost']] + item['value'])
        rows.append(row)
    b, selected = budget, []
    for i in range(len(items), 0, -1):
        if rows[i][b] != rows[i - 1][b]:
            selected.append(items[i - 1]['id'])
            b -= items[i - 1]['cost']
    return rows, sorted(selected)


def all_subsets(items):
    for n in range(len(items) + 1):
        yield from combinations(items, n)


def brute_value(items, budget):
    return max(sum(x['value'] for x in s) for s in all_subsets(items)
               if sum(x['cost'] for x in s) <= budget)


def compatible(intervals):
    xs = sorted(intervals, key=lambda x: x[1])
    return all(a[2] <= b[1] for a, b in zip(xs, xs[1:]))


def greedy_intervals(intervals):
    chosen, end = [], float('-inf')
    for name, start, finish in sorted(intervals, key=lambda x: (x[2], x[0])):
        if start >= end:
            chosen.append(name)
            end = finish
    return chosen


def assign(eligible):
    jobs = list(eligible)

    def search(i, selected):
        if i == len(jobs):
            return selected.copy()
        job = jobs[i]
        for worker in eligible[job]:
            if worker not in selected.values():
                selected[job] = worker
                result = search(i + 1, selected)
                if result:
                    return result
                del selected[job]
        return None

    return search(0, {})


def caches(requests, capacity):
    require(capacity > 0, 'positive cache capacity')
    lru, lfu, hits = OrderedDict(), {}, [0, 0]
    for tick, key in enumerate(requests):
        if key in lru:
            hits[0] += 1
            lru.move_to_end(key)
        else:
            if len(lru) == capacity:
                lru.popitem(last=False)
            lru[key] = None
        if key in lfu:
            hits[1] += 1
            lfu[key] = (lfu[key][0] + 1, tick)
        else:
            if len(lfu) == capacity:
                del lfu[min(lfu, key=lambda k: lfu[k])]
            lfu[key] = (1, tick)
    return list(lru), sorted(lfu), hits


def recovery_model(inp):
    # Both databases live in this process. The external one is a deterministic fake.
    local, provider = sqlite3.connect(':memory:'), sqlite3.connect(':memory:')
    try:
        local.executescript('''CREATE TABLE objects(tenant TEXT, id TEXT, version INT,
            state TEXT, PRIMARY KEY(tenant,id));
            CREATE TABLE operations(tenant TEXT, id TEXT, amount INT, state TEXT,
            external_id TEXT, PRIMARY KEY(tenant,id));
            CREATE TABLE outbox(tenant TEXT, operation TEXT, PRIMARY KEY(tenant,operation));''')
        provider.execute('CREATE TABLE effects(tenant TEXT, operation TEXT, amount INT, external_id TEXT, PRIMARY KEY(tenant,operation))')
        tenant, obj, op, v, amount = (inp[k] for k in ('tenant', 'object', 'operation', 'expected_version', 'refund_amount'))
        with local:
            local.execute('INSERT INTO objects VALUES(?,?,?,?)', (tenant, obj, v, 'pending'))

        def submit(request_amount, version=v, fail=False):
            old = local.execute('SELECT amount FROM operations WHERE tenant=? AND id=?', (tenant, op)).fetchone()
            if old:
                require(old[0] == request_amount, 'same operation key changed parameters')
                return
            with local:
                changed = local.execute('UPDATE objects SET state=?,version=version+1 WHERE tenant=? AND id=? AND version=? AND state=?', ('cancelled', tenant, obj, version, 'pending')).rowcount
                require(changed == 1, 'stale version or invalid transition')
                local.execute('INSERT INTO operations VALUES(?,?,?,?,NULL)', (tenant, op, request_amount, 'awaiting_external'))
                if fail:
                    raise RuntimeError('synthetic failure before local commit')
                local.execute('INSERT INTO outbox VALUES(?,?)', (tenant, op))

        try:
            submit(amount, fail=True)
        except RuntimeError:
            pass
        equal(local.execute('SELECT version,state FROM objects').fetchone(), (v, 'pending'), 'rollback')
        equal(local.execute('SELECT COUNT(*) FROM operations').fetchone()[0], 0, 'atomic operation rollback')
        equal(local.execute('SELECT tenant,operation FROM outbox').fetchall(), [], 'atomic outbox rollback')
        submit(amount)
        submit(amount)  # replay same command
        object_row = local.execute('SELECT version,state FROM objects WHERE tenant=? AND id=?', (tenant,obj)).fetchone()
        operation_row = local.execute('SELECT amount,state,external_id FROM operations WHERE tenant=? AND id=?', (tenant,op)).fetchone()
        handoff = local.execute('SELECT tenant,operation FROM outbox WHERE tenant=? AND operation=?', (tenant,op)).fetchall()
        equal(object_row, (v+1,'cancelled'), 'committed object')
        equal(operation_row, (amount,'awaiting_external',None), 'committed operation')
        equal(handoff, [(tenant,op)], 'committed scoped outbox')
        trace = [dict(step='local_commit', object_version=object_row[0],
                      operation_state=operation_row[1], outbox_exists=bool(handoff))]
        try:
            submit(amount + 1)
        except AssertionError:
            pass
        else:
            raise AssertionError('changed parameters accepted')
        equal(local.execute('UPDATE objects SET version=version+1 WHERE tenant=? AND id=? AND version=?', (tenant, obj, v)).rowcount, 0, 'stale writer')
        dispatch = local.execute('SELECT o.tenant,o.operation,p.amount FROM outbox o JOIN operations p ON p.tenant=o.tenant AND p.id=o.operation WHERE o.tenant=? AND o.operation=?', (tenant,op)).fetchall()
        equal(dispatch, [(tenant,op,amount)], 'dispatch must consume durable handoff')
        with provider:
            provider.execute('INSERT INTO effects VALUES(?,?,?,?)', (*dispatch[0], 'R1'))
        # Response lost: local state knows nothing about provider success yet.
        with local:
            local.execute('UPDATE operations SET state=?', ('unknown',))
        observed_state = local.execute('SELECT state FROM operations WHERE tenant=? AND id=?', (tenant,op)).fetchone()[0]
        trace.append(dict(step='external_accept_response_lost', operation_state=observed_state))
        effect = provider.execute('SELECT external_id,amount FROM effects WHERE tenant=? AND operation=?', (tenant, op)).fetchone()
        require(effect and effect[1] == amount, 'reconciliation identity and amount')
        with local:
            local.execute('UPDATE operations SET state=?,external_id=? WHERE tenant=? AND id=?', ('confirmed', effect[0], tenant, op))
        # An ack can be lost; another delivery reconciles the same identity.
        with provider:
            provider.execute('INSERT OR IGNORE INTO effects VALUES(?,?,?,?)', (tenant, op, amount, 'R1'))
        count, total = provider.execute('SELECT COUNT(*),SUM(amount) FROM effects').fetchone()
        confirmed = local.execute('SELECT state,external_id FROM operations WHERE tenant=? AND id=?', (tenant,op)).fetchone()
        equal(confirmed, ('confirmed',effect[0]), 'persisted reconciliation')
        trace.append(dict(step='reconcile_same_operation', operation_state=confirmed[0], external_id=confirmed[1], effect_count=count))
        # Same display ID in another tenant must not resolve to this object/effect.
        equal(local.execute('SELECT * FROM objects WHERE tenant=? AND id=?', ('other-tenant', obj)).fetchall(), [], 'tenant lookup')
        return dict(refund_total=total, effect_count=count), trace
    finally:
        local.close()
        provider.close()


def confusion_metrics(x):
    tp, fn, fp, tn = (x[k] for k in ('tp', 'fn', 'fp', 'tn'))
    require(all(type(v) is int and v >= 0 for v in (tp,fn,fp,tn)), 'confusion counts must be nonnegative integers')
    n = tp+fn+fp+tn
    fraction = lambda numerator, denominator: [numerator, denominator] if denominator else None
    return dict(n=n, precision_fraction=fraction(tp,tp+fp), recall_fraction=fraction(tp,tp+fn), accuracy_fraction=fraction(tp+tn,n))


def evaluate(example):
    name = example['id'].split(':')[-1]
    x = example['input']
    if name == 'order':
        require(x['pending'] >= 0 and sum(x[k] for k in ('delivered', 'pending', 'cancelled')) == x['ordered'], 'quantity input')
        trace = [dict(action='cancel_pending', delivered=x['delivered'], pending=0,
                      cancelled=x['cancelled'] + x['pending'], refund_due=x['pending'] * x['unit_price'], refund_confirmed=0)]
        equal(trace, example['trace'], 'order trace')
        actual = dict(quantity_total=trace[0]['delivered'] + trace[0]['cancelled'], refund_due=trace[0]['refund_due'])
    elif name == 'lookup':
        buckets = {}
        for key, bucket in zip(x['keys'], x['teaching_buckets']):
            buckets.setdefault(bucket, []).append(tuple(key))
        for key, bucket in zip(x['keys'], x['teaching_buckets']):
            equal([k for k in buckets[bucket] if k == tuple(key)], [tuple(key)], 'full identity')
        i = bisect_left(x['sorted_days'], x['threshold'])
        found, visited = btree_search(x['btree'], x['btree_target'])
        require(found, 'B-tree target found')
        lower, upper = x['btree_range']
        actual = dict(lower_bound_value=x['sorted_days'][i] if i < len(x['sorted_days']) else None,
                      prefix_matches=trie_matches(x['trie_words'], x['prefix']),
                      btree_visited=visited,
                      btree_range_values=[v for v in btree_values(x['btree']) if lower <= v < upper])
    elif name == 'top-k':
        actual = dict(sorted_ids=[r[0] for r in sorted(x['records'], key=lambda r: (-r[1], r[0]))], top_ids=top_k(x['records'], x['k']))
    elif name == 'two-pointers':
        pair, trace = pair_sum(x['amounts'], x['target'])
        equal(trace, example['trace'], 'pointer steps')
        actual = dict(pair=pair)
    elif name == 'intervals':
        p = prefix(x['values']); a, b = x['range']
        actual = dict(prefix=p, rolling=rolling(x['values'], x['width']), range_sum=p[b] - p[a])
        for variant in example['variants']:
            values, budget = variant['values'], variant['budget']
            best = max((b - a for a in range(len(values) + 1) for b in range(a, len(values) + 1) if sum(values[a:b]) <= budget), default=0)
            equal(best, variant['expected_longest_length'], 'negative correction variant')
            left, total, bad_best = 0, 0, 0
            for right, value in enumerate(values):
                total += value
                while total > budget and left <= right:
                    total -= values[left]; left += 1
                bad_best = max(bad_best, right - left + 1)
            require(bad_best != best, 'counterexample must defeat nonnegative window')
    elif name == 'graph':
        layers, order, cycle = graph_walk(x['nodes'], x['edges'], x['start'])
        equal(cycle, [], 'shared descendant is not cycle')
        actual = dict(bfs_layers=layers, dfs_preorder=order)
        for variant in example['variants']:
            equal(graph_walk(x['nodes'], x['edges'] + [variant['added_edge']], x['start'])[2], variant['cycle'], 'cycle witness')
    elif name == 'shortest-path':
        require(x['target'] in x['nodes'], 'target must be in node set')
        distances, parents = dijkstra(x['edges'], x['start'], x['nodes'])
        path = []
        if x['target'] in distances:
            path = [x['target']]
            while path[-1] != x['start']:
                path.append(parents[path[-1]])
            path.reverse()
        actual = dict(distances={n: distances.get(n) for n in x['nodes']}, path=path)
    elif name == 'union-find':
        actual = dict(component_counts=union_counts(x['nodes'], x['unions']))
    elif name == 'dag':
        pred, durations = x['predecessors'], x['durations']
        ends = {}
        for node in TopologicalSorter(pred).static_order():
            ends[node] = max((ends[p] for p in pred[node]), default=0) + durations[node]
        makespans = []
        for order in permutations(durations):
            pos = {n: i for i, n in enumerate(order)}
            if any(pos[p] >= pos[n] for n in pred for p in pred[n]):
                continue
            finish, resource_free = {}, 0
            for n in order:
                ready = max((finish[p] for p in pred[n]), default=0)
                finish[n] = max(ready, resource_free if n in ('B', 'C') else 0) + durations[n]
                if n in ('B', 'C'):
                    resource_free = finish[n]
            makespans.append(max(finish.values()))
        actual = dict(earliest_finish=ends, one_shared_worker_finish=min(makespans))
    elif name == 'optimization':
        rows, selected = knapsack(x['items'], x['budget'])
        c = next(i for i in x['items'] if i['id'] == 'C')
        best_ratio = max(Fraction(i['value'], i['cost']) for i in x['items'] if i != c)
        actual = dict(value=rows[-1][-1], selected=selected, dp_rows=rows,
                      branch_c_upper_bound=float(c['value'] + (x['budget'] - c['cost']) * best_ratio))
    elif name == 'greedy':
        actual = dict(max_count_ids=greedy_intervals(x['intervals']))
        for variant in example['variants']:
            feasible = [s for s in all_subsets(x['intervals']) if compatible(s)]
            best = max(feasible, key=lambda s: sum(variant['values'][i[0]] for i in s))
            equal([i[0] for i in best], variant['best_ids'], 'weighted variant IDs')
            equal(sum(variant['values'][i[0]] for i in best), variant['best_value'], 'weighted variant value')
    elif name == 'backtracking':
        actual = dict(assignment=assign(x['eligible']))
        trace = example['trace']
        first = trace[0]['assign']
        equal([w for w in x['eligible']['J2'] if w not in first.values()], trace[0]['remaining_J2'], 'failed branch')
        equal(trace[1]['backtrack'], 'J1', 'backtrack location')
        equal(trace[2]['assign'], actual['assignment'], 'backtracking result trace')
    elif name == 'caches':
        lru, lfu, hits = caches(x['requests'], x['capacity'])
        actual = dict(lru_keys_old_to_new=lru, lfu_keys=lfu,
                      lru_hits=hits[0], lru_misses=len(x['requests'])-hits[0],
                      lfu_hits=hits[1], lfu_misses=len(x['requests'])-hits[1])
        for variant in example.get('variants', []):
            evaluate({**example, 'input': variant['input'], 'expected': variant['expected'], 'variants': []})
    elif name == 'bloom':
        bits = {b for key in x['inserted'] for b in x['hash_positions'][key]}
        require(all(0 <= b < x['m'] for b in bits), 'bit bounds')
        actual = dict(set_bits=sorted(bits), possibly_present_C=set(x['hash_positions']['C']) <= bits, possibly_present_D=set(x['hash_positions']['D']) <= bits)
    elif name == 'hll':
        registers = [0] * x['register_count']
        for h in x['hashes']:
            bucket, suffix = h.split('|')
            i, rank = int(bucket, 2), suffix.index('1') + 1
            registers[i] = max(registers[i], rank)
        actual = dict(registers=registers)
    elif name == 'ann':
        dimension = len(x['query'])
        require(dimension > 0 and all(len(v) == dimension for v in x['vectors'].values()), 'ANN vector dimensions must agree')
        require(all(type(v) in (int,float) and isfinite(v) for vector in [x['query'], *x['vectors'].values()] for v in vector), 'ANN finite numeric coordinates')
        require(type(x['k']) is int and 0 < x['k'] <= len(x['vectors']), 'ANN k must be within vector count')
        require(len(set(x['candidate_ids'])) == len(x['candidate_ids']) and set(x['candidate_ids']) <= x['vectors'].keys(), 'ANN candidate identities')
        def distance(k):
            return sum((a - b) ** 2 for a, b in zip(x['query'], x['vectors'][k]))
        exact = sorted(x['vectors'], key=lambda k: (distance(k), k))[:x['k']]
        approx = sorted(x['candidate_ids'], key=lambda k: (distance(k), k))[:x['k']]
        actual = dict(exact_top=exact, approximate_top=approx, recall=len(set(exact) & set(approx)) / x['k'])
    elif name == 'recovery':
        actual, trace = recovery_model(x)
        equal(trace, example['trace'], 'recovery stages')
    elif name == 'ai-eval':
        actual = confusion_metrics(x)
        for variant in example.get('variants', []):
            equal(confusion_metrics(variant['input']), variant['expected'], 'eval prevalence variant')
    else:
        raise AssertionError(f'unknown example {name}')
    equal(actual, example['expected'], example['id'])
    return actual


def properties():
    counts = {}
    count = 0
    for n in range(6):
        for values in product((-1, 0, 1), repeat=n):
            p = prefix(values)
            for a in range(n + 1):
                for b in range(a, n + 1):
                    equal(p[b]-p[a], sum(values[a:b]), 'prefix vs scan')
                    for c in range(b, n + 1):
                        equal(p[c]-p[a], (p[b]-p[a])+(p[c]-p[b]), 'interval partition')
            for width in range(1, n + 1):
                equal(rolling(values, width), [sum(values[i:i+width]) for i in range(n-width+1)], 'rolling vs scan')
            count += 1
    counts['signed_sequences_interval_oracle'] = count
    count = 0
    for scores in product(range(3), repeat=4):
        records = list(zip('ABCD', scores))
        oracle = [r[0] for r in sorted(records, key=lambda r: (-r[1], r[0]))]
        for order in permutations(records):
            for k in range(6):
                equal(top_k(order, k), oracle[:k], 'heap vs full order')
                count += 1
    counts['top_k_ties_orders_and_k'] = count
    count = 0
    for values in combinations(range(-3, 5), 4):
        for target in range(-6, 10):
            pair, _ = pair_sum(list(values), target)
            valid = [list(p) for p in combinations(values, 2) if sum(p) == target]
            require(pair in valid if valid else pair is None, 'two pointers vs pairs')
            count += 1
    counts['two_pointer_oracle'] = count
    count = 0
    for costs in product(range(1, 4), repeat=3):
        for values in product(range(1, 4), repeat=3):
            items = [dict(id=str(i), cost=c, value=v) for i, (c, v) in enumerate(zip(costs, values))]
            for budget in range(7):
                rows, selected = knapsack(items, budget)
                equal(rows[-1][-1], brute_value(items, budget), 'DP vs all subsets')
                require(sum(i['cost'] for i in items if i['id'] in selected) <= budget, 'reconstruction cost')
                equal(sum(i['value'] for i in items if i['id'] in selected), rows[-1][-1], 'reconstruction value')
                count += 1
    counts['knapsack_oracle'] = count
    # Every undirected graph on four vertices: union-find vs explicit reachability.
    pairs = list(combinations('ABCD', 2)); count = 0
    for flags in product((False, True), repeat=len(pairs)):
        edges = [p for p, yes in zip(pairs, flags) if yes]
        remaining, components = set('ABCD'), 0
        while remaining:
            start = min(remaining)
            reached = {v for layer in graph_walk(list('ABCD'), edges + [(b,a) for a,b in edges], start)[0] for v in layer}
            remaining -= reached; components += 1
        equal(union_counts(list('ABCD'), edges)[-1], components, 'union vs BFS components')
        count += 1
    counts['undirected_graphs'] = count
    # Independent Bellman-Ford relaxation oracle for a fixed topology and 81 weightings.
    count = 0
    for weights in product(range(3), repeat=4):
        edges = [(a,b,w) for (a,b),w in zip([('A','B'),('A','C'),('C','B'),('B','D')],weights)]
        expected = {n: float('inf') for n in 'ABCD'}; expected['A'] = 0
        for _ in range(3):
            for a,b,w in edges:
                expected[b] = min(expected[b],expected[a]+w)
        equal(dijkstra(edges, 'A')[0], expected, 'Dijkstra vs repeated relaxation')
        count += 1
    counts['nonnegative_weighted_graphs'] = count
    count = 0
    candidates = [(str(i),a,b) for i,(a,b) in enumerate(combinations(range(4),2))]
    for sample in all_subsets(candidates):
        best = max(len(s) for s in all_subsets(sample) if compatible(s))
        equal(len(greedy_intervals(sample)), best, 'greedy vs interval subsets')
        count += 1
    counts['interval_scheduling_oracle'] = count
    # Static cycles are errors; an empty ready set with running tasks is normal.
    sorter = TopologicalSorter({'A': [], 'B': ['A']}); sorter.prepare()
    equal(sorter.get_ready(), ('A',), 'first ready')
    equal(sorter.get_ready(), (), 'no additional ready while A running')
    require(sorter.is_active(), 'running task keeps graph active')
    sorter.done('A'); equal(sorter.get_ready(), ('B',), 'done unlocks B')
    try:
        tuple(TopologicalSorter({'A':['B'], 'B':['A']}).static_order())
    except CycleError:
        pass
    else:
        raise AssertionError('cycle accepted')
    counts['scheduler_boundary_scenarios'] = 2
    return counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    data = json.loads((HERE/'examples.json').read_text(encoding='utf-8'))
    examples = data['examples']
    results = {e['id']: evaluate(e) for e in examples}
    rejected = 0
    if args.self_test:
        for e in examples:
            broken = deepcopy(e)
            first = next(iter(broken['expected']))
            broken['expected'][first] = {'deliberately': 'wrong'}
            try:
                evaluate(broken)
            except AssertionError:
                rejected += 1
            else:
                raise AssertionError('damaged expected value accepted: ' + e['id'])
        require(rejected == len(examples), 'all expected mutations rejected')
    print(json.dumps(dict(status='pass', examples=len(results), example_results=results,
                         property_cases=properties(), rejected_mutations=rejected,
                         execution_scope='Python arithmetic/algorithms and in-memory SQLite model; no real provider, service crash, PostgreSQL, browser, load or AI execution'),
                     ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
