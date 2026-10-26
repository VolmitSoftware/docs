---
title: "ByteCompanions: Configuration"
description: "Every config.toml setting with its default, the in-game editor controls, and hot reload"
published: true
date: 2026-10-25T00:00:00.000Z
tags: "bytecompanions, configuration"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

`plugins/ByteCompanions/config.toml` holds the root settings. Companion definitions, feature packs, and languages keep their own files beside it. Edit the file and save it, or open `/bytecompanions config` in game; both go through the same validation.

Keys are written as `section.key`. A TOML table `[general]` with `enabled = true` is `general.enabled`. A value outside its range rejects the whole file and keeps the previous settings.

## general

| Setting | Default | What it changes |
|---|---|---|
| `general.enabled` | `true` | Master switch for companion visuals and gameplay bonuses. When false every world behaves like a hidden and bonus-disabled world; saved selections, progression, and particles return when it is turned back on. |
| `general.language` | `"en_US"` | Server default locale stored as the directly editable `languages/<locale>.toml` file. See [Languages](/bytecompanions/04-languages). |
| `general.updateNotifications` | `true` | Notify operators and players with `bytecompanions.update` about newer GitHub releases on join. Checks run once at startup; nothing is downloaded. |
| `general.autoLoadCompanions` | `true` | Load the companion definitions from the `companions` folder when the runtime starts. When false nobody can equip a companion. |
| `general.companionLimits.maxTotalPerPlayer` | `2` | Maximum companions one player may equip at once; `-1` removes the limit. Lowering it keeps companions already equipped. |
| `general.companionLimits.perModel.fullBody` | `1` | Maximum full-body companions one player may equip at once; `-1` removes the limit. |
| `general.companionLimits.perModel.headOnly` | `1` | Maximum head-only companions one player may equip at once; `-1` removes the limit. |

## metrics

| Setting | Default | What it changes |
|---|---|---|
| `metrics.enabled` | `true` | Submit anonymous usage statistics to bStats. The global `plugins/bStats/config.yml` opt-out still wins. |

## presentation

| Setting | Default | What it changes |
|---|---|---|
| `presentation.splashScreen` | `true` | Print the startup splash after services are ready. Read once at enable. |
| `presentation.alternateSplashes` | `true` | Replace the splash art with one of the alternate pieces on one start in ten. |
| `presentation.commandSounds` | `true` | Play a short success or failure sound when a command reports its result to a player. Menus never play sounds. |
| `presentation.serializer` | `"MINI_MESSAGE"` | Text format for companion names, lore, and item blueprints: `MINI_MESSAGE`, `LEGACY_AMPERSAND`, or `PLAIN`. |

## hotReload

| Setting | Default | What it changes |
|---|---|---|
| `hotReload.enabled` | `true` | Apply stable file changes under the data folder automatically. Edits made while this is off are not replayed when it is turned back on. |
| `hotReload.pollIntervalMillis` | `1000` | Milliseconds between file scans, from 250 to 60000. |
| `hotReload.cooldownMillis` | `1500` | Milliseconds a changed file must stay unchanged before it is applied, from 250 to 60000. |
| `hotReload.notifyOperators` | `true` | Send one action bar line to online players with `bytecompanions.config` when an automatic reload succeeds or fails. |

## debug

| Setting | Default | What it changes |
|---|---|---|
| `debug.uploadEnabled` | `true` | Allow `/bytecompanions debug dump upload=true` to publish reports to mclo.gs after saving them locally. |

## storage

| Setting | Default | What it changes |
|---|---|---|
| `storage.backend` | `"json"` | Storage backend for player companions, collections, progression, and particle choices: `json`, `sqlite`, `h2`, or `mysql`. Data is not moved between backends; switching changes where new writes go and the old data stays in place. |
| `storage.pool.connectionTimeoutMillis` | `5000` | SQL backends only.  Milliseconds to wait for a pooled connection; `0` uses the driver default, otherwise at least 250. |
| `storage.pool.maxLifetimeMillis` | `1800000` | Maximum lifetime of a pooled connection; `0` disables retirement, otherwise at least 30000. |
| `storage.pool.maxPoolSize` | `10` | Maximum simultaneous database connections, at least 1. |
| `storage.pool.minIdle` | `1` | Idle connections kept open, from 0 to `maxPoolSize`. |
| `storage.h2.directory` | `"storage"` | Directory under `plugins/ByteCompanions` that holds the embedded database files. Changing it starts an empty database. |
| `storage.mysql.host` | `"127.0.0.1"` | Database host name or address. Must not be blank when the backend is `mysql`. |
| `storage.mysql.port` | `3306` | Database port, from 1 to 65535. |
| `storage.mysql.database` | `"bytecompanions"` | Database name. Must not be blank when the backend is `mysql`. |
| `storage.mysql.username` | `""` | Database user. Must not be blank when the backend is `mysql`. |
| `storage.mysql.password` | `""` | Database password. Never written to diagnostic reports. |
| `storage.mysql.useSsl` | `false` | Require TLS for the database connection. With `false`, the driver may fetch the server's RSA key so MySQL 8 accounts using `caching_sha2_password` can log in; use `true` when the database is reached over an untrusted network. |

Where each backend keeps its data:

