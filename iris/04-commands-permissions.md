---
title: "Commands & Permissions"
description: "Iris documentation: Commands & Permissions"
published: true
date: 2026-09-03T18:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Iris uses `/iris` (aliases `/ir`, `/irs`) on every platform. Bukkit optional arguments use `key=value`. Fabric, Forge, and NeoForge use positional arguments and literal flags. Platform gaps are marked **Bukkit-only** or **modded-only**.

See [30 - Platform Differences](/iris/30-platform-differences) for the platform matrix. See [03 - Configuration](/iris/03-configuration) for what `/iris reload` re-reads.

## Language selection

`/iris language` opens the clickable picker. Bukkit-family servers expose `/iris language self <locale|reset>` and `/iris language server <locale>`. Personal language selection requires both `iris.language.self` and `volmit.language.self`, each granted by default (`true`). Denying either permission blocks the personal picker, direct locale selection, and `self reset`. Server selection needs `iris.all` or `volmit.language.admin`.

On Bukkit-family servers, `/iris language server edit [locale]` opens the player inventory editor for individual messages. Omit the locale to choose one. It requires `iris.all` or `volmit.language.admin`, saves only the chosen locale, and preserves all language selections.

On Bukkit-family servers, `/volmit plugins languages` opens the picker for every enabled provider's server default; `/volmit plugins languages de_DE` changes those defaults to German. It preserves all personal overrides and offers only locales common to every provider. Access requires `volmit.language.admin` (default `op`) or each enabled plugin's server-language administration permission. If any required permission is denied, no defaults change.

Mod loaders use `/iris language self <locale|reset>` and `/iris language server <locale>` with gamemaster permission for the server default. See [08 - Localization](/iris/08-localization).

## Diagnostic reports

On Bukkit-family servers, `/iris debugdump` saves a diagnostic report and uploads it to the public mclo.gs service by default. Use `/iris debugdump upload=false` to save it locally without uploading. The command requires `iris.debugdump` (default `op`), independently of the root administration permission.

Reports are written atomically under the plugin data folder's `debug/` directory before upload. An upload failure retains the local file. Players receive controls to copy the relative report path and open or copy the upload link; console receives plain text. See [Shared diagnostic reports](/volmlib/api/diagnostics) for report contents.

## Everyday commands

Four workflows cover most operator use. The Bukkit and modded forms are separate command trees, not translations of each other, so do not port `key=value` tokens to a mod loader.

### Create a world and enter it

```
/iris create name=tutorial type=overworld seed=1337        # Bukkit
/iris create tutorial overworld 1337                  # modded
```

`type` (aliases `dimension`, `pack`) takes a pack key or `pack:dimensionKey`. Omit it to resolve `generator.defaultWorldType`. Completion lists installed pack/dimension values and does not advertise the internal `default` sentinel. Bukkit refuses the names `iris` and `benchmark`. It also refuses any name whose dimension folder already exists.

On Bukkit-family servers, including Folia, create immediately opens the standard Iris foreground progress presentation: an arbitrated large title plus a labeled bottom action-bar meter, without a lifecycle boss bar. Its localized stage and overall percent cover validation, datapacks, frozen-pack publication, generator/world creation, registration, automatic entry, optional creation-time pregen, and finalization. Frozen-pack publication is represented by that lifecycle stage only; Iris does not print a separate synthetic pack/dimension snapshot identifier. The spawn-generation phase includes live chunk counts. Console receives a throttled colored text bar with the same stages. The optional creation-time pregeneration phase retains its dedicated long-running boss bar. Bukkit does not print `Successfully created your world!` until the actual initial-spawn chunk is ready and spawn placement has completed on its owning region; only then is the world registered and immediately teleportable with `/iris tp tutorial`. Folia uses the Paper-like runtime lifecycle backend without restarting. On mod loaders the dimension appears in `/iris world list`, and you enter it with `/iris tp irisworldgen:tutorial`.

For a player-issued Bukkit create, Iris delegates the teleport immediately to the world's resolved entry anchor after creation. Paper's asynchronous teleport owns any destination-chunk readiness; Iris does not serially preload the chunk or scan thousands of blocks for a separate safe location first. The operation has a 60-second watchdog. A timeout cancels only that teleport. It reports that the world was created but automatic teleport failed. It does not roll back the world or restart the server. Retry with `/iris tp tutorial`.

If the pack is missing, Iris identifies the exact supported download form (`pack=overworld`, `pack=underworld`, or `link=<zip-url>`) and does not create the world. After a successful runtime pack install, `/iris create` remains locked until the requested server restart loads that pack's registry entries; it reports the restart requirement without restarting or creating a world.

### Pregenerate an area

Radius is in **blocks** and measured from the center, so `352` covers a 704x704 block square.

```
/iris pregen start radius=352 world=tutorial center=0,0 gui=false          # Bukkit
/iris pregen start 352 irisworldgen:tutorial at 0 0                 # modded
```

On Bukkit, `world` resolves from the sender's current world when omitted and is hidden from the in-game usage line, but `world=` still works. Use it from console. `center=me` uses your own position. On modded, `at` must come after the dimension, never before it. The flags `gui`, `sync`, `nocache` are literals in any order. The resumable checkpoint cache is on unless you pass `nocache`.

Confirm with `/iris pregen status`. A running job prints the target world, generated and total chunks, percent, chunks/s, ETA, elapsed time, the generation method, and a failure count. No output line for failures means nothing has failed. `/iris pregen pause` toggles. `/iris pregen stop` finishes in-flight work before cancelling. Only one job runs server-wide. Detail: [07 - Pregeneration](/iris/07-pregeneration).

