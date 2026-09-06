---
title: "API: Getting Started"
description: "Add Gloss as a dependency and use its public API"
published: true
date: 2026-09-06T00:23:42.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Use `art.arcane.gloss.api.GlossAPI` to manage holograms, scoreboards, tablist text, dropped-item presentations, text rendering, and menus.

## Dependency

Compile against the API jar that matches the installed Gloss version. Do not include Gloss API classes in your own jar.

```gradle
dependencies {
    compileOnly(files("libs/Gloss-3.0.1-26.2-api.jar"))
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
sign.setStyle(sign.style().withScale(2F, 2F, 2F).withBillboard(IconBillboard.FIXED));
sign.setBox(new HologramBox(true, 4, 1, null, null));
sign.setOrientation(45D, -10D);
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

Use `setStyle(IconDisplayStyle)` for the shared text-display appearance and `setBox(HologramBox)` for an automatically sized background and border. Both follow the temporary hologram's position binding, presentation, and viewers. Box dimensions use Minecraft text pixels; decorations disappear with the hologram. `setParticleLayers(List<ParticleLayer>)` adds shared particle effects.

Use `setLines` for authored MiniMessage, functions, animations, player expressions, and PlaceholderAPI. With `[holograms] perViewerPlaceholders` enabled, Gloss resolves viewer-dependent content on each viewer's scheduler and measures that viewer's box from the rendered text. `setRenderedLines` and `bindRenderedFrames` accept section-formatted text without interpreting player-written markup or expressions. Use `setRenderedParticleText` to attach span offsets to those rendered frames.

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

## Entity overlays

Gloss owns nearby entity health displays. `refreshEntityOverlay(LivingEntity, int stackCount)` publishes a stack count and returns whether Gloss owns the presentation. A true result also applies when an Adapt restriction hides the display. `removeEntityOverlayStack(LivingEntity)` removes that published count.

`updateEntityInsight(Plugin owner, Player viewer, LivingEntity target, List<String> details, long durationMs)` publishes viewer-specific detail lines and returns false when the overlay feature or owner is disabled. It accepts up to 16 lines of 1,024 characters each and clamps the contribution lifetime to 100 through 10,000 milliseconds. Call `clearEntityInsight(Plugin owner, UUID viewerId)` when the viewer loses their target.

`restrictEntityOverlays(Plugin owner, boolean restricted)` limits overlays to active Insight contributions while that owner requests the restriction. The request survives Gloss config reloads and is removed when its owner disables. It cannot turn on a disabled overlay feature. These operations capture identities and immutable text; Gloss samples entity data on the entity owner, evaluates viewer-dependent text on the viewer owner, and schedules each display mutation on its owner. The authored `lines` array controls where Insight details and React counts appear; runtime integrations supply data without defining the layout.

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

## Build artifacts

Gloss uses [shared automatic jar thinning](/volmlib/api/building#automatic-jar-thinning) during normal archive builds. SlimJar downloads bStats with the other external libraries before plugin enable. Run `./gradlew verifyPluginJars` to assemble and check the runtime jar without staging.
