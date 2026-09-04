---
title: "HiddenOre: Configuration"
description: "Every hiddenore.yml key and default"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "hiddenore, configuration"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Configuration lives at `plugins/HiddenOre/hiddenore.yml`; the tables below show its defaults. Changes to `hiddenore.yml` and `language.yml` reload automatically, while invalid files leave the current settings active. Use `/hiddenore reload` to apply changes immediately, and use the in-game picker or the `language` key to select the server default.

## Top level

| Key | Default | Effect |
|---|---|---|
| `language` | `en_US` | Select the default message locale; `language.yml` only contains overrides and reload sounds |
| `metrics` | `true` | Enable anonymous bStats reporting after a restart |
| `auto_pickup_drops` | `false` | Send hidden drops straight to the player's inventory |
| `suppress_block_drop_on_custom_drop` | `true` | Suppress the block's normal drop when a reward fires |

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
| `enabled` | Master switch. When `false`, HiddenOre does not change generation |
| `global.default` | When `true`, HiddenOre strips all ores from generation |
| `global.<ORE>` | Per-ore exception to `default` |
| `exceptions.<world key>` | Per-world override, keyed by fully qualified world key |

Accepted ore keys: `COAL_ORE`, `COPPER_ORE`, `IRON_ORE`, `GOLD_ORE`, `DIAMOND_ORE`,
`REDSTONE_ORE`, `LAPIS_ORE`, `EMERALD_ORE`, `DEEPSLATE_COAL_ORE`, `DEEPSLATE_COPPER_ORE`,
`DEEPSLATE_IRON_ORE`, `DEEPSLATE_GOLD_ORE`, `DEEPSLATE_DIAMOND_ORE`, `DEEPSLATE_REDSTONE_ORE`,
`DEEPSLATE_LAPIS_ORE`, `DEEPSLATE_EMERALD_ORE`, `NETHER_GOLD_ORE`, `NETHER_QUARTZ_ORE`,
`ANCIENT_DEBRIS`

## Managed blocks

```yaml
blocks:
  stone:
    drop: cobblestone
  deepslate:
    drop: cobbled_deepslate
```

Blocks listed here enter the reward pipeline. `drop` keeps their normal drop.
Mining still behaves like vanilla when no reward fires.

## Veins

| Key | Default | Effect |
|---|---|---|
| `veins.generation` | `seeded` | `seeded` or `pure_random` |
| `veins.allow_placed_blocks` | `false` | Whether player-placed blocks can pay |
| `veins.discovery_sound.sound` | `BLOCK_BEACON_POWER_SELECT` | Sound played on a hit |
| `veins.discovery_sound.volume` | `1.0` | |
| `veins.discovery_sound.pitch` | `1.0` | |

`allow_placed_blocks: false` closes the place-and-remine exploit. HiddenOre
tracks player-placed blocks persistently. Records survive piston movement and
restarts.

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
| `veins_per_chunk` | Average veins per chunk. Fractions are allowed |
| `vein_min_size` / `vein_max_size` | Blocks per vein |
| `min_y` / `max_y` | Vertical band the rule applies in |
| `fortune_multiplier` | Whether Fortune scales the drop |
| `tool_tiers` | Pickaxe tiers that can trigger this rule |
| `exp_drop` | Experience awarded |

### Enforced limits

- 64 veins per chunk for a single rule
- 256 blocks per vein
- 1,024 worst-case target blocks across all item rules
- `exp_drop` no greater than 1,000

Under `seeded`, each item rule gets a stable identity from its material, vein
count, size, and height range. Reordering `drops:` does not move veins.
Inserting or deleting an unrelated rule leaves retained layouts unchanged
except where the rules target the same block. Changing a spatial identity field
changes that rule's undiscovered layout. Changing only `fortune_multiplier`,
`tool_tiers`, or `exp_drop` does not.

Rules with identical spatial identities get separate deterministic occurrence
streams. Duplicates stay supported. List order is not significant.

## Language files

Selected non-English catalogs download when needed. HiddenOre validates them before use and keeps English active if preparation fails. Installed catalogs work offline.

Player preferences are stored by UUID in `language-preferences.properties` in the plugin data folder. `self reset` removes a personal override. The server default applies to console output and players without an override. Sparse local message overrides remain active above the downloaded catalog.

HiddenOre installs catalogs to `plugins/HiddenOre/languages/<locale>.yml`. `/hiddenore language` opens the picker. Debug messages and command feedback use each recipient's selected locale.

### In-game language editor

`/hiddenore language server edit [locale]` opens the inventory editor for a language. Omit the locale to choose one; browsing and editing leave the server default and every personal selection unchanged. Access requires `hiddenore.admin` or `volmit.language.admin`.

Select a message and enter its replacement in private chat. Enter `cancel` or wait 60 seconds to stop. HiddenOre validates placeholders, message shape, and stale edits before saving.

Edits are saved atomically to `plugins/HiddenOre/languages/overrides/<locale>.yml`. They override `language.yml`, which overrides the installed catalog. English overrides work offline. Saving refreshes users of that locale without changing language selections.
