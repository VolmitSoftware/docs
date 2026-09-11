---
title: "HiddenOre: Configuration"
description: "Every hiddenore.toml key and default"
published: true
date: 2026-09-10T04:06:43.496Z
tags: "hiddenore, configuration"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Configuration lives at `plugins/HiddenOre/hiddenore.toml`; the tables below show its defaults. All settings in `hiddenore.toml` and message edits in `languages/<locale>.toml` apply automatically when saved. Invalid mining rules or runtime settings leave the current configuration active. Use the in-game picker or the `language` key to select the server default.

The watcher covers `hiddenore.toml` and locale TOML files directly inside `languages/`, including locale file creation and deletion. It waits for 250 ms without further edits and enforces a 3-second cooldown between reloads. Periodic scans detect changes missed by file events, including files saved by replacing the original.

Automatic reloads notify online operators with a message and the HiddenOre command theme's success sound from VolmLib. The sound uses the `MASTER` category at volume `0.8` and pitch `1.2`.

## Top level

| Key | Default | Effect |
|---|---|---|
| `language` | `en_US` | Select the default message locale |
| `metrics` | `true` | Enable anonymous bStats reporting; enabling or disabling it applies automatically |
| `auto_pickup_drops` | `false` | Send hidden drops straight to the player's inventory |
| `suppress_block_drop_on_custom_drop` | `true` | Suppress the block's normal drop when a reward fires |

Use TOML assignments such as `language = "en_US"`, and place top-level settings before the first table. Single brackets such as `[ore-removal]` define a settings table; each `[[drops]]` adds another reward rule. The default file has short setting comments, generation choices, discovery controls, and one annotated item and command example.

Server-language selection updates only the `language` value in `hiddenore.toml`, preserving comments, other settings, table order, and surrounding formatting.

## In-game configuration editor

`/hiddenore config` opens the inventory editor and requires `hiddenore.admin`. Open tables and individual drop rules to browse their settings. Click a boolean to toggle it; text, numbers, and lists open private chat input. Enter lists as TOML values, such as `["IRON_PICKAXE", "DIAMOND_PICKAXE"]`. Enter `cancel` or wait 60 seconds to stop an edit.

The editor changes existing settings, including adding or removing entries within primitive lists. Add or remove whole tables and drop rules directly in the file. Each save validates the complete configuration, checks that the file still matches the edit's original snapshot, and atomically replaces the selected value. A stale edit is rejected; reopen the editor to use the current file. Comments and formatting outside the edited value stay intact, and the file watcher applies saved changes automatically.

## Ore removal

```toml
[ore-removal]
enabled = false

[ore-removal.global]
default = true
NETHER_GOLD_ORE = false
NETHER_QUARTZ_ORE = false
ANCIENT_DEBRIS = false

[ore-removal.exceptions."minecraft:the_end"]
default = false

[ore-removal.exceptions."minecraft:the_nether"]
default = false
NETHER_GOLD_ORE = true
NETHER_QUARTZ_ORE = true
ANCIENT_DEBRIS = true
```

| Key | Effect |
|---|---|
| `enabled` | Master switch. When `false`, HiddenOre does not change generation |
| `global.default` | When `true`, HiddenOre strips all ores from generation |
| `global.<ORE>` | Per-ore exception to `default` |
| `exceptions.<world key>` | Per-world override, keyed by fully qualified world key |

Ore removal affects newly generated terrain. Removed ores become stone, deepslate, or netherrack according to their material. Each world exception replaces the global settings for that world and uses its own `default` and individual ore overrides; it does not inherit global ore choices. A per-ore value of `true` removes that ore, while `false` keeps it.

Accepted ore keys: `COAL_ORE`, `COPPER_ORE`, `IRON_ORE`, `GOLD_ORE`, `DIAMOND_ORE`,
`REDSTONE_ORE`, `LAPIS_ORE`, `EMERALD_ORE`, `DEEPSLATE_COAL_ORE`, `DEEPSLATE_COPPER_ORE`,
`DEEPSLATE_IRON_ORE`, `DEEPSLATE_GOLD_ORE`, `DEEPSLATE_DIAMOND_ORE`, `DEEPSLATE_REDSTONE_ORE`,
`DEEPSLATE_LAPIS_ORE`, `DEEPSLATE_EMERALD_ORE`, `NETHER_GOLD_ORE`, `NETHER_QUARTZ_ORE`,
`ANCIENT_DEBRIS`

## Managed blocks

```toml
[blocks.stone]
drop = "cobblestone"

[blocks.deepslate]
drop = "cobbled_deepslate"
```

Blocks listed here enter the reward pipeline. Item and command rewards require a pickaxe and a player outside Creative mode. `drop` selects the single base item to give when no reward fires, or alongside a reward when `suppress_block_drop_on_custom_drop` is `false`. Add another `[blocks.<material>]` table to manage a different block. Automatic pickup includes these base items and hidden item rewards; overflow drops at the mined block and experience remains in orbs.

## Veins

| Key | Default | Effect |
|---|---|---|
| `veins.generation` | `seeded` | `seeded` or `pure_random` |
| `veins.allow_placed_blocks` | `false` | Whether player-placed blocks can pay |
| `veins.discovery_sound.sound` | `BLOCK_BEACON_POWER_SELECT` | Bukkit sound name or namespaced sound key; unknown names use the default |
| `veins.discovery_sound.volume` | `1.0` | Nonnegative loudness; `0.0` silences discovery |
| `veins.discovery_sound.pitch` | `1.0` | Pitch from `0.5` through `2.0`; `1.0` is normal |

