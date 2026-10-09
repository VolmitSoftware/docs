---
title: "Authored Subterrain Features"
description: "Configure bounded faults, cenotes, lava tubes and travertine terraces with underground biomes and retained fluids"
published: true
date: 2026-10-09T16:52:52.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-10-04T12:39:17.121Z
---
Add `subterrainFeatures` to a dimension to place deliberate underground rooms and passages. Each feature has a bounded volume, an absolute Y band, its own biome, solid boundaries and optional retained fluid. Use [cave profiles](/iris/15-caves-carving) alongside these features for surrounding noise caves.

## Four geometry families

| `family` | Geometry |
|---|---|
| `TECTONIC_FAULT` | A long, bending passage with irregular tapered walls, a varying vault and stepped solid side shelves. Requires a length of at least 200 blocks and remains dry |
| `CENOTE` | A round chamber with a domed ceiling, sealed basin and sloping dry bank. Retains water by default |
| `LAVA_TUBE` | An arched tubular passage with tapered ends, elevated side walkways and two connected hornito shafts. Retains lava by default. The shafts end underground within the configured Y band |
| `TRAVERTINE_TERRACES` | Stepped basins with curved retaining rims, raised bank paths and an irregular vaulted chamber that narrows at its ends. Retains water by default |

Set `shapeWarp` toward `1` for asymmetric lobed chambers, variable-width winding passages, and uneven rock floors and vaults. Wet basins have rounded, uneven rock undersides that must also fit inside the configured Y band. Basins retain their fluid. Set `pillarSpacing`, `formationFraction` and `chimneyHeight` to `0` when the room should rely on its eroded boundaries and biome decoration.

`solid` supplies the structural base and material fallback for boundaries, shelves, rims, pillars and rock formations. It accepts a dry, full, opaque vanilla block state without gravity. Air, fluids, waterlogged states, partial blocks, transparent blocks and gravity blocks are not valid boundary materials. `fluidDepth: 0` disables retained fluid. Set optional `fluid` to `"WATER"` or `"LAVA"` independently of the geometry. Omitting `fluid`, or setting it to null, uses water for cenotes and terraces and lava for lava tubes. Tectonic faults remain dry with either value.

## Dimension configuration

Use `mode.type: "OVERWORLD"`, `useMantle: true` and `carvingEnabled: true`, and keep `CARVED` out of `disabledComponents`. Merge this fragment into a dimension with terrain above the chosen bands. The biome files used below are ordinary resources under `biomes/subterrain/` and do not need to appear in a region's `caveBiomes` list.

```json
{
  "subterrainFeatures": [
    {
      "id": "fault-gallery",
      "family": "TECTONIC_FAULT",
      "biome": "subterrain/fault",
      "worldYRange": { "min": -56, "max": 112 },
      "spacing": 640,
      "probability": 0.3,
      "length": 288,
      "radius": 18,
      "height": 48,
      "fluidDepth": 0,
      "pillarSpacing": 32,
      "formationFraction": 0.12,
      "solid": "minecraft:stone",
      "priority": 10
    },
    {
      "id": "calcite-cenote",
      "family": "CENOTE",
      "biome": "subterrain/cenote",
      "worldYRange": { "min": -56, "max": 112 },
      "spacing": 384,
      "probability": 0.25,
      "radius": 48,
      "height": 48,
      "fluidDepth": 6,
      "pillarSpacing": 24,
      "formationFraction": 0.18,
      "solid": "minecraft:calcite",
      "priority": 20
    },
    {
      "id": "basalt-tube",
      "family": "LAVA_TUBE",
      "biome": "subterrain/lava",
      "worldYRange": { "min": -56, "max": 112 },
      "spacing": 768,
      "probability": 0.2,
      "length": 320,
      "radius": 20,
      "height": 24,
      "fluidDepth": 4,
      "chimneyHeight": 24,
      "pillarSpacing": 0,
      "formationFraction": 0.1,
      "solid": "minecraft:basalt",
      "priority": 30
    },
    {
      "id": "terrace-hall",
      "family": "TRAVERTINE_TERRACES",
      "biome": "subterrain/terraces",
      "worldYRange": { "min": -56, "max": 112 },
      "spacing": 512,
      "probability": 0.25,
      "length": 192,
      "radius": 20,
      "height": 36,
      "fluidDepth": 3,
      "terraceCount": 6,
      "pillarSpacing": 0,
      "formationFraction": 0.1,
      "solid": "minecraft:calcite",
      "priority": 15
    }
  ]
}
```

