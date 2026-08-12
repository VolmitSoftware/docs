---
title: "VolmLib"
description: "The shared library behind the Volmit Software plugin suite"
published: true
date: 2026-08-12T00:00:00.000Z
tags: "volmlib"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

VolmLib is the shared library the Volmit Software plugins are built out of: Folia-aware
scheduling, the Director command framework, localization, PlaceholderAPI plumbing, NBT and
region-file IO, and the common Bukkit helpers. It is a **library, not a plugin** — nothing
loads it on the server; it is compiled and shaded into each plugin's jar.

These pages are for plugin developers integrating with or building on VolmLib.

- [**API overview** *Modules, the relocation rule, and how plugins consume VolmLib.*](/volmlib/api)
- [**Placeholders** *The shared PlaceholderAPI plumbing.*](/volmlib/api/placeholders)
{.links-list}
