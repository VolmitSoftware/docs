---
title: "Velocity Proxy"
description: "Manage network tablists, scoreboards, server-list MOTD, screen surfaces, and connection messages on Velocity"
published: true
date: 2026-09-18T00:00:00.000Z
tags: "gloss, velocity"
editor: markdown
dateCreated: 2026-09-15T21:20:00.000Z
---

Gloss on Velocity provides network tablists, scoreboard sidebars, server-list MOTD with pause-menu server links, action bar, boss bar, and title surfaces, and network connection messages. The same Gloss jar runs on Bukkit servers and Velocity proxies. These proxy features do not require Gloss on backend servers.

## Install

Requirements: Java 25 and Velocity 3.4 or newer. Proxy scoreboards require Minecraft clients 1.20.3 or newer. Pause-menu server links require 1.21 or newer.

1. Put `Gloss-<version>.jar` in the proxy's `plugins/` directory.
2. Start the proxy.
3. Edit the generated files under `plugins/gloss/`.
4. Run `/gloss reload` from the proxy console or an account with `gloss.admin`.

Gloss loads PacketEvents itself on first start and stores it under `plugins/gloss/libraries/`. Install a PacketEvents plugin only when another proxy plugin requires that plugin.

The proxy edition covers the server-list MOTD and its pause-menu links, network tablists, conditional scoreboard sidebars, action bar, boss bar, and title surfaces, and join, switch, and leave messages. The shared emoji and named-animation catalogs render inside all of them. Fixed virtual tablist grids are not part of the proxy edition. Holograms, menus, chat effects, Vault groups, backend placeholders, and the web editor require the server edition.

## Backend feature ownership

Install the same jar on backend servers to use holograms, menus, and other server features. With Velocity modern forwarding enabled on Paper or Folia, Gloss automatically uses the existing forwarding secret to authenticate feature ownership. Tablists, scoreboards, and surfaces are owned one player at a time: each of those backend features stops for a connected player as soon as the proxy owns it for them. A player whose surfaces the proxy owns has the backend action bar, boss bar, and title cleared once, and the backend stops its surface sweep for that player. The MOTD and connection messages are owned server-wide instead: backend MOTD decoration and the backend's own pause-menu server links stop while at least one connected player carries an active proxy MOTD lease, and a backend under the connection-messages claim stops announcing its own joins and leaves. Other backend features remain enabled, and Gloss does not rewrite the backend configuration.

The backend console reports which features are suspended by Velocity Gloss and which have returned to the local configuration. Reports appear when the set of owned features changes, including the first authenticated connection and the final release. Routine heartbeat renewals and additional players do not repeat the message.

The proxy claims features through the switches in `proxy.json`. A hidden or conditionally absent proxy board still owns the scoreboard feature, and a surface switch with no document currently selected still owns surfaces. Disabling a proxy feature and running `/gloss reload` releases it to the backend on the next handshake, normally within five seconds. If handshakes stop, backend ownership expires after about fifteen seconds. Backend MOTD remains local before the first authenticated connection and after the last player leaves; external clients still receive the proxy MOTD when pinging the proxy.

For servers without Paper modern forwarding, place an identical `proxy-ownership.key` file containing at least 32 bytes of random secret data in the proxy and backend Gloss data directories. This file overrides the forwarding secret. Restart both installations after changing it. Never share this file with players. Without a shared key, automatic backend suppression is unavailable. Keep server clocks synchronized for the authenticated handshake.

## Files and settings

