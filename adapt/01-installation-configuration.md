---
title: "Installation & Configuration"
description: "Adapt files, requirements, settings, and uninstalling"
published: true
date: 2026-10-18T01:55:01.954Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Edit the TOML files under `plugins/Adapt/`. A valid save refreshes open menus. Invalid TOML is rejected and the current settings stay. SQL, Redis, metrics, and optional-plugin detection apply on restart.

Startup fills missing player-preference policies and writes adaptation settings in a stable order. Existing canonical files remain untouched when their settings and generated comments are unchanged.

## Requirements

| | |
|---|---|
| Server | Paper, Purpur, or Folia. Minecraft 26.1.2 through 26.2, and Paper 26.3 |
| Java | 25 |
| Jar | `Adapt v<version> [CraftBukkit] 26.1.2-26.3.jar` in each backend `plugins/` folder |
| Command | `/adapt`, behind `adapt.main`. `adapt.use.*` defaults to true and still needs that root node |

An XZ packed jar extracts `plugins/Adapt/cache/runtime/` on first start. That directory must be writable. A non-English `language` is downloaded to `languages/<locale>.toml` only when that file is missing.

## World and mob restrictions

`blacklistedWorlds` takes namespaced world keys, such as `minecraft:the_nether`. The two generated entries match nothing.

Set `ignorePassiveMobs = true` to exclude passive and neutral mobs from an adaptation's area, reflected, or chain damage. Add the key at the top level of the adaptation file when it is absent. The default is `false`. Provoked neutral mobs stay excluded when the setting is enabled. Direct attacks are unchanged.

This setting applies to `axe-cleave`, `axe-ground-smash`, `axe-throwing-axe`, `sword-crimson-cyclone`, `excavation-earth-mover`, `ranged-heartseeker`, `nether-skull-toss`, `tragoul-thorns`, `tragoul-globe`, `tragoul-lance`, `tragoul-corpse-explosion`, and `tragoul-plague-bearer`.

Skeletal servants, Shadow Decoys, and the attacker's tamed pets are excluded from those attacks regardless of this setting. Grave Digger's unearthed enemies stay valid targets.

## SQL and Redis

SQL is authoritative when `sql.enabled` is true. Create the schema and grant `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE`, and `REFERENCES`. Adapt creates `ADAPT_DATA` and `ADAPT_DATA_FENCE` in that schema. Both tables must use InnoDB before Adapt can use SQL storage:

```sql
ALTER TABLE ADAPT_DATA ENGINE=InnoDB;
ALTER TABLE ADAPT_DATA_FENCE ENGINE=InnoDB;
```

With `advancements = true`, Adapt also creates four InnoDB tables: `ADAPT_ADVANCEMENT_TEAMS`, `ADAPT_ADVANCEMENT_PLAYERS`, `ADAPT_ADVANCEMENT_PROGRESS`, and `ADAPT_ADVANCEMENT_UNREDEEMED`. `ADAPT_ADVANCEMENT_MIGRATIONS` records completed imports. Include all seven tables in SQL backups. Keep separate Adapt networks in separate schemas.

At startup, Adapt imports advancement records from `Teams`, `Players`, `Advancements`, and `Unredeemed` when those tables match the advancement storage format. Only namespaces beginning with the literal prefix `adapt_skill_` qualify. Back up the schema and stop other Adapt servers sharing it before the first import. The source tables and their rows remain unchanged.

Existing player names, teams, and advancement entries take precedence. Adapt adds missing players and advancements; pending rewards transfer only with newly imported advancement entries. A completed import does not repeat on later starts, so it cannot restore progress or rewards cleared afterward. An incomplete import remains pending for a later startup.

Credentials go in the JDBC URL. Adapt has no TLS switch of its own. Redis handoff runs only when `redis.enabled` is also true. A fenced write that exhausts its retries is kept as `data/players/<uuid>.json.pending-sql`. See [Cross-server SQL and Redis](/adapt/39-velocity-cross-server).

## Learning costs

Vault charges `knowledge cost * learningEconomy.moneyPerKnowledge` when `learningEconomy.enabled` is true and an economy provider is present. Otherwise learning stays knowledge-only. A failed withdrawal rejects the purchase. A failed refund is stored on the skill line and settled on the next learn or unlearn. `hardcoreNoRefunds` returns neither knowledge nor currency.

## Restore defaults

