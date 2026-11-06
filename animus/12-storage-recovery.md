---
title: "Animus: Storage and Recovery"
description: "How Animus stores documents, recovers from bad edits and crashes, and rolls changes back"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, storage, recovery, rollback, backups"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus keeps every document as a plain file in its data folder, `plugins/Animus/` (`config/animus/` on mod servers). Plugin settings are TOML; definitions, behaviors, packs, routes, skins, shops, GUIs, rigs and all generated state are JSON. Original import sources are archived in their own format.

Every write made by Animus goes through a journal, so a crash never leaves a file half-written, and every change made by a command, an import or the [web editor](/animus/14-web-editor) can be rolled back.

## Definitions

Each NPC is a file at `npcs/<folders>/<id>.json` (directly in `npcs/` or up to 8 folders deep; the folder sets its group) with a stable `uuid`, a readable `id` that is unique across all groups, a `schemaVersion` and an increasing `revision`. Commands, the editor and reloads use the same validation. An edit made from a definition that has changed in the meantime is refused as a conflict instead of overwriting the newer version.

Health, cooldowns and running behaviors are never written into definitions. A restart restores whether an NPC is spawned, not what it was doing.

## Last-valid recovery

When a definition is accepted, Animus also records a checkpoint of it under `state/npc-definitions/last-valid/`, pointing to a copy under `state/objects/npc-definitions/`. A command edit or deletion updates the source file and its checkpoint in one transaction.

| Situation at startup or reload | Result |
|---|---|
| A previously accepted file has a malformed or stale edit | Animus keeps the last valid definition, including whether it is spawned, and reports the exact field error. The broken file is left as it is |
| A new file is malformed | Startup fails and names the file |
| Two files share a UUID or id | Startup fails and names both |
| A checkpoint is corrupt | Startup fails and names it |
| A source file was deleted | The NPC is removed. Recovery never brings back a missing source |

A definition kept from its checkpoint stays active, but commands that edit it are refused until you repair the file and the repaired version is applied. `/animus validate` lists every file with its field errors, and `/animus status` counts the files needing repair.

The same holds for live reloads: a broken edit to one NPC file keeps only that NPC's last valid version, and valid edits to other files still apply. Checkpoints cover definitions only. A missing or invalid skin file is reported on its own and is not restored from a checkpoint.

Checkpoints are internal recovery data. Edit the source file, never the checkpoint.

## Behavior checkpoints

Accepted behaviors are checkpointed the same way, under `state/behavior-catalog/last-valid/` with copies under `state/objects/behavior-catalog/`. Behaviors in a [pack](/animus/07-behaviors) are kept under `state/behavior-catalog/last-valid/packs/<pack>/`. If the checkpoint cannot be written, the reload is refused with `catalog-checkpoint-failed` and the previous behaviors stay active. A checkpoint is removed when its source file is deleted, so a deleted behavior does not come back.

Rigs and animations keep their last valid copies under `state/rig-catalog/`.

## Behavior state

Stored [behavior variables](/animus/07-behaviors) live under `state/behavior-state/`, one JSON document per behavior and subject:

```none
state/behavior-state/npc/<npc-uuid>/<namespace>/<path>.json
state/behavior-state/player/<player-uuid>/<namespace>/<path>.json
state/behavior-state/relationship/<npc-uuid>/<player-uuid>/<namespace>/<path>.json
state/behavior-state/global/<namespace>/<path>.json
```

```json
{
  "schemaVersion": 1,
  "behavior": "example:quest",
  "scope": "relationship",
  "npc": "00000000-0000-0000-0000-00000000000a",
  "player": "00000000-0000-0000-0000-0000000000a1",
  "values": {
    "trust": {"type": "decimal", "value": 0.75},
    "visited": {"type": "list", "value": ["harbor", "mill"], "expires": 1730000000000}
  }
}
```

Each entry names the value's own type (`boolean`, `integer`, `decimal`, `string`, `list` or `map`) and holds its JSON; a decimal always keeps its point. `expires`, when present, is the epoch millisecond from which the entry reads as unset. Expired entries are removed from memory a bounded number at a time and leave the file at the next write.

These files are generated; do not edit them. Use `/animus behaviors state purge` to remove state.

