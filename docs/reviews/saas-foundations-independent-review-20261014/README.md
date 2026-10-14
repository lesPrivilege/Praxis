# Independent review: SaaS engineering foundations

The 18 original worked examples recompute correctly. The chapters generally preserve the assumptions that determine algorithm choice, distinguish calculations from business execution, and avoid presenting one provider's behavior as consensus. I found **three medium-severity companion/checking issues and three low-severity teaching or input-contract gaps**. No high-severity mathematical error was found in the frozen examples. The recovery checker needs repair before its traces can support all the local-state claims currently attached to them.

Reviewed repository: public `lesPrivilege/Praxis`. Frozen commit: **`ee597ceaa3675f818746c6122353858872af17e4`**, on `cloud/saas-atlas-foundations-recovery-20261014`. Review branch: `cloud/saas-foundations-independent-review-20261014`. Date: 2026-10-14. Reviewer: Codex (GPT-6), one independent reviewing agent; no subagents and no participation in the textbook's authorship in this task.

Only `vault/distilled/saas-engineering-atlas/foundations/` was substantively audited: all 12 chapters, 18 examples, terminology, curriculum, evidence, both checkers, recorded verification, changelog, and handoff. Findings cite that frozen version. No chapters or checkers were rewritten. Review artifacts live here; the additional `docs/reviews/README.md` is the directory index required by the repository's README rule.

## Deliverables and reproduction

- [Independent calculations and checker probes](audit_checks.py), standard library only. Independent example oracles do not call the author's algorithms. Expected dictionaries are compared only after calculation. Separately labeled probes then execute the frozen checker in memory, including two modified in-memory copies; they do not edit it.
- [Recorded calculation and probe results](check-results.json): all 18 examples, two surviving implementation mutants, cache extension, edge cases, and 19 matching recorded file hashes.
- [Source review](sources.md): all 40 evidence records, with the 15 authoritative originals selectively reopened distinguished from the other 25.
- [Validation receipt](validation.json): commands, outcomes, scope, and delivery constraints.

From the repository root:

```sh
python3 docs/reviews/saas-foundations-independent-review-20261014/audit_checks.py
python3 vault/distilled/saas-engineering-atlas/foundations/check_examples.py --self-test
python3 vault/distilled/saas-engineering-atlas/foundations/validate_foundations.py
python3 scripts/validate_repository.py
```

The review script exits successfully when the original numbers agree **and the reported checker defects reproduce**. That exit status is not a claim that the defects are fixed. Its finite oracles intentionally favor clarity over speed.

## Findings

Severity here means impact on this teaching package. **High** would change a central answer or encourage unsafe execution. **Medium** undermines a promised check or directly obstructs a prescribed learning exercise. **Low** is a bounded precondition or explanation gap. These are not production incident ratings.

### R1 — Medium: recovery traces assert facts that are never observed

**Locations:** [`check_examples.py`](../../../vault/distilled/saas-engineering-atlas/foundations/check_examples.py), lines 301, 311–312, 324–334, 460–462 and 568–579; [`handoff.md`](../../../vault/distilled/saas-engineering-atlas/foundations/handoff.md), lines 24–26. Related teaching promises: [`09-from-ui-to-recovery.md`](../../../vault/distilled/saas-engineering-atlas/foundations/09-from-ui-to-recovery.md), lines 23 and 29–36; [`10-verification-and-evals.md`](../../../vault/distilled/saas-engineering-atlas/foundations/10-verification-and-evals.md), lines 36–44.

**Evidence:** `outbox_exists=True` and the trace's operation states are literal values. The model never reads the outbox to dispatch the external effect, and the final trace never reads the confirmed operation row. Independently removing either of these statements from an in-memory copy leaves **all 18 examples, all 18,462 property scenarios, and all 18 expected-value rejection tests passing**:

```python
local.execute('INSERT INTO outbox VALUES(?,?)', (tenant, op))
local.execute('UPDATE operations SET state=?,external_id=? WHERE tenant=? AND id=?',
              ('confirmed', effect[0], tenant, op))
```

