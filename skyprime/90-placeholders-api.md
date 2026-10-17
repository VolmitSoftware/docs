---
title: SkyPrime - Placeholders and API
description: Optional PlaceholderAPI values and island service boundaries
published: true
date: 2026-10-17T00:00:00.000Z
tags: skyprime, placeholders, api
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

SkyPrime registers its expansion only when PlaceholderAPI is enabled. Resolution uses the player's cached island snapshot and performs no disk I/O. A player without an island receives an empty island value; `%skyprime_favorites_count%` remains available independently of island membership.

| Placeholder | Value |
| --- | --- |
| `%skyprime_id%` | Permanent island UUID |
| `%skyprime_name%` | Island name |
| `%skyprime_owner%` | Owner UUID |
| `%skyprime_owner_name%` | Owner name observed since plugin startup, falling back to the UUID when unknown |
| `%skyprime_members%` | Team size including the owner |
| `%skyprime_members_max%` | Current team capacity including upgrades |
| `%skyprime_homes%` / `%skyprime_homes_max%` | Saved home count / current home capacity |
| `%skyprime_upgrade_expansion%` | Purchased island-size levels |
| `%skyprime_upgrade_team%` | Purchased team-capacity levels |
| `%skyprime_upgrade_homes%` | Purchased home-capacity levels |
| `%skyprime_upgrade_generator%` | Purchased generator levels |
| `%skyprime_upgrade_speed%` | Purchased movement-speed levels |
| `%skyprime_upgrade_jump%` | Purchased jump levels |
| `%skyprime_upgrade_crop%` | Purchased crop-growth levels |
| `%skyprime_upgrade_fly%` | Purchased island-flight unlock |
| `%skyprime_upgrade_drops%` | Purchased mob-resource-drop levels |
| `%skyprime_upgrade_spawner%` | Purchased spawner-delay levels |
| `%skyprime_generator_boost%` | Extra generator tiers from upgrades |
| `%skyprime_nether_unlocked%` / `%skyprime_end_unlocked%` | Whether the island has a persisted unlock for that dimension |
| `%skyprime_nether_available%` / `%skyprime_end_available%` | Global enablement combined with an unrequired unlock or a persisted purchase |
| `%skyprime_value%` | Last reconciled value of placed blocks and directly stored block-inventory items |
| `%skyprime_level%` | Integer value divided by the configured level divisor |
| `%skyprime_peak_level%` | Highest recorded island level, retained through reset and transfer |
| `%skyprime_milestones_claimed%` | Number of persisted milestone claim IDs, including removed definitions |
| `%skyprime_milestones_available%` | Configured, unclaimed milestones whose required level is at or below the recorded peak |
| `%skyprime_milestone_next_level%` | Lowest configured unclaimed milestone level, or zero when none remain |
| `%skyprime_milestone_next_remaining%` | Levels still needed for that milestone, based on the recorded peak and floored at zero |
| `%skyprime_size%` | Current square width, `2 × radius + 1` |
| `%skyprime_size_max%` | Configured maximum square width |
| `%skyprime_bank%` | Internal credit balance |
| `%skyprime_votes%` | Vote count |
| `%skyprime_favorites_count%` | Personal saved-island count, excluding deleted islands; available without island membership |
| `%skyprime_rating%` | Island average stars with two decimal places, or `0.00` without contributing ratings |
| `%skyprime_rating_count%` | Number of contributing visitor ratings |
| `%skyprime_popular_score%` | `(star total + 15) / (rating count + 5)`, with two decimal places |
| `%skyprime_favorited%` | Whether the requesting player has favorited this island (`true` or `false`) |
| `%skyprime_state%` | Current lifecycle state |
| `%skyprime_rank%` | Cached one-based material-value ranking position, or zero when unranked |
| `%skyprime_bank_rank%` | Cached one-based bank-balance ranking position, or zero when unranked |
| `%skyprime_votes_rank%` | Cached one-based vote ranking position, or zero when unranked |

