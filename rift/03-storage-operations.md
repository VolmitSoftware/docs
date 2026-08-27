---
title: "Rift — Storage & Operations"
description: "Rift data files, backup strategy, recovery, and safer world-management procedures"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "rift, storage, operations, recovery, legacy"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift stores plugin state under `plugins/Rift/`. World directories themselves
remain in the server's world container, normally the server root.

## Files

| Path | Purpose |
|---|---|
| `plugins/Rift/config.json` | `verbose` and paths awaiting another deletion attempt |
| `plugins/Rift/worlds/<name>.json` | One managed-world record |
| `<server>/<world>/` | Bukkit world data, including `level.dat` |
| `bukkit.yml` | An additional source of worlds Rift tries to load |

A managed-world record has this shape:

```json
{
  "name": "resource",
  "seed": 12345,
  "environment": "NORMAL",
  "generator": "normal",
  "type": "NORMAL"
}
```

The fields suggest full lifecycle persistence, but the audited startup path only
uses `name` and `generator`. It derives type from the generator string and does
not apply the stored seed or environment. `type` is not populated from the
created world when a record is first written.

## Before any world operation

1. Stop the server and make a full, external backup.
2. Verify that the backup contains the world directory and `plugins/Rift/`.
3. Start the test copy and confirm every expected generator plugin enabled.
4. Perform the operation on a disposable world first.
5. Restart once and confirm the world seed, environment, generator, spawn, and
   player data before touching production worlds.

## Safer unload procedure

Rift evacuates players to the first world in Bukkit's loaded-world list, unloads
each loaded chunk with saving enabled, and asks Bukkit to unload the world with
saving enabled. It does not prevent unloading that first/default destination,
and it ignores the unload result.

Prefer this procedure:

1. Move players to a known-safe lobby or primary world yourself.
2. Confirm the target is not the primary world or an active plugin dependency.
3. Run `/rift unload <world>` from console.
4. Check the server log and `/rift list`; do not rely only on Rift's success text.
5. Stop the server before moving or copying the folder.

## Safer delete procedure

Do not use `/rift delete` on production. Instead:

1. Make and verify a full backup.
2. Unload the target, then stop the server.
3. Confirm the exact absolute world path contains the expected `level.dat`.
4. Move the world directory outside the server directory rather than deleting it.
5. Remove only `plugins/Rift/worlds/<world>.json` if the world should no longer be managed.
6. Start the server, review logs, and retain the moved copy until verification is complete.

## Recover `config.json`

The audited deletion path can serialize `config.json` as the JSON value `null`.
On the next start, Rift can throw a null-pointer exception while reading the
deletion queue.

With the server stopped:

1. Back up the broken file and all worlds.
2. Replace its contents with:

```json
{
  "verbose": false,
  "deleting": []
}
```

3. Start the server and verify Rift carefully.

This only recovers startup. The underlying save defect remains, so another use
of Rift's deletion path can write `null` again.

Next: [Code Audit](/rift/04-code-audit)
