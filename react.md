---
title: "React"
description: "React performance monitoring and optimization for Paper and Folia"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React measures where server time goes. It then gives operators tools to act on those measurements. Monitoring comes first. Optimization comes second.

| | |
|---|---|
| Command | `/react` (`re`) |
| Folia | Supported |
| Permissions | 10 nodes, including opt-in shorthand commands |
| Integrations | PlaceholderAPI, Iris, Adapt |

## Permissions

| Node | Default | Description |
|---|---|---|
| `react.*` | `op` | Allows use of all /react commands |
| `react.shorthands.*` | `op` | Allows use of all enabled React shorthand commands |
| `react.shorthands.custom` | `op` | Allows use of operator-configured React shorthand commands |
| `react.shorthands.give` | `op` | Allows use of the React /give shorthand when enabled |
| `react.shorthands.gmc` | `op` | Allows use of /gmc when React Shorthands is enabled |
| `react.shorthands.gms` | `op` | Allows use of /gms when React Shorthands is enabled |
| `react.shorthands.gmsp` | `op` | Allows use of /gmsp when React Shorthands is enabled |
| `react.shorthands.more` | `op` | Allows use of /more when React Shorthands is enabled |
| `react.shorthands.rl` | `op` | Allows use of /rl when React Shorthands is enabled |
| `react.use` | `op` | Allows use of the /react command root |

> The `react.shorthands.*` nodes gate a separate tweak that is off by default. Its built-in labels intentionally replace matching bare commands while active and restore the previous mappings when disabled. Custom shorthands skip existing labels unless their `overrideExisting` field is enabled. Review command conflicts before enabling it alongside another command suite.
{.is-warning}

### Getting started

- [Overview *Feature map and documentation index*](/react/00-overview)
- [Installation & Configuration *Requirements, data folder, and reload*](/react/01-installation-configuration)
- [Commands & Permissions *`/react` tree and permission nodes*](/react/02-commands-permissions)
- [Concepts *Registries, TOML layout, and enable model*](/react/03-concepts)
{.links-list}

### Features

- [Features - Entity Systems *Stacking, sleep, trim, items, and more*](/react/04-features-entity-systems)
- [Features - Maps & Overlays *Heatmaps, pie maps, and list maps*](/react/05-features-maps-overlays)
- [Features - Governors & Mechanics *View range, hoppers, redstone, farms*](/react/06-features-governors-mechanics)
- [Features - Iris Adapt & Integrations *Capability-gated surge guards*](/react/07-features-iris-adapt-integrations)
- [Tweaks Catalog *Event and NMS accelerations*](/react/08-tweaks-catalog)
- [Actions Catalog *Operator one-shot jobs*](/react/09-actions-catalog)
{.links-list}

### Monitoring and operations

- [Samplers & Metrics *Sampler ids and observation model*](/react/10-samplers-metrics)
- [Monitors Maps & In-Game GUI *Action bar, maps, and config UI*](/react/11-monitors-maps-in-game-gui)
- [Incident Mode & Playbooks *Incident score and response*](/react/12-incident-mode-playbooks)
- [Localization *Locales and overrides*](/react/13-localization)
- [NMS Bridges & Platform Notes *Bridges, Folia, and jar workflow*](/react/14-nms-bridges-platform-notes)
- [Operator Runbooks & Smoke Tests *Manual checklists*](/react/15-operator-runbooks-smoke-tests)
{.links-list}

### Developer API

- [API - Getting Started *Third-party dependency setup*](/react/16-api-getting-started)
- [API - Entity Protection *Protection API*](/react/17-api-entity-protection)
- [API - Metric Publishing *Metrics API*](/react/18-api-metric-publishing)
- [API - PlaceholderAPI *`%react_…%` keys*](/react/19-api-placeholderapi)
- [API - Plugin API Packs *Community metric definitions without Java*](/react/20-api-plugin-api-packs)
{.links-list}


## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/React*](https://github.com/VolmitSoftware/React)
{.links-list}
