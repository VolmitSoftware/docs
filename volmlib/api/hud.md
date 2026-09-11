---
title: "Shared action bars and titles"
description: "Coordinate player overlays between participating Volmit plugins"
published: true
date: 2026-09-10T21:10:39.163Z
tags: "volmlib, api, bukkit, hud, folia"
editor: markdown
dateCreated: 2026-09-10T20:57:00.000Z
---

`art.arcane.volmlib.util.hud` coordinates action bars and titles through shared player metadata. Participating plugins submit priorities and bounded lifetimes so overlapping notices can share available space or yield to a higher-priority claim. Run all player-facing operations on the player's owning thread.

## Action bars

Create a `HudActionBar(plugin)` and call `publish(player, segment)`. A `HudSegment` contains a stable purpose string, priority, lifetime in milliseconds, preferred `HudSlot` positions, and legacy-formatted text. Publishing refreshes the notice; the service handles its refresh and expiry.

`clear(player, purpose)` removes that purpose and redraws the remaining composed action bar. `retire(playerId, purpose)` releases local state without accessing a retired player. Keep independent purposes distinct and clear only the notices your feature owns.

## Titles

Create a `HudTitleService(plugin)` and call `open(player, purpose, priority, ttlMillis)` to obtain a `HudTitleClaim`. Call `resolve()` before sending a title through `ComponentMessenger.showTitle` or `showTitleMarkup`. Send only when the claim wins. Include fade-in, stay, and fade-out time in its lifetime, and release that exact claim when the title finishes.

| Claim method | Behavior |
| --- | --- |
| `resolve()` | Returns whether this claim wins the shared title priority decision |
| `release()` | Releases the claim without resetting the visible title |
| `dismiss()` | Releases the claim and returns whether it sent a title reset; reset requires the current local session and winning metadata bid to still belong to this claim |
| `retire()` | Releases local claim state without accessing the player |

Use `dismiss()` when a replacement notice, setting change, or lifecycle event should remove an unfinished title. A superseded or expired claim cannot dismiss the winning title of another participating plugin. Keep claim identities in delayed cleanup callbacks so an older timeout cannot affect a newer title.

Metadata coordination covers participating HUD producers. Titles sent directly by unrelated plugins without this protocol are outside its ownership tracking. Scheduling and cancellation of feature callbacks remain the consuming plugin's responsibility.

[VolmLib API](/volmlib/api) · [Inventory views and configuration editors](/volmlib/api/inventory-views)
