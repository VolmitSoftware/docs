---
title: 04 - Operations & Recovery
description: Persistence, interrupted jobs and diagnostics
published: true
date: 2026-09-14T00:37:05.832Z
tags: skyprime, operations, recovery
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

SkyPrime persists island identity, membership, progression and cell allocation in one versioned aggregate. Creation, reset and deletion also carry durable world-job descriptors. Console failures include their stack traces and operational context.

## Storage and backups

`data/islands.json` is the authoritative island aggregate. Writes use a serialized worker and atomic replacement; `data/islands.json.backup` retains the previous committed aggregate. Bursts retain one write in progress and one coalesced latest snapshot. Success replies for persisted player changes wait for the corresponding snapshot to become durable; invitations, ownership offers and temporary guest access remain in memory. Owner creation/reset history survives island deletion. Permanent guests, mission periods/completions, upgrade levels and the bounded credit ledger are part of the aggregate.

Loading validates the current schema, numeric ranges, UUIDs, unique membership and unique cells. Corrupt current data stops initialization instead of silently loading a backup. An I/O failure stops subsequent domain mutations and is visible in `/sky debug status`.

Stop the server before restoring a backup. Restore matching plugin data and managed world terrain from the same recovery point. Do not edit player membership indexes separately; they are derived from the aggregate at startup.

## Interrupted world jobs

`CREATING`, `ACTIVE` and `DELETING` distinguish protected reservations from playable islands. `world-jobs/<UUID>.json` records the operation and selected starter before block changes begin. Custom starters include their full immutable bundle content in that descriptor; editing or removing the catalog file cannot alter an admitted or automatically recovered job. On startup, saved jobs retry their bounded operation. A retry may revisit already-applied terrain; players cannot access the reservation while it is being rebuilt.

Use `/sky admin inspect <UUID>` to inspect persisted state. `/sky admin resume <UUID> starter=normal` clears an interrupted creation reservation and rebuilds it with the explicitly selected starter, which defaults to `normal`. Unlike automatic startup recovery, this command does not select the starter from the saved job. If cleanup is required, `/sky admin delete <UUID> <UUID>` deletes that reservation after the repeated-UUID confirmation. An active world job cannot be superseded by a competing reset or deletion.

Generation and clearing run through chunk-region tasks. At most two world jobs run concurrently; `runtime.blocksPerTick` applies to each job. One value reconciliation runs at a time. `/sky debug status` lists active job counts and failed job details.

## Diagnostics

`/sky debug dump` creates a local shared-format report containing server and plugin diagnostics plus island counts, persistence health, managed worlds and scheduling information. Upload requires both `general.debugUploadEnabled = true` and an explicit `upload=true` request. Local reporting works without upload access.

Configuration reload prepares a complete candidate before installation. Languages include nested per-player selection, all installed locale files participate in change detection, and invalid messages retain the previous snapshots.
