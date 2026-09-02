---
title: "HiddenOre API"
description: "Developer API index"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "hiddenore, api"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Use the HiddenOre API to inspect block provenance and seeded veins, cancel a reward, or edit its drops.

## Dependency

Compile against the same HiddenOre jar installed on the server. Do not include HiddenOre classes in your own jar.

```groovy
dependencies {
    compileOnly files("libs/HiddenOre.jar")
}
```

Bukkit plugins:

```yaml
softdepend: [HiddenOre]
```

Paper plugins:

```yaml
dependencies:
  server:
    HiddenOre:
      load: BEFORE
      required: false
      join-classpath: true
```

## Get the service

```java
RegisteredServiceProvider<HiddenOreService> registration =
    getServer().getServicesManager().getRegistration(HiddenOreService.class);

if (registration == null) {
    return;
}

HiddenOreService hiddenOre = registration.getProvider();
```

Resolve the service again after HiddenOre is disabled and enabled.

## Choose the API

| Need | API |
|---|---|
| Check whether a block was placed, generated, or already claimed | `HiddenOreService` |
| Find seeded veins | `HiddenOreService` |
| Cancel a reward | `HiddenOreBreakEvent` |
| Edit drops or experience | `HiddenOreDropsEvent` |
| Display values in text | [PlaceholderAPI](/hiddenore/api/placeholders) |

Block queries must run on the thread that owns the block's region.

## Reference

- [Service](/hiddenore/api/service)
- [Events](/hiddenore/api/events)
- [Placeholders](/hiddenore/api/placeholders)
{.links-list}
