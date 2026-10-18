---
title: "Skill - Golemancy"
description: "Golemancy XP sources, adaptations, and configuration"
published: true
date: 2026-10-18T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---
Golemancy gains XP from building and binding golems, fighting beside your bound golems, the jobs your working golems finish, watching other golems kill hostile mobs, repairing and healing golems, tending copper golems, and infusing at the Animus Plinth.

## Earning XP

- Building a snow, copper, or iron golem pays `buildSnowXp`, `buildCopperXp`, or `buildIronXp` to the player who placed its carved pumpkin or jack o'lantern, and counts toward `golemancy.built`. The golem must appear within `buildAttributionWindowMillis` milliseconds and `buildAttributionRadius` blocks of that placement. Each golem type has its own `buildXpCooldownMillis` cooldown per player; builds during the cooldown still count toward the stat. Heads placed by dispensers pay nothing.
- Binding a golem with Animus Binding pays `bindFrostXp`, `bindCopperXp`, or `bindIronXp` and counts toward `golemancy.bound`. Each golem pays and counts only on its first binding; a golem that was released and bound again pays nothing and does not count. The first time you bind each body (frost, copper, and iron), you also earn that body's first-bind challenge and `firstBindXp`.
- When your bound golem damages a hostile mob, you earn the damage dealt times `assistDamageXpMultiplier` times the body multiplier: `assistBodyMultiplierFrost`, `assistBodyMultiplierCopper`, `assistBodyMultiplierIron`, or `assistBodyMultiplierBone`. Frost golem snowballs count. Damage beyond the victim's remaining health does not count. You earn damage XP at most once per `assistCooldownMillis`, but every hit counts toward `golemancy.golem.damage`.
- When your bound golem or its snowball kills a hostile mob, you earn the kill value, `golemKillXpBase` plus the victim's maximum health times `golemKillMaxHealthMultiplier`, and the kill counts toward `golemancy.golem.kills`. Raiders that belong to an active raid pay `raidXpMultiplier` times as much. A kill whose final blow comes from a bound golem or its snowball is a golem kill: it pays only Golemancy, and other skills and adaptations grant no kill XP or kill rewards for it, even when you hit the mob shortly before.
- When your bound golem takes damage from a hostile mob, you earn the damage taken times `tankXpMultiplier`, at most once per `tankCooldownMillis`. Damage beyond the golem's remaining health does not count.
- Damage, kill, and tanking XP pay in full while you are within `ownerProximityRadius` blocks of the golem. Farther away or in another world, they pay `distantOwnerXpMultiplier` times as much, and nothing while you are offline. Mobs from spawners and trial spawners pay `spawnerMobXpMultiplier` times the normal amount, and Adapt minions and Excavation grave mobs pay nothing.
- When an iron golem or snow golem that is not bound kills a hostile mob, every player within `witnessRadius` blocks of the golem who can use Golemancy earns `witnessXpMultiplier` times the kill value. One golem pays each player at most once per `witnessCooldownMillis`, and each player earns at most `witnessHourlyCap` witness XP in any 60 minutes. Mobs from spawners and trial spawners pay `spawnerMobXpMultiplier` times the normal amount. Adapt minions, such as TragOul skeletal servants and Stealth shadow decoys, and Excavation grave mobs pay nothing.
- Repairing a player-built iron golem with an iron ingot, or healing one of your bound golems with a copper ingot or snow block through Golem Mending, pays `repairXpPerHealth` per point of health restored. Only health that hostile mobs took away counts; damage from players is never paid back as XP.
- Scraping an oxidation stage off a copper golem with an axe pays `copperScrapeXp`. Waxing a copper golem with honeycomb pays `copperWaxXp`, once per golem.
- Completing an infusion at the Animus Plinth pays `infuseRuneTier1Xp`, `infuseRuneTier2Xp`, or `infuseRuneTier3Xp` for a rune of that tier, or `infuseMasterworkHeartXp` for a Masterwork Heart, and counts toward `golemancy.infusions`.
- When one of your working golems finishes a job, you earn the work XP that its Core adaptation sets for that job. Work XP pays only while you are online and within `workXpOwnerRadius` blocks of the golem, and you earn at most `workXpHourlyCap` work XP in any 60 minutes. Golem labor never pays other skills. Each finished job counts toward `golemancy.tasks`, and each item your golems deliver into a container counts toward `golemancy.items.moved`.

## Adaptations

Golemancy's adaptations unlock golem binding, frames that strengthen each golem body, nodes, runes, and ways to heal and rebuild your golems.

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

A Companion golem, bound with a Blank Animus Core, follows you by default. Its Golem GUI cycles Follow, Stay, and Home. Bound frost golems leave no snow trail, with or without Frost Frame; turn on Snow Trail in a frost golem's Golem GUI to let it leave snow again. A Companion golem attacks mobs that target you or it within 12 blocks, plus its Tide rune's bonus, up to `leashRadius` blocks: snow golems throw snowballs and iron golems fight in melee. Copper golems never fight.

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

Hold a node in your main hand, sneak, and right-click a block face. The node attaches to that face and one node item is used up. Each face holds one node. Deposit, Input, and Filter nodes go only on a chest, trapped chest, copper chest, barrel, or shulker box, and Fishing Nodes go only on the side of a block. Nodes never attach to the lodestone or pedestals of a complete Animus Plinth; that click works the plinth instead. A placement needs all of the following:

- Region protection lets you interact with the block and build in front of the face. A Deposit, Input, or Filter node also needs access to the container.
- The chunk holds fewer than `maxNodesPerChunk` nodes, counting every player's nodes.
- You own fewer nodes than your level allows.

A new node starts with no channel, priority 3, a whitelist filter with no entries, and a work area radius of 2 blocks, or your level's largest radius when that is smaller. The work area is centered on the block in front of the face.

Nodes are hidden until you hold the Crook, a Node, a Core, or a Dormant Golem in either hand. You then see your own nodes within `revealRange` blocks. With `nodeVisibility` set to `ANY_GOLEMANCER`, players who have learned Node Weaving see every player's nodes. A node shows its icon flat on the face, glowing in its channel color, and a label with its type, channel, priority, filter count, and status. The status changes at each node check: Full while a Deposit Node's container has no empty slot, Blocked for 10 seconds after region protection stops one of your golems there, Working while a golem holds one of the node's jobs and for 10 seconds after a golem works or delivers there, and Idle otherwise. A node switched off by redstone shows Idle. Labels draw within `labelRange` blocks.

Click one of your revealed nodes to configure it. Only the node's owner can configure it, and its label updates after each change.

| Input | Result |
|---|---|
| Right-click with the Crook in your main hand | Opens the Node GUI |
| Left-click with the Crook in your main hand | Moves the channel to the next dye color, then to no channel, then back to white |
| Right-click with a dye, Crook in your off hand | Sets the channel to that dye's color |
| Right-click with any other item, Crook in your off hand | Adds that item to the filter while a slot is free, or removes it when the filter already holds the same item |
| Sneak + right-click with the Crook in your main hand | Raises the priority by 1, from 5 back to 1 (level 3) |
| Sneak + left-click with the Crook in your main hand | Removes the node and gives its item back |

While a node is revealed, looking at it from within 6 blocks outlines its work area in its channel color, or in white when it has no channel. Only the owner sees the outline.

The Node GUI shows the node type and its block, and holds these controls:

- **Channel**: left-click for the next color, right-click for the previous one.
- **Priority** (level 3): left-click raises it and right-click lowers it, from 1 to 5.
- **Redstone** (level 4): cycles Ignored, Works while powered, and Works while unpowered. A node set to work while powered does no work while its block receives no redstone power, and a node set to work while unpowered does no work while its block is powered.
- **X, Y, and Z radius**: left-click grows the work area by 1 block on that axis and right-click shrinks it, from 0 up to your level's largest radius.
- **Filter slots**: pick up an item in your inventory and click an empty slot to add it or a filled slot to replace that entry, or right-click a slot to clear it. Your level sets how many slots you have. A slot keeps one of the item as you set it, with its name, enchantments, and potion type but without the contents of shulker boxes, bundles, or other containers, so two different potions take two slots and the same item never takes two. Golems match filter entries by item type.
- **Whitelist or Blacklist** (level 5): a whitelist lets golems use only matching items, and a blacklist lets them use everything except matching items. An empty filter matches every item.
- **Add Tag** (level 5): closes the GUI and asks you to type an item tag, such as `#logs` or `#minecraft:saplings`, in chat. A tag without a namespace means `minecraft`. Typing a tag the filter already holds removes it, and typing `cancel` stops. Each tag uses one filter slot, and the prompt ends after 45 seconds.

Golems bound with a role core work their owner's nodes while in Work mode. A golem takes jobs only from nodes whose work lies within `baseWorkRadius` blocks of its home, plus its Tide rune's bonus, and only from the node types its core works. A node with no channel hands jobs to every one of your golems; a node with a channel hands them only to golems on that channel, and a golem with no channel works only nodes with no channel. A golem has one channel, or more with an Order rune. A golem takes the highest-priority job first, then the nearest one. It keeps its claim on a job for `taskLeaseSeconds` seconds, renewed while it gets closer or keeps working; if it gets less than half a block closer within `stuckTimeoutSeconds` seconds, it gives the job up and skips it for 10 seconds, or less with an Order rune, while other golems may take it. A golem that gives up `stuckReleasesBeforePause` jobs or containers in a row rests for `stuckPauseSeconds` seconds before it looks for work again. A node switched off by redstone hands out no jobs, and the jobs it already handed out are cancelled. A golem that stands idle away from home for `idleReturnSeconds` seconds, or strays beyond `leashRadius` blocks of home, walks back. Iron golems in Colossus Form take no jobs.

A Deposit Node accepts the items your working golems carry. A golem carrying items delivers them when it can carry no more, or when it has no job to do. It walks to the highest-priority Deposit Node, then the nearest, within `baseWorkRadius` blocks of its home, plus its Tide rune's bonus, whose channel it matches, whose filter accepts at least one of its items, and whose container has room. A Deposit Node switched off by redstone takes nothing. Items no Deposit Node takes go to the golem's linked home chest. With neither, the golem keeps its items; a golem carrying as many items as it can hold takes no new jobs and shows an angry particle above its head every 3 seconds until it can deliver. A container that cannot take the rest of a golem's items is skipped for 10 seconds. A double chest counts as one container, and region protection must let the golem's owner open the container. A copper golem opens the container's lid while it delivers.

Every `nodeScanIntervalTicks`, and whenever its chunk loads, a node checks its block. If the block is gone, or a Deposit, Input, or Filter node's container is replaced by a block that is not a container, the node drops as an item.

| Level | Node cap | Max area radius | Filter slots | Unlocks |
|---|---|---|---|---|
| 1 | 4 | 2 | 3 | Node placement and configuration, whitelist filters |
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

### Iron Frame (`golem-iron-frame`)

5 levels · 2 knowledge, then 4 per level · requires Animus Binding level 1

