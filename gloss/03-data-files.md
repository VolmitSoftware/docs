---
title: "Data Files & Hot Reload"
description: "Find Gloss data files, reload behavior, reset commands, and import rules"
published: true
date: 2026-10-03T14:34:30.000Z
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
| Scoreboards and tablist | `2` |
| Bubble styles | `5` |
| Damage indicators and Real Drops | `4` |
| Entity overlays | `2` |
| Animations, emoji, MOTD, connections, panels, inventory menus, screen surfaces, markers, waypoints, and strings | `1` |
| Menus and container previews | No version envelope |

Gloss updates `revision` when it writes a versioned file. Hand edits to panel files must also increment it; other document kinds do not require a manual revision change. An invalid file leaves the previous valid version active. Menu and preview documents use their own root fields without `schemaVersion` or `revision`.

Persistent holograms and bubble styles store their shared appearance in root `style` and `box` objects. Indicator presentations use `style` and `box`; Real Drops presentations use `labels.style` and `labels.box`. Previews use root `textStyle` and `itemStyle`, per-element `style`, label `box`, and `card` chrome settings. These are JSON document settings, separate from the feature and refresh controls in `gloss.toml`.

Display documents accept an optional boolean or expression `show` field, defaulting to `true`. Entity overlays also apply their `enabled`, range, entity-type, and world settings.
See [Show conditions](/gloss/13-expressions-placeholders#show-conditions) for supported fields, contexts, and examples. Drop-label visibility uses
`presentation.labels.show` in `real-drops/default.json`.

Nametags, nameplates, and chat channels use schema `1`. Their permission, selection, and style edits reload automatically.

## Reloading

The server edition reloads config and content files automatically. `/gloss reload` belongs to the [Velocity edition](/gloss/27-velocity), whose documents reload on command. Changes affect the matching live feature. Open menus and previews may close so they can be rebuilt.

Panel files also reload automatically after stable edits, additions, or deletions. Invalid edits keep the last working definition active. See [Panels](/gloss/16-panels) for revision and identity requirements.

## Imports

Preview third-party hologram imports with:

```text
/gloss import preview <source>
```

Apply them with `/gloss import apply <source>`. Supported sources are `gholo`, `decent-holograms`, `holographic-displays`, and `fancy-holograms`.

Use `/gloss import holoui` for HoloUi data and `/gloss import legacy` for supported older Gloss data. Back up `plugins/Gloss/` first.

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
