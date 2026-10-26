---
title: "ByteCompanions: Companions and collections"
description: "The dashboard, collection, outfits, personalization, interactions, trials, viewer settings, and starter setup"
published: true
date: 2026-10-25T00:00:00.000Z
tags: "bytecompanions, companions, collections"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

This page describes what players do with companions: the menus, outfits, names and variants, actions, private trials, and viewer settings. It ends with the eight starter companions and the operator setup menu.

## Companion definitions

Each `companions/<id>.toml` file defines one companion: its model (`HEAD` or `FULL_BODY`), the menu item under `display.item`, appearance flags and scale, equipment per slot, animations per channel, and optional `display.category` and `variants`. Saving a file applies it through hot reload. `appearance.scale` accepts `-1` for the default or a value above zero.

Categories and variant IDs use 1 to 32 lowercase letters, digits, underscores, or hyphens. A companion without `display.category` is in `general`. A variant has one key, `template`, naming another definition with the same model; it borrows that definition's equipment and animations but not its bonuses. At most 32 variants per companion. A player needs `bytecompanions.variant.<companion>.<variant>` to choose one.

```toml
[display]
category = "nature"

[variants.moss]
template = "mushroom"
```

A player needs `bytecompanions.companion.<id>` to equip a companion. `general.companionLimits` caps how many companions, full-body models, and head-only models one player can equip at once. An `exclusive = true` companion cannot share the player with another companion.

### Overlays

An armor stand holds one item per slot. Overlays add more: each `overlays.<id>` table is an extra invisible stand that moves, turns, and poses with the companion and wears its own equipment, so one slot can show several items, such as a helmet over a player head.

| Key | Default | Effect |
|---|---|---|
| `overlays.<id>.equipment.<SLOT>` | none | An item for that slot on the overlay. Slot names and item keys are the same as the companion's own `equipment` tables. |
| `overlays.<id>.lock-head-yaw` | `false` | `true` holds the overlay's head straight ahead with no pitch or yaw, while the companion's head keeps turning. Body rotation and arm and leg poses always follow the companion. |

An overlay never shows its own body, arms, base plate, or name; only its equipment is visible. It is small when the companion's `appearance.small` is `true` and uses the companion's `appearance.scale`. Companion Studio has no overlay fields, and saving a companion from Studio keeps its `overlays` tables.

```toml
[equipment.HEAD]
material = "PLAYER_HEAD"

[overlays.crown.equipment.HEAD]
material = "GOLDEN_HELMET"
```

## Dashboard and collection

`/bytecompanions menu` opens the collection: 54 slots, 28 companions per page in ID order, with filters for favorites, access (all, owned, locked), and category. Owned means the player has the companion's permission. Filters last for the current connection. Players with `bytecompanions.command.setup` also see a setup button.

Selecting a companion opens its dashboard. From there the player equips or removes it, marks it as a favorite, opens particles, personalization, actions, trials, and viewer settings, and reads a snapshot of its bonuses. Bonus pages are read-only and show stacking and overridden contributions; Refresh updates them. With `menus.rightClickDashboard` on, a main-hand right-click on your own companion opens the same dashboard. Off-hand clicks, attacks, other players, and decorations do not.

Equip and remove feedback waits for the database write. A failed write keeps the visual change for the session and warns that it may revert after reconnecting. While a player's data is still loading, the menus report it instead of creating an empty record.

## Outfits

`/bytecompanions outfits` lists saved outfits. Save current outfit stores the equipped companion IDs with each one's name, variant, particle choice, and formation order. Names use 1 to 32 letters, digits, underscores, or hyphens and are stored in lowercase; saving under an existing name replaces it. `collections.maximumOutfits` caps the count.

Wearing an outfit rechecks permissions, available definitions, particle access, exclusivity, and companion limits, then replaces the whole selection in one step. A cancelled equip or remove rejects the whole transition. Deleting an outfit has its own confirmation screen.

## Personalization

Personalize sets a plain name of up to 32 characters or resets it, picks a permitted variant, and chooses the default, line, grid, or orbit formation with earlier and later buttons to reorder equipped companions. These choices belong to the player and never edit the shared definition. Name prompts arrive in chat, expire after 60 seconds, and accept `cancel`. Changing a name or formation keeps the selected particle effect. Removing a companion keeps its particle choice for the next equip; only explicit particle removal clears it.

