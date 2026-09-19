---
title: "Skill - Taming"
description: "Taming XP sources, adaptations, controls, and configuration"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Taming gains XP from taming, breeding, pet damage, and pet kills.

Its 14 adaptations improve pet health, damage, regeneration, targeting, recall, damage sharing, item retrieval, projectile protection, mounted combat, taming, and lethal-hit survival. Beast Recall uses a lead, Alpha's Command uses a bone, and Wild Empathy uses the animal's taming food.

## How you earn Taming XP

- Taming an animal pays `tameSuccessXP` and counts toward `taming.tamed`.
- Breeding pays `tameXpBase` and counts toward `taming.bred`.
- A tamed pet damaging something pays damage times `tameDamageXPMultiplier` and adds the raw damage to `taming.pet.damage`.
- A mob killed by your pet pays `petKillXP` and counts toward `taming.pet.kills`. The credit only fires when no player is the mob's killer, and TragOul skeletal servants and Excavation grave mobs are excluded.

Breeding XP and pet damage XP share one cooldown of `cooldownDelay`
milliseconds. A long fight or a breeding spree pays on a steady drip rather than
per event. Tame and pet-kill XP have no such cooldown.

## Adaptations

All of this needs the adaptation learned to level 1 or higher from the Adapt menu (`/adapt`), the skill and the adaptation enabled in config, the `adapt.use` permission, and protection and region policy that allow the action.

### Tame Health (`tame-health`)

5 levels · 3 knowledge, then 6 per level

Every animal you own gets a large percentage boost to its maximum health, for as long as you are online and own it. Good first pick, because a dead wolf does no damage.

Menu lore: "Increased Health".

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `healthBoostFactor` | `2.5` | Extra max-health multiplier added at full level percent. |
| `healthBoostBase` | `0.57` | Max-health multiplier applied at level percent 0. Total is applied as a scalar to the pet's max health. |
| `maxTameablesPerPass` | `128` | Loaded tameables examined per scheduler pass. |

### Tame Damage (`tame-damage`)

5 levels · 5 knowledge, then 6 per level

Your pets hit harder. Same idea as Tame Health, but on attack damage, and it pairs with anything that sends pets into a fight.

Menu lore: "Increased Damage".

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `baseDamage` | `0.08` | Attack-damage multiplier applied at level percent 0. |
| `damageFactor` | `0.65` | Extra attack-damage multiplier added at full level percent. Total is applied as a scalar to the pet's attack damage. |
| `maxTameablesPerPass` | `128` | Loaded tameables examined per scheduler pass. |

### Tame Regeneration (`tame-health-regeneration`)

3 levels · 8 knowledge, then 7 per level

When one of your pets takes damage, it heals a chunk back a moment later. Each pet has its own 8 second window between heals, so it takes the edge off sustained fights instead of making pets unkillable. Caps at level 3.

Menu lore: "HP/s".

Per-pet heal cooldown is fixed at 8000 ms in code. Heal amount is `regenBase` plus level percent squared times `regenFactor`, capped by missing health.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `regenFactor` | `5` | Health points added to the heal at full level percent. |
| `regenBase` | `1` | Health points healed at level percent 0. |

### Pack Leader Aura (`tame-pack-leader-aura`)

5 levels · 3 knowledge

Pets near you get speed and regeneration for as long as they stay in range. The radius and the effect strength both grow with level. Purely passive: stay near the pack and it applies itself.

Menu lore: "Aura Radius", "Aura Strength".

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `8` | Aura radius in blocks at level percent 0. |
| `radiusFactor` | `14` | Extra aura radius in blocks at full level percent. |
| `maxAmplifier` | `2` | Highest potion amplifier the aura can reach. The applied amplifier is level percent times this, rounded down. |
| `effectTicks` | `80` | Duration in ticks of each speed and regeneration reapplication. |
| `maxOwnersPerPass` | `16` | Owners refreshed per scheduler tick, hard-capped at 16. |
| `maxTameablesPerPass` | `48` | Indexed tameables examined per scheduler tick, hard-capped at 48. |

### Beast Recall (`tame-beast-recall`)

5 levels · 4 knowledge

Pulls your nearest owned pet to a safe spot beside you. Handy when a wolf gets stuck on terrain or a horse wanders off during a fight.

How to use it:

1. Hold a lead in your main hand.
2. Sneak and right-click.
3. The nearest owned pet inside the recall radius teleports next to you. One pet per use.

