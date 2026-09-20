---
title: "Jigsaw Structures"
description: "Iris documentation: Jigsaw Structures"
published: true
date: 2026-09-20T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
An Iris jigsaw structure is a set of objects (pieces). The assembler snaps them together through matching connectors until it runs out of depth, space, or candidates. Jigsaw Studio is the Bukkit in-game workflow for authoring those pieces; the resources it saves run on every supported platform.

- **Planar** mode is a constrained grid for village-like layouts.
- **Spatial** mode is freeform for strongholds, towers, and multi-level rooms.
- A project created with `compatibility=vanilla` can also be exported as a strict vanilla datapack for Minecraft 26.3 on 26.3 servers, or Minecraft 26.2 on earlier supported servers.

The JSON schema, the assembly rules, natural placement, and datapack export are on [21b - Jigsaw Resources](/iris/21b-jigsaw-resources). General Studio behavior is in [10 - Studio & VSCode Schemas](/iris/10-studio-vscode-schemas). Placement context is in [18 - Structures Overview](/iris/18-structures-overview). Native and datapack structures are in [22 - Native Structures & Datapacks](/iris/22-native-structures-datapacks).

## Build a village kit

This walkthrough creates a planar project, adds a piece, wires its connectors, puts it in a pool, tunes the graph, and generates it in a world.

Prerequisites:

- A Bukkit-family Iris server. The `/iris jigsaw` tree is Bukkit-only and player-only, and every subcommand uses `iris.all`.
- A writable pack under the Iris `packs/` directory. Use a disposable or version-controlled copy.
- No other Studio world opening or closing. Bukkit has one global Studio lifecycle and one owning Jigsaw player session.

> A committed graph transaction is persistent. **Undo Last Autosave** rewinds at most the newest five saves; there is no general undo. Keep a pack backup.
{.is-warning}

Inside an active Jigsaw Studio world, non-owner block edits and recognized mutating commands are cancelled.

### Step 1 — Create the project

```text
/iris jigsaw create overworld village/demo
```

`village/demo` is the structure key. It writes `structures/village/demo.json`, is the string Iris placements reference, and is what you pass to `open` later. `structure=` and `name=` are aliases for `key=`.

With no optional arguments you get planar mode, Iris-native compatibility, 15x15x15 workcells, and Studio seed `1337`. `mode=` tab-completes `planar` or `spatial`; `compatibility=` completes `iris` or `vanilla`. Planar width and depth must each be at least `3`, X and Z cannot exceed `128`, Y must stay within `1..192`, and one workcell cannot exceed `2,097,152` blocks. Width and depth may differ.

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

The start pool holds Cross Junction at weight `1`. The pieces pool holds End Cap, Hallway, L Junction, T Junction, and Cross Junction, and its direct fallback is the caps pool. The caps pool holds End Cap plus an empty termination entry. Their resource keys are `blank`, `end`, `straight`, `corner`, `tee`, and `cross`. Every default piece is rotatable with weight and chance `1`.

In an Iris-compatible project every piece belongs to theme `variant-1`, End Cap is terminal, mandatory caps are off, and an unresolved optional branch fails the whole assembly. A vanilla-compatible project omits Iris theme and terminal-rule metadata and terminates only the unresolved branch.

**What you should see:** Studio opens with you in creative above the Blank workcell, and all six workcells have their default variant loaded.

### Step 2 — Look around the Studio

```text
/iris jigsaw status
/iris jigsaw particles true
```

A planar Studio has six rotation-independent workcells in three columns by two rows. The first workcell origin is `(16, 65, 16)`, and every workcell's bounds start at Y 65, one block above its floor.

| Row | Workcell | Stable ID | Canonical open sides |
|---|---|---|---|
| 1 | Blank | `workcell/blank` | none |
| 1 | End Cap | `workcell/end` | north |
| 1 | Hallway | `workcell/straight` | north and south |
| 2 | L Junction | `workcell/corner` | north and east |
| 2 | T Junction | `workcell/tee` | north, east, and west |
| 2 | Cross Junction | `workcell/cross` | north, east, south, and west |

