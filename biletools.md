---
title: "BileTools"
description: "BileTools plugin hot-reload and deployment utility"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

# BileTools

A development utility. It watches the plugins directory and reloads any jar that changes on
disk, so a build in your IDE lands in the running server without a restart. It also does
plugman-style lifecycle commands and optional remote deployment.

| | |
|---|---|
| Command | `/biletools` (`bile`, `bi`, `b`, `volmit`, `vomit`, `vom`) |
| Folia | Supported |
| Permission | `bile.use` |
| Runtime | Java 25+, Paper API 26.2 |

> BileTools can load, unload and **delete** plugin jars, and its remote-deploy listener accepts
> jars over a socket. Treat `bile.use` as equivalent to console access. This belongs on a
> development server.
{.is-danger}

- [Installation *Requirements, install, first build*](/biletools/installation)
- [Commands & Permissions *The `/bile` tree*](/biletools/commands)
- [Configuration *Every `config.yml` key and default*](/biletools/configuration)
- [Hot Reload Behaviour *What works, what is best-effort, and why*](/biletools/hot-reload)
- [Remote Deploy *Master/slave jar distribution, and its security model*](/biletools/remote-deploy)
{.links-list}

## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/BileTools*](https://github.com/VolmitSoftware/BileTools)
- [Releases *Download built jars*](https://github.com/VolmitSoftware/BileTools/releases/)
{.links-list}
