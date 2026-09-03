---
title: "Installation & Configuration"
description: "React documentation: Installation & Configuration"
published: true
date: 2026-09-03T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React supports Paper, Purpur, and Folia on Java 25.

## Install

1. Put the React jar in `plugins/`.
2. Start the server once.
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
| `languages/<locale>.toml` | Downloaded locale catalog, installed when selected |
| `languages/overrides/<locale>.toml` | Message overrides |
| `language-preferences.properties` | Per-player locale choices |
| `history/` | Saved metric history |

## Global settings

| Key | Default | Purpose |
|---|---:|---|
| `language` | `en_US` | Message language |
| `metrics` | `true` | Anonymous bStats metrics |
| `verbose` | `false` | Additional operator logs |
| `debug` | `false` | Debug diagnostics |
| `slowTickLogMode` | `BLAME` | `OFF`, `BLAME`, `SHORT`, or `DETAILED` slow-tick reports |
| `customColors` | `true` | Colors in monitors |
| `integrationSecretsEnabled` | `false` | Secret Iris and Adapt integrations |
| `unsafeBytecode` | `false` | Enable features that require bytecode instrumentation; restart required |

Feature, tweak, action, sampler, and most global changes reload automatically. Invalid files leave the current settings active. Use `/react reload` for a full reload. Changes to `metrics`, `unsafeBytecode`, or `web.toml` require `/react reload` or a restart.

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

React Web uses the listener configured in `web.toml`.

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

Use `/react language` for a personal choice or `/react language server` for the default in `react.toml`. Put selected message overrides in `languages/overrides/<locale>.toml`. See [Localization](/react/13-localization).
