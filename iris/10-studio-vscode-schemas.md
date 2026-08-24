---
title: "Studio & VSCode Schemas"
description: "Iris documentation: Studio & VSCode Schemas"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Studio is the live pack-authoring loop. Open a pack as a throwaway world and edit its JSON against schemas generated from the Java models. Save, then watch the running engine rebuild itself. This page covers the loop, the commands, the hotload rules, and how schemas are produced.

Related: see [04 - Commands & Permissions](/iris/04-commands-permissions), [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout), [02 - Getting Started](/iris/02-getting-started), [11 - Dimensions](/iris/11-dimensions), [21 - Jigsaw Structures](/iris/21-jigsaw-structures), [25 - Pack Management](/iris/25-pack-management), [30 - Platform Differences](/iris/30-platform-differences), and [36 - Rivers](/iris/36-rivers).

## The edit loop

Prerequisites: a writable packs directory. You also need operator access on Bukkit or gamemaster access on a mod loader. Put VSCode/Cursor (or IntelliJ) on the machine that holds the pack folder. Keep the server console visible — hotload reports success and failure there.

### Bukkit-family

1. **Create a project.** `/iris studio create name=tutorial`
   Writes `packs/tutorial/` with a dimension, region, biome, generator, and a `tutorial.code-workspace`. The command reports the completed project path. Creation runs asynchronously and may report that a restart is needed before the pack can be opened.
2. **Open it as a world.** `/iris studio open tutorial seed=1337`
   You enter the transient world in spectator mode at its fixed generator anchor, centered on `0,0` near Y 96 and clamped to the world's build height. Studio performs no surface, hazard, fluid, collision, support, headroom, nearby-column search, or entry-area precompute. After native structure state is activated, Iris delegates immediately to Paper's asynchronous teleport, which owns destination-chunk readiness. `prepare_structure_rings` and `teleport_standard_entry` timings identify those costs separately. Iris refreshes the pack's canonical workspace and materializes its JSON schemas before attempting any desktop launch. A fixed seed matters — you will be comparing the same coordinates across reloads.
3. **Open the editor workspace.** `/iris studio vscode dimension=tutorial`
   Refreshes `<pack>/<pack>.code-workspace`, rewrites `.iris/schema/*`, and opens that exact workspace. Generation still completes when `studio.openVSCode` is false or the server is headless; only the desktop launch is skipped. Copy the pack folder to your machine and open the workspace file yourself.
   *Success condition:* typing `"` inside any object in `biomes/starter.json` offers field names, and hovering a field shows its description, type, and default value. If it does not, the workspace was not opened or the schemas were never written — run `/iris studio update dimension=tutorial`.
4. **Make one change.** Edit `packs/tutorial/biomes/starter.json` and change only its display `name`. Save once.
5. **Wait for the hotload result** in console before saving anything else. A failed hotload leaves the previous runtime active and reports the error. Stacking more edits on top makes the first failure hard to find.
6. **Verify in fresh terrain.** Walk into chunks that have never generated and run `/iris what biome`. The new display name appears there. Hotload never rewrites blocks that already exist, so standing still and expecting the world to change is the usual false negative.
7. **Validate.** `/iris pack validate pack=tutorial` — no blocking errors.
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

A rejected height or dimension-type change is not evidence that hotload is broken — those are refused by design. See **Hotload rules** below.

### When something goes wrong

| Symptom | Meaning | Recovery |
|---|---|---|
| Ordinary or Jigsaw `open` reports startup validation pending, missing, failed, restart-required, or blocking pack errors | Datapacks or the pack graph cannot safely build the transient world | Complete the requested restart or run the platform's `pack validate` form, fix the first blocking error, and retry. The player receives the cached reasons and the console receives one warning without an expected-failure stack trace. Do not bypass validation |
| Save reports hotload failure | The new data or runtime build failed. The previous runtime may remain active | Fix the first console error and save again before making unrelated edits |
| Height, environment, or generated dimension-type change is rejected | The edit violates the Studio runtime contract | Close Studio and reopen. On modded, restart when regenerated dimension-type datapacks require a registry reload |
| A valid change is invisible | The chunks you are standing in are already materialized, or the edited resource is unreachable from the active dimension | Move to new chunks. Trace dimension → region → biome to confirm the resource is actually referenced. Use `focus`/`focusRegion` or a buffet studio mode to isolate |
| No autocomplete, or resource keys are stale | Schemas were not generated or refreshed, or the editor never opened the workspace | Run `/iris studio update`, then open the pack's `.code-workspace`. On headless servers open it manually |
| The Studio world disappears after a restart | Studio worlds are transient and purged on purpose | Reopen the pack. `packs/<key>/` is the source of truth, not the world folder |

## What Studio is

