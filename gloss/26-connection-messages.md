---
title: "Connection Messages"
description: "Replace the vanilla join and leave lines with conditional Gloss text"
published: true
date: 2026-10-03T14:29:43.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-09-16T00:00:00.000Z
---

For network join, switch, and leave messages, see [Velocity Proxy](/gloss/27-velocity). The instructions below cover the server edition.

Gloss replaces the vanilla join and leave lines with text from `plugins/Gloss/connections.json`.

## Turning it on

`[features] connections` defaults to `false`. Set it to `true` in `gloss.toml` and Gloss extracts `connections.json` and starts using it without a restart. Turning it off again also hot-reloads.

## The document

<div class="gloss-demo" data-demo="connection-messages-pov">
<p><strong>Connection messages</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/connection-messages-pov.webm" aria-label="Connection messages, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="connections-editor">
<p><strong>Connection message authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/connections-editor.webm" aria-label="Connection message authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

`connections.json` is a schema-1 document with `join`, `leave`, and optional `firstJoin` sections. Gloss watches it like the other documents; a valid edit reloads and logs `Connection messages reloaded from connections.json.`

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "show": true,
  "join": {
    "enabled": true,
    "show": true,
    "audience": "network",
    "presentation": { "text": "&a+ &f{{ subject.name }} &7joined" },
    "variants": []
  },
  "leave": {
    "enabled": true,
    "show": true,
    "audience": "network",
    "presentation": { "text": "&c- &f{{ subject.name }} &7left" },
    "variants": []
  }
}
```

| Key | Notes |
|---|---|
| `schemaVersion` | Must be `1` |
| `revision` | `1` to `9007199254740991` |
| `show` | Document gate. Defaults to `true` |
| `join`, `leave` | A section that is present is on unless it carries `"enabled": false`. A section the file leaves out is off, and the vanilla line for that event is left alone |
| `<section>.show` | Section gate. Defaults to `true` |
| `<section>.presentation.text` | The line to send |
| `<section>.variants` | Entries of `priority`, `when`, and `presentation`. The highest-priority variant whose `when` holds for the recipient replaces the base text |
| `<section>.audience` | Accepted, and must be `network` or `server`. One server is the whole network, so it changes nothing here |

A `switch` block is read without complaint and does nothing. A backend never sees a server switch; the proxy edition is where that section matters.

`firstJoin` has the same fields as `join`. When enabled, it replaces `join` for a player who has
never played on this server. It does not also send the ordinary join message. Omitting or
disabling `firstJoin` uses `join` for everyone. This is a server-local distinction; the proxy
edition does not track first-time players.

```json
"firstJoin": {
  "enabled": true,
  "presentation": {"text": "&aWelcome {{ subject.name }}"},
  "variants": []
}
```

## How a line is rendered

Both `show` gates are evaluated once, for the connecting player. The text is then rendered once per recipient, with the connecting player as the subject and the reader as the viewer.

| In the text | Names |
|---|---|
| `{{ subject.name }}` | The player who joined or left |
| `{{ viewer.name }}` | The player reading the line |
| `{{ player.name }}` | The player reading the line. `player` is the viewer here, so the shipped document uses `subject` for the joiner |

`$player` exists only in tablist list-name formats on this edition and is not substituted here. Write `{{ subject.name }}`.

Variants are evaluated per recipient, so staff-only wording is a variant whose `when` is a permission check. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

When a section applies, Gloss cancels the vanilla message and sends its own line to everyone online. A recipient whose text renders empty is skipped, and a section whose text renders empty for everyone still cancels the vanilla line.

## Behind a Velocity proxy

While a Gloss proxy is announcing for the network, this server stays quiet: it clears the vanilla
join and quit lines and sends nothing of its own, whether or not `[features] connections` is on
here. A backend holds its join line for up to three seconds waiting for the proxy's claim, then
announces late if none arrives.

The first join after a server restart is announced immediately, because nothing has been seen yet,
so that one join can produce both this server's line and the proxy's. A server behind a proxy
without Gloss, or with connection messages turned off on the proxy, never waits. See
[Velocity Proxy](/gloss/27-velocity).