### Open a studio for pack authoring

```
/iris studio open overworld seed=1337        # Bukkit
/iris studio open overworld 1337             # modded
```

A transient studio world opens and you are teleported into it in spectator mode. Player arrival for `open` and `tpstudio` has one absolute 10-second deadline measured from command admission, including time queued behind an existing Studio transition; an expired request cannot teleport late. Iris never changes the entering player's view distance. Saving any pack file hotloads the change into that world. `/iris studio close` (alias `x`) discards the world. `/iris studio vscode` regenerates the `.code-workspace` and JSON schemas, and opens it in the desktop editor unless `studio.openVSCode` is false. Object Studio and Jigsaw Studio remain creative editing workspaces. Detail: [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

### Check a pack before you rely on it

```
/iris pack validate                    # validates every pack; add pack=<key> for one
/iris pack validate                    # modded — empty means every pack
```

A clean pack reports no blocking errors. The all-packs form finishes with a broken-pack count out of the total scanned. `/iris pack status` reprints the last recorded result without revalidating. Warnings do not block world creation. Blocking errors do. Detail: [25 - Pack Management](/iris/25-pack-management).

`/iris pack validate` and `/iris pack status` treat an omitted pack (or `*`) as "all packs" on both platforms. One Bukkit note: because optional Director parameters never bind positionally, a single pack must be named with `pack=<key>`. A bare positional name is rejected.

`/iris pack compat` follows the same argument rules and prints the content in that pack that does not exist on the running Minecraft version, grouped by registry key, with the units that were excluded, the entries that were dropped, and the fallbacks that were substituted:

```
/iris pack compat pack=overworld       # Bukkit
/iris pack compat overworld            # modded
```

An empty result means the whole pack generates on this version. Detail: [25 - Pack Management](/iris/25-pack-management).

### Other common goals

| Goal | Bukkit-family | Fabric / Forge / NeoForge | Detailed guide |
|---|---|---|---|
| Replace the exact vanilla Overworld and Nether with the bundled pair | **Paper-family, not Spigot:** download `overworld`, then `underworld`. Restart once so their registry data loads, stage both replacements, and restart once more | Not available | [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) |
| Create an in-game jigsaw project | `/iris jigsaw create overworld village/demo` | Not available. Author on Bukkit and copy the saved pack | [21 - Jigsaw Structures](/iris/21-jigsaw-structures) |
| Inspect an Iris jigsaw graph | `/iris structure info overworld <structure>` | `/iris structure info <structure>` while in its Iris dimension | [21 - Jigsaw Structures](/iris/21-jigsaw-structures) |
| Remove a disposable Iris world | Evacuate players, `/iris unloadWorld <world>`, then `/iris remove <world>` | `/iris world delete <dimension>` | [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle) |

If a command fails before doing work, check in this order. Check platform syntax, permission, and sender type (player versus console). Then check the exact pack/world key and lifecycle busy state. A parse error is not evidence that the underlying feature failed.

## Syntax

### Bukkit

- Root: `/iris`, `/ir`, or `/irs`. See the reference tables for exact subcommand names.
- Tab completion and help render every configurable value as its canonical `key=value`, including required values and contextual overrides. Required values also accept their bare positional form. Optional and contextual values do not. `/iris pregen start 500 true` is a parse error. Write `/iris pregen start radius=500 gui=true`.
- A blank default means the parameter is required.
- Names and aliases match case-insensitively.
- **Contextual** parameters (world, dimension, pack, location, generator, template on many nodes) resolve from the sender's current world or look target. Iris marks its operator-overridable contexts for keyed help and completion. Internal context injection remains hidden.

### Modded

- Same root and aliases.
- Arguments are ordered literals and typed arguments, never free-form `key=value`.
- `/iris` and `/iris help [section]` open command help.
- Flags are literals where used (pregen `gui`, `sync`, `nocache`. Download `force`).

## Permissions

### Bukkit

| Permission | Default | Gate |
|------------|---------|------|
| `iris.all` | `op` | Use Iris administration commands and change the server language |
| `iris.debugdump` | `op` | Save and optionally upload diagnostic reports |
| `iris.language.self` | `true` | Choose or reset your Iris language; also requires `volmit.language.self` |
| `volmit.language.self` | `true` | Shared requirement for personal language selection |
| `iris.treefeller` | `op` | Use survival tree felling; also requires `treeFeller.enabled` |

`iris.all` grants the administration command tree except `debugdump`, which checks `iris.debugdump` independently. Personal language selection checks both language permissions independently. Custom-biome restart warnings notify operators and players with this permission.

### Modded

| Gate | Level | Applies to |
|------|-----------------|------------|
| Gamemaster | `Commands.LEVEL_GAMEMASTERS` (2) | Everything that mutates: create/world, studio, object tools, pregen, download, debug, reload, evacuate, teleport, seed, edit, find/goto, structure, datapack, pack, developer, regen, goldenhash, accesslist |
| Read-only | `Commands.LEVEL_ALL` (0) | `help`, `version`, `info` (seed field omitted unless gamemaster), `worlds`, `height`, `metrics`, and the entire `what` subtree |

Anyone can open `/iris` help. Commands that change state require gamemaster level 2.

Tree feller uses `irisworldgen:treefeller` on mod loaders and defaults to gamemaster level.

---

## Root: `/iris`

Use the Bukkit command names shown below.

