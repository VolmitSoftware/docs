---
title: "Web editor tutorial"
description: "Open the Gloss web editor and export a document"
published: true
date: 2026-09-19T02:47:16.273Z
tags: "gloss"
editor: markdown
dateCreated: 2026-09-18T00:00:00.000Z
---

This page walks through the hosted Gloss editor at [gloss.volmitsoftware.com](https://gloss.volmitsoftware.com/). Use it to author menus, holograms, boards, and the other Gloss documents, then drop the JSON onto the server.

Commands, session security, and per-surface field lists live in [Web Editor & Sync](/gloss/18-web-editor).

## Open the editor

You can work locally in the browser with no server link. Autosave stays in this browser. The server does not change until you export a file or publish a live session.

| How you open it | What you get |
|---|---|
| Visit [gloss.volmitsoftware.com](https://gloss.volmitsoftware.com/) | An empty local workspace |
| `/gloss web open` | An empty editor with a temporary access link |
| `/gloss web edit <kind> <id>` | One document from the server |
| `/gloss web workspace` | Every supported document and image |

Do not share an edit or workspace link. Treat it as temporary administrator access to those Gloss files.

## The first-run tour

The first visit shows a seven-step tour. It names the kind picker, the library rail, the center surface, the inspector, the four editor modes, export, and the command palette.

![The first-run tour highlighting the All kind control, the menu canvas, and the inspector](/gloss-assets/01-tour-kind.png)

Use **Next** to walk the regions. **Skip** hides the tour until the next reload. **Never show the guided tour again** stores that choice in this browser.

The library rail holds the workspace tree. **New document** and **Folder** sit at the top. Each row is one file.

![The tour highlighting the library rail with the workspace tree and New document](/gloss-assets/02-tour-library.png)

Press `?` later if you want the tour again from the command palette.

## The workspace

The shell has four regions:

1. The top bar: document name, import, export, images, language, and more actions.
2. The left rail: the workspace tree, then the contents of the open document.
3. The center: the visual surface, the in-game preview, or the JSON.
4. The inspector: fields for the open document or the selected component.

The status bar reports validation, autosave, and the editor version. Errors there mean Gloss will refuse or misread the file.

## Pick a document kind

The **All** control on the second bar opens the kind list. **All** keeps every file in the rail. A single kind scopes the rail and points **New document** at that kind.

![The document kind menu listing menus, holograms, scoreboards, tab lists, and the other Gloss kinds](/gloss-assets/08-kind-picker.png)

When you open a file from the rail or the document switcher, this control moves to match it.

## Create a document

Select **New document** in the rail. In the **All** view, a full-screen picker shows the available document kinds. Scroll the picker if needed, then choose a kind to create a blank valid file. Use **Cancel**, the close button, or **Escape** to return without creating a file. When the library is scoped to one kind, its New button creates that kind directly.


For a finished sample instead of a blank file, open **More actions** and choose **Templates**.

![The More actions menu with Templates, command palette, Help, and Settings](/gloss-assets/19-more-actions.png)

Each template is valid JSON. It opens as a new document. The file you already had stays unchanged.

![The template gallery with Menu selected, showing starter cards such as Welcome hub and Shop row](/gloss-assets/20-templates.png)

Select a card, then **Create document**.

## Four editor modes

The mode control sits on the right of the second bar. Every kind offers the same four modes. A mode a kind cannot serve stays visible and says why.

![The editor mode menu with Visual, Preview, Code, and Split](/gloss-assets/09-mode-picker.png)

| Mode | Key | What it shows |
|---|---|---|
| Visual | `V` | The kind's own editing surface |
| Preview | `P` | The document as the server draws it |
| Code | `C` | The runtime JSON |
| Split | `S` | The surface and the JSON together |

**Visual** for a menu is the block canvas. Drag a component to move it. Scroll to zoom. Space-drag or middle-drag to pan. `0` resets the view. `F` fits the components.

The inspector on the right edits the whole menu until you select a component. Each `?` beside a field explains what Gloss does with that field.

**Preview** for a menu places the layout in a rendered world. Orbit-drag turns the camera. The action log records clicks instead of running commands on a live server.

![Menu Preview with the title over a block path, orbit camera, uiScale, and an empty action log](/gloss-assets/10-preview-menu.png)

**Code** is the file Gloss will load. Format tidies the buffer. Save writes it back to the document. The footer reports whether the JSON matches the plugin contract.

![Code mode showing the my-menu JSON with line numbers and a Matches the document status](/gloss-assets/11-code-view.png)

## Images

Select **Images** in the top bar. Upload PNG or GIF files for `textImage` icons. Import a Minecraft skin as an 8x8 head, or type a username and **Fetch head**. Download `images.zip` and unzip it into `plugins/Gloss/images/`.

![The Images dialog with upload, skin import, username fetch, and an empty library](/gloss-assets/13-images.png)

Image-icon uploads resize to 16x16. The username is the only value sent to the skin host.

## Export and install

Select **Export** or press the export shortcut. The dialog names the file, the install path, and the test command.

![The Export menu dialog with the my-menu id, download buttons, and install steps for plugins/Gloss/menus](/gloss-assets/12-export.png)

1. Download the JSON.
2. Drop it at the path the dialog shows, such as `plugins/Gloss/menus/my-menu.json`.
3. Grant the permissions the dialog lists.
4. Run the test command, such as `/gloss menu open my-menu`.

Gloss watches most of those folders. You do not restart the server for a new menu file. Live sync from `/gloss web edit` or `/gloss web workspace` can publish without a download. See [Publish](/gloss/18-web-editor#publish).

## Other surfaces

A hologram uses a world stage instead of a menu canvas. Edit the anchor, lines, and display style in the inspector. The center draws the TextDisplay over the block world.

![A new hologram on the world stage with the inspector open on world, position, and billboard](/gloss-assets/15-hologram.png)

A scoreboard uses a sidebar preview. Edit title, lines, priority, and the `when` condition. The sample World, Health, Groups, and Permission fields feed the preview only.

![A new scoreboard sidebar preview with title Gloss, three lines, and the inspector open on selection and presentation](/gloss-assets/16-scoreboard.png)

Tab list, MOTD, emoji, bubbles, damage indicators, entity overlays, and Real Drops use the same shell. Only the center surface and the inspector fields change.

## Keyboard shortcuts

Press `?` for the shortcut sheet. `Cmd+K` (or `Ctrl+K`) opens the command palette.

![The keyboard shortcuts sheet with Global, Artboard, and Preview stage columns](/gloss-assets/17-shortcuts.png)

Useful chords:

| Action | Binding |
|---|---|
| Command palette | `Cmd+K` |
| Export | `Cmd+S` |
| Shortcut sheet | `?` |
| Undo / redo | `Cmd+Z` / `Cmd+Shift+Z` |
| Visual / Preview / Code / Split | `V` / `P` / `C` / `S` |

Click the canvas or the 3D stage once before artboard and camera chords.

## Next

- [Web Editor & Sync](/gloss/18-web-editor) for sessions, publish, and per-surface fields
- [Hologram Menus](/gloss/09-menus) for menu JSON and open commands
- [Holograms](/gloss/04-holograms) for world text
- [Scoreboards & Groups](/gloss/05-scoreboards-groups) for sidebars
