---
title: "Talon: Ability API"
description: "Custom abilities, books, and container-access decisions"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "talon, api, development"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Plugins can register custom tool abilities through `com.volmit.talon.api.TalonAbilityService`. Depend on the Talon API artifact at compile time and declare Talon as a server plugin dependency; do not shade its API into your plugin.

## Registration

Obtain the service after Talon enables:

```java
TalonAbilityService abilities = getServer().getServicesManager().load(TalonAbilityService.class);
```

Register an `AbilityDefinition` with your enabled plugin as its owner. Its `NamespacedKey` must use your plugin's namespace; `talon` is reserved. Definitions contain a display name, maximum level, allowed tool materials, and an `AbilityHandler`.

Display names contain 1–64 visible characters, levels range from 1–255, and the allowed material set must be nonempty. Supported materials are pickaxes, axes, shovels, hoes, swords, and shears. Talon accepts at most 256 registered custom abilities. Duplicate keys reject registration.

## Books and tools

| Method | Result |
|---|---|
| `definitions()` | Immutable snapshot of registered definitions |
| `levels(tool)` | Stored custom ability keys and levels |
| `createBook(key, level, amount)` | A book for an available registered ability |
| `applyBook(book, tool)` | An updated tool, or `null` when application is invalid or the provider is unavailable |
| `unregister(owner, key)` | Remove that owner's registration |
| `unregisterAll(owner)` | Remove all registrations belonging to that owner |

Apply returned item changes through your own inventory transaction on the owning thread. Creating or applying a book requires an available provider. Stored custom abilities remain on tools when their provider is absent; they do not activate until the provider registers again.

## Activation

Handlers receive `BLOCK_BREAK`, `LEFT_CLICK_BLOCK`, and `RIGHT_CLICK_BLOCK` triggers through an `AbilityContext`. The context includes the player, target block, level, and a copy of the held tool. Editing that copy does not edit the player's inventory.

Callbacks run only while the player and target block are owned by the current region, with nested dispatch suppressed for the same player. Talon rechecks the enabled held tool and ability level before each callback, so changing the held tool stops remaining callbacks. Keep handlers bounded and use the appropriate scheduler for any later entity or world work. The provider remains responsible for protection checks and the effects it performs.

`AbilityActivationEvent` fires after a handler returns successfully. It is an observation event and cannot cancel or undo the handler. A runtime or linkage failure logs its stack trace and disables that registration; unregister and register it again after correcting the failure.

Disabling a provider unregisters its abilities. Disabling Talon removes its service and registrations. Reacquire the service when Talon enables again.

## Container access

Listen for `com.volmit.talon.api.TalonContainerAccessEvent` to apply container-protection rules to Remote Loot. `getPlayer()` identifies the player requesting access and `getBlock()` identifies the container block. Call `setCancelled(true)` to deny access.

The event is synchronous and runs on the owning region. Talon emits it for each checked container half during linking or destination resolution, after enabled built-in provider checks allow access and before reading the inventory. Cancellation applies to that access attempt. Inventory delivery does not emit a container event.

Keep listeners bounded and restrict them to permission decisions. Do not open inventories, trade items, or schedule an asynchronous decision; Talon reads cancellation when dispatch returns. A listener can safely deny access when its own protection service is unavailable. Re-entering the same container-access check is denied.

## Related pages

- [Abilities and recipes *Tool behavior and item preservation*](/talon/05-abilities-recipes)
- [Integrations *Protection behavior*](/talon/06-integrations)
{.links-list}