Prefix any island suffix with `current_` to read the island the player is physically visiting, for example `%skyprime_current_name%` or `%skyprime_current_owner_name%`. Ranking variants are `%skyprime_current_rank%`, `%skyprime_current_bank_rank%` and `%skyprime_current_votes_rank%`. Presence updates on player movement, travel and joining. These placeholders read the cached presence and island records without accessing another region's player location. They return an empty value outside active islands.

## Java API

The source exposes immutable `Island` and `Home` records through `SkyPrime.islands()`. `byId`, `forPlayer`, `top`, `rank` and `ranking` use in-memory indexes. `SkyPrime.worlds().islandAt(Location)` resolves the owning island from the world registry and checks the position against its claim. `islandForWorld(World)` resolves ownership without a claim-position check. `worlds()` and `worlds(islandId)` return currently loaded owned worlds; an unloaded world is not present in those lists.

`IslandService.setValue(UUID, long)` publishes a reconciled value, updates the recorded peak level and applies `Limits.growth()` to the saved radius. `refreshRadius(UUID)` reapplies current border-growth settings to the saved value without changing the peak level. Both require an active island. `BorderGrowthPolicy` defines enablement, `VALUE`/`LEVEL`/`HIGHEST` source, divisor and exponent; the configured maximum bounds the resulting radius.

