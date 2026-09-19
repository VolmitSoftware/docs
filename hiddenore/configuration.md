---
title: "HiddenOre: Configuration"
description: "Every hiddenore.toml key and default"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "hiddenore, configuration"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Configuration lives at `plugins/HiddenOre/hiddenore.toml`; the tables below show its defaults. All settings in `hiddenore.toml` and message edits in `languages/<locale>.toml` apply automatically when saved. Invalid mining rules or runtime settings leave the current configuration active. Use the in-game picker or the `language` key to select the server default.

An automatic reload notifies online operators with a message and a sound.

## Top level

| Key | Default | Effect |
|---|---|---|
| `language` | `en_US` | Select the default message locale |
| `metrics` | `true` | Enable anonymous bStats reporting; enabling or disabling it applies automatically |
| `auto_pickup_drops` | `false` | Send mined hidden drops straight to the player's inventory; blast mining rewards always drop on the ground |
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

### Iris worlds

Iris removes its own ores. For an Iris world set `hideOresForHiddenOre` to
`true` on the Iris dimension rather than enabling `[ore-removal]` for it: Iris
skips its ore generators during terrain and rewrites any vanilla ore a deposit,
object, or imported vanilla feature placed, leaving nothing for a block
populator to find. Ore removal on top of that rescans every generated chunk
column for ores that are already gone.

An Iris dimension leaves stone, deepslate, netherrack, or blackstone where its
ores would have been, so `[blocks]` needs a table for whichever of those the
dimension's rock actually is. The default `[blocks.stone]` and
`[blocks.deepslate]` cover an ordinary overworld pack. Drop-rule `min_y` and
`max_y` stay world Y; an Iris ore `range` is engine-local Y where 0 is the
bottom of the dimension, so its numbers do not carry across. See
[Iris — Integrations](/iris/28-integrations).

## Managed blocks

```toml
[blocks.stone]
drop = "cobblestone"

[blocks.deepslate]
drop = "cobbled_deepslate"
```

