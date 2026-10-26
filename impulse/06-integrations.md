---
title: "Impulse integrations"
description: "Economy, protection, storage, and events"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Impulse uses native dispenser storage and Bukkit events. Optional integrations are checked separately from the core machine actions.

## Hoppers

Hoppers insert into and extract from the machine's nine native inventory slots. Machine input and collected output share that inventory.

With EpicHoppers installed, enable its `Main.Allow Normal Hoppers` setting to use ordinary hoppers. When disabled, EpicHoppers blocks transfers from unregistered hoppers.

## Vault economy

Install Vault and an economy provider to offer money upgrades. The machine's next tier supplies the exact price. The money button requires `impulse.upgrade.economy`; experience upgrades use `impulse.upgrade.xp` and do not require Vault.

Money upgrades require the player to remain online, nearby, and permitted to use the same machine through payment. If access, machine state, or configuration changes during payment, the upgrade is rejected and a refund is requested through the original provider. Provider refund failures are logged.

## Protection

WorldGuard checks building and chest-access permission at the machine. Targets require building permission plus the action's flags: block-break for breakers and choppers, block-place for placers, both for harvest/replant, item-pickup for collection, and interact for shearing. Grinders and launchers retain native owner-attributed damage and projectile events.

An installed WorldGuard instance that is disabled or cannot answer queries blocks machine actions. Re-enabling the provider rebuilds its query state. Other protection plugins depend on their handling of the emitted Bukkit events.

Collection checks item ownership and pickup restrictions. With recognized claim plugins installed, collection uses cancellable pickup checks. Avoid treating compatibility with one claim provider as proof of every provider's rules.

## Action events

`ImpulseMachineActionEvent` exposes the owner, machine location, target location, machine type, and action and can cancel an action before mutation. Actions are `HARVEST`, `BREAK`, `PLACE`, `DAMAGE`, `LAUNCH`, `COLLECT`, and `SHEAR`. Grinder pickup emits `COLLECT`, independently of its damage actions. Choppers emit `BREAK` for each log. Locations are defensive copies. Block breaking and placement also have Bukkit event checks. Launcher arrows and splash potions have their owning player as shooter. Shearing emits `PlayerShearEntityEvent`; cancellation leaves wool, sheep, and shears unchanged. On Paper, modified event drops are checked against filters and storage capacity before shearing. Splash potions retain the native `PotionSplashEvent` and its cancellation and intensity controls. Paper water-splash lists also respect hostile eligibility and region ownership. Machine potion block changes are cancelled through `EntityChangeBlockEvent`.

Spigot does not expose potion tags or cancellable water extinguishing and rehydration. Water bottles stay in storage there. Datapacks that give other potion bases these water behaviors require Paper or a compatible fork for entity-target protection.

Plugins that change item drops, experience, or inventory movement should use the relevant action and Bukkit events deliberately. Impulse does not emulate every step of a manual player interaction.

Harvesters authorize each changed block with `HARVEST`, including pitcher halves and fruit stems. Removed crop blocks use `BlockBreakEvent`; berry picking uses `PlayerHarvestBlockEvent`, including its editable drop list. Cancellation leaves the affected crop and replanting input untouched. Berry drops start at the vanilla 2–3 yield; custom block-interaction loot tables are not evaluated.

Automatic replanting does not emit `BlockPlaceEvent`. WorldGuard checks both block-break and block-place flags through `HARVEST`. Other protection plugins must handle the documented harvest or break events; a placement-only listener does not cover automatic replanting.

## Output provenance

`MachineProvenance.read(entity)` returns the originating owner, world, machine coordinates, machine type, and action for arrows, splash potions, dropped item entities, and experience orbs created by Impulse. Tags are set in the spawn callback so spawn listeners can read them. Missing or malformed tags return an empty result.

Provenance belongs to the entity, not the item stack. Collected items keep normal stacking behavior. Damaged mobs are not permanently tagged with a machine owner; use the action event and native damage attribution for those actions.
