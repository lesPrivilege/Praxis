# How do I log out of all active sessions?

- URL: https://support.claude.com/en/articles/10310342-how-do-i-log-out-of-all-active-sessions
- Retrieved: 2026-09-30
- Publisher: Anthropic Claude Help Center (official first-party documentation)
- Evidence state: verified-online-no-page-snapshot
- Locator: Help page, updated 2026-08-06; sections “How long are sessions on the Claude web app?”, “How to log out of all active sessions”, “How to log out from Claude Code”.

## Source-level finding

Web Settings > Account > Log Out immediately signs out web, mobile, and desktop sessions. The web session is 28 days and refreshes to 28 days after page activity. Claude Code authorization tokens are separately managed at Settings > Claude Code; deleting a token logs out that Claude Code authorization.

## Limits

This is first-party Claude account behavior. It does not revoke unrelated Google/email sessions, API keys, or tokens issued by other providers. Mobile apps do not provide the global logout action.
