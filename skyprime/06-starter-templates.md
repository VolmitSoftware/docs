---
title: SkyPrime - Starter templates
description: Custom starter bundles, bounded capture, block data and recovery
published: true
date: 2026-10-14T00:00:00.000Z
tags: skyprime, templates, islands, configuration
editor: markdown
dateCreated: 2026-09-05T16:22:45.000Z
---

Custom starter bundles add administrator-defined islands alongside the procedural `small`, `normal` and `big` choices. A bundle contains a required normal-world template and optional Nether and End templates. Templates preserve block data such as stair direction and leaf persistence. In-game capture does not copy block-entity data; supported schematic imports can preserve plain container inventories and literal sign content. Neither path copies entities.

## Choose a starter

Use `/sky template list` to list available custom starters. Players can select an available starter in the creation menu or use `/sky create garden`, replacing `garden` with its ID. `/sky reset garden` selects it for a confirmed terrain reset.

Each bundle has a display name, item icon, description and an optional permission. Choosing a custom starter requires an online player.

## Preview before creating or resetting

Selecting a starter opens its details before creation or reset. Choose an available dimension to inspect it, or choose Use this starter to continue the original operation. Previewing never creates or resets your island. Built-in starters offer Normal, Nether and End previews; custom starters offer only the dimensions included in their bundle. Built-in terrain varies by island seed, so its preview represents the starter rather than the exact terrain of a future island. Custom preview terrain uses the retained bundle selected for that preview.

`/sky preview start <starter> [dimension=normal]` opens an isolated spectator world; `dimension` accepts `normal`, `nether` or `end`. `/sky preview leave` returns to your previous location and mode. Entry requires `skyprime.use`, `skyprime.preview` and any custom-starter permission. Dismount and remove any item held on your inventory cursor first. At most four sessions can exist at once, including preparation and recovery. Active previews end after 120 seconds; preparation has its own 120-second bound. These limits are fixed, not configuration settings. The viewing radius is the configured initial island radius capped at 64 blocks. Before entry, SkyPrime loads one border-area chunk per tick and retains at most 81 chunk tickets per preview until safe world unloading; this keeps unsaved preview terrain available throughout inspection. Normal-world previews use noon; Nether and End previews do not set a world clock.

The preview blocks terrain changes, inventory interaction, item pickup/drop, damage, experience-change events, external teleports and game-mode changes. Piston movement, hopper transfers, fluids, fire, block physics and entity portal travel are also blocked in preview worlds. Commands are blocked except `/sky preview leave`, which remains usable after permission loss. Your inventory and experience are left in place rather than copied into a second inventory. Event protections do not prevent another plugin from directly changing inventory or experience; returning does not overwrite their current contents or values from a snapshot. When the server exposes cancellable advancement-criterion events, previews block criterion grants and their rewards: supported Paper versions and Spigot 26.3 provide this capability. Spigot 26.1 and 26.2 do not expose that event, so entering a preview may still award vanilla or datapack advancement criteria and rewards. SkyPrime does not copy or roll back advancement state. Losing required access ends the preview automatically. Quit, shutdown and reconnect handling restore the saved state; see [Operations and recovery](/skyprime/04-operations-recovery) for interrupted-session recovery.

## Capture a bundle

Capture requires `skyprime.admin`. Build the source terrain, then select its opposite corners and origin:

1. Use `/sky template pos1` at the first corner. The coordinate is the block containing your feet.
2. Use `/sky template pos2` at the opposite corner, also at your feet.
3. Stand at the intended landing position and use `/sky template origin`. The origin is the block beneath your feet.
4. Use `/sky template capture garden normal` to create the bundle.

All three points must be in the same world, and the selection expires after ten minutes. Stay online in that world until capture finishes and keep every selected chunk loaded; capture never loads or generates a missing chunk.

To attach a Nether or End template, select that source build and its origin, then use `/sky template capture garden nether` or `/sky template capture garden end`. The normal template must already exist. Capture refuses to replace an existing dimension or overwrite an existing normal bundle. Edit the canonical file and reload to replace existing content. If the file changes during an attachment capture, publication is rejected; reload before retrying.

Capture copies non-air blocks and installs a default starter supply list; it does not read the original containers' inventories. Capture, import and catalog reload share a single active operation. Capture reads chunk by chunk, so do not edit the source build while it runs.

## Landing and supplies

Block coordinates in a template are offsets from the destination island center and configured base Y. SkyPrime reserves the following landing area in every custom dimension:

| Position relative to origin | Generated content |
| --- | --- |
| X -1 through 3, Z -1 through 1, Y 0 | Stone floor |
| Same X/Z area, Y 1 through 3 | Air |
| X 2, Y 1, Z 0 | Single starter chest facing west |
| X 0.5, Y 1, Z 0.5 | Main landing point |

These placements replace template blocks at those coordinates. Keep decorations and mechanisms outside this reserved area. The chest is emptied and filled from the dimension's explicit supply map. Other captured containers are placed without their original contents.

If an enabled dimension has no custom template in the selected bundle, SkyPrime generates the procedural `normal` starter for that dimension. A disabled dimension is not generated. Every used template must fit the island's current claim and the destination world's build height before the operation is admitted.

## File format

The canonical path is `plugins/SkyPrime/templates/<id>.json`. The filename and `id` must match. IDs contain 1 to 32 lowercase letters, digits, underscores or hyphens, begin with a letter or digit, and cannot be `small`, `normal` or `big`.

This complete example creates a small garden bundle. Its normal template uses an indexed palette; each block's `state` is the zero-based index into that palette.

