---
title: "Brimstone: Overview"
description: "What Brimstone does and the first things to try"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "brimstone, overview"
editor: markdown
dateCreated: 2026-11-02T00:00:00.000Z
---

Brimstone adds custom TNT items called launchers. A player holds one, left-clicks the air, and throws primed TNT that plays one of seven effects and explodes with the radius and fire setting of that launcher.

Each launch costs the launcher item and its fuel, and it must pass permissions, world rules, the cooldown, and entity limits. Launchers can be crafted from ordinary TNT or given by command.

## First steps

1. Run `/brimstone status` to confirm the plugin is running and see the launcher count.
2. Run `/brimstone give notch <player> 1`, hold some gunpowder for fuel, and left-click the air.
3. Run `/brimstone config` to change recipes, limits, and launcher settings in game, or edit `brimstone.toml` and save it.

## Common commands

| Command | What it does | Run from |
|---|---|---|
| `/brimstone list` | List configured launcher IDs | Player or console |
| `/brimstone give <id> <player> [amount]` | Give launchers to an online player | Player or console |
| `/brimstone status` | Show the version, launcher count, and active effects | Player or console |
| `/brimstone clear` | Remove owned TNT and secondary effects | Player or console |
| `/brimstone config` | Open the settings editor | Player |
{.dense}

## Related pages

- [Installation *Requirements, first start, and file locations*](/brimstone/01-installation)
- [Commands and permissions *Every command and permission node*](/brimstone/02-commands-permissions)
- [Launchers and effects *How launching and each effect work*](/brimstone/05-launchers-effects)
{.links-list}
