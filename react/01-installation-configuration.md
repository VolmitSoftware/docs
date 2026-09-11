---
title: "Installation & Configuration"
description: "React documentation: Installation & Configuration"
published: true
date: 2026-09-10T04:12:59.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React supports Paper, Purpur, and Folia on Java 25.

## Install

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
| `verbose` | `false` | Additional operator logs |
| `debug` | `false` | Debug diagnostics |
| `slowTickLogMode` | `BLAME` | `OFF`, `BLAME`, `SHORT`, or `DETAILED` slow-tick reports |
| `customColors` | `true` | Colors in monitors |
| `integrationSecretsEnabled` | `false` | Activate secret Iris and Adapt integrations; changes apply automatically |
| `unsafeBytecode` | `false` | Allow live bytecode instrumentation attachment; detaching requires a server JVM restart |

React watches configuration and language files whenever the plugin is enabled. Save changes to apply them automatically, including feature, tweak, action, sampler, global, and web settings. Invalid configuration files leave the previous working settings active. Language catalogs use the per-message and file-level fallback rules in [Localization](/react/13-localization).

Changing `metrics` starts or stops anonymous bStats reporting without a restart. Setting `unsafeBytecode = true` can attach React's general ByteBuddy agent while the server is running. Attached instrumentation remains until the server JVM restarts. Set `unsafeBytecode = false` before restarting to prevent the general agent from attaching again; versioned NMS features can still attach their own instrumentation when activated.

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
