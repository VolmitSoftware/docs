---
title: "Upgrades - TragOul"
description: "TragOul upgraded adaptations for mutated skills"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
These upgrades are available only after you merge TragOul into a mutated skill ([Mutations](/adapt/35-mutations)), and they replace the original [TragOul](/adapt/32-skill-tragoul) adaptations.

## Upgrades

### Crimson Tide (`upgraded-tragoul-crimson-tide`)

3 levels · 13, 13 and 16 knowledge · Fuses Soul Siphon, Will of Pain and Thorns

Damage you are credited for heals you for 25, 35 or 45 percent of it at levels 1, 2 and 3. This counts the same sources as Soul Siphon, including melee, arrows, TNT you lit and lingering clouds you threw. Siphon healing is capped at 5, 7 or 9 health per second and by your missing health.

A living attacker that damages you loses 1, 1.5 or 2 health, and you heal for what it actually lost. The attacker, or the shooter of a projectile, also takes 3, 4.5 or 6 thorns damage, at most once per second.

**Blood reservoir.** Siphon healing that would go past your full health is stored as blood instead, up to 4, 7 or 10 hearts at levels 1, 2 and 3. Only damage to natural mobs and players fills it; mobs from spawners, eggs or breeding, minions and your own pets give none. It counts against the siphon cap. Plague Nova's lance cost and servants raised by hand with Deathless spend blood before your health. Ten seconds after your last hit dealt or taken, blood drains by 1 heart every 10 seconds.

Personal controls: Ignore passive mobs (on/off), which keeps thorns off passive and neutral mobs.

| Key | Code default | What it does |
|-----|--------------|--------------|
| `healPercentBase` | `0.15` | Share of credited damage returned as healing before level scaling. |
| `healPercentPerLevel` | `0.10` | Healing share added per level. |
| `healCapPerSecondBase` | `3.0` | Most health siphoned per second before level scaling. |
| `healCapPerSecondPerLevel` | `2.0` | Siphon cap per second added per level. |
| `drainDamageBase` | `0.5` | Health drained from each attacker before level scaling. |
| `drainDamagePerLevel` | `0.5` | Drained health added per level. |
| `reflectDamageBase` | `1.5` | Thorns damage before level scaling. |
| `reflectDamagePerLevel` | `1.5` | Thorns damage added per level. |
| `reflectCooldownMillis` | `1000` | Time between two thorns reflections, in milliseconds. |
| `ignorePassiveMobs` | `false` | Keeps thorns off passive and neutral mobs for every player. |
| `reservoirHeartsBase` | `1` | Blood reservoir size in hearts before level scaling. |
| `reservoirHeartsPerLevel` | `3` | Blood reservoir hearts added per level. |
| `combatWindowMillis` | `10000` | Time after your last hit dealt or taken before blood starts to drain, in milliseconds. |
| `bloodDrainIntervalMillis` | `10000` | Time between two drains of blood out of combat, in milliseconds. |
| `bloodDrainPerInterval` | `2` | Blood lost at each drain out of combat, in health points. |

### Plague Nova (`upgraded-tragoul-plague-nova`)

3 levels · 13, 13 and 16 knowledge · Fuses Corpse Explosion, Plague Bearer and Corpse Lances

Every mob you kill bursts in a blood nova that hits up to 12 hostile mobs within 5.5, 7 or 8.5 blocks at levels 1, 2 and 3. Each takes 3 damage plus 25, 35 or 45 percent of the dead mob's maximum health, at most 24. A mob struck by a nova cannot burst again for 5 seconds.

When a mob you hit within the last 15 seconds dies with Poison or Wither on it, the effect spreads to up to 6 mobs within 11, 14 or 17 blocks, one amplifier stronger, for 7, 9 or 11 seconds. Wither is used if both are present. A spread can pass on through 3 generations.

Each kill also launches a lance from the corpse at the nearest valid target within 9, 13 or 17 blocks. It lands half a second later for the killing blow's damage, tripled while you wear no armor, and chains on through 1, 2 or 3 targets with each hop at half the previous damage. Every lance that lands costs you 1 health, paid from Crimson Tide's blood first. A new chain can start at most every 5 seconds.

