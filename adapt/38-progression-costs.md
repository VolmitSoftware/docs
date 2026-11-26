---
title: "Progression and costs"
description: "Adaptation prices, knowledge per level, power, and time-to-level estimates"
published: true
date: 2026-11-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-23T00:00:00.000Z
---
Skill XP raises skill levels. Skill levels pay knowledge, which buys adaptation levels. Every skill level also adds master XP, and master levels set how many adaptations a player can hold at once. All values below are the defaults.

<!-- generated from the live registry: begin -->

## Cost tiers

Every adaptation belongs to one of five tiers. The tier sets its knowledge price per level.

| Tier | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 | Levels 1-5 total | Single-level adaptation |
|---|---|---|---|---|---|---|---|
| Minor | 2 | 2 | 2 | 3 | 3 | 12 | 3 |
| Utility | 4 | 4 | 5 | 6 | 7 | 26 | 6 |
| Core | 6 | 6 | 8 | 10 | 12 | 42 | 10 |
| Strong | 11 | 11 | 14 | 17 | 20 | 73 | 16 |
| Keystone | 17 | 16 | 21 | 26 | 31 | 111 | 24 |

## Knowledge and XP by skill level

| Skill level | Knowledge for reaching it | Knowledge earned in total | Total skill XP needed |
|---|---|---|---|
| 1 | 0 | 0 | 1,300 |
| 2 | 3 | 3 | 2,800 |
| 3 | 3 | 6 | 4,500 |
| 4 | 3 | 9 | 6,400 |
| 5 | 3 | 12 | 8,500 |
| 6 | 2 | 14 | 10,800 |
| 7 | 2 | 16 | 13,300 |
| 8 | 2 | 18 | 16,000 |
| 9 | 2 | 20 | 18,900 |
| 10 | 2 | 22 | 22,000 |
| 15 | 2 | 32 | 40,500 |
| 20 | 2 | 42 | 64,000 |
| 25 | 2 | 52 | 92,500 |
| 30 | 2 | 62 | 126,000 |
| 40 | 3 | 92 | 208,000 |
| 50 | 3 | 122 | 310,000 |

## Power

Power limits how many adaptations a player holds at once. Every learned adaptation uses 1 power, whatever its level; raising a held adaptation further costs knowledge only. Maximum power is 1.6 times the square root of the master level, rounded down. Every skill level a player reaches adds 489 master XP plus 44 for each level that skill had before. Master levels use the same XP curve as skills.

| Master level | Total master XP needed | Adaptations held at most |
|---|---|---|
| 1 | 1,300 | 1 |
| 3 | 4,500 | 2 |
| 6 | 10,800 | 3 |
| 10 | 22,000 | 5 |
| 15 | 40,500 | 6 |
| 25 | 92,500 | 8 |
| 40 | 208,000 | 10 |
| 60 | 432,000 | 12 |
| 100 | 1,120,000 | 16 |

## How long milestones take

Estimates only, simulated hour by hour with the default XP curve, knowledge, and power rules. The same rows are in [progression-times.csv](/adapt-assets/progression-times.csv).

### Assumptions

| Player | Skill XP per hour | Split across skills | Main skill |
|---|---|---|---|
| Ordinary | 4,500 | 30% / 25% / 15% / 10% / 10% / 10% | the 30% skill |
| Focused | 7,000 | 70% / 10% / 10% / 10% | the 70% skill |

Each skill level reached adds 489 master XP plus 44 for each level the skill had before. Knowledge counts only the main skill.

### Adaptations held

| Milestone | Ordinary | Focused |
|---|---|---|
| 1 adaptation | 1 h | 1 h |
| 2 adaptations | 3 h | 2 h |
| 3 adaptations | 5 h | 3 h |
| 4 adaptations | 10 h | 6 h |
| 5 adaptations | 16 h | 12 h |
| 6 adaptations | 29 h | 19 h |
| 8 adaptations | 74 h | 51 h |
| 10 adaptations | 169 h | 115 h |
| 12 adaptations | 340 h | 225 h |

### Knowledge in the main skill

| Milestone | Ordinary | Focused |
|---|---|---|
| First level of a Minor adaptation (2 knowledge) | 3 h (main skill level 2) | 1 h (main skill level 3) |
| First level of a Utility adaptation (4 knowledge) | 4 h (main skill level 3) | 1 h (main skill level 3) |
| First level of a Core adaptation (6 knowledge) | 4 h (main skill level 3) | 1 h (main skill level 3) |
| First level of a Strong adaptation (11 knowledge) | 7 h (main skill level 5) | 2 h (main skill level 5) |
| First level of a Keystone adaptation (17 knowledge) | 12 h (main skill level 8) | 4 h (main skill level 9) |
| A Core adaptation at level 5 (42 knowledge) | 48 h (main skill level 20) | 14 h (main skill level 20) |
| A Strong adaptation at level 5 (73 knowledge) | 116 h (main skill level 34) | 32 h (main skill level 34) |
| A Keystone adaptation at level 5 (111 knowledge) | 206 h (main skill level 47) | 57 h (main skill level 47) |
| Three Core adaptations at level 5 (126 knowledge) | 247 h (main skill level 52) | 68 h (main skill level 52) |

### Snapshot

| After | Ordinary | Focused |
|---|---|---|
| 7 h | skills 5 / 4 / 3 / 2 / 2 / 2; master level 5; 3 adaptations; 12 knowledge | skills 13 / 3 / 3 / 3; master level 7; 4 adaptations; 28 knowledge |
| 20 h | skills 11 / 10 / 7 / 5 / 5 / 5; master level 11; 5 adaptations; 24 knowledge | skills 25 / 7 / 7 / 7; master level 14; 6 adaptations; 52 knowledge |
| 50 h | skills 20 / 18 / 13 / 10 / 10 / 10; master level 20; 7 adaptations; 42 knowledge | skills 43 / 13 / 13 / 13; master level 24; 7 adaptations; 101 knowledge |
| 100 h | skills 31 / 28 / 20 / 16 / 16 / 16; master level 29; 8 adaptations; 65 knowledge | skills 64 / 21 / 21 / 21; master level 36; 9 adaptations; 164 knowledge |
| 200 h | skills 46 / 41 / 31 / 24 / 24 / 24; master level 42; 10 adaptations; 110 knowledge | skills 93 / 31 / 31 / 31; master level 52; 11 adaptations; 251 knowledge |
| 500 h | skills 76 / 69 / 52 / 41 / 41 / 41; master level 68; 13 adaptations; 200 knowledge | skills 150 / 53 / 53 / 53; master level 85; 14 adaptations; 422 knowledge |

## Estimated time to level one skill

Estimates only. Each row assumes every hour is spent on that skill's activity as shown, with the default configuration, before repeat-location decay, farm limits, XP boosts, and multipliers.

