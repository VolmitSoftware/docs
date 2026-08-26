---
title: "Operator Runbooks"
description: "Iris documentation: Operator Runbooks"
published: true
date: 2026-08-26T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---
Manual verification sequences to run after an install, an upgrade, a pack
change, or a release-candidate build. Each runbook is a numbered checklist
with the exact command, what you should see, and what to do when you do
not see it. Command trees and permissions are in
[04 - Commands & Permissions](/iris/04-commands-permissions). Pregeneration
options are in [07 - Pregeneration](/iris/07-pregeneration). Platform
capability differences are in
[30 - Platform Differences](/iris/30-platform-differences). River pack
authoring and containment rules are in [36 - Rivers](/iris/36-rivers).

## How to use these

Use a purpose-named disposable world. Before you start, write down the Iris
artifact, platform build, Java version, pack hash, and seed. A result
without those is not reproducible later.

Run only the sections a local change touched. Run the full platform set
for a release candidate.

A passing Gradle test, a clean boot, and a player who walks through
generated chunks tell you different things. Do not let one stand in for
another. When you are done, delete the worlds and instances you created
for the run.

## Fixed inputs for parity work

Use the same values whenever you compare platforms or runs:

| Input | Value | Why |
|-------|-------|-----|
| Pack | Shipping default `overworld`, or a frozen copy | Must be byte-identical on every platform under test |
| Seed | `1337` | World seed on Bukkit, Iris engine seed on modded |
| GoldenHash radius | `22` chunks (`8` for a quick check) | Radius 22 covers `(2×22+1)² = 2,025` chunks |
| GoldenHash threads | `1` strict, `8` for the multi-thread run | `threads=1` is what catches order dependence |
| Pregen radius | `352` blocks centered at `0,0` | Pregen radius is in **blocks**. 352 blocks is 22 chunks, giving the same 2,025-chunk square |

GoldenHash file layout and interpretation:
[32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash).

## Hydrology acceptance pass

Use a new disposable world, a fixed seed, and a pack whose surface and underground budgets are both visibly nonzero. Run `/iris pack validate`, inspect the **River network** accepted footprint, and use `/iris find river` or `/iris goto river` to record coordinates for surface pools, riffles/cascades, waterfalls, ridge bores, underground pools/drops, both grotto types, mouths, and each deep-fluid ID. Generate those untouched areas with one and several generation threads. Confirm every course is connected and non-rising downstream; every positive head loss has falling fluid and a receiving pool; a ridge bore reopens as the same course; underground features retain dry headroom; shore content stays within 1–2 blocks while the 4–10-block outer grade keeps its parent biome; and frozen water changes only through the standard freeze pass.

At the coast, confirm the head reaches sea level before the natural ocean boundary, the mouth or coastal grotto opens directly to the reservoir, and ocean columns contain no river-owned terrain, elevated fluid, shore, or grading writes. For cave and deep hydrology, confirm accepted containment cells and seal guards remain intact while rejected candidates publish no generation or mantle footprint and remain confined to projected diagnostics. Finish with the Java 25 `:probe:genProbe` gate, a GoldenHash capture/verify pair, a restart, and real-client visual checks for falling water or lava.

## A. Fresh install and first world (Bukkit-family)

1. Drop the CraftBukkit-family jar into `plugins/` on a Java 25 server
   (Paper, Purpur, Folia, Spigot, Leaf, or Canvas as advertised). See
   [01 - Installation & Platforms](/iris/01-installation-platforms).
2. Start the server once.

   Expect on a cold Bukkit library cache: Iris provisions Gson,
   Caffeine, ConcurrentLinkedHashMap, and Paralithic under
   `plugins/Iris/cache/libraries/`, then enables without downloading a
   world pack. `iris.json` appears in the Iris data directory. Restart
   once without changing the jar and confirm those runtime libraries are
   reused without another download.

   If Iris does not enable, check Java version and platform artifact before
   anything else. If `overworld` is absent, run
   `/iris download pack=overworld`, wait for it to finish, and restart
   before continuing. Iris never downloads packs automatically. For
   offline installation, see
   [25 - Pack Management](/iris/25-pack-management).

3. Create a world with a fixed seed and go to it:

   ```
   /iris create name=test-ow type=overworld seed=1337
   /iris create name=test-uw type=underworld seed=7331
   /iris tp test-ow
   ```

   Start the Underworld command immediately after the Overworld command
   reports success. Expect on every Bukkit-family server, including
   Folia: each success occurs only after that world's actual initial-spawn
   chunk and owning-region spawn placement complete. Both worlds are
   loaded in the current process, the second command is not rejected as
   busy, and an equivalent compiler-input fingerprint does not request a
   restart. Folia must report `paper_like_runtime` as the creation backend.
   The console must not print `World storage migration is required during
   startup` or `Starting Vanilla import` for either world.

4. Enter each world and walk or fly a few hundred blocks.

   Expect: non-empty terrain, surface biomes, no repeating stack traces on
   first chunks.

   If chunks come back empty or void, stop and check pack validation
   (section C) before anything else.

5. **Expected:** the world is an Iris world, chunks generate, and the
   console shows no fatal engine init failure.

## A.1 Exact vanilla-slot replacement (Paper-family)