| Concept | Behavior |
|---------|----------|
| Pack workspace | Packs live under the platform data directory in the folder named `packs` (`StudioSVC.WORKSPACE_NAME`) |
| Studio world | Opened from a pack dimension key. Uses a studio chunk generator bound to the live pack folder with file watching |
| Hotload | Studio worlds only. Routine checks drain native recursive events without statting every known pack leaf. Scheduled full scans plus rolling SHA-256 reconciliation detect silent and same-metadata saves; reconciliation yields between files after 32 files, 8 MiB, or roughly 10 milliseconds. Changes collapse into a latest-state queue with no more than one completed hotload every 3 seconds. `EngineHotloader` waits for already-admitted top-level Bukkit chunk stages, reloads the pack data, and rebuilds the engine runtime under exclusive generator control. Fair stage admission keeps later chunk stages behind the waiting transition, and Studio close uses the same drain boundary. Biome Buffet resolves its chunk focus and completes any required complex hotload under exclusive admission. Then that noise stage opens a generation session and downgrades directly to one ordinary stage permit |
| Hotload contract | Iris refuses hotload if the dimension type key, exact environment, or effective generated dimension type changes. The generated type includes min height, total height, logical height, resolved `dimensionOptions`, and the `fullbright` ambient-light override |
| Non-studio worlds | No pack file watcher. Production worlds keep the pack snapshot installed at create or update time |

Studio settings live in `settings.json` under `studio` (`IrisSettings.IrisSettingsStudio`):

| Key | Default | Meaning |
|-----|---------|---------|
| `openVSCode` | `true` | When true and the JVM is not headless, `open`/`vscode` may launch the desktop opener on the pack's `*.code-workspace`. Set false on servers where a desktop launch would be pointless or unwanted |
| `entitySpawning` | `true` | Only affects Studio worlds. False stops Iris ambient entity spawning there. Production worlds always spawn regardless of this key |
| `disableTimeAndWeather` | `true` | Freezes weather and the day cycle at noon in studio worlds. Set false to let them run while authoring. Night and storm Iris spawners do not fire here until this is false or you test in a production world |
| `autoStartDefaultStudio` | `false` | Opens a studio world for the default pack automatically at boot |

## Hotload rules

- The watcher runs only when `PlatformChunkGenerator.isStudio()` is true, the world is not closing, and no Jigsaw Studio session is active. Jigsaw Studio deliberately suppresses ordinary pack-file hotload.
- Routine polls consume native events instead of walking every pack file. Scheduled state scans and rolling SHA-256 content reconciliation cover silent mounts, atomic replacements, FTP handoffs, watcher overflow, and same-metadata edits. The reconciliation limits apply between files; directory enumeration, a full watcher scan, or one individual file read can take longer. Common temporary files and `.iris` output are ignored. A failed apply remains queued, and saves made during the 3-second cooldown replace the queued state rather than adding reloads.
- On change: load a new `IrisData` from the same folder. Reload the dimension key and check the hotload contract. Build a new engine runtime and retire the previous data. Refresh the workspace and schemas. Reload datapacks when a platform world is bound. Broadcast a client studio-hotload toast on success or failure.
- `hotloadComplex` is a narrower rebuild that reconstructs `IrisComplex` without reopening the pack.
- A failed hotload rolls the runtime back where possible and reports the error.

The dimension type key, exact environment, and effective generated dimension type are pinned for the life of the world and cannot hotload. The generated type contains min height, total height, logical height, every `dimensionOptions` value after base-template resolution, and the `fullbright` ambient-light override. Close and reopen Studio after editing the dimension file name or any of those fields when the edit changes the effective contract. See [11 - Dimensions](/iris/11-dimensions).

## Commands (Bukkit)

Root: `/iris studio`, aliases `std` and `s`. Implemented by `CommandStudio` and `StudioSVC`. Keyed arguments. The first column shows the primary subcommand name.

| Subcommand | Aliases | What it does |
|------------|---------|--------------|
| `open <dimension> [seed=1337]` | `o` | Closes any open studio and opens the pack as a studio world. Blocked unless startup datapack validation is ready and the selected pack has a loadable validation result |
| `close` | `x` | Closes the active studio project and world |
| `create [name=studio] [template=<dimension>]` | `+` | Creates a pack under `packs/<name>` after startup validation is ready. A named template must already be installed and validate as loadable. Without one, Iris writes the starter skeleton below |
| `vscode [dimension=default]` | `vsc` | Opens the pack's VSCode workspace, generating it if missing |
| `update [dimension=default]` | | Rewrites `<pack>/<name>.code-workspace` and queues regeneration of `.iris/schema/*` |
| `version [dimension=default]` | | Prints the dimension's `version` field |
| `pkg [dimension=default] [obfuscate=false] [minify=true]` | `package` | Compiles the pack into a distributable archive |
| `importvanilla <dimension> [variants=3] [structures=true]` | `importv`, `iv` | Captures vanilla features and structures into the pack through Bukkit NMS |
| `scoreboard` | `board`, `sidebar`, `sb` | Toggles the studio debug scoreboard. Player must be in the studio world. Its numeric score column is hidden on clients and servers that support the native blank number format |
| `noise [generator=<key>] [seed=12345]` | `nmap` | Opens the external noise explorer GUI |
| `map [world=<world>]` | `render` | Opens the external biome/terrain map GUI for an Iris world |
| `regions [radius=500]` | | Samples region rarity over a chunk spiral. Player must be in an Iris world |
| `loot [fast=false] [add=true]` | | Opens a virtual chest showing loot tables for the block under the player |
| `profile [dimension=default]` | | Writes a pack performance profile report |
| `spawn` | `summon` | Spawns a pack entity definition at the player |
| `tpstudio` | `stp` | Delegates immediately to Paper's asynchronous teleport at the fixed Studio entry anchor, without an Iris chunk preload or surface lookup. Standard Studio uses spectator mode. The command shares the open/close transition queue and reports a timeout after 10 seconds |
| `objects` | `find-objects` | Captures a nearby-chunk object placement report |

