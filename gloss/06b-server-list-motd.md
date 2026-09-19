---
title: "Server List MOTD"
description: "Randomize the message and icon shown in the server list"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Server-list messages live in `plugins/Gloss/motd.json` and reload automatically. Behind a proxy, see [Velocity Proxy](/gloss/27-velocity) — the page below covers the server edition.

`plugins/Gloss/motd.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "favicon": "server.png",
  "entries": [
    { "lines": ["&dA glossy server"] },
    {
      "lines": ["&d&lMy Server", "&7Now with 100% more gloss"],
      "favicon": "event.png",
      "sample": ["&fEvent weekend", "&7Double drops until Sunday"],
      "online": "{{ server.online }}",
      "max": "200",
      "version": "My Server"
    }
  ],
  "links": [
    { "type": "website", "url": "https://volmitsoftware.com" },
    { "label": "Event rules", "url": "https://example.com/rules" }
  ]
}
```

| Key | Notes |
|---|---|
| `schemaVersion` | Must be `1`. Any other version is silently ignored |
| `revision` | `1` to `9007199254740991` |
| `favicon` | Optional. The server-list icon for every entry. Blank or absent keeps the vanilla `server-icon.png` |
| `entries` | At least one entry required, otherwise `motd document requires at least one entry` |
| `entries[].lines` | **1 or 2 lines. Zero lines or three or more is rejected outright** with `motd entry requires 1 to 2 lines` |
| `links` | Optional. Up to 16 pause-menu server links, otherwise `motd document declares more than 16 links` |

The vanilla server list supports at most two lines. Use two array entries rather than `\n` inside one string.

An invalid document is rejected as a whole. Gloss keeps the built-in or last valid document and logs the reason.

`/gloss motd reset` restores the included document (permission `gloss.motd.reset`).

The MOTD document also accepts `show`, defaulting to `true`. It is evaluated for each ping without
a viewer or world. False leaves the existing ping response unchanged, including its player limit.
Use server or calendar-time conditions here; see [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

## Server icon

The top-level `favicon` is the server-list icon for every entry. An entry's own `favicon` replaces
it for that entry. Blank or absent at both levels leaves the vanilla `server-icon.png` in place.

A 64×64 PNG in `plugins/Gloss/images/`. Anything else — a JPEG, a 128×128 image, a path outside
that folder — is refused and logged, and that entry falls back to the vanilla icon.

Icons are decoded once per document change, never per ping. Replacing an image file on disk reaches
the server list after the next `motd.json` change.

## Ping fields

Besides its text, an entry can set the hover sample, the two player counts, and the version line.

| Key | Sets | Notes |
|---|---|---|
| `entries[].favicon` | The server-list icon for this entry | Overrides the document `favicon`. See [Server icon](#server-icon) |
| `entries[].sample` | The hover list under the player count | Up to 12 lines, otherwise `motd entry sample may not exceed 12 lines`. It replaces the real player sample |
| `entries[].online` | The count before the slash | Must render to a number |
| `entries[].max` | The count after the slash | Must render to a number |
| `entries[].version` | The version name a client shows when its protocol does not match | Free text. The protocol number is untouched |

These fields go through the same static render as the MOTD text, described below. `online` and `max`
are rendered and then read as a number; a value that does not render to one is skipped and logged
once as `MOTD count "<raw>" did not render to a number.`

An entry whose sample, counts, or version carries a `|function|` token or a `{{ expression }}` block
is re-rendered on every ping, so a live count stays live. Everything else is rendered once per
document revision.

Not every field reaches every server. On Spigot, only the MOTD text, the icon, and `max` are
applied. `sample`, `online`, and `version` need Paper's server-list ping event. A server without it
keeps those parts of the vanilla response.

## Server links

`links` publishes the server links that appear in the client's pause menu. It needs the Paper
`ServerLinks` API, which is Paper 1.21 or newer; elsewhere the list is ignored. Links are published
when the document loads and again whenever it changes, and Gloss removes only the ones it added when
the feature is turned off or the plugin disables.

Each link needs a `url` and either a `type` or a `label`. A link with neither is rejected with
`motd link requires a known type or a label: <url>`.

| Key | Notes |
|---|---|
| `links[].type` | Uses the client's built-in label. One of `report_bug`, `community_guidelines`, `support`, `status`, `feedback`, `community`, `website`, `forums`, `news`, `announcements`. Case does not matter |
| `links[].label` | Publishes a custom label instead. Used only when `type` is absent |
| `links[].url` | Required. Must be an `http` or `https` address with a host |

An unknown `type` or a non-web `url` rejects the whole document, so the previous one stays active.

While a Velocity Gloss proxy holds the MOTD claim, this server removes the links it published and publishes none; it republishes this list when the claim is released or expires. See [Velocity Proxy](/gloss/27-velocity).

## How a ping is answered

`[features] motd` defaults to `false`. Turning it on extracts the bundled file and starts using it without a restart.

Gloss chooses one entry at random for each server-list request. Another MOTD plugin may override it if that plugin handles the event later.

The chosen text is rendered **statically**:

| Stage | Applies |
|---|---|
| `\|function\|` tokens, including `\|animation.<id>\|` | Yes |
| Inline `{{ expression }}` blocks using time and server values | Yes |
| Native server aliases through `papi(...)` / `papiNumber(...)` | Yes |
| Inline player values or external PAPI expansions | **No** |
| PlaceholderAPI placeholders | **No** |
| Emoji replacement | Yes |
| Colors: `[RRGGBB]` bracket hex, then `&` codes | Yes |

Player PlaceholderAPI values do not resolve because a server-list request has no player context. Raw player tokens remain visible.

The current request latency is also unavailable. MOTD expressions can use time, server counts, TPS, and integration metrics. Use a fallback for any player-backed value.

Animations use server time and work in the MOTD. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations).

A render failure logs `MOTD render failed; keeping the server default.` and leaves that ping untouched.

Edits to `motd.json` and to `[features] motd` in `gloss.toml` both apply automatically.

The web editor can live-sync this singleton with `/gloss web edit motd motd`, or include it in
`/gloss web workspace`.

MOTD documents stay schema 1. See [Data Files & Hot Reload](/gloss/03-data-files) and
[Tablist](/gloss/06-tablist).
