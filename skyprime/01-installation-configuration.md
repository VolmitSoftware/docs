---
title: SkyPrime - Installation and configuration
description: Runtime requirements, world provisioning and SkyPrime's TOML files
published: true
date: 2026-10-21T00:00:00.000Z
tags: skyprime, installation, configuration
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

SkyPrime supports Minecraft 26.1 through 26.3 on Java 25 or newer, on Spigot and Paper. PlaceholderAPI and Vault are optional. Startup refuses other Minecraft versions and Java releases older than 25.

## Install

Place the jar in the intended server's `plugins/` directory and restart. SlimJar downloads Gson, TOML and Adventure before SkyPrime enables, so first startup needs access to the library repositories. Downloads and their relocated copies are cached in `plugins/SkyPrime/.libs/` for later starts. Keep this directory when moving the installation to a server without internet access; offline startup requires the cached libraries needed by that plugin version.

Initial startup creates configuration and editable English locally. Other locales can be installed locally or downloaded when selected from a published language source; see Languages below. The plugin enables at startup to provide its void generator; managed-world initialization runs after server worlds load. It disables itself if configuration, island storage or world prerequisites are invalid.

## Worlds

Each island owns a Normal world centered at block coordinates `0, 0`. Island creation generates that world using the selected starter. Optional Nether and End worlds default to disabled; global enablement and any required island unlock allow first travel to generate that island's dimension from its retained starter definition. Existing generated dimensions load on demand. Worlds use the SkyPrime void generator and do not generate ordinary terrain outside the starter.

The logical world names are `skyprime/islands/<island UUID>/<normal|nether|end>` by default. Spigot stores these folders beneath its world container; Paper stores them beneath `<level directory>/dimensions/minecraft/`. `worlds.directory` selects the relative island directory within that layout. Each world is a separate dimension with its own settings and lifecycle. The plugin owns these island directories.

A separate loaded fallback world is required for evacuation and void rescue. Set its spawn to a safe location. `worlds.fallbackName = ""` selects the first loaded world outside the managed island directory; set an explicit name to choose a lobby.

`worlds.directory`, `worlds.fallbackName` and `worlds.baseY` require a restart. Nether and End enablement toggles apply on reload; disabling travel does not delete an existing dimension. `runtime.idleUnloadSeconds` also reloads live, defaults to 300 seconds and accepts 10 through 86,400. The idle sweep runs every 100 server ticks. Worlds with players, active operations, in-flight loads, operation leases, plugin chunk tickets or force-loaded chunks remain loaded. Eligible worlds save before unloading and load again when needed.

Independent island worlds require dynamic world loading and unloading. Stock Folia does not provide that lifecycle, so SkyPrime refuses initialization on Folia. Preloading a shared world is not a supported replacement for independent island worlds.

## Events and boosters

`config/events.toml` defines timed server-wide or per-island production and mission-credit bonuses, UTC schedules and capped overlap rules. It also configures scoped announcements, optional credit purchases, shared island-wallet tokens, activation cooldowns and weighted rare-fishing rewards. Purchases default to disabled; token redemption and announcements default to enabled. Existing scalar fields use the configuration editor; add definitions and schedules in TOML. No automatic schedules are enabled by default. See [Events and boosters](/skyprime/09-events-boosters) for presets, ranges, commands and reload behavior.

## Island contracts

`config/contracts.toml` defines a saved rotating board for each island. Configure rotation timing, offers per difficulty tier, weighted definitions, level gates, consumed ordinary materials, island credits and personal item/XP/command rewards. Current boards retain their frozen terms until their deadline; disabling contracts blocks new hand-ins. See [Island contracts](/skyprime/10-contracts) for fields, defaults and recovery.

## Favorites and ratings