Personal controls: Ignore passive mobs (on/off); Eligible target types (All permitted targets/Undead only/Arthropods only/Non-player targets).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `ignorePassiveMobs` | `false` | Keeps the nova, the plague and the lances off passive and neutral mobs for every player. |
| `novaRadiusBase` | `4.0` | Nova radius before level scaling, in blocks. |
| `novaRadiusPerLevel` | `1.5` | Nova radius added per level, in blocks; never above 16. |
| `novaBaseDamage` | `3.0` | Flat nova damage to every mob hit. |
| `victimHealthFractionBase` | `0.15` | Share of the dead mob's maximum health added to nova damage, before level scaling. |
| `victimHealthFractionPerLevel` | `0.10` | Maximum health share added per level. |
| `novaMaxDamage` | `24.0` | Most nova damage dealt to one mob. |
| `novaMaxTargets` | `12` | Most mobs one nova hits; at most 16. |
| `novaChainSuppressionMillis` | `5000` | Time a nova-struck mob cannot burst again, in milliseconds. |
| `plagueRadiusBase` | `8.0` | Plague spread radius before level scaling, in blocks. |
| `plagueRadiusPerLevel` | `3.0` | Plague spread radius added per level, in blocks; never above 24. |
| `plagueDurationTicksBase` | `100` | Spread effect duration before level scaling, in ticks. |
| `plagueDurationTicksPerLevel` | `40` | Spread effect duration added per level, in ticks. |
| `plagueMaxSpreadTargets` | `6` | Most mobs infected by one death; at most 8. |
| `plagueAmplifierBonus` | `1` | Amplifier levels added when the effect spreads. |
| `plagueMaxGenerations` | `3` | Most generations one effect can pass through; at most 4. |
| `plagueFreshnessMillis` | `15000` | How long a mob stays marked after your hit, in milliseconds. |
| `lanceDamageMultiplier` | `1.0` | Lance damage as a multiple of the killing blow; at most 4. |
| `lanceUnarmoredDamageMultiplier` | `3.0` | Lance damage multiplier while you wear no armor; at most 10. |
| `lanceSeekerDelay` | `10` | Delay before a lance lands, in ticks; 1 to 40. |
| `lanceSelfDamage` | `1.0` | Damage you take when a lance lands. |
| `xpPerMobHit` | `6` | TragOul XP for each natural mob or player a nova hits. |

### Deathless (`upgraded-tragoul-deathless`)

3 levels · 13, 13 and 16 knowledge · Fuses Last Rites and Marrow Armor

Lich's Bargain. A hit of at least 2 damage after armor spends one bone from your inventory and absorbs 35, 45 or 55 percent of it at levels 1, 2 and 3. Bones absorb at most one hit every 2.5 seconds. With no bones, the hit lands in full.

- **Death save:** a hit that would kill you is cancelled. You stay at 1 health with Invisibility and Resistance IV for 3 seconds, mobs within 12 blocks that were targeting you lose their target, and your skeletal servants rise around you for free up to your servant limit. Nothing kills you afterwards. The save recharges in 6, 5 or 4 minutes and shares its cooldown with Last Rites.
- **Raise by hand:** sneak-right-click with bones to raise one servant for 4 bones and 2 health, taken from Crimson Tide's blood first and never below 1 health. You can raise one every 1.5 seconds. This replaces Skeletal Servant's own summon while you hold Deathless.

You can have 1, 2 or 3 servants at once, counting both ways of raising them, and each lasts 30, 45 or 60 seconds. They are Skeletal Servant's servants at its level 3, 4 or 5: they follow your stance, drop no loot or XP, and count as Golemancy bone frames where you have that link.

Personal controls: Death-save priority (First/Normal/Last); Bones remaining after use (No extra reserve/Keep 4 bones/Keep 8 bones).

| Key | Code default | What it does |
|-----|--------------|--------------|
| `minDamageToAbsorb` | `2.0` | Smallest hit, after armor, that spends a bone. |
| `absorbPercentBase` | `0.25` | Share of a hit a bone absorbs before level scaling. |
| `absorbPercentPerLevel` | `0.10` | Absorbed share added per level. |
| `maxAbsorbPercent` | `0.65` | Highest absorbed share at any level. |
| `absorbCooldownMillis` | `2500` | Time between two absorbed hits, in milliseconds. |
| `servantsBase` | `0` | Most living servants before level scaling, raised by the save and by hand together. |
| `servantsPerLevel` | `1` | Servants added to the cap per level. |
| `servantTicksBase` | `300` | Servant lifetime before level scaling, in ticks. |
| `servantTicksPerLevel` | `300` | Servant lifetime added per level, in ticks. |
| `bonesPerServant` | `4` | Bones spent for each servant raised by hand. |
| `healthPerServant` | `2.0` | Health spent for each servant raised by hand, blood first. |
| `raiseCooldownMillis` | `1500` | Time between two servants raised by hand, in milliseconds. |
| `coverTicks` | `60` | Ticks you stay hidden and resistant after a defied killing blow. |
| `resistanceAmplifier` | `3` | Resistance amplifier while hidden. |
| `targetClearRadius` | `12` | Radius in blocks in which mobs targeting you lose their target. |
| `cooldownMillisBase` | `420000` | Death-save cooldown before level scaling, in milliseconds; shared with Last Rites. |
| `cooldownMillisPerLevel` | `60000` | Cooldown removed per level, in milliseconds. |
| `minimumCooldownMillis` | `30000` | Shortest death-save cooldown at any level, in milliseconds. |

## See also

Mutations: [Mutations](/adapt/35-mutations). Skill: [TragOul](/adapt/32-skill-tragoul).
