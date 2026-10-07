---
title: "API: Getting Started"
description: "Add Gloss as a dependency and use its public API"
published: true
date: 2026-10-07T15:57:31Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Use `art.arcane.gloss.api.GlossAPI` to manage holograms, scoreboards, tablist text, dropped-item presentations, text rendering, and menus.

## Dependency

Compile against the API jar that matches the installed Gloss version. Do not include Gloss API classes in your own jar.

```gradle
dependencies {
    compileOnly(files("libs/Gloss-3.2.0-26.2-api.jar"))
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

Reacquire the service after Gloss is disabled and enabled. Automatic config and content reloads keep the service valid.

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
tag.setStyle(IconDisplayStyle.hologramDefaults().withScale(0.9F, 0.9F, 0.9F));
tag.setBox(new HologramBox(true, 4, 1, null, null));
tag.bindPosition(entity, () -> entity.getLocation().add(0, 2.2, 0));
tag.viewers().whitelist();
tag.viewers().add(player.getUniqueId());
```

`Gloss.instance.holograms().setVisibilityObserver(temporary, (viewerId, visible) -> ...)` observes actual display admission and removal, including budget refusal after a visible frame, distance culling, and teardown. Register before showing the temporary hologram. Notifications contain IDs and run on the visibility or teardown caller; schedule entity reads on their owners. The callback must be brief and must not throw. A display that has never been admitted produces no initial `false` notification.

Use `setStyle(IconDisplayStyle)` for the shared text-display appearance and `setBox(HologramBox)` for an automatically sized background and border. Both follow the temporary hologram's position binding, presentation, and viewers. Box dimensions use Minecraft text pixels; decorations disappear with the hologram. `setParticleLayers(List<ParticleLayer>)` adds shared particle effects.

Use `setLines` for authored MiniMessage, functions, animations, player expressions, and PlaceholderAPI. With `[holograms] perViewerPlaceholders` enabled, Gloss resolves viewer-dependent content on each viewer's scheduler and measures that viewer's box from the rendered text. `setRenderedLines` and `bindRenderedFrames` accept section-formatted text without interpreting player-written markup or expressions. `setRenderedParticleText(String, List<ParticleTextSpan>)` supplies particle geometry and named ranges; it does not replace the displayed lines. Each range uses zero-based Java string offsets, with an exclusive end, in the supplied rendered text. `setRenderedLines` clears the prior particle override, so set its matching particle text afterward.

`bindRenderedFrames(LongFunction<List<String>>)` receives a wall-clock millisecond value on the animator's asynchronous packet loop. Its callback must be cheap, thread-safe, and free of Bukkit state reads; it can run more often than a server tick. Pass `null` to remove the frame binding and resume the stored lines. Publish corresponding particle text when a frame changes the geometry.

`bindRenderedViewerText(Function<Player, TemporaryHologram.RenderedText>)` supplies section-formatted literal text and particle spans for each viewer, sampled on that player's scheduler at the temporary hologram update interval and when animated particle geometry refreshes. Construct `RenderedText` with the text, a list of `ParticleTextSpan` ranges, and an optional `LongFunction<String>` animation frame source. Use an empty list for no named spans and `null` for no animation. Frame sources run on the asynchronous packet loop and must be thread-safe, cheap, and free of Bukkit state reads. Use immutable snapshots for item or entity data owned by another region. This binding works independently of `perViewerPlaceholders`; Gloss sizes each viewer's box and particle geometry from their resolved text. A non-null viewer binding replaces a frame binding, and a non-null frame binding replaces a viewer binding. Pass `null` to clear the viewer binding and resume the stored lines.

`bindPosition` and `bindPresentation` sample on their declared entity owner's scheduler. The presentation contains XYZ scale, XYZ rotation in degrees, and opacity. Its scale multiplies `IconDisplayStyle` scale; its opacity multiplies style text opacity. Presentation scales clamp to `0`–`16`, opacity to `0`–`1`, and finite rotations wrap through 360 degrees. Text, boxes, and particle transforms follow the same presentation. A null binder removes that binding.

