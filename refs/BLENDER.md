# Blender (VM) · candidate jobs for the film (2026-10-29)

**Purpose:** the user will give this list to Opus, which picks jobs and writes a cloud work order for the best available model to run in a VM with Blender. Pick only what earns it. The film's grammar is in `docs/round-5/research/VIDEO-REFS.md` ("Direction", "Refined", and the old-film lessons). Assets that GPT image can make are in `SPEC.md`.

## When Blender, and when not

| Tool | Use it for |
|---|---|
| **Blender** | Real **camera moves through space**: dolly, parallax with true occlusion, focus pulls. **Light continuity across shots**, such as the same site at day and dusk. **Geometry driven by our data**, which must stay exact. Objects that must turn or catch light. |
| **GPT image** (`SPEC.md`) | Static atmosphere plates, illustrations, document still lifes. |
| **The compositor** (React/Remotion plus our scene player) | Type, our line diagrams, UI fragments and pushes into them, the 2D motion of data lines. |
| **Never** | Anything that fakes a product capability; real brands or people; redrawing the brand mark. |

## Candidate jobs

Each job lists its piece, why it needs Blender, what it delivers, and its priority.

**B-01 · The shared site: one hall, day to dusk** (pieces 3 and 4; the hero)
- **Why Blender:** one camera path through a hall of crystal-growth furnaces, rendered twice with the same move, once by daylight and once at blue hour. The film can then cross-dissolve "the site" to "the site, watched". GPT can't hold a camera path or keep the light continuous.
- **Delivers:**
  - an 8–12 s slow dolly, plus a locked-off 6 s variant;
  - both lighting states;
  - a separate foreground pass (the first furnace) and a depth pass for focus pulls.
- **Priority:** must.

**B-02 · The supply map in relief, driven by data** (piece 3)
- **Why Blender:** a shaded relief of northern China (no borders, no labels) with our sites placed and our shares as raised arcs, built from a JSON export of `g-crestline-supply`. Positions come from our data, so the camera can push to the Baotou site with true perspective.
- **Delivers:**
  - a 10 s push-in;
  - a "48% on record" state and a "68% if Boyuan's claim holds" state (the arc thickening);
  - passes for line and terrain, for grading separately.
- **Must not:** labels in the render; we composite our type.
- **Priority:** should.

**B-03 · The ownership chain in depth, driven by data** (piece 2)
- **Why Blender:** the Zhengkun structure (trust, then offshore, then Hong Kong, then onshore, with the VIE chain) as layered planes in space, built from the `g-lumen-structure` export. Our line meanings carry over: solid, dashed and dotted keep fact, inferred and unverified. The camera descends layer by layer and stops on the VIE chain.
- **Delivers:**
  - a 10–14 s descent;
  - a hold frame at each layer;
  - matte passes per node, so our real UI fragment can replace the final layer in compositing.
- **Must not:** text; re-encoding the line semantics.
- **Priority:** should.

**B-04 · UI fragments as objects in a lit space** (all pieces, sparingly)
- **Why Blender:** our real captures (2× PNG of a finding, the gate, a watch event) mapped onto thin planes and lit by one soft key from the top left, the same direction as our UI's appearance rule A1. A slow camera arc and shallow depth of field make the fragment feel like an object without changing a pixel of its content.
- **Delivers:**
  - a reusable `.blend` template with the plane rig, the light and three camera moves (arc, push, rack focus);
  - renders for 3–5 fragments we supply.
- **Must not:** distort or relight the UI content to the point of illegibility; no screen glare that hides text.
- **Priority:** should.

**B-05 · The SiC module, turning** (piece 1)
- **Why Blender:** a modelled automotive power module (no brand) that turns slowly under raking light, as the object behind the contract.
- **Delivers:** a 6 s turntable with alpha; a still at the hero angle.
- **Priority:** could; GPT V-01 may be enough.

**B-06 · Paper and stamp** (pieces 1 and 2)
- **Why Blender:** one page turn and a page settling on a desk, with physically correct light, for transitions.
- **Delivers:** a 3 s page turn with alpha.
- **Must not:** readable text; any seal impression.
- **Priority:** could.

**Not Blender:**
- the cross-border data line (I-06; it's a 2D motion in the compositor);
- the title type;
- the watch ring (I-07);
- the brand mark (use `docs/round-5/brand/*.svg` as is).

## Common delivery terms (for the work order)

- **Format:**
  - 3840×2160, 30 fps;
  - PNG 16-bit or EXR sequences, with alpha where noted;
  - one H.264 preview per shot;
  - the `.blend` files with packed or relative textures;
  - camera paths exported as JSON (frame, position, rotation, focal length, focus distance) so the compositor can match moves.
- **Look:**
  - bright and editorial, with daylight as the key light;
  - neutral whites and warm greys, plus one deep-teal note (#005e68) at most per shot;
  - AgX view transform, graded to sRGB;
  - no lens flare and no bloom haze.
  - It must match the `SPEC.md` style line and the images in `style-refs/`.
- **Data-driven jobs (B-02, B-03):**
  - Inputs are JSON exports of `src/data/graphs.ts`, from a script we add when the job is chosen (`scripts/export-graph.ts`).
  - Geometry follows the data exactly: no invented nodes, edges or shares.
  - Certainty line styles are preserved.
- **Assets:** CC0 only (for example Poly Haven), each listed with its licence in `PROVENANCE.md`. No brands, real places' signage, or people.
- **Honesty:** nothing implies a capability the app doesn't have; synthetic stays marked synthetic in the film.
- **Acceptance:**
  - previews match the style references;
  - camera JSON lines up with the frames;
  - passes separate cleanly;
  - files are named `B-0n_<shot>_<pass>_####.png`.
- **Return to:** `docs/round-5/video-assets/in/blender/` (out of git), plus a line per job in `PROVENANCE.md`.
