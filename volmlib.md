---
title: "VolmLib"
description: "The shared library behind the Volmit Software plugin suite"
published: true
date: 2026-09-03T07:42:04.994Z
tags: "volmlib"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

VolmLib is the shared library behind the Volmit Software plugins. It supplies
Folia-aware scheduling, the Director command framework, localization,
PlaceholderAPI plumbing, NBT and region-file IO, and the common Bukkit helpers.
VolmLib is a **library, not a plugin**. Nothing loads it on the server. Each
plugin compiles and shades it into its jar.

These pages are for plugin developers who use VolmLib.

- [API overview *Modules, the relocation rule, and how plugins consume VolmLib.*](/volmlib/api)
- [Workspace builds *Parallel builds, tests-only runs, local dependencies, and logs.*](/volmlib/api/building)
- [Placeholders *The shared PlaceholderAPI plumbing.*](/volmlib/api/placeholders)
- [Shared localization *Language downloads, server defaults, player preferences, and per-language message editing.*](/volmlib/api/localization)
- [Shared diagnostic reports *Debug dumps, per-plugin permissions, report contents, and upload controls.*](/volmlib/api/diagnostics)
{.links-list}