`RankingType` provides `VALUE`, `BANK` and `VOTES`. `top(RankingType, int)` returns an immutable prefix of the selected ranking, clamping negative counts to zero and large counts to the available island count. `ranking(RankingType)` returns the complete immutable ranking. `rank(UUID, RankingType)` returns a one-based position or zero for an unranked island. All three include active private islands and read cached snapshots without world scans; callers must check `mayVisit` before offering travel. See [Island rankings](/skyprime/03-islands-progression#island-rankings) for score and tie ordering. Previously returned lists retain their records when later mutations publish a new snapshot.

`IslandService.directory(UUID viewer, DirectoryQuery query, Set<UUID> onlinePlayers, SocialDirectory social)` returns a `DirectoryPage` from current island records without Bukkit calls or disk I/O. Callers supply a current online-player UUID set, collected on the appropriate server thread. `DirectoryQuery(String search, DirectorySort sort, DirectoryFilter filter, int page)` strips surrounding whitespace, lowercases with `Locale.ROOT` and treats exact `*` as an empty search. It rejects control characters, normalized searches longer than 48 Java characters and negative page indexes. Sorts are `NAME`, `VALUE`, `VOTES`, `NEWEST`, `POPULAR`; filters are `PUBLIC`, `ACCESSIBLE`, `ONLINE`, `FAVORITES`. Supply `SkyPrime.social().directory(viewer)` for current bookmarks and rating summaries.

`DirectoryPage(List<Island> entries, int total, int page, int pages)` contains an immutable page of at most 45 island records, total matches, the zero-based selected page and at least one page. Requests beyond the last page clamp to the last page; empty results use page zero and one page. Unhealthy persistence returns an empty result. Listing access is checked against current island state; integrations must recheck visit access when acting on a previously returned entry. Directory browsing has no PlaceholderAPI keys or persistent fields.

Player-facing domain mutations enforce ownership, membership, limits and persistence health. Privileged methods such as `credit`, `setValue`, `activate`, `beginDeleteById` and `finishDelete` assume a trusted caller; integrations must authorize those operations themselves. After a persisted mutation, await `IslandService.flush()` if another system needs durability before acknowledging its own operation. Invitations, ownership offers and coops are transient. `mayVisit` and `mayAct` recheck the current island, bans, lifecycle, guest expiry and storage health. `quoteUpgrade(actor, track)` returns an immutable island/track/level/price/rule quote. `upgrade(actor, quote)` checks all quoted values again before spending. The menu adds a 30-second confirmation deadline; trusted API callers manage their own interaction lifecycle. `upgradeBenefit(island, track)` returns the configured effective benefit after applying the current purchase cap: Speed/Jump tiers, the Fly unlock, or Crop/Drops/Spawner percentage points, with runtime caps of 3, 1, 100% and 75% as applicable. Purchased-level placeholders remain unchanged when an operator reduces or disables benefits. `claimMission(actor, id, inventoryCheckpoint)` accepts a material-name/count map for current inventory objectives; event objectives use persisted progress. Trusted integrations submitting that map must read the player inventory on its owning thread. `credit(islandId, actor, amount, detail)` records an explicit actor; console callers use `IslandService.CONSOLE_ACTOR`; automatic lifecycle work uses `IslandService.SYSTEM_ACTOR`.

`quoteDimensionUnlock(actor, dimension)` returns a `DimensionUnlockQuote` for an active teammate with `DIMENSIONS`. Quotes include the complete rule, global enablement and level divisor; unmet level, mission or bank requirements can still be displayed. `unlockDimension(actor, quote)` rechecks the current policy, role, prerequisites and funds before publishing the debit and persisted unlock together. The menu expires its confirmation after 30 seconds; API callers manage their own interaction deadline. `dimensionUnlocked(island, dimension)` reports effective policy access, including `required = false`; use `Island.unlockedDimensions()` for the persisted purchase set. `dimensionUnlockEnabled(dimension)` reports global enablement, while `SkyPrime.worlds().dimensionAvailable(island, dimensionKey)` combines enablement and effective access. `IslandDimension` contains `NETHER` and `END`; Normal access does not require an unlock.

`withIslandWorlds(islandId, action)` loads the island's already generated, enabled dimensions and retains their loading lease until the action's returned future completes. It does not generate unused optional dimensions. The callback can run asynchronously; schedule Bukkit world access on the server thread. Active leases prevent idle unloading and competing destructive operations.

`SkyPrime.worlds().valueBreakdown(UUID)` returns `Optional<ValueBreakdown>` from the in-memory cache without loading worlds or starting a scan. `ValueBreakdown` exposes `long total`, `long scannedAt` (epoch milliseconds) and an immutable `List<Entry>`. Each entry contains `Material material`, `long count`, `long unitValue` and `long contribution`; entries are ordered by descending contribution, then material name. The optional is empty for inactive islands, before a successful scan after startup, or after cache invalidation such as a material-value configuration change. `SkyPrime.worlds().rescan(UUID)` requests a fresh scan and returns the resulting total through a future; successful completion publishes the breakdown. The breakdown cache is not persisted and does not replace the saved island value.

World operations return completion futures and must be used for terrain creation, reset, deletion and safe teleports. External consumers must perform entity, inventory and world access on the server thread. Independent island-world loading is unavailable on stock Folia.

`ProgressionPolicy.Mission.rewards()` returns an immutable `RewardBundle` containing a `List<RewardItem>`, XP points and console commands. `claimMission` persists a personal `RewardParcel` for the claiming actor when this bundle is nonempty, together with the mission completion and island credits. `IslandService.rewards(UUID recipient)` returns that recipient's immutable ordered inbox; `reward(UUID id)` returns an optional receipt. `SkyPrime.rewards().collect(Player, UUID)` must begin on the player-owning thread and returns a completion future; the service rechecks permission, receipt ownership, player availability, storage capacity and XP bounds before delivery. Rewards have no PlaceholderAPI keys.

Reward states are `QUEUED`, `DELIVERING` and `REVIEW`. `beginRewardDelivery`, `completeRewardDelivery`, `deferRewardDelivery` and `markRewardReview` are lifecycle operations for the delivery service, not substitutes for delivering effects. `resolveReward(RewardParcel expected, boolean delivered, UUID actor)` is privileged: integrations must authorize the caller and inspect external effects themselves. It accepts only the exact current `REVIEW` receipt; `true` removes it, while `false` queues its entire bundle. Revisions reject stale outcomes. Do not automatically retry uncertain deliveries.

`milestoneRules()` returns configured milestone definitions. `quoteMilestone(actor, id)` returns an immutable `MilestoneQuote` containing the island ID, milestone ID and full rule; `claimMilestone(actor, quote)` rechecks current authority, rule, recorded peak, claim state and bank capacity before publishing the claim, credit transaction and optional personal reward receipt together. API callers manage interaction deadlines; the menu enforces 30 seconds. `Island.peakLevel()` and `Island.claimedMilestones()` expose persistent progression. Value updates record peak levels with the current divisor; a configuration reload alone does not change a peak.

`SkyPrime.previews()` exposes `StarterPreviewService`. `enter(Player, String starter, String dimension)` and `leave(Player)` return completion futures; call them on the player-owning server thread. `active(Player)` includes a saved recovery marker, while `active(UUID)` checks an in-memory session. `hasRecovery(Player)` reports a saved return marker; `leaveCommand(String)` identifies the exit command permitted during preview. Preview entry applies normal access and capacity checks. Preview worlds do not belong to `IslandWorldService` ownership indexes, and integrations must not treat them as islands. Previews have no PlaceholderAPI keys.

`IslandService.visitorPolicy(UUID islandId)` returns immutable `VisitorPolicy(VisitorMode mode, int capacity, Map<UUID, String> allowlist)`. Modes are `DEFAULT`, `ALLOWLIST` and `CLOSED`; capacity is 0–1000 with zero unlimited, and the visit-only allowlist holds at most 256 entries. `setVisitorMode(actor, mode)`, `setVisitorLimit(actor, capacity)`, `allowVisitor(actor, target, name)` and `removeVisitor(actor, target)` require an active teammate with `VISITORS` and return persistence futures. `mayVisit` and `mayAct` apply the current entry policy; integrations must use the world travel service for capacity-aware admission rather than relying on an earlier Boolean access check.

`SkyPrime.events()` exposes the event service. `effects(UUID islandId)` returns immutable `EventEffects`; `active(UUID islandId)` returns immutable applicable `ActiveEvent` records with `MANUAL`, `SCHEDULED`, `PURCHASE` or `TOKEN` source. Pass `null` for server-only effects. `definitions()` returns the current immutable catalog, and `nextStart(id, islandId)` returns an optional scheduled start in epoch milliseconds. Reads perform no disk I/O or world loading. `start(id, islandId)` and `stop(id, islandId)` return futures that complete after durable writes; these are privileged operations, so integrations must authorize the caller and validate island existence/state themselves. `stop` affects manual timers only. `healthy()` exposes storage availability. `IslandService.eventEffects(UUID)` delegates the configured effect supplier. There are no event-specific PlaceholderAPI keys.

`IslandService.quoteBooster(actor, id, BoosterScope, token)` validates island membership, `UPGRADES`, the configured purchase/redemption path, cooldown, current activation and funds or tokens. `activateBooster(actor, quote)` revalidates and publishes the bank/token debit, timer and cooldown together; await `flush()` before acknowledging durability. Integrations must separately enforce Bukkit buy/redeem and server-scope permissions. `grantBoosterTokens(islandId, id, scope, amount, actor)` and `stopBooster(id, islandId, actor)` are privileged domain operations requiring caller authorization and a subsequent flush. A null stop target removes matching server-sponsored activations. `boostersSnapshot()` supplies immutable indexed sources; no world loading is required. `allActive()` on the event service includes all effective scopes for announcement consumers. The command stop flow combines manual and wallet stops; `EventService.stop` itself remains manual-only. Paid/token sources remain reserved but ineffective until their save succeeds. `MissionRewardDelivery.validateItem` and `createItem` provide the shared mission/fishing item contract; build or deliver Bukkit items on the appropriate owning thread.

The source API is part of this project version. No stable binary compatibility contract is promised for future releases.

`SkyPrime.environment().difficulty(islandId)` reads the cached `DifficultyMode` preference. `setDifficulty(actor, mode)` requires the actor to own or manage an active island and returns a future that completes after persistence. Modes are `SERVER`, `PEACEFUL`, `EASY`, `NORMAL` and `HARD`. The environment service applies the selected native difficulty to loaded dimensions on its scheduled refresh; completion of the save future does not mean that world application has already run. `SERVER` follows the primary `minecraft:overworld` difficulty.

`SkyPrime.gamerules().selection(islandId, rule)` returns the durable `GameRuleValue`; `effectiveSelection` resolves operator defaults and bounds, while `effectiveValue` also uses the cached primary-world value. Values have `SERVER`, `BOOLEAN` or `INTEGER` kind and factories `server()`, `bool(boolean)` and `integer(int)`. `IslandGameRule.parse(String)` validates command syntax and catalog bounds. `policy()` exposes configured rule policies and `supported(rule)` reports native capability. `set(actor, rule, value)` requires an active teammate with `ENVIRONMENT`, rechecks policy and returns a persistence future. `compareAndSet(actor, rule, value, expectedSelection, expectedPolicyRule)` also rejects changed policies or pending/durable preference changes. World application follows separately every 40 ticks. `remove(islandId)` clears deleted-island choices; `healthy()` reports storage health. See [Island gamerules](/skyprime/14-gamerules).

## Biome selection API

`IslandService.biome(UUID islandId, String dimension)` returns an `Optional<String>` namespaced selection. `setBiome(UUID actor, String dimension, String key)` requires an active teammate with `ENVIRONMENT` and returns a persistence future. Call the runtime service on the server main thread. Runtime integrations should use `SkyPrime.biomes()` and `IslandBiomeService.set(actor, dimension, key)` to validate the current registry and dimension availability and schedule loaded-world application.

`choices()` returns the sorted selectable registry keys; `selection(islandId, dimension)` returns the persisted optional key. `pending(islandId, dimension)` counts queued loaded chunks, capped by the shared 4,096-entry queue; overflow is rediscovered later. `failed(islandId, dimension)` reports recorded application failure. The `set` future acknowledges persistence and scheduling, not completion of every chunk update. Biome selections have no PlaceholderAPI keys.

## Custom role API

`IslandAction` defines the actions listed in [Team roles](/skyprime/03-islands-progression#team-roles). `IslandService.roles(UUID islandId)` returns immutable `IslandRoles` definitions and assignments. `roleKey(Island, UUID)` returns the effective lowercase built-in or custom key, or an empty string for a nonmember. `hasPermission(Island, UUID, IslandAction)` evaluates current membership, lifecycle, storage health and the exact action set; `requirePermission(UUID actor, IslandAction)` returns the authorized current island or throws a domain error. Do not infer delegated authority from the core `Role` enum alone.

`createRole(actor, key)`, `setRolePermission(actor, key, action, enabled)`, `deleteRole(actor, key)`, `assignCustomRole(actor, target, key)` and `clearCustomRole(actor, target)` return persistence futures and require the owner. Assignment and clearing require a core `MEMBER` target. `IslandAction.MEMBER_DEFAULTS` contains the six protected interaction actions plus `MISSIONS` and `CONTRACTS`; `HISTORY` requires explicit delegation. Role definitions cannot alter the owner or manager baseline. Custom roles have no PlaceholderAPI keys.


## Custom challenge definitions and counters

`ProgressionPolicy.Mission` exposes presentation, enabled state, named `ObjectiveRule` entries, `CompletionMode`, schedule, prerequisites, credits and personal rewards. `MilestoneRule` shares presentation and reward bundle types. `RewardItem` freezes material, amount, name, lore, namespaced enchantments, model data, unbreakable state and damage. `RewardParcel.sourceType()` distinguishes `MISSION` and `MILESTONE`; `sourceId()` is the configured definition ID. Identical IDs in the two systems do not share claim state.

`missionProgress(island, id)` returns `MissionProgress` with a schedule, period key, map of `ObjectiveProgress`, claimed flag and lifetime completion count. `missionObjectiveProgress(island, id, inventoryCheckpoint)` combines stored event counters with current inventory material counts; `missionComplete(...)` evaluates `ALL`/`ANY` and prerequisites. Check the separate claimed flag before offering a claim. Build the checkpoint from the player's storage inventory on the owning thread; entries are material names and nonnegative counts. Inventory requirements do not consume items.

Trusted integrations can call `SkyPrime.islands().recordObjective(new IslandService.ObjectiveEvent(actorId, islandId, ProgressionPolicy.Objective.CUSTOM, "QUEST_FINISHED", amount))`. The service validates current island membership, active lifecycle, prerequisites, configured targets and storage health; the caller must establish that the reported activity actually happened and enforce game-mode, location and anti-abuse rules. Built-in event listeners enforce these rules for their own events. Positive increments update every matching objective, capped at each objective's configured amount. Do not accept arbitrary client-supplied increments. The synchronized domain method does not access Bukkit state; gather Bukkit context on its owning thread and use `repository().flush()` when a durable acknowledgement is required.

Disabled milestone definitions are excluded from `milestones_available` and next-milestone placeholders. Historical `milestones_claimed` still counts retained claim IDs.

## Research API

`ProgressionPolicy.research()` exposes the typed `ResearchPolicy`; `IslandService.researchPolicy()` and `researchRules()` return the current policy and definitions. `researchView(island, inventory)` captures the current island, progression policy and immutable node statuses together for reload-safe rendering. `researchStatus(island, id, inventory)` evaluates one node against the current island and a material-count map. `quoteResearch(actor, id)` checks permission and non-inventory eligibility and returns a `ResearchQuote`; `research(actor, quote, inventory)` revalidates the quote, spends credits and publishes upgrade grants with an immutable `ResearchUnlock`. Call `flush()` and await durability before reporting success.

Inventory maps must reflect the confirming player's current storage contents, read on the owning player thread. The domain does not read or remove Bukkit items. API callers own confirmation expiry; the built-in menu enforces 30 seconds. `Island.research()` contains persisted node IDs with their frozen exclusive group and completion timestamp. Upgrade grants are target levels, never additive levels. Research has no PlaceholderAPI keys. See [research requirements and grants](/skyprime/08-research#requirements-and-grants).

## Contracts API

`SkyPrime.configurations().snapshot().contracts()` exposes the typed `ContractPolicy`. `IslandService.ensureContracts(actor)` creates or rotates a durable board; `contractBoard(islandId)` reads the cached immutable snapshot. `quoteContract(actor, offerId)` freezes a short confirmation. Call `SkyPrime.contractDeliveries().deliver(player, quote)` on the player’s owning scheduler for validated inventory removal and durable completion. Its future completes after the output transaction is saved.

Low-level `beginContractDelivery`, `completeContractDelivery`, `cancelContractDelivery` and `reviewContractDelivery` implement the input journal and do not independently prove inventory consumption. Integrations using them own that proof and must not retry uncertain effects. `pendingContractDeliveries()` lists unresolved receipts; `resolveContractDelivery(id, consumed, actor)` is an administrative decision. Contract credits are fixed and are not multiplied by mission boosters.

## Favorites and ratings API

`SkyPrime.social()` exposes `SocialService`. `favorites(actor)`, `favorite(actor, islandId)`, `rating(actor, islandId)`, `summary(islandId)` and `directory(viewer)` read immutable in-memory state. `RatingSummary(count, total)` provides `average()` and `popularScore()`; current teammates are excluded. `setFavorite(actor, islandId, boolean)`, `rate(actor, islandId, stars)` and `withdraw(actor, islandId)` return persistence futures. These domain methods do not enforce Bukkit command permissions or visitor dwell evidence; integrations must authorize callers and use the runtime rating entry point for players.

`SkyPrime.visitorPresence().rate(Player, UUID, int)` checks the qualified current visit before delegating to social storage and returns `CompletableFuture<RatingSummary>`. Call it on the player-owning thread. `remainingSeconds(Player, UUID)` is a nonmutating, whole-second remaining-time read on that same thread. Progress is continuous and memory-only; reading it does not advance the timer. `healthy()` on social storage reports availability; `flush()` waits for previously queued social operations.

The rating, rating-count, popularity-score and favorited placeholders also accept `current_`, for example `%skyprime_current_rating%` and `%skyprime_current_favorited%`. `favorites_count` is a player-level key without a `current_` variant. Popularity score is a numeric value independent of whether the island meets the configured minimum count for the leading directory group.

## Island activity API

`IslandService.activity(UUID islandId, ActivityQuery query)` returns `ActivityPage(entries, total, page, pages)` from the last durable immutable snapshot. `ActivityQuery(ActivityCategory category, UUID actor, String search, int page)` uses nullable category/actor filters and a zero-based page; pages hold 45 entries. Search is at most 80 characters and is normalized case-insensitively. `activityIslandIds()` returns retained island identities, including deleted islands, and `historyAvailable(UUID)` tests whether retained records exist. These domain reads do not authorize Bukkit callers; integrations must enforce own-island `HISTORY` access or administrative history permission before exposing results.

`ActivityEntry(long sequence, ActivityDraft event)` identifies ordering. `ActivityDraft` contains island UUID, epoch-millisecond timestamp, category, action key, `ActivityActor`, optional target UUID and bounded string details. Actor kinds are `PLAYER`, `CONSOLE` and `SYSTEM`; only player actors have a UUID. Supported domain mutations stage records within their state transaction. Record publication follows durable completion; ordinary `IslandService` mutation callers must await the corresponding flush before acknowledging persistence. Queries perform no disk I/O or world loading.

The repository constructor takes `Path`, a failure consumer, `Supplier<ActivityPolicy>` and `LongSupplier` clock. `ActivityPolicy(enabled, retentionDays, maxEntriesPerIsland, maxTotalEntries)` supplies hot-reloadable retention. `pruneActivity()` returns the persistence future for maintenance. `stageActivity(ActivityDraft)` is a storage transaction primitive and does not authorize an action or save by itself; integrations should use the corresponding domain mutation. Activity history has no PlaceholderAPI keys. See [Activity history](/skyprime/12-activity-history) for recorded operations and exclusions.

Privileged recovery and deletion APIs require an explicit actor: `IslandService.beginDeleteById(islandId, actor)`, `resumeCreation(islandId, actor)` and `resolveTransfer(id, externalSucceeded, actor)`; `IslandWorldService.deleteById(id, actor)` and `resume(id, starter, actor)`; and `IslandEconomyService.resolve(transferId, applied, actor)`. Use the acting player UUID, `CONSOLE_ACTOR` for console, or `SYSTEM_ACTOR` for automatic work. Actor attribution records provenance and does not grant authorization. Automatic bank completion remains `completeTransfer(id, externalSucceeded)` and attributes the original initiating player.

## Specialization API

`%skyprime_specialization_id%`, `%skyprime_specialization_name%`, `%skyprime_specialization_active%` and `%skyprime_specialization_cooldown_seconds%` describe the member island; `current_` variants describe the current island. A removed definition retains its ID but has an empty name and inactive benefits. Cooldown seconds round remaining time upward.

`IslandService` exposes `specializationPolicy()`, `specializationView(Island)`, `specializationActive(Island)`, `specializationCost(Island, String)`, `specializationAvailableAt(Island)` and `specializationCooldownMillis(Island)`. Call `specializationQuote(UUID, String)` and `specialize(UUID, SpecializationQuote)` for validated changes, then await `flush()` before acknowledging durability. `effectiveUpgradeLevel(Island, UpgradeTrack)` includes eligible temporary levels; `eventEffects(UUID)` combines event/booster effects with specialization effects. `IslandService.Options` takes a specialization-policy supplier after its contract-policy supplier.
