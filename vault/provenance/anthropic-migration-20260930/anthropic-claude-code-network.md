# Enterprise network configuration

- URL: https://code.claude.com/docs/en/corporate-proxy
- Retrieved: 2026-09-30
- Publisher: Anthropic Claude Code Docs (official first-party documentation)
- Evidence state: verified-online-no-page-snapshot
- Locator: Sections on proxy variables, network access requirements, and organization IP allowlisting.

## Source-level finding

Claude Code supports standard HTTP/HTTPS corporate proxies and documents required Anthropic/Claude hosts to permit through approved proxy/firewall rules. The page also describes organization IP allowlisting: where an organization has enabled it, proxy egress must match the organization allowlist and dedicated egress is advised; shared vendor egress may admit other customers. This is a legitimate enterprise network configuration, not evidence that VPN/proxy use changes supported-region eligibility.

## Limits

Technical support for corporate proxies and IP allowlisting is not a statement that personal VPNs are supported as a way around location restrictions. Clarify actual organization network policy with the administrator.
