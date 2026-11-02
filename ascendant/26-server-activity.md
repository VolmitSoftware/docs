---
title: Server activity
description: Overview shows the last member and boost counts reported by Discord, enabled dashboard modules, open ticket totals, and messages observed by Ascendant
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, activity
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

Overview shows the last member and boost counts reported by Discord, enabled dashboard modules, open ticket totals, and messages observed by Ascendant. Member snapshots refresh approximately every five minutes while the bot is connected. Counts can be approximate; the page shows when Discord was last checked. Ticket totals come from the local ticket database.

Message counting starts when the updated bot connects with `DISCORD_GUILD_ID` configured. It counts new messages from members in that server that the bot can see. It excludes DMs, bots and webhooks, and only fetches old message history through an explicitly started history import. Restarts preserve the total and start date. Messages missed while offline or paused can be recovered through an import if they are still available in Discord.

## Default recording

Metadata recording is enabled by default. Each retained record contains message, channel and author IDs, the observed author name when available, message and observation timestamps, and any observed edit or deletion timestamp. Message text starts off. Attachments and their URLs are not stored or downloaded.

Open **Message activity** to inspect records, filter by channel or recorded text, and page through results. Owners and administrators with audit access can view records. Only an owner with configuration access can change recording settings. Review mode leaves those settings read-only.

Open **Reports > Analytics** for [daily charts and per-member breakdowns](/ascendant/17-community-analytics). Those views use permanent message statistics and remain available when message text capture is off.

## Enable text for selected channels

1. In the Discord Developer Portal, open the bot application, then **Bot > Privileged Gateway Intents**. Enable **Message Content Intent**. Obtain Discord approval first if the application requires it.
2. In `/etc/volmbot/volmbot.env`, set `DISCORD_MESSAGE_CONTENT_ENABLED=true`.
3. Restart with `sudo systemctl restart volmbot`.
4. In **Message activity**, enable **Record message text in selected channels**. Add the intended channel IDs and save. To copy an ID, enable Developer Mode in Discord, right-click the channel, and choose **Copy Channel ID**.

Both the environment switch and selected channels are required. Enabling only the dashboard option shows the missing-intent reason instead of silently recording empty text. Keep the environment switch false until the Discord application has permission for that intent; Discord refuses the gateway connection when an application requests an unavailable privileged intent.

Text is limited to 4,000 characters per message. An observed edit replaces the retained text; previous text revisions are not archived. An observed deletion clears the text and retains the deletion timestamp. Turning text recording off clears retained text, and removing a selected channel clears that channel's retained text. Metadata counting can continue independently.

## One-time history import

Open **Message activity > History import**:

1. Scan Discord channels, then choose all channels or select them by name. Discovery includes text and announcement channels, forum/media posts, active threads, and paginated archived public and private threads that the bot can access. Selecting a parent includes its discovered threads. Up to 10,000 channels and threads can be imported in one job; manual IDs are optional. A partial scan shows which archives were unavailable so missing threads are not mistaken for empty channels.
2. Choose a start and end date (UTC). A blank start includes all available history; a blank end stops at the time the import is started. Review the selected scope before starting.
3. Review archive retention first. Choose Unlimited if you want to keep every imported archive row. Message text still requires the existing text-capture opt-in, selected channels and Message Content intent; metadata imports work without text capture.
4. Confirm **Start import**. The bot reads up to 100 messages every two seconds, one channel at a time. Progress reports messages scanned and eligible messages processed, including messages already known; it is not a count of newly added messages. Channel completion is shown instead of an estimated percentage, because Discord does not supply a reliable historical total.
5. **Pause** stops between batches. **Resume** continues from the saved cursor. A bot restart pauses unfinished imports; rate limits, transient failures or storage errors also pause for review. Inaccessible or excluded channels are skipped with a reason. A completed job can be followed by another import to revisit skipped channels or another date range.

Only an owner with configuration access can start, pause or resume. Owners and administrators with audit access can inspect progress. Review mode blocks starting/resuming and Discord channel lookup; viewing the controls and saved progress makes no Discord requests. Historical messages are written directly into Message activity and analytics. They are never replayed to logging channels or used to send announcements.

The bot needs **View Channel** and **Read Message History** in each selected channel/thread. Discovering all private archived threads also requires **Manage Threads**; without it, discovery still checks private archived threads the bot has already joined. Archive discovery uses [Discord's thread archive endpoints](https://docs.discord.com/developers/resources/channel#list-public-archived-threads), with timestamp cursors for public/private archives and message-style IDs for joined private archives. Ticket privacy exclusions, ignored channels and logging destinations also apply through parent/category relationships. Bots and webhooks are excluded. Import cannot recover deleted messages, past edit versions, historical membership/voice actions or inaccessible channels. The endpoint and permissions are documented in [Discord's Get Channel Messages reference](https://docs.discord.com/developers/resources/message#get-channel-messages).

Job checkpoints live beside the activity database at `<COMMUNITY_ACTIVITY_FILE>.history.sqlite`. Back up both databases and their SQLite companion files while the service is stopped. Imported messages retain their original Discord creation timestamps; archive age limits use collection time.

## Retention and storage

The message archive expires 30 days after collection by default. Choose **Keep for a number of days** (1�36,500 days, with a 50,000-record cap) or **Unlimited** (`retentionDays=0`). Unlimited disables both age cleanup and the row cap. It does not remove disk capacity limits; use System & Updates to monitor storage. Returning to limited retention immediately trims excess or expired archive rows. These settings do not download attachments or preserve past text revisions.

Message statistics are kept separately in the same SQLite database without message bodies: message ID, channel, member/name, original creation time, and known edit/deletion timestamps. Charts and per-member totals survive archive cleanup, and message IDs prevent repeat imports from counting the same message again. Statistics are kept for 400 days, or for the archive retention period when that is longer; deletion records expire with the archive. Expired rows cannot be reconstructed without an import, and the Overview lifetime counter may include rows that no longer exist in the statistics ledger. Analytics counts distinct IDs in the statistics ledger.

The bot and dashboard share `COMMUNITY_ACTIVITY_FILE`. Its default is `./data/community-activity.sqlite`, or `/var/vhost/volmbot/bot/data/community-activity.sqlite` in the VPS example. Keep it on persistent local disk, outside `htdocs`, with access restricted to the service account. SQLite coordinates bot and dashboard writes. Linux database files use owner-only permissions.

Dashboard `.vmbak` archives do not include this database or its recording settings. The stopped-service VPS update backup includes the default bot `data/` location. For a separate manual backup, stop `volmbot`, copy the whole bot `data/` directory including any SQLite companion files, then start the service again. If you override `COMMUNITY_ACTIVITY_FILE`, include that location in your own stopped-service backup as well. Do not copy a live SQLite file alone.

Activity records and server snapshots are separate from the [ticket system](/ascendant/03-tickets). Private ticket channels and configured ticket categories are excluded from generic message capture; ticket transcripts have their own opt-in and access controls.
