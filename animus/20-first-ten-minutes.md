---
title: "Animus: Your First Ten Minutes"
description: "Install Animus, set it up, and make, skin and walk your first NPC"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, quick start, setup, first npc"
editor: markdown
dateCreated: 2026-11-07T00:00:00.000Z
---

This page takes you from an empty server to an NPC that wears a skin and walks a route, mostly with commands. Run them in game as an operator; each one can be pasted as it stands. The [tutorial](/animus/22-tutorial-first-npc) is the longer path: it covers every in-game toolkit screen, step by step, with videos.

## 1. Install

Put the Animus jar in `plugins/` (Paper, Spigot, Folia) or `mods/` (Fabric, NeoForge, Forge) and start the server. Animus writes its data folder, `plugins/Animus/` or `config/animus/`. [Installation](/animus/01-installation-compatibility) lists the jars and requirements.

## 2. Run setup

<div class="animus-demo">
<p><strong>Setup greeting</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/01-setup-greeting-ingame.webm" aria-label="The join greeting, the setup list and the status line" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

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

Stand where the NPC should stand, face the way it should face, and run:

```none
/animus create guard name="Town Guard"
```

The NPC is saved to `npcs/guard.json` at your position, facing your way, with a player body, and it appears for every player in range. It stays spawned after a restart. Add `type=llama` for another body (the [bodies that can be shown](/animus/04-npc-definitions#definition-file) are listed there), `folder=town` to keep it in `npcs/town/`, or `spawned=false` to save it without showing it yet. `/animus despawn guard` takes it away again without deleting the file, and `/animus spawn guard` brings it back.

## 4. Give it a skin

Skins only show on player bodies. The quickest way is a Minecraft account's name:

```none
/animus npc skin guard Notch
```

Animus looks the account up on Mojang, saves its signed skin once in `skins/<sha256>.json` and points the guard's `skin` field at it, so other NPCs can share it. It works from the console too, and `/animus npc skin guard reset` takes the skin off. The server needs internet access for the lookup; online mode is not required.

Other ways: the in-game toolkit's **Skins** screen (`/animus tools`, then **Skins**) has **Use my skin** and **From a player name**, and the [web editor](/animus/14-web-editor) (step 7) makes a skin from a PNG file or a web address under **Appearance**.

## 5. Move it and name it

```none
/animus npc move guard
/animus npc tp guard
/animus npc rename guard "&6Captain"
```

`move` brings the guard to where you stand, facing your way. `tp` takes you to the guard. `rename` changes the name above its head; `&` colour codes work.

## 6. Give it a route

A route is a list of points the NPC walks. Record one by walking it:

1. Run `/animus tools wand` and click the guard with the wand to select it.
2. Run `/animus tools`, open **Routes** and click **Capture a route**. The first point is where you stand.
3. Walk to the next place, hold the wand and tap sneak to drop a point. Repeat for each point.
4. Run `/animus tools` again, open **Routes** and right-click **Save route**. It saves `routes/wp-<your name>.json` and puts it on the guard, which starts walking it.

The [toolkit's Routes screen](/animus/21-in-game-toolkit#routes) edits the points afterwards. Saving a route file applies it within a second, so you can also edit the JSON and watch the guard follow. [Routes](/animus/05-movement-mounts-riding#routes) covers random order, wandering and waits.

## 7. Pair the web editor

The [web editor](/animus/14-web-editor) edits every Animus document with a 3D preview. Connect it to this server:

```none
/animus editor pair
```

Click **[Open editor]** in the reply. The pairing link works once, within 10 minutes. The default token can read, check and apply documents but cannot spawn or despawn NPCs; add the `spawn` scope when you want that:

```none
/animus editor pair scopes=read,validate,preview,apply:npcs,apply:behaviors,apply:gui,apply:rigs,terrain,spawn
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

- [Tutorial](/animus/22-tutorial-first-npc): every toolkit screen, step by step, with videos.
- [NPC definitions](/animus/04-npc-definitions): every field of `guard.json`, equipment, holograms and poses.
- [Behaviors](/animus/07-behaviors): greetings, dialogue, quests and reactions to clicks.
- [Combat](/animus/08-combat): guards that fight.
- [Shops](/animus/10-shops) and [GUIs](/animus/11-guis-holograms-menus): trading and chest menus.
- [Commands and permissions](/animus/02-commands-permissions): every command.
- [Overview](/animus/00-overview#glossary): the words these pages use.
