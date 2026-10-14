# Final targeted SaaS repair verification

**24 findings pass; 2 retain low-severity residual failures. Full repair sign-off is withheld for R4 and WB-02.** All delivered current checks pass, and all original audits/evidence are preserved. The two remaining issues are bounded helper/contract corrections; they do not require another raw-manuscript audit, production-provider test or redesign of the book.

Reviewed public repository: `lesPrivilege/Praxis`, frozen teaching commit **`5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b`** on `cloud/saas-engineering-atlas-20261014`. Review date: 2026-10-14. Review-only branch: `cloud/saas-final-repair-verification-20261014`. The review starts from exactly that SHA and changes only this directory and its parent review index. It does not edit the textbook, repair dispositions, original audits or integration branch.

## Remaining blockers

**WB-02 — a later terminal contradiction can disappear before it is recorded.** After a valid applied result for OP-42, lookup returns the same tenant, operation and target with a changed receipt and either a wrong result version or wrong target value. Both the shipped fake and actual loopback HTTP adapter expose that observation. `mechanism_lab.py:350` validates its effect before the terminal-conflict branch; `reconcile` at 397–399 swallows the resulting contract error. Reconciliation returns `awaiting_acceptance`, reopening SQLite still shows zero conflicts, and 10/10 acceptance closes the operation. The prior valid effect stays intact; an invalid effect is not newly promoted. The chapter 03:127/lab guide:64 promise to preserve contradictory terminal observations and block acceptance is therefore incomplete. [Exact reproduction and evidence](enterprise/README.md).

The bounded correction is to preserve and expose same-identity terminal contradictions as diagnostics even when their effect does not qualify as completion evidence, while keeping the valid prior result. It must block new acceptance and survive reopen. Unrelated identities and unparseable responses do not have to become authoritative terminal facts. Keep the existing distinction for late weaker `accepted` observations.

**R4 — finite inputs can produce false unreachable routes or wrong ANN rankings.** Two edges of weight 1e308 pass the repaired input guard, but their sum overflows: Dijkstra omits reachable C and the wrapper reports it as unreachable. ANN coordinates `query=[-1e308], A=[1e308], B=[9e307]` pass the guard but overflow to an infinity tie, selecting A even though B is closer. Additionally, the new `math.isfinite` guard raises `OverflowError` for an integer weight 10**400 that both pre-repair versions handled exactly. The original dimension/count/isolated-source/unreachable cases are fixed and all 18 published answers remain correct. Ordinary floating-point near-tie rounding is recorded separately as a nonblocking precision limit. [Exact inputs, historical comparison and evidence](foundations/README.md).

The bounded correction is explicit handling or rejection of unsupported numeric calculations, with a clear domain error instead of an unreachable/incorrect answer or incidental conversion exception. Exact/scaled arithmetic is another valid choice; arbitrary-precision support is not required. Only these changed numeric guards and their described input domain need rechecking.

The root coordinator read both code paths and promises and independently repeated the consequential failures; [coordinator-reproduction.json](coordinator-reproduction.json) records the result. These are review findings, not denied tool operations. There is no remaining access, approval or execution blocker.

## Decisions on all 26 findings

The [machine-readable ledger](findings.json) maps every original ID to its pass/fail result and evidence. Original findings remain frozen in the [case review](../saas-case-independent-review-20261014/README.md), [foundations review](../saas-foundations-independent-review-20261014/README.md) and [whole-book review](../saas-whole-book-review-20261014/README.md); the two author repair records remain unchanged.

