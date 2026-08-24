---
title: "Runtime Architecture"
description: "Adapt documentation: Runtime Architecture"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
This page covers what Adapt does to a server between boot and shutdown. It covers the start order, where player progression lives, what a reload really touches, and what a clean stop looks like. It is for operators who need to tell "the plugin is working" from "the plugin enabled without printing an error".

Adapt runs skills, adaptations, and per-player state through a deadline-indexed ticker. Idle entries are not scanned on every scheduler pulse. Recurring player maintenance shares a bounded owner pulse instead of dispatching one scheduler task per ability and player. Anything that touches a player, an entity, or a world is handed to that thing's owning scheduler first. That is what lets the same jar behave on Paper and on Folia.

Optional plugin support is opportunistic. A missing plugin switches off only its own integration and nothing else. Configured persistence is not opportunistic: SQL mode has no local fallback for Adapt profile ownership, and a failed SQL connection, schema check, or non-InnoDB table stops enablement. A configured Redis startup failure is also visible during enable. Once the server is running, a player-profile failure disables Adapt for that player without rejecting or kicking their Minecraft session. Read the full startup log before trusting shared storage.

## Startup

`onLoad` does one thing. It registers Adapt's WorldGuard flags if the WorldGuard plugin is installed. Flags have to exist before WorldGuard finishes loading. This cannot wait for enable.

Enable then runs in this order:

1. Load the plugin-root TOML configuration layout.
2. Bring up platform bindings, the Adventure audience provider, and HUD support, then discover services by scanning the `art.arcane.adapt.service` package.
3. Load language, the Vault economy hook, custom models, and the PlaceholderAPI registration, then print server information.
4. Open SQL when `sql.enabled` is true, create `ADAPT_DATA` and `ADAPT_DATA_FENCE`, and require both tables to use InnoDB. Create the backend Redis client only when SQL and Redis are both enabled, then start the persistence queue and glow support.
5. Start the simulation: ticker, FX director, `AdaptServer` and its `SkillRegistry`, and register every `adapt.use.*` and XP multiplier permission node.
6. Register the gameplay listeners: brewing, XP provenance, XP novelty, and the version bindings.
7. Start metrics and the splash, queue the timeout-bounded update check on the async workgroup, then install the Ability API gateways without waiting for the network.
8. Register a protector for each protection plugin that is actually enabled.
   Install the WorldGuard region policy and the HiddenOre bridge. Build the item
   and entity listings. Then enable and register every service.

## Players and their data

`AdaptServer` owns the skill registry, the server-scoped listeners, and the online `AdaptPlayer` objects. Skill and adaptation tick intervals run through `Ticked`, `TickedObject`, and `Ticker`.

Local JSON mode resolves a durable `.pending-delete` delete or delete-then-save journal first, then an in-process queued save, the local player JSON, or a new profile. A successful local claim is deliberately unfenced; SQL ownership checks never apply to it. The journal is local-mode only. Invalid journals and corrupt player JSON are preserved and fail closed instead of becoming deletion instructions or empty profiles.

SQL mode starts the ownership claim during async pre-login, then returns from that event immediately. Claim completion may arrive after the Minecraft join, but Adapt constructs an `AdaptPlayer` only after a claim completes successfully. Claims for a burst gather for 25 milliseconds, sort by UUID, deduplicate concurrent requests for the same player, and transact in groups of at most 128. A claim rotates the owner token and epoch while retaining the effective predecessor when an earlier claim was abandoned. Adapt then compares only snapshots carrying that exact predecessor fence: the committed SQL row and sequence, a queued fenced save, a valid `ADAPT_SQL_RECOVERY_V1` `.pending-sql` envelope, and a request-correlated Redis handoff. The Redis source freezes its entity-owned runtime and stages the snapshot for 60 seconds before replying; the destination retries for 250 milliseconds and checks that exact stage if all replies are lost. The highest non-conflicting sequence wins and is transactionally adopted as sequence 1 under the new owner. Local JSON can seed only a player's first SQL fence.

An unsafe, corrupt, timed-out, conflicting, or failed local or SQL claim never rejects Minecraft admission. The player remains connected without an `AdaptPlayer`: XP, knowledge, commands, skills, adaptations, mutations, custom brewing, custom orbs, persistence, menus, effects, and per-player PlaceholderAPI publication remain inactive. Adapt never constructs an empty or unfenced fallback, never uploads local data over an uncertain SQL row, and immediately cleans any stale Adapt-owned runtime state. Successful profile activation is silent at normal logging levels. With `verbose` enabled, the branded Adapt logger reports the player, UUID, and active `local JSON` or `SQL` storage mode.

The initial claim is followed by at most three online retries after 2, 4, and 8 seconds, each with deterministic UUID-based jitter from 0 through 19 ticks, for four total claim cycles. Reconnecting starts a new bounded cycle. Old raw-JSON `.pending-sql` files and pre-fence `.pending-delete` files in SQL mode are preserved with an operator recovery error. A stale writer cannot overwrite a newer owner; SQL rejects its token and the backend retires that Adapt runtime while leaving the Minecraft player connected. Ownership transfer or a reset/purge notice from another backend requires that retired player to reconnect. A reset initiated on the backend currently hosting the player instead adopts the newly rotated SQL fence and replaces their Adapt profile live.

On quit, state is queued for persistence. Repeated writes for one UUID coalesce to the newest fence sequence. SQL saves gather for 25 ms and commit in batches of at most 128 profiles, then retry with bounded backoff. A failed terminal SQL write keeps its fenced recovery envelope. Player-scoped tasks, HUD state, and temporary runtime objects are released. The in-memory object is kept for a minute for late listeners and cleanup; it is not treated as an online member. PlaceholderAPI keeps its own display-only snapshot for the same minute after a normal quit and never writes it back. A newly unavailable online session evicts any stale snapshot immediately instead.

