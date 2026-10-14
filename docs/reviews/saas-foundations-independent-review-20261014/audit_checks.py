#!/usr/bin/env python3
"""Independent finite oracles plus explicitly separate probes of the author's checker.

Standard library only. Prints JSON; never edits the reviewed package or calls services.
The independent calculations use only example inputs, not author algorithm functions.
Expected values are consulted only after the calculations have completed.
"""
from copy import deepcopy
from fractions import Fraction
from hashlib import sha256
from itertools import combinations, combinations_with_replacement, product
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[3]
PACKAGE = ROOT / 'vault/distilled/saas-engineering-atlas/foundations'
FROZEN = 'ee597ceaa3675f818746c6122353858872af17e4'


def subsets(xs):
    return [s for n in range(len(xs) + 1) for s in combinations(xs, n)]


def paths(edges, start):
    """Enumerate all simple paths; deliberately slow oracle, no BFS or Dijkstra."""
    pending, result = [([start], 0)], []
    while pending:
        path, cost = pending.pop()
        result.append((path, cost))
        for a, b, w in edges:
            if a == path[-1] and b not in path:
                pending.append((path + [b], cost + w))
    return result


def cache_scan(requests, capacity, policy):
    residents, frequency, last, hits = [], {}, {}, 0
    for tick, key in enumerate(requests):
        if key in residents:
            hits += 1
            frequency[key] += 1
        else:
            if len(residents) == capacity:
                victim = min(residents, key=lambda k: (frequency[k], last[k])
                             if policy == 'LFU' else (last[k],))
                residents.remove(victim)
            residents.append(key)
            frequency[key] = 1
        last[key] = tick
    return sorted(residents, key=last.get), hits


