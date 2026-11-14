---
title: "Animus Tutorial: Conversations, Shops and Combat"
description: "Give NPCs conversations, behaviors, shops, holograms, GUIs, combat and health, then pair the web editor"
published: true
date: 2026-11-12T00:00:00.000Z
tags: "animus, tutorial, behaviors, conversations, shops, guis, combat"
editor: markdown
dateCreated: 2026-11-08T00:00:00.000Z
---

This is the third part of the Animus tutorial. It gives NPCs something to do when players meet them: a conversation, a shop, a hologram and a chest GUI, combat and health. It ends by pairing the web editor, where the [last part](/animus/25-tutorial-web-editor) continues. It uses the greeter, trader, guard and `greeter-copy` from [the first part](/animus/22-tutorial-first-npc), and every shop, hologram and GUI it uses is made on the way.

## 1. Write a conversation

A conversation is a [behavior](/animus/07-behaviors) that talks: lines the NPC says, and answers players pick. It is made of blocks of lines. A block can end in a question, and each answer leads to another block. **Talk** on the NPC screen makes the NPC's first conversation, one that says "Hello" on a right click, and opens it in the conversation editor, one block at a time. Changes stay in the window until you click **Save**. [Conversations](/animus/21-in-game-toolkit#conversations) lists every button.

<div class="animus-demo">
<p><strong>Conversation editor</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/23-conversation-editor-ingame.webm" aria-label="Writing the greeter's conversation with one question in the block editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Right-click the greeter with the wand, then click **Talk**. The conversation is made, put on the greeter and opened.
- Click the line and type `Welcome to the plaza, {player_name}.`
- Click **Add choice** and type `Where is the bakery?`, then, when it asks for the NPC's answer, `Follow the lanterns north.` The block gets a question, "Choose one.", to edit, and the choice's lore reads `Then: Follow the lanterns north.`
- Click **Back**, then **Save**.

## 2. See the NPC's behaviors

