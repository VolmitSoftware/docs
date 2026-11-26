---
title: "Upgrades - Brewing"
description: "Brewing upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Brewing (see [Mutations](/adapt/35-mutations)), and they replace the [Brewing](/adapt/15-skill-brewing) adaptations they fuse. While you hold an upgrade, the custom potion recipes of the adaptations it fuses stay available to you.

## Upgrades

### Master Distiller (`upgraded-brewing-master-distiller`)

3 levels · 15, 14 and 18 knowledge · Fuses Lingering Brew and Super Heated Brew

Brewing stands you own brew faster and their potions last twice as long. A stand belongs to the player who placed it, or to the first player who opens it if it has no owner, and you must be online for it to work. An idle stand is skipped until a player or hopper puts items in it.

On top of normal brewing, an owned stand loses extra brew time on every check: 30%, 45% or 60% of the elapsed time at levels 1, 2 and 3, rounded up. Each fire block on the block below the stand or on its four sides adds 19%, and each lava block adds 92%.

When a brew finishes, every lasting effect of each vanilla potion in the stand is multiplied by 2. Instant effects such as Healing keep their value, and Adapt's custom potions are left unchanged. With custom lore on, the new durations are written into the potion's lore and the vanilla effect tooltip is hidden.

Master Distiller also unlocks the Alchemist's Bandolier: 1 leather, 1 string and 3 glass bottles, crafted without a table shape. Right-click with it to load one potion from your off hand, or from your inventory when the off hand has none; sneak and right-click to take the active potion back out. Sneak and scroll the hotbar with the Bandolier in hand to pick the active potion; the hotbar selection stays put, and no Barter casts from that scroll. A Bandolier with potions loaded cannot be used in any crafting recipe. It holds 3, 4 or 6 potions at levels 1, 2 and 3. While you carry it with potions loaded, the quarter-dose Brewing blocks of your mutation take their dose from its active potion instead of your off hand, so a shield or a clock can stay there. When a loaded bottle runs dry it leaves the Bandolier and the empty glass bottle goes to your inventory. Without Master Distiller the Bandolier is inert and the blocks draw from the off hand as usual.

Personal controls: Extended potion lore (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `brewSpeedBase` | `0.15` | Extra brewing speed before level scaling, as a fraction of normal speed. |
| `brewSpeedPerLevel` | `0.15` | Extra brewing speed added per level. |
| `fireBoost` | `0.19` | Extra brewing speed for each fire block touching the stand. |
| `lavaBoost` | `0.92` | Extra brewing speed for each lava block touching the stand. |
| `durationMultiplier` | `2.0` | Multiplier on every lasting effect of a brewed potion. |
| `useCustomLore` | `true` | Writes the extended durations into the potion's lore. |
| `bandolierSlotsAtFirstLevel` | `3` | Potions the Alchemist's Bandolier holds at level 1. |
| `bandolierSlotsAtTopLevel` | `6` | Potions the Alchemist's Bandolier holds at level 3. Level 2 sits in between, rounded down. |

### Witch's Shelf (`upgraded-brewing-witchs-shelf`)

3 levels · 13, 13 and 16 knowledge · Fuses Bottled Blindness, Bottled Darkness, Bottled Decay, Bottled Fatigue, Bottled Hunger and Bottled Nausea

At level 1 you can brew every recipe of the six hostile Bottled adaptations. The recipes are listed on the [Brewing](/adapt/15-skill-brewing) page.

A splash potion you throw that carries one of those six effects reaches farther than a normal splash. The radius is 5.5, 6.5 or 7.5 blocks at levels 1, 2 and 3, and half that vertically. Creatures the vanilla splash missed inside that radius get the hostile effects, shortened by their distance from the impact: full length at the center, nothing at the edge. Effects that would last 1 second or less are dropped. You, and anything protection rules stop you from harming, are skipped.

Mixing: put two finished splash potions with only harmful effects and a glowstone dust in a brewing stand you have open. After 400 ticks (20 s) the stand pours one Mixed Hex splash potion that carries every effect of both, each at 60%, 70% or 80% of its own duration at levels 1, 2 and 3. Both potions and one glowstone dust are used, and the brew burns one fuel charge. A mix holds 2 effects at levels 1 and 2 and 3 at level 3, so at level 3 a third potion can be mixed into a mix. Instant effects, helpful effects, the same effect twice, an opened quarter-dose bottle and a mix of drinkable and splash potions are refused. Taking a bottle or the glowstone out stops the mix. The mixed potion works like any other potion for whoever holds it; only brewing it needs the upgrade. Two different potions with glowstone are mixed instead of strengthened while you hold this upgrade; strengthen them one kind at a time.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `extraRadiusBase` | `0.5` | Blocks added to the 4-block splash radius before level scaling. |
| `extraRadiusPerLevel` | `1.0` | Blocks added to the splash radius per level. |
| `mixEffects` | `2` | Effects one mixed splash may carry below the top level. |
| `mixEffectsTopLevel` | `3` | Effects one mixed splash may carry at level 3. |
| `mixDurationBase` | `0.5` | Share of each effect's duration a mix keeps, before level scaling. |
| `mixDurationPerLevel` | `0.1` | Share of each effect's duration added per level. |
| `mixBrewTicks` | `400` | Ticks a mix takes to brew. |

### Apothecary (`upgraded-brewing-apothecary`)

3 levels · 13, 13 and 16 knowledge · Fuses Bottled Absorption, Bottled Life, Bottled Resistance and Bottled Saturation

At level 1 you can brew every recipe of the four defensive Bottled adaptations, the two Bottled Haste recipes, and the Apothecary elixir.

The elixir brews from a Strong Healing potion with a golden carrot as the ingredient, takes 400 ticks (20 s) and costs 32 fuel. It carries the level 1 effect of each defensive brew: Absorption I, Health Boost I and Resistance I for 60 seconds each, and Saturation V. When the brew finishes, the lasting effects are multiplied by 1, 1.25 or 1.5 at levels 1, 2 and 3 of the player who started it, so they last 60, 75 or 90 seconds.

Mixing: put two finished drinkable potions and a glowstone dust in a brewing stand you have open. After 400 ticks (20 s) the stand pours one Mixed Tonic that carries every effect of both, each at 60%, 70% or 80% of its own duration at levels 1, 2 and 3. Both potions and one glowstone dust are used, and the brew burns one fuel charge. A mix holds 2 effects at levels 1 and 2 and 3 at level 3, so at level 3 a third potion can be mixed into a mix. Instant effects, the same effect twice, an opened quarter-dose bottle and a mix of drinkable and splash potions are refused. Taking a bottle or the glowstone out stops the mix. The mixed potion works like any other potion for whoever holds it; only brewing it needs the upgrade. Two different potions with glowstone are mixed instead of strengthened while you hold this upgrade; strengthen them one kind at a time.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `elixirDurationBase` | `0.75` | Elixir duration multiplier before level scaling. |
| `elixirDurationPerLevel` | `0.25` | Elixir duration multiplier added per level. |
| `mixEffects` | `2` | Effects one mixed potion may carry below the top level. |
| `mixEffectsTopLevel` | `3` | Effects one mixed potion may carry at level 3. |
| `mixDurationBase` | `0.5` | Share of each effect's duration a mix keeps, before level scaling. |
| `mixDurationPerLevel` | `0.1` | Share of each effect's duration added per level. |
| `mixBrewTicks` | `400` | Ticks a mix takes to brew. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Brewing](/adapt/15-skill-brewing).
