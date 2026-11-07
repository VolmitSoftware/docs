---
title: "Animus: Your First Ten Minutes"
description: "Install Animus, set it up, and make, skin and walk your first NPC"
published: true
date: 2026-11-07T00:00:00.000Z
tags: "animus, quick start, setup, first npc"
editor: markdown
dateCreated: 2026-11-07T00:00:00.000Z
---

This page takes you from an empty server to an NPC that wears a skin and walks a route. Run the commands in game as an operator; each one can be pasted as it stands.

## 1. Install

Put the Animus jar in `plugins/` (Paper, Spigot, Folia) or `mods/` (Fabric, NeoForge, Forge) and start the server. Animus writes its data folder, `plugins/Animus/` or `config/animus/`. [Installation](/animus/01-installation-compatibility) lists the jars and requirements.

## 2. Run setup

Join as an operator. While the server has no NPCs, Animus greets you two seconds after you join with **[Setup]** and **[Dismiss]**. Click **[Setup]**, or run:

```none
/animus setup
```

It lists the steps on this page and marks the ones already done:

```none
Setup | no NPCs | editor not paired
1. Create an NPC where you stand [Create]
2. Set a skin and placement [Toolkit]
3. Edit NPCs in your browser [Pair editor]
```

When it finds Citizens, Shopkeepers or Denizen data, importing it comes first; see step 8 below. Running `/animus setup` turns the join greeting off for every operator; `/animus setup` itself keeps working.

## 3. Make an NPC at your feet

Stand where the NPC should stand and run:

```none
/animus create guard name="Town Guard"
```

The NPC is saved to `npcs/guard.json` at your position, with a player body. It is dormant: saved, but not in the world yet. Add `type=villager` for another body, or `folder=town` to keep it in `npcs/town/`.

## 4. Spawn it

```none
/animus spawn guard
```

Animus checks the definition against this server and marks it spawned. The guard appears for every player in range, and it stays spawned after a restart. `/animus despawn guard` takes it away again without deleting the file.

## 5. Give it a skin

Skins only show on player bodies. Two ways to set one:

- In game, run `/animus tools wand`, click the guard with the wand, then run `/animus tools`, open **Skins** and pick a skin file, or **Use my skin**. See the [in-game toolkit](/animus/21-in-game-toolkit).
- In the [web editor](/animus/14-web-editor) (step 7), open the guard, go to **Appearance** and make a new skin from a PNG file or a web address. Apply sends it to the server.

The skin is saved once in `skins/<sha256>.json` and the guard's `skin` field points at it, so other NPCs can share it.

## 6. Give it a route

A route is a list of points the NPC walks. Make `routes/guard-walk.json` in the data folder with two points near the guard (`/animus inspect guard` shows where it stands):

```json
{
  "schemaVersion": 1,
  "mode": "walk",
  "speed": 2,
  "loop": true,
  "waitTicks": 40,
  "points": [{"x": 10, "y": 64, "z": 4}, {"x": 16, "y": 64, "z": 4}]
}
```

Then point the guard at it:

```none
/animus edit guard {"modules": {"animus:navigation": {"enabled": true, "route": "guard-walk"}}}
```

Saving the route file applies it within a second, so you can move points and watch the guard follow. The toolkit's **Routes** tool can also capture a route as you walk it. [Routes](/animus/05-movement-mounts-riding#routes) covers random order, wandering and waits.

## 7. Pair the web editor

The [web editor](/animus/14-web-editor) edits every Animus document with a 3D preview. Connect it to this server:

```none
/animus editor pair
```

Click **[Open editor]** in the reply. The pairing link works once, within 10 minutes. The default token can read, check and apply documents but cannot spawn or despawn NPCs; add the `spawn` scope when you want that:

```none
/animus editor pair scopes=read,validate,preview,apply:npcs,apply:behaviors,apply:gui,apply:rigs,spawn
```

## 8. Coming from Citizens

Back up the server, stop it, remove the Citizens jar but keep its data folder, start it again and run:

```none
/animus import citizens preview
/animus import citizens apply
/animus import citizens accept all
```

Every Citizens NPC arrives dormant, and the features you accept turn on. One command, `/animus import citizens rollback`, undoes all of it. Read [migrating from Citizens](/animus/13-migrating-from-citizens) first: it covers Sentinel, Denizen, dtlTraders and Shopkeepers data too.

## Where to go next

- [NPC definitions](/animus/04-npc-definitions): every field of `guard.json`, equipment, holograms and poses.
- [Behaviors](/animus/07-behaviors): greetings, dialogue, quests and reactions to clicks.
- [Combat](/animus/08-combat): guards that fight.
- [Shops](/animus/10-shops) and [GUIs](/animus/11-guis-holograms-menus): trading and chest menus.
- [Commands and permissions](/animus/02-commands-permissions): every command.
- [Overview](/animus/00-overview#glossary): the words these pages use.
