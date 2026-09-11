---
title: "Web Editor & Sync"
description: "Use the Gloss web editor and live sync"
published: true
date: 2026-09-10T03:09:03.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Use the Gloss web editor to edit menus, panels, holograms, entity overlays, previews, animations, scoreboards, MOTD, emoji, bubble styles, damage indicators, tablist, and Real Drops.

## Open it

| Command | Purpose |
|---|---|
| `/gloss web open` | Open an empty editor |
| `/gloss web edit <kind> <id>` | Edit one document |
| `/gloss web workspace` | Edit all supported documents and images |

Examples:

```text
/gloss web edit menu shop
/gloss web edit hologram spawn
/gloss web edit scoreboard default
/gloss web edit motd motd
```

The command gives you a link with temporary access to the selected content. Do not share it with someone you do not trust.

## Editing

The editor provides forms, JSON editing, undo and redo, image import, and 2D or 3D previews where supported. Preview exact Minecraft rendering, occlusion, sounds, particles, and interaction in game before publishing.

Use the image manager for PNG, GIF, and supported Minecraft skins. Imported assets are saved under `plugins/Gloss/images/`.

## Customization by surface

Visual inspectors edit the same document fields used by Gloss. Code and Split views expose the JSON alongside validation and field completion. Display controls apply to the TextDisplay surfaces that support them; scoreboard, tablist, MOTD, and chat previews use their own client formats.

| Surface | Authoring controls | Preview and runtime reference |
|---|---|---|
| Menus | Components, icons, actions, toggles, layout, interaction limits, visibility conditions, shared icon styles, text boxes, and particles | Menu canvas and [components and hitboxes](/gloss/10-components-hitboxes) |
| World panels | Root menu, world binding, position, rotation, scale, follow behavior, visibility, ranges, and `show` | Linked menu flow map and [panels](/gloss/16-panels) |
| Container previews | Target matching, all element types, expressions, root text/item styles, per-element styles, label boxes, card geometry and colors, and particles | Container card and [container previews](/gloss/15-container-previews) |
| Holograms | Ordered text, world placement, visibility, shared display style, box, and particles | Hologram over the rendered world and [holograms](/gloss/04-holograms) |
| Entity overlays | Ordered text, Insight and spacer rows, root/row `show`, health segments, hit duration, range and exclusions, full display style, box, and particles | Named, damaged, React stack and Adapt Insight samples over the rendered world; [entity overlays](/gloss/20-entity-overlays) |
| Bubble styles | Selection, trusted prefix, wrapping, lifetime, motion, follow/hide settings, visibility, display style, box, and particles | Chat sample over the rendered world and [bubbles](/gloss/08-bubbles-indicators-drops) |
| Damage indicators | Damage/healing admission, conditional variants, audience, text, offset, lifetime, motion, display style, box, and particles | Damage, healing and critical-hit samples on the Minecraft stage; [indicators](/gloss/08-bubbles-indicators-drops) |
| Real Drops | Display limits, conditional plans and audience, models, label placement/style/box, physics, animation timelines, modifier expressions, and particles | Drop stage over the rendered world and [Real Drops](/gloss/08-bubbles-indicators-drops) |
| Animations | Frames, timing, playback settings, and visibility | Animated text and [text animations](/gloss/07-emoji-text-animations) |
| Scoreboards | Conditional presentations, title and line formats, update rates, and visibility | Sidebar and [scoreboards](/gloss/05-scoreboards-groups) |
| Tablist | Header/footer rows, list-name presentations, selection, update rates, and root/channel visibility | Player list and [tablist](/gloss/06-tablist-motd) |
| MOTD | Text variants, icons, server-list settings, and visibility | Server list and [MOTD](/gloss/06-tablist-motd) |
| Emoji | Text/image definition, aliases, permission, and visibility | Chat sample and [emoji](/gloss/07-emoji-text-animations) |

The 3D previews draw the client's own block and item models and textures in WebGL2, over a rendered block world, with a shared orbit camera: drag to orbit, wheel to dolly, right-drag to pan, and WASD (with space and shift for height) to fly while the stage is focused. Entities are textured rigs for the player and for zombies, skeletons, creepers, pigs, cows, and sheep, and a catalog sprite billboard for every other mob. Text — holograms, drop labels, bubbles, damage numbers, and overlay lines — is drawn by the browser in a layer that shares the same camera, so it is never hidden behind geometry. A browser without WebGL2 shows a rendered still of the world and sprites instead of models.

The shared display style includes billboard, alignment, shadow, see-through rendering, ARGB background, opacity, line width, paired block/sky light, view range, culling dimensions, glow color, and independent XYZ scale. Box controls add padding, background, and a complete border. A partial style object uses shared field defaults; an omitted style uses the surface's documented defaults. See the [display contract](/gloss/20-entity-overlays#style-and-decorations).

