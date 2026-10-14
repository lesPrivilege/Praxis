# Coverage and reader walkthrough

Frozen input: `cd8d77b6166a6fc566f6aa09b4d9af3e11537408`. This is a new whole-book review. It neither replaces the existing integrator nor evaluates that integrator's later repairs. Five Codex agents performed the review: one coordinator and four reviewers with the inherited model configuration. No human novice was observed; the reader judgments below are expert walkthrough findings, not measured learning outcomes.

## Reading coverage

| Material | Actual coverage | Evidence and limits |
|---|---|---|
| Books entry, book entry, learning path, architecture, problem index, case catalog, semantics, terminology, transfer map, validation and Claude handoff | Coordinator read complete text and followed representative learning routes | All 73 Books Markdown files additionally scanned for local targets and headings. No rendered HTML or accessibility/layout test. |
| 33 case chapters, six package introductions | Complete prose reading, divided into disjoint 12/10/11-case assignments | [Finance/commerce](cases-finance-commerce.md), [health/industry](cases-health-industry.md), [people/data](cases-people-data.md) give per-case coverage and concrete observations. Selected calculations and JSON comparisons, not a replacement technical audit of every implementation. |
| 12 foundations chapters, introduction and terms | Coordinator read complete text | Chapter judgments below; earlier technical findings remain assigned to the existing repair effort. The 18 author examples and six earlier findings were read through that audit; its finite experiments were not relabelled as newly executed here. |
| Four enterprise chapters, terms, lab guide and all 33 case connections | Enterprise reviewer read complete text, source assets and tests; coordinator reopened the action/recovery chapter and disputed passages | Both worked chains and implementation examples independently recomputed; supplied tests and independent probes executed. See [enterprise audit](enterprise-review.md). |
| Current prose versus retained source assets | All case routes, duplicate-body absence, claim/review projection checks; targeted numerical/contract comparisons by reviewers | No second current case/foundations/enterprise chapter bodies remain in Vault. Historical case URLs and original author receipts intentionally preserve older revisions. No assertion of byte-for-byte historical-to-current prose identity. |
| Primary originals | Coordinator selectively reopened RFC 9110 §15.3.3, Palantir Action types permissions and Camunda 8.8 job workers | [Source scope](sources.md). Other external originals were not newly reopened. Labels and structurally valid citations do not prove claim truth. |

## Foundations walkthrough

| Chapter | Recognition → method → calculation → verification → transfer judgment |
|---|---|
| 01 Objects | O7 makes paid, delivered, cancelled and refund-confirmed different facts. The 3-unit/120-unit example gives a usable invariant. Guard, version, tenant and read-model definitions precede their important use. Keep the lodging rule-change answer. |
| 02 Lookup | Equality/range/prefix questions lead to different structures; hash collisions, binary-search monotonicity and output cost are explained. The earlier B-tree prerequisite finding remains with the foundations repair. |
| 03 Order and intervals | Stable ties, Top-K thresholds, pointer movement and the negative-window counterexample explain why methods work. Prefix sums use zero-based positions without saying so; WB-07 asks for that small prerequisite, not a new chapter. |
| 04 Graphs | Edge direction, reversed impact traversal, active DFS path, weighted distance and undirected connectivity are distinguished. Keep the detailed C→D shared-dependency versus E→B cycle explanation. Earlier helper/input findings are not reissued. |
| 05 Dependencies and queues | The 7-minute versus 10-minute example bridges topology and resources. Running predecessors are distinguished from cycles. Queue durability, acknowledgement boundaries and the 120-item backlog are scoped. |
| 06 Choices | Exchange reasoning, a complete DP state, the 0/1 misuse, backtracking and the 6.5 upper bound provide enough reasoning to select or reject a method. Preserve feasible/optimal/unknown distinctions. |
| 07 Reuse | Same-input meaning precedes caching; exact LRU/LFU and the stale-refill race show different failure classes. The advertised seventh request is pedagogically useful; its known evaluator defect belongs to the prior repair. |
| 08 Approximation | Bloom, HLL and ANN preserve different information and have different error denominators. Four-register HLL is explicitly an update demonstration. The exponential/square-root/set notation is denser than the elementary entry promise, but the examples can be followed without deriving the formulas; an optional notation note is sufficient. |
| 09 Recovery | O7/S3/OP7 return with their roles restated. Submission, transaction, external unknown, reconciliation and projection form a clear chain. Stripe's protocol is named and scoped. Keep the four crash-boundary explanations. |
| 10 Verification | Each test layer has its own claim and limits; failure schedules are concrete. Preserve denominators and synthetic performance targets. Prior recovery-checker and prevalence findings remain with the earlier audit. |
| 11 Stacks | Choices are conditional on team capability and responsibility boundaries, with a small application/database/worker example. No framework ranking or measured capacity is claimed. This connects algorithms to implementation without requiring distributed architecture. |
| 12 Transfer | All 33 cases are mapped. Six worked transfers explicitly change identities, quantities, versions, authority or in-flight obligations. The final exception-list exercise combines windowing, Top-K, stale display, fresh authorization and recovery. |

