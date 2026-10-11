# Fresh-context atlas discovery trial

Brief: visitor-controlled installation guide; short sounds and visual events with meaningful pauses; visitors can stop or trigger progression. Discovery only; no installation design or runtime claim.

## Read order

1. `kit/design/README.md` → the art/software atlas row for “rhythm, pauses or sound, audience control.”
2. `kit/design/references/art-software-atlas.md` → route to `motion/score-and-time.md` and then “按传统、产物、语言或实现条件组合查找”.
3. `vault/provenance/art-software-atlas/facets.md` → scope meanings, exact-value query syntax, cross-scope links, and limits.
4. Read the index facet value lists; ran scoped queries against `index.json` (no verification expected-results files).
5. Opened only the matching `score-and-time.md#asa-g-open-score` entry and the Tone.js / SuperCollider source cards.

## Query results and decisions

There were five invocations across three retrieval intents. All five returned a result; there was no query error or empty-result failure. Invocations 2–3 found the candidates by runtime only. I refined them in 4–5 to constrain the implementation role too, because the brief asks for audio-scheduler candidates, and a runtime filter alone could leave the intended implementation role implicit. The refinement kept the same witnesses and made that role explicit.

1. Exact query: `{"grammar.task":"compose-event-sequence","grammar.artifact":"audio-event-sequence","grammar.operation":"preserve-performer-choice"}`
   - Result: `ASA-G-OPEN-SCORE` — “开放谱与演出自主权”, `kit/design/motion/score-and-time.md#asa-g-open-score`; witness `grammar: [ASA-G-OPEN-SCORE]`.
   - Accepted as the reference entry: it distinguishes fixed event relationships from optional interpretation, and describes what may remain open to the performer. It also names play/pause/stop/reset controls and a static sequence/state index.

2. Exact query: `{"grammar.task":"compose-event-sequence","implementation.stack_runtime":["browser","Tone.js"]}`
   - Result: same grammar entry; implementation witness `ASA-E-T-TONEJS`, linked by typed `implements` relation. The list of runtime values is conjunctive in this query route, and this record has both values.
   - Accepted as a provisional browser-oriented candidate. This query did not constrain `implementation.artifact`, so it did not yet establish that the returned implementation had the audio-scheduler role.

3. Exact query: `{"grammar.task":"compose-event-sequence","implementation.stack_runtime":"SuperCollider"}`
   - Result: same grammar entry; implementation witness `ASA-E-T-SUPERCOLLIDER`, linked by typed `implements` relation.
   - Accepted as a provisional separate audio-runtime candidate. Like invocation 2, this did not yet constrain implementation role.

4. Exact query: `{"grammar.task":"compose-event-sequence","implementation.artifact":"audio-scheduler","implementation.stack_runtime":"browser"}`
   - Result: same grammar entry; implementation witness `ASA-E-T-TONEJS` (“Tone.js Transport 14.7.77”), linked by typed `implements` relation.
   - Accepted as the browser-oriented implementation candidate. The card describes a browser-side music event timeline and scheduling API.

5. Exact query: `{"grammar.task":"compose-event-sequence","implementation.artifact":"audio-scheduler","implementation.stack_runtime":"SuperCollider"}`
   - Result: same grammar entry; implementation witness `ASA-E-T-SUPERCOLLIDER` (“SuperCollider 3.14.0 server timing”), linked by typed `implements` relation.
   - Accepted as a separate audio-runtime candidate. Its card discusses logical/physical time, timestamped bundles, and latency.

The refinement was not driven by a failed query: both provisional queries returned a single, plausible witness, so there was no ambiguous returned ID. The ambiguity was in the filter’s meaning: runtime identity alone does not say the entity’s artifact role. Adding `implementation.artifact=audio-scheduler` resolved that scope of uncertainty without changing the matches.

The two implementation witnesses are candidates for later comparison, not an architecture decision. The cards and relation limits say the materials are documentation-based; no code was run and no audio or visual synchronization was evaluated. I rejected treating the Brown/December 1952 source context as a ready-made installation score: the reference itself says this software pattern is a modern design inference, not a reproduction, and the brief supplies no selected event rules or durations.

## Facet wording and gaps noticed

`artifact` is overloaded across scopes: the grammar’s `audio-event-sequence` is the intended output, while each implementation’s `audio-scheduler` is its role. Writing the scope prefix made this discoverable. `stack_runtime=browser` describes the Tone.js candidate’s documented runtime identity; it does not by itself establish that a whole visual/audio installation fits that runtime.

The records expose no dedicated facet for visitor-trigger model, pause-duration policy, or audio/visual synchronization needs. The reference prose covers some of those choices, but the facet route cannot narrow on them. This is a discoverability/coverage gap; I did not infer missing values as negative evidence.
