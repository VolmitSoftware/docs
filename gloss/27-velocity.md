---
title: "Velocity Proxy"
description: "Manage network tablists, scoreboards, server-list MOTD, screen surfaces, and connection messages on Velocity"
published: true
date: 2026-10-07T00:00:00.000Z
tags: "gloss, velocity"
editor: markdown
dateCreated: 2026-09-15T21:20:00.000Z
---

Gloss on Velocity provides network tablists, scoreboard sidebars, server-list MOTD with pause-menu server links, action bar, boss bar, and title surfaces, and network connection messages. The same Gloss jar runs on Bukkit servers and Velocity proxies. These proxy features do not require Gloss on backend servers.

## Install

| | |
|---|---|
| Proxy | Velocity 3.4 or newer |
| Java | 25 |
| Jar | `Gloss-<version>-packed.jar` in the proxy `plugins/` folder |
| Files | `plugins/gloss/` |
| Clients | Scoreboards need 1.20.3 or newer. Pause-menu server links need 1.21 or newer |

Reload with `/gloss reload` (`gloss.admin`). An XZ jar extracts `plugins/Gloss/cache/runtime/`, separate from the lowercase `plugins/gloss/` settings folder. That cache directory must be writable. PacketEvents is bundled in Gloss and does not require a separate plugin or startup download.

The proxy edition covers the server-list MOTD and its pause-menu links, network tablists, conditional scoreboard sidebars, action bar, boss bar, and title surfaces, and join, switch, and leave messages. The shared emoji and named-animation catalogs render inside all of them. Fixed virtual tablist grids use the same schema as the server edition. Holograms, menus, chat effects, Vault groups, backend placeholders, and the web editor require the server edition.

## Backend feature ownership

Install the same Gloss release on the proxy and backend servers. Update both sides together so their feature-ownership protocol supports the same claims.

**Proxy settings win.** A feature enabled on the proxy turns off on the backend: tablists,
scoreboards, and surfaces switch off per player; MOTD, pause-menu links, and connection messages switch off independently for the
whole server. Everything else on the backend keeps running, and Gloss never rewrites the backend
configuration. The backend console reports what the proxy has taken over and what it has handed back.

Turn a proxy feature off in `proxy.json` and run `/gloss reload` to give it back to the backend.

On Paper or Folia with Velocity modern forwarding this works with no setup. Without it, put an
identical `proxy-ownership.key` of at least 32 random bytes in both data folders, restart both, and
keep the clocks in sync. Never share that file.

## Files and settings

| File | Schema | Purpose |
|---|---|---|
| `proxy.json` | 1 | Feature switches, update interval, network tablist scope |
| `motd.json` | 1 | Server-list messages, ping fields, pause-menu links, and the default icon |
| `tablist.json` | 3 | Headers, footers, player names, sorting, and conditional layouts |
| `presets.json` | 1 | Shared defaults and named presets for proxy documents |
| `boards/*.json` | 2 | Conditional scoreboard sidebars |
| `surfaces/*.json` | 1 | Conditional action bar, boss bar, and title surfaces |
| `connections.json` | 1 | Network join, switch, and leave messages |
| `emoji/*.json` | 1 | Emoji replaced in every rendered string |
| `animations/*.json` | 1 | Frame clips used as `\|animation.<id>\|` |
| `images/` | None | MOTD icons referenced by filename from `favicon` |

Gloss creates missing default files at startup. The `surfaces/`, `emoji/`, and `animations/` folders are seeded with the server edition's own documents, so the same ids resolve on both sides of a network. Gloss does not watch files for changes. Run `/gloss reload` after edits, including icon changes. A failed reload retains the previous configuration and reports the error in the proxy log.

Default `proxy.json`:

```json
{
  "schemaVersion": 1,
  "motd": { "enabled": true },
  "tablist": { "enabled": true },
  "scoreboards": { "enabled": true },
  "surfaces": { "enabled": true, "maxBossBarsPerViewer": 3 },
  "connections": { "enabled": true },
  "emoji": { "enabled": true },
  "animations": { "enabled": true },
  "refreshMillis": 500,
  "networkTablist": true,
  "networkVisibility": "true"
}
```

