# Enterprise mechanisms: independent technical and teaching review

The original two worked chains recompute correctly, and all **37 supplied unittest methods pass** at frozen commit `cd8d77b6166a6fc566f6aa09b4d9af3e11537408`. One medium teaching-contract defect is confirmed: a caller can close the fixed ten-probe acceptance exercise with only one passing probe. Four low findings concern contradictory evidence handling, the fixed demo's revision identities, and prose/data alignment. None establishes a production-provider defect.

This is the enterprise subreview for the whole-book reviewer. The reviewer read all four chapters, their README, lab guide, terms, all 33 case-connection rows, the complete mechanism implementation and tests, both example records, migration fixtures, evidence sidebars and claim records, and author verification/handoff records. It does not replace the independent case/foundations audits at `5c5f7098561d4d87403986d6c3edf58cde20a5e7` and `b97d728bd2a2abe4687203592ac1341242f07333`; those exclude enterprise mechanisms. Only review artifacts were created; no book or source implementation was changed and this subreview performed no Git mutation.

Repository instructions used: `AGENTS.md`, `kit/README.md`, `kit/write/README.md`, `kit/write/prose/README.md`, `kit/write/prose/review.md`, `kit/write/shared/evidence.md` and `kit/write/shared/verification.md`. The candidate convention at research commit `cc18900df06f28cb475df9fcf4f9b70256aa4af6` was read as a useful comparison, not as an adopted rule. Claude retains final prose and visual-design authority.

## Findings

Severity measures impact on this teaching package. Medium means a promised local check can accept an invalid answer or block a prescribed task. Low means a bounded robustness, adaptation or alignment gap whose original valid-input chain remains correct. These are not production incident ratings.

### EMR-01 — Medium: the fixed acceptance denominator is caller-controlled

**Locations:** `vault/distilled/saas-engineering-atlas/enterprise-mechanisms/mechanism_lab.py:371–383`; `examples.json:170–181`; `projects/books/saas-engineering/enterprise-mechanisms/03-schema-tools-completion.md:101,111,123`; test coverage at `test_mechanism_lab.py:171–183`.

The chapter requires the fixed suite of ten probes, and the data policy specifies both `required_probes_passed=10` and `probe_total=10`. `OperationJournal.accept` checks only that `passed == total`, that `total > 0`, and that an evidence reference exists. After the normal confirmed effect, both `accept(..., 1, 1, ...)` and `accept(..., 9, 9, ...)` return `closed`. The supplied test only rejects 8/10 and accepts 10/10, so it cannot catch a reduced denominator.

This is within the original fixed example, not a request for real authentication or a production monitoring system. The owner role and confirmed effect were left intact. The check silently changes the acceptance policy that the example is supposed to enforce.

**Remedy:** bind the expected total to the persisted work policy instead of accepting a caller-selected denominator; for this fixed lab, requiring exactly 10/10 is sufficient. If the example grows to multiple suites, persist a suite/version identity as well. Keep controls showing 8/10 fails and 10/10 passes, and add 1/1 and 9/9 rejection checks. Preserve the explanation separating applied effects from business acceptance.

### EMR-02 — Low: contradictory terminal evidence is silently discarded

**Locations:** `mechanism_lab.py:319–330,358–369`; related positive test at `test_mechanism_lab.py:255–258`.

The journal treats any different state after a terminal observation as weaker evidence. A deliberately faulty provider returns `rejected` on submit while its actual ledger records one applied effect; the next lookup returns the same operation as `applied`. `dispatch` returns `rejected`, then `reconcile` also returns `rejected`, retains the old rejection and exposes no conflict signal. A different state is not necessarily a weaker state: rejected versus applied is a contradiction. A second probe changes only the receipt of an already applied operation. `_observe` raises `ContractError("contradictory_terminal_evidence")`, but `reconcile` catches it and returns `awaiting_acceptance`; the entire database row remains byte-for-byte the same. No diagnostic is returned, logged or stored by this implementation (the only journal columns are tenant, ID, business key, payload, state, result and acceptance).

This probe deliberately violates the normal provider contract. Its severity is therefore lower than EMR-01: the compliant, immutable receipt path is correct, and preserving known evidence is preferable to erasing it. The gap concerns teaching robust handling of a broken external contract, not proof that the normal provider changes terminal results.

**Remedy:** distinguish a late `accepted` observation from conflicting `applied`/`rejected` evidence. Preserve established facts, retain both observations or a diagnostic, and expose an explicit reconciliation conflict requiring investigation. Do not resolve this by inventing a new operation or overwriting confirmed effects. Test both contradictory arrival orders separately from the existing accepted-after-applied control.

### EMR-03 — Low: revision changes retain r3 approval and business identities

**Locations:** `mechanism_lab.py:134–163`; `03-schema-tools-completion.md:139`; lab limits at `lab-guide.md:62`.