The complete generation choices are `seeded`, which creates fixed hidden reward positions from the world seed, and `pure_random`, which rolls item rewards at each eligible break. Vein detection can find seeded positions; it returns no veins in random mode.

Discovery sound plays only to the miner. In seeded mode it plays when the first eligible mined block of a vein successfully awards an item; in random mode it plays for each successful item reward. Command rewards do not play discovery sound. There is no separate discovery-mode setting.

`allow_placed_blocks = false` closes the place-and-remine exploit. HiddenOre
tracks player-placed blocks persistently. Records survive piston movement and
restarts.

## Drops

Each `[[drops]]` table defines one reward rule. Item rules use these fields:

```toml
[[drops]]
item = "coal"
veins_per_chunk = 2.2
vein_min_size = 5
vein_max_size = 20
min_y = 0
max_y = 320
fortune_multiplier = true
tool_tiers = [ "WOODEN_PICKAXE", "STONE_PICKAXE", "COPPER_PICKAXE", "IRON_PICKAXE",
               "GOLDEN_PICKAXE", "DIAMOND_PICKAXE", "NETHERITE_PICKAXE" ]
exp_drop = 2
```

| Key | Effect |
|---|---|
| `item` | Material to award; one item per successful block before Fortune |
| `veins_per_chunk` | Average veins per chunk. Fractions are allowed |
| `vein_min_size` / `vein_max_size` | Inclusive target size in blocks; overlapping positions and vein shape can reduce the actual count |
| `min_y` / `max_y` | Inclusive vertical band; seeded placement clips to the world's height |
| `fortune_multiplier` | Whether Fortune scales the drop |
| `tool_tiers` | Explicit list of allowed tools, rather than a minimum tier |
| `exp_drop` | Maximum XP points; each reward rolls a whole number from `0` through this value |

The supported tool tiers are `WOODEN_PICKAXE`, `STONE_PICKAXE`, `COPPER_PICKAXE`, `IRON_PICKAXE`, `GOLDEN_PICKAXE`, `DIAMOND_PICKAXE`, and `NETHERITE_PICKAXE`. Mining a seeded reward position with a disallowed tier still consumes that position.

In `pure_random` mode, item chance is `veins_per_chunk * average vein size / (256 * number of Y levels)`. Item rules roll in file order and stop at the first successful chance roll, even if the tool is disallowed. A count of zero disables that item rule.

### Enforced limits

- 64 veins per chunk for a single rule
- 256 blocks per vein
- 1,024 worst-case target blocks across all item rules
- `exp_drop` no greater than 1,000

Under `seeded`, each item rule gets a stable identity from its material, vein
count, size, and height range. Reordering `[[drops]]` tables does not move veins.
Inserting or deleting an unrelated rule leaves retained layouts unchanged
except where the rules target the same block. Changing a spatial identity field
changes that rule's undiscovered layout. Changing only `fortune_multiplier`,
`tool_tiers`, or `exp_drop` does not.

Rules with identical spatial identities get separate deterministic occurrence
streams. Duplicates stay supported. List order is not significant.

### Command rewards

Command rules use `type = "command"`, a nonempty `commands` list, `chance`, inclusive `min_y` and `max_y`, and `execute_as`. They roll independently in both generation modes, including when no item reward fires. Every command in a successful rule runs.

`chance` is a fraction from `0.0` to `1.0`: the bundled `0.0005` means `0.05%`, or about one success per 2,000 eligible breaks. `execute_as` accepts `"console"` or `"player"`; a command's `console:` or `player:` prefix overrides that choice. Player commands use the miner's permissions.

Commands can use `%player%`, `%uuid%`, `%world%`, and the mined block's `%x%`, `%y%`, and `%z%`. Item-rule tool lists and Fortune settings do not apply to command rules.

## Language files

Startup creates editable `plugins/HiddenOre/languages/en_US.toml` when missing. Selected non-English catalogs download only when their local language file is missing. Existing files preserve local changes and work offline. Missing or invalid message values fall back to built-in English individually while valid translations stay active and the selected locale remains saved. If the whole file is unreadable or its download fails, messages use English while the requested language choice remains saved. Saving a repaired locale file refreshes it automatically.

Player preferences are stored by UUID in `plugins/HiddenOre/languages/language-preferences.properties`. `self reset` removes a personal override. The server default applies to console output and players without an override.

Automatic language updates retain personal choices and refresh their messages. A player may briefly receive server-default text while the selected locale loads.

HiddenOre reads and edits catalogs at `plugins/HiddenOre/languages/<locale>.toml`. Each uses grouped TOML sections and starts with translated comments explaining color codes, the chat `prefix`, and runtime variables. The filename selects the locale; root keys such as `prefix` remain at the top level. `/hiddenore language` opens the picker. Debug messages and command feedback use each recipient's selected locale.

Use `&0` through `&f` for colors, `&k` through `&o` for text decorations, `&r` to reset formatting, and `&#RRGGBB` for hex colors. Keep runtime variables such as `{block}` unchanged. End the prefix's formatting with `&r` before its trailing space.

```toml
prefix = "&a[HiddenOre]&r "

[debug]
player_placed = "&cPlayer-placed {block}, no hidden drops.&r"
```

### In-game language editor

`/hiddenore language server edit [locale]` opens the inventory editor for a language. Omit the locale to choose one; browsing and editing leave the server default and every personal selection unchanged. Access requires `hiddenore.admin` or `volmit.language.admin`.

Select a message and enter its replacement in private chat. Enter `cancel` or wait 60 seconds to stop. HiddenOre validates placeholders, message shape, and stale edits before saving.

Edits are saved atomically to `plugins/HiddenOre/languages/<locale>.toml`, including `en_US.toml`. Saving refreshes users of that locale without changing language selections.
