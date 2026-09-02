---
title: "API - Protection"
description: "Adapt documentation: API - Protection"
published: true
date: 2026-08-24T00:00:00.000Z
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
