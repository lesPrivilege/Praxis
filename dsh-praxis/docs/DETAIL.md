# Praxis

Praxis builds up judgment and methods for design and writing, with a roster of sources and your own authored streams; workflows carry them into specific work. The methods come in four layers, each a set of short pages:

| Layer | Position | What it decides |
|---|---|---|
| Design | Core | How relations become visual, interactive or moving form |
| Writing | Core | How the content is argued and organised, in which genre and language |
| Task | Workflow | What this piece of work is for, which pipeline it takes, and which pages to read |
| Publish | Workflow | How content is produced for a medium: html pages or video |

Sources are references on the web: standards, established practice, component libraries, case libraries, articles. The roster keeps links, summaries and excerpts, never the original's text. The source catalog files them by Kit area and form, each with a short description saying when to open it and what to take; a binding to a page can add what is particular to that page. Local products are not sources. They are artifacts of three kinds: deliveries, pipelines (how to make one kind of delivery again) and examples (specimens made to show a pattern). Pipelines and examples that name the pages they serve, and accepted deliveries, reach a task after the web materials. Process records are not kept.

## What the agent does

The plugin registers 14 tools in agent sessions and adds a short entry to the system prompt. For a task, the agent:

1. Calls `praxis_resolve` with a task type and a pipeline, and reads only the pages it returns with `praxis_unit`. Writing and Design entry pages are always in context; everything else is read on demand.
2. Picks from the materials, which list every source on those pages once: the first twelve with their excerpts, the rest with the description to judge by, and `praxis_source` gives any of them in full. It goes back to an original through the link and excerpt locator when it needs to check or borrow something; `praxis_catalog` browses the source catalog by area and form; `praxis_search` and `praxis_source` look up the roster, and search reads the notes written on pages and the excerpts as well. A material with a local copy names its latest version's folder; when the original is gone, the agent reads that copy, and `praxis_stock` keeps a new one.
3. Registers web references worth keeping with `praxis_capture`, in batches, with the task they were found for, a form and a description, and binds them to pages with `praxis_curate` where a page needs them.
4. Asks `praxis_projects` which project the delivery folder belongs to, registering one with `praxis_project` if there is none, and puts its files where the project's layout says.
5. Before delivery, records the pages and sources it read with `praxis_consume`, each source with a line on what it was used for when the agent gives one and the stock version when it read a local copy, and registers the delivered files as artifacts; delivering a changed file again adds a version. The run records the session, so the text of an original the agent read can be found again in that session's transcript.

`praxis_resolve` and `praxis_consume` calls show as cards in the session: expand one to see the pages and materials, or open a delivered file; the card's *Open in Praxis* link opens the matching place on the Praxis page.

The tools that maintain the roster, presets and artifacts stay on the control plane, the command line and MCP.

## The Praxis page

**Praxis** in the left sidebar is the control plane; `/praxis` on its own opens it, and with text after it the session view lists the task types and what needs attention, sent to no model. The `praxis_resolve` and `praxis_consume` cards in a session link to the matching place on the page.

The page has a sidebar of its own, inside DSH's sidebar. It lists the five sections and, under the one in front, that section's fixed places: Kit its layers (Design, Writing, Task, Publish); Shop *All*, *New*, *Recently used*, *Manage* and the saved *Views*; Task the task types. Artifacts and Log have none. The sidebar holds only places that do not move with the data, with counts, and Log with what needs attention; filtering, grouping and deeper levels happen on the page to its right. On a narrow page the sidebar shows icons only.

The page's levels follow the path an agent takes: entry → layer → area → unit → the sources on a unit → a source's record → the original. Each level shows descriptions and counts; the next level opens on demand.

