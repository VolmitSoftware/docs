---
title: "Animus: In-Game Menu"
description: "The Animus menu and the wand: make, find and change NPCs in chest windows without leaving the game"
published: true
date: 2026-11-12T00:00:00.000Z
tags: "animus, gui, menu, wand, selection"
editor: markdown
dateCreated: 2026-11-07T00:00:00.000Z
---

The Animus menu changes NPCs from chest windows. Run `/animus gui`, pick an NPC or make one, and one screen lists everything you can do with it: how it looks, what it does, and moving, copying or deleting it. The wand selects NPCs in the world: right-click one with it and its screen opens. The same screens open on Paper, Spigot, Folia, Fabric, NeoForge and Forge.

Every change saves as soon as you click, except on the few screens that collect changes until you click **Save**. Each change's chat line carries **[Undo]**, and `/animus undo` reverts your last change, from the menu or from a command.

| Command | Does |
|---|---|
| `/animus gui` | Opens the menu at **Home**. From the console, or without `animus.tools`, it shows the help page of the `gui` commands instead |
| `/animus tools` | Opens the screen of the NPC you selected, one screen for all of them when you selected several, or **Home** when nothing is selected |
| `/animus tools wand` | Puts the wand in your hand |
| `/animus tools mode [simple\|advanced]` | Shows your menu mode, or sets it |

