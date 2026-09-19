---
title: "Skill - Enchanting"
description: "Enchanting XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Enchanting gains XP when the player enchants an item, scaled by the total enchantment power applied.

Its 14 adaptations refund lapis or experience, lower anvil costs, preview and reroll offers, add bookshelf power, apply books directly, transfer enchantments, and protect a linked item on death. Enchantments costing 30 levels or more also advance high-level challenges and play a special effect.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled in config, an `adapt.use.` permission that has not been revoked, and protection and region policy that allow the action.

### Quick-Click Enchant (`enchanting-quick-enchant`)

7 levels · 8 knowledge, then 6 per level

Applies an enchanted book straight onto an item without an anvil, with no level cost and no prior-work penalty. It only moves enchantments the target can actually accept. It refuses if the
item would end up with more combined enchantment levels than your adaptation
level allows.

How to use it:

1. Open any inventory screen.
2. Pick up an enchanted book so it sits on your cursor. It has to be a single book.
3. Left-click it onto a single item in a container slot, an armor slot, or your hotbar. The target cannot be a book or another enchanted book.
4. Compatible enchantments move onto the item. Anything that conflicts with what is already there, or cannot go on that item type, stays on the book.
5. If the book gave up everything it had it disappears. Otherwise it stays on your cursor holding the leftovers.

If the combined power would exceed your cap, nothing happens and your actionbar tells you the limit.