Prerequisites: a disposable Paper-family server with early plugin
bootstrap (not Spigot), `level-name=world`, `allow-nether=true`, and
initialized `minecraft:overworld` and `minecraft:the_nether` target
directories. Spigot uses the managed `/iris create` path in section A and
cannot run this exact-slot sequence. Enter the vanilla Nether once first
if its target does not exist. Put a unique marker in both vanilla worlds.
Hash their `region`, `entities`, and `poi` files. Keep copies of each
target's `data/paper/metadata.dat`, `data/paper/level_overrides.dat`, and
`data/minecraft/world_gen_settings.dat`.

1. Download the shipping Overworld and wait for its completed success
   message:

   ```text
   /iris download pack=overworld
   ```

   Expect: `packs/overworld/dimensions/overworld.json` is published and
   validates structurally. Iris asks for a restart but does not restart or
   stop the server.

2. Only after the first download completes, download Underworld and wait
   again:

   ```text
   /iris download pack=underworld
   ```

   Expect: `packs/underworld/dimensions/underworld.json` is published.
   Starting it while the first download is active must fail busy rather
   than queue. Retry after the first completion. Do not restart manually
   yet.

3. Manually restart the server once after both downloads complete.

   Expect: with the default `general.autoIngestDatapacks=true`, startup
   discovers the shipping Overworld's declared Towns & Towers 26.1 and
   Dungeons & Taverns 5.3.0 dependencies. It installs their managed
   datapacks. Player admission and Iris world creation stay locked in
   restart-required state. Do not stage either replacement yet.

4. Complete the ensuing clean restart.

   Expect: Minecraft loads both external datapacks, the downloaded packs'
   dimension types, and their custom biomes into the live registries.
   Startup ingest reuses its verified installed state and full Overworld
   validation succeeds. If automatic ingest is disabled, use the explicit
   workflow in
   [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks)
   before continuing.

   Folia 26.2 exception: Dungeons & Taverns 5.3.0 currently emits 35
   `nova_structures:*` function-load failures because Folia's dispatcher
   omits or restricts commands the unchanged pack uses. This reproduces
   without Iris and does not mean the Iris pack publication failed, but
   the affected Dungeons & Taverns functions are unavailable. Paper, Leaf,
   and Canvas must not emit those failures.

5. Stage both exact vanilla slots:

   ```text
   /iris replace minecraft:overworld type=overworld seed=123456789
   /iris replace minecraft:the_nether type=underworld seed=-987654321
   ```

   Expect: both commands report staged after downloaded-pack registration.
   `bukkit.yml` names `Iris:overworld` for `world` and `Iris:underworld`
   for `world_nether`. Exactly two replacement journals and two sibling
   stages exist. Neither live target has moved. `server.properties`
   `level-name` and `level-seed` are unchanged. There is no `main`,
   `overwrite`, `force`, or portal flag involved. `seed` is optional per
   target. If you omit it, Iris keeps that target's saved seed.

6. Restart once after both replacements are staged.

   Expect: the same cold reconcile publishes both transactions before
   aggregate-datapack compilation, registry creation, and Bukkit world
   loading. The worlds load as exact `minecraft:overworld` and
   `minecraft:the_nether`, using the `overworld` `NORMAL` dimension and
   `underworld` `NETHER` dimension respectively. Their authoritative seeds
   are `123456789` and `-987654321`. Each retains its Paper metadata.
   Each has its own frozen `iris/pack`. Neither contains the old
   `region`, `entities`, `poi`, or marker chunks.

7. Watch both `WorldLoad` verifications and wait for cleanup.

   Expect: each journal advances only after Iris proves the exact
   namespaced identity, generator, selected dimension, environment, seed,
   and unchanged pack fingerprint. Cleanup then removes both retained
   backups and journals asynchronously.

8. Verify the replacement Overworld's persisted safe spawn before you
   admit ordinary players.

   Expect: the canonical spawn has a non-air, non-fluid,
   collision-supporting block directly below it and two passable,
   collision-free, fluid-free body blocks. Stop and cold-start the server
   once more and verify the same spawn and block states. To test
   returning-player rescue, stage a disposable player data file whose
   saved Overworld position will be inside the new terrain. Log in once.
   Confirm Iris redirects that player to the safe spawn and persists the
   new location. The next login must not repeat the one-time redirect. If Iris cannot verify the spawn, guarded login must be
   refused rather than placing the player inside terrain.

9. Build a Nether portal in the replacement Overworld and traverse it.
   Then traverse the resulting Nether-side portal back.

   Expect: the forward trip enters the exact `minecraft:the_nether` Iris
   Underworld. The return trip enters the exact `minecraft:overworld` Iris
   Overworld. Iris does not reroute portals to arbitrary `iris:*` worlds.
   Canonical routing works here because both vanilla identities were
   replaced in place. Generate fresh chunks on both sides and confirm no
   fatal engine or portal-event stack trace.

The default automatic-ingest fresh-install pathway has three required
restart boundaries: discovery and installation of the shipping Overworld's
external datapacks, registry loading, then replacement publication.
Custom packs and installations with automatic ingest disabled use the
explicit workflow in
[22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks)
before replacement staging. As a separate resilience check, a later
ordinary restart should load the same two canonical identities without
recreating a pending stage, backup, or journal.

