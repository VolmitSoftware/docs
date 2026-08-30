---
title: "Modules and Behavior"
description: "Foundation module lifecycle and implemented player-facing behavior"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "foundation, modules, features"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation modules own their listeners, command routes, tasks, integrations, and closeable resources. Disabling a module removes its routes and listeners, restores temporary player state where applicable, and closes resources in reverse activation order.

## Teleport behavior

All Foundation arrival commands use one teleport service. It rejects missing worlds, non-finite coordinates, world-border exits, and unsafe landings unless the caller has the documented bypass. Warmups can cancel on block movement or damage, cooldowns use monotonic time, and every request has an identity token so an older completion cannot replace newer state.

Landing validation runs on the destination region. Paper's asynchronous teleport is used when available; the shared source also compiles against Spigot and has a synchronous owning-thread path there. Successful external and Foundation teleports feed bounded per-player back history.

## Profiles and social state

Homes, back history, ignores, reply partner, social-spy choice, acceptance preferences, economy balance, AFK, vanish, mail, warning state, mutes, freezes, jail state, kit cooldowns, logout location, and seen timestamps use per-UUID profiles. Private messages enforce length bounds, visibility, acceptance, and optional ignore policy. Social spy is both permission-gated and opt-in.

AFK activity tracking clears state on configured player actions. Vanish only manages Foundation's own visibility layer and does not claim ownership of another plugin's hidden-player state.

## Economy and worth

Economy is disabled by default. Balances use a fixed four-decimal internal scale, checked integer arithmetic, configured display precision, maximum-balance enforcement, optional negative balances, and write eligibility checks before mutation. A transfer validates both accounts before changing either balance.

`/balancetop` performs its bounded profile scan asynchronously and sorts a snapshot; the configured scan cap prevents an operator request from traversing an unbounded data set.

Material worth is an immutable runtime snapshot loaded from the independent `worth.toml`. Foundation generates a default for every registered item, classifies the catalog into building, natural, mineral, food, drop, tool, armor, transport, magic, decoration, and miscellaneous views, and fills newly registered items without discarding operator prices. `/worth` opens the category browser; administrators can right-click any item, enter an exact price in chat, and commit only if the file revision still matches. Held-item sales are immediate; whole-storage sales require a same-player timed confirmation, credit the validated bounded total, and only then remove the exact inspected slots.

## Moderation, mail, and kits

Foundation moderation owns chat and command enforcement only for its persisted mutes, freezes, and jails. Punishment durations accept compound `s`, `m`, `h`, `d`, `w`, `mo`, and `y` units or `permanent`; configured maximums, reason lengths, exemptions, and command allowlists are enforced before mutation. Jails use named locations, remember a return point, prevent travel outside the jail radius, and roll back state if the initial teleport fails.

Mail delivery resolves offline Foundation profiles asynchronously, caps each mailbox, tracks unread messages, and refuses writes in profile read-only mode. Kits are saved atomically in `data/kits.yml`, retain complete Bukkit item metadata, enforce kit-specific permission nodes and persisted cooldowns, preflight inventory space, and either reject or drop overflow according to configuration.

## Administration and item tools

Direct travel, coordinate travel, mass travel, `/jump`, `/bottom`, and offline-location travel all route through entity, region, and teleport safety ownership. `/world` only targets an already-loaded world and does not create, discover, unload, or repair worlds. `/sudo` rejects line breaks, oversized input, exempt targets, and configured command roots before using the target player's dispatcher.

Vanilla item grants validate registry entries, item eligibility, amount caps, and complete inventory capacity before mutation. Repair, enchantment, experience, burn, rest, kill, and portable workstation actions remain permission-separated; unsafe enchantment levels require both configuration opt-in and a dedicated permission.

## Interfaces and cosmetics

The VolmLib inventory framework supplies the control center and typed configuration editor. Module tiles show active, disabled, blocked, and failed states. Primary and secondary colors, menu availability, sounds, pitches, particles, and teleport burst size are hot-reloadable through `branding` settings. Menu feedback is isolated from the action that produced it: an unavailable sound or particle falls back to a safe default and cannot abort a menu open, configuration mutation, or command.

The same framework supplies the arrival-flair picker. A player can choose from the hot-reloadable particle allowlist, preview the choice, restore the server default, and reuse it for successful teleports and `/celebrate`; count, spread, and monotonic cooldown are operator-controlled.

Teleport feedback can independently enable titles, action bars, and boss bars. Titles and action bars use VolmLib's cooperative metadata claims, the same contract used by Adapt and React, so a higher-priority or older suite owner wins predictably instead of plugins clearing one another's display. Boss bars occupy a Foundation-specific lane and are removed on completion, cancellation, replacement, or shutdown. Every label and notice in these interfaces is read from the active locale catalog.

The UI uses entity schedulers for each viewer. Inventory inspection captures a clone on the target's entity scheduler and opens an immutable snapshot on the viewer's scheduler.

## Destructive actions

`/suicide` and `/clearinventory` require an exact follow-up confirmation by the same sender within `gameplay.confirmationSeconds`. Inventory clearing also binds the confirmation to the original target, preventing a confirmation from being reused against another player.
