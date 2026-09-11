---
title: 01 - Installation & Configuration
description: Runtime requirements, world provisioning and SkyPrime's TOML files
published: true
date: 2026-09-05T16:24:00.000Z
tags: skyprime, installation, configuration, folia
editor: markdown
dateCreated: 2026-09-05T04:30:00.000Z
---

SkyPrime targets Spigot, Paper and Folia APIs from Minecraft 1.20.1 through 26.2. Its plugin classes target Java 17; newer servers need newer Java, including Java 25 for Paper 26.2. VolmLib is shaded into the plugin, and PlaceholderAPI is optional.

## Build and install

Build the independent `SkyPrime/` project with JDK 25 using `./gradlew build` or `gradlew.bat build`. The build runs tests, compiles against the baseline and current server APIs, checks every shaded class for Java 17 compatibility, and stages `SkyPrime.jar` in the workspace's `BUILDS` directory. `-PbuildsDirectory=<path>` changes that staging directory.

Place the shaded jar in the intended server's plugin directory and restart. Initial startup creates the configuration and all 18 language files locally. The plugin enables at startup to provide its void generator; managed-world initialization runs after server worlds load. It disables itself if configuration, island storage or world prerequisites are invalid.

## Worlds

On Spigot and Paper, SkyPrime can create its configured shared void worlds during initialization. World creation is outside player command handlers. Optional Nether and End dimensions default to disabled; enable and provision them before creating islands that need them.

On Folia, all enabled managed worlds must already be loaded before SkyPrime initializes. SkyPrime does not attempt dynamic world creation on Folia. Configure their generator as `SkyPrime` through the server's world configuration and use a Folia-compatible world-loading arrangement. A `bukkit.yml` generator declaration selects a generator; it does not itself load an arbitrary additional world.

For example, a world called `skyprime` needs this generator declaration when the server or world provider loads it:

```yaml
worlds:
  skyprime:
    generator: SkyPrime
```

Every managed world must report the SkyPrime void generator and the expected Normal, Nether or End environment. A separate loaded fallback world is required for evacuation and void rescue. Set its spawn to a safe location. `worlds.fallbackName = ""` selects the first loaded world outside the managed set.

World names, enabled dimensions, grid spacing and base height are structural settings. They cannot change through a live reload. Existing island data records its spacing; changing that spacing on restart is rejected because it would move protection boundaries relative to terrain. Creating additional dimensions later does not populate active islands automatically.

## Files

```text
plugins/SkyPrime/
  config.toml
  config/
    values.toml
    generators.toml
    missions.toml
    progression.toml
    menus.toml
  languages/
    en_US.toml
    ...
    players/language-preferences.properties
  data/
    islands.json
    islands.json.backup
  world-jobs/
    <island UUID>.json
  templates/
    <starter id>.json
```

Managed world terrain belongs to the server's world storage. Back up those worlds together with the plugin data folder.

| File or section | Purpose |
| --- | --- |
| `config.toml` / `general` | Default language, splash screen, creation switch and diagnostic upload opt-in |
| `worlds` | World names, enabled dimensions, fallback world and starter height |
| `islands` | Grid spacing, radii, base member/home capacity, island cap, invite expiry and transfer expiry |
| `runtime` | Block application budget, teleport warmup, void rescue, level divisor and hot-reload polling |
| `config/values.toml` | Nonnegative value per supported block material |
| `config/generators.toml` | Named level tiers and positive relative material weights |
| `config/missions.toml` | One-time checkpoints and daily/weekly event missions, prerequisites and credit rewards |
| `config/progression.toml` | Four upgrade tracks, reset and recreation limits, guest limits, coop duration and ledger retention |
| `templates/<id>.json` | Custom starter terrain, display metadata, permissions and per-dimension supplies |
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

## Editing and reload

`/sky config` opens the in-game editor. Select a setting, type its new value in chat within 60 seconds, or type `cancel`. Saves validate the complete candidate before atomically replacing its file. The editor checks that the value has not changed since the prompt opened. Existing generator fields use names such as `generators.coal.minimumLevel` and `generators.coal.weights.COAL_ORE`. Mission scalar fields, all progression settings, material values and menu settings are also editable. For example, use `missions.daily_stone.reward`, `progression.upgrades.team.baseCost` or `progression.resets.maxResets`. Add/remove entries and edit prerequisite arrays in their TOML files. The main menu mission slot is `missions`.

Automatic reload watches configuration and installed language files. A malformed candidate retains the previous runtime settings and records the full failure in the console. `/sky reload` also validates and reloads custom starter files. Template files require this explicit reload; they are not part of automatic configuration polling. Geometry changes require a restart and may be incompatible with existing island data.

## Progression settings

`config/missions.toml` uses `[missions.<id>]` tables with `displayName`, `objective`, `target`, `amount`, `reward`, `period` and `prerequisites`. Objectives are `INVENTORY`, `BREAK`, `HARVEST`, `FISH`, `KILL` and `CRAFT`; periods are `ONCE`, `DAILY` and `WEEKLY`. `INVENTORY` is restricted to `ONCE`. Prerequisites name other mission IDs; missing IDs and cycles reject the candidate.

```toml
[missions.daily_stone]
displayName = "Daily stone"
objective = "BREAK"
target = "COBBLESTONE"
amount = 64
reward = 250
period = "DAILY"
prerequisites = []
```

Upgrade tables in `config/progression.toml` use `[upgrades.expansion]`, `[upgrades.team]`, `[upgrades.homes]` and `[upgrades.generator]`, each with `baseCost`, `maxLevel` and `increase`. The root fields are `creationCooldownMillis = 86400000`, `maxGuestGrants = 32`, `coopDurationMillis = 3600000` and `ledgerEntries = 100`. The `[resets]` table defaults to `cooldownMillis = 86400000` and `maxResets = 10`; `-1` means unlimited replacements. Cooldown zero disables the corresponding wait.

Base team capacity is two including the owner; base home capacity is one including `main`. Reducing a configured capacity does not evict existing members or delete homes; new additions are blocked until they fit. Generator upgrade increases count configured tiers, and total extra tiers cannot exceed the available tier count minus one. See [Islands & Progression](/skyprime/03-islands-progression) for reward and reset rules, and [Starter Templates](/skyprime/06-starter-templates) for custom terrain.

## Languages

The bundled locales are `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN` and `zh_TW`.

Use `/sky language self <locale>` for a personal selection, or `self reset` to follow the server default. Administrators use `/sky language server <locale>` and `/sky language server edit [locale]`. The shared language editor presents nested message categories and preserves required placeholders. Personal preferences live beneath `languages/players/`. Configured mission names and custom starter descriptions, material identifiers and diagnostic details are operator content rather than translated interface labels.
