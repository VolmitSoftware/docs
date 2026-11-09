---
title: Downloads and usage
description: Store download totals, weekly history, bStats usage and missing data on the dashboard Overview
published: true
date: 2026-11-07T22:00:00.000Z
tags: ascendant, analytics, downloads, bstats
editor: markdown
dateCreated: 2026-11-07T22:00:00.000Z
---

The dashboard **Overview** opens with **Downloads and usage**: platform-reported store downloads and bStats usage for every plugin the signed-in account can view. **Open downloads** and **Open bStats** lead to the full reports.

## What the section shows

- **Total downloads** adds the latest reading of every current, nonduplicate listing. It reads **Partial** when a listing is stale, unavailable, or not collected yet, or when a visible plugin has no listings.
- **Last 7 days**, **Prior 7 days** and **Last 30 days** add the growth of each listing that has saved readings at both ends of that period. A listing added this week does not count its lifetime downloads as growth.
- **Servers on bStats** and **Players on bStats** add the latest bStats readings for plugins with a bStats ID, with the change against the prior week once two weeks of data exist.
- **Downloads per week** shows the last 8 weeks. Each week counts only listings with readings at both ends, so the first weeks after a listing is added read low. A week with no such listing shows **No history**.
- **By platform** lists SpigotMC, BuiltByBit, MCModels, Hangar, CurseForge and Modrinth with each one's total, last 7 days and how many listings were counted.
- **By plugin** lists each plugin's downloads, last 7 days, servers and players, most downloaded first.

Download counts are what each store reports. They include repeat downloads and updates and are not unique customers or sales. bStats covers only servers that send metrics.

## Missing data

When something keeps a plugin out of the totals, the section lists it under **items are missing from these totals** with the place to fix it:

| Message | Fix |
| --- | --- |
| No store listings yet | Add store links for the product in **Products**. |
| Add the numeric CurseForge project ID | Enter the project ID from the CurseForge project page in **Products**. |
| A store error, such as a 404 | The listing is private, not yet approved, or the link slug is wrong. Correct the link in **Products** or wait for the store to publish it. |
| The last successful collection is more than a day old | The store did not answer recent collections. The next collection retries it. |
| Add its bStats plugin ID | Enter the numeric ID from the plugin's bStats page in **Products**. |
| bStats could not be read | bStats did not answer. Refresh the Overview to retry. |

## Platform requirements

| Platform | What collection needs |
| --- | --- |
| SpigotMC | A public resource link. No key. |
| BuiltByBit | A resource link and `DOWNLOADS_BUILTBYBIT_TOKEN` set to a BuiltByBit API token. |
| Hangar | A public project link. No key. |
| Modrinth | A public, approved project link. Drafts and projects under review return 404. |
| CurseForge | A project link, its numeric project ID in **Products**, and `DOWNLOADS_CURSEFORGE_API_KEY` set to a CurseForge Core API key. |
| MCModels | Listings are counted, but MCModels publishes no download count, so its totals show as unavailable. |

A platform without its key shows **Needs an API key** and is skipped during collection. Keys are read from the dashboard environment and require a restart after a change.

## Access and failures

The section loads with the rest of the Overview. If the Downloads or bStats module is disabled or fails, its figures read **Not recorded** and the rest of the Overview still loads. Staff see only the plugins their role can view.

See [Plugin workspace](/ascendant/08-plugin-workspace) for one plugin's downloads and bStats samples, and [Alerts and analytics](/ascendant/11-alerts-analytics) for missed report checks.
