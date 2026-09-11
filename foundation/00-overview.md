---
title: "Overview and Suite Boundaries"
description: "Foundation runtime scope, modules, and ownership boundaries with other Volmit plugins"
published: true
date: 2026-09-06T03:30:00.000Z
tags: "foundation, overview, volmit-suite"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation is the NMS-free, Java 17-bytecode server-essentials layer of the Volmit suite for Paper, Spigot, and Folia from Minecraft 1.20.1 through 26.x. It registers 17 independently controlled modules and 119 canonical command labels: the `foundation` root plus 118 direct commands, each routed by its own command class.

## Runtime modules

| Module ID | Default | Runtime responsibility |
|---|---:|---|
| `spawn` | On | Server spawn, first-join arrival, and optional respawn routing |
| `homes` | On | Named personal homes with configurable names and permission-based limits |
| `warps` | On | Shared named destinations managed by operators |
| `teleport` | On | Consent requests, request preferences, the `/back` command, and back-history capture |
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

Every module is enabled by default except economy. Administration and moderation remain independent of the player-request module and continue using the shared teleport engine when requests and `/back` are disabled. Module changes are applied in dependency order, resources from a failed activation are closed, and unrelated active modules remain available. Static command labels remain registered when a module is disabled, but their route reports that the module is unavailable.

An operator can disable an individual direct command through `commands.disabled` without disabling its module. The list accepts canonical direct names, is case-insensitive, and affects the command, its aliases, tab completion, and the availability state shown in help.

## Command coexistence

The bare labels `/gms`, `/gmc`, `/gmsp`, `/give`, and `/more` are also known React Shorthands labels. Foundation does not replace or modify React's registrations. Doctor and debug reports show the live owner and implementation for these labels; disabling the corresponding React shorthand restores the bare Foundation label.

Every active direct command is also reachable as `/foundation <command>`, including aliases such as `/foundations <command>`. This fallback passes through the same permission, module, and `commands.disabled` checks, so `/foundation give ...` remains available even when another plugin owns `/give`.

## Volmit suite ownership

Foundation deliberately does not duplicate systems already owned by another Volmit plugin.

| Plugin | Retained ownership | Foundation boundary |
|---|---|---|
| Gloss | Public chat formatting, emoji, tab lists, scoreboards, holograms, chat bubbles, damage indicators, display polish, and server-list presentation | Foundation supplies private-message transport and functional inventories; private messages do not enter Gloss public-chat formatting. Gloss chat bubbles honor Bukkit per-viewer visibility, including Foundation vanish. This does not guarantee suppression across every Gloss display surface. |
| React | Performance monitoring, governors, samplers, maps, and runtime mitigation | Foundation publishes typed operational metrics through VolmLib but does not reproduce React controls. Known shorthand collisions use the root fallback described above. |
| Wormholes | Portals, random-teleport portals, projections, dimensional doors, pockets, return tickets, and cross-server traversal | Foundation handles direct teleports, saved destinations, warmups, and `/back`. There is no shared destination-admission, return-ticket, or pending-join-arrival contract, so direct Foundation travel must not enter restricted pockets and a later asynchronous join arrival can still race a configured Foundation first-join spawn. |
| Rift | World discovery, profiles, creation, loading, unloading, quarantine, and restoration | `/world`, `/time`, and `/weather` may target a world already loaded by the server even when Rift is present; Foundation never manages its lifecycle. |
| Adapt | Progression, skills, and abilities | HUD output composes through VolmLib. While both Adapt and Foundation moderation are active, Foundation publishes an optional Adapt `AbilityUsePolicy` that denies ability use for frozen players and active jail sentences; Foundation does not implement skills or progression. |
| Iris | World and terrain generation | Foundation only reads loaded-world state and applies its own teleport safety checks. |
| ShapedPortals | Arbitrary portal shapes, portal records, and portal travel | Foundation does not create or manage portal structures. External teleports enter `/back` history only when the operator explicitly enables that Foundation option. |
| HiddenOre | Mining drops and anti-xray behavior | Foundation does not alter block drops or ore distribution. |
| BileTools | Developer plugin-code reload and diagnostics | Foundation implements VolmLib `ReloadAware` draining and registers a shared diagnostic provider without replacing BileTools. |

Foundation also leaves operator lists, allowlists, profile bans, server-process control, and server reload to Minecraft's native commands. It does not provide competing `/op`, `/whitelist`, `/ban`, `/pardon`, `/stop`, or `/reload` implementations.

The boundaries above are ownership boundaries, not universal interoperability guarantees. Foundation schedules first-join placement only when its own spawn has been set, yields for the configured delay of 20 ticks by default, and skips placement if the player already moved; a later Wormholes arrival can still win or lose that race when Foundation placement is configured. Foundation vanish remains its own hide/show layer. The Adapt policy is limited to Foundation's persisted freeze and active-jail state and does not claim ownership of Adapt's abilities.

Next: [Installation and configuration](/foundation/01-installation-configuration).
