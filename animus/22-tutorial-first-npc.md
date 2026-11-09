---
title: "Animus Tutorial: First NPC"
description: "Install Animus, then make, edit, skin, dress and organize NPCs with the in-game toolkit"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, tutorial, toolkit, wand, first npc"
editor: markdown
dateCreated: 2026-11-08T00:00:00.000Z
---

This is the first part of the Animus tutorial. It goes from a fresh install to a group of NPCs with names, skins, equipment, folders and a shared trait group, all made in game. Run the commands as an operator. Each step links to the reference page that covers every option.

The tutorial continues with [movement](/animus/23-tutorial-movement), [conversations, shops and combat](/animus/24-tutorial-interaction) and the [web editor](/animus/25-tutorial-web-editor).

## 1. Install and run setup

Put the Animus jar in `plugins/` (Paper, Spigot, Folia) or `mods/` (Fabric, NeoForge, Forge) and start the server. Join as an operator. While the server has no NPCs, Animus greets you two seconds after you join with **[Setup]** and **[Dismiss]**. Setup lists the first steps and marks the ones already done. Status prints the version, the platform and the NPC counts. [Installation](/animus/01-installation-compatibility) lists the jars and requirements.

<div class="animus-demo">
<p><strong>Setup greeting</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/01-setup-greeting-ingame.webm" aria-label="The join greeting, the setup list and the status line" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus setup
/animus status
```

## 2. Find a command

`/animus` on its own shows every command grouped by topic. Hover a command's name for its usage and an example. Type a group name, such as `/animus shop`, to see only that group, with a **〈 Back** link. A command that is unknown or missing a value answers in red with its usage and plays a low tone. [Help and completion](/animus/02-commands-permissions#help-and-completion) covers the menu.

<div class="animus-demo">
<p><strong>Help menu</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/02-help-menu-ingame.webm" aria-label="The grouped help menu, a group page and a refused command" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus
/animus shop
```

## 3. Open the palette

