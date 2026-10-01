---
title: "Skill - Enchanting"
description: "Enchanting XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T09:26:23.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Enchanting gains XP when a player enchants an item, scaled by the total enchantment power applied. Its 14 adaptations refund lapis or experience, lower anvil costs, preview and reroll offers, add bookshelf power, apply books directly, transfer enchantments, and protect a linked item on death.

## Player controls

Every adaptation has an Enabled control in its level screen. These controls change only your player data; the server controls permitted values, defaults and locks. Personal settings never bypass learned levels, permissions, costs, cooldowns or server limits.

| Adaptation | Additional controls |
|---|---|
| Arcane Siphon (`enchanting-arcane-siphon`) | `books`: Siphoned books; `bonus-xp`: Bonus skill XP; `player-victims`: Player victims |
| Bookshelf Attunement (`enchanting-bookshelf-attunement`) | `power`: Virtual bookshelf contribution |
| Curse Cleansing (`enchanting-curse-cleansing`) | `confirmation`: Confirm curse removal |
| Echo of Knowledge (`enchanting-echo-of-knowledge`) | `sneak`: Require sneak to charge |
| Grindstone Recovery (`enchanting-grindstone-recovery`) | `books`: Recovered books; `bonus-xp`: Bonus vanilla XP |
| Infusion Transfer (`enchanting-infusion-transfer`) | `confirmation`: Confirm sacrifice risk |
| Offer Reroll (`enchanting-offer-reroll`) | `confirmation`: Confirm paid reroll; `xp-reserve`: XP level reserve; `lapis-reserve`: Lapis reserve |
| Quick-Click Enchant (`enchanting-quick-enchant`) | `confirmation`: Confirm book application; `modified-click`: Require right click |
| Rune Sight (`enchanting-rune-sight`) | `full-details`: Full offer details |
| Soul Link (`enchanting-soul-link`) | `confirmation`: Confirm item linking; `xp-reserve`: XP level reserve |
| Tome Rebinding (`enchanting-tome-rebinding`) | `confirmation`: Confirm lossy split; `sneak`: Require sneak-drop |

Reserve choices are 0, 5 or 10 XP levels or lapis items, as labeled. A reserve declines an action that would spend below it and never discounts the cost. Soul Link also checks its reserve when rescuing an item. Confirmations require repeating the same action on the same items within five seconds; no paid result is previewed. Quick Enchant can require right-click instead of left-click. Siphon and Grindstone Recovery keep their original roll and cooldown when one reward is suppressed. Compact Rune Sight shows the first earned offer only.

Toggle defaults preserve existing behavior. Size and rate presets default to Full; material, ore and structure filters default to their existing selection. Confirmation, additional gesture restrictions and reserves are off by default. Server policies are configured as `[playerPreferences.<control-id>]` in the adaptation’s TOML file.

## Adaptations

### Quick-Click Enchant (`enchanting-quick-enchant`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-quick-enchant-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-quick-enchant-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 8 knowledge, then 6 per level