Lets you bind iron golems and strengthens them with extra health, armor, and attack, stronger ingot repairs, sweeping punches, and a full-size Colossus Form. Iron golems bind only after you learn Iron Frame.

Every bound iron golem you own gains the extra maximum health, armor, and attack damage for your current level. When a golem reaches a new highest maximum health, it heals by the amount gained. The bonuses follow your level: when you learn or unlearn levels, your awake golems update shortly and sleeping golems update when they wake. Releasing a golem removes them.

While you are online, anyone who repairs one of your bound iron golems with an iron ingot heals it by your level's `ingotHealBonusByLevel` on top of the vanilla 25 health. The extra health counts toward repair XP like the rest of the repair.

- **Sweeping Fists** (level `sweepLevel`): each punch from one of your awake bound iron golems also hits up to your level's `sweepTargetsByLevel` other hostile mobs within `sweepRadius` blocks of the punched mob, nearest first, for `sweepDamageFraction` of the punch's damage. The golem deals these hits, so its kills and damage count as its own. Sweeping Fists hits only hostile mobs, and never Adapt minions or mobs that region protection shields from you.
- **Colossus Form** (level `colossusLevel`): the Golem GUI of each of your bound iron golems shows a Colossus Form toggle. Turning it on grows the golem to `colossusScale` over `colossusGrowTicks` ticks and raises its total attack damage, frame bonus included, by `colossusAttackBonus`. The golem grows only when a golem of that size fits where it stands; otherwise it stays at its bound size and an action-bar warning tells you there is not enough room. A golem in Colossus Form takes no work. Turning the toggle off shrinks it back to its bound size over the same time, and while a golem is changing size the toggle only shows an action-bar warning to wait. The form lasts through chunk unloads and restarts. Your golems shrink back to their bound size on their own when you drop below `colossusLevel` or when Iron Frame is turned off, and releasing a golem ends Colossus Form.

| Level | Bonus health | Bonus armor | Bonus attack | Ingot repair bonus | Unlocks |
|---|---|---|---|---|---|
| 1 | +10 | +2 | +1.5 | +5 | |
| 2 | +20 | +4 | +3.0 | +10 | |
| 3 | +30 | +6 | +4.5 | +15 | Sweeping Fists: each punch also hits 1 nearby hostile mob for 50% damage |
| 4 | +40 | +8 | +6.0 | +20 | |
| 5 | +50 | +10 | +7.5 | +25 | Sweeping Fists hits 2 nearby hostile mobs. Colossus Form: grows to full iron golem size over 1 s with +20% attack, and takes no work while grown |

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `healthBonusByLevel` | `[10, 20, 30, 40, 50]` | Extra maximum health for your bound iron golems, from level 1 upward. A golem heals by any gain above the highest maximum health it has had. |
| `armorBonusByLevel` | `[2, 4, 6, 8, 10]` | Extra armor for your bound iron golems, from level 1 upward. |
| `attackBonusByLevel` | `[1.5, 3.0, 4.5, 6.0, 7.5]` | Extra attack damage for your bound iron golems, from level 1 upward. |
| `ingotHealBonusByLevel` | `[5, 10, 15, 20, 25]` | Extra health an iron ingot repair restores on your bound iron golems, on top of the vanilla 25, from level 1 upward. |
| `sweepLevel` | `3` | Level at which your bound iron golems' punches also hit nearby hostile mobs with Sweeping Fists. |
| `sweepTargetsByLevel` | `[0, 0, 1, 1, 2]` | Extra hostile mobs each punch also hits with Sweeping Fists, from level 1 upward. |
| `sweepDamageFraction` | `0.5` | Fraction of a punch's damage that Sweeping Fists deals to each extra mob. 0.5 is half. |
| `sweepRadius` | `2.0` | Blocks around the punched mob within which Sweeping Fists finds extra hostile mobs, from 0 to 8. Larger values load as 8. |
| `colossusLevel` | `5` | Level at which the Golem GUI offers Colossus Form for your bound iron golems. Golems in Colossus Form shrink back when you drop below it. |
| `colossusScale` | `1.0` | Scale a bound iron golem grows to in Colossus Form, from 0.36 to 1.5. Values outside that range load as the nearest limit. 1.0 is the vanilla iron golem size. |
| `colossusAttackBonus` | `0.2` | Fraction added to a bound iron golem's total attack damage, frame bonus included, while it is in Colossus Form. 0.2 is 20% more. |
| `colossusGrowTicks` | `20` | Ticks a bound iron golem takes to grow into Colossus Form or shrink back. |

### Guardian Core (`golem-guardian-core`)

5 levels · 2 knowledge, then 4 per level · requires Animus Binding level 1

Makes golems bound with a Guardian Core defend their home, you, or a Guard Node's area, and unlocks the Guardian Core and Guard Node recipes at level 1.

Bind a golem with a Guardian Core through Animus Binding. Snow and iron golems take the core by default; `allowedCoresFrost` and `allowedCoresIron` in the skill configuration decide which bodies can. A new Guardian starts in Work mode, and its Golem GUI cycles Work, Follow, Stay, and Home.

A Guardian guards the area within your level's `perceptionByLevel` blocks of its guard point, plus its Tide rune's bonus, up to `leashRadius` blocks: you while it follows you, the spot where it was told to stay while it stays, and its home in Home and Work mode. In Work mode it also guards the work area of each of your Guard Nodes that lies within `baseWorkRadius` blocks of its home, plus its Tide rune's bonus, has a channel the golem matches, and is not switched off by redstone. A Guard Node's area only counts within `leashRadius` blocks of the Guardian's home, so a Guardian never chases a mob past its leash. Inside its guarded area a Guardian attacks the nearest hostile mob, or the nearest mob that is targeting you or the Guardian, and lets go of a mob that leaves the area. Guardians never attack your pets or Adapt minions, and while you are online they never attack mobs that region protection shields from you. Creepers are left alone unless `targetCreepers` is on, and mobs with a custom name unless `ignoreNamedMobs` is off. Iron Guardians fight in melee. Frost Guardians are sentries: they throw snowballs only at mobs within `sentryRange` blocks of themselves and never chase mobs farther away.

Place a Guard Node with Node Weaving. Its channel, work area, and redstone setting work like any other node's. A Guard Node hands out no jobs; it shows Working while one of your Guardians fights a mob inside its area and for 10 seconds after.

- **Intercept** (level `interceptLevel`): every `interceptIntervalMillis` milliseconds, each Guardian turns the mobs inside its guarded area that are targeting you onto itself.
- **Retaliate** (level `retaliateLevel`): for `retaliateWindowMillis` milliseconds after something hurts you, your Guardians attack it while it is inside their guarded area, and drop the mob they were fighting to do so. This includes creepers, named mobs, and players where region protection allows PvP. An arrow or other projectile counts as its shooter.
- **Bulwark Presence** (level `bulwarkLevel`): while you are within `bulwarkRadius` blocks of one of your awake Guardians, you take `bulwarkDamageReduction` less damage. More Guardians nearby do not add to it. Damage from the void, the kill command, and the world border is not reduced.
- **Last Stand** (level `lastStandLevel`): when a hit leaves one of your Guardians alive below `lastStandHealthFraction` of its maximum health, it gains Resistance for `lastStandTicks` ticks at amplifier `lastStandAmplifier`. Each Guardian can trigger Last Stand once per `lastStandCooldownMillis` milliseconds.

With `guardWhileOwnerOffline` on in the skill configuration, your Guardians stay awake while you are offline. They then guard level 1's radius, attack only hostile mobs, and use none of Intercept, Retaliate, Bulwark Presence, or Last Stand. Region protection cannot be checked while you are offline, so offline Guardians also attack hostile mobs that it would shield from you. Guardians do no jobs, so they pay no work XP; their fights pay the damage, kill, and tanking XP in Earning XP.

| Level | Guard radius | Unlocks |
|---|---|---|
| 1 | 8 | Guards against hostile mobs |
| 2 | 12 | Intercept: every 3 s, mobs targeting you turn onto your Guardians |
| 3 | 16 | Retaliate: Guardians attack whatever hurt you in the last 5 s |
| 4 | 20 | Bulwark Presence: 15% less damage within 4 blocks of an awake Guardian |
| 5 | 24 | Last Stand: Resistance II for 5 s below 20% health, at most once per 60 s per Guardian |

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Guardian Core | ` X ` / `YBY` / ` Z ` | X `IRON_SWORD`, Y `IRON_INGOT`, Z `SHIELD`, B `golemancy:blank_core` | 1 | 2 levels |
| Guard Node | ` X ` / ` B ` / `   ` | X `IRON_SWORD`, B `golemancy:blank_node` | 1 | 0 |

The recipe tables use the same fields as the Animus Binding recipes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `perceptionByLevel` | `[8, 12, 16, 20, 24]` | Blocks around a Guardian's guard point within which it attacks, from level 1 upward. Each value, plus the Guardian's Tide rune bonus, is clamped to 1 up to `leashRadius` in the skill configuration. |
| `targetCreepers` | `false` | Lets Guardians attack creepers. |
| `ignoreNamedMobs` | `true` | Keeps Guardians from attacking mobs that have a custom name, unless Retaliate sends them after one that hurt you. |
| `interceptLevel` | `2` | Level at which Guardians use Intercept. |
| `interceptIntervalMillis` | `3000` | Milliseconds between a Guardian's Intercept checks, at least 500. Lower values load as 500. |
| `retaliateLevel` | `3` | Level at which Guardians use Retaliate. |
| `retaliateWindowMillis` | `5000` | Milliseconds after something hurts you during which your Guardians retaliate against it. |
| `bulwarkLevel` | `4` | Level at which Bulwark Presence protects you. |
| `bulwarkRadius` | `4.0` | Blocks from one of your awake Guardians within which Bulwark Presence protects you, from 0 to 16. Values outside that range load as the nearest limit. |
| `bulwarkDamageReduction` | `0.15` | Fraction of damage Bulwark Presence removes, from 0 to 1. 0.15 is 15% less. |
| `lastStandLevel` | `5` | Level at which Guardians use Last Stand. |
| `lastStandHealthFraction` | `0.2` | Fraction of maximum health, from 0 to 1, that a Guardian must drop below for Last Stand to trigger. 0.2 is 20%. |
| `lastStandTicks` | `100` | Ticks of Resistance Last Stand gives. |
| `lastStandAmplifier` | `1` | Resistance amplifier Last Stand gives. 0 is Resistance I and 1 is Resistance II. |
| `lastStandCooldownMillis` | `60000` | Milliseconds after Last Stand triggers before it can trigger again on the same Guardian. |
| `sentryRange` | `10.0` | Blocks within which frost Guardians shoot, from 1 to 10, the snow golem's throwing range. Values outside that range load as the nearest limit. |
| `guardianCoreRecipe` | ` X ` / `YBY` / ` Z `, tithe 2 | Guardian Core recipe. |
| `guardNodeRecipe` | ` X ` / ` B ` / `   ` | Guard Node recipe. |

### Gatherer Core (`golem-gatherer-core`)

5 levels · 2 knowledge, then 4 per level · requires Node Weaving level 1

