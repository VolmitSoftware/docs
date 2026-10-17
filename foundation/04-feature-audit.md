---
title: "Foundation Feature Audit and Priorities"
description: "Implemented features, release checks, and remaining work in priority order"
published: true
date: 2026-10-14T00:00:00.000Z
tags: "foundation, features, audit"
editor: markdown
dateCreated: 2026-10-13T00:00:00.000Z
---

Foundation targets Minecraft 26.1 through 26.3 and Java 25. This page separates implemented features from pending additions. Reference plugins provide behavior comparisons; Foundation implementations use its own services, configuration, and module boundaries.

## Implemented

- 17 switchable modules and 119 canonical command labels, including the root. Direct commands have separate classes and can be disabled individually.
- Spawn, homes, shared warps, teleport requests, back history, safe landing, warmups, movement/damage cancellation, and staff travel.
- Private messages, reply, ignore, social spy, offline mail, AFK, vanish, player preferences, and information commands.
- Health, hunger, flight, game modes, portable workstations, inventory inspection, item tools, and personal time/weather.
- Kicks, warnings, mutes, freezes, timed jails, and Adapt ability restrictions for frozen or jailed players.
- Optional Foundation economy, Vault publication, payments, balances, leaderboard, categorized worth editing, and selling.
- Inventory-snapshot kits, permissions, cooldowns, read-only previews, creation/deletion, and cooldown reset.
- Director help, control menus, typed configuration editing, language tools, and home/warp/kit/jail management menus.
- English plus 17 partially translated source catalogs, on-demand GitHub language installation, local edits, and saved player language choices.
- JSON player profiles and locations, bounded inventory-clear recovery, item-operation policies, and unload cleanup.
- Arrival cosmetics, title/action-bar feedback, PlaceholderAPI, debug dumps with optional mclo.gs upload, and bStats ID `34483`.

The shared project setup includes downloaded runtime dependencies, selective VolmLib packaging and shrinking, a mint-and-blue splash, GitHub update notices, `debug version`, `debug dump`, and the hidden `version` alias. The README links to the wiki instead of duplicating the manual.

## Current limits

- Foundation is not a complete EssentialsX or CMI replacement.
- Economy commands use Foundation's ledger. They do not consume another Vault provider's balances.
- Kits are YAML item snapshots; player profiles and locations are JSON.
- Recovery covers confirmed Foundation inventory clears, not all inventory changes or deaths.
- Command doctor explains command access, not every target, cost, cooldown, or landing condition.
- Translated catalogs cover a subset of messages. Remaining Foundation-specific messages fall back to English; complete translation coverage is still pending.
- The public Foundation repository exists, but its latest-release endpoint and the configured German catalog URL returned HTTP 404 on October 14, 2026. Publish a release and the translated catalogs before treating either remote workflow as ready. Language sources still use mutable `main`; pin a verified immutable revision for release.

## Reference features still to implement, in order

1. External Vault economy mode. Let operators select Foundation's ledger or an external provider. Balance, payment, sale, and future costs must use the same owner. Test provider removal and failed transactions without balance merging or a competing registration.