| Command | Aliases | Platforms | Params (Bukkit-style) | Description |
|---------|---------|-----------|------------------------|-------------|
| (empty) / help | | Both | `[section]` (modded) | Open help. Modded supports a section path and page number |
| `version` | | Both | — | Print Iris/platform/Minecraft version and engine count |
| `info` | | **Modded** | `[dimension]` (substring filter) | List Iris dimensions and pack details. Seed only for gamemasters |
| `create` | `c` | Both | **Bukkit:** `<name=…> [type=<installed-pack-or-dimension>] [seed=1337]` (`name` alias `world-name`. `type` aliases `dimension`,`pack`. Omitting `type` uses `generator.defaultWorldType`). **Modded:** `<name> [pack=overworld] [seed=1337]` | Create an absent Iris world/dimension. Bukkit creation is confined to `iris:*` and remains supported on Spigot |
| `replace` | `override`, `overwrite` | **Paper-family**. Spigot rejects it | `<target> [type=default] [seed=preserve]` (`type` aliases `dimension`,`pack`. `seed` alias `s`) | Cold-replace an existing safe `iris:*` world or exact `minecraft:overworld`, `minecraft:the_nether`, or `minecraft:the_end` slot. Omit `seed` to preserve it or provide a signed 64-bit replacement seed |
| `teleport` | `tp` | Both | **Bukkit:** `<world> [player]` (defaults to the sender). **Modded:** `<dimension> [player]` | Teleport self or a named player into an Iris world/dimension |
| `evacuate` | | Both | **Bukkit:** `<world>`, player origin. **Modded:** `[dimension]` | Move players out of an Iris world to fallback/primary |
| `height` | | Both | — | Print world height. Player origin on Bukkit |
| `worlds` | `accesslist` (Bukkit) | Both | — | **Bukkit:** access list of worlds. **Modded:** two separate nodes — `worlds` is read-only and takes no argument, `accesslist` needs gamemaster. Both print the `info` listing |
| `remove` | `rm` | **Bukkit** | `<world> [delete=true]` | Remove a managed Iris world. Disk deletion defaults to true. `world` is a name, so worlds that exist only on disk are accepted |
| `loadWorld` | `import` | **Bukkit** | `<world>`, player origin | Load a managed Iris world |
| `unloadWorld` | | **Bukkit** | `<world>`, player origin | Unload an Iris world |
| `debug` | | Both | — | Toggle `general.debug` and save settings |
| `debugdump` | | **Bukkit-only** | `[upload=true]` | Save a diagnostic report, uploading by default |
| `download` | `dl` | Both | Exactly one of `pack=overworld`, `pack=underworld`, or `link=<http(s)-zip-url>` | Install a version-pinned built-in stable-release pack or direct ZIP. Restart before live-registry use. Branch, listing, arbitrary-name, positional, force, and overwrite forms are not supported |
| `metrics` | `measure` | Both | — | Generation metrics. Player origin on Bukkit |
| `reload` | | Both | — | Reload `iris.json` and locale. Modded also schedules forced datapack regeneration |
| `seed` | | **Modded** | — | Print world and engine seeds |
| `regen` | `rg` | **Modded** root. Bukkit under `Developer` | `[radius]` — modded default `0`, range `0..64` | Delete and regenerate nearby chunks |
| `goldenhash` | `gold` | **Modded** root. Bukkit under `Developer` | `[radius=8] [threads=8] [capture\|verify]`, radius `0..256`, threads `1..64` | Deterministic buffer hashes |
| `wand` | | **Modded** root (+ `object`) | — | Give object wand |
| `dust` | `d` | **Modded** root (+ `object`) | — | Give reveal dust |
| `find` | `goto` | Both | see Find | Locate biome/region/object/structure/POI or an accepted hydrology feature |
| `what` | | Both | see What | Inspect context |
| `edit` | | Both | see Edit | Open pack JSON in the desktop editor |
| `pregen` | `pregenerate` | Both | see Pregen | Pregeneration control |
| `object` | `o` | Both | see Object | Object tools |
| `studio` | `std`, `s` | Both | see Studio | Studio / pack authoring |
| `jigsaw` | `jig`, `jgs` | **Bukkit** | see Jigsaw | Transaction-owned planar/spatial Jigsaw Studio |
| `pack` | `pk` | Both | see Pack | Validate/cleanup/restore/status/compat |
| `structure` | `struct`, `str` | Both | see Structure | Structure index/import/place |
| `datapack` | `datapacks`, `dp` | Both | see Datapack | Datapack helpers |
| `Developer` | `dev` | Both | see Developer | Diagnostics. The group name is registered with a capital `D`, but matching is case-insensitive |
| `world` | `w` | **Modded** | see World | Runtime dimension enable/disable |

Pack downloads are single-flight server-wide on Bukkit and modded. While one download is active, every additional built-in or direct-link request is rejected immediately instead of being queued or starting another network transfer. Bukkit reports the five install phases through an arbitrated large title and a labeled bottom action-bar meter, without a boss bar. Bounded chat and console updates also appear. A direct-link request is labeled Remote ZIP without exposing the URL or signed query parameters. Modded phase and terminal feedback is dispatched through Minecraft's server task queue. A dedicated server paused because it is empty still prints completion. A finished on-disk install does not stay queued.

The supported exact bundled-pair sequence is `/iris download pack=overworld`, wait for success, then `/iris download pack=underworld` and wait again. The current built-in packs declare no external datapack imports. Restart once so Minecraft loads their dimension types and custom biomes. Then run `/iris replace minecraft:overworld type=overworld seed=<overworld-seed>` and `/iris replace minecraft:the_nether type=underworld seed=<nether-seed>`. Restart once more to publish both replacements in one cold batch. Omit either seed argument when that slot should retain its existing saved seed. Custom packs that declare `datapackImports` must complete the installation and registry-loading workflow in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks) before staging.

