CURATED RESEARCH EXTRACT from official reidliu41/agent-workbench README.md (paraphrased; not a byte-for-byte source copy)
Source: https://github.com/reidliu41/agent-workbench/tree/0.1.12
Pinned source tag: 0.1.12 (4c6f7b7d937873fb3b546cd616a1a7edad55e3f7)

Repository identity
--------------------
Agent Workbench is a local-first web workspace for managing coding-agent work
across multiple projects and multiple sessions. The repository describes a
review-first flow: one implementation session maps to one branch, one isolated
worktree and usually one PR.

Supported local CLI paths
-------------------------
Gemini CLI, Gemini ACP, Codex CLI, Claude Code, Qwen Code and GitHub Copilot
CLI are listed as native backends. The server uses Fastify + WebSocket and
node-pty; the right-side terminal is the native CLI itself. Brainstorm Mix is a
separate read-only mode that selects multiple CLIs per round and stores a shared
transcript under `~/.agent-workbench/brainstorm/`; it does not edit worktrees or
deliver changes.

Session and worktree flow
-------------------------
Add a local git project, create a session branch, select a CLI, attach the
native terminal, review changes, take snapshots, then optionally add/commit/
push/create a draft PR. Workbench records native CLI session IDs and uses each
CLI's resume command on later attaches. It can import Gemini, Codex, Claude and
Qwen sessions; Qwen history is bridged into the isolated worktree before resume.

Provider-specific native semantics
----------------------------------
Claude starts with a preallocated `--session-id` and later uses `--resume`.
Codex discovers its native session metadata and later uses `codex resume`.
Gemini supports native resume and an ACP path. Qwen starts with a fixed session
ID and later uses `qwen --resume`, including a worktree-scoped history bridge.
Copilot starts with a fixed session ID and later uses `copilot --resume=<id>`;
existing Copilot import is not wired.

Boundary declared by the README
--------------------------------
Slash commands, model controls, approvals, skills, plugins and hooks remain
inside native terminals for the terminal backends. Workbench does not yet
mirror Claude/Codex/Qwen/Copilot approvals or parse their structured protocol
events; Gemini ACP is the structured exception with surfaced approvals and
partial command discovery.
