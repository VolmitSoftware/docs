---
title: "Skill - Golemancy"
description: "Golemancy XP sources, adaptations, and configuration"
published: true
date: 2026-10-18T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---
Golemancy gains XP from building and binding golems, fighting beside your bound golems, watching other golems kill hostile mobs, repairing iron golems, and tending copper golems.

## Earning XP

- Building a snow, copper, or iron golem pays `buildSnowXp`, `buildCopperXp`, or `buildIronXp` to the player who placed its carved pumpkin or jack o'lantern, and counts toward `golemancy.built`. The golem must appear within `buildAttributionWindowMillis` milliseconds and `buildAttributionRadius` blocks of that placement. Each golem type has its own `buildXpCooldownMillis` cooldown per player; builds during the cooldown still count toward the stat. Heads placed by dispensers pay nothing.
- Binding a golem with Animus Binding pays `bindFrostXp`, `bindCopperXp`, or `bindIronXp` and counts toward `golemancy.bound`. Each golem pays and counts only on its first binding; a golem that was released and bound again pays nothing and does not count. The first time you bind each body (frost, copper, and iron), you also earn that body's first-bind challenge and `firstBindXp`.
- When your bound golem damages a hostile mob, you earn the damage dealt times `assistDamageXpMultiplier` times the body multiplier: `assistBodyMultiplierFrost`, `assistBodyMultiplierCopper`, `assistBodyMultiplierIron`, or `assistBodyMultiplierBone`. Frost golem snowballs count. Damage beyond the victim's remaining health does not count. You earn damage XP at most once per `assistCooldownMillis`, but every hit counts toward `golemancy.golem.damage`.
- When your bound golem or its snowball kills a hostile mob, you earn the kill value, `golemKillXpBase` plus the victim's maximum health times `golemKillMaxHealthMultiplier`, and the kill counts toward `golemancy.golem.kills`. Raiders that belong to an active raid pay `raidXpMultiplier` times as much. A kill whose final blow comes from a bound golem or its snowball is a golem kill: it pays only Golemancy, and other skills and adaptations grant no kill XP or kill rewards for it, even when you hit the mob shortly before.
- When your bound golem takes damage from a hostile mob, you earn the damage taken times `tankXpMultiplier`, at most once per `tankCooldownMillis`. Damage beyond the golem's remaining health does not count.
- Damage, kill, and tanking XP pay in full while you are within `ownerProximityRadius` blocks of the golem. Farther away or in another world, they pay `distantOwnerXpMultiplier` times as much, and nothing while you are offline. Mobs from spawners and trial spawners pay `spawnerMobXpMultiplier` times the normal amount, and Adapt minions and Excavation grave mobs pay nothing.
- When an iron golem or snow golem that is not bound kills a hostile mob, every player within `witnessRadius` blocks of the golem who can use Golemancy earns `witnessXpMultiplier` times the kill value. One golem pays each player at most once per `witnessCooldownMillis`, and each player earns at most `witnessHourlyCap` witness XP in any 60 minutes. Mobs from spawners and trial spawners pay `spawnerMobXpMultiplier` times the normal amount. Adapt minions, such as TragOul skeletal servants and Stealth shadow decoys, and Excavation grave mobs pay nothing.
- Repairing a player-built iron golem with an iron ingot pays `repairXpPerHealth` per point of health restored. Only health that hostile mobs took away counts; damage from players is never paid back as XP.
- Scraping an oxidation stage off a copper golem with an axe pays `copperScrapeXp`. Waxing a copper golem with honeycomb pays `copperWaxXp`, once per golem.

## Adaptations

Golemancy's adaptations unlock golem binding, frames that strengthen each golem body, nodes, and runes.

### Animus Binding (`golem-animus-binding`)

5 levels · 2 knowledge, then 4 per level

Binds a golem to you as a companion and unlocks the Artificer's Crook and Blank Animus Core recipes at level 1.