`/adapt default skill <skill>` and `/adapt default adaptation <skill:adaptation>` regenerate that file. `/adapt default all` is described in [Updates](/adapt/40-operator-runbooks). All three need `adapt.configurator`.

## Reference

### Optional plugins

| Plugin | What it adds |
|---|---|
| PlaceholderAPI | `%adapt_...%` placeholders |
| WorldGuard | Region flags and region-based protection |
| Factions, ChestProtect, Residence, GriefDefender, GriefPrevention, LockettePro | Claim and container protection checks |
| Vault | Currency charge and refund during learning |
| HiddenOre | Hidden-vein mining XP and drop adaptations |
| Iris | Iris tree-feller integration |
| AdvancedChests | Rift Access support for AdvancedChests containers |
| MagicCosmetics | Excludes equipped cosmetic hat and bag slots from Adapt's armor-value math |

Details: [Protection and region policy](/adapt/08-protection-region-policy) and [Integrations](/adapt/09-integrations).

### Data folder layout

```none
plugins/Adapt/
  adapt.toml
  models.toml
  skills/<skill-id>.toml
  adaptations/<adaptation-id>.toml
  config-archive/<timestamp>/
  languages/en_US.toml
  languages/<locale>.toml
  languages/language-preferences.properties
  data/players/<uuid>.json
  data/players/<uuid>.json.pending-sql   # SQL mode only
  data/players/<uuid>.json.pending-delete # local JSON mode only
  data/server-data.json
  data/value-cache.json
  data/advancements.db
  data/mantle/<namespace>/<world-key>/
```

`data/advancements.db` is the SQLite advancement store used while `sql.enabled` is false. `config-archive` timestamps use `yyyy-MM-dd_HHmmss`.

### `adapt.toml`, general and progression

| Key | Default | What it does |
|---|---:|---|
| `debug` | `false` | Prints Adapt's developer debug lines to the console |
| `playerSettingsEnabled` | `true` | Allows personal skill/adaptation settings and enable toggles. `false` forces their server defaults and hides the controls; learning, unlearning, personal effects, and language remain available. Hot-reloadable |
| `verbose` | `false` | Prints gated profile, permission, XP, and per-action diagnostics. `/adapt debug verbose` flips the in-memory value without writing the file |
| `autoUpdateCheck` | `true` | Checks Adapt's stable GitHub releases and includes Adapt in shared update notices and `/volmit plugins updates`. Applies on save. See [Update notifications](/volmlib/api/github-releases) |
| `splashScreen` | `true` | Prints the startup banner |
| `metrics` | `true` | Starts bStats during enable |
| `integrationSnapshotMaxMetrics` | `65536` | Maximum distinct metrics retained for snapshot consumers, clamped to 1–65536. A changed limit clears the snapshot cache on the next collection cycle |
| `language` | `en_US` | Server default locale. Players may override it with the shared in-game picker. Supported non-English values download automatically into `languages/<locale>.toml` only when the file is missing; edit that file to customize messages |
| `xpCurve` | `ADAPT_BALANCED` | Curve family shared by every skill line and by master level. See [05 - Configuration Math](/adapt/05-configuration-math) |
| `experienceMaxLevel` | `1000` | Skill level cap. Lookups clamp to this value |
| `playerXpPerSkillLevelUpBase` | `489` | Flat master XP granted per skill level crossed |
| `playerXpPerSkillLevelUpLevelMultiplier` | `44` | Extra master XP per level already reached |
| `powerPerLevel` | `0.65` | Power per master level, truncated to a whole number |
| `xpInCreative` | `false` | Allows skill XP while in creative or spectator |
| `allowAdaptationsInCreative` | `false` | Allows adaptation effects while in creative |
| `blacklistedWorlds` | two placeholder keys | Namespaced world keys where Adapt gameplay is off |
| `hardcoreResetOnPlayerDeath` | `false` | Wipes progression when a player dies |
| `hardcoreNoRefunds` | `false` | Suppresses knowledge and Vault refunds on unlearn |
| `loginBonus` | `true` | Enables the login bonus |
| `welcomeMessage` | `true` | Sends the Adapt welcome message |
| `advancements` | `true` | Registers and syncs Adapt advancements |
| `advancementUnlockToasts` | `true` | Shows Adapt's advancement unlock popup. Disable it to suppress the popup and its client-controlled sound without suppressing the recorded grant |
| `levelMilestoneSoundVolume` | `0.35` | Volume from 0 to 1 for Adapt's explicit paired sounds every ten skill levels. This cannot independently change Minecraft's built-in advancement-toast sound |
| `preventHunterSkillsWhenHungerApplied` | `true` | Blocks Hunter passives while the player has the Hunger effect |

