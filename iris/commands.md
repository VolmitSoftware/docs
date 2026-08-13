---
title: Iris — Commands
description: Full /iris command tree
published: true
date: 2026-08-13T00:00:00.000Z
tags: iris, commands
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Iris registers a single root command, `/iris`, with the aliases `ir` and `irs`. Every group below is a subcommand of that root — `/iris studio open`, `/iris pregen start`, and so on.

Argument notation: `<required>`, `[optional]`.

## /iris

| Command | Description |
|---|---|
| `/iris create <world-name> [dimension] [seed]` | Create a new world *(alias: +, c)* |
| `/iris teleport <world>` | Teleport to another world *(alias: tp)* |
| `/iris version` | Print version information |
| `/iris packbenchmark` | Benchmark a pack |
| `/iris height` | Print world height information |
| `/iris so` | QOL command to open a overworld studio world. |
| `/iris worlds` | Check access of all worlds. *(alias: accesslist)* |
| `/iris remove <world>` | Remove an Iris world *(alias: del, rm, delete)* |
| `/iris aura [h] [s]` | Set aura spins |
| `/iris bitwise <value1> <operator>` | Bitwise calculations |
| `/iris debug` | Toggle debug |
| `/iris download pack=overworld\|pack=underworld\|link=<zip-url>` | Download a project. *(alias: dl)* |
| `/iris metrics` | Get metrics for your world *(alias: measure)* |
| `/iris unloadWorld` | Unload an Iris World |
| `/iris loadWorld` | Load an Iris World *(alias: import)* |
| `/iris evacuate` | Evacuate an iris world |


## /iris developer

*Iris World Manager*

| Command | Description |
|---|---|
| `/iris developer EngineStatus` | Get Loaded TectonicPlates Count |
| `/iris developer Sentry` | Send a test exception to sentry |
| `/iris developer fixObjects` | Dev cmd to fix all the broken objects caused by faulty shrinkwarp |
| `/iris developer mantle [plate]` | Test |
| `/iris developer dumpThreads` | Test |
| `/iris developer generateStructures [pack]` | Generate Iris structures for all loaded datapack structures |
| `/iris developer packBenchmark [dimension] [radius]` | Test |
| `/iris developer upgrade` | Upgrade to another Minecraft version |
| `/iris developer mca` | test |
| `/iris developer unloadchunks` | UnloadChunks for good reasons. |
| `/iris developer network` | Test *(alias: ip)* |
| `/iris developer compression <world> <path> <algorithm> <amount>` | Test the compression algorithms |

## /iris edit

*Edit something*

| Command | Description |
|---|---|
| `/iris edit biome` | Edit the biome you specified *(alias: b)* |
| `/iris edit region` | Edit the region you specified *(alias: r)* |
| `/iris edit dimension` | Edit the dimension you specified *(alias: d)* |
| `/iris edit cave` | Edit the cave file you specified *(alias: c)* |
| `/iris edit jigsaw` | Edit the structure file you specified *(alias: jigsawstructure, structure)* |
| `/iris edit jigsawPool` | Edit the pool file you specified *(alias: jigsawpool, pool)* |
| `/iris edit jigsawPiece` | Edit the jigsaw piece file you specified *(alias: jigsawpiece, piece)* |

## /iris find

*Iris Find commands*

| Command | Description |
|---|---|
| `/iris find biome <biome>` | Find a biome |
| `/iris find region <region>` | Find a region |
| `/iris find structure <structure>` | Find a structure |
| `/iris find poi <type>` | Find a point of interest. |
| `/iris find object <object>` | Find an object |

## /iris jigsaw

*Iris jigsaw commands*

| Command | Description |
|---|---|
| `/iris jigsaw edit` | Edit a jigsaw piece |
| `/iris jigsaw place` | Place a jigsaw structure |
| `/iris jigsaw create <piece> <project>` | Create a jigsaw piece |
| `/iris jigsaw exit` | Exit the current jigsaw editor |
| `/iris jigsaw save` | Save & Exit the current jigsaw editor |

## /iris lazypregen

*Pregenerate your Iris worlds!*

| Command | Description |
|---|---|
| `/iris lazypregen start <size> [middle] [maxcpm]` | Pregenerate a world |
| `/iris lazypregen stop` | Stop the active pregeneration task *(alias: x)* |
| `/iris lazypregen pause` | Pause / continue the active pregeneration task *(alias: t, resume, unpause)* |

