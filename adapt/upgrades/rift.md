---
title: "Upgrades - Rift"
description: "Rift upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you merge Rift into a mutated skill ([Mutations](/adapt/35-mutations)), and they replace the original [Rift](/adapt/27-skill-rift) adaptations.

## Upgrades

### Phase Step (`upgraded-rift-phase-step`)

3 levels · 13, 13 and 16 knowledge · Fuses Rift Blink, Pearl Rebound and Rift Resistance

In Survival, pressing jump a second time in mid-air blinks you up to 36, 42 or 48 blocks along your look direction at levels 1, 2 and 3. The blink always passes through walls, snaps onto solid ground up to 5 blocks below the aimed point, and needs at least 2 blocks of travel. Each blink spends one plain ender pearl from anywhere in your inventory, or half a heart when you carry none; with half a heart or less left and no pearl, the blink fizzles. Blinks pay no Rift XP. A blink resets your fall distance and carries you forward on arrival. On arrival you gain Resistance III for 3, 4 or 5 seconds. Blinks recharge in 2.5 seconds. If no safe landing exists, the blink fizzles. Phase Step blinks set off the Rift Trigger of your mutated adaptations at most once every 4 seconds.

From level 2, hitting a creature while sneaking tags it for 30 seconds. Your next blink then swaps places with it instead, as long as it is alive, in your world, within blink range, and you may fight it at both spots and use the spot it stands on. Tags follow Ender Taglock's rules: small mobs, villagers and large mobs at level 2. From level 3 players can be tagged and swapped too, only where PvP is allowed at both spots. A tagged player must be allowed into your spot, and moves only after you arrive. Your own pets and protected friendly mobs are never swapped. A swap costs the same pearl or half heart as a blink.

A plain ender pearl you throw bounces once off the first block it hits, steered partly toward your crosshair, and you teleport where the bounced pearl lands.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `distanceBase` | `30` | Blink distance before level scaling, in blocks. |
| `distancePerLevel` | `6` | Blink distance added per level, in blocks; never above 128. |
| `minDistance` | `2` | Shortest blink that counts, in blocks. |
| `groundSnapDepth` | `5` | Blocks searched downward from the aimed point for solid ground. |
| `momentumCarry` | `0.35` | Speed kept along your look direction after a blink. |
| `cooldownMillis` | `2500` | Time between two blinks, in milliseconds. |
| `resistanceTicksBase` | `40` | Resistance after a blink before level scaling, in ticks. |
| `resistanceTicksPerLevel` | `20` | Resistance after a blink added per level, in ticks. |
| `resistanceAmplifier` | `2` | Resistance amplifier on arrival. |
| `pearlAimBias` | `0.6` | Share of a bounced pearl's direction taken from your crosshair. |
| `pearlSpeed` | `1.5` | Launch speed of a bounced pearl. |
| `healthCost` | `1` | Health taken per blink when you carry no plain ender pearl; you never blink at or below it. |
| `taglockLevel` | `2` | Level from which a sneak hit tags a creature to swap places with. |
| `playerSwapLevel` | `3` | Level from which players can be tagged and swapped, where PvP is allowed. |
| `tagMillis` | `30000` | How long a tag waits for your next blink, in milliseconds. |

### Pocket Realm (`upgraded-rift-pocket-realm`)

3 levels · 15, 14 and 18 knowledge · Fuses Inflated Pocket Dimension, Void Magnet and Easy Enderchest

Sneak and left-click air with an empty main hand to open your ender chest anywhere, at most once per second.

While you sneak, item drops within 8, 10 or 12 blocks at levels 1, 2 and 3 are pulled into your ender chest every half second, 18, 24 or 30 separate drops per pulse. Drops that do not fit go to your inventory.

After you place a block, your hand is topped up with that block from your ender chest, up to a full stack. An empty hand is refilled as well.

#### Rift Anchors

Pocket Realm hands out two items, craftable only while you hold Pocket Realm:

- **Rift Anchor**: crying obsidian above and below a lodestone, an ender pearl on each side. Right-click a block to set the anchor (a lodestone) beside it. You can keep 2, 3 or 4 anchors at levels 1, 2 and 3, and only where you may build.
- **Rift Eye**: an eye of ender, crying obsidian and an amethyst shard. Right-click anywhere to open your anchor list.

