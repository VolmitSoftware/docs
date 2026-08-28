---
title: "Installation & Configuration"
description: "React documentation: Installation & Configuration"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Install the React shaded jar into `plugins/`. Start the server once so React creates the data folder. Then edit TOML configs and reload or restart as required. React targets modern Paper, Purpur, and Folia with `folia-supported: true`.

## Requirements

- Java 25 for both building and running this tree. Use the React artifact built for the target server's Minecraft API version.
- Soft dependency: PlaceholderAPI (optional). This enables `%react_…%` keys.
- Optional peer plugins for mirrored metrics and gated features: Iris, Adapt, Wormholes, Gloss, HiddenOre, BileTools.

## Install

1. Place the React jar in `plugins/`.
2. Start the server. React creates `plugins/React/`, writes missing default TOML files for registered content, and prints `Control Panel: https://react.volmitsoftware.com` in its startup splash.
3. Grant `react.use` (or `react.*`) to operators.

## Data folder layout

| Path | Role |
|------|------|
| `plugins/React/react.toml` | Global settings |
| `plugins/React/web.toml` | Embedded management API listener, authentication, and relay settings |
| `plugins/React/web/tokens.toml` | Paired API token records and roles; keep private |
| `plugins/React/web/audit.log` | Append-only audit records for remote mutations |
| `plugins/React/history/` | Compressed metric segments and the crash-recovery journal |
| `plugins/React/core/<controller-id>.toml` | Controller settings, including hotload, maps, and config-input sessions |
| `plugins/React/feature/<id>.toml` | Per-feature config |
| `plugins/React/tweak/<id>.toml` | Per-tweak config |
| `plugins/React/action/<id>.toml` | Per-action config |
| `plugins/React/sampler/<id>.toml` | Per-sampler config when present |
| `plugins/React/plugin-apis/*.toml` | Community Plugin API packs that create metrics for installed plugins |
| `plugins/React/languages/overrides/<locale>.toml` | Optional message overrides |
| `plugins/React/player-settings/<uuid>.json` | Persisted action-bar monitor preferences. Writes are coalesced off-thread and atomically replace the prior file. |
| `plugins/React/data/value-cache.json` | Cached material-value analysis |
| `plugins/React/benchmark/` | Benchmark output written by benchmark commands |
| `plugins/React/info/` | Generated command, permission, and plugin metadata |
| `plugins/React/test-reports/` | JSON reports requested by `/react test run` or `loadtest` |

This layout is a hard break. Delete the obsolete `plugins/React/config.toml`, `plugins/React/config.json`, and JSON files under `core/`, `feature/`, `tweak/`, `action/`, and `sampler/` before upgrading; deletion permanently removes their local settings. Start the server to generate `react.toml` and missing TOML component files, then restart after applying the desired settings. React does not migrate the obsolete files.

## Global configuration (`ReactConfiguration`)

Primary operator-facing keys:

| Key | Default | Description |
|-----|---------|-------------|
| `language` | `en_US` | Locale for player/operator messages. React Web exposes the complete shared locale list as a dropdown and reloads the live language immediately after a successful save. |
| `metrics` | `true` | bStats anonymous metrics |
| `priority` | entity priority model | Weights used by culling/queueing subsystems |
| `value` | material value model | Recipe/value analysis tuning |
| `customColors` | `true` | Custom colors in monitor views |
| `verbose` | `false` | Verbose console output |
| `debug` | `false` | Debug diagnostics |
| `slowTickLogMode` | `BLAME` | `OFF`, `BLAME`, `SHORT`, or `DETAILED` slow-tick logging |
| `integrationSecretsEnabled` | `false` | Allows Iris/Adapt secret integration bundles when deps present |
| `unsafeBytecode` | `false` | Eagerly attaches React's general ByteBuddy agent during startup. Versioned NMS features may attach their own instrumentation independently when active. Attached instrumentation remains until JVM restart. |
| `adaptAbilityOpsMetricMode` | `SUCCESSFUL_CHECKS` | Selects the Adapt ability-operation rate used by displays, samplers, and alert context only; performance-pressure thresholds use measured timing instead |
| `monitoring` | default groups | Default action-bar monitor layout |

Nested `monitoring` fields (`ReactConfiguration.Monitoring`):

| Key | Default | Description |
|-----|---------|-------------|
| `actionBarHeaderSlots` | `6` | Max monitor groups shown in the action bar at once |
| `actionBarSamplerSlots` | `6` | Max samplers in the focused action-bar row at once |
| `monitorConfiguration` | built-in groups | Default groups/samplers (CPU, Memory, World, Physics, Iris, Adapt) |

