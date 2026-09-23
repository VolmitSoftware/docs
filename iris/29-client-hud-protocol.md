---
title: "Client HUD & Maps"
description: "Iris documentation: Client HUD & Maps"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

The Iris client mod adds a pregeneration HUD, a full-screen Vision map, a What overlay for the block under your cursor, and Studio notifications. It works with Iris on Bukkit-family servers, Fabric, Forge, and NeoForge.

## Install the client mod

Install the Iris jar for your client's mod loader. Use matching Iris and Minecraft versions on the client and server, then join an Iris world.

In singleplayer, installed packs appear as Iris World Types in the create-world screen.

## Controls

Open Minecraft's Controls menu to change these bindings under **Iris**.

| Action | Default key |
|---|---|
| Show or hide the pregeneration HUD | `H` |
| Open the Vision map | `M` |
| Show or hide the What overlay | `J` |

The HUD starts visible and the What overlay starts hidden. These visibility choices reset when you restart the client. `F1` hides both overlays with the rest of Minecraft's HUD.

## Pregeneration HUD

Start a pregeneration with the commands in [Pregeneration](/iris/07-pregeneration). The panel in the top-left corner shows completed chunks, total chunks, percentage, generation rate, and estimated remaining time.

| Display | Meaning |
|---|---|
| Green progress bar | Running |
| Amber progress bar and `PAUSED` | Paused |
| Gray display and elapsed time since the last report | No recent progress report from the server |
| Region grid, when available | Gray regions are pending, amber regions are generating, and green regions are complete |

The display turns gray after five seconds without a progress report and disappears after thirty seconds. This does not stop the job. Use `/iris pregen status` to check it. The panel closes when the job finishes or is cancelled.

## Clients without the Iris mod

On Fabric, Forge, and NeoForge servers, the player who starts a pregeneration sees a boss bar. Clients with the Iris mod use the HUD instead.

On Bukkit-family servers, use `/iris pregen status` or the server console. A graphical server host can also show the desktop pregeneration window.

## Vision map and What overlay

Press `M` in an Iris world to open Vision. Drag to pan, scroll to zoom, and press Escape to close it. The map fills in as its data loads.

Press `J` to show information for the block under your cursor: biome, region, cave biome when present, and height. Vision and What show Iris data only in Iris worlds.

Studio notifications report pack reloads. After a successful reload, Vision and What refresh the affected pack's data. See [Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

## Language

The server's `general.language` controls the HUD, What overlay, and boss bar language. Keybinding labels use the client's language. See [Localization](/iris/08-localization).