The first mutant has no durable handoff record but still reports one. The second leaves the local operation unknown but reports it confirmed. The provider count really is queried, so the one-effect arithmetic has evidence; local recovery completion does not have equivalent evidence. The SQLite/real-provider disclaimer is accurate and should remain, but it does not explain away a missing assertion inside the claimed SQLite scope.

**Repair:** build traces from selected database rows; assert the exact scoped outbox record after commit and its absence after rollback; drive fake dispatch from that record; select operation state/external ID after reconciliation. Add implementation mutations or fault schedules that omit the handoff, omit confirmation, and lose work after commit. These checks should fail under those changes. Update the handoff's unqualified “no unresolved factual issues” statement when reconciling this review.

### R2 — Medium: the cache checker rejects the chapter's own next-request exercise

**Locations:** [`07-reuse-and-invalidation.md`](../../../vault/distilled/saas-engineering-atlas/foundations/07-reuse-and-invalidation.md), line 27; [`check_examples.py`](../../../vault/distilled/saas-engineering-atlas/foundations/check_examples.py), lines 439–442; `examples.json`, `FDN:example:caches`; chapter 10, line 68.

**Evidence:** extend `A,A,B,A,C,B` with `A`, exactly as chapter 7 suggests. Independent replay gives LRU **2 hits / 5 misses** and LFU **3 hits / 4 misses**. The author's cache helper agrees (`hits=[2,3]`), but `evaluate` raises `fixture both policies same hit count` before consulting the expected answer. `examples.json` has only one shared hits/misses pair. No expected-answer update can represent the differing counts in the current evaluator.

**Repair:** record `lru_hits/lru_misses` and `lfu_hits/lfu_misses` separately. Retain equality only as an assertion about the original six-request fixture, not as a condition for evaluating any sequence. Include the seventh request as a successful changed-input exercise. This is a companion error; the chapter's prediction is correct.

### R3 — Medium: runnable helpers do not implement the chapter's stated resource bounds

**Locations:** [`check_examples.py`](../../../vault/distilled/saas-engineering-atlas/foundations/check_examples.py), lines 31–43, 136–146 and 169–185; [`03-order-and-intervals.md`](../../../vault/distilled/saas-engineering-atlas/foundations/03-order-and-intervals.md), line 23; [`04-graphs-and-connectivity.md`](../../../vault/distilled/saas-engineering-atlas/foundations/04-graphs-and-connectivity.md), lines 17, 25 and 41.

**Evidence:** `top_k` first builds a set of **all** IDs, sorts it, and stores a rank dictionary. For n distinct IDs this requires O(n) additional storage and O(n log n) worst-case comparison work before the heap scan. With fixed k=2 it therefore cannot illustrate O(n log k) time / O(k) extra space. It also consumes a one-shot iterable during rank construction before the second traversal.

There are similar instrumentation costs in `graph_walk`: it scans all discovered nodes separately for each BFS layer (quadratic on a chain), and recursively copies the full DFS path at each depth (quadratic total copying and live path-list storage on a chain). `union_counts` recomputes all representatives after every union, adding a full-node scan per edge. The chapter bounds for standard implementations are correct; the companion's extra work is not labeled at the point of use. These differences matter to a reader copying runnable code after learning that small k or graph traversal avoids large work.

**Repair:** either label these functions clearly as small-fixture trace/oracle utilities with their actual costs, or implement a heap comparator that handles the ID tie directly, append nodes to BFS layers on discovery, maintain one DFS path with push/pop, and decrement a component counter on successful union. Keep tests for answer correctness separate from claims about implementation complexity. No wall-clock benchmark is needed to establish the present mismatch.

### R4 — Low: changed inputs have unstated or unchecked domains

**Locations:** [`check_examples.py`](../../../vault/distilled/saas-engineering-atlas/foundations/check_examples.py), lines 152–164, 392–398, 454–465; [`10-verification-and-evals.md`](../../../vault/distilled/saas-engineering-atlas/foundations/10-verification-and-evals.md), lines 23 and 68; [`examples.json`](../../../vault/distilled/saas-engineering-atlas/foundations/examples.json), ANN and AI-eval records.

