# Revoke user access in an emergency in Microsoft Entra ID

- URL: https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access
- Retrieved: 2026-09-30
- Publisher: Microsoft Learn (official first-party documentation)
- Evidence state: verified-online-no-page-snapshot
- Locator: Sections “Session tokens (cookies)”, “Microsoft Entra environment”, and “When access is revoked”.

## Source-level finding

Admins can block new sign-ins and revoke refresh tokens/sessions in Entra. Microsoft cautions that app-issued session cookies may persist until the app rechecks Entra or the app itself revokes them; access-token effects can wait for expiry. Use the organization’s offboarding workflow and independently deprovision apps that do not federate their session control.

## Limits

Administrative guidance for work/school identity; requires appropriate roles. Revocation is not always instantaneous across every app/device.
