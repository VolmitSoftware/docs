---
title: "API - Icons, Art and Themes"
description: "Asset bundle layout, icons, theme kits, the hover frame data, and client code for frames"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

An addon ships its art in an asset bundle: icons, a theme for each skill, mutation emblems and trims, and models. The asset types are experimental.

## Asset bundle

Lay the files out as in a resource pack, below `assets/<namespace>/` in the addon jar, and register the folder:

```java
registrar.assets(AssetBundle.resources(GeologyAddon.class, "assets/example"));
```

The last segment of the root is the bundle's namespace and must be the addon's. One declaration serves every player: clients with the Adapt client mod receive the files over Adapt's channel, and vanilla clients on Paper, Purpur, Folia and Spigot receive them in Adapt's resource pack.

| File below `assets/<namespace>/` | Kind | Size |
|---|---|---|
| `textures/gui/skill/<path>.png` | Skill icon | 16x16 |
| `textures/gui/adaptation/<path>.png` | Adaptation icon | 16x16 |
| `textures/gui/preference/<owner path>/<preference id>/<choice>.png` | Preference choice icon | 16x16 |
| `textures/gui/emblem/<skill>.png` | Emblem a skill gives a mutation it leads | 16x16 |
| `textures/gui/trim/<skill>.png` | Trim a skill gives a mutation it joins as partner | 16x16 |
| `textures/gui/theme/<skill>.png` | Theme atlas of a skill | |
| `textures/gui/<other>/<path>.png`, `textures/font/<path>.png` | Other GUI art, any size | |
| `textures/<other>/<path>.png` | Anything else, such as item textures; copied into the pack | |
| `themes/<skill>.json` | Theme kit of a skill | |
| `models/<path>.json` | Resource pack model | |

A texture's id is its path below `textures/` without the extension: the file `textures/gui/skill/geology.png` is the sprite `example:gui/skill/geology`. A theme kit and its atlas both have the id of their skill, so `themes/geology.json` and `textures/gui/theme/geology.png` would theme `example:geology`. A model's id is its path below `models/`.

The owner path of a preference icon is the path of the skill or adaptation that declares the preference. Core Sample's Delivery choices would be `textures/gui/preference/geology/core_sample/delivery/drop.png` and `.../inventory.png`. A choice without its own file falls back to Adapt's common choice art.

Adapt checks every file when the addon installs. A skill, adaptation, preference, emblem or trim image that is not a 16x16 PNG, an atlas that is not a PNG, a kit that does not parse, or a file over 512 KiB is skipped with one logged error naming the file; the rest of the bundle installs.

The example addon's art is one icon per skill and adaptation:

```none
src/main/resources/assets/example/
  textures/gui/skill/geology.png
  textures/gui/adaptation/geology/stone_skin.png
  textures/gui/adaptation/geology/prospect.png
  textures/gui/adaptation/geology/core_sample.png
  textures/gui/adaptation/geology/geode_lens.png
  textures/gui/adaptation/pickaxe/aftershock.png
```

It ships no theme kit, emblem or trim, so Geology gets a generated theme and generated mutation art.

## Icons

An `Icon` says how a skill, adaptation, advancement or preference choice is drawn.

| Part | Used by |
|---|---|
| `item` | Every client, wherever nothing better is available |
| `sprite` | Clients with the Adapt client mod, and book pages from Adapt's resource pack, when the sprite is in an asset bundle |
| `customModelData` | Item stacks shown to vanilla clients, for a server pack that keys models by custom model data |
| `itemModel` | Vanilla clients with a server pack that has the model, such as Adapt's resource pack |

```java
setIcon(Icon.item(Id.minecraft("tuff"))
    .sprite(Id.of(GeologyAddon.NAMESPACE, "gui/skill/geology"))
    .itemModel(Id.of(GeologyAddon.NAMESPACE, "geology_icon")));
```

`setIcon(Id item)` on a skill or adaptation is the short form: the item plus the sprite by convention, `<namespace>:gui/skill/<path>` or `<namespace>:gui/adaptation/<path>`. Prospect's `setIcon(Id.minecraft("spyglass"))` draws `textures/gui/adaptation/geology/prospect.png` where it can, and a spyglass elsewhere. Advancements draw only the icon's item.

## Themes

