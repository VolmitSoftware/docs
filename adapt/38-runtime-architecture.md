---
title: "Runtime Architecture"
description: "Adapt documentation: Runtime Architecture"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
This page covers what Adapt does to a server between boot and shutdown. It covers the start order, where player progression lives, what a reload really touches, and what a clean stop looks like. It is for operators who need to tell "the plugin is working" from "the plugin enabled without printing an error".

Adapt runs skills, adaptations, and per-player state on its own ticker. It does not scatter repeating tasks across the plugin scheduler. Anything that touches a player, an entity, or a world is handed to that thing's owning scheduler first. That is what lets the same jar behave on Paper and on Folia.

Optional plugin support is opportunistic. A missing plugin switches off only its own integration and nothing else. Configured external services are not opportunistic. SQL and Redis fail on their own terms. Adapt keeps running on the fallback path. A plugin that enabled cleanly is not proof that shared storage is live. Read the exception and the startup config summary before you believe storage works.

## Startup

`onLoad` does one thing. It registers Adapt's WorldGuard flags if the WorldGuard plugin is installed. Flags have to exist before WorldGuard finishes loading. This cannot wait for enable.

Enable then runs in this order:

1. Back up legacy JSON configs once, then delete retired adaptation config files.
2. Bring up platform bindings, the Adventure audience provider, and HUD support, then discover services by scanning the `art.arcane.adapt.service` package.
3. Load language, the Vault economy hook, custom models, and the PlaceholderAPI registration, then print server information.
4. Open SQL when `sql.enabled` is true. Create the Redis client only when `sql.enabled` and `redis.enabled` are both true, because Redis only caches what SQL owns. Start the persistence queue and glow support.
5. Start the simulation: ticker, FX director, `AdaptServer` and its `SkillRegistry`, and register every `adapt.use.*` and XP multiplier permission node.
6. Canonicalize skill and adaptation configs to TOML, then register the gameplay listeners: brewing, XP provenance, XP novelty, and the version bindings.
7. Start metrics, the splash, and the update check, then install the Ability API gateways.
8. Register a protector for each protection plugin that is actually enabled.
   Install the WorldGuard region policy and the HiddenOre bridge. Build the item
   and entity listings. Then enable and register every service.

## Players and their data

`AdaptServer` owns the skill registry, the server-scoped listeners, and the online `AdaptPlayer` objects. Skill and adaptation tick intervals run through `Ticked`, `TickedObject`, and `Ticker`.

When a player joins, Adapt resolves their progression through a precedence chain and takes the first hit:

1. A purge marker for that UUID, which resolves to default data.
2. A save still sitting unwritten in the persistence queue.
3. A `<uuid>.json.pending-sql` recovery file, which is also requeued as a normal save so it stops being a recovery file.
4. The Redis cache entry, if Redis is active.
5. The SQL row.
6. The local `<uuid>.json`, which is also uploaded to SQL when SQL is enabled but had no row for that player.
7. A fresh empty profile.

If a step fails to parse, Adapt logs it and marks the player as a failed load. Later saves for that player are skipped. A half-read file is never overwritten with worse data.

On quit, state is queued for persistence. Player-scoped tasks, HUD state, and temporary runtime objects are released. The in-memory object is kept for a minute in case the player reconnects at once. PlaceholderAPI keeps its own snapshot of recently offline players for the same minute. That snapshot is a display fallback, not a persistence authority. It is never written back.

## Reloading and restarting

A watcher polls Adapt's config paths twice a second and applies changes in place. While a legacy `.json` file still sits next to a canonical `.toml`, the watcher ignores the JSON.

A core config reload refreshes language, custom models, advancement synchronization, default-active protector membership, and online mutation qualification. It also throws away the material value cache. Ability API policy settings are read fresh on every call. They follow the core config without a restart. SQL and Redis clients, metrics, protector registration, plugin load order, and the Velocity companion are restart boundaries. [01 - Installation & Configuration](/adapt/01-installation-configuration) carries the full matrix.

`/adapt migrate-configs` needs `adapt.debug`. It rewrites every skill and adaptation config in canonical TOML. Then it walks everything below `adapt/` and deletes each legacy JSON file that already has a TOML twin. A JSON file with no TOML twin is left alone. Normal startup runs the same canonicalization pass.

## Shutdown

Disable unregisters the PlaceholderAPI expansion, disables services, and stops metrics. Then it tears the simulation down: ticker, minion runtime, `AdaptServer`, attribute service, advancement manager, and a final write of the material value cache. HUD work stops. Then the persistence queue gets up to 30 seconds to flush. Redis and SQL close after that. Glow state is cleared with a 2 second wait. The Ability API, region policy, and protector registrations are dropped.

Watch the console during a stop. A stop that hangs or errors can mean queued live player data never reached disk or SQL. Read the shutdown log rather than assuming the flush happened.

## Reference

### Persistence

| Mode | Authority | Behavior |
|---|---|---|
| Local JSON | `plugins/Adapt/data/players/<uuid>.json` | Default whenever `sql.enabled` is false. Writes go through the persistence queue |
| SQL | `ADAPT_DATA` table in the configured MySQL-compatible schema | Enabled by `sql.enabled`. Adapt creates the table but never the database |
| SQL recovery file | `plugins/Adapt/data/players/<uuid>.json.pending-sql` | Written when a shutdown save could not reach SQL. Replayed and deleted on that player's next load |
| Redis cache | `Adapt:data` pub/sub channel | Only active when SQL and Redis are both enabled. See [39 - Velocity & Cross-Server](/adapt/39-velocity-cross-server) |

### Runtime services

| Service | Responsibility |
|---|---|
| `CommandSVC` | The `/adapt` command tree and permission-aware help |
| `HotloadSVC` | The config and locale watcher and every in-place reload path |
| `MutationSVC` / `MutationRuntimeSVC` | Mutation persistence, discovery, equip state, combat locks, and runtime effects |
| `AdaptIntegrationService` | Optional plugin bridges |
| `ConfigInputSVC` | GUI-backed configuration input |

### Watched paths and timings

The watcher covers `adapt/adapt.toml` and `adapt/adapt.json`, `adapt/models.toml` and `adapt/models.json`, `adapt/mutations.toml`, every file directly inside `adapt/skills/` and `adapt/adaptations/`, and the `languages/overrides/` folder. Mutation config changes also reconcile online players.

| Item | Value |
|---|---|
| Config watcher poll | 500 ms |
| In-memory player retention after quit | 60 s |
| PlaceholderAPI offline snapshot grace | 60 s |
| Prefetched login data cache | 2 minutes, 2048 entries |
| Persistence write retry backoff | 50 ms, 250 ms, 1000 ms |
| Shutdown flush allowance | 30 s |
| Glow cleanup wait on shutdown | 2 s |

XP provenance, spatial novelty, entropy, stillness, field-cycle, and pooled-payout listeners are all governed by the `xpIntegrity` block. The version bindings supply attribute access, custom model application, potion construction, and the invalid-damageable-entity list. They also detect whether `InventoryView.setTitle` exists on the running server.

## See also

- [01 - Installation & Configuration](/adapt/01-installation-configuration)
- [08 - Protection & Region Policy](/adapt/08-protection-region-policy)
- [09 - Integrations](/adapt/09-integrations)
- [39 - Velocity & Cross-Server](/adapt/39-velocity-cross-server)
- [40 - Operator Runbooks](/adapt/40-operator-runbooks)
