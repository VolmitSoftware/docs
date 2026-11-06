---
title: "Bastion: Java integration"
description: Claim policy, welcome, directory, and notification access
published: true
date: 2026-11-06T00:00:00.000Z
tags: bastion, api
editor: markdown
dateCreated: 2026-10-14T17:41:01.673Z
---

Claim values provide snapshots for integrations, including whether the owner enabled automatic anchor fueling and its configured power target percentage. Mutations belong to the claim engine, which checks current state and publishes lifecycle changes. World, inventory, and player operations must still run on their owning scheduler.

## Welcome and directory

Read the immutable `ClaimWelcome` value from a claim. Welcome writes compare the expected value with current state and use the cancellable `welcome` lifecycle action.

Read public listing state through `Claim.directory()`. Save through `ClaimEngine.directory(id, actor, expected, next)`, which checks ownership, a valid home before publication, and the expected value. Changes use the cancellable `directory` action.

## Selection geometry

`ClaimArea` is a sealed selection interface implemented by rectangular `BlockArea` and `CircleArea(worldId, centerX, centerZ, radius)`. Circle radius is 0–564; coordinate overflow is rejected. `blockCount()`, `contains(x, z)` and `chunks()` describe the same exact full-height columns. `coreX()` and `coreZ()` return an included starting column: the circle center or the rectangle's minimum corner.

Claim-engine creation, expansion and release, including staff variants, accept `ClaimArea`. `AreaPreview.Request` uses the same selection type. Saved claims retain ordinary `ChunkArea` masks; protection queries do not evaluate circle distances. Child plots keep rectangular `BlockArea` data, while `ChildPlot.intersects(ClaimArea)` checks actual selected-column overlap for release validation.

## Claim icons

`Claim.icon()` returns `ClaimIcon`, containing `DEFAULT` and 28 approved material choices. `DEFAULT` leaves each menu's contextual icon in place. Icons are saved with claims and contain no item metadata or inventory contents.

`ClaimEngine.icon(id, actor, expected, next)` checks current ownership and the expected icon before committing. `adminServerIcon(...)` requires server-owned land and caller-enforced staff authorization. Both return futures and publish cancellable `icon` or `server-icon` lifecycle actions. Transfer retains the icon, split copies it, and merge retains the destination's icon. Full-record replacements must preserve the icon component.

## Server-zone game modes

`Claim.zoneGameMode()` returns `ZoneGameMode`: `NONE`, `SURVIVAL`, `CREATIVE`, `ADVENTURE` or `SPECTATOR`. Non-`NONE` values require server ownership. Full-record replacements must preserve this component.

`ClaimEngine.adminSetGameMode(expected, actor, mode)` returns a future, verifies server ownership and the entire reviewed claim, and publishes the cancellable `server-game-mode` lifecycle action. The caller must enforce staff authorization. Equal-mode writes do not publish a change. Policies persist in the claim journal and appear under settings activity; runtime player changes happen on owning schedulers after committed changes.

## Notifications

`Bastion.notifications()` returns `NotificationService`. Its `entries(UUID)`, `unread(UUID)`, `markRead(UUID, UUID)`, and `dismiss(UUID, UUID)` methods return futures and perform storage work on the inbox worker.

Callers must enforce account access themselves. The built-in GUI supplies only its viewer's UUID. `InboxEntry` exposes immutable identity, claim, timestamp, message key, arguments, read, and dismissed fields.

## Protection policy

`Claim.enabled(flag)` reads local scalar values and built-in defaults; it is not an actor permission check. Use `ClaimEngine.effectiveFlag(world, x, z, flag)` for plot, claim, world and global inheritance, or `permits(...)` when actor access also matters. `flagOrigin(...)` returns the deciding `RuleOrigin`. Unset `BREAK` and `PLACE` use same-scope `BUILD` before checking broader scopes.

`ProtectionPolicy`, `WorldPolicy` and `ProtectionRules` are immutable runtime values. `configureProtectionPolicy(...)` replaces the active defaults. Coordinate-based `allowsEnvironment(...)` and `permitsSpawn(...)` apply defaults to wilderness as well as claimed land. `ClaimSpawnPolicy` contains immutable creature-type and spawn-reason maps; type and reason inherit independently. Built-in configuration and commands validate enum names against the running Bukkit API.

