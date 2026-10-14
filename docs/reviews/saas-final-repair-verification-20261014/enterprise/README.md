# Independent enterprise repair verification

Frozen target: `5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b` in public `lesPrivilege/Praxis`. Four assigned repairs pass; **WB-02 remains a low-severity incomplete repair**. This is a bounded repair sign-off, not a fresh raw-manuscript audit or production-provider certification.

Actual role/model: independent enterprise repair adjudicator, `gpt-6-astra`, high reasoning, selected by the parent under the repository's critical-adjudication preference. No further delegation occurred. Read root `AGENTS.md`, `kit/Agent.md`, architecture and intake instructions. Only this review directory was written; the implementation, textbook, sidecars, checkout and Git state were not changed. Temporary mutation copies and databases were removed by their temporary-directory contexts.

## Decisions

| ID | Decision | Independent evidence |
|---|---|---|
| WB-01 | Pass | Both adapters reject 195 incorrect integer numerator/denominator pairs each, including smaller perfect denominators. Float/bool and empty evidence controls reject; missing, empty, changed-version and narrowed policies reject before enqueue. Changing the caller's dictionary after enqueue cannot change the stored policy. Reopened 10/10 acceptance records `SVC-ACCEPT-1`. |
| WB-02 | **Fail — residual low** | The valid-effect contradiction cases work, but a changed terminal receipt accompanied by a mismatched result version or desired value is silently discarded. Both adapters reproduce this, including SQLite close/reopen and subsequent acceptance. |
| WB-09 | Pass | Recomputed from requested/received/accepted quantities: `10−9=1` received pending inspection; `12−10=2` not received; outstanding fulfillment `1+2=3`; partition `9+1+2=12`. Sidecar labels and chapter distinguish these; `9×80,000=720,000` fen. |
| WB-10 | Pass | Both real loopback HTTP and fake results contain the seven described fields, including result version9 and desired6, without an echoed prerequisite-version field. The stored request supplies expected version8. Wrong version, value and identity controls reject. Chapter03:109 and lab guide:35 accurately describe the comparison. |
| WB-11 | Pass | Independently exercised r3, r4 and r5 through lost responses and reopened journals on both adapters. Approval/business/operation identities are distinct; replaying all earlier intents retains their result versions and exactly three total effects. Stale approval, changed same-key content and a replacement key for an existing business intent reject. |

Machine-readable decisions, commands, author-test results and nine input hashes are in [verification.json](verification.json). Every hashed input matches the frozen commit. Full independent observations, failure traces and mutation receipts are in [results.json](results.json). The reproducible executable is [probes.py](probes.py).

## WB-02 residual: terminal contradiction is lost when its effect is invalid

