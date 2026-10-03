---
title: "Web Editor & Sync"
description: "Use the Gloss web editor and live sync"
published: true
date: 2026-10-03T15:45:53.866Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Use the Gloss web editor to edit menus, holograms, boards, chat surfaces and the other Gloss JSON documents. A screenshot walkthrough is in [Web editor tutorial](/gloss/18-web-editor-tutorial). The hosted editor is at [gloss.volmitsoftware.com](https://gloss.volmitsoftware.com/).

## Open it

| Command | Purpose |
|---|---|
| `/gloss web open` | Open an empty editor |
| `/gloss web edit <kind> <id>` | Edit one document |
| `/gloss web workspace` | Edit all supported documents and images |

```text
/gloss web edit menu shop
/gloss web edit hologram spawn
/gloss web edit scoreboard default
/gloss web edit surface welcome
/gloss web edit motd motd
/gloss web edit connections connections
/gloss web edit inventory example
```

The command gives you a link with temporary access to the selected content. Do not share it with someone you do not trust.

Once it is open: follow the first-run tour or skip it, pick **New document** or **More actions → Templates**, edit in Visual, check Preview, fix issues in Code, then export the JSON or publish the live session.

## Editing

<div class="gloss-demo" data-demo="menu-shop-editor">
<p><strong>Shop menu authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/menu-shop-editor.webm" aria-label="Shop menu authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The editor provides forms, JSON editing, undo and redo, image import, and previews for the document kinds below. Code and Split views expose the JSON with validation and field completion. Dedicated visual controls and local simulation cover a subset of runtime fields. Use the image manager for PNG, GIF and supported Minecraft skins; imported assets are saved under `plugins/Gloss/images/`.

Menu creation supports decorations, buttons, toggles, lists, sliders, fields, and tabs. Lists expose source and page size; sliders expose bounds, step, label, and click width; fields expose label, initial value, and prompt type; tabs expose spacing and editable ids and labels. Structured Extras and Code view retain the full fields, including list templates and flow, styles, and actions. Actions without dedicated controls keep their complete payload in the action's key/value editor.

The menu preview expands the first list page, up to the default 64-entry limit, and binds each entry for text, visibility, and action-log expressions. Slider left-click raises its value and right-click lowers it; Shift uses five steps. Tabs set their session value. Fields open a browser input dialog whose Save button updates the local session value; this previews the form flow rather than opening a Minecraft sign, anvil, or chat prompt. External effects such as commands, economy transactions, inventory windows, and proxy transfers appear in the action log without running against a server.

Hologram lines may contain text strings or objects carrying `text`, `item`, `head`, `block` or `entity`. Editing text, moving lines, copying a document and exporting preserve object content, scale and conditions. Text objects use the text row; other object lines expose their fields in the generic inspector. The hologram stage previews mixed text, item, head, block and entity lines in their authored order, with separate space reserved for each object. Head previews use the bundled player skin. The seven bundled entity rigs use measured bounds; other entity types use catalog sprites with approximate sizing. Custom items without a resolved material use a barrier preview. Verify the native model and skin in game.

Preview exact Minecraft rendering, occlusion, sounds, particles and interaction in game before publishing.

### What you can edit

| Kind | Where it lands | Reference |
|---|---|---|
| Names catalog | `names.json` | [Game-object names](/gloss/13-expressions-placeholders#game-object-names) |
| Strings catalogs | `strings/<locale>.json` | [Localization](/gloss/19-localization) |
| Waypoints | `waypoints/` | Anchor, color, style, range and audience conditions |
| Menus | `menus/` | [Hologram Menus](/gloss/09-menus), [Components & Hitboxes](/gloss/10-components-hitboxes) |
| World panels | `panels/` | [Panels](/gloss/16-panels) |
| Container previews | `previews/` | [Container Previews](/gloss/15-container-previews) |
| Holograms | `holograms/` | [Holograms](/gloss/04-holograms) |
| Entity overlays | `entity-overlays/default.json` | [Entity Overlays](/gloss/20-entity-overlays) |
| Bubble styles | `bubbles/` | [Chat Bubbles](/gloss/08-chat-bubbles) |
| Damage indicators | `damage-indicators/default.json` | [Damage Indicators](/gloss/08b-damage-indicators) |
| Real Drops | `real-drops/default.json` | [Drop Labels](/gloss/08c-drop-labels) |
| Inventories | `inventories/` | Chest GUI resolution, mask, keys and slots |
| Nameplates | `nameplates/` | [Permission-selected holographic player nameplates](/gloss/20-entity-overlays#permission-selected-nameplates) |
| Nametags | `nametags/` | [Permission-selected player identities](/gloss/20-entity-overlays#permission-selected-nametags) |
| Chat channels | `channels/` | [Chat formatting and mentions](/gloss/08-chat-bubbles#chat-channels-and-mentions) |
| Markers | `markers/` | World, player or entity targets, labels, beams, trails and edge indicators |
| Animations | `animations/` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Emoji | `emoji/` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Scoreboards | `boards/` | [Scoreboards & Groups](/gloss/05-scoreboards-groups) |
| Tablist | `tablist.json` | [Tablist](/gloss/06-tablist) |
| MOTD | `motd.json` | [Server List MOTD](/gloss/06b-server-list-motd) |
| Connection messages | `connections.json` | [Connection Messages](/gloss/26-connection-messages) |
| Surfaces | `surfaces/`, one per action bar, boss bar or title | [Velocity Proxy](/gloss/27-velocity#surfaces) |

Creating a singleton — names, entity overlays, damage indicators, Real Drops, tablist, MOTD, connections — opens its existing document instead of a second file the server would not load, so duplication and renaming are unavailable for those. Entity overlays use schema 2, holograms schema 3, bubble styles schema 5, and damage indicators and Real Drops schema 4; see [Data Files & Hot Reload](/gloss/03-data-files).

Inspector controls cover marker anchors, beams, trails and edge indicators; nameplate styles,
boxes, relations and health bars; inventory slots, lists and variants; channel cards, items,
links, filters and variants; and hologram pages, actions, hitboxes and presentation variants.
Menu and overlay variant controls preserve each authored condition and override. MOTD entries
expose weights and conditions, and connection messages include the server first-join section.

Scoreboards, tablists, MOTD and connections have field descriptions and validation in the editor,
with matching JSON schemas in Gloss's `schema/` directory.

Display style, boxes and card geometry use the same fields as the server documents; see [Display style and boxes](/gloss/11-icons#display-style-and-boxes) and [Container Previews](/gloss/15-container-previews).

Visibility fields accept a boolean or a Gloss expression, evaluated in the preview against sample player, server, time and surface values. Live permissions, regions, metrics and PlaceholderAPI results still depend on the server. See [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Text previews support authored MiniMessage, legacy colors, expressions, emoji and animations. Entity names, Adapt Insight details and player chat stay literal data. Particle controls cover the applicable whole-surface, component, line and named-span targets; see [Particle Layers](/gloss/25-particle-layers).

Global feature switches, service limits and defaults stay in `gloss.toml`. The document editors do not replace it; see [Configuration](/gloss/02-configuration).

Strings catalogs provide locale and fallback fields plus editable text entries. Numeric-looking
values and empty strings stay text. Waypoint forms edit world, player, or entity anchors,
color, style, range, and visibility/audience conditions. These catalog views show the saved data;
waypoint client rendering remains a server/client concern.

### 3D previews

The 3D previews draw the client's own block and item models and textures in WebGL2 over a rendered block world. The in-game frame uses a fixed player viewpoint; interactive authoring canvases retain their orbit, zoom, pan, and movement controls. Entities are textured rigs for the player, zombies, skeletons, creepers, pigs, cows and sheep, and a catalog sprite for every other mob. These seven rigs use measured dimensions; other entity sprites use approximate sizes. Mixed holograms preserve text, item, head, block and entity order, with box padding extending outside the row bands. Unresolved custom items use a barrier preview until their provider resolves them on the server. A browser without WebGL2 shows a rendered still instead of models.

### Nametags, nameplates, and mentions

Nametag and nameplate stages render the selected player presentation above a Minecraft player model. Edit the document's assignment permission and each variant's permission alongside their priority and conditions. Preview sample values describe the wearer as `subject` and the reader as `viewer`. Nameplate previews inherit the selected nametag from the same workspace, so `subject.name` shows the composed identity. Enter permission nodes in the preview controls to test document and variant eligibility; these sample grants affect the preview only.

Use **Randomize document** on nametags or nameplates to generate an editable presentation, then adjust its permission assignments before exporting. Chat channels provide ordinary and mentioned-message previews, an enabled switch for mentions, and separate controls for the tagged token, complete highlighted message, and sound key. In-game sound and client rendering follow the saved channel document.

## World panels and flow maps

A menu flow map stores the workspace layout and can hold a linked runtime world panel. **Create world panel** supplies its id, root menu, world key and world UUID; **Import world panel** reads an existing definition; **Export world panel** writes the runtime panel without the local flow-map layout. Duplicating a linked panel gives the copy a separate runtime id and UUID. A flow map alone is editor data with no in-game preview. See [panel authoring](/gloss/16-panels#browser-authoring).

## Seeded randomizer

<div class="gloss-demo" data-demo="seeded-randomizer-editor">
<p><strong>Seeded document generation</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/seeded-randomizer-editor.webm" aria-label="Seeded document generation, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

**Randomize document** generates a complete editable sample for the selected surface. Enter a seed and choose **Generate**, or use **Next seed** for another sample. The same seed, document identity and workspace assets reproduce the same result, and each generated document is one undoable edit.

Samples exercise the supported finite choices across seeds but do not enumerate every expression, numeric combination, custom asset or provider value. A linked world panel can be randomized while keeping its identity, world binding and root menu; a flow map with no linked panel cannot be randomized.

Sample damage, health, viewer state, React counts and Adapt Insight controls affect the preview only. Configure Adapt's `restrictGlossToInsight` option in Adapt itself.

## Publish

<div class="gloss-demo" data-demo="live-sync-editor">
<p><strong>Connected editor publication</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/live-sync-editor.webm" aria-label="Connected editor publication, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

<div class="gloss-demo" data-demo="editor-live-sync-pov">
<p><strong>Published hologram in Minecraft</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/editor-live-sync-pov.webm" aria-label="Published hologram in Minecraft, first person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Select **Publish** explicitly to send local edits from a connected session. Editing and autosave keep a browser draft until publication. Publishing validates the changed documents and images, then writes them to `plugins/Gloss/`. Invalid content is refused and the current server files stay unchanged. If the server file changed after the editor opened, refresh the session before publishing so you do not overwrite newer work.

## Sessions

| Command | Purpose |
|---|---|
| `/gloss web sessions list` | List active sessions |
| `/gloss web sessions status <session>` | Show one session |
| `/gloss web sessions pull <session>` | Check for pending editor changes now |
| `/gloss web sessions revoke <session>` | End access immediately |

Session ids may be shortened to a unique prefix of at least 12 characters. Only one pull or revoke can run for a session at a time.

## Security

- Use HTTPS for the editor link.
- Treat an edit or workspace link like temporary administrator access to the included Gloss files.
- Revoke sessions when editing is complete.
- Back up `plugins/Gloss/` before large workspace edits.
- Do not expose images or text containing secrets; workspace sessions include the selected files.

## Recovery

If publishing fails, read the validation message in the editor, fix the named document or field, refresh if the server reports a revision conflict, and publish again.

Restored config and watched content files, including panel files, apply automatically. Panel restores must satisfy the current revision and identity rules in [Panels](/gloss/16-panels).
