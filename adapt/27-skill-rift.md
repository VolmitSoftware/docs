---
title: "Skill - Rift"
description: "Rift XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Rift gains XP from teleporting, throwing ender pearls or eyes, and fighting End creatures. Its id is `rift`, and it has 13 adaptations.

Adaptations add short teleports, recall points, bouncing pearls, lethal-hit escape, remote storage, linked containers, item collection, targeted pearls, enderman protection, anti-levitation, and resistance after using ender items.

## Earning XP

Every teleport counts toward the `rift.teleports` stat. It grants XP on a long cooldown so repeat pearling does not farm the skill. Throwing an ender pearl or an eye of ender pays out immediately with no cooldown. Pearls are the biggest single source in the skill.

Damaging endermen, endermites, and the ender dragon pays XP scaled by the damage dealt. The payout is capped at the target's base health so one huge hit cannot overpay. Destroying an end crystal pays a large flat amount. Killing endermen and damaging the dragon feed their own challenge chains.

## Adaptations

All of this needs the adaptation learned to level 1 or higher from the Adapt menu (`/adapt`), the skill and the adaptation enabled, a world and game mode that are not blocked, and the `adapt.use.<adaptation>` permission. See [08 - Protection & Region Policy](/adapt/08-protection-region-policy) and [04 - Commands & Permissions](/adapt/04-commands-permissions).

Anti-Levitation, Rift Visage, and Inflated Pocket Dimension are marked permanent. The menu asks for a confirmation click before you learn them. After that they cannot be unlearned or refunded.

### Rift Resistance (`rift-resist`)

1 level · 5 knowledge

Using an ender item gives you a short burst of Resistance. That burst covers the
moment right after a pearl lands, when you are usually most exposed.

1. Learn it and hold an ender pearl or an eye of ender in your main hand.
2. Right-click air. You get Resistance II for four seconds and a little XP.
3. Wait out the short activation throttle before it can trigger again.

Easy Enderchest also grants a brief, stronger Resistance pulse when you open your chest from hand, if you have learned this adaptation too.

Triggers only on right-click air with `ENDER_EYE` or `ENDER_PEARL` in the main hand, granting Resistance at amplifier `amplitude` for `duration` ticks plus 3 XP. The Easy Enderchest pulse is 10 ticks at amplifier 2, despite what the menu lore says.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `amplitude` | `1` | Resistance amplifier granted, so 1 means Resistance II. |
| `duration` | `80` | Resistance duration in ticks. |
| `activationCooldownMillis` | `4000` | Milliseconds between right-click-air activations and the XP they grant. |

### Remote Access (`rift-access`)

1 level · 15 knowledge

Remote Access gives you a crafted portkey bound to one container. After that you can open that container from anywhere, so a base chest is always one right-click away.

1. Learn it, then craft an ender pearl with a compass to get a Reliquary Portkey.
2. Sneak-left-click the container you want to bind. Left-clicking air binds the container you are looking at within 5 blocks.
3. Right-click the portkey anywhere to open that container remotely.

Gloss container previews work while holding a Portkey. Looking at the preview does not bind or activate it; use the gestures above.

Binding and every remote open run the full container permission checks, including both halves of a double chest, so it never opens something you could not open by hand. Breaking, burning, pushing, or blowing up the container closes an open session. No adaptation-specific config knobs.

### Easy Enderchest (`rift-enderchest`)

1 level · 10 knowledge

Hold an ender chest and click to open it without placing the block. That is the whole feature, and it saves a placement and a pickup every single time.

1. Learn it and hold an ender chest in your main hand.
2. Right-click air, left-click air, or left-click a block.
3. Your ender chest opens. The item goes on a five second cooldown afterward.

Triggers on right-click air, left-click air, or left-click block with `ENDER_CHEST` in the main hand. A successful use sets a 100 tick cooldown on the ender chest item. Clicking during the cooldown cancels the interaction. If `rift-resist` is learned, a 10 tick amplifier 2 Resistance pulse is applied. No adaptation-specific config knobs.

### Rift Gate (`rift-gate`)

1 level · 30 knowledge

Rift Gate is a recall stone. Bind a location to a crafted eye, then use it later to channel back there. The channel is slow and blinds you on purpose. You float in place, visible and
vulnerable. If something kills you during it you die normally.