Permissions and the full `/iris` tree: see [04 - Commands & Permissions](/iris/04-commands-permissions).

## Desktop map and noise explorers

The Vision map and Noise Explorer are local desktop authoring tools. They do not open on a headless server or when server-launched GUIs are disabled.

The Vision map opens with a compact render-mode selector, world coordinates, scale, render progress, and contextual Height and River legends. Drag to pan and use the mouse wheel or trackpad to zoom in small continuous increments of about 5.7% per full wheel notch. The world coordinate beneath the live pointer remains fixed throughout zoom, and manual pan or zoom disables Follow so marker updates cannot recenter the view during the gesture. A Bukkit cursor teleport urgently loads its destination chunk asynchronously, resolves the surface on that chunk's owning thread, and delegates movement to the player's entity scheduler; it never synchronously loads an absent chunk from a Folia region thread. The displayed atlas scales immediately while one exact replacement request is coalesced after the gesture settles. Vision has one final-quality map atlas: it publishes completed 64×64 world-aligned pages directly and has no preview pass, refinement pass, quality toggle, or stretched low-resolution tile. Categorical modes solve uniform authored biome-domain areas as blocks and subdivide only boundaries, while Height retains its continuous natural-height sampling. The normal **Biome** view composites footprint-aware wet channels, mouths, banks, dry channels, and dry banks over the base biome domain; **River network** isolates those same runtime classifications against the no-river field. Pages are cached by content revision, mode, exact scale, and world coordinate, so repainting, small pans, resizes, and returning to an earlier view reuse completed work instead of sampling again. Persistent bounded workers render nearest pages first, cancel superseded pages at sample boundaries, never sample on the Swing event thread, and shut down without waiting when the window closes. Hover reads the same base biome domain shown by the map. Height mode uses a normalized terrain palette instead of wrapping raw block heights around a rainbow hue wheel.

Noise Explorer shows its window before scanning the generator catalog and loads a pack generator only when selected. Its seed field starts from the command seed; **Apply** rebuilds the selected sampler deterministically, and the seed is mixed once per rebuild rather than once per pixel. Drag to pan, use the mouse wheel to zoom around the cursor in the same roughly 5.7% increments as Vision, and choose the signed, terrain, or grayscale palette from the toolbar. Drag, wheel, and resize events coalesce before submitting another preview instead of starting a render for every input event. The status strip reports source, coordinates, scale, sampled range, and render progress, including invalid or out-of-range values. Sampling runs in bounded row-major background work: a preview capped at about 4,000 samples completes first, then measured throughput chooses one more detailed pass targeting about 250 milliseconds and never exceeding 48,000 samples. Slow sources deliberately remain coarser instead of forcing an unbounded exact-pixel pass. Every revision owns isolated coordinator and worker lanes, so repeated stale samplers that ignore interruption cannot starve the latest view's capacity. An unchanged idle view is not sampled again.

Closing either window cancels its current work before native disposal. On macOS, Command-Q or Dock Quit closes every Iris desktop window but does not terminate the server JVM.

## Commands (Modded)

`/iris studio` on Fabric, Forge and NeoForge is implemented by `ModdedStudioCommands` with positional arguments. Supported: `create`/`+`, `package`/`pkg`, `version`, `regions`, `open`/`o`, `close`/`x`, `tpstudio`/`stp`, `status`, `vscode`/`vsc`, `update`, `noise`/`nmap`, `map`/`render`.

`create` with no arguments creates a project named `studio` from the `example` template. `create <name>` uses the same template. `create <name> <template>` picks another. `open <pack> [seed]` defaults the seed to `1337`.

These subcommands are registered on modded but only report why they are unavailable. `importvanilla`/`importv`/`iv` needs throwaway Bukkit worlds via NMS. `loot` needs a Bukkit chest inventory GUI. `profile`, `spawn`/`summon`, and `objects`/`find-objects` also need Bukkit.

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

Starter dimension JSON, verbatim from `StudioSVC.createStarterProject`:

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

With a template — `/iris studio create name=mypack template=overworld` — Iris requires the template pack to already be installed and loadable, then copies its tree into the new pack key. Missing templates are never downloaded implicitly.

## Studio open workflow

1. Resolve pack folder `packs/<dimensionKey>/` with a loadable `dimensions/<key>.json`.
2. Pack validation must not report blocking errors (`PackValidationRegistry`). An unvalidated pack fails closed.
3. Close the existing studio if one is open.
4. `IrisProject.open` creates a studio world bound to that pack folder — not to a production install copy.
5. Optionally launch VSCode when `studio.openVSCode` is true.
6. Datapack installation requires a restart only when the selected pack needs new or changed dimension-type, custom-biome, or biome-tag registry content. The message tells you to re-run `open` after restarting.

