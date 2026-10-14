# Foundations repair verification: R1–R6

The six original findings' concrete acceptance cases are repaired at public `lesPrivilege/Praxis` commit **`5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b`**. R1, R2, R3, R5 and R6 pass this bounded verification. R4's original cases also pass, but the repaired helpers' newly explicit finite-number input contract has a **low-severity residual numerical-domain failure**, R4-N1. Thus this verifier does not give unqualified acceptance to R4 over every input the new contract permits. The residual does not change any of the 18 published fixture answers or reopen the original dimension/count/isolated-source defects.

Date: 2026-10-14. Role: independent foundations repair verifier. Runtime model designation: **gpt-6-astra**, explicitly selected in the parent spawn call. No textbook authorship or repair editing in this task; no subagents. The review is bounded to R1–R6 from [the original review](../../saas-foundations-independent-review-20261014/README.md) and [repair dispositions](../../saas-atlas-repairs-20261014/dispositions.json), their implementations, affected reader prose, and example JSON. This is not a new whole-manuscript or original-source audit.

## Deliverables and reproduction

- [Independent probes](independent_probes.py) use only the Python standard library. Implementation mutations execute in separate in-memory modules, without editing the tested source. SQLite observations read the actual tables before connection close.
- [Machine-readable results](results.json) contain exact author command argument arrays, complete stdout/stderr, exit codes, all 18 independently recomputed fixture answers, per-ID evidence, source hashes, and the residual reproductions.

Run from the repository root:

```sh
python3 docs/reviews/saas-final-repair-verification-20261014/foundations/independent_probes.py --output docs/reviews/saas-final-repair-verification-20261014/foundations/results.json
```

**Expected exit code at the frozen SHA: 1**, because the probe reports R4-N1 as an unresolved failure. A machine-readable result file is still produced. This is not the original audit's convention of returning success when known defects reproduce.

The probe runs these relevant author entry points and preserves their outputs:

```sh
python3 vault/distilled/saas-engineering-atlas/foundations/check_examples.py --self-test
python3 vault/distilled/saas-engineering-atlas/foundations/validate_foundations.py
python3 -c "import runpy,unittest; d=runpy.run_path('docs/reviews/saas-atlas-repairs-20261014/regression_checks.py'); r=unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(d['FoundationRepairs'])); raise SystemExit(not r.wasSuccessful())"
```

All three author commands return 0: 18 examples, 18,462 finite property inputs/scenarios, 18 damaged-expected-answer controls; structural validation of 12 chapters/18 examples/40 sources; and all 10 `FoundationRepairs` methods, including the author's 12,288 directed graph/source comparisons. These are separate evidence sets; they are not summed into an inflated coverage claim. The root reviewer owns the unified runner and repository validation; neither was run by this subreview.

## Per-finding adjudication

| ID | Verdict | Independent evidence and reader check |
|---|---|---|
| R1 | Pass within the declared SQLite model | Observed final object, operation, outbox and fake-provider rows agree with the returned trace and one refund of 40. Seven implementation mutations fail: omitted handoff, omitted confirmation, omitted unknown state, wrong external ID, wrong dispatched amount, wrong outbox operation, and lost work after commit. An additional valid fault schedule writes the outbox before the synthetic exception and confirms rollback removes it. Chapter 9 now describes selected rows and failure-sensitive checks accurately. |
| R2 | Pass | A separate event-history/scan oracle agrees on all 13,120 sequence/capacity combinations: A/B/C sequences of lengths 0–7, capacities 1–4. Both the original fixture and seventh-A JSON variant evaluate successfully. Chapter 7's seventh request yields LRU 2 hits/5 misses and LFU 3 hits/4 misses, with the advertised resident sets. |
| R3 | Pass | 273 changed Top-K cases; a one-shot 20,000-record stream at k=5; only the retained five entries are sorted; maximum live candidate objects is seven, including transient old/new loop entries, consistent with O(k) storage. Code inspection establishes the retained heap bound. Graph checks cover all 512 directed graphs on three nodes including self-loops, each source (1,536 cases), and a 12,000-node chain. A separate set-merging oracle checks all intermediate counts for 500 random 20-union sequences. Chapters 3/4 distinguish helper work from the full-sort oracle and describe incremental layers/shared DFS path/component counter correctly. |
| R4 | Original repair cases pass; residual fail | Mixed ANN dimensions, invalid/duplicate candidate IDs, nonfinite/boolean coordinates, invalid k and all four invalid confusion counts reject. Zero-denominator results are null. A synchronous relaxation oracle verifies 3,000 route/target cases across 600 five-node multigraphs, including zero edges, cycles, self-loops, parallel edges and unreachable targets; reconstructed paths are checked against actual edges/costs. Original isolated-source and explicit node/target contracts pass. R4-N1 below remains under the newly stated finite-number domain. |
| R5 | Pass | Twenty valid trees spanning minimum degrees 2–6 and depths 0–3 yield the independently constructed inorder sequence. Unequal leaf depth, wrong child count, empty nonroot, ancestor partition violation, duplicate/unsorted separators and overfull nodes reject; empty root passes. Chapter 2 and the B-tree glossary now include equal leaf depth and nonroot occupancy, and explain why capacity alone does not imply logarithmic height. |
| R6 | Pass | Independently constructing 1,000 outcomes from 1% prevalence, 90% true-positive rate and 20% false-positive rate gives TP9/FN1/FP198/TN792, precision 9/207 ≈4.3478%, recall 9/10 and accuracy 801/1000. JSON agrees. Chapter 10 states the hypothetical stable-rate assumption and correctly gives 2.5 percentage-point accuracy and 5-point recall sensitivity. Glossary includes prevalence and undefined zero denominators. |