`Change` exposes a mutable `revision`, and approval binds its serialized scope. However, approving `Change(revision=4, config_version=9, desired=8)` still produces `approval_ref="APR-42-r3"`, `business_key="CHG-42/r3/apply"` and operation `OP-42`. After the original revision was enqueued and applied, enqueueing that newly approved revision raises `idempotency_conflict`. The old approval is correctly rejected before reapproval; the defect is the identity presented after reapproval.

The lab explicitly models a single original example, so this is an adaptation limitation rather than a failure of the r3 main chain. It matters when a reader follows the chapter's changed-scope discussion into a runnable revised attempt. The correct recovery rule remains: retries of the same intent retain their identity; a genuinely new, independently approved intent needs its own version-bound identity.

**Remedy:** either declare and reject non-r3 inputs in this fixed fixture, with a clear note that the follow-on revision requires extending the model, or derive approval/business identity from the chosen change and revision and supply a distinct operation identity for the new intent. Add a successful explicitly reapproved r4 scenario if the latter is implemented; keep the stale-approval and duplicate-intent rejection checks.

### EMR-04 — Low: the sidecar labels outstanding fulfillment as undelivered quantity

**Locations:** `examples.json:108–114`, particularly `remaining_delivery_qty: 3`; correct distinctions in `01-organization-to-system.md:76,82,101`.

Twelve units were committed and ten received, so two remain undelivered. Three units still have unfinished fulfillment responsibility: one already delivered but pending inspection, plus two not received. The chapter explains this correctly, but the diagram-ready sidecar collapses them under `remaining_delivery_qty=3`. A renderer or adapted example using that field could misstate the physical quantity.

**Remedy:** rename the field to an unambiguous outstanding-fulfillment measure or keep two explicit fields (`pending_inspection_qty=1`, `not_received_qty=2`). Retain the chapter's `9+1+2=12` reasoning. Check both partition and labels when reusing the sidecar for a graphic.

### EMR-05 — Low: the prose claims a receipt field absent from both implementations

**Locations:** `03-schema-tools-completion.md:109`; `mechanism_lab.py:166–186,207–217`; `test_mechanism_lab.py:32–44`; `lab-guide.md:35`.

The fourth worked step says the controller returns the used prerequisite version 8 as well as result version 9. Both fake and reference HTTP receipts return only `tenant`, `operation_id`, `target`, `state`, `receipt`, `version` and `desired`. The validator checks that result version equals the persisted intent's expected version plus one; it does not receive an independently echoed prerequisite-version field. The lab guide's narrower wire description is accurate.

**Remedy:** either describe the implemented comparison precisely in the chapter, or add the prerequisite-version field to both providers and both contract checks. Do not imply a general external API always returns version provenance. Preserve the correct reasoning that a bare observed value of six cannot establish which authorized operation produced it.

## Independent computations and supplied checks

[enterprise-probes.py](enterprise-probes.py) uses standard-library code, verifies the audited files still match the frozen commit, recomputes arithmetic independently of the author's helpers and reproduces EMR-01 through EMR-03. It also records the two alignment observations. [enterprise-results.json](enterprise-results.json) contains results and SHA-256 hashes. Its success means the frozen observations reproduced, including defects; it does not mean they were repaired.

| Chain or exercise | Independent result | Outcome |
|---|---|---|
| EM-E01 commitment and changed price | `12×80,000=960,000` fen; `12×82,000=984,000` fen | Matches chapter |
| Accepted units and settlement | `9+1+2=12`; `9×80,000=720,000` fen; initial shortfall `10−9=1` | Matches chapter |
| Prepayment | `960,000×30%=288,000` fen | Matches chapter |
| Dashboard denominators | `9/10=90%`; `9/12=75%` | Matches chapter |
| EM-E02 effect and acceptance | workers 4→6; configuration version 8→9; probes 80%→100% | Matches fixed example; EMR-01 qualifies acceptance implementation |
| Cutover | `12+5+2+1=20`; after reconciliation `12+6+1+1=20`; routinely actionable `18/20=90%` | Matches chapter; distinct from completion |
| Training | `5/6≈83.3%` | Matches chapter |
| Two-year cost and sensitivity | configuration 16 person-days, customization 52, increment 36; savings 27.5 or 55 person-days | Matches stated 220 workdays/year and 8 hours/person-day |

