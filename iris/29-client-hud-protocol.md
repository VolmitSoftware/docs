---
title: "Client HUD & Protocol"
description: "Iris documentation: Client HUD & Protocol"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Installed on a Minecraft client, the Iris mod adds a native pregeneration HUD, a full-screen Vision map, a What overlay for the block under your cursor, Studio toasts, and Iris world types in singleplayer. It talks to Iris servers over one channel, `irisworldgen:main`, and works the same whether the server is a mod loader or a Bukkit-family plugin. Vanilla clients never see the channel and fall back to server-side progress reporting.

See also [07 - Pregeneration](/iris/07-pregeneration), [08 - Localization](/iris/08-localization), [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas), and [30 - Platform Differences](/iris/30-platform-differences).

## Get the HUD working

There is no separate client download. The Fabric, Forge, and NeoForge mod jars each contain the client code, so the same jar you run on a server is the one you install on a client. **The Iris and Minecraft versions on both ends must match** — a mismatch is the most common reason the HUD never appears.

1. Install the Iris mod on your client and join an Iris server.
2. Start a small pregeneration from the server, for example `/iris pregen start radius=512 center=0,0 gui=false`.
3. Look at the top-left of your screen. Success is a dark panel at 6,6 with a green title, a `done / total (percent%)` line, a green progress bar, and a rate-and-ETA line. If region deltas arrive you also get a small region grid below the panel.
4. Press `M`. The Vision map should open full-screen. Drag to pan, scroll to zoom, Esc to close.
5. Press `J` to toggle the What overlay, then look at a block. It should list the biome, the region, the cave biome if there is one, and the height.
6. Walk into a non-Iris world. Vision and What stop reporting Iris data and the client clears its cached tiles and markers.
7. Disconnect and reconnect, then repeat step 3. This proves the handshake reruns and the UI shows no stale state.

If the panel never appears: confirm the versions match on both sides, reconnect to force a fresh handshake, then read the server log. A protocol version mismatch and a rejected frame both leave a trace there.

One thing that is not evidence: a working boss bar on a modded server proves the pregeneration job is running and that the server can talk to your client's *vanilla* surface. It does not prove the Iris payload path works. If the boss bar appears at all, the payload path did **not** come up for you.

## What each combination gives you

| Server | Vanilla client | Client with the Iris mod |
|---|---|---|
| Modded Iris (Fabric/Forge/NeoForge) | Boss bar for whoever started the pregeneration | Native HUD, Vision, What, and toasts over custom payloads. No boss bar |
| Bukkit-family Iris | Console output and `/iris pregen status`. No boss bar, no Iris client features | The same native HUD, Vision, What, and toasts, carried over plugin messaging on the same channel |
| Non-Iris server | Nothing | The mod goes inert once the handshake times out |

In singleplayer, installed packs register world generator presets under the `irisworldgen` namespace and appear as selectable World Types in the create-world screen. The integrated server runs the same engine as a dedicated one.

## Keybinds

Category **Iris** (`key.categories.irisworldgen.iris`). All three are rebindable in Controls.

| Action | Default | Translation key |
|---|---|---|
| Toggle pregen HUD | `H` | `key.irisworldgen.toggle_pregen_hud` |
| Open Iris Vision map | `M` | `key.irisworldgen.open_vision_map` |
| Toggle Iris What overlay | `J` | `key.irisworldgen.toggle_what_overlay` |

The HUD starts visible, the What overlay starts hidden, and neither toggle is remembered across restarts.

F1 hides the whole layered HUD, including the pregeneration panel and the What overlay. Toasts still advance and expire while the GUI is hidden rather than piling up.

## Pregen HUD

The panel draws at 6,6 whenever a tracked job exists and has not expired.

| Element | Content |
|---|---|
| Title | The localized pregen header |
| Stats | `done / total (percent%)`, thousands-separated, percent to one decimal |
| Bar | Green while running, amber while paused, gray once stale |
| Tail | Rate and ETA while running, `PAUSED` while paused, or "no updates for N s" once stale |
| Region grid | Only when region deltas have arrived. Each cell is a region: gray pending, amber generating, green done |

| Threshold | Value | Effect |
|---|---|---|
| Stale | 5 s | Every color mutes to gray and the tail switches to the stale label |
| Expire | 30 s | The panel stops drawing entirely |

Both timers are measured from the last progress frame received, so **a stale panel means the frames stopped, not that the job stopped.** A paused job keeps sending frames and stays amber. A `PregenEnd` frame clears the job and the region grid immediately, with no wait for either timer.

## Boss bar fallback

On modded servers a boss bar is shown to the player who started the pregeneration: green while running, yellow while paused, updated every 10 ticks, titled from `iris.runtime.pregen.bossbar.running` / `.paused`.

It is suppressed if that player already has a ready protocol session with `CAPABILITY_PREGEN`. You get the boss bar **or** the native HUD, never both — so if you installed the client mod and still see a boss bar, the handshake did not complete.