Power cap is `level + (level / maxPowerBonus1PerLevels)` once `level` exceeds `maxPowerBonusLimit`, otherwise just `level`. A successful application awards 50 skill XP plus 320 per enchantment level moved.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxPowerBonusLimit` | `4` | Adaptation level above which the bonus power term starts applying. |
| `maxPowerBonus1PerLevels` | `3` | Adaptation levels per extra point of allowed combined power. |

### Lapis Return (`enchanting-lapis-return`)

3 levels · 2 knowledge, then 5 per level

After a table enchant commits, Lapis Return sometimes puts lapis directly into your inventory. Any overflow drops at your feet. The amount refunded equals your adaptation level, so higher levels both refund more often and refund more.

There is a 20 second window between refunds. The chance is rolled first and the cooldown is checked second, so a lucky roll inside that window is wasted.

Refund chance is `min(maxRefundChance, refundChanceBase + levelPercent * refundChanceFactor)`. A successful refund adds a stack equal to the adaptation level directly to the player's inventory, dropping only overflow. Hardcoded 20000 ms cooldown between refunds, checked after the roll.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `refundChanceBase` | `0.1` | Refund chance at level 0 progress, 0-1. |
| `refundChanceFactor` | `0.2` | Extra refund chance added at full level, 0-1. |
| `maxRefundChance` | `0.4` | Hard ceiling on refund chance, 0-1. |

### XP Return (`enchanting-xp-return`)

7 levels · 2 knowledge, then 1 per level

Each committed enchant can return one bounded vanilla XP orb. The default reward is `2 + 4 * (level - 1)` points, or 2-26 points across the seven levels, with a 30-second per-player cooldown. It is a fixed adaptation reward rather than a percentage of the enchant's actual cost.

Orb value is `min(maximumXpPerEnchant, vanillaXpAtLevelOne + (level - 1) * vanillaXpPerAdditionalLevel)` experience points.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `vanillaXpAtLevelOne` | `2` | Vanilla XP points returned at adaptation level one. |
| `vanillaXpPerAdditionalLevel` | `4` | XP points added for every level after level one. |
| `maximumXpPerEnchant` | `32` | Hard cap on one enchant refund. |
| `cooldownMillis` | `30000` | Minimum milliseconds between refunds for one player. |

### Anvil Savant (`enchanting-anvil-savant`)

4 levels · 5 knowledge

Cuts the level cost the anvil quotes you for combining, repairing, and renaming, down to a floor of `minimumCost`. Your actionbar shows how many levels you just saved while you are shuffling items in the anvil.

The saved-levels stat only records once you actually take the result out of the output slot.

Reduction is `min(maximumReduction, reductionBase + levelPercent * reductionFactor)`. The new cost is `max(minimumCost, ceil(oldCost * (1 - reduction)))`. The savings actionbar is throttled to one message per 350 ms.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `reductionBase` | `0.08` | Cost reduction at level 0 progress, 0-1. |
| `reductionFactor` | `0.37` | Extra cost reduction added at full level, 0-1. |
| `maximumReduction` | `0.65` | Hard ceiling on cost reduction, 0-1. |
| `minimumCost` | `1` | Lowest anvil level cost the reduction may produce. |

### Offer Reroll (`enchanting-offer-reroll`)

4 levels · 4 knowledge

Rerolls your personal enchantment seed, which reshuffles every offer the table is showing you. Useful when all three slots are junk and you do not want to burn levels on a bad one.

How to use it:

1. Learn it, then stand near an enchanting table.
2. Sneak and right-click the table with your main hand. Sneak-right-clicking air also works if you are looking at a table within 5 blocks.
3. Lapis and XP levels come out of your inventory, the offers reshuffle, and the table goes on cooldown.

Higher levels cost less lapis and shorten the cooldown. If you cannot pay, or the server build does not expose the seed setter, the attempt fizzles and everything is refunded.

Lapis cost is `max(1, round(lapisCostBase - levelPercent * lapisCostFactor))`. Cooldown is `max(20, round(cooldownTicksBase - levelPercent * cooldownTicksFactor))` ticks, applied as a vanilla item cooldown on `ENCHANTING_TABLE`. Failure refunds the lapis and XP levels.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `lapisCostBase` | `4` | Lapis consumed per reroll at level 0 progress. |
| `lapisCostFactor` | `2` | Lapis removed from that cost at full level. |
| `cooldownTicksBase` | `320` | Reroll cooldown at level 0 progress, in server ticks (20 = 1 second). |
| `cooldownTicksFactor` | `220` | Ticks removed from the cooldown at full level. |
| `xpLevelCost` | `1` | Vanilla XP levels charged per reroll, flat at all levels. |
| `xpGainOnReroll` | `15` | Enchanting skill XP granted per successful reroll. |

### Bookshelf Attunement (`enchanting-bookshelf-attunement`)

4 levels · 3 knowledge, then 4 per level

Adds virtual bookshelf power to the enchanting table, so it offers better enchantments than the surrounding room should allow. Each offer gets its level requirement pushed up (capped at 30). Its enchantment level is pushed up by a third of the virtual power. That never goes past the enchantment's own maximum.

Because it raises the required level as well as the reward, this is a quality upgrade, not a discount.

Virtual power is `max(1, round(powerBase + levelPercent * powerFactor))`. Each offer's cost becomes `min(30, cost + power)` and its enchantment level becomes `min(enchantMax, level + power / 3)`, never below 1.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `powerBase` | `1` | Virtual bookshelf power at level 0 progress. |
| `powerFactor` | `5` | Virtual bookshelf power added at full level. |

### Grindstone Recovery (`enchanting-grindstone-recovery`)

5 levels · 4 knowledge

Disenchanting normally destroys everything you strip off. This gives you a chance to keep one of those enchantments as an enchanted book.
You also get a handful of vanilla XP on top of the usual grindstone payout.

The recovered book carries one randomly chosen enchantment from whichever input was enchanted. Success puts the grindstone on a short cooldown for you. If you are sneaking, Curse Cleansing claims the click instead and this does not fire.

Recovery chance is `min(maxRecoverChance, recoverChanceBase + levelPercent * recoverChanceFactor)`. Vanilla XP granted is `round(min(maximumBonusXp, bonusXpBase + levelPercent * bonusXpFactor))`. Cooldown is `max(minimumCooldownTicks, round(cooldownTicksBase - levelPercent * cooldownTicksFactor))` ticks on `GRINDSTONE`. Recovered book level is clamped to the enchantment's maximum. Defaults scale from 15% recovery, 2 vanilla XP, and 9.2 seconds at level one to 35%, 5 XP, and 6 seconds at level five.

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

4 levels · 5 knowledge

Strips Curse of Binding and Curse of Vanishing off an item while keeping everything else: the other enchantments, the name, the damage, the custom data. Vanilla grindstones cannot do this at all.

How to use it:

1. Put the cursed item in a grindstone. The other input slot can be empty.
2. Sneak.
3. Click the grindstone output slot.
4. One of that input item is consumed, and a cleaned copy lands in your inventory. Your actionbar reports how many curses came off.

You get Enchanting XP for each curse removed.

Curses recognized are `BINDING_CURSE` and `VANISHING_CURSE`, on both direct enchantments and stored book enchantments. The cleaned output is always a stack of 1. Skill XP is `skillXpPerCurse * cursesRemoved`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `skillXpPerCurse` | `30` | Enchanting skill XP granted for each curse removed. |

### Tome Rebinding (`enchanting-tome-rebinding`)

5 levels · 4 knowledge, then 5 per level

Splits an enchanted book carrying several enchantments into one book per enchantment. At low levels the split usually eats one of them at random. At max level the loss chance reaches zero and the split is clean.

How to use it:

1. Hold exactly one multi-enchant book with two or more stored enchantments. Drop one item, not the whole stack.
2. Look directly at an anvil, chipped anvil, or damaged anvil within 5 blocks.
3. Press drop (`Q` by default). You do not open or click the anvil interface.
4. XP levels are deducted. The dropped book divides in place into separate single-enchant books, retaining its movement and pickup delay.

If you do not have the levels, the attempt fizzles and the original book drops normally. A dropped stack of two or more books is left unchanged so the split cannot consume extra copies.

Loss chance is `max(0, lossChanceBase - levelPercent * lossChanceFactor)`, which reaches 0 at max level with the defaults, and a loss only happens when more than one enchantment remains. Stored enchantment levels are preserved, including levels above the normal vanilla maximum. XP level cost is `max(minXpCost, round(xpCostBase - levelPercent * xpCostFactor))`. Skill XP is `skillXpOnSplit` per book produced.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `lossChanceBase` | `0.9` | Chance to lose one enchantment at level 0 progress, 0-1. |
| `lossChanceFactor` | `1.0` | Loss chance subtracted at full level, 0-1. |
| `xpCostBase` | `5` | Vanilla XP levels charged at level 0 progress. |
| `xpCostFactor` | `3` | XP levels removed from that cost at full level. |
| `minXpCost` | `2` | Lowest XP level cost the scaling may produce. |
| `skillXpOnSplit` | `14` | Enchanting skill XP granted per book produced. |

### Soul Link (`enchanting-soul-link`)

5 levels · 6 knowledge

Marks one enchanted item so it survives your next death. On death the marked item is pulled out of your drops, held server-side, and handed back to you when you respawn.

How to use it:

1. Hold an enchanted item, or an enchanted book, in your main hand.
2. Sneak and right-click an anvil block.
3. The item is stamped and your actionbar confirms the link. You cannot re-mark again until the cooldown expires.
4. When you die, the save costs XP levels. If you were keeping levels, they come off your kept total. If you were not, the cost comes out of the XP you drop, at 7 XP per level.
5. Respawn and the item is returned. If you logged out before it could be delivered, it arrives a second after your next join.

Only one item is linked at a time, marking a new one replaces the old link. If you do not have enough XP levels at the moment you die, the item drops normally.

The mark is a random token written to the item's persistent data under `adapt:soul-link-token`. Save cost is `max(minSaveCost, round(saveCostBase - levelPercent * saveCostFactor))` XP levels. Re-mark cooldown is `max(minRemarkCooldown, round(remarkCooldownBase - levelPercent * remarkCooldownFactor))` milliseconds. Deaths with keep-inventory on are skipped entirely.

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

5 levels · 4 knowledge

Killing a living entity that is wearing or holding enchanted gear pays Enchanting XP per distinct enchantment, and sometimes drops an enchanted book carrying one of them. The item has to be equipped rather than just carried, and the kill has to be credited to you, so a `/kill` death does not count.

Higher levels raise both the drop chance and the level the siphoned book rolls at, capped at the enchantment's vanilla maximum. Player victims qualify only while Arcane Siphon is at its configured maximum level. Normal PVP policy still applies.

Gear scanned is helmet, chestplate, leggings, boots, main hand, and off hand, and duplicate enchantments keep the highest level. Spawn method is irrelevant. Skill XP is `bonusXpPerEnchant * distinctEnchantCount`, paid whether or not a book drops. Drop chance is `min(maxDropChance, dropChanceBase + levelPercent * dropChanceFactor)`, ranging from 20% at adaptation level 1 to 50% at level 5 on the defaults. Book level is the source level plus `floor(levelPercent * qualityFactor)`, clamped to the enchantment maximum.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `dropChanceBase` | `0.12` | Book drop chance at level 0 progress, 0-1. |
| `dropChanceFactor` | `0.4` | Extra drop chance added at full level, 0-1. |
| `maxDropChance` | `0.5` | Hard ceiling on book drop chance, 0-1. |
| `qualityFactor` | `2` | Enchantment levels added to the siphoned book at full level. |
| `bonusXpPerEnchant` | `12` | Enchanting skill XP per distinct enchantment on the victim's gear. |

### Rune Sight (`enchanting-rune-sight`)

3 levels · 3 knowledge

Shows you what the enchanting table is actually offering before you spend anything. The hidden offers are printed on your actionbar as enchantment name, level, and cost.

Level 1 reveals the top offer only. Level 3 reveals all three.

Reveal depth is `max(1, min(maxRevealDepth, 1 + floor(levelPercent * (maxRevealDepth - 1))))`.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxRevealDepth` | `3` | Offers revealed at full level. |
| `revealThrottleMs` | `400` | Minimum milliseconds between actionbar reveals. |

