---
title: 11 - Favorites and Ratings
description: Personal island bookmarks, qualified visitor ratings and popularity browsing
published: true
date: 2026-10-21T00:00:00.000Z
tags: skyprime, visitors, favorites, ratings
editor: markdown
dateCreated: 2026-10-09T12:38:43.057Z
---

Players can save islands to a personal favorites list and rate public islands from one to five stars after a continuous visit. Ratings, favorites and island votes are separate records. Players do not need to own an island to use these features.

## Favorites and island details

`/sky favorites` opens a paginated list of saved islands. Use `/sky favorite <island>` and `/sky unfavorite <island>`, or the controls in an island's directory details. Targets accept an island UUID or a unique exact island name. Names may contain spaces, for example `/sky favorite Social Garden`.

Saving requires current access to an active island. You can favorite your own island or a private island you are allowed to visit. A bookmark never grants access: the details and visit controls recheck access when used. If a saved island becomes inaccessible, the favorites menu shows an unnamed unavailable entry with a removal action. Deleted islands are excluded from the list. UUID-based removal works when the target is no longer accessible.

Both commands and menus require `skyprime.use` and `skyprime.social.favorites`; these permissions default to true. The default limit is 100 favorites per player. Removing favorites remains available when social features are disabled.

## Qualifying a visit

Before rating, remain inside another active island's claim for the configured continuous visit, 60 seconds by default. The island must have public access enabled and use the DEFAULT visitor policy. Team members cannot rate their own island. Allowlisted or trusted access to a private island does not qualify.

The visitor must be online, alive, in Survival or Adventure, outside a starter preview and permitted by current entry and dimension rules. `skyprime.use` and `skyprime.social.rate` are required; both default to true. Visit time is sampled once per second and each sample credits at most two seconds, so server stalls cannot inflate it.

Leaving the claim, changing islands, teleporting, changing game mode, dying, disconnecting or becoming ineligible resets the visit. A successful teleport resets it even when the destination belongs to the same island. Cancelled teleports do not reset it. Visit progress is held only in memory: separate visits do not combine, and restarting requires a new visit. The rating menu shows the remaining whole seconds; refresh it to update the display.

## Ratings and withdrawal

Use `/sky rate <1-5> <island>` or the island detail menu to submit a rating. The submission checks current location, access and visit progress. The queued save also checks current island access and membership. Each player has one rating per island; submitting a different star value replaces it.

By default, a player can create or change ten ratings per UTC day and must wait 86,400 seconds before changing the same island's rating. Submitting the same star value again does not consume another daily change. Each changed rating needs a qualified current visit. The daily budget applies across all islands.

`/sky unrate <island>` withdraws your rating without requiring another visit. Withdrawal remains available while social features are disabled or access is lost; use the island UUID if its name is no longer accessible. It does not refund the daily change or clear the original rating cooldown. A withdrawn rating leaves a saved cooldown record, so removing and immediately replacing it cannot bypass the delay.

Current island teammates' saved ratings are excluded from the average, count and popularity score. If a former visitor joins the team, their previous rating stops contributing; it contributes again if they later leave. Island reset and ownership transfer preserve social records under the permanent island UUID. Ratings do not add island credits, value or votes.

## Popularity and browsing

The directory provides the `popular` sort and `favorites` filter. For example:

```text
/sky directory search=* sort=popular filter=public
/sky directory search=* sort=name filter=favorites
```

Popularity first groups islands that meet `minimumPopularRatings`, then islands with fewer positive ratings, then unrated islands. Qualifying islands use this score:

```text
(star total + 15) / (rating count + 5)
```

The five assumed three-star ratings reduce the effect of a small number of reviews. Ties use rating count, case-insensitive island name and island UUID. Below the configured minimum, star averages do not decide ordering. Access checks still apply to every directory entry and visit. `/sky vote` and vote rankings are separate from ratings.

## Configuration

`plugins/SkyPrime/config/social.toml` contains root-level fields:

```toml
enabled = true
maximumFavorites = 100
minimumVisitSeconds = 60
ratingCooldownSeconds = 86400
dailyRatingLimit = 10
minimumPopularRatings = 3
```

| Setting | Accepted values | Effect |
| --- | --- | --- |
| `enabled` | Boolean | Enable new favorites and ratings; removal and withdrawal remain available |
| `maximumFavorites` | 1-1,000 | Personal bookmark limit; lowering it does not delete saved entries |
| `minimumVisitSeconds` | 1-3,600 | Required current continuous visit |
| `ratingCooldownSeconds` | 0-2,592,000 | Delay before changing or restoring a rating on the same island |
| `dailyRatingLimit` | 1-1,000 | New or changed ratings per player per UTC day |
| `minimumPopularRatings` | 1-10,000 | Number of contributing ratings needed for the leading popularity group |

These fields reload live and are available in `/sky config` under `social.<field>`. Invalid candidates retain the previous configuration. Disabling the feature does not erase existing favorites, ratings or cooldowns.

## Storage and recovery

`storage/social.json` version 1 stores player favorites, ratings, withdrawal cooldowns and daily counters separately from island schema 9. Writes are serialized and atomically replaced; success is reported after persistence. Invalid current data prevents startup. A save failure hides social read results and rejects further mutations until the storage fault is corrected and the plugin restarts.

Include this file in data-folder backups and restore it only while the server is stopped. Missing-island references are pruned when loading social data; deleted islands do not remain visible through social reads. Qualification time is never stored. See [Operations and recovery](/skyprime/04-operations-recovery#favorites-and-ratings-storage) and [Placeholders and API](/skyprime/90-placeholders-api#favorites-and-ratings-api).

