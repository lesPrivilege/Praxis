# How to manage stale devices in Microsoft Entra ID

- URL: https://learn.microsoft.com/en-us/entra/identity/devices/manage-stale-devices
- Retrieved: 2026-09-30
- Publisher: Microsoft Learn (official first-party documentation)
- Evidence state: verified-online-no-page-snapshot
- Locator: “Disable devices”, “MDM-controlled devices”, and “System-managed devices”.

## Source-level finding

Microsoft advises a disable/grace period before deleting possibly stale device records, retiring MDM-controlled devices in the management system before deleting/disabling identity records, and preserving system-managed Autopilot records because deletion can prevent reprovisioning.

## Limits

This is admin cleanup guidance for device records; it is not a consumer laptop reset checklist.
