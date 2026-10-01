---
title: "Commands & Permissions"
description: "Every /wormholes command and permission node"
published: true
date: 2026-10-01T19:10:41.982Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Use `/wormholes` (`/wh`, `/wormhole`) for portal setup and administration. `help` and `info` are public. Personal language permissions are granted by default; commands require the permissions shown.

## Plugin version

`/wormholes debug version` prints the installed version. `/wormholes version` runs the same command and stays hidden from help.

## Commands

| Command | Permission | Purpose |
|---|---|---|
| `/wormholes language` | Personal or server language permissions for the selected scope | Open the shared picker |
| `/wormholes language self <locale\|reset>` | `wormholes.language.self` and `volmit.language.self` | Select or reset your personal Wormholes language |
| `/wormholes language server <locale>` | `wormholes.admin` or `volmit.language.admin` | Change the Wormholes server default |
| `/wormholes language server edit [locale]` | `wormholes.admin` or `volmit.language.admin` | Open the per-language inventory message editor |
| `/volmit plugins languages [lang]` | `volmit.language.admin` or every enabled plugin's server-language administration permission | Bukkit only. Open the shared picker or change every enabled provider's server default |
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
| `/wormholes admin freeze [seconds=30]` | `wormholes.admin.projection` | Freeze projections; use `seconds=0` to resume |
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

`/wormholes debug dump` writes `debug/` and uploads to mclo.gs. `upload=false` keeps the file local. A failed upload keeps the file. Contents: [Shared diagnostic reports](/volmlib/api/diagnostics).

`/wormholes debug toggle` prints projection, network, queue, and handoff counts to the console once a second until the next settings reload or restart. `verbose-logging = true` in `[main]` keeps that output across a reload. The `render` figure is accumulated projection work per elapsed second.

## ClientView commands

