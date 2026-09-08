---
title: "Operator Runbooks"
description: "Iris documentation: Operator Runbooks"
published: true
date: 2026-09-08T00:00:00.000Z
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
5. Back up the complete dimension root. Do not omit or prune `iris/generation/`.
6. For a pack update, run `/iris dev update-world world=<world> pack=<pack> confirm=true` on Bukkit or `/iris world update <dimension> <pack>` on modded. Restart cleanly.
7. Verify an old chunk, the transition band, a distant new chunk, and a locator for newly added content.

See [Installation & Platforms](/iris/01-installation-platforms) and [Pack Management](/iris/25-pack-management).

## Iris starts in Warning or Danger Mode

Iris prints a mode banner at the end of its Bukkit startup checks. `Iris is running in Warning Mode` means a non-fatal check failed and startup continues. `Iris is running in Danger Mode` means a check failed at error severity, and a `Java Agent` or `Code Injection` failure additionally locks player login, world creation, Studio open, and generation for every configured Iris world.

Read the check output printed above the banner, fix what it names, and restart. Do not delete files from a dimension root to clear a lock.

See [46 - Startup Safeguard](/iris/46-startup-safeguard) for every check, what its failure means, and the recovery steps.

## A pack will not load

Run the pack validator and fix its blocking errors. Confirm that every referenced key exists. If the pack changed world height or dimension type, create a new world instead of updating the old one.

See [Concepts & Pack Layout](/iris/05-concepts-pack-layout) and [Worlds & Lifecycle](/iris/06-worlds-lifecycle).

## A world will not open

Run `/iris worlds` and confirm the world has a live Iris engine. Check the console for the first pack, kernel, registry, ownership, boundary, or semantic-history error. Do not delete individual files to bypass the check. Restore the complete dimension root from backup.

## Pregeneration stalls

Check status before restarting the job. Lower concurrency or mantle limits if memory pressure is high. Cancel cleanly before changing the pack or replacing Iris.

See [Pregeneration](/iris/07-pregeneration) and [Performance Tuning](/iris/33-performance-tuning).

## Terrain changed after an update

Stop generation and compare the world with a backup. Confirm that the update was staged before restart and that `iris/generation/manifest.json` and all referenced epoch, activation, ownership, boundary, and semantic files are present. Existing owned coordinates must still route to their recorded pack and generation kernel. New chunks should blend across `generator.generationTransitionWidthBlocks`; hydrology begins only after the protected terrain band. GoldenHash can compare output from identical activation inputs; see [Determinism & Goldenhash](/iris/32-determinism-goldenhash).

## Roll back pack generation

Validate the older authoring pack, take another complete backup, and stage it like any other update. The rollback receives a new activation. It affects only chunks generated after that restart and does not remove terrain made by the activation being rolled back.