Makes golems bound with a Gatherer Core pick up dropped items and deliver them, and unlocks the Gatherer Core and Collection Node recipes at level 1.

Bind a golem with a Gatherer Core through Animus Binding. Snow, copper, and iron golems take the core by default; `allowedCoresFrost`, `allowedCoresCopper`, and `allowedCoresIron` in the skill configuration decide which bodies can. A new Gatherer starts in Work mode, and its Golem GUI cycles Work, Follow, Stay, and Home.

In Work mode a Gatherer picks up dropped items in the work area of each of your Collection Nodes that lies within its work radius (`baseWorkRadius` plus Tide), has a channel the golem matches, and is not switched off by redstone. A Collection Node's filter decides which items Gatherers take from its area, including the items Magnet pulls and the items Gatherers pick up at once. While every Collection Node on a matching channel within its work radius is switched off by redstone, a Gatherer gathers nothing. With no Collection Node on a matching channel within its work radius, the Gatherer picks up items within your level's `pickupRadiusByLevel` blocks of its home, plus its Tide rune's bonus, but never beyond its work radius (`baseWorkRadius` plus Tide). It walks to the nearest item, takes as much of the stack as it can carry, and delivers its load to a Deposit Node or its home chest as described under Node Weaving. Each stack it picks up earns `workXpPerStack` work XP. Place a Collection Node with Node Weaving; its channel, work area, filter, and redstone setting work like any other node's.

Gatherers leave these items alone:

- Items still under their pickup delay, and items that players or mobs cannot pick up, such as display items.
- Items another player threw, until `foreignItemSeconds` seconds after they dropped, and items another player owns.
- Items and experience orbs within `deathSiteRadius` blocks of the spot where any player died, for `deathSiteSeconds` seconds after the death. Gatherers remember up to 256 recent deaths in each world.
- Items where region protection stops you from interacting or breaking blocks, or where a protection plugin stops mobs from picking items up. Protection is checked for you wherever you are, so Gatherers keep working while you are in another world.

Higher levels add these perks:

- **Essence** (from level 2 with the default `essenceCapByLevel`): Gatherers also collect experience orbs in their gathering area and store the experience as essence, up to your level's cap. The Golem GUI of a Gatherer, or of any golem that still holds essence, shows an Essence button with the stored experience points; click it to take them all as experience. Releasing a golem gives you its essence as experience, or drops it as an experience orb when you are offline, and a bound golem that dies drops its essence as experience.
- **Magnet** (level `magnetLevel`): items within `magnetRadius` blocks of a Gatherer that it can pick up fly toward it while the Gatherer stands inside its gathering area, where region protection lets you interact, and has room to carry them.
- **Instant pickup** (level `instantPickupLevel`): a Gatherer picks up items and absorbs experience orbs within `instantPickupRadius` blocks without walking to them.
- **Carry bonus** (level `carryBonusLevel`): Gatherers carry `carryBonusFraction` more items. The bonus adds to other carry bonuses, such as a Might rune's.

| Level | Pickup radius | Unlocks |
|---|---|---|
| 1 | 4 | Picks up items around its home or in Collection Nodes and delivers them |
| 2 | 6 | Essence: stores up to 500 experience points from experience orbs |
| 3 | 8 | Essence storage grows to 1500 experience points |
| 4 | 10 | Magnet: pulls items within 3 blocks |
| 5 | 12 | Instant pickup within 1.5 blocks; carries 50% more items |

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Gatherer Core | ` X ` / `YBY` / ` Z ` | X `BUNDLE`, Y `STRING`, Z `HOPPER`, B `golemancy:blank_core` | 1 | 2 levels |
| Collection Node | ` X ` / ` B ` / `   ` | X `BUNDLE`, B `golemancy:blank_node` | 1 | 0 |

The recipe tables use the same fields as the Animus Binding recipes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `pickupRadiusByLevel` | `[4, 6, 8, 10, 12]` | Blocks around a Gatherer's home within which it picks up items when none of your Collection Nodes serve it, from level 1 upward. A Tide rune adds its bonus. |
| `essenceCapByLevel` | `[0, 500, 1500, 1500, 1500]` | Experience points a Gatherer can store as essence, from level 1 upward. 0 means it absorbs no experience orbs. |
| `magnetLevel` | `4` | Level at which Gatherers use Magnet. |
| `magnetRadius` | `3.0` | Blocks around a Gatherer within which Magnet pulls items toward it, from 0 to 16. Values outside that range load as the nearest limit. |
| `instantPickupLevel` | `5` | Level at which Gatherers pick up items next to them at once. |
| `instantPickupRadius` | `1.5` | Blocks around a Gatherer within which it picks up items and absorbs experience orbs at once, from 0 to 4. Values outside that range load as the nearest limit. |
| `carryBonusLevel` | `5` | Level at which Gatherers carry more items. |
| `carryBonusFraction` | `0.5` | Fraction added to a Gatherer's carry capacity from `carryBonusLevel`. 0.5 is 50% more. |
| `foreignItemSeconds` | `30` | Seconds after an item drops during which Gatherers leave it alone when another player threw it, from 0 to 600. Items another player owns are never picked up. |
| `deathSiteRadius` | `8.0` | Blocks around the spot where a player died within which Gatherers pick up nothing, from 0 to 64. |
| `deathSiteSeconds` | `300` | Seconds after a player dies during which Gatherers leave items and experience orbs near that spot alone, from 0 to 3600. 0 turns the protection off. |
| `workXpPerStack` | `0.5` | Golemancy work XP a Gatherer earns you for each item stack it picks up. |
| `gathererCoreRecipe` | ` X ` / `YBY` / ` Z `, tithe 2 | Gatherer Core recipe. |
| `collectionNodeRecipe` | ` X ` / ` B ` / `   ` | Collection Node recipe. |

### Harvester Core (`golem-harvester-core`)

5 levels · 2 knowledge, then 4 per level · requires Node Weaving level 1

Makes golems bound with a Harvester Core harvest and replant the crops in a Harvest Node's area, then tend and till the field at higher levels, and unlocks the Harvester Core and Harvest Node recipes at level 1.

Bind a golem with a Harvester Core through Animus Binding. Snow and copper golems take the core by default; `allowedCoresFrost` and `allowedCoresCopper` in the skill configuration decide which bodies can. A new Harvester starts in Work mode, and its Golem GUI cycles Work, Follow, Stay, and Home. Harvesters work only in Work mode and only on Harvest Nodes, so place a Harvest Node with Node Weaving and set its work area over your field. Its channel, priority, work area, and redstone setting work like any other node's.

At each node check, a Harvest Node looks over part of its work area and hands out a harvest job for each ripe crop listed in `crops` that its filter accepts. A filter entry matches a crop by its block or by the item that plants it, so `WHEAT_SEEDS` or `WHEAT` both match wheat and `SWEET_BERRIES` matches sweet berry bushes. A crop is ripe at its maximum growth age. A torchflower is ripe once it has grown into the flower on farmland, a sweet berry bush when fully grown, and cave vines while they carry glow berries. From level `extendedCropsLevel`, melons and pumpkins attached to a stem are ripe, and sugar cane, bamboo, and cactus are harvested from the second block of a stalk upward. Stems and the bottom block of a stalk are never harvested, and Harvesters work only inside the node's current work area.

A Harvester walks to its job, works for its level's `actionIntervalTicksByLevel` ticks, then harvests the crop and carries the drops. It replants the crop with one seed from those drops, such as a wheat seed for wheat or a carrot for carrots; when the drops hold no seed, the spot is left empty. Sweet berry bushes and cave vines keep growing after their berries are picked, melons and pumpkins leave their stem, and stalks keep their bottom block. In the same action it also harvests other ripe crops of that node within 3 blocks that no other golem is walking to, up to its level's `cropsPerActionByLevel` crops in all. Region protection must let you break every block the harvest removes, such as each block of a stalk above its base and both halves of a pitcher plant; otherwise nothing is removed and the node shows Blocked. A Harvester delivers what it carries to a Deposit Node or its home chest like any other working golem, and drops it cannot carry fall to the ground. Static Overdrive and Swiftness runes shorten the action time.

- **Tending** (level `tendingLevel`): while it has no harvest job, a Harvester bone meals a young crop in one of your Harvest Nodes' areas, at most once per `tendingIntervalMillis` milliseconds. Each bone meal comes from its linked home chest, so a Harvester without a home chest or without bone meal in it does not tend. Region protection must let you interact with the crop. Nether wart, cave vines, stalks, melons, and pumpkins are not tended.
- **Tilling** (level `tillingLevel`): Harvest Nodes also hand out jobs to till dirt with nothing above it into farmland. While it has no harvest job, a Harvester that carries seeds plants empty farmland in the area, and it plants freshly tilled farmland at once. It plants wheat, carrots, potatoes, beetroots, torchflowers, and pitcher plants that are listed in `crops` and accepted by the node's filter, prefers the crop growing next to the spot, and never tills dirt or plants farmland beside a melon or pumpkin stem, so the fruit has room to grow. Region protection must let you break and build at the dirt it tills, and build above the farmland it plants.
- **Bountiful** (level `bountifulLevel`): each harvest has a `bountifulChance` chance to roll its drops a second time. An Entropy rune then doubles each drop that wins its own roll.

Each harvested crop pays `workXpPerCrop` work XP, as described in Earning XP; tilling, planting, and tending pay none. Golem harvests never pay Herbalism or any other skill.

| Level | Action time | Crops per action | Unlocks |
|---|---|---|---|
| 1 | 2 s | 1 | Harvests ripe crops and replants them from their drops |
| 2 | 1.5 s | 1 | Melons, pumpkins, sugar cane, bamboo, and cactus |
| 3 | 1.2 s | 2 | Tending: bone meal from the home chest on young crops, once per 10 s |
| 4 | 0.9 s | 3 | Tilling: re-tills dirt and plants empty farmland from carried seeds |
| 5 | 0.6 s | 4 | Bountiful: 10% chance to roll a harvest's drops again |

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Harvester Core | ` X ` / `YBY` / ` Z ` | X `IRON_HOE`, Y `WHEAT`, Z `COMPOSTER`, B `golemancy:blank_core` | 1 | 2 levels |
| Harvest Node | ` X ` / ` B ` / `   ` | X `IRON_HOE`, B `golemancy:blank_node` | 1 | 0 |

