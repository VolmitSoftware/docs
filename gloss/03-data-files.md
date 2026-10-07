---
title: "Data Files & Hot Reload"
description: "Find Gloss data files, reload behavior, reset commands, and import rules"
published: true
date: 2026-10-07T22:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss stores editable JSON under `plugins/Gloss/`.

## Files

| Content | Path | Reset |
|---|---|---|
| Shared defaults and presets | `presets.json` | None |
| Holograms | `holograms/<id>.json` | None |
| Scoreboards | `boards/<id>.json` | `/gloss board reset [name=*]` |
| Tablist | `tablist.json` | `/gloss tablist reset` |
| MOTD | `motd.json` | `/gloss motd reset` |
| Connection messages | `connections.json` | None |
| Emoji | `emoji/<id>.json` | `/gloss emoji reset [name=*]` |
| Animations | `animations/<id>.json` | `/gloss animations reset [name=*]` |
| Bubble styles | `bubbles/<id>.json` | `/gloss bubbles reset [name=*]` |
| Damage indicators | `damage-indicators/default.json` | `/gloss indicators reset` |
| Entity overlays | `entity-overlays/default.json` | None |
| Nametags | `nametags/<id>.json` | `/gloss nametag reset [name=*]` |
| Names catalog | `names.json` | Edit the shared name maps |
| Nameplates | `nameplates/<id>.json` | `/gloss nameplate reset [name=*]` |
| Chat channels | `channels/<id>.json` | `/gloss channel reset [name=*]` |
| Real Drops | `real-drops/default.json` | `/gloss drops reset [name=*]` |
| Menus | `menus/**.json` | None |
| Inventory menus | `inventories/<id>.json` | `/gloss inventory reset [name=*]` |
| Images | `images/<file>` | None |
| Container previews | `previews/<id>.json` | `/gloss preview reset [name=*]` |
| Panels | `panels/<id>.json` | None |
| Screen surfaces | `surfaces/<id>.json` | None |
| World markers | `markers/<id>.json` | None |
| Locator waypoints | `waypoints/<id>.json` | None |
| Content strings | `strings/<locale>.json` | `/gloss strings reset [name=*]` |

For most documents, the file name is the ID. Renaming the file renames the document. Menu IDs include their path below `menus/`.

Inventory menu files reload automatically. Open the menu again to use changed titles, slots, and actions. New files become available without a server restart.

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
| Scoreboards | `2` |
| Tablist | `3` |
| Chat channels | `2` |
| Behaviors | `2` |
| Bubble styles | `5` |
| Damage indicators and Real Drops | `4` |
| Entity overlays | `2` |
| Presets, animations, emoji, MOTD, connections, panels, inventory menus, screen surfaces, markers, waypoints, and strings | `1` |
| Menus and container previews | No version envelope |

Gloss updates `revision` when it writes a versioned file. Hand edits to panel files must also increment it; other document kinds do not require a manual revision change. An invalid file leaves the previous valid version active. Menu and preview documents use their own root fields without `schemaVersion` or `revision`.

Persistent holograms and bubble styles store their shared appearance in root `style` and `box` objects. Indicator presentations use `style` and `box`; Real Drops presentations use `labels.style` and `labels.box`. Previews use root `textStyle` and `itemStyle`, per-element `style`, label `box`, and `card` chrome settings. These are JSON document settings, separate from the feature and refresh controls in `gloss.toml`.

