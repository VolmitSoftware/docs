---
title: "Skill - Brewing"
description: "Brewing XP sources, custom potions, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Brewing gains XP from drinking potions and hitting targets with splash potions. Longer and stronger effects are worth more.

Lingering Brew extends potion duration, while Super Heated Brew speeds stands near fire or lava. The other eleven adaptations unlock custom effects. Those recipe adaptations are permanent and capped at level 1. Brewing stands store their owner for level checks.

## Earning XP

Drinking a potion pays a base award plus a bonus. The bonus scales off the potion's custom effects and whether it is an upgraded (level II) potion. Water, mundane, thick and awkward potions are ignored, since they do nothing.

Throwing a splash potion pays the same base award plus a bonus for the total effect power of the splash. It also records how many entities the cloud actually caught.

Both awards share one cooldown. Chugging a stack does not pay per bottle. Placing a brewing stand records a stat for the placement challenges but pays no XP on its own.

## Adaptations

All of this needs the adaptation learned to level 1 or higher, the skill and the adaptation enabled, the matching `adapt.use.` permission (or the `adapt.use.*` wildcard), and protection and region policy that allow the action.

### Lingering Brew (`brewing-lingering`)

5 levels · 5 knowledge, then 3 per level

Everything with a duration that comes out of your brewing stand comes out longer. Adapt takes the base potion's effects, adds a flat tick bonus, and multiplies the original duration on top of that. Instant effects like Instant Health are left alone. Brew as normal.

The boost uses the stand owner's level, not the level of whoever pulls the bottles out. A stand records its owner when someone places it, or the first time someone opens one that has no owner yet.

New duration for each non-instant effect is the flat tick bonus plus the original duration times the multiplier. The multiplier curve squares level progress, so most of the gain arrives at high levels.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `baseDurationBoostTicks` | `100` | Flat ticks added to every non-instant effect at level 1. |
| `durationBoostFactorTicks` | `500` | Extra flat ticks added across the full level range. |
| `durationMultiplierFactor` | `0.45` | Size of the percentage stretch at max level, applied against squared level progress. |
| `baseDurationMultiplier` | `0.05` | Percentage stretch applied at every level regardless of progress. |
| `useCustomLore` | `true` | Rewrites the potion's lore with each effect and its new duration, and hides the vanilla effect tooltip. |

### Super Heated Brew (`brewing-super-heated`)

5 levels · 5 knowledge, then 3 per level

A brewing stand shaves time off its brew for every fire or lava block touching it. Adapt checks the block underneath and the four sides. Lava counts for far more than fire.

How to use it:

1. Learn Super Heated Brew.
2. Place a brewing stand you own.
3. Put fire or lava directly below it or against any of its four sides.
4. Brew as normal. The timer runs down faster while the stand is hot.

Like Lingering Brew, this uses the stand owner's level, and the owner has to be online. A stand that has been idle for a while stops being checked until someone touches it again.

Heat is counted on five faces: the block below the stand and the four sides. Each check removes `ceil(interval_in_ticks * total_percent)` from the brew timer, where total percent is the fire boost times the fire block count plus the lava boost times the lava block count.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `multiplierFactor` | `1.33` | Scales both heat boosts by level progress. Effective boost is the per-source multiplier times this times level progress. |
| `fireMultiplier` | `0.14` | Fraction of the check interval removed per touching fire block, before level scaling. |
| `lavaMultiplier` | `0.69` | Fraction of the check interval removed per touching lava block, before level scaling. |

### Brewing custom potions

The eleven potion adaptations below all work the same way. Each adds recipes to the brewing stand that vanilla does not have.

1. Learn the adaptation you want in the Adapt menu. All eleven are permanent, so you cannot refund them later.
2. Put blaze powder in the fuel slot. Custom recipes charge fuel like vanilla ones do.
3. Put the required base potion in the bottle slots.
4. Pick up the custom ingredient and left-click it into the ingredient slot yourself.

That last step matters. Adapt watches for the click, not for the item appearing, so dropping the ingredient in by hopper or dragging it will not start a custom brew. Whoever clicks the ingredient in is the player whose adaptation is checked.

### Bottled Absorption (`brewing-absorption`)

Adds Potions of Absorption, which give temporary bonus hearts on top of your real health. Quartz gives the normal version, a block of quartz gives the shorter, stronger one. Both brew from an Instant Health potion.

Menu icon: `QUARTZ`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-absorption-1` | Instant Health | `QUARTZ` | `ABSORPTION` | 1200 ticks (60 s) | 0 | 16 |
| `brewing-absorption-2` | Instant Health | `QUARTZ_BLOCK` | `ABSORPTION` | 600 ticks (30 s) | 1 | 32 |

### Bottled Blindness (`brewing-blindness`)

Adds Potions of Blindness, which black out whatever they hit. Throwing material. An ink sac gives the normal version, a glow ink sac the shorter, stronger one, both from an awkward potion.

Menu icon: `INK_SAC`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-blindness-1` | `AWKWARD` | `INK_SAC` | `BLINDNESS` | 600 ticks (30 s) | 0 | 16 |
| `brewing-blindness-2` | `AWKWARD` | `GLOW_INK_SAC` | `BLINDNESS` | 300 ticks (15 s) | 1 | 32 |