Default `blacklistedWorlds` entries are `minecraft:some_world_adapt_should_not_run_in` and `example:another_world`, neither of which matches a real world.

### `adapt.toml`, activator, GUI, and presentation

| Key | Default | What it does |
|---|---:|---|
| `adaptActivatorBlock` | `BOOKSHELF` | Bukkit block material a player clicks to open the Adapt menu. Unknown, non-block, and air values normalize to `BOOKSHELF` at config load |
| `adaptActivatorBlockName` | `a Bookshelf` | Text used when a message names that block |
| `adaptActivatorAllowVerticalFaces` | `false` | Also accepts clicks on the top and bottom faces |
| `useEnchantmentTableParticleForActiveEffects` | `true` | Uses the enchantment-table particle style for active effects and XP bursts |
| `escClosesAllGuis` | `false` | Escape closes the whole menu stack instead of returning to the parent menu |
| `guiBackButton` | `true` | Shows Back buttons in menus that have a parent |
| `customModels` | `true` | Applies the model mappings in `models.toml` |
| `automaticGradients` | `false` | Applies the automatic rendered-text gradient |
| `learnUnlearnButtonDelayTicks` | `14` | Delay, in ticks, between learn and unlearn clicks |
| `maxRecipeListPrecaution` | `25` | Depth bound on recursive recipe-value traversal |
| `actionbarNotifyXp` | `true` | Shows aggregated skill XP gains on the action bar without changing the XP awards themselves |
| `actionbarXpDurationMillis` | `1500` | Skill XP ticker lifetime in milliseconds, clamped to `100`-`60000` |
| `actionbarNotifyLevel` | `true` | Shows skill-level notifications without controlling their sounds |
| `actionbarNotifyMasterLevel` | `true` | Shows account-wide master-level and maximum-power notifications without changing progression |
| `actionbarLevelDurationMillis` | `2500` | Shared skill-level and master-level notification lifetime in milliseconds, clamped to `100`-`60000` |
| `progressionSoundsEnabled` | `true` | Plays skill-level and master-level progression sounds independently of the visual switches |
| `unlearnAllButton` | `false` | Shows the bulk-unlearn control |
| `guiShowAllSkills` | `false` | Lists every enabled skill even when the player has no progress in it. Display only. Use permissions still apply |

The `[gui]` subsection, icon precedence, and menu ordering are in [06 - GUI Customization](/adapt/06-gui-customization).

### `[effects]`

```toml
[effects]
particlesEnabled = true
soundsEnabled = true
[effects.adaptationParticleOverrides]
"adaptation-name" = true
[effects.skillParticleOverrides]
"skill-name" = true
```

`particlesEnabled` and `soundsEnabled` are the global switches. The two override maps are keyed by registry ID and act as extra gates. `false` turns that component's particles off. `true` leaves the global decision alone. The player's own `/adapt effects` preference is a further gate. Progression audio also requires `progressionSoundsEnabled`; disabling that root key leaves adaptation gameplay sounds available. The `adaptation-name` and `skill-name` rows are placeholders.

### `[abilityApi]`

| Key | Default | What it does |
|---|---:|---|
| `abilityApi.enabled` | `true` | Enables external ability policy and cost providers through the Bukkit provider gateways |
| `abilityApi.usePolicyFailureMode` | `deny` | What happens when a use-policy provider throws: `allow` or `deny` |
| `abilityApi.costProviderFailureMode` | `allow` | What happens when a cost provider throws: `allow` or `deny` |
| `abilityApi.providerFaultLimit` | `5` | Consecutive faults before a provider is quarantined. `0` disables the watchdog |
| `abilityApi.slowProviderMillis` | `2` | Milliseconds a provider may take before a slow warning is logged. `0` disables the warning |
| `abilityApi.denyMessageThrottleMillis` | `2000` | Minimum milliseconds between repeated denial messages to the same player |

An unrecognized failure-mode string falls back to `deny` for use policies and `allow` for cost providers. See [43 - API - Ability Use Policy](/adapt/43-api-ability-use-policy) and [44 - API - Ability Cost](/adapt/44-api-ability-cost).

### `[learningEconomy]`

