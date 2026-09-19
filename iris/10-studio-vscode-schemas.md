---
title: "Studio & VSCode Schemas"
description: "Iris documentation: Studio & VSCode Schemas"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Studio opens a pack in a temporary world and applies accepted pack edits to new chunks. It generates the same blocks, biomes, structures, and terrain as a normal world with the same pack and seed. Existing chunks keep the terrain they were generated with.

Related: [04 - Commands & Permissions](/iris/04-commands-permissions), [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout), [02 - Getting Started](/iris/02-getting-started), [11 - Dimensions](/iris/11-dimensions), [21 - Jigsaw Structures](/iris/21-jigsaw-structures), [25 - Pack Management](/iris/25-pack-management), [30 - Platform Differences](/iris/30-platform-differences), [36 - Rivers](/iris/36-rivers).

## The edit loop

Prerequisites: a writable packs directory, operator access on Bukkit or gamemaster access on a mod loader, and VSCode/Cursor (or IntelliJ) on the machine that holds the pack folder. Keep the server console visible. Hotload failures are always reported there; routine success and timing detail need `/iris debug toggle` on Bukkit or `/iris debug` on mod loaders.

### Bukkit-family

1. **Create a project.** `/iris studio create name=tutorial`
   Writes `packs/tutorial/` with a dimension, region, biome, generator, and a `tutorial.code-workspace`. Creation runs asynchronously and may report that a restart is needed before the pack can be opened.
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

The loop passes when the editor binds the generated schema, hotload succeeds, validation reports no blocking errors, and newly generated chunks show the change. Create a production world only after that gate.

A rejected height or dimension-type change is not evidence that hotload is broken. Those changes are refused by design; see **Hotload rules**.

### When something goes wrong