These need `animus.tools` and a player. Each screen and button also needs the node of what it changes; see [permissions](#permissions).

## Simple and Advanced

The menu has two modes. **Simple**, the default, shows the common tasks. **Advanced** shows everything: more buttons on the same screens, the library on **Home**, every field of an NPC, and the ids and file names in dark grey under each name. Advanced only adds buttons; a button Simple shows keeps its place.

Switch with the **Mode** lever in the bottom row of **Home** and of the NPC screen, or with `/animus tools mode advanced`. Your mode is saved for you alone, in `state/toolkit/<uuid>.json`, and stays after a restart. Switching changes what the menu shows; it changes nothing in your files.

The mode also changes two things in chat. In Simple, a change's reply shows **[Undo]** without the change id, and `/animus help` shows one short page of common commands. Advanced shows the id and every command. See [replies](/animus/02-commands-permissions#replies).

| Screen | What Advanced adds |
|---|---|
| Home | The [library](#library) row |
| NPCs | Sneak-click to add or remove an NPC, and the [selection](#selection) row |
| NPC screen | **All fields**, **Behaviors**, **GUIs**, **Folder**, **Trait groups**, **Attributes**, **Modules**, **Inspect**, **Revive**, **Open in editor** |
| New NPC | The **Id** question, and **Type an id** and **Spawned** on the Body step |
| Body | **Type an id**, for bodies from mods or newer game versions |
| Hologram | **Offset X**, **Offset Z**, **Above the head**, **More settings** |
| Movement | **Walk once**, **Start**, **Stop now**, **Movement settings**, **Mounts and riding** |
| Recordings | **Show my trail** |
| Shops | **Reload** |
| Combat | The **Rules**, **Live** and **Settings** rows |

## The wand

<div class="animus-demo">
<p><strong>Wand and selection</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/03-wand-selection-ingame.webm" aria-label="Selecting two NPCs with the wand and clearing the selection" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The wand is a glinting stick named **Animus wand**. **Wand** on Home and `/animus tools wand` give you one, or move the one you carry into your hand; with a full inventory it drops at your feet. The server knows the wand by a marker on the item, not by its name, so renaming it keeps it a wand. On Paper, Spigot and Folia the marker is the persistent data key `animus:tool` with the value `wand`; on mod servers it is the same key in the item's `minecraft:custom_data`.

| With the wand in your main hand | Does |
|---|---|
| Right-click an NPC | Selects only that NPC and opens its screen |
| Left-click an NPC | Selects only that NPC |
| Sneak and click an NPC, either button | Adds it to the selection, or takes it out |
| Right-click air or a block | Opens Home. The block is not used |
| Sneak and right-click air or a block | Clears the selection |
| Left-click air | Says "No NPC there" above the hotbar when an NPC stands within 6 blocks or you sneak, at most every 2 seconds. While you record a performance it says nothing, since the swing is part of the take |
| Click an NPC while a screen asks for one | Answers the screen, such as the NPC a mount rides |
| Tap sneak while you make a route | Drops a route point where you stand |

Each click says what it did above the hotbar, with the name players see, such as `Selected Town Guard` or `Added Baker, 2 selected`. In Advanced the id follows a name that differs from it: `Selected Town Guard (guard)`.

The wand, the menu, `@selected`, `/animus selection` and `/animus select` share one selection. With one NPC selected, commands that take `@selected` act on it; with several, they refuse and ask you to name one. A newly selected NPC glows for you for two seconds, and small particles mark the corners of the nearest selected NPCs within 48 blocks for as long as they stay selected. Only you see them. The selection holds at most 256 NPCs, `/animus select none` clears it, and it is forgotten when you leave the server.

Without the wand, a click on an NPC opens its shop, GUI, conversation or hire window as usual and never changes the selection. With the wand, a click is for editing only: the NPC's behaviors, shop, GUI, quests and riding do not run, and a left-click does not hit it.

## Home

<div class="animus-demo">
<p><strong>Home</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/04-palette-ingame.webm" aria-label="Opening the Animus menu with /animus gui and hovering each button on Home" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Home opens from `/animus gui`, from `/animus tools` when nothing is selected, from **Back** on an NPC screen, and from a right-click on air with the wand. Its bottom row has **Close**, **Mode** and **Help**, which also says that `/animus gui` opens this menu.

| Button | Does |
|---|---|
| **New NPC** | Makes an NPC where you stand; see [New NPC](#new-npc) |
| **NPCs** | Lists every NPC so you can find one and change it |
| **Wand** | Gives you the wand |
| **Web editor** | Closes the window and sends a pairing link for the [web editor](/animus/14-web-editor), as `/animus editor pair` does |

While you make a route, the top of Home shows **Finish route (4 points)**, which opens its [points](#points). While you record, it shows **Stop recording**, which stops and saves the recording. The NPC screen shows the same button beside its top item.

## NPCs

<div class="animus-demo">
<p><strong>NPCs</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/05-find-ingame.webm" aria-label="Going to an NPC from the NPCs list and opening another's screen" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The list starts with the NPCs spawned in your world, nearest first, with their distance. The rest follow by name, each marked with the world it stands in, **Spawned** or **Despawned**. A player body shows the head of its skin. **Search** finds an NPC by name or id. Distances are measured when the list opens.

| On an NPC | Does |
|---|---|
| Click | Selects only that NPC and opens its screen |
| Right-click | Takes you beside it, facing it. It must be active |
| Sneak-click (Advanced) | Adds it to the selection, or takes it out |

### Selection

In Advanced, the row under the list builds the selection from many NPCs at once. Each button except **Clear selection** replaces the selection; when more than 256 NPCs match, the chat line says how many were left out.

| Button | Does |
|---|---|
| **By folder** | Lists the folders; selects the NPCs directly in the one you pick |
| **By tag** | Asks for a tag and selects every NPC that has it, tags from trait groups included |
| **All in world** | Selects every NPC spawned in your world. Asks once more when that is more than 20 |
| **Invert in folder** | In the folder you pick, selected NPCs leave the selection and the others join it. NPCs in other folders stay as they are |
| **Clear selection** | Empties the selection |
| **Edit selection (3)** | Opens one NPC screen for all of them. Shown while something is selected |

## The NPC screen

The screen of one NPC, titled with its name, or of every selected NPC at once, titled such as "3 NPCs". The item at the top shows the body and whether it is spawned, and in Advanced its folder and trait groups; click it to pick another NPC. The **Movement** button says what the NPC does now, such as "walks route Market loop", or "walks its own route" for points kept in the NPC's own file.

| Row | Simple | Advanced adds |
|---|---|---|
| Look | **Name**, **Body**, **Skin**, **Equipment**, **Hologram** | **All fields** |
| What it does | **Talk**, **Shop**, **Movement**, **Combat** | **Behaviors**, **GUIs** |
| Manage | **Bring here**, **Go to**, **Spawned**, **Copy**, **Delete** | **Folder**, **Trait groups** |
| More | | **Attributes**, **Modules**, **Inspect**, **Revive**, **Open in editor** |

With several NPCs selected, every button changes all of them. **Name** and **Go to** act on the first one and say "First only". **Skin** is grey with "Player bodies only" when no selected NPC has a player body. **Back** goes to Home.

### Manage

<div class="animus-demo">
<p><strong>Copy, delete and undo</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/13-manage-undo-ingame.webm" aria-label="Copying and deleting the greeter, then undoing the delete from chat" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

| Button | Does |
|---|---|
| **Bring here** | Moves the selected NPCs two blocks in front of you, facing you, where New NPC puts a new one, and saves their new places as one change. Only NPCs active in your world move; the chat line counts the others, and with one NPC that is not active it says so by name |
| **Go to** | Takes you beside the first NPC, facing it |
| **Spawned: on** | Click to despawn; despawned NPCs stay saved. **Spawned: off** spawns them after checking that each one can run on this server |
| **Copy** | Saves a despawned copy of each, named `<id>-copy`, or `<id>-copy-2` when that is taken. The copy is not selected |
| **Delete** | Asks once more, then deletes the files and goes to the NPCs list, or to Home when no NPC is left. **[Undo]** in chat brings them back and selects them again |
| **Folder** | Opens [folders](#folders) |
| **Trait groups** | Opens [trait groups](#trait-groups) |
| **Attributes**, **Modules** | Open [attributes](#attributes) and [modules](#modules) |
| **Inspect** | Closes the window and prints what `/animus inspect` prints for the first NPC |
| **Revive** | Brings each dead NPC back at full health, as `/animus npc revive` does: a permadeath is cleared, and an NPC waiting to respawn comes back at once |
| **Open in editor** | Closes the window and sends a pairing link for the web editor, as `/animus editor pair` does |

## New NPC

<div class="animus-demo">
<p><strong>New NPC</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/06-new-npc-ingame.webm" aria-label="Making the greeter from Home with a name, a player body and the default skin" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

**New NPC** on Home makes an NPC in three steps.

1. **Name.** Type the name players see, such as `Greeter Bob`. Animus makes the id from it, `greeter-bob`, and adds `-2` when that id is taken. In Advanced, a second question, **Id**, shows that id so you can change it: 1 to 64 lowercase letters, digits, `_` or `-`.
2. **Body.** Click one of the 14 common bodies, Player first, or open **All bodies** for every body the server can show. **Search** finds one by name. In Advanced, **Type an id** takes a body id such as `minecraft:fox`, and the **Spawned** switch, turned off, saves the NPC despawned.
3. **Skin**, for a player body only. Click a saved skin, **My skin**, **Player name** or **Default**, the plain look. See [skins](#skins).

Any body other than a player is made as soon as you click it. The NPC appears two blocks in front of you, facing you, with you as its `owner`. The window closes so you can see it, the NPC becomes your selection, and chat says `Made Greeter Bob [Edit] [Undo]`, or in Advanced `Made Greeter Bob (greeter-bob) [Edit] [Undo]`. **[Edit]** opens its screen, as a right-click on it with the wand does. The wand goes in your hand, and if you have none you get one; the line above the hotbar says which, once.

Nothing is saved before the last step. The NPC and any new skin file are saved together, so one **[Undo]** takes both back. An NPC that cannot spawn on this server is refused with the reason, and nothing is saved. Its world is the world name your other NPCs use, so its file matches theirs.

## Look

### Name

**Name** asks for the name players see above the NPC and saves it on the first selected NPC.

### Body

**Body** shows the same bodies as New NPC; the current one glints. Click another body to change every selected NPC to it. A new body drops the settings only the old one could show, such as a skin, a pose or a horse's coat: the button asks once more and names what goes, and **[Undo]** brings it back.

### Skins

<div class="animus-demo">
<p><strong>Skins</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/10-skins-ingame.webm" aria-label="Putting three skins on the greeter and renaming one" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

**Skin** lists the skin files in `skins/`. Each entry shows its name and who wears it. Opened for an NPC, the top of the window names it and the skin it wears now. Skins show only on `minecraft:player` bodies; when the selection holds another body, a note says it is skipped, and the chat line counts them.

| On a skin | Does |
|---|---|
| Click | Puts it on every selected NPC. With nothing selected, opens its details |
| Right-click | Opens its details: **Wear it**, **Rename** and **Delete** |

**Rename** asks for a name; an empty answer removes it. **Delete** asks once more and removes the file. A skin that an NPC or trait group wears is never deleted; the refusal names who wears it.

| Button | Does |
|---|---|
| **My skin** | Saves your own signed skin, named after you, and puts it on the selected NPCs. Offline-mode servers have no signed skins, so it says so |
| **Player name** | Asks for a Minecraft name, looks up that account's signed skin on Mojang's servers, saves it under the account's name and puts it on the selection. The lookup needs internet access from the server, not online mode, so it works on offline-mode servers too. A name that is not 1 to 16 letters, digits or `_`, an unknown name or no answer from Mojang is reported in chat and nothing is written |
| **Default** | Takes the skin off, back to the plain player look |

A skin file is named by the SHA-256 of its text, so a new name makes a new file. Animus writes it, moves every NPC and trait group that wore the old file to it (an NPC's `skin`, a trait group's `values.skin` and `values.skins`) and deletes the old file, all as one change with **[Undo]**. A named skin file looks like this:

```json
{
  "textureRaw": "ewogICJ0aW1lc3RhbXAiIDog...",
  "signature": "Kd3x...",
  "label": "Notch"
}
```

`label` is optional, one line of at most 64 characters, and only names the skin in lists; NPCs and trait groups still name the skin by its hash.

### Equipment

<div class="animus-demo">
<p><strong>Equipment</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/11-equipment-ingame.webm" aria-label="Putting a helmet and your outfit on the greeter, then clearing its boots" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

**Equipment** shows what the selected NPCs hold and wear: head, chest, legs and feet down the left, then main hand, off hand, body armor and saddle on the right. A slot shows the item they share there, or "Mixed" when they differ. An empty slot shows the shape of what goes in it, such as a leather helmet for the head or an item frame for a hand.

- Hold an item and click a slot to put it there on every selected NPC, with its components. The wand is refused, so hold the item, then open the NPC's screen with `/animus tools`.
- Click a filled slot with an empty hand to clear it. It asks once more.
- **Copy my outfit** puts your hands and armor on the NPCs; your empty slots clear theirs. A wand in your main hand is not copied, so their main hand stays as it is.
- **Clear all** empties every slot and asks once more.

A slot no selected body can show is a red pane that says so; a `minecraft:player` body has no body armor or saddle slot, and a horse has only those two. Bodies that cannot show a slot are skipped. Spawned NPCs show the change as soon as it is saved.

### Hologram

**Hologram** edits the text that floats above the selected NPCs. Each NPC keeps its own lines, and a change goes to each of them by line number: an edit, move or removal acts on that line of every NPC that has it. A line that differs between them reads "Mixed"; typing it sets that text on all of them that have the line, after asking once more.

- Each line is a paper. Click one to type its text; right-click it for **Edit text**, **Move up**, **Move down** and **Remove**. `&` colour codes work.
- **Add line** adds a line at the bottom of each NPC's lines. An NPC holds up to 16 lines.
- **Saved hologram** picks a hologram file to show above the NPC as well; see [GUIs and holograms](#guis-and-holograms). With one picked, **Height** raises it 0.1 blocks per click and lowers it on a right-click, and a sneak-click types the height. Typing nothing puts it back above the head. When the NPCs differ, Height reads "Mixed" and any click types one height for all of them, after asking once more. **Remove** stops showing it.
- In Advanced, **Offset X** and **Offset Z** move the saved hologram sideways, **Above the head** clears its offset, and **More settings** opens the rest of the NPC's hologram settings, such as spacing, view range and facing.

An offset stays within 16 blocks of the NPC's feet.

## Movement

An NPC moves by a route or by a recording:

- **Route**: walks point to point. A route is points on the ground; the NPC walks from one to the next and finds its own way between them.
- **Recording**: replays what you did. A recording is your own movement, replayed exactly: steps, looks, sneaks and arm swings.

**Movement** on the NPC screen shows what the NPC does now, then **Route**, **Recording** and **Stand still**. **Stand still** asks once more, stops the NPC, takes its route or recording off and sends it back to the spot its file saves, where a walk or a replay took it from. The rest of `animus:navigation`, such as its own points and speed, stays, switched off, and **[Undo]** brings the walk back. **Help** prints both lines above with links to [routes](/animus/05-movement-mounts-riding#routes) and [recordings](/animus/19-performance-recordings#recording-a-performance).

| Advanced | Does |
|---|---|
| **Walk once** | Lists the routes; the NPC walks the one you pick now. Nothing is saved |
| **Start** | Starts the NPC's own route or recording now |
| **Stop now** | Stops the NPC where it is. Nothing is saved |
| **Movement settings** | The NPC's `movement` fields: speed, doors, water, falls and getting stuck. See [movement settings](/animus/05-movement-mounts-riding#movement-settings) |
| **Mounts and riding** | Opens [mounts and riding](#mounts-and-riding) |

### Routes

<div class="animus-demo">
<p><strong>Route settings</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/16-route-settings-ingame.webm" aria-label="Putting a route on the trader, changing its speed, order and mode, then stopping it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

**Route** lists the files in `routes/`, each with its point count and how many NPCs use it. A route whose file does not load shows a barrier and the reason.

| On a route | Does |
|---|---|
| Click | Puts it on the selected NPCs, which start walking it. It writes `modules["animus:navigation"]` as `{"enabled": true, "route": "<id>"}`, replacing the NPC's own route settings. With nothing selected, opens its details |
| Right-click | Opens its details |

To make a route by walking it:

1. Click **New route** and type its name. Animus suggests the NPC's name and `route`, such as `Bob route`. The file name is the name in lowercase with dashes for spaces, 1 to 64 letters, digits, `_` or `-`; the menus show it back as words, `Bob route`.
2. The window closes and you get the wand if you have none. Walk to each point, hold the wand and tap sneak. Each point shows as green sparks, the newest as a flame.
3. After each point, chat shows the count and its buttons: `3 points [Add] [Undo] [Save] [Cancel]`. **[Add]** drops a point where you stand without the wand. A click on one left in chat from an earlier route is refused.
4. Click **[Save]**. A route needs at least 2 points. It saves `routes/<name>.json` as a looping walk and puts it on the NPCs that were selected when you started, and their Movement screen opens. When another route took the name meanwhile, it saves under the next free number, such as `<name>-2`, and the reply names any of those NPCs that were deleted meanwhile.

While you make a route, **New route** reads **Finish route (4 points)** and opens the points. Points snap to the center of the block you stand on and stay in the world you started in; a route holds at most 256 points. **[Cancel]** drops the points; saved files stay.

### Points

**Route points** lists the points of the route you are making or editing, with their coordinates and waits. The point nearest you is marked **(here)**. Click a point to choose it; the buttons below act on the chosen point.

| Button | Does |
|---|---|
| **Add point** | Adds a point where you stand, after the chosen one |
| **Wait** | Asks for the seconds the NPC waits at the chosen point, up to 600. Typing nothing uses the route's wait |
| **Go there** | Takes you to the chosen point |
| **Move here** | Moves the chosen point to where you stand. It keeps its wait |
| **Delete point** | Asks once more, then deletes the chosen point |
| **Save** | Saves the route. A route opened with **Edit points** saves over its own file, with **[Undo]** for the old one. If the file changed since you opened it, the save is refused |
| **Discard** | Asks once more, then drops the points. Saved routes stay |

### Route details

The details of a route show its point count and the NPCs that use it. Every change goes to every NPC on the route, as its own change with **[Undo]**, and is checked as the NPCs read the route before it is saved.

| Button | Does |
|---|---|
| **Rename** | Renames the file and points every NPC that uses it at the new name |
| **Duplicate** | Copies the file under a name you type. No NPC uses the copy |
| **Edit points** | Loads the points in the world you stand in and opens **Route points**. If you are making another route, it asks once more first. A route with recording steps opens in the web editor only |
| **Loop** | Turns looping on or off. Only order **In order** loops |
| **Order** | Click for the next order, right-click for the previous: **In order**, **Back and forth**, **Random**, **Wander**. Leaving In order turns loop off |
| **Mode** | **Walk**, **Swim** or **Fly** |
| **Speed** | Click for 0.5 blocks a second faster, right-click for slower, sneak-click for ten steps. It stays within 1 to 5 |
| **Delete** | Asks once more, then deletes the file and takes the route off every NPC that uses it, as one change |

### Recordings

**Recording** lists the files in `recordings/`, each with its length and how many NPCs play it. When a selected NPC plays one, its entry says how it repeats.

| On a recording | Does |
|---|---|
| Click | Puts it on the selected NPCs. It writes `modules["animus:navigation"]` as `{"enabled": true, "recording": "<id>", "playback": "<mode>"}`, replacing any route. An NPC keeps the playback it had; otherwise it loops. With nothing selected, opens its details |
| Right-click | Opens its details |

To record:

1. Click **New recording** and type its name. Animus suggests the NPC's name and `recording`, and the menus show it as words, as routes do. A name that is taken asks once more, since the new recording replaces the old one.
2. The window closes, chat says the recording copies what you hold and wear, since the NPC wears it when it plays, and a countdown of 3 seconds runs above the hotbar, so walking out of the menu is not recorded. Where you stand then is the origin. The wand is never recorded; a hand that holds it records as empty.
3. Move. Chat shows **[Stop and save]** and **[Cancel]**.
4. Click **[Stop and save]**. The recording is saved and put on the NPCs that were selected when you started, and their Movement screen opens.

While you record, **New recording** reads **Stop and save**, and **Discard** ends the recording without saving it. In Advanced, **Show my trail** turns on the [ghost](/animus/19-performance-recordings#the-ghost) that replays your last moves while you record.

### Recording details

| Button | Does |
|---|---|
| **Rename** | Renames the file and the id inside it, and points every NPC and route step that plays it at the new name, as one change |
| **Preview** | Closes the window; a ghost only you see plays the recording once. Chat offers **[End preview]** |
| **Playback** | How the selected NPCs that play it repeat it: **Once**, **Loop** or **Back and forth**. Click for the next, right-click for the previous. Grey until a selected NPC plays the recording |
| **Delete** | Asks once more, then deletes the file and stops it on every NPC that plays it, as one change. A recording that is a step in a route is never deleted here; edit those routes in the web editor first |

### Mounts and riding

**Mounts and riding** (Advanced) acts on the first selected NPC. Its top item shows what it rides, what rides it, and any problem with the pair, such as a vehicle that does not exist.

| Button | Does |
|---|---|
| **Ride another NPC** | The window closes; the next NPC you click with the wand becomes the vehicle. Writes `modules["animus:mount"]` |
| **Carry another NPC** | The next NPC you click rides this one |
| **Pick a rider** | Click the rider, then the NPC it rides. Works with nothing selected |
| **Riding** | How players ride the selected NPCs: **Enabled**, **Permission** (`animus.ride` by default), **Speed** (0.5 to 8 blocks a second), **Leash** (4 to 256 blocks) and **Lifetime** (30 to 3600 seconds). Changes wait for **Save**, as on a [combat section](#profile-sections) |
| **Ride status** | Closes the window and runs `/animus ride status` |
| **Dismount** | Asks once more, then the NPC stops riding |

A pair is refused before anything is written when the vehicle does not exist, when an NPC would ride itself, when the pair would make a loop, when the chain would be deeper than 8, or when the vehicle already carries 16. See [mounted NPCs](/animus/05-movement-mounts-riding#mounted-npcs).

## Talk and behaviors

**Talk** opens the NPC's conversation, the lines it says and the answers players pick. When none of the selected NPCs has one, Talk makes one that says "Hello" on a right click, puts it on them and opens it. It is named after the NPC and its folder: `town:guard-talk` for `guard` in the folder `town`, `guard:talk` outside any folder. When they have one conversation, Talk opens it; with several, Talk lists them.

### Conversations

<div class="animus-demo">
<p><strong>Conversation editor</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/23-conversation-editor-ingame.webm" aria-label="Writing the greeter's conversation with one question in the block editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A conversation is a [behavior](/animus/07-behaviors) of one shape, the one the web editor's Conversation tab edits: blocks of lines, where a block can end in a question whose answers lead to other blocks. The editor shows one block at a time and keeps every key it does not edit, so a file saved here opens the same way in the web editor. Changes stay in the window until **Save**. On the first block the window is titled with the name players see on the NPC the conversation was made for, such as "Talk: Town Guard" for `town:guard-talk` on `guard`, or with the conversation's short name, "Talk: guard", when no NPC has that id. The other blocks add the block's name.

| Item | Click | Right-click |
|---|---|---|
| **Starts on** | Next start: right-click, sneak and right-click, left-click, sneak and left-click, drop key, sneak and drop key, swap hands, sneak and swap hands, walk near, or a command | Previous start |
| **Distance** | Shown for walk near: one block more, 1 to 64. Sneak-click for ten | One block less |
| **Block**, or **Start** on the first block | What leads to the block and any problem that would stop a save. On the first block it also says when a selected NPC opens a shop on the same right-click: players get both | |
| **Add line** | Asks for a line and adds it at the end of the block, above its question | |
| A line | Edit its text | Details: **Edit text**, **Insert after**, **Move up**, **Move down**, **Delete** |
| **Question** | Edit the question | Details, as for a line. Deleting it deletes its answers |
| **Choice: ...** | Follow it to what the NPC says next, making an empty block when it leads nowhere. Its lore shows that line after **Then:**; Advanced names the block after **Leads to:** | Details: **Edit label**, **Delete**. Delete also deletes the blocks only that answer reaches |
| **Add choice** | Asks for the answer players pick, then for what the NPC says back, and makes the block it leads to with that line. A block without a question gets one, "Choose one.", to edit. Up to 8 answers | |

A question is always the last step of its block, since the conversation shows it and waits for an answer: a line after it would play before any answer. Lines you add go in above it, and **Move up** and **Move down** never move the question or move a step past it. A file that has lines after its question says so on the **Block** item.

**Back** on a block an answer led to returns to the block before it; on the first block it leaves, asking once more when there are unsaved changes. **Discard** drops every change since the last save. **Save** writes the behavior with its next revision and reloads behaviors, with **[Undo]** in chat. Save is refused, with the reason, when a line or answer is empty, an answer leads to a missing block, the file changed since it was opened, or the server finds an error in the behavior.

Lines may use `{npc.name}` and `{player_name}`; a line with `{npc.name}` is saved as a template (`{{ npc.name }}`), as the web editor saves it. Conditions, actions, go-to steps and ends show as kept steps: their details move or delete them, and the web editor edits them. A wait before a line, and a sound or animation after it, show in the line's lore.

### Behaviors

**Behaviors** (Advanced, on the NPC screen and in the library) lists every [behavior](/animus/07-behaviors) file, loose under `behaviors/` and in packs. Each entry says whether it is a conversation and how many selected NPCs have it, plus how many more get it from a trait group.

| On a behavior | Does |
|---|---|
| Click | Adds it to the `behaviors` of every selected NPC. With nothing selected, opens its controls |
| Right-click | Opens its [controls](#behavior-controls) |

| Button | Does |
|---|---|
| **New conversation** | Asks for an id such as `town:greeter`, saves `behaviors/town/greeter.json` as a conversation that says "Hello" on a right click, and opens it |
| **Reload** | Runs `/animus behaviors reload` |
| **Trigger bindings** | Closes the window and lists in chat what each NPC listens for, as `/animus behaviors triggers` does |

### Behavior controls

| Button | Does |
|---|---|
| **Run** | Runs the behavior once on each selected NPC, as `/animus behaviors run npc=<id> behavior=<behavior>` does |
| **Trace** | Closes the window and prints each selected NPC's running and recent runs. Click a run in chat to inspect it |
| **Cancel a run** | Lists this behavior's runs on the selected NPCs. Click one to stop it; it asks once more |
| **Validate** | Checks the file without loading it, as `/animus behaviors validate` does |
| **Open as conversation** | Opens the conversation editor. When the file is not a conversation, it says why and that the web editor edits its nodes |
| **Remove from NPC** | Takes the behavior out of the selected NPCs' own `behaviors`. An NPC that gets it from a trait group keeps it; change the trait group to remove it there |

The replies are the commands' own.

## Shops

<div class="animus-demo">
<p><strong>New shop</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/26-new-shop-ingame.webm" aria-label="Making the plaza:stall shop on the trader and stocking it with bread" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

**Shop** lists the files in `shops/`, each with its offer count and how many selected NPCs use it; a shop no NPC or trait group opens says "on no NPC". A shop file that does not load shows its first problem in red.

| On a shop | Does |
|---|---|
| Click | Puts it on every selected NPC: writes `modules["animus:shop"].shop` and keeps the NPC's other shop settings. When a selected NPC opens another shop, it asks once more and names the shop it replaces. With nothing selected, opens its details |
| Right-click | Opens its details |

**New shop** asks for a name, such as `Bakery`, puts the new shop on the selected NPCs and opens its details. The shop and the NPCs are saved as one change, so one **[Undo]** takes both back. The name becomes the shop's title and, in lowercase, its id, in the folder of the first selected NPC: `Bakery` for an NPC in `town` is `town:bakery`, for `guard` outside any folder `guard:bakery`, and with nothing selected `shops:bakery`, numbered when that is taken. A typed id such as `town:baker` is used as it is. The shop starts with one empty page. In Advanced, **Reload** runs `/animus shop reload`. When a selected NPC also has a conversation that starts on the right-click that opens its shop, the list says so: players get both.

A setting in the details shows the value the selected NPCs that use the shop share, or "Mixed" when they differ. It changes every selected NPC that uses it, and is grey with "Put it on an NPC first" until one does. From Mixed, a click sets all of them to the first choice and a right-click to the last, after asking once more.

| Button | Does |
|---|---|
| **Add held item** | Asks for a price, 0 or more, and adds the item in your main hand as an offer players buy, in the first free slot of the first page, as [`/animus shop stock`](/animus/10-shops#stocking-a-shop-in-game) does. The question is titled with the money the economy names, such as "Price in Dollars", "Price ($)" for a symbol only, or "Price" when it names none, and its hint shows the economy's own text for 2: "One number; 2 reads as $2.00". The reply names the offer, such as `Added Bread for $5.00`. With no economy plugin, or `[shops] economy = "none"`, the button and the question say "No economy plugin, so players cannot pay", and the offer is still added. The wand and an empty hand are refused, so hold the item, then open the NPC's screen again with `/animus tools` |
| **Offers** | Lists the offers, each with its price such as "Players buy it for $5.00". Click one to take it out; it asks once more, and **[Undo]** puts it back |
| **Open** | Closes the window and opens the shop for you as an NPC's click opens it, in that NPC's window style and villager look: the first selected NPC that uses the shop, else the first NPC that does. Its lore names that NPC. With no NPC on it, the shop's own style |
| **Window style** | **Chest window**, **Villager trades** or **Shop default**, the shop's own `style`. Writes `style`, or removes it for Shop default |
| **Opens on** | **Right-click**, **Left-click** or **Both clicks** |
| **Profession**, **Level** | Shown when a selected villager uses the shop. Profession cycles the villager professions; level steps from 1, novice, to 5, master. Other bodies ignore them |
| **Reset stock** | Asks once more, then runs `/animus shop reset <shop>`, clearing limits and stock for everyone |
| **Remove from NPC** | Takes the shop off the selected NPCs |
| **Delete** | Asks once more, then deletes the file; **[Undo]** brings it back. Grey while any NPC or trait group uses the shop |

Choices such as Window style move to the next value on a click and to the previous on a right-click. Prices read as the server's economy writes them, such as `$5.00` or `5 Coins`; while no economy is ready, `[shops] priceFormat` writes them. See [money](/animus/10-shops#money).

## Combat

**Combat** changes every selected NPC. Each control saves at once, with **[Undo]** in chat. With several NPCs, a switch reads "on for 2 of 3" when they differ, **Attacks** and **Health** read "Mixed", and **Guard me** reads "Mixed" when some of them guard someone else.

| Control | Does |
|---|---|
| **Fights** | Turns `enabled` in `modules["animus:combat"]` on, or off; the rest of the settings stay |
| **Attacks** | Who it attacks: **Monsters**, **Players**, **Monsters and players** or **Nobody**. Writes the `targets` list. Rules that none of these describe read **Custom**, and picking one replaces them after asking once more |
| **Can be hurt** | Turns `killable` in `animus:health` on or off |
| **Health** | Maximum health: click adds 2, right-click takes 2 off, sneak-click types a value from 1 to 2048. Typing nothing goes back to the default. When the NPCs differ it reads "Mixed" with the lowest and highest, and any click types one value for all of them, after asking once more |
| **Guard me** | Saves you as the player each NPC guards. Click again, when they all guard you, to stop. Taking NPCs off another player or NPC they guard asks once more and says how many. To guard an NPC instead, use the Guard section |
| **Mobs can attack it** | Turns `targetableByMobs` on or off |

Advanced adds three rows:

- **Rules**: **Targets**, **Ignores** and **Avoids** open the [rule list](#rule-lists) of that name.
- **Live**: **Status**, **Engage**, **Disengage**, **Release** (back to its own rules), **Guard me now** and **Server status** run `/animus combat` for each selected NPC. They change nothing on disk, and the reply comes as chat. **Guard me now** makes the NPCs guard you until they are released; a right-click stops them guarding.
- **Settings**: **Targeting**, **Avoidance**, **Squad**, **Guard**, **Pursuit**, **Melee**, **Ranged** and **Greetings** open that [section](#profile-sections). Health, drops and respawn are in `animus:health` on the [modules](#modules) screen.

With several NPCs, the rule lists and sections show the first one's values, and **Save** sets all of them.

### Profile sections

Each row is one setting, with the description the web editor shows as its tip. A value the NPC does not set shows the value combat runs with, and says it is the default. Times read and type in seconds.

| Kind of setting | Click | Right-click | Sneak-click |
|---|---|---|---|
| On or off | Turn on or off | Turn on or off | Turn on or off |
| Number | Add one step | Take one step off | Type a value; nothing resets it |
| Choice, such as `ranged.weapon` | Next | Previous | Next |
| Text, such as `squad.name` | Type a value; nothing clears it | Type a value | Type a value |
| `guard.player` | Set to you | Clear | Set to you |
| `guard.npc` | Click an NPC with the wand | Clear | Click an NPC with the wand |
| `avoidance.returnPoint` | Set to where you stand | Clear | Set to where you stand |
| `melee.weaponDamage` | Type a damage for the item in your main hand | List the items; click one to remove it | Type a damage |
| A setting with settings inside, such as `ranged.effect` | Open it | Open it | Open it |

Setting `guard.player` clears `guard.npc`, and the other way round. Changes wait for **Save**, which writes the changed rows to every selected NPC as one change, checked the way combat reads them; a combination combat refuses, such as a `potion` weapon without an `effect`, is refused whole and the chat line names the field. **Discard** drops the changes. A changed row reads "(not saved)". Editing a section does not turn combat on.

### Rule lists

Targets, Ignores and Avoids each show the kinds of rule the list can hold.

| Row | Click | Right-click | Sneak-click |
|---|---|---|---|
| Players, NPCs, Mobs, Monsters, Animals | Turn on or off | Turn on or off | Turn on or off |
| Owner | Turn on or off | Turn on or off | Turn on or off |
| Health above, Health below | Turn on at 50%, then add 5% | Take 5% off | Type a percent; nothing turns it off |
| Mob types, Players by name, Mobs by custom name, Squads, Permissions, Permission groups, Effects, Chat words, and the name patterns | Type an entry | List the entries; click one to remove it | Type an entry |
| NPCs by id | Type an id | List the entries, with **Pick an NPC** to click one with the wand | Type an id |
| Main-hand item, Off-hand item, Worn item | Type an item id pattern | List the entries, with **Add held item** | Type a pattern |

Each entry is checked as it is added, so a broken pattern or an unknown effect id is refused with the reason and left out. Ignores has no chat words. Match-all sets, together sets and fight events show with their count and are kept as they are; edit them in the [web editor](/animus/14-web-editor).

The item at the right end of the row under the list shows the list the way the file reads, such as `monsters; players: Steve; healthBelow: 50`. **Save** writes it to every selected NPC as one change. An empty list removes the key.

## Advanced editors

These screens show every setting as the NPC's file has it. They open from the NPC screen in Advanced.

### All fields

**All fields** opens the NPC's settings by section. The rows come from the NPC schema, so each row's lore is the description the web editor shows as a tip, and the raw key is in dark grey under it. Each change saves at once with **[Undo]**.

| Button | Opens |
|---|---|
| **Identity** | Name, spawned, owner, tags, behaviors and trait groups |
| **Body settings** | Pose, baby, glowing, team color, using item, listed, gravity, inventory size, the named look directions in `poses`, and the settings of the NPC's own body, such as `armorStand` or `horse` |
| **Position** | World, x, y, z, yaw and pitch |
| **Appearance** | Hologram, nameplate, rig, disguise, boss bar, viewers and click redirect |
| **Movement** | Every field of `movement`, including getting stuck |
| **Attributes**, **Modules** | [Attributes](#attributes) and [modules](#modules) |
| **Id** | Asks for a new id, renames the file in the same folder, and keeps the screen on the NPC |
| **Body** | Opens [Body](#body) |

With several NPCs selected, a change applies to all of them as one change: the field changes on each NPC and the rest of each file stays as it was. A list edit that adds or removes entries adds or removes those entries on each NPC. The id and position change on the first NPC only. A change that would make any NPC invalid is refused whole, nothing is saved, and the chat line says which field is wrong.

### Fields

<div class="animus-demo">
<p><strong>Edit fields</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/08-edit-fields-ingame.webm" aria-label="Renaming the greeter, bringing it over and turning its glow on" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Every row shows its description, its value, or the default when the file leaves it out, and what each click does.

| Field | Click | Right-click | Sneak-click |
|---|---|---|---|
| On or off (lime or grey dye) | Turn on or off | Turn on or off | Turn on or off |
| Options, up to 8 (book) | Next option | Previous option | Next option |
| Options, more than 8 (book) | Pick from a list you can search | Pick from the list | Pick from the list |
| Number (clock) | Add one step | Take one step off | Type a value; nothing resets it |
| Text (paper) | Type a value; nothing resets it | Type a value | Type a value |
| Text with suggestions | Pick a suggestion, or **Type a value** | Pick or type | Pick or type |
| List (bundle), map or object (chest) | Open it | Open it | Open it |
| One item, such as a health drop's `item` | Put the item in your main hand there | Clear it | Put the held item there |

A step is the schema's `multipleOf`, else 1 for whole numbers, else 0.05, 0.1 or 1 depending on the field's range. A tick field reads and types in seconds. Numbers stay within the schema's bounds; a typed number outside them is refused before anything is saved. **Reset a field** lists the fields the file sets and resets the one you pick. **Reset**, at the right end of the row under the fields, removes the whole object, such as all of `movement`, after asking once more.

In a list, such as tags, behaviors or health drops, a click retypes a text entry, steps an option entry or opens an object entry; a right-click opens the entry's details with **Move up**, **Move down** and **Remove**. **Add an entry** asks for the text, offers the options or, for an object, asks for its first required text field. A list of fixed length, such as an armor stand's `[x, y, z]`, keeps its length: its entries are number rows. A map, such as `poses` or a melee weapon's `weaponDamage`, lists its entries by name; **Add an entry** asks for the name and **Remove an entry** picks one to take out.

Items in a list, such as a stored inventory, say that the Equipment screen sets items. A field of any other shape says to edit it in the web editor.

### Attributes

<div class="animus-demo">
<p><strong>Attributes</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/09-attributes-ingame.webm" aria-label="Growing and shrinking the greeter with the scale attribute, then resetting it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Lists every vanilla [attribute](/animus/04-npc-definitions#attributes) the NPC's body carries, the common ones first, each with its value or the vanilla default. A click adds a step within the attribute's bounds, a right-click takes one off, and a sneak-click types a value. Typing nothing goes back to the vanilla default. A value saved as `minecraft:<id>` keeps that spelling.

### Modules

Lists the NPC's modules, each with whether it is on. Click one to open its fields, with an **On** or **Off** switch at the left end of the row under them. A module with an `enabled` field turns off by setting it to false, which keeps its settings; the `animus:health` switch sets `killable`. Shop and GUI have no switch of their own: they are on while their settings exist, so **Remove settings** turns them off, after asking once more.

### Folders

<div class="animus-demo">
<p><strong>Folders</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/12-folders-ingame.webm" aria-label="Moving the greeter and trader between folders, making plaza and renaming it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A folder is where an NPC's file is kept under `npcs/`. It only sorts files and changes nothing in game. **Folder** lists **Top level** and every folder that holds NPCs, with how many NPCs sit in each and how many more are in the folders below it.

| On a folder | Does |
|---|---|
| Click | Moves every selected NPC into it |
| Right-click | Opens its details, with **Rename**, which asks for a new name and moves every NPC in the folder, and in the folders below it, to that name. Top level cannot be renamed |

A folder exists only while an NPC file is in it, so **New folder** asks for a name, such as `town/market`, and moves the selection into it. It needs a selection. Moving more than 20 NPCs, or renaming a folder that holds more than 20, asks once more. A rename to a folder that already holds NPCs merges them into it.

### Trait groups

**Trait groups** lists every [trait group](/animus/18-trait-groups) with its description or member count, and how many selected NPCs have it.

| On a trait group | Does |
|---|---|
| Click | Puts it on every selected NPC. With nothing selected, opens its details |
| Right-click | Opens its details |

**New trait group** asks for an id (lowercase letters, digits, `_` and `-`, up to 64), saves `groups/<id>.json` with no values, and puts it on the selection as one change. With nothing selected it only saves the file.

### One trait group

| Button | Does |
|---|---|
| **Members** | Lists the NPCs that have it. Click one to select only it; right-click one to add it to the selection or take it out, edit it, or take it out of the trait group. **Select all members** replaces the selection with them |
| **Values** | Opens the field editor on the NPC fields the trait group sets. Each change saves the file's `values`, refused if any member would become invalid |
| **Rename** | Asks for the new id, saves the file under it, removes the old file and points every member at the new id, as one change. Each member keeps its order of trait groups |
| **Description** | Asks for the text. Typing nothing removes it |
| **Remove from NPC** | Asks once more, then takes the trait group off the selected NPCs that have it |
| **Delete** | Asks once more, then deletes the file and takes the trait group off every member, as one change |

Every change here is checked before it is saved: the trait group file must be valid and every member must still make a valid NPC. **[Undo]** reverts the trait group file and every member together.

## GUIs and holograms

**GUIs** (Advanced, on the NPC screen and in the library) has a tab each for chest GUIs (`gui/inventories/`), menus (`gui/menus/`) and text animations (`gui/text-animations/`), chosen in the row under the list; it opens on chest GUIs. Each entry shows its title, its file and how many selected NPCs use it. **Reload** runs `/animus gui reload`. The layouts are drawn in the [web editor](/animus/14-web-editor#gui-editors).

| On a chest GUI or menu | Does |
|---|---|
| Click | Opens it from a click on each selected NPC: writes `modules["animus:gui"].open` with its kind and id, keeping the click that opens it. With nothing selected, opens its details |
| Right-click | Opens its details |

A text animation opens its details on any click. The details have **Show to me**, which opens a chest GUI or menu for you, **Opens on** (**Right-click**, **Left-click** or **Both clicks**; "Mixed" when the selected NPCs differ, set as on a shop), **Remove from NPC**, and **Delete**, which asks once more and is grey while anything uses the file. An NPC opens one GUI at a time; a new one replaces the old.

**Holograms** in the library lists the saved holograms in `gui/holograms/`, made in the web editor or with `/animus hologram create`. The same list opens from **Saved hologram** on an NPC's [hologram](#hologram). A click shows the hologram above the selected NPCs; a right-click, or any click with nothing selected, opens its details, with **Use it** and **Delete**. Delete works once no NPC or trait group shows the hologram.

## Library

In Advanced, Home has a row for everything saved on the server: **Folders**, **Behaviors**, **Shops**, **Routes**, **Recordings**, **Holograms**, **GUIs**, **Skins** and **Trait groups**. Each opens the same list the NPC screen opens. A click puts an entry on your selection as it does there; with nothing selected, a click opens the entry's details.

## Rules every screen follows

- **One click rule.** A click does the main thing. A right-click opens details or steps a value back. A sneak-click types a value on a number row, and adds or removes an NPC in the NPCs list. Nothing that deletes or saves sits on a right-click or sneak-click. In Simple a tooltip is at most four lines; a longer one puts its click and right-click on one line. Every button's lore ends with what each click does, such as `Click: open`.
- **Bottom row.** The last row only moves you around: **Back** (Home has **Close**), **Search**, the page arrows and page count, **Discard**, **Save** or **Mode**, and **Help** at the right end.
- **Lists.** A list shows 36 entries a page. The row under it holds the list's own buttons, such as **New route**. **Search** asks for text and shows the entries whose name contains it; click it again to clear. A sneak-click on a page arrow jumps to the first or last page.
- **Asking once more.** A button that deletes something, or changes more than 20 NPCs, turns red and reads "Click again to confirm", with what it will do. A second click on it runs it; any other click cancels.
- **Save and Discard.** The combat sections, rule lists, riding settings and conversations collect changes. **Save** is green while there are changes and reads **Saved** in grey when there are none. **Discard** drops them. **Back** with unsaved changes asks once more.
- **Help.** The paper at the right end of the bottom row explains the screen in chat, with a **[Wiki]** link to the page that covers it. The window stays open.
- **Results.** After a change the screen redraws with the new values. A refusal shows in red in chat and on the bottom row of the window until your next click. Buttons that answer in chat, such as **Inspect**, say "Shows in chat" and close the window. A screen for the selected NPCs goes to the NPCs list, or to Home when no NPC is left, once all of them are gone, such as after another player deletes them.
- **Sounds.** A handled click makes a quiet tick. A refusal plays a low tone.

### Typing text

Buttons that need a name, a number or a line of text hide the window and ask for one line. When you answer, the window comes back where you left it and the change runs.

The question opens as an anvil titled with what it asks for. The left slot holds a paper named with the current value, or nothing when there is none. Edit the name in the anvil's text field, then click the paper in the result slot, whose lore reads "Click to confirm". No experience is spent and no item moves: the paper never reaches your inventory. On Paper, Spigot and Folia the anvil shows no cost.

| To | Do |
|---|---|
| Answer | Edit the name and click the result paper |
| Cancel | Close the anvil (Escape), type `cancel` as the name, leave the server or die |

A cancelled question brings the window back and says "Cancelled; nothing changed".

If the server cannot open an anvil for you, the question goes to chat instead: the chat line says what to type and the current value, when there is one, and your next chat message is the answer. That message is not sent to other players. Type `cancel` to cancel. Answers are trimmed of spaces at both ends. The same anvil and chat questions work on Paper, Spigot, Folia, Fabric, NeoForge and Forge.

## Permissions

Every screen and the wand need `animus.tools`. A screen or button that changes something also needs the node of what it changes. A screen you lack the node for does not open, and nothing is read or written for it. On Home, the NPC screen, **Movement** and **Hologram**, a button you lack the node for is grey and reads "No permission" with the node to ask for. The node is checked again on every click, so taking a node away works at once: the click is refused with the node. `animus.admin` grants them all; see [permissions](/animus/02-commands-permissions#permissions).

| Node | In the menu |
|---|---|
| `animus.npc.view` | **Inspect** |
| `animus.npc.create` | **New NPC**, **Copy** |
| `animus.npc.edit` | **Name**, **Body**, **Equipment**, **Hologram**, **Spawned**, **Revive**, **All fields**, **Attributes**, **Modules**, **Movement settings**, **Folder** and **Folders**, **Trait groups**, **Mounts and riding** and its **Riding** settings |
| `animus.npc.delete` | **Delete** |
| `animus.npc.skin` | **Skin** and the skins list |
| `animus.npc.move` | **Bring here**, **Stand still**, **Walk once**, **Start**, **Stop now**, routes and route points |
| `animus.record` | Recordings |
| `animus.behaviors` | **Talk**, the conversation editor, **Behaviors** |
| `animus.shops` | **Shop** and the shops list |
| `animus.gui` | **GUIs**, saved holograms, and a saved hologram on **Hologram** with its height and offsets |
| `animus.combat` | **Combat**, its sections and rule lists |
| `animus.editor.pair` | **Web editor**, **Open in editor** |

`/animus undo` and **[Undo]** need `animus.tools` and the node of the change they revert; see [undo](/animus/02-commands-permissions#status-and-npc-management).

## Left to the web editor

Every NPC definition field has either a menu screen or a line in this table.

| Field | Why |
|---|---|
| `uuid`, `revision`, `schemaVersion` | Animus writes them |
| Items in a stored inventory (`inventory.slots`), hire cost items | **Equipment** sets worn and held items |
| Hologram line margins | **Hologram** changes a line's text and keeps its margins |
| A route's own wait, and any wait written as `[min, max]` | **Wait** sets one point's wait in seconds |
| A route's `style`, `jitter`, `seed`, `startOffset`, `guides`, `linkDistance` and `wander`; a point's `jitter`, `weight`, `speed`, `teleport`, `style` and junctions | Kept when you edit a route's points in game |
| Recording steps in a route's `points` | A route with recording steps does not open in **Route points** |
| Combat `all` sets, `together` sets and fight `events` | Shown with their count and kept; single rules are edited in game |
| Import leftovers such as `preservedSettings` | Kept and never read |
| Behavior node graphs other than conversations; inside a conversation, conditions, actions, go-to steps, a line's wait, sound and animation, answer colours and hover text | The conversation editor moves and deletes those steps but does not edit them |
| Chest GUI layouts, menus, saved hologram lines, text animation frames | Drawn in the web editor |
| An offer once it is in a shop: its price, limits and other fields; `sell` and `trade` offers | **Add held item** adds offers players buy and **Offers** removes offers. `/animus shop stock` adds sell and trade offers |
| `animus:gui.open` kinds `shop` and `gloss` | **Shop** puts shops on NPCs through `animus:shop` |
| Rig keyframes; a recording's description, tags, speed and own playback | Rig and recording files are written, not toggled |
