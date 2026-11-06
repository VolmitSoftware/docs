---
title: "Bastion: Public directory and visits"
description: Owner-published claim listings and approved travel requests
published: true
date: 2026-11-06T00:00:00.000Z
tags: bastion, claims, directory, travel
editor: markdown
dateCreated: 2026-10-10T11:30:00.000Z
---

Owners can publish a claim in the public directory with a plain-text description. Visitors request travel to its saved home, and an online owner approves or declines through a separate menu. Claims are unlisted by default, and approval does not grant trust or bypass entry restrictions.

## Commands and menus

| Command | Purpose | Permissions |
| --- | --- | --- |
| `/bastion directory` | Browse listings, search, manage owned listings, or cancel a visit request | `bastion.command` |
| `/bastion listing` | Edit the selected claim's public listing | `bastion.command`, `bastion.manage`, and claim ownership |
| `/bastion icon` | Choose or reset the selected claim's display icon | `bastion.command`, `bastion.manage`, and claim ownership |
| `/bastion visits` | Review incoming visit requests | `bastion.command` and `bastion.manage`; only the receiving owner can decide |

The main menu links to the directory and incoming requests. Claim owners also have a listing-settings control in claim management. Requesting and completing travel additionally requires `bastion.home`.

## Publishing a claim

Set the claim home before publishing. The listing editor provides a description field and a publish/unpublish toggle. Descriptions may contain up to 160 characters on one line; control characters are rejected, surrounding whitespace is trimmed, and formatting markup is displayed literally.

Chat editing expires after 30 seconds. Type `clear` to empty the description or `cancel` to retain it. Saving compares the edited listing with its current value so an older editor cannot overwrite newer changes. Unpublishing retains the description.

Listings show names and descriptions without exact coordinates. Search matches either field without case sensitivity; results sort by name and show 28 entries per page. New searches and refreshes have a five-second cooldown. Page navigation reuses the results, and an early search keeps its query for retry. Browsing uses saved claim data without scanning live blocks or loading chunks. Opening a listing or requesting a visit checks that it is still published.

## Claim icons

Choose **Claim icon** from claim management or run `/bastion icon`. The picker offers 28 approved vanilla materials and a reset control. Clicking a material saves it immediately; the current choice is labeled. The same icon appears in claim lists, management headers, and public directory entries and details. Reset restores each menu's usual icon. Icons are display choices, not items taken from or given to an inventory.

Only the current owner can change a player claim's icon. Trusted members and administrative bypass do not grant this right. Staff use `/bastion server icon` with `bastion.server` for server-owned land. Every click checks current access; a stale icon value cannot replace a newer choice.

Icons survive reload and restart. Transfer retains the icon, split claims copy it, and a merge keeps the destination's icon even when the two choices differ. Icon changes do not publish or unpublish listings, alter trust or protection, or change land costs. Map cells retain their status symbols. Changes appear in the settings category of claim activity.

## Visit approval

Select a listing, then choose **Request a visit**. The owner receives a message directing them to `/bastion visits`, where each request has explicit approval and decline controls. Both players must remain online. The visitor can cancel through the directory. If an open listing has since been unpublished or removed, the request is rejected with a translated availability message.

Each request lasts 60 seconds. A visitor may have one outstanding request and must wait 30 seconds between submissions, including after cancellation. An owner may receive at most ten outstanding requests; the server-wide limit is 256. Pending requests are transient and disappear on restart, plugin shutdown, either player's logout, or relevant listing/home/ownership changes.

Approval checks the current listing, owner, saved home, visitor permissions, and entry rules again before travel. The destination world must be available and the landing position safe; Bastion loads the destination chunk before checking it. A late invalidation detected after teleport sends the visitor back through safe-exit handling.

Entry locks, bans, and child-plot access remain authoritative, even for a visitor with administrative bypass permission. The owner must change those rules separately before an otherwise prohibited visit can proceed. Approval never adds membership or build/container permissions.

## Persistence and claim changes

Listing settings are stored with the claim and survive restart and configuration reload. Ownership transfer clears the listing and description. A merge keeps the destination's listing; a newly split claim starts unlisted. Removing or moving a home out of the retained claim unpublishes that claim while keeping its description.

Listing changes appear as settings changes in claim activity and the notification inbox.

[Capabilities](/bastion/08-feature-map) · [Bastion](/bastion)
