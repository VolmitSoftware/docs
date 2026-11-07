---
title: "Animus: NPC Definitions"
description: "Definition files, spawning, live edits, appearance, text, inventory and presentation limits"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, npcs, definitions, appearance, hotload"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Each NPC is a JSON definition at `npcs/<folders>/<id>.json` in the Animus data folder, directly in `npcs/` or up to 8 folders deep, and the file name must be the `id` (`plugins/Animus/` on Bukkit, `config/animus/` on [mod servers](/animus/16-mod-servers)). Animus shows NPCs to players with packets only: no NPC body is registered as a world entity, and a dormant definition creates nothing in the world.

Folders are yours to arrange: `npcs/guard.json`, `npcs/town/guard.json` and `npcs/world/town/market/guard.json` are all valid places. The folder path is the NPC's folder, stored in its `group` field. `folder=` on commands, editor tokens limited to folders and the web editor's folder tree use it. Ids stay unique across every folder, so moving an NPC between folders never clashes with another NPC of the same id. The web editor's NPC browser can make, rename, move and delete folders; see [the web editor](/animus/14-web-editor).

## Definition file

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "uuid": "4f3c2a10-8d5e-4b6a-9c11-2e7f0a9b3c44",
  "id": "guard",
  "group": "town",
  "name": "&6Town Guard",
  "type": "minecraft:player",
  "spawned": false,
  "position": {"world": "world", "x": 0.5, "y": 64, "z": 0.5, "yaw": 0, "pitch": 0},
  "behaviors": ["town:greeting"]
}
```

A Minecraft id written without a namespace, such as `netherite_axe` or `villager`, means the `minecraft:` one. This holds for item, block, entity, sound, particle, effect and other registry ids in every Animus file. The file keeps what you wrote until Animus itself saves it, which writes the full `minecraft:` form.

| Field | Required | Accepted values |
|---|---|---|
| `schemaVersion` | Yes | `1`. Other versions are refused. |
| `revision` | Yes | Integer of at least 1. Every accepted command or editor change raises it. |
| `uuid` | Yes | Canonical UUID, unique across all NPCs. |
| `id` | Yes | 1-64 lowercase letters, digits, `_` or `-`, starting with a letter or digit. Unique across all folders. |
| `group` | Yes | The folder the file sits in under `npcs/`, such as `town/market`, or empty for a file directly in `npcs/`. Each folder name follows the `id` rules, at most 8 deep. Animus sets it from where the file is, so a file moved to another folder takes that folder. It is not a [trait group](/animus/18-trait-groups); those go in `groups`. |
| `name` | Yes | Printable Unicode and spaces, at most 256 UTF-16 code units, no control characters. `&` color codes apply. |
| `type` | Yes | An entity type, such as `minecraft:villager` or `villager`. Bodies that can be shown: `minecraft:player`, `minecraft:armor_stand`, `minecraft:horse`, `minecraft:turtle`, `minecraft:frog`, `minecraft:llama`, `minecraft:armadillo` and `minecraft:ender_dragon`. |
| `spawned` | Yes | `true` when the NPC is spawned: it becomes active whenever its chunk is loaded. `false` keeps it dormant. |
| `position` | Yes | `world`, and `x`, `y`, `z`, `yaw`, `pitch` as finite numbers within ±30000000. On Bukkit, `world` is a world name, a world UUID or a dimension key such as `minecraft:the_nether`; mod servers take the forms [their own page](/animus/16-mod-servers#worlds) lists. |
| `skin` | No | SHA-256 of a skin document in `skins/`. |
| `behaviors` | No | `namespace:id` references to [behaviors](/animus/07-behaviors). |
| `tags` | No | See [appearance](#appearance-text-and-inventory). |
| `groups` | No | 1-16 [trait group](/animus/18-trait-groups) ids whose shared values the NPC takes before its own. |
| `owner` | No | Canonical player UUID. |
| `modules` | No | Module settings keyed by module id, such as `animus:navigation`, `animus:combat` or `animus:riding`. Unknown module data is kept as written. |

Appearance, inventory, `movement`, `poses` and `rig` fields are described below and on [movement, mounts and riding](/animus/05-movement-mounts-riding) and [rigs and animations](/animus/06-rigs-animations). Health, cooldowns and running behavior state never belong in a definition; Animus does not write them there.

A wrong value names its exact field, for example `$.equipment.head.count: expected integer 1..99`.

## Activation and editing

Create, clone and import save definitions despawned (`spawned: false`), so they start dormant. `/animus spawn <id>` checks the world, body type, name and equipment against the running server, then saves `spawned: true`. The NPC is active while its chunk is loaded, and it appears once a player is in range and their client has received the chunk. `/animus despawn <id>` saves the NPC despawned and ends its combat immediately; its body disappears for viewers shortly after. A restart restores which NPCs are spawned. It does not resume interrupted work or restore combat health.

```none
/animus create guard name="Town Guard" folder=town
/animus spawn guard
/animus inspect guard
/animus select guard
/animus edit guard {"name":"Renamed Guard"}
/animus despawn guard
```

Management commands require `animus.admin`. `animus.status` is available to everyone. When an administrator clicks an NPC (sneak-click on a rideable NPC), that NPC becomes their selection; ordinary players interact normally and never see selection messages. `spawn`, `despawn`, `inspect` and `delete` accept the selected NPC when the ID is left out. Console commands always need the ID. See [commands and permissions](/animus/02-commands-permissions) for the full list.

`/animus edit` applies a top-level JSON patch: listed fields are replaced, the rest stay, and the revision goes up. An active NPC keeps its health and current position through an appearance-only edit. An edit that changes `position` moves it. Despawning and spawning again starts the NPC with fresh runtime state.

Skins are content-hashed JSON documents in `skins/` holding the texture and signature. When a changed skin reference is missing or invalid, the NPC keeps its last valid look and the field error is reported. Accepted definitions have recovery checkpoints: a broken hand edit found at startup keeps the previous accepted definition and leaves the edited file untouched. Deleting a definition file deletes the NPC. See [storage and recovery](/animus/12-storage-recovery).

### Hand edits apply live

Saving a definition file applies it within about a second, without `/animus reload`, and a broken edit keeps the last valid version. See [live apply](/animus/03-configuration#live-apply) for the chat line, what needs a restart and the `[hotload]` settings.

## Appearance, text and inventory

These fields are optional. Every viewer sees the same result, and it is rebuilt from the definition after a restart, a rejoin or a chunk reload. A change takes effect through `/animus edit`, a saved file or a reload, which gives viewers a fresh body.

```json
{
  "name": "Captain of the Northern Watch",
  "type": "minecraft:player",
  "equipment": {
    "main_hand": {"id": "minecraft:iron_sword"},
    "head": {"id": "minecraft:iron_helmet", "components": "[damage=12]"},
    "off_hand": {"id": "minecraft:shield"}
  },
  "hologram": {"lines": ["&6Quest giver", "Right-click to talk"]},
  "nameplate": {"visible": true},
  "pose": "sitting",
  "inventory": {"size": 36, "slots": {"0": {"id": "minecraft:bread", "count": 16}}},
  "owner": "8667ba71-b85a-4004-af54-457a9734eed7"
}
```

| Field | Accepted values |
|---|---|
| `equipment` | Slots `main_hand`, `off_hand`, `head`, `chest`, `legs`, `feet`, `body`, `saddle`. Each holds one item. Player bodies and armor stands show the first six, a horse shows its armor in `body` and its saddle in `saddle`, a llama shows its carpet in `body`, and turtles, frogs, armadillos and dragons show none. A slot the body cannot show is refused, such as `$.equipment.head: minecraft:horse bodies cannot show head; they show body and saddle`. When an edit changes the body type, set `"equipment": null` in the same edit or drop the slots the new body cannot show. |
| item | `id`, such as `minecraft:iron_sword` or `iron_sword`, optional `count` (1-99, default 1), optional `components`: the text that follows the item id in `/give`, such as `[enchantment_glint_override=true]`, at most 4096 characters. `imported` holds source item data with no equivalent; it is kept and never read. |
| `hologram.lines` | At most 16 lines of at most 256 characters each. `&` color and format codes apply. |
| `nameplate.visible` | `false` hides the name. Default `true`. |
| `pose` | `standing` (default). Player bodies also accept `sneaking`, `sleeping`, `swimming` and `sitting`. |
| `armorStand` | Armor stand bodies only: `small`, `arms`, `basePlate` (default `true`), `invisible`, and `head`, `body`, `leftArm`, `rightArm`, `leftLeg`, `rightLeg` as `[x, y, z]` degrees within ±360. Parts without angles keep the client's default pose. |
| `horse`, `llama`, `frog`, `armadillo`, `dragon` | Settings only that body has; see [body settings](#body-settings). |
| `inventory` | `size` is a multiple of 9 from 9 to 72; `slots` maps slot numbers below `size` to items. |
| `owner` | The owning player's UUID. |
| `tags` | At most 32 distinct labels of 1-32 lowercase letters, digits, `_` or `-`, starting with a letter or digit. The [web editor](/animus/14-web-editor) uses them to find and group NPCs. The server stores them and does not act on them. |

`skin`, a pose other than `standing`, `armorStand` and another body's settings are refused on a body that cannot show them, so after changing `type`, remove what the old body used. The [web editor](/animus/14-web-editor) lists these fields with a remove button.

`/animus spawn` checks every equipment item against the running server, so an unknown item or bad component text is refused as `$.equipment.<slot>.id` or `.components`. The [`animus:set-equipment`](/animus/07-behaviors) action replaces a slot until restart or the next definition change.

### Names and text lines

A player name that fits a profile name (16 characters, no `&` codes) stays the normal player nameplate. Longer or colored player names, every non-player name and all hologram lines appear in one text display that rides the body, with the hologram lines above the name. Placeholders such as `%player%` are not interpreted.

`hologram` also accepts:

| Field | Values |
|---|---|
| `billboard` | `center` (default), `fixed`, `vertical` or `horizontal` |
| `shadowed`, `seeThrough` | Boolean |
| `viewRange` | 1-512 blocks; the client hides the text farther away |
| `interpolationDelay`, `interpolationDuration` | 0-1200 ticks |
| `lineHeight` | 0-4 blocks |

A line may also be an object such as `{"text": "...", "marginTop": 0.25, "marginBottom": 0}`, with margins of up to 4 blocks. With a line height or any margin, each line and the name get their own display, stacked from the bottom: each line sits its bottom margin plus the line height above the one below and adds its top margin, as Citizens holograms do (0.25 blocks when only margins are set).

### Body settings

Each of these bodies has one optional object of its own. A setting left out keeps the look a newly spawned animal of that type has.

```json
"type": "minecraft:horse",
"horse": {"color": "chestnut", "markings": "white_dots"},
"equipment": {"saddle": {"id": "minecraft:saddle"}, "body": {"id": "minecraft:iron_horse_armor"}}
```

| Field | Settings |
|---|---|
| `horse` | `color`: `white` (default), `creamy`, `chestnut`, `brown`, `black`, `gray` or `dark_brown`. `markings`: `none` (default), `white`, `white_field`, `white_dots` or `black_dots`. The saddle and armor are the `saddle` and `body` equipment slots. |
| `llama` | `variant`: `creamy` (default), `white`, `brown` or `gray`. `chest`: `true` puts a chest on its back. The carpet is the `body` equipment slot. |
| `frog` | `variant`: `temperate` (default), `warm` or `cold`. |
| `armadillo` | `state`: `idle` (default), `rolling`, `scared` (rolled up) or `unrolling`. |
| `dragon` | `phase`: `hovering` or `sitting`, how a still dragon rests. Left out, it sits on solid ground and hovers in the air. A moving dragon always flaps. |

A turtle has no settings of its own; `baby` gives a hatchling. A [trait group](/animus/18-trait-groups) may hold one body's settings for the NPCs of that body type.

### Other presentation flags

| Field | Effect |
|---|---|
| `glowing` | Outline around the body |
| `teamColor` | One of the sixteen chat colors; colors the glow and the name |
| `baby` | Baby form of ageable, zombie, piglin and zoglin bodies, which includes the horse, llama, turtle, frog and armadillo |
| `usingItem` | Main-hand item is raised, as when blocking or drawing a bow |
| `listed` | A player body shows in the tab list |
| `gravity` | `false` makes the body hover instead of falling, whatever its `gravity` attribute says |

### Attributes

`attributes` sets vanilla entity attributes by id. Ids may carry the `minecraft:` namespace; `scale` and `minecraft:scale` are the same attribute, and setting both is refused.

```json
"attributes": {"scale": 1.5, "gravity": 0.02, "movement_speed": 0.3}
```

Every attribute any supported Minecraft version registers is accepted, and each value must be inside its vanilla range, such as 0.0625-16 for `scale`. An unknown id or a value out of range fails the file with the field named, for example `$.attributes.scale: expected 0.0625..16 for scale`. The generated NPC schema lists every id with its range and vanilla default; the web editor and completion read it from there. `air_drag_modifier`, `below_name_distance`, `bounciness`, `friction_modifier` and `name_tag_distance` exist from Minecraft 26.2; on 26.1.2 they are stored but not sent.

Viewers get the attributes with the body when it spawns, and again whenever a behavior changes one. Only the attributes the body's entity type carries are sent: a pig body has no `attack_damage`, so the client never sees it.

Animus also applies these to its own simulation of the NPC:

| Attribute | Effect | The definition field that wins |
|---|---|---|
| `scale` | The body, its hitbox, how far away a click reaches it, the room it needs on paths, its rig bones and its text all grow with it | |
| `movement_speed` | Walking speed. A player body walks 43.17 times the value in blocks per second, so 0.1 walks 4.3; other bodies walk 44.05 times its square, as vanilla mobs do. Kept within 1-10 blocks per second | A route's own speed, then `movement.speed` |
| `step_height` | Blocks climbed without a jump, at most 1.5 | `movement.stepHeight` |
| `jump_strength`, `gravity` | Jump height on paths, at most 3 blocks | |
| `gravity` | How fast an idle body falls; 0 or less hovers | `gravity: false` |
| `safe_fall_distance` | Blocks a path may drop, 0-16 | `movement.maximumFall` |
| `max_health` | Combat maximum health | `defense.maximumHealth` |
| `armor`, `armor_toughness` | Vanilla armor reduction of combat damage | `defense.armor` or `defense.armorFromEquipment` |
| `knockback_resistance` | The share of combat knockback ignored; below 0 the NPC takes more | |
| `attack_damage` | Melee damage | `melee.damage` or `melee.fromEquipment` |
| `attack_knockback` | Adds half its value to the 0.4 base melee knockback | `melee.knockback` |
| `attack_speed` | Melee hits per second | `melee.cooldownTicks` |
| `follow_range` | Combat scan range, at most 256 | `targeting.scanRange` |

`movement_speed` also sets the chase speed of a combat NPC unless `pursuit.speed` is set. The combat fields are in the NPC's `animus:combat` module; see [combat](/animus/08-combat).

Every other attribute is stored and sent but changes nothing for an NPC, because it matters only to a real player or to a vanilla mob brain: `block_interaction_range`, `entity_interaction_range`, `block_break_speed`, `mining_efficiency`, `submerged_mining_speed`, `sneaking_speed`, `sweeping_damage_ratio`, `camera_distance`, `luck`, `waypoint_receive_range`, `waypoint_transmit_range`, `flying_speed`, `tempt_range`, `spawn_reinforcements`, `max_absorption`, `burning_time`, `fall_damage_multiplier`, `explosion_knockback_resistance`, `movement_efficiency`, `water_movement_efficiency`, `oxygen_bonus` and the 26.2 attributes. NPCs do not slow down in water or run out of air, so the two water attributes have nothing to change.

`/animus npc attribute <npc> <attribute> [value=]` shows, sets or resets one attribute in the file; see [commands](/animus/02-commands-permissions#status-and-npc-management). The behavior action `animus:set-attribute` changes one for the running NPC only. Trait groups may set attributes; they merge attribute by attribute, see [trait groups](/animus/18-trait-groups).

### Poses

Sneaking, sleeping and swimming set the body's pose. A sitting player rides a hidden armor stand at its position, so its body appears lower; hits are still measured against the standing body. A sitting NPC cannot also ride another NPC. Named look directions for behaviors are set with `poses`; see [movement](/animus/05-movement-mounts-riding#named-poses).

### Inventory and owner

The inventory is stored data. Nothing renders it and no item moves in or out of it at run time. Modules read it from the definition snapshot, and Java code can use `NpcInventory.of(definition)`. The owner is exposed by `NpcDefinition.owner()`, `/animus inspect` and the definition snapshot, for plugins and modules to use in their own permission rules. Animus management commands still require `animus.admin`.

`/animus inspect` shows the pose, the number of equipped slots and text lines, the owner, and `presentation=unavailable` on a server build that lacks the needed packet support. NPCs still appear there, with their plain body and profile name.

## Interactions

A player's click is checked against the NPC's current state for reach, line of sight, rate and visibility, then fires the cancellable `VirtualNpcInteractionEvent` with `preview=false` on Bukkit. An NPC with the [combat module](/animus/08-combat) takes player hits as combat damage.

## Work and visibility limits

`[npcs]` settings in `config.toml`:

| Setting | Default | Range |
|---|---:|---|
| `enabled` | `true` | Boolean |
| `viewDistance` | 48 | 8-256 blocks |
| `maximumVisible` | 64 | 1-128 NPCs per viewer |
| `maximumViewers` | 256 | 1-1024 |
| `updatesPerTick` | 16 | 1-64 viewers updated per tick |
| `packetsPerTick` | 32 | 1-1024 NPC packets per tick, shared by the viewers updated (per region on Folia) |
| `pendingSpawnsPerViewer` | 8 | 1-64 spawns a viewer may have unanswered |
| `lookUpdatesPerTick` | 32 | 1-1024 look-close NPCs that may turn per tick (per region on Folia) |
| `simulationPerTick` | 512 | 16-65536 idle fall and rig animation steps per tick (per region on Folia) |
| `queuePerViewer` | 24 | 4-32 packet operations a viewer may have waiting to send |
| `degradedIntervalTicks` | 4 | 1-40 updates between two cosmetic updates while a budget runs short |

When a tick has less packet budget than work, updates give way in this order:

1. Despawns go first. Nothing else is sent to a viewer while one of its despawns waits.
2. Moves, equipment, mounts and new spawns come next.
3. Cosmetic updates come last: look-close turns, rig bone updates, recording poses, arm swings, dragon wing beats and timed hologram text refreshes such as text animations. They use only the budget left after every viewer's despawns, moves and spawns.

Every update carries the NPC's latest state. An NPC that moves several times, or swings several times, before its viewer's next update sends one move or one swing. A swing that waited longer than half a second is skipped. A combat attack is not cosmetic: its swing goes out with moves, so it shows on the next update even while cosmetic updates pause, and it is never skipped for waiting.

Each viewer has at most `queuePerViewer` packet operations waiting to send. Cosmetic updates stop when the queue is three quarters full, and moves and spawns wait for it to drain. A full queue counts as a short packet budget; it never drops the viewer.

After a tick where despawns or moves had to wait, cosmetic updates pause for 20 ticks, and the pause restarts if the budget runs short again. When the idle fall and animation budget (`simulationPerTick`), the route budget or the behavior start budget runs short instead, cosmetic updates and moves of NPCs farther than half of `viewDistance` slow to one update in `degradedIntervalTicks` for 20 ticks. Nearby moves, spawns and despawns keep their full rate, and a distant NPC always moves to where it is now. Animation endings still fire `animation_finished`, and a hologram still redraws at once when it first shows or its NPC moves. `/animus status` shows `presentation=normal`, `presentation=degraded` or `presentation=strained` with a count of deferred cosmetic updates. On Folia each region keeps its own state.

NPCs only appear in chunks the player's client has received. Animus never loads terrain to show an NPC.

## Ender dragon presentation

A `minecraft:ender_dragon` definition has no world entity, no boss bar and no dragon AI. `yaw`, `/animus navigation look` and route facing all mean the direction its head points. It sits with folded wings when resting on solid ground, hovers in place when resting in the air and flaps while moving; `dragon.phase` picks one resting look wherever it is. Clients may play its normal wing and growl sounds.

Clients strike one of the dragon's eight parts. Animus measures each hit against part positions worked out from the dragon's position and facing, with a small allowance for client animation. The part a client claims to have hit is not trusted, and the dragon's broad 16-block bounds do not count as a hit.

## Preview remote control

On Paper and Spigot, with `packetProofEnabled = true`, an administrator can steer their own player-shaped packet preview body:

```none
/animus proof control start <entity-id>
/animus proof control status
/animus proof control stop
```

The administrator stays a normal player and is not mounted. Control starts on a fresh movement key press, moves the body at most 0.1 block per 50 ms step, holds it within 8 blocks of where control began and lasts 30 seconds. Releasing the keys stops it. Sneaking, excessive input, a stale connection, lifecycle changes or unavailable terrain end control. Sprint and jump give no extra speed or flight. At most 8 players control a preview at once, one body each. Previews run no routes, behaviors or real combat. To let players ride saved NPCs, use [riding](/animus/05-movement-mounts-riding#riding-an-npc).
