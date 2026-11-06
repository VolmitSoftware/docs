---
title: "Animus: Commands and Permissions"
description: "Every /animus command and permission node"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, commands, permissions"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

All commands start with `/animus`. The command names, arguments and replies are the same on Paper, Spigot, Folia and mod servers, apart from the platform limits noted below. Commands also run from the console, except the few marked as player-only.

## Writing arguments

Animus uses the same command system as the other Volmit plugins:

- **Required values are bare words, in order.** `/animus spawn guard`, `/animus clone guard deputy`.
- **Optional values are always written `key=value`,** in any position: `/animus list page=2`, `/animus navigate guard 10 64 -3 mode=fly speed=4`. A bare word where only optional values remain is refused.
- **A value with spaces goes in double quotes:** `/animus create guard minecraft:player world 0 64 0 town "Town Guard"`.
- **A JSON object is one value** and may contain spaces: `/animus edit guard {"name": "Captain Guard"}`. If the JSON itself contains `=`, name the parameter: `/animus edit guard patch={"text":"a=b"}`.
- **An NPC is named by its id**, the file name without `.json`. NPC files may sit in nested folders under `npcs/`, so a command also takes the id with its folders or the file path: `guard`, `world/town/guard` and `npcs/world/town/guard.json` name the same NPC. A folder path that does not match where the NPC lives is refused.
- **`@selected`** stands for the NPC you selected (by interacting with it or with `/animus select`) wherever a command takes an NPC id. The console must name the id.

A wrong or extra value, or an unknown key, is refused with the reason and the command's usage line, and nothing changes. A required value may also be given as `key=value`.

## Help and completion

`/animus`, `/animus help`, or a group name on its own such as `/animus shop`, opens the help page for that group. Hover an entry to see its description and an example; click a group to open it, or a command to put it in your chat box. Pages turn with the arrows at the bottom, or `help=2`.

Help and tab completion list only what you have permission to run. Completion offers bare values only for the next required argument, such as NPC ids, shop ids or behavior ids, and `key=` for the optional ones.

File work from commands, imports, the web editor and Java modules shares one queue. When it is full, a command answers `File queue full; try again in a moment` and changes nothing.

## Replies

Replies are one or two lines. In game, values you may need again are clickable, and the console gets them written out instead:

- A link shows as **[Open]** (or **[Open editor]**) and **[Click to copy]**.
- A pointer to these pages shows as **[Docs]**.
- A transaction id shows its first eight characters; click them to copy the full id, or click **[Undo]** to put `/animus rollback <id>` in your chat box.
- NPC ids and positions in `inspect` and `select` copy themselves when clicked.
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
| `animus.hotload.notify` | Operators | The chime and per-key message when a data file is applied or refused |
| `animus.editor.notify` | Operators | The sound and chat line when the [web editor](/animus/14-web-editor#in-game-notices) changes the server or is refused. The player who paired the token gets its notices without it |

Feature modules can name their own nodes, such as a `permission` on `animus:riding`, `animus:hire`, a shop, a shop entry or a GUI. Those nodes have no default; grant them with your permission plugin.

On mod servers, "Operators" means permission level 2 or higher, and `animus.status` and `animus.build.donate` are open to everyone. A permission mod can grant any node through the vanilla permission formed by replacing the node's first dot with a colon: `animus.admin` is `animus:admin` and `animus.ride.town` is `animus:ride.town`.

## Status and NPC management

| Command | Effect |
|---|---|
| `/animus status` | One line: version, platform, NPC and group counts, definition files that need repair, and the runtime state. **[Details]** holds the runtime counters and the main budgets in effect; the console prints them as two more lines |
| `/animus list [page=1]` | Definitions with id, name and revision, as a paged list |
| `/animus create <id> <type> <world> <x> <y> <z> <group> <name>` | Create a dormant definition at `npcs/<group>/<id>.json`. `group` is the folder, up to eight levels such as `world/town`, or `group=` for `npcs/` itself. `type` is `namespace:type`; quote a name with spaces |
| `/animus select <npc>` | Select an NPC. Players only |
| `/animus selection` | Show your selection. Players only |
| `/animus inspect <npc>` | Two lines: id, name, type, revision, spawned or dormant, groups and position, with **[JSON]** to copy the stored definition (and **[Merged]** for the definition after trait groups); then the live state, with pose, equipment, text lines, owner and mount problems under **[Details]** |
| `/animus edit <npc> <patch>` | Merge the top-level fields of a JSON object into the definition and save it as a new revision |
| `/animus npc attribute <npc> <attribute> [value=]` | Show one [attribute](/animus/04-npc-definitions#attributes) with its source, vanilla default and range, or set it with `value=` and a number, or remove it from the file with `value=reset`. Saves a new revision |
| `/animus clone <npc> <id>` | Copy a definition under a new id and UUID, dormant |
| `/animus delete <npc>` | Delete the definition. The reply names the transaction, with **[Undo]** |
| `/animus spawn <npc>` | Check the definition against the running server and mark it spawned |
| `/animus despawn <npc>` | Mark the definition dormant and remove its body |
| `/animus validate` | Check every definition file without changing anything |
| `/animus reload` | Load changed definition files and rigs. Each file applies on its own; a broken file keeps its last valid version |
| `/animus rollback <transaction>` | Undo a transaction from its receipt. See [storage and recovery](/animus/12-storage-recovery#rollback) |

An administrator also selects an NPC by interacting with it. Saved file changes apply without `/animus reload`; see [live apply](/animus/03-configuration#live-apply).

```none
/animus create guard minecraft:player world 0 64 0 town "Town Guard"
/animus edit guard {"name": "Captain Guard"}
/animus npc attribute guard scale value=1.5
/animus spawn guard
```

## Trait groups

| Command | Effect |
|---|---|
| `/animus groups list [page=1]` | Every [trait group](/animus/18-trait-groups) with its revision, member count and description, then any refused group file |
| `/animus groups inspect <group-id>` | One group's values and problems |
| `/animus groups members <group-id>` | The NPCs that list the group |
| `/animus groups assign <group-id> [folder=] [tag=] [ids=]` | Add the group to every matching NPC as one transaction |
| `/animus groups unassign <group-id> [folder=] [tag=] [ids=]` | Remove the group from every matching NPC as one transaction |

Assign and unassign take exactly one of `folder=<npc-folder>`, `tag=<tag>` or `ids=a,b`, where `@selected` in `ids=` is your selected NPC. A change that would leave any NPC invalid is refused whole.

```none
/animus groups assign town-guards folder=world/town
```

## Movement and riding

| Command | Effect |
|---|---|
| `/animus navigate <npc> <x> <y> <z> [mode=walk] [speed=2.0]` | Send an active NPC to a point in its world. Whole-number `x` and `z` mean the centre of that block, so `10 64 -3` walks to `10.5 64 -2.5`; give a fraction for an exact point. `mode` is `walk`, `swim` or `fly`; speed is 1 to 10 blocks per second |
| `/animus navigation status <npc>` | Show the NPC's current route |
| `/animus navigation stop <npc>` | Stop it |
| `/animus look <npc> <x> <y> <z>` | Turn the NPC toward a point |
| `/animus ride status` | List current riders |
| `/animus ride stop <player>` | Dismount a player |

A manual `navigate` or `navigation stop` overrides the NPC's waypoint route until its definition is applied again. See [movement, mounts and riding](/animus/05-movement-mounts-riding).

## Combat

| Command | Effect |
|---|---|
| `/animus combat status [npc=]` | Combat availability, protection adapter and slot usage, or one NPC's combat state and target |
| `/animus combat engage <npc>` | Let rules choose targets again after a disengage |
| `/animus combat disengage <npc>` | Drop the target and stop rule targeting |
| `/animus combat release <npc>` | Drop the current target; rules keep running |
| `/animus combat target <npc> <target>` | Attack a player, mob or combat NPC by UUID |
| `/animus combat guard <npc> <target>` | Guard a player or NPC by UUID until despawn; `stop` as the target stops guarding |
| `/animus attack <npc> <target> [damage=1]` | Deal one manual hit to a loaded living entity. Not on Folia |
| `/animus target <npc> <mob>` | Lease an ordinary zombie, by UUID, to pursue the NPC; `stop` releases that NPC's leases. Paper and Spigot only |

These need an active NPC whose `animus:combat` module is enabled and, for imported definitions, accepted. See [combat](/animus/08-combat).

## Behaviors

| Command | Effect |
|---|---|
| `/animus behaviors status` | Catalog, engine and trigger state |
| `/animus behaviors list [page=1]` | Loaded behaviors |
| `/animus behaviors validate [behavior=]` | Check all behaviors, or one, without publishing them |
| `/animus behaviors reload` | Load changed behavior and pack files, and `server-behaviors.json` |
| `/animus behaviors schema` | Write the generated JSON schemas to `schemas/` |
| `/animus behaviors packs [page=1]` | Loaded behavior packs |
| `/animus behaviors run <npc> <behavior>` | Start a behavior manually on an NPC |
| `/animus behaviors inspect <execution>` | Show one execution, by UUID, and its current waits |
| `/animus behaviors trace <npc>` | Show recent steps of an NPC's executions; takes an id or UUID |
| `/animus behaviors cancel <execution>` | Cancel an execution by UUID |
| `/animus behaviors triggers [page=1]` | Trigger bindings, counters and the latest refusals |
| `/animus behaviors state status` | Stored variable counts, pending writes and invalid documents |
| `/animus behaviors state purge behavior <state>` | Delete one behavior's stored variables, or `animus:flags/<namespace>` or `animus:quests/<namespace>` |
| `/animus behaviors state purge npc <npc>` | Delete variables stored for one NPC, by id or UUID |
| `/animus behaviors state purge player <player>` | Delete variables stored for one player, by UUID |
| `/animus behaviors state purge relationship <npc> <player>` | Delete variables stored for one NPC and player pair |
| `/animus behaviors state purge all confirm` | Delete every stored behavior variable |

Purges cannot be undone with `/animus rollback`. Dialogue buttons in chat run a hidden `/animus choice` command; any player may click one, only a valid single-use token does anything, and every refused click reads the same. See [behaviors](/animus/07-behaviors).

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

## Building

| Command | Effect |
|---|---|
| `/animus build status [build=]` | Build system state and protection adapter, or one build by its id or NPC |
| `/animus build list` | Every build and its progress |
| `/animus build schematics` | Schematic files in `schematics/` |
| `/animus build inspect <schematic>` | Size, block count and unknown blocks of a schematic |
| `/animus build start <npc> [schematic=] [at=x,y,z] [option=value ...]` | Start a build led by an NPC. Without a schematic, starts the build saved in the NPC's definition |
| `/animus build pause\|resume\|cancel\|undo\|survey <build>` | Control one build, by its id or NPC |
| `/animus build team add\|remove <build> <npc>` | Add or remove a helper NPC |
| `/animus build donate <build>` | Give the items in your main hand to a build that takes donations. Needs `animus.build.donate`; players only |

The start options are `anchor`, `rotation`, `mirror`, `offset`, `yoffset`, `pattern`, `layers`, `groupall`, `ignoreair`, `ignoreliquids`, `excavate`, `speed`, `interval`, `reach`, `timeout`, `hold`, `silent`, `materials`, `container` and `scaffolding`. Building is not available on Folia. See [building](/animus/09-building) for what each option does.

## Shops and GUIs

| Command | Effect |
|---|---|
| `/animus shop status` | Shop catalog and economy state |
| `/animus shop list` | Loaded shops |
| `/animus shop open <shop> [player=] [style=]` | Open a shop for yourself or another player; `style=native` or `style=chest` replaces the shop's window style |
| `/animus shop reload` | Reload shops and chest GUIs |
| `/animus shop reset <shop> [player=]` | Clear purchase limits and stock counters, for everyone or one player by name or UUID |
| `/animus shop problems` | Refused shop documents with their reasons, and notes about offers the chosen window style cannot show exactly |
| `/animus shop import preview <folder> [saves=]` | Convert a dtlTraders or Shopkeepers folder under `imports/inbox/` into a staged import |
| `/animus shop import apply <preview>` | Install a staged shop import |
| `/animus gui status` | GUI, menu and hologram state |
| `/animus gui list [kind=all]` | Loaded documents of one kind: `inventory`, `menu`, `hologram` or `animation` |
| `/animus gui open <gui> [player=]` | Open a chest GUI |
| `/animus gui menu <menu> [player=]` | Open a holographic menu |
| `/animus gui close [player=]` | Close an open menu |
| `/animus gui reload` | Reload GUIs, menus, holograms and shops |
| `/animus gui problems` | Refused GUI and shop documents |
| `/animus gui import gloss <kind> [id=all] [namespace=gloss] [replace=false]` | Copy documents from an installed Gloss. `kind` may be `all` |
| `/animus gui import file <name> [namespace=gloss] [replace=false]` | Import a Gloss folder or bundle from `imports/inbox/` |
| `/animus gui export gloss <kind> [id=all] [replace=false]` | Copy documents into Gloss |
| `/animus gui export file <name> [format=]` | Export documents as a Gloss folder or bundle; the format follows the name unless given |

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
| `/animus import preview <file> [converter=] [worlds=]` | Convert a file in `imports/inbox/` into a staged bundle |
| `/animus import stage <preview> [mode=reject] [copy=]` | Plan how a bundle applies over existing definitions |
| `/animus import apply <preview>` | Install a previewed bundle |
| `/animus import apply-plan <preview> <application>` | Install a staged plan |

`mode` is `reject`, `replace` or `duplicate`; `duplicate` needs `copy=<label>`. `worlds=old:new,other:renamed` renames worlds and applies only to Citizens saves. `converter=namespace:name` picks an import converter from a Java module. See [migrating from Citizens](/animus/13-migrating-from-citizens).

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
| `/animus editor pair [label=] [scopes=] [groups=] [expires=]` | Print a single-use pairing link. `scopes` and `groups` are comma-separated; `expires` is like `7d`, `12h` or `30m` |
| `/animus editor tokens [page=1]` | Paired browsers, as a paged list |
| `/animus editor revoke <token>` | Revoke a token, or `all`, and close their connections |

See [web editor](/animus/14-web-editor#pairing).

## Diagnostics

| Command | Effect |
|---|---|
| `/animus debug summary` | Summary of what Animus measured |
| `/animus debug network [player=]` | Packets and estimated bytes by kind, for all viewers or one |
| `/animus debug performance` | Server time per subsystem over 1, 10 and 60 seconds |
| `/animus debug npc <npc>` | One NPC's share of that time |
| `/animus debug watch` | Toggle a live action-bar line. Players only |
| `/animus debug mode [enabled=toggle]` | Log every per-NPC diagnostic. `enabled` is `on`, `off` or `toggle`. Needs `animus.debug.mode` |

The readings need `animus.debug`. See [debug, React and metrics](/animus/17-debug-react-metrics).

### Debug mode

With debug mode off, the default, the server log stays quiet about routine trouble of single NPCs and viewers: route legs that terrain blocks (the NPC teleports or stops), NPCs that cannot activate here, cancelled dismount teleports, failed display packets and dropped delayed screen actions. Animus counts them instead and logs at most one line every five minutes, such as:

```none
12 NPCs hit blocked route legs, 2 NPCs could not activate in the last 5m; /animus debug mode for details
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
| `/animus proof control stop` / `status` | Paper, Spigot | Let go of it, or show what you control |
| `/animus proof mount <vehicle> [riders=]` | Paper, Spigot | Seat preview bodies on another; `riders` is comma-separated entity ids |
| `/animus proof clear` | Paper, Spigot | Remove your preview bodies |
| `/animus foliaproof status` | Folia | Preview state |
| `/animus foliaproof spawn [skin=]` | Folia | Show a stationary player-shaped body about three blocks ahead |
| `/animus foliaproof clear` | Folia | Remove it |

Preview types are `minecraft:player`, `minecraft:armor_stand`, `minecraft:horse`, `minecraft:turtle`, `minecraft:frog`, `minecraft:llama`, `minecraft:armadillo` and `minecraft:ender_dragon`. Previews expire after two minutes, and hitting one changes only its virtual health.