- **Kit**: the home page lists the core (Design, Writing), streams, the downstream workflows (Task, Publish), bindings outside the Kit, source packs and the pages taken out of the Kit (restorable). A unit page gives the description, the full text on demand, its contents and the sources on it; a source there can be taken out of tasks with *Use in tasks*, starred, checked against its original, reviewed for this page's description, or removed from the page (restorable). A revised unit shows why and can be reverted. The outline itself can be changed; see Revising the Kit below.
- **Shop**: every source is an item on a shelf. *All* starts with two short rows, *New* (latest collected first) and *Recently used* (latest read by a run first), then lays the catalog out as shelves by Kit layer and area: each area shows its three newest sources, and *Show all* opens the rest, grouped by form. *Group by* groups by form instead, or lays everything out as one list. *New* and *Recently used* in the sidebar are those two rows in full. *For* shops for a need: a task type or a stream lays out every source an agent doing that task gets, in the order it gets them, catalogued or not; a Kit page lays out the sources on it. A search or a tag shows every match in full, says how many match beside the filters, and offers *Clear filters* when nothing matches. Once narrowed, *Save view* keeps the filter (For, tag, search words, grouping) under a name in the sidebar's Views; people and agents rename, refilter or remove a view with `praxis_view_save` and `praxis_view_remove`. All, New and Recently used in the sidebar start clear; a view brings its own filter. *Manage* filters by To review, Needs work, Reviewed, Link only (no local copy), Restock (the original changed after the latest download) and All. A row names how far the original was read only when it is not the usual partial reading. In the grid a card opens with the cover from its stock (the original's preview image) or else an excerpt (with where it sits in the original) as its preview, then the title, kind and site, and when to use it; tags, state, *In stock* when there is a local copy, date and the cart sit at the foot. A tag filters the shelves. Search covers tags, the notes written on Kit pages and the excerpts; when a searched word is in an excerpt, the row shows that passage and the card uses it as its preview.

  A source opens to the same sections every time, with empty ones kept and marked, in the order a judgment needs: when to open it and what to take; where in the original; what was read, with its read depth and upstream check (an original that no longer answers is said at the top); limits and when to revisit; then the question on the description. After that come the Kit pages it is attached to, each one opening that page; *On the same pages*, the other sources on those pages, those sharing more of them first; and its activity: what it was collected for, the runs that read it, with what each used it for, and the files they delivered, each opening its artifact. Last comes *Stock*: the local versions, newest first, each with its size and what changed since the one before, and *Quick look* (a page's preview image and text, a repository's README, a distill, or a PDF, image or video as the browser shows it). *Distill* asks an agent, in a session of its own, to read the original and save a Markdown summary as a version of its own, each point with where it sits in the original and headed as a distill, not the original. *Download* gets a first copy and *Update* a newer one: a repository as one commit's source archive and README, a page with the images, stylesheets and preview image it uses, any other file as it is, up to 50 MB a version; nothing downloaded is run. An unchanged original adds no version. When the original no longer answers, the top of the page says a local copy can be read. Coming back to the shelves keeps the filters, search and open shelves, and marks the last source seen; a source given a verdict in Manage leaves the queue, and focus goes to the next one. The original is one click away, top right: the description is for deciding whether to open it, and using a source means reading the original. *Accurate* records the verdict against the version you saw: if an agent rewrote the description while you were reading, Praxis does not record it and shows the new description for you to judge. *Needs work* takes a line on what is wrong and hands it to Praxis to reread and rewrite. After a verdict, *Next source* opens the next one.
- **Task**: pick a task type in the sidebar, then a pipeline, preset and stream on the page, to see the units an agent would read, every source on them once, the examples and pipelines, and the acceptance checks. Below are the presets per pipeline; presets are settings and are edited here.
- **Artifacts**: local work grouped by project. An artifact shows the pages it serves and its versions (each with its run, the units and sources it used, and the pipeline that made it); show it in Finder, open it in its default app, and review the current version.
- **Log**: what needs attention (usually nothing; the tab shows a count when there is something), then runs and maintenance. Uncatalogued sources and new upstream members of a collection can be handed to Praxis; skipping or retiring takes a line of reason.

