---
title: "Temper: Diagnostics"
description: "Status, debug reports, update notices, and metrics"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "temper, diagnostics"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Use `/temper status` to inspect the plugin's current state. `/temper debug version` prints its version; `/temper version` is a hidden alias for the same output.

## Debug reports

`/temper debug dump upload=false` creates a local report under `plugins/Temper/debug/`. It combines the shared server/JVM diagnostics with Temper's configuration, station and transaction state, economy availability, metrics, and update-notifier state.

Uploads require `debug.uploadEnabled=true` and `upload=true`, which is the command default. Use `upload=false` to keep a report local even when uploads are enabled. A failed upload leaves the local file available. Temper also contributes to the shared `/volmit plugins debug` tools.

## Update notices and metrics

`general.updateNotifications` controls GitHub release checks. The configured source is `VolmitSoftware/Temper`. The checker reports release availability; it does not download or install a plugin jar. Notices are disabled by default.

`metrics.enabled` controls anonymous bStats reporting when the build has a positive service ID. A service ID of `0` disables submission. The global bStats opt-out is also respected.

## Money transaction review

Use `/temper ledger list` to inspect unresolved transactions. Compare a record with the economy provider’s transaction data before running `/temper ledger resolve <id>`. Resolution acknowledges the operator’s review; it does not withdraw, refund, or repair again.

Unresolved records remain in `storage/transactions/`. Completed, cancelled, and resolved records move to `storage/transactions/archive/` and follow the configured retention limits.

## Related pages

- [Installation *Requirements and data paths*](/temper/01-installation)
- [Configuration *Reporting toggles*](/temper/03-configuration)
- [Commands *Permissions and ledger operations*](/temper/02-commands-permissions)
{.links-list}
