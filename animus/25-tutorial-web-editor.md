---
title: "Animus Tutorial: Web Editor"
description: "Pair the web editor, make and edit NPCs, trait groups, conversations, shops and routes, and apply or undo changes"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, tutorial, editor, web, pairing"
editor: markdown
dateCreated: 2026-11-08T00:00:00.000Z
---

This is the last part of the Animus tutorial. The [web editor](https://animus.volmitsoftware.com) edits every Animus document in the browser, with a 3D preview of each NPC. Paired with a server, it reads the server's documents and writes your changes back as one transaction. [Web editor](/animus/14-web-editor) is the full reference. The steps below assume the server from the [earlier parts](/animus/22-tutorial-first-npc).

## 1. Pair with a server

Pairing gives one browser a token for one server. Run the pair command in game or from the console and open the link it prints. The pairing page shows the server's name, until when the link works and what the editor may do there; in Advanced, **Details** shows the fingerprint, which should match `/animus editor status`. **Stay paired** is on by default, so the pairing survives closing the tab; turn it off on a shared computer. [Pairing](/animus/14-web-editor#pairing) lists the scopes and options.

<div class="animus-demo">
<p><strong>Pair with a server</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/01-pair-server-editor.webm" aria-label="Pasting a pairing link and pairing the editor with a server" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus editor pair
/animus editor status
```

- Click **[Open editor]** in the reply, or paste the link into **Pairing link** on the editor's start page and press **Open link** there.
- On the pairing page, leave **Stay paired** on and click **Pair**.
- The editor opens the server's Home, with a count for each job. Click **NPCs** to see every NPC by name.

The link works once, within 10 minutes. The pairing can do everything but run console commands, including spawning NPCs and importing, and it lasts until it goes unused for 7 days.

## 2. Create an NPC

**New NPC** on the NPC list asks for a name and a body, then opens the new NPC. In Advanced it also asks for the folder and the file id, which follows the name. The preview beside the form shows the model as players will see it.

<div class="animus-demo">
<p><strong>Create an NPC</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/02-create-npc-editor.webm" aria-label="Creating an NPC from New NPC and previewing it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Open **NPCs** and click **New NPC**.
- Type a name, keep the **Player** body and click **Create**.
- Beside **Skin**, click **Change** and pick a saved skin. Set the position under **Position**.
- Drag the preview to turn the model.

## 3. Edit an NPC

An NPC opens as a form in tabs beside the 3D preview, and the preview follows every edit. **Basics** holds the name, body and skin; **Look** holds the equipment slots, laid out like a player's inventory. In Advanced, **Attributes** adds values such as `scale`. [Web editor](/animus/14-web-editor) describes every tab.

<div class="animus-demo">
<p><strong>Edit an NPC</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/03-edit-npc-editor.webm" aria-label="Changing an NPC's skin, equipment and scale" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Open the NPC from **NPCs**. On **Basics**, click **Change** beside **Skin** and pick a saved skin.
- On **Look**, click the head or main hand slot and type part of an item id; the field suggests items as you type.
- Switch to **Advanced**, open **Attributes**, add **Size** (`scale`) and set it to `2`.

## 4. Share a look with a trait group

A [trait group](/animus/18-trait-groups) supplies values to every NPC that lists it. Make one, give it a skin or equipment, then assign it to several NPCs at once. Each member's **What it takes** list shows which value came from the group and which from the NPC.

<div class="animus-demo">
<p><strong>Trait groups</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/04-trait-groups-editor.webm" aria-label="Creating a trait group and assigning it to three NPCs" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Switch to **Advanced**, open **Trait groups**, click **New trait group** and give it an id.
- Set its look on the **Look** tab.
- Open **NPCs**, tick the NPCs, click **Trait group** in the bar under the list and pick the group.
- Open one member. Under **Trait groups** on **Basics**, open **What it takes**.

## 5. Write a conversation from the keyboard

The **Conversation** tab edits a conversation as a tree of blocks, and most of it works without the mouse. A line that ends in answers in brackets becomes a question when you press Enter. **Test** plays the conversation in the browser, and **NPCs** attaches it. [Conversations](/animus/14-web-editor#conversations) lists every key.

<div class="animus-demo">
<p><strong>Conversation by keyboard</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/05-conversation-editor.webm" aria-label="Writing a conversation with the keyboard, testing it and attaching it to an NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Open **Behaviors**, click **New behavior**, keep **Conversation** and give it a name.
- Type the opening line. Type `{` to insert a placeholder such as `{player_name}`.
- End a line with `[Ferry] [Market]` and press Enter to turn it into a question with two answers.
- In an answer, press Ctrl+Enter (Cmd+Enter on a Mac) to add what follows it.
- Open a step's menu to delete it. Deleting a question leaves the parts its answers led to under **Other parts**; delete those from their own menus.
- In **Test**, pick how it starts, press **Run**, then pick an answer.
- Under **NPCs**, pick an NPC from the list.

## 6. Add shop offers

The shop page lists offers as rows that read as what the player gets for what it costs, and draws the window players get beside them. **Add offer** adds an offer; the **...** beside it picks another kind: trade, buy, sell, command or decoration. **Opened by** on the **Settings** tab attaches the shop to an NPC. [GUI editors](/animus/14-web-editor#gui-editors) describes every field.

<div class="animus-demo">
<p><strong>Shop offers</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/06-shop-offers-editor.webm" aria-label="Adding a trade and a buy offer and attaching the shop to an NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Open **Shops**, click **New shop**, type the title and keep **Blank**.
- Click the **...** beside **Add offer**, pick **Add trade** and set the items. Click **Add offer** for a buy offer and set its price. Money prices need Vault and an economy plugin on the server; without them, use item prices.
- In Advanced, the preview's **...** switches between **Trading screen** and **Chest window**; check both.
- On the **Settings** tab, pick the NPC under **Opened by**.

## 7. Shape a route

The route editor shows the map first: points on a top-down grid, numbered from 1, with the list of points beside or under it. With **Add points** a click adds a point; drag one to move it. Simple shows the order, Loop and the speed; **More settings** holds the wait (in seconds), random picks, the start and the spread. A picked point can have its own wait, and under its **More** its own spread. With the `terrain` scope, the map shows the server's ground and **3D** shows the route over the blocks. [Routes](/animus/05-movement-mounts-riding#routes) explains each setting.

<div class="animus-demo">
<p><strong>Routes</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/07-routes-editor.webm" aria-label="Making a random route with a wait range and adding points on the map" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Open **Movement** and click **New route**, or pick a route from the list.
- Set **Order** to **Random**. Open **More settings**, pick **Range** for the wait and type the shortest and longest in seconds, then set **Random picks** to **New each time**.
- With **Add points** on, click the map to add points.
- Click a point, set its own wait, and open its **More** for its spread.

## 8. Let completion fill names

Text, expression and id fields complete as you type. Ctrl+Space opens the list anywhere. Matching is loose, so `dsw` finds `diamond_sword`. In Simple, item fields list items by name instead. Paired, item and entity ids come from the server, modded ones included. [Completion](/animus/14-web-editor#completion) lists every trigger character.

<div class="animus-demo">
<p><strong>Autocomplete</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/08-autocomplete-editor.webm" aria-label="Completing a placeholder and a colour tag, then picking an item by name" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Type `{` for the placeholders the field fills.
- Type `<` for colour and decoration tags.
- In an item field, type part of the item's name and pick it from the list.

## 9. Apply and undo

Edits to a server stay in the browser until you apply them, and the save bar at the bottom counts them. **Apply** checks every change and writes them all as one transaction, or writes nothing. The document's revision goes up by one. **Undo** on the save bar, right after the apply, rolls the change set back after a confirm; in Advanced, the **Applied** list in **Review** undoes earlier applies too. Online operators see a chat line for each apply. [Applying changes](/animus/14-web-editor#applying-changes) covers conflicts and merges.

<div class="animus-demo">
<p><strong>Apply and undo</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/09-apply-undo-editor.webm" aria-label="Renaming an NPC, applying it and undoing the apply" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Change a field, such as an NPC's name.
- Click **Review** on the save bar to see the change. In Advanced, type a **Change note** there.
- Click **Apply** (or press Ctrl+S, Cmd+S on a Mac).
- Click **Undo** on the save bar and confirm.

The same change set can be undone in game from its transaction id:

```none
/animus rollback <transaction>
```

## 10. Learn the shortcuts

Press `?` outside a text box for the shortcut sheet. It lists the keys that work everywhere and the keys of the part you are in. [Keyboard and commands](/animus/14-web-editor#keyboard-and-commands) lists them too.

<div class="animus-demo">
<p><strong>Shortcut sheet</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/10-shortcuts-sidebar-editor.webm" aria-label="Opening the shortcut sheet and jumping with single keys" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

| Keys | Does |
|---|---|
| `?` | Show the shortcut sheet |
| N | New document |
| B | Open the NPC list |
| Ctrl+K (Cmd+K) or `/` | Search |
| Ctrl+Z (Cmd+Z) | Undo |
