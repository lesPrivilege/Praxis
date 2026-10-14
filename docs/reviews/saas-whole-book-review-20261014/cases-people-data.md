# People-service and data/AI cases review

Frozen review target: `cd8d77b6166a6fc566f6aa09b4d9af3e11537408`. Review date: 2026-10-14. This independent reading covers all eleven case chapters in `people-service` and `data-ai-control`, both package introductions, their corresponding source JSON titles/scopes/check definitions, and relevant navigation and terminology indexes. No reader content or delivery branch was edited. Claude retains final writing and visual design authority.

The assigned cases give a novice a credible recognize → select → calculate → verify → transfer route. Their strongest feature is that a calculation's result does not silently become authority to approve, pay, release, restore access or delete data. Every case supplies a concrete changed-premise exercise and explains the limit of transfer. No newly established high-severity error emerged in this reading. One implementation-facing ambiguity and three bounded teaching/editorial improvements merit attention.

## Findings

### PD-01 — Define X01's answer-delivery boundary

**Severity: medium. Category: teaching contract ambiguity.**

- Locations: `books/saas-engineering/packages/data-ai-control/X01.md:3`, `:40`, `:42`, `:102`, `:125`; `vault/distilled/saas-engineering-atlas/packages/data-ai-control/check_x01.py:87`, `:213`; `vault/distilled/saas-engineering-atlas/packages/data-ai-control/X01.json:1000`.
- Evidence: the opening describes tokens reaching the page as the start of streamed output; the delivery section offers SSE and resumable sequence numbers. The processing sequence and revocation example then place permission rechecking after generation and before answer delivery, with rejected content discarded. The local check only evaluates a Boolean `may_deliver` guard against captured/current epochs; it does not model successive answer chunks or resumed answer delivery. The chapter correctly says SSE has not been tested.
- Reader impact: an implementer could interpret the earlier paragraphs as live model-token forwarding and the later guard as a single end-of-run check. Another valid reading is that the stream carries progress while answer content remains buffered, or that the final check applies at every delivery boundary. The text does not choose among these contracts. **This is not evidence of an implemented leak or a claim that the existing test misreports SSE coverage.**
- Remedy: explicitly state whether SSE carries progress only until a complete answer passes checks, or whether answer chunks are delivered incrementally. For buffered answers, describe the authorization boundary at initial and resumed delivery. For incremental answers, define when current authorization is rechecked, how revocation stops subsequent delivery, how stored chunks are protected on reconnect, and what already-delivered content cannot be recalled. Keep actual consumption and billing treatment independent of delivery success.
- Acceptance: a small trace should place revocation (a) before the first answer byte, (b) between answer chunks, and (c) before reconnection/replay. Under the stated policy, subsequent unauthorized content must not be delivered; prior authorized delivery remains a recorded fact; consumption remains explainable. Label this as a new synthetic exercise unless an actual transport test is implemented.

### PD-02 — Expand the solution-family and method acronyms used for the next research step

**Severity: low. Category: terminology/prerequisites.**

- Locations: `books/saas-engineering/packages/people-service/H05.md:108` (`ITSM`); `books/saas-engineering/packages/people-service/V19.md:65` and `:100` (`PSA`); `books/saas-engineering/packages/data-ai-control/H08.md:158` (`SIEM/SOAR`); `books/saas-engineering/packages/data-ai-control/H09.md:17` (`CAS`), `:67` and `:163` (`CLM`); `books/saas-engineering/packages/data-ai-control/H07.md:36` (`DML`); `books/saas-engineering/packages/people-service/V17.md:5` and `:80` (`REST`).
- Evidence: these terms are used in explanatory prose or selection routes without expansion. They also have no entries in the central `terminology.md`/`terminology.json`, foundations terms, or enterprise-mechanisms terms inspected at the frozen SHA. This differs from the successful local expansions of HRIS, SCIM, SLA, CMDB, LMS, SIS, CLR, EDRM, SSE and ACL.
- Reader impact: the final research paragraph sometimes names a solution family the novice has not been taught to recognize. `CAS` additionally names a method at the selection table before the chapter explains its conditional-update behavior.
- Remedy: add an English expansion and a brief functional meaning at first explanatory use, with one shared index entry. Keep stable English names instead of inventing a new Chinese label. For `CAS`, link the term to the existing write-condition example; for the product categories, say which responsibility the category supports. Do not add product facts without source review.
- Acceptance: a reader following only the case and its linked term entry can explain the acronym's function and distinguish it from adjacent categories. Root should consolidate these locations with vocabulary gaps reported by other reviewers.

### PD-03 — Move production directions out of reader prose

**Severity: low. Category: authoring residue.**

