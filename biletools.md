---
title: "BileTools"
description: "Plugin hot-reload and deployment utility"
published: true
date: 2026-10-07T13:32:12.955Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

BileTools watches the plugins directory and reloads changed jars, adds manual plugin lifecycle commands, and can deploy jars to other development servers.

The same jar runs on Bukkit servers and on Velocity proxies.

| | |
|---|---|
| Command | `/biletools` (`bile`, `bi`, `b`, `vomit`, `vom`) |
| Platforms | Paper-family servers, Folia, and Velocity 3.4+ proxies |
| Permission | `bile.use` |
| Runtime | Java 17 or newer, Bukkit API 1.20.1 or newer |
| Config file | `plugins/BileTools/biletools.yml` |

> BileTools can load, unload, and **delete** plugin jars. The remote-deploy
> listener accepts jars over a socket. Treat `bile.use` as equivalent to console
> access. Use this plugin on a development server.
{.is-danger}

- [Installation *Requirements and setup*](/biletools/installation)
- [Commands and permissions *The `/bile` command tree*](/biletools/commands)
- [Configuration *Settings and defaults*](/biletools/configuration)
- [Hot reload behavior *Limits and restart guidance*](/biletools/hot-reload)
- [Velocity proxy *Hot reload for proxy plugins*](/biletools/velocity)
- [Remote deploy *Setup and security*](/biletools/remote-deploy)
- [Plugin integration API *Cooperative reload and owned registrations*](/biletools/api)
{.links-list}

## Support

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [Source *github.com/VolmitSoftware/BileTools*](https://github.com/VolmitSoftware/BileTools)
- [Releases *Download built jars*](https://github.com/VolmitSoftware/BileTools/releases/)
- [Spigot *spigotmc.org*](https://www.spigotmc.org/resources/biletools-test-plugins-faster.54823/)
- [BuiltByBit *builtbybit.com*](https://builtbybit.com/resources/biletools-test-plugins-faster.121368/)
- [MCModels *mcmodels.net*](https://mcmodels.net/products/17491/biletools-test-plugins-faster)
{.links-list}
