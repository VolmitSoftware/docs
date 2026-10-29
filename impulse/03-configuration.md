---
title: "Impulse configuration"
description: "Server settings and individual machine tiers"
published: true
date: 2026-10-29T00:00:00.000Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Edit `plugins/Impulse/config.toml` or use `/impulse config`. File edits and the GUI use the same validation; invalid edits retain the active settings.

## Server settings

| Section and key | Default | Purpose |
| --- | --- | --- |
| `general.enabled` | `true` | Allow machine actions |
| `general.language` | `"en_US"` | Server language |
| `general.updateNotifications` | `true` | Release notices for permitted players |
| `metrics.enabled` | `true` | Allow configured bStats reporting |
| `presentation.splashScreen` | `true` | Print startup artwork |
| `presentation.alternateSplashes` | `true` | Vary startup artwork |
| `presentation.commandSounds` | `true` | Play command feedback |
| `debug.uploadEnabled` | `true` | Allow requested debug uploads |
| `hotReload.enabled` | `true` | Watch configuration and language files |
| `hotReload.pollIntervalMillis` | `1000` | Time between checks; 250–60000 ms |
| `hotReload.cooldownMillis` | `1500` | Quiet period after edits; 250–60000 ms |
| `hotReload.notifyOperators` | `true` | Notify configuration administrators after reload |
| `machines.maxPerChunk` | `32` | Placement limit; 1–256 |
| `machines.maxTargets` | `8` | Maximum completed operations per cycle; 1–64 |
| `machines.requireOwnerOnline` | `true` | Initial owner-online gate |
| `machines.redstoneMode` | `"ALWAYS"` | Mode assigned when a machine is placed |
| `machines.chopperReplanting` | `false` | Consume stored plants to replant supported upright base logs |

Disabling the owner-online gate does not permit actions that require an available player in the owning region.

## Machine tiers

Each type has its own sequence of 1–20 consecutive levels, starting at 1. Tables use `[tiers.<type>.<level>]`. The price belongs to the tier being purchased.

```toml
[tiers.collector.2]
intervalTicks = 35
range = 5
damage = 4.0
collectDrops = true
enabled = true
experienceLevels = 10
economyCost = 2000.0
```

| Field | Range | Meaning |
| --- | --- | --- |
| `intervalTicks` | 5–72000 | Delay between action cycles |
| `range` | 1–16 | Search range for harvesters, grinders, collectors, shearers, and choppers |
| `damage` | 0.5–2048 | Health points per grinder strike |
| `collectDrops` | Boolean | Store harvest/break/shear/chop output and let grinders collect drops |
| `enabled` | Boolean | Allow this tier to perform actions |
| `experienceLevels` | 0–200000 | Exact experience-level price to enter the tier |
| `economyCost` | 0–20000000000 | Exact Vault price to enter the tier |

Every tier contains the same fields, but controls show only settings used by that machine. A collector always performs collection; its `collectDrops` field does not disable its primary action. Use `enabled` to disable an action at a particular level.

## Defaults

| Level | Interval, ticks | Search radius | Grinder damage | XP levels | Money |
| --- | --- | --- | --- | --- | --- |
| 1 | 40 | 4 | 4 | 0 | 0 |
| 2 | 35 | 5 | 5 | 10 | 2000 |
| 3 | 30 | 6 | 6 | 15 | 3000 |
| 4 | 25 | 7 | 7 | 20 | 4000 |
| 5 | 20 | 8 | 8 | 25 | 5000 |

Actions and generated-drop collection default to enabled. Non-grinder damage fields default to 4.

## Applying edits

The GUI edits existing tier fields. Add or remove complete level tables in the TOML file, keeping levels consecutive. Each machine type must retain at least one tier.

Loaded machines use the active tier settings. If the configured maximum is below a machine's saved level, its effective settings use the highest configured tier; the saved level remains intact. Restoring those tiers restores access to their settings.

An upgrade menu opened before a configuration change refreshes before charging. Local file edits pending reload also prevent an editor save from overwriting those edits.

## Crafting recipes

Each machine has a `[recipes.<type>]` table. The default shearer recipe uses `SHEARS` as its top ingredient, with redstone, a dispenser, and copper below. The chopper uses `IRON_AXE` in the same position. For example:

```toml
[recipes.harvester]
enabled = true
level = 1
amount = 1
shape = [" I ", "RDR", " C "]

[recipes.harvester.ingredients]
I = "WHEAT"
R = "REDSTONE"
D = "DISPENSER"
C = "COPPER_INGOT"
```

Shapes contain one to three equal-width rows, each one to three characters wide. Spaces are empty slots; uppercase letters identify ingredients. Define every used letter once and omit unused letters. Ingredients use current item-material names and match plain items exactly, preventing named items, enchanted tools, and machine cores from being consumed.

Ingredient letters label the configuration only. Renaming a letter consistently in both the shape and ingredients table leaves the recipe unchanged.

`amount` accepts 1–64; `level` must exist for that machine type. Setting `enabled = false` removes the recipe. Valid edits replace the registered recipes and prevent stale crafting windows from taking changed outputs. Players need the matching craft permission; automated crafter blocks cannot make machine cores.

## Item and mob filters

Policies apply per machine type:

```toml
[policies.collector]
itemMode = "ALLOW"
items = ["DIAMOND", "EMERALD"]
mobMode = "DENY"
mobs = []
protectedSlots = []
```

`ALLOW` accepts listed values only; an empty list accepts nothing. `DENY` rejects listed values; the default empty lists allow all otherwise eligible targets. Item names are current item materials. Mob names are living mob entity types. They narrow the grinder's hostile targets and the shearer's eligible sheep.

Item filters apply to collected drops, launcher ammunition, placer blocks, and complete harvester, breaker, shearer, or chopper output batches. If any output in a batch is denied, the target remains untouched. Filters do not discard denied items or broaden the allowed crops, blocks, or hostile targets. Harvester item filters check the output, not the seed or pod used for replanting.

Chopper replanting also checks the planting item's material against the chopper item filter. Its saplings, propagules, and fungi must be in unprotected input slots. See [Chopper replanting](/impulse/05-machines#chopper-replanting) for eligible bases.

`protectedSlots` lists dispenser slots 1–9, numbered left to right and top to bottom. Harvesters cannot consume replanting seeds or pods from those slots. Launchers and placers cannot consume those inputs; breakers, shearers, and choppers cannot use or wear tools in those slots. These settings do not restrict player inventory moves or hopper transfers, and collection can still store output there.