| File | Schema | Purpose |
|---|---|---|
| `proxy.json` | 1 | Feature switches, update interval, network tablist scope |
| `motd.json` | 1 | Server-list messages, ping fields, pause-menu links, and the default icon |
| `tablist.json` | 2 | Headers, footers, player names, and sorting |
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
  "surfaces": { "enabled": true },
  "connections": { "enabled": true },
  "emoji": { "enabled": true },
  "animations": { "enabled": true },
  "refreshMillis": 500,
  "networkTablist": true
}
```

Every switch defaults to on. `connections` gates the join, switch, and leave messages. `refreshMillis` controls tablist, scoreboard, and surface updates. Gloss clamps it to 50 to 60000 milliseconds. MOTD rendering occurs on each server-list ping.

Tablist sorting uses native list order and requires Minecraft clients 1.21.2 or newer.

Set `networkTablist` to `true` to include connected players across the proxy. With `false`, Gloss formats existing entries for players on the viewer's backend.

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

Expression player roles are `viewer`, `subject`, and `player`. `player` refers to the subject. Each role exposes `present`, `name`, `uuid`, `ping`, and `server`.

Global variables are `server.online`, `server.maxPlayers`, `time.ms`, `time.seconds`, `time.ticks`, `connection.from`, and `connection.to`. The last two carry the same backend names as `$from` and `$to`. Only these names parse. An expression naming a backend value such as `viewer.world` is rejected when the document loads. Conditions can use `hasPermission('permission')` or `hasPermission('viewer', 'permission')` with proxy permissions. String checks include `contains`, `startsWith`, `endsWith`, and `oneOf`.

Tablist names evaluate the listed player as the subject. Headers, footers, scoreboards, and surfaces use the viewer as the subject. Connection messages use the connecting player as the subject and the recipient as the viewer. MOTD expressions have no player context.

PlaceholderAPI, Vault groups, health, world, and economy values are unavailable on the proxy. Backend Gloss does not supply these values to the proxy.

## Tablist

Use schema 2 with `show`, `headerFooter`, `listNames`, and `sort`:

```json
{
  "schemaVersion": 2,
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

`progress` takes a bare expression or a `{{ ... }}` block. An expression that throws is logged once for that surface and treated as empty.

Per viewer, each surface kind selects the matching document with the highest `select.priority` whose `show` and `select.when` are both true. Equal priorities use filename order. The first variant in descending priority order whose `when` is true then replaces the base presentation.

Expressions here see the proxy variable set only. A document naming a backend value such as `viewer.world` is rejected when it loads.

`slots`, the HUD `priority` name, and `ttlTicks` are accepted and ignored, so a server-edition file loads unchanged. Each viewer gets at most one boss bar, updated in place instead of resent.

`refreshMillis` bounds the timing. The action bar is resent on every refresh tick; a refresh much above 2000 milliseconds lets it blink out between sends. Title `fadeInTicks`, `stayTicks`, and `fadeOutTicks` are sent as configured, but the moment a title first shows, or a `repeat` trigger fires again, is quantized to `refreshMillis`.

Boss bars and action bars clear when their document stops being selected and when `surfaces` is off. Titles are never force-cleared; they run out their own timing. A `once` trigger fires a single time per document for as long as the player stays connected, and `/gloss reload` does not re-arm it. A backend switch hides the boss bar and shows it again on the next refresh.

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

Both `show` gates are evaluated once, for the connecting player. The text is then rendered once per recipient with that player as the subject, so `$player` and `$server` name them. `$to` names the backend being entered, on a join and on a switch; `$from` names the backend being left, on a switch and on a leave. A leaving player no longer reports a backend, so write `$from` rather than `$server` in a `leave` line. Gloss remembers each player's backend on join and on every switch, which is what a `leave` line and a `server` audience read once the player is gone.

The subject receives their own join and switch lines, and never their own leave. A leave is announced only for a connection whose login completed, so a kicked, cancelled, or conflicting login is never announced.

The proxy claims connection messages server-wide on every backend running Gloss. While the claim is live, a backend clears its own vanilla join and quit lines and announces nothing. That claim is a per-player lease that arrives one handshake after a player joins, so a backend that has already seen it holds a join line for up to three seconds instead of racing it. The first join after a backend restart is announced immediately, so that one join can show both the backend's line and this one. See [Connection Messages](/gloss/26-connection-messages).

## Emoji and animations

The proxy reads `emoji/` and `animations/` in its data directory. Both folders are seeded with the server edition's documents in the same schema-1 shape. The file name without `.json` is the id, and documents with another schema version are skipped.

| Folder | Keys |
|---|---|
| `emoji/` | `trigger`, `emoji` in `U+XXXX;` notation, `enabled`, `show` |
| `animations/` | `mode`, `frameIntervalMs` clamped to 1 to 60000, `frames`, `show` |

Everywhere proxy text renders, `:id:` tokens and any non-empty `trigger` expand to the emoji, and `|animation.<id>|` expands to the clip's current frame. That covers MOTD lines and sample, tablist header, footer and list names, scoreboard titles and lines, surface text, connection messages, and link labels.

`show` on the proxy is a proxy expression, evaluated for the viewer the text is being rendered for. A hidden emoji leaves its token or trigger as written. A hidden animation renders as an empty string. An unknown animation id, a `|metric.<key>|` token, and a catalog turned off in `proxy.json` all leave the token exactly as written.

Frames advance on wall-clock time. `refreshMillis` bounds the visible frame rate for tablists, scoreboards, and surfaces; the MOTD renders fresh on each ping.

Emoji that point at a Gloss glyph-font codepoint render as tofu on the proxy, because the proxy serves no resource pack. Use codepoints the vanilla font carries.

Set `"emoji": { "enabled": false }` or `"animations": { "enabled": false }` in `proxy.json` to turn a catalog off.

## MOTD

Gloss randomly selects one entry for each ping. Each entry requires one or two description lines.

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

Omitted optional fields retain the proxy's existing ping values. An empty `sample` also retains the existing sample. When MOTD is disabled, Gloss leaves the proxy response unchanged.

### Server links

`links` is an optional top-level array in `motd.json` that becomes the client's pause-menu server-link list. It accepts up to sixteen entries. Each entry needs a `url` and either a `type` or a `label`.

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

Gloss sends the list after every backend connection, on join and on each switch, so the proxy's list is the last one the client received. Nothing is sent when `motd` is off, the MOTD `show` is false, `links` is empty, or the client is older than 1.21.

## Commands

| Command | Access | Result |
|---|---|---|
| `/gloss reload` | `gloss.admin` | Reload all proxy documents and icons |
| `/gloss board toggle` | Any connected player | Hide or show that player's proxy sidebar |

The toggle lasts until the player disconnects. The proxy does not expose the server edition's `/board`, `/hologram`, or web editor commands.

## Troubleshooting

If Gloss fails to start, check the proxy log for library download errors or invalid documents. If a reload fails, correct the reported document and repeat `/gloss reload`.

If no board appears, check the client version, feature switch, `show`, and `select.when`. Check conditions against proxy values, especially backend names and proxy permissions.

If no surface appears, check `select.when` first. It defaults to `false`, so a document without a condition never selects.

An emoji that renders as a blank box points at a resource-pack codepoint. The proxy serves no resource pack.

Use one tablist owner for consistent results. Other proxy or backend plugins can change the same list entries, headers, and footers.
