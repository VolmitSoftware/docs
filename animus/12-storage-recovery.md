---
title: "Animus: Storage and Recovery"
description: "How Animus stores documents, recovers from bad edits and crashes, and rolls changes back"
published: true
date: 2026-11-12T00:00:00.000Z
tags: "animus, storage, recovery, rollback, backups"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus keeps every document as a plain file in its data folder, `plugins/Animus/` (`config/animus/` on mod servers). Plugin settings are TOML; definitions, behaviors, packs, routes, skins, shops, GUIs, rigs and all generated state are JSON. Original import sources are archived in their own format.

Every write made by Animus goes through a journal, so a crash never leaves a file half-written, and every change made by a command, an import or the [web editor](/animus/14-web-editor) can be rolled back.

## Definitions

Each NPC is a file at `npcs/<folders>/<id>.json` (directly in `npcs/` or up to 8 folders deep; the folder is stored in its `group` field) with a stable `uuid`, a readable `id` that is unique across all folders, a `schemaVersion` and an increasing `revision`. Commands, the editor and reloads use the same validation. An edit made from a definition that has changed in the meantime is refused as a conflict instead of overwriting the newer version.

Health, cooldowns and running behaviors are never written into definitions. A restart restores whether an NPC is spawned, not what it was doing.

## Last-valid recovery

When a definition is accepted, Animus also records a checkpoint of it under `state/npc-definitions/last-valid/`, pointing to a copy under `state/objects/npc-definitions/`. A command edit or deletion updates the source file and its checkpoint in one transaction.

| Situation at startup or reload | Result |
|---|---|
| A previously accepted file has a malformed or stale edit | Animus keeps the last valid definition, including whether it is spawned, and reports the exact field error. The broken file is left as it is |
| A new file is malformed | That NPC is skipped and the log names the file and the error. The file is left as it is and every other NPC loads |
| Two files share a UUID or id | One is kept and the other is skipped with `$.id: duplicate` or `$.uuid: duplicate`. At startup the file with a checkpoint wins, then the first by path. On reload the running NPC keeps its file |
| A checkpoint is corrupt | That NPC is skipped and the log names the checkpoint. The broken copy is never loaded |
| A source file was deleted | The NPC is removed. Recovery never brings back a missing source |

A definition kept from its checkpoint stays active. A skipped file logs `Skipped NPC file <file>: <error>` at startup. Fix it, then run `/animus reload` to load it. `/animus validate` lists every file with its field errors, and `/animus status` counts the files needing repair.

Folders under a document folder such as `npcs/` may be at most 8 deep, and symbolic links are not allowed; a deeper folder or a link is skipped with a warning that names the path. Invalid TOML in `config.toml` stops Animus from starting.

### Refused hand edits

