---
title: "Loot"
description: "Iris documentation: Loot"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-19T00:00:00.000Z
---
Loot tables decide what appears inside generated chests, what custom mobs drop, and what a broken block gives up. Mobs and spawning are [23b - Entities & Spawners](/iris/23b-entities-spawners). Marker-driven spawns are [23c - Markers](/iris/23c-markers).

Related: [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout), [11 - Dimensions](/iris/11-dimensions), [12 - Regions](/iris/12-regions), [13 - Biomes](/iris/13-biomes), [19 - Objects](/iris/19-objects), [20 - Object Placement](/iris/20-object-placement), [03 - Configuration](/iris/03-configuration), [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

## The mental model

When a chunk finishes generating, Iris walks the blocks it recorded and fills every storage chest it placed. It builds a list of loot tables for that exact block, rolls each one, and drops the results into the inventory. The list comes from up to four sources in this order: the object placement that owns the block, then the dimension, region, surface biome, and cave biome the block sits in. Each source can add to the list, wipe it, or only contribute when nothing else did.

Everything is deterministic from the world seed and the block position, so the same chest at the same coordinates always contains the same items.

Files live at `loot/<key>.json`. The key is the pack-relative path without `.json`, so `loot/tutorial/dungeon-cache.json` is referenced as `tutorial/dungeon-cache`.

| Holder | Field | Effect |
|--------|-------|--------|
| Dimension / region / biome | `loot` | Contributes tables to every container in that scope |
| Object placement | `loot` | Contributes one table to containers the object placed |
| Object placement | `vanillaLoot` | Same, but the table is a real Minecraft loot table |
| Object placement | `overrideGlobalLoot` | Discards the dimension/region/biome contribution for that placement |
| Entity | `loot` | Replaces the mob's vanilla drop table |
| Dimension / region / biome | `blockDrops` | Adds or replaces drops when a player breaks a matching block |

The bundled Overworld pack's dimension-level loot uses `FALLBACK`, so `global-clutter` only reaches chests that nothing else claimed.

## Walkthrough: put custom loot in a dungeon chest

The goal is a chest inside one placed object that rolls your table and ignores the pack's global tables. Prerequisites: a validating pack, an `.iob` object containing at least one chest, and a biome that places it.

**1. Write the table.** `loot/tutorial/dungeon-cache.json`:

```json
{
  "name": "Tutorial Dungeon Cache",
  "rarity": 1,
  "minPicked": 2,
  "maxPicked": 4,
  "maxTries": 24,
  "loot": [
    { "type": "iron_ingot", "rarity": 1, "minAmount": 2, "maxAmount": 6 },
    { "type": "bread", "rarity": 1, "minAmount": 1, "maxAmount": 4 },
    { "type": "diamond", "rarity": 6, "minAmount": 1, "maxAmount": 2 },
    {
      "type": "iron_sword",
      "rarity": 8,
      "minDurability": 0.4,
      "maxDurability": 0.9,
      "displayName": "&7Rusted Blade",
      "enchantments": [{ "enchantment": "sharpness", "minLevel": 1, "maxLevel": 2, "chance": 0.5 }]
    }
  ]
}
```

`maxTries` needs headroom over `maxPicked`, because a try that lands on a rare entry and fails is spent. With four entries and rare items at 1-in-6 and 1-in-8, 24 tries reliably reaches 2-4 picks.

**2. Bind it to the placement.** In the biome that places your object, on the `objects[]` entry:

```json
{
  "place": ["tutorial/dungeon"],
  "chance": 0.02,
  "overrideGlobalLoot": true,
  "loot": [
    { "name": "tutorial/dungeon-cache", "weight": 1 }
  ]
}
```

`overrideGlobalLoot: true` means chests inside this object use only this table. Drop it if you want the pack's dimension and region tables mixed in.

**3. Verify.** Open the pack in Studio, find a placement, and open the chest. Every chest in that object should hold 2-4 stacks drawn from the four entries. Diamonds show up in roughly one placement in six, swords in roughly one in eight. To check without hunting for a placement, stand on a block and run `/iris studio loot`: it previews the tables that would fill a chest at your feet and adds debug lore naming the source table and its combined chance. That command is Bukkit and Studio only.

**4. If chests come up empty.**

- The block must be a storage chest. Iris only fills chest-family containers and only ever requests the `STORAGE` slot type, so `FUEL`/`FURNACE`/`BLAST_FURNACE`/`SMOKER` entries never land in a generated container.
- `world.postLoadBlockUpdates` must be on in `iris.json`. The container fill runs as part of that pass.
- The loot table key must resolve. A missing table logs a warning and contributes nothing.
- Double chests fill from one half only (lower X, then lower Z). That half fills the combined inventory, so an empty-looking half is normal.

## How a container actually gets filled

Worth reading before tuning rarities, because two of these steps surprise people.

1. **Trigger.** After a chunk's mantle materializes, the post-load update pass visits every block Iris flagged. Only storage chests proceed, and only the `STORAGE` slot type is ever requested. Objects placed into an already-live world (Studio placement, WorldEdit-driven placement) fill their chests immediately instead.

2. **Source list.** Iris asks the object placement that owns the block for at most one table. Candidates are bucketed by how specifically they match: entries with an `exact` block-data filter that matches win outright, then entries whose filter matches the block's material, then entries with no filter. Within the winning bucket the pick is weighted by `weight`, and `loot` and `vanillaLoot` entries compete in the same buckets. If the placement sets `overrideGlobalLoot` and a table was picked, that is the entire list.

3. **Environment sources.** Otherwise the dimension, region, and surface biome each inject their tables in that order. A cave biome injects too when the container is below terrain height and resolves to a different biome than the surface. `ADD` appends. `REPLACE` wipes the list first and then appends its own. `CLEAR` wipes the list and contributes nothing, so any tables listed on a `CLEAR` reference are dead and `/iris pack validate` warns about them. `FALLBACK` injects only when nothing already claimed the container.

4. **Multiplier.** The multipliers from every contributing scope are multiplied together, and the resulting factor scales the **length of the table list**, not stack sizes. A factor of 0.5 randomly drops half the tables; 2 randomly duplicates entries until the list doubles. The list is capped at 256 sources and Iris throws rather than silently truncating past that.

5. **Event hook.** On Bukkit, `art.arcane.iris.world.event.IrisLootEvent` fires with the engine, block, slot type, and the resolved mutable table list, so a plugin can add, remove, or clear tables before the roll. Rolled items are also bridged through Bukkit's `LootGenerateEvent`. Neither is part of the documented public API surface in the `90`-series pages.

6. **Roll.** For each table: pick a random target count between `minPicked` and `maxPicked`, then loop up to `maxTries`. Each try picks a random entry index. The entry only counts if its `slotTypes` is `STORAGE` and it passes a 1-in-(table `rarity` x entry `rarity`) check. That check is derived from the loot seed, the table's key, the entry index, and the block coordinates, not from a running random sequence. **The same entry at the same block always gives the same answer**, so tries that re-roll a rare entry that already failed are wasted. This is why `maxTries` should sit well above `maxPicked` when a table has rare entries.

7. **Scatter.** Items are inserted, one multi-item stack is split into a free slot, and all slots are shuffled so a chest reads like a hand-placed one.

Modded servers run the same resolver and the same rarity math, so container contents match Bukkit for a given seed and position. Modded resolves `vanillaLoot` names against the server's loot-table registry; Bukkit resolves them through `Bukkit.getLootTable` and delegates the roll to Minecraft.

If saved biome information is still loading, unfinished container updates stay pending and retry on a later pass. Already-completed updates are not rolled again.

## Loot tables (`IrisLootTable`)

Folder: `loot/`.

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `name` | string | `""` | Human label shown in Studio debug lore. Required, at least 2 characters. Not the lookup key — that is the file path |
| `rarity` | int >= 1 | `1` | Multiplied into every entry's rarity. Raise it to make a whole table rare without editing each entry. Leave at 1 and tune entries individually |
| `minPicked` | int 0..64 | `1` | Floor of the random target count. Set to 0 when a chest is allowed to come out empty |
| `maxPicked` | int 1..64 | `5` | Ceiling of the random target count. This is the most items one table can contribute |
| `maxTries` | int 1..256 | `10` | How many entry draws are allowed before the table gives up. Raise it when entries have high rarity, or the table will routinely undershoot `minPicked` |
| `loot` | `IrisLoot[]` | `[]` | The entries. An empty table contributes nothing and is not an error |

### Loot entry (`IrisLoot`, snippet type `loot`)

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `type` | string | `""` | Required. A plain material name (`diamond`, `DIAMOND_SWORD`). Namespaced values are reserved for items from other plugins or mods, resolved through the external-data service — `minecraft:` prefixes are not the pattern here |
| `slotTypes` | `InventorySlotType` | `STORAGE` | Which inventory slot family the entry targets. Generated containers only ever request `STORAGE`, so `FUEL`, `FURNACE`, `BLAST_FURNACE`, and `SMOKER` entries are inert in world generation |
| `rarity` | int >= 1 | `1` | 1-in-N chance for this entry, multiplied by the table's rarity. Use it to make one entry rare inside an otherwise common table |
| `minAmount` / `maxAmount` | int 1..64 | `1` / `1` | Inclusive stack-size range rolled per pick |
| `displayName` | string | null | Item name. `&` color codes are translated |
| `lore` | string[] | `[]` | Lore lines. Lines over 24 characters are word-wrapped into several lines |
| `minDurability` / `maxDurability` | 0..1 | `0` / `1` | Fraction of durability *remaining*, rolled per pick. `0`/`1` gives anything from nearly broken to pristine. Set both to 1 for undamaged gear |
| `customModel` | int | null | Custom model data, written into the item's model-data component as a float. For resource packs that key off model data |
| `unbreakable` | boolean | `false` | Marks the item unbreakable |
| `itemFlags` | string[] | `[]` | Bukkit `ItemFlag` names, for hiding enchantments or attributes in the tooltip. Unrecognised names are skipped silently |
| `enchantments` | `IrisEnchantment[]` | `[]` | Each has its own level range and application chance |
| `attributes` | `IrisAttributeModifier[]` | `[]` | Attribute modifiers baked into the item |
| `dyeColor` | string | null | A `DyeColor` name, applied to items that are colourable |
| `leatherColor` | string | null | `#RRGGBB`, applied to leather armour |
| `customNbt` | object | null | Raw platform NBT merged into the item. Also carries the payload for namespaced third-party items |

When Studio debug is on (`/iris studio loot`, or any roll in a Studio world), each item gains lore naming the source table and the combined 1-in-N chance. That lore is not written in production worlds.

### Loot reference (`IrisLootReference`, snippet type `loot-registry`)

The shape used by dimension, region, biome, and entity `loot` fields:

```json
{
  "loot": {
    "mode": "FALLBACK",
    "multiplier": 0.5,
    "tables": ["temperate/clutter", "temperate/food"]
  }
}
```

| Field | Type | Default | What it does |
|-------|------|---------|--------------|
| `mode` | `IrisLootMode` | `ADD` | How this scope's tables combine with the scopes above it — see below |
| `tables` | string[] | `[]` | Loot table keys. A key that does not resolve is skipped |
| `multiplier` | double 0..16 | `1` | Scales how many tables end up in the final list for containers in this scope. Below 1 randomly drops tables, above 1 randomly duplicates them. Multiplied across every contributing scope |

| Mode | Behavior |
|------|-----------|
| `ADD` | Append these tables to whatever the outer scopes contributed. The default and the right choice most of the time |
| `REPLACE` | Wipe the list, then append these. Use on a biome that should ignore the dimension's global tables |
| `CLEAR` | Wipes every parent table and adds nothing, even if tables are listed here (the validator warns about dead entries). Use it to make an area drop no Iris loot |
| `FALLBACK` | Only contribute when nothing already claimed the container — no object `loot`, no object `vanillaLoot`, no native loot table on the block. This lets a pack provide a broad filler table without stepping on structure chests |

Entities read only `tables` from this object. Setting `mode` or `multiplier` on an entity's `loot` has no effect.

### Object loot

On `IrisObjectPlacement` (see [20 - Object Placement](/iris/20-object-placement)):

| Field | What it does |
|-------|--------------|
| `loot` | `IrisObjectLoot[]` — Iris tables offered to containers this placement created |
| `vanillaLoot` | `IrisObjectVanillaLoot[]` — Minecraft loot table keys offered the same way |
| `overrideGlobalLoot` | When a table was picked from this placement, stop there and skip dimension, region, and biome tables |

Both entry types share the same fields:

| Field | Default | What it does |
|-------|---------|--------------|
| `name` | required | The Iris loot table key, or for `vanillaLoot` a namespaced Minecraft loot table key such as `minecraft:chests/simple_dungeon` |
| `weight` | `1` | Relative odds inside its match bucket. Entries with weight 0 or below are ignored entirely |
| `filter` | `[]` | Blocks this entry applies to. Empty means every container the object placed |
| `exact` | `false` | Compare the whole block state instead of just the material. An exact match outranks a material match, which outranks an unfiltered entry |

One table is picked per container, not one per entry. The buckets decide which entries are eligible and `weight` decides between them.

## Custom block drops (`IrisBlockDrops`, snippet type `block-drops`)

Dimensions, regions, and biomes accept `blockDrops[]`. When a player breaks a block, matching providers from the biome run first. Unless a matching biome provider sets `skipParents`, matching region and then dimension providers are appended.

| Field | Default | What it does |
|-------|---------|--------------|
| `blocks` | `[]` | Required. Block types this rule reacts to |
| `exactBlocks` | `false` | False matches on material alone, so any barrel matches `minecraft:barrel`. True requires the full block state, so `minecraft:barrel[axis=x]` matches only that orientation |
| `drops` | `[]` | `IrisLoot[]`. Each entry rolls its own `rarity` independently — unlike loot tables there is no pick count or try budget, so every entry gets exactly one chance |
| `skipParents` | `false` | On a matching biome provider, stops region and dimension providers running for this break. Use it when a biome needs to fully own a block's drops |
| `replaceVanillaDrops` | `false` | If any matching provider sets this, vanilla drops are suppressed while Iris drops from every selected provider still fire |

```json
{
  "blocks": [{ "block": "minecraft:stone" }],
  "exactBlocks": false,
  "drops": [{ "type": "flint", "rarity": 4 }],
  "skipParents": false,
  "replaceVanillaDrops": false
}
```

This runs on Bukkit and on Fabric, Forge, and NeoForge. If the saved biome record for that position is still loading, Iris cancels the break attempt without changing the block or its drops — try again shortly. Blocks no drop rule could match are never delayed.

## Content unavailable on this Minecraft version

Items, enchantments, and potion effects added in a newer Minecraft do not exist on an older server. Iris checks each key against the live registry when the pack loads and removes only what cannot work. See [25 - Pack Management](/iris/25-pack-management) for the gate, the startup listing, and `/iris pack compat`.

| What is missing | Effect |
|-----------------|--------|
| An item on an `IrisLoot` entry | That loot entry is dropped. The rest of the table still rolls. A loot table with no entries left is excluded, and `loot.tables` references to it are dropped |
| An enchantment on a loot entry | The enchantment is dropped on its own. The item still generates, unenchanted by that entry |

Dropping is silent at runtime. The complete list is printed once at startup and available from `/iris pack compat`.

## Add loot to a pack

1. Write `loot/<key>.json` tables. Give `maxTries` room above `maxPicked` if any entry is rare.
2. Reference them from `loot.tables` on a dimension, region, or biome, or from `loot[].name` on an object placement.
3. Confirm `world.postLoadBlockUpdates` is true in `iris.json` (see [03 - Configuration](/iris/03-configuration)).
4. Open Studio and use `/iris studio loot` for chest previews on Bukkit.
