---
title: 15 - Feature Checklist
description: Current features, remaining work in recommended order, and reference research
published: true
date: 2026-10-14T00:00:00.000Z
tags: skyprime, features, roadmap, audit
editor: markdown
dateCreated: 2026-10-13T16:39:48.624Z
---

This checklist separates implemented features from remaining reference gaps and new proposals. The source/reference audit was completed on October 13, 2026; requirements and ordering were updated on October 14. The [feature map](/skyprime/07-feature-map) records detailed limits and verification coverage.

## Current baseline

- **Minecraft:** 26.1 through 26.3 on Spigot/Paper, using Java 25. Stock Folia is unsupported because of dynamic world loading/unloading.
- **Worlds:** each island has its own Normal world, with optional separate Nether and End worlds. Worlds load on demand and unload when idle.
- **Storage:** island metadata uses JSON; terrain remains in persistent world folders. Database-backed terrain restored into temporary dimensions is **not implemented**.
- **Latest completed feature:** 34 configurable island gamerules, with operator defaults, locks, numeric bounds and confirmed menu drafts.
- **Scope:** substantial original SkyPrime/FabledSkyBlock coverage; full feature parity is **not** claimed.

## Already implemented

- [x] **Island lifecycle:** create, reset, delete, rename, accepted ownership transfer, cooldowns, durable world jobs and interrupted-job recovery.
- [x] **World access:** optional Nether/End unlock requirements, safe travel, homes, named homes, visitor home, reconnect restoration and dimension routing.
- [x] **Starters:** built-in sizes, custom bundles, Sponge v2/v3 `.schem` import, in-game block capture and spectator previews.
- [x] **Island environment:** time, weather, difficulty, per-dimension biome selection, native borders and 34 gamerules.
- [x] **Teams:** owner/manager/member roles, custom roles and permissions, invitations, trusted guests, temporary coop and island chat.
- [x] **Visitors and protection:** public/private/allowlist/team-only entry, visitor caps, bans, PvP controls and broad build/container/interaction/entity protection.
- [x] **Island value:** placed blocks and direct block-container contents, bounded scans, material breakdowns, levels and cached rankings.
- [x] **Border growth:** purchased/researched expansion and automatic value/level growth; earned radius remains when value drops.
- [x] **Generators and upgrades:** weighted generation plus expansion, team, homes, generator, speed, jump, crop, flight, drops and spawner upgrade tracks.
- [x] **Challenges and milestones:** configurable objectives, ALL/ANY completion, prerequisites, repeat schedules, shared progress and peak-level achievements.
- [x] **Rewards:** island credits and persistent personal item/XP/command parcels, with recovery for uncertain deliveries.
- [x] **Research and specializations:** prerequisite branches, permanent upgrade grants, exclusive choices and switchable island paths with capped benefits.
- [x] **Contracts:** rotating delivery orders, difficulty/level gates, confirmed item consumption and saved rewards.
- [x] **Events and boosters:** server-wide or island scope, UTC schedules, announcements, credit purchases, token wallets and rare fishing rewards.
- [x] **Economy:** island bank credits, bounded ledger and optional Vault deposits/withdrawals with reconciliation tools.
- [x] **Community:** searchable island directory, visits, votes, favorites, qualified ratings and value/bank/vote leaderboards.
- [x] **Resource limits:** optional per-type block/entity caps, dropped-item caps and administrative recounts across enabled generated island dimensions.
- [x] **Activity history:** searchable retained membership, permissions, progression, selected settings, lifecycle and admin records.
- [x] **Configuration and presentation:** hot-reloadable TOML, typed configuration editor, limited menu editing, language editor, 18 local source catalogs with remote publication pending, per-player language, cyan/white menus and command help.
- [x] **Operations and integrations:** debug dumps, hidden version shortcut, release notifier, cyan/white splash, PlaceholderAPI, developer API, optional bStats, minimized VolmLib packaging and downloaded runtime libraries.

## Remaining work in recommended order

The first ten entries cover missing behavior from the original SkyPrime or FabledSkyBlock references. Implement each through current Volmit services, configuration and permissions. Source references establish behavior only; implementations must be original. Later entries are extensions, blueprint proposals or optional architecture choices. Use the number **and name** when choosing work.

### Reference features first

