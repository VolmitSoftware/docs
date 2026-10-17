---
title: 07 - Feature Map & Roadmap
description: Implemented features, current limits, verification and selectable future additions
published: true
date: 2026-10-14T00:00:00.000Z
tags: skyprime, features, roadmap
editor: markdown
dateCreated: 2026-09-15T15:00:00.000Z
---

This page records implemented systems, their limits and verification coverage. An implemented feature exists in source; it may still need testing on a particular platform. Use the ordered checklist to choose future work.

SkyPrime supports Java 25 and Minecraft 26.1 through 26.3. The [ordered feature checklist](/skyprime/15-feature-checklist) separates reference gaps from new proposals.

- [Current checkpoint](/skyprime/07-feature-map#current-checkpoint)
- [Implemented features](/skyprime/07-feature-map#implemented-features)
- [Working features with limits](/skyprime/07-feature-map#working-features-with-limits)
- [Selectable additions](/skyprime/07-feature-map#selectable-additions)
- [Verification checkpoint](/skyprime/07-feature-map#verification-checkpoint)
- [Where each system lives](/skyprime/07-feature-map#where-each-system-lives)
- [References and updates](/skyprime/07-feature-map#references-and-updates)

## Current checkpoint

| Item | Current state |
| --- | --- |
| Project | `C:\VolmitSoftware\SkyPrime` |
| Runtime | Java 25; Minecraft 26.1 through 26.3 |
| Build version | `2.0.0-26.1-26.3` |
| Staging destination | `BUILDS/SkyPrime.jar`; verify the artifact against its recorded build evidence |
| Packaging | Required VolmLib classes bundled, minimized and relocated; Gson, TOML and Adventure loaded through SlimJar before enablement and cached in `plugins/SkyPrime/.libs/` |
| Platforms | Spigot and Paper; stock Folia is unsupported because independent worlds need dynamic loading/unloading |
| Island architecture | Every island owns a separate Normal world/dimension, plus optional island-specific Nether and End dimensions |
| Identity | Permanent island UUID; retained through reset and ownership transfer |
| Presentation | Cyan and white; Director command help and inventory menus |
| Latest gameplay addition | 34 Boolean/integer island gamerules with defaults, locks, bounds and confirmed drafts |
| Next selected addition | None selected; remaining additions are listed below |
| Reference coverage | Substantial core coverage; remaining gaps are listed in the ordered checklist |

The latest world work also completed independent time/weather, native borders, idle unloading, reconnect restoration and optional-dimension persistence. Those foundations are already implemented.

## Implemented features

### Islands, dimensions and travel

| Feature | What exists |
| --- | --- |
| Island creation | Persisted identity reservation, selected starter generation, activation and safe arrival |
| Starter preview | Dimension-aware details before creation/reset; isolated read-only spectator worlds, four total sessions including preparation/recovery, separate 120-second preparation/active limits, up to 81 retained chunks per world, saved return state and cleanup journals |
| Independent dimensions | A separate Normal world for each island; optional Nether and End worlds generate on first authorized travel after global enablement and any required island unlock |
| Dimension progression | Nether/End unlocks use configurable island-bank costs, minimum levels and claimed one-time missions; purchases survive reset, transfer and value decreases |
| Owned world storage | Logical path `skyprime/islands/<UUID>/<normal\|nether\|end>`; physical storage follows the current server's layout |
| Void terrain | No normal terrain generation outside the starter |
| World lifecycle | On-demand loading, saved idle unloading, leases for active operations and protection against unloading occupied/busy worlds |
| Idle timeout | Hot-reloadable; defaults to 300 seconds |
| Island borders | Native world border follows the island's square radius and expansion upgrades |
| Homes | Main, visitor and additional named homes; homes include their dimension |
| Travel | `/sky home`, `/sky visit`, `/sky dimension`, `/sky dimensions`; current dimension availability, access, bounds, safe standing position and warmup checks |
| Player portal routing | Portals inside managed islands route players to that island's available Nether/End or back to Normal through safe travel; non-player entity portal travel involving managed worlds is blocked |
| Favorites and ratings | Personal bookmarks, continuous-visit qualification, one-to-five-star ratings, cooldowns and popularity browsing |
| Island directory | Case-insensitive name search, five sorts including popularity, four filters including favorites, 45 entries per page, island details and live visit checks |
| Visitor policy | Normal, allowlisted or team-only entry; visit-only allowlist, shared nonteam capacity and current access enforcement |
| Visitor destination | Uses an island's configured visitor home where available |
| Void rescue | Safe evacuation to a separate loaded fallback world |
| Reconnect restoration | Reloads an island and restores an authorized safe logout destination; unrelated lobby logins stay in the lobby |
| Reset | Confirmation, evacuation, owned-world replacement and starter selection; retains island identity and progression |
| Deletion | Confirmation, evacuation and owned-world cleanup; owner replacement history remains |
| Replacement limits | Configurable reset/recreation cooldowns and per-owner allowance; transfers do not replenish the allowance |
| Interrupted operations | Durable create/reset/delete descriptors, automatic recovery and administrative resume/delete |

Details: [Gameplay](/skyprime/03-islands-progression), [Operations](/skyprime/04-operations-recovery).

### Level milestones

A 45-entry paginated browser shows configured credit rewards, current and highest recorded levels, and claimed/available/locked states. Teammates with `MILESTONES` confirm claims; others browse without claiming. Refresh requests a value scan. Durable peak levels and claim IDs survive reset, transfer and falling value. 

### Starters and island environment

| Feature | What exists |
| --- | --- |
| Built-in starters | `small`, `normal`, `big`; deterministic varied terrain, trees, resources and supplies |
| Custom starter bundles | JSON block palettes/data, display name, icon, description, permission and per-dimension supplies |
| Starter selection | Command and creation/reset menu choices, with permission checks |
| Schematic import | Sponge v2/v3 GZIP `.schem`, bounded validation, plain container inventories and literal two-sided signs; normalized content retained for preview/create/reset/recovery |
| In-game capture | Corner/origin selection and bounded capture of loaded source chunks |
| Retained starter definition | Existing islands and admitted jobs keep their selected definition even if the template catalog changes |
| Starter reload | `/sky template reload`; invalid candidates retain the previous catalog |
| Time | Natural cycle, day, noon, night or midnight; changes actual world time |
| Weather | Natural cycle, clear or rain; fixed modes disable thunder and natural weather changes |
| Difficulty | Server default, Peaceful, Easy, Normal or Hard; changes actual native difficulty |
| Server-default difficulty | Follows the primary `minecraft:overworld`, including later changes |
| Environment authority | Teammates with `ENVIRONMENT` change preferences; teammates read `/sky environment` |
| Environment menu | `/sky environmentmenu` and Settings → Environment show all existing time/weather/difficulty choices; teammates inspect, `ENVIRONMENT` permits saving |
| Island gamerules (SKY-ENV-02) | 29 Boolean and five integer rules; configurable defaults, locks and numeric bounds; draft editing, stale-save rejection and primary-world inheritance across island dimensions |
| Environment persistence | Settings belong to the island UUID and apply across its loaded dimensions, reset, unload/reload and restart |
| Fixed-time verification (SKY-ENV-04) | Paper 26.2 build 123 passes exact native/Bukkit Night clocks and natural-cycle restoration before/after restart; older Paper 26.1.1 build 29 retains an upstream clock limitation |

Environment refresh runs every 40 server ticks. Optional dimensions inherit preferences when loaded/generated. Details: [Island environment](/skyprime/03-islands-progression#island-environment), [Starter templates](/skyprime/06-starter-templates).

Biome selections apply independently to each available dimension, persist through resets and transfers, and update loaded chunks gradually at full height. Unloaded chunks update when loaded; the menu cannot restore generated biomes. See [Island biomes](/skyprime/03-islands-progression#island-biomes).

### Teams, visitors and protection

| Feature | What exists |
| --- | --- |
| Team membership | One island team per player; owner, manager and member core roles plus up to 32 custom member roles |
| Invitations | Expiring invitations, acceptance/denial and capacity checks |
| Team management | Leave, kick, promote/demote and accepted ownership transfer |
| Island identity in commands | Naming; visits/votes resolve online owners, exact island names or UUIDs |
| Public/private access | Private by default; separate bans override access grants |
| Trusted guests | Persistent named grants with selected actions |
| Temporary coop | Expiring grants; also end on issuer disconnect, restart, lost authority, reset or deletion |
| Visitor action flags | Building, containers, block interaction, entity interaction, mob damage and item pickup |
| PvP | Island PvP setting with protection enforcement |
| Interaction protection | Blocks, buckets, containers, pickup, entities, hanging objects, vehicles and combat |
| Boundary protection | Pistons, fluids, hoppers, projectiles and spread; explosions cannot destroy managed-world blocks |
| Access rechecks | Current membership, roles, bans, lifecycle and storage health govern mutations and queued actions |
| Island chat | Toggleable private channel for teammates and eligible visitors; access rechecked before delivery |
| Votes | One vote per eligible player per island; no self-team or banned-player voting |

Details: [Commands and permissions](/skyprime/02-commands-permissions), [Protection](/skyprime/03-islands-progression#protection).

### Value, generators, missions and credits

| Feature | What exists |
| --- | --- |
| Material value | Configurable nonnegative unit values for placed blocks and directly stored block-inventory items; each double-chest half counted once |
| Value reconciliation | Bounded chunk and container snapshots, asynchronous counting and coalesced updates; container movement during capture discards the publication and queues a retry |
| Manual reconciliation | `/sky value` and administrative reconciliation; one island scan runs at a time |
| Material value breakdown (SKY-VALUE-01) | `/sky valuebreakdown` and the main Material values button show up to 45 materials per page, ordered by contribution then material name; cached combined counts, unit values, totals and UTC scan time remain separate from the explicit Refresh action |
| Levels | Cached value divided by the configured level divisor |
| Automatic border growth | Configurable current-value/current-level formula, permanent earned radius, expansion and research contributions, maximum-radius cap and live native-border updates |
| Rankings (SKY-DISPLAY-02) | Separate cached value, bank and vote leaderboards; chat output through `/sky top` and a paginated localized `/sky rankings` menu. Active islands participate regardless of public access. Value ties use votes, creation time and UUID; bank/vote ties use creation time and UUID |
| Weighted generators | Normal-dimension stone/cobblestone/basalt formation uses configured material weights and level tiers |
| Generator progression | Purchased tier boost advances from the level-earned tier, capped at the strongest configured tier |
| Internal credits | Persistent island balance; administrative credits, mission rewards and upgrade purchases |
| Bank history | Paginated transaction display; balance and bounded ledger persist together |
| One-time checkpoints | Inventory requirements and credit rewards; qualifying inventory is checked without consuming items |
| Challenge schedules | One-time, daily, weekly or minute intervals, fixed reset offsets, prerequisites, shared team progress and once-per-window claims |
| Mission objectives | Inventory, generated-block breaking, mature harvesting, fishing, mob kills, ordinary crafting, breeding, taming, shearing and player furnace extraction and custom integration counters; multiple targets/objectives with ALL/ANY completion |
| Events and boosters | Server/island timers, UTC schedules, overlap rules, announcements, purchases, token wallets and rare fishing rewards |
| Specializations | One active configurable path per island; requirements, switching costs/cooldowns and capped temporary bonuses |
| Island research | Configurable prerequisite graphs, completed challenges, held materials, current levels and credits; permanent upgrade grants, exclusive groups, paginated browsing and confirmation |
| Personal progression rewards | Mission and milestone receipts freeze rich item/XP/command bundles for the claiming player; paginated inbox, explicit collection, offline queue and administrative review of uncertain delivery |
| Island contracts | Saved rotating tiered orders, consumed plain-item deliveries, credit/personal rewards and explicit interrupted-input recovery |
| Mission safeguards | Survival/adventure team actions only; generator provenance prevents placed-block farming; duplicate reward claims rejected |
| Independent upgrades | Expansion, team capacity, home capacity, generator boost, Speed, Jump, Crop, Fly, Drops and Spawner |
| Special upgrade benefits | Own-island movement/jump modifiers and toggled flight; capped crop-growth chance, ordinary mob resource bonuses and post-cycle spawner delay reduction |
| Completed roadmap item | SKY-PROGRESS-02: special upgrade tracks, with explicit eligibility, confirmation, live benefit limits and cleanup policies |
| Purchase previews | Menus and commands show price, target level, benefit and balances; confirmation expires after 30 seconds and rechecks the island, authority, level, price and full configured rule |
| Purchase validation | `UPGRADES` action authorization and quoted island/price/level recheck before spending |

Details and default capacities/prices: [Progression](/skyprime/03-islands-progression).

### Menus, configuration, languages and operations

| Feature | What exists |
| --- | --- |
| Island menus | Main controls, starters, settings, visits, bank, missions, upgrades, guests and reset/delete confirmation |
| Director help | `/sky`, `/sky help`, `/sky admin`, `/sky debug`; aliases `/skyprime`, `/is`, `/island` |
| Configuration editor | Eight categories, 45 settings per page, direct language editing, typed validation and stale-edit checks |
| Menu configuration | Title, filler material and action slots; not an arbitrary drag-and-drop GUI designer |
| TOML layout | Root config plus separate feature files under `config/`; see the installation file map |
| Automatic reload | Watches supported configuration and installed language files; invalid edits retain the last valid state |
| Language editor | Shared language selection/editing tools, English fallback and `languages/language-preferences.properties` |
| Locales | 18 source catalogs; English generated locally, local translations supported and remote publication pending |
| Startup splash | Cyan/white block lettering beside metadata, controlled by `general.splashScreen` |
| Release notifier | GitHub release notifications for `VolmitSoftware/SkyPrime`, controlled by `general.updateNotifications` |
| Metrics | bStats ID `34482`, with hot-reloadable `general.metricsEnabled` and the global bStats opt-out |
| Diagnostics | Local dump, opt-in explicit upload, status, `debug version` and hidden root `version` shortcut |
| Operator recovery | Inspect, resume, delete, reconcile and audited credit grants |
| Activity history (SKY-AUDIT-01) | Searchable retained membership, permissions, progression, settings, lifecycle and administrative records; transactional publication, role-gated browsing and deleted-island inspection |
| Atomic persistence | Validated island aggregate and serialized, coalesced atomic writes; previous aggregate backup |
| Storage failure handling | Mutation suspension and contextual console errors; invalid authoritative island data stops initialization |
| PlaceholderAPI | Optional cached island/team/progression/ranking placeholders and `current_` values for visited islands |
| Source API | Island lookup/mutations, world ownership/leases/operations and environment service methods |
| Build | Gradle wrapper, JDK 25, `-parameters`, minimized/relocated bundled VolmLib, language manifest/hash generation and artifact staging to `BUILDS` |
| Runtime libraries | SlimJar downloads Gson, TOML and Adventure before enablement; `.libs/` retains downloads and relocated copies for later starts |

Locales: `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, `zh_TW`.

Details: [Configuration](/skyprime/01-installation-configuration), [Commands](/skyprime/02-commands-permissions), [API and placeholders](/skyprime/90-placeholders-api).

## Working features with limits

| Area | Status | Remaining boundary |
| --- | --- | --- |
| Independent-world support | Implemented | Stock Folia cannot provide the required dynamic world lifecycle |
| Runtime dependency cache | Implemented | First startup needs repository access; offline starts need the libraries required by the installed version already cached in `.libs/` |
| Custom templates | Partial | Sponge v2/v3 `.schem` import supports plain inventories and literal signs; in-game capture excludes block-entity data, and entities/custom item metadata remain unsupported |
| Menu editor | Partial | Existing title/filler/slot controls; no arbitrary item/lore/action layout editor |
| Environment controls | Partial | Time/weather/difficulty, biome selection and 34 allowlisted Boolean/integer gamerules are available; operator defaults/locks/ranges are configurable, while the supported catalog is fixed |
| Fixed time after restart | Older server limitation | Paper 26.1.1 build 29 retained Night but its native day timeline returned 13,086 instead of 13,000. Paper 26.2 build 123 passed exact native/Bukkit Night clocks and natural-cycle restoration before and after restart with the preceding gamerule artifact |
| Nether/End availability | Implemented | Global switches and per-island purchases gate entry; relocking retains terrain, homes and material-value accounting |
| Portals | Partial | Player travel between the island's dimensions exists; no physical portal-pair creation, coordinate linking or custom portal network |
| Bank | Partial | Internal credits, bounded history and optional Vault deposits/withdrawals with uncertain-outcome reconciliation; no interest or automatic provider retries |
| Administrative credit command | Implemented | UUID parsing was fixed and console credit attribution passed the activity-history runtime checks |
| Rewards | Implemented with limits | Missions and milestones support credits plus queued named/enchanted item, XP and command bundles; arbitrary NBT, potion components and custom-provider items require integrations or reward commands |
| Recovery | Partial | Durable jobs, aggregate backup and recovery commands; no managed terrain snapshots, quarantine-first deletion or rollback UI |
| Missions | Implemented with limits | Inventory checks retain items; custom event counters need a trusted integration; no vanilla advancement-tree editor; ordinary left-click crafting only; generated-block eligibility is in-memory and clears on chunk unload/restart |
| Value | Implemented with limits | Material breakdowns read an in-memory completed-scan cache; restart and material-value changes require a new successful scan. No stack-provider quantities, player/ender/entity inventories or nested item contents; continuous container movement can delay reconciliation |
| Invitations/offers | Implemented with limits | Transient across restart; distinct from persistent membership and trusted guests |
| Language distribution | Publication pending | All catalogs exist locally; remote installation remains unavailable until a matching pinned source revision is published |
| Resource-cap policy | Partial | Global per-type caps apply across enabled generated island dimensions; no cap upgrade track, shared limit groups or separate per-dimension cap policies |
| Reference moderation and presentation | Partial | No visitor-expel/chat-spy tools, player border color/visibility choices or ranking exemptions; broad protection flags do not cover every FabledSkyBlock action flag |
| Reference administration | Partial | Recovery, credits and recounts exist; targeted size/team overrides, upgrade grants/revocation, remote biome controls and keep-loaded pins remain absent |
| Preview advancement rewards | Platform-dependent | Cancellable criterion events block rewards on Paper and Spigot 26.3; Spigot 26.1 and 26.2 can still grant vanilla/datapack criteria and rewards |
| Metrics | Implemented | bStats ID `34482`, no custom charts; plugin toggle reloads live and the global opt-out applies after restart |

## Selectable additions

The [ordered checklist](/skyprime/15-feature-checklist#remaining-work-in-recommended-order) is the single list for choosing work. It starts with ten missing reference features, then lists gameplay improvements and optional architecture projects. The next recommended feature is detailed action permissions.

| Reference area | Remaining scope |
| --- | --- |
| Original island controls | Fine-grained actions, visitor moderation, border display choices and ranking exemptions |
| Administration | Upgrade grants/revocation, size/team overrides, remote biome controls and keep-loaded pins |
| Presentation | Scoreboards and holographic rankings through Gloss |
| Integrations and authoring | Stacked quantities, provider hooks, generator/material and progression creation tools |
| Original world mechanics | Hunger, leaf decay, optional Nether water, despawn/merge/hopper tuning and rank-derived allowances |
| Recovery blueprint | Coordinated terrain snapshots, quarantine and rollback |
| Network blueprint | Distributed world ownership, exclusive writes and cross-server transfer |

Separate island worlds are implemented. Database/archive-backed inactive terrain, multi-server hosting and legacy island import are not. Server-internal Voltage tick modifications need a new measured design; they are not part of current SkyPrime.

## Verification checkpoint

### Current build, October 14, 2026

Version `2.0.0-26.1-26.3` passed **935 unit tests and 11 packaged-artifact tests**, with zero failures, errors or skips. Checks covered all six Paper/Spigot APIs for 26.1, 26.2 and 26.3, Java 25 bytecode in ordinary and packed artifacts, language manifests, packaging and staging.

The staged `SkyPrime.jar` is the packed distribution: **1,426,816 bytes**, SHA-256 `8d94e6f7b52435615ee410e19acc1f0711f10ba03d612501921ab0f2fe8ee9a0`. The ordinary shaded artifact is 1,539,627 bytes. The packed distribution is about 14.4% smaller than the previous baseline artifact below.

Paper 26.1.2 build 74 and Spigot 26.1.2 build `4632-Spigot-566f972-690a402` each passed eight initial and three restart checks on Java 25 using Mineflayer protocol 26.1: **22 passing player checks**. These cover hidden version/help behavior, all eight configuration categories and return paths, local diagnostics, live metrics/update toggles, the language editor, unpublished-language fallback and saved player language after restart. Empty-cache startup and cached restart enabled the packed distribution on both platforms.

Paper 26.3 build 181 passed the native initial/restart fixture on Java 25, including separate island worlds, gamerule isolation, configuration reload and saved settings. These are server-side assertions, not 26.3 player-protocol or real-client visual proof. Remote language publication, successful GitHub release discovery and remote bStats ingestion remain unverified.

An initial Paper scenario had a case-sensitive help matcher; correcting it required no plugin change. Spigot needed an explicit server/RCON readiness wait after a runtime-host shutdown failure during test preparation. Paper 26.3 logged Windows OSHI/Perflib errors before plugin enablement; its fixture passed afterward. All three disposable instances were stopped, process-checked and deleted, and all five viewers closed. Reports, logs, artifact metadata and cleanup results are indexed by `SkyPrime/build/qa/project-standardization/summary.json`.

### Previous baseline artifact, October 14, 2026

Version `2.0.0-26.1-26.3` requires Java 25 and declares Minecraft API 26.1. Startup accepts the supported 26.1, 26.2 and 26.3 release families, including patch releases and Paper build-number version strings, and rejects other or unrecognized Minecraft versions before initializing services. The build checks Paper and Spigot APIs for all three supported release families. Existing platform capability checks remain necessary within this range, including world-directory layout and the Paper/Spigot gamerule type difference.

This baseline build passed **923 unit tests and 10 packaged-artifact tests**, with zero failures, errors or skips. All six Paper/Spigot API compilation gates, Java 25 bytecode verification, packaging checks and staging passed. That baseline artifact is **1,667,458 bytes**, SHA-256 `cad5ef3bae075f93a6283203bc5a82a75b3df3c6e61c1c331afb94b8cfec39d1`. The aggregate registry matches API 26.1 and Java 25; this check did not rerun the entire aggregate build.

Paper 26.1.2 build 74 and Spigot 26.1.2 build `4632-Spigot-566f972-690a402` on Java 25 each passed eight initial and three restart player checks using Mineflayer protocol 26.1, for **22 passing player checks**. These cover exact plugin version/help output, menu drafts and permissions, separate island gamerules, fall damage, Nether travel, configuration reload, home travel and saved selections after restart. Fresh dependency loading and cached restart both enabled the plugin. Paper 26.3 build 181 on Java 25 passed native initial/restart fixture assertions for separate worlds, gamerule isolation, reload and persistence; this is server-side evidence, not 26.3 player-protocol or real-client visual proof. Runtime checks for 26.2 and Spigot 26.3 remain outstanding.

Both Paper 26.1.2 shutdown logs recorded a `CancellationException` while the unchanged value-scan service cancelled an unfinished reconciliation. The servers subsequently logged that all dimensions were saved. Spigot 26.1.2 also logged `IllegalStateException: Island already has an active world job` from value reconciliation during fixture setup. These value-scan errors remain open. Paper 26.3 also logged Windows OSHI/Perflib counter errors before plugin enablement; its fixture assertions passed afterward.

All four disposable instances were stopped and deleted after process-exit checks, and all viewers closed. Artifact metadata, scenario reports, runtime logs and cleanup results are indexed by `SkyPrime/build/qa/java25-baseline/summary.json`.

### Coverage limits

The build and runtime sections identify separate artifacts. Neither establishes coverage for every feature combination; each runtime result applies only to its recorded artifact.

- Minecraft 26.2 and Spigot 26.3 still need baseline runtime coverage; API compilation alone is insufficient.
- Minecraft 26.3 player-protocol checks and real-client appearance remain unverified.
- Gamerule scenarios exercise fall damage and random tick speed; the remaining rules need individual gameplay checks.
- Fixed time in optional Nether/End worlds needs separate verification. Paper 26.1.1 build 29 had a clock-restoration discrepancy; Paper 26.2 build 123 passed the earlier clock fixture.
- Specialization tests do not establish natural harvest, fishing, crop, mob or spawner effects in every combination.
- Preview recovery checks used a saved recovery marker; they were not process-crash tests. Spigot 26.1 and 26.2 retain the documented criterion limitation.
- Vault transfer checks used a test provider. Third-party provider behavior and remote bStats ingestion remain unverified.
- Language catalogs require publication and a successful download check for the released source revision.

Feature-specific logs and reports remain in the local, ignored `SkyPrime/build/qa/` folders when retained. They are evidence for their recorded artifacts, not part of the installation contract.

## Where each system lives

Java paths below are relative to `SkyPrime/src/main/java/com/volmit/skyprime/`.

| Path | Responsibility |
| --- | --- |
| `SkyPrime.java` | Plugin lifecycle and service wiring |
| `activity/` | Structured history records, strict storage validation, retention and indexed queries |
| `specialization/` | Path definitions, selected identity/revision, status and confirmation terms; island services apply costs and effects |
| `social/` | Personal favorites, durable visitor ratings, continuous visit qualification and popularity summaries |
| `island/` | Immutable island model, roles, progression, persistence and domain authorization |
| `world/` | World jobs/files, generation, travel, reconnects, borders, value and generators |
| `environment/` | Time/weather/difficulty, allowlisted gamerule modes and bounded biome application |
| `template/` | Starter catalog, capture, validation and retained bundle content |
| `protection/` | Gameplay permissions and boundary enforcement |
| `events/` | Scoped event definitions, cached effects, durable timers, UTC schedules and harvest/fishing output |
| `progression/` | Event-based mission accounting and explicit personal reward delivery |
| `upgrades/` | Team movement/jump modifiers, crop-growth bonuses, toggled island flight, eligible mob loot and spawner-delay adjustments |
| `chat/` | Island chat and recipient access |
| `command/` | Director commands, argument handling and administrative tools |
| `gui/` | Inventory menus and configuration editing |
| `config/` | Typed TOML sources, validation and reload |
| `language/` | English catalog and language service |
| `integration/` | Optional PlaceholderAPI expansion and Vault economy transfers |
| `limits/` | Resource counts, bounded recounts and cap admission |
| `src/main/resources/languages/` | 18 locale catalogs, relative to the project root |
| `src/test/java/`, `qa/` | Automated tests, gameplay scenarios and native runtime checks, relative to the project root |

Persistent runtime files: `storage/activity.json` (version 1), `storage/social.json` (version 1), `storage/events.json` (version 1), `storage/islands.json` (schema 9), `environment.json`, `difficulty.json`, `gamerules.json` (version 2), `island-returns.json`, `visitor-policy.json` (schema 1), `biomes.json` and `roles.json` (version 1), `island-state.pending.json` (version 2) when a transaction is pending, `bank-transfers.json` (version 1) and `rewards.json` (version 2), plus `world-jobs/`, `island-worlds/` and `preview-worlds/`. Preview return state also uses the player persistent-data key `skyprime:starter_preview`; see [Preview recovery](/skyprime/04-operations-recovery#starter-preview-recovery). Backups must pair metadata with the owned terrain. Configuration, languages and runtime storage are separate systems.

## References and updates

The central `docs/skyprime/` pages describe the current implementation. Workspace references `SkyPrime-Modernization-Map.md`, `Songoda-Reborn-Implementation-Backlog.md` (SKY-001 through SKY-005) and `Songoda-Reborn-Remake-Blueprint.md` contain historical analysis and broader targets. `SkyPrime-master`, Songoda's FabledSkyBlock and ShapedPortals are reference projects; their presence does not mean their features have been implemented here. Reference code is not to be copied.

Add proposals to the ordered checklist with a clear outcome and origin. When delivered, update the feature inventory, its operator page and the changelog, retaining any remaining limitation.
