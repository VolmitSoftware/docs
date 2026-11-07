---
title: "Brimstone: Configuration"
description: "Every setting, launcher definitions, the in-game editor, and file watching"
published: true
date: 2026-11-07T00:00:00.000Z
tags: "brimstone, configuration"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Brimstone stores settings in `plugins/Brimstone/brimstone.toml`. Change them with `/brimstone config` or by saving the file.

Settings are written as `section.key`, so `gameplay.cooldownTicks` is the `cooldownTicks` key under `[gameplay]`. Values outside their range reject the whole file.

## general

| Setting | Default | What it changes |
|---|---|---|
| `general.enabled` | `true` | Allow new launches; when off, a launch is refused with a chat notice and costs nothing, while TNT already in flight finishes |
| `general.language` | `en_US` | Server default [language](/brimstone/04-languages) |
| `general.updateNotifications` | `true` | Check GitHub releases once at startup and notify players with `brimstone.update` |

## metrics

| Setting | Default | What it changes |
|---|---|---|
| `metrics.enabled` | `true` | Report anonymous statistics to [bStats](/brimstone/07-diagnostics#bstats), subject to the global opt-out |

## presentation

| Setting | Default | What it changes |
|---|---|---|
| `presentation.splashScreen` | `true` | Print the startup banner with the version, platform, and supported Minecraft range |
| `presentation.alternateSplashes` | `true` | Let one start in ten use alternate banner art; the detail rows stay the same |
| `presentation.commandSounds` | `true` | Play a sound when an editor save succeeds or fails |

The banner always prints when Brimstone fails to enable, whatever these settings say.

## hotReload

| Setting | Default | What it changes |
|---|---|---|
| `hotReload.enabled` | `true` | Apply file changes automatically |
| `hotReload.pollIntervalMillis` | `1000` | Watcher poll interval, 250 to 60000 milliseconds |
| `hotReload.cooldownMillis` | `1500` | Quiet period before a change applies, 250 to 60000 milliseconds |
| `hotReload.notifyOperators` | `true` | Show players with `brimstone.config` an action bar line when changes apply or are rejected |

## debug

| Setting | Default | What it changes |
|---|---|---|
| `debug.uploadEnabled` | `true` | Allow `/brimstone debug dump upload=true` to upload reports to mclo.gs; reports are always saved locally and upload only when asked |

## gameplay

| Setting | Default | What it changes |
|---|---|---|
| `gameplay.craftingEnabled` | `true` | Register launcher recipes |
| `gameplay.cooldownTicks` | `30` | Delay between launches by one player, 0 to 72000 ticks |
| `gameplay.fuelMaterial` | `GUNPOWDER` | Default fuel item |
| `gameplay.fuelCount` | `1` | Default fuel count, 0 to 64 |

A cooldown keeps running if the player leaves and rejoins, and it resets when the server restarts.

Each launch consumes one launcher item. A fuel count of zero or the fuel bypass removes only the extra fuel cost. Named or otherwise customized items do not count as fuel.

## access

| Setting | Default | What it changes |
|---|---|---|
| `access.worldMode` | `ALL` | `ALL`, `ALLOWLIST`, or `DENYLIST` |
| `access.worlds` | `[]` | Exact world names for the mode; at most 128 unique, nonblank names of up to 128 characters |
| `access.worldGuard` | `AUTO` | `AUTO`, `REQUIRED`, or `DISABLED`; see [WorldGuard](/brimstone/06-integrations#worldguard) |
| `access.protectionPlugins` | `true` | Deny TNT effects wherever the launching player could not break blocks; see [other protection plugins](/brimstone/06-integrations#other-protection-plugins) |

## limits

| Setting | Default | What it changes |
|---|---|---|
| `limits.tntPerPlayer` | `8` | Live launched TNT per player, 0 to 10000 |
| `limits.tntPerWorld` | `64` | Live launched TNT per world, 0 to 10000 |
| `limits.tntPerServer` | `256` | Live launched TNT on the server, 0 to 10000 |
| `limits.secondaryPerPlayer` | `16` | Live creepers and fireworks from one player's TNT, 0 to 50000 |
| `limits.secondaryPerWorld` | `128` | Live creepers and fireworks in one world, 0 to 50000 |
| `limits.secondaryPerServer` | `512` | Live creepers and fireworks on the server, 0 to 50000 |

Limits count work still being spawned. A limit of zero denies new entities. Fuel is spent only after the TNT is admitted and spawned.

## effects

| Setting | Default | What it changes |
|---|---|---|
| `effects.trailIntervalTicks` | `2` | Ticks between particle trail pulses, 1 to 200 |
| `effects.trailParticles` | `4` | Particles in each trail pulse, 0 to 256 |
| `effects.burstParticles` | `60` | Particles in each explosion burst, 0 to 4096 |
| `effects.particlesPerTick` | `4096` | Particles Brimstone may emit per tick across the server, 0 to 65536 |
| `effects.secondaryLifetimeTicks` | `600` | Ticks before a secondary creeper, firework, or cluster charge is removed, 1 to 72000 |
| `effects.creeperAI` | `true` | Let creeper-effect creepers chase and explode near players; when off, they stand still and cannot explode |

These settings cover particles only. DJ notes, creeper hisses, and rainbow chimes keep their own timing, including when trail particles are zero or the budget is spent. Sounds missed while an entity is unavailable are not replayed.

## definitions

`definitions.<id>` configures one launcher. The file accepts 1 to 64 definitions. An ID starts with a lowercase letter, then uses lowercase letters, digits, underscores, or hyphens, up to 32 characters.

| Setting | Default | What it changes |
|---|---|---|
| `effect` | `notch` | `notch`, `creeper`, `firework`, `love`, `dj`, `rainbow`, `water`, `impact`, `cluster`, `bouncy`, `frost`, or `smoke` |
| `name` | `&6Notch TNT` | Item name with `&` color codes, up to 256 characters; renaming does not change the launcher's ID |
| `lore` | One usage line | Up to 16 lines of up to 512 characters each, with `&` color codes |
| `velocity` | `1.5` | Launch speed in blocks per tick along the aimed direction, 0 to 4 |
| `lift` | `0.0` | Extra upward launch speed in blocks per tick, 0 to 2, added to the aimed direction |
| `radius` | `3.0` | Explosion radius, 0 to 16; zero still runs the effect's sounds and secondary entities; `frost` and `smoke` use it as their reach and never break blocks |
| `fire` | `false` | Set fire around the explosion |
| `fuseTicks` | `80` | Fuse length, 1 to 1200 ticks |
| `craftingMaterial` | `TNT` | Ingredient combined with one TNT; must be an item |
| `craftingCount` | `8` | Ingredient count, 0 to 8; zero omits the recipe |
| `fuelMaterial` | Empty | Fuel item; empty uses `gameplay.fuelMaterial` |
| `fuelCount` | `-1` | Fuel count, -1 to 64; -1 uses `gameplay.fuelCount` |

Two launchers with recipes cannot share the same `craftingMaterial` and `craftingCount`. Such a change is rejected and the log names both launchers.

The default launchers:

| ID | Velocity | Lift | Radius | Fire | Fuse | Recipe with one TNT | Fuel |
|---|---|---|---|---|---|---|---|
| `notch` | 0.5 | 0 | 8 | Yes | 80 | 3 coal | 1 gunpowder |
| `creeper` | 2.5 | 1.0 | 8 | Yes | 80 | 8 gunpowder | 1 gunpowder |
| `firework` | 1.0 | 1.5 | 10 | No | 80 | 4 firework stars | 1 gunpowder |
| `love` | 1.25 | 0 | 3 | Yes | 80 | 2 redstone | 1 redstone |
| `dj` | 1.69 | 0 | 10 | Yes | 80 | 1 diamond | 1 gunpowder |
| `rainbow` | 1.0 | 0 | 15 | No | 80 | 3 gold ingots | 1 gunpowder |
| `water` | 1.5 | 0 | 5 | No | 80 | 1 cod | 1 gunpowder |
| `impact` | 1.6 | 0.1 | 4 | No | 100 | 2 arrows | 1 gunpowder |
| `cluster` | 1.0 | 0.3 | 4 | No | 60 | 4 iron nuggets | 1 gunpowder |
| `bouncy` | 1.0 | 0.4 | 4 | No | 120 | 2 slime balls | 1 gunpowder |
| `frost` | 1.2 | 0.2 | 5 | No | 60 | 4 snowballs | 1 gunpowder |
| `smoke` | 1.0 | 0.2 | 6 | No | 60 | 3 charcoal | 1 gunpowder |

Changes to limits, access, effects, and languages leave unchanged recipes in place. Changes to recipe membership, item names, lore, ingredients, or counts rebuild the recipes, and connected players can craft the changed launcher without rejoining.

## In-game editor

`/brimstone config` opens the settings in a six-row inventory menu and needs `brimstone.config`. The opening pages list the ten sections, eight per page, each with its own icon, followed by a Languages button that opens the language editor. Each launcher under `definitions` shows as a TNT block.

| Control | Action |
|---|---|
| Click a section or launcher | Open it |
| Click a true or false value | Toggle it |
| Left-click or right-click a number | Raise or lower it by one step; hold Shift for ten steps. The value stops at its range |
| Press the drop key on a number, or click any other value | Type the new value in chat; type `cancel` to return |
| Back, Previous, Next | Move between sections and pages |
| Refresh | Reload the values from the file |
| Close | Close the editor |

Each save posts the setting with its old and new values in chat. A success or failure sound plays unless `presentation.commandSounds` is off.

A chat prompt expires after 60 seconds. If the value changed after you opened the editor, the save is refused and you reopen it to try again.

An editor save changes only that key and keeps the rest of your file, including comments. Choosing a server language rewrites the file from the current settings, which removes hand-written comments.

## File watching

Brimstone watches `brimstone.toml` and every installed `languages/<locale>.toml`. A saved change applies once the file has stopped changing for `hotReload.cooldownMillis`.

A file that fails validation is rejected as a whole. The console logs a SEVERE message with the reason and the last valid settings stay active. The console logs every applied or rejected change, whatever `hotReload.notifyOperators` says. Saving the last accepted content again changes nothing and sends no notice.

Deleting `brimstone.toml` regenerates the defaults. Saves from the in-game editors apply directly and do not trigger a second reload.

Edits made while `hotReload.enabled` is off are not replayed later. Because file edits are ignored while it is off, turn it back on with `/brimstone config` or restart the server.

## What needs a restart

`presentation.splashScreen` and `presentation.alternateSplashes` are read once at startup. A restart is also needed after changing the global `plugins/bStats/config.yml` file. Every other setting applies without a restart, and Brimstone attaches to WorldGuard whenever WorldGuard enables.

## Related pages

- [Commands and permissions *The `config` command and its permission*](/brimstone/02-commands-permissions)
- [Brimstone languages *The `general.language` setting and language files*](/brimstone/04-languages)
- [Launchers and effects *What the launcher settings do in play*](/brimstone/05-launchers-effects)
{.links-list}