These commands manage [ClientView](/wormholes/05-projection-modes-settings#clientview) on Bukkit, Fabric, Forge, and NeoForge. Each requires `wormholes.admin`.

| Command | Purpose |
|---|---|
| `/wormholes clientview status` | List every ClientView session |
| `/wormholes clientview on` | Offer ClientView to modded clients again. Online players with the mod receive it without reconnecting |
| `/wormholes clientview off` | Return every ClientView player to the standard projection and stop offering ClientView |
| `/wormholes clientview reset <player>` | Restart one player's ClientView stream |

`on` and `off` last until the next restart. Players receive ClientView only while it is on here and `[client-view] enabled = true`; `on` with `enabled = false` offers nothing. The `status` header shows both states (`runtime` for this command, `configured` for the file) and the session count. Each row shows the player, the session state (`VANILLA`, `PENDING`, or `CLIENT_VIEW`), the negotiated features, attended portals, frames and KiB sent, unacknowledged frame groups, acknowledgement round trip, and applied cells. With `[client-view] view-stats = true`, rows also show the client's plate memory and median sweep and apply times. `dropped` counts client messages the server rejected as protocol violations (oversized, malformed, unknown, or beyond the per-second limit); `stale` counts messages it ignored as expected, such as acknowledgements from before a session change or a repeated view report. `reset` reports when the player has no active ClientView session.

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



## Native Nexus commands

Fabric, Forge, and NeoForge expose `/wormholes nexus` (also `/wh nexus`). These commands require a player. Portal managers can change their portals; network owners and configured network roles control membership and network settings.

| Command | Purpose |
|---|---|
| `/wh nexus list` | List networks |
| `/wh nexus create <name>` | Create a network |
| `/wh nexus info <network>` | Show members and settings |
| `/wh nexus delete <network>` | Delete a network |
| `/wh nexus add <network> <portal> [address]` | Add a portal |
| `/wh nexus remove <network> <portal>` | Remove a portal |
| `/wh nexus address <portal> <address>` | Change a member address |
| `/wh nexus visibility <network> <PUBLIC\|MEMBERS\|PRIVATE>` | Set network visibility |
| `/wh nexus topology <network> <topology>` | Select topology |
| `/wh nexus hub <network> <portal>` | Set the hub |
| `/wh nexus role <network> <player-uuid> <role>` | Set a network role |
| `/wh nexus cooldown <network> <group>` | Set the cooldown group |
| `/wh nexus cost <network> <template>` | Set the default cost template |
| `/wh nexus doctor` | Check network references |
| `/wh nexus portal <portal> menu` | Open network management or dialing |
| `/wh nexus portal <portal> dial <address>` | Dial a member |
| `/wh nexus portal <portal> next` or `previous` | Cycle members |
| `/wh nexus portal <portal> sticky <true\|false>` | Set sticky dialing |
| `/wh nexus portal <portal> mode <mode>` | Set routing mode |
| `/wh nexus portal <portal> selection <rule>` | Set entry selection rule |
| `/wh nexus portal <portal> entry <kind> <target> [weight from to label]` | Add a routing entry |
| `/wh nexus portal <portal> remove-entry <index>` | Remove an entry |
| `/wh nexus portal <portal> clear` | Clear routing entries |
| `/wh nexus portal <portal> pair <destination>` or `unpair <destination>` | Change reciprocal links |
| `/wh nexus portal <portal> wire <x> <y> <z> <action> <output>` | Configure redstone offset and behavior |

## Native mesh administration

Fabric, Forge, and NeoForge support these commands with `wormholes.admin.network`:

| Command | Purpose |
|---|---|
| `/wh network members` | List peers, connection state, and trusted fingerprints |
| `/wh network pending` | List quarantined introductions |
| `/wh network accept <server>` | Trust a pending introduction |
| `/wh network reject <server>` | Remove a pending introduction |
| `/wh network versions` | Compare peer protocol and version information |
| `/wh network drain [on\|off]` | Read or change incoming handoff admission |
| `/wh network policy <portal> [candidates] [strategy] [headroom] [tps] [queue]` | Set or clear gateway destination selection |

Quote the comma-separated candidate argument: `/wh network policy gateway "alpha:lobby:2,beta:lobby:1" LEAST_LOADED 1 18 true`. Each candidate is `server:portal-uuid-or-tag[:weight]`. Strategies are `FIRST_AVAILABLE`, `LEAST_LOADED`, `ROUND_ROBIN`, `STICKY`, and `NEAREST`. Omit candidates to clear the policy. When every eligible destination is full and queueing is enabled, travelers wait at the gateway until capacity becomes available or the configured timeout expires. Draining, disconnected, closed, and stale destinations are filtered according to the policy thresholds.

## Native operations

Fabric, Forge, and NeoForge accept the following positional command arguments. Names and file paths
containing spaces must be quoted. `/wormholes`, `/wh`, and `/wormhole` address the same commands.

| Command | Permission | Purpose |
|---|---|---|
| `/wh help` or `/wh info` | none | Show command usage or portal-building instructions |
| `/wh version` | none | Show the installed version |
| `/wh stats [now]` | `wormholes.admin` | Show the stats path; `true` writes a fresh snapshot |
| `/wh admin freeze [seconds=30]` | `wormholes.admin.projection` | Pause projection updates for 5–300 seconds; `seconds=0` resumes |
| `/wh admin flush` | `wormholes.admin.projection` | Clear active projections and rebuild them |
| `/wh admin portals list [page] [filters]` | `wormholes.admin.portals` | List portals using `world=key`, `type=type`, `owner=uuid`, and `state=open\|closed\|linked\|unlinked` |
| `/wh admin portals find <name>` | `wormholes.admin.portals` | Find names containing the supplied text |
| `/wh admin portals info <portal>` | `wormholes.admin.portals` | Inspect a name, UUID, or unambiguous UUID prefix |
| `/wh admin portals tp <portal>` | `wormholes.admin.portals` | Travel to a safe position near the portal |
| `/wh admin portals retarget <portal> <destination>` | `wormholes.admin.portals` | Link an ordinary local portal to another local portal |
| `/wh admin portals unlink <portal>` | `wormholes.admin.portals` | Remove its destination |
| `/wh admin portals prune [dry] [confirm]` | `wormholes.admin.portals` | Report broken links by default; `false true` removes them |
| `/wh admin portals rename-server <old> <new> [confirm]` | `wormholes.admin.portals` | Rewrite matching remote destinations when confirmation is `true` |
| `/wh admin deleteallportals` | `wormholes.admin.reset` | Immediately remove local portals |
| `/wh admin deleteeverything` | `wormholes.admin.reset` | Immediately reset Wormholes configuration and saved data |

`deleteeverything` preserves world files and refuses to run while a pocket is occupied, being entered,
or undergoing a size or material change.

## Native backups and imports

These commands require `wormholes.admin.backup`. Backups are stored under
`config/wormholes/backups`; scheduled backups use the `[ops.backup]` settings.

| Command | Purpose |
|---|---|
| `/wh admin backup now` | Create a backup and apply configured retention |
| `/wh admin backup list` | List saved backups |
| `/wh admin backup export [file]` | Export a bundle to a file, or create a normal backup when omitted |
| `/wh admin backup restore <bundle> [options]` | Restore a named backup |
| `/wh admin backup import <file> [options]` | Import a bundle file |
| `/wh admin backup import-from <source> [options]` | Import another portal plugin's saved portals |

Restore and bundle import default to `dry=true`. Supply `dry=false confirm=true` to replace portal
files and reload the running portal state. Optional `world-map=old=new,old=new` and
`owner-map=old-uuid=new-uuid,old-uuid=new-uuid` remap worlds and owners. Unknown or unsigned bundle
signatures require `allow-unsigned=true`; a signature that does not match the bundle is always refused.

Third-party sources are `stargate`, `advancedportals`, `multiverse`, `betterportals`, and `essentials`.
Their saved files are read from the corresponding directories under the server's `plugins/` folder.
Use `dry=false` to create portals; Essentials warps also require `frame=width,height` because their
saved positions contain no portal frame. World identifiers such as `minecraft:overworld` and loaded
world names are accepted. Import reports show skipped entries and unresolved destinations.

## Native diagnostics

`/wh debug toggle` requires `wormholes.admin` and enables one-second projection and network summaries
until the next configuration reload or restart. `[main] verbose-logging=true` enables these summaries
persistently. `/wh debug version` reports the installed version.

`/wh debug dump [upload]` requires `wormholes.debugdump`. It saves a report under
`config/wormholes/debug` with portal, projection, player, network, tick-time, JVM, memory, thread, and
garbage-collection information. Upload defaults to `true`; use `/wh debug dump false` to keep the
report local. An upload failure leaves the saved report available.
