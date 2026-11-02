---
title: Community utilities
description: Open Messaging → Utilities for Polls, Voice rooms, Snipe, Component builder, and Emoji & stickers
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, utilities
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

Open **Messaging → Utilities** for Polls, Voice rooms, Snipe, Component builder, and Emoji & stickers. [Temporary voice rooms](/ascendant/29-temporary-voice) use a join-to-create lobby, owner commands and their own SQLite settings file. **Administration → Server utilities** remains the home for channel counters and shared bot presence. Server logs has its own event delivery and archive settings.

An unrestricted dashboard owner or administrator with Configure access can save utility settings. `COMMUNITY_UTILITIES_FILE` defaults to `./data/community-utilities.json`; the bot and panel must use the same private file. The `community-utilities` module must be enabled, and each Discord feature has its own switch, initially off. Backups include these settings and restore the module and feature switches disabled.

## Polls

Enable Polls, choose whether members may select multiple answers, and set default and maximum durations in whole hours. Defaults are 24 hours and a maximum of 768 hours. The configured maximum cannot be shorter than the default.

Use `/poll create question:Which event? answers:Build contest | Exploration night duration:24`. The duration is optional. Provide 2–10 answers separated by `|`, each at most 55 characters, and a question at most 300 characters. The bot creates a native Discord poll using the saved multiselect setting. Both the member and bot need the relevant channel access, send permission, and Send Polls permission. Threads use Send Messages in Threads. Discord owns voting and closes the poll even while the bot is offline.

The dashboard's sample preview uses your unsaved settings and does not send a poll. Discord documents the 32-day maximum and native voting behavior in its [Poll API reference](https://docs.discord.com/developers/resources/poll).

## Snipe

Snipe lets authorized staff privately retrieve recently deleted or edited text with `/snipe type:deleted index:1` or `/snipe type:edited index:1`. Index 1 is the newest matching entry in the current channel. The requester must currently have View Channel, Read Message History, and Manage Messages; the bot needs View Channel and Read Message History. Message Content intent must be enabled for the bot.

The cache exists only in memory. Defaults are 10 minutes and 10 entries per channel; configurable limits are 1–60 minutes and 1–100 entries per channel. The cache also caps total entries and source snapshots at 1,000 each and truncates message text to 1,500 characters. Restarting the bot clears it. Disabling the feature or changing utility, module, or logging privacy settings clears retained entries when the policy refreshes. Commands refresh policy before showing history.

Bot and webhook messages, private ticket channels, Snipe's ignored channels, logging exclusions, and logging destination channels are excluded, including excluded parent channels and their threads. A logging channel allowlist also restricts capture when configured. Attachment bodies are not downloaded. Messages the bot did not observe cannot be recovered. Snipe uses its own short-lived cache and does not expose the persistent Server logs archive.

## Component builder

Build message text, one embed, and up to five HTTPS link buttons, then copy or download Discord message JSON. The preview uses the same renderer as the dashboard's message tools. JSON import validates the supported fields and reports unsupported components instead of silently removing them. Undo and redo keep up to 50 edits.

Embed controls include title, URL, description, color, image, thumbnail, and footer. Remote preview images load only after you select **Load remote preview images**. Exported payloads disable automatic mentions. The draft stays intact while switching Utilities tabs, but is not persisted across a page reload; export it before leaving. This editor does not post to Discord. It does not support Components V2, select menus, or application callback buttons.

## Emoji & stickers

Enable imports and set the maximum emoji batch size, from 1 to 10. Use `/asset emoji sources:<:name:123456789012345678>` with whitespace-separated custom emoji markup, IDs, or supported official Discord CDN emoji URLs. Use `/asset sticker source:123456789012345678 name:Wave tags:wave` to import a sticker by ID.

The requester needs Manage Expressions, and the bot needs Create Expressions in the destination server. Permissions and feature state are checked again before an upload. Discord enforces available server slots. The private command receipt reports created IDs and any partial failure.

Emoji files are limited to 256 KiB. Sticker imports accept 320×320 PNG, APNG, or GIF files up to 512 KiB; Lottie is not supported. Downloads are restricted to official Discord CDN paths, reject redirects, and are bounded by size and image validation. Discord credentials are never attached to CDN downloads. See Discord's [Emoji](https://docs.discord.com/developers/resources/emoji) and [Sticker](https://docs.discord.com/developers/resources/sticker) references for platform behavior.

## Review and verification

Local review allows draft settings and synthetic previews but blocks saving utility settings and Discord actions. The builder works locally. Settings saves use revision checks; after a conflict or uncertain save result, reload settings before editing again.

Automated checks cover settings validation, access restrictions, revision conflicts, poll payloads and permissions, Snipe expiry and exclusions, and bounded asset imports. Discord calls are mocked in these checks. A production smoke test requires enabling the chosen feature in a test server and registering the new slash commands through the normal bot startup workflow.
