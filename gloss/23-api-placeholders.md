---
title: "API: Placeholders"
description: "Gloss documentation: API: Placeholders"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss publishes a `%gloss_…%` PlaceholderAPI expansion with three keys. A scoreboard, tablist,
hologram or another plugin's configured text can ask whether a player has a holographic menu open.
It can also ask which menu it is.

This page covers that expansion for external consumers. It also covers where placeholders are
resolved inside Gloss's own documents, and how another plugin feeds its values into Gloss text.

## The expansion

`art.arcane.gloss.service.GlossPlaceholderExpansion` extends VolmLib's
`art.arcane.volmlib.util.bukkit.papi.VolmitPlaceholderExpansion`. That class extends
`me.clip.placeholderapi.expansion.PlaceholderExpansion` and overrides `onRequest` only.

| Property | Value |
|---|---|
| Identifier | `gloss` |
| Author | `Volmit Software` |
| Version | `1.0.0` |
| Required plugin | `Gloss` |
| `persist()` | `true` — the expansion survives `/papi reload` |
| `getPlaceholders()` | `available`, `menu.id`, `menu.open`, sorted |

The expansion does not implement `Relational`. PlaceholderAPI's relational path never invokes it.

## The keys

`onRequest` lower-cases the request path with `Locale.ROOT`. It matches it exactly against the key
map. Gloss registers no group resolvers. There are no arguments, no tails and no `.*` wildcard
forms. The three keys below are the entire surface.

| Placeholder | Arguments | Output |
|---|---|---|
| `%gloss_available%` | none | Always `true` |
| `%gloss_menu.open%` | none | `true` when the player has an open menu session, `false` otherwise |
| `%gloss_menu.id%` | none | The open session's menu id, or `---` when there is none |

Separators are dots. `%gloss_menu_open%` is not a spelling variant. It is an unknown path.
PlaceholderAPI re-emits it literally.

Values are plain text. Booleans are exactly the lowercase words `true` and `false`. There are no
color codes, no `§` sequences, no `%` characters, no units and no padding.

`available` is the reserved key every VolmLib expansion must publish. The base class refuses to
construct an expansion without it. It answers "is the Gloss expansion installed and resolving".
That is why it is a constant `true` rather than a health check.

### What `menu.id` names

It is the session's menu id. That is the same string as `HoloMenuHandle#menuId()` and
`GlossMenuOpenEvent#getMenuId()`.

- A menu opened from `plugins/Gloss/menus/` reads as the document id: the file's path relative to
  `menus/` with `.json` removed, so `welcome.json` is `welcome` and `shops/tools.json` is `shops/tools`.
- A menu another plugin built through the API reads as that plugin's chosen id after
  `HoloText.sanitizeId`. The id is filtered to `A-Z a-z 0-9 _ - .` with every other character
  dropped, then truncated to 64 characters. A plugin that asked for `"example shop"` reads as
  `exampleshop`.

The value passes through `PlaceholderValues.text`. That helper strips every `%` and every `§`
(along with the character following a `§`). It returns `---` when the input, or the stripped
result, is null or empty.

Container previews and panels are not personal menus. A panel view sets no session on the player's
personal slot. It never moves `menu.open` or `menu.id`. See [Panels](/gloss/16-panels) and
[Container Previews](/gloss/15-container-previews).

## Resolution and threading

All three keys are safe to resolve from any thread.

Backing state is a single `PlayerSnapshotStore<String>` keyed by player `UUID`. Resolving
`menu.open` or `menu.id` is one `ConcurrentHashMap` lookup, a comparison against the entry's stored
expiry stamp, and the construction of a short string. `available` is registered as
`playerId -> PlaceholderValues.TRUE`. That is a constant resolver that reads no map, compares no
stamp and constructs no string.

Nothing reads a `World`, an `Entity`, a `Location` or a `Player`. The resolver is handed a `UUID`,
never the `OfflinePlayer` PlaceholderAPI passed in. No scheduler is touched. No lock is taken.

`PlayerSnapshotStore` supports a grace window (`DEFAULT_GRACE_MS` is 60000). Gloss never calls
`evictAfterGrace`. Every entry's expiry stamp stays `0`. No entry ever expires on its own. The id
is published immediately before the session is constructed. It is removed when the session
detaches. Both happen within the same tick, from the region thread that owns the player. The map's
own visibility guarantees make a read from another thread correct.

## Failure policy

