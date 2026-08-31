---
title: "API: Menus"
description: "Gloss documentation: API: Menus"
published: true
date: 2026-08-26
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Use `GlossAPI` to open a holographic menu for one player.

## Create and open a menu

```java
HoloMenu menu = HoloMenu.builder()
    .id("example.confirm")
    .offset(0.0D, 0.5D, 2.5D)
    .maxDistance(6.0D)
    .component(HoloComponent.decoration(
        "title", 0.0D, 0.5D, 0.0D, HoloIcon.text("<gold>Continue?")))
    .component(HoloComponent.button(
        "yes", -0.4D, 0.0D, 0.0D, HoloIcon.text("<green>Yes"), click -> accept(click.player())))
    .component(HoloComponent.button(
        "no", 0.4D, 0.0D, 0.0D, HoloIcon.text("<red>No"), click -> click.handle().close()))
    .build();

HoloMenuHandle handle = gloss.open(plugin, player, menu);
```

IDs may contain letters, numbers, `_`, `-`, and `.`. Component IDs must be unique.

## Builder options

| Method | Default | Purpose |
|---|---:|---|
| `id(String)` | required | Menu ID |
| `offset(x, y, z)` | `0, 0, 2` | Position relative to the player |
| `lockPosition(boolean)` | `false` | Prevent movement while open |
| `followPlayer(boolean)` | `false` | Keep the menu in front of the player |
| `maxDistance(double)` | `8` | Close beyond this distance |
| `closeOnDeath(boolean)` | `true` | Close on death |
| `closeOnTeleport(boolean)` | `true` | Close on teleport |
| `component(HoloComponent)` | — | Add text, an image, an item, or a button |
| `particleLayer(ParticleLayer)` | — | Add a particle layer |

## Update or close it

```java
handle.setText("title", "<green>Saved");
handle.setVisible("yes", false);
handle.onClosed(reason -> cleanup(player.getUniqueId()));
handle.close();
```

Each player can have one personal menu. Opening another replaces it. Click handlers run on the player's owning thread, so they may safely read or change that player.

To open a menu from `plugins/Gloss/menus/`, use:

```java
HoloMenuHandle handle = gloss.open(plugin, player, "shop");
```

File-backed menu handles support lifecycle and closing, but not component mutation or API click handlers.

See [API: Getting Started](/gloss/21-api-getting-started), [Icons](/gloss/11-icons), and [Particle Layers](/gloss/25-particle-layers).