For rollback coverage, repeat on a fresh disposable instance with a
deliberately corrupted staged pack or conflicting `bukkit.yml` value
before the publication restart. Early Paper bootstrap must abort before
registry and world loading, preserve the recoverable artifacts, and never
guess a target. A failure after publication must journal a rollback and
request the controlled restart. It must restore the retained original
directory and prior configuration before datapack compilation or world
loading. If Iris silently proceeds past a corrupted stage, capture the
journal and stage directories before touching anything. That is a
blocking defect.

## B. Fresh install and first world (Fabric / Forge / NeoForge)

1. Install the matching mod jar into `mods/`. Fabric needs Loader at or
   above the declared floor. Forge and NeoForge need theirs. See
   [01 - Installation & Platforms](/iris/01-installation-platforms) and
   [30 - Platform Differences](/iris/30-platform-differences).
2. Start the dedicated server, or singleplayer if you are also testing the
   client mod.

   Expect: Iris boots without network access and reports no installed
   worldgen packs. Run `/iris download pack=overworld` and
   `/iris download pack=underworld`. Each command installs on disk, leaves
   the process running, and asks for a restart. Even if the empty
   dedicated server has entered Minecraft's paused state, phase and
   completion feedback must still arrive. Before restarting, put the exact
   compatible Towns & Towers 26.1 and Dungeons & Taverns 5.3.0 archives in
   this save's `datapacks/` directory because modded `/iris datapack ingest`
   is a stub. Restart once only after all four inputs are present. Then
   expect external datapack, Iris dimension-type, and biome registration
   to complete.

3. Create both managed dimensions (arguments are positional here, not keyed):

   ```
   /iris create test-ow overworld 1337
   /iris create test-uw underworld 7331
   ```

4. Enter each dimension. If the test harness includes a loader listener,
   record Fabric `ServerLevelEvents.LOAD` or Forge/NeoForge
   `LevelEvent.Load` for each runtime injection, then disable and re-enable
   one disposable dimension and require the matching unload/load pair.

   Expect: non-empty generation, and custom-biome registration where the
   pack defines custom biomes.

5. **Expected:** same generation health as section A. Capability gaps are
   acceptable only where
   [30 - Platform Differences](/iris/30-platform-differences) documents
   them.

## C. Pack validation

1. Validate everything installed. A bare invocation covers every pack on
   both platforms:

   ```
   /iris pack validate
   ```

   Single pack: `/iris pack validate pack=<pack>` on Bukkit,
   `/iris pack validate <pack>` on modded.

2. Read the output and separate blocking errors from warnings.

   Expect: zero blocking errors for a pack you intend to ship. Warnings
   are advisory.

   If there are blocking errors, fix them before treating the pack as
   production-ready. Create and load will refuse the pack later anyway.

3. Replay the startup result:

   ```
   /iris pack status
   ```

   Expect: the result published at startup, including a persisted result
   reused for unchanged content.

4. Restart without changing packs or registry context.

   Expect: the console logs
   `External datapacks match the persisted startup validation` and does
   **not** log another external-datapack `Validating` or `Ingesting` pass.
   Pack validation reuses its persisted result instead of re-parsing.
   Player admission opens only after both phases are ready. The target
   stays loadable.

5. Change one byte in a pack and restart.

   Expect: the content fingerprint invalidates the reuse and validation
   runs in full again.

   Restore the pack before continuing. Cleanup and restore flows are
   separate and opt-in
   ([25 - Pack Management](/iris/25-pack-management)).

## D. Bukkit datapack dimension scope

Prerequisites: a disposable server with one managed datapack source and
a vanilla world. Also include one Iris dimension that declares that
source, and one Iris dimension that does not. Install or ingest the datapack. Restart so its
registries are live. Then create both Iris worlds so scope is applied
before their spawn chunks load.

1. In each of the three worlds, locate a managed structure. Get a valid
   key from `/iris structure list <declaring-dimension>`:

   ```
   /locate structure <managed-structure-key>
   ```

2. Generate new chunks in all three worlds. Checking existing chunks
   proves nothing. A scope change does not rewrite them.

3. **Expected:** locate and natural generation both keep the managed
   structure in the declaring Iris world. Neither the vanilla world nor
   the non-declaring Iris world locates or generates it.

4. Restart with the datapack still installed and repeat locate plus
   new-chunk generation.

   Expect: identical per-world results and no ownership or structure-state
   failure during world initialization.

5. Break one required dimension or native-structure reference, restart,
   and try to create or load that pack.

   Expect: validation blocks before admission completes. Create and load
   report the failure before datapack preparation. No dimension folder,
   pack snapshot, `bukkit.yml` registration, registry entry, or loaded
   world is left behind.

   Restore and revalidate the pack before running the next section.

## E. Pregeneration control

Pregeneration radius is always in **blocks**. Use a disposable world.

**Bukkit** (completion emits every configurable value as `key=value`. A
bare positional radius is also accepted. `gui` defaults to `true`):

```
/iris pregen start radius=352 world=test-ow center=0,0 gui=false
/iris pregen status
/iris pregen pause
/iris pregen status
/iris pregen pause
/iris pregen stop
```

Strict one-chunk-at-a-time (Paper-compatible servers only):