Hold an Animus Core in your main hand, sneak, and right-click a snow, copper, or iron golem. The golem freezes and shrinks toward its bound size while the ritual runs. Moving more than 4 blocks from the golem, switching your held item, or the golem being attacked, set on fire, caught in lava, or caught in an explosion breaks the ritual, and the golem returns to its normal size. Rain and melting do not break it. When the ritual finishes, the core and the tithe levels are used up and the golem becomes "*Owner*'s *Body* Golem". A Companion golem starts following you; a golem bound with a role core starts working. Creative players pay no levels.

A binding needs all of the following:

- The golem is not bound already.
- A player built the golem. Iron golems that no player built, such as village iron golems, bind only when `allowBindingVillageGolems` is on.
- For `builderExclusiveSeconds` after a golem is built, only the player who built it can bind it.
- Frost golems bind with this adaptation alone. Copper golems also need Copper Frame and iron golems Iron Frame.
- The core is allowed for that body by `allowedCoresFrost`, `allowedCoresCopper`, or `allowedCoresIron` in the skill configuration. A Blank Animus Core binds a Companion; a role core also needs that role's Core adaptation.
- You own fewer golems than your level allows. `hardCapPerPlayer` caps every level.
- The chunk holds fewer than `maxBoundGolemsPerChunk` bound golems.
- Region protection lets you interact with the golem.
- You have the tithe levels for that body.

| Level | Golem cap | Ritual | Bind tithe (frost / copper / iron) |
|---|---|---|---|
| 1 | 1 | 4.0 s | 1 / 2 / 3 levels |
| 2 | 2 | 3.5 s | 1 / 2 / 3 levels |
| 3 | 3 | 3.0 s | 1 / 1 / 2 levels |
| 4 | 5 | 2.5 s | 1 / 1 / 2 levels |
| 5 | 7 | 2.0 s | 0 / 1 / 1 levels |

A Companion golem, bound with a Blank Animus Core, follows you by default. Its Golem GUI cycles Follow, Stay, and Home. Bound frost golems leave no snow trail, with or without Frost Frame; turn on Snow Trail in a frost golem's Golem GUI to let it leave snow again. A Companion golem attacks mobs within 12 blocks that target you or it: snow golems throw snowballs and iron golems fight in melee. Copper golems never fight.

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Artificer's Crook | ` A ` / `RHR` / ` C ` | H `IRON_HOE`, A `AMETHYST_SHARD`, R `REDSTONE`, C `COPPER_INGOT` | 1 | 0 |
| Blank Animus Core | `ARA` / `RPR` / `ARA` | A `AMETHYST_SHARD`, R `REDSTONE`, P `ENDER_PEARL` | 1 | 1 level |

Each recipe is a table with `rows` (1 to 3 rows of up to 3 symbols, a space for an empty slot), `keys` (a material name, an item tag such as `#planks`, or a Golemancy item such as `golemancy:blank_core`), `result`, `amount` (1 to 64), `tithe` (experience levels charged per craft), and `enabled`. Players without the tithe levels see no result, shift-crafting stops at the crafts their levels cover, creative players craft free, and crafter blocks never craft a recipe with a tithe. Recipe changes apply after a restart.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `golemCapByLevel` | `[1, 2, 3, 5, 7]` | Most golems you can own at once, from level 1 upward. `hardCapPerPlayer` still caps every level. |
| `ritualSecondsByLevel` | `[4.0, 3.5, 3.0, 2.5, 2.0]` | Seconds the binding ritual takes, from level 1 upward. Each value is clamped to 0.5-30. |
| `titheSnowByLevel` | `[1, 1, 1, 1, 0]` | Experience levels to bind a frost golem, from level 1 upward. |
| `titheCopperByLevel` | `[2, 2, 1, 1, 1]` | Experience levels to bind a copper golem, from level 1 upward. |
| `titheIronByLevel` | `[3, 3, 2, 2, 1]` | Experience levels to bind an iron golem, from level 1 upward. |
| `builderExclusiveSeconds` | `300` | Seconds after a golem is built during which only its builder can bind it. 0 lets anyone bind it at once. |
| `allowBindingVillageGolems` | `false` | Lets players bind iron golems that no player built. |
| `crookRecipe` | ` A ` / `RHR` / ` C `, tithe 0 | Artificer's Crook recipe. |
| `blankCoreRecipe` | `ARA` / `RPR` / `ARA`, tithe 1 | Blank Animus Core recipe. |

