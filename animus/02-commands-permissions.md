---
title: "Animus: Commands and Permissions"
description: "Every /animus command and permission node"
published: true
date: 2026-11-08T00:00:00.000Z
tags: "animus, commands, permissions"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

All commands start with `/animus`. The command names, arguments and replies are the same on Paper, Spigot, Folia and mod servers, apart from the platform limits noted below. Commands also run from the console, except the few marked as player-only.

## Writing arguments

Animus uses the same command system as the other Volmit plugins:

- **Required values are bare words, in order.** `/animus spawn guard`, `/animus clone guard deputy`.
- **Optional values are always written `key=value`,** in any position: `/animus list page=2`, `/animus navigation go guard 10 64 -3 mode=fly speed=4`. A bare word where only optional values remain is refused.
- **Positions read as in vanilla `/tp`.** A command that takes `x`, `y` and `z` also takes them as three bare words after its required values: `/animus create guard 12 64 -30`. `~` and `~2` count from where you stand, and `^left ^up ^forward` from where you face: `/animus create guard ~ ~ ~3`, `/animus navigation go guard ^ ^ ^5`. Left out, each coordinate and the world are your own. The console has no position, so it gives numbers: `x=0 y=64 z=0`. Block values written `x,y,z`, such as `at=` of `build start`, take `~` too: `at=~,~-1,~`.
- **A value with spaces goes in double quotes,** also after a key: `/animus create guard name="Town Guard"`.
- **A JSON object is one value** and may contain spaces: `/animus edit guard {"name": "Captain Guard"}`. If the JSON itself contains `=`, name the parameter: `/animus edit guard patch={"text":"a=b"}`.
- **An NPC is named by its id**, the file name without `.json`. NPC files may sit in nested folders under `npcs/`, so a command also takes the id with its folders or the file path: `guard`, `world/town/guard` and `npcs/world/town/guard.json` name the same NPC. A folder path that does not match where the NPC lives is refused.
- **`@selected`** stands for the NPC you selected (with the [wand](/animus/21-in-game-toolkit#the-wand) or `/animus select`) wherever a command takes an NPC id. The console must name the id.

A wrong or extra value, an unknown key or an unknown command is refused with the reason and the usage line, and nothing changes. On Paper the chat box marks an unknown command red while you type it. A required value may also be given as `key=value`.

## Help and completion

`/animus` or `/animus help` shows every command grouped by topic, in the same menu as Iris, Adapt and the other Volmit plugins. A group name on its own, such as `/animus shop`, or `/animus shop help`, shows that group with a **〈 Back** link to the one above. Each entry shows its name and its parameters, required ones in `[brackets]` and optional ones in `⊰angles⊱`; hover the name for what it does, its usage and an example, and hover a parameter for its type and default. Click a command to put it in your chat box, or to run it when it takes no values. Each topic header on the first page has a **[Docs]** link to its section on this page. Pages turn with **〈 Page 1** and **Page 3 ❭** at the bottom, or `help=2`. Paged lists, such as `/animus list`, use the same page bar.

Help and tab completion list only what you have permission to run. Completion offers bare values only for the next required argument, such as NPC ids, shop ids or behavior ids, then `~ ~ ~` and the block you look at where a command takes a position, and `key=` for the optional ones.

Players hear the same command sounds as in the other Volmit plugins, decided as Iris decides them: a soft chime while typing and tab completing, a ding once a command finishes running or a help page opens, and a low tone when a command is unknown, refused for permission or origin, missing a value or given one it cannot read, or stops with an error. The sound follows how the command ran, not what it answered, so a command that finishes with a red reply such as `Unknown NPC` still dings, and a command that answers later from a file or region thread dings when it starts that work. On Fabric, Forge and NeoForge the same vanilla sounds play.

File work from commands, imports, the web editor and Java modules shares one queue. When it is full, a command answers `File queue full; try again in a moment` and changes nothing.

## Replies

Replies are one or two lines. In game, values you may need again are clickable, and the console gets them written out instead:

- A link shows as **[Open]** (or **[Open editor]**) and **[Click to copy]**.
- A pointer to these pages shows as **[Docs]**.
- A transaction id shows its first eight characters; click them to copy the full id, or click **[Undo]** to put `/animus rollback <first eight characters>` in your chat box.
- NPC ids and positions in `inspect` and `select` copy themselves when clicked, and an id in `/animus list` opens `inspect`.
- **[Details]** holds the long form of a status line: hover to read it, click to copy it for a bug report.

## Permissions

| Node | Default | Grants |
|---|---|---|
| `animus.status` | Everyone | `/animus status` and the help page |
| `animus.admin` | Operators | Every other command except `debug`, `choice` and build donations |
| `animus.debug` | Operators | `/animus debug` readings |
| `animus.debug.mode` | Operators | `/animus debug mode` |
| `animus.ride` | Operators | Riding NPCs whose `animus:riding` module names no permission of its own |
| `animus.build.donate` | Everyone | `/animus build donate <build>` |
| `animus.hotload.notify` | Operators | The note block chime and per-key message when a data file is applied or refused (see [live apply](/animus/03-configuration#live-apply)) |
| `animus.editor.notify` | Operators | The sound and chat line when the [web editor](/animus/14-web-editor#in-game-notices) changes the server or is refused. The player who paired the token gets its notices without it |

Feature modules can name their own nodes, such as a `permission` on `animus:riding`, `animus:hire`, a shop, a shop entry or a GUI. Those nodes have no default; grant them with your permission plugin.

On mod servers, "Operators" means permission level 2 or higher, and `animus.status` and `animus.build.donate` are open to everyone. A permission mod can grant any node through the vanilla permission formed by replacing the node's first dot with a colon: `animus.admin` is `animus:admin` and `animus.ride.town` is `animus:ride.town`.

## Status and NPC management

| Command | Effect |
|---|---|
| `/animus status` | One line: version, platform, NPC and trait group counts, definition files that need repair, and the runtime state. **[Details]** holds the runtime counters and the main budgets in effect; the console prints them as two more lines |
| `/animus list [page=1]` | Saved NPCs with id, name and revision, as a paged list. Click an id to inspect it |
| `/animus create <id> [type=minecraft:player] [name=] [folder=] [world=] [x=] [y=] [z=]` | Save a new dormant NPC at your position, or at `x y z`, which may be relative such as `~ ~ ~3`. `name` defaults to the id; quote a name with spaces. `folder` is the folder under `npcs/`, up to eight levels such as `world/town`; left out, the file goes directly in `npcs/`. `type` is an entity type such as `minecraft:villager` or `villager`. The console must give `world`, `x`, `y` and `z` |
| `/animus select [npc]` | Select an NPC for commands that take `@selected`. Without an id, selects the NPC you look at, or else the nearest within 16 blocks. The selected NPC glows for you for two seconds. Players only |
| `/animus selection` | Show every NPC you selected. Players only |
| `/animus inspect <npc>` | Two lines: id, name, type, revision, spawned or dormant, trait groups and position, with **[JSON]** to copy the stored definition (and **[Merged]** for the definition after trait groups); then whether it is active, with pose, equipment, text lines, owner and mount problems under **[Details]** |
| `/animus edit <npc> <patch>` | Merge the top-level fields of a JSON object into the definition and save it as a new revision. A field set to `null` is removed, so `{"type": "minecraft:horse", "skin": null, "pose": null}` turns a skinned, seated player into a horse. A refused edit answers `Cannot save` with the first problem; when it changes `type`, the reply shows the `null` that removes the field the new body cannot show |
| `/animus npc attribute <npc> <attribute> [value=]` | Show one [attribute](/animus/04-npc-definitions#attributes) with its source, vanilla default and range, or set it with `value=` and a number, or remove it from the file with `value=reset`. Saves a new revision |
| `/animus npc health <npc> [setting=] [value=]` | Show the NPC's [health](/animus/08-combat#health-and-death) settings, or set `killable`, `maximum`, `regenerate` or `show-health` (`on`, `off` or a number), `after-death` (`respawn`, `permadeath` or `delete`) or `delay` (ticks), or remove one with `value=reset`. Saves a new revision |
| `/animus npc look <npc> <on\|off\|toggle>` | Turn the NPC's [look-close](/animus/05-movement-mounts-riding#look-close) on or off. Sets `enabled` in its own `animus:look-close` and keeps the range and other settings; `on` adds the module when it has none. Saves a new revision |
| `/animus npc revive <npc>` | Bring a dead NPC back at full health. A permadeath is cleared in the definition and the NPC spawns at its own position; an NPC waiting to respawn comes back at once |
| `/animus clone <npc> <id>` | Copy a definition under a new id and UUID, dormant |
| `/animus delete <npc>` | Delete the definition. The reply names the transaction, with **[Undo]** |
| `/animus spawn <npc>` | Check the definition against the running server and mark it spawned |
| `/animus despawn <npc>` | Mark the definition despawned and remove its body |
| `/animus validate` | Check every definition file without changing anything |
| `/animus reload` | Load changed definition files and rigs. Each file applies on its own; a broken file keeps its last valid version |
| `/animus rollback <transaction>` | Undo a transaction from its receipt. The id may be cut to its first characters, at least four, when no other receipt starts with them. See [storage and recovery](/animus/12-storage-recovery#rollback) |

An administrator also selects an NPC by interacting with it. Saved file changes apply without `/animus reload`; see [live apply](/animus/03-configuration#live-apply).

```none
/animus create guard name="Town Guard" folder=town
/animus create guard type=villager world=world x=0 y=64 z=0
/animus create guard ~ ~ ~3
/animus select
/animus edit guard {"name": "Captain Guard"}
/animus npc attribute guard scale value=1.5
/animus npc health villager setting=killable value=on
/animus npc look guard off
/animus npc revive villager
/animus spawn guard
```

## Trait groups

| Command | Effect |
|---|---|
| `/animus groups list [page=1]` | Every [trait group](/animus/18-trait-groups) with its revision, member count and description, then any refused trait group file |
| `/animus groups inspect <group>` | One trait group's values and problems |
| `/animus groups members <group> [page=1]` | The NPCs that list the trait group |
| `/animus groups assign <group> [folder=] [tag=] [ids=]` | Add the trait group to every matching NPC as one transaction |
| `/animus groups unassign <group> [folder=] [tag=] [ids=]` | Remove the trait group from every matching NPC as one transaction |

Assign and unassign take exactly one of `folder=<npc-folder>`, `tag=<tag>` or `ids=a,b`, where `@selected` in `ids=` is your selected NPC. A change that would leave any NPC invalid is refused whole.

```none
/animus groups assign town-guards folder=world/town
```

## Movement and riding

| Command | Effect |
|---|---|
| `/animus navigation go <npc> [x] [y] [z] [mode=walk] [speed=2.0]` | Send an active NPC to a point in its world, or to you when the point is left out. `~` and `^` count from you. Whole-number `x` and `z` mean the center of that block, so `10 64 -3` walks to `10.5 64 -2.5`; give a fraction for an exact point. `mode` is `walk`, `swim` or `fly`; speed is 1 to 10 blocks per second |
| `/animus navigation look <npc> [x] [y] [z]` | Turn the NPC toward a point, or toward you |
| `/animus navigation status <npc>` | Show the NPC's current route and progress |
| `/animus navigation stop <npc>` | Stop it |
| `/animus ride status` | List current riders |
| `/animus ride stop <player>` | Dismount a player |

A manual `navigation go` or `navigation stop` overrides the NPC's route until its definition is applied again. See [movement, mounts and riding](/animus/05-movement-mounts-riding).

## Combat

| Command | Effect |
|---|---|
| `/animus combat status [npc=]` | Combat availability, protection adapter and slot usage, or one NPC's combat state and target |
| `/animus combat engage <npc>` | Let rules choose targets again after a disengage |
| `/animus combat disengage <npc>` | Drop the target and stop rule targeting |
| `/animus combat release <npc>` | Drop the current target; rules keep running |
| `/animus combat target <npc> <target>` | Attack a player, mob or combat NPC by UUID |
| `/animus combat guard <npc> <target>` | Guard a player or NPC by UUID until despawn; `stop` as the target stops guarding |
| `/animus combat attack <npc> <target> [damage=1]` | Deal one manual hit to a loaded living entity, by UUID |
| `/animus combat mob <npc> <mob>` | Lend an ordinary zombie, by UUID, to pursue the NPC; `stop` releases every mob lent to that NPC. Not on mod servers |

These need an active NPC whose `animus:combat` module is enabled and, for imported definitions, accepted. See [combat](/animus/08-combat).

## Behaviors

| Command | Effect |
|---|---|
| `/animus behaviors status` | Catalog, engine and trigger state in one line, with **[Details]** |
| `/animus behaviors list [page=1]` | Loaded behaviors with availability, revisions and hashes |
| `/animus behaviors validate [behavior=]` | Check all behaviors, or one, without publishing them |
| `/animus behaviors reload` | Load changed behavior and pack files, and `server-behaviors.json` |
| `/animus behaviors schema` | Write the generated JSON schemas to `schemas/` |
| `/animus behaviors packs [page=1]` | Loaded behavior packs and any missing required modules |
| `/animus behaviors run <npc> <behavior>` | Start a behavior manually on an NPC. Returns an execution UUID |
| `/animus behaviors inspect <execution>` | Show one execution, by UUID, with its waits and recent steps |
| `/animus behaviors trace <npc> [page=1]` | Show an NPC's running and recent executions; takes an id or UUID |
| `/animus behaviors cancel <execution>` | Cancel an execution by UUID |
| `/animus behaviors triggers [page=1]` | One row per trigger binding, such as `guard \| town:wave #ask`, with its event, how often it fired and its other counters on the hover, and the latest refusals |
| `/animus behaviors state status` | Stored variable counts, pending writes and invalid documents |
| `/animus behaviors state delete behavior <state>` | Delete one behavior's stored variables, or `animus:flags/<namespace>` or `animus:quests/<namespace>` |
| `/animus behaviors state delete npc <npc>` | Delete variables stored for one NPC, by id or UUID |
| `/animus behaviors state delete player <player>` | Delete variables stored for one player, by UUID |
| `/animus behaviors state delete relationship <npc> <player>` | Delete variables stored for one NPC and player pair |
| `/animus behaviors state delete all confirm` | Delete every stored behavior variable |

Deleted variables cannot be brought back with `/animus rollback`. Dialogue buttons in chat run a hidden `/animus choice` command; any player may click one, only a valid single-use token does anything, and every refused click reads the same. See [behaviors](/animus/07-behaviors#commands) for what each reply contains.

## Java modules

| Command | Effect |
|---|---|
| `/animus modules status` | Module state, invocation counts and file work |
| `/animus modules list [page=1]` | Module jars found at startup and their state |
| `/animus modules capabilities [page=1]` | Registered actions, conditions and triggers |
| `/animus modules action <capability> <npc> <input>` | Run a module action, `namespace:name`, against an NPC with a JSON object |
| `/animus modules condition <capability> <npc> <input>` | Evaluate a module condition against an NPC |

`animus:command` cannot be run from here. See [Java modules and API](/animus/99-java-modules-api).

## Rigs and resource pack

| Command | Effect |
|---|---|
| `/animus rigs status` | Loaded rigs, animations and problems |
| `/animus rigs reload` | Reload rigs and animations |
| `/animus rigs problems [page=1]` | Refused rig and animation documents with their reasons |
| `/animus rigs play <npc> <animation> [layer=0] [speed=1] [loop=default]` | Play a clip on an NPC. `loop` is `once`, `loop`, `pingpong` or `hold`; `default` keeps the clip's own |
| `/animus rigs stop <npc> [layer=-1] [fade=0]` | Stop a clip on one layer, or every layer with `-1`, with an optional fade in ticks |
| `/animus pack build` | Build `pack/out/animus-rigs.zip` from `pack/assets/` and `models/` |

See [rigs and animations](/animus/06-rigs-animations).

## Recordings

| Command | Effect |
|---|---|
| `/animus record start <recording>` | Start recording yourself as `recordings/<recording>.json`. Players only |
| `/animus record stop` | Stop recording and save it. Players only |
| `/animus record cancel` | Stop recording and throw it away. Players only |
| `/animus record status [page=1]` | Who is recording, for how long, and running previews |
| `/animus record ghost [enabled=toggle]` | Show or hide your ghost while you record. `enabled` is `on`, `off` or `toggle`. Players only |
| `/animus record preview <recording>` | Play a saved recording once as a ghost only you see. Players only |
| `/animus record clear` | End your preview early. Players only |

See [performance recordings](/animus/19-performance-recordings).

## Building

| Command | Effect |
|---|---|
| `/animus build status [build=]` | Build system state and protection adapter, or one build by its id or NPC |
| `/animus build list [page=1]` | Running and paused builds with their progress |
| `/animus build schematics [page=1]` | Schematic files in `schematics/` |
| `/animus build inspect <schematic>` | Size, block count and unknown blocks of a schematic |
| `/animus build start <npc> [schematic=] [at=x,y,z] [option=value ...]` | Start a build led by an NPC. Without a schematic, starts the build saved in the NPC's definition. `at` and `container` take `~`, such as `at=~,~,~5` |
| `/animus build pause <build>`, `resume <build>`, `cancel <build>` | Pause, resume or cancel one build, by its id or NPC. Cancel keeps the blocks already placed |
| `/animus build rollback <build>` | Remove the blocks a build placed |
| `/animus build survey <build>` | List what a build still needs |
| `/animus build team assign <build> <npc>`, `team unassign <build> <npc>` | Add or remove a helper NPC |
| `/animus build donate <build>` | Give the items in your main hand to a build that takes donations. Needs `animus.build.donate`; players only |

The start options are `anchor`, `rotation`, `mirror`, `offset`, `yoffset`, `pattern`, `layers`, `groupall`, `ignoreair`, `ignoreliquids`, `excavate`, `speed`, `interval`, `reach`, `timeout`, `hold`, `silent`, `materials`, `container` and `scaffolding`. See [building](/animus/09-building) for what each option does.

## Shops and GUIs

| Command | Effect |
|---|---|
| `/animus shop status` | Shop catalog and economy state |
| `/animus shop list [page=1]` | Loaded shops |
| `/animus shop open <shop> [player=] [style=]` | Open a shop for yourself or another player; `style=native` or `style=chest` replaces the shop's window style |
| `/animus shop reload` | Reload shops and chest GUIs |
| `/animus shop reset <shop> [player=]` | Clear purchase limits and stock counters, for everyone or one player by name or UUID |
| `/animus shop problems [page=1]` | Refused shop documents with their reasons, and notes about offers the chosen window style cannot show exactly |
| `/animus shop import preview <folder> [saves=]` | Convert a dtlTraders or Shopkeepers folder under `imports/inbox/` into a staged import. `saves=` names a Citizens `.yml` save beside it |
| `/animus shop import apply <preview>` | Install a staged shop import, by the id `preview` printed |
| `/animus gui status` | GUI, menu and hologram state |
| `/animus gui list [kind=all] [page=1]` | Loaded documents of one kind: `inventory`, `menu`, `hologram` or `animation` |
| `/animus gui open <gui> [player=]` | Open a chest GUI |
| `/animus gui menu <menu> [player=]` | Open a holographic menu |
| `/animus gui close [player=]` | Close an open menu |
| `/animus gui reload` | Reload GUIs, menus, holograms and shops |
| `/animus gui problems [page=1]` | Refused GUI and shop documents |
| `/animus gui import gloss <kind> [id=all] [namespace=animus] [replace=false]` | Copy documents from an installed Gloss. `kind` may be `all` |
| `/animus gui import file <name> [namespace=animus] [replace=false]` | Import a Gloss folder or bundle from `imports/inbox/` |
| `/animus gui export gloss <kind> [id=all] [replace=false]` | Copy documents into Gloss |
| `/animus gui export file <name> [format=]` | Export documents as a Gloss folder or bundle under `exports/gui/`; the format follows the name unless given |

See [shops](/animus/10-shops) and [GUIs, holograms and menus](/animus/11-guis-holograms-menus).

## Imports

| Command | Effect |
|---|---|
| `/animus import citizens preview [mode=reject] [copy=] [worlds=] [factor-groups=false]` | Convert the Citizens, Shopkeepers, dtlTraders and Denizen data found and stage a reviewed plan. Installs nothing. `factor-groups=true` moves settings two or more imported NPCs share into [trait groups](/animus/18-trait-groups#citizens-import) |
| `/animus import citizens apply` | Install the staged import, every NPC dormant |
| `/animus import citizens review` | Count the imported NPCs waiting in each review category |
| `/animus import citizens accept <categories>` | Turn on reviewed features, comma-separated, or `all`. Categories: `spawn`, `patrols`, `combat`, `riding`, `shops`, `builder`, `denizen` |
| `/animus import citizens accept commands` | Add the command namespaces the converted behaviors run to `commandNamespaces` under `[behaviors.actions]` in `config.toml`, applied at once. Not part of `all`; it may be combined, such as `accept denizen,commands`. Rollback takes them out again |
| `/animus import citizens rollback` | Undo the import and every acceptance |
| `/animus import preview <file> [converter=] [worlds=]` | Convert a file in `imports/inbox/` into a staged bundle and print its id |
| `/animus import stage <preview> [mode=reject] [copy=]` | Plan how a bundle applies over existing definitions |
| `/animus import apply <preview>` | Install a previewed bundle |
| `/animus import plan <preview> <application>` | Install a staged plan |

`<preview>` is the id that `import preview` prints, and `<application>` the id that `import stage` prints. `mode` is `reject`, `replace` or `duplicate`; `duplicate` needs `copy=<label>`. `worlds=old:new,other:renamed` renames worlds and applies only to Citizens saves. `converter=namespace:name` picks an import converter from a Java module. See [migrating from Citizens](/animus/13-migrating-from-citizens).

```none
/animus import citizens preview worlds=world:survival
/animus import citizens apply
/animus import citizens accept spawn,patrols
/animus import citizens accept commands
```

## Web editor

| Command | Effect |
|---|---|
| `/animus editor status` | Listener, relay and open connections |
| `/animus editor pair [label=] [scopes=] [folders=] [expires=]` | Print a single-use pairing link. `scopes` and `folders` are comma-separated; `folders` limits the token to NPCs in those folders; `expires` is like `7d`, `12h` or `30m` |
| `/animus editor tokens [page=1]` | Paired browsers, as a paged list |
| `/animus editor revoke <token>` | Revoke a token, or `all`, and close their connections |

See [web editor](/animus/14-web-editor#pairing).

## Tools

| Command | Effect |
|---|---|
| `/animus setup [dismiss=false]` | List the first steps on a new server, done steps marked, with a button for each. Also turns off the join greeting; `dismiss=true` only turns it off |
| `/animus tools` | Open the chest-window tool palette: new NPC, manage, edit, skins, equipment, combat, mounts, routes, recordings, trait groups, folders, behaviors, shops, GUIs and find. Same as `/animus tools open`. Players only |
| `/animus tools wand` | Give the selection wand: click an NPC to select it, sneak-click to add or remove it. Players only |
| `/animus tools manage` | Open the manage screen for your selection. Players only |

New operators see a one-line greeting with **[Setup]** two seconds after joining while the server has no NPCs or an unfinished import. See [your first ten minutes](/animus/20-first-ten-minutes) and the [in-game toolkit](/animus/21-in-game-toolkit).

## Diagnostics

| Command | Effect |
|---|---|
| `/animus debug summary` | Summary of what Animus measured; see [reading the summary](/animus/17-debug-react-metrics#reading-the-summary) |
| `/animus debug network [player=]` | Packets and estimated bytes by kind, for all viewers or one |
| `/animus debug performance` | Server time per subsystem over 1, 10 and 60 seconds |
| `/animus debug npc <npc>` | One NPC's share of that time |
| `/animus debug watch` | Toggle a live action-bar line. Players only |
| `/animus debug mode [enabled=toggle]` | Log every per-NPC diagnostic. `enabled` is `on`, `off` or `toggle`. Needs `animus.debug.mode` |

The readings need `animus.debug`. See [debug, React and metrics](/animus/17-debug-react-metrics).

### Debug mode

With debug mode off, the default, the server log stays quiet about routine trouble of single NPCs and viewers: route legs that terrain blocks or that no path could be found for (the NPC teleports or stops), NPCs that cannot become active here, cancelled dismount teleports, failed display packets and dropped delayed screen actions. Animus counts them instead and logs at most one line every five minutes, such as:

```none
9 NPCs hit route legs blocked by terrain, 3 NPCs hit route legs the planner could not path, 2 NPCs could not activate in the last 5m; /animus debug mode for details
```

`/animus debug mode` turns on the full lines, one per NPC, until the server restarts; it is not saved to `config.toml`. Startup and settings problems, invalid documents, import failures, budget summaries and refusals are always logged.

## Packet preview tools

These are viewer-private test bodies for administrators. They never touch saved NPCs and need `packetProofEnabled = true` in [`config.toml`](/animus/03-configuration#top-level-keys). Spawning and moving need a player; the console can read the status. On mod servers the commands exist and answer that previews need Bukkit or Paper.

| Command | Platform | Effect |
|---|---|---|
| `/animus proof status` | Paper, Spigot | Preview state |
| `/animus proof spawn <type> [skin=]` | Paper, Spigot | Show a preview body to yourself. `skin` is a stored skin's SHA-256 |
| `/animus proof move <entity> <dx> <dy> <dz>` | Paper, Spigot | Move a preview body |
| `/animus proof path <entity> <dx> <dy> <dz>` | Paper, Spigot | Plan a path from a preview body without moving it |
| `/animus proof control start <entity>` | Paper, Spigot | Steer a player-shaped preview body by remote control |
| `/animus proof control stop`, `proof control status` | Paper, Spigot | Let go of it, or show what you control |
| `/animus proof mount <vehicle> [riders=]` | Paper, Spigot | Seat preview bodies on another; `riders` is comma-separated entity ids |
| `/animus proof clear` | Paper, Spigot | Remove your preview bodies |
| `/animus proof folia status` | Folia | Preview state |
| `/animus proof folia spawn [skin=]` | Folia | Show a stationary player-shaped body about three blocks ahead |
| `/animus proof folia clear` | Folia | Remove it |

Preview types are `minecraft:player`, `minecraft:armor_stand`, `minecraft:horse`, `minecraft:turtle`, `minecraft:frog`, `minecraft:llama`, `minecraft:armadillo` and `minecraft:ender_dragon`. Previews expire after two minutes, and hitting one changes only its virtual health.
