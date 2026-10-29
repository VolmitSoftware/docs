---
title: Plugin workspace
description: View releases, beta builds, feedback, tickets and metrics for one plugin
published: true
date: 2026-10-28T00:00:00.000Z
tags: ascendant, plugins, dashboard
editor: markdown
dateCreated: 2026-10-28T00:00:00.000Z
---

Open **Publishing → Plugin workspace** to review one plugin across its connected tools. Search the plugin selector or bookmark the page with `?plugin=<plugin-key>` to return to the same plugin.

## Sections

The workspace combines confirmed Discord release announcements, beta builds, beta feedback, linked support tickets, download totals and saved bStats version distributions. Each section shows a bounded summary and links to its existing management page. Publishing, replies and settings changes still happen through those tools and their existing checks.

The page distinguishes an empty source from disabled collection, incomplete data, unavailable storage or denied access. Refresh reloads the summaries; it does not publish, announce, download artifacts or start a provider collection job. Download and bStats readings retain their source timestamps.

## Access

The plugin selector includes only plugins the signed-in staff member may view. Opening a plugin by URL applies the same checks. Each section also checks the permissions and module state of its source.

Disabling a plugin's tester portal does not hide its retained builds or feedback from authorized staff. Disabling the beta module blocks those sections until the module is enabled again.

Private ticket summaries require administrator or owner access, audit permission and no plugin scope restriction. Permission to view a plugin does not grant access to its private support conversations. See [Support tickets](/ascendant/03-tickets) for ticket handling and transcript access.

## Interpreting the data

Each section lists at most five recent records. Use its management link to inspect more records or work on an item. Counts apply to the selected plugin, and source failures are reported separately so available sections remain usable.

Downloads are platform-reported counters rather than unique customers or sales. The bStats section uses the latest saved version distribution and flags samples older than 24 hours. Open bStats for current server/player charts and collection. These readings cover participating installations rather than every installation. Missing readings remain unavailable instead of being treated as zero.
