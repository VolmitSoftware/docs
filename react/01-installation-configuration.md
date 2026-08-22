---
title: "Installation & Configuration"
description: "React documentation: Installation & Configuration"
published: true
date: 2026-08-21T00:00:00.000Z
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
2. Start the server. React creates `plugins/React/` and writes missing default TOML files for registered content.
3. Grant `react.use` (or `react.*`) to operators.

## Data folder layout

| Path | Role |
|------|------|
| `plugins/React/config.toml` | Global settings |
| `plugins/React/web.toml` | Opt-in embedded management API settings |
| `plugins/React/web/tokens.toml` | Paired API token records and roles; keep private |
| `plugins/React/web/audit.log` | Append-only audit records for remote mutations |
| `plugins/React/core/<controller-id>.toml` | Controller settings, including hotload, maps, and config-input sessions |
| `plugins/React/feature/<id>.toml` | Per-feature config |
| `plugins/React/tweak/<id>.toml` | Per-tweak config |
| `plugins/React/action/<id>.toml` | Per-action config |
| `plugins/React/sampler/<id>.toml` | Per-sampler config when present |
| `plugins/React/languages/overrides/<locale>.toml` | Optional message overrides |
| `plugins/React/player-settings/<uuid>.json` | Persisted action-bar monitor preferences |
| `plugins/React/data/value-cache.json` | Cached material-value analysis |
| `plugins/React/benchmark/` | Benchmark output written by benchmark commands |
| `plugins/React/info/` | Generated command, permission, and plugin metadata |
| `plugins/React/migrations/backups/` | ZIP backups created before legacy JSON migration |
| `plugins/React/test-reports/` | JSON reports requested by `/react test run` or `loadtest` |

At startup, React backs up legacy JSON configs to a timestamped ZIP. It writes their TOML replacements. It records a migration marker. It deletes each JSON file only after its TOML replacement exists. A legacy JSON file beside an existing canonical TOML file is ignored by hotload.

## Global configuration (`ReactConfiguration`)

Primary operator-facing keys:

| Key | Default | Description |
|-----|---------|-------------|
| `priority` | entity priority model | Weights used by culling/queueing subsystems |
| `value` | material value model | Recipe/value analysis tuning |
| `customColors` | `true` | Custom colors in monitor views |
| `verbose` | `false` | Verbose console output |
| `debug` | `false` | Debug diagnostics |
| `language` | `en_US` | Locale for player/operator messages |
| `slowTickLogMode` | `BLAME` | `OFF`, `BLAME`, `SHORT`, or `DETAILED` slow-tick logging |
| `integrationSecretsEnabled` | `false` | Allows Iris/Adapt secret integration bundles when deps present |
| `unsafeBytecode` | `false` | Eagerly attaches React's general ByteBuddy agent during startup. Versioned NMS features may attach their own instrumentation independently when active. Attached instrumentation remains until JVM restart. |
| `metrics` | `true` | bStats anonymous metrics |
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

## Reload

The hotload controller watches `config.toml`, locale overrides, and managed config files under `core/`, `feature/`, `tweak/`, `action/`, and `sampler/`. Routine polls drain operating-system events without checking every watched file's metadata when native recursive watching is active. Scheduled full scans still reconcile watcher state, and exact-content fallback work continues across polls. A reconciliation pass yields between files after 32 files, 8 MiB, or roughly 10 milliseconds; directory enumeration, a full watcher scan, or one individual file read can take longer. This keeps Docker, Pterodactyl, and other mounts that omit events convergent while bounding ordinary fallback work. A detected file must stay stable for an extra watcher poll before it is eligible.

React normalizes watched paths and coalesces repeated events by path. An automatic apply batch cannot start until three monotonic seconds after the preceding drain and any deferred watcher reconfiguration finish. Saves received while a batch is waiting or running collapse into one trailing drain that reads the latest stable state. A successful `core/hotload.toml` change reconfigures the watcher only after every file in the current batch has been processed; React compares digests before and after that reconfiguration so the watcher reset cannot discard a concurrent save.