The recall needs a safe landing spot near you (open feet and head space over solid ground) and costs `hungerCost` food points. It puts a visible item cooldown on leads, which is what stops you from spamming it. Pets already closer than the minimum distance are ignored.

Menu lore: "Recall Radius", "Recall Cooldown", and "Hunger cost per recall" when `hungerCost` is above 0.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `20` | Search radius in blocks at level percent 0. |
| `radiusFactor` | `38` | Extra search radius in blocks at full level percent. |
| `minRecallDistanceSquared` | `9.0` | Squared block distance a pet must exceed to be worth recalling (9.0 is 3 blocks). |
| `cooldownTicksBase` | `420` | Lead item cooldown in ticks at level percent 0. |
| `cooldownTicksFactor` | `280` | Ticks removed from that cooldown at full level percent, with a floor of 40 ticks. |
| `xpOnRecall` | `26` | Taming XP paid per successful recall. |
| `hungerCost` | `2` | Food points consumed per recall. 0 disables the cost. |
| `maxCandidatesPerActivation` | `16` | Nearby tameables inspected per recall, hard-capped at 32. |
| `maxAffectedPerActivation` | `1` | Pets recalled per activation, hard-capped at 1. 0 disables the effect. |

### Shared Pain (`tame-shared-pain`)

5 levels · 4 knowledge

Some of the damage aimed at you is split across nearby pets instead. The split never takes a pet below its health floor, and whatever the pack absorbs is subtracted from your own hit. You get Taming XP for the damage they eat for you.

Menu lore: "Shared Damage", "Companion Health Floor".

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `redirectPercentBase` | `0.2` | Fraction of incoming damage redirected at level percent 0, 0-1. |
| `redirectPercentFactor` | `0.35` | Extra redirected fraction at full level percent. |
| `maxRedirectPercent` | `0.7` | Hard ceiling on the redirected fraction, 0-1. |
| `petHealthFloorBase` | `1.0` | Health each pet keeps before it stops absorbing, at level percent 0. |
| `petHealthFloorFactor` | `1.0` | Extra health floor at full level percent. |
| `radiusBase` | `8.0` | Pet search radius in blocks at level percent 0. |
| `radiusFactor` | `8.0` | Extra search radius in blocks at full level percent. |
| `maxPets` | `8` | Pets included in one damage split, hard-capped at 16. |
| `xpPerRedirectedDamage` | `2.0` | Taming XP per point of damage the pack actually absorbed. |

### Mounted Tactics (`tame-mounted-tactics`)

5 levels · 4 knowledge

Riding gets better in several ways at once. You deal more damage and take less while mounted on a horse, strider, or pig. Horses gain speed and jump strength. Striders gain speed and stop shivering over
lava. You get fire resistance while riding a strider. Pigs give you resistance. Sprinting on a horse or a pig also adds a forward shove, so the mount actually feels like it is charging.

How to use it:

1. Ride a horse-type mount (donkeys, mules, and llamas count), a strider, or a pig.
2. Fight from the saddle for the damage bonus and reduction.
3. Sprint while mounted on a horse or pig for the extra push.

Menu lore: "Mounted Damage Bonus", "Mounted Damage Reduction".

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `mountedDamageBonusBase` | `0.08` | Fraction added to your mounted melee damage at level percent 0. |
| `mountedDamageBonusFactor` | `0.22` | Extra fraction at full level percent. |
| `maxMountedDamageBonus` | `0.35` | Ceiling on the mounted damage bonus, 0-1. |
| `mountedDamageReductionBase` | `0.06` | Fraction of incoming damage removed while mounted, at level percent 0. |
| `mountedDamageReductionFactor` | `0.2` | Extra fraction at full level percent. |
| `maxMountedDamageReduction` | `0.28` | Ceiling on the mounted damage reduction, 0-1. |
| `horseSpeedAmplifierBase` | `0` | Speed-effect amplifier the horse speed bonus is derived from, at level percent 0. |
| `horseSpeedAmplifierFactor` | `2` | Amplifier added at full level percent. |
| `striderSpeedAmplifierBase` | `0` | Same amplifier basis for striders, at level percent 0. |
| `striderSpeedAmplifierFactor` | `2` | Amplifier added at full level percent. |
| `horseJumpStrengthBonusBase` | `0.1` | Fraction added to horse jump strength at level percent 0. |
| `horseJumpStrengthBonusFactor` | `0.15` | Extra fraction at full level percent. |
| `pigResistanceAmplifierBase` | `0` | Resistance amplifier given to a pig rider at level percent 0. |
| `pigResistanceAmplifierFactor` | `1` | Amplifier added at full level percent. |
| `horseBaseHorizontalSpeed` | `0.3` | Reference horse speed in blocks per tick used to convert the amplifier into a movement-speed scalar. |
| `striderBaseHorizontalSpeed` | `0.24` | Same reference for striders. |
| `mountMaxHorizontalSpeed` | `0.78` | Hard ceiling in blocks per tick that the speed scalar is clamped against. |
| `horsePushBase` | `0.08` | Forward velocity added per sprinting move on a horse, at level percent 0. |
| `horsePushFactor` | `0.16` | Extra forward velocity at full level percent. |
| `pigPushBase` | `0.05` | Forward velocity added per sprinting move on a pig, at level percent 0. |
| `pigPushFactor` | `0.12` | Extra forward velocity at full level percent. |
| `xpPerMountedDamage` | `1.5` | Taming XP per point of damage you deal while mounted. |

