---
title: "Modules and Behavior"
description: "Foundation module lifecycle and implemented player-facing behavior"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "foundation, modules, features"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Each Foundation module can be enabled or disabled separately. Disabling one removes its commands and listeners and restores temporary player state where needed.

## Teleport behavior

Foundation rejects missing worlds, invalid coordinates, world-border exits, and unsafe landings unless the caller has a bypass permission. Warmups can cancel on movement or damage. Successful teleports are added to the player's bounded `/back` history.

## Profiles and social state

Foundation stores homes, social choices, balances, moderation state, mail, kit cooldowns, and other player data by UUID. Private messages respect visibility, recipient choices, ignores, and configured length limits. Social spy is permission-gated and opt-in.

AFK activity tracking clears state on configured player actions. Vanish only manages Foundation's own visibility layer and does not claim ownership of another plugin's hidden-player state.

## Economy and worth

Economy is disabled by default. It enforces configured balance limits and validates both accounts before a transfer.

`/balancetop` scans profiles asynchronously and obeys the configured scan limit.

Item prices live in `worth.toml`. `/worth` opens the category browser, where administrators can right-click an item and enter its price. Held-item sales are immediate; whole-inventory sales require confirmation before items are removed.

## Moderation, mail, and kits

Foundation moderation owns chat and command enforcement only for its persisted mutes, freezes, and jails. Punishment durations accept compound `s`, `m`, `h`, `d`, `w`, `mo`, and `y` units or `permanent`; configured maximums, reason lengths, exemptions, and command allowlists are enforced before mutation. Jails use named locations, remember a return point, prevent travel outside the jail radius, and roll back state if the initial teleport fails.

Mail delivery resolves offline Foundation profiles asynchronously, caps each mailbox, tracks unread messages, and refuses writes in profile read-only mode. Kits are saved atomically in `data/kits.yml`, retain complete Bukkit item metadata, enforce kit-specific permission nodes and persisted cooldowns, preflight inventory space, and either reject or drop overflow according to configuration.

## Administration and item tools

Direct travel, coordinate travel, mass travel, `/jump`, `/bottom`, and offline-location travel all route through entity, region, and teleport safety ownership. `/world` only targets an already-loaded world and does not create, discover, unload, or repair worlds. `/sudo` rejects line breaks, oversized input, exempt targets, and configured command roots before using the target player's dispatcher.

Vanilla item grants validate registry entries, item eligibility, amount caps, and complete inventory capacity before mutation. Repair, enchantment, experience, burn, rest, kill, and portable workstation actions remain permission-separated; unsafe enchantment levels require both configuration opt-in and a dedicated permission.

## Interfaces and cosmetics

The control center shows whether modules are active, disabled, blocked, or failed. Menu colors, sounds, particles, and teleport effects can be changed through `branding` settings.

The same framework supplies the arrival-flair picker. A player can choose from the hot-reloadable particle allowlist, preview the choice, restore the server default, and reuse it for successful teleports and `/celebrate`; count, spread, and monotonic cooldown are operator-controlled.

Teleport feedback can use titles, action bars, and boss bars independently. Foundation shares titles and action bars with other Volmit plugins without clearing their displays. Inventory inspection opens a read-only snapshot.

## Destructive actions

`/suicide` and `/clearinventory` require an exact follow-up confirmation by the same sender within `gameplay.confirmationSeconds`. Inventory clearing also binds the confirmation to the original target, preventing a confirmation from being reused against another player.
