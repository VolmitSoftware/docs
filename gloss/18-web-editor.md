---
title: "Web Editor & Sync"
description: "Use the Gloss web editor and pair it with a server"
published: true
date: 2026-11-13T00:00:00.000Z
tags: "gloss, editor, web, pairing"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

The web editor runs in the browser at <https://gloss.volmitsoftware.com>. It edits menus, holograms, scoreboards, chat surfaces and the other Gloss JSON documents, with previews of how they look in game. It works on its own in the browser, and against a live server once [paired](#pairing). A walkthrough is in [Web editor tutorial](/gloss/18-web-editor-tutorial). To run your own relay, see [Self-Hosted Editor Relay](/gloss/18b-sync-relay).

## Start page

The editor opens on its start page:

- **Pair a server** has a **Pairing link** field with **Pair**; its (i) names the command to run on the server. See [pairing](#pairing). In the editor, **Pair a server** in the File menu and the command palette, and the **Server** button of the browser workspace, open a dialog with the same field and the command.
- **Start in this browser** offers **Import**, **Templates** and **New document** for documents kept in this browser only. Export them as files to use them on a server, or pair a server to edit its documents. Once the browser workspace holds work, **Continue** opens it.

Once this browser has a paired server, or its browser workspace holds more than the sample menu, the start page leads with **Continue**: each paired server with its state (Online, Checking, Not reachable or Pairing ended; a server not reachable is checked again every 10 seconds while the page is open, and what one tab learns about a server every other tab of the browser shows too) and how many documents and images it holds, then the browser workspace. Each row has **Open**, and a server's **...** menu has **Forget server**. A server whose pairing ends within three days says "Pairing ends in n days unless used."

The Gloss logo at the left of the top bar returns to the start page.

## The editor

One bar runs along the top:

| Control | What it does |
|---|---|
| Gloss logo | Back to the start page |
| **File** | **New document**, **Templates**, **Import JSON**, export or copy the document's JSON, **Images**, and under **Workspace**: **Import workspace bundle**, **Export workspace bundle**, **Erase all local data** |
| Document title | Click to rename. In Advanced mode the runtime id shows beside it when it differs |
| **View** | **Edit**; **Preview** for menus and container previews; **Code**, the document's JSON; **Split view**, the stage and the JSON side by side, in Advanced mode on screens wider than 1024 pixels. Choices the kind cannot use are not offered |
| Undo, Redo | Step through edits |
| **Search** | Commands and documents. `Ctrl+K`, or `Cmd+K` on a Mac |
| **Server** | Pair a server, review changes and publish. In a server's workspace it shows the connection state |
| **Simple** / **Advanced** | How much of the editor shows |
| Help menu | **Help**, **Keyboard shortcuts**, **Guided tour**, **Settings** and **Dark theme** |

On screens 1024 pixels wide or less, the library and the inspector open as drawers from the bar. Controls that do not fit fold into the **...** menu, starting with Simple and Advanced. On a phone the **View** choices are in the **...** menu too, so the document title has room.

The status bar shows problems (select it for the list), zoom on menus and container previews, and autosave. Advanced mode adds the pointer position and the editor build.

### Library

The library on the left lists every document in the open workspace, grouped by kind:

| Group | Kinds |
|---|---|
| Menus and screens | Menus, Container previews, Inventories, Flow maps |
| HUD and server list | Scoreboards, Tab lists, Surfaces, MOTDs, Leaderboards |
| Chat | Chat channels, Connection messages, Emoji, Bubble styles |
| World | Holograms, Markers, Waypoints, Damage indicators, Real drops, Entity overlays |
| Players | Nameplates, Nametags |
| Shared resources | Animations, Strings, Names, Glyphs, Behaviors, Presets |

**Search** matches titles, runtime ids and kind names. **Filter by kind** narrows the list to one kind. **New** opens the New document dialog, and the header's **...** menu has **New folder**. Drag a document onto a folder to move it.

Each row has a **...** menu, also on right-click: **Open**, **Rename**, **Change runtime id** (Advanced), **Duplicate**, **Move to folder**, **Copy link** and **Delete**. Deleting a document or a folder asks first. Deleting a component, action, variant or element inside a document happens at once, and the notice has an **Undo** button.

### New document

**New** asks where to start: **Blank**, **Template** or **Random**. Then pick a kind under its group. Hover or focus a kind for a short tip.

Kinds with one fixed file (connection messages, damage indicators, entity overlays, MOTD, names, presets, real drops and the tab list) open their existing document instead of a second file the server would not load. A template is applied to it as one undoable step, and Random randomizes it. Those kinds cannot be duplicated or given another runtime id.

### Views

Menus and container previews have **Edit**, the canvas you build on, and **Preview**, the result in a rendered world. Every other kind shows its stage once, with the inspector on the right. Names, Strings, Waypoints, Glyphs, Behaviors, Presets and Leaderboards are edited in a form in the centre and have no inspector.

The menu canvas and the container preview card fit their content when a document opens, is imported or is switched to, and again whenever the pane changes size. Once you zoom or pan by hand, that view stays with the document, also when you switch away and back. **Reset view** in the stage header, or `0` or `F` with the stage focused, fits it again. The hologram stage opens with the whole hologram in view above the HUD, and keeps a zoomed camera for each document the same way.

**Code** is the file Gloss loads. **Format** tidies it, **Save** writes it into the document, and **Revert** asks before dropping unsaved code edits.

### Simple and Advanced

A browser with no workspace starts in Simple. A browser that already has one starts in Advanced. The choice is remembered in this browser.

Simple hides:

- the Shared resources kinds and Flow maps, in New, Filter by kind, the library and Search. A document of those kinds stays on the server and in the workspace; switch to Advanced to open it. If one is open when you switch to Simple, the editor opens the most recently changed document Simple shows
- Split view, runtime ids, Change runtime id and the Random seed
- show conditions, visibility expressions, variant ids and priorities, Display refresh tick settings, extra-key editors, raw JSON blocks and preset inheritance
- expert parts of some kinds: menu action cooldown and tick timing, scoreboard layout, native objectives and Row settings, MOTD policies and the status request simulator, chat channel filters and filter policy, real drops variants, audience, physics and script, and world panel authoring in flow maps
- the Settings rows True render offsets, Server uiScale (preview), Custom item catalog and Local data

Hidden fields are kept. Editors change only the field you edit, so a value set in Advanced mode, in Code or on the server stays in the file when you edit in Simple.

When an import, a dropped file, a workspace bundle or the paired server brings in documents that Simple hides, the editor says how many arrived and that they are in Advanced. **Switch to Advanced** beside the message opens the first of them. A Simple library that holds only such documents says the same in the library and the centre.

### Appearance

The editor uses a dark theme by default. Turn **Dark theme** on or off in the Help menu; the browser remembers your choice. The same command is in Search. Interface motion follows your operating system's reduced-motion preference.

## Editing

<div class="gloss-demo" data-demo="menu-shop-editor">
<p><strong>Shop menu authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="https://media.volmitsoftware.com/gloss-assets/demos/menu-shop-editor.webm" aria-label="Shop menu authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The editor provides forms, JSON editing, undo and redo, image import, and previews for the document kinds below. Code shows the JSON with validation and field completion. Dedicated visual controls and local simulation cover a subset of runtime fields. Use **File > Images** for PNG, GIF and supported Minecraft skins; imported assets are saved under `plugins/Gloss/images/`.

Menu creation supports decorations, buttons, toggles, lists, sliders, fields, and tabs. Lists expose source and page size; sliders expose bounds, step, label, and click width; fields expose label, initial value, and prompt type; tabs expose spacing and editable ids and labels. Advanced mode's extra-key editors and Code view retain the full fields, including list templates and flow, styles, and actions. Actions without dedicated controls keep their complete payload in the action's key/value editor.

The menu preview expands the first list page, up to the default 64-entry limit, and binds each entry for text, visibility, and action-log expressions. Slider left-click raises its value and right-click lowers it; Shift uses five steps. Tabs set their session value. Fields open a browser input dialog whose Save button updates the local session value; this previews the form flow rather than opening a Minecraft sign, anvil, or chat prompt. External effects such as commands, economy transactions, inventory windows, and proxy transfers appear in the action log without running against a server.

Hologram lines may contain text strings or objects carrying `text`, `item`, `head`, `block` or `entity`. Editing text, moving lines, copying a document and exporting preserve object content, scale and conditions. Text objects use the text row; other object lines expose their fields in the generic inspector. The hologram stage previews mixed text, item, head, block and entity lines in their authored order, with separate space reserved for each object. Head previews use the bundled player skin. The seven bundled entity rigs use measured bounds; other entity types use catalog sprites with approximate sizing. Custom items without a resolved material use a barrier preview. Verify the native model and skin in game.

The component inspector edits [motion](/gloss/10-components-hitboxes#motion) and validates its expressions. True render preview, in the canvas **...** menu, applies the motion once per tick using variable defaults and `time.*`. It shows where the runtime places the component, without the client's easing, and session values changed by a running sequence do not move it.

Preview exact Minecraft rendering, occlusion, sounds, particles and interaction in game before publishing.

### What you can edit

| Group | Kind | Where it lands | Reference |
|---|---|---|---|
| Menus and screens | Menus | `menus/` | [Hologram Menus](/gloss/09-menus), [Components & Hitboxes](/gloss/10-components-hitboxes) |
| Menus and screens | Container previews | `previews/` | [Container Previews](/gloss/15-container-previews) |
| Menus and screens | Inventories | `inventories/` | Chest GUI resolution, mask, keys and slots |
| Menus and screens | Flow maps and world panels | `panels/` | [Panels](/gloss/16-panels) |
| HUD and server list | Scoreboards | `boards/` | [Scoreboards & Groups](/gloss/05-scoreboards-groups) |
| HUD and server list | Tab lists | `tablist.json` | [Tablist](/gloss/06-tablist) |
| HUD and server list | Surfaces | `surfaces/`, one per action bar, boss bar or title | [Velocity Proxy](/gloss/27-velocity#surfaces) |
| HUD and server list | MOTDs | `motd.json` | [Server List MOTD](/gloss/06b-server-list-motd) |
| HUD and server list | Leaderboards | `leaderboards/` | [Leaderboards](/gloss/29-leaderboards) |
| Chat | Chat channels | `channels/` | [Chat formatting and mentions](/gloss/08-chat-bubbles#chat-channels-and-mentions) |
| Chat | Connection messages | `connections.json` | [Connection Messages](/gloss/26-connection-messages) |
| Chat | Emoji | `emoji/` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Chat | Bubble styles | `bubbles/` | [Chat Bubbles](/gloss/08-chat-bubbles) |
| World | Holograms | `holograms/` | [Holograms](/gloss/04-holograms) |
| World | Markers | `markers/` | World, player or entity targets, labels, beams, trails and edge indicators |
| World | Waypoints | `waypoints/` | Anchor, color, style, range and audience conditions |
| World | Damage indicators | `damage-indicators/default.json` | [Damage Indicators](/gloss/08b-damage-indicators) |
| World | Real drops | `real-drops/default.json` | [Drop Labels](/gloss/08c-drop-labels) |
| World | Entity overlays | `entity-overlays/default.json` | [Entity Overlays](/gloss/20-entity-overlays) |
| Players | Nameplates | `nameplates/` | [Permission-selected holographic player nameplates](/gloss/20-entity-overlays#permission-selected-nameplates) |
| Players | Nametags | `nametags/` | [Permission-selected player identities](/gloss/20-entity-overlays#permission-selected-nametags) |
| Shared resources | Animations | `animations/` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Shared resources | Strings | `strings/<locale>.json` | [Localization](/gloss/19-localization) |
| Shared resources | Names | `names.json` | [Game-object names](/gloss/13-expressions-placeholders#game-object-names) |
| Shared resources | Glyphs | `glyphs/` | [Font bitmaps, overlays, spacing and waypoint styles](/gloss/28-resource-packs) |
| Shared resources | Behaviors | `behaviors/` | [Event triggers, state and bounded chat matching](/gloss/19b-behaviors) |
| Shared resources | Presets | `presets.json` | Collection defaults and named preset inheritance |

Entity overlays use schema 2, holograms schema 3, bubble styles schema 5, and damage indicators and Real Drops schema 4; see [Data Files & Hot Reload](/gloss/03-data-files).

The Presets form selects one of the supported document collections, edits shared defaults, and creates or removes named presets. **Extends** names a parent in the same collection. Default values and preset values accept nested JSON objects and arrays. Objects merge recursively; an authored array replaces the inherited array. Validation reports missing parents, inheritance cycles, and forbidden identity fields. The catalog always saves as `presets.json`; its revision remains server-owned. In Advanced mode, other documents show an **Inheritance** section with a **Preset** picker when a catalog is available. Selecting a preset preserves authored overrides; remove an override in Code view to use the inherited value.

The Glyphs form edits the namespace and font, bitmap glyph metrics and fallbacks, overlays, space-provider range, and custom waypoint styles with ordered sprites. Image paths are relative to `images/`; add the PNG files through **File > Images**. The asset list shows declared paths and dimensions. Build and offer the resource pack on the server to verify client rendering. Waypoints accept a namespaced custom style plus a `default` or `bowtie` fallback for viewers without the loaded pack.

The Leaderboards form edits what the board **Counts** (**Statistic**, **Placeholder** or **Metric**), its **Rows**, **Order**, **Resets** and **Include offline players**, and the **Value** and **Name** row text. Keys the form does not show stay in the file.

HUD surface controls expose automatic selection, named bossbar groups, native bossbar flags, and queue delivery policies. Typed event subscriptions configure join, world-change, server-change and interval events with conditions, delays, ordering and undo. Backend world changes and Velocity server changes follow the selected platform; event-only surfaces remain quiet in the preview until delivered in game. Unknown subscription fields survive edits.

Scoreboard rows preserve stable ids, conditions and score formatting during visual edits. Scoreboards expose reusable section lists, reference-preserving section rename, ordered conditional pages with title inheritance and durations, overflow policy, and independent title/text/value intervals for the default presentation and every variant. The layout editor and Row settings are in Advanced mode.

In Advanced mode, native objective controls configure player-list and below-name slots, numeric expressions, formats, viewer/subject conditions, refresh intervals, and yield/override conflicts. The sidebar preview expands sections and rotates eligible pages; native slot appearance and conflicts require Minecraft.

Inventory controls include independent title, slot, condition, and list refresh rates. Action lists offer **Add dialog** for native dialog titles, kind, timeout, Escape behavior, body text, input definitions, and buttons. Nested definitions use editable JSON fields; Code completion describes each supported control. The browser preserves dialog branches and reports invalid input contracts, but does not simulate Minecraft's dialog screen. **Call named action** references a list in the menu or inventory's root `actions` object; edit the shared lists in Code or the root extra fields. Validation reports missing names and recursive calls.

Inspector controls cover marker anchors, beams, trails and edge indicators; nameplate styles,
boxes, relations and health bars; inventory slots, lists and variants; channel cards, items,
links, filters, filter policies and variants; and hologram pages, actions, hitboxes and presentation variants.
Menu and overlay variant controls preserve each authored condition and override. Connection messages include the server first-join section.

MOTD controls edit rotation, request selectors, icon sets, count/sample policies and independent server links. In Advanced mode, the status request simulator accepts hostname, client protocol, timestamp, server state and real player counts, with Paper, Spigot and Velocity capability choices. Authored time zones determine entry time windows. Entry inspection remains available independently of request selection. Unknown imported policy fields survive edits and undo.

Scoreboards, tablists, MOTD and connections have field descriptions and validation in the editor,
with matching JSON schemas in Gloss's `schema/` directory. Tablist schema 3 forms include fixed cells, named skins, independent roster sections, ordered sort keys, NPC and hat options, overflow policies, and complete conditional layouts. The tab preview evaluates sample conditions and roster ordering; skin textures and hats require an in-game client.

In Advanced mode, holograms, bubbles, damage indicator presentations, and drop labels include **Display refresh** controls. Enable an override for content, visibility, or motion to enter an independent 1 to 1200 tick interval; disabling it removes that override. The preview preserves these settings; server scheduling determines their runtime cadence.

Display style, boxes and card geometry use the same fields as the server documents; see [Display style and boxes](/gloss/11-icons#display-style-and-boxes) and [Container Previews](/gloss/15-container-previews).

In Advanced mode, visibility fields accept a boolean or a Gloss expression, evaluated in the preview against sample player, server, time and surface values. Live permissions, regions, metrics and PlaceholderAPI results still depend on the server. See [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Text previews support authored MiniMessage, legacy colors, expressions, emoji and animations. Entity names, Adapt Insight details and player chat stay literal data. Particle controls cover the applicable whole-surface, component, line and named-span targets; see [Particle Layers](/gloss/25-particle-layers).

Global feature switches, service limits and defaults stay in `gloss.toml`. The document editors do not replace it; see [Configuration](/gloss/02-configuration).

The Strings form provides locale and fallback fields plus editable text entries. Numeric-looking
values and empty strings stay text. The Waypoints form edits world, player, or entity anchors,
color, style, range, and, in Advanced mode, the audience condition.
Waypoint client rendering remains a server/client concern.

### 3D previews

The 3D previews draw the client's own block and item models and textures in WebGL2 over a rendered block world. The in-game frame uses a fixed player viewpoint; interactive authoring canvases retain their orbit, zoom, pan, and movement controls. Previews scale to fit their frame.

Entities are textured rigs for the player, zombies, skeletons, creepers, pigs, cows and sheep, and a catalog sprite for every other mob. These seven rigs use measured dimensions; other entity sprites use approximate sizes. Mixed holograms preserve text, item, head, block and entity order, with box padding extending outside the row bands. Unresolved custom items use a barrier preview until their provider resolves them on the server. A browser without WebGL2 shows a rendered still instead of models.

### Nametags, nameplates, and mentions

Nametag and nameplate stages render the selected player presentation above a Minecraft player model. Edit the document's assignment permission and each variant's permission alongside their priority and conditions; priorities and conditions are in Advanced mode. Preview sample values describe the wearer as `subject` and the reader as `viewer`. Nameplate previews inherit the selected nametag from the same workspace, so `subject.name` shows the composed identity. Enter permission nodes in the preview controls to test document and variant eligibility; these sample grants affect the preview only.

Use **Randomize document** on the nametag or nameplate stage to generate an editable presentation, then adjust its permission assignments before exporting.

Chat channels provide ordinary and mentioned-message previews, an enabled switch for mentions, and separate controls for the tagged token, complete highlighted message, and sound key. In-game sound and client rendering follow the saved channel document. Channel documents use schema 2.

In Advanced mode, **Filter policy** exposes every input, output, expression, match, work, and elapsed limit, plus **Drop message** or **Keep completed** behavior. Each variant can inherit or replace the whole policy block. The browser runs RE2 filters with literal replacements before showing the sample message; unsupported expressions and limits appear as validation errors. Preview notices identify limit results or an unavailable filter engine. Elapsed results depend on the browser workload and do not predict server timing. Import older channels through the server importer before opening them here.

## World panels and flow maps

A menu flow map (an Advanced kind) stores the workspace layout and can hold a linked runtime world panel. Switch the board between **Canvas** and **List**, and use **Arrange** to lay it out. In Advanced mode, the inspector's **World panel** section has **Create world panel**, which takes its id, root menu, world key and world UUID, and **Import**, which reads an existing definition. Once linked, **Export world panel** in the inspector's **...** menu writes the runtime panel without the local flow-map layout. Duplicating a linked panel gives the copy a separate runtime id and UUID. A flow map alone is editor data with no in-game preview. See [panel authoring](/gloss/16-panels#browser-authoring).

## Seeded randomizer

<div class="gloss-demo" data-demo="seeded-randomizer-editor">
<p><strong>Seeded document generation</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="https://media.volmitsoftware.com/gloss-assets/demos/seeded-randomizer-editor.webm" aria-label="Seeded document generation, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

In **New document**, choose **Random** to generate a complete editable sample of a kind. Random is offered for kinds with an in-game look; flow maps and the Presets, Names, Strings, Glyphs, Behaviors and Waypoints catalogs have none. In Advanced mode the **Seed** field shows the seed, and **New seed** picks another. The same seed, document identity and workspace assets reproduce the same result, and the generated content is one undoable edit.

Menus and container previews also offer **Create random menu** or **Create random preview** in the **...** menu of their Components or Elements list, which replaces the document's content as one undoable edit.

Samples exercise the supported finite choices across seeds but do not enumerate every expression, numeric combination, custom asset or provider value.

Sample damage, health, viewer state, React counts and Adapt Insight controls affect the preview only. Configure Adapt's `restrictGlossToInsight` option in Adapt itself.

## Pairing

Pairing gives one browser a token for one server. Run on the server, in game or from the console:

```none
/gloss editor pair [label=] [scopes=a,b] [folders=a,b] [expires=7d]
```

In game the reply is one line, "Link ready. Open it within 10 minutes", with **[Open editor]**, which opens the link, **[Copy]**, which copies it, and **[Revoke]**, which puts `/gloss editor revoke <token>` in your chat box. Revoking before the link is opened cancels it. The console prints the link and a second line with the scopes, folders, lifetime and token id:

```none
[Gloss]: Link ready. Open it within 10 minutes: https://gloss.volmitsoftware.com/#/pair/GLS1...
[Gloss]: Scopes read history publish:screens publish:hud publish:chat publish:world publish:players publish:shared publish:images; all folders; ends after 7d unused; token tok_1a2b3c4d5e6f
```

Open the link within 10 minutes; it works once. A server restart cancels links not opened yet. If a browser cannot use the link because its address is not in `allowedOrigins` or the link expired, the player who made it gets a chat line saying so and the console logs it once. When the relay is the only way in and stays unreachable for 15 seconds, that player is told too.

The link opens one card:

- The title is the server's name: `serverName` under `[editor]` in `gloss.toml`, else the first line of the server's MOTD, else its folder name. Under it: "Link works until HH:MM, once."
- **The editor can** lists what the link allows in words, such as "See documents and images", "Publish every kind and images" or "Only folders shop".
- **Browser name** is how `/gloss editor tokens` lists this browser, such as "Chrome on macOS".
- **Remember this browser** is on by default: every tab of this browser stays paired until the pairing ends or you **Forget server**. Turn it off on a shared computer; this browser then forgets the pairing when the tab closes.
- **Pair** exchanges the link for a token and opens the server's workspace. **Cancel** goes back to the start page.

**Details** on the card, folded, shows the fingerprint (check it matches `/gloss editor status`), the **Direct** and **Relay** addresses and the link name. The editor removes the link's code from the address bar once it has read it. A link can also be pasted into **Pairing link** on the start page or into the **Server** sheet of the browser workspace.

When pairing fails, the card says what happened in one sentence and the next step:

- The link was already used, expired or is not a pairing link: run `/gloss editor pair` again and paste the new link into **New link**.
- The server does not accept the editor's address: add the page's origin to `allowedOrigins` under `[editor]` in `gloss.toml`, then press **Pair** again. The editor tells this apart from a server that is down or a dropped connection, and says the same when a paired server later refuses the page's address.
- The server did not answer, or is not connected to the relay: check that it is running, then press **Pair** again.
- The relay does not answer: check `relayUrl` under `[editor]` in `gloss.toml`, or pair over the direct listener. When the link also has a direct address, the card says before **Pair** that the relay does not answer and that the pairing uses the direct address.
- The browser blocked the connection to your server, as it can when an `https` page reaches a local or LAN address: allow local network access for the site in the browser's site settings, then press **Pair** again.
- A different server answered (check the link is from the right server), or the server is busy (wait a few seconds).

A pairing lasts as long as it is used: it ends after `tokenDays` (7 days) without use, or after the `expires=` time without use. Each use starts the time again. Tokens, the server's key and its fingerprint survive restarts. When the pairing is three days or less from its end, the start page, the save bar and the **Server** sheet say "Pairing ends in n days unless used." When the server revokes or expires the token, the save bar says "Pairing ended." with **New link**, and the **Server** sheet shows "Pairing ended." with a **New link** field.

| Option | Default | Meaning |
|---|---|---|
| `label=` | None | A name shown in `/gloss editor tokens`, at most 64 characters |
| `scopes=` | Every scope except `publish:commands` | What the token may do; list fewer to narrow it |
| `folders=` | All folders | Limit the token to documents and images whose id sits in these folders, such as `folders=shop,events`. Subfolders are included; documents outside a folder are not. Folder names use lowercase letters, digits, `_` and `-`, with `/` for a subfolder |
| `expires=` | `tokenDays` from `gloss.toml` (7 days) | How long the pairing lasts without use, as a number with `d`, `h` or `m`, such as `12h`, at most 365 days |

| Scope | Allows |
|---|---|
| `read` | Reading documents and images, and live changes from the server |
| `history` | Reading stored versions, for **History** in the Server sheet |
| `publish:screens` | Publishing menus, container previews, inventories and flow maps (panels) |
| `publish:hud` | Publishing scoreboards, tab lists, surfaces, MOTDs and leaderboards |
| `publish:chat` | Publishing chat channels, connection messages, emoji and bubble styles |
| `publish:world` | Publishing holograms, markers, waypoints, damage indicators, real drops and entity overlays |
| `publish:players` | Publishing nameplates and nametags |
| `publish:shared` | Publishing animations, strings, names, glyphs, behaviors and presets |
| `publish:images` | Uploading and deleting images |
| `publish:commands` | Publishing documents that run console commands. Never a default; see below |

### Console commands

A [`command` action](/gloss/12-actions#command) with `"source": "server"` runs its command from the console when a player triggers it, so publishing such a document is as good as console access.

- Publishing a document that contains one, new or changed, needs `publish:commands` as well as its kind's scope. Deleting one does not.
- Without the scope the publish is refused, nothing is written, and the editor says the pairing cannot publish documents that run console commands.
- Only the console, or a player with `gloss.editor.commands`, may pair `publish:commands`. No default pairing has it: `/gloss editor pair scopes=read,publish:screens,publish:commands`.
- A player who loses `gloss.editor.commands` loses `publish:commands` from their tokens at the next check (every 60 seconds); the rest of each token keeps working.

### Managing tokens

| Command | Effect |
|---|---|
| `/gloss editor status` | State, listener, relay and token count. In game **[Details]** adds the listener address, open connections and streams, and the fingerprint; the console prints both lines |
| `/gloss editor tokens [page=1]` | Each token's id, label, scopes, folders, expiry, last use, the browser it paired from and its open streams (`streams N`) |
| `/gloss editor revoke <token>` | Revoke a token, or `all`. Its connections close at once. A link not opened yet is cancelled the same way |

```none
[Gloss]: Editor ready | listener 127.0.0.1:9799 (http) 0/64 connections | relay waits for the first pairing | 0 tokens | 0 streams
[Gloss]: Fingerprint sha256:3f9a...
```

When the relay cannot be reached, the first line says `relay <url> unreachable` and the second ends with why and `the direct listener still works` (or, with the listener off, that no browser reaches the server until the relay answers).

All of these need `gloss.editor.pair`, which `gloss.editor` and `gloss.*` grant; operators have it by default. A token a player made is revoked when that player loses `gloss.editor.pair`, checked every 60 seconds, also while the player is offline. For an offline player the check reads the operator list, the node's default and Vault's permission plugin. When a permission plugin runs that the server cannot ask offline, such as LuckPerms without Vault, the token keeps working for at most 7 days after the last confirmation, then it is revoked and the player pairs again. Tokens made from the console are not checked. A server holds at most 256 tokens and 64 links waiting to be opened.

**Forget server**, in a server's **...** menu on the start page and under **Pairing** in the Server sheet, asks before it removes the server from this browser: its pairing and any unpublished changes leave the browser, and published changes stay on the server. The token keeps working on the server until it expires; the confirmation names the `/gloss editor revoke <token>` command that ends it now.

## Connecting the server

The editor reaches a server in one of two ways. Both are on by default, and a pairing link carries every path that is enabled. The editor tries the path that worked last and switches to the other when one drops; the save bar stays as it was while it switches. In Advanced the Server sheet shows Online (direct) or Online (relay).

**Relay.** The server opens an outbound WebSocket connection to a relay, so it works behind NAT and on hosts that allow no inbound ports. By default it uses the hosted relay at `wss://gloss-relay-437930007071.us-central1.run.app`; a `gloss.toml` that already has a `relayUrl` line keeps that address until you delete the line or change it. The connection opens at the first `/gloss editor pair`, not before, so a server where nobody pairs makes no outbound connection; after that it opens at every start while a token exists, and `/gloss editor status` shows `relay waits for the first pairing` until then. Before the editor sends a token or pairing secret over the relay, the server signs a random challenge from the browser with its key, and the editor checks the key against the fingerprint it paired with. A relay therefore cannot pose as your server while the server is not connected to it. The relay stores nothing, but its operator can read the requests and documents it forwards; set `relayUrl` to a [relay you run yourself](/gloss/18b-sync-relay), or turn the relay off with `relayEnabled = false`. A browser keeps the addresses from the link it paired with, so pair browsers again after you change `relayUrl`. A request larger than one relay message (1 MiB by default) is refused, and the editor says to connect directly or publish fewer documents at once.

**Direct listener.** The server listens on `127.0.0.1:9799`. A browser accepts a plain `http://` address only for `127.0.0.1` or `localhost`, so a direct connection from another machine needs HTTPS:

- Put a TLS proxy in front of the loopback listener and set `advertisedUrl` to its public `https://` address, or
- Set `tlsCertificate` and `tlsPrivateKey` to PEM files in the Gloss folder and set `listenAddress` to the address to bind.

Gloss refuses a non-loopback `listenAddress` without TLS. When the port is taken, for example by a second server on the same machine, the log says `Editor listener failed: cannot bind 127.0.0.1:9799 (...); set [editor] port to a free port or listenerEnabled = false. The relay still works`. `allowedOrigins` must include the address the editor runs at; by default it holds `https://gloss.volmitsoftware.com` and the editor's two `web.app` and `firebaseapp.com` addresses.

The listener checks the token and scope from the request head before it reads a body, so only a paired browser can send a large one, up to `requestBodyBytes` (4 MiB). Pairing and the other open requests take at most 4 KiB. A request head must arrive within 5 seconds, and a body without a token within 5 seconds of the head. An idle connection closes after 15 seconds, and one address may hold at most 16 of the `openConnections`; an IPv6 address counts by its /64. One pairing may send `requestsPerSecond` (20) requests a second, bursting to twice that, and run `concurrentRequestsPerToken` (8) at once. One address may try `pairAttemptsPerMinute` (10) pairings a minute.

```toml
[editor]
listenerEnabled = true
listenAddress = "127.0.0.1"
port = 9799
advertisedUrl = "https://gloss.example.com"
relayEnabled = false
```

Every `[editor]` key applies when `gloss.toml` reloads, and paired browsers stay paired. See [Configuration](/gloss/02-configuration#editor) for every key, its default and range.

## Editing a live server

After **Pair** the editor opens the server's own workspace, apart from the browser workspace, with every document the pairing reaches listed in the library at once. Documents load in the background and the save bar says "Loading n of m documents" meanwhile; a document you open before it has loaded is read first. Kinds this editor has no form for are counted under **Read only here** in the Server sheet and stay on the server unchanged.

An edit changes only the keys you set; keys the server file leaves out stay out. A document undone or typed back to the server's text is not a change, and Publish sends nothing for it.

Changes made on the server reach the editor while it is open, whatever made them: a command, another editor, or a file edited on disk. Changes Gloss writes arrive within about a second, and a file edited on disk within about two. Documents you have not edited take the server copy, including the one you have open. Documents you edited keep your copy and read **Changed on server**. New documents on the server are added, and a document deleted on the server is removed if you had not edited it.

When the server stops, the save bar says **Not reachable** and your changes are kept. The editor reconnects by itself as soon as the server is back and reads the server's list again.

### The Server sheet

Select **Server** in the top bar. In a server's workspace it shows:

| Section | Contents |
|---|---|
| State | The connection state; in Advanced, whether it runs direct or through the relay |
| Review changes | Every document and image that differs from the server, with **Open**, or **Keep mine** and **Use server copy** where a choice is needed |
| Pairing | **Server**, **Documents**, **Images** with their total size, **Read only here**, **Pairing ends** and **Allows**, what the pairing may do. Advanced adds the fingerprint, the direct and relay addresses and the token id. **Forget server** is here too |
| Problems | Problems the server reported in its files. **Open** jumps to the document |
| History | Versions the server keeps. **View**, then **Restore**, puts that version into the open document as one undoable edit; publish to apply it |

The footer has **Disconnect** or **Reconnect**, **Sync**, which reads the server's list again, and **Publish**. **Disconnect** stops this tab's connection only: the documents stay in this browser and the pairing stays valid.

In the browser workspace **Server** opens **Pair a server** instead: the pairing command and a **Pairing link** field.

**Review changes** lists deletions under their own **Deleted** heading. A publish that deletes more than 25 documents and images, and more than a fifth of what the pairing reaches, asks first and names the count; the server refuses such a publish unless the editor says the count was confirmed. Every document a publish deletes is kept in the server's **History**.

The browser keeps a copy of the server's workspace plus your unpublished changes. If the browser lost that copy (cleared site data, for example) or it came back empty, the editor reads the server again on the next open; it never offers the missing documents as deletions.

### Publish

<div class="gloss-demo" data-demo="live-sync-editor">
<p><strong>Connected editor publication</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="https://media.volmitsoftware.com/gloss-assets/demos/live-sync-editor.webm" aria-label="Connected editor publication, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="editor-live-sync-pov">
<p><strong>Published hologram in Minecraft</strong> Minecraft client. Silent capture.</p>
<video src="https://media.volmitsoftware.com/gloss-assets/demos/editor-live-sync-pov.webm" aria-label="Published hologram in Minecraft, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Autosave keeps every edit in this browser. The server changes only when you publish. In a server's workspace a save bar along the bottom shows the state and how many changes are waiting. **Publish** sends only the documents and images you changed. The server checks them and writes them to `plugins/Gloss/`. If a document is invalid, the server refuses the publish and writes nothing; the save bar names the document and the reason. A publish too large for one request goes in parts, and each part is written whole or not at all. The save bar reports one total for the whole publish, such as "Published 30 changes.", plus one line when a later part did not land.

The editor records a publish in the browser before it sends it. If the connection drops before the answer arrives, the editor sends it again on reconnect, and the server applies it only once.

Renaming a document in a server's workspace renames its file on the server: the next publish writes the new file and removes the old one. Kinds with one fixed file keep their file name.

The save bar shows the state, and so does the **Server** button:

| State | Meaning |
|---|---|
| Checking | Reaching the server |
| Loading | Reading the server's list and documents |
| Connected | Paired and online. The save bar shows how many changes are waiting |
| Publishing | Sending your changes |
| Published | The server applied the last publish |
| Needs a choice | Some documents need a choice before they can be published. **Review** opens them |
| Rejected | The server refused the publish and changed nothing |
| Not reachable | The server does not answer. Changes are kept and the editor reconnects by itself |
| Not connected | You chose **Disconnect**. **Reconnect** connects again |
| Pairing ended | The server revoked or expired the token. Paste a new link into **New link**; the sheet offers nothing else until then |
| Refused | A different server answered, or the server refused the connection |
| Open in another tab | Another tab edits this workspace. **Take over** moves it here |

Library rows show a badge while they differ from the server:

| Badge | Meaning |
|---|---|
| Changed here | Edited here. Publish sends it |
| New | Exists only here. Publish creates it |
| Deleted | Deleted here. Publish deletes it on the server, where History keeps a copy; Review changes lists it under **Deleted** |
| Changed on server | The server copy changed while you were editing it here |
| Conflict | The last publish could not apply it |

### Conflicts

Publish skips documents marked **Changed on server** or **Conflict** until you choose in **Review changes**:

- **Keep mine** keeps your copy. The next Publish replaces the server copy.
- **Use server copy** replaces your copy with the server's, or removes it if the server deleted it.

When only some changes conflict, the rest are published and the notice names the documents that kept the server copy, such as "Published 3 changes; 1 kept the server copy: Shop."

### Two tabs

A workspace is edited in one tab at a time. Another tab with it open shows it read only, says "Open in another tab." and offers **Take over**. When the first tab closes or leaves the workspace, the second takes over by itself.

## In-game notices

Online players with `gloss.editor.notify` (operators by default) see one chat line when a browser pairs, publishes or is revoked, and when a link cannot be used, such as:

```none
[Gloss]: Steve's editor: Published 3 changes.
```

The player who made a link sees the lines about pairing it, revoking it and failed pairings even without the permission. The console logs each pairing and publish.

## Security

- Treat a pairing link like temporary administrator access to the Gloss files its scopes reach. It works once, within 10 minutes.
- Pair with fewer scopes, or with `folders=`, for someone who should edit only part of the server.
- Revoke tokens you no longer use with `/gloss editor revoke`. **Disconnect** and **Forget server** in the editor do not end a pairing on the server.
- Back up `plugins/Gloss/` before large edits.

## Recovery

If the server refuses a publish, read the reason in the save bar, fix the named document or field, and publish again. For a conflict, choose **Keep mine** or **Use server copy** under **Review changes**. To bring back an earlier version, use **History** in the Server sheet.

Restored config and watched content files, including panel files, apply automatically. Panel restores must satisfy the current revision and identity rules in [Panels](/gloss/16-panels).
