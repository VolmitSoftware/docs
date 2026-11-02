---
title: Support tickets
description: Route private support tickets by plugin, hand off staff assignments and export private transcripts
published: true
date: 2026-11-01T00:00:00.000Z
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

## Set up a support panel

1. Create a Discord category for private tickets and a text channel where the ticket-opening button belongs. Copy their IDs and the support team role IDs with Discord Developer Mode enabled.
2. Give Ascendant View Channel, Send Messages, Read Message History, Embed Links, Attach Files, Manage Channels and Manage Roles. It also needs Add Reactions and thread creation/send permissions at the server level because it must explicitly deny those permissions when closing tickets. Channel overrides must allow it to manage the ticket category. Administrator is not required.
3. In **Tickets > Panels**, create a panel, enter the IDs, and write its title, description, button label and welcome message. Add up to five intake questions. Plugin, server software/version, problem description and a log link are useful starting questions.
4. In **Settings**, choose the open-ticket limit and cooldown, enable tickets, then save. Enabling tickets does not post a panel.
5. Preview the saved panel, review its destination and permissions, then confirm posting when ready. The review expires after five minutes or a settings change. Updating a known panel edits its existing message when possible.

Only a dashboard owner with configuration access can change settings. Posting a panel also requires publishing access. Dashboard ticket history and transcripts require owner/administrator and audit access; claim actions also require configuration access, and closing also requires publishing access. In Discord, configured support roles and server administrators can claim; the requester or support team can close. Dashboard recovery-key actions are identified as Dashboard in ticket history, with the authenticated identity retained in the dashboard audit log.

## Ticket workflow

The panel button opens a form before creating the ticket. A private text channel is created with explicit access for the requester, bot and support roles; other server members cannot see it unless they have Administrator. Tickets have claim/unclaim and close controls in Discord, and the same actions in the Inbox. Closing requires a reason and denies the requester's ability to send messages, react or create threads. The channel is retained, not deleted. Administrators bypass Discord channel restrictions.

Duplicate interactions are recorded once. Open-ticket limits and cooldowns are enforced in the database. If Discord's response is lost or the process stops during a write, the operation is marked unconfirmed and is not automatically retried. Check Discord before resolving that state. If channel creation succeeds but its welcome message fails, the dashboard can still manage the ticket. Reopening, deleting channels, transferring claims and manually reconciling uncertain operations are not included in this first release.

## Transcripts and logs

Transcript capture is a separate opt-in. Enable Message Content Intent in the Discord Developer Portal, set `DISCORD_MESSAGE_CONTENT_ENABLED=true`, and enable **Record ticket transcripts** in Settings. Both bot and dashboard must use the same `TICKETS_FILE`. Capture begins with newly observed messages; old chat and offline gaps are not imported. Message text, edits and deletion markers are stored as plain text. Attachments are not downloaded.

Ticket detail shows the intake answers, lifecycle timeline and paginated messages. The transcript download is authenticated JSON, with no public transcript URL. Form answers remain part of the ticket even when message capture is off. Disabling tickets or transcript capture clears retained transcript text; it does not erase Discord messages or previously downloaded copies. Closed records, message history and timeline entries expire after the configured 1–90 days; active ticket records are retained. Limits are 5,000 messages and 16 MiB per ticket, three retained edit revisions per message, 100,000 messages overall, 1,000 lifecycle events per ticket and 10,000 closed ticket records. Exports indicate truncation when a bound was reached.

Opening, claiming, unclaiming and closing can also produce metadata-only **Ticket activity** records in **Server logs**. Enable that event type under Server logs > Settings and optionally set a separate **Tickets** destination. Discord copies still require the logging delivery toggle. Form answers, close reasons and transcript bodies are not copied into general logging channels. Ticket channels and configured ticket categories are excluded from generic message logging/activity capture. Channel/category-ID tombstones keep previously designated ticket locations excluded after records expire or a panel is removed.

## Storage

Ticket response and resolution medians are available under **Reports > Analytics**. First-response metadata is recorded for new tickets independently of transcript text capture. An observed reply must come from verified support staff; claiming alone is not a reply. Older untracked tickets remain visibly untracked. See [metric definitions and coverage](/ascendant/17-community-analytics).

### Local sample data

`node scripts/seed-ticket-demo.mjs` creates a sample support panel, four fictional tickets, edited/deleted transcript examples and linked ticket events in a fresh `.cache/ticket-demo/sample-*` directory. It never writes to the live ticket/logging databases and never contacts Discord. The generated `.cache/ticket-demo/latest.json` lists the two database paths. Logging delivery stays off, all destinations are blank, and no panel publication is created.

To inspect the sample, run only the local dashboard with `--review`, setting `TICKETS_FILE` and `COMMUNITY_LOGGING_FILE` for that process to those generated paths. Do not put the sample paths into `.env` or the VPS environment. `node scripts/check-ticket-demo.mjs` verifies the running review dashboard on port 3080 with read-only requests. Restarting the dashboard normally without these process overrides restores the real ticket and logging views.

`TICKETS_FILE` defaults to `./data/tickets.sqlite`; the VPS location is `/var/vhost/volmbot/bot/data/tickets.sqlite`. Keep it on persistent local disk outside `htdocs`. Linux database access is restricted to its owner. Dashboard `.vmbak` archives do not include this database. Stopped-service VPS update backups include the default `data/` folder. For a manual backup, stop the service, copy the whole folder including SQLite companion files, then restart. Include custom paths separately.
