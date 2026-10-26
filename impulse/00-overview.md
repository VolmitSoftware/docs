---
title: "Impulse overview"
description: "Place, control, and recover dispenser machines"
published: true
date: 2026-10-22T00:00:00.000Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Impulse machines are tagged dispenser items. Ordinary dispensers retain their normal behavior.

## Place a machine

Craft a machine or ask an administrator to give you one. For example:

```none
/impulse give PlayerName collector 1 1
```

Place it like a dispenser. Placement assigns ownership to the player who places it. The per-chunk machine limit applies to placement.

## Controls

Right-click the machine to open its controls. Use **Open storage** to access its nine slots, or sneak-right-click the block.

The controls provide pause/resume, redstone mode, upgrades, and effective tier settings. The owner and players with `impulse.admin` can manage the machine. Hoppers can access the native dispenser inventory.

## Recover a machine

Break it with a suitable pickaxe in survival mode. Recovery returns the tagged machine core with its level and drops the stored items separately. Place the recovered core to assign its new owner; its storage starts empty.

See [Machines](/impulse/05-machines) for each action and [Permissions](/impulse/02-commands-permissions) for access rules.
