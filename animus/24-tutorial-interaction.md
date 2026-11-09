---
title: "Animus Tutorial: Conversations, Shops and Combat"
description: "Give NPCs behaviors, conversations, shops, GUIs, holograms, combat and health, then pair the web editor"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, tutorial, behaviors, conversations, shops, guis, combat"
editor: markdown
dateCreated: 2026-11-08T00:00:00.000Z
---

This is the third part of the Animus tutorial. It gives NPCs something to do when players meet them: behaviors, a conversation, a shop, a chest GUI and a hologram, combat rules and health. It ends by pairing the web editor, where the [last part](/animus/25-tutorial-web-editor) continues. It uses the greeter, trader, guard and `greeter-copy` from [the first part](/animus/22-tutorial-first-npc), and every shop, hologram and GUI it uses is made on the way.

## 1. Write a conversation

A conversation is a [behavior](/animus/07-behaviors): a file under `behaviors/` that runs when something triggers it, here a right click. It is made of blocks of lines. A block can end in a question, and each answer leads to another block. **New conversation** saves a conversation that says "Hello" on a right click and opens it in the conversation editor, one block at a time. Edits stay in the window until you save. [Conversations](/animus/21-in-game-toolkit#conversations) lists every button.

<div class="animus-demo">
<p><strong>Conversation editor</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/23-conversation-editor-ingame.webm" aria-label="Writing a conversation with one question in the block editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the greeter, then click **Behaviors** in the palette.
- Click **New conversation** and type `plaza:welcome`. It saves `behaviors/plaza/welcome.json`.
- Left-click the line and type `Welcome to the plaza, {player_name}.`
- Click **Add choice** and type an answer. The block gets a question, "Choose one.", to edit.
- Right-click the choice to open the block it leads to, then click **Add line**.
- Click **Back**, then **Save**.
- Click **Attach to selection** to give the conversation to the greeter.

## 2. Attach a behavior

**Behaviors** lists every behavior file. Each entry shows its file, what triggers it, whether it is a conversation and how many selected NPCs run it. [Behaviors in the toolkit](/animus/21-in-game-toolkit#behaviors) covers the controls.

<div class="animus-demo">
<p><strong>Behaviors and triggers</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/22-behaviors-list-ingame.webm" aria-label="Adding a behavior to an NPC and listing its trigger bindings" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- With the greeter selected, open **Behaviors** again. `plaza:welcome` shows that one selected NPC runs it.
- Right-click `plaza:welcome` to take it off the selection, then left-click it to add it back.
- Click **Trigger bindings** to list in chat what each NPC listens for.

```none
/animus behaviors triggers
```

## 3. Talk to the NPC

Players start the conversation by right-clicking the NPC. Lines show in chat with the NPC's name. Answers are bracketed chat buttons; hover one to read it and click it to choose. [Dialogue choices](/animus/07-behaviors#dialogue-choices) has the details.

<div class="animus-demo">
<p><strong>Conversation in play</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/24-conversation-play-ingame.webm" aria-label="Right-clicking the greeter and choosing an answer in chat" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Right-click the greeter with an empty hand.
- Click an answer in chat to get the next line.

## 4. Make a shop

A [shop](/animus/10-shops) is a file under `shops/` with offers. An NPC opens it on a click, either as a chest window or as the villager trading screen. **Shops** lists the shop files with their offer count, window style and how many selected NPCs bind each one. **New shop** writes an empty shop file, and `/animus shop stock` adds offers to it in game. [Shops in the toolkit](/animus/21-in-game-toolkit#shops) lists the settings.

<div class="animus-demo">
<p><strong>New shop</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/26-new-shop-ingame.webm" aria-label="Making the plaza:stall shop and binding it to the trader" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A click on an NPC does one thing, and the trader still carries players from the [movement part](/animus/23-tutorial-movement). Turn its riding off first: select the trader, click **Mounts** and **Riding**, turn off **Enabled** and click **Save**.

- With the trader selected, click **Shops** in the palette.
- Click **New shop** and type `plaza:stall`. It writes `shops/plaza/stall.json` with no offers.
- Left-click `plaza:stall` to bind it to the trader.
- Hold a stack of bread and add it as an offer. Players can then buy that stack for 5:

```none
/animus shop stock plaza:stall price=5
```

- To trade the bread for items instead, hold emeralds in your off hand and run `/animus shop stock plaza:stall mode=trade`.

## 5. Open the shop

The shop opens for a player who right-clicks the trader, or for you from the list.

<div class="animus-demo">
<p><strong>Shops</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/25-shops-ingame.webm" aria-label="Opening a shop as a chest window and switching it to the trading screen" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In **Shops**, right-click `plaza:stall` to open it for yourself.
- Sneak-click it for its settings. **Window** steps through `chest`, `native` (the trading screen) and `default` (the shop's own style).
- Close the window and right-click the trader to see what players get.

```none
/animus shop open plaza:stall
```

## 6. Add a hologram and a chest GUI

A hologram floats above an NPC. A chest GUI opens when a player clicks the NPC. An NPC shows one hologram and opens one GUI at a time. Make one of each first:

```none
/animus hologram create plaza:sign text="Welcome to the plaza"
/animus gui create plaza:menu rows=3
```

**GUIs** in the palette has a tab each for chest GUIs, menus, holograms and text animations, chosen in the bottom row. [GUIs and holograms in the toolkit](/animus/21-in-game-toolkit#guis-and-holograms) lists the settings, and [GUIs, holograms and menus](/animus/11-guis-holograms-menus) covers the files.

<div class="animus-demo">
<p><strong>GUIs and holograms</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/27-guis-holograms-ingame.webm" aria-label="Showing a hologram over the greeter and binding a chest GUI to it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the greeter, then click **GUIs** in the palette.
- On the **Holograms** tab, left-click `plaza:sign` to show it above the greeter.
- Sneak-click it and click **Offset Y** to raise it; **Above the head** removes the offset.
- Select the guard. The greeter's right click belongs to its conversation, so the GUI goes on the guard.
- On the **Chest GUIs** tab, right-click `plaza:menu` to see it, and left-click it to open it on the guard's click.

## 7. Turn on combat

The combat module lets an NPC pick targets, fight and guard. **Combat** acts on the whole selection. Target rules say whom the NPC attacks, such as monsters or anything below half health. **Guard me** makes the NPC follow and protect you until it despawns. Combat ignores players in creative and spectator mode, so switch to survival to be guarded. [Combat](/animus/08-combat) covers weapons and protection, and [combat in the toolkit](/animus/21-in-game-toolkit#combat) lists the screens.

<div class="animus-demo">
<p><strong>Combat</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/28-combat-ingame.webm" aria-label="Turning on combat, setting target rules and having the guard follow the player" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the guard you made in [the first part](/animus/22-tutorial-first-npc#4-make-an-npc), then click **Combat** in the palette. If you have no guard, left-click **New NPC** in the palette and type `guard`.
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

This uses `greeter-copy`, the dormant copy from [the first part](/animus/22-tutorial-first-npc#13-clone-delete-and-undo). Spawning it shows it where the greeter stood when you cloned it.

```none
/animus spawn greeter-copy
/animus npc health greeter-copy setting=killable value=on
/animus npc health greeter-copy setting=show-health value=on
/animus npc health greeter-copy setting=maximum value=2
/animus npc revive greeter-copy
```

Hit the copy until it dies, then revive it. **Revive** in the palette's **Manage** screen does the same as the last command.

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
