---
title: Static - Milestones and seasons
description: Lifetime milestone badges and scheduled competitions
published: true
date: 2026-10-14T00:00:00.000Z
tags: static, milestones, seasons
editor: markdown
dateCreated: 2026-10-14T00:00:00.000Z
---

Milestones recognize lifetime progress. Seasons rank activity inside a named time window without resetting lifetime totals. Both have in-game views and operator dashboard reports.

## Milestones

`/static milestones [player]` shows progress and completed badges. `milestones.enabled` and `milestones.notifyPlayers` default to `true`. Notifications follow a successful statistics save and do not replay on reload or login.

Define ascending positive values under `milestones.thresholds`, with up to 16 thresholds per base statistic. Time uses milliseconds; distance uses Minecraft blocks. Calculated statistics cannot be targets.

Defaults are 100, 1,000, and 10,000 blocks broken or placed, and 1, 10, and 100 hours of active time. Existing totals qualify silently when definitions are installed. Completion dates record detection time, not an inferred historical achievement date. Completed badges remain recorded when definitions change.

Milestones are cosmetic. They do not grant items, money, or command rewards.

## Seasons

Open the season editor from `/static config`, or define entries in `seasons.events`. Each entry has an `id`, display `name`, `startsAt`, `endsAt`, `statistic`, and `minimumSample`. Times are explicit ISO-8601 instants, such as `2026-11-01T00:00:00Z`; the end is exclusive.

An event also sets `excludedWorlds`, `trackCreative`, `trackSpectator`, and `afkSeconds`. Rules freeze when the event starts. Started events and results remain stored if their configuration entry is removed. Static supports up to 64 retained events and eight overlapping windows.

Use `/static seasons` to browse events, `/static season <id> [player]` for a player's progress, and `/static seasontop <id>` for rankings. Finished events retain their result snapshot. A minimum sample controls qualification for ratio-based events; ranking ties remain ties.

Events do not currently issue rewards or synchronize between servers.

[Commands](/static/02-commands-languages) · [Dashboard and privacy](/static/07-dashboard-privacy)