Each column is sized by its widest workcell and each row by its deepest, with one clear block between envelopes, so a small workcell can have extra open space beside it. Each floor is light-gray wool, the canonical connector path is red wool, and every canonical face-center socket is capped with a sea lantern. The Blank workcell has no path or cap. Rotations are solved at runtime, so there is no rotation gallery.

Every workcell sits inside a white-concrete edge cage one block outside its editable capacity. Player-local particle trails outline the focused and nearby editable bounds and draw a 1.75-block direction line out of each focused connector: lime for complete metadata with no Iris channel, red for incomplete identity metadata, other colors deterministic per channel. `/iris jigsaw particles <true|false>` toggles all of them.

The Iris scoreboard switches to Jigsaw context automatically and reports the structure, workcell, variant, and one of Loading, Saving, Disabled, Read-only, Invalid, Unsaved, or Saved. `/iris studio scoreboard` toggles that sidebar.

### Step 3 — Make a piece

Open the controls three ways: right-click the generated control chest with the main hand, run `/iris jigsaw menu`, or sneak three times within 1.5 seconds. The six-row GUI shows the six workcells and pages only the variants of the selected rotational archetype. Walking into a workcell selects it for your next menu open; left-clicking one in the GUI selects it, closes the menu, and teleports you to its horizontal center. Container previews never open Studio controls or mark the Studio edited.

Left-click **Hallway**, then click **New Blank Variant**. Iris clones the active piece's metadata and every pool membership into a new owned piece with an empty object of the same dimensions, then loads it into Hallway. Reopen the menu after the completion message.

**What you should see:** a deterministic new key such as `village/demo/variants/straight/variant-1`, and an empty Hallway-sized volume you can build in.

Related actions on the same page:

- **Rename This Variant** and **Rename This Workcell** use an anvil text input. Labels are author-facing only and never change piece keys, stable workcell IDs, or solver archetypes. At most 64 code points; control characters and section-sign formatting are rejected.
- **Duplicate This Cell's Variant** also copies the source object's bytes and label. Memberships are copied exactly: an End Cap clone keeps both its pieces- and caps-pool entries with their weight and chance.
- Both actions need an active owned variant with at least one owned membership. For an empty or unassigned workcell, run `/iris jigsaw piece create <poolKey> <pieceKey>` so the pool is explicit. A non-owned variant cannot be duplicated or mutated.

### Step 4 — Build the piece and wire its connectors

Walk into Hallway and build inside its white-concrete cage. Connector blocks are hidden by default; **Workcell Settings** toggles the real `minecraft:jigsaw` overlays back on when you need to edit markers, and **Reset Connector Blocks** restores every saved connector coordinate without touching your other edits.

A planar piece authored facing another direction is rotated into canonical orientation automatically, and capture applies the inverse rotation so the source resources stay coherent.

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

The jigsaw block's `orientation` block state supplies its front and top directions. Marker pools must be written as `iris:<owned-pool-key>` in Mojang's UI; capture checks that namespace and stores the key without `iris:`. Do not move a generated planar marker off its face-center socket. For `VANILLA_PORTABLE`, use vanilla-valid namespaced connector identities and leave the Iris-only channel empty.

Connector field meanings are in [21b - Jigsaw Resources](/iris/21b-jigsaw-resources).

#### Canonical planar sockets

For a planar piece whose source object dimensions are `X x Y x Z`, every connector must be horizontal with top `UP_POSITIVE_Y`, and the canonically rotated object must fit its archetype workcell. Integer division is floor division.

| Side | Position | Direction | Top |
|---|---|---|---|
| North | `(X / 2, Y / 2, 0)` | `NORTH_NEGATIVE_Z` | `UP_POSITIVE_Y` |
| East | `(X - 1, Y / 2, Z / 2)` | `EAST_POSITIVE_X` | `UP_POSITIVE_Y` |
| South | `(X / 2, Y / 2, Z - 1)` | `SOUTH_POSITIVE_Z` | `UP_POSITIVE_Y` |
| West | `(0, Y / 2, Z / 2)` | `WEST_NEGATIVE_X` | `UP_POSITIVE_Y` |

New blank planar variants inherit the source variant's exact dimensions and use those for these positions. Workcell capacity changes never rewrite sockets or object bytes; **Variant Size** and `variant resize` move the canonical sockets to the new face centers.