Clients with the Adapt client mod draw each skill's page, its tiles' hover frame and its toasts from the skill's theme. Book pages from Adapt's resource pack draw each skill's page from the same theme. A theme is a kit, JSON describing the palette, the dressing pieces and their places, plus the atlas PNG the kit's sprites are cut from.

A skill without a kit gets a generated theme: a palette derived from the skill's colour and a set of pieces chosen by its icon item, drawn into a generated atlas. The same colour and icon always give the same theme. A mutated skill draws each parent's part of the theme from that parent's own namespace.

### Hover frames as data

The hover frame is what assembles round a skill's tile while the pointer is on it. A kit may describe it in a `frame` section, so an addon with no client code still gets its own frame. The tile uses the first of:

1. a renderer registered in client code for the skill's id (see below)
2. the kit's `frame` section
3. a generic frame drawn from the kit's palette, so every themed skill has one

Generated kits have no `frame` section and use the generic frame. A mutated skill's tile wears the lead's frame on its left half and the partner's on its right.

The frame has three timelines. Assembly runs `assembled` from 0 to 1 over 1.1 seconds while the tile is hovered or focused; each line and piece has a window `in: [start, length]` on that scale. Idle is a clock in seconds since the hover began. Leave runs `assembled` back to 0 over 0.6 seconds, and each piece leaves its own way.

A position, or spot, is a place on the tile's outline. The ring runs clockwise from the top-left corner, one unit per GUI pixel, with length `2 * (width + height)`. A spot is an anchor name with an optional offset, such as `"topLeft"`, `"bottomRight+5"` or `"leftMiddle-3"`, or a number from 0 to 1, a fraction of the ring. Anchors are `topLeft`, `topRight`, `bottomRight`, `bottomLeft`, `topMiddle`, `rightMiddle`, `bottomMiddle` and `leftMiddle`.

Palette roles are single characters of the kit's palette, such as `a`, `b`, `c`, `p` and `q`. Frame sprites are the kit's `fs/<key>/...` sprites from its atlas.

```json
"frame": {
  "lines": [
    {"from": "bottomMiddle", "way": "both", "roles": "bbbc", "in": [0, 0.7], "ease": "out"},
    {"from": "bottomMiddle", "way": "both", "roles": "a", "offset": 1, "in": [0.2, 0.6], "ease": "out", "alpha": 0.5}
  ],
  "pieces": [
    {"pixel": "p", "at": ["topLeft", "topRight", "bottomRight", "bottomLeft"], "in": [0.6, 0.2], "stagger": 0.05,
     "enter": "slide", "distance": 2, "pulse": [0.35, 2.4], "leave": "away"},
    {"pixel": "q", "at": ["topLeft"], "in": [0.8, 0.2], "travel": 22, "leave": "fade"}
  ]
}
```

This is the generic frame. Both arrays are optional and unknown keys are ignored. A malformed `frame` section makes the whole kit invalid: the server skips the kit when the addon installs, and the skill gets a generated theme with the generic frame.

A line is a row of single pixels that grows along the outline as the frame assembles.

| Key | Default | Meaning |
|---|---|---|
| `from` | required | Spot where the line starts |
| `way` | `both` | `both` grows half the ring each way, closing it. `cw` and `ccw` grow the whole ring one way |
| `roles` | required | Palette roles cycled along the line, one character per pixel, such as `"2221"` |
| `offset` | `0` | Pixels outside the outline |
| `in` | `[0, 0.7]` | Assembly window it grows over |
| `ease` | `linear` | `linear`, `in`, `out` or `inOut` |
| `wave` | none | Digits added to `offset` along the line, such as `"0011"`, for a ripple |
| `speed` | `0` | Pixels a second the wave scrolls |
| `head` | none | Frame sprite drawn at the growing tip until the line is complete, mirrored on the counter-clockwise half |
| `alpha` | `1` | Opacity |

A piece is a frame sprite or a single pixel at one or more spots. It has exactly one of `sprite` and `pixel`.