### Choose lava for another geometry

This dimension fragment retains lava in a domed chamber and stepped terrace basins. It uses the `subterrain/lava` biome defined below, while leaving the two geometry families unchanged. Match biome spawning and decoration to the selected fluid: water entities need actual water, and waterlogged states are cleared in lava. Changing `fluid` does not change biome resources automatically.

```json
{
  "subterrainFeatures": [
    {
      "id": "basalt-cenote",
      "family": "CENOTE",
      "fluid": "LAVA",
      "biome": "subterrain/lava",
      "worldYRange": { "min": -56, "max": 112 },
      "spacing": 384,
      "probability": 0.25,
      "radius": 48,
      "height": 48,
      "fluidDepth": 6,
      "pillarSpacing": 24,
      "formationFraction": 0.18,
      "solid": "minecraft:basalt",
      "priority": 20
    },
    {
      "id": "basalt-terraces",
      "family": "TRAVERTINE_TERRACES",
      "fluid": "LAVA",
      "biome": "subterrain/lava",
      "worldYRange": { "min": -56, "max": 112 },
      "spacing": 512,
      "probability": 0.25,
      "length": 192,
      "radius": 20,
      "height": 36,
      "fluidDepth": 3,
      "terraceCount": 6,
      "pillarSpacing": 0,
      "formationFraction": 0.1,
      "solid": "minecraft:basalt",
      "priority": 15
    }
  ]
}
```

Keep feature definition IDs stable when updating a pack. The world seed and ID determine placement. `probability` controls whether a placement cell contains a feature; `spacing` controls the distance between placement cells. Passages choose one of the two horizontal axes from their seed.

The full chamber, floor, rounded basin underside, ceiling, seals and hornito height must fit both `worldYRange` and the dimension build range. A feature crossing a boundary into chunks retained from a different pack generation is skipped as a whole, so an update does not leave half a sealed basin. A band too narrow for the feature produces no placements. Choose bands below the terrain surface when the feature should remain underground; a Y band does not follow local terrain height.

### Settings reference

A dimension accepts at most 64 feature definitions. Disabled definitions do not place features.

| Field | Default | Accepted values and effect |
|---|---|---|
| `id` | empty | Required unique stable ID using letters, digits, `_`, `/` or `-` |
| `enabled` | `true` | Enables this definition |
| `family` | `CENOTE` | One of the four families above |
| `biome` | empty | Biome load key for occupied cells. Empty retains ordinary biome selection |
| `allowedRegions` | empty | Region load keys allowed at the placement center. Empty permits all regions; `["hot"]` restricts placement to the Hot region |
| `worldYRange` | `-48..48` | Inclusive absolute world Y band for the entire feature |
| `spacing` | `512` | 32..8192 blocks, and at least twice the horizontal reach plus 8. Reach is `radius` for cenotes and the larger of `length / 2` or `radius` for other families |
| `probability` | `0.35` | 0..1 probability per placement cell |
| `length` | `256` | 16..2048 blocks; faults require at least 200. Ignored by cenote geometry |
| `radius` | `32` | 6..256 blocks; cenote radius or passage half-width |
| `height` | `32` | 8..192 blocks; main vault height |
| `shapeWarp` | `0` | 0..1; strength of seeded, multiscale variation in chamber outline, passage course, walls, floor and ceiling. Larger values produce more irregular shapes within the configured bounds |
| `fluid` | family default | Optional `WATER` or `LAVA`; omitted or null selects water for cenotes/terraces and lava for lava tubes. Faults remain dry |
| `fluidDepth` | `4` | 0..32, limited to one third of `height`. Zero disables retained fluid; faults remain dry regardless |
| `chimneyHeight` | `16` | 0..96 blocks above a lava-tube vault; 0 disables hornitos. Other families ignore it |
| `terraceCount` | `6` | 2..16 basins; used by travertine terraces |
| `pillarSpacing` | `24` | 0..128 blocks; typical spacing between tapered, irregularly positioned continuous pillars. 0 disables them |
| `formationFraction` | `0.15` | 0..0.4 of the local vault height for each stalactite or stalagmite; 0 disables them |
| `solid` | `minecraft:stone` | Dry, full, opaque vanilla block state without gravity; structural base and fallback for owned boundaries and formations |
| `priority` | `0` | Higher values choose occupied ownership where rooms overlap. Stable instance IDs break ties |

