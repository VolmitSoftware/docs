---
title: SkyPrime - Operations and recovery
description: Persistence, interrupted jobs and diagnostics
published: true
date: 2026-09-19T00:00:00.000Z
tags: skyprime, operations, recovery
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

SkyPrime keeps island identity, membership, progression and cell allocation in one file, and records creation, reset and deletion as durable jobs so they survive a crash.

## Storage and backups

`data/islands.json` is the island store, written atomically, with the previous committed copy kept as `data/islands.json.backup`.

It holds permanent guests, mission periods and completions, upgrade levels, the credit ledger, and owner creation and reset history, which survives island deletion. Invitations, ownership offers and temporary guest access are in memory only and do not survive a restart.

Loading validates the schema, numeric ranges, UUIDs, membership and cell uniqueness. Corrupt data stops initialization rather than silently falling back to the backup. An I/O failure blocks further changes and shows up in `/sky debug status`.

> Stop the server before restoring a backup, and restore the plugin data and the managed world terrain from the same point in time. Do not edit membership indexes by hand; they are rebuilt from the island store at startup.
{.is-warning}

## Interrupted world jobs

An island is `CREATING`, `ACTIVE` or `DELETING`. `world-jobs/<UUID>.json` records the operation and its starter before any block changes, and a custom starter's full content is copied in, so editing the template afterwards cannot change a job already running. Saved jobs retry on startup, and nobody can enter the island while it rebuilds.

Use `/sky admin inspect <UUID>` to inspect persisted state. `/sky admin resume <UUID> starter=normal` clears an interrupted creation reservation and rebuilds it with the explicitly selected starter, which defaults to `normal`. Unlike automatic startup recovery, this command does not select the starter from the saved job. If cleanup is required, `/sky admin delete <UUID> <UUID>` deletes that reservation after the repeated-UUID confirmation. An active world job cannot be superseded by a competing reset or deletion.

At most two world jobs run at once, each bounded by `runtime.blocksPerTick`, and one value scan runs at a time. `/sky debug status` lists active job counts and failed job details.

## Diagnostics

`/sky debug dump` creates a local shared-format report containing server and plugin diagnostics plus island counts, persistence health, managed worlds and scheduling information. Upload requires both `general.debugUploadEnabled = true` and an explicit `upload=true` request. Local reporting works without upload access.
