---
title: "Brimstone: Integrations"
description: "WorldGuard rules, other protection plugins, and the Volmit suite service"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "brimstone, integrations, worldguard, claims"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Brimstone needs no other plugin. WorldGuard and other protection plugins limit where TNT effects work, and a local service lets other Volmit plugins read Brimstone's state. Brimstone adds no PlaceholderAPI keys.

## WorldGuard

| `access.worldGuard` | WorldGuard installed | WorldGuard missing |
|---|---|---|
| `AUTO` | Checks apply | No checks |
| `REQUIRED` | Checks apply | Launches and effects are denied |
| `DISABLED` | No checks | No checks |

Brimstone attaches to WorldGuard when it enables and again whenever WorldGuard enables, and it detaches when WorldGuard disables. WorldGuard that is installed but not enabled counts as missing.

If the integration cannot start, or a permission capture or region query fails, the integration becomes degraded and the console logs the exception. While degraded, every WorldGuard check denies, whatever `access.worldGuard` says, until WorldGuard enables again. `/brimstone status` shows the state as ready, absent, degraded, or disabled.

Checks run before launch and at later explosion, block, damage, ignition, and secondary-effect locations. Owned TNT, charged creepers, and fireworks keep the launcher's identity and permissions from the moment of launch. Current region rules apply where the effect happens, including after an entity crosses a region boundary. A later denial does not refund the launch.

`brimstone.bypass.access` does not bypass WorldGuard. A launcher with WorldGuard's own bypass passes these checks in the world where they launched.

### Flags

Every check starts the way WorldGuard checks its own TNT: region members pass through `build`, and `tnt` decides for everyone else. An unflagged region therefore denies non-members, `tnt: allow` lets anyone use launchers there even where `build` is denied, and `tnt: deny` denies members too. Outside every region, launchers work unless the global region denies them.

Each effect then applies its own flags, which deny only when set to `deny`:

| Effect or target | Additional flags |
|---|---|
| Charged creepers | `creeper-explosion`, `mob-spawning`, and `deny-spawn` containing `creeper` |
| Fireworks | `firework-damage` |
| Fire from an explosion | `fire-spread`, `lighter` |
| Damage to another player | `pvp` |
| Damage to animals and other passive mobs | `damage-animals` |
| Damage to boats and minecarts | `destroy-vehicle` |

Damage to the launching player, hostile mobs, and ambient mobs uses only the starting check. WorldGuard applies its own `mob-damage` and `creeper-explosion` rules to charged-creeper damage as well.

## Other protection plugins

With `access.protectionPlugins` on, Brimstone asks the server's protection plugins whether the launching player could break the block at each spot a TNT effect reaches. This covers claim plugins such as GriefPrevention, Lands, and Towny without a separate integration for each.

The check runs at the launch spot, wherever the TNT flies or explodes, every block an explosion would destroy, fire, creeper and firework spawns, and entities the effects damage. A spot where the player could not break a block is denied, and an explosion keeps only the blocks the player could break.

Only listeners at `MONITOR` priority are skipped, so logging and reward plugins such as CoreProtect, Jobs, and mcMMO do not record these checks as real block breaks. WorldGuard is left out of this check, because `access.worldGuard` applies its own flags. A plugin's own admin bypass works as it does for normal block breaking.

The player must be online for the check. If the player leaves while their TNT is still in flight, its later effects are denied. A protection plugin that throws an exception during the check also denies the effect, and the console logs it once.

## Volmit suite service

Brimstone registers the shared `IntegrationServiceContract` with Bukkit's service manager under plugin ID `brimstone`. It supports protocols `1.0` and `1.1` and advertises `handshake`, `heartbeat`, `metrics`, `readiness`, and `effect-diagnostics`. The service is local: it requires no other plugin, starts no polling task, and sends nothing over the network.

The heartbeat reports `starting` until startup and recipe registration finish, `ready` while gameplay is ready, and `stopped` after shutdown. Shutdown unregisters the service first. A consumer that kept an old provider sees an unhealthy heartbeat, rejected handshakes, and unavailable metrics.

Consumers discover the metric descriptors and request the keys they need. Unknown keys are omitted, and an empty selection returns no samples. Each sample carries its descriptor, availability, and sampling time. Before readiness or after shutdown, `brimstone.ready` is zero and other known metrics are unavailable.

| Metric | Value |
|---|---|
| `brimstone.ready` | 1 when ready, otherwise 0 |
| `brimstone.active-tnt` | TNT budget in use, including pending reservations and removals |
| `brimstone.active-secondary` | Secondary budget in use, including pending reservations and removals |
| `brimstone.enabled-types` | Configured launcher definitions |
| `brimstone.registered-recipes` | Installed launcher recipes |
| `brimstone.launch-attempts` | Session launch attempts |
| `brimstone.launch-successes` | Session committed launches |
| `brimstone.launch-rejections` | Total launch rejections |
| `brimstone.quota-rejections` | Total entity admission and transfer refusals |
| `brimstone.secondary-suppressions` | Total suppressed child spawn attempts |
| `brimstone.particles-requested` | Requested particle budget |
| `brimstone.particles-granted` | Granted particle budget |
| `brimstone.particles-suppressed` | Ungranted particle budget |
| `brimstone.launch-rejections.<reason>` | Launch rejections for one reason |
| `brimstone.quota-rejections.<reason>` | Quota rejections for one reason |
| `brimstone.secondary-suppressions.<reason>` | Child spawn suppressions for one reason |
{.dense}

Reason suffixes use lowercase hyphenated names, such as `fuel`, `tnt-player`, and `unloaded-chunk`. The service publishes 45 descriptors in total. Counters follow the [session lifetime](/brimstone/07-diagnostics#session-counters) of debug reports.

## Related pages

- [Configuration *The `access` settings*](/brimstone/03-configuration)
- [Diagnostics *Session counters and console messages*](/brimstone/07-diagnostics)
{.links-list}
