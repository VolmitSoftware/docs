---
title: "API: Getting Started"
description: "Gloss documentation: API: Getting Started"
published: true
date: 2026-08-26
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Use `art.arcane.gloss.api.GlossAPI` to manage holograms, scoreboards, tablist text, dropped-item presentations, text rendering, and menus.

## Dependency

Compile against the API jar that matches the installed Gloss version. Do not include Gloss API classes in your own jar.

```gradle
dependencies {
    compileOnly(files("libs/Gloss-3.0.0-26.2-api.jar"))
}
```

Bukkit plugins:

```yaml
softdepend: [Gloss]
```

Paper plugins:

```yaml
dependencies:
  server:
    Gloss:
      load: BEFORE
      required: false
      join-classpath: true
```

Use a hard dependency instead when your plugin cannot run without Gloss.

## Get the API

Use the services manager for an optional dependency:

```java
RegisteredServiceProvider<GlossAPI> registration =
    Bukkit.getServicesManager().getRegistration(GlossAPI.class);

if (registration == null) {
    return;
}

GlossAPI gloss = registration.getProvider();
```

With a hard dependency, use `GlossAPI.get()`. It throws while Gloss is unavailable.

```java
GlossAPI gloss = GlossAPI.get();
```

Reacquire the service after Gloss is disabled and enabled. A normal `/gloss reload` does not invalidate it.

## Threading

Call menu `open` from the thread that owns the player. On Folia, use the player's scheduler. Hologram and item operations move entity work to the correct owner where documented.

## Holograms

```java
AnchoredHologram sign = gloss.createHologram("shop-sign", location);
sign.setLines(List.of("&d&lOpen daily", "&7Trade at spawn"));
sign.setScale(2.0);
sign.teleport(newLocation);

gloss.deleteHologram("shop-sign");
```

Persistent holograms are stored under `plugins/Gloss/holograms/`. Creating an existing id returns that hologram. Ids cannot be blank or contain `/`, `\`, or `..`.

Temporary holograms expire and are not written to disk:

```java
TemporaryHologram tag = gloss.createTemporaryHologram("combat-tag", location, 4000L);
tag.setRenderedLines(List.of("§c-4", "§7Critical hit"));
tag.bindPosition(entity, () -> entity.getLocation().add(0, 2.2, 0));
tag.viewers().whitelist();
tag.viewers().add(player.getUniqueId());
```

## Scoreboards and tablist

```java
gloss.setBoard(player, "event-board");
gloss.clearBoard(player);
Optional<String> board = gloss.boardFor(player);

gloss.setTab(player, "&dEvent night", "&7Round 3");
gloss.resetTab(player);
```

Board selections remain fixed until cleared. Tab overrides last until reset or the player leaves.

## Dropped items

Call `refreshDropName(Item)` after changing an item entity's stack. Call `removeDropPresentation(Item)` before removing an item entity directly.

## Text

```java
String rendered = gloss.filter(player, "&d|animation.rainbow| %player_name% :heart:");
```

This applies Gloss functions, PlaceholderAPI values, emoji, and colors. A `null` player leaves player placeholders unresolved.

## More APIs

- [API: Menus](/gloss/22-api-menus)
- [API: Placeholders](/gloss/23-api-placeholders)
- [API: Previews](/gloss/24-api-previews)
- [Particle Layers](/gloss/25-particle-layers)
{.links-list}