| Location | Material to move or recast | Material to preserve |
|---|---|---|
| `books/saas-engineering/packages/people-service/README.md:45` | JSON is saved for later `HTML/motion` use; instructions granting layout/motion freedom | The recommended case sequence and why H04 precedes H05/H06, then V17/V18, then V19/V20 |
| `books/saas-engineering/packages/people-service/H05.md:43` | The closing purpose clause about later motion presentation | The distinction among authorization, requests, results, restoration evidence and runtime dependencies |
| `books/saas-engineering/packages/people-service/H06.md:106` | “本地实现自由选择布局与 motion” and production-facing label directions | Changing message order/calendar/version and observing time intervals and the close guard |
| `books/saas-engineering/packages/people-service/V18.md:102` | “HTML 与动效形式留给后续实现” | The content-versus-occurrence experiment, the unresolved-item constraint and source links |
| `books/saas-engineering/packages/data-ai-control/H07.md:162` | “HTML 和动效可以自由组织” | Changing arrival time, revision order, metric and permission; observing calculated versus externally published results |
| `books/saas-engineering/packages/data-ai-control/H08.md:160` | Reader footer points to “整合交接” | The evidence locator and applicable limitations |

These are additional locations beyond the preceding case audit's IR-07 punctuation/authoring fragments. Move production instructions to the existing handoff rather than deleting the nearby learning experiment. “Change this input and observe that invariant” is useful reader work, including the experiments in H04:98, H05:104, V17:112 and V19:96. It should not be removed merely because it mentions a demonstration or UI.

Acceptance: the chapter reads continuously as teaching material; implementation freedom and integration status live in the handoff; the same experiments, qualifications and source access remain available.

### PD-04 — Provide a short case-to-check path for independent verification

**Severity: low. Category: verification navigation.**

- Locations: `books/saas-engineering/packages/people-service/H04.md:76`, `H06.md:87`, `V17.md:102`, `V18.md:92`, `V19.md:73`, `V20.md:102`; `books/saas-engineering/packages/data-ai-control/H07.md:142`, `H08.md:142`, `H09.md:138`, `X01.md:125`; book-level `validation.md:5` and `:17`.
- Evidence: case tables clearly define future checks, but most assigned cases send the reader to JSON/evidence/handoff records to discover the executable synthetic check. H05:92 is a useful counterexample because it links its local check directly. The book-level validation page does expose the all-book runner; that is a real verification path, so checks are not missing. It does not offer a case selection option, and the same page mixes reader checks with repository-registry maintenance commands.
- Reader impact: a reader who has hand-calculated one case has to leave the chapter and inspect author/evidence records or run the whole collection to compare that calculation with the supplied code. This adds avoidable friction to the advertised independent verification step.
- Remedy: add one compact “run this example” link per case or one shared case-to-command table. Show the repository-root command, the principal expected number(s), and the specific limitations of that script. Keep the future end-to-end table separate and preserve its evidence requirements. There is no need to copy the test implementation or historical test counts into every chapter.
- Acceptance: from a chapter a new reader can find its executable check in one navigation step, run it without installing packages, identify the matching result, and state which real provider/UI/concurrency behavior it does not establish.

## Coverage and retained reasoning

All assigned prose was read, not just headings or search hits. Arithmetic below was independently recomputed from the stated inputs while reading; this subreview did not rerun the existing case scripts or conduct new provider research.