Left-click one enchanted book from the cursor onto one non-book item in a container, armor, or hotbar slot to move compatible enchantments with no anvil, level cost, or prior-work penalty; conflicts stay on the book, an emptied book is consumed, and a result over the power cap does nothing. The cap is `level` until `level` exceeds `maxPowerBonusLimit`, then `level + (level / maxPowerBonus1PerLevels)`, and a success awards 50 skill XP plus 320 per enchantment level moved.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxPowerBonusLimit` | `4` | Adaptation level above which the bonus power term starts applying. |
| `maxPowerBonus1PerLevels` | `3` | Adaptation levels per extra point of allowed combined power. |

### Lapis Return (`enchanting-lapis-return`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-lapis-return-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-lapis-return-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 2 knowledge, then 5 per level

After a committed table enchant, chance `min(maxRefundChance, refundChanceBase + levelPercent * refundChanceFactor)` is rolled before the hardcoded 20000 ms cooldown, so a success inside that window is wasted. A success adds a lapis stack equal to the adaptation level to the inventory and drops only overflow.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `refundChanceBase` | `0.1` | Refund chance at level 0 progress, 0-1. |
| `refundChanceFactor` | `0.2` | Extra refund chance added at full level, 0-1. |
| `maxRefundChance` | `0.4` | Hard ceiling on refund chance, 0-1. |

### XP Return (`enchanting-xp-return`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-xp-return-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-xp-return-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

7 levels · 2 knowledge, then 1 per level

Each committed enchant can return one vanilla XP orb of `min(maximumXpPerEnchant, vanillaXpAtLevelOne + (level - 1) * vanillaXpPerAdditionalLevel)` points, `2 + 4 * (level - 1)` or 2 through 26 on the defaults. The amount is fixed, not a percentage of the enchant's level cost.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `vanillaXpAtLevelOne` | `2` | Vanilla XP points returned at adaptation level one. |
| `vanillaXpPerAdditionalLevel` | `4` | XP points added for every level after level one. |
| `maximumXpPerEnchant` | `32` | Hard cap on one enchant refund. |
| `cooldownMillis` | `30000` | Minimum milliseconds between refunds for one player. |

### Anvil Savant (`enchanting-anvil-savant`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-anvil-savant-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-anvil-savant-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 5 knowledge

Anvil combine, repair, and rename costs become `max(minimumCost, ceil(oldCost * (1 - reduction)))`, where reduction is `min(maximumReduction, reductionBase + levelPercent * reductionFactor)`. The saved-levels stat records only when the result is taken from the output slot.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `reductionBase` | `0.08` | Cost reduction at level 0 progress, 0-1. |
| `reductionFactor` | `0.37` | Extra cost reduction added at full level, 0-1. |
| `maximumReduction` | `0.65` | Hard ceiling on cost reduction, 0-1. |
| `minimumCost` | `1` | Lowest anvil level cost the reduction may produce. |

### Offer Reroll (`enchanting-offer-reroll`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-offer-reroll-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-offer-reroll-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 4 knowledge

Sneak-right-click an enchanting table with the main hand, or sneak-right-click air while looking at one within 5 blocks, to reshuffle that player's enchantment seed. Lapis cost is `max(1, round(lapisCostBase - levelPercent * lapisCostFactor))`, the `ENCHANTING_TABLE` item cooldown is `max(20, round(cooldownTicksBase - levelPercent * cooldownTicksFactor))` ticks, and a failure, including a server build with no seed setter, refunds the lapis and XP levels.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `lapisCostBase` | `4` | Lapis consumed per reroll at level 0 progress. |
| `lapisCostFactor` | `2` | Lapis removed from that cost at full level. |
| `cooldownTicksBase` | `320` | Reroll cooldown at level 0 progress, in server ticks (20 = 1 second). |
| `cooldownTicksFactor` | `220` | Ticks removed from the cooldown at full level. |
| `xpLevelCost` | `1` | Vanilla XP levels charged per reroll, flat at all levels. |
| `xpGainOnReroll` | `15` | Enchanting skill XP granted per successful reroll. |

### Bookshelf Attunement (`enchanting-bookshelf-attunement`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-bookshelf-attunement-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-bookshelf-attunement-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 3 knowledge, then 4 per level

Offers gain `max(1, round(powerBase + levelPercent * powerFactor))` virtual bookshelf power: cost becomes `min(30, cost + power)` and enchantment level becomes `min(enchantMax, level + power / 3)`, never below 1.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `powerBase` | `1` | Virtual bookshelf power at level 0 progress. |
| `powerFactor` | `5` | Virtual bookshelf power added at full level. |

### Grindstone Recovery (`enchanting-grindstone-recovery`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-grindstone-recovery-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-grindstone-recovery-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Disenchanting can return one random enchantment from an enchanted input as a book, plus `round(min(maximumBonusXp, bonusXpBase + levelPercent * bonusXpFactor))` vanilla XP on top of the usual grindstone payout, then starts a `GRINDSTONE` cooldown of `max(minimumCooldownTicks, round(cooldownTicksBase - levelPercent * cooldownTicksFactor))` ticks at chance `min(maxRecoverChance, recoverChanceBase + levelPercent * recoverChanceFactor)`. Sneaking lets Curse Cleansing take the click instead, and the book level is clamped to the enchantment maximum.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `recoverChanceBase` | `0.1` | Recovery chance at level 0 progress, 0-1. |
| `recoverChanceFactor` | `0.25` | Extra recovery chance added at full level, 0-1. |
| `maxRecoverChance` | `0.35` | Hard ceiling on recovery chance, 0-1. |
| `bonusXpBase` | `1` | Vanilla experience points granted at level 0 progress. |
| `bonusXpFactor` | `4` | Extra vanilla experience points granted at full level. |
| `maximumBonusXp` | `8` | Hard cap on one vanilla XP recovery reward. |
| `cooldownTicksBase` | `200` | Recovery cooldown at level 0 progress, in server ticks. |
| `cooldownTicksFactor` | `80` | Ticks removed from the cooldown at full level. |
| `minimumCooldownTicks` | `40` | Hard floor for the recovery cooldown. |
| `skillXpOnRecovery` | `8` | Enchanting skill XP granted per recovery. |

### Curse Cleansing (`enchanting-curse-cleansing`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-curse-cleansing-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-curse-cleansing-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

4 levels · 5 knowledge

Sneak-click a grindstone result, with the other input empty or not, to consume one cursed input and return a cleaned stack of 1 that keeps its name, damage, and custom data, removing only `BINDING_CURSE` and `VANISHING_CURSE` from item enchantments or stored book enchantments. Skill XP is `skillXpPerCurse * cursesRemoved`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `skillXpPerCurse` | `30` | Enchanting skill XP granted for each curse removed. |

### Tome Rebinding (`enchanting-tome-rebinding`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-tome-rebinding-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-tome-rebinding-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge, then 5 per level

Dropping exactly one book that stores two or more enchantments, while looking at an anvil, chipped anvil, or damaged anvil within 5 blocks and without opening it, splits that book in place into single-enchant books that keep their motion, pickup delay, and stored levels, including levels above the vanilla maximum. Loss chance is `max(0, lossChanceBase - levelPercent * lossChanceFactor)` and applies only while more than one enchantment remains; level cost is `max(minXpCost, round(xpCostBase - levelPercent * xpCostFactor))`, and too few levels or a dropped stack of two or more leaves the book unchanged.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `lossChanceBase` | `0.9` | Chance to lose one enchantment at level 0 progress, 0-1. |
| `lossChanceFactor` | `1.0` | Loss chance subtracted at full level, 0-1. |
| `xpCostBase` | `5` | Vanilla XP levels charged at level 0 progress. |
| `xpCostFactor` | `3` | XP levels removed from that cost at full level. |
| `minXpCost` | `2` | Lowest XP level cost the scaling may produce. |
| `skillXpOnSplit` | `14` | Enchanting skill XP granted per book produced. |

### Soul Link (`enchanting-soul-link`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-soul-link-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-soul-link-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 6 knowledge

Sneak-right-click an anvil block while holding an enchanted item or book in the main hand to store one `adapt:soul-link-token` on it, replacing any previous link, with re-mark cooldown `max(minRemarkCooldown, round(remarkCooldownBase - levelPercent * remarkCooldownFactor))` ms. On death the item is removed from drops and returned on respawn, or one second after the next join, at `max(minSaveCost, round(saveCostBase - levelPercent * saveCostFactor))` levels taken from kept levels or from dropped XP at 7 XP per level; keep-inventory deaths are skipped, and too few levels lets the item drop normally.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `saveCostBase` | `8` | XP levels charged on save at level 0 progress. |
| `saveCostFactor` | `5` | XP levels removed from that cost at full level. |
| `minSaveCost` | `2` | Lowest XP level cost the scaling may produce. |
| `remarkCooldownBase` | `60000` | Milliseconds between marks at level 0 progress. |
| `remarkCooldownFactor` | `45000` | Milliseconds removed from that cooldown at full level. |
| `minRemarkCooldown` | `8000` | Shortest re-mark cooldown in milliseconds. |
| `skillXpOnSave` | `40` | Enchanting skill XP granted when a saved item is returned. |

### Arcane Siphon (`enchanting-arcane-siphon`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-arcane-siphon-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-arcane-siphon-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

A credited kill of a living entity wearing or holding enchanted gear, not a `/kill` and not spawn-method dependent, pays `bonusXpPerEnchant * distinctEnchantCount` whether or not a book drops, scanning helmet, chestplate, leggings, boots, and both hands and keeping the highest level of duplicates. Drop chance is `min(maxDropChance, dropChanceBase + levelPercent * dropChanceFactor)` and book level is the source level plus `floor(levelPercent * qualityFactor)`, clamped to the enchantment maximum; player victims qualify only at this adaptation's maximum level, and normal PVP policy still applies.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `dropChanceBase` | `0.12` | Book drop chance at level 0 progress, 0-1. |
| `dropChanceFactor` | `0.4` | Extra drop chance added at full level, 0-1. |
| `maxDropChance` | `0.5` | Hard ceiling on book drop chance, 0-1. |
| `qualityFactor` | `2` | Enchantment levels added to the siphoned book at full level. |
| `bonusXpPerEnchant` | `12` | Enchanting skill XP per distinct enchantment on the victim's gear. |

### Rune Sight (`enchanting-rune-sight`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-rune-sight-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-rune-sight-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 3 knowledge

Hidden enchanting-table offers are shown on the action bar as name, level, and cost, to a depth of `max(1, min(maxRevealDepth, 1 + floor(levelPercent * (maxRevealDepth - 1))))`. With the default depth, level 1 shows the top offer and level 3 shows all three.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxRevealDepth` | `3` | Offers revealed at full level. |
| `revealThrottleMs` | `400` | Minimum milliseconds between actionbar reveals. |