Every switch defaults to on. `connections` gates the join, switch, and leave messages. `refreshMillis` controls tablist, scoreboard, surface, and MOTD snapshot updates. Gloss clamps it to 50 to 60000 milliseconds. Each server-list ping selects an already prepared MOTD response.

Tablist sorting uses native list order and requires Minecraft clients 1.21.2 or newer.

Set `networkTablist` to `true` to include connected players across the proxy. With `false`, Gloss formats existing entries for players on the viewer's backend. `networkVisibility` is a proxy condition evaluated for every viewer/subject pair before adding remote entries or including players in a fixed grid; its default is `"true"`. Ordinary local entries remain controlled by the backend: use the backend vanish integration to hide those rows. For example, `"subject.server == viewer.server || hasPermission('viewer', 'network.roster')"` restricts remote listings to permitted viewers. A local entry absent from the backend list is never recreated, and entries removed or unlisted by another plugin stay hidden.

## Text and conditions

Text supports legacy `&` colors, `§` colors, `[RRGGBB]` colors, tokens, and `{{ expression }}` values. Emoji tokens and `|animation.<id>|` tokens expand as well; see [Emoji and animations](#emoji-and-animations).

| Token | Value |
|---|---|
| `$player` | Subject username |
| `$server` | Subject's backend name |
| `$ping` | Subject latency in milliseconds |
| `$online` | Connected proxy player count |
| `$max` | Velocity's configured displayed maximum player count |
| `$from` | The backend a connection message is leaving. Empty elsewhere |
| `$to` | The backend a connection message is entering. Empty elsewhere |

| Expression name | Value |
|---|---|
| `viewer.*`, `subject.*`, `player.*` | `present`, `name`, `uuid`, `ping`, `server`, `bedrock`, `npc`, `visible`. `player` means the subject |
| `server.online`, `server.maxPlayers` | Proxy player counts |
| `time.ms`, `time.seconds`, `time.ticks` | Server clock |
| `connection.from`, `connection.to` | Same backend names as `$from` and `$to` |

Only these names parse — a backend value such as `viewer.world` is a load error. Conditions can also
use `hasPermission('permission')` or `hasPermission('viewer', 'permission')`, and the string checks
`contains`, `startsWith`, `endsWith` and `oneOf`.

Tablist names evaluate the listed player as the subject. Headers, footers, scoreboards, and surfaces use the viewer as the subject. Connection messages use the connecting player as the subject and the recipient as the viewer. MOTD expressions have no player context.

PlaceholderAPI, Vault groups, health, world, and economy values are unavailable on the proxy. Backend Gloss does not supply these values to the proxy.

## Tablist

Use schema 3 with `show`, `headerFooter`, `listNames`, `sort`, and optional `layout`:

```json
{
  "schemaVersion": 3,
  "revision": 1,
  "show": true,
  "headerFooter": {
    "enabled": true,
    "show": true,
    "presentation": {
      "header": "&d&lExample Network",
      "footer": "&7$online players online"
    },
    "variants": []
  },
  "listNames": {
    "enabled": true,
    "show": true,
    "presentation": { "format": "&7[$server] &f$player" },
    "variants": []
  },
  "sort": { "enabled": false, "weight": "0" }
}
```

Each section can select a full `presentation` from `variants`. Each variant has `priority`, `when`, and `presentation`. The first matching variant in descending priority order wins. Without a match, Gloss uses the base presentation.

Enable sorting to evaluate `weight` as an integer list order for each subject. Client support determines whether the client applies this order.

Fixed layouts require Java 1.21.2 or later; older clients retain their ordinary list. Layouts support the [server tablist fields](/gloss/06-tablist): 1–80 count-derived entries, viewer-aware fixed cells, conditional complete layouts, separate roster sections, numeric/text sort keys, overflow counts, named texture values, and hats on supporting clients. Proxy expressions must use the names listed above. Unknown backend variables reject the document. Player rows use captured proxy profiles and latency; `format` uses proxy tokens, so `$group` and PlaceholderAPI tokens are unavailable.

A named preset or global default is resolved from `presets.json` before a document is validated. Proxy MOTD, tablists, boards, surfaces, connections, emoji, and animations support the same [preset inheritance](/gloss/03-data-files) as the server edition. Reload reads one catalog for all documents and retains the previous configuration if any resolution fails.

### Network visibility integration

Backend-only vanish, NPC metadata, and Bedrock identity are unavailable to Velocity automatically. Without an integration feed, `npc` and `bedrock` are false and `visible` is true; existing tab entries and `networkVisibility` still control remote and fixed-grid inclusion. The visibility feed does not override backend ownership of ordinary local rows. Use a proxy integration to publish complete snapshots when those states change.

Obtain the `GlossVelocity` plugin instance through Velocity's plugin manager, then call `updateTablistVisibility(new ProxyTablistVisibility(hidden, npcs, bedrock))`. `hidden` maps viewer UUIDs to hidden subject UUID sets; `npcs` and `bedrock` are UUID sets. The constructor copies every collection. Each call atomically replaces the prior complete snapshot and applies on subsequent display refreshes. Send an empty set/map to clear a state and remove disconnected identities from the next snapshot. The feed does not grant access to players hidden by another plugin's tab entries.

Publish only already captured data. Read backend entity state on that entity's owning scheduler before transporting it to the proxy; the update method accepts immutable UUID data from any thread and performs no backend reads. It throws `IllegalStateException` if the proxy tablist service is not running. Configure an explicit visibility condition when your integration feed is required for displaying remote players; the proxy cannot determine whether an external feed is complete or current.

## Scoreboards

Each schema-2 document in `boards/` defines a sidebar. Gloss selects the matching board with the highest `select.priority`. Equal priorities use filename order.

```json
{
  "schemaVersion": 2,
  "revision": 1,
  "show": true,
  "select": { "priority": 10, "when": "viewer.server == 'lobby'" },
  "presentation": {
    "title": "&d&lExample Network",
    "lines": [
      "&f$player",
      "&7Server: &f$server",
      { "text": "&7Online", "value": "$online", "format": "fixed" }
    ],
    "hideNumbers": true
  },
  "variants": []
}
```

Boards support up to 15 lines. A line can be a string or an object with `text`, `value`, and `format`.

| Format | Right-hand score display |
|---|---|
| `blank` | Hidden |
| `number` | Numeric row score |
| `fixed` | Rendered `value` text |
| `styled` | Numeric row score with the style from `value` |

A line with `value` and no `format` uses fixed text. Other lines inherit `hideNumbers`. Board variants use the same priority selection as tablist variants and provide a complete presentation.

Gloss restores its sidebar after backend switches. While a Gloss sidebar is active, backend sidebar display packets cannot replace it. Gloss releases the sidebar when hidden or when no board matches.

## Surfaces

Each schema-1 document in `surfaces/` drives one action bar, boss bar, or title. These are the same documents the server edition reads, so one file works on both. The file name without `.json` is the id. Documents with another schema version are skipped. A malformed file fails `/gloss reload` and keeps the previous configuration.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "surface": "bossbar",
  "show": true,
  "select": { "priority": 10, "when": "viewer.server == 'lobby'" },
  "presentation": {
    "title": "&fWelcome, &d$player",
    "progress": "min(1, server.online / 50)",
    "color": "purple",
    "style": "segmented_10"
  },
  "variants": []
}
```

| Key | Notes |
|---|---|
| `surface` | Required. `actionbar`, `bossbar`, or `title` |
| `show` | Boolean or expression. Defaults to `true` |
| `select.priority` | Integer. Defaults to `0` |
| `select.when` | Condition. **Defaults to `false`**, so a document without one never selects |
| `presentation` | Required. Its fields depend on `surface` |
| `variants` | Complete presentations, each with a unique `id`, `priority`, `when`, and `presentation` |

| `surface` | Presentation fields |
|---|---|
| `actionbar` | `text`, required |
| `bossbar` | `title` required. `progress` clamped to 0 – 1, default `1`. `color` one of `pink`, `blue`, `red`, `green`, `yellow`, `purple`, `white`, default `white`. `style` one of `solid`, `segmented_6`, `segmented_10`, `segmented_12`, `segmented_20`, default `solid` |
| `title` | `title` required. `subtitle` default empty. `trigger` one of `select`, `once`, `repeat`, default `select`. `fadeInTicks` default `10`, `stayTicks` default `40`, `fadeOutTicks` default `10`. `repeatTicks` is raised to at least `stayTicks` |

`progress` takes a bare expression or a `{{ ... }}` block.

Per viewer, actionbars and titles each select one matching document; bossbars select independently by root `group` (default `main`). Each selection takes the highest `select.priority` whose `show` and `select.when` are both true. Equal priorities use filename order. The first variant in descending priority order whose `when` is true then replaces the base presentation.

A surface file using events available on both platforms loads unchanged. Proxy actionbars support only the native centered slot: omit `presentation.slots` or use `["center"]`. Other actionbar slot names require the backend compositor and reject loading on Velocity. Raise `refreshMillis` above 2000 and the action bar
blinks between sends; title timing is also quantized to it.

Boss bars and action bars clear when their document stops being selected. Titles run out their own
timing. A `once` trigger fires once per connection, and `/gloss reload` does not re-arm it.

Root `automatic`, `delivery`, `on`, and bossbar `presentation.flags` follow the [screen surface contract](/gloss/06c-screen-surfaces). Proxy `on` supports `join`, `server_change`, and `interval`; backend-only `world_change` rejects the proxy document. `surfaces.maxBossBarsPerViewer` in `proxy.json` defaults to 3 and clamps to 1–64. Groups above the cap are ranked by presentation priority, then group name. Client screen size controls how much of a large stack remains visible.

The included `surfaces/welcome.json` uses `"when": "false"`, so nothing appears until you edit it.

## Connection messages

`connections.json` is a schema-1 document with `join`, `switch`, and `leave` sections, gated by the `connections` switch in `proxy.json`. Gloss seeds it on first start.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "show": true,
  "join": {
    "enabled": true,
    "show": true,
    "audience": "network",
    "presentation": { "text": "&a+ &f$player &7joined the network" },
    "variants": []
  },
  "switch": {
    "enabled": true,
    "show": true,
    "audience": "network",
    "presentation": { "text": "&e> &f$player &7moved to &f$to" },
    "variants": []
  },
  "leave": {
    "enabled": true,
    "show": true,
    "audience": "network",
    "presentation": { "text": "&c- &f$player &7left the network" },
    "variants": []
  }
}
```