Values are held in memory and written in batches. The first change after a quiet period starts a timer of `behaviors.state.flushMillis` (5 seconds by default), later changes join it, and one journaled write then saves every changed document. If a write fails, the values stay in memory, the failure shows in `/animus behaviors state status`, and the write is retried. A clean shutdown writes everything still waiting. A crash loses at most the changes since the last completed write.

State writes leave no rollback receipt, so `/animus rollback` does not apply to them. A stored file that fails validation is left as it is and reported with its reason; only runs that need that one document are refused, with `behavior-state-document-invalid`. A file whose path names no subject is reported and removed only by `/animus behaviors state purge all confirm`.

## Transactions and crash recovery

Each change is one transaction. Before any file changes, Animus writes the full plan to `state/pending.json` and saves the previous and next contents under `backups/`. Large transactions keep their contents as files under `state/objects/transaction-data/`. Files are then replaced atomically.

If the server stops in the middle of a transaction, startup finishes it before loading any definitions. If a file was changed by hand in the meantime, or a stored copy is missing, startup stops instead of guessing and keeps `state/pending.json`.

> Keep `state/pending.json`, `backups/` and `state/objects/` while you resolve a stopped recovery. Never delete the journal to get past it: the server would start with a half-applied change.
{.is-danger}

Only one server can open the data folder for writing at a time; a lock file enforces it. The data folder must be on a local filesystem that supports atomic renames.

Animus's journal does not cover outside editors. A text editor saving a file while Animus applies a change to the same file can still overwrite one of the two; revision and hash checks catch the conflict on the next change. Avoid hand edits while an import or editor apply is running.

## Rollback

Every transaction made by a command, an import or the web editor leaves a rollback receipt under `backups/`. Commands name the transaction in their reply:

```none
/animus delete guard
Deleted; rollback transaction <transaction-id>
/animus rollback <transaction-id>
```

Rollback restores the exact previous bytes of every file in the transaction, including a malformed file that the transaction replaced, and reloads the affected NPCs, shops, GUIs, holograms, rigs and behaviors. It refuses to overwrite a file that changed after the transaction. A rollback is itself a transaction with its own receipt, so it can be undone too.

### Backup rotation

Receipts rotate at startup. The newest `files.backupsKept` receipts (200 by default) and every receipt younger than `files.backupDays` days (14 by default) are kept; older receipts beyond those are removed, and with them the stored copies under `state/objects/transaction-data/` that no remaining receipt names. A Citizens import still waiting for review keeps its receipts until it is accepted or rolled back. The log names how many receipts and copies were removed. A removed transaction can no longer be rolled back, and the editor's **Undo last apply** says so.

Keep `backups/` together with `state/objects/`, since a receipt may refer to stored copies there. Settings archives such as `backups/config-<hash>.json` are not receipts and never rotate.

## Schema versions

Every versioned document carries a `schemaVersion`: NPC definitions, behaviors, pack manifests (`pack.json`), shops, routes, recordings, groups, chest GUIs, holograms, text animations, rigs, animations and `server-behaviors.json`. Each kind is at version 1, except holograms, which keep Gloss's version 3. At startup, before loading and before backups rotate, Animus upgrades any document whose version is older than the running build reads. The original bytes go into the journal before any file changes, so the upgrade is backed up first and a crash part way through finishes on the next start. All upgraded documents are written in one transaction with a rollback receipt, and the log names the transaction, so `/animus rollback <transaction-id>` restores the original files. A document at the current version is never rewritten. A document newer than the running build reads, or one that cannot be upgraded, is left unchanged and reported by the normal loader.

## Validating offline

The standalone converter checks a data folder without a running server:

```sh
converter/build/install/converter/bin/converter validate /path/to/Animus
```

It opens the folder read-only: it creates no lock, writes no checkpoints, activates no NPCs and does not finish a pending transaction. A pending transaction is reported as an error. It cannot open the data folder of a running server, which holds the lock; use `/animus validate` there.

## Limits

| Limit | Value |
|---|---|
| One document | 16 MiB |
| One journal | 16 MiB encoded |
| Entries in one transaction, including checkpoints and receipts | 10,000 |
| Previous and next contents in one transaction | 256 MiB |
| JSON nesting | 64 levels |
| Documents under `npcs/` | 100,000 |
| Files and folders under `npcs/` | 250,000 |
| Folder depth under `npcs/` | 8 |

Symbolic links and non-folder roots are refused. An import must fit the same limits together with the definitions already installed, and is validated completely before anything is written.