The chapter order carries prerequisites coherently for sequential readers: objects and identity → lookup/order → graphs/dependencies/constraints → reuse/approximation → execution/verification → implementation/transfer. Direct-entry readers can use the indices, but named industry system families and two local mathematical conventions need the repairs in WB-06/WB-07. Foundations prerequisite IDs are retained in `curriculum.json`; the reader route is the chapter table and learning path, not a visible prerequisite card on every page.

## Whole-book routes walked

| Route | What the learner can do | Limit found |
|---|---|---|
| Enterprise E01 → foundations 01 → H01 → V04 → V20 → X01 | Separate commitment, execution, acceptance and money; change service units to goods/appointments; then add tenant scope | X01 needs a precise buffered/streamed delivery boundary (WB-12); H01 needs two formula definitions (WB-07). |
| Foundations 04/05 → H03 → H07/H09 → V03/V09 | Find affected evidence, build dependency work and refuse old approvals for new versions | H03's production-scheduling transfer points to H07, whose case is BI (WB-04). |
| Foundations 03/06 → V06/V19 → V21/V22 | Define intervals and units, then add capacities and resource constraints before claiming feasibility | V21's competing request quantities were lost in prose (WB-03). |
| Enterprise 03 → foundations 09/10 → lab guide | Predict unknown results, reconcile the original operation and require separate acceptance | Fixed-probe acceptance and contradictory terminal observations are incompletely enforced by the enterprise lab (WB-01/WB-02). |

## Structure, duplication and explanations

The five teaching stages recur usefully; they do not impose identical subject matter. Local reminders that payment is not delivery, reachability is not authority, and a provider response is not business acceptance are necessary for independent case entry. Removing them wholesale would weaken transfer. Long paragraphs in V03, V08, V09, H07 and H09 often carry the version or evidence reasoning that makes the example correct.

The heading inventory contains 565 headings across 73 Markdown files. It is a location aid, not a mechanical style score. Method headings generally name the operation or decision; some case titles preserve long work chains and some section headings are complete questions. Claude can shorten display titles to concise phrases while leaving the distinction and conditions in adjacent prose. No fixed character limit, uniform chapter length or broad compression is recommended. Specific production narration should move to the handoff (WB-08), while synthetic-data labels and genuine evidence limits stay with readers.

The independent scanner found 704 local Markdown link occurrences with no missing targets or unresolved heading-anchor candidates. This does not catch prose such as “the scripts in this directory” or “the first command” when the command is absent; WB-05 demonstrates that gap. It also does not verify remote URLs, Mermaid rendering, keyboard interaction, narrow screens or eventual HTML design.

## Earlier reviews and candidate research

Read the case audit at `5c5f7098561d4d87403986d6c3edf58cde20a5e7` and the foundations review at `b97d728bd2a2abe4687203592ac1341242f07333`. Their eight case findings and six foundations findings are known inputs, not new findings here. In particular, blank references, the previously enumerated punctuation/authoring residue, FHIR release pinning, helper input domains, cache-extension behavior, recovery traces, implementation costs, B-tree conditions and prevalence are not reissued. Whether the integrator has completed each repair is outside this frozen review.

Read the candidate `synthesis.md` and `candidate-convention.md` at `cc18900df06f28cb475df9fcf4f9b70256aa4af6` under `vault/distilled/technical-compilation-writing-research-20261014/`. They were useful prompts for checking learning outcomes, first use, chapter dependencies and evidence identity. They were not treated as adopted Kit rules, proof of effective pedagogy or authority over Claude's final prose/design decisions.