| Situation | Result |
|---|---|
| `params` is null or blank | Returns `null`. PlaceholderAPI re-emits `%gloss_…%` literally |
| Unknown path, including `menu_open` with an underscore | Returns `null`. Re-emitted literally |
| A resolver throws | Returns `---` and logs one `WARNING` naming the exact path, with the throwable |
| The same path keeps throwing | Logged once per distinct path, and only while fewer than 64 distinct paths have been logged |
| No player attached | `available` is `true`, `menu.open` is `false`, `menu.id` is `---` |
| PlaceholderAPI missing or disabled | No expansion exists, so nothing Gloss owns is resolvable |
| Gloss disabled or unloading | The expansion is unregistered.`%gloss_…%` renders literally until it is back |

A throwing resolver never propagates out of PlaceholderAPI. It never takes down the text it
appeared in.

## Registration and the installer

`GlossPlaceholderInstaller.install(registration, openMenus, logger)` is one line:

```java
registration.register(() -> new GlossPlaceholderExpansion(openMenus, logger));
```

It is a purely local registration. It downloads nothing. It contacts no PlaceholderAPI eCloud. It
issues no `%papi% download`. It creates no files.

`PlaceholderRegistration#register`:

1. returns `true` immediately when an expansion is already registered.
2. returns `false` when `Bukkit.getPluginManager().isPluginEnabled("PlaceholderAPI")` is false.
3. builds the expansion — a `SEVERE` log and `false` if the factory throws — then calls
   `PlaceholderExpansion#register()`, logging `WARNING "PlaceholderAPI rejected expansion gloss"` if
   PlaceholderAPI refuses.

`Gloss#onEnable` registers the placeholder service last. Its installer runs only when
`PlaceholderRegistration.isPlaceholderApiEnabled()` is already true. There is no retry and no
scheduled re-attempt. If PlaceholderAPI enables after Gloss, the `%gloss_…%` expansion is absent
until Gloss reloads its plugin instance or the server restarts. The service teardown, reached from
`onDisable` and from the BileTools `onPreUnload` hook, calls `PlaceholderRegistration#unregister`.

`PlaceholderAPI` is listed under `softdepend` in `plugin.yml` and as an optional `load: BEFORE`
server dependency in `paper-plugin.yml`.

> Note that `/gloss reload` does not re-run the installer. It reloads configuration and documents only.
> A server that installs PlaceholderAPI after Gloss has already enabled needs a restart, not a reload.
{.is-warning}

## Placeholders inside Gloss documents

Gloss text supports function tokens, inline expressions and PlaceholderAPI. Container preview
expressions use the same grammar as inline expressions and add preview-state variables and
inventory functions. Their `papi`, `papiNumber` and `metric` calls share the standard Gloss scope.

### The text pipeline

Scoreboards, tablist text, persistent holograms, menu text, bubble prefixes, drop names and other
authored fields routed through `TextPipeline#render` are processed in this order:

1. `|function|` tokens, when `[text] functions` is on and the string contains a `|`.
2. Inline `{{ expression }}` blocks. `player.*` requires a viewer. `papi(...)` and
   `papiNumber(...)` use PlaceholderAPI when available, then fall back to Gloss's standard native
   player/server aliases; only the server aliases work without a viewer.
3. PlaceholderAPI placeholders, when `[text] placeholders` is on, the string contains a `%`, **and** the
   viewer is non-null.
4. Emoji replacement.
5. Colors: `[RRGGBB]` bracket hex first, then `&` codes.

Step 3 is what makes viewer-less renders leave tokens literal. `renderStatic` passes a null viewer.
So does the MOTD service. A `ServerListPingEvent` has no `Player`. The server list MOTD cannot
resolve player values or placeholders at all. Viewer-free inline expressions, functions, emoji and
colors still apply there. See
[Tablist & Server List MOTD](/gloss/06-tablist-motd) and
[Expressions & Placeholders](/gloss/13-expressions-placeholders).

### Menu documents

Three fields in a menu definition receive the full viewer-aware text pipeline. Component ids, icon
values, image paths and every other action type are never expanded.

| Field | Class | Substitution |
|---|---|---|
| Text icon `text` | `TextMenuIcon` (`TextIconData`) | Full pipeline per `\n`-separated line, before `TextUtils.parse` |
| Toggle `condition` and `expectedValue` | `ToggleComponent` (`ToggleComponentData`) | Full pipeline once on both, then `.equalsIgnoreCase(...)` |
| Message action `message` | `MessageMenuAction` (`MessageActionData`) | `%player%` becomes the player's name, then the full pipeline runs |

The pipeline's raw-placeholder stage uses
`art.arcane.volmlib.util.bukkit.Placeholders#setPlaceholders`, which reflectively invokes
`me.clip.placeholderapi.PlaceholderAPI#setPlaceholders(Player, String)`. It returns the input
unchanged when the player is null, when the text contains no `%`, or when the method cannot be
resolved. The reflective lookup is re-probed every 1000 ms. Document-side expansion begins working
within about a second of PlaceholderAPI enabling. Gloss's own expansion registration has no retry.
A failed invocation logs one `WARNING` for the JVM lifetime and serves the text unresolved.

