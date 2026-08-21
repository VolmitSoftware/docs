---
title: "Operator Runbooks & Smoke Tests"
description: "Wormholes documentation: Operator Runbooks & Smoke Tests"
published: true
date: 2026-08-20T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

These checklists verify install, portals, projection, RTP, dimensional doors,
networking codes, and projection maintenance. Use an isolated test instance when
you can. Commands use aliases `/wormholes`, `/wh`, or `/wormhole`.

Architecture context:
[13 - Runtime Architecture](/wormholes/13-runtime-architecture). Permissions:
[09 - Commands & Permissions](/wormholes/09-commands-permissions).

## Install and reload

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | Place the shaded Wormholes jar in `plugins/` on Paper or Folia. If you test those paths, also install PlaceholderAPI, Vault, or Iris. | Server starts without enable failure splash. |
| 2 | Confirm `plugins/Wormholes/config/wormholes.toml` exists with `schema = 2`. | File is present. It has quality and sections `[main]`, `[network]`, `[projection]`, `[render]`. |
| 3 | `/wh info` | Building instructions print. |
| 4 | Under `[main]`, edit a harmless key such as `verbose-logging = true`. Then run `/wh reload` as op (`wormholes.admin.reload`). | Reload success message. No retained-settings error. |
| 5 | Toggle `/wh debug` (`wormholes.admin`). | Verbose logs and one-second telemetry toggle. The console shows the change. |
| 6 | If you test doors on non-Paper, restart the server once after the first Spigot-only pocket datapack install. | The log no longer requires a restart for the pocket datapack. Doors can start when enabled. |

## File hotload burst and recovery

Use harmless settings and restore their original values after this check.

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | Change `quality` or `verbose-logging`, save `wormholes.toml`, and do not run a command. | The file remains unchanged by the passive reload. After 350 ms of stable content, the console reports one successful hotload and the live setting changes. |
| 2 | Save several valid variants over a few seconds, ending with a known final value. Include an editor atomic-save or FTP upload/rename when that is the deployment path. | Automatic applications are single-flight and start no more often than three seconds after the preceding completion. Intermediate candidates coalesce and the final value applies. |
| 3 | While one automatic application is pending, save one more valid value. | The later snapshot remains queued and applies after the active application and cooldown; it is not acknowledged or lost early. |
| 4 | Temporarily move or delete `wormholes.toml`, then restore a valid file. | Wormholes does not create defaults or apply an empty intermediate state. The restored stable file hotloads. |
| 5 | Save malformed TOML, then correct it with a different valid snapshot. | The malformed snapshot logs a stacktrace and keeps the last-known-good live settings. The corrected snapshot applies without a restart. |
| 6 | Queue automatic edits, then run `/wh reload`. | The manual reload applies immediately without waiting for the automatic cooldown. An older queued snapshot does not apply afterward. |

## Build two local portals and link

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | Use `/wh wand` with `wormholes.admin.items`, once per rune needed. Runes are not craftable. | Wand and a wormhole rune are in inventory. |
| 2 | Build frame A. Complete construction so a portal is created. | The portal appears. It is saved under `plugins/Wormholes/portals/`. |
| 3 | Build frame B in the same or another loaded world. | Second portal exists. |
| 4 | Open the portal A menu. Link A to B (tunnel). If return travel is required, link B to A separately. | A shows B as destination. B does not show A automatically. Bidirectional travel needs the reverse link. |
| 5 | Walk through A → B. After linking B → A, walk back. | A→B teleports. Return works only after the reverse link. Cooldown respects `[main] teleport-cooldown-millis` (default 1000 ms). |
| 6 | Fully restart the server/plugin. | Portals reload from JSON and the link remains. `/wh reload` does not reconstruct portal persistence. |

See [03 - Building Portals](/wormholes/03-building-portals) and
[04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings).

## Enable projection and walk to view

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | On a linked portal of any type, make sure **Projection** is **ON**. Every type can project. | Menu shows ON. |
| 2 | Leave **Render mode** at the default Venticular. You can compare PanOptic later. | When you stand in the view volume, destination geometry appears through the aperture. |
| 3 | Stand outside the activation/view range (global default range 48 when activation range is 0). Then walk into range facing the portal. | Projection starts when you are inside the view AABB. It stops after you leave and grace expires (`[projection] interest-grace-ticks`, default 5). |
| 4 | If you test blackout, enable the blackout background. Then cycle the color. | A far-plane display seal uses the chosen concrete color. It does not replace the sampled view. |
| 5 | If entity spoofing is on and quality is not `performance`, place a mob near the destination. | The spoofed entity is visible through the portal within spoof range. |
| 6 | Set quality to `performance`. Then reload. | Entity spoofing is off. Range, depth, and budgets are clamped per [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings). |