**Evidence:** changing ANN vector A from `[1,0]` to `[1,0,100]` leaves the original example passing unchanged: `zip` silently discards the extra coordinate. This is invalid mixed-dimensional input and should be rejected. Changing the confusion matrix to TP=18, FN=−2, FP=4, TN=16 and updating expected fractions is also accepted, including recall `18/16`; nonnegative integer counts are never required. Separately, the valid isolated-source call `dijkstra([], 'A')` raises `KeyError('A')`, although the source's distance is zero. The example wrapper also hardcodes destination D and cannot represent an unreachable-target answer.

**Repair:** distinguish frozen-fixture assumptions from editable input contracts. Validate vector dimensions and candidate IDs, nonnegative integer confusion counts, and zero-denominator behavior. Make source/destination/node set explicit for the route example, initialize isolated sources, and represent unreachable results deliberately. Add these semantic negatives and valid edge cases; replacing an expected value with a dictionary does not test any of them. The original published numerical answers remain correct.

### R5 — Low: B-tree height omits the balance and occupancy conditions

**Locations:** [`02-lookup-and-indexes.md`](../../../vault/distilled/saas-engineering-atlas/foundations/02-lookup-and-indexes.md), lines 29–31; [`check_examples.py`](../../../vault/distilled/saas-engineering-atlas/foundations/check_examples.py), lines 94–111; [`terms.md`](../../../vault/distilled/saas-engineering-atlas/foundations/terms.md), B-tree row.

