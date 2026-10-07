---
title: "Shared action bars, titles, and sidebars"
description: "Coordinate player overlays between participating Volmit plugins"
published: true
date: 2026-10-07T00:00:00.000Z
tags: "volmlib, api, bukkit, hud, folia"
editor: markdown
dateCreated: 2026-09-10T20:57:00.000Z
---

`art.arcane.volmlib.util.hud` coordinates action bars and titles through shared player metadata. Participating plugins submit priorities and bounded lifetimes so overlapping notices can share available space or yield to a higher-priority claim. Run all player-facing operations on the player's owning thread.

## Action bars

Create a `HudActionBar(plugin)` and call `publish(player, segment)`. A `HudSegment` contains a stable purpose string, priority, lifetime in milliseconds, preferred `HudSlot` positions, and legacy-formatted text. Publishing refreshes the notice; the service handles its refresh and expiry.

`clear(player, purpose)` removes that purpose and redraws the remaining composed action bar. `retire(playerId, purpose)` releases local state without accessing a retired player. Keep independent purposes distinct and clear only the notices your feature owns.

## Boss bars

Create a `HudBossBarLane(plugin)` and call `show(player, laneId, options)`. `HudBossBarLane.Options` contains priority, title, progress, color, style, stale lifetime in milliseconds, maximum concurrent bars, and an immutable set of Bukkit `BarFlag` values. Supported flags are `DARKEN_SKY`, `PLAY_BOSS_MUSIC`, and `CREATE_FOG`; a new options value updates existing flags and removes omitted flags. The earlier `show` signatures use an empty flag set.

Keep independent bars under distinct lane IDs. `show` returns whether the shared priority decision grants the bar; `hide(player, laneId)` withdraws only that lane, and `hideAll(player)` withdraws the plugin's lanes for the player. Native client layout determines stacking and appearance.

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

## Sidebar row identities

`art.arcane.volmlib.util.board.BoardProvider` supplies a title and up to 15 sidebar labels. Its
optional `getLineSlots(Player)` returns one unique slot in `0..14` for every rendered label;
returning `null` keeps positional slots. The provider is called for lines before slots and title.
Use `BoardRowSlots.assign(List<String>)` with stable, unique row IDs to keep each surviving row's
slot when rows are filtered or reordered. Keep one allocator per board viewer, and discard it when
that board is removed. An absent row releases its slot for reuse.

`Board.entryForLine(slot)` returns the invisible score entry used by that slot. Numeric scores
still follow the current visual order. Stable slots work with both Bukkit and packet backends;
removed rows reset only their scores, and unchanged surviving text does not require team updates.
Call providers and allocators on the thread that owns the viewer.

[VolmLib API](/volmlib/api) · [Inventory views and configuration editors](/volmlib/api/inventory-views)
