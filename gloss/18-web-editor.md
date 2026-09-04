---
title: "Web Editor & Sync"
description: "Use the Gloss web editor and live sync"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Use the Gloss web editor to edit menus, panels, holograms, previews, animations, scoreboards, MOTD, emoji, bubble styles, tablist, and Real Drops.

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

Use `/gloss reload` after restoring files from a backup. Panel file restores also need `/gloss panel reload`.
