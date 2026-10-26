---
title: "Impulse feature reference"
description: "Machine capabilities and control locations"
published: true
date: 2026-10-23T16:24:03.218Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Impulse has eight machine types. Each type has its own configured tier sequence.

| Capability | Where to use it |
| --- | --- |
| Harvest and replant mature crops, including torchflowers and pitcher crops | Harvester; stored seeds or pods for these two flowers |
| Pick berries, cut upper cane/cactus/bamboo segments, and harvest stem-grown fruit | Harvester |
| Damage eligible hostile mobs | Grinder |
| Fire arrows or splash potions from inventory | Launcher |
| Gather nearby dropped items | Collector |
| Break permitted blocks with tools | Breaker |
| Place permitted blocks from inventory | Placer |
| Shear adult sheep with stored shears | Shearer |
| Cut nearby logs and nether stems with stored axes | Chopper |
| Store inputs and outputs | Nine native dispenser slots |
| Pause and choose redstone behavior | Machine controls |
| Buy the next tier with XP or money | Machine controls |
| Compare current and next tier settings | Upgrade item descriptions |
| Preview the current working area | Spyglass in machine controls |
| Restrict materials, mobs, and consumed input slots | Per-type policy tables |
| Configure crafting shapes, ingredients, levels, and amounts | Per-type recipe tables |
| Grant trusted access | `/impulse trust` |
| Transfer ownership with recipient acceptance | `/impulse transfer` and `/impulse accept` |
| Edit server settings | `/impulse config` |
| Select and edit languages | `/impulse language` |
| Inspect plugin state | `/impulse status` and `/impulse debug` |
| Read machine action context and output provenance | Integration events and entity provenance API |

See [Machines](/impulse/05-machines) for action rules and [Configuration](/impulse/03-configuration) for tier fields.
