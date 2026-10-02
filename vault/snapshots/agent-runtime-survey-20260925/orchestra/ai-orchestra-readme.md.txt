CURATED RESEARCH EXTRACT from official yedidya-buildfy/ai-orchestra README.md and package.json (paraphrased; not a byte-for-byte source copy)
Source: https://github.com/yedidya-buildfy/ai-orchestra/tree/107b590f4404bed258edeed493feb42fbc7f6a72
Pinned source: main (107b590f4404bed258edeed493feb42fbc7f6a72), package version 1.4.0

Repository identity
--------------------
AI Orchestra is a self-refreshing, token-aware multi-agent orchestration over
Markdown. It runs Claude Code, Codex CLI and Gemini CLI side by side as
subscription-backed agents in tmux, with `.orchestra/` Markdown as the shared
brain. The CLI binary is `orc`.

Process and state model
-----------------------
`orc init` scaffolds `.orchestra/`, spawns the three configured CLI commands in
background tmux sessions, starts a watcher daemon and can attach to Claude.
The durable files include board.md, memory.md, changelog.md, protocol.md,
per-agent profiles, tmux session metadata/pipe buffers, metrics and logs.
`orc rename` finds the most recent per-CLI native conversation IDs and stores
them in `~/.config/orc/sessions.json`; `orc resume` starts each CLI with its
provider-specific resume command. Missing IDs fall back to a fresh spawn.

Refresh flow and permissions
----------------------------
At 90–95% estimated context use it recommends refresh; at 95%+ it forces a
refresh. The flow snapshots the agent block and last 50 output lines into
memory/changelog, compresses memory, kills tmux, spawns a fresh session,
rehydrates protocol/memory/board/objective and verifies liveness. Claude is
the controller with WRITE everywhere; Codex/Gemini use board scopes through a
picomatch helper.

Boundaries
----------
The project uses tmux subprocesses, not an SDK or provider gateway. The
default commands enable autonomous/bypass modes. It shares one workspace and
does not create one Git worktree per agent or expose a structured approval/event
protocol. Its value as a reference is session refresh/context survival and
simple durable state, not isolation or heterogeneous provider routing.
