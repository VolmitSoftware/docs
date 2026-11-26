---
title: "Mutations"
description: "Merge two skills into a mutated skill and learn its upgraded adaptations"
published: true
date: 2026-11-25T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-24T00:00:00.000Z
---
A mutation merges two of your skills into one mutated skill. The mutated skill replaces both parents, earns XP from both, and offers upgraded adaptations in place of their original adaptations. A player cannot undo a mutation; an admin can, or anyone in debug mode (see [Undoing a mutation](#undoing-a-mutation)).

## Requirements

- Both skills are at level 15 or higher.
- Neither skill is already part of a mutation. A skill can be in one mutation only.
- There is no limit on how many mutations you hold, unless the server sets `maxMutations` in `[mutations]`. With 24 skills, that is at most 12.
- Both skills are enabled and have adaptations on this server. Kinetics cannot be merged on Minecraft versions where it has no adaptations.

## Merging

Open a skill in the Adapt menu and press Mutate. With the client mod, the book opens a spread: the skill you came from on the left page, the partner on the right. Pick the partner from the skills on the right page; skills that cannot join show why when you point at them. The spread shows the new skill's name, level and knowledge, the upgrades, mutated adaptations, tools and kept adaptations each parent brings, and what each parent loses. Swap exchanges the lead and the partner. Press and hold Mutate for about 1.5 seconds to merge; letting go cancels. With the keyboard, focus Mutate and hold Enter or Space.

Without the client mod, the chest menu lists the partners and the preview in one menu. Pick a partner, check the preview and click Mutate twice. The same flow runs from `/adapt mutate`; with both skills given it merges at once.

The skill you pick first leads. The mutated skill takes the partner's adjective and the lead's noun, and the lead's icon and colour. Swords led with Stealth as partner becomes Silent Duelist.

When the merge goes through:

1. Every adaptation learned in either parent is unlearned, permanent ones included, and its knowledge goes back to that parent. The power it used is freed. The preview marks permanent adaptations so you can see they go too.
2. The parent with less XP gives the mutated skill its XP, level and knowledge. The other parent's XP and knowledge are dropped.
3. No level-up rewards are paid for the new level.

Money paid for adaptations through an economy plugin is not refunded.

## The mutated skill

- The mutated skill appears once in menus, in place of both parents.
- XP that either parent would earn goes to the mutated skill. When one action pays both parents at once, the mutated skill gets the larger award plus a quarter of the smaller one.
- Its per-skill XP allowance is 1.5 times a normal skill's.
- Original adaptations that an upgrade fuses work only through that upgrade; the others are kept (see Kept adaptations). The mutated skill offers six upgraded adaptations: the lead's three, then the partner's three. Each has 3 levels for 13, 13 and 16 knowledge and uses one power slot. Upgrades that hand you a craftable tool or deployable cost 15, 14 and 18 knowledge instead: Master Builder, Skyhook, Wrecking Hand, Pocket Realm, Earthshaker, Landshaper, Field Workshop, Harvest Moon, Leviathan, One Mind, Skyrunner, Omniscience, Forgemaster, Stormshot, Apex Predator, Tempest Flow and Master Distiller. After them come the five mutated adaptations described below.
- Recipes and custom potions that a fused original unlocks stay available while you hold the upgrade that fuses it.
- Upgrades pay skill XP only for natural blocks, natural mobs and attackers, at most 600 a minute each. Mutated adaptations' blocks pay no skill XP.
- Master level is unchanged by a merge.

## Kept adaptations

An original adaptation that none of its skill's upgrades fuses keeps working for you after the merge, at level 1, without being learned. That kept level costs no knowledge and uses no power slot. Items and blocks you made with it keep working, and its recipes stay craftable. When one of its recipes needs a higher level, it is kept at that level instead. Base Stealth concealment is kept at its top level for every Stealth mutation.

You can raise a kept adaptation above its kept level with the mutated skill's knowledge:

- Each level above the kept level costs that adaptation's normal price for the level. The kept level stays free. You can buy one level at a time or go straight to a chosen level, up to the adaptation's top level.
- Once raised, it uses one power slot like any learned adaptation. With no free slot the purchase is refused.
- Its requirements, permissions and platform support still apply.
- Lowering it refunds the levels you paid for in full, down to the kept level and never below it. Back at the kept level it frees its slot.
- It works at the level you raised it to everywhere, including its recipes.

An original that an upgrade fuses gets its level from that upgrade and cannot be raised.

The mutated skill's page lists what it keeps under Kept without learning, with the level of each; a raised one is marked. Open one to see its levels: the kept levels are marked as kept, and the levels above them use the same Learn and Unlearn controls as any adaptation. In the chest menu, the kept list opens the same level page.

Raised levels count as spent knowledge on the mutated skill in the knowledge breakdown, and the kept level shows as Kept. A power budget trim can drop a raised adaptation back to its kept level, as it drops any learned adaptation.

## Mutated adaptations

Each mutated skill also offers five mutated adaptations built from pieces its two parents bring. Every skill brings six pieces: a Trigger (something you do), a Fight Strike and a Work Strike (what happens to an enemy or to the world), a Boon (a short benefit), a Fuel (a cost you pay) and a State (a condition you can be in). Each skill's pieces are listed on its mutation blocks page in the table below.

| Adaptation | How it works | Levels and knowledge |
|---|---|---|
| Graft | When you do the lead's Trigger, the partner's Strike hits. | 5 levels: 9, 8, 11, 13, 16 |
| Echo | When you do the partner's Trigger, the lead's Strike hits. | 5 levels: 9, 8, 11, 13, 16 |
| Barter | A gesture spends the partner's Fuel to give you the lead's Boon. 6 s cooldown. | 3 levels: 6, 6, 7 |
| Attunement | While you are in the lead's State, you gain the partner's Boon every 20 s. | 3 levels: 13, 13, 16 |
| Convergence | When you do the lead's Trigger while in the partner's State, both the lead's and the partner's Strikes hit. 45 s cooldown. | 3 levels: 22, 21, 27 |

Each mutated adaptation uses one power slot. Graft and Echo cool down for 8 s at level 1, down to 4 s at the top level. A fight Trigger sets off a Fight Strike and a work Trigger a Work Strike. A Trigger that counts as either sets off the Fight Strike when a hostile mob is within 6 blocks and the Work Strike otherwise. Strikes that give items, XP, healing, repairs or growth do nothing when the action or target was farmed: spawner, bred or egg mobs, placed blocks and crops grown by bone meal or by Adapt. A Trigger never grants a Boon: Boons come only from Barter and Attunement. Extra blocks that a strike or an upgrade breaks for you never set off a Trigger. Some pairs have their own wording for a recipe; the adaptation's description in game always shows the version that applies.

### Barter gestures

Barter uses the first of these gestures that neither parent already uses for something else:

1. Sneak and swap hands
2. Double-tap sneak
3. Sneak and left-click the air
4. Sneak and scroll the hotbar

| Skill | Gestures it keeps for itself |
|---|---|
| Chronos | Sneak and swap hands; sneak and left-click the air |
| Crafting | Sneak and swap hands |
| Kinetics | Sneak and swap hands; double-tap sneak |
| Stealth | Sneak and swap hands; double-tap sneak |
| Seaborne | Double-tap sneak; sneak and left-click the air |
| Agility, Architect, Rift, Taming, Unarmed | Sneak and left-click the air |

All other skills keep none. The Barter description names the gesture for its pair. Barter does not fire while you hold a golem crook.

The Agility, Kinetics, Seaborne and Stealth Fuels also cost 2 hunger points, and Barter does not fire while you have less food than that. A Barter whose Fuel you cannot pay does nothing and does not start its cooldown.

### Signatures

Some pairs replace one of their five mutated adaptations with a signature: an effect made for that pair. A signature has its own name and description, costs what the adaptation it replaces costs, and uses one power slot. Its cooldown is listed on the adaptation. The mutation preview shows each adaptation's knowledge per level.

| Lead | Partner | Replaces | Signature |
|---|---|---|---|
| Swords | Stealth | Convergence | Unseen Blade: a sword critical hit on a creature that cannot see you stops it healing for 6 s (level 1) to 10 s (level 3), twice Witherblade's time, and bleeds it for 3 s at 0.6 to 1 damage every 5 ticks. If it dies within 3 s, you turn invisible for 2 s and mobs within 16 blocks lose you, unless another mob there is hunting you. Needs Witherblade enabled and follows its target choice. 20 s cooldown. |
| Axes | Herbalism | Convergence | Forest Keeper: every natural tree Timberfall fells replants itself from a sapling you carry, and up to 4 saplings within 6 blocks of the stump (level 1) to 24 within 12 blocks (level 3) grow one stage. That growth counts as forced, and a tree of placed logs grows nothing. Only trees Timberfall itself fells count, and the search reads at most 2048 blocks around the stump. No cooldown. Either skill may lead. |
| Axes | Architect | Convergence | Timber Frame: logs a Timberfall swing fells drop stripped, up to 32 per tree at level 1 and 160 at level 3. From level 2 the Felled logs choice cuts them into planks at 4 per log instead. No cooldown. Either skill may lead. |
| Unarmed | Blocking | Convergence | Iron Guard: right-click a block or mob with both hands empty just before a hit to parry it without a shield. The hit is negated, 50% of it goes back to the attacker (melee) or rides the returned projectile, the attacker is slowed and weakened for 1 s (level 1) to 2 s (level 3), and your next bare-hand hit within 3 s deals 25% to 55% more. The parry window is half of Mirror Guard's: 175 ms at level 1 up to 275 ms at level 3. 3 s cooldown at level 1 down to 2 s at level 3. Either skill may lead. |
| Unarmed | TragOul | Convergence | Blood Knuckles: each bare-hand hit of a streak (up to 8 stacks, 3 s between hits) heals 0.2 health per stack at level 1 up to 0.4 at level 3, at most 5 to 9 health a second, the same cap as Crimson Tide. Unbroken Combo's finisher heals you for half the damage it dealt. Only hostile mobs and players feed the siphon. 8 s cooldown on the finisher heal. Spawner, egg, bred and other farmed mobs heal nothing. Either skill may lead. |
| Ranged | Agility | Convergence | Air Draw: while you draw a bow in the air your fall slows, for up to 2 s per airtime at level 1 and 4 s at level 3; drawing again before you land does not refill it. An arrow loosed in the air after at least half a draw flies as if fully drawn and crits, and the first arrow hit while you are still airborne refills Skyrunner's charges, once per airtime. No cooldown. Either skill may lead. |
| Ranged | Hunter | Convergence | Called Shot: the nearest natural creature of the kind your Tracker's Compass follows glows for you alone within 96 blocks (level 1) to 128 blocks (level 3). Draw a bow at it within 12° of your aim and 40 to 64 blocks, and the arrow seeks it the way Trueflight's does. Spawner, egg and bred mobs, named mobs, bosses and pets never glow. No cooldown. Either skill may lead. |
| Blocking | Taming | Convergence | Shieldbearer's Pack: your own pets behind your raised shield, or behind your Planted Bulwark, take no damage from shots coming from the front, and heal 0.5 health a second at level 1 up to 1.5 at level 3. The cover reaches 3 blocks back at level 1 and 6 at level 3. No cooldown. Either skill may lead. |
| Stealth | Swords | Convergence | Shadow Riposte: while you sneak and no mob within 16 blocks other than the attacker targets you, a melee hit you take is 50% (level 1) to 70% (level 3) parried and a free Shadow Step at your Phantom Decoy level puts you behind the attacker, with your next hit on it a Death Mark opening. It needs Phantom Decoy, Shadow Step ready and a safe spot behind the attacker, and starts Shadow Step's cooldown; a hit another plugin cancels neither steps nor costs a cooldown. 15 s cooldown. |
| Stealth | Rift | Convergence | Void Step: within 3 s (level 1) to 5 s (level 3) of a blink, right-click a creature that cannot see you with an empty hand to Shadow Step behind it without a Smoke Pellet, at your Phantom Decoy level's range, with your next hit on it a Death Mark opening. It shares Shadow Step's one cooldown, so a pellet step and a Void Step never chain. While no mob within 16 blocks hunts you, your Phase Step blinks leave no particles or blink sound. Either skill may lead. |
| Hunter | Taming | Convergence | Pack Hunt: up to 2 pets (level 1) to 4 (level 3) take up your Stalker's Trail blood trail, or the nearest creature of your Tracker's Compass kind within 16 to 32 blocks, on their own. Pets chasing the quarry are called back past 32 blocks from you. With Apex Predator, their bites on that quarry build and use its ramp. Pets, named mobs and spawner, egg or bred mobs are never hunted. 5 s cooldown between quarries. Either skill may lead. |
| TragOul | Nether | Convergence | Wither Blood: a kill gives Wither I for 4 s (level 1) to 8 s (level 3) to up to 4 to 8 hostiles within 4 to 6 blocks of the corpse, and a wither skeleton kill stores 2 to 4 hearts of blood in Crimson Tide's reservoir (nothing without Crimson Tide). Wither skeletons and the Wither are skipped. Farmed kills do nothing. 6 s cooldown at level 1 down to 3 s at level 3. Either skill may lead. |
| TragOul | Golemancy | Convergence | Bone Legion: hand a golem core to one of your skeletal servants and it works as a bone golem with that core, no ritual needed. Its 30 s (level 1) to 60 s (level 3) lifetime only runs while it is idle; then it crumbles and drops the core. Up to 1 to 3 servants work as legionnaires, and they still count toward your servant cap. A sneaking click is left to Animus Binding. Losing the signature releases them. No cooldown. Either skill may lead. |
| Agility | Kinetics | Convergence | Momentum Bank: the movement speed above sprinting you carry when a run ends or you sprint-jump is banked for 6 s. When a mace smash releases Comet's shockwave while speed is banked, the banked speed grows that wave, by up to 30% at level 1 and 50% at level 3, and you keep the speed for 2 s to 5 s after landing. The landing does not also set off the Kinetics Trigger. Needs at least 10% banked speed. 8 s cooldown at level 1 down to 4 s at level 3. Not on Minecraft 1.20.1. Either skill may lead. |
| Rift | Herbalism | Convergence | Chorus Orchard: each mature crop you harvest, by hand or in a Harvest Moon sweep, grows up to 1 (level 1) to 3 (level 3) chorus flowers within 3 to 5 blocks one step upward, recorded as forced growth; crops grown by bone meal or Adapt grow nothing. Chorus fruit sends you to the spot you look at within 8 to 16 blocks instead of a random one, only onto a safe landing. The aimed landing and the growth each have their own 1 s cooldown. |
| Rift | Discovery | Convergence | Waystones: right-click a structure in your Atlas to make it a waystone, a Rift Anchor without a block. It counts against your Pocket Realm anchor cap, up to 1 (level 1) to 3 (level 3) waystones, and you travel to it from the anchor menu like any anchor: same channel, one plain ender pearl, other dimensions only from the cross-dimension level, landing on the nearest safe stand in the structure's column, or on top of it. Travel needs the signature. Remove it from the Atlas or the anchor menu. Needs Omniscience and Pocket Realm. Either skill may lead. |
| Chronos | Swords | Convergence | Echo Strike: every third sword hit strikes again 1 s later as an after-image, for 35% of that hit's damage at level 1 up to 50% at level 3. The echo cannot crit or set off other effects. No cooldown. Sweep hits do not count. Either skill may lead. |
| Chronos | Ranged | Convergence | Replayed Shot: a fully drawn bow shot fires again 1.5 s later from where it left, on the same path, without using an arrow, for 60% of its base damage at level 1 up to 100% at level 3; a spectral shot replays as a spectral arrow. The replay has no shooter: it sets off no Ranged effects, pays no XP, cannot be picked up, and never hits you or anything you may not hurt. 8 s cooldown. Either skill may lead. |
| Chronos | Rift | Convergence | Recall the Blink: within 3 s (level 1) to 5 s (level 3) of a pearl, chorus fruit or blink, sneak and swap hands with a clock to go back to where you left, with at least the health you had there. Refused in another world or where you cannot enter. 30 s cooldown. Either skill may lead. |
| Chronos | Herbalism | Convergence | Season Turn: once per in-game day, sneak and swap hands with a clock to age every crop within 8 blocks (level 1) to 16 blocks (level 3) one stage, 32 crops per tick. The growth counts as bone meal and only reaches crops you may use. A gesture that finds no crops waits 2 s before the next search. Either skill may lead. |
| Chronos | Architect | Convergence | Long Undo: sneak and swap hands with a clock to undo your newest chalk fill, stamp, wand face or replace up to 10, 20 or 40 minutes back by level, ten times Wrecking Hand's window. Each block still standing returns exactly what it cost. For 10 minutes after, Time Lord's restoration within its radius of the undone build places it back once, paid again from your inventory. Either skill may lead. |
| Chronos | Brewing | Convergence | Paused Potions: sneak and swap hands with a clock to take your beneficial potion effects off you with their time left; swap again, or wait out the longest pause (20 s at level 1 up to 60 s at level 3), to get them back. Infinite, beacon and effects under 5 s stay. Paused effects do not apply and are not lengthened again when they return. Either skill may lead. |
| Chronos | Taming | Convergence | Rewound Companion: a pet that would die rewinds 4 s instead, to where it stood and the health it had. Each pet rewinds once per 10 minutes at level 1 down to 5 at level 3. No other cooldown. Either skill may lead. |
| Chronos | Golemancy | Convergence | Overclock: sneak and swap hands with a clock to run your golems within 16 blocks at triple speed for 10 s (level 1) to 20 s (level 3), paid with 60 s of chrono bottle time. 3 minute cooldown. Either skill may lead. |
| Pickaxes | Excavation | Convergence | Mixed Face: after Earthshaker bores or Landshaper digs, the rest of the 3 by 3 face breaks, stone with the pickaxe from your hotbar and soft ground with the shovel, stone first, then soft ground, 8 blocks a tick, each tool losing 1 durability per block it breaks; it stops when the tool is put away. Level 2 reaches one face deeper and level 3 two. Placed blocks are never broken, and a placed block as the first one sets nothing off. No cooldown. Either skill may lead. |
| Pickaxes | Architect | Convergence | Tunnel Builder: while Earthshaker bores a level tunnel, natural stone around the bore is broken and replaced with your off-hand block, the floor at level 1, the walls too from level 2 and the ceiling at level 3, and a torch from your inventory goes down every 8 blocks. Every block is a real break with the pickaxe and a paid placement; lining stops when the pickaxe is switched away. No cooldown. Either skill may lead. |
| Excavation | Architect | Convergence | Foundation Pour: left-click with Grading Stakes while a chalk guide is in your off hand or hotbar and a block in your off hand. Soft ground along the guide's line or circle is dug with the shovel from your hotbar and every cell is filled with the off-hand block, 1 block deep at level 1 down to 3 at level 3, at most 64 to 320 blocks per pour, paid like a chalk fill. Digging stops without the shovel in hand, and the click that pours breaks nothing. No cooldown. Either skill may lead. |
| Herbalism | Rift | Convergence | Rift Harvest: the produce of each Harvest Moon sweep goes, before it drops, to the containers beside your chosen Rift Anchor, 4 stacks (level 1) to 16 stacks (level 3) a sweep. Sneak and right-click one of your anchors with a hoe to choose it, again to go back to the ender chest. Delivery costs what a send between anchors costs (one plain ender pearl per 4 stacks) and keeps the anchor's reach; without pearls, Pocket Realm or room it falls back to your ender chest. Seeds and produce you already carried stay with you. |
| Herbalism | Taming | Convergence | Shepherd's Field: harvesting a crop that grew on its own feeds your pets and animals you fed within Wildgrowth's radius (needs Wildgrowth), up to 3 to 8 of them, one item of their own food from your inventory each. Each heals 4 to 8 health and grazes in place for 20 to 45 s without trampling farmland. Bone-mealed crops feed nothing, nothing is fed while bone meal tracking is off, and nothing breeds from it. 45 s cooldown. Either skill may lead. |
| Architect | Crafting | Convergence | Cutting on the Fly: when a chalk fill or Mason's Template build runs short of a shape, more is cut from the base blocks you carry by the server's stonecutter or crafting recipe at its exact yield, only while the build runs, stopping when your inventory is full, at most 64 pieces per build at level 1 and 512 at level 3. At level 3 base blocks also come from carried bundles, backpacks and shulker boxes. No cooldown. |
| Crafting | Architect | Convergence | Prefab Crate: a Mason's Template and a chest craft into a crate that takes every block the copy needs from your inventory when you take it out of the result slot, 216 blocks per crate at level 1 up to 2744 at level 3. Right-click a spot to see the build, left-click to turn it, right-click again to unfold it there at 4 to 16 blocks a tick, paid only from the crate. Blocks that could not be placed come back with the template. No cooldown. |
| Crafting | Enchanting | Convergence | Runed Reforge: craft a Runed Book (book, lapis lazuli, amethyst shard). With it in your main hand and Masterwork gear in your off hand, right-click to press the gear's Masterwork bonus into the book (other durability raises stay on the gear); the gear keeps its enchantments and durability left, and can never reforge a new bonus. Right-click with the full book and gear that has no bonus to set it there, scaled to that gear's durability. The book keeps 70% (level 1) to 100% (level 3) of the bonus, and the Masterwork Edge moves from level 2 (lost below it). One bonus per item; book and gear change in the same tick, so a bonus never exists twice. Reforging already keeps enchantments. Either skill may lead. |
| Brewing | Nether | Convergence | Soulfire Distillery: your brewing stands standing on soul fire, a lit soul campfire or lava (or one block above lava) brew Strength, Fire Resistance, Speed and Regeneration one level higher, up to III, for two thirds of the duration, keeping their base effects. Each potion is raised once. 1 potion of each brew at level 1, 2 at level 2, 3 at level 3. 45 s cooldown. |
| Discovery | Enchanting | Convergence | Lorekeeper: the first time you open a structure chest and its loot rolls, one enchanted book from the roll has 1 (level 1), 2 (level 2) or 4 (level 3) of its enchantments raised one level, never past the vanilla maximum. Chests a player placed raise nothing. Either skill may lead. |
| Taming | Golemancy | Convergence | Pack of Iron: your golems count as pets. With Alpha, golems inside its aura get 15% to 35% more damage and health and the aura's speed and regeneration. With Blood Bond, 10% to 20% of each blow, shot or blast that lands after armour, never more than Blood Bond's share, moves to up to 2 golems within its radius above a quarter of their health. With One Mind, the Beastmaster's Whistle sends golems within 16 to 32 blocks at what you point at for 15 s, then they go back to work; sneaking recalls them to you. 2 s cooldown on whistle commands. |
| Golemancy | Architect | Convergence | Builder Golem: preview a Mason's Template stamp, then right-click one of your golems with the template. It lays the stamp from your nearest Deposit Node within 16 blocks of it, 1 block a second at level 1 up to 4 at level 3, at most 216 to 2744 blocks, protection-checked as you, paid from the node found at each block, and stops when the node is gone or you move more than 32 blocks away. 45 s cooldown. Either skill may lead. |
| Golemancy | Taming | Convergence | Kennel Core: your Rancher golems become keepers. Every 20 s (level 1) to 10 s (level 3) each heals up to 6 to 16 of your pets and the animals you fed or bred within 10 to 18 blocks of its home by 3 to 6 health, never another player's, and walks animals it keeps back home when they stray up to 16 blocks past that. Breeding stays the Rancher's own, to its keep cap and with food from its deposit nodes. |
| Seaborne | Nether | Convergence | Steam Walker: step onto lava while wet, or within 4 s of leaving water or rain, and the lava under your feet cools to obsidian (flowing lava to cobblestone) in a 3 by 3 (5 by 5 from level 2) for 3 s, for a walk of 6 s (level 1) to 12 s (level 3). Cooled blocks cannot be broken, pushed or blown up, drop nothing and melt back to the same lava. Water buckets empty in the Nether for you; each pool stays one still block that never spreads or hardens lava, evaporates after 30 s (also after a restart), and you keep 1 to 3 at once. 45 s cooldown on the walk. Either skill may lead. |
| Seaborne | Herbalism | Convergence | Kelp Garden: while you swim, 3 (level 1) to 8 (level 3) spots within 4 to 8 blocks are tended each second: kelp grows a block, sea pickles waterlogged on living coral add a pickle, and live coral fans spread a fan. Each growth costs hunger as Wildgrowth does, follows the growth blacklist and protection, and counts as bone meal. Your Tide Shrines within 48 blocks count as fields: the same tending runs around each of them, swimming or not. A hoe on kelp or sea pickles harvests the sea bed within 3 to 6 blocks, leaving each kelp root and one pickle; it never also sets off Harvest Moon or Replant. 3 s cooldown on the harvest. Either skill may lead. |
| Nether | Brewing | Graft | Brimstone Flask: your thrown splash potions leave a ring of harmless soul fire for 4 s, 2 blocks wide at level 1 up to 3.5 at level 5. Everything that steps in gets the potion's effects once more, for 50% to 100% of their duration; harmful effects skip you and anything you may not hurt. One ring at a time, and the splash it uses does not also fire the Brewing Trigger. Graft's cooldown, 8 s down to 4 s. |

### Overcharge

An upgrade with an overcharge can spend the Fuel of the other skill in your mutation when its effect fires, for a stronger effect: half again by default (`overchargeStrength`). If you cannot pay the Fuel, the effect runs at its normal strength and nothing is spent. Each such upgrade has an Overcharge switch in its personal controls and shows the overcharge on its stat lines.

| Upgrade | What grows |
|---|---|
| Witherblade | Wither and no-healing duration |
| Master Builder | Blocks one chalk fill lays |
| Skyhook | Stamps one template repeat lays along a guide |
| Wrecking Hand | Blocks one replace swaps |

### Tools and build batches

Tool upgrades hand out craftable items. A tool works only while you hold its upgrade at the level it needs; for anyone else it does nothing, and it can never be placed, eaten, enchanted, smelted, traded or crafted into anything but its own recipes. Its recipe is craftable only by players who can use it, and it joins your recipe book when you learn that upgrade. The mutated skill's page lists its tools under Tools; each one names the upgrade and level that unlock it and shows its recipe. Without the client mod, the upgrade's item in the skill menu names its tools.

Tools that place or break many blocks do it a few blocks per tick. Each placed block costs one real item from your hand, then your inventory, passes protection, is logged by block-logging plugins and counts as player-placed. Each broken block is a normal break with your held tool. All players together place or break at most `buildBlocksPerTick` blocks a tick. Where a tool offers undo, it gives back exactly the item each block cost, and only for blocks that are still the type that was placed; undo history survives restarts.

## Upgraded adaptations

| Skill | Upgrades | Mutation blocks |
|---|---|---|
| Agility | [Agility upgrades](/adapt/upgrades/agility) | [Agility blocks](/adapt/mutation-blocks/agility) |
| Architect | [Architect upgrades](/adapt/upgrades/architect) | [Architect blocks](/adapt/mutation-blocks/architect) |
| Axes | [Axes upgrades](/adapt/upgrades/axes) | [Axes blocks](/adapt/mutation-blocks/axes) |
| Blocking | [Blocking upgrades](/adapt/upgrades/blocking) | [Blocking blocks](/adapt/mutation-blocks/blocking) |
| Brewing | [Brewing upgrades](/adapt/upgrades/brewing) | [Brewing blocks](/adapt/mutation-blocks/brewing) |
| Chronos | [Chronos upgrades](/adapt/upgrades/chronos) | [Chronos blocks](/adapt/mutation-blocks/chronos) |
| Crafting | [Crafting upgrades](/adapt/upgrades/crafting) | [Crafting blocks](/adapt/mutation-blocks/crafting) |
| Discovery | [Discovery upgrades](/adapt/upgrades/discovery) | [Discovery blocks](/adapt/mutation-blocks/discovery) |
| Enchanting | [Enchanting upgrades](/adapt/upgrades/enchanting) | [Enchanting blocks](/adapt/mutation-blocks/enchanting) |
| Excavation | [Excavation upgrades](/adapt/upgrades/excavation) | [Excavation blocks](/adapt/mutation-blocks/excavation) |
| Golemancy | [Golemancy upgrades](/adapt/upgrades/golemancy) | [Golemancy blocks](/adapt/mutation-blocks/golemancy) |
| Herbalism | [Herbalism upgrades](/adapt/upgrades/herbalism) | [Herbalism blocks](/adapt/mutation-blocks/herbalism) |
| Hunter | [Hunter upgrades](/adapt/upgrades/hunter) | [Hunter blocks](/adapt/mutation-blocks/hunter) |
| Kinetics | [Kinetics upgrades](/adapt/upgrades/kinetics) | [Kinetics blocks](/adapt/mutation-blocks/kinetics) |
| Nether | [Nether upgrades](/adapt/upgrades/nether) | [Nether blocks](/adapt/mutation-blocks/nether) |
| Pickaxes | [Pickaxes upgrades](/adapt/upgrades/pickaxe) | [Pickaxes blocks](/adapt/mutation-blocks/pickaxe) |
| Ranged | [Ranged upgrades](/adapt/upgrades/ranged) | [Ranged blocks](/adapt/mutation-blocks/ranged) |
| Rift | [Rift upgrades](/adapt/upgrades/rift) | [Rift blocks](/adapt/mutation-blocks/rift) |
| Seaborne | [Seaborne upgrades](/adapt/upgrades/seaborne) | [Seaborne blocks](/adapt/mutation-blocks/seaborne) |
| Stealth | [Stealth upgrades](/adapt/upgrades/stealth) | [Stealth blocks](/adapt/mutation-blocks/stealth) |
| Swords | [Swords upgrades](/adapt/upgrades/swords) | [Swords blocks](/adapt/mutation-blocks/swords) |
| Taming | [Taming upgrades](/adapt/upgrades/taming) | [Taming blocks](/adapt/mutation-blocks/taming) |
| TragOul | [TragOul upgrades](/adapt/upgrades/tragoul) | [TragOul blocks](/adapt/mutation-blocks/tragoul) |
| Unarmed | [Unarmed upgrades](/adapt/upgrades/unarmed) | [Unarmed blocks](/adapt/mutation-blocks/unarmed) |
{.dense}

## Commands and permissions

| Command | Permission | Purpose |
|---|---|---|
| `/adapt mutate [lead] [partner]` | `adapt.mutate`, default everyone | Merge two of your skills. Missing skills open the pickers |
| `/adapt unmutate <player> <skill>` | `adapt.mutate.reset`, default `op` | Remove one of a player's mutations. `skill` is the mutated skill, its lead or its partner; tab completion lists the player's mutations |
| `/adapt mutation-reset [player]` | `adapt.mutate.reset`, default `op` | Remove every mutation of a player, each as `unmutate` does |

## Undoing a mutation

Players cannot undo their own mutations. An admin with `adapt.mutate.reset` can, by command. A player in debug mode (`/adapt debug mode`) also gets an Unmutate control on a mutated skill's page: a press and hold in the client book, or a button that asks for a second click in the chest menu.

Undoing a mutation:

- Unlearns every adaptation on the mutated skill (upgrades, mutated adaptations, signatures and the levels you raised kept adaptations to) and returns the knowledge each one cost, which frees its power slot.
- Brings both parent skills back at the mutated skill's XP and level. For mutations made with this version or later, each parent comes back at the XP it had when it merged if that was more.
- Splits the mutated skill's knowledge, refunds included, evenly between the two parents; an odd point goes to the lead. No knowledge is created or lost.
- Pays no level-up rewards, master XP or level-up notices.
- Keeps your settings for kept originals and adaptations.

Mutation tools you already crafted stay in your inventory but do nothing, as for any player without the upgrade. Placed scarecrows, shrines, anchors and waystones stay in the world and go idle while you do not hold their upgrade; breaking one gives its tool back as usual, and they work again if you learn the upgrade again.

The two skills can be mutated again afterwards, with either one leading.

## Configuration

The `[mutations]` table in the main config sets the level requirement, the master levels for extra slots, the shared-action share, the allowance multiplier, the recipe cooldowns, the Attunement interval, the hostile radius, the double-tap window, the upgrade XP cap, the overcharge strength and the build batch cap. Keys and defaults: [Progression math](/adapt/05-configuration-math). Each upgrade's own settings live in `adaptations/<upgrade-id>.toml`, listed on its skill's upgrade page.

## See also

Rules: [Concepts](/adapt/02-concepts). Catalog: [Skills](/adapt/10-skills-catalog).
