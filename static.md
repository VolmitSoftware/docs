---
title: Static
description: Player statistics, profiles, rankings, and administration
published: true
date: 2026-10-16T00:00:00.000Z
tags: static, statistics, folia
editor: markdown
dateCreated: 2026-09-10T00:00:00.000Z
---

Static records player activity, ranks recorded players, and keeps session history, personal bests, milestones, and season results. Players use in-game profiles; operators can also enable a read-only web dashboard.

| | |
|---|---|
| Minecraft | 26.1 through 26.3, including patch releases within those versions |
| Platform targets | Spigot, Paper, Purpur, Leaf, Folia, Canvas |
| Java | 25 or newer |
| Main command | `/static`, plus `/stats` and `/leaderboard` |
| Config file | `plugins/Static/config.toml` |
| Required plugins | None. No database either |

Static checks the Minecraft version before starting its services. Earlier versions and 26.4 or newer are rejected. Platform targets do not imply that every platform/version combination has passed runtime testing; see [compatibility and verification](/static/04-compatibility-operations).

## Start here

- [Installation and configuration *Files, settings, and tracking filters*](/static/01-installation-configuration)
- [Commands and languages *Player and operator commands, and translations*](/static/02-commands-languages)
- [Statistics *Every counter, its unit, and what counts*](/static/03-statistics)
- [History and records *Calendar periods, sessions, personal bests, and participation*](/static/05-history-records)
- [Milestones and seasons *Lifetime badges and scheduled competitions*](/static/06-milestones-seasons)
- [Dashboard and privacy *Web access, public profiles, and visibility controls*](/static/07-dashboard-privacy)
- [Tracking modules *Plugin-owned counters, durations, records, and collection controls*](/static/08-tracking-modules)
{.links-list}

## Reference

- [Compatibility and operations *Platforms, diagnostics, persistence, and integrations*](/static/04-compatibility-operations)
- [API and placeholders *The Bukkit service and `%static_…%` keys*](/static/90-api-placeholders)
- [Languages *Choosing a language and editing messages*](/languages)
{.links-list}

## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/Static*](https://github.com/VolmitSoftware/Static)
{.links-list}
