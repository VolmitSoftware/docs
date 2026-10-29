---
title: Operational alerts and release analytics
description: Route incidents, escalate unresolved failures and annotate plugin activity with releases
published: true
date: 2026-10-29T01:34:00.000Z
tags: ascendant, operations, analytics
editor: markdown
dateCreated: 2026-10-29T01:34:00.000Z
---

Use **Operations** to configure private staff alerts and review incident history. Alerts start disabled. Configure destinations and review the settings before enabling automatic delivery.

## Category destinations

The default staff webhook handles categories without an override. Separate destinations can be configured for bot heartbeat, scheduled reports, backups, bStats collection and storage. Each destination has a readable name and a Discord channel webhook URL. Removing an override returns its category to the default destination.

Webhook URLs are write-only through the dashboard. Saved responses show whether a destination is configured, and delivery receipts retain its name. Configuration requires owner access; viewing incidents follows the existing Operations access rules. Preview mode cannot save destinations or send alerts.

## Escalation

Escalation starts disabled and uses its own destination. Set an unresolved duration from 15 minutes to seven days; the default is two hours. An active incident becomes eligible after its initial alert is confirmed and the duration has elapsed. Acknowledging or resolving it prevents escalation.

Each incident can have one confirmed escalation. Definite failures may retry up to three attempts, separated by the alert cooldown. Unknown delivery outcomes block further automatic sends until reviewed, so a lost response does not produce duplicate staff notifications. Escalation does not replace normal reminders or recovery messages.

## Missed scheduled reports

Scheduled report checks watch future expected runs for enabled marketplace download reports and bStats schedules. The grace period defaults to 30 minutes and can range from five minutes to one day. A missed-run incident appears when a watched occurrence passes its grace period without a recorded automatic completion.

Manual report sends do not satisfy a scheduled occurrence. Disabled, paused or changed schedules clear their previous expectation. Enabling monitoring does not generate historical missed-run alerts. Completed failed runs are handled by the existing report-failure checks; completion does not imply successful delivery.

These checks run in the dashboard process. They cannot send while that process or its host is down. An independent uptime monitor remains necessary for host availability.

## Restore behavior

Restoring a backup disables alerts and escalation, clears schedule expectations, and preserves current webhook destinations instead of restoring old credentials. Delivery receipts and escalation evidence remain so confirmed or uncertain sends are not replayed. Review destinations and incidents before enabling alerts again.

## Release annotations

The bStats weekly activity chart includes expandable confirmed release annotations, filtered to plugins the signed-in staff member may view. Each entry includes the plugin, version, edition, original announcement time in UTC and a link to its Discord message. The chart's toggle hides or shows annotations.

Only confirmed release announcements in the configured guild and selected chart window appear. Drafts, pending sends and unknown outcomes are excluded. Editing an announcement does not move its release date. At most 500 recent annotations are returned, with a notice if more match.

Weeks with no metric sample can still show release annotations. Announcement timing is context for the chart, not evidence that a release caused a change in activity. See [Plugin workspace](/ascendant/08-plugin-workspace) for the related release, feedback and metrics summaries.
