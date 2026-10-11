# MechanismLab v2 handoff

Owned files only:
- `/Users/lesprivilege/.codex/worktrees/agentscope-enterprise-film/Praxis/demos/agentscope-enterprise-film/film/mechanism-lab.js`
- matching `mechanism-lab.css`

No index/engine/compile/beats/stage-v1 edits. No target-project execution, clone, dependency install, TTS, or source-repository mutation. Work performed by the delegated mechanism worker; parent owns integration and final acceptance.

## API and timing

Load CSS after film.css, JS after GSAP and before callers. `MechanismLab.build(type,{root,tl,start,duration,cues,caseBadge,caseX,caseY,x,y})` adds one scoped exhibit. `start` is absolute master-timeline seconds; `cues` and returned `motion_windows[].at` are scene-local seconds. `screen_text[].start/end` are absolute seconds. Every motion—including crossfades, transferred text, and appended delta text—is included in motion_windows. Root scene controls visibility/exits. No timers/callbacks; arbitrary seek supported.

Exhibit geometry defaults: x=88,y=300,width=1744,height=590 at 1920×1080. Main provides title/lead/chrome/source. Bottom explanatory band is local y=520, hence stage y=820. Case badge appears once in top chrome row: local x1420,y-254, stage x1508,y46. Set `caseBadge:false` if main has its own example identity; or reposition with caseX/caseY. Keep example identity visibly stated once. Main scene-number and module case badge cannot share right-top slot.

`data-reading-key` on each semantic node is stable across layer replacements (mechanism type + node geometry). Its text can change and still needs fresh reading time; the same unchanged identity/text should not be charged as five newly introduced objects. Animated duplicate transfers use `data-reading-transient=true`. `screen_text` is a textual inventory with phase timing; it is not proof of audience comprehension. The two appended delta fragments have their own onset records.

Default phase maps:

```js
// recommended PM-viewing allocation shown separately below
MechanismLab.build('events', {root,tl,start:from,duration:35,cues:{
  reply_start:0, text_delta:6, text_end:13, tool_result:21, reply_end:28
}});
MechanismLab.build('permission', {root,tl,start:from,duration:35,cues:{
  tool_call:0, input_validated:5, ask_parked:10, confirmed:18, executing:23, result:29
}});
MechanismLab.build('offload', {root,tl,start:from,duration:34,cues:{
  context:0, compressed:8, offloaded:16, read_back:25
}});
MechanismLab.build('artifact', {root,tl,start:from,duration:35,cues:{
  working_file:0, session_file:7, published:14, record_read:21, downloaded:28
}});
```

Cues may also be numeric arrays in phase_names order, or `{phase:{at:n}}`. Validation requires increasing nonnegative cues, last phase transition fitting supplied duration. Transfer offsets are tied to their semantic cue:
- event: text_delta+0.1→+1.5 first transfer; +1.7→+3.1 second transfer; the first/second visible text appears only at +1.5/+3.1. Keep text_delta phase at least 3.3s.
- permission: confirmed+0.6→+2.2 transfers T1 across released gate. Keep at least 2.3s before executing.
- offload: offloaded+0.3→+2.0; read_back+0.4→+2.1.
- artifact: session_file/record_read+0.25→+1.85.

Suggested read allocations after de-duplicating unchanged objects: events42s cues[0,8,16,25,34]; permission45s [0,7,14,25,32,38]; offload40s [0,9,18,29]; artifact43s [0,9,18,27,35]. Do not simply lengthen v1; use actual introduced text per state to decide holds. First-screen type density has been reduced following parent review.

## State meaning and provenance

