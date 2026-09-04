---
title: "VolmLib API"
description: "VolmLib documentation: API overview for plugin developers"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "volmlib, api"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

VolmLib is a Java library used by Volmit plugins. Add only the modules your plugin uses and bundle VolmLib with your plugin.

For the shared build script, concurrency controls, and tests-only runs, see [Workspace builds](/volmlib/api/building).

## Common packages

| Package | Use |
|---|---|
| `util.scheduling` | Paper/Folia-safe global, region, and entity tasks |
| `util.bukkit.papi` | PlaceholderAPI expansions and snapshot stores |
| `util.director` | Commands, help, and completion |
| `util.localization` | Message catalogs, on-demand translations, and player language preferences |
| `util.diagnostics` | Shared Bukkit diagnostic reports, plugin snapshots, and uploads |
| `util.plugin` | Rich text, messages, titles, and logging |
| `util.board` | Scoreboard sidebars |
| `util.inventorygui` | Inventory menus |
| `util.config` | Typed TOML configuration |
| `util.io` | File and directory change detection |
| `util.nbt` / `util.nbt.mca` | NBT and region files |
| `util.noise` / `util.stream` | Procedural generation |

## Dependency

```groovy
repositories {
    maven { url = uri('https://jitpack.io') }
}

dependencies {
    implementation('com.github.VolmitSoftware:VolmLib:<version>')
}
```

Relocate `art.arcane.volmlib` to a package owned by your plugin when shading. Do not expose VolmLib types in a public API shared with another plugin; each plugin normally has its own relocated copy.

## Text

Use `ComponentText.markup(...)` for trusted MiniMessage templates and `ComponentText.literal(...)` for player or external text. Send it with `ComponentMessenger`. `clickOpenUrl(...)` accepts HTTP and HTTPS URLs.

## Commands

Director accepts keyed values such as `player=Alex`. Use brackets for spaces:

```text
/example announce text=[Server restarts in five minutes]
```

Aliases remain executable, while help and completion show canonical command names.

## Block support

`BSupport.isUpdatable(...)` recognizes exposed pointed-dripstone and sulfur-spike tips through the server’s speleothem API; body and merged-tip segments are excluded. On the supported Bukkit 26.1.2 boundary, pointed-dripstone detection uses that version’s API.

## Threading

Use `FoliaScheduler` for Bukkit work. Entity and player state belongs on the entity scheduler; world and block state belongs on the owning region; global tasks use the global scheduler. Keep file and network I/O off those threads.

## File watching

`FileWatcher` and `FolderWatcher` combine filesystem snapshots with native watch events. A full scan reports each create or delete transition once, including on Windows where the native delete notification may arrive after the scan has already observed the missing path. Native modification events still detect writes whose size, timestamp, and file identity remain unchanged.

For PlaceholderAPI, see [Placeholders](/volmlib/api/placeholders).

For downloads, jar packaging, server defaults, player preferences, and the per-language inventory editor, see [Shared localization](/volmlib/api/localization).

For the `debugdump` command, report contents, permissions, and plugin contributors, see [Shared diagnostic reports](/volmlib/api/diagnostics).
