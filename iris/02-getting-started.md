---
title: "Getting Started"
description: "Iris documentation: Getting Started"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
This page takes you from a working Iris install to a world you can stand in. You also get a small pregenerated area and an open Studio session for editing packs. It is written for whoever runs the server. It assumes nothing about pack authoring.

Command syntax differs between the plugin and the mods. Each step gives both forms.

Full command trees and permissions: [04 - Commands & Permissions](/iris/04-commands-permissions). World lifecycle detail: [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle). Studio detail: [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

## What you end up with

One disposable Iris world built from the `overworld` pack, entered and generating chunks. It has roughly a 45×45-chunk pregenerated area. A separate Studio session points at the live pack. Use seed `1337` throughout. If you change seeds while you still diagnose something, every comparison becomes meaningless.

Work through the sections in order. Confirm each one before you move on. Confirm the world loaded before you teleport. Confirm ordinary chunks generate around you before you start a pregen. Confirm the Studio world is genuinely separate from your production world before you edit files. Skipping a check does not save time here. Iris failures surface late and in the wrong place.

## Prerequisites

- Iris installed and verified per [01 - Installation & Platforms](/iris/01-installation-platforms)
- A Java 25 server or mod instance running
- Operator access on Bukkit (the `iris.all` permission), or permission level 2 / gamemaster on modded for anything that mutates state
- The managed `overworld` and `underworld` packs present, or your own pack installed under the platform's packs directory
- Any external datapacks declared by a custom pack installed through the platform-specific workflow. The built-in Overworld 4002 and Underworld 1005 declare none

## The one syntax rule that trips everyone up

On the plugin, Iris uses the Director command framework. Tab completion and help render every configurable value as `key=value`, including required and contextual values. Required parameters also accept their bare positional form, but optional and contextual overrides must be keyed. A leftover positional token is not ignored. It is an error, and the command fails.

```text
/iris create name=myworld type=overworld seed=1337     canonical
/iris create myworld overworld 1337               fails: unexpected argument
```

Parameters marked contextual, like `world` on pregen, normally come from where you stand. They also never take a positional. Name them with `key=` when you need to override them.

Modded is Brigadier and works the way you expect: everything is positional, in order, and pregen options are literal flag words.

| Platform | Required args | Optional args | Example |
|---|---|---|---|
| Plugin (Bukkit) | `key=value` in completion and help. Bare positional also accepted | Must be `key=value` | `/iris create name=myworld type=overworld seed=1337` |
| Mod (Fabric / Forge / NeoForge) | Positional | Further positional tokens or literal flags | `/iris create myworld overworld 1337` |

Director also matches command and parameter names fuzzily, so shortenings and near-misses often resolve. That is convenient but do not rely on it in scripts. Write the real names.

## 1. Create a world

### Plugin

```text
/iris create name=<name> [type=…] [seed=…]
```

| Parameter | Aliases | Default | What it does |
|---|---|---|---|
| `name` | `world-name` | required | The world name. Completion emits `name=`. A bare positional name is also accepted |
| `type` | `dimension`, `pack` | `default` | Which pack/dimension to generate. The literal `default` is resolved at runtime through `generator.defaultWorldType` (stock value `overworld`), so it follows your config rather than being hardcoded |
| `seed` | — | `1337` | World seed |

The command itself has alias `c`.

Create has one purpose: make a new managed dimension. A normal bare name such as `myworld` becomes `iris:myworld`. Create never changes a vanilla dimension slot or `server.properties`.

**Names Iris refuses.** `iris` and `benchmark` are rejected outright (case-insensitive) and Iris suggests something like `irisworld`. Before those checks, the logical name has to be a safe single path segment matching `[a-z0-9_-]`, so anything containing `/`, `\`, or `..` is rejected. Names that collide with the selected save's Bukkit aliases — `<level-name>`, `<level-name>_nether`, and `<level-name>_the_end` — are also rejected, as are `minecraft:*` and foreign namespaced keys.

**Already exists.** Create aborts if the managed dimension folder is already there. On Paper-family servers that folder is `<level-root>/dimensions/iris/<name>`. Plain Spigot uses `<world-container>/<level-name>_iris_<name>/dimensions/iris/<name>` so CraftBukkit can bind the outer world and the canonical `iris:<name>` storage together. Use the separate replacement command when replacing an existing safe slot is intentional. Exact vanilla-slot replacement is unavailable on Spigot.

**Bukkit-family servers, including Folia and Spigot.** Create builds the managed `iris:*` world immediately through `IrisToolbelt.createWorld()`, as a production world rather than a Studio world. Folia uses Iris's Paper-like runtime lifecycle backend and does not restart for ordinary creation. Spigot uses the public Bukkit path even though it cannot cold-replace a vanilla slot.

For a player, the immediate create path opens a labeled bottom action-bar meter before validation begins. The stage label advances through pack validation, datapack installation, snapshot copy, generator preparation, spawn generation, registration, direct automatic entry, optional creation-time pregen, and finalization. Spawn generation also shows generated/required chunk counts when available. Console creates receive the same truthful stages as a bounded colored text bar rather than per-chunk log spam. Completion or failure remains in chat and the detailed cause remains in the server console. The optional creation-time pregeneration phase retains its dedicated long-running boss bar.

```text
/iris create name=myworld type=overworld seed=1337
```

Create does not report success as soon as the Bukkit world object exists. For a production world, Iris waits for the actual initial-spawn chunk and applies the spawn location on that chunk's owning region before it registers the world or releases lifecycle admission. A null chunk result, rejected region task, generation or placement failure, or timeout fails creation instead of publishing a false ready state.

Now run `/iris worlds` (alias `accesslist`). It prints two lists — Iris worlds and plain Bukkit worlds. `myworld` must appear under Iris worlds immediately after creation completes, including on Folia.

#### Replace an existing Bukkit world

```text
/iris replace target=<target> [type=…] [seed=<signed-64-bit-integer>]
```

`replace` has command aliases `override` and `overwrite`. It accepts an existing safe `iris:*` target or exactly `minecraft:overworld`, `minecraft:the_nether`, or `minecraft:the_end`. It never creates a missing target. Friendly targets `main`/`overworld`, `nether`/`the_nether`, and `end`/`the_end` resolve to those three vanilla identities. The configured Bukkit names `<level-name>`, `<level-name>_nether`, and `<level-name>_the_end` resolve the same way and take priority if a level name happens to equal a friendly alias. Other bare names resolve to `iris:<name>`. Omit `seed` to keep the authoritative seed already saved for that target. Provide any signed 64-bit integer to give the fresh replacement terrain an explicit seed.

Every replacement is staged for cold publication. Stage as many distinct targets as needed, then restart once. To make Iris generate the currently selected server main world, replace `minecraft:overworld`. This keeps `server.properties` `level-name`, shared player data, datapacks, and the other dimensions in the same save root. The removed `main=true` and `overwrite=true` create options are not migration shortcuts. Selecting or constructing an entirely new `level-name` save is server provisioning outside Iris, not world promotion.

#### Install the shipping Overworld and Nether pair

On a Paper-family server with early plugin bootstrap, the built-in `overworld` and `underworld` packs can replace the two canonical vanilla slots. Plain Spigot cannot use this exact-slot path. The current built-in pair declares no external datapacks:

```text
/iris download pack=overworld
/iris download pack=underworld
```

Wait for each download to report success before starting the next command because downloads are single-flight. Restart after both downloads so Minecraft loads the downloaded packs' dimension types and custom biomes. After the server returns, stage both replacements:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Restart once after both commands report staged. The fresh built-in-pair route therefore has two restart boundaries: one loads the downloaded packs' registry data, and the second publishes both exact world replacements. A custom pack with `datapackImports` needs the explicit ingest and registry-restart workflow in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) before staging its replacement.

The existing Overworld and Nether target directories must already be initialized. `allow-nether=true` must remain enabled. `server.properties` `level-name` stays unchanged. The example deliberately gives the two replacement dimensions different seeds. If you omit either `seed=`, that target keeps its existing saved seed. After the restart, the worlds retain the exact `minecraft:overworld` and `minecraft:the_nether` identities, so ordinary Nether portals keep their canonical forward and return routing. An arbitrary `iris:*` world is separate and does not become a vanilla portal destination merely because it uses an Overworld- or Nether-shaped pack.

### Mod

```text
/iris create <name> [pack] [seed]
```

| Parameter | Default | What it does |
|---|---|---|
| `name` | required | Dimension id. A bare name is normalized into the `irisworldgen` namespace, so `myworld` becomes `irisworldgen:myworld` |
| `pack` | `overworld` | Pack key. Use the `pack:dimension` form when the pack's dimension key differs from its name |
| `seed` | `1337` | Long seed |

Alias `c`. You cannot pass `seed` without also passing `pack`.

The `pack:dimension` form has to be **quoted** — for example, `"custom_pack:dimensions/sky"` — because Brigadier's unquoted string type does not accept a colon. Use a bare pack such as `overworld` when its dimension key matches its name.

If the pack is not installed, create refuses without downloading anything. Install `overworld` or `underworld` with the matching `pack=` download command, or install another pack with `link=<zip-url>`. Modded `/iris datapack ingest` is only a stub, so place any external datapacks declared by a custom pack in this save's `datapacks/` directory yourself. Restart with the Iris pack and all of its declared imports present, then run create. The built-in Overworld and Underworld need no external archives.

```text
/iris create myworld overworld 1337
```

There is no separate load step on modded. The same world management also lives under `/iris world create|enable`, where `create` is simply an alias of `enable`. That form requires the pack argument and has no `overworld` default.

Confirm with `/iris world status`, which lists each loaded Iris level with its pack and dimension key. Then run `/iris info` to check the seed. `/iris info` takes an optional greedy string. It is a **substring filter** across dimension id, generator identity, and pack key. It is not a dimension selector. `/iris info myworld` narrows the listing. The seed is only printed to gamemasters. At lower permission levels the line simply omits it.

## 2. Load a world (plugin only)

```text
/iris load <world>
```

The real command node is `loadWorld`, with alias `import`. `/iris load` reaches it through fuzzy matching. It requires the managed dimension directory to already exist on disk, then loads through `BukkitWorldReconciler` and registers the world with the server.

This one is **player-origin only**. The console cannot run it. On a headless server, load worlds by having them registered in `bukkit.yml` (which create already does) and restarting, or run it as a player.

Modded worlds created with `/iris create` or `/iris world enable` are already injected. Teleport instead.

## 3. Teleport

### Plugin

```text
/iris teleport <world> [player=…]
```

Alias `tp`. The world is positional. The player is optional and therefore keyed — `/iris tp myworld player=Notch`. Left out, it targets whoever ran the command, so console needs to name a player explicitly or it reports that the player does not exist. The teleport itself is performed asynchronously where the platform allows it.

```text
/iris tp myworld
```

You have passed this gate when the teleport completes and chunks generate normally around spawn. If the teleport target does not exist, go back to the create/load step. Do not push on to pregen.

### Mod

```text
/iris teleport <dimension> [player]
/iris tp <dimension> [player]
```

Dimension is a loaded-level argument and tab-completes Iris dimensions. A non-Iris dimension is rejected. Console must name a player. You land at x=8.5, z=8.5 in that dimension, at the `MOTION_BLOCKING` height for that column. Iris force-loads the chunk with a ticket if it is not loaded yet.

```text
/iris tp irisworldgen:myworld
```

Success is entry into `irisworldgen:myworld` with `/iris info myworld` still reporting the pack and seed you expect.

## 4. Pregenerate

Radius is in **blocks**, measured from the center outward, and one pregeneration job runs server-wide at a time.

The block radius is converted to an inclusive chunk box. A 352-block radius at `0,0` covers chunks -22 through 22 on both axes. That is **45 × 45 = 2,025 chunks**, or 720 × 720 blocks. The command's own feedback describes the request as 704 × 704 blocks (radius × 2). The extra chunk on each edge is the inclusive rounding. Pick your radius knowing that chunk count, not the block number, is what determines how long this takes.

### Plugin

```text
/iris pregen start radius=<radius> [world=…] [center=x,z|me] [gui=true|false] [serial=true|false]
```

| Parameter | Aliases | Default | What it does |
|---|---|---|---|
| `radius` | `size` | required | Radius in blocks. Must be greater than 0. Completion emits `radius=`. A bare positional radius is also accepted |
| `world` | — | your current world | Target world. Contextual, so it must be keyed when you override it — typically when running from console |
| `center` | `middle` | `0,0` | Center point. `me` uses the running player's position |
| `gui` | — | `true` | Open the pregen progress window. Set false on a headless server |
| `serial` | — | `false` | Generate one chunk at a time. Much slower, but the safe option when parallel generation is destabilizing the server. Requires a Paper-compatible server |

```text
/iris pregen start radius=352 world=myworld center=0,0 gui=false
```

Immediately run `/iris pregen status`. It should report a 2,025-chunk job that advances without a growing failure count.

Control it with `/iris pregen stop` (alias `x`), `/iris pregen pause`, and `/iris pregen status`. **`resume` is an alias of `pause`, and `pause` is a toggle**. There is no distinct resume command. Running either one on a paused job resumes it and on a running job pauses it.

### Mod

```text
/iris pregen start <radius> [dimension] [at <x> <z>] [gui] [sync] [nocache]
```

| Piece | What it does |
|---|---|
| `radius` | Blocks, 1–100000 |
| `dimension` | Optional target level. Defaults to the dimension you are in |
| `at x z` | Optional center. Defaults to 0, 0 |
| `gui` | Ask for the progress map window on the server display. Silently ignored when no GUI can be launched |
| `sync` | Synchronous chunk writes |
| `nocache` | Disable the resumable checkpoint cache. Caching is on by default, which is what lets a stopped job pick up where it left off |

The three flags are combinable in any order and each may appear once, but **`at <x> <z>` must come before any flag.** `/iris pregen start 100 gui at 0 0` is a syntax error. `/iris pregen start 100 at 0 0 gui` is fine.

```text
/iris pregen start 352 irisworldgen:myworld at 0 0 sync
```

Run `/iris pregen status` right away and confirm the target dimension, total, and generated count. Stop before retrying with different flags. As on Bukkit, `pause` and `resume` are the same toggle. Progress shows in the client mod HUD when present, otherwise a boss bar or the console.

## 5. Open a Studio

Studio worlds are transient. They are discarded when you close them and any leftovers are purged at startup. Crucially, a Studio world reads the **live** pack directory and hotloads JSON and object edits into newly generated chunks. Production worlds never do this. They read the frozen snapshot copied into the world at creation. Studio generates the same blocks, biomes, structures, and terrain as a normal world with the same pack and seed; it does not substitute blank chunks or a landing pad. That live-versus-frozen pack source is the reason Studio exists, and the reason pack edits appear to do nothing on a production world.

### Plugin

```text
/iris studio create [name=…] [template=…]
/iris studio open <dimension> [seed=…]
/iris studio vscode [dimension=…]
/iris studio close
```

| Command | Aliases | Notes |
|---|---|---|
| `create` | `+` | Both parameters are optional, so **neither takes a positional value** — use `name=mypack`. With no template it scaffolds a minimal starter pack (`dimensions/`, `regions/`, `biomes/`, `generators/` with one of each). With a template it copies an existing packs entry, downloading it if needed |
| `open` | `o` | Opens a temporary studio world for a pack. `dimension` is required and positional. `seed` is optional (alias `s`) and defaults to `1337` |
| `vscode` | `vsc` | Writes and opens a `.code-workspace` with live registry schemas. `dimension` is optional, so keyed only, and defaults to `default` |
| `close` | `x` | Discards the studio world |

The studio group itself has aliases `std` and `s`. Default create name is `studio`. If a project by that name already exists, Iris picks the next free name rather than failing.

```text
/iris studio open overworld seed=1337
/iris studio vscode dimension=overworld
```

### Mod

```text
/iris studio create [name] [template]
/iris studio open <pack> [seed]
/iris studio vscode [pack]
/iris studio update [pack]
/iris studio close
```

| Command | Aliases | Notes |
|---|---|---|
| `create` | `+` | Name defaults to `studio`, template defaults to **`example`**. This differs from the plugin, where omitting the template scaffolds a starter pack instead. The template pack must already be installed |
| `open` | `o` | Pack is required. Seed defaults to `1337` |
| `vscode` | `vsc` | Writes the workspace and opens it |
| `update` | — | Regenerates the workspace schemas without opening anything |
| `close` | `x` | Discards the studio world |

Group aliases are `std` and `s`.

```text
/iris studio open overworld 1337
/iris studio vscode overworld
```

For a player, both Bukkit and modded Studio open use an absolute 10-second arrival deadline measured from command admission. Time spent behind an existing close or open transition consumes that same budget. An expired request is failed and cannot teleport the player later.

A number of Bukkit studio and content tools refuse on modded. They print an explanatory message rather than half-working. The list is `importvanilla` (`importv`, `iv`), `loot`, `profile`, `spawn`/`summon`, `objects`/`find-objects`, the object `we`, `studio`, and `convert` subcommands. Structure `import`/`import-all`/`reimport` and datapack `ingest`/`pull`/`remove` also refuse. Do authoring work on a Bukkit server and copy the pack folder across. External datapacks are separate: install each compatible archive directly in the target modded save's `datapacks/` directory before loading the Iris world.

The Studio gate passes when the transient world opens. The workspace must point at the live `packs/overworld/` tree. Saving a valid JSON change must produce a hotload result in-game. Close it with `/iris studio close` and confirm your production `myworld` is still there and unaffected.

## The whole first session

1. Confirm the pack: `overworld` (or yours) exists under the platform packs directory.
2. Create the world using the form for your platform.
3. Teleport in and fly around a little to confirm chunks generate.
4. Optional: `/iris pregen start radius=352 …` for a 45×45-chunk area.
5. Optional: `/iris studio open <pack>` and use the VSCode schemas for block, item, and entity autocomplete. Mod content is included in those schemas on mod loaders.

The session is finished when you restart the server cleanly. The production world must load again. It must generate new chunks from its copied pack snapshot. Remove a disposable world through the lifecycle command after evacuating players, never by deleting folders. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

## Common pitfalls

| Pitfall | What actually happens | What to do |
|---|---|---|
| Bukkit optional args passed positionally | Hard parse error, command does nothing | Write `seed=1337`, not a bare second token |
| `/iris studio create mypack` | Fails — both params are optional so neither is positional | `/iris studio create name=mypack` |
| `/iris pack validate` with no argument | Validates every installed pack | Name one with `pack=<key>` to check a single pack |
| World named `iris` or `benchmark` | Create rejected | Pick another name, e.g. `irisworld` |
| Editing `packs/<pack>` after creating a production world | **No effect** on that world, ever | Production engines read `<world>/iris/pack`. Push changes with `/iris developer update-world world=<world> pack=<dimension> confirm=true` and restart, or accept that only new chunks change. Studio reads the live pack |
| Expecting pack edits to change existing chunks | Only newly generated chunks use the new config | Fly to unexplored terrain, pregen a fresh radius, or use a Studio world |
| Folia create reports `paper_like_runtime` unavailable | Iris cannot safely use Folia's unsupported public world creator | Keep the world data untouched and update to a compatible Folia/Iris build before retrying |
| Modded: new pack's heights or biomes missing | The forced datapack was not applied before registries loaded | Restart once with the pack already installed |
| A custom modded pack reports missing external registry keys | Bukkit-only ingest cannot install the pack's declared dependencies on a mod loader | Put the exact datapacks declared by that pack in the save's `datapacks/`, then restart before loading the Iris world |
| `/iris load` from console | Player-origin only. Console cannot run it | Rely on the `bukkit.yml` registration plus a restart, or run it as a player |
| `/iris load` on modded | No such subcommand | Use create or `world enable`, then teleport |
| Modded `pack:dimension` unquoted | Brigadier rejects the colon | Quote a genuinely distinct pair, for example `"custom_pack:dimensions/sky"` |
| Modded pregen flags before `at x z` | Syntax error | Put `at <x> <z>` before any flag |
| Starting a pregen while one is running | Start fails | `/iris pregen stop` first |
| `/iris pregen resume` expected to only resume | It is an alias of `pause`, which toggles | Check `/iris pregen status` instead of assuming |
| Studio closed mid-edit | The studio world is discarded | Your edits are on disk in `packs/` and survive. Reopen the studio |
| No pack exists after first boot | Normal: Iris never downloads packs during startup | Run `/iris download pack=overworld`, `/iris download pack=underworld`, or `/iris download link=https://host/pack.zip`, then restart. An offline install must contain each complete pack tree |
| Relying on `type=default` | Resolves through `generator.defaultWorldType`, which someone may have changed | Name the pack explicitly: `type=overworld` |

## Quick reference

**Plugin**

```text
/iris create name=myworld type=overworld seed=1337
/iris tp myworld
/iris pregen start radius=352 world=myworld center=0,0 gui=false
/iris pregen status
/iris studio open overworld seed=1337
/iris studio close
```

**Mod**

```text
/iris create myworld overworld 1337
/iris tp irisworldgen:myworld
/iris pregen start 352 irisworldgen:myworld at 0 0
/iris pregen status
/iris studio open overworld 1337
/iris studio close
```

Next: how packs are structured in [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout), and every settings key in [03 - Configuration](/iris/03-configuration).
