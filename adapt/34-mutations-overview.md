---
title: "Mutations Overview"
description: "Mutation slots, qualification, and settings"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Mutations are an optional two-slot track. Each of the fifteen types has a benefit, a burden, and a trigger. The feature is off until `enabled = true` in `plugins/Adapt/mutations.toml`. That file hot-reloads. Global keys and per-type defaults are in [Installation and configuration](/adapt/01-installation-configuration). Each type is in the [Mutations catalog](/adapt/35-mutations-catalog).

A type belongs to two domains. To qualify, the player needs a learned adaptation at `minimumAdaptationLevel` or higher from an enabled skill in each domain, plus `adapt.mutations` and `adapt.use.mutation.<id>`.

Slot 1 unlocks at master level `slotOneUnlockLevel` (default 25). Slot 2 unlocks at `slotTwoUnlockLevel` (default 50). Effects run in survival and adventure.

A non-admin slot change needs an activator-block click within `bookshelfTokenMillis` and `bookshelfMaximumDistance`. The change then waits `switchCooldownMillis`. Damage dealt or taken blocks changes for `combatLockMillis`. `switchingEnabled` false leaves changes to admins. `permanentSelection` locks the first choice until an admin clears it. Admin equip, clear, and reset skip permission, world, level, qualification, cooldown, and combat lock. They still refuse a duplicate id and a configured `conflicts` pair.

At master level `perfectAdaptationLevel` (default 200), an active mutation keeps its benefit and drops its burden when `perfectAdaptationEnabled` is true. `/adapt mutations perfect-test` overrides that in memory until quit or reload. Discovery records which types a player has equipped. It gates nothing.

`cooperativeConsentMode` filters players who opted in with `/adapt mutations cooperative`. `EXPLICIT` accepts any of them. `PARTY` also requires the same scoreboard team. `FRIEND` and `DISABLED` accept nobody.

Two types can be worn together unless either profile lists the other in `conflicts`.

## States

| State | Meaning |
|---|---|
| `LOCKED` | Not selected, and slot 1 is still locked |
| `AVAILABLE` | Qualified and permitted |
| `EXPRESSED` | Selected and running |
| `DORMANT` | Selected, but stopped: feature off, type off, slot locked, missing permission, blocked world, or no longer qualified |
| `DISABLED` | Not selected, and the feature or this type is off |
| `RESTRICTED` | Not selected, and blocked by permission, world, or qualification |
| `CONFLICT` | The same id is in both slots, or `conflicts` rejects the pair |

## Domains

| Domain | Skills |
|---|---|
| BODY | agility, blocking, unarmed, kinetics |
| HUNT | swords, ranged, hunter, stealth |
| INDUSTRY | architect, axes, excavation, pickaxe |
| WILD | herbalism, taming, seaborne |
| CRAFT | crafting, brewing, enchanting, discovery |
| ANOMALY | nether, rift, chronos, tragoul |

At most 64 candidate adaptations per domain are scanned per player.

Every type profile also has `enabled`, `pvpEnabled`, `particlesEnabled`, `soundsEnabled`, `worldBlacklist`, and `conflicts`. A per-type switch still requires the matching global switch.

Commands: [Commands and permissions](/adapt/04-commands-permissions). Placeholders: [PlaceholderAPI](/adapt/47-api-placeholderapi).
