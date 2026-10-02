# Device action: Retire — Microsoft Intune

- URL: https://learn.microsoft.com/en-us/intune/device-management/actions/retire
- Retrieved: 2026-09-30
- Publisher: Microsoft Learn (official first-party documentation)
- Evidence state: verified-online-no-page-snapshot
- Locator: Retire overview and platform data tables, including iOS/macOS/Windows notes.

## Source-level finding

Intune Retire removes managed company data/configuration and unenrolls without a full factory reset, preserving personal content; wipe resets the device. Actions wait until device check-in. On iOS, managed profiles/certs/network settings are removed; on Windows/macOS details vary, and some Entra records remain. Back up BitLocker recovery key and local admin credentials before retiring Entra-joined Windows devices.

## Limits

Results differ by platform and management configuration. Do not assume Retire is a full device erase or that a pending action has completed. A manager/admin should select the operation consistent with ownership and redeployment.