The recipe tables use the same fields as the Animus Binding recipes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `actionIntervalTicksByLevel` | `[40, 30, 24, 18, 12]` | Ticks a Harvester spends on each harvest, tilling, planting, or tending action after it reaches the spot, from level 1 upward. Values below 1 count as 1. |
| `cropsPerActionByLevel` | `[1, 1, 2, 3, 4]` | Crops a Harvester harvests in one action, from level 1 upward: the crop it walked to, plus other ripe crops of the same Harvest Node within 3 blocks that no other golem is walking to. Values below 1 count as 1. |
| `crops` | `["WHEAT", "CARROTS", "POTATOES", "BEETROOTS", "NETHER_WART", "COCOA", "SWEET_BERRY_BUSH", "CAVE_VINES", "TORCHFLOWER_CROP", "PITCHER_CROP", "MELON", "PUMPKIN", "SUGAR_CANE", "BAMBOO", "CACTUS"]` | Blocks Harvesters work, by block name. `TORCHFLOWER_CROP` covers grown torchflowers on farmland, `CAVE_VINES` covers both cave vine blocks, `MELON`, `PUMPKIN`, `SUGAR_CANE`, `BAMBOO`, and `CACTUS` need `extendedCropsLevel`, and any other name is harvested at its maximum growth age. Unknown names are ignored, and melon and pumpkin stems are ignored with a warning. |
| `extendedCropsLevel` | `2` | Level at which Harvesters also harvest melons, pumpkins, sugar cane, bamboo, and cactus. |
| `tendingLevel` | `3` | Level at which Harvesters use Tending. |
| `tendingIntervalMillis` | `10000` | Milliseconds after a Harvester uses bone meal before it can use another, at least 1000. Lower values load as 1000. |
| `tillingLevel` | `4` | Level at which Harvesters use Tilling. |
| `bountifulLevel` | `5` | Level at which harvests can roll their drops a second time with Bountiful. |
| `bountifulChance` | `0.1` | Chance, from 0 to 1, that a Bountiful harvest rolls its drops a second time. 0.1 is 10%. Values outside that range load as the nearest limit. |
| `workXpPerCrop` | `0.4` | Golemancy work XP paid for each crop a Harvester harvests. Values below 0 load as 0. |
| `harvesterCoreRecipe` | ` X ` / `YBY` / ` Z `, tithe 2 | Harvester Core recipe. |
| `harvestNodeRecipe` | ` X ` / ` B ` / `   ` | Harvest Node recipe. |

### Lumber Core (`golem-lumber-core`)

5 levels · 2 knowledge, then 4 per level · requires Node Weaving level 1

Makes golems bound with a Lumber Core fell the natural trees in a Lumber Node's area and carry off their logs, then replant, sweep leaves, and fell bigger trees at higher levels, and unlocks the Lumber Core and Lumber Node recipes at level 1.

Bind a golem with a Lumber Core through Animus Binding. Copper and iron golems take the core by default; `allowedCoresCopper` and `allowedCoresIron` in the skill configuration decide which bodies can. A new Lumber golem starts in Work mode, and its Golem GUI cycles Work, Follow, Stay, and Home. Lumber golems work only in Work mode and only on Lumber Nodes, so place a Lumber Node with Node Weaving and set its work area over the bottom of your trees. Its channel, priority, work area, and redstone setting work like any other node's.

At each node check, a Lumber Node looks over part of its work area and hands out a felling job for each natural tree whose trunk starts there. Only the bottom of the trunk has to be inside the work area. A tree is natural when all of these hold:

- Its bottom log stands on dirt, grass, podzol, coarse dirt, rooted dirt, mycelium, moss, mud, or farmland. A mangrove may also stand on its own mangrove roots, and a huge fungus stands on nylium.
- Leaves that no player placed grow within 2 blocks of its top logs. For a huge fungus, wart blocks or shroomlights take the place of leaves.
- No player placed any of its logs, apart from the logs that grew where you planted saplings or fungi: the bottom log of a one-block trunk, or all four bottom logs of a 2x2 trunk whose four columns all continue upward. A 2x2 trunk with only some of its bottom logs placed, a 2x2 trunk with a bottom log that has no log of the same tree above it, such as logs placed around the base of a one-block trunk, and a wide fungus stem with any placed bottom stem are never cut.
- None of its logs touches a block that does not grow around trees, such as planks, glass, stairs, fences, torches, wool, cobblestone, stripped logs, wood blocks, or leaves a player placed.

Trees that break any of these rules, including houses and other builds made of logs, are never cut. Logs of another kind of tree touching the trunk are allowed and left standing. A tree that is turned down is looked at again a minute later, so a tree you fix, for example by removing a block built against it, is offered within a minute.

A tree may have at most your level's `copperTreeCapByLevel` logs for a copper golem, or `ironTreeCapByLevel` logs for an iron golem; golems of any other body use the copper limit. A Lumber Node offers each tree only to the golems that can fell it, and trees too big for every golem are left standing.

A Lumber golem walks to the bottom of the trunk, works for a second, then fells the tree from the top down at your level's `logsPerSecondByLevel` and carries the logs. It fells only as many logs at a time as it has room for. Region protection must let you break every block it fells in that second; otherwise none of them is felled and the node shows Blocked. If something is built against the tree while it is being felled, the golem stops felling it. A Lumber golem that fills up delivers what it carries to a Deposit Node or its home chest like any other working golem. The felling stays open while the Lumber Node keeps working, and the next Lumber golem to take the job finishes the same tree. A felling is dropped a minute after its node stops working, for example when the node is broken, switched off by redstone, or unloaded. Leaves left behind decay as usual. Static Overdrive and Swiftness runes speed up felling, and an Entropy rune can double each drop.

- **Replanting** (level `replantLevel`): after felling a tree, the golem plants a matching sapling where the trunk stood, as long as the spot is empty and stands on soil the sapling grows on. The sapling comes from what the golem carries, then from its linked home chest. A tree with a 2x2 trunk is replanted with four saplings when four are at hand; otherwise one sapling replants it, except dark oaks and pale oaks, which need all four. Azalea trees are replanted with an azalea, or a flowering azalea when at least half of the azalea leaves near the top are flowering. A mangrove standing on its roots is not replanted. Region protection must let you build where the sapling goes.
- **Leaf Sweep** (level `leafSweepLevel`): 2 seconds after the last log falls, the golem breaks the felled tree's leaves that have started to decay and carries their saplings, sticks, and apples. It looks at up to 64 leaves a second and pauses while it has no room left. Leaves still held up by another tree's logs and leaves a player placed stay where they are, and leaves region protection does not let you break are left to decay as usual.
- **Mega trees** (level `megaTreeLevel`): Lumber golems also fell spruce, jungle, dark oak, and pale oak trees with a full 2x2 trunk. Any other overworld trunk wider than one block, such as two trunks that touch or a log placed beside a trunk, is always left standing. Thick fungus stems are covered under Nether fungi.
- **Nether fungi** (level `netherLevel`): Lumber golems also fell huge crimson and warped fungi, including thick-stemmed ones once mega trees are unlocked. They take the fungus's wart blocks and shroomlights from the top down along with the stems, without counting them against the logs per second, and Replanting plants a matching fungus on the nylium.

Each felled log or stem pays `workXpPerLog` work XP, as described in Earning XP; leaves, wart blocks, shroomlights, and replanting pay none. Golem felling never pays Axes or any other skill.

| Level | Logs per second | Logs per tree (copper / iron) | Unlocks |
|---|---|---|---|
| 1 | 1 | 24 / 64 | Fells natural trees from the top down and carries the logs |
| 2 | 1.5 | 32 / 96 | Replanting: plants a sapling where the trunk stood |
| 3 | 2 | 48 / 128 | Leaf Sweep: breaks decaying leaves and carries their saplings, sticks, and apples |
| 4 | 3 | 64 / 192 | Fells spruce, jungle, dark oak, and pale oak trees with a full 2x2 trunk |
| 5 | 4 | 96 / 256 | Fells huge crimson and warped fungi with their wart blocks and shroomlights, and replants fungus |

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Lumber Core | ` X ` / `YBY` / ` Z ` | X `IRON_AXE`, Y `#logs`, Z `#saplings`, B `golemancy:blank_core` | 1 | 2 levels |
| Lumber Node | ` X ` / ` B ` / `   ` | X `IRON_AXE`, B `golemancy:blank_node` | 1 | 0 |

The recipe tables use the same fields as the Animus Binding recipes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `logsPerSecondByLevel` | `[1.0, 1.5, 2.0, 3.0, 4.0]` | Logs a Lumber golem fells per second once it reaches a tree, from level 1 upward. Values load between 0.05 and 64. |
| `copperTreeCapByLevel` | `[24, 32, 48, 64, 96]` | Most logs a tree can have for a copper golem, or a golem of any body other than iron, to fell it, from level 1 upward. Values below 1 count as 1. |
| `ironTreeCapByLevel` | `[64, 96, 128, 192, 256]` | Most logs a tree can have for an iron golem to fell it, from level 1 upward. Values below 1 count as 1. |
| `replantLevel` | `2` | Level at which Lumber golems use Replanting. |
| `leafSweepLevel` | `3` | Level at which Lumber golems use Leaf Sweep. |
| `megaTreeLevel` | `4` | Level at which Lumber golems fell spruce, jungle, dark oak, and pale oak trees with a full 2x2 trunk. |
| `netherLevel` | `5` | Level at which Lumber golems fell huge crimson and warped fungi. |
| `workXpPerLog` | `0.6` | Golemancy work XP paid for each log or stem a Lumber golem fells. Values below 0 load as 0. |
| `lumberCoreRecipe` | ` X ` / `YBY` / ` Z `, tithe 2 | Lumber Core recipe. |
| `lumberNodeRecipe` | ` X ` / ` B ` / `   ` | Lumber Node recipe. |

### Breaker Core (`golem-breaker-core`)

5 levels · 2 knowledge, then 4 per level · requires Node Weaving level 1

Makes golems bound with a Breaker Core break the blocks a Breaker Node's filter lists inside its work area, such as the output of a cobblestone or basalt generator or the ice of an ice farm, and unlocks the Breaker Core and Breaker Node recipes at level 1.

Bind an iron golem with a Breaker Core through Animus Binding. Only iron golems take the core by default; `allowedCoresIron` and the other `allowedCores` lists in the skill configuration decide which bodies can, and iron golems bind only after you learn Iron Frame. A new Breaker starts in Work mode, and its Golem GUI cycles Work, Follow, Stay, and Home. Breakers work only in Work mode and only on Breaker Nodes, so place a Breaker Node with Node Weaving and set its work area over the blocks to mine. Its channel, priority, work area, and redstone setting work like any other node's.

A Breaker Node needs a whitelist filter: it breaks only the blocks its filter lists, and a node with an empty filter or a blacklist breaks nothing. A filter entry matches a block by its block or by the item that places it, so `REDSTONE` matches redstone wire, and an item tag such as `#minecraft:coal_ores` matches each block whose item the tag holds, here both coal ores. At each node check, a Breaker Node looks over part of its work area and hands out a break job for each listed block your level can mine: one no harder than your level's `maxHardnessByLevel`, that your level's pickaxe in `toolByLevel` can harvest, and that is not water or lava. Breakers never break the blocks in `blacklist`, blocks with a block entity, such as chests, furnaces, signs, beds, and spawners, the block any node is placed on, including the Breaker Node's own block, or the blocks of an Animus Plinth.