### Node Weaving (`golem-node-weaving`)

5 levels · 2 knowledge, then 4 per level · requires Animus Binding level 1

Anchors nodes to block faces so your golems know where to work, and unlocks the Blank Node and Deposit Node recipes at level 1. Each Core adaptation unlocks the recipes for its own nodes.

Hold a node in your main hand, sneak, and right-click a block face. The node attaches to that face and one node item is used up. Each face holds one node. Deposit, Input, and Filter nodes go only on a chest, trapped chest, copper chest, barrel, or shulker box. A placement needs all of the following:

- Region protection lets you interact with the block and build in front of the face. A Deposit, Input, or Filter node also needs access to the container.
- The chunk holds fewer than `maxNodesPerChunk` nodes, counting every player's nodes.
- You own fewer nodes than your level allows.

A new node starts with no channel, priority 3, a whitelist filter with no entries, and a work area radius of 2 blocks, or your level's largest radius when that is smaller. The work area is centered on the block in front of the face.

Nodes are hidden until you hold the Crook, a Node, a Core, or a Dormant Golem in either hand. You then see your own nodes within `revealRange` blocks. With `nodeVisibility` set to `ANY_GOLEMANCER`, players who have learned Node Weaving see every player's nodes. A node shows its icon flat on the face, glowing in its channel color, and a label with its type, channel, priority, filter count, and status. Labels draw within `labelRange` blocks.

Every `nodeScanIntervalTicks`, and whenever its chunk loads, a node checks its block. If the block is gone, or a Deposit, Input, or Filter node's container is replaced by a block that is not a container, the node drops as an item.

| Level | Node cap | Max area radius | Filter slots | Unlocks |
|---|---|---|---|---|
| 1 | 4 | 2 | 3 | Node placement, whitelist filters |
| 2 | 8 | 3 | 6 | |
| 3 | 12 | 4 | 6 | Node priority 1-5 |
| 4 | 18 | 6 | 9 | Redstone gating |
| 5 | 24 | 8 | 18 | Blacklist filters and `#tag` filter entries |

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Blank Node | `CRC` / `RAR` / `CRC` | C `CLAY_BALL`, R `REDSTONE`, A `AMETHYST_SHARD` | 4 | 0 |
| Deposit Node | ` X ` / ` B ` / `   ` | X `CHEST`, B `golemancy:blank_node` | 1 | 0 |

The recipe tables use the same fields as the Animus Binding recipes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `nodeCapByLevel` | `[4, 8, 12, 18, 24]` | Most nodes you can own at once, from level 1 upward. |
| `maxAreaRadiusByLevel` | `[2, 3, 4, 6, 8]` | Largest work area radius in blocks a node can be set to, from level 1 upward. Each value is capped at 32. |
| `filterSlotsByLevel` | `[3, 6, 6, 9, 18]` | Filter entries a node can hold, from level 1 upward. Each value is capped at 18. |
| `blankNodeRecipe` | `CRC` / `RAR` / `CRC`, yields 4 | Blank Node recipe. |
| `depositNodeRecipe` | ` X ` / ` B ` / `   ` | Deposit Node recipe. |

### Frost Frame (`golem-frost-frame`)

5 levels · 2 knowledge, then 4 per level · requires Animus Binding level 1

Strengthens your bound frost golems with extra health, damaging snowballs, and protection from rain and heat. Frost golems bind with Animus Binding alone; Frost Frame only makes them stronger.

Every bound frost golem you own gains the extra maximum health for your current level. When a golem reaches a new highest maximum health, it heals by the amount gained; losing levels and learning them again does not heal it a second time. The bonus follows your level: when you learn or unlearn levels, your awake golems update shortly and sleeping golems update when they wake. Releasing a golem removes the bonus.

