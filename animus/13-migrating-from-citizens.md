---
title: "Animus: Migrating from Citizens"
description: "Import Citizens NPCs with Sentinel, dtlTraders, Shopkeepers, Builder and Denizen data"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, citizens, migration, import, sentinel, denizen, shopkeepers, converter"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus reads the Citizens `saves.yml` and turns every NPC into its own definition file. Nothing runs until you apply the import, and patrols, combat, riding, shops, builds and converted scripts stay off until you accept them. You can undo the whole migration with one command.

The import commands need `animus.admin`. They work the same on Paper, Spigot, Folia and mod servers. On mod servers the data folder is `config/animus/` instead of `plugins/Animus/`.

## Steps

1. Back up the server. Stop it.
2. Remove the Citizens jar (and Sentinel, dtlTraders, Builder and Denizen) from `plugins/`. Keep their data folders. Animus refuses to apply, accept or run imported NPCs while Citizens is enabled, so the same NPC never runs twice.
3. Leave `plugins/Citizens/saves.yml` where it is, or copy it to `plugins/Animus/imports/saves.yml`. Animus also looks in `imports/inbox/saves.yml`.
4. Optional: copy the dtlTraders data folder to `plugins/Animus/imports/dtltraders/` (a folder left at `plugins/dtlTraders/` also works). Builder and Constructor schematics are found in `plugins/Builder/schematics/`, `plugins/Constructor/schematics/` or `plugins/Animus/imports/schematics/`.
5. Start the server. The console lists every save and folder it found (Citizens, Shopkeepers, dtlTraders and Builder schematics) and the next command.
6. Preview:

   ```text
   /animus import citizens preview
   ```

   This converts the save, stages a plan and prints the counts: NPCs, valid definitions, skins, folders, the patrols, look-close and behaviors it made, what stays off and what is kept but not run. Nothing is installed. A definition counts as valid only when it also passes the spawn checks that do not depend on the server, such as a skin needing a player body. A spawned NPC that still cannot start is logged once as a warning that names the field. The full report is `imports/<import-id>/report.json`, with one report per NPC under `reports/`.

   Each NPC report gives every Citizens field a status under `fields`: `CONVERTED`, `REQUIRES_REVIEW` (Animus has a near equivalent you should check), `UNSUPPORTED_PRESERVED` (kept in `citizens:review` and `records/`, not run) or `REQUIRES_INTEGRATION` (needs data that is not in the save, such as Denizen scripts). `reasons` gives a one-line reason for each field that is not converted, and for converted fields that change nothing. The migration warnings in `report.json` list only things you should act on, each saying what to do.

   Options: world mappings such as `worlds=world_old:world` when a world has a new name, and a mode for NPCs that already exist in Animus (see [collision modes](#collision-modes)). For example `/animus import citizens preview mode=replace worlds=world_old:world`. Add `factor-groups=true` to move settings that two or more NPCs share into [trait groups](/animus/18-trait-groups#citizens-import); the converter's `preview` takes `--factor-groups`.
7. Apply:

   ```text
   /animus import citizens apply
   ```

   Every NPC is installed at its Citizens position, despawned. dtlTraders shops are installed in the same step, and `.schem` and `.nbt` schematics are copied into `schematics/`. Text and command behaviors made from the save are installed in `behaviors/citizens/`. Apply, accept and rollback reload the shops, GUIs and behaviors they change, so new shops trade and removed ones close at once, with no reload or restart.
8. Review, then accept:

   ```text
   /animus import citizens review
   /animus import citizens accept all
   ```

   `review` lists how many NPCs wait in each category. Accept them all, or one category at a time with `accept <category>`:

   | Category | What accepting it does |
   | --- | --- |
   | `spawn` | Spawns every NPC Citizens had spawned. NPCs that were despawned in Citizens stay despawned. Look-close and text start with the NPC. |
   | `patrols` | Turns on the routes made from Citizens waypoints. |
   | `combat` | Turns on the Sentinel settings converted to `animus:combat`. Every guard becomes a combatant; at most `[combat] maximumNpcs` fight or scan at once and guards with no player near sleep. `review` and `accept` say when more guards are accepted than that. See [combat work limits](/animus/08-combat#work-limits). |
   | `riding` | Turns on riding for NPCs that had the `controllable` trait. |
   | `shops` | Lets dtlTraders and Shopkeepers NPCs open their shop on click. |
   | `builder` | Lets Builder sections run with `/animus build start <npc-id>`. Builds never start on their own. |
   | `denizen` | Lists the behaviors converted from Denizen scripts on the NPCs that had the assignment and enables the converted server behaviors. See [Denizen](#denizen). |
   | `commands` | Adds the namespaces of the imported command behaviors (`citizens`, `denizen`) to `[behaviors.actions] commandNamespaces` in `config.toml`, so those behaviors may run their commands. Only that key changes; comments and the rest of the file stay. It is not part of `all`: read the commands first. Rollback takes out only the namespaces it added. |

The migration records its progress in `imports/citizens/state.json`.

### Collision modes

The mode, `mode=` on the command, decides what happens when an incoming NPC's identity or file path is already taken:

| Mode | Result |
| --- | --- |
| `reject` (default) | Install only when every incoming identity and path is free. |
| `replace` | Replace matching files only when the UUID, readable ID and Citizens numeric ID all agree. Each replaced definition gets a higher revision. New records are added, and records missing from the import are never deleted. |
| `duplicate` with `copy=<label>` | Install a second copy with new, repeatable UUIDs and readable IDs `citizens-<id>-<label>` under `npcs/copy-<label>/`. Known NPC references inside the copy, such as mounts and guarded NPCs, point to the copy. |

A label uses 1-32 lowercase letters, digits, `_` or `-`, and each copy needs a different label. An identity that collides at a different path refuses replacement. Every imported definition is installed despawned with combat off, whatever the mode. Original records and unknown review data are kept; references whose meaning Animus does not know are not translated in a copy.

## Converting on a running server

The lower-level commands work on any Citizens save file placed in `plugins/Animus/imports/inbox/`, and give each step its own ID:

```none
/animus import preview <filename.yml> [worlds=oldWorld:newWorld,...]
/animus import apply <import-id>
/animus import stage <import-id> mode=replace
/animus import stage <import-id> mode=duplicate copy=town-copy
/animus import apply-plan <import-id> <application-id>
/animus rollback <transaction-id>
```

`import apply` installs with the default `reject` mode. `stage` prepares an application plan for another mode and prints its application ID, mode, counts, plan path and the exact apply command; it changes no definitions. The plan lives at `imports/<import-id>/applications/<application-id>/plan.json`. Do not edit generated plans: a changed plan must be staged again.

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

- `source.yml`: the original input, kept exactly.
- `records/<citizens-id>.json`: every original NPC record.
- `reports/<citizens-id>.json`: the status of every field and the exact definition errors.
- `npcs/<world>-r<x>_<z>/citizens-<id>.json`: one editable definition per NPC; see [where the files go](#where-the-files-go).
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

The [web editor](/animus/14-web-editor) converts a `saves.yml` in the browser with the same rules: open it, choose **Convert Citizens, Shopkeepers, dtlTraders or Denizen**, and pick the file. The file is read on your computer and converting never uploads it. The review leads with the migration warnings and the records that will not load, and downloads a zip to unpack into the data folder. The zip holds `imports/saves.yml` and the staged `imports/<import-id>/` folder, so `/animus import citizens preview` on the server finds the same preview and continues from step 6.

A Shopkeepers `save.yml` (with its `config.yml`, if you have it) converts the same way; its zip holds `imports/shopkeepers/save.yml` and the staged `imports/shopkeepers/<import-id>/` folder. Load the Citizens save first so the browser checks the links.

A Denizen folder converts the same way: choose **Choose Denizen folder** and pick `plugins/Denizen`. The editor reads every `.dsc` and `.yml` file under `scripts/`, `server_flags.dat` and `player_flags/`, lists any other files it skipped, and binds assignments to the NPCs of the Citizens save chosen above. Its zip holds the folder under `imports/denizen/` and the staged `imports/denizen/<import-id>/` tree; unzip it beside the Citizens import and run `/animus import citizens` as in [Denizen](#denizen).

The same screen can also upload the files to a paired server and run stage, review, apply, accept and rollback there, with the same results as the commands.

## Where the files go

Each NPC becomes `npcs/<world>/citizens-<id>.json`, and one with no world goes in `npcs/citizens/`. The world name is lowercased with other characters changed to `-` (`World Nether` becomes `world-nether`) and cut to 48 characters. The ID is always `citizens-<Citizens id>` and the UUID is the Citizens UUID, so the same save always gives the same files. You can move the files into any folders under `npcs/`; importing the same save again updates each NPC where it now lives, and only new NPCs go in `npcs/<world>/`. Skins go in `skins/<sha256>.json`, one file for each different skin.

## What converts

| Citizens data | Animus |
| --- | --- |
| UUID, numeric ID, name, type, location and facing | Definition identity, `name`, body type and position, with world mappings applied. |
| Skin | `skins/<sha256>.json` on player bodies. See [skins](#skins). |
| Equipment and inventory | `equipment` (all eight slots) and `inventory`, with item names, lore, enchantments, damage, custom model data, item model, dye colour, patterns, potions and persistent data written as item components. Item meta with no component is kept in the item's `imported` field. A HorseModifiers saddle or armour fills an empty `saddle` or `body` slot. |
| Hologram lines | `hologram`, top line first, with margins, line height, view range, billboard, shadow, see-through and interpolation. |
| Poses, sneaking, sitting, armor stand | `poses` for [`animus:pose`](/animus/07-behaviors#actions), sneaking and sitting poses, armor stand parts and angles. |
| Glowing, using an item, player-list visibility, scoreboard colour and tags, gravity, baby age | `glowing`, `usingItem`, `listed`, `teamColor`, `tags`, `gravity`, `baby`. An armor stand without gravity also gets `gravity: false`. |
| Attribute trait | `attributes`, with the older `generic_scale` and `generic.scale` names read as `scale`. A value outside the vanilla range is clamped with a warning; an id no supported Minecraft version registers is kept for review. |
| Navigator settings | `movement`: speed, water avoidance, fall distance, pathfinding range, distance margin, stuck handling, flying and opening doors. |
| `targetable: true` | `targetableByMobs` on `animus:combat`. |
| `minecraft-ai: true` on a mob with no route | A disabled wander route around its spawn point. |
| Owner | `owner`, when it is a player. |
| Mounts | Mount references resolved through the UUID map. |
| Waypoints | A route, off until `accept patrols`. See [patrols](#patrols). |
| Look-close | `animus:look-close`. See [look-close](#look-close). |
| Text and commands | Generated behaviors. See [text](#text) and [commands](#commands). |
| Sentinel | `animus:combat`, off until `accept combat`. See [Sentinel settings](#sentinel-settings). |
| `controllable` | `animus:riding`, off until `accept riding`. A disabled trait converts to nothing. |
| dtlTraders `trader` | `modules["animus:shop"]`, opening nothing until `accept shops`. |
| Builder `builder` | An `animus:builder` section, run only after `accept builder`. See [builder](#builder). |
| Denizen assignments, triggers and flags | Converted from the Denizen folder when it is present. See [Denizen](#denizen). |

### Skins

A skin on a player NPC becomes `skins/<sha256>.json`. Only player bodies show a skin, so a skin on any other body (a llama, frog or ender dragon) is not set. Citizens never drew those skins either. It stays in `modules["citizens:review"]` in case the NPC is changed to a player, the NPC's report says why, and the preview counts it among the skins on non-player NPCs kept unused.

### Patrols

Waypoints become a route in the NPC's `modules["animus:navigation"]`, with world mappings applied. It stays off until you accept `patrols`.

| Citizens | Animus route |
| --- | --- |
| `linear` | `order: sequence` that loops, or `pingpong` when `cycle` is on |
| `guided` | `order: random`: destinations become `points` and guide waypoints `guides`; the NPC walks to a random destination through the guides. `distance` (or the NPC's pathfinding range) becomes `linkDistance` |
| `wander` | `order: wander` around the region centres, or around the NPC's position. `xrange` and `yrange` become `wander.radius` and `height` (at most 32 and 8); a `delay` of -1 becomes 60 ticks |
| `delay` trigger | The point's `waitTicks`; several delays on one point add up |
| Speed modifier | `speed` of 4.3 blocks per second times the modifier, within 1 to 5 |

Points move to the centre of their block. Citizens saves the block you clicked, which is usually the ground under the NPC's feet, so a point that names a solid block, a top slab or a stair is walked to the surface on top of it, and a stuck NPC that teleports lands there instead of inside the block. A waypoints trait with no points, which Citizens saves for many NPCs that never had a route, converts to nothing and is not counted as kept. Points in another world are left out. Other providers and the `animation`, `chat`, `command`, `speed` and `teleport` triggers are kept in `citizens:review` and reported for each NPC. Long legs and destinations no guide reaches need no extra points. Routes are described in [movement](/animus/05-movement-mounts-riding).

### Look-close

An enabled look-close trait becomes `modules["animus:look-close"]` with its `range`, `lineOfSight` (Citizens' realistic looking) and `whileNavigating` (the opposite of disable-while-navigating). NPC targets become `npcs`, and random looking becomes `randomLook` with its delay and yaw and pitch ranges. It needs no review: the NPC turns to the nearest player once it is spawned. Citizens writes a look-close setting only when it differs from the server's default, so when a save only ever writes `enabled: false`, an unset value means on; the report says when the import assumed this. An armor stand is the exception: it keeps its posed facing unless its own save writes `enabled: true`, and its report says so. Head-only, linked-body, per-player and filters are reported and not run.

### Text

Citizens text becomes the behavior `citizens:text-<id>` in `behaviors/citizens/`, listed in the NPC's `behaviors`. Talk-close NPCs speak when a player comes within the talk range (at most 32 blocks); others speak when right-clicked. The delay is the trigger cooldown (100 ticks when Citizens chose a random delay). A random talker picks a random line; otherwise the lines take turns. `<br>` starts a new message, `<p>` and `<player>` become the player's name, and colour codes are kept. The cooldown is one per NPC, not one per player. Speech bubbles and held-item requirements are reported.

### Commands

Citizens commands become the behavior `citizens:commands-<id>`. Right-click and left-click commands get their own interaction triggers, permissions become permission checks, delays become waits, and the longest cooldown becomes the trigger cooldown, one per NPC. Player commands run as the player and others from the console; an operator command runs from the console. `random`, `cycle` and `sequential` execution modes take turns per NPC, or per player for `sequential`. Sneak clicks, commands run as the NPC, use limits and commands that cost money, experience or items are not converted and are reported.

Commands stay denied until you list the behavior in `config.toml`, for example `commandBehaviors = ["citizens:commands-12"]` under `[behaviors.actions]`, or `commandNamespaces = ["citizens"]` for all of them, and save the file; it applies at once. The preview and `review` list how many wait and which namespaces they need, and `accept commands` adds those namespaces for you.

> Read each command in `behaviors/citizens/` before you allow it. Anyone who can edit an allowed behavior can run console commands.
{.is-warning}

### Builder

Builder's `builder` trait becomes an `animus:builder` section with `reviewAccepted: false`: the schematic name (as `<name>.schem`), pattern, ignore-air, ignore-liquid, excavate, hold-items, required materials (as `materials: donate`), move timeout, Y offset, layers and silent mode. The whole trait is kept under `animus:builder.imported` and in `citizens:review`, and every key that does not convert is reported. The build's saved state, outstanding materials, resume point and Denizen task names are kept, not run. Constructor's `constructor` trait is kept for review and its keys are reported. Builder `.schematic` files must be saved again as `.schem`; see [building](/animus/09-building).

## Sentinel settings

Each Sentinel record becomes `modules["animus:combat"]` with `enabled` and `reviewAccepted` set to `false`. `/animus import citizens accept combat` sets both to `true`; until then the NPC neither fights nor takes combat damage. The unchanged Sentinel record stays in `citizens:review` and in the import archive.

The module keeps three things apart:

- The converted settings, described in [combat](/animus/08-combat). A field missing from a save means Sentinel's own default, so those defaults are written out rather than replaced by Animus defaults.
- `preservedSettings`: every unsupported or unknown field, plus the original value of any converted field that could not be represented exactly (out of range, malformed, invalid patterns, target entries with no equivalent rule, item data, an unresolvable guarded NPC). Nothing here runs.
- `historicalStatistics`: the `stats_*` counters, as imported. They are not updated.

`migrationReport` lists which source fields converted, which are unsupported or unknown, and a note for every value that was adjusted. `autoswitch` and `weapon_redirect_map` are kept, not converted.

| Sentinel field | Combat setting | Notes |
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
| `health` | `defense.maximumHealth` | Maximum, not current health. |
| `armor` | `defense.armor` | `-1` (the default) becomes `armorFromEquipment: true`. |
| `invincible`, `protected`, `protectFromRange`, `allow_knockback`, `healRate` | `defense.invincible`, `protectedFromIgnored`, `protectFromRange`, `knockback`, `healRateTicks` | `protected` means protection from ignored targets, not region protection. |
| `drops`, `dropChances` | `death.drops` | Plain items with their chances convert; items with extra data keep the whole original list. |
| `enemyDrops`, `death_xp` | `death.victimDrops`, `experience` | |
| `respawnTime`, `spawnPoint` | `respawn.delayTicks`, `locations` | `0` keeps the NPC dead (`delayTicks: -1`). Below 0 also sets `deleteOnDeath: true`, so the definition is deleted when the NPC dies, as one transaction that `/animus rollback` undoes. |
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

`/animus import citizens preview` also imports a Shopkeepers save. There is no separate command: the Shopkeepers shops join the same preview, apply, review, accept and rollback, so one rollback undoes both imports in order.

1. Remove the Shopkeepers jar from `plugins/` and keep its data folder. Animus refuses to apply Shopkeepers shops while Shopkeepers is enabled, so no shop trades twice.
2. Leave `plugins/Shopkeepers/data/save.yml` where it is, or copy it to `plugins/Animus/imports/shopkeepers/save.yml` (`imports/inbox/shopkeepers/save.yml` also works). The `config.yml` beside it is read too (`plugins/Shopkeepers/config.yml`, or `config.yml` next to the copied save): its currency items, high currency value, minimum cost and trade log setting change how player shops convert.
3. Run `/animus import citizens preview`. The preview lists shops, trading offers, offers that only show, offers kept in the source, new mob NPCs and how many Citizens links it found. The report is `imports/shopkeepers/<import-id>/report.json`, with one report per shopkeeper under `reports/`.
4. Run `/animus import citizens apply`, then `review` and `accept shops` (and `accept spawn` for the new mob NPCs).

The order does not matter. With both saves present, both stage together. If the Citizens import is already applied, a Shopkeepers save found later stages on its own and binds to the installed NPCs. If the Shopkeepers save is applied first, its Citizens shopkeepers wait, and they bind when the Citizens import is applied.

| Shopkeeper | Becomes |
| --- | --- |
| Any shopkeeper | Shop `shopkeepers:shop-<id>` in `shops/shopkeepers/shop-<id>.json`, one trade entry per offer, 45 offers a page. The name becomes the title. The shop opens in the villager trading screen (`"style": "native"`), as Shopkeepers shows it; change `style` to `chest` for the chest window. |
| Admin shop | Unlimited trades: each recipe's first and second item are the needs, the result item is the gift. `tradePerm` becomes the shop permission. A closed shop (`open: false`) shows its offers and trades nothing. |
| Selling player shop | An owned shop whose stock is its container. The price becomes the currency items Shopkeepers asks for: high currency first when the price is above the minimum cost, the rest in base currency. |
| Buying player shop | The player gives the item and gets the price in base currency from the container. |
| Trading player shop | The player gives the first and second item and gets the result item from the container. |
| Book player shop | Kept in the source and reported. A book offer copies a book by title, which is not an item-for-item trade. |
| Citizens object | `modules["animus:shop"]` on the NPC converted from that Citizens NPC, matched by its Citizens UUID (or numeric id). It opens nothing until `accept shops`. |
| Mob object | A new NPC `npcs/shopkeepers/shopkeeper-<id>.json` of that mob at the shopkeeper's place, despawned until `accept spawn`, with its shop bound. A villager's profession and level go to `modules["animus:shop"].villager`, which its trading screen title shows. Other mob settings (villager type, baby, equipment and so on) are kept in `modules["shopkeepers:review"]`. |
| Sign, hanging sign or virtual object | The shop only, with the sign data kept in the shop's `imported` section. Open it with `/animus shop open <shop>` or bind it to an NPC. |

Items are written exactly: Shopkeepers saves each item component as the text the give command reads, and that text becomes the item's `components`. An offer with item data that cannot be written exactly (old Bukkit item meta, components over 4096 characters) shows in the shop, trades nothing, and keeps the data in `imported`; the report lists it. A player shop without an owner or a container also only shows its offers. Owners, members, hire settings and expiry are kept in the shop's `imported` section and not used. Owned shops are described in [container shops](/animus/10-shops#container-shops).

## Denizen

`/animus import citizens preview` also converts Denizen scripts and flags, so Denizen can be removed after the migration. There is no separate command: the Denizen part joins the same preview, apply, review, accept and rollback, and it needs the Citizens save beside it.

1. Remove the Denizen jar from `plugins/` and keep `plugins/Denizen/`. Animus refuses to apply or accept the converted scripts while Denizen is enabled, so no script runs twice.
2. Leave `plugins/Denizen/` where it is, or copy its `scripts/` folder, `server_flags.dat`, `player_flags/` and `notables.yml` to `plugins/Animus/imports/denizen/` (`imports/inbox/denizen/` also works). Animus reads every `.dsc` and `.yml` file under `scripts/`, and the noted cuboids and ellipsoids in `notables.yml` for area events. It never reads `secrets.secret`.
3. Run `/animus import citizens preview`. The preview counts the scripts, the behaviors made and the NPCs they belong to, the flag values imported and kept, and the items kept with a reason. The report is `imports/denizen/<import-id>/report.json`. It lists every script, command, tag and event as converted or kept, and every kept item with its file, line and reason.
4. `/animus import citizens apply` installs the behaviors in `behaviors/denizen/`, the chest GUIs in `gui/inventories/denizen/` and the flag values as behavior state. Restart once so the imported flag values load. The behaviors are not bound to any NPC, and the server behaviors are not enabled, until you accept them.
5. Run `review`, then `/animus import citizens accept denizen`, which lists the behaviors on the NPCs that had the assignment and enables the [server behaviors](/animus/07-behaviors#server-behaviors) the report lists in `serverBehaviors`.

Rollback removes the behaviors, the GUIs, the imported state and the NPC bindings with the rest of the import.

### What converts

| Denizen | Becomes |
| --- | --- |
| `assignment` script | `denizen:assignment/<name>`: `on click` becomes an `interaction` trigger, `on damage` an `interaction` trigger with `action: attack`, `on enter proximity` and `on exit proximity` `proximity` triggers, and `on spawn`, `on despawn` and `on death` the triggers of the same names. The trigger lines of `on assignment` are read as settings; its other commands become the `on-assignment` routine, run by a `spawn` trigger once per NPC behind the NPC flag `assigned-<name>`. The import sets that flag on every NPC that already had the assignment, so those NPCs do not run it again |
| `interact` script | `denizen:interact/<name>`. The step is a relationship quest stage, `interact-<name>`, 0 for the default step (marked `*`, or the first) and 1 onwards for the others in file order. Click and proximity triggers call the routine of the current step |
| Chat trigger | An `animus:choices` button after the step's click, with a `dialogue_choice` trigger. A phrase with a regex, `*` or a tag is kept |
| `task` script | A routine in each behavior that runs it, and the behavior `denizen:task/<name>` to run by hand. Other lists in the task become routines for `run <task> path:<key>` |
| `procedure` script | A routine, `proc-<name>`, in each behavior that reads it. `determine` becomes `return` with the value |
| `world` script | The server behavior `denizen:world/<name>`, with one routine and trigger per event: `player joins` is `player_join`, `player quits` `player_quit`, `player chats` `player_chat` (`message:` becomes its `pattern`), `player dies` `player_death`, `player respawns` `player_respawn`, `player changes world` `player_world_change` (with `from` and `to`), `server start` `server_start`, and `delta time secondly`, `minutely` or `hourly` with `every:` a `timer`. The [world events](/animus/07-behaviors#world-events) convert too: `player enters <area>` and `player exits <area>` become `player_area` with the bounds of that noted cuboid or ellipsoid (from `notables.yml` or a literal `note ... as:<name>` in a script); `player opens`, `closes` and `clicks in` an inventory the inventory events (`in:` and the inventory type name their `inventory`, `click:` their `click`); `player drops`, `picks up` and `consumes` an item the item events; `player clicks`, `right clicks` and `left clicks` a block, `places` and `breaks` the block events (`with:` checks the held item); `player damaged` (by a cause or an entity type) `player_damaged`; `player damages <entity>` and `<entity> damaged by player` `player_damage_entity`; and `player kills <entity>` `player_kill`; `<projectile> launched` `projectile_launch`; `<projectile> hits`, `<projectile> hits <block>`, `<projectile> hits entity` and `<projectile> collides with <entity>` `projectile_hit` (the switches `entity:`, `block:` and `shooter:` become its filters, and the older `<entity> shoots <block>` is a hit by that shooter); and `<entity> shoots bow`, `crossbow` or `item` `entity_shoot_bow` (`with:` names the bow). A material or entity type after the verb becomes the trigger's filter. `player right clicks entity`, `player damages npc`, and `player damages entity` in a script that checks `<context.entity.is_npc>`, become an `interaction` trigger of `denizen:world-npc/<name>`, a behavior bound to every NPC. The switches `flagged:`, `server_flagged:`, `permission:` and `in:` (read as a world name) become conditions around the routine; `priority:` and `ignorecancelled:` are dropped |
| `determine cancelled` in an event | When it stands at the top level of a cancellable event, after `if ...: stop` guards and `ratelimit` lines only, those guards become the trigger's `cancel` condition, or `consume` on an NPC click, and the event is cancelled as it happens. A rate-limited event is left alone, as in Denizen, where the script stops before it cancels: a sneak-click inside the window still reaches the NPC's shop. `determine passively cancelled` goes on with the lines after it |
| `command` script | The server behavior `denizen:command/<name>` with a `command` trigger for its `name`, `aliases` (up to 8), `permission`, `description` and `usage`. `<context.args>` and `<context.raw_args>` read the typed arguments |
| `book` script | The server behavior `denizen:book/<name>`, which gives the book with `animus:give-book`. `give <book>` and `adjust <player> show_book:<book>` give it in place |
| `inventory` script | A [chest GUI](/animus/11-guis-holograms-menus), `guis/denizen/<name>.json` in the preview and `denizen:<name>` once installed, with its `title`, its `size` or `inventory` type (`chest`, `hopper`, `dropper`) and the fixed items of `slots` as decoration keys. `inventory open d:<name>` becomes `animus:open-gui` |
| `data` script | Its values are copied where they are read: text in place, lists as list values, maps through a temporary variable |
| `item` script | Used by `give` and in GUI slots when it sets only `material`, `display name` and `lore` |
| Trigger on or off, cooldown, radius | Read from the NPC's saved `triggers` (`CLICK`, `PROXIMITY` and so on). A trigger that is off on every NPC with the script is kept |
| Tags | [Expressions](/animus/07-behaviors#expressions) over the run's values. `<[name]>` is the execution variable `d_<name>` (dots inside walk map keys). `<player.name>`, `uuid`, `location`, `health`, `world`, `item_in_hand` and the like read player facts, `<npc.*>` NPC facts, `<player.flag[...]>`, `<player.has_flag[...]>`, `<server.flag[...]>` and the NPC forms the `denizen` flags, `<util.random.int[a].to[b]>` and its kin the random functions, `<context.*>` the event's values (`<context.location.x>`, `<context.item.material.name>`, `<context.inventory.inventory_type>` and the like read the keys the world events pass), `<npc.id>` the Citizens id `npc.citizens_id`, `<server.online_players>` the list `server.players`, `.name`, `.is_online`, `.has_flag[...]` and `.flag[...]` of a definition or loop value holding a player that player's facts and flags, and element, list and map attributes (`add`, `length`, `get`, `contains`, `replace`, `separated_by` and so on) the matching functions. In text a tag becomes a `{{ expression }}` hole. Colour tags become `&` codes, `<&color[#hex]>` becomes `&#hex`, and escapes such as `<&co>` and `<&chr[2764]>` become their characters |
| `define` | `set` of the definition's variable to a literal, an expression or a template; `define x:++` and the other data actions compute the new value |
| `if`, `else if`, `else`, `choose` | `condition` nodes with one expression. `==` and `!=` compare as Denizen does (numbers as numbers, other text ignoring case), `<`, `>`, `<=` and `>=` compare numbers, and `contains`, `in` and `matches` (alternatives with `\|` and `*` at either end) convert, joined by `&&`, `\|\|`, `!` and parentheses. `has_permission` stays an `animus:has-permission` condition. `choose` reads its value once and compares it with each `case` |
| `foreach`, `repeat`, `while` | `foreach` over a list or map with `as:` and `key:`, `repeat` with a literal or computed count, and `while` with its condition. `<[loop_index]>` and `<[value]>` read the loop's pass. `foreach stop`, `repeat next` and the like become `break` and `continue` |
| `stop`, `determine` | `return`. In a task or procedure `determine` returns its value |
| `run`, `inject` | `call` of the task's routine. `def:`, `def.<name>:` and a literal `defmap:` set its definitions first; `save:` with `<entry[...].created_queue.determination>` reads its returned value. `<proc[...].context[...]>` runs the procedure in a `call` before the command that reads it |
| `flag player`, `flag npc`, `flag server` | `animus:set-flag` on the `denizen` flag with its value: a literal, a tag, or the data actions `++`, `--`, `+:`, `-:`, `*:`, `/:`, `->:`, `<-:` and `\|:`. `:!` clears it and `expire:` sets `expireSeconds`. Scopes are `player`, `npc` and `global`; dots in names become dashes. A name joined with tags, such as `npc_done_<npc.id>`, is computed as the run writes it; since `<npc.id>` is the NPC's Citizens id, the run writes `npc_done_284` for the NPC imported as `citizens-284`, the same name the imported flag has, so a player who finished that dialogue under Denizen is not shown it again |
| `zap` | `animus:set-quest-state` on the step stage |
| `wait` | `wait` |
| `narrate`, `announce`, `chat` | `animus:message` to the player, or `to: all` for `targets:<server.online_players>` and for `announce` (`to_console` goes to the console); `chat` is `animus:say` to nearby players |
| `title`, `actionbar` | `animus:title` with its timings, and `animus:actionbar` |
| `targets:` of other players | `narrate`, `title`, `actionbar`, `playeffect` and `playsound <[someone]>` for a list of players, such as `<server.online_players>`, a list in a flag or definition, or one with `.filter[...]`, `.filter_tag[...]` or `.exclude[...]`, become a [`foreach`](/animus/07-behaviors#player-lists) over `players(...)` that runs the action once for each player, at most 100. The filters become a condition on each player |
| `note <cuboid> as:<name>` | Nothing at run time: a literal cuboid or ellipsoid becomes the bounds of that area's triggers |
| `give`, `take` | `animus:give-item` and `animus:take-item` with the material and `quantity:` |
| `teleport` | `animus:teleport` of the player or the NPC to the other one or to a literal location |
| `adjust` | `name` and `item_in_hand` of the NPC become `animus:set-appearance` and `animus:set-equipment` |
| `execute` | `animus:command`, denied until allow-listed. `as_player` runs as the player |
| `execute` of `sentinel ...` | `animus:combat-control` on the behavior's NPC, since Sentinel is replaced by Animus combat: `addtarget <player>` attacks the triggering player, `removetarget <player>`, `forgive` and `forgiveall` release the target, `guard <player>` guards the triggering player and `guard` alone stops guarding. Target types (`addtarget monsters`), other NPCs (`--id 12`) and Sentinel settings such as `range` are kept with the reason; set them in the NPC's `animus:combat` |
| `trait state:true sentinel`, `trait state:false sentinel` | `animus:combat-control` `enable` or `disable`. A `trait sentinel` toggle is kept |
| `look`, `walk`, `equip` | `animus:look` at the player or a literal location, `animus:navigate` to a literal location, `animus:set-equipment` with plain materials |
| `playsound`, `playeffect` | `animus:play-sound` and `animus:spawn-particle` at the NPC or, for `<player>`, with `at: player`. Bukkit sound names become keys (`ENTITY_VILLAGER_YES` is `minecraft:entity.villager.yes`); the report's `sounds` lists every name read. Old particle names are renamed; particle speed and visibility are not carried |
| Flag values | Every flag of each player (`player_flags/`), NPC (`denizen_flags` in the Citizens save) and the server (`server_flags.dat`) becomes a `denizen` flag with its typed value: `true`/`false` a boolean, a whole number an integer, a decimal number a decimal, `li@` a list, `map@` a map, anything else text. An expiring flag keeps its expiry time. A player's interact steps become the relationship stage with every NPC that has the script |

Server behaviors run with no NPC, so a command there that needs one (`chat`, `look`, `walk`, `equip`, `flag npc`, `zap`, `<npc.*>` tags, sounds and particles at the NPC) is kept. Generated behaviors that use `animus:command` stay denied until listed, for example `commandNamespaces = ["denizen"]` under `[behaviors.actions]`; the preview and `review` name them, and `accept commands` adds the namespace. Read each command first.

### Kept with a reason

Each line below stays out of the behaviors and is listed in the report with its file, line and reason; a behavior missing some of its lines is marked `partial` in `behaviorStatus`.

- Tags with no expression, such as `<player[name]>` and other tags of another player or NPC written that way, inventory and entity objects (`<context.inventory.list_contents>`), `||` fallbacks on anything but a flag, flag names that are a tag alone, computed definition names, and `matches` with regexes or a `*` in the middle.
- `determine` anywhere but the top level of a cancellable event after plain guards, and in events that cannot be cancelled (area events, closing an inventory, kills, joins, chat): the routine still ends there. Other `determine passively` lines are kept.
- World events without a server trigger, such as entity clicks other than NPCs and NPC events; projectile events that NPCs shoot or that hit an NPC, since NPCs fire combat projectiles that report nothing and real projectiles pass through them; `player enters area` without a noted area name; areas that are polygons, cuboids of several boxes or computed notes; and switches without an equivalent, such as inventory `action:`. Command script settings such as `tab completions` and `allowed help`.
- `procedural items`, `gui: false` and items with properties other than `quantity` in inventory scripts; item scripts with enchantments, mechanisms or flags.
- `format`, `economy`, `enchantment` and `map` scripts.
- Damage triggers in interact scripts (Animus damage triggers carry no player), proximity `move`, flags whose expiry time cannot be read, values over the state limits (256 items, 8 levels, 4096 bytes), a `foreach stop` that would end an outer loop, targets that are not players, other `adjust` mechanisms, `animate`, `bossbar` and other commands with no Animus action.

To rewrite kept logic by hand, see [moving imported flags and assignments](/animus/07-behaviors#moving-imported-flags-and-assignments).

## Kept but not run

These are kept in each definition under `modules["citizens:review"]` and in the original archive, and are listed by `review`:

- Waypoints, look-close, text and commands that did not convert, with the reason in the NPC's report.
- Denizen assignments, triggers, flags and constants as Citizens saved them. The scripts themselves convert with the [Denizen](#denizen) part of the import.
- Settings with no Animus equivalent, such as the armor stand marker, HorseModifiers colour, style and chest, gradual rotation, attributes no supported Minecraft version registers, and Constructor data.
- Every trait Animus does not know.

## Rolling back

```none
/animus import citizens rollback
```

This undoes every acceptance, the shops, the generated behaviors and the NPC definitions, newest first, and deletes the copied schematics that have not changed. The removed shops and behaviors leave their catalogs at once, so `/animus behaviors reload` afterwards reports nothing missing. If you edited an imported NPC after accepting, rollback refuses rather than overwrite the edit; undo the edit first with `/animus rollback <transaction-id>`. The staged preview stays, so `/animus import citizens apply` installs it again.

Reinstall Citizens only after a rollback.