A Breaker walks to its job, works for its level's `intervalTicksByLevel` ticks, then breaks the block and carries the drops. The drops are rolled as if your level's pickaxe broke the block, with Silk Touch or Fortune I when the node turns them on. Breaking a block updates its neighbors as mining does, so water and lava flow back into a generator and sand or gravel above the block falls, and a waterlogged block leaves its water behind. Region protection must let you break the block; otherwise it stays and the node shows Blocked. A Breaker delivers what it carries to a Deposit Node or its home chest like any other working golem, and drops it cannot carry fall to the ground. Swiftness runes shorten the time per block. An Entropy rune doubles each drop that wins its own roll, except on blocks a player placed and for drops of the broken block itself, such as cobblestone from cobblestone or stone mined with Silk Touch.

The bottom row of a Breaker Node's GUI shows whether the node has the whitelist entries it needs, and holds the Silk Touch and Fortune I toggles. Turning one of them on turns the other off.

- **Silk Touch** (level `silkTouchLevel`): Breakers mine blocks whole, such as stone instead of cobblestone or ice instead of nothing.
- **Fortune I** (level `fortuneLevel`): Breakers mine with Fortune I, which raises the drops of ores and the other blocks Fortune affects.

Each broken block pays `workXpPerBlock` work XP, as described in Earning XP. Golem mining never pays Pickaxes or any other skill.

| Level | Time per block | Hardest block | Pickaxe | Unlocks |
|---|---|---|---|---|
| 1 | 2 s | 2 (cobblestone) | Stone | Breaks the blocks a Breaker Node's filter lists |
| 2 | 1.5 s | 3 (deepslate) | Iron | |
| 3 | 1 s | 5 | Iron | Silk Touch toggle |
| 4 | 0.75 s | 10 | Diamond | |
| 5 | 0.5 s | 50 (obsidian) | Netherite | Fortune I toggle |

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Breaker Core | ` X ` / `YBY` / ` Z ` | X `IRON_PICKAXE`, Y `REDSTONE`, Z `PISTON`, B `golemancy:blank_core` | 1 | 2 levels |
| Breaker Node | ` X ` / ` B ` / `   ` | X `IRON_PICKAXE`, B `golemancy:blank_node` | 1 | 0 |

The recipe tables use the same fields as the Animus Binding recipes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `intervalTicksByLevel` | `[40, 30, 20, 15, 10]` | Ticks a Breaker spends on each block after it reaches it, from level 1 upward. Values below 1 count as 1. |
| `maxHardnessByLevel` | `[2.0, 3.0, 5.0, 10.0, 50.0]` | Hardest block a Breaker breaks, from level 1 upward. Stone is 1.5, cobblestone 2, deepslate 3, and obsidian 50. |
| `toolByLevel` | `["STONE_PICKAXE", "IRON_PICKAXE", "IRON_PICKAXE", "DIAMOND_PICKAXE", "NETHERITE_PICKAXE"]` | Pickaxe a Breaker mines with, by item name, from level 1 upward. Drops are rolled as if this pickaxe broke the block, and blocks it cannot harvest are left alone. Names that are not a pickaxe use the default pickaxe for that level, with a warning. |
| `silkTouchLevel` | `3` | Level at which Breaker Nodes can turn on Silk Touch. |
| `fortuneLevel` | `5` | Level at which Breaker Nodes can turn on Fortune I. |
| `blacklist` | `["BEDROCK", "BARRIER", "COMMAND_BLOCK", "CHAIN_COMMAND_BLOCK", "REPEATING_COMMAND_BLOCK", "STRUCTURE_BLOCK", "STRUCTURE_VOID", "JIGSAW", "SPAWNER", "TRIAL_SPAWNER", "VAULT", "END_PORTAL_FRAME", "REINFORCED_DEEPSLATE", "BUDDING_AMETHYST", "#beds", "#doors"]` | Blocks Breakers never break, by block name or `#` block tag. Unknown names and tags are ignored. Blocks with a block entity, the block any node is placed on, and the blocks of an Animus Plinth are never broken either. |
| `workXpPerBlock` | `0.4` | Golemancy work XP paid for each block a Breaker breaks. Values below 0 load as 0. |
| `breakerCoreRecipe` | ` X ` / `YBY` / ` Z `, tithe 2 | Breaker Core recipe. |
| `breakerNodeRecipe` | ` X ` / ` B ` / `   ` | Breaker Node recipe. |

### Rancher Core (`golem-rancher-core`)

5 levels · 2 knowledge, then 4 per level · requires Node Weaving level 1

Makes golems bound with a Rancher Core tend the animals in a Pasture Node's area: they breed pairs up to the node's keep count, and at higher levels shear sheep, milk cows, goats, and mooshrooms, and cull spare adults. Unlocks the Rancher Core and Pasture Node recipes at level 1.

Bind a golem with a Rancher Core through Animus Binding. Copper and iron golems take the core by default; `allowedCoresCopper` and `allowedCoresIron` in the skill configuration decide which bodies can, and only iron Ranchers cull. A new Rancher starts in Work mode, and its Golem GUI cycles Work, Follow, Stay, and Home. Ranchers work only in Work mode and only in the work area of each of your Pasture Nodes that lies within their work radius (`baseWorkRadius` plus Tide), has a channel the golem matches, and is not switched off by redstone. Place a Pasture Node with Node Weaving and set its work area over your pen. Its channel, priority, work area, and redstone setting work like any other node's; its filter is not used.

Pasture Nodes tend the animals listed in `species`. The bottom row of a Pasture Node's GUI holds its settings:

- **Species**: all tended animals, or one of them. Left-click for the next species, right-click for the previous one.
- **Keep count**: from 2 to 64, and `defaultKeep` until you change it. Left-click raises it and right-click lowers it. Each species is counted on its own, inside the work area, including animals Ranchers leave alone. For breeding, adults and babies count, plus one for every pair in love, and a lone animal in love counts as a pair; for culling, only adults count.
- **Breeding, Shearing, Milking, and Culling**: click a toggle to switch it. Breeding, Shearing, and Milking start on and Culling starts off. A toggle stays locked until you reach its level.

When the task board has nothing for it, a Rancher looks for work in your Pasture Nodes, highest priority first, then nearest first. In each node it takes culling jobs first, then breeding, shearing, and milking, and the nearest animal for each. It walks to the animal, works for `actionIntervalTicks` ticks, then acts. Region protection must let you interact with the animal, or damage it for culling; otherwise nothing happens and the node shows Blocked. Ranchers never touch invulnerable animals, NPCs, Adapt minions, or animals you tamed. Static Overdrive and Swiftness runes shorten the action time.

- **Breeding** (level 1): while a species' breeding count in the area is below the keep count, a Rancher feeds that species' breeding food to two adults that are ready to breed, one after the other, and each goes into love mode. It starts a pair only when it has food for both animals. When an adult it fed is still waiting in love, it feeds the ready adult nearest to it within 8 blocks. It never finishes a pair a player started. The food comes from what the golem carries, then from its linked home chest. Parents wait out their breeding cooldown as usual, and births from parents a Rancher fed give no experience.
- **Shearing** (level `shearLevel`): Ranchers shear adult sheep and carry 1 to 3 wool of the sheep's color. Mooshrooms are never sheared.
- **Milking** (level `milkLevel`): Ranchers milk adult cows, goats, and mooshrooms into an empty bucket and carry the milk bucket. A mooshroom fills an empty bowl with mushroom stew instead when a bowl is at hand, unless it holds a suspicious stew, which it keeps for you. Buckets and bowls come from what the golem carries, then from its linked home chest.
- **Culling** (level `cullLevel`, iron golems only): while a species has more adults in the area than the keep count, an iron Rancher kills the nearest spare adult with one blow and carries its loot. Culled animals drop no experience. It never culls babies, or named, leashed, tamed, ridden, or equipped animals, such as a saddled pig or a llama wearing a carpet.
- **Husbandry** (level `husbandryLevel`): parents a Rancher fed wait `husbandryCooldownMultiplier` times the normal breeding cooldown before they can breed again, and each cull rolls the animal's loot `husbandryExtraLootRolls` more times while the game rule that lets mobs drop loot is on.

A Rancher delivers what it carries to a Deposit Node or its home chest like any other working golem, and items it cannot carry fall to the ground. Each animal it feeds pays half of `workXpPerPair`, each sheep it shears `workXpPerShear`, each bucket or bowl it fills `workXpPerMilk`, and each animal it culls `workXpPerCull` work XP, as described in Earning XP. A cull is a golem kill, so it never pays Hunter or any other skill's kill rewards, and animals pay no Golemancy kill XP. Breeding by a Rancher never pays Taming.

| Level | Unlocks |
|---|---|
| 1 | Breeding: feeds pairs while a species is below the keep count |
| 2 | Shearing: shears sheep and carries their wool |
| 3 | Milking: fills buckets and bowls from the home chest at cows, goats, and mooshrooms |
| 4 | Culling: iron Ranchers cull adults above the keep count |
| 5 | Husbandry: half the breeding cooldown for parents it fed, and one extra loot roll for each cull |

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Rancher Core | ` X ` / `YBY` / ` Z ` | X `SHEARS`, Y `WHEAT`, Z `LEAD`, B `golemancy:blank_core` | 1 | 2 levels |
| Pasture Node | ` X ` / ` B ` / `   ` | X `LEAD`, B `golemancy:blank_node` | 1 | 0 |

The recipe tables use the same fields as the Animus Binding recipes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `species` | `["COW", "MOOSHROOM", "SHEEP", "PIG", "CHICKEN", "GOAT", "RABBIT"]` | Animals Pasture Nodes tend, by entity type name. Each Pasture Node tends all of them or the one species chosen in its GUI. Names that are not animals are ignored. |
| `defaultKeep` | `8` | Keep count of a Pasture Node until you change it in its GUI. Ranchers breed a species while its adults, babies, and pairs in love number fewer than this, and cull adults above it. Values load between 2 and 64. |
| `actionIntervalTicks` | `40` | Ticks a Rancher spends on each breeding, shearing, milking, or culling action after it reaches the animal. Values below 1 load as 1. |
| `shearLevel` | `2` | Level at which Ranchers shear sheep. |
| `milkLevel` | `3` | Level at which Ranchers milk cows, goats, and mooshrooms. |
| `cullLevel` | `4` | Level at which iron Ranchers cull adults above the keep count. |
| `husbandryLevel` | `5` | Level at which Ranchers use Husbandry. |
| `husbandryCooldownMultiplier` | `0.5` | Multiplier, from 0 to 1, on the breeding cooldown of parents a Rancher fed once Husbandry is unlocked. 0.5 halves it. Values outside that range load as the nearest limit. |
| `husbandryExtraLootRolls` | `1` | Extra times a culled animal's loot is rolled once Husbandry is unlocked, from 0 to 8. Values outside that range load as the nearest limit. |
| `workXpPerPair` | `4.0` | Golemancy work XP paid for each pair of animals a Rancher feeds, half for each animal. Values below 0 load as 0. |
| `workXpPerShear` | `2.0` | Golemancy work XP paid for each sheep a Rancher shears. Values below 0 load as 0. |
| `workXpPerMilk` | `1.0` | Golemancy work XP paid for each bucket or bowl a Rancher fills. Values below 0 load as 0. |
| `workXpPerCull` | `1.0` | Golemancy work XP paid for each animal a Rancher culls. Values below 0 load as 0. |
| `rancherCoreRecipe` | ` X ` / `YBY` / ` Z `, tithe 2 | Rancher Core recipe. |
| `pastureNodeRecipe` | ` X ` / ` B ` / `   ` | Pasture Node recipe. |

