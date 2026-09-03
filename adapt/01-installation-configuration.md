---
title: "Installation & Configuration"
description: "Adapt documentation: Installation & Configuration"
published: true
date: 2026-09-03T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt 2.0.3-26.2 is a single Bukkit jar. It supports Paper, Purpur, and Folia on Minecraft 26.1 and Java 25. Copy the jar into `plugins/`. Start the server once so it writes its defaults. Then edit the TOML files under `plugins/Adapt/`.

Most settings hot-reload. Valid edits refresh open Adapt menus; invalid TOML is rejected while the current settings stay active.

SQL, Redis, metrics, update checks, and optional-plugin detection require a restart.

Every plugin Adapt talks to is optional. Without PlaceholderAPI you lose the `%adapt_...%` placeholders. Without Vault, learning stays knowledge-only. Without a protection plugin, Adapt never asks one for permission. An absent integration does not stop startup, but Adapt can warn when a configured or installed integration cannot be used, such as Vault pricing without an economy provider or an installed-but-disabled HiddenOre.

Configuration is split across root-level `adapt.toml`, `models.toml`, and `mutations.toml`, plus one TOML per skill and adaptation under `skills/` and `adaptations/`. The Mutation layer is off until you turn it on.

## Installing

1. Run Paper, Purpur, or Folia for Minecraft 26.1 on Java 25.
2. Copy `Adapt-<version>.jar` into each backend server's `plugins/` folder, not the proxy.
3. Start the server, watch for the Adapt splash, and confirm it enables without an API-version or dependency complaint.
4. For a non-English server, set `language` in `plugins/Adapt/adapt.toml` to one of the supported locale names. Adapt downloads only that locale, verifies it against the build manifest, caches it, and activates it without a restart.
5. Stop the server again before you configure SQL, Redis, or metrics. Those are read once, at enable.
6. Grant `adapt.main` to anyone who should reach `/adapt` at all, then add the specific command nodes. The gameplay `adapt.use.*` nodes default to true but do not get anyone past that root gate.

## Sharing player data across servers

By default a player's progression lives in `data/players/<uuid>.json`. SQL mode moves authority into two InnoDB tables: `ADAPT_DATA` holds JSON and `ADAPT_DATA_FENCE` holds the current owner, epoch, and committed sequence. Use the same SQL schema on every backend that shares a player base. Redis carries request-correlated handoff snapshots for the exact preceding SQL owner and stages them for 60 seconds; it is not a cache or a second storage backend. No proxy plugin is required.

1. Create the database schema yourself and give the account SELECT, INSERT, UPDATE, DELETE, and CREATE TABLE on it. Adapt creates both tables inside the schema but never the schema.
2. Fill in the `sql.*` host, port, database, username, and password keys, then set `sql.enabled = true`.
3. For Redis, set `redis.host` and `redis.port`, add `redis.username` and `redis.password` only if your Redis uses ACLs, then set `redis.enabled = true`. Redis stays inert unless `sql.enabled` is also true.
4. Restart. Both clients are only built during enable.
5. Confirm both tables are InnoDB and that a test player's progression survives a relog and a server switch.

Adapt puts the SQL credentials straight into the JDBC URL. It has no TLS switch of its own. Configure transport security on the database endpoint and in the driver environment. SQL startup fails closed unless both tables are InnoDB. After backing up the schema, convert legacy tables with `ALTER TABLE ADAPT_DATA ENGINE=InnoDB;` and `ALTER TABLE ADAPT_DATA_FENCE ENGINE=InnoDB;`, then restart every backend.

A fenced SQL write that exhausts its retries is retained beside the player file as `<uuid>.json.pending-sql`. Stop every backend, back up the database and file, decide which profile is authoritative, delete only the incompatible recovery file, then restart. See [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server).

## Charging money for learning

1. Install Vault and an economy plugin that registers with it, then set `learningEconomy.enabled = true`.
2. Set `learningEconomy.moneyPerKnowledge` to the currency charged per knowledge point. An adaptation's bill is its knowledge cost times this number.
3. Set `learningEconomy.refundPercent` to how much comes back on a normal unlearn, or `0` for no money refunds.

