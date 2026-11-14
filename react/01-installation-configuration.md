---
title: "Installation & Configuration"
description: "Install React, configure automatic reloads, connect React Web, and uninstall React"
published: true
date: 2026-11-05T00:00:00.000Z
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
| `languages/en_US.toml` | Complete editable English catalog, created on startup if missing and merged with new messages after a React update |
| `languages/<locale>.toml` | Editable repository catalog, downloaded when selected if missing, or a custom language |
| `languages/.upstream/` | Pristine repository copies and check state React uses to merge translation updates; managed by React, not for editing |
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

React watches configuration and language files whenever the plugin is enabled. Save changes to apply them automatically, including feature, tweak, action, sampler, global, and web settings. Invalid configuration files leave the previous working settings active. React's own translation updates and the `languages/.upstream/` directory are not treated as file edits. Language catalogs use the per-message and file-level fallback rules in [Localization](/react/13-localization).

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

The sidebar lists the open server's pages in three groups: **Monitor** (Overview, Performance, Activity, Map, Incidents), **Operate** (Console, Actions) and **Configure** (Tuning, Plugins). Below them, **Home**, **Servers**, **Alerts** and **Settings** cover every paired server. The switcher at the top of the sidebar picks a server, **All servers** or **Pair a server**. On a phone the sidebar opens from the menu button in the top bar.

React Web opens on **Home**. It leads with **Continue**: each paired server once, with its state (**Online**, **Checking**, **Not reachable** or **Pairing ended**), its players, TPS and open incidents, **Open**, which goes to the server's Overview, and a **...** menu with **Forget server**. When a server's live connection drops, its row says **Checking** and keeps its last players, TPS and incidents, dimmed, until the server answers again; one unanswered check makes it **Not reachable**. Right after a restart, while the server has not measured TPS yet, the row keeps the earlier numbers dimmed. Below the list are the **Pairing link** field and the command that makes a link, with a copy button. With nothing paired, Home holds only those two.

A server's state reads the same everywhere: **Online**, **Checking** or **Not reachable** for the connection (beside each page title, in the server switcher and on Home), and **Healthy**, **Warning** or **Critical** for how it runs.

The **...** menu in the top bar switches between light and dark, between Simple and Advanced, and the language; the browser remembers each choice. Simple shows what most owners need: **Performance** shows TPS and tick time, and memory in use of the heap's maximum; under **Tuning** the features and the tweaks come grouped by category, each group closed until opened or matched by the search, and **Worlds** lists each world and its state; **Settings** > **Alerts** holds the TPS and tick time thresholds. Advanced adds the **Metrics** page, the internals and events tabs of **Performance** with the collector and spike readings, the tick time percentiles, the view fields on the **Map**, the flat feature and tweak lists with each item's settings under **Tuning**, each world's tick budgets, and every alert threshold. Simple keeps the values it does not show. Interface motion follows your operating system's reduced-motion preference.

A server's **Overview** answers whether it is healthy. Its first line says **Healthy**, **Warning** or **Critical** and names the readings past their thresholds (the thresholds under **Settings** > **Alerts**); then come TPS, tick time, players and memory (of the heap's maximum), the incident score with the open alerts beside the tick time chart, and a few quick actions. Every page, tile and table uses these same thresholds and the same states (Healthy, Warning, Critical, and Not reachable for a server that does not answer). When a server's pairing ends, its pages keep only their title and say since when there is no data. Charts start their scale at zero, or keep a minimum span when the values sit far from zero, so a small wobble does not look like a climb; a reading that does not move shows its value instead of a flat line. Tab to a chart and use the arrow keys to read each sample. The charts on **Overview** and **Performance** switch between **Live**, **1h**, **6h** and **24h**; see [Samplers & Metrics](/react/10-samplers-metrics).

### Pairing

Pairing gives one browser a token for one server. Run on the server, in game or from the console:

```none
/react web pair [label=] [role=viewer|operator|admin] [scopes=a,b] [expires=7d]
```

