---
title: "VolmLib API"
description: "VolmLib documentation: API overview for plugin developers"
published: true
date: 2026-08-30
tags: "volmlib, api"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---

VolmLib is a Java library used by Volmit plugins. Add only the modules your plugin uses and bundle VolmLib with your plugin.

## Common packages

| Package | Use |
|---|---|
| `util.scheduling` | Paper/Folia-safe global, region, and entity tasks |
| `util.bukkit.papi` | PlaceholderAPI expansions and snapshot stores |
| `util.director` | Commands, help, and completion |
| `util.localization` | Localized message catalogs |
| `util.plugin` | Rich text, messages, titles, and logging |
| `util.board` | Scoreboard sidebars |
| `util.inventorygui` | Inventory menus |
| `util.config` | Typed TOML configuration |
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

## Threading

Use `FoliaScheduler` for Bukkit work. Entity and player state belongs on the entity scheduler; world and block state belongs on the owning region; global tasks use the global scheduler. Keep file and network I/O off those threads.

For PlaceholderAPI, see [Placeholders](/volmlib/api/placeholders).