Without Vault or an economy provider, learning falls back to knowledge only. A failed withdrawal rejects the purchase. A failed refund is written onto the player's skill line as a pending receipt. The next learning transaction on that line settles it. `hardcoreNoRefunds = true` suppresses knowledge and money refunds entirely.

## Turning on Mutations

1. Set `enabled = true` in `mutations.toml`.
2. Set the gates. `slotOneUnlockLevel` and `slotTwoUnlockLevel` are master levels. `minimumAdaptationLevel` is the learned adaptation level needed in each of a mutation's two skill domains.
3. Decide whether players may re-pick. `switchingEnabled` allows player-driven changes, `permanentSelection` locks the first choice until an admin clears it, and `switchCooldownMillis` and `combatLockMillis` throttle the rest.
4. Set `cooperativeConsentMode` if you use group effects. Every mode also needs the recipient's own saved opt-in.
5. Save. Mutation config hot-reloads and online players are reconciled. `/adapt mutations reload` does the same on demand.

Player-facing behavior for each type is in [35 - Mutations Catalog](/adapt/35-mutations-catalog).

## Turning Adapt off in a world

Add the world's namespaced Bukkit key to `blacklistedWorlds`. These are keys, not folder names: `minecraft:overworld`, `minecraft:the_nether`, `minecraft:the_end`, or whatever key a custom world provider supplies. The two entries in the generated file are placeholders that match nothing. The change applies in the next eligible automatic batch, or immediately through explicit reload. Mutations have their own separate `worldBlacklist`, both globally and per type.

## Config maintenance

`/adapt configure` opens the config editor in a menu instead of a text editor, and needs `adapt.configurator` or op.

`/adapt default skill <skill>` and `/adapt default adaptation <skill:adaptation>` delete that file, regenerate it from defaults, and reconcile mutations. `/adapt default all` archives `adapt.toml` and every skill and adaptation TOML into `config-archive/<timestamp>/` first, then deletes, regenerates, and reloads them. It leaves `mutations.toml`, `models.toml`, language overrides, SQL and Redis data, and player progression alone. All three need `adapt.configurator`.

This layout is a hard break. Delete the obsolete `plugins/Adapt/adapt/` directory before upgrading, which permanently removes any local settings stored there, then start the server to generate `adapt.toml`, `models.toml`, `mutations.toml`, `skills/`, and `adaptations/` directly under `plugins/Adapt/`. Adapt does not migrate the old directory, JSON configuration files, or the former misspelled value-multiplier key; restart after applying the desired settings.

## Reference

### Identity

| Property | Value |
|---|---|
| Version | `2.0.3-26.2` |
| Main class | `art.arcane.adapt.Adapt` |
| `api-version` | `26.1` |
| Java toolchain | 25 |
| Bukkit command root | `/adapt` |
| Root permission | `adapt.main` (default op) |
| `folia-supported` | `true` |

### Optional plugins (all soft dependencies)

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

Activation and failure behavior: [08 - Protection & Region Policy](/adapt/08-protection-region-policy) and [09 - Integrations](/adapt/09-integrations).

### Data folder layout

