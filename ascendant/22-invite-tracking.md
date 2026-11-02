---
title: Invite tracking
description: Community > Invite tracking records observed joins, invite credit and milestone levels
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, invites
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

**Community > Invite tracking** records observed joins, invite credit and milestone levels. Tracking, role rewards and log delivery start disabled. The dashboard provides settings, a leaderboard, member totals and editable Discord responses. Review mode allows inspection without saving changes.

## Setup and permissions

Enable the Server Members Intent in Discord's developer portal and enable member events in the bot configuration. The bot needs **Manage Server** to read invite usage counters. Role rewards also require **Manage Roles**, with the bot's highest role above the reward role and the recipient's highest role. Log delivery requires **View Channel** and **Send Messages** in the selected server text or announcement channel.

Save tracking settings and enable tracking. The status on the Tracking page reports whether the bot has established its invite baseline. Settings changes, reconnects and restarts establish a new baseline; historical joins are not imported.

## Credit and attribution

Discord member-join events do not identify the invite used. The bot compares invite counters around a short batch of observed joins. It awards credit only when one invite's increase exactly matches the batch. Multiple changed invites, missing counters, vanished links, permission failures and unavailable baselines leave joins unattributed. Vanity links are recorded separately and do not credit a member.

Bot accounts, self-invites and accounts younger than the configured minimum age receive no credit. The default minimum age is seven days; zero disables the age restriction. A member's first recorded attribution is retained. A previously unknown or excluded join cannot gain credit through repeated rejoining, and a credited member can contribute at most one invite at a time to their original inviter.

With **Track leaves** enabled, an observed departure deducts the original credit; rejoining restores that credit without creating a second invite. Disabling Track leaves keeps the unique credited total. Joins and departures while tracking or the bot is offline are not reconstructed, so these totals describe observed activity rather than a census of current members.

The visible total is unique credited joins, minus tracked departures when enabled, plus manual adjustments, with a minimum of zero. The leaderboard ranks positive totals and uses Discord IDs to break ties. The dashboard separates tracked credit, manual adjustments, vanity joins, unknown joins and excluded joins.

## Levels and role rewards

Each milestone has a name, invite threshold and reward role. Thresholds must increase, and each role can appear in one milestone. A member's invite level is the number of milestones reached; the next milestone shows their next target. Invite levels are separate from chat and voice XP and do not award coins.

Enable role rewards to assign earned roles. Stack mode awards all earned tiers; highest-tier mode replaces lower tracker-owned tiers when a higher tier is earned. **Remove rewards when credit drops** allows removal of previously awarded roles when their threshold is no longer met. Only roles whose assignment was confirmed and recorded by this tracker are eligible for removal. Existing roles and assignments with an uncertain result are never claimed as tracker-owned.

Managed roles, privileged roles, roles above the bot and roles reserved for verification, support, beta access or leveling are unavailable as rewards. Channel permission overrides are checked too. Rewards are reconciled in small batches after changes to totals or settings.

## Commands

| Command | Behavior |
| --- | --- |
| `/invites stats [user]` | Show credit, tracked joins, adjustments and milestone level. Defaults to yourself. |
| `/invites leaderboard [page]` | Show rankings with Previous and Next controls. |
| `/invites inviter [user]` | Show the recorded invite source, vanity source or unknown result. |
| `/invites add user amount` | Add manual credit. |
| `/invites remove user amount` | Remove credit without making the visible total negative. |
| `/invites reset confirmation [user]` | Type `RESET` to reset one member, or omit the member to reset all visible totals. |

Commands are registered in the configured server when the bot starts. Responses are private to the requesting member. Leaderboard controls belong to that member and expire after ten minutes. Add, remove and reset require **Manage Server** or a configured invite-management role. A reset changes the adjustment balance to make the total zero; it preserves attribution and future joins continue to be tracked.

Dashboard administrators with configuration access can make equivalent member adjustments and resets. Saves check settings revisions, and adjustment receipts prevent the same submitted change from being applied twice.

## Logs and response text

The Logs & responses section edits invite-created, invite-deleted, member-joined and member-left messages, plus command responses. Select a log channel and enable log delivery separately from tracking. Replacement variables depend on the message: invite logs use `{code}` and `{inviter}`; join and leave logs use `{user}`, `{inviter}`, `{invites}` and `{attribution}`. Join logs also expose `{code}`. Profile and adjustment responses support `{user}`, `{username}`, `{invites}`, `{tracked}`, `{bonus}`, `{joins}`, `{leaves}`, `{level}`, `{next}` and `{nextLevel}`; adjustments add `{amount}` and reset-all adds `{count}`. Inviter responses add `{inviter}`, `{code}` and `{reason}`. Messages never automatically ping members or roles.

## Storage and recovery

`INVITES_FILE` defaults to `./data/invites.sqlite`; the bot and dashboard must use the same path. The database stores settings, member credit, original attribution, adjustment receipts and confirmed role ownership. Recent join details are bounded to the latest 2,000 events; original member attribution remains durable to prevent repeat credit.

Encrypted application backups include the invite database. Restoring disables tracking, rewards and logs until settings are reviewed. When a current database exists, its tracking totals and role ownership remain authoritative; older attribution records are retained only as excluded historical markers when absent from the current database. Restoring without a current database restores saved credit and history but clears role ownership, preventing removal of roles based on an old snapshot. Databases belonging to another server are rejected.
