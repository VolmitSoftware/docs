---
title: "Screen Surfaces"
description: "Configure conditional action bars, boss bars, and titles"
published: true
date: 2026-10-08T03:00:00.000Z
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
| `group` | Bossbar selection group, default `main`; 1–64 letters, digits, dots, underscores or hyphens, starting with a letter or digit |
| `automatic` | Default `true`; `false` enables only event and action deliveries |
| `delivery` | Queue, preemption, cooldown, deduplication, and waiting expiration for finite deliveries |
| `on` | Up to 64 event or interval subscriptions |
| `select.priority` | Document selection priority; defaults to `0` |
| `select.when` | Condition; defaults to `false`, so omission keeps the document unselected |
| `presentation` | Required fields for the selected surface |
| `variants` | Unique `id`, integer `priority`, `when`, and complete replacement `presentation` |

The file name without `.json` is the id. Action bars and titles each select their highest-priority passing document; bossbars select independently within each `group`. Within a selection group, equal priorities use id order. The same order selects a variant. Text uses the shared [text pipeline](/gloss/07-emoji-text-animations#the-text-pipeline); conditions and progress use [expressions](/gloss/13-expressions-placeholders).

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

`presentation.flags` accepts up to three distinct values: `darken_sky`, `play_boss_music`, and `create_fog`. An empty list removes the effects. These are Minecraft's native bossbar effects; the client controls their appearance and audio. Flags are valid only on bossbars.

Set different root `group` names, such as `health` and `quests`, to display independently selected bars. All groups still share `[surfaces] maxBossBarsPerViewer` with participating plugins. A higher compositor priority can displace a lower one when that cap is reached.

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

## Event and scheduled announcements

Set `automatic: false` to keep a document out of continuous selection. Its `on` entries submit finite deliveries. Each entry requires `trigger`, accepts `when` (default `"true"`), and optionally delays submission with `delayTicks` (0–72000). `join` runs after joining; `world_change` runs on the backend; `server_change` runs only on Velocity. Unavailable platform events reject the document. `interval` requires `everyTicks` (1–1728000). Entry conditions and `select.when` both evaluate against the recipient when the event fires. `show` must still pass at delivery submission.

Backend event and interval entries require `[features] behaviors`. They use the same event targeting and schedules as behavior documents. Delayed events follow the behavior timer limit. On Velocity, intervals and delays advance on the existing `refreshMillis` sweep, with at most 256 pending delayed triggers per viewer; excess triggers are rejected and logged.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "surface": "actionbar",
  "automatic": false,
  "select": {"when": "true"},
  "on": [{"trigger": "interval", "everyTicks": 1200}],
  "delivery": {
    "mode": "queue", "preempt": "higher", "maxPending": 8,
    "overflow": "reject", "cooldownTicks": 100,
    "deduplicate": "purpose", "expireTicks": 200
  },
  "presentation": {"text": "&eVisit the market", "ttlTicks": 80}
}
```

Actionbar and bossbar requests default to 100 ticks when `ttlTicks` is omitted. A title request lasts for its fade-in, stay, and fade-out total, with a one-tick minimum. Refreshing an active request does not restart its duration. Waiting expiration starts at submission; display duration starts when that request becomes active in its Gloss lane. Ordinary selected content returns when finite requests finish. Text and progress in a finite request are sampled when it is submitted.

| `delivery` key | Default | Meaning |
|---|---|---|
| `mode` | `replace` | `queue` waits when interruption is disallowed; `replace` rejects in that case; `drop` rejects whenever busy |
| `preempt` | `always` | `higher` interrupts only for higher presentation priority, `always` permits interruption, `never` waits or rejects. Applies to `queue` and `replace` |
| `maxPending` | `32` | 1–256 waiting requests per viewer and native lane; each bossbar group is a separate lane |
| `overflow` | `reject` | At capacity, reject the incoming request or use `drop-oldest` to discard the oldest waiting request |
| `cooldownTicks` | `0` | 0–72000 ticks between accepted requests for this document |
| `deduplicate` | `none` | `purpose` coalesces the same document; `content` coalesces identical rendered text; both include active and waiting requests |
| `expireTicks` | `1200` | 1–72000 ticks a queued request may wait before being discarded |

Preemption discards the interrupted request. Cooldown begins when a request is accepted, including acceptance into the queue. A rejected or coalesced request does not restart cooldown. The shared HUD compositor still arbitrates against other participating plugins; an accepted Gloss request does not force ownership from a higher-priority producer.

Use a `surface` action in any behavior event, interval, scene, or menu to submit a named document. This example targets online players whose recipient condition passes:

```json
{"type":"surface","surface":"notice","audience":{"scope":"server","when":"hasPermission('viewer', 'gloss.notices')"}}
```

`audience.scope` defaults to `viewer`; `server`, `world`, and `radius` are also supported. World and radius scopes use the triggering player's location. Radius requires a positive `audience.radius` of at most 4096 blocks. `audience.when` is a boolean or expression, default `true`, evaluated for each recipient. Explicit actions use `show` and the audience condition; `select.when` remains automatic/event selection. Global behavior intervals can use server scope without a triggering player.

The editor exposes automatic selection, bossbar group and flags, delivery policy, and **Event subscriptions**. Add up to 64 subscriptions, choose each event, and set its interval, delay, and viewer condition. Blank delay and condition use the runtime defaults. Changing an interval event to another event removes its interval; choosing an interval starts at 20 ticks unless a value already exists. Subscriptions can be reordered or removed, and edits support undo and redo. Imported extension fields remain intact. Malformed subscription shapes remain available in Code view for repair.

Event-only documents remain silent in the automatic preview. Subscriptions execute on their supported server platform; the browser does not generate join, world-change, or timer events. Client sky, fog, and music effects require Minecraft to view.

## Settings and commands

`[features] surfaces` defaults to `true`. Valid file edits reload automatically, and deleting a file removes that surface from selection. The included `welcome.json` has `select.when: "false"`, so edit that condition to show it.

| `[surfaces]` setting | Default | Range |
|---|---|---|
| `refreshIntervalTicks` | `10` | 1–200 |
| `maxBossBarsPerViewer` | `3` | 1–64 |
| `titleQueueLimit` | `8` | 1–64 |

| Command | Permission | Result |
|---|---|---|
| `/gloss surface list [page=1]` | Any Gloss command access | List loaded surfaces |
| `/gloss surface info <id>` | Any Gloss command access | Show kind, selection, and variant count |
| `/gloss surface reset [name=*]` | `gloss.surfaces.reset` | Restore selected shipped defaults |
| `/gloss surface test <id> [player=]` | `gloss.surfaces.test` | Run normal surface selection immediately for that player |

`surfaces` is an alias of `surface`. `test` validates the named id, then evaluates normal selection; it does not force that document to win. Boss bars and action bars clear when no document matches. Titles finish their own timing.
