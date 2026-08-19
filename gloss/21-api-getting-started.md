---
title: "API: Getting Started"
description: "Gloss documentation: API: Getting Started"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
`art.arcane.gloss.api` is the package another Bukkit plugin compiles against. One interface,
`GlossAPI`, covers everything: holograms, scoreboards, tablist, text rendering and holographic menus.
This page covers the dependency, the two ways of resolving that interface, availability and lifecycle,
the three Bukkit events, and the non-menu API in full. The menu, placeholder and preview surfaces have
their own pages.

## One interface, two ways to resolve it

| Route | How you get it | Fails by |
|---|---|---|
| Static | `GlossAPI.get()` | throwing `NullPointerException("Gloss is not enabled")` |
| Services manager | `Bukkit.getServicesManager().getRegistration(GlossAPI.class)` | returning `null` |

Both hand back the same object. Use the services-manager route when Gloss is a soft dependency and you
want to degrade rather than throw; use the static route when Gloss is a hard dependency.

> `HoloUiService` is gone. Its five menu methods — `open(Plugin, Player, HoloMenu)`,
> `open(Plugin, Player, String)`, `close`, `isOpen` and `menuIds` — moved onto `GlossAPI` unchanged, and
> the service type registered on the `ServicesManager` is now `GlossAPI` rather than `HoloUiService`.
> The `HoloCloseReason` constant `HOLOUI_SHUTDOWN` is now `GLOSS_SHUTDOWN`. Both are breaking changes;
> recompile against the new API jar. The `Holo*` type names stay as they are — they name the
> hologram-menu domain, not the retired product.
{.is-warning}

### `GlossAPI.get()`

```java
import art.arcane.gloss.api.GlossAPI;

GlossAPI gloss = GlossAPI.get();
```

`GlossAPI.get()` delegates to `GlossAPIProvider.get()`, which throws
`NullPointerException("Gloss is not enabled")` when no instance is installed. Both routes are public and
equivalent; `GlossAPI.get()` is the shorter one. `GlossAPIProvider.set(...)` is public as well, but it is
Gloss's own write path — calling it from another plugin replaces the live API for every consumer in the
JVM.

### The `ServicesManager` registration

```java
import art.arcane.gloss.api.GlossAPI;
import org.bukkit.Bukkit;
import org.bukkit.plugin.RegisteredServiceProvider;

RegisteredServiceProvider<GlossAPI> registration =
    Bukkit.getServicesManager().getRegistration(GlossAPI.class);

if (registration == null) {
    getLogger().warning("Gloss is not installed; holographic menus are unavailable.");
    return;
}

GlossAPI gloss = registration.getProvider();
```

Gloss registers exactly one provider from `GlossApiServiceImpl#register(GlossAPI)` with
`ServicePriority.Normal`, and unregisters it from `GlossApiServiceImpl#unregister()`.

## What the package contains

| Type | Kind | Role |
|---|---|---|
| `GlossAPI` | interface | Holograms, boards, tablist, text and menus; also the `ServicesManager` service type |
| `GlossAPIProvider` | final class | Static holder behind `GlossAPI.get()` |
| `Hologram` | interface | One persistent hologram |
| `TemporaryHologram` | interface | A hologram that expires; extends `Hologram` |
| `HologramViewers` | interface | Viewer filter on a temporary hologram |
| `HoloMenu` | record | Immutable menu definition |
| `HoloMenuBuilder` | final class | Builds a `HoloMenu`; reached through `HoloMenu.builder()` |
| `HoloComponent` | sealed interface | One element of a menu: `Decoration` or `Button` |
| `HoloIcon` | sealed interface | What a component draws: `Text`, `Item`, `Block`, `Image`, `AnimatedImage`, `Entity` |
| `HoloClickHandler` | functional interface | Button callback |
| `HoloClick` | record | Click payload handed to a `HoloClickHandler` |
| `HoloClickTrigger` | enum | Physical click binding; five constants including `ANY` |
| `HoloMenuHandle` | interface | One open session: observe it, mutate it, close it |
| `HoloMenuState` | enum | `PENDING`, `OPEN`, `CLOSED`, `FAILED` |
| `HoloCloseReason` | enum | Why a session ended; 13 constants, ending in `GLOSS_SHUTDOWN` |
| `GlossMenuOpenEvent` | Bukkit event | Cancellable; fires for every menu on the server |
| `GlossMenuClickEvent` | Bukkit event | Cancellable; fires once per component hit by a click |
| `GlossContainerPreviewAccessEvent` | Bukkit event | Cancellable; last gate before a container preview is built |
| `PreviewStateProvider` | interface | Contributes variables to container preview documents |
| `PreviewStateProviders` | final class | Static registry for `PreviewStateProvider` |