| Skill | Assumed hour | XP per hour (ordinary / focused) | Level 5 (ordinary / focused) | Level 10 (ordinary / focused) | Level 25 (ordinary / focused) | Level 50 (ordinary / focused) |
|---|---|---|---|---|---|---|
| Agility | Ordinary: 2,000 blocks on foot, a quarter sprinting. Focused: sprinting all hour. | 1,200 / 6,500 | 7.1 h / 1.3 h | 18 h / 3.4 h | 77 h / 14 h | 258 h / 48 h |
| Architect | Ordinary: 200 blocks placed. Focused: 1,300 blocks placed. | 900 / 6,000 | 9.4 h / 1.4 h | 24 h / 3.7 h | 103 h / 15 h | 344 h / 52 h |
| Axes | Ordinary: 60 logs and 20 axe hits. Focused: 600 logs. | 1,300 / 3,600 | 6.5 h / 2.4 h | 17 h / 6.1 h | 71 h / 26 h | 238 h / 86 h |
| Blocking | Ordinary: 30 hits blocked. Focused: 200 hits blocked in a fight. | 900 / 6,000 | 9.4 h / 1.4 h | 24 h / 3.7 h | 103 h / 15 h | 344 h / 52 h |
| Brewing | Ordinary: 5 potions used. Focused: 40 potions used. | 500 / 4,000 | 17 h / 2.1 h | 44 h / 5.5 h | 185 h / 23 h | 620 h / 78 h |
| Chronos | Ordinary: Moving most of the hour. Focused: the same with a clock in the off hand. | 3,000 / 15,000 | 2.8 h / 34 min | 7.3 h / 1.5 h | 31 h / 6.2 h | 103 h / 21 h |
| Crafting | Ordinary: 30 crafts. Focused: 400 crafts of mid-value items. | 300 / 4,000 | 28 h / 2.1 h | 73 h / 5.5 h | 308 h / 23 h | 1,033 h / 78 h |
| Discovery | Ordinary: 150 new chunks, 3 untouched chests, 20 new things. Focused: 1,500 chunks, 15 chests, 60 new things. | 900 / 5,000 | 9.4 h / 1.7 h | 24 h / 4.4 h | 103 h / 19 h | 344 h / 62 h |
| Enchanting | Ordinary: 2 table enchants. Focused: 40 table enchants. | 300 / 6,000 | 28 h / 1.4 h | 73 h / 3.7 h | 308 h / 15 h | 1,033 h / 52 h |
| Excavation | Ordinary: 200 blocks dug. Focused: 2,500 blocks dug. | 400 / 5,000 | 21 h / 1.7 h | 55 h / 4.4 h | 231 h / 19 h | 775 h / 62 h |
| Golemancy | Ordinary: One golem working. Focused: several golems building, binding, and working. | 500 / 3,000 | 17 h / 2.8 h | 44 h / 7.3 h | 185 h / 31 h | 620 h / 103 h |
| Herbalism | Ordinary: 40 mature crops and 10 meals. Focused: 250 mature crops. | 1,700 / 8,750 | 5.0 h / 58 min | 13 h / 2.5 h | 54 h / 11 h | 182 h / 35 h |
| Hunter | Ordinary: 15 natural mob kills. Focused: 80 natural mob kills. | 1,650 / 8,800 | 5.2 h / 58 min | 13 h / 2.5 h | 56 h / 11 h | 188 h / 35 h |
| Kinetics | Ordinary: A few falls and knockbacks. Focused: mace or spear combat. | 300 / 3,500 | 28 h / 2.4 h | 73 h / 6.3 h | 308 h / 26 h | 1,033 h / 89 h |
| Nether | Ordinary: 5 Nether mobs and 10 quartz ore. Focused: 30 Nether mobs and 60 quartz ore. | 800 / 4,700 | 11 h / 1.8 h | 28 h / 4.7 h | 116 h / 20 h | 388 h / 66 h |
| Pickaxe | Ordinary: 300 stone and 10 ores. Focused: 1,500 blocks and 40 ores. | 2,700 / 12,000 | 3.1 h / 43 min | 8.1 h / 1.8 h | 34 h / 7.7 h | 115 h / 26 h |
| Ranged | Ordinary: 40 shots, 20 hits, 5 kills. Focused: 300 shots, 150 hits, 40 kills. | 1,100 / 7,000 | 7.7 h / 1.2 h | 20 h / 3.1 h | 84 h / 13 h | 282 h / 44 h |
| Rift | Ordinary: 5 pearls and 2 portal trips. Focused: 60 pearls. | 400 / 4,500 | 21 h / 1.9 h | 55 h / 4.9 h | 231 h / 21 h | 775 h / 69 h |
| Seaborne | Ordinary: 2 minutes swimming and 3 fish. Focused: fishing all hour. | 600 / 7,000 | 14 h / 1.2 h | 37 h / 3.1 h | 154 h / 13 h | 517 h / 44 h |
| Stealth | Ordinary: 10 unaware openers. Focused: 30 sneaking openers and 30 sneaking kills. | 1,600 / 9,000 | 5.3 h / 57 min | 14 h / 2.4 h | 58 h / 10 h | 194 h / 34 h |
| Swords | Ordinary: 15 kills with a sword. Focused: 80 kills with a sword. | 2,400 / 12,800 | 3.5 h / 40 min | 9.2 h / 1.7 h | 39 h / 7.2 h | 129 h / 24 h |
| Taming | Ordinary: 4 breedings and 3 pet kills. Focused: 30 breedings and pet combat. | 300 / 3,500 | 28 h / 2.4 h | 73 h / 6.3 h | 308 h / 26 h | 1,033 h / 89 h |
| TragOul | Ordinary: 60 health taken. Focused: 300 health taken in fights. | 860 / 5,000 | 9.9 h / 1.7 h | 26 h / 4.4 h | 108 h / 19 h | 360 h / 62 h |
| Unarmed | Ordinary: 3 kills bare-handed. Focused: 50 kills bare-handed. | 1,200 / 20,000 | 7.1 h / 26 min | 18 h / 1.1 h | 77 h / 4.6 h | 258 h / 16 h |

## Adaptations

The same data is available as a spreadsheet: [adaptation-costs.csv](/adapt-assets/adaptation-costs.csv).

