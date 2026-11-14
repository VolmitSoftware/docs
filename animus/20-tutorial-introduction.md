---
title: "Animus Tutorial: Introduction"
description: "Install Animus, set it up, and make, skin and walk your first NPC"
published: true
date: 2026-11-12T00:00:00.000Z
tags: "animus, tutorial, quick start, setup, first npc"
editor: markdown
dateCreated: 2026-11-07T00:00:00.000Z
---

This page takes you from an empty server to an NPC that wears a skin and walks a route in about ten minutes, mostly with commands. Run them in game as an operator; each one can be pasted as it stands. The rest of the tutorial, starting with [first NPC](/animus/22-tutorial-first-npc), is the longer way: it covers the Animus menu, step by step, with videos.

## 1. Install

Put the Animus jar in `plugins/` (Paper, Spigot, Folia) or `mods/` (Fabric, NeoForge, Forge) and start the server. Animus writes its data folder, `plugins/Animus/` or `config/animus/`. [Installation](/animus/01-installation-compatibility) lists the jars and requirements.

## 2. Run setup

<div class="animus-demo">
<p><strong>Setup greeting</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/01-setup-greeting-ingame.webm" aria-label="The join greeting, the setup list and the status line" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Join as an operator. While the server has no NPCs, Animus shows a hint two seconds after you join: `Ready. /animus gui opens the menu`, with **[Menu]** and **[Dismiss]**. **[Menu]** runs `/animus gui`, which opens the [Animus menu](/animus/21-in-game-toolkit). For the first steps, run:

```none
/animus setup
```

It lists them and marks the ones already done:

```none
Setup | no NPCs | editor not paired
1. Make an NPC [New NPC]
2. Change it [Menu]
3. Edit in your browser [Pair]
Every step in the wiki [Docs]
```

**[New NPC]** and **[Menu]** both run `/animus gui`, which opens the Animus menu at Home, and **[Pair]** sends a pairing link for the web editor. When Animus finds Citizens, Shopkeepers or Denizen data, importing it comes first and the hint shows **[Setup]** instead; see step 8 below. Running `/animus setup` turns the join hint off for every operator; `/animus setup` itself keeps working.

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

Other ways: in the [Animus menu](/animus/21-in-game-toolkit#skins), the guard's **Skin** has **My skin** and **Player name**, and the [web editor](/animus/14-web-editor) (step 7) makes a skin from a PNG file or a web address under **Appearance**.

## 5. Move it and name it

```none
/animus npc move guard
/animus npc tp guard
/animus npc rename guard "&6Captain"
```

`move` brings the guard to where you stand, facing your way. `tp` takes you to the guard. `rename` changes the name above its head; `&` colour codes work.

## 6. Give it a route

A route is points on the ground; the NPC walks from one to the next and finds its own way between them. Make one by walking it:

1. Run `/animus tools wand` and right-click the guard with the wand. Its screen opens.
2. Click **Movement**, **Route**, then **New route**. Animus suggests the name `guard-route`; click the paper in the anvil's result slot to keep it. The window closes.
3. Walk to the first place, hold the wand and tap sneak to drop a point. Repeat for each point.
4. Click **[Save]** in chat. It saves `routes/guard-route.json` and puts it on the guard, which starts walking it.

The [route's details](/animus/21-in-game-toolkit#route-details) change its points and settings afterwards. Saving a route file applies it within a second, so you can also edit the JSON and watch the guard follow. [Routes](/animus/05-movement-mounts-riding#routes) covers random order, wandering and waits.

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
```

Every Citizens NPC arrives as it was, with its routes, guards, shops and commands running. One command, `/animus import citizens rollback`, undoes all of it. Read [migrating from Citizens](/animus/13-migrating-from-citizens) first: it covers Sentinel, Denizen, dtlTraders and Shopkeepers data too.

## Where to go next

- [Tutorial: first NPC](/animus/22-tutorial-first-npc): the Animus menu, step by step, with videos.
- [NPC definitions](/animus/04-npc-definitions): every field of `guard.json`, equipment, holograms and poses.
- [Behaviors](/animus/07-behaviors): greetings, dialogue, quests and reactions to clicks.
- [Combat](/animus/08-combat): guards that fight.
- [Shops](/animus/10-shops) and [GUIs](/animus/11-guis-holograms-menus): trading and chest menus.
- [Commands and permissions](/animus/02-commands-permissions): every command.
- [Overview](/animus/00-overview#glossary): the words these pages use.
