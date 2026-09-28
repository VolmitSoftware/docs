---
title: "Protection & Region Policy"
description: "WorldGuard flags, claim protection, and region policy"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

WorldGuard flags and claim protectors gate Adapt. A protector allows or denies a block break, a hit, a container open, or the activator click. WorldGuard also has five region flags.

Flags are registered when Adapt enables. Install or remove WorldGuard, then restart. `protectorSupport.worldguard = false` removes WorldGuard from the default set. A per-adaptation override of `WorldGuard = true` adds it back, and that protector still reads `use-adaptations`.

A missing plugin, a missing location, or a protector error uses the default policy: XP allowed, multiplier 1.0, no power bonus, no unlocks. A WorldGuard error stops flag use for the rest of the session and revokes grants on the next tick.

## Flags

```
/rg flag <region> use-adaptations deny
/rg flag <region> adapt-xp deny
/rg flag <region> adapt-xp-multiplier 2.5
/rg flag <region> adapt-power-bonus 8
/rg flag <region> adapt-unlock-adaptations stealth-shadowmeld,axe-chop
```

`use-adaptations deny` forces active level 0 in that region. WorldGuard bypass applies to this flag.

`adapt-xp deny` zeroes awards that carry a location. The location is the one the skill passed, often the block. No location uses the default policy and the award is paid. Bypass applies to `adapt-xp` only. `adapt-xp-multiplier` applies after novelty and before the skill-line multipliers. Overlapping regions do not compound. `0` zeroes the award. Bypass does not apply to the multiplier, the power bonus, or unlocks. Where the multiplier sits in the award is in [Configuration math](/adapt/05-configuration-math).

`adapt-power-bonus` is added to max power on the one-second tick from the player's position. It is not saved. The next tick outside a region that sets it clears the bonus. If used power then exceeds max power, the lowest learned levels are removed with no refund. Moving to an equal or higher bonus does not remove levels. Region grants are exempt. `/adapt debug mode` skips that removal.

`adapt-unlock-adaptations` takes adaptation ids, or `*`. Names are trimmed and lowercased. Applicable regions are combined. Each listed adaptation is granted at level 1 while the player is inside, when the skill and adaptation are enabled. Grants cost no knowledge, currency, or power, and are removed on leave, quit, and profile load. An adaptation the player already learned is left as a normal learned adaptation.

Buying a grant charges from level 0, including the granted level, and the result is a normal learned adaptation. Unlearning a grant refunds nothing. Unlearning one while still inside grants it again on the next tick.

## Protectors

`protectorSupport.*` selects the default set. A core-config reload rebuilds that set. Installing or removing a protection plugin needs a restart.

`protectionOverrides.<adaptation id>` sets a protector name to `true` to add it or `false` to remove it for that adaptation. The activator click uses the default set only.

```toml
[protectionOverrides.rift-blink]
WorldGuard = true
GriefPrevention = false
```

An override cannot add a protector whose plugin was absent at enable. An unknown name is skipped.

Container and item actions also fire the normal Bukkit events before Adapt changes the world. Cancelling the event stops Adapt. Adapt ignores checks it marked itself. Remote inventories do not apply vanilla reach, chest obstruction, spectator, or lock rules. The dispatched events are listed in [API - Protection](/adapt/46-api-protection).

On Folia, an adaptation whose targets span more than one region is skipped. Air-click targeting is off. A direct block click still runs.

## Reference

### Region flags

| Flag | Type | Default | Effect |
|---|---|---|---|
| `use-adaptations` | State | unset | `deny` makes every adaptation inert inside the region |
| `adapt-xp` | State | `allow` | `deny` zeroes all location-carrying XP earned in the region |
| `adapt-xp-multiplier` | Double | unset (`1.0`) | Scales XP earned in the region, clamped to `[0, 1000]` |
| `adapt-power-bonus` | Integer | unset (`0`) | Extra max power while standing in the region, clamped to `[-4096, 4096]` |
| `adapt-unlock-adaptations` | Set of String | unset (empty) | Temporarily grants the named adaptations at level 1. `*` grants all |

A non-finite multiplier resolves to `1.0`. Max power itself floors at `0`. A large negative power bonus cannot produce a negative budget.

```
maxPower = max(0, (int)(masterLevel * powerPerLevel) + regionPowerBonus)
```

### Default policy triggers

| Condition | Result |
|---|---|
| No installed policy source | Default policy |
| Missing player or missing location | Default policy |
| `protectorSupport.worldguard = false` | Default policy |
| Folia cannot resolve the player's region in time | Default policy |
| Source quarantined | Default policy, WorldGuard not called again |

### Protector settings

| Config key | Default | Soft depend | Protector name |
|------------|---------|-------------|----------------|
| `protectorSupport.worldguard` | `true` | WorldGuard | `WorldGuard` |
| `protectorSupport.factionsClaim` | `false` | Factions | `Factions` |
| `protectorSupport.chestProtect` | `true` | ChestProtect | `ChestProtect` |
| `protectorSupport.residence` | `true` | Residence | `Residence` |
| `protectorSupport.griefdefender` | `true` | GriefDefender | `GriefDefender` |
| `protectorSupport.griefprevention` | `true` | GriefPrevention | `GriefPrevention` |
| `protectorSupport.lockettePro` | `true` | LockettePro | `LockettePro` |

Each WorldGuard check also requires `use-adaptations` to be unset or `allow`:

| Adapt check | WorldGuard flag |
|---|---|
| `checkRegion` | `use-adaptations` |
| `canBlockBreak` | `use-adaptations` + `BLOCK_BREAK` |
| `canBlockPlace` | `use-adaptations` + `BLOCK_PLACE` |
| `canPVP` | `use-adaptations` + `PVP` |
| `canPVE` | `use-adaptations` + `DAMAGE_ANIMALS` |
| `canInteract` | `use-adaptations` + `INTERACT` |
| `canAccessChest` | `use-adaptations` + `CHEST_ACCESS` |