## Reloading and restarting

A watcher drains native file events every 500 ms and runs bounded exact-content fallback reconciliation about every 2.5 seconds. Stable TOML saves are queued into a latest-state batch and applied no more than once every 3 seconds; a save that lands while a batch is waiting or running becomes one trailing batch. Atomic moves, brief FTP replacement gaps, and same-metadata edits are covered. Automatic loads are passive and do not rewrite, delete, or recreate watched files.

A core config reload refreshes language, custom models, advancement synchronization, default-active protector membership, and online mutation qualification. It also throws away the material value cache. Ability API policy settings are read fresh on every call. They follow the core config without a restart. SQL, Redis, and metrics settings and their live services are restart boundaries; hotload preserves the values selected at startup instead of crossing storage modes or reconnecting a service. Protector registration and plugin load order are also restart boundaries. [01 - Installation & Configuration](/adapt/01-installation-configuration) carries the full matrix.

## Shutdown

Disable unregisters the PlaceholderAPI expansion and Ability API first, then disables services and metrics. It stops world scans and the ticker before unregistering `AdaptServer`, then awaits owner-thread cleanup of private displays, minion modifiers, and Adapt-owned attributes for up to 5 seconds per subsystem. Advancements, world data, custom models, material values, and HUD work follow. The persistence queue then gets up to 30 seconds to flush before Redis and SQL close. Private glow state gets a 2 second cleanup wait, followed by region policy, protector registrations, the async workgroup, scheduler tasks, and listeners. Each phase is best-effort: one failure prints its full stack trace but does not prevent later cleanup phases from running.

Watch the console during a stop. A stop that hangs or errors can mean queued live player data never reached disk or SQL. Read the shutdown log rather than assuming the flush happened.

## Reference

### Persistence

| Mode | Authority | Behavior |
|---|---|---|
| Local JSON | `plugins/Adapt/data/players/<uuid>.json` | Default whenever `sql.enabled` is false. Writes go through the persistence queue |
| SQL | InnoDB `ADAPT_DATA` plus `ADAPT_DATA_FENCE` in the configured MySQL-compatible schema | JSON and transactional owner token, epoch, adoption state, and committed sequence. Enabled by `sql.enabled`; Adapt creates the tables but never the database |
| SQL recovery file | `plugins/Adapt/data/players/<uuid>.json.pending-sql` | `ADAPT_SQL_RECOVERY_V1` envelope atomically retaining UUID, owner, epoch, sequence, and JSON after bounded SQL retries or shutdown fallback. Only an exact predecessor fence can enter adoption |
| Delete recovery journal | `plugins/Adapt/data/players/<uuid>.json.pending-delete` | Local-JSON-mode delete or delete-then-save journal. SQL reset and purge rotate the SQL fence transactionally and do not use this file |
| Redis handoff | `Adapt:data:v2` channel family and `Adapt:data:v2:stage:*` keys | Correlated request, 60-second exact-fence staging, request-scoped replies, and epoch-only reset/purge notices. Only active when SQL and Redis are both enabled. See [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server) |

### Runtime services

| Service | Responsibility |
|---|---|
| `CommandSVC` | The `/adapt` command tree and permission-aware help |
| `HotloadSVC` | The config and locale watcher and every in-place reload path |
| `MutationSVC` / `MutationRuntimeSVC` | Mutation persistence, discovery, equip state, combat locks, and runtime effects |
| `AdaptIntegrationService` | Optional plugin bridges |
| `ConfigInputSVC` | GUI-backed configuration input |

### Watched paths and timings

The watcher covers `adapt.toml`, `models.toml`, `mutations.toml`, every TOML directly inside `skills/` and `adaptations/`, and the `languages/overrides/` folder. Mutation config changes also reconcile online players.

| Item | Value |
|---|---|
| Config watcher poll | 500 ms |
| Automatic hotload cooldown | At least 3 s between batch starts |
| In-memory player retention after quit | 60 s |
| PlaceholderAPI offline snapshot grace | 60 s |
| Prefetched login data cache | 30 seconds, 2048 entries, consumed by join |
| Persistence write retry backoff | 50 ms, 250 ms, 1000 ms |
| SQL save gather window / batch cap | 25 ms / 128 profiles |
| SQL claim gather window / batch cap | 25 ms / 128 profiles |
| SQL backend claim attempts / per-attempt wait / claim-future wait | 4 / 8 s / 40 s; async pre-login itself returns immediately |
| Online profile recovery | Three retries after 2 s, 4 s, and 8 s, each plus deterministic 0-19 tick jitter; four total claim cycles |
| Redis predecessor response wait | 250 ms |
| Skill owner dispatch | Up to 64 players per server tick |
| Adaptation owner dispatch | Up to 200 players examined and 64 owner tasks per server tick |
| Private display admission | 4,096 global and 128 per viewer, including reservations |
| JDBC connect, socket, and validation timeout cap | 5 s each |
| Shutdown flush allowance | 30 s |
| Display, minion, and attribute shutdown cleanup | Up to 5 s per subsystem |
| Glow cleanup wait on shutdown | 2 s |

XP provenance, spatial novelty, entropy, stillness, field-cycle, and pooled-payout listeners are all governed by the `xpIntegrity` block. The version bindings supply attribute access, custom model application, potion construction, and the invalid-damageable-entity list. They also detect whether `InventoryView.setTitle` exists on the running server.

## See also

- [01 - Installation & Configuration](/adapt/01-installation-configuration)
- [08 - Protection & Region Policy](/adapt/08-protection-region-policy)
- [09 - Integrations](/adapt/09-integrations)
- [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server)
- [40 - Operator Runbooks](/adapt/40-operator-runbooks)