In game the reply is one line, "Link ready. Open it within 10 minutes", with **[Open React Web]**, which opens the link, **[Copy]**, which copies it, and **[Revoke]**, which puts the revoke command in your chat box; revoking before the link is opened cancels it. The console prints the link itself and a second line with the scopes, lifetime and token id. Open the link within 10 minutes; it works once. React Web's own console never shows the link's code. If a browser cannot use the link (its address is not in `allowedOrigins`, or the link expired), the player who made the link gets a chat line saying so and the server log says it once.

The link opens one card with the server's name (`serverName` in `web.toml`, else the first line of the MOTD, else the server folder name), "Link works until HH:MM, once." and what React Web may do there, with the link's role. **Browser name** is how `/react web tokens` lists this browser. **Remember this browser** is on by default: every tab of this browser stays paired until the pairing ends or you **Forget server**. Turn it off on a shared computer; the pairing then ends with the tab. **Pair** exchanges the link for a token, and **Cancel** leaves without pairing. In Advanced, **Details** shows the fingerprint (check it matches `/react web status`), the direct and relay addresses and the link name. React Web removes the link's code from the address bar once it has read it. A link can also be pasted into **Pairing link** on the start page, or into the dialog that **Pair a server** opens.

A pairing lasts as long as it is used: it ends after `tokenDays` (7 days) without use, or the `expires=` time without use. Each request and each open live view counts as use. Tokens, the server identity and its fingerprint survive restarts; a link not opened yet does not.

When pairing fails, the card says what happened in one sentence and the next step:

- The link was already used, expired, was revoked or is not a pairing link: run `/react web pair` again and paste the new link into **New link**.
- The server does not accept React Web's address: add the page's origin to `allowedOrigins` in `plugins/React/web.toml`, then press **Pair** again.
- The server did not answer: check that it is running, then press **Pair** again.
- The browser blocked the connection to your server, as it can when an `https` page reaches a local or LAN address: allow local network access for the site in the browser's site settings, then press **Pair** again.
- A different server answered (run pair again on the server you want), or the server is busy (wait a few seconds).

When the pairing is three days or less from its end, its row on Home says "Pairing ends in n days unless used.", counted to the nearest day, and in hours (`h`) on its last day. When the server revokes the token or it expires, the server's pages and its row on Home say "Pairing ended." with a **New link** field and **Pair**; the new link pairs the same entry again, keeping its name and tags. Pairing a server that is already listed works the same way: each server is listed once.

| Option | Default | Meaning |
|---|---|---|
| `label=` | None | A name shown in `/react web tokens` |
| `role=` | `operator` | `viewer` reads, `operator` also switches features, tweaks and safe actions, `admin` can do everything including the console |
| `scopes=` | `read,op:execute` | What the token may do, instead of a role; list `read` and any of `op:execute`, `admin`, `console:read`, `console:execute` |
| `expires=` | `tokenDays` from `web.toml` (7 days) | How long the pairing lasts without use, as a number with `d`, `h` or `m`, such as `12h`. Each use starts it again |