The 18 frozen fixtures also recompute independently: 17 use the already published independent review's arithmetic/enumeration oracles, explicitly reused and identified in the JSON; the cache fixture uses this review's new event-history oracle for the repaired schema. This reuse is not described as 18 newly authored oracles.

## R4-N1: finite input can produce a false unreachable route or wrong exact ANN answer

**Severity: low**, restricted to the changed helper's numeric contract. Original R4 requested semantic input guards and explicit unreachable representation. Those repairs work on their intended small examples, but chapter 4 now says edge weights accept finite nonnegative numbers, and chapter 8 says ANN coordinates are finite numbers, with no bound on intermediate calculations. The implementation validates inputs only.

Exact frozen locations:

- [`check_examples.py`](../../../../vault/distilled/saas-engineering-atlas/foundations/check_examples.py):184 validates weights; lines 197–199 compare and store `d + w` against infinity.
- Same file, lines 513 and 516–520: finite coordinate guard followed by unchecked subtraction/squaring and exact-rank labeling.
- [Chapter 4](../../../../books/saas-engineering/foundations/04-graphs-and-connectivity.md):31 states the finite/nonnegative and null-for-unreachable contracts.
- [Chapter 8](../../../../books/saas-engineering/foundations/08-approximation-and-search.md):41 states the finite coordinate domain.

Minimal route repro, after loading the module as `F`:

```python
F.dijkstra([('A','B',1e308), ('B','C',1e308)], 'A', ['A','B','C'])
# ({'A': 0, 'B': 1e308}, {'B': 'A'})
```

C is reachable by two finite positive-weight edges. Their float sum overflows to infinity, so `inf < inf` is false and C disappears from the returned distance dictionary. The example wrapper consequently labels C `null` with an empty path—the same representation reserved for genuinely unreachable nodes. An explicit numeric-domain rejection would avoid this false claim even if the teaching helper chooses not to support such magnitudes.

Minimal ANN input:

```python
{
    'query': [-1e308],
    'vectors': {'A': [1e308], 'B': [9e307]},
    'candidate_ids': ['A','B'],
    'k': 1,
}
```

All values pass the finite checks. `evaluate` accepts `exact_top=['A']`, `approximate_top=['A']`, `recall=1`, though B is strictly closer. Both derived differences overflow, their squared distances tie at infinity, and ID order chooses A. An independent `Fraction.from_float` calculation on the actual represented inputs confirms B precedes A.

The JSON additionally preserves an ordinary rounding boundary without overflow: query `[0.0,0.0]`, vectors A=`[100000000,1]`, B=`[100000000,0]`. Exact squared distances are 10000000000000001 and 10000000000000000, but floating arithmetic ties and chooses A. Changing only the query to integer `[0,0]` chooses B. This second observation is an ordinary, nonblocking precision limitation, not a separate blocker or an assertion that a finite-input check should promise exact real arithmetic.

A final bounded historical comparison isolates a newly introduced guard regression. For `dijkstra([('A','B',10**400)], 'A')`, both the original-review SHA `ee597ceaa3675f818746c6122353858872af17e4` and repair-base SHA `cd8d77b6166a6fc566f6aa09b4d9af3e11537408` return the exact integer distance `10**400` and parent `B→A`. At the frozen repair SHA, line 184 raises `OverflowError: int too large to convert to float` because `math.isfinite` converts the arbitrary-size integer to float. This regression was introduced by the guard; it is distinct from the already existing limits of floating-point derived arithmetic. It remains part of R4-N1 rather than a new finding. The probe and JSON retain all three source commands, source hashes and outcomes; historical code was loaded from Git objects without checkout or edits.

**Bounded resolution:** reject nonrepresentable derived distances/sums with an explicit domain error, or use exact/scaled arithmetic; document the floating-point tie/precision boundary. Keep unreachable results distinct from numeric failure. No production geometry library, arbitrary-precision redesign, or new live-service experiment is required for this narrow correction. The root adjudicator accepts R4 as failing on this low-severity residual while retaining the original acceptance cases as passed. Explicit representability rejection is a sufficient bounded repair; arbitrary-precision support is not required. The ordinary near-tie rounding observation is nonblocking.

## Coverage and remaining limits

No live provider, browser, broker, PostgreSQL, model inference, performance benchmark, file-durable recovery, process restart or concurrent worker experiment was run. Recovery remains a deterministic in-memory SQLite model with a fake external database. The `unknown` update is intentionally global in this one-operation fixture; these probes do not certify isolation of multiple simultaneous pending operations. The source remains unchanged.

All affected chapter changes, glossary rows, fixture JSON and dispositions were read. No external source was reopened; this verifies repair logic and local reader claims, not current provider documentation. The legacy foundations handoff still includes an unqualified “no unresolved factual issues” sentence; it is not accepted as evidence overriding either the independent findings or this residual. Current repair dispositions correctly say independent recheck was pending. No access denial or pending approval blocked this work. Only this assigned review directory was written; no checkout, commit, push or textbook modification was performed.