**Evidence:** the text moves from “a page can hold about B branches” to logarithmic height. Page capacity alone does not force logarithmic height; balanced leaf depth and a lower occupancy/branching bound are needed. The cited [ODS definition](https://opendatastructures.org/ods-python/14_2_B_Trees.html) supplies both. The companion checks key ordering and partitions but accepts the probe tree whose left leaf is at depth 1 and right leaves at depth 2.

**Repair:** add a short explanation that B-trees maintain equal leaf depth and bounded nonroot occupancy, which is why the page-count bound follows. Call the checker an ordered multiway-tree traversal unless it also validates those invariants. The specific two-level teaching tree and its `[12,24)` answer are valid; this is a missing explanation, not a wrong range result.

### R6 — Low: the balanced AI-eval example needs a prevalence transfer warning

**Locations:** [`10-verification-and-evals.md`](../../../vault/distilled/saas-engineering-atlas/foundations/10-verification-and-evals.md), lines 56–60; [`terms.md`](../../../vault/distilled/saas-engineering-atlas/foundations/terms.md), precision/recall/accuracy row.

**Evidence:** the 20-positive/20-negative synthetic matrix correctly gives precision 81.8%, recall 90%, and accuracy 85%. It also implies a false-positive rate of 4/20=20%. The text covers leakage, fresh holdouts, human calibration, and small-sample uncertainty, but does not explain that precision from this balanced mixture does not transfer to a rare-positive workload.

As a teaching counterexample, **assume** the same conditional rates at 1% prevalence across 1,000 cases: TP=9, FN=1, FP=198, TN=792. Precision is then `9/207 ≈ 4.35%`. This is arithmetic under an explicit hypothetical rate-stability assumption, not a prediction of a model's behavior. Representative task distributions are also part of the cited [evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices).

**Repair:** add this or another small base-rate calculation, and distinguish a balanced diagnostic set from a production-weighted estimate. One corrected prediction changes this 40-case accuracy by 2.5 percentage points and a 20-positive recall by 5 points; showing that sensitivity would make the existing uncertainty instruction more usable without claiming a confidence interval from synthetic data.

## What the 18,462 comparisons actually establish

The recorded count is reproducible and correctly described as inputs/scenarios, not independent observations, code coverage, or a proof. About **90.8%** of the count is Top-K plus knapsack. It should not be read as equivalent depth across 18 examples. Some scenarios execute many assertions; conversely, permutations repeat the same ranking problem with different arrival orders.

| Family | Count and exact generated domain | Supported conclusion and limit |
|---|---|---|
| Prefix sums / fixed windows | 364 = sum of 3^n for n=0…5, values in −1/0/1 | Direct-sum comparison and partition identity over these sequences. Good empty/signed coverage. No mutable data, late events, deduplication, or numeric overflow. |
| Top-K | 11,664 = 3^4 × 4! × 6; four unique IDs, scores 0…2, all permutations, k=0…5 | Strong tie/order/k-boundary comparison against full sorting for this domain. No varying n, one-shot stream, or cost-model check. |
| Two pointers | 1,120 = C(8,4) × 16; four distinct sorted values from −3…4, targets −6…9 | A returned pair belongs to the brute-force solution set, or no solution exists. No equal-valued duplicate records, empty/singleton arrays, or invalid-order negative. |
| 0/1 knapsack | 5,103 = 3^3 × 3^3 × 7; three items, positive integer costs/values 1…3, budgets 0…6 | DP value equals subset optimum; selected cost is feasible. Generated checks do **not** assert that reconstructed selected value equals that optimum. No zero-cost, decimal, duplicate-ID, or negative-value contract checks. |
| Undirected connectivity | 64 = 2^6; all simple graphs on four vertices | Final DSU component count versus BFS reachability. BFS is itself a package helper. No independent oracle for its DFS branch, incremental intermediate counts, duplicates/deletions, or directed semantics. |
| Shortest path | 81 = 3^4 weightings of one four-edge topology | Dijkstra versus repeated relaxation, including zero weights. The topology is one reachable DAG; this is not 81 different topologies. No cycles, isolated source, unreachable target, parallel edges, or negative-edge rejection test in this family. |
| Interval scheduling | 64 subsets of six positive-duration intervals drawn from endpoints 0…3 | Cardinality agrees with feasible-subset enumeration. Weighted objective is checked separately by one fixture variant. No resource calendars or zero/negative duration input contract. |
| Topological boundaries | 2 hand-built scenarios | Python graphlib stays active with a running predecessor; a two-node cycle is rejected. Does not test a durable scheduler, resources, locks, or the four-task timing generalization. |

The **18 negative self-tests** each replace the first expected-result field with the same wrong-shaped dictionary. They demonstrate that equality checks reject obviously damaged expected answers. They do not mutate input preconditions, branches, transitions, parameter binding, tenant authorization, or failure schedules. R1 provides concrete surviving implementation mutations. This does not make the original checks worthless: their numerical fixtures and finite differential comparisons are useful, provided the claims stay at that level.

This review additionally compared the author's helpers with independent finite oracles on **2,772** two-pointer cases containing empty/singleton inputs and duplicate values (lengths 0–5, values −2…2, targets −5…5); all passed. It also checked **12,288** directed weighted graph/source cases: every non-self arc on three vertices absent or weighted 0/1/2, with each vertex as source. Simple-path enumeration agreed on 12,240 cases; the remaining 48 all raised the isolated-source error in R4. These are separate review domains, not additions to the author's 18,462 claim. They add coverage of nonnegative directed cycles while still proving nothing about all graph sizes or failure schedules.

`validate_foundations.py` is a structural validator: counts, IDs, nonempty metadata, URL shape, chapter-source membership, and local link existence. It does not establish truth of sources, source-read history, correctness of prose calculations, link-anchor validity, or instructional completeness. The `read-scoped` and `unresolved_factual_gaps=[]` fields remain author attestations. All 19 recorded artifact hashes match the frozen contents; no mismatch was found.

## Independent calculation coverage

Every row below comes from the input data and an independent calculation. The shared expected dictionaries are used for final comparison only. Detailed values are in `check-results.json`.

| Example suffix | Independently obtained answer / method |
|---|---|
| `order` | Expand three unit service obligations: 2 delivered + 1 cancelled; refund due 1×40=40, confirmation remains separate. |
| `lookup` | Linear threshold scan gives 12; string-prefix scan gives car/cart/cat; tree route `[10,20]→[12,17]`; flatten/filter gives 12,17,20,23. Collision bucket holds both distinct full keys. |
| `top-k` | Direct total order E,A,C,D,B; first two E,A. |
| `two-pointers` | Enumerate all index-distinct pairs: unique answer 4+7=11. Manual pointer sums 10,12,10,11 agree with the trace. |
| `intervals` | Independently sum each prefix/window: `[0,2,3,6,6,10]`, `[6,4,7]`, range 4. Brute-force `[6,−3,2]` gives longest length 3; the nonnegative-window reasoning fails. |
| `graph` | Enumerate simple paths for shortest hop counts: A / B,C / D / E. Explicit stack preorder A,B,D,E,C. Added E→B closes B→D→E→B; sharing D alone is not a cycle. |
| `shortest-path` | All simple paths give A=0, B=3, C=1, D=4 minutes; minimizing route A,C,B,D. |
| `union-find` | Merge explicit sets, not parent pointers: component counts 4,3,2,1. |
| `dag` | Exhaustive integer start-time schedules give earliest finishes 2,5,6,7; enforcing B/C nonoverlap gives makespan 10. This matches 7 as the unconstrained critical-path lower bound. |
| `optimization` | Enumerate subsets separately for each table cell: all four DP rows match; A+B costs 5, value 7. C branch relaxation is 5+1×(3/2)=6.5. |
| `greedy` | Enumerate nonoverlapping subsets: A,C,D (three jobs). Weighted variant: B,D, value 101. |
| `backtracking` | Cartesian product of eligible workers, filter distinct workers: only J1=乙, J2=甲. First J1=甲 leaves J2 no worker. |
| `caches` | List/frequency/last-access scan reproduces LRU C,B; LFU A,B; each 2 hits/4 misses for the original six requests. |
| `bloom` | Integer bit-mask union sets 1,4,6; C passes as a false positive, D fails. No empirical false-positive-rate measurement is claimed. |
| `hll` | Group unique supplied hashes by bucket; count leading zeros independently: registers 3,0,4,0. No cardinality estimate or error bound is validated by four registers. |
| `ann` | Squared distances 1,4,9,16; exact A,B; candidate rerank A,C; overlap 1/2. Candidate generation is stipulated, not a tested ANN index. |
| `recovery` | Abstract same-identity replay yields one effect totaling 40. This independently checks the example's arithmetic and identity model, not SQLite durability or real-provider execution. Database assertions were separately challenged in R1. |
| `ai-eval` | Expand 40 labeled outcomes and recount: TP18/FN2/FP4/TN16, precision 18/22, recall 18/20, accuracy 34/40. No model inference occurred. |

Additional chapter arithmetic checked: `(12−10)×60=120` queued items per minute under the stated rate assumptions; changing 10,000-yuan budget units to fen multiplies the numeric capacity by 1,000,000; chapter 12's two trade differences are +40/−40; 60 filled plus another 10 leaves 30 of 100 unresolved. Monetary examples use synthetic accounting units, and transport/worker durations use minutes. The text correctly treats calendar nights separately from 24-hour durations and separates refunds due from confirmed external effects.

## Chapter, terminology, and reader coverage

| Chapter | Review result and ability to transfer |
|---|---|
| 1 — Objects | Unit obligations, version/tenant scope, guard, authoritative facts, and UI states are separated. Arithmetic is reproducible; lodging variant correctly requires new pricing rules. |
| 2 — Lookup | Equality/range/prefix distinction, full keys after collisions, monotone binary search, output cost and write cost are sound. B-tree balance needs the short addition in R5. Character-trie adaptation from BinaryTrie is explicitly an inference. |
| 3 — Order/intervals | Tie rule, comparison-model lower bound, k=1 qualification, negative-window counterexample, half-open intervals and stale-prefix limitation are correct. Companion complexity caveat in R3 matters for copying code. |
| 4 — Graphs | Direction reversal is explicit; BFS hop distance, DFS active-path cycle criterion, nonnegative Dijkstra, and undirected DSU scope are correct. Negative edges, deletions, path explosion and authorization each trigger a method change. Companion edge cases and instrumentation are narrower. |
| 5 — Dependencies/queues | Static cycle criterion is correctly separated from temporarily empty ready sets. Resource-constrained 10-minute example is valid. Outbox and publisher/consumer acknowledgements are scoped; rate arithmetic is not passed off as a latency model. |
| 6 — Optimization | Equal-value interval greedy, complete DP state, integer-budget pseudo-polynomial cost, backtracking, and upper/lower-bound directions are correct. Timeout is distinguished from infeasibility; solver optimum is relative to the model. |
| 7 — Reuse | Exact LRU/LFU calculations, resident-count policy, versioned keys, stale refill race, cache loss and side effects are explained. Redis approximation is explicitly separate. R2 obstructs the advertised extension exercise. |
| 8 — Approximation | Bloom independence approximations, HLL asymptotic standard error versus maximum error, finite teaching scope, ANN recall denominator and authorization scope are properly qualified. These examples establish mechanisms, not production error or latency. |
| 9 — Recovery | Conditional update, multirow invariant scope, same logical operation identity, unknown outcomes, stale versions and compensation are coherent. Stripe is explicitly a provider-specific protocol reference. The model's trace gap is R1, not a missing chapter concept. |
| 10 — Verification/evals | Separates test layers and truthful execution limits; open/closed workloads, split leakage, human calibration and severe-error review are sound. R4 and R6 improve input contracts and practical metric interpretation. No statistical or live-service validation is inferred. |
| 11 — Stacks | Options are conditional on team/workload, not benchmarks or a fixed required stack. Fifty operators/2,000 daily operations are synthetic architecture inputs, insufficient for an actual capacity claim; the chapter does not claim measured capacity. |
| 12 — Transfer | All 33 case IDs are mapped. Six transfer groups preserve identity/quantity/version mechanics while requiring new domain rules. The review did not certify the underlying industries, contracts, medical/legal rules, or provider facts. |

Conventional terms are retained: lower bound, B-tree, trie, BFS/DFS, relaxation, decrease-key, DSU, DAG/topological sort, greedy/DP, backtracking/branch and bound, memoization, LRU/LFU, Bloom/HLL/ANN/HNSW, outbox/inbox, idempotency/deduplication/exactly-once, and precision/recall/accuracy. The index distinguishes near-synonyms instead of replacing them with invented terminology. B-tree's B is not spuriously expanded; ANN is not confused with artificial neural network. A full alphabetical glossary is not necessary to fix the identified gaps.

No instance was found in the scoped material that labels Stripe, Redis, AWS, PostgreSQL, OpenAI, or a chosen framework's practice as consensus. Single-provider examples are named, scope-limited, and generally paired with an explicit warning against generalizing their guarantees. Framework recommendations remain design judgments. Broad source correctness for the 25 originals not reopened is not certified by this finding.

For the intended vibe coder, the principal strength is that the original calculations can be reproduced with arithmetic, tables, or tiny enumerations, and most sections give a concrete signal to change methods. The most immediate repairs are to make changed-input checks trustworthy (R1/R2/R4), separate trace-helper costs from algorithm costs (R3), and add the two brief explanations in R5/R6. No wholesale chapter rewrite is indicated.

## Coverage limits and delivery boundary

This is an independent finite review, not a formal proof or production readiness certification. All 12 chapters and local evidence records were read; 15 of 40 original sources were reopened at the locators documented in `sources.md`. No authoritative-original conflict was found in those selected ranges. The other 25 source entries were checked for local attribution and scope only. Live source pages were not snapshotted, so their later contents may differ; PDF checks used extracted text, not a visual layout inspection or a proof of the full papers.

No real PostgreSQL isolation experiment, broker, provider sandbox, service restart, browser flow, concurrency execution, ANN index, HLL estimator accuracy experiment, load test, or model inference was run. Abstract recovery replay assumes a provider honoring the stipulated identity model; the textbook likewise discloses that boundary. Reader usability was assessed by reviewer walkthrough, not by observing novice participants. The broader atlas's industry case bodies and shared catalog are outside the substantive review scope; structural validation reads their IDs and links.

The review branch is based directly on the frozen commit. Delivery is limited to these review artifacts and the required parent index. No main merge, CI enablement, workflow dispatch, deployment, or textbook modification is part of this delivery. Validation and the final verified remote commit are reported in the delivery response; a file cannot contain its own enclosing Git commit SHA without changing that SHA.