When a snowball from one of your bound frost golems hits the golem's target or a hostile mob, it deals your level's snowball damage. Other mobs take vanilla snowball damage, and a snowball never deals less than vanilla, so blazes still take 3. Rain and water never hurt your bound frost golems, and damage from warm biomes is multiplied by your level's `warmBiomeDamageMultiplierByLevel` value.

- **Chill** (level 3): each snowball hit that damages its target gives it Slowness I for `chillTicks` ticks.
- **Extra snowball** (level 4): each snowball has an `extraSnowballChance` chance to be followed 5 ticks later by a second snowball at the same target. The second snowball's hit lands even though the first hit just hurt the target.
- **Frostbite** (level 5): when `frostbiteHits` snowball hits damage the same target within `frostbiteWindowMillis` milliseconds, the target stays fully frozen for `frostbiteFreezeTicks` ticks and then thaws at the normal rate. A target that is already frozen for longer stays frozen, and a target whose freezing another plugin holds in place is left as it is. Frostbite cannot freeze that target again for `frostbitePerTargetCooldownMillis` milliseconds, and hits during that time do not count.

| Level | Bonus health | Snowball damage | Warm biome damage | Unlocks |
|---|---|---|---|---|
| 1 | +4 | 1 | 100% | Immune to rain and water |
| 2 | +8 | 2 | 50% | |
| 3 | +12 | 2 | None | Chill: Slowness I for 2 s on hit |
| 4 | +16 | 3 | None | Extra snowball: 25% chance per throw |
| 5 | +20 | 4 | None | Frostbite: 4 hits in 5 s freeze the target for 5 s, at most once per 10 s per target |

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `healthBonusByLevel` | `[4, 8, 12, 16, 20]` | Extra maximum health for your bound frost golems, from level 1 upward. A golem heals by any gain above the highest maximum health it has had. |
| `snowballDamageByLevel` | `[1, 2, 2, 3, 4]` | Damage a bound frost golem's snowball deals to the golem's target or a hostile mob, from level 1 upward. Snowballs never deal less than vanilla. |
| `warmBiomeDamageMultiplierByLevel` | `[1.0, 0.5, 0.0, 0.0, 0.0]` | Multiplier on the damage bound frost golems take in warm biomes, from level 1 upward. 0 makes them immune. |
| `chillLevel` | `3` | Level at which snowball hits apply Chill. |
| `chillTicks` | `40` | Ticks of Slowness I a Chill hit applies. |
| `fireRateBonusLevel` | `4` | Level at which bound frost golems can throw an extra snowball. |
| `extraSnowballChance` | `0.25` | Chance, from 0 to 1, that each snowball is followed 5 ticks later by a second one at the same target. |
| `frostbiteLevel` | `5` | Level at which snowball hits can freeze the target with Frostbite. |
| `frostbiteHits` | `4` | Snowball hits that must land on one target within `frostbiteWindowMillis` to freeze it. |
| `frostbiteWindowMillis` | `5000` | Milliseconds within which the `frostbiteHits` hits must land. |
| `frostbiteFreezeTicks` | `100` | Ticks a Frostbite target stays fully frozen before it starts to thaw. |
| `frostbitePerTargetCooldownMillis` | `10000` | Milliseconds before Frostbite can freeze the same target again. |

### Copper Frame (`golem-copper-frame`)

5 levels · 2 knowledge, then 4 per level · requires Animus Binding level 1

Lets you bind copper golems and strengthens them with extra health, carry capacity, and speed, plus armor from their patina. Copper golems bind only after you learn Copper Frame.

Every bound copper golem you own gains the extra maximum health and movement speed for your current level, and carries up to your level's `carryByLevel` items at once, never fewer than the skill's `bodyCarryCopper`. When a golem reaches a new highest maximum health, it heals by the amount gained. The bonuses follow your level: when you learn or unlearn levels, your awake golems update shortly and sleeping golems update when they wake. Releasing a golem removes them.

