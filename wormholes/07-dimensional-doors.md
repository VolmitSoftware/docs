---
title: "Dimensional Doors"
description: "Pair, Personal, Public, OpenState, access, recipes, and transit"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Dimensional Doors are doors and trapdoors with a saved identity. Their portal surface becomes active when the physical block matches its OpenState. Pair doors link two locations; Personal and Public doors use pocket dimensions. See
[08 - Pocket Dimensions](/wormholes/08-pocket-dimensions) for PERSONAL/PUBLIC
destinations.

## Kinds

| Kind | Source | Destination | Notes |
|------|--------|-------------|-------|
| `PAIR` | Crafted pair kit or admin item | The other linked endpoint of the same `pairId` | Kit unpacks A/B. Either endpoint may move without losing the link |
| `PERSONAL` | Crafted or admin item | Traveler’s personal pocket (keyed by traveler UUID) | One pocket per player across all personal doors |
| `PUBLIC` | Crafted or admin item | Pocket keyed by this door’s immutable `itemId` | Breaking and re-placing the same item keeps the pocket. A new craft mints a new `itemId` and a different pocket |
| `RETURN` | Pocket structure only | Traveler’s saved return ticket | Never craftable. Always `DOOR` form. Door material is per pocket, crimson by default. Not breakable by players |

## Forms

| Form | Physical shape | Portal plane |
|------|----------------|--------------|
| `DOOR` | Two-block hinged door | Vertical one-block-wide, two-block-high aperture at the closed-door threshold |
| `TRAPDOOR` | One-block wooden trapdoor | Horizontal 1×1 plane at the middle of the plate slab (top or bottom half by placement) |

A door identity cannot become a trapdoor (or the reverse) through reskinning.
Return doors are always `DOOR`.

## OpenState

Each placed endpoint stores an OpenState. New placements default to `OPEN`.

| OpenState | When the portal is live | Living traveler after transit | Contact pad |
|-----------|-------------------------|-------------------------------|-------------|
| `OPEN` (default) | Physical block is open | Source returns to closed dormant after a living traveler that claims the open cycle | No |
| `CLOSED` | Physical block is closed | Contact with the closed surface triggers transit. Surface stays shut | Yes |

- Toggle OpenState from the access UI (applies to doors and trapdoors).
- Under `OPEN`, living travelers claim the door’s single armed open cycle and
  close the source behind them. If redstone holds the block open, the cycle
  stays consumed until the door is actually observed closed, then re-arms on
  the next open. Objects never claim that cycle, so a volley can pass while
  the door stays open.
- Under `CLOSED`, the shut surface is a contact pad. Nothing crosses while the
  block stands open. Contact pads never swing open for arrivals and never
  consume an open cycle.
- Destination behavior: a hinged door with OpenState `OPEN` may be auto-opened
  by the server for an arriving living traveler. The server later closes it
  only if the server opened it. A player-opened door is left alone. Trapdoor
  destinations are not auto-swung for arrival. OpenState `CLOSED` destinations
  stay shut.
- Trapdoor through-mapping is straight (drop in the top of one → exit under
  the far plate still falling. Climb up through the bottom → land on top of
  the far plate). Hinged doors mirror onto the matching face (front-to-front /
  back-to-back).

## Access UI and rules

Access is **per door** (one `DoorAccessRecord` per door `itemId`), with
**per-player** entries inside that record. It is not a global per-player grant
across doors.

To open the menu, sneak and right-click a placed Pair, Personal, or Public door with an empty main hand. The owner, operators, and players with `wormholes.admin` may manage it. Return doors have no access menu.

The menu contains the OpenState control, an add-player control, and one entry per listed player.

| Control | Action |
|---------|--------|
| OpenState (lime/gray dye) | Left-click toggles `OPEN` ↔ `CLOSED` |
| Add player | Chat name prompt. New entries start `NEUTRAL` |
| Listed pane left-click | `WHITELIST` (green) |
| Listed pane right-click | `BLACKLIST` (red) |
| Listed pane middle-click or shift-left-click | Remove from list |
| Black pane (`NEUTRAL`) | No transit effect. Entry is still listed |

Access rules:

| Actor | Result |
|-------|--------|
| Blacklisted player | Always refused |
| Any whitelist present | Only whitelisted players (plus always-pass actors) may use |
| No whitelist | Anyone not blacklisted may use |
| Door owner | Always passes |
| `wormholes.doors.bypass` (included under `wormholes.admin`) | Always passes |
| Ops / `wormholes.admin` | May manage access. Ops also treated as administrators for manage |
| Return door | Never gated |
| Unowned object (for example a dispenser projectile) | Ungated for access lists |

