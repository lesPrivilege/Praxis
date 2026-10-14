# SaaS whole-book review

Independent review of public `lesPrivilege/Praxis` at frozen commit `cd8d77b6166a6fc566f6aa09b4d9af3e11537408`, dated 2026-10-14. This branch contains review artifacts only. Claude retains final writing, editing and visual design authority.

The review finds **four medium and eight low issues**, with no new high-severity finding in scope. The book's learning path and explanatory reasoning are worth retaining; the main repairs concern one enterprise acceptance guard, a lost quantity qualifier, a wrong transfer target and a missing verification entry. The existing integrator and its delivery branch are outside this review's write scope.

- [Whole-book report and priorities](review.md)
- [Adjudicated findings, exact paths and acceptance checks](findings.json)
- [Coverage, prerequisites, routes and evidence limits](coverage.md)
- [Enterprise technical review](enterprise-review.md), [independent probes](enterprise-probes.py) and [results](enterprise-results.json)
- [Case reading: finance and commerce](cases-finance-commerce.md), [health and industry](cases-health-industry.md), [people and data/AI](cases-people-data.md)
- [Book structure scanner](book_checks.py), [manifest, heading inventory and results](book-check-results.json)
- [Existing structural validator receipts](structural-checks.json), [delivery checks](delivery-checks.json) and [primary-source read scope](sources.md)

Reproduce the independent observations from the repository root:

```sh
python3 -B docs/reviews/saas-whole-book-review-20261014/book_checks.py
python3 -B docs/reviews/saas-whole-book-review-20261014/enterprise-probes.py
```

The enterprise probe exits successfully when the frozen observations reproduce, including defects. This is not a repair claim. It uses synthetic local data and standard-library code. Both original enterprise chains recompute correctly; the supplied enterprise suite passes 37 test methods, despite the additional findings.

The prior case/foundations audits were read to avoid duplicate repair work. The writing-research candidate informed review questions without becoming new policy. All 49 chapter bodies received a full prose read across the review team; no human novice, live provider, browser, load or AI-model study was performed. The final delivery response records the pushed commit and independently read remote SHA; no self-referential commit identifier is embedded here.

Repository validation has one documented scope blocker: `Missing README: docs/reviews`. Adding that parent index would violate the instruction to write only inside this review directory, so it was not attempted. The review directory itself has this README; its links, JSON, finding locations and independent probe reproduction pass.
