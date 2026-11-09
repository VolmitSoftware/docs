---
title: "Animus: In-Game Toolkit"
description: "Chest-GUI screens and a selection wand that edit NPCs, groups, routes, behaviors, shops and skins without leaving the game"
published: true
date: 2026-11-07T00:00:00.000Z
tags: "animus, gui, tools, wand, selection"
editor: markdown
dateCreated: 2026-11-07T00:00:00.000Z
---

The toolkit edits NPCs from chest windows. Pick NPCs with a wand, then open `/animus tools`: every field of an NPC, its skin, equipment, combat profile, mounts, routes, recordings, trait groups, folders, behaviors, shops and GUIs have a screen, and a new NPC or a new conversation starts from a typed id. The same screens open on Paper, Spigot, Folia, Fabric, NeoForge and Forge. Every change is one transaction, so its chat line carries the transaction id and **[Undo]**; a delete, and any change to more than 20 NPCs, asks twice.

What the toolkit does not do is paint: behavior node graphs other than conversations, chest GUI layouts, hologram lines, rig keyframes and shop offers are drawn in the [web editor](/animus/14-web-editor). The list at the end of this page says exactly which fields that leaves.

| Command | Effect |
|---|---|
| `/animus tools` | Open the tool palette. Same as `/animus tools open` |
| `/animus tools wand` | Put a selection wand in your inventory |
| `/animus tools manage` | Open the manage screen for your selection |

All three need `animus.admin` and a player. Every item in a toolkit window says in its lore what a left click, a right click and a sneak click do. **Back** sits at the start of the bottom row of every screen; on the palette, **Close** does.

## The wand

<div class="animus-demo">
<p><strong>Wand and selection</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/03-wand-selection-ingame.webm" aria-label="Selecting two NPCs with the wand" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The wand is a blaze rod named **Animus wand**. The server knows it by a marker on the item, not by its name, so renaming it keeps it a wand and a renamed blaze rod is not one. On Paper, Spigot and Folia the marker is the persistent data key `animus:tool` with the value `wand`; on mod servers it is the same key in the item's `minecraft:custom_data`.

| With the wand in your main hand | Does |
|---|---|
| Click an NPC | Select only that NPC |
| Sneak and click an NPC | Add it to the selection, or remove it |
| Tap sneak during a route capture | Drop a route point where you stand |
| Click an NPC while a screen asks for one | Answer the screen (a mount's vehicle, a guard's NPC, an NPC to edit) |

The last NPC you add also becomes your `@selected` NPC, so commands that take `@selected` act on it. While you have a selection, small particles mark the corners of each selected NPC within 48 blocks; only you see them. Clearing the selection or leaving the server stops them. The selection holds at most 256 NPCs and is forgotten when you leave.

Without the wand, a click on an NPC opens its shop, GUI or hire window as usual and never changes the selection.

## Palette

<div class="animus-demo">
<p><strong>Tool palette</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/04-palette-ingame.webm" aria-label="Hovering each tool in the palette" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

