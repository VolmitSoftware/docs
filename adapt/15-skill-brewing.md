---
title: "Skill - Brewing"
description: "Brewing XP sources, custom potions, and configuration"
published: true
date: 2026-09-28T10:36:37.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Brewing gains XP from drinking potions and from splash hits; longer and stronger effects pay more. Lingering Brew extends durations, Super Heated Brew speeds stands beside fire or lava, and eleven permanent level-1 adaptations add custom potion recipes.

## Earning XP

Drinking a potion pays a base award plus a bonus from its custom effects and from upgraded (level II) status. Water, mundane, thick, and awkward potions are ignored. Throwing a splash pays the same base award plus a bonus for the splash's total effect power, and records how many entities the cloud caught. Both awards share one cooldown, so a stack does not pay per bottle. Placing a brewing stand records a placement-challenge stat and pays no XP.

## Player controls

Every adaptation has an Enabled control in its level screen. These controls change only your player data; the server controls permitted values, defaults and locks. Personal settings never bypass learned levels, permissions, costs, cooldowns or server limits.

| Adaptation | Additional controls |
|---|---|
| Lingering Brew (`brewing-lingering`) | `extended-lore`: Extended potion lore |

Lingering lore applies only to newly enhanced potions and remains subject to `useCustomLore`. Disabling a brewing adaptation prevents that player’s owned brewing stand from applying it; existing potions remain unchanged.

Toggle defaults preserve existing behavior. Size and rate presets default to Full; material, ore and structure filters default to their existing selection. Confirmation, additional gesture restrictions and reserves are off by default. Server policies are configured as `[playerPreferences.<control-id>]` in the adaptation’s TOML file.

## Adaptations

### Lingering Brew (`brewing-lingering`)

5 levels · 5 knowledge, then 3 per level

Non-instant effects from the stand owner's brewing stand gain a flat tick bonus plus the original duration times the multiplier. Instant effects are unchanged. The stand records its owner on placement, or on the first open if it has none. The owner's level is used, not the level of the player who takes the bottles.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `baseDurationBoostTicks` | `100` | Flat ticks added to every non-instant effect at level 1. |
| `durationBoostFactorTicks` | `500` | Extra flat ticks added across the full level range. |
| `durationMultiplierFactor` | `0.45` | Size of the percentage stretch at max level, applied against squared level progress. |
| `baseDurationMultiplier` | `0.05` | Percentage stretch applied at every level regardless of progress. |
| `useCustomLore` | `true` | Rewrites the potion's lore with each effect and its new duration, and hides the vanilla effect tooltip. |

### Super Heated Brew (`brewing-super-heated`)

5 levels · 5 knowledge, then 3 per level

Fire or lava on the block below the stand or on its four sides shortens the brew. The stand owner's level is used, and that owner must be online. An idle stand is skipped until someone touches it. Each check removes `ceil(interval_in_ticks * total_percent)` from the brew timer, where total percent is the fire boost times the fire block count plus the lava boost times the lava block count.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `multiplierFactor` | `1.33` | Scales both heat boosts by level progress. Effective boost is the per-source multiplier times this times level progress. |
| `fireMultiplier` | `0.14` | Fraction of the check interval removed per touching fire block, before level scaling. |
| `lavaMultiplier` | `0.69` | Fraction of the check interval removed per touching lava block, before level scaling. |

### Brewing custom potions

The eleven adaptations below add brewing-stand recipes. Each is permanent, cannot be refunded, and is capped at level 1. Blaze powder in the fuel slot is consumed like a vanilla recipe. The ingredient must be left-clicked into the ingredient slot. Hoppers and drags do not start the brew. The player who clicks the ingredient is the player whose adaptation is checked.

### Bottled Absorption (`brewing-absorption`)

Menu icon: `QUARTZ`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-absorption-1` | Instant Health | `QUARTZ` | `ABSORPTION` | 1200 ticks (60 s) | 0 | 16 |
| `brewing-absorption-2` | Instant Health | `QUARTZ_BLOCK` | `ABSORPTION` | 600 ticks (30 s) | 1 | 32 |

### Bottled Blindness (`brewing-blindness`)

Menu icon: `INK_SAC`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-blindness-1` | `AWKWARD` | `INK_SAC` | `BLINDNESS` | 600 ticks (30 s) | 0 | 16 |
| `brewing-blindness-2` | `AWKWARD` | `GLOW_INK_SAC` | `BLINDNESS` | 300 ticks (15 s) | 1 | 32 |

### Bottled Darkness (`brewing-darkness`)

Menu icon: `BLACK_CONCRETE`. Menu lore claims Darkness stops the drinker sprinting. That is a claim about the vanilla effect, and Adapt does not enforce it.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-darkness` | `NIGHT_VISION` | `BLACK_CONCRETE` | `DARKNESS` | 600 ticks (30 s) | 0 | 16 |

### Bottled Decay (`brewing-decay`)

Menu icon: `WITHER_ROSE`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-decay-1` | `WEAKNESS` | `POISONOUS_POTATO` | `WITHER` | 320 ticks (16 s) | 0 | 16 |
| `brewing-decay-2` | `WEAKNESS` | `CRIMSON_ROOTS` | `WITHER` | 160 ticks (8 s) | 1 | 32 |

### Bottled Fatigue (`brewing-fatigue`)

