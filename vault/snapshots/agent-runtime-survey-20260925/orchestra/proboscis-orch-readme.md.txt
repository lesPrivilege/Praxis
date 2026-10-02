CURATED RESEARCH EXTRACT from official proboscis/orch README.md (paraphrased; not a byte-for-byte source copy)
Source: https://github.com/proboscis/orch/tree/v1.8.3-beta
Pinned source tag: v1.8.3-beta (b1a6c1628fea02ad56347d4df9a7e1bef4e2b65d)

Repository identity
--------------------
Orchestrator for managing multiple LLM CLIs (Claude, Codex, Gemini, OpenCode)
using a unified vocabulary of Issue, Run, and Event.

orch runs AI coding agents non-interactively in the background, creating isolated
git worktrees for each task. `orch ps` checks status; `orch attach` interacts
with a run. The beta support scope is a single machine: daemon, worker and
agents are local. Multi-host mode works in development but is outside the
supported beta scope.

Prerequisites and first run
---------------------------
A git repository with an origin remote, tmux (or zellij), and at least one
logged-in agent CLI (`claude`, `codex`, `opencode`, or `gemini`) are required.
The normal flow is:

  mkdir -p .orch && printf 'agent: claude\nbase_branch: main\n' > .orch/config.yaml
  orch daemon repo register "$(pwd)"
  orch issue create my-task --title "Add hello world function" --edit
  orch run my-task --no-pr
  orch ps
  orch attach my-task

Core vocabulary and status
---------------------------
Issue is the task specification. Run is one execution attempt, with its own
worktree and branch. Event is an append-only log entry. Status is derived from
events. The documented status set includes queued, booting, running, waiting,
rate_limited, pr_open, done, failed, canceled and unknown.

Documented agent backends
-------------------------
Claude (Anthropic Claude Code), OpenCode (multi-provider open-source agent),
Codex (OpenAI Codex) and Gemini (Google Gemini), plus a custom command adapter.
OpenCode receives model IDs in provider/model form and is handled as a local
headless HTTP server; the other documented paths use a terminal multiplexer.

Version evidence
---------------
GitHub release v1.8.3-beta was published 2026-07-15 and carries the source tag
above. The release notes mention worker-start readiness and the release assets
include platform binaries and checksums. The repository has no declared license
yet; the README says the beta is for evaluation and redistribution is not
granted.