Commands run at the frozen target:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 vault/distilled/saas-engineering-atlas/enterprise-mechanisms/test_mechanism_lab.py
PYTHONDONTWRITEBYTECODE=1 python3 vault/distilled/saas-engineering-atlas/enterprise-mechanisms/validate_content.py
PYTHONDONTWRITEBYTECODE=1 python3 docs/reviews/saas-whole-book-review-20261014/enterprise-probes.py
```

The first reported `Ran 37 tests ... OK`: 14 adapter-contract methods (seven each on fake and HTTP), 19 workflow methods and four cutover/arithmetic methods. The two end-to-end workflow methods each contain fake and HTTP subcases, not extra unittest methods. The content validator passed with four chapters, 33 case links, 17 sources/reviews, 27 claims, two examples and 14 changed-condition exercises. The independent script exited zero and reproduced the results above. No dependencies, CI or deployment were used.

The author records say 36 methods in `verification.md:9,15`, `validation-results.json:7`, `handoff.md:13` and the changelog. Those are prior author receipts, not evidence that this review ran only 36. Preserve their historical scope; attach a current receipt of 37 rather than silently rewriting history. Passing the content validator proves local reference/shape checks, not that the changed-input defects above are absent.

## Chapter and learning coverage

| Unit | Recognition, method, calculation, verification and transfer judgment |
|---|---|
| Chapter 1: organization to system | Concrete disagreement among procurement, warehouse and accounting leads naturally to separate facts, authority, versions and lifecycles. The complete procurement calculation preserves units, exclusions, authorization and remaining obligations. Three variations identify changed assumptions. The allocation concurrency and stale-version tests exercise meaningful parts of this chain. Preserve the explanation of why nine paid units do not close the purchase. |
| Chapter 2: enterprise frontend | The seven page types are selected from user decisions rather than visual labels. A continued invoice example connects view state to command/version behavior; the batch arithmetic distinguishes candidate, excluded, submitted and outcome denominators. UI/browser behavior is a proposed acceptance checklist, not an executed frontend. Prerequisites are supplied by chapter 1; grid keyboard behavior remains external implementation work. |
| Chapter 3: schemas, tools and completion | Three analysis layers are explicitly editorial terminology. The example distinguishes plan revision, configuration version, persisted intent, unknown result, effect and business acceptance. This is the strongest bridge to implementation; EMR-01 directly weakens its final acceptance check. EMR-02 and EMR-03 identify narrower extension limits. The explanation of external uncertainty and same-intent recovery should not be shortened away. |
| Chapter 4: implementation reality | Costs carry units and a two-year horizon; cutover counts distinguish transferred obligations from finished work; training distinguishes attendance from competence. Migration tests cover states, IDs and reference presence, not the existence or correctness of external attachments, actual role training or live cutover. The prose and lab scope mostly keep those levels distinct. |
| README, lab and terminology | Intended reader and two synthetic examples are stated. Money is integer fen, execution time uses UTC and the lab explicitly defines its simplified minute window. Important abbreviations receive expanded forms or index entries. `accepted`, `applied`, `settled`, `closed` and business acceptance remain distinguished. The lab is deliberately smaller than a complete document-management or authorization system. |
| All 33 case connections | Every row supplies a transferable relationship, changed boundary and reading task. The connections preserve distinctions such as clinical validity versus payment acceptance, permission versus risk score, and booking versus total work order. This subreview checked the table's pedagogy and source links; it did not re-audit all provider assertions in the destination cases. |

Chapter transitions are explicit: organization → interface → agent contract → implementation responsibility → cross-case investigation. Repeated unknown/effect/acceptance distinctions have a teaching function and should remain at independent decision points. No blanket reduction of explanation or replacement of the full paragraphs with checklists is recommended. Shorter headings, visual sequencing and final wording remain Claude's editorial decisions.

## Evidence identity and boundaries

The source catalog separates 17 source facts, five inferences and five synthetic claims. The RFC 9110 HTTP 202 semantics are a protocol-standard claim. W3C APG grid behavior is authoring guidance; do not relabel the pattern as a universal component implementation or conformance certificate. Carbon and GOV.UK are design-system guidance. Palantir's objects/actions/permissions and Camunda 8.8 worker/compensation semantics are provider-specific documentation. Pact describes a testing approach/framework with explicit limits. Microsoft Dynamics 365 implementation guidance supports scoped implementation practices, not universal legal duties or measured benefits.

The seven frontend patterns, three schema layers, five completion gates, organization model and investigation method are editorial synthesis. Purchase policy PUR-3, quantities, money, approvals, operation IDs, migration states, training results, costs and the local HTTP protocol are synthetic teaching designs. In particular, mapping payment `applied` to `settled` is expressly a local protocol definition in `lab-guide.md:35`, not a bank/API industry guarantee; it is not a finding against the book.

This subreview used the repository's original-source records to assess attribution and boundaries, and did not reopen all 17 external pages. No provider statement was newly certified from a search snippet. Existing external pages remain unsnapshotted dependencies. No authentication, real access revocation, provider persistence, full process-crash schedule, browser/assistive-technology behavior, organization rollout, professional compliance determination or learner study was performed. Those omissions are disclosed by the lab and were not reported as implementation defects. The whole-book reviewer owns final aggregation, repository-wide validation and delivery.
