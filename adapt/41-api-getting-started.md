---
title: "API - Getting Started"
description: "The Adapt API artifact, the example addon, and depending on Adapt from a plugin or mod"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

The Adapt API lets a plugin or mod define its own skills, adaptations, items and commands, and read or change player progress. The same classes work on Paper, Purpur, Folia, Spigot, Fabric, Forge and NeoForge. Adapt's 24 built-in skills are installed through the same API, as an addon with the namespace `adapt`.

| | |
|---|---|
| Artifact | `art.arcane.adapt:adapt-api:1.0.0` |
| Java | Compiled for Java 17 (`release 17`) |
| Dependencies | None at runtime. Add `org.jetbrains:annotations` at compile time so your IDE shows the `@ApiStatus` tiers |
| Entry point | `art.arcane.adapt.api.AdaptApi` |
| Packages | `art.arcane.adapt.api.*` for content and players, `art.arcane.adapt.platform.*` for players, worlds, items, events and scheduling |

The API holds no Bukkit, Minecraft or loader types. Players, blocks, items and events are Adapt's own `platform` types, so one addon class compiles once and runs on every platform.

## What Adapt is made of

| Part | Holds | An addon sees it as |
|---|---|---|
| `adapt-api` | Every public type, in `art.arcane.adapt.api.*` and `art.arcane.adapt.platform.*` | The one compile dependency |
| Built-in content | The 24 skills, their adaptations, mutation blocks, upgrades, signatures, items, golemancy and the English text, as the addon `adapt` | Another addon. It is compiled against `adapt-api` alone and installed through `AdaptAddon` like yours, so everything a built-in skill does is open to an addon |
| Engine | Registry, saves, menus, the client protocol, localization | Nothing. It implements the API behind `AdaptApi` |
| Plugin and mod jars | Engine, built-in content and the platform host for each loader | The plugin or mod your addon depends on at runtime |

The Adapt build checks both boundaries: built-in content may name only `adapt-api` types, and the engine may not name built-in content.

## The example addon

The Adapt source tree has a complete addon in `examples/`, and the developer pages quote it:

| Folder | Holds |
|---|---|
| `examples/example-content` | The addon itself: the `example:geology` skill, four adaptations, one adaptation for the built-in Pickaxes skill, a mutation kit, a field notes section in each player's save, the `/adapt geology` command, English and German text, and 16x16 sprites |
| `examples/example-plugin` | A Bukkit plugin that installs it |
| `examples/example-mod` | One Fabric, one Forge and one NeoForge jar that install it, from one source tree |

Both builds compile the same `example-content` sources against `adapt-api` and nothing else of Adapt.

## Build the API

The artifact is not on a public repository. Build it from an Adapt source checkout and install it into your local Maven repository:

```sh
./gradlew :api:publishToMavenLocal
```

This installs `adapt-api-1.0.0.jar` with its sources and Javadoc jars under `~/.m2/repository/art/arcane/adapt/adapt-api/1.0.0/`.

Depend on it at compile time only. Adapt provides the classes at runtime, so never shade them into your jar. From `examples/example-plugin/build.gradle`:

```groovy
repositories {
    exclusiveContent {
        forRepository { mavenLocal() }
        filter { includeGroup('art.arcane.adapt') }
    }
    mavenCentral()
}

dependencies {
    compileOnly('art.arcane.adapt:adapt-api:1.0.0')
    compileOnly('org.jetbrains:annotations:26.0.2-1')
}
```

Do not put your own classes in an `art.arcane.adapt.*` package.

## Depend on Adapt from a Bukkit plugin

Declare Adapt as a hard dependency in `plugin.yml`, and set `folia-supported` when the plugin should load on Folia. From `examples/example-plugin/src/main/resources/plugin.yml`:

```yaml
name: AdaptGeology
main: com.example.geology.bukkit.GeologyPlugin
version: '${version}'
api-version: '1.21'
depend: [Adapt]
folia-supported: true
```

Install the addon from `onEnable` and uninstall it from `onDisable`. From `GeologyPlugin.java`:

```java
public final class GeologyPlugin extends JavaPlugin {
  private AddonHandle handle;

  @Override
  public void onEnable() {
    handle = AdaptApi.addons().install(new GeologyAddon());
    getLogger().info("Geology addon " + handle.state());
  }

  @Override
  public void onDisable() {
    if (handle != null) {
      handle.uninstall();
      handle = null;
    }
  }
}
```

## Depend on Adapt from a mod