1. Learn it and craft an emerald, an amethyst shard, and an ender pearl into a recall gate eye.
2. Sneak-left-click a block to bind your current location to the eye.
3. Right-click the eye to start the channel. After a bit over four seconds you teleport.
4. Sneak-left-click air with a bound eye to unbind it.

By default the eye is consumed on use, so each gate is a one-shot ticket. Turn that off and the eye survives, with a cooldown between uses instead.

Channel length is 85 ticks, with Blindness for 100 ticks and Levitation for 85. The eye and the cooldown are both spent the moment the channel starts, so stowing or dropping the eye mid-channel does not refund it. A plain eye of ender can still be thrown to locate a stronghold. Cooldown when `consumeOnUse` is false is 150 ticks.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `consumeOnUse` | `true` | When true the bound eye is consumed by a completed teleport. When false the eye survives and a 150 tick cooldown gates reuse. |
| `requireCraftedEye` | `true` | When true only the crafted bound eye works and the recipe is registered. When false any eye of ender can be bound. |

### Rift Blink (`rift-blink`)

5 levels · 1 knowledge, then 7 per level

Blink is a free short-range teleport on a double jump. Aim at the ground to land there, at a ledge to pull yourself onto it, or at open air to dash. It costs no pearl, but you take the normal pearl landing damage, which drops as you level. It only works in survival mode.

1. Learn it, then jump.
2. Press jump again in mid-air while looking where you want to go.
3. Hold sneak as you do it to phase straight through walls and land in the farthest open space in range.

Distance is `baseDistance + (levelPercent * distanceFactor)`. Self damage is `pearlDamageBase - ((level - 1) * pearlDamageReductionPerLevel)`, floored at `minimumPearlDamage`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldownMillis` | `2000` | Milliseconds between successful blinks. |
| `pearlDamageBase` | `5.0` | Self damage at level 1, in health points (2 = 1 heart). |
| `pearlDamageReductionPerLevel` | `1.0` | Self damage removed per level past the first. |
| `minimumPearlDamage` | `1.0` | Floor on blink self damage. |
| `baseDistance` | `12` | Blink distance in blocks before the level bonus. |
| `distanceFactor` | `20` | Blink distance in blocks added at max level. |
| `groundSnapDepth` | `5` | Blocks searched downward from the aimed point to prefer solid ground. |
| `momentumCarry` | `0.35` | Velocity carried along your look direction after landing, in blocks per tick. |
| `minBlinkDistance` | `1.5` | Shortest distance that still counts as a blink, in blocks. |
| `phaseWhileSneaking` | `true` | Lets a blink started while sneaking pass through walls and land in the farthest open space in range. |

### Anti-Levitation (`rift-descent`)

1 level · 3 knowledge

Shulker hits are annoying because the levitation lifts you and the fall afterward hurts. Tap sneak while levitating and Anti-Levitation strips the effect. It shields you
from fall damage for the next few seconds. You come straight back down safely.

1. Learn it (it is permanent once learned).
2. While levitating, tap sneak.
3. Levitation ends and your fall damage is nullified for the duration of the cooldown.

Removes Levitation and applies a `FALL_DAMAGE_MULTIPLIER` modifier of -1.0 for `cooldown * 20` ticks, nullifying fall damage for that window. It is not Slow Falling and does not change your fall speed, despite what the adaptation description says.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldown` | `5.0` | Seconds between uses, and also the length of the fall damage protection. |

### Rift Visage (`rift-visage`)

1 level · 2 knowledge

While you have at least one ender pearl anywhere in your inventory, endermen never take you as a target. Look at them all you like. It works on its own once learned, and it is permanent.

An enderman cannot target a player carrying at least one `ENDER_PEARL`. No adaptation-specific config knobs.

### Ender Taglock (`rift-ender-taglock`)

3 levels · 7 knowledge

Taglock inverts the ender pearl. Instead of teleporting yourself, you bind a pearl to something else and throw it to move that thing. The tagging hit deals no damage.

1. Learn it and hold a plain ender pearl in your main hand.
2. Sneak and hit the entity you want to tag. The pearl becomes a Taglocked Ender Pearl showing its target.
3. Right-click to throw the pearl. Wherever it lands, the tagged target is teleported there. You are never teleported.