```
/iris pregen start radius=352 world=test-ow center=0,0 gui=false serial=true
```

**Modded** (positional radius, then optional dimension, then literal flags
in any order — `at <x> <z>`, `gui`, `sync`, `nocache`):

```
/iris pregen start 352 irisworldgen:test-ow at 0 0 sync
/iris pregen status
```

Expect, in order:

1. Start reports the correct world, center, and size.
2. `status` shows generated/total, percent, labeled
   overall/10-second/30-second/60-second rates, ETA, elapsed, method, and
   a failed count when any chunk failed.
3. With `gui=true`, closing the pregeneration popup's red X disposes the
   popup while generation continues and the server still answers commands.
   Repeat for Noise Explorer and Vision. On macOS, application Quit while
   an Iris server window is focused must be cancelled rather than stopping
   the JVM.
4. The first `pause` freezes progress. The second resumes it (`resume` is
   an alias for the same toggle).
5. `stop` cancels and finishes active work without claiming completion
   when chunks remain.
6. For a release candidate, also run a full serial or sync 2,025-chunk run
   (radius 352 at 0,0) and confirm zero failed chunks.

If `serial=true` is rejected, the server is not Paper-compatible for
strict serial pregeneration. That is expected, not a bug. If chunks fail,
capture the console before retrying. Failures are the finding, not the
retry.

Client HUD: with the Iris client mod, pregeneration progress arrives on
channel `irisworldgen:main`. Vanilla clients get the boss bar and console
only ([29 - Client HUD & Protocol](/iris/29-client-hud-protocol)).

## F. GoldenHash determinism

Run on a **disposable** world. The scan generates into buffers and never
writes world blocks, but it deletes the world's mantle by default.

**Bukkit** (always `AUTO` — captures when the file is missing, verifies
when it exists):

```
/iris developer goldenhash world=test-ow radius=22 threads=1
```

Optional: `center-x=0 center-z=0 reset-mantle=true deep=false`. Defaults
are radius `8`, threads `8`, center `0,0`, reset-mantle `true`, deep
`false`.

**Modded** (center fixed at chunk 0,0, mantle always reset):

```
/iris goldenhash 22 1 capture
/iris goldenhash 22 1 verify
```

Alias `/iris gold …`. With no arguments: radius `8`, threads `8`, mode
`AUTO`.

Expect:

1. The capture run writes a `.hashes` file in the platform golden
   directory and prints its path plus a short combined hash.
2. A second run with the same pack, seed, radius, and center reports
   **MATCH** with the same hash.
3. The same pack, seed, radius, and center produce the same combined hash
   on Bukkit, Fabric, Forge, and NeoForge for identical artifacts and pack
   bytes.

A Minecraft-version warning on cross-platform comparisons is expected and
harmless. Bukkit and mod loaders report the version string differently. A
seed or dimension mismatch is a hard failure and stops the comparison.

On MISMATCH, read the `.new` file and the first `.diag-*` file before
changing anything. Triage table:
[32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash).

## G. Restart and existing worlds

1. After some pregeneration or free exploration, stop the server cleanly.
2. Start again without deleting world data.
3. Load the same Iris world and generate new chunks outside the
   pregenerated area.
4. **Expected:** the world loads, new chunks generate, no blank-chunk
   regression appears at the restart boundary, and a resumed pregeneration
   job behaves as documented
   ([07 - Pregeneration](/iris/07-pregeneration)).

## H. Studio (authoring path)

### General pack Studio

Use the platform syntax and one fixed seed:

```text
/iris studio open overworld seed=1337        # Bukkit
/iris studio open overworld 1337             # modded
```

Measure from command admission until the player changes into the Studio
dimension. On Bukkit use the emitted `Studio player <name> arrived in
<milliseconds>` line; on modded record the same command-to-dimension-change
interval in the harness. Require less than 10,000 ms for Overworld, close,
then repeat for Underworld. Record cold and warm results separately and
capture JProfiler when a phase is unexpectedly slow.

For ordinary Bukkit Studio, require the canonical generation-cache warm
to run as lifecycle-tracked asynchronous work overlapped with native
structure-ring activation. Runtime worlds still run the same warm
synchronously. Its `generation_cache_warm` timing must report
`skipped=false`; generation, Matter generation, Studio hotload, and entry
teleport must remain gated until it completes. Because the warm and ring
intervals overlap, do not sum their phase durations.
During native teleport, require only the entering player's view distance
to become 2 and the prior value to return immediately after success or
failure. A second player must remain unchanged. Generate beyond the entry
chunk and confirm every requested chunk still follows the canonical FULL
pipeline.

Studio must generate the same blocks, biomes, structures, and terrain as
a normal world with the same pack and seed. At fixed coordinates compare
the Studio result with a disposable production world. A blank chunk,
landing pad, simplified biome field, skipped structure, or different
terrain is a failure.

While moving through fresh chunks so Moonrise has active generation
stages, edit a pack file on disk. On Bukkit you may also edit through the
VSCode workspace opened by `/iris studio vscode dimension=overworld`.
Then close while fresh chunks are still queued:

```
/iris studio close
```

Expect: the studio world opens. Hotload applies without a server restart.
Already-admitted stages finish before the transition and later stages
resume after it. Close discards the transient studio world cleanly.

