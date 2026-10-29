# Video references and direction (2026-10-29)

## Direction (the user, 2026-10-29)

The demo-stage film is **not** a full-screen, end-to-end walkthrough. The release will bring breaking changes, so a guided tour would date quickly. The better form is **local UX synthesis**: short, composed demonstrations of single interactions and features, with effects outside the UI ("盘外": camera moves, viewport moves, visual effects). The result is closer to the feature and interaction demos that accompany a product film than to a product tutorial.

What this means for the plan:

- **E1–E6 v0 and v0.1** (STORYBOARD §8.6) stay registered as the record of the end-to-end runs. They also serve as source footage and as the regression baseline. They are not the release form.
- **Next storyboard:** re-plan §8 as a set of local UX syntheses, each one claim, one interaction and one piece of evidence, composed with viewport and camera grammar. That planning begins after the current construction round and the user's open-question items. It belongs to the video preparation stage, not to now.
- **The capture path still holds.** The `?scene=&play=` player and `scripts/compile-demo.mjs` record from the real app. Effects outside the UI are layered on top in compositing; they never fake a product capability (package P16, P24).

### Refined (the user, 2026-10-29)

- **Each piece is led by a concern**, through a scene, a case or a feature. The UI appears as **composited fragments**, not full screens.
- **Material outside the UI carries the context:** type, diagrams, document materials, camera, light and motion. It shows the question a controller cares about, then the product capability that answers it.
- **This is the demo stage.** It meets the controller's expectations and answers their unease. Both the product and the service must read as designed and premium.

**Shape of one piece** (D, to be tried at the storyboard):

1. **Question**: one line of type, the controller's own question, set outside the UI.
2. **Context**: what makes it hard, drawn outside the UI. Examples: an ownership chain being drawn, a supply share, a contract's pages.
3. **Proof**: a UI fragment captured from the real app. The camera pushes into it, and the surrounding UI blurs and falls away.
4. **Object**: the result that stays, such as 合同定本, a confirmed path, a dated watch or a service plan.
5. **Close**: one line.

**Candidate pieces**, each on a case we already have:

| Concern (internal wording) | Case | Capability shown |
|---|---|---|
| What am I signing, and on what grounds? | Langtuo MSA | Findings with sources, evidence gate, position ladder, 合同定本 |
| Who really controls the target? | Zhengkun red-chip | Ownership lens, path view, trust layer |
| How much of my supply hangs on one site? | Runcheng supply | 48% on record vs 68% if claimed; the unverified leg |
| Is someone watching, and when will I hear? | Runcheng · Baotou | Watch: one event, impact check, next check |
| Does my team work to my standard? | Playbook | Rules distilled from practice, applied, revised |
| When I need people, who, for what and how much? | Service sheet | Honest bill of work, plan, quota |
| (later) Is my data crossing borders unseen? | Zhengkun data flow | Dashed relation, confirmation, trail |

**Material outside the UI** (all optional):

- title type;
- line diagrams drawn in our graph grammar;
- paper and stamp details for the documents;
- depth of field and focus pulls onto a fragment;
- a slow light sweep over the material;
- callouts that point to real UI;
- a side-by-side "on record vs claimed";
- honest marks where time is compressed;
- one sound motif.

**Constraints:**

- Every UI fragment is captured from the real app at 2× or more, so it can be cropped and pushed in. Nothing outside the UI implies a capability the app doesn't have.
- No anxiety-mongering, and never the internal positioning words in copy.
- Synthetic material stays marked as synthetic.

**Tooling** is decided at the video stage. The likely shape is our scene player for fragment capture, plus a React compositor (Remotion is covered in the grammar package), plus ffmpeg.

## Packages received (cloud explore, 2026-10-28)

Kept in `~/Downloads`; the sha256 prefix is first. Extracted copies for reading are in the session scratchpad `vref/`, not in git.

| Package | sha256[:12] | Entry point | Use |
|---|---|---|---|
| `video-grammar-baseline-opus-handoff-2026-10-28.zip` | 369b62db9d8e | `grammar/00-START-HERE.md`, `remotion/00-阅读入口.md` | Editing grammar (P01–P28 pattern cards), briefs, accessibility and delivery QA, open NLE workflow, Remotion × Agent practice, delivery and review interface, Praxis lab baseline |
| `audio-without-tts-lightweight-reference-2026-10-28.zip` | 922fd1ee3cc2 | `audio-without-tts/README.md` → `AUDIO_WITHOUT_TTS.md` | Light sound for films without voice-over: lock picture and reading first, then cut music around it; short original motifs; licensed sources (Kenney UI audio, Incompetech CC BY, Freesound CC0/BY) |

## Takeaways already relevant (to be expanded when video preparation starts)

- **Decide what the viewer should come away with, then the form** (00 §1). A promo shifts interest, a demo builds a believable model of capability, and a tutorial gets a task done. One body of material can have several cuts. This supports the user's direction.
- **A UI viewport is not a camera** (P15, P16). Crop, scale and pan in screen space should keep task state, control position and the evidence of the result legible. Camera-style moves need a dramatic, logical or spatial motive.
- **Separate tracks:** claim, real operation, composed explanation, time-compression marks and result evidence are maintained apart (00 §5). For agents, keep the approval, the wait, failure recovery and permission boundaries visible.
- **Honest time compression** (P24): mark a skipped wait; never imply speed the product doesn't have.
- **Sound** (audio README): picture and reading come first. A short motif, sparse and dense variants, and an ending are enough; no per-episode song.
- **One timing ledger** (Remotion 00 §5): story, evidence, audio cues, source trims and shot boundaries share IDs. Our step IDs in `src/demo/scripts.ts` can become that ledger.
- **Review binds to an output**, by its hash plus a scene ID and range, not by a file name. Our §8.6 register already does this.

Rule as everywhere: these packages are references, not requirements. They don't fix style, length or rhythm. **The user, 2026-10-29:** every video research package only fills blind spots. Take from it what a piece needs, and nothing more.

## The old film (180.MP4): messaging to keep, craft to surpass (2026-10-29)

Digest: `digests/old-video-180.md`.

**Messaging spine:**
- **Pain:** advice repeated from outside, opinions buried in mailboxes, regulation lag, staff turnover, no review, nobody to ask on the front line.
- **Offer:** an enterprise-specific 法财税 AI think tank, as a system capability.
- **Trust:** built by in-house legal, finance and tax staff with AI engineers and experts, and every answer is traceable.
- **Proof:** one 出海 scenario, plus alerts and private deployment.
- **Close:** "low cost, high-quality agile support". There is no call to action.

**What changes:**
- **The audience.** The old film speaks to the legal, finance and tax department. Ours speaks to the controller who pays, through concerns they hold, while the product is shown in their staff's hands.
- **Claims we drop or soften**, because the app can't prove them and the user's own `03_表述口径与边界.md` flags them: "low cost", "instant", "data flywheel", "private deployment", "data never leaves the enterprise" and "professional verification".
- **What we keep:** traceable answers, people behind the work, and the pain points as concerns. Proactive alerts stay too, now shown honestly as Watch.

**Craft to surpass:**
- whole screens shrunk into the frame, with a caption bar repeating the voice;
- template effects (a 3D carousel, bloom, garbled-glyph titles);
- three colour moods;
- no air between lines, no sound motif, no ending.

Ours: UI fragments at 2× pushed into and held; one calm ground; one claim per piece; one motif; one closing line.
