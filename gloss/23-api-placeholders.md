---
title: "API: Placeholders"
description: "Gloss documentation: API: Placeholders"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss publishes a `%gloss_…%` PlaceholderAPI expansion with three keys, so a scoreboard, tablist,
hologram or another plugin's configured text can ask whether a player has a holographic menu open and
which one it is. This page covers that expansion for external consumers, where placeholders are resolved
inside Gloss's own documents, and how another plugin feeds its values into Gloss text.

## The expansion

`art.arcane.gloss.service.GlossPlaceholderExpansion` extends VolmLib's
`art.arcane.volmlib.util.bukkit.papi.VolmitPlaceholderExpansion`, which extends
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

`onRequest` lower-cases the request path with `Locale.ROOT` and matches it exactly against the key map.
Gloss registers no group resolvers, so there are no arguments, no tails and no `.*` wildcard forms — the
three keys below are the entire surface.

| Placeholder | Arguments | Output |
|---|---|---|
| `%gloss_available%` | none | Always `true` |
| `%gloss_menu.open%` | none | `true` when the player has an open menu session, `false` otherwise |
| `%gloss_menu.id%` | none | The open session's menu id, or `---` when there is none |

Separators are dots. `%gloss_menu_open%` is not a spelling variant — it is an unknown path, and
PlaceholderAPI re-emits it literally.

Values are plain text. Booleans are exactly the lowercase words `true` and `false`. There are no color
codes, no `§` sequences, no `%` characters, no units and no padding.

`available` is the reserved key every VolmLib expansion must publish; the base class refuses to construct
an expansion without it. It answers "is the Gloss expansion installed and resolving", which is why it is a
constant `true` rather than a health check.

### What `menu.id` names

It is the session's menu id — the same string as `HoloMenuHandle#menuId()` and
`GlossMenuOpenEvent#getMenuId()`.

- A menu opened from `plugins/Gloss/menus/` reads as the document id: the file's path relative to
  `menus/` with `.json` removed, so `welcome.json` is `welcome` and `shops/tools.json` is `shops/tools`.
- A menu another plugin built through the API reads as that plugin's chosen id after `HoloText.sanitizeId`:
  filtered to `A-Z a-z 0-9 _ - .` with every other character dropped, then truncated to 64 characters. A
  plugin that asked for `"example shop"` reads as `exampleshop`.

The value passes through `PlaceholderValues.text`, which strips every `%` and every `§` (along with the
character following a `§`) and returns `---` when the input, or the stripped result, is null or empty.

Container previews and panels are not personal menus. A panel view sets no session on the player's
personal slot, so it never moves `menu.open` or `menu.id`. See [Panels](/gloss/16-panels) and
[Container Previews](/gloss/15-container-previews).

## Resolution and threading

All three keys are safe to resolve from any thread.

Backing state is a single `PlayerSnapshotStore<String>` keyed by player `UUID`. Resolving `menu.open` or
`menu.id` is one `ConcurrentHashMap` lookup, a comparison against the entry's stored expiry stamp, and the
construction of a short string. `available` is registered as `playerId -> PlaceholderValues.TRUE`: a
constant resolver that reads no map, compares no stamp and constructs no string.

Nothing reads a `World`, an `Entity`, a `Location` or a `Player`. The resolver is handed a `UUID`, never
the `OfflinePlayer` PlaceholderAPI passed in. No scheduler is touched and no lock is taken.

`PlayerSnapshotStore` supports a grace window (`DEFAULT_GRACE_MS` is 60000), but Gloss never calls
`evictAfterGrace`, so every entry's expiry stamp stays `0` and no entry ever expires on its own. The id is
published immediately before the session is constructed and removed when the session detaches, both
within the same tick, from the region thread that owns the player. The map's own visibility guarantees
make a read from another thread correct.

## Failure policy