| Key | Notes |
|---|---|
| `show` | Document gate. Defaults to `true` |
| `join`, `switch`, `leave` | A section that is present is on unless it carries `"enabled": false`. A section the file leaves out is off |
| `<section>.show` | Section gate. Defaults to `true` |
| `<section>.audience` | `network`, the default, sends to every player on the proxy. `server` sends only to players whose current backend matches the subject's: both sides of a switch, and for a leave the backend the player was last on |
| `<section>.presentation.text` | The line to send |
| `<section>.variants` | `priority`, `when`, and `presentation`, chosen per recipient, so staff-only wording is a variant gated on `hasPermission('viewer', 'gloss.admin')` |

The text renders once per recipient with the connecting player as the subject, so `$player` and `$server` name them. `$to` is the backend being entered, `$from` the one being left.

A leaving player no longer reports a backend — write `$from`, not `$server`, in a `leave` line.

Players see their own join and switch lines but never their own leave, and a login that never completed is never announced.

While the proxy owns connection messages, backends announce nothing of their own. See [Connection Messages](/gloss/26-connection-messages).

## Emoji and animations

The proxy reads `emoji/` and `animations/` in its data directory. Both folders are seeded with the server edition's documents in the same schema-1 shape. The file name without `.json` is the id, and documents with another schema version are skipped.