### Infusion Transfer (`enchanting-infusion-transfer`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-infusion-transfer-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-infusion-transfer-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 6 knowledge

With an empty cursor and without sneaking, right-click the left anvil slot, which cannot be a book, to move the donor's highest-level enchantment that the base can hold and does not already have, ignoring anvil combine rules and prior-work penalty. Donor survival is `min(maxSurvival, survivalBase + levelPercent * survivalFactor)`, a book left with no enchantments becomes a plain book, and the level cost is `max(minXpCost, round(xpCostBase - levelPercent * xpCostFactor))`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `survivalBase` | `0.1` | Chance the donor item survives at level 0 progress, 0-1. |
| `survivalFactor` | `0.9` | Extra survival chance added at full level, 0-1. |
| `maxSurvival` | `1.0` | Hard ceiling on donor survival chance, 0-1. |
| `xpCostBase` | `6` | Vanilla XP levels charged at level 0 progress. |
| `xpCostFactor` | `3` | XP levels removed from that cost at full level. |
| `minXpCost` | `2` | Lowest XP level cost the scaling may produce. |
| `skillXpOnTransfer` | `20` | Enchanting skill XP granted per transfer. |

### Echo of Knowledge (`enchanting-echo-of-knowledge`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/enchanting/enchanting-echo-of-knowledge-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/enchanting/enchanting-echo-of-knowledge-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge

