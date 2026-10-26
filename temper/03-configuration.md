---
title: "Temper: Configuration"
description: "Settings, editor controls, and automatic reload"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "temper, configuration"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Edit `plugins/Temper/config.toml` or use `/temper config`. Dotted names such as `general.enabled` mean a key inside the named TOML section. Invalid edits retain the active settings.

## General

| Setting | Default | What it changes |
|---|---|---|
| `general.enabled` | `true` | Accept new quotes and confirmations |
| `general.language` | `en_US` | Server language; players may choose their own |
| `general.updateNotifications` | `false` | Check the configured GitHub release source |

## Presentation

| Setting | Default | What it changes |
|---|---|---|
| `presentation.splashScreen` | `true` | Startup banner on the next start |
| `presentation.alternateSplashes` | `false` | Alternate banner taglines on the next start |
| `presentation.sound` | `true` | Anvil sound after successful repairs |
| `presentation.particles` | `true` | Brief repair particles |

## Hot reload

| Setting | Default | What it changes |
|---|---|---|
| `hotReload.enabled` | `true` | Apply stable settings and installed language changes |
| `hotReload.pollIntervalMillis` | `1000` | Time between file checks, in milliseconds |
| `hotReload.cooldownMillis` | `1500` | Minimum interval between reload batches, in milliseconds |
| `hotReload.notifyOperators` | `true` | Show applied or rejected settings reloads in the action bar to online players with `temper.config` |

Both timing settings are clamped to 250–60,000 milliseconds.

## Metrics and diagnostics

| Setting | Default | What it changes |
|---|---|---|
| `metrics.enabled` | `true` | Allow bStats when a positive service ID is registered; the placeholder ID is currently zero |
| `debug.uploadEnabled` | `false` | Permit report uploads; `upload=false` still keeps a report local |

## Repairs and stations

| Setting | Default | What it changes |
|---|---|---|
| `repair.allowCreative` | `false` | Allow creative-mode repairs |
| `repair.allowMending` | `true` | Allow Mending equipment |
| `repair.allowCustomItems` | `false` | Allow model/custom-data items using normal Bukkit durability |
| `repair.allowUnbreakable` | `false` | Allow damaged items marked unbreakable |
| `repair.quoteLifetimeSeconds` | `30` | Quote expiry, from 5 through 300 seconds |
| `repair.cooldownSeconds` | `2` | Successful-repair cooldown, from 0 through 3600 seconds |
| `repair.disabledWorlds` | `[]` | World names or UUIDs where commands and stations are blocked; matching ignores letter case |
| `repair.blockedMaterials` | `[]` | Equipment types excluded from repairs |
| `stations.enabled` | `true` | Registered station use |
| `stations.interceptVanilla` | `false` | Open Temper when using ordinary anvils |
| `stations.interaction` | `RIGHT_CLICK` | `RIGHT_CLICK` repairs on right-click; `SNEAK_RIGHT_CLICK` requires sneaking and preserves normal vanilla interaction |
| `stations.publicByDefault` | `true` | New station access |
| `stations.indestructible` | `true` | Registered anvil protection |

Pricing rules, permission profiles, and kits are described in [repairs and pricing](/temper/05-repairs-pricing).

## Station visuals

All names in this table are inside `[stations.visuals]`. Individual station toggles also apply. Holograms and item previews require Gloss; particles and sounds do not.

| Setting | Default | Meaning and range |
|---|---|---|
| `enabled` | `true` | Enable station presentation |
| `holograms` | `true` | Show localized labels above registered stations |
| `previews` | `true` | Show a cosmetic copy of the selected item |
| `range` | `16` | Viewing and effect distance, 2–64 blocks |
| `refreshTicks` | `20` | Nearby-station refresh interval, 10–200 ticks |
| `maxPerPlayer` | `8` | Visible station labels per player, 1–16 |
| `previewSeconds` | `5` | Item-preview lifetime, 1–30 seconds |
| `ambient` | `false` | Show nearby ambient station particles |
| `particle` | `FLAME` | Bukkit particle name requiring no extra data, such as `FLAME` or `END_ROD` |
| `particleCount` | `8` | Particles per effect, 0–32 |
| `sound` | `minecraft:block.anvil.use` | Namespaced sound key for successful repairs; custom resource-pack sounds are allowed |
| `volume` | `0.7` | Sound volume, 0–2 |
| `pitch` | `1.2` | Sound pitch, 0.5–2 |

## Repair history

| Setting | Default | Meaning and range |
|---|---|---|
| `ledger.retentionDays` | `30` | Keep completed transaction archives for 1–3650 days |
| `ledger.maxArchivedEntries` | `10000` | Keep at most 0–100000 completed records; zero keeps none |

Completed, cancelled, and resolved money records live under `storage/transactions/archive/`. Retention uses file modification time and runs at startup, after ledger writes, and when retention settings reload. Records exceeding either limit are removed. Unresolved payments stay under `storage/transactions/` and are never removed by retention.

## Editor and reload

The editor uses the shared configuration screen, with translated setting descriptions and separate controls for creating and editing repair profiles, permission profiles, and kits. Changes pass through the same validation as file edits. Navigation uses Back, page arrows, and Close; items cannot be moved into the editor.

Installed catalogs and configuration are checked for stable changes. A successful settings reload invalidates outstanding quotes, so players must review a new price. Rejected configuration bytes are reported once; changing the file triggers another attempt. A malformed personal language file keeps its last valid messages while other valid files can reload.

## Related pages

- [Languages *Selection and message editing*](/temper/04-languages)
- [Repairs and pricing *Formulas and profiles*](/temper/05-repairs-pricing)
- [Diagnostics *Checking applied settings*](/temper/08-diagnostics)
{.links-list}
