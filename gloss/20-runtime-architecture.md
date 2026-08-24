---
title: "Runtime Architecture"
description: "Gloss documentation: Runtime Architecture"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss runs two different display renderers. It uses a single ordered enable sequence with a
stack-shaped teardown. It uses one shared watchdog task. It uses a small set of repeating driver
tasks whose ordinary periods come from `config.toml`.

This page describes what actually runs so that entity counts, restart behavior, timing and jar
contents are predictable. Configuration keys referenced here are documented in
[Configuration](/gloss/02-configuration).

## Two rendering backends

Gloss renders displays two different ways. Which one a feature uses decides who can see it. It also
decides what happens to it when the server stops.

| Backend | Used by | Entities exist server-side | Visible to |
|---|---|---|---|
| Real server display entities | Holograms, chat bubbles, damage indicators, and real-drop block/item models and labels | Yes | The feature's tracked audience |
| Packet-only display entities | Hologram menus, panels, container previews | No | One player |

Drop naming always keeps a native custom-name fallback on the authoritative item entity. With real
drops off or unavailable, that visible name follows vanilla nameplate rules. With real drops on,
Gloss hides the native item and name from client tracking and shows non-persistent `BlockDisplay` or
`ItemDisplay` models plus an optional `TextDisplay` label instead. The original item still owns
physics, merging, pickup and despawn.

**Real entities.** `HologramService` spawns actual `TextDisplay` entities into the world.
`RealDropService` spawns actual block, item and text displays and mounts extra models and the label
to the first model. The server owns all of these displays. Server entity tracking distributes them;
Gloss can still filter a hologram or temporary effect to selected viewers. They appear in entity
counts and in commands that select entities.

A personalized persistent hologram still owns one real `TextDisplay`. Its authoritative text is
blank, and Gloss sends each in-range player viewer-specific text metadata for that shared entity
id. Personalization therefore scales packet rendering with the due audience without multiplying
the number of server entities by the audience size.

Each live chat message is one real multiline `TextDisplay`, regardless of how many visible-character rows its BubbleStyle wrap produces. Its position, scale, rotation and opacity are expression-driven presentation state on that same entity; they do not create child displays.

They are spawned with `setPersistent(false)`. An orderly shutdown never writes them into the region
files. Nothing about a hologram or real-drop presentation survives a restart as a display entity.
Hologram JSON and `real-drops/default.json` are the persistent definitions; the displays are rebuilt
from them and the live item entities.

Hologram-service displays carry the scoreboard tag `gloss_display` and persistent data key
`gloss:hologram`; orphaned tagged text displays are swept on startup and `EntitiesLoadEvent`.
Startup admits at most 32 already-loaded chunks to that sweep per tick, and cancellation discards
the remaining backlog with the hologram service.
Real-drop displays carry a separate owner marker keyed to the native item's UUID, while that item
stores the visibility values Gloss must restore. Pickup, merge, unload, reload and shutdown remove
the presentation; load-time reconciliation heals an interrupted lifecycle. Enable, reload and
real-drop document publication queue already-loaded chunks at no more than 32 per tick, with each
chunk applied on its owning region; a newer queue or shutdown cancels the stale backlog. Details are in
[Holograms](/gloss/04-holograms) and [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops).

**Packet-only displays.** Menus, panels and container previews never create an entity.
`DisplayEntity` builds `WrapperPlayServerSpawnEntity`, `WrapperPlayServerEntityMetadata`,
`WrapperPlayServerEntityTeleport`, `WrapperPlayServerEntityHeadLook` and
`WrapperPlayServerDestroyEntities` packets through PacketEvents. It sends them to exactly one
player.

Entity ids come from a counter that starts at `Integer.MIN_VALUE` and counts up. Every id is
negative and cannot collide with a real server entity. If the counter ever reaches zero, Gloss logs
`Entity IDs overflow` twice at severe and asks for a restart.

The display metadata indices are written by hand (`8`–`22` for the shared display fields, `23`–`27`
for text, `23`–`24` for items, `23` for block displays). That is why the renderer refuses to run
below Minecraft 1.19.4. It logs `display-entity renderer requires Minecraft 1.19.4 or newer` once.

Operator-visible consequences of the packet path:

- Only the viewing player sees a menu, panel or preview. Another player standing in the same place
  sees nothing, and no screenshot from a bystander will ever show it.
- Nothing is stored in the world. A restart, a crash, or a plugin unload leaves no residue to clean
  up, and no entity can be duplicated into region files.
- The displays do not exist for anti-cheat, entity counters, `/kill`, or any other plugin. They also
  cannot be interacted with by vanilla means. Clicks are resolved by Gloss from where the player is
  looking.
- Panel definitions in `plugins/Gloss/panels/` do persist, so a panel reappears after a restart. What
  does not persist is the rendering: each viewer is sent their own copy when they come into range.

