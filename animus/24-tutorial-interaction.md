---
title: "Animus Tutorial: Conversations, Shops and Combat"
description: "Give NPCs behaviors, conversations, shops, GUIs, holograms, combat and health, then pair the web editor"
published: true
date: 2026-11-08T00:00:00.000Z
tags: "animus, tutorial, behaviors, conversations, shops, guis, combat"
editor: markdown
dateCreated: 2026-11-08T00:00:00.000Z
---

This is the third part of the Animus tutorial. It gives NPCs something to do when players meet them: behaviors, a conversation, a shop, a chest GUI and a hologram, combat rules and health. It ends by pairing the web editor, where the [last part](/animus/25-tutorial-web-editor) continues. It uses the NPCs from [the first part](/animus/22-tutorial-first-npc).

## 1. Attach a behavior

A [behavior](/animus/07-behaviors) is a file under `behaviors/` that runs when something triggers it, such as a click or a player walking near. **Behaviors** lists every behavior file. Each entry shows its file, what triggers it, whether it is a conversation and how many selected NPCs run it. [Behaviors in the toolkit](/animus/21-in-game-toolkit#behaviors) covers the controls.

<div class="animus-demo">
<p><strong>Behaviors and triggers</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/22-behaviors-list-ingame.webm" aria-label="Adding a behavior to an NPC and listing its trigger bindings" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select an NPC, then click **Behaviors** in the palette.
- Left-click a behavior to add it to the selection; right-click removes it.
- Click **Trigger bindings** to list in chat what each NPC listens for.

```none
/animus behaviors triggers
```

## 2. Write a conversation

A conversation is a behavior made of blocks of lines. A block can end in a question, and each answer leads to another block. **New conversation** saves a conversation that says "Hello" on a right click and opens it in the conversation editor, one block at a time. Edits stay in the window until you save. [Conversations](/animus/21-in-game-toolkit#conversations) lists every button.

<div class="animus-demo">
<p><strong>Conversation editor</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/23-conversation-editor-ingame.webm" aria-label="Writing a conversation with one question in the block editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In **Behaviors**, click **New conversation** and type `plaza:welcome`. It saves `behaviors/plaza/welcome.json`.
- Left-click the line and type `Welcome to the plaza, {player_name}.`
- Click **Add choice** and type an answer. The block gets a question, "Choose one.", to edit.
- Right-click the choice to open the block it leads to, then click **Add line**.
- Click **Back**, then **Save**.
- Click **Attach to selection** to give the conversation to the selected NPCs.

## 3. Talk to the NPC

Players start the conversation by right-clicking the NPC. Lines show in chat with the NPC's name. Answers are bracketed chat buttons; hover one to read it and click it to choose. [Dialogue choices](/animus/07-behaviors#dialogue-choices) has the details.

<div class="animus-demo">
<p><strong>Conversation in play</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/24-conversation-play-ingame.webm" aria-label="Right-clicking the greeter and choosing an answer in chat" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Right-click the greeter with an empty hand.
- Click an answer in chat to get the next line.

## 4. Open a shop

A [shop](/animus/10-shops) is a file under `shops/` with offers. An NPC opens it on a click, either as a chest window or as the villager trading screen. **Shops** lists the shop files with their offer count, window style and how many selected NPCs bind each one. [Shops in the toolkit](/animus/21-in-game-toolkit#shops) lists the settings.

<div class="animus-demo">
<p><strong>Shops</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/25-shops-ingame.webm" aria-label="Opening a shop as a chest window and switching it to the trading screen" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the NPC that sells, then click **Shops** in the palette.
- Right-click a shop to open it for yourself.
- Sneak-click it for its settings. **Window** steps through `chest`, `native` (the trading screen) and `default` (the shop's own style).
- Close the window and right-click the NPC to see what players get.

```none
/animus shop open town:bakery
```

## 5. Make a shop

**New shop** writes an empty shop file. Bind it to an NPC from the same list. Offers are added in the [web editor](/animus/25-tutorial-web-editor).

<div class="animus-demo">
<p><strong>New shop</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/26-new-shop-ingame.webm" aria-label="Making the plaza:stall shop and binding it to the trader" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In **Shops**, click **New shop** and type `plaza:stall`. It writes `shops/plaza/stall.json` with no offers.
- Select the trader and left-click the new shop to bind it.

## 6. Add a hologram and a chest GUI

**GUIs** has a tab each for chest GUIs, menus, holograms and text animations, chosen in the bottom row. A hologram floats above the NPC. A chest GUI opens when a player clicks it. An NPC shows one hologram and opens one GUI at a time. [GUIs and holograms in the toolkit](/animus/21-in-game-toolkit#guis-and-holograms) lists the settings, and [GUIs, holograms and menus](/animus/11-guis-holograms-menus) covers the files.

<div class="animus-demo">
<p><strong>GUIs and holograms</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/27-guis-holograms-ingame.webm" aria-label="Showing a hologram over the greeter and binding a chest GUI to it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the NPC, then click **GUIs** in the palette.
- On the **Holograms** tab, left-click a hologram to show it above the selection.
- Sneak-click it and click **Offset Y** to raise it; **Above the head** removes the offset.
- On the **Chest GUIs** tab, right-click a GUI to see it, and left-click it to open it on the NPC's click.

## 7. Turn on combat

The combat module lets an NPC pick targets, fight and guard. **Combat** acts on the whole selection. Target rules say whom the NPC attacks, such as monsters or anything below half health. **Guard me** makes the NPC follow and protect you until it despawns. Combat ignores players in creative and spectator mode, so switch to survival to be guarded. [Combat](/animus/08-combat) covers weapons and protection, and [combat in the toolkit](/animus/21-in-game-toolkit#combat) lists the screens.

<div class="animus-demo">
<p><strong>Combat</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/28-combat-ingame.webm" aria-label="Turning on combat, setting target rules and having the guard follow the player" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the guard, then click **Combat** in the palette.
- Click **Enable combat**.
- Click **Targets**, left-click **Monsters**, then left-click **Health below**. Click **Save**; the reply shows the rules as the file reads them.
- Click **Back**, then left-click **Guard me**. Right-click it to stop.

```none
/animus combat status npc=guard
```

## 8. Make an NPC killable

An NPC cannot be hurt until its health module makes it killable. With `show-health` on, the player who hits it sees its name and health above the hotbar. A dead NPC falls and disappears, then respawns after a delay; revive brings it back at once. [Health and death](/animus/08-combat#health-and-death) covers drops, respawn points and permadeath.

<div class="animus-demo">
<p><strong>Health and revive</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/29-health-revive-ingame.webm" aria-label="Hitting a killable NPC until it dies and reviving it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus npc health spare-2 setting=killable value=on
/animus npc health spare-2 setting=show-health value=on
/animus npc health spare-2 setting=maximum value=2
/animus npc revive spare-2
```

**Revive** in the palette's **Manage** screen does the same as the last command.

## 9. Pair the web editor and undo a change

The [web editor](/animus/14-web-editor) edits what the toolkit cannot paint: shop offers, GUI layouts, hologram lines and behavior graphs. **Open in editor** sends a pairing link to chat. The link works once, within 10 minutes. Every change, from the toolkit, a command or the editor, has a transaction id, and **[Undo]** on its chat line puts the rollback command in your chat box.

<div class="animus-demo">
<p><strong>Editor link and undo</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/30-editor-pair-undo-ingame.webm" aria-label="Getting a pairing link and undoing a glow change from chat" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In **Manage**, click **Open in editor**. Click **[Open editor]** in the reply, or **[Click to copy]**.
- Make a change, such as turning on `glowing` in **Edit**, **Body**.
- Click **[Undo]** on the change's chat line and press Enter.

```none
/animus editor pair
/animus rollback <transaction>
```

Next: [the web editor](/animus/25-tutorial-web-editor).
