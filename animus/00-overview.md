---
title: "Animus: Overview"
description: "What Animus is, how its NPCs work, and where each topic is documented"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, npc, overview"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus manages NPCs on Paper, Spigot and Folia servers, and, as an experimental server-side mod, on Fabric, NeoForge and Forge servers. Every NPC is a JSON file you can edit by hand, through `/animus` commands, or in the [web editor](/animus/14-web-editor). NPCs can walk routes, carry riders, fight, build schematics, run behaviors, open shops and chest GUIs, and play rig animations. Players join with an unmodified client.

## Core concepts

### JSON definitions

Each NPC is one definition file at `npcs/<folder>/<id>.json` in the data folder. The `id` is unique across all folders and the `uuid` never changes. Every accepted change raises the definition's `revision`. Behaviors, routes, skins, shops, GUIs, rigs and animations are separate JSON documents that a definition refers to by id. Plugin-wide settings are the one exception: they live in [`config.toml`](/animus/03-configuration).

Saving any of these files applies it within about a second; see [live apply](/animus/03-configuration#live-apply). An invalid edit is refused with its exact field error, and the last valid version stays in use. See [storage and recovery](/animus/12-storage-recovery).

### Spawned, despawned and active

A cloned or imported NPC is saved despawned (`"spawned": false`), which these pages call dormant: it is stored and editable, but has no body, fires no triggers and costs nothing at run time. A new NPC made with **New NPC** in the [toolkit](/animus/21-in-game-toolkit#new-npc) or with `/animus create` spawns at once; a sneak-click on **New NPC** saves it dormant. `/animus spawn <id>` marks it spawned, and `/animus despawn <id>` marks it despawned again. Both are saved, so a restart keeps them.

A spawned NPC is active while it is loaded in a world: its chunk is loaded and it runs its routes, triggers and combat. A spawned NPC in an unloaded chunk waits and becomes active again when the chunk loads. See [activation and editing](/animus/04-npc-definitions#activation-and-editing).

### Virtual, packet-only bodies

An NPC body is never a world entity. Animus sends each player the packets that draw the body, its equipment, name, hologram lines and passengers, and keeps the NPC's real position and health on the server. Clicks and hits are checked on the server against reach, line of sight, rate and a virtual hitbox before anything reacts. Nothing loads chunks to show or move an NPC, and other plugins do not see NPCs as entities.

### Per-viewer presentation

Each player gets their own copy of the presentation, built from what that player can currently see. Joining, changing worlds, or a chunk leaving and re-entering view rebuilds the NPCs for that player. The same mechanism lets a [web editor preview](/animus/14-web-editor#previews) show a draft NPC to one administrator while everyone else still sees the live one.

### Modules

A definition's `modules` object holds per-NPC feature settings keyed by `namespace:name`, such as `animus:navigation`, `animus:combat`, `animus:riding` or `animus:shop`. The `animus` namespace belongs to the built-in features. Settings from other namespaces, including data kept by an import, are preserved even when nothing reads them.

Trusted Java modules extend Animus with new behavior actions, conditions, triggers and import converters. They are jars placed in `modules/` and load at startup. See [Java modules and API](/animus/99-java-modules-api).

## Glossary

| Term | Meaning |
|---|---|
| Definition | One NPC's JSON file, `npcs/<folder>/<id>.json` |
| Folder | The path under `npcs/` a definition sits in, such as `world/town`. The definition's `group` field holds it, and `folder=` on commands names it |
| Trait group | A file in `groups/` holding values that several NPCs share; an NPC lists the trait groups it takes in its `groups` field. See [trait groups](/animus/18-trait-groups) |
| Spawned, despawned | Whether the NPC should exist in its world. Saved in the definition as `"spawned"` |
| Dormant | Saved and not spawned |
| Active | Spawned and loaded in a world right now |
| Route | The points an NPC walks, from `routes/<name>.json` or written into its `animus:navigation` module. See [routes](/animus/05-movement-mounts-riding#routes) |
| Recording | A player's captured movement that an NPC replays. See [performance recordings](/animus/19-performance-recordings) |
| Live apply | A saved data file taking effect within a second, without a reload. The chat line and permission call it hotload. See [live apply](/animus/03-configuration#live-apply) |
| Note block chime | The sound operators hear when a saved file is applied or refused |
| Transaction | One saved change with a rollback receipt. Replies show its id as `tx`, with **[Undo]** |
| Web editor | The web editor at [animus-editor.web.app](https://animus-editor.web.app) |
| Pairing link | The single-use link `/animus editor pair` prints to connect the web editor to a server |
| Module | Per-NPC feature settings in a definition's `modules`, such as `animus:navigation`. A Java module is a trusted jar in `modules/` that adds capabilities |

## Sections

| Page | Covers |
|---|---|
| [Tutorial: introduction](/animus/20-tutorial-introduction) | Install, set up, and make, skin and walk your first NPC |
| [Tutorial: first NPC](/animus/22-tutorial-first-npc) | Make, edit, skin, dress and sort NPCs with the in-game toolkit |
| [Tutorial: movement](/animus/23-tutorial-movement) | Routes, recordings, mounts and riding in game |
| [Tutorial: conversations, shops and combat](/animus/24-tutorial-interaction) | Behaviors, conversations, shops, holograms, GUIs, combat and health |
| [Tutorial: web editor](/animus/25-tutorial-web-editor) | Pairing, editing, applying and undoing in the browser |
| [Installation and compatibility](/animus/01-installation-compatibility) | Requirements, supported versions, file layout and platform differences |
| [Commands and permissions](/animus/02-commands-permissions) | Every `/animus` command and permission node |
| [Configuration](/animus/03-configuration) | Every `config.toml` setting and live apply |
| [Migrating from Citizens](/animus/13-migrating-from-citizens) | Importing Citizens, Sentinel, Denizen, dtlTraders and Shopkeepers data |
| [Quest plugins](/animus/26-quest-plugins) | NPCs in Quests, BeautyQuests, BetonQuest, NotQuests and Typewriter, and relinking quests after a Citizens import |
| [NPC definitions](/animus/04-npc-definitions) | Definition fields, spawning, appearance, equipment, holograms and poses |
| [Trait groups](/animus/18-trait-groups) | Values shared by many NPCs, and how they merge |
| [LibsDisguises](/animus/34-libsdisguises) | NPCs that look like a LibsDisguises disguise, and importing Citizens disguises |
| [Movement, mounts and riding](/animus/05-movement-mounts-riding) | Navigation, routes, look-close, mounted NPCs, riding and hiring |
| [NPC schedules](/animus/30-npc-schedules) | Places an NPC goes at set times of day, and importing NPC Destinations |
| [Performance recordings](/animus/19-performance-recordings) | Recording a player's movement and replaying it on an NPC |
| [Rigs and animations](/animus/06-rigs-animations) | Bone rigs, animation clips and the resource pack |
| [Model Engine](/animus/32-model-engine) | Model Engine models on NPCs and importing modelled Citizens NPCs |
| [Behaviors](/animus/07-behaviors) | JSON behaviors, triggers, actions and stored state |
| [Combat](/animus/08-combat) | The combat module, targets, guards and protection |
| [Building](/animus/09-building) | NPCs that build schematics |
| [In-game toolkit](/animus/21-in-game-toolkit) | Editing NPCs in game with `/animus tools` |
| [Web editor](/animus/14-web-editor) | Pairing the web editor and what it edits |
| [Shops](/animus/10-shops) | Shops, trades, stock and the dtlTraders importer |
| [Quests](/animus/38-quests) | Animus quests: givers, stages, objectives, rewards and the journal |
| [GUIs, holograms and menus](/animus/11-guis-holograms-menus) | Chest GUIs, holograms and holographic menus in Gloss formats |
| [Storage and recovery](/animus/12-storage-recovery) | Last-valid recovery, transactions, rollback and limits |
| [Folia](/animus/15-folia) | How NPCs run on Folia regions and what differs there |
| [Mod servers](/animus/16-mod-servers) | Fabric, NeoForge and Forge (experimental) |
| [MythicMobs](/animus/36-mythicmobs) | NPCs made from Mythic mobs, their skills and the `mythic:cast-skill` action |
| [Debug, React and metrics](/animus/17-debug-react-metrics) | `/animus debug summary` and the metrics published to React |
| [Java modules and API](/animus/99-java-modules-api) | Trusted modules, capabilities and the Java API |
