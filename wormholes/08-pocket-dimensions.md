---
title: "Pocket Dimensions"
description: "Pocket world, layout, return door, and rescue"
published: true
date: 2026-09-20T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Personal and Public dimensional doors allocate persistent rooms in a single
shared void world. Pair doors never use pockets and instead link two placed
endpoints. Return doors are structure-built exits for pocket rooms. See
[07 - Dimensional Doors](/wormholes/07-dimensional-doors) for door kinds,
access, and transit eligibility.

## World

| Property | Value |
|----------|--------|
| World key | `wormholes:pockets` |
| Dimension type | `wormholes:fullbright_pockets` |
| Generator | Flat void (`minecraft:the_void` biome, air layer) |
| Ambient light | Fullbright (`ambient_light` 1.0). No potion effects required |
| Time | Fixed. Skybox none |
| Height | `min_y` −64, height 384 |
| Beds / respawn anchors | Beds never. Respawn anchors disabled |
| Tick speed | Vanilla |

The dimension is installed from the plugin’s bundled datapack
(`wormholes-pockets.zip` under the level `datapacks` on Spigot-class installs.
Paper bootstrap stages the pack before registries load). Installing or updating
the pack requires a **full server restart**. If `wormholes:pockets` is missing
after start, PERSONAL/PUBLIC entry cannot provision or enter pockets.

If the pocket world unloads, dimensional doors wait until it loads again. A
cancelled world unload leaves its region tasks, RTP registrations, projection
change tracking, and pocket-world availability active.

## Allocation

Rooms are placed on a fixed square spiral.

| Constant | Value |
|----------|-------|
| Stride between pocket centers | 8,192 blocks |
| Center Y | 128 |
| Chunk center offset | +8 on X/Z so the seed sits inside the first room chunk |
| Slot reuse | Never. Slots are monotonic |

Each pocket stores its binding, slot, location, size, and materials. Existing spaces reload from disk, and used slots are not reused.

A pocket keeps the size and materials used when it was created. Later configuration changes apply only to new pockets unless an operator resizes an existing one.

The 8,192-block stride leaves room for any supported size, so a pocket never
grows into its neighbour.

## Layout (`PocketLayout`)

| Property | Value | Meaning |
|----------|-------|---------|
| Room shape | Cube | Same edge length on X, Y, and Z |
| Edge length | Per pocket, 8 to 128 | Default 16 (16×16×16 blocks, shell included). Stored on the pocket, not global |
| Interior | `(size − 2)³` usable | Shell faces are protected. Interior is not shell |
| Shell material | Per pocket | Default smooth stone. Outer faces of the cube |
| Return door offset | `(size / 2) − 1` | Keeps the exit centred on the wall at any size |
| Anchor | Minimum corner | `minX`/`minY`/`minZ` never move when a pocket is resized |

The minimum corner stays fixed when a pocket changes size. The floor and minimum X/Z walls do not move; the opposite walls, ceiling, and return door do. Shell blocks are protected, while the interior remains editable.

Larger rooms cost more per entry, because the shell integrity check reads every
shell block before a traveler is allowed to arrive, and every chunk the room
covers is loaded on entry. The default 16-block room covers 1×1 chunk
horizontally; a 32-block room covers 2×2, and a 128-block room covers 8×8.

## Return door

| Property | Value |
|----------|--------|
| Material | Per pocket. Default crimson door. Must be a hand-operable door; iron doors are rejected |
| Kind / form | `RETURN` / `DOOR` only |
| Wall | +Z face of the shell (`maxZ`) |
| Position | Centered on the wall at floor level: lower block at `minY + 1`, facing south, left hinge, starts closed |
| Identity | Deterministic from pocket `spaceId` (`wormholes:pocket-return-door:v1:…`) |
| Entry landing | Just inside the door (`x + 0.5`, door Y, `z - 0.5`, yaw/pitch 0) |
| Craft / place / break | Not craftable. Player place cancelled. Break cancelled (anchored) |
| Access | Never gated |

The return route uses the traveler’s saved `ReturnTicket` (source endpoint,
world, position, look). If the ticket world is missing or is itself a pocket
world, rescue uses a fallback. If the point is obstructed, rescue also uses a
fallback. The fallback is a safe location near a loaded non-pocket world spawn.

## Resizing an existing pocket

`/wormholes pocket resize` rebuilds the pocket you are standing in; `/wormholes pocket resizeall`
applies the same change to every pocket. Both take `size=`, `material=`, `door=`, and `confirm=`,
and anything you omit keeps its current value.

The room is anchored at its minimum corner, so:

- **Growing** adds space beyond the old walls and ceiling. Nothing already built moves, and blocks
  players placed against the old walls survive.
- **Shrinking destroys everything left outside the new walls.**

A resize counts what it would destroy first and refuses until you re-run it with `confirm=true`.
**A non-empty container refuses the resize even with `confirm=true`** — empty those containers
first. Nothing is ever dropped or emptied for you. Displaced entities, players included, are
teleported to the room entry.

Changing only the material or door relays the shell in place at the same size. Either way the exit
keeps working without a restart.

A resize is refused when the new room would not fit the pocket dimension's build height, when the
pocket world is not loaded, or when the size is outside 8 to 128 blocks. Interrupted work resumes on
startup. On Folia it is refused if the old and new rooms span more than one region.

## Escape and lethal damage

Moving outside the pocket shell triggers a glitch effect and sends the player through the normal rescue route. When particles are enabled, the effect includes a white flash.

Lethal damage inside `wormholes:pockets` is cancelled. The player is left at one heart, fall and fire state is cleared, and the rescue route ejects them.

Spectators are not escape-ejected by the move path. Objects never receive
return tickets.

## Bindings

| Door kind | Binding | Key | Sharing |
|-----------|---------|-----|---------|
| `PERSONAL` | `PocketBindingKind.PERSONAL` | Traveler UUID | Every personal door sends that player to the same pocket |
| `PUBLIC` | Internal `PocketBindingKind.IRON` | Door `itemId` | Every traveler using that item shares one pocket |
| `PAIR` | None | Not applicable | No pocket. Destination is the mate endpoint |
| `RETURN` | Pocket of `spaceId` on identity | Traveler UUID on ticket | Exit only |

The stored `IRON` binding name is an internal identifier for Public doors. The player-facing kind remains `PUBLIC`.

## Related

- Door kinds, OpenState, access, recipes, config: [07 - Dimensional Doors](/wormholes/07-dimensional-doors)
- Install and TOML: [01 - Installation & Configuration](/wormholes/01-installation-configuration)
