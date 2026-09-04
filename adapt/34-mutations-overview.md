---
title: "Mutations Overview"
description: "Enable Mutations and manage slots, qualifications, and effects"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Mutations are an optional two-slot trait system. Each of the fifteen types has a benefit, a burden, and a trigger. The feature is disabled until `enabled = true` in `plugins/Adapt/mutations.toml`.

Slots unlock at master levels 25 and 50. Players must visit the Adapt activator block to change a slot, and each change has a ten-minute cooldown. At master level 200, perfect adaptation removes Mutation burdens by default.

## Enable the feature

1. Start the server once with Adapt installed. Adapt writes `plugins/Adapt/mutations.toml`.
2. Set `enabled = true` and save. The config watcher applies the change. It reconciles every online player. `/adapt mutations reload` does the same on demand.
3. Grant `adapt.mutations` to players. Also grant `adapt.use.mutation.<id>` for each type you want available.
4. Give `adapt.mutations.admin` to staff.

Adapt logs the enabled state at startup.

## How a player gets a Mutation

Qualification is the first gate. Every type belongs to two of the six domains: Body, Hunt, Industry, Wild, Craft, and Anomaly. Each domain is a list of skills. To qualify, learn at least one adaptation from a skill in each of the two domains. That adaptation must be at `minimumAdaptationLevel` or higher. The skill and the adaptation must both be enabled. You must also hold both use permissions. A player who has not learned Hunt skills cannot wear Gale Lung at any level.

Slots come next. Slot one unlocks at master level 25. Slot two unlocks at 50. Each unlock shows a title and a sound.

To equip, right-click the Adapt activator block. The default block is a bookshelf. This opens the Adapt menu. It also authorizes Mutation editing for the next minute. `/adapt mutations menu` then shows a page of cards. Each card is one type. The card shows the benefit, burden, state, and the reason for that state. Click a card to equip it.

A non-admin equip or clear puts a ten-minute cooldown on that slot. Damage you deal or take blocks slot changes for ten seconds. Admin commands skip those gates. They also skip the permission, world, level, and qualification checks. They still refuse duplicates and configured conflicts. Mutation effects run only in survival and adventure mode. The runtime ignores creative and spectator.

## Perfect adaptation and discovery

At master level 200 an active Mutation keeps its benefit and drops its burden. Each catalog entry says what changes. Admins can force it either way with `/adapt mutations perfect-test on|off|clear`. That override lives in memory only. Adapt drops it when the player leaves or the config reloads.

Discovery is a per-player record of which types a player has worn. When you equip a type, Adapt marks it discovered. The menu labels each card Discovered or Undiscovered. Discovery gates nothing. Admins can set it with `/adapt mutations discover <id> <true|false> [player]`.

## States

Every type gets a state and a reason string. The menu prints that reason on the card. You can see why a type is not usable from the menu alone. The state that often confuses players is `DORMANT`. The type is slotted but stopped. Common causes are a locked slot, a blacklisted world, a lost permission, or a qualification the player no longer meets. All seven states are listed in Reference.

## Cooperative effects

Some Mutations reach other players. Packmind builds Tempo when allies help on your marked target. Mycelial Nerve spreads your own good potion effects to players near you. Neither ever touches a player who has not opted in. Use the menu toggle or `/adapt mutations cooperative on|off|toggle`.

`cooperativeConsentMode` then decides which opted-in players count. `EXPLICIT` is the default. It accepts any of them. `PARTY` also requires the recipient to share the initiator's scoreboard and team name. Adapt reads that pair as a party. `FRIEND` has no friendship provider. It rejects everyone and behaves like `DISABLED`.

## Slot pairs that overlap

Two different types can always be worn together unless a profile's `conflicts` list rejects the pair. Seven pairs compete for the same runtime resource. Both types may want to move you. Both may want to save your item from breaking. Both may want to place temporary blocks. Each of those pairs has a fixed resolution rule. The rules are listed in Reference.

## GUI and commands

`/adapt mutations menu` opens the card GUI. It needs `adapt.mutations` and the feature enabled. `view` and `cooperative` are player-facing. `equip`, `clear`, `discover`, `cooldown`, `refresh`, `slot-override`, `reset`, `perfect-test`, and `reload` all require `adapt.mutations.admin`. `slot-override` forces a slot open or shut for one player regardless of their level. Unlike `perfect-test`, Adapt saves it with their data. Full syntax is in [04 - Commands & Permissions](/adapt/04-commands-permissions). Placeholders are in [47 - API - PlaceholderAPI](/adapt/47-api-placeholderapi).

## Reference

### Requirements

| Requirement | Detail |
|-------------|--------|
| Config | `mutations.toml`, `enabled = true` |
| Player permission | `adapt.mutations`, plus `adapt.use.mutation.<id>` per type |
| Admin permission | `adapt.mutations.admin` for equip, clear, discover, cooldown, refresh, slot-override, reset, perfect-test, reload, and viewing another player |
| Editing gate | Non-admin slot changes need a bookshelf authorization token, taken from the last Adapt activator block click, held for `bookshelfTokenMillis` within `bookshelfMaximumDistance` in the same world |
| Game mode | Runtime effects skip creative and spectator |

### Core config defaults (`MutationConfig`)