Planar mode is a horizontal topology and validation contract, not a global wave-function-collapse solver. It does not backtrack across an entire map.

#### Setting a connector channel

Mojang's jigsaw UI has no field for the Iris `channel`. Let autosave capture the marker, look directly at it from within eight blocks in the loaded workcell, then run `/iris jigsaw connector channel <channel|none>`. `none` clears the channel. The command rejects a workcell with no active owned variant, a missing connector offset, whitespace inside a channel, and channels longer than 128 characters. It trims outer whitespace and keeps case. Reopen Studio to refresh the workcell and particles. A non-empty channel is rejected in `VANILLA_PORTABLE`.

`finalState` must be a valid canonical Minecraft block state. Use `minecraft:structure_void` for an absent cell; a final state of air is retained explicitly and is not the same as an absent cell.

### Step 5 — Let autosave capture the work

Change one block, then wait two seconds without another workcell update. Almost anything you change in a workcell is captured, including container and tile activity. `status` reports whether an autosave is pending; `/iris jigsaw save` and the GUI's **Flush Autosave Now** request an immediate flush, but neither is needed in the normal loop. Fresh untouched workcells report **Autosaved**, not pending. Every successful save plays one short bell for the owner.

```text
/iris jigsaw status
/iris jigsaw save
```

A failed or incomplete capture writes nothing.

**What connector order survives.** With connector blocks visible, autosave preserves the authored connector order and keeps every marker still at the same source-local position, including markers whose metadata or orientation changed. Removed markers disappear, and new or moved markers append in deterministic X/Y/Z order. With connector blocks hidden, connector identity and order stay fixed and the block state and tile NBT at that coordinate become the connector final state. Duplicate source or captured positions reject the save.

**Rewinding.** The newest five committed iterations are retained per project, deduplicated by content. **Undo Last Autosave** restores and removes the newest one, so clicking it repeatedly rewinds up to five saves.

**When capture keeps failing.** A persistent failure leaves that mutation dirty and retries after 2, 4, 8, 16, then at most every 30 seconds. A later edit clears the failure state and a manual flush retries immediately. A planar connector-topology mismatch is ordinary authoring validation: it names the required and edited shape and points you at **Reset Connector Blocks**.

### Step 6 — Read the preview

Every committed mutation triggers a background compile and a seed-`1337` assembly. The menu reports `PENDING`, `VALID`, `WARNING`, `INVALID`, or `STALE`, plus the selected theme, piece count, and current diagnostic.

Iris renders the assembled blocks on the negative-X side of the workcells and updates that read-only area after each later commit. Planar previews sit on the editing floor; spatial previews are lifted 48 blocks above it. Click **Go to Preview** or run `/iris jigsaw preview goto` to teleport above it. The preview bounds are protected from players, fluids, pistons, explosions, growth, fire, entities, and redstone. The renderer accepts at most 250,000 explicit blocks; a larger assembly becomes `INVALID` with the render-limit diagnostic and is not rendered.

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

To place an existing piece into another pool, or drop it out of one, use `/iris jigsaw piece add <poolKey> <pieceKey> [weight=1]` and `/iris jigsaw piece remove <poolKey>`. Removing a membership never deletes the owned piece or object.

### Step 8 — Tune variation

From the GUI:

- Each pool membership carries a positive relative weight and an independent `0%..100%` eligibility chance. GUI chance adjustments move in five-percentage-point steps. Chance is rolled before weighted selection.
- **Themes & Piece Rules** sets a variant's theme membership, allowed depth `0..30`, required and maximum placement count `0..512` (maximum `0` means unbounded), and terminal role.
- **Duplicate All Enabled Cells as Family** allocates the next `variant-<n>` family, clones the loaded variant from every enabled workcell with its memberships, and assigns them all to that one theme. It either commits the complete family or changes nothing.
- **Structure Themes & Caps** shows each family's whole-assembly percentage and adjusts its relative weight.
- **Mandatory Caps** requires every unresolved connector pool to go through its direct fallback and place a compatible terminal piece. The default End piece is terminal and the default pieces pool already points at the caps pool, so a new project can turn this on without editing End first.