As a separate transition test, issue a second `open`, `close`, or
`tpstudio` while the first transition is still active. Expect strict
per-owner ordering. The absolute arrival budget remains 10 seconds from
each command's own admission, queued time consumes that budget, temporary
modded chunk tickets are released, and an expired request never teleports
the player later.

**Expected:** no generation-session rejection, no partial chunk-stage
failure, no chunk-system crash. A failed hotload must fail closed without
poisoning the live engine for non-studio worlds. Studio details:
[10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas).

### Image-map acceptance

Use a disposable pack, a fixed seed, and a small canonical PNG with known values. The complete authoring contract is in [42 - Image Map Studio Workflow](/iris/42-image-map-studio-workflow).

1. Import or place a valid PNG under `images/`. Confirm Studio inspection reports the expected dimensions, channel layout, bit depth, alpha, and raw sample values.
2. Create the typed `image-maps/<key>.json` resource and a dimension `imageMaps` binding. For a height test, include black, midpoint, and white samples. For a color test, include exact, unknown, and deliberately overlapping-tolerance samples.
3. Set known coordinate checkpoints on both sides of world zero. Exercise a nonzero `sourceOrigin`, one rotation, one mirror, `blocksPerPixel` above one, and an explicit out-of-bounds policy.
4. Add a named `MASK` binding and compose it on the primary binding. Confirm threshold, falloff, inversion, and operation in the interpreted preview.
5. Configure `worldBoundary` so one edge crosses the image coverage. Confirm the boundary is drawn at `center ± size/2` and `size` is treated as full diameter.
6. Validate the pack. Unknown or ambiguous colors under `ERROR`, unsupported source data, missing targets, invalid mask graphs, excessive image dimensions, and uncovered required coordinates must be blocking errors before generation.
7. Repair the deliberate failures. Export, reopen the project, and select the named image-map layer in Vision. Hover the same checkpoints and compare decoded values and targets.
8. Open ordinary Studio with seed `1337` and generate fresh chunks at the checkpoints. Close and reopen, then regenerate in a clean disposable world with the same pack bytes and seed.
9. Repeat validation and the checkpoint generation on each supported platform family used in production.
10. Record the current native border, remove `worldBoundary`, hotload, and confirm every native border value remains unchanged.

**Expected:** Studio interpreted preview, Vision hover, and fresh chunk output agree; invalid and ambiguous data fail before chunk generation; masks and negative coordinates are deterministic; packaging contains every referenced PNG and image-map resource; restart and cross-platform output match; removing the boundary preserves the current native border.

### Jigsaw Studio: planar authoring and atomicity (Bukkit)

Use a disposable pack and structure key, and the owning builder account.
Bukkit has one global Studio project and world and one owning Jigsaw
session. Non-owner block edits and recognized mutating commands must be
denied throughout this world. This command tree is not registered on
Fabric, Forge, or NeoForge.

1. Create a project with no optional arguments so the defaults are
   exercised:

   ```text
   /iris jigsaw create overworld test/jigsaw
   /iris jigsaw status
   ```

   Expected: the add-only transaction owns one structure, three pools, six
   pieces, six objects, and one manifest before Studio opens. On Paper,
   native-structure scope must report success and reject any
   active-generator ownership or asynchronous game-rule event error. The
   player enters creative above Blank. `status` reports `PLANAR_JIGSAW`,
   `IRIS_EXTENDED`, six workcells, 15×15×15 for the selected workcell, six
   variants, no pending autosave, and the seed-`1337` evaluation. The key
   tab-completes for `open`, `edit`, and `reopen`. The GUI and owned
   resources show one loaded variant per archetype, theme `variant-1`,
   terminal End, and mandatory caps off.

2. Inspect the Blank, End Cap, Hallway, L Junction, T Junction, and Cross
   Junction layout. Floors are light-gray wool, topology paths are red
   wool, and canonical endpoints are sea lanterns. There are no
   orientation, permutation, piece, or derived-rotation cells. Toggle
   player-local particles:

   ```text
   /iris jigsaw goto workcell/blank
   /iris jigsaw goto workcell/straight
   /iris jigsaw goto workcell/cross
   /iris jigsaw particles false
   /iris jigsaw particles true
   ```

   Expected: every cell has one physical white-concrete edge cage. No
   workcell-bound display entity exists. Focused plus nearby particle
   trails outline the editable bounds inside those cages. Focused
   connectors draw 1.75-block direction lines while particles are on. The
   Iris scoreboard replaces the general Studio context with Structure,
   Workcell, Variant, State, and `Triple-sneak for controls`, with no
   orientation or mask fields. All six untouched cells report
   **Autosaved** initially. Enter End Cap, triple-sneak, and confirm the
   menu selects End Cap rather than the previously selected cell.