`HoloText`, in the same package, is package-private and is not API. It is the sanitiser behind every id,
markup string and image path.

Every public signature in the package is built from `java.*` types, `org.bukkit.*` types and other types
in `art.arcane.gloss.api`. `HoloUiApiContractTest#everyPublicApiTypeIsBuiltFromJavaBukkitAndItsOwnPackageOnly`
enforces that, so the package links against a plain Spigot or Paper compile classpath with no Adventure,
VolmLib or shaded types on your side. One implementation detail leaks past signatures:
`HoloClickTrigger` carries a Gson `@JsonAdapter` annotation, so reflecting over that enum needs
`com.google.gson` on the classpath. Every supported server already provides it.

### `art.arcane.gloss.api.internal` is not API

`ApiBackend`, `GlossApiBackend`, `GlossApiServiceImpl`, `ApiMenuHandle`, `ApiMenuTranslator`,
`ApiClickGuard`, `ApiClickOutcome`, `ApiEvents`, `ApiHandleState`, `ApiOwner` and `ApiPendingIcons` live
there. Several are `public` and therefore reachable by `Class.forName`. They carry no compatibility
promise and are named in these pages only to explain observable behaviour. The contract test asserts that
no public API signature leaks a type from that package, and the API jar excludes it outright.

## Depending on Gloss

| Fact | Value |
|---|---|
| Gradle group and name | `art.arcane` / `Gloss` |
| Version | `3.0.0-26.2` |
| Bukkit plugin name | `Gloss` (capital G; `rootProject.name`) |
| Data directory | `plugins/Gloss/` |
| `api-version` | `26.1` |
| Descriptors | `paper-plugin.yml` (`load: STARTUP`, `folia-supported: true`) and `plugin.yml` (`load: POSTWORLD`) |

Gloss runs on Spigot, Paper and Folia. The build compiles a Spigot-only source set on every `check`, so
the Paper-specific code paths are isolated behind reflection and a `paper/` package that Spigot never
loads. Your own plugin still has to decide which server API it targets; the Gloss API package itself
needs nothing beyond Bukkit.

The build produces two jars. `shadowJar` writes the plugin jar with no classifier, and the `apiJar` task
writes an api-only jar with the `api` classifier that packages `art/arcane/gloss/api/**` and excludes
`art/arcane/gloss/api/internal/**`. Compile against the api jar:

```gradle
dependencies {
    compileOnly(files("libs/Gloss-3.0.0-26.2-api.jar"))
}
```

or against the plugin jar you run, if that is simpler to wire up. The scope must be `compileOnly`
(`provided` in Maven). Never shade `art.arcane.gloss.api` into your own jar: Gloss's copy and yours would
be distinct classes on distinct classloaders, and the cast of the service fetched from the
`ServicesManager` fails at runtime with a `ClassCastException` naming the same type twice.

### Declaring the runtime dependency

Bukkit plugin (`plugin.yml`):

```yaml
softdepend: [Gloss]
```

Paper plugin (`paper-plugin.yml`):

```yaml
dependencies:
  server:
    Gloss:
      load: BEFORE
      required: false
      join-classpath: true
```

`join-classpath: true` is mandatory on Paper. Modern Paper plugin classloaders are isolated; without it,
`art.arcane.gloss.api.*` raises `NoClassDefFoundError` even though those classes ship unrelocated.

`softdepend` / `required: false` is correct unless your plugin is useless without Gloss. Both entry
points already handle Gloss being absent — one throws, one returns `null` from `getRegistration`.

### What is not on the compatibility contract

Gloss ships as a minimized shadow jar with a slimjar runtime loader.