## Interactions

The dashboard offers Pet, Wave, Sit, Stay, and Call; `/bytecompanions interact <action> [companion]` does the same. Sit and Stay hold the companion in place until Call, a world change, or a distance of more than 16 blocks. Pet and Wave play a two-second pose. Actions share a two-second cooldown, which Call bypasses. With `collections.idleReactions` on, a stationary companion reacts on its own about every 30 seconds. Head-only models cannot show limb poses. `collections.personalityEnabled = false` hides the actions and rejects the command.

## Private trials

Try privately shows a companion to the player alone for `collections.trialSeconds`, including companions the player cannot equip. A trial grants no bonuses and changes no saved selection. One trial is active per player; starting another replaces it. Stop private trial, expiry, a real equip of the same companion, death, a world change, quitting, or a runtime reload ends it.

## Viewer settings

`/bytecompanions settings` opens viewer settings. They change what you see, not what others see or what you have equipped, and they persist with your collection profile.

| Choice | Effect |
|---|---|
| Visibility: All companions | See every eligible companion and the static decorations |
| Visibility: Only mine | See only your own companions |
| Visibility: Hide companions | See no companions, decorations, or their particles |
| Particles: Full | Receive every particle frame |
| Particles: Reduced | Receive every other frame |
| Particles: Off | Receive no companion particles |

`performance.maximumParticleIntensity` caps the particle choice; the more restrictive of the two applies.

A hidden owner (Bukkit `hidePlayer` or a true `vanished` metadata value) still sees their own companions, while nobody else does. `serverRules.hiddenWorlds` and a WorldGuard `bytecompanions-visuals` deny flag hide companions without touching saved selections.

## Starter companions

Fresh installs receive eight companions built from vanilla blocks, equipment, dyed armor, and player heads. They float or hover beside the player. The survival bonuses come from the bundled feature files and apply only when the matching feature is on.

| ID | Name | Model | Category | Bundled survival bonus |
|---|---|---|---|---|
| `bee` | Honey Nest | Head | `nature` | Speed I |
| `copper` | Copper Tinker | Full body | `miniatures` | +10% block experience |
| `lantern` | Lantern Wisp | Head | `charms` | none |
| `mushroom` | Moss Forager | Full body | `nature` | Night Vision I |
| `myself` | Mini Me | Full body | `miniatures` | Speed I |
| `rainbow` | Color Runner | Full body | `miniatures` | Speed I |
| `scout` | Trail Scout | Full body | `miniatures` | +10% fishing experience |
| `warrior` | Pocket Knight | Full body | `miniatures` | +10% mob experience |

Mini Me uses the player's own head. The three Speed entries use highest-value stacking, so they do not add up. The bundled attribute file has no active entries.

## Starter setup

`/bytecompanions setup` opens a player-only menu for operators with `bytecompanions.command.setup`. Choose Cosmetic companions or Survival companions, review the changes, then confirm Apply setup.

| Profile | Changes to `config.toml` |
|---|---|
| Cosmetic | `features.attributes`, `features.buffs`, and `features.effects` off; `features.particles` on; `features.progression` and `features.boosters` off |
| Survival | `features.attributes`, `features.buffs`, and `features.effects` on; `features.particles` on; `features.progression` and `features.boosters` off |

Both profiles install any missing starter companion file, keep existing companion and feature files, and leave every other setting alone. Survival therefore activates every bonus already defined in the feature files, including custom companions. Setup grants no player permissions.

The confirmation is bound to the configuration revision it was opened with; if the file changed meanwhile, reopen setup. A failed apply keeps the previous settings and removes the files that attempt created.

## Related pages

- [Commands and permissions *The player commands and the nodes behind each menu*](/bytecompanions/02-commands-permissions)
- [Configuration *The `collections`, `menus`, and `general.companionLimits` sections*](/bytecompanions/03-configuration)
- [Companion Studio *Editing the shared definitions*](/bytecompanions/06-companion-studio)
- [Particles and features *Particle effects and the bonus feature files*](/bytecompanions/08-particles-and-features)
{.links-list}
