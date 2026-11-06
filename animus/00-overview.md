---
title: "Animus: Overview"
description: "What Animus is, how its NPCs work, and where each topic is documented"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, npc, overview"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus manages NPCs on Paper, Spigot and Folia servers, and on Fabric, NeoForge and Forge servers as a server-side mod. Every NPC is a JSON file you can edit by hand, through `/animus` commands, or in the [web editor](/animus/14-web-editor). NPCs can walk routes, carry riders, fight, build schematics, run behaviors, open shops and chest GUIs, and play rig animations. Players join with an unmodified client.

## Core concepts

### JSON definitions

Each NPC is one definition file at `npcs/<group>/<id>.json` in the data folder. The `id` is unique across all groups and the `uuid` never changes. Every accepted change raises the definition's `revision`. Behaviors, routes, skins, shops, GUIs, rigs and animations are separate JSON documents that a definition refers to by id. Plugin-wide settings are the one exception: they live in [`config.toml`](/animus/03-configuration).

Saving any of these files applies it within about a second. An invalid edit is refused with its exact field error, and the last valid version stays active. See [configuration](/animus/03-configuration#live-apply) and [storage and recovery](/animus/12-storage-recovery).

### Dormant until spawned

Creating, cloning or importing an NPC leaves it dormant (`"spawned": false`). A dormant NPC is stored and editable but has no body, fires no triggers and costs nothing at run time. `/animus spawn <id>` checks the world, body type, name and equipment against the running server, then saves the intent to spawn. The NPC appears once a player in range has received its chunk, and it comes back after a restart. `/animus despawn <id>` returns it to dormant.

### Virtual, packet-only bodies

An NPC body is never a world entity. Animus sends each player the packets that draw the body, its equipment, name, hologram lines and passengers, and keeps the NPC's real position and health on the server. Clicks and hits are checked on the server against reach, line of sight, rate and a virtual hitbox before anything reacts. Nothing loads chunks to show or move an NPC, and other plugins do not see NPCs as entities.

### Per-viewer presentation

Each player gets their own copy of the presentation, built from what that player can currently see. Joining, changing worlds, or a chunk leaving and re-entering view rebuilds the NPCs for that player. The same mechanism lets a [web editor preview](/animus/14-web-editor#previews) show a draft NPC to one administrator while everyone else still sees the live one.

### Modules

A definition's `modules` object holds per-NPC feature settings keyed by `namespace:name`, such as `animus:navigation`, `animus:combat`, `animus:riding` or `animus:shop`. The `animus` namespace belongs to the built-in features. Settings from other namespaces, including data kept by an import, are preserved even when nothing reads them.

Trusted Java modules extend Animus with new behavior actions, conditions, triggers and import converters. They are jars placed in `modules/` and load at startup. See [Java modules and API](/animus/99-java-modules-api).

## Sections

| Page | Covers |
|---|---|
| [Installation and compatibility](/animus/01-installation-compatibility) | Requirements, supported versions, file layout and platform differences |
| [Commands and permissions](/animus/02-commands-permissions) | Every `/animus` command and permission node |
| [Configuration](/animus/03-configuration) | Every `config.toml` setting and live apply |
| [NPC definitions](/animus/04-npc-definitions) | Definition fields, appearance, equipment, holograms and poses |
| [Movement, mounts and riding](/animus/05-movement-mounts-riding) | Navigation, routes, look-close, mounted NPCs, riding and hiring |
| [Rigs and animations](/animus/06-rigs-animations) | Bone rigs, animation clips and the resource pack |
| [Behaviors](/animus/07-behaviors) | JSON behaviors, triggers, actions and stored state |
| [Combat](/animus/08-combat) | The combat module, targets, guards and protection |
| [Building](/animus/09-building) | NPCs that build schematics |
| [Shops](/animus/10-shops) | Shops, trades, stock and the dtlTraders importer |
| [GUIs, holograms and menus](/animus/11-guis-holograms-menus) | Chest GUIs, holograms and holographic menus in Gloss formats |
| [Storage and recovery](/animus/12-storage-recovery) | Last-valid recovery, transactions, rollback and limits |
| [Migrating from Citizens](/animus/13-migrating-from-citizens) | Importing Citizens, Sentinel, Denizen, dtlTraders and Shopkeepers data |
| [Web editor](/animus/14-web-editor) | Pairing the browser editor and what it edits |
| [Folia](/animus/15-folia) | How NPCs run on Folia regions and what differs there |
| [Mod servers](/animus/16-mod-servers) | Fabric, NeoForge and Forge |
| [Debug, React and metrics](/animus/17-debug-react-metrics) | `/animus debug summary` and the metrics published to React |
| [Java modules and API](/animus/99-java-modules-api) | Trusted modules, capabilities and the Java API |