Nested `value` fields (`ReactConfiguration.ValueConfig`):

| Key | Default | Description |
|-----|---------|-------------|
| `baseValue` | `100` | Base material value before recipe/override adjustments |
| `maxRecipeListPrecaution` | `50` | Cap on recipe traversal depth |
| `valueMutlipliers` | built-in map | Per-material multipliers (field name is spelled `valueMutlipliers` in code) |

## Console logging

React sends normal messages through the plugin logger. Paper, Purpur, and Folia consoles receive parsed rich components, so status output and the startup splash render their legacy colors without exposing `§` codes. A platform without component-logger support receives plain text with formatting removed. Warnings retain `WARNING` severity, errors retain `SEVERE` severity, and caught failures include their complete exception diagnostics with a React-owned context message. Routine startup registration counts, successful action execution, hotload-watcher readiness, format-only config rewrites, per-player UI scheduling diagnostics, scheduler-thread shutdown bookkeeping, and transient relay reconnect failures are emitted only when `verbose = true`; `debug` output requires `debug = true`.

Repeated fast-leaf-decay scan failures are limited to one warning with a full exception per ten seconds. Emergency ticker logging falls back directly to branded standard error only if the normal logging path itself fails.

The embedded Javalin and Jetty stack uses React's plugin classloader and a private SLF4J sink, so it does not print dependency startup banners, missing-logger advisories, or duplicate listener-failure lines. An occupied preferred port makes React atomically try the next 99 ports in order, capped at 65535. A successful fallback or an exhausted range produces one concise warning without a stack trace; unrelated listener startup failures remain `SEVERE` and retain their complete cause chain.

## Reload

The hotload controller watches `react.toml`, locale overrides, and managed config files under `core/`, `feature/`, `tweak/`, `action/`, and `sampler/`. Routine polls drain operating-system events without checking watched-file metadata when native exact-file or recursive watching is active. Scheduled full scans still reconcile watcher state, and exact-content fallback work continues across polls. A reconciliation pass yields between files after 32 files, 8 MiB, or roughly 10 milliseconds; directory enumeration, a full watcher scan, or one individual file read can take longer. This keeps Docker, Pterodactyl, and other mounts that omit events convergent while bounding ordinary fallback work. A detected file must stay stable for an extra watcher poll before it is eligible.

The measured React ticker only coalesces a poll request onto one dedicated `React-Hotload-IO` worker. That worker drains filesystem events, performs fallback enumeration and reconciliation, captures and hashes stable snapshots, parses TOML, JSON, and localization candidates, and prepares operator diffs. Once a batch is prepared, one global server task copies the prepared values into live configuration, performs component lifecycle and Bukkit work, and sends operator messages. Stopping or restarting the controller retires its worker and prevents stale prepared work from reaching the replacement runtime.

React normalizes watched paths and coalesces repeated events by path. An automatic apply batch cannot start until three monotonic seconds after the preceding drain and any deferred watcher reconfiguration finish. Saves received while a batch is waiting or running collapse into one trailing drain that reads the latest stable state. Every touched path and React-owned write advances a per-path revision; the global task skips a prepared snapshot whose revision is stale, and completion cannot overwrite tracking established by the newer save. A successful `core/hotload.toml` change reconfigures the watcher only after every file in the current batch has been processed; React compares digests before and after that reconfiguration so the watcher reset cannot discard a concurrent save.

Before applying a file, React captures a strict-UTF-8 snapshot of at most 2 MiB and requires two identical reads with stable file attributes. It applies those immutable bytes, acknowledges that exact digest, and reads the file again afterward. If newer bytes arrived during parsing or application, that path is queued for the trailing batch instead of being marked complete. Common editor, browser-download, and FTP temporary artifacts are ignored.

A missing target enters a three-second controller tombstone grace after the watcher delivers the stable missing-file event. React does not recreate, migrate, canonicalize, or delete a watched target during that gap. If the file returns, the latest bytes are queued; if it remains absent through the grace, React logs the deletion and keeps the last-good runtime state.

Feature and tweak changes deactivate and reactivate active components. Enable-state changes activate or deactivate those components. Sampler changes restart the sampler. Action changes refresh the action configuration. Core changes reload the matching controller.

Global changes refresh language, entity priority, and active player monitors. Changes to `metrics` and the startup `unsafeBytecode` decision still require a full server restart.