## /iris object

*Iris object manipulation*

| Command | Description |
|---|---|
| `/iris object analyze` | Check the composition of an object |
| `/iris object shrink` | Shrink an object to its minimum size |
| `/iris object convert` | Convert .schem files in the 'convert' folder to .iob files. |
| `/iris object dust` | Get a powder that reveals objects *(alias: d)* |
| `/iris object contract` | Contract a selection based on your looking direction |
| `/iris object position1` | Set point 1 to look *(alias: p1)* |
| `/iris object position2` | Set point 2 to look *(alias: p2)* |
| `/iris object paste <object> [rotate]` | Paste an object |
| `/iris object save <name> [force]` | Save an object |
| `/iris object shift` | Shift a selection in your looking direction |
| `/iris object undo` | Undo a number of pastes |
| `/iris object we` | Gets an object wand and grabs the current WorldEdit selection. *(alias: we)* |
| `/iris object wand` | Get an object wand |
| `/iris object x&y` | Autoselect up, down & out |
| `/iris object x+y` | Autoselect up & out |

## /iris pregen

*Pregenerate your Iris worlds!*

| Command | Description |
|---|---|
| `/iris pregen start <size> [middle]` | Pregenerate a world |
| `/iris pregen stop` | Stop the active pregeneration task *(alias: x)* |
| `/iris pregen pause` | Pause / continue the active pregeneration task *(alias: t, resume, unpause)* |

## /iris studio

*Studio Commands*

| Command | Description |
|---|---|
| `/iris studio open [dim]` | Open a new studio world *(alias: o)* |
| `/iris studio vscode` | Open VSCode for a dimension *(alias: vsc, edit)* |
| `/iris studio close` | Close an open studio project *(alias: x, c)* |
| `/iris studio create <name>` | Create a new studio project *(alias: +)* |
| `/iris studio version` | Get the version of a pack |
| `/iris studio regen` | Regenerate nearby chunks. *(alias: rg)* |
| `/iris studio convert` | Convert objects in the \ |
| `/iris studio execute` | Execute a script *(alias: run)* |
| `/iris studio charge` | Charges all spawners in the area *(alias: zzt)* |
| `/iris studio hotload` | Hotload a studio *(alias: reload, h)* |
| `/iris studio loot` | Show loot if a chest were right here |
| `/iris studio regions` | Calculate the chance for each region to generate |
| `/iris studio distances` | Get all structures in a radius of chunks *(alias: dist)* |
| `/iris studio pkg [obfuscate]` | Package a dimension into a compressed format *(alias: package)* |
| `/iris studio profile` | Profiles the performance of a dimension |
| `/iris studio spawn <entity>` | Spawn an Iris entity *(alias: summon)* |
| `/iris studio tpstudio` | Teleport to the active studio world *(alias: stp)* |
| `/iris studio update` | Update your dimension projects VSCode workspace |
| `/iris studio objects` | Get information about nearby structures *(alias: find-objects)* |

## /iris turbopregen

*Pregenerate your Iris worlds!*

| Command | Description |
|---|---|
| `/iris turbopregen start <size>` | Pregenerate a world |
| `/iris turbopregen stop` | Stop the active pregeneration task *(alias: x)* |
| `/iris turbopregen pause` | Pause / continue the active pregeneration task *(alias: t, resume, unpause)* |

## /iris updater

*Iris World Updater*

| Command | Description |
|---|---|
| `/iris updater start` | Updates all chunk in the specified world |
| `/iris updater pause` | Pause the updater |
| `/iris updater stop` | Stops the updater |

## /iris what

*Iris What?*

| Command | Description |
|---|---|
| `/iris what hand` | What is in my hand? |
| `/iris what biome` | What biome am i in? |
| `/iris what region` | What region am i in? |
| `/iris what block` | What block am i looking at? |
| `/iris what markers` | Show markers in chunk |


## Permissions

Iris does not declare granular permission nodes in `plugin.yml`. Command access is gated by
operator status and by the Decree framework's own origin checks (some commands are
player-only, some are console-only, most are both). If you need finer control, wrap the
root command with a permissions plugin that supports per-command matching.
