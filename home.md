---
title: Volmit Software
description: Documentation for Iris, Adapt, React, Wormholes, Gloss, HiddenOre and BileTools
published: true
date: 2026-08-19T17:19:05.149Z
tags: index
editor: markdown
dateCreated: 2026-07-31T23:34:19.060Z
---

# Volmit Software

Below are links to Volmits actively maintained software documentation. Please feel free to suggest any changes to the wiki.

- [**Iris** *World generation engine. Dimensions, biomes, caves and jigsaw structures authored as JSON packs, with a live studio and three pregenerators.*](/iris)
- [**Adapt** *23 passive skill lines and 331 adaptations behind a bookshelf GUI, plus a mutations system.*](/adapt)
- [**React** *Performance tooling. Live samplers, entity governors, incident mode, and optional command shorthands.*](/react)
- [**Wormholes** *Portals that render the far side before you step through. RTP, dimensional doors, pocket dimensions, cross-server gateways.*](/wormholes)
- [**Gloss** *Display suite. Holograms, holographic menus, world panels, container previews, scoreboards, tablist and chat polish, with a web editor.*](/gloss)
- [**HiddenOre** *Mining economy and anti-xray. Ore pays out of plain stone, so there is nothing to xray.*](/hiddenore)
- [**BileTools** *Dev utility. Rebuild a jar and it is already reloaded in game.*](/biletools)
{.links-list}

[VolmLib](/volmlib), the shared library the suite is built on, is documented for plugin
developers under [/volmlib/api](/volmlib/api).

## Compatibility

Every plugin targets the same modern baseline.

| Plugin | Java | Paper API | Folia | Load | Root command |
|---|---|---|---|---|---|
| [Iris](/iris) | 25 | 26.x+ | Yes | `STARTUP` | `/iris` `/ir` `/irs` |
| [Adapt](/adapt) | 25 | 26.x+ | Yes | default | `/adapt` |
| [React](/react) | 25 | 26.x+ | Yes | default | `/react` `/re` |
| [Wormholes](/wormholes) | 25 | 26.x+ | Yes | `STARTUP` / `POSTWORLD` | `/wormholes` `/wh` |
| [Gloss](/gloss) | 25 | 26.x+ | Yes | `STARTUP` / `POSTWORLD` | `/gloss` `/gl` `/gg` |
| [HiddenOre](/hiddenore) | 25 | 26.x+ | Yes | `STARTUP` | `/hiddenore` |
| [BileTools](/biletools) | 17 | 1.20.x+ | Yes | default | `/biletools` `/bile` |
{.dense}

## Starting points

### By task {.tabset}

#### Setting up

- [Iris — installation and platforms *Requirements, install, first world*](/iris/01-installation-platforms)
- [Adapt — installation and configuration *Setup, config layout, first run*](/adapt/01-installation-configuration)
- [React — installation and configuration *Setup and the shorthands decision*](/react/01-installation-configuration)
- [Wormholes — installation and configuration *Setup and projection budgets*](/wormholes/01-installation-configuration)
- [Gloss — getting started *Data folder, feature toggles, first boot*](/gloss/01-getting-started)
- [HiddenOre — installation *Two decisions to make before players mine*](/hiddenore/installation)
- [BileTools — installation *Requirements and verifying hot reload*](/biletools/installation)
{.links-list}

#### Authoring content

- [Iris — pack layout and concepts *How a dimension is assembled*](/iris/05-concepts-pack-layout)
- [Iris — a minimal dimension *Worked example from empty folder*](/iris/26-example-minimal-dimension)
- [Adapt — skills catalog *All 23 lines and what they level from*](/adapt/10-skills-catalog)
- [Wormholes — building portals *Wand, runes, frame rules*](/wormholes/03-building-portals)
- [Gloss — hologram menus *JSON structure and examples*](/gloss/09-menus)
{.links-list}

#### Operations

- [Iris — performance tuning *Where generation time goes*](/iris/33-performance-tuning)
- [React — samplers and metrics *What each metric measures*](/react/10-samplers-metrics)
- [React — incident mode and playbooks *When TPS is already on fire*](/react/12-incident-mode-playbooks)
- [Wormholes — operator runbooks *Manual smoke checks*](/wormholes/14-operator-runbooks-smoke-tests)
- [BileTools — hot reload behaviour *When to stop trusting it and restart*](/biletools/hot-reload)
{.links-list}

#### Developer APIs

- [Iris — API getting started *Terrain, world events, tree feller, modded*](/iris/90-api-getting-started)
- [Adapt — API getting started *Skills, adaptations, mutations, events*](/adapt/41-api-getting-started)
- [React — API getting started *Metric publishing and entity protection*](/react/16-api-getting-started)
- [Wormholes — traversal cost and events *Price and intercept player travel*](/wormholes/21-api-traversal-cost-events)
- [Gloss — API getting started *Menus, holograms and previews from other plugins*](/gloss/21-api-getting-started)
- [HiddenOre — API overview *Hook the mining reward pipeline*](/hiddenore/api)
{.links-list}

## Help

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [GitHub *Sources, issues, releases*](https://github.com/VolmitSoftware)
- [Contributing *This wiki takes pull requests*](/contributing)
{.links-list}