Container cards also expose padding, border width, tray padding, title height and gap, background and tray colors, and optional border/title color overrides. Root text and item styles supply defaults to elements; an element can supply its own style. A label's explicit background overrides its resolved style background.

Visibility fields accept a boolean or a Gloss expression. The preview evaluates them against sample player, server, time, and surface-specific values. `false` is retained through editing and export. Live permissions, regions, metrics, and PlaceholderAPI results still depend on the server. See [expressions and placeholders](/gloss/13-expressions-placeholders).

TextDisplay previews support authored MiniMessage, legacy colors, expressions, emoji, and text animations. Entity names and Adapt Insight details remain literal data. Bubble prefixes use authored formatting, while player chat remains literal. Particle controls support the applicable whole-surface, component, line, and named-text-span targets; see [particles](/gloss/25-particle-layers).

Global feature switches, service limits, and defaults remain in `gloss.toml`. The document editors do not replace that configuration file; see [configuration](/gloss/02-configuration).

## Document IDs and files

Menus, holograms, animations, scoreboards, emoji, bubble styles, and container previews can have separate named documents. These runtime settings have one canonical document:

| Surface | Runtime ID | Export path under `plugins/Gloss/` |
|---|---|---|
| Entity overlays | `default` | `entity-overlays/default.json` |
| Damage indicators | `default` | `damage-indicators/default.json` |
| Real Drops | `default` | `real-drops/default.json` |
| Tablist | `tablist` | `tablist.json` |
| MOTD | `motd` | `motd.json` |

Creating a singleton opens its existing workspace document. Importing or applying a template updates that document, and singleton duplication and renaming are unavailable. This prevents editing a second file the server would not load. Entity overlays use schema 2, holograms schema 3, bubble styles schema 5, and damage indicators and Real Drops schema 4; see [data files](/gloss/03-data-files).

## World panels and flow maps

A menu flow map stores the workspace layout and can hold a linked runtime world panel. Use **Create world panel** to provide its ID, root menu, world key, and world UUID, or **Import world panel** to read an existing definition. **Export world panel** writes the runtime panel without the local flow-map layout.

Panel edits support undo and redo. Duplicating a linked panel gives the copy a separate runtime ID and UUID. A flow map alone is editor data and has no in-game preview. See [panel authoring](/gloss/16-panels#browser-authoring).

## Seeded randomizer

**Randomize document** generates a complete editable sample for the selected surface. Enter a seed and choose **Generate**, or use **Next seed** for another sample. The same seed, current document identity, and workspace assets reproduce the same result. Each generated document is one undoable edit; menu and container canvases fit the generated content automatically.

Across seeds, samples vary text effects, conditions, display styles, boxes, particle shapes and targets, component/icon/action types, preview elements, and the surface's motion or selection settings. Entity samples also vary row order and Insight placement. Real Drops samples vary model, label, animation, and modifier settings. These examples are ordinary authored JSON and can be edited or exported.

Samples exercise the supported finite choices across multiple seeds. They do not enumerate every text expression, numeric combination, custom asset, provider, or plugin value. Use the inspectors and Code view to author combinations beyond the generated examples.

Linked world panels can be randomized while retaining their identity, world binding, and root-menu reference. A flow map without a linked runtime panel cannot be randomized. Component and preview-element randomization also remain available in their inspectors.

Sample damage, health, viewer state, React counts, and Adapt Insight controls affect the preview only. Configure Adapt's `restrictGlossToInsight` option in Adapt itself; the editor does not change that adaptation setting.

## Publish

Publishing validates the changed documents and images, then writes them to `plugins/Gloss/`. Invalid content is refused and the current server files stay unchanged.

If the server file changed after the editor opened, refresh the session before publishing so you do not overwrite newer work.

## Sessions

| Command | Purpose |
|---|---|
| `/gloss web sessions list` | List active sessions |
| `/gloss web sessions status <session>` | Show one session |
| `/gloss web sessions pull <session>` | Check for pending editor changes now |
| `/gloss web sessions revoke <session>` | End access immediately |

Session IDs may be shortened to a unique prefix of at least 12 characters.
Only one pull or revoke operation can run for a session at a time. After a pull command completes,
the session is immediately available for revocation.

## Security

- Use HTTPS for the editor link.
- Treat an edit or workspace link like temporary administrator access to the included Gloss files.
- Revoke sessions when editing is complete.
- Back up `plugins/Gloss/` before large workspace edits.
- Do not expose images or text containing secrets; workspace sessions include the selected files.

## Recovery

If publishing fails:

1. Read the validation message in the editor.
2. Fix the named document or field.
3. Refresh if the server reports a revision conflict.
4. Publish again.

Restored config and watched content files, including panel files, apply automatically. Panel restores must satisfy the current revision and identity rules in [Panels](/gloss/16-panels).
