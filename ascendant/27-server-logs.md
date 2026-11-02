---
title: Server logs
description: Open Moderation > Server logs
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, logging
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

Open **Moderation > Server logs**. History shows what Ascendant observed; Settings controls what is recorded and where Discord copies go. Logging and Discord delivery both start disabled.

## Setup

1. Give the bot **View Audit Log** in the server. In each destination channel, allow **View Channel**, **Send Messages** and **Embed Links**. Administrator permission is not required.
2. For message text, enable **Message Content Intent** in the Discord Developer Portal's Bot page and set `DISCORD_MESSAGE_CONTENT_ENABLED=true` in the bot environment. For member joins, departures and member changes, enable **Server Members Intent** there and set `DISCORD_MEMBER_EVENTS_ENABLED=true`. Leave each environment flag false until its portal intent is available.
3. On the VPS, restart with `sudo systemctl restart volmbot` after changing environment flags.
4. In Server logs > Settings > General, turn on recording and set retention. Choose individual event groups in Events. Message text is a separate opt-in in General. A blank message-channel list covers visible server channels; listed IDs restrict message events to those channels. Ignored channels and logging destinations are excluded. Bot and webhook messages are excluded unless Include bots is enabled; Ascendant's own events remain excluded.
5. Choose a default staff logging channel in General. Optional overrides route Messages, Moderation, Members, Voice, Server, Commands and Tickets to separate channels. An event's destination overrides both its category and the default. Enable Discord delivery when the destinations are ready, then save. New matching events are eligible for delivery; existing history is not replayed.

Only an owner with configuration access can save these settings. Owners and administrators with audit access can read history. Review mode lets owners edit temporary drafts and preview synthetic examples, but blocks saving, channel lookup and sending. Discard changes restores the saved settings across all three settings sections.

## Event settings and previews

Events lists the 11 supported event groups with name search, category and enabled/disabled filters. Enabled indicates that the group is selected for recording; recording must also be switched on in General. Each row shows whether its destination is inherited or overridden. Server audit events cover both Moderation and Server categories according to the action Discord supplies.

Open an event to enable recording, set a channel override, or enter a custom Discord title of up to 100 characters. A blank channel inherits the category destination, then the default channel. A blank title uses the default event title. Log destinations and their threads are excluded from message capture to avoid recording delivered copies.

General sets category embed colors using a color picker or six-digit hex value. **Include audit actor in Discord messages** controls whether audit actor details appear in outgoing embeds; it does not remove the actor from retained history or hide message authors.

Responses configures the fallback text for missing content and unknown actors. The example preview uses the current draft settings without saving or sending anything. Select **Show unavailable content and actor** to inspect those fallbacks. Invalid titles, channel IDs, colors or response text are rejected before previewing or saving. The preview uses the same formatter as delivery, including mention neutralization and Discord size limits.

The editor supports event titles and category colors with the existing structured log layout. It does not provide an arbitrary message layout designer or download attachment images.

## What is recorded

- New messages, edits with available before/after text, deletions and bulk deletions. Message IDs, channel IDs and observed authors accompany the events.
- Member joins, departures, nickname/role/timeout changes, when the member intent is enabled.
- Voice channel joins, departures, moves, mute/deafen and streaming/video state changes. Voice audio is not recorded.
- Discord audit entries, including the actor and reason when provided, with selected changed fields. Credentials, raw webhook objects and invite codes are not copied from audit entries.
- Ascendant's supported slash-command invocations, without command argument values.
- Ticket opening, claiming, unclaiming and closing, when **Ticket activity** is selected. Existing saved event selections are preserved, so select this new event explicitly. Ticket events link to their channel and ticket ID without copying private form answers, close reasons or transcripts. See [Tickets](/ascendant/03-tickets).

The list can be filtered by event type, category, actor, channel or recorded text. Expand an event to inspect its details and delivery status. The existing **Message activity** page still supplies Overview counts and its separate latest-message view; Server logs adds event history and optional Discord copies.

## Delivery and limits

Discord copies contain bounded excerpts, with up to five events per message and a delivery cycle approximately every five seconds. Mentions and user-provided link previews are neutralized. Full retained text is available in the dashboard, up to 4,000 characters per event field. Attachments are not downloaded.

History defaults to 30 days, configurable from 1 to 36,500 days with a 100,000-event cap. **Unlimited** (`retentionDays=0`) disables both age cleanup and the archive cap; available disk space remains the limit. Returning to limited retention trims excess or expired records. The delivery queue is capped at 2,000 events. Queue overflow and expiry of undelivered records are counted. Permission failures and uncertain delivery results remain visible. An interrupted or ambiguous send becomes **unknown** and is not automatically retried; inspect Discord before manually recreating a message.

Changing settings cancels pending deliveries and marks in-progress deliveries unknown. This prevents a queued event being sent under a different channel or privacy configuration. Disabling text capture or narrowing its scope removes affected retained text. Changing ignored channels or delivery destinations clears all saved message text, including earlier thread messages whose parent relationships were not retained. Event metadata remains. These changes do not erase copies already delivered to Discord.

The bot records only events it can observe after enabling logging. The separate [Message activity history import](/ascendant/26-server-activity#one-time-history-import) can recover available chat for local statistics and message records; it never creates historical Server log deliveries or reconstructs missed administrative events. A message deletion event does not identify the deleting person; a separate Discord audit entry may identify a moderator. A departure event alone does not prove a kick. Other bots' commands, DMs and actions not exposed by Discord are unavailable. Missing content/member intents and audit permission are shown in the dashboard.

If Discord reports an edit without its new body, later logs show unavailable text instead of treating an earlier body as current. Member and voice events lack a stable event ID; gateway replays can produce duplicate history entries. This is separate from delivery recovery, which never automatically resends an uncertain batch.

## Storage and backups

`COMMUNITY_LOGGING_FILE` defaults to `./data/community-logging.sqlite`. On the VPS use `/var/vhost/volmbot/bot/data/community-logging.sqlite`. Bot and dashboard must use the same file on persistent local disk, outside `htdocs`. Linux database access is restricted to its owner.

Dashboard `.vmbak` archives do not include this database or its logging settings. The stopped-service VPS update backup includes the default bot `data/` folder. For manual backups, stop the service, copy the whole `data/` folder including SQLite companion files, then restart. Include custom database locations separately. Do not copy a live SQLite database file alone.