| Backend | Location | Driver |
|---|---|---|
| `json` | `storage/companions/<uuid>.json`, `storage/collections/<uuid>.json`, `storage/particles/<uuid>.json`, `storage/progression/<server>/`; every write is atomic and keeps a `.last-good` copy of the previous readable document, which is read when a document cannot be parsed or decoded. A progression change is recorded in `commit.pending` first and finishes before the next progression operation if the server stops part-way | none |
| `sqlite` | `storage/bytecompanions.db`, one connection, WAL journal with full synchronous commits | `sqlite-jdbc`, downloaded on first start |
| `h2` | `<storage.h2.directory>/storage.mv.db` | `h2`, downloaded on first start |
| `mysql` | the configured database; MariaDB works through the same driver | `mysql-connector-j`, downloaded on first start |

All four backends hold the same five collections: companion selections, collections, particle choices, and the progression player, global, and purchase records. Particle choices use the root backend; the particles feature has no storage settings of its own.

## performance

| Setting | Default | What it changes |
|---|---|---|
| `performance.maximumParticleIntensity` | `"FULL"` | Maximum particle intensity players may receive: `FULL`, `REDUCED`, or `OFF`. The more restrictive of the server and the player's choice applies. |
| `performance.dispatchInteractEvent` | `false` | Fire `CompanionPlayerInteractEvent` for other plugins when a player clicks a companion. Independent of the owner dashboard. |
| `performance.updateInterval` | `3` | Ticks between companion animation updates, at least 1. |
| `performance.viewerRefreshDelay` | `3` | Ticks between viewer distance checks and viewer visibility refreshes, at least 1. |
| `performance.viewDistance` | `8` | Blocks within which other players see a companion, 0 or more. |

## serverRules

| Setting | Default | What it changes |
|---|---|---|
| `serverRules.hiddenWorlds` | `[]` | World names where companion visuals are hidden. Bonuses stay active. |
| `serverRules.bonusDisabledWorlds` | `[]` | World names where attributes, effects, reward bonuses, and automatic companion XP are suspended. Booster timers keep running. |
| `serverRules.worldguard` | `true` | Honor the `bytecompanions-visuals` and `bytecompanions-bonuses` flags when WorldGuard is installed. |

World names must match exactly and must not be blank.

## menus

| Setting | Default | What it changes |
|---|---|---|
| `menus.rightClickDashboard` | `true` | Open the companion dashboard when its owner right-clicks it with the main hand. |

## collections

| Setting | Default | What it changes |
|---|---|---|
| `collections.maximumOutfits` | `8` | Maximum saved outfits per player, from 1 to 32. Lowering it keeps existing outfits. |
| `collections.trialSeconds` | `30` | Private locked-companion preview duration, from 5 to 120 seconds. |
| `collections.personalityEnabled` | `true` | Allow pet, wave, sit, stay, and call interactions and the dashboard actions. |
| `collections.idleReactions` | `true` | Allow occasional idle reactions while a companion is stationary. |

## features

| Setting | Default | What it changes |
|---|---|---|
| `features.attributes` | `false` | Enable companion attribute modifiers from `features/attributes/config.toml`. |
| `features.buffs` | `false` | Enable experience, loot, and drop buffs from `features/buffs/config.toml`. |
| `features.decorations` | `true` | Enable static decoration companions from `features/decorations/config.toml`. |
| `features.effects` | `false` | Enable potion effects from `features/effects/config.toml`. |
| `features.particles` | `true` | Enable particle effects; icons in `features/particles/icons.toml`, settings in `features/particles/config.toml`. |
| `features.progression` | `false` | Enable companion levels and upgrades from `features/progression/config.toml`. |
| `features.boosters` | `false` | Enable personal and server boosters from `features/progression/config.toml`. |

A disabled feature keeps its saved records and hides its commands.

## In-game editor

`/bytecompanions config` opens VolmLib's configuration editor, a 54-slot inventory. The home page shows the sections centered in rows two and three; each section lists its settings.

Section and setting names and their summaries are read from the active language catalog (the `gui.setting.*` keys), so the editor follows the server language and any personal language choice.

| Control | Slot or action |
|---|---|
| Back | Slot 45 |
| Previous page | Slot 48 |
| Next page | Slot 50 |
| Close | Slot 53 |
| Boolean | Click to toggle |
| Number | Left click adds one step, right click subtracts one step, shift multiplies the step by ten, Q prompts for an exact value |
| Text or list | Click to type the value in chat; the prompt expires after 60 seconds and `cancel` aborts |

Every edit is validated like a saved file. A setting that changed on disk while the editor was open is refused and the editor reopens with the current value.

## Hot reload

The plugin watches `config.toml`, `companions/*.toml`, `features/*/config.toml`, `features/particles/icons.toml`, `features/progression/config.toml`, and `languages/*.toml`. A change is applied after it has stayed unchanged for `hotReload.cooldownMillis`, polled every `hotReload.pollIntervalMillis`, so a burst of saves becomes one reload. Root settings and content files are validated together before the running companions are replaced.

A rejected file keeps the last known good runtime and logs one `SEVERE` line:

```none
Rejected ByteCompanions file changes; the last known good settings remain active.
```

A successful reload logs `Applied ByteCompanions configuration file changes.` and, with `hotReload.notifyOperators` on, sends one action bar line to players with `bytecompanions.config`. Online players' companions, selections, progression, and collection preferences reload after every accepted change without reconnecting.

Adding or deleting a companion file is detected. Deleting a feature file is rejected; the file is not regenerated.

> **Restart needed:** `presentation.splashScreen` and the command registration are read once at enable. Replacing the jar always needs a restart. {.is-warning}

## Related pages

- [Commands and permissions *The `config` command and its permission*](/bytecompanions/02-commands-permissions)
- [Languages *The `general.language` key and language files*](/bytecompanions/04-languages)
- [Particles and features *The feature files behind the switches*](/bytecompanions/08-particles-and-features)
{.links-list}