### Angler Core (`golem-angler-core`)

5 levels · 2 knowledge, then 4 per level · requires Node Weaving level 1

Makes golems bound with an Angler Core fish the open water in front of a Fishing Node and carry the catch, with more luck, a junk filter, faster catches in the rain, and double catches at higher levels, and unlocks the Angler Core and Fishing Node recipes at level 1.

Bind a golem with an Angler Core through Animus Binding. Copper and iron golems take the core by default; `allowedCoresCopper` and `allowedCoresIron` in the skill configuration decide which bodies can. A new Angler starts in Work mode, and its Golem GUI cycles Work, Follow, Stay, and Home. Anglers work only in Work mode and only at Fishing Nodes, so place a Fishing Node with Node Weaving on the side of a block, facing the water. Fishing Nodes go only on the side of a block; placing one on the top or bottom of a block is refused with an action-bar message and keeps the node. A Fishing Node's channel, priority, and redstone setting work like any other node's; its work area setting has no effect.

A Fishing Node fishes the water in front of its face: a patch 5 blocks wide that starts at the face and reaches 5 blocks out, centered on the node. The water is open, as it is for a fishing bobber, when four layers of that patch, from one block below the node to two blocks above it, hold nothing but water source blocks and air. The lowest layer must be all water, every layer above it must be all water or all air, and no water layer may sit above an air layer, so a node at the waterline or one block above it suits most ponds, rivers, and oceans. Seagrass, kelp, and bubble columns count as water and lily pads count as air; flowing water, waterlogged blocks, and every other block close the water. A node without open water hands out no jobs and shows Blocked, and changes to the water are noticed within 10 seconds.

Each Fishing Node seats one Angler for each of `maxAnglersPerChunk`, up to 5, on the blocks right in front of its face, and offers one free seat at a time. At most `maxAnglersPerChunk` Anglers fish at once in one chunk, counting every Fishing Node in that chunk; other Anglers wait until a seat frees up.

An Angler walks to its seat and casts, then lands one catch every `catchIntervalSecondsByLevel` seconds and carries it. Each catch is rolled from the `fish`, `junk`, and `treasure` tables. The category is picked by `fishWeight`, `junkWeight`, and `treasureWeight`, each changed by its luck shift times your level's `luckByLevel`, the way Luck of the Sea shifts vanilla fishing toward treasure, and the item is picked by its weight in that table. Treasure enchanted books and treasure with durability, such as bows and fishing rods, come enchanted as if at an enchanting table with `treasureEnchantLevels` levels, treasure enchantments included. An Angler keeps fishing until it is full, then delivers its catch to a Deposit Node or its home chest like any other working golem and returns to fish; catches it cannot carry fall to the ground beside it. Region protection must let you interact with the seat block; otherwise the Angler stops and the node shows Blocked. Static Overdrive on copper golems and Swiftness runes shorten the catch time, and an Entropy rune can double each catch. Each cast and each catch splashes the water with the fishing bobber's sound.

The bottom row of a Fishing Node's GUI shows whether the node found open water, and holds the junk filter toggle.

- **Junk filter** (level `junkFilterLevel`): set the node's junk toggle to Discard, and Anglers throw junk catches back instead of carrying them.
- **Rain** (level `rainLevel`): while rain falls on the water, the catch time is multiplied by `rainIntervalMultiplier`. Rain falls on the water during a storm when nothing above the water blocks the sky and the biome is neither cold enough for snow nor too dry for rain.
- **Double catch** (level `doubleCatchLevel`): each catch has a `doubleCatchChance` chance to bring up a second catch, rolled on its own.

Each catch pays `workXpPerCatch` work XP, as described in Earning XP, including junk the filter throws back and both catches of a double catch. Golem fishing drops no experience orbs and never pays Seaborne or any other skill.

| Level | Catch time | Luck | Unlocks |
|---|---|---|---|
| 1 | 60 s | 0 | Fishes the open water at a Fishing Node and carries the catch |
| 2 | 50 s | 0 | |
| 3 | 40 s | 1 | Junk filter toggle |
| 4 | 32 s | 1 | 25% shorter catch time in the rain |
| 5 | 25 s | 2 | 10% chance of a double catch |

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Angler Core | ` X ` / `YBY` / ` Z ` | X `FISHING_ROD`, Y `PRISMARINE_SHARD`, Z `DRIED_KELP`, B `golemancy:blank_core` | 1 | 2 levels |
| Fishing Node | ` X ` / ` B ` / `   ` | X `FISHING_ROD`, B `golemancy:blank_node` | 1 | 0 |

The recipe tables use the same fields as the Animus Binding recipes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `catchIntervalSecondsByLevel` | `[60, 50, 40, 32, 25]` | Seconds an Angler waits for each catch, from level 1 upward. Values below 1 count as 1. |
| `luckByLevel` | `[0, 0, 1, 1, 2]` | Fishing luck of each catch, from level 1 upward. Each point changes the category weights by their luck shifts. Values below 0 count as 0. |
| `junkFilterLevel` | `3` | Level at which Fishing Nodes can turn on the junk filter. |
| `rainLevel` | `4` | Level at which Anglers catch faster while rain falls on their water. |
| `rainIntervalMultiplier` | `0.75` | Multiplier on the catch time while rain falls on the water. 0.75 is 25% shorter. Values load between 0.05 and 1. |
| `doubleCatchLevel` | `5` | Level at which a catch can bring up a second catch. |
| `doubleCatchChance` | `0.1` | Chance, from 0 to 1, that a catch brings up a second catch. 0.1 is 10%. Values outside that range load as the nearest limit. |
| `maxAnglersPerChunk` | `2` | Most Anglers that fish at once in one chunk, counting every Fishing Node in it. Each Fishing Node seats up to 5 of them. Values below 1 load as 1. |
| `fishWeight` | `85` | Weight of the fish category at 0 luck. |
| `fishLuckShift` | `-1` | Change to the fish weight per point of luck. |
| `junkWeight` | `10` | Weight of the junk category at 0 luck. |
| `junkLuckShift` | `-2` | Change to the junk weight per point of luck. Weights never drop below 0. |
| `treasureWeight` | `5` | Weight of the treasure category at 0 luck. |
| `treasureLuckShift` | `2` | Change to the treasure weight per point of luck. |
| `fish` | `["COD:60", "SALMON:25", "TROPICAL_FISH:2", "PUFFERFISH:13"]` | Fish catches as `MATERIAL:weight`, or `MATERIAL:weight:min:max` for a stack of min to max items. Entries that are not an item or have no weight above 0 are ignored with a warning. |
| `junk` | `["LILY_PAD:17", "LEATHER_BOOTS:10", "LEATHER:10", "BONE:10", "STRING:5", "FISHING_ROD:2", "BOWL:10", "STICK:5", "INK_SAC:1:10:10", "TRIPWIRE_HOOK:10", "ROTTEN_FLESH:10"]` | Junk catches, in the same format as `fish`. |
| `treasure` | `["NAME_TAG:1", "SADDLE:1", "BOW:1", "FISHING_ROD:1", "ENCHANTED_BOOK:1", "NAUTILUS_SHELL:1"]` | Treasure catches, in the same format as `fish`. `ENCHANTED_BOOK` and items with durability, such as bows and fishing rods, are enchanted with `treasureEnchantLevels`. |
| `treasureEnchantLevels` | `30` | Enchantment levels for treasure enchanted books and durable treasure, as at an enchanting table, treasure enchantments included. Values load between 1 and 30. |
| `workXpPerCatch` | `6` | Golemancy work XP paid for each catch, including junk the filter throws back. Values below 0 load as 0. |
| `anglerCoreRecipe` | ` X ` / `YBY` / ` Z `, tithe 2 | Angler Core recipe. |
| `fishingNodeRecipe` | ` X ` / ` B ` / `   ` | Fishing Node recipe. |

### Runic Augments (`golem-runic-augments`)

5 levels · 2 knowledge, then 4 per level · requires Animus Binding level 2

Lets you infuse runes at the Animus Plinth and slot them into your bound golems for speed, carrying, fire, reach, channels, yield, and armor. Level 1 unlocks loading and using the Animus Plinth, tier 1 rune infusions, and the Blank Rune recipe.

Each bound golem has rune slots: `frostSlots` for a frost golem, `copperSlots` for a copper golem, or `ironSlots` for an iron golem, plus your level's `extraSlotsByLevel`. With the defaults, frost golems have 1, 2, and 3 slots at levels 1, 3, and 5, copper golems 2, 3, and 4, and iron golems 3, 4, and 5. The Golem GUI shows the slots in its second row; a locked slot names the Runic Augments level that opens it.

- **Slotting a rune:** with the Golem GUI open, pick up a rune from your inventory and click an empty slot. One rune from the stack moves into the golem.
- **Taking a rune back:** click a slotted rune. It goes into your inventory, or drops at your feet when your inventory is full.
- A golem holds one rune of each aspect.
- A body cannot take the runes `runeBodyBlocks` lists for it; by default, frost golems cannot take Ember runes.
- Your golems use runes up to your level's `maxTierByLevel` tier. A higher-tier rune can still be slotted, but it stays inert, and the Golem GUI shows why in red. Runes in slots your level does not open, and runes a body cannot use, are inert the same way.
- Rune effects follow your level: when you learn or unlearn levels, your awake golems update shortly and sleeping golems update when they wake.
- Runes stay in the golem through chunk unloads and restarts. Releasing a golem drops its runes, and when a bound golem dies each rune drops at the `deathDropRuneChance` set in the skill configuration, unless the golem leaves a Shattered Core through Golem Mending, which keeps its runes.

| Level | Extra rune slots | Highest usable tier | Unlocks |
|---|---|---|---|
| 1 | +0 | 1 | Animus Plinth, tier 1 infusions, Blank Rune recipe |
| 2 | +0 | 1 | |
| 3 | +1 | 2 | Tier 2 infusions |
| 4 | +1 | 2 | |
| 5 | +2 | 3 | Tier 3 infusions |

#### Runes

| Rune | Tier 1 | Tier 2 | Tier 3 |
|---|---|---|---|
| Swiftness | +10% movement speed, 10% less time between work actions | +20% speed, 20% less time | +30% speed, 30% less time |
| Might | +50% carry capacity, +2 attack damage | +100% capacity, +4 attack | +150% capacity, +6 attack |
| Ember | Hits set the target on fire for 2 s | Fire for 4 s, immune to fire | Fire for 6 s, immune to fire and lava |
| Tide | +4 blocks of work radius and mob detection range | +8 blocks, breathes underwater | +12 blocks, moves through water as fast as on land |
| Order | +1 channel | +2 channels, retries a skipped job after half the wait | +3 channels, retries after a quarter of the wait |
| Entropy | 5% chance to double each drop of Harvester, Lumber, Breaker, and Angler work | 10% chance, hits apply Weakness I for 3 s | 15% chance, hits apply Weakness II for 3 s |
| Bulwark | +4 armor | +8 armor, +2 armor toughness | +12 armor, +4 armor toughness, +0.5 knockback resistance |