- PacketEvents, bStats and slimjar are relocated under `art.arcane.gloss.libs.*` at shadow time.
  Adventure and MiniMessage, Apache Commons, commons-imaging and toml4j are relocated under the same
  prefix and fetched at runtime into Gloss's own classloader. VolmLib ships unrelocated under
  `art.arcane.volmlib.*` and is equally not API. Both package names and their contents move with the
  build.
- `minimize()` strips classes in bundled libraries that Gloss does not statically reference. A reflective
  lookup into anything other than `art.arcane.gloss.api` can begin throwing `ClassNotFoundException` on
  any release, with no deprecation and no warning.
- Do not add an Adventure dependency for Gloss's sake. `HoloIcon.text` takes markup as a plain `String`,
  so you never have to match Gloss's Adventure version, and Gloss's relocated copy is not loadable from
  your classloader.

### Forward compatibility

`HoloMenuState` and `HoloCloseReason` may gain constants. A `switch` *expression* over an enum is
exhaustive, so it stops compiling — and throws `IncompatibleClassChangeError` on an already-compiled jar —
the moment a constant is added. Always write a `default` arm over either enum.
`HoloMenuState.terminal()` answers "is this session over" without a switch.

`HoloComponent` and `HoloIcon` are sealed and may gain permitted subtypes; give a pattern-matching
`switch` over them a `default` arm too.

## Availability and lifecycle

Both routes come up late in `onEnable` and go down together.

| Moment | `GlossAPI.get()` | `GlossAPI` registration |
|---|---|---|
| Before Gloss enables | throws `NullPointerException("Gloss is not enabled")` | `getRegistration` returns `null` |
| After a successful enable | returns the live instance | one provider at `ServicePriority.Normal` |
| Enable threw partway | provider is cleared, so it throws again | unregistered by the failure teardown |
| `/gloss reload`, or a `config.toml` edit picked up by the watchdog | unchanged and live | unchanged and live |
| The BileTools `onPreUnload` hook | still returns the instance, but its services are torn down | unregistered |
| `onDisable` | cleared, so it throws | unregistered |

`onPreUnload` tears down every service and cancels every task but does not clear the provider, so a
`GlossAPI` reference used between the pre-unload hook and `onDisable` reaches an instance whose services
are already down. Treat `onPreUnload` as the point where Gloss stops working, not the point where
`GlossAPI.get()` starts throwing.

`reloadAll` re-reads `config.toml` and reloads the text, animation, emoji, hologram, board, group,
tablist, MOTD, bubble, indicator and drop services. It does not touch `GlossAPIProvider` and does not
unregister the service, so a reference you hold across a reload keeps working. A reference you hold
across a full disable does not.

A `GlossAPI` reference held across a Gloss disable goes inert rather than dangerous. `unregister()`
sets an internal active flag to `false`, drops the `PluginDisableEvent` listener, and terminates every
live handle with `HoloCloseReason.GLOSS_SHUTDOWN`. On the stale instance the menu methods report:

| Call | Result after Gloss disables |
|---|---|
| `menuIds()` | `Set.of()` |
| `isOpen(Player)` | `false` |
| `close(Player)` | `false` |
| `open(...)` | a handle already `FAILED` with `HoloCloseReason.OPEN_FAILED` |

Re-resolve when you need it, or re-resolve from `PluginEnableEvent`.

### Ownership and cleanup

Each menu handle stores an `ApiOwner`: the owning plugin's name and a `BooleanSupplier` bound to its
`isEnabled()`. Gloss never retains the `Plugin` instance beyond that supplier, and matches ownership by
plugin name, so a reload that produces a new `Plugin` instance under the same name still matches.

`GlossApiServiceImpl#register()` installs a `PluginDisableEvent` listener. When any plugin other than
Gloss disables, that plugin's click-guard quarantine flag, fault counter and slow-warning timestamp are
cleared, and every handle whose owner name matches is closed with `HoloCloseReason.OWNER_DISABLED`.

There is nothing to unregister for menus. The one registration a consumer owns is a
`PreviewStateProvider`: that registry is static, process-wide and JVM-lifetime, so it must be
unregistered on disable. See [API: Previews](/gloss/24-api-previews).

## Threading

Gloss supports Folia, where a player's world state belongs to the region thread that owns that player.
The rule for menus: call `open` from the thread that owns the player — that player's region thread on
Folia, or the main thread on Paper and Spigot. Everything else on the service and on a handle is safe
from any thread.