When a reload, [live apply](/animus/03-configuration#live-apply) or startup recovery refuses a hand edit, the NPC keeps its last valid version and the broken file stays on disk. You can then:

- Fix the file. Live apply picks it up, or run `/animus reload`.
- Run `/animus edit <npc>` or `/animus delete <npc>`. The command starts from the last valid version and replaces or removes the refused file; its reply ends with `replaced the refused hand edits in <file>` or `removed the refused hand edits in <file>`. `/animus rollback <transaction>` brings the refused file back.

A trait group assignment that includes such an NPC skips it and names it, for example `skipped guard: npcs/town/guard.json has refused hand edits; fix the file or /animus reload`. Every other member is still assigned.

### Conflicts

`Conflict: <file> changed since Animus read it; fix the file or /animus reload` means the file changed on disk after Animus last read it and that change has not been checked yet. Animus never overwrites it. Wait for the live apply line in chat, or run `/animus reload`, then repeat the command.

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

These files are generated; do not edit them. Use `/animus behaviors state delete` to remove state.

Values are held in memory and written in batches. The first change after a quiet period starts a timer of `behaviors.state.flushMillis` (5 seconds by default), later changes join it, and one journaled write then saves every changed document. If a write fails, the values stay in memory, the failure shows in `/animus behaviors state status`, and the write is retried. A clean shutdown writes everything still waiting. A crash loses at most the changes since the last completed write.

State writes leave no rollback receipt, so `/animus rollback` does not apply to them. A stored file that fails validation is left as it is and reported with its reason; only runs that need that one document are refused, with `behavior-state-document-invalid`. A file whose path names no subject is reported and removed only by `/animus behaviors state delete all confirm`.

## Transactions and crash recovery

Each change is one transaction:

1. Before any file changes, Animus writes the full plan, with the previous and next contents of every file, to `state/pending.json`. Large transactions keep their contents as files under `state/objects/transaction-data/`.
2. The files are replaced atomically.
3. The rollback receipt `backups/<transaction>.json` is written, and `state/pending.json` is removed.

If the server stops in the middle of a transaction, startup finishes it before loading any definitions. If a file was changed by hand in the meantime, or a stored copy is missing, startup stops instead of guessing and keeps `state/pending.json`.

> Keep `state/pending.json`, `backups/` and `state/objects/` while you resolve a stopped recovery. Never delete the journal to get past it: the server would start with a half-applied change.
{.is-danger}

Only one server can open the data folder for writing at a time; the lock file `state/store.lock` enforces it. The data folder must be on a local filesystem that supports atomic renames. On Windows, and on filesystems that cannot sync a folder, Animus syncs each file but skips the folder sync after the rename.

When the server stops or Animus is disabled, writes already queued still run, for up to 10 seconds. Examples are an edit sent just before the stop and a permadeath recorded as the server stops. Anything still waiting after that is cancelled, and the log says how many writes were not saved. The stop then waits up to 30 seconds for the last write, the final behavior state save and the data folder lock to be released, so a plugin reload can open the folder again at once. If writes are still running after 30 seconds, the log says so.

Animus's journal does not cover outside editors. A text editor saving a file while Animus applies a change to the same file can still overwrite one of the two; revision and hash checks catch the conflict on the next change. Avoid hand edits while an import or editor apply is running.

## Rollback

Every transaction made by a command, the Animus menu, an import or the web editor leaves a rollback receipt under `backups/`. Commands name the transaction in their reply; in Simple mode the reply shows only **[Undo]**. In game, click the short id to copy the full one, or **[Undo]** to revert the change at once, as `/animus undo` does; the console prints the full id. Rollback takes the full id or its first characters, at least four, when no other receipt starts with them:

```none
/animus delete guard
Deleted guard; tx <transaction-id>
/animus rollback <transaction-id>
```

Rollback restores the exact previous bytes of every file in the transaction, including a malformed file that the transaction replaced, and reloads the affected NPCs, shops, GUIs, holograms, rigs and behaviors. It refuses to overwrite a file that changed after the transaction. A rollback is itself a transaction with its own receipt, so it can be undone too.

### Backup rotation

Receipts rotate right after startup, in the background so a server with years of history starts at normal speed, and every 6 hours while the server runs. The newest `files.backupsKept` receipts (200 by default) and every receipt younger than `files.backupDays` days (14 by default) are kept; older receipts beyond those are removed, and with them the stored copies under `state/objects/transaction-data/` that no remaining receipt names. A Citizens import still waiting for review keeps its receipts until it is accepted or rolled back. The log names how many receipts and copies were removed. A removed transaction can no longer be rolled back, and the editor's **Undo** for that apply says so.

Keep `backups/` together with `state/objects/`, since a receipt may refer to stored copies there. Settings archives such as `backups/config-<hash>.json` are not receipts and never rotate.

At the same times, Animus removes checkpoint and import copies under `state/objects/` (`npc-definitions`, `behavior-catalog`, `rig-catalog` and `import-applications`) that are more than a day old when no checkpoint, receipt or import plan names them any more. If any of those files cannot be read, nothing is removed. At startup Animus also deletes `imports/.preview-*` folders left by an import preview that was still being built when the server stopped.

## Schema versions

Every versioned document carries a `schemaVersion`: NPC definitions, behaviors, pack manifests (`pack.json`), shops, routes, recordings, trait groups, chest GUIs, holograms, text animations, rigs, animations and `server-behaviors.json`. NPC definitions and trait groups are at version 2, holograms keep Gloss's version 3, and every other kind is at version 1.

At startup, before loading and before backups rotate, Animus upgrades any document whose version is older than the running build reads:

- The original bytes go into the journal before any file changes, so a crash part way through finishes on the next start.
- Upgraded documents are written in transactions of up to 2,000 documents, each with a rollback receipt. The log names every transaction, and `/animus rollback <transaction-id>` on each one restores the original files.
- A document at the current version is never rewritten.
- A document newer than the running build reads, or one that cannot be upgraded, is left unchanged and reported by the normal loader.

NPC definitions and trait groups copied into the data folder while the server runs are upgraded the same way before they load, in one transaction with a rollback receipt. [Live apply](/animus/03-configuration#live-apply) names the transaction in its chat line and the log, and `/animus reload` starts its reply with `Upgraded <n> files to schemaVersion 2; rollback <transaction-id>`. The [web editor](/animus/14-web-editor) upgrades them in the browser as a folder, zip or workspace opens.

NPC files and trait groups from an import made with an older Animus are upgraded automatically, and every converted module in them runs as converted.

## Validating offline

The standalone converter checks a data folder without a running server:

```sh
converter/build/install/converter/bin/converter validate /path/to/Animus
```

It opens the folder read-only: it creates no lock, writes no checkpoints, makes no NPC active and does not finish a pending transaction. A pending transaction is reported as an error. It cannot open the data folder of a running server, which holds the lock; use `/animus validate` there.

## Damaged files

A damaged file never stops Animus as a whole:

- An NPC definition that cannot be read is skipped with one warning and keeps its last valid version, as described above.
- A damaged `state/shops/ledger.json` is moved to `ledger.json.bad-<time>`, and shop limits and stock counts start empty; readable lines of `ledger.journal` still apply. A damaged journal line is skipped and the journal copied to `ledger.journal.bad-<time>`. The log warns and the banner says `DEGRADED (shops)`.
- A damaged `state/editor/identity.json` turns the editor off with one warning. Delete the file and restart to create a new identity, then pair the editor again.
- A refused `config.toml` stops the start with one line that names the line and key; see [configuration](/animus/03-configuration).

The startup banner says `Startup: READY`, `DEGRADED (...)` naming each part that did not come up, or `FAILED`. Behaviors load just after the banner; if their catalog cannot load, the log has a `Behaviors reload: FAILED` warning with the reason, and `/animus behaviors status` repeats it.

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

A symbolic link inside `npcs/` (or any other document folder), or anything nested deeper than the limit, is skipped with a warning that names its path, and everything else loads; move the file into a real folder to use it. A data folder that is itself a symbolic link, such as `plugins/Animus` mounted from another volume, is resolved once at startup and works normally. Imports refuse a skipped path instead, since they must see every installed definition. An import must fit the same limits together with the definitions already installed, and is validated completely before anything is written.