def independent(name, x):
    if name == 'order':
        assert all(x[k] >= 0 for k in ('ordered', 'delivered', 'pending', 'cancelled'))
        assert sum(x[k] for k in ('delivered', 'pending', 'cancelled')) == x['ordered']
        states = ['delivered'] * x['delivered'] + ['pending'] * x['pending'] + ['cancelled'] * x['cancelled']
        refunds = [x['unit_price'] for s in states if s == 'pending']
        states = ['cancelled' if s == 'pending' else s for s in states]
        return dict(quantity_total=len(states), refund_due=sum(refunds))
    if name == 'lookup':
        buckets = {}
        for key, bucket in zip(x['keys'], x['teaching_buckets']):
            buckets.setdefault(bucket, []).append(key)
        assert buckets[2] == [['A', 'O7'], ['A', 'O9']]
        def flatten(node):
            return node['keys'] + [v for c in node.get('children', []) for v in flatten(c)]
        node, visited = x['btree'], []
        while True:
            visited.append(node['keys'])
            if x['btree_target'] in node['keys']:
                break
            index = sum(k < x['btree_target'] for k in node['keys'])
            node = node['children'][index]
        lo, hi = x['btree_range']
        return dict(lower_bound_value=next((d for d in x['sorted_days'] if d >= x['threshold']), None),
                    prefix_matches=sorted({w for w in x['trie_words'] if w.startswith(x['prefix'])}),
                    btree_visited=visited,
                    btree_range_values=sorted(v for v in flatten(x['btree']) if lo <= v < hi))
    if name == 'top-k':
        ids = [r[0] for r in sorted(x['records'], key=lambda r: (-r[1], r[0]))]
        return dict(sorted_ids=ids, top_ids=ids[:x['k']])
    if name == 'two-pointers':
        solutions = [list(s) for s in combinations(x['amounts'], 2) if sum(s) == x['target']]
        assert len(solutions) == 1
        return dict(pair=solutions[0])
    if name == 'intervals':
        a, b = x['range']; values = x['values']; width = x['width']
        return dict(prefix=[sum(values[:i]) for i in range(len(values) + 1)],
                    rolling=[sum(values[i:i+width]) for i in range(len(values)-width+1)],
                    range_sum=sum(values[a:b]))
    if name == 'graph':
        ps = paths([(a, b, 1) for a, b in x['edges']], x['start'])
        distances = {n: min(c for p, c in ps if p[-1] == n) for n in x['nodes']}
        layers = [[n for n in x['nodes'] if distances[n] == d] for d in range(max(distances.values())+1)]
        pending, order = [x['start']], []
        while pending:
            n = pending.pop()
            if n not in order:
                order.append(n)
                pending.extend(reversed([b for a, b in x['edges'] if a == n]))
        return dict(bfs_layers=layers, dfs_preorder=order)
    if name == 'shortest-path':
        ps = paths(x['edges'], x['start'])
        nodes = sorted({n for a, b, w in x['edges'] for n in (a, b)})
        distances = {n: min(c for p, c in ps if p[-1] == n) for n in nodes}
        path = min((p for p, c in ps if p[-1] == 'D'),
                   key=lambda p: next(c for q, c in ps if q == p))
        return dict(distances=distances, path=path)
    if name == 'union-find':
        counts = []
        for k in range(len(x['unions'])+1):
            groups = [{n} for n in x['nodes']]
            for a, b in x['unions'][:k]:
                touching = [s for s in groups if a in s or b in s]
                groups = [s for s in groups if s not in touching] + [set.union(*touching)]
            counts.append(len(groups))
        return dict(component_counts=counts)
    if name == 'dag':
        names = list(x['durations']); duration = x['durations']; pred = x['predecessors']
        horizon = sum(duration.values()); earliest = {n: horizon for n in names}; shared = horizon
        # Exhaustive integer start times, not a topological scheduling implementation.
        for times in product(range(horizon+1), repeat=len(names)):
            start = dict(zip(names, times)); end = {n: start[n]+duration[n] for n in names}
            if any(end[p] > start[n] for n in names for p in pred[n]):
                continue
            for n in names:
                earliest[n] = min(earliest[n], end[n])
            if end['B'] <= start['C'] or end['C'] <= start['B']:
                shared = min(shared, max(end.values()))
        return dict(earliest_finish=earliest, one_shared_worker_finish=shared)
    if name == 'optimization':
        items, budget = x['items'], x['budget']
        def feasible(xs, b):
            return [s for s in subsets(xs) if sum(i['cost'] for i in s) <= b]
        def value(s):
            return sum(i['value'] for i in s)
        best = max(feasible(items, budget), key=value)
        rows = [[max(map(value, feasible(items[:i], b))) for b in range(budget+1)]
                for i in range(len(items)+1)]
        c = next(i for i in items if i['id'] == 'C')
        upper = Fraction(c['value']) + (budget-c['cost'])*max(Fraction(i['value'], i['cost']) for i in items if i != c)
        return dict(value=value(best), selected=sorted(i['id'] for i in best), dp_rows=rows,
                    branch_c_upper_bound=float(upper))
    if name == 'greedy':
        def fits(s):
            return all(a[2] <= b[1] or b[2] <= a[1] for a, b in combinations(s, 2))
        best = max((s for s in subsets(x['intervals']) if fits(s)), key=len)
        return dict(max_count_ids=[i[0] for i in best])
    if name == 'backtracking':
        jobs = list(x['eligible'])
        solutions = [dict(zip(jobs, ws)) for ws in product(*(x['eligible'][j] for j in jobs)) if len(set(ws)) == len(ws)]
        assert len(solutions) == 1
        return dict(assignment=solutions[0])
    if name == 'caches':
        lru, lh = cache_scan(x['requests'], x['capacity'], 'LRU')
        lfu, fh = cache_scan(x['requests'], x['capacity'], 'LFU')
        assert lh == fh  # property only of the original fixture
        return dict(lru_keys_old_to_new=lru, lfu_keys=sorted(lfu), hits=lh, misses=len(x['requests'])-lh)
    if name == 'bloom':
        bits = 0
        for key in x['inserted']:
            for position in x['hash_positions'][key]:
                bits |= 1 << position
        def query(key):
            return all(bits & (1 << b) for b in x['hash_positions'][key])
        return dict(set_bits=[b for b in range(x['m']) if bits & (1 << b)],
                    possibly_present_C=query('C'), possibly_present_D=query('D'))
    if name == 'hll':
        registers = []
        for bucket in range(x['register_count']):
            ranks = []
            for h in set(x['hashes']):
                prefix, suffix = h.split('|')
                if int(prefix, 2) == bucket:
                    ranks.append(len(suffix)-len(suffix.lstrip('0'))+1)
            registers.append(max(ranks, default=0))
        return dict(registers=registers)
    if name == 'ann':
        assert all(len(v) == len(x['query']) for v in x['vectors'].values())
        d = {k: sum((x['query'][j]-v[j])**2 for j in range(len(v))) for k, v in x['vectors'].items()}
        exact = sorted(d, key=lambda k: (d[k], k))[:x['k']]
        approx = sorted(x['candidate_ids'], key=lambda k: (d[k], k))[:x['k']]
        return dict(exact_top=exact, approximate_top=approx,
                    recall=float(Fraction(len(set(exact)&set(approx)), len(exact))))
    if name == 'recovery':
        # Abstract replay of one logical identity. No claim of DB or provider validation.
        effects = {}
        for event in ('send', 'response_lost', 'reconcile', 'redelivery'):
            key = (x['tenant'], x['operation'])
            if event in ('send', 'redelivery'):
                effects.setdefault(key, x['refund_amount'])
            elif event == 'reconcile':
                assert effects[key] == x['refund_amount']
        return dict(refund_total=sum(effects.values()), effect_count=len(effects))
    if name == 'ai-eval':
        labels = [(True, True)]*x['tp'] + [(True, False)]*x['fn'] + [(False, True)]*x['fp'] + [(False, False)]*x['tn']
        correct = sum(a == b for a, b in labels); tp = sum(a and b for a, b in labels)
        return dict(n=len(labels), precision_fraction=[tp, sum(b for a, b in labels)],
                    recall_fraction=[tp, sum(a for a, b in labels)], accuracy_fraction=[correct, len(labels)])
    raise ValueError(name)