An assembly selects exactly one theme by positive theme weight, so it comes out entirely `variant-1` or entirely `variant-2`. Pieces do not mix families unless a piece belongs to both or has an empty theme list.

Piece themes, non-default chance, piece rules, and mandatory caps are Iris-only metadata. A graph that uses them is not `VANILLA_PORTABLE`.

### Step 9 — Size workcells and variants

Open **Workcell Settings** and stage capacity width, height, or depth by 1 or 8 without closing the menu, then click **Apply Cell Size**. Iris regenerates the layout live, moves the cages and active variants, rehydrates tile data, and moves you with the selected workcell. **Discard Size Changes** cancels the staged values without writing. Reopening Studio is only the recovery path if live regeneration fails.

Each planar workcell persists its own capacity, and changing it never rewrites a variant object. Capacity is an upper bound: it cannot shrink below any variant already assigned to that cell. Planar capacity width and depth are `3..128`, spatial width and depth are `1..128`, height is `1..192`, and volume is at most `2,097,152`. Spatial mode persists one shared `cellSize` plus `spatialWorkcellDisplayName`.

**Variant Size** gives the selected variant its own exact width, height, and depth within that capacity. Growth adds air. A shrink is lossless only: any stored block (including explicit air) or tile outside the target, a connector destination collision, unsafe connector tile data, a read-only object, or an object shared by another piece rejects the transaction with no file written. **Resize This Variant to Capacity** is the one-click exact-size shortcut. Siblings keep their own dimensions and bytes.

Disabling a planar workcell removes all pieces of that archetype from assembly and vanilla export while preserving its size and variants for later editing. Its translucent cuboid turns from light blue to red, and it stays selectable and editable. Re-enable it from the same settings page.

### Step 10 — Take Toolbox sticks for repeated actions

Use the **Toolbox** page when you want an action available without reopening the chest. Clicking an entry gives you a named stick bound to the current Studio request and its workcell, variant, pool entry, or action. Right-click to use it. Resize, themes, and rules sticks open the relevant GUI context; other sticks run their bound action. A stick from a closed or replaced Studio is rejected. Destructive sticks need two right-clicks within 10 seconds.

### Step 11 — Set expansion limits

```text
/iris jigsaw rules limits 12 8
```

The first number is depth, the second is horizontal radius in chunks. Extended graphs accept depth `1..30` and radius `1..32`. A `VANILLA_PORTABLE` session restricts this to depth at most `20` and radius at most `8` chunks.

### Step 12 — Register the structure in a world

Attach the structure to a dimension, region, or biome with a `structures[]` placement, validate the pack, and generate new chunks. The complete placement example is under **Natural placement** on [21b - Jigsaw Resources](/iris/21b-jigsaw-resources).

### Step 13 — Close Studio

```text
/iris jigsaw close
```

Wait for autosave, variant load, evaluation, or graph-update messages before replacing or closing Studio. `close` refuses tracked work unless it is clean; `discard=true` abandons pending edits.

The walkthrough passes when autosave commits the edited object and marker data, automatic evaluation reaches `VALID` or an understood `WARNING`, the seed-`1337` preview renders the expected family, pack validation succeeds, and a natural instance appears in newly generated chunks.

## Opening a graph: which command

Jigsaw edits that change required datapack registry content need a restart before Studio can use them, and the pack must pass `/iris pack validate pack=<dimension>`.

| Starting point | Command | Key form |
|---|---|---|
| Owned editable Iris graph | `jigsaw open` | Internal Iris path such as `minecraft_ancient_city` |
| Existing unowned or managed Iris graph | `jigsaw adopt inspect`, then `adopt apply` | Internal Iris path |
| Live registered vanilla or datapack jigsaw | `jigsaw convert` | Namespaced registry key such as `minecraft:ancient_city` |

### Re-edit an existing Studio jigsaw

Do not run `create` again; creation is add-only. Reopen a Studio-owned graph by its original dimension and structure key:

```text
/iris jigsaw open overworld village/demo
```

`edit` and `reopen` are aliases. All three reconstruct workcell capacities and labels, enabled states, variant dimensions and labels, themes, rules, and pool memberships from the saved graph. A loaded variant without editable ownership shows as Read-only.

