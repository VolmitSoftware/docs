---
title: "Overview and Suite Boundaries"
description: "Foundation runtime scope, modules, and ownership boundaries with other Volmit plugins"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "foundation, overview, volmit-suite"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation is the server-essentials layer of the Volmit suite. Features are divided into independently reloadable modules, and the default configuration enables every current module except economy.

## Runtime modules

| Module ID | Default | Runtime responsibility |
|---|---:|---|
| `spawn` | On | Server spawn, first-join arrival, and optional respawn routing |
| `homes` | On | Named personal homes with configurable names and permission-based limits |
| `warps` | On | Shared named destinations managed by operators |
| `teleport` | On | Teleport requests, warmups, cooldowns, safe landing, and back history |
| `social` | On | Private messages, replies, ignores, and opt-in social spy |
| `utilities` | On | Health, hunger, flight, god mode, speed, hats, workbench, ender chest, and read-only inventory inspection |
| `economy` | Off | Balances, payments, confirmed item sales, administrator controls, and an optional Vault provider |
| `worth` | On | Complete categorized item values, paged browsing, and conflict-safe in-game price editing |
| `player-state` | On | Manual and automatic AFK plus Foundation-owned vanish |
| `information` | On | Ping, nearby and online lists, seen data, whois, playtime, and rules |
| `gameplay` | On | Game modes, time, weather, positions, surface teleport, confirmed destructive actions, and stack filling |
| `administration` | On | Direct, coordinate, mass, sightline, loaded-world, offline-location teleports, and guarded `/sudo` |
| `moderation` | On | Kicks, timed mutes, warning history, freezes, and named timed jails |
| `items` | On | Bounded vanilla item grants, repairs, enchantments, experience, portable workstations, and disposal |
| `mail` | On | Bounded persistent mailboxes with offline delivery and unread state |
| `kits` | On | Atomic inventory-snapshot kits with cooldowns, preview, permissions, and overflow checks |
| `cosmetics` | On | VolmLib arrival-flair picker, personal teleport particles, previews, and bounded celebrations |

Module state changes from `foundation.toml` or the control center are reconciled in dependency order. A failed module is rolled back and isolated; active unrelated modules remain available.

## Volmit suite ownership

Foundation deliberately does not duplicate systems already owned by another Volmit plugin.

| Plugin | Retained ownership | Foundation boundary |
|---|---|---|
| Gloss | Chat formatting, emoji, tab lists, scoreboards, holograms, display polish, and server-list presentation | Foundation only supplies private-message transport and functional inventory interfaces |
| React | Performance monitoring, governors, samplers, maps, and runtime mitigation | Foundation exposes no TPS, profiling, entity-governor, or performance-control replacement |
| Wormholes | Portals, random teleport portals, projections, dimensional doors, pockets, and cross-server traversal | Foundation handles direct player requests, saved destinations, warmups, and `/back` |
| Rift | World discovery, profiles, loading, unloading, creation, quarantine, and restoration | Foundation may change time or weather in an already loaded world but does not manage world lifecycle |
| Adapt | Progression, skills, and abilities | Foundation does not add progression rewards or ability systems |
| Iris | World and terrain generation | Foundation reads loaded-world state only |
| HiddenOre | Mining drops and anti-xray behavior | Foundation does not alter block drops or ore distribution |
| BileTools | Developer plugin-code reload and diagnostics | Foundation implements the VolmLib reload-aware drain contract but does not replace BileTools |

Foundation also leaves native server ownership, operator lists, allowlists, server-process control, and profile bans to Minecraft's built-in commands. This avoids maintaining a second authority for `/op`, `/whitelist`, `/ban`, `/pardon`, `/stop`, or `/reload`.

Next: [Installation and configuration](/foundation/01-installation-configuration).