Ordinary, Object, and Jigsaw Studio compare the selected dimension with the registry requirements pinned when the server loaded Iris's datapack. That comparison uses generated dimension type, custom-biome JSON, and per-biome tag membership. When every requested entry is present and identical, Studio reuses that loaded runtime. Creating a persistent Iris world from the same pack adds a frozen pack copy and a boot-time LevelStem binding. Those duplicate or unrelated entries do not change the selected Studio dimension's registry requirements. They do not trigger a restart.

A new or changed required registry entry invalidates reuse. So does an unavailable registry, failed startup recovery, or changed/failed external datapack ingest or removal. Iris then falls back to recovery, compilation, publication, and the existing restart gate. Object, structure, jigsaw, pool, ownership, and other non-registry edits do not force that fallback.

Compiler-input discovery resolves the canonical Iris authoring-pack and world-snapshot roots directly. It never searches saved region, entity, POI, or other chunk-storage trees for a nested `iris/pack`. Verification time scales with pack inputs rather than generated world size.

Ordinary Studio completes its runtime, generator preparation, and native structure activation before reporting ready. A console-issued `STANDARD` open does not request or load the landing chunk. A real player open and a later `tpstudio` delegate the fixed anchor immediately and let Paper's normal FULL pipeline generate the destination on demand. Studio does not replace the center with a lobby, plate, precomputed entry area, simplified biome field, lower chunk status, or reduced generation pipeline. The entry and all of Minecraft's required dependencies use the same terrain, mantle, rivers, structures, carvers, decoration, heightmaps, and visible biomes as production generation. Studio may launch the pack workspace and preserves native structures for generation previews after bootstrap. On Paper 26.2, WorldInit publishes the filtered native-structure placement state once but leaves it uninitialized while native starts, locates, and object-collision volume queries are gated. Injection verifies that Paper's canonical chunk-generator getter owns the new Iris generator before native structure state is published.

Before an on-demand player entry requests terrain, the global scheduler claims the exact level, chunk map, generator, and state, starts placement initialization, and registers the exact concentric-ring futures. Iris lowers the Studio bootstrap gate once that state is current, then delegates the fixed entry anchor directly to Paper's asynchronous teleport. Paper owns the one required FULL destination request, so Iris does not precompute an entry area or issue a redundant chunk request or region-thread heightmap lookup. Concentric-ring preparation may finish in the background; close and hotload still wait for its exact completion before mutating the engine. A console open performs the same structure activation but has no destination request. `tpstudio`, open, and close are serialized: a teleport that has not reached Paper by its 10-second deadline cannot fire late, while one already delegated keeps the transition barrier until Paper settles it. The final Studio callback also returns to the server scheduler before applying game rules or committing a Jigsaw session. Normal close, full hotload, and complex hotload wait up to 120 seconds for their exact aggregate before mutating or sealing the engine. A synchronous partial-start failure permanently rejects those transitions for that engine because a complete drain cannot be proven.

Jigsaw Studio publishes an initialized empty native-structure state even when no managed datapack scope exists. It never retains or activates the filtered full state, and keeps starts, references, locates, and native collision-volume queries disabled. Its dedicated open kind also skips the standard-entry teleport and workspace launch. It skips procedural generation-cache warm, complete mantle-radius preparation, and the ordinary pack-file hotloader. Then it sends the owner once through the selected workcell destination. Jigsaw graph transactions directly invalidate, reload, evaluate, and rematerialize their owned resources. Close and reopen Jigsaw Studio to apply unrelated external pack edits.

Paper-family and Folia on-demand entry delegates directly to Paper's asynchronous entity teleport at the generator's fixed anchor. Iris performs no entry-area precompute, separate chunk request, region task, heightmap read, block read, radius search, collision check, headroom check, or material and fluid validation. It also adds no Bukkit plugin chunk ticket. A console `STANDARD` open has no entry generation to delay it. If a legitimate registry change has already queued a terminal server restart, failed-open cleanup does not compete for a live lifecycle lease. Any materialized transient state is queued for startup deletion instead. Closing a Studio stops Iris engine maintenance at `WorldUnloadEvent`. It waits for the raw backend unload completion and any tracked native ring preparation before sealing the generator. The 26.2 noise pipeline keeps its generation lease through terrain and heightmap completion. Biome filling reuses that stage's existing generation lease and context across the complete quart grid instead of reacquiring them for every quart sample. Forced process termination cannot drain in-process ring futures.

Every Bukkit Studio open writes one `[Studio timing]` line per lifecycle phase. The line names the transient world and its `standard`, `object`, or `jigsaw` kind, phase duration, and cumulative duration where available. The measured phases separate loaded-runtime reuse, external-datapack recovery, compiler-input fingerprinting, datapack compilation/publication, generator preparation, native-structure activation, Bukkit world creation, standard asynchronous teleport, and finalization. Studio engine timing additionally separates prefetch loading, runtime construction, and the generation-cache warm or its Jigsaw-only skip. A slow open can then be correlated with a profiler capture.

## VSCode workspace

`IrisCodeWorkspace` writes `<pack>/<packName>.code-workspace`:

