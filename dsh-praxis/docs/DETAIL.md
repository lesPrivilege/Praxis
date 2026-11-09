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

The plugin registers 11 tools in agent sessions and adds a short entry to the system prompt. For a task, the agent:

1. Calls `praxis_resolve` with a task type and a pipeline, and reads only the pages it returns with `praxis_unit`. Writing and Design entry pages are always in context; everything else is read on demand.
2. Goes back to an original through the material's link and excerpt locator when it needs to check or borrow something; `praxis_catalog` browses the source catalog by area and form; `praxis_search` and `praxis_source` look up the roster.
3. Registers web references worth keeping with `praxis_capture`, in batches, with the task they were found for, a form and a description, and binds them to pages with `praxis_curate` where a page needs them.
4. Asks `praxis_projects` which project the delivery folder belongs to, registering one with `praxis_project` if there is none, and puts its files where the project's layout says.
5. Before delivery, records the pages and sources it read with `praxis_consume` and registers the delivered files as artifacts; delivering a changed file again adds a version. The run records the session, so the text of an original the agent read can be found again in that session's transcript.

`praxis_resolve` and `praxis_consume` calls show as cards in the session: expand one to see the pages and materials, or open a delivered file; the card's *Control plane* link opens the sidebar panel.

The tools that maintain the roster, presets and artifacts stay on the control plane, the command line and MCP.

## The Praxis page

**Praxis** in the left sidebar is the control plane; `/praxis` on its own opens it, and with text after it the session view lists the task types and what needs attention, sent to no model. The `praxis_resolve` and `praxis_consume` cards in a session link to the matching place on the page.

The page's levels follow the path an agent takes: entry → layer → area → unit → the sources on a unit → a source's record → the original. Each level shows descriptions and counts; the next level opens on demand. Five tabs:

- **Kit**: the home page lists the core (Design, Writing), streams, the downstream workflows (Task, Publish), bindings outside the Kit and source packs. A unit page gives the description, the full text on demand, its contents and the sources on it; a source there can be switched on or off, starred, checked against its original, reviewed for this page's description, or removed (restorable). A revised unit shows why and can be reverted.
- **Sources**: two views. *Catalog* arranges sources by Kit layer, area and form; *Review* filters them by To review, Needs work, Reviewed and All. Each row's left edge and its word say how far the original was read. A source opens to the same sections every time, with empty ones kept and marked: when to open it and what to take; read depth, upstream check and capture date; what was actually read; where in the original; the pages it is attached to; the tasks that read it; limits and when to revisit; why it was collected, with the summary folded at the end. The original is one click away, top right: the description is for deciding whether to open it, and using a source means reading the original. The footer asks whether the description is right: *Accurate* records it; *Needs work* takes a line on what is wrong and hands it to Praxis to reread and rewrite.
- **Task**: pick a task type, pipeline, preset and stream to see the units an agent would read, the materials, examples and pipelines, and the acceptance checks. Below are the presets per pipeline; presets are settings and are edited here.
- **Artifacts**: local work grouped by project. An artifact shows the pages it serves and its versions (each with its run, the units and sources it used, and the pipeline that made it); show it in Finder, open it in its default app, and review the current version.
- **Log**: what needs attention (usually nothing; the tab shows a count when there is something), then runs and maintenance. Uncatalogued sources and new upstream members of a collection can be handed to Praxis; skipping or retiring takes a line of reason.

**The composer** sits at the bottom of every tab. Paste one or more links and Praxis starts an agent session in the background that reads each original, writes down what it is and when to recommend it, captures it under the filing rules and attaches it to the pages it clearly serves, so later tasks get it through `praxis_resolve`. You can also paste a conversation from another chat: the agent treats it as second-hand material, checks each project and claim against the originals, keeps what holds and reports what did not. Changes to existing sources are asked for here too. Records have no edit form: as with Claude's memory, you say it and the agent writes it. Progress shows above the composer; when it finishes, the line names what was captured and *Session* opens the run.

A source without a curated description, or one nobody has reviewed, is the normal state. The summary stands in until someone has a reason to curate it.

## Revising the Kit

A revision of a page, by a person or an agent, is stored in the user's data and takes effect at once on every surface; the page in the package stays as shipped. When a package upgrade changes that page, the revision is listed as needing attention, to be merged or reverted; a reverted revision's full text stays in the history.

## Other agents

The same tools are served over MCP (`adapters/mcp.js`, stdio) and a command line (`adapters/cli.js`), so Claude Code, Codex or another agent reads and maintains the same Kit and roster. MCP also offers resources (the entry, every page, sources and artifacts) and prompts (one per task type).

## Install and data

```bash
dsh plugin --profile desktop add link:/path/to/dsh-praxis
```

Restart DeepSeek Harness after installing. The data root is the first of: `config.data`, the `PRAXIS_DATA` environment variable, a `data/` folder beside the package, and `$DSH_HOME/dsh-praxis` (`~/.dsh/dsh-praxis` when `DSH_HOME` is unset). MCP and the command line resolve it the same way and share the data by default. Set `config.prompt: false` to leave the system-prompt entry out. See [Install and run](../INSTALL.md) (Chinese) for the full guide.
