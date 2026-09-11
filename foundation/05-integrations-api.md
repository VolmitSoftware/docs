---
title: "Integrations and Service APIs"
description: "Foundation Vault, PlaceholderAPI, and Adapt behavior, Bukkit services, item policy, and VolmLib metrics"
published: true
date: 2026-09-06T03:30:00.000Z
tags: "foundation, vault, placeholderapi, adapt, api, integrations"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Foundation uses optional Bukkit services rather than hard dependencies. Integrations appear and disappear with the owning plugin, configuration, or Foundation module and are unregistered during Foundation's drain lifecycle.

## Vault

Foundation's economy module is disabled by default. `economy.vaultProviderMode` controls publication when the module and Vault are active: `OFF` never publishes, `IF_ABSENT` publishes at normal priority only while no other economy owns the service, and `FORCE` attempts highest priority. Foundation verifies that Vault actually selected its provider and removes any losing duplicate registration. It responds to late plugin and service registration changes as well as configuration reloads.

The provider exposes Foundation's UUID-backed global ledger, configured decimal and currency formatting, and offline-player accounts. World-specific overloads use the same global balance, and bank operations are unsupported. Foundation finishes its bounded asynchronous balance-index load before registering the provider; if any profile cannot be indexed completely or the configured account cap is exceeded, registration is refused and the full failure is logged. Once registered, Vault calls read and mutate memory only, while a single coalescing worker persists accepted changes through the canonical JSON profile repository.

`EconomyService.initializeAsync()` exposes the readiness result used by the module lifecycle, and `balanceSnapshot(maximum)` returns an immutable, bounded ledger snapshot only after readiness. `rememberAccountName(UUID, String)` updates the snapshot label from an already-resolved player name, while `accountId(String)` resolves known names from that same memory index; neither method performs a player or disk lookup.

Foundation commands always read and write Foundation's JSON ledger. They do not consume another Vault economy provider's ledger. `IF_ABSENT` is the coexistence default: Foundation yields when another provider is already selected and unregisters if one appears later. `FORCE` is an explicit operator choice to make Foundation compete for ownership; it still refuses to leave a duplicate registered if Vault selects another provider.

## PlaceholderAPI

Set `integrations.placeholderApi=false` to suppress publication. Foundation registers when PlaceholderAPI becomes available and unregisters when it disables.

| Placeholder | Value |
|---|---|
| `%foundation_available%` | `true` while the expansion is active |
| `%foundation_afk%`, `%foundation_vanished%` | Player-state flags |
| `%foundation_muted%`, `%foundation_jailed%` | Moderation flags |
| `%foundation_accepting.messages%` | Private-message acceptance |
| `%foundation_accepting.payments%` | Payment acceptance |
| `%foundation_accepting.teleports%` | Teleport-request acceptance |
| `%foundation_mail.unread%` | Unread mail count |
| `%foundation_cosmetic.particle%` | Selected particle, or `default` |
| `%foundation_homes.count%`, `%foundation_homes.names%` | Home count and comma-separated names |
| `%foundation_balance%` | Numeric Foundation balance |
| `%foundation_balance.formatted%` | Foundation currency-formatted balance |
| `%foundation_modules.active%`, `%foundation_modules.total%` | Active and registered module counts |
| `%foundation_language%` | Active server locale |
| `%foundation_worth.entries%` | Current worth-catalog size |
| `%foundation_module.<module-id>%` | Whether the named module is active |
| `%foundation_worth.<material>%` | Numeric catalog value for a valid item material |

Player values require a player context and a currently loaded profile. Module-owned values also require their module to be active, and balance requires economy. Unavailable values return `---`; boolean values return `true` or `false`. An unknown module returns `false`, while an invalid material or inactive worth module returns `---`; a valid catalog price may be `0`.

## Adapt

Adapt is an optional load-order dependency, not a required runtime dependency. While Adapt and Foundation's moderation module are active, Foundation registers the Adapt ability-use policy provider `foundation-moderation` at normal Bukkit service priority. The provider applies to every Adapt ability and denies a check when the online player's already-loaded Foundation profile is frozen or has an unexpired jail sentence. A frozen state takes precedence when both states apply, and the denial reason is resolved from that player's active Foundation language file.

