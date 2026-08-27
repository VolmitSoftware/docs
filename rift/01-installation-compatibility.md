---
title: "Rift — Installation & Compatibility"
description: "Legacy platform requirements, installation, and source build for Rift 2.0.2"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "rift, installation, compatibility, legacy"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift 2.0.2 is not version-independent. It was compiled against Spigot 1.19 and
imports `org.bukkit.craftbukkit.v1_19_R1.CraftServer` directly. The plugin then
uses Minecraft's internal command dispatcher.

> A server on another CraftBukkit package revision will fail during enable with
> a missing-class or cast/linkage error. Paper and Spigot updates can change this
> package even when the public Bukkit API remains compatible.
{.is-warning}

## Requirements

| Component | Audited requirement |
|---|---|
| Server | A Spigot-derived build exposing CraftBukkit `v1_19_R1` |
| Java | Java 17 |
| Generator plugin | Optional; must load and expose a Bukkit chunk generator |
| Backup | Full world and plugin-data backup strongly required |

Folia is unsupported. Current Minecraft, Paper, and Spigot releases are outside
the audited target. Test only on a disposable copy of the intended server.

## Install an existing artifact

1. Stop the server.
2. Back up the entire server directory to a different location.
3. Confirm the server's CraftBukkit revision is `v1_19_R1` and it runs Java 17.
4. Put a trusted Rift 2.0.2 jar in `plugins/`.
5. Start the server normally and check that Rift enabled without an exception.
6. Run `/rift` from an operator account and confirm it reports version `2.0.2`.
7. Test create, unload, restart, and reload behavior with a disposable world.

Avoid `/reload`, plugin hot-loaders, and production-world testing.

## Build from source

The audited revision uses Gradle Wrapper 7.2 and deliberately terminates the
build unless Gradle itself is running on Java 17.

```text
git clone https://github.com/VolmitSoftware/Rift.git
cd Rift
git checkout 26a532424716da8a708cd16e83917614065cd64d
./gradlew clean build
```

On Windows, run `gradlew.bat clean build`. The expected artifact is
`build/libs/Rift-2.0.2.jar`.

The build depends on an archived Spigot 1.19 artifact repository as well as
Maven Central. A repository outage can prevent a clean build. There are no
automated tests in the repository.

## Generator load order

Install and verify a custom generator before asking Rift to create or import a
world with it. Rift does not declare soft dependencies for generator plugins.
For worlds in `bukkit.yml`, it skips a generator string beginning exactly with
`Iris`; other entries are passed to Bukkit's `WorldCreator` during Rift startup.

Next: [Commands & Permissions](/rift/02-commands-permissions)
