---
title: "Animus: Web Editor"
description: "Pairing the web editor with a server and what it edits"
published: true
date: 2026-11-11T00:00:00.000Z
tags: "animus, editor, web, pairing"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

The web editor runs in the browser at <https://animus.volmitsoftware.com>. It edits NPCs, trait groups, routes, recordings, skins, behaviors, packs, shops, chest GUIs, menus, holograms, text animations, rigs and animations, with a 3D preview of each NPC. It works on its own against local files, and against a live server once paired.

## Working without a server

A workspace lives in the browser and is never uploaded. On a first visit the start page has three cards: **Pair a server** (see [pairing](#pairing)), **Try the examples**, whose **Open examples** opens example NPCs, shops and behaviors that never reach a server, and **Open my files**, with **Open zip** and **Open folder** for a copy of the data folder (`plugins/Animus`, or `config/animus` on mod servers). **Import** and **Blank workspace** (it asks a name, then **Create**) sit under the cards. Opening a folder copies it into a new workspace: edits stay in the browser until you export or send them, and do not go back into the folder. Export a workspace as a zip (**Export zip** in the top bar's **...** menu, or in the workspace's row on the start page) to copy it back to a server by hand. A folder or zip with no Animus documents, such as the server root, `plugins/` itself or a file that is not a zip, opens nothing and saves nothing; the start page says what it found and what to pick.

Once this browser keeps a workspace or a paired server, the start page leads with **Continue**: each paired server once, with its state (Online, Checking or Not reachable) and how many documents its workspace holds, then the workspaces kept in this browser. Each row has **Open** and a **...** menu with **Rename**, **Duplicate**, **Export zip** and **Delete workspace** for a workspace, or **Forget server** for a server; Delete and Forget ask first. **Restore** brings a deleted workspace back until you close the tab. The **Start** row below holds **Open folder** and **Pair a server**, which opens a dialog with the link field, and its **...** menu holds **Open zip**, **Open examples**, **Blank workspace** and **Import**.

<div class="animus-demo">
<p><strong>Export a workspace</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/17-export-workspace-editor.webm" aria-label="Exporting a workspace as a data folder zip" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

NPC definitions and trait groups at an older [schema version](/animus/12-storage-recovery#schema-versions) are upgraded in the browser as a folder, zip or stored workspace opens, the same way the server upgrades them. The notice counts the upgraded files, in Advanced the workspace's Home lists them beside any files it did not read, and **Export** and **Send to server** write the current version.

<div class="animus-demo">
<p><strong>Workspace Home</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/43-workspace-overview-editor.webm" aria-label="Opening a zip and finding the documents that need repair from its Home" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

If the browser cannot keep workspaces (some private windows have no IndexedDB), a banner says so: everything works until the tab closes, so export a zip first. If the browser refuses to store an edit (for example when it is out of storage space for the site), the edit stays on screen and a banner names the cause, with **Save again** and **Export zip**.

A workspace, local or on a server, opens on its Home. It has a link card for each job with its count (NPCs, Behaviors, Shops, Movement and Holograms; Advanced adds GUIs, Quests, Rigs, Trait groups and Packs), **Needs attention** for documents with problems or changed both here and on the server, and a **First steps** checklist (Pick an NPC, Change something, and on a server Apply) that ticks itself off and hides for good with its close button. A blank local workspace says "No documents yet." with **New NPC** and **Import**.

<div class="animus-demo">
<p><strong>Workspaces on the start page</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/13-offline-home-editor.webm" aria-label="Starting a workspace, then renaming, copying and restoring one" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Every document is checked against the Animus schemas as you type. In Advanced it has its form (Steps for a behavior), **Code** and **Split** views, and the preview sits beside the form. The header shows the document's revision, read only: the server raises it on every apply. Text typed in Code joins the draft only with **Use this code**; **Discard** drops it. Until then it stays with the document while you open others: the other views say the code is not used yet, and closing the tab asks first. New documents start from a guided first step, such as an NPC from its name, folder, body, skin and position, or a behavior from the conversation, greeter, dialogue, patrol, shop, guard or quest template.

<div class="animus-demo">
<p><strong>New document</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/14-new-document-editor.webm" aria-label="Creating a behavior from New document and switching between its views" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="animus-demo">
<p><strong>Code view</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/21-json-view-editor.webm" aria-label="Renaming an NPC in the JSON while the form and the preview follow" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A list longer than eight entries has a search field at its top: type to narrow it. A list that picks another document, such as an NPC's rig or a route's recording, ends with **+ New** and **Manage**. **+ New rig** opens the new rig form with what you typed in the search as its name and the current folder, and **Create** brings you back with the new rig picked. **Manage rigs** lists every rig. Recordings are made in game, so their list says to run `/animus record start <id>` instead.

In Simple mode a behavior that is not a conversation reads as plain sentences: each part, what starts it and its steps. **Edit in Advanced** switches the mode to change it. In Advanced its **Steps** view reads top to bottom: the behavior (its id, the part it starts in and the server switch), its variables, its parts with their steps, then **Starts when** with its triggers.

- A step's header shows its type and what it does in plain words, such as "Say: Welcome" or "While count < 3"; click it to fold the step. Its **...** menu moves, duplicates or deletes it, and Delete asks first. A step you fold stays folded while you edit the rest.

<div class="animus-demo">
<p><strong>Behavior steps</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/18-behavior-nodes-editor.webm" aria-label="Folding a behavior's steps and adding a Say step to the end of a part" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Wherever a step takes a value (a `set`, a `repeat` count, a `foreach` list, a `return`, a call's arguments) you choose a typed value, a variable of a matching type, an expression, or a template with `{{ }}` holes.

<div class="animus-demo">
<p><strong>Typed values</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/19-typed-values-editor.webm" aria-label="Filling a repeat count from an expression that checks itself as it is typed" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Expressions and templates check themselves as you type and offer variables, `player.` and `npc.` facts, event `context.` keys and functions below the field; use the arrow keys and Enter to pick one.
- An action's argument can also be filled when the step runs: **Fill from** beside the value offers From a variable, From an expression or From a template, and the editor writes the placeholder for you.
- The Server behavior switch in the Behavior section makes the behavior server-wide: NPC events, `npc` and `relationship` scopes and NPC-only capabilities disappear from the pickers, and timers start at 20 ticks.

**Test**, in the pane beside a behavior (behind **Test** in the page header on a phone), runs it in the browser: pick how it starts, read what the NPC says and asks in a chat like the game's, answer its questions, and press **Run** again to start over. Loops, expressions and templates run in the browser; facts only a server knows, such as a player's health, use sample values, and a condition that reads one is marked assumed so you can flip it. Commands, combat, building, items and shop trades are listed as server-only and not run.

<div class="animus-demo">
<p><strong>Behavior test</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/16-dry-run-editor.webm" aria-label="Running a behavior in the Test pane and answering its questions" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

An NPC's Preview wears its skin: the editor reads the skin document the NPC names (on a server workspace it fetches that document when you open the NPC) and loads the texture from Mojang's texture server in your browser. Until the texture arrives, or if it cannot be loaded, the stage wears a stand-in skin; a texture that fails shows **Skin did not load** under the stage, its (i) says why, and **Retry skin** in the stage's header loads it again. A PNG kept in the workspace under `editor/skins/<hash>.png`, or one you load under Appearance, is used instead. An unsigned skin without a kept PNG shows the stand-in.

`server-behaviors.json`, the list of server behaviors that run, opens like any other document and is kept when you export the workspace. Its form lists the server behaviors in order: add one from the behaviors in this workspace that have the server switch on, remove one, or move it up or down. Only listed behaviors run, so an empty list runs none. Create the list from the New page; it starts with every server behavior in the workspace.

<div class="animus-demo">
<p><strong>Server behaviors</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/20-server-behaviors-editor.webm" aria-label="Making a behavior server-wide and adding it to server-behaviors.json" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Schematics are not editor documents.

### NPCs, trait groups, routes, recordings, skins and packs

<div class="animus-demo">
<p><strong>Create an NPC</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/02-create-npc-editor.webm" aria-label="Creating an NPC from New NPC and previewing it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

**NPCs** in the nav lists every NPC with its face as the preview draws it (its skin, its stand-in skin, or another body's spawn egg or item), its name, its body and world (and where it stands, for an NPC with no name), and a Despawned or problem badge. On a paired server every NPC is listed as soon as the editor connects, and an NPC is read when you open it; click a row, or press Enter on it, to open it. Search finds every word you type in the name, the body, the world, the file path and the tags. **Spawned**, **Despawned** and **Has problems** narrow the list, and so do **Folder** (every folder with its NPC count; a folder includes the folders inside it), **Body** and **World** above it. A search that matches nothing offers Clear search, and an empty list offers **New NPC**.

**New NPC** asks for a name and a body (Player, Villager, Zombie and other common bodies, or **Other** with a typed id) and opens the new NPC. In Advanced it also asks for the folder, by default the one the list shows, and the id, the file name, proposed from the name.

In Advanced, the **...** menu beside New NPC works on folders:

- **Rename folder** and **Move folder** take every NPC of the folder and its subfolders along, in one undo step.
- A folder exists only while it holds NPCs, so there is no New folder or Delete folder: moving NPCs to a typed path makes one, and moving the last NPC out removes it.

Folder names follow the server's rules: 1-64 lowercase letters, digits, `_` or `-`, starting with a letter or digit, at most 8 folders deep. A name the server would refuse is refused before anything changes, in the server's words.

<div class="animus-demo">
<p><strong>NPC folders</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/27-npc-folders-editor.webm" aria-label="Making, renaming and moving NPC folders" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

In Advanced, rows show their file path and tags, the most used tags become filter chips, and each row has a checkbox; Ctrl+A picks every row shown. The bar under the picked NPCs has **Spawn**, **Despawn**, **Tags** (add or remove one tag), **Folder** (pick one, `npcs/` itself included, or type a new path such as `town/market`), **Module** (turn one on or off, or remove it), **Trait group** and **Delete**. Each change is one undo step.

**Trait group** adds the picked NPCs to a [trait group](/animus/18-trait-groups) or takes them out, like `/animus groups assign` and `unassign`. To reach one folder or every NPC with a tag, filter the list by that folder or tag chip and press Ctrl+A first.

- The reply reads like the server's, such as `Assigned town-guards: 2 changed, 1 unchanged.`, and the whole change is one undo step. On a server workspace it goes out as one change set at the next apply.
- A group the workspace does not have, or one that would give an NPC more than 16 groups, changes nothing.

Delete asks once more, and Escape keeps the NPCs. On a paired server whose token has the `spawn` scope, Spawn and Despawn act on the server at once; Despawn asks first because undo does not reach the server. Without the scope they mark the NPCs spawned or despawned in their files, sent at the next apply.

An NPC opens as a form in tabs beside the 3D preview; on a phone the form comes first and **Preview** shows the stage. Simple shows five tabs: Basics, Look, Movement, Talk and trade, and Combat. Advanced adds Attributes, Modules and Integrations, and more fields inside the first tabs. When a field Simple hides holds a value, its tab says how many advanced settings are in use, with **Show** to open them in that tab only; the same line above the tabs names the Advanced tabs in use. Simple never drops what it does not show.

- Basics: the name, the body (picked by name: Player, Villager, Iron golem and the rest), the skin, whether the NPC is spawned, and where it stands: world, position and facing. Advanced adds the id, folder, UUID and owner, tags, the head tilt, named facings and anchors for the `animus:pose` action, and the trait groups the NPC lists. Trait groups show as a row of chips in merge order: click one to open it, drag it or press Alt with the left or right arrow to reorder, and × removes it; a trait group the workspace does not have carries a warning. **Add group** picks one from the workspace, and **+ New group** asks for a name, makes the trait group and lists it on this NPC in one undo step, then offers to open it. An NPC made in the editor while it is paired gets the pairing player as its owner; the field stays editable.
  - The skin field shows the worn skin's face and name, with Remove skin. **Change** opens the saved skins with their faces and the built-in ones; a built-in skin makes a skin document from that PNG, labelled with its name, and wears it in one undo step. **Upload PNG** takes a file; in Advanced a PNG address does the same, and a skin id wears a skin the server has that the workspace does not. The stage beside it wears whatever is picked here.
  - While the NPC wears a skin, its own or one from a trait group, choosing a body other than a player asks first, since the server refuses a skin on any other body. Remove skin changes both in one step, also taking the skin out of the trait groups that gave it, and Cancel keeps the player body.
  - Fields left from the old body after a body change, such as a skin, a pose or another body's settings, are listed under the body on Basics with a button to remove each one, or all of them.
- What it takes, under the trait groups: the definition the server runs, one row per field, per module and per attribute with the trait group or NPC that set it and a link to that trait group, plus the whole effective JSON. The 3D stage draws the effective definition, so equipment, holograms and skins from trait groups show on it.
- Look: equipment, hologram text, the pose (player bodies only), an armor stand's parts and pose angles, and the settings of its body (a horse's coat, a sheep's wool, a villager's profession and the rest) as dropdowns, numbers and switches. More holds whether the name shows and the traits that body has: baby only for bodies with a baby form, tab list and raised item only for players. Advanced adds a rig from the workspace (the stage draws it), the skin layers and arm model, the boss bar, who may see the NPC and the NPC that receives its clicks. The stage draws every body type with the client's own models, and the settings that change how a body looks: coats, markings and variants, wool colour and shearing, collars, slime, magma cube and phantom sizes, villager clothes and badges, tropical fish patterns and colours, sitting, lying and the other poses, a painting's art and side, an item frame's item and turn, a falling block's or block display's block state, an item display's item and transform, a text display's text, and the saddles, harnesses and body armor a mob wears. Fish out of water lie on their side and squids tip over, as in game. A note under the stage names what it draws differently: a baby is drawn grown, an animated state such as an armadillo rolling up is drawn at rest, and a display that turns toward the viewer is drawn fixed. A LibsDisguises `disguise` (Integrations) that names a vanilla type, such as `zombie setBaby true`, draws that body; its options, and custom disguises, show in game only.
- Look, in detail:
  - The arm model (slim or classic) sits with the skin layers in Advanced.
  - Equipment shows as inventory slots laid out like the player's: armor down the left, with saddle and body armor and the hands beside it. Only the slots the body shows appear, plus any other slot already filled, with a warning. Click a slot, or press Enter, to edit its item and count below the grid, picked by name; Advanced adds its components. Arrow keys move between slots, a right click or Delete empties one, and dragging a slot onto another swaps their items.
  - Hologram text shows each line colored as in game: a line takes the color and format of the lines above it, unless a line height or margins give each line its own display. **Add line** adds one, each line moves up or goes, and the menu beside Add line removes the hologram. Its style (billboard, line height, view range) sits under Text style.

<div class="animus-demo">
<p><strong>NPC skin</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/22-npc-appearance-skin-editor.webm" aria-label="Putting a saved skin and then a built-in skin on an NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="animus-demo">
<p><strong>Equipment</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/23-npc-equipment-inventory-editor.webm" aria-label="Giving an NPC a golden helmet, a leather chestplate and three bread in the main hand" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Attributes (Advanced): the NPC's [attributes](/animus/04-npc-definitions#attributes), each named in words (Size, Speed, Gravity) with its id in the (i) tip. **Add attribute** picks one from a list that can be searched by name or id: attributes are grouped under Size and movement, Combat, Senses, Player only and Other, attributes already set are grayed out, and the ones the NPC's body type carries come first, with the rest marked as having no effect on this body. Each row shows a number field with its range and vanilla default under it, and a reset that removes it. Max health and armor are set on the Combat tab, so the list leaves them out; a value the file already has stays listed, and a row says "Not used" when a Combat setting replaces it. A value out of range is refused before it is saved. The 3D stage draws the body at its `scale`. A trait group's editor has the same tab.

<div class="animus-demo">
<p><strong>Attributes</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/24-npc-attributes-editor.webm" aria-label="Setting an NPC's scale to 2 and seeing it on the stage" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Movement: stands still, a route (points it walks between) or a [recording](/animus/19-performance-recordings), each with its contrast line. A reusable route shows read-only, with Edit route to open it and Make a copy for this NPC, which makes a new route the NPC alone uses (one Undo step). Advanced adds how it walks, riding another NPC and turning movement off while keeping the route.
- Talk and trade: the behaviors the NPC runs, picked from the workspace and, while connected, the server (server-wide behaviors are not offered, since they have no NPC), **New conversation**, and the shop a click opens (picked from the workspace shops, with **Edit shop** and **New shop**). Advanced adds its stored inventory, drawn as rows of 9 slots for its size and edited the same way; slots past the size are flagged.

- Combat: **Fights** turns [combat](/animus/08-combat) on or off (off keeps its settings), **Who it fights** picks Attackers only (it fights back and targets no one), Monsters, Players or Monsters and players, and reads Custom when the target rules are more than a preset holds; picking a preset over Custom asks first. **Can be hurt** makes the NPC [killable](/animus/08-combat#health-and-death), with **Max health** shown in hearts. Max health and armor are set here only. When combat or health hold more than Simple shows, a line counts them with **Show**. Advanced shows every setting in words, with times also in seconds and the file key in each (i) tip: Targets, Ignores and Avoids (the rare rules under More rules), Targeting, Melee with damage per held weapon, Ranged, Pursuit, Avoidance with its return point on the position grid, Guard, Squad and Greetings, then Damage (armor, regeneration, who can hurt it, attacker permission, protection range), Death (drops picked with the item picker, each with a count, an upper count and a chance, and experience) and Respawn (after death, a delay and respawn points on the position grid, or stay dead or delete the NPC). Sections open when they hold a value. **Remove combat** and **Remove health** at the end ask first. A dead NPC shows a notice with **Revive**.

<div class="animus-demo">
<p><strong>Health and death</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/25-npc-health-editor.webm" aria-label="Setting an NPC's health, armor, regeneration and respawn delay" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Modules (Advanced): every module without a tab of its own, such as hiring (its items as a row of six slots), typed from its schema or as key and value rows, with Edit as JSON; **Add module** picks one the server knows or takes a key. Integrations (Advanced) holds what needs another plugin: a disguise and the model and mob modules the server reports.

<div class="animus-demo">
<p><strong>Combat</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/26-npc-combat-locations-editor.webm" aria-label="Setting a guard's targets and a return point" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Other fields, on Modules: anything else in the file, kept as written and edited as key and value rows; the server reads it.

The route editor shows the map first: the points on a top-down grid, numbered from 1, with the list of points beside it on a wide screen and under it on a narrow one. The tool switch above the map picks what a click does: **Add points**, **Add guides** (order Random), **Move**, or **3D** to see the route over the server's blocks. Drag a point to move it. From the keyboard, Tab reaches each point: the arrow keys move it a quarter block, Shift with an arrow moves it a whole block, Enter picks it and Delete removes it. **Add at end** adds a point two blocks past the last one; type its X, Y and Z in the picked point's fields. Walking points stand on whole blocks. **Add recording step**, in the toolbar's **...** menu, adds a point that plays part of a recording; it is listed and numbered with the points but not drawn, and Make a recording step and Make a position switch a point between the two. Each terrain problem links to its point. Reusable routes under `routes/` open in the same editor and are checked against the route schema; the page says which NPCs use the route, and on a paired server the map takes the world of the first one, so it draws that NPC, its ground and the 3D view.

Simple shows the route's Order (In order, Back and forth, Random, Wander nearby), Loop and Speed. **More settings** holds the rest under plain names: Travel (walking, swimming or flying), Style, Wait, Random picks (`seed`), Start at (`startOffset`), Spread (`jitter`) and Link reach (`linkDistance`). Waits are typed in seconds and stored in ticks. A wait is one number or, with Range, a shortest and a longest (a new wait is drawn at each arrival), for the route and for each point. A picked point shows its position and wait; its **More** holds its own spread, style, speed, teleport, a weight with order Random, and Next points with order In order: each names a point and a weight, and the map draws it as a dashed line. Each field is checked with the server's rules, and the problem shows at the field. Changing the order drops the fields the new order refuses.

An NPC's route chooses how it moves: waypoints of its own, a reusable route, or a [recording](/animus/19-performance-recordings) with its playback, `once`, `loop` or `pingpong`; **recording default** leaves it to the recording.

A trait group opens in the same tabs as an NPC, editing its `values`, with Members in place of Basics: its description, its members as a list that opens each one (pick some and **Remove from group**), and **Add members**, which picks more from every other NPC in one undo step. Look carries the skin and a skin pool; Movement, Talk and trade, Combat, Attributes and Modules are the NPC's, without a position or an inventory. Values are checked the way the server checks them, and a problem names its field under `$.values`. Renaming a trait group updates every NPC that lists it.

Recordings are made in game; the editor changes everything around the frames. A recording's page shows a top-down drawing of the recorded steps with its events marked and, under it, one playback row: Play, the scrub (drag it or use the arrow keys) and the time, such as 2.1 s of 4.0 s. The preview speed (0.5x, 1x or 2x) sits in the preview's header; Play runs at the recording's speed times it and starts paused. **Events** under the preview jumps the scrub to an event. Beside the preview are the description, the tags (separated by commas), the default playback (Once, Loop or Back and forth), the speed and **Make route**. Advanced adds the facts: frames, frame gap, start point, pose changes, recorder, size and version. To trim, move the scrub and press **Start here** and **End here**; both snap to the nearest frame, the drawing shows the kept part, and **Trim** cuts the frames and events outside it in one step that Undo reverses. The kept start becomes tick 0 and the new origin, every position stays where it was, and the equipment worn at the new start is kept. Code applies a hand edit only when it passes every rule the server checks, and names the first one it breaks. Rename a recording from its page header; renaming updates the NPCs and route steps that play it.

**Movement** in the nav lists routes and recordings on two tabs. Routes ("Walks point to point.") lists every route with the NPCs that use it, and every NPC with points of its own as "Name's route", which opens that NPC. Recordings ("Replays what you did.") lists every recording with its length, world and the NPCs that play it. **New route** asks for a name and opens the new route; **New recording** gives the `/animus record start` command to run in game.

<div class="animus-demo">
<p><strong>Recordings list</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/29-recordings-list-editor.webm" aria-label="Browsing recordings and opening one" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="animus-demo">
<p><strong>Recording details</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/30-recording-details-editor.webm" aria-label="Changing a recording's description, tags and playback" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="animus-demo">
<p><strong>Recording playback</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/31-recording-playback-editor.webm" aria-label="Playing and scrubbing a recording and jumping to an event" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A skin document shows the face once its PNG is loaded, its hash, arm model and signature, the NPCs and trait groups that wear it, and the controls to load the PNG into the preview from a file or a web address that allows it. A skin's id is the hash of its text, so changing its arm model makes a new skin document: from the skin document every NPC and trait group wearing it moves to the new one and the old one is removed; from an NPC or trait group only that one moves, and the old skin stays while others wear it. Each is one Undo step. A signed skin keeps its model, since the model is part of the signed data. Deleting a skin lists who wears it first. Looking a skin up by player name is not offered. A pack's manifest edits its name, version and description, and the Java modules its behaviors use: each is required (without it the pack is unavailable) or optional, with its own configuration.

<div class="animus-demo">
<p><strong>Pack manifest</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/28-npc-packs-editor.webm" aria-label="Making a pack's Java module optional" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

### Rig and animation editor

An animation whose rig is not in the workspace opens as a form of its fields, with a note naming the missing rig. Open a rig, or an animation (which opens its rig), to get the rig editor. On a wide screen the bone tree sits left of the 3D stage, the bone inspector right of it and the timeline underneath. On a narrower screen the stage stays on top and the Bones, Inspector and Timeline tabs under it show one at a time. The bar above the stage switches between **Rig only** and **With body** (with the body the preview draws) and holds Import .bbmodel and Download server files.

- **Bones.** Add a child, rename it in the **Name** field (saved when you leave the field or press Enter; the rig's animations follow), reparent, or delete it from the **...** menu. Delete asks first and says which tracks go with the bone. With the tree focused, Up and Down move between bones, Right goes to the first child and Left to the parent.

<div class="animus-demo">
<p><strong>Bone tree</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/32-rig-tree-editor.webm" aria-label="Adding a bone and moving another under a new parent" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- **Inspector.** Pivot, rotation and the visual: an item display (item and count), a block display (block state) or a text display (text), with its offset, rotation and scale. Rarer settings sit under **More**: components and how an item is held, or a text display's billboard, background (`#AARRGGBB`), line width and shadow. **Sockets**, one row per equipment slot, hang equipment slots from a bone; the stage shows a sample item at each socket. The server reads sockets but does not attach equipment to them yet.
- **Stage.** Drag to orbit, Shift or right drag to pan, Ctrl and the wheel (or a pinch) to zoom. Click the stage and use the arrow keys to orbit, Shift and the arrows to pan, + and - to zoom and 0 to reset. A vertical swipe over the stage on a phone scrolls the page. Move, Rotate and Scale in the stage's header pick the handles, which drag along their axis; focus a handle with Tab and use the arrow keys to nudge it (Shift for smaller steps). In the rest pose a handle edits the pivot, rest rotation or visual scale. With an animation open it keys the bone at the playhead. The line under the stage says which, and its (i) lists the camera keys.

<div class="animus-demo">
<p><strong>Stage handles</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/33-rig-gizmo-editor.webm" aria-label="Rotating and moving bones with the stage handles" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- **Timeline.** Until you pick an animation the timeline asks for one. Pick one or make one with **New animation**, then play, set the speed, the loop mode and the length (in ticks, with seconds beside it). `once` plays to the end and then the NPC goes back to its `idle` animation, which the preview shows too; `hold` keeps the last pose. Each track has a lane with its keyframes: click a lane name to select the track and change its blend (`replace`, `add` or `multiply`), move it up or down, or delete it. **Add keyframe** keys the selected bone on the **Channel** you pick, **New track** starts another track, and the **...** beside them starts an add or multiply track. Drag a keyframe along its lane, or focus it and use Left and Right (Shift for quarter ticks). The selected keyframe has its tick, value and easing, Copy to the playhead, and Delete in its **...** menu. A bezier easing is written `bezier(x1,y1,x2,y2)` with numbers like `0.25`, and the x values stay between 0 and 1. Shortening the length asks before it trims the keyframes and events past the new end.

<div class="animus-demo">
<p><strong>Timeline</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/34-rig-timeline-editor.webm" aria-label="Setting an animation's speed, loop mode and duration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="animus-demo">
<p><strong>Keyframes</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/35-rig-keyframes-editor.webm" aria-label="Easing one keyframe and adding another" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- **Events.** The events lane under the tracks holds sounds and particles at a tick, with their arguments. They are saved with the animation; the server does not play them.
- **Animation names.** The section under the timeline with the names behaviors play an animation by; it opens by itself while a name needs a fix. `idle` and `walk` are the two navigation switches between on its own. Each name can be renamed, pointed at another of the rig's animations, opened or removed. A name whose animation is missing, or belongs to another rig, is marked; the server skips it. Create makes a missing animation.

<div class="animus-demo">
<p><strong>Animation names</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/36-rig-animations-editor.webm" aria-label="Adding an animation name for another animation and opening it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- **Import .bbmodel** turns a Blockbench model into a rig with its animations. Sound keyframes that name a vanilla sound become sound events. Keyframes with two values keep both. Particle and script keyframes are left out, and catmullrom and bezier curves play as `ease_in_out`; the import summary counts each. Groups named `hitbox` or `shadow` are Model Engine's hitbox and shadow, not drawn there, so the import leaves them out and warns.

<div class="animus-demo">
<p><strong>Blockbench import</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/37-bbmodel-import-editor.webm" aria-label="Importing a .bbmodel file as a rig with its animations" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- **Download server files** saves the rig, its animations and their pack sources as `<rig>-server-files.zip`. Unzip it into `plugins/Animus` on the server, then run `/animus pack build` to make the resource pack.

Every 3D view sits in the same frame: a header with the title, the switches for what it shows, **Reset view** and **Fullscreen**; the view itself, never shorter than 240 px; and one short line under it, with the details behind its (i). While the Minecraft models load the view shows a placeholder. When the site has no model pack, the download failed or the browser has no WebGL2, a notice takes the view's place, with **Retry** where it helps. What the view cannot draw, such as an image that failed or an item without a model, is counted on the line and listed behind its (i).

### GUI editors

Chest GUIs, shops, holographic menus, holograms, text animations and the presets file open in visual editors. The form sits on the left with one row of tabs and the preview on the right; on a narrower window the preview is a band above the form, and on a phone **Show preview** puts it above the form. Lists (offers, lines, components, keys, stages) reorder by dragging a row's handle or with **Move up** and **Move down** in the row's **...** menu, which also duplicates and deletes. The editors offer only what Animus reads, and flag anything the server would refuse at the exact field.

- **Chest GUI**: the window is drawn as the game draws it, and it is the editor. Click a slot, or Tab to it and press Enter, to edit it in the **Slot** tab: its key letter, **Make own slot**, and what it shows and does. Pick a key under **Paint** and drag across slots to paint the mask; the letters are explained under the window. The **Window** tab holds the title, size, mask, **Show when** and closing on teleport, then **Keys**, **List**, **Variants**, **Named actions** and **Refresh** as sections.

<div class="animus-demo">
<p><strong>Chest GUI</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/38-chest-gui-editor.webm" aria-label="Turning a slot into a button that sends a message" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- **Shop**: the **Offers** tab lists offers as rows that read as what the player gets for what it costs, such as "1 enchanted book for 2 emerald + 1 book", grouped by grid and page in the order players see them. **Add offer** adds the shop's usual kind; the **...** beside it adds a trade, buy, sell, command offer or decoration. Click a row to edit it in place: the items with their counts, the price, commands, and under **Name and lore** the display. Advanced adds enchantments and model number, stock, limits and permission. Reorder a row within its group by its handle or its **...** menu; in Advanced, tick rows to delete several. **Undo** brings deleted offers back. Changing an offer's kind removes the fields the new kind cannot use and moves it to that kind's grid.
  The preview shows the window players get and follows every edit; clicking an offer in it opens the offer. In Advanced, switch between the **Trading screen** and the **Chest window**, and **Sold out** and **No permission** show offers crossed out as such a player sees them. A shop with a `layout` chest GUI is drawn in that GUI, page by page.
  The **Settings** tab sets the title (shown in colour under the field) and **Opened by**, the NPCs whose shop module opens the shop; **Add NPC** attaches it to another NPC in one undo step, asking first when that NPC opens another shop. Advanced adds the window style, layout GUI, permission, modes in order, purchase switches, item matching, pages, and the owner and up to eight containers, and each NPC's window settings (for a villager, the profession and level its trading screen title shows). A shop with containers sells through trades only, so its offers are trades or decorations, with no price and no stock of their own.
  Problems show at the offer: anything the server refuses, notes for what the chosen window style cannot show exactly, items not picked, counts of zero, and limits that work against each other. **New shop** starts blank or from villager trades, a money shop or a command shop.
- **Hologram**: the **Lines** tab lists its lines, with blocks and entities picked by name (**Add line** adds text or an item; Advanced adds heads, blocks and entities), each with **Show when** and **Scale** under **Details** in its **...** menu. The **Where** tab places it: a world and position, or **Above NPC** to move it over an NPC; **More** holds turn, tilt, how far it is seen and **Show when**. Advanced adds the **Style** and **Clicks** tabs, pages, variants and refresh; a Simple page counts those when they are set, with **Show**. The stage draws the text rows as one text display, as the server sends them: color codes and MiniMessage tags read the way the server reads them, a color or format carrying on to the rows below until the next color code or `&r`, and the style's background, shadow, alignment, opacity, line width, scale and fixed light. The sample under each text line draws it the same way. A billboard other than `center`, `seeThrough` off, `glowColor` and `shadowRadius` are listed under the stage, which draws text facing the camera and over blocks. Heads are drawn without a skin and entities as a labelled box; the server shows the real thing.

<div class="animus-demo">
<p><strong>Hologram</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/39-hologram-animation-editor.webm" aria-label="Adding a hologram line that plays a text animation" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- **Menu**: click a component on the stage or in the **Components** list to edit it. **Add component** lists each kind with what it does. Components have a name, a place, what they show and do, a hover and click box, a tooltip, icon styles and list or tab layout, and under **More** when they show and how they move in. The **Menu** tab holds where it opens, what closes it, constants and named action lists.

<div class="animus-demo">
<p><strong>Menu</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/40-menu-editor.webm" aria-label="Moving a menu component and giving it a hover effect and a sound" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- **Text animation**: edit the frames (each shown in colour under its field), the **Order** they play in and how long **Each frame** shows, beside a preview that plays them the way the server does. **Pause** and the frame buttons in the preview's header hold or step it. If your system asks for reduced motion, the preview starts paused.
- **Presets**: per-kind defaults and named presets for Gloss documents. Animus refuses a chest GUI, hologram or text animation that names a preset. Its page offers **Copy fields in**, which copies the kind's defaults and the preset chain under the document's own fields and removes `preset`.

<div class="animus-demo">
<p><strong>GUI presets</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/41-gui-presets-style-editor.webm" aria-label="Copying a preset's fields into a text animation" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

**Import Gloss bundle** and **Export Gloss bundle** read and write Gloss Web workspace files. An exported bundle imports back to the same ids. Gloss folders, titles that are not Animus ids, and images are not kept, and the import lists each one.

### Quests

A [quest](/animus/38-quests) opens with its form on the left and its preview on the right (above the form on narrower screens, behind **Show preview** on phones). **New quest** on the Quests list (Advanced) asks for a title and, optionally, the NPC that offers it; the quest starts with one stage that collects wheat and an experience reward.

The form has three tabs:

- **Quest**: the title (color codes and MiniMessage), the description players read in the offer and the journal, the journal icon and the givers, picked by name from the workspace NPCs. Advanced adds the turn in NPC, the required permission, quests finished first and a behavior condition, how often it repeats (once, after a cooldown, daily), and, under **Messages**, the offer, accepted, declined and completed lines.
- **Stages**: each stage is a row that opens to its journal text and its objectives; each objective is a row that opens to the fields its type takes. **Add objective** picks talk, bring, kill, reach, collect or custom, each with a line on what it counts. Changing an objective's type keeps its id, journal text and every field the new type also takes. Drag a row by its handle, or use its **...** menu to move it up or down, duplicate or delete it. Advanced adds whether a stage's objectives count at once or one after another, and the ids of objectives that are not custom.
- **Rewards**: items with amounts, money and experience; commands (console or player) under **More**; in Advanced, behavior flags with a value and scope.

In Simple, a tab whose Advanced fields are set says how many with **Show**, which shows them on this page without switching the mode. Nothing Simple hides is lost.

Problems show at the field and their count marks the tab: anything the schema or the server refuses, objective ids repeated within a stage, NPCs and quests the workspace does not have, unknown items, and a note that reward commands need the command allow-list. Advanced also notes that rewards with items, money, experience or commands need the `apply:commands` scope to apply.

The preview shows the giver's offer with its Accept and Decline buttons, and the `/quests` journal entry with progress counts at zero; the menu in its header picks the stage, or Finished. In Advanced, the (i) under it gives the expression behaviors use to read the stage, such as `quest('player', 'bread')`.

### Conversations

<div class="animus-demo">
<p><strong>Conversation by keyboard</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/05-conversation-editor.webm" aria-label="Writing a conversation with the keyboard, testing it and attaching it to an NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A behavior shaped like a conversation opens as its conversation; in Advanced, **Conversation** sits beside Steps, Code and Split. **New behavior** on the Behaviors page, with the Conversation card, starts one: a greeting and a question with two answers.

The conversation is a tree. The Start block runs first, and what each answer leads to sits under that answer. A step is one of:

- **Say**: a line the NPC says, with color codes and MiniMessage tags. **Line settings** in its menu adds a delay, a sound and an animation.
- **Ask**: a question with 1 to 8 answers. Each answer has its text, and **Answer settings** in its menu gives a color, hover text, style and the block it leads to.
- **If**: a flag, quest stage, permission, item held, relationship flag or expression, with a Yes and a No list.
- **Do**: an action, such as set flag, give or take an item, run a command, open a shop, play an animation, teleport or start a quest, with the fields the server's capability list gives it.
- **Go to**: continue at another block, for a loop back.
- **End**: stop here.

**Add step** at the end of each list adds any of these, and each step's **...** menu moves, duplicates or deletes it. The conversation is made for the keyboard too:

| Keys | Does |
| --- | --- |
| Enter in a line | Adds the next line |
| Enter in a line ending in `[Yes] [No]` | Turns it into a question with those answers |
| `/ask`, `/if`, `/do`, `/goto` or `/end`, then Enter, in an empty line | Turns it into that step |
| Enter in an answer | Adds the next answer |
| Ctrl+Enter in an answer | Adds what follows it, or jumps there |
| Backspace in an empty line or answer | Removes it |
| Alt+Up, Alt+Down | Moves the step or answer |
| Ctrl+D | Duplicates the step or answer, with copies of what follows it |
| Up, Down | Moves between fields |

Rows can also be dragged by their handle within the same list. In Advanced, a line's menu inserts `{player_name}` or `{npc.name}`; the editor writes `{npc.name}` as a template hole, and in a question it does the same for the player's name.

The conversation is written as an ordinary behavior. Each block is a routine, a question is `animus:choices`, and each answer that leads somewhere gets a `dialogue_choice` trigger. Ids are made once from the text and then kept, so editing an answer's text later does not rename its routine or trigger. A start other than Command is the behavior's one start trigger: Right-click, Left-click, the drop key (Q) and Swap hands (F), each alone or while sneaking, are an `interaction` trigger with that [action](/animus/07-behaviors#interaction-actions); Sneak + right-click also claims the click, so a shop on the NPC opens only without sneaking. Walk near is a `proximity` trigger with its radius. A conversation saved with the older Sneak + right-click routine opens as Sneak + right-click and is saved with the `sneak_interact` action. Command adds no trigger; run it with `/animus behaviors run <npc> <behavior>`. A hand-written behavior that uses only these pieces opens the same way. Anything else, such as a loop node, a timer trigger or a binding, stays in Steps, and the Conversation view says which part does not fit.

Problems show under their step: blocks nothing leads to, answers that lead to a missing block, more than 8 answers, text over the server's limits (1,024 characters for a line, 512 for a question, 128 for an answer), and flags or quests no behavior of the namespace sets.

**Test** beside the conversation plays it in the browser: click an answer to follow it, and flip the switch on a condition to take its other branch. **NPCs** lists the NPCs that run it. Pick another from its searchable list, which holds every NPC of the workspace or server (trait groups too in Advanced), or remove one; each pick or removal updates that NPC's `behaviors` list at once, and Undo reverts it.

### Keyboard and commands

<div class="animus-demo">
<p><strong>Shortcut sheet</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/10-shortcuts-sidebar-editor.webm" aria-label="Opening the shortcut sheet and jumping with single keys" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Shortcuts work anywhere outside a text box:

| Keys | Does |
| --- | --- |
| Ctrl+K (Cmd+K on a Mac) or `/` | Search |
| `?` | Show every shortcut, page-wide and local |
| Ctrl+Z (Cmd+Z) | Undo |
| Ctrl+Shift+Z or Ctrl+Y (Cmd+Shift+Z or Cmd+Y) | Redo |
| Ctrl+S (Cmd+S) | Save; in a live server workspace, Apply |
| N | New document |
| B | Open the NPC list |
| Escape | Close Search, the shortcut sheet, a menu, a dialog or the nav drawer |

The shortcut sheet (`?`, or **Keyboard shortcuts** in the command palette) lists these and the keys that work in one place: search, lists and dropdowns, tabs, sections and trees, the conversation editor, behavior steps, route points, offers and keyframes, and the 3D preview. Its labels follow your computer, Cmd on a Mac and Ctrl elsewhere, as do the hints in the top bar and the palette. Escape or **Close** shuts it and puts you back where you were.

Edits never overwrite each other, however quickly they follow one another: each field you change is kept and is its own undo step, and typing in one field is one step. Undo and Redo keep 50 steps each per workspace, also after a reload, and their notices say what they reverted, such as "Undid: rename town:baker". Search, the command palette (**Search** in the top bar), opens a document by name or id, switches workspace, makes a new document, exports, undoes, redoes and changes the theme: type part of a name, move with the arrow keys and press Enter. In a list the arrow keys move between rows; Left and Right move between tabs, and close or open a section from its header. In an open list, the arrow keys, Home and End move, typing jumps to a match, Enter picks and Escape closes without a change.

<div class="animus-demo">
<p><strong>Search</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/42-command-palette-editor.webm" aria-label="Opening a document and changing the theme from Search" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

### Field notes

A label or heading with a dotted underline holds a short note on what it is, with a **Docs** link to the matching section of this wiki. Every inspector part and subhead, every GUI editor section, and the headings of the NPC browser, folders, server, pairing, home and rig screens have one. Hover the text or reach it with Tab to read the note, press Escape to hide it, and press Enter to open the wiki. On a touch screen a tap shows the note, and a second tap or a tap elsewhere hides it.

### Completion

<div class="animus-demo">
<p><strong>Autocomplete</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/08-autocomplete-editor.webm" aria-label="Completing a placeholder and a colour tag, then picking an item by name" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Text, expression and id fields complete as you type, and so does the Code view. Ctrl+Space opens the list anywhere, on a Mac too. Arrow keys move, Enter or Tab picks, Escape closes. Each row shows its kind, its type and a short note. Matching is loose: `dsw` finds `diamond_sword`. In Simple, item and block fields list them by name, and each typed word narrows the list.

| You type | You get |
| --- | --- |
| A name in an expression or inside `{{ }}` | Declared variables with type and scope, `player.`, `npc.`, `server.` and `context.` facts, and functions |
| `{` | Placeholders the field fills, such as `{player_name}` in say text, or a whole `{{ viewer.name }}` hole in GUI text |
| `<` | The tags the server formats: the sixteen colors with a swatch, `#RRGGBB`, `color:`, the decorations and `reset`. `</` closes the open tags |
| `%` | PlaceholderAPI identifiers, when the paired server has PlaceholderAPI. The server fills them for each player who sees the text; see [`[placeholders]`](/animus/03-configuration#placeholders) |
| An id | Items, blocks, sounds, particles, entity types, effects and worlds; routes, recordings, animations, skins, shops and GUIs in the workspace; flag and quest names the workspace already uses |
| The first word of a command | The paired server's commands |

Offline, game ids come from the bundled Minecraft 26.3 lists. Paired, they come from the server, modded entries included. A name the server would refuse is underlined: an unknown variable or function, a placeholder the field does not fill, a tag shown as text, or an id missing from a complete list. Hover the underline to read why.

### On a phone

At phone widths the document list becomes a drawer behind **Documents** in the top bar, and the other top bar controls (undo, redo, commands, open, import, export, theme) sit under **More**. Picking a document closes the drawer. Lists open as a sheet along the bottom of the screen, and **Review** fills the screen. The NPC list keeps its filters, folders and tags behind **Filters**, so the list comes first.

### More than one tab

Tabs of the same browser stay in step. A tab that is not being edited reloads a workspace another tab saved; if both tabs edit at once, the tab that saved second reloads and says "Another tab changed this workspace, so this tab reloaded it. Your last edit here was not kept." A workspace deleted in one tab closes in the others. On a server workspace only one tab at a time talks to the server; another tab with it open says "Open in another tab." with **Take over**, and takes over by itself when the first one closes.

### Sending a workspace to a server

**Send to server** sends a local workspace to a paired server. In Advanced it is in the nav and on the save bar; Import's result offers it too. It picks the server by itself when there is one (a dropdown when there are several) and shows its state with **Connect** or **Pair again**. Once the server is online the page compares by itself: one list of the workspace's documents with **New**, **Changed**, **Same** and **Has problems** filters and a summary line such as "3 new, 2 changed, 40 same." For each changed document pick **Keep server** or **Use mine**. **Apply n** is the last button in the page header, beside **Validate** in Advanced. It checks with the server first, asks before it replaces documents the server holds differently ("Replace n documents on the server?"), and sends the rest as one change set. The apply is recorded in the browser before it is sent. If its answer does not arrive, the page says "An earlier apply has no answer yet." with **Check again**, which asks the server what became of it rather than sending it again.

Advanced adds a Send / Pull switch, a Send checkbox per document, **Validate** and a **Change note**. Pull lists the server's documents, with **Not here** and **Also here** filters: pick some, choose **Keep mine** or **Take server** under **When different**, and **Pull** copies them in as one undo step.

<div class="animus-demo">
<p><strong>Compare a data folder</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/15-data-folder-sync-editor.webm" aria-label="Opening a data folder as a workspace and comparing it with a server" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="animus-demo">
<p><strong>Replace on apply</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/45-live-confirm-editor.webm" aria-label="Confirming an apply that replaces an NPC on the server" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

## Pairing

<div class="animus-demo">
<p><strong>Pair with a server</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/01-pair-server-editor.webm" aria-label="Pasting a pairing link and pairing the editor with a server" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Pairing gives one browser a token for one server. Run on the server, in game or from the console:

```none
/animus editor pair [label=] [scopes=a,b] [folders=a,b] [expires=7d]
```

In game the reply is one line, "Link ready. Open it within 10 minutes", with **[Open editor]**, which opens the link, **[Copy]**, which copies it, and **[Revoke]**, which puts the revoke command in your chat box; revoking before the link is opened cancels it. The console prints the link itself and a second line with the scopes, folders, lifetime and token id. Open the link within 10 minutes; it works once. If a browser cannot use it (its address is not in `allowedOrigins`, the link expired, or the relay is the only way in and cannot be reached), the player who made the link gets a chat line saying so and the console logs it once. The link opens one card with the server's name (`serverName` in `config.toml`, else the server's MOTD, else its folder name), "Link works until HH:MM, once." and what the editor may do there, such as "Edit NPCs, behaviors, shops and GUIs", "Spawn and despawn NPCs", "Preview changes in game" and "Import from other plugins". **Browser name** is how `/animus editor tokens` lists this browser. **Stay paired** is on by default: every tab of this browser stays paired until the pairing expires or you **Forget server**. Turn it off on a shared computer; the pairing then ends with the tab. **Pair** exchanges the link for a token, and **Cancel** leaves without pairing. In Advanced, **Details** shows the fingerprint (check it matches `/animus editor status`), the direct and relay addresses and the link name. The editor removes the link's code from the address bar once it has read it. A pairing lasts as long as it is used: it ends after `tokenDays` (7 days) without use, or the `expires=` time without use. A link can also be pasted into **Pairing link** on the start page, or into the dialog that **Pair a server** in its **Start** row opens; the **Web editor** button in the Animus menu sends one the same way.

When pairing fails, the card says what happened in one sentence and the next step:

- The link was already used, expired or is not a pairing link: run `/animus editor pair` again and paste the new link into **New link**.
- The server does not accept the editor's address: add the page's origin to `allowedOrigins` under `[editor]` in `config.toml`, then press **Pair** again.
- The server did not answer: check that it is running, then press **Pair** again.
- The browser blocked the connection to your server, as it can when an `https` page reaches a local or LAN address: allow local network access for the site in the browser's site settings, then press **Pair** again.
- A different server answered, or the server is busy (wait a few seconds).

When the pairing is three days or less from its end, **Review** says "Pairing ends in n days unless used." When the server revokes or expires the token, the save bar says "Pairing ended." and Review shows "Pairing ended" with a **New link** field and **Pair**.

| Option | Default | Meaning |
|---|---|---|
| `label=` | None | A name shown in `/animus editor tokens` |
| `scopes=` | Every scope except `apply:commands`: `read,validate,preview,apply:npcs,apply:behaviors,apply:gui,apply:rigs,import,spawn,terrain` | What the token may do; list fewer to narrow it |
| `folders=` | All folders | Limit the token to NPCs in these folders under `npcs/`, such as `folders=town,harbor` |
| `expires=` | `tokenDays` from `config.toml` (7 days) | How long the pairing lasts without use, as a number with `d`, `h` or `m`, such as `12h`. Each use starts it again |

| Scope | Allows |
|---|---|
| `read` | Reading documents, schemas, diagnostics, skins, completion lists and live events |
| `validate` | Checking drafts with the server's validators. Writes nothing |
| `preview` | Showing drafts to the token's player. A token paired from the console cannot preview |
| `apply:npcs` | Applying NPCs, routes, recordings, skins and trait groups |
| `apply:behaviors` | Applying behaviors, packs and `server-behaviors.json` |
| `apply:gui` | Applying shops, chest GUIs, menus, holograms, text animations and GUI presets; shops that trade and GUIs that give items or money also need `apply:commands` |
| `apply:rigs` | Applying rigs and animations |
| `apply:commands` | Changing documents that run console commands. Never a default; see [console commands](#console-commands) |
| `import` | Uploading saves for a staged import and applying it |
| `spawn` | Spawning and despawning NPCs |
| `terrain` | Reading loaded terrain where the NPCs the token can see stand and walk, for the stage and the route editor |

Terrain reads (`GET /v1/terrain/surface` for 64 by 64 block tiles, `GET /v1/terrain/blocks` for up to 64 layers of one chunk) cover only chunks within `terrainRadius` of where an NPC in a folder the token can reach stands or goes: its position, every point of its `animus:navigation` route (inline or a reusable route) and the straight legs it walks between them, its `animus:schedule` places and the legs between them in time order, its anchors, and, while it is spawned, where it stands now. A route point that teleports carries the route on in the target world. Farther chunks come back `forbidden`. `GET /v1/terrain/position?npc=<id>` answers where a spawned NPC stands now, read from the server at most once a second. The server reads chunks it already has loaded and never loads one: others come back `unloaded`, which means no player is near them. A world the server has not loaded answers `world-unloaded`. Answers carry no block entities, signs or containers, and each one fits a relay frame. Leave `terrain` out of `scopes=` to keep the world out of the editor.

Importing from the editor needs the `import` scope, which a pairing has unless `scopes=` leaves it out.

### Console commands

A behavior that uses `animus:command` or another privileged capability, and a shop, chest GUI, menu or hologram that runs a command, can run console commands once it is on the [command allow-list](/animus/07-behaviors#commands). Editing one is as good as console access. Documents that create items or money are close to it, so the editor treats them the same way. It needs the `apply:commands` scope for:

- a behavior that uses `animus:command`, another privileged capability or `animus:give-item`;
- any behavior in the namespace of a `rawTextBehaviors` entry, since it shares flags with that behavior;
- a chest GUI, menu or hologram with a `command`, `give` or `economy` action;
- a shop with `commands` or any buy, sell, trade or command entry, since its prices and goods create items and money;
- a quest whose rewards include items, money, experience or commands, and any quest in the namespace of a `rawTextBehaviors` entry, since its reward flags and stages reach that behavior;
- an NPC or trait group whose [schedule](/animus/30-npc-schedules) has arrival commands.

The rules:

- Applying such a document, new or changed, needs `apply:commands` as well as the kind's own apply scope. This holds for any edit to such a document, even one that leaves its commands as they were, because the text and variables around a command decide what it runs. Deleting one does not need it.
- Undo needs `apply:commands` when it would write back a document that runs commands.
- Import apply needs `apply:commands` when the import's commands need a namespace the allow-list does not name yet, since apply adds it, and whenever the allow-list names anything, since an imported document could land under it. Rollback never needs it.
- Only the console, or a player with `animus.editor.commands`, may pair `apply:commands`. No default pairing has it: `/animus editor pair scopes=read,validate,preview,apply:behaviors,apply:gui,apply:commands`.
- A player who loses `animus.editor.commands` loses `apply:commands` from their tokens at the next check (every 60 seconds); the rest of each token keeps working. `/animus import citizens apply` in game needs the same permission when it adds a namespace.

Without the scope the apply is refused with `scope-missing` and nothing is written. Values a behavior or GUI fills into a command at run time are limited to a safe set of characters; see [text in commands](/animus/07-behaviors#text-in-commands).

### Managing tokens

| Command | Effect |
|---|---|
| `/animus editor status` | State, listener port, relay and token count; **[Details]** adds the listener address, open connections, streams, previews and the fingerprint |
| `/animus editor tokens [page=1]` | Each token's id, label, scopes, folders, expiry, last use, the browser it paired from and its open streams (`streams N`) |
| `/animus editor revoke <token>` | Revoke a token, or `all`. Their connections, relayed streams and previews close at once, and requests still waiting to run are refused without reading or writing anything. A link not opened yet is cancelled the same way |

All of these need `animus.editor.pair`, which `animus.admin` grants. A token issued by a player is also revoked when that player loses `animus.editor.pair`, checked every 60 seconds. The check also covers an offline player. On Paper, Spigot and Folia it reads the operator list, the node's default, Vault's permission plugin, and LuckPerms directly when Vault is missing. On mod servers it reads the operator list: an operator below level 2 does not hold the node, and a removed operator is revoked. When the server cannot tell, such as for an offline player whose permission plugin it cannot ask, or on a mod server with a permission mod, the token keeps working for at most 7 days after the last confirmation, then it is revoked and the player pairs again. The same rules apply to `animus.editor.commands` for `apply:commands`. The browser asks for a new pairing when its token expires or is revoked.

**Forget server**, in a server's **...** menu on the start page (and on its Home in Advanced), asks before it removes the server from this browser: its token and its live workspace, with any changes not applied, leave the browser. The server keeps everything already applied.

## Connecting the server

The editor reaches a server in one of two ways. Both are on by default, and a pairing link carries every path that is enabled. The editor tries the last path that worked first and switches to the other when one drops.

**Relay.** The server opens an outbound connection to a relay, so it works behind NAT and on hosts that allow no inbound ports. By default it uses the Volmit relay. The connection opens at the first `/animus editor pair`, not before, so a server where nobody pairs makes no outbound connection; after that it opens at every start while a token or pairing exists, and `/animus editor status` shows `relay waits for the first pairing` until then. Before the editor sends a token or pairing secret over the relay, the server signs a random challenge from the browser with its key, and the editor checks the key against the fingerprint it paired with. A relay therefore cannot pose as your server while the server is not connected to it. The relay operator can still read the requests and documents it forwards; set `relayUrl` to a relay you run yourself, or turn the relay off with `relayEnabled = false`. A relay you run yourself that browsers reach directly needs `TRUSTED_PROXY_HOPS=0`, or clients can choose the address it reports; see the relay's README. Over the relay, uploads larger than about 756 KiB are refused; use the direct path for large imports.

**Direct listener.** The server listens on `127.0.0.1:9797`. A browser accepts a plain `http://` address only for `127.0.0.1` or `localhost`, so a direct connection from another machine needs HTTPS:

- Put a TLS proxy in front of the loopback listener and set `advertisedUrl` to its public `https://` address, or
- Set `tlsCertificate` and `tlsPrivateKey` to PEM files and set `listenAddress` to the address to bind.

Animus refuses a non-loopback `listenAddress` without TLS. When the port is taken, for example by a second server on the same machine, the log says `Editor listener failed: cannot bind 127.0.0.1:9797 (Address already in use); set [editor] port to a free port or listenerEnabled = false`, the banner says `DEGRADED (editor listener)`, and the relay keeps working. `allowedOrigins` must include `https://animus.volmitsoftware.com`, as it does by default.

The listener checks the token and scope from the request head before it reads a body, so only a paired browser can send a large one; pairing and the other open endpoints take at most 4 KiB. A request head must arrive within 5 seconds of its first byte, and a body without a token within 5 seconds of the head. An idle connection closes after 15 seconds, and one address may hold at most 16 of the `openConnections`; an IPv6 address counts by its /64.

```toml
[editor]
listenerEnabled = true
listenAddress = "127.0.0.1"
port = 9797
advertisedUrl = "https://animus.example.com"
relayEnabled = false
```

Every `[editor]` key applies when `config.toml` is saved, and paired browsers stay paired. See [configuration](/animus/03-configuration#editor) for every key, its default and range.

## Editing a live server

After **Pair** the editor opens the server's [Home](#working-without-a-server), with the whole server listed at once by name. Documents load in the background when they are needed, and the save bar shows "Loading n of m" meanwhile. A document keeps the revision and hash it came from. In Advanced, the server's Home adds a **Server** section: its state, version, direct and relay addresses, fingerprint, when the pairing ends, what the pairing allows (in words, with the permission ids) and the server's features, with **Sync** (reads the server's list again), **Connect** or **Disconnect**, **Retry now** while reconnecting, and a **...** menu with **Import on the server** and **Forget server**.

The save bar at the bottom of every page is the one place to apply. Its line gives the state, such as "3 changes not applied", "Applying...", "Applied 3 changes", "Up to date", "Server offline. Changes are kept.", "Pairing ended." or "Open in another tab.", beside **Apply** and **Review**. It also shows **Take over** in a second tab, **Reconnect** while offline, and **Undo** right after an apply.

**Review**, from the save bar, opens a side sheet, full screen on a phone:

- **Changes (n)**: each changed document with what changed in a few words, such as "Changed name and skin", "New", "Deleted" or "Moved from ...". Its **...** menu has **Discard changes**, which asks first; Undo brings them back.
- **Fix before Apply**: documents with problems, each with **Fix**.
- **Changed on the server**: documents changed here and on the server since, each with **Compare**, **Take server** and **Keep mine**. See [applying changes](#applying-changes).
- **Apply n** at the bottom. A refused apply keeps your change note for the retry.

While reconnecting, Review shows **Retry now**; when not connected, **Connect**. Advanced adds:

- The connection badge, Online (direct) or Online (relay).
- **Validate**: run the server's validators on the changes. This writes nothing.
- **Preview in game**, **Update preview** and **End preview**, with a line saying who sees the preview, until when, and which live NPCs it hides. See [previews](#previews).
- A **Change note**, an **Applied** list where each apply has **Undo** (it asks "Undo this apply on the server?"), and **Activity** with the last notices.

<div class="animus-demo">
<p><strong>Connection</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/44-live-bar-editor.webm" aria-label="The connection going down, reconnecting and coming back online" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Every message about a refused request says what happened and what to do next, such as pairing again with a missing scope.

Live editing for one server runs in one tab at a time. A second tab on the same server says "Open in another tab." and waits, with **Take over** to take it at once; when the first tab closes or moves to another workspace, the second takes over by itself.

### Terrain

With a token that has the `terrain` scope, the editor draws the server's world around your NPCs and along everywhere they walk.

- **Preview stage**: the blocks around the NPC and along its route replace the grass patch, with the pack's own models, including slabs, stairs, fences, glass, leaves and water. In the stage's header **Terrain** turns them off, and its **...** menu picks a radius of 8, 16 or 24 blocks on each side of the NPC, its points and the legs between them, 32 blocks tall around the route's height at each spot; in a narrow column or on a phone these sit in one **Show** menu. Drag the view along the route to see it. One view loads at most 256 chunks; past that, every point still loads and the legs load from their start.
- **Other NPCs**: with **Nearby** on, the other spawned NPCs of the same world within the radius stand around the one you edit, read from the server's list rather than opened one by one. The 60 nearest are drawn, the line under the stage counts them ("Showing 60 of 212 nearby"), and clicking one shows its name with **Open**.

<div class="animus-demo">
<p><strong>Terrain stage</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/46-terrain-stage-editor.webm" aria-label="Server blocks drawn around an NPC and its route" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- **Live position**: while the NPC is spawned, the stage shows it where it stands on the server now and loads the blocks around each new spot as it walks. It checks every second and a half while the stage is on screen and the tab is in front, and every five seconds once the NPC has stood still for a minute.
- **Route grid**: the ground under the grid is drawn top down from above, lighter where it rises and darker where it falls, water darker with depth. A grid wider than 64 tiles of 64 blocks draws the ground within 24 blocks of the route instead of all of it. Chunks the server has not loaded show grey, and chunks outside `terrainRadius` show hatched.
- **Placing points**: a point you click onto the grid, or drag, lands on the block an NPC can stand on there. Points inside a block, below the surface, more than 3 blocks above the ground or in water are flagged on the grid and listed under it, and so are legs that climb more than a block or drop more than 3 in a straight line.
- **3D**: shows the whole route over its blocks and frames the picked point. Legs are straight lines; the server plans the real path.

<div class="animus-demo">
<p><strong>Route in 3D</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/47-route-3d-editor.webm" aria-label="Viewing a route in 3D over the terrain and framing one point" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The editor asks only for the ground it draws, keeps every answer in the browser, and asks again with the answer's hash, so unchanged terrain is not sent twice. Without a paired server, the stage keeps its grass patch and the grid stays blank. When the server is paired but cannot send terrain, the line under the stage says why: **Terrain needs a new pairing** (pairings made before terrain existed; run `/animus editor pair` again), **Server shares no terrain** (switched off, or too old), **Server offline**, **This world is not loaded on the server.**, or **Stand near this NPC in game to load its terrain.** when the chunks are unloaded because no player is near them.

### Applying changes

<div class="animus-demo">
<p><strong>Apply and undo</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/09-apply-undo-editor.webm" aria-label="Renaming an NPC, applying it and undoing the apply" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Apply checks with the server first and sends nothing while something in Review needs a decision. It then checks every document again and writes them all in one transaction, or none of them. It sends every edit made before you pressed it. An edit made while the apply is on its way stays a change for the next apply. If another edit changed a document on the server since you opened it, nothing is written and Review lists it under **Changed on the server**. **Compare** opens a merge: fields that only one side changed merge by themselves, and for each field both changed you pick Mine or Server, then **Use merge** (or **Take server**, or **Cancel**). **Keep mine** keeps your changes and takes the server's everywhere else. Then apply again.

Moving NPCs to another folder, or renaming or moving a folder, changes their ids. On a server workspace the next apply sends each moved NPC as a move: the server writes the new file and removes the old one in the same transaction, and the NPC keeps its revision history. Review lists each moved NPC as "Moved from" its old id. If the NPC changed on the server since you opened it, or another NPC already has the new id, nothing is written and the editor shows the conflict. Undoing the apply moves the NPCs back.

The editor stores each change set in the workspace before it sends it, and sends nothing if it cannot store that record. An applied change set takes effect as any saved file does. Each one gets a rollback receipt, so **Undo** (on the save bar right after the apply, or in Review's **Applied** list in Advanced) and `/animus rollback <transaction-id>` both undo it. Both Undo buttons ask first. An undo that would overwrite a later edit is refused and changes nothing. If the connection drops during an apply, the editor asks the server on reconnect whether the change set went through, instead of sending it twice. When the server cannot say, Review offers **Check again** and **Stop waiting**.

Two editors, or an editor and an in-game command, never overwrite each other's work. Every document has a revision, and a write made from an older revision is refused: the editor shows the conflict and its merge, and a command answers with a conflict and leaves the file as it is.

The server tells a paired editor about every document that changes, whatever changed it: the editor, a command such as `animus edit`, the Animus menu, an import, a hotload or `/animus reload`. Changes Animus makes arrive within a quarter second; a file edited on disk arrives within about two seconds, whether or not hotload has loaded it yet.

After any reconnect the editor asks about unanswered change sets and reads the server's list again, then one notice says what it found, such as "Resynced with the server: 1 document refreshed." Clean copies take the server's version; a document you changed that also changed on the server goes under **Changed on the server** in Review. A browser that stops reading server events, for example on a stalled network, is disconnected once about 1 MiB of events waits for it, without slowing the server or other editors. It reconnects and resyncs the same way.

Documents changed on the server while you edit refresh in the editor. One you have edited goes under **Changed on the server** in Review, and Home lists it under **Needs attention**.

**Take server** asks before it replaces your changes, or before it removes your copy when the server deleted the document. Undo brings them back.

### Previews

A preview shows your drafts to the in-game player who issued the token, and to no one else. It needs that player online, so a token paired from the console cannot preview: the editor answers `This token was paired from the console; previews show to the pairing player.`

- Previewed NPCs are packet-only and never saved. A draft of an existing NPC replaces the live one for you only; a new NPC appears only for you. Everyone else keeps seeing the live version.
- Preview NPCs stand still at their definition position with their appearance, equipment and skin. They run no behaviors or triggers, take and deal no damage, and do nothing when clicked.
- While a preview replaces a live NPC, you fire none of that NPC's triggers and receive none of its speech, sounds or particles.
- Commands, combat control, item and money changes and trades are refused in previews.
- You have one preview at a time. It ends after `previewMinutes` (15 by default), when you end it, when your editor disconnects, or when you leave the server. Leaving the document's workspace ends a preview it started. If your player is not on the server, the preview is refused and the editor says to join first.

### Importing

**Import**, on the start page or in the Advanced nav, is one wizard with four steps: Source, Files, Review and Result. The sources are Citizens (`saves.yml`), Shopkeepers (`save.yml`), dtlTraders (your server converts them), Denizen (scripts as behaviors) and Already on my server (your server converts the saves it has). Citizens, Shopkeepers and Denizen convert in the browser; dtlTraders and Already on my server need a paired server whose pairing may import, and run the same conversion as `/animus import citizens preview`. **Next** and **Back** move between the steps, and **Convert** runs the conversion; when it cannot run yet, a line under it says why. The review says in plain words what the import makes, and warnings name each NPC by its Citizens id and name. A browser conversion ends with **Open as workspace** (the converted files as a new workspace to review), **Send to server** and **Add a source**. A server import ends with **Install**, which asks first and installs the import with every NPC spawned as Citizens had it and everything that converted turned on; the confirm names the command namespaces it adds. **Roll back** (it asks first) undoes the import, and **Open server** leads to the server. Advanced shows the full warnings, the **On collision** choice and **Copy label** for server imports, and downloads of the data-folder bundles. Uploads are limited to 16 MiB. dtlTraders files with names dtlTraders does not use are listed as skipped. See [migrating from Citizens](/animus/13-migrating-from-citizens).

<div class="animus-demo">
<p><strong>Server import</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/49-server-import-editor.webm" aria-label="Uploading, reviewing and installing an import on a server" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

### In-game notices

<div class="animus-demo">
<p><strong>Editor link and undo</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/30-editor-pair-undo-ingame.webm" aria-label="Getting a pairing link from Home and undoing a rename from chat" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

When the editor changes the server, online players with `animus.editor.notify` (operators by default) hear a short sound and see one chat line saying who changed what, such as:

```
[Animus]: Brian's editor applied 3 NPCs, 1 behavior (tx 1a2b3c4d)
```

The player who paired the token gets the notices for that token even without the permission. Notices cover an apply, an undone apply, an import being applied or rolled back, spawning and despawning from the editor, a completed pairing, a revoked token, and a refused apply, undo, import step or spawn, which plays a low note and names the reason, such as `apply refused: conflict`.

A notice comes once the server has reloaded what changed, so it reports the real result: if the reload refused a file, the line names the number of problems, the hover shows the first one, and the low note plays. Click the `(tx ...)` part to copy the transaction id. Click the rest of the line to put `/animus rollback <transaction-id>` into the chat box without running it.

Changes from one paired browser arrive as one notice when they come close together, so a large import or a burst of applies plays one sound, not one per document. The server log gets one line per notice, and with `/animus debug mode` on, one line per event as it happens. Sounds, chat, the action bar and the log line are set in [`[editor.notify]`](/animus/03-configuration#editornotify).

## Audit log

Every pairing, revocation, validation, preview, apply, undo and import is appended to `state/editor/audit/<yyyy-mm-dd>.jsonl` with the token id, the issuing administrator, the address, the documents touched and the result. Files older than `auditDays` (30 by default) are removed at startup and when `config.toml` is hotloaded.