`config/social.toml` controls personal favorites, continuous visit qualification, rating cooldowns, daily changes and the popularity threshold. All six scalar fields support hot reload and the `social.<field>` configuration-editor namespace. Defaults require a 60-second visit, permit 100 favorites and ten rating changes per UTC day, and impose a one-day same-island rating cooldown. See [Favorites and ratings](/skyprime/11-favorites-ratings#configuration) for accepted ranges.

## Island activity history

`config/activity.toml` controls recording and retention. Defaults retain up to 90 days, 1000 records per island and 100,000 records overall. The four fields reload live through `activity.<field>`; disabling recording preserves access to retained history. See [Activity history](/skyprime/12-activity-history#configuration-and-retention) for bounds and storage limits.

## Files

```none
plugins/SkyPrime/
  .libs/
  cache/runtime/
  config.toml
  config/
    values.toml
    generators.toml
    missions.toml
    progression.toml
    research.toml
    events.toml
    contracts.toml
    social.toml
    activity.toml
    specializations.toml
    gamerules.toml
    menus.toml
    resource-limits.toml
  languages/
    en_US.toml
    ...
    language-preferences.properties
  storage/
    islands.json
    islands.json.backup
    events.json
    social.json
    activity.json
    environment.json
    difficulty.json
    gamerules.json
    biomes.json
    roles.json
    rewards.json
    island-state.pending.json
    visitor-policy.json
    island-returns.json
    bank-transfers.json
  world-jobs/
    <island UUID>.json
  island-worlds/
    <island UUID>.json
  preview-worlds/
  templates/
    <starter id>.json
```

Island terrain belongs to the server's world storage beneath `worlds.directory`. Back up that directory together with the plugin data folder, including the retained starter manifests in `island-worlds/`.

| File or section | Purpose |
| --- | --- |
| `.libs/` | Downloaded runtime libraries and their relocated copies, reused on later starts |
| `cache/runtime/` | Extracted embedded runtime for packed distributions, named by its SHA-256 digest |
| `config.toml` | Shared plugin settings, worlds, island limits, runtime budgets and the Vault bridge; see [Main settings](#main-settings) |
| `config/values.toml` | `[materials]` assigns nonnegative unit values to placed blocks and directly stored container items |
| `config/generators.toml` | Named level tiers and positive relative material weights |
| `config/missions.toml` | Multi-objective challenges, repeat schedules, prerequisites, presentation, island credits and personal item/XP/command rewards |
| `config/research.toml` | Configurable research nodes, requirements, upgrade grants and exclusive choices; see [island research](/skyprime/08-research) |
| `config/progression.toml` | Ten upgrade tracks, dimension unlock rules, reset and recreation limits, guest limits, coop duration and ledger retention |
| `templates/<id>.json` | Custom starter terrain, display metadata, permissions and per-dimension supplies |
| `config/activity.toml` | Island activity recording, maximum age and per-island/global retention counts |
| `config/social.toml` | Favorites, continuous visit time, rating limits and popularity eligibility |
| `config/menus.toml` | Main menu title, filler material and unique button slots |

The default menu title `{title}` resolves to the viewer's language. A custom title can use classic ampersand colors. Menu slots use zero-based inventory positions, from 0 through 53. Actions must occupy distinct slots, except `create` and `home`, which can share a slot because they appear in different island states.

Generator tiers use named TOML tables. The defaults are `tiers.starter`, `tiers.coal` and `tiers.ore`; each has `minimumLevel` and a nested `weights` table. For example, the starter tier is:

```toml
[tiers.starter]
minimumLevel = 0

[tiers.starter.weights]
COBBLESTONE = 100
```

At least one tier must start at level zero, and minimum levels must be distinct. Weights do not need to total 100; an output's chance is its weight divided by the tier's total weight.

## Main settings

`config.toml` starts with the five sections every Volmit plugin shares, followed by SkyPrime's own sections. Every key below reloads live except the three world keys marked as restart-only.

| Key | Default | Accepted values | Effect |
| --- | --- | --- | --- |
| `general.enabled` | `true` | `true`, `false` | `false` blocks new island creation; existing islands, teams and commands keep working |
| `general.language` | `en_US` | a locale listed under [Languages](#languages) | Server default language |
| `general.updateNotifications` | `true` | `true`, `false` | Release notices for holders of `skyprime.update` |
| `metrics.enabled` | `true` | `true`, `false` | SkyPrime's bStats reporting; see [Usage statistics](#usage-statistics) |
| `presentation.splashScreen` | `true` | `true`, `false` | Console splash when SkyPrime finishes starting |
| `presentation.alternateSplashes` | `true` | `true`, `false` | Lets roughly one start in ten use an alternate splash design |
| `presentation.commandSounds` | `true` | `true`, `false` | Success and error sounds in the configuration editor |
| `hotReload.enabled` | `true` | `true`, `false` | Applies file edits while the server runs |
| `hotReload.pollIntervalMillis` | `1000` | 250 to 60,000 | How often the files are checked for changes |
| `hotReload.cooldownMillis` | `1500` | 250 to 60,000 | Quiet period after the last change before a reload, so a save in progress is not read half-written |
| `hotReload.notifyOperators` | `true` | `true`, `false` | Action-bar notice to holders of `skyprime.config` when a file reload applies or is rejected |
| `debug.uploadEnabled` | `true` | `true`, `false` | Allows `/sky debug dump` to upload; `false` keeps every dump local |

With `hotReload.enabled = false`, file edits apply through `/sky config` or on the next start. The console always records file reloads; a rejected reload also records the full validation failure.

| Key | Default | Accepted values | Effect |
| --- | --- | --- | --- |
| `worlds.directory` | `skyprime/islands` | relative path of lowercase letters, digits, `_`, `-` and `/` | Island world directory; restart-only |
| `worlds.fallbackName` | `""` | empty, or a world name of 1 to 64 letters, digits, `_` or `-` | Evacuation and void-rescue world; restart-only |
| `worlds.baseY` | `96` | 32 to 192 | Starter height; restart-only |
| `worlds.netherEnabled` | `false` | `true`, `false` | Allows island Nether worlds |
| `worlds.endEnabled` | `false` | `true`, `false` | Allows island End worlds |
| `islands.initialRadius` | `48` | 16 to 8,192 | Starting border radius |
| `islands.maxRadius` | `192` | `initialRadius` to 8,192 | Largest radius from growth and upgrades |
| `islands.maxMembers` | `2` | 1 to 100 | Base team size, including the owner |
| `islands.maxHomes` | `1` | 1 to 100 | Base home count, including `main` |
| `islands.maxIslands` | `10000` | 1 to 1,000,000 | Server-wide island cap |
| `islands.invitationTtlMillis` | `120000` | 1,000 to 86,400,000 | Invitation expiry |
| `islands.transferTtlMillis` | `60000` | 1,000 to 86,400,000 | Ownership transfer confirmation expiry |
| `runtime.blocksPerTick` | `512` | 1 to 8,192 | Starter and reset block budget per tick |
| `runtime.teleportWarmupTicks` | `60` | 0 to 1,200 | Warmup before island teleports |
| `runtime.voidRescue` | `true` | `true`, `false` | Returns players who fall into the void |
| `runtime.levelDivisor` | `100` | 1 to 1,000,000,000 | Island level is value divided by this number |
| `runtime.idleUnloadSeconds` | `300` | 10 to 86,400 | Idle time before an empty island world unloads |

`islands.growth` and `economy` are described in [Material values and border growth](#material-values-and-border-growth) and [External economy](#external-economy).

## Material values and border growth

`config/values.toml` uses one `[materials]` table. Each material accepts an integer value from 0 through 1,000,000,000. A material's unit value applies both to placed blocks and to item quantities directly stored in block inventories inside the island claim. Unlisted materials contribute zero. For example:

```toml
[materials]
COBBLESTONE = 1
IRON_INGOT = 5
IRON_BLOCK = 50
DIAMOND = 55
DIAMOND_BLOCK = 500
```

Add or remove material entries in TOML; edit existing entries through keys such as `values.DIAMOND`. The defaults also include stone, oak logs, gold, emeralds and netherite. Player inventories, ender chests, entity inventories and contents nested inside item stacks do not contribute. See [Value, levels and generators](/skyprime/03-islands-progression#value-levels-and-generators) for reconciliation behavior.

Automatic border growth defaults to enabled in `config.toml`:

```toml
[islands.growth]
enabled = true
source = "VALUE"
divisor = 100.0
exponent = 0.5
```

`source` accepts `VALUE`, `LEVEL` or `HIGHEST` (the larger of current value and current level). Current level uses integer division by `runtime.levelDivisor`. Growth adds `floor((source / divisor)^exponent)` blocks to the initial radius, plus the radius granted by purchased or researched expansion levels. With the defaults, value 10,000 adds 10 radius blocks; value 1,000,000 adds 100. `islands.maxRadius` caps the final radius.

The growth divisor accepts finite numbers from 0.000001 through 1,000,000,000,000; the exponent accepts 0.01 through 4. Both support decimals in the editor. Earned radius persists when value falls, after reset and across restart. Disabling growth retains earned space. Reducing `islands.maxRadius` clamps existing radii after startup or reload; choose that limit carefully when builds reach the border. Growth settings apply to the last saved value on the next configuration refresh without changing milestone peaks. A changed radius queues a fresh value scan for loaded islands and updates their native borders. Offline islands receive the saved radius change without loading their worlds; their next recount uses the updated claim bounds.

## Editing and reload

`/sky config` opens the shared configuration editor, which requires `skyprime.config`. The first page lists one section per `config.toml` table and one per file under `config/`, each naming the file it saves to, plus a Languages shortcut to the language selector. Sections list up to 45 settings per page.

Click a true or false setting to toggle it. Numeric settings with a fixed range show their step: left click adds it, right click subtracts it, shift multiplies it by ten, and Q asks for an exact value in chat. Other settings ask for a value in chat; reply within 60 seconds or type `cancel`. Lists use TOML syntax, such as `["STONE", "DEEPSLATE"]`.

Each save validates the complete candidate before atomically replacing the owning file, and the chat confirmation shows the old and new value. A save is rejected when any configuration file changed on disk after the editor opened; reopen the editor and repeat the change.

| Setting | Editor path |
| --- | --- |
| Coal generator minimum level | `generators.coal.minimumLevel` |
| Coal ore weight | `generators.coal.weights.COAL_ORE` |
| Daily stone mission reward | `missions.daily_stone.reward` |
| Team upgrade base cost | `progression.upgrades.team.baseCost` |
| Maximum island resets | `progression.resets.maxResets` |

Existing scalar array entries are editable, including objective targets, descriptions, item lore and commands. Add or remove definitions and array elements in TOML. The main menu mission slot is `missions`.

Automatic reload watches configuration and installed language files, using the `hotReload` settings above. A malformed candidate retains the previous runtime settings and records the full failure in the console. `/sky template reload` validates and reloads custom starter files. Template files require this explicit reload; they are not part of automatic configuration polling. The world-directory, fallback-world and starter-height settings require a restart.

## Progression settings

`config/missions.toml` holds up to 256 `[missions.<id>]` definitions. Each has `enabled`, `completion` (`ALL` or `ANY`), `reward` (island credits), `prerequisites`, and nested `presentation`, `schedule`, `objectives` and `rewards` tables. Mission and objective IDs contain 1–32 lowercase letters, digits, underscores or hyphens. IDs are persistent identities: renaming a mission creates a separate claim.

Each mission contains 1–16 named objectives. An objective specifies `objective`, 1–32 distinct uppercase `targets`, and `amount`. Counts for any listed target contribute to that objective's total. Types are `INVENTORY`, `BREAK`, `HARVEST`, `FISH`, `KILL`, `CRAFT`, `BREED`, `TAME`, `SHEAR`, `SMELT` and `CUSTOM`. Inventory amounts accept 1–2,304; event amounts accept 1–10,000,000. Inventory objectives check possession without consuming items and may repeat. `CUSTOM` targets are uppercase identifiers reported through the [source API](/skyprime/90-placeholders-api); adding a config entry alone does not install a gameplay event listener. Missing prerequisite IDs and cycles reject the complete reload candidate.

`presentation` contains a 1–64-character `displayName`, item-material `icon`, up to 16 `description` lines of 256 characters, `category`, `order` (−1,000,000 to 1,000,000), and `hiddenWhenLocked`. Categories use the same identifier format as mission IDs. Menus sort by category, order and ID and offer category filtering. Names and descriptions support `&` color codes. Disabled definitions remain configured but cannot progress or be claimed. Hidden missions stay out of the browser until prerequisites are met; hidden milestones wait for their required peak level.

`schedule.period` accepts `ONCE`, `DAILY`, `WEEKLY` or `INTERVAL`. `intervalMinutes` is zero except for `INTERVAL`, where it accepts 1–525,600. `offsetMinutes` accepts −10,080 to 10,080. Daily windows begin at UTC midnight plus the offset; weekly windows begin Monday at UTC midnight plus the offset. Interval windows are anchored to the Unix epoch plus the offset. This is a fixed offset, without automatic daylight-saving adjustments. Change period and intervalMinutes together in TOML when switching to or from INTERVAL; the scalar editor validates each edit independently. Changing a repeating schedule starts a new current window; changing only presentation does not reset counters. Unchanged schedules resist backward clock movement.

`reward` accepts 0–1,000,000,000,000 credits. `rewards` contains `items`, `experience` and `commands`. At most 16 item specifications and 4,096 total items are accepted, with 0–100,000 XP points and up to eight console commands of 1–256 characters. Omit a command's leading slash. Supported placeholders are `{player}`, `{uuid}`, `{island}`, `{source}` (definition ID), and `{source_type}` (`MISSION` or `MILESTONE`). Commands execute during explicit collection. Definition edits do not change existing reward receipts.

Every item specification has `material`, positive `amount`, `displayName` (empty or up to 128 characters), `lore` (up to 16 lines of 256 characters), `enchantments` (up to 16 namespaced keys with levels 1–255), `customModelData` (−1 unset), `unbreakable`, and `damage`. Text supports `&` colors. Enchantments must exist on the running server, apply to the material and not conflict; enchanted books use stored enchantments. Damage must be below the material's maximum durability. Items do not accept arbitrary NBT, potion data, components or custom-provider IDs; integrations can supply those through console reward commands.

```toml
[missions.supply_run]
enabled = true
completion = "ALL"
reward = 250
prerequisites = []

[missions.supply_run.presentation]
displayName = "&bSupply run"
icon = "CHEST"
description = ["Gather logs and catch dinner."]
category = "daily"
order = 10
hiddenWhenLocked = false

[missions.supply_run.schedule]
period = "DAILY"
intervalMinutes = 0
offsetMinutes = 360

[missions.supply_run.objectives.logs]
objective = "INVENTORY"
targets = ["OAK_LOG", "BIRCH_LOG"]
amount = 32

[missions.supply_run.objectives.dinner]
objective = "FISH"
targets = ["COD", "SALMON"]
amount = 5

[missions.supply_run.rewards]
experience = 50
commands = []

[[missions.supply_run.rewards.items]]
material = "IRON_PICKAXE"
amount = 1
displayName = "&bSupply pickaxe"
lore = ["Earned through island challenges"]
enchantments = { "minecraft:efficiency" = 2 }
customModelData = -1
unbreakable = false
damage = 0
```

`BREED`, `TAME` and `SHEAR` require supported entity types; `SMELT` requires item materials. Breeding counts spawned children, excluding egg fertilization for frogs, turtles and sniffers. Nautilus breeding and nautilus/zombie-nautilus taming are supported. Shearing supports `SHEEP`, `MOOSHROOM`, `SNOW_GOLEM` and `BOGGED`. `BREAK` targets must occur in configured generator outputs.

Upgrade tables in `config/progression.toml` use `[upgrades.expansion]`, `[upgrades.team]`, `[upgrades.homes]`, `[upgrades.generator]`, `[upgrades.speed]`, `[upgrades.jump]`, `[upgrades.crop]`, `[upgrades.fly]`, `[upgrades.drops]` and `[upgrades.spawner]`, each with `baseCost`, `maxLevel` and `increase`. The root fields are `creationCooldownMillis = 86400000`, `maxGuestGrants = 32`, `coopDurationMillis = 3600000` and `ledgerEntries = 100`. The `[resets]` table defaults to `cooldownMillis = 86400000` and `maxResets = 10`; `-1` means unlimited replacements. Cooldown zero disables the corresponding wait.

All ten upgrade tables are required. Speed defaults to `baseCost = 1000`, `maxLevel = 3`, `increase = 1`; Jump defaults to `2000`, `3`, `1`; Crop defaults to `1500`, `3`, `10`; Fly defaults to `10000`, `1`, `1`; Drops defaults to `3000`, `3`, `10`; Spawner defaults to `5000`, `3`, `10`.

For Speed and Jump, `increase` counts benefit tiers and `maxLevel × increase` must not exceed 3. Each Speed tier adds 20% movement speed; each Jump tier adds 0.1 jump strength. Crop and Drops use percentage points, capped at 100% total; Spawner uses delay-reduction percentage points, capped at 75% total. Fly requires `increase = 1` and `maxLevel` of zero or one. Setting `maxLevel = 0` disables a special upgrade's benefit and further purchases. Lower caps clamp active benefits without removing purchased levels. Invalid edits retain the last valid snapshot. Spawner changes affect subsequent successful spawn cycles, including work already queued but not yet applied; an already shortened current delay is not restored by reload.

Base team capacity is two including the owner; base home capacity is one including `main`. Reducing a configured capacity does not evict existing members or delete homes; new additions are blocked until they fit. Generator upgrade increases count configured tiers, and total extra tiers cannot exceed the available tier count minus one. See [Islands & Progression](/skyprime/03-islands-progression) for reward and reset rules, and [Starter Templates](/skyprime/06-starter-templates) for custom terrain.

## Level milestone settings

`config/progression.toml` defines up to 256 `[milestones.<id>]` entries with `enabled`, `level`, `reward`, `presentation` and `rewards`. Presentation and personal reward bundles use the same fields and validation as missions. Level accepts 1–1,000,000,000,000, and credits accept 0–1,000,000,000,000, allowing item-only or command-only milestones. The defaults are `level_10` (500 credits), `level_25` (1,500), `level_50` (5,000) and `level_100` (10,000). An empty `[milestones]` table disables claims.

Milestone IDs are durable claim identities. Renaming an ID creates a separate reward; reusing a previously claimed ID does not clear that claim. New definitions can use an island's already recorded peak level. Reload updates definitions but does not recalculate peak levels. See [Level milestones](/skyprime/03-islands-progression#level-milestones).

## Dimension unlock settings

`config/progression.toml` defines `[dimensions.nether]` and `[dimensions.end]`. Both require `required`, `cost`, `minimumLevel` and `requiredMissions`. Nether defaults to `required = true`, `cost = 5000`, `minimumLevel = 10`, `requiredMissions = []`; End defaults to `true`, `15000`, `50`, `[]`. Mission requirements must reference enabled one-time (`ONCE`) missions whose rewards the island has claimed. Island level uses the configured value divisor.

Global `worlds.netherEnabled` and `worlds.endEnabled` remain off by default and take precedence over unlocks. `required = false` permits access without a purchase while globally enabled. `cost = 0` with `required = true` still requires an explicit confirmed claim after meeting level and mission requirements. Changing any quoted rule, the global availability or the level divisor invalidates an open purchase preview. Purchased access persists when value falls or requirements increase; disabling the dimension globally still prevents access.

## Languages

English is generated locally. The server default is `general.language`; personal choices are saved in `languages/language-preferences.properties`. All 18 locale source files are present in the project. Selecting a missing locale downloads it only when the artifact has a published source manifest; installed local files remain editable.

The language editor title is `language.editor.title`, using `{plugin} › {section}`. Keep both placeholders when editing the title; `{section}` identifies the current editor page. Missing messages use built-in English, and existing local language files retain custom edits.

The available locales are `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN` and `zh_TW`.

Use `/sky language self <locale>` for a personal selection, or `self reset` to follow the server default. Administrators use `/sky language server <locale>` and `/sky language server edit [locale]`. The shared language editor presents nested message categories and preserves required placeholders. Configured mission names and custom starter descriptions, material identifiers and diagnostic details are operator content rather than translated interface labels.

Hot reload refreshes installed personal languages as well as the server default. A malformed personal TOML file keeps its last valid messages while other valid language and configuration changes continue to apply. Missing entries in a valid file use built-in English. Deleting a personal language file uses built-in English without downloading or recreating that file, and preserves the saved player selection; restoring the file refreshes that selection automatically.

See [Languages](/languages).

## Usage statistics

SkyPrime initializes the official bStats Bukkit single-file runtime, version 3.2.1, under project ID `34482`. It uses the upstream default statistics without custom charts. The jar includes the upstream license at `META-INF/LICENSE-bStats-Metrics.txt`.

`metrics.enabled = true` enables SkyPrime reporting by default and reloads live. Set it to `false` to stop SkyPrime's metrics runtime. The shared `plugins/bStats/config.yml` also controls collection: set `enabled: false` there and restart to opt out globally. Enabling the SkyPrime setting does not override the global choice. Startup failures are logged without preventing the plugin from enabling; shutdown stops the metrics scheduler.

## Update notifications

`general.updateNotifications = true` enables the shared GitHub release notifier for `VolmitSoftware/SkyPrime`. The setting reloads live. Notifications point to available releases; they do not replace the installed jar.

## Resource caps

`config/resource-limits.toml` controls per-island block and entity caps. The feature defaults to disabled. Caps combine the island's generated, enabled dimensions. Block counts cover the claim; entity counts cover the entire owned worlds, including entities outside the claim. A missing type has no cap; a cap of zero prevents adding that type. Existing resources above a cap are retained.

```toml
enabled = false

[blocks]
HOPPER = 64
SPAWNER = 16

[entities]
VILLAGER = 32
ARMOR_STAND = 32
ITEM = 128
```

Reload applies validated settings. Counts must be prepared before new capped resources can be admitted. Entity unloading does not free capacity. `/sky limits` displays counts and caps for your island; `/sky admin recountlimits <island UUID>` rebuilds counts. Direct block changes by other plugins may bypass events and require an explicit recount. See [Resource limits](/skyprime/03-islands-progression#resource-limits).

Technical block types `PISTON_HEAD`, `MOVING_PISTON`, `NETHER_PORTAL`, `END_PORTAL` and `END_GATEWAY` are not valid cap entries. An invalid candidate rejects reload instead of replacing the active configuration. Caps are exposed through commands; there is no separate inventory menu.

## External economy

Optional Vault transfers use `[economy]` in `config.toml`: `enabled = false`, `withdrawalsEnabled = false`, and `maxTransfer = 1000000` by default. The maximum accepts whole values from 1 through 9,007,199,254,740,991. One island credit equals one external currency unit. Vault and an enabled registered economy provider are required when transfers are enabled; neither is required for internal credits.

## Specialization configuration

`config/specializations.toml` defines one active path per island, initial/switch costs, requirements, temporary bonuses and a switching cooldown. Settings reload live and scalar fields are available under `specializations` in the configuration editor. See [Island specializations](/skyprime/13-specializations) for defaults, fields and bonus caps.

## Gamerule policy

`config/gamerules.toml` defines editing access, default values and integer bounds for all 34 island gamerules. These settings reload live and are editable under `gamerules.rules`. See [Island gamerules](/skyprime/14-gamerules) for ranges and inheritance.

## Uninstalling

SkyPrime keeps island records in `plugins/SkyPrime/` and island terrain in the server's world storage. Island worlds rely on SkyPrime's void generator and world loading, so the server cannot use them without the plugin. Remove both together.

> Uninstalling deletes every island with its terrain, team, bank, upgrades, research, missions and history. Stop the server and back up `plugins/SkyPrime/` together with the island world directory first if you may want them back.
{.is-danger}

### Before removing the jar

1. Have players leave starter previews with `/sky preview leave`.
2. If external economy transfers and withdrawals are enabled, island owners can move island credits to their own accounts with `/sky bank withdraw <amount>`. Credits left in island banks are deleted with SkyPrime's storage. Check `/sky admin bank pending` for unresolved transfers and compare them with the economy provider's records.
3. Stop the server normally with SkyPrime still installed. A normal shutdown ends starter previews, revokes island flight and removes the Speed and Jump attribute modifiers from players.

### Remove SkyPrime

1. Delete `SkyPrime.jar` from `plugins/`.
2. Delete `plugins/SkyPrime/`. It holds the configuration, languages, island and player storage, world-job and starter manifests, custom starter templates, preview journals, the runtime cache and downloaded libraries.
3. Delete the island world directory set by `worlds.directory` (`skyprime/islands` by default). It contains every island's Normal, Nether and End worlds and the starter-preview worlds under `previews/`. Then delete the parent `skyprime/` folder if it is empty.
   - Paper: `<level directory>/dimensions/minecraft/skyprime/islands/`, for example `world/dimensions/minecraft/skyprime/islands/`
   - Spigot: `<world container>/skyprime/islands/`
4. Leave `plugins/bStats/` in place unless no remaining plugin on the server uses bStats; that folder is shared.
5. Remove `%skyprime_…%` placeholders from other plugins' configuration. Without SkyPrime, PlaceholderAPI leaves them unreplaced.

### What remains

- **`skyprime:island_flight_owned`** in player persistent data. A normal shutdown removes it. It remains only if the server stopped abruptly while a player had island flight; that player can then still fly in Survival or Adventure. Switch them to Creative and back to their mode to reset flight. The leftover marker itself is inert.
- **`skyprime:starter_preview`** in player persistent data. It remains only if a preview could not be restored, and that player stays in Spectator. Set their game mode with `/gamemode` and move them to a safe location. The leftover marker itself is inert.
- **Players who logged out on an island** join in the primary world, because the island world no longer exists.

### Starting fresh

1. Stop the server.
2. Delete `plugins/SkyPrime/` and the island world directory. If the server has no internet access, keep `plugins/SkyPrime/.libs/` so the libraries do not need to download again.
3. Start the server with `SkyPrime.jar` in `plugins/`. SkyPrime creates new configuration and English language files and starts with no islands.
