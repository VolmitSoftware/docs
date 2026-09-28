---
title: "Skill - Rift"
description: "Rift XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-28T21:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Rift (`rift`) gains XP from teleporting, throwing ender pearls or eyes of ender, and fighting End creatures. Its 13 adaptations add short teleports, recall points, bouncing pearls, lethal-hit escape, remote storage, linked containers, item collection, targeted pearls, enderman protection, anti-levitation, and resistance after ender items are used.

## Earning XP

Every teleport increments `rift.teleports`. Teleport XP is cooldown-gated. Throwing an ender pearl or an eye of ender pays immediately, with no cooldown. Damage to endermen, endermites, and the ender dragon pays per point of damage, capped at the target's base health. Destroying an end crystal pays flat XP. Enderman kills and ender-dragon damage feed their own challenge chains.

## Adaptations

Anti-Levitation, Rift Visage, and Inflated Pocket Dimension are permanent. The menu asks for a confirmation before they are learned, and afterward they cannot be unlearned or refunded.

### Rift Resistance (`rift-resist`)

1 level · 5 knowledge

Right-clicking air with an eye of ender or an ender pearl in the main hand grants Resistance and 3 Rift XP. If Easy Enderchest is also learned, opening the ender chest from the hand grants Resistance for 10 ticks at amplifier 2.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `amplitude` | `1` | Resistance amplifier granted, so 1 means Resistance II. |
| `duration` | `80` | Resistance duration in ticks. |
| `activationCooldownMillis` | `4000` | Milliseconds between right-click-air activations and the XP they grant. |

### Remote Access (`rift-access`)

1 level · 15 knowledge

Crafting an ender pearl with a compass creates a Reliquary Portkey. Sneak-left-click binds a container, left-click air binds the container looked at within 5 blocks, and right-click opens it; the bind and every open run container permission checks, including both halves of a double chest, breaking, burning, pushing, or exploding the container closes an open session, and a Gloss preview neither binds nor opens it.

### Easy Enderchest (`rift-enderchest`)

1 level · 10 knowledge

A right-click on air, a left-click on air, or a left-click on a block, with an ender chest in the main hand, opens it and starts a 100-tick cooldown on that item; a click during the cooldown is cancelled. Learned Rift Resistance also applies Resistance for 10 ticks at amplifier 2.

### Rift Gate (`rift-gate`)

1 level · 30 knowledge

A sneak-left-click on a block with the crafted eye, made from an emerald, an amethyst shard, and an ender pearl, binds the current location; a sneak-left-click on air unbinds it, and a right-click starts an 85-tick channel with Blindness for 100 ticks and Levitation for 85 ticks. The eye and its cooldown are spent when the channel starts, so stowing or dropping the eye does not refund them, and a plain eye of ender can still be thrown to find a stronghold.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `consumeOnUse` | `true` | When true the bound eye is consumed by a completed teleport. When false the eye survives and a 150 tick cooldown gates reuse. |
| `requireCraftedEye` | `true` | When true only the crafted bound eye works and the recipe is registered. When false any eye of ender can be bound. |

### Rift Blink (`rift-blink`)

5 levels · 1 knowledge, then 7 per level

In Manual mode, a second mid-air jump in Survival blinks along your look direction without consuming a pearl. Use the controls at the bottom of Blink's level screen to choose how it works. Your choices affect only your player and remain saved when you change learned levels.

| Control | Choices | Default / unlock |
|---|---|---|
| Enabled | On / Off | On, level 1 |
| Phasing | Hold sneak / Aim only / Never | Hold sneak, level 1 |
| Landing preference | Distance / Verticality | Distance, level 1 |
| Activation | Manual / Reactive | Manual; Reactive unlocks at level 2 |
| Reactive direction | Look direction / Away from attacker | Look direction; shown only at level 2+ in Reactive mode |

Hold sneak uses the normal obstacle-stopping blink unless you are sneaking. Aim only permits phasing along your look direction without holding sneak. Never always stops at obstacles. The server's `allowPhasing` setting overrides all three choices.

Distance chooses the farthest usable landing along the chosen direction, with normal mantling onto a hit ledge when phasing is off. Verticality prefers higher usable landings near that line, within `verticalSearchHeight` and the same total range; ties prefer distance. With phasing off, raised landings must have a clear line of sight. Open-air landings can still leave you falling. Only loaded destinations available to the current region are considered.

Reactive replaces double-jump activation. A direct melee, sweep, or projectile hit triggers a blink when ready. The default direction is where you are looking; Away from attacker moves horizontally away from the attack source and falls back to look direction when that source is unavailable. Environmental damage, thorns, and Blink's own pearl damage do not trigger a reaction.

A successful reactive blink avoids the triggering attack and pays normal Blink self-damage. If no usable destination exists or the teleport is refused, the attack still hurts you. Manual and Reactive share a cooldown; changing a preference does not reset it. Further hits while a teleport is pending are not automatically dodged.