| Call | Legal from | What runs on your thread |
|---|---|---|
| `GlossAPI.open(Plugin, Player, HoloMenu)` | any; prefer owning | `Plugin#getName()`, `Plugin#isEnabled()`, `Player#getUniqueId()`, one `clone()` per item icon |
| `GlossAPI.open(Plugin, Player, String)` | any; prefer owning | the same, minus icon translation |
| `GlossAPI.close` / `isOpen` / `menuIds` | any | one concurrent-map read, then a scheduler hand-off for `close` |
| `handle.sessionId/playerId/menuId` | any | final-field reads |
| `handle.state()` | any | one `AtomicReference` read |
| `handle.setText/setItem/setIcon` | any | validation and one `ConcurrentHashMap` put |
| `handle.close()` | any | one atomic read, then a scheduler hand-off |
| `handle.onClosed(Consumer)` | any | one atomic set, and the callback inline if the handle is already terminal |
| Your `HoloClickHandler` | invoked by Gloss | the clicking player's region thread. Never block it |
| Your `onClosed` callback | invoked by Gloss | a server thread that is not fixed. Bookkeeping only |
| Your `PreviewStateProvider#snapshot` | invoked by Gloss | the region thread owning the preview target |

`GlossAPI` methods that touch a world — creating, moving or deleting a hologram — must be called from
the thread that owns that location, exactly like any other Bukkit world access.

## Events

Three Bukkit events live in `art.arcane.gloss.api`. All three extend `org.bukkit.event.Event` directly
with their own `HandlerList`, are constructed with the no-arg `Event()` superconstructor, and are
therefore synchronous — which on Folia means "on whichever region thread fired it", not "on the main
thread". All three implement `Cancellable`.

| Event | Fires | Carries | Cancelling |
|---|---|---|---|
| `GlossMenuOpenEvent` | Immediately before a menu session is created, on the player's region thread | `getPlayer()`, `getMenuId()`, `getOwnerPluginName()` | The menu does not open |
| `GlossMenuClickEvent` | For the one nearest component hit by a click, before its actions and any API handler run, on the clicking player's region thread | `getPlayer()`, `getMenuId()`, `getComponentId()`, `getOwnerPluginName()`, `getTrigger()` | That component does nothing for this click |
| `GlossContainerPreviewAccessEvent` | Last gate in `ContainerPreviewAccess.canOpen`, on the region thread owning the target | `getPlayer()`, and exactly one of `getBlock()` / `getEntity()` | The preview is denied and the `locked` document is built instead |

`getOwnerPluginName()` is the opening plugin's name for an API-opened menu, and `null` for a menu Gloss
opened itself — a `/gloss menu open`, a navigation, or a panel view. Both menu events therefore also fire
for panels, always with a `null` owner name.

`ApiEvents` checks `getHandlerList().getRegisteredListeners().length == 0` before constructing either
menu event and skips dispatch entirely when nothing is listening, so an unused event costs nothing. If a
dispatch throws, Gloss logs it and treats the event as not cancelled.

Menu event detail — the exact open and click paths, and what a cancellation does to a handle — is in
[API: Menus](/gloss/22-api-menus). The preview access event is in
[API: Previews](/gloss/24-api-previews).

## Holograms

```java
Hologram sign = gloss.createHologram("shop-sign", location);
sign.addLine("&dOpen daily");
sign.setLine(0, "&d&lOpen daily");
sign.setLines(List.of("&d&lOpen daily", "&7Trade at spawn"));
sign.teleport(newLocation);
gloss.deleteHologram("shop-sign");
```

```java
public interface Hologram {
  String id();
  Location location();
  void teleport(Location location);
  List<String> lines();
  void addLine(String line);
  void setLine(int index, String line);
  void setLines(List<String> lines);
  void removeLine(int index);
  void clearLines();
}
```

