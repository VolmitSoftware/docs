---
title: "Animus Tutorial: Web Editor"
description: "Pair the web editor, make and edit NPCs, trait groups, conversations, shops and routes, and apply or undo changes"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, tutorial, editor, web, pairing"
editor: markdown
dateCreated: 2026-11-08T00:00:00.000Z
---

This is the last part of the Animus tutorial. The [web editor](https://animus-editor.web.app) edits every Animus document in the browser, with a 3D preview of each NPC. Paired with a server, it reads the server's documents and writes your changes back as one transaction. [Web editor](/animus/14-web-editor) is the full reference. The steps below assume the server from the [earlier parts](/animus/22-tutorial-first-npc).

## 1. Pair with a server

Pairing gives one browser a token for one server. Run the pair command in game or from the console and open the link it prints. The pairing page shows the server's name and fingerprint; check that it matches `/animus editor status`. **Remember this browser** is on by default, so the token survives closing the tab; turn it off on a shared computer. [Pairing](/animus/14-web-editor#pairing) lists the scopes and options.

<div class="animus-demo">
<p><strong>Pair with a server</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/01-pair-server-editor.webm" aria-label="Pasting a pairing link and pairing the editor with a server" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus editor pair
/animus editor status
```

- Click **[Open editor]** in the reply, or paste the link under **Servers** on the editor's home page.
- Check the fingerprint, leave **Remember this browser** on and click **Pair**.
- Click **Open all** in the sidebar to open the server's documents, or **Pick from the catalog** to open some of them.

The link works once, within 10 minutes. Add the `spawn` scope to spawn and despawn NPCs from the editor:

```none
/animus editor pair scopes=read,validate,preview,apply:npcs,apply:behaviors,apply:gui,apply:rigs,terrain,spawn
```

## 2. Create an NPC

**New document** starts each kind with a guided first step. For an NPC, the name and folder set its file id, then you pick a body, a skin and a position. **Preview** shows the model as players will see it.

<div class="animus-demo">
<p><strong>Create an NPC</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/02-create-npc-editor.webm" aria-label="Creating an NPC from New document and previewing it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Click **New document** (or press `N`) and pick **NPC**.
- Type a name and pick a folder. The id follows them.
- Pick a skin from the workspace and set the position.
- Click **Preview**.

## 3. Edit an NPC

An NPC opens with the inspector beside the 3D stage, and the stage follows every edit. **Appearance** holds the skin and the equipment slots, laid out like a player's inventory. **Attributes** adds values such as `scale`. [Web editor](/animus/14-web-editor) describes every part of the inspector.

<div class="animus-demo">
<p><strong>Edit an NPC</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/03-edit-npc-editor.webm" aria-label="Changing an NPC's skin, equipment and scale" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Open the NPC and go to **Appearance**.
- Pick a skin from the dropdown.
- Click the head or main hand slot and type an item id; the field suggests ids as you type.
- Under **Attributes**, add `scale` and set it to `2`.

## 4. Share a look with a trait group

A [trait group](/animus/18-trait-groups) supplies values to every NPC that lists it. Make one, give it a skin or equipment, then assign it to several NPCs at once. Each member's **Effective** table shows which value came from the group and which from the NPC.

<div class="animus-demo">
<p><strong>Trait groups</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/04-trait-groups-editor.webm" aria-label="Creating a trait group and assigning it to three NPCs" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Click **New document** and pick **Group**, the trait group kind. Give it an id.
- Set its look under **Appearance**.
- Go to **Browse**, select the NPCs and assign the group from the **Trait groups** form above the list.
- Open one member and read its **Effective** table.

## 5. Write a conversation from the keyboard

The **Conversation** tab edits a conversation as a tree of blocks, and most of it works without the mouse. A line that ends in answers in brackets becomes a question when you press Enter. **Preview** plays the conversation in the browser, and **NPCs** attaches it. [Conversations](/animus/14-web-editor#conversations) lists every key.

<div class="animus-demo">
<p><strong>Conversation by keyboard</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/05-conversation-editor.webm" aria-label="Writing a conversation with the keyboard, previewing it and attaching it to an NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Click **New conversation** in the sidebar and give it an id.
- Type the opening line. Type `{` to insert a placeholder such as `{player_name}`.
- End a line with `[Ferry] [Market]` and press Enter to turn it into a question with two answers.
- In an answer, press Ctrl+Enter (Cmd+Enter on a Mac) to add what follows it.
- Open a step's menu to delete it.
- Click **Preview** and pick an answer to test it.
- Under **NPCs**, tick an NPC and click **Attach**.

## 6. Add shop offers

The shop editor lists offers as rows that read like trades, and draws the trading screen and the chest window beside them as players see them. **+ Add offer** picks the kind: trade, buy, sell, command or decoration. The **NPCs** tab attaches the shop to an NPC. [GUI editors](/animus/14-web-editor#gui-editors) describes every field.

<div class="animus-demo">
<p><strong>Shop offers</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/06-shop-offers-editor.webm" aria-label="Adding a trade and a buy offer and attaching the shop to an NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Click **New document**, pick **Shop** and start blank.
- Set the title.
- Click **+ Add offer**, pick **Trade** and set the items. Add a **Buy** offer with a price. Money prices need Vault and an economy plugin on the server; without them, use item prices.
- Switch between **Trading screen** and **Chest window** to check both.
- On the **NPCs** tab, click **Attach to NPC...** and pick the NPC.

## 7. Shape a route

The route editor draws points on a top-down grid; click to add a point and drag to move one. Route settings cover the order, the wait at each point and a seed for random order. A picked point can have its own wait and jitter. With the `terrain` scope, the grid shows the server's ground. [Routes](/animus/05-movement-mounts-riding#routes) explains each setting.

<div class="animus-demo">
<p><strong>Routes</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/07-routes-editor.webm" aria-label="Setting a random route with a wait range and adding points on the grid" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Open a route, or an NPC's route under **Behavior**.
- Set **Order** to `random`, turn on **Range** for the wait and set its Min and Max, then pick a **Seed**.
- Click the grid to add points.
- Click a point and set its own wait and jitter.

## 8. Let completion fill names

Text, expression and id fields complete as you type. Ctrl+Space opens the list anywhere. Matching is loose, so `dsw` finds `diamond_sword`. Paired, item and entity ids come from the server, modded ones included. [Completion](/animus/14-web-editor#completion) lists every trigger character.

<div class="animus-demo">
<p><strong>Autocomplete</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/08-autocomplete-editor.webm" aria-label="Completing a placeholder, a colour tag and an item id" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Type `{` for the placeholders the field fills.
- Type `<` for colour and decoration tags.
- In an item field, start typing an id and press Enter to pick it.

## 9. Apply and undo

Edits to a server workspace are drafts until you apply them. **Apply** checks every changed draft and writes them all as one transaction, or writes nothing. The document's revision goes up by one. **Undo last apply** rolls the change set back after a confirm. Online operators see a chat line for each apply. [Applying changes](/animus/14-web-editor#applying-changes) covers conflicts and merges.

<div class="animus-demo">
<p><strong>Apply and undo</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/09-apply-undo-editor.webm" aria-label="Renaming an NPC, applying it and undoing the apply" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Change a field, such as an NPC's name.
- Type a change note and click **Apply** (or press Ctrl+S, Cmd+S on a Mac).
- Click **Undo last apply** and confirm.

The same change set can be undone in game from its transaction id:

```none
/animus rollback <transaction>
```

## 10. Learn the shortcuts

Press `?` outside a text box for the shortcut sheet. It lists the keys that work everywhere and the keys of the part you are in. [Keyboard and commands](/animus/14-web-editor#keyboard-and-commands) lists them too.

<div class="animus-demo">
<p><strong>Shortcut sheet and sidebar</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/10-shortcuts-sidebar-editor.webm" aria-label="Opening the shortcut sheet and hiding the sidebar" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

| Keys | Does |
|---|---|
| `?` | Show the shortcut sheet |
| Ctrl+B (Cmd+B) | Show or hide the sidebar |
| N | New document |
| B | Browse NPCs |
| Ctrl+K (Cmd+K) | Open the command palette |
| Ctrl+Z (Cmd+Z) | Undo |