| Workspace setting | Value / purpose |
|-------------------|-----------------|
| `folders` | `[{ "path": "." }]` — the pack root |
| `workbench.colorTheme` | `Monokai` (dark preference `Solarized Dark`) |
| `files.autoSave` | `onFocusChange` — so switching windows triggers a hotload |
| `[json]` editor options | Bracket indent, smart accept-on-enter, trim trailing whitespace and final newlines, quick suggestions inside strings, replace-mode insert, keyword/snippet/word suggestions off so only schema entries are offered |
| `json.maxItemsComputed` | `30000` — large enough that big registry enums still complete |
| `json.schemas` | Array of `{ fileMatch, url }` entries, sorted by url |

The same call also merges the mappings into `<pack>/.idea/jsonSchemas.xml` so IntelliJ picks up the schemas. It writes that file whenever there is a mapping it does not already contain. IntelliJ mapping failures are reported but cannot suppress the VSCode workspace or schemas. The workspace file is only rewritten when its rendered content changes. If it is unparseable, Iris deletes and recreates it, losing hand-edited workspace settings but never pack content.

## Schema generation

`SchemaBuilder` reflects a registrant or snippet class and emits JSON Schema draft-07:

- `$schema` is `http://json-schema.org/draft-07/schema#`.
- `$id` is `https://volmit.com/iris-schema/<lowercased class simple name>.json`.
- Every property's `description` is assembled from the field name, its `@Desc` text, the type name, and the type's own `@Desc`. It also includes a snippet hint where applicable and the field's **default value**, read by instantiating the owning class. That is why hovering a field in the editor tells you what it defaults to without opening the source.
- `@MinNumber`/`@MaxNumber` become `minimum`/`maximum` on numeric fields and `minLength`/`maxLength` on string fields. `@Required` fills the `required` array. `@ArrayType` supplies the array item schema.
- Registry annotations become `enum` lists. `@RegistryListResource` covers pack resource keys of a given type. `@RegistryListFunction` covers computed lists such as mantle component flags. Platform registry annotations cover live server registries: `@RegistryListBlockType`, `@RegistryListBiome`, `@RegistryListEntityType`, `@RegistryListItemType`, `@RegistryListStructure`, `@RegistryListVanillaStructure`, `@RegistryListVanillaStructureSet`, `@RegistryListNativeJigsawPool`, `@RegistryListPotionEffect`, `@RegistryListEnchantment`, `@RegistryListSpecialEntity`, `@RegistryListFont`, `@RegistryMapBlockState`.
- A field with no `@Desc` still emits, with the description `No Field Description`. The builder logs a warning naming the field and class when the schema is generated. A type with no `@Desc` logs a similar warning. Every enum-valued deposit option and every selectable enum value carries authored `@Desc` text. Dimension, Biome, and Region schema generation therefore exposes complete deposit hover help without missing-description warnings.

**These annotations are editor hints only.** Nothing validates `@Required`, `@MinNumber` or `@MaxNumber` at load time by itself. The schema will underline an out-of-range value in your editor, but a feature needs an explicit runtime validator to reject it. Dimension-type height rules in [11 - Dimensions](/iris/11-dimensions) and the river network contracts in [36 - Rivers](/iris/36-rivers) have those runtime validators.

### Snippets

Classes annotated `@Snippet("<type>")` get their own schema at `.iris/schema/snippet/<type>-schema.json`. Every field of a snippet type is emitted as an `anyOf` of the inline object and a string. The string alternative is itself an `anyOf` of an enum of the snippet files that currently exist and the pattern `^snippet/<type>/`. Both existing and not-yet-created snippet paths validate.

At load time a Gson type adapter resolves any string in a snippet-typed position: `"snippet/decorator/wildflowers"` reads `<pack>/snippet/decorator/wildflowers.json` and parses it in place. This works anywhere the type appears, including inside arrays. A string that does not start with `snippet/` resolves to null. A missing snippet file logs an error naming the reference and the JSON path.

### File matching

`ResourceLoader.buildSchema()` runs for each loader that reports `supportsSchemas()`, and emits seven glob patterns per folder so nested resource keys are covered:

| Pack folder pattern | Schema URL (relative to pack) |
|---------------------|--------------------------------|
| `/<folder>/*.json` through `/<folder>/*/*/*/*/*/*/*.json` (7 depth levels) | `./.iris/schema/<folder>-schema.json` |
| `/snippet/<type>/*.json` through 7 levels | `./.iris/schema/snippet/<type>-schema.json` |

Folders with schemas: `dimensions`, `regions`, `biomes`, `generators`, `loot`, `entities`, `spawners`, `markers`, `blocks`, `expressions`, `mods`, `structures`, `jigsaw-pools`, `jigsaw-pieces`. The object, image, and matter loaders return false from `supportsSchemas()` because their content is binary, so `objects/`, `images/` and `matter/` get no schema.

Files under `.iris/schema/` are generated editor artifacts. They are safe to delete and are rewritten on the next workspace update. Pack content is the JSON under the type folders.

### What refreshes schemas

