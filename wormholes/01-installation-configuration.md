---
title: "Installation & Configuration"
description: "Install, client mod, data folder, wormholes.toml, and quality profiles"
published: true
date: 2026-10-08T20:57:33.580Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Install the artifact for your server platform: the CraftBukkit jar goes in `plugins/`; Fabric, Forge, and NeoForge jars go in `mods/`. Edit `plugins/Wormholes/wormholes.toml` on Bukkit or `config/wormholes/wormholes.toml` on native loaders. A missing optional integration disables only that integration. Players can also install the Fabric, Forge, or NeoForge jar on their client to receive [ClientView](/wormholes/05-projection-modes-settings#clientview).

## Requirements

| | |
|---|---|
| Bukkit server | Paper, Purpur, or Folia. Minecraft 26.1.2, 26.2, and 26.3 |
| Native server | Minecraft 26.3: Fabric Loader 0.19.5, Forge 66.0.8, or NeoForge 26.3.0.33-beta |
| Client mod | Optional. Minecraft 26.3 with Fabric Loader 0.19.5, Forge 66.0.8, or NeoForge 26.3.0.33-beta. See [Client mod](#client-mod) |
| Java | 25 |
| Distribution | `Wormholes v<version> [CraftBukkit] 26.1.2-26.3.jar`, or the jar bearing your native loader name and version. The `-api.jar` is a Bukkit compile dependency |
| JVM | `--enable-native-access=ALL-UNNAMED` lets zstd-jni load without a restricted-access warning |
| Optional | PlaceholderAPI, Iris, Vault, Citizens, WorldGuard |

An XZ packed jar extracts `plugins/Wormholes/cache/runtime/` on first start. That directory must be writable. PacketEvents is bundled in the Bukkit jar; no separate PacketEvents installation or download is required. Other runtime libraries still need a network on first start if their cache is empty. `wormholes.toml` must contain `schema = 3`. A valid save applies on its own. Invalid TOML is rejected and the current settings stay. WorldGuard, when present, checks RTP destinations. Edits to `languages/*.toml` apply on save. Dimensional Door pack changes need a restart. See [Dimensional Doors](/wormholes/07-dimensional-doors).

Fabric, Forge, and NeoForge servers store the same settings, portal records, door and pocket state, network identity, routes, trust, and language overrides under `config/wormholes/`. In singleplayer, each world keeps its own portals, doors, and pockets inside its save folder; see [Native loaders and singleplayer](#native-loaders-and-singleplayer). Reload native settings with `/wormholes reload`. Bukkit plugin integrations such as Vault and PlaceholderAPI require the Bukkit distribution. Native currency and permission integrations use the native registration APIs.

## Client mod

The Fabric, Forge, and NeoForge jars also run on the client. Put the jar for the client's loader in the client's `mods/` folder; it is the same jar a native server uses. A player with the mod receives [ClientView](/wormholes/05-projection-modes-settings#clientview) from any server that offers it: a Paper, Purpur, or Folia server with the Bukkit plugin, or a Fabric, Forge, or NeoForge server with the mod. Singleplayer worlds use the same jar.

ClientView requires matching Wormholes releases using protocol 8 and the same Minecraft version. A client mod built for an earlier protocol shows `Wormholes: Mismatch` and keeps the standard projection. The client mod is built for Minecraft 26.3, so the server must also run 26.3. Servers offer ClientView by default; `[client-view] enabled = false` turns it off. Players without the mod, Bedrock players, and clients that decline keep the standard projection.

On Fabric, Forge, and NeoForge servers and in singleplayer, players with the mod cross frame portals and dimensional doors without a teleport or loading screen. On Paper, Purpur, and Folia every player crosses with the ordinary teleport. See [Travel with the client mod](/wormholes/05-projection-modes-settings#travel-with-the-client-mod).

The F3 debug screen shows `Wormholes: Connected`, `Wormholes: Mismatch`, or `Wormholes: Disconnected`. The Wormholes label is gold; connected is green, mismatch is yellow, and disconnected is red. Mismatch means the ClientView protocol or Minecraft version is incompatible. Connection status appears on F3 without a chat notification.

Native portal views use Minecraft models, textures, and destination lighting. On Fabric, Forge, and NeoForge servers and in singleplayer, portals and doors the player can travel through are drawn from the destination world itself by the game's renderer, Sodium, and Iris Shaders; other views are streamed from the server. See [ClientView](/wormholes/05-projection-modes-settings#clientview). With Iris Shaders, the client creates the shader pipeline of every dimension while the world loads, so approaching a portal never compiles shaders.

For shader packs on Fabric or NeoForge, install [Iris Shaders](https://irisshaders.dev/) and its required Sodium version for Minecraft 26.3. Iris Shaders is separate from the Iris world-generation plugin and mod. When using [Distant Horizons](https://modrinth.com/mod/distanthorizons), select a shader pack with explicit Distant Horizons support. [Voxy](https://modrinth.com/mod/voxy/versions) and [OptiFine](https://www.optifine.net/downloads) do not currently provide Minecraft 26.3 builds.

### `config/wormholes-client.toml`

The client creates this file in its `config/` folder on first launch and reads it once when the game starts. Restart the game after editing it. Set `renderer = "block-packets"` to use standard server projection while keeping the mod installed; ClientView-only rendering, reflection, and destination-sky settings apply to `renderer = "native"`.

| Key | Default | Notes |
|-----|---------|--------|
| `renderer` | `"native"` | `"native"` enables ClientView. `"block-packets"` keeps this client on the server's standard block and entity packets, including when a shader pack is active. Restart the game after changing it |
| `max-plate-memory-mb` | `256` | Shared memory budget in MiB for received portal sections, 16–4096. Retained destination history uses at most one third of this budget, capped at 128 MiB. Locally visited sections have a separate 64 MiB cache. Visible sections arrive progressively; evicted contents are reacquired with the native renderer |
| `resident-level-memory-mb` | `512` | Memory budget in MiB for destination worlds kept loaded behind portals on servers with seamless crossing, 64–8192. Closed destinations beyond it are released, oldest first |
| `show-debug-overlay` | `false` | Show detailed ClientView metrics on F3 alongside the connection status |
| `atmosphere-dominance-blocks` | `2.5` | Distance in blocks from a portal plane within which the destination's time and weather replace the local sky, 0–16. `0` keeps the local sky; the destination sky inside native portal views is independent of this setting |
| `client-mirror` | `true` | Draw mirror portals from this client's own loaded chunks when the server allows it |
| `client-recursion` | `true` | Show nested mirrors and portals through their own destinations, in world views and in streamed views the server sends them for |
| `self-reflection` | `true` | Show your own reflection in mirror views |
| `portal-shape-subdivisions` | `8` | Mesh subdivisions per block along the edge of a portal with an [aperture shape](/wormholes/04-portal-types-menus-settings#aperture-shape), 1–16. Higher values give a smoother edge. Very large shaped portals use fewer so the mesh stays within its budget |
| `portal-edge-feather` | `0.0` | Width in blocks of a band inside the edge of a shaped portal's streamed view tinted with the destination's fog colour, 0–2. `0` draws no band |
| `camera-roll-ease-seconds` | `0.35` | Seconds over which the camera tilt left after crossing a twisted or upside-down portal pair eases back to level, 0–2. `0` levels the camera at once |

## Build distributions

Build with Java 25 from the repository root. The build has the Gradle modules `core` (shared plugin logic), `optics` (projection math and the ClientView stream protocol, pure Java with no Wormholes dependency), the Bukkit root project, and the `adapters/fabric`, `adapters/forge`, and `adapters/neoforge` builds; every distribution includes `optics`. `./gradlew buildAllToOut` creates the four distributions in the sibling `PluginOuts/` directory. Use `buildBukkit`, `buildFabric`, `buildForge`, or `buildNeoforge` for one platform. Set `-PpluginOutDirectory=/path/to/output` to choose the output directory. Each export replaces older Wormholes jars for that platform. NeoForge filenames omit the loader’s trailing `-beta` suffix, for example `Wormholes v2.2.0 [NeoForge] 26.3+26.3.0.33.jar`.

`./gradlew apiJar` creates the Bukkit compile dependency. Native integrations compile against their loader distribution; see [API](/wormholes/20-api-getting-started).

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

With `[main] shared-singleplayer-store = true`, every singleplayer world reads and writes one shared set of portals, so a portal built in one world also appears at the same position in every other world, and crossing it leads to its destination position in the world that is open. Dimensional doors and pocket rooms are blocks in the world where they were placed, so their records stay in that world's save folder. Wormholes reads the setting when a world opens; `/wormholes reload` does not move the data of the open world.

## Config path and schema

| Property | Value |
|----------|--------|
| Path | Bukkit: `plugins/Wormholes/wormholes.toml`; native loaders: `config/wormholes/wormholes.toml` |
| Schema | `schema = 3` |
| Quality key | Top-level `quality` |
| Sections | `[main]`, `[recipes]`, `[network]`, `[projection]`, `[render]`, `[transit]`, `[client-view]` |
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
| `language-fallbacks` | `""` | Comma-separated fallback locales. Code English is always final |
| `schema` | `3` | Must match exactly |
| `quality` | `auto` | `auto` \| `performance` \| `balanced` \| `cinematic` |

## `[main]`

| Key | Default | Notes |
|-----|---------|--------|
| `enable-particles` | `true` | Independent global particle switch |
| `replace-nether-and-end-portals` | `true` | Auto-link vanilla Nether/End frames as Wormholes portals |
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
| `chunk-pre-send-enabled` | `true` | Before a local, RTP, or dimensional-door teleport, pre-send already-loaded destination chunks to the player. Cross-world and cross-server travel skip it |
| `chunk-pre-send-radius-chunks` | `3` | Radius of pre-send |
| `chunk-pre-send-max-chunks` | `32` | Hard ceiling per traversal |
| `chunk-pre-send-budget-micros` | `2000` | Microseconds the pre-teleport send may use before stopping with a partial result |
| `arrival-prewarm-on-interest` | `true` | Pre-warm arrival chunks when observers show interest |
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
| `gravity-flip-enabled` | `false` | Arrive upright through exits that point up or down instead of carrying the look rigidly through the pair. The flip turns the whole camera basis and does not apply to the `look` policy. Existing files keep the value they already hold |
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

## Hot reload

`wormholes.toml` reloads after a complete save. The console prints `Configuration hot-reloaded.` Invalid files leave the current settings active.
