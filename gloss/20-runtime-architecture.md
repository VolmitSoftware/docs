---
title: "Runtime Architecture"
description: "Gloss documentation: Runtime Architecture"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss runs two different display renderers, a single ordered enable sequence with a stack-shaped
teardown, one shared file watcher, and a small set of repeating driver tasks whose periods come
straight from `config.toml`. This page describes what actually runs so that entity counts, restart
behaviour, timing and jar contents are predictable. Configuration keys referenced here are documented
in [Configuration](/gloss/02-configuration).

## Two rendering backends

Gloss renders displays two different ways, and which one a feature uses decides who can see it and
what happens to it when the server stops.

| Backend | Used by | Entities exist server-side | Visible to |
|---|---|---|---|
| Real `TextDisplay` entities | Holograms, chat bubbles, damage indicators | Yes | Everyone in range |
| Packet-only display entities | Hologram menus, panels, container previews | No | One player |

Drop labels use neither: they set the dropped item entity's own custom name and make it visible, so
they follow vanilla nameplate rules.

**Real entities.** `HologramService` spawns actual `TextDisplay` entities into the world. The server
owns them, so every client in range sees them without Gloss sending anything per viewer, and they
appear in entity counts and in commands that select entities. They are spawned with
`setPersistent(false)`, so an orderly shutdown never writes them into the region files. Nothing about
a hologram survives a restart as an entity: the JSON document in `plugins/Gloss/holograms/` is the
only persistent state, and every display is recreated from it on the next boot. Every display Gloss
owns carries the scoreboard tag `gloss_display` and the persistent data key `gloss:hologram`, and any
tagged display that the running service does not own is swept on startup and on each
`EntitiesLoadEvent`, so a crash or a hard kill does not leave permanent leftovers. Details are in
[Holograms](/gloss/04-holograms).

**Packet-only displays.** Menus, panels and container previews never create an entity. `DisplayEntity`
builds `WrapperPlayServerSpawnEntity`, `WrapperPlayServerEntityMetadata`,
`WrapperPlayServerEntityTeleport`, `WrapperPlayServerEntityHeadLook` and
`WrapperPlayServerDestroyEntities` packets through PacketEvents and sends them to exactly one player.
Entity ids come from a counter that starts at `Integer.MIN_VALUE` and counts up, so every id is
negative and cannot collide with a real server entity; if the counter ever reaches zero Gloss logs
`Entity IDs overflow` twice at severe and asks for a restart. The display metadata indices are written
by hand (`8`–`22` for the shared display fields, `23`–`27` for text, `23`–`24` for items, `23` for
block displays), which is why the renderer refuses to run below Minecraft 1.19.4 and logs
`display-entity renderer requires Minecraft 1.19.4 or newer` once.

Operator-visible consequences of the packet path:

- Only the viewing player sees a menu, panel or preview. Another player standing in the same place
  sees nothing, and no screenshot from a bystander will ever show it.
- Nothing is stored in the world. A restart, a crash, or a plugin unload leaves no residue to clean
  up, and no entity can be duplicated into region files.
- The displays do not exist for anti-cheat, entity counters, `/kill`, or any other plugin. They also
  cannot be interacted with by vanilla means; clicks are resolved by Gloss from where the player is
  looking.
- Panel definitions in `plugins/Gloss/panels/` do persist, so a panel reappears after a restart. What
  does not persist is the rendering: each viewer is sent their own copy when they come into range.

## Plugin lifecycle

### Constructor and onLoad