3. Open the same six-row controls three ways: right-click the protected
   chest, run `/iris jigsaw menu`, and sneak three times within 1.5
   seconds.

   Expected: each path opens without an `InventoryView` linkage error on
   the target Paper-family runtime. Select Hallway and click **New Blank
   Variant**. Wait for its atomic graph result and load, then reopen the
   controls. Rename the loaded variant and the Hallway workcell through
   their anvil inputs. Confirm the labels round-trip. The piece key,
   `straight` stable ID, and solver role stay unchanged. Load End Cap
   and use **Duplicate This Cell's Variant**, then load Cross Junction and
   duplicate it too.

   Expected: the new key follows
   `test/jigsaw/variants/straight/variant-<n>` and loads into Hallway with
   the source piece's complete metadata and exact pool entries but an
   empty same-sized object. At the default 15×15×15 its two real markers
   sit at `(7,7,0)` and `(7,7,14)`. They face north and south with top
   `UP_POSITIVE_Y`. They show pool `iris:test/jigsaw/pieces`, use name
   and target `iris:planar`, `ALIGNED`, `minecraft:structure_void`, and
   signed priorities `0`. Mojang's UI is usable after hydration. Break one
   marker and click **Reset Connector Blocks** before autosave: both saved
   markers return while another edited block stays as you left it. Each
   duplicate copies the active object's bytes, display label, and complete
   piece metadata. The End Cap duplicate has exact matching entries in
   both `test/jigsaw/pieces` and `test/jigsaw/caps`. The Cross Junction
   duplicate has them in both `test/jigsaw/start` and
   `test/jigsaw/pieces`. An empty or unassigned workcell refuses both GUI
   actions and points at
   `/iris jigsaw piece create <poolKey> <pieceKey>` instead of picking a
   fallback pool.

4. Change one permanent block, one marker field, and one chest inventory
   inside Hallway. Keep the permanent block and the chest inside the later
   16×3×3 target, for example Y/Z offsets `1,1`. After changing a marker
   field in Mojang's UI, immediately run `/iris jigsaw status`. Change it
   again and immediately run `/iris jigsaw close`. Trigger an internal
   inventory transfer or hopper pickup, and at least one furnace,
   brewing-stand, dispenser, or crafter update inside the workcell. Do
   not flush autosave. Wait at least 40 ticks after the last update, then:

   ```text
   /iris jigsaw status
   ```

   Expected: the status command and the close attempt each request a final
   owning-region marker snapshot. Close waits behind marker finalization
   and autosave rather than losing the last UI change. State
   moves dirty → saving → clean on its own. Inventory and machine changes
   also mark it dirty. One complete multi-resource commit occurs. One
   owner-local bell sounds. No partial resource appears.

   Then make six distinct saved block edits and click **Undo Last
   Autosave** five times. Expected: each prior block state and manifest
   hash returns in reverse order. The sixth-oldest state is no longer
   available. One `.iris/jigsaw-history/key-<sha256>.json` file held the
   stack, and no transaction debris remains.

   Then make another edit while capture is pending and immediately click
   **Duplicate This Cell's Variant**. Expected: Iris expedites the
   autosave and performs that one duplicate exactly once, with no
   wait-and-retry instruction. Repeat with dirty edits in several enabled
   cells and **Duplicate All Enabled Cells as Family**. Invoke **Flush
   Autosave Now** while capture cannot start: the same ticket stays
   pending, retries, and eventually becomes clean. Close, reopen, load
   the variant, and confirm blocks, marker NBT, inventory, explicit-air
   final state where used, and `structure_void` absence all round-trip.
   **Flush Autosave Now** and `/iris jigsaw save` are conveniences, not
   requirements.

   On Paper, repeat one dirty edit immediately before plugin disable and
   confirm the synchronous final drain persists it. On Folia, confirm an
   enabled-world unload or unregister stays deferred and retries until
   autosave finishes. Record the forced-disable boundary separately: once
   Folia has disabled the plugin it rejects new region tasks, so a new
   final cross-region capture cannot be guaranteed. Close Studio, or wait
   for `status` to report no pending autosave, before any reload or
   shutdown.

5. Stage Hallway's capacity as 16×3×3 from **Workcell Settings**, confirm
   the menu stays open during every axis click, then click **Apply Cell
   Size** once. Also test the command form:

   ```text
   /iris jigsaw bounds 16 3 3
   ```

   Expected: only structure capacity metadata changes, one live relayout
   runs after Apply, and every Hallway variant keeps its object bytes and
   exact dimensions. A capacity shrink below any assigned variant is
   rejected atomically.

   Then resize one loaded Hallway variant to 16×3×3 from **Variant Size**
   or `/iris jigsaw variant resize 16 3 3`. Expected: only that object
   changes and it reloads in place. Its canonical connector payloads and
   sockets move to `(8,1,0)` and `(8,1,2)`. Sibling Hallway variants keep
   their prior dimensions and bytes. Resize a second Hallway variant
   to 3×3×3 (raise capacity first if required) to prove variants in one
   cell can differ. Before one shrink, persist a block outside the
   target: the resize must be rejected without an owned-file change.
   Remove the block and retry. A shared or read-only object must also be
   rejected. **Resize This Variant to Capacity** affects only the selected
   variant.

6. Open the loaded variant's details. Change one exact pool entry's weight
   and chance, use **Duplicate This Cell's Variant**, toggle rotation, and
   use the two-click unlink confirmation.

   Expected: only that entry changes. Chance moves in five-percentage-point
   steps. The duplicate has a new key with a copied label and an
   independent object. Every stale callback is rejected by request ID.