All appearance types above are in `art.arcane.gloss.api` and ship in the API jar. `IconDisplayStyle.defaults()` uses fixed billboard and opaque glyphs; `hologramDefaults()` selects center billboard and see-through text. A partial style object uses the shared member defaults. `HologramBox.defaults()` disables decoration, and a null box restores that disabled default. See [Display style and boxes](/gloss/11-icons#display-style-and-boxes) for every field and range.

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

This applies Gloss functions, inline expressions, PlaceholderAPI values, emoji, and colors. A `null` player leaves player placeholders unresolved; use a real player for expressions that read player state. MiniMessage tags remain available for the display renderer to interpret.

## Beams and trails

<div class="gloss-demo" data-demo="standalone-beam-pov">
<p><strong>Standalone block-display beam</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/standalone-beam-pov.webm" aria-label="Standalone block-display beam, first person" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/gloss-assets/demos/standalone-beam-observer.webm" aria-label="Standalone block-display beam, third person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

`Beams.link` draws a block-display beam between two supplied locations. Each receiving viewer consumes one `SURFACE` entity unit from `[visibility]`; refused or culled beams retry during their normal updates. A positive lifetime is measured in ticks; `0` keeps it until cancelled. The method returns `null` when the beam service is unavailable.

```java
Location start = new Location(world, 8.5, 72, 8.5);
Location end = new Location(world, 16.5, 75, 8.5);
BeamHandle beam = Beams.link(start::clone, end::clone,
    BeamSpec.ofMaterial("minecraft:sea_lantern", 0.15),
    200L, Set.of(viewer.getUniqueId()));

Beams.trail(viewer, start, end, "minecraft:end_rod", 0.25, 64);
```

Beam width clamps to `0.01`–`8` blocks. Returning `null` from either location supplier ends the beam. Suppliers run on the beam driver's cadence; supply captured locations or thread-safe snapshots rather than reading a Bukkit entity from the callback. Retain each handle and call `cancel()` when its owning feature or plugin ends. `Beams.trail` sends a particle line to one viewer.

## Entity glow

<div class="gloss-demo" data-demo="viewer-glow-pov">
<p><strong>Per-viewer entity glow</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/viewer-glow-pov.webm" aria-label="Per-viewer entity glow, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Glow tags give an entity a colored outline for one viewer. Purposes keep contributions separate, and the highest priority wins:

```java
GlowTags.tag(viewer, target, "aqua", "quest-target", 20, 200L);
GlowTags.untag(viewer, target, "quest-target");
```

Use a named text color. A lifetime of `0` retains the tag until it is removed; remove your own purposes when the feature ends. Glow captures entity flags on the target owner and applies the result on the viewer owner, so appearance updates may complete after the call returns. A disabled glow feature or a request exceeding `[glow] maxTargetsPerViewer` throws `IllegalStateException`; use a configured distance limit to retain tags while withholding distant outlines. Named colors follow the shared `[teams]` conflict policy.

## Locator waypoints

Track an entry for a viewer with an explicit plugin owner:

```java
WaypointSpec destination = new WaypointSpec("quest-destination",
    MarkerAnchor.position("world", 120, 72, -48),
    0x55FFFF, "default", 64D);
Waypoints.track(this, viewer, destination);

WaypointSpec quest = new WaypointSpec("quest", MarkerAnchor.of(viewer.getLocation()),
    0x55FFFF, "trails:quest", 128);
Waypoints.track(this, viewer, quest, new WaypointOptions("bowtie"));
Waypoints.untrack(this, viewer, "quest-destination");
```

`WaypointOptions` selects the vanilla fallback used until the current Gloss pack provides a custom style. Declare that style in [glyphs waypoint assets](/gloss/28-resource-packs#waypoint-styles). The existing three-argument `Waypoints.track` call uses `default` as its fallback.

`WaypointSpec.style` accepts `default`, `bowtie`, or a namespaced resource key such as `trails:quest`. Null and blank values select `default`; keys are trimmed and lowercased, and `minecraft:default`/`minecraft:bowtie` select their built-in forms. Keys must not contain `..` or `//`, and the path must not begin or end with `/`. Other unnamespaced values and invalid resource paths throw `IllegalArgumentException` when constructing the spec. Pass an explicit built-in style when the integration does not provide a resource-pack key.

`MarkerAnchor.entity(UUID)` and `MarkerAnchor.player(String)` follow a moving target. A positive range sends direction-only information beyond that distance; `0` always supplies the exact location. Range clamps to `0`–`8192` blocks. Entries end when their viewer leaves. Call `Waypoints.unregister(this)` during your plugin's disable lifecycle to remove its remaining entries. The client must support the locator bar and have it enabled.

## Persistent state

`GlossStateAccess.get()` returns an optional `GlossStateProvider`. Declare keys before writing them, using a unique key prefix for your plugin:

```java
Optional<GlossStateProvider> provider = GlossStateAccess.get();
if (provider.isPresent()) {
    GlossStateProvider state = provider.get();
    state.declare(this, List.of(
        new GlossStateSpec("quest.points", "player", "number", 0D),
        new GlossStateSpec("quest.open", "global", "boolean", false)));
    state.set(viewer.getUniqueId(), "quest.points", 25D);
    state.setGlobal("quest.open", true);
    Object points = state.get(viewer.getUniqueId(), "quest.points");
}
```

Player keys use `get` and `set`; global keys use `global` and `setGlobal`. Types are `number`, `string`, and `boolean`, returned as `Double`, `String`, and `Boolean`. Undeclared keys, mismatched scopes, and conflicting declarations are rejected. Reacquire the provider and declare your keys when Gloss becomes available; do not call the provider after Gloss disables. The public provider has no declaration-removal method. [State actions](/gloss/12-actions#persistent-state-actions) use these declarations, and [expressions](/gloss/13-expressions-placeholders) can read their values.

## More APIs

- [API: Menus](/gloss/22-api-menus)
- [API: Placeholders](/gloss/23-api-placeholders)
- [API: Previews](/gloss/24-api-previews)
- [Particle Layers](/gloss/25-particle-layers)
{.links-list}