Each section keeps its own place, filters and scroll position: switch to another section and back, and it is where you left it; click the current section again to go to its first level. A source opens over the place it was opened from, with a trail of the places above it at the top, such as Kit / Design / Interaction / the page it came from. A step in the trail, or Esc, goes back: the scroll position is as it was and focus returns to the item you came from; on a Kit page or an artifact, Esc goes up one level. ← and → step through the list the source was opened from: a shelf or row in All, the Manage queue, the sources on a Kit page or on the same pages, a task's materials, the sources a version of an artifact used, or the cart.

**The composer** sits at the bottom of every place. Paste one or more links and Praxis starts an agent session in the background that reads each original, writes down what it is and when to recommend it, captures it under the filing rules and attaches it to the pages it clearly serves, so later tasks get it through `praxis_resolve`. You can also paste a conversation from another chat: the agent treats it as second-hand material, checks each project and claim against the originals, keeps what holds and reports what did not. Changes to existing sources are asked for here too. Records have no edit form: as with Claude's memory, you say it and the agent writes it. Progress shows above the composer: a request still running has a line of its own; finished ones fold into one line naming what the latest captured, with the earlier ones behind *{n} more*, and × puts them away. A title opens that source and *Session* opens the run.

**The cart** gathers the sources to work with: *Add to cart* on a row, card or source page. Once something is in it, the cart sits above the composer. *Open in chat* starts a new session with the sources (link, when to use it, Praxis ID) already in its input, to do the work there, and the cart folds away; *Copy* copies the same text for another agent; *Copy IDs* copies only the Praxis IDs, for an agent with the Praxis MCP, which looks each one up with `praxis_source` for the read scope and excerpt locations. Adding an item sends a small dot from the button to the cart, left out when reduced motion is on. The cart lives in this browser only.

A source's entry stands on its own: its description, summary, excerpts, limits, when to revisit, and what each attached page takes from it name no local project and no other source, so any task can use it as written. What a project did with a source is its activity: the capture record and the runs, with what each run used it for.

A source without a curated description, or one nobody has reviewed, is the normal state. The summary stands in until someone has a reason to curate it.

## Revising the Kit

Changes to the Kit, by a person or an agent, are stored in an overlay in the user's data and take effect at once on every surface; the pages in the package stay as shipped. A person clicks on a Kit page; an agent calls `praxis_outline`; the moves are the same:

- **Add** a page under an area; marked *An area*, it is a new area that takes pages of its own, at any depth. When a new grammar of the same kind turns up (another surface beside Blur and Glass, say), it is a page added under that area.
- **Revise** a page's whole text. When a package upgrade changes that page, the revision is listed as needing attention, to be merged or reverted; a reverted revision's full text stays in the history.
- **Remove or merge**: a page leaving the Kit takes its sources to another page (a merge; their notes move with them), or must have none; an area leaves only once nothing is under it. Removed pages are listed on the Kit home and can be restored.
- A split is an added page, a revised one and the sources hung on the new page; a rename or move is an added page with the old one merged into it.

Every change carries a reason into the history.

## Other agents

The same tools are served over MCP (`adapters/mcp.js`, stdio) and a command line (`adapters/cli.js`), so Claude Code, Codex or another agent reads and maintains the same Kit and roster. MCP also offers resources (the entry, every page, sources and artifacts) and prompts (one per task type).

## Install and data

```bash
dsh plugin --profile desktop add link:/path/to/dsh-praxis
```

Restart DeepSeek Harness after installing. The data root is the first of: `config.data`, the `PRAXIS_DATA` environment variable, a `data/` folder beside the package, and `$DSH_HOME/dsh-praxis` (`~/.dsh/dsh-praxis` when `DSH_HOME` is unset). MCP and the command line resolve it the same way and share the data by default. Set `config.prompt: false` to leave the system-prompt entry out. See [Install and run](../INSTALL.md) (Chinese) for the full guide.