### Infusion Transfer (`enchanting-infusion-transfer`)

5 levels · 6 knowledge

Moves the strongest compatible enchantment from the sacrifice item onto the base item, without the anvil's combine rules or prior-work penalty. Good for pulling one enchantment off a book or a spare tool.

How to use it:

1. Put the item you want to improve in the left anvil slot. It cannot be a book.
2. Put the donor item or book in the right slot.
3. Empty your cursor.
4. Right-click the left slot. No sneaking needed.
5. XP levels are deducted and the enchantment lands on the base item.

The donor rolls to survive. At low levels it usually disappears. At max level it always survives, minus the enchantment that moved. A book stripped down to nothing becomes a plain book.

The transferred enchantment is the highest-level one on the donor that the base item does not already have and can legally hold. Survival chance is `min(maxSurvival, survivalBase + levelPercent * survivalFactor)`. XP level cost is `max(minXpCost, round(xpCostBase - levelPercent * xpCostFactor))`.

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

5 levels · 5 knowledge

Turns ordinary XP pickup into book upgrades. Hold an enchanted book while collecting experience and it soaks up charge. When it is full, one of its enchantments goes up a level.

How to use it:

1. Hold an enchanted book in your main hand.
2. Collect experience however you like: mining, mobs, furnaces.
3. Each pickup adds charge to that specific book, stored on the book itself.
4. When the charge passes the threshold, one enchantment below its vanilla maximum gains a level and the threshold is subtracted from the charge.

The book stops charging once every enchantment on it is at its vanilla cap. Higher levels convert experience to charge faster.

Charge gained per pickup is `max(1, round(xpAmount * (chargeRateBase + levelPercent * chargeRateFactor)))`, stored on the book under `adapt:echo-charge` and capped at the threshold while no upgrade is pending. Nothing is stored when every enchantment on the book is already at its vanilla maximum.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts) for skills, adaptations, and knowledge
- [03 - Player Usage](/adapt/03-player-usage) for the Adapt menu and learning flow
- [10 - Skills Catalog](/adapt/10-skills-catalog) for the full skill list
- [04 - Commands & Permissions](/adapt/04-commands-permissions) for the `adapt.use` permission tree