## Boundaries, overlaps and decorations

Authored air volumes join existing dry caves through their outer skin. Dry outer boundaries texture rock that already exists and leave adjoining air or fluid openings intact. Where authored rooms overlap, occupied air can pass through another room’s dry outer skin; retained fluid basins, rims, seals and structural formations remain protected. Fluids stay sealed against adjacent dry openings and incompatible fluid. Ordinary cave aquifers and dimension deep-lava settings do not replace a feature’s authored fluid intent.

The feature biome also textures exposed solid boundaries. Set its `layers` for floor tops, `caveCeilingLayers` for ceilings, and `wall` for vertical faces. Only the top exposed block is painted, and only where it borders occupied air, water or lava belonging to the same feature. Floor material wins when a block also exposes a ceiling or wall. Pillars, rims, walkways and rock formations follow the same rules; interior solids keep `solid`.

A selected boundary material must be a dry, full, opaque vanilla solid without gravity. Missing or unsafe choices use the feature's `solid`; Iris does not try another palette entry. Material palettes leave the shape, retained fluid and protected passages intact. Air and fluid cells do not receive boundary materials.

The biome owns the actual air, water and lava volume. Iris coordinate queries and custom ambient spawning use exact block ownership. Minecraft publishes physical biomes in 4×4×4 cells, so a native biome cell at a room boundary can also cover adjacent solid blocks. A point elsewhere in the same X/Z column or Y band does not inherit that feature biome. Solid boundaries retain ordinary biome selection. Higher-priority occupied ownership applies after retained basin solids and formations have been respected. Dry boundary skins do not close another room’s occupied air volume.

Central passages reserve three blocks of clearance above the floor or retained fluid level. Ceiling decoration can hang above that clearance. Procedural cave formations with a resolved `FLOOR` anchor seat their lowest occupied block above the supporting floor after rotation, with configured translation offsets still applied. The feature biome supplies its own floor and ceiling decorators even where the room meets a natural terrain opening. Cave decorations fit within the room’s available floor and ceiling. A floor decorator’s `forceBlock` substrate remains in place when it is a full, opaque, nongravity solid; retaining walls and seals remain protected. Built-in `pillarSpacing` pillars run continuously from floor to ceiling, and `formationFraction` scales rock formations to the local dome or passage height. For additional procedural formations, use `roomHeightFraction` as described in [Procedural Objects](/iris/17-procedural-objects). Ordinary decorator `scaleStack` and `absoluteMaxStack` continue to control stacked decoration in [Surfaces & Decorators](/iris/16-surfaces-decorators-deposits).

For cave objects, `underwater: true` accepts anchors in actual water or lava belonging to the feature and uses that room's retained fluid head, including rooms above the dimension's surface fluid level. Dry placements require air. Solid boundaries and reserved passages remain protected for both modes.

Waterloggable decorations are wet only where they occupy actual water. Authored `waterlogged=true` states are cleared in dry space and lava; see [Object Placement](/iris/20-object-placement).

## Biome and entity resources

Create these complete biome resources for the dimension example:

`biomes/subterrain/fault.json`:

```json
{
  "name": "Fault Galleries",
  "derivative": "minecraft:dripstone_caves",
  "vanillaDerivative": "minecraft:dripstone_caves",
  "layers": [{ "minHeight": 1, "maxHeight": 1, "palette": [{ "block": "minecraft:stone" }] }],
  "entitySpawners": ["subterrain/gallery"]
}
```