The `Gloss` constructor does one thing: it runs the slimjar `SpigotApplicationBuilder`, which
downloads and loads the runtime libraries listed under [Build and packaging](#build-and-packaging).
No field initializer reachable from the constructor may touch a slimmed library, because those classes
do not exist yet at that point.

`onLoad` sets the static instance, clears the PacketEvents build cache, builds a PacketEvents API with
update checking off, and calls `load()` on it. PacketEvents is only `init()`ed later, during enable.

### onEnable

Enable is a single ordered sequence. Each step is wrapped by a helper that runs the start action and
then pushes its stop action onto a deque, so shutdown pops in exact reverse order. If any step throws,
the whole sequence aborts, the API provider is cleared, everything already started is torn down, and
the splash screen prints with the failure class and message regardless of the `splashScreen` setting.

1. Install the scheduler bridge.
2. `ImageIO.scanForPlugins()`, so the image formats provided by the slimjar-loaded imaging library are
   registered before any image icon is compiled.
3. Start PacketEvents (`packetevents`). Online users are pre-warmed into the PacketEvents user map
   first; if `init()` still fails with the known channel-injector null pointer, Gloss pre-warms again
   and retries once.
4. Construct the config loader and load `config.toml` for boot.
5. Run the data importers.
6. Snapshot the typed configuration, construct the `DataWatchdog`, and start it (`data-watchdog`).
7. Construct and enable the text pipeline, then animations, emoji, holograms, boards, groups, tablist,
   MOTD, chat, bubbles, indicators and drops, in that order.
8. Construct the HUD action bar, the localization engine, the persistence coordinator and the project
   transaction, then recover the transaction.
9. Construct `ConfigManager` (which scans `menus/` in its constructor), then `PanelService`
   (`panels`).
10. Construct the preview document registry and start watching it (`previews`).
11. Item providers (`item-providers`), container protection (`protection`), the menu session manager
    (`menus`), the panel runtime (`panel-runtime`), panel creation (`panel-creation`) and editor sync
    (`editor-sync`).
12. Push the `panel-creation-intake` and `config-watchers` entries, start the preview scale service
    (`preview-scale`), and register the outgoing `BungeeCord` plugin channel.
13. Register commands (`commands`), start bStats, register the integration service (`integration`),
    start the integration bridge (`integration-bridge`), register the API service (`api-service`) and
    the PlaceholderAPI expansion (`placeholders`), then publish `GlossAPIProvider`.

Four ordering constraints in that list are load-bearing:

- **Importers run after `config.toml` loads and before any service scans.** The HoloUi importer
  overlays `settings.json` keys onto the in-memory boot config, so it has to run after the file is
  read but before the typed snapshot is taken. It also writes documents into `menus/`, `panels/` and
  the rest, so it has to finish before `ConfigManager` scans `menus/` in its constructor and before
  `PanelService` and the registries scan on start. Importer failures are logged and never abort
  enable. See [Data Files & Hot Reload](/gloss/03-data-files).
- **Editor sync transaction recovery runs before `ConfigManager` and `PanelService`.** An interrupted
  editor sync apply is finished or rolled back while nothing has read those folders yet, so the
  services never load a half-applied project. A failure here is fatal to enable, because continuing
  would mean scanning an inconsistent data folder.
- **Previews start before menu sessions.** A menu icon can open a container preview, so the preview
  document registry must be loaded and watching before any session can exist.
- **`panel-creation-intake` and `config-watchers` are pushed late so they stop early.** Teardown is
  last-in-first-out. Pushing "stop accepting new panel creation work" and "stop the menu and image
  watchers" after the services they belong to means that on shutdown those two stop first, while the
  services behind them are still alive to drain what is already in flight.

### Shutdown, and BileTools hot reload

`onDisable` shuts down bStats, pops every teardown in reverse order, cancels the plugin's tasks both
through VolmLib's scheduler utilities and through the scheduler runtime, clears the API provider and
nulls the static instance. A teardown that throws is logged as
`Failed to shut down <system>` and the rest still run.

Gloss implements VolmLib's `ReloadAware`, so BileTools calls `onPreUnload(reason)` before unloading or
hot reloading the jar. The reason is `HOT_RELOAD` or `HOT_UNLOAD`. That hook logs the reason and then
performs the same teardown and task cancellation as `onDisable`, which is what tears down PacketEvents
and closes every open menu, panel view and preview before the classes are dropped. Without it a hot
reload would leave packet displays on players' screens with nothing left to despawn them.

## Scheduling

The first thing enable does is build a `SchedulerRuntime` and wire it into VolmLib's static
`SchedulerBridge`: sync, delayed sync, async, delayed async, sync-repeating, async-repeating, cancel,
the error handler and the info logger all route through Gloss's own runtime. Every VolmLib helper used
inside Gloss therefore schedules against this plugin rather than against `Bukkit.getScheduler()`.

Folia is supported. `paper-plugin.yml` declares `folia-supported: true`, and all entity and player
work goes through `FoliaScheduler` / `SchedulerUtils`, which dispatch onto the owning region for the
entity or location involved instead of a global main thread. Direct `Bukkit.getScheduler()` calls are
not used anywhere in Gloss.

Asynchronous work is submitted through `FoliaScheduler.runAsync`. If the platform refuses the task,
for example during shutdown, Gloss logs
`An asynchronous Gloss task was rejected by the scheduler and did not run.` and the task is dropped
rather than being run inline on the calling thread.

## The data watchdog

Every document folder that Gloss hot reloads is polled by **one** repeating sync task. `DataWatchdog`
holds a list of named poll callbacks and is started with the period from `[hotload]
watchIntervalTicks` (default 5, range 1 to 200). The registered entries are:

| Entry | Watches |
|---|---|
| `config` | `config.toml` |
| `holograms` | `holograms/` |
| `boards` | `boards/` |
| `emoji` | `emoji/` |
| `animations` | `animations/` |
| `tablist` | `tablist.json` |
| `bubbles` | `bubbles/` |
| `motd` | `motd.json` |
| `menus` | `menus/` and `images/`, plus the localization overlay refresh |
| `previews` | `previews/` |

One task instead of ten matters for two reasons. Each service would otherwise hold its own repeating
task and its own timer slot, multiplying the fixed per-task overhead for work that is almost always a
no-op modification-time check. More importantly, a Bukkit or Folia repeating task that throws is
cancelled by the platform, so a single bad document could permanently kill that service's hot reload
with no obvious symptom. The watchdog catches every `Throwable` per entry, logs
`<entry>: hot reload pass failed: <reason>` at warning, and continues with the next entry on the same
pass, so one broken folder cannot stop the others and the task itself never dies.

Changing `watchIntervalTicks` on disk restarts the watchdog with the new period as part of the
config reload. Nothing else restarts it; a `/gloss reload` reuses the running task unless the interval
actually changed.

No subsystem owns a hot-reload task of its own. `ConfigManager` and `PreviewDocumentRegistry` are the
two entries that carry extra work beyond a document reload, and both are entries like any other:

- `menus` does its fast pass — edits to files the folder watcher already knows — and its full folder
  walk for creations and deletions back to back inside one pass. That ordering is load-bearing: a
  `FolderWatcher` consumes each modification-time and size delta exactly once, so the two phases as
  separate tasks would race and whichever ran first would eat a change the other one needed. The fast
  phase compares the loaded revision, closes every open session of a changed menu, publishes the new
  definition and notifies the affected players; the same entry then refreshes the localization overlay.
- `previews` handles edits, creations and deletions together in one pass, because a changed preview
  document has to be recompiled before the resolution snapshot can be republished, and every open
  preview is closed so the raycast rebuilds it.

`panels/` is deliberately not watched at all. Panel documents are server-owned and revision-checked,
and a watcher republishing a half-written or revision-stale file would fight the editor sync and
staged-edit paths, so a hand edit needs an explicit `/gloss panel reload`. See
[Panels](/gloss/16-panels).

## Document registries and snapshot publication

Each document kind is backed by a `DocumentRegistry`, either folder-backed or single-file backed. A
registry keeps a mutable map of loaded documents and publishes an immutable copy of it into a
`volatile` snapshot field. Readers always take the snapshot, never the mutable map, so rendering
threads and region threads see a consistent set of documents with no locking and a reload swaps the
whole set in one reference assignment.

Only files ending in `.json` are read, and only files directly inside the folder; subfolders are
ignored. A file that fails to parse is logged as `<kind>/<id>.json <reason>` and skipped, and the copy
already in memory stays live, so a bad edit stops applying instead of deleting a working document.

Every loaded document is stored as `GlossDocument(id, contentHash, raw, value, revision)` where
`contentHash` is the SHA-256 of the raw file text.

**Own-write suppression.** `DocumentStore` writes documents by rendering the JSON, recording the
SHA-256 of the exact bytes it is about to write, writing to a temp file in the same folder and moving
it into place with an atomic move. When the folder watcher later reports that file as changed, the
registry asks the store whether the file's current SHA-256 matches the hash it recorded. If it does,
the change is Gloss's own write and is skipped. That is why a command edit does not bounce back
through the hot reload path and re-trigger a full reapply, while a hand edit made in a text editor
does. `config.toml` uses the same idea through `GlossConfigLoader.isSelfWrite()`, which stops
canonicalisation rewrites from looping.

## Text rendering and refresh cadences

Every rendered string runs through `TextPipeline.render(viewer, raw)` in a fixed order:

1. `|function|` tokens, including `|animation.<id>|` and `|metric.<key>|`, when `[text] functions` is on
   and the string contains a `|`. A function that throws is logged once per function name and yields an
   empty string.
2. PlaceholderAPI placeholders, when `[text] placeholders` is on, the string contains a `%`, **and** a
   viewer was supplied. `renderStatic` passes no viewer, so shared holograms and temporary holograms
   skip this stage and leave the tokens as written.
3. Emoji replacement.
4. Colours: `[RRGGBB]` bracket hex first (validated as exactly six hex digits followed by `]`, with a
   bounded translation cache), then `&` codes.

Two shorter paths branch off the same object. Chat gets emoji if `[features] emoji` is on and the sender
holds `gloss.emoji.use`, then colours if `[chat] color` is on and the sender holds `gloss.chat.color`.
`renderMenuText(viewer, raw)` gets emoji and colours only — no function stage, so a literal `|` in a menu
label can never be read as a token, and no extra placeholder pass beyond the one the menu renderer
already performs. Menu and panel text icons call it after their own PlaceholderAPI pass and before
`TextUtils.parse`; container preview labels take the emoji half alone, between the expression result and
`TextUtils.parse`.

Refresh cadences per surface:

| Surface | Period | Source |
|---|---|---|
| Holograms | `[holograms] updateIntervalTicks` (default 10) | `HologramService` driver task |
| Temporary holograms (bubbles, indicators) | `[holograms] temporaryUpdateIntervalTicks` (default 2) | `HologramService` temporary task |
| Scoreboards | `[boards] updateIntervalTicks` (default 20) | `BoardService` sidebar driver |
| Tablist | `[tablist] updateIntervalTicks` (default 40) | `TablistService` driver task |
| Menu, panel and preview sessions | every tick | session tick loop |
| Preview live fields | every 4 session ticks | `ContainerPreview` refresh interval |
| Preview access recheck | every 10 session ticks | `ContainerPreview` access interval |
| `menus/` and `images/` hot reload | 5 ticks fast, 20 ticks slow | `ConfigManager` |
| Document folders and `config.toml` | `[hotload] watchIntervalTicks` (default 5) | `DataWatchdog` |

Hologram text is only re-sent when the rendered string actually changed. Preview cells, labels and
slots are likewise only re-sent when the computed colour, component or item differs from what was last
applied, so a preview whose contents are static costs nothing beyond the comparison. Changing a
hologram driver interval takes effect on the next reload of that service; the session tick loop is
fixed at one tick and is not configurable.

## Telemetry Gloss publishes

`GlossIntegrationService` registers `IntegrationServiceContract` with the Bukkit `ServicesManager` at
`Normal` priority. It reports plugin id `gloss`, the jar version, protocol versions 1.0 and 1.1, and
the capabilities `handshake`, `heartbeat` and `metrics`. A consumer handshakes, negotiates the highest
common protocol version, and then calls `sampleMetrics`, passing either an explicit key set or an
empty set to mean "everything". There is no compile-time dependency in either direction; the shared
metric schema lives in VolmLib.

The 19 published keys:

| Key | Value |
|---|---|
| `gloss.session-holders` | players with an active session holder |
| `gloss.menus-open` | open hologram menus |
| `gloss.previews-open` | open container previews |
| `gloss.display-entities` | packet display entities allocated |
| `gloss.display-entities-visible` | packet display entities currently spawned to a viewer |
| `gloss.menu-definitions` | menu documents registered |
| `gloss.packets-per-second` | display packets sent per second |
| `gloss.spawns-per-second` | packet display spawn and despawn events per second |
| `gloss.tick-ms` | milliseconds per second spent in the session tick loop |
| `gloss.preview-refresh-per-second` | preview content refreshes per second |
| `gloss.holograms-active` | holograms loaded |
| `gloss.panels-active` | panels loaded |
| `gloss.boards-active` | scoreboard documents loaded |
| `gloss.tablist-players` | players whose tablist Gloss manages |
| `gloss.animations-active` | animation documents loaded |
| `gloss.bubbles-per-second` | chat bubbles spawned per second |
| `gloss.indicators-per-second` | damage indicators spawned per second |
| `gloss.emoji-replacements-per-second` | emoji substitutions per second |
| `gloss.builder-server-running` | always reported unavailable, reason `builder-server-removed` |

The counter-derived keys (everything ending in `-per-second`, plus `gloss.tick-ms`) are computed from
free-running counters against a one-second window: a sample taken sooner than a second after the
previous one returns the last computed rate rather than recomputing. The rest are read live from the
owning service, and a key whose service is not constructed yet is reported unavailable with a reason
such as `holograms-not-ready` rather than as a zero. Unregistering the service clears all counters.

`gloss.builder-server-running` is kept in the shared schema for compatibility and is permanently
unavailable, because Gloss does not host the web editor. See
[Web Editor & Sync](/gloss/18-web-editor).

React consumes these through its `SamplerGloss*` samplers, one per key, with ids of the form
`gloss-menus`, `gloss-holograms`, `gloss-packets` and so on.

> The metric ids changed from `holoui.*` to `gloss.*` and the React sampler ids from `holoui-*` to
> `gloss-*`. A saved React monitor configuration that names the old sampler ids will not resolve them
> and those panes will come up empty. Re-select the `gloss-*` samplers in any monitor that used the
> HoloUi ones.
{.is-warning}

Separately, `[root] metrics` controls anonymous bStats reporting, which submits two custom charts
(`holograms_enabled` and `boards_enabled`). Gloss reports under bStats plugin id `33525`; setting
`metrics = false` disables submission entirely.

## What Gloss reads from other plugins

`VaultPermissionHook` looks up the registered Vault `Permission` provider through the
`ServicesManager` and uses it for group resolution, with no hard dependency. PlaceholderAPI is
consumed through the expansion API, and the custom item plugins through their own APIs behind the
provider registry described in [Custom Items & Item Providers](/gloss/14-custom-items).

### The integration bridge

`IntegrationBridgeService` is the consumer side of the same contract Gloss publishes. It is started as
the `integration-bridge` step of enable, immediately after `integration`, and it turns the metrics
other Volmit plugins publish into content Gloss can display.

**Discovery.** Every registration of `IntegrationServiceContract` on the `ServicesManager` is a
candidate except Gloss's own — a plugin sampling itself through the bridge would be a loop. Each
candidate gets a handshake carrying plugin id `gloss`, the jar version, protocol versions 1.0 and 1.1
and the capabilities `handshake`, `heartbeat` and `metrics`. A contract that declines, that advertises
no metric descriptors, or that throws is skipped and logged; an accepted one has its descriptor keys
cached. There is no compile-time dependency on any of those plugins: the contract type lives in
VolmLib, which Gloss shades without relocating.

Discovery re-runs on `PluginEnableEvent` and `PluginDisableEvent`, so installing or disabling a plugin
mid-session adds or removes its metrics without a restart. Each re-discovery unregisters the text
functions and preview providers from the previous round and registers the new set, and any cached
sample whose key no longer exists is dropped.

**What each accepted contract produces.** One `|metric.<key>|` text function per descriptor key,
registered on the same `TextPipeline.registerFunction` mechanism the animation service uses, and one
`PreviewStateProvider` per namespace — the first segment of the metric keys — so the same values are
readable from preview expressions under their native dotted names. See
[Emoji, Text & Animations](/gloss/07-emoji-text-animations) and
[Expressions & Placeholders](/gloss/13-expressions-placeholders).

**Sampling.** A repeating sync task runs every `[integration] sampleIntervalTicks` (default 20, range
1 to 200) and calls `sampleMetrics` once per contract, passing only the keys something has asked for
recently — a rendered `|metric.<key>|` token, or a preview reading that namespace. A key stays in the
recently-requested set for 60 seconds after its last request, and the set is capped at 256 keys with
the least recently requested dropped first. A contract requesting no keys is not called at all, so a
server whose content never mentions a metric never samples another plugin. The task runs on the sync
scheduler because that is the thread the publishing plugins expect to be sampled on, exactly as React
samples them; results are published into one immutable map behind a `volatile` field, so region
threads rendering previews and the text pipeline read them lock-free.

Only samples the publisher marks available and whose value is finite are published. Everything else —
unavailable, non-finite, or not sampled yet — is simply absent, which renders as an empty string in
text and as a missing variable in a preview expression. Changing `sampleIntervalTicks` restarts the
sampler on the next config reload; disabling the service unregisters every function and provider and
clears the cache.

## HUD action bar

Gloss publishes to VolmLib's cooperative action bar rather than sending action bar text directly, so
it merges with other plugins writing to the same slots instead of fighting them. It uses two purposes:

| Purpose | Priority | Time to live | Raised by |
|---|---|---|---|
| `gloss:preview` | interactive | 1500 ms | the preview scale service, while a preview is being scaled |
| `gloss:reload` | notice | 2500 ms | `ConfigManager`, when an open menu's document changed on disk |

Both write to the centre and right slots. `gloss:preview` is cleared explicitly when the preview ends,
and every Gloss segment is cleared for a player on quit.

## Build and packaging

Gloss ships one shaded jar. A small set of libraries is **not** in that jar and is downloaded on first
start by slimjar, from the constructor, before anything else runs:

| Library | Relocated to |
|---|---|
| PacketEvents (API and Spigot implementation) | `art.arcane.gloss.libs.packetevents.api` / `.impl` |
| Adventure MiniMessage, NBT and legacy serializer | `art.arcane.gloss.libs.kyori` |
| Commons IO and Commons Imaging | `art.arcane.gloss.libs.commons` |
| toml4j | `art.arcane.gloss.libs.toml` |

bStats is relocated to `art.arcane.gloss.libs.bstats` and slimjar itself to
`art.arcane.gloss.libs.slimjar`. The first start therefore needs outbound network access to fetch
those artifacts; afterwards they are cached locally by slimjar and startup is offline.

Two descriptors ship in the jar. Paper and Folia read `paper-plugin.yml`, which declares
`folia-supported: true`, `load: STARTUP`, and its soft dependencies as `load: BEFORE` with
`join-classpath: true`. Spigot reads `plugin.yml`, which declares `load: POSTWORLD`, the `softdepend`
list, the three root commands and the whole permission tree. Both are filled in at build time with the
name, version, main class and api-version.

**Spigot compatibility.** The build compiles the whole source tree a second time against the Spigot
API with `src/main/java/art/arcane/gloss/paper/**` excluded, and that compile is part of `build`. The
rule this enforces is stricter than "no Paper imports": no code outside `art.arcane.gloss.paper` may
call any Bukkit or Paper method whose signature contains an Adventure type. Adventure is relocated at
runtime, so such a call compiles fine and then fails on a live server with `NoSuchMethodError` when
the relocated type does not match the server's. Adventure may be used freely for Gloss's own values
and inside packet payloads; it just may not appear in a call into the server API. Conversely,
`art.arcane.gloss.paper` is the only package allowed to touch `io.papermc` or `com.destroystokyo`
types, and is the only package that may not use Adventure at all.

That package holds exactly one Bukkit listener, `PaperTabCompleteListener`, which adds emoji
suggestions to Paper's `AsyncTabCompleteEvent` for non-command chat input. Servers without that event
simply do not get emoji tab completion. The other two classes in the package are a lock-check adapter
that fires Paper's `BlockLockCheckEvent` for container previews and the Paper command registrar. All
three are reached by class name through reflection and are silently skipped when the class or the
platform is absent.

## Frozen container-preview arithmetic

The compiled output of every shipped container preview is pinned by 43 golden files under
`src/test/resources/golden`. They were carried over byte-identical from HoloUi and their producer was
deleted deliberately, so they are not regenerable and are never re-recorded.

What they pin is the exact compiled result: element order, exactly one evaluation per value supplier,
colour strings formatted as `#AARRGGBB`, and the card framing arithmetic that positions cells, labels
and slots. Preview geometry and colour formatting are therefore treated as frozen. A change that
shifted a cell by a fraction of a block or emitted a colour in a different notation would be a visible
change to every operator's previews and would break the goldens with no way to re-record them. New
behaviour is added around that arithmetic, not inside it. Preview authoring is covered in
[Container Previews](/gloss/15-container-previews).

## Editor sync session secrets

`plugins/Gloss/editor-sync-sessions.json` holds the secrets for live web editor sessions. It is
excluded from every path that copies or transmits data:

- The HoloUi importer explicitly refuses it and records the skip in the import receipt with the reason
  `session secrets are never imported`, along with the sync transaction and backup folders.
- The editor sync exporter does not walk the data folder. It builds each payload from the named menu
  and panel documents plus the `images/` files those documents reference, resolved through a
  path-confinement check, so the session file can never be swept into a project.

If the file cannot be read at boot, editor sync is disabled with a severe log entry naming the file,
and the rest of Gloss enables normally with one-way editor handoffs still available.

> Treat `editor-sync-sessions.json` as a credential file. Anyone holding its contents can act on a
> live editor session. Do not copy it between servers, into backups you share, or into a bug report.
{.is-danger}