Right-click one of your anchors (not sneaking) to open the list there. Other players' anchors do nothing for you.

- **Travel** (left-click): channel for 3, 2.5 or 2 seconds, then step onto that anchor. Taking damage breaks the channel. Each trip spends one plain ender pearl when you leave, and pays no Rift XP. The two blocks above the anchor must be clear.
- **Open Container** (right-click, from an anchor): opens the first container touching the other anchor, if you may open it there. The view closes if the container breaks or its chunk unloads.
- **Send Items Here** (shift-left-click, from an anchor): moves whole stacks from the containers touching your anchor into the containers touching the other one, up to 54 stacks, for one plain ender pearl per 4 stacks taken; a send that delivers nothing refunds its pearls. What does not fit goes back; what cannot go back drops on your anchor.

Opening and sending only work while you stand within 8 blocks of your own anchor. Anchors in another world or dimension can be reached from level 3.

An anchor you break drops its Rift Anchor item. An anchor broken by anyone else drops nothing, and you are told, at once or the next time you join. Explosions and withers leave anchors standing and pistons cannot move them. An anchor whose block disappears some other way is forgotten.

The Rift Eye is an ender eye that cannot be thrown, and Rift Gate never binds it.

Personal controls: Collection control (While sneaking/Automatic collection).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `openCooldownMillis` | `1000` | Time between two ender chest openings, in milliseconds. |
| `pullRadiusBase` | `6` | Drop pull radius before level scaling, in blocks; never above 16. |
| `pullRadiusPerLevel` | `2` | Drop pull radius added per level, in blocks. |
| `pullItemsBase` | `12` | Separate drops pulled per pulse before level scaling; never above 32. |
| `pullItemsPerLevel` | `6` | Separate drops pulled per pulse added per level. |
| `pullPulseTicks` | `10` | Ticks between two pull pulses; at least 2. |
| `refillAmount` | `64` | Most blocks moved into your hand after each placement. |
| `anchorsBase` | `1` | Rift Anchors you may place before level scaling; never above 16. |
| `anchorsPerLevel` | `1` | Rift Anchors added per level. |
| `channelMillisBase` | `3500` | Channel before an anchor trip, before level scaling, in milliseconds. |
| `channelMillisPerLevel` | `500` | Channel time taken off per level, in milliseconds; never below half a second. |
| `crossDimensionLevel` | `3` | Level from which anchors in other dimensions can be reached. |
| `pearlsPerTrip` | `1` | Plain ender pearls spent per anchor trip. |
| `stacksPerPearl` | `4` | Stacks sent between anchors per plain ender pearl. |
| `sendStacksMax` | `54` | Most stacks moved by one send. |

### Voidborn (`upgraded-rift-voidborn`)

3 levels · 13, 13 and 16 knowledge · Fuses Void Skin, Rift Visage and Anti-Levitation

A hit that would kill you is cancelled, one plain ender pearl is spent, and you blink to a safe spot 4 to 12 blocks away, or to the world spawn if none exists. You then gain Resistance IV for 4.5, 6 or 7.5 seconds at levels 1, 2 and 3. The escape recharges in 85, 70 or 55 seconds and shares its cooldown with Void Skin. With no plain pearl or the cooldown running, the hit lands.

Endermen never target you, with or without pearls in your inventory.

Pressing sneak while levitating removes Levitation and protects you from fall damage for 3 seconds. This can happen at most once every 3 seconds.

Personal controls: Death-save priority (First/Normal/Last).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `cooldownMillisBase` | `100000` | Escape cooldown before level scaling, in milliseconds. |
| `cooldownMillisPerLevel` | `15000` | Escape cooldown removed per level, in milliseconds. |
| `minimumCooldownMillis` | `30000` | Shortest escape cooldown at any level, in milliseconds. |
| `searchRadius` | `12` | Farthest an escape searches for a safe spot, in blocks; never above 16. |
| `minRadius` | `4` | Nearest an escape lands, in blocks. |
| `resistanceTicksBase` | `60` | Resistance after an escape before level scaling, in ticks. |
| `resistanceTicksPerLevel` | `30` | Resistance after an escape added per level, in ticks. |
| `resistanceAmplifier` | `3` | Resistance amplifier after an escape. |
| `levitationCooldownSeconds` | `3` | Time between two levitation releases, in seconds; the fall is protected for as long. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Rift](/adapt/27-skill-rift).