1. **events:** R1 is one reply/Msg; B1 is a text block; T1 is a tool call. Text start creates B1; delta fragments append after arrival; text end leaves reply generating. Tool result points to T1. Reply end records completed. Important field names introduced at relevant transition rather than repeating full class names everywhere. References: Vault `_event.py` snapshot `as-4a805cb460f3` lines 84–127, 166–194, 315–405; mechanics-handoff §1. Python baseline e4c1e074 / 2.0.10dev.
2. **permission:** one Write example: tool availability + JSON/schema precede Permission; ASK parks R1/T1 and ends current stream; UserConfirmResultEvent carries reply_id and nested confirm_results with ToolCallBlock identity (there is no fabricated top-level tool_call_id). ASK phase has no outbound arrow across execution gate. Only confirmation allows T1 through; actual tool start and result are separate phases. No concurrent demonstration of ALLOW/DENY/ASK branches. References mechanics-handoff §3; `_event.py` snapshot lines 442–494.
3. **offload:** recent context remains in AgentState; summary represents earlier messages; configured Workspace Offloader appends earlier messages to sessions/S1/context.jsonl. Read/Grep/Glob can read details from returned reference and tool result re-enters model input. Transfer labelled earlier messages originates separately from retained recent messages. Reference `as-c3e41125204e-building-blocks_context_offload-context.md.txt` lines 12–76; context-compress docs and mechanics-handoff §6. This diagram shows configured offloader, not every Agent's default.
4. **artifact:** explicitly selected **Managed Session file publication path**: workspace output → upload to actual Session file F1 → POST /artifacts referencing F1 → read actual record A1 → GET file content under Session permissions. Source says uploaded file publication does not read/generate workspace files itself; external HTTPS Artifacts are another possible path. Diagram therefore does not claim every output must go through Session file upload. Reference `as-69ccfb190c6d-java-service-files.md.txt` sections “Download and deliver”, particularly lines 100–130. Java Service documented line 2.1.0-BETA1; main should cite correct Java source on this scene. Publication is distinct from business acceptance.

## Executed checks and review evidence

Temporary self-contained fixture `/tmp/praxis-scope-quality/mechanism-fixture.html` loads existing bundled GSAP/Film + the two owned sources. It has no dependency download or target AgentScope execution.

- `node --check` passes.
- `check-mechanisms.py`: 20 native 1920×1080 frames, no pageerror, no node content overflow, zero reverse-seek pixel-hash mismatches.
- `check-motion-contract.py`: all 3360 sampled frames at 24fps across four exhibits; zero inline-opacity/visibility/transform changes outside declared windows. At event 6.5s text fragments hidden; 7.8s only first visible; 9.4s both visible. ASK has only ingress arrow and downward parked stub, no path crossing toward executing tool.
- Manual static visual review of events015/024, permission048, offload088, artifact121; corrected badge collision and all previously detected content overflows. These support composition/semantic inspection, not full-film/audience acceptance.
- Review stills: `mechanism-015.png`, `mechanism-024.png`, `mechanism-048.png`, `mechanism-055.png`, `mechanism-088.png`, `mechanism-121.png`, `mechanism-136.png`. All screenshots in temp directory; source is editable JS/CSS.
- Preview clips `event-delta.mp4` (11s) and `permission-gate.mp4` (21s), native 1080, silent, rendered at 24fps from fixture. Final clip completion/decode result follows parent message. Full v2 integration, full playback and audience testing remain parent acceptance scope.

Machine reports: `mechanism-check.json`, `motion-contract-check.json`, `mechanism-manifest.json`. No full repository validation claimed by this worker while other edits are ongoing; parent should run required repository validator after integration.

## Bounded typography refinement (parent follow-up)

All exhibit body/type identity text is now ≥30 stage pixels: label, mono, chip, stream rows, path labels, section headings, slices, small text and explanatory bands. The only 24px text is the example badge in chrome. No 23–29px body text remains in the actual DOM. Event B1 block enlarged from155→195px and the T1 block moved to local y310. Stream-row padding reduced to preserve 30px type rather than lowering type size. Offloader box uses shorter `Offloader · S1` / `消息已保存`, and height239px; parked badge expanded350×56px. Native composition rechecked after changes.