| Key | Default | What it does |
|-----|---------|--------------|
| `enabled` | `false` | Master switch. Saved slot choices stay on file while it is off. |
| `slotOneUnlockLevel` | `25` | Master level needed before slot 1 can hold a Mutation |
| `slotTwoUnlockLevel` | `50` | Master level needed before slot 2 can hold a Mutation |
| `perfectAdaptationLevel` | `200` | Master level at which burdens stop applying |
| `perfectAdaptationEnabled` | `true` | Whether reaching that level grants perfect adaptation at all |
| `minimumAdaptationLevel` | `1` | Level a learned adaptation must reach to count toward a domain |
| `switchCooldownMillis` | `600000` | Wait on a slot after a player equips or clears it, in milliseconds |
| `combatLockMillis` | `10000` | How long after dealing or taking damage slot changes are refused, in milliseconds |
| `switchingEnabled` | `true` | Whether players may change slots at all. `false` leaves admin commands as the only route. |
| `permanentSelection` | `false` | When true, a filled slot can never be changed by the player again |
| `pvpEnabled` | `true` | Global switch for Mutation control effects between players |
| `cooperativeEffectsEnabled` | `true` | Global switch for effects that reach other players and pets |
| `cooperativeConsentMode` | `EXPLICIT` | Which opted-in recipients count: `EXPLICIT`, `PARTY`, `FRIEND`, `DISABLED` |
| `bookshelfTokenMillis` | `60000` | How long one activator-block click keeps slot editing open, in milliseconds |
| `bookshelfMaximumDistance` | `8` | Blocks the player may move from that block while editing |
| `particlesEnabled` | `true` | Global particle switch for Mutation effects |
| `soundsEnabled` | `true` | Global sound switch for Mutation effects |
| `worldBlacklist` | `[]` | World keys where no Mutation works |
| `domainMembership` | Table below | Skill ids assigned to each domain |

Normalization runs on load and after every reload. It enforces `slotOneUnlockLevel >= 0`, `slotTwoUnlockLevel >= slotOneUnlockLevel`, `perfectAdaptationLevel >= slotTwoUnlockLevel`, and `minimumAdaptationLevel >= 1`. Switch and combat durations clamp to 0 through 31,536,000,000 ms. The bookshelf token clamps to 1,000 through 300,000 ms. Bookshelf distance clamps to 2 through 32 blocks. World lists keep at most 256 normalized world keys. Each domain list keeps at most 64 unique lowercase skill ids.

### Per-type profile keys

Every type has these keys under its camel-case TOML section, such as `galeLung` or `resonantFormula`. Type-specific keys and their clamps are listed per entry in [35 - Mutations Catalog](/adapt/35-mutations-catalog).

| Key | Default | Normalization |
|-----|---------|---------------|
| `enabled` | `true` | Boolean. Turns this one type off while the feature stays on. |
| `pvpEnabled` | `true` | Boolean. Also requires global `pvpEnabled`. |
| `particlesEnabled` | `true` | Boolean. Also requires global `particlesEnabled`. |
| `soundsEnabled` | `true` | Boolean. Also requires global `soundsEnabled`. |
| `worldBlacklist` | `[]` | At most 256 normalized world keys |
| `conflicts` | `[]` | At most 15 unique lowercase Mutation ids that cannot share a loadout with this one |

### Domain membership defaults

| Domain | Default skill membership |
|--------|--------------------------|
| BODY | agility, blocking, unarmed, kinetics |
| HUNT | swords, ranged, hunter, stealth |
| INDUSTRY | architect, axes, excavation, pickaxe |
| WILD | herbalism, taming, seaborne |
| CRAFT | crafting, brewing, enchanting, discovery |
| ANOMALY | nether, rift, chronos, tragoul |

At most 64 candidate adaptations per domain are scanned per player.

### Mutation states

| State | Meaning |
|-------|---------|
| `LOCKED` | Not selected, and slot one is not unlocked yet |
| `AVAILABLE` | Qualified and permitted, ready to equip |
| `EXPRESSED` | Selected and running |
| `DORMANT` | Selected but not running: feature off, type off, slot locked, missing permission, blocked world, or no longer qualified |
| `DISABLED` | Not selected, and either the feature or this type is off |
| `RESTRICTED` | Not selected, and blocked by permission, world, or qualification |
| `CONFLICT` | The same id sits in both slots, or the pair is rejected by a `conflicts` list |

### Shared-resource pairs

| Pair | Exclusive claims | Resolution |
|------|------------------|------------|
| Umbral Echo + Resonant Formula | utility echo | Only the first legal utility echo is scheduled |
| Temperbound + Masterwork Bond | item preservation | Only one preservation result applies to a durability event |
| Packmind + Mycelial Nerve | cooperative link | Each recipient consents independently, and propagation does not chain |
| Living Lattice + Gravebloom | world state | Each temporary structure stays separately owned and bounded |
| Gale Lung + Bastion Spine | movement, posture | The most recent deliberate movement or posture action owns the result |
| Deepblood + Gravebloom | recovery | Recovery evaluates once in deterministic slot order |
| Paradox Scar + Umbral Echo | movement, utility echo | Movement resolves before control echoes |
## See also

- [35 - Mutations Catalog](/adapt/35-mutations-catalog)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
- [48 - API - Mutations](/adapt/48-api-mutations)