### Fetch (`tame-fetch`)

5 levels · 3 knowledge

Your idle tamed wolves physically collect dropped items around you. A wolf must path to the drop, get within 1.5 blocks, and pick it up. Then it paths back within 2 blocks of you and drops the carried stack at its own position. Fetch never teleports an item to you. If no eligible wolf can reach it, the item stays where it is.

How to use it:

1. Keep tamed wolves near you. Sitting, leashed, and riding wolves are skipped.
2. Drop items or walk near loose drops.
3. Wolves work automatically on their own pass, subject to the carry chance roll.

Anything a protection plugin would stop you picking up is not fetched either. Where the drop came from does not matter, but a wolf still has to make the trip. On a server with no pathfinder API, Fetch leaves drops alone rather than teleporting them.

Menu lore: "Fetch Range", "Carry Chance".

A fetch is abandoned if the wolf ends up more than 11 blocks from you, which is where vanilla yanks pets back, and anything it was carrying is dropped safely.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `fetchRangeBase` | `6.0` | Item search radius in blocks at level percent 0. |
| `fetchRangeFactor` | `10.0` | Extra search radius in blocks at full level percent. |
| `carryRateBase` | `0.35` | Chance per eligible drop that it gets fetched this pass, at level percent 0, 0-1. |
| `carryRateFactor` | `0.5` | Extra chance at full level percent. |
| `maxCarryRate` | `0.9` | Ceiling on that chance, 0-1. |
| `wolfSearchRadius` | `24.0` | Radius in blocks searched for your tamed wolves. |
| `xpPerItemFetched` | `4` | Taming XP per delivered item. |
| `maxWolves` | `6` | Eligible idle wolves used around the owner, hard-capped at 12. |
| `maxCarryPerTick` | `4` | Drops handled per owner per pass, hard-capped at 8. |
| `fetchWalkSpeed` | `1.15` | Pathfinding speed multiplier while walking a fetch, clamped to 0.1 - 4.0. |
| `pathfindRadius` | `9.0` | Farthest drop a wolf may physically fetch, in blocks, clamped internally to 11. Farther drops remain untouched. |
| `fetchDeadlineMillis` | `9000` | Milliseconds a walked fetch may run before it is abandoned, clamped to 1000 - 60000. |
| `maintenanceIntervalTicks` | `5` | Ticks between re-issuing the wolf its path, clamped to 1 - 20. |

### Alpha's Command (`tame-alphas-command`)

5 levels · 4 knowledge

Marks a target and sends every nearby combat pet at it. Only wolves, cats, and llamas answer the call. Commanded pets are stood up if they were sitting. They get a short attack damage and movement speed buff. They stay on the target until the focus runs out, the target dies, or the target stops being a legal thing for you to hit.

How to use it:

1. Hold a bone in your main hand.
2. Sneak and left-click at what you want dead. You can also sneak and melee the target directly.
3. The target glows red for you alone while your pack focuses it.

Each successful command eats one bone (not in creative) and has its own cooldown. Your own pets, NPCs, invulnerable entities, and TragOul servants are never valid targets.

Menu lore: "Command Range", "Focus Duration".

