---
title: "Web Editor & Sync"
description: "Use the Gloss web editor and live sync"
published: true
date: 2026-09-19T00:00:00.000Z
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

The editor provides forms, JSON editing, undo and redo, image import, and 2D or 3D previews where supported. Visual inspectors edit the same fields Gloss reads, and Code and Split views expose the JSON with validation and field completion. Use the image manager for PNG, GIF and supported Minecraft skins; imported assets are saved under `plugins/Gloss/images/`.

Preview exact Minecraft rendering, occlusion, sounds, particles and interaction in game before publishing.

### What you can edit

| Kind | Where it lands | Reference |
|---|---|---|
| Menus | `menus/` | [Hologram Menus](/gloss/09-menus), [Components & Hitboxes](/gloss/10-components-hitboxes) |
| World panels | `panels/` | [Panels](/gloss/16-panels) |
| Container previews | `previews/` | [Container Previews](/gloss/15-container-previews) |
| Holograms | `holograms/` | [Holograms](/gloss/04-holograms) |
| Entity overlays | `entity-overlays/default.json` | [Entity Overlays](/gloss/20-entity-overlays) |
| Bubble styles | `bubble-styles/` | [Chat Bubbles](/gloss/08-chat-bubbles) |
| Damage indicators | `damage-indicators/default.json` | [Damage Indicators](/gloss/08b-damage-indicators) |
| Real Drops | `real-drops/default.json` | [Drop Labels](/gloss/08c-drop-labels) |
| Inventories | `inventories/` | Chest GUI resolution, mask, keys and slots |
| Nameplates | `nameplates/` | Holographic text lines, style, box, offset and visibility |
| Nametags | `nametags/` | Name prefixes and suffixes, selection, visibility and collision |
| Markers | `markers/` | World, player or entity targets, labels, beams, trails and edge indicators |
| Animations | `animations/` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Emoji | `emoji/` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Scoreboards | `boards/` | [Scoreboards & Groups](/gloss/05-scoreboards-groups) |
| Tablist | `tablist.json` | [Tablist](/gloss/06-tablist) |
| MOTD | `motd.json` | [Server List MOTD](/gloss/06b-server-list-motd) |
| Connection messages | `connections.json` | [Connection Messages](/gloss/26-connection-messages) |
| Surfaces | `surfaces/`, one per action bar, boss bar or title | [Velocity Proxy](/gloss/27-velocity#surfaces) |

Creating a singleton — entity overlays, damage indicators, Real Drops, tablist, MOTD, connections — opens its existing document instead of a second file the server would not load, so duplication and renaming are unavailable for those. Entity overlays use schema 2, holograms schema 3, bubble styles schema 5, and damage indicators and Real Drops schema 4; see [Data Files & Hot Reload](/gloss/03-data-files).

Display style, boxes and card geometry use the same fields as the server documents; see [Display style and boxes](/gloss/11-icons#display-style-and-boxes) and [Container Previews](/gloss/15-container-previews).

Visibility fields accept a boolean or a Gloss expression, evaluated in the preview against sample player, server, time and surface values. Live permissions, regions, metrics and PlaceholderAPI results still depend on the server. See [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Text previews support authored MiniMessage, legacy colors, expressions, emoji and animations. Entity names, Adapt Insight details and player chat stay literal data. Particle controls cover the applicable whole-surface, component, line and named-span targets; see [Particle Layers](/gloss/25-particle-layers).

Global feature switches, service limits and defaults stay in `gloss.toml`. The document editors do not replace it; see [Configuration](/gloss/02-configuration).

### 3D previews

The 3D previews draw the client's own block and item models and textures in WebGL2 over a rendered block world, with one shared camera: drag to orbit, wheel to zoom, right-drag to pan, and WASD (with space and shift for height) to fly while the stage is focused. Entities are textured rigs for the player, zombies, skeletons, creepers, pigs, cows and sheep, and a catalog sprite for every other mob. Text is drawn in a layer sharing that camera, so it is never hidden behind geometry. A browser without WebGL2 shows a rendered still instead of models.

## World panels and flow maps

A menu flow map stores the workspace layout and can hold a linked runtime world panel. **Create world panel** supplies its id, root menu, world key and world UUID; **Import world panel** reads an existing definition; **Export world panel** writes the runtime panel without the local flow-map layout. Duplicating a linked panel gives the copy a separate runtime id and UUID. A flow map alone is editor data with no in-game preview. See [panel authoring](/gloss/16-panels#browser-authoring).

## Seeded randomizer

**Randomize document** generates a complete editable sample for the selected surface. Enter a seed and choose **Generate**, or use **Next seed** for another sample. The same seed, document identity and workspace assets reproduce the same result, and each generated document is one undoable edit.

Samples exercise the supported finite choices across seeds but do not enumerate every expression, numeric combination, custom asset or provider value. A linked world panel can be randomized while keeping its identity, world binding and root menu; a flow map with no linked panel cannot be randomized.

Sample damage, health, viewer state, React counts and Adapt Insight controls affect the preview only. Configure Adapt's `restrictGlossToInsight` option in Adapt itself.

## Publish

Publishing validates the changed documents and images, then writes them to `plugins/Gloss/`. Invalid content is refused and the current server files stay unchanged. If the server file changed after the editor opened, refresh the session before publishing so you do not overwrite newer work.

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
