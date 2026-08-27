---
title: "Prismatic Caves"
description: "Paired atlas entry for the 16 direct prismatic cave roots"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris, biome-atlas, cave"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

The Prismatic region selects 16 color-specific cave roots, one slot each, in both Overworld 4002 and Underworld 1005. They share one cave design and differ primarily in their color material set, so this family page documents all 16 without hiding any direct key.

> Atlas snapshot: Overworld 4002 and Underworld 1005. Re-audit this page whenever either pinned pack revision changes.

## Selection role and weight

Each key occupies `1/16` cave-selection slots in `prismatics`. The region declares rarity `20` (relative region weight `1/20`); every root declares the default biome rarity `1` (relative biome weight `1/1`). These are conditional slot shares, not whole-world probabilities.

## Shared carving design

**Overworld.** Enabled local cave profile with declared vertical range `6..760`; sample step `2`; surface clearance `5`; surface breaking `enabled`; fluids `allowed`; lava `allowed`; a minimum depth below surface of `18`.

**Underworld.** Enabled local cave profile with declared vertical range `6..760`; sample step `2`; surface clearance `5`; surface breaking `enabled`; fluids `allowed`; lava `allowed`; a minimum depth below surface of `18`.

No member declares a surface generator band. The selected root paints the cave volume with its own wall, ceiling and floor palettes, decorators and child patch.

## The 16 direct roots

