---
title: "Animus: Migrating from Citizens"
description: "Import Citizens NPCs with Sentinel, dtlTraders, Shopkeepers, Builder and Denizen data"
published: true
date: 2026-11-10T00:00:00.000Z
tags: "animus, citizens, migration, import, sentinel, denizen, shopkeepers, converter"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus reads the Citizens `saves.yml` and turns every NPC into its own definition file. Nothing runs until you apply the import. Apply installs everything that converts and turns it on: NPCs spawn as Citizens had them, and their routes, schedules, combat, riding, shops, builds, commands and converted scripts run. You can undo the whole migration with one command.

The import commands need `animus.import`, which `animus.admin` grants. They work the same on Paper, Spigot, Folia and mod servers. On mod servers the data folder is `config/animus/` instead of `plugins/Animus/`.

## Steps

1. Back up the server. Stop it.
2. Remove the Citizens jar (and Sentinel, dtlTraders, Builder, CitizensCMD, CommandNPC and Denizen) from `plugins/`. Keep their data folders. Animus refuses to apply the import or run imported NPCs while Citizens is enabled, so the same NPC never runs twice.
3. Leave `plugins/Citizens/saves.yml` where it is, or copy it to `plugins/Animus/imports/saves.yml`. Animus also looks in `imports/inbox/saves.yml`. Files that belong to the same NPCs are read from beside the save:

   | File | Beside `plugins/Citizens/saves.yml` | Beside a copied save |
   | --- | --- | --- |
   | Citizens shops | `plugins/Citizens/shops.yml` | `shops.yml` |
   | CitizensCMD commands | `plugins/CitizensCMD/data/saves.yml` | `citizenscmd/saves.yml` |
   | CommandNPC commands | `plugins/CommandNPC/commands.yml` | `commandnpc/commands.yml` |
