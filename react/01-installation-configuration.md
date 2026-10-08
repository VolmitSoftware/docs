---
title: "Installation & Configuration"
description: "React documentation: Installation & Configuration"
published: true
date: 2026-10-08T01:00:00Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React supports Paper, Purpur, and Folia on Java 25.

The same jar includes Minecraft 26.1.2, 26.2, and 26.3 support. Paper 26.3 currently uses alpha server builds; Folia 26.3 support has not been validated against a published server build.

## Install

Install the `-packed.jar` as the only React jar. Each build automatically selects the smaller ordinary or XZ package. If it selects XZ, startup verifies and extracts the bundled runtime to `plugins/React/cache/runtime/`, which must be writable. Later starts reuse the verified cache. Extraction needs no network access. Downloads for other libraries and language files still apply.

1. Put the React jar in `plugins/`.
2. Start the server once. React initializes its command system and creates the default configuration files.
3. Grant operators `react.use` or `react.*`.
4. Open `https://react.volmitsoftware.com` or edit the TOML files under `plugins/React/`.

PlaceholderAPI and the other Volmit plugins are optional.

## Files

| Path | Purpose |
|---|---|
| `react.toml` | Global settings |
| `web.toml` | React Web connection and security |
| `core/*.toml` | Controllers such as history, maps, and hot reload |
| `feature/*.toml` | Feature settings |
| `tweak/*.toml` | Tweak settings |
| `action/*.toml` | Action settings |
| `sampler/*.toml` | Metric settings |
| `plugin-apis/*.toml` | Third-party metric packs |
| `languages/en_US.toml` | Complete editable English catalog, created on startup if missing |
| `languages/<locale>.toml` | Editable locale catalog, downloaded when selected if missing |
| `languages/language-preferences.properties` | Per-player locale choices |
| `history/` | Saved metric history |

## Global settings

| Key | Default | Purpose |
|---|---:|---|
| `language` | `en_US` | Message language |
| `metrics` | `true` | Enable anonymous bStats metrics; changes apply automatically |
| `integrationSnapshotMaxMetrics` | `65536` | Maximum distinct metrics retained for snapshot consumers, clamped to 1–65536. A changed limit clears the snapshot cache on the next collection cycle |
| `verbose` | `false` | Additional operator logs |
| `debug` | `false` | Debug diagnostics |
| `slowTickLogMode` | `BLAME` | `OFF`, `BLAME`, `SHORT`, or `DETAILED` slow-tick reports |
| `customColors` | `true` | Colors in monitors |
| `integrationSecretsEnabled` | `false` | Activate secret Iris and Adapt integrations; changes apply automatically |
| `unsafeBytecode` | `false` | Allow live bytecode instrumentation attachment; detaching requires a server JVM restart |

React watches configuration and language files whenever the plugin is enabled. Save changes to apply them automatically, including feature, tweak, action, sampler, global, and web settings. Invalid configuration files leave the previous working settings active. Language catalogs use the per-message and file-level fallback rules in [Localization](/react/13-localization).

Changing `metrics` starts or stops anonymous bStats reporting without a restart. Setting `unsafeBytecode = true` can attach React's general ByteBuddy agent while the server is running. Attached instrumentation remains until the server JVM restarts. Set `unsafeBytecode = false` before restarting to prevent the general agent from attaching again; versioned NMS features can still attach their own instrumentation when activated.

If React reports that a task or ticker did not stop during a reload, restart the server.

## Metric history

`core/history.toml` controls saved graphs.

| Key | Default | Purpose |
|---|---:|---|
| `enabled` | `true` | Record history |
| `liveCaptureIntervalMs` | `500` | Live sample interval |
| `rawRetentionHours` | `48` | One-second history |
| `tenSecondRetentionDays` | `14` | Ten-second history |
| `minuteRetentionDays` | `180` | One-minute history |
| `fifteenMinuteRetentionDays` | `730` | Fifteen-minute history |
| `maxQuerySeries` | `16` | Metrics allowed in one query |
| `maxQueryPoints` | `4096` | Points allowed per metric |

Set a retention value to `0` or lower to keep that tier indefinitely. One-hour history is always retained.

## Event instrumentation

`core/event.toml` controls how React measures event-handler time. While instrumentation is installed, React wraps every registered Bukkit listener and feeds `event-time`, `events-listeners`, `event-handles-per-tick`, the `plugin-<name>` cost samplers, and the plugin event impact maps.

| Key | Default | Purpose |
|---|---:|---|
| `instrumentation` | `ON_DEMAND` | `ON_DEMAND` installs the wrappers only while something reads event data; `ALWAYS` keeps them installed for continuous plugin-cost history; `DUTY_CYCLE` behaves like `ON_DEMAND` and additionally opens a measurement window every period |
| `samplerActivityWindowMS` | `15000` | Time after the last event-data read before `ON_DEMAND` and `DUTY_CYCLE` remove the wrappers |
| `dutyCycleOnMS` | `5000` | Length of each periodic measurement window in `DUTY_CYCLE`; limited to the period |
| `dutyCyclePeriodMS` | `60000` | Time between the starts of periodic measurement windows in `DUTY_CYCLE`; at least 1000 ms |

Event data is read by monitors that display an event sampler, map graphs and plugin impact maps that are being viewed, PlaceholderAPI and Gloss placeholder lookups, connected React Web sessions, and the live snapshot endpoint. Stored metric history does not count as a reader. In `ON_DEMAND` the wrappers are installed at the next read and removed once `samplerActivityWindowMS` passes without one. Wrappers are always removed when React disables or reloads. `ON_DEMAND` has no event cost while nothing reads event data, so history records gaps for the event and plugin-cost samplers during that time. Set `instrumentation = "ALWAYS"` to keep plugin-cost history continuous, for example to see which plugin was expensive during a lag spike nobody was watching; this keeps a small per-handler timing cost on every event.

## React Web

React Web uses the listener configured in `web.toml`. Saving this file reconfigures the web runtime automatically. Existing WebSocket connections close during reconfiguration and clients must reconnect; saved tokens and server identity are retained. Invalid input or a failed reconfiguration restores the previous working configuration and reports the failure in the server console.

| Key | Default | Purpose |
|---|---:|---|
| `listenerEnabled` | `true` | Enable direct HTTP and WebSocket access |
| `listenAddress` | `::` | Listening interface; use `0.0.0.0` when IPv6 is unavailable |
| `port` | `9696` | Preferred port |
| `advertisedUrl` | empty | Public URL used for pairing |
| `corsOrigins` | empty | Allowed browser origins; empty allows all |
| `requireTokenForReads` | `true` | Require authentication for read endpoints |
| `relayEnabled` | `false` | Use an outbound relay instead of direct access |
| `relayUrl` | empty | Relay `wss://` URL |

For internet access, use a firewall and HTTPS reverse proxy, or enable the relay. React's direct listener is HTTP only.

Create a pairing code with:

```text
/react web pair <label> [role=viewer]
```

Roles are `viewer`, `operator`, and `admin`. Treat admin tokens like console access. Revoke unused tokens with `/react web revoke`.

## Language

Use `/react language` (alias `/react languages`) for a personal choice or `/react language server` for the default in `react.toml`. Edit messages directly in `languages/<locale>.toml`; React creates English on startup and preserves existing catalogs. Generated English and repository catalogs include formatting instructions and a comment reference explaining each variable in the catalog's language. See [Localization](/react/13-localization).
