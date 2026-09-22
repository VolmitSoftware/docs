---
title: "Studio & VSCode Schemas"
description: "Iris documentation: Studio & VSCode Schemas"
published: true
date: 2026-09-22T04:03:45.933Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Studio previews a pack in a temporary world with a chosen seed. Saved pack edits apply to new chunks; existing chunks keep their terrain.

Related: [04 - Commands & Permissions](/iris/04-commands-permissions), [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout), [02 - Getting Started](/iris/02-getting-started), [11 - Dimensions](/iris/11-dimensions), [21 - Jigsaw Structures](/iris/21-jigsaw-structures), [25 - Pack Management](/iris/25-pack-management), [30 - Platform Differences](/iris/30-platform-differences), [36 - Rivers](/iris/36-rivers).

## The edit loop

Prerequisites: a writable packs directory, operator access on Bukkit or gamemaster access on a mod loader, and VSCode/Cursor (or IntelliJ) on the machine that holds the pack folder. Keep the server console visible for validation errors.

### Bukkit-family

1. **Create a project.** `/iris studio create name=tutorial`
   Writes `packs/tutorial/` with a dimension, region, biome, generator, and a `tutorial.code-workspace`. Follow any restart prompt before opening the pack.
2. **Open it as a world.** `/iris studio open tutorial seed=1337`
   You enter the transient world in spectator mode at its fixed generator anchor, centered on `0,0` near Y 96. A fixed seed matters because you will be comparing the same coordinates across reloads.
3. **Open the editor workspace.** `/iris studio vscode dimension=tutorial`
   Refreshes `<pack>/<pack>.code-workspace`, rewrites `.iris/schema/*`, and opens that workspace. Generation still completes when `studio.openVSCode` is false or the server is headless; only the desktop launch is skipped. Copy the pack folder to your machine and open the workspace file yourself.
   *Success condition:* typing `"` inside any object in `biomes/starter.json` offers field names, and hovering a field shows its description, type, and default value. If it does not, run `/iris studio update dimension=tutorial`.
4. **Make one change.** Edit `packs/tutorial/biomes/starter.json` and change only its display `name`. Save once.
5. **Wait for the hotload result** before another save. A successful Bukkit hotload sends the amethyst-block break sound and an `Engine Hotloaded` action bar to players in the Studio world. Rejected edits leave the previous generation active.
6. **Verify in fresh terrain.** Enter ungenerated chunks beyond the transition band and run `/iris what biome`.
7. **Validate.** `/iris pack validate pack=tutorial`: no blocking errors.
8. **Close.** `/iris studio close`

### Fabric / Forge / NeoForge

Same loop, positional arguments, and the modded studio create always copies a template (`example` by default):

1. `/iris studio create tutorial example`
2. `/iris studio open tutorial 1337`
3. `/iris studio vscode tutorial`
4. Trace the active dimension to one referenced biome, change one display or palette value, save once.
5. Wait for the hotload result, then enter newly generated terrain and check it with `/iris what biome`.
6. `/iris pack validate tutorial`, then `/iris studio close`.

Validate your changes and inspect new chunks before using the pack in a production world.

### Opening requirements

Complete any requested server restart and resolve blocking pack-validation errors before opening Studio. Bukkit ordinary Studio accepts `force=true` when only a registry restart is pending; it does not bypass pack validation or native-integration failures.