### Agility

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Featherfoot | Sprinting ignores farmland, pressure plates, sweet-berry snags, and eventually powder snow. | 4 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3 | 9 | no |
| Ladder Slide | Look up to climb quickly and look down to descend quickly. Looking near the horizon returns to normal ladder control, sneaking halts directional movement, and the first and last two climbable blocks always use normal control. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Marathoner | Sprinting drains less saturation, letting you run further before hunger bites. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Vault | Jump toward a fence to clear it. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Armor-Up | Get more armor the longer you sprint! Stop and it fades away slowly. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Kip-Up | Jump right after taking a hit to convert knockback into recovered momentum and a speed burst. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Roll Landing | Timed crouch before landing converts part of fall damage into hunger cost. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Slipstream Slide | Tap sneak while sprinting to enter a sustained prone slide and shed ground friction, keeping momentum through 1-block gaps. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Air Dash | Left-click air after a sprint-jump to dash forward with pure horizontal velocity. | 4 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10 | 30 | no |
| Cat Reflexes | A chance while sprinting to dodge incoming projectiles entirely. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Super Jump | Sneak and jump to launch a super jump. Configured levels scale the apex from 1.5 to 2.5 blocks. | 4 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10 | 30 | no |
| Wall Jump | Hold shift while mid-air against a wall to latch, then release shift to jump. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Wind Up | Get faster the longer you sprint! | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |

### Architect

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Smart Shape | Sneak-punch blocks with an empty hand to rotate orientation. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Stonecutter Savant | Sneak-punch the air with an empty hand to open a stonecutter wherever you are, as long as you carry a stonecutter! | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Chalk Line | Craft persistent Chalk Wands from one Stick and one String in different orientations. Level 1 unlocks straight lines, level 2 polylines, level 3 circles, and level 4 arcs. Each level immediately reveals its new crafting recipe in the vanilla recipe book. Their private block guides appear only while that wand is held; sneak-click the air to clear its saved plan. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Mason's Eraser | Erase your own recent placements near-instantly without producing drops. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Scaffolder | Sneak-place blocks as temporary scaffolds that dissolve on their own and refund the block to you! | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Silk-Touch Glass | Break glass blocks with an empty hand to pick them up without shattering them. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | yes |
| Steady Hands | While bridging over open air you take no knockback, shrug off falls, and place with a steadier rhythm! | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Brickbat | Punch a creature with a block in hand, or swing at one in range, to throw one block at it. Heavier blocks hit harder, and the block drops where it lands. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Elevator | Build fast vertical elevators. Craft each Elevator Block with an Ender Pearl in the center, surrounded by 8 Wool. | 1 | Core | 3 | 4 | 1 | 10 | 10 | 10 | no |
| Magic Foundation | This allows for you to sneak and place a temporary foundation beneath you! | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Redstone Remote | This allows for you to use a redstone torch to toggle redstone, remotely! | 1 | Core | 3 | 4 | 1 | 10 | 10 | 10 | yes |
| Supply Line | When the stack in your hand runs out, it refills automatically from shulker boxes or bundles in your inventory! | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Builder's Wand | Sneak while holding a block that matches the surface you are looking at to place multiple blocks across it at once. You may need to move slightly to refresh the placement preview. | 1 | Strong | 5 | 6 | 1 | 16 | 16 | 16 | no |

### Axes

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Axe Drop to Inventory | Blocks you break send their drops straight into your inventory. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Lucy's Log-Swapper | Change the flavor of logs in a Crafting Table! | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Bark Hide | Chopping logs layers on short-lived absorption that fades once you stop working. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Leaf-Miner | Allows you to break bulk leaves at once! | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Shield Splitter | Axe hits on blocking foes disable their shield longer and deal bonus damage. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Cleave | Melee axe swings cleave extra enemies in a short frontal arc. | 3 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8 | 20 | no |
| Sunder | Axe hits shred a target's armor and armor toughness in stacking layers that fade over time. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Throwing Axe | Left-click air with an axe to hurl it as a spinning projectile that deals its melee damage. | 4 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10 | 30 | no |
| Axe Chop | Chop down trees by right clicking the base log! | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Axe Ground Smash | Jump, then crouch and smash all nearby enemies. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Wood-Miner | Allows you to break bulk wood at once! | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |

### Blocking

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Chains of Mephistopheles | Allows you to craft Chainmail Armor | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Craftable Horse Armor | Allows you to craft Horse Armor | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Craftable Saddle | Craft a Saddle with Leather | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Phalanx Crafter | Unlock two shaped shield recipes; level 2 reinforces a shield to 1,200 durability and preserves its banner face. | 2 | Minor | 1 | 1 | 0.5 | 2 | 2, 2 | 4 | no |
| Bastion Stance | While sneaking and actively blocking with a shield, reduce knockback and incoming projectile pressure. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Interpose | Sneak-block near a wounded ally to redirect part of the damage they take onto your shield. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Shield Wall | While blocking, allies sheltered behind your shield take reduced projectile damage. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Shieldbearer's Resolve | When an axe disables your shield, brace with resistance and recover the shield faster. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Tempered Guard | Blocked hits can temper your gear, restoring a sliver of shield and armor durability. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Bulwark Bash | Sprint-jump and land a shielded crit to trigger a bash shockwave. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Counter Guard | Each blocked hit builds shield stacks. Your next proc consumes stacks to reflect damage to the attacker. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Mirror Block | Blocking with a shield can reflect incoming projectiles with reduced follow-up force. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Multi-Armor | Bind an elytra to your chestplate and swap between them on the fly. | 1 | Strong | 5 | 6 | 1 | 16 | 16 | 16 | no |
| Perfect Guard | Raise your shield the instant before a hit lands to negate it entirely and stagger the attacker. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |

### Brewing

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Bottled Blindness | Unlocks brewing Potions of Blindness, which shroud a target's sight. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Bottled Darkness | Unlocks brewing Potions of Darkness, which shroud vision and prevent sprinting. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Bottled Decay | Unlocks brewing Potions of Wither, which afflict a target with decay. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Bottled Fatigue | Unlocks brewing Potions of Mining Fatigue, which slow a target's digging and attacks. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Bottled Hunger | Unlocks brewing Potions of Hunger, which drain a target's food. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Bottled Nausea | Unlocks brewing Potions of Nausea, which warp a target's vision. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Bottled Absorption | Unlocks brewing Potions of Absorption for temporary bonus hearts. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | yes |
| Bottled Haste | Unlocks brewing Potions of Haste for faster mining, when Efficiency is not enough. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | yes |
| Bottled Life | Unlocks brewing Potions of Health Boost for extra maximum hearts. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | yes |
| Bottled Resistance | Unlocks brewing Potions of Resistance, which reduce incoming damage. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | yes |
| Bottled Saturation | Unlocks brewing Potions of Saturation, which restore hunger. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | yes |
| Lingering Brew | Brewed potions last longer! | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Super Heated Brew | Brewing stands work faster the hotter they are. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |

### Chronos

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Deja Vu | Your body remembers recent pain; taking the same kind of damage again within a short window hurts noticeably less. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Pocket Watch | Sneak while falling with a clock in your inventory to drift in slow motion for a limited, level scaled duration each airtime. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Aberrant Touch | Melee attacks apply stacking slowness at the cost of hunger, with strict PvP caps, and root targets at 5 stacks. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Accelerate | Passively accelerate time around you, occasionally growing nearby crops and fast-forwarding furnaces, smokers, blast furnaces, and brewing stands. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Borrowed Time | A portion of incoming damage is deferred and quietly drained back once per second over the following seconds. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Overtime | Beneficial potion effects applied to you last longer, scaled by adaptation level. At max level, harmful effects applied to you last half as long. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Temporal Echo | Projectile actions can replay once after a short delay at reduced strength. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Instant Recall | Rewind to a recent snapshot with health and hunger restored. Costs the clock and part of your remaining health, but never kills you. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Rewind | Sneak and swap hands to mark a moment in time, then do it again within the window to snap back with health and hunger restored. Each rewind costs hunger. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Stasis Field | Sneak and right click with an amethyst shard to deploy a stasis bubble that freezes projectiles in midair and locks down mobs inside. Consumes the shard on cast. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Time Bomb | Throw a crafted chrono bomb that creates a temporal field, slows entities, and freezes projectiles. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Time in a Bottle | Carry a temporal bottle that stores time and spend it to accelerate timed blocks, growables, and Ageable entities such as baby animals. Recipe (Shapeless): Swiftness Potion + Clock + Glass Bottle. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Hourglass Guard | A killing blow instead leaves you at half a heart, granting brief invulnerability and slowing nearby enemies, on a long cooldown. | 3 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21 | 54 | no |

### Crafting

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Bulk Artisan | Shift-click a craft result to pull extra ingredients from your inventory and craft a bigger batch at once. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Compactor | Sneak and swap hands while aiming at a Crafting Table to compact full stacks into blocks immediately. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Craftable Leather | Craft Leather from Rotten Flesh | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Crafting XP | Periodically gain a bounded vanilla XP orb when crafting | 7 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3, 4, 4 | 20 | no |
| Craftable Skulls | Using Materials you can Craft Mob Skulls! | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | yes |
| Provisioner | Crafting or cooking food has a chance to yield bonus portions. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Thrifty Hands | Crafts using at least three different materials have a chance to refund one ingredient unit. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Masterwork | Each tool and armor piece you craft independently rolls variable bonus durability, a minor beneficial enchantment, and a full-level attribute bonus. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Ore Reconstruction | Recraft ores from their base components! | 1 | Core | 3 | 4 | 1 | 10 | 10 | 10 | yes |
| Portable Tables | Click the air while holding an anvil, crafting table, grindstone, stonecutter, cartography table, or loom to open it without placing it. Each open costs hunger. | 1 | Core | 3 | 4 | 1 | 10 | 10 | 10 | yes |
| Tinkerer | Combine two damaged tools of the same type in the crafting grid to keep their best enchantments. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| A Boutilier's Backpacks | Craft a Backpack that stores whole stacks and opens as its own container. | 1 | Strong | 5 | 6 | 1 | 16 | 16 | 16 | yes |
| Deconstruction | Deconstruct blocks & items into salvageable base components! | 1 | Keystone | 8 | 8 | 1 | 24 | 24 | 24 | no |

### Discovery

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Insight | Look at a creature to reveal its health, armor, and attack. Higher levels add its effects, movement, defenses, and detection range, then nearby creatures. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Relic Appraiser | Sneak-right-click rare drops (heads, discs, armor trims, pottery sherds) for Discovery XP and XP in one random eligible skill; placed appraised heads and skulls keep their stamp when broken. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Archaeologist | Brushing suspicious blocks can yield bonus archaeology rewards. | 6 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7, 8 | 34 | no |
| Cartographer Pulse | Sneak-right-click with a compass to lock it toward a nearby structure and see a private glowing direction line. Each pulse costs hunger. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Keen Eye | Chests and spawners in your line of sight briefly appear as private glowing block displays. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Sixth Sense | A compact HUD cue names the nearest supported structure and shows its direction and distance. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Trailblazer | Your first visit to each biome or structure type grants a skill-XP burst and brief speed. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Villager Attraction | Get better trades with villagers, at the cost of XP per interaction. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| World Armor | Passive armor depending on nearby block hardness. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Field Notes | Your first kill of each mob species pays big XP and banks a small permanent damage bonus against that species. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Better Mending | Sneak-left-click to spend your stored XP and directly mend the Mending item in your hand. | 6 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20, 23 | 96 | no |
| Experimental Resistance | Consume experience to mitigate damage only when a hit would drop you below 5 hearts or kill you. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Polymath | Each skill you have leveled past a threshold adds a small global XP-gain bonus. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Experimental Unity | Gaining vanilla experience adds XP to random skills. | 7 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21, 26, 31, 36, 41 | 188 | no |

### Enchanting

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| XP Return | Committed enchants periodically return a bounded vanilla XP orb. | 7 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3, 4, 4 | 20 | no |
| Arcane Siphon | Killing equipped enchanted entities grants bonus XP and can siphon a book; players qualify at maximum level. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Lapis Return | Enchanting at a table has a chance to refund spent lapis, more at higher levels. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Rune Sight | Reveal the enchantments behind enchanting-table offers before you commit. One at first, the full list at max. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Anvil Savant | Reduce anvil XP cost when combining, repairing, and renaming. | 4 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10 | 30 | no |
| Bookshelf Attunement | Gain virtual bookshelf power to improve enchanting table offer quality. | 4 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10 | 30 | no |
| Curse Cleansing | Sneak while taking a grindstone result to remove curses from the original item first, preserve every other property, and gain Enchanting XP. | 4 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10 | 30 | no |
| Grindstone Recovery | Disenchanting can recover one removed enchantment onto a book with bonus XP. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Offer Reroll | Sneak-right-click an enchanting table to reroll its offers. Each reroll costs lapis and XP levels. | 4 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10 | 30 | no |
| Tome Rebinding | Drop one multi-enchant book while aiming at an anvil to divide it into single-enchant books. Lossy at low levels, lossless at max. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Echo of Knowledge | Hold an enchanted book while collecting XP to charge it and upgrade an enchantment within vanilla caps. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Quick-Click Enchant | Enchant items by clicking enchant books directly on them. | 7 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20, 23, 26 | 122 | no |
| Infusion Transfer | Right-click the base item in an anvil to move one enchantment onto it from the sacrifice item. | 5 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21, 26, 31 | 111 | no |
| Soul Link | Sneak-right-click an anvil to soul-link an enchanted item so it survives death, gated by an XP level buffer. | 5 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21, 26, 31 | 111 | no |

