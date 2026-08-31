---
title: "Data Files & Hot Reload"
description: "Gloss documentation: Data Files & Hot Reload"
published: true
date: 2026-08-26
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss stores editable JSON under `plugins/Gloss/`.

## Files

| Content | Path | Reset |
|---|---|---|
| Holograms | `holograms/<id>.json` | — |
| Scoreboards | `boards/<id>.json` | `/gloss board reset [name=*]` |
| Tablist | `tablist.json` | `/gloss tablist reset` |
| MOTD | `motd.json` | `/gloss motd reset` |
| Emoji | `emoji/<id>.json` | `/gloss emoji reset [name=*]` |
| Animations | `animations/<id>.json` | `/gloss animations reset [name=*]` |
| Bubble styles | `bubbles/<id>.json` | `/gloss bubbles reset [name=*]` |
| Damage indicators | `damage-indicators/default.json` | `/gloss indicators reset` |
| Real Drops | `real-drops/default.json` | `/gloss drops reset [name=*]` |
| Menus | `menus/**.json` | — |
| Images | `images/<file>` | — |
| Container previews | `previews/<id>.json` | `/gloss preview reset [name=*]` |
| Panels | `panels/<id>.json` | — |

For most documents, the file name is the ID. Renaming the file renames the document. Menu IDs include their path below `menus/`.

## Schema and revision

Versioned documents contain:

```json
{
  "schemaVersion": 2,
  "revision": 1
}
```

Keep the schema used by that document type. Gloss updates `revision` when it writes the file; hand edits do not need to change it. An invalid file leaves the previous valid version active.

## Reloading

Gloss reloads config and content files automatically. Changes affect the matching live feature. Open menus and previews may close so they can be rebuilt.

Use `/gloss reload` for a complete config reload. Panel files are the exception: after editing them directly, run `/gloss panel reload`.

## Imports

Preview third-party hologram imports with:

```text
/gloss import preview <source>
```

Apply them with `/gloss import apply <source>`. Supported sources are `gholo`, `decent-holograms`, `holographic-displays`, and `fancy-holograms`.

Use `/gloss import holoui` for HoloUi data and `/gloss import legacy` for supported older Gloss data. Back up `plugins/Gloss/` first.
