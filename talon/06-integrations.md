---
title: "Talon: Integrations"
description: "Container protection, drop handling, economy, and plugin APIs"
published: true
date: 2026-10-25T06:28:47.778Z
tags: "talon, integrations, protection"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Talon queries supported protection plugins before linking or delivering to a Remote Loot container. Checks cover both halves of a double chest. The protection plugins are optional; locked containers reject access regardless of installed providers.

## Container protection

| Plugin | Access check |
|---|---|
| WorldGuard | Region chest access and the player's applicable bypass |
| GriefPrevention | Claim container permission for the player |
| ChestShop | Management access through its public security query, including shop ownership and registered protection checks |

`remoteLoot.protectionChecks` enables these provider queries. An installed provider that is disabled or cannot be queried denies access and logs the failure. Every destination check uses current access rules, so a saved link does not grant permanent permission.

ChestShop access checks require the container and nearby shop-sign area to be loaded and owned by the current server region. If any of that area is unavailable, Talon denies access without loading chunks.

After provider checks allow access, Talon emits the cancellable `TalonContainerAccessEvent` for other integrations. This event also applies when provider queries are disabled. Cancelling it prevents access before Talon reads the inventory. Talon does not broadcast a simulated player interaction or open the container to check permissions.

Other container-protection plugins must support this [access event](/talon/99-api#container-access) or participate in a supported provider's query. Handling ordinary player interactions alone does not protect Remote Loot access. Keep container delivery disabled on servers whose protection rules are not integrated.

## Mining and block drops

Extra mining follows the server's normal player-break path. A cancelled break prevents that extra block from being harvested. Talon does not remove the block directly to bypass protection.

Reward and skill plugins receive the same break events for ordinary mining and Talon extra breaks. Their protection checks must run before rewards are granted: a later cancellation can preserve the block while leaving experience or money already awarded. Use a protection and reward combination that resolves permission before payment. Talon does not reverse rewards issued by another plugin.

Remote Loot collects block drops after drop-event listeners finish. It honors the final cancellation state and the final material, amount, and metadata of item entities captured by Talon's listener. Items removed from the event are skipped, and item entities added after that listener are left to normal drop processing. Unavailable destinations and partial capacity leave the remaining drops in the world. A changed tool, disabled ability, disconnected player, or unavailable owning region stops pending collection.

While block-drop collection is pending, Talon cancels item merges involving a captured drop as either the source or target. This keeps nearby ground items separate from the drops eligible for delivery. The merge restriction ends when collection finishes or is abandoned. Settings reload and shutdown abandon pending collection and release its merge restrictions. Cleanup from abandoned work does not remove protection from newly queued drops.

## Mob drops

Remote Loot handles non-player deaths credited to a player during `EntityDeathEvent` at `HIGHEST` priority. Each transferred stack leaves only its undelivered remainder in the drop list; empty entries are ignored. An error processing a later stack or sending feedback does not discard earlier remainders. On platforms with cancellable death events, Talon skips events already cancelled when its handler runs.

Custom mob and drop plugins must finish their drop edits and cancellation decisions before Talon's death handler. Drops added by a later listener remain subject to normal world spawning; a later cancellation cannot undo items already delivered. A listener at the same priority does not guarantee that it runs before Talon.

## Abilities and economy

Economy and enchantment plugins are not required for tool abilities.

Other plugins can register custom abilities through Talon's [ability API](/talon/99-api). Provider abilities keep their own namespaced identity and remain stored on tools while their provider is absent.

Vault is optional and used only for enabled book purchases. Missing, replaced, or incompatible economy providers reject purchases. Talon checks provider identity and currency precision; on Folia it also requires the provider to declare Folia support.

## PlaceholderAPI

PlaceholderAPI is optional. Player values come from a cached snapshot refreshed on the player's owning thread every 20 ticks while the expansion is registered. Missing, offline, or not-yet-prepared player snapshots return `---`; unknown keys remain unresolved.

| Placeholder | Value |
|---|---|
| `%talon_available%` | Whether the Talon expansion is active |
| `%talon_tool.present%` | Whether a Talon tool is held |
| `%talon_enabled%` | Whether that player and tool currently satisfy activation restrictions |
| `%talon_mode%` | Held tool's mining mode |
| `%talon_ability.<ability>.level%` | Stored built-in ability level; use hyphenated IDs such as `vein-miner` |
| `%talon_loot.status%` | Latest check for the same held tool, or `unverified` |

A stored ability level does not imply permission to activate it. Remote Loot status is an observation from the last check rather than a live container probe.

## Suite status

Talon publishes the shared integration contract version 1.0 with `talon.active-jobs`, `talon.extra-blocks-harvested`, `talon.candidates-skipped`, and `talon.items-delivered`. Counts cover the current server session.

Protection diagnostics show the last observed provider state: `not-checked`, `absent`, `ready`, or `unavailable`. Reading a debug report does not query protection providers or world state.

## Related pages

- [Configuration *Remote Loot protection setting*](/talon/03-configuration)
- [Abilities and recipes *Linking and delivery limits*](/talon/05-abilities-recipes)
- [Diagnostics *Status and reports*](/talon/07-diagnostics)
{.links-list}