The policy registration follows late Adapt enable and disable events and is removed immediately when Adapt, Foundation moderation, or Foundation itself stops. Foundation does not load offline profiles from the ability path. An absent or incompatible Adapt policy API leaves moderation operational and allows the affected ability check; Foundation logs the integration failure with its stack trace so operators can identify a version mismatch.

## Gloss

Gloss chat bubbles use Bukkit's per-viewer `canSee` result for their speaker, so Foundation's hide/show layer also controls who can see the speaker's bubbles. Gloss applies that predicate before publishing a new bubble and reevaluates it on normal visibility updates. Style visibility rules and `hideOwn` still apply. This uses the Bukkit visibility contract without a hard dependency between the plugins; it does not claim suppression of every Gloss display type.

## Java API

Foundation registers `art.arcane.foundation.api.FoundationApi` as a normal-priority Bukkit service. It exposes the plugin version, immutable module-state snapshots, case-insensitive active-module checks, immutable loaded-player snapshots, and a loaded Foundation balance. `player(UUID)` performs no implicit disk read and returns empty until that profile is loaded; `balance(UUID)` also returns empty while economy is inactive.

```java
RegisteredServiceProvider<FoundationApi> registration =
    Bukkit.getServicesManager().getRegistration(FoundationApi.class);

if (registration != null) {
    FoundationApi foundation = registration.getProvider();
    foundation.player(player.getUniqueId()).ifPresent(snapshot -> {
        int homes = snapshot.homes().size();
        boolean vanished = snapshot.vanished();
    });
}
```

The player snapshot includes home names, AFK and vanish flags, acceptance choices, mute and jail state, unread mail, cosmetic particle, last known name, and first/last-seen timestamps. Module-owned fields are neutral when that module is inactive. Resolve the service again after plugin reload rather than retaining its provider instance.

## Item-operation policy

`art.arcane.foundation.api.item.ItemOperationPolicy` is a second normal-priority Bukkit service. Other plugins can inspect an `ItemStack` for `CLONE`, `RESIZE`, `SELL`, `REPAIR`, `ENCHANT`, `STORE`, `GRANT`, or `DELETE`, and can register a priority-ordered `ItemPolicyProvider` for owned persistent-data namespaces. Close the returned `ItemPolicyRegistration` when the provider stops.

Inspection recursively covers use remainders, bundles, block-state persistent data, and container contents with depth and item-count bounds. A denial includes the nested item path and reason. Global providers may deny any item; foreign persistent-data namespaces fail closed unless their owning provider explicitly allows the operation, and provider failures deny the operation and are logged.

## VolmLib integration contract

Foundation registers `IntegrationServiceContract` at normal priority with plugin ID `foundation`, capabilities `handshake`, `heartbeat`, and `metrics`, and protocol versions 1.0 and 1.1. A handshake negotiates the newest common protocol. This service uses the shared VolmLib schema and does not require React or send telemetry by itself.

| Metric | Type and meaning |
|---|---|
| `foundation.modules-active` | Integer active-module count |
| `foundation.modules-available` | Integer registered-module count |
| `foundation.profiles-loaded` | Integer loaded-profile count |
| `foundation.profiles-dirty` | Integer dirty-profile count |
| `foundation.profiles-read-only` | Integer read-only-profile count |
| `foundation.profiles-accepting` | Integer boolean: repository accepting work |
| `foundation.profile-saves-active` | Integer active-save count |
| `foundation.profile-save-failures-total` | Long cumulative save-failure count |
| `foundation.worth-entries` | Integer worth-catalog item count |
| `foundation.worth-read-only` | Integer boolean: catalog read-only state |

These are Foundation's ten published metrics. Suite ownership and the current Wormholes, Adapt, Gloss, React, Rift, Iris, and portal boundaries are documented in [Overview and suite boundaries](/foundation/00-overview).
