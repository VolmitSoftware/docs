---
title: "Impulse machines"
description: "Action rules, storage, upgrades, and redstone"
published: true
date: 2026-10-23T16:24:03.218Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Machines store inputs and outputs in nine dispenser slots. Right-click for controls or sneak-right-click for storage.

Owners and trusted players can use the controls and storage. Only owners and administrators can break machines or change trusted access. See [Commands and permissions](/impulse/02-commands-permissions) for trust and confirmed ownership transfers.

## Types

| Type | Action |
| --- | --- |
| Harvester | Harvests crops, berries, upper cane/cactus/bamboo segments, and stem-grown fruit; retains or replants the growing plant |
| Grinder | Damages eligible hostile monsters and slimes; optionally collects nearby drops |
| Launcher | Fires ordinary arrows or splash potions from storage in the dispenser's facing direction |
| Collector | Collects nearby dropped items when their pickup restrictions permit |
| Breaker | Uses a suitable stored tool to break an allowed block directly in front |
| Placer | Consumes an allowed stored building block and places it directly in front |
| Shearer | Uses stored shears on nearby adult sheep and produces wool matching their color |
| Chopper | Uses stored axes to cut logs and nether stems within its configured cube |

Grinders exclude players, armor stands, named or tamed entities, invulnerable targets, Withers, Ender Dragons, and Wardens. Harvester searches cover the configured horizontal range and three vertical layers.

Breakers accept common stone, soil, ores, and logs, including pale oak. Placers accept a restricted set of basic building blocks, including pale oak planks. They do not break or place arbitrary containers or privileged blocks.

Choppers scan from `-range` to `+range` on each axis around the dispenser. They cut unstripped logs and nether stems, including player-placed logs. Leaves, saplings, stripped wood, and planks remain untouched. Store an axe in an unprotected slot; each successful block break wears it once and uses normal block-break protection checks.

Shearers skip lambs and sheep that are already sheared. Each successful action produces 1–3 wool and wears the stored shears once. Sheep regrow wool through normal game behavior.

Launcher splash potions preserve their base potion and custom effects. Effects apply only to the same eligible hostile targets as grinder damage; players, pets, named mobs, and bosses are excluded, including for beneficial potions. Native splash cancellation and protection rules still apply. Water bottles require the cancellable water-splash event provided by Paper and its forks; servers without it leave water bottles in storage. Machine potions cannot extinguish fire, candles, or campfires.

Per-type filters can narrow item and mob eligibility. Protected input slots stop harvesters, launchers, breakers, placers, shearers, and choppers from consuming or wearing selected inputs. Configure these rules under [Machine filters](/impulse/03-configuration).

## Harvesting and replanting

| Crop | Harvest rule |
| --- | --- |
| Wheat, carrots, potatoes, beetroot, nether wart, cocoa | Harvest at full maturity, reserve one seed or crop item from the drops, and reset growth |
| Sweet berries | Pick fully mature bushes for 2–3 berries and reset the bush to age 1 |
| Sugar cane, cactus, bamboo | Remove an exposed top segment only when another segment remains below it; leave the base to regrow |
| Melon, pumpkin | Harvest fruit connected to a matching attached stem and return the stem to its mature growing state |
| Torchflower | Harvest the mature flower and consume one stored torchflower seed to replant |
| Pitcher crop | Harvest a complete mature crop and consume one stored pitcher pod; remove the upper half and replant the lower half |

Store torchflower seeds and pitcher pods in unprotected dispenser slots. Missing seeds or pods leave the crop untouched and show a replanting message in the controls. Output capacity accounts for the consumed item, so using the last seed in a slot can make room for the harvest. Immature crops and standalone pitcher plants remain untouched.

Column crops are harvested from the top down within the three searched layers. A taller column whose top is outside those layers stays intact. A cactus with a flower above it also stays intact. Melons and pumpkins without an attached stem are not harvester targets. Pitcher harvesting includes both halves even when the upper half lies just above the searched layers; both must be in an owned region.

Berry yields start at 2–3 items and can be changed by `PlayerHarvestBlockEvent`. Other crop drops use the server's block loot. Replanting checks and events are described under [Integrations](/impulse/06-integrations).

## Storage and drops

Hoppers share the native inventory. With `collectDrops=true`, harvesters, breakers, shearers, and choppers require room for their generated drops before acting. Disabling it drops output into the world. Grinders alternate collection and attack priority within their action allowance so sustained combat does not prevent pickup.

Collectors honor item ownership, pickup delays, available inventory space, and protection checks. Full storage leaves items in the world.

Breaker ore drops use the stored tool. XP-bearing ores produce experience unless Silk Touch suppresses it; Bukkit event handlers can override the XP amount or cancel the break. Breaker, shearer, and chopper tool wear respects unbreakable items, Unbreaking, and custom maximum durability.

## Upgrades

The controls show effective settings and the next tier's before/after values. Pay with experience levels or, when available, Vault money. The next tier's configured price is charged exactly.

Paused state and redstone mode remain unchanged by an upgrade. Maximum-level machines show that they cannot upgrade further.

## Redstone

| Mode | When it runs |
| --- | --- |
| `ALWAYS` | On its configured interval |
| `POWERED` | While powered |
| `UNPOWERED` | While unpowered |
| `PULSE` | After a rising redstone signal is registered |

Pause overrides all modes. Pending pulses are coalesced; the mode does not queue unlimited actions.

## Loaded regions

Machines operate in loaded chunks and only access owned regions on Folia. Scans process at most 256 candidate block positions or 512 entity entries per cycle. Harvesters also check the neighboring blocks needed to preserve crop bases, stems, and pitcher halves. Searches continue across cycles rather than permanently favoring the first crowded chunk.

Use [Configuration](/impulse/03-configuration) for individual tier settings and [Integrations](/impulse/06-integrations) for event and protection behavior.
