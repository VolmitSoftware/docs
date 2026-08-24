---
title: "Client HUD & Protocol"
description: "Iris documentation: Client HUD & Protocol"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Installed on a Minecraft client, the Iris mod adds a native pregeneration
HUD and a full-screen Vision map. It also adds a What overlay for the block
under your cursor, Studio toasts, and Iris world types in singleplayer. It talks to
Iris servers over one channel, `irisworldgen:main`. The channel works the
same whether the server is a mod loader or a Bukkit-family plugin. Vanilla
clients never see the channel. They fall back to server-side progress
reporting. See also [07 - Pregeneration](/iris/07-pregeneration),
[08 - Localization](/iris/08-localization),
[10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas), and
[30 - Platform Differences](/iris/30-platform-differences).

## Get the HUD working

There is no separate client download. The Fabric, Forge, and NeoForge mod
jars each contain the client code, gated to the client distribution. The
same jar you run on a server is the one you install on a client. The Iris
and Minecraft versions on both ends must match. A mismatch is the most
common reason the HUD never appears.

1. Install the Iris mod on your client and join an Iris server.
2. Start a small pregeneration from the server, for example
   `/iris pregen start radius=512 center=0,0 gui=false`.
3. Look at the top-left of your screen.

Success is a dark panel at 6,6 with a green title, a
`done / total (percent%)` line, a green progress bar, and a rate-and-ETA
line under it. If region deltas arrive you also get a small region grid
below the panel.

Then check the other two surfaces:

4. Press `M`. The Vision map should open full-screen. Drag to pan. Scroll
   to zoom. Press Esc to close.
5. Press `J` to toggle the What overlay. Then look at a block. It should
   list the biome, the region, the cave biome if there is one, and the
   height.
6. Walk into a non-Iris world. Vision and What stop reporting Iris data.
   The client clears its cached tiles and markers when the server tells it
   the dimension changed.
7. Disconnect and reconnect. Then repeat step 3. This proves the handshake
   actually reruns. The UI must not show stale state.

If the panel never appears, work in this order. Confirm the versions match
on both sides. Reconnect to force a fresh handshake. Then read the server
log. A protocol version mismatch and a rejected frame both leave a trace
there.

One thing that is not evidence: a working boss bar on a modded server
proves the pregeneration job is running. It also proves the server can talk
to your client's *vanilla* surface. It does not prove the Iris payload path
works. If the boss bar appears at all, the payload path did **not** come
up for you. See below.

## What each combination gives you

| Server | Vanilla client | Client with the Iris mod |
|---|---|---|
| Modded Iris (Fabric/Forge/NeoForge) | Boss bar for whoever started the pregeneration | Native HUD, Vision, What, and toasts over custom payloads. No boss bar |
| Bukkit-family Iris | Console output and `/iris pregen status`. No boss bar, no Iris client features | The same native HUD, Vision, What, and toasts, carried over plugin messaging on the same channel |
| Non-Iris server | Nothing | The mod goes inert once the handshake times out |

In singleplayer, installed packs register world generator presets under the
`irisworldgen` namespace. They appear as selectable World Types in the
create-world screen. The integrated server runs the same engine as a
dedicated one.

## Keybinds

Category **Iris** (`key.categories.irisworldgen.iris`). All three are
rebindable in Controls.

| Action | Default | Translation key |
|---|---|---|
| Toggle pregen HUD | `H` | `key.irisworldgen.toggle_pregen_hud` |
| Open Iris Vision map | `M` | `key.irisworldgen.open_vision_map` |
| Toggle Iris What overlay | `J` | `key.irisworldgen.toggle_what_overlay` |

The HUD starts visible. The What overlay starts hidden. Both toggles are
pure client state. They are not remembered across restarts.

If you press F1, the whole layered HUD hides. The pregeneration panel and
What overlay disappear. Toasts are pumped from a separate per-tick hook.
They still advance and expire while the GUI is hidden. They do not pile up
until you press F1 again.

## Pregen HUD

The panel draws at 6,6 whenever a tracked job exists and has not expired.

| Element | Content |
|---|---|
| Title | The localized pregen header |
| Stats | `done / total (percent%)`, thousands-separated, percent to one decimal |
| Bar | Green while running, amber while paused, gray once stale |
| Tail | Rate and ETA while running, `PAUSED` while paused, or "no updates for N s" once stale |
| Region grid | Only when region deltas have arrived. Each cell is a region: gray pending, amber generating, green done |

Two client-side timers, both measured from the last progress frame
received:

| Threshold | Value | Effect |
|---|---|---|
| Stale | 5 s | Every color mutes to gray and the tail switches to the stale label |
| Expire | 30 s | The panel stops drawing entirely |

Both timers key off frame arrival. A stale panel means the frames stopped.
It does not mean the job stopped. A paused job keeps sending progress
frames and stays amber rather than going gray. A `PregenEnd` frame clears
the job and the region grid immediately. There is no wait for either timer.

## Boss bar fallback