---

On Paper-family servers, `/iris replace` is deliberately restart-only. Spigot rejects it because it has no pre-registry plugin bootstrap. Spigot still supports ordinary `/iris create` for new managed `iris:*` worlds. The exact replacement target dimension folder must already exist.

Accepted canonical targets are a safe `iris:*` key or exactly `minecraft:overworld`, `minecraft:the_nether`, or `minecraft:the_end`. Friendly and configured Bukkit world-name aliases resolve to those keys. Other bare names resolve to `iris:*`. Other `minecraft:*` and foreign namespaces are rejected.

Iris stages and validates a fresh pack snapshot. It compare-and-swaps only that world's `bukkit.yml` generator. It retains the existing dimension folder as a rollback backup until the restarted world proves its Iris identity, pack, dimension, environment, and effective seed. The default `seed=preserve` clones the target's authoritative Paper seed. An explicit signed 64-bit seed changes only `data.seed` in the staged current-format world-generation settings.

Multiple distinct slots may be staged with independent seeds before one restart. Replacing both exact Overworld and Nether slots preserves vanilla portal routing between those canonical identities. Replacing an arbitrary `iris:*` world does not add it to that route. Replacing `minecraft:overworld` makes Iris the current main-world generator without changing `level-name`. The removed `main=true`, `main-world=true`, `overwrite=true`, and `force=true` create options are not accepted. Selecting a fresh whole-save level root belongs to server provisioning.

---

## Find: `/iris find` (`goto`)

**Origin:** player (Bukkit). **Modded:** gamemaster gate.

| Command | Params | Description |
|---------|--------|-------------|
| `biome` | **Bukkit:** `<biome> [teleport=true]`. **Modded:** `<key>` | Find an Iris biome. Teleport defaults to true on Bukkit |
| `region` | **Bukkit:** `<region> [teleport=true]`. **Modded:** `<key>` | Find an Iris region |
| `object` | **Bukkit:** `<object> [teleport=true]`. **Modded:** `<key>` | Find an object placement (Bukkit may teleport to the object studio first) |
| `river` | **Bukkit:** `type=<type> [teleport=true]`. **Modded:** `<type>` | Find an accepted hydrology feature. Use `surface`, `waterfall`, `sinkhole`, `underground`, `grotto`, `coastal_grotto`, `inland_grotto`, `mouth`, `deep`, `pool`, a deep-fluid ID, or a surface-pool ID |
| `structure` | **Bukkit:** `<structure>`, runs sync. **Modded:** `<key>` | Find a vanilla/datapack/Iris structure |
| `poi` | **Bukkit:** `<type> [teleport=true]`. **Modded:** `<type>` | Find a supported point of interest |
| `unregistered` | — | Print structures excluded from goto completion, and the rejection reasons, to console |

Biome completion and parsing are scoped to the active Iris dimension's reachable biome closure. This includes every dimension, region, and biome `riverPolicy` content pool plus selected child and carving biomes; unreferenced biome files are not advertised or accepted by `find biome`/`goto biome`. River-type completion on both platforms combines the selectors in the table with the active dimension's configured deep-fluid and surface-pool IDs; `deep_lava` and `lava_pool` are pack-defined examples, not built-in selectors. Hydrology feature location searches immutable accepted plans and never reports an unaccepted route, outlet, or deep-fluid candidate.

---

## What: `/iris what`

**Bukkit origin:** player only, and there is no bare or `here` form. On modded the whole subtree is `LEVEL_ALL`, so any player can use it.

| Command | Platforms | Params | Description |
|---------|-----------|--------|-------------|
| (empty) / `here` | **Modded** | — | Full inspect at the player position |
| `biome` | Both | — | Current Iris biome |
| `region` | Both | — | Current Iris region |
| `block` | Both | — | Target block |
| `hand` | Both | — | Held item |
| `markers` | Both | `<marker>` | Reveal nearby markers (for example `cave_floor`, `cave_ceiling`, `object`) |

---

## Edit: `/iris edit`

**Bukkit origin:** player. Opens pack JSON in the desktop editor. The same tree is also mounted at `/iris studio edit …` on Bukkit.

| Command | Aliases | Params | Description |
|---------|---------|--------|-------------|
| `biome` | `b` | **Bukkit:** `<biome>`. **Modded:** `[key]` | Open biome JSON (modded: omit the key for the current biome) |
| `region` | `r` | **Bukkit:** `<region>`. **Modded:** `[key]` | Open region JSON |
| `dimension` | `d` | **Bukkit:** `<dimension>`. **Modded:** — | Open dimension JSON (modded: current pack) |

---

## Pregen: `/iris pregen` (`pregenerate`)

| Command | Aliases | Params | Description |
|---------|---------|--------|-------------|
| `start` | | **Bukkit:** `<radius=…> [world=…] [center=0,0] [gui=true] [serial=false]` (`radius` alias `size`, `center` alias `middle`, `me` for the player position. `world` is a contextual keyed override). **Modded:** `<radius> [dimension] [at <x> <z>] [gui] [sync] [nocache]`, radius `1..100000` | Start pregen. Radius is in **blocks**, and every `center ± radius` edge must remain within ±29,999,984. The resumable checkpoint cache is on by default on modded unless `nocache` |
| `stop` | `x` | — | Stop the active pregen after in-flight work closes |
| `pause` | `resume` | — | Toggle pause/resume |
| `status` | | — | Progress, chunks/s, ETA, elapsed, method, failures |

