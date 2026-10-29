---
title: "Axion: Commands and permissions"
description: "Player commands and operator permissions"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "axion, automation"
editor: "markdown"
dateCreated: 2026-10-15T00:00:00.000Z
---

`/ax` is an alias for `/axion`. Running either command without arguments opens Director help; help pages and command completion omit commands the sender cannot use, including nested debug actions.

## Commands

| Command | What it does | Run from |
| --- | --- | --- |
| `/axion` | Show command help | Player or console |
| `/axion status` | Show machine count, supported runtime, scheduler, and server language | Player or console |
| `/axion give <player> <tier> [amount=1]` | Give signed controllers to an online player; amount is 1 to 64 | Player or console |
| `/axion menu` | Open the targeted controller | Player |
| `/axion inspect` | Show the targeted controller's state | Player |
| `/axion preview` | Plan its route without world changes or fuel use | Player |
| `/axion config` | Open the configuration editor | Player |
| `/axion language` | Open language controls | Player or console |
| `/axion debug version` | Show the installed version | Player or console |
| `/axion version` | Hidden alias for `debug version` | Player or console |
| `/axion debug dump [upload=true]` | Save diagnostics and request an upload when enabled | Player or console |
{.dense}

Use `/axion debug dump upload=false` for a local report. The [shared language guide](/languages) covers personal selection, server defaults, and message editing.

## Permissions

Everyone means `true`; Operators means `op`.

| Permission | Default | Allows |
| --- | --- | --- |
| `axion.command` | Everyone | Help, status, and version access |
| `axion.use` | Everyone | Machine placement and use |
| `axion.admin` | Operators | Giving controllers; includes configuration and debug permissions |
| `axion.config` | Operators | Configuration editor and server language controls |
| `axion.debug` | Operators | Diagnostic dumps |
| `axion.language.self` | Everyone | Personal language selection |
| `axion.update` | Operators | Axion release notices |
| `axion.accessall` | Operators | Access and collect other owners' controllers |
| `axion.upgrade.xp` | Everyone | Buy an upgrade with experience levels |
| `axion.upgrade.money` | Everyone | Buy an upgrade through Vault |

Shared language controls also use `volmit.language.self` and `volmit.language.admin`. `/volmit plugins updates` lists release checks, and `/volmit plugins debug all` includes Axion diagnostics.

Shared machine access still requires `axion.use`. Upgrade permissions do not override disabled payment methods. `/axion give` accepts configured tier numbers and uses `settings.controllerMaterial` for the item.

## Related pages

- [Configuration *Editor controls and settings*](/axion/03-configuration)
- [Languages *Axion message files*](/axion/04-languages)
- [Diagnostics *Report contents and failures*](/axion/07-diagnostics)
{.links-list}
