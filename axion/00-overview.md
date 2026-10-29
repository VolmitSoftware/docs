---
title: "Axion: Overview"
description: "Place a controller and run its first route"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "axion, automation"
editor: "markdown"
dateCreated: 2026-10-15T00:00:00.000Z
---

A machine follows the direction you faced when placing it. It stores collected items in its controller and uses configured fuel for successful work cycles.

## First machine

1. Run `/axion give <player> 1` as an operator, then place the signed controller item facing the work area.
2. Right-click the controller to open its panel. Open Storage and add ordinary fuel, such as coal.
3. Select the work modes you need, then use `/axion preview` while looking at the controller before starting work.

Owners must be online. Machines use loaded chunks only; on Folia the owner and targets must be owned by the executing region.

## Common commands

| Command | What it does | Run from |
| --- | --- | --- |
| `/axion` | Show help | Player or console |
| `/axion menu` | Open the controller you are looking at | Player |
| `/axion inspect` | Show its state and pause reason | Player |
| `/axion preview` | Estimate its route without changing blocks or consuming fuel | Player |
| `/axion status` | Show registered machines and runtime settings | Player or console |
{.dense}

Empty a controller's storage and close its viewers before crouching and left-clicking it to pick it up. Ordinary breaking cannot turn a controller into an unsigned container. Collection requires the owner or an administrator with `axion.accessall`, even when shared use is enabled.

## Related pages

- [Installation *Server requirements and setup*](/axion/01-installation)
- [Commands and permissions *Administration and access*](/axion/02-commands-permissions)
- [Machines and routes *Modes, signs, and upgrades*](/axion/05-machines-routes)
{.links-list}