`createHologram` returns the existing hologram when the id is already taken, and only persists the
document when it actually created one. Ids are validated first: `null` throws
`NullPointerException("Hologram id may not be null.")`, blank throws
`IllegalArgumentException("Hologram id may not be blank.")`, and an id containing `/`, `\` or `..` throws
`IllegalArgumentException("Hologram id may not contain path characters.")`. `deleteHologram` applies the
same validation.

Created holograms are persistent. Every mutation writes `plugins/Gloss/holograms/<id>.json` on the
background IO thread and bumps the document `revision`, and they render exactly like file-defined
holograms, including per-viewer placeholder mode. `setLines(List<String>)` replaces the whole list in one
mutation and therefore one file write. `hologram(id)` returns an `Optional`, `hasHologram(id)` is a
containment check, and `holograms()` returns a snapshot list. The document shape and the render pipeline
are in [Holograms](/gloss/04-holograms).

## Temporary holograms

```java
TemporaryHologram tag = gloss.createTemporaryHologram("combat-tag", start, 4000L);
tag.addLine("&c-4");
tag.bindPosition(() -> entity.getLocation().add(0, 2.2, 0));
tag.viewers().whitelist();
tag.viewers().add(player.getUniqueId());
```

Temporary holograms are never written to disk and expire after `durationMs`, which `remainingMs()`
reports the remainder of. They are driven every `[holograms] temporaryUpdateIntervalTicks` (default 2):
the `bindPosition` supplier, if set, is polled on each drive and the display follows it. Text renders
statically, so placeholder tokens are not resolved; functions, emoji and colors still apply.

`viewers()` returns a `HologramViewers` filter over a UUID set plus a mode flag:

| Call | Effect |
|---|---|
| `blacklist()` | The default. Everyone except the listed ids sees the hologram |
| `whitelist()` | Only the listed ids see it |
| `add(UUID)` / `remove(UUID)` | Adds or removes one id. `null` is ignored |
| `clear()` | Empties the id set without changing the mode |

A cleared blacklist means everyone sees the hologram; a cleared whitelist means nobody does. Switching
mode flags the display for a visibility reset on its next drive. `destroy()` removes the hologram early
and is idempotent; every temporary is destroyed on plugin shutdown.

`stackSpread()` returns the configured `[holograms] stackDistance`, for laying out your own stacks at the
same spacing Gloss uses.

## Scoreboards and tablist

```java
gloss.setBoard(player, "event-board");   // sticky manual selection
gloss.clearBoard(player);                // sticky no-board selection
Optional<String> current = gloss.boardFor(player);

gloss.setTab(player, "&dEvent night", "&7Round 3");  // per-player header/footer override
gloss.resetTab(player);                              // back to the configured header/footer
```

`setBoard` and `clearBoard` behave exactly like `/gloss board show` and `/gloss board hide`: they mark
the player sticky, so automatic re-selection on world change and on reload stops applying to them. The
board id is normalised the same way the document loader normalises it, and an empty result falls through
to `clearBoard`. `boardFor` returns the current selection, or an empty `Optional` when the player has
none.

`setTab` overrides the header and footer for one player; a `null` header or footer is stored as an empty
string. Group list names keep applying — the override covers header and footer only. `resetTab` drops the
override. Both push immediately rather than waiting for the next tablist tick, and the override is
dropped automatically when the player quits.

## Text rendering

```java
String rendered = gloss.filter(player, "&d|animation.rainbow| %player_name% :heart:");
```

`filter` runs the full Gloss text pipeline for the given player, in this order: `|function|` tokens when
`[text] functions` is on and the string contains a `|`; PlaceholderAPI placeholders when `[text]
placeholders` is on, the string contains a `%`, and the viewer is non-null; emoji replacement; then
colors, `[RRGGBB]` bracket hex first and `&` codes second. A `null` or empty input returns `""`. Passing
`null` as the player gives a static render with placeholder tokens left as written.

The only text function family Gloss registers is `|animation.<id>|`, from `AnimationService`. The
pipeline's `registerFunction` entry point is internal and is not reachable from the API package, so a
third-party plugin cannot add a function of its own. To get external values into Gloss text, publish a
PlaceholderAPI expansion and let `filter` resolve it — see
[API: Placeholders](/gloss/23-api-placeholders).

## The rest of the API

- [API: Menus](/gloss/22-api-menus) — building, opening, mutating and closing a menu; clicks; the two menu events
- [API: Placeholders](/gloss/23-api-placeholders) — the `%gloss_…%` expansion, and where placeholders apply inside Gloss documents
- [API: Previews](/gloss/24-api-previews) — `PreviewStateProvider`, `PreviewStateProviders` and `GlossContainerPreviewAccessEvent`
{.links-list}