7. Use **Duplicate All Enabled Cells as Family** to create `variant-2`.

   Expected: one owned clone is created from the active variant of every
   enabled workcell. Pool memberships, labels, and independent object
   dimensions are duplicated. Every clone is atomically loaded and
   assigned to `variant-2`. A failure leaves both files and all live
   bindings unchanged. Seed `1337` selects one complete weighted theme
   without mixing families. Change a loaded piece's depth, count, and
   terminal rules, theme membership, theme weight, and mandatory caps.
   Invalid combinations must fail atomically. They must surface in the
   automatic evaluation with no manual validation command.

8. Disable Tee.

   Expected: its white-concrete cage remains, the GUI and scoreboard
   report Disabled, the workcell stays editable, and Tee pieces disappear
   from assembly. The permanent seed-`1337` preview on the negative-X
   side updates in place and is protected from players, fluids, pistons,
   explosions, growth, fire, entities, and redstone. The GUI, scoreboard,
   or `status` shows its selected theme and piece count. Reach it through
   both **Go to Preview** and `/iris jigsaw preview goto`. Re-enable Tee
   and confirm participation returns.

9. Open **Toolbox** and take the schema-`2` named sticks. That set is
   selection, capacity, per-variant size, variant and workcell rename,
   duplicate-one and duplicate-family, preview, membership, rules and
   themes, caps, variant deletion, and project deletion.

   Expected: right-click uses the exact bound context. Rename sticks open
   an anvil and sneak-right-click resets the label. Other context sticks
   open the matching GUI. Destructive tools require a second use within
   10 seconds. Schema-`1` and replaced-Studio sticks are rejected. The
   active variant uses a jigsaw icon. A valid evaluation uses emerald.
   Minimum placements does not use dye. Lime dye appears only as an
   explicitly labeled theme-membership boolean.

10. Have a second player try the chest, triple-sneak controls, a direct
    block edit, `/setblock`, `/fill`, `/execute run setblock`,
    `/function`, `/data merge block`, `/item replace block`, and an
    arbitrary plugin mutation command. Have them try to break, move, or
    explode the chest and the preview.

    Expected: non-owner mutations and commands outside the strict
    informational and communication allowlist are cancelled throughout
    the Studio world. Protected content stays intact. Owner edits still
    work.

11. Test ownership onboarding with prepared fixtures outside an active
    Studio:

    ```text
    /iris jigsaw adopt inspect overworld test/unowned target=auto strategy=auto
    /iris jigsaw adopt apply <reported-plan-uuid>
    ```

    Expected: an exclusive closure reports `IN_PLACE`, apply leaves every
    resource byte unchanged while atomically adding ownership and a
    receipt, and the target opens editable. A shared closure reports
    `CLONE_REQUIRED`, and `target=auto` picks a free `-studio` key and
    rewrites its internal references without touching the source. Mutate
    a pinned source after inspect: apply must report stale and write
    nothing. An auto-ingested `MANAGED_DATAPACK` fixture must block
    in-place and succeed only as a private named clone. Removing or
    refreshing the source must not remove that editable clone.

12. Convert one live registered jigsaw into an unused target:

    ```text
    /iris jigsaw convert overworld minecraft:village_plains target=test/converted-village seed=1337
    ```

    Expected: the command reports piece and pool counts plus any
    fidelity-warning count. It writes an owned add-only graph with source
    provenance, and opens it in compact workcells. A non-jigsaw registered
    key and an occupied target both fail without overwriting. Inspect
    blocks, connectors, unsupported or native-only losses, and automatic
    display rotation before calling the conversion faithful.

13. Test variant and project deletion. Create a second variant, load it,
    and delete the now-inactive first variant through the two-click GUI.
    The last or currently loaded variant must stay protected. Add an
    external JSON placement or reference to the project and confirm
    project deletion is blocked with its owner path and location. Remove
    the reference, wait for autosave, then:

    ```text
    /iris jigsaw delete confirm=true
    ```

    Expected: Studio closes and the hash-pinned complete owned closure
    plus manifest are removed. If removal fails after close, the files
    remain recoverable.

14. On Folia, create a spatial project with one active workcell crossing
    several chunks and regions:

    ```text
    /iris jigsaw create overworld test/jigsaw-folia mode=spatial compatibility=iris width=32 height=24 depth=32 seed=1337
    /iris jigsaw bounds 48 24 32
    /iris jigsaw close
    /iris jigsaw open overworld test/jigsaw-folia seed=1337
    /iris jigsaw goto workcell/spatial
    /iris jigsaw piece expand
    ```

    Expected: spatial capacity and its author-facing workcell label
    persist while the live layout regenerates and rehydrates without a
    reopen. `piece expand` resizes only the active object to 48×24×32
    while a smaller sibling variant keeps its dimensions. Change blocks
    in separated chunks of the expanded workcell without manually
    flushing autosave. With all intersections loaded, automatic capture
    schedules each intersection on its owning region. It commits once
    after complete validation. Repeat with one intersection unloaded and
    confirm no owned file changes. The unit tests do not cover this. It
    has to be checked on a live Folia server.

15. Reopen a retained Iris project, attach it to a dimension, region, or
    biome placement with a unique `placementId`, validate the pack, and
    generate new chunks. Gate natural occurrence separately from Studio
    preview. For cave work, generate the mantle first, then confirm
    no-anchor chunks skip and actual anchors align as described in
    [15 - Caves & Carving](/iris/15-caves-carving).

