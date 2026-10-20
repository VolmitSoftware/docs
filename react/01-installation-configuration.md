---
title: "Installation & Configuration"
description: "Install React, configure automatic reloads, connect React Web, and uninstall React"
published: true
date: 2026-10-17T14:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

React supports Paper, Purpur, and Folia on Java 25.

The same jar supports Minecraft 26.1.2, 26.2, and 26.3. Folia is supported on 26.1.2 and 26.2.

## Install

Install the selected distribution jar as the only React jar. Each build automatically selects the smaller ordinary or XZ package. If it selects XZ, startup verifies and extracts the bundled runtime to `plugins/React/cache/runtime/`, which must be writable. Later starts reuse the verified cache. Extraction needs no network access. Downloads for other libraries and language files still apply.

1. Put `React v<version> [CraftBukkit] 26.1.2-26.3.jar` in `plugins/`.
2. Start the server once. React initializes its command system and creates the default configuration files.
3. Grant operators `react.use` or `react.*`.
4. Open [React Web](https://react.volmitsoftware.com/) or edit the TOML files under `plugins/React/`.

PlaceholderAPI and the other Volmit plugins are optional.

To update React, stop the server, replace its jar, and restart. Keep `plugins/React/` in place. Saved metric history carries over.

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
| `updateNotifications` | `true` | Check React's stable GitHub releases for shared update notices and `/volmit plugins updates`; changes apply automatically. See [Update notifications](/volmlib/api/github-releases) |
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

Each one-second history point aggregates every available live capture in that second, including its minimum and maximum. Sources can refresh more slowly than live capture. Source timestamps show when the underlying reading changed. Saved readings without source timestamps or measurement metadata retain unknown values for those fields.

## Runtime telemetry

`core/runtime-telemetry.toml` controls Folia regional readings and selective JFR event summaries. Changes apply automatically.

| Key | Default | Purpose |
|---|---:|---|
| `regionalEnabled` | `true` | Sample Folia region TPS at cached player locations |
| `playerAnchorsPerRefresh` | `64` | Player locations sampled each second; clamped to 1–512. Observations expire after five seconds |
| `jfrEnabled` | `false` | Enable bounded JFR event summaries |
| `jfrSlowThresholdMs` | `10` | Minimum JVM file IO, monitor entry, monitor wait, and thread park duration; clamped to 1–1000 ms. Generation stages have no duration threshold |

The JFR recording uses 30-second and 64-MiB retention limits. It records selected event types without stack traces. Published summaries contain no file paths or peer addresses. Reducing the slow-event threshold produces more events. Unsupported event types remain unavailable. See [Samplers & Metrics](/react/10-samplers-metrics#jfr-event-summaries) for units and coverage.

## Event instrumentation

`core/event.toml` controls how React measures event-handler time. While instrumentation is installed, React wraps every registered Bukkit listener and feeds `event-time`, `events-listeners`, `event-handles-per-tick`, the `plugin-<name>` cost samplers, and the plugin event impact maps.

| Key | Default | Purpose |
|---|---:|---|
| `instrumentation` | `ON_DEMAND` | `ON_DEMAND` installs the wrappers only while something reads event data; `ALWAYS` keeps them installed for continuous plugin-cost history; `DUTY_CYCLE` behaves like `ON_DEMAND` and additionally opens a measurement window every period |
| `samplerActivityWindowMS` | `15000` | Time after the last event-data read before `ON_DEMAND` and `DUTY_CYCLE` remove the wrappers |
| `dutyCycleOnMS` | `5000` | Length of each periodic measurement window in `DUTY_CYCLE`; limited to the period |
| `dutyCyclePeriodMS` | `60000` | Time between the starts of periodic measurement windows in `DUTY_CYCLE`; at least 1000 ms |

Monitors that display an event sampler, visible map graphs, and visible plugin impact maps read event data. Other readers include PlaceholderAPI and Gloss placeholder lookups, connected React Web sessions, and the live snapshot endpoint. Stored metric history does not count as a reader.

In `ON_DEMAND`, React installs wrappers at the next read and removes them after `samplerActivityWindowMS` passes without a read. React also removes wrappers when it disables or reloads. While nothing reads event data, `ON_DEMAND` adds no event cost. History records gaps for event and plugin-cost samplers during that time.

Set `instrumentation = "ALWAYS"` to record continuous plugin-cost history, including lag spikes while nobody watches the metrics. This adds a small per-handler timing cost to every event.

## React Web

The web console uses the Ascii theme with ruled panels and animated page titles. Use the sun or moon button in the top bar to choose light or dark; the browser remembers this setting. Interface motion follows your operating system’s reduced-motion preference.

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

```none
/react web pair <label> [role=viewer]
```

Roles are `viewer`, `operator`, and `admin`. Treat admin tokens like console access. Revoke unused tokens with `/react web revoke`.

## Language

Use `/react language` (alias `/react languages`) for a personal choice or `/react language server` for the default in `react.toml`. Edit messages directly in `languages/<locale>.toml`; React creates English on startup and preserves existing catalogs. Generated English and repository catalogs include formatting instructions and a comment reference explaining each variable in the catalog's language. See [Localization](/react/13-localization).

## Uninstalling

React keeps its configuration, metric history, React Web pairings, and per-player settings in `plugins/React/`. Mob stacks leave state on entities in your worlds, so let React expand them before you remove it. React restores the AI and awareness it disabled before entities unload and during normal shutdown, preserving states that were already disabled.

> Deleting `plugins/React/` erases saved metric history, incident records, and React Web pairings. Copy `history/` and `diagnostics/profiles/` first if you want to keep them.
{.is-warning}

### Before removing the jar

1. Set `enabled = false` in these files under `plugins/React/feature/`. Each change applies on save.

| File | Effect |
|---|---|
| `mob-stacking.toml` | Splits loaded stacks back into separate mobs |
| `adaptive-entity-sleep.toml` | Wakes the mobs this feature paused or put to sleep |
| `dynamic-activation-range.toml` | Wakes the mobs this feature paused |
| `random-tick-governor.toml` | Restores each world's random tick speed |

2. Keep React running while players visit the areas they use. React does not force chunks to load. Stacks in unloaded chunks expand when their chunk next loads with React installed. Saved pause and sleep markers from an interrupted shutdown are also cleared as their entities load.
3. In every browser that paired with this server, open React Web **Settings** and **Remove** the server. React Web keeps server profiles and credentials in the browser.

### Remove React

1. Stop the server and delete `React v<version> [CraftBukkit] 26.1.2-26.3.jar` from `plugins/`. React has no proxy plugin or client mod.
2. Delete `plugins/React/`. It holds the configuration, language files and per-player language choices, metric history, incident records, per-player settings, the React Web server identity and tokens in `web/`, captured profiles, benchmark results, diagnostic reports, the runtime cache, and downloaded libraries.
3. Remove `%react_…%` placeholders from other plugins' configuration. Without React, PlaceholderAPI leaves them unreplaced.
4. Leave `plugins/bStats/` in place unless no remaining plugin on the server uses bStats. That folder is shared.

### What remains

| Leftover | Without React |
|---|---|
| Mob stacks (`react:react-stack-count`) | Each stack is one mob, and the rest of its count is gone. A stack label React applied stays as the mob's name |
| Pause markers (`react:react-paused`) saved during an interrupted shutdown | AI remains disabled if React cannot restore the entity before removal. Use the first command below |
| Sleep markers (`react:react-dozing`) saved during an interrupted shutdown | Awareness remains disabled if React cannot restore the entity before removal. Use the second command below |
| Purge countdown names (`react:react-killer-countdown`) | The countdown stays as the mob's name. Use the third command below |
| React map items, including copies in item frames | Ordinary filled maps that no longer show React data. Discard them |
| Dropped-item bundles with the lore `REACT SUPER STACK` | Ordinary bundles that hold the merged items. Pick them up and empty them like any bundle |
| `minecraft:random_tick_speed` game rule | React restores it when the governor turns off or the server stops normally. If the server stopped abnormally while the governor was engaged, the reduced value stays saved in that world; set it back to your value. The vanilla default is `3` |
| Other data under the `react` namespace on entities, such as entity protection claims | Inert. The server keeps it, but nothing reads it |

These commands repair mobs that are loaded when you run them:

```none
/execute as @e[nbt={BukkitValues:{"react:react-paused":1b}}] run data merge entity @s {NoAI:0b}
/execute as @e[nbt={BukkitValues:{"react:react-dozing":1b}}] run data merge entity @s {"Bukkit.Aware":1b}
/execute as @e[nbt={BukkitValues:{"react:react-killer-countdown":0b}}] run data remove entity @s CustomName
```

### Starting fresh

1. Stop the server.
2. Delete `plugins/React/`.
3. Start the server with the React jar in `plugins/`. React creates default configuration and a new React Web server identity.
4. Remove the old server from React Web and pair again with `/react web pair <label> [role=viewer]`.

Entity leftovers listed under What remains stay in the world. A reinstalled React reads stored stack counts again and, with `mob-stacking` disabled, splits those stacks as their chunks load.