Menu icon: `SLIME_BALL`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-fatigue-1` | `WEAKNESS` | `SLIME_BALL` | `SLOW_DIGGING` (Mining Fatigue) | 1200 ticks (60 s) | 0 | 16 |
| `brewing-fatigue-2` | `WEAKNESS` | `SLIME_BLOCK` | `SLOW_DIGGING` | 600 ticks (30 s) | 1 | 32 |

### Bottled Haste (`brewing-haste`)

Menu icon: `AMETHYST_SHARD`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-haste-1` | Speed | `AMETHYST_SHARD` | `FAST_DIGGING` (Haste) | 1200 ticks (60 s) | 0 | 16 |
| `brewing-haste-2` | Speed | `AMETHYST_BLOCK` | `FAST_DIGGING` | 600 ticks (30 s) | 1 | 32 |

### Bottled Life (`brewing-healthboost`)

Menu icon: `ENCHANTED_GOLDEN_APPLE`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-healthboost-1` | Instant Health | `GOLDEN_APPLE` | `HEALTH_BOOST` | 1200 ticks (60 s) | 0 | 16 |
| `brewing-healthboost-2` | Instant Health | `ENCHANTED_GOLDEN_APPLE` | `HEALTH_BOOST` | 1200 ticks (60 s) | 1 | 32 |

### Bottled Hunger (`brewing-hunger`)

Menu icon: `ROTTEN_FLESH`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-hunger-1` | `AWKWARD` | `ROTTEN_FLESH` | `HUNGER` | 1200 ticks (60 s) | 0 | 16 |
| `brewing-hunger-2` | `WEAKNESS` | `ROTTEN_FLESH` | `HUNGER` | 600 ticks (30 s) | 1 | 32 |

### Bottled Nausea (`brewing-nausea`)

Menu icon: `CRIMSON_FUNGUS`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-nausea-1` | `AWKWARD` | `BROWN_MUSHROOM` | `CONFUSION` (Nausea) | 600 ticks (30 s) | 0 | 16 |
| `brewing-nausea-2` | `AWKWARD` | `CRIMSON_FUNGUS` | `CONFUSION` | 300 ticks (15 s) | 1 | 32 |

### Bottled Resistance (`brewing-resistance`)

Menu icon: `IRON_BLOCK`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-resistance-1` | `AWKWARD` | `IRON_INGOT` | `RESISTANCE` | 1200 ticks (60 s) | 0 | 16 |
| `brewing-resistance-2` | `AWKWARD` | `IRON_BLOCK` | `RESISTANCE` | 600 ticks (30 s) | 1 | 32 |

### Bottled Saturation (`brewing-saturation`)

Menu icon: `BAKED_POTATO`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-saturation-1` | Regeneration | `BAKED_POTATO` | `SATURATION` | 1 tick (instant) | 4 | 16 |
| `brewing-saturation-2` | Regeneration | `HAY_BLOCK` | `SATURATION` | 1 tick (instant) | 8 | 32 |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/brewing.toml` on first load.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `enabled` | `true` | Turns the whole Brewing skill off when false. |
| `skillColor` | `"&d"` | Legacy ampersand color code used for this skill in menus and text. |
| `challengeBrew1k` | `1000` | XP paid by the consumed, stand-placed and strong-potion milestones. The larger tier of each pair pays double. |
| `challengeBrewSplash1k` | `1000` | XP paid by the splash and splash-hit milestones. The larger tier of each pair pays double. |
| `splashXP` | `100` | Flat XP paid for drinking a potion and for landing a splash potion. Despite the name it covers both. |
| `cooldownDelay` | `2500` | Milliseconds between Brewing XP awards. |
| `splashMultiplier` | `0.4` | Multiplier applied to a potion's summed effect power, where each effect counts as amplifier plus one times its duration in seconds. Drinking also adds this multiplier times 25, or times 50 for an upgraded potion. |

### Challenges

| Challenge | Threshold |
|---|---|
| `challenge_brew_1k` | 1000 |
| `challenge_brew_5k` | 5000 |
| `challenge_brewsplash_1k` | 1000 |
| `challenge_brewsplash_5k` | 5000 |
| `challenge_brew_stands_10` | 10 |
| `challenge_brew_stands_50` | 50 |
| `challenge_brew_strong_25` | 25 |
| `challenge_brew_strong_250` | 250 |
| `challenge_brew_splash_hits_50` | 50 |
| `challenge_brew_splash_hits_500` | 500 |
| `challenge_brewing_lingering_200` | 200 |
| `challenge_brewing_lingering_5k` | 5000 |
| `challenge_brewing_super_heated_100` | 100 |
| `challenge_brewing_super_heated_2500` | 2500 |
| `challenge_brewing_absorption_25` | 25 |
| `challenge_brewing_blindness_25` | 25 |
| `challenge_brewing_darkness_25` | 25 |
| `challenge_brewing_decay_25` | 25 |
| `challenge_brewing_fatigue_25` | 25 |
| `challenge_brewing_haste_25` | 25 |
| `challenge_brewing_health_boost_25` | 25 |
| `challenge_brewing_hunger_25` | 25 |
| `challenge_brewing_nausea_25` | 25 |
| `challenge_brewing_resistance_25` | 25 |
| `challenge_brewing_saturation_25` | 25 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
