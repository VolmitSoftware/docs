---
title: "Velocity Proxy"
description: "Manage network tablists, scoreboards, and server-list MOTD on Velocity"
published: true
date: 2026-09-15T21:59:30.000Z
tags: "gloss, velocity"
editor: markdown
dateCreated: 2026-09-15T21:20:00.000Z
---

Gloss on Velocity provides network tablists, scoreboard sidebars, and server-list MOTD management. The same Gloss jar runs on Bukkit servers and Velocity proxies. These proxy features do not require Gloss on backend servers.

## Install

Requirements: Java 25, Velocity 3.4 or newer, and the Velocity edition of PacketEvents 2.13.0. Proxy scoreboards require Minecraft clients 1.20.3 or newer.

1. Put `Gloss-<version>.jar` in the proxy's `plugins/` directory.
2. Put the PacketEvents 2.13.0 Velocity jar in the same directory.
3. Start the proxy.
4. Edit the generated files under `plugins/gloss/`.
5. Run `/gloss reload` from the proxy console or an account with `gloss.admin`.

On Velocity, Gloss enables only these three features. Fixed virtual tablist grids are not part of the proxy edition. Holograms, menus, chat effects, Vault groups, backend placeholders, and the web editor require the server edition.

## Backend feature ownership

Install the same jar on backend servers to use holograms, menus, and other server features. With Velocity modern forwarding enabled on Paper or Folia, Gloss automatically uses the existing forwarding secret to authenticate feature ownership. Backend tablists and scoreboards stop for each connected player when the proxy enables those features. Backend MOTD decoration stops while at least one connected player carries an active proxy MOTD lease. Other backend features remain enabled, and Gloss does not rewrite the backend configuration.

The backend console reports which features are suspended by Velocity Gloss and which have returned to the local configuration. Reports appear when the set of owned features changes, including the first authenticated connection and the final release. Routine heartbeat renewals and additional players do not repeat the message.

The proxy claims features through the switches in `proxy.json`. A hidden or conditionally absent proxy board still owns the scoreboard feature. Disabling a proxy feature and running `/gloss reload` releases it to the backend on the next handshake, normally within five seconds. If handshakes stop, backend ownership expires after about fifteen seconds. Backend MOTD remains local before the first authenticated connection and after the last player leaves; external clients still receive the proxy MOTD when pinging the proxy.

For servers without Paper modern forwarding, place an identical `proxy-ownership.key` file containing at least 32 bytes of random secret data in the proxy and backend Gloss data directories. This file overrides the forwarding secret. Restart both installations after changing it. Never share this file with players. Without a shared key, automatic backend suppression is unavailable. Keep server clocks synchronized for the authenticated handshake.

## Files and settings

| File | Schema | Purpose |
|---|---|---|
| `proxy.json` | 1 | Feature switches, update interval, network tablist scope |
| `motd.json` | 1 | Server-list messages and ping fields |
| `tablist.json` | 2 | Headers, footers, player names, and sorting |
| `boards/*.json` | 2 | Conditional scoreboard sidebars |
| `images/` | None | MOTD icons referenced by filename |

Gloss creates missing default files at startup. It does not watch files for changes. Run `/gloss reload` after edits, including icon changes. A failed reload retains the previous configuration and reports the error in the proxy log.

Default `proxy.json`:

```json
{
  "schemaVersion": 1,
  "motd": { "enabled": true },
  "tablist": { "enabled": true },
  "scoreboards": { "enabled": true },
  "refreshMillis": 500,
  "networkTablist": true
}
```

`refreshMillis` controls tablist and scoreboard updates. Gloss clamps it to 50 to 60000 milliseconds. MOTD rendering occurs on each server-list ping.

Tablist sorting uses native list order and requires Minecraft clients 1.21.2 or newer.

Set `networkTablist` to `true` to include connected players across the proxy. With `false`, Gloss formats existing entries for players on the viewer's backend.

## Text and conditions

Text supports legacy `&` colors, `§` colors, `[RRGGBB]` colors, tokens, and `{{ expression }}` values.

| Token | Value |
|---|---|
| `$player` | Subject username |
| `$server` | Subject's backend name |
| `$ping` | Subject latency in milliseconds |
| `$online` | Connected proxy player count |
| `$max` | Velocity's configured displayed maximum player count |

Expression player roles are `viewer`, `subject`, and `player`. `player` refers to the subject. Each role exposes `present`, `name`, `uuid`, `ping`, and `server`.

Global variables are `server.online`, `server.maxPlayers`, `time.ms`, `time.seconds`, and `time.ticks`. Conditions can use `hasPermission('permission')` or `hasPermission('viewer', 'permission')` with proxy permissions. String checks include `contains`, `startsWith`, `endsWith`, and `oneOf`.

Tablist names evaluate the listed player as the subject. Headers, footers, and scoreboards use the viewer as the subject. MOTD expressions have no player context.

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

## MOTD

Gloss randomly selects one entry for each ping. Each entry requires one or two description lines.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "show": true,
  "entries": [
    {
      "lines": ["&dExample Network", "&7$online players online"],
      "favicon": "network.png",
      "sample": ["Visit our lobby", "Explore our worlds"],
      "online": "$online",
      "max": "$max",
      "version": "Example Network"
    }
  ]
}
```

Put the 64×64 PNG icon at `plugins/gloss/images/network.png`. Icon paths must stay within `images/`. Icons load at startup or reload.

`sample` accepts up to twelve hover lines. `online` and `max` accept numeric text or text expressions. Counts clamp to nonnegative integers. `version` changes the displayed version name and preserves the protocol number.

Omitted optional fields retain the proxy's existing ping values. An empty `sample` also retains the existing sample. When MOTD is disabled, Gloss leaves the proxy response unchanged.

## Commands

| Command | Access | Result |
|---|---|---|
| `/gloss reload` | `gloss.admin` | Reload all proxy documents and icons |
| `/gloss board toggle` | Any connected player | Hide or show that player's proxy sidebar |

The toggle lasts until the player disconnects. The proxy does not expose the server edition's `/board`, `/hologram`, or web editor commands.

## Troubleshooting

If Gloss fails to start, check the proxy log for missing PacketEvents or invalid documents. If a reload fails, correct the reported document and repeat `/gloss reload`.

If no board appears, check the client version, feature switch, `show`, and `select.when`. Check conditions against proxy values, especially backend names and proxy permissions.

Use one tablist owner for consistent results. Other proxy or backend plugins can change the same list entries, headers, and footers.
