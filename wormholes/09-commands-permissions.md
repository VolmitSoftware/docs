---
title: "Commands & Permissions"
description: "Every /wormholes command and permission node"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Use `/wormholes` (`/wh`, `/wormhole`) for portal setup and administration. `help` and `info` are public. Personal language permissions are granted by default; commands require the permissions shown.

## Plugin version

`/wormholes debug version` displays `Wormholes vVERSION`, using the installed plugin version and the Director help heading gradient. `/wormholes version` runs the same command but stays hidden from help and command suggestions. Both routes use the normal root command permissions.

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
| `/wormholes debug version` | any Wormholes administration command access | Show the installed plugin version |
| `/wormholes debug dump [upload=true]` | `wormholes.debugdump` | Save a diagnostic report, uploading by default |
| `/wormholes debug` | `wormholes.admin` or `wormholes.debugdump` | Open diagnostic command help |
| `/wormholes debug toggle` | `wormholes.admin` | Toggle formatted console diagnostics until config hot-reload or restart |
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

> **Warning:** `deleteeverything` has no confirmation prompt. It refuses to run while someone is inside or entering a pocket dimension.

Both deletion commands retire each loaded portal's pending saves before
removing portal storage. Queued saves cannot recreate deleted portal files.

## Diagnostic reports

`/wormholes debug dump` writes a report to the plugin's `debug/` directory and uploads it to mclo.gs by default. Use `upload=false` to keep it local. A failed upload does not delete the report. See [Shared diagnostic reports](/volmlib/api/diagnostics) for its contents.

### Live console debug mode

Run `/wh debug toggle` in-game as an administrator or `wh debug toggle` in the server console. Run it again to stop. For cross-server problems, enable it on both backends before reproducing the problem.

Console output includes projection work, packet rates, remote views, peer connections, queues, handoffs, and failure counts every second. Access-denial lines identify the rejected portal and check. Failure details appear when debug starts and when a reason's count changes. Exceptions retain their normal stack traces.

The `render` value measures accumulated projection work per elapsed second. For example, `700 ms/s` means 0.7 seconds of projection work per second, not a single frame's duration.

The toggle lasts until the next settings hot-reload or server restart. To keep debug enabled through either, set `verbose-logging = true` in the existing `[main]` table of `plugins/Wormholes/wormholes.toml`. Set it to `false` to disable persistent debug. File changes apply automatically. Live debug writes to the server console and log. It does not upload a report.

## Permissions

Personal language selection requires both `wormholes.language.self` and `volmit.language.self`. Both are granted by default.

See [Languages](/languages).

| Permission | Purpose |
|---|---|
| `wormholes.*` | All Wormholes permissions |
| `wormholes.language.self` | Choose or reset your Wormholes language; also requires `volmit.language.self` |
| `volmit.language.self` | Shared requirement for personal language selection |
| `wormholes.admin` | All administration permissions |
| `wormholes.debugdump` | Save and optionally upload diagnostic reports; default `op` |
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

Portal traversal uses `wormholes.portal.<key>`, whose stable key starts from the sanitized portal name. Renaming the portal preserves that key. With `[access] legacy-name-node-enabled = true`, the current name-derived node also acts as an alias. Without OP or the literal `*` permission, either matching grant blocks travel in `BLACKLIST` mode and permits it in `WHITELIST` mode. OP and `*` bypass portal access and direction restrictions. Source-side privilege also applies to that admitted gateway crossing. See [Portal access](/wormholes/04-portal-types-menus-settings#per-portal-permission-node).

See [Building Portals](/wormholes/03-building-portals), [Pocket Dimensions](/wormholes/08-pocket-dimensions), and [Cross-Server Networking](/wormholes/10-cross-server-networking).