| Situation | Result |
|---|---|
| `params` is null or blank | Returns `null`; PlaceholderAPI re-emits `%gloss_…%` literally |
| Unknown path, including `menu_open` with an underscore | Returns `null`; re-emitted literally |
| A resolver throws | Returns `---` and logs one `WARNING` naming the exact path, with the throwable |
| The same path keeps throwing | Logged once per distinct path, and only while fewer than 64 distinct paths have been logged |
| No player attached | `available` is `true`, `menu.open` is `false`, `menu.id` is `---` |
| PlaceholderAPI missing or disabled | No expansion exists, so nothing Gloss owns is resolvable |
| Gloss disabled or unloading | The expansion is unregistered; `%gloss_…%` renders literally until it is back |

A throwing resolver never propagates out of PlaceholderAPI and never takes down the text it appeared in.

## Registration and the installer

`GlossPlaceholderInstaller.install(registration, openMenus, logger)` is one line:

```java
registration.register(() -> new GlossPlaceholderExpansion(openMenus, logger));
```

It is a purely local registration. It downloads nothing, contacts no PlaceholderAPI eCloud, issues no
`%papi% download`, and creates no files.

`PlaceholderRegistration#register`:

1. returns `true` immediately when an expansion is already registered;
2. returns `false` when `Bukkit.getPluginManager().isPluginEnabled("PlaceholderAPI")` is false;
3. builds the expansion — a `SEVERE` log and `false` if the factory throws — then calls
   `PlaceholderExpansion#register()`, logging `WARNING "PlaceholderAPI rejected expansion gloss"` if
   PlaceholderAPI refuses.

`Gloss#onEnable` registers the placeholder service last, and its installer runs only when
`PlaceholderRegistration.isPlaceholderApiEnabled()` is already true. There is no retry and no scheduled
re-attempt: if PlaceholderAPI enables after Gloss, the `%gloss_…%` expansion is absent until Gloss
reloads its plugin instance or the server restarts. The service teardown, reached from `onDisable` and
from the BileTools `onPreUnload` hook, calls `PlaceholderRegistration#unregister`.

`PlaceholderAPI` is listed under `softdepend` in `plugin.yml` and as an optional `load: BEFORE` server
dependency in `paper-plugin.yml`.

> Note that `/gloss reload` does not re-run the installer. It reloads configuration and documents only.
> A server that installs PlaceholderAPI after Gloss has already enabled needs a restart, not a reload.
{.is-warning}

## Placeholders inside Gloss documents

Two independent substitution systems exist and they do not overlap. Text that Gloss renders through the
text pipeline resolves PlaceholderAPI; container preview expressions never do.

### The text pipeline

Holograms, scoreboards, the tablist, chat bubbles, drop names and everything else routed through
`TextPipeline#render` are processed in this order:

1. `|function|` tokens, when `[text] functions` is on and the string contains a `|`.
2. PlaceholderAPI placeholders, when `[text] placeholders` is on, the string contains a `%`, **and** the
   viewer is non-null.
3. Emoji replacement.
4. Colors: `[RRGGBB]` bracket hex first, then `&` codes.

Step 2 is what makes viewer-less renders leave tokens literal. `renderStatic` passes a null viewer, and so
does the MOTD service — a `ServerListPingEvent` has no `Player` — so the server list MOTD cannot resolve
placeholders at all. Functions, emoji and colors still apply there. See
[Tablist & Server List MOTD](/gloss/06-tablist-motd) and
[Expressions & Placeholders](/gloss/13-expressions-placeholders).

### Menu documents

Three fields in a menu definition receive placeholder expansion. Component ids, icon values, image paths
and every other action type are never expanded.

| Field | Class | Substitution |
|---|---|---|
| Text icon `text` | `TextMenuIcon` (`TextIconData`) | `Placeholders.setPlaceholders(player, line)` per `\n`-separated line, before `TextUtils.parse` |
| Toggle `condition` | `ToggleComponent` (`ToggleComponentData`) | `Placeholders.setPlaceholders(player, condition)`, then `.equalsIgnoreCase(expectedValue)` |
| Message action `message` | `MessageMenuAction` (`MessageActionData`) | `%player%` is replaced with the player's name first, then `Placeholders.setPlaceholders(player, text)` |