| Case | Recognition, method and hand calculation checked | Verification and transfer assessment | Preserve during editing |
|---|---|---|---|
| H04 | Person versus employment; effective/recorded time; three-way interval intersection: 7,000; revised termination: 6,200; later start: 6,400 | Local versus external access evidence and rehire boundary are explicit. Stale-dispatch test coverage is already IR-04 and is not reopened here | Negative adjustments do not authorize deductions; account creation does not begin wage accrual; prior payroll evidence remains immutable |
| H05 | Incident/change/problem separation; pause union gives 50, not 45, effective minutes; new pause gives 40; reverse dependency walk | Incorrect edge direction and missing graph edges are distinct counterexamples; restoration/closure and root-cause work remain separate | Recovery may be temporary; graph reachability is not causality; extra workers cannot repair policy cycles or resource conflict |
| H06 | Action/resolution/acceptance/message cursor; responsibility/calendar intersection gives 3 team hours over 20 wall-clock hours | Both confirmation/new-message commit orders are explained; waiting-information delivery is distinguished from resolution acceptance | The customer can reject a technically successful action; unsent information requests do not pause the clock; administrative closure cannot fabricate acceptance |
| V17 | Bulk/delta distinction; weighted normalized grades 78/86; missing work is incomplete; exempt-only score 100; correction gives 84 | Approval versus revision commit order is explicit. OneRoster exchange capabilities are carefully separated from school policy | Missing/zero/excused remain different; approved attempt identity is a prerequisite; an issued transcript is not silently rewritten |
| V18 | Blob/occurrence/decision separation; 6 instances → 4 contents → 2 deliverable instances; AI arithmetic 18/20 recall and 18/28 precision | Hold dependencies, dispatch/withdrawal race and legal authority boundaries remain explicit | Same bytes do not determine privilege; local cancellation cannot recall delivered material; protected other-case relationships are not disclosed |
| V19 | Scarce-skill matching; 18 approved hours, 3,600 candidate amount, 3,000 released and 600 excess; unknown reserve leaves 600 after cap rises to 10,600 | Fixed-fee and time-window variants correctly change the method's assumptions | The paragraph separating Monday's 8-hour scheduling exercise from the week's 18-hour billing exercise; original hours are not cropped to fit a bill; unknown reservations survive cap revisions |
| V20 | Dependency plus availability: planned 120–180, actual 130–190; 90+60 work minutes; labor 300 plus parts 200; receipts 300/200 | Cancellation of an appointment does not cancel its requirement; one-of and multi-person changes identify new constraints | Work time versus elapsed time; range acceptance versus posted/paid; a legal schedule is not claimed globally optimal |
| H07 | Business/event time versus reception; D1 220 → D2 200; M2 first completion 300; lineage direction and filter dependency | Historical publication and current access are distinguished; synthetic model and provider stream facts are scoped | The difference bridge, window boundary, old-contribution withdrawal and missing-lineage-edge counterexample |
| H08 | Source/subject identity; anchored 10-minute windows; scores 100/70, weak-link removal 90; AI 16/24 precision, 16/20 direct recall, 19/20 human-queue coverage, 192 minutes review | Authorization expiry, current-role recovery and unknown effects have concrete checks; SIEM/SOAR expansion is missing | Score is not calibrated probability; apparent idempotency can affect new sessions; 95% human routing coverage is not model recall |
| H09 | Bundle/input dependencies; serial 6.5 hours versus dependency-only 3.5; added approval or shared L/F reviewer gives 4.5; export generations/CAS | Writes before/after commit use distinct destination versions; unknown dispatch and cancellation facts are preserved | The 3.5-hour schedule is a resource-free lower bound; original signed facts survive cancellation intent; conditional updates are a synthetic adapter contract |
| X01 | Tenant/membership; 1,300 consumed versus 1,000 billable and amount 2; two 800-unit reservations under 1,500; six-item fixture yields 3/6 | Quota hard-limit precondition is explicit; model scoring is honestly synthetic; answer streaming/revocation boundary needs PD-01 clarification | Failure cost is not automatically billable; unknown consumption retains reservation; permanently queued offboarding work has a termination path |

Both package introductions provide genuine transitions rather than only a catalogue. The people-service introduction connects authority, effective time and acceptance; the data/AI introduction distinguishes evidence and execution chains. These introductions should not be compressed into lists of technologies. Their repeated warnings about unknown outcomes and separate authority are necessary at standalone entry points, not mere stylistic duplication.

Most headings identify the actual decision or calculation. Several are long explanatory statements, but a blanket shortening pass would risk erasing their thesis. Any concise-heading edit should preserve conditions in the adjacent lead paragraph; no severity is assigned solely for sentence-shaped headings.

## Source and evidence boundaries

- The two source-package READMEs contain three-line pointers to Books, not parallel copies of the case prose. All eleven source JSON titles match the corresponding Books title. Their checked scope statements and hand-calculation check definitions agree with the examples listed above. This is a targeted title/scope/check comparison, not a claim of exhaustive semantic equivalence of every JSON lifecycle and edge.
- Representative standards/provider/synthesis distinctions are particularly clear in V17:5/30/38 (OneRoster versus school/atomic-batch policy), V18:7/23 (EDRM model and Relativity behavior versus case decisions), V19:55/63 (Certinia cap reference versus local release semantics), V20:19/21 (Dynamics configuration versus additional acceptance rule), H07:36/38/94 (Snowflake capabilities versus synthetic history/manifest contract), H08:63/69/71 (product roles/engine-specific access behavior), and H09:25/92/98 (Ironclad facts versus custom version and ERP protocol).
- No public source was reopened for this editorial/teaching pass. These scope distinctions were assessed from the repository's prose and source records; provider truth and current product behavior were not independently revalidated here.
- The earlier audit at `5c5f7098561d4d87403986d6c3edf58cde20a5e7` was read in full. IR-01 (H07 revision conflict), IR-02 (H08 identity collision), IR-03 (X01 eligibility domain), IR-04 (H04 rehire test boundary), IR-05 (empty citations) and assigned IR-07 punctuation are recorded there and are not duplicated as new findings. No repair claim is made for them at the frozen review target.
- Existing checks were inspected where needed for PD-01 and verification navigation. No new runtime evidence, performance measurement, provider integration, browser result or model evaluation is claimed.
