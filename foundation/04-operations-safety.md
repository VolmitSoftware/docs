---
title: "Operations, Storage, and Recovery"
description: "Foundation's files, how damaged data is recovered, and the diagnostic commands"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "foundation, operations, storage, recovery"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

## Files

| Path under `plugins/Foundation/` | Contents |
|---|---|
| `config.toml` | Canonical typed configuration |
| `config.toml.last-good` | Previous valid configuration bytes |
| `worth.toml` | Complete categorized item price catalog |
| `worth.toml.last-good` | Previous worth catalog bytes |
| `languages/<locale>.toml` | Editable locale catalog; English and custom files are generated when absent, listed translations install on demand |
| `languages/language-preferences.json` | UUID-to-locale personal preference map |
| `languages/language-preferences.json.last-good` | Previous valid personal preference map |
| `debug/foundation-v<version>-debugdump-YYYY-MM-DD-HH-mm-ss.txt` | Sanitized support report, UTC timestamp |
| `storage/locations.json` | Spawn, shared warps, and named jails |
| `storage/locations.json.last-good` | Previous location store |
| `storage/players/<uuid>.json` | Per-player profile |
| `storage/players/<uuid>.json.last-good` | Previous per-player profile |
| `storage/kits.yml` | Bukkit item snapshots and kit cooldown definitions |
| `storage/kits.yml.last-good` | Previous kit store |
| `.libs/` | Downloaded runtime dependency cache |
| `recovery/<checkpoint-uuid>.json` | Inventory-clear checkpoint and one-use claim state |

Every write goes to a temporary file in the same directory and then replaces the target atomically. Symbolic links and non-regular files are rejected. A primary file is validated before it rotates into `.last-good`, so recovering from a backup cannot destroy the remaining valid copy.

Spawn, warp, and jail records with non-finite, out-of-range, or unknown-world coordinates are discarded at load rather than becoming active.

Installed non-English locale files are never rewritten or merged automatically. Limits: profiles 1 MiB, kit files 4 MiB, and the preference store 25,000 UUIDs or 2 MiB.

## Recovery

If a file's primary copy is invalid, Foundation loads `.last-good`, republishes a canonical primary, and keeps going.

> If both copies of a player profile are invalid, that UUID enters read-only mode. Commands can read the empty in-memory state, but nothing writes, so the damaged file is preserved as evidence instead of being overwritten. The same rule applies to the language-preference store: preference writes stay disabled until you supply a valid file and reload.
{.is-warning}

Kit files are re-bounded at load. Entries beyond the configured kit count, cooldown, or per-kit stack limits are discarded or capped in file order, and the bounded result is written back.

Profiles are flushed every 600 ticks and again at shutdown. A failed save stays dirty and is retried.

Economy writes coalesce per UUID and retry four times. After that the account is blocked from further changes until shutdown makes a final persistence pass, rather than silently diverging from disk.

## Inventory-clear recovery

With `recovery.enabled=true`, a confirmed inventory clear saves a checkpoint before removing items. Defaults retain up to 10 records per player and 1,000 overall, with a 1 MiB record limit and 168-hour retention. A full checkpoint store refuses new checkpointed clears.

Use `/foundation recovery list <online-player|uuid>` to find a checkpoint, then `/foundation recovery restore <online-player> <checkpoint-uuid>` and the matching `confirm` action. Restoration requires the original player online with an empty inventory and cursor, and rechecks item-grant policies. A claimed record cannot be claimed again. If delivery fails after the durable claim, Foundation logs the failure and leaves the record claimed for manual review rather than risking duplicate items.

This restores Foundation inventory clears only. It does not record every inventory mutation or death.

## Name indexes

Two background scans read the profile directory. Neither ever blocks a command.

`playerData.maximumNameIndexProfiles` (100 to 1,000,000, default 100,000) bounds the offline-name index. Its state is one of `NOT_STARTED`, `BUILDING`, `READY`, `INCOMPLETE`, `FAILED`, or `CLOSED`, and only `READY` means an absent name is conclusively unknown. Before that, an unmatched name gets a distinct "not available yet" message rather than a false "unknown player".

`economy.maximumIndexedAccounts` (100 to 1,000,000) bounds the balance index. If the cap is exceeded or a profile is unreadable, the economy does not become Vault-visible at all rather than publishing a partial ledger. `/balancetop` reads a snapshot bounded by `economy.maximumLeaderboardProfiles`.

In both indexes, a name claimed by more than one UUID is marked ambiguous and every name-based operation refuses to pick one. Direct UUID access still works.

## Diagnostics

| Command | Shows |
|---|---|
| `/foundation status` | Plugin version, Java version, active module count |
| `/foundation modules` | Every module state and its failure reason |
| `/foundation doctor` | Blocked and failed modules, name-index progress and ambiguity, and the live owner of every command label and alias |
| `/foundation doctor command <command-or-alias>` | The sender's command permission, module state, and dispatch decision; target and gameplay checks are outside this inspection |
| `/foundations debug` | The Director debug submenu |
| `/foundation debug version` | Installed plugin version; `/foundation version` is its hidden alias |
| `/foundations debug dump [upload=true]` | Writes a report under `debug/`; `upload=false` keeps it local |

A debug dump records Foundation state, platform and scheduler details, loaded plugins and worlds, TPS and MSPT, JVM and memory detail, module and route state, profile and worth health, name-index state, language state, and command ownership.

It records file sizes, timestamps, and hashes, not file contents. It omits player names, UUIDs, network addresses, environment variables, JVM arguments, raw configuration, credentials, and the mclo.gs deletion token.

`debug.uploadToMclogs` is enabled by default and returns an `https://mclo.gs/<id>` link. Creating the local report never depends on the upload succeeding. See [Shared diagnostic reports](/volmlib/api/diagnostics).

`runtime.verboseDiagnostics` adds lifecycle detail to the console.

## Update notices and metrics

`runtime.updateNotifications` enables the shared GitHub notifier for `VolmitSoftware/Foundation`. It defaults to `true` and reloads with configuration. Console receives the check result; players with `foundation.update` receive applicable update notices. The shared `/volmit plugins updates` view includes Foundation. The notifier reports available releases; it does not install plugin updates.

Foundation uses bStats ID `34483` with the official collector unchanged except for its package. To opt out, set `enabled: false` in `plugins/bStats/config.yml` and restart. This shared bStats configuration is outside Foundation's data folder. Collection starts after Foundation becomes ready and stops during unload. No custom charts are registered.

## Shutdown and code reload

Foundation participates in BileTools hot-reload through VolmLib's asynchronous `ReloadAware` contract. Preparation accepts only a ready runtime and does not change gameplay state; cancelling preparation therefore has nothing to undo.

Commit marks Foundation as draining, closes its menus and managed inventories on their owning player schedulers, restores Foundation-owned flight, and closes language editors. Once that work completes, the global drain stops services and watchers, flushes pending balances and stores, and cancels remaining tasks. Repeated commits share the same completion result.

A failed commit logs the full cause and prevents BileTools from confirming a successful unload. Foundation remains draining because partially closed services cannot safely resume; restart the server after investigating the failure. During ordinary disable, Foundation cleans up only state owned by the current thread and reports foreign-owner cleanup that cannot run safely. Cooperative reload performs and awaits that player-owned cleanup before unload.

Utilities cannot reactivate while cleanup from their previous activation is unfinished or failed. Retry the configuration or module change after successful cleanup.

Continue with [Integrations and service APIs](/foundation/05-integrations-api).