Stable keys now extend from semantic boxes to actual text roles (`ml-label`, `ml-h`, `ml-text`, `ml-mono`, `ml-chip`, rows and slices) by role + ordinal within the stable box. Text-leaf consumers find the nearest key; B1 delta spans inherit its text-content key. Property changes are still new text while unchanged IDs and labels deduplicate across phases.

Executed final refinement checks:
- `check-reading-leaves.py`:20 states, **zero visible body leaves below30px**, **zero visible text leaves without a semantic ancestor key**. Actual DOM result saved in `reading-leaf-check.json`, including new text per phase after stable-key comparison.
- Re-ran20 native1080 screenshots: zero overflow, pageerror, or reverse-seek pixel mismatch.
- Re-ran3360-frame motion contract: zero uncovered state changes; delta append order and ASK path termination preserved.
- Statically reviewed updated048/088 frames; enlarged text remains legible without object/band overlap.
- Prior preview MP4s predate the typography refinement until regenerated; use current PNGs/current source for latest typography. Main4-scene preview / reading-v2 integration remains parent scope.

Reading-time caveat from actual stable-key DOM comparison: first states introduce51/77/90/84 Chinese characters (events/permission/offload/artifact), plus code terms. Later states generally introduce13–56 Chinese characters. Font compliance is proven; default35s fixture cue maps do not prove reading-speed acceptance. Prior duration recommendations were provisional before enlarged type/semantic-leaf counts. Parent should prioritize initial diagram recognition time (roughly14–16s as a production hypothesis), then allocate holds by introduced text per state. Full playback and actual reader performance are not established by this worker's static/DOM checks.

## Cross-scene identity API

`build` now accepts optional `identities:{reply_id,tool_call_id,session_id,file_id,artifact_id}` and `output_filename`. Defaults remain R1/T1/S1/F1/A1 and risk-report.pdf; omitted identity fields keep their individual default. The return object includes normalized `identities` and `output_filename` for integration records. B1 remains the exhibit's text-block identity.

```js
// Python read example: retain R1 / T1
MechanismLab.build('events',{root,tl,start:from,duration,cues,
  identities:{reply_id:'R1',tool_call_id:'T1'}});
// Later Python write example: a different reply and tool call
MechanismLab.build('permission',{root,tl,start:from,duration,cues,
  identities:{reply_id:'R2',tool_call_id:'T2'}});
// Independent Java Managed Service publication route
MechanismLab.build('artifact',{root,tl,start:from,duration,cues,
  identities:{session_id:'JS1',file_id:'JF1',artifact_id:'JA1'},
  output_filename:'risk-v3.pdf'});
```

Implementation changes only exact standalone default ID tokens and the exact default output filename in constructed text nodes, once, before extracting screen_text. It does not mutate HTML or semantic keys. Alias substitution is a single-pass mapping (R1→T1 and T1→T9 do not cascade). All motion tweens use transform/opacity/visibility; no later text callback restores defaults. File path references, flying tokens, captions and returned screen text therefore stay aligned with the selected identities. Main still identifies the independent Java implementation route in its scene title/lead/source; the API does not imply that Java and Python share one running session.

Validation: `check-identities.py` used R2/T2, S2, JS1/JF1/JA1 and risk-v3.pdf, checking all phase DOM text, metadata and flight tokens.13 native1080 samples (including moving-token times) had zero pageerror/overflow/reverse-seek mismatch. Default example identities/content were explicitly checked, semantic keys matched the default instance exactly, and single-pass replacement did not cascade. Invalid empty/non-string IDs/filenames failed before creating DOM. Results: `identity-api-check.json`; custom fixture `mechanism-identity-fixture.html`. Current default20-frame check also passed. Long arbitrary production IDs/filenames may require parent layout inspection; tested aliases are the planned short example identities. No full repository check was run in this bounded API refinement.