`open` never looks up Minecraft's live structure registry: `minecraft_ancient_city` means `structures/minecraft_ancient_city.json` in the Iris pack. If that legacy graph has no ownership manifest, inspect and adopt it before editing.

### Adopt an existing Iris graph

An existing Iris graph with no ownership manifest must be inspected and claimed before Studio will edit it:

```text
/iris jigsaw adopt inspect overworld legacy/village target=auto strategy=auto
/iris jigsaw adopt apply <plan-uuid>
```

`inspect` reads the complete structure, pool, piece, object, and loot closure and reports a plan UUID, target, resource and byte counts, warnings and errors, and one of `IN_PLACE`, `CLONE_REQUIRED`, or `BLOCKED`. The default `auto` strategy claims an exclusive unowned closure in place; if any resource is shared with another structure it plans a private clone instead. `target=auto` names that clone `<source>-studio`, then tries numbered suffixes without overwriting an existing target. Use `strategy=in-place` to require a claim with no resource-byte rewrites, or `strategy=clone target=<new-key>` to require a specific private copy.

Plans belong to the inspecting player, live in memory for 15 minutes, and are consumed once. Close any active or opening Jigsaw Studio before `apply`. A stale or expired plan is rejected without writes; success opens the owned target at seed `1337`.

> Adoption records source and target hashes for provenance. It gives you **no rollback command and no restorable preimage**. Back the pack up first.
{.is-warning}

Automatic datapack imports carry `MANAGED_DATAPACK` ownership because refreshing the source may replace them. Iris forbids in-place adoption of those and plans a private clone while leaving the managed graph untouched:

```text
/iris jigsaw adopt inspect overworld imported/key target=my-edits/key strategy=clone
/iris jigsaw adopt apply <plan-uuid>
```

### Convert a registered vanilla or datapack jigsaw

Raw registered structures are not Iris graph files, so they cannot go through `adopt`. Convert one into a new add-only owned Iris graph, which then opens automatically:

```text
/iris jigsaw convert overworld minecraft:village_plains target=village/plains seed=1337
```

The source must be a live namespaced registry key and a jigsaw structure. With `target=auto`, `minecraft:village_plains` becomes `minecraft_village_plains`. Use a fresh target when the automatic name is occupied:

```text
/iris jigsaw convert overworld minecraft:ancient_city target=minecraft_ancient_city_edit seed=1337
```

This creates a separate Iris graph; it does not mutate Mojang's registered `minecraft:ancient_city`. Keep the source native when only its terrain integration needs changing. To replace natural Ancient Cities with the edited copy, place the Iris target from the dimension and use dimension-level `nativeSuppression: REPLACE_SOURCE`; the converted graph's `vanillaSource` supplies the source key.

Conversion follows the registered start pool and reachable template pools, templates, connectors, weights, empty entries, and fallbacks, and records fidelity warnings in the ownership manifest. It does **not** preserve native placement settings beyond start pool, depth, and maximum distance. Feature pool elements, palette alternatives, processors, entities, and other native-only behavior can be omitted or merely reported, and colocated list children are dropped as `LIST_ELEMENTS` fidelity loss. Keep the source native when those capabilities matter. Conversion is add-only and refuses occupied targets.

## Build a spatial stronghold kit

Spatial projects use the same lifecycle without the planar cell constraints:

```text
/iris jigsaw create overworld stronghold/demo mode=spatial width=32 height=24 depth=32
```

A new spatial project starts with seven owned 15x15x15 variants laid out left to right in one row: **0 Connectors**, then **1 Connector** through **6 Connectors**. The connector sequence is cumulative north, south, east, west, up, then down, so each adjacent cell adds one face-center socket. The first cell uses `workcell/spatial`; later cells use `workcell/spatial/<piece-key>`. Adding, deleting, or resizing variants regenerates the live row without reopening Studio.

The start pool contains all seven variants. The pieces pool contains variants 1 through 6 plus an explicit empty terminator; the connectorless editing piece is excluded because nothing can reach it as a child. Each generated piece defaults to at most 16 placements, so seed `1337` renders a bounded connected blob in the elevated spatial preview instead of one isolated piece.