| Key | Default | Meaning |
|---|---|---|
| `sprite` | | A frame sprite key, or a list cycled at `fps` |
| `pixel` | | A palette role such as `"p"`, or an exact colour `"#rrggbb"` |
| `at` | required | List of spots |
| `spread` | `0` | Above 0, that many positions evenly round the ring, starting at the first spot |
| `in` | `[0, 0.3]` | Assembly window. A length of 0 makes the piece appear at `start` |
| `stagger` | `0` | Added to `start` for each later position |
| `ease` | `linear` | Applied to the piece's progress through its window |
| `enter` | `fade` | `fade`, `pop` (appears whole at the end of its window), `slide` (from `distance` pixels outside) or `drop` (from `distance` pixels above) |
| `distance` | `3` | Pixels for `slide`, `drop` and the moving leaves |
| `fps` | `0` | Frames a second for a `sprite` list |
| `bob` | none | `[pixels, period seconds]`: moves outward and back |
| `pulse` | none | `[depth 0 to 1, period seconds]`: opacity dips by up to `depth` |
| `drift` | none | `[dx, dy, period seconds]`: moves by (dx, dy) over the period, fading in and out, then starts again |
| `travel` | `0` | Pixels a second the piece moves clockwise round the ring; negative for counter-clockwise |
| `leave` | `reverse` | `reverse`, `fade`, `fall`, `rise` (move `distance` pixels down or up while fading) or `away` (move outward while fading) |
| `flip` | `false` | Mirror the sprite |
| `upright` | `false` | Keep the sprite upright on every side instead of turning it outward |
| `sink` | `0` | Pixels the sprite sinks into the outline |
| `outward` | `0` | Pixels outward from the outline |
| `alpha` | `1` | Opacity |
| `tint` | `#ffffff` | Multiplies a sprite's colours. Sprites only |

Successive positions of one piece run their idle loops 0.37 seconds apart. Pixels move only along the outward offset; `drop`, `fall`, `rise` and `drift` move sprites only.

## What each client gets

| Client | Sees |
|---|---|
| With the Adapt client mod | The addon's sprites, its themed pages and toasts, and its frame from kit data or from a client-side renderer |
| Vanilla, with Adapt's resource pack on Paper, Purpur, Folia or Spigot | Book pages with the addon's sprites and themed pages, built from the addon's pack files. See [Book menus](/adapt/54-book-menus#addon-skills) |
| Vanilla, without the pack, or on Fabric, Forge or NeoForge without the client mod | The chest menu with each icon's `item` |

A server-only addon, such as a Bukkit plugin, reaches clients with the Adapt client mod through data alone: sprites, the kit and its `frame` section. A frame drawn in Java code runs on the player's computer, so it needs a client mod of your own.

## Frames in client code

A client mod draws a skill's hover frame in code through `AdaptClientApi`, which is experimental. Call it from client initialisation only; on a dedicated server the classes load and do nothing.

```java
public final class GeologyClient implements ClientModInitializer {
  @Override
  public void onInitializeClient() {
    AdaptClientApi.themes().frame(GeologyAddon.GEOLOGY, (FrameCanvas canvas) -> {
      int grown = (int) (canvas.ringLength() * canvas.progress(0.0D, 0.7D));
      for (int s = 0; s < grown; s++) {
        canvas.pixel(s, 0, 'p');
      }
    });
  }
}
```

`frame(skill, renderer)` throws `IllegalArgumentException` when the skill already has a renderer, and returns a `FrameRegistration` whose `remove()` falls back to the kit's frame. Adapt's own 24 frames are registered the same way.

The renderer is called every frame for every hovered tile, on the render thread, with one reused `FrameCanvas`. Allocate nothing and keep no reference to the canvas.

| `FrameCanvas` | Gives |
|---|---|
| `ringLength()`, `width()`, `height()` | Ring and tile size |
| `topLeft()` and the other corner and middle methods | Ring positions of the anchors |
| `assembled()`, `seconds()`, `leaving()` | The assembly progress, the idle clock and whether the pointer has left |
| `progress(from, to)` | Assembly progress between two points, clamped to 0 to 1 |
| `side(s)` | The side a position lies on: 0 top, 1 right, 2 bottom, 3 left |
| `pixel(s, offset, role)`, `pixelArgb(s, offset, argb, alpha)` | One pixel in a palette role or an exact colour |
| `sprite(key, s)`, `sprite(key, s, options)` | A frame sprite on the ring, facing outward; `options()` gives fresh placement options |
| `raw(key, x, y)` | A frame sprite at screen coordinates |