| Key | Default | What it does |
|---|---:|---|
| `learningEconomy.enabled` | `false` | Charges Vault currency on learn when a provider is available |
| `learningEconomy.moneyPerKnowledge` | `1.0` | Currency charged per knowledge point spent |
| `learningEconomy.refundPercent` | `100.0` | Percentage of the recorded charge returned on a normal unlearn |

### `[sql]`

| Key | Default | What it does |
|---|---:|---|
| `sql.enabled` | `false` | Makes the InnoDB `ADAPT_DATA` and `ADAPT_DATA_FENCE` tables authoritative instead of local JSON |
| `sql.host` | `localhost` | MySQL-compatible server hostname |
| `sql.port` | `3306` | Server port |
| `sql.database` | `adapt` | Existing schema for player profiles, ownership fences, and advancement tables. Adapt creates tables, never the schema |
| `sql.username` | `user` | SQL account |
| `sql.password` | `password` | SQL account password, sent in plain text unless the server enforces TLS |
| `sql.poolSize` | `10` | Connection pool size requested by the advancement backend only |
| `sql.connectionTimeout` | `5000` | Milliseconds allowed for the JDBC connect handshake. Clamped to 1000-5000; the socket timeout is twice the result but is also capped at 5000 so bounded persistence retries finish before shutdown recovery |
| `sql.secondsCheckverify` | `30` | Seconds passed to `Connection.isValid`. Startup and reconnect probes clamp it to 1-5, and a successful probe is reused for five seconds |

### `[redis]`

| Key | Default | What it does |
|---|---:|---|
| `redis.enabled` | `false` | Enables Redis pub/sub handoff. Ignored unless `sql.enabled` is also true |
| `redis.host` | `127.0.0.1` | Redis hostname |
| `redis.port` | `6379` | Redis port |
| `redis.username` | empty | ACL username. Credentials are only attached when username or password is non-empty |
| `redis.password` | empty | Redis password |

Backends exchange request-correlated, fence-qualified snapshots through the `Adapt:data:v2` channel family. Unsolicited profile payloads are ignored.

### Conflicts and protection overrides

```toml
[adaptationUsageConflicts]
"rift-blink" = ["agility-air-dash"]

[protectionOverrides.rift-blink]
WorldGuard = true
GriefPrevention = false
```

Both blocks are examples. `adaptationUsageConflicts` is empty by default. `protectionOverrides` contains one placeholder row, `"adaptation-name"` mapped to `WorldGuard = true`.

Conflict pairs are symmetric. Listing `agility-air-dash` under `rift-blink` blocks either adaptation while the other is learned. `protectionOverrides` starts from the default protector set, then adds or removes protectors by the names in [Protection and region policy](/adapt/08-protection-region-policy). An unknown name is skipped.

### Player preferences

Set `playerSettingsEnabled = false` at the top level of `adapt.toml` to disable all personal skill and adaptation configuration. Players use each control's server `defaultValue`, including enable switches, trigger modes, block filters, limits, and reserves. Settings controls and resets are hidden, and players cannot change them. Learned levels and normal learning/unlearning rules still apply. Personal effects and language remain configurable.

Saved personal choices are retained but ignored while this switch is off. Setting it back to `true` restores eligible saved choices. A valid config save applies the policy to online players and refreshes open menus.

Every adaptation has a personal `enabled` control. Its server policy lives in `adaptations/<adaptation-id>.toml` under `[playerPreferences.<control-id>]`. Skill-wide enable policies use the same shape in `skills/<skill-id>.toml`. Setting a skill off suppresses its adaptations without overwriting their individual choices or stopping ordinary skill XP. Player edits save to player data; they do not edit the server file or hotload a skill.

| Field | Meaning |
|---|---|
| `playerEditable` | `true` lets the player choose an unlocked allowed value when `playerSettingsEnabled` is also `true`; `false` forces `defaultValue`. |
| `defaultValue` | Registered uppercase value used when locked or no saved permitted choice applies. Must appear in `allowedValues`. |
| `allowedValues` | Nonempty list of registered values that the server permits. Level requirements still apply. |

Blink's control IDs and values are:

| ID | Values | Default |
|---|---|---|
| `enabled` | `ON`, `OFF` | `ON` |
| `phasing` | `SNEAK`, `AIM`, `NEVER`, `AUTO` | `SNEAK` |
| `targeting` | `DISTANCE`, `VERTICALITY` | `DISTANCE` |
| `activation` | `MANUAL`, `REACTIVE` | `MANUAL` |
| `reactive-direction` | `LOOK`, `AWAY_FROM_ATTACKER` | `LOOK` |
| `landing` | `SERVER`, `NEAR`, `NONE` | `SERVER` |
| `momentum` | `FULL`, `HALF`, `STOP` | `FULL` |