Build inside a variant's dedicated cell and configure its doorway, stair, shaft, floor, or ceiling connectors. Spatial connectors may use all 12 front/top orientations the jigsaw block supports. Use `ROLLABLE` when the candidate's top direction should not constrain the join, and `ALIGNED` when it must match the source top after rotation. Iris tries only cardinal Y rotations. A piece with `rotatable: false` is tried only at its authored rotation; the control-chest details view toggles that, and vanilla-portable variants must stay rotatable.

Studio sizes the shared capacity to contain every reachable object and the horizontal footprint of its cardinal rotations, while each variant keeps its own exact dimensions. Use **Resize to Capacity** or `/iris jigsaw piece expand` when only the selected object should become the full workcell size. Spatial workcell and variant labels are author metadata; `cellSize` and labels do not constrain runtime assembly.

Create additional owned pools before targeting them from new spatial markers:

```text
/iris jigsaw pool create stronghold/demo/rooms
/iris jigsaw pool create stronghold/demo/end fallbackPoolKey=none
/iris jigsaw rules fallback stronghold/demo/rooms stronghold/demo/end
```

If the workcell has no active owned assigned variant, use `/iris jigsaw piece create <poolKey> <pieceKey>` to choose the pool explicitly.

## Commands

`/iris jigsaw` aliases are `/iris jig` and `/iris jgs`. The tree is player-only and Bukkit-only, and all commands use `iris.all`.

The create/open `<key>` is the root structure's internal lowercase resource path, not a display name or namespaced ID. `village/demo` maps to `structures/village/demo.json` and is referenced as `"village/demo"` by Iris placements. Pool and piece keys use the same grammar: one or more slash-separated segments containing only `a-z`, `0-9`, `.`, `_`, or `-`. Only the marker UI adds the required `iris:` namespace to pool keys.