`/animus tools` opens the palette, a chest window with every tool. Hover a tool to read what a left click, a right click and a sneak click do. The top item is the selection: left opens it, right opens **Manage**, and sneak clears it. [Palette](/animus/21-in-game-toolkit#palette) lists the rows.

<div class="animus-demo">
<p><strong>Tool palette</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/04-palette-ingame.webm" aria-label="Hovering each tool in the palette" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus tools
```

## 4. Make an NPC

**New NPC** asks for an id and saves `npcs/<id>.json` two blocks in front of you, facing you. It selects the new NPC and spawns it in one transaction, so one chat line names the file and carries **[Undo]**. Questions like this open as an anvil: edit the name, then click the paper in the result slot. Close the anvil to cancel. [New NPC](/animus/21-in-game-toolkit#new-npc) and [typing text](/animus/21-in-game-toolkit#typing-text) cover both.

<div class="animus-demo">
<p><strong>New NPC</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/06-new-npc-ingame.webm" aria-label="Making an NPC named greeter from the palette" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In the palette, left-click **New NPC**.
- Type `greeter` and click the result paper.
- Sneak-click **New NPC** instead to save the NPC dormant, so it shows only once you spawn it.

Make a second NPC, the guard, with the command form. It spawns where you stand, facing your way; step aside to see it. Add `spawned=false` to save it dormant instead. The [third part](/animus/24-tutorial-interaction) gives it combat.

```none
/animus create guard
```

## 5. Pick a body type

A new NPC has a player body. Right-click **New NPC** to choose another body first, such as a llama or a horse. Skins show only on player bodies. [NPC definitions](/animus/04-npc-definitions) lists the bodies and their settings.

<div class="animus-demo">
<p><strong>New NPC with a body type</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/07-new-npc-body-ingame.webm" aria-label="Making a llama NPC named trader" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In the palette, right-click **New NPC**.
- Type `minecraft:llama` as the body type, then `trader` as the id.

```none
/animus inspect trader
```

## 6. Select NPCs with the wand

Most toolkit screens act on your selection. The wand is a blaze rod named **Animus wand**. Click an NPC with it to select only that NPC; sneak and click to add another or remove it. Particles mark the corners of each selected NPC, and only you see them. [The wand](/animus/21-in-game-toolkit#the-wand) lists every click.

<div class="animus-demo">
<p><strong>Wand and selection</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/03-wand-selection-ingame.webm" aria-label="Selecting two NPCs with the wand" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus tools wand
/animus selection
```

- Click the greeter with the wand to select it.
- Sneak and click the trader to add it.
- The palette's top item shows the same selection.

## 7. Find an NPC

**Find** lists the active NPCs in your world, nearest first, with the distance in each entry. It is the quickest way to reach or select an NPC you cannot see. [Find](/animus/21-in-game-toolkit#find) has the details.

<div class="animus-demo">
<p><strong>Find</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/05-find-ingame.webm" aria-label="Teleporting to an NPC and selecting another from Find" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In the palette, click **Find**.
- Left-click an entry to teleport beside that NPC, facing it.
- Right-click an entry to select only that NPC.
- Sneak-click an entry to bring the NPC to you.

## 8. Edit an NPC

**Edit** opens every field of the selected NPC, grouped into screens. Each field's lore shows its description, its current value and what each click does. Every change is saved at once as its own transaction with **[Undo]**. [Edit NPC](/animus/21-in-game-toolkit#edit-npc) lists the screens.

<div class="animus-demo">
<p><strong>Edit fields</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/08-edit-fields-ingame.webm" aria-label="Renaming the greeter, toggling its glow and moving it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the greeter, then click **Edit** in the palette.
- Click **Identity**, left-click `name` and type `Town Greeter`.
- Click **Back**, then **Body**, and left-click `glowing` to turn it on or off.
- Click **Back**, then **Use where I stand** to move the NPC to you.

## 9. Change an attribute

The **Attributes** screen lists the vanilla attributes the NPC's body carries, such as `scale`. Left and right step a value within its range. Sneak-left types a value, and sneak-right goes back to the vanilla default. [Attributes](/animus/04-npc-definitions#attributes) lists each one.

<div class="animus-demo">
<p><strong>Attributes</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/09-attributes-ingame.webm" aria-label="Growing and shrinking the greeter with the scale attribute" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In **Edit**, click **Attributes**.
- Left-click `scale` to grow the NPC one step.
- Sneak-left-click `scale` and type `0.6`.
- Sneak-right-click `scale` to reset it.

```none
/animus npc attribute greeter scale value=0.6
/animus npc attribute greeter scale value=reset
```

## 10. Give it a skin

**Skins** lists the skin files on the server, with who wears each one. Click a skin to put it on every selected NPC. A skin is stored once and shared, so many NPCs can wear the same file. [Skins](/animus/21-in-game-toolkit#skins) covers labels and deleting.

<div class="animus-demo">
<p><strong>Skins</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/10-skins-ingame.webm" aria-label="Putting three skins on the greeter and relabelling one" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the greeter, then click **Skins** in the palette.
- Click **Use my skin** to copy your own skin. On a server in offline mode your profile carries no skin, so this fails; use the next step instead.
- Click **From a player name** and type a Minecraft name. The server looks the skin up on Mojang's servers, so it needs internet access.
- Each skin you add becomes an entry. Click an entry to put that skin on the selection.
- Right-click an entry to give it a label.

## 11. Dress it

**Equipment** shows the eight slots of the first selected NPC. A left click on a slot puts the item in your main hand there. Slots the body cannot show are red. [Equipment](/animus/21-in-game-toolkit#equipment) covers bulk changes.

<div class="animus-demo">
<p><strong>Equipment</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/11-equipment-ingame.webm" aria-label="Putting a helmet, a sword and an outfit on the greeter" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In the palette, click **Equipment**.
- Hold an item and left-click a slot to put it there.
- Click **Copy your outfit** to copy your hands and armor.
- Right-click a slot to clear it.

## 12. Sort NPCs into folders

Folders under `npcs/` keep NPCs apart, for example one folder per town. **Folders** lists them with their NPC counts. A folder exists only while an NPC is in it, so **New folder** moves the selection into the new folder at once. [Folders](/animus/21-in-game-toolkit#folders) covers moves and merges.

<div class="animus-demo">
<p><strong>Folders</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/12-folders-ingame.webm" aria-label="Making the plaza folder and renaming it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the NPCs to move, then click **Folders** in the palette.
- Click **New folder** and type `plaza`.
- Left-click a folder to move the selection into it.
- Sneak-click a folder and type a new name, such as `plaza/north`, to rename it.

## 13. Clone, delete and undo

**Manage** acts on the whole selection: spawn, despawn, clone, delete and more. Delete asks twice: the first click turns the button red, the second deletes. Every change has a transaction id, and **[Undo]** on its chat line puts the rollback command in your chat box. [Manage](/animus/21-in-game-toolkit#manage) and [rollback](/animus/12-storage-recovery#rollback) have the details.

<div class="animus-demo">
<p><strong>Manage and undo</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/13-manage-undo-ingame.webm" aria-label="Cloning and deleting an NPC, then undoing the delete" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select only the greeter with the wand, then click **Manage** in the palette.
- Click **Clone** to save a dormant copy named `greeter-copy`. The copy is not selected; the selection is still the greeter. The [third part](/animus/24-tutorial-interaction) uses the copy.
- Click **Delete** twice to delete the selection, the greeter.
- Click **[Undo]** on the delete line, then press Enter to run the command. The greeter comes back.

```none
/animus rollback <transaction>
```

## 14. Share settings with a trait group

A [trait group](/animus/18-trait-groups) holds values that many NPCs share, such as a skin, tags or a behavior. Change the group and every member changes. **Trait groups** lists the groups with their member counts. [Trait groups in the toolkit](/animus/21-in-game-toolkit#trait-groups) covers renames and deletes.

<div class="animus-demo">
<p><strong>Trait groups</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/14-trait-groups-ingame.webm" aria-label="Assigning a trait group and making a new one" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the greeter and the trader, then click **Trait groups** in the palette.
- Click **New group** and type `town-folk`. The group is made with the selection in it.
- Right-click `town-folk` to take it off the selection, then left-click it to assign it again.
- Sneak-click the group to open it. **Values** edits the fields it supplies, and **Members** lists its NPCs.

```none
/animus groups list
/animus groups assign town-folk ids=greeter,trader
```

Next: [movement](/animus/23-tutorial-movement).
