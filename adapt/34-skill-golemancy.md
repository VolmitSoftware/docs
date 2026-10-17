---
title: "Skill - Golemancy"
description: "Golemancy XP sources, adaptations, and configuration"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---
Golemancy gains XP from building golems, watching golems kill hostile mobs, repairing iron golems, and tending copper golems.

## Earning XP

- Building a snow, copper, or iron golem pays `buildSnowXp`, `buildCopperXp`, or `buildIronXp` to the player who placed its carved pumpkin or jack o'lantern, and counts toward `golemancy.built`. The golem must appear within `buildAttributionWindowMillis` milliseconds and `buildAttributionRadius` blocks of that placement. Each golem type has its own `buildXpCooldownMillis` cooldown per player; builds during the cooldown still count toward the stat. Heads placed by dispensers pay nothing.
- When an iron golem or snow golem kills a hostile mob, every player within `witnessRadius` blocks of the golem who can use Golemancy earns `witnessXpMultiplier` times the kill value. The kill value is `golemKillXpBase` plus the victim's maximum health times `golemKillMaxHealthMultiplier`. One golem pays each player at most once per `witnessCooldownMillis`, and each player earns at most `witnessHourlyCap` witness XP in any 60 minutes. Mobs from spawners and trial spawners pay `spawnerMobXpMultiplier` times the normal amount. Adapt minions, such as TragOul skeletal servants and Stealth shadow decoys, and Excavation grave mobs pay nothing.
- Repairing a player-built iron golem with an iron ingot pays `repairXpPerHealth` per point of health restored. Only health that hostile mobs took away counts; damage from players is never paid back as XP.
- Scraping an oxidation stage off a copper golem with an axe pays `copperScrapeXp`. Waxing a copper golem with honeycomb pays `copperWaxXp`, once per golem.

## Adaptations

Golemancy's adaptations unlock golem binding, nodes, and runes.

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
| `challengeBuiltReward` | `500` | Knowledge paid by the golem building challenges. |

### Challenges

| Challenge | Threshold | Reward knob |
|---|---|---|
| `challenge_golemancy_built_10` | 10 | `challengeBuiltReward` |
| `challenge_golemancy_built_100` | 100 | `challengeBuiltReward` x 5 |

## See also

Catalog: [Skills](/adapt/10-skills-catalog). Rules: [Concepts](/adapt/02-concepts).
