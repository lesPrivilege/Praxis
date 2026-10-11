# Independent evidence and architecture review

Review date: 2026-10-11. Target: PUBLIC Praxis branch `cloud/art-software-grammar-atlas-20261011`, requested baseline `575fae1b2dbcffdf5c0fdc91713a6cddcd154d5e`. This is a review of the in-progress working tree, not a commit approval. No implementation files were edited and no commit was made.

Requested execution configuration, as supplied by the parent orchestration record: model `gpt-6-astra`, reasoning effort `high`, fork turns `none`. This records the requested configuration only; no claim is made about the underlying model identity.

## Judgment

The prose is a substantive, bounded reference-book sample. It generally preserves attribution, separates modern software inference from source practice, and distinguishes text reading, viewing, source inspection, and runtime testing. I did not find a sampled vendor claim silently promoted to tested behavior. The main acceptance issue is the machine-readable graph: some edge semantics conflict with the declared entity distinction, and precise source locators need repair. This is conditional acceptance after the concrete P1 fixes below and final integration checks, not an exhaustive historical or cultural endorsement.

## Prioritized findings and acceptance conditions

### R1 · P1 · Relation directions and endpoint types conflict across streams

Observed in `vault/provenance/art-software-atlas/spatial/entities.json:65–69`: exemplar → `documents` → source, opposite to editorial/discovery/ecosystem source → `documents` → entity. In `ecosystem/entities.json:184–195`, source IDs `D01` and `ASA-A-08` use `implements` to point to substrates, although their evidence is a specification that describes the format. A source document does not implement its documented substrate. The prose explicitly makes the distinction, but automated queries need not read prose limits.

Acceptance: define permitted direction and endpoint kinds for each relation, change these edges to source → `documents` → entity, and validate endpoint kinds in addition to ID existence. Verify that an inverse query “which evidence documents this exemplar/substrate?” returns all affected records. Do not solve this merely by loosening the schema to accept either direction.

### R2 · P1 · A principal material source points readers to the wrong chapter

`material/cards/asa-m-01-weaving-abstraction-ancient-and-modern.md:16–17` and the corresponding catalog claims place the backstrap loom, tapestry, and structural-diversity passages in “Embracing the Grid.” Independent reading of the actual Met PDF places backstrap/body-context text in Joanne Pillsbury’s subsequent “Infinite Pattern: Weaving in the Ancient Andes,” PDF page index 9 (printed page 8). Structural diversity/slit tapestry/double cloth occurs at PDF index 16 (printed page 15). The facts sampled are supported, but the exact locator and chapter attribution are not.

Acceptance: correct card and catalog chapter/page locators for C2/C3; locate the tapestry passage separately rather than assuming it shares the backstrap paragraph. Preserve the joint authorship of the introductory chapter while identifying Pillsbury’s chapter for these specific claims. Recheck the material grammar’s source pointer. This is a source-first retrieval defect, not evidence that all the claims are false.