| Trigger | Effect |
|---------|--------|
| `/iris studio update dimension=<dim>` | Rewrites the workspace and queues schema writes |
| `/iris studio open` | Refreshes the canonical workspace and fully writes every referenced schema before an optional desktop launch on Bukkit and modded |
| `/iris studio create` | Builds the workspace config and queues schema writes |
| Successful hotload | The platform hook may refresh the workspace |

Registry-backed enums are captured from the live server. A schema generated on a server without a mod installed will not offer that mod's blocks. Regenerate after changing the server's mod or datapack set.

On Bukkit-family servers, block and item enum discovery excludes legacy `Material` constants. Schemas therefore offer only current registry values and do not initialize CraftLegacy while the schema builder starts.

## Studio dimension modes (author testing)

The dimension field `studioMode` swaps in a debug generator. It is applied by the Bukkit chunk generator only. Fabric, Forge and NeoForge ignore it.

| Value | Effect |
|-------|--------|
| `NORMAL` | Default generation |
| `BIOME_BUFFET_1x1`, `_3x3`, `_5x5`, `_9x9`, `_18x18`, `_36x36` | Lays every biome out in a grid of that cell size so palettes and decorators can be compared side by side |
| `OBJECT_BUFFET` | Object studio generator. Also forced automatically while an object studio session is active |
| `REGION_BUFFET` | Deprecated alias of `NORMAL`. It installs no studio generator and will be removed in a future release |

These are testing fields, not production world modes — the production engine mode is `mode.type` (see [11 - Dimensions](/iris/11-dimensions)). Remove `studioMode` before packaging.

Jigsaw Studio does not add a `studioMode` value. `/iris jigsaw open` and `create` select its generator transiently for one Studio activation.

## Jigsaw Studio (Bukkit)

`/iris jigsaw` opens one selected structure graph through the transient Studio lifecycle, but chooses `JigsawStudioGenerator` for that activation without persisting a special dimension mode. The owner enters in creative, `spawn_mobs` is disabled, and natural creature-spawn events are cancelled. Planar Studio has six rotation-independent workcells in a compact three-column by two-row layout: Blank, End Cap, Hallway, L Junction, T Junction, and Cross Junction. Spatial Studio places every variant in its own dedicated cell in one horizontal row. New spatial projects seed seven 15×15×15 cells labeled 0 through 6 connectors. Each successive cell adds one extra north, south, east, west, up, then down face-center connector. All seven pieces belong to the start pool. The 1-through-6 connector pieces also belong to the generated pieces pool with an explicit empty terminator and a 16-placement default per piece. Their seed-`1337` preview is a connected blob raised 48 blocks above the editing floor without making the intentionally connectorless piece an unreachable child. There is no orientation, permutation, or derived-rotation gallery.

Each planar floor is light-gray wool with a red canonical topology glyph and sea-lantern caps at its face-center connector positions. Every workcell has an independent width, height, depth, enabled state, and optional author label. Those dimensions are capacity only. Changing one never rewrites a variant object, and the complete change is rejected if any existing variant would no longer fit. Each owned variant has its own exact width, height, depth, and optional label. One End Cap can be a `16×3×3` longhouse while another End Cap in the same workcell remains `3×3×3`. Per-variant growth or lossless shrink preserves in-bounds canonical content and moves canonical connector payloads and sockets to the new face centers. Cropped stored content, connector collisions, or shared/read-only objects reject the transaction. Workcell Settings stages width, height, and depth clicks in the open menu and performs one live regeneration only after **Apply Cell Size**. Resizing the loaded variant still reloads that cell in place. Every enabled or disabled cell uses a physical white-concrete edge cage with particle trails drawn inside its editable bounds. No workcell-bound display entity is spawned. Existing planar variants are rotated into the archetype's canonical display orientation and inverse-rotated during capture. Their piece resources, dimensions, labels, and pool entries remain distinct.

Create a default planar, Iris-native graph with:

```text
/iris jigsaw create <dimension> <key>
```

`key` is the structure's internal resource path. `village/demo` writes `structures/village/demo.json` and becomes the key used by Iris placements and later editing. Named arguments `structure=` and `name=` are aliases for `key=`. They do not select a separate vanilla structure or template. Omitted options default to `mode=planar`, `compatibility=iris`, `width=15`, `height=15`, `depth=15`, and `seed=1337`. `mode=` completes `planar` or `spatial`. `compatibility=` completes `iris` or `vanilla`. Existing Iris keys tab-complete for `open`, `edit`, and `reopen`.

New Iris-compatible planar projects contain one owned piece for every archetype. They assign every piece to the weighted `variant-1` structure theme. They mark the End piece terminal. New vanilla-compatible projects contain the same six owned pieces but omit Iris theme and terminal-rule metadata. Open an owned graph with `/iris jigsaw open <dimension> <key>` or the equivalent `edit`/`reopen` alias. Existing unowned Iris graphs use `adopt inspect` then `adopt apply`. Managed datapack imports must be cloned. Registered vanilla or datapack jigsaws use `convert`, which creates a separate owned Iris graph.

The `open` key is an Iris resource path such as `minecraft_ancient_city`, not a live namespaced registry key. Use `convert <dimension> minecraft:ancient_city target=<unused-key>` to copy the registered graph, or adopt an existing unowned Iris copy. All Jigsaw opens retain the same whole-pack validation and startup registry gates as ordinary Studio because the transient world still compiles the selected dimension.

