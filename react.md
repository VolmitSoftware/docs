---
title: React
description: React performance monitoring and optimisation for Paper and Folia
published: true
date: 2026-08-09T00:00:00.000Z
tags: react
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

# React

React measures where server time goes, then gives you tools to act on it. Monitoring first,
optimisation second.

| | |
|---|---|
| Command | `/react` (`re`) |
| Folia | Supported |
| Permissions | 10 nodes, including opt-in shorthand commands |
| Integrations | PlaceholderAPI, Iris, Adapt |

## Permissions

| Node | Default | Description |
|---|---|---|
| `react.*` | `op` | Allows using all /react commands. |
| `react.shorthands.*` | `op` | Allows using all enabled React shorthand commands. |
| `react.shorthands.custom` | `op` | Allows using operator-configured React shorthand commands. |
| `react.shorthands.give` | `op` | Allows using the React /give shorthand when enabled. |
| `react.shorthands.gmc` | `op` | Allows using /gmc when React Shorthands is enabled. |
| `react.shorthands.gms` | `op` | Allows using /gms when React Shorthands is enabled. |
| `react.shorthands.gmsp` | `op` | Allows using /gmsp when React Shorthands is enabled. |
| `react.shorthands.more` | `op` | Allows using /more when React Shorthands is enabled. |
| `react.shorthands.rl` | `op` | Allows using /rl when React Shorthands is enabled. |
| `react.use` | `op` | Allows using the /react command root. |

> The `react.shorthands.*` nodes gate a separate feature: React can register short aliases
> like `/gms`, `/gmc`, `/more` and `/rl`. These only exist when React Shorthands is enabled in
> config, and they will conflict with EssentialsX or CMI if you run those too. Check
> [Installation & Configuration](/react/01-installation-configuration) before enabling.
{.is-warning}

### Getting started

- [Overview](/react/00-overview)
- [Installation & Configuration](/react/01-installation-configuration)
- [Commands & Permissions](/react/02-commands-permissions)
- [Concepts](/react/03-concepts)
{.links-list}

### Features

- [Features - Entity Systems](/react/04-features-entity-systems)
- [Features - Maps & Overlays](/react/05-features-maps-overlays)
- [Features - Governors & Mechanics](/react/06-features-governors-mechanics)
- [Features - Iris Adapt & Integrations](/react/07-features-iris-adapt-integrations)
- [Tweaks Catalog](/react/08-tweaks-catalog)
- [Actions Catalog](/react/09-actions-catalog)
{.links-list}

### Monitoring and operations

- [Samplers & Metrics](/react/10-samplers-metrics)
- [Monitors Maps & In-Game GUI](/react/11-monitors-maps-in-game-gui)
- [Incident Mode & Playbooks](/react/12-incident-mode-playbooks)
- [Localization](/react/13-localization)
- [NMS Bridges & Platform Notes](/react/14-nms-bridges-platform-notes)
- [Operator Runbooks & Smoke Tests](/react/15-operator-runbooks-smoke-tests)
{.links-list}

### Developer API

- [API - Getting Started](/react/16-api-getting-started)
- [API - Entity Protection](/react/17-api-entity-protection)
- [API - Metric Publishing](/react/18-api-metric-publishing)
- [API - PlaceholderAPI](/react/19-api-placeholderapi)
{.links-list}


## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/React*](https://github.com/VolmitSoftware/React)
{.links-list}
