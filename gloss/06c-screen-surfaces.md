---
title: "Screen Surfaces"
description: "Configure conditional action bars, boss bars, and titles"
published: true
date: 2026-10-03T15:33:39.029Z
tags: "gloss"
editor: markdown
dateCreated: 2026-10-03T00:00:00.000Z
---

Each schema-1 document under `plugins/Gloss/surfaces/` drives an action bar, boss bar, or title. Gloss selects a document and presentation for each viewer using conditions. For proxy ownership and proxy settings, see [Velocity Proxy](/gloss/27-velocity#surfaces).

## The surface document

<div class="gloss-demo" data-demo="screen-surfaces-pov">
<p><strong>Action bars, boss bars, and titles</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/screen-surfaces-pov.webm" aria-label="Action bars, boss bars, and titles, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="surface-editor">
<p><strong>Screen surface authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/surface-editor.webm" aria-label="Screen surface authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Save this example as `surfaces/health.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "surface": "bossbar",
  "show": true,
  "select": {"priority": 10, "when": "true"},
  "presentation": {
    "title": "&aHealth: {{ fixed(player.health, 1) }}",
    "progress": "player.health / player.maxHealth",
    "color": "green",
    "style": "segmented_10",
    "priority": "status"
  },
  "variants": []
}
```

| Key | Meaning |
|---|---|
| `surface` | Required: `actionbar`, `bossbar`, or `title` |
| `show` | Boolean or condition; defaults to `true` |
| `select.priority` | Document selection priority; defaults to `0` |
| `select.when` | Condition; defaults to `false`, so omission keeps the document unselected |
| `presentation` | Required fields for the selected surface |
| `variants` | Unique `id`, integer `priority`, `when`, and complete replacement `presentation` |

The file name without `.json` is the id. Each surface kind selects its highest-priority passing document; equal priorities use id order. The same order selects a variant. Text uses the shared [text pipeline](/gloss/07-emoji-text-animations#the-text-pipeline); conditions and progress use [expressions](/gloss/13-expressions-placeholders).

## Action bars

An action-bar presentation requires `text`. Its `slots` list accepts `left`, `center`, and `right`; omission selects `center`.

```json
"surface": "actionbar",
"presentation": {
  "text": "&eSupplies ready",
  "slots": ["center"],
  "priority": "notice",
  "ttlTicks": 40
}
```

`priority` defaults to `status` and accepts `ambient`, `notice`, `status`, `progress`, `interactive`, `modal`, and `pinned`, in increasing priority order. It controls competition with other shared HUD content and is separate from document selection priority. `ttlTicks` is clamped to 1–1200; omission uses twice the configured surface refresh interval. A selected surface renews its content until it stops matching.

## Boss bars

Boss-bar presentations require `title`. `progress` is an expression clamped to 0–1, default `1`; either a bare expression or `{{ ... }}` is accepted. `priority` and `ttlTicks` use the same rules as action bars.

`color` accepts `pink`, `blue`, `red`, `green`, `yellow`, `purple`, or `white`, default `white`. `style` accepts `solid`, `segmented_6`, `segmented_10`, `segmented_12`, or `segmented_20`, default `solid`.

## Titles

Title presentations require `title`; `subtitle` defaults to empty. Use `fadeInTicks`, `stayTicks`, and `fadeOutTicks` for timing, defaulting to 10, 40, and 10. Each clamps to 0–1200.

```json
"surface": "title",
"presentation": {
  "title": "&6Welcome",
  "subtitle": "&f{{ player.name }}",
  "trigger": "once",
  "fadeInTicks": 10,
  "stayTicks": 40,
  "fadeOutTicks": 10
}
```

`trigger` accepts `select` (default), `once`, or `repeat`. `select` fires when the selected document or variant changes. `once` fires once per viewer for that document during the connection. `repeat` uses `repeatTicks`, clamped to 1–72000 and raised to at least `stayTicks`; omission repeats at the stay duration.

## Settings and commands

`[features] surfaces` defaults to `true`. Valid file edits reload automatically, and deleting a file removes that surface from selection. The included `welcome.json` has `select.when: "false"`, so edit that condition to show it.

| `[surfaces]` setting | Default | Range |
|---|---|---|
| `refreshIntervalTicks` | `10` | 1–200 |
| `maxBossBarsPerViewer` | `3` | 1–8 |
| `titleQueueLimit` | `8` | 1–64 |

| Command | Permission | Result |
|---|---|---|
| `/gloss surface list [page=1]` | Any Gloss command access | List loaded surfaces |
| `/gloss surface info <id>` | Any Gloss command access | Show kind, selection, and variant count |
| `/gloss surface reset [name=*]` | `gloss.surfaces.reset` | Restore selected shipped defaults |
| `/gloss surface test <id> [player=]` | `gloss.surfaces.test` | Run normal surface selection immediately for that player |

`surfaces` is an alias of `surface`. `test` validates the named id, then evaluates normal selection; it does not force that document to win. Boss bars and action bars clear when no document matches. Titles finish their own timing.