## RTP smoke

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | Portal menu → type **RTP** → **Random Destination**. | Editor opens (overview with Destination/Landing/Routing/Effects). |
| 2 | Change min radius (for example +128). | The change applies immediately (applied notification). No Apply Changes control is required. |
| 3 | If you did not change them, confirm defaults. Min 512. Max 4096. Center is portal-relative. Vertical surface. Allocation is shared. Rotation is on-traversal. Rim and sound are on. | Status and settings match [06 - Random Teleport Portals](/wormholes/06-random-teleport-portals). |
| 4 | Wait until the destination is ready. Then look through the portal. | When state is ready, projection shows a remote landing. |
| 5 | Traverse the RTP portal. | Teleport is safe. A shared ON_TRAVERSAL portal starts a reroll (state may show `rerolling` / `warming`). |
| 6 | If PlaceholderAPI is present, check `%wormholes_rtp.state%` and `%wormholes_rtp.cooldown%` near the portal. | States among `rerolling` / `warming` / `ready` / `cooldown` / `idle`. |
| 7 | Optional: set rotation to STATIC. Then traverse again. | The destination does not reroll automatically after the trip. |

## Dimensional door pair: craft, place, travel

This needs `[main] dimensional-doors-enabled = true` (default). On
Spigot-family, the pocket datapack must be loaded after a restart when that
applies.

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | Craft an **Entangled Door Pair** kit, or use `/wh door pair` (admin items path). | Pair kit item is granted. |
| 2 | Right-click air or a block with the kit to unpack linked A/B Wormhole Doors. | Two linked door items/endpoints. |
| 3 | Place door A and door B in valid positions. | The doors place. OpenState defaults to Open. The portal is active when the physical door is open. |
| 4 | If OpenState is Open, open physical door A. Then walk through the portal surface. | You teleport to B. Orientation rules match [07 - Dimensional Doors](/wormholes/07-dimensional-doors). The open-state source may close after a living traveler. |
| 5 | Return through B. | You arrive at A safely. |
| 6 | Optional: open the access menu (owner sneak-right-click with an empty hand). Then toggle OpenState. | Access list and OpenState change behavior as documented. |

Personal and Public pocket doors and trapdoor variants are separate products.
The pair kit is the minimal cross-link smoke test.

## Dimensional door coverage

| Path | Check | Pass criteria |
|------|-------|---------------|
| Personal | Place two Personal doors. Enter as two different players. | Each player reaches their own stable pocket from either door. Each player returns through the anchored return door. |
| Public | Break and re-place one Public door. Then craft a second. | The moved identity keeps its pocket. The new item gets a different shared pocket. |
| Trapdoor | Repeat Pair and one pocket path with trapdoor products. | Top/bottom aperture mapping and OpenState match [07 - Dimensional Doors](/wormholes/07-dimensional-doors). |
| Access | Add whitelist or blacklist entries. Test owner and bypass. Then toggle OpenState to CLOSED. | Per-door policy is enforced. CLOSED acts as a contact surface while the block remains shut. |
| Objects | Send a projectile or dropped item through Pair or Public. Then send one through Personal. | Pair and Public transfer eligible objects with momentum. Personal refuses them. |
| Persistence | After you place endpoints, edit access, and allocate pockets, fully restart. | Door identities, access records, links, and pocket slots reload. Return routes still work. |

## Server code export/import (network enabled)

This needs `wormholes.admin.network`. Export and import set
`[network] enabled = true`. They start networking when necessary.

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | On server A: `/wh server export`. | Clickable/copyable server code in chat. |
| 2 | On server B: `/wh server import <code>`. | Route/trust accepted. Peer appears. |
| 3 | Run `/wh server list` and `/wh network status` on both servers. | Peer is listed. Status is CONNECTED when reachable. If not, doctor explains the failure. |
| 4 | Optional: export from the gateway portal menu **Export**. Then run `/wh server import <portal code>` on the other side. Link through the gateway Link menu. | Remote portal route is stored. The gateway can link. |
| 5 | `/wh network doctor` if not connected. | Diagnostics lines printed. |