2. Shared command policies. Add per-command cooldowns, optional costs, and world restrictions. Aliases and root fallback must share the decision. Preserve existing teleport and kit checks without double charging. See [EssentialsX cooldowns](https://github.com/EssentialsX/Website/blob/master/pages/wiki/Command-Cooldowns.md) and [CMI warmups](https://www.zrips.net/cmi/commands/warmups/).

3. Full kit editor and claim rules. Add content/settings editing, one-time claims, first-join eligibility, and optional prices. Keep previews read-only and enforce item policies. Full inventories, duplicate clicks, reconnects, and persistence failures must not duplicate rewards or lose eligibility. See [CMI kits](https://www.zrips.net/cmi/kits/).

4. Shared and public homes. Add trusted guests, optional public listings, permission-based limits, revocation, and browser filters. Recheck access at teleport time. Leave land permissions with the claim owner and cross-server transport with Wormholes. See [HuskHomes home commands](https://william278.net/docs/huskhomes/Commands).

5. Explicit EssentialsX/CMI imports. Import selected homes, warps, mail, and balances from supported export formats. Require preview, backups, UUID conflict handling, and a repeat-import report. Run only when requested; never scan or migrate other plugins' files on startup. See [CMI import workflow](https://www.zrips.net/cmi/first-run/).

## Foundation additions after those gaps

6. Administrative action history. Record bounded, searchable Foundation balance edits, moderation changes, kit grants, and recovery claims with actor, target, result, and timestamp. Include retention and access controls, but exclude private-message contents and credentials.

7. Detailed command doctor. Explain target access, policies, cooldowns, world restrictions, and economy decisions using the same checks as execution. It must not execute actions or load unbounded offline data.

8. Staff case workflow. Add report IDs, staff notes, assignment, resolution, and expiry around the existing helpop and moderation tools. Decide coexistence with specialist moderation plugins before adding bans or appeals.

9. Player convenience presets. Add saved preference sets and destination descriptions/icons, using existing profiles and management menus.

10. Arrival cosmetic presets. Add permission-gated effect combinations with visibility checks, particle limits, and individual off switches. Keep display, pet, progression, and portal systems outside Foundation.

## Release and verification work

These checks apply before a release, independently of the feature order above:

- Complete Foundation-specific translations in all 17 catalogs, publish a GitHub release, and pin a reachable language revision. Check every catalog URL, key/placeholder parity, offline English fallback, and preservation of local edits.
- Run the checked distribution on supported Paper and Folia targets with an empty library cache, cached restart, reload, and shutdown.
- Exercise every editor field type, language selection, stale confirmation, changed permission, module toggle, and disconnect with bounded gameplay assertions.
- Record the jar hash and tested server versions. Compilation, packaged-artifact tests, startup, gameplay, and real-client appearance are separate results.
- Verify menu rendering, sounds, colors, and interaction feel with a real client. Bot assertions do not prove those.

## Verified distribution

The October 14, 2026 checked build passed 135 unit tests, packaged-runtime tests, and all six API/linkage targets: Spigot and Paper for each of 26.1, 26.2, and 26.3. The distribution is 1,598,774 bytes, with SHA-256 `0d6b340872a97cd8e0fb088d908a7a0125ec33bf7aacfecf9e49101f7bbef406`.

Paper 26.1.2 build 74 on Java 25.0.1 passed empty-cache dependency bootstrap, startup, and graceful shutdown. A cached restart passed 12 Mineflayer checks using bot protocol 26.1: aliases, help, command doctor, control/configuration menus, version routes, a local debug dump, and the language editor. The server log contained no plugin exceptions or cleanup failures. bStats was disabled in the test server's shared configuration, and no reports were uploaded publicly.

The first Paper gameplay run used positional `false` for the dump option and failed its assertion. The corrected `upload=false` run passed.

The same distribution passed 15 checks on Folia 26.1.2 build 8 with Java 25.0.1 and BileTools 3.1.0-26.2: the 12 command/menu checks and three cooperative reloads with the control center, configuration menu, or Foundation-owned flight active. Reload closed menus, preserved inventory counts, restored flight, and made commands available again. This covered an empty dependency cache followed by three cached plugin reloads, using bot protocol 26.1. The server log contained no exception, error, or cleanup failure, and graceful shutdown exited successfully. Both gameplay viewer feeds have closed.

Runtime testing on Minecraft 26.2/26.3 and Spigot, complete editor coverage, real-client appearance, and public report uploads were not verified in this pass. API/linkage checks do not replace those runtime checks.

## Suite boundaries

| Owner | Leave with that plugin |
|---|---|
| Gloss | Holograms, scoreboards, tablist, chat bubbles, display/menu rendering |
| React | Profiling, server monitoring, performance tuning |
| Adapt | Skills and progression |
| Iris and Rift | World generation and world lifecycle |
| ShapedPortals and Wormholes | Portals and cross-server transport |
| SkyPrime | Islands |

Optional integrations must handle absent dependencies and unload/reload.

The comparisons above use [EssentialsX documentation](https://www.essentialsx.net/wiki/introduction), [CMI documentation](https://www.zrips.net/cmi/), and the linked HuskHomes reference. CMI comparisons describe published behavior, not its private implementation.
