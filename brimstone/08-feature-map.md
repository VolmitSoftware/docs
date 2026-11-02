---
title: "Brimstone: Feature map"
description: "Implemented, partial, and planned features with their acceptance criteria"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "brimstone, features"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

This page lists each Brimstone feature as implemented, partial, or planned, with what proves it complete.

## Implemented

| Feature | Acceptance criterion |
|---|---|
| Seven effects with configurable recipes, fuel, cooldowns, names, fuse, velocity, radius, and fire | Every effect launches and detonates from a configured definition |
| Launch sounds, DJ sequence, varied fireworks, and rainbow colors | Sound timing does not change with particle settings |
| World rules and per-type permissions | Denied players keep their launcher and fuel |
| WorldGuard checks throughout an effect's life | Region denials hold at launch and where later effects land, and the access bypass leaves them in force |
| Per-player, per-world, and server-wide entity limits, a particle budget, and finite secondary lifetimes | Limits refuse new entities before any inventory cost |
| Owned-effect cleanup | `clear` and plugin disable remove owned effects and leave other entities alone |
| Startup version gate | Unsupported versions stop before libraries download |
| Sectioned TOML with validated file watching and operator notices | A bad file is rejected and the last valid settings stay active |
| Recipe changes without rejoining | A connected player crafts a changed launcher |
| Status, debug reports, and version commands | A report saves locally without an upload |
| Session counters | Reports and suite metrics agree on launch and refusal counts |
| Suite service | A separate plugin discovers it, negotiates a protocol, reads readiness, and sees it withdrawn on disable |
| Built-in English, 17 repository locales, custom `[meta]` locales, `language update`, personal choices, and editors | A selected locale installs from the repository and a later update keeps local edits |
| bStats ID `34582` with plugin and server-wide opt-outs | Disabling `metrics.enabled` stops the client without a restart |

## Partial

| Feature | Current state | Acceptance criterion |
|---|---|---|
| Coverage of every server target | Gameplay checks cover Paper and Folia 26.1.2 | Gameplay, file-change, and restart checks pass on each target in 26.1 through 26.3 |
| Plugin disable with active effects on Folia | Owned effects are removed on disable; a full server restart is the recommended path | Live disable removes owned effects on a supported Folia build |
| Update notices | The notice and its controls are in place; no GitHub release is published | A published release reaches a player with `brimstone.update` |
| Client presentation | Sound and particle packets are checked by automated clients | Sounds, particles, menus, and translated text are reviewed in a Minecraft client |

## Planned

| Feature | Acceptance criterion |
|---|---|
| BileTools hot reload | `/bile reload brimstone` twice in a row leaves no leaked tasks, commands, or channels, with TNT active |
| Configurable feedback channels | Command chat stays, with optional overlays and confirmation sounds, and operators choose gameplay notice channels |
| Cosmetic-only effects | Every effect can run with no block changes, fire, damage, or harmful secondary entities |
| Launch preview and recipe browser | Players inspect permitted launchers, ingredients, and fuel costs without consuming items, and displayed values match validated settings |
| Sound controls | Launch, repeating, and detonation sounds have separate volumes, and muting does not change gameplay |
| Translated example presets | Survival-cost, low-particle, and celebration examples show their costs and limits; harmless celebrations need cosmetic-only effects first |

## Related pages

- [Launchers and effects *Current gameplay behavior*](/brimstone/05-launchers-effects)
- [Diagnostics *Reports and console messages*](/brimstone/07-diagnostics)
{.links-list}
