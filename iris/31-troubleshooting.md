---
title: "Troubleshooting"
description: "Resolve Iris startup, pack loading, world loading, and generation problems"
published: true
date: 2026-09-14T00:37:56.518Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---
Find the startup or generation symptom below. Back up the complete dimension root before restoring data or changing a world activation.

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

Stop generation and compare the world with a backup. Confirm that the update was staged before restart and that `iris/generation/manifest.json` and all referenced epoch, activation, ownership, boundary, and semantic files are present. See [Worlds & Lifecycle](/iris/06-worlds-lifecycle) for generation updates and retained terrain.

## Roll back pack generation

Validate the older authoring pack, take another complete backup, and stage it like any other update. The rollback receives a new activation. It affects only chunks generated after that restart and does not remove terrain made by the activation being rolled back.
