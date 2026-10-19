---
title: "API - Protection"
description: "Register protection and region policy services"
published: true
date: 2026-10-19T00:00:00.000Z
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

`canPVE(player, entity, adaptation)` judges damage to, or handling of, one mob. It falls back to `canPVE(player, location, adaptation)` at the mob's location, so override it when your rule depends on the kind of mob, such as letting players hit monsters but not animals. `Adaptation.canPVE(player, entity)` evaluates it across the active protectors. Adapt uses it for damage from golems and minions, for Rancher work on animals, and for adaptations that pass the mob they hit.

Use `Protector` for location-specific rules. Use [Ability Use Policy](/adapt/43-api-ability-use-policy) for player state such as jail, duel, quest, or rank restrictions.

Calls run on the thread that owns the player or location, and `canPVE(player, entity, adaptation)` runs on the thread that owns the mob. Keep them fast and do not perform I/O.

`Adaptation.checkRegion(player, location)` evaluates the active protectors at an explicit destination. `checkRegion(player)` uses the player's current location. Blink checks both region access and interaction at its proposed destination before teleporting, then honors the normal teleport cancellation events. A reactive Blink whose teleport is denied retains the incoming attack.

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

## XP entry points and region policy

| Entry point | Carries a location | Region policy applies |
|---|---|---|
| `Skill.xp(player, ...)` | yes, the player's own position | yes |
| `Skill.xp(player, at, ...)` / `xpS(player, at, ...)` | yes, the given position | yes |
| `Skill.xpSilent(player, xp)` | no | no |
| `Skill.xp(at, xp, rad, duration)` spatial pulses | the pulse has one, the award does not use it | no |
