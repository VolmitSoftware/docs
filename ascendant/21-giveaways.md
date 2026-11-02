---
title: Giveaways
description: Community > Giveaways configures giveaway defaults, entry requirements, messages and activity logs
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, giveaways
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

**Community > Giveaways** configures giveaway defaults, entry requirements, messages and activity logs. Administrators can create giveaways and request early endings or rerolls from the dashboard. These actions are queued for the connected bot; a queued action is not confirmation that Discord received a message.

Giveaways starts disabled. Direct messages to winners and draw logging are separate options and also start disabled. Enable the feature and review the message layouts before creating a giveaway.

## Defaults

| Setting | Default | Range |
| --- | --- | --- |
| Maximum duration | 365 days | 1 minute to 365 days |
| Maximum winners | 20 | 1 to 50 |
| Entrants per page | 15 | 5 to 50 |
| Direct message winners | Disabled | Enabled or disabled |

The entry, odds and entrant-list buttons have editable labels and styles. Giveaway management roles allow selected staff to create and manage giveaways through Discord; **Manage Server** also grants access. Dashboard changes require an owner or unrestricted administrator with the appropriate configuration permissions. Review mode does not enqueue actions or save settings.

## Creating a giveaway

Choose a prize description, a server text or announcement channel, a host, an ending time and the number of winners. The host must be a real server member. The bot checks channel access when processing the request. The dashboard records the request and displays its queued, completed or unsuccessful outcome.

Each giveaway keeps its original entry rules. The host and bot accounts cannot enter. Members use the entry button to join or withdraw. The same member cannot hold multiple separate entries.

Each giveaway supports up to 5,000 entrants. The database allows 50 unfinished giveaways, 100 pending actions and 10,000 historical giveaways. A giveaway can retain up to 100 draws.

## Discord commands

| Command | Purpose |
| --- | --- |
| `/giveaway create` | Set a prize, duration, winner count and channel, with optional entry requirements and a bonus role. The command author is the host. |
| `/giveaway list` | Browse giveaways by page. |
| `/giveaway end` | Queue an early draw using the giveaway ID. |
| `/giveaway reroll` | Queue another draw for an ended giveaway. |

Creation supports `required_role`, `blocked_role`, `server_days`, `account_days`, `invites`, `messages`, `level`, `bonus_role` and `bonus_entries`. The dashboard supports lists of required, blocked and bonus roles. These commands require Manage Server or a configured giveaway management role. The bot must have View Channel, Send Messages, Embed Links and Read Message History in the giveaway channel.

## Entry requirements and bonuses

Requirements can include any one of a list of required roles, absence of all blocked roles, minimum account age, minimum server membership age, invite credit, message count and level. All configured requirement categories must be met. A role cannot appear in both the required and blocked lists.

Minimum invite requirements use the Invite tracking total, including administrator adjustments. Invite tracking must be enabled. Message and level requirements use Leveling's stored message count and chat level; Leveling must be enabled. These are recorded activity totals, not an import of Discord's historical messages or joins.

Every eligible entrant starts with weight one. Matching bonus roles add their configured extra entries, with a combined bonus limit of 1,000. Multiple matching bonuses add together. Bonuses affect selection weight, not the number of prizes one member can win in a draw.

Eligibility is checked when entering and again before the draw. A temporary failure to read a member's current state delays the draw rather than treating that member as ineligible. The entrant list and odds controls respond privately. Odds report the member's weight as a share of the first selection; that share is not the overall chance of winning in a draw with several winners.

## Ending and rerolling

The bot processes due giveaways while connected and enabled. Entries and giveaway deadlines survive restarts. An administrator can request an early ending or reroll from the dashboard or Discord commands.

Draws use weighted random selection without replacement, so a person can win at most once in each draw. Results are stored before Discord announcements or winner notifications are attempted. Delivery errors do not silently select a different set of winners.

Rerolls exclude every previous winner for that giveaway. If fewer eligible members remain than the configured winner count, the draw selects the remaining eligible members.

The giveaway record remains the source of truth for winners if a message cannot be delivered. An unconfirmed message result is shown as uncertain; it is not automatically reposted. Check the target channel before creating a replacement giveaway.

## Messages and logging

The dashboard edits the active giveaway, ended giveaway, entrant list, winner direct message, winner announcement and activity log layouts. The visual editor supports text, an embed and link buttons, with JSON import/export and a preview. Richer saved layouts remain intact until explicitly replaced. Runtime entry controls are added by the bot.

Requirement descriptions and command responses are editable separately. Keep the braces around replacement variables and use the variables listed for that message. Text and embed limits are validated before sending. Messages do not automatically ping roles or everyone.

Enable draw logging and choose a channel to receive completed draw and reroll logs. Creation and settings changes are recorded in the dashboard activity history. Winner direct messages are optional, and Discord may reject them when a member does not accept DMs. A failed notification does not invalidate the recorded result; delivery warnings remain attached to the operation.

## Storage and recovery

`GIVEAWAYS_FILE` defaults to `./data/giveaways.sqlite`; the dashboard and bot must use the same database path. It stores settings, giveaways, entries, operation receipts and draw history. Settings revisions prevent one administrator from overwriting another's saved changes, and action receipts prevent duplicate processing of the same request.

Encrypted application backups include the giveaway database. Restore disables Giveaways and preserves newer current lifecycle and delivery records. Giveaways found only in an older snapshot are locked against automatic publication or drawing, preventing a restore from reopening an ended event or announcing an old result again. Review restored settings before enabling the feature.
