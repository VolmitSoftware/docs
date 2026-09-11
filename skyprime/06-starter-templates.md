---
title: 06 - Starter Templates
description: Custom starter bundles, bounded capture, block data and recovery
published: true
date: 2026-09-05T16:22:45.000Z
tags: skyprime, templates, islands, configuration
editor: markdown
dateCreated: 2026-09-05T16:22:45.000Z
---

Custom starter bundles add administrator-defined islands alongside the procedural `small`, `normal` and `big` choices. A bundle contains a required normal-world template and optional Nether and End templates. Templates preserve block data such as stair direction and leaf persistence; they do not copy entities, container contents, sign text or other block-entity data.

## Choose a starter

Use `/sky template list` to list available custom starters. Players can select an available starter in the creation menu or use `/sky create garden`, replacing `garden` with its ID. `/sky reset garden` selects it for a confirmed terrain reset.

Each bundle has a display name, item icon, description and optional permission. SkyPrime checks the permission in the command flow and again on the selecting player's owning thread before admitting a custom creation or reset. Custom selection requires an online player. Administrative recovery may explicitly select a replacement starter.

## Capture a bundle

Capture requires `skyprime.admin`. Build the source terrain, then select its opposite corners and origin:

1. Use `/sky template pos1` at the first corner. The coordinate is the block containing your feet.
2. Use `/sky template pos2` at the opposite corner, also at your feet.
3. Stand at the intended landing position and use `/sky template origin`. The origin is the block beneath your feet.
4. Use `/sky template capture garden normal` to create the bundle.

All three points must be in the same world. The selection expires after ten minutes. Stay online in that world until capture finishes, and keep every selected chunk loaded. Capture reads one chunk snapshot at a time on its owning region, then processes the snapshot away from world state. It does not generate or load missing chunks.

To attach a Nether or End template, select that source build and its origin, then use `/sky template capture garden nether` or `/sky template capture garden end`. The normal template must already exist. Capture refuses to replace an existing dimension or overwrite an existing normal bundle. Edit the canonical file and reload to replace existing content. If the file changes during an attachment capture, publication is rejected; reload before retrying.

Capture copies non-air blocks and installs a default starter supply list. It does not read the original containers' inventories. Only one capture or catalog reload can run at a time. A capture covers successive chunk snapshots, so avoid editing the source build while it is being captured.

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

After editing files, run `/sky reload`. SkyPrime reads and validates a complete candidate catalog before publishing it. A malformed file rejects the catalog reload and leaves the previous working catalog active. Removing a file removes its bundle on the next successful reload.

If the custom catalog cannot load during startup, SkyPrime logs the full failure and keeps procedural starters and saved world-operation recovery available. Repair the files and reload to make custom choices available again.

## Interrupted operations

Before editing island terrain, SkyPrime saves the selected custom bundle's complete content in that island's world-job descriptor and waits for island-state persistence. The operation uses this immutable content throughout generation and automatic recovery. Editing, removing or reloading the catalog cannot change an already admitted operation.

World-job descriptors have an 8 MiB read and write limit, separate from the 4 MiB template-file limit. Cancelling a custom creation or reset through its API future reaches the admitted job and stops remaining work at operation checks. An interrupted operation retains its descriptor and island reservation for recovery; cancellation does not undo a completed activation.

Recovery repeats the saved generation or reset operation. It does not restore the terrain that existed before a reset. Administrative replacement recovery deliberately uses the newly selected starter. See [04 - Operations & Recovery](/skyprime/04-operations-recovery) for world-operation controls.