- **Swiftness** shortens the time between a working golem's actions and its waits at containers.
- **Ember** sets on fire whatever the golem hits. Fire immunity covers fire, burning, magma blocks, and campfires.
- **Tide** adds to `baseWorkRadius` for the jobs, Deposit Nodes, Collection Nodes, and Guard Nodes the golem considers, to the pickup radius of a Gatherer without a Collection Node, to the range in which a Companion or Guardian golem attacks mobs, up to `leashRadius`, and to its follow range, which sets how far it notices mobs. Breathing underwater protects the golem from drowning and, for frost golems, from water damage.
- **Order** adds channels. With an Order rune slotted, the channel button in the Golem GUI opens a channel picker: click a dye to select it, up to the golem's channel count, and click a selected dye to drop it. The golem takes jobs from and delivers to nodes on any of its channels. A golem with more channels selected than it can use uses the first ones in dye order, starting with white. A golem that gives up a job skips it for a shorter time.
- **Entropy** doubles each drop that wins its roll.

| Recipe | Pattern | Keys | Yield | Tithe |
|---|---|---|---|---|
| Blank Rune | ` A ` / `ASA` / ` A ` | A `AMETHYST_SHARD`, S `SMOOTH_STONE` | 2 | 0 |

The recipe table uses the same fields as the Animus Binding recipes.

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `extraSlotsByLevel` | `[0, 0, 1, 1, 2]` | Extra rune slots every bound golem you own gets on top of its body's slots, from level 1 upward. |
| `maxTierByLevel` | `[1, 1, 2, 2, 3]` | Highest rune tier your bound golems can use, from level 1 upward. Slotted runes above it stay in place but do nothing. |
| `frostSlots` | `1` | Rune slots a bound frost golem has before Runic Augments adds extra slots, from 0 to 9. |
| `copperSlots` | `2` | Rune slots a bound copper golem has before Runic Augments adds extra slots, from 0 to 9. |
| `ironSlots` | `3` | Rune slots a bound iron golem has before Runic Augments adds extra slots, from 0 to 9. |
| `runeBodyBlocks` | `["ember:frost"]` | Runes a golem body cannot use, as `aspect:body` entries. Listed runes cannot be slotted into that body, and any already slotted do nothing. Unknown entries are ignored with a console warning. |
| `blankRuneRecipe` | ` A ` / `ASA` / ` A `, yields 2 | Blank Rune recipe. |
| `swiftnessSpeedByTier` | `[0.1, 0.2, 0.3]` | Fraction added to a golem's movement speed by a Swiftness rune of tier 1, 2, and 3. 0.1 is 10% faster. |
| `swiftnessWorkIntervalByTier` | `[0.1, 0.2, 0.3]` | Fraction cut from the time between a golem's work actions by a Swiftness rune of tier 1, 2, and 3. The time never drops below 5% of normal. |
| `mightCarryByTier` | `[0.5, 1.0, 1.5]` | Fraction added to a golem's carry capacity by a Might rune of tier 1, 2, and 3. 0.5 is 50% more. |
| `mightAttackByTier` | `[2.0, 4.0, 6.0]` | Attack damage added to a golem by a Might rune of tier 1, 2, and 3. |
| `emberIgniteSecondsByTier` | `[2, 4, 6]` | Seconds an Ember rune of tier 1, 2, and 3 sets whatever its golem hits on fire. |
| `emberFireImmuneByTier` | `[false, true, true]` | Whether an Ember rune of tier 1, 2, and 3 makes its golem immune to fire damage. |
| `emberLavaImmuneByTier` | `[false, false, true]` | Whether an Ember rune of tier 1, 2, and 3 makes its golem immune to lava damage. |
| `tideRadiusByTier` | `[4.0, 8.0, 12.0]` | Blocks a Tide rune of tier 1, 2, and 3 adds to its golem's work radius, to a Gatherer's pickup radius, to the range in which a Companion or Guardian golem attacks mobs, up to `leashRadius`, and to how far it notices mobs. |
| `tideWaterBreathingByTier` | `[false, true, true]` | Whether a Tide rune of tier 1, 2, and 3 lets its golem breathe underwater. |
| `tideSwimSpeedByTier` | `[0.0, 0.0, 1.0]` | Water movement efficiency a Tide rune of tier 1, 2, and 3 adds to its golem. 1.0 moves through water as fast as on land. |
| `orderChannelsByTier` | `[1, 2, 3]` | Extra channels an Order rune of tier 1, 2, and 3 gives its golem on top of its one channel. |
| `orderReclaimDelayByTier` | `[0.0, 0.5, 0.75]` | Fraction cut from the 10 seconds an Order golem skips a job it gave up on, by rune tier 1, 2, and 3. 0.5 is half as long. |
| `entropyBonusYieldByTier` | `[0.05, 0.1, 0.15]` | Chance for each drop of Harvester, Lumber, Breaker, or Angler work to be doubled by an Entropy rune of tier 1, 2, and 3. 0.05 is 5%. |
| `entropyWeaknessLevelByTier` | `[0, 1, 2]` | Weakness level an Entropy rune of tier 1, 2, and 3 puts on whatever its golem hits. 0 applies none. |
| `entropyWeaknessSecondsByTier` | `[0, 3, 3]` | Seconds the Weakness from an Entropy rune of tier 1, 2, and 3 lasts. |
| `bulwarkArmorByTier` | `[4.0, 8.0, 12.0]` | Armor added to a golem by a Bulwark rune of tier 1, 2, and 3. |
| `bulwarkToughnessByTier` | `[0.0, 2.0, 4.0]` | Armor toughness added to a golem by a Bulwark rune of tier 1, 2, and 3. |
| `bulwarkKnockbackResistanceByTier` | `[0.0, 0.0, 0.5]` | Knockback resistance added to a golem by a Bulwark rune of tier 1, 2, and 3. 1.0 means no knockback. |

### Golem Mending (`golem-mending`)

5 levels · 2 knowledge, then 4 per level · requires Animus Binding level 1

Heals your golems with copper ingots, snow blocks, and bone meal, lets them regenerate near you and at home, and rebuilds a fallen golem from the Shattered Core it leaves behind.

Right-click one of your bound golems or servants with its healing item to heal it:

| Item | Heals | Base health |
|---|---|---|
| Copper ingot | Your bound copper golems | `copperIngotHeal` |
| Snow block | Your bound frost golems | `snowBlockHeal` |
| Bone meal | Your TragOul skeletal servants | `boneMealHeal` |

Each heal restores its base health plus your level's `healBonusByLevel` fraction of it, never above the maximum health, and uses up one item unless you are in creative mode. A golem or servant at full health refuses the item, and an action-bar message says so. Heals on golems count toward repair XP as described in Earning XP. While you are online, an iron ingot repair of one of your bound iron golems, by anyone, also heals your level's `healBonusByLevel` fraction of the vanilla 25 health, on top of the vanilla repair and any Iron Frame bonus.

- **Regeneration near you** (level `ownerRegenLevel`): your awake golems heal `ownerRegenAmount` health every `regenIntervalSeconds` seconds while they are within `ownerRegenRadius` blocks of you in the same world.
- **Regeneration at home** (level `homeRegenLevel`): a golem with no job and no target heals `homeRegenAmount` health every `regenIntervalSeconds` seconds while it is within `homeRegenRadius` blocks of its home. When both regenerations apply, the golem heals the larger amount, not both. Sleeping golems never regenerate.
- **Shattered Core** (level `shatterLevel`): when one of your bound golems dies while you are online, it still drops the items it carries and its essence as experience, but instead of dropping cores and runes at the skill's `deathDropCoreChance` and `deathDropRuneChance`, it leaves a Shattered Core where it died, and an action-bar message tells you. The Shattered Core keeps the golem's cores, runes, channels, mode, home, home chest, name, and record of kills, damage, jobs, and items moved. Only you can pick it up; hoppers and other mobs cannot take it. It never despawns, and damage such as fire, lava, cactus, and explosions cannot destroy it. When a golem dies below the bottom of the world, its Shattered Core appears at the lowest block height instead. The golem stays in your roster as shattered and still counts toward your golem cap. A golem that dies while you are offline, or before you reach `shatterLevel`, drops its cores and runes as usual.
- **Reborn** (level `rebornLevel`): a rebuilt copper golem keeps the oxidation stage and wax it had when it died, and every rebuilt golem gets Resistance with amplifier `rebornResistanceAmplifier`, Resistance II by default, for `rebornResistanceSeconds` seconds.

To rebuild a shattered golem, hold its Shattered Core in your main hand, sneak, and right-click a freshly built golem of the same body within 3 blocks. The golem is bound to you at once with everything the Shattered Core kept, at full health, and the Shattered Core is used up. A rebuilt golem that has to sleep because the server is at its limit of awake golems wakes at full health. A rebuild has no ritual, costs no tithe, pays no bind XP, and earns no first-bind challenge. It needs all of the following:

- The Shattered Core is yours.
- The golem is still shattered in your roster, and this is the Shattered Core it left behind.
- You have Golem Mending level `shatterLevel`.
- The golem is not bound already. A player built it; iron golems that no player built rebuild only when `allowBindingVillageGolems` is on. For `builderExclusiveSeconds` after a golem is built, only the player who built it can use it.
- You can bind that body: copper golems need Copper Frame and iron golems Iron Frame. The skill's `allowedCoresFrost`, `allowedCoresCopper`, or `allowedCoresIron` list allows every core the golem had.
- Region protection lets you interact with the golem.
- The chunk holds fewer than `maxBoundGolemsPerChunk` bound golems. Your golem cap is not checked again, because the shattered golem already counts toward it.

Shift-right-click a shattered golem in the Roster GUI to release it for good. Its Shattered Core then crumbles the next time you use it. A Shattered Core also crumbles when its golem is no longer shattered, for example because it was already rebuilt, and when it is not the exact Shattered Core the golem left behind.

| Level | Heal bonus | Unlocks |
|---|---|---|
| 1 | +20% | Copper ingots, snow blocks, and bone meal heal your golems and servants |
| 2 | +40% | Regeneration: 0.5 health every 5 s within 16 blocks of you |
| 3 | +60% | Regeneration: 1 health every 5 s while idle within 4 blocks of home |
| 4 | +80% | Shattered Core on death, rebuilt on a freshly built body |
| 5 | +100% | Reborn golems keep their copper state and get 10 s of Resistance II |

