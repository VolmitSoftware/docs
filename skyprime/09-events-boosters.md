---
title: SkyPrime - Events and boosters
description: Server-wide and island-specific timed production and mission bonuses
published: true
date: 2026-10-17T00:00:00.000Z
tags: skyprime, events, boosters, configuration
editor: markdown
dateCreated: 2026-10-09T01:20:00.000Z
---

Events apply temporary bonuses to every active island or one island UUID. Operators can start a manual timer or configure one-time and repeating UTC windows. Event timing does not load island worlds, pause when players leave, or restart its duration after a server restart.

## Commands and access

| Command | Behavior |
| --- | --- |
| `/is events` | Browse effective bonuses, active timers and the definition catalog; console receives the server-wide report |
| `/is event start <id> server` | Start a server-wide manual timer |
| `/is event start <id> <island>` | Start a manual timer for an active island using its UUID or unique exact name; names may contain spaces |
| `/is event stop <id> server` | Stop matching server-wide manual, purchased and token timers |
| `/is event stop <id> <island>` | Stop matching manual, purchased and token timers for that island |
| `/is event buy <id> <island\|server>` | Review spending island-bank credits to activate a booster |
| `/is event redeem <id> <island\|server>` | Review consuming one matching island-wallet token |
| `/is event confirm` | Confirm the pending booster offer within 30 seconds |
| `/is event cancel` | Cancel the pending booster offer |
| `/is event grant <id> <island\|server> <amount> <target>` | Grant tokens to the target island UUID or unique exact name, including names with spaces |

`skyprime.events` defaults to everyone and permits browsing. `skyprime.events.admin` defaults to operators and controls manual activation, stopping and token grants. Manual activation has no credit cost. Starting an already-running manual definition in the same scope is rejected; it does not extend the timer. Saving completes before the command confirms success.

The stop command removes manual, purchased and token activations for that definition and scope without refunding credits or tokens. It does not reset the purchasing island's cooldown. Disable the corresponding schedule in `config/events.toml` to stop its automatic window. If a schedule remains active, its bonuses continue. The browser distinguishes manual, scheduled, purchased and token sources, scope, time remaining, and each definition's next scheduled start. Refresh the menu to update its displayed countdown.

## Credits and tokens

Purchases are disabled by default. Enable `definitions.<id>.access.purchasesEnabled` to allow that definition to be bought with island-bank credits. Purchases activate immediately after confirmation; they do not add tokens. Token redemption is enabled by default. Tokens are virtual shared island balances, kept separately for each definition and island/server scope. They are not inventory items and cannot be dropped or duplicated by copying item stacks.

Both actions require the island's `UPGRADES` role permission. `skyprime.events.buy` and `skyprime.events.redeem` default to everyone; `skyprime.events.server` defaults to operators and is additionally required for server-wide purchases or redemptions. Normal command access still requires `skyprime.use`. An administrator granting a server token does not grant its recipients permission to activate it.

The catalog opens a detail screen with island and server purchase/redemption choices. The confirmation displays the definition, duration, scope, cost or token spend and no-refund rule. Closing the menu retains the offer until its deadline, so `/is event confirm` still works; quitting clears it. Confirming consumes the offer once and rechecks membership, permissions, current configuration, storage health, balance, cooldown and existing timers. Any event-configuration change invalidates outstanding offers. A running definition in the selected scope cannot be purchased or redeemed again; different scopes remain independent.

```toml
[definitions.harvest_festival.access]
purchasesEnabled = true
tokensEnabled = true
islandCost = 1000
serverCost = 10000
cooldownSeconds = 3600
```

Costs are positive whole island credits. Cooldowns accept 0–31,536,000 seconds and begin at activation. Purchases and redemptions share a cooldown per paying island, definition and scope. Timers and cooldowns keep running while offline. Changing the configured cooldown does not rewrite a previously saved deadline. A grant accepts a positive amount while keeping each balance at or below 1,000,000; an island wallet supports up to 256 distinct definition/scope balances. Grants to known but disabled definitions remain stored until redemption is enabled.

Bank debit or token consumption, activation and cooldown save in the same island record. Reset and ownership transfer retain them. Deleting the sponsoring island ends its island and server activations and removes its token balance. Stopping, disabling or deleting an event does not refund its activation. Runtime effects follow the current definition, while bought/redeemed timers retain the fixed duration selected at activation.

## Presets