On Bukkit, a Java agent or server code injection failure blocks every Studio world opening, including `force=true`. Follow [Java agent recovery](/iris/01-installation-platforms#recover-from-a-java-agent-failure) and restart completely before retrying.

| Symptom | Meaning | Recovery |
|---|---|---|
| Ordinary or Jigsaw `open` reports startup validation pending, missing, failed, restart-required, or blocking pack errors | Datapacks or the pack graph cannot safely build the transient world | Complete the requested restart or run the platform's `pack validate` form, fix the first blocking error, and retry. Bukkit ordinary Studio alone accepts `force=true` to attempt the currently loaded registry state when only the restart boundary remains; it never bypasses blocking pack validation |
| Save reports hotload failure | Validation rejected the edit, or generation activation failed | Fix the first console error. Rejected edits keep the current generation. If activation stopped the engine, close and reopen Studio after repair |
| Height, environment, or generated dimension-type change is rejected | The edit violates the Studio runtime contract | Close Studio and reopen. On modded, restart when regenerated dimension-type datapacks require a registry reload |
| A valid change is invisible | The chunks you are standing in are already materialized, or the edited resource is unreachable from the active dimension | Move to new chunks. Trace dimension → region → biome to confirm the resource is actually referenced. Use `focus`/`focusRegion` or a buffet studio mode to isolate |
| No autocomplete, or resource keys are stale | Schemas were not generated or refreshed, or the editor never opened the workspace | Run `/iris studio update`, then open the pack's `.code-workspace`. On headless servers open it manually |
| The Studio world disappears after a restart | Studio worlds are transient and purged on purpose | Reopen the pack. `packs/<key>/` is the source of truth, not the world folder |

If Studio cleanup fails outright, Iris blocks further world mutations and keeps the temporary world folder. Resolve the reported error, then restart manually to clear that state.

## What Studio is

| Concept | Behavior |
|---------|----------|
| Pack workspace | Packs live under the platform data directory in the folder named `packs` |
| Studio world | On Bukkit, generation reads an immutable snapshot of the pack while the watcher reads your authoring folder. Identical bytes create no new activation |
| Hotload | Accepted JSON, IOB, and PNG edits become a new generation activation. Existing chunks keep their earlier generation |
| Hotload contract | Iris refuses hotload if the dimension type key, exact environment, or effective generated dimension type changes. The generated type includes min height, total height, logical height, resolved `dimensionOptions`, and the `fullbright` ambient-light override |
| Non-studio worlds | No pack file watcher. Production worlds retain immutable pack definitions per generation epoch |

Studio settings live in `iris.json` under `studio`:

| Key | Default | Meaning |
|-----|---------|---------|
| `openVSCode` | `true` | When true and the JVM is not headless, `open`/`vscode` may launch the desktop opener on the pack's `*.code-workspace`. Set false on servers where a desktop launch would be pointless or unwanted |
| `entitySpawning` | `true` | Only affects Studio worlds. False stops Iris ambient entity spawning there. Production worlds always spawn regardless of this key |
| `disableTimeAndWeather` | `true` | Freezes weather and the day cycle in studio worlds and sets noon where the runtime clock allows. Set false to let them run while authoring. Night and storm Iris spawners do not fire here until this is false or you test in a production world |
| `autoStartDefaultStudio` | `false` | Opens a studio world for the default pack automatically at boot, which warms the hydrology reused by a later open of the same pack and seed |

## Hotload rules

- The watcher runs only in a Studio world that is not closing, and Jigsaw Studio suppresses it entirely.
- Edit the active server's authoring folder under `plugins/Iris/packs/<pack>` on Bukkit. A separate checkout or another server's pack copy is not watched. Normal editor saves, file replacements, and FTP uploads are detected; temporary files and `.iris` output are ignored.
- Invalid edits leave the current pack active and are reported in the console. Fix the first error and save again.
- Height, environment, dimension key, generated dimension type, and coordinate scale cannot hotload. Close and reopen Studio after changing them. New or changed required registry definitions can require a server restart. See [11 - Dimensions](/iris/11-dimensions).
- Existing chunks keep their terrain. New terrain reconciles against the frozen boundary over `generator.generationTransitionWidthBlocks`, so a large edit can still leave a visible seam. Inspect new chunks beyond that band to judge the replacement pack alone.
- Dimension `allObjectScaleFactor` edits do hotload. New object placements use the accepted factor; existing objects keep their blocks, explicit placement scales still override it, and jigsaw pieces are excluded.

Saved biome and region identities keep the pack definitions they were generated with, so position inspection, ambient spawns, and effects stay consistent with the terrain around them. Repeated edits increase disk use because those definitions are retained. Closing Studio deletes its temporary world and history; reopening starts fresh from the latest authoring pack.

## Commands (Bukkit)

Root: `/iris studio`, aliases `std` and `s`. Keyed arguments. The first column shows the primary subcommand name.

| Subcommand | Aliases | What it does |
|------------|---------|--------------|
| `open <dimension> [seed=1337]` | `o` | Closes any open studio and opens the pack as a studio world. Blocked unless startup datapack validation is ready and the selected pack has a loadable validation result |
| `close` | `x` | Closes the active studio project and world |
| `create [name=studio] [template=<dimension>]` | `+` | Creates a pack under `packs/<name>` after startup validation is ready. A named template must already be installed and validate as loadable. Without one, Iris writes the starter skeleton below |
| `vscode [dimension=default]` | `vsc` | Opens the pack's VSCode workspace, generating it if missing |
| `update [dimension=default]` | | Rewrites `<pack>/<name>.code-workspace` and queues regeneration of `.iris/schema/*` |
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

The Studio scoreboard shows the region and biome under you, including saved cave and flooded-biome overrides. `Loading...` rows retry on the normal 20-tick refresh; `Unavailable` means the saved read failed and the cause was logged once.

## Commands (Modded)

`/iris studio` on Fabric, Forge and NeoForge uses positional arguments. Supported: `create`/`+`, `package`/`pkg`, `version`, `regions`, `open`/`o`, `close`/`x`, `tpstudio`/`stp`, `status`, `vscode`/`vsc`, `update`, `noise`/`nmap`, `map`/`render`.

`create` with no arguments creates a project named `studio` from the `example` template. `create <name>` uses the same template. `create <name> <template>` picks another. `open <pack> [seed]` defaults the seed to `1337`.

These subcommands are registered on modded but only report why they are unavailable: `importvanilla`/`importv`/`iv`, `loot`, `profile`, `spawn`/`summon`, and `objects`/`find-objects`. They all need Bukkit.

## Desktop map and noise explorers

The Vision map, Noise Explorer, and Image Map Studio open on the **server's own desktop**. On a headless server their commands report that no display is available and return. They never create a window on a remote player's computer. On macOS, Command-Q or Dock Quit closes every Iris desktop window but does not terminate the server JVM.

All three pan by dragging and zoom with the mouse wheel or trackpad, about 5.7% per notch, keeping the world coordinate under the pointer fixed.

**Vision map** (`/iris studio map`) shows a render-mode selector, world coordinates, scale, render progress, and contextual Height and River legends. The `Entities` toggle beside `Grid` shows or hides red living-entity markers; player markers always stay. Clicking teleports the player who opened the map, deriving the landing Y from the authored terrain and fluid field. Manual pan or zoom disables Follow. Hover reads the same biome domain the map draws.

The **River network** mode reads the accepted hydrology footprint. Its labels are `headwater / source`, `surface pool`, `riffle`, `cascade`, `waterfall`, `sinkhole`, `underground pool`, `underground drop`, `coastal grotto`, `inland grotto`, `mouth`, `deep pool`, and `deep channel`. Rejected candidates appear only in a separate diagnostic channel as `projected source`, `projected outlet`, or `projected deep fluid`, with their rejection reason. The normal **Biome** view composites accepted surface hydrology over the natural biome domain. Vision also exposes compiled named image-map layers, using the same coordinate transform as generation.

**Noise Explorer** (`/iris studio noise`) loads a pack generator when you select it. Its seed field starts from the command seed; **Apply** rebuilds the selected sampler deterministically. Choose the signed, terrain, or grayscale palette from the toolbar. The status strip reports source, coordinates, scale, sampled range, and render progress, including invalid or out-of-range values. Slow sources deliberately stay coarser rather than forcing an exact-pixel pass.

**Image Map Studio** imports a canonical PNG, reports its dimensions and channel layout, assigns a typed resource, configures coordinates and decoding, previews interpreted height, target, or mask data with chunk, region, and world-boundary overlays, and exports the source, `image-maps/<key>.json`, and the dimension binding. Presets retain decoding and transform settings; replacing the source reruns inspection without rebuilding the binding. See [37 - Image Maps](/iris/37-image-maps).

> On Paper-family servers, a vanilla `/tp` into an unloaded Studio chunk is reissued as an asynchronous teleport. Plugin integrations are not rewritten and must use Paper's asynchronous teleport API when targeting an unloaded Studio chunk.
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

1. Resolve pack folder `packs/<dimensionKey>/` with a loadable `dimensions/<key>.json`.
2. Pack validation must not report blocking errors. An unvalidated pack fails closed.
3. Close the existing studio if one is open.
4. Create a studio world bound to that pack folder, not to a production install copy.
5. Optionally launch VSCode when `studio.openVSCode` is true.
6. Datapack installation requires a restart only when the selected pack needs new or changed dimension-type, custom-biome, or biome-tag registry content. The message tells you to re-run `open` after restarting.

Object, structure, jigsaw, pool, and other non-registry edits never force that restart. Creating a persistent world from the same pack does not either.

Object and Jigsaw Studio use flat authoring floors and the `minecraft:plains` biome, so their biome and base-height queries do not sample the pack's terrain or hydrology. Standard Studio keeps the complete terrain and hydrology pipeline for the selected pack and seed.

## VSCode workspace

Iris writes `<pack>/<packName>.code-workspace`:

| Workspace setting | Value / purpose |
|-------------------|-----------------|
| `folders` | `[{ "path": "." }]` — the pack root |
| `workbench.colorTheme` | `Monokai` (dark preference `Solarized Dark`) |
| `files.autoSave` | `onFocusChange` — so switching windows triggers a hotload |
| `[json]` editor options | Bracket indent, smart accept-on-enter, trim trailing whitespace and final newlines, quick suggestions inside strings, replace-mode insert, keyword/snippet/word suggestions off so only schema entries are offered |
| `json.maxItemsComputed` | `30000` — large enough that big registry enums still complete |
| `json.schemas` | Array of `{ fileMatch, url }` entries, sorted by url |

The same call merges the mappings into `<pack>/.idea/jsonSchemas.xml` so IntelliJ picks up the schemas. IntelliJ mapping failures are reported but cannot suppress the VSCode workspace or schemas. The workspace file is only rewritten when its rendered content changes. If it is unparseable, Iris deletes and recreates it, losing hand-edited workspace settings but never pack content.

## Schema generation

Iris reflects each registrant or snippet class and emits JSON Schema draft-07:

- `$schema` is `http://json-schema.org/draft-07/schema#`.
- `$id` is `https://volmit.com/iris-schema/<lowercased class simple name>.json`.
- Every property's `description` is assembled from the field name, its `@Desc` text, the type name, and the type's own `@Desc`. It also includes a snippet hint where applicable and the field's **default value**, read by instantiating the owning class. That is why hovering a field in the editor tells you what it defaults to without opening the source.
- `@MinNumber`/`@MaxNumber` become `minimum`/`maximum` on numeric fields and `minLength`/`maxLength` on string fields. `@Required` fills the `required` array. `@ArrayType` supplies the array item schema.
- Registry annotations become `enum` lists. `@RegistryListResource` covers pack resource keys of a given type. `@RegistryListFunction` covers computed lists such as mantle component flags. Platform registry annotations cover live server registries: `@RegistryListBlockType`, `@RegistryListBiome`, `@RegistryListEntityType`, `@RegistryListItemType`, `@RegistryListStructure`, `@RegistryListVanillaStructure`, `@RegistryListVanillaStructureSet`, `@RegistryListNativeJigsawPool`, `@RegistryListPotionEffect`, `@RegistryListEnchantment`, `@RegistryListSpecialEntity`, `@RegistryListFont`, `@RegistryMapBlockState`.
- A field with no `@Desc` still emits, with the description `No Field Description`, and logs a warning naming the field and class.

> **These annotations are editor hints only.** Nothing validates `@Required`, `@MinNumber` or `@MaxNumber` at load time by itself. The schema underlines an out-of-range value in your editor, but a feature needs an explicit runtime validator to reject it. Dimension-type height and world-boundary rules in [11 - Dimensions](/iris/11-dimensions), the hydrology and `riverPolicy` contracts in [36 - Rivers](/iris/36-rivers), and the image-map contract in [43 - Image Map Configuration & Coordinates](/iris/43-image-map-config-coordinates) have explicit runtime validation.
{.is-warning}

### Snippets

Classes annotated `@Snippet("<type>")` get their own schema at `.iris/schema/snippet/<type>-schema.json`. Every field of a snippet type is emitted as an `anyOf` of the inline object and a string. The string alternative is itself an `anyOf` of an enum of the snippet files that currently exist and the pattern `^snippet/<type>/`. Both existing and not-yet-created snippet paths validate.

At load time a string in a snippet-typed position is resolved as a file: `"snippet/decorator/wildflowers"` reads `<pack>/snippet/decorator/wildflowers.json` and parses it in place. This works anywhere the type appears, including inside arrays. A string that does not start with `snippet/` resolves to null. A missing snippet file logs an error naming the reference and the JSON path.

### File matching

Each loader that supports schemas emits seven glob patterns per folder so nested resource keys are covered:

| Pack folder pattern | Schema URL (relative to pack) |
|---------------------|--------------------------------|
| `/<folder>/*.json` through `/<folder>/*/*/*/*/*/*/*.json` (7 depth levels) | `./.iris/schema/<folder>-schema.json` |
| `/snippet/<type>/*.json` through 7 levels | `./.iris/schema/snippet/<type>-schema.json` |

Folders with schemas: `dimensions`, `regions`, `biomes`, `generators`, `image-maps`, `loot`, `entities`, `spawners`, `markers`, `blocks`, `expressions`, `mods`, `structures`, `jigsaw-pools`, `jigsaw-pieces`. The object, source-image, and matter loaders hold binary content, so `objects/`, `images/` and `matter/` get no schema. Typed JSON under `image-maps/` does.

Files under `.iris/schema/` are generated editor artifacts. They are safe to delete and are rewritten on the next workspace update. Pack content is the JSON under the type folders.

### What refreshes schemas

| Trigger | Effect |
|---------|--------|
| `/iris studio update dimension=<dim>` | Rewrites the workspace and queues schema writes |
| `/iris studio open` | Refreshes the canonical workspace and writes every referenced schema before an optional desktop launch |
| `/iris studio create` | Builds the workspace config and queues schema writes |
| Successful hotload | The platform hook may refresh the workspace |

Registry-backed enums are captured from the live server. **A schema generated on a server without a mod installed will not offer that mod's blocks.** Regenerate after changing the server's mod or datapack set. On Bukkit-family servers, block and item enum discovery excludes legacy `Material` constants.

## Studio dimension modes

The dimension field `studioMode` swaps in a debug generator. It is applied by the Bukkit chunk generator only. Fabric, Forge and NeoForge ignore it.

| Value | Effect |
|-------|--------|
| `NORMAL` | Default generation |
| `BIOME_BUFFET_1x1`, `_3x3`, `_5x5`, `_9x9`, `_18x18`, `_36x36` | Lays every biome out in a grid of that cell size so palettes and decorators can be compared side by side |
| `OBJECT_BUFFET` | Object studio generator. Also forced automatically while an object studio session is active |
| `REGION_BUFFET` | Deprecated alias of `NORMAL`. It installs no studio generator and will be removed in a future release |

Biome Buffet sorts supported pack biomes by load key and places them from chunk `(0, 0)` along positive X, then positive Z. Each cell treats its selected biome as land and uses its authored owner region, or a deterministic neutral owner when no region references it. Cells outside the layout contain a barrier floor. Changing cells neither changes `focus` nor hotloads the pack.

These are testing fields, not production world modes; the production engine mode is `mode.type` (see [11 - Dimensions](/iris/11-dimensions)). Remove `studioMode` before packaging.

Jigsaw Studio does not add a `studioMode` value. `/iris jigsaw open` and `create` select its generator transiently for one Studio activation.

## Jigsaw Studio

`/iris jigsaw` opens one structure graph through the same transient Studio lifecycle, with its own generator, workcell layout, control GUI, and autosave. It suppresses ordinary pack-file hotload, so close and reopen it to pick up unrelated external pack edits. Bukkit has one global Studio world and one owning Jigsaw session; non-owner edits are cancelled.

The whole workflow, commands, marker rules, portability blockers, and recovery steps are in [21 - Jigsaw Structures](/iris/21-jigsaw-structures). The JSON is in [21b - Jigsaw Resources](/iris/21b-jigsaw-resources).

## Platform notes

| Platform | Studio |
|----------|--------|
| Paper / Purpur / Folia (Bukkit plugin) | Full studio command set plus file-watch hotload on studio worlds. `studioMode` honored. Jigsaw Studio available |
| Fabric / Forge / NeoForge | Studio open/create/workspace/package and a subset of tooling. No Bukkit-only importers or inventory GUIs. `studioMode` ignored. No Jigsaw Studio authoring commands |

Pack JSON contracts are shared across every platform, and schemas are built from the same core models, so a pack authored on one platform loads on all of them.

Hydrology is authored through the ordinary dimension, region, and biome schemas: `hydrology` owns `rivers` and `deepFluids`, and `riverPolicy` resolves dimension → region → biome. Regenerate schemas, validate the pack, then use Vision's **River network** mode to inspect accepted feature footprints. The complete field contract is in [36 - Rivers](/iris/36-rivers).
