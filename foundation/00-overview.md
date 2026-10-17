---
title: "Overview"
description: "What Foundation does, its 17 modules, and how it shares commands with other plugins"
published: true
date: 2026-10-14T00:00:00.000Z
tags: "foundation, overview, volmit-suite"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation provides server essentials for Paper, Spigot, and Folia on Minecraft 26.1 through 26.3 with Java 25. Its 17 modules can be turned on and off individually.

## Runtime modules

| Module ID | Default | What it covers |
|---|---:|---|
| `spawn` | On | Server spawn, first-join arrival, and optional respawn routing |
| `homes` | On | Named personal homes with configurable names and permission-based limits |
| `warps` | On | Shared named destinations managed by operators |
| `teleport` | On | Consent requests, request preferences, `/back`, and back-history capture |
| `social` | On | Private messages, replies, ignores, and opt-in social spy |
| `utilities` | On | Health, hunger, flight, god mode, speed, hats, workbench, ender chest, and read-only inventory inspection |
| `economy` | Off | Balances, payments, confirmed item sales, administrator controls, and an optional Vault provider |
| `worth` | On | Categorized item values, paged browsing, and in-game price editing |
| `player-state` | On | Manual and automatic AFK plus Foundation-owned vanish |
| `information` | On | Ping, nearby and online lists, seen data, whois, playtime, and rules |
| `gameplay` | On | Game modes, time, weather, positions, surface teleport, confirmed destructive actions, and stack filling |
| `administration` | On | Direct, coordinate, mass, sightline, loaded-world, and offline-location teleports, plus guarded `/sudo` |
| `moderation` | On | Kicks, timed mutes, warning history, freezes, and named timed jails |
| `items` | On | Bounded vanilla item grants, repairs, enchantments, experience, portable workstations, and disposal |
| `mail` | On | Bounded persistent mailboxes with offline delivery and unread state |
| `kits` | On | Inventory-snapshot kits with cooldowns, preview, permissions, and overflow checks |
| `cosmetics` | On | Arrival-flair picker, personal teleport particles, previews, and bounded celebrations |

Everything is on except `economy`. Turning a module off leaves its commands registered; they report that the module is unavailable.

To disable one command without disabling its module, add its canonical name to `commands.disabled`. That hides the command, its aliases, and its tab completion.

## Shared command labels

`/gms`, `/gmc`, `/gmsp`, `/give`, and `/more` are also React Shorthands labels. Foundation does not replace React's registration; whichever plugin registered the label owns it. Disable the React shorthand to get the bare Foundation label back.

Every Foundation command also works as `/foundation <command>`, with the same permission and module checks, so `/foundation give ...` stays available even when another plugin owns `/give`.

## Where Foundation stops

Foundation covers everyday player and staff utilities. Portals, world management, progression, display polish, and performance tuning remain with the Volmit plugins that own those features.

It also leaves `/op`, `/whitelist`, `/ban`, `/pardon`, `/stop`, and `/reload` to the server.

Next: [Installation and configuration](/foundation/01-installation-configuration).
