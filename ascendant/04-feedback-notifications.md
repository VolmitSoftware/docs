---
title: Feedback subscriptions and release notifications
description: Follow beta reports, group duplicates and notify reporters when a linked fix is available
published: true
date: 2026-10-28T00:00:00.000Z
tags: ascendant, discord, feedback, beta
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

## Follow a report

Sign in to the tester portal with Discord, open **My reports**, and select a report you submitted. Choose **Notify me when a fix is published** to subscribe. Choose **Stop fix notifications** to unsubscribe.

Subscriptions start off. Only the reporter can change their subscription, and they must still have access to that plugin's beta. Replies and status changes remain visible in the portal. This subscription sends a DM when staff link the report to an available fix; it does not send a DM for each reply or status change.

If the report changes while you are editing it, refresh before saving. The portal also requires you to resolve an uncertain reply before changing the subscription.

## Enable notifications for a plugin

In the beta dashboard, select a plugin and open its feedback area. An owner or administrator with both configure and publish permission can choose **Enable published-fix DMs**. Save other beta settings first if they have unsaved changes.

The switch starts off for each plugin. Delivery also requires the Beta module to be enabled, automation to be running, a configured Discord bot and server, and review mode to be off. Turning the plugin switch off stops further delivery while retaining subscriptions and receipts.

## Link a fix

1. Open the report in the staff feedback area.
2. Set its status to **Fixed**.
3. Select **Release containing the fix** and save the report.

The release selector identifies the edition and whether a beta build is published. You can link a draft beta build before publishing it. Ascendant waits for the build to become published before notifying subscribers. A withdrawn or removed beta build does not qualify.

Plugin and modded release choices come from confirmed release announcements recorded by Ascendant. A choice needs a successful original send, a version, and a Discord message destination. Pending, failed and uncertain announcements do not qualify. Confirmed edits update the displayed version of the original release; they do not create another notification identity. These records confirm the Discord announcement, not publication on every marketplace.

Typing a fixed-version label alone does not notify anyone. Changing the label without retaining its matching release link clears that link.

## Group duplicate reports

Staff with feedback editing access can enter the original report's ID in **Duplicate of report ID**. The original must belong to the same plugin. A report cannot point to itself, a duplicate, or form a chain of duplicates. Clear the field to remove the association.

A subscribed duplicate follows the original report's linked fix. Its reporter sees that their report is grouped with another report, but does not gain access to the original reporter, report contents, conversation or internal notes. The DM references the subscriber's own report ID and the released version.

## Delivery history and recovery

Each report's staff view shows its notification receipts:

| Status | Meaning |
| --- | --- |
| Pending | The attempt was recorded before contacting Discord. |
| Sent | Discord confirmed the DM. |
| Skipped | Access, consent or delivery availability changed before sending. |
| Uncertain | Delivery could not be confirmed, or a previous process stopped with an attempt pending. |

Ascendant checks current membership, beta roles and subscription consent before delivery. Messages contain the plugin name, the reporter's own report ID, the edition and version, and either a confirmed announcement link or directions to the beta library. Report details and internal notes are excluded. Mentions are disabled.

The worker checks about once a minute and processes at most 20 candidates per check. A report retains at most 20 release receipts. Reaching that limit stops further notifications for the report. Repeated checks, status toggles, resubscription and announcement edits do not resend a recorded release.

Skipped and uncertain attempts are not automatically retried. Check the report and Discord before contacting a member manually. A backup restore disables feedback notifications, preserves current opt-outs and delivery history, and treats interrupted attempts as uncertain. Restoring onto a fresh installation leaves restored reports unsubscribed. Review settings before enabling delivery again.

## Scope

These controls apply to reports submitted through the beta tester portal. General GitHub issue reminders use the separate issue follow-up tools; they do not grant access to beta reports or subscribe GitHub participants to DMs.
