# Video image assets · gaps and specs (2026-10-29)

The film is built from concern-led pieces (`docs/round-5/research/VIDEO-REFS.md`, "Refined"). The UI fragments come from the real app. **Everything else is material outside the UI**, and this file lists what it needs. The user hands the specs to GPT image (or sources real photos) and returns the files. The assets drop into `docs/round-5/video-assets/in/<ID>.<ext>`, which is kept out of git, each with a line in `PROVENANCE.md`.

Nothing here is committed to the film yet. The storyboard picks from this list.

## Gap: what the app gives and what it doesn't

| We have | We lack |
|---|---|
| UI fragments at 2× (findings, gate, ladder, graphs, Watch, service sheet, 合同定本) | Physical context: the product, the factory, the site, the documents on a desk |
| Our own line diagrams (the graph grammar can be drawn outside the UI) | A sense of place: offshore, a northern industrial park, a counsel's office |
| Type and our palette | Paper, stamps, binders: the material weight of legal work |
| | A human presence that is not a face to judge: hands, backs, a lit window |

## Rules for every asset

1. **Fictional, and recognisably so where it matters.** No real company names, logos or products. No real people; any person is generated and fictional, shown mostly from behind, as hands or out of focus.
2. **Government and official documents are illustrations, never facsimiles.** Each one:
   - names a fictional issuing body, marked 示例;
   - carries no national emblem, no real seal, no real document number and no real official's name;
   - has body text that is illegible or lorem-like;
   - carries a visible "示意 / SAMPLE" mark;
   - never copies a real agency's template.
   These rules exist so no frame could be lifted and used as a real document.