Player profiles are preloaded during asynchronous login so joining does not read JSON on the player-owning thread. A reload with players already online reads those profiles sequentially on one I/O worker and attaches each runtime on that player's scheduler; transient rejected or retired owner dispatches retry within the same controller generation, and exhausted attempts retain the loaded profile for the next owner-local join path. Repeated saves for one UUID collapse to the newest JSON, and shutdown waits up to 30 seconds for the atomic write queue to drain before reporting an error.

`/react reload` performs a complete React disable and enable lifecycle. If the old ticker cannot drain, React refuses to re-enable and requires a server restart.

React rejects invalid component, controller, global-config, or localization hotloads. The current live snapshot stays active. Passive hotload parses the captured bytes without canonical rewrites, legacy migration, or target deletion, so it cannot overwrite a newer external save. Transient capture, verification, scheduling, or application failures retain the last-good state, stay queued when retryable, and log their full stack traces. Startup and explicit manual reloads keep their normal canonicalization, migration, backup, and recovery behavior.

## Hotload controller (`core/hotload.toml`)

| Key | Default | Description |
|-----|---------|-------------|
| `enabled` | `true` | Enables managed config file watching. Disabling it requires manual reloads or restarts. |
| `pollIntervalMs` | `500` | Filesystem-event polling interval, clamped to at least 100 ms. Automatic apply batches remain limited to one every three seconds. |
| `maxDiffMessagesPerFile` | `12` | Maximum changed-key messages included in each operator summary. |
| `notifyOperators` | `true` | Sends hotload summaries to online operators in addition to console output. |

## Other controller configuration

- `core/config-input.toml`: `sessionTimeoutSeconds = 45` controls the in-game config editor's text-input timeout and is clamped to at least five seconds.
- `core/history.toml` controls the authoritative sampler capture and durable metric history described below.
- `core/map.toml` controls map repair, redraw, packet delivery, and megamap behavior. See [11 - Monitors Maps & In-Game GUI](/react/11-monitors-maps-in-game-gui).

## Metric history (`core/history.toml`)

React captures every registered sampler once per live snapshot and reuses that timestamped snapshot for the live API, WebSocket delivery, short in-process graphs, and persistence. The default live capture interval is 500 ms. Durable storage writes at most one exact sample per metric per aligned second; an unavailable or failed sampler and a saturated writer queue produce a gap rather than a fabricated zero.

The writer is one bounded background worker. It journals each persisted snapshot before adding it to the active in-memory segment, forces the journal at most every five seconds by default, seals segments through a forced temporary file and atomic replacement, and validates journal frames and segment series with CRC32C. Startup replays complete journal frames through the last valid checksum and truncates an incomplete or corrupt tail. A clean shutdown seals the active segment and resets the journal. Storage failures retain live monitoring and report their complete exception diagnostics.

React publishes collection-health samplers for queue depth and capacity, dropped snapshots and drop rate, persistence lag, storage state, capture/write duration, disk and journal bytes, sampler availability/failures, third-party publication acceptance, and WebSocket backpressure. These series are stored by the same history pipeline, so operators can distinguish an actual quiet period from a collection gap.

Segments use exact per-column codecs selected independently for each metric: constants, run lengths, integral deltas, IEEE-754 XOR deltas, or raw values. DEFLATE at the configured level is retained only when it makes that encoded column smaller. No native database or compression library is required. Rollups preserve first, last, minimum, maximum, sum, sample count, and gaps, so averages remain weighted and spikes are not erased when old raw points expire.

| Tier | Segment span | Default retention |
|------|--------------|-------------------|
| 1 second | 15 minutes | 48 hours |
| 10 seconds | 3 hours | 14 days |
| 1 minute | 12 hours | 180 days |
| 15 minutes | 6 days | 730 days |
| 1 hour | 30 days | Indefinite |

React creates `plugins/React/history/raw`, `10s`, `1m`, `15m`, and `1h`, plus `plugins/React/history/active.wal`. A source segment is deleted only after the covering next-tier segment has been written. Unreadable immutable segments are ignored and reported; other valid segments remain queryable. The segment and journal format is current-format-only: React has no migration reader, dual-read path, or legacy history location.

