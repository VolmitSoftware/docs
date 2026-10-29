---
title: "Axion: Configuration"
description: "Settings, tiers, fuel, and machine menu controls"
published: true
date: 2026-10-29T05:23:20.000Z
tags: "axion, configuration"
editor: "markdown"
dateCreated: 2026-10-15T00:00:00.000Z
---

Edit `plugins/Axion/config.toml` or run `/axion config` in game. Dotted names below identify a TOML section and its key; for example, `general.enabled` is `enabled` under `[general]`.

## General

| Setting | Default | What it changes |
| --- | --- | --- |
| `general.enabled` | `true` | Enable machine operation |
| `general.language` | `en_US` | Server language |
| `general.updateNotifications` | `true` | GitHub release notifications |

## Metrics

| Setting | Default | What it changes |
| --- | --- | --- |
| `metrics.enabled` | `true` | bStats service; remains inactive while its registration ID is `0` |

## Presentation

| Setting | Default | What it changes |
| --- | --- | --- |
| `presentation.splashScreen` | `true` | Print the startup banner |
| `presentation.alternateSplashes` | `true` | Allow alternate startup artwork |
| `presentation.commandSounds` | `true` | Configuration editor success and failure sounds |
| `presentation.reducedMotion` | `false` | Suppress beams, idle particles, and upgrade particles |
| `presentation.idleIndicator` | `false` | Show one idle particle at most once per second per controller |
| `presentation.upgradeEffects` | `true` | Show a short particle burst after a successful upgrade |

## Hot reload

| Setting | Default | What it changes |
| --- | --- | --- |
| `hotReload.enabled` | `true` | Watch configuration and language changes |
| `hotReload.pollIntervalMillis` | `1000` | Poll interval; 250 to 60000 milliseconds |
| `hotReload.cooldownMillis` | `1500` | Wait for file edits to settle; 250 to 60000 milliseconds |
| `hotReload.notifyOperators` | `true` | Configuration and language notices for players with `axion.config` |

## Debug

| Setting | Default | What it changes |
| --- | --- | --- |
| `debug.uploadEnabled` | `true` | Permit an upload requested with a debug dump |

## Machine settings

| Setting | Default | What it changes |
| --- | --- | --- |
| `settings.allowedWorlds` | `[]` | Exact allowed world names; empty permits all worlds |
| `settings.deniedWorlds` | `[]` | Exact denied world names; denial wins |
| `settings.intervalTicks` | `10` | Dispatcher interval; 1 to 200 ticks |
| `settings.maxMachinesPerOwner` | `16` | Registered machines per owner |
| `settings.maxMachinesPerChunk` | `8` | Registered machines per chunk |
| `settings.maxMachinesTotal` | `10000` | Registered machines server-wide |
| `settings.combatEnabled` | `false` | Allow hostile-mob actions |
| `settings.redstoneEnabled` | `true` | Allow lever toggles and button presses |
| `settings.beamEnabled` | `true` | Show route particles |
| `settings.controllerMaterial` | `BARREL` | Material for newly issued controllers: `BARREL`, `DROPPER`, or `DISPENSER` |
| `settings.sharedAccess` | `false` | Allow other players with `axion.use` to operate machines and use their storage |
| `settings.verticalSigns` | `true` | Allow `^` and `v` route directives |
| `settings.stopSigns` | `true` | Allow the `x` route directive |
| `settings.xpUpgrades` | `true` | Permit experience-level upgrades |
| `settings.moneyUpgrades` | `true` | Permit economy upgrades when the provider and platform support them |
| `settings.deniedBlocks` | See below | Materials that machines cannot mine |

World names are case-insensitive after trimming; wildcards are not supported. World restrictions stop new placement and work but leave storage access and controlled pickup available.

The default denied materials are `BEDROCK`, `BARRIER`, `END_PORTAL_FRAME`, `END_PORTAL`, `NETHER_PORTAL`, `COMMAND_BLOCK`, `CHAIN_COMMAND_BLOCK`, `REPEATING_COMMAND_BLOCK`, `STRUCTURE_BLOCK`, `JIGSAW`, `SPAWNER`, and `REINFORCED_DEEPSLATE`.

## Tiers

Define between 1 and 100 consecutive sections, from `[tiers.tier1]` through `[tiers.tierN]`. Five tiers ship by default. Each table's `level` must match its number; gaps and duplicate numeric aliases are invalid. Add or remove tier tables in the TOML file, then use the editor to adjust their values.

Reducing the configured tier count retains placed machines' stored tier numbers but caps their operating limits at the highest configured tier. Portable items above that maximum cannot be placed until that tier is configured. The highest configured tier has no further upgrade.

| Setting | Default | What it changes |
| --- | --- | --- |
| `tiers.tierN.level` | `N` | Matching tier number, 1 to 100 |
| `tiers.tierN.range` | Table below | Maximum route range, 1 to 64 |
| `tiers.tierN.maxActions` | Table below | Maximum successful actions per cycle, 1 to 64 |
| `tiers.tierN.cycleTicks` | Table below | Cycle delay, from the dispatcher interval to 72000 ticks |
| `tiers.tierN.damage` | Table below | Combat damage, 0 to 100 |
| `tiers.tierN.xpLevels` | Table below | Experience-level price to enter this tier |
| `tiers.tierN.money` | Table below | Vault price to enter this tier |
| `tiers.tierN.pickup` | Tier 2 onward | Unlock loose-item pickup |
| `tiers.tierN.harvest` | Tier 3 onward | Unlock crop harvesting |
| `tiers.tierN.smelt` | Tier 5 | Unlock smelting |
| `tiers.tierN.beamColor` | Gold through copper | Beam and upgrade-particle color as `#RRGGBB` |

