---
title: "API - Getting Started"
description: "Add Adapt as a dependency and choose a supported API"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt exposes APIs for skills, abilities, events, protection, progression, recipes, and metrics.

## Add Adapt to your project

Compile against the deployed `Adapt-<version>-all.jar` without bundling it:

```groovy
dependencies {
    compileOnly files('libs/Adapt-<version>-all.jar')
}
```

Declare Adapt as an optional dependency. Paper plugins that import Adapt classes need `join-classpath: true`.

```yaml
dependencies:
  server:
    Adapt:
      load: BEFORE
      required: false
      join-classpath: true
```

Check that Adapt is enabled before loading your integration class:

```java
Plugin plugin = Bukkit.getPluginManager().getPlugin("Adapt");
if (plugin instanceof Adapt adapt && adapt.isEnabled()) {
    new AdaptBridge(adapt).enable();
}
```

## Adapt relocates VolmLib

Use only types and methods documented in these API pages. Do not expose or import Adapt's relocated utility types.

## Choose an API

| Goal | Guide |
|---|---|
| Read skills or learn adaptations | [Skills & Adaptations](/adapt/42-api-skills-adaptations) |
| Deny ability use | [Ability Use Policy](/adapt/43-api-ability-use-policy) |
| Charge a custom resource | [Ability Cost](/adapt/44-api-ability-cost) |
| Listen for Adapt behavior | [Events](/adapt/45-api-events) |
| Respect claims or regions | [Protection](/adapt/46-api-protection) |
| Display values | [PlaceholderAPI](/adapt/47-api-placeholderapi) |
| Read mutations | [Mutations](/adapt/48-api-mutations) |
| Award progression | [Player Data, XP & World](/adapt/49-api-player-data-xp-world) |
| Recipes, effects, and telemetry | [Utilities](/adapt/50-api-recipes-fx-telemetry-utilities) |

Bukkit player and world calls must run on their owning thread. Service callbacks document whether Adapt may call them asynchronously.
