---
title: Scheduled announcements
description: Schedule saved Discord messages with time zones, reviewed activation and delivery history
published: true
date: 2026-10-29T06:00:00.000Z
tags: ascendant, messages, announcements
editor: markdown
dateCreated: 2026-10-29T06:00:00.000Z
---

Open **Community → Scheduled announcements** to send a message once, daily or on selected weekdays. Owners and unrestricted administrators with View permission can inspect schedules and delivery history. Configure permission allows draft editing; Publish permission is also required to review and arm a schedule.

## Create and review

Create a named schedule and choose its destination channel. Write its message with the shared editor, or open **Message templates** and load a saved copy. Text, embeds and link buttons are supported. Announcements use static content without member variables, and mentions do not notify members or roles.

Choose a time zone such as `America/Denver`, a local time and the recurrence. One-time announcements also require a date. Weekly announcements can run on several selected weekdays. Preview shows the next three available occurrences in the chosen time zone and UTC, alongside the message.

Save the draft, enable the feature, and review the destination and upcoming times before arming it. New schedules start paused. Saving a change to an armed schedule pauses that schedule and requires another review. Changes to a library template do not alter messages already copied into schedules.

Up to 50 schedules can be stored. Discord delivery runs in the connected bot process; keeping the dashboard open is unnecessary. The bot needs View Channel and Send Messages in the destination, plus Embed Links when the message contains embeds.

## Time changes and missed runs

Daily and weekly times follow the selected time zone. If daylight saving skips the chosen local time, that occurrence is skipped. When a local time occurs twice, only its first occurrence is eligible. A one-time date in a clock gap is rejected so staff can choose another time.

An occurrence more than 60 seconds late is recorded as skipped. After downtime, Ascendant advances to future occurrences instead of sending a backlog. A short delay within that grace period remains eligible for delivery.

Use **Pause** to stop an individual schedule. Review and arm it again to resume future occurrences. Turning off **Enable scheduled announcements** and saving also pauses the schedules and requires another review before they resume.

The separate **Modules** controls temporarily block delivery while preserving each schedule's armed state. When that module is enabled and its automation resumes, eligible future occurrences continue; late occurrences are skipped. Already submitted requests may finish; check delivery history before assuming a message was not sent.

## Delivery history and recovery

Delivery history distinguishes sent, failed, skipped and unconfirmed attempts. Successful records link to the Discord message. An occurrence is recorded before it is submitted, and concurrent workers cannot claim it twice.

If a connection closes without a confirmed Discord result, the schedule pauses and the attempt remains unconfirmed. Ascendant does not automatically retry it. Inspect the destination channel, acknowledge the uncertain result, then review and arm future occurrences. Acknowledging does not resend the message.

`ANNOUNCEMENTS_FILE` selects the SQLite data file, defaulting to `./data/announcements.sqlite`. Encrypted backups include schedule drafts and delivery evidence. Restoring requires both services to be stopped, disables the feature and pauses restored schedules. Delivery evidence is retained to prevent an older backup from replaying messages.

Review mode permits local draft editing and previews while blocking activation and Discord sends.
