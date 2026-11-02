---
title: "Axion: Machines and routes"
description: "Controller modes, route signs, fuel, and upgrades"
published: true
date: 2026-10-29T05:23:20.000Z
tags: "axion, automation"
editor: "markdown"
dateCreated: 2026-10-15T00:00:00.000Z
---

Each controller has an owner, a tier, fuel credit, and separate work toggles. Controllers use native barrel storage with 27 slots, or dropper/dispenser storage with 9 slots. Hoppers can supply items and extract output while leaving ordinary configured fuel in storage.

## Operation

Right-click a controller or use `/axion menu` while looking at it. The panel provides pause, work modes, range and action limits, upgrades, preview, and storage.

Mining uses a virtual diamond pickaxe. Harvesting selects mature crops; replanting has its own toggle and requires the appropriate seed. Loose-item pickup and smelting depend on the tier. Smelting uses vanilla furnace recipes, and items with custom metadata are excluded from ordinary fuel and conversion paths.

Combat is disabled globally by default. When enabled, it targets eligible hostile monsters and supports a separate ignition toggle. A direct machine hit that kills a monster collects its eligible death drops into storage. Full or replaced storage sends those drops through retained output delivery. Experience drops remain in the world; later fire damage and unrelated kills do not receive direct collection.

Redstone work toggles levers and presses buttons. Stone and polished blackstone buttons pulse for 20 ticks; wooden buttons pulse for 30 ticks. An already-powered button stays unchanged, consumes no fuel for that action, and keeps its original release time. Minecraft handles the release, including across chunk unloads and reloads. A powered controller pauses its machine work, and native dropper/dispenser activation cannot eject its contents.

## Signs

Ordinary wall signs steer toward their facing direction. Put an instruction on the first line, or put `[axion]` on the first line and the instruction on the second.

| Instruction | Behavior |
| --- | --- |
| `^` | Turn upward |
| `v` | Turn downward |
| `x` | Stop this route |

Routes stop on loops, range limits, unloaded chunks, and unowned regions.

`settings.verticalSigns` controls `^` and `v`; `settings.stopSigns` controls `x`. Disabled directives continue in the incoming direction. Preview uses the same policy.

A pickup filter uses four lines:

```none
[axion]
allow
WHEAT,CARROT
POTATO
```

Use `allow` to collect only the listed materials, `deny` to exclude them, or `all` to clear the filter. Material names are case-insensitive and may use the `minecraft:` prefix. Filter signs keep the incoming direction and affect downstream loose items only; they do not filter mined output or hopper transfers.

Empty allow/deny lists and unknown materials stop the route with `INVALID_FILTER`. A filter accepts up to 64 entries and 512 characters on each material line.

## Fuel and upgrades

Successful work consumes fuel credit. A cycle that performs no action does not charge fuel; configured container remainders, such as an empty lava bucket, are retained. Output capacity includes the space freed by consuming fuel and any container remainder. A preview does not remove the fuel from storage.

Hoppers skip ordinary configured fuels and continue to eligible items in later slots. Named or tagged fuel items can be exported because they cannot fuel a machine. Seeds and empty buckets are exported unless their material is configured as fuel; replanting does not reserve seeds. You can add fuel through a hopper and withdraw it manually.

The configured tiers control range, action count, cycle speed, damage, unlocks, and beam color. Five tiers ship by default; operators can define 1–100 tiers. Authorized users may buy the next tier with experience levels or an available Vault economy when that payment method is enabled. Paid Vault upgrades are disabled on Folia scheduling. A disabled method or unavailable provider is shown in the menu and does not charge the player. If a payment callback changes the machine, settings, access, or upgrade permission before the upgrade completes, Axion cancels it and requests a refund.

Machines are owner-only by default. With shared access enabled, players with `axion.use` may operate them and use storage. Collection still requires ownership or `axion.accessall`.

## Protection and limits

Native spawn protection and cancellable action events apply to live work. A preview estimates results without running third-party protection events, so it cannot certify claim access or randomized drops.

Button presses honor interaction denial and rising redstone-event vetoes. A denied press leaves the button unpowered and does not charge fuel for that action.

Block mining honors cancellation and `setDropItems(false)`. It does not dispatch `BlockDropItemEvent` for directly collected output. Mining applies normal neighbor physics. If callbacks change the controller or fill storage, produced output is retained for delivery at the work location. Failed scheduling, unloaded destinations, and rejected item spawns leave the affected stacks available for retry. Loose-item pickup leaves the item untouched if a callback replaces the controller inventory.

Owners must be online. Combat and ignition stop further work if a callback disconnects the owner or moves it outside the executing region. Machines do not force-load chunks or continue across unowned Folia regions. Named or tamed entities are excluded from combat targets.

## Related pages

- [Configuration *Tier, fuel, and world settings*](/axion/03-configuration)
- [Integrations *Economy and protection boundaries*](/axion/06-integrations)
- [Diagnostics *Pause reasons*](/axion/07-diagnostics)
{.links-list}
