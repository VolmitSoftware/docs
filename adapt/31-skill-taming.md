---
title: "Skill - Taming"
description: "Taming XP sources, adaptations, controls, and configuration"
published: true
date: 2026-10-01T09:26:24.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Taming gains XP from taming, breeding, pet damage, and pet kills.

Its 14 adaptations improve pet health, damage, regeneration, targeting, recall, damage sharing, item retrieval, projectile protection, mounted combat, taming, and lethal-hit survival; Beast Recall uses a lead, Alpha's Command uses a bone, and Wild Empathy uses the animal's taming food.

## How you earn Taming XP

- Taming an animal pays `tameSuccessXP` and counts toward `taming.tamed`.
- Breeding pays `tameXpBase` and counts toward `taming.bred`.
- A tamed pet damaging something pays damage times `tameDamageXPMultiplier` and adds the raw damage to `taming.pet.damage`.
- A mob killed by your pet pays `petKillXP` and counts toward `taming.pet.kills`. The credit only fires when no player is the mob's killer, and TragOul skeletal servants and Excavation grave mobs are excluded.

Breeding XP and pet damage XP share one `cooldownDelay` millisecond cooldown. Tame and pet-kill XP have no cooldown.

## Player preferences

Every adaptation has an enable switch in the bottom settings row of its level screen. Server policy controls which choices are available; settings change only your player profile. Defaults preserve the standard behavior.

| Adaptation | Personal controls |
| --- | --- |
| Alpha's Command | Restrict pet and target types; keep 0, 4, or 8 bones in the command hand after use. |
| Battle Bond | Toggle speed separately from the remaining buffs; toggle bond particles and glow. |
| Beast Recall | Restrict pet types; exclude sitting pets; keep 0, 4, or 8 hunger after the full recall cost. |
| Fetch | Fetch all permitted items, food, blocks, or ores/minerals; opt in wolves through red, blue, or yellow collars, or allow every collar color. |
| Guardian Instinct, Shared Pain | Restrict pet types; retain the server health minimum or require at least 50% or 75% of the pet's maximum health after protection. |
| Last Breath | Restrict eligible pet types. Rescue health, protection, teleport, and cooldown remain one action. |
| Mounted Tactics | Toggle mount handling and mounted combat bonuses independently. |
| Pack Leader Aura | Toggle speed and regeneration independently. |
| Wild Empathy | Toggle improved taming and neutral-mob pacification independently. |

Pet presets are all supported pets, wolves, cats, or equines (horses, donkeys, mules, skeleton horses, and zombie horses). They only narrow each adaptation's normal eligibility. Damage, Health Regeneration, Health Boost, and Stable Hand have the enable switch. Health Boost removes only the owner's adaptation bonus when disabled; permanent Stable Hand traits remain. Changing Fetch preferences cancels current fetches and safely returns carried items.

## Adaptations

### Tame Health (`tame-health`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-health-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-health-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 6 per level

While you are online, every animal you own gets the max-health scalar.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `healthBoostFactor` | `2.5` | Extra max-health multiplier added at full level percent. |
| `healthBoostBase` | `0.57` | Max-health multiplier applied at level percent 0. Total is applied as a scalar to the pet's max health. |
| `maxTameablesPerPass` | `128` | Loaded tameables examined per scheduler pass. |

### Tame Damage (`tame-damage`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-damage-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-damage-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 5 knowledge, then 6 per level

While you are online, every animal you own gets the attack-damage scalar.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `baseDamage` | `0.08` | Attack-damage multiplier applied at level percent 0. |
| `damageFactor` | `0.65` | Extra attack-damage multiplier added at full level percent. Total is applied as a scalar to the pet's attack damage. |
| `maxTameablesPerPass` | `128` | Loaded tameables examined per scheduler pass. |

### Tame Regeneration (`tame-health-regeneration`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-health-regeneration-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-health-regeneration-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

3 levels · 8 knowledge, then 7 per level

When one of your pets takes damage, it heals `regenBase` plus level percent squared times `regenFactor`, capped by missing health. Each pet has a fixed 8000 ms cooldown between heals.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `regenFactor` | `5` | Health points added to the heal at full level percent. |
| `regenBase` | `1` | Health points healed at level percent 0. |

### Pack Leader Aura (`tame-pack-leader-aura`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-pack-leader-aura-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-pack-leader-aura-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge

Pets inside the radius gain Speed and Regeneration for as long as they stay there.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `radiusBase` | `8` | Aura radius in blocks at level percent 0. |
| `radiusFactor` | `14` | Extra aura radius in blocks at full level percent. |
| `maxAmplifier` | `2` | Highest potion amplifier the aura can reach. The applied amplifier is level percent times this, rounded down. |
| `effectTicks` | `80` | Duration in ticks of each speed and regeneration reapplication. |
| `maxOwnersPerPass` | `16` | Owners refreshed per scheduler tick, hard-capped at 16. |
| `maxTameablesPerPass` | `48` | Indexed tameables examined per scheduler tick, hard-capped at 48. |

### Beast Recall (`tame-beast-recall`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-beast-recall-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-beast-recall-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

Sneak-right-click with a lead in the main hand to teleport the nearest owned pet to a safe spot beside you. The landing needs open feet and head space over solid ground, leads show an item cooldown, and pets inside the minimum distance are ignored.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-shared-pain-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-shared-pain-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

A share of damage aimed at you is split across nearby pets and removed from your hit, and no pet is taken below its health floor.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-mounted-tactics-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-mounted-tactics-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

While you ride a horse-type mount (horses, donkeys, mules, and llamas), a strider, or a pig, you deal more melee damage and take less; horses gain speed and jump, striders gain speed, stop shivering over lava, and grant you Fire Resistance, and pigs grant you Resistance. Bonuses apply when you mount and clear when you dismount, and sprinting on a horse or pig adds a forward shove.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-fetch-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-fetch-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge

Idle tamed wolves path to a drop, pick it up within 1.5 blocks, return to within 2 blocks of you, and drop the stack at the wolf; items are never teleported. Sitting, leashed, and riding wolves are skipped, anything a protection plugin would stop you picking up stays where it is, a server with no pathfinder API leaves drops in place, and a wolf more than 11 blocks from you abandons the fetch and drops what it carried.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-alphas-command-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-alphas-command-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

With a bone in the main hand, sneak-left-click or sneak-melee to mark a target; nearby wolves, cats, and llamas stand up and chase it until focus ends, the target dies, or the hit is no longer legal. One bone is consumed outside creative mode; pets gain attack damage `3.0 * (amplifier + 1)` and movement speed `0.2 * (amplifier + 1)`, rechecked against PvP and PvE, and your pets, NPCs, invulnerable entities, and TragOul servants are never valid targets.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-guardian-instinct-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-guardian-instinct-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

A nearby pet can intercept an incoming projectile, lunge toward you, take the shot at reduced damage, and cancel your hit.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-stable-hand-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-stable-hand-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 5 per level

Taming or breeding an animal permanently applies the bias as a scalar on movement speed, jump strength, and max health, plus `bias * 10` blocks of safe fall distance.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `biasBase` | `0.1` | Attribute bias at level percent 0, as a fraction. |
| `biasFactor` | `0.2` | Extra bias at full level percent. |
| `maxBias` | `0.3` | Ceiling on the bias, 0-1. |
| `xpPerAnimal` | `20` | Taming XP per animal that receives the bias. |

### Wild Empathy (`tame-wild-empathy`)

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-wild-empathy-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-wild-empathy-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge, then 4 per level

Right-click an untamed animal with its taming food to roll an instant tame that consumes one item: `BONE` for wolves, `COD` or `SALMON` for cats and ocelots, and `WHEAT_SEEDS`, `MELON_SEEDS`, `PUMPKIN_SEEDS`, `BEETROOT_SEEDS`, `TORCHFLOWER_SEEDS`, or `PITCHER_POD` for parrots. Untamed wolves, bees, polar bears, llamas, pandas, and goats can also be calmed with no gesture.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-battle-bond-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-battle-bond-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 3 knowledge

When one of your pets lands a kill, you and nearby owned pets gain Speed, Regeneration, and Strength where the server exposes Strength. The menu tier is the amplifier plus 1, so displayed tier 1 is amplifier 0.

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

<div class="adapt-demo">
<video src="/adapt-assets/demos/taming/tame-last-breath-pov.webm" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/adapt-assets/demos/taming/tame-last-breath-observer.webm" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

5 levels · 4 knowledge

A killing blow on a pet is refused: the pet is set to 1 HP, made immune for the invulnerability window, and teleported to a safe spot beside you.

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

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
