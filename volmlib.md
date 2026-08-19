---
title: "VolmLib"
description: "The shared library behind the Volmit Software plugin suite"
published: true
date: 2026-08-19T00:00:00.000Z
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
- [Placeholders *The shared PlaceholderAPI plumbing.*](/volmlib/api/placeholders)
{.links-list}