On Fabric, Forge and NeoForge, Adapt's mod id is `adapt`. Declare a required dependency on it so your mod loads after Adapt.

Fabric, in `fabric.mod.json`:

```json
{
  "entrypoints": {
    "main": ["com.example.geology.fabric.GeologyFabric"]
  },
  "depends": {
    "adapt": "*"
  }
}
```

Forge, in `META-INF/mods.toml`:

```toml
[[dependencies.adaptgeology]]
modId = "adapt"
mandatory = true
versionRange = "[0,)"
ordering = "AFTER"
side = "BOTH"
```

NeoForge, in `META-INF/neoforge.mods.toml`, takes the same entry with `type = "required"` in place of `mandatory = true`.

A Forge 1.20.1 mod jar also ships a `pack.mcmeta` at its root, or Forge logs missing pack metadata for it:

```json
{
  "pack": {
    "description": "Adapt Geology",
    "pack_format": 15
  }
}
```

Install the addon where the loader expects registration: `onInitialize` of a Fabric mod, or the constructor of a Forge or NeoForge mod. From `GeologyFabric.java` and `GeologyForge.java`:

```java
public final class GeologyFabric implements ModInitializer {
  @Override
  public void onInitialize() {
    AdaptApi.addons().install(new GeologyAddon());
  }
}
```

```java
@Mod("adaptgeology")
public final class GeologyForge {
  public GeologyForge() {
    AdaptApi.addons().install(new GeologyAddon());
  }
}
```

The NeoForge class is the same with `net.neoforged.fml.common.Mod`. `GeologyAddon` is the same on every platform; only the entry point differs. [Addons](/adapt/42-api-addons) explains what it contains.

## When the API is available

`AdaptApi` has three kinds of accessor.

| Kind | Accessors | Available |
|---|---|---|
| Registries | `addons()`, `events()`, `abilities()`, `protection()`, `services()` | At any time, also before Adapt has started. What you register holds across restarts of Adapt's core |
| Queries | `content()`, `players()`, `platform()`, `settings()`, `log()` | While a core runs. They throw `IllegalStateException` otherwise |
| Time | `scheduler()`, `clock()` | At any time. While no core runs, the scheduler runs nothing and the clock reads system time and tick 0 |

A core runs from `AdaptStartedEvent` to `AdaptStoppingEvent`. On a mod platform that is one server run, and a client that opens several worlds runs several cores. `AdaptApi.isRunning()` reports whether one runs now. Code inside a skill, adaptation or command always has a running core.

### The platform

`AdaptApi.platform()` returns the platform's hosts: players and worlds, the scheduler, effects, viewers, menus, permissions, protection and recipes. Each host forwards to the platform's own and leaves out what only Adapt may do, so an addon cancels, closes and removes only what it made:

| Host | What an addon holds |
|---|---|
| `scheduler()` | The `TaskHandle` that `runAsync` and every `repeat*` method return. Cancel a task through its handle |
| `menus()` | The `MenuSession` that `open(viewer, menu)` returns. Close a menu through its session |
| `permissions()` | The `PermissionRegistration` that `register(node, description, fallback)` returns. Its `remove()` is the only way to remove the node, and removes nothing for a node that was already registered |
| `recipes()` | The `RecipeRegistration` that `register(recipe)` returns, empty when the platform rejected the recipe. Its `remove()` is the only way to remove the recipe |

`AdaptApi.scheduler()` is the same scheduler, usable at any time: while no core runs, `run*` methods return false and `runAsync` and `repeat*` return an already cancelled handle.

`AdaptApi.services()` holds services an addon offers to others. `provide(namespace, type, implementation)` provides one in the addon's name: a later provider of the same type takes over until it withdraws, the takeover is logged with both owners, and uninstalling the addon withdraws its services.

## Stable, experimental and internal

Every public type in `art.arcane.adapt.api` and `art.arcane.adapt.platform` carries one JetBrains `@ApiStatus` tier annotation on the type. Members of a stable type are stable unless the member itself is marked `@ApiStatus.Experimental` or `@ApiStatus.Internal`.

| Tier | Marked | Promise |
|---|---|---|
| Stable | `@ApiStatus.AvailableSince("1.0.0")` on the type | Binary compatible within a major version. A minor version only adds |
| Experimental | `@ApiStatus.Experimental` on the type or the member | Usable now. May change in a minor version |
| Internal | `@ApiStatus.Internal`: every type in `art.arcane.adapt.api.internal`, `JarResources`, and members such as `unwrap()` and the dispatch setters of `AdaptEvent` | None. Adapt's engine and platform hosts use these. Do not call them |

