# Praxis

Praxis is a bundle of working methods for writing, laying out, designing and reporting, with a roster of sources and your own authored streams. The methods come in four layers, each a set of short pages:

| Layer | What it decides |
|---|---|
| Task | What this piece of work is for, which pipeline it takes, and which pages to read |
| Writing | How the content is argued and organised, in which genre and language |
| Design | How relations become visual, interactive or moving form |
| Publish | How content is produced for a medium: html pages or video |

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

## `/praxis`

`/praxis` on its own opens the sidebar panel. With text after it, the session view lists the task types and what needs attention; nothing is sent to the model. To have the agent work with Praxis, say so in the conversation.

## The sidebar panel

Open **Praxis** from the right sidebar's guide.

- **Catalog**: the four layers, then their areas, then pages. Each step shows descriptions and counts; a page opens to its sources as cards. On a card you can switch a source on or off, star it, check it against upstream (is the link alive, did the content change), rewrite its description, record a review or delete it (deletions can be restored). **Capture a source** registers a new reference; it can be filed under a layer or area first and bound to a page later.
- **Task**: pick a task type and pipeline to see exactly what the agent would read, the sources it may use and the acceptance checks.
- **Artifacts**: the files a piece of work delivered, grouped by project; a project's header says where it keeps drafts, intermediate builds and finals, and which final files are not registered yet. Open one to see its versions, the pages and sources each version was based on, and the reviews of each version; preview it, show it in Finder, open it in its default app or drag it out.
- **Presets**: defaults per pipeline, such as the TTS voice and aspect ratios for video or the theme for html. Only the name of an environment variable is stored, never a key.
- **Log**: what needs attention, then runs and maintenance history. Attention covers a review marked *needs work*, a source that changed since it was reviewed or whose link no longer opens; a delivery whose pages, sources or presets changed later; a captured source not yet bound; a collection (a gallery, a component library) whose upstream added or dropped members; a page revision that conflicts with an updated page in the package; an artifact whose file is gone, whose latest version needs work or that sits outside its project's layout; a project with unregistered final files. It is usually empty; the tab shows a count when it is not.

A source without a curated description, or one nobody has reviewed, is the normal state. The source summary stands in until someone has a reason to curate it.

## Revising the Kit

A revision of a page, by a person or an agent, is stored in the user's data and takes effect at once on every surface; the page in the package stays as shipped. When a package upgrade changes that page, the revision is listed as needing attention, to be merged or reverted; a reverted revision's full text stays in the history.

## Other agents

The same tools are served over MCP (`adapters/mcp.js`, stdio) and a command line (`adapters/cli.js`), so Claude Code, Codex or another agent reads and maintains the same Kit and roster. MCP also offers resources (the entry, every page, sources and artifacts) and prompts (one per task type).

## Install and data

```bash
dsh plugin --profile desktop add link:/path/to/dsh-praxis
```

Restart DeepSeek Harness after installing. The data root is the first of: `config.data`, the `PRAXIS_DATA` environment variable, a `data/` folder beside the package, and `$DSH_HOME/dsh-praxis` (`~/.dsh/dsh-praxis` when `DSH_HOME` is unset). MCP and the command line resolve it the same way and share the data by default. Set `config.prompt: false` to leave the system-prompt entry out. See [Install and run](../INSTALL.md) (Chinese) for the full guide.
