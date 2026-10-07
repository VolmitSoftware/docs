---
title: "Cooperative Plugin Reload"
description: "Asynchronous readiness, cancellation, and committed cleanup for Bukkit plugins"
published: true
date: 2026-10-07T13:56:34.824Z
tags: "volmlib, api, biletools"
editor: markdown
dateCreated: 2026-10-07T13:33:23.977Z
---

Implement `art.arcane.volmlib.integration.ReloadAware` on your Bukkit plugin's main class to participate in BileTools reload and unload operations. The contract separates reversible preparation from committed teardown. BileTools recognizes the explicit interface across separate classloaders and relocated VolmLib packages.

## Contract

```java
CompletionStage<ReloadPreparation> prepareReload(PreUnloadReason reason);
CompletionStage<Void> cancelReload();
CompletionStage<Void> commitReload(PreUnloadReason reason);
```

`PreUnloadReason` is nested in `ReloadAware`; its values are `HOT_RELOAD` and `HOT_UNLOAD`. `ReloadPreparation` is a record in the same package, with `boolean ready` and `String reason` components.

| Method | Implementer responsibility |
|---|---|
| `prepareReload(reason)` | Stop admitting new work and finish any reversible preparation. Complete with `readyToUnload()` or `refuse(reason)` |
| `cancelReload()` | Undo preparation and resume normal operation if any member of the group refuses or preparation fails |
| `commitReload(reason)` | Finish irreversible cleanup after the whole affected group has accepted preparation. Complete only when owned resources have been released |

The default preparation returns `ReloadPreparation.readyToUnload()`, and the default cancellation returns an already completed stage. Override both when preparation changes plugin state. `commitReload` is required.

Use `ReloadPreparation.refuse("A world save is still active")` to refuse with an operator-readable reason. Null results, null stages, failed stages, and exceptions fail the operation. A refusal reason must contain text; a ready result has an empty reason.

## Lifecycle and cancellation

BileTools validates the proposed plugin identities and required dependencies before invoking participation callbacks. Invalid dependencies or identity conflicts leave the running group unchanged without calling preparation. For an accepted operation, BileTools prepares dependents before their dependency and finishes every preparation before starting committed cleanup. If a preparation refuses or fails, it cancels all attempted preparations in reverse order, including the refusing participant. Cancellation must also handle a partially completed preparation.

Preparation must leave the plugin recoverable through `cancelReload`; defer closing classloaders, deleting registrations, and other irreversible changes until `commitReload`. Do not treat cancellation as a guarantee that no preparation ever started.

After committed cleanup starts, a failure can trigger restoration of previous plugin versions. An old instance may be replaced instead of resumed. Keep ordinary `onDisable` cleanup safe to call after committed cleanup, because the plugin manager still disables the plugin during teardown.

## Scheduling and completion

BileTools invokes each callback on the authoritative Bukkit or Folia global thread, then waits for its returned stage without blocking that thread. Schedule entity and region work through the corresponding owning scheduler, and complete the stage after that work finishes. Dispatch disk or network work to an appropriate executor. Do not call `join()` or `get()` on global, region, or entity threads to wait for other owners.

The Bukkit operation deadline is 120 seconds. A deadline failure does not stop your running callback. BileTools keeps the operation quarantined until the callback settles, then cancels preparation or attempts recovery; a timed-out preparation cannot proceed to mutation. Complete or fail every returned stage, including shutdown and cancellation paths.

## Packaging

Keep the explicit `ReloadAware` interface, its nested `PreUnloadReason`, and `ReloadPreparation` together when shading. Package relocation may prepend your plugin namespace; retain the `integration.ReloadAware` interface name and the current method signatures. BileTools validates that contract instead of invoking arbitrary similarly named methods.

Recompile consumers when changing this contract. Do not bundle a previous interface declaration alongside the current one. See [BileTools integration](/biletools/api) for native Paper declarations and the separate Velocity contract.