A behavior is what an NPC does when something happens: a click, a player nearby, a timer. In Advanced mode, **Behaviors** on the NPC screen lists every behavior file. Each entry says whether it is a conversation and how many selected NPCs have it. [Behaviors in the menu](/animus/21-in-game-toolkit#behaviors) covers the controls.

<div class="animus-demo">
<p><strong>Behaviors and triggers</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/22-behaviors-list-ingame.webm" aria-label="Taking the greeter's conversation off and putting it back, then listing trigger bindings" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Switch to Advanced with the **Mode** lever on the greeter's screen, then click **Behaviors**. The greeter's conversation shows it is on 1 of 1 selected.
- Right-click it and click **Remove from NPC** to take it off the greeter. Click **Back**: the conversation now shows it is on 0 of 1. Click it to put it back.
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

A [shop](/animus/10-shops) is a trade window an NPC opens, either as a chest window or as the villager trading screen. Its file sits under `shops/`. **Shop** on the NPC screen lists the shop files with their offer count and how many selected NPCs use each one. **New shop** makes an empty shop, and **Add held item** sells what you hold in it. [Shops in the menu](/animus/21-in-game-toolkit#shops) lists the settings.

<div class="animus-demo">
<p><strong>New shop</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/26-new-shop-ingame.webm" aria-label="Making the plaza:stall shop on the trader and stocking it with bread" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A click on an NPC does one thing, and the trader still carries players from the [movement part](/animus/23-tutorial-movement). Turn its riding off first: on the trader's screen, click **Movement**, **Mounts and riding** and **Riding**, click **Enabled** to turn it off, and click **Save**.

- On the trader's screen, click **Shop**, then **New shop**, and type `plaza:stall`. It writes `shops/plaza/stall.json` with no offers, puts it on the trader and opens its details.
- Close the window, hold a stack of bread and run `/animus tools`. The trader is selected, so its screen opens.
- Click **Shop**, right-click `plaza:stall`, click **Add held item** and type `5`. Players can buy that stack for 5, which the shop writes in the server economy's format, such as `$5.00`. Without an economy plugin the offer is still added, but players cannot pay for it.

To trade the bread for items instead, hold emeralds in your off hand and run:

```none
/animus shop stock plaza:stall mode=trade
```

## 5. Open the shop

The shop opens for a player who right-clicks the trader, or for you from its details.

<div class="animus-demo">
<p><strong>Shops</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/25-shops-ingame.webm" aria-label="Stepping a shop through its window styles and opening it as a player" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On the trader's screen, click **Shop** and right-click `plaza:stall`.
- Click **Window style** to step through **Chest window**, **Villager trades** and **Shop default**, the shop's own style.
- Click **Open** to see the shop as the trader opens it, here as villager trades.
- Close the window and right-click the trader with an empty hand to see the shop as players do.

```none
/animus shop open plaza:stall npc=trader
```

## 6. Add a hologram and a chest GUI

A hologram is floating text above an NPC. A chest GUI is a chest window you design, opened when a player clicks the NPC. An NPC opens one GUI at a time. [Hologram](/animus/21-in-game-toolkit#hologram) and [GUIs and holograms](/animus/21-in-game-toolkit#guis-and-holograms) in the menu cover the settings, and [GUIs, holograms and menus](/animus/11-guis-holograms-menus) covers the files. Make a saved hologram and a chest GUI first:

```none
/animus hologram create plaza:sign text="Welcome to the plaza"
/animus gui create plaza:menu rows=3
```

<div class="animus-demo">
<p><strong>GUIs and holograms</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/27-guis-holograms-ingame.webm" aria-label="Adding a hologram line and a saved hologram to the greeter, then opening a chest GUI from the guard" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On the greeter's screen, click **Hologram**, then **Add line**, and type `&6Town greeter`. The line floats above the greeter.
- Click **Saved hologram** and click `plaza:sign` to show it above the greeter too.
- Click **Height** a few times to raise it. Sneak-click it and type nothing to put it back above the head.
- Right-click the guard with the wand. The greeter's right click belongs to its conversation, so the GUI goes on the guard.
- In Advanced, click **GUIs**. On the **Chest GUIs** tab, right-click `plaza:menu` and click **Show to me** to see it. Click **Back**, then click `plaza:menu` to open it from the guard's click.

## 7. Turn on combat

Combat is whether the NPC fights, who it targets and its health. **Combat** on the NPC screen changes every selected NPC, and each control saves at once. **Guard me** makes the NPC follow you and fight what hurts you. Combat ignores players in creative and spectator mode, so switch to survival to be guarded. [Combat](/animus/08-combat) covers weapons and protection, and [combat in the menu](/animus/21-in-game-toolkit#combat) lists the screens.

<div class="animus-demo">
<p><strong>Combat</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/28-combat-ingame.webm" aria-label="Turning on combat for the guard, setting what it attacks and having it guard the player" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Right-click the guard you made in [the first part](/animus/22-tutorial-first-npc#4-make-an-npc) with the wand, then click **Combat**. If you have no guard, click **New NPC** on Home and make one named `Guard`.
- Click **Fights** to turn it on.
- Click **Attacks** until it reads **Monsters**.
- In Advanced, click **Targets**, then **Health below**, which turns on at 50%. Click **Save**; the reply shows the rules as the file reads them.
- Click **Back**, then **Guard me**. Click it again to stop.

```none
/animus combat status npc=guard
```

## 8. Make an NPC killable

An NPC cannot be hurt until its health settings make it killable. With `show-health` on, the player who hits it sees its name and health above the hotbar. A dead NPC falls and disappears, then respawns after a delay; revive brings it back at once. [Health and death](/animus/08-combat#health-and-death) covers drops, respawn points and permadeath.

<div class="animus-demo">
<p><strong>Health and revive</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/29-health-revive-ingame.webm" aria-label="Hitting a killable NPC until it dies and reviving it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

This uses `greeter-copy`, the despawned copy from [the first part](/animus/22-tutorial-first-npc#13-copy-delete-and-undo). Spawning it shows it where the greeter stood when you copied it.

```none
/animus spawn greeter-copy
/animus npc health greeter-copy setting=killable value=on
/animus npc health greeter-copy setting=show-health value=on
/animus npc health greeter-copy setting=maximum value=2
/animus npc revive greeter-copy
```

Hit the copy until it dies, then revive it. On the Combat screen, **Can be hurt** and **Health** set the first and third of these, and **Revive** on the NPC screen in Advanced does the same as the last command.

## 9. Pair the web editor and undo a change

The [web editor](/animus/14-web-editor) edits what the menu cannot draw: shop offers, GUI layouts, saved hologram lines and behavior graphs. **Web editor** on Home sends a pairing link to chat. The link works once, within 10 minutes. Every change from the menu or a command has **[Undo]** on its chat line, and one click reverts it.

<div class="animus-demo">
<p><strong>Editor link and undo</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/30-editor-pair-undo-ingame.webm" aria-label="Getting a pairing link from Home and undoing a rename from chat" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On Home, click **Web editor**. Click **[Open editor]** in the reply, or **[Copy]**.
- Make a change, such as a new **Name** for the greeter.
- Close the window and click **[Undo]** on the change's chat line. The old name comes back.

```none
/animus editor pair
/animus undo
```

Next: [the web editor](/animus/25-tutorial-web-editor).