`art.arcane.volmlib.util.bukkit.Placeholders#setPlaceholders` reflectively invokes
`me.clip.placeholderapi.PlaceholderAPI#setPlaceholders(Player, String)`. It returns the input unchanged
when the player is null, when the text contains no `%`, or when the method cannot be resolved. The
reflective lookup is re-probed every 1000 ms, so document-side expansion begins working within about a
second of PlaceholderAPI enabling — unlike Gloss's own expansion registration, which has no retry. A
failed invocation logs one `WARNING` for the JVM lifetime and serves the text unresolved.

#### Timing

| Site | Expanded |
|---|---|
| Visible text icon | During construction and every resolved `refreshTicks`; omission is `10`, `0` disables later refreshes |
| Toggle `condition` | During the `ToggleComponent` constructor, once per session |
| `HoloMenuHandle#setText` / text `setIcon` | When applied, then on later refresh intervals using the replacement source |
| Message action | Each time the action runs |

Only text containing a paired `%name%` token performs periodic work; `TextMenuIcon` tracks that as a
`dynamicSource` flag and skips the whole refresh when it is false. A changed resolved value updates display
metadata in place when the line count is stable; a changed line count respawns that text icon, and either
change refreshes automatic hitbox geometry. API text uses the 10-tick default because `HoloIcon.Text` has
no refresh-interval field.

#### `%gloss_menu.id%` inside a menu

`SessionHolder` calls `openMenus.publish(playerId, data.getId())` *before* it constructs the
`MenuSession`, so the id is already readable while components are being built.

That matters for toggles, the only components that resolve placeholders during construction: a
`ToggleComponent` constructor evaluates `condition` and eagerly builds both icons. A `%gloss_menu.id%` in
any of the three expands to the menu being opened, and `%gloss_menu.open%` there reads `true`. Non-toggle
components, whose icons are built during `session.open()`, resolve later still and see the same value.

Detaching the previous session published `null` earlier in the same method, so a toggle never reads the id
of the menu it is replacing. When a component constructor throws, the previous menu id is republished
before the failure propagates, so a failed open never strands the id of a session that does not exist.

### Preview documents

Container preview expressions never resolve PlaceholderAPI. The expression lexer has no `%…%` form and a
bare `%` is the modulo operator. The supported route for getting external data into a preview is a
`PreviewStateProvider` — see [API: Previews](/gloss/24-api-previews).

## Feeding your values into Gloss text

Gloss has no API for registering text functions. The `|function|` families are registered internally:
`AnimationService` publishes `|animation.<id>|`, and the integration bridge publishes `|metric.<key>|`
for every metric another installed Volmit plugin advertises on the Bukkit `ServicesManager`.

If your plugin publishes VolmLib's `IntegrationServiceContract`, the bridge discovers it automatically
and its metrics become `|metric.<key>|` tokens and preview variables with no work on your side — see
[Runtime Architecture](/gloss/20-runtime-architecture). Gloss also publishes its own `gloss.*` metrics
through the same contract for React to consume, and deliberately skips its own registration when
consuming.

The supported route in the other direction is PlaceholderAPI. Publish your own expansion, and every Gloss
surface that renders with a viewer resolves it:

- scoreboard titles and lines, tablist header, footer and name formats, and per-viewer hologram lines,
  through `TextPipeline#render`;
- menu text icons, toggle conditions and message actions, through `Placeholders#setPlaceholders`;
- anything you render yourself with `GlossAPI#filter(Player, String)`.

Surfaces that render with no viewer resolve no placeholders: shared-mode hologram lines, temporary
holograms and therefore chat bubbles and damage indicators, drop name formats, and the MOTD. All of them
call `renderStatic`.

```java
GlossAPI gloss = GlossAPI.get();
String rendered = gloss.filter(player, "&d|animation.rainbow| %myplugin_rank% :heart:");
```

`filter` runs the full pipeline for that player and returns the finished string. Passing `null` as the
player skips the placeholder stage.

## Do not parse these from Java

The expansion exists for text an operator configures. Java code has both answers directly, with no
PlaceholderAPI dependency, no string parsing and no `---` sentinel to special-case.

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

If you opened the menu yourself, `HoloMenuHandle#menuId()` and `HoloMenuHandle#state()` describe your own
session precisely, including the `PENDING` window no placeholder can express. See
[API: Menus](/gloss/22-api-menus).
