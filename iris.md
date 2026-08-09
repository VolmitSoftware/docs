---
title: Iris
description: Iris world generation engine — overview
published: true
date: 2026-08-09T00:00:00.000Z
tags: iris
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Iris replaces vanilla world generation with its own engine. Worlds are described by data
packs — dimensions, regions, biomes, objects, jigsaw structures — and Iris assembles them at
generation time.

**Root command:** `/iris` (aliases `ir`, `irs`)
**Load order:** `STARTUP` — Iris must be present before worlds load
**Authors:** cyberpwn, NextdoorPsycho

## What it does

- **Data-pack driven generation.** Dimensions, regions, biomes, and objects are JSON files.
  Editing one and reloading regenerates the world without a restart in Studio mode.
- **Studio mode.** `/iris studio open` spins up a scratch world bound to a project. `/iris studio vscode`
  opens the project in an editor with schema completion for every Iris file type.
- **Object system.** `.iob` objects with their own placement rules, plus conversion from
  WorldEdit `.schem` files via `/iris object convert`.
- **Jigsaw structures.** Piece/pool/structure definitions assembled at generation time,
  editable in-game through `/iris jigsaw`.
- **Pregeneration.** Three pregenerators — `pregen`, `lazypregen`, and `turbopregen` — trading
  throughput against server impact.
- **World management.** Create, load, unload, evacuate, and remove Iris worlds at runtime.

## Where to go next

| Page | Covers |
|---|---|
| [Installation](/iris/installation) | Requirements, install, first world |
| [Commands](/iris/commands) | The complete `/iris` tree |
| [Developer API](/iris/api) | `IrisToolbelt` — accessing Iris from your own plugin |

## Support

[Discord](https://discord.gg/volmit) · [Source](https://github.com/VolmitSoftware/Iris) ·
[Dimension packs](https://github.com/IrisDimensions)