The experimental tier covers:

- the mutation types in `art.arcane.adapt.api.mutation` (`UpgradeDeclaration` among them), `MutationResult`, `SkillMutateEvent`, `SkillUnmutateEvent`, and the mutation members of `SimpleSkill`, `Skill`, `ContentCatalog`, `ContentRegistrar` and `PlayerProfile`
- `AssetBundle`, `AssetEntry`, `AssetKind`, `Icon` and `ContentRegistrar.assets`
- the client API in `art.arcane.adapt.api.client`, and the Insight views and `InsightFeed` in `art.arcane.adapt.api.insight`
- the effect builders `Fx`, `FxEmitter`, `FxTimeline` and `FxPresets`, and the viewer types in `art.arcane.adapt.api.viewer`
- per-addon data: `PlayerSection`, `BlockSlice`, `BlockStore`, `ContentRegistrar.playerSection` and `ContentRegistrar.blockSlice`, `PlayerProfile.section`, `PlayerDirectory.peek`, `BlockFlag`, `Chunks`, `BonusBreaks`, `BlockTagSet`
- items: `MixingRecipe`, `ShapedRecipeParser`, `ExactIngredient`, `ExactItemResolver`, `RecipeItemCatalog`, `ItemArt`, `ItemCooldowns`, `ItemWear`, `MaterialNames`, `MaterialValues`, `MaxDurability`, `Potions`
- abilities and XP: `Minions`, `MinionKind`, `VelocityBurst`, `DoubleJump`, `Experience`, `DiscoveryKind`, `CombatXp`, `MobOrigin`, `XpProvenance`, `MovementXp`, `ItemTransferXp`, `CraftingXpTransaction`, `ProjectileCooperativeKeys`, `ProjectileReplacements`
- integrations: `Integrations`, `HiddenVein`, `TreeFelling`, `GlossOverlay`, `PluginContainer`, `PluginStateEvent`, `ServiceChangeEvent`
- `ProtectionProbes`, `AdaptAttributeService`, `LegacyModifierKey`, `AdaptationDamageTargets`, `Markup`, `Text.renderFor`
- `AdaptSettings.overchargeStrength()`

`AssetBundle.resources` and `MessageBundle.resources` read jars through the internal `JarResources`; call those two methods, not `JarResources`.

Two more annotations say who implements an interface. `@ApiStatus.NonExtendable` interfaces, such as `ContentCatalog` and `PlayerProfile`, are implemented by Adapt; call them, do not implement them. `@ApiStatus.OverrideOnly` interfaces, such as `AdaptAddon` and `ArgumentType`, are yours to implement, and Adapt calls them.

See [Versioning and compatibility](/adapt/52-api-versioning) for how versions are numbered and checked.

## Developer pages

| Page | Covers |
|---|---|
| [Addons](/adapt/42-api-addons) | Namespaces, `AdaptAddon`, `ContentRegistrar`, install, refresh, uninstall, load errors, id rules |
| [Skills and XP](/adapt/43-api-skills) | `SimpleSkill`, skill config, XP sources, the XP guide, advancements, learner pulses |
| [Adaptations](/adapt/44-api-adaptations) | `SimpleAdaptation`, costs, requirements, preferences, stat lines, recipes, items, HUD, threading |
| [Commands](/adapt/53-api-commands) | `/adapt` subcommands, typed arguments, completion and permissions |
| [Text and translations](/adapt/45-api-text) | Message bundles, convention keys, `Text`, admin overrides |
| [Icons, art and themes](/adapt/46-api-art-themes) | Asset layout, icons, theme kits, hover frames, client code |
| [Mutations](/adapt/47-api-mutations) | Mutating players' skills, kits, upgrades, pair content and mutated ids |
| [Players and content](/adapt/48-api-players-content) | `ContentCatalog`, vetoes, `PlayerProfile`, learning, boosts, orphans, server settings |
| [Events](/adapt/49-api-events) | Progress, lifecycle and platform events |
| [Abilities, protection and world](/adapt/50-api-abilities-protection) | Gating and pricing abilities, protectors, ability damage, minions, integrations, block scans and build batches |
| [PlaceholderAPI](/adapt/51-api-placeholders) | `%adapt_...%` placeholders |
| [Versioning and compatibility](/adapt/52-api-versioning) | API version, tiers, platform support |