Before applying a file, React captures a strict-UTF-8 snapshot of at most 2 MiB and requires two identical reads with stable file attributes. It applies those immutable bytes, acknowledges that exact digest, and reads the file again afterward. If newer bytes arrived during parsing or application, that path is queued for the trailing batch instead of being marked complete. Common editor, browser-download, and FTP temporary artifacts are ignored.

A missing target enters a three-second controller tombstone grace after the watcher delivers the stable missing-file event. React does not recreate, migrate, canonicalize, or delete a watched target during that gap. If the file returns, the latest bytes are queued; if it remains absent through the grace, React logs the deletion and keeps the last-good runtime state.

Feature and tweak changes deactivate and reactivate active components. Enable-state changes activate or deactivate those components. Sampler changes restart the sampler. Action changes refresh the action configuration. Core changes reload the matching controller.

Global changes refresh language, entity priority, and active player monitors. Changes to `metrics` and the startup `unsafeBytecode` decision still require a full server restart.

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
- `core/map.toml` controls map repair, redraw, packet delivery, and megamap behavior. See [11 - Monitors Maps & In-Game GUI](/react/11-monitors-maps-in-game-gui).

## Embedded management API (`web.toml`)

The embedded HTTP/WebSocket listener is disabled by default. It always speaks plain HTTP on its bound socket. For remote access, keep the listener on a trusted interface and terminate HTTPS at a reverse proxy; `advertisedUrl` tells paired direct clients which public HTTPS base URL to use and does not enable TLS inside React.

| Key | Default | Description |
|-----|---------|-------------|
| `enabled` | `false` | Starts the embedded listener when true. |
| `bindAddress` | `127.0.0.1` | Listener interface. Use a non-loopback address only with an intentional network boundary. |
| `port` | `9696` | Listener port. |
| `advertisedUrl` | empty | Absolute HTTP or HTTPS base URL placed in RCT2 pairing payloads. Credentials, query strings, and fragments are rejected. |
| `corsOrigins` | empty | Allowed browser origins. An empty list permits any origin. |
| `wsPushHz` | `5` | Metrics WebSocket push frequency. |
| `requireTokenForReads` | `true` | Requires bearer authentication for ordinary read endpoints. Console log endpoints remain authenticated even when this is false. |
| `relayEnabled` | `false` | Opens React's authenticated outbound channel to the configured relay for NAT traversal. |
| `relayUrl` | empty | Base `wss://` relay URL. React appends `/agent`; React Web connects to `/app`. |

`GET /api/v1/ping` is intentionally unauthenticated. It returns only protocol version `2`, the server identity's full SHA-256 fingerprint, and whether a relay session is currently registered. It does not expose the server name, address, public key, token data, or configured URLs.

Generate an RCT2 payload with `/react web pair <label> [role]`, then paste the complete value into React Web. A browser loaded over HTTPS cannot call React's plain-HTTP listener through mixed content. For a hosted React Web client, either place the listener behind an HTTPS reverse proxy and set `advertisedUrl`, or enable the outbound relay with a production `wss://` endpoint. Restrict `corsOrigins` to the exact React Web origin when using direct browser access.

Bearer-authenticated mutations require a strictly increasing `X-React-Counter` per token. `GET /api/v1/logs` and `/ws/logs` capture the complete server logger, including other plugins and stack traces, and require the admin-only `console:read` scope. `POST /api/v1/console/execute` requires the admin-only `console:execute` scope, accepts one control-character-free command of at most 512 characters, dispatches through the server/global scheduler, and writes a redacted audit record that excludes command arguments. Treat console access as equivalent to server-console access.

Per-world budget updates accept the canonical namespaced key in `PUT /api/v1/worlds/update`. `PUT /api/v1/worlds/{name}` is also available for clients that address a world by its displayed name; React resolves that name back to the canonical key before applying the update.


## Localization

Server English is code-owned under `art.arcane.react.localization`. Bundled locales ship as TOML resources. Select locale with `language`. Override selected keys via `languages/overrides/<locale>.toml`. See [13 - Localization](/react/13-localization).
