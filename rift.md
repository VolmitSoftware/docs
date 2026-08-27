---
title: "Rift World Manager"
description: "Legacy world creation, loading, import, unload, deletion, and teleportation"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "rift, legacy, world-management"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift 2.0.2 is a lightweight world manager for creating, importing, loading,
unloading, listing, deleting, and entering Bukkit worlds.

| | |
|---|---|
| Status | Legacy; source repository archived |
| Audited version | 2.0.2 |
| Server target | Spigot 1.19 / CraftBukkit `v1_19_R1` |
| Build/runtime Java | 17 |
| Command | `/rift` (`/rft`, `/ri`, `/rt`) |
| Permissions | `rift.admin`, plus `rift.teleport` for `/rift to` |
| Folia | Unsupported |

> **Do not deploy this build as a general-purpose world manager without reviewing
> the audit.** `/rift delete` recursively deletes the path supplied to it without
> validating that the path is a world, and deletion-queue persistence is broken.
> Use a full server backup and prefer stopped-server, manual deletion.
{.is-danger}

These pages document the archived source as it exists. They are not a claim of
compatibility with current Paper, Spigot, or Minecraft releases.

### Start here

- [Overview *Scope, concepts, and lifecycle*](/rift/00-overview)
- [Installation & Compatibility *Exact 1.19 binding and source build*](/rift/01-installation-compatibility)
- [Commands & Permissions *Syntax, generators, and safety notes*](/rift/02-commands-permissions)
- [Storage & Operations *Files, backups, recovery, and safer procedures*](/rift/03-storage-operations)
- [Code Audit *Findings, impact, and remediation priorities*](/rift/04-code-audit)
{.links-list}

## Support and source

- [Source *github.com/VolmitSoftware/Rift*](https://github.com/VolmitSoftware/Rift)
- [Audited revision *26a5324, 8 June 2022*](https://github.com/VolmitSoftware/Rift/tree/26a532424716da8a708cd16e83917614065cd64d)
- [Discord *Community and development chat*](https://volmitsoftware.com/discord)
{.links-list}
