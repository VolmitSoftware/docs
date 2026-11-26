---
title: "Upgrades - Taming"
description: "Taming upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you mutate Taming (see [Mutations](/adapt/35-mutations)), and they replace the [Taming](/adapt/31-skill-taming) adaptations they fuse.

## Upgrades

### Alpha (`upgraded-taming-alpha`)

3 levels · 13, 13 and 16 knowledge · Fuses Tame Damage, Tame Health, Tame Regeneration and Pack Leader Aura

While you are online, every loaded pet you own gets bonuses, refreshed once a second:

- Attack damage +45%, +65% or +85% at levels 1, 2 and 3.
- Maximum health +207%, +257% or +307%.
- When a creature hits it, the pet heals 4, 5 or 6 health. The same pet heals at most once every 6 seconds.

Pets within your aura of 14, 18 or 22 blocks get 1.5 times the damage bonus and the healing, plus Speed and Regeneration for 4 seconds after each refresh: level I at level 1, II at level 2 and III at level 3.

**Bonded mount.** Bond one horse, donkey, mule, camel or strider with the [Beastmaster's Whistle](#one-mind-upgraded-taming-one-mind): right-click a mount you tamed, or ride it and pick Bond This Mount in the whistle's menu. Camels and striders nobody owns can be bonded too. You can only bond a mount you are allowed to interact with where it stands. Bonding another mount ends the earlier bond.

- While you ride your bonded mount, Mounted Tactics works at its top level on it.
- Every block you ride it adds 0.01% speed and health, up to +10%, +20% or +30% at levels 1, 2 and 3. At most 20 blocks a second count. The growth is stored on the mount and stays if it changes hands, but it only works while its bonded owner rides it. Once someone else tames the mount, the old bond ends.
- Sneak-right-click with the whistle calls the mount to you from up to 128 blocks if it can find a path. A call without a pet recall costs 1 food point and starts the whistle cooldown.

Personal controls: Speed bonus (on/off); Pack regeneration (on/off).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `damageBoostBase` | `0.25` | Pet damage bonus before level scaling. |
| `damageBoostPerLevel` | `0.2` | Pet damage bonus added per level. |
| `healthBoostBase` | `1.57` | Pet maximum health bonus before level scaling. |
| `healthBoostPerLevel` | `0.5` | Pet maximum health bonus added per level. |
| `regenerationBase` | `3.0` | Health a hurt pet regains before level scaling. |
| `regenerationPerLevel` | `1.0` | Health regained added per level. |
| `regenCooldownMillis` | `6000` | Time before the same pet heals again, in milliseconds. |
| `auraRadiusBase` | `10` | Aura radius around you before level scaling, in blocks. |
| `auraRadiusPerLevel` | `4` | Aura radius added per level, in blocks. |
| `nearMultiplier` | `1.5` | Multiplier on the damage bonus and healing for pets inside your aura. |
| `auraTicks` | `80` | Ticks the aura's speed and regeneration last after each refresh. |
| `maxPetsPerPass` | `128` | Most loaded pets refreshed each second. |
| `growthCapBase` | `0` | Bonded mount growth cap before level scaling, as a fraction of its speed and health. |
| `growthCapPerLevel` | `0.1` | Growth cap added per level. |
| `growthPerBlock` | `0.0001` | Growth a bonded mount gains for each block you ride it. |
| `maxBlocksPerSecond` | `20` | Most blocks of riding counted each second. |
| `growthStep` | `0.05` | Growth between two shows of the mount's growth. |
| `callRange` | `128` | Farthest a bonded mount comes from when the whistle calls, in blocks. |
| `callSpeed` | `1.4` | Walking speed of a called mount. |

### One Mind (`upgraded-taming-one-mind`)

3 levels · 15, 14 and 18 knowledge · Fuses Alpha's Command, Beast Recall and Fetch

One Mind gives you the **Beastmaster's Whistle**, crafted from a goat horn or a bone with a string and an iron nugget. It works only for you while you hold One Mind; for anyone else it does nothing. Bones are no longer used for commands, so they feed wolves again.

- **Send:** right-click a creature, or look at one within 16, 24 or 32 blocks at levels 1, 2 and 3, and right-click. Up to 12 nearby wolves, cats and llamas chase it for 6, 8 or 10 seconds with +3 attack damage and +20% speed, or +6 damage and +40% speed at level 3. You can send again after 2.5 seconds. Target rules match Alpha's Command.
- **Recall:** sneak-right-click to teleport your nearest pet within 44, 56 or 68 blocks to a safe spot beside you, and to call your bonded mount if you hold Alpha. Pets within 3 blocks are ignored. A recall costs 1 food point and puts the whistle on a 12, 9 or 6 second cooldown.
- **Fetch:** idle wolves within 24 blocks fetch drops within 9 blocks of you on their own, as with Fetch. Turn it off in the whistle's menu (left-click).
- **Roles (level 2 and up):** the menu lists your named pets within 32 blocks. Click one to cycle its role: guard you (attacks hostile mobs within 10 blocks of you), guard this spot (sits where you stand, attacks hostile mobs within 10 blocks of it and returns to it; only where you can build), or fetch (fetches even with fetch turned off). Guards ignore mobs from spawners, eggs, buckets, breeding and portals.

Personal controls: Eligible pet types; Command targets; Include sitting pets (on/off); Hunger remaining after recall (none, keep 4, keep 8); Items to fetch; Wolves allowed to fetch.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `commandRangeBase` | `8` | Range for sending the pack at a target before level scaling, in blocks. |
| `commandRangePerLevel` | `8` | Sending range added per level, in blocks. |
| `focusTicksBase` | `80` | Ticks pets stay focused on a target before level scaling. |
| `focusTicksPerLevel` | `40` | Focus ticks added per level. |
| `commandCooldownMillis` | `2500` | Time between two sends at a target, in milliseconds. |
| `maxPets` | `12` | Most pets sent at one target, capped at 24. |
| `recallRadiusBase` | `32` | Radius searched for a pet to recall before level scaling, in blocks. |
| `recallRadiusPerLevel` | `12` | Recall radius added per level, in blocks. |
| `recallCooldownTicksBase` | `300` | Whistle cooldown after a recall before level scaling, in ticks; never below 40. |
| `recallCooldownTicksPerLevel` | `60` | Recall cooldown removed per level, in ticks. |
| `recallHungerCost` | `1` | Food points each recall costs; 0 turns the cost off. |
| `fetchRange` | `9` | Range around you in which wolves fetch drops, in blocks; capped at 11. |
| `carryRate` | `0.85` | Chance each drop is fetched on a pass, from 0 to 1. |
| `wolfSearchRadius` | `24` | Radius searched for idle wolves to send, in blocks. |
| `maxWolves` | `6` | Most wolves counted for one pass, capped at 12. |
| `maxItemsPerSend` | `6` | Most drops fetched by one pass, capped at 8. |
| `fetchWalkSpeed` | `1.3` | Walking speed of a fetching wolf, clamped to 0.1-4.0. |
| `fetchDeadlineMillis` | `9000` | Time a fetch may run before it is given up, in milliseconds; clamped to 1000-60000. |
| `rolesLevel` | `2` | One Mind level from which named pets take roles in the whistle's menu. |
| `menuRadius` | `32` | Radius around you in which the whistle's menu lists named pets, in blocks. |
| `guardRadius` | `10` | Radius around a guard's post in which it attacks hostile mobs, in blocks. |

### Blood Bond (`upgraded-taming-blood-bond`)

3 levels · 13, 13 and 16 knowledge · Fuses Shared Pain, Guardian Instinct and Last Breath

- **Shared damage:** 35%, 45% or 55% of each hit you take at levels 1, 2 and 3, counted after armor, is spread across up to 8 of your pets within 12 blocks, and you take the rest. Each pet stops taking shared damage at 2 health.
- **Intercepts:** when a projectile hits you, there is a 55%, 70% or 85% chance that your nearest pet within 12 blocks leaps in front of it. You take no damage and the pet takes 40% of it. Intercepts have a 1 second cooldown.
- **Last stand:** a pet of yours that would die stays at 1 health, cannot be hurt for 3 seconds and is teleported to you. Each pet can be saved once every 3, 2 or 1 minutes.

Shared damage pays 2 skill XP per point and intercepts 2 XP per point blocked, only for damage from natural mobs or players. Saves pay no XP.

Personal controls: Eligible pet types; Pet health remaining after protection (server minimum, at least 50%, at least 75%).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `sharePercentBase` | `0.25` | Share of your incoming damage spread across pets before level scaling. |
| `sharePercentPerLevel` | `0.1` | Share of incoming damage added per level. |
| `maxSharePercent` | `0.6` | Highest share of a hit your pets can take. |
| `petHealthFloor` | `2.0` | Health each pet keeps before it stops taking shared damage. |
| `radius` | `12.0` | Radius in blocks searched for pets that share damage or intercept shots. |
| `maxPets` | `8` | Most pets that share one hit, capped at 16. |
| `interceptChanceBase` | `0.4` | Chance a pet intercepts a shot before level scaling. |
| `interceptChancePerLevel` | `0.15` | Intercept chance added per level. |
| `maxInterceptChance` | `0.85` | Highest intercept chance at any level. |
| `petReduction` | `0.6` | Share of an intercepted shot the pet does not take. |
| `leapStrength` | `0.8` | Leap velocity of a pet intercepting a shot. |
| `interceptCooldownMillis` | `1000` | Time between two intercepts, in milliseconds. |
| `saveCooldownMillisBase` | `240000` | Per-pet time between two saves before level scaling, in milliseconds. |
| `saveCooldownMillisReduction` | `180000` | Save cooldown removed at the top level, in milliseconds. |
| `minimumSaveCooldownMillis` | `45000` | Shortest per-pet save cooldown, in milliseconds. |
| `invulnTicks` | `60` | Ticks a saved pet cannot be hurt; at least 10. |
| `xpPerSharedDamage` | `2.0` | Skill XP per point of damage from a natural mob or a player your pets share. |
| `xpPerInterceptedDamage` | `2.0` | Skill XP per point of damage from a natural mob or a player a pet intercepts. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [Taming](/adapt/31-skill-taming).
