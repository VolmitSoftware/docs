---
title: "Modules and Behavior"
description: "What each Foundation module does, and the rules its commands follow"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "foundation, modules, features"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Every module turns on and off on its own. A disabled module keeps its command labels registered; running one reports that the module is unavailable. During startup and after a BileTools hot-load, modules stay `PREPARING` until the profiles of everyone already online have loaded.

`administration` and `moderation` do not need the `teleport` module.

## Teleport

The `teleport` module owns consent requests, request preferences, `/back`, and back-history capture. Turning it off does not affect spawn, homes, warps, administration travel, or jail movement — those share the same travel engine.

That engine refuses a destination in a missing world, outside the world border, in a restricted suite-owned world, or on an unsafe landing. Safe-landing keeps your requested X and Z, then checks the block you would actually occupy: liquids, waterlogged or collapsible support, leaves, damaging blocks, portals, and an occupied space are all rejected. The bypass permissions are on [Commands and permissions](/foundation/02-commands-permissions), and they are checked against the player being moved.

Warmups cancel if you move or take damage.

Foundation-owned teleports and death locations go into `/back` history. Teleports from another plugin or the server go in only when `teleport.rememberExternalTeleports` is enabled, which it is not by default.

First-join and respawn routing use Foundation's own spawn anchor. If you have not run `/setspawn`, Foundation leaves vanilla join and respawn placement alone and `/spawn` reports that spawn is unset.

> If you run Wormholes as well, a cross-server arrival can land a player before or after Foundation's configured first-join placement. There is no shared ordering between the two.
{.is-info}

## Profiles and social

Foundation keys everything to a UUID: homes, back history, social choices, balances, moderation state, mail, kit cooldowns, logout location, last-known name, and cosmetic choices.

If two UUID profiles have claimed the same name, offline mail, moderation, `/seen`, and `/tpoffline` refuse to guess and report that nothing changed.

`social.revealVanishedTargets` decides whether `/msg` may reveal a player the sender cannot see. Social spy is opt-in and permission-gated.

Foundation vanish is Foundation's own hide layer; it does not control another plugin's hidden-player state. Gloss chat bubbles do honor it, because they follow Bukkit per-viewer visibility.

With `utilities.recheckFlightOnWorldChange` enabled, changing world rechecks `foundation.utility.fly` and restores your previous flight state if you no longer have it there.

Changing the home-name pattern or maximum length applies on reload; no restart needed.

## Economy and worth

Economy is off by default. When you enable it, Foundation builds a balance index of every account in the background, bounded by `economy.maximumIndexedAccounts`. Economy commands stay unavailable and the Vault provider is not published until that finishes.

`/balance <player>` and `/economy` accept an exact offline name; tab completion only offers online players. If two accounts share a historical name, name-based targeting fails rather than guessing. `/balancetop` obeys `economy.maximumLeaderboardProfiles`.

`/sell` credits the amount after rounding to `economy.decimalPlaces`. If a positive total rounds to zero the sale is refused and nothing leaves your inventory. Selling your whole inventory needs `/sell all confirm`.

`/worth` works whether or not the economy module is on. With `foundation.economy.setworth` you can right-click an item in the browser and type its price. If menus are disabled, `/foundation worth <material>` prints one value.

## Moderation, mail, and kits

Durations accept compound `s`, `m`, `h`, `d`, `w`, `mo`, and `y` units, or `permanent`.

`/clearwarnings` takes a full warning ID or a unique prefix of at least eight characters, and refuses an ambiguous prefix.

A jail is a named location. Foundation remembers where the player came from, confines them to a three-block radius in the jail world, and returns them on expiry or `/unjail`. `/deljail` is refused while any profile still has an active sentence there.

Mail delivers to offline profiles, caps each mailbox, and tracks unread state. `/mail read <page>` marks only the messages on that page.

Kits live in `data/kits.yml` and keep full item metadata. Kit count, cooldown, and per-kit stack limits apply to hand-edited data as well as to `/createkit`. Overflow is either rejected or dropped, depending on configuration.

When Adapt is installed, an active `moderation` module denies Adapt ability use to frozen and jailed players.

## Item tools

Item grants check the registry entry, the amount cap, and that your inventory actually has room before anything is given.

`/kill` and `/suicide` deal a generic-kill damage source rather than setting health to zero, so death events and protection plugins still see it.

Other plugins can veto item operations through Foundation's [item operation policy](/foundation/05-integrations-api). `/clearinventory` runs that check over every item first and clears nothing if any item is denied. The disposal inventory returns protected items to you on close.

## Destructive actions

`/suicide` and `/clearinventory` require an exact follow-up confirmation from the same sender within `gameplay.confirmationSeconds`.

`/clearinventory` also binds the confirmation to the original target, so a confirmation cannot be reused against a different player. No item is removed when any item fails the delete check.

Continue with [Operations and safety](/foundation/04-operations-safety).
