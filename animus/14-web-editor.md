---
title: "Animus: Web Editor"
description: "Pairing the web editor with a server and what it edits"
published: true
date: 2026-11-10T00:00:00.000Z
tags: "animus, editor, web, pairing"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

The web editor runs in the browser at <https://animus.volmitsoftware.com>. It edits NPCs, trait groups, routes, recordings, skins, behaviors, packs, shops, chest GUIs, menus, holograms, text animations, rigs and animations, with a 3D preview of each NPC. It works on its own against local files, and against a live server once paired.

## Working without a server

A workspace lives in the browser and is never uploaded. Start one blank, from the example packs, or by opening a data folder (`plugins/Animus`, or `config/animus` on mod servers) as a folder or a zip. Opening a folder copies it into a new workspace: edits stay in the browser and do not go back into the folder. Export a workspace as a zip (**Export**, then **Export the data folder zip**) to copy it back to a server by hand. A folder or zip with no Animus documents, such as the server root, `plugins/` itself or a file that is not a zip, opens nothing and saves nothing; the home page says what it found and what to pick. A deleted workspace can be restored from the home page until you close the tab.

NPC definitions and trait groups at an older [schema version](/animus/12-storage-recovery#schema-versions) are upgraded in the browser as a folder, zip or stored workspace opens, the same way the server upgrades them. The notice and the workspace overview count and list the upgraded files, and **Export** and **Send** write the current version.

If the browser cannot keep workspaces (some private windows have no IndexedDB), a banner says so: everything works until the tab closes, so export a zip first. If the browser refuses to store an edit (for example when it is out of storage space for the site), the edit stays on screen and a banner names the cause, with **Save again** and **Export zip**.

A blank workspace's overview names three ways to start: **Create an NPC**, **Import** (convert a Citizens, Shopkeepers or Denizen save) and **Pair a server**.

Every document is checked against the Animus schemas as you type and has Visual, Preview, Code and Split views. The header shows the document's revision, read only: the server raises it on every apply. Text typed in Code joins the draft only with **Apply to draft**. Until then it stays with the document while you open others: the sidebar marks the document **code**, the other views say the Code draft is not applied, and closing the tab asks first. New documents start from a guided first step, such as an NPC from its name, folder, body, skin and position, or a behavior from the conversation, greeter, dialogue, patrol, shop, guard or quest template.

A list longer than eight entries has a search field at its top: type to narrow it. A list that picks another document, such as an NPC's rig or a route's recording, ends with **+ New** and **Manage**. **+ New rig** opens the new rig form with what you typed in the search as its name and the current folder, and **Create** brings you back with the new rig picked. **Manage rigs** lists every rig. Recordings are made in game, so their list says to run `/animus record start <id>` instead.

A behavior's Visual view reads top to bottom: the document, its variables, its routines as a tree, then its triggers.

- A collapsed step shows its type and what it does in plain words, such as "Say: Welcome" or "While count < 3". Up and Down move between steps, Right and Left open and close one, and Delete asks in place before removing it (Escape keeps it). A step you close stays closed while you edit the rest.
- Wherever a step takes a value (a `set`, a `repeat` count, a `foreach` list, a `return`, a call's arguments) you choose a typed value, a variable of a matching type, an expression, or a template with `{{ }}` holes.
- Expressions and templates check themselves as you type and offer variables, `player.` and `npc.` facts, event `context.` keys and functions below the field; use the arrow keys and Enter to pick one.
- An action's argument can also be filled when the step runs: pick From a variable, From an expression or From a template, and the editor writes the placeholder for you.
- The Server behavior switch in the Document section makes the behavior server-wide: NPC events, `npc` and `relationship` scopes and NPC-only capabilities disappear from the pickers, and timers start at 20 ticks.

A behavior's Preview is a dry run: pick a trigger, step through what the NPC says, asks and walks to, and answer its prompts. Loops, expressions and templates run in the browser; facts only a server knows, such as a player's health, use sample values, and a condition that reads one is marked assumed so you can flip it. Commands, combat, building, items and shop trades are listed as server-only and not run.

An NPC's Preview wears its skin: the editor reads the skin document the NPC names (on a server workspace it fetches that document when you open the NPC) and loads the texture from Mojang's texture server in your browser. Until the texture arrives, or if it cannot be loaded, the stage shows the default Steve or Alex skin and the Skin line says why, with Retry texture. A PNG kept in the workspace under `editor/skins/<hash>.png`, or one you load under Appearance, is used instead. An unsigned skin without a kept PNG shows the placeholder, and the Skin line says so.

`server-behaviors.json`, the list of server behaviors that run, opens like any other document and is kept when you export the workspace. Its Visual view lists the server behaviors in order: add one from the behaviors in this workspace that have the server switch on, remove one, or move it up or down. Only listed behaviors run, so an empty list runs none. Create the list from the New page; it starts with every server behavior in the workspace. The workspace overview counts how many are listed.

Schematics are not editor documents.

### NPCs, trait groups, routes, recordings, skins and packs

<div class="animus-demo">
<p><strong>Create an NPC</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/02-create-npc-editor.webm" aria-label="Creating an NPC from New document and previewing it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Browse, beside NPCs in the sidebar, lists every NPC with its folder, tags, type, world and features, and the skin's face once its PNG is loaded. Search by name, id, type, world or tag, or narrow with `tag:`, `folder:`, `type:`, `world:`, `has:` (route, combat, shop, rig, skin, behaviors) and `is:` (spawned, despawned, invalid); a leading `-` excludes a term. `folder:town` finds the NPCs in `npcs/town/` and in every folder below it; `folder:=town` finds only those directly in `npcs/town/`, and `folder:=` only those directly in `npcs/`. A search that matches nothing offers Clear search, and an empty workspace links to Create an NPC.

The folder tree shows `npcs/` and its folders, nested as they are on disk. Each folder shows how many NPCs sit directly in it; a collapsed folder shows how many sit in it and every folder below it. The browser remembers which folders you collapsed, per workspace. Click a folder, or press Enter, to list its NPCs. The tree takes one Tab stop: Up and Down move through the folders, Home and End jump to the first and last, Right expands a folder and then steps into it, and Left collapses it and then steps back to its parent.

Below the tree, the buttons act on the selected folder:

- **New folder** makes an empty folder inside it. A folder exists only through the NPCs in it, so an empty one stays in the tree until the page reloads or until an NPC lands in it: move NPCs into it, or use **New NPC in** to create one there.
- **Rename** and **Move** take every NPC of the folder and its subfolders along, in one undo step.
- **Delete** removes a folder only while it is empty; a folder with NPCs says how many it holds.

Folder names follow the server's rules: 1-64 lowercase letters, digits, `_` or `-`, starting with a letter or digit, at most 8 folders deep. A name the server would refuse is refused before anything changes, in the server's words.

Select NPCs to mark them spawned or despawned (first in the bar), tag or untag them, move them to a folder (pick one from the tree, `npcs/` itself included, or type a new path such as `town/market`), switch a module on or off or remove it, or delete them. Each change is one undo step.

Once the workspace has a [trait group](/animus/18-trait-groups), the Trait groups form above the list assigns or unassigns one, like `/animus groups assign` and `unassign`: for the selected NPCs, for one folder (that folder only, not the ones below it), or for every NPC whose tags include a tag, counting tags that come from its trait groups.

- The reply reads like the server's, such as `Assigned town-guards: 2 changed, 1 unchanged.`, and the whole change is one undo step. On a server workspace it goes out as one change set at the next apply.
- A group the workspace does not have, or one that would give an NPC more than 16 groups, changes nothing.

Delete asks once more, and Escape keeps the NPCs. On a paired server whose token has the `spawn` scope, Spawn on server and Despawn on server act at once; Despawn asks first because undo does not reach the server. Without the scope the bar says how to get it.

An NPC's Visual view puts the inspector beside the 3D stage, or under it on a phone. The inspector reads top down, and each part's heading sums it up while closed; on a phone only Identity starts open.

- Identity: name, id, folder, UUID, tags, the trait groups the NPC lists and the owner's UUID. Trait groups show as a row of chips in merge order: click one to open it, drag it or press Alt with the left or right arrow to reorder, and × removes it; a trait group the workspace does not have carries a warning. **Add group** picks one from the workspace, and **+ New group** makes a trait group named after the search text and lists it on this NPC in one undo step, then offers to open it. An NPC made in the editor while it is paired gets the pairing player as its owner; the field stays editable.
- Effective, for an NPC with trait groups: the definition the server runs, one row per field, per module and per attribute with the trait group or NPC that set it and a link to that trait group, plus the whole effective JSON. The 3D stage draws the effective definition, so equipment, holograms and skins from trait groups show on it.
- Body: the body type and, right under it, whether the NPC is spawned. Also a rig from the workspace (the stage draws it), the pose (shown for player bodies only), an armor stand's parts and pose angles, the settings of its body (a horse's coat, a sheep's wool, a villager's profession, a player's skin layers and the rest) as dropdowns, numbers and switches, and the traits that body shows: baby only for bodies with a baby form, tab list and raised item only for players. The stage draws every body type with the client's own models, and the settings that change how a body looks: coats, markings and variants, wool colour and shearing, collars, slime, magma cube and phantom sizes, villager clothes and badges, tropical fish patterns and colours, sitting, lying and the other poses, a painting's art and side, an item frame's item and turn, a falling block's or block display's block state, an item display's item and transform, a text display's text, and the saddles, harnesses and body armor a mob wears. Fish out of water lie on their side and squids tip over, as in game. A note under the stage names what it draws differently: a baby is drawn grown, an animated state such as an armadillo rolling up is drawn at rest, and a display that turns toward the viewer is drawn fixed. A LibsDisguises `disguise` that names a vanilla type, such as `zombie setBaby true`, draws that body; its options, and custom disguises, show in game only.
  - While the NPC wears a skin, its own or one from a trait group, choosing a body other than a player asks first, since the server refuses a skin on any other body. Remove skin changes both in one step, also taking the skin out of the trait groups that gave it, and Cancel keeps the player body.
  - Fields left from the old body after a type change, such as a skin, a pose or another body's settings, are listed under the type with a button to remove each one, or all of them.
- Position: the coordinates and named facings for the `animus:pose` action.
- Appearance: the skin, hologram lines, the nameplate, the boss bar, who may see the NPC and the NPC that receives its clicks.
  - The skin is picked from the workspace skins with their faces or by hash, with Remove skin and the arm model (slim or classic). A built-in skin makes a skin document from that PNG, labelled with its name, and wears it in one undo step. New skin takes a PNG file or address. The stage beside it wears whatever is picked here.
  - Equipment shows as inventory slots laid out like the player's: armor down the left, saddle and body armor beside it, off hand and main hand below. Only the slots the body shows appear, plus any other slot already filled, with a warning. Click a slot, or press Enter, to edit its item, count and components below the grid. Arrow keys move between slots, a right click or Delete empties one, and dragging a slot onto another swaps their items.
  - Hologram lines show with a colored preview and their style (billboard, line height, view range), and a switch sets whether the nameplate shows.
- Attributes: the NPC's [attributes](/animus/04-npc-definitions#attributes). Add one from the dropdown, which can be searched: attributes are grouped under Size and movement, Combat, Senses, Player only and Other, each row shows its range and vanilla default, attributes already set are grayed out, and the ones the NPC's body type carries come first, with the rest marked as having no effect on this body; each shows a number field with its range, its vanilla default and what Animus does with it, and a reset that removes it. A value out of range is refused before it is saved. The 3D stage draws the body at its `scale`. A trait group's editor has the same part.
- Behavior: the behaviors the NPC runs, picked from the workspace and, while connected, the server (server-wide behaviors are not offered, since they have no NPC), its route, how it walks, and its stored inventory, drawn as rows of 9 slots for its size and edited the same way; slots past the size are flagged. A reusable route shows read-only, with Edit route to open it and Make a copy for this NPC, which makes a new route the NPC alone uses (one Undo step).
- Health and death, under Modules after combat: whether the NPC is [killable](/animus/08-combat#health-and-death), its health, armor, regeneration, damage sources, attacker permission and protection range, whether what combat ignores can hurt it, the drops (each picked with the item picker, with a max count and chance), experience, and after death a respawn delay with respawn points on the position grid, permadeath or deletion. A dead NPC shows a notice with **Revive**. This part is the only place for health and death; the combat form has none.
- Modules: combat, the shop a click opens (picked from the workspace shops, with **Edit shop** and **+ New shop**), another NPC to ride, hiring (its items as a row of six slots), and any other module, typed from its schema or as key and value rows; Advanced edits it as JSON.
- Kept fields: anything else in the file, kept as written and edited as key and value rows; the server reads it.

The route editor draws the points on a top-down grid. Click to add a point and drag to move one. From the keyboard, Tab reaches each point: the arrow keys move it a quarter block, Shift with an arrow moves it a whole block, and Delete removes it. Add point at takes an x, y and z. Walking points stand on whole blocks. Add recording step adds a point that plays part of a recording; it is listed and numbered with the points but not drawn, and Make a recording step and Make a position switch a point between the two. Reusable routes under `routes/` open in the same editor and are checked against the route schema.

A wait is one number or, with Range, a Min and a Max (a new wait is drawn at each arrival), for the route and for each point. Seed (`npc` or `random`), Start offset (`first` or `random`) and Jitter sit with the route's settings. A picked point takes its own jitter, a weight with order `random`, and Next points with order `sequence`: each junction names a point and a weight, and the grid draws it as a dashed line. Each field is checked with the server's rules and wording, such as `points[3].next[1].to: out of range` or `waitTicks: min above max`, and the problem shows at the field. Changing the order drops the fields the new order refuses.

An NPC's route chooses how it moves: waypoints of its own, a reusable route, or a [recording](/animus/19-performance-recordings) with its playback, `once`, `loop` or `pingpong`; **recording default** leaves it to the recording.

A trait group opens in the same parts as an NPC, editing its `values`: Group (id, description, the NPCs that list it as chips, where × takes the trait group off that NPC and **Add member** adds one, tags), Body without type or presence, Appearance with a skin pool, Behavior without the inventory, Modules and Kept fields. Values are checked the way the server checks them, and a problem names its field under `$.values`. Renaming a trait group updates every NPC that lists it.

Recordings are made in game; the editor changes everything around the frames. A recording's Visual view edits its id, description, tags, default playback and speed, and lists its length, frames, events, world, origin, sample rate, recorder, size and revision, beside a top-down path of the recorded positions with its events marked. Drag the scrub, or use the arrow keys on it, to move a marker along the path with the tick, seconds and states such as sneaking; Play runs it at the recording's speed and starts paused. The events list jumps the scrub to an event. To trim, move the scrub and press **Start here** and **End here**; both snap to the nearest frame, the path shows the kept part, and **Trim** cuts the frames and events outside it in one step that Undo reverses. The kept start becomes tick 0 and the new origin, every position stays where it was, and the equipment worn at the new start is kept. Code applies a hand edit only when it passes every rule the server checks, and names the first one it breaks. Browse, beside Recordings in the sidebar, lists every recording with its length, frames, events, world and size. Renaming a recording updates the NPCs and route steps that play it.

A skin document shows the face once its PNG is loaded, its hash, arm model and signature, the NPCs and trait groups that wear it, and the controls to load the PNG into the preview from a file or a web address that allows it. A skin's id is the hash of its text, so changing its arm model makes a new skin document: from the skin document every NPC and trait group wearing it moves to the new one and the old one is removed; from an NPC or trait group only that one moves, and the old skin stays while others wear it. Each is one Undo step. A signed skin keeps its model, since the model is part of the signed data. Deleting a skin lists who wears it first. Looking a skin up by player name is not offered. A pack's manifest edits its name, version and description, and the Java modules its behaviors use: each is required (without it the pack is unavailable) or optional, with its own configuration.

### Rig and animation editor

An animation whose rig is not in the workspace opens as a form of its fields, with a note naming the missing rig. Open a rig, or an animation (which opens its rig), to get the rig editor: the bone tree on the left, the 3D stage in the middle, the bone inspector on the right and the timeline underneath. On a phone the stage stays on top and a switch under it shows Bones, Inspector or Timeline.

- **Bones.** Add a child, rename (the rig's animations follow), reparent or delete. With the tree focused, Up and Down move between bones, Right goes to the first child and Left to the parent.
- **Inspector.** Pivot, rest rotation and the visual: an item display (item, count, components, item context), a block display (block state) or a text display (text, billboard, background as `#AARRGGBB`, line width, shadow), with its offset, rotation and scale. Sockets hang equipment slots from a bone; the stage shows a sample item at each socket. The server reads sockets but does not attach equipment to them yet.
- **Stage.** Drag to orbit, Shift or right drag to pan, Ctrl and the wheel (or a pinch) to zoom. Click the stage and use the arrow keys to orbit, Shift and the arrows to pan, + and - to zoom and 0 to reset. A vertical swipe over the stage on a phone scrolls the page. The Move, Rotate and Scale handles drag along their axis; focus a handle with Tab and use the arrow keys to nudge it (Shift for smaller steps). In the rest pose a handle edits the pivot, rest rotation or visual scale. With an animation open it keys the bone at the playhead.
- **Timeline.** Pick an animation or make a new one, then play, set the speed, the loop mode and the duration. `once` plays to the end and then the NPC goes back to its `idle` animation, which the preview shows too; `hold` keeps the last pose. Each track has a lane with its keyframes: click a lane name to select the track and change its blend (`replace`, `add` or `multiply`), move it up or down, or delete it. Drag a keyframe along its lane, or focus it and use Left and Right (Shift for quarter ticks). The selected keyframe has its tick, value and easing, Copy to the playhead, and Delete. A bezier easing is written `bezier(x1,y1,x2,y2)` with numbers like `0.25`, and the x values stay between 0 and 1. Shortening the duration lists the keyframes and events past the new end and offers to trim them.
- **Events.** The events lane under the tracks holds sounds and particles at a tick, with their arguments. They are saved with the animation; the server does not play them.
- **Animation names.** The names behaviors play an animation by. `idle` and `walk` are the two navigation switches between on its own. Each name can be renamed, pointed at another of the rig's animations, opened or removed. A name whose animation is missing, or belongs to another rig, is marked; the server skips it. Create makes a missing animation.
- **Import .bbmodel** turns a Blockbench model into a rig with its animations. Sound keyframes that name a vanilla sound become sound events. Keyframes with two values keep both. Particle and script keyframes are left out, and catmullrom and bezier curves play as `ease_in_out`; the import summary counts each. Groups named `hitbox` or `shadow` are Model Engine's hitbox and shadow, not drawn there, so the import leaves them out and warns.
- **Download server files** saves the rig, its animations and their pack sources as `<rig>-server-files.zip`. Unzip it into `plugins/Animus` on the server, then run `/animus pack build` to make the resource pack.

The stage says when the Minecraft models are still loading, when the site has no model pack, when the download failed (with Retry), when the browser has no WebGL2, and when an image or an item cannot be drawn.

### GUI editors

Chest GUIs, shops, holographic menus, holograms, text animations and the presets file open in visual editors. The preview is the large column and the fields sit beside it; on a phone they stack. The editors offer only what Animus reads, and flag anything the server would refuse at the exact field, in the server's words.

- **Chest GUI**: the window is drawn as the game draws it. Click a slot, or Tab to it and press Enter, to edit what draws it. Pick a key under **Mask brush** and drag across slots to paint the mask. The tabs cover the window (title, size, mask, show, close on teleport, refresh, select), keys, the list, variants and named action lists. In Preview, tap a slot to read its name and lore.
- **Shop**: the offers sit on one side as rows that read like trades, such as "2 emerald + 1 book → 1 enchanted book", grouped by grid and page in the order players see them. **+ Add offer** picks the kind: trade, buy, sell, command or decoration. Click a row to edit it in place: the items with their counts, enchantments and model number, the money price, commands, name and lore, stock, limits and permission, each label with a short tip. Drag a row, or press Alt with the up and down arrows, to reorder it within its group; tick rows to delete several, and **Undo** brings deleted offers back. Changing an offer's kind removes the fields the new kind cannot use and moves it to that kind's grid.
  The other side shows the **Trading screen** and the **Chest window** as tabs, marking the one players get. Both follow every edit, and clicking an offer in either opens it on the board. **Limits used up** and **No permissions** show offers crossed out as such a player sees them. A shop with a `layout` chest GUI is drawn in that GUI, page by page.
  The **Shop** tab sets the title, window style, layout GUI (with **+ New chest GUI**), permission, modes in order, purchase switches, pages, and the owner and up to eight containers. A shop with containers sells through trades only, so its offers are trades or decorations, with no price and no stock of their own. The **NPCs** tab lists the NPCs and trait groups whose shop module opens the shop, with each one's window style and, for a villager, the profession and level its trading screen title shows; **Attach to NPC...** adds the shop to another NPC in one undo step.
  Problems show at the offer: anything the server refuses, notes for what the chosen window style cannot show exactly, items not picked, counts of zero, and limits that work against each other. **New shop** starts blank or from villager trades, a money shop or a command shop.
- **Hologram**: rows of text, items, heads, blocks and entities, each with **Show when** and **Scale**, plus pages, variants, placement (anchor, yaw, pitch, view distance, refresh), style and click actions. The stage draws the text rows as one text display, as the server sends them: color codes and MiniMessage tags read the way the server reads them, a color carrying on to the next row, and the style's background, shadow, alignment, opacity, line width, scale and fixed light. A billboard other than `center`, `seeThrough` off, `glowColor` and `shadowRadius` are listed under the stage, which draws text facing the camera and over blocks. Heads are drawn without a skin and entities as a labelled box; the server shows the real thing.
- **Menu**: click a component on the stage or in the list to edit it. Components have an offset, show, motion, hover and click box, a tooltip, icon styles and list or tab layout. Menus also have constants and named action lists.
- **Text animation**: edit the frames, mode, interval and show beside a preview that plays the frames the way the server does. **Pause** and the frame buttons hold or step it. If your system asks for reduced motion, the preview starts paused.
- **Presets**: per-kind defaults and named presets for Gloss documents. Animus refuses a chest GUI, hologram or text animation that names a preset. Its editor offers **Copy this preset's fields into the document**, which copies the kind's defaults and the preset chain under the document's own fields and removes `preset`.

**Import Gloss bundle** and **Export Gloss bundle** read and write Gloss Web workspace files. An exported bundle imports back to the same ids. Gloss folders, titles that are not Animus ids, and images are not kept, and the import lists each one.

### Quests

A [quest](/animus/38-quests) opens in a form beside its preview. **New document**, then **Quest**, asks for a title and, optionally, the NPC that offers it; the quest starts with one stage that collects wheat and an experience reward.

The form has three tabs:

- **Quest**: the title (color codes and MiniMessage), the description players read in the offer and the journal, the journal icon, the givers and the turn in NPC, the required permission, quests finished first and a behavior condition, how often it repeats (once, after a cooldown, daily), and the offer, accepted, declined and completed lines.
- **Stages**: each stage has its journal text, whether its objectives count at once or one after another, and its objectives. **+ Add objective** picks talk, bring, kill, reach, collect or custom. Changing an objective's type keeps its id, journal text and every field the new type also takes. The arrows reorder stages and objectives. NPC fields pick from the workspace NPCs by their id, items suggest every item, and mob types and worlds complete from the server's lists when paired.
- **Rewards**: items with amounts, money, experience, commands (console or player) and behavior flags with a value and scope.

Problems show at the field and mark their tab: anything the schema or the server refuses, objective ids repeated within a stage, NPCs and quests the workspace does not have, unknown items, a note that rewards with items, money, experience or commands need the `apply:commands` scope to apply, and a note that reward commands need the command allow-list.

The preview shows the giver's offer with its Accept and Decline buttons, and the `/quests` journal entry at each stage and once finished, with progress counts at zero. Under it is the expression behaviors use to read the stage, such as `quest('player', 'bread')`.

### Conversations

<div class="animus-demo">
<p><strong>Conversation by keyboard</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/05-conversation-editor.webm" aria-label="Writing a conversation with the keyboard, previewing it and attaching it to an NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A behavior shaped like a conversation opens on its **Conversation** tab, beside Visual. **New conversation** in the sidebar, or in the command palette, starts one: a greeting and a question with two answers.

The tab is a tree. The Start block runs first, and what each answer leads to sits under that answer. A step is one of:

- **NPC**: a line the NPC says, with color codes and MiniMessage tags. Its menu adds a delay, a sound and an animation.
- **Asks**: a question with 1 to 8 answers. Each answer has its text, and under its menu a color, hover text, style and the block it leads to.
- **If**: a flag, quest stage, permission, item held, relationship flag or expression, with a Yes and a No list.
- **Does**: an action, such as set flag, give or take an item, run a command, open a shop, play an animation, teleport or start a quest, with the fields the server's capability list gives it.
- **Go to**: continue at another block, for a loop back.
- **End**: stop here.

The tab is made for the keyboard:

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

Rows can also be dragged by their handle within the same list. The `{ }` button inserts `{player_name}` or `{npc.name}`; the editor writes `{npc.name}` as a template hole, and in a question it does the same for the player's name.

The tab writes an ordinary behavior. Each block is a routine, a question is `animus:choices`, and each answer that leads somewhere gets a `dialogue_choice` trigger. Ids are made once from the text and then kept, so editing an answer's text later does not rename its routine or trigger. A start other than Command is the behavior's one start trigger: Right-click, Left-click, the drop key (Q) and Swap hands (F), each alone or while sneaking, are an `interaction` trigger with that [action](/animus/07-behaviors#interaction-actions); Sneak + right-click also claims the click, so a shop on the NPC opens only without sneaking. Walk near is a `proximity` trigger with its radius. A conversation saved with the older Sneak + right-click routine opens as Sneak + right-click and is saved with the `sneak_interact` action. Command adds no trigger; run it with `/animus behaviors run <npc> <behavior>`. A hand-written behavior that uses only these pieces opens the same way. Anything else, such as a loop node, a timer trigger or a binding, stays in Visual, and the Conversation tab names the first field that does not fit.

Problems show under their step: blocks nothing leads to, answers that lead to a missing block, more than 8 answers, text over the server's limits (1,024 characters for a line, 512 for a question, 128 for an answer), and flags or quests no behavior of the namespace sets.

**Preview** beside the tree plays the conversation in the browser: click an answer to follow it, and flip the switch on a condition to take its other branch. On a paired server, **Preview on server** starts the server's preview too. **NPCs** lists every NPC and trait group in the workspace; tick the ones that should run the conversation and press **Attach** to update their `behaviors` lists in one step, which Undo reverts together.

### Keyboard and commands

<div class="animus-demo">
<p><strong>Shortcut sheet and sidebar</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/10-shortcuts-sidebar-editor.webm" aria-label="Opening the shortcut sheet and hiding the sidebar" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Shortcuts work anywhere outside a text box:

| Keys | Does |
| --- | --- |
| Ctrl+K (Cmd+K on a Mac) | Open the command palette |
| `?` | Show every shortcut, page-wide and local |
| Ctrl+Z (Cmd+Z) | Undo |
| Ctrl+Shift+Z or Ctrl+Y (Cmd+Shift+Z or Cmd+Y) | Redo |
| Ctrl+F (Cmd+F) or `/` | Search the documents in the sidebar |
| Ctrl+S (Cmd+S) | Save; in a live server workspace, Apply |
| Ctrl+B (Cmd+B) | Show or hide the sidebar (the documents drawer on a phone) |
| N | New document |
| B | Browse NPCs |
| Escape | Close the palette, the shortcut sheet, a menu, the documents drawer or the confirmation you are in |

The shortcut sheet (`?`, or **Keyboard shortcuts** in the command palette) lists these and the keys that work in one place: lists and dropdowns, the sidebar, tabs and trees, the conversation editor, behavior steps, route points, offers and keyframes, and the 3D preview. Its labels follow your computer, Cmd on a Mac and Ctrl elsewhere, as do the hints in the top bar and the palette. Escape or **Close** shuts it and puts you back where you were.

Edits never overwrite each other, however quickly they follow one another: each field you change is kept and is its own undo step, and typing in one field is one step. Undo and Redo keep 50 steps each per workspace, also after a reload, and their notices say what they reverted, such as "Undid: rename town:baker". The command palette (also **Commands** in the top bar) opens a document by name or id, switches workspace, makes a new document, exports, undoes, redoes and changes the theme: type part of a name, move with the arrow keys and press Enter. In the document list the arrow keys move between documents, and the Visual, Preview, Code and Split tabs move with Left and Right. Each kind in the sidebar, and each NPC folder, folds from its header (Enter, or Left and Right); **Collapse all** and **Expand all** sit above the list, and what you fold stays folded for that workspace. In an open list, the arrow keys, Home and End move, typing jumps to a match, Enter picks and Escape closes without a change.

### Field notes

A label or heading with a dotted underline holds a short note on what it is, with a **Docs** link to the matching section of this wiki. Every inspector part and subhead, every GUI editor section, and the headings of the NPC browser, folders, server, pairing, home and rig screens have one. Hover the text or reach it with Tab to read the note, press Escape to hide it, and press Enter to open the wiki. On a touch screen a tap shows the note, and a second tap or a tap elsewhere hides it.

### Completion

<div class="animus-demo">
<p><strong>Autocomplete</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/08-autocomplete-editor.webm" aria-label="Completing a placeholder, a colour tag and an item id" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Text, expression and id fields complete as you type, and so does the Code view. Ctrl+Space opens the list anywhere, on a Mac too. Arrow keys move, Enter or Tab picks, Escape closes. Each row shows its kind, its type and a short note. Matching is loose: `dsw` finds `diamond_sword`.

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

At phone widths the document list becomes a drawer behind **Documents** in the top bar, and the other top bar controls (undo, redo, commands, open, import, export, theme) sit under **More**. Picking a document closes the drawer. Lists open as a sheet along the bottom of the screen. While there is nothing to apply, preview or undo, the live bar keeps its actions behind **Actions**, and the NPC list keeps its filters, folders and tags behind **Filters**, so the list comes first.

### More than one tab

Tabs of the same browser stay in step. A tab that is not being edited reloads a workspace another tab saved; if both tabs edit at once, the tab that saved second reloads and says "Another tab changed this workspace, so this tab reloaded it. Your last edit here was not kept." A workspace deleted in one tab closes in the others. On a server workspace only one tab at a time talks to the server; another tab with it open takes over when the first one closes.

### Sending a workspace to a server

A local workspace's **Sync** page connects to a paired server, compares the workspace with it, validates the selection on the server and pushes it as one change set; a document the server already holds differently is only sent when you choose **Replace it with mine**, and the push asks before it replaces those copies. A push is recorded in the browser before it is sent. If its answer does not arrive, the page offers **Check the earlier push**, which asks the server what became of it rather than sending it again. **Pull** copies server documents in as one undo step.

## Pairing

<div class="animus-demo">
<p><strong>Pair with a server</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/01-pair-server-editor.webm" aria-label="Pasting a pairing link and pairing the editor with a server" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Pairing gives one browser a token for one server. Run on the server, in game or from the console:

```none
/animus editor pair [label=] [scopes=a,b] [folders=a,b] [expires=7d]
```

The reply has **[Open editor]**, which opens the link, and **[Click to copy]**, which copies it; the console prints the link itself. Open it within 10 minutes; it works once. The second line names the token with **[Revoke]**, which puts the revoke command in your chat box. The pairing page shows the server's name and its fingerprint (check it matches `/animus editor status`), the paths it can use and when the link expires, and **Pair** exchanges the link for a token. **Remember this browser** is on by default: every tab of this browser stays paired until the pairing expires (`tokenDays`, 7 days, unless `expires=` set another) or you **Forget** the server. Turn it off on a shared computer; the token then lasts for that tab only, so another tab asks you to pair again. A link can also be pasted under **Servers** on the editor's home page. A pairing link that expired or cannot be read says so and offers the paste field for a new one.

When the pairing is three days or less from expiry, the live bar says how long is left. When the server revokes or expires the token, the live bar shows **Pair again**, which opens a field for the new link.

| Option | Default | Meaning |
|---|---|---|
| `label=` | None | A name shown in `/animus editor tokens` |
| `scopes=` | `read,validate,preview,apply:npcs,apply:behaviors,apply:gui,apply:rigs,terrain` | What the token may do |
| `folders=` | All folders | Limit the token to NPCs in these folders under `npcs/`, such as `folders=town,harbor` |
| `expires=` | `tokenDays` from `config.toml` (7 days) | Lifetime as a number with `d`, `h` or `m`, such as `12h` |

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

Terrain reads (`GET /v1/terrain/surface` for 64 by 64 block tiles, `GET /v1/terrain/blocks` for up to 64 layers of one chunk) cover only chunks within `terrainRadius` of where an NPC in a folder the token can reach stands or goes: its position, every point of its `animus:navigation` route (inline or a reusable route) and the straight legs it walks between them, its `animus:schedule` places and the legs between them in time order, its anchors, and, while it is spawned, where it stands now. A route point that teleports carries the route on in the target world. Farther chunks come back `forbidden`. `GET /v1/terrain/position?npc=<id>` answers where a spawned NPC stands now, read from the server at most once a second. The server reads chunks it already has loaded and never loads one: others come back `unloaded`. Answers carry no block entities, signs or containers, and each one fits a relay frame. Leave `terrain` out of `scopes=` to keep the world out of the editor.

To import from the editor, pair with the `import` scope, for example `/animus editor pair scopes=read,import,apply:npcs,apply:behaviors,apply:gui`.

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
| `/animus editor revoke <token>` | Revoke a token, or `all`. Their connections, relayed streams and previews close at once, and requests still waiting to run are refused without reading or writing anything |

All of these need `animus.editor.pair`, which `animus.admin` grants. A token issued by a player is also revoked when that player loses `animus.editor.pair`, checked every 60 seconds. The check also covers an offline player. On Paper, Spigot and Folia it reads the operator list, the node's default, Vault's permission plugin, and LuckPerms directly when Vault is missing. On mod servers it reads the operator list: an operator below level 2 does not hold the node, and a removed operator is revoked. When the server cannot tell, such as for an offline player whose permission plugin it cannot ask, or on a mod server with a permission mod, the token keeps working for at most 7 days after the last confirmation, then it is revoked and the player pairs again. The same rules apply to `animus.editor.commands` for `apply:commands`. The browser asks for a new pairing when its token expires or is revoked.

**Forget** next to a server under **Servers** asks before it removes the server from this browser: its token and its live workspace, with any drafts not applied, leave the browser. The server keeps everything already applied.

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

A paired server opens as a server workspace listing the server's documents, grouped by kind with their revision. Documents join the workspace as you open them from that catalog; until the first one does, the sidebar says how many the server has and offers **Open all**. A document you open keeps the revision and hash it came from. The live bar above each document shows the connection in words (and why it is not online, with **Retry now** while it waits; when neither path answers it says the server did not answer on either path), the number of changed drafts, and offers:

- **Validate**: run the server's validators on the changed drafts. This writes nothing.
- **Preview**: show the drafts to your own player in game. See [previews](#previews).
- **Apply**: write every changed draft as one change set. A refused apply keeps your change note for the retry.
- **Undo last apply**: roll the last applied change set back, after a confirm. Escape cancels.

Every message about a refused request says what happened and what to do next, such as pairing again with a missing scope.

Live editing for one server runs in one tab at a time. A second tab on the same server shows that another tab is editing it and waits; when the first tab closes or moves to another workspace, the second takes over.

### Terrain

With a token that has the `terrain` scope, the editor draws the server's world around your NPCs and along everywhere they walk.

- **Preview stage**: the blocks around the NPC and along its route replace the grass patch, with the pack's own models, including slabs, stairs, fences, glass, leaves and water. **Terrain** turns them off, and **Radius** picks 8, 16 or 24 blocks on each side of the NPC, its points and the legs between them, 32 blocks tall around the route's height at each spot. Drag the view along the route to see it. One view loads at most 256 chunks; past that, every point still loads and the legs load from their start.
- **Live position**: while the NPC is spawned, the stage shows it where it stands on the server now, checked every second and a half, and loads the blocks around each new spot as it walks.
- **Route grid**: the ground under the grid is drawn top down from above, lighter where it rises and darker where it falls, water darker with depth. A grid wider than 64 tiles of 64 blocks draws the ground within 24 blocks of the route instead of all of it. Chunks the server has not loaded show grey, and chunks outside `terrainRadius` show hatched.
- **Placing points**: a point you click onto the grid, or drag, lands on the block an NPC can stand on there. Points inside a block, below the surface, more than 3 blocks above the ground or in water are flagged on the grid and listed under it, and so are legs that climb more than a block or drop more than 3 in a straight line.
- **3D**: shows the whole route over its blocks and frames the picked point. Legs are straight lines; the server plans the real path.

The editor asks only for the ground it draws, keeps every answer in the browser, and asks again with the answer's hash, so unchanged terrain is not sent twice. Without a paired server, the stage keeps its grass patch and the grid stays blank. When the server is paired but cannot send terrain, the stage says why on its lower edge: the pairing has no `terrain` scope (pairings made before terrain existed; run `/animus editor pair` again), the server has terrain switched off, the server is offline or too old, or the chunks are unloaded because no player is near them.

### Applying changes

<div class="animus-demo">
<p><strong>Apply and undo</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/09-apply-undo-editor.webm" aria-label="Renaming an NPC, applying it and undoing the apply" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Apply checks every document again and writes them all in one transaction, or none of them. It sends every edit made before you pressed it. An edit made while the apply is on its way stays a draft for the next apply. If another edit changed a document on the server since you opened it, nothing is written and the editor opens a three-way merge of base, yours and the server's. Fields that only one side changed merge by themselves; for each field both changed, pick a side, then apply again.

Moving NPCs to another folder, or renaming or moving a folder, changes their ids. On a server workspace the next apply sends each moved NPC as a move: the server writes the new file and removes the old one in the same transaction, and the NPC keeps its revision history. The live bar counts moves among the changed drafts ("3 changed drafts, 2 moved") and lists each as the old id to the new one. If the NPC changed on the server since you opened it, or another NPC already has the new id, nothing is written and the editor shows the conflict. **Undo last apply** moves the NPCs back.

The editor stores each change set in the workspace before it sends it, and sends nothing if it cannot store that record. An applied change set takes effect as any saved file does. Each one gets a rollback receipt, so **Undo last apply** and `/animus rollback <transaction-id>` both undo it. An undo that would overwrite a later edit is refused and changes nothing. If the connection drops during an apply, the editor asks the server on reconnect whether the change set went through, instead of sending it twice. When the server cannot say, the live bar offers **Check again** and **Stop waiting**.

Two editors, or an editor and an in-game command, never overwrite each other's work. Every document has a revision, and a write made from an older revision is refused: the editor shows the conflict and its merge, and a command answers with a conflict and leaves the file as it is.

After any reconnect the live bar shows **Resyncing** while the editor asks about unanswered change sets and reloads the catalog, then one line says what it found, such as "Resynced with the server: 1 document refreshed." Clean copies take the server's version; a draft that also changed on the server is marked **changed on server** for a merge. A browser that stops reading server events, for example on a stalled network, is disconnected once about 1 MiB of events waits for it, without slowing the server or other editors. It reconnects and resyncs the same way.

Documents changed on the server while you edit refresh in the editor. One you have edited is marked as changed on the server, with a **Merge** button.

**Take server version** and **Accept the deletion** in the merge view ask before they replace your draft.

### Previews

A preview shows your drafts to the in-game player who issued the token, and to no one else. It needs that player online, so a token paired from the console cannot preview: the editor answers `This token was paired from the console; previews show to the pairing player.`

- Previewed NPCs are packet-only and never saved. A draft of an existing NPC replaces the live one for you only; a new NPC appears only for you. Everyone else keeps seeing the live version.
- Preview NPCs stand still at their definition position with their appearance, equipment and skin. They run no behaviors or triggers, take and deal no damage, and do nothing when clicked.
- While a preview replaces a live NPC, you fire none of that NPC's triggers and receive none of its speech, sounds or particles.
- Commands, combat control, item and money changes and trades are refused in previews.
- You have one preview at a time. It ends after `previewMinutes` (15 by default), when you end it, when your editor disconnects, or when you leave the server. Leaving the document's workspace ends a preview it started. If your player is not on the server, the preview is refused and the editor says to join first.

### Importing

The editor's **Import Citizens and others** screen converts in the browser and, after a conversion, offers **Open as workspace** (the converted files as a new workspace to review), **Send to server** and **Download data-folder bundle** right under its review. Warnings name each NPC by its Citizens id and name. It can also upload a Citizens `saves.yml`, dtlTraders files, and a Shopkeepers `save.yml` and `config.yml` to a paired server. **Upload and stage** runs the same conversion as `/animus import citizens preview` and shows its review. **Apply** installs the import after a confirm, with every NPC spawned as Citizens had it and everything that converted turned on; the confirm names the command namespaces it adds. **Roll back** undoes the import after a confirm. Once applied, **Open the imported NPCs** leads to them in the server's catalog. Uploads are limited to 16 MiB. dtlTraders files with names dtlTraders does not use are listed as skipped. See [migrating from Citizens](/animus/13-migrating-from-citizens).

### In-game notices

<div class="animus-demo">
<p><strong>Editor link and undo</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/30-editor-pair-undo-ingame.webm" aria-label="Getting a pairing link and undoing a glow change from chat" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

When the editor changes the server, online players with `animus.editor.notify` (operators by default) hear a short sound and see one chat line saying who changed what, such as:

```
[Animus]: Brian's editor applied 3 NPCs, 1 behavior (tx 1a2b3c4d)
```

The player who paired the token gets the notices for that token even without the permission. Notices cover an apply, **Undo last apply**, an import being applied or rolled back, spawning and despawning from the editor, a completed pairing, a revoked token, and a refused apply, undo, import step or spawn, which plays a low note and names the reason, such as `apply refused: conflict`.

A notice comes once the server has reloaded what changed, so it reports the real result: if the reload refused a file, the line names the number of problems, the hover shows the first one, and the low note plays. Click the `(tx ...)` part to copy the transaction id. Click the rest of the line to put `/animus rollback <transaction-id>` into the chat box without running it.

Changes from one paired browser arrive as one notice when they come close together, so a large import or a burst of applies plays one sound, not one per document. The server log gets one line per notice, and with `/animus debug mode` on, one line per event as it happens. Sounds, chat, the action bar and the log line are set in [`[editor.notify]`](/animus/03-configuration#editornotify).

## Audit log

Every pairing, revocation, validation, preview, apply, undo and import is appended to `state/editor/audit/<yyyy-mm-dd>.jsonl` with the token id, the issuing administrator, the address, the documents touched and the result. Files older than `auditDays` (30 by default) are removed at startup and when `config.toml` is hotloaded.
