# Praxis

Praxis is a bundle of working methods for writing, laying out, designing and reporting. It has four layers, each a set of short pages:

| Layer | What it decides |
|---|---|
| Task | What this piece of work is for, which pipeline it takes, and which pages to read |
| Writing | How the content is argued and organised, in which genre and language |
| Design | How relations become visual, interactive or moving form |
| Publish | How content is produced for a medium: html pages or video |

Sources are bound to pages: a reference, an example, an outside document. Each binding has a short description saying when to use it.

## What the agent does

The plugin adds `praxis_*` tools and a short entry to the system prompt. For a task, the agent calls `praxis_resolve` with a task type and a pipeline, reads only the pages it returns with `praxis_unit`, and records what it used with `praxis_consume` before delivery. Writing and Design entry pages are always in context; everything else is read on demand.

## The sidebar panel

Open **Praxis** from the right sidebar's guide.

- **Catalog**: the four layers, then their areas, then pages. Each step shows descriptions and counts; a page opens to its sources as cards. On a card you can switch a source on or off, star it, refetch it, rewrite its description, record a review or delete it (deletions can be restored). **Capture a source** registers a new reference.
- **Task**: pick a task type and pipeline to see exactly what the agent would read, the sources it may use and the acceptance checks.
- **Presets**: defaults per pipeline, such as the TTS voice and aspect ratios for video or the theme for html. Only the name of an environment variable is stored, never a key.
- **Log**: anything that needs attention (a review marked *needs work*, a source that changed since it was reviewed, a delivery whose pages, sources or presets changed later, a captured source not yet bound), then runs and maintenance history. It is usually empty; the tab shows a count when it is not.

A source without a curated description, or one nobody has reviewed, is the normal state. The source summary stands in until someone has a reason to curate it.

## Other agents

The same tools are served over MCP (`adapters/mcp.js`, stdio) and a command line (`adapters/cli.js`), so Claude Code, Codex or another agent provider reads and maintains the same Kit.

## Install

```bash
dsh plugin --profile desktop add link:/path/to/dsh-praxis
```

Restart DeepSeek Harness after installing. The plugin finds its repository from the package location; when the package is copied elsewhere, set `config.root`. Set `config.prompt: false` to leave the system-prompt entry out.
