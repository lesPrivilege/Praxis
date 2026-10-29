# Work order · Blender shots for the 100mirror / 百鉴 demo film (2026-10-29)

**From:** the local Opus session on `fresh-harness-webui` (branch `round-5`, HEAD b0a2550 plus work in progress).
**To:** the cloud executor with a VM running Blender.
**Return:** on this branch. See "Return" below.

## What the film is

The film is a set of short, concern-led pieces. Each is about 20–40 s and runs: question → context → proof → result → close.
- **Proof:** always a fragment captured from the real app.
- **Context:** material outside the UI.
- **Your shots** are part of that context. They must make the material feel real and premium without implying any capability the product doesn't have.
- **Read first:** `refs/VIDEO-REFS.md` ("Direction", "Refined", "The old film"), then `refs/BLENDER.md` for the full job descriptions.

## Scope: four jobs

| Job | Piece | Summary (full spec in `refs/BLENDER.md`) |
|---|---|---|
| **B-01** (must) | supply / watch | One crystal-growth hall, one camera path, rendered twice: daylight and blue hour. An 8–12 s dolly plus a 6 s locked-off shot, with foreground and depth passes. |
| **B-02** | supply | A relief of northern China with no borders or labels. Sites and arcs are placed from `inputs/graphs/g-crestline-supply.json` (`nodes[].at` = lon/lat). A 10 s push to the Baotou site (`b-baotou`). The arc thickens between two states: 48% on record and 68% if Boyuan's claim holds. |
| **B-03** | ownership | The Zhengkun structure from `inputs/graphs/g-lumen-structure.json` as layered planes (`layer`, `order`). The camera descends to the VIE chain. Line style follows `certainty` (fact = solid, inferred = dashed, unverified = dotted). Matte pass per node. |
| **B-04** | all | A reusable plane rig: our UI captures from `inputs/ui/*@2x.png` on thin planes, one soft key light from the top left, and three camera moves (arc, push, rack focus). Renders for each supplied capture. |

B-05 and B-06 in `refs/BLENDER.md` are optional; do them only if time remains.

## Inputs on this branch

- `inputs/graphs/*.json`: exports of our matter graphs from `scripts/export-graph.ts`. Synthetic case data.
  - Use nodes, edges, shares and certainty exactly as given. No invented nodes, edges or numbers.
  - `at` is a regional centroid, not an address.
- `inputs/ui/*@2x.png`: real app captures at 2× (zh, light). Panel crops may include a few pixels of the neighbouring column; crop them.
- `refs/style-refs/*.jpg`: the product's look. Your renders must sit beside these.
- `refs/SPEC.md`: the shared style line, the palette and the rules for official-looking material.
- `refs/brand/*.svg`: the brand mark. Don't redraw or alter it; it's for reference only.

## Rules

- **No text** in any render. We composite all type ourselves.
- **Look:**
  - bright and editorial, daylight-led;
  - neutral whites and warm greys, with at most one deep-teal note (#005e68) per shot;
  - AgX, graded to sRGB;
  - no lens flare, bloom haze or neon.
- **Honesty:** synthetic stays synthetic. Nothing implies a capability the app lacks. No real brands, signage, people, seals or emblems.
- **Assets:** CC0 only, listed with source and licence in `PROVENANCE.md` (template below).
- **UI content (B-04):** never relit, distorted or blurred to the point of illegibility. Depth of field may soften the frame edge, not the claim.

## Deliverables

For each job, under `out/B-0n/`:
- one H.264 preview per shot (1920×1080, ≤ 50 MB);
- camera path JSON per shot: frame, position, rotation, focal length, focus distance;
- the `.blend` file, with textures relative or packed (if over 100 MB, put it with the sequences);
- `NOTES.md`: what was made, the decisions taken, what was not done and why.

The full 3840×2160, 30 fps PNG-16 or EXR sequences with alpha, named `B-0n_<shot>_<pass>_####.png`, are too large for git. Package them as one zip per job and attach them as a release asset (or return them however the user's earlier packages came back), and list them in `out/MANIFEST.md` with their sha256.

## Return

- Commit `out/`, `PROVENANCE.md` and `out/MANIFEST.md` to this branch.
- Don't merge into any other branch.
- The local session pulls this branch and files the assets under `docs/round-5/video-assets/in/blender/`.

## PROVENANCE.md template

| Job | File | Asset or source | Licence | URL | Notes |
|---|---|---|---|---|---|