### Excavation

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Shovel Drop to Inventory | Blocks you break send their drops straight into your inventory. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Grave Digger | Digging earthen ground can unearth bone loot, and rarely disturbs a hostile grave. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Hasty Excavator | Starting a block break grants stable Haste long enough to finish slower excavation blocks. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Mudlark | Bonus drops from muddy blocks, plus haste while digging in water or rain. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Soft Fall | Landing on soft diggable ground reduces fall damage, up to full negation. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Burrow | Sneak-right-click soft ground with a shovel to rapidly dig straight down, stopping before hazards. Each burrow costs hunger and tool durability. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Clod Hurler | Dig soft ground with a shovel while a hostile mob is in sight to fling the dug block at the nearest one. Its drop flies back to you. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Earth Mover | Sneak-right-click the air with a shovel to damage, knock back, and slow hostile mobs with a wave of earth. Damage scales from the held shovel. Each wave costs hunger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Seismic Ping | Mining can temporarily reveal a nearby ore block with a private colored glow. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Treasure Hunter | Digging sand, gravel, mud, or clay can unearth archaeology treasure. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| OMNI - T.O.O.L. | Merge your tools into one omni-tool that swaps to the right tool for the job. Shift-click one tool onto another in your inventory to merge; sneak-drop to disassemble. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Super-Seeing Spelunker | Hold glow berries in your main hand to reveal glowing ore displays through the ground. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Tunneler | Sneak while digging soft blocks to carve a whole plane at once. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |

### Golemancy

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Animus Binding | Sneak-right-click a golem while holding an Animus Core to bind it to you as a companion. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Bone Frame | Brings your Tragoul skeletal servants into Golemancy: they answer your Crook signals, glow in your servant channel with owner-only status labels, wear a Bone Lattice of runes, and pay Golemancy XP for their kills. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Golem Mending | Heal your golems with copper ingots, snow blocks and bone meal, let them mend near you and at home, and rebuild fallen golems from their Shattered Core. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Node Weaving | Sneak-right-click a block face while holding a node to anchor it there and direct your golems' work. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Overseer | Lets you signal your bound golems with the Artificer's Crook to follow you, hold, go home or work, and as it grows, to attack what you look at, answer by channel, rally to you and guard you in formation. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Angler Core | Golems bound with an Angler Core fish the open water in front of a Fishing Node and carry the catch, with more luck, a junk filter, faster catches in the rain and double catches as the core grows stronger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Breaker Core | Golems bound with a Breaker Core break the blocks a Breaker Node's filter lists inside its area and carry the drops, mining harder blocks with better pickaxes as the core grows stronger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Copper Frame | Lets you bind copper golems and strengthens them with extra health, carry capacity and speed, plus armor from their patina. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Frost Frame | Strengthens your bound frost golems with extra health, damaging snowballs and protection from rain and heat. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Gatherer Core | Golems bound with a Gatherer Core pick up dropped items around their home or a Collection Node and deliver them, and store experience orbs as essence as the core grows stronger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Guardian Core | Golems bound with a Guardian Core defend their home, you or a Guard Node's area, and shield you as the core grows stronger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Harvester Core | Golems bound with a Harvester Core harvest and replant ripe crops in a Harvest Node's area, and tend and till the field as the core grows stronger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Iron Frame | Lets you bind iron golems and strengthens them with extra health, armor and attack, stronger ingot repairs, sweeping punches and a full-size Colossus Form. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Lumber Core | Golems bound with a Lumber Core fell natural trees in a Lumber Node's area from the top down and collect the logs, then replant, sweep leaves and fell bigger trees as the core grows stronger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Rancher Core | Golems bound with a Rancher Core tend the animals in a Pasture Node's area: they breed pairs up to the node's keep count, then shear sheep, milk cows and goats, and cull spare adults as the core grows stronger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Sorter Core | Copper golems bound with a Sorter Core empty the container under an Input Node into nearby containers that already hold each item, and learn item groups, Filter Nodes, restocking and fetching as the core grows stronger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Stasis | Pack your bound golems into Dormant Golem blocks with the Crook and place the block to wake them anywhere, with their cores, runes, cargo and health intact. | 3 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8 | 20 | no |
| Golem Masterwork | Infuse a Masterwork Heart at the Animus Plinth and slot it into a golem for an extra rune slot, more health, a second core and stronger runes. | 3 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14 | 36 | no |
| Runic Augments | Lets you infuse runes at the Animus Plinth and slot them into your bound golems for speed, carrying, fire, reach, channels, yield and armor. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |

### Herbalism

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Herbalist's Myconid | Gives you the ability to craft Mycelium | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Herbalist's Terralid | Gives you the ability to craft Grass Blocks | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Hoe Drop to Inventory | Blocks you break send their drops straight into your inventory. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Mushroom Maker | Gives you the ability to craft Mushroom Blocks in a Crafting Table | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Spore Bloom | Sneak-right-click mycelium with mushrooms to spread controlled bloom patches. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Webby Creator | Gives you the ability to craft Cobwebs in a Crafting Table | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Bee Shepherd | Hold flowers near crops to pulse growth and draw nearby bees toward you. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Herbalist's Hippo | Consuming food, gives you more saturation | 7 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7, 8, 9 | 43 | no |
| Herbalist's Luck | When you break Grass/Flowers, you have a chance to get a random item | 7 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7, 8, 9 | 43 | no |
| Rooted Footing | Permanent passive: protect farmland and convert part of fall damage into hunger while on natural ground. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | yes |
| Seed Sower | Sneak-right-click with seeds to plant nearby farmland and soul-sand plots. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Compost Cascade | Sneak-right-click a composter to consume nearby drops, harvest and replant mature crops, compost your inventory, and spend the compost maturing nearby crops. Leaves are only consumed when enabled in the config. | 6 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13 | 55 | no |
| Harvest & Replant | Right click a crop with a hoe to harvest & replant it. | 3 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8 | 20 | no |
| Growth Aura | Grow nature around you in an aura | 7 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20, 23, 26 | 122 | no |
| Hungry Shield | Take damage to your hunger before your health, covering more damage types as it levels up. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |

### Hunter

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Blood Trail | Mobs you wound below half health leave a private glowing blood trail only you can see. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Hunter's Heights | When you are struck you gain jump-boost, at the cost of hunger | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Items Drop to Inventory | Kills and blocks broken with a sword in hand send their drops straight into your inventory. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Hunter's Luck | When you are struck you gain luck, at the cost of hunger | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Hunter's Speed | When you are struck you gain speed, at the cost of hunger | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Snare Line | Craft a string-and-iron snare; hostile mobs that cross it are rooted briefly. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Trophy Skinner | Precision kills can yield bonus trophy drops and occasional mob heads. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Vanishing Step | When you are struck you gain invisibility, at the cost of hunger | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Adrenaline | Deal more damage the lower health you are (Melee) | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Big Game Hunter | Deal bonus damage to and reap extra drops from large and boss-class mobs. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Hunter's Regen | When you are struck you gain regeneration, at the cost of hunger | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Hunter's Resistance | When you are struck you gain resistance, at the cost of hunger | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Hunter's Strength | When you are struck you gain strength, at the cost of hunger | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Predator Focus | Repeated strikes on the same target ramp your damage; switching targets resets the ramp. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |

### Kinetics

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Dead Zone | Enemies that crowd inside your spear's dead zone get shoved out, arming a riposte. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Heavy Frame | Plant your feet while sneaking with a mace or spear: heavy knockback resistance at the cost of speed. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Impale Pin | Spear hits at sweet range pin the target with heavy slowness. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Lunge Conductor | Your spear lunges strike harder and carry you farther. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Mounted Shock | Spear charges from the saddle hit harder the faster your mount moves. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Quake Guard | Landing a smash braces you: knockback resistance, toughness, and safe footing for a moment. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Rebound Anvil | Each smash coils your legs: land springy and cushioned, ready for a second meteor. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Rubber Soul | Your landings carry spring. Bouncy blocks send you higher, and every landing keeps more momentum. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Soft Catch | Soft and springy blocks break your fall, and a fresh bounce grants a grace window. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Terminal Toggle | Sneak in midair to switch between a hard dive and a drifting hang. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Breachwright | Your mace smashes shred the target's armor for a short time. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Charge Lance | Spear hits scale with your speed. Hit them at a run. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Meteor Cadence | Sneak while falling with a mace to accelerate sharply downward into your smash. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Moon Jump | Each level raises every jump by 0.5 blocks. Sneak-jump for an additional floaty, low-gravity hop. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Phalanx Reach | Spears strike farther in your hands. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Surface Skate | Sprint to slide on every ground surface; levels cancel more friction, and pressing sneak stops horizontal motion immediately. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Windburst | Heavy smashes erupt in a radial shockwave that hurls nearby enemies away. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Mass Shift | Sneak and swap hands: look up for persistent Titan form, down for persistent Pocket form, or level to return to normal. Titan grants 20% damage and health with Slowness I; Pocket trades 20% damage and health for Speed I. | 3 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14 | 36 | no |

### Nether

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Crimson Feast | Eat nether fungi and warped flora, and gain fire resistance from any meal in the Nether. | 4 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3 | 9 | no |
| Strider Bond | Ride striders faster, keep their pace out of lava, and land safely when dismounting over lava. | 4 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3 | 9 | no |
| Ashwalker | Ignore magma-block and campfire burns, and shrug off most soul-fire damage at mastery. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Blaze Leech | Fire interactions can trigger brief hunger and regeneration gains. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Magma Skin | While burning, melee attackers catch fire and your own strikes deal bonus fire damage. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Netherrack Mason | Mine netherrack, basalt, and blackstone faster in the Nether with occasional bonus drops. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Soul Strider | Move at full speed across soul sand and soul soil, gaining soul-speed bursts at mastery. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Wither Harvest | Wither skeletons yield extra bones and coal, with slightly improved skull odds. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Wither Resistance | Resists withering through the power of Netherite. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Fire Resistance | Resists fire by hardening your skin. | 3 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8 | 20 | no |
| Ghast Ward | Harden against ghast blasts and wither-skeleton ranged pressure in the Nether. | 6 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13 | 55 | no |
| Piglin Broker | Nearby barters can grant extra rolls and occasional premium bonus items. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Lava Walker | Stride over lava in the Nether at the cost of hunger. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Wither Skull Throw | Unleash your inner Wither by using someone's head. | 3 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14 | 36 | no |

### Pickaxe

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Pickaxe Drop to Inventory | Blocks you break send their drops straight into your inventory. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | no |
| Trophy Polish | Mining naturally generated heads, skulls, and dragon eggs grants bounded vanilla XP | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Deep Core | Mining deepslate grants Haste so it digs like normal stone | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Obsidian Rush | Mining obsidian with a diamond or netherite pickaxe grants a strong Haste burst | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Stone Skin | Breaking stone-type blocks builds short-lived stacking damage resistance | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Ore Chisel | Right Click Ores to Chisel more ore out of them, at a severe durability cost. | 7 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13, 15 | 70 | no |
| Repair Rhythm | Sustained mining has a chance to restore durability to your pickaxe | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Autosmelt | Allows you to smelt mined Vanilla ores | 4 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17 | 53 | no |
| Quarry Sense | Sneak-right-click a block with an iron+ pickaxe to reveal nearby ores as private glowing block displays. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Tunnel Bore | Sneak and mine stone-type blocks to bore out a whole tunnel face at once | 3 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14 | 36 | no |
| Unbreakable Pact | Your pickaxe refuses to break, surviving at 1 durability instead | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Pickaxe Silk-Spawner | Makes Spawners drop when broken | 2 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16 | 33 | no |
| Veinminer | Allows you to break blocks in a Vein/Cluster of Vanilla ores | 5 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21, 26, 31 | 111 | no |

### Ranged

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Fetch Shot | Shoot dropped items with projectiles to pull them straight into your inventory. | 3 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2 | 6 | no |
| Trajectory Sight | Sneak or draw a ranged weapon to preview projectile flight as a clear dotted line with a ringed impact marker. With a Heartseeker lock active, the preview shows the arrow's curved seeking path to the mark instead. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Arrow Recovery | Recover Arrows after you have killed an enemy. | 8 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7, 8, 9, 10 | 53 | no |
| Force Shot | Shoot projectiles further, faster! | 7 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7, 8, 9 | 43 | no |
| Lunge Shot | While airborne, firing arrows kicks you backward, away from your aim | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Arrow Piercing | Adds Piercing to projectiles! Shoot through things! | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Floaters | Projectiles have a chance to apply levitation and hold targets in the air. | 6 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13 | 55 | no |
| Heavy Draw | Heavier projectiles fly slower but hit far harder. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Pinning Shot | Any player-fired projectile can pin targets with heavy slowness. | 6 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13 | 55 | no |
| Ricochet Bolt | Projectiles ricochet off solid blocks with chained bounces. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Web Snare | Surround cobwebs around your target when you hit them! | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Heartseeker | Draw a bow while looking at a creature to lock on - it glows red for you, and your arrow whistles and curves through the air to find it no matter where you aim, weaving around obstacles. Piercing levels and Ricochet Bolt's available bounce capacity add seeking passes: the arrow punches through its target, exits the far side, then bends toward a fresh nearby target; without a new target it keeps flying forward. Ricochet passes preserve their reflection, speed, damage, and rewards when seeking arrows strike blocks. Every seeking shot puts your bow on a short cooldown. | 5 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21, 26, 31 | 111 | no |

