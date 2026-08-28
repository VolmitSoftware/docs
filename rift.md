---
title: "Rift World Manager"
description: "Safe world creation, import, lifecycle, quarantine, restore, and teleport management"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "rift, world-management, bukkit, paper, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift manages Bukkit worlds through public APIs, validated TOML profiles, and recoverable lifecycle operations. The 3.0 rebuild uses Java 17 bytecode, contains no CraftBukkit or NMS binding, and replaces direct deletion with a confirmed quarantine-and-restore flow.

| | |
|---|---|
| Version | 3.0.0 |
| Compiled API range | Spigot 1.20.1 through 26.2 |
| Plugin bytecode | Java 17 |
| Server Java | The Java version required by the selected server, at least Java 17 |
| Command | `/rift` (`/rft`) |
| Storage | TOML configuration, profiles, and quarantine manifests |
| Folia | Loads safely; dynamic world create/load/unload operations are gated |

### Start here

- [Overview *World states, lifecycle, and safety model*](/rift/00-overview)
- [Installation & Compatibility *Server range, Java, build, and Folia limits*](/rift/01-installation-compatibility)
- [Commands & Permissions *Complete syntax and permission nodes*](/rift/02-commands-permissions)
- [Storage & Operations *Profiles, quarantine, protection, and recovery*](/rift/03-storage-operations)
- [Configuration & Localization *Hot reload, editor, and language overrides*](/rift/04-configuration-localization)
{.links-list}

## Support and source

- [Source *github.com/VolmitSoftware/Rift*](https://github.com/VolmitSoftware/Rift)
- [Discord *Community and development chat*](https://volmitsoftware.com/discord)
{.links-list}