| ID | Default duration | Bonuses |
| --- | --- | --- |
| `harvest_festival` | 1 hour | 2× mature crop produce and 25 percentage points of extra crop-growth chance |
| `fishing_festival` | 1 hour | 2× ordinary fish catch quantity and a 1% chance of one extra diamond |
| `industry_rush` | 1 hour | One extra generator tier, 20 percentage points of spawner-delay reduction and 25 percentage points of mob-resource bonus chance |
| `mission_weekend` | 24 hours | 2× credits when claiming missions |

Presets are available for manual activation. The example weekly schedule is disabled by default, so a new installation grants no automatic bonuses.

## Configuration

`config/events.toml` supports up to 128 definitions and 128 schedules. Existing scalar fields, including effect amounts and schedule anchors, are available through the configuration editor. Add or remove definitions and schedules in TOML. Hot reload validates the whole candidate before applying it; invalid settings retain the previous configuration.

```toml
enabled = true
stacking = "STRONGEST"

[announcements]
enabled = true
starts = true
ends = true
joinSummary = true

[definitions.harvest_festival]
enabled = true
name = "Harvest festival"
icon = "WHEAT"
description = ["Double mature crop harvests."]
durationSeconds = 3600

[definitions.harvest_festival.effects]
harvestMultiplier = 2.0
fishingMultiplier = 1.0
missionCreditMultiplier = 1.0
cropGrowthPercent = 25
mobDropsPercent = 0
spawnerReductionPercent = 0
generatorTiers = 0

[schedules.weekly_harvest]
enabled = true
eventId = "harvest_festival"
scope = "server"
anchor = "2026-10-10T18:00:00Z"
repeatSeconds = 604800
```

IDs contain 1–48 lowercase letters, digits, underscores or hyphens and begin with a letter or digit. Names allow up to 80 characters; descriptions allow eight lines of up to 200 characters. Icons must be valid item materials. Durations accept 1–604,800 seconds. Names and descriptions are operator-authored text; interface labels use the player's selected language.

For an island-specific schedule, replace `scope = "server"` with the island's canonical UUID string. Schedules do not create islands. Their effects apply only when the matching active island performs eligible gameplay. Reset and ownership transfer retain island identity; a replacement island has a different UUID.

`anchor` is an ISO UTC instant ending in `Z`. `repeatSeconds = 0` makes a one-time window. Repeating intervals accept up to 31,536,000 seconds and must be at least the definition duration. Windows include their start and exclude their end. Missed windows do not accumulate; starting the server during a window grants only the remaining time. The interval uses UTC elapsed time and does not shift for daylight-saving changes.

Disabling events, a definition, or a schedule immediately removes the corresponding effective bonuses. Definition effect edits apply to running events. A manual timer retains the start/end saved at activation even if its configured duration changes; scheduled windows use the current definition duration. Re-enabling a definition before a retained manual timer expires makes its remaining time effective again.

## Effects and overlap

| Field | Range | Runtime effect |
| --- | --- | --- |
| `harvestMultiplier` | 1–4 | Multiplies eligible mature crop produce |
| `fishingMultiplier` | 1–4 | Multiplies cod, salmon, tropical fish and pufferfish caught by fishing |
| `missionCreditMultiplier` | 1–10 | Multiplies mission credit awards at claim, rounding down |
| `cropGrowthPercent` | 0–100 | Additional percentage-point chance of one extra age stage on supported natural crop growth |
| `mobDropsPercent` | 0–100 | Additional percentage-point chance of duplicating an eligible ordinary mob-resource stack |
| `spawnerReductionPercent` | 0–75 | Additional percentage points of delay reduction after a spawner successfully spawns |
| `generatorTiers` | 0–100 | Additional steps through the configured Normal-dimension generator tiers |

`STRONGEST` selects the highest active value independently for each effect across applicable server and island events. `ADDITIVE` adds percentage points, tier steps and multiplier bonuses above 1: two 2× harvest events produce 3×, capped at 4×. A definition supplied by multiple manual, scheduled, purchased or token sources within the same scope contributes once. The same definition in server and island scopes contributes twice under `ADDITIVE`. Caps apply after combining all events.

Crop, mob-drop, spawner and generator effects then combine with purchased/researched upgrades. Combined growth/drop chances cap at 100%, spawner reduction at 75%, and generator selection at the highest configured tier. A generator event changes weighted tier selection; it cannot introduce materials absent from the generator configuration.

