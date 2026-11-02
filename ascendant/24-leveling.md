---
title: Leveling
description: Community > Leveling controls message, reaction and observed voice XP
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, leveling
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

Community > Leveling controls message, reaction and observed voice XP. Leveling starts disabled. Settings and member totals live in `LEVELING_FILE` (default `./data/leveling.sqlite`), separate from message logging. Keep this database outside the public dashboard assets.

## Setup and access

Enable leveling and save its settings in the dashboard. Only the owner or an unrestricted dashboard administrator can access this page. Review mode permits local previews but blocks settings changes, XP adjustments, resets and Discord directory lookups.

The bot registers `/rank`, `/leaderboard`, and `/level` as server commands. `/level add`, `/level set`, and `/level reset` require Manage Server or a configured leveling management role. Reset buttons are bound to the initiating member, expire after 60 seconds, and reject a changed configuration. Dashboard member resets require typing `RESET` and choosing the XP track. Use `/level reset` for a whole-server reset.

The bot requests message, reaction and voice events. XP does not require message text and does not import past activity. Reset-on-leave requires the configured Guild Members intent; enable it both in the bot configuration and Discord Developer Portal. Discord documents these requirements in its [Gateway intents reference](https://discord.com/developers/docs/events/gateway#gateway-intents).

## Earning XP

- Message XP selects an integer from the configured inclusive range. Bots, webhooks, members awaiting membership screening, excluded channels/categories/roles and support ticket channels do not qualify. Thread exclusions include their parent channel and category.
- Reaction XP is optional and rewards the message author once per reacting member and message, regardless of emoji. Self reactions, bot reactions and excluded members do not qualify. Both members and the message must be available in the bot cache; messages older than 24 hours are ignored. Message and reaction awards share the chat cooldown.
- Voice XP requires at least two eligible humans in the same voice channel. AFK, deafened, suppressed and excluded members do not qualify. Muting alone does not disqualify a member. Only completed observed intervals count. Disconnects, changed settings or voice membership/state changes restart observation; offline time is never credited.
- Daily streaks use UTC dates. The bonus starts on the second consecutive eligible activity day and is capped by the configured maximum. With 0.05 per day and a cap of 1, the largest bonus is an additional 100%.
- Role boosts either use the highest matching multiplier or combine their adjustments as `1 + sum(multiplier - 1)`, with a minimum of zero. The matching channel multiplier and streak bonus multiply that result. An award is capped at 1,000,000 XP; total XP is capped at 1,000,000,000,000.

Duplicate receipts and cooldowns prevent repeated events from earning XP twice. Message leaderboard counts are accepted XP-eligible message events, not all server messages. Voice time counts eligible completed intervals, not total connected time. Use Analytics for broader observed message activity.

## Progression and rewards

Fixed progression uses the same XP requirement for each next level. Formulas accept numbers, `{level}`, parentheses and `+ - * / ^`; `{level}` means the next level being reached. For example, `100 * {level}^2` requires 100 XP for level 1 and another 400 XP for level 2. Requirements round upward and must remain positive and at most 1,000,000,000 for every level through 1000. Preview validates the full range and displays the first ten requirements.

Changing a curve recalculates levels from existing total XP. Separate voice progression keeps independent chat and voice totals, rewards and notifications. Switching combined/separate mode does not migrate existing XP between tracks.

Role rewards may stack or retain only the highest qualifying reward per track. Saving rewards validates the bot's role hierarchy and permissions. Managed, privileged, reserved support/verification/beta and leveling-management roles cannot be rewards. Runtime checks repeat before assigning roles. Only roles previously assigned and recorded by leveling are eligible for automatic removal. Discord's [role hierarchy rules](https://discord.com/developers/docs/topics/permissions#permission-hierarchy) still apply.

Coin rewards pay into the [Economy wallet](/ascendant/19-economy). Enable Economy and its leveling rewards integration to pay newly reached milestones. Configure a starting level and optionally a repeating interval here. Multiple matching rewards either sum or use the highest amount. A per-member, per-track milestone ledger prevents paying the same level twice, including after reducing XP, resetting data or leaving and rejoining. Milestones reached while coin payouts are disabled are not paid retroactively.

Manual XP edits do not award coins or send level-up notifications. Levels crossed by an upward manual edit are marked as already claimed. Discord XP commands reconcile reward roles immediately; dashboard edits and resets reconcile on the member's next eligible XP event. Configuration changes also reconcile on a subsequent eligible event. Failed Discord sends are logged and are not automatically retried.

## Appearance and text

Rank card colors are editable with a sample preview and contrast readings. `/rank` attaches a generated PNG showing level, rank, XP and earned coins; the member name and full profile remain in the Discord reply.

Chat and voice notifications each support a destination channel, optional direct message, editable content/embeds/link buttons and JSON import/export. An empty destination uses the activity channel when it accepts messages. Enabling mentions permits only the member receiving the level-up message; role, everyone and here pings remain disabled. DMs never ping.

Responses and leaderboard labels expand into editable text fields. Common variables include `{user}`, `{username}`, `{level}`, `{newLevel}`, `{xp}`, `{xpNeeded}`, `{totalXp}`, `{coins}`, `{messages}`, `{voiceTime}`, `{streak}` and `{guildName}`. Notifications also support `{userIcon}` and `{randomLevelMessage}`. Leaderboards add `{rank}`, `{score}`, `{position}`, `{page}`, `{pages}`, `{pageMin}`, `{pageMax}`, `{from}`, `{to}` and `{total}` where applicable. Unknown variables remain visible rather than being silently removed.

## Data and resets

The database retains member IDs/names, XP, earned coins, eligible activity counters, streak dates, reward-role ownership and reward milestones. It does not store message bodies or voice recordings. XP event receipts expire after 24 hours; adjustment receipts and reward milestones remain to prevent duplicate changes and repeat payouts.

Resetting chat or voice clears that track's XP and activity counter. Resetting all leveling data removes the member's XP profile and streak but preserves the Economy wallet, inventory, duplicate-adjustment receipts and paid milestones. Reset-on-leave follows the same rule when enabled. Leaving always clears recorded ownership of leveling roles, because Discord removes the old membership's roles. Settings saves, dashboard adjustments and dashboard resets are recorded in the panel activity log.

Encrypted bot backups include a consistent SQLite snapshot, including committed writes still in the write-ahead log. Restore requires the offline backup command with both the bot and dashboard stopped. Restoring disables leveling and retains newer reward milestones, XP adjustment receipts and recorded role ownership from the current database. Discord roles are not rolled back. If an archive contains no leveling database, restore keeps the current leveling data and disables collection. Review the restored settings before enabling leveling again.