### Rift

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Anti-Levitation | Tap sneak while levitating to cancel Levitation and drift down gently with Slow Falling. | 1 | Minor | 1 | 1 | 1 | 3 | 3 | 3 | yes |
| Easy Enderchest | Click while holding an ender chest to open your ender chest without placing it. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | no |
| Pearl Rebound | A plain thrown ender pearl bounces once instead of teleporting at the first surface it hits. The rebound steers toward your crosshair, then teleports normally at its next impact. Pearl landing damage is also reduced; leveling improves both reduction and steering. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Rift Resistance | Gain Resistance when using Ender Items & Abilities | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | no |
| Rift Visage | Prevents Endermen from becoming aggressive if you have Ender Pearls in your inventory. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | yes |
| Void Magnet | Sneak to pull nearby item drops into your ender chest first, then inventory overflow. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Ender Taglock | Sneak-left-click entities with an ender pearl to bind them, then throw the tagged pearl to relocate only that target. The thrower is never teleported. | 3 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14 | 36 | no |
| Inflated Pocket Dimension | Empty-hand right-click a block to pull matching stacks from your ender chest; sneak-drop to store items into it. | 1 | Strong | 5 | 6 | 1 | 16 | 16 | 16 | yes |
| Remote Access | Craft a Reliquary Portkey (ender pearl + compass), bind it to a container, and use it to open that container from anywhere. | 1 | Strong | 5 | 6 | 1 | 16 | 16 | 16 | no |
| Rift Conduit | Sneak-right-click a container with an ender pearl to capture a conduit taglock, then right-click a second container to link them. Items left in one linked container flow into the other when you close it. At max level the two containers can even be in different dimensions. | 4 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17 | 53 | no |
| Rift Blink | Double-jump to blink where you look. Choose distance or higher landings, and phase while sneaking, by aiming, or never. At level 2, reactive mode replaces double-jump with a dodge when attacked: blink where you look or away from the attacker. Successful blinks consume no pearl, but deal ender pearl damage that decreases by level. Server rules limit the available choices. | 5 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21, 26, 31 | 111 | no |
| Rift Gate | Craft a recall gate (Emerald + Amethyst Shard + Ender Pearl), then sneak-left-click it to bind your location and right-click to teleport back after a 5 second channel. Sneak-left-click into the air to unbind. | 1 | Keystone | 8 | 8 | 1 | 24 | 24 | 24 | no |
| Void Skin | Any lethal damage blinks you to a nearby safe spot instead of killing you, using the current world's spawn when no nearby spot exists, and grants brief resistance. Costs an ender pearl and has a long cooldown. Leveling shortens the cooldown and extends the protection. | 4 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21, 26 | 80 | no |

### Seaborne

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Coral Gardener | Coral you place survives out of water far longer, bonemeal grows coral, and reef blocks grant bonus XP. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Ink Veil | Taking damage underwater bursts an ink cloud that blinds hostiles and briefly hides you from drowned and guardians. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Organic Oxygen Tank | Hold far more air underwater, and see in the dark there from level 2. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Brine Skin | While wet you slowly regenerate and take reduced damage, and the buff lingers briefly after you dry off. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Deep Salvager | Underwater containers appear as private aqua glowing block displays and reward bonus treasure the first time you open them submerged. | 4 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10 | 30 | no |
| Dolphin's Grace | Swim like a dolphin, without the dolphins - sprint-swimming channels real Dolphin's Grace | 7 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13, 15 | 70 | no |
| Fish Whisperer | Fish school toward you, dolphins and axolotls assist your hunts, and you fish with a permanent Luck of the Sea tier. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Fisher's Fantasy | Fishing can grant one bounded bonus item, vanilla XP, and Seaborne XP. | 7 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13, 15 | 70 | no |
| Hydro Jet | Tap sneak while swimming to burst forward on a jet of water. Costs hunger and consumes a charge. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Rain-Fed | While you are in water or rain, moving, mining and fighting cost no hunger, and your food and saturation slowly refill. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Tidal Ward | Absorption hearts build up while you are in water or rain. Any hit pauses the ward, and it drains away soon after you dry off. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Tidecaller | Surge forward with a water burst while in water or rain, triggered by sneaking or an attack swing depending on server settings. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Trident Mastery | Tridents deal bonus damage and home back to you faster after a throw. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Turtle Miner | Mine faster underwater whether standing or floating, and shrug off most of a guardian's Mining Fatigue. | 1 | Core | 3 | 4 | 1 | 10 | 10 | 10 | no |
| Storm Strike | While rain falls on you or you are in water, your melee and trident hits call lightning: the first hit on each target, then every few hits. Thunderstorms strike harder and more often. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |

### Stealth

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Silent Step | Core concealment for backstabs, Cutpurse, and Assassinate. Sneaking uses observer awareness; invisibility or an active Shadow Decoy always counts as undetected. | 3 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2 | 6 | no |
| Trap Sense | While sneaking, nearby trapped chests, tripwire string, hooks, pressure plates, and sculk blocks privately glow. Maximum level prevents all of your movement vibrations from triggering sculk. | 4 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3 | 9 | no |
| Cutpurse | While Stealth reports you undetected, hits on pillagers, vindicators, and piglins can steal loot without a kill. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Enderveil | Look at Endermen freely - prevents Enderman aggression without wearing a pumpkin. | 2 | Utility | 2 | 1 | 0.5 | 4 | 4, 4 | 8 | no |
| Item Snatch | Snatch Dropped items instantly while sneaking! | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Smoke Pellet | Sneak while holding gunpowder in either hand to cast an aimed smoke cloud. Players inside turn invisible, mobs drop aggro and cannot retarget them, and living entities are blinded. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Stealth Vision | While sneaking, gain night vision, ignore Blindness, and see invisible players outlined. | 1 | Utility | 2 | 2 | 1 | 6 | 6 | 6 | no |
| Umbral Recovery | Kills made while sneaking refund hunger and extend any active invisibility window. | 4 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6 | 19 | no |
| Decoy Swap | Requires Shadow Decoy. While your decoy is alive, double-tap sneak to swap places with it. | 3 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8 | 20 | no |
| Ghost's Armor | Slowly builds a separate armor layer while you avoid damage. It stacks beyond worn armor and is consumed by the next armor-respecting hit. | 7 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13, 15 | 70 | no |
| Shadow Decoy | Stop sneaking to spawn a decoy wearing your skin and equipment that pulls nearby mob aggression. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Sneak Speed | Sneak faster with each level - max level sneaks at full walk speed, the vanilla sneak-speed cap | 3 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8 | 20 | no |
| Shadowmeld | Remain sneaking while Stealth reports you undetected to become invisible. Detection, acting, taking damage, or standing ends the meld. | 4 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17 | 53 | no |
| Assassinate | While Stealth reports you undetected, strike eligible non-boss mobs for exactly their current health instead of synthetic overkill damage. | 4 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21, 26 | 80 | no |