`ClaimEngine.clearFlag(id, actor, flag)` removes an explicit flag. `ClaimEngine.spawnRule(id, actor, kind, key, value)` updates a type or reason rule; a null value removes it. Both return futures, check `MANAGE_FLAGS`, and commit through the serialized journal. Flag resets use the `flag` lifecycle action; spawn changes use `spawn-rule`. Both actions are cancellable and appear under activity settings.

`plotFlag(...)`, `clearPlotFlag(...)` and `plotSpawnRule(...)` change child policy with parent `MANAGE_FLAGS` checks. Plot member-action writes reject active occupancy and purchase holds. Their lifecycle actions are `plot-flag` and `plot-spawn-rule`; server policy writes use `server-flag`, `server-spawn-rule`, `server-plot-flag` and `server-plot-spawn-rule`. These are cancellable, journaled changes. Plot activity appears in the plots category.

`Claim`, `ChildPlot` and `ProtectionRules` include immutable `conditions()` maps from `ClaimFlag` to `PermissionCondition(node, expected)`. Every replacement must preserve flag, spawning and condition components.

`PermissionLookup` returns `true`, `false` or unknown (`null`). Unknown matches neither condition polarity. `ClaimEngine.decide(...)` returns `ProtectionDecision` with allowed state, reason, deciding flag, origin, winning condition and optional extension attribution. Actor-aware `permits(...)` uses the same decision path. `effectDecision(world, x, z, actor, flag, permissions)` evaluates passive effects without ownership, trust, bans or locks. Coordinate `flagDecision(...)` uses that path with no actor; its claim/plot overload reads native policy only. Methods without a permission lookup treat conditions as unknown. Never supply a live Bukkit player predicate from another entity's region.

`ConditionalRuleEdit` carries the reviewed value/condition and proposed replacements, plus an optional plot ID. `conditionalRule(...)` checks `MANAGE_FLAGS`; `adminServerConditionalRule(...)` requires caller-enforced staff authorization. Both compare reviewed state and protect occupied plots. Claim changes use `conditional-rule` and `server-conditional-rule`; plot changes use `plot-conditional-rule` and `server-plot-conditional-rule`. `permissionNodes()` provides the immutable configured-node catalog, bounded to 256 distinct nodes across saved land and active defaults.

## Protection extensions

Integrations obtain `com.volmit.bastion.api.protection.ProtectionRuleService` from Bukkit's `ServicesManager`. Declare `depend: [Bastion]` and compile against Bastion without bundling its classes. The snapshot and lifecycle `BastionApi` service remains separate.

Register through `register(plugin, definition, rule)` using an enabled plugin owner. `RuleDefinition(id, flags, priority, failurePolicy)` selects existing `ClaimFlag` actions. IDs contain 1–64 lowercase letters, digits, dots, underscores or hyphens, starting with a letter or digit. Priorities range from -1000 to 1000; smaller numbers run first, followed by provider name and rule ID. Provider names are normalized to lowercase. Duplicate provider/ID pairs are rejected. There are at most 64 registrations and 16 per flag.

`ProtectionRule.evaluate(ProtectionContext)` returns `RuleVerdict.PASS` or `DENY`. `PASS` continues evaluation; it cannot grant access denied by Bastion. Native denials stop before extensions, and actor checks with administrative bypass skip extensions. Owners and trusted members can still be restricted when they do not bypass. Passive effects retain their existing semantics and do not gain an administrative bypass.

The immutable context contains the world UUID, exact X/Z column, requested flag, nullable actor UUID, nullable claim and child-plot snapshots, and `EvaluationKind.ACTOR` or `PASSIVE`. No player, world, entity or live permission lookup is supplied. Environmental and spawn-category checks have no actor. Projectile checks retain captured shooter identity. Spawn type/reason restrictions run before the extension; the context exposes the category, not an entity type or spawn reason.

Callbacks run synchronously on the calling thread and may run concurrently on Folia regions or through integration queries. They must be thread-safe, fast, side-effect free and use precomputed immutable data. Do not perform I/O, wait for futures, mutate claims, call world/entity APIs, or recursively evaluate protection. A query is not a notification that an action succeeded: explanations, target/origin checks and safety queries can evaluate independently.

