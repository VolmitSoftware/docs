---
title: Moderation and command access
description: Staff cases, native Discord AutoMod, command restrictions and diagnostics
published: true
date: 2026-10-29T15:05:27.000Z
tags: ascendant, moderation, permissions, diagnostics
editor: markdown
dateCreated: 2026-10-29T15:05:27.000Z
---

The dashboard provides **Moderation cases**, **AutoMod**, **Command permissions** and **Diagnostics**. Owners and unrestricted administrators with View permission can inspect these pages. Configure permission allows settings and case edits; applying native AutoMod changes also requires Publish permission.

New installations have moderation commands disabled, no AutoMod rules and no added command restriction policies. Existing Discord and feature permissions continue to apply.

## Staff actions and case records

Enable moderation commands in **Moderation cases** after checking the bot's Discord permissions and role position. Optionally set a log channel and member direct messages. Notification delivery has its own outcome; a failed log or direct message does not undo a successful action.

Use `/mod` in Discord for staff actions:

| Command | Purpose |
| --- | --- |
| `warn`, `timeout`, `untimeout` | Record a warning, apply a timeout or remove one. Timeout duration is an integer number of seconds, up to 28 days. |
| `kick`, `ban`, `unban` | Remove a member, ban them or remove a ban. Bans do not delete message history. |
| `case`, `history` | Read a case privately or browse recent cases, optionally filtered by member. |
| `note`, `reason`, `void` | Add context, revise a reason or mark a case void while retaining its audit trail. |
| `resolve` | Record a verified result for an action whose outcome was unknown. |

Every command that changes an action or case record uses a private Confirm/Cancel step. Discord permissions and role hierarchy still apply. The dashboard browses cases by member ID, action and outcome, with older-case pagination and revision-checked edits.

Cases distinguish **pending**, **succeeded**, **failed** and **unknown** outcomes. Voiding is a separate record state: it does not remove a timeout, unban a member or turn an unknown action into a confirmed one. If an outcome is unknown, inspect the member and Discord audit log, then use **Record verified outcome** or `/mod resolve` with the evidence. Resolution updates the ledger without retrying or reversing the Discord action. Another matching action remains blocked while its earlier outcome is unresolved.

The ledger covers Ascendant's moderation actions and native AutoMod execution events received by the bot. It does not import every action taken manually or by other bots. Native execution records omit message content and matched keywords.

## Native AutoMod

Create a disabled draft for keywords, suspected spam, Discord word presets or mention spam. Configure message blocking, an optional explanation, an alert destination and eligible timeout actions, plus exempt roles and channels. Discord defines the supported triggers, action restrictions and server rule limits in its [AutoMod reference](https://docs.discord.com/developers/resources/auto-moderation).

Save the draft, preview it, then review the current and proposed rule before confirming **Create**, **Update**, **Disable** or **Delete**. Saving alone does not change Discord. An existing live rule's trigger cannot change; create a new draft for another trigger. Rules created outside this dashboard are shown read-only.

Native rules run in Discord and remain active when Ascendant is offline. There is no general module toggle that turns their enforcement off. Use the reviewed **Disable** or **Delete** action to stop a managed rule. Disabling preserves the saved draft, so a later update can apply its enabled setting again. Deleting removes the live binding while retaining the draft.

An unconfirmed operation stays pending or unknown. **Reconcile outcome** reads Discord to compare the result; it never resends the change. An absent or unchanged result may remain unknown and requires further staff investigation.

## Command restrictions

Choose all slash commands, a parent command/group or a specific subcommand. Policies can disable the selected command or restrict allowed and denied roles and channels. All applicable global, parent and exact-command policies must pass. Any denial wins; empty allow lists add no restriction. Removing a policy restores inherited and feature-specific behavior.

These policies restrict access, including for owners and administrators. They cannot grant missing Discord or feature permissions. See [Discord's permission reference](https://docs.discord.com/developers/topics/permissions) for the underlying permissions that continue to apply.

Channel IDs match exactly: a permitted parent channel does not automatically permit its threads. Add thread IDs separately. Prefix custom commands retain the restrictions in their own editor.

**Role-based simulation** checks the current draft against supplied role and channel IDs without saving it. Passing the simulation is not an access grant or a complete check of Discord permissions, feature eligibility or role hierarchy.

## Diagnostics and storage

Diagnostics shows connection settings, heartbeat freshness, configured intents, command policy storage and the latest live permission and command-registration checks. **Refresh diagnostics** performs bounded read-only Discord requests; it does not register commands or repair permissions. Developer Portal approval for privileged intents is not verified by the configuration check.

Unavailable checks remain **unknown**. Live results older than five minutes are marked unknown until checked again. A disconnected or stale heartbeat is distinct from the dashboard being available; the panel can run while the bot is offline.

| Environment setting | Default file |
| --- | --- |
| `MODERATION_FILE` | `./data/moderation.sqlite` |
| `AUTO_MODERATION_FILE` | `./data/auto-moderation.sqlite` |
| `COMMAND_PERMISSIONS_FILE` | `./data/command-permissions.json` |

Local review mode permits local drafts, case records and command policy simulation while blocking live Discord actions and checks. Validation for this addition used automated tests and local review; no live Discord moderation or AutoMod changes were performed during QA.