| ID | Result | Independent basis |
|---|---|---|
| IR-01 | Pass | Both metric selectors reject immutable revision conflicts; replay permutations and generated histories match a separate oracle. |
| IR-02 | Pass | Same-identity content conflicts reject before deduplication, windows and scoring; receipt-only replay and separate scopes remain valid. |
| IR-03 | Pass | API and stored SQLite domains reject bad eligibility/units; exact Fraction money oracle and reopen checks agree. |
| IR-04 | Pass | Actual revision-aware fake dispatch, both orders, duplicates, late old operations and unknown reconciliation are failure-sensitive. |
| IR-05 | Pass | All five empty references removed; adjacent explanations and evidence routes remain. |
| IR-06 | Pass | FHIR R5 links and resource-specific claims verified against the three official pages. |
| IR-07 | Pass | All sixteen named residue/punctuation locations cleaned without loss of calculation, qualifiers or sources. |
| IR-08 | Pass | Scalar GiST prerequisite supplied and verified; locking alternative retained; no new DDL execution claim. |
| R1 | Pass | Trace agrees with selected persisted rows; seven missing/wrong-state/dispatch mutations detected. |
| R2 | Pass | Separate cache counters and seventh-A variant agree with 13,120 sequence/capacity oracle cases. |
| R3 | Pass | One-shot bounded Top-K, incremental BFS, shared-path iterative DFS and component counter verified by inspection and independent probes. |
| R4 | **Fail, residual low** | Original cases pass; accepted numeric ranges still yield false answers/uncaught conversion, as above. |
| R5 | Pass | Balance, occupancy, ordering, partitions and child count checked on valid and damaged trees; prose/glossary explain the height prerequisites. |
| R6 | Pass | Recomputed 1% prevalence gives 9/207 precision; 40/20-denominator sensitivity and hypothetical assumption agree. |
| WB-01 | Pass | Persisted fixed 10/10 policy resists caller narrowing on both adapters, including reopen and bad-policy controls. |
| WB-02 | **Fail, residual low** | Valid-effect contradictions work; changed-receipt plus invalid-effect observations escape diagnostics and acceptance blocking. |
| WB-03 | Pass | 16+16 competition and 10+6 normal requests stay distinct; 8,400 serialized oracle scenarios and two guard mutants agree. |
| WB-04 | Pass | Manufacturing transfer points to V07 consistently; old proposal identity preserved as alias. |
| WB-05 | Pass | Restored executable root-relative routes run; learner arithmetic and maintenance scopes are clear. |
| WB-06 | Pass | 25 terms, 26 actual first-use occurrences and four specialized primary-source names checked. |
| WB-07 | Pass | Floor/clamp and zero-based indexing explained; 12,221 rational arithmetic comparisons agree. |
| WB-08 | Pass | Production narration removed at all named locations; useful exercises and Claude's authoring freedom retained. |
| WB-09 | Pass | Sidecar and prose give 9 accepted +1 pending inspection +2 not received =12. |
| WB-10 | Pass | Wire actually returns result version 9; local request supplies prerequisite 8. Both adapters and wrong-result guards agree. |
| WB-11 | Pass | Reapproved r4/r5 have distinct identities; stale approval, changed same-key content and replacement intent keys reject. |
| WB-12 | Pass | Buffered answer semantics, current authorization on every emission/replay, prior delivery and consumed usage agree. |

## Fresh execution and preservation evidence

- [Delivered entry-point receipt](delivered-entry-points.json): **21/21 exit 0**, including both repair suites, foundations self-tests, package scripts and enterprise SQLite/loopback tests. [Top-level checks](delivered-checks.json) cover source-index freshness, both atlas validators with their self-tests, repository validation, whitespace and a byte-identical registry rebuild. The registry command ran in an isolated frozen tree because it writes a generated file.
- [Case verifier](cases/README.md): 3,559 independent assertions and 16/16 detected implementation mutants. [Enterprise verifier](enterprise/README.md): six passing methods, one residual method failing in four subcases, plus 6/6 detected mutants. A failing independent probe intentionally exits 1 and is not mislabeled an infrastructure failure.
- [Foundations verifier](foundations/README.md): persisted-state observations, seven detected recovery mutants, scan/graph/route/tree oracles and numeric boundary probes. Its original-review arithmetic oracles are explicitly identified as reused for 17 fixtures; new checks are not presented as wholly new derivations of every unchanged example.
- [Reader inspection](reader-review.md) and [reader-results.json](reader-results.json): affected prose/data, arithmetic, reservation guards, first uses and 218 relative destinations across 42 changed reader files. [Source checks](source-checks.json): nine targeted official pages reopened; no complete-source or live-provider certification.
- [Provenance verification](provenance/README.md): **28/28 original audit files byte-identical** to their named import commits; **4/4 historical probes reproduce** saved output hashes in isolated historical trees. All 210 prior source records, 222 review records, 386 claims and eight original author evidence files remain preserved; additions project without replacing prior identities.

The numerical denominators above describe different probe domains and are not summed into a coverage percentage. Passing author tests are supporting evidence; the residual failures demonstrate why they are insufficient for complete repair closure.

## Reader readiness and scope

The repaired prose remains usable for Claude's free writing, visualization, interaction and motion work. No needless protective prose was found that warrants another repair task. Definitions and new guards carry concrete teaching information, and the handoff keeps source identity, conditions and units without prescribing a finished visual design. No further full-manuscript or raw-source re-audit is requested. Until the two targeted corrections are complete, do not present their broad helper/conflict promises as fully verified; the other 24 findings are closed by this review.

The WB-12 recovery wording and ordinary ANN near-tie rounding were challenged and adjudicated as nonblocking; their reasoning is preserved in the corresponding subreviews. No new SSE service, live provider, production IAM, PostgreSQL DDL, browser implementation, model inference, concurrency certification, benchmark, CI or deployment is a condition of this textbook review.

The independent work used a root Codex coordinator (default session model; no override), three explicitly selected `gpt-6-astra` high-reasoning technical reviewers and one `gpt-6-luna` high-reasoning provenance explorer, following the repository's division-of-work preference. Each had disjoint file/finding ownership; the coordinator reconciled all decisions and owns the final verdict. None authored the reviewed repairs during this task.

The final remote review SHA is reported in the delivery response rather than written into the commit that would contain it. No main merge, workflow dispatch, CI enablement, dependency installation or deployment is part of this delivery.
