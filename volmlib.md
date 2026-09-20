---
title: "VolmLib"
description: "The shared library behind the Volmit Software plugin suite"
published: true
date: 2026-09-20T04:21:21.395Z
tags: "volmlib"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

VolmLib is a library, not a server plugin. There is no jar to install: every Volmit plugin shades its own copy into its own jar.

These pages are for plugin developers building against it.

| | |
|---|---|
| What it is | A shaded Java library |
| Install | Nothing to install. It ships inside each plugin |
| Provides | Scheduling, commands, localization, diagnostics, PlaceholderAPI, NBT and region-file I/O, Bukkit utilities |
| Source | [github.com/VolmitSoftware/VolmLib](https://github.com/VolmitSoftware/VolmLib) |

- [API overview *Packages, dependencies, and threading*](/volmlib/api)
- [Noise and procedural streams *Seeded fields and interpolation*](/volmlib/api/noise)
- [Hunks and coordinate math *Storage, views, and executor ownership*](/volmlib/api/hunks)
- [Director commands *Hidden shortcuts and version output*](/volmlib/api/director)
- [Workspace builds *Build options and logs*](/volmlib/api/building)
- [Placeholders *PlaceholderAPI support*](/volmlib/api/placeholders)
- [Shared localization *Language selection and editing*](/volmlib/api/localization)
- [Shared diagnostic reports *Commands, contents, and API*](/volmlib/api/diagnostics)
- [GitHub release checks *Cached update detection and lifecycle*](/volmlib/api/github-releases)
- [Inventory-view access *Top inventories and viewers across Bukkit versions*](/volmlib/api/inventory-views)
- [Shared action bars and titles *Overlay priorities and claim lifecycle*](/volmlib/api/hud)
- [Native server access *Version selection, capabilities, and dependencies*](/volmlib/api/native-access)
- [Native spawn protection *Server decisions and capability handling*](/volmlib/api/spawn-protection)
{.links-list}