**Ownership for non-player travelers:** projectiles use the player shooter.
Dropped items use the thrower UUID if that player is online. Otherwise the
traveler is ungated for access. Objects are never issued a return ticket.

Normal vanilla door interaction and any server protection plugin still apply
outside portal transit.

## Portal surface and block protection

When OpenState matches the physical block, Wormholes shows an animated portal surface to nearby players. Particles and sounds follow the global Wormholes settings. The surface disappears when the endpoint is no longer active.

Registered dimensional doors, their hinged-door support blocks, and pocket core
blocks are protected from fire, piston movement, entity block changes, and
explosion block removal. Normal player breaking still follows the identity
rules below. Return doors remain unbreakable.

## Transit eligibility

Travelers are either `LIVING` (players, mobs, and vehicles) or `OBJECT` (projectiles, dropped items, and experience orbs). Non-player travelers must fit within a one-block-wide, two-block-high opening. Travelers inside a vehicle, carrying passengers, or attached to a leash cannot enter.

| Kind | Players | Mobs / empty vehicles (fit aperture) | Objects |
|------|---------|--------------------------------------|---------|
| `PAIR` | Yes | Yes (not bosses / complex living entities) | Yes |
| `PERSONAL` | Yes | No | No |
| `PUBLIC` | Yes | No | Yes |
| `RETURN` | Yes | No | No |

Pair and Public support object travel. Personal and Return stay player-only.
Pair loads unloaded destination chunks before transit. Same-server
cross-dimension travel is supported for eligible kinds.

## Recipes

All product and reskin recipes require `wormholes.doors.craft`, which defaults
to `op`. Without that permission, the crafting result is hidden and the craft
click is rejected. The default product recipes also require the exact **Wormhole
Rune** item (`R`), which is not craftable and comes from an administrator, so
door supply is gated on rune supply unless the recipes are reconfigured to drop
that ingredient. Shift-crafting identity products is blocked so one craft cannot
mint bulk identities.

```text
Entangled pair       Personal door       Public dimension door
E D E                 _ R _               R D R
O R O                 C D E               _ E _
_ D _                                     _ L _
```

| Symbol | Meaning |
|--------|---------|
| `R` | Exact Wormhole Rune |
| `E` | Ender Eye (pair recipes). Ender Chest (personal/public recipes) |
| `D` | Any vanilla door for door recipes. A hand-openable wooden trapdoor for trapdoor recipes |
| `O` | Obsidian |
| `C` | Recovery Compass |
| `L` | Lodestone |

Trapdoor products use the same shapes with trapdoor `D`. The table above is the
default; every product's grid, ingredients, and whether it exists at all
are configurable. See **Configuring recipes** below. Default products:

| Product | Default material |
|---------|------------------|
| Pair door / trapdoor kit endpoints | Oak door / oak trapdoor |
| Personal door / trapdoor | Dark oak door / dark oak trapdoor |
| Public door / trapdoor | Pale oak door / pale oak trapdoor |
| Return (structure) | Per pocket. Crimson door by default |

Hinged-door recipes accept any vanilla door, including iron and copper. Trapdoor recipes accept hand-openable wooden trapdoors only. The result uses the default material shown above, not the ingredient material. Return doors have no recipe, and automated crafters cannot create dimensional door identities or skins.

Enabled door recipes appear in the recipe book for players with `wormholes.doors.craft`. The Portal Wand recipe is available to everyone. Runes are not craftable.

A Pair kit is a bundle. Right-click to unpack its linked A and B items; unpacking consumes the kit in every game mode.

Placing any crafted or granted Pair, Personal, or Public door/trapdoor requires
`wormholes.doors.place`, which defaults to `op`. `wormholes.admin` and ops also
pass. Craft permission alone does not allow placement.

## Configuring recipes

The `[recipes]` block of `wormholes.toml` holds one table per product
plus the two reskin toggles. Changes hot-reload: `/wormholes reload`
re-registers the recipes and re-sends every online player's recipe book.

| Table | Controls |
|-------|----------|
| `[recipes.pair-kit]` | Entangled door pair kit |
| `[recipes.personal-door]` | Personal dimensional door |
| `[recipes.public-door]` | Public dimensional door |
| `[recipes.trapdoor-pair-kit]` | Entangled trapdoor pair kit |
| `[recipes.personal-trapdoor]` | Personal dimensional trapdoor |
| `[recipes.public-trapdoor]` | Public dimensional trapdoor |
| `[recipes.door-skin]` | Door reskin. `enabled` only |
| `[recipes.trapdoor-skin]` | Trapdoor reskin. `enabled` only |

