---
title: "Data Files & Hot Reload"
description: "Find Gloss data files, reload behavior, reset commands, and import rules"
published: true
date: 2026-09-10T03:09:03.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss stores editable JSON under `plugins/Gloss/`.

## Files

| Content | Path | Reset |
|---|---|---|
| Holograms | `holograms/<id>.json` | None |
| Scoreboards | `boards/<id>.json` | `/gloss board reset [name=*]` |
| Tablist | `tablist.json` | `/gloss tablist reset` |
| MOTD | `motd.json` | `/gloss motd reset` |
| Emoji | `emoji/<id>.json` | `/gloss emoji reset [name=*]` |
| Animations | `animations/<id>.json` | `/gloss animations reset [name=*]` |
| Bubble styles | `bubbles/<id>.json` | `/gloss bubbles reset [name=*]` |
| Damage indicators | `damage-indicators/default.json` | `/gloss indicators reset` |
| Entity overlays | `entity-overlays/default.json` | None |
| Real Drops | `real-drops/default.json` | `/gloss drops reset [name=*]` |
| Menus | `menus/**.json` | None |
| Images | `images/<file>` | None |
| Container previews | `previews/<id>.json` | `/gloss preview reset [name=*]` |
| Panels | `panels/<id>.json` | None |

For most documents, the file name is the ID. Renaming the file renames the document. Menu IDs include their path below `menus/`.

## Schema and revision

Versioned documents contain:

```json
{
  "schemaVersion": 2,
  "revision": 1
}
```

Use the schema version for the document being edited:

| Document | `schemaVersion` |
|---|---|
| Holograms | `3` |
| Scoreboards and tablist | `2` |
| Bubble styles | `5` |
| Damage indicators and Real Drops | `4` |
| Entity overlays | `2` |
| Animations, emoji, MOTD, and panels | `1` |
| Menus and container previews | No version envelope |

Gloss updates `revision` when it writes a versioned file. Hand edits to panel files must also increment it; other document kinds do not require a manual revision change. An invalid file leaves the previous valid version active. Menu and preview documents use their own root fields without `schemaVersion` or `revision`.

Persistent holograms and bubble styles store their shared appearance in root `style` and `box` objects. Indicator presentations use `style` and `box`; Real Drops presentations use `labels.style` and `labels.box`. Previews use root `textStyle` and `itemStyle`, per-element `style`, label `box`, and `card` chrome settings. These are JSON document settings, separate from the feature and refresh controls in `gloss.toml`.

Display documents accept an optional boolean or expression `show` field, defaulting to `true`. Entity overlays also apply their `enabled`, range, entity-type, and world settings.
See [Show conditions](/gloss/13-expressions-placeholders#show-conditions) for supported fields, contexts, and examples. Drop-label visibility uses
`[drops] show` in `gloss.toml`.

## Reloading

Gloss reloads config and content files automatically. Changes affect the matching live feature. Open menus and previews may close so they can be rebuilt.

Panel files also reload automatically after stable edits, additions, or deletions. Invalid edits keep the last working definition active. See [Panels](/gloss/16-panels) for revision and identity requirements.

## Imports

Preview third-party hologram imports with:

```text
/gloss import preview <source>
```

Apply them with `/gloss import apply <source>`. Supported sources are `gholo`, `decent-holograms`, `holographic-displays`, and `fancy-holograms`.

Use `/gloss import holoui` for HoloUi data and `/gloss import legacy` for supported older Gloss data. Back up `plugins/Gloss/` first.
