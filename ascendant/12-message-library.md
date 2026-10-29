---
title: Reusable message library
description: Save, preview and reuse Discord messages across Ascendant
published: true
date: 2026-10-29T02:30:00.000Z
tags: ascendant, messages, templates
editor: markdown
dateCreated: 2026-10-29T02:30:00.000Z
---

Open **Community → Message library** to create named templates, search their names and tags, and preview saved messages. Owners and administrators with unrestricted plugin access and View permission can read the library. Configure permission is also required to create or change templates.

## Create and edit

Choose **New template**, enter a unique name, and add a description and tags if useful. Select a message context to see the variables and format supported by that feature. The shared editor supports text, up to ten embeds and one row of up to five link buttons. Individual destinations can have smaller limits.

Edit embeds, fields, authors, footers and images through the form, or import message JSON. Undo and redo apply to the current message draft. Invalid JSON keeps the previous message intact and displays the validation problem. Callback buttons, uploaded attachments and mention permissions are not part of library templates.

Previews use labelled sample values for variables. Saved content keeps the original variables. Remote preview images stay hidden until you choose to load them. A preview does not send a Discord message.

## Reuse a message

Open **Message templates** in a supported message editor. Select a compatible template and choose **Load copy**, then review the draft and save that feature's settings. You can also save the current message as a new library template from this control.

The library is available in Messages, the Utilities message builder, Leveling, Giveaways, Welcome and leave, Invite responses, Custom commands, Auto responses, Self-role panels, Scheduled announcements and logging event titles. Logging accepts plain titles only. Self-role panels and scheduled announcements use static content without variables. Welcome, command and response editors retain their existing format limits. Incompatible embeds, buttons or variables produce a validation message instead of being silently removed.

Loading copies message content only. Destination channels, triggers, permissions, mention rules and enablement remain in the feature's settings. Editing or archiving a library template does not update previously loaded copies or messages already posted to Discord.

## Revisions and recovery

Save creates a revision with its editor and timestamp. The library retains up to twenty previous revisions per template. Restoring a revision creates a new revision, allowing the restoration itself to be reviewed or reversed. Duplicate creates a separate template. Archive hides a template from active selections; it remains available in the archived list and can be restored.

If another administrator changes a template while you are editing it, saving stops with a conflict. Reload the saved version before continuing. An uncertain save response also requires a reload, preventing accidental duplicate submissions. Navigation guards warn about unsaved drafts.

The library holds up to 500 templates, including archived templates. Names are limited to 80 characters, descriptions to 500, and tags to twelve entries of up to 32 characters each. Active names are unique without regard to capitalization.

## Storage and backups

The dashboard stores templates in `MESSAGE_LIBRARY_FILE`, defaulting to `./data/message-library.json`. Keep this file outside the public dashboard assets. The file is included in encrypted backups with the existing bot data.

Restoring a backup advances each restored template's revision beyond both the snapshot and current version, so open editors cannot overwrite restored content with stale drafts. The newest live version is retained in the bounded history. Restoring an older backup that has no library file keeps the current library.