Bound copper golems never turn into statues as they oxidize. Each oxidation stage counts as patina, from 0 when unaffected through exposed and weathered to 3 when oxidized. Every stage gives the golem `patinaArmorPerStage` armor and slows it by `patinaSpeedPenaltyPerStage`. When the golem's stage changes, for example when you scrape it with an axe, its armor and speed follow at once.

- **Patina armor doubled** (level 3): each stage gives twice `patinaArmorPerStage` armor.
- **Static Overdrive** (level 4): when lightning strikes within `overdriveRadius` blocks of one of your awake bound copper golems, the golem gets Speed II for `overdriveSeconds` seconds and its work interval is multiplied by `overdriveWorkIntervalMultiplier` for that time, which halves it by default. A golem can be overdriven again `overdriveCooldownSeconds` seconds after its last Static Overdrive started.
- **No patina slowdown** (level 5): patina no longer slows your copper golems; its armor stays.

| Level | Bonus health | Carry | Speed | Unlocks |
|---|---|---|---|---|
| 1 | +4 | 16 | +0% | Never turns into a statue. Patina: +2 armor and -5% speed per oxidation stage |
| 2 | +8 | 32 | +5% | |
| 3 | +12 | 48 | +10% | Patina armor doubled |
| 4 | +16 | 64 | +15% | Static Overdrive: lightning within 16 blocks gives 60 s of Speed II and halves the work interval, at most once per 300 s per golem |
| 5 | +20 | 128 | +20% | Patina no longer slows the golem |

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `healthBonusByLevel` | `[4, 8, 12, 16, 20]` | Extra maximum health for your bound copper golems, from level 1 upward. A golem heals by any gain above the highest maximum health it has had. |
| `carryByLevel` | `[16, 32, 48, 64, 128]` | Items your bound copper golems can carry at once, from level 1 upward. A value below `bodyCarryCopper` keeps that base. |
| `speedBonusByLevel` | `[0.0, 0.05, 0.1, 0.15, 0.2]` | Fraction added to your bound copper golems' movement speed, from level 1 upward. 0.05 is 5% faster. |
| `patinaArmorPerStage` | `2` | Armor a bound copper golem gains for each oxidation stage, from 0 when unaffected to 3 when oxidized. |
| `patinaSpeedPenaltyPerStage` | `0.05` | Fraction of movement speed a bound copper golem loses for each oxidation stage. 0 removes the slowdown. |
| `patinaArmorDoubleLevel` | `3` | Level at which patina armor is doubled. |
| `patinaPenaltyRemovedLevel` | `5` | Level at which patina no longer slows copper golems. |
| `overdriveLevel` | `4` | Level at which nearby lightning triggers Static Overdrive. |
| `overdriveRadius` | `16.0` | Blocks from a lightning strike within which your bound copper golems gain Static Overdrive, from 0 to 64. Larger values load as 64. |
| `overdriveSeconds` | `60` | Seconds of Speed II and faster work that Static Overdrive gives. |
| `overdriveCooldownSeconds` | `300` | Seconds after a Static Overdrive starts before the same golem can be overdriven again. |
| `overdriveWorkIntervalMultiplier` | `0.5` | Multiplier on a bound copper golem's work interval while Static Overdrive lasts. 0.5 makes it work twice as fast; 1 leaves it unchanged. |

## Reference

### Skill configuration defaults