The owner can open the six-row control GUI by right-clicking its protected chest, running `/iris jigsaw menu`, or starting three sneaks within 1.5 seconds. Walking into a workcell also makes that physical cell the owner's next menu selection. Left-clicking a workcell selects it and teleports the owner to its horizontal center. The GUI selects workcells. It loads and creates variants and independently resizes them. It changes workcell capacity or enabled state. It toggles per-workcell connector blocks and restores broken connector blocks from the saved variant. It rewinds the latest autosave. It adjusts exact pool-entry weights and chances. It edits theme membership and piece rules. It toggles mandatory caps, navigates to the live preview, and deletes inactive variants or the complete project. Destructive actions require a second confirmation within 10 seconds.

**New Blank Variant** clones the active owned piece's complete metadata and every exact pool membership but creates an empty object with the same dimensions. **Duplicate This Cell's Variant** preserves the same metadata and memberships while copying only that source object's bytes. **Duplicate All Enabled Cells as Family** atomically clones the loaded owned variant in every enabled workcell and rebinds the complete family together. All duplication uses service-generated keys and requires active owned variants with owned pool memberships. A duplication clicked during dirty or in-flight autosave is queued once. It expedites autosave. It continues automatically only while the request, session, and source variants still match. Iris never chooses a first or lexicographically sorted pool as a fallback. Use `/iris jigsaw piece create <poolKey> <pieceKey>` for an empty or unassigned workcell.

The **Toolbox** page gives the player named stick items bound to the current Studio request and the selected workcell, variant, pool entry, or action. Variant/workcell rename sticks are renamed in an anvil, right-clicked to apply the 64-code-point label, and sneak-right-clicked to reset. Control characters and section-sign formatting are rejected. Right-clicking another valid tool performs its action or opens the exact GUI context needed for capacity, per-variant size, themes, or rules. Bound tools use schema `2`. Schema-`1` tools and sticks from a replaced or closed Studio are rejected. The active variant uses a jigsaw-block icon, valid evaluation uses an emerald, and lime dye is reserved for the explicitly labeled theme-membership toggle. Destructive stick tools also require a second right-click within 10 seconds.

Building, marker, container, and machine changes inside a loaded owned workcell autosave after a 40-tick quiet period. Before each changed graph commit, Iris retains the prior complete ownership-manifest closure. Identical resource blobs are deduplicated and the newest five iterations remain in one atomic `.iris/jigsaw-history/key-<sha256>.json` sidecar. **Undo Last Autosave** restores the newest entry through the same ownership writer, then reloads the affected active variant. Repeated clicks rewind until the five-entry stack is empty. Project creation clears stale same-key history and project deletion removes it. Fresh untouched workcells report **Autosaved**. Later edits replace the pending capture identity, and a busy autosave retries until the current save/load/graph barrier permits it.

When the owning player runs `/iris studio open` while Jigsaw Studio is active, Iris expedites and waits for these barriers. It claims the close. It then continues opening the ordinary Studio. Console and non-owner replacement remain blocked. Opening Mojang's jigsaw-block UI starts a persistent owning-region NBT watch. Changed tile data marks the workcell dirty. Commands, tools, teleport/world changes, quit, graph operations, **Flush Autosave Now**, close, and enabled-world unload request a final tile snapshot before proceeding. Tracked events include block placement, breakage, buckets, growth, fluids, pistons, redstone, and explosions. They also include block-state interactions, recognized mutating commands, and inventory click/drag/close plus internal move/pickup. Furnace, brewing-stand, dispenser, and crafter activity are tracked too.

**Flush Autosave Now** and `/iris jigsaw save` only request an immediate flush. If a barrier or scheduler prevents capture from starting, the same pending autosave remains queued for retry. They are not a required authoring step. Paper drains pending work synchronously during disable. A forced Folia plugin disable occurs after Folia rejects new region tasks. Close Studio or wait for `status` to report no pending autosave before a reload or server stop. That late disable hook cannot guarantee a new final cross-region capture. An external integration that bypasses Bukkit events must call `JigsawStudioService.markDirty(...)` or `markAllDirty(...)`.

Each committed graph is compiled and assembled automatically with seed `1337`. The GUI reports `PENDING`, `VALID`, `WARNING`, `INVALID`, or `STALE`, the selected theme, piece count, and current detail. Iris keeps the assembled blocks on the negative-X side for the active Studio session. It replaces them after later commits. It protects the complete preview bounds from edits, fluids, pistons, fire, growth, explosions, entities, and redstone. The live renderer accepts at most 250,000 explicit blocks. A larger result becomes `INVALID` with the render-limit diagnostic. **Go to Preview** or `/iris jigsaw preview goto` teleports above it. This live block preview is separate from `/iris jigsaw preview assemble`, which remains a temporary player-local particle diagnostic for an arbitrary seed.

