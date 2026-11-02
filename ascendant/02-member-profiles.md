---
title: Member profiles
description: Show community progress with earned badges, an owned title, pet and profile privacy controls
published: true
date: 2026-10-28T00:00:00.000Z
tags: ascendant, discord, profiles
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

## View a profile

Use `/profile view` in the configured Discord server. The reply is private by default. Add `member` to view another member's visible profile, or `share:true` to post your own profile in the current channel. The share option never publishes somebody else's profile.

Profiles show recorded chat and voice levels, total XP, message and voice activity, the activity streak, all-time game results and the current game season when one is active. An owned shop title and a featured pet can be selected. Viewing a profile does not open a wallet, grant coins, feed a pet or claim rewards.

The latest five earned [achievement badges](/ascendant/09-achievements) and total badge count also appear. Badges are permanent and appear as soon as their targets are reached; claiming an optional reward is a separate action. Hidden profiles also hide their badges from other members.

Members must be human members of the server who have completed Discord rules screening. Missing progress is shown as zero or an empty record.

## Choose what appears

| Command option | Behavior |
| --- | --- |
| `/profile settings visible:false` | Hide your profile from other members and prevent public sharing. You can still view it privately. |
| `/profile settings visible:true` | Allow server members to view your profile. This is the default. |
| `/profile settings show_balance:true` | Include wallet, bank and total coins when others view your visible profile. |
| `/profile settings show_balance:false` | Hide balances from other members. This is the default. Your private view still shows them. |
| `/profile settings title:<choice>` | Select an owned title, or **None** to clear it. |
| `/profile settings pet:<choice>` | Select an owned pet, or **None** to clear it. |

Run `/profile settings` without options to see your current choices. Title and pet suggestions come from your inventory. These settings control profile displays; existing economy and game leaderboards keep their existing visibility. A profile already posted in a channel is a snapshot and is not automatically deleted or updated when settings change.

## Storage and recovery

Choices are saved in the shared leveling and economy database. Restoring an older backup preserves current profile choices and privacy when the current database is available. A standalone recovery makes restored profiles private and hides balances until members change their settings.

The bot must reconnect and register its commands after an application update before `/profile` appears in Discord.