Range is `baseDistance + (levelPercent * distanceFactor)`. Self-damage is `pearlDamageBase - ((level - 1) * pearlDamageReductionPerLevel)`, floored at `minimumPearlDamage`. The server controls these values and can lock any player preference or restrict its choices through [player preference policy](/adapt/01-installation-configuration#player-preferences).

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldownMillis` | `2000` | Milliseconds between successful blinks, shared by both activation modes. |
| `pearlDamageBase` | `5.0` | Self-damage at level 1, in health points (2 = 1 heart). |
| `pearlDamageReductionPerLevel` | `1.0` | Self-damage removed per level past the first. |
| `minimumPearlDamage` | `1.0` | Minimum Blink self-damage. |
| `baseDistance` | `12` | Range before the level bonus. |
| `distanceFactor` | `20` | Additional range at maximum level. Total range is bounded to 128 blocks. |
| `groundSnapDepth` | `5` | Downward search for solid ground, bounded to 0-32 blocks. |
| `momentumCarry` | `0.35` | Velocity along the chosen blink direction after landing. |
| `minBlinkDistance` | `1.5` | Minimum accepted travel distance in blocks, at least 0.5. |
| `allowPhasing` | `true` | Allows obstacle traversal when the effective phasing preference requests it. |
| `verticalSearchHeight` | `6` | Extra upward search for Verticality, bounded to 0-16 blocks. |

### Anti-Levitation (`rift-descent`)

1 level · 3 knowledge

Sneaking while levitating removes Levitation and sets the fall-damage multiplier to -1 for `cooldown * 20` ticks. Fall speed does not change.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `5.0` | Seconds between uses, and also the length of the fall damage protection. |

### Rift Visage (`rift-visage`)

1 level · 2 knowledge

An enderman does not target a player who has at least one ender pearl anywhere in the inventory.

### Ender Taglock (`rift-ender-taglock`)

3 levels · 7 knowledge

Sneak-hitting with a plain ender pearl in the main hand tags an entity and deals no damage; throwing that pearl teleports the target, not the thrower. Level 1 tags passive and hostile mobs, level 2 adds villagers and large targets, level 3 tags any entity including players, and the throw cooldown floors at 4 ticks.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `throwCooldownTicksBase` | `30` | Cooldown between tagged pearl throws before the level reduction, in ticks. |
| `throwCooldownTicksFactor` | `14` | Cooldown ticks removed at max level. |
| `suppressPearlTeleportWindowMillis` | `250` | How long the thrower's own vanilla pearl teleport stays suppressed after a taglocked pearl lands. |
| `largeWidthThreshold` | `1.3` | Hitbox width in blocks at or above which a target counts as large for level 2. |
| `largeHeightThreshold` | `2.35` | Hitbox height in blocks at or above which a target counts as large for level 2. |
| `xpOnTag` | `8` | Rift XP granted for tagging an entity. |
| `xpOnThrow` | `5` | Rift XP granted for throwing a tagged pearl. |
| `xpOnTeleport` | `14` | Rift XP granted when a tagged target is relocated. |
| `damageSender` | `true` | When true the thrower takes the pearl teleport damage. When false the teleported target takes it instead. |

### Inflated Pocket Dimension (`rift-inflated-pocket-dimension`)

1 level · 7 knowledge

With an empty main hand, right-clicking a block, or right-clicking or left-clicking air at the block looked at within 5 blocks, pulls that block from the ender chest; while placing, a low stack refills up to `buildRefillAmount` or the item's max stack, whichever is smaller. A sneak-drop stores the item in the ender chest instead of dropping it.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `buildRefillAmount` | `64` | Items pulled from the ender chest to top up the held stack while building. |
| `rightClickPullAmount` | `64` | Items pulled per right-click on a block. |
| `xpPerTransferredItem` | `0.08` | Rift XP granted per item stored into the ender chest by a sneak-drop. Pulls and build refills award no XP. |

### Void Magnet (`rift-void-magnet`)

5 levels · 4 knowledge

Sneaking pulls nearby item drops into the ender chest on a repeating pulse. Radius is capped at 16 blocks, items per pulse at 32, and the pulse delay floors at 2 ticks; an item the player could not pick up by hand stays on the ground.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `allowEnderChestOverflow` | `false` | When true, items that do not fit in the ender chest go to your normal inventory. When false they stay on the ground. |
| `radiusBase` | `5` | Magnet radius in blocks before the level bonus. |
| `radiusFactor` | `9` | Magnet radius in blocks added at max level. |
| `maxItemsBase` | `10` | Item drops pulled per pulse before the level bonus. |
| `maxItemsFactor` | `22` | Item drops per pulse added at max level. |
| `pulseTicksBase` | `20` | Ticks between pulses before the level reduction. |
| `pulseTicksFactor` | `12` | Ticks removed from the pulse delay at max level. |
| `xpPerMovedItem` | `0.7` | Rift XP granted per item moved. |

### Void Skin (`rift-void-skin`)

4 levels · 6 knowledge, then 8 per level

A hit that would reduce health plus absorption to zero or below is cancelled, spends one plain ender pearl, and blinks the player to a safe spot or, if none exists, to the current world spawn; the search radius is clamped to 3-16 blocks. With no plain pearl, a cooldown still running, or no usable world spawn, the hit lands.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldownBaseMillis` | `120000` | Milliseconds between escapes at level 1. |
| `cooldownReductionPerLevelMillis` | `18000` | Cooldown milliseconds removed per level past the first. |
| `minimumCooldownMillis` | `45000` | Floor on the escape cooldown, in milliseconds. |
| `resistanceTicksBase` | `60` | Resistance duration after an escape before the level bonus, in ticks. |
| `resistanceTicksPerLevel` | `20` | Resistance ticks added per level. |
| `resistanceAmplifier` | `2` | Resistance amplifier applied after an escape, so 2 means Resistance III. |
| `searchRadius` | `9` | Horizontal search radius for a safe blink spot, in blocks. |
| `minRadius` | `4` | Shortest horizontal blink distance, in blocks. |
| `xpOnEscape` | `40` | Rift XP granted when an escape triggers. |

### Pearl Rebound (`rift-pearl-rebound`)

4 levels · 3 knowledge, then 5 per level

Only a plain ender pearl rebounds, and only once; a pearl already claimed by another Rift adaptation teleports as usual. Damage reduction and aim bias both cap at 0.9.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `damageReductionBase` | `0.3` | Fraction of pearl teleport damage removed at level 1, 0-1. |
| `damageReductionPerLevel` | `0.15` | Extra damage reduction fraction per level past the first. |
| `aimBiasBase` | `0.3` | Fraction the rebounded pearl steers toward your look direction at level 1, 0-1. |
| `aimBiasPerLevel` | `0.15` | Extra steering fraction per level past the first. |
| `reboundSpeed` | `1.5` | Launch speed of the rebounded pearl, in blocks per tick. Floor is 0.4. |
| `xpOnRebound` | `6` | Rift XP granted each time a pearl rebounds. |

### Rift Conduit (`rift-conduit`)

4 levels · 8 knowledge

A plain ender pearl sneak-right-clicked on a container becomes a conduit taglock, and right-clicking a second container links the pair. Items move when either container closes, both ends re-check container permissions, and rejected items return to the source; throughput is clamped to 1-1152 items, range to 512 blocks, a miss only prints a hint, a plain pearl captures a source only on a sneak-click, and the taglock cannot be thrown without this adaptation.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `throughputBase` | `48` | Items moved per flow before the level bonus. |
| `throughputFactor` | `336` | Items per flow added at max level. |
| `rangeBase` | `24` | Binding range in blocks before the level bonus. |
| `rangeFactor` | `200` | Binding range in blocks added at max level. |
| `crossDimensionAtMax` | `true` | Allows linking containers in different worlds once the adaptation is at max level. |
| `xpOnLink` | `30` | Rift XP granted when a new link is formed. |
| `xpPerFlow` | `0.4` | Rift XP granted per item flowed between linked containers. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/rift.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole Rift skill off when false. |
| `skillColor` | `"&5"` | Legacy ampersand color code used for this skill in menus and text. |
| `throwEnderpearlXP` | `65` | XP granted per ender pearl thrown. |
| `throwEnderEyeXP` | `30` | XP granted per eye of ender thrown. |
| `teleportXP` | `15` | XP granted per teleport, subject to the teleport cooldown. |
| `teleportXPCooldown` | `60000` | Milliseconds between teleport XP awards. The stat still counts every teleport. |
| `destroyEndCrystalXP` | `250` | XP granted for destroying an end crystal. |
| `damageEndermanXPMultiplier` | `4` | XP per point of damage dealt to endermen. |
| `damageEndermiteXPMultiplier` | `2` | XP per point of damage dealt to endermites. |
| `damageEnderdragonXPMultiplier` | `8` | XP per point of damage dealt to the ender dragon. |
| `challengeRiftReward` | `500` | Base XP reward for every Rift challenge chain. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_rift_50` | 50 | `challengeRiftReward` |
| `challenge_rift_500` | 500 | `challengeRiftReward` x 2 |
| `challenge_rift_5k` | 5000 | `challengeRiftReward` x 5 |
| `challenge_rift_pearls_50` | 50 | `challengeRiftReward` |
| `challenge_rift_pearls_500` | 500 | `challengeRiftReward` x 2 |
| `challenge_rift_enderman_50` | 50 | `challengeRiftReward` |
| `challenge_rift_enderman_500` | 500 | `challengeRiftReward` x 2 |
| `challenge_rift_dragon_500` | 500 | `challengeRiftReward` |
| `challenge_rift_dragon_5k` | 5000 | `challengeRiftReward` x 2 |
| `challenge_rift_crystal_10` | 10 | `challengeRiftReward` |
| `challenge_rift_crystal_100` | 100 | `challengeRiftReward` x 2 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