```text
plugins/Adapt/
  adapt.toml
  models.toml
  mutations.toml
  skills/<skill-id>.toml
  adaptations/<adaptation-id>.toml
  config-archive/<timestamp>/
  languages/en_US.toml
  languages/downloaded/<source-revision>/<locale>.toml
  languages/overrides/<locale>.toml
  languages/players.properties
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
| `verbose` | `false` | Prints gated profile, permission, XP, and per-action diagnostics. `/adapt debug verbose` flips the in-memory value without writing the file |
| `autoUpdateCheck` | `true` | Starts the update check asynchronously during enable. Each remote source has a 3 second connect and read timeout |
| `splashScreen` | `true` | Prints the startup banner |
| `metrics` | `true` | Starts bStats and integration metrics during enable |
| `language` | `en_US` | Server default locale. Players may override it with the shared in-game picker. Supported non-English values download automatically; the same name selects the optional override file |
| `xpCurve` | `ADAPT_BALANCED` | Curve family shared by every skill line and by master level. See [05 - Configuration Math](/adapt/05-configuration-math) |
| `experienceMaxLevel` | `1000` | Skill level cap, and the ceiling the level-search cursor clamps to |
| `playerXpPerSkillLevelUpBase` | `489` | Finite non-negative flat master XP granted per skill level crossed |
| `playerXpPerSkillLevelUpLevelMultiplier` | `44` | Finite non-negative extra master XP per level already reached |
| `powerPerLevel` | `0.65` | Finite non-negative power budget per master level, truncated to a whole number |
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
| `actionbarNotifyMasterLevel` | `true` | Shows account-wide master-level and maximum-power notifications without changing progression or Mutation unlock checks |
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
| `sql.database` | `adapt` | Existing schema the table lives in. Adapt creates the table, never the schema |
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

Conflict pairs are symmetric at runtime. Listing `agility-air-dash` under `rift-blink` means holding either one blocks use of the other. The block is not only the direction the file reads. `protectionOverrides` starts from the currently enabled default protector set. Then it adds or removes protectors by exact `Protector.getName()` value. A `true` naming an unknown protector logs an error and is skipped. Full protector names and defaults: [08 - Protection & Region Policy](/adapt/08-protection-region-policy).

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

### `mutations.toml`, global keys

| Key | Default | What it does |
|---|---:|---|
| `enabled` | `false` | Master switch for the whole Mutation feature |
| `slotOneUnlockLevel` | `25` | Master level needed for slot 1 |
| `slotTwoUnlockLevel` | `50` | Master level needed for slot 2. Normalized up to at least slot 1 |
| `perfectAdaptationLevel` | `200` | Master level at which drawbacks soften |
| `perfectAdaptationEnabled` | `true` | Enables that level-based softening |
| `minimumAdaptationLevel` | `1` | Learned adaptation level required in each of the mutation's two domains |
| `switchCooldownMillis` | `600000` | Wait after any normal slot change |
| `combatLockMillis` | `10000` | How long taking damage blocks a normal slot change |
| `switchingEnabled` | `true` | Allows player-driven switching |
| `permanentSelection` | `false` | Makes the first choice admin-clearable only |
| `pvpEnabled` | `true` | Global switch for Mutation effects in PvP |
| `cooperativeEffectsEnabled` | `true` | Global switch for cooperative effects |
| `cooperativeConsentMode` | `EXPLICIT` | Which recipients count as consenting |
| `bookshelfTokenMillis` | `60000` | How long one bookshelf interaction authorizes changes |
| `bookshelfMaximumDistance` | `8.0` | How far the player may stray from that bookshelf |
| `particlesEnabled` | `true` | Global Mutation particle switch |
| `soundsEnabled` | `true` | Global Mutation sound switch |
| `worldBlacklist` | empty | Namespaced world keys where all Mutations are off |
| `domainMembership` | built-in map | Which skills count toward each Mutation domain |

Every consent mode also requires the recipient's saved opt-in. `EXPLICIT` accepts any opted-in eligible recipient. `PARTY` also requires both players to share a Bukkit scoreboard and be on the same team. `FRIEND` and `DISABLED` both accept nobody (no friend provider is implemented). Every type profile also carries `enabled = true`, `pvpEnabled = true`, `particlesEnabled = true`, `soundsEnabled = true`, an empty `worldBlacklist`, and an empty `conflicts`. World keys and conflict lists are normalized on load.

### `mutations.toml`, per-type tables

| Table | Keys and defaults |
|---|---|
| `galeLung` | `maximumMomentum = 100`, `sprintMomentumPerBlock = 8`, `airborneMomentumPerBlock = 4`, `stationaryVentMillis = 1250`, `burdenKnockbackMultiplier = 1.35`, `meleeFlankDistance = 1.5`, `projectileDisplacement = 0.45` |
| `bastionSpine` | `anchorChargeMillis = 1500`, `maximumStability = 8`, `stabilityPerDamage = 0.5`, `waveRange = 5`, `waveAngleDegrees = 90`, `maximumVelocity = 0.85`, `maximumTargets = 12` |
| `verdantMolt` | `chargeTicks = 50`, `cooldownMillis = 90000`, `saturationCost = 6`, `recoveryTicks = 40`, `maximumEffects = 32` |
| `temperbound` | `rejectionMillis = 30000` |
| `paradoxScar` | `minimumDistance = 8`, `echoLifetimeMillis = 12000`, `maximumReturnDistance = 64`, `hostileCollapseTicks = 60` |
| `arsenalCortex` | `chainTimeoutMillis = 5000`, `maximumChain = 4`, `dullnessMillis = 3000` |
| `packmind` | `quarryMillis = 20000`, `participationRange = 16`, `maximumTempo = 6`, `maximumMembers = 8`, `waitingDamageFactor = 0.8` |
| `trophyCrucible` | `imprintLifetimeMillis = 1800000`, `recognitionRange = 16` |
| `umbralEcho` | `angleBucketDegrees = 45`, `techniqueMemoryMillis = 5000`, `echoDelayTicks = 8`, `exposureTicks = 60`, `maximumTargetMemories = 8` |
| `livingLattice` | `maximumRootCharge = 12`, `pathLength = 5`, `blockLifetimeMillis = 15000`, `collapseLockMillis = 4000`, `maximumBlocks = 16`, `maximumStructures = 3` |
| `masterworkBond` | `abandonCooldownMillis = 86400000` |
| `deepblood` | `maximumDepthY = 16`, `ichorPerBlock = 1`, `maximumIchor = 100`, `regenerationCost = 4`, `toolPreservationCost = 25`, `aboveGroundHalfLifeMillis = 300000` |
| `mycelialNerve` | `range = 16`, `copiedDurationFactor = 0.5`, `rootDurationFactor = 0.75`, `maximumRecipients = 8`, `reconnectLockMillis = 5000` |
| `gravebloom` | `lifetimeMillis = 20000`, `radius = 6`, `maximumBlooms = 3`, `regenerationFactor = 0.5`, `pulseTicks = 20`, `maximumCrops = 16`, `maximumAnimals = 8` |
| `resonantFormula` | `sigilLifetimeMillis = 600000`, `collapseLockMillis = 30000`, `echoFactor = 0.5`, `echoDelayTicks = 10` |

Keys ending in `Millis` are milliseconds and keys ending in `Ticks` are server ticks. Factors are multipliers, ranges and distances are blocks, angles are degrees, and every count or charge value is clamped into a safe band during load.

### Reload matrix

The watcher drains native events every 500 ms and runs bounded exact-content fallback reconciliation about every 2.5 seconds. It watches `adapt.toml`, `models.toml`, `mutations.toml`, the locale override folder, and every TOML directly inside `skills/` and `adaptations/`. Automatic snapshots are capped at 2 MiB and normalized into one latest-state batch, with at most one application every 3 seconds and one trailing batch when more saves arrive during the cooldown. Passive automatic loads never rewrite or recreate the source file.

| Change | Hot reload | Restart required |
|---|---|---|
| Skill and adaptation config, including enabled flags | yes | no |
| GUI, effects, progression math, conflicts, protection overrides | yes | no |
| Language, model mappings, advancements | yes | no |
| Mutation config | yes, and online players are reconciled | no |
| Ability API policy, failure, watchdog, and throttle settings | yes | no |
| `protectorSupport.*` default-active membership | yes | no |
| SQL or Redis endpoint, or their enabled state | no | yes |
| Metrics enabled state | no | yes |
| Installing or removing an optional plugin, and protector registration | no | yes |
| Startup banner or update check | takes effect next enable | yes |

## See also

- [04 - Commands & Permissions](/adapt/04-commands-permissions)
- [05 - Configuration Math](/adapt/05-configuration-math)
- [06 - GUI Customization](/adapt/06-gui-customization)
- [08 - Protection & Region Policy](/adapt/08-protection-region-policy)
- [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server)