| Key | Default | Effective bounds and behavior |
|-----|---------|-------------------------------|
| `enabled` | `true` | Records new history when true. Existing immutable history remains readable when false. |
| `liveCaptureIntervalMs` | `500` | Clamped to 250–10,000 ms. |
| `walForceIntervalMs` | `5000` | Clamped to 1,000–60,000 ms; this is the maximum recent window a host or process crash can lose. |
| `compressionLevel` | `3` | Clamped to 0–9 and applied only when DEFLATE wins. |
| `rawRetentionHours` | `48` | Non-positive retains the one-second tier indefinitely. |
| `tenSecondRetentionDays` | `14` | Non-positive retains the ten-second tier indefinitely. |
| `minuteRetentionDays` | `180` | Non-positive retains the one-minute tier indefinitely. |
| `fifteenMinuteRetentionDays` | `730` | Non-positive retains the fifteen-minute tier indefinitely. One-hour history is always indefinite. |
| `maxQuerySeries` | `16` | Clamped to 1–64 unique metric ids per query. |
| `maxQueryPoints` | `4096` | Clamped to 64–16,384 buckets per metric for resolution selection. |
| `queryPagePoints` | `256` | Clamped to 32–512 buckets per metric in one response page. |

## Embedded management API (`web.toml`)

New installations start the token-protected HTTP/WebSocket listener on the IPv6 wildcard. On the usual dual-stack JVM/kernel configuration this accepts both IPv6 and IPv4-mapped traffic, including LAN, container, and port-forwarded connections. React always speaks plain HTTP on its bound socket. Place internet-facing deployments behind a firewall or HTTPS reverse proxy; `advertisedUrl` tells paired direct clients which reachable base URL to use and does not enable TLS inside React. `web.toml` is startup configuration rather than a watched component file, so run `/react reload` or restart after any edit.

The listener schema is a hard break. A `web.toml` containing the former `enabled` or `bindAddress` keys, a file missing either new listener key, or any legacy `web.json` makes the Web controller fail closed. React does not create a listener or pairing token from that configuration. Delete the obsolete file, accepting that its local edits are lost, restart to generate the current `web.toml`, then reapply the intended values under the new keys. There is no automatic migration.

| Key | Default | Description |
|-----|---------|-------------|
| `listenerEnabled` | `true` | Starts the embedded listener. Set false to disable every direct HTTP and WebSocket endpoint. |
| `listenAddress` | `::` | Listener interface. The default is dual-stack where the OS/JVM permits IPv4-mapped wildcard traffic. On an IPv6-disabled or IPv6-only wildcard host, use `0.0.0.0` for IPv4. |
| `port` | `9696` | Preferred listener port. If occupied, React tries this port followed by the next 99 ports in order, capped at 65535. |
| `advertisedUrl` | empty | Absolute HTTP or HTTPS base URL placed in RCT2 pairing payloads. A reverse-proxy path is preserved; credentials, query strings, and fragments are rejected. |
| `corsOrigins` | empty | Allowed browser origins. An empty list permits any origin. |
| `wsPushHz` | `5` | Metrics WebSocket push frequency. |
| `requireTokenForReads` | `true` | Requires bearer authentication for ordinary read endpoints. Console log endpoints remain authenticated even when this is false. |
| `relayEnabled` | `false` | Opens React's authenticated outbound channel to the configured relay for NAT traversal. |
| `relayUrl` | empty | Base `wss://` relay URL. React appends `/agent`; React Web connects to `/app`. |

`GET /api/v1/ping` is intentionally unauthenticated. It returns only protocol version `2`, the server identity's full SHA-256 fingerprint, and whether a relay session is currently registered. It does not expose the server name, address, public key, token data, or configured URLs.

For a rented or NAT/port-forwarded server, forward the chosen public TCP port to React's actual bound port and allow that port through the host firewall. React logs the effective port when it differs from the preferred `9696`; keep the preferred port free when a fixed reverse-proxy or forwarding target is required. Set `advertisedUrl` to the public HTTP(S) URL, including any reverse-proxy base path. An explicit `advertisedUrl` remains authoritative and is not rewritten after a local port fallback. When `advertisedUrl` is empty, the pairing payload cannot discover the router's public address and advertises a local fallback using the actual bound port; after pasting the code, replace that value in React Web's editable **Direct host** field with the public URL. IPv6 literals and reverse-proxy paths are preserved for HTTP and both WebSocket streams.

Generate an RCT2 payload with `/react web pair <label> [role=viewer]`. Pairing succeeds only after the configured socket is live and bound; disabled, starting, failed, stopped, or unbound listeners create and persist no token. Players receive an in-game click-to-copy action that copies the complete payload without displaying it in chat; console and RCON senders receive the raw payload as text. React Web checks the unauthenticated ping fingerprint against the RCT2 fingerprint before it stores a direct-only profile. A mismatch, malformed response, or unreachable endpoint fails closed before authenticated identity access.

