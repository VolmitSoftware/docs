---
title: System and updates
description: Open Administration > System & Updates for system health and application updates
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, updates, deployment
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

Open **Administration > System & Updates** for system health and application updates. Owners and administrators with dashboard view access can read Health. Application updates remain restricted to owners with configuration permission. The previous `/dashboard/application-updates` address still opens the updater.

## Updating the VPS

Complete the private GitHub deployment setup once. The updater requires a configured repository and token, its GitHub Actions workflow, and the VPS deployment helper. The dashboard shows setup requirements when these are missing; opening this page does not install them.

Check GitHub, review the exact commit and comparison, then confirm deployment. Reviews expire after 15 minutes. A changed source branch or installed revision requires a new review. An uncertain dispatch blocks repeated deployment requests until its outcome is resolved.

The deployment workflow builds and tests the application, checks the package, stops the service and creates a backup before replacing application code. Saved data and credentials remain on the VPS. Startup must report the expected revision and readiness; failed startup restores the previous code. Code rollback preserves current data and cannot reverse an incompatible database migration. Deployment archives and regular dashboard backups are separate mechanisms.

Review mode blocks GitHub checks, deployment requests and workflow refresh requests. It permits reading saved updater status. Local UI tests use mocked GitHub responses and never deploy.

## Reading health

Health collects independent readings with bounded timeouts. One failed reading becomes unavailable without hiding the others. The page refreshes every 30 seconds while visible, and pauses polling while hidden. Results are cached for 15 seconds per access scope; the displayed check time identifies when they were collected.

- **Discord bot:** the latest persisted connection heartbeat. Stale or missing heartbeats do not prove a current connection.
- **Message recording and server logs:** enabled settings, observed runtime, retained counts and delivery failures. Disabled recording stays visibly disabled.
- **Jobs:** release queue failures and uncertain results, up to ten recent delivery issues, and the latest weekly-report attempt. Historical issues remain visible until resolved in their source workflow.
- **Storage:** used and available bytes on the volume containing the configured backup directory. Other volumes and individual application directories are not measured. Less than 2 GiB available warns; less than 256 MiB is critical.
- **Scheduled backups:** enabled state and the last recorded scheduled attempt. An old success or missing result is not treated as a recent successful backup.
- **Publishing:** local module state and credential-presence flags. Artifact publishing and Scribe use separate connections, so their flags are listed separately.
- **Scribe:** bounded GET requests to the configured loopback engine's health and connection metadata endpoints. Credential storage problems are reported without returning keys, tokens or raw error details.

Health does not call Discord, GitHub or marketplaces. Saved provider credentials are marked unverified; their presence does not confirm validity or permissions. Detail links open the existing configuration and history pages. The page does not retry failed jobs, send alerts, publish releases or change settings.

Local sample review sessions can use fictional community records while showing actual local disk and engine readings. The banner distinguishes that mixed view. This dashboard cannot report its own outage while stopped; external VPS monitoring remains separate.