Primary check: [Met PDF](https://resources.metmuseum.org/resources/metpublications/pdf/Weaving_Abstraction.pdf), the two chapter headings and cited pages.

### R3 · P2 · Several implementation edges are broader than the evidence or entry identity

`temporal/entities.json` gives each of Tone.js, SuperCollider, Processing, and p5.js an `implements` edge to both whole Markdown pages, with a generic basis. Seed API sources support reproducible pseudo-random sequences; they do not themselves establish score visualization, playback, or event scheduling. Processing/p5 entity `grammar_paths` list only rule systems while their edges also target score-and-time. Other streams target stable grammar IDs; these target whole files containing broader or multiple operations.

Acceptance: point relations to canonical grammar IDs and identify the exact local operation supported. Use `informs` for a speculative connection, or retain `implements` only with a clearly stated “candidate, not run” scope and exact API basis. Do not let a whole-file target silently link every source to every grammar on that page. Inspect the generated index for this over-association.

### R4 · P2 · New primary Brown evidence lacks an important limit on predefining events

`temporal/cards/asa-t-10-earle-brown-prefatory-note.md` accurately records direction, rotation, performer response, and duration. Brown’s note also says the primary intention is direct performance without preliminary event definition beyond agreed total time; further determination is allowed only if implicit in the score and notes. That condition is particularly relevant because the derived grammar proposes explicit event tables and realizations.

Acceptance: add a compact, attributed sentence preserving this constraint and explain that the proposed event-list fixture is a modern design experiment, not a faithful realization of Brown’s procedure. The existing “not equivalent” caveat is good, but this specific source condition makes the difference intelligible.

Primary check: [Brown Foundation prefatory note](https://earle-brown.org/wp-content/uploads/Folio-and-Four-Systems-Prefatory-Note.pdf), PDF page index 1, December 1952 section, final paragraph. No score image or performance was inspected in this review.

### R5 · P2 · Corpus identity is occasionally ambiguous between a local research set and an external archive

`editorial/entities.json` calls `ASA-C-ISOTYPE` a bounded set of researched sources, then justifies `contains` an archival leaflet because it belongs to the external Otto and Marie Neurath collection. These are different membership assertions. Temporal/spatial/ecosystem local research corpora and Rhizome’s actual external corpus currently share a kind, which is reasonable, but their ownership/scope must remain explicit.

Acceptance: state whether each corpus is a Praxis research selection or an external collection. For a local selection, justify `contains` as explicit local inclusion; for archive membership, use the actual archive identity supported by the source. Do not infer external holdings from local research membership. No extra ontology is needed if a clear scope field or description and accurate edge basis suffice.

### R6 · P2 · Editorial metadata and receipt language need a final consistency pass

`editorial/entities.json` says the HTML/SVG entity has one synthetic desktop fixture rendered, while its `implements` edge says its code paths are not executed software. That may be intended to distinguish a small probe from proposed production paths, but currently sounds contradictory. The editorial grammar is also wholly English despite repository intake’s Chinese-title/body convention; original author terminology can remain English without making the entire chapter a language exception.

Acceptance: distinguish the tested synthetic fixture from untested proposals with a receipt link and exact scope. Either translate the editorial entry into the established Chinese reference-book language or record a deliberate authorized exception. Do not describe a planned fixture as already rendered without a preserved receipt.

## Coverage and next-research observations, not release blockers

The material entry explicitly avoids treating Andean textiles as one style and distinguishes the Nasca discontinuous structure from continuous cloth. Islamic geometric construction is framed as competing models rather than an all-purpose historical recipe. Isotype credits Marie Neurath, Gerd Arntz, and collaborative editorial work, and rejects universal-symbol assumptions. These are strong safeguards against turning culture into interchangeable effects.

The voice balance nevertheless remains museum/institution-heavy. Living makers/community accounts, local-language terminology, historical manuscript images, and actually viewed/heard works are uneven or absent. Keep that as a named next stream and do not advertise representative art-history coverage. The current bounded-sample framing is an appropriate acceptance boundary. Missing actual visual/audio experience should remain searchable evidence metadata, not just an end-of-page disclaimer.

## Independent source spot-checks

Four official sources were successfully read as text:

- Met Bulletin PDF: supported sampled material facts but exposed the incorrect chapter locators described in R2.
- Brown Foundation PDF: supported sampled author-framework claims and exposed the useful omitted limitation in R4.
- [Figma MCP introduction](https://developers.figma.com/docs/figma-mcp-server/): supports the card’s attributed claims about context extraction, native canvas writing, remote recommendation, skills, and catalog-listed clients. No connection or account permissions were tested.
- [OpenDesign package README](https://raw.githubusercontent.com/nexu-io/open-design/main/design-systems/README.md): supports the three-file minimum, manifest identity/path rules, richer files, and derived-cache relationship. Its final attribution note says brand-reference packages are aesthetic inspirations rather than official brand assets; preserve that distinction whenever describing the ecosystem. No package, guard, installation, or runtime was tested.

Independent opens of the Clark projects page failed with HTTP 402; Science DOI and Morgan object page failed with HTTP 403. These failures neither confirm nor refute the earlier agents’ recorded readings. I did not bypass the blocks or claim independent confirmation of those cards.

## Review limits and final integration gate

Read root/kit AGENTS, Kit Agent, architecture and intake governance; inspected the new atlas architecture, routes, representative deep entries, all six entity files, catalog shapes/sample records, and selected source cards. This was not a full reread of every external source. No claims are made about total source coverage, all visuals, cultural consultation, browser/accessibility compatibility, agent integration safety, or production behavior.

At initial inspection the top-level index/schema/streams and delivery receipts were still being integrated, so their absence was treated as work in progress. Final acceptance requires: generated index/schema validation; relation-kind/direction checks; unique IDs and canonical URLs; no dangling source/grammar/receipt links; known evidence boundaries preserved by index projection; and root repository validation. This review does not substitute for those final checks. The parent should record dispositions next to the preserved report rather than silently rewriting this review.