### Jigsaw Studio: strict vanilla export

Create a separate portable project. Its six default planar pieces must
carry no Iris theme or terminal-rule metadata, and no chance, piece-rule,
required-cap, channel, edit, loot, custom-block, or tile metadata. Wait
for autosave and the automatic evaluation to settle.

```text
/iris jigsaw create overworld test/jigsaw-portable mode=planar compatibility=vanilla width=16 height=16 depth=16 seed=1337
/iris jigsaw export namespace=test output=test-jigsaw format=zip replace=false
/iris jigsaw close
```

1. Confirm `<Iris data>/packs/exports/test-jigsaw.zip` was published and
   contains `pack.mcmeta`, a biome tag, a processor list, template pools,
   compressed structure templates, the jigsaw structure, and the
   structure set.
2. Run the same export with `output=../escape`.

   Expect: the traversal name is rejected with no escape artifact and no
   new output created.

3. Stop a disposable **unmodded** Minecraft 26.2 world, put the zip in
   its `datapacks/` directory, and restart it. Do not use `/reload` for
   this gate. It can list the pack as enabled without rebuilding the
   running world's worldgen registries.
4. Confirm the pack is enabled with no datapack or data errors, then:

   ```text
   /locate structure test:test/jigsaw
   ```

   Generate fresh chunks around the result.

5. **Expected:** the vanilla server loads the pack, locate resolves the
   exported key, and a natural assembled instance appears. Passing graph
   tests, a clean plugin boot, and a clean NBT decode do not tell you
   this. Only a real vanilla server does.

This is a required manual runtime gate. Record it as untested until a
disposable vanilla server or client completes all five steps.

Strict export must reject coherent themes, membership chance, and
non-default piece rules. It must also reject required caps, non-portable
channels, and fixed rotation. It rejects structure edits or loot, tile
payloads and block entities, custom blocks, and retained marker blocks.
It rejects invalid or duplicate connectors, weights outside `1..150`,
depth above `20`, and radius above `8`. Disabled planar archetypes are
omitted from the export. Full authoring and recovery
detail: [21 - Jigsaw Structures](/iris/21-jigsaw-structures).

## I. Offline probe module (no live server)

Run from the Iris project root on JDK 25. These are CI gates, not in-game
commands.

| Task | What it proves |
|------|----------------|
| `./gradlew :probe:run` | Loads compiled `core` classes with no `org.bukkit` on the runtime classpath. Fails on purity violations outside the allowlist |
| `./gradlew :probe:deserializationProbe` | Deserializes fixture entity, spawner, and loot JSON through the real Iris loaders on a Bukkit-free JVM |
| `./gradlew :probe:genProbe -PprobePack=/path/to/packs/overworld` | Builds a real engine for dimension `overworld` at seed `1337` and generates a chunk spiral into buffers |

`genProbe` properties: `probePack` is the pack path. The built-in default
is a developer-local path, so always pass your own. Also set
`probeRadius` (default `2`) and `probeCenterChunkX` /
`probeCenterChunkZ` (default `0`). The task copies the pack to a temp directory, runs `PackValidator`,
then generates and prints per-chunk hashes.

**Expected:** each probe exits 0. The classload and deserialization probes
are part of the release verify job when CI is green
([86 - Maintainer - Release Checklist](/iris/86-maintainer-release-checklist)).

## J. Minimal post-upgrade checklist

After replacing only the jar or mod:

1. Boot on the same world data.

   Expect: no enable crash.

2. Run `/iris pack validate pack=<pack>` (Bukkit) or
   `/iris pack validate <pack>` (modded) against production packs.

   Expect: no new blocking errors. New errors after an upgrade mean a
   schema change. Check [03 - Configuration](/iris/03-configuration) and
   the relevant content doc before editing packs.

3. Generate a few new chunks in an existing Iris world.
4. Optionally run a short GoldenHash verify against a stored baseline, if
   the pack and seed are unchanged
   ([32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)).
5. If a pregeneration job was mid-run, confirm it reports status and
   resumes, or cancel it cleanly
   ([07 - Pregeneration](/iris/07-pregeneration)).

**Expected:** no enable crash, packs still loadable, generation continues.

## K. Failure triage order

Work top to bottom. Most reported "Iris broke" cases resolve in the first
three.

1. Confirm Java 25 and the correct platform artifact
   ([01 - Installation & Platforms](/iris/01-installation-platforms)).
2. Confirm the pack validates and the dimension key exists
   ([25 - Pack Management](/iris/25-pack-management),
   [05 - Concepts & Pack Layout](/iris/05-concepts-pack-layout)).
3. Confirm the target really is an Iris world with a live engine
   ([06 - Worlds & Lifecycle](/iris/06-worlds-lifecycle)).
4. Capture GoldenHash with `threads=1` and `reset-mantle=true`. On
   mismatch, read the written `.new` and `.diag-…` files
   ([32 - Determinism & Goldenhash](/iris/32-determinism-goldenhash)).
5. For throughput or memory problems, tune settings before changing packs
   ([33 - Performance Tuning](/iris/33-performance-tuning)).
6. For a release candidate, escalate to the maintainer gates
   ([87 - Maintainer - Release Readiness](/iris/87-maintainer-release-readiness)).
