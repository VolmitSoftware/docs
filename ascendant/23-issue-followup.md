---
title: Issue follow-up
description: Use Reports > Issue follow-up to check open GitHub issues across connected plugins
published: true
date: 2026-11-01T00:00:00.000Z
tags: ascendant, discord, github, issues
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

Use **Reports > Issue follow-up** to check open GitHub issues across connected plugins. This covers general bug reports independently of beta feedback. Pull requests are excluded.

## Check reports

Select **Check now** to collect issues and their human replies. Each report shows its plugin, GitHub link, reporter, last human reply, and whether staff or the reporter is waiting. Search, plugin filters, and pagination narrow the results. Incomplete or unavailable repositories are shown explicitly.

Staff can also use `/issues check`, optionally supplying `plugin`, `page`, and `waiting`. Replies are private and do not send reminders. The command defaults to Discord's Manage Server permission; Discord command permissions can change who sees it, but Ascendant still requires a registered staff account with view access to the plugin. Repeated command checks may reuse results for 60 seconds.

Repository selection uses this order:

1. An explicit repository override in Issue follow-up settings.
2. The plugin's GitHub repository in publishing settings.
3. An unambiguous GitHub repository link in the enabled plugin catalog.

Overrides use `owner/repository`. Only GitHub is supported. Public repositories can be read without a token. For private repositories or authenticated API capacity, set `ISSUE_GITHUB_TOKEN` in both dashboard and bot environments, with read access to the repositories and their issues. This feature does not reuse publishing or Scribe credentials and never writes GitHub comments or changes issues.

## Optional channel reminders

Reminders start disabled. An owner or administrator sets a default staff channel, optional per-plugin channel overrides, and enables reminders. Ascendant checks channel access before enabling delivery. Keep the dashboard process running: it owns scheduled checks and delivery; the bot process only handles manual command inspection.

Defaults are a 48-hour waiting threshold, a 72-hour repeat cooldown, and a 30-minute check interval. The minimum interval is 15 minutes. At most 10 reminders are sent per poll; the same issue routed to the same channel is deduplicated across plugins. Disabling or pausing the module stops scheduled work.

GitHub repository owners, collaborators, and organization members count as staff. Add individual GitHub usernames when other support staff should count too. Bot comments do not reset waiting time. Issue edits do not count as replies. A staff reply changes the issue to waiting for the reporter; closed issues disappear on a successful refresh.

Staff with edit access can:

- **Acknowledge** the current human activity, suppressing reminders until new human activity appears.
- **Snooze 24 hours** to suppress reminders temporarily.
- **Resume reminders** to clear acknowledgment or snooze. Existing delivery cooldowns still apply.

An incomplete or failed repository check suppresses reminders for that source. Rate-limit responses delay further API calls. Collection is bounded by page, request, response-size, and time limits, so large repositories may be marked incomplete rather than silently treated as fully checked.

Delivery receipts are saved before sending. If delivery cannot be confirmed, the unchanged activity is marked uncertain and is not automatically retried. Check the channel and module health before investigating that state; a network error does not prove that Discord rejected the message.

## Storage and recovery

`ISSUE_FOLLOWUP_FILE` defaults to `./data/issue-followup.json`. It holds settings, cached reports, acknowledgment and snooze controls, and reminder receipts. Bot and dashboard should use the same file, plugin catalog, publishing directory, staff access file, and owner IDs. `PANEL_ACCESS_FILE` can override the shared staff file; otherwise it is derived from `PANEL_DATA_FILE`.

Backups include follow-up state. Restore disables reminders and the module, clears cached reports, and preserves current delivery controls to prevent old reminders replaying. Reconfigure and check reports before enabling automation again. Review mode blocks collection and mutations and never sends reminders.

## Validation

Automated tests cover GitHub pagination and failures, human reply classification, access scopes, repository selection, private command output, settings and action validation, cooldowns, duplicate suppression, uncertain delivery, review restrictions, and backup recovery. Dashboard tests and an isolated browser smoke test use sample reports. No live GitHub mutation or Discord reminder was sent during implementation.