Focus buffs are attack damage of 3.0 x (amplifier + 1) and a movement speed scalar of 0.2 x (amplifier + 1), re-checked against PvP and PvE policy for as long as the focus holds.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `commandRangeBase` | `8.0` | Raycast and pet-gather radius in blocks at level percent 0. |
| `commandRangeFactor` | `12.0` | Extra radius in blocks at full level percent. |
| `focusTicksBase` | `60` | Focus duration in ticks at level percent 0. |
| `focusTicksFactor` | `120` | Extra focus ticks at full level percent, with a floor of 20 ticks. |
| `focusSpeedAmplifier` | `0` | Amplifier for the attack-damage and movement-speed buff given to commanded pets. |
| `commandCooldownMillis` | `3000` | Milliseconds between commands for one player. |
| `xpPerCommand` | `12` | Taming XP per successful command. |
| `maxPets` | `12` | Pets commanded per activation, hard-capped at 24. |

### Guardian Instinct (`tame-guardian-instinct`)

5 levels · 4 knowledge

An arrow headed for you can be intercepted by a nearby pet. The pet leaps at you
and eats the shot at reduced damage. Your hit is cancelled outright. It rolls per projectile, and a short cooldown stops one pet from soaking an entire barrage.

Menu lore: "Intercept Chance", "Pet Damage Reduction".

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `interceptChanceBase` | `0.35` | Chance per incoming projectile that a pet intercepts, at level percent 0, 0-1. |
| `interceptChanceFactor` | `0.45` | Extra chance at full level percent. |
| `maxInterceptChance` | `0.8` | Ceiling on the intercept chance, 0-1. |
| `petReductionBase` | `0.4` | Fraction of the intercepted damage removed before the pet takes it, at level percent 0. |
| `petReductionFactor` | `0.35` | Extra fraction at full level percent. |
| `maxPetReduction` | `0.7` | Ceiling on that reduction, 0-1. |
| `radiusBase` | `8.0` | Radius in blocks searched for an intercepting pet, at level percent 0. |
| `radiusFactor` | `8.0` | Extra radius in blocks at full level percent. |
| `leapStrength` | `0.8` | Velocity applied to the pet as it lunges toward you. |
| `cooldownMillis` | `1200` | Milliseconds between intercepts for one player. |
| `xpPerDamageIntercepted` | `2.0` | Taming XP per point of the original incoming damage. |

### Stable Hand (`tame-stable-hand`)

5 levels · 3 knowledge, then 5 per level

Animals you tame or breed keep a permanent bias toward better movement speed, jump strength, max health, and safe fall distance. The modifiers stay on the animal, so breeding programs compound over time. Tame or breed as usual and the bias applies itself, with a short chime to confirm.

Menu lore: "Attribute Bias", "Safe Fall Blocks".

The bias is applied as a scalar to movement speed, jump strength, and max
health. It is also a flat block bonus to safe fall distance equal to bias x 10.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `biasBase` | `0.1` | Attribute bias at level percent 0, as a fraction. |
| `biasFactor` | `0.2` | Extra bias at full level percent. |
| `maxBias` | `0.3` | Ceiling on the bias, 0-1. |
| `xpPerAnimal` | `20` | Taming XP per animal that receives the bias. |

### Wild Empathy (`tame-wild-empathy`)

5 levels · 3 knowledge, then 4 per level

Two effects. Taming can succeed instantly on a roll instead of grinding through vanilla's odds, and neutral mobs frequently give up on being angry at you.

How to use it:

1. Hold the animal's normal taming food: bone for wolves, cod or salmon for cats and ocelots, any of the seeds for parrots.
2. Right-click the untamed animal.
3. On a successful roll the animal is tamed immediately and one food item is consumed.

The anger half applies to wolves, bees, polar bears, llamas, pandas, and goats and works on its own with no gesture.

Menu lore: "Extra Taming Odds", "Anger Resistance".

Taming foods in code: `BONE` for wolves. `COD` and `SALMON` for cats and ocelots. `WHEAT_SEEDS`, `MELON_SEEDS`, `PUMPKIN_SEEDS`, `BEETROOT_SEEDS`, `TORCHFLOWER_SEEDS`, and `PITCHER_POD` for parrots. Pacifiable neutrals: wolves, bees, polar bears, llamas, pandas, goats, and only while untamed.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `tamingOddsBase` | `0.25` | Chance per feed that the animal is tamed outright, at level percent 0, 0-1. |
| `tamingOddsFactor` | `0.4` | Extra chance at full level percent. |
| `maxTamingOdds` | `0.6` | Ceiling on the taming chance, 0-1. |
| `angerResistanceBase` | `0.3` | Chance per targeting attempt that the mob is calmed, at level percent 0, 0-1. |
| `angerResistanceFactor` | `0.45` | Extra chance at full level percent. |
| `maxAngerResistance` | `0.75` | Ceiling on the anger resistance, 0-1. |
| `xpPerTame` | `60` | Taming XP per forced tame. |