| Command | Behavior |
|---|---|
| `create <dimension> <key> [mode=planar] [compatibility=iris] [width=15] [height=15] [depth=15] [seed=1337]` | Add-only atomic creation of a complete owned graph followed by an open request. `mode` completes `planar`/`spatial`. `compatibility` completes `iris`/`vanilla`. Planar X/Z are `3..128`. Spatial X/Z are `1..128`. Y is `1..192`. One workcell volume is at most `2,097,152` |
| `convert <dimension> <registered-key> [target=auto] [seed=1337]` | Add-only conversion of one live registered vanilla/datapack jigsaw into an owned Iris graph, followed by Studio open. Aliases `import`, `import-vanilla` |
| `adopt inspect <dimension> <source> [target=auto] [strategy=auto]` | Inspect an existing Iris closure and issue a 15-minute, hash-pinned `IN_PLACE`, `CLONE_REQUIRED`, or `BLOCKED` plan. `strategy` completes `auto`, `in-place`, or `clone` |
| `adopt apply <planId>` | Revalidate and atomically apply a plan owned by that player, then open the target with seed `1337`. No Studio may be active or opening |
| `open <dimension> <key> [seed=1337]` | Map an existing graph into compact workcells. Aliases `edit` and `reopen`. Another owner, dirty work, or a conflicting lifecycle operation blocks replacement |
| `close [discard=false]` | Close the transient Studio. Refuses active autosave/load/graph work or a pending dirty capture unless `discard=true` deliberately abandons it |
| `status` | Show structure, mode, compatibility, selected workcell dimensions and enabled state, variant count, whether autosave is pending, and the seed-`1337` evaluation/theme/piece result |
| `menu` | Open the same workcell/variant/rules/toolbox GUI as the control chest or triple-sneak gesture |
| `select` | Select the workcell containing the player |
| `goto <workcell>` | Select and teleport above a stable workcell ID or name, case-insensitively. Alias `teleport` |
| `particles <visible>` | Toggle player-local workcell-bound, connector, live-preview, and temporary assembly-preview particle trails |
| `save [bay=selected]` | Flush automatic capture now for one dirty ready workcell. Ordinary block and container changes already schedule this |
| `connector channel <channel\|none>` | Look at a saved marker in the active owned workcell within 8 blocks and set or clear its Iris-only channel. Reopen to refresh the workcell and particles |
| `bounds <width> <height> <depth>` | Set the selected workcell capacity without rewriting any variant object. All variants must fit. Aliases `cell`, `resize` |
| `workcell capacity <width> <height> <depth>` | Explicit nested form of `bounds`. Planar capacity belongs to one canonical archetype; spatial capacity is the shared envelope for its one-row variant cells |
| `workcell label <displayName>` | Set the selected workcell's author-facing label. Quote spaces. Canonical solver identity is unchanged |
| `workcell label-reset` | Reset the selected workcell to its canonical solver label. Alias `reset-label` |
| `pool create <poolKey> [fallbackPoolKey=none]` | Create a new empty owned pool. A non-`none` fallback must already be owned by this project |
| `piece create <poolKey> <pieceKey> [weight=1]` | Create and load a new owned variant. Planar derives canonical connectors from the contextual workcell; spatial creates a connectorless blank |
| `piece add <poolKey> <pieceKey> [weight=1]` | Re-add and load an existing piece/object already owned by this project |
| `piece remove <poolKey>` | Remove the active variant from that pool without deleting its owned piece/object resources |
| `piece rotatable <true\|false>` | Persist whether the active variant may use cardinal rotations. Portable sessions reject `false` |
| `piece expand` | Resize only the selected planar or spatial owned variant exactly to workcell capacity. Planar sockets move to the resized faces |
| `variant weight <poolKey> <weight>` | Set every matching entry for the active variant in that owned pool. Weight must be positive |
| `variant resize <width> <height> <depth>` | Resize only the active owned variant within workcell capacity. A safe shrink rejects cropped content and the active cell reloads in place |
| `variant label <displayName>` | Set the active variant's author-facing label. Quote spaces |
| `variant label-reset` | Reset the active variant to its resource-key fallback. Alias `reset-label` |
| `variant duplicate` | Copy the active variant's object bytes, metadata, and exact pool memberships into one new variant in this workcell |
| `variant duplicate-family [themeKey=next]` | Atomically clone every enabled workcell's active owned variant into one coherent Iris family and load it. Alias `family` |
| `rules limits <maxDepth> <maxSizeChunks>` | Atomically set expansion depth and horizontal radius. Portable sessions enforce `<=20` and `<=8` |
| `rules fallback <poolKey> <fallbackPoolKey\|none>` | Atomically set or clear one owned pool's direct fallback after compiling the complete graph |
| `preview goto` | Teleport above the permanent seed-`1337` block preview. Alias `teleport` |
| `preview assemble [seed=1337]` | Compute a deterministic read-only assembly at the player coordinates and show its bounds as purple particles for 10 seconds. Places no blocks |
| `export [namespace=iris] [output=jigsaw-export] [format=zip] [replace=false]` | Start a background strict export of the clean on-disk graph as a directory or zip for Minecraft 26.3 on 26.3 servers, or Minecraft 26.2 on earlier supported servers |
| `delete [confirm=false]` | With `confirm=true`, inspect reverse references, close Studio, and atomically remove the complete owned project. External references or changed ownership bytes block deletion. Alias `remove` |

The control chest is the primary workflow. Its six-row GUI manages workcell capacities and labels, per-variant dimensions and labels, enabled states, rotation, pool-entry weights and chances, themes, piece rules, mandatory caps, preview navigation, toolbox sticks, and deletion. Accepted asynchronous actions close the GUI while work runs; wait for the player message, then reopen the chest.

Rules with no in-game control (`branchFailurePolicy`, `placeMode`, structure `edit`, structure `loot`, pool `mandatoryFallback`, and empty entries) stay schema-backed JSON fields.

> **Do not hand-edit a project's files while Studio has it open.** Studio pins the files it owns by hash, and an outside edit blocks the next mutation rather than being overwritten. One player owns the active Studio; wait for a clean status before reloading, shutting down, or closing.
{.is-warning}

## Failure recovery