```json
{
  "schema": 1,
  "id": "garden",
  "displayName": "Garden",
  "icon": "OAK_SAPLING",
  "description": ["A small garden with a starter tree."],
  "permission": "",
  "dimensions": {
    "normal": {
      "palette": [
        "minecraft:grass_block[snowy=false]",
        "minecraft:oak_log[axis=y]",
        "minecraft:oak_leaves[distance=1,persistent=true,waterlogged=false]"
      ],
      "blocks": [
        {"x": 4, "y": 0, "z": 0, "state": 0},
        {"x": 4, "y": 1, "z": 0, "state": 1},
        {"x": 4, "y": 2, "z": 0, "state": 1},
        {"x": 4, "y": 3, "z": 0, "state": 2}
      ],
      "supplies": {
        "LAVA_BUCKET": 1,
        "WATER_BUCKET": 2,
        "OAK_SAPLING": 2,
        "DIRT": 16,
        "WHEAT_SEEDS": 4,
        "BREAD": 8
      }
    }
  }
}
```

Add `nether` or `end` objects alongside `normal`, using the same palette, blocks and supplies structure. Supply keys and the icon use Bukkit material names. Palette entries use Minecraft block-data strings recognized by the running server. Unknown properties, duplicate object keys, comments, missing fields, unsupported materials and fractional block coordinates are rejected.

Set `permission` to an empty string for unrestricted selection, or to a lowercase permission node such as `skyprime.starter.garden`. Display names have a 64-character limit. Descriptions permit up to eight lines of 160 characters each.

## Limits and reload

| Limit | Maximum |
| --- | --- |
| Bundles in the catalog | 32 |
| Individual file size | 4 MiB |
| Combined catalog file size | 16 MiB |
| Palette entries per dimension | 256 |
| Stored blocks per dimension | 32,768 |
| Selection or template bounding volume | 131,072 blocks |
| Horizontal offsets from origin | -32 through 32 |
| Vertical offsets from origin | -32 through 31 |
| Distinct positions | One block per coordinate |
| Starter supplies | Must fit in one 27-slot chest |

Supply counts must be positive integers no greater than 1,728, and the total stack count must fit the chest. Every dimension requires at least one block, one palette entry and a nonempty supply map. Command blocks, structure blocks, jigsaws, mob spawners, trial spawners, vaults, portal blocks and gateways are unsupported. Template directories and files cannot be symbolic links.

After editing files, run `/sky template reload`. SkyPrime reads and validates a complete candidate catalog before publishing it. A malformed file rejects the catalog reload and leaves the previous working catalog active. Removing a file removes its bundle on the next successful reload.

If the custom catalog cannot load during startup, SkyPrime logs the full failure and keeps procedural starters and saved world-operation recovery available. Repair the files and reload to make custom choices available again.

## Interrupted operations

Before editing island terrain, SkyPrime saves the selected custom bundle's complete content in that island's world-job descriptor and waits for island-state persistence. The operation uses this immutable content throughout generation and automatic recovery. Editing, removing or reloading the catalog cannot change an already admitted operation. After creation, `island-worlds/<UUID>.json` retains the selected starter definition and generated-dimension set. A Nether or End world first generated later uses that retained definition.

World-job descriptors have their own 8 MiB limit, separate from the 4 MiB template-file limit.

> Recovery repeats the saved operation. It does not restore the terrain that existed before a reset.
{.is-warning}

See [Operations and recovery](/skyprime/04-operations-recovery).

## Import a schematic

Place a GZIP-compressed Sponge v2 or v3 `.schem` file in `plugins/SkyPrime/templates/imports/`. Import requires `skyprime.admin` and accepts an online player or console:

```text
/sky template import garden normal garden.schem 8 2 8
/sky preview start garden dimension=normal
/sky create starter=garden
```

The final coordinates specify the origin inside the schematic. Each block is placed relative to that origin. The exported `Offset` is validated but does not change the explicit origin. Import the Normal dimension first; Nether and End imports attach to the same starter ID. Existing dimensions are not overwritten. Use a simple filename, without directories or symbolic links.

The importer validates the complete file before saving the normalized starter bundle. Limits are 4 MiB compressed, 16 MiB decompressed, selection dimensions up to 65×64×65, at most 131,072 selected positions, 256 palette states and 32,768 non-air blocks. The full selection, including air margins, must fit relative coordinates x/z −32 through 32 and y −32 through 31. The file's positive `DataVersion` cannot exceed the running server's version; no DataFixer conversion is performed. Invalid GZIP/NBT, unknown states or indexes, nonempty entity/biome data, and unsupported meaningful payload fields reject the import.

Supported block entities are chests, trapped chests, barrels, shulker boxes, droppers, dispensers, hoppers, and standing/wall/hanging signs. Containers preserve plain vanilla item type, count and local slot, within normal stack limits. Custom item metadata/components, locks, loot tables, custom names and other unsupported payloads are rejected. Hopper transfer cooldown may be absent, −1 or zero and resets to its default.

Signs preserve four literal lines on each side, dye color, glow and wax. Lines have a 384-character limit and cannot contain control codes or section-sign formatting. Styling, click/hover events, translations and selectors are unsupported. The importer accepts supported JSON-text and native-NBT sign encodings according to the schematic data version. Transitional snapshot encodings are unsupported.

Each dimension permits at most 1,024 block entities and 4,096 occupied inventory slots. A block entity in the reserved landing region (relative x −1 through 3, z −1 through 1, y 0 through 3) rejects the import. Ordinary landing blocks are replaced by the normal safe landing and supply-chest policy. Preview, creation, reset and interrupted-job recovery use the retained normalized content; deleting the original `.schem` after import does not remove the starter.
