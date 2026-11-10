---
title: "Animus: Installation and Compatibility"
description: "Requirements, installation, data folder layout and platform differences"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, installation, compatibility, paper, spigot, folia, fabric, neoforge, forge"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Minecraft | 26.1.2, 26.2 and 26.3 |
| Java | 25 |
| Plugin servers | Paper, Spigot and Folia |
| Mod servers | Fabric, NeoForge and Forge, dedicated server. Experimental |
| Client | Unmodified vanilla client |

Optional plugins on Paper, Spigot and Folia:

| Plugin | Used for |
|---|---|
| WorldGuard | Protection checks for [combat](/animus/08-combat), [builds](/animus/09-building) and doors that NPCs open on routes; combat pursuit regions |
| Vault | Money prices in [shops](/animus/10-shops), GUIs and NPC hiring |
| Gloss | Importing and exporting GUIs, holograms and menus in [Gloss formats](/animus/11-guis-holograms-menus) |
| React | Receiving Animus [metrics](/animus/17-debug-react-metrics) |
| PlaceholderAPI | Filling `%placeholders%` in NPC names, holograms, messages and GUIs; see [placeholders](/animus/03-configuration#placeholders) |

## Install on Paper, Spigot or Folia

1. Stop the server.
2. Put `Animus v0.1.0 [CraftBukkit] 26.1.2-26.3.jar` in `plugins/`. The same jar runs on Paper, Spigot and Folia for every supported Minecraft version.
3. Start the server. Animus creates `plugins/Animus/` and writes a default `config.toml`.
4. Run `/animus status` to check that it started.

Next, follow the [tutorial introduction](/animus/20-tutorial-introduction) to make, skin and walk a first NPC. Moving from Citizens? Follow [migrating from Citizens](/animus/13-migrating-from-citizens) before you create NPCs by hand.

## Install on a mod server

> Mod server support is experimental. Expect rough edges, and test on a copy of your world before you rely on it.
{.is-warning}

Put the jar for your loader and Minecraft version in the server's `mods/` folder. Each jar runs only on its own Minecraft version.

| Loader | Jar |
|---|---|
| Fabric | `Animus v0.1.0 [Fabric] <minecraft>+<fabric-loader>.jar` |
| NeoForge | `Animus v0.1.0 [NeoForge] <minecraft>+<neoforge>.jar` |
| Forge | `Animus v0.1.0 [Forge] <minecraft>+<forge>.jar` |

The Fabric jar carries the Fabric API modules it needs, so the full Fabric API is not required. The data folder is `config/animus/`. See [mod servers](/animus/16-mod-servers), then the [tutorial introduction](/animus/20-tutorial-introduction).

## File layout

Everything lives in `plugins/Animus/` (or `config/animus/` on mod servers). The layout is the same on every platform, so the folder can be copied between them.

| Path | Contents |
|---|---|
| `config.toml` | Plugin-wide [settings](/animus/03-configuration) |
| `npcs/<folder>/<id>.json` | [NPC definitions](/animus/04-npc-definitions) |
| `groups/<id>.json` | [Trait groups](/animus/18-trait-groups) |
| `recordings/<id>.json` | [Performance recordings](/animus/19-performance-recordings) |
| `skins/<sha256>.json` | Skin documents, named by content hash |
| `routes/` | Reusable [navigation routes](/animus/05-movement-mounts-riding) |
| `behaviors/<namespace>/<path>.json` | [Behaviors](/animus/07-behaviors) |
| `packs/<pack-id>/` | Behavior packs |
| `shops/` | [Shops](/animus/10-shops) |
| `gui/inventories/`, `gui/menus/`, `gui/holograms/`, `gui/text-animations/` | [Chest GUIs, menus, holograms](/animus/11-guis-holograms-menus) and text animations |
| `rigs/`, `animations/` | [Rigs and animations](/animus/06-rigs-animations) |
| `models/` | Blockbench `.bbmodel` files converted into rigs |
| `pack/` | Resource pack sources under `pack/assets/` and built output under `pack/out/` |
| `schematics/` | Schematics for [building](/animus/09-building) |
| `modules/` | Trusted [Java module](/animus/99-java-modules-api) jars |
| `imports/`, `imports/inbox/` | Import sources and staged import bundles |
| `exports/gui/` | GUI folders and bundles written by `/animus gui export file` |
| `schemas/` | JSON schemas written by `/animus behaviors schema` |
| `state/` | Generated recovery checkpoints, transaction journal, behavior variables, hire contracts and editor tokens |
| `backups/` | Rollback receipts for each transaction |
| `logs/` | Shop transaction logs |

Plugin settings use TOML. Every other document uses JSON. Do not edit or delete `state/` or `backups/` by hand; see [storage and recovery](/animus/12-storage-recovery).

## Removing Animus

NPCs, holograms and GUIs are packets only, so removing Animus leaves nothing in the world.

1. Stop the server.
2. Delete `plugins/Animus-<version>.jar` (on mod servers, the mod jar under `mods/`).
3. To remove the data too, delete `plugins/Animus/` (`config/animus/` on mod servers). Keep it to reinstall later with every NPC, behavior, shop and receipt intact. `plugins/bStats/` is shared with other plugins; leave it.

The web editor's pairing for this server lives in `state/editor/`. Deleting the data folder ends every pairing, and a reinstall makes a new identity with a new fingerprint, so browsers pair again. Revoke tokens first with `/animus editor revoke all` if the folder is kept but the editor should lose access.

## Platform differences

Paper and Spigot run every feature. Folia and mod servers run the same NPC runtime, definitions, commands, behaviors, navigation, mounts, riding, combat and building, with these differences:

| Feature | Paper and Spigot | Folia | Fabric, NeoForge, Forge |
|---|---|---|---|
| NPCs, behaviors, triggers, navigation | Yes | Yes, each NPC on the region that owns its chunk | Yes |
| Riding, mounted NPCs, combat module, hiring | Yes | Yes | Yes |
| Building (`/animus build`) | Yes | Yes, each build turn on the region that owns where it works | Yes, with no protection checks |
| Mob control (`/animus combat mob`) | Yes | Yes, the mob on its own region | No |
| Manual hit (`/animus combat attack`) | Yes | Yes, answered in the server log | Yes |
| `targetableByMobs` drawing real mobs | Yes | No effect | No effect |
| Combat and build protection | WorldGuard when installed | Same as Paper, asked on the region that owns the target | None |
| Money prices | Vault | Vault, called on the player's region | Only through a Java module economy hook; use item prices otherwise |
| [Bukkit events](/animus/99-java-modules-api#bukkit-plugins) (`VirtualNpcInteractionEvent` and others) and the `AnimusNpcs` service | Yes | Yes, on the owning region | Not fired |
| Packet preview tools | `/animus proof` | `/animus proof folia` | No |
| Data folder | `plugins/Animus/` | `plugins/Animus/` | `config/animus/` |

On Folia an interaction counts only when the player's region also owns the NPC, and changing `npcs.enabled` needs a restart. See [Folia](/animus/15-folia) and [mod servers](/animus/16-mod-servers) for the full details.

### NPC features by platform

Paper and Spigot share one runtime, and so do Fabric, NeoForge and Forge. Folia runs its own region runtime with the same presentation code.

| Feature | Paper | Spigot | Folia | Fabric, NeoForge, Forge |
|---|---|---|---|---|
| Equipment (all eight slots, item components) | Yes | Yes | Yes | Yes |
| Stored inventory | Partial: stored and validated, read only by combat `useAmmo`; never shown, and shops and GUIs do not read it | Partial, as Paper | Partial, as Paper | Partial, as Paper |
| Holograms | Yes; PlaceholderAPI placeholders are filled for each player when PlaceholderAPI is installed | Yes, as Paper | Yes, as Paper | Yes; `%` placeholders are not filled |
| Non-player bodies | Yes | Yes | Yes | Yes; a body type the server does not register is not shown |
| Mounted NPCs | Yes | Yes | Yes; the region that owns the root vehicle owns every NPC stacked on it, and a passenger waits until its vehicle is active | Yes |
| Poses | Partial: sneaking, sleeping, swimming and sitting show on player bodies only, other bodies stand; named poses (`animus:pose`) turn every body | Partial, as Paper | Partial, as Paper | Partial, as Paper |
| Text (`animus:say` with click and proximity triggers) | Yes | Yes | Yes; a click counts only when the player's region also owns the NPC | Yes |
| Riding (`animus:riding`) | Yes; at most 8 riders on the server | Yes, as Paper | Partial: a right-click mounts only when the player's region owns the NPC, and the ride ends when the region does not hold the rider for 2 seconds or the NPC steers into terrain the region does not hold | Yes, as Paper |

## Building from source

Building needs JDK 25. From the repository root:

```sh
./gradlew build                                   # Paper, Spigot and Folia jar
./gradlew buildFabric buildNeoForge buildForge    # every mod loader for every Minecraft version
./gradlew build -PincludeModDistributions=true    # plugin jar plus every mod jar
./gradlew :converter:installDist                  # standalone Citizens converter
```

The plugin jar is written to `build/distributions/`. Mod jars are written to `adapters/<loader>/build/<minecraft>/libs/`, or also to `build/distributions/` with `-PincludeModDistributions=true`. The converter is installed in `converter/build/install/converter/`.

The build uses a VolmLib checkout found beside or above the Animus checkout. Point it elsewhere with `-PlocalVolmLibDirectory=<path>` or the `VOLMLIB_DIR` environment variable, or use the published dependency with `-PuseLocalVolmLib=false`.