### Battle Bond (`tame-battle-bond`)

5 levels · 3 knowledge

When one of your pets lands a kill, you and every owned pet nearby get speed,
regeneration, and strength for a few seconds. The bonded pets briefly glow. It turns a pack fight into a snowball as long as kills keep coming.

Menu lore: "Buff Tier", "Buff Duration".

Buffs are Speed, Regeneration, and Strength where the server exposes it. The lore line shows tier as amplifier + 1, so the displayed tier 1 is potion amplifier 0.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `maxBuffTier` | `1` | Highest potion amplifier reachable. The applied amplifier is level percent times (this + 1), rounded down and clamped here. |
| `buffTicksBase` | `80` | Buff duration in ticks at level percent 0. |
| `buffTicksFactor` | `120` | Extra duration in ticks at full level percent, with a floor of 20 ticks. |
| `packRadius` | `16` | Radius in blocks searched for pack members to buff. |
| `xpPerKill` | `10` | Taming XP per Battle Bond trigger. |
| `maxPack` | `12` | Pack members buffed per kill, hard-capped at 24. |
| `glowTicks` | `30` | Ticks bonded pets glow, clamped to 10 - 60. |

### Last Breath (`tame-last-breath`)

5 levels · 4 knowledge

A killing blow on a pet is refused. The pet is set to 1 HP, made immune for a short window, and teleported to a safe spot next to you. Each pet has its own long cooldown, so it is a rescue, not a health bar.

Menu lore: "Per-Pet Cooldown", "Invulnerability".

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `cooldownMillisBase` | `300000` | Per-pet cooldown in milliseconds at level percent 0. |
| `cooldownMillisFactor` | `180000` | Milliseconds removed from that cooldown at full level percent. |
| `minCooldownMillis` | `60000` | Floor on the per-pet cooldown in milliseconds. |
| `invulnTicks` | `60` | Ticks of invulnerability after a save, with a floor of 10. |
| `xpPerSave` | `40` | Taming XP per save. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/taming.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole Taming skill on or off. |
| `skillColor` | `"&6"` | Legacy ampersand color code used for Taming in menus and text. |
| `tameXpBase` | `65` | Skill XP paid when you breed an animal. |
| `cooldownDelay` | `1500` | Milliseconds between breeding and pet-damage XP awards for one player. |
| `tameDamageXPMultiplier` | `8.0` | Skill XP per point of damage your pets deal. |
| `tameSuccessXP` | `150` | Skill XP paid when you tame an animal. |
| `petKillXP` | `25` | Skill XP paid when one of your pets kills a mob. |
| `challengeTamingReward` | `500` | Knowledge paid by the breeding challenges. |
| `challengePetDmgReward` | `500` | Knowledge paid by the pet damage challenges. |
| `challengeTamedReward` | `500` | Knowledge paid by the tamed-animal challenges. |
| `challengePetKillsReward` | `500` | Knowledge paid by the pet kill challenges. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_taming_10` | 10 | `challengeTamingReward` |
| `challenge_taming_50` | 50 | `challengeTamingReward` x 2 |
| `challenge_taming_500` | 500 | `challengeTamingReward` x 5 |
| `challenge_pet_dmg_500` | 500 | `challengePetDmgReward` |
| `challenge_pet_dmg_5k` | 5000 | `challengePetDmgReward` x 5 |
| `challenge_tamed_10` | 10 | `challengeTamedReward` |
| `challenge_tamed_100` | 100 | `challengeTamedReward` x 5 |
| `challenge_pet_kills_25` | 25 | `challengePetKillsReward` |
| `challenge_pet_kills_250` | 250 | `challengePetKillsReward` x 5 |

Each adaptation has its own file at `plugins/Adapt/adaptations/<id>.toml`. Alongside the keys listed above it carries `enabled`, `permanent`, `showParticles`, `showSounds`, and its learn costs (`maxLevel`, `initialCost`, `baseCost`, `costFactor`). Every file is generated with a comment on each key and values are clamped on load.

## See also

- [02 - Concepts](/adapt/02-concepts) for levels, knowledge, and how adaptations are learned.
- [03 - Player Usage](/adapt/03-player-usage) for the Adapt menu and general play.
- [10 - Skills Catalog](/adapt/10-skills-catalog) for the full skill list.
- [04 - Commands & Permissions](/adapt/04-commands-permissions) for the `adapt.use` nodes.
