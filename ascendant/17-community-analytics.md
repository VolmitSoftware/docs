---
title: Community analytics
description: Open Reports > Analytics to view member growth, message activity, ticket support, verification, retention, suggestions and recorded moderation
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, analytics
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

Open **Reports > Analytics** to view member growth, message activity, ticket support, verification, retention, suggestions and recorded moderation. Choose 7, 30, 90 or 365 days, or apply custom start and end dates spanning at most 365 inclusive days. Dates use UTC; today includes only the elapsed part of the day. Unrestricted owners and administrators with audit access can read this page; it makes no Discord requests and has no sending controls.

Select an overview metric to change its chart. Daily and weekly views show exact values through pointer selection, keyboard controls and a data table. Weekly counts sum observations; member snapshots use the last observed count in a week. Missing observations remain gaps. Member charts fit their vertical scale to the recorded range, while event counts start at zero. The page refreshes every minute while visible.

**Export CSV** downloads the currently loaded range's aggregate daily counts, retention outcomes and denominators, verification totals, ticket timings and moderation breakdown. The file includes the range, generation time and sample-data marker. Missing values are blank. Member names, IDs and message bodies are not exported. The export remains daily even when a chart is showing weeks.

## Member growth and retention

Member snapshots use observed server counts and include bots. Missing days are not filled with a previous count. Net growth is the difference between the first and last available snapshots in the selected range, not an inferred count for its endpoints. Snapshots require Message activity recording. With Guild Members intent, the recorder samples every five minutes and keeps the latest snapshot per day. Without that intent, it records only a connection/start snapshot rather than repeatedly treating a stale cached count as current.

