---
title: "Getting Started"
description: "Iris documentation: Getting Started"
published: true
date: 2026-09-23T11:12:42.385Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Create an Iris world, pregenerate its spawn area, and open Studio for pack editing.

Command syntax differs between the plugin and the mods. Each step gives both forms.

Full command trees and permissions: [04 - Commands & Permissions](/iris/04-commands-permissions). World lifecycle detail: [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle). Studio detail: [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

## Prerequisites

- Iris installed and verified per [01 - Installation & Platforms](/iris/01-installation-platforms)
- A Java 25 server or mod instance running
- Operator access on Bukkit (the `iris.all` permission), or permission level 2 / gamemaster on modded for anything that mutates state
- The managed `overworld` and `underworld` packs present, or your own pack installed under the platform's packs directory
- Any external datapacks declared by a custom pack installed through the platform-specific workflow. The current built-in Overworld and Underworld releases declare none

## Command syntax

On Bukkit, use `key=value` for optional and contextual parameters. Required parameters also accept their bare positional form. Extra positional values fail.

```text
/iris create name=myworld type=overworld seed=1337
```

Parameters marked contextual, like `world` on pregen, normally come from where you stand. They also never take a positional. Name them with `key=` when you need to override them.

On Fabric, Forge, and NeoForge, arguments are positional and pregen options are literal flags.

| Platform | Required args | Optional args | Example |
|---|---|---|---|
| Plugin (Bukkit) | `key=value` in completion and help. Bare positional also accepted | Must be `key=value` | `/iris create name=myworld type=overworld seed=1337` |
| Mod (Fabric / Forge / NeoForge) | Positional | Further positional tokens or literal flags | `/iris create myworld overworld 1337` |

Use the full command and parameter names in scripts.

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

**Names Iris refuses.** `iris` and `benchmark` are rejected outright (case-insensitive) and Iris suggests something like `irisworld`. Before those checks, the logical name has to be a safe single path segment matching `[a-z0-9_-]`, so anything containing `/`, `\`, or `..` is rejected. Names that collide with the selected save's Bukkit aliases (`<level-name>`, `<level-name>_nether`, and `<level-name>_the_end`) are also rejected, as are `minecraft:*` and foreign namespaced keys.

Choose an unused world name. Use `/iris replace` to replace an existing world on Paper-family servers. Spigot does not support replacement.

The managed `iris:*` world is built immediately on every Bukkit-family server, including Folia and Spigot. Progress appears as a labeled action-bar meter for players and a text bar in the console.

```text
/iris create name=myworld type=overworld seed=1337
```

Wait for creation to finish before entering the world.

Now run `/iris worlds` (alias `accesslist`). It prints two lists: Iris worlds and plain Bukkit worlds. `myworld` must appear under Iris worlds immediately after creation completes, including on Folia.

#### Replace an existing Bukkit world

```text
/iris replace target=<target> [type=…] [seed=<signed-64-bit-integer>]
```

`replace` has command aliases `override` and `overwrite`. It accepts an existing safe `iris:*` target or exactly `minecraft:overworld`, `minecraft:the_nether`, or `minecraft:the_end`. It never creates a missing target. Friendly targets `main`/`overworld`, `nether`/`the_nether`, and `end`/`the_end` resolve to those three vanilla identities. The configured Bukkit names `<level-name>`, `<level-name>_nether`, and `<level-name>_the_end` resolve the same way and take priority if a level name happens to equal a friendly alias. Other bare names resolve to `iris:<name>`. Omit `seed` to keep the authoritative seed already saved for that target. Provide any signed 64-bit integer to give the fresh replacement terrain an explicit seed.

Stage each replacement, then restart once to apply them. Replacing `minecraft:overworld` is how you make Iris generate the selected server main world, and it keeps `level-name`, shared player data, datapacks, and the other dimensions in the same save root. See [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

#### Install the bundled Overworld and Nether pair

On a Paper-family server with early plugin bootstrap, the built-in `overworld` and `underworld` packs can replace the two canonical vanilla slots. Plain Spigot cannot use this exact-slot path. The current built-in pair declares no external datapacks:

```text
/iris download pack=overworld
/iris download pack=underworld
```

Wait for each download to finish before starting the next. Restart, then stage both replacements:

```text
/iris replace minecraft:overworld type=overworld seed=123456789
/iris replace minecraft:the_nether type=underworld seed=-987654321
```

Restart once more after both report staged. The target directories must already be initialized and `allow-nether=true` must stay enabled; omitting `seed=` keeps that target's existing saved seed. After the restart the worlds retain the exact `minecraft:overworld` and `minecraft:the_nether` identities, so Nether portals keep their canonical routing. Full procedure: [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle).

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

The `pack:dimension` form has to be **quoted** (for example, `"custom_pack:dimensions/sky"`) because Brigadier's unquoted string type does not accept a colon. Use a bare pack such as `overworld` when its dimension key matches its name.

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

Alias `import`. It requires the managed dimension directory to already exist on disk, then registers the world with the server.

This one is **player-origin only**. The console cannot run it. On a headless server, load worlds by having them registered in `bukkit.yml` (which create already does) and restarting, or run it as a player.

Modded worlds created with `/iris create` or `/iris world enable` are already injected. Teleport instead.

## 3. Teleport

### Plugin

```text
/iris teleport <world> [player=…]
```

Alias `tp`. The world is positional. The player is optional and therefore keyed: `/iris tp myworld player=Notch`. Left out, it targets whoever ran the command, so console needs to name a player explicitly or it reports that the player does not exist.

```text
/iris tp myworld
```

The command takes you to the world spawn.

### Mod

```text
/iris teleport <dimension> [player]
/iris tp <dimension> [player]
```

Dimension is a loaded-level argument and tab-completes Iris dimensions. A non-Iris dimension is rejected. Console must name a player. You land at the surface near X/Z 8.5, 8.5 in that dimension.

```text
/iris tp irisworldgen:myworld
```

Use `/iris info myworld` to display its pack and seed.

## 4. Pregenerate

Radius is in **blocks**, measured from the center outward, and one pregeneration job runs server-wide at a time.

A 352-block radius at `0,0` covers chunks -22 through 22 on both axes: **45 × 45 = 2,025 chunks**. Chunk boundaries can extend the generated area beyond the requested square.

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
| `serial` | — | `false` | Generate one chunk at a time. Requires a Paper-compatible server |

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

Studio worlds are transient: they are discarded when you close them and any leftovers are purged at startup. Saving JSON and object edits in the pack folder updates newly generated Studio chunks. Production worlds require the [pack update workflow](/iris/25-pack-management).

### Plugin

```text
/iris studio create [name=…] [template=…]
/iris studio open <dimension> [seed=…]
/iris studio vscode [dimension=…]
/iris studio close
```

| Command | Aliases | Notes |
|---|---|---|
| `create` | `+` | Both parameters are optional, so **neither takes a positional value** — use `name=mypack`. With no template it scaffolds a minimal starter pack (`dimensions/`, `regions/`, `biomes/`, `generators/` with one of each). With a template it copies an installed pack |
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

A number of Bukkit studio and content tools refuse on modded. They print an explanatory message rather than half-working. The list is `importvanilla` (`importv`, `iv`), `loot`, `profile`, `spawn`/`summon`, `objects`/`find-objects`, the object `we`, `studio`, and `convert` subcommands. Structure `import`/`import-all`/`reimport` and datapack `ingest`/`pull`/`remove` also refuse. Do authoring work on a Bukkit server and copy the pack folder across. External datapacks are separate: install each compatible archive directly in the target modded save's `datapacks/` directory before loading the Iris world.

Edit the pack files under `packs/overworld/`. Save a valid change and enter new chunks to see it. Close Studio with `/iris studio close`.

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