Collecting experience while holding an enchanted book in the main hand adds `max(1, round(xpAmount * (chargeRateBase + levelPercent * chargeRateFactor)))` charge on that book under `adapt:echo-charge`, capped at `chargeThreshold` until an upgrade. Crossing the threshold raises one enchantment that is below its vanilla maximum by one level and subtracts the threshold; a book whose enchantments are all at that maximum stores nothing.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `chargeRateBase` | `1` | Charge gained per experience point at level 0 progress. |
| `chargeRateFactor` | `3` | Extra charge per experience point at full level. |
| `chargeThreshold` | `120` | Charge required to raise one enchantment by a level. |
| `skillXpOnUpgrade` | `35` | Enchanting skill XP granted per upgrade. |

## Reference

### Skill XP and stats

Enchanting an item pays `enchantPowerXPMultiplier * power`, where `power` is the sum of the enchantment levels applied. Awards are spaced by `cooldownDelay`. Stats are recorded on every enchant regardless of the cooldown.

| Stat key | Recorded |
|----------|----------|
| `enchanted.items` | 1 per enchant performed |
| `enchanted.power` | Sum of applied enchantment levels |
| `enchanting.high.level` | 1 per enchant costing 30 or more levels |
| `enchanting.total.levels` | Level cost of the enchant |

### Skill configuration defaults

Written to `plugins/Adapt/skills/enchanting.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole skill and its adaptations off when false. |
| `skillColor` | `"&d"` | Legacy ampersand color code used for this skill in menus and text. |
| `enchantPowerXPMultiplier` | `45` | Skill XP granted per point of applied enchantment power. |
| `cooldownDelay` | `5250` | Minimum milliseconds between XP awards from enchanting. |
| `challengeEnchantReward` | `2500` | Base knowledge reward for the Enchanting milestones. |

### Shared knobs

| Key | Behavior |
|-----|----------|
| `baseCost`, `costFactor`, `maxLevel`, `initialCost` | Knowledge cost curve and level cap. Defaults per adaptation below. |

In the formulas below, `levelPercent` is the learned level divided by `maxLevel`, clamped to 0 through 1.

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_enchant_1k` | 1000 | `challengeEnchantReward` |
| `challenge_enchant_5k` | 5000 | `challengeEnchantReward` |
| `challenge_enchant_power_100` | 100 | `challengeEnchantReward` |
| `challenge_enchant_power_1k` | 1000 | `challengeEnchantReward` * 2 |
| `challenge_enchant_high_25` | 25 | `challengeEnchantReward` |
| `challenge_enchant_high_250` | 250 | `challengeEnchantReward` * 2 |
| `challenge_enchant_total_500` | 500 | `challengeEnchantReward` |
| `challenge_enchant_total_5k` | 5000 | `challengeEnchantReward` * 2 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
