# Finance and commerce case review

Reviewed frozen commit `cd8d77b6166a6fc566f6aa09b4d9af3e11537408` on 2026-10-14. This is the assigned teaching/editorial slice of the independent whole-book review. No textbook, source, test, index, or delivery-branch content was changed. Claude retains final writing and visual-design decisions.

All twelve assigned case bodies were read in full: H01, H02, H03, V12, V13, V14, X02, V04, V05, V06, V15, and V16. Both package introductions were also read, together with root `AGENTS.md`, the Kit/Write/Prose entry pages, prose grammar and review rules, and shared evidence rules. The earlier case audit at `5c5f7098561d4d87403986d6c3edf58cde20a5e7` was read before forming findings. Its existing findings are separated below.

The twelve chapters generally succeed at recognition, method selection, calculation, verification design, and transfer. The strongest passages make the boundary of a method visible through a small counterexample, instead of merely naming an algorithm. The new findings concern one wrong transfer destination, one missing verification entry, and local prerequisite definitions. No new high-severity teaching defect was established in this slice.

## New findings

Severity here concerns the reader's task: **medium** materially misdirects method selection or an explicitly promised learning step; **low** is a bounded definition, navigation, or editorial repair. These are not claims of unsafe production implementations.

### FC-01 — Manufacturing transfer points to the BI chapter

- **Severity:** medium; transfer selection.
- **Location:** `projects/books/saas-engineering/packages/commercial-finance/H03.md:143`; `vault/distilled/saas-engineering-atlas/transfer-proposals.json:67`.
- **Evidence:** `TR:H03:H07:dependency-not-capacity` is explained using production scheduling, equipment, materials, and process constraints. H07 is titled “数据变化如何成为可信的 BI 发布” at `projects/books/saas-engineering/packages/data-ai-control/H07.md:1`. V07 is the manufacturing/design case, “一件产品怎样带着设计依据走到收款”, at `projects/books/saas-engineering/packages/industry-networks/V07.md:1`. The transfer-proposal occurrence was compared exactly with H03 line 143 and matches it; the error is propagated, not an independently worded interpretation. The proposal is classified `additional-reading`, rather than an integrated transfer-map row.
- **Reader consequence:** a reader recognizing resource-constrained production scheduling follows the stable identifier to a BI publication example. The otherwise useful distinction between dependency order and resource feasibility loses its intended destination.
- **Remedy:** decide the intended transfer. If manufacturing is intended, retarget to V07 and update the stable ID and all its occurrences consistently. If BI is intended, retain H07 but replace the production-specific explanation with H07's actual dependencies and missing conditions. Provide a clickable case link beside the ID.
- **Acceptance:** following the repaired reference reaches the case described in the prose; the proposal context and any generated index agree. Preserve H03's seven-hour/nine-hour derivation and the distinction between topological order and resource feasibility.
- **Novelty:** not part of prior IR-01–IR-08.

### FC-02 — Finance introduction promises three commands but supplies none

- **Severity:** medium; verification entry.
- **Location:** `projects/books/saas-engineering/packages/commercial-finance/README.md:60` and `:63`.
- **Evidence:** “本地可执行计算与反例检查使用 Python 标准库：” is followed by two blank lines, then “第一条…第二条…第三条…”. There is no intervening code block or command list. The source package README is now a three-line Books pointer, so it does not supply the missing instructions. `vault/distilled/saas-engineering-atlas/packages/commercial-finance/checks.py:3` still says to run with the path shown in README. The three commands can be recovered from the source `CHANGELOG.md:24`, `:28`, and `:30`, but this requires leaving the learning path to search delivery history.
- **Reader consequence:** a novice reaches the package's advertised verification step without knowing what to run or which of the three descriptions refers to which checker. The global Books validation page is an alternative route, so this is a local entry failure rather than absence of executable checks.
- **Remedy:** restore named, linked commands or link to a dedicated package verification page. State the working directory and standard-library requirement. Keep the existing statement that these checks do not establish browser, provider, concurrency-database, performance, or AI-evaluation success. Replace ordinal descriptions with checker names so omission or reordering cannot silently detach their scope.
- **Acceptance:** from the package page alone, a reader can identify and run the arithmetic suite, structure checker, and evidence checker, and can distinguish their coverage. Do not make the full repository build or registry mutation a prerequisite for a learner's first arithmetic check.
- **Novelty:** distinct from IR-05's empty inline case references; this is an entire promised command block missing from the package entry.

### FC-03 — H01's first executable formula assumes unexplained notation

- **Severity:** low; calculation prerequisite.
- **Location:** `projects/books/saas-engineering/packages/commercial-finance/H01.md:63`.
- **Evidence:** the first cumulative formula uses `floor` and `clamp(t−s,0,e−s)` without a local definition of those operators. A search of the Books tree found no other `clamp` explanation. The subsequent 100-cent/three-day example teaches cumulative rounding well, but does not show why an observation before service starts produces zero or why an observation after its end stops at the full amount.
- **Reader consequence:** readers can copy the displayed in-range numbers without necessarily being able to calculate the formula at its boundaries or translate it into code correctly.
- **Remedy:** add a short local gloss: `clamp` restricts elapsed time to the stated lower and upper bounds, while `floor` rounds down to integer minor units. Add one before-start and one after-end substitution, or link an immediately available equivalent piecewise definition. No new algorithm or long prerequisite chapter is needed.
- **Acceptance:** a reader can obtain 0 before `s`, the full amount at or after `e`, and the existing 33/33/34 allocation without guessing operator meanings. Preserve the nonnegative-input and equal-time-unit restrictions.
- **Novelty:** not part of the earlier case audit; this is explanation coverage, not a failed numeric example.