def load_author(code):
    filename = PACKAGE / 'check_examples.py'
    namespace = {'__name__': 'independent_review_probe', '__file__': str(filename)}
    exec(compile(code, str(filename), 'exec'), namespace)
    return namespace


def author_suite(namespace, examples):
    for e in examples:
        namespace['evaluate'](e)
    rejected = 0
    for e in examples:
        broken = deepcopy(e)
        broken['expected'][next(iter(broken['expected']))] = {'deliberately': 'wrong'}
        try:
            namespace['evaluate'](broken)
        except AssertionError:
            rejected += 1
    return dict(examples_passed=len(examples), property_cases=namespace['properties'](),
                rejected_expected_mutations=rejected)


def boundary_differentials(author):
    """New domains, comparing author helpers with this review's finite oracles."""
    pairs_checked = 0
    for n in range(6):
        for values in combinations_with_replacement(range(-2, 3), n):
            for target in range(-5, 6):
                valid = [list(s) for s in combinations(values, 2) if sum(s) == target]
                answer, _ = author['pair_sum'](list(values), target)
                assert answer in valid if valid else answer is None
                pairs_checked += 1
    nodes = 'ABC'
    arcs = [(a, b) for a in nodes for b in nodes if a != b]
    graph_cases, graph_passed, isolated_errors = 0, 0, 0
    for states in product(range(4), repeat=len(arcs)):
        edges = [(a, b, state-1) for (a, b), state in zip(arcs, states) if state]
        for start in nodes:
            ps = paths(edges, start)
            expected = {n: min(c for p, c in ps if p[-1] == n) for n in {p[-1] for p, c in ps}}
            graph_cases += 1
            try:
                actual, parents = author['dijkstra'](edges, start)
            except KeyError:
                assert all(start not in (a, b) for a, b, w in edges)
                isolated_errors += 1
            else:
                assert actual == expected
                graph_passed += 1
    assert (graph_cases, graph_passed, isolated_errors) == (12288, 12240, 48)
    return dict(two_pointer_duplicate_empty_singleton_cases=pairs_checked,
                weighted_directed_three_node_cases=graph_cases,
                weighted_directed_cases_passed=graph_passed,
                isolated_source_errors=isolated_errors,
                graph_domain='all six directed non-self arcs absent or weight 0/1/2; all three sources; reachable distances only')


