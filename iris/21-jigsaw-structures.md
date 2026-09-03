---
title: "Jigsaw Structures"
description: "Iris documentation: Jigsaw Structures"
published: true
date: 2026-09-03T12:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
An Iris jigsaw structure is a set of objects (pieces). The assembler snaps them together through matching connectors until it runs out of depth, space, or candidates. Jigsaw Studio is the Bukkit in-game workflow for authoring those pieces. The resources it saves run on every supported platform through the shared core assembler. Planar mode is a constrained grid for village-like layouts. Spatial mode is freeform for strongholds, towers, and multi-level rooms. A project created with the `VANILLA_PORTABLE` contract can also be exported as a strict Minecraft 26.2 vanilla datapack.

This page replaces the former in-game jigsaw instructions. General Studio behavior is in [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas). Placement context is in [18 - Structures Overview](/iris/18-structures-overview). Native and datapack structures are in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks). Vanilla feature, mob, loot, and sapling recipes are in [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

## Build a village kit

This walkthrough creates a planar project. It adds a piece, wires its connectors, puts it in a pool, tunes the graph, and then generates it in a world.

Prerequisites:

- A Bukkit-family Iris server. The `/iris jigsaw` tree is Bukkit-only and player-only. Every subcommand uses the `iris.all` permission.
- A writable pack under the Iris `packs/` directory. Use a disposable pack or a version-controlled copy. A committed graph transaction is persistent. There is no undo command.
- No other Studio world opening or closing. Bukkit has one global Studio project/world lifecycle and one owning Jigsaw player session.

Inside an active Jigsaw Studio world, non-owner block edits and recognized mutating commands are cancelled.

### Step 1 — Create the project

```text
/iris jigsaw create overworld village/demo
```

`village/demo` is the structure key. It writes `structures/village/demo.json`, is the string Iris placements reference, and is what you pass to `open` later. `structure=` and `name=` are aliases for `key=`, not references to a separate vanilla structure.

With no optional arguments you get planar mode, Iris-native compatibility, 15x15x15 workcells, and Studio seed `1337`. `mode=` tab-completes `planar` or `spatial`, `compatibility=` completes `iris` or `vanilla`, and existing structure keys complete for `open`, `edit`, and `reopen`. Planar width and depth must each be at least `3`. X and Z cannot exceed `128`. Y must stay within `1..192`. One workcell cannot exceed `2,097,152` blocks. Width and depth may differ.

Creation is add-only. Iris refuses any occupied or conflicting target rather than overwriting it.

**What lands on disk:**

```text
structures/village/demo.json
jigsaw-pools/village/demo/start.json
jigsaw-pools/village/demo/pieces.json
jigsaw-pools/village/demo/caps.json
jigsaw-pieces/village/demo/{blank,end,straight,corner,tee,cross}.json
objects/village/demo/{blank,end,straight,corner,tee,cross}.iob
.iris/structure-manifests/key-<sha256>.json
```

The start pool holds Cross Junction at weight `1`. The pieces pool holds End Cap, Hallway, L Junction, T Junction, and Cross Junction, and its direct fallback is the caps pool. The caps pool holds End Cap plus an empty termination entry. Resource keys stay `end`, `straight`, `corner`, `tee`, and `cross`. Every default piece is rotatable with weight and chance `1` wherever it is a pool member.

In an Iris-compatible project every piece belongs to theme `variant-1`. End Cap is terminal. Mandatory caps are off. An unresolved optional branch fails the whole assembly. A vanilla-compatible project omits Iris theme and terminal-rule metadata and terminates only the unresolved branch.

**What you should see:** Studio opens with you in creative above the Blank workcell, and all six workcells have their default variant loaded.

### Step 2 — Look around the Studio

```text
/iris jigsaw status
/iris jigsaw particles true
```

A planar Studio has exactly six rotation-independent workcells in three columns by two rows. Blank, End Cap, and Hallway sit on the first row. L Junction, T Junction, and Cross Junction sit on the second. Their stable IDs are `blank`, `end`, `straight`, `corner`, `tee`, and `cross`. Neighboring capacity columns and rows keep at least one clear block between them even when their sizes differ.

Each floor is light-gray wool, the canonical connector path is red wool, and every canonical face-center socket is capped with a sea lantern. There is no orientation, permutation, authored-piece, or derived-rotation gallery: rotations are solved at runtime.

Every workcell sits inside a physical white-concrete edge cage one block outside its editable capacity. Player-local particle trails outline the focused and nearby editable bounds inside those cages. They also draw a 1.75-block direction line out of each focused connector. Lime means complete metadata with no Iris channel. Red means incomplete identity metadata. Other colors are deterministic per channel. Jigsaw Studio spawns no display entities for workcell bounds. `/iris jigsaw particles <true|false>` controls the workcell, connector, and temporary assembly diagnostics.

The Iris scoreboard switches to Jigsaw context automatically and reports the structure, workcell, variant, and one of Loading, Saving, Disabled, Read-only, Invalid, Unsaved, or Saved. `/iris studio scoreboard` toggles that sidebar for the current login.

### Step 3 — Make a piece

Open the controls three ways: right-click the generated control chest with the main hand, run `/iris jigsaw menu`, or sneak three times within 1.5 seconds. The six-row GUI shows the six workcells and pages only the variants belonging to the selected rotational archetype. Walking into a workcell selects it for your next menu open. Left-clicking a workcell in the GUI selects it, closes the menu, and teleports you to its horizontal center.

Left-click **Hallway**, then click **New Blank Variant**. Iris clones the active owned piece complete metadata and every exact pool-entry membership into a service-named owned piece. It creates an empty object with the source object dimensions. It closes the GUI while the graph transaction runs. It then loads the new variant into Hallway. Reopen the menu after the completion message.

**What you should see:** a deterministic new key such as `village/demo/variants/straight/variant-1`, and an empty Hallway-sized volume you can build in.

Related actions on the same page:

- **Rename This Variant** and **Rename This Workcell** use an anvil text input. Labels are author-facing only.
They never change piece keys, stable workcell IDs, or solver archetypes.
- **Duplicate This Cell's Variant** clones the same complete metadata and every exact membership. It also copies the source object's bytes and its author-facing label. An End Cap clone keeps both its pieces- and caps-pool entries.
A Cross Junction clone keeps both its start- and pieces-pool entries, including each entry's weight, chance, and other fields. Neither action guesses a first or lexicographically sorted pool.
- Both actions need an active owned variant with at least one owned membership. For an empty or unassigned workcell, run `/iris jigsaw piece create <poolKey> <pieceKey>` so the pool is explicit. A non-owned variant cannot be duplicated or mutated.

### Step 4 — Build the piece and wire its connectors

Walk into Hallway and build inside its white-concrete cage. The workcell shows the active object's real blocks with connector blocks hidden by default. **Workcell Settings** toggles real `minecraft:jigsaw` overlays back on when you need to edit markers. If a shown connector gets broken, **Reset Connector Blocks** restores every saved connector coordinate without touching your other edits.

A planar piece authored facing some other direction is rotated into canonical orientation automatically. Block states, connectors, positions, and final states rotate with it, and capture applies the inverse rotation so the source resources stay coherent.

Configure each `minecraft:jigsaw` marker through Mojang's own block UI. A freshly generated Hallway variant already has north and south markers set to:

| Mojang field | Generated planar value |
|---|---|
| Name | `iris:planar` |
| Target name | `iris:planar` |
| Pool shown in the marker UI | `iris:village/demo/pieces` |
| Joint | `ALIGNED` |
| Final state | `minecraft:structure_void` |
| Selection priority | `0` |
| Placement priority | `0` |

The jigsaw block's `orientation` block state supplies its front and top directions. Marker pools must be written as `iris:<owned-pool-key>` in Mojang's UI. Capture checks that namespace and stores the internal key without `iris:`. Do not move a generated planar marker off its face-center socket. For `VANILLA_PORTABLE`, use vanilla-valid namespaced connector identities and leave the Iris-only channel empty.

### Step 5 — Let autosave capture the work

Change one block, then wait two seconds without another workcell update. Iris marks the workcell dirty immediately and schedules capture after a 40-tick quiet period. A later change replaces the pending capture identity, and a busy capture retries until the save/load/graph barrier lets it through.

Autosave watches far more than block placement. Container inventory click, drag, and close events.
Internal inventory moves and hopper pickups.
And furnace, brewing-stand, dispenser, and crafter activity are captured alongside block, fluid, growth, piston, redstone, explosion, interaction, and recognized command changes. Opening Mojang's jigsaw-block UI starts a five-tick owning-region NBT poll.
A detected tile change marks the workcell dirty. A following command, tool use, teleport, world change, quit, graph operation, **Flush Autosave Now**, close, or enabled-world unload first requests a final tile snapshot.

```text
/iris jigsaw status
/iris jigsaw save
```

`status` reports whether an autosave is pending. `/iris jigsaw save` and the GUI's **Flush Autosave Now** request an immediate flush.
If the final marker snapshot, another operation, or scheduler availability blocks capture from starting, the same pending ticket is kept and retried. Neither is required in the normal loop. Fresh untouched workcells report **Autosaved**, not pending. Every successful atomic workcell save plays one short bell for the owner.

**What connector order survives.** With connector blocks visible, autosave preserves the authored connector order. It keeps every marker still at the same source-local position. That includes markers whose metadata or orientation changed there. Removed markers disappear.
New or moved markers append in deterministic X/Y/Z order. With connector blocks hidden, connector identity and order stay fixed. The exact ordinary block state and tile NBT at that coordinate are captured into the object. They become that connector final state. Duplicate source or captured positions reject the save.

**What a capture actually writes.** Iris reads the active owned variant across its exact displayed dimensions. It converts jigsaw blocks into connector metadata. It writes each connector `final_state` into the object cell. It replaces only the piece JSON connector array so omitted defaults and extension fields stay intact. It compiles the complete owned graph. It then commits the JSON, `.iob`, and manifest together. The Jigsaw service invalidates, reloads, evaluates, and rematerializes these graph resources directly instead of running ordinary Studio's full-engine pack hotloader. If an object crosses chunks, Iris snapshots every intersection on that chunk's owning region and starts the write only after the complete capture validates. A failed or incomplete capture writes nothing.

**Rewinding.** Each changed autosave keeps the previous complete owned closure in one per-project history file. Content blobs are deduplicated and only the newest five iterations are retained. **Undo Last Autosave** restores and removes the newest retained iteration through the atomic writer, so clicking it repeatedly rewinds up to five saves.

**When capture keeps failing.** Persistent validation or atomic-writer failures leave that mutation dirty. Iris emits one console report with request, structure, workcell, and piece context. It retries after 2, 4, 8, 16, then at most every 30 seconds. A planar connector-topology mismatch is ordinary authoring validation, not a crash. It names the required and edited shape without a stack trace. It points you at **Reset Connector Blocks**. A later edit clears that failure state, and a manual flush retries immediately without discarding it. Pending tickets resolve their workcell by stable ID after every committed graph reload, so saving one workcell cannot strand sibling autosaves on replaced layout objects.

### Step 6 — Read the preview

Every committed mutation triggers a background compile and a seed-`1337` assembly. The menu reports `PENDING`, `VALID`, `WARNING`, `INVALID`, or `STALE`, plus the selected theme, piece count, and current diagnostic.

Iris renders the assembled blocks on the negative-X side of the workcells. It keeps them until replacement or Studio close. It updates that read-only area after each later commit. Planar previews sit on the editing floor.
Spatial previews are lifted 48 blocks above it so a connected three-dimensional blob stays visually separate from the one-row editor. Click **Go to Preview** or run `/iris jigsaw preview goto` to teleport above it. The preview bounds are protected from players, fluids, pistons, explosions, growth, fire, entities, and redstone. The renderer accepts at most 250,000 explicit blocks.
A larger assembly becomes `INVALID` with the render-limit diagnostic and is not rendered.

For a one-off diagnostic at another seed:

```text
/iris jigsaw preview assemble seed=4242
```

That command places no blocks. It draws bounded purple particle boxes for 10 seconds and does not replace the automatic seed-`1337` evaluation or the permanent block preview.

### Step 7 — Build pools and wire fallbacks

The three generated pools cover a basic village. Add more before you target them from new markers:

```text
/iris jigsaw pool create village/demo/rooms
/iris jigsaw pool create village/demo/end fallbackPoolKey=none
/iris jigsaw rules fallback village/demo/rooms village/demo/end
```

`pool create` makes an empty pool and can point it at an already owned direct fallback. `rules fallback <pool> none` clears one. Every change compiles the full owned graph before commit, so a missing pool or a fallback cycle is rejected rather than saved.

To place an existing piece into another pool, or to drop it out of one, use `/iris jigsaw piece add <poolKey> <pieceKey> [weight=1]` and `/iris jigsaw piece remove <poolKey>`. Removing a membership never deletes the owned piece or object.

### Step 8 — Tune variation

From the GUI:

- Each exact pool membership carries a positive relative weight and an independent `0%..100%` eligibility chance. GUI chance adjustments move in five-percentage-point steps. Chance is rolled before weighted selection.
- **Themes & Piece Rules** sets a loaded owned variant theme membership. It also sets allowed depth `0..30`, required and maximum placement count `0..512` (maximum `0` means unbounded), and terminal role.
- **Duplicate All Enabled Cells as Family** allocates the next `variant-<n>` family. It clones the currently loaded owned variant from every enabled workcell. It duplicates their pool memberships. It then atomically loads and assigns all clones to that one new theme. It either commits the complete family or changes nothing.
- **Structure Themes & Caps** shows each family's current whole-assembly percentage and adjusts its relative weight.
- **Mandatory Caps** requires every unresolved connector pool to go through its direct fallback and place a compatible terminal piece. The default End piece is terminal. The default pieces pool already points at the caps pool. A new Iris-compatible project can turn this on without editing End first.

An assembly selects exactly one theme by positive theme weight, so it comes out entirely `variant-1` or entirely `variant-2`. Pieces do not mix families unless a piece belongs to both or has an empty theme list. Membership chance stays independent and is rolled per candidate after the family is chosen.

Piece themes, non-default chance, piece rules, and mandatory caps are Iris-only metadata. A graph that uses them is not `VANILLA_PORTABLE`.

### Step 9 — Size workcells and variants

Open **Workcell Settings** and stage capacity width, height, or depth by 1 or 8 without closing the menu. Click **Apply Cell Size** once all three values are ready. Iris then performs one live regeneration. It moves the white-concrete cages and active variants. It keeps one clear block between capacity rows and columns, or spatial cells. It rehydrates tile data. It moves you with the selected workcell. **Discard Size Changes** cancels the staged values without writing. Reopening Studio is only the recovery path if live regeneration fails.

Every planar workcell persists its own capacity, and changing it never rewrites a variant object. Capacity cannot shrink below any variant already assigned to that cell.

**Variant Size** gives the selected owned variant its own exact width, height, and depth within that capacity. Growth adds air. A safe shrink preserves in-bounds blocks and moves canonical connector payloads and sockets to the new face centers.
Cropping or a collision rejects the transaction without writes. **Resize This Variant to Capacity** is the one-click exact-size shortcut. A loaded resized variant reloads in place after commit, and sibling variants keep their own dimensions and bytes.

Disabling a planar workcell removes all pieces of that archetype from assembly and vanilla export while preserving its size and variants for later editing. Its translucent cuboid turns from light blue to red.
Iris removes the tracked display when the origin chunk unloads and recreates it after that chunk loads again. Re-enable the workcell from the same settings page to restore participation.

### Step 10 — Take Toolbox sticks for repeated actions

Use the **Toolbox** page when you want an action available without reopening the chest. Clicking an entry gives you a named stick bound to the current Studio request and its workcell, variant, pool entry, or action. Right-click to use it. Resize, themes, and rules sticks open the relevant GUI context.
Other sticks run their exact bound action. A stick from a closed or replaced Studio is rejected. Destructive sticks need two right-clicks within 10 seconds.

### Step 11 — Set expansion limits

```text
/iris jigsaw rules limits 12 8
```

The first number is depth, the second is horizontal radius in chunks. Extended graphs accept depth `1..30` and radius `1..32`. A `VANILLA_PORTABLE` session restricts this to depth at most `20` and radius at most `8` chunks.

### Step 12 — Register the structure in a world

Attach the structure to a dimension, region, or biome with a `structures[]` placement, validate the pack, and generate new chunks. A complete placement example is under **Natural placement** below.

### Step 13 — Close Studio

```text
/iris jigsaw close
```

Wait for autosave, variant load, evaluation, or graph-update messages before replacing or closing Studio. Pending autosave blocks conflicting variant and graph operations. `close` refuses tracked work unless it is clean.
`discard=true` abandons pending edits.

The walkthrough passes when all of these hold. Autosave commits the edited object and marker data. Automatic evaluation reaches `VALID` or an understood `WARNING`. The permanent seed-`1337` preview renders the expected family. Pack validation succeeds. A natural instance appears in newly generated chunks.

### How the Studio world opens

Jigsaw edits that change required datapack registry content need a restart before Studio can use them.
The pack must also pass `/iris pack validate pack=<dimension>`. Fix the first blocking error and retry.

Choose the command from the kind of source you have:

| Starting point | Command | Key form |
|---|---|---|
| Owned editable Iris graph | `jigsaw open` | Internal Iris path such as `minecraft_ancient_city` |
| Existing unowned or managed Iris graph | `jigsaw adopt inspect`, then `adopt apply` | Internal Iris path |
| Live registered vanilla or datapack jigsaw | `jigsaw convert` | Namespaced registry key such as `minecraft:ancient_city` |

## Re-edit an existing Studio jigsaw

Do not run `create` again because creation is add-only. Reopen a Studio-owned graph by its original dimension and structure key:

```text
/iris jigsaw open overworld village/demo
```

`/iris jigsaw edit ...` and `/iris jigsaw reopen ...` are aliases. All three reconstruct workcell capacities and labels, enabled states, variant dimensions and labels, themes, rules, and pool memberships from the saved graph. Changes inside loaded owned variants autosave as usual.
**Flush Autosave Now** only requests an immediate recovery flush and leaves blocked work queued for retry. The automatic seed-`1337` evaluation and permanent preview rebuild after each committed change. A loaded variant without editable ownership shows as Read-only and cannot be changed.

`open` never looks up Minecraft's live structure registry. For example, `minecraft_ancient_city` means `structures/minecraft_ancient_city.json` in the Iris pack. If that legacy graph has no ownership manifest, inspect and adopt it before editing.

## Adopt an existing Iris graph

An existing Iris graph with no ownership manifest must be inspected and claimed before Studio will edit it:

```text
/iris jigsaw adopt inspect overworld legacy/village target=auto strategy=auto
/iris jigsaw adopt apply <plan-uuid>
```

`inspect` reads the complete structure, pool, piece, object, and referenced loot closure asynchronously. It reports a plan UUID, target, resource and byte counts, structured warnings and errors, and one of `IN_PLACE`, `CLONE_REQUIRED`, or `BLOCKED`. The default `auto` strategy claims an exclusive unowned closure in place.
If any resource is shared with another structure, it plans a private clone instead. `target=auto` names that clone `<source>-studio`, then tries numbered suffixes without overwriting an existing target. Use `strategy=in-place` to require a claim with no resource-byte rewrites, or `strategy=clone target=<new-key>` to require a specific private copy.

Plans belong to the inspecting player, live in memory for 15 minutes, and are consumed once. Close any active or opening Jigsaw Studio before `apply`. Apply takes the pack mutation lock. It re-hashes the pinned source and target read set. It rejects an expired or stale plan without writes. It then atomically commits the ownership manifest plus an adoption receipt. Success opens the owned target at Studio seed `1337`. Adoption metadata records source and target hashes and mappings for provenance.
It does not give you a rollback command or a restorable preimage.

Automatic datapack imports carry `MANAGED_DATAPACK` ownership because removing or refreshing the source may clean or replace them. Iris detects that provenance during inspect, forbids in-place adoption, and plans a private clone while leaving the managed graph untouched:

```text
/iris jigsaw adopt inspect overworld imported/key target=my-edits/key strategy=clone
/iris jigsaw adopt apply <plan-uuid>
```

## Convert a registered vanilla or datapack jigsaw

Raw registered structures are not Iris graph files, so they cannot go through `adopt`. Convert one registered jigsaw structure into a new add-only owned Iris graph, which then opens automatically:

```text
/iris jigsaw convert overworld minecraft:village_plains target=village/plains seed=1337
```

The source must be a live namespaced registry key and a jigsaw structure. With `target=auto`, `minecraft:village_plains` becomes `minecraft_village_plains`.

For an Ancient City, use a fresh target when the automatic name is already occupied:

```text
/iris jigsaw convert overworld minecraft:ancient_city target=minecraft_ancient_city_edit seed=1337
```

This creates and edits a separate Iris graph; it does not mutate Mojang's registered `minecraft:ancient_city`. Keep the source native when only its terrain integration needs changing. To replace natural Ancient Cities with the edited copy, place that Iris target from the dimension and use dimension-level `nativeSuppression: REPLACE_SOURCE`; the converted graph's `vanillaSource` supplies the source key.

Conversion follows the registered start pool and the reachable template pools, templates, connectors, weights, empty entries, and fallbacks. It stores source provenance and fidelity warnings in the ownership manifest. A native list pool entry stays one weighted choice. Iris keeps its recursively first physical template and outer connectors. Additional colocated children and their processors are omitted and recorded as `LIST_ELEMENTS` fidelity loss. A captured template with no non-air states is marked `collidable: false` so its connector-scaffold bounds can overlap an attached physical piece.
Nonempty converted pieces stay collidable.

Conversion does not preserve native placement settings beyond start pool, depth, and maximum distance. Feature pool elements, palette alternatives, processors, entities, and other native-only behavior can be omitted or merely reported. Keep the source native when those capabilities matter. Conversion is add-only and refuses occupied or conflicting targets rather than overwriting them.

## Build a spatial stronghold kit

Spatial projects use the same lifecycle without the planar cell constraints:

```text
/iris jigsaw create overworld stronghold/demo mode=spatial width=32 height=24 depth=32
```

A new spatial project starts with seven owned 15x15x15 variants. They are laid out left to right in one horizontal row. The cells are **0 Connectors**, then **1 Connector** through **6 Connectors**. The connector sequence is cumulative north, south, east, west, up, then down, so each adjacent cell adds exactly one face-center socket. The first cell uses `workcell/spatial`.
Later cells use `workcell/spatial/<piece-key>`. Every cell sits one clear block from the next, and adding, deleting, or resizing variants regenerates the live row without reopening Studio.

The start pool contains all seven variants. The generated pieces pool contains variants 1 through 6 plus an explicit empty terminator.
The connectorless editing piece is excluded because nothing can reach it as a child. Each generated piece defaults to at most 16 placements. Seed `1337` therefore renders a bounded connected blob in the elevated spatial preview instead of one isolated piece.

Right-click the control chest or triple-sneak to select a cell, create another service-named variant, or duplicate the active owned variant. Build inside that variant's dedicated cell and configure its doorway, stair, shaft, floor, or ceiling connectors. Connector blocks are hidden by default, so ordinary blocks and block-entity data stay directly editable at the socket.
**Workcell Settings** can show or reset the saved jigsaw blocks. Spatial connectors may use all 12 front/top orientations the jigsaw block supports.

Studio sizes the shared capacity to contain every reachable object and the horizontal footprint of its cardinal rotations. Automatic capture and per-variant resize still preserve each variant independent exact dimensions. Use **Resize to Capacity** or `/iris jigsaw piece expand` when only the selected object should become the full workcell size. Spatial workcell and variant labels are author metadata.
`cellSize` and labels do not constrain runtime assembly.

Use `ROLLABLE` when the candidate's top direction should not constrain the join, and `ALIGNED` when it must match the source top after rotation. Iris still tries only cardinal Y rotations. A piece with `rotatable: false` is tried only at its authored rotation. The control-chest details view toggles that property, and Studio does not render separate rotation cells. Vanilla-portable variants must stay rotatable, so their GUI toggle is disabled once rotation is enabled.

Create additional owned pools before targeting them from new spatial markers:

```text
/iris jigsaw pool create stronghold/demo/rooms
/iris jigsaw pool create stronghold/demo/end fallbackPoolKey=none
/iris jigsaw rules fallback stronghold/demo/rooms stronghold/demo/end
```

**New Blank Variant** and **Duplicate This Cell's Variant** copy every exact owned pool entry assigned to the loaded source variant. The first creates empty same-sized geometry.
The second copies the source object bytes. Neither selects a first or lexicographically sorted fallback pool. If the workcell has no active owned assigned variant, use `/iris jigsaw piece create <poolKey> <pieceKey>` to choose the pool explicitly.

## Studio workcells and canonical planar display

The surrounding platform uses a four-block checker pattern. Every complete workcell capacity is surrounded by a physical white-concrete edge cage one block outside the editable volume.
Enabled and disabled planar cells use the same material, and participation state stays visible in the GUI and scoreboard. Player-local particle trails outline focused and nearby editable bounds inside those cages, connector direction lines, the permanent live-preview bounds, and the explicit temporary arbitrary-seed diagnostic. No workcell-bound display entity is created.

The first workcell origin is `(16, 65, 16)`. Every workcell's bounds start at Y 65, one block above its floor, and that origin is the displayed object's lowest unsigned corner. Planar projects use six cells in this exact three-by-two order. Each column uses the widest workcell in that column. Each row uses the deepest workcell in that row. One clear block sits between adjacent column and row envelopes. A smaller workcell can therefore have extra open space beside it, because its row and column stay aligned to the largest workcell in that envelope.

| Row | Workcell | Stable ID | Canonical open sides |
|---|---|---|---|
| 1 | Blank | `workcell/blank` | none |
| 1 | End Cap | `workcell/end` | north |
| 1 | Hallway | `workcell/straight` | north and south |
| 2 | L Junction | `workcell/corner` | north and east |
| 2 | T Junction | `workcell/tee` | north, east, and west |
| 2 | Cross Junction | `workcell/cross` | north, east, south, and west |

Every planar footprint at Y 64 is light-gray wool. A one-block-wide red-wool glyph runs from its center toward each canonical side, and the endpoint on that workcell face is a sea lantern. The Blank workcell has no red path or connector cap. A disabled workcell keeps this floor while its translucent cuboid turns red.
It stays selectable and editable but contributes no pieces to assembly or export. Spatial Studio lays every variant out as a dedicated cell in one row. It has no topology glyph or enable toggle. It keeps `workcell/spatial` for its first cell.

The GUI groups planar pieces by rotational topology kind. West, east, south, and north end pieces are all variants of the one End Cap workcell.
East-west and north-south pieces are variants of Hallway. When a variant loads, its source orientation is rotated clockwise into the archetype canonical display. That rotation includes directional block states, connector orientation and position, and connector final state. Capture applies the inverse rotation before writing the original piece and object resources. Pool memberships, weights, dimensions, labels, and the separate underlying piece resources are not merged by this display compaction.

`/iris jigsaw goto <workcell>` accepts a stable ID or the workcell name, case-insensitively. `/iris jigsaw select` selects the cell you are standing in, and simply entering a cell updates your next menu selection. An empty workcell, a read-only variant, an invalid render, incomplete marker hydration, a conflicting operation, or a stale Studio request is not capturable.

### Canonical planar sockets

For a planar piece whose source object dimensions are `X x Y x Z`, every connector must be horizontal. Every connector top must be `UP_POSITIVE_Y`. The canonically rotated object must fit its archetype workcell. Width and depth need not be equal. Integer division is floor division.

| Side | Position | Direction | Top |
|---|---|---|---|
| North | `(X / 2, Y / 2, 0)` | `NORTH_NEGATIVE_Z` | `UP_POSITIVE_Y` |
| East | `(X - 1, Y / 2, Z / 2)` | `EAST_POSITIVE_X` | `UP_POSITIVE_Y` |
| South | `(X / 2, Y / 2, Z - 1)` | `SOUTH_POSITIVE_Z` | `UP_POSITIVE_Y` |
| West | `(0, Y / 2, Z / 2)` | `WEST_NEGATIVE_X` | `UP_POSITIVE_Y` |

New blank planar variants inherit the active source variant's exact dimensions and use those dimensions for these positions. Workcell capacity changes never rewrite sockets or object bytes. **Variant Size** and `variant resize` change only the selected owned object and move its canonical sockets to the new face centers.
**Resize to Capacity** is the one-click version of the same thing.

Planar mode is a horizontal topology and validation contract, not a global wave-function-collapse solver. It does not backtrack across an entire map.

## Marker capture and connector rules

Jigsaw markers are real `minecraft:jigsaw` blocks while you edit. Saving reads their tile data and orientation and stores connectors in `jigsaw-pieces/<key>.json`.
The marker itself is not retained as a jigsaw block in the `.iob`.

| Connector field | Studio source | Runtime rule |
|---|---|---|
| `position` | Marker offset from the workcell origin, inverse-rotated to source orientation during planar capture | Must be inside the object's unsigned `0..size-1` bounds |
| `direction` | Jigsaw block front | Candidate must face the reverse direction after rotation |
| `top` | Jigsaw block top | Must also match after rotation when the source joint is `ALIGNED` |
| `pool` | Mojang Pool | UI value must be `iris:<owned-pool-key>`. Studio strips `iris:` and stores the internal pool used to choose the next piece |
| `name` | Mojang Name | Identity this connector exposes to a source connector |
| `targetName` | Mojang Target name | Must equal the candidate connector's stored `name` exactly. Matching is case- and whitespace-sensitive at runtime, while Studio marker capture trims both values |
| `channel` | `/iris jigsaw connector channel <channel\|none>` on a saved marker's exact local position | Values match exactly, including case and whitespace. Empty matches only empty, and any non-empty value blocks vanilla export |
| `joint` | Mojang Joint | `ROLLABLE` ignores candidate top. `ALIGNED` requires it to match |
| `finalState` | Mojang Final state | Canonical block state written into the `.iob` at the marker cell. `minecraft:structure_void` leaves the cell absent, while explicit air remains an authored block state |
| `selectionPriority` | Mojang Selection priority | Signed integer. Higher-priority connectors within one piece are processed first, and ties keep authored order |
| `placementPriority` | Mojang Placement priority | Signed integer on the source connector. Higher-priority attached child pieces expand first, and ties keep attachment order |

Mojang's jigsaw UI has no field for the Iris `channel`. Let autosave capture the marker, look directly at it from within eight blocks in the loaded workcell, then run `/iris jigsaw connector channel <channel|none>`. The command maps the canonical display coordinate back to the source piece coordinate and transactionally updates that exact saved connector. It rejects a workcell with no active owned variant, a missing connector offset, whitespace inside a channel, and channels longer than 128 characters. It trims outer whitespace, `none` clears the channel, and all remaining characters keep their exact case. Runtime matching never trims either side, so whitespace in schema-authored data stays significant even though this command cannot author it. Reopen Studio to refresh the workcell and particle diagnostics. A non-empty update is rejected without a write in `VANILLA_PORTABLE`.
Vanilla marker fields stay owned by Mojang's UI and ordinary capture.

`final_state` must be a valid canonical Minecraft block state. Use `minecraft:structure_void` for an absent cell in a portable template, and the exact solid block state when the connector should leave a block behind. A final state of air is accepted and retained explicitly by capture, so it is not the same as an absent cell.

## How assembly chooses pieces

1. Iris selects one declared structure theme by positive relative weight. With no declared themes the assembly is unthemed, and a piece with no theme list is eligible for every selected theme.
2. It filters the start pool by enabled planar workcell, selected theme, and depth and placement rules, then rolls each exact pool membership's independent chance. No passing membership is an intentional empty result, and an explicit `empty: true` winner also produces no structure.
3. It chooses one positively weighted passing start entry and applies a random cardinal rotation when the piece is rotatable. A terminal start is placed but does not expand.
4. It processes connectors on the current piece in descending `selectionPriority` order. For each connector it filters the primary pool by enabled workcell, theme, depth, maximum placements, terminal requirement, and chance. It then tries passing entries in weighted random order. An eligible piece can still fail because its connectors are incompatible, it collides, or it exceeds bounds.
5. When any eligible entry still needs its declared minimum placement count, those required entries take precedence over other entries. After expansion, an unmet graph-wide minimum produces `FAILED_RULES` rather than silently accepting the assembly.
6. A candidate connector is compatible when source `targetName` exactly equals candidate `name`. Source `channel` must exactly equal candidate `channel` with case and whitespace preserved. The faces must oppose after rotation. An `ALIGNED` source also needs a matching top direction.
7. Two pieces whose `collidable` values are both `true` may not have overlapping bounding boxes. A piece with `collidable: false` neither blocks nor is blocked by another piece, but every piece must still stay inside `maxSizeChunks x 16` blocks of the assembly origin. Attached children are queued by the source connector's signed `placementPriority`, and Iris finishes one piece's connectors before expanding its children.
8. Before maximum depth, Iris tries the primary pool and then that pool's one direct fallback.
At maximum depth it skips the primary and tries only the direct fallback. An allowed explicit empty entry or an empty primary pool ends the branch immediately and does not continue into the fallback. When structure `requireCaps` or pool `mandatoryFallback` is true, the direct fallback must place a compatible terminal piece and an empty entry cannot satisfy it. Otherwise ordinary primary-plus-fallback exhaustion returns `FAILED_UNCAPPED` under `FAIL_ASSEMBLY`, or ends only that connector branch under `TERMINATE_BRANCH`. A fallback's own fallback is never traversed in the same selection. The runtime hard cap is 512 pieces.

The compiler reports missing resources, invalid workcells, bounds, connectors, themes, chances, and rules. It also reports fallback cycles, unreachable resources, uncappable required connectors, incompatible candidates, and sampled hard-cap failures. Studio reevaluates automatically after open and after every committed mutation. `status`, the scoreboard, and the control GUI already show the current evaluation. You do not need a separate validation action.

## Commands and transactional ownership

`/iris jigsaw` aliases are `/iris jig` and `/iris jgs`. The tree is player-only and Bukkit-only, and all commands use the root `iris.all` permission.

The create/open `<key>` is the root structure's internal lowercase resource path, not a display name or a namespaced ID. `village/demo` maps to `structures/village/demo.json`, is referenced as `"village/demo"` by Iris placements, and is reused by `open`, `edit`, and `reopen`. Pool and piece keys use the same grammar: one or more slash-separated segments containing only `a-z`, `0-9`, `.`, `_`, or `-`, such as `village/demo/hall`. Only the marker UI adds the required `iris:` namespace to pool keys.

| Command | Behavior |
|---|---|
| `create <dimension> <key> [mode=planar] [compatibility=iris] [width=15] [height=15] [depth=15] [seed=1337]` | Add-only atomic creation of a complete owned graph followed by an open request. `mode` completes `planar`/`spatial`. `compatibility` completes `iris`/`vanilla`. Existing keys complete for `open`/`edit`/`reopen`. Planar X/Z are `3..128`. Spatial X/Z are `1..128`. Y is `1..192`. One workcell volume is at most `2,097,152` |
| `convert <dimension> <registered-key> [target=auto] [seed=1337]` | Add-only conversion of one live registered vanilla/datapack jigsaw into an owned Iris graph, followed by Studio open. Aliases `import`, `import-vanilla` |
| `adopt inspect <dimension> <source> [target=auto] [strategy=auto]` | Asynchronously inspect a complete existing Iris closure and issue a 15-minute, hash-pinned `IN_PLACE`, `CLONE_REQUIRED`, or `BLOCKED` plan. `strategy` completes `auto`, `in-place`, or `clone` |
| `adopt apply <planId>` | Revalidate and atomically apply a plan owned by that player, then open the target with seed `1337`. No Studio may be active or opening |
| `open <dimension> <key> [seed=1337]` | Map an existing graph into compact workcells. Aliases `edit` and `reopen`. Another owner, dirty work, or a conflicting lifecycle operation blocks replacement |
| `close [discard=false]` | Close the transient Studio. Refuses active autosave/load/graph work or a pending dirty capture unless `discard=true` deliberately abandons it |
| `status` | Show structure, mode, compatibility, selected workcell dimensions and enabled state, variant count, whether autosave is pending, and the seed-`1337` evaluation/theme/piece result |
| `menu` | Open the same workcell/variant/rules/toolbox GUI as the control chest or triple-sneak gesture |
| `select` | Select the workcell containing the player |
| `goto <workcell>` | Select and teleport above a stable workcell ID. Alias `teleport` |
| `particles <visible>` | Toggle player-local workcell-bound, connector, live-preview, and temporary assembly-preview particle trails |
| `save [bay=selected]` | Flush automatic capture now for one dirty ready workcell. Ordinary block and container changes already schedule this |
| `connector channel <channel\|none>` | Look at a saved marker in the active owned workcell within 8 blocks and set or clear its Iris-only channel at the inverse-mapped source position. Reopen to refresh the workcell and particles |
| `bounds <width> <height> <depth>` | Set the selected workcell capacity without rewriting any variant object. All variants must fit, and the live aligned layout regenerates and rehydrates without close/reopen. Aliases `cell`, `resize` |
| `workcell capacity <width> <height> <depth>` | Explicit nested form of `bounds`. Planar capacity belongs to one canonical archetype, and spatial capacity is the shared envelope for its one-row variant cells |
| `workcell label <displayName>` | Set the selected workcell's author-facing label. Quote spaces. Canonical solver identity is unchanged |
| `workcell label-reset` | Reset the selected workcell to its canonical solver label. Alias `reset-label` |
| `pool create <poolKey> [fallbackPoolKey=none]` | Create a new empty owned pool. A non-`none` fallback must already be owned by this project |
| `piece create <poolKey> <pieceKey> [weight=1]` | Create and load a new owned variant. Planar derives canonical connectors from the contextual workcell, spatial creates a connectorless blank |
| `piece add <poolKey> <pieceKey> [weight=1]` | Re-add and load an existing piece/object already owned by this project |
| `piece remove <poolKey>` | Remove the active variant from that pool without deleting its owned piece/object resources |
| `piece rotatable <true\|false>` | Persist whether the active variant may use cardinal rotations. Portable sessions reject `false` |
| `piece expand` | Resize only the selected planar or spatial owned variant exactly to workcell capacity. Planar sockets move to the resized faces |
| `variant weight <poolKey> <weight>` | Set every matching entry for the active variant in that owned pool. Weight must be positive |
| `variant resize <width> <height> <depth>` | Resize only the active owned variant within workcell capacity. A safe shrink rejects cropped content and the active cell reloads in place |
| `variant label <displayName>` | Set the active variant's author-facing label. Quote spaces |
| `variant label-reset` | Reset the active variant to its resource-key fallback. Alias `reset-label` |
| `variant duplicate` | Copy the active variant's object bytes, metadata, and exact pool memberships into one new variant in this workcell |
| `variant duplicate-family [themeKey=next]` | Atomically clone every enabled workcell's active owned variant into one coherent Iris family and load the complete family. Alias `family` |
| `rules limits <maxDepth> <maxSizeChunks>` | Atomically set expansion depth and horizontal radius. Portable sessions enforce `<=20` and `<=8` |
| `rules fallback <poolKey> <fallbackPoolKey\|none>` | Atomically set or clear one owned pool's direct fallback after compiling the complete graph |
| `preview goto` | Teleport above the permanent seed-`1337` block preview. Alias `teleport` |
| `preview assemble [seed=1337]` | Compute a deterministic read-only assembly at the player coordinates. Report its complete piece count. Show in-range bounds as purple particles for 10 seconds within the shared particle budget. Place no blocks |
| `export [namespace=iris] [output=jigsaw-export] [format=zip] [replace=false]` | Start a background strict export of the clean on-disk graph as a Minecraft 26.2 directory or zip. Completion is reported with the originating structure key |
| `delete [confirm=false]` | With `confirm=true`, inspect reverse references, close Studio, and atomically remove the complete hash-pinned owned project. External references or changed ownership bytes block deletion. Alias `remove` |

The control chest is the primary workflow. Its six-row GUI rechecks the exact Studio request before every callback. It manages workcell capacities and labels, per-variant dimensions and labels, enabled states, and rotation. It also manages pool-entry weights and chances, themes, piece rules, mandatory caps, automatic evaluation, preview navigation, toolbox sticks, and destructive deletion. **Duplicate This Cell's Variant** creates one independent variant.
**Duplicate All Enabled Cells as Family** clones and atomically loads one matching variant across every enabled cell. Accepted asynchronous actions close the GUI while work runs. Variant geometry and details are editable only for owned variants, and building and capture apply only to the loaded variant.

The Toolbox issues schema-`2` named sticks bound to the exact request, workcell, variant, and membership. Rename a variant or workcell stick in an anvil, right-click to apply its trimmed label, or sneak-right-click to reset. Labels allow at most 64 Unicode code points and reject control characters and section-sign formatting. Schema-`1` sticks and bindings from a closed or replaced request are stale. The active variant icon is a jigsaw block. A valid evaluation is an emerald. Lime dye is used only for the explicitly labeled theme-membership toggle.

### Ownership model

Studio tracks the files it owns. Do not edit them by hand while the project is open. Outside changes cause an ownership conflict and are left untouched. Keep a pack backup because Studio has no general world-edit undo.

### Dirty tracking and platform notes

Wait for a clean status before reloading, shutting down, switching variants, or closing Studio. One player owns the active Jigsaw Studio project. Other players cannot edit its workcells, controls, or preview.

### Capacity and per-variant object size

`bounds` and `workcell capacity` target the selected workcell. Planar workcells persist independent width, height, depth, enabled state, and display label.
Spatial mode persists one shared `cellSize` plus `spatialWorkcellDisplayName`. Planar capacity width and depth are `3..128`, spatial width and depth are `1..128`, height is `1..192`, and volume is at most `2,097,152`. Capacity is an upper bound for every variant in that workcell. A successful capacity change updates only structure JSON. It verifies the complete graph. It leaves every object byte unchanged. It regenerates and rehydrates the affected live layout. It teleports the owner to the selected cell new horizontal center when that cell moves. A failed live regeneration restores the prior layout and requires reopen only as an explicit recovery boundary.

`variant resize` and the **Variant Size** screen target one owned variant. The requested width, height, and depth must fit its workcell capacity. Growth and shrink preserve blocks and tiles at their in-bounds canonical coordinates. They account for rectangular source rotations. They relocate each planar canonical connector and its stored block payload to the new face center. Shrink is lossless only. Any stored block (including explicit air) or tile outside the target rejects the transaction. A connector destination collision, unsafe connector tile data, a read-only object, or an object shared by another piece also rejects it. No authored file changes in that case. New growth volume is air. A loaded variant reloads in place after commit, and siblings keep their dimensions and bytes. Marker block-entity data is applied on its owning region before Iris verifies either the candidate or its rollback. A live resize cannot reject a valid marker just because its NBT merge was deferred to the next tick.

Spatial capacity changes only the shared workcell envelope and rejects dimensions that do not contain every variant object. **Resize to Capacity** and `/iris jigsaw piece expand` change one selected spatial or planar object exactly to that envelope. The exact-size editor also permits a safe lossless shrink. Non-connector air and `minecraft:structure_void` cells are omitted from block entries.
Explicit authored air and connector final-state air stay distinct and are preserved.

## Resource reference

### Structure: `structures/<key>.json`

```json
{
  "startPool": "village/demo/start",
  "maxDepth": 7,
  "maxSizeChunks": 8,
  "mode": "PLANAR_JIGSAW",
  "compatibility": "IRIS_EXTENDED",
  "branchFailurePolicy": "FAIL_ASSEMBLY",
  "cellSize": {"x": 15, "y": 15, "z": 15},
  "spatialWorkcellDisplayName": "",
  "planarWorkcells": [
    {"displayName": "", "archetype": "BLANK", "width": 3, "height": 3, "depth": 3, "enabled": true},
    {"displayName": "Village Entrances", "archetype": "END", "width": 16, "height": 8, "depth": 16, "enabled": true},
    {"displayName": "", "archetype": "STRAIGHT", "width": 16, "height": 3, "depth": 3, "enabled": true},
    {"displayName": "", "archetype": "CORNER", "width": 3, "height": 3, "depth": 3, "enabled": true},
    {"displayName": "", "archetype": "TEE", "width": 3, "height": 3, "depth": 3, "enabled": true},
    {"displayName": "", "archetype": "CROSS", "width": 3, "height": 3, "depth": 3, "enabled": true}
  ],
  "themeSets": [
    {"key": "variant-1", "weight": 1}
  ],
  "requireCaps": false,
  "placeMode": "STRUCTURE_PIECE",
  "edit": [],
  "loot": []
}
```

| Field | Default / range | What it does in world |
|---|---|---|
| `startPool` | required | Everything grows out of whatever piece this pool produces first |
| `maxDepth` | `7`, range `1..30` | How many connector hops the assembler may chain outward before it stops adding rooms. Higher values make sprawling settlements and cost more generation time |
| `maxSizeChunks` | `8`, range `1..32` | A hard leash: no piece may sit further than this many chunks (times 16 blocks) from the start, no matter how much depth is left |
| `mode` | Hand-authored schema fallback `SPATIAL_JIGSAW`. Studio `create` default `PLANAR_JIGSAW` | `PLANAR_JIGSAW` forces every piece onto a flat grid with face-center sockets and validates that shape. `SPATIAL_JIGSAW` lets pieces stack and branch in three dimensions |
| `compatibility` | `IRIS_EXTENDED` | `VANILLA_PORTABLE` locks the graph down to what vanilla jigsaw resources can express, which is what makes datapack export possible |
| `branchFailurePolicy` | `FAIL_ASSEMBLY` | Decides what a dead-end arm costs you. Throw away the whole structure, or leave a stub where that arm stopped. `TERMINATE_BRANCH` is required for vanilla portability |
| `cellSize` | `15 x 15 x 15`. Studio X/Z `1..128`, Y `1..192`, volume `<=2,097,152` | The editing volume for spatial cells, and the uniform editing volume for a legacy planar graph that has no `planarWorkcells`. It does not constrain runtime assembly |
| `spatialWorkcellDisplayName` | empty | Text shown over the spatial editing cell. Empty shows `Spatial` |
| `planarWorkcells` | Six unique archetypes. Width/depth `3..128`, height `1..192`, volume `<=2,097,152`. `displayName` empty | How large each connector shape may be built. What it is called in the GUI. Whether pieces of that shape are allowed into assemblies and exports at all |
| `themeSets` | Empty means implicit unthemed. Positive unique key weights | Splits the kit into visual families so one assembly comes out all-stone or all-timber instead of a mix. The weight is that family's share of assemblies |
| `requireCaps` | `false` | Forces every open doorway to be closed off with a real terminal piece instead of being left hanging |
| `placeMode` | `STRUCTURE_PIECE` | How each piece object meets the ground when stamped |
| `edit` | empty | Block find-and-replace applied across every piece, for reskinning a kit without re-authoring objects. Not portable |
| `loot` | empty | Loot tables injected into containers the pieces place. Not portable |
| `vanillaSource` | empty | Records which registered structure this graph was imported from. Not something you author |

`rules limits` owns `maxDepth` and `maxSizeChunks`. `rules fallback` owns direct pool fallback. The GUI owns workcell capacity and labels, theme weights, `requireCaps`, per-piece size, labels, themes and rules, chance, rotation, and deletion. `connector channel` owns a saved connector's Iris-only channel. Rules with no in-game control (`branchFailurePolicy`, `placeMode`, structure `edit`, structure `loot`, pool `mandatoryFallback`, and empty entries) stay schema-backed JSON fields. Transaction-owned projects reject outside resource edits on the next mutation, so use the Studio controls or recreate/adopt the project through an ownership-aware workflow.

### Pool: `jigsaw-pools/<key>.json`

```json
{
  "pieces": [
    {"piece": "village/demo/hall", "weight": 4, "chance": 0.75, "empty": false},
    {"weight": 1, "chance": 1.0, "empty": true}
  ],
  "fallback": "village/demo/end",
  "mandatoryFallback": false
}
```

`weight` must be positive. `chance` is a finite `0..1` value that independently gates that exact membership before weighting.
Zero never passes and one always passes.

An `empty: true` entry canonically omits `piece`, though omitted and blank piece keys are both accepted for existing graphs. It terminates its branch only when empty termination is allowed, and it stops later primary or fallback candidates from being tried.

`fallback` names one direct pool tried after ordinary primary failure, or used alone at maximum depth.
Its own fallback is not chained into the same selection. A pool with no entries terminates when no fallback is required and does not continue into its declared fallback. `mandatoryFallback: true` applies the physical-terminal requirement to this pool even when structure `requireCaps` is false.

Native conversion never rewrites a start-pool member as empty and never omits it solely because it has no connectors. Every non-start connectorless member in a pool with a distinct fallback also stays physical, so weighted failed primary attachments still reach that fallback. Conversion emits `empty: true` only when a non-start pool has one all-air connectorless source member and either no fallback or a self-fallback. The same all-air connectorless member in a mixed no/self-fallback pool is omitted. Iris records an explicit selection-weight and RNG-consumption fidelity loss. It does not become an empty choice that could cut off later valid candidates. Other connectorless nonempty members in no/self-fallback non-start pools are omitted as inert with exact block, fallback, selection-weight, and RNG-consumption loss. Converted native graphs set `branchFailurePolicy: TERMINATE_BRANCH`, so ordinary optional candidate exhaustion ends only that connector branch.

### Piece: `jigsaw-pieces/<key>.json`

```json
{
  "object": "village/demo/hall",
  "displayName": "Market Hall",
  "connectors": [
    {
      "position": {"x": 8, "y": 8, "z": 0},
      "direction": "NORTH_NEGATIVE_Z",
      "top": "UP_POSITIVE_Y",
      "pool": "village/demo/start",
      "name": "iris:planar",
      "targetName": "iris:planar",
      "channel": "",
      "joint": "ALIGNED",
      "finalState": "minecraft:structure_void",
      "selectionPriority": 0,
      "placementPriority": 0
    }
  ],
  "rotatable": true,
  "collidable": true,
  "themes": ["variant-1"],
  "rules": {
    "minimumDepth": 0,
    "maximumDepth": 30,
    "minimumPlacements": 0,
    "maximumPlacements": 0,
    "terminal": false
  }
}
```

Positions are unsigned object coordinates, so `(0,0,0)` is the object's minimum corner. The referenced `.iob` is the geometry source and owns this variant's exact width, height, and depth.
Studio materializes connector markers only in the authoring world.

| Field | Default / range | What it does in world |
|---|---|---|
| `object` | required | The blocks this piece stamps |
| `displayName` | empty, at most 64 code points | Label shown in the Studio GUI. Falls back to the piece key's final segment |
| `connectors` | empty | Where other pieces may attach, which way they face, and which pool they come from |
| `rotatable` | `true` | Lets the assembler spin the piece to cardinal Y rotations so it can meet a connector. `false` pins it to the orientation you built |
| `collidable` | `true` | Whether this piece's volume reserves space against other pieces. Set `false` only for a connector scaffold meant to sit inside a physical piece |
| `themes` | empty | Which visual families may use this piece. Empty makes it usable by every family |
| `rules.minimumDepth` / `rules.maximumDepth` | `0` / `30`, range `0..30` | Keeps a piece out of the town square or out of the far outskirts. The start piece is depth zero |
| `rules.minimumPlacements` | `0`, range `0..512` | Forces at least this many copies to exist, so a required well or church is not missing. An unmet minimum fails the assembly |
| `rules.maximumPlacements` | `0`, range `0..512` | Caps how many copies appear. `0` means unbounded within the 512-piece safety cap |
| `rules.terminal` | `false` | Marks the piece as a dead end: it can be placed on a connector but never opens new ones |

## Natural placement

Place an Iris jigsaw by adding an `IrisStructurePlacement` object to `structures[]` on a dimension, region, or biome. Surface-biome placements apply where that surface biome owns the start chunk. A cave biome contributes only placements whose resolved anchor is one of the cave modes. Region and dimension placements stay broader scopes.

```json
{
  "structures": [
    {
      "structures": ["village/demo"],
      "placementId": "village-demo-surface",
      "distribution": "RANDOM_SPREAD",
      "spacing": 32,
      "separation": 8,
      "salt": 165745296,
      "anchor": "SURFACE",
      "minHeight": -64,
      "maxHeight": 320,
      "terrain": {"mode": "SOURCE"},
      "underwater": false
    }
  ]
}
```

| Placement rule | Fields | Behavior |
|---|---|---|
| Random spread | `spacing`, `separation`, `salt` | One deterministic attempt per spacing grid cell. `spacing` must exceed `separation` |
| Density | `density` | Independent deterministic per-chunk probability `0..1` |
| Concentric rings | `ringCount`, `ringDistance`, `ringSpread` | Stronghold-like deterministic rings around world origin |
| Surface | `anchor: SURFACE` | Surface Y must pass the inclusive `minHeight..maxHeight` gate |
| Height band | `anchor: HEIGHT_BAND` | Deterministic random Y inside the inclusive band |
| Legacy | `anchor: LEGACY` | `underground=false` resolves to `SURFACE`. `underground=true` resolves to `HEIGHT_BAND` |

`placementId` is the stable authored identity used for distribution. Set it when multiple placements share the same structure, or when you want unrelated field and list reordering to leave existing starts where they are. A placement listing several `structures` keys chooses one uniformly.
Pool weights control pieces inside the chosen graph, not world-level start frequency.

Only newly generated chunks use a changed placement. Direct `/iris structure place` and the Jigsaw Studio preview prove nothing about spacing, biome scope, height gates, or natural generation.

### Cave anchors

```json
{
  "structures": [
    {
      "structures": ["stronghold/demo"],
      "placementId": "stronghold-demo-deep-caves",
      "distribution": "RANDOM_SPREAD",
      "spacing": 24,
      "separation": 8,
      "salt": 984211,
      "anchor": "CAVE_FLOOR",
      "minHeight": -48,
      "maxHeight": 80,
      "caveBiomes": ["carving/deep"],
      "caveAnchorAttempts": 12,
      "caveAnchorScanStep": 1,
      "caveMinimumClearance": 5,
      "terrain": {"mode": "PRESERVE"}
    }
  ]
}
```

| Anchor | Required carved-space geometry | Assembly alignment |
|---|---|---|
| `CAVE_FLOOR` | Solid/non-carved cell immediately below plus an upward carved run | Lowest assembled piece bound moves to the anchor Y |
| `CAVE_CEILING` | Solid/non-carved cell immediately above plus a downward carved run | Highest assembled piece bound moves to the anchor Y |
| `CAVE_CENTER` | Candidate is the actual midpoint of its contiguous carved cavern run, which must meet the clearance requirement | Assembly bounding-box midpoint moves to the anchor Y |
| `CAVE_ANY` | A clearance-sized carved run is centered around the candidate | Assembly bounding-box midpoint moves to the anchor Y |

Iris tests up to `caveAnchorAttempts` deterministic, unique X/Z columns in the start chunk and scans the clipped `minHeight..maxHeight` band in increments of `caveAnchorScanStep`. It stops at the first column with matches and chooses deterministically among all valid anchors in that column. Runtime clamps attempts to `1..64`, scan step to `1..16`, and clearance to `1..64`, and visits at most 64 of the chunk's 256 columns. `caveMinimumClearance` is the required vertical carved run. Empty `caveBiomes` accepts any resolved cave biome.
Otherwise trimmed, case-normalized keys with or without a namespace are rechecked against the cave/mantle biome at the actual X/Y/Z anchor.

On a structure placement, `underwater: true` **allows** submerged starts and `false` skips them. That is the opposite of object placement, where `underwater: true` means seafloor-only. See [35 - Vanilla Passthrough](/iris/35-vanilla-passthrough).

For cave anchors, `underwater` checks composed cavern state at the actual anchor rather than the surface ocean height. A null or non-cavern cell never qualifies. With `underwater: false`, ordinary cavern air must be above the dimension `caveLavaHeight`. Explicit water and lava are rejected. Forced-air cavern matter stays dry even below that threshold. With `underwater: true`, ordinary fluid cavern cells are allowed. Every hydrology-owned mantle cell, including wet cells, dry headroom, and seal guards, rejects anchors because a later structure stamp could breach the accepted containment footprint; see [36 - Rivers](/iris/36-rivers).

Cave placement scope is sampled at the start chunk's center. A cave-biome `structures[]` list contributes cave anchors only.
Region and dimension placements stay broader, and a placement-level `caveBiomes` list revalidates the actual anchor. Lookup uses existing Iris carved-space mantle data, so a locator cannot resolve an ungenerated distant cave anchor until terrain generation has produced that mantle.

The anchor test reads one vertical `MatterCavern` column, not the complete assembled volume, so `SOURCE` and `PRESERVE` can leave pieces intersecting cave walls. Use `BORE` or `FORCE_CARVE` when the structure must create a reliable envelope, or inspect the full volume in gameplay when preserving the cave. Cave anchors apply to editable Iris `structures`, not the `nativeStructures` backend.

## Vanilla datapack export

Create the project with `compatibility=vanilla`, then keep the graph inside the strict subset below. An existing graph is exportable only when its saved compatibility is `VANILLA_PORTABLE` and its branch policy is `TERMINATE_BRANCH`.
Studio has no compatibility-toggle or branch-policy control. A vanilla-compatible Studio project writes that policy and omits the default Iris theme and terminal-rule metadata.

Export reads the committed graph, not pending workcell blocks. Wait for autosave to finish and confirm the automatic evaluation is no longer `PENDING`, `STALE`, or `INVALID`:

```text
/iris jigsaw export namespace=demo output=village-demo format=zip replace=false
```

Output is written under `<Iris data>/packs/exports/`. Compilation, NBT encoding, compression, and publication run off the server thread. Wait for the final result. Do not treat the initial background-start message as success. One player cannot start a second export while their first is running, and the same normalized output cannot be published by two concurrent commands. Completion names the originating structure even if that Studio was closed or replaced while export was running.

`output` is one direct artifact name. It must be 1-128 characters, start with a letter, number, `_`, or `-`, and then use only letters, numbers, `.`, `_`, or `-`. Leading and trailing whitespace, `.`, absolute paths, slashes and backslashes, nested paths, and traversal names are rejected before export runs. `format=zip` adds `.zip` when needed. The publisher stages the complete directory or zip and replaces the destination atomically only when `replace=true`.
An existing output is otherwise rejected.

The command emits a Minecraft 26.2 datapack. Its `pack.mcmeta` uses `min_format: [107, 1]` and `max_format: 107`. It also includes a default `minecraft:plains` biome tag and an empty processor
list. It includes template pools, compressed structure-template NBT, one jigsaw
worldgen structure, and one random-spread structure set. Command-level export defaults:

| Vanilla setting | Export default |
|---|---|
| Biomes | `minecraft:plains` |
| Start height | absolute `0`, projected to `WORLD_SURFACE_WG` |
| Generation step | `surface_structures` |
| Terrain adaptation | `none` |
| Expansion hack | `false` |
| Maximum vertical distance | `4064` |
| Structure-set placement | random spread: spacing `32`, separation `8`, salt `0`, frequency `1`, linear spread |

### Strict export blockers

Export fails rather than dropping or approximating any of these:

- Structure compatibility is not `VANILLA_PORTABLE`.
- Structure `branchFailurePolicy` is not `TERMINATE_BRANCH`.
- Structure themes, piece theme membership, non-default depth/placement/terminal rules, structure `requireCaps`, pool `mandatoryFallback`, or a membership `chance` other than `1` are present.
- `placeMode` is not `STRUCTURE_PIECE`, or structure-wide `edit` or `loot` is non-empty.
- `maxDepth` is outside `1..20`, or `maxSizeChunks x 16` exceeds Minecraft's 128-block horizontal limit.
- A piece has `rotatable: false`.
- A piece has `collidable: false`.
Vanilla templates have no per-piece collision flag.
- A pool weight is outside `1..150`.
- A resource key, connector name or target, namespace, orientation, block state, or final state is not vanilla-valid.
- A connector is invalid if it has a non-empty Iris channel. It is also invalid if it duplicates another connector position. It is also invalid if `finalState` does not exactly match the `.iob` block at that cell (`minecraft:structure_void` for an absent cell).
- An object contains tile payloads, a block entity, a custom-content block, or retained `jigsaw`, `structure_block`, or `structure_void` marker blocks.

The exporter does not export tile or block-entity NBT. A chest, spawner, sign, or other tile-bearing object blocks strict export even though it works fine inside Iris. The command exposes only namespace, one direct output filename, directory or zip format, and the replacement choice.
Biome, height projection, generation step, terrain adaptation, and structure-set placement stay at the fixed defaults above. Edit the emitted datapack afterward if those defaults are not the vanilla placement you want.

Test the exported artifact on an unmodded Minecraft 26.2 server or client. Stop the disposable world. Install the pack in that world `datapacks/`. Restart so the worldgen registries load it. Confirm it is enabled without data errors. Locate `<namespace>:<resourcePath>`. Generate fresh chunks around the located start. `/reload` can list a newly copied pack as enabled without registering its worldgen structure in the running world. It is not a substitute for the restart. Iris validation and NBT round-trip tests do not substitute for the vanilla load and generation check.

## Content unavailable on this Minecraft version

A jigsaw graph authored on a newer Minecraft may use objects containing blocks an older server does not have. Iris checks the object palettes against the live registry when the pack loads and removes the affected graph nodes in a cascade. There are no version fields; see [25 - Pack Management](/iris/25-pack-management) for the gate, the startup listing, and `/iris pack compat`.

| Level | Rule |
|-------|------|
| Piece | A piece whose `object` needs a block the server does not have is excluded, unless a dimension `blockFallbacks` entry or a per-entry `backup` covers the block |
| Pool | Every pool entry naming an excluded piece is dropped. Weighting and `chance` are evaluated over what is left. A pool whose entries are all dropped is excluded |
| Structure | A structure whose start pool is excluded is excluded, and every structure placement referencing it drops the reference |

A dropped pool entry changes the weight distribution of that pool, so a graph that loses pieces assembles differently on the older version rather than failing. `empty: true` entries and `fallback` pools are unaffected unless their own pieces are excluded. An excluded structure simply never places; the biomes and regions that listed it keep generating.

Pack validation loads every piece, pool and structure through the gate, so a structure left without a usable start pool is reported at startup (`excluded structure <key> at start pool <pool> is unavailable`) rather than at first generation. During assembly an excluded piece is never drawn, and a pool whose pieces are all excluded ends its branch instead of failing the assembly.

## Failure recovery

| Symptom | Meaning | Recovery |
|---|---|---|
| Create reports occupied/conflicting files | Add-only ownership refused to overwrite existing resources | Choose a new structure key, or deliberately remove/migrate the old graph outside this workflow |
| Create reports success but Studio does not open | The complete graph was created before the follow-up open request hit another owner, pending autosave, or a lifecycle transition | Resolve the active Studio guard, then run `open` for the new structure. Do not rerun `create` against its now-owned files |
| A loaded variant is Read-only | Its graph is unowned or has managed datapack provenance | Close Studio, run `adopt inspect`, review the disposition and diagnostics, then apply the plan. Managed input must use a clone target |
| Adoption plan is expired, unknown, or stale | Its 15-minute in-memory plan was consumed or expired, or a pinned source/target changed | Run `adopt inspect` again and review the new plan. No stale plan is written |
| Conversion refuses the source | The key is absent, is not a live registered jigsaw, has an incomplete graph, or the add-only target is occupied | Keep it native, choose a valid registered jigsaw, repair its source datapack, or choose a new target. Use `/iris structure import` for non-jigsaw templates |
| Ownership conflict on capture/edit | An owned file changed outside the last committed transaction | Restore the exact owned graph from version control or backup. Studio will not overwrite the mismatch |
| Close refuses with pending work | An owned workcell is dirty or autosave/graph work is running | Wait for autosave, use **Flush Autosave Now** to expedite it, or use `discard=true` only when losing pending edits is deliberate |
| An external plugin edit is not captured | The plugin bypassed Bukkit's covered mutation events | Have the integration call `JigsawStudioService.markDirty(...)` for affected coordinates or `markAllDirty(...)`. Autosave then follows normally |
| Autosave has no active/editable variant | The workcell is empty or its loaded variant is read-only | Load an owned variant, or adopt/clone the graph first |
| Autosave reports Loading, Invalid, or not hydrated | Variant materialization or real jigsaw block-entity hydration is incomplete or failed | Wait for completion, reopen or reload the variant, and do not build until the scoreboard reports a stable state |
| Capacity succeeds but live regeneration reports a failure | The metadata committed, but one owning-region repaint or hydration step failed | Close and reopen Studio before editing. The persisted capacity remains authoritative |
| Autosave says a chunk is not loaded | Part of the capture volume is unloaded | Visit or load the whole workcell. The autosave retry stays pending, or use **Flush Autosave Now** after loading it |
| Multi-chunk autosave aborts | An owning-region schedule or snapshot failed, a chunk unloaded, Studio changed, marker/tile capture failed, or aggregation was incomplete | Keep the complete capture volume loaded and fix the reported cause. No graph file is written from a partial capture |
| Marker capture fails | Marker NBT is incomplete, the final state is invalid, or active NMS cannot serialize the tile | Fix the named marker field, or use the matching supported Bukkit/NMS build |
| The chest GUI closes after an action | The accepted operation is asynchronous and the GUI does not live-refresh | Wait for its player message, then right-click the chest again |
| A named stick stops working | It uses schema `1`, its request ID belongs to a closed or replaced Studio, or the bound workcell/variant/pool entry changed | Discard the stale stick and take a schema-`2` replacement from the current Toolbox |
| A queued duplicate cancels | The Studio request/session or one pinned source variant changed before autosave completed | Reopen the current controls, confirm the intended loaded source variants, and request the duplicate again |
| Another player cannot edit or run a mutating command | The active Jigsaw Studio belongs to its activation owner | Have the owner do the work or close the Studio. Do not bypass world protection |
| Evaluation is `STALE` | A workcell edit is waiting for autosave | Wait for capture. Evaluation reruns from the new committed graph automatically |
| Evaluation is `INVALID` | Compilation or the seed-`1337` assembly failed | Fix the displayed first diagnostic. Wrong pool, name, or facing, impossible rules, or an uncappable required fallback are the common causes |
| Permanent preview is empty | Evaluation is pending or invalid, or seed `1337` intentionally produced no structure | Read the evaluation detail. Fix invalid data, or change chance/start rules if an empty result was not intended |
| Project deletion is blocked | Another JSON resource or ownership manifest still references a resource owned by the project | Remove or repoint the reported external reference, let autosave finish, then inspect deletion again |
| Studio closes but project deletion fails | The hash-pinned removal failed after a successful close | The project files remain on disk. Reopen or back them up before retrying |
| Transaction reports cleanup required | The authored graph committed but staging cleanup failed | Preserve console output and remove or recover only the named transaction with operator care. Do not re-author blindly |
| Export is rejected | At least one strict portability blocker remains | Fix each reported diagnostic. Do not bypass by deleting diagnostics or assuming Iris runtime success proves vanilla fidelity |
| Export output name is rejected | The value is not one direct safe artifact name | Remove whitespace, separators, traversal, and unsupported characters, and keep the name within 128 characters |