Structure themes select one weighted family before assembly. **Duplicate All Enabled Cells as Family** allocates the next `variant-<n>` theme by default. It clones the currently loaded owned variant from every enabled workcell with its exact object size and label. It duplicates their pool memberships, assigns the new pieces to that family, and atomically loads the new family across those workcells. Individual loaded owned variants can join one or more declared themes. An empty theme list makes a piece available to every selected theme. Pool membership `chance` is an independent `0..1` eligibility gate applied before its positive relative weight. Piece rules constrain minimum/maximum depth, minimum/maximum placements, and terminal status. With mandatory caps enabled, an unresolved open connector must use its direct fallback to place a compatible terminal piece. Failure rejects that assembly. Themes, chance gates, piece rules, and mandatory caps are Iris-only and block `VANILLA_PORTABLE` compilation or export when used.

Connector blocks are hidden per workcell by default and can be shown from **Workcell Settings**. **Reset Connector Blocks** rewrites every saved connector coordinate in the selected workcell from the active on-disk variant while leaving every other edited block unchanged. It restores jigsaw orientation and NBT while visible, or the exact final block and tile NBT while hidden. If an autosave already committed a deleted connector, use **Undo Last Autosave** first. Hidden capture retains each connector's pool, identity, orientation, priorities, channel, and authored order. The ordinary block and tile NBT at that coordinate become its exact final state. Visible mode exposes Mojang's jigsaw UI for pool, name, target, joint, final state, and both signed priorities. `/iris jigsaw connector channel <channel|none>` changes the saved Iris-only channel for the exact targeted visible connector. Particle trails outline nearby and focused editable bounds inside the white-concrete cages. Connector diagnostics remain red for incomplete identity, lime for a valid connector without a channel, and deterministic by channel otherwise. The Iris scoreboard switches automatically to Jigsaw context. It shows the structure, author workcell label, canonical solver role when the label differs, loaded variant label, state, and `Triple-sneak for controls`. `/iris studio scoreboard` retains its session-only toggle behavior. Every successful atomic workcell save plays one owner-local bell.

Bukkit has one global Studio project/world and one owning Jigsaw session. Only that owner can control or mutate it. Non-owner edits are cancelled, non-owner commands use a strict informational/communication allowlist, and the control chest plus live preview are protected. Autosave, variant switching, graph changes, opening, closing, and deletion share operation barriers. Close waits for clean state unless `discard=true`. Discard is only for deliberately losing pending work.

Dimensions are capped at 128 blocks on X/Z, 192 on Y, and 2,097,152 blocks in total. Planar variant and capacity width/depth must each be at least 3. A workcell capacity change persists only structure metadata and verifies every variant fits. It leaves all object bytes unchanged. It atomically regenerates the affected white-concrete cage, objects, connector view, and block-entity hydration before editing resumes. Workcell Settings batches all three staged axes into that one transaction. **Discard Size Changes** cancels the menu-local values without writing. `variant resize` and the **Variant Size** screen change only the selected owned object. Lossless growth and shrink preserve in-bounds canonical content, reject cropped explicit air/blocks/tiles/connectors, and relocate planar canonical sockets. The loaded variant reloads in place. Inactive planar variants remain untouched, while a spatial variant's dedicated cell moves with the live row. **Resize to Capacity** or `/iris jigsaw piece expand` is a convenience for setting one selected object exactly to its current capacity. On Folia, each intersecting object chunk is read on its owning region and one graph write begins only after the full snapshot validates.

Deleting a planar variant is limited to an owned, inactive variant when another variant remains in that workcell. A spatial variant is always active in its dedicated cell, so deletion removes that cell when at least one other spatial variant remains. Project deletion first verifies ownership hashes and scans the pack for external JSON or ownership-manifest references. Any reverse reference blocks deletion. A clear result closes Studio and removes the complete owned resource set through a hash-pinned transaction. If the post-close delete fails, the project files remain on disk for recovery.

This command tree is Bukkit-only. Saved `PLANAR_JIGSAW` and `SPATIAL_JIGSAW` pack resources run in the shared core on Fabric, Forge, and NeoForge. Strict `VANILLA_PORTABLE` graphs can be exported as Minecraft 26.2 datapacks. The complete workflow, commands, marker rules, portability blockers, and recovery steps are in [21 - Jigsaw Structures](/iris/21-jigsaw-structures).

## Platform notes

| Platform | Studio |
|----------|--------|
| Paper / Purpur / Folia (Bukkit plugin) | Full `CommandStudio` plus file-watch hotload on studio worlds. `studioMode` honored. Jigsaw Studio available |
| Fabric / Forge / NeoForge | Studio open/create/workspace/package and a subset of tooling. No Bukkit-only importers or inventory GUIs. `studioMode` ignored. No Jigsaw Studio authoring commands |

Pack JSON contracts are shared across every platform. Schemas are built from the same core models. A pack authored on one platform loads on all of them.

River authoring uses the ordinary dimension, region, and biome schemas: `IrisDimension.rivers` owns the connected network, while region and biome `riverOverride` values alter local routing, geometry, cave-entry probability, terminal behavior, and biome pools without changing graph identity. After regenerating schemas, the editor exposes the nested topology, terrain, water, biome, and cave controls with their enum values and numeric bounds. Use the **River network** Iris Vision render to distinguish wet channels, mouths, banks, dry channels, and areas without a river footprint while tuning those fields.