**Bukkit:** `serial=true` requires a Paper-compatible server (strict serial chunk generation) and is rejected elsewhere. **Modded:** `sync` is the serial-like flag. `gui` requests the platform's available pregeneration status UI.

See [07 - Pregeneration](/iris/07-pregeneration).

---

## Object: `/iris object` (`o`)

**Bukkit:** group origin is player. Root `wand`/`dust` also exist on modded.

| Command | Aliases | Platforms | Params | Description |
|---------|---------|-----------|--------|-------------|
| `wand` | | Both | — | Give the Iris object wand |
| `dust` | `d` | Both | — | Give reveal dust |
| `save` | | Both | **Bukkit:** `<name> [overwrite=false] [legacy=true]` (`overwrite` alias `force`. A contextual `dimension` is resolved from your world, or passed as `dimension=`). **Modded:** `[overwrite] <name>` | Save the wand selection as `.iob`. Bukkit shows scan/write progress as a large title plus labeled bottom action-bar meter, never a boss bar |
| `paste` | | Both | **Bukkit:** `<object> [edit=false] [rotate=0] [scale=1]`. **Modded:** `[at x y z] [rotate degrees] <key>` | Paste an object |
| `expand` | | **Modded** | `[amount=1]`, range `1..256` | Expand the selection along your look direction |
| `contract` | `-` | Both | `[amount=1]` | Contract the selection along your look direction |
| `shift` | | Both | `[amount=1]` | Shift the selection along your look direction |
| `position1` | `p1` | Both | **Bukkit:** `[here=true]` uses the block under your feet. `here=false` uses your look target. **Modded:** feet by default, `look` switches to the look target | Set one selection corner. Requires the Iris wand in hand |
| `position2` | `p2` | Both | same | Set the other selection corner |
| `x+y` | `xpy` (modded) | Both | — | Autoselect up and out |
| `x&y` | `xay` (modded) | Both | — | Autoselect up, down, and out |
| `analyze` | | Both | `<object>` | Composition stats |
| `shrink` | | Both | `<object>` | Shrink the object to its minimum bounds |
| `plausibilize` | | Both | **Bukkit:** `<target> [dryrun=false] [reach=12]`. `target` accepts a key or a `prefix/`. **Modded:** greedy `<args>` parsed as `key [dryrun] [reach]`, same defaults | Grow branches so leaves survive vanilla decay |
| `undo` | `u` | Both | `[amount=1]` | Undo pastes |
| `we` | | **Bukkit**. Stub on modded | — | Wand plus import of the WorldEdit selection |
| `studio` | | **Bukkit**. Stub on modded | `[dimension] [seed=1337]` | Object studio grid world |
| `convert` | | **Bukkit**. Stub on modded | — | Convert `convert/` folder `.schem` to `.iob` |

---

## Studio: `/iris studio` (`std`, `s`)

| Command | Aliases | Platforms | Params | Description |
|---------|---------|-----------|--------|-------------|
| `open` | `o` | Both | **Bukkit:** `<dimension> [seed=1337] [force=false]` (`dimension` alias `dim`, `seed` alias `s`, `force` alias `f`). **Modded:** `<pack> [seed]` | Open a temporary studio dimension. Bukkit refuses while a downloaded pack still requires a registry restart. `force=true` deliberately attempts the currently loaded registry state without installing datapacks or restarting, but never bypasses broken-pack validation. Player arrival has an absolute 10-second command-admission deadline. The owning player may replace an active Jigsaw Studio, and Iris waits for its autosave and active-operation barriers before closing it |
| `close` | `x` | Both | — | Close the studio and discard the world. Bukkit requires `/iris jigsaw close` for an active Jigsaw Studio |
| `tpstudio` | `stp` | Both | — | Teleport into the open studio under the same absolute 10-second command-admission deadline |
| `status` | | **Modded** | — | Show the open studio and pack |
| `create` | `+` | Both | **Bukkit:** `[name=studio] [template]`. **Modded:** `[name] [template=example]` | Create a pack project |
| `pkg` | `package` | Both | **Bukkit:** `[dimension=default] [obfuscate=false] [minify=true]`. **Modded:** `[pack]` | Zip and package a pack. The Bukkit command name is `pkg`. `package` is the alias |
| `version` | | Both | **Bukkit:** `[dimension=default]`. **Modded:** `[pack]` | Pack version |
| `regions` | | Both | **Bukkit:** `[radius=500]`, player origin. **Modded:** `[radius]`, default 500 | Nearby region distribution |
| `noise` | `nmap` | Both | **Bukkit:** `[generator] [seed=12345]`. **Modded:** `[generator] [seed]` | Noise explorer GUI |
| `map` | `render` | Both | **Bukkit:** contextual `world`, required. **Modded:** — | Vision map GUI |
| `vscode` | `vsc` | Both | **Bukkit:** `[dimension=default]`. **Modded:** `[pack]` | Generate and open the code workspace |
| `update` | | Both | same pack argument as `vscode` | Regenerate the workspace only |
| `importvanilla` | `importv`, `iv` | **Bukkit**. Stub on modded | `<dimension> [variants=3] [structures=true]` | Import vanilla trees/objects/structures into a pack |
| `scoreboard` | `board`, `sidebar`, `sb` | **Bukkit** | — | Toggle the studio debug scoreboard; supported clients hide the numeric score column |
| `loot` | | **Bukkit**. Stub on modded | `[fast=false] [add=true]` | Simulate chest loot in a GUI |
| `profile` | | **Bukkit**. Stub on modded | `[dimension=default]` | Pack performance profile |
| `spawn` | `summon` | **Bukkit**. Stub on modded | `<entity> <location>` (`location` is contextual) | Spawn an Iris entity |
| `objects` | `find-objects` | **Bukkit**. Stub on modded | — | IGenData chunk report for nearby chunks |