Level 1 tags passive and hostile mobs. Level 2 adds villagers and large targets. Level 3 tags anything, including players. By default the thrower eats the pearl teleport damage rather than the victim.

Tagging needs a plain `ENDER_PEARL` in the main hand. Target eligibility by level: 1 covers passive and hostile mobs, 2 adds villagers and targets above the large size thresholds, 3 covers everything including players. Throw cooldown is `throwCooldownTicksBase - (levelPercent * throwCooldownTicksFactor)` with a floor of 4 ticks. Your own vanilla pearl teleport is suppressed briefly after a taglocked pearl lands.

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

Your ender chest becomes a live building supply. It is the difference between one trip to build a bridge and six.

1. Learn it (it is permanent once learned).
2. With an empty main hand, right-click a block to pull a stack of that same block out of your ender chest.
3. Keep building. When a stack in your hand runs low, placing blocks refills it from the ender chest automatically.
4. Sneak and drop an item to send it into the ender chest instead of the ground.

The pull needs an empty main hand and works on right-click block, right-click air, or left-click air; air variants use the block you are looking at within 5 blocks. Build refill tops the held stack back up to `buildRefillAmount` or the material's max stack size, whichever is smaller.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `buildRefillAmount` | `64` | Items pulled from the ender chest to top up the held stack while building. |
| `rightClickPullAmount` | `64` | Items pulled per right-click on a block. |
| `xpPerTransferredItem` | `0.08` | Rift XP granted per item stored into the ender chest by a sneak-drop. Pulls and build refills award no XP. |

### Void Magnet (`rift-void-magnet`)

5 levels · 4 knowledge

Hold sneak and nearby item drops start flowing to you on a pulse, straight into your ender chest. It is built for mining, farming, and mob grinders where the drops are spread over a wide area. Leveling widens the radius, raises the items per pulse, and shortens the pulse delay.

1. Learn it.
2. Sneak and stay sneaking. The magnet pulses on a timer while you hold it.
3. Items land in your ender chest. By default anything that does not fit stays on the ground. A config switch lets the leftovers spill into your normal inventory.

Radius caps at 16 blocks and 32 items per pulse, and the pulse delay floors at 2 ticks. Anything you could not pick up by hand stays on the ground.

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

Void Skin is a death save. Any hit that would kill you is cancelled. You are blinked to a nearby safe spot
instead. Brief Resistance helps you survive whatever comes next. It costs one plain ender pearl from your inventory and has a long cooldown that shortens as you level. If no safe spot is found nearby it falls back to the current world's spawn. With no plain pearl on you, or with the cooldown still running, the hit lands normally.

Triggers when the damage would exceed your current health plus absorption, and consumes a plain ender pearl from your inventory. The safe-spot search radius is clamped to 3-16 blocks. With no safe spot it falls back to the world spawn, and with no usable world spawn the escape is skipped and the damage lands.

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

A thrown pearl no longer commits at the first thing it hits. The first block it strikes bounces it off the surface, steered toward wherever you are looking, and the pearl teleports you at its next impact. That lets you bank pearls around corners and through gaps you cannot see through. Pearl landing damage is also reduced, and both the reduction and the steering improve with level.

Only plain ender pearls rebound, and only once each: pearls already claimed by another Rift adaptation, or already rebounded, teleport normally. The bounce reflects the pearl off the struck block face, biases it toward the thrower's look direction, and relaunches it at `reboundSpeed`. Damage reduction and aim bias are both capped at 0.9 in code.

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

Conduit links two containers so items move between them on their own. Dump loot into the chest by your farm and it appears in the sorting chest at your base.

1. Learn it and hold a plain ender pearl.
2. Sneak-right-click the source container. The pearl becomes a Rift Conduit Taglock.
3. Right-click a second container with the taglock to link the pair.
4. Put items in one container and close it. They flow to the partner.

Binding range grows a long way with level, and at max level the two containers can sit in different dimensions. Both ends re-check container permissions on every flow, and anything the partner cannot accept comes straight back to the source.

A taglock in hand binds when it clicks a container and prints a hint when it does not. A plain pearl only captures when you sneak-click a container. A taglock held by someone without the adaptation cannot be thrown. Throughput is clamped to 1-1152 items and binding range to at most 512 blocks.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
