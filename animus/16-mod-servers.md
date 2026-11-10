---
title: "Animus: Mod Servers"
description: "Running Animus on Fabric, NeoForge and Forge servers, and what differs from Bukkit"
published: true
date: 2026-11-10T00:00:00.000Z
tags: "animus, fabric, neoforge, forge, mods, compatibility"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus runs on Fabric, NeoForge and Forge servers for Minecraft 26.1.2, 26.2 and 26.3 with Java 25.

> Mod server support is experimental. Expect rough edges, and test on a copy of your world before you rely on it. Paper, Spigot and Folia are the supported platforms.
{.is-warning}

It is a server-side mod: players join with an unmodified client. The NPC runtime, definitions, imports, commands, behaviors, triggers, modules, navigation, mounts, riding and combat are the same as on Bukkit and Paper, so a definition behaves the same on every platform. An integrated singleplayer or LAN server loads it too.

## Install

Put the jar for your loader and Minecraft version in the server's `mods` folder.

| Loader | Jar |
|---|---|
| Fabric | `Animus v<version> [Fabric] <minecraft>+<fabric-loader>.jar` |
| NeoForge | `Animus v<version> [NeoForge] <minecraft>+<neoforge>.jar` |
| Forge | `Animus v<version> [Forge] <minecraft>+<forge>.jar` |

Each jar runs only on its own Minecraft version. The Fabric jar includes the Fabric API modules it uses, so the full Fabric API is not required.

## Files

The mod data folder is `config/animus/` in the server folder, the folder that holds `server.properties` and `mods/`. Animus creates it on the first start. It plays the part `plugins/Animus/` plays on Bukkit, so wherever these pages say `plugins/Animus/`, read `config/animus/`. `config.toml` holds the server-wide settings, and `npcs/`, `skins/`, `behaviors/`, `routes/`, `modules/`, `imports/` and the other folders hold the JSON data. The layout matches `plugins/Animus/` on Bukkit, so the folder can be copied between platforms. See [configuration](/animus/03-configuration), [NPC definitions](/animus/04-npc-definitions) and [storage and recovery](/animus/12-storage-recovery).

## Worlds

A world is named by its dimension: `minecraft:overworld`, `minecraft:the_nether`, `minecraft:the_end`, or a modded dimension such as `example:mining`. Definitions written on Bukkit keep working: the level name from `server.properties` (usually `world`) means the overworld, and `world_nether` and `world_the_end` mean the other two vanilla dimensions. A bare vanilla name such as `the_nether` also works. A Bukkit world UUID cannot be resolved; change the definition to use one of these names.

The `world` facts of behavior expressions and the `viewer.world` placeholder give the dimension key. Bukkit gives the world name instead, so a behavior meant for both platforms compares worlds with `same_world`, and a GUI that shows or tests a world on both reads `viewer.world_key`.

After installing, run `/animus status` from the console or as an operator to check that Animus started, then follow the [tutorial introduction](/animus/20-tutorial-introduction).

## Commands and permissions

`/animus` has the same subcommands, arguments, replies and tab completion as on Bukkit; see [commands and permissions](/animus/02-commands-permissions).

| Node | Who has it |
|---|---|
| `animus.status` | Everyone |
| `animus.build.donate` | Everyone |
| `animus.admin` and the nodes under it, `animus.debug`, `animus.debug.mode`, `animus.hotload.notify`, `animus.editor.commands`, `animus.editor.notify` | Operators (permission level 2 and above) |
| `animus.ride` and custom riding nodes | Operators |

A permission mod can grant any node through the vanilla permission named by the node with its first dot as the namespace separator: `animus.admin` is `animus:admin`, which grants every node under it as on Paper, and `animus.ride.town` is `animus:ride.town`.

## What differs from Bukkit

<div class="animus-demo">
<p><strong>Fabric server</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/43-fabric-ingame.webm" aria-label="A fox body, an item display, a schedule walk, an anchor and the quest journal on Fabric" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

| Feature | Mod servers |
|---|---|
| Killable NPCs | `animus:health` works as on Paper, player and mob projectiles, fire, lava and falls included; with no controlled mobs, `mobs` as a damage source has nothing to count |
| Combat protection | No protection adapter is installed, because mod servers have no standard protection API. Every combat hit is allowed; `/animus combat status` shows `protection=none`. A [Java module](/animus/99-java-modules-api#integration-hooks) can provide protection |
| Combat pursuit regions (`pursuit.region`) | Not available, because no protection plugin provides regions. The NPC fights within its normal ranges, the log says so once per NPC, and `/animus combat status` counts it as `region-unavailable` |
| Combat `permissions` and `groups` rules | Read through the permission mapping above. A permission group is the permission `group.<name>`, so it needs a permission mod that grants it |
| Build protection | No protection adapter: every block a [build](/animus/09-building) changes is allowed; `/animus build` shows `protection=none` |
| Money prices in shops, GUIs and hiring | No economy unless a Java module provides one. Use item prices |
| `animus:charge` and `animus:can-afford` | Items and levels work as on Paper. Money uses the same economy as shops, so without a Java module that provides one a cost with money is never affordable |
| Mob control (`/animus combat mob <npc> <mob>`) | Not available; the command says so. Use `/animus combat target <npc> <target>` or `combat guard` instead |
| Manual hit (`/animus combat attack <npc> <target> [damage=1]`) | Available, with the same reach, line of sight and protection checks |
| Plugin events (`VirtualNpcInteractionEvent`, `VirtualNpcDamageEvent` and the others) | Not fired. Behavior triggers receive the same facts on every platform; Java modules receive interaction notices |
| PlaceholderAPI placeholders (`%player_name%`) | Not filled: PlaceholderAPI is a Bukkit plugin, and mod-side placeholder mods are not read. Text shows the `%` placeholders as written; Animus's own `{player_name}` and `{{ }}` holes still work |
| React metrics | Not published; [`/animus debug`](/animus/17-debug-react-metrics) works the same |
| Packet previews (`/animus proof`, `/animus proof folia`) | Not available; they answer that they belong to Bukkit |
| `packetProofEnabled` in `config.toml` | Ignored |
| Chest GUIs with a `5x1` or `3x3` shape | Do not open; use a 9-wide chest shape |
| Gloss | Not available, so `import gloss live`, `gui export gloss` and GUI bindings with `"kind": "gloss"` have nothing to talk to. `import gloss file` and `gui export file` work |

## Recording on mod servers

`/animus record` works on Fabric, NeoForge and Forge with the same syntax as on Paper, and needs `animus.record`. Recordings are saved in `config/animus/recordings/<id>.json`. The ghost wears the recorder's own skin when the server runs in online mode, and a plain skin in offline mode. Arm swings are read from the client's swing packet, and door, trapdoor and fence gate use from its use-on-block packet, because the loaders have no shared event for these.
