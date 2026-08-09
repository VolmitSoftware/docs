---
title: HiddenOre — Configuration
description: Every config.yml key explained
published: true
date: 2026-08-09T00:00:00.000Z
tags: hiddenore, configuration
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

This page documents `plugins/HiddenOre/config.yml`. Values shown are the shipped defaults.

## Top level

| Key | Default | Effect |
|---|---|---|
| `auto_pickup_drops` | `false` | Send hidden drops straight to the player's inventory instead of the ground |
| `suppress_block_drop_on_custom_drop` | `true` | When a hidden reward fires, suppress the block's normal drop |

## Ore removal

```yaml
ore-removal:
  enabled: false
  global:
    default: true
    NETHER_GOLD_ORE: false
    NETHER_QUARTZ_ORE: false
    ANCIENT_DEBRIS: false
  exceptions:
    "minecraft:the_end":
      default: false
    "minecraft:the_nether":
      default: false
      NETHER_GOLD_ORE: true
      NETHER_QUARTZ_ORE: true
      ANCIENT_DEBRIS: true
```

| Key | Effect |
|---|---|
| `enabled` | Master switch. While `false`, world generation is untouched |
| `global.default` | When `true`, all ores are stripped from generation by default |
| `global.<ORE>` | Per-ore exception to `default` |
| `exceptions.<world key>` | Per-world override block, keyed by fully qualified world key |

Accepted ore keys:

`COAL_ORE`, `COPPER_ORE`, `IRON_ORE`, `GOLD_ORE`, `DIAMOND_ORE`, `REDSTONE_ORE`, `LAPIS_ORE`,
`EMERALD_ORE`, `DEEPSLATE_COAL_ORE`, `DEEPSLATE_COPPER_ORE`, `DEEPSLATE_IRON_ORE`,
`DEEPSLATE_GOLD_ORE`, `DEEPSLATE_DIAMOND_ORE`, `DEEPSLATE_REDSTONE_ORE`, `DEEPSLATE_LAPIS_ORE`,
`DEEPSLATE_EMERALD_ORE`, `NETHER_GOLD_ORE`, `NETHER_QUARTZ_ORE`, `ANCIENT_DEBRIS`

> Ore removal applies at generation time. Enabling it does not remove ore from chunks that
> already exist.

## Managed blocks

```yaml
blocks:
  stone:
    drop: cobblestone
  deepslate:
    drop: cobbled_deepslate
```

Blocks listed here enter the reward pipeline. `drop` preserves their normal drop so mining
still behaves like vanilla when no reward fires.

## Veins

```yaml
veins:
  generation: seeded
  allow_placed_blocks: false
  discovery_sound:
    sound: "BLOCK_BEACON_POWER_SELECT"
    volume: 1.0
    pitch: 1.0
```

| Key | Default | Effect |
|---|---|---|
| `generation` | `seeded` | `seeded` or `pure_random` — see [Overview](/hiddenore) |
| `allow_placed_blocks` | `false` | Whether player-placed blocks can pay out |
| `discovery_sound.sound` | `BLOCK_BEACON_POWER_SELECT` | Sound played on a hit |
| `discovery_sound.volume` | `1.0` | |
| `discovery_sound.pitch` | `1.0` | |

`allow_placed_blocks: false` closes the place-and-remine exploit. Player-placed blocks are
tracked persistently and survive both piston movement and server restarts.

## Drops

Each entry under `drops:` is one item rule.

```yaml
drops:
  - item: coal
    veins_per_chunk: 2.2
    vein_min_size: 5
    vein_max_size: 20
    min_y: 0
    max_y: 320
    fortune_multiplier: true
    tool_tiers: [ WOODEN_PICKAXE, STONE_PICKAXE, COPPER_PICKAXE, IRON_PICKAXE,
                  GOLDEN_PICKAXE, DIAMOND_PICKAXE, NETHERITE_PICKAXE ]
    exp_drop: 2
```

| Key | Effect |
|---|---|
| `item` | The item to award |
| `veins_per_chunk` | Average veins per chunk; fractional values are allowed |
| `vein_min_size` / `vein_max_size` | Blocks per vein |
| `min_y` / `max_y` | Vertical band the rule applies in |
| `fortune_multiplier` | Whether Fortune scales the drop |
| `tool_tiers` | Pickaxe tiers that can trigger this rule |
| `exp_drop` | Experience awarded |

### Safety limits

HiddenOre enforces hard caps:

- 64 veins per chunk for a single rule
- 256 blocks per vein
- 1,024 worst-case target blocks across all item rules
- `exp_drop` no greater than 1,000

### Order sensitivity

> Under `veins.generation: seeded`, vein positions are derived from the order of this list.
> **Reordering, inserting, or deleting an entry reshuffles every undiscovered vein in the
> world.** Already-discovered positions stay discovered, so the practical effect is a
> discontinuity in what players find. Back up worlds before editing the list on a live server.
>
> Appending a new rule to the **end** of the list is the least disruptive edit.