4. Optional: copy the dtlTraders data folder to `plugins/Animus/imports/dtltraders/` (a folder left at `plugins/dtlTraders/` also works). Builder and Constructor schematics are found in `plugins/Builder/schematics/`, `plugins/Constructor/schematics/` or `plugins/Animus/imports/schematics/`.
5. Start the server. The console lists every save and folder it found (Citizens, Shopkeepers, dtlTraders and Builder schematics) and the next command.
6. Preview:

   ```text
   /animus import citizens preview
   ```

   This converts the save, stages a plan and prints the counts: NPCs, valid definitions, skins, folders, the routes, look-close and behaviors it made, what is kept but not converted, and the command namespaces the imported commands need. Nothing is installed. A save that changes while it is read, does not parse or does not end with a line break is read again after a moment, since Citizens may be saving it; if it still looks cut off, the preview is refused and you run it again later. A definition counts as valid only when it also passes the spawn checks that do not depend on the server, such as a skin needing a player body. A spawned NPC that still cannot start is logged once as a warning that names the field. The full report is `imports/<import-id>/report.json`, with one report per NPC under `reports/`.

   One record that does not convert stops the whole import: the preview is refused with `<n> of <m> records do not convert; see imports/<import-id>/report.json`, and apply refuses an import with invalid records. Each failing NPC's report lists its problems under `validationErrors`; fix them in the save or remove those NPCs, then preview again. A save holds at most 10,000 NPC records.

   Each NPC report gives every Citizens field a status under `fields`: `CONVERTED`, `REQUIRES_REVIEW` (Animus has a near equivalent you should check), `UNSUPPORTED_PRESERVED` (kept in `citizens:review` and `records/`, not run) or `REQUIRES_INTEGRATION` (needs data that is not in the save, such as Denizen scripts). `reasons` gives a one-line reason for each field that is not converted, and for converted fields that change nothing. The migration warnings in `report.json` list only things you should act on, each saying what to do.

   Options: world mappings such as `worlds=world_old:world` when a world has a new name, and a mode for NPCs that already exist in Animus (see [collision modes](#collision-modes)). For example `/animus import citizens preview mode=replace worlds=world_old:world`. Add `factor-groups=true` to move settings that two or more NPCs share into [trait groups](/animus/18-trait-groups#citizens-import); the converter's `preview` takes `--factor-groups`.
7. Apply:

   ```text
   /animus import citizens apply
   ```

   Every NPC is installed at its Citizens position and spawns, except NPCs that were despawned in Citizens. Their routes, schedules, combat, riding, shops and builds are on. Citizens and dtlTraders shops are installed in the same step, and `.schem` and `.nbt` schematics are copied into `schematics/`. Text and command behaviors made from the save are installed in `behaviors/citizens/` and run at once. Apply and rollback reload the shops, GUIs and behaviors they change, so new shops trade and removed ones close at once, with no reload or restart.

   When imported behaviors, shops or schedules run commands, apply adds their namespaces (`citizens`, and `denizen` for converted Denizen scripts) to `commandNamespaces` under `[behaviors.actions]` in `config.toml`, so those commands run as they did under Citizens. Only that key changes; comments and the rest of the file stay, and behaviors in any other namespace still need their own entry. Applying an import whose commands need a namespace that is not allowed yet needs `animus.editor.commands` in game, or `apply:commands` in the editor; the console may always. Rollback takes out only the namespaces apply added.

   Every guard becomes a combatant; at most `[combat] maximumNpcs` fight or scan at once and guards with no player near sleep. Apply and `review` say when more guards are imported than that. See [combat work limits](/animus/08-combat#work-limits).

   Apply refuses a preview whose save changed after it was taken, with `<save> changed since the preview`, so NPCs saved in between are not dropped. Run `preview` again, then `apply`. Apply also refuses an import an older Animus staged with NPC files at an older [schema version](/animus/12-storage-recovery#schema-versions): `Import <id> was previewed by an older Animus and is not applied: <file> is schemaVersion 1, this one writes 2; run /animus import citizens preview again, then /animus import citizens apply`. The editor's import screen says to upload and stage the save again. If apply stops part way, for example on a full disk or a schematic that cannot be copied, everything it installed stays recorded: run `apply` again to finish, or `rollback` to undo it. Until then `preview` is refused and the startup notice says an apply was interrupted.
8. Review:

   ```text
   /animus import citizens review
   ```

   `review` reports what was installed and converted, what was kept but not converted, the command namespaces the import added, and where the reports are.

The migration records its progress in `imports/citizens/state.json`.

### Collision modes

The mode, `mode=` on the command, decides what happens when an incoming NPC's identity or file path is already taken:

| Mode | Result |
| --- | --- |
| `reject` (default) | Install only when every incoming identity and path is free. |
| `replace` | Replace matching files only when the UUID, readable ID and Citizens numeric ID all agree. Each replaced definition gets a higher revision. New records are added, and records missing from the import are never deleted. |
| `duplicate` with `copy=<label>` | Install a second copy with new, repeatable UUIDs and readable IDs `citizens-<id>-<label>` under `npcs/copy-<label>/`. Known NPC references inside the copy, such as mounts and guarded NPCs, point to the copy. |

A label uses 1-32 lowercase letters, digits, `_` or `-`, and each copy needs a different label. An identity that collides at a different path refuses replacement. Every imported definition is installed as converted, whatever the mode. Original records and unknown review data are kept; references whose meaning Animus does not know are not translated in a copy.

## Citizens commands in Animus

| Citizens | Animus |
|---|---|
| `/npc create <name>` | `/animus create <id> name=<name>`: spawns where you stand, facing your way |
| `/npc select <id>` | `/animus select <id>`, or click the NPC with the wand (`/animus tools wand`) |
| `/npc list` | `/animus list` |
| `/npc remove` | `/animus delete <npc>`; `/animus rollback` restores it |
| `/npc copy` | `/animus clone <npc> <id>` |
| `/npc spawn`, `/npc despawn` | `/animus spawn <npc>`, `/animus despawn <npc>` |
| `/npc skin <player>` | `/animus npc skin <npc> <player>`, also from the console |
| `/npc tphere`, `/npc move` | `/animus npc move <npc>` |
| `/npc tp` | `/animus npc tp <npc>` |
| `/npc rename <name>` | `/animus npc rename <npc> <name>` |
| `/npc lookclose` | `/animus npc look <npc> toggle` |
| `/npc type <type>`, `/npc equip` | `/animus edit <npc> {"type": "minecraft:villager"}`, or the toolkit's **Equipment** screen |

Each takes `@selected` for the NPC you selected. See [commands](/animus/02-commands-permissions#status-and-npc-management).

## Converting on a running server

The lower-level commands work on any Citizens save file placed in `plugins/Animus/imports/inbox/`, and give each step its own ID:

```none
/animus import preview <file> [worlds=oldWorld:newWorld]
/animus import apply <preview>
/animus import stage <preview> mode=replace
/animus import stage <preview> mode=duplicate copy=town-copy
/animus import plan <preview> <application>
/animus rollback <transaction>
```

`<preview>` is the import id that `import preview` prints, and `<application>` the id that `stage` prints.

`import apply` installs with the default `reject` mode. `import apply`, `stage` and `plan` refuse an import an older Animus previewed with NPC files at an older schema version, and say to run `/animus import preview <file>` again and use the import id it reports. `stage` prepares an application plan for another mode and prints its application ID, mode, counts, plan path and the exact apply command; it changes no definitions. The plan lives at `imports/<import-id>/applications/<application-id>/plan.json`. Do not edit generated plans: a changed plan must be staged again.

Applying checks the plan against the current definitions. If a definition changed or a new collision appeared since staging, nothing is installed and you stage again. Applying the same plan twice reports `already-applied` while its files are unchanged; changed or missing files are reported, never overwritten. Rollback restores the previous definitions and refuses if you edited them after applying. Keep `backups/` and `state/objects/transaction-data/` together if you want to keep rollback history.

## Converting offline

The converter is a standalone program that runs the same conversion without a server. It reads at most 16 MiB of UTF-8 YAML nested at most 64 levels deep, rejects duplicate keys, aliases and non-finite numbers, and never changes the source file. Stop the server first: the converter and a running server cannot open the same data folder at once.

```sh
converter preview /path/to/saves.yml /path/to/Animus old_world=new_world
converter apply /path/to/Animus <import-id>
converter validate /path/to/Animus
converter rollback /path/to/Animus <transaction-id>
converter stage /path/to/Animus <import-id> replace
converter stage /path/to/Animus <import-id> duplicate town-copy
converter apply-plan /path/to/Animus <import-id> <application-id>
```

Preview writes `imports/<import-id>/` and changes no definitions:

- `source.yml`: the original input, kept exactly, and `companions/` with the shops and command add-on files found beside it.
- `records/<citizens-id>.json`: every original NPC record.
- `reports/<citizens-id>.json`: the status of every field and the exact definition errors.
- `npcs/<world>/citizens-<id>.json`: one editable definition per NPC; see [where the files go](#where-the-files-go).
- `skins/<sha256>.json`: complete skin documents, one per different skin.
- `report.json`: counts, trait and Sentinel inventories, the UUID and world mappings, and a hash of every document.

Repeating an identical preview gives the same import ID. A preview file that was edited fails its hash check at apply: import first, then edit the installed definitions.

The converter also handles the other sources:

| Command | Does |
| --- | --- |
| `converter shops-preview <dtlTraders-folder> <data-dir> [saves.yml]` | Stages a dtlTraders import; see [shops](/animus/10-shops#importing-from-dtltraders). |
| `converter shops-apply <data-dir> <import-id>` | Installs it. |
| `converter shopkeepers-preview <save.yml> <data-dir> [config=<config.yml>] [citizens=<saves.yml>]` | Stages a Shopkeepers import and prints its counts and output hash. |
| `converter shopkeepers-apply <data-dir> <import-id>` | Installs it. |
| `converter denizen-preview <Denizen-folder> <data-dir> [citizens=<saves.yml>]` | Stages a Denizen conversion and prints its counts and output hash. |
| `converter validate-behaviors <directory>` | Checks behaviors offline; see [behaviors](/animus/07-behaviors#checking-behaviors-offline). |

Import archives and transaction files can hold player names and other private data. Keep them off public repositories.

## Converting in the browser

The [web editor](/animus/14-web-editor) converts a `saves.yml` in the browser with the same rules: open it, choose **Import Citizens and others**, and pick the file. The file is read on your computer and converting never uploads it. The browser reads only the save, so Citizens shops and the CitizensCMD and CommandNPC commands convert when the server or the converter previews the import with those files beside the save. The review leads with the migration warnings and the records that will not load, and downloads a zip to unpack into the data folder. The zip holds `imports/saves.yml` and the staged `imports/<import-id>/` folder, so `/animus import citizens preview` on the server finds the same preview and continues from step 6.

A Shopkeepers `save.yml` (with its `config.yml`, if you have it) converts the same way; its zip holds `imports/shopkeepers/save.yml` and the staged `imports/shopkeepers/<import-id>/` folder. Load the Citizens save first so the browser checks the links.

A Denizen folder converts the same way: choose **Choose Denizen folder** and pick `plugins/Denizen`. The editor reads every `.dsc` and `.yml` file under `scripts/`, `server_flags.dat` and `player_flags/`, lists any other files it skipped, and binds assignments to the NPCs of the Citizens save chosen above. Its zip holds the folder under `imports/denizen/` and the staged `imports/denizen/<import-id>/` tree; unzip it beside the Citizens import and run `/animus import citizens` as in [Denizen](#denizen).

The same screen can also upload the files to a paired server and run stage, review, apply and rollback there, with the same results as the commands.

## Where the files go

Each NPC becomes `npcs/<world>/citizens-<id>.json`, and one with no world goes in `npcs/citizens/`. The world name is lowercased with other characters changed to `-` (`World Nether` becomes `world-nether`) and cut to 48 characters. The ID is always `citizens-<Citizens id>` and the UUID is the Citizens UUID, so the same save always gives the same files. You can move the files into any folders under `npcs/`; importing the same save again updates each NPC where it now lives, and only new NPCs go in `npcs/<world>/`. Skins go in `skins/<sha256>.json`, one file for each different skin. Citizens shops go in `shops/citizens/<name>.json`. Installed files from an import made with an older Animus are upgraded automatically at the next start, by `/animus reload`, or by live apply when they are copied in, as described in [Schema versions](/animus/12-storage-recovery#schema-versions).

## What converts

| Citizens data | Animus |
| --- | --- |
| UUID, numeric ID, name, type, location and facing | Definition identity, `name`, body type and position, with world mappings applied. |
| Skin | `skins/<sha256>.json` on player bodies. See [skins](#skins). |
| Equipment and inventory | `equipment` (all eight slots) and `inventory`, with item names, lore, enchantments, damage, custom model data, item model, dye color, patterns, potions and persistent data written as item components. Item meta with no component is kept in the item's `imported` field. A HorseModifiers saddle or armor fills an empty `saddle` or `body` slot, and its color, style and chest become the horse's coat and markings or a donkey's, mule's or llama's chest. |
| Hologram lines | `hologram`, top line first, with margins, line height, view range, billboard, shadow, see-through and interpolation. |
| Poses, sneaking, sitting, armor stand | `poses` for [`animus:pose`](/animus/07-behaviors#actions), sneaking and sitting poses, armor stand parts, angles and marker. |
| Glowing, using an item, player-list visibility, scoreboard color and tags, gravity, baby age | `glowing`, `usingItem`, `listed`, `teamColor`, `tags`, `gravity`, `baby`. An armor stand without gravity also gets `gravity: false`. |
| Attribute trait | `attributes`, with the older `generic_scale` and `generic.scale` names read as `scale`. A value outside the vanilla range is clamped with a warning; an id no supported Minecraft version registers is kept for review. |
| Scaled max health | The `max_health` attribute, unless the attribute trait sets one. |
| Mob looks | The body's [settings](/animus/04-npc-definitions#body-settings). See [mob looks](#mob-looks). |
| Skin layers and game mode | `player` on player bodies. |
| Saddle trait | A saddle in the `saddle` slot of a body that shows one. |
| Sleep and entity pose | `pose: sleeping`, or the matching `pose` of a player body: crouching, sleeping, swimming or sitting. |
| Boss bar | `bossBar`, with a `health` track as `progress: health`. A hidden bar converts to none. |
| Player filter | `viewers`, with allowlists as `mode: allow` and the apply range as `range`. |
| Click redirect | `clickRedirect`. |
| Navigator settings | `movement`: speed, water avoidance, fall distance, pathfinding range, distance margin, stuck handling, flying (`flyable` becomes `movement.style: fly`) and opening doors. |
| `targetable: true` | `targetableByMobs` on `animus:combat`, and `animus:health` that is killable unless Citizens protected the NPC. |
| `minecraft-ai: true` on a mob with no route | A wander route around its spawn point. |
| Owner | `owner`, when it is a player. |
| Mounts | Mount references resolved through the UUID map. |
| Waypoints | A route. See [waypoints](#waypoints). |
| NPC Destinations `npcdestinations` | `animus:schedule`. See [importing NPC Destinations](/animus/30-npc-schedules#importing-npc-destinations). |
| Look-close and gradual rotation | `animus:look-close`. See [look-close](#look-close). |
| Follow | A guard in `animus:combat`. See [follow](#follow). |
| Home | `animus:home`. See [home and pausing](#home-and-pausing). |
| Pause pathfinding | `pause` on the NPC's route. See [home and pausing](#home-and-pausing). |
| Text and commands | Generated behaviors. See [text](#text) and [commands](#commands). |
| Sentinel | `animus:combat` and `animus:health`. See [Sentinel settings](#sentinel-settings). |
| `controllable` | `animus:riding`. A disabled trait converts to nothing. |
| Citizens shops (`/npc shop`) and the `shop` trait | Shops in `shops/citizens/`, and `modules["animus:shop"]` on NPCs that open a shop on right click. See [shops](#shops). |
| Drops trait | `death.drops` in `animus:health`. See [drops](#drops). |
| CitizensCMD and CommandNPC commands | The NPC's command behavior. See [command add-ons](#command-add-ons). |
| dtlTraders `trader` | `modules["animus:shop"]`. |
| Model Engine `meg_model` | `animus:modelengine`, the first model with its scale. See [Model Engine](/animus/32-model-engine#importing-modelled-citizens-npcs). |
| Builder `builder` | An `animus:builder` section. See [builder](#builder). |
| Denizen assignments, triggers and flags | Converted from the Denizen folder when it is present. See [Denizen](#denizen). |
| LibsDisguises disguises | `disguise`, from the disguise LibsDisguises saved for the NPC or a script that disguises its UUID. See [LibsDisguises](/animus/34-libsdisguises#citizens-npcs). |

### Skins

A skin on a player NPC becomes `skins/<sha256>.json`. Only player bodies show a skin, so a skin on any other body (a llama, frog or ender dragon) is not set. Citizens never drew those skins either. It stays in `modules["citizens:review"]` in case the NPC is changed to a player, the NPC's report says why, and the preview counts it among the skins on non-player NPCs kept unused.

### Mob looks

These traits become the settings of the NPC's body. When a trait saves no value, Citizens' own default is used, as Citizens shows it: a cat trait with no type is a black cat and a slime size trait with no size is size 3.

| Citizens trait | Animus |
| --- | --- |
| `sheeptrait`, `woolcolor` | `sheep.color`, `sheep.sheared` |
| `wolfmodifiers` | `wolf.variant`, `sitting`, `angry`, `interested`, and the collar color as `wolf.collar` when the wolf is tamed |
| `cattrait` | `cat.variant`, `collar`, `sitting`, `lying` |
| `parrottrait` | `parrot.variant`; Citizens' `RED` is `red_blue` and `CYAN` is `yellow_blue` |
| `foxtrait`, `axolotltrait`, `pandatrait`, `goattrait`, `beetrait`, `vextrait`, `polarbeartrait`, `piglintrait`, `allaytrait`, `endermantrait` | The body's settings of the same name; `rearing` is `polarBear.standing`, any bee anger is `bee.angry` |
| `rabbittype` | `rabbit.type`; `BLACK_AND_WHITE` is `white_splotched`, `SALT_AND_PEPPER` is `salt` and `THE_KILLER_BUNNY` is `evil` |
| `profession`, `villagertrait` | `villager` or `zombieVillager` `profession`, `type` and `level` |
| `powered` | `creeper.powered` |
| `slimesize`, `phantomtrait` | `slime`, `magmaCube` or `phantom` `size`, within the range those bodies accept |
| `mushroomcowtrait`, `pigtrait`, `cowtrait`, `chickentrait`, `frogtrait`, `llamatrait` | The body's `variant` |
| `shulkertrait`, `pufferfishtrait`, `tropicalfishtrait` | `shulker.color` and `peek`, `pufferfish.puff`, `tropicalFish.pattern`, `baseColor` and `patternColor` |
| `snowmantrait` | `snowGolem.pumpkin: hidden` when Citizens' derp setting is on |
| `spellcastertrait`, `sniffertrait`, `armadillotrait`, `coppergolemtrait`, `battrait` | `evoker.spell`, `sniffer.state`, `armadillo.state`, `copperGolem.weather`, and `bat.resting` unless the bat is awake |
| `withertrait`, `cameltrait` | `wither.invulnerableTicks` (20 while charged, or while the NPC is protected when nothing else says) and `armored` for the arrow shield; `camel.sitting`, and `dashing` for the panic pose |
| `paintingtrait`, `itemframe`, `endercrystaltrait` | `painting.variant`; the item frame's `item`, `rotation` and `facing`; `endCrystal.base: hidden` unless Citizens shows the base |
| `itemdisplaytrait`, `textdisplaytrait`, `displaytrait` | `itemDisplay.transform`; `textDisplay` text, alignment, line width, shadow and see-through; the display's `billboard` |
| Item metadata (`item-type-id`, `item-type-amount`) | The block of a falling block or block display, or the item and count of an item display or dropped item |

A look trait on another body type, such as a sheep trait on a player, changed nothing in Citizens either and is kept with that reason. Traits of bodies Animus does not present (area effect clouds, boats and interaction entities) are kept.

### Waypoints

Waypoints become a route in the NPC's `modules["animus:navigation"]`, with world mappings applied. The NPC walks it once the import is applied.

| Citizens | Animus route |
| --- | --- |
| `linear` | `order: sequence` that loops, or `pingpong` when `cycle` is on |
| `guided` | `order: random`: destinations become `points` and guide waypoints `guides`; the NPC walks to a random destination through the guides. `distance` (or the NPC's pathfinding range) becomes `linkDistance` |
| `wander` | `order: wander` around the region centers, or around the NPC's position. `xrange` and `yrange` become `wander.radius` and `height` (at most 32 and 8); a `delay` of -1 becomes 60 ticks |
| `delay` trigger | The point's `waitTicks`; several delays on one point add up |
| `speed` trigger | The point's `speed`: 4.3 blocks per second times the trigger's modifier, within 1 to 5, for every later leg |
| `teleport` trigger | The point's `teleport`, with its exact position and facing; one in another world names that world |
| `chat` trigger | `animus:message` in the behavior `citizens:waypoints-<id>`: to players within the trigger's radius (at most 64 blocks), or to the NPC's world when the radius is unset |
| `command` trigger | `animus:command` from the console in `citizens:waypoints-<id>` |
| `animation` trigger | `animus:animate` in `citizens:waypoints-<id>`; its `at` becomes the point's `teleport` when the point has none |
| Speed modifier | `speed` of 4.3 blocks per second times the modifier, within 1 to 5 |

Every route made from Citizens waypoints opens doors (`openDoors: true`) and drops at least 3 blocks: when the Citizens save sets a fall distance below 3, which is common and blocks most legs that step off a ledge, it becomes `maximumFall: 3`. A save with no fall distance leaves `maximumFall` unset. Both are in the NPC's [movement](/animus/05-movement-mounts-riding) settings, so lower them there if a route should not. The import report's warnings say how many routes changed and how many had their fall distance raised.

Points move to the center of their block. Citizens saves the block you clicked, which is usually the ground under the NPC's feet, so a point that names a solid block, a top slab or a stair is walked to the surface on top of it, and a stuck NPC that teleports lands there instead of inside the block. A waypoints trait with no points, which Citizens saves for many NPCs that never had a route, converts to nothing and is not counted as kept. Points in another world are left out. `citizens:waypoints-<id>` runs each point's chat lines and commands, in order, on the `waypoint` trigger for that point; `<npc>` and `<id>` are written in, and a line or command that names the player (`<p>` or `<player>`) is left out, since an arrival has no player. Its commands run under the `citizens` namespace like the other [commands](#commands). Animations become `swing`, `swing_offhand`, `hurt`, `crit`, `magic_crit`, `wake`, `sleep`, `sit`, `sneak`, `stand`, `use_item` and `stop_using_item`; elytra flight has no Animus animation and is reported. Any other provider is kept in `citizens:review` and reported for each NPC. Long legs and destinations no guide reaches need no extra points. Routes are described in [movement](/animus/05-movement-mounts-riding).

### Look-close

An enabled look-close trait becomes `modules["animus:look-close"]` with its `range`, `lineOfSight` (Citizens' realistic looking) and `whileNavigating` (the opposite of disable-while-navigating). NPC targets become `npcs`, and random looking becomes `randomLook` with its delay and yaw and pitch ranges. It needs no review: the NPC turns to the nearest player once it is spawned. Citizens writes a look-close setting only when it differs from the server's default, so when a save only ever writes `enabled: false`, an unset value means on; the report says when the import assumed this. An armor stand is the exception: it keeps its posed facing unless its own save writes `enabled: true`, and its report says so.

Head-only looking becomes `headOnly`, unless linked body is also on, which turns the body with the head as Animus does anyway. Per-player looking becomes `perPlayer`. A filter's `permission` nodes become `permissions`, and each `group` becomes the permission `group.<name>`, which LuckPerms and most permission plugins grant to the group's members. A filter whose `type` leaves out players admits nobody, so look-close converts turned off and the report says so. Random target switching becomes `switchTicks`, set to the random look delay (60 ticks when unset).

The rotation trait's turning speed becomes `turnRate` when it differs from Citizens' default of 40 degrees of yaw and 10 of pitch a tick; `lockPitch` becomes a pitch rate of 0, and immediate rotation needs nothing. Its own head-only and linked-body settings change nothing, since look-close sets them each time it turns the NPC.

### Follow

Citizens' `followtrait` becomes a `guard` in `animus:combat` that follows the same player, or the same NPC when the UUID is an imported NPC's. The margin becomes `followDistance` (2 blocks when unset) and `pointRange` is 1, so the NPC walks up close behind. `protect` keeps its meaning: with it the NPC attacks whatever hurts the one it follows; without it the guard has `protect: false` and `fightBack: false` and only follows. A guard catches up by teleport when its charge is more than 24 blocks away or in another world; set `catchUpDistance` to 0 to make it walk. See [guards](/animus/08-combat).

### Anchors and mirroring

Citizens anchors become the definition's [`anchors`](/animus/04-npc-definitions#anchors): each `name;world;x;y;z` keeps its position, the name is lowercased with other characters changed to `-`, and an anchor in the NPC's world names no world. The world mapping applies. An anchor that is not five parts is kept and reported.

The mirror trait becomes [`animus:mirror`](/animus/04-npc-definitions#mirroring-the-viewer) when it is enabled: the viewer's skin, with `mirrorName` the viewer's name and with `mirrorEquipment` the viewer's equipment.

### Home and pausing

Citizens' `hometrait` becomes [`animus:home`](/animus/05-movement-mounts-riding#returning-home) when its home is in the NPC's world: its delay becomes `delayTicks`, its distance `distance` (Citizens' -1 becomes 0), `PATHFIND` becomes `return: walk` and `TELEPORT` `return: teleport`. It needs no review. A home in another world is kept and reported.

`pausepathfinding` becomes the [`pause`](/animus/05-movement-mounts-riding#routes) of the NPC's route: `playerrange` becomes `playerRange` (at most 64), `rightclick` `onClick`, `pauseticks` `ticks` (20 when unset or 0) and `lockoutduration` `lockoutTicks`. An NPC with no route keeps the trait for review.

### Text

Citizens text becomes the behavior `citizens:text-<id>` in `behaviors/citizens/`, listed in the NPC's `behaviors`. Talk-close NPCs speak when a player comes within the talk range (at most 32 blocks); others speak when right-clicked. The delay is each player's own cooldown, `playerCooldownTicks` on the trigger (100 ticks when Citizens chose a random delay), as in Citizens. A random talker picks a random line; otherwise the lines take turns. `<br>` starts a new message, `<p>` and `<player>` become the player's name, and color codes are kept. A talk item becomes a check of the clicking player's held item, so only a player holding one of the listed items is answered. Speech bubbles become each line's `bubbleTicks` (Citizens' bubble duration, 50 ticks by default), and an NPC that sent no text to chat speaks only in the bubble.

### Commands

Citizens commands become the behavior `citizens:commands-<id>`. Right-click and left-click commands get their own interaction triggers, and the `SHIFT_RIGHT`, `SHIFT_LEFT` and `SHIFT_BOTH` hands get `sneak_interact` and `sneak_attack` triggers. Player commands run as the player and others from the console; an operator command runs from the console. `random`, `cycle` and `sequential` execution modes take turns per NPC, or per player for `sequential`. In Citizens a sneaking click runs only the SHIFT and BOTH commands; in Animus the RIGHT and LEFT commands run on it too, and the report says so when an NPC has both. A player or operator command that casts a MythicMobs skill, `mm test cast <skill>`, becomes the [`mythic:cast-skill`](/animus/36-mythicmobs#citizens-npcs-that-cast-mythic-skills) action cast as the player.

Each command keeps its checks, in this order, with Citizens' error message when one fails:

| Citizens | Animus |
| --- | --- |
| `permissions` | `animus:has-permission` checks. |
| `cooldown` (seconds, per player) | A flag between the player and the NPC that expires after the cooldown. |
| `globalcooldown` (seconds) | A flag on the NPC that expires after the cooldown. |
| `n` (uses per player) | A quest stage between the player and the NPC; the command stops once it reaches `n`. |
| `gn` (uses for everyone) | A quest stage on the NPC. |
| `cost`, `experienceCost`, `itemCost` | [`animus:can-afford`](/animus/07-behaviors#charging-players) for each part, then one [`animus:charge`](/animus/07-behaviors#charging-players) that takes all of it. Money goes through Vault. |
| `delay` (ticks) | A wait before the checks. |
| `npc` | The NPC's name in place of the player's in the command. A command the NPC's own player body ran (`npc` and `player`) runs from the console. |

The command trait's own `cost`, `experienceCost` and `itemRequirements` are charged once per click before any command runs. `customErrorMessages` replace the default messages and `hideErrorMessages` sends none. The flags and stages are named `commands-<id>-<command>-cooldown`, `-global-cooldown`, `-uses` and `-global-uses` in the `citizens` namespace; `/animus behaviors state delete` resets them. Uses and cooldowns counted in Citizens start again from zero. An item cost that cannot be matched exactly, because its item data has no item component, leaves that command out and the report says so. Temporary permissions are reported and not granted.

Commands and skill casts run once the import is applied, because apply adds `citizens` to `commandNamespaces` under `[behaviors.actions]` in `config.toml`. The preview says how many imported behaviors and shops run commands. A command's cost, cooldown and use count are taken before it runs, and only after an [`animus:commands-allowed`](/animus/07-behaviors#conditions) check, so a command the allow-list refuses costs the player nothing.

> Read each command in `behaviors/citizens/` before you allow it. Anyone who can edit an allowed behavior can run console commands.
{.is-warning}

### Command add-ons

Commands saved by the CitizensCMD and CommandNPC add-ons join the same `citizens:commands-<id>` behavior, after the NPC's Citizens commands.

| CitizensCMD | Animus |
| --- | --- |
| `[console]` and `[none]` lines | Console and player commands. `%p%` and `%player%` become the player's name, and a `(seconds)` delay becomes a wait. |
| `[message]` lines | `animus:message`, with `{name}` as the NPC's name. |
| `[<permission>]` lines | Player commands, run with the player's own permissions. |
| `cooldown` | A flag per player and NPC; `-1` (one click) never expires. |
| `price` | Charged on right click before the commands and their delays run, at once rather than on a second click. Left-click commands run without charging, as CitizensCMD runs them. |
| `permission` | A permission check for the NPC's commands. |

`[server]` and `[sound]` lines are reported and not converted.

| CommandNPC | Animus |
| --- | --- |
| Command, click type and permission | A command on that click behind a permission check, with the no-permission message unless the line hides it. `%name` becomes the player's name. |
| Console, operator | Console commands; operator commands run from the console. |
| Cost, delay and cooldown | A wait, then a charge just before the command and a flag per player that expires after the cooldown, with the line's cooldown message. |
| Random | One of the NPC's commands at random per click. |

BungeeCord `server` commands are reported and not converted.

### Shops

<div class="animus-demo">
<p><strong>Citizens shop and economy import</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/40-citizens-economy-ingame.webm" aria-label="Trading in an imported Citizens shop and using a paid command NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Citizens keeps its shops in `shops.yml`: named shops, and each NPC's own shop. Each converts to `shops/citizens/<name>.json` with the id `citizens:<name>`, where the name is lowercased with other characters as `-`; an NPC's own shop is `citizens:npc-<id>`. An NPC whose `shop` trait opens a shop on right click gets `modules["animus:shop"]` for the named shop, or for its own shop when no named shop has that name. Shops open on click once the import is applied; `/animus shop open <shop>` opens one by hand.

| Citizens shop | Animus |
| --- | --- |
| `title`, `viewPermission` | The shop's `title` and `permission`. |
| `type` | `TRADER` opens the trading screen (`style: native`); the chest types keep their rows, and the default is 5 rows. |
| Pages and their items | Pages in order, each item in its slot. The previous and next page buttons are the window's own. |
| Money for items | A `buy` entry. |
| Items for money | A `sell` entry. |
| Items for items | A `trade` entry, with any money as its price. |
| Money for commands | A `command` entry. Command results and command costs both run after the purchase, `<p>` becoming the player's name. |
| Experience cost | The entry's `levels`, taken with the price. Entries with no experience cost get no `levels`. |
| Experience result | The command `xp add {player} <levels> levels`, run from the console. |
| Permission cost | The entry's `permission`. Citizens takes the permission away; Animus only checks it. |
| `timesPurchasable`, `globalTimesPurchasable` | The entry's `limit` per player and for everyone. Purchases counted in Citizens start again from zero. |
| `maxRepeatsOnShiftClick` | `allowStack` on buy and sell entries. |

An item whose costs and results do not fit one entry is shown as a `static` entry, which trades nothing, and the report says why: experience costs on a sale, permission results, condition and open-shop actions, items that cannot be matched exactly, and mixes such as items for items and money. The item's messages and expressions are reported. An NPC's limited money and item storage is not kept.

### Drops

The drops trait becomes `death.drops` in the NPC's [`animus:health`](/animus/08-combat#health-and-death), each with its chance. An NPC without a health module gets one, killable when Citizens left it vulnerable (`/npc vulnerable`), since only then could it die and drop anything.

### Builder

Builder's `builder` trait becomes an `animus:builder` section: the schematic name (as `<name>.schem`), pattern, ignore-air, ignore-liquid, excavate, hold-items, required materials (as `materials: donate`), move timeout, Y offset, layers and silent mode. The whole trait is kept under `animus:builder.imported` and in `citizens:review`, and every key that does not convert is reported. A build Builder saved while building or collecting materials gets the behavior `citizens:builder-<id>`, which starts it again once, on the NPC's first spawn; blocks already in place are skipped. Other builds start with `/animus build start <npc-id>`. Outstanding materials, the resume point and Denizen task names are kept, not run. Constructor's `constructor` trait is kept for review and its keys are reported. Builder `.schematic` files must be saved again as `.schem`; see [building](/animus/09-building).

## Sentinel settings

Each Sentinel record becomes `modules["animus:combat"]` with `enabled` set to `true`, and [`modules["animus:health"]`](/animus/08-combat#health-and-death) with its health, armor, invincibility, drops, experience, respawn time and spawn point. The guard fights and takes damage once the import is applied. The unchanged Sentinel record stays in `citizens:review` and in the import archive.

The module keeps three things apart:

- The converted settings, described in [combat](/animus/08-combat). A field missing from a save means Sentinel's own default, so those defaults are written out rather than replaced by Animus defaults.
- `preservedSettings`: every unsupported or unknown field, plus the original value of any converted field that could not be represented exactly (out of range, malformed, invalid patterns, target entries with no equivalent rule, item data, an unresolvable guarded NPC). Nothing here runs.
- `historicalStatistics`: the `stats_*` counters, as imported. They are not updated.

`migrationReport` lists which source fields converted, which are unsupported or unknown, and a note for every value that was adjusted. `autoswitch` and `weapon_redirect_map` are kept, not converted.

| Sentinel field | Animus setting | Notes |
| --- | --- | --- |
| `allTargets`, `allIgnores`, `allAvoids` | `targets`, `ignores`, `avoids` | See the target list table below. |
| `range` | `targeting.scanRange` | Limited to 256; the server's `maximumScanRange` (default 100) applies at runtime. |
| `realistic`, `ignore_los` | `targeting.lineOfSight` | `ignore_los` gives `ignored`, else `realistic` gives `field_of_view`, else `required`. |
| `enemyTargetTime`, `reaction_slowdown`, `retain_target`, `fightback` | `targeting.memoryTicks`, `reactionTicks`, `retainTarget`, `fightBack` | Ticks. |
| `avoidRange`, `runaway`, `avoidReturnPoint` | `avoidance.range`, `fleeWhenAttacked`, `returnPoint` | |
| `squad` | `squad.name` | |
| `guardingUpper` + `guardingLower` | `guard.player` | The two halves form the player UUID. |
| `guardedNPC` | `guard.npc` | Resolved to the guarded NPC's UUID in the same import, and to the copy's UUID when applied as a copy; otherwise kept. A guarded player takes precedence. |
| `guard_distance_minimum`, `guard_selection_range` | `guard.followDistance`, `pointRange` | |
| `chaseRange` | `pursuit.leashRange`, `giveUpRange` | |
| `speed` | `pursuit.speed` | 1 means walking speed, 4.3 blocks per second; limited to 1-10. The server's `maximumSpeed` (default 8) applies at runtime. |
| `close_chase`, `ranged_chase`, `disable_teleporting` | `pursuit.closeChase`, `rangedChase`, `teleportWhenStuck` | |
| `worldguard_region` | `pursuit.region` | Checked through WorldGuard on Bukkit; unavailable with a diagnostic elsewhere. |
| `damage` | `melee.damage`, `ranged.damage` | `-1` (the default) becomes `fromEquipment: true` on both; `0` disables melee. |
| `weapon_damage_map` | `melee.weaponDamage` | Material names become `minecraft:` item ids. |
| `attackRate`, `attackRateRanged` | `melee.cooldownTicks`, `ranged.cooldownTicks` | Ticks. |
| `reach` | `melee.reach` | Limited to 6. |
| `projectileRange`, `accuracy`, `safeShot` | `ranged.range`, `inaccuracy`, `safeShot` | Ranged attacks are enabled when the imported held item is a weapon: bow or crossbow (`arrow`), spectral arrow, trident, blaze rod (`fireball`), snowball, egg or wither skeleton skull (`wither_skull`). A held potion is not converted, because its effect is item data. |
| `needsAmmo` | `ranged.useAmmo` | Counts the imported inventory. |
| `health` | `animus:health` `maximumHealth` | Maximum, not current health. |
| `armor` | `animus:health` `armor` | `-1` (the default) becomes `armorFromEquipment: true`. |
| `invincible`, `protected`, `protectFromRange`, `allow_knockback`, `healRate` | `animus:health` `killable` (the opposite of `invincible`), `protectedFromIgnored`, `protectFromRange`, `knockback`, `regenerate` and `regenerateTicks` | `protected` means protection from ignored targets, not region protection. A heal rate of 0 turns regeneration off. |
| `drops`, `dropChances` | `animus:health` `death.drops` | Plain items with their chances convert; items with extra data keep the whole original list. |
| `enemyDrops`, `death_xp` | `victimDrops` on `animus:combat`, `animus:health` `death.experience` | |
| `respawnTime`, `spawnPoint` | `animus:health` `respawn.delayTicks`, `points` | `0` becomes `afterDeath: permadeath`, so the NPC stays dead until revived. Below 0 becomes `afterDeath: delete`, so the definition is deleted when the NPC dies, as one transaction that `/animus rollback` undoes. |
| `greeting_text`, `warning_text`, `greet_range`, `greet_rate` | `greetings.friendly`, `hostile`, `range`, `cooldownTicks` | Empty text means no line. |

Target list entries:

| Sentinel entry | Rule | Notes |
| --- | --- | --- |
| `targets`: categories and entity names | `categories`, `entityTypes` | `PLAYERS`, `NPCS`, `MONSTERS`, `MOBS`, `PASSIVE_MOBS`, and entity names with their plural aliases. |
| `targets`: `OWNER` | `owner: true` | Matches the definition's `owner`, which the import takes from the Citizens owner. Every new Sentinel NPC ignores its owner, so imported guards never attack it. |
| `byPlayerName`, `byNpcName`, `byEntityName` | `patterns.players`, `npcs`, `names` | Sentinel names are case-insensitive regular expressions that match anywhere, so they stay patterns. An invalid pattern is kept. |
| `byHeldItem`, `byOffhandItem`, `byEquippedItem` | `items.mainHand`, `offHand`, `worn` | `name:` and `lore:` matchers are kept. |
| `byGroup` | `groups` | |
| `byOther` `squad:`, `uuid:` | `squads`, `players` | |
| `byOther` `healthabove:`, `healthbelow:` | `healthAbove`, `healthBelow` | Several thresholds become the widest one, which matches the same targets. |
| `byOther` `potion:` | `effects` | Old Bukkit effect names such as `INCREASE_DAMAGE` become their current ids. |
| `byOther` `permission:` | `permissions` | |
| `byAllInOne` | `all` | A combined list converts only when every entry in it does. |
| `byMultiple` | `together` | Each entry becomes one part; a group needs 2 to 8 parts. |
| `byEvent` `pvp`, `pve`, `eve`, `pvnpc`, `pvsentinel`, `npcvnpc` | `events.kinds` | `player_hurts_player`, `player_hurts_mob`, `mob_hurts_mob`, `player_hurts_npc` (both `pvnpc` and `pvsentinel`, since only combat NPCs can be hurt) and `npc_hurts_npc`. Not available in ignores. |
| `byEvent` `pv:<target>`, `ev:<target>` | `events.playerAttacks`, `anyAttacks` | |
| `byEvent` `message:<text>` | `chat` | |
| `byEvent` `guarded_fight` | `guard.assist: true` | In target lists only. |
| `byInventoryItem`, `byStatus`, `byOther` from other plugins (`sbteam`, `npc_owned_by`, Towny, Factions and others) | Kept | No equivalent rule. |

## Shopkeepers

`/animus import citizens preview` also imports a Shopkeepers save. There is no separate command: the Shopkeepers shops join the same preview, apply, review and rollback, so one rollback undoes both imports in order.

1. Remove the Shopkeepers jar from `plugins/` and keep its data folder. Animus refuses to apply Shopkeepers shops while Shopkeepers is enabled, so no shop trades twice.
2. Leave `plugins/Shopkeepers/data/save.yml` where it is, or copy it to `plugins/Animus/imports/shopkeepers/save.yml` (`imports/inbox/shopkeepers/save.yml` also works). The `config.yml` beside it is read too (`plugins/Shopkeepers/config.yml`, or `config.yml` next to the copied save): its currency items, high currency value, minimum cost and trade log setting change how player shops convert.
3. Run `/animus import citizens preview`. The preview lists shops, trading offers, offers that only show, offers kept in the source, new mob NPCs and how many Citizens links it found. The report is `imports/shopkeepers/<import-id>/report.json`, with one report per shopkeeper under `reports/`.
4. Run `/animus import citizens apply`. The shops open on their NPCs and the new mob NPCs spawn at once.

The order does not matter. With both saves present, both stage together. If the Citizens import is already applied, a Shopkeepers save found later stages on its own and binds to the installed NPCs. If the Shopkeepers save is applied first, its Citizens shopkeepers wait, and they bind when the Citizens import is applied.

| Shopkeeper | Becomes |
| --- | --- |
| Any shopkeeper | Shop `shopkeepers:shop-<id>` in `shops/shopkeepers/shop-<id>.json`, one trade entry per offer, 45 offers a page. The name becomes the title. The shop opens in the villager trading screen (`"style": "native"`), as Shopkeepers shows it; change `style` to `chest` for the chest window. |
| Admin shop | Unlimited trades: each recipe's first and second item are the needs, the result item is the gift. `tradePerm` becomes the shop permission. A closed shop (`open: false`) shows its offers and trades nothing. |
| Selling player shop | An owned shop whose stock is its container. The price becomes the currency items Shopkeepers asks for: high currency first when the price is above the minimum cost, the rest in base currency. |
| Buying player shop | The player gives the item and gets the price in base currency from the container. |
| Trading player shop | The player gives the first and second item and gets the result item from the container. |
| Book player shop | Kept in the source and reported. A book offer copies a book by title, which is not an item-for-item trade. |
| Citizens object | `modules["animus:shop"]` on the NPC converted from that Citizens NPC, matched by its Citizens UUID (or numeric id). |
| Mob object | A new NPC `npcs/shopkeepers/shopkeeper-<id>.json` of that mob at the shopkeeper's place, spawned, with its shop bound. A villager's profession and level go to `modules["animus:shop"].villager`, which its trading screen title shows. Other mob settings (villager type, baby, equipment and so on) are kept in `modules["shopkeepers:review"]`. |
| Sign, hanging sign or virtual object | The shop only, with the sign data kept in the shop's `imported` section. Open it with `/animus shop open <shop>` or bind it to an NPC. |

Items are written exactly: Shopkeepers saves each item component as the text the give command reads, and that text becomes the item's `components`. An offer with item data that cannot be written exactly (old Bukkit item meta, components over 4096 characters) shows in the shop, trades nothing, and keeps the data in `imported`; the report lists it. A player shop without an owner or a container also only shows its offers. Owners, members, hire settings and expiry are kept in the shop's `imported` section and not used. Owned shops are described in [container shops](/animus/10-shops#container-shops).

## Denizen

`/animus import citizens preview` also converts Denizen scripts and flags, so Denizen can be removed after the migration. There is no separate command: the Denizen part joins the same preview, apply, review and rollback, and it needs the Citizens save beside it.

1. Remove the Denizen jar from `plugins/` and keep `plugins/Denizen/`. Animus refuses to apply the converted scripts while Denizen is enabled, so no script runs twice.
2. Leave `plugins/Denizen/` where it is, or copy its `scripts/` folder, `server_flags.dat`, `player_flags/` and `notables.yml` to `plugins/Animus/imports/denizen/` (`imports/inbox/denizen/` also works). Animus reads every `.dsc` and `.yml` file under `scripts/`, and the noted cuboids and ellipsoids in `notables.yml` for area events. It never reads `secrets.secret`.
3. Run `/animus import citizens preview`. The preview counts the scripts, the behaviors made and the NPCs they belong to, the flag values imported and kept, and the items kept with a reason. The report is `imports/denizen/<import-id>/report.json`. It lists every script, command, tag and event as converted or kept, and every kept item with its file, line and reason.
4. `/animus import citizens apply` installs the behaviors in `behaviors/denizen/`, the chest GUIs in `gui/inventories/denizen/` and the flag values as behavior state, lists the behaviors on the NPCs that had the assignment, and enables the [server behaviors](/animus/07-behaviors#server-behaviors) the report lists in `serverBehaviors`. Restart once so the imported flag values load. [Held behaviors](#guards-that-do-not-convert) stay unbound and off.

Rollback removes the behaviors, the GUIs, the imported state and the NPC bindings with the rest of the import.

### What converts

| Denizen | Becomes |
| --- | --- |
| `assignment` script | `denizen:assignment/<name>`: `on click` becomes an `interaction` trigger, `on damage` an `interaction` trigger with `action: attack`, `on enter proximity` and `on exit proximity` `proximity` triggers, and `on spawn`, `on despawn` and `on death` the triggers of the same names. The trigger lines of `on assignment` are read as settings; its other commands become the `on-assignment` routine, run by a `spawn` trigger once per NPC behind the NPC flag `assigned-<name>`. The import sets that flag on every NPC that already had the assignment, so those NPCs do not run it again |
| `interact` script | `denizen:interact/<name>`. The step is a relationship quest stage, `interact-<name>`, 0 for the default step (marked `*`, or the first) and 1 onwards for the others in file order. Click and proximity triggers call the routine of the current step |
| Chat trigger | An `animus:choices` button after the step's click, with a `dialogue_choice` trigger. A phrase with a regex, `*` or a tag is kept |
| `task` script | A routine in each behavior that runs it, and the behavior `denizen:task/<name>` to run by hand. Other lists in the task become routines for `run <task> path:<key>` |
| `procedure` script | A routine, `proc-<name>`, in each behavior that reads it. `determine` becomes `return` with the value |
| `world` script | The server behavior `denizen:world/<name>`, with one routine and trigger per event: `player joins` is `player_join`, `player quits` `player_quit`, `player chats` `player_chat` (`message:` becomes its `pattern`), `player dies` `player_death`, `player respawns` `player_respawn`, `player changes world` `player_world_change` (with `from` and `to`), `server start` `server_start`, and `delta time secondly`, `minutely` or `hourly` with `every:` a `timer`. The [world events](/animus/07-behaviors#world-events) convert too: `player enters <area>` and `player exits <area>` become `player_area` with the bounds of that noted cuboid or ellipsoid (from `notables.yml` or a literal `note ... as:<name>` in a script); `player opens`, `closes` and `clicks in` an inventory the inventory events (`in:` and the inventory type name their `inventory`, `click:` their `click`); `player drops`, `picks up` and `consumes` an item the item events; `player clicks`, `right clicks` and `left clicks` a block, `places` and `breaks` the block events (`with:` checks the held item); `player damaged` (by a cause or an entity type) `player_damaged`; `player damages <entity>` and `<entity> damaged by player` `player_damage_entity`; and `player kills <entity>` `player_kill`; `<projectile> launched` `projectile_launch`; `<projectile> hits`, `<projectile> hits <block>`, `<projectile> hits entity` and `<projectile> collides with <entity>` `projectile_hit` (the switches `entity:`, `block:` and `shooter:` become its filters, and the older `<entity> shoots <block>` is a hit by that shooter); and `<entity> shoots bow`, `crossbow` or `item` `entity_shoot_bow` (`with:` names the bow). A material or entity type after the verb becomes the trigger's filter. `player right clicks entity`, `player damages npc`, and `player damages entity` in a script that checks `<context.entity.is_npc>`, become an `interaction` trigger of `denizen:world-npc/<name>`, a behavior bound to every NPC. When the event's leading `if ...: stop` guards include `if !<player.is_sneaking>`, the trigger takes `sneak_interact` or `sneak_attack`, so only a sneaking click on the NPC itself starts it. In a script that checks `<player.target.is_npc>`, `player drops item` becomes a `drop` trigger and `player swaps items` a `swap_hands` trigger of that behavior, and `<player.target>` reads the NPC; when the script does not cancel the event, the trigger gets `"consume": "false"` so the item still drops or swaps. The switches `flagged:`, `server_flagged:`, `permission:` and `in:` (read as a world name) become conditions around the routine; `priority:` and `ignorecancelled:` are dropped |
| `determine cancelled` in an event | When it stands at the top level of a cancellable event, after `if ...: stop` guards and `ratelimit` lines only, those guards become the trigger's `cancel` condition, or `consume` on an NPC click, and the event is cancelled as it happens. A rate-limited event is left alone, as in Denizen, where the script stops before it cancels: a sneak-click inside the window still reaches the NPC's shop. `determine passively cancelled` goes on with the lines after it |
| `command` script | The server behavior `denizen:command/<name>` with a `command` trigger for its `name`, `aliases` (up to 8), `permission`, `description` and `usage`. `<context.args>` and `<context.raw_args>` read the typed arguments |
| `book` script | The server behavior `denizen:book/<name>`, which gives the book with `animus:give-book`. `give <book>` and `adjust <player> show_book:<book>` give it in place |
| `inventory` script | A [chest GUI](/animus/11-guis-holograms-menus), `guis/denizen/<name>.json` in the preview and `denizen:<name>` once installed, with its `title`, its `size` or `inventory` type (`chest`, `hopper`, `dropper`) and the fixed items of `slots` as decoration keys. `inventory open d:<name>` becomes `animus:open-gui` |
| `data` script | Its values are copied where they are read: text in place, lists as list values, maps through a temporary variable |
| `item` script | Used by `give` and in GUI slots when it sets only `material`, `display name` and `lore` |
| Trigger on or off, cooldown, radius | Read from the NPC's saved `triggers` (`CLICK`, `PROXIMITY` and so on). A trigger that is off on every NPC with the script is kept |
| Tags | [Expressions](/animus/07-behaviors#expressions) over the run's values. `<[name]>` is the execution variable `d_<name>` (dots inside walk map keys). `<player.name>`, `uuid`, `location`, `health`, `world`, `item_in_hand` and the like read player facts, `<npc.*>` NPC facts, `<player.flag[...]>`, `<player.has_flag[...]>`, `<server.flag[...]>` and the NPC forms the `denizen` flags, `<util.random.int[a].to[b]>` and its kin the random functions, `<context.*>` the event's values (`<context.location.x>`, `<context.item.material.name>`, `<context.inventory.inventory_type>` and the like read the keys the world events pass), `<npc.id>` the Citizens id `npc.citizens_id`, `<server.online_players>` the list `server.players`, `.name`, `.is_online`, `.has_flag[...]` and `.flag[...]` of a definition or loop value holding a player that player's facts and flags, and element, list and map attributes (`add`, `length`, `get`, `contains`, `replace`, `separated_by` and so on) the matching functions. In text a tag becomes a `{{ expression }}` hole. Color tags become `&` codes, `<&color[#hex]>` becomes `&#hex`, and escapes such as `<&co>` and `<&chr[2764]>` become their characters |
| `define` | `set` of the definition's variable to a literal, an expression or a template; `define x:++` and the other data actions compute the new value |
| `if`, `else if`, `else`, `choose` | `condition` nodes with one expression. `==` and `!=` compare as Denizen does (numbers as numbers, other text ignoring case), `<`, `>`, `<=` and `>=` compare numbers, and `contains`, `in` and `matches` (alternatives with `\|` and `*` at either end) convert, joined by `&&`, `\|\|`, `!` and parentheses. `has_permission` stays an `animus:has-permission` condition. `choose` reads its value once and compares it with each `case` |
| `foreach`, `repeat`, `while` | `foreach` over a list or map with `as:` and `key:`, `repeat` with a literal or computed count, and `while` with its condition. `<[loop_index]>` and `<[value]>` read the loop's pass. `foreach stop`, `repeat next` and the like become `break` and `continue` |
| `stop`, `determine` | `return`. In a task or procedure `determine` returns its value |
| `run`, `inject` | `call` of the task's routine. `def:`, `def.<name>:` and a literal `defmap:` set its definitions first; `save:` with `<entry[...].created_queue.determination>` reads its returned value. `<proc[...].context[...]>` runs the procedure in a `call` before the command that reads it |
| `flag player`, `flag npc`, `flag server` | `animus:set-flag` on the `denizen` flag with its value: a literal, a tag, or the data actions `++`, `--`, `+:`, `-:`, `*:`, `/:`, `->:`, `<-:` and `\|:`. `:!` clears it and `expire:` sets `expireSeconds`. Scopes are `player`, `npc` and `global`; dots in names become dashes. A name joined with tags, such as `npc_done_<npc.id>`, is computed as the run writes it; since `<npc.id>` is the NPC's Citizens id, the run writes `npc_done_284` for the NPC imported as `citizens-284`, the same name the imported flag has, so a player who finished that dialogue under Denizen is not shown it again |
| `zap` | `animus:set-quest-state` on the step stage |
| `wait` | `wait` |
| `cooldown` | In an interact script, the click trigger's `playerCooldownTicks`, or its `cooldownTicks` with `global`. The longest one in the script wins. |
| `engage`, `disengage` | Nothing: an interaction trigger already drops a player's clicks while their run of it is going. Other players are not held back, as they are by an engaged Denizen NPC |
| `narrate`, `announce`, `chat` | `animus:message` to the player, or `to: all` for `targets:<server.online_players>` and for `announce` (`to_console` goes to the console); `chat` is `animus:say` to nearby players |
| `title`, `actionbar` | `animus:title` with its timings, and `animus:actionbar` |
| `targets:` of other players | `narrate`, `title`, `actionbar`, `playeffect` and `playsound <[someone]>` for a list of players, such as `<server.online_players>`, a list in a flag or definition, or one with `.filter[...]`, `.filter_tag[...]` or `.exclude[...]`, become a [`foreach`](/animus/07-behaviors#player-lists) over `players(...)` that runs the action once for each player, at most 100. The filters become a condition on each player |
| `note <cuboid> as:<name>` | Nothing at run time: a literal cuboid or ellipsoid becomes the bounds of that area's triggers |
| `give`, `take` | `animus:give-item` and `animus:take-item` with the material and `quantity:` |
| `teleport` | `animus:teleport` of the player or the NPC to the other one or to a literal location |
| `adjust` | `name` and `item_in_hand` of the NPC become `animus:set-appearance` and `animus:set-equipment` |
| `execute` | `animus:command`, allowed by the `denizen` namespace that apply adds. `as_player` runs as the player. `as_op` also runs as the player, without operator rights, so a command that needs them fails; the report's `issues` lists each one |
| `execute` of `sentinel ...` | `animus:combat-control` on the behavior's NPC, since Sentinel is replaced by Animus combat: `addtarget <player>` attacks the triggering player, `removetarget <player>`, `forgive` and `forgiveall` release the target, `guard <player>` guards the triggering player and `guard` alone stops guarding. Target types (`addtarget monsters`), other NPCs (`--id 12`) and Sentinel settings such as `range` are kept with the reason; set them in the NPC's `animus:combat` |
| `trait state:true sentinel`, `trait state:false sentinel` | `animus:combat-control` `enable` or `disable`. A `trait sentinel` toggle is kept |
| `look`, `walk`, `equip` | `animus:look` at the player or a literal location, `animus:navigate` to a literal location, `animus:set-equipment` with plain materials |
| `playsound`, `playeffect` | `animus:play-sound` and `animus:spawn-particle` at the NPC or, for `<player>`, with `at: player`. Bukkit sound names become keys (`ENTITY_VILLAGER_YES` is `minecraft:entity.villager.yes`); the report's `sounds` lists every name read. Old particle names are renamed; particle speed and visibility are not carried |
| Flag values | Every flag of each player (`player_flags/`), NPC (`denizen_flags` in the Citizens save) and the server (`server_flags.dat`) becomes a `denizen` flag with its typed value: `true`/`false` a boolean, a whole number an integer, a decimal number a decimal, `li@` a list, `map@` a map, anything else text. An expiring flag keeps its expiry time. A player's interact steps become the relationship stage with every NPC that has the script |

Server behaviors run with no NPC, so a command there that needs one (`chat`, `look`, `walk`, `equip`, `flag npc`, `zap`, `<npc.*>` tags, sounds and particles at the NPC) is kept. Generated behaviors that use `animus:command` run once applied, because apply adds `denizen` to `commandNamespaces` under `[behaviors.actions]`.

### Guards that do not convert

A line that limits or ends a script and does not convert never lets the rest run unchecked. When an `if`, `else if`, `choose`, `while`, `foreach` or `repeat` does not convert and its block could stop the script (a `stop`, a `determine`, a `queue` command, an `inject` or a `ratelimit` inside it), the routine ends at that line, as if the guard had stopped it. The same happens at a `ratelimit`, `queue` or `inject` line that does not convert, and at an `inject` of a task that can stop, since Animus would end only the task. Every later line is kept with the reason `never runs`. A block that cannot stop the script is skipped, as if its condition were false, and the lines after it run.

Any of these, an unconverted `determine` or `cooldown`, and a command script `permission` that is not plain text of 1-256 characters hold the behavior: `behaviorStatus` marks it `held`, and `heldBehaviors` in the report lists its lines and the NPCs it would have been bound to. Apply leaves a held behavior off every NPC and out of `server-behaviors.json`: a guard that did not convert would let the behavior run for players the script kept out.

#### Releasing a held behavior

`/animus import denizen held` lists each held behavior, the NPCs it was made for or whether it is a server behavior, whether it runs commands, and the lines that did not convert with their reasons. Read the behavior in `behaviors/denizen/`, and fix it in the [editor](/animus/14-web-editor) or by hand if a guard matters.

`/animus import denizen release <behavior>` shows what it would release. `/animus import denizen release <behavior> confirm` lists the behavior on those NPCs and, for a server behavior, in `server-behaviors.json`, in one transaction. A server behavior starts once the behaviors reload. Both commands need `animus.import`. Releasing a behavior that runs commands in game also needs `animus.editor.commands`. `/animus import citizens rollback` undoes every release with the rest of the import.

### Kept with a reason

Each line below stays out of the behaviors and is listed in the report with its file, line and reason; a behavior missing some of its lines is marked `partial` in `behaviorStatus`, or `held` when one of them is a [guard](#guards-that-do-not-convert).

- Tags with no expression, such as `<player[name]>` and other tags of another player or NPC written that way, inventory and entity objects (`<context.inventory.list_contents>`), `||` fallbacks on anything but a flag, flag names that are a tag alone, computed definition names, and `matches` with regexes or a `*` in the middle.
- `determine` anywhere but the top level of a cancellable event after plain guards, and in events that cannot be cancelled (area events, closing an inventory, kills, joins, chat): the routine still ends there. Other `determine passively` lines are kept.
- World events without a server trigger, such as entity clicks other than NPCs and NPC events; projectile events that NPCs shoot or that hit an NPC, since NPCs fire combat projectiles that report nothing and real projectiles pass through them; `player enters area` without a noted area name; areas that are polygons, cuboids of several boxes or computed notes; and switches without an equivalent, such as inventory `action:`. Command script settings such as `tab completions` and `allowed help`.
- `procedural items`, `gui: false` and items with properties other than `quantity` in inventory scripts; item scripts with enchantments, mechanisms or flags.
- `format`, `economy`, `enchantment` and `map` scripts.
- Damage triggers in interact scripts (Animus damage triggers carry no player), proximity `move`, flags whose expiry time cannot be read, values over the state limits (256 items, 8 levels, 4096 bytes), a `foreach stop` that would end an outer loop, targets that are not players, other `adjust` mechanisms, `animate`, `bossbar` and other commands with no Animus action.

To rewrite kept logic by hand, see [moving imported flags and assignments](/animus/07-behaviors#moving-imported-flags-and-assignments).

## Kept but not converted

These are kept in each definition under `modules["citizens:review"]` and in the original archive, and are listed by `review`:

- Waypoints, look-close, text and commands that did not convert, with the reason in the NPC's report.
- Denizen assignments, triggers, flags and constants as Citizens saved them. The scripts themselves convert with the [Denizen](#denizen) part of the import.
- Settings with no Animus equivalent, such as a boss bar filled from a placeholder, attributes no supported Minecraft version registers, and Constructor data, whose saved keys are not published.
- Shop items shown as `static` entries, with the reason in the report.
- Every trait Animus does not know.

## Quest plugins

Quest files that name Citizens NPCs are pointed at the imported NPCs one plugin at a time, with `/animus import quests apply`, `import beautyquests apply` or `import betonquest apply`. See [after a Citizens import](/animus/26-quest-plugins#after-a-citizens-import).

## Rolling back

```none
/animus import citizens rollback
```

This undoes the shops, the generated behaviors and the NPC definitions, newest first, and deletes the copied schematics that have not changed. The removed shops and behaviors leave their catalogs at once, so `/animus behaviors reload` afterwards reports nothing missing. If you edited an imported NPC or shop after the import, rollback stops at the step that wrote it rather than overwrite the edit, and says which transaction it stopped at. The steps it already undid stay undone, and the copied schematics and command namespaces are removed either way. Undo the edit, for example with `/animus rollback <transaction-id>`, and run `/animus import citizens rollback` again; it continues where it stopped. The staged preview stays, so `/animus import citizens apply` installs it again.

Reinstall Citizens only after a rollback. Roll back the [quest links](/animus/26-quest-plugins#rolling-back) too, with `rollback` of each `import` quest command you applied.