Blocks listed here enter the reward pipeline. When mined, item and command rewards require a pickaxe and a player outside Creative mode; a qualifying explosion can also pay them, see [Blast mining](#blast-mining). `drop` selects the single base item to give when no reward fires, or alongside a reward when `suppress_block_drop_on_custom_drop` is `false`. Add another `[blocks.<material>]` table to manage a different block. Automatic pickup includes these base items and hidden item rewards; overflow drops at the mined block and experience remains in orbs.

## Veins

| Key | Default | Effect |
|---|---|---|
| `veins.generation` | `seeded` | `seeded` or `pure_random` |
| `veins.allow_placed_blocks` | `false` | Whether player-placed blocks can pay |
| `veins.max_targets_per_chunk` | `1024` | Ceiling on combined worst-case reward positions per chunk, `1` through `16384` |
| `veins.discovery_sound.sound` | `BLOCK_BEACON_POWER_SELECT` | Bukkit sound name or namespaced sound key; unknown names use the default |
| `veins.discovery_sound.volume` | `1.0` | Nonnegative loudness; `0.0` silences discovery |
| `veins.discovery_sound.pitch` | `1.0` | Pitch from `0.5` through `2.0`; `1.0` is normal |

The complete generation choices are `seeded`, which creates fixed hidden reward positions from the world seed, and `pure_random`, which rolls item rewards at each eligible break. Vein detection can find seeded positions; it returns no veins in random mode.

Discovery sound plays only to the miner. In seeded mode it plays when the first eligible mined block of a vein successfully awards an item; in random mode it plays for each successful item reward. Command rewards do not play discovery sound. There is no separate discovery-mode setting.

`allow_placed_blocks = false` closes the place-and-remine exploit. HiddenOre
tracks player-placed blocks persistently. Records survive piston movement and
restarts.

## Blast mining

Explosions normally destroy managed blocks without paying anything. `[blast_mining]` lets a
qualifying explosion award the same hidden rewards a pickaxe would.

| Key | Default | Effect |
|---|---|---|
| `blast_mining.enabled` | `false` | Whether explosions pay hidden rewards |
| `blast_mining.yield` | `0.5` | Chance each destroyed block pays its reward, `0.0` through `1.0` |
| `blast_mining.tool_tier` | `IRON_PICKAXE` | Pickaxe tier the explosion counts as against each rule's `tool_tiers` |
| `blast_mining.sources` | `[ "TNT", "MINECART_TNT" ]` | Explosion kinds that qualify |

The complete source names are `TNT`, `MINECART_TNT`, `CREEPER`, `END_CRYSTAL`, `FIREBALL`,
`WITHER`, `ENDER_DRAGON`, `BED`, and `RESPAWN_ANCHOR`. Sources are matched on entity and block
type rather than on the server's `EntityType` names, so a rename in a future Minecraft version
cannot silently change what a configured source means. `FIREBALL` covers ghast and blaze fireballs
but never wind charges, which list blocks they only trigger and leave standing. Explosions outside
the list, and every explosion while `enabled = false`, destroy blocks with no hidden reward. An
explosion another plugin creates directly, rather than through one of the listed entities or
blocks, never qualifies and cannot be added to the list. An empty `sources` list is rejected while
`enabled = true`; with `enabled = false` it is accepted and nothing qualifies.

One charge breaks far more blocks than a pickaxe does, so `yield` exists to price that
difference. At the default `0.5` about half the destroyed reward positions pay. A block that
loses its `yield` roll keeps its seeded position unconsumed, but the block itself is gone.

An explosion carries no tool, so `tool_tier` stands in for one: a rule whose `tool_tiers` list
excludes the configured tier pays nothing to an explosion, exactly as a disallowed pickaxe would,
and still consumes the seeded position. Fortune never applies to blast rewards, and they always
drop on the ground even when `auto_pickup_drops` is on, because the player who lit the charge can
be far away or absent.

Rewards go to the player credited with the explosion when there is one: the igniter of primed TNT
and the shooter of a fireball. TNT minecarts, creepers, beds, and redstone-fired charges have no
such player; they still pay, but with no credited player there is no debug output, no command
reward, and `%player%` has nothing to resolve to. Command rules roll once per explosion at the
explosion's own Y level rather than once per block, and only when a player is credited.

Blast rewards do not play the vein discovery sound; a single charge would fire it many times over.
Vein discovery still counts toward statistics.

Blocks the explosion destroys are left to the server, which drops whatever the block's own loot
gives. When `suppress_block_drop_on_custom_drop` is on, a block that paid a hidden reward is
cleared by HiddenOre first, so only the reward drops. This means an exploded block that pays
nothing yields its vanilla loot rather than the `[blocks]` `drop` material configured for mining.

At most 1,024 blocks per explosion are examined for rewards. Placement tracking is cleaned up for
every destroyed block regardless of that cap, and regardless of whether blast mining is enabled.

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
- `veins.max_targets_per_chunk` worst-case target blocks across all item rules, `1,024` by default
- 1,024 managed blocks examined for rewards per explosion
- `exp_drop` no greater than 1,000

A rule charges the shared per-chunk budget as its `veins_per_chunk` rounded up, times its
`vein_max_size`, which is the worst case rather than what it places on average. A rule with a wide
size range therefore spends the budget faster than it fills a chunk: the bundled rules charge 140 of
the default 1,024 while placing about 70 reward positions per chunk, roughly 0.07% of a chunk
column. Raise `veins.max_targets_per_chunk` when the rules you want are refused for combined work.

Denser chunks cost more to generate and to hold. The vein cache is bounded by the positions it holds
as well as by chunk count, so a high ceiling means fewer chunks stay cached and more are recomputed.

Under `seeded`, each item rule gets a stable identity from its material, vein
count, size, and height range. Reordering `[[drops]]` tables does not move veins.
Inserting or deleting an unrelated rule leaves retained layouts unchanged
except where the rules target the same block. Changing a spatial identity field
changes that rule's undiscovered layout. Changing only `fortune_multiplier`,
`tool_tiers`, or `exp_drop` does not.

Rules with identical spatial identities get separate deterministic occurrence
streams. Duplicates stay supported. List order is not significant.

### Command rewards

Command rules use `type = "command"`, a nonempty `commands` list, `chance`, inclusive `min_y` and `max_y`, and `execute_as`. They roll independently in both generation modes, including when no item reward fires. Every command in a successful rule runs. On an explosion the rule rolls once, and only when at least one destroyed managed block reached the reward checks; a charge that breaks no managed blocks rolls no commands. See [Blast mining](#blast-mining).

`chance` is a fraction from `0.0` to `1.0`: the bundled `0.0005` means `0.05%`, or about one success per 2,000 eligible breaks. `execute_as` accepts `"console"` or `"player"`; a command's `console:` or `player:` prefix overrides that choice. Player commands use the miner's permissions.

Commands can use `%player%`, `%uuid%`, `%world%`, and the mined block's `%x%`, `%y%`, and `%z%`. Item-rule tool lists and Fortune settings do not apply to command rules.

## Language files

The server default is the `language` key. Catalogs live at `plugins/HiddenOre/languages/<locale>.toml`, and personal choices in `languages/language-preferences.properties`. Saving a file applies it automatically.

HiddenOre keeps its chat `prefix` as a root key rather than under `runtime`, and its messages use `{block}`-style runtime variables that must be preserved. End the prefix's formatting with `&r` before its trailing space.

```toml
prefix = "&a[HiddenOre]&r "

[debug]
player_placed = "&cPlayer-placed {block}, no hidden drops.&r"
```

`/hiddenore language` opens the picker, and `/hiddenore language server edit` the message editor, which needs `hiddenore.admin` or `volmit.language.admin`. Debug output and command feedback each use the recipient's own locale.

See [Languages](/languages).
