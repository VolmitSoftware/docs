---
title: "Pocket Dimensions"
description: "Pocket world, layout, return door, and rescue"
published: true
date: 2026-08-21T00:00:00.000Z
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

## Allocation

`PocketAllocator` places rooms on a deterministic square spiral.

| Constant | Value |
|----------|-------|
| Stride between pocket centers | 8,192 blocks |
| Center Y | 128 |
| Chunk center offset | +8 on X/Z so the seed sits inside the first room chunk |
| Slot reuse | Never. Slots are monotonic |

Each allocation stores a `PocketSpace`: stable `spaceId` (name-UUID from
binding), binding, slot index, center coordinates, and the room's own shell
(size and materials). Restoring from disk reloads existing spaces. `nextSlot`
must stay greater than every allocated slot.

A pocket's shell is fixed at creation from the `pocket-room-size`,
`pocket-shell-material`, and `pocket-return-door-material` settings and is then
stored with the pocket. Changing those settings later shapes only pockets
created after the change; existing pockets keep what they were built with until
an operator resizes them. Pockets written before shells were configurable load
as the original 32-block smooth-stone room.

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

Bounds are chunk-aligned from the pocket center, and the minimum corner is the
anchor: the floor and the minimum-X/minimum-Z walls stay where they are at every
size, and only the maximum walls, the ceiling, and the return door move. Shell
blocks are protected (`isProtected` = shell only). Interior blocks are
player-editable. Provisioning fills the shell once. Later provision calls leave
player interior space and always repair the return door and its support.

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

`/wormholes pocket resize` rebuilds the pocket the operator is standing in.
`/wormholes pocket resizeall` applies the same change to every allocated pocket.
Both take `size=`, `material=`, `door=`, and `confirm=`; omitted values keep what
the pocket already has. See
[09 - Commands & Permissions](/wormholes/09-commands-permissions) for the exact
syntax.

Because the room is anchored at its minimum corner:

- **Growing** adds space beyond the old maximum walls and ceiling. Nothing
  already built moves. The old walls and ceiling are carved back to open space
  where they are still the pocket's own shell material, so player blocks placed
  against them survive.
- **Shrinking** destroys everything left outside the new walls, and the new walls
  are laid through what used to be interior.

Before touching anything, a resize counts what it would destroy: placed blocks
that are neither air nor the pocket's shell material, how many of those hold
items, and how many entities would be displaced. If that count is not zero the
command refuses and reports it; re-running with `confirm=true` proceeds.

A confirmed resize is not a plain deletion. Container contents in the destroyed
volume are emptied and dropped at the room's entry rather than voided, and every
entity left outside the new interior — players included — is teleported to the
entry. Everything else in that volume is lost.

Changing only materials relays the shell in place at the same size and replaces
the exit door. A resize also moves the stored return-door endpoint to its new
wall position, so the exit keeps working without a restart.

A resize is refused when the requested room would not fit the pocket
dimension's build height, when the pocket world is not loaded, or when the size
falls outside 8 to 128 blocks.

## Escape and lethal damage

**Shell leave (escape):** if a player moves outside the pocket layout with
lateral margin 1 block (vertical margin 0), they are treated as escaped.
Wormholes applies a glitch effect. Then it ejects them on the same
return-ticket path as rescue.

**Lethal damage in the pocket world:** `EntityDamageEvent` on players in
`wormholes:pockets` is evaluated by `PocketRescuePolicy`. Damage that would
kill is cancelled. Health is set to one heart (2.0, or max health if lower).
Fall and fire are cleared. I-frames are extended. Ejection starts through the
return ticket (with the same fallbacks). Concurrent rescue holds further lethal
hits at one heart until ejection finishes.

Spectators are not escape-ejected by the move path. Objects never receive
return tickets.

## Bindings

| Door kind | Binding | Key | Sharing |
|-----------|---------|-----|---------|
| `PERSONAL` | `PocketBindingKind.PERSONAL` | Traveler UUID | Every personal door sends that player to the same pocket |
| `PUBLIC` | Internal `PocketBindingKind.IRON` | Door `itemId` | Every traveler using that item shares one pocket |
| `PAIR` | None | — | No pocket. Destination is the mate endpoint |
| `RETURN` | Pocket of `spaceId` on identity | Traveler UUID on ticket | Exit only |

Pocket `spaceId` is derived as
`nameUUID("wormholes:pocket:" + kind + ":" + bindingId)`. The stored `IRON`
binding name is an internal persistence identifier for Public doors. The
player-facing door kind remains `PUBLIC`.

## Related

- Door kinds, OpenState, access, recipes, config: [07 - Dimensional Doors](/wormholes/07-dimensional-doors)
- Install and TOML: [01 - Installation & Configuration](/wormholes/01-installation-configuration)
- Runtime boot and managers: [13 - Runtime Architecture](/wormholes/13-runtime-architecture)