Display documents accept an optional boolean or expression `show` field, defaulting to `true`. Entity overlays also apply their `enabled`, range, entity-type, and world settings.
See [Show conditions](/gloss/13-expressions-placeholders#show-conditions) for supported fields, contexts, and examples. Drop-label visibility uses
`presentation.labels.show` in `real-drops/default.json`.

Nametags and nameplates use schema `1`; chat channels use schema `2`. Their permission, selection, and style edits reload automatically.

## Shared defaults and named presets

Use `presets.json` for values shared by documents of the same kind. Keys are collection names such as `boards`, `holograms`, `menus`, or `surfaces`; single-file documents use `tablist`, `motd`, `names`, or `connections`.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "defaults": {
    "boards": {
      "presentation": {"title": "Server", "layout": {"refresh": {"titleTicks": 40}}}
    }
  },
  "presets": {
    "boards": {
      "compact": {"values": {"presentation": {"lines": ["Welcome", "Players: %server_online%"]}}},
      "lobby": {"extends": "compact", "values": {"presentation": {"title": "Lobby"}}}
    }
  }
}
```

Select a named preset in a document:

```json
{
  "schemaVersion": 2,
  "revision": 1,
  "preset": "lobby",
  "select": {"priority": 0, "when": "true"},
  "presentation": {"title": "Welcome"}
}
```

Values apply in this order: collection defaults, parent presets, selected preset, document fields, then the feature's selected conditional variant. Objects merge by field. Arrays replace the complete inherited array; they do not concatenate. An explicit `null` replaces an inherited value and then follows that field's normal null/default rules. The example keeps the preset's lines and global title refresh rate while using `Welcome` as its title.

Presets cannot supply `schemaVersion`, `revision`, `id`, `uuid`, or another `preset` selection. Those remain document-owned. Missing parents, inheritance cycles, unknown collection names, and invalid resolved documents are errors. Preset names are local to their collection. Omitting `presets.json` preserves ordinary document behavior; omitting `preset` still applies that collection's global defaults.

Catalog edits refresh dependent documents without rewriting their authored JSON or incrementing their revisions. Invalid edits retain the last working documents. A focused editor session carries a read-only preset snapshot and must be reopened if the server's catalog changes before publication. Workspace sessions can edit the catalog and dependent documents together.

Open an existing catalog with `/gloss web edit presets presets`, or create it in the workspace editor. Visual edits and in-game menu, panel, board and hologram updates preserve inherited fields that were not changed. Catalogs are limited to 2 MiB of source, 128 nested object or array levels, and an estimated 64 MiB of prepared data including expanded parent presets.

## Reloading

The server edition reloads config and content files automatically. `/gloss reload` belongs to the [Velocity edition](/gloss/27-velocity), whose documents reload on command. Changes affect the matching live feature. Open menus and previews may close so they can be rebuilt.

Panel files also reload automatically after stable edits, additions, or deletions. Invalid edits keep the last working definition active. See [Panels](/gloss/16-panels) for revision and identity requirements.

## Imports

Preview third-party hologram imports with:

```text
/gloss import preview <source>
```

Apply them with `/gloss import apply <source>`. Supported sources are `gholo`, `decent-holograms`, `holographic-displays`, and `fancy-holograms`.

For HoloUi data, run `/gloss import holoui mode=preview`, then `/gloss import holoui mode=apply` after reviewing the report. The prepared plan belongs to the command sender and expires after `[imports] previewLifetimeSeconds` (ten minutes by default). `/gloss import holoui mode=preview overwrite=true` explicitly prepares replacement of conflicting destination content; apply always uses the same reviewed plan. Changed source or destination files require a new preview. For older Gloss data, run `/gloss import legacy mode=preview`, review the reported changes and conflicts, then run `/gloss import legacy mode=apply`. Both import commands apply the sender’s captured preview, reject changed files, and require a new preview after its configured lifetime. Omitting the mode previews the upgrade. The `[imports]` file, preview-byte and path limits apply to source files, affected destinations, and complete-project validation; see [Configuration](/gloss/02-configuration). Preview requires `gloss.import`; applying requires `gloss.import.apply`.

HoloUi imports preserve menu paths, panel IDs and UUIDs, menu references, and original source files. `boards/` becomes `panels/`. Preview language keys move from `holoui.preview.*` to `gloss.preview.*`, and historical `previewScale` and `previewLookDistance` settings become each imported preview's `scale` and `viewDistance`. Player scale preferences use the current UUID-to-number map. Editor credentials, sessions, transactions, backups, and regenerable custom-item exports are excluded.

The report identifies exact copies and setting mappings, normalized approximations, unchanged content, unsupported settings, and destination conflicts. Unsupported content, invalid current documents, missing menu/image references, and duplicate panel UUIDs prevent the whole import. Customized destination settings require an overwrite preview. A successful transaction retains destination backups and writes `holoui-import.json` together with the imported content; failed imports do not mark completion. Repeating an unchanged import leaves files intact. HoloUi `language.yml` has no verified automatic conversion to the current localization catalog.


A legacy import prepares and validates the resulting documents before writing. Resolve every reported unsupported format, invalid document or customized-document conflict before applying. If a source or destination changes during preparation, run the preview again. Original replaced files are retained under `editor-sync-backups/<transaction>/backup/`. The original `config.yml` remains unchanged; `legacy-import.json` records its successfully applied content hash so a repeated import does not overwrite later TOML edits.

Supported historical envelopes are holograms 1–2, bubbles 1–4, boards 1, tablist 1–2, channels 1, behaviors 1, damage indicators 1–3, real drops 1–3 and entity overlays 1. Current envelopes are validated and retained. Conversion increments a changed document's revision once. The preview distinguishes exact conversions from approximations; wrapped legacy bubbles use one display block, and historical board group/permission fallback combinations need review across the converted boards.

The YAML overlay transfers supported feature switches and refresh settings, tab headers and footers, bubble world exclusions, MOTD text, drop labels and indicator text, limits and motion rates. Bubble line staggering and the old indicator scatter distribution are approximations reported in the preview.

## Packs

A `.glosspack` is a ZIP archive containing `manifest.json`, documents under `documents/<kind>/<id>.json`, and optional files under `images/`. Put a local archive beneath `plugins/Gloss/`, or use an HTTPS source. Installation previews changes by default:

```text
/gloss pack install source=packs/shop.glosspack
/gloss pack install source=packs/shop.glosspack dry=false
/gloss pack list
/gloss pack info id=shop
/gloss pack update id=shop
/gloss pack remove id=shop
```

Updating reads the original installation source again. Updates and removal preserve files edited since their installation. The `gloss.packs` permission covers listing and inspection; installation, updating, and removal use `gloss.packs.install`, `gloss.packs.update`, and `gloss.packs.remove`.

The manifest uses `format: "glosspack"`, `version: 1`, a lowercase slug `id`, a display `name`, and a semantic `packVersion`. Each document entry names its collection `kind`, document `id`, and the lowercase SHA-256 of its exact archive bytes. Each image entry names its relative `path` and SHA-256. At most 512 document and image entries may be declared.

For example, a shop pack containing `documents/menus/shop.json` declares that file as `kind: "menus"`, `id: "shop"`. Calculate its digest with `shasum -a 256 documents/menus/shop.json` and put the result in the entry's `sha256` field. Add a `requires` object with a Gloss version constraint and required plugin names when needed; document files must use the current schema for their collection. A pack that runs console commands must declare `serverCommands: true`, and the server must also permit pack console commands in its pack settings.

To build a pack, save a menu as `shop-pack/documents/menus/shop.json` using the [menu document format](/gloss/09-menus#the-menu-document). Run this from the directory containing `shop-pack`:

```python
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile

source: Path = Path("shop-pack/documents/menus/shop.json")
content: bytes = source.read_bytes()
manifest: dict[str, object] = {
    "format": "glosspack",
    "version": 1,
    "id": "shop",
    "name": "Garden shop",
    "packVersion": "1.0.0",
    "requires": {"gloss": ">=3.2.0", "plugins": []},
    "documents": [{
        "kind": "menus",
        "id": "shop",
        "sha256": hashlib.sha256(content).hexdigest()
    }],
    "images": [],
    "serverCommands": False
}
with ZipFile("shop.glosspack", "w") as archive:
    archive.writestr("manifest.json", json.dumps(manifest))
    archive.writestr("documents/menus/shop.json", content)
```

Copy `shop.glosspack` beneath `plugins/Gloss/packs/`, preview installation, then install it with `dry=false`. Archives may contain up to 512 entries and 8 MiB of expanded file data. Add each referenced image beneath `images/` and declare its relative path and checksum in the manifest.

## History and restore

With history enabled, Gloss keeps saved document versions. List a document's versions and restore one of the returned version identifiers:

```text
/gloss history list kind=holograms id=shop
/gloss restore document kind=holograms id=shop version=<version-from-history>
```

Listing requires `gloss.history`; restoring requires `gloss.history.restore`. A restore replaces the current document, which then follows its normal reload behavior.

## Check and export

Check authored documents before opening them, or export selected documents for editing elsewhere:

```text
/gloss check workspace kind=menus id=shop
/gloss export documents kind=menus id=shop dir=exports
/gloss export bundle dir=exports
```

`kind` and `id` default to `*`, and paged command results start at `page=1`. Checking requires `gloss.check`; exporting requires `gloss.export`. Export directories stay beneath `plugins/Gloss/` and cannot overwrite active content collections. Document export writes JSON files; bundle export collects the workspace content in an archive.