## Cross-server gateway handoff and entity transfer

Use two isolated servers running the exact same Minecraft and Wormholes
versions.

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | Complete the bidirectional route and trust workflow above. Link one Gateway on each server. | Both peers are CONNECTED. Each gateway names the remote destination. |
| 2 | Walk a non-op player through A. | The destination admits the player and places the player at B. The source does not dispatch before ACK. |
| 3 | Lock B inbound, or trigger another destination admission denial. Then retry. | The player remains or returns on the source-facing side. Doctor or stats records the denial. |
| 4 | Send a permitted non-player entity through A. | One matching entity appears at B with transformed momentum. The source copy disappears after accepted ACK. |
| 5 | Add that Bukkit entity type to `[network] entity-transfer-deny-types`. Reload. Then retry. | The destination refuses it. The source entity is restored. It is not duplicated or lost. |

Details: [10 - Cross-Server Networking](/wormholes/10-cross-server-networking).
Import and export services are built during network bootstrap even when you
diagnose a disabled network. Status commands report disabled or not running when
that is the case.

## Debug toggle

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | `/wh debug` with `wormholes.admin`. | Toggles verbose console logs and one-second telemetry. |
| 2 | Perform a projection or network action. | When debug is enabled, extra diagnostic lines appear. |
| 3 | `/wh debug` again. | Telemetry quieted. |

`/wh debug` is a runtime override. Reload clears that override. Debug then
follows `[main] verbose-logging` again
(`DebugTelemetryService.onSettingsReloaded`).

## Stats snapshot

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | Make sure `[network.stats] enabled = true`. You can set `interval-sec` or `path-override`. | Default output is `plugins/Wormholes/wormholes-stats.txt`. An absolute override is used as written. |
| 2 | `/wh stats now=true` with `wormholes.admin`. | Command reports the output path and force-replaces the snapshot atomically. |
| 3 | While projection or network activity runs, inspect the file. | Sections include CONFIG, PEERS, COMPRESSION, VIEW STREAMING, TRANSFERS, FAILURES, and ERRORS from the last 60 seconds. |

## Freeze and flush projection

Permission: `wormholes.admin.projection`.

| Step | Action | Pass criteria |
|------|--------|---------------|
| 1 | Stand in an active projection. | Destination view is visible. |
| 2 | `/wh admin freeze 30` (default 30 if omitted, allowed 5–300). | A message says projections are frozen. The view stops updating. |
| 3 | `/wh admin freeze 0` | Projections resume. |
| 4 | `/wh admin flush` | Projected blocks revert to ground truth and rebuild. The flushed count is reported. |

## Quick failure matrix

| Symptom | Check |
|---------|--------|
| Plugin fails enable | Check the console stacktrace. Check for a schema-less or wrong `schema` in TOML. Check dependency load. |
| No projection | Projection is OFF. You are outside the view AABB. Freeze is active. The portal is not projectable (RTP not ready). Budgets are starved under PERFORMANCE. |
| RTP never ready | The world is not loaded. Radius or border is too tight. Safety rejects all candidates. Search is on cooldown. |
| Doors missing | `[main] dimensional-doors-enabled` is false. A pocket datapack restart is still required. Drain is in progress. |
| Network import fails | The network is not initialized. The code is invalid or truncated. The identity is the same. The peer is offline (`/wh network doctor`). |
| Config edit does not hotload | Confirm the target is exactly `config/wormholes.toml`, is a regular file no larger than 8 MiB, contains `schema = 2`, and remains stable for 350 ms. Check the full watcher or parse stacktrace. |
| Repeated edits appear delayed | Automatic hotload is intentionally single-flight and completion-cooled for three seconds. The latest stable snapshot stays queued. Use `/wh reload` for an immediate explicit application. |

## Cross-references

- Config:
  [01 - Installation & Configuration](/wormholes/01-installation-configuration)
- Building: [03 - Building Portals](/wormholes/03-building-portals)
- Menus:
  [04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings)
- Projection:
  [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings)
- RTP: [06 - Random Teleport Portals](/wormholes/06-random-teleport-portals)
- Doors: [07 - Dimensional Doors](/wormholes/07-dimensional-doors)
- Commands: [09 - Commands & Permissions](/wormholes/09-commands-permissions)
- Network: [10 - Cross-Server Networking](/wormholes/10-cross-server-networking)
- Architecture: [13 - Runtime Architecture](/wormholes/13-runtime-architecture)
