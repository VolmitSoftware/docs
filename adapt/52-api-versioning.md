---
title: "API - Versioning and Compatibility"
description: "The API version, what each stability tier promises, and which platforms one addon runs on"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

## API version

The API has its own version, independent of Adapt's. `AdaptApi.VERSION` holds it at runtime, and the artifact `art.arcane.adapt:adapt-api` carries the same version. It is `1.0.0`.

The version is semantic. A new minor version only adds to the stable tier, and a new major version may remove or change it.

## Tier annotations

The tiers are JetBrains annotations on each public type of `art.arcane.adapt.api` and `art.arcane.adapt.platform`. Every public type carries exactly one, and the API build fails when one is missing:

| Annotation | On | Means |
|---|---|---|
| `@ApiStatus.AvailableSince("1.0.0")` | A stable type | The API version that added the type. Its members are stable with it |
| `@ApiStatus.Experimental` | A type, or one member of a stable type | That type or member is experimental |
| `@ApiStatus.Internal` | A type, or one member of a stable type | Adapt's engine and platform hosts use it. Every type in `art.arcane.adapt.api.internal` carries it, as do members such as `unwrap()` |

`AvailableSince` is never placed on a member, so a stable type's members date from the type's version unless marked otherwise.

## What each tier promises

| Tier | Promise |
|---|---|
| Stable | Binary compatible within a major version. An addon compiled against `1.0.0` keeps working on every later `1.x` |
| Experimental | May change or be removed in a minor version. Rebuild against the new API when Adapt updates |
| Internal | No promise. May change in any release |

## Compatibility check

Adapt's API build has a compatibility check, the `apiCompatibility` task, that compares the API jar with an earlier release. It exists when the build is given the release to compare with:

```sh
./gradlew :api:apiCompatibility -PapiBaselineVersion=1.0.0
```

The baseline `art.arcane.adapt:adapt-api` of that version is read from the local Maven repository, so install it there first, for example with `:api:publishToMavenLocal` from a checkout of that release. To keep the baseline in a repository folder of its own, pass `-Dmaven.repo.local=<folder>` to both the publish and the check. With the property set, `:api:check` runs the task too. It fails on a binary-incompatible change to a public or protected member, except types and members marked `@ApiStatus.Experimental` or `@ApiStatus.Internal` and the `internal` packages, and writes its report to `api/build/reports/api-compatibility.txt`.

Interfaces marked `@ApiStatus.NonExtendable` are implemented by Adapt, which may add methods to them; call them, do not implement them.

## What a minor version may add

Code that follows these rules keeps compiling and running across `1.x`:

| A minor version may | So your code |
|---|---|
| Add constants to any enum, such as `LearnResult.Status` or `ProtectionCheck` | Gives every `switch` over an Adapt enum a `default` branch. A `Protector` denies a check it does not know |
| Add methods to `NonExtendable` interfaces | Never implements them |
| Add accessors to values Adapt creates, such as `LearnResult`, `OrphanedLine`, `BuildResult`, `AbilityContext`, `AbilityCostContext`, `AbilityCharge`, `LastDamage`, `RecipeView`, `AdvancementNode`, `MutationResult`, `BlockScan.Match` and `BlockScan.Result` | Reads them through their accessors. These values are `NonExtendable` interfaces, so new accessors break nothing |
| Add factories or builder steps to values you create, such as `XpAward`, `LearnOptions`, `Toast`, `EffectInstance`, `PotionContents`, `MenuIcon`, `MenuMeta`, `MenuHint`, `ArmorStandStyle`, `Icon`, `VelocityBurst.Profile`, `AbilityQuote`, `AbilityReservation`, `AbilityUseDecision`, the `RecipeSpec` kinds and `BlockScan.Supplied` | Builds them with their factories, such as `XpAward.of`, `RecipeSpec.shaped` and `BlockScan.Supplied.at`, or their builders, such as `VelocityBurst.Profile.builder()` and `InsightView.builder`. These are final classes without public constructors |

Records in the API are closed values that will not grow: `Id`, `Rgb`, `BlockPos`, `Vec3`, `ChunkPos`, `SkillPair`, `BlockKey` and the like.

## Platforms

An addon compiled against the API alone runs on every platform and Minecraft version Adapt supports: Paper, Purpur, Folia and Spigot servers, and Fabric, Forge and NeoForge. Only the entry point that installs the addon is platform-specific ([Getting started](/adapt/41-api-getting-started)).

| Difference | Where |
|---|---|
| PlaceholderAPI placeholders | Bukkit servers with PlaceholderAPI installed |
| Region threads | Folia only. Write every addon for Folia, see [threading](/adapt/44-api-adaptations#threading) |
| Hover frames in client code | A client mod of your own, through `AdaptClientApi` |
| Optional integrations | `AdaptApi.platform().has(Capability)` reports economy, protection plugins, WorldGuard and the others on Bukkit servers. Fabric, Forge and NeoForge report only `PROTECTION_PLUGINS`, while a claim mod is loaded |

Content that depends on a Minecraft feature only some versions have declares it with `needs(PlatformNeed...)`. On a version without it the content is left out and listed with the reason in the startup log. `PlatformNeed.attribute`, `emulatedFeature`, `partialFeature` and `partialAttribute` keep the content where Adapt can stand in for the feature or where only part of the content depends on it.
