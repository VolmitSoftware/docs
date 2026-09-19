---
title: "API - Protection"
description: "Register protection and region policy services"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Register a `Protector` when a claims or region plugin needs to deny Adapt actions at a location.

```java
public final class ClaimsProtector implements Protector {
    @Override
    public boolean canBlockBreak(Player player, Location location, Adaptation<?> adaptation) {
        return claims.canBreak(player, location);
    }

    @Override
    public boolean canBlockPlace(Player player, Location location, Adaptation<?> adaptation) {
        return claims.canBuild(player, location);
    }
}
```

Register it through Bukkit's `ServicesManager` under `Protector`. Return `true` when your plugin has no objection and `false` to deny the action.

Protector methods cover block breaking, block placement, interaction, damage, item use, entity interaction, and movement. The adaptation may be `null` for a general check.

Use `Protector` for location-specific rules. Use [Ability Use Policy](/adapt/43-api-ability-use-policy) for player state such as jail, duel, quest, or rank restrictions.

Calls run on the owner of the player or location. Keep them fast and do not perform I/O.

`RegionPolicySource` is a separate single-provider service for region XP multipliers, power changes, and temporary adaptation grants. Publish immutable policy values and remove them when the player leaves the region.

## Bukkit checks Adapt dispatches

Before Adapt performs container or item work that vanilla would route through a player event, it dispatches that event so an ordinary protection plugin can deny it. Cancelling one stops the transfer and leaves the entity or block drop on its normal path.

| Feature | Events dispatched |
|---|---|
| Rift Access and deferred Rift Conduit actions | Marked `RIGHT_CLICK_BLOCK` for every physical container block, including both halves of a double chest. Refused when a listener denies block use |
| Initial Rift Conduit gesture | Uses its real clicked-block event and probes any other physical half |
| Indirect item-entity transfers | `PlayerAttemptPickupItemEvent` first on Paper. When capacity allows, `PlayerPickupItemEvent` then `EntityPickupItemEvent` on both Paper and Spigot |
| Veinminer | Waits for the original block to finish breaking, then uses the player's native break action for every sibling |
| Time In A Bottle | Plans a sapling tree without changing the world, authorizes the complete footprint, then fires `StructureGrowEvent` before generation |
| Chronos crop acceleration, Compost Cascade, Builders Wand, Magic Foundation, Seed Sower, Coral Gardener | Marked `BlockBreakEvent` or `BlockPlaceEvent` authorization checks as applicable, before committing |
| Deconstruction | The normal pickup-event sequence before it replaces a dropped item |

Cancellation stops the transfer and leaves the entity or block drop in its normal world path.

## XP entry points and region policy

| Entry point | Carries a location | Region policy applies |
|---|---|---|
| `Skill.xp(player, ...)` | yes, the player's own position | yes |
| `Skill.xp(player, at, ...)` / `xpS(player, at, ...)` | yes, the given position | yes |
| `Skill.xpSilent(player, xp)` | no | no |
| `Skill.xp(at, xp, rad, duration)` spatial pulses | the pulse has one, the award does not use it | no |

