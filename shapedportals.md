---
title: "Shaped Portals"
description: "Legacy plugin for enclosed, non-rectangular Nether portals"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "shapedportals, portals, legacy"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Shaped Portals 1.0 fills a closed, vertical obsidian frame with Nether portal
blocks even when the frame is not rectangular. Crying obsidian can optionally
count as frame material.

| | |
|---|---|
| Status | Legacy; last source revision in 2021 |
| Audited version | 1.0 |
| Declared API | Bukkit/Spigot 1.17 |
| Listed test range | Minecraft 1.17–1.19 |
| Commands | None |
| Permissions | None |
| Configuration | `plugins/ShapedPortals/config.json` |
| Folia | Unsupported |

> The source implements shaped **Nether portals only**. It does not build End
> portals, horizontal portals, or three-dimensional portal surfaces.
{.is-info}

> This revision performs Bukkit world and block reads from an asynchronous task
> and reacts to events at `MONITOR` priority without checking cancellation. Test
> protection-plugin behavior on a disposable server before considering use.
{.is-warning}

### Start here

- [Overview *Feature scope and portal requirements*](/shapedportals/00-overview)
- [Installation & Configuration *First start, every setting, and source build*](/shapedportals/01-installation-configuration)
- [Portal Behavior & Events *Creation flow, compatibility, and troubleshooting*](/shapedportals/02-portal-behavior-events)
- [Compatibility & Operations *Platform limits and production checklist*](/shapedportals/03-compatibility-operations)
- [Code Audit *Threading, event, configuration, and boundary findings*](/shapedportals/04-code-audit)
{.links-list}

## Support and source

- [Source *github.com/VolmitSoftware/ShapedPortals*](https://github.com/VolmitSoftware/ShapedPortals)
- [Audited revision *30e3b4e, 23 August 2021*](https://github.com/VolmitSoftware/ShapedPortals/tree/30e3b4eea5852ffa879d8371d556cd4b9b9fdbe7)
- [Spigot resource *Published plugin page*](https://www.spigotmc.org/resources/shaped-portals.95595/)
- [Discord *Community and development chat*](https://volmitsoftware.com/discord)
{.links-list}