| Tier | Range | Actions | Cycle ticks | Damage | XP levels | Money |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 16 | 2 | 80 | 2 | 0 | 0 |
| 2 | 24 | 3 | 60 | 3 | 5 | 500 |
| 3 | 32 | 4 | 40 | 4 | 10 | 1500 |
| 4 | 48 | 6 | 30 | 5 | 15 | 4000 |
| 5 | 64 | 8 | 20 | 6 | 20 | 10000 |

## Fuel

Each `[fuels.MATERIAL]` section sets fuel duration and an optional container remainder. Material names must resolve to items; at least one fuel is required.

The default map contains 280 vanilla fuel materials. Axion uses the fuel tables in your file exactly as configured; loading or saving the file does not add missing default entries. Named items and items with custom metadata are excluded from fuel use.

| Setting | Default | What it changes |
| --- | --- | --- |
| `fuels.MATERIAL.activeTicks` | Table below | Fuel credit per item, 1 to 72000000 ticks |
| `fuels.MATERIAL.remainder` | Empty string | Item returned after consumption; `BUCKET` for lava buckets |

| Material or group | Active ticks |
| --- | --- |
| `BAMBOO`, `SCAFFOLDING` | 50 |
| Wool carpets | 67 |
| Wool, wooden buttons, saplings, azaleas, sticks, bowls, dead bushes, dry grass, leaf litter | 100 |
| Burnable wooden slabs, including bamboo mosaic slabs | 150 |
| Burnable wooden doors, ordinary signs, wooden tools and spears | 200 |
| Burnable logs, wood, planks, bamboo blocks and mosaics, stairs, fences, gates, trapdoors, pressure plates, shelves, wooden workstations, chests, barrels, banners, bows, fishing rods, ladders, mangrove roots | 300 |
| Burnable hanging signs | 800 |
| Boats, chest boats, bamboo rafts and chest rafts | 1200 |
| `COAL`, `CHARCOAL` | 1600 |
| `BLAZE_ROD` | 2400 |
| `DRIED_KELP_BLOCK` | 4001 |
| `COAL_BLOCK` | 16000 |
| `LAVA_BUCKET` | 20000 |

Crimson and warped wood are excluded. Lava buckets return `BUCKET`; the other default fuels have no remainder.

Hoppers leave ordinary configured fuel in the controller and extract other eligible items, including items in later slots. This also reserves mined wood or produced charcoal when their materials are configured as fuel. Remove a material's fuel table to allow hopper export of its ordinary items. Hopper input and manual withdrawals remain available.

## Machine menu

| Setting | Default | What it changes |
| --- | --- | --- |
| `gui.fillerMaterial` | `BLACK_STAINED_GLASS_PANE` | Empty panel slots |
| `gui.machineTitle` | Axion gold/copper gradient and `{tier}` | Machine panel title |
| `gui.machineSlots.<action>` | Table below | Zero-based inventory slot, 0 to 53; every action needs a distinct slot |
| `gui.machineMaterials.<action>` | Table below | Item material representing the action |

| Action | Slot | Material |
| --- | --- | --- |
| `inspect` | 4 | `BARREL` |
| `pause` | 10 | `LIME_DYE` |
| `breaking` | 11 | `DIAMOND_PICKAXE` |
| `harvest` | 12 | `WHEAT` |
| `replant` | 13 | `WHEAT_SEEDS` |
| `pickup` | 14 | `HOPPER` |
| `smelt` | 15 | `FURNACE` |
| `combat` | 16 | `IRON_SWORD` |
| `ignite` | 20 | `FLINT_AND_STEEL` |
| `redstone` | 21 | `LEVER` |
| `preview` | 22 | `SPYGLASS` |
| `range` | 23 | `COMPASS` |
| `actions` | 24 | `REPEATER` |
| `upgrade-xp` | 30 | `EXPERIENCE_BOTTLE` |
| `upgrade-money` | 32 | `GOLD_INGOT` |
| `storage` | 40 | `CHEST` |
| `close` | 53 | `BARRIER` |

## Configuration editor

| Control | Action |
| --- | --- |
| Categories | Open a setting group |
| Toggle | Change a boolean value |
| Numeric control | Adjust within the displayed limits |
| Text or list setting | Enter a validated value in chat |
| Back, slot 45 | Return to the parent group |
| Previous / Next, slots 48 / 50 | Change page |
| Close, slot 53 | Close the editor |

Saving reports the old and new values. If the file changed after the screen opened, reopen it before saving again.

Controller material changes affect newly issued items. Placed controllers keep their material, capacity, and contents; collecting one returns that same controller type. Barrels have 27 storage slots, while droppers and dispensers have 9. Native dispensing is blocked on machine controllers. Hoppers can insert items and extract items that are not reserved as fuel.

Shared access includes storage, work settings, and permitted upgrades. Only the owner or a player with `axion.accessall` can collect the controller. The online-owner requirement remains in force. With a sign directive disabled, that directive keeps the incoming direction and continues the route. Particle controls do not change work or text feedback; `beamEnabled=false` also suppresses idle and upgrade particles.

Valid configuration changes apply together. Invalid files retain the last working settings and log the failure. Language files have their own watcher and fallback behavior. Action-bar notices explicitly confirm when rejected changes leave previous values active. Disabling hot reload requires re-enabling it through the editor or restarting before disk-only edits apply again; splash changes affect the next startup.

## Related pages

- [Commands and permissions *Access to the editor*](/axion/02-commands-permissions)
- [Languages *Server and personal language choices*](/axion/04-languages)
- [Machines and routes *How settings affect work*](/axion/05-machines-routes)
{.links-list}