### FC-04 — A few domain abbreviations never acquire a local meaning

- **Severity:** low; terminology/first use.
- **Locations:** `projects/books/saas-engineering/packages/commercial-finance/V12.md:5`; `projects/books/saas-engineering/packages/commercial-finance/V13.md:5`; `projects/books/saas-engineering/packages/commerce-property/V15.md:25`; `projects/books/saas-engineering/packages/commerce-property/V16.md:23`.
- **Evidence:** `CU`, `PCCO`, and `IWMS` appear without an expansion in the entire Books tree, including `terminology.md`. V12 does define the precision as 0.01 CU; the omission is the identity of the synthetic currency label, not its arithmetic precision. V15 gives useful surrounding contract distinctions but does not connect `PCCO` explicitly to its provider object. V16 explains the category's coverage but leaves the category acronym opaque.
- **Reader consequence:** readers cannot reliably distinguish an invented unit label, a provider-specific object abbreviation, and a product-category term. That distinction matters to selecting documentation and transferring a method.
- **Remedy:** define CU locally as the example's fictitious currency unit; expand PCCO from the cited provider's object name and retain its provider scope; expand and explain IWMS at first use or omit the unused acronym. Add index entries only where those terms are useful recurring navigation. Verify provider wording from the existing primary source before editorial adoption.
- **Acceptance:** the three names have visible meanings and scope at their teaching entry points. The repair must not imply a currency standard, a cross-provider PCCO contract, or that workplace-management coverage establishes residential-deposit policy.
- **Novelty:** not part of prior IR-07; these are missing definitions, not malformed citations.

## Prior audit overlap and editorial options

The following are **not new independent findings** and should remain attached to the existing repair work:

- Prior **IR-07** already covers V15 line 73's “记录这组原创演算”, V16 line 78's malformed construction note, and V06's broken citation punctuation. Do not reopen them as new technical defects.
- The same citation-punctuation family also appears at V04 lines 66 and 68 and V05 lines 21 and 45 (`；）。`). These are additional locations for the existing copyedit pass, not a new defect category.
- V15 line 117 ends with “HTML 和 motion 的组织方式留给本地实现者”. This is an additional authoring-handoff sentence in the same IR-07 family. Keep the preceding useful proposal to vary paths, cumulative measurement, and the approved ceiling; move only implementation-authority narration to handoff material.
- Prior **IR-08** already covers the missing scalar GiST prerequisite at V06 line 87. This slice does not duplicate its PostgreSQL implementation audit.

Two optional low-priority choices belong to Claude's editorial judgment, not a technical acceptance gate:

- X02 line 79 repeats the label “演算：手算：”. A concise heading such as “演算：个别账与集团报告” can retain the scope. V14 line 72's “演算：手算整数分配与现金尾差” could similarly lose the redundant “手算”; preserve the separate share and cash calculations.
- All seven P01 cases repeat the same one-sentence route announcement at line 15. Some repetition supports independent chapter entry. If trimming, retain the package route explanation and the case-specific recognition tables; do not remove repeated warnings about unknown payments, identity scope, or evidence solely because they recur.

## Coverage and content to preserve

Every row below includes a full prose read, including the recognition table, object model, calculation, failure/recovery discussion, checks, variants, and transfers. “Source comparison” refers to the source JSON's main worked/check values, not a complete independent audit of every lifecycle or provider claim.

