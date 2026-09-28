---
title: "Installation & Configuration"
description: "Adapt files, requirements, and settings"
published: true
date: 2026-09-28T20:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Edit the TOML files under `plugins/Adapt/`. A valid save refreshes open menus. Invalid TOML is rejected and the current settings stay. SQL, Redis, metrics, update checks, and optional-plugin detection apply on restart.

| | |
|---|---|
| Server | Paper, Purpur, or Folia. Minecraft 26.1 through 26.2, and Paper 26.3. Folia 26.3 waits on a published server build |
| Java | 25 |
| Jar | `Adapt-<version>-packed.jar` in each backend `plugins/` folder |
| Command | `/adapt`, behind `adapt.main`. `adapt.use.*` defaults to true and still needs that root node |

An XZ packed jar extracts `plugins/Adapt/cache/runtime/` on first start. That directory must be writable. A non-English `language` is downloaded to `languages/<locale>.toml` only when that file is missing.

`blacklistedWorlds` takes namespaced world keys, such as `minecraft:the_nether`. The two generated entries match nothing. Mutations use their own `worldBlacklist`.

`ignorePassiveMobs` in an adaptation file excludes passive and neutral mobs from that adaptation's area, reflected, or chain damage. Add the key at the top level of that file when it is absent. Default `false`. Provoked neutral mobs stay excluded. Direct attacks are unchanged. It applies to `axe-cleave`, `axe-ground-smash`, `axe-throwing-axe`, `sword-crimson-cyclone`, `excavation-earth-mover`, `ranged-heartseeker`, `nether-skull-toss`, `tragoul-thorns`, `tragoul-globe`, `tragoul-lance`, `tragoul-corpse-explosion`, and `tragoul-plague-bearer`. Skeletal servants, Shadow Decoys, and the attacker's tamed pets are excluded from those attacks either way. Grave Digger's unearthed enemies stay valid targets.

SQL is authoritative when `sql.enabled` is true. Create the schema and grant `SELECT`, `INSERT`, `UPDATE`, `DELETE`, and `CREATE TABLE`. Adapt creates `ADAPT_DATA` and `ADAPT_DATA_FENCE` in that schema and refuses SQL until both are InnoDB. Credentials go in the JDBC URL. Adapt has no TLS switch of its own. Redis handoff runs only when `redis.enabled` is also true. A fenced write that exhausts its retries is kept as `data/players/<uuid>.json.pending-sql`. See [Cross-server SQL and Redis](/adapt/39-velocity-cross-server).

```sql
ALTER TABLE ADAPT_DATA ENGINE=InnoDB;
ALTER TABLE ADAPT_DATA_FENCE ENGINE=InnoDB;
```

Vault charges `knowledge cost * learningEconomy.moneyPerKnowledge` when `learningEconomy.enabled` is true and an economy provider is present. Otherwise learning stays knowledge-only. A failed withdrawal rejects the purchase. A failed refund is stored on the skill line and settled on the next learn or unlearn. `hardcoreNoRefunds` returns neither knowledge nor currency.

Mutations stay off until `mutations.toml` sets `enabled = true`. That file hot-reloads. `/adapt mutations reload` does the same. Per-type behavior is in the [Mutations catalog](/adapt/35-mutations-catalog).

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

```text
plugins/Adapt/
  adapt.toml
  models.toml
  mutations.toml
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
| `verbose` | `false` | Prints gated profile, permission, XP, and per-action diagnostics. `/adapt debug verbose` flips the in-memory value without writing the file |
| `autoUpdateCheck` | `true` | Starts the update check asynchronously during enable. Each remote source has a 3 second connect and read timeout |
| `splashScreen` | `true` | Prints the startup banner |
| `metrics` | `true` | Starts bStats and integration metrics during enable |
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

Conflict pairs are symmetric. Listing `agility-air-dash` under `rift-blink` blocks either adaptation while the other is learned. `protectionOverrides` starts from the default protector set, then adds or removes protectors by the names in [Protection and region policy](/adapt/08-protection-region-policy). An unknown name is skipped.

### Player preferences

Adaptations with player controls store their server policy in `adaptations/<adaptation-id>.toml` under `[playerPreferences.<control-id>]`. Rift Blink currently supplies these controls. Player edits save to player data; they do not edit the server file or hotload a skill.

| Field | Meaning |
|---|---|
| `playerEditable` | `true` lets the player choose an unlocked allowed value; `false` forces `defaultValue`. |
| `defaultValue` | Registered uppercase value used when locked or no saved permitted choice applies. Must appear in `allowedValues`. |
| `allowedValues` | Nonempty list of registered values that the server permits. Level requirements still apply. |

Blink's control IDs and values are:

| ID | Values | Default |
|---|---|---|
| `enabled` | `ON`, `OFF` | `ON` |
| `phasing` | `SNEAK`, `AIM`, `NEVER` | `SNEAK` |
| `targeting` | `DISTANCE`, `VERTICALITY` | `DISTANCE` |
| `activation` | `MANUAL`, `REACTIVE` | `MANUAL` |
| `reactive-direction` | `LOOK`, `AWAY_FROM_ATTACKER` | `LOOK` |

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

Reactive activation and its direction choice require Blink level 2. A forced Reactive mode cannot grant that level; a lower-level player cannot trigger it. Setting `allowPhasing = false` prohibits phasing even if the player's saved choice is AIM. Skill/adaptation enable flags, use permissions, world restrictions, protection, costs, and cooldowns remain authoritative.

A saved choice that becomes unavailable is retained but does not apply. When the player regains its required level or the server allows it again, it can apply again. Reset to server defaults removes that adaptation's saved choices. Turning Blink off preserves learned levels and spent knowledge/power. Existing progression resets preserve preferences; deleting or replacing the entire player record clears them.

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

Skill, adaptation, GUI, effects, progression, mutation, language, model, and protection settings apply on save. SQL, Redis, metrics, and installing or removing an optional plugin need a restart. See [Updates](/adapt/40-operator-runbooks).