3. **No text rendered by the generator** except where an ID says so. We set all readable type ourselves in compositing. Leave a quiet area where type will go (the ID notes where).
4. **Look:**
   - bright, clean, daylight-led, with soft shadows;
   - neutral whites and warm greys, and one restrained deep-teal note (our service accent, #005e68 on #d9f8fb) where natural;
   - no blue-orange teal-and-orange grade, no neon and no lens flares;
   - photographic realism with an editorial, still-life calm.
   It should feel like an annual report or an architecture magazine, not a tech ad.
5. **Size:** the largest landscape size the generator gives, ideally 16:9 or wider (2:1 suits parallax). We upscale and crop.
6. **Layers** where an ID asks for them: a separate foreground plate (same scene, background removed or plain) so the camera can move with parallax.
7. **Real photos** (an option where noted) only from sources with a licence for commercial use (for example Unsplash or Pexels licence, or the user's own). Record the source, author and licence in `PROVENANCE.md`. Nothing with an identifiable brand, person or plate.

## Common style line (prepend to every prompt)

> Photorealistic editorial still, bright natural daylight, soft shadows, neutral white and warm grey palette with a single restrained teal accent, calm and precise, shallow depth of field, 35–50mm lens look, no text, no logos, no people's faces in focus, no lens flare, high detail, 16:9 landscape.

## Assets

Each asset gives its ID, the piece it serves, what it is for, the prompt (after the common line), its layout and its must-nots.

### Piece 1 · What am I signing? (Langtuo MSA)

**V-01 · SiC power module, still life**
- **Purpose:** the object behind the contract.
- **Prompt:** "An automotive silicon-carbide power module, a flat rectangular package with copper baseplate and terminals, resting on a matte light-grey surface, one raking light from the left, a second blurred module behind."
- **Layout:** the subject in the right third, with the left half quiet for type.
- **Must not:** brand marks or part numbers.

**V-02 · Contract pages on a desk**
- **Purpose:** the weight of the agreement before our proof.
- **Prompt:** "A bound commercial agreement lying open on a pale oak desk, two pages visible with dense small paragraphs (illegible), a signature block with blank lines at the bottom right, a closed fountain pen beside it, morning light from a window."
- **Layout:** a 2:1 crop with a foreground plate (the pen and the page edge).
- **Must not:** readable text, seals or company names.

**V-03 · The signing table, overhead**
- **Purpose:** the close of the piece.
- **Prompt:** "Overhead view of a long meeting table, two neat document sets squared to the edge, two pens, a glass of water, soft daylight, nobody seated."
- **Layout:** centre quiet for one line of type.

### Piece 2 · Who really controls the target? (Zhengkun red-chip)

**V-04 · Offshore, as a feeling**
- **Purpose:** distance between operation and control.
- **Prompt:** "A calm harbour at early morning seen from a high window, low-rise waterfront buildings without signage, still water, pale sky, slight haze."
- **Layout:** 2:1 with a separate sky and water plate for a slow push.
- **Real photo:** possible; no identifiable landmarks.

**V-05 · Epitaxy cleanroom**
- **Purpose:** the operating company onshore.
- **Prompt:** "Interior of a semiconductor cleanroom with a row of epitaxy reactors, white and pale-grey surfaces, warm-yellow lithography-safe light in the far bay, one technician in a full cleanroom suit far away and out of focus."
- **Must not:** visible brand on the equipment.

**V-06 · Register of members, illustration**
- **Purpose:** the paper that proves who holds what.
- **Prompt:** "A thin bound corporate register lying open, ruled columns with handwritten-looking entries that are illegible, an embossed blank circle where a company seal would be (no design inside), a ribbon bookmark, soft side light."
- **Text:** none legible; we overlay the holder lines from our graph.
- **Must not:** a real seal, a real company name, any registry branding.

**V-07 · Family trust, still life**
- **Purpose:** the layer above the structure.
- **Prompt:** "A closed dark-green cloth document folder tied with a ribbon, on a walnut side table, beside a brass desk lamp turned off, quiet study interior blurred behind."

### Piece 3 · How much of my supply depends on one site? (Runcheng)

**V-08 · Crystal-growth hall** (the hero plate of the film)
- **Purpose:** the shared site everything hangs on.
- **Prompt:** "Wide interior of an industrial hall with long rows of identical cylindrical crystal-growth furnaces, clean concrete floor with painted walkways, high windows with daylight, northern China industrial park, orderly, nobody in the foreground."
- **Layout:** a 2:1 crop with a foreground plate (the first furnace) for parallax.
- **Must not:** signage or a company name.

**V-09 · SiC boule close-up**
- **Purpose:** what the site produces.
- **Prompt:** "A single silicon-carbide crystal boule, translucent amber-green, on a white cleanroom tray, macro shot, gentle top light."

**V-10 · Base map plate**
- **Purpose:** under our own line overlay (sites, shares).
- **Prompt:** "Minimal topographic relief of northern China and the Yellow River bend as a pale grey shaded-relief surface, no labels, no borders, no roads, matte, top-down."
- **Must not:** any political borders or names; we add only our nodes.

### Piece 4 · Is anyone watching, and when will I hear? (Watch, Baotou)

**V-11 · The site at dusk**
- **Purpose:** time passing; the site stays in view.
- **Prompt:** "The same industrial park seen from outside at blue hour, long low factory buildings with warm interior lights, a quiet access road, clear sky gradient."
- **Layout:** match V-08's angle family so the two can cross-dissolve.

**V-12 · An audit notice, illustration**
- **Purpose:** the event the watch picks up.
- **Prompt:** "A single printed notice letter on plain white paper lying on a desk, a short heading block and three short paragraphs that are illegible, a blank signature area, a large faint diagonal watermark reading SAMPLE, daylight."
- **Rules:** see rule 2. The issuing body is fictional, with no emblem and no seal. We composite our own heading ("审核通知（示例）").

### Piece 5 · Does my team work to my standard? (Playbook)

**V-13 · Annotated precedents**
- **Purpose:** practice turning into rules.
- **Prompt:** "A stack of past contracts with coloured paper tabs and pencil margin notes (illegible), a hand resting on top holding a pencil, seen from the side, soft daylight."
- **Must not:** a face.

**V-14 · The standard, bound**
- **Purpose:** a single source of truth.
- **Prompt:** "A slim, well-made ring binder with a plain linen cover standing on a clean shelf, a single teal tab visible, minimalist office."

### Piece 6 · When I need people, who, for what and how much? (Service)

**V-15 · Counsel's office (砚川律师事务所 · 示例)**
- **Purpose:** someone accountable behind the work.
- **Prompt:** "A calm law-office meeting room, pale stone and oak, one wall of books, a long table with two document sets, two people seen from behind at the far end in conversation, daylight."
- **Must not:** a firm name, a logo or faces.

**V-16 · Hands over a plan**
- **Purpose:** the scope agreed, not sold.
- **Prompt:** "Close-up of two people's hands over a printed one-page plan on a table, one pointing at a line, the page illegible, soft light."

### Piece 7 (later) · Is my data leaving the country unseen? (Zhengkun data flow)

**V-17 · Data-centre aisle**
- **Purpose:** where the data sits.
- **Prompt:** "A clean data-centre cold aisle, white cabinets, soft even light, perspective vanishing to a bright end, no status screens readable."

**V-18 · Filing for a cross-border assessment, illustration**
- **Purpose:** the formal step the finding points to.
- **Prompt:** "A neat printed application form clipped to a cardboard folder on a desk, form fields and checkboxes with illegible text, a blank applicant stamp box, a faint diagonal SAMPLE watermark, daylight."
- **Rules:** rule 2 in full. We composite "数据出境安全评估申报（示意）".

### Across pieces

**V-19 · The controller's window**
- **Purpose:** the person the film speaks to, never shown judging anyone.
- **Prompt:** "An executive office at early evening seen from behind a high-backed chair, a figure seated facing a wide window over a city at dusk, a single desk lamp on, papers on the desk, calm."
- **Must not:** a face, a logo or a recognisable skyline.

**V-20 · Paper texture plates (3)**
- **Purpose:** backgrounds for the question and close type.
- **Prompt:** "Flat-lay macro of fine uncoated cotton paper, warm white, subtle fibre texture, even light, no objects." Variants: a warm grey card and a pale linen.

**V-21 · Stamp-pad and seal-free desk detail**
- **Purpose:** a transition beat between the Chinese documents.
- **Prompt:** "A closed red stamp pad tin and a wooden seal handle lying on its side (the seal face not visible), on white paper, top light."
- **Must not:** a seal impression or a visible seal face.

## Acceptance (when the files come back)

- No readable fake text, logos, seals or faces except as allowed above.
- The look matches across the set (white balance, contrast, grain). V-08 and V-11 work as a pair.
- Sizes are at least 3000 px on the long edge after upscaling, without artefacts at a 1.5× push.
- Each file has its line in `PROVENANCE.md`: ID, source (GPT image, stock with licence, the user's own), date, and the prompt or licence.

---

# Part 2 · Illustration plates (non-photographic, in our style)

Some visuals are hard to draw in code on short notice: supply chains, maps, factories and suppliers, government and regulators, offshore structures. These can also go to GPT image as **pure illustration, not realism**, provided they look like they belong to our product.

**Division of labour.** Anything that carries **case data** stays in code, drawn in our graph grammar so it is exact and traceable. That means names, shares, dates, certainty and edges. GPT draws only what has no data in it: atmosphere, pictograms, base plates and scene vignettes that our data lines are laid over.

## Style sheet for illustrations

Prepend this to every illustration prompt, and attach the images in `style-refs/` (our UI graphs, the service plan, Home and the brand board) as visual references:

> Flat editorial line illustration in the style of the attached product screenshots: thin uniform strokes (about 1.5 px at 24 px icon scale, scaled proportionally), rounded line caps and joins, mostly monochrome near-black ink (#161719) and mid grey (#67686a) on white (#ffffff) or very light grey (#f8f9fb), large calm white space, at most one accent: deep teal (#005e68) with its pale tint (#d9f8fb) used sparingly for a single highlighted element, no gradients, no drop shadows, no 3D, no isometric glossy look, no textures, no text or numbers, no logos, no flags, no national emblems, precise and quiet like a technical annual-report diagram, 16:9 landscape.

**What our style is, in words:**
- **Line:** thin, even line work, like our Lucide-weight icons and graph edges. Solid, dashed and dotted lines carry meaning in our grammar: fact, inferred, unverified. So in an illustration, use solid lines only, unless an ID asks for a dashed one.
- **Colour:** neutral ink and greys. Teal appears once, to mark the one thing that matters in the frame. Verdict colours (red, amber, green, purple) are never used in illustrations. They mean decisions in the product.
- **Shape:** rounded rectangles like our cards and pills, circles for nodes, generous margins. Nothing ornamental.
- **Dark variant:** where an ID says "+dark", also ask for the same plate on navy (#11131a background, #f3f3f3 lines, teal lifted to #4fb8bf).

## Plates

Each plate lists its ID and piece, what it is, the prompt (after the style sheet) and our overlay.

**I-01 · Supply chain, abstract** (pieces 3 and 4)
- **What it is:** a left-to-right chain of five simple pictograms: raw material, crystal growth furnace, wafer, power module, electric vehicle. Each sits in a rounded square tile, joined by thin connectors.
- **Prompt:** "Five rounded-square tiles in a horizontal row, each containing a minimal line pictogram (a mineral chunk, a cylindrical furnace, a thin round wafer, a flat rectangular power module, a small electric car in profile), thin connector lines between tiles, the furnace tile alone outlined in deep teal."
- **Overlay:** our shares and names above the tiles. +dark.

**I-02 · Map plate, stylised** (pieces 3 and 4)
- **What it is:** a stylised northern-China base with no borders, made of contour lines.
- **Prompt:** "Minimal contour-line map texture suggesting mountains and a large river bend, very light grey lines on white, no borders, no labels, no cities, wide margins, one small empty circle in deep teal roughly at the centre-left."
- **Overlay:** our site nodes and lines on top. The teal circle is the Baotou site, and our own node replaces it in compositing. +dark.

**I-03 · Factory and supplier pictograms (set of 8)** (pieces 1, 3 and 4)
- **What it is:** a consistent set of building and supplier icons for our graph overlays and vignettes: a crystal-growth plant, a wafer fab, a module assembly plant, a warehouse, a port, a trading office, an R&D lab and a vehicle OEM plant.
- **Prompt:** "A set of eight minimal line icons on a 4×2 grid with equal spacing, each a simple building silhouette distinguished by one feature (cylindrical furnaces; a cleanroom with a thin roof vent; a sawtooth assembly roof; a box warehouse with a loading door; a crane and a ship hull; a small office block; a building with a flask symbol; a large hall with a car outline), same stroke and scale, no text."
- **Use:** these may also become glyphs. If adopted into the app, they are redrawn on our 24 grid per TAXONOMY.

**I-04 · Regulators and government, generic** (pieces 4 and 7)
- **What it is:** an abstract institution motif. No real building, emblem, flag or seal.
- **Prompt:** "A minimal line drawing of a generic civic building facade with plain columns and a flat pediment that is empty (no emblem), standing on a simple base line, a document icon with a folded corner beside it, deep teal only on the document's corner."
- **Must not:** a national emblem, a star, a flag, any recognisable real building, or a seal design. +dark.

**I-05 · Offshore structure vignette** (piece 2)
- **What it is:** three islands or plates at different heights joined by fine lines, suggesting layers of holding companies across water.
- **Prompt:** "Three simple flat island shapes at different heights over a calm line-drawn sea, each with a small rounded-rectangle block on it, thin vertical and diagonal connector lines between the blocks, the top block outlined in deep teal, airy and calm."
- **Overlay:** our entity names and the trust layer, from the ownership lens.

**I-06 · Data crossing a border, abstract** (piece 7, later)
- **What it is:** two rounded regions separated by a thin gap; a dashed line crosses from a database pictogram on one side to a cloud-server pictogram on the other.
- **Prompt:** "Two large pale rounded regions side by side with a narrow white gap between them, a small database cylinder icon in the left region, a small server-stack icon in the right region, a single thin dashed line crossing the gap between them in deep teal."
- **Note:** dashed is right here. In our grammar it means "inferred, pending confirmation". +dark.

**I-07 · Watch, time and attention** (piece 4)
- **What it is:** a quiet motif for "being watched over, with a next check": a node with a thin ring around it and a small clock tick.
- **Prompt:** "A single small circle node with a thin concentric ring around it, a short tick mark on the ring like a clock hand, a faint dotted timeline beneath with three small evenly spaced marks, deep teal on the ring only, lots of white space."
- **Must not:** a bell, alarm, siren, red, or warning triangle. Watch is never an alarm.

**I-08 · Playbook, from practice to rule** (piece 5)
- **What it is:** a few scattered document sheets on the left converge through thin lines into one neat bound sheet on the right.
- **Prompt:** "Five small loosely scattered document sheet icons on the left, thin converging lines leading to a single neat document with a bookmark tab on the right, the tab in deep teal."

**I-09 · Service, people behind the work** (piece 6)
- **What it is:** abstract figures, not faces: two simple seated figure outlines at a table seen side-on, a document between them.
- **Prompt:** "Two minimal seated human figure outlines (no faces, no features) at a simple table seen from the side, a single document on the table between them, calm, the document outlined in deep teal."

**I-10 · Section and transition marks (set)** (all pieces)
- **What it is:** small abstract marks for the title cards and wipes, built from our brand mark's language (see `brand-board.jpg`): circles, pairs and axes.
- **Prompt:** "A set of six minimal abstract geometric marks built from circles, short lines and pairs of dots, monochrome ink on white, consistent with the attached brand board, no letters."
- **Must not:** our actual logo redrawn or altered. We use `docs/round-5/brand/*.svg` for that.

## Acceptance for illustrations

- They read as one family with the attached screenshots: line weight, greys, a single teal, and white space.
- No text, numbers, flags, emblems, seals or recognisable real buildings.
- No verdict colours. Teal appears at most once per plate.
- Vector-like clean edges at 3000 px or more (or delivered as SVG if the tool allows).
- Each file has a line in `PROVENANCE.md`, as for photos.
