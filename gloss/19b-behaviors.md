---
title: "Behaviors and State"
description: "Run actions from player events, chat matches, timers, and named events"
published: true
date: 2026-10-07T22:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-10-07T22:00:00.000Z
---

Save behavior documents under `plugins/Gloss/behaviors/<id>.json`. Each schema-2 document declares state and event entries. Valid edits reload automatically; invalid edits retain the previous valid document.

## Document

```json
{
  "schemaVersion": 2,
  "revision": 1,
  "enabled": true,
  "allowServerCommands": false,
  "state": {
    "greeted": {"scope": "player", "type": "boolean", "default": false}
  },
  "matching": {"syntax": "re2", "maxInputCharacters": 4096, "maxWorkUnits": 2000000},
  "on": [
    {
      "trigger": "chat",
      "pattern": "^!hello$",
      "permission": "example.greeting",
      "do": [
        {"type": "message", "message": "Welcome."},
        {"type": "setState", "key": "greeted", "value": "true"}
      ]
    }
  ]
}
```

`revision` is a positive server-owned revision. `enabled` defaults to true. `allowServerCommands` defaults to false; set it to true only for documents whose action lists intentionally include `command` actions with `source: "server"`. This applies to nested action lists too. `on` accepts at most 256 entries.

Each entry requires `trigger` and a `do` array of [actions](/gloss/12-actions). Optional `permission` requires that permission on the event's player. Optional `when` evaluates an [expression](/gloss/13-expressions-placeholders) before actions run. Entries run in document order; documents run in id order. Named menu action libraries are not available in behaviors.

## Triggers

| `trigger` | Additional fields |
|---|---|
| `join`, `first_join`, `quit`, `respawn`, `death`, `kill`, `damage`, `world_change` | None |
| `chat` | Optional `pattern`; omission accepts every chat line within the matching limits |
| `command`, `emit` | Required `name` |
| `block_break`, `block_place`, `pickup`, `drop` | Optional namespaced `material` |
| `region_enter`, `region_leave` | Required `region`; requires the region integration |
| `menu_open`, `menu_close` | Optional `menu` |
| `menu_click`, `inventory_click` | Optional `menu` and `component` |
| `interval` | Required `everyTicks`, an integer from 1 through 1,728,000; optional `scope: "player"` or `"global"` |
| `server_start` | None |

An entry accepts only the additional fields listed for its trigger. `permission` and `when` apply to every trigger. Global intervals and server-start events have no player; use actions and expressions that support that context.

## Chat matching

Patterns use RE2 syntax and search for a match anywhere in the chat line. Use `^` and `$` to require a whole-line match. Lookaround, backreferences, atomic groups, and unsupported Java flags are rejected when loading the document. Patterns compile when documents load, before any chat event can use them.

| `matching` field | Default | Range or value |
|---|---|---|
| `syntax` | `re2` | `re2` |
| `maxInputCharacters` | `4096` | 1–32768 |
| `maxPatternCharacters` | `1024` | 1–4096 |
| `maxProgramSize` | `16384` | 16–1000000 |
| `maxNestingDepth` | `32` | 1–128 |
| `maxWorkUnits` | `2000000` | 1–100000000 per document and chat event |

`maxProgramSize` bounds compiled pattern size, including a conservative check before compiling repeated groups. A match reserves its compiled size multiplied by input length plus one before running. Every attempted entry also consumes one work unit. `[behaviors] chatMaxWorkUnits` in `gloss.toml` caps combined matching across all behavior documents, default 2,000,000 and range 1–100,000,000.

An oversized line skips the affected document's chat entries. A document that exhausts its budget skips its remaining chat entries. Exhausting the shared budget stops further behavior matching for that chat event. Already executed actions remain executed. Matching limits do not cancel or modify ordinary chat, and limit refusals appear as throttled console warnings. Permission and `when` checks still determine whether a matched entry executes.

## State declarations

Declare each key in `state` with `scope: "player"`, `"world"`, or `"global"` and `type: "number"`, `"string"`, or `"boolean"`. The optional `default` supplies its initial value. Documents declaring the same key must agree on scope, type, and default. Use `setState`, `addState`, and `clearState` actions to modify declared state.

`[behaviors] maxActionsPerTick` defaults to 256 and accepts 16–65536; excess actions defer. `maxTimersPerPlayer` defaults to 16 and accepts 1–256. `stateFlushSeconds` defaults to 30 and accepts 1–600. `[features] behaviors` enables the service.

## Commands and editor

| Command | Permission |
|---|---|
| `/gloss behavior list [page=1]` | `gloss.behaviors` |
| `/gloss behavior info <id>` | `gloss.behaviors` |
| `/gloss behavior fire <id> <entry> [player=*]` | `gloss.behaviors.fire` |

`fire` uses a one-based entry number and runs the selected entry with its permission and condition checks; it does not require its usual event selector to match. Set `player` when actions need a player.

In the [web editor](/gloss/18-web-editor), create or import a Behaviors document. The inspector edits matching limits, trigger names, chat patterns, conditions, permissions, state declarations, and action arrays. Browser validation uses RE2 for patterns. The browser does not execute server actions.

## Importing older Gloss documents

Run `/gloss import legacy mode=preview` to prepare schema-1 behavior documents, review the report, then run `/gloss import legacy mode=apply`. Non-chat documents convert without changing their actions or state. Chat documents report the new bounded-matching policy as an approximation; supported patterns outside the verified ASCII-literal subset also require review for RE2 semantics. Unsupported patterns are reported as unsupported and remain unconverted, with the original files preserved. Rewrite those patterns before preparing another import. See [Data Files & Hot Reload](/gloss/03-data-files) for backups, conflicts, and prepared-plan expiry.
