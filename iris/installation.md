---
title: Iris — Installation
description: Requirements and first-world setup
published: true
date: 2026-08-09T00:00:00.000Z
tags: iris, installation
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Server software | Paper or a Paper fork (Purpur, Leaf) |
| Java | JDK 21+ |
| Load order | `STARTUP` — Iris loads before worlds |

Iris downloads its own runtime libraries on first start (`zt-zip`, `fastutil`, `guava`, `asm`,
`gson`, `concurrentlinkedhashmap-lru`, `bsf`, `rhino`). The first boot after installing will
take longer than subsequent ones and needs outbound network access.

## Install

1. Stop the server.
2. Drop `Iris-x.x.x.jar` into `plugins/`.
3. Start the server and let it finish downloading libraries.
4. Stop the server again once `plugins/Iris/` has been created.

## Creating your first world

```
/iris create <world-name> [dimension] [seed]
```

`dimension` defaults to `default`. To use a community pack, download it first:

```
/iris download <pack>
/iris create myworld overworld
```

Then teleport in with `/iris teleport <world>`.

## Pregenerating

Generating on demand is expensive. For a production server, pregenerate before opening:

```
/iris pregen start
```

`/iris lazypregen start` runs slower but leaves more headroom for live players.
`/iris turbopregen start` is the fastest and the most disruptive — use it on an empty server.
Both `stop` (alias `x`) and `pause` (alias `t`) work on a running task.

## Building from source

Iris builds with Gradle and requires **JDK 21** with `JAVA_HOME` set:

```
git clone https://github.com/VolmitSoftware/Iris.git
cd Iris
./gradlew iris
```

The jar lands in `Iris/build/`.
