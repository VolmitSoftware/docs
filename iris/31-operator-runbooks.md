---
title: "Operator Runbooks"
description: "Iris documentation: Operator Runbooks"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---
Use these checks after installing Iris, updating it, or changing a pack.

## Install or update

1. Confirm the server runs Java 25 and uses the correct Iris jar or mod.
2. Start the server and check that Iris enables without errors.
3. Validate each production pack with `/iris pack validate pack=<pack>` on Bukkit or `/iris pack validate <pack>` on a mod loader.
4. Generate new chunks in a disposable world before opening production worlds.

See [Installation & Platforms](/iris/01-installation-platforms) and [Pack Management](/iris/25-pack-management).

## A pack will not load

Run the pack validator and fix its blocking errors. Confirm that every referenced key exists. If the pack changed world height or dimension type, create a new world instead of updating the old one.

See [Concepts & Pack Layout](/iris/05-concepts-pack-layout) and [Worlds & Lifecycle](/iris/06-worlds-lifecycle).

## A world will not open

Run `/iris worlds` and confirm the world has a live Iris engine. Check the console for the first pack or registry error. Do not delete `<world>/iris/pack`; it is the world's frozen pack copy.

## Pregeneration stalls

Check status before restarting the job. Lower concurrency or mantle limits if memory pressure is high. Cancel cleanly before changing the pack or replacing Iris.

See [Pregeneration](/iris/07-pregeneration) and [Performance Tuning](/iris/33-performance-tuning).

## Terrain changed after an update

Stop generation and compare the world with a backup. Confirm that the pack, seed, dimension height, and Iris version match the previous run. GoldenHash can compare generated output from identical inputs; see [Determinism & Goldenhash](/iris/32-determinism-goldenhash).
