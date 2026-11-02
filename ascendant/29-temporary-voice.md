---
title: Temporary voice
description: Messaging > Utilities > Voice rooms creates a personal voice channel when a member joins the configured lobby, then moves the member into it
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, voice
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

Messaging > Utilities > Voice rooms creates a personal voice channel when a member joins the configured lobby, then moves the member into it. Each member can own one recorded room. Rejoining the lobby returns an owner to their existing active room. Bot accounts do not create rooms.

Temporary Voice starts disabled. An owner or unrestricted dashboard administrator can inspect its settings and room records; configuration access is required to save settings. Review mode displays the feature without saving settings or starting its Discord runtime.

## Setup

1. Configure `DISCORD_TOKEN` and `DISCORD_GUILD_ID` for the server where rooms will run.
2. Create an ordinary voice channel for the lobby and a category for temporary rooms. Stage channels cannot be used as the lobby.
3. Give the bot the permissions listed below. Members need access to join the lobby.
4. Enable the Utilities module. Open Messaging > Utilities > Voice rooms, select the lobby and category, choose any staff roles, and save with room creation enabled.
5. Join the lobby with a member account. The bot creates a public room using the name template and moves the member there if they are still in the lobby.

The bot requests the Guild Voice States Gateway intent to observe joins and departures. Discord lists `VOICE_STATE_UPDATE` under that intent; it is not a privileged intent. [Discord Gateway intents](https://docs.discord.com/developers/events/gateway#list-of-intents).

| Location | Bot permissions |
| --- | --- |
| Lobby | View Channel, Connect, Move Members |
| Destination category and managed rooms | View Channel, Connect, Manage Channels, Manage Roles, Move Members |

The runtime checks channel types, staff roles and bot permissions before creating a room, and checks the managed channel again before changes. A successful dashboard save does not prove that the bot can perform Discord operations.

## Settings

| Setting | Default | Accepted values |
| --- | --- | --- |
| Room creation | Disabled | Enabled or disabled |
| Lobby and category | Unset | Channels in the configured server |
| Room name template | `{user}'s room` | 1 to 80 characters; must contain `{user}`; other placeholders and control characters are rejected |
| Default member limit | 0 | 0 to 99; 0 means unlimited |
| Maximum recorded rooms | 20 | 1 to 50 |
| Creation cooldown | 60 seconds | 10 to 3,600 seconds per member |
| Empty-room grace period | 60 seconds | 15 to 600 seconds |
| Staff roles | None | Up to 10 distinct roles; `@everyone` is not permitted |

The room name substitutes the owner's display name for `{user}` and caps the result at 100 characters. Pending, uncertain and detached records count toward the room limit and continue to reserve their owner's slot. Deleting a room does not clear its creation cooldown.

New settings govern future creations. Existing rooms keep their recorded category, staff roles, name and member limit. The cleanup worker uses the current grace period. Disabling room creation stops new rooms and lobby return moves; existing owners can still use room controls, and confirmed empty rooms still receive cleanup.

## Owner commands

`/room` is registered in the configured server when the bot starts. Only the recorded owner can use these controls, and they must be connected to their active room. Replies are visible only to the member who ran the command.

| Command | Behavior |
| --- | --- |
| `/room info` | Show the room, owner, access mode, member limit and allowed/blocked member counts. |
| `/room name name` | Set a name of 1 to 100 characters without control characters. |
| `/room limit limit` | Set the member limit to 0 through 99. |
| `/room private` | Restrict new joins to the owner, allowed members and configured staff. |
| `/room public` | Allow server members to join, except individually blocked members. |
| `/room allow member` | Allow another non-bot server member and remove their individual block. |
| `/room remove member` | Block another member and disconnect them if they remain in this room. Staff and administrators cannot be removed. |
| `/room transfer member` | Transfer ownership to another non-bot member who is still in the room and does not already own a room or pending creation. The previous owner remains allowed. |

Rooms support up to 80 individually allowed and blocked members combined. Owners receive room access, not Discord channel-management permissions. Staff access does not grant ownership or permission to use another member's `/room` controls.

Private mode does not disconnect people already present. Discord server owners and members with Administrator bypass channel permission restrictions, so private rooms cannot exclude them. [Discord permission rules](https://docs.discord.com/developers/topics/permissions#permission-overwrites).

The bot writes a dedicated set of room permission overwrites for the owner, bot, staff and individual access lists. It does not copy the category's overwrite list. Owner controls replace the room's overwrites, so manually added channel overwrites may be replaced by the next control action.

## Cleanup and interrupted operations

The runtime checks rooms on voice activity and every 10 seconds. It deletes only recorded active voice rooms that remain in their original category and are empty after the grace period. Occupancy is checked again before deletion. A permission or API failure leaves the record for a later check and does not stop cleanup of other rooms.

Restarting or reconnecting clears empty-room timers. A room must receive a fresh observed empty interval before cleanup; offline time does not count. Existing Discord channels remain in place while the bot is stopped. A confirmed missing channel releases its room record. A channel moved to another category or changed to another type becomes detached, and automatic management stops.

| Record status | Meaning |
| --- | --- |
| Creating | The owner slot is reserved while channel creation awaits a result. |
| Open | Discord confirmed the channel and normal controls and cleanup are available. |
| Uncertain | Creation or a room change was interrupted or did not receive confirmation. Automatic controls and cleanup stop. |
| Detached | The recorded channel moved or changed type. The bot no longer manages it. |

An interrupted creation becomes uncertain after restart. The bot does not retry an unknown creation, adopt a channel by matching its name, or delete an uncertain channel automatically. Discord may have accepted the request even when its response was lost.

Staff must inspect Discord and the recorded failure before repairing an uncertain or detached room. Some cases require manual channel repair and storage maintenance. There is currently no dashboard action or `/room` command to clear, adopt or resume these records. Stop both services and preserve a backup before storage maintenance; clearing an unresolved owner record can permit a duplicate room. Restoring a backup does not clear current uncertain records.

## Storage and backups

`TEMPORARY_VOICE_FILE` defaults to `./data/temporary-voice.sqlite`. The bot and dashboard must use the same path. The SQLite database stores settings, room ownership and creation cooldowns, and is bound to the configured Discord server. Revision checks prevent a stale dashboard form from overwriting newer settings.

Encrypted application backups include the database as `temporaryVoice`. SQLite restore requires the offline backup command with both services stopped. Restore disables room creation and advances the settings revision. It restores configuration from the archive while preserving current room records and cooldowns, including transferred ownership, interrupted creations and detached records.

Room records found only in the archive are discarded. Their Discord channels are not recreated, adopted, managed or deleted. If current storage is missing, restore brings back disabled settings with no managed rooms or cooldowns. If an archive predates Temporary Voice, current data is retained with creation disabled. A database belonging to another Discord server is rejected.

Backups do not roll back Discord channels, permissions, membership or ownership effects already applied through Discord. Review the resulting settings and channels before enabling creation again.

## Validation status

Automated checks exercise room lifecycle, permissions, failure handling and SQLite recovery. Live Discord operation has not yet been verified. Before enabling the feature for members, verify lobby creation and movement, each owner control, staff and administrator access, empty-room cleanup, and reconnect behavior in a test server.
