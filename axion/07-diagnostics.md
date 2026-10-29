---
title: "Axion: Diagnostics"
description: "Status, diagnostic reports, and machine result codes"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "axion, automation"
editor: "markdown"
dateCreated: 2026-10-15T00:00:00.000Z
---

Use `/axion status` for the machine count, supported runtime, scheduler, and server language. Use `/axion inspect` while looking at a controller for its own state and pause reason.

## Diagnostic reports

`/axion debug dump` saves a report and requests an upload. Set `upload=false` for a local report; `debug.uploadEnabled=false` blocks uploads globally. Local reports are kept under `plugins/Axion/debug/` even if an upload fails.

The report includes shared server, plugin, scheduler, JVM, and storage details. Axion adds registered and loaded machine counts, result counts, native spawn-protection availability, world-policy counts, retained and uncertain output stack counts, configuration state, locale, metrics state, and update configuration.

Axion also participates in `/volmit plugins debug all`. `/axion debug version` shows its installed version; `/axion version` is the hidden alias.

## Machine results

Inspection and preview show translated result names. Debug reports retain the following stable codes.

| Result | Meaning |
| --- | --- |
| `WORLD_DISABLED` | `settings.allowedWorlds` and `settings.deniedWorlds` |
| `OWNER_UNAVAILABLE` | Owner is online and available to the executing region |
| `REGION_BOUNDARY` | Owner and target belong to the current region |
| `UNLOADED_CHUNK` | Target chunk is loaded without forcing it |
| `PROTECTED` | Native spawn protection or an action event denied the change |
| `PROTECTION_UNAVAILABLE` | Native protection binding failed; inspect its console stacktrace |
| `OUTPUT_FULL` | Controller has room for the complete output |
| `OUTPUT_SPILL` | Output is retained for delivery at the work location; the debug report shows outstanding stacks |
| `INVALID_FILTER` | Sign mode and material names are valid |

## Retained output

Axion saves retained stacks in `storage/pending-output.bin` before attempting delivery. Retryable stacks are attempted again at roughly five-second intervals while their world and destination chunk are available; this does not force-load chunks. Successful stacks are acknowledged separately, so a failed stack does not repeat successful deliveries from the same batch.

Graceful shutdown drains active work and saves undelivered stacks for the next start. A crash can interrupt the asynchronous capture or acknowledgement window. Stacks with an uncertain outcome are held without automatic retry, and their delivery IDs are logged for review. Keep the data file when making a backup; do not delete it to clear the diagnostic count.

## Statistics and release notices

`metrics.enabled` controls the local bStats service. An ID of `0` disables submission. A registered build also respects the global bStats opt-out in `plugins/bStats/config.yml`. Debug reports show the actual registration and active state.

`general.updateNotifications` controls GitHub release checks. `/volmit plugins updates` shows the shared report to operators and permitted players. Notices never download or replace the plugin jar. Debug reports include the repository and catalog revision; `unpublished` means missing language files cannot be downloaded.

## Related pages

- [Installation *Runtime requirements and data files*](/axion/01-installation)
- [Configuration *Diagnostics and notification settings*](/axion/03-configuration)
{.links-list}
