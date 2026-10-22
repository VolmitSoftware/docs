---
title: "ByteCompanions: Progression and boosters"
description: "Companion levels, upgrade tracks, XP sources, costs, boosters, and reviewing uncertain purchases"
published: true
date: 2026-10-18T00:00:00.000Z
tags: "bytecompanions, progression, boosters"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Companions can earn their own XP, unlock purchasable bonus upgrades, and receive automatic level rewards. Personal and server boosters raise companion XP or vanilla rewards for a limited time. Both systems are off on a fresh install.

## Enabling

Set `features.progression`, `features.boosters`, or both in `config.toml`. The definitions live in `features/progression/config.toml` and hot reload like every other file. The dashboard gains Companion Upgrades and Boosters pages when the matching feature is on; `/bytecompanions upgrades <companion>` and `/bytecompanions boosts` open them directly.

```toml
[features]
progression = true
boosters = true
```

## Levels and upgrades

Progress is stored per player and companion. An equipped companion with a progression entry earns XP from mining, mob kills, and fishing; several configured companions each receive the event's award. Companion XP is separate from the player's experience bar.

`level-thresholds` lists cumulative XP totals starting at zero; the default `[0, 100, 300, 600]` defines four levels. A `level-rewards.<level>` table adds its entries automatically when that level is reached. Each upgrade track has ordered tiers with `required-level`, `cost`, and `additions`; purchased additions accumulate and buying does not consume XP.

```toml
level-thresholds = [0, 100, 300, 600]

[companions.bee.tracks.agility]
name = "<gold>Bee Agility"

[[companions.bee.tracks.agility.tiers]]
required-level = 2

[companions.bee.tracks.agility.tiers.cost.items]
EMERALD = 4

[companions.bee.tracks.agility.tiers.additions]
"effect:minecraft:speed" = 1

[companions.bee.level-rewards.4]
"effect:minecraft:speed" = 1
```

| Target | Meaning |
|---|---|
| `effect:<key>` | Adds amplifier steps to the companion's configured potion effect |
| `attribute:<key>` | Adds to the companion's configured attribute modifier amount, keeping its operation |
| `buff:<category>` | Adds to the companion's configured buff value, keeping `SUM`, `MULTIPLY`, or `ADD_PERCENT` |

A target must refer to a bonus that already exists for that companion in its feature file, and a buff must be enabled there. Two definitions of the same target are rejected. A disabled base feature blocks purchases that target it. The bundled file gives `bee`, `myself`, and `rainbow` a speed track and a level 4 reward.

## Earning XP

```toml
source-cooldown-millis = 1000
allowed-worlds = []

[xp-sources]
block_break = 1
mob_kill = 5
fishing = 3
```

The cooldown is per player and source. An empty `allowed-worlds` list allows every world. A source set to zero awards nothing. Creative and spectator players earn nothing.

Mining counts ore blocks that drop experience; placed ores and ores moved by pistons are marked in chunk data and excluded. Mob kills need a player-caused kill, original experience, and a recorded natural, chunk generation, or raid spawn. Fishing needs a caught item with experience. Cancelled events award nothing. Boosted companion XP keeps its fraction to six decimal places across restarts; menus show whole numbers. Administrative grants are whole amounts without boosters.

`serverRules.bonusDisabledWorlds` and a WorldGuard `bytecompanions-bonuses` deny flag suspend automatic XP and bonuses at the player's location. Purchased upgrades, levels, and activations are kept, and booster timers keep running.

## Costs

```toml
[cost]
money = 250

[cost.items]
EMERALD = 4
```

Money needs Vault and a registered economy provider; on Folia and Canvas the provider's plugin must declare Folia support. Item costs are taken from the player's storage slots as plain stacks; renamed, enchanted, or otherwise modified items are not spent. Free and item-only costs work without an economy. Purchases recheck permission, feature state, level, tier, and the displayed offer; a stale offer must be reopened.

## Boosters

```toml
[boosters.personal_xp]
name = "<aqua>Personal Companion XP"
scope = "PERSONAL"
duration-seconds = 300
stacking = "QUEUE"

[boosters.personal_xp.percentages]
companion_xp = 50

[boosters.personal_xp.cost.items]
EMERALD = 2
```

`PERSONAL` affects its owner. `SERVER` affects every eligible player on the server, including players without a companion. Channels are `companion_xp`, `experience`, `experience_mob`, `experience_block`, `experience_furnace`, `experience_fishing`, `mob_loot`, `block_drops`, and `fishing_loot`. Spigot rejects the general `experience` channel.

`QUEUE` starts a new activation after existing ones in the same scope that share a channel. `HIGHEST` starts at once and the highest running percentage wins per channel. Personal and server percentages add, capped by `maximum-booster-percent` (default 300). Buying a booster grants a credit; the player starts it from the Boosters page, and a player needs `bytecompanions.booster.<id>` to buy or start one.

For vanilla rewards the companion buff applies first, then the combined booster adds a percentage of the original reward. Fractions become a chance of one extra item. `maximum-reward-multiplier` (default 10) caps the result.

| Key | Default | Meaning |
|---|---|---|
| `server-id` | `"local"` | Scope of the progression records; `local` creates an installation ID in `storage/progression-server-id.txt` |
| `pause-personal-offline` | `true` | Pause personal booster time while the player is offline or the server is stopped |
| `maximum-booster-percent` | `300` | Cap on combined personal and server percentages per channel |
| `maximum-reward-multiplier` | `10` | Cap on the final reward relative to the original amount |

Server boosters use real elapsed time, including downtime. Saved activations keep the percentages and duration captured when they started. This is a single-server system: two servers must not share one `server-id`.

## Administration and payment review

| Command | What it does | Run from |
|---|---|---|
| `/bytecompanions progression give <player> <companion> <xp>` | Grants whole companion XP to an online, loaded player | Console or player |
| `/bytecompanions booster give <player> <booster> <count>` | Grants booster credits | Console or player |
| `/bytecompanions booster start <booster>` | Starts or queues a `SERVER` booster without a purchase | Console or player |
| `/bytecompanions booster cancel <activation>` | Removes an activation; later queued ones keep their start times | Console or player |
| `/bytecompanions transactions list` | Lists purchases waiting for review | Console or player |
| `/bytecompanions transactions resolve <transaction> grant` | Grants the recorded upgrade or credit | Console or player |
| `/bytecompanions transactions resolve <transaction> cancel` | Closes the record without granting it | Console or player |
{.dense}

Every purchase is journaled before money or items move. If the economy provider fails after it may have withdrawn money, or a failure happens after items were taken, the purchase is held for review and the player cannot buy again until it is resolved. A purchase that stops before payment starts, for example because the player left or the server restarted, is cancelled automatically and does not need review. Transaction IDs are the UUIDs that `transactions list` prints. Neither resolution charges or refunds; settle money or items with your economy tools first, then resolve the record.

## Related pages

- [Commands and permissions *The progression permission nodes*](/bytecompanions/02-commands-permissions)
- [Particles and features *The buff, attribute, and effect files upgrades target*](/bytecompanions/08-particles-and-features)
- [Integrations *Vault and WorldGuard*](/bytecompanions/09-integrations)
{.links-list}
