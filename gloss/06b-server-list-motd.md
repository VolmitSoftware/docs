---
title: "Server List MOTD"
description: "Configure server-list responses, request selectors, icons and server links"
published: true
date: 2026-10-08T00:06:43.153Z
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

The MOTD document also accepts `show`, defaulting to `true`. It is evaluated when the response snapshot refreshes, without
a viewer or world. False leaves the existing ping response unchanged, including its player limit.
Entry conditions use the same viewerless scope. Player and world conditions cannot match an unauthenticated ping. Use `server.online`, `server.maxPlayers` or calendar-time conditions here; see [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

## Selection and rotation

`rotation` defaults to `{"mode":"weighted","intervalSeconds":60}`. `weighted` randomly selects among eligible entries using their weights; `first` selects the first eligible entry; `sequence` advances through eligible entries on each handled status request; `time` uses the current epoch time divided by `intervalSeconds` (1–86400). A sequence is shared by requests to this Gloss instance, including different hostnames. No eligible entry leaves the original response intact.

Each entry accepts `select`:

| Field | Meaning |
|---|---|
| `hostnames` | Exact requested hostnames or `*.example.org` suffixes; an empty list matches any host. Matching ignores case and a trailing dot; no DNS lookup is performed |
| `minProtocol`, `maxProtocol` | Inclusive client protocol-number bounds. Unavailable or legacy protocol metadata does not match a bounded selector. Supported on Paper and Velocity |
| `zone` | IANA time zone for calendar selection; defaults to `UTC` |
| `startTime`, `endTime` | Paired `HH:mm` times, start inclusive and end exclusive. A range crossing midnight is supported; equal times cover the full day |
| `days` | ISO weekdays, 1 (Monday) through 7 (Sunday); empty means every day. After midnight, the current calendar day applies |
| `states` | Values matching top-level `state`, which defaults to `normal`. For example, set `state` to `maintenance` in the document |
| `minOnline`, `maxOnline` | Inclusive real online-count bounds sampled at refresh, before display count overrides |

```json
{
  "lines": ["&6Evening event", "&7Join the event world"],
  "select": {
    "hostnames": ["events.example.org"],
    "zone": "UTC",
    "startTime": "18:00",
    "endTime": "23:00",
    "states": ["normal"],
    "minOnline": 1
  }
}
```

Status requests are unauthenticated. Hostnames and client protocol numbers are client-supplied routing metadata; they do not establish a player identity, permission, or entitlement. Player permissions, groups, personal locale, and per-player placeholders cannot select a status response.

## Server icon

The top-level `favicon` is the server-list icon for every entry. An entry's own `favicon` replaces
it for that entry. Blank or absent at both levels leaves the vanilla `server-icon.png` in place.

A 64×64 PNG in `plugins/Gloss/images/`. Anything else — a JPEG, a 128×128 image, a path outside
that folder — is refused and logged, and that entry falls back to the vanilla icon.

`icons` at document or entry level defines up to 64 PNG paths. The entry icon set takes precedence, followed by its single `favicon`, the document icon set, and the document `favicon`. Icon selection follows `rotation`: random for `weighted`, first for `first`, and the same sequence/time position for the other modes.

Icons are decoded once per document change, never per ping. Replacing an image file on disk reaches
the server list after the next `motd.json` change.

## Ping fields

<div class="gloss-demo" data-demo="server-list-motd-pov">
<p><strong>Server list and player sample</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/server-list-motd-pov.webm" aria-label="Server list and player sample, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="motd-editor">
<p><strong>MOTD authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/motd-editor.webm" aria-label="MOTD authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Besides its text, an entry can set the hover sample, the two player counts, and the version line.

| Key | Sets | Notes |
|---|---|---|
| `entries[].favicon` | The server-list icon for this entry | Overrides the document `favicon`. See [Server icon](#server-icon) |
| `entries[].sample` | The hover list under the player count | Up to 12 lines, otherwise `motd entry sample may not exceed 12 lines`. It replaces the real player sample |
| `entries[].online` | The count before the slash | Must render to a number |
| `entries[].max` | The count after the slash | Must render to a number |
| `entries[].version` | The version name a client shows when its protocol does not match | Free text. The protocol number is untouched |

`sampleMode` is `inherit`, `replace`, or `hide`. It defaults to `replace` when `sample` has lines and `inherit` otherwise. `hide` clears the hover sample; `replace` with an empty list also clears it.

`counts` accepts `onlineMode` and `maximumMode` (`inherit`, `fixed`, or `offset`), with integer `onlineValue` and `maximumValue`. Offsets apply to the incoming response counts and clamp to 0–2147483647; fixed values must be nonnegative. These explicit policies take precedence over `online` and `max` text when their mode is not `inherit`. `counts.hide: true` hides the player-count section on Paper and Velocity. These fields change status presentation, not admission limits.

The client measures latency and draws the ping bars. Gloss cannot set their strength or replace
them with text. Setting `version` only changes the label shown to an incompatible client;
compatible clients keep the player count and ping bars.

These fields go through the same static render as the MOTD text, described below. `online` and `max`
are rendered and then read as a number; a value that does not render to one is skipped and logged
once as `MOTD count "<raw>" did not render to a number.`

All text, conditions, and numeric expressions refresh outside ping handling. `[motd] snapshotRefreshTicks` controls the server refresh interval (default 20 ticks, range 1–1200). The Velocity edition uses `refreshMillis` from `proxy.json`. Counts and provider output can therefore be one refresh interval old. Incoming pings select a prepared response; they do not invoke providers, read image files, or run text expansions.

Not every field reaches every server. On Spigot, only the MOTD text, the icon, and `max` are
applied. `sample`, `online`, and `version` need Paper's server-list ping event. A server without it
keeps those parts of the vanilla response.

## Server links

<div class="gloss-demo" data-demo="server-links-pov">
<p><strong>Native pause-menu server links</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/server-links-pov.webm" aria-label="Native pause-menu server links, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

`serverLinks: {"enabled": true, "links": [...]}` publishes the links that appear in the client's pause menu independently of `[features] motd`, document `show`, and entry selection. Set `enabled` to false to disable them. Existing top-level `links` remains supported when `serverLinks` is absent and follows the MOTD feature switch. It needs the Paper
`ServerLinks` API, which is Paper 1.21 or newer; elsewhere the list is ignored. Links are published
when the document loads and again whenever it changes, including players already connected. Gloss removes only the ones it added when
the feature is turned off or the plugin disables.

Each link needs a `url` and either a `type` or a `label`. A link with neither is rejected with
`motd link requires a known type or a label: <url>`.

| Key | Notes |
|---|---|
| `links[].type` | Uses the client's built-in label. One of `report_bug`, `community_guidelines`, `support`, `status`, `feedback`, `community`, `website`, `forums`, `news`, `announcements`. Case does not matter |
| `links[].label` | Publishes a custom label instead. Used only when `type` is absent |
| `links[].url` | Required. Must be an `http` or `https` address with a host |

An unknown `type` or a non-web `url` rejects the whole document, so the previous one stays active.

While a Velocity Gloss proxy holds the server-links claim, this server removes the links it published and publishes none; it republishes this list when the claim is released or expires. See [Velocity Proxy](/gloss/27-velocity).

## How a ping is answered

`[features] motd` defaults to `false`. Turning it on extracts the bundled file and starts using it without a restart.

Gloss evaluates each entry’s `show` condition during snapshot refresh, then selects among passing entries according to `rotation` and the request selectors. With the default `weighted` rotation it uses `weight`. An omitted `show` is true; an omitted weight is 1. Weights are integers from 1 to 1000000, so a weight of 3 is three times as likely as a weight of 1. With no passing entries, the existing ping response remains unchanged. Entry conditions share the document’s viewerless server and time scope. Another MOTD plugin may override it if that plugin handles the event later.

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

Animation tokens choose a frame when the response snapshot refreshes. The client shows that still frame until it requests status again; a server cannot continuously animate an already displayed server-list entry. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations).

A refresh failure retains the previous prepared response and logs the cause. Until a first response is ready, Gloss leaves status unchanged.

Edits to `motd.json` and to `[features] motd` in `gloss.toml` both apply automatically.

The web editor can live-sync this singleton with `/gloss web edit motd motd`, or include it in
`/gloss web workspace`.

The editor exposes rotation, icon sets, server state, request selectors, count policies, hover-sample modes, and independent server links in the inspector. Unknown imported fields remain in the exported document, including fields inside policy objects. Edits participate in undo and redo.

Enable **Status request simulator** in the preview to supply a requested hostname, client protocol number, an ISO timestamp with `Z` or a UTC offset, real online and maximum counts, and a server-state override. Select Paper, Spigot, or Velocity to apply that platform's supported status fields. A blank protocol represents unavailable metadata; a blank state uses the document state. The simulator shows eligible responses, the selected entry, resolved icon path, and published links. Turn off **MOTD feature enabled** to check independently published links.

**Refresh ping** advances the simulated sequence position and weighted sample. Time rotation uses the supplied timestamp. Named time zones apply IANA calendar and daylight-saving rules. The preview's weighted samples are reproducible; they do not predict a live server's random selection. Direct entry inspection bypasses request selectors.

The editor previews a compatible client, so configured version text leaves the player count and ping bars visible. Hover the player count to read a replacement sample list. Inherited samples come from the real server response and are not available in this preview. Images render when their files are available in the editor workspace; otherwise the resolved path is still shown. Server-link labels and URLs are listed for inspection rather than rendered as a Minecraft pause menu.

MOTD documents stay schema 1. See [Data Files & Hot Reload](/gloss/03-data-files) and
[Tablist](/gloss/06-tablist).