Harvest bonuses cover mature wheat, carrots, potatoes, beetroot, nether wart, cocoa, sweet berries and berry-bearing cave vines. Seeds are excluded. Harvest and fishing item bonuses require a survival/adventure teammate acting inside an active island's claim, healthy island storage and plain vanilla items. Creative players, visitors, custom item metadata, fishing treasure and hooked entities receive no bonus. Fractional multipliers use probabilistic rounding and extra output respects normal stack sizes. Late-cancelled or changed item drops are skipped. Output eligibility is resolved for the original action; a scheduled next-tick delivery does not renew an event.

Mob bonuses retain the production upgrade exclusions for carried equipment, named/custom/tamed mobs and ineligible players. Automated spawner and natural growth bonuses do not require an online player. Bonuses do not multiply challenge objective counters: harvest counts the action and fishing counts the original catch quantity.

Mission bonuses affect mission credits only. They do not multiply milestone awards, item/XP/command parcels, administrator grants, deposits, transfers or costs. Credits and completion publish together; overflow rejects the claim without marking it complete. Once claimed, expiry cannot change the awarded credits or saved personal reward parcel.

## Rare fishing rewards

Each definition can supply a weighted table under `fishingLoot`. The default fishing festival gives a 1% chance of one diamond; other presets have no rare reward. A qualifying ordinary fish catch makes at most one additional roll, even when several events or scopes overlap. The highest configured chance wins; ties use the alphabetically first definition ID. Event stacking mode and fishing quantity multipliers do not increase this roll or multiply its reward.

```toml
[definitions.fishing_festival.fishingLoot]
chancePercent = 1.0

[[definitions.fishing_festival.fishingLoot.rewards]]
weight = 10

[definitions.fishing_festival.fishingLoot.rewards.item]
material = "DIAMOND"
amount = 1
displayName = "&bOcean treasure"
lore = ["&fCaught during the fishing festival"]
enchantments = {}
customModelData = -1
unbreakable = false
damage = 0
```

Chance accepts 0–100, including decimals; zero disables the table. An enabled table requires at least one reward and supports up to 32. Weights are positive integers up to 1,000,000; a reward's share is its weight divided by the total weight. Each reward holds 1–64 items and must fit its material's normal maximum stack size. Materials and metadata use the same validation as mission item rewards, including enchantments, optional model data, names, lore, durability and unbreakable state. No commands or XP are awarded by this table.

The ordinary catch remains. The extra item preserves its configured metadata and inherits the caught item's velocity, ownership, thrower and pickup delay. Delivery is skipped if the catch is cancelled, removed or changed before the next tick, the island is unavailable, the selected event has expired, or its loot configuration changed. Fishing treasure, junk, hooked entities, visitors and creative players do not qualify.

## Announcements

`announcements.enabled`, `starts`, `ends` and `joinSummary` all default to `true`. Start/end notices are detected once per second. Server events notify every online player; island events notify current teammates even if they are outside that island. Joining players receive a summary of applicable active events. Startup does not replay starts for timers already running.

Overlapping sources for the same definition and scope share one announcement identity. Replacing one source while another continues does not produce a false end/start. Notices group up to five names with a remaining count, with at most four messages per player per poll for global/island starts/ends. Joining or leaving an island does not itself announce a timer transition. Interface text follows each player's selected language; definition names remain operator-authored.

## Storage and limits

`storage/events.json` stores manual timers with their scope and fixed epoch-millisecond deadlines. Include it in backups with the rest of the data directory. Writes are atomic and asynchronous; gameplay reads use bounded in-memory snapshots. There are at most 4,096 retained unexpired manual activations and 128 queued storage operations. Busy requests fail instead of growing an unbounded queue.

Expired records are ignored immediately and pruned by later mutations. Timer reads clamp backward clock changes within the current process; use a correctly synchronized server clock across restarts. Malformed current storage prevents startup. A storage failure logs the full error, rejects further changes and suspends event effects; resolve the file/storage problem before restarting. Debug dumps include event persistence health, configured definition count and active server-event count.

`storage/islands.json` version 9 additionally stores island wallets, purchase/token timers and cooldowns. Include this file with `storage/events.json` in backups. Purchases and redemptions become effective and acknowledge success only after island storage succeeds. Manual starts wait for event storage; stop commands await both event storage and island storage/runtime publication. No inventory token or separate wallet database is required. Island storage failure suspends its sponsored timers and blocks further wallet mutations.

There are no event-specific PlaceholderAPI keys or physical event structures.
