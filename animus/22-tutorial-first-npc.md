---
title: "Animus Tutorial: First NPC"
description: "Install Animus, then make, find, dress and sort NPCs with the Animus menu"
published: true
date: 2026-11-12T00:00:00.000Z
tags: "animus, tutorial, menu, wand, first npc"
editor: markdown
dateCreated: 2026-11-08T00:00:00.000Z
---

This is the first part of the Animus tutorial. It goes from a fresh install to a few NPCs with names, skins, equipment, folders and a shared trait group, all made in game with the Animus menu. Run the commands as an operator. Each step links to the reference page that covers every option.

The tutorial continues with [movement](/animus/23-tutorial-movement), [conversations, shops and combat](/animus/24-tutorial-interaction) and the [web editor](/animus/25-tutorial-web-editor).

## 1. Install and run setup

Put the Animus jar in `plugins/` (Paper, Spigot, Folia) or `mods/` (Fabric, NeoForge, Forge) and start the server. Join as an operator. While the server has no NPCs, Animus shows a hint two seconds after you join: `Ready. /animus gui opens the menu`, with **[Menu]** and **[Dismiss]**. Setup lists the first steps and marks the ones already done. Status prints the version, the platform and the NPC counts. [Installation](/animus/01-installation-compatibility) lists the jars and requirements.

<div class="animus-demo">
<p><strong>Setup greeting</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/01-setup-greeting-ingame.webm" aria-label="The join greeting, the setup list and the status line" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus setup
/animus status
```

## 2. Find a command

`/animus help` shows the common commands, each with what it does. Click one to put it in your chat box, and hover it for its usage. **[All commands]** shows every command, grouped by topic. `/animus help <command>` explains one command. A mistyped command answers in red with the closest name, which you can click. [Help and completion](/animus/02-commands-permissions#help-and-completion) covers the rest.

<div class="animus-demo">
<p><strong>Help menu</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/02-help-menu-ingame.webm" aria-label="The help page, one command's help, every command by topic and a mistyped command" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus help
/animus help create
/animus help all
```

## 3. Open the menu