Each product table takes three keys:

| Key | Meaning |
|-----|---------|
| `enabled` | `false` removes the recipe from the server entirely. The product can still be granted with `/wormholes door` |
| `shape` | The grid, rows separated by `\|`, a space for an empty slot. At most 3 rows of 3 |
| `ingredients` | `symbol=material` pairs separated by commas, one per slot symbol |

```toml
[recipes.personal-door]
enabled = true
shape = " R |CDE"
ingredients = "R=#wormhole-rune, C=RECOVERY_COMPASS, D=#doors, E=ENDER_CHEST"
```

An ingredient is a block name (`OBSIDIAN`, or `minecraft:obsidian`), several
names separated by `/` to accept any of them (`OAK_DOOR/SPRUCE_DOOR`), or one of
the built-in groups:

| Group | Matches |
|-------|---------|
| `#doors` | Any vanilla hinged door |
| `#trapdoors` | Hand-openable wooden trapdoors only |
| `#any-trapdoors` | Any vanilla trapdoor, iron and copper included |
| `#wormhole-rune` | The exact Wormhole Rune item |

Rules the parser enforces: at most 3 rows of 3, all rows the same width (a short
row is padded, so a lost trailing space is harmless), every slot symbol has an
ingredient, and every ingredient is actually used by the shape. A recipe that
breaks one of those, or that names a block this server does not have, is logged
and falls back to its default recipe. A typo never leaves a product silently
uncraftable.

The reskin recipes have no configurable grid because their result is derived
from the exact two items placed in rather than from a fixed shape; they only
toggle.

The Portal Wand recipe is not configurable. Runes are not craftable.

## Reskin

Shapeless craft: one dimensional door/trapdoor item + one ordinary
door/trapdoor of the **same form**.

- Result keeps the same identity (pair link, personal mapping, or public
  `itemId`) and adopts the ordinary item’s material.
- Any vanilla hinged door is a valid skin, including iron and copper.
  OpenState `OPEN` still requires the physical door to be open, so an iron or
  copper skin needs redstone (or a Closed contact pad) to transit.
- Trapdoor skins stay hand-openable wooden trapdoors only
  (`Tag.WOODEN_TRAPDOORS`). Iron and copper trapdoors are refused.
- Door cannot reskin into trapdoor or reverse.
- Same material as current skin is invalid.
- Shift-craft of skin recipes is blocked.

Placed iron or copper dimensional doors are left as they are. Startup does not
retarget them to Pale Oak.

## Admin grant

Requires player sender and `wormholes.admin.items` (or full admin). Feature
must be enabled and the door manager running.

```text
/wormholes door type=<pair|personal|public|pair_trapdoor|personal_trapdoor|public_trapdoor>
```

Default `type` is `pair`. Overflow drops at the player’s feet.

## Creative and break identity

| Action | Behavior |
|--------|----------|
| Place in Creative | Requires `wormholes.doors.place`. Held dimensional door item is consumed (same as survival identity consumption for kits/doors) |
| Break Pair / Personal / Public | Access-gated (`canUseDoor`). Denied breaks are cancelled. Allowed breaks drop that exact identity item (including Creative). Block vanilla drops are suppressed |
| Break material | Uses live block material if still player-operable for that form. Otherwise the kind’s default material |
| Return door break | Cancelled. Exit is anchored |

## Config and lifecycle

| Setting | Location | Effect |
|---------|----------|--------|
| `dimensional-doors-enabled` | `[main]` in `plugins/Wormholes/wormholes.toml` (field default `true`) | Live enable/disable of the full dimensional-doors feature |

If you set this `false` while running: new entries stop. Active travelers and
pocket occupants may finish through return routes. Recipes, protection, and
portal displays shut down after drain. Existing blocks behave as ordinary
doors. Saved door and pocket identities remain for re-enable.

**Pocket datapack / world:** first install or update of the bundled
`wormholes:pockets` dimension requires a **full server restart** so registries
load (`/reload` is insufficient). Until restart, doors that need pockets stay
dormant. See [08 - Pocket Dimensions](/wormholes/08-pocket-dimensions) and
[01 - Installation & Configuration](/wormholes/01-installation-configuration).

## Related

- Pocket layout, rescue, and bindings: [08 - Pocket Dimensions](/wormholes/08-pocket-dimensions)
- Commands and permission nodes: [09 - Commands & Permissions](/wormholes/09-commands-permissions)
- Concepts overview: [02 - Concepts](/wormholes/02-concepts)