| Case | Recognition and method selection | Calculation / verification / transfer assessed | Content that should not be cut |
|---|---|---|---|
| H01 | Distinguishes price mutation, cross-period service, cancellation, and cash | 27,000 + 9,000; day-20 22,000; 5,000 credit; cumulative rounding; credit and unapply variants | Why cumulative differences conserve cents; paid is not always cash; genuine external corrections are not merely stale events |
| H02 | Cumulative allocation, four-way evidence, unknown bank result | 70 of 75 accepted, B10 hold/B5 repair; 757.50 total; downward quality revision; services variant | Match anchor versus approval evidence; preserving in-flight allocation during downward correction; facts versus authorization |
| H03 | Source-level reconciliation, frozen periods, task dependencies | 1,050.50 versus 1,707; +656.50 difference; zero-net missing pair; seven versus nine hours; late v2 | Source coverage beyond a balanced total; cutoff versus business completeness; resource schedule derivation. FC-01 affects its transfer destination |
| V12 | Effective-date replay, funding evidence, quote validity | 703.50, backdated 702.89, late-payment 0.70, reversal 1,015; tranches | Full interval reasoning, explicit rounding point, authorized effective date, independent genuine cash arrivals |
| V13 | Estimates versus liability decision; responsibility grouping; deductible order | R/P/U and 2,500 available; high-loss 8,000 versus 7,500 counterexample; lower-reserve refusal | Reserve is neither cash nor adjudicated liability; fees and different claimants cannot fill another responsibility's shortfall |
| V14 | Cancel/fill race, integer allocation, corrections | 65 shares/651; 33/19/13; cash 330.51/190.29/130.20; correction to 60; lot infeasibility | Share and cash allocation separately; tie-breaking bias; preserved trade corrections and post-settlement responsibility |
| X02 | Physical versus virtual documents; reporting scope; pair identity | 60-unit physical movement; internal 540; group 720/360; +/-10 mismatches; 120 unrealized-inventory variant | Group elimination does not discharge legal-entity payment; virtual receipt is not physical receipt; real returns preserve source identity |
| V04 | Split fulfillment, frozen discount, independent returns and money | Unit discounts 286/286/286/72/71; refund 4,642; net settlement 8,097; fixed shipping-cost counterexample | Stable unit attribution without requiring serial numbers; gross handover is not erased by returns; customer net cash is not profit |
| V05 | Modifier configuration, split check versus split tender, irreversible kitchen handoff | 3,887/3,512; unknown 4,399 reserves capacity; cash given versus applied | One shared dish remains one kitchen task; paper print lacks reliable electronic acknowledgement; unknown card results cannot justify normal recollection |
| V06 | Night capacity versus continuous room; account routing; authorization versus cash | Three nights versus 69/73 actual hours; empty room intersection; 460/100/80/280; company route refund 40 | Continuous-room counterexample and temporary physical reservation; local dates/timezone; late charge belongs to old guest; preauthorization is not payment |
| V15 | Technical clarification versus contract authorization; unique graph reachability; cumulative quantities | Approved 6,000; 3,400 then 2,350 incremental; 350 unpaid/250 uncertified; later-rate 820 | Edge direction and reverse adjacency; physically completed unauthorized work stays recorded; graph paths do not duplicate commercial approval |
| V16 | Organization/person/tenancy identity; repeat visits; expense versus responsibility | Deposit 3,000; first refund 1,900; final deduction 800/refund 2,200; unknown first refund only releases new 300 | Future signed tenancies already reserve rights; resource/permission checks on rescheduling; dispute and refund buckets; historical access differs from entry permission |

The H01→H02→H03 progression is explicit and useful. P05 transitions reuse one shared model while showing where quantities become dates, irreversible preparation, or disputed liability. Most method names are grounded in an observable symptom. Checks generally specify both expected results and the evidence needed to claim them, and the book consistently distinguishes proposed end-to-end checks from executed teaching functions.

## Source, standards, and copy boundaries

- The twelve case prose bodies have one current location under Books. Neither source package contains duplicate case Markdown files at this SHA. Each source README points to its Books package; a byte-for-byte duplicate-body comparison is therefore not applicable. Historical or snapshot copies were not substituted for the frozen reader text.
- Main numeric examples and check expectations were compared with all twelve source JSON files. No main-example numeric discrepancy was found in those sampled fields. The two packages contain 82 and 66 check definitions respectively; this count is inventory, not executed test coverage. Full node/edge/lifecycle equivalence was not claimed.
- The H03 transfer-proposal occurrence was checked by exact string comparison against its Books paragraph and matched. This proves FC-01 is shared by the prose and proposal index; it does not prove the target is correct.
- Provider boundaries are generally explicit and worth retaining: H02 distinguishes Oracle configuration semantics from chosen tolerances; V13 distinguishes Guidewire concepts from the R/P/U model; V05 separates Toast object meanings from its synthetic discount policy; V06 names folio as a teaching term rather than a Mews API object; X02 separates Kingdee workflow evidence from Microsoft consolidation examples.
- V14 explicitly identifies FIX as a protocol reference and does not claim full implementation. The other provider examples are not presented as industry standards. No accounting, credit, insurance, construction, housing-law, or regulatory compliance conclusion is established by this review.
- No external web pages were reopened in this slice. Findings are based on the supplied frozen repository, its quoted source boundaries, and local execution. Current provider wording, link availability, and external standards currency were not revalidated.

## Executed checks and remaining limits

Executed on the frozen workspace using Python 3.12.14:

```text
python3 vault/distilled/saas-engineering-atlas/packages/commercial-finance/checks.py
exit 0; 18 unittest tests; OK

python3 vault/distilled/saas-engineering-atlas/packages/commerce-property/synthetic_checks.py
exit 0; status pass; 16 tests; 0 failures
```

The P01 suite reproduces its stated pure-computation cases. The P05 suite additionally reports 819 finite allocation inputs and bounded local SQLite interleaving/recovery checks. These suites do not establish provider integration, PostgreSQL behavior, production concurrency, browser accessibility, UI completion, load targets, AI quality, or legal validity. Their denominators should not be summed into a production coverage percentage. No new test implementation was written.

No blockers prevented this assigned review. The root reviewer owns consolidation, repository-wide validation, commit, push, and SHA verification. This agent made no git mutation and wrote only this review file.