Treat an admin pairing like console access. See [commands](/react/02-commands-permissions#react-web-w) for what each scope allows.

### Managing tokens

| Command | Effect |
|---|---|
| `/react web status` | State, listener address, relay, tokens, open links and sockets, then the fingerprint |
| `/react web tokens` | Each token's id, label, role or scopes, expiry, last use, the browser it paired from and its open sockets |
| `/react web revoke <token>` | Revoke a token, or `all`. Its live views close at once and its next request is refused. A link not opened yet is cancelled the same way |

**Forget server**, in a server's **...** menu on Home, asks before it removes the server and its token from this browser. The server keeps the token until it is revoked or expires; the question names the `/react web revoke` command that ends it sooner.

### Connecting the server

React Web reaches a server in one of two ways, and a pairing link carries each one that is on. React Web uses the direct listener when it answers, else the relay, and switches when one drops. After the direct listener drops, React Web tries it again after 1, 2 and then every 5 seconds for a minute, then every 15 seconds, and moves back to it as soon as it answers. After a server restart, an open page is live again within a quarter of a second of the server answering.

**Direct listener.** The server listens on port `9696`. A browser accepts a plain `http://` address only for `127.0.0.1` or `localhost`, so a direct connection from another machine needs HTTPS: put a TLS proxy in front of the listener and set `advertisedUrl` to its public `https://` address. Only pages from `allowedOrigins` may use the listener; by default that is the hosted React Web. A page from another origin is refused, and React Web names the setting to change.

**Relay.** The server opens an outbound connection to a relay, so no port has to be opened and it works behind NAT. Set `relayEnabled = true` and `relayUrl` to a relay you run (`react-web/relay` in the React repository). The connection opens at the first `/react web pair`, not before, so a server nobody paired makes no outbound connection; after that it opens at every start while a pairing exists, and `/react web status` shows `relay waits for the first pairing` until then. When the relay restarts, the server is back on it within a quarter of a second of the relay coming up, for outages up to about 45 seconds. The server signs a random challenge from React Web with its key, so React Web can check that the relay reached the server it paired with. The relay operator can still read the requests it forwards.

`web.toml` applies when it is saved. Existing live connections close during reconfiguration and clients reconnect; tokens and the server identity are kept. Invalid input or a failed reconfiguration restores the previous working configuration and reports the failure in the server console.

| Key | Default | Purpose |
|---|---:|---|
| `listenerEnabled` | `true` | Enable direct HTTP and WebSocket access |
| `listenAddress` | `::` | Listening interface; use `0.0.0.0` when IPv6 is unavailable |
| `port` | `9696` | Preferred port |
| `advertisedUrl` | empty | Public direct address a pairing link carries |
| `allowedOrigins` | the hosted React Web | Browser origins that may use the listener: `scheme://host[:port]`, plain `http` only on loopback |
| `appUrl` | `https://react.volmitsoftware.com` | The React Web that pairing links open |
| `serverName` | empty | Name React Web shows; empty uses the MOTD, else the server folder name |
| `tokenDays` | `7` | Days a pairing lasts without use |
| `requireTokenForReads` | `true` | Require authentication for read endpoints |
| `relayEnabled` | `false` | Also connect out to a relay |
| `relayUrl` | empty | Relay `wss://` URL |

React's direct listener is HTTP only. An older `web.toml` with `corsOrigins` moves its entries to `allowedOrigins` once; entries it does not accept are dropped and logged. Pairings made with the old pasted codes no longer work: React removes them at the first start and logs it. React Web lists such a server as **Pairing ended** with a **New link** field, and each browser pairs again.

**Servers** shows how many servers are healthy, the worst TPS and tick time, the players online, the servers that need attention (any server that is not Healthy; the list is there only when one is), and a table of every server with its state, players, TPS and open alerts (Advanced adds each token's role and transport). Its **Compare** tab ranks one metric across servers, best first; for tick time, memory, incident score, GC time and ping the lowest value ranks first, and servers that read the same share a rank. **Alerts** lists the open alerts of every server, with filters for severity and server; a row opens that server's Incidents page.

**Settings** has three tabs: **General** (theme, language, Simple or Advanced), **Servers** (names and tags under **Edit**, **Remove** in each row's **...** menu, and in Advanced mode each token's role as the server reports it, with what it allows behind its (i), plus import, export and Remove all) and **Alerts** (the thresholds at which alerts open). Everything there is kept in the browser.

## Language

Use `/react language` (alias `/react languages`) for a personal choice or `/react language server` for the default in `react.toml`. Edit messages directly in `languages/<locale>.toml`; React creates English on startup and preserves existing catalogs. Generated English and repository catalogs include formatting instructions and a comment reference explaining each variable in the catalog's language. Run `/react language update` to merge the latest repository translations into installed catalogs. See [Localization](/react/13-localization).

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
3. Run `/react web revoke all`, then in every browser that paired with this server use **Forget server** in the server's **...** menu on the start page. React Web keeps server profiles and tokens in the browser.

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
| React map items, including copies in item frames | Ordinary filled maps. They do not show React data. Discard them |
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
4. Use **Forget server** for the old server in React Web and pair again with `/react web pair`.

Entity leftovers listed under What remains stay in the world. A reinstalled React reads stored stack counts again and, with `mob-stacking` disabled, splits those stacks as their chunks load.