| Pick | Addition | What remains |
| --- | --- | --- |
| 1 | Detailed action permissions | Separate controls for actions such as fishing, dropping items, doors, anvils, workbenches and trading, rather than only broad interaction categories. |
| 2 | Visitor moderation | Expel visitors, privileged island-chat monitoring and clear permission/audit controls. Bans and entry policies already exist. |
| 3 | Border and ranking choices | Per-player border visibility/color where supported, plus explicit exclusion of staff/showcase islands from rankings. Border growth already exists. |
| 4 | Targeted admin controls | Validated grant/revoke upgrades, size/team overrides, remote biome controls and explicit keep-loaded pins. Current recovery/credit/recount commands remain available. |
| 5 | Scoreboards and holographic rankings | Configurable island displays and ranking holograms through Gloss, with bounded refresh rates. Chat and inventory rankings already exist. |
| 6 | Stacked resources and provider integrations | Stacked-block behavior and stacker/spawner/protection hooks, including logical stacked quantities for caps and island value. |
| 7 | Generator and progression authoring | Rebuild the missing dedicated generator/material and upgrade creation tools. Extend authoring to challenge definitions, objectives and rewards; existing entries can already be edited within the current editor scope. |
| 8 | Additional world behavior controls | Dedicated hunger and leaf-decay policies, with optional non-vanilla Nether water behavior. Existing regeneration/random-tick gamerules are not equivalent controls. |
| 9 | Per-island mechanics tuning | Revisit legacy despawn timers, item/XP merge radii and hopper transfer settings through supported platform capabilities, with measured cost. The original private server-config edits are unsuitable for reuse. |
| 10 | Permission-rank capacity overrides | Define rank-derived team, size and resource allowances alongside purchased/researched progression. Not currently retained from the references. |

### New additions and improvements

| Pick | Addition | What remains |
| --- | --- | --- |
| 11 | Team permission presets | Reusable operator-defined role templates; custom roles already exist. |
| 12 | Welcome and onboarding | First-visit guidance, introductory tasks and configurable one-time starter rewards. |
| 13 | Resource-cap upgrades | Earn or buy additional block/entity allowances; shared limit groups and optional per-dimension policies. Current caps use global per-type configuration. |
| 14 | Linked portal pairs | Physical portal creation/linking, destination pairing, safe exits and cleanup after reset/delete. Dimension travel already works. |
| 15 | Cooperative projects | Saved partial material contributions from multiple teammates toward a shared construction or unlock goal. Current contracts consume a complete order. |
| 16 | Challenge campaigns and more objectives | Chapters and chapter rewards; optional brewing, enchanting, biome or statistics objectives beyond the current supported actions. |
| 17 | Resource recycling | Configured surplus-item exchanges with daily limits and useful credit/material rewards. |
| 18 | Starter and reward data expansion | Supported block-entity capture, more schematic data, and explicit custom-item/provider support; retain bounded validation. |
| 19 | Broader activity records | Environment, biome and visitor-policy changes, plus optional longer archival. Existing history is not a block-change rollback log. |
| 20 | Terrain snapshots and rollback | Coordinated terrain/metadata snapshots, retention, quarantine and safe restore. Current metadata backups and recovery journals do not restore terrain. |
| 21 | World-job operations console | Clear progress/failure inspection and authorized recovery actions; expose rollback only once snapshots exist. Basic inspect/resume tools already exist. |
| 22 | Island maintenance | Previewed, confirmed entity cleanup with protected exclusions and useful before/after counts. |
| 23 | Resource diagnostics | Measured island workload and resource reports. Entity/block counts already exist; they are not per-island CPU measurements. |
| 24 | Competitive seasons | Season identity, selected reset scope, archived rankings and rewards. This was an unfinished original idea, not a completed legacy feature. |
| 25 | Expanded menu designer | Custom items, lore, actions and layouts beyond the existing title/filler/slot controls. |
| 26 | Physical event content | Optional temporary event structures or encounters, with ownership and cleanup rules. Timed bonuses and schedules already exist. |

### Larger or optional decisions

These choices need an agreed storage, migration or economy policy before implementation.

| Pick | Option | Decision needed before implementation |
| --- | --- | --- |
| 27 | Archive/database-backed island terrain | Keep separate dimensions, but archive inactive terrain and restore working world files on load. Define save consistency, crash recovery, restore latency and retention; a database does not remove Minecraft's need for live world data. |
| 28 | Multi-server island hosting | Choose server ownership, exclusive write leases, player transfer and destination-failure behavior. Local world leases do not provide this. |
| 29 | Legacy island imports | Choose exact source versions and conversion scope. No original SkyPrime/FabledSkyBlock data importer is built; migration is opt-in. |
| 30 | Additional bank features | Define interest, taxation or scheduled payments if wanted. Uncertain Vault transfers must remain reconcilable rather than blindly retried. |

**Suggested next implementation: #1, Detailed action permissions.** It fills a reference gap and gives later visitor and role tools a consistent permission model. Reference #9 and #10 need explicit design choices about platform support and progression precedence.