For example, allow both targeting preferences but force manual activation:

```toml
[playerPreferences.targeting]
playerEditable = true
defaultValue = "DISTANCE"
allowedValues = ["DISTANCE", "VERTICALITY"]

[playerPreferences.activation]
playerEditable = false
defaultValue = "MANUAL"
allowedValues = ["MANUAL", "REACTIVE"]
```

Reactive activation and its direction choice require Blink level 2. A forced Reactive mode cannot grant that level; a lower-level player cannot trigger it. Setting `allowPhasing = false` prohibits phasing regardless of the saved mode. AUTO favors mantling when aiming upward and phasing when aiming level or downward. Landing follows the server snap depth, caps it at two blocks, or disables snapping; momentum keeps the server exit impulse, halves it, or stops it. Skill/adaptation enable flags, use permissions, world restrictions, protection, costs, and cooldowns remain authoritative.

A saved choice that becomes unavailable is retained but does not apply. When the player regains its required level or the server allows it again, it can apply again. Reset to server defaults removes that adaptation's saved choices. Turning an adaptation or skill off preserves learned levels, spent knowledge/power, permanent status, and learning conflicts. New adaptation effects, usage XP, and recipe use stop; committed costs, damage debt, and cooldowns still settle. Existing backpacks, stored tools, and other item-owned contents are retained. Existing progression resets preserve preferences; deleting or replacing the entire player record clears them.

Last Rites, Hourglass Guard, and Void Skin accept `[playerPreferences.death-save-priority]` with values `FIRST`, `NORMAL`, and `LAST`, defaulting to `NORMAL`. Use `playerEditable = false` to enforce a server priority. Equal priorities use Last Rites, then Hourglass Guard, then Void Skin; only one eligible save pays its cooldown or cost for each hit. Changing these policies does not reset an active cooldown.

Other controls are listed on each skill page. Percentage presets cap a personal effect at Full, Half, or Quarter of its earned server limit. Reserve settings refuse an action if paying its complete cost would cross the selected reserve. Confirmation settings require the same action with unchanged items to be repeated within five seconds before payment. Material, projectile, and target filters restrict the listed categories; they cannot broaden server eligibility.

Invalid policy edits keep the last valid live configuration. Save valid policy changes using the normal adaptation configuration reload workflow.

### Other nested sections

| Section | Documented in |
|---|---|
| `value` | [37 - Recipes, Brewing & Value](/adapt/37-recipes-brewing-value) |
| `gui` | [06 - GUI Customization](/adapt/06-gui-customization) |
| `farmPrevention` | [05 - Configuration Math](/adapt/05-configuration-math) |
| `adaptationXp` | [05 - Configuration Math](/adapt/05-configuration-math) |
| `xpIntegrity` | [05 - Configuration Math](/adapt/05-configuration-math) |
| `permissionXpMultipliers` | [05 - Configuration Math](/adapt/05-configuration-math) |
| `protectorSupport` | [08 - Protection & Region Policy](/adapt/08-protection-region-policy) |

### Reload matrix

Skill, adaptation, GUI, effects, progression, language, model, and protection settings apply on save. SQL, Redis, metrics, and installing or removing an optional plugin need a restart. See [Updates](/adapt/40-operator-runbooks).

## Uninstalling

Removing Adapt deletes every player's skills, knowledge, and learned adaptations. Some items and animals keep changes Adapt made to them, as listed under What remains.

> Back up `plugins/Adapt/` before uninstalling, and back up the SQL schema when `sql.enabled` is `true`. Deleted progression cannot be recovered.
{.is-warning}

### Before removing the jar

1. Have players empty their backpacks and sneak-drop each Omni Tool and Multi Armor to split it. These items keep their contents in Adapt's item data, which only Adapt can open.
2. If you use WorldGuard, clear Adapt's flags from your regions with `/rg flag <region> <flag>` and no value. The flags are `use-adaptations`, `adapt-xp`, `adapt-xp-multiplier`, `adapt-power-bonus`, and `adapt-unlock-adaptations`. WorldGuard accepts these flag names only while Adapt is installed.

### Remove Adapt

