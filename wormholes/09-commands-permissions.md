---
title: "Commands & Permissions"
description: "Every /wormholes command and permission node"
published: true
date: 2026-09-03T07:34:52.375Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Use `/wormholes` (`/wh`, `/wormhole`) for portal setup and administration. `help` and `info` are public. Personal language permissions are granted by default; commands require the permissions shown.

## Commands

| Command | Permission | Purpose |
|---|---|---|
| `/wormholes language` | Personal or server language permissions for the selected scope | Open the shared picker |
| `/wormholes language self <locale\|reset>` | `wormholes.language.self` and `volmit.language.self` | Select or reset your personal Wormholes language |
| `/wormholes language server <locale>` | `wormholes.admin` or `volmit.language.admin` | Change the Wormholes server default |
| `/wormholes language server edit [locale]` | `wormholes.admin` or `volmit.language.admin` | Open the per-language inventory message editor |
| `/volmit plugins languages [lang]` | `volmit.language.admin` or every enabled plugin's server-language administration permission | Open the shared picker or change every enabled provider's server default |
| `/wormholes info` | none | Show portal-building instructions |
| `/wormholes wand [rune=true]` | `wormholes.admin.items` | Give a Portal Wand and, by default, a rune |
| `/wormholes door [type=pair]` | `wormholes.admin.items` | Give a Dimensional Door |
| `/wormholes reload` | `wormholes.admin.reload` | Reload config and language files |
| `/wormholes debugdump [upload=true]` | `wormholes.debugdump` | Save a diagnostic report, uploading by default |
| `/wormholes debug` | `wormholes.admin` | Toggle verbose diagnostics until the next reload |
| `/wormholes stats [now=false]` | `wormholes.admin` | Show the stats file; `now=true` writes it first |
| `/wormholes pocket info` | `wormholes.admin.pocket` | Show the current pocket's size and materials |
| `/wormholes pocket resize [size=0] [material=keep] [door=keep] [confirm=false]` | `wormholes.admin.pocket` | Resize the current pocket |
| `/wormholes pocket resizeall ...` | `wormholes.admin.pocket` | Resize every pocket |
| `/wormholes admin freeze [seconds=30]` | `wormholes.admin.projection` | Freeze projections; use `0` to resume |
| `/wormholes admin flush` | `wormholes.admin.projection` | Clear and rebuild projections |
| `/wormholes admin deleteallportals` | `wormholes.admin.reset` | Delete every local portal and link immediately |
| `/wormholes admin deleteeverything` | `wormholes.admin.reset` | Reset Wormholes data immediately |
| `/wormholes network status` | `wormholes.admin.network` | Show peer connection status |
| `/wormholes network doctor` | `wormholes.admin.network` | Diagnose connection failures |
| `/wormholes server export` | `wormholes.admin.network` | Create a server code |
| `/wormholes server import <code>` | `wormholes.admin.network` | Import a server or portal code |
| `/wormholes server list` | `wormholes.admin.network` | List linked servers |
| `/wormholes server remove <name>` | `wormholes.admin.network` | Remove a linked server |
| `/wormholes server connect <name>` | `wormholes.admin.network` | Move to a linked server |

Pocket sizes range from 8 to 128. `size=0`, `material=keep`, and `door=keep` preserve the current value. Shrinking a pocket with blocks or entities requires `confirm=true`; non-empty containers must be emptied first.

`deleteeverything` has no confirmation prompt and refuses to run while someone is inside or entering a pocket dimension.

## Diagnostic reports

`/wormholes debugdump` saves a diagnostic report and uploads it to the public mclo.gs service by default. Use `/wormholes debugdump upload=false` to save it locally without uploading. The command requires `wormholes.debugdump` (default `op`), independently of the root administration permission.

Reports are written atomically under the plugin data folder's `debug/` directory before upload. An upload failure retains the local file. Players receive controls to copy the relative report path and open or copy the upload link; console receives plain text. See [Shared diagnostic reports](/volmlib/api/diagnostics) for report contents.

## Permissions

Personal language selection requires both `wormholes.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`.

`/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

| Permission | Purpose |
|---|---|
| `wormholes.*` | All Wormholes permissions |
| `wormholes.language.self` | Choose or reset your Wormholes language; also requires `volmit.language.self` |
| `volmit.language.self` | Shared requirement for personal language selection |
| `wormholes.admin` | All administration permissions |
| `wormholes.debugdump` | Save and optionally upload diagnostic reports; default `op` |
| `wormholes.admin.reload` | Reload files |
| `wormholes.admin.items` | Give portal and door items |
| `wormholes.admin.network` | Manage linked servers |
| `wormholes.admin.projection` | Freeze or rebuild projections |
| `wormholes.admin.reset` | Destructive reset commands |
| `wormholes.admin.pocket` | Inspect and resize pockets |
| `wormholes.doors.bypass` | Bypass door access lists |
| `wormholes.doors.craft` | Craft and reskin dimensional doors |
| `wormholes.doors.place` | Place dimensional doors |
| `wormholes.gateway` | Create gateway portals |
| `wormholes.portals.wormhole` | Create wormhole portals |
| `wormholes.portals.portal` | Create portal and RTP portals |

Portal traversal can also use `wormholes.portal.<name>`. Names are lowercase; unsupported character runs become `_`. Renaming a portal changes this permission.

See [Building Portals](/wormholes/03-building-portals), [Pocket Dimensions](/wormholes/08-pocket-dimensions), and [Cross-Server Networking](/wormholes/10-cross-server-networking).