```java
ProtectionRuleService service = getServer().getServicesManager().load(ProtectionRuleService.class);
RuleDefinition definition = new RuleDefinition("closed-mine", Set.of(ClaimFlag.BREAK), 0, FailurePolicy.DENY);
RuleRegistration registration = service.register(this, definition, context ->
        context.claim() != null && closedClaims.contains(context.claim().id())
                ? RuleVerdict.DENY : RuleVerdict.PASS);
```

Here `closedClaims` must be a safely published immutable snapshot. Retain the `RuleRegistration` and close it when the rule is no longer needed. Closing is idempotent; an old handle cannot remove a replacement. Provider disable and Bastion shutdown remove registrations automatically. An already-running callback may finish, but removal discards its result. Registrations are runtime state and must be recreated after restart. A provider re-enabling the same plugin instance should register from its `PluginEnableEvent` at `MONITOR`, after the disable guard clears.

Each callback has a 5 ms elapsed-time budget, each query a 10 ms total budget, and each rule a cumulative 50 ms budget per second across all queries, so a rule that is slow on many explosion blocks or hopper transfers is quarantined with `CUMULATIVE_BUDGET`. These checks detect overruns after a callback returns; they cannot interrupt Java code or prevent its first stall. Exceptions, linkage failures, null results, recursion and measured overruns quarantine the callback and emit one full failure trace. `FailurePolicy.DENY` then denies every selected flag query that reaches the rule, without rerunning its original location/actor predicate; `PASS` continues to other rules. Uncalled rules skipped at the total budget use their failure policy for that query. Fix the provider and close/re-register its rule to recover.

`statuses()` returns immutable definitions and typed fault states. Debug dumps include them. A denied decision has reason `EXTENSION` and `extension()` containing provider, rule ID and a fault indicator; `/bastion why` displays provider and rule. Native policy previews, `effectiveFlag(...)`, claim-only checks, entry bans/locks and cross-border transfer invariants remain separate. This API does not add custom stored flags, entry rules or protection for events Bastion does not handle.

## Server ownership

`Claim.ownership()` distinguishes `PLAYER` from `SERVER`. `owner()` is null for server land; use `ownedBy(UUID)` for identity checks and `serverOwned()` for ownership kind. Server land is absent from player owner indexes and accounting. The creator UUID appears only as the audit actor.

Administrative creation, geometry, plot and policy methods are integration entry points; callers must enforce administrator authorization. Built-in commands enforce `bastion.server` and recheck reviewed state before mutation. Server land rejects player transfer, market, anchor, fuel and restructuring operations. `Claim`'s canonical constructor includes ownership, conditions, icon and zone game mode; full-record consumers must supply these explicitly.

## Custom anchor fuels

Register an `AnchorFuelProvider` through Bukkit's `ServicesManager` to authenticate custom anchor items. Its `id()` must return a stable lowercase provider ID; the `authentic(itemId, item)` callback receives the configured item ID and a clone of the candidate stack. Return true only for the exact item your plugin issued. Keep the callback fast and side-effect free; it runs synchronously while Bastion validates fuel.

Configure an entry under `power.additionalFuels` with a unique `id`, a Bukkit `material`, seconds per item, and matching `provider` and `item` IDs. Entries without a provider are vanilla fuels and must have no item metadata. Custom fuels become unavailable when the provider is absent, duplicated, disabled, or replaced. Fuel receipts capture the current provider registration identity, so a reload invalidates an old review or unresolved transaction instead of silently trusting a replacement service.

```java
getServer().getServicesManager().register(
        AnchorFuelProvider.class,
        new AnchorFuelProvider() {
            @Override
            public String id() { return "my-items"; }

            @Override
            public boolean authentic(String itemId, ItemStack item) {
                return itemId.equals("claim-crystal") && myItemService.isClaimCrystal(item);
            }
        },
        this,
        ServicePriority.Normal);
```

[Welcome messages](/bastion/05-claim-welcome-messages) · [Notification inbox](/bastion/06-notification-inbox) · [Directory](/bastion/07-public-directory) · [Bastion](/bastion)
