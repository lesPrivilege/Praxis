# Case repair verification

Independent bounded sign-off of **IR-01, IR-02, IR-03, IR-04 and WB-12** at public repository commit `5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b`, performed 2026-10-14. Role: independent case repair verifier and critical adjudicator. Requested model: **gpt-6-astra**, high reasoning, confirmed by parent orchestration metadata. This verifier did not author the repairs.

The original findings and acceptance criteria were read in [case findings](../../saas-case-independent-review-20261014/findings.json) and [whole-book findings](../../saas-whole-book-review-20261014/findings.json), then compared with [atlas dispositions](../../saas-atlas-repairs-20261014/dispositions.json) and [whole-book dispositions](../../saas-whole-book-repairs-20261014/dispositions.json). Root `AGENTS.md`, the Kit task entry, and the verification guidance govern this review. Source code, reader prose and the affected JSON topology were inspected directly. Historical review artifacts and implementation files were not edited.

## Results

| Finding | Original acceptance | Independent evidence |
|---|---|---|
| IR-01 | PASS | 720 permutations including a later identical replay at both cutoffs; independently recomputed M1/M2; conflicts in every immutable field reject even when outside the selected window, cancelled, or superseded; future/out-of-tenant evidence excluded; 160 generated revision histories checked against a separate set-and-sort oracle. |
| IR-02 | PASS | Every immutable field and added raw digest challenged in both arrival orders, with a third replay interposed; deduplication, grouping and scoring all reject collisions. Receipt metadata remains harmless; tenant/connection scopes remain distinct; scores 100 and 90 independently recomputed. |
| IR-03 | PASS | Invalid eligibility/usage values reject on both new and existing identities without modifying usage or conflict records. Raw SQL INSERT and UPDATE constraints reject invalid stored domains. Zero through maximum signed 64-bit units, all allowed boolean/0/1 forms, exact Fraction money oracle, and reopen preservation checked. |
| IR-04 | PASS | All six schedules containing two old and two new tasks converge to one accepted new effect, with no stale intent. An old accepted/unknown effect followed by a newer grant survives close/reopen; reconciling the old operation cannot replay its revoke. Changed operation payload and direct stale target revision reject. |
| WB-12 | PASS | Verification, tenant, active membership and epoch tested independently, plus before-first, partial and complete delivery. Every subsequent/replayed chunk requires current authority. Prior legal deliveries, replay attempts and consumed units remain intact. Invalid sequence indices reject. |

[probes.py](probes.py) contains the independent contracts and mutations. [results.json](results.json) records the frozen SHA, source hashes, exact argument arrays, stdout/stderr, all six author command exits, independent assertion counts and mutation outcomes. There are **3,559 independent baseline assertions** and **16/16 killed implementation mutants**. Mutation-prefix assertion counts are reported separately and are not the baseline count.

Run from the repository root:

```sh
python3 docs/reviews/saas-final-repair-verification-20261014/cases/probes.py
```

This executes the four relevant author script entry points; the atlas repair `CaseRepairs` class (4 tests); and the three WB-12 repair methods. All exit 0. X01's own entry point runs 14 tests and H04/H05's runs 20. The H07/H08 entry points retain their structured arithmetic receipts. Temporary mutation copies remove the shared H07 guard, M2 validation, H08 collision/scoring/grouping guards, each X01 API/SQL domain constraint, H04 sender/target revision guards, and WB-12 verification/tenant/active/epoch/replay guards. All are caught by these independent contracts; mutations do not edit the checkout.

## Reader and topology inspection

- H07 reader lines 144–148 preserve the complete M1/M2 explanation, require state/time/amount identity consistency and explicitly permit reception-time-only replay. The case JSON retains source revision identity and frozen-input semantics; no conflicting alternative deduplication policy was found.
- H08 reader line 79 now says conflicting immutable content is quarantined before trusted scoring. It explicitly restricts the helper to one normalization version, so rejecting differing normalized rows is not mistaken for a complete renormalization subsystem. JSON source identity includes tenant and connection and preserves normalization version relationships.
- X01 reader lines 64–68 specify accepted numeric domains and synthetic decimal pricing separately from real-currency rounding. SQLite affinity can normalize values such as SQL string `'1'` into integer storage: these are stored-domain constraints, while the public helper enforces the stricter Python input types. This is consistent with the chapter's separate ingestion/database boundaries.
- H04 reader line 96 describes actual fake dispatch in both orders, its naive counterexample, lost-reply reconciliation and the target's synthetic conditional-version assumption. The JSON keeps current desired revision and account-bound observations distinct. The exercise does not claim SCIM itself supports conditional writes.
- X01 reader lines 3, 28, 40–42 and 104 select buffered generation, progress-only messages before verification, per-chunk current authorization and separately recorded usage. JSON authorization edge, run-success guard and revocation check agree with these boundaries. A challenged recovery phrase was resolved as a non-finding below.

## Adjudicated WB-12 non-finding

The review challenged the recovery phrase in [X01.json](../../../../vault/distilled/saas-engineering-atlas/packages/data-ai-control/X01.json), lines 810–815: `unknown → succeeded` requires original result and complete delivery evidence, with current authorization only for **new sending**, while its recovery text reads `已撤销则进入failed` (revoked means failed). The reader at [X01.md](../../../../projects/books/saas-engineering/packages/data-ai-control/X01.md), line 42, explicitly preserves earlier complete delivery and billing evidence after a later revocation.

An extended recovery design could encounter this boundary: all three chunks are legally received under epoch 5; recording completion is delayed; membership moves to epoch 6; reconciliation obtains the original complete receipt without sending anything further. Prior delivered indices and consumed units are preserved by the independently executed helper trace, and replay is rejected. Interpreting the recovery sentence unconditionally in that extended design could misclassify the run. However, the topology's only `running → unknown` transition is provider-call timeout (`调用timeout`, `外部结果不明`, lines 801–807), which normally occurs before buffered verification and delivery. Loss of the completion record after successful delivery is **not** a modeled transition here. The helper also does not implement run-finalization/billing. Thus no reachable state in the declared model establishes a contradiction or runtime billing defect.

Adjudication: read the recovery phrase within its upstream-timeout transition; the existing reader text already preserves completed delivery. This is a **non-finding**, agreed with the coordinating reviewer. No additional wording, implementation or crash-recovery work is required for bounded sign-off, and no modeled leak or billing failure was established.

## Boundaries and remaining work

No live provider, model, browser, SSE transport, IAM, SCIM, real concurrent network race, cross-process crash recovery or production deployment was exercised or required. `BufferedAnswer.verified` and current authorization inputs are trusted fixture inputs; the fake receiver observes returned chunks synchronously. H04's target has a revision guard as an explicit synthetic assumption. H08's quarantine is a rejecting batch helper, not a durable quarantine implementation. Money checks use the stated synthetic price and default Decimal context, not actual-currency policy.

The global runner and repository validator are assigned to the coordinating parent and were intentionally not run here. No branch change, checkout, commit, push or implementation write was performed. Deliverables are limited to this `cases/` directory. There are no blocked tool actions or remaining assigned-scope acceptance blockers.