### Swords

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Machete | Cut through foliage with ease! | 3 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2 | 6 | no |
| Crescent Guard | Killing blows with a sword grant a brief burst of absorption hearts. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Hamstring | Strikes on sprinting or fleeing targets slow them and stop them sprinting. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Lunge Strike | Sprint-attack with a sword to lunge into the blow with extra reach. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Riposte Window | Blocking with a shield arms a short riposte for your next strike. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Whetstone Ritual | Sneak right-click a grindstone with a sword to grind a temporary sharpness buff for durability and XP levels. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Blade Flow | Chain sword hits to build attack-speed stacks. Taking damage breaks the flow. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Bloody Blade | Strikes with your sword, cause Bleeding! | 7 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13, 15 | 70 | no |
| Duelist's Focus | Deal more damage and take less while exactly one hostile is engaged with you; the focused attacker briefly glows when the defense activates. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Executioner's Edge | Sword strikes deal extra damage to low-health targets. | 6 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13 | 55 | no |
| Poisoned Blade | Strikes with your sword, cause Poison! | 7 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13, 15 | 70 | no |
| Crimson Cyclone | Land a sword crit to unleash a bleeding area slash around your target. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Dual Wield Stance | Holding a sword in each hand grants bonus melee damage. Matching swords grant the higher bonus. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Heirloom Edge | Name a sword at an anvil to make it an heirloom that banks a tiny permanent damage bonus every few kills. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |

### Taming

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Fetch | Idle tamed wolves physically run to nearby drops, pick them up, and carry them back to you. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Wild Empathy | Taming succeeds more often, and neutral mobs are slower to anger at you. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Battle Bond | When one of your pets lands a kill, you and the nearby pack gain brief strength, speed, and regeneration with a visible bond. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Beast Recall | Sneak-right-click with a lead to recall your nearest tamed companion to a safe nearby spot. Each recall costs hunger. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Mounted Tactics | Gain mount-specific combat and handling bonuses while riding. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Pack Leader Aura | Nearby tamed companions gain speed and regeneration near their owner. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Stable Hand | Animals you tame or breed keep a permanent bias toward better speed, jump, health, and safe fall distance. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Tame Health | Increase your tamed animal health. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Tame Regeneration | Increase your tamed animal regeneration. | 3 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5 | 13 | no |
| Alpha's Command | Sneak-left-click while holding a bone to raycast a target, mark it with a private red glow, and command nearby combat pets to focus it. Successful commands consume one bone. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Guardian Instinct | Nearby pets leap to intercept projectiles aimed at you, taking reduced damage themselves. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Shared Pain | Spread a portion of your incoming damage across nearby owned companions without reducing them below their health floor. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Tame Damage | Increase your tamed animal damage dealt. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Last Breath | On a lethal hit a pet drops to 1 HP, is briefly invulnerable, and recalls to your side. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |

### TragOul

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Death Sense | Sense wounded creatures and players near you through walls with a private outline that intensifies in color as their health falls. | 5 | Minor | 1 | 1 | 0.5 | 2 | 2, 2, 2, 3, 3 | 12 | no |
| Blood Pact | Losing at least 2 hearts after armor, Resistance, and absorption can trigger random beneficial effects. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Bone Harvest | Kills can spawn blood globes or bone snowball globes that grant buffs when picked up. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Curse of Frailty | Enemies that dare strike you are cursed with weakness, and slowness at higher levels! | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Corpse Explosion | Mobs you kill immediately display a blood nova and damage nearby hostile mobs. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Corpse Lances | Killing an enemy launches a red-tipped corpse lance that never targets you. Its damage is tripled while you wear no armor. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Globe of Pain | Divide the Damage you deal based on the number of enemies around you! | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Marrow Armor | Bones in your inventory shatter to absorb part of incoming hits! | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Plague Bearer | Mobs that die poisoned or withered by you spread an amplified affliction across a large radius to any nearby mob you can damage. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Thorns | Reflect damage back to your attacker! | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Skeletal Servant | Sneak and right-click with bones to raise temporary skeletal servants, one living servant per level! Servants spawn with level-scaled random gear, inherit your other Tragoul perks, and hunt your mark: whatever you strike, or whatever struck you last. Summoning at the cap recycles your oldest servant. Consumes bones on summon, fewer at higher levels. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Soul Siphon | Every player-attributed damage source siphons part of its final damage as health. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Will of Pain | Every eligible attacker who damages you loses a small fixed amount of life, which is restored to you. | 5 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20 | 73 | no |
| Last Rites | A killing blow leaves you at 1 HP as a fleeting spirit instead of dying! | 5 | Keystone | 7 | 6 | 0.7 | 17 | 17, 16, 21, 26, 31 | 111 | no |

### Unarmed

| Adaptation | Description | Max level | Tier | Base cost | Initial cost | Cost factor | Level 1 cost | Cost per level | Total cost | Permanent |
|---|---|---|---|---|---|---|---|---|---|---|
| Iron Fists | Bare fists hit harder and punch through soft blocks faster. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Meditation | Meditate while sneaking, still, and empty-handed to slowly build absorption hearts. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Pressure Point | Bare-hand hits apply stacking slowness, with weakness at higher levels. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Second Wind | Bare-hand kills restore hunger and grant a short regeneration burst. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Sucker Punch | Sprint punches, but more deadly. | 5 | Utility | 2 | 1 | 0.5 | 4 | 4, 4, 5, 6, 7 | 26 | no |
| Battering Charge | Sprint into enemies with fists or a shield to deal impact damage. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Combo Chain | Consecutive unarmed hits build combo stacks that increase punch damage. | 6 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13 | 55 | no |
| Disarm | Bare-hand hits can knock the held item out of players and mobs alike, and mobs may have a worn armor piece knocked loose too. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Grapple | Sneak-punch a mob or player to grab it, then hurl it where you look. Player grapples respect PvP protection. Each throw adds exhaustion. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Shockwave Clap | Sneak and punch the air to clap a shockwave that knocks back enemies in a cone. Each clap costs hunger. | 5 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12 | 42 | no |
| Unarmed Power | Your bare-handed strikes deal more damage. | 7 | Core | 3 | 2 | 0.6 | 6 | 6, 6, 8, 10, 12, 13, 15 | 70 | no |
| Glass Cannon | Bonus Unarmed Damage the lower your armor value is | 7 | Strong | 5 | 3 | 0.6 | 11 | 11, 11, 14, 17, 20, 23, 26 | 122 | no |

<!-- generated from the live registry: end -->