| Key | Code default | Behavior / units |
|-----|--------------|------------------|
| `healBonusByLevel` | `[0.2, 0.4, 0.6, 0.8, 1.0]` | Fraction added to every heal you give your golems and servants with items, from level 1 upward. 0.2 heals 20% more. An iron ingot repair of a bound iron golem gains this fraction of the vanilla 25. |
| `copperIngotHeal` | `4.0` | Health a copper ingot restores to your bound copper golem before the level bonus. Values below 0 load as 0. |
| `snowBlockHeal` | `2.0` | Health a snow block restores to your bound frost golem before the level bonus. Values below 0 load as 0. |
| `boneMealHeal` | `2.0` | Health bone meal restores to your TragOul skeletal servant before the level bonus. Values below 0 load as 0. |
| `ownerRegenLevel` | `2` | Level at which your awake golems regenerate while you are near them. |
| `ownerRegenAmount` | `0.5` | Health your golems regenerate every `regenIntervalSeconds` while they are within `ownerRegenRadius` blocks of you. Values below 0 load as 0. |
| `ownerRegenRadius` | `16.0` | Blocks from you, in the same world, within which your golems regenerate. Values below 0 load as 0. |
| `homeRegenLevel` | `3` | Level at which your idle golems regenerate at home. |
| `homeRegenAmount` | `1.0` | Health your golems regenerate every `regenIntervalSeconds` while they are idle, with no job and no target, within `homeRegenRadius` blocks of their home. When both regenerations apply, only the larger one heals. Values below 0 load as 0. |
| `homeRegenRadius` | `4.0` | Blocks from its home within which an idle golem regenerates. Values below 0 load as 0. |
| `regenIntervalSeconds` | `5` | Seconds between regeneration heals. Values below 1 load as 1. |
| `shatterLevel` | `4` | Level at which your bound golems leave a Shattered Core when they die while you are online. |
| `rebornLevel` | `5` | Level at which a golem rebuilt from its Shattered Core keeps its copper oxidation stage and wax and gains Resistance. |
| `rebornResistanceSeconds` | `10` | Seconds of Resistance a reborn golem gains. Values below 0 load as 0, which gives none. |
| `rebornResistanceAmplifier` | `1` | Amplifier of the Resistance a reborn golem gains. 0 is Resistance I and 1 is Resistance II. Values load between 0 and 255. |

## Animus Plinth

The Animus Plinth infuses runes and the Masterwork Heart. Build it from a lodestone with a pedestal block exactly two blocks north, east, south, and west of it, all at the same height. The pedestal blocks are the eight chiseled copper blocks, waxed or not, and `pedestalBlocks` in the skill configuration changes the list.

Loading and using a plinth needs Runic Augments level 1:

- Sneak and right-click a pedestal or the lodestone while holding an item to place one of it there. The item floats and turns above the block, and every player can see it.
- Sneak and right-click with an empty hand to take the item back.
- Region protection must let you open containers at the block.
- Right-clicking the lodestone with a compass in either hand still binds the compass.
- These clicks always work the plinth, even while you hold a node; nodes never attach to the blocks of a complete plinth.
- Breaking a pedestal or the lodestone, or moving it with a piston, drops the item on that block. Items on the other blocks stay where they are.

To start an infusion, place its center item on the lodestone and its four pedestal items on the pedestals, then right-click the lodestone with the Artificer's Crook. The pedestal items rise, streams of dust flow to the center, and the center item spins faster. When the ritual ends, the items and the essence levels are used up and the result pops out above the lodestone. Creative players pay no levels.

An infusion starts only when all of the following hold:

- An infusion recipe matches: the item on the lodestone matches its center, and the four pedestal items match its pedestals in any order.
- You have the recipe's unlocking adaptation at its level.
- Region protection lets you interact with and place blocks at the lodestone.
- You have the recipe's essence levels.

The ritual stops when you move more than 8 blocks from the lodestone, log out, or change worlds, when any block of the plinth breaks, or when an item is taken off or placed on the plinth. Nothing is used up when a ritual stops, and the items stay on the plinth.

### Infusion recipes

Each rune tier is infused from the tier below it.

| Tier | Center | Essence | Ritual | Unlocks at |
|---|---|---|---|---|
| 1 | Blank Rune | 2 levels | 100 ticks (5 s) | Runic Augments level 1 |
| 2 | Tier 1 rune of the same aspect | 5 levels | 160 ticks (8 s) | Runic Augments level 3 |
| 3 | Tier 2 rune of the same aspect | 10 levels | 240 ticks (12 s) | Runic Augments level 5 |

| Rune | Tier 1 pedestals | Tier 2 pedestals | Tier 3 pedestals |
|---|---|---|---|
| Swiftness | 2 `SUGAR`, 2 `FEATHER` | 2 `RABBIT_FOOT`, 2 `PHANTOM_MEMBRANE` | 4 `BREEZE_ROD` |
| Might | 2 `IRON_INGOT`, 2 `PISTON` | 2 `IRON_BLOCK`, 2 `STICKY_PISTON` | 2 `NETHERITE_SCRAP`, 2 `IRON_BLOCK` |
| Ember | 2 `BLAZE_POWDER`, 2 `COAL` | 2 `BLAZE_ROD`, 2 `MAGMA_CREAM` | 2 `GHAST_TEAR`, 2 `BLAZE_ROD` |
| Tide | 2 `PRISMARINE_SHARD`, 2 `KELP` | 2 `PRISMARINE_CRYSTALS`, 2 `NAUTILUS_SHELL` | 1 `HEART_OF_THE_SEA`, 3 `PRISMARINE_CRYSTALS` |
| Order | 2 `QUARTZ`, 2 `REDSTONE` | 2 `COMPARATOR`, 2 `QUARTZ_BLOCK` | 2 `ECHO_SHARD`, 2 `COMPARATOR` |
| Entropy | 2 `GUNPOWDER`, 2 `FERMENTED_SPIDER_EYE` | 2 `ENDER_EYE`, 2 `GUNPOWDER` | 2 `SHULKER_SHELL`, 2 `ENDER_EYE` |
| Bulwark | 2 `IRON_INGOT`, 2 `OBSIDIAN` | 2 `DIAMOND`, 2 `OBSIDIAN` | 1 `NETHERITE_INGOT`, 3 `CRYING_OBSIDIAN` |

The Masterwork Heart takes a `HEART_OF_THE_SEA` on the lodestone and a `DIAMOND_BLOCK`, `IRON_BLOCK`, `COPPER_BLOCK`, and `SNOW_BLOCK` on the pedestals. It costs 15 levels, takes 300 ticks (15 s), and unlocks at Masterwork level 1.

Infusions are the `infusionRecipes` tables in the skill configuration, one table per infusion named by its key, such as `[infusionRecipes.swiftness_1]`. Edit a table to change an infusion, set `enabled = false` to turn it off, or add a table to create a new infusion. Changes apply when the skill configuration reloads. Each table has these fields:

| Field | Meaning |
|---|---|
| `result` | The item made: `golemancy:rune/<aspect>/<tier>`, with aspect `swiftness`, `might`, `ember`, `tide`, `order`, `entropy`, or `bulwark` and tier 1 to 3, or `golemancy:masterwork_heart`. |
| `center` | The item on the lodestone: a material name such as `HEART_OF_THE_SEA`, or a Golemancy item such as `golemancy:blank_rune` or `golemancy:rune/tide/1`. |
| `pedestals` | Exactly four material names or Golemancy items, matched in any order. Repeat an entry to need it on more than one pedestal. |
| `essenceLevels` | Experience levels charged when the infusion completes. |
| `durationTicks` | Ticks the ritual takes, clamped to 20-6000. |
| `unlockAdaptation` | Id of the Golemancy adaptation that unlocks the infusion, such as `golem-runic-augments` or `golem-masterwork`. Its region protection rules apply to the ritual. |
| `unlockLevel` | Lowest level of `unlockAdaptation` that can perform the infusion, at least 1. |
| `enabled` | Set to `false` to turn the infusion off. |

A material name never matches a Golemancy item made from that material, so a Masterwork Heart or a rune does not count as a plain `HEART_OF_THE_SEA` or `DISC_FRAGMENT_5`. When two infusions match the same items, the one listed first runs. A table with an unknown name or a material that is not an item, a result that is not a rune or the Masterwork Heart, a pedestal list without exactly four entries, or an empty `unlockAdaptation` is skipped with a console warning.

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
| `repairXpPerHealth` | `2.0` | Skill XP per point of hostile damage repaired on an iron golem or healed on a bound golem with Golem Mending. |
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
| `deathDropCoreChance` | `0.5` | Chance that each core drops when a bound golem dies without leaving a Shattered Core. |
| `deathDropRuneChance` | `0.5` | Chance that each rune drops when a bound golem dies without leaving a Shattered Core. |
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
| `taskLeaseSeconds` | `20` | Seconds a golem keeps its claim on a node job without making progress before another golem may take it, clamped to 5-600. |
| `baseWorkRadius` | `24` | Blocks around its home within which a working golem takes node jobs, finds Deposit Nodes, and defends Guard Nodes, clamped to 4-128. |
| `stuckTimeoutSeconds` | `4` | Seconds a golem walking to a job or a container may go without getting half a block closer before it gives up and skips that job or container for 10 seconds, clamped to 1-60. |
| `stuckReleasesBeforePause` | `3` | Jobs or containers in a row a golem may give up because it got stuck before it rests for `stuckPauseSeconds`, clamped to 1-100. |
| `stuckPauseSeconds` | `15` | Seconds a trapped golem rests without looking for jobs or containers, clamped to 0-600. 0 never rests it. |
| `workXpHourlyCap` | `1200` | Most work XP one player can earn from their golems' finished jobs in any 60 minutes. Values below 0 count as 0. |
| `workXpOwnerRadius` | `96` | Blocks from a working golem within which its owner earns work XP. Owners farther away or in another world earn none. Values below 0 count as 0. |
| `challengeTasksReward` | `500` | Skill XP paid by the golem job challenges. |
| `challengeItemsMovedReward` | `500` | Skill XP paid by the golem item hauling challenges. |
| `pedestalBlocks` | the eight chiseled copper blocks | Blocks that work as Animus Plinth pedestals. Names that are not blocks, and `LODESTONE`, are ignored with one console warning each. |
| `infusionRecipes` | the infusions listed above | Infusions the Animus Plinth performs, one table per infusion. See Infusion recipes for the fields. |
| `infuseRuneTier1Xp` | `60` | Skill XP for each tier 1 rune infused. |
| `infuseRuneTier2Xp` | `180` | Skill XP for each tier 2 rune infused. |
| `infuseRuneTier3Xp` | `450` | Skill XP for each tier 3 rune infused. |
| `infuseMasterworkHeartXp` | `1500` | Skill XP for each Masterwork Heart infused. |
| `challengeInfusionsReward` | `500` | Skill XP paid by the infusion challenges. |

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
| `challenge_golemancy_tasks_1000` | 1000 | `challengeTasksReward` |
| `challenge_golemancy_tasks_25000` | 25000 | `challengeTasksReward` x 5 |
| `challenge_golemancy_items_moved_10000` | 10000 | `challengeItemsMovedReward` |
| `challenge_golemancy_items_moved_250000` | 250000 | `challengeItemsMovedReward` x 5 |
| `challenge_golemancy_infusions_10` | 10 | `challengeInfusionsReward` |
| `challenge_golemancy_infusions_100` | 100 | `challengeInfusionsReward` x 5 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
