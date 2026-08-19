---
title: "Volmit Software"
description: "Documentation for Iris, Adapt, React, Wormholes, Gloss, HiddenOre and BileTools"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "index"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

This wiki documents the plugins that Volmit Software maintains. Each link
opens that plugin's landing page. To suggest a change, open a pull request
or use Discord.

- [**Iris** *World generation engine. JSON packs define dimensions, biomes, caves, and jigsaw structures. The plugin has a live studio and three pregenerators.*](/iris)
- [**Adapt** *23 passive skill lines and 331 adaptations behind a bookshelf GUI, plus a mutations system.*](/adapt)
- [**React** *Performance tooling. Live samplers, entity governors, incident mode, and optional command shorthands.*](/react)
- [**Wormholes** *Portals that render the far side before you step through. RTP, dimensional doors, pocket dimensions, cross-server gateways.*](/wormholes)
- [**Gloss** *Display suite. Holograms, holographic menus, world panels, container previews, scoreboards, tablist, and chat polish, with a web editor.*](/gloss)
- [**HiddenOre** *Mining drop-control and anti-xray. Rewards come from ordinary stone and deepslate. An xray client finds nothing.*](/hiddenore)
- [**BileTools** *Development utility. Rebuild a jar. The plugin then reloads in the game.*](/biletools)
{.links-list}

[VolmLib](/volmlib) is the shared library for the suite. Plugin developers
use the [VolmLib API](/volmlib/api).

## Compatibility

Every plugin uses the same modern baseline.

| Plugin | Java | Paper API | Folia | Load | Root command |
|---|---|---|---|---|---|
| [Iris](/iris) | 25 | 26.x+ | Yes | `STARTUP` | `/iris` `/ir` `/irs` |
| [Adapt](/adapt) | 25 | 26.x+ | Yes | default | `/adapt` |
| [React](/react) | 25 | 26.x+ | Yes | default | `/react` `/re` |
| [Wormholes](/wormholes) | 25 | 26.x+ | Yes | `STARTUP` / `POSTWORLD` | `/wormholes` `/wh` |
| [Gloss](/gloss) | 25 | 26.x+ | Yes | `STARTUP` / `POSTWORLD` | `/gloss` `/gl` `/gg` |
| [HiddenOre](/hiddenore) | 25 | 26.x+ | Yes | `STARTUP` | `/hiddenore` |
| [BileTools](/biletools) | 21 | 1.20.x+ | Yes | default | `/biletools` `/bile` |
{.dense}

> Iris, Adapt, and React use the `unification` branch. The `master` branches
> are older. Those branches target earlier Minecraft versions. If you build
> from `master`, you get a different plugin than these pages describe.
{.is-info}

## Load order

Iris declares `loadbefore: Multiverse-Core`. Iris loads at `STARTUP`.
Wormholes and Gloss each ship two descriptors. Paper reads
`paper-plugin.yml` and loads at `STARTUP`. Spigot uses `plugin.yml` and
loads at `POSTWORLD`. HiddenOre also loads at `STARTUP`.

## Permissions at a glance

| Plugin | Nodes | Shape |
|---|---|---|
| [Iris](/iris/04-commands-permissions) | 2 | `iris.all` covers the whole tree. `iris.treefeller` is the one player-facing node |
| [Adapt](/adapt/04-commands-permissions) | 13 | Per-feature: gui, boost, mutations, clear, determine, configurator |
| [React](/react/02-commands-permissions) | 10 | `react.use` plus seven opt-in shorthand nodes |
| [Wormholes](/wormholes/09-commands-permissions) | 12 declared yml nodes plus dynamic `wormholes.portal.<sanitized-name>` | Grouped tree. `wormholes.portals` defaults to **true** |
| [Gloss](/gloss/17-commands-permissions) | 44 declared yml nodes plus dynamic `gloss.open.<menuId>` and `gloss.bubbles.style.<styleId>` | Grouped tree per feature. `gloss.emoji.use`, `gloss.bubbles.send`, and `gloss.indicators.show` default to **true** |
| [HiddenOre](/hiddenore/commands) | 1 | `hiddenore.admin` |
| [BileTools](/biletools/commands) | 1 | `bile.use` is equal to console access |
{.dense}

## Warnings

> **Wormholes lets everyone build portals by default.** `wormholes.portals`
> and its two children default to `true`. Every other node in the suite
> defaults to `op`.
{.is-warning}

> **A HiddenOre item-rule identity change moves undiscovered veins.**
> Reordering `drops:` does not move veins. If you add or remove an unrelated
> rule, each retained rule keeps its layout except where the rules overlap.
> A change to an item rule's material or spatial generation fields gives
> that rule a new undiscovered layout.
{.is-warning}

> **BileTools can delete jars and accept them over a socket.** `bile.use` is
> equal to console access. Remote deploy uses a plaintext shared secret. Use
> BileTools on development machines only.
{.is-danger}

> **React shorthands collide with EssentialsX and CMI.** `/gms`, `/gmc`,
> `/more`, `/rl`, and similar commands are off by default. Check those
> plugins before you enable the shorthands.
{.is-warning}

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

- [Iris — pack layout and concepts *How you assemble a dimension*](/iris/05-concepts-pack-layout)
- [Iris — a minimal dimension *Worked example from empty folder*](/iris/26-example-minimal-dimension)
- [Adapt — skills catalog *All 23 lines and what they level from*](/adapt/10-skills-catalog)
- [Wormholes — building portals *Wand, runes, frame rules*](/wormholes/03-building-portals)
- [Gloss — hologram menus *JSON structure and examples*](/gloss/09-menus)
{.links-list}

#### Operations

- [Iris — performance tuning *Where generation time goes*](/iris/33-performance-tuning)
- [React — samplers and metrics *What each metric measures*](/react/10-samplers-metrics)
- [React — incident mode and playbooks *When TPS has already dropped*](/react/12-incident-mode-playbooks)
- [Wormholes — operator runbooks *Manual smoke checks*](/wormholes/14-operator-runbooks-smoke-tests)
- [BileTools — hot reload behavior *When to restart instead of a hot reload*](/biletools/hot-reload)
{.links-list}

#### Developer APIs

- [Iris — API getting started *Terrain, world events, tree feller, modded*](/iris/90-api-getting-started)
- [Adapt — API getting started *Skills, adaptations, mutations, events*](/adapt/41-api-getting-started)
- [React — API getting started *Metric publishing and entity protection*](/react/16-api-getting-started)
- [Wormholes — traversal cost and events *Price and intercept player travel*](/wormholes/21-api-traversal-cost-events)
- [Gloss — API getting started *Menus, holograms, and previews from other plugins*](/gloss/21-api-getting-started)
- [HiddenOre — API overview *Hook the mining reward pipeline*](/hiddenore/api)
{.links-list}

## Help

- [Discord *Support and development chat*](https://volmitsoftware.com/discord)
- [GitHub *Sources, issues, releases*](https://github.com/VolmitSoftware)
- [Contributing *This wiki takes pull requests*](/contributing)
{.links-list}