1. Stop every backend that runs Adapt. With SQL storage, stop every server that shares the schema.
2. Delete `Adapt v<version> [CraftBukkit] 26.1.2-26.3.jar` from each backend's `plugins/` folder. Adapt has no proxy plugin or client mod.
3. Delete `plugins/Adapt/` on each backend. It holds the configuration, language files and per-player language choices, local player profiles, the advancement store, per-world block data, diagnostic reports, the runtime cache, and downloaded libraries.
4. With `sql.enabled = true`, drop Adapt's tables from the `sql.database` schema:

| Tables | Created when |
|---|---|
| `ADAPT_DATA`, `ADAPT_DATA_FENCE` | `sql.enabled = true` |
| `ADAPT_ADVANCEMENT_UNREDEEMED`, `ADAPT_ADVANCEMENT_PROGRESS`, `ADAPT_ADVANCEMENT_PLAYERS`, `ADAPT_ADVANCEMENT_TEAMS` | `sql.enabled = true` and `advancements = true`. These hold advancement progress |
| `ADAPT_ADVANCEMENT_MIGRATIONS` | `sql.enabled = true` and `advancements = true`. This records completed imports |

Drop the advancement tables in the listed order so their foreign keys remain valid until each dependent table is removed.

The source tables `Teams`, `Players`, `Advancements`, and `Unredeemed` remain separate from these tables and can contain other plugins' data. Remove only records you have verified belong to Adapt if you also want to erase the retained import sources.

5. Redis needs no cleanup. Adapt's staged handoff keys expire after 60 seconds.
6. Remove `%adapt_…%` placeholders from other plugins' configuration. Without Adapt, PlaceholderAPI leaves them unreplaced.
7. Leave `plugins/bStats/` in place unless no remaining plugin on the server uses bStats. That folder is shared.

### What remains

| Leftover | Without Adapt |
|---|---|
| Backpack, Omni Tool, and Multi Armor contents | Unreachable. The base item remains, and a reinstalled Adapt can read the contents again |
| Orbs, bound items, chalk wands, time bombs, and time bottles | Behave as their base items, such as a snowball, an ender pearl, or a lingering potion of weakness. See [Bound items](/adapt/36-items-orbs-bound-objects#bound-items) |
| Brewed Adapt potions | Ordinary potions that keep their effects |
| Masterwork tools and armor | Keep any Masterwork durability, enchantment, or `adapt:masterwork_bonus` attribute modifier, and the lore. These keep working |
| Heirloom Edge swords | Keep their `adapt:heirloom_edge_damage` attack damage modifier and lore. These keep working |
| Animals shaped by Stable Hand | Keep their permanent attribute bonuses. Remove them as shown below |
| Architect Foundation glass and Ranged Web Bomb cobwebs that were active when the server stopped | Ordinary tinted glass and cobwebs. Adapt clears them the next time it loads their chunk; without Adapt, break them by hand |
| Adapt recipes in players' recipe books | Removed by the server when the player next joins |
| Status effects from adaptations | Ordinary timed effects that wear off |
| Other attribute bonuses and penalties on players and mobs | Gone. They are temporary and never saved |
| Other stored data under the `adapt` namespace on players, items, entities, chunks, and containers | Inert. The server keeps it, but nothing reads it |

Stable Hand bonuses are vanilla attribute modifiers on each animal that a player tamed or bred with Stable Hand learned. Remove them one animal and one attribute at a time:

```none
/attribute <animal> minecraft:max_health modifier remove adapt:tame-stable-health
```

| Attribute | Modifier id |
|---|---|
| `minecraft:movement_speed` | `adapt:tame-stable-speed` |
| `minecraft:jump_strength` | `adapt:tame-stable-jump` |
| `minecraft:max_health` | `adapt:tame-stable-health` |
| `minecraft:safe_fall_distance` | `adapt:tame-stable-fall` |

### Starting fresh

1. Stop every backend that shares Adapt data.
2. Delete `plugins/Adapt/`. To keep your configuration and players' language choices, delete only `plugins/Adapt/data/`.
3. With SQL storage, use an empty schema. To reuse the current schema after a completed import, drop the tables listed above except `ADAPT_ADVANCEMENT_MIGRATIONS`; keep its completion record so retained source rows are not imported again.
4. Start the servers with the Adapt jar. Adapt creates default files, and every player starts with an empty profile.

To reset individual players instead, use `/adapt reset confirm <player>`. See [Clearing data](/adapt/04-commands-permissions#clearing-data). Items and animals listed under What remains are part of the world and stay after a fresh start.