A browser loaded over HTTPS cannot call React's plain-HTTP listener through mixed content. For a hosted React Web client, either place the listener behind an HTTPS reverse proxy and set `advertisedUrl`, or enable the outbound relay with a production `wss://` endpoint. Restrict `corsOrigins` to the exact React Web origin when using direct browser access. Bearer authentication remains required for ordinary reads by default even though the socket listens on all interfaces.

Bearer-authenticated mutations require a strictly increasing `X-React-Counter` per token. `GET /api/v1/logs` and `/ws/logs` capture the complete server logger, including other plugins and stack traces, and require the admin-only `console:read` scope. `POST /api/v1/console/execute` requires the admin-only `console:execute` scope, accepts one control-character-free command of at most 512 characters, dispatches through the server/global scheduler, and writes a redacted audit record that excludes command arguments. Treat console access as equivalent to server-console access.

Player navigation uses one canonical authenticated API: `GET /api/v1/players` lists online player ids and names, and `POST /api/v1/players/{uuid}/teleport` accepts `{"worldKey":"<canonical-key>","blockX":<integer>,"blockZ":<integer>,"confirm":true}`. Both routes always require the `admin` scope, even when `requireTokenForReads` is false, and the POST also requires the token's next `X-React-Counter`. HTTP 202 means the request entered React's scheduler; it does not claim that the later safe-destination lookup or teleport completed.

`GET /api/v1/metrics` and `/ws/metrics` return one scalar snapshot object with `sequence`, `capturedAtMs`, and `samplers`; each sampler carries `id`, `name`, `suffix`, `value`, `display`, and `available`. They do not carry repeated history arrays. `GET /api/v1/metrics/catalog` lists active and historical metric ids with their stored coverage. `GET /api/v1/metrics/history` requires comma-separated `ids` and accepts epoch-millisecond `from`/`to`, `maxPoints`, and `pageSize`. The response pins a sequence/time watermark and returns bounded pages with an opaque `nextCursor`; cursor pages require only that cursor. Each point is `[timestampMs, average, minimum, maximum, last, count]`. The retired `GET /api/v1/metrics/{id}/history` shape is not served.

React Web loads the catalog once, keeps its 128-point live chart history in browser memory, and requests durable history only for the selected metric and range. Its 1h, 24h, 7d, 30d, and All views follow pagination and display the server-selected resolution. Historical-only metrics remain selectable after their source disappears.

Feature, tweak, world, global-config, preset, action, player-teleport, and successfully dispatched console mutations are accepted only when their documented authoritative stage succeeds. Multi-value config and control updates restore earlier values if a later value is rejected instead of returning a false success. Every accepted mutation is appended to `plugins/React/web/audit.log`; online operators receive a localized chat notice containing the signed pairing-device label, role, token ID, target, and a value-free summary. Action and player-teleport notices mean queued, not completed, and console notices include only the command verb and length.

One shared background host-telemetry snapshot refreshes once per second and feeds both the sampler registry and the Environment API. Physical memory, disk capacity and throughput, network throughput/errors/drops, JVM memory/direct buffers/classes/GC/uptime, and player activity therefore retain durable sampler history without multiplying OS queries by connected viewers. The Environment workspace also presents mounted-volume and device/interface details from that shared snapshot.

WebSocket bearer values never appear in `/ws/metrics` or `/ws/logs` URLs. An authenticated client sends one JSON text frame shaped exactly as `{"type":"auth","token":"<bearer>"}` before it can join a live session. Malformed, invalid, binary, unexpected, or repeated authentication frames close with policy code `1008`. Pending authentication is capped at 2,048 sockets and expires after five seconds. Metrics remains available without authentication only when `requireTokenForReads = false`; that mode still accepts one valid first-frame credential from clients that always authenticate. Logs always require `console:read`.

WebSocket delivery uses four daemon send workers and a bounded 2,048-task queue rather than creating one native thread per slow client. Each metrics or log session retains only its newest pending live frame under backpressure; the bounded HTTP log tail remains available when an intermediate live log frame is coalesced.

Per-world budget updates accept the canonical namespaced key in `PUT /api/v1/worlds/update`. `PUT /api/v1/worlds/{name}` is also available for clients that address a world by its displayed name; React resolves that name back to the canonical key before applying the update.


## Localization

Server English is code-owned under `art.arcane.react.localization`. Bundled locales ship as TOML resources. Select locale with `language`. Override selected keys via `languages/overrides/<locale>.toml`. See [13 - Localization](/react/13-localization).
