---
title: Support tickets
description: Route private support tickets by plugin, hand off staff assignments and export private transcripts
published: true
date: 2026-10-28T00:00:00.000Z
tags: ascendant, discord, tickets, support
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

## Ticket panels and plugin routes

Ticket panels open private Discord text channels. Each panel chooses a destination category, support roles and up to five intake questions. Configure panels in **Tickets > Panels**, save the settings, review the post and confirm its publication.

Choose **General support** or a catalog plugin in **Plugin route**. Create separate panels when plugins need different categories, support teams or intake questions. A ticket keeps its plugin route and support role IDs from the moment it opens; later panel edits do not move existing channels or change their support team.

Tickets start disabled. Enable ticket creation and the individual panel before posting. Settings allow up to 10 panels, 20 support roles per panel, one to ten open tickets per member and a zero to 3,600 second creation cooldown. The bot checks its Discord permissions and the panel destination before opening a channel.

## Staff assignments and participant access

Open a ticket from the inbox. **Claim ticket** assigns it to the current operator. **People and links > Staff handoff** accepts a Discord user ID and checks that the recipient is a current human member of the ticket's support team before assigning it. Claims and handoffs appear in the ticket timeline.

The requester and support team already have access. Under **Ticket participants**, add up to 10 additional human members or remove an existing participant. Review the member ID and confirm the access change. Added members can read the previous conversation and send messages. Removing a participant applies an explicit channel deny; Discord server owners and administrators retain Discord's administrative access.

Participant changes require configuration and publishing permissions in the dashboard. They also require an open ticket, current ticket revision and enabled ticket system. Closing a ticket locks both the requester and additional participants against sending more messages; it preserves the channel.

If Discord does not confirm a participant change, the ticket records the uncertain result and pauses further actions. **Check Discord access** reads the current overwrite without repeating the change. If it does not match, correct the member overwrite in Discord and check again. A restart also marks any unfinished access change as uncertain.

## Related bug reports and releases

Under **People and links > Bug reports and releases**, choose a record type, plugin and existing record ID. The server verifies the record and supplies its label and destination. A ticket can hold up to 10 distinct references; a ticket with a plugin route only accepts references for that plugin.

Links are available only when the dashboard's report and release integrations are configured. Unlinking removes the reference from the ticket without deleting the report or release. Linking does not copy the private conversation into the referenced record.

## Private transcripts

Enable transcript recording in ticket settings to capture future messages. Message text also requires the bot's Message Content intent in its configuration and the Discord Developer Portal. Enabling capture later does not recover older text.

**Download HTML transcript** produces a readable standalone file with intake answers, requester and assignment details, participants, related record identifiers, captured messages and the ticket timeline. It contains no scripts or external resources. **Download JSON** retains the structured export for other tools. Both downloads require an authenticated owner or administrator with audit access and are served without browser caching; there is no public transcript URL.

Exports contain private support data. Keep downloaded copies restricted to people authorized to review the ticket. The HTML export identifies uncaptured content and incomplete transcripts rather than presenting them as complete records.

Recording is bounded to 5,000 messages and 16 MiB per ticket, with up to three prior edits per message. Closed ticket retention is configurable from one to 90 days. Deleting retained records does not delete separately downloaded copies.

## Dashboard access and review mode

Private ticket data requires an enabled owner or administrator with audit access across the plugin catalog. Ticket actions require configuration permission; closing tickets and changing participants also require publishing permission. Only owners with configuration permission may change ticket settings, and publishing a panel additionally requires publishing permission.

The dashboard rejects stale revisions so two operators cannot silently overwrite each other's work. Refresh a ticket after a conflict. Review mode allows inspection, local panel previews and private exports while blocking mutations and Discord operations.

## Backup restore

The private ticket database is included in configured backups. Restoring it requires both services to be stopped. Restore disables ticket creation and increases revisions. If current storage exists, its ticket histories, participants, references, transcripts, response metrics and publication records take precedence over the older archive, preserving later removals and decisions.

Unfinished channel creations, closures and participant changes become uncertain; they are never replayed automatically. If no current storage exists, archived open tickets and published panel records require manual review before reuse. Review the restored settings and Discord channel state before enabling tickets.