Bukkit-family servers have no equivalent boss bar. Players without the mod get `/iris pregen status`, the console, and the desktop pregeneration window; players with the mod get the same native HUD as on modded.

## Vision map and What overlay

| Feature | Requires | Notes |
|---|---|---|
| Vision map (`M`) | Ready session, an Iris dimension, and `CAPABILITY_VISION` from the server | Full-screen. Drag to pan, scroll to zoom, Esc to close |
| What overlay (`J`) | Ready session, an Iris dimension, and `CAPABILITY_CURSOR` | Reports biome, region, cave biome when present, and height for the cursor column |
| Studio toasts | The client advertises `CAPABILITY_STUDIO` | One hotload frame renders one toast. A successful hotload for the current pack also clears Vision tiles, markers, and What data |
| Dimension status | Only a completed handshake | Carries pack key, dimension key, seed, and height bounds. A world that is not Iris-generated clears the client's tiles and markers |

Zoom level is part of the tile cache key, so changing zoom invalidates every cached tile and the map repaints as new tiles arrive under the 8-per-second request budget. That is expected, not a stall. One client at saturation cannot exclude other connected clients.

## Protocol

| Constant | Value |
|---|---|
| Channel | `irisworldgen:main` |
| Protocol version | `1` |
| Transport (modded) | Custom payloads on the play channel |
| Transport (Bukkit) | Incoming and outgoing plugin messaging on the same channel name |
| Max frame | 24576 bytes |
| Max inbound frames per client per second | 32 |
| Max vision tile requests per second | 8 |
| Max cursor lookups per second | 4 |
| Max queryable block coordinate | ±29,999,999 |

Cursor lookups get their own budget rather than a slice of the frame budget. Each resolves biome, region, cave biome, and height, so a client at the four-per-second limit performs at most 16 column resolves per second.

Message types (`IrisProtocol.TYPE_*`):

| Id | Direction | Message | Purpose |
|---|---|---|---|
| 1 | C→S | `ClientHello` | Opens the session. Carries the client's protocol version and capability mask |
| 2 | S→C | `ServerHello` | Answers with the server's version, granted capabilities, brand string, and whether Iris is active |
| 3 | S→C | `PregenProgress` | Chunks done, chunks total, rate, ETA, and run state for one job |
| 4 | S→C | `PregenEnd` | Job finished or cancelled. Clears the HUD and region grid |
| 5 | S→C | `DimensionStatus` | Pack, dimension, seed, and height bounds for the world the player is in, or a flag saying it is not Iris |
| 6 | C→S | `CursorInfoRequest` | Asks about one X/Z column, for the What overlay |
| 7 | S→C | `CursorInfo` | Biome, region, cave biome, and height for that column |
| 8 | C→S | `VisionTileRequest` | Asks for one map tile at a zoom level |
| 9 | S→C | `VisionTile` | Tile image data, split into chunks when it exceeds one frame |
| 10 | S→C | `VisionMarkers` | Labelled points overlaid on one map tile. Each carries a block position, an icon kind, and a label |
| 11 | S→C | `PregenRegionDelta` | Per-region state changes that drive the HUD's region grid |
| 12 | S→C | `StudioHotload` | Pack reloaded: which files changed and whether it failed |
| 13 | S→C | `Toast` | A one-off notification with a kind, title, and body |

| Bit | Name | Gates |
|---|---|---|
| `1 << 0` | `CAPABILITY_PREGEN` | Progress frames, end frames, and region deltas |
| `1 << 1` | `CAPABILITY_VISION` | Vision tile requests and marker frames |
| `1 << 2` | `CAPABILITY_CURSOR` | Cursor column lookups |
| `1 << 3` | `CAPABILITY_STUDIO` | Studio hotload notifications |

The client advertises all four and both server families grant all four. Negotiation is an intersection enforced from both sides.

### Handshake

On joining a world the client clears its world-local state and sends `ClientHello`, retrying every 2 s up to 5 attempts. Session states are `IDLE`, `AWAITING_HELLO`, `READY`, `UNSUPPORTED`, and `INCOMPATIBLE`.

| Outcome | State | What you see |
|---|---|---|
| No reply after 5 attempts | `UNSUPPORTED` | The mod stays quiet. This is a non-Iris server |
| Versions differ | `INCOMPATIBLE` | The server still replies naming its version, so the client reports the mismatch instead of claiming the server does not run Iris. Every later frame from that client is dropped |
| Versions match | `READY` | Dimension status and feature frames follow |
| Disconnect | reset | Pregeneration job, tiles, markers, cursor, toasts, and region grid are all cleared |

Frames that arrive before a successful hello, exceed the per-second budget, are oversized or malformed, or query a coordinate outside ±29,999,999 are counted and dropped rather than served. **If client features are absent, check the server log before you suspect the client.**

## Localization

The server's `general.language` drives the boss bar and every shared UI string, including the HUD stats and What overlay rows. Only the three keybind labels and their category come from the client jar's `assets/irisworldgen/lang/*.json`. See [08 - Localization](/iris/08-localization).