## Plugin lifecycle

### Constructor and onLoad

The `Gloss` constructor does one thing. It runs the slimjar `SpigotApplicationBuilder`. That builder
downloads and loads the runtime libraries listed under [Build and packaging](#build-and-packaging).
No field initializer reachable from the constructor may touch a slimmed library. Those classes do
not exist yet at that point.

`onLoad` sets the static instance, clears the PacketEvents build cache, builds a PacketEvents API
with update checking off, and calls `load()` on it. PacketEvents is only `init()`ed later, during
enable.

### onEnable

Enable is a single ordered sequence. Each step is wrapped by a helper that runs the start action
and then pushes its stop action onto a deque. Shutdown pops in exact reverse order. If any step
throws, the whole sequence aborts. The API provider is cleared. Everything already started is torn
down. The splash screen prints with the failure class and message regardless of the `splashScreen`
setting.

1. Install the scheduler bridge.
2. `ImageIO.scanForPlugins()`, so the image formats provided by the slimjar-loaded imaging library are
   registered before any image icon is compiled.
3. Start PacketEvents (`packetevents`). Online users are pre-warmed into the PacketEvents user map
   first. If `init()` still fails with the known channel-injector null pointer, Gloss pre-warms again
   and retries once.
4. Construct the config loader and load `config.toml` for boot.
5. Run the data importers.
6. Snapshot the typed configuration, construct the `DataWatchdog`, and start it (`data-watchdog`).
7. Construct and enable the text pipeline, then animations, emoji, holograms, boards, groups, tablist,
   MOTD, chat, bubbles, indicators and drops, in that order.
8. Construct the HUD action bar, the localization engine, the persistence coordinator and the project
   transaction, then recover the transaction.
9. Construct `MenuCatalog` (which scans `menus/` in its constructor) and `ImageAssets`, then
   `PanelService` (`panels`).
10. Construct the preview document registry and start watching it (`previews`).
11. Item providers (`item-providers`), container protection (`protection`), the menu session manager
    (`menus`), the panel runtime (`panel-runtime`), panel creation (`panel-creation`) and editor sync
    (`editor-sync`).
12. Push the `panel-creation-intake` entry, start the `menu-catalog`, `image-assets` and
    `locale-watcher` watch entries and the preview scale service (`preview-scale`), and register the
    outgoing `BungeeCord` plugin channel.
13. Register commands (`commands`) by binding `plugin.yml` on Spigot or installing Paper's
    `LifecycleEvents.COMMANDS` handler, start bStats, register the integration service (`integration`),
    start the integration bridge (`integration-bridge`), register the API service (`api-service`) and
    the PlaceholderAPI expansion (`placeholders`), then publish `GlossAPIProvider`.

Four ordering constraints in that list are load-bearing:

- **Importers run after `config.toml` loads and before any service scans.** The HoloUi importer
  overlays `settings.json` keys onto the in-memory boot config. It has to run after the file is
  read but before the typed snapshot is taken. It also writes documents into `menus/`, `panels/` and
  the rest. It has to finish before `MenuCatalog` scans `menus/` in its constructor. It also has
  to finish before `PanelService` and the registries scan on start. Importer failures are logged
  and never abort enable. See [Data Files & Hot Reload](/gloss/03-data-files).
- **Editor sync transaction recovery runs before `MenuCatalog` and `PanelService`.** An interrupted
  editor sync apply is finished or rolled back while nothing has read those folders yet. The
  services never load a half-applied project. A failure here is fatal to enable, because continuing
  would mean scanning an inconsistent data folder.
- **Previews start before menu sessions.** A menu icon can open a container preview. The preview
  document registry must be loaded and watching before any session can exist.
- **`panel-creation-intake` and `config-watchers` are pushed late so they stop early.** Teardown is
  last-in-first-out. Those stop actions are pushed after the services they belong to. On shutdown
  those two stop first. The services behind them stay alive to drain what is already in flight.

### Shutdown, and BileTools hot reload

`onDisable` shuts down bStats and pops every teardown in reverse order. It cancels the plugin's
tasks through VolmLib's scheduler utilities and through the scheduler runtime. It then clears the
API provider and nulls the static instance. A teardown that throws is logged as
`Failed to shut down <system>` and the rest still run.

Gloss implements VolmLib's `ReloadAware`. BileTools calls `onPreUnload(reason)` before unloading or
hot reloading the jar. The reason is `HOT_RELOAD` or `HOT_UNLOAD`. That hook logs the reason and
then performs the same teardown and task cancellation as `onDisable`. That is what tears down
PacketEvents and closes every open menu, panel view and preview before the classes are dropped.
Without it a hot reload would leave packet displays on players' screens with nothing left to
despawn them.

## Scheduling

The first thing enable does is build a `SchedulerRuntime`. It wires that runtime into VolmLib's
static `SchedulerBridge`. Sync, delayed sync, async, delayed async, sync-repeating, async-repeating,
cancel, the error handler and the info logger all route through Gloss's own runtime. Every VolmLib
helper used inside Gloss therefore schedules against this plugin rather than against
`Bukkit.getScheduler()`.

Folia is supported. `paper-plugin.yml` declares `folia-supported: true`. All entity and player work
goes through `FoliaScheduler` / `SchedulerUtils`. Those helpers dispatch onto the owning region for
the entity or location involved instead of a global main thread. Direct `Bukkit.getScheduler()`
calls are not used anywhere in Gloss.

The hologram viewer index is updated by join, quit, movement, teleport, world-change, respawn and
vehicle passenger events. A round-robin reconciliation also samples at most 32 distinct indexed
players per tick on each player's entity scheduler. That bounded sweep corrects passenger and
platform movement that produces no `PlayerMoveEvent`, without turning one tick into a 1,000-player
scan.

Asynchronous work is submitted through `FoliaScheduler.runAsync`. If the platform refuses the task,
for example during shutdown, Gloss logs
`An asynchronous Gloss task was rejected by the scheduler and did not run.` The task is dropped
rather than being run inline on the calling thread.

## The data watchdog

Every document folder that Gloss hot reloads is polled by **one** repeating task, and that task
does its work on **one** thread that is not the server thread. `DataWatchdog` holds a list of named
poll callbacks. It is started with the period from `[hotload] watchIntervalTicks` (default 5, range
1 to 200). The registered entries are:

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
| `real-drops` | `real-drops/` |
| `menus` | `menus/`, subdirectories included |
| `images` | `images/` |
| `locale` | `language.yml` |
| `previews` | `previews/` |

### The IO thread

The repeating task is a tick pump and nothing else. On each fire it requests work from a single
daemon thread named `Gloss-Watchdog-IO`. Only one pass is in flight. Requests made while a pass or
its authoritative-thread apply phase is active collapse into one latest-state trailing pass behind
the 3-second completion cooldown, so a slow or contended disk cannot stack work or lose the final
save.

Everything that can run off-thread does: `stat`, the file read, the SHA-256 self-write hash, and the
JSON parse. Only the apply half hops back, and it hops to the right place — the server thread on
Paper and Spigot, the owning region thread on Folia and Canvas — before it touches a world, an
entity or a player. The console shows the split on every hot reload:

```text
[Gloss-Watchdog-IO/INFO]: [Gloss] config.toml changed on disk; reloading.
[Server thread/INFO]: [Gloss] Reloaded in-place from disk.
```

```text
[Gloss-Watchdog-IO/INFO]: [Gloss] Board document "default" changed and was reloaded.
```

On a region-threaded server the second line reads `[Folia Region Scheduler Thread #N/INFO]`
instead. `watchIntervalTicks` controls how often a pass is requested, while the completion-anchored
gate starts automatic passes no more than once every 3 seconds and retains one latest-state trailing
request. Native events drive the common path and bounded rolling SHA-256 reconciliation catches
silent or same-metadata saves. JSON registries perform their full membership fallback about every
18 seconds and begin exact-content reconciliation about every 6 seconds, with both windows anchored
to completion. The ten registry kinds split evenly across two 3-second start slots. Their shared
per-pass reconciliation budget yields after 32 files, 8 MiB, or about 10 ms, and a registry publishes
its reconciliation batch only after its complete walk. Config and localization likewise avoid byte
capture on idle passes and use their pending verification or 6-second and 9-second exact fallbacks.
Disk work stays on `Gloss-Watchdog-IO`.

Document registries stage immutable parsed snapshots without publishing them. A successful
consumer apply acknowledges and publishes the staged document exactly once. A refused scheduler
handoff or an exception during preparation or apply leaves the committed runtime snapshot intact,
logs the full failure when one exists, and requeues the affected ids against the newest bytes on
the next eligible pass. An accepted callback is leased to that batch, so a late or repeated callback
cannot apply it twice.

One task instead of twelve matters for two more reasons. Each service would otherwise hold its own
repeating task and its own timer slot. That would multiply the fixed per-task overhead for work that
usually drains no native events and advances only a bounded reconciliation slice.

More importantly, a Bukkit or Folia repeating task that throws is cancelled by the platform. A
single bad document could permanently kill that service's hot reload with no obvious symptom. The
watchdog catches every `Throwable` per entry. It logs the full stacktrace with
`<entry>: hot reload pass failed.` and continues with the next entry on the same pass. One broken
folder cannot stop the others. The task itself never dies.

Changing `watchIntervalTicks` on disk reschedules the tick pump with the new period as part of the
config reload without replacing the IO worker or releasing the active batch. A `/gloss reload`
keeps the current pump when the interval is unchanged.

No subsystem owns a hot-reload task of its own. `MenuCatalog` and `PreviewDocumentRegistry` are the
two entries that carry extra work beyond a document reload. Both are entries like any other:

- `menus` is a folder-tree `DocumentRegistry` on the same spine as `holograms/` and `boards/`.
  Discovery, own-write suppression by content hash and per-file parse failure therefore behave the
  way they do for every other kind, nested subdirectories included; a menu carries no envelope, so
  the content hash the registry already computes is its revision. One reconciliation reports
  changed, created and deleted files together, so the phases cannot be split across separate tasks
  that independently consume the same native and content delta. On top of the reload the entry closes every open session
  of a changed menu, publishes the new definition and notifies the affected players. Its read is
  taken under the persistence lease, because `menus/` is one of the collections an editor sync
  transaction stages and swaps, and a pass that read the folder mid-publish would load half a
  project.
- `previews` handles edits, creations and deletions together in one pass. A changed preview
  document has to be recompiled before the resolution snapshot can be republished. Every open
  preview is closed so the raycast rebuilds it.

`images` is deliberately not a document registry. An image is bytes an operator dropped in, with no
id or envelope. Its `ReactiveFolder` drains native events and rolls SHA-256 reconciliation through
the folder without decoding images; any verified change refreshes open menu sessions and panel
views. `locale` is the third small entry: two identical immutable SHA-256 snapshots must agree
before it refreshes the localization overlay from `language.yml`.

None of these entries creates its folder. `menus/`, `images/` and `panels/` are created by the
paths that write into them, discovery tolerates a missing root, and a folder that appears later has
its contents reported as creations. That is why a server whose operator never authors a menu never
grows a `menus/` folder, and why deleting one does not bring it back on the next pass. Loaded
documents below a missing root enter the same 3-second deletion grace as individual files; restoring
the root cancels the unload.

`panels/` is deliberately not watched at all. Panel documents are server-owned and revision-checked.
A watcher republishing a half-written or revision-stale file would fight the editor sync and
staged-edit paths. A hand edit needs an explicit `/gloss panel reload`. See
[Panels](/gloss/16-panels).

## The persistence write permit

`GlossPersistenceCoordinator` holds one fair write permit for the whole data folder. In-game
writers, the menu hot-reload watcher, the panel queue and editor-sync publications all take it, so
writes serialize instead of interleaving. That makes an abandoned lease expensive: a scheduler hop
that is accepted and never runs, or a future that never completes, would park every later write for
the life of the server.

Two bounds close that. An external transaction open longer than 120 seconds is force-aborted, the
permit is released, and a `SEVERE` line names the abandoned publication as needing a retry. The
abort takes the same compare-and-set a normal close does, so the owner's later `close()` is a no-op
and the permit can never be released twice. The check is hung off the entry paths rather than a
timer — the hot-reload watchdog calls `tryRead` on `Gloss-Watchdog-IO` every pass, so the lease is
reclaimed within one poll of the deadline even when the server thread is the stuck one. Separately,
a menu publication queued behind the permit times out after 30 seconds rather than waiting forever.

Editor-sync project JSON is parsed on the sync executor and only the publish hops back to the server
thread, so project size does not translate into tick time.

## Document registries and snapshot publication

Each document kind is backed by a `DocumentRegistry` in one of three layouts: single-file, flat
folder, or the folder tree `menus/` uses. A registry keeps a mutable map of loaded documents. It publishes an immutable copy of it into a
`volatile` snapshot field. Readers always take the snapshot, never the mutable map. Rendering
threads and region threads see a consistent set of documents with no locking. A reload swaps the
whole set in one reference assignment.

Only files ending in `.json` are read. A flat-folder registry reads only the files directly inside
its folder and ignores subfolders; a tree registry walks the whole subtree and derives the id from
the relative path. A file that fails to parse is logged as one warning line, `<kind>/<id>.json
<reason>`, and skipped. The copy already in memory stays live. A bad edit stops applying instead of
deleting a working document.

A registry never creates its folder. A missing root is an empty snapshot, not an error, and the
folder appearing later reports its contents as creations.

Every loaded document is stored as `GlossDocument(id, contentHash, raw, value, revision)` where
`contentHash` is the SHA-256 of the raw file text.

**Own-write suppression.** `DocumentStore` writes documents by rendering the JSON. It records the
SHA-256 of the exact bytes it is about to write. It writes to a temp file in the same folder and
moves it into place with an atomic move. When the folder watcher later reports that file as
changed, the registry asks the store whether the file's current SHA-256 matches the hash it
recorded. If it does, the change is Gloss's own write and is skipped.

That is why a command edit does not bounce back through the hot reload path and re-trigger a full
reapply. A hand edit made in a text editor does. `config.toml` uses the same idea through
`GlossConfigLoader.isSelfWrite()`, which stops canonicalization rewrites from looping.

## Text rendering and refresh cadences

Every authored rendered string runs through `TextPipeline.render(viewer, raw)` in a fixed order:

1. `|function|` tokens, including `|animation.<id>|` and `|metric.<key>|`, when `[text] functions` is on
   and the string contains a `|`. A function that throws is logged once per function name and yields an
   empty string.
2. Inline `{{ expression }}` blocks.
3. PlaceholderAPI placeholders, when `[text] placeholders` is on, the string contains a `%`, **and** a
   viewer was supplied. `renderStatic` passes no viewer, so shared holograms and temporary holograms
   skip this stage and leave the tokens as written.
4. Emoji replacement.
5. Colors: `[RRGGBB]` bracket hex first (validated as exactly six hex digits followed by `]`, with a
   bounded translation cache), then `&` codes.

Two shorter paths branch off the same object. Chat gets emoji if `[features] emoji` is on and the
sender holds `gloss.emoji.use`. Then it gets colors if `[chat] color` is on and the sender holds
`gloss.chat.color`.

BubbleStyle prefixes use the full authored pipeline with the speaker as viewer and refresh while a
dynamic token is present. The final player-chat payload does not: it is retained as already-rendered
text so its permitted colors and decorations survive wrapping, raw unauthorized `&` codes stay
literal, and player input cannot invoke a Gloss function or expression. Bubble motion is a separate
precompiled numeric expression scope evaluated once per temporary-hologram drive.

`renderMenuText(viewer, raw)` delegates to that same full pipeline. Menu and panel text icons call it
before `TextUtils.parse`; complete function, expression and PAPI tokens therefore refresh with the
viewer. Container preview labels evaluate their whole-field expression first and take the emoji half
between that result and `TextUtils.parse`.

Refresh cadences per surface:

| Surface | Period | Source |
|---|---|---|
| Holograms | `[holograms] updateIntervalTicks` (default 10); clock-driven text uses 1 tick | `HologramService` driver task |
| Temporary holograms (bubbles, indicators) | `[holograms] temporaryUpdateIntervalTicks` (default 2) | `HologramService` temporary task |
| Fast hologram animation frames (clips over 20 fps) | adaptive, floor `1000 / [holograms] maxAnimationFps` ms | `Gloss Animator` thread |
| Scoreboards | `[boards] updateIntervalTicks` (default 20); active clock-driven boards use a separate 1-tick driver | `BoardService` sidebar drivers |
| Tablist | `[tablist] updateIntervalTicks` (default 40); animated header/footer uses 1 tick for all recipients, while animated names and API overrides use a selected-player 1-tick cohort | `TablistService` ordinary and fast-cohort tasks |
| Bubble expiry accounting | fixed 20 ticks | `ChatBubblesService` coarse sweep; movement and dynamic prefixes reuse each bubble's owner-bound temporary-hologram sample |
| Menu, panel and preview sessions | every tick | session tick loop |
| Preview target discovery | at most 10 queued players per tick; stationary fallback is spread over 100 ticks | `MenuSessionManager` fair discovery queue |
| Preview live fields | every 4 session ticks | `ContainerPreview` refresh interval |
| Preview access recheck | every 10 session ticks | `ContainerPreview` access interval |
| Document folders, `images/`, `language.yml` and `config.toml` | `[hotload] watchIntervalTicks` (default 5) | `DataWatchdog` |

Hologram and scoreboard text are only re-sent when the rendered string actually changed. Tablist
content uses the same change gate, plus a staggered header/footer anti-entropy heartbeat capped at 64
recipients per ordinary cycle; list names reconcile only when the server-side value was overwritten.
Hologram and tablist drivers change cadence automatically when hot-loaded documents or API updates
add or remove clock dependencies and named animations. Tablist list-name selection is tracked per
player, so an animated group format does not promote unrelated players to the fast task, and repeated
requests for a lagging player collapse into one latest owner-thread update.
Personalized hologram animation templates are memoized before player-owner dispatch; due work for
all holograms targeting one player is keyed and latest-write-wins behind one player-scheduler drain.
Each persistent hologram retains one real display while its recipient-specific text travels as
metadata for that shared entity id. Clock-driven literal segments still become due every tick,
while stable personalized templates use the configured persistent cadence. Scoreboards place
animated and ordinary players on separate drivers so one animated sidebar does not force every
other player's PAPI board onto the fast path. Bubble motion likewise applies only presentation
values that changed, and one multiline entity replaces the previous per-row bubble entities.
Temporary effects in the same 16-block cell and range reuse immutable guaranteed-in-range and
boundary snapshots for the whole temporary-driver pass. Each exact anchor checks only the boundary;
nonempty visibility filters derive from that exact audience. Preview cells, labels and
slots are likewise only re-sent when the computed color, component or item differs from what was
last applied. A preview whose contents are static costs nothing beyond the comparison. The session tick loop is fixed at one tick and is not configurable.

Panel follow poses are indexed by target player. A movement sample resolves only that target's
panels, copy-on-write updates only their definition partitions and old/new chunk buckets, and marks
only those buckets changed. A standing viewer therefore keeps its candidate snapshot when a followed
panel moves outside the viewer's padded query window; an intersecting move invalidates it immediately.

High-population display admission is bounded independently of world distribution. Damage indicators
admit at most the configured rate multiplied by lifetime, rounded up, with a hard ceiling of 2,048;
the shipped configuration admits 120. Real drops admit at most 2,048 presentations server-wide in
addition to their per-chunk display budget. Rejected real drops keep the native item visible and do
not start an item-owned update loop. Indicator permission visibility reads an entity-thread-owned
snapshot refreshed immediately by player lifecycle and chunk-transition events plus five-second
periodic reconciliation in a due-time cohort of at most 16 players every two ticks. Enable and
reload feed the same bounded cohort instead of dispatching the whole online population at once, and
an indicator never dispatches a player task for each nearby viewer.

The `Gloss Animator` thread is the one deliberate exception to tick-driven rendering.
`HologramAnimator` is a daemon thread that exists only while a hologram or temporary hologram
carries an animation clip faster than 20 fps and `[holograms] highFrequencyAnimations` is on.

The tick driver still owns every Bukkit interaction. On each pass it renders a per-display
*template* (all pipeline stages applied, fast animation call sites kept as slots). It snapshots the
display's entity id and audience on the owning region thread.

The animator thread only reads those immutable snapshots. It splices `AnimationClip` wall-clock
frames into the template. When the composed string differs from the last one sent for that entity,
it writes a single text-index `WrapperPlayServerEntityMetadata` packet to the snapshot viewers
through `PacketUtils`. The sends land in `GlossTelemetry.countPackets` like every other Gloss
packet.

Its sleep loop mirrors the legacy Gloss scheduler. Sleep is floor
`1000 / [holograms] maxAnimationFps` ms, minimum 4 ms. A pass over 1.25x its budget adds floor
backoff. Recovery subtracts that floor, with a 250 ms ceiling.
`[holograms] animationPacketBudget` is a hard recipient ceiling shared across animated targets, personalized metadata updates and personalized clears. Fair target rotation and latest-wins personalized coalescing keep aggregate audience growth from multiplying the configured server-wide send ceiling.
The thread parks while idle and exits about two seconds after the last animated target disappears.
`Gloss.onEnable` registers it as the `hologram-animator` service so teardown interrupts and joins
it.

The audience snapshot is what gates the whole thing, and it gates it early. The thread-safe viewer
index is checked before a persistent anchor-region task is scheduled, so a far hologram with no
candidate viewer performs no region dispatch. A display is only
spawned once someone is inside `[holograms] viewRange`, and only a spawned display publishes an
animator target. On a server with no one near an animated hologram there is no target, so the
thread is never started at all — not started and idling, not started and skipping. `/gloss status`
shows the hologram with `0 entities`, no `Gloss Animator` thread appears in a thread dump, and
`[debug] animator = true` prints nothing. Past that gate, `pass()` still skips any target whose
snapshot audience is empty, and skips any target whose composed frame is unchanged. Cost tracks
visible audience, never document count.

### Gloss-owned threads

| Thread | Lifetime | Work |
|---|---|---|
| `Gloss-Watchdog-IO` | plugin enable to disable | Hot-reload polling: stat, read, hash, parse. Never touches world state |
| `Gloss Animator` | only while a fast-animated display has an audience | Splices animation frames and writes text-index packets |
| `Gloss Hologram IO` | on demand | Latest-write-wins hologram document drains, one pending slot per id |
| `Gloss-Panel-Storage-N` | plugin enable to disable | Panel document publication |

Everything else Gloss does runs on the server thread, or on the owning region thread where the
platform is region-threaded.

## Telemetry Gloss publishes

`GlossIntegrationService` registers `IntegrationServiceContract` with the Bukkit `ServicesManager`
at `Normal` priority. It reports plugin id `gloss`, the jar version, protocol versions 1.0 and 1.1,
and the capabilities `handshake`, `heartbeat` and `metrics`.

A consumer handshakes, negotiates the highest common protocol version, and then calls
`sampleMetrics`. It passes either an explicit key set or an empty set to mean "everything". There
is no compile-time dependency in either direction. The shared metric schema lives in VolmLib.

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

The counter-derived keys (everything ending in `-per-second`, plus `gloss.tick-ms`) are computed
from free-running counters against a one-second window. A sample taken sooner than a second after
the previous one returns the last computed rate rather than recomputing. The rest are read live
from the owning service. A key whose service is not constructed yet is reported unavailable with a
reason such as `holograms-not-ready` rather than as a zero. Unregistering the service clears all
counters.

`gloss.builder-server-running` is kept in the shared schema for compatibility. It is permanently
unavailable, because Gloss does not host the web editor. See
[Web Editor & Sync](/gloss/18-web-editor).

React consumes these through its `SamplerGloss*` samplers, one per key, with ids of the form
`gloss-menus`, `gloss-holograms`, `gloss-packets` and so on.

> The metric ids changed from `holoui.*` to `gloss.*` and the React sampler ids from `holoui-*` to
> `gloss-*`. A saved React monitor configuration that names the old sampler ids will not resolve them
> and those panes will come up empty. Re-select the `gloss-*` samplers in any monitor that used the
> HoloUi ones.
{.is-warning}

Separately, `[root] metrics` controls anonymous bStats reporting. That reporting submits two custom
charts (`holograms_enabled` and `boards_enabled`). Gloss reports under bStats plugin id `33525`.
Setting `metrics = false` disables submission entirely.

## What Gloss reads from other plugins

`VaultPermissionHook` looks up the registered Vault `Permission` provider through the
`ServicesManager`. It uses it for group resolution, with no hard dependency. PlaceholderAPI is
consumed through the expansion API. The custom item plugins are consumed through their own APIs
behind the provider registry described in [Custom Items & Item Providers](/gloss/14-custom-items).

### The integration bridge

`IntegrationBridgeService` is the consumer side of the same contract Gloss publishes. It is started
as the `integration-bridge` step of enable, immediately after `integration`. It turns the metrics
other Volmit plugins publish into content Gloss can display.

**Discovery.** Every registration of `IntegrationServiceContract` on the `ServicesManager` is a
candidate except Gloss's own. A plugin sampling itself through the bridge would be a loop. Each
candidate gets a handshake carrying plugin id `gloss`, the jar version, protocol versions 1.0 and
1.1 and the capabilities `handshake`, `heartbeat` and `metrics`. A contract that declines, that
advertises no metric descriptors, or that throws is skipped and logged. An accepted one has its
descriptor keys cached. There is no compile-time dependency on any of those plugins. The contract
type lives in VolmLib, which Gloss shades without relocating.

Discovery re-runs on `PluginEnableEvent` and `PluginDisableEvent`. Installing or disabling a plugin
mid-session adds or removes its metrics without a restart. Each re-discovery unregisters the text
functions and preview providers from the previous round and registers the new set. Any cached
sample whose key no longer exists is dropped.

**What each accepted contract produces.** One `|metric.<key>|` text function is registered per
descriptor key, on the same `TextPipeline.registerFunction` mechanism the animation service uses.
One `PreviewStateProvider` is registered per namespace, using the first segment of the metric keys.
The same values are then readable from preview expressions under their native dotted names. See
[Emoji, Text & Animations](/gloss/07-emoji-text-animations) and
[Expressions & Placeholders](/gloss/13-expressions-placeholders).

**Sampling.** A repeating sync task runs every `[integration] sampleIntervalTicks` (default 20,
range 1 to 200). It calls `sampleMetrics` once per contract, passing only the keys something has
asked for recently — a rendered `|metric.<key>|` token, or a preview reading that namespace. A key
stays in the recently-requested set for 60 seconds after its last request. The set is capped at 256
keys with the least recently requested dropped first. A contract requesting no keys is not called at
all. A server whose content never mentions a metric never samples another plugin.

The task runs on the sync scheduler because that is the thread the publishing plugins expect to be
sampled on, exactly as React samples them. Results are published into one immutable map behind a
`volatile` field. Region threads rendering previews and the text pipeline read them lock-free.

Only samples the publisher marks available and whose value is finite are published. Everything else
— unavailable, non-finite, or not sampled yet — is simply absent. That renders as an empty string
in text and as a missing variable in a preview expression. Changing `sampleIntervalTicks` restarts
the sampler on the next config reload. Disabling the service unregisters every function and
provider and clears the cache.

## HUD action bar

Gloss publishes to VolmLib's cooperative action bar rather than sending action bar text directly.
It merges with other plugins writing to the same slots instead of fighting them. It uses three
purposes:

| Purpose | Priority | Time to live | Raised by |
|---|---|---|---|
| `gloss:preview` | interactive | 1500 ms | the preview scale service, while a preview is being scaled |
| `gloss:reload` | notice | 2500 ms | `MenuCatalog`, when an open menu's document changed on disk |
| `gloss:hotload` | notice | 2500 ms | `DataWatchdog`, once per successful automatic batch, for online `gloss.admin` players |

All three write to the center and right slots. `gloss:reload` tells affected viewers that their open
menu definition changed; `gloss:hotload` is the coalesced operator summary across every successful
kind in the batch. `gloss:preview` is cleared explicitly when the preview ends. Every Gloss segment
is cleared for a player on quit.

## Build and packaging

Gloss ships one shaded jar. A small set of libraries is **not** in that jar. Slimjar downloads them
on first start, from the constructor, before anything else runs:

| Library | Relocated to |
|---|---|
| PacketEvents (API and Spigot implementation) | `art.arcane.gloss.libs.packetevents.api` / `.impl` |
| Adventure MiniMessage, NBT and legacy serializer | `art.arcane.gloss.libs.kyori` |
| Commons IO and Commons Imaging | `art.arcane.gloss.libs.commons` |
| toml4j | `art.arcane.gloss.libs.toml` |

bStats is relocated to `art.arcane.gloss.libs.bstats`. Slimjar itself is relocated to
`art.arcane.gloss.libs.slimjar`. The first start therefore needs outbound network access to fetch
those artifacts. Afterwards they are cached locally by slimjar. Startup is then offline.

Two descriptors ship in the jar. Paper and Folia read `paper-plugin.yml`, which declares
`folia-supported: true`, `load: STARTUP`, and its soft dependencies as `load: BEFORE` with
`join-classpath: true`. Spigot reads `plugin.yml`, which declares `load: POSTWORLD`, the
`softdepend` list, the three root commands and the whole permission tree. Both are filled in at
build time with the name, version, main class and api-version. The Paper descriptor has no command
block; `GlossPaperCommandRegistrar` registers `/gloss`, `/hologram`, `/board` and their aliases from
`LifecycleEvents.COMMANDS`.

**Spigot compatibility.** The build compiles the whole source tree a second time against the Spigot
API with `src/main/java/art/arcane/gloss/paper/**` excluded. That compile is part of `build`. The
rule this enforces is stricter than "no Paper imports". No code outside `art.arcane.gloss.paper` may
call any Bukkit or Paper method whose signature contains an Adventure type.

Adventure is relocated at runtime. Such a call compiles fine and then fails on a live server with
`NoSuchMethodError` when the relocated type does not match the server's. Adventure may be used
freely for Gloss's own values and inside packet payloads. It just may not appear in a call into the
server API. Conversely, `art.arcane.gloss.paper` is the only package allowed to touch `io.papermc`
or `com.destroystokyo` types. It is the only package that may not use Adventure at all.

That package holds four classes. `PaperTabCompleteListener` adds emoji
suggestions to Paper's `AsyncTabCompleteEvent` for non-command chat input. Servers without that
event simply do not get emoji tab completion. `PaperBlockLockListener` fires Paper's
`BlockLockCheckEvent` for container previews. Those two optional hooks are reached by class name and
skipped when the Paper API is absent. `GlossPaperCommandRegistrar` and `GlossPaperCommand` implement
the lifecycle command path; failure to load or register them on a server that selected that path is
a fatal command-service enable failure.

## Frozen container-preview arithmetic

The compiled output of every shipped container preview is pinned by 43 golden files under
`src/test/resources/golden`. They were carried over byte-identical from HoloUi. Their producer was
deleted deliberately. They are not regenerable. They are never re-recorded.

What they pin is the exact compiled result. That includes element order and one evaluation per
value supplier. Color strings stay formatted as `#AARRGGBB`. The card framing arithmetic that
positions cells, labels and slots is pinned too. Preview geometry and color formatting are
therefore treated as frozen.

A change that shifted a cell by a fraction of a block would be visible on every operator's
previews. So would a color emitted in a different notation. It would break the goldens with no
way to re-record them. New behavior is added around that arithmetic, not inside it. Preview
authoring is covered in [Container Previews](/gloss/15-container-previews).

## Editor sync session secrets

`plugins/Gloss/editor-sync-sessions.json` holds the secrets for live web editor sessions. It is
excluded from every path that copies or transmits data:

- The HoloUi importer explicitly refuses it and records the skip in the import receipt with the reason
  `session secrets are never imported`, along with the sync transaction and backup folders.
- The editor sync exporter does not walk the data folder. It builds each payload from the named menu
  and panel documents plus the `images/` files those documents reference. Paths are resolved through
  a path-confinement check. The session file can never be swept into a project.

If the file cannot be read at boot, editor sync is disabled with a severe log entry naming the
file. The rest of Gloss enables normally. One-way editor handoffs stay available.

> Treat `editor-sync-sessions.json` as a credential file. Anyone holding its contents can act on a
> live editor session. Do not copy it between servers, into backups you share, or into a bug report.
{.is-danger}
