---
title: "Bastion: Notification inbox"
description: Saved power warnings, rental reminders, and claim changes
published: true
date: 2026-11-06T00:00:00.000Z
tags: bastion, claims, notifications
editor: markdown
dateCreated: 2026-10-10T09:48:05.000Z
---

The notification inbox saves power warnings, rental reminders, and significant claim changes for recipients who are online or offline. Players open their own inbox with `/bastion inbox`, or through the main menu. The command requires `bastion.command` and does not accept another player's account.

## Reading notifications

The menu supports all/unread filters, pagination, refresh, and individual notification details. Opening a detail does not mark it read automatically; use **Mark as read** or **Dismiss notification**. Refresh is limited to once every five seconds. On login, players with unread entries receive one count and a command hint, rather than the contents of every saved notification.

Each account retains at most 100 records for 30 days. Dismissed records are hidden but still count toward that limit and preserve duplicate suppression. The oldest records leave the inbox when the cap is exceeded. Expired records are excluded from reads and removed from the saved account when it is next written.

## Notification sources

| Source | Recipients | Trigger |
| --- | --- | --- |
| Power | Current claim owner | Estimated remaining power reaches one hour, fifteen minutes, or zero |
| Rental | Current parent owner and tenant | Configured rental reminder thresholds or rental expiry |
| Land | Current claim owner | Creation, including anchored claims, claim/release, merge/split, and child-plot changes |
| Trust | Current claim owner | Changes to membership, roles, bans, child-plot trust, or temporary membership expiry |
| Settings | Current claim owner | Rename, lock, flags, home, welcome, public listing, anchor binding/removal, or administrative power changes |
| Ownership | Former and new owners | Ownership transfer |
| Removal | Owner before removal | Claim removal, including a merged source |

Power notifications follow the configured upkeep policy and are absent while upkeep is disabled. Refueling above a previously reached threshold rearms that warning without deleting the older notification. Rental notifications follow `market` reminder enablement and thresholds; expiry creates its own notice. These saved notices supplement the online power and rental messages.

Notifications retain the event's original names and timestamps. Later claim changes do not rewrite that history. Interface text uses the viewing player's current language.

## Storage

Accounts are stored under `storage/inbox/<player-uuid>.json`.

Power, rental and temporary-trust deadlines are checked during maintenance, so a notice can arrive up to one maintenance interval after its threshold. Expired memberships produce one grouped trust notice per claim; at startup, only expiries from the past 30 days produce notices.

The inbox is stored separately from claim data. If the server crashes after a claim change is saved but before its notification is written, that notification is lost. Startup restores current power and rental alerts but does not recreate past claim-change notices. Storage failures are logged with their stack traces, and failed menu actions are reported to the player.

[Claim welcome messages](/bastion/05-claim-welcome-messages) · [Commands](/bastion/02-commands) · [Bastion](/bastion)
