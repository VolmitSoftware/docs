---
title: "Getting Started"
description: "Install Gloss, check its files, and choose which features to enable"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

The same distribution jar also runs on Velocity. For proxy tablists, scoreboards, surfaces, connection messages, and MOTD management, see [Velocity Proxy](/gloss/27-velocity). The instructions below cover the server edition.

Settings are `plugins/Gloss/gloss.toml`. Display content is JSON under `plugins/Gloss/`. A valid save reloads. Invalid files keep the current settings. A BileTools jar reload disconnects players while the packet library initializes. Config and document reloads do not.

## Requirements

| Item | Value |
|---|---|
| Server | Paper or Spigot API-compatible servers, including Folia. Minecraft 26.1.2 through 26.3 |
| Java | 25 |
| Jar | `Gloss v<version> [CraftBukkit] 26.1.2-26.3.jar` |
| Optional | PlaceholderAPI, Vault, and supported item plugins |

Paper-derived forks use their advertised Paper API compatibility. Features requiring a client protocol or a Paper-only API are available only when that capability exists; see [Velocity](/gloss/27-velocity) and [Bedrock viewers](/gloss/02-configuration#bedrock-viewers).

An XZ packed jar extracts `plugins/Gloss/cache/runtime/` on first start. That directory must be writable. PacketEvents is bundled in the jar; no separate PacketEvents installation or download is required. Other runtime libraries still need a network on first start if their cache is empty.

## Files

Enabled features write these files when they are missing:

```
plugins/Gloss/
├── gloss.toml            every runtime knob, commented, clamped and hot-reloading
├── languages/             translations installed when selected
│   ├── en_US.toml          editable English messages, generated at startup
│   └── language-preferences.properties  persistent player language choices
├── tablist.json           conditional tablist header, footer and list-name presentations
├── boards/                conditional scoreboard sidebars (default.json and animation-showcase.json included)
├── emoji/                 one JSON per emoji (67 included)
├── animations/            one JSON per text animation (10 effects included)
├── bubbles/               conditional chat bubble styles (default.json included)
├── damage-indicators/     conditional damage and healing presentations (default.json included)
├── real-drops/            conditional display-backed drop presentation (default.json included)
├── menus/                 inert starter menu (default.json included)
└── previews/              container preview documents (14 included)
```

`tablist.json` and `motd.json` sit at the root of the data folder.

Other paths appear only when Gloss has data to store:

| Path | Written when |
|---|---|
| `holograms/` | The first hologram is saved |
| `images/` | You put an image file in |
| `panels/` | The first panel is created |
| `motd.json` | `[features] motd` is turned on |
| `preview-scales.json` | Shutdown, and whenever a player finishes adjusting a preview scale. Holds every per-player scale that is not 1.0 |
| `bubble-styles.json` | A player picks a personal chat bubble style |
| `editor-sync-sessions.json` | A web editor sync session is created. Importers never copy session secrets |
| `editor-sync-transactions/` | A web editor publication is in flight |
| `editor-sync-backups/<id>/` | A web editor publication replaced at least one file |
| `custom-items.json` | `/gloss item export` runs. Regenerable, so nothing preserves it |
| `holoui-import.json` | A HoloUi import commits successfully. Its presence prevents automatic repeat imports |
| `editor-sync-backups/<transaction>/backup/` | A committed import or editor publication replaces existing files |
| `legacy-import.json` | A legacy Gloss configuration import commits successfully |

## Defaults

Gloss extracts a bundled default only when its target file is missing. Existing files are not overwritten during startup.

| Folder | Documents | Extracted while |
|---|---|---|
| `emoji/` | 67 | `[features] emoji` |
| `animations/` | `rainbow`, `marquee`, `timeline`, `typewriter`, `flash`, `wipe`, `scanner`, `decode`, `odometer`, `wave` | `[features] animations` |
| `boards/` | `default.json`, `animation-showcase.json` | `[features] boards` |
| `bubbles/` | `default.json` | `[features] chatBubbles` |
| `damage-indicators/` | `default.json` | `[features] damageIndicators` |
| `real-drops/` | `default.json` | `[features] realDrops` |
| `menus/` | `default.json` | `[features] menus` |
| `previews/` | 14 | `[features] previews` |
| `tablist.json` | one singleton document | `[features] tablist` |
| `motd.json` | one singleton document | `[features] motd` |

Enabling a document-backed feature extracts its defaults on reload; `previews` needs a restart before `previews/` appears. Gloss creates no default holograms, panels or images. Document paths, schema versions and reset commands are on [Data Files & Hot Reload](/gloss/03-data-files).

## Feature toggles

`motd` and `connections` are off by default. Enabling `panels` or `previews` after startup needs a restart. The full table is on [Configuration](/gloss/02-configuration).

## Import

On first start, Gloss can import supported menus, images, panels, preview definitions, player preview scales, and settings from `plugins/holoui` or `plugins/HoloUi`. The source remains unchanged, and credentials and editor sessions are excluded. Existing destination conflicts or invalid documents prevent activation. For an explicit import, run `/gloss import holoui mode=preview`, review its results, then `/gloss import holoui mode=apply`; see [Data files](/gloss/03-data-files). HoloUi world boards become Gloss panels; `/gloss board` controls scoreboards.

## Uninstalling

Gloss draws its displays with unsaved entities and client packets. Removing it means removing its jars and data folders; the few traces left in worlds are listed under [What remains in worlds](#what-remains-in-worlds).

> Deleting `plugins/Gloss/` permanently removes holograms, menus, panels, boards, images, document history, and transaction backups. Back up the folder first if you may want that content again.
{.is-warning}

While Gloss is still installed:

1. Save content you want to keep. `/gloss export bundle` writes a workspace archive under `plugins/Gloss/exports/`; copy it outside `plugins/Gloss/`, or back up the whole folder.
2. End live editor sessions. List them with `/gloss web sessions list` and revoke each with `/gloss web sessions revoke <session>`. A session you do not revoke ends after `[editor.sync] sessionMinutes`.
3. If menus use [camera rides](/gloss/12-actions#camera-rides), make sure nobody is riding. A player who disconnected during a ride, or was riding when the server stopped, is returned to their saved position and game mode on their next join only while Gloss is installed. Without Gloss, that player joins in spectator mode; restore them with `/gamemode` and `/tp`.

Remove Gloss:

4. Stop every server and proxy that runs Gloss.
5. Delete `Gloss v<version> [CraftBukkit] 26.1.2-26.3.jar` from `plugins/` on each server and each Velocity proxy.
6. Delete what Gloss created:

| Location | Contents |
|---|---|
| Server `plugins/Gloss/` | Settings, documents, images, languages, player state, history, editor-sync backups, `forge/` pack output, `exports/`, downloaded libraries in `.libs/`, and `cache/runtime/` |
| Proxy `plugins/gloss/` | Proxy settings and documents, including `proxy-ownership.key` |
| Proxy `plugins/Gloss/` | `cache/runtime/` extracted from an XZ jar |
| Folders given to `/gloss forge export <path>` | Exported resource-pack trees. Also remove those files from any pack you merged them into |
| Your pack host | The uploaded `gloss-pack.zip`, if `[forge] url` points to your own host |
| `plugins/bStats/` | Shared by every plugin that uses bStats. Delete it only when no remaining plugin uses bStats |
{.dense}

If you remove only the proxy edition, backend servers that keep Gloss take back the tablists, boards, surfaces, MOTD, server links, and connection messages the proxy owned once its ownership leases expire. Their configuration needs no changes.

### What remains in worlds

| Data | State |
|---|---|
| Holograms, chat bubbles, damage indicators, drop models, and camera carriers | Entities that are never saved to chunks, so none remain after a restart. Gloss text displays carry the scoreboard tag `gloss_display`; remove any that remain with `/kill @e[type=minecraft:text_display,tag=gloss_display]` |
| Menus, panels, previews, nameplates, scoreboards, tablists, and the MOTD | Sent to players only. Gloss adds no objectives or teams to the world scoreboard |
| Drop labels on dropped item entities | The custom name and the `gloss:drop_name`, `gloss:drop_name_value`, `gloss:real_drop`, `gloss:real_drop_name_visible`, and `gloss:real_drop_entity_visible` keys. Inert; items on the ground can keep showing their last label until they are picked up or despawn |
| `minecraft:light` blocks | Present only if the server stopped abruptly while a real-drop style with a `lightLevel` was lighting a drop. Remove them with `/fill <from> <to> minecraft:air replace minecraft:light` |
| `plugins/HoloUi/` or `plugins/holoui/` | HoloUi's own data. Gloss reads it for imports and never changes it |
{.dense}

### Starting fresh

1. Complete the removal steps above.
2. Delete or move `plugins/HoloUi/` or `plugins/holoui/` if it is still present. Otherwise Gloss imports from it again on first start.
3. Copy the jar into `plugins/` and start the server. The first start needs network access to download runtime libraries into `plugins/Gloss/.libs/`, then writes the default files listed above.