Changes to height or dimension type require closing and reopening Studio, and may require a restart. See [Hotload rules](/iris/10-studio-vscode-schemas#hotload-rules). Studio worlds are temporary: reopening after a restart creates a new world from the saved pack.

Studio opening automatically prepares the entry area’s hydrology before generating its terrain, then takes you into the world. Matching saved plans are reused automatically, including after a server restart. Normal Studio and production worlds can share plans when the pack, seed, generator, and relevant world settings match; biome-buffet layouts remain separate.

## What Studio is

| Concept | Behavior |
|---------|----------|
| Pack workspace | Packs live under the platform data directory in the folder named `packs` |
| Studio world | Temporary world opened from the selected pack and seed |
| Hotload | Accepted JSON, IOB and PNG edits apply to new terrain |
| Non-studio worlds | Pack edits require the production world-update workflow in [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) |

Studio settings live in `iris.json` under `studio`:

| Key | Default | Meaning |
|-----|---------|---------|
| `openVSCode` | `true` | Allows `open`/`vscode` to launch the editor on the server machine. Set false on remote or headless hosts |
| `entitySpawning` | `true` | Enables Iris ambient spawning in Studio. Does not change production-world spawning settings |
| `disableTimeAndWeather` | `true` | Freezes weather and the day cycle in studio worlds and sets noon where the runtime clock allows. Set false to let them run while authoring. Night and storm Iris spawners do not fire here until this is false or you test in a production world |
| `autoStartDefaultStudio` | `false` | Opens a Studio world for the default pack automatically at startup |

## Hotload rules

- Automatic pack hotload is available in ordinary Studio. Close and reopen Jigsaw Studio to apply external pack edits.
- Edit the active server's authoring folder under `plugins/Iris/packs/<pack>` on Bukkit. A separate checkout or another server's pack copy is not watched. Normal editor saves, file replacements, and FTP uploads are detected; temporary files and `.iris` output are ignored.
- Invalid edits leave the current pack active and are reported in the console. Fix the first error and save again.
- Height, environment, dimension key, generated dimension type, and coordinate scale cannot hotload. Close and reopen Studio after changing them. New or changed required registry definitions can require a server restart. See [11 - Dimensions](/iris/11-dimensions).
- Existing chunks keep their terrain. Changes blend across `generator.generationTransitionWidthBlocks`; inspect new chunks beyond that transition to see the edited pack.
- Dimension `allObjectScaleFactor` edits do hotload. New object placements use the accepted factor; existing objects keep their blocks, explicit placement scales still override it, and jigsaw pieces are excluded.

Previously generated chunks keep their original biome names, spawns and effects. Close and reopen Studio to start a fresh temporary world from the latest pack.

## Commands (Bukkit)

Root: `/iris studio`, aliases `std` and `s`. Keyed arguments. The first column shows the primary subcommand name.

| Subcommand | Aliases | What it does |
|------------|---------|--------------|
| `open <dimension> [seed=1337]` | `o` | Closes any open studio and opens the pack as a studio world. Blocked unless startup datapack validation is ready and the selected pack has a loadable validation result |
| `close` | `x` | Closes the active studio project and world |
| `create [name=studio] [template=<dimension>]` | `+` | Creates a pack under `packs/<name>` after startup validation is ready. A named template must already be installed and validate as loadable. Without one, Iris writes the starter skeleton below |
| `vscode [dimension=default]` | `vsc` | Opens the pack's VSCode workspace, generating it if missing |
| `update [dimension=default]` | | Refreshes the workspace and JSON schemas |
| `version [dimension=default]` | | Prints the dimension's `version` field |
| `pkg [dimension=default] [obfuscate=false] [minify=true]` | `package` | Compiles the pack into a distributable archive |
| `importvanilla <dimension> [variants=3] [structures=true]` | `importv`, `iv` | Captures vanilla features and structures into the pack |
| `scoreboard` | `board`, `sidebar`, `sb` | Toggles the studio debug scoreboard. Player must be in the studio world |
| `noise [generator=<key>] [seed=12345]` | `nmap` | Opens the external noise explorer GUI |
| `map [world=<world>]` | `render` | Opens the external biome/terrain map GUI for an Iris world |
| `regions [radius=500]` | | Samples region rarity over a chunk spiral. Player must be in an Iris world |
| `loot [fast=false] [add=true]` | | Opens a virtual chest showing loot tables for the block under the player |
| `profile [dimension=default]` | | Writes a pack performance profile report |
| `spawn` | `summon` | Spawns a pack entity definition at the player |
| `tpstudio` | `stp` | Teleports you to the fixed Studio entry anchor |
| `objects` | `find-objects` | Captures a nearby-chunk object placement report |

Permissions and the full `/iris` tree: see [04 - Commands & Permissions](/iris/04-commands-permissions).

The Studio scoreboard shows the region and biome under you, including cave and flooded-biome overrides.

## Commands (Modded)

`/iris studio` on Fabric, Forge and NeoForge uses positional arguments. Supported: `create`/`+`, `package`/`pkg`, `version`, `regions`, `open`/`o`, `close`/`x`, `tpstudio`/`stp`, `status`, `vscode`/`vsc`, `update`, `noise`/`nmap`, `map`/`render`.

`create` with no arguments creates a project named `studio` from the `example` template. `create <name>` uses the same template. `create <name> <template>` picks another. `open <pack> [seed]` defaults the seed to `1337`.

These subcommands are registered on modded but only report why they are unavailable: `importvanilla`/`importv`/`iv`, `loot`, `profile`, `spawn`/`summon`, and `objects`/`find-objects`. They all need Bukkit.

## Desktop map and noise explorers

The Vision map, Noise Explorer, and Image Map Studio open on the **server's own desktop**. On a headless server their commands report that no display is available and return. They never create a window on a remote player's computer. On macOS, Command-Q or Dock Quit closes every Iris desktop window but does not terminate the server JVM.

Drag to pan and use the mouse wheel or trackpad to zoom.

**Vision map** (`/iris studio map`) shows a render-mode selector, world coordinates, scale, render progress, and contextual Height and River legends. The `Entities` toggle beside `Grid` shows or hides red living-entity markers; player markers always stay. Clicking teleports the player who opened the map, deriving the landing Y from the authored terrain and fluid field. Manual pan or zoom disables Follow. Hover reads the same biome domain the map draws.

The **River network** mode labels rivers, pools, cascades, waterfalls, sinkholes, grottos and mouths. Its diagnostic view also shows rejected candidates and their reasons. The **Biome** view includes river biomes. Vision can display named image-map layers.

**Noise Explorer** (`/iris studio noise`) previews a selected pack generator. Enter a seed and click **Apply**, then choose a signed, terrain or grayscale palette. The status strip shows coordinates, scale, sampled range and render progress.

**Image Map Studio** imports PNGs, configures their coordinates and interpretation, and previews height, biome targets or masks. Export saves the image and its pack configuration. See [37 - Image Maps](/iris/37-image-maps).

> On Paper-family servers, `/tp` into new Studio terrain waits for the destination chunks to load.
{.is-info}

## Creating a pack (starter skeleton)

`/iris studio create name=mypack` with no template writes:

```
packs/mypack/
  dimensions/mypack.json
  regions/starter.json
  biomes/starter.json
  generators/flat.json
  mypack.code-workspace
```

Starter dimension JSON:

```json
{
  "name": "mypack",
  "version": 1,
  "regions": ["starter"],
  "logicalHeight": 384,
  "dimensionHeight": {"min": -64, "max": 320}
}
```

The starter region lists the same `starter` biome for land, sea and shore. The starter biome uses generator `flat` at `min` 96 / `max` 96, one grass-block layer, and `minecraft:plains` as both `derivative` and `vanillaDerivative`. The full four-file listing is in [26 - Example - Minimal Dimension](/iris/26-example-minimal-dimension).

Project names are lowercased and must match `a-z`, `0-9`, `_`, `-`, up to 64 characters. The name `studio` is reserved and auto-renamed to the next free suffix. If the target folder already exists, nothing is changed.

With a template (`/iris studio create name=mypack template=overworld`), Iris requires the template pack to already be installed and loadable, then copies its tree into the new pack key. Missing templates are never downloaded implicitly.

## Studio open workflow

Install the pack, validate it, then run `/iris studio open <pack> seed=1337` on Bukkit or `/iris studio open <pack> 1337` on mod loaders. Opening a pack closes the current Studio.

If the pack adds or changes dimension types, custom biomes or biome tags, follow the restart prompt and repeat `open` afterward. Object, structure, jigsaw and pool edits do not require that registry restart.

Object and Jigsaw Studio use flat authoring floors and the plains biome. Ordinary Studio previews the pack's terrain and hydrology.

## VSCode workspace

Open `<pack>/<packName>.code-workspace` in VSCode or Cursor. It enables JSON suggestions, hover descriptions and validation, and saves files when you switch focus. Iris also configures IntelliJ schemas in `<pack>/.idea/jsonSchemas.xml`.

Run `/iris studio update dimension=<pack>` on Bukkit or `/iris studio update <pack>` on mod loaders to refresh the workspace. If the workspace file is invalid, Iris recreates it; custom workspace settings are lost, but pack content is preserved.

## Schema generation

Generated schemas provide field names, descriptions, defaults, allowed values and resource-key suggestions. Hover a field for its description. Use `/iris pack validate` to check the pack before opening a world; editor hints do not replace pack validation.

### Snippets

Where a field supports snippets, supply either an inline object or a reference such as `"snippet/decorator/wildflowers"`. Create the referenced file at `<pack>/snippet/decorator/wildflowers.json`. References also work inside arrays.

### File matching

The workspace applies schemas to JSON files up to seven folder levels deep:

| Pack folder pattern | Schema URL (relative to pack) |
|---------------------|--------------------------------|
| `/<folder>/*.json` through `/<folder>/*/*/*/*/*/*/*.json` (7 depth levels) | `./.iris/schema/<folder>-schema.json` |
| `/snippet/<type>/*.json` through 7 levels | `./.iris/schema/snippet/<type>-schema.json` |

Folders with schemas: `dimensions`, `regions`, `biomes`, `generators`, `image-maps`, `loot`, `entities`, `spawners`, `markers`, `blocks`, `expressions`, `mods`, `structures`, `jigsaw-pools`, `jigsaw-pieces`. Binary files under `objects/`, `images/` and `matter/` have no JSON schema.

Files under `.iris/schema/` are generated editor artifacts. They are safe to delete and are rewritten on the next workspace update. Pack content is the JSON under the type folders.

### What refreshes schemas

| Trigger | Effect |
|---------|--------|
| `/iris studio update dimension=<dim>` | Refreshes the workspace and schemas |
| `/iris studio open` | Refreshes the workspace and schemas before opening the editor |
| `/iris studio create` | Creates the workspace and schemas |
| Successful hotload | May refresh the workspace; use `update` to refresh explicitly |

Block, item and other content suggestions reflect what is installed on the server. Refresh schemas after changing mods or datapacks.

## Studio dimension modes

Set the dimension field `studioMode` to preview biomes or objects on Bukkit. Fabric, Forge and NeoForge ignore this field.

| Value | Effect |
|-------|--------|
| `NORMAL` | Default generation |
| `BIOME_BUFFET_1x1`, `_3x3`, `_5x5`, `_9x9`, `_18x18`, `_36x36` | Lays every biome out in a grid of that cell size so palettes and decorators can be compared side by side |
| `OBJECT_BUFFET` | Object studio generator. Also forced automatically while an object studio session is active |
| `REGION_BUFFET` | Behaves as `NORMAL` |

Biome Buffet sorts supported pack biomes by load key and places them from chunk `(0, 0)` along positive X, then positive Z. Cells display land biomes; areas outside the layout have a barrier floor.

These are testing fields, not production world modes; the production engine mode is `mode.type` (see [11 - Dimensions](/iris/11-dimensions)). Remove `studioMode` before packaging.

Use `/iris jigsaw open` or `/iris jigsaw create` for Jigsaw Studio.

## Jigsaw Studio

Use `/iris jigsaw` to edit a structure graph with a control GUI and autosave. Close and reopen it to apply external pack edits. Only the session owner can edit the active Jigsaw Studio world.

The whole workflow, commands, marker rules, portability blockers, and recovery steps are in [21 - Jigsaw Structures](/iris/21-jigsaw-structures). The JSON is in [21b - Jigsaw Resources](/iris/21b-jigsaw-resources).

## Platform notes

| Platform | Studio |
|----------|--------|
| Paper / Purpur / Folia (Bukkit plugin) | Full studio command set plus file-watch hotload on studio worlds. `studioMode` honored. Jigsaw Studio available |
| Fabric / Forge / NeoForge | Studio open/create/workspace/package and a subset of tooling. No Bukkit-only importers or inventory GUIs. `studioMode` ignored. No Jigsaw Studio authoring commands |

Pack JSON is shared across platforms. Install any content the pack requires on the destination server.

Edit `hydrology` and `riverPolicy` through the dimension, region and biome schemas. Refresh schemas, validate the pack, then inspect rivers in Vision's **River network** mode. See [36 - Rivers](/iris/36-rivers).