| Symptom | Meaning | Recovery |
|---|---|---|
| Create reports occupied/conflicting files | Add-only ownership refused to overwrite existing resources | Choose a new structure key, or deliberately remove/migrate the old graph outside this workflow |
| Create reports success but Studio does not open | The graph was created before the follow-up open request hit another owner, pending autosave, or a lifecycle transition | Resolve the active Studio guard, then run `open` for the new structure. Do not rerun `create` against its now-owned files |
| A loaded variant is Read-only | Its graph is unowned or has managed datapack provenance | Close Studio, run `adopt inspect`, review the diagnostics, then apply the plan. Managed input must use a clone target |
| Adoption plan is expired, unknown, or stale | Its 15-minute plan was consumed or expired, or a pinned source/target changed | Run `adopt inspect` again. No stale plan is written |
| Conversion refuses the source | The key is absent, is not a live registered jigsaw, has an incomplete graph, or the add-only target is occupied | Keep it native, choose a valid registered jigsaw, repair its source datapack, or choose a new target. Use `/iris structure import` for non-jigsaw templates |
| Ownership conflict on capture/edit | An owned file changed outside the last committed transaction | Restore the exact owned graph from version control or backup. Studio will not overwrite the mismatch |
| Close refuses with pending work | An owned workcell is dirty or autosave/graph work is running | Wait for autosave, use **Flush Autosave Now**, or use `discard=true` only when losing pending edits is deliberate |
| An external plugin edit is not captured | The plugin bypassed Bukkit's covered mutation events | Have the integration call `JigsawStudioService.markDirty(...)` for the affected coordinates, or `markAllDirty(...)` |
| Autosave has no active/editable variant | The workcell is empty or its loaded variant is read-only | Load an owned variant, or adopt/clone the graph first |
| Autosave reports Loading, Invalid, or not hydrated | Variant materialization or jigsaw block-entity hydration is incomplete or failed | Wait for completion, reopen or reload the variant, and do not build until the scoreboard reports a stable state |
| Capacity succeeds but live regeneration reports a failure | The metadata committed, but one repaint or hydration step failed | Close and reopen Studio before editing. The persisted capacity remains authoritative |
| Autosave says a chunk is not loaded | Part of the capture volume is unloaded | Visit or load the whole workcell, then use **Flush Autosave Now** |
| Multi-chunk autosave aborts | A chunk unloaded, Studio changed, or marker/tile capture failed | Keep the complete capture volume loaded and fix the reported cause. No graph file is written from a partial capture |
| Marker capture fails | Marker NBT is incomplete, the final state is invalid, or the server cannot serialize the tile | Fix the named marker field, or use a supported Bukkit build |
| The chest GUI closes after an action | The accepted operation is asynchronous and the GUI does not live-refresh | Wait for its player message, then right-click the chest again |
| A named stick stops working | Its request ID belongs to a closed or replaced Studio, or the bound workcell/variant/pool entry changed | Discard the stale stick and take a replacement from the current Toolbox |
| A queued duplicate cancels | The Studio session or one pinned source variant changed before autosave completed | Reopen the controls, confirm the intended source variants, and request the duplicate again |
| Another player cannot edit or run a mutating command | The active Jigsaw Studio belongs to its owner | Have the owner do the work or close the Studio |
| Evaluation is `STALE` | A workcell edit is waiting for autosave | Wait for capture. Evaluation reruns from the new committed graph automatically |
| Evaluation is `INVALID` | Compilation or the seed-`1337` assembly failed | Fix the displayed first diagnostic. Wrong pool, name, or facing, impossible rules, or an uncappable required fallback are the common causes |
| Permanent preview is empty | Evaluation is pending or invalid, or seed `1337` intentionally produced no structure | Read the evaluation detail. Fix invalid data, or change chance/start rules if an empty result was not intended |
| Project deletion is blocked | Another JSON resource or ownership manifest still references a resource owned by the project | Remove or repoint the reported external reference, let autosave finish, then inspect deletion again |
| Studio closes but project deletion fails | The hash-pinned removal failed after a successful close | The project files remain on disk. Reopen or back them up before retrying |
| Transaction reports cleanup required | The authored graph committed but staging cleanup failed | Preserve console output and remove or recover only the named transaction with operator care. Do not re-author blindly |
| Export is rejected | At least one strict portability blocker remains | Fix each reported diagnostic. Iris runtime success does not prove vanilla fidelity |
| Export output name is rejected | The value is not one direct safe artifact name | Remove whitespace, separators, traversal, and unsupported characters, and keep the name within 128 characters |