#### Timing

| Site | Expanded |
|---|---|
| Visible text icon | During construction and every resolved `refreshTicks`. Omission is `10`, `0` disables later refreshes |
| Toggle `condition` | During the `ToggleComponent` constructor, once per session |
| `HoloMenuHandle#setText` / text `setIcon` | When applied, then on later refresh intervals using the replacement source |
| Message action | Each time the action runs |

Only text containing a complete `%name%`, `|function|` or `{{ expression }}` token performs periodic
work. `TextMenuIcon` tracks that as a `dynamicSource` flag and skips the whole refresh when it is
false; a lone `%` or `|` does not make the icon dynamic. A changed resolved value
updates display metadata in place when the line count is stable. A changed line count respawns that
text icon. Either change refreshes automatic hitbox geometry. API text uses the 10-tick default
because `HoloIcon.Text` has no refresh-interval field.

#### `%gloss_menu.id%` inside a menu

`SessionHolder` calls `openMenus.publish(playerId, data.getId())` *before* it constructs the
`MenuSession`. The id is already readable while components are being built.

That matters for toggles. They are the only components that resolve placeholders during
construction. A `ToggleComponent` constructor evaluates `condition` and eagerly builds both icons.
A `%gloss_menu.id%` in any of the three expands to the menu being opened. `%gloss_menu.open%` there
reads `true`. Non-toggle components, whose icons are built during `session.open()`, resolve later
still and see the same value.

Detaching the previous session published `null` earlier in the same method. A toggle never reads
the id of the menu it is replacing. When a component constructor throws, the previous menu id is
republished before the failure propagates. A failed open never strands the id of a session that
does not exist.

### Preview documents

Container preview expressions expose `papi(key, fallback?)`, `papiNumber(key, fallback?)` and
`metric(key, fallback?)` through the same standard scope as inline text. They also accept the direct
`time.*`, `server.*` and `player.*` variables. The expression lexer has no raw `%…%` form: a bare
`%` is the modulo operator, so use `papi('player_name')`, not `%player_name%`. A
`PreviewStateProvider` remains the route for plugin-specific target state. See
[API: Previews](/gloss/24-api-previews).

## Feeding your values into Gloss text

Gloss has no API for registering text functions. The `|function|` families are registered
internally. `AnimationService` publishes `|animation.<id>|`. The integration bridge publishes
`|metric.<key>|` for every metric another installed Volmit plugin advertises on the Bukkit
`ServicesManager`.

If your plugin publishes VolmLib's `IntegrationServiceContract`, the bridge discovers it
automatically. Its metrics become `|metric.<key>|` tokens and preview variables with no work on
your side. See [Runtime Architecture](/gloss/20-runtime-architecture). Gloss also publishes its own
`gloss.*` metrics through the same contract for React to consume. It deliberately skips its own
registration when consuming.

The supported route in the other direction is PlaceholderAPI. Publish your own expansion. Every
Gloss surface that renders with a viewer resolves it:

- scoreboard titles and lines, tablist header, footer and name formats, and per-viewer hologram lines,
  through `TextPipeline#render`.
- menu text icons, toggle conditions, message actions and bubble prefixes, through the full text
  pipeline.
- anything you render yourself with `GlossAPI#filter(Player, String)`.

Surfaces that render with no viewer resolve no raw placeholders. That includes shared-mode
hologram lines, temporary holograms, damage indicators, drop name formats and the MOTD. Their
server/time expressions, native server aliases and explicit fallbacks still work. Bubble message
text is already-safe player chat and is not rescanned; its authored style prefix renders with the
speaker as viewer.

```java
GlossAPI gloss = GlossAPI.get();
String rendered = gloss.filter(player, "|animation.rainbow|{{ papi('myplugin_rank') }} :heart:");
```

`filter` runs the full pipeline for that player and returns the finished string. Passing `null` as
the player skips the placeholder stage.

## Do not parse these from Java

The expansion exists for text an operator configures. Java code has both answers directly. There is
no PlaceholderAPI dependency, no string parsing and no `---` sentinel to special-case.

```java
package com.example.menus;

import art.arcane.gloss.api.GlossAPI;
import org.bukkit.entity.Player;

public final class MenuQuery {

  private MenuQuery() {
  }

  public static boolean hasMenuOpen(GlossAPI gloss, Player player) {
    return gloss.isOpen(player);
  }
}
```

If you opened the menu yourself, `HoloMenuHandle#menuId()` and `HoloMenuHandle#state()` describe
your own session precisely, including the `PENDING` window no placeholder can express. See
[API: Menus](/gloss/22-api-menus).
