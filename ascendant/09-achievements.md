---
title: Achievements and badges
description: Permanent community milestones with collectible badges and optional coin and XP rewards
published: true
date: 2026-10-28T00:00:00.000Z
tags: ascendant, economy, achievements, profiles
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

Achievements record permanent milestones for games, quests, pet care, chat XP and qualified invites. Each completed achievement awards a badge and can offer coins and member XP. Progress does not reset with game seasons or daily and weekly quests.

## Enable and configure

Open **Economy → Achievements**. The feature starts disabled with ten starter definitions. Review the targets and rewards, enable achievements, and save the settings. The economy must also be enabled to collect progress or claim rewards.

Each definition has a name, description, badge emoji, objective, target, optional coin reward and optional chat XP reward. Search the list to find a definition, or add, duplicate and remove entries. At most 50 definitions can be saved. Targets must be whole numbers from 1 to 1,000,000,000. Each reward is limited to 100,000 coins and 10,000 XP; both can be zero for a badge without currency rewards.

Only new eligible activity counts. Existing balances, levels, wins, quest claims, pet actions and invite totals are not imported when achievements are enabled. Disabling a definition stops new progress for that definition. Re-enabling it resumes from saved progress and accepts new activity.

## Objectives

| Objective | What counts |
| --- | --- |
| Chat XP earned | Eligible chat XP earned through leveling. Administrative adjustments and reward XP do not count. |
| Game wins | Recorded completed wins, independently of whether the game pays coins. |
| Quests claimed | Successful daily or weekly quest claims. |
| Pet feeds | Successful feeding and use of pet food that changes the pet's condition. |
| Pet training | Successful training sessions. XP treats do not count as training. |
| Pet adventures | Completed adventures when their rewards are claimed. |
| Qualified invites | First qualifying joins attributed to the inviter. Bots, self-invites, unknown or vanity attribution, ineligible accounts, repeat joins and manual invite adjustments do not count. |

The corresponding game, quest, pet, leveling or invite feature must be operating for its activity to be recorded. Invite forwarding retains pending events across restarts, while using the original join time to exclude activity from before achievements were enabled.

## Progress and claims

Use `/economy achievements list` to view your progress. Use `/economy achievements claim` and select an earned achievement to collect its optional rewards. Replies are private and require current server membership and completed rules screening.

An achievement's name, badge, objective, target and rewards are fixed for a member when that member first makes progress. Later settings edits apply to members who have not started it. Deleting or disabling a definition stops incomplete progress, but an already earned badge and its unclaimed reward remain available. Claims still require the economy and achievements switches to be enabled.

Each achievement can be claimed once per member. Coins and XP are applied together; a full wallet, insufficient XP capacity or disabled leveling leaves an XP-bearing reward unclaimed so the member can try again later. Coin boosts do not multiply achievement rewards, and claiming an achievement cannot advance another achievement.

## Starter achievements

| Achievement | Target | Coins | Chat XP |
| --- | --- | ---: | ---: |
| First victory | 1 game win | 25 | 25 |
| Game regular | 25 game wins | 100 | 100 |
| Quest starter | 3 quest claims | 75 | 50 |
| Quest veteran | 25 quest claims | 250 | 100 |
| Caring companion | 10 pet feeds | 50 | 25 |
| Dedicated trainer | 10 training sessions | 75 | 50 |
| Trail explorer | 5 claimed adventures | 100 | 50 |
| Conversation regular | 1,000 earned chat XP | 100 | 0 |
| Welcoming host | 3 qualified invites | 100 | 50 |
| Community builder | 10 qualified invites | 300 | 100 |

## Profiles and staff review

[Member profiles](/ascendant/02-member-profiles) show the latest five earned badges and the total earned count. A badge appears when its target is reached, even before the reward is claimed. Existing profile privacy and sharing controls apply; viewing a profile never grants a reward.

The Economy member inspector includes paged achievement progress with earned and claimed states. Owners and administrators with unrestricted economy access can inspect these records. The dashboard does not claim rewards on a member's behalf.

## Recovery

Progress, frozen definitions, processed activity and claim receipts are stored with the economy database. Restoring an older backup preserves current achievement records and paid reward protection when the current database is available. Current chat XP for members who claimed achievement XP is preserved, including a later administrative reset. Restored economy features stay disabled for review under the existing recovery rules.

The bot must reconnect and register commands after an application update before the achievement commands appear in Discord.
