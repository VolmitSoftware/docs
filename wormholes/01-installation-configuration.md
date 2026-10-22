---
title: "Installation & Configuration"
description: "Install, client mod, data folder, wormholes.toml, quality profiles, and uninstalling"
published: true
date: 2026-10-22T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Install the artifact for your server platform: the CraftBukkit jar goes in `plugins/`; Fabric, Forge, and NeoForge jars go in `mods/`. Edit `plugins/Wormholes/wormholes.toml` on Bukkit or `config/wormholes/wormholes.toml` on native loaders. A missing optional integration disables only that integration. Players can also install the Fabric, Forge, or NeoForge jar on their client to receive [ClientView](/wormholes/05-projection-modes-settings#clientview) and native menu screens.

Download stable mod jars from [Wormholes releases](https://github.com/VolmitSoftware/Wormholes/releases), or use [Modded Beta](https://github.com/VolmitSoftware/Wormholes/releases/tag/modded-beta) for the current beta. Versioned mod releases use `v<version>` tags; Modded Beta is a rolling prerelease whose assets are replaced with each beta. Both channels contain only Fabric, Forge, and NeoForge jars, labeled by Minecraft version and loader. Use the release list to find stable mod releases rather than GitHub's Latest link.

## Requirements

| | |
|---|---|
| Bukkit server | Paper, Purpur, or Folia. Minecraft 26.1.2, 26.2, and 26.3 |
| Native server | Minecraft 26.1.2: Fabric Loader 0.19.5, Forge 64.1.4, or NeoForge 26.1.2.116. Minecraft 26.2: Fabric Loader 0.19.5, Forge 65.1.3, or NeoForge 26.2.0.89. Minecraft 26.3: Fabric Loader 0.19.5, Forge 66.0.8, or NeoForge 26.3.0.33-beta |
| Client mod | Optional. Use the jar for the client’s Minecraft version and loader from the native server row. See [Client mod](#client-mod) |
| Java | 25 |
| Distribution | `Wormholes v<version> [CraftBukkit] 26.1.2-26.3.jar`, or the jar bearing your native loader name and version. The `-api.jar` is a Bukkit compile dependency |
| JVM | `--enable-native-access=ALL-UNNAMED` lets zstd-jni load without a restricted-access warning |
| Optional | PlaceholderAPI, Iris, Vault, Citizens, WorldGuard |

An XZ packed jar extracts `plugins/Wormholes/cache/runtime/` on first start. That directory must be writable. PacketEvents is bundled in the Bukkit jar; no separate PacketEvents installation or download is required. Other runtime libraries still need a network on first start if their cache is empty.

`wormholes.toml` must contain `schema = 3`. A valid save applies on its own. Invalid TOML is rejected and the current settings stay.

WorldGuard, when present, checks RTP destinations. Edits to `languages/*.toml` apply on save. Dimensional Door pack changes need a restart. See [Dimensional Doors](/wormholes/07-dimensional-doors).

Fabric, Forge, and NeoForge servers store the same settings, portal records, door and pocket state, network identity, routes, trust, and language overrides under `config/wormholes/`. In singleplayer, each world keeps its own portals, doors, and pockets inside its save folder; see [Native loaders and singleplayer](#native-loaders-and-singleplayer). Reload native settings with `/wormholes reload`. Bukkit plugin integrations such as Vault and PlaceholderAPI require the Bukkit distribution. Native currency and permission integrations use the native registration APIs.

## Client mod

The Fabric, Forge, and NeoForge jars also run on the client. Put the jar for the client's Minecraft version and loader in the client's `mods/` folder; it is the same jar a native server uses. A player with the mod receives [ClientView](/wormholes/05-projection-modes-settings#clientview) from any server that offers it: a Paper, Purpur, or Folia server with the Bukkit plugin, or a Fabric, Forge, or NeoForge server with the mod. Singleplayer worlds use the same jar.

ClientView requires matching Wormholes releases on channel `wormholes:v11` and the same Minecraft version. Optics stream messages use wire version 10 within that channel. An incompatible client shows `Wormholes: Mismatch` and keeps the standard projection. Client jars are available for Minecraft 26.1.2, 26.2, and 26.3. A client requires a server on the same Minecraft version. Servers offer ClientView by default. `[client-view] enabled = false` turns it off. Players without the mod, Bedrock players, and clients that decline keep the standard projection.

The mod also shows every Wormholes menu as a native Minecraft screen instead of a chest menu. This works on Fabric, Forge, and NeoForge servers, in singleplayer, and on Paper, Purpur, and Folia servers running the plugin (and Spigot where the plugin runs). Players without the mod use chest menus, and `[menus] native-screens = false` gives every player chest menus. See [Native menus and chest menus](/wormholes/04-portal-types-menus-settings#native-menus-and-chest-menus).

On Fabric, Forge, and NeoForge servers and in singleplayer, players with the mod cross frame portals and dimensional doors without a teleport or loading screen. On Paper, Purpur, and Folia every player crosses with the ordinary teleport. See [Travel with the client mod](/wormholes/05-projection-modes-settings#travel-with-the-client-mod).

The F3 debug screen shows `Wormholes: Connected`, `Wormholes: Mismatch`, or `Wormholes: Disconnected`. The Wormholes label is gold; connected is green, mismatch is yellow, and disconnected is red. Mismatch means the ClientView protocol or Minecraft version is incompatible. Connection status appears on F3 without a chat notification.

Native portal views use Minecraft models, textures, and destination lighting. On Fabric, Forge, and NeoForge servers and in singleplayer, traversable portals and doors show the resident destination world through the Minecraft renderer. Fabric and NeoForge also support the matching Sodium and Iris Shaders releases. Other views stream from the server. See [ClientView](/wormholes/05-projection-modes-settings#clientview).

Native server and client mods also support [Directional gravity](/wormholes/04-portal-types-menus-settings#transit-menu). Enable it separately on each local portal that should rotate the traveler's floor, movement plane, camera and character model. Paper, Purpur and Folia do not provide directional gravity.

Native clients prepare the fixed vanilla portal terrain and composition shaders during game resource loading, including reflected and RGSS variants. Crossing, revisiting, scene resets, and texture-filtering changes retain these programs. A successful resource reload replaces them. Content-dependent reflected shaders can still compile on first use.

With Iris Shaders, the client prepares each dimension's main shader pipeline while the world loads, including the Wormholes pocket dimension. It also links two spare sets of the current dimension's shader programs, which adds roughly 1.5 to 3 seconds to the loading screen depending on the Minecraft version and shader pack. A view into another dimension draws with that dimension's main pipeline while the camera is in a different dimension, so a newly lit Nether portal, a pocket door, the opposite side of a portal, and the crossing and return cameras of a cross-dimension portal need no additional pipeline. One view per dimension uses that pipeline in a frame, and crossing into the dimension continues its history in the main view. Returning from a nested view or mirror restores the enclosing camera, including the main view.

Views into the camera's own dimension, mirrors, nested cameras, and a second view into a dimension that another view draws in the same frame each require a separate pipeline and history and use additional graphics memory. A new camera pipeline takes its programs from a spare set, so creating it costs a fraction of a frame. The client then relinks replacement programs one per frame in the background, and for roughly one to two seconds per set some frames can take a few tens of milliseconds longer. The spare sets include the Sodium terrain programs on every supported Minecraft version, so the first frame of a new view takes a few tens of milliseconds.

The client creates at most one camera pipeline per frame: visible views first, then nested views by depth, then travel cameras. A view whose pipeline is not ready shows the opening with the surrounding scene and draws once the pipeline exists, usually on the next frame. When several new cameras appear at once, such as nested views three deep, and the spare sets run out, later views can take one to two seconds to appear while programs relink; the frame does not pause. Shader reload and pack changes rebuild the spare sets the same way, and a released camera pipeline relinks its programs when it is needed again. The spare sets belong to the dimension the world loaded in. After crossing into another dimension, the first same-dimension view there links its programs one per frame before it appears, and that dimension then keeps one spare set.

A same-dimension portal or door whose destination lies in a separately loaded area prepares one return camera after its own view while the player is within 16 blocks in front of it. The outbound crossing continues the view's own history, and the reverse crossing and the return view share one history. If a crossing starts before the return camera is ready, the view behind the player shows the surrounding scene until it is. Cross-dimension portals need no travel cameras. Nearby native cameras can also prepare one per frame before they become visible. Prepared travel cameras remain available while a nearby return route is usable, and matching native cameras continue their histories during outbound and return travel. Streamed views draw with shaders once their first destination sections arrive; until then the opening shows the surrounding scene. ClientView retains its session while pipelines are created.

Moving the camera or briefly closing and reopening the same view reuses its pipeline and history. When a portal or door switches to the side the player now faces, its view keeps the pipeline and history of the previous side. A view that takes over a dimension's main pipeline from another view starts from that view's history. Native mirrors keep their separate histories as nested views arrive or projections reopen. Identical compiled shader stages can serve separate camera pipelines, but each pipeline still links its own programs and owns its render targets and history.

Native and streamed cameras share a cache of up to 12 view pipelines, with release after 60 seconds without use. Preparation for possible travel uses available cache space without evicting cached views. A new visible camera can release an unused view sooner when the cache is full. Leaving the world releases cached portal pipelines. Shader reload also releases retained shader stages.

For shader packs on Fabric or NeoForge, install [Iris Shaders](https://irisshaders.dev/) and its required Sodium version for your Minecraft version. Iris Shaders is separate from the Iris world-generation plugin and mod.

For distant terrain on Minecraft 26.1.2, install [Distant Horizons 3.3.3](https://modrinth.com/mod/distanthorizons/version/QHxoccsN). On Minecraft 26.2, install [Distant Horizons 3.3.3](https://modrinth.com/mod/distanthorizons/version/aAow4a9f). On Minecraft 26.3, install [Distant Horizons 3.3.4](https://modrinth.com/mod/distanthorizons/version/TGgEbP9A) for Fabric or NeoForge. These Iris, Sodium, and Distant Horizons releases do not provide Forge builds; Forge uses the native Minecraft renderer. Select a shader pack with explicit Distant Horizons support when enabling shaders.

### `config/wormholes-client.toml`

The client creates this file in its `config/` folder on first launch and reads it once when the game starts. Restart the game after editing it. Set `renderer = "block-packets"` to use standard server projection while keeping the mod installed; ClientView-only rendering, reflection, and destination-sky settings apply to `renderer = "native"`.

| Key | Default | Notes |
|-----|---------|--------|
| `renderer` | `"native"` | `"native"` enables ClientView. `"block-packets"` keeps this client on the server's standard block and entity packets, including when a shader pack is active. Restart the game after changing it |
| `max-plate-memory-mb` | `256` | Shared memory budget in MiB for received portal sections, 16–4096. Retained destination history uses at most one third of this budget, capped at 128 MiB. Locally visited sections have a separate 64 MiB cache. Visible sections arrive progressively; evicted contents are reacquired with the native renderer |
| `resident-level-memory-mb` | `512` | Memory budget in MiB for destination worlds kept loaded behind portals on servers with seamless crossing, 64–8192. Closed destinations beyond it are released, oldest first |
| `show-debug-overlay` | `false` | Show detailed ClientView metrics on F3 alongside the connection status |
| `atmosphere-dominance-blocks` | `2.5` | With `renderer = "block-packets"`, distance from a portal plane within which the destination's time and weather replace the local sky, 0–16. `0` keeps the local sky. Native world and streamed mesh views keep local time and weather and draw destination atmosphere inside the opening |
| `client-mirror` | `true` | Draw mirror portals from this client's own loaded chunks when the server allows it |
| `client-recursion` | `true` | Show nested mirrors and portals through their own destinations, in world views and in streamed views the server sends them for |
| `self-reflection` | `true` | Show your own reflection in mirror views |
| `portal-shape-subdivisions` | `8` | Mesh subdivisions per block along the edge of a portal with an [aperture shape](/wormholes/04-portal-types-menus-settings#aperture-shape), 1–16. Higher values give a smoother edge. Very large shaped portals use fewer so the mesh stays within its budget |
| `portal-edge-feather` | `0.0` | Width in blocks of a band inside the edge of a shaped portal's streamed view tinted with the destination's fog colour, 0–2. `0` draws no band |
| `camera-roll-ease-seconds` | `0.35` | Seconds over which the camera tilt left after crossing a twisted or upside-down portal pair eases back to level, 0–2. `0` levels the camera at once |

## Build distributions

Build with Java 25 from the repository root. `./gradlew buildAll` builds and checks Bukkit, the proxy plugin, the API, and every supported Minecraft version for Fabric, Forge, and NeoForge. Minecraft versions declared under `gradle/minecraft-versions/` join the mod matrix automatically. Artifacts remain in their project or adapter build directories.

Use `buildBukkit`, `buildFabric`, `buildForge`, or `buildNeoforge` for one platform. Native single-platform builds use the selected Minecraft version, for example `./gradlew buildFabric -PminecraftVersion=26.2`. Version-specific tasks append the version with underscores, such as `buildFabric26_2`. `buildModdedVersions` builds every native target.

Multiplexor exposes each platform and Minecraft version as an isolated target. After registering the source workspace, run `projects build wormholes --all-targets`, or select one with `projects build wormholes --target fabric-26.3`. It also exposes `bukkit`, `api`, and `proxy`. Named destinations handle export and server delivery with a preview; see [Project builds](/servermultiplexor/13-project-builds).

`./gradlew apiJar` creates the Bukkit compile dependency. Native integrations compile against their loader distribution; see [API](/wormholes/20-api-getting-started).

Bukkit builds prepare the patched FAWE compile dependency automatically in the Gradle cache. To install [FAWE projection support](/wormholes/15-integrations#fastasyncworldedit), build its runtime distribution separately:

```sh
sh compat/fastasyncworldedit/build-patched.sh /tmp/fawe-wormholes :worldedit-core:test :worldedit-bukkit:shadowJar :worldedit-bukkit:reobfShadowJar
```

Install the `2.16.1-wormholes-1` runtime jar from that source directory's `worldedit-bukkit/build/libs/`. Use `FastAsyncWorldEdit-Paper-2.16.1-wormholes-1.jar` on Paper or `FastAsyncWorldEdit-Bukkit-2.16.1-wormholes-1.jar` on Spigot. Do not install the plain API, sources, or Javadoc jars.

## Data folder layout

```
plugins/Wormholes/
  wormholes.toml             consolidated settings (schema 3)
  portals/                  saved local portal files
  doors/                    dimensional door / pocket state (`state.json`, `state.json.tickets/`, `pending-resizes/`)
  languages/                optional per-locale TOML overrides
  routes/peers.properties   learned peer routes (not in wormholes.toml)
  trust/peers.properties    trusted peer public keys
  identity/                 network key material (server.identity, keys)
  dict/                     persisted network compression dictionaries
  uds/                      default Unix-domain socket directory
  wormholes-stats.txt       default stats snapshot path (overridable)
```

Peers are not listed under `[network]` in TOML. Import and export write routes
and trust under `routes/` and `trust/`. See
[10 - Cross-Server Networking](/wormholes/10-cross-server-networking).

### Native loaders and singleplayer

Fabric, Forge, and NeoForge servers keep the same files under `config/wormholes/` in the server folder, with backups under `backups/`, atlas discoveries and Nexus networks under `atlas/`, rule templates under `rules/templates/`, and pocket templates under `pockets/templates/`.

In singleplayer, each world keeps its Wormholes data in a `wormholes/` folder inside its save folder, so portals, doors, and pockets made in one world do not appear in another. Settings, language overrides, diagnostic reports, and the stats snapshot stay in `config/wormholes/` in the game folder and apply to every world.

| Data | Fabric, Forge, or NeoForge server | Singleplayer | Singleplayer with `shared-singleplayer-store = true` |
|---|---|---|---|
| `wormholes.toml`, `languages/`, `debug/`, stats snapshot | `config/wormholes/` | `config/wormholes/` in the game folder | `config/wormholes/` in the game folder |
| Portals, atlas discoveries, Nexus networks, rule templates, backups, network identity, routes, and trust | `config/wormholes/` | `wormholes/` in the save folder | `config/wormholes/` in the game folder |
| Dimensional doors, pockets, and pocket templates | `config/wormholes/` | `wormholes/` in the save folder | `wormholes/` in the save folder |

With `[main] shared-singleplayer-store = true`, every singleplayer world reads and writes one shared set of portals, so a portal built in one world also appears at the same position in every other world, and crossing it leads to its destination position in the world that is open.

Dimensional doors and pocket rooms are blocks in the world where they were placed, so their records stay in that world's save folder. Wormholes reads the setting when a world opens; `/wormholes reload` does not move the data of the open world.

## Config path and schema

| Property | Value |
|----------|--------|
| Path | Bukkit: `plugins/Wormholes/wormholes.toml`; native loaders: `config/wormholes/wormholes.toml` |
| Schema | `schema = 3` |
| Quality key | Top-level `quality` |
| Sections | `[main]`, `[recipes]`, `[network]`, `[projection]`, `[render]`, `[transit]`, `[client-view]`, `[menus]` |
| Key form | kebab-case (`teleport-cooldown-millis`) |

A startup load rewrites the file with every known key. Custom comments and unknown keys are removed. A hot reload does not rewrite the file.

## Visual quality (`quality`)

| Value | Effect after clamps from `[projection]` / `[render]` are applied |
|-------|------------------------------------------------------------------|
| `auto` (default) | No profile clamps |
| `performance` | Forces `lighting-fidelity = false`, `entity-spoofing = false`. Caps range ≤ 32, depth ≤ 48, max projectors/tick ≤ 12, max portals/observer/tick ≤ 2, max new observer scans/tick ≤ 32 |
| `balanced` | Lighting refresh interval ≥ 6, entity update interval ≥ 2, max spoofed entities ≤ 16, max projectors/tick ≤ 20, max new observer scans/tick ≤ 64 |
| `cinematic` | Range ≥ 64, depth ≥ 96, max projectors/tick ≥ 32, and max new observer scans/tick ≥ 128. Lighting refresh ≤ 2, lighting max sections/pass ≥ 4, entity spoof range ≥ 64, and max spoofed entities ≥ 48 |

Unknown profile names fail the load. `enable-particles` remains an independent
global particle switch. `quality` controls the projection and render profile.

## Value ranges

Out-of-range values are corrected when Wormholes applies them. Network, handoff, and replication
bounds are written back to the file; the rest are corrected in memory, so the file can keep a value
the runtime does not use.

| Runtime field source | Clamp |
|----------------------|--------|
| `portal-collapse-speed` | 0.0–1.0 |
| `teleport-cooldown-millis` | 0–60000 |
| `portal-pushback-multiplier` | 0.0–4.0 (non-finite → 1.0) |
| `portal-sound-volume-multiplier` | 0.0–4.0 (non-finite → 1.0) |
| `chunk-pre-send-radius-chunks` | 0–16 |
| `chunk-pre-send-max-chunks` | 0–1024 |
| `chunk-pre-send-budget-micros` | 0–25000 |
| `arrival-warm-radius-chunks` | 0–12 |
| `arrival-warm-max-radius-chunks` | ≥ warm radius, ≤ 32 |
| `arrival-warm-hold-millis` / `arrival-warm-throttle-millis` | 0–60000 |
| `arrival-transition-mask-ticks` | 0–200 |
| `chunk-send-rate-target` / `chunk-load-rate-target` | 0.0–10000.0 (≤0 or >10000 treated as unlimited at Paper tuner) |
| `projection.range` | 1.0–256.0 |
| `near-plane-padding` | 0.0–16.0 |
| `aperture-padding-blocks` | 0.0–8.0 |
| `frustum-culling-ratio` | 0.0–1.0 |
| `refresh-interval-ticks` | 1–20 |
| `depth-blocks` | 1–256 |
| `recursive-portal-depth` | 3–64 |
| `stable-cell-resample-interval-ticks` | 1–200 |
| `observer-interest-dot` | −1.0–1.0 |
| `side-grace-dot` | 0.0–1.0 |
| `max-projectors-per-tick` | 1–512 |
| `max-portals-per-observer-tick` | 1–64 |
| `max-new-observer-scans-per-tick` | 1–4096 |
| `interest-grace-ticks` | 0–100 |
| `initial-resend-passes` | 0–20 |
| `max-projected-cells` | 0–50000000 (0 disables the ceiling) |
| `max-held-cells-per-portal` | 0–50000000 |
| `gaze-fov-degrees` | 30.0–170.0 (non-finite → 110.0) |
| `gaze-lookahead-ticks` | 0–20 |
| `gaze-max-starve-ticks` | 1–200 |
| `section-cache-max-mb` | 1–4096 |
| `section-cache-chunks-per-tick` | 1–1024 |
| `section-cache-ttl-ticks` | 20–72000 |
| `plate-max-bytes` | 1048576–1073741824 |
| `plate-workers` | 1–16 |
| `plate-lateral-clamp-blocks` | 0–64 |
| `plate-capture-chunks-per-tick` | 1–256 |
| `plate-urgent-capture-chunks-per-tick` | 1–256 |
| `tick-headroom-target-millis` | 0–50 |
| `tick-headroom-min-frame-micros` | 1000–`max-frame-micros` |
| `lighting-refresh-interval-ticks` | 1–40 |
| `lighting-max-sections-per-pass` | 1–64 |
| `entity-update-interval-ticks` | 1–20 |
| `entity-spoof-range` | 1.0–256.0 |
| `entity-candidate-cache-ticks` | 1–40 |
| `max-spoofed-entities` | 0–256 |
| `capture-zone-radius` | 1.0–64.0 |
| `rtp-rim-interval-ticks` | 1–100 |
| `entity-velocity-epsilon` | 0.0–1.0 |
| `ambient-particle-interval-ticks` | 1–40 |
| `client-view.hello-grace-millis` | 0–5000 |
| `client-view.max-frame-kb` | 64–1024 |
| `client-view.ack-window-frames` | 0–255 |
| `client-view.remote-view-routes` | 1–4 |
| `client-view.remote-view-chunks-per-tick` | 1–64 |
| `client-view.remote-view-bytes-per-tick` | 16384–2097152 |
| `network.listen-port` | 1–65535; invalid values become 8901 before canonical write |
| `network.handoff-timeout-ms` | 50–60000 before canonical write |
| `network.replication.hash-probe-interval-sec` | minimum 1 before canonical write |
| `network.replication.hash-probe-chunks-per-tick` | 1–1024 before canonical write |
| `network.replication.diff-window-size` | minimum 1 before canonical write |
| `network.replication.resync-timeout-sec` | minimum 0 before canonical write |
| `network.replication.max-queued-diffs-per-peer` | minimum 1 before canonical write |
| `network.replication.capture-snapshot-interval-ticks` | minimum 20 before canonical write |
| `network.replication.capture-max-queued-diffs-per-chunk` | minimum 16 before canonical write |

## Top-level keys

| Key | Default | Notes |
|-----|---------|--------|
| `language` | `en_US` | Active locale name. See [11 - Localization](/wormholes/11-localization) |
| `metrics` | `true` | Enables anonymous bStats reporting after a restart |
| `update-notifications` | `true` | Bukkit only. Checks Wormholes' stable GitHub releases for shared update notices and `/volmit plugins updates`; applies on save. See [Update notifications](/volmlib/api/github-releases) |
| `language-fallbacks` | `""` | Comma-separated fallback locales. Code English is always final |
| `schema` | `3` | Must match exactly |
| `quality` | `auto` | `auto` \| `performance` \| `balanced` \| `cinematic` |

## `[main]`

| Key | Default | Notes |
|-----|---------|--------|
| `enable-particles` | `true` | Independent global particle switch |
| `replace-nether-and-end-portals` | `true` | Auto-link vanilla Nether/End frames as Wormholes portals |
| `two-way-end-portals` | `true` | Converted End portals lead both ways: the End arrival portal shows the Overworld, and players and entities that rise up through it return to the Overworld End portal and land on its frame. `false` makes the End arrival portal receive-only with no view, and the exit fountain is the way back. The exit fountain stays vanilla either way. Applies to existing End portals on hot reload. See [Vanilla nether and end portals](/wormholes/03-building-portals#vanilla-nether-and-end-portals) |
| `dimensional-doors-enabled` | `true` | Full Dimensional Doors feature set. Live disable is allowed |
| `pocket-room-size` | `16` | Cube edge in blocks of a newly created pocket room, walls included. The default is a 16×16×16-block cube with a 14×14×14 interior. Clamped to 8–128. Existing pockets keep their own size |
| `pocket-shell-material` | `SMOOTH_STONE` | Wall, floor, and ceiling block of a newly created pocket. Must be solid and non-falling. Existing pockets keep their own material |
| `pocket-return-door-material` | `CRIMSON_DOOR` | Exit door of a newly created pocket. Must be hand-operable, so iron doors are rejected. Existing pockets keep their own door |
| `portal-collapse-speed` | `0.91` | Collapse animation factor |
| `verbose-logging` | `false` | Persistent console debug: one-second telemetry, access checks, handoffs, and failure details |
| `debug-rendering` | `false` | Debug rendering aids |
| `teleport-cooldown-millis` | `1000` | Wait after a portal crossing before the traveler can cross another portal. Seamless crossings with the client mod skip it. With `[transit] object-transit-continuous = true` (default), so do projectiles and dropped items on Paper, Purpur, and Folia, and traveling groups without a player on Fabric, Forge, and NeoForge. Also floors cross-server handoff rate limit (min 1000 ms) |
| `portal-pushback-multiplier` | `1.0` | Rejected-traversal push scale. 0 mutes knockback |
| `portal-sound-volume-multiplier` | `1.0` | Portal/door/traversal sound scale. 0 mutes |
| `traversal-api-enabled` | `true` | If false, new evaluations skip cost providers and the pre-event. Existing tickets still settle or expire and may fire their completion event |
| `traversal-api-provider-failure-policy` | `allow` | `allow` treats a provider fault as a free pass; `deny` rejects only that traversal attempt |
| `traversal-api-provider-fault-limit` | `5` | Faults before provider quarantine. `0` disables quarantine |
| `traversal-api-slow-provider-millis` | `5` | Warn when a provider call meets or exceeds this ms. `0` disables |
| `chunk-pre-send-enabled` | `true` | Prepare local, RTP, and dimensional-door arrival chunks, including client-assisted terrain on Bukkit servers. Bukkit servers deliver ordinary prepared chunks after the teleport, including travel between worlds; modded servers use a same-world pre-teleport burst. Cross-server travel uses its separate transfer path |
| `chunk-pre-send-radius-chunks` | `3` | Destination radius in chunks, limited by the player’s view distance |
| `chunk-pre-send-max-chunks` | `32` | Maximum chunks processed per arrival-delivery tick on Bukkit servers, or per pre-teleport burst on modded servers |
| `chunk-pre-send-budget-micros` | `2000` | Microsecond work budget. Bukkit arrival delivery continues on later ticks until the destination area is processed; modded-server pre-teleport bursts stop at this budget |
| `arrival-prewarm-on-interest` | `true` | Prepare destination chunks when observers show interest or players approach linked frame portals. Approach preparation works with ClientView on or off |
| `arrival-warm-radius-chunks` | `4` | Warm radius |
| `arrival-warm-max-radius-chunks` | `10` | Max warm radius |
| `arrival-warm-hold-millis` | `5000` | Hold warm state |
| `arrival-warm-throttle-millis` | `1000` | Throttle between warm actions |
| `arrival-transition-mask` | `true` | Transition mask at arrival |
| `arrival-transition-mask-ticks` | `25` | Mask duration |
| `chunk-send-rate-tuner` | `true` | Once at startup, raise Paper per-player chunk send/load rate caps (never lowers) |
| `chunk-send-rate-target` | `1000.0` | Target chunks/sec send. Paper default 75. `<=0` or `>10000` is unlimited |
| `chunk-load-rate-target` | `1000.0` | Target chunks/sec load. Paper default 100. `<=0` or `>10000` is unlimited |
| `shared-singleplayer-store` | `false` | Fabric, Forge, and NeoForge singleplayer only. Keep portals, atlas discoveries, Nexus networks, rule templates, backups, and network identity in `config/wormholes/` in the game folder, shared by every singleplayer world, instead of in each world's save folder. Doors and pockets always stay with their world. Read when a world opens. Servers write it to the file and ignore it. See [Native loaders and singleplayer](#native-loaders-and-singleplayer) |

Normal console output covers lifecycle changes and failures that need attention. Fabric, Forge, NeoForge, and singleplayer also log one `Crossing` line for each player crossing through a frame portal or dimensional door; see [Travel with the client mod](/wormholes/05-projection-modes-settings#travel-with-the-client-mod). Enable `verbose-logging` for routine portal, recipe, travel, and network details. Repeated failures are throttled. `/wh debug toggle` enables the same diagnostics temporarily. A settings hot-reload restores the file's value. See [Diagnostic reports](/wormholes/09-commands-permissions#diagnostic-reports).

Traversal API behavior and provider contracts are in
[21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events).

## `[recipes]`

One table per Dimensional Door product plus the two reskin toggles. Full
grammar, ingredient groups, and fallback behavior:
[07 - Dimensional Doors](/wormholes/07-dimensional-doors#configuring-recipes).

| Table | Keys | Default |
|-------|------|---------|
| `[recipes.pair-kit]` | `enabled`, `shape`, `ingredients` | `EDE\|ORO\| D ` |
| `[recipes.personal-door]` | `enabled`, `shape`, `ingredients` | ` R \|CDE` |
| `[recipes.public-door]` | `enabled`, `shape`, `ingredients` | `RDR\| E \| L ` |
| `[recipes.trapdoor-pair-kit]` | `enabled`, `shape`, `ingredients` | as the door kit, with `#trapdoors` |
| `[recipes.personal-trapdoor]` | `enabled`, `shape`, `ingredients` | as the personal door, with `#trapdoors` |
| `[recipes.public-trapdoor]` | `enabled`, `shape`, `ingredients` | as the public door, with `#trapdoors` |
| `[recipes.door-skin]` | `enabled` | `true` |
| `[recipes.trapdoor-skin]` | `enabled` | `true` |

The Portal Wand recipe is outside this block and is not configurable. Runes have
no recipe.

`enabled = false` removes that recipe from the server. A `shape` or
`ingredients` value that does not parse, or that names a block this server does
not have, is logged and falls back to the default recipe.

## `[network]`

Cross-server networking. Default `enabled = false`. Import and export set
`enabled = true` and start the network when needed. See
[10 - Cross-Server Networking](/wormholes/10-cross-server-networking).

| Key | Default | Notes |
|-----|---------|--------|
| `enabled` | `false` | Cross-server portals / peers |
| `listen-enabled` | `true` | Accept inbound peer connections |
| `listen-port` | `8901` | Preferred raw-stream port, 1–65535; invalid values become 8901. Bind scans through the next 50 valid ports, capped at 65535. Otherwise game-port sideband is used |
| `trust-on-first-use` | `true` | Trust unknown peer keys on first approved contact when no stored key |
| `entity-transfer-deny-types` | `""` | Comma-separated entity type names denied for entity transfer |
| `advertise-host-override` | `""` | Raw peer host and default public game host |
| `game-host-override` | `""` | Public game host. Blank uses the advertised host |
| `game-port-override` | `0` | Public game port. Zero uses the server game port. Set the external port for NAT mappings |
| `private-game-host-override` | `""` | Private game host. Blank uses a concrete game bind address, otherwise the detected LAN address |
| `private-game-port-override` | `0` | Private game port. Zero uses the server game port |
| `server-name` | `""` | Local network name override (empty uses identity default) |
| `transfer-mode` | `auto` | `auto` \| `proxy` \| `direct` (see networking doc) |
| `proxy-servers` | `[]` | Destination names that use the proxy when transfer mode is `auto` |
| `handoff-timeout-ms` | `5000` | Base source deadline, normalized to 50–60000 ms. Direct transfers add 7000 ms for the combined endpoint check and admission |
| `auto-accept-transfers` | `true` | Compatibility rewrite of TRANSFER handshakes to LOGIN when native `accepts-transfers` is not set |

Static `[[peers]]` are not written into this file. Peers live in
`routes/peers.properties`.

### `[[network.client-routes]]`

Optional client routes select a specific destination endpoint before automatic address selection. The longest matching CIDR wins. These entries do not create or trust peers.

| Key | Type | Meaning |
|-----|------|---------|
| `server` | string | Imported destination server name |
| `client-cidr` | string | IPv4 or IPv6 client subnet, such as `192.168.1.0/24` or `fd00::/64` |
| `host` | string | Game host reachable from those clients |
| `port` | integer | Game port, 1–65535 |

See [Cross-Server Networking](/wormholes/10-cross-server-networking) for same-machine, NAT, LAN, VPN, and private-server examples. Game endpoint port overrides must be zero or 1 through 65535. Invalid host overrides or routes reject the configuration update and preserve the active settings.

### `[network.transport]`

| Key | Default | Notes |
|-----|---------|--------|
| `compression-enabled` | `true` | Wire compression |
| `compression-level` | `3` | Runtime clamp 1–22 |
| `compression-dict-train-bytes` | `10485760` | Dictionary corpus budget. Runtime minimum 65536 bytes |
| `compression-dict-target-size` | `65536` | Dictionary size target |
| `compression-retrain-interval-sec` | `600` | Retrain interval. Runtime minimum 30 s. Applies on reload (reschedules the dictionary retrain task) |
| `uds-enabled` | `true` | Unix domain sockets when available |
| `uds-dir` | `""` | Empty uses `plugins/Wormholes/uds`. A relative override resolves from the JVM working directory |

### `[network.view]`

Entity delta rates for remote views:

A non-positive Hz value disables that distance band. Positive rates above 20 Hz
still schedule at most once per server tick.

| Key | Default |
|-----|---------|
| `entity-delta-enabled` | `true` |
| `entity-rate-near-range` | `16.0` |
| `entity-rate-mid-range` | `64.0` |
| `entity-rate-far-range` | `128.0` |
| `entity-rate-near-hz` | `20.0` |
| `entity-rate-mid-hz` | `10.0` |
| `entity-rate-far-hz` | `4.0` |
| `entity-rate-very-far-hz` | `1.0` |

### `[network.stats]`

| Key | Default | Notes |
|-----|---------|--------|
| `enabled` | `true` | Periodic stats snapshot file |
| `interval-sec` | `10` | Write interval. Runtime minimum 1 s |
| `path-override` | `""` | Empty → `wormholes-stats.txt`. Relative paths resolve under the data folder. Absolute paths are used as written |

### `[network.replication]`

| Key | Default | Notes |
|-----|---------|--------|
| `hash-probe-interval-sec` | `30` | Hash probe cadence. Minimum 1 s; reload reschedules the running probe task |
| `hash-probe-chunks-per-tick` | `16` | Probe budget, normalized to 1–1024 |
| `diff-window-size` | `32` | Diff window. Minimum 1 |
| `resync-timeout-sec` | `5` | Resync timeout. Minimum 0 |
| `max-queued-diffs-per-peer` | `4096` | Per-peer queue cap. Minimum 1 |
| `capture-snapshot-interval-ticks` | `100` | Snapshot interval. Minimum 20 ticks |
| `capture-max-queued-diffs-per-chunk` | `256` | Per-chunk queue. Minimum 16 |
| `capture-light-enabled` | `true` | Capture light in replication, required for native remote portal views |
| `capture-block-entity-enabled` | `true` | Capture block-entity NBT in replicated chunks |

## `[projection]`

| Key | Default | Notes |
|-----|---------|--------|
| `range` | `48.0` | Observer interest / projection range |
| `refresh-interval-ticks` | `1` | Projection refresh cadence |
| `near-plane-padding` | `2.0` | Near plane pad |
| `aperture-padding-blocks` | `0.75` | Extra outward pad past aperture edges |
| `frustum-culling-ratio` | `0.2` | Frustum cull ratio |
| `depth-blocks` | `64` | Extra search distance for recursive portal candidates. Primary view depth is per portal |
| `recursive-portal-depth` | `3` | Nested portal recursion (runtime min 3) |
| `stable-cell-resample-interval-ticks` | `4` | Stable cell resample |
| `client-view-distance-cap` | `true` | Cap to client view distance |
| `foveated-unrendering` | `false` | Look/side interest filter (`observer-interest-dot` and `side-grace-dot`). Off means any observer inside the view AABB is interested |
| `observer-interest-dot` | `-0.2` | Look-toward interest threshold |
| `side-grace-dot` | `0.12` | Portal-side grace |
| `max-projectors-per-tick` | `24` | Global projector budget |
| `max-portals-per-observer-tick` | `4` | Per-observer portal budget |
| `max-new-observer-scans-per-tick` | `64` | Shared cap for player-owner projection and surface-skin reconciliation frames. Existing observer cleanup/continuation has priority while a rotating discovery lane remains reserved |
| `interest-grace-ticks` | `5` | Ticks a projector stays open after live interest is lost (unrender-on-loss delay) |
| `initial-resend-passes` | `1` | Full sends after the view is created |
| `max-projected-cells` | `250000` | Scan ceiling. Over budget, side padding drops first, then depth. `0` disables the ceiling |
| `shared-plate` | `true` | Build destination sampling and buried-cell culling once per portal and share it between observers. Off samples per observer |
| `plate-max-bytes` | `33554432` | Memory shared view plates may hold. The oldest plate is evicted first. A plate predicted or measured larger than this limit is not cached and is retried after the portal's projection settings change, the portal is invalidated, the RTP route changes, or settings reload |
| `plate-workers` | `2` | Worker threads that build shared view plates |
| `hold-invisible-claims` | `true` | Keep sent cells in place, without packets, while the observer cannot see them. See [Held cells](/wormholes/05-projection-modes-settings#held-cells) |
| `max-held-cells-per-portal` | `65536` | Held cells per portal and observer. The oldest revert first |
| `gaze-fov-degrees` | `110.0` | Horizontal field of view whose portals refresh first. The vertical extent follows a 16:9 screen |
| `gaze-lookahead-ticks` | `3` | Head-turn prediction. A portal about to enter the view at the current turn speed counts as in view |
| `gaze-max-starve-ticks` | `20` | Longest a portal goes without a refresh, wherever the observer looks |
| `finish-in-slot` | `true` | Finish occlusion filtering and send blocks in the tick a scan completes when frame budget remains |
| `section-cache` | `true` | Paper, Purpur, and native loaders: read destination blocks from a shared 16×16×16 section cache and load unloaded chunks asynchronously. Off samples the live world |
| `section-cache-max-mb` | `64` | Section cache memory. The least recently read sections are evicted first |
| `section-cache-chunks-per-tick` | `16` | Chunks the section cache may capture per tick. The rest are read live until a later tick captures them |
| `section-cache-ttl-ticks` | `200` | Ticks before a cached section is captured again on its next read. Bounds staleness for changes that raise no block event |
| `rtp-plates` | `true` | Build shared view plates for RTP portals, keyed by destination route. Requires `shared-plate` |
| `plate-lateral-clamp-blocks` | `40` | Widest a shared plate extends past the aperture sideways, capped by the portal's own lateral pad |
| `plate-capture-chunks-per-tick` | `8` | Destination chunks copied per tick for plate builds |
| `plate-urgent-capture-chunks-per-tick` | `32` | Destination chunks copied per tick for plates a ClientView player is waiting on to show a portal for the first time. Uses its own budget, separate from `plate-capture-chunks-per-tick` |
| `tick-headroom-target-millis` | `0` | Opt-in tick headroom governor. `0` turns it off and `max-frame-micros` alone limits projection work. Paper and Purpur only |
| `tick-headroom-min-frame-micros` | `5000` | Smallest per-tick projection budget the governor may shrink to |

Projection behavior detail:
[05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings).

## `[render]`

| Key | Default | Notes |
|-----|---------|--------|
| `lighting-fidelity` | `false` | Send destination lighting with projected blocks |
| `entity-spoofing` | `true` | Show destination-side entities in projections |
| `lighting-refresh-interval-ticks` | `4` | Lighting refresh |
| `lighting-max-sections-per-pass` | `2` | Lighting section budget |
| `adaptive-lighting` | `true` | Adaptive lighting |
| `entity-update-interval-ticks` | `1` | Entity spoof update cadence |
| `entity-spoof-range` | `48.0` | Spoof range |
| `entity-candidate-cache-ticks` | `3` | Candidate cache TTL |
| `max-spoofed-entities` | `24` | Cap per view |
| `capture-zone-radius` | `8.0` | Capture zone radius. Applies on reload (every local portal rebuilds its capture AABB) |
| `block-entities` | `true` | Project supported block-entity contents, including sign text and banner patterns. Turning this off keeps terrain and entity views active and omits block-entity contents. Turning it on captures current contents |
| `rtp-rim-interval-ticks` | `5` | Ticks between RTP rim particle refreshes while the rim color is unchanged. Color and phase changes refresh at once |
| `entity-velocity-epsilon` | `0.005` | Smallest per-axis velocity change that sends a projected entity a new velocity packet. Stopping always sends |
| `ambient-particle-interval-ticks` | `1` | Ticks between `SPARKS` ambient bursts. Each burst carries the sparks of every skipped tick, so average density is unchanged |

## `[transit]`

Portal physics, convoy traversal, and traversal cues. Changes hot-reload. A portal's own [Transit menu](/wormholes/04-portal-types-menus-settings#transit-menu) settings override `momentum-default` and `orientation-default`.

| Key | Default | Notes |
|-----|---------|--------|
| `momentum-default` | `preserve` | Momentum policy for portals that set none of their own: `preserve`, `scale`, `clamp`, `zero`, or `impulse` |
| `momentum-max-speed` | `4.0` | Speed ceiling in blocks per tick for the `clamp` and `scale` policies |
| `orientation-default` | `frame` | Arrival orientation for portals that set none of their own: `frame`, `look`, `snap`, or `mirror` |
| `gravity-flip-enabled` | `false` | Turn the whole camera basis upright when entering a wall portal and leaving through a floor or ceiling. Floor-to-ceiling crossings retain the mapped look, including looking straight up or down. The flip does not apply to the `look` policy or native portals with Directional gravity enabled. Existing files keep the value they already hold |
| `object-transit-continuous` | `true` | Projectiles and dropped items keep their velocity through local tunnels without a re-entry cooldown. On Fabric, Forge, and NeoForge this also covers traveling groups without a player |
| `convoy-enabled` | `true` | Move vehicles, passengers, and leashed mobs through a portal as one rig, or refuse the whole rig |
| `convoy-max-entities` | `16` | Largest rig moved as a unit |
| `convoy-cross-server-enabled` | `true` | Allow rigs through cross-server gateways when the peer supports convoys |
| `convoy-cross-server-timeout-sec` | `20` | Seconds a cross-server rig transfer waits for the destination before the source restores the rig |
| `cinematics-enabled` | `true` | Play threshold and arrival cues (sound and particles) |
| `arrival-mask-adaptive` | `true` | Size the arrival darkness mask by the destination chunks still streaming instead of the fixed tick count |
| `arrival-mask-min-ticks` | `5` | Shortest adaptive arrival mask while any destination chunk is missing |

## `[client-view]`

[ClientView](/wormholes/05-projection-modes-settings#clientview) for players running the [client mod](#client-mod). Changes apply on reload. Turning `enabled` on offers ClientView to online players with the mod without reconnecting; turning it off returns every ClientView player to the standard projection. `/wormholes clientview off` and `on` switch it at runtime; see [ClientView commands](/wormholes/09-commands-permissions#clientview-commands). `seamless-travel` and the `remote-view-*` keys apply only on Fabric, Forge, and NeoForge servers and in singleplayer; Paper, Purpur, and Folia write them to the file and ignore them.

| Key | Default | Notes |
|-----|---------|--------|
| `enabled` | `true` | Offer ClientView to clients running the mod. Off keeps every player on the standard projection |
| `configuration-handshake` | `true` | Negotiate while the player joins, on Paper, Purpur, Folia, Fabric, Forge, and NeoForge, so the first projection after joining is already ClientView. Off, or on other servers, the offer follows the join |
| `hello-grace-millis` | `100` | Extra milliseconds a joining client with a modded brand has to answer the offer. Clients with the vanilla brand never wait |
| `max-frame-kb` | `512` | Largest ClientView message in KiB. Larger updates are split |
| `ack-window-frames` | `8` | Native section transfers use a bounded acknowledgement window independently of this value |
| `brick-cache` | `true` | Send a hash list for each destination plate first and resend only the 16×16×16 bricks the client reports missing, so unchanged bricks the client already holds cost 12 bytes. Off sends every brick with each update |
| `destination-light` | `true` | Send destination block and sky light with each section so native views are lit like the destination. Off sends sections without destination light |
| `entity-frames` | `true` | Send destination entities as one 20 Hz stream per portal, shared by every ClientView player watching it. Off shows no destination entities to ClientView players |
| `zero-copy` | `true` | In singleplayer, hand plates to the local client by reference instead of encoding them. Clients connected over the network always receive encoded plates |
| `standby-prestream` | `false` | Reserved; has no effect. ClientView sends only an RTP portal's current destination |
| `view-stats` | `true` | Accept plate memory and apply timings from clients for `/wormholes clientview status` |
| `client-mirror` | `true` | Let clients draw mirror portals from their own loaded chunks, so no mirror plate is built or streamed for them. The client's `client-mirror` must also be on; otherwise mirrors stream like linked portals |
| `client-recursion` | `true` | Send nested mirror and portal destination views inside streamed views. Streamed mirrors allow four reflections per chain, including the first mirror; linked portals allow up to three nested steps. Each primary view has at most 16 nested views |
| `seamless-travel` | `true` | Fabric, Forge, NeoForge, and singleplayer only. Let players with the mod cross portals and doors with no teleport, respawn, or loading screen, with destination chunks and entities streamed ahead. Off uses the ordinary teleport and streamed portal views |
| `remote-view-routes` | `2` | Fabric, Forge, NeoForge, and singleplayer only. Portal destinations in other worlds or beyond the player's view distance streamed ahead per seamless player, 1–4. Same-world destinations within the player's view distance do not count against it |
| `remote-view-chunks-per-tick` | `8` | Fabric, Forge, NeoForge, and singleplayer only. Destination chunk columns streamed per seamless player per tick, 1–64. The client's acknowledgements can lower it further |
| `remote-view-bytes-per-tick` | `196608` | Fabric, Forge, NeoForge, and singleplayer only. Destination bytes streamed per seamless player per tick, 16384–2097152 (192 KiB by default) |

## `[menus]`

Player menus. Changes hot-reload and apply to the next menu a player opens; a native screen that is already open stays native until it closes. See [Native menus and chest menus](/wormholes/04-portal-types-menus-settings#native-menus-and-chest-menus).

| Key | Default | Notes |
|-----|---------|--------|
| `native-screens` | `true` | Show native menu screens to players running the [client mod](#client-mod). Off gives every player chest menus. Players without the mod always get chest menus |

## Hot reload

`wormholes.toml` reloads after a complete save. The console prints `Configuration hot-reloaded.` Invalid files leave the current settings active.

## Update notifications

On Bukkit servers, the root `update-notifications` setting defaults to `true`. It enables GitHub release checks and includes this plugin in one combined Volmit join notice. Set it to `false` to disable checks and notices for this plugin; valid configuration reloads apply the change immediately.

Use `/volmit plugins updates` for the shared Director report across registered plugins. Operators and players with `volmit.update` can view all registered plugins; `wormholes.update` grants access for this plugin and defaults to operators. Checks use stable GitHub releases from `VolmitSoftware/Wormholes`, retain cached results on failures, and respect GitHub rate limits. Updates are never downloaded or installed. Shared report text is English; existing plugin language selection and message editing remain available.

## Uninstalling

Wormholes keeps its settings and records in its data folder and its pocket rooms in the `wormholes:pockets` dimension of the main world. Removing it leaves converted vanilla portals without portal blocks; see [What stays in the world](#what-stays-in-the-world).

> Deleting the data folder and the pocket dimension permanently erases every portal, door, pocket room and its contents, network link, and backup. Stop the server and back up the server folder and its worlds first.
{.is-danger}

While Wormholes is still installed:

1. To keep a copy of your portals, run `/wormholes admin backup export` (`wormholes.admin.backup`) and move the bundle out of `plugins/Wormholes/backups/`, or `config/wormholes/backups/` on Fabric, Forge, and NeoForge.
2. Ask players to leave their pocket rooms.
3. To discard saved traveller sizes before a future reinstall, restore them with `/wormholes admin scale reset`, or `/wh scale reset` on Fabric, Forge, and NeoForge. Portal size is stored as Wormholes data and applied while Wormholes is installed; vanilla attributes do not retain it after removal. See [Commands and permissions](/wormholes/09-commands-permissions).
4. On every server linked to this one, run `/wormholes server remove <name>` with this server's name from `/wormholes server list`. That server deletes its route and trusted key for this one and drops this server's portals from its lists.

Then remove it:

1. Stop the server and delete the Wormholes jar from `plugins/` on Paper, Purpur, and Folia, or from `mods/` on Fabric, Forge, and NeoForge.
2. Delete the files in the table below.
3. If the network uses WormholesProxy, delete its jar from the proxy's `plugins/` folder together with `plugins/WormholesProxy/` and, on Velocity, `plugins/wormholesproxy/`, which holds `secret.txt`. Then restart the proxy.
4. Players who installed the client mod remove the Wormholes jar from their `mods/` folder and delete `config/wormholes-client.toml`. For singleplayer, they also delete `config/wormholes/` in the game folder and `wormholes/` and `dimensions/wormholes/` in each world's save folder.
5. Leave `plugins/bStats/` in place unless no remaining plugin on the server uses bStats; that folder is shared.
6. Remove `%wormholes_…%` placeholders from other plugins' configuration. Without Wormholes, PlaceholderAPI leaves them unreplaced.
7. If you installed the FastAsyncWorldEdit `2.16.1-wormholes-1` build only for Wormholes, replace it with a standard FastAsyncWorldEdit release.

| Delete | Platform | Contents |
|---|---|---|
| `plugins/Wormholes/` | Paper, Purpur, Folia | Settings, portals, door and pocket records, atlas data, network identity, routes, trust, backups, language files, downloaded libraries (`.libs/`), and the runtime cache |
| `config/wormholes/` | Fabric, Forge, NeoForge server | The same data |
| `<level-name>/datapacks/wormholes-pockets.zip` | Paper, Purpur, Folia | The pocket dimension datapack. `<level-name>` is `level-name` in `server.properties`, `world` by default |
| `<level-name>/dimensions/wormholes/` | All | The pocket dimension, with every pocket room and its contents |
| Your `[network.transport] uds-dir` and `[network.stats] path-override` paths | All | Only when they point outside the data folder |

### What stays in the world

Portal views, skins, and particle effects are not saved in the world. These remain:

| Leftover | After removal | Clean up |
|---|---|---|
| Vanilla Nether portals that Wormholes converted, and the counterparts it built | Obsidian frames with no portal blocks | Relight a frame with flint and steel. An irregular Shaped Portals frame relights only while [Shaped Portals](/shapedportals) is installed |
| End portals that Wormholes converted | Eyed End Portal Frames with no portal blocks | Fill the 3×3 interior at the frame's height: `/fill <x1> <y> <z1> <x2> <y> <z2> minecraft:end_portal` |
| Saved traveller size on players and mobs | Wormholes data (`wormholes:portal_scale` on Bukkit, `wormholesScale` on native loaders), ignored without Wormholes | Inert. Reset sizes while Wormholes is installed to discard them before reinstalling |
| Entities that were crossing to another server when Wormholes stopped | Invulnerable, silent, and without gravity, with the data key `wormholes:entity_transit_state` | Wormholes restores them when their chunk loads. After removal, run `/data merge entity <uuid> {Invulnerable:0b,Silent:0b,NoGravity:0b}` |
| Portal Wands, runes, Dimensional Door items, and portal keys | Ordinary items with Wormholes names and `wormholes:` data keys | Inert. Discard them if unwanted |
| Placed Dimensional Doors and trapdoors | Ordinary doors and trapdoors | Inert |
| Directional gravity on Fabric, Forge, and NeoForge | Entity tag `wormholesGravity`, which Minecraft ignores | Inert |
| Recipe book entries for Wormholes recipes | Ignored by Minecraft | Inert |
| Portal frames, Nether landing platforms, and other placed blocks | Ordinary blocks | Break them if unwanted |

### Starting fresh

To reset Wormholes without removing it, run `/wormholes admin deleteeverything` (`wormholes.admin.reset`). It deletes `wormholes.toml`, portals, door and pocket records, atlas data, rule templates, network identity, routes, trust, and backups, then loads the default settings. World files stay, including the pocket rooms in `dimensions/wormholes/`. See [Commands and permissions](/wormholes/09-commands-permissions).

For a clean reinstall, stop the server, delete everything in the table above, install the jar, and start the server. Wormholes writes a default `wormholes.toml`, creates a new network identity, and on Paper, Purpur, and Folia installs the pocket datapack again. Link other servers again with `/wormholes server export` and `import`; see [Cross-server networking](/wormholes/10-cross-server-networking).