The repaired chapter explicitly promises to preserve conflicting terminal observations, including a changed terminal receipt, and block further acceptance. This promise appears at [chapter03:127](../../../../books/saas-engineering/enterprise-mechanisms/03-schema-tools-completion.md#不成功时怎样继续), the final paragraph of the [lab guide](../../../../books/saas-engineering/enterprise-mechanisms/lab-guide.md), and synthetic claim `WB:claim:evidence-conflict` in [repair evidence](../../../../vault/provenance/saas-engineering-atlas/whole-book-repair-evidence.json) at line166. The examples sidecar also carries the conflict-blocking invariant at line247.

Exact reproduction uses the normal approved r3 intent and shipped providers:

1. Enqueue and dispatch `OP-42`, preserving a valid `applied` result with `version=9`, `desired=6` and its original receipt. State becomes `awaiting_acceptance`.
2. Have the provider's later lookup return the same tenant, operation and target, `state=applied`, `receipt=contradictory-receipt`, and either `version=10, desired=6` or `version=9, desired=8`. The fake lookup and actual HTTP GET both expose this complete terminal object.
3. Reconcile. Actual result: `awaiting_acceptance`, conflict list `[]`. Close/reopen SQLite: still `awaiting_acceptance`, `conflict_count=0`.
4. Accept as service owner with 10/10 and evidence. Actual result: `closed`. The earlier valid effect is retained and provider effect count remains one.

The cause is [mechanism_lab.py](../../../../vault/distilled/saas-engineering-atlas/enterprise-mechanisms/mechanism_lab.py):350: `validate_result(result, intent)` checks the new effect before the terminal-conflict branch at lines351–360. A mismatched version/value raises `ContractError`; `reconcile` catches it at lines397–399 and returns the prior state without a diagnostic. Acceptance only blocks an existing conflict count at lines408–409. The author regressions change the receipt while keeping the effect valid, so they never reach this ordering gap.

The independent test `test_terminal_conflict_with_invalid_effect` fails in four subcases: two adapters × two mismatched effects. The original valid effect is **not** overwritten, and no invalid effect is newly promoted. This is a missing diagnostic and acceptance-blocking failure under an intentionally faulty provider, consistent with the original low severity. It is not a claim about any live provider or production authorization.

For a complete repair, same-identity terminal contradictions should be retained as observations and exposed before acceptance even when their effect cannot qualify as valid completion evidence. Keep the valid prior result and distinguish diagnostic storage from promotion of an invalid response. Unrelated identities or unparseable transport responses need not be treated as authoritative terminal facts. No repair was made in this review.

## Checks and sensitivity

The exact executed commands and outcomes are recorded in `verification.json`:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 vault/distilled/saas-engineering-atlas/enterprise-mechanisms/test_mechanism_lab.py
PYTHONDONTWRITEBYTECODE=1 python3 vault/distilled/saas-engineering-atlas/enterprise-mechanisms/validate_content.py
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s docs/reviews/saas-whole-book-repairs-20261014 -p regression_checks.py -k EnterpriseRepairs -v
PYTHONDONTWRITEBYTECODE=1 python3 docs/reviews/saas-final-repair-verification-20261014/enterprise/probes.py --mutations --output docs/reviews/saas-final-repair-verification-20261014/enterprise/results.json
```

The original 37 unittest methods and seven enterprise repair methods pass. The content validator passes with four chapters, 33 case links, 17 sources, 27 claims and two worked examples. Independent checks run seven methods: six pass; the residual method fails four subcases, with zero execution errors. The last command intentionally exits **1** to express the unresolved repair; it is not a harness or environment failure.

Independent valid-conflict coverage additionally checks applied/rejected in both orders, changed applied receipts, changed rejected receipts, repeated observation deduplication, persistence after reopen, a late weaker accepted observation after conflict, and conflict visibility after historical closure while retaining the original acceptance record. These cases pass on both adapters.

Six isolated temporary source mutations are detected by specific assertions: allowing a reduced denominator; skipping fixed-policy validation; discarding terminal conflicts; omitting result-version equality; returning the original operation ID for every revision; and removing the unique business-intent constraint. Each mutated run fails its selected test without an execution error. The frozen implementation is never edited for these probes.

## Boundary and remaining work

Read the original enterprise findings and WB-01/02/09/10/11 repair dispositions, implementation and author regressions, affected chapter01/chapter03/lab-guide prose, structured examples, and the associated synthetic repair claims. The verification adds arithmetic, persisted-state, negative-input, wire, revision and mutation evidence beyond the supplied author assertions. Synthetic acceptance and revision policies remain explicitly synthetic; this review makes no new claim about the external sources cited elsewhere in the book.

No live providers, authentication, production revocation, full process-crash schedule, exhaustive concurrency interleavings, browser behavior, or full raw source re-audit were attempted. No dependencies were installed, no external services contacted, and no checkout/commit/push performed. The parent owns the global runner and repository validator, which this agent did not run. There is no denied or pending tool action. The remaining blocker is substantive: **WB-02 cannot receive complete repair sign-off at the frozen target** until its diagnostic/acceptance boundary is repaired or the claim is explicitly narrowed and independently reconsidered.