The old Voltage server-tick modifications are not retained. Any future budget enforcement needs a new measured design. Stock Folia support would require a separate world-lifecycle solution; resource caps alone do not make the current architecture Folia-compatible. Linked portal pairs, terrain rollback and distributed hosting are blueprint proposals, not confirmed working features of the supplied FabledSkyBlock. Bank interest is an optional suggestion, not a confirmed reference gap.

## Limits of the features already present

- **Schematics:** plain inventories and literal signs are supported by import; in-game capture excludes block-entity data. Entity import and arbitrary custom item data are not supported.
- **Challenges:** configurable within the supported objective/reward model, not an unrestricted advancement-tree editor. Ordinary left-click crafting is tracked; generated-block provenance clears on chunk unload/restart.
- **Value:** does not include player/ender/entity inventories, nested item contents or provider-defined stacked quantities. The material breakdown needs a completed scan after restart; constant container movement can delay reconciliation.
- **Resource caps:** disabled by default; combine counts across enabled generated island dimensions. Existing over-cap resources are retained; direct third-party block changes may need recounting.
- **Settings:** the gamerule catalog is fixed at 34. Broader gamerules do not replace granular per-role action permissions.
- **Rewards:** supported item metadata exists, but arbitrary NBT, potion components and provider items need additional support or reward commands.
- **Value-scan lifecycle:** October 14 Paper 26.1.2 checks logged cancellation errors when stopping unfinished value scans; world saving completed. Spigot 26.1.2 also logged a reconciliation error while an island world job was active. These unchanged paths need separate follow-up.

## Release and verification work

- [ ] Publish a GitHub release and matching language catalogs at an immutable commit; run `verifyPublishedLanguages` with that SHA before distribution. The repository currently has no releases and does not publish these catalogs.
- [ ] Select and add the project license before distribution; SkyPrime currently has no project `LICENSE` file.
- [ ] Broaden runtime checks across the advertised Spigot/Paper range, including initial start, reload and restart.
- [ ] Add Minecraft 26.3 player-protocol checks when the installed harness can connect successfully; the latest 26.3 checks used native server assertions.
- [ ] Exercise the remaining gamerules individually and verify fixed-time behavior in optional Nether/End worlds.
- [ ] Check menus, borders, sounds and presentation with a real client; bot assertions do not prove appearance or player feel.

**Current build, October 14:** version `2.0.0-26.1-26.3` passed **935 unit tests, 11 packaged tests and six Paper/Spigot API compilation gates** across 26.1, 26.2 and 26.3. Bytecode, manifest, packaging and staging checks also passed. The packed distribution is 1,426,816 bytes. Paper and Spigot 26.1.2 passed **22 player checks** across initial and cached starts; Paper 26.3 passed native initial/restart assertions. All test instances were removed. See the [verification checkpoint](/skyprime/07-feature-map#verification-checkpoint) for artifact hashes, coverage and remaining limits.

## Reference research

Reference features are comparison points, not code to copy. The supplied local source copies establish legacy behavior; current public documentation can describe a different release.

| Reference | Useful findings for SkyPrime |
| --- | --- |
| Supplied `SkyPrime-master` | Most core island features are covered. Remaining legacy differences include server-internal performance controls, per-world mechanics tuning and rank-derived team capacity; these need design decisions rather than literal ports. |
| Supplied Songoda FabledSkyBlock and [official FabledSkyBlock wiki](https://songoda-reborn.com/plugins/fabledskyblock/wiki) | Scoreboards/holograms, border choices, ranking exemption, permission-based size/block allowances and targeted admin controls remain useful comparison points. Local source also exposes finer action flags and moderation tools. |
| [BentoBox Upgrades](https://docs.bentobox.world/en/latest/addons/Upgrades/) and [Limits](https://docs.bentobox.world/en/latest/addons/Limits/) | Upgrade-linked allowances, shared block-limit groups and per-dimension policies inform #13. Keep SkyPrime recounts bounded; do not introduce full-island scans on every event. |
| [BentoBox Challenges](https://docs.bentobox.world/en/latest/addons/Challenges/) | Team-oriented completion and in-game authoring inform #7 and #15. SkyPrime already shares challenge counters; durable partial material deposits are the missing project feature. |
| [SuperiorSkyblock upgrades](https://wiki.bg-software.com/superiorskyblock/overview/upgrades) and [missions](https://wiki.bg-software.com/superiorskyblock/overview/missions) | Block/entity allowances in progression and additional mission handlers inform #13 and #16. Existing SkyPrime movement, crop, drops and spawner upgrades are already covered. |

## Keeping this list current

After a feature is completed, move its delivered scope into the implemented section, retain any specific limitation, and record the actual build/runtime evidence in the [detailed feature map](/skyprime/07-feature-map). Add new proposals with a clear outcome and distinguish reference gaps from optional ideas. Never mark an entire system complete solely because one command or configuration entry exists.