| Folder | Keys |
|---|---|
| `emoji/` | `trigger`, `emoji` in `U+XXXX;` notation, `enabled`, `show` |
| `animations/` | `mode`, `frameIntervalMs` clamped to 1 to 60000, `frames`, `show` |

`:id:` and `|animation.<id>|` expand anywhere proxy text renders — MOTD, tablist, scoreboards,
surfaces, connection messages, and link labels. A token Gloss cannot resolve is left exactly as
written; a hidden animation renders empty. `refreshMillis` bounds the visible frame rate, and the
MOTD samples an animation frame when its response snapshot refreshes. The client retains that frame until another status request.

> The proxy serves no resource pack, so an emoji pointing at a Gloss glyph-font codepoint renders as
> tofu. Use codepoints the vanilla font carries.
{.is-warning}

Set `"emoji": { "enabled": false }` or `"animations": { "enabled": false }` in `proxy.json` to turn a catalog off.

## MOTD

Gloss selects a prepared entry for each ping. Each entry requires one or two description lines. Text, expressions, and viewerless conditions refresh on the `proxy.json` refresh interval, outside ping handling. Icons load only at startup or reload.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "show": true,
  "favicon": "network.png",
  "entries": [
    {
      "lines": ["&dExample Network", "&7$online players online"],
      "sample": ["Visit our lobby", "Explore our worlds"],
      "online": "$online",
      "max": "$max",
      "version": "Example Network"
    },
    {
      "lines": ["&dExample Network", "&7Event weekend"],
      "favicon": "event.png"
    }
  ]
}
```

The top-level `favicon` is the server-list icon for every entry. An entry's own `favicon` replaces it for that entry. Blank or absent at both levels leaves the proxy's own icon.

Put the 64×64 PNG icon at `plugins/gloss/images/network.png`. Icon paths must stay within `images/`. Icons load at startup or reload. The file must be a real PNG of exactly 64×64 pixels; another format or size fails the reload with a message naming the rule, and the previous configuration stays active.

`sample` accepts up to twelve hover lines. `online` and `max` accept numeric text or text expressions. Counts clamp to nonnegative integers. `version` changes the displayed version name and preserves the protocol number.

Each MOTD entry accepts `show` (boolean or proxy expression, default `true`) and `weight` (integer from `1` to `1000000`, default `1`). The default weighted policy chooses among visible entries in proportion to their weights. With no passing entry, Gloss leaves the existing ping response unchanged. MOTD conditions have no player context.

The backend and proxy share `rotation`, `icons`, `state`, entry `select`, `counts`, and `sampleMode` semantics documented in [Server List MOTD](/gloss/06b-server-list-motd). Hostname and protocol selection uses the current status connection's metadata; state, time windows, and real online counts are sampled at refresh. Selection never authenticates the requester or provides player permissions. Animation tokens yield a still frame in each response, not a continuously animated server-list entry.

Omitted optional fields retain the proxy's existing ping values. `sampleMode: "hide"` clears the hover sample; `counts.hide: true` omits the player-count section. When MOTD is disabled, Gloss leaves the proxy response unchanged.

### Server links

`serverLinks: {"enabled": true, "links": [...]}` in `motd.json` controls pause-menu links independently of status visibility and the MOTD feature toggle. Its list accepts up to sixteen entries. Existing top-level `links` is used when `serverLinks` is absent and follows the MOTD feature toggle and document `show`. Each entry needs a `url` and either a `type` or a `label`.

| Key | Notes |
|---|---|
| `links[].type` | Uses the client's own label. One of `report_bug`, `community_guidelines`, `support`, `status`, `feedback`, `community`, `website`, `forums`, `news`, `announcements`. Case does not matter |
| `links[].label` | A text template used instead of a built-in label. Colors, `$player`, and `{{ expression }}` work, and it renders for each viewer. Used only when `type` is absent |
| `links[].url` | Required. An `http` or `https` address with a host |

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "show": true,
  "entries": [
    { "lines": ["&dExample Network", "&7$online players online"] }
  ],
  "links": [
    { "type": "website", "url": "https://example.net" },
    { "type": "report_bug", "url": "https://example.net/bugs" },
    { "label": "&d$player's stats", "url": "https://example.net/stats/" }
  ]
}
```

An unknown `type`, a url that is not an http or https address with a host, and an entry with neither `type` nor `label` each fail the load, so the previous configuration stays active.

Gloss sends the list after every backend connection and configuration reload, so the proxy's list is the last one the client received. An explicitly enabled empty `serverLinks.links` list clears the client list. Clients older than 1.21 receive no links. Link ownership is claimed independently of status MOTD ownership. Disabling previously published links clears the client list; the backend can then publish its own list when its ownership lease expires.

## Commands

| Command | Access | Result |
|---|---|---|
| `/gloss reload` | `gloss.admin` | Reload all proxy documents and icons |
| `/gloss board toggle` | Any connected player | Hide or show that player's proxy sidebar |

The toggle lasts until the player disconnects. The proxy does not expose `/board`, `/hologram`, or the web editor.

A document with no `select.when` does not select, because that condition defaults to `false`. Conditions use proxy names and proxy permissions. Emoji glyphs need the resource pack on the client. The proxy does not serve one.