`/animus tools` shows five rows. The top item is the selection count: left opens the [Selection](#selection) screen, right opens [Manage](#manage), sneak clears the selection. The rows below group the tools.

| Row | Buttons |
|---|---|
| The NPCs | **Animus wand**, **New NPC**, **Find**, **Manage**, **Edit**, **Folders**, **Trait groups** |
| Look and movement | **Skins** (right-click puts your own skin on the selection), **Equipment**, **Combat**, **Mounts**, **Routes** (right-click drops a route point here, sneak removes the last), **Recordings** |
| What they open and run | **Behaviors**, **Shops**, **GUIs** |

### New NPC

<div class="animus-demo">
<p><strong>New NPC</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/06-new-npc-ingame.webm" aria-label="Making an NPC named greeter from the palette" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Asks for an id, saves `npcs/<id>.json` two blocks in front of you, facing you, with you as its `owner`, selects it and spawns it, all in one transaction; the reply names the file. The id is 1 to 64 lowercase letters, digits, `_` or `-`; a taken id is refused and nothing is written. Right-click asks for the body type first, such as `minecraft:villager`; sneak-click saves the NPC dormant so you can finish it before it shows. The NPC's world is the name your other NPCs' positions use, so the file matches them.

## Manage

<div class="animus-demo">
<p><strong>Manage and undo</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/13-manage-undo-ingame.webm" aria-label="Cloning and deleting an NPC, then undoing the delete" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The manage screen acts on the whole selection.

| Button | Does |
|---|---|
| Spawn | Checks that each NPC can run on this server, then spawns them in one transaction |
| Despawn | Despawns them; the definitions stay |
| Clone | Saves dormant copies named `<id>-copy`, numbered when that id is taken |
| Delete | Asks first: the first click arms it and the button turns red, the second click deletes. Any other click disarms it. One transaction, so **[Undo]** brings every NPC back |
| Teleport to it | Shown when one NPC is selected |
| Inspect | Closes the window and prints what `/animus inspect` prints for the first selected NPC |
| Open in editor | Closes the window and sends a pairing link for the [web editor](/animus/14-web-editor), the same as `/animus editor pair` |
| Revive | Brings each dead NPC back at full health, the same as `/animus npc revive`: a permadeath is cleared, and an NPC waiting to respawn comes back at once |
| Edit, Equipment, Combat, Mounts, Skin, Trait groups, Folder, Route, Behaviors | Open those tools on the selection |
| Clear selection | Empties the selection |

## Typing text

Buttons that need a name or a label, such as **From a player name** and renaming a skin, hide the toolkit window and ask for one line of text. When you answer, the window comes back where you left it and the change runs.

The question opens as an anvil titled with what it asks for. The left slot holds a paper named with the current value, or nothing when there is none. Edit the name in the anvil's text field, then click the paper in the result slot. No experience is spent and no item moves: the paper never reaches your inventory. On Paper, Spigot and Folia the anvil shows no cost.

| To | Do |
|---|---|
| Answer | Edit the name and click the result paper |
| Cancel | Close the anvil (Escape), type `cancel` as the name, leave the server or die |

A cancelled question brings the window back and says "Cancelled; nothing changed".

If the server cannot open an anvil for you, the question goes to chat instead: the chat line says what to type, and your next chat message is the answer. That message is not sent to other players. Type `cancel` to cancel. Answers are trimmed of spaces at both ends.

The same anvil and chat fallback work on Paper, Spigot, Folia, Fabric, NeoForge and Forge.

## Selection

The **Selection** screen lists the selected NPCs in the order you picked them. Each entry shows the NPC's folder, body type, trait groups and whether it is active.

| Click on an NPC | Does |
|---|---|
| Left | Teleports you to it |
| Right | Removes it from the selection |
| Sneak | Makes it the only selected NPC |

The bottom row builds the selection in bulk. Each of these replaces the selection, which holds at most 256 NPCs; the chat line says how many were left out.

| Button | Does |
|---|---|
| Select all in my world | Selects every active NPC in your world. Asks once more when that is over 20 NPCs |
| Select by tag | Asks for a tag and selects every NPC that has it, including tags that come from trait groups |
| Select by folder | Opens the folder list; selects the NPCs directly in the folder you pick |
| Invert in folder | Opens the folder list; in the folder you pick, selected NPCs leave the selection and the others join it. NPCs in other folders stay as they are |
| Clear | Empties the selection |

The selection button in the bottom row of the trait group and folder screens opens this screen too.

## Edit NPC

**Edit** opens "Edit <id>" for the selected NPCs, or for one NPC you pick with **Choose an NPC** and a wand click. The fields come from the NPC schema, so every field's lore is the same description the web editor shows as a tip. Each change is saved at once as one transaction, and its chat line carries **[Undo]**.

| Button | Opens |
|---|---|
| Identity | `id`, `name`, `type`, `spawned`, `owner`, `tags`, `behaviors`, `groups` |
| Body | `pose`, `baby`, `glowing`, `teamColor`, `usingItem`, `listed`, `gravity`, `inventory.size`, the named look directions in `poses`, and the settings of the NPC's own body type (`armorStand`, `horse`, `llama`, `frog`, `armadillo` or `dragon`) |
| Position | `world`, `x`, `y`, `z`, `yaw`, `pitch` |
| Use where I stand | Moves the NPC to you and saves the place |
| Appearance | `hologram`, `nameplate` and the `rig` id. The lore shows the skin; the Skins screen changes it |
| Movement | Every field of `movement`, including `stuck` |
| Attributes | The vanilla attributes the body carries |
| Modules | A switch and an Edit button per module |

### Fields

<div class="animus-demo">
<p><strong>Edit fields</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/08-edit-fields-ingame.webm" aria-label="Renaming the greeter, toggling its glow and moving it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Every field button shows its description, its value now (or that the default applies) and what each click does.

| Field | Left | Right | Sneak |
|---|---|---|---|
| On or off (lime or gray dye) | Turn on or off | Turn on or off | Remove the key, so the default applies |
| Options, up to 8 (book) | Next option | Previous option | Remove the key |
| Options, more than 8 (book) | Pick from a list | Pick from a list | Remove the key |
| Number (clock) | Add one step | Subtract one step | Left: type a value. Right: remove the key |
| Text (paper) | Type a value in chat | Type a value in chat | Remove the key |
| Text with suggestions, such as `type` | Next suggestion | Type a value in chat | Remove the key |
| List (bundle) or object (chest) | Open it | Open it | Remove it |

A step is the schema's `multipleOf`, else 1 for whole numbers, else 0.05, 0.1 or 1 depending on the field's range. Numbers stay within the schema's bounds. A typed number outside them is refused before anything is saved. Typing nothing into a text prompt removes the key.

In a list (tags, behaviors, groups, hologram lines, health drops, respawn points), a left click retypes a text entry, cycles an option entry or opens an object entry. Right removes the entry, sneak-left moves it up and sneak-right moves it down. **Add an entry** asks for the text, offers the options or, for an object, asks for its first required text field. A list of fixed length such as an armor stand's `[x, y, z]` keeps its length: its entries step like numbers and sneak-right resets the whole list. Maps such as `poses` and a melee weapon's `weaponDamage` list their entries by name; **Add an entry** asks for the name.

A field the toolkit cannot edit says so in its lore: items say the Equipment screen sets them, and other shapes say to edit them in the web editor.

### Attributes

<div class="animus-demo">
<p><strong>Attributes</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/09-attributes-ingame.webm" aria-label="Growing and shrinking the greeter with the scale attribute" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Lists every vanilla attribute the NPC's body carries, each with its own icon, with its value or "vanilla default". Left and right step within the attribute's bounds, sneak-left types a value and sneak-right goes back to the vanilla default. A value saved as `minecraft:<id>` keeps that spelling.

### Modules

Each module has a switch with an Edit button below it. A module with an `enabled` field turns off by setting it to false, which keeps its settings. Shop and GUI have no switch of their own: they are on while their object exists, so turning one off removes it and asks twice, and turning one on opens its fields. Edit opens every field of the module, combat's target, ignore and avoid rules included.

### Several NPCs

With more than one NPC selected, a change applies to all of them in one transaction: the field changes on each NPC and the rest of each file stays as it was. A list edit that adds or removes entries adds or removes those entries on each NPC. `id` and position change on the first NPC only. A change to more than 20 NPCs asks twice: the button turns red and the same click applies it. NPCs the change leaves as they were are counted as unchanged.

### Checks and renames

A change that would make any NPC invalid is refused whole, nothing is saved and the chat line says which field is wrong. A new `id` renames the file in the same folder and the screen follows the NPC. A new `type` drops the settings only another body can have, such as `armorStand`, and a pose other than standing on a body that is not a player.

## Skins

<div class="animus-demo">
<p><strong>Skins</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/10-skins-ingame.webm" aria-label="Putting three skins on the greeter and relabelling one" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Lists the skin files in `skins/`. Each entry shows the skin's label, or when it has none the first NPC or trait group that wears it, then every NPC and group wearing it and the first 12 characters of its hash.

| On an entry | Does |
|---|---|
| Click | Put that skin on every selected NPC and save their `skin` field |
| Right-click | Ask for a new label; an empty answer removes the label |
| Sneak-click | Delete the skin file. Asks once more: the entry turns red and a second sneak-click deletes it, any other click cancels. A skin an NPC or group wears is never deleted; the chat line names who wears it |

A skin file is named by the SHA-256 of its text, so a new label makes a new file. Animus writes it, moves every NPC and trait group that wore the old file to it (an NPC's `skin`, a group's `values.skin` and `values.skins`) and deletes the old file, all in one transaction with **[Undo]**. The web editor does the same when you change a skin's arm model, and it shows the label in its skin picker and on the skin's page.

| Button | Does |
|---|---|
| **Use my skin** | Saves your own signed skin as a skin file and puts it on the selection. Offline-mode servers have no signed skins, so it says so |
| **From a player name** | Asks for a Minecraft name, looks up that account's signed skin on Mojang's servers, saves it with the account's name as its label and puts it on the selection. With nothing selected it only saves the file. The lookup needs internet access from the server, not online mode, so it also works on offline-mode servers. An unknown name, a name that is not 1 to 16 letters, digits or `_`, or no answer from Mojang is reported in chat and nothing is written |
| **Remove skin** | Takes the skin off the selection |

A skin file with a label looks like this:

```json
{
  "textureRaw": "ewogICJ0aW1lc3RhbXAiIDog...",
  "signature": "Kd3x...",
  "label": "Notch"
}
```

`label` is optional, one line of at most 64 characters, and only names the skin in lists; NPCs and groups still refer to the skin by its hash.

Skins only show on `minecraft:player` bodies. Other bodies in the selection are skipped and the chat line counts them.

## Equipment

<div class="animus-demo">
<p><strong>Equipment</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/11-equipment-ingame.webm" aria-label="Putting a helmet, a sword and an outfit on the greeter" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The eight slots of the first selected NPC in a row: main hand, off hand, head, chest, legs, feet, body and saddle. A slot with an item shows that item; an empty slot is a glass pane with the slot's name.

| Click on a slot | Does |
|---|---|
| Left | Puts the item in your main hand into the slot, components included |
| Right | Clears the slot |
| Sneak-left | Copies your main hand, off hand and armor onto the NPC; your empty slots clear theirs |

**Copy your outfit** does the same as a sneak-left. **Clear all** empties every slot and asks first.

Slots the body cannot show are red panes whose lore says which slots it shows; a `minecraft:player` body has no body or saddle slot, a horse only has those two. Clicking one says so and changes nothing.

**Bulk** makes every click change the whole selection instead of the first NPC. Bodies that cannot show the slot are skipped and the chat line counts them. Above 20 NPCs, the same click on the same slot has to come twice. Each change is one transaction, and active NPCs show it as soon as it is saved.

## Combat

Acts on the whole selection and shows the first selected NPC's values. Every file change is one transaction for all selected NPCs, and a change to more than 20 asks twice.

| Button | Does |
|---|---|
| Enable combat | Writes `"enabled": true` in `modules["animus:combat"]`. On an imported NPC it also writes `"reviewAccepted": true`, and the chat line says how many imports it accepted |
| Disable combat | Removes `enabled`; the rest of the profile stays |
| Targetable by mobs | Turns `targetableByMobs` on or off |
| Targets, Ignores, Avoids | Open the rule list of that name. The lore lists the rules the first NPC has |
| Status | Left runs `/animus combat status npc=<first NPC>`, right runs `/animus combat status` for the server |
| Engage, Disengage, Release | Run `/animus combat engage`, `disengage` or `release` for each selected NPC |
| Guard me | Left makes each selected NPC guard you for now (`/animus combat guard <npc> <you>`); right stops it. To save a guard, use the Guard section |
| Targeting, Avoidance, Squad, Guard, Pursuit, Melee, Ranged, Greetings | Open that section of the profile. Health, drops and respawn are in `animus:health` on the Modules screen |

The live buttons change nothing on disk; the command's reply comes as chat.

### Profile sections

Each row is one setting, with the description the web editor shows as its tip. A value the NPC does not set shows the value combat runs with, attributes included, and says so.

| Kind of setting | Left | Right | Sneak |
|---|---|---|---|
| On or off | Toggle | Toggle | Toggle |
| Number | Add one step | Take one step off | Ten steps |
| Choice, such as `ranged.weapon` | Next | Previous | Next |
| Text, such as `squad.name` | Type a value | Clear | Clear |
| `guard.player` | Set to you | Clear | Set to you |
| `guard.npc` | Click an NPC with the wand | Clear | Click an NPC with the wand |
| `avoidance.returnPoint` | Set to where you stand | Clear | Set to where you stand |
| `melee.weaponDamage` | Type a damage for the item in your main hand | Remove that item's entry | Type a damage |

Setting `guard.player` clears `guard.npc`, and the other way round. `ranged.effect` opens a screen of its own for the potion's effect id, amplifier and duration.

Clicks change a draft. **Save** writes the changed rows to every selected NPC in one transaction, checked the way combat reads them; a combination combat refuses, such as a `potion` weapon without an `effect`, is refused whole and the chat line names the field. **Discard** drops the draft, and so does **Back**. Editing a section does not turn combat on.

### Rule lists

Targets, Ignores and Avoids each show the kinds of rule the list can hold.

| Row | Left | Right | Sneak |
|---|---|---|---|
| Players, NPCs, Mobs, Monsters, Animals | Toggle the category | Toggle | Toggle |
| Owner | Toggle | Toggle | Toggle |
| Health above, Health below | Turn on at 50%, then +5% | -5% | Turn off |
| Mob types, Players by name, Mobs by custom name, Squads, Permissions, Permission groups, Effects, Chat words | Type an entry | List the entries; a click removes one | List the entries |
| NPCs by id | Type an id | List the entries | Click an NPC with the wand |
| Player, NPC and Mob name patterns | Type a regular expression | List the entries | List the entries |
| Main-hand, Off-hand and Worn item | Type an item id pattern | List the entries | Add the item in your main hand |

Each entry is checked as it is added, so a broken pattern or an unknown effect id is refused with the reason and left out. Ignores has no chat words. Match-all sets, together groups and fight events are shown with their count and kept as they are; edit them in the [web editor](/animus/14-web-editor).

**Save** shows the list the way the file reads, for example `monsters; players: Steve; healthBelow: 50`, and writes it to every selected NPC in one transaction. An empty list removes the key.

## Mounts and riding

Acts on the first selected NPC. Its button shows what it rides, what rides it, and any problem with the pair, such as a vehicle that does not exist.

| Button | Does |
|---|---|
| Ride another NPC | Hides the window; the next NPC you click with the wand becomes the vehicle. Writes `modules["animus:mount"]` as `{"enabled": true, "vehicle": "<id>"}` |
| Carry another NPC | The next NPC you click rides this one |
| Pair two NPCs | Click the rider, then the vehicle. Works with nothing selected |
| Dismount | Removes the mount module |
| Riding | Opens the riding settings for the whole selection |
| Ride status | Runs `/animus ride status` |

A pair is refused before anything is written when the vehicle does not exist, when an NPC would ride itself, when the pair would make a loop, when the chain would be deeper than 8, or when the vehicle already carries 16.

**Riding** edits `modules["animus:riding"]` with the same rows, draft and **Save** as a combat section: Enabled, Review accepted, Permission (typed; `animus.ride` by default), Speed (0.5 to 8 blocks a second), Leash (4 to 256 blocks) and Lifetime seconds (30 to 3600). An imported NPC needs Review accepted before players can ride it, and Save says so.

## Trait groups

Lists every [trait group](/animus/18-trait-groups) with its description, its member count and how many selected NPCs have it.

| Click on a group | Does |
|---|---|
| Left | Assigns the group to every selected NPC |
| Right | Removes it from every selected NPC |
| Sneak | Opens the group |

Assigning or removing is one transaction, refused whole if any NPC would become invalid. When more than 20 NPCs are selected, the first click arms the change and the entry turns red; the same click again runs it.

**New group** asks for an id (lowercase letters, digits, `_` and `-`, up to 64), saves `groups/<id>.json` with no values, and assigns it to the selection in the same transaction. With nothing selected it only saves the file.

### One group

| Button | Does |
|---|---|
| Rename | Asks for the new id, saves the file under it, removes the old file and repoints every member, all in one transaction. Each member keeps its group order |
| Description | Asks for the text. Empty text removes the description |
| Members | Lists the NPCs that list the group: left selects only that NPC, sneak adds it to the selection or removes it, right takes it out of the group. **Select all members** replaces the selection with them |
| Values | Opens the field editor on the NPC fields the group supplies; saving writes the file's `values` in one transaction, refused if any member would become invalid. The lore lists the fields set now |
| Delete | Asks once more, then deletes the file and removes the group from every member in the same transaction. The chat line says how many NPCs it was removed from |

Every change here is checked before it is saved: the group file must pass the group validator and every member must still merge into a valid NPC. **[Undo]** on the chat line reverts the group file and every member together.

## Folders

<div class="animus-demo">
<p><strong>Folders</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/12-folders-ingame.webm" aria-label="Making the plaza folder and renaming it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Lists the folders under `npcs/` that hold NPCs, and `npcs/` itself, with how many NPCs sit in each and how many more are in the folders below it.

| Click on a folder | Does |
|---|---|
| Left or right | Moves every selected NPC into the folder |
| Sneak | Asks for a new name and moves every NPC in the folder, and in the folders below it, to the new name |

Each is one transaction. Moving more than 20 selected NPCs, or renaming a folder that holds more than 20, asks once more: the first click arms it and the entry turns red. `npcs/` itself cannot be renamed. A rename to a folder that already holds NPCs merges them into it.

A folder exists only while an NPC file is in it, so **New folder** asks for a name (lowercase words split by `/`, at most 8 deep) and moves the selection into it in the same transaction. It needs a selection.

## Routes

Lists the files in `routes/` with each route's point count and how many NPCs use it. A route whose file does not load shows a barrier and the reason.

- **Left click** puts the route on the selection: it writes `modules["animus:navigation"]` as `{"enabled": true, "route": "<id>"}`, replacing the NPC's own route settings, and the NPC starts walking it.
- **Right click** walks the route now without saving it.
- **Sneak-click** opens the route's own screen.

**Start route** restarts each NPC's saved route; **Stop moving** stops them.

To record a new route:

1. Click **Capture a route**, or right-click **Routes** in the palette. The first point is where you stand.
2. Walk to the next place. Hold the wand and tap sneak to drop a point there. Points show as green sparks while you capture, and the current point, where the next one goes after, shows as an orange flame. Sneak-click **Capture** to remove the last point; right-click it to open the points.
3. Click **Save route**. It saves `routes/wp-<your name>.json`, or `wp-<your name>-2.json` when that file exists, as a looping walk through the points. The chat line names the route and its point count, such as `Saved wp-alex, 4 points`; **[Path]** shows and copies the file path. Right-click **Save route** to also put it on the selection.

Points snap to the center of the block you stand on and must stay in one world; a route holds at most 256 points. **Discard capture** drops the points and asks once more; saved files stay.

### Points

One item per point of the running capture, with its coordinates and its wait. The current point is an eye of ender; inserts go after it. The point nearest you is marked **(here)**.

- **Left click** teleports you to the point.
- **Right click** makes it the current point.
- **Sneak-left** moves it to where you stand. It keeps its wait.
- **Sneak-right** deletes it. On a route of more than 20 points the first sneak-right arms the delete and a second one deletes.

The bottom row:

- **Insert point** adds a point where you stand, after the current one.
- **Wait at point N** asks for the ticks the NPC waits at the current point (20 ticks a second). Leave it blank to use the route's wait.
- **Save route** writes the points. A route opened with **Edit points** saves back over its own file in one transaction, and the [Undo] chip restores the previous file. If the file changed since you opened it, the save is refused.
- **Discard** drops the capture after asking once more.

### Route

<div class="animus-demo">
<p><strong>Route settings</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/16-route-settings-ingame.webm" aria-label="Putting a route on the trader and changing its speed, order and mode" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Sneak-click a route in the list to open it. The top item shows its point count and the NPCs that use it.

- **Rename** asks for the new id, renames the file and repoints every NPC that names it, all in one transaction.
- **Duplicate** asks for an id and copies the file. No NPC uses the copy.
- **Edit points** loads the file into your capture in the world you stand in and opens **Points**. If you have an unsaved capture, it asks once more first. Routes with recording steps stay in the web editor.
- **Put on the selection** and **Walk it now** work like the left and right clicks in the list.
- **Loop** turns looping on or off. Only order `sequence` loops.
- **Order** cycles `sequence`, `pingpong`, `random` and `wander`; right click goes back. Leaving `sequence` turns loop off.
- **Mode** cycles `walk`, `swim` and `fly`.
- **Speed** steps by 0.5 blocks a second: left adds, right subtracts, sneak moves ten steps. It stays within 1 to 5.
- **Delete** removes the file after asking once more. While NPCs use the route it refuses and names them.
- **Unassign and delete** shows when NPCs use the route. It deletes the file and removes `animus:navigation` from those NPCs in one transaction.

Every setting is checked as the runtime reads the route before it is written, and each change is its own transaction with an [Undo] chip.

## Recordings

Lists the files in `recordings/` with each recording's frames, length, how many NPCs play it and the routes that play it as a step. When the selection plays a recording, its entry shows the playback.

- **Left click** plays the recording on the selection: it writes `modules["animus:navigation"]` as `{"enabled": true, "recording": "<id>", "playback": "<mode>"}`, replacing any route. An NPC keeps the playback it had; otherwise it is `loop`.
- **Right click** moves the selected NPCs that play it to the next playback: `once`, `loop`, `pingpong`. Selected NPCs that play something else are skipped.
- **Sneak-click** opens the recording's own screen.

The bottom row runs `/animus record` for you; its reply comes back in chat.

- **Start recording** asks for an id, runs `/animus record start <id>` and closes the window so you can move. Your position becomes the origin.
- **Stop recording** runs `/animus record stop`, which saves the file. Right click runs `/animus record cancel`, which discards it.
- **Ghost** runs `/animus record ghost`, which shows or hides the ghost that replays your last moves while you record.
- **End preview** runs `/animus record clear`.

### Recording

- **Preview** runs `/animus record preview <id>` and closes the window: the recording plays once as a ghost only you see.
- **Rename** asks for the new id. It renames the file, changes the id inside it, and repoints every NPC and route step that plays it, all in one transaction.
- **Delete** removes the file after asking once more. While NPCs play it, it refuses and names them. A recording that is a step in a route is never deleted here; edit those routes in the web editor first.
- **Unassign and delete** shows when NPCs play the recording. It deletes the file and removes `animus:navigation` from those NPCs in one transaction.

## Behaviors

Lists every [behavior](/animus/07-behaviors) file, loose under `behaviors/` and inside packs, sorted by id. Each entry's lore shows its file, its pack, what triggers it (for example `on interaction, dialogue_choice x2`), whether it is a conversation, and how many selected NPCs list it in `behaviors`, plus how many more get it from a trait group.

| Click | Does |
|---|---|
| Left | Adds the behavior to the `behaviors` of every selected NPC |
| Right | Removes it from them |
| Sneak | Opens the behavior's controls |

Adding and removing are one transaction each, so the chat line has **[Undo]**. With more than 20 NPCs selected, the first click arms the change and the entry turns red; the same click again applies it, and any other click cancels. NPCs that get the behavior from a trait group keep it; change the group to remove it there.

The bottom row has **Trigger bindings**, which closes the window and lists in chat what each NPC listens for (`/animus behaviors triggers`), **Reload behaviors** (`/animus behaviors reload`), and **New conversation**, which asks for an id such as `town:greeter`, saves `behaviors/town/greeter.json` as a conversation that says "Hello" on a right click, and opens it in the conversation editor.

### Behavior controls

| Button | Does |
|---|---|
| Run | Runs the behavior once on each selected NPC, the same as `/animus behaviors run npc=<id> behavior=<behavior>` for each |
| Trace | Closes the window and prints each selected NPC's running and recent runs (`/animus behaviors trace npc=<id>`). Click a run in chat to inspect it |
| Cancel a run | Traces the selection so the run ids are in chat, then asks for one and cancels it (`/animus behaviors cancel execution=<id>`) |
| Validate | Checks the file without loading it (`/animus behaviors validate behavior=<behavior>`) |
| Open as conversation | Opens the conversation editor. Shown when the file reads as a conversation; otherwise the button says why not |
| Attach to selection | Adds the behavior to every selected NPC, as a left click on the list does |

Run and Trace ask twice when more than 20 NPCs are selected. The replies are the commands' own.

## Conversations

<div class="animus-demo">
<p><strong>Conversation editor</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/23-conversation-editor-ingame.webm" aria-label="Writing a conversation with one question in the block editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A conversation is a behavior of one shape, the one the web editor's Conversation tab edits: blocks of lines, each block one routine, with a question whose answers each lead to another block through a `dialogue_choice` trigger. One start runs the entry block. The editor in game edits one block at a time and keeps every key it does not edit, so a file saved here opens the same way in the web editor.

| Item | Click | Does |
|---|---|---|
| Starts on | Left, right | Next or previous start: right-click, sneak and right-click, left-click, sneak and left-click, drop key, sneak and drop key, swap hands, sneak and swap hands, walk near, or command only |
| Within N blocks | Left, right, sneak | Shown for walk near. One block wider or narrower; sneak for ten. 1 to 64 blocks |
| Block | | The block's name, what reaches it, and any problem that would stop a save. The window title is the behavior id on the entry block and names the block on any other |
| Line | Left | Edit the text |
| | Right | Insert a line after it |
| | Sneak-left | Move it up |
| | Sneak-right | Delete it; asks once more |
| Question | Left | Edit the question. Right, sneak-left and sneak-right work as on a line; deleting it deletes its answers |
| Choice | Left | Edit the label |
| | Right | Open the block it leads to, making an empty one when it leads nowhere |
| | Sneak | Delete the choice and every block only it reached; asks once more |
| Add choice | | Asks for the label and makes an empty block it leads to. A block without a question gets one, "Choose one.", to edit. A question takes up to 8 choices |
| Add line | | Asks for a line and adds it at the end of the block |
| Back | | Back to the block you came from; on the first block it leaves, asking once more when there are unsaved edits |
| Save | | Writes the behavior with the next revision in one transaction, then reloads behaviors. The chat line has **[Undo]** |
| Attach to selection | | Adds the behavior to every selected NPC |

Lines may use `{npc.name}` and `{player_name}`; a line with `{npc.name}` is saved as a template (`{{ npc.name }}`), as the web editor saves it. Edits stay in the window until **Save**. Save is refused, with the reason in chat, when a line or label is empty, a choice leads to a missing block, the file changed on disk since it was opened, or the server's behavior compiler finds an error.

Conditions, actions, sounds, waits and go-to steps show as kept steps: they can be moved or deleted, and the web editor edits them. A wait before a line and a plain sound or animation after it show in the line's lore.

## Shops

<div class="animus-demo">
<p><strong>New shop</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/26-new-shop-ingame.webm" aria-label="Making the plaza:stall shop and binding it to the trader" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Lists the files in `shops/` with their offer count, window style and how many selected NPCs bind each one. A shop file that does not load shows its first problem in red.

| Click on a shop | Does |
|---|---|
| Left | Binds it to every selected NPC in one transaction. It writes `modules["animus:shop"].shop` and keeps the NPC's `openOn`, `style` and `villager` settings |
| Right | Closes the window and opens the shop for you, as `/animus shop open <shop>` does |
| Sneak | Opens the shop's settings |

**Reload shops** runs `/animus shop reload`. **New shop** asks for an id such as `town:baker` and writes `shops/town/baker.json` with one empty page and no offers; add the offers in the [web editor](/animus/14-web-editor). Creating or deleting a shop reloads shops from the console, so chat shows only the change. Until it has offers, opening it shows an empty window that says so.

The settings screen shows the values of the first selected NPC that binds the shop. Each change goes on every selected NPC that binds it, in one transaction; on more than 20 NPCs it asks twice and moves one step forward.

| Button | Does |
|---|---|
| Open now | Opens the shop for you |
| Window | Left for the next style, right for the previous, in the order `chest`, `native` (the villager trading screen) and `default` (the shop's own `style`). Writes `style`, or removes it for `default`; the reply reads `Window set to native on baker` |
| Opens on | Cycles `openOn` through right, left and both clicks |
| Profession, Level | Shown when a selected villager binds the shop. Profession cycles the villager professions; level steps 1 to 5 (sneak jumps to the end). Writes `villager` on villager bodies only; other bodies are skipped and the chat line counts them |
| Reset stock | Asks twice, then runs `/animus shop reset <shop>`, clearing limits and stock for everyone |
| Unbind from selection | Removes `animus:shop` from the selected NPCs that bind this shop |
| Delete shop file | Asks twice. Refused while any NPC or trait group binds the shop, through `animus:shop` or `animus:gui`; **[Undo]** restores the file |

Offers are edited in the web editor.

## GUIs and holograms

One tab each for holograms (`gui/holograms/`), chest GUIs (`gui/inventories/`), menus (`gui/menus/`) and text animations (`gui/text-animations/`), chosen in the bottom row; the screen opens on holograms. Each entry shows its title, its file and how many selected NPCs use it. **Reload GUIs** runs `/animus gui reload`.

| Click | Chest GUI or menu | Hologram | Text animation |
|---|---|---|---|
| Left | Opens it on the selection's click: writes `modules["animus:gui"].open` as `{"kind": "inventory"}` or `"menu"` with the id, keeping `openOn` | Shows it above the selection: writes `modules["animus:gui"].hologram.id` | Settings |
| Right | Shows it to you, as `/animus gui open <id>` or `/animus gui menu <id>` does | Settings | Settings |
| Sneak | Settings | Settings | Settings |

An NPC can open one GUI and show one hologram at once. Binding a new one replaces the old one of the same kind.

The settings screen lists what uses the file and, like the shop settings, shows the first selected user's values and changes all of them in one transaction.

| Button | Does |
|---|---|
| Show it to me | Chest GUIs and menus only |
| Opens on | Chest GUIs and menus only. Cycles `open.openOn` through right, left and both clicks |
| Offset X, Y, Z | Holograms only. Left adds 0.1, right takes 0.1 away, sneak makes it 1, within 16 of the NPC's feet. Without an offset the hologram floats 0.6 above the head; the first step starts from `0, 2.4, 0`, a player's head |
| Above the head | Holograms only. Removes the offset |
| Unbind from selection | Removes the open target or the hologram from the selected NPCs that use this file |
| Delete file | Asks twice. Refused while anything uses the file: NPCs and trait groups for chest GUIs, menus and holograms, shops whose `layout` names a chest GUI, and GUI files whose text shows a text animation with `\|animation.<id>\|` |

Layouts, lines and frames are painted in the web editor.

## Find

<div class="animus-demo">
<p><strong>Find</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/05-find-ingame.webm" aria-label="Teleporting to an NPC and selecting another from Find" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Lists the active NPCs in your world, nearest first, with the distance in the lore. A left click teleports you beside the NPC, facing it. A right click selects only that NPC. A sneak click brings the NPC to you and saves its new position.

On Folia the NPC moves when its definition reloads, a moment after the position is saved, instead of at once.

## Left to the web editor

A core test walks the NPC schema and fails when a field has neither a screen nor a line in this table, so the table is complete.

| Field | Why |
|---|---|
| `uuid`, `revision`, `schemaVersion` | Animus writes them |
| `group` | The Folder screen moves NPCs between folders |
| `skin` | The Skins screen sets it |
| `inventory.slots`, hire cost items | Items in a stored inventory and a hire price; the Equipment screen sets worn and held items |
| Hologram line margins | The toolkit edits plain lines |
| Waits as `[min, max]`, on a route or a point | The toolkit sets a fixed number of ticks |
| Recording steps in a route's `points` | The recorder writes them; the Recordings screen assigns whole recordings |
| Route-wide `jitter`, `seed`, `startOffset`, `guides`, `linkDistance`, `wander`; per-point `jitter`, `weight` and junctions | Kept when a route is edited in game; set in the editor |
| Combat `together` groups, `all` sets and fight `events` | Lists of lists; single rules are edited in game |
| Import leftovers such as `preservedSettings` | Kept and never read |
| Behavior node graphs other than conversations; inside a conversation, conditions, actions, go-to steps, a line's wait, sound and animation, choice colours and hover text | Node editing |
| Chest GUI layouts, hologram lines, text animation frames, shop offers, `animus:gui.open` kinds `shop` and `gloss` | Painting and offer tables; shops bind through `animus:shop` |
| Rig keyframes, recording description, tags and speed | Rig and recording files are authored, not toggled |