`/animus gui` opens the Animus menu at **Home**: **New NPC**, **NPCs**, **Wand** and **Web editor**. Hover a button to read what it does and what each click does. The paper at the bottom right, **Help**, explains the screen in chat. [Home](/animus/21-in-game-toolkit#home) has the details.

<div class="animus-demo">
<p><strong>Home</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/04-palette-ingame.webm" aria-label="Opening the Animus menu with /animus gui and hovering each button on Home" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus gui
```

## 4. Make an NPC

**New NPC** asks for a name, then a body, then for a player body a skin. The NPC appears two blocks in front of you, facing you, and becomes your selection. One chat line names it, with **[Edit]** and **[Undo]**. Questions like the name open as an anvil: edit the name, then click the paper in the result slot. Close the anvil to cancel. [New NPC](/animus/21-in-game-toolkit#new-npc) and [typing text](/animus/21-in-game-toolkit#typing-text) cover both.

<div class="animus-demo">
<p><strong>New NPC</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/06-new-npc-ingame.webm" aria-label="Making the greeter from Home with a name, a player body and the default skin" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On Home, click **New NPC**.
- Type `Greeter` and click the result paper. Its id is `greeter`.
- Click **Player**, then **Default** for the plain look. The window closes and the greeter stands in front of you.

Make a second NPC, the guard, with the command. It spawns where you stand, facing your way; step aside to see it. Add `spawned=false` to save it despawned instead. The [third part](/animus/24-tutorial-interaction) gives it combat.

```none
/animus create guard
```

## 5. Pick a body

A body is what the NPC looks like: a player, a villager, a zombie. The Body step shows the 14 common ones; **All bodies** and **Search** reach every body the server can show. Skins show only on player bodies. [NPC definitions](/animus/04-npc-definitions) lists the bodies and their settings.

<div class="animus-demo">
<p><strong>New NPC with a body type</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/07-new-npc-body-ingame.webm" aria-label="Making a llama NPC named Trader by searching the bodies" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Run `/animus gui` to open Home.
- Click **New NPC** and type `Trader`.
- Click **Search**, type `llama` and click **Llama**. A body other than a player needs no skin, so the trader appears at once.

```none
/animus inspect trader
```

## 6. Select NPCs with the wand

The wand is a glinting stick named **Animus wand**. **Wand** on Home gives you one. Right-click an NPC with it to select only that NPC and open its screen; left-click to select it without opening anything; sneak and click to add it to the selection or take it out. Particles mark the corners of each selected NPC, and only you see them. [The wand](/animus/21-in-game-toolkit#the-wand) lists every click.

<div class="animus-demo">
<p><strong>Wand and selection</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/03-wand-selection-ingame.webm" aria-label="Selecting two NPCs with the wand and clearing the selection" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus tools wand
/animus selection
```

- Left-click the greeter with the wand to select it.
- Sneak and click the trader to add it.
- Sneak and right-click the air to clear the selection.

## 7. Find an NPC

**NPCs** on Home lists every NPC, the nearest first with its distance. It is the quickest way to reach an NPC you cannot see. [NPCs](/animus/21-in-game-toolkit#npcs) has the details.

<div class="animus-demo">
<p><strong>NPCs</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/05-find-ingame.webm" aria-label="Going to an NPC from the NPCs list and opening another's screen" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On Home, click **NPCs**.
- Right-click the trader to go to it. You land beside it, facing it.
- Click the greeter to open its screen.

## 8. Change an NPC

The NPC screen holds every job for one NPC: how it looks, what it does, and managing it. Each change saves at once and its chat line has **[Undo]**. The **Mode** lever at the bottom switches between **Simple**, the common tasks, and **Advanced**, which adds every setting. [The NPC screen](/animus/21-in-game-toolkit#the-npc-screen) lists the jobs in each mode.

<div class="animus-demo">
<p><strong>Edit fields</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/08-edit-fields-ingame.webm" aria-label="Renaming the greeter, bringing it over and turning its glow on" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Right-click the greeter with the wand to open its screen.
- Click **Name** and type `Town Greeter`.
- Walk a few blocks away, open the screen again and click **Bring here** to stand the greeter in front of you.
- Click **Mode: Simple** to switch to Advanced. Click **All fields**, then **Body settings**, then **Glowing** to turn its glow on or off.

## 9. Change an attribute

In Advanced, **Attributes** lists the vanilla attributes the NPC's body carries, such as `scale`. A click adds a step, a right-click takes one off, and a sneak-click types a value; typing nothing goes back to the vanilla default. [Attributes](/animus/04-npc-definitions#attributes) lists each one.

<div class="animus-demo">
<p><strong>Attributes</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/09-attributes-ingame.webm" aria-label="Growing and shrinking the greeter with the scale attribute, then resetting it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On the greeter's screen, click **Attributes**.
- Click **Scale** to grow the greeter one step.
- Sneak-click **Scale** and type `0.6`.
- Sneak-click **Scale** again and type nothing to reset it.

```none
/animus npc attribute greeter scale value=0.6
/animus npc attribute greeter scale value=reset
```

## 10. Give it a skin

**Skin** lists the skin files on the server, with who wears each one. A skin is stored once and shared, so many NPCs can wear the same file. [Skins](/animus/21-in-game-toolkit#skins) covers names and deleting.

<div class="animus-demo">
<p><strong>Skins</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/10-skins-ingame.webm" aria-label="Putting three skins on the greeter and renaming one" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On the greeter's screen, click **Skin**.
- Click **My skin** to copy your own skin. On a server in offline mode your profile carries no skin, so this is refused; use the next step instead.
- Click **Player name** and type a Minecraft name. The server looks the skin up on Mojang's servers, so it needs internet access.
- Each skin you add becomes an entry. Click an entry to put that skin on the greeter.
- Right-click an entry and click **Rename** to give it a name.

## 11. Dress it

**Equipment** shows what the NPC holds and wears. Hold an item, open the NPC's screen with `/animus tools` and click a slot to put the item there; the wand is refused. Slots the body cannot show are red. [Equipment](/animus/21-in-game-toolkit#equipment) has the details.

<div class="animus-demo">
<p><strong>Equipment</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/11-equipment-ingame.webm" aria-label="Putting a helmet and your outfit on the greeter, then clearing its boots" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Close the window, hold a helmet and run `/animus tools`. The greeter is selected, so its screen opens.
- Click **Equipment**, then **Head**.
- Click **Copy my outfit** to copy your hands and armor.
- Click a filled slot with an empty hand, then once more, to clear it.

## 12. Sort NPCs into folders

A folder is where an NPC's file is kept under `npcs/`, for example one folder per town. It only sorts files and changes nothing in game. In Advanced, **Folder** lists the folders with their NPC counts. A folder exists only while an NPC is in it, so **New folder** moves the selection into the new folder at once. [Folders](/animus/21-in-game-toolkit#folders) covers moves and merges.

<div class="animus-demo">
<p><strong>Folders</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/12-folders-ingame.webm" aria-label="Moving the greeter and trader between folders, making plaza and renaming it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On the greeter's screen, click **Folder**.
- Click **New folder** and type `plaza`.
- Click a folder to move the selection into it.
- Right-click `plaza`, click **Rename** and type `plaza/north`.

## 13. Copy, delete and undo

The bottom of the NPC screen manages the NPC: **Bring here**, **Go to**, **Spawned**, **Copy** and **Delete**. Delete asks once more: the first click turns the button red, the second deletes. Every change's chat line has **[Undo]**, and one click on it reverts the change. [Manage](/animus/21-in-game-toolkit#manage) has the details.

<div class="animus-demo">
<p><strong>Copy, delete and undo</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/13-manage-undo-ingame.webm" aria-label="Copying and deleting the greeter, then undoing the delete from chat" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Right-click the greeter with the wand to open its screen.
- Click **Copy** to save a despawned copy named `greeter-copy`. The copy is not selected. The [third part](/animus/24-tutorial-interaction) uses it.
- Click **Delete** twice to delete the greeter. The window goes to the NPCs list.
- Close the window and click **[Undo]** on the delete line in chat. The greeter comes back and is selected again.

`/animus undo` reverts your last change in the same way, from the menu or from a command.

```none
/animus undo
```

## 14. Share settings with a trait group

A [trait group](/animus/18-trait-groups) holds settings that many NPCs share, such as a skin, tags or a behavior. Change the trait group once and every member follows. In Advanced, **Trait groups** lists them with their member counts. [Trait groups in the menu](/animus/21-in-game-toolkit#trait-groups) covers renames and deletes.

<div class="animus-demo">
<p><strong>Trait groups</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/14-trait-groups-ingame.webm" aria-label="Making a trait group for two NPCs, taking it off and putting it back" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Left-click the greeter with the wand, sneak and click the trader, then run `/animus tools`. The screen is titled "2 NPCs", and every job changes both.
- Click **Trait groups**, then **New trait group**, and type `town-folk`. Both NPCs get it.
- Right-click `town-folk` and click **Remove from NPC** twice to take it off them. Click **Back**, then click `town-folk` to put it on them again.
- Right-click `town-folk` again. **Values** changes the settings it gives its members, and **Members** lists them.

```none
/animus groups list
/animus groups assign town-folk ids=greeter,trader
```

Next: [movement](/animus/23-tutorial-movement).