### Bottled Darkness (`brewing-darkness`)

Adds a Potion of Darkness, which drops a shroud over the target's vision. It brews from a Night Vision potion with black concrete, and there is only one strength. The menu lore also claims Darkness stops the drinker sprinting. That is a claim about the vanilla effect and nothing in Adapt enforces it.

Menu icon: `BLACK_CONCRETE`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-darkness` | `NIGHT_VISION` | `BLACK_CONCRETE` | `DARKNESS` | 600 ticks (30 s) | 0 | 16 |

### Bottled Decay (`brewing-decay`)

Adds Potions of Wither. A poisonous potato on a Weakness potion gives the normal version, crimson roots the shorter, stronger one. Wither ticks damage through armor, so this is one of the better throwables in the set.

Menu icon: `WITHER_ROSE`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-decay-1` | `WEAKNESS` | `POISONOUS_POTATO` | `WITHER` | 320 ticks (16 s) | 0 | 16 |
| `brewing-decay-2` | `WEAKNESS` | `CRIMSON_ROOTS` | `WITHER` | 160 ticks (8 s) | 1 | 32 |

### Bottled Fatigue (`brewing-fatigue`)

Adds Potions of Mining Fatigue, which slow a target's digging and swing speed. A slime ball on a Weakness potion for the normal version, a slime block for the stronger one.

Menu icon: `SLIME_BALL`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-fatigue-1` | `WEAKNESS` | `SLIME_BALL` | `SLOW_DIGGING` (Mining Fatigue) | 1200 ticks (60 s) | 0 | 16 |
| `brewing-fatigue-2` | `WEAKNESS` | `SLIME_BLOCK` | `SLOW_DIGGING` | 600 ticks (30 s) | 1 | 32 |

### Bottled Haste (`brewing-haste`)

Adds Potions of Haste for when Efficiency V still is not fast enough. An amethyst shard on a Speed potion for the normal version, an amethyst block for the stronger one.

Menu icon: `AMETHYST_SHARD`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-haste-1` | Speed | `AMETHYST_SHARD` | `FAST_DIGGING` (Haste) | 1200 ticks (60 s) | 0 | 16 |
| `brewing-haste-2` | Speed | `AMETHYST_BLOCK` | `FAST_DIGGING` | 600 ticks (30 s) | 1 | 32 |

### Bottled Life (`brewing-healthboost`)

Adds Potions of Health Boost, which raise your maximum hearts rather than healing you. A golden apple on an Instant Health potion for the normal version, an enchanted golden apple for the stronger one. Both last the same length. The enchanted apple buys you the extra tier, not extra time.

Menu icon: `ENCHANTED_GOLDEN_APPLE`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-healthboost-1` | Instant Health | `GOLDEN_APPLE` | `HEALTH_BOOST` | 1200 ticks (60 s) | 0 | 16 |
| `brewing-healthboost-2` | Instant Health | `ENCHANTED_GOLDEN_APPLE` | `HEALTH_BOOST` | 1200 ticks (60 s) | 1 | 32 |

### Bottled Hunger (`brewing-hunger`)

Adds Potions of Hunger, which drain the target's food bar. Rotten flesh on an awkward potion gives the normal version, and the same rotten flesh on a Weakness potion gives the stronger one.

Menu icon: `ROTTEN_FLESH`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-hunger-1` | `AWKWARD` | `ROTTEN_FLESH` | `HUNGER` | 1200 ticks (60 s) | 0 | 16 |
| `brewing-hunger-2` | `WEAKNESS` | `ROTTEN_FLESH` | `HUNGER` | 600 ticks (30 s) | 1 | 32 |

### Bottled Nausea (`brewing-nausea`)

Adds Potions of Nausea, which warp the target's screen. A brown mushroom on an awkward potion for the normal version, a crimson fungus for the shorter, stronger one.

Menu icon: `CRIMSON_FUNGUS`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-nausea-1` | `AWKWARD` | `BROWN_MUSHROOM` | `CONFUSION` (Nausea) | 600 ticks (30 s) | 0 | 16 |
| `brewing-nausea-2` | `AWKWARD` | `CRIMSON_FUNGUS` | `CONFUSION` | 300 ticks (15 s) | 1 | 32 |

### Bottled Resistance (`brewing-resistance`)

Adds Potions of Resistance, which cut all incoming damage. An iron ingot on an awkward potion for the normal version, an iron block for the stronger one.

Menu icon: `IRON_BLOCK`.

| Recipe id | Base potion | Ingredient | Effect | Duration | Amplifier | Fuel |
|-----------|-------------|------------|--------|----------|-----------|------|
| `brewing-resistance-1` | `AWKWARD` | `IRON_INGOT` | `RESISTANCE` | 1200 ticks (60 s) | 0 | 16 |
| `brewing-resistance-2` | `AWKWARD` | `IRON_BLOCK` | `RESISTANCE` | 600 ticks (30 s) | 1 | 32 |

### Bottled Saturation (`brewing-saturation`)

Adds Potions of Saturation, which refill hunger instantly instead of over time. A baked potato on a Regeneration potion for the normal version, a hay bale for the stronger one. Both are instant, so duration does not apply.

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

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts)
- [03 - Player Usage](/adapt/03-player-usage)
- [10 - Skills Catalog](/adapt/10-skills-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