`biomes/subterrain/cenote.json`:

```json
{
  "name": "Calcite Cenotes",
  "derivative": "minecraft:the_void",
  "vanillaDerivative": "minecraft:the_void",
  "layers": [{ "minHeight": 1, "maxHeight": 1, "palette": [{ "block": "minecraft:calcite" }] }],
  "customDerivitives": [{
    "id": "cenote-water",
    "category": "plains",
    "spawns": [{ "type": "minecraft:glow_squid", "minCount": 1, "maxCount": 2, "weight": 8, "group": "UNDERGROUND_WATER_CREATURE" }]
  }],
  "entitySpawners": ["subterrain/cenote-water"]
}
```

`biomes/subterrain/lava.json`:

```json
{
  "name": "Basalt Passages",
  "derivative": "minecraft:nether_wastes",
  "vanillaDerivative": "minecraft:nether_wastes",
  "layers": [{ "minHeight": 1, "maxHeight": 1, "palette": [{ "block": "minecraft:basalt" }] }]
}
```

`biomes/subterrain/terraces.json`:

```json
{
  "name": "Travertine Halls",
  "derivative": "minecraft:lush_caves",
  "vanillaDerivative": "minecraft:lush_caves",
  "layers": [{ "minHeight": 1, "maxHeight": 1, "palette": [{ "block": "minecraft:calcite" }] }],
  "entitySpawners": ["subterrain/gallery"]
}
```

`entities/subterrain/gallery-zombie.json`:

```json
{ "type": "minecraft:zombie", "surface": "LAND" }
```

`spawners/subterrain/gallery.json`:

```json
{
  "group": "CAVE",
  "maxEntitiesPerChunk": 3,
  "allowedLightLevels": { "min": 0, "max": 7 },
  "maximumRatePerChunk": { "amount": 1, "per": { "seconds": 20 } },
  "spawns": [{ "entity": "subterrain/gallery-zombie", "rarity": 1, "minSpawns": 1, "maxSpawns": 2 }]
}
```

`entities/subterrain/cenote-squid.json`:

```json
{ "type": "minecraft:glow_squid", "surface": "WATER" }
```

`spawners/subterrain/cenote-water.json`:

```json
{
  "group": "CAVE",
  "maxEntitiesPerChunk": 2,
  "allowedLightLevels": { "min": 0, "max": 7 },
  "maximumRatePerChunk": { "amount": 1, "per": { "seconds": 30 } },
  "spawns": [{ "entity": "subterrain/cenote-squid", "rarity": 1, "minSpawns": 1, "maxSpawns": 1 }]
}
```

`CAVE` spawners use the biome at the selected underground position. Put room-specific spawners on the feature biome; the surface biome above the room does not supply its cave pool. Dimension and region spawners remain additional scopes. Entity surface, body clearance, light and population limits still apply. Water entities require actual water; a water-filled biome name alone is insufficient.

The cenote example enables both custom native glow-squid spawning and an Iris glow-squid spawner. Omit `entitySpawners` from that biome if only native spawning is wanted. Custom biome tables require the normal datapack staging and server restart described in [Vanilla Passthrough](/iris/35-vanilla-passthrough#task-2-control-mob-spawning).

## Find an authored underground room

On Bukkit-family servers:

```none
/iris goto biome biome=subterrain/cenote
/iris find subterrain calcite-cenote radius=8192 teleport=false
/iris find subterrain lava_tube radius=8192 teleport=false
/iris find underground-biome subterrain/cenote radius=8192 teleport=false
```

The radius is 0..32768 blocks and defaults to 8192. Search results include X, absolute Y and Z for an occupied point, and account for the definitions retained by existing generated chunks. Search does not generate chunks or mantle data. A teleport can then load destination chunks. `underground-biome` searches authored feature volumes, rather than every ordinary noise cave. See [Commands & Permissions](/iris/04-commands-permissions#find-iris-find-goto) and [API - Terrain](/iris/91-api-terrain).