def main():
    data = json.loads((PACKAGE/'examples.json').read_text())['examples']
    results = {e['id']: independent(e['id'].split(':')[-1], deepcopy(e['input'])) for e in data}
    for e in data:
        assert results[e['id']] == e['expected'], (e['id'], results[e['id']], e['expected'])
    code = (PACKAGE/'check_examples.py').read_text()
    author = load_author(code)
    original = author_suite(author, data)
    mutants = {}
    edits = {
        'omit_outbox_insert': "local.execute('INSERT INTO outbox VALUES(?,?)', (tenant, op))",
        'omit_confirmation_update': "local.execute('UPDATE operations SET state=?,external_id=? WHERE tenant=? AND id=?', ('confirmed', effect[0], tenant, op))",
    }
    for name, statement in edits.items():
        assert code.count(statement) == 1
        ns = load_author(code.replace(statement, 'pass  # review-only mutation'))
        mutants[name] = author_suite(ns, data)
    by_name = {e['id'].split(':')[-1]: e for e in data}
    extended = deepcopy(by_name['caches']); extended['input']['requests'].append('A')
    extension = {}
    for policy in ('LRU', 'LFU'):
        keys, hits = cache_scan(extended['input']['requests'], 2, policy)
        extension[policy] = dict(keys=keys, hits=hits, misses=7-hits)
    try:
        author['evaluate'](extended)
    except AssertionError as err:
        extension['author_error'] = str(err)
    assert 'fixture both policies same hit count' in extension['author_error']
    malformed = deepcopy(by_name['ann']); malformed['input']['vectors']['A'].append(100)
    ann = author['evaluate'](malformed)
    invalid_eval = deepcopy(by_name['ai-eval'])
    invalid_eval['input'] = dict(tp=18, fn=-2, fp=4, tn=16)
    invalid_eval['expected'] = dict(n=36, precision_fraction=[18, 22], recall_fraction=[18, 16], accuracy_fraction=[34, 36])
    negative_counts = author['evaluate'](invalid_eval)
    try:
        author['dijkstra']([], 'A')
    except KeyError as err:
        isolated = f'KeyError: {err}'
    else:
        raise AssertionError('isolated-source reproducer no longer reproduces')
    malformed_tree = {'keys': [10], 'children': [{'keys': [5]}, {'keys': [20], 'children': [{'keys': [15]}, {'keys': [25]}]}]}
    tree_values = author['btree_values'](malformed_tree)
    # Additional manual-example calculations, independent of the main expected dictionary.
    feasible = [s for s in subsets(by_name['greedy']['input']['intervals'])
                if all(a[2] <= b[1] or b[2] <= a[1] for a, b in combinations(s, 2))]
    values = dict(A=1, B=100, C=1, D=1)
    weighted = max(feasible, key=lambda s: sum(values[i[0]] for i in s))
    assert [i[0] for i in weighted] == ['B', 'D']
    signed = [6, -3, 2]
    longest = max(b-a for a in range(4) for b in range(a, 4) if sum(signed[a:b]) <= 5)
    assert longest == 3
    recorded = json.loads((PACKAGE/'verification.json').read_text())
    hashes = {f: sha256((PACKAGE/f).read_bytes()).hexdigest() == h for f, h in recorded['artifact_sha256'].items()}
    assert all(hashes.values())
    report = dict(
        reviewed_sha=FROZEN, python=sys.version.split()[0], independent_examples=len(results),
        independent_results=results, author_suite=original, implementation_mutants=mutants,
        additional_differential_checks=boundary_differentials(author),
        top_k_one_shot_iterable=author['top_k'](iter(by_name['top-k']['input']['records']), 2),
        cache_extension=extension, malformed_ann_accepted=ann,
        negative_confusion_counts_accepted=negative_counts, isolated_start=isolated,
        unequal_leaf_depth_tree_accepted=tree_values,
        additional_calculations=dict(weighted_schedule=dict(ids=[i[0] for i in weighted], value=101),
                                     negative_window_longest=longest, queue_backlog_per_minute=(12-10)*60,
                                     unit_scale_yuan_10000_to_fen=10000*100,
                                     reconciliation_differences=dict(T1=100-60, T2=60-100),
                                     changed_fill=dict(filled=60+10, unresolved=40-10),
                                     illustrative_one_percent_prevalence=dict(tp=9, fn=1, fp=198, tn=792, precision=float(Fraction(9,207)))),
        recorded_hashes_match=hashes,
        limits=['finite examples and deterministic in-memory probes', 'no deployment, services, concurrency, process restart, performance, or model inference', 'author code used only in separately labeled checker probes'])
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
