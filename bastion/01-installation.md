---
title: "Bastion: Installation and configuration"
description: Requirements, first start, settings, and stored data
published: true
date: 2026-11-06T00:00:00.000Z
tags: bastion, installation, configuration
editor: markdown
dateCreated: 2026-10-14T17:39:17.022Z
---

Bastion requires Minecraft 26.1 through 26.3 on Java 25 or newer. On any other Minecraft version or an older Java release it refuses to load before downloading libraries, and the console names the version it found. It supports Spigot, Paper, Purpur, Leaf, Folia, and Canvas with the capability limits listed under [integrations](/bastion/03-integrations-languages).

## Install

1. Stop the server and place `Bastion.jar` in its `plugins/` directory.
2. Start the server and check that Bastion enables successfully.
3. Open `/bastion config` to review settings and `/bastion menu` to manage claims.

VolmLib is included where needed and does not require a separate plugin installation. SlimJar resolves Gson, TOML4J, and Kyori Adventure libraries before Bastion starts its services. The first start needs access to their repositories; installed dependencies are cached for reuse. Back up the Bastion data folder together with the world.

Claim changes are committed to `storage/journal.jsonl` before they take effect. Each entry records only what changed, and `storage/claims.json` is rewritten when the journal reaches 8 MB. Completed or cancelled fuel, purchase and refunded-deposit records are removed about an hour after they settle, unless an active rental, deposit or claim anchor still refers to them; expired invitations are removed on the next maintenance pass. If the server stops mid-write, the next start discards the incomplete final entry, which was never acknowledged, and logs a warning. Other damaged storage stops startup without resetting data. In that case, and for any other startup failure, Bastion removes its services and listeners and enters read-only lockdown until the problem is repaired and the server restarts. Configuration reloads keep claim-block accrual progress unless the `accrual` settings change.

## Settings

The configuration editor exposes 49 general settings across two pages. `/bastion policy` edits the structured world and wilderness rules. `/bastion feedback` edits denial delivery and its cooldown. All three use the same validation as `config.toml`. The configuration editor's bottom row holds previous/next, language editing, and close controls. Hot reload defaults on; invalid replacements retain the last valid runtime state.

| Section | Controls | Defaults to review |
| --- | --- | --- |
| `general` | Claim creation, language, hot reload, splash, diagnostics, notifications, metrics, excluded worlds | Creation and hot reload enabled; update checks and metrics off |
| `limits` | Allowance, claims, chunks, regions, members | 16,384 block columns and two claims per player |
| `power` | Starting power, cap, upkeep, item fuel, economy purchases | Upkeep and economy purchases off; amethyst shard fuel |
| `accrual` | Claim blocks earned during active play | Off |
| `purchases` | Claim-block purchases through Vault | Off |
| `anchors` | Barrel registration and manual refueling | On |
| `market` | Child-plot sales, rentals, and reminders | On; payments need a compatible economy provider |
| `maps` | Web-map publication, appearance, hidden worlds, batch sizes | Publication off |
| `protection` | Global and per-world claim/wilderness flags, optional permission conditions, creature types, spawn reasons | No overrides; wilderness actions remain allowed |
| `feedback` | Default denial channel, per-action channels, shared player cooldown | Chat, 2,000 milliseconds, no channel overrides |

Disabling new claiming does not remove protection from existing land. Empty-power claims remain protected; when upkeep is enabled, they cannot expand. One claim block represents one X/Z column through the full world height. An empty chunk costs 256 claim blocks.

The startup splash shows the plugin, server, Java and date details. Set `general.splashScreen=false` to turn it off.

## Files

All paths below are relative to `plugins/Bastion/`.

| Path | Contents |
| --- | --- |
| `config.toml` | Validated server settings |
| `gui/config.toml` | Configuration editor item materials |
| `.libs/` | Downloaded and relocated runtime-library cache |
| `languages/` | Installed editable message catalogs and personal selections |
| `languages/.upstream/` | Bastion's record of the last language download; do not edit |
| `languages/language-preferences.properties` | Saved personal language choices |
| `storage/` | Claims, allowances, transaction records, and saved notifications |
| `storage/inbox/` | Per-player notification accounts |
| `debug/` | Locally saved diagnostic reports |

World-owned anchor data also remains attached to its world. Keep the data folder and world backups together.

[Commands](/bastion/02-commands) · [Languages and integrations](/bastion/03-integrations-languages) · [Bastion](/bastion)