| Direct key | Overworld primary palette | Underworld primary palette | Child-only key |
|------------|---------------------------|----------------------------|----------------|
| `carving/prismatic-black` | `minecraft:blackstone`, `minecraft:polished_blackstone`, `minecraft:black_concrete_powder`, `minecraft:basalt`, `minecraft:black_concrete`, and 2 more | `minecraft:blackstone`, `minecraft:polished_blackstone`, `minecraft:basalt`, `minecraft:obsidian`, `minecraft:crying_obsidian` | `carving/prismatic-black-child` |
| `carving/prismatic-blue` | `minecraft:blue_terracotta`, `minecraft:blue_concrete_powder`, `minecraft:lapis_block`, `minecraft:packed_ice`, `minecraft:blue_concrete`, and 1 more | `minecraft:warped_wart_block`, `minecraft:crying_obsidian`, `minecraft:soul_soil` | `carving/prismatic-blue-child` |
| `carving/prismatic-brown` | `minecraft:packed_mud`, `minecraft:mud_bricks`, `minecraft:rooted_dirt`, `minecraft:brown_concrete_powder`, `minecraft:clay`, and 1 more | `minecraft:soul_soil`, `minecraft:nether_bricks` | `carving/prismatic-brown-child` |
| `carving/prismatic-cyan` | `minecraft:prismarine`, `minecraft:dark_prismarine`, `minecraft:cyan_concrete_powder`, `minecraft:prismarine_bricks`, `minecraft:cyan_concrete`, and 1 more | `minecraft:quartz_bricks`, `minecraft:warped_nylium` | `carving/prismatic-cyan-child` |
| `carving/prismatic-gray` | `minecraft:basalt`, `minecraft:polished_basalt`, `minecraft:gray_concrete_powder`, `minecraft:tuff`, `minecraft:gray_concrete`, and 1 more | `minecraft:basalt`, `minecraft:polished_basalt`, `minecraft:polished_blackstone`, `minecraft:smooth_basalt` | `carving/prismatic-gray-child` |
| `carving/prismatic-green` | `minecraft:moss_block`, `minecraft:green_terracotta`, `minecraft:green_concrete_powder`, `minecraft:rooted_dirt`, `minecraft:green_concrete`, and 1 more | `minecraft:warped_wart_block`, `minecraft:warped_nylium`, `minecraft:soul_soil`, `minecraft:magma_block` | `carving/prismatic-green-child` |
| `carving/prismatic-light-blue` | `minecraft:light_blue_concrete_powder`, `minecraft:packed_ice`, `minecraft:snow_block`, `minecraft:light_blue_concrete`, `minecraft:blue_ice` | `minecraft:warped_wart_block`, `minecraft:soul_soil` | `carving/prismatic-light-blue-child` |
| `carving/prismatic-light-gray` | `minecraft:calcite`, `minecraft:light_gray_concrete_powder`, `minecraft:smooth_quartz`, `minecraft:bone_block`, `minecraft:light_gray_concrete` | `minecraft:basalt`, `minecraft:quartz_bricks`, `minecraft:smooth_quartz`, `minecraft:bone_block` | `carving/prismatic-light-gray-child` |
| `carving/prismatic-lime` | `minecraft:moss_block`, `minecraft:lime_concrete_powder`, `minecraft:lime_terracotta`, `minecraft:rooted_dirt`, `minecraft:lime_concrete`, and 1 more | `minecraft:warped_wart_block`, `minecraft:warped_nylium`, `minecraft:soul_soil`, `minecraft:magma_block` | `carving/prismatic-lime-child` |
| `carving/prismatic-magenta` | `minecraft:magenta_terracotta`, `minecraft:purpur_pillar`, `minecraft:magenta_concrete_powder`, `minecraft:magenta_concrete`, `minecraft:purpur_block`, and 1 more | `minecraft:nether_wart_block`, `minecraft:polished_basalt`, `minecraft:crying_obsidian` | `carving/prismatic-magenta-child` |
| `carving/prismatic-orange` | `minecraft:orange_terracotta`, `minecraft:orange_concrete_powder`, `minecraft:honeycomb_block`, `minecraft:raw_copper_block`, `minecraft:orange_concrete`, and 2 more | `minecraft:magma_block`, `minecraft:gilded_blackstone` | `carving/prismatic-orange-child` |
| `carving/prismatic-pink` | `minecraft:pink_terracotta`, `minecraft:cherry_planks`, `minecraft:pink_concrete_powder`, `minecraft:pink_concrete` | `minecraft:crimson_nylium`, `minecraft:warped_planks` | `carving/prismatic-pink-child` |
| `carving/prismatic-purple` | `minecraft:purple_terracotta`, `minecraft:amethyst_block`, `minecraft:purple_concrete_powder`, `minecraft:obsidian`, `minecraft:purple_concrete`, and 1 more | `minecraft:crying_obsidian`, `minecraft:glowstone`, `minecraft:obsidian` | `carving/prismatic-purple-child` |
| `carving/prismatic-red` | `minecraft:red_terracotta`, `minecraft:red_concrete_powder`, `minecraft:magma_block`, `minecraft:red_concrete`, `minecraft:netherrack`, and 1 more | `minecraft:nether_bricks`, `minecraft:magma_block`, `minecraft:netherrack` | `carving/prismatic-red-child` |
| `carving/prismatic-white` | `minecraft:calcite`, `minecraft:white_concrete_powder`, `minecraft:quartz_block`, `minecraft:snow_block`, `minecraft:white_concrete`, and 1 more | `minecraft:basalt`, `minecraft:quartz_block`, `minecraft:soul_soil`, `minecraft:smooth_quartz` | `carving/prismatic-white-child` |
| `carving/prismatic-yellow` | `minecraft:yellow_terracotta`, `minecraft:sandstone`, `minecraft:smooth_sandstone`, `minecraft:yellow_concrete_powder`, `minecraft:yellow_concrete`, and 1 more | `minecraft:obsidian`, `minecraft:crying_obsidian`, `minecraft:glowstone` | `carving/prismatic-yellow-child` |

The light-blue root additionally uses `snippet/procedural-objects/frozen/magical-ice-cave` in Overworld and `snippet/procedural-objects/frozen/magical-soul-cave` in Underworld.

## Paired treatment

Overworld members use ordinary stone/deepslate cave foundations and their named color through concrete, concrete powder, terracotta, glass or related accents. Underworld members retain the corresponding color identity while replacing the foundation and decorations with Nether-native blackstone, basalt, magma, glowstone, quartz and pack-specific Underworld objects. Each Underworld root also declares Nether cave spawners and a custom registered Nether biome treatment.

Each root owns one matching `-child` key. Those 16 child-only patches inherit the family identity and are selected only through their corresponding parent; none occupies another region slot.

## Inspect a member in game

Substitute any key from the table:

```text
/iris find biome carving/prismatic-blue
/iris what biome
/iris edit biome carving/prismatic-blue
```

After `find`, descend into the carved volume if the arrival point is above it. `what biome` is the authoritative in-world confirmation.
