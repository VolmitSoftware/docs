---
title: "ByteCompanions: Integrations"
description: "PlaceholderAPI keys, WorldGuard flags, Vault costs, Nexo and ItemsAdder items, and WorldEdit"
published: true
date: 2026-10-15T00:00:00.000Z
tags: "bytecompanions, integrations, placeholderapi, worldguard"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

ByteCompanions declares PlaceholderAPI, WorldGuard, WorldEdit, Vault, Nexo, and ItemsAdder as soft dependencies. None is required. `/bytecompanions status` shows each one as ready or absent.

## PlaceholderAPI

| | |
|---|---|
| Enables | The `bytecompanions` expansion with the keys below |
| Without it | No placeholders; nothing else changes |
| Gated by | Nothing; the expansion registers when PlaceholderAPI is enabled, before or after ByteCompanions |

| Placeholder | Value |
|---|---|
| `%bytecompanions_total%` | Number of registered companion definitions; works without a player |
| `%bytecompanions_current%` | The player's equipped companion IDs, comma separated; empty without a tracked player |
| `%bytecompanions_player-total%` | Number of registered companions the player has `bytecompanions.companion.<id>` for |
| `%bytecompanions_has-equipped.<id>%` | `true` when the player has that companion equipped |
| `%bytecompanions_has-unlocked.<id>%` | `true` when the player has `bytecompanions.companion.<id>` and the ID is registered |
| `%bytecompanions_available%` | `true` while the plugin runtime is active |

Unknown keys return nothing, so PlaceholderAPI leaves them unchanged; a key that fails inside the plugin returns `---`. Permission values come from a snapshot refreshed on the player's thread every 20 ticks, so a permission change can take up to one second to show in an asynchronous request. Offline players without a session return the empty, zero, or `false` values.

## WorldGuard

| | |
|---|---|
| Enables | Two allow-by-default region flags, `bytecompanions-visuals` and `bytecompanions-bonuses` |
| Without it | Only `serverRules.hiddenWorlds` and `serverRules.bonusDisabledWorlds` apply |
| Gated by | `serverRules.worldguard` (default `true`) |

Set `bytecompanions-visuals` to deny in a region to hide player companions there; both the owner's and the viewer's location must allow visuals. Set `bytecompanions-bonuses` to deny to suspend attributes, potion effects, reward buffs, boosted rewards, and automatic companion XP at the affected player's location. Operator and WorldGuard bypass permissions do not bypass these flags. Decorations ignore them.

The flags register while the plugin loads, so installing or removing WorldGuard needs a restart. A world with WorldGuard regions disabled uses the world lists alone. If a region query fails, both behaviors are suspended for that world and one `SEVERE` line names the world.

## WorldEdit

| | |
|---|---|
| Enables | Nothing on its own; WorldGuard depends on it |
| Without it | WorldGuard does not load, so the flags are unavailable |
| Gated by | Nothing |

## Vault

| | |
|---|---|
| Enables | Money costs for upgrades and boosters through a registered economy provider |
| Without it | Purchases with a `money` cost are unavailable; item-only and free costs still work |
| Gated by | A `cost.money` value in `features/progression/config.toml` |

On Folia and Canvas the plugin that registers the economy service must declare Folia support, or money purchases stay unavailable. A provider that fails after a possible withdrawal leaves the purchase for review; see [Progression and boosters](/bytecompanions/07-progression-and-boosters#administration-and-payment-review).

## Nexo and ItemsAdder

| | |
|---|---|
| Enables | Custom items in companion equipment, menu icons, and particle icons by provider ID |
| Without it | A provider ID resolves to air; vanilla materials are unaffected |
| Gated by | Nothing; the provider is looked up when the item is built |

Reference an item as `nexo:<id>` or `itemsadder:<namespace>:<item>`. Only the first colon is split, so an ItemsAdder namespace stays intact. An ID the provider cannot resolve, or a missing suffix, also gives air. Companion Studio's validation does not check provider IDs; use the preview. The provider supplies the item stack; whether the client shows the custom texture depends on that plugin's resource pack.

## Related pages

- [Configuration *The `serverRules` section*](/bytecompanions/03-configuration#serverrules)
- [Progression and boosters *Costs and payment review*](/bytecompanions/07-progression-and-boosters)
- [Companion Studio *Previewing provider items*](/bytecompanions/06-companion-studio)
{.links-list}