On modded servers, `ModdedPregenBossBar` shows a boss bar to the player who
started the pregeneration. It is green while running and yellow while
paused. It updates every 10 ticks. The title comes from
`iris.runtime.pregen.bossbar.running` / `.paused`.

It is suppressed if that player already has a ready protocol session with
`CAPABILITY_PREGEN`. That is the deliberate rule. You get the boss bar
**or** the native HUD, never both. So if you installed the client mod and
still see a boss bar, the handshake did not complete.

Bukkit-family servers have no equivalent boss bar. Players without the mod
get `/iris pregen status`, the console, and the desktop pregeneration
window. Players with the mod get the same native HUD as on modded,
delivered over plugin messaging.

## Vision map and What overlay

| Feature | Requires | Notes |
|---|---|---|
| Vision map (`M`) | Ready session, an Iris dimension, and `CAPABILITY_VISION` from the server | Full-screen. Drag to pan, scroll to zoom, Esc to close |
| What overlay (`J`) | Ready session, an Iris dimension, and `CAPABILITY_CURSOR` | Reports biome, region, cave biome when present, and height for the cursor column |
| Studio toasts | The client advertises `CAPABILITY_STUDIO` | One hotload frame renders one toast. A successful hotload for the current pack also clears Vision tiles, markers, and What data so the next request reflects the new runtime |
| Dimension status | Only a completed handshake | Carries pack key, dimension key, seed, and height bounds. A world that is not Iris-generated clears the client's tiles and markers |

Zoom level is part of the tile cache key. If you change zoom, every cached
tile becomes invalid. The map repaints as new tiles arrive under the
8-per-second request budget. That is expected behavior, not a stall.
The server retains at most eight pending tiles per session, coalesces repeated
requests for the same tile, and rotates across sessions while two bounded
encoder workers drain the global queue. Under saturation, one client cannot
fill the queue indefinitely or exclude every other connected client.

Vision tiles are split across frames: 24000 bytes of payload per chunk
after a 25-byte header. One markers frame carries at most 256 markers.

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

Cursor lookups get their own budget rather than a slice of the frame
budget. Each one resolves biome, region, cave biome, and height: four engine
column queries. The server coalesces each session to its latest pending cursor
position and resolves it off the authoritative game thread. A client at the
four-per-second limit therefore performs at most 16 column resolves per second.

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

Capability bits:

| Bit | Name | Gates |
|---|---|---|
| `1 << 0` | `CAPABILITY_PREGEN` | Progress frames, end frames, and region deltas |
| `1 << 1` | `CAPABILITY_VISION` | Vision tile requests and marker frames |
| `1 << 2` | `CAPABILITY_CURSOR` | Cursor column lookups |
| `1 << 3` | `CAPABILITY_STUDIO` | Studio hotload notifications |

The client advertises all four. Bukkit and modded servers both grant all
four. Negotiation is an intersection. It is enforced from both sides
rather than stored as one mask. The server checks the client's advertised
bits before it serves a request. The client checks the server's granted
bits before it offers a feature.

## Handshake

1. On joining a world the client clears its world-local state. It sends
   `ClientHello` with protocol version `1` and its capability mask.
2. It retries every 2 s, up to 5 attempts. After that the session goes
   `UNSUPPORTED` and the mod stays quiet. This is what happens on a
   non-Iris server.
3. If the versions differ, the server still replies with a `ServerHello`
   naming its version. The client can land in `INCOMPATIBLE` and report
   the mismatch. It does not time out and claim the server does not run
   Iris. The session stays un-ready. Every later frame from that client
   is dropped.
4. On a version match the session becomes `READY`. Dimension status and
   feature frames follow.
5. On disconnect the session resets. All world-local state is cleared:
   pregeneration job, tiles, markers, cursor, toasts, and region grid.

Session states are `IDLE`, `AWAITING_HELLO`, `READY`, `UNSUPPORTED`, and
`INCOMPATIBLE`.

On the server, frames that arrive before a successful hello are counted
and dropped. Frames over the per-second budget are counted and dropped.
Oversized or malformed frames are rejected by the decoder. A cursor query
outside ±29,999,999 is rejected rather than clamped. A spoofed frame is
recorded instead of served. Every one of these keeps a counter. If client
features are absent, check the server log before you suspect the client.

## Localization

The server's `general.language` drives the boss bar and every shared UI
string. This includes the HUD stats and What overlay rows. They resolve
through `ClientUiMessages` on whichever process renders them. Only the
three keybind labels and their category come from the client jar's
`assets/irisworldgen/lang/*.json`. See
[08 - Localization](/iris/08-localization).

## Operator verification checklist

- Modded server plus Iris client: progress on the native HUD, and **no**
  boss bar for that player
- Bukkit Iris plus Iris client: the same HUD, over plugin messaging
- Vanilla client on either server: no protocol traffic, and on modded the
  boss bar as described
- Non-Iris server plus Iris client: silent after roughly 10 s of hello
  retries
- `H` toggles the HUD, `M` opens Vision where the capability is granted,
  `J` toggles What where the capability is granted