See [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

---

## Jigsaw: `/iris jigsaw` (`jig`, `jgs`)

**Bukkit-only. Player origin.** This opens a transient Jigsaw Studio through the same single active Studio lifecycle. Saved Iris jigsaw resources run through the shared core on every platform, but Fabric/Forge/NeoForge do not register this authoring command tree.

`open` accepts an internal Iris structure path such as `minecraft_ancient_city`. `convert` accepts a live namespaced registry key such as `minecraft:ancient_city` and writes a separate add-only Iris graph. Existing unowned or managed Iris graphs go through `adopt inspect` and `adopt apply`. Every open requires a loadable whole-pack validation result; expected validation refusals list their reasons and do not emit an internal-error stack trace.

| Command | Params | Description |
|---|---|---|
| `create` | `<dimension> <key> [mode=planar] [compatibility=iris] [width=15] [height=15] [depth=15] [seed=1337]` | Add-only atomic graph creation followed by open. `key` aliases `structure` and `name`. `mode` completes `planar`/`spatial`, compatibility completes `iris`/`vanilla`. Planar X/Z `3..128`, spatial X/Z `1..128`, Y `1..192`, volume `<=2,097,152` |
| `convert` | `<dimension> <source> [target=auto] [seed=1337]` | Add-only conversion of one live namespaced vanilla/datapack jigsaw into an owned Iris graph, then open it. The source uses `namespace:path`; the target is an unused Iris path. Aliases `import`, `import-vanilla` |
| `adopt inspect` | `<dimension> <source> [target=auto] [strategy=auto]` | Asynchronously inspect an existing Iris closure and issue a hash-pinned `IN_PLACE`, `CLONE_REQUIRED`, or `BLOCKED` plan. Strategy completes `auto`, `in-place`, `clone` |
| `adopt apply` | `<planId>` | Revalidate and atomically apply that player's unexpired plan, then open the target at seed `1337`. An active or opening Jigsaw Studio is rejected |
| `open` | `<dimension> <key> [seed=1337]` | Open an existing Iris graph in compact workcells. The key is its internal `structures/<key>.json` path, not a registered `namespace:path`. Aliases `edit`, `reopen`. Existing Iris structure keys tab-complete. Owner, autosave, and operation barriers protect replacement |
| `close` | `[discard=false]` | Close Studio. Refuse active autosave/load/graph work or a pending dirty capture unless deliberately discarded |
| `status` | — | Show project/workcell state and the current automatic seed-`1337` evaluation, theme, piece count, and diagnostic |
| `menu` | — | Open the six-row controls also opened by the generated chest or three sneaks within 1.5 seconds |
| `select` | — | Select the workcell containing the player |
| `goto` | `<bay>` | Select and teleport above a stable workcell ID. Alias `teleport` |
| `particles` | `<visible>` | Toggle player-local workcell-bound, connector, and temporary assembly-preview particle trails |
| `save` | `[bay=selected]` | Flush the selected dirty workcell's automatic capture now. Normal block and container updates already autosave |
| `connector channel` | `<channel\|none>` | Look at a saved marker in the active owned workcell within 8 blocks and set/clear its Iris-only channel at the inverse-mapped source position |
| `bounds` | `<width> <height> <depth>` | Set the selected workcell capacity without resizing any variant object. Every existing variant must fit, and the compact Studio layout regenerates in place. Aliases `cell`, `resize` |
| `workcell capacity` | `<width> <height> <depth>` | Explicit nested form of `bounds` (group alias `cell`). Planar capacities are per canonical archetype and spatial capacity is the shared envelope for its one-row variant cells |
| `workcell label` | `<displayName>` | Set the selected planar or spatial workcell's author label. Quote spaces. Solver identity remains canonical |
| `workcell label-reset` | — | Reset the selected workcell to its canonical solver label. Alias `reset-label` |
| `pool create` | `<poolKey> [fallbackPoolKey=none]` | Atomically create an empty owned pool, optionally using an existing owned direct fallback |
| `piece create` | `<poolKey> <pieceKey> [weight=1]` | Create and load an owned variant. Planar derives connectors from the contextual canonical workcell |
| `piece add` | `<poolKey> <pieceKey> [weight=1]` | Re-add and load an existing piece/object already owned by this project |
| `piece remove` | `<poolKey>` | Remove the active variant from a pool without deleting its owned resources |
| `piece rotatable` | `<rotatable>` | Persist cardinal rotation for the active variant. Portable sessions reject `false` |
| `piece expand` | — | Resize the active planar or spatial owned variant exactly to workcell capacity. Planar canonical sockets move to the new faces |
| `variant weight` | `<poolKey> <weight>` | Set the active variant's positive weight in an owned pool |
| `variant resize` | `<width> <height> <depth>` | Resize only the active owned variant within its workcell capacity. Safe shrink rejects cropped content and the active cell reloads in place |
| `variant label` | `<displayName>` | Set the active variant's author label. Quote spaces |
| `variant label-reset` | — | Reset the active variant to its resource-key fallback. Alias `reset-label` |
| `variant duplicate` | — | Copy the active variant's object, metadata, and exact pool memberships into one new variant in this workcell |
| `variant duplicate-family` | `[themeKey=next]` | Atomically clone every enabled workcell's active owned variant into one coherent Iris family and load the whole family. Alias `family` |
| `rules limits` | `<maxDepth> <maxSizeChunks>` | Set depth `1..30` and radius `1..32` (group alias `rule`). `VANILLA_PORTABLE` is restricted to `<=20` and `<=8` |
| `rules fallback` | `<poolKey> <fallbackPoolKey>` | Set or clear one owned pool's direct fallback after compiling the complete graph. Pass `none` to clear. Unlike `pool create`, this argument is required |
| `preview goto` | — | Teleport above the permanent seed-`1337` block preview. Alias `teleport` |
| `preview assemble` | `[seed=1337]` | Compute a deterministic read-only assembly at the player. Report its complete piece count. Show in-range bounds as purple particle boxes for 10 seconds within the shared particle budget. Places no blocks |
| `export` | `[namespace=iris] [output=jigsaw-export] [format=zip] [replace=false]` | Start a background strict Minecraft 26.2 vanilla datapack export as one direct artifact under the Studio packs `exports/` folder |
| `delete` | `[confirm=false]` | With `confirm=true`, scan reverse references, close Studio, and hash-pinned-delete the complete owned project. Alias `remove` |

There is no Jigsaw Studio undo command, adoption rollback command, or mod-loader authoring command. **Undo Last Autosave** in Workcell Settings restores the newest of five previous saved graph iterations retained in one `.iris/jigsaw-history/key-<sha256>.json` file. **Reset Connector Blocks** restores the selected workcell's saved connector blocks without replacing its other edited blocks.

Planar Studio always has six independently capacitated/enabled canonical workcells. Spatial Studio places every variant in a dedicated one-row cell. A new project seeds seven 15×15×15 variants with 0 through 6 cumulative face-center connectors. All cells retain one clear block of separation and use physical white-concrete edge cages with player-local particle trails inside them. Jigsaw Studio spawns no display entities for workcell bounds. Every variant retains its own exact dimensions and optional display label. Workcell and variant rename tools are renamed in an anvil, right-clicked to apply, and sneak-right-clicked to reset. A catalog may contain at most 512 variants. Natural creature spawning is disabled in the transient Studio world.

The seed-`1337` assembly is evaluated automatically and rendered as a permanent protected block preview. Spatial previews form an elevated connected assembly. `preview assemble` remains the separate temporary arbitrary-seed particle diagnostic. See [21 - Jigsaw Structures](/iris/21-jigsaw-structures) for GUI/toolbox controls, whole-assembly theme chances, independent pool-entry chances, rules/caps, markers, ownership, placement, export, and recovery.

Bukkit has one global Studio project/world and the Jigsaw session belongs to one owning player. Only that owner can control, load, or mutate it. Entering a workcell makes that physical cell the owner's next menu selection. Non-owner edits are cancelled and non-owner commands use a strict informational/communication allowlist. Block and inventory changes in loaded owned workcells autosave after a 40-tick quiet period. Duplicate-one and duplicate-family actions queue once behind pending autosave, expedite it, and continue automatically against the same request and source variants. The chest and live preview are protected. Schema-1 or otherwise stale toolbox sticks are rejected. A later mutation after capture starts remains dirty for another capture. Plugins that bypass covered events must call `JigsawStudioService.markDirty(...)` or `markAllDirty(...)`.

---

## Pack: `/iris pack` (`pk`)

| Command | Aliases | Params | Description |
|---------|---------|--------|-------------|
| `validate` | `v` | `[pack]` on both platforms. Empty (or `*` on Bukkit) validates every pack | Validate pack(s) and publish results |
| `cleanup` | `c` | **Bukkit:** `<pack> [mode=preview]`. **Modded:** `<pack> [apply]` | Preview or quarantine unused resources |
| `restore` | `r` | same pattern as `cleanup` | Preview or restore the latest quarantine |
| `status` | `s` | `[pack]` on both platforms. Empty (or `*` on Bukkit) reports every pack | Startup-published validation status, including persisted unchanged results |
| `compat` | | `[pack]` on both platforms. Empty (or `*` on Bukkit) reports every pack | List pack content that does not exist on the running Minecraft version, and what the gate did about it. Reads the published validation report and does not reload the pack |

Every `/iris pack` subcommand shares one permission gate: `iris.all` on Bukkit, gamemaster level 2 on the mod loaders. `compat` is no exception.

See [25 - Pack Management](/iris/25-pack-management).

---

## Structure: `/iris structure` (`struct`, `str`)

Bukkit `dimension` parameters all carry the alias `dim`.

| Command | Aliases | Platforms | Params | Description |
|---------|---------|-----------|--------|-------------|
| `list` | `ls` | Both | **Bukkit:** `<dimension>`. **Modded:** current engine pack | Write `structure-index.json` |
| `info` | | Both | **Bukkit:** `<dimension> <structure>`. **Modded:** `<key>` | Resolve jigsaw graph bounds |
| `place` | `p` | Both | **Bukkit:** `<dimension> <structure>`, player origin. **Modded:** `<key>` | Assemble and place at the player. Bukkit reports the exact changed-block count and rejects air-only or already-identical no-op results |
| `import` | `import-all`, `reimport`, `imp`, `all` | **Bukkit**. Stub on modded | `<dimension>` | Import all vanilla/datapack structures as editable Iris resources (overwrites) |
| `capture` | `cap` | **Bukkit**. Stub on modded | `<dimension>` | Capture code-only structures via a scratch world |
| `verify` | `locateall` | Both | **Bukkit:** `<dimension> [radius=48]`, clamped to `1..1000`. **Modded:** `[key]` | Native/Iris structure reachability report |

See [18 - Structures Overview](/iris/18-structures-overview), [21 - Jigsaw Structures](/iris/21-jigsaw-structures), [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).

---

## Datapack: `/iris datapack` (`datapacks`, `dp`)

| Command | Aliases | Platforms | Params | Description |
|---------|---------|-----------|--------|-------------|
| `ingest` | `pull` | **Bukkit**. Stub on modded | `[restart=false]` | Install or update dimension-owned HTTP(S)/`file:` sources and ZIPs discovered under `plugins/Iris/datapacks/imports/`. Modded operators install compatible archives in the save's `datapacks/` directory manually |
| `list` | `ls` | Both | — | **Bukkit:** configured imports plus installed. **Modded:** configured/installed world datapacks |
| `remove` | `rm` | **Bukkit**. Stub on modded | `<id>` | Remove an installed datapack by id |
| `status` | | **Modded** | — | Check Iris dimension-type overrides against pack heights |
| `install` | | **Modded** | — | Install the dimension-type override datapack for loaded Iris dimensions |

See [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).

---

## World (modded-only group): `/iris world` (`w`)

Bukkit uses root `create` / `loadWorld` / `unloadWorld` / `remove` / `evacuate` instead. `[seed]` accepts a number or the literal `random`. Blank means `1337`.

| Command | Aliases | Params | Description |
|---------|---------|--------|-------------|
| `enable` | `create` | `<dimension> <pack\|pack:dimensionKey> [seed\|random]` | Create/inject a persistent Iris dimension. Refuses if the pack is missing |
| `replace-overworld` | | `<pack\|pack:dimensionKey> [seed\|random]` | Inject primary world routing |
| `mainworld` | | `<pack\|pack:dimensionKey\|off> [seed\|random]` | Configure the main-world preset in `modded.json` |
| `disable` | | `<dimension>` | Evacuate and unload. Keep disk data |
| `delete` | `remove`, `rm` | `<dimension>` | Disable and wipe chunk/mantle data |
| `list` | `ls` | — | List loaded Iris dimensions |
| `status` | | — | Loaded dimensions plus primary world config |

---

## Developer: `/iris Developer` (`dev`)

| Command | Aliases | Platforms | Params | Description |
|---------|---------|-----------|--------|-------------|
| `EngineStatus` | | **Bukkit** | — | Loaded tectonic plate count |
| `genhash` | | **Bukkit** | `[radius=4] [centerX=0] [centerZ=0]`, contextual `world` | Hash generated blocks in a fixed area. The center parameters are `centerX`/`centerZ` here, not the hyphenated `goldenhash` names |
| `update-world` | `^world` | **Bukkit** | `[confirm=false]`, contextual `world` and `pack` (`pack` alias `dimension`. `confirm` alias `c`) | Unsafe pack swap into a world using an already-installed source pack |
| `mantle` | | **Bukkit** | `[plate=false] [name=21474836474]` | Dump a mantle section or plate under the dump folder |
| `packBenchmark` | | **Bukkit** | `[dimension=overworld] [radius=2048] [gui=false]` (`dimension` alias `pack`) | Pack benchmark |
| `upgrade` | | **Bukkit** | `[version=latest]` | Data version upgrade helper |
| `mca` | | **Bukkit** | `<world>` (a world folder path) | Scan MCA region files |
| `delete-chunk` | `dc` | **Bukkit** | `[radius=0]`, player origin | Delete nearby chunk blocks for regen testing |
| `network` | `ip` | Both | — | List network interfaces |
| `regen` | `rg` | **Bukkit** (modded root) | `[radius=5]`, player origin | Delete and regenerate nearby chunks |
| `goldenhash` | `gold` | **Bukkit** (modded root) | `[radius=8] [center-x=0] [center-z=0] [reset-mantle=true] [threads=8] [deep=false]`, contextual `world` | Buffer golden hash capture/verify |

The modded developer group implements only `network`/`ip`. Its help section still advertises a region file scan that has no command node.

---

## Platform gap summary

| Feature | Bukkit | Modded |
|---------|--------|--------|
| Root permission node | `iris.all` (code-gated, whole tree) | `LEVEL_GAMEMASTERS` / `LEVEL_ALL` per node |
| World lifecycle | `create`, `loadWorld`, `unloadWorld`, `remove` | `world enable/disable/delete`, `create`, `mainworld` |
| Seed print | — | `/iris seed` |
| Object expand | — | `/iris object expand` |
| Object WE / studio / convert | yes | help stubs only |
| Studio loot/profile/spawn/objects/scoreboard/importvanilla | yes | stubs or messages |
| Jigsaw Studio create/edit/autosave/export commands and GUI | yes | no. Copy a Bukkit-authored Iris pack |
| Structure import/capture | yes | messages (run on Bukkit, copy the pack) |
| Managed datapack HTTP(S), `file:`, and drop-folder ingest/remove | yes | messages |
| Datapack status/install (dimension types) | — | yes |
| `regen` / `goldenhash` | under `Developer` | root |
| Pregen flags | `serial`, `gui`, center string | `sync`, `gui`, `nocache`, `at x z` |
| `pack validate` / `status` with no pack | validates/reports all packs | validates/reports all packs |
| Tree feller permission | `iris.treefeller` | `irisworldgen:treefeller` via the loader permission API |

---

## Related

- [03 - Configuration](/iris/03-configuration)
- [02 - Getting Started](/iris/02-getting-started)
- [06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)
- [07 - Pregeneration](/iris/07-pregeneration)
- [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas)
- [21 - Jigsaw Structures](/iris/21-jigsaw-structures)
- [25 - Pack Management](/iris/25-pack-management)
- [28 - Integrations](/iris/28-integrations)
- [30 - Platform Differences](/iris/30-platform-differences)
- [32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)