Retention tracks newly observed, non-bot membership sessions when Message activity and Server logs are enabled, both member join and leave events are selected, and the Guild Members intent is available. Existing server members are not treated as new joins when tracking starts. A rejoin starts a separate membership. Discord describes member event access in its [Gateway intents documentation](https://github.com/discord/discord-api-docs/blob/main/developers/events/gateway.mdx).

The first-week and first-month percentages use memberships whose join date is at least 7 or 30 days old, respectively. They divide confirmed stays by confirmed stays plus confirmed early departures in that mature cohort. Recent joins remain pending, including members already observed leaving early, so an unfinished cohort does not report a misleading failure rate. Missed events, disconnects, restarts and tracking gaps make unresolved outcomes unknown; unknown and pending outcomes are excluded from the percentage. With no confirmed mature outcomes, the percentage is unavailable. The page shows every denominator and the next pending milestone.

The selected dates choose the join cohort. Outcomes continue through the latest observed collection time, which can be later than the selected end date. Membership and verification metadata is retained for up to 400 days in the activity database, with a limit of 50,000 records for each session table. High-volume servers may therefore have shorter retained history. This metadata window is separate from raw message-body retention and does not store message content.

## Verification completion

Verification analytics count memberships that started a valid verification flow in the selected date range. Repeat attempts count once per membership. Completion is recorded only after the configured roles are successfully applied; a challenge attempt or failed role update is not a completion. Tracking requires Message activity recording and enabled verification. Old attempts are not reconstructed from current roles. A zero-start cohort has no completion percentage.

## Message and member activity

The message chart counts unique messages in the permanent statistics ledger by their original creation date, including explicitly imported history. It excludes bots, webhooks and private ticket channels, following Message activity's collection rules. Edited/deleted totals count messages in the selected creation-date window with an observed edit/deletion marker; they are not counts of edit or deletion events performed that day.

The member table shows message totals, edited/deleted messages, active days and the latest observed message. Search by a captured name or member ID, then select a member for their daily breakdown. Names are captured from new messages without looking members up through Discord. Older records may show only an ID. Analytics responses contain counts and metadata, not message bodies.

The action chart counts retained non-message events from Server logs, grouped by the event's occurrence date. Commands, member changes, voice changes, administrative events and ticket lifecycle events count when their event types are enabled. An action count is the number of recorded events, not a count of unique people or a guarantee that every server action was observed.

## Ticket timing

First response is the elapsed time between opening a ticket and its earliest observed reply from a member recognized as support for that ticket. The requester, bots and webhooks do not count. Claiming a ticket does not count as a reply. Support recognition uses the ticket's configured roles or administrator permissions at the observed message; an unverified participant is not assumed to be staff.

Response timestamps are metadata and do not require storing transcript text or enabling Message Content Intent. Tracking begins for newly created tickets after this update. Existing tickets without response tracking are shown as untracked, rather than assigned zero minutes. Unobserved or missed replies cannot be reconstructed from a current claim or username.

Response medians use tracked tickets opened in the selected window that have an observed support reply. Open tickets with no observed reply are shown separately. Closed totals and resolution medians use tickets closed during the window; resolution is elapsed time from creation to closure. Medians show their sample counts. No samples produces an unavailable value. The still-open count describes current retained open tickets created on or before the selected end date, with no start-date restriction. It is not a historical snapshot of tickets that were open then.

Satisfaction is shown as not collected. There is no rating submission history, so the dashboard does not display a score or satisfaction percentage. Response and resolution metrics include non-working hours.

## Suggestions and moderation

Suggestion totals and daily trends count retained submissions by creation date. Pending or unconfirmed Discord delivery does not erase a submitted idea; totals do not measure successful posts. Status counts describe each suggestion's current status, not its status at the selected end date. Moderation groups recorded audit actions by their known action types; unsupported types appear as other recorded moderation. A generic member update is not assumed to be a timeout, and no warning metric is fabricated. Both depend on enabled recording and available retained records.

## Per-staff ticket activity

The staff table counts tickets each verified support member has replied to, using that member's first reply date for the selected window. A ticket counts once per staff member, even if they send several messages. Two staff members helping on one ticket both receive handled credit, so staff totals can exceed the number of distinct tickets. Claims alone do not count.

First-response credit goes only to the earliest verified support responder on the ticket. Closed tickets helped counts handled tickets currently closed by the end of the window; it does not identify who clicked Close. Median first reply measures elapsed time from ticket creation to that staff member's first reply, with its sample count shown. It is not a measure of time since assignment or time between later conversation messages.

Staff participation is recorded as metadata even when transcript recording is off. Existing first-response records can identify their original responder, but earlier replies by other helpers cannot be reconstructed. The page identifies that partial historical coverage. Names come from observed replies, with member IDs as the fallback; no Discord lookup is required.

## Coverage and retention

Message and member statistics survive raw-message archive retention and are kept for 400 days, or longer when archive retention is set above 400 days. Older missing periods can be filled with an explicit [history import](/ascendant/26-server-activity#one-time-history-import). Action and ticket charts still follow their respective record retention settings; Server logs offers Unlimited to retain action history without age or row limits. The page shows source coverage; zeros mean no recorded observations, not proof that a server was inactive. Import does not reconstruct old actions or ticket response times. Private transcript bodies are never included in analytics.

## Local sample data

The dashboard supports a clearly labeled sample view using isolated fixture databases. Synthetic data must remain separate from production activity, logging, ticket, verification and suggestion databases.

Start only the local dashboard with `--review` and process-only overrides for `COMMUNITY_ACTIVITY_FILE`, `COMMUNITY_LOGGING_FILE`, `TICKETS_FILE`, `VERIFICATION_FILE` and `SUGGESTIONS_FILE` pointing to isolated fixture paths. Set `PANEL_REVIEW_SAMPLE_DATA=true` for that process to display the sample-data banner. That marker is ignored outside review mode. Leave these overrides out of `.env` and the VPS service configuration.

Review fixtures should have no live destinations or queued Discord deliveries. Starting the dashboard without the sample process overrides returns to the real data views.