Written to `plugins/Adapt/skills/golemancy.toml` on first load.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `enabled` | `true` | Turns the whole Golemancy skill on or off. |
| `skillColor` | `"&3"` | Legacy ampersand color code used for Golemancy in menus and text. |
| `buildSnowXp` | `40` | Skill XP paid for building a snow golem. |
| `buildCopperXp` | `90` | Skill XP paid for building a copper golem. |
| `buildIronXp` | `180` | Skill XP paid for building an iron golem. |
| `buildXpCooldownMillis` | `20000` | Milliseconds before one player earns build XP again for the same golem type. |
| `buildAttributionWindowMillis` | `250` | Milliseconds allowed between placing the head block and the golem appearing. |
| `buildAttributionRadius` | `3.0` | Blocks allowed between the placed head block and the golem. |
| `witnessRadius` | `16.0` | Blocks from a killing golem within which players earn witness XP. |
| `witnessXpMultiplier` | `0.35` | Fraction of the kill value paid to each witness. |
| `witnessCooldownMillis` | `6000` | Milliseconds before one golem pays the same player witness XP again. |
| `witnessHourlyCap` | `600` | Most witness XP one player can earn in any 60 minutes. |
| `golemKillXpBase` | `15` | Base kill value before the victim's health is added. |
| `golemKillMaxHealthMultiplier` | `1.0` | Kill value added per point of the victim's maximum health. |
| `repairXpPerHealth` | `2.0` | Skill XP per point of hostile damage repaired on an iron golem. |
| `copperScrapeXp` | `60` | Skill XP per oxidation stage scraped off a copper golem. |
| `copperWaxXp` | `30` | Skill XP for the first wax on each copper golem. |
| `spawnerMobXpMultiplier` | `0.3` | Multiplier for Golemancy XP from mobs that came from a spawner or trial spawner. |
| `challengeBuiltReward` | `500` | Skill XP paid by the golem building challenges. |
| `bindFrostXp` | `100` | Skill XP for the first binding of a frost golem. |
| `bindCopperXp` | `220` | Skill XP for the first binding of a copper golem. |
| `bindIronXp` | `450` | Skill XP for the first binding of an iron golem. |
| `firstBindXp` | `600` | Skill XP paid with each first-bind challenge. |
| `assistDamageXpMultiplier` | `3.0` | Skill XP per point of damage your bound golems deal to hostile mobs, before the body multiplier. |
| `assistBodyMultiplierFrost` | `2.0` | Body multiplier for damage XP from bound frost golems, including their snowballs. |
| `assistBodyMultiplierCopper` | `1.0` | Body multiplier for damage XP from bound copper golems. |
| `assistBodyMultiplierIron` | `1.0` | Body multiplier for damage XP from bound iron golems. |
| `assistBodyMultiplierBone` | `0.35` | Body multiplier for damage XP from bound bone golems. |
| `assistCooldownMillis` | `1500` | Milliseconds before one player earns damage XP from their bound golems again. |
| `raidXpMultiplier` | `1.5` | Kill XP multiplier for raiders that belong to an active raid. |
| `ownerProximityRadius` | `48.0` | Blocks from a bound golem within which its owner earns full damage, kill, and tanking XP. |
| `distantOwnerXpMultiplier` | `0.25` | Multiplier on damage, kill, and tanking XP for owners farther than `ownerProximityRadius` or in another world, clamped to 0-1. |
| `tankXpMultiplier` | `1.5` | Skill XP per point of damage your bound golems take from hostile mobs. |
| `tankCooldownMillis` | `2000` | Milliseconds before one player earns tanking XP from their bound golems again. |
| `challengeBoundReward` | `500` | Skill XP paid by the golem binding challenges. |
| `challengeGolemKillsReward` | `500` | Skill XP paid by the bound golem kill challenges. |
| `dormantInvulnerable` | `true` | Makes bound golems invulnerable while they are dormant. |
| `guardWhileOwnerOffline` | `false` | Keeps Guardian golems awake while their owner is offline. |
| `serverMaxActiveGolems` | `1500` | Most bound golems awake on the server at once; the rest stay dormant until room frees. |
| `maxBoundGolemsPerChunk` | `8` | Most bound golems allowed in one chunk when binding. |
| `hardCapPerPlayer` | `32` | Most golems one player can own at once, counting bound, packed, and shattered golems. Missing golems count until they are released. |
| `bodyScaleFrost` | `0.50` | Size of a bound frost golem as a multiple of its normal size. |
| `bodyScaleCopper` | `1.00` | Size of a bound copper golem as a multiple of its normal size. |
| `bodyScaleIron` | `0.36` | Size of a bound iron golem as a multiple of its normal size. |
| `bodyScaleBone` | `1.00` | Size of a bound bone golem as a multiple of its normal size. |
| `bodyCarryFrost` | `8` | Items a bound frost golem can carry at once. |
| `bodyCarryCopper` | `16` | Items a bound copper golem can carry at once before Copper Frame raises it. |
| `bodyCarryIron` | `64` | Items a bound iron golem can carry at once. |
| `allowedCoresFrost` | `["BLANK", "GUARDIAN", "GATHERER", "HARVESTER"]` | Cores a frost golem can be bound with. |
| `allowedCoresCopper` | `["BLANK", "GATHERER", "HARVESTER", "LUMBER", "RANCHER", "SORTER", "ANGLER"]` | Cores a copper golem can be bound with. |
| `allowedCoresIron` | `["BLANK", "GUARDIAN", "GATHERER", "LUMBER", "BREAKER", "RANCHER", "ANGLER"]` | Cores an iron golem can be bound with. |
| `deathDropCoreChance` | `0.5` | Chance that each core drops when a bound golem dies. |
| `deathDropRuneChance` | `0.5` | Chance that each rune drops when a bound golem dies. |
| `brainIntervalTicks` | `5` | Ticks between bound golem decisions, clamped to 2-20. Lower values react faster but cost more server time. |
| `followTeleportDistance` | `32` | Blocks from its owner, in the same world, at which a following golem teleports to them instead of walking. The minimum is 8. |
| `leashRadius` | `32` | Blocks a fighting golem may stray from its owner, home, or stay spot before it drops the fight and walks back. It is also the farthest a linked home chest may be from the golem's home. The minimum is 8. |
| `idleReturnSeconds` | `8` | Seconds a working golem stands idle away from home before it walks back. |
| `copperRepathTicks` | `10` | Ticks between path refreshes for a moving copper golem, clamped to 1-20. |
| `revealRange` | `32.0` | Blocks around you within which your golems show their status labels and your nodes appear while you hold the Crook, a Node, a Core or a Dormant Golem. |
| `labelRange` | `8.0` | Blocks within which revealed golem and node labels are drawn on screen. |
| `revealPollTicks` | `10` | Ticks between checks that reveal or hide golems and nodes as you move while holding the Crook, a Node, a Core or a Dormant Golem. Holding none of them costs nothing. |
| `maxNodesPerChunk` | `16` | Most nodes allowed in one chunk, counting every player's nodes. |
| `nodeScanIntervalTicks` | `40` | Ticks between checks of each node, clamped to 5-1200. Each check confirms the node's block is still there. |
| `blocksPerNodeScan` | `64` | Most blocks of a node's work area looked at in one check, clamped to 1-4096. |
| `maxOpenTasksPerNode` | `16` | Most unfinished jobs one node can hand out to golems at once, clamped to 1-256. |
| `nodeVisibility` | `"OWNER"` | Who sees nodes while holding the Crook, a Node, a Core or a Dormant Golem. `OWNER` shows each player only their own nodes; `ANY_GOLEMANCER` also shows every node to players who have learned Node Weaving. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_golemancy_built_10` | 10 | `challengeBuiltReward` |
| `challenge_golemancy_built_100` | 100 | `challengeBuiltReward` x 5 |
| `challenge_golemancy_bound_5` | 5 | `challengeBoundReward` |
| `challenge_golemancy_bound_25` | 25 | `challengeBoundReward` x 5 |
| `challenge_golemancy_golem_kills_50` | 50 | `challengeGolemKillsReward` |
| `challenge_golemancy_golem_kills_500` | 500 | `challengeGolemKillsReward` x 2 |
| `challenge_golemancy_golem_kills_5000` | 5000 | `challengeGolemKillsReward` x 5 |
| `challenge_golemancy_first_bind_frost` | First frost golem bound | `firstBindXp` |
| `challenge_golemancy_first_bind_copper` | First copper golem bound | `firstBindXp` |
| `challenge_golemancy_first_bind_iron` | First iron golem bound | `firstBindXp` |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
