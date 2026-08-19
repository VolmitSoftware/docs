---
title: Iris — Developer API
description: Accessing Iris from another plugin
published: true
date: 2026-08-19T00:00:00.000Z
tags: iris, api
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Iris exposes `IrisToolbelt` as its public entry point. Add Iris as a `softdepend` in your own
`plugin.yml`. Guard every call with `IrisToolbelt.isIrisWorld(world)`.

## IrisToolbelt

```java
package com.volmit.iris.core.tools;

// Get IrisDataManager from a world
IrisToolbelt.access(anyWorld).getCompound().getData();

// Get the default engine from a world
IrisToolbelt.access(anyWorld).getCompound().getDefaultEngine();

// Get the engine at a given height
IrisToolbelt.access(anyWorld).getCompound().getEngineForHeight(68);

// Is this an Iris world?
boolean yes = IrisToolbelt.isIrisWorld(world);

// Move every player out of a world
IrisToolbelt.evacuate(world);
```

## Creating a world programmatically

```java
IrisAccess access = IrisToolbelt.createWorld()
    .name("myWorld")
    .dimension("terrifyinghands")
    .seed(69133742)
    .pregen(PregenTask
        .builder()
        .center(new Position2(0, 0))  // REGION coords (1 region = 32x32 chunks)
        .radius(4)                    // radius in REGIONS; 4 gives a 9x9 region map
        .build())
    .create();
```

> **Note on pregen units.** `center` and `radius` are in *regions*, not chunks or blocks.
> One region is 32×32 chunks. A radius of 4 produces a 9×9 region map, which is 288×288
> chunks. That is considerably more world than the number suggests.

## Compatibility

`IrisToolbelt` is the supported surface. Classes under `com.volmit.iris.engine` and
`com.volmit.iris.util` are internal and change between releases without notice.
