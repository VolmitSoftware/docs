---
title: "Configuration"
description: "Gloss documentation: Configuration"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

Feature switches and general runtime settings live in `plugins/Gloss/config.toml`. Gloss generates the file with a comment above each knob, canonicalizes it during startup and explicit importer writes, and watches it while the server runs. Content and complete authored feature profiles — including tablist text, MOTD lines, bubble styling, and real-drop presentation — live in JSON documents. See [Data Files & Hot Reload](/gloss/03-data-files).

## The file model

`config.toml` opens with a generated header and then lists each knob under its comment:

```toml
# Configuration - gloss
# This file is canonicalized on load; comments and new keys may update automatically.
#
# Gloss runtime configuration. Every knob is emitted with a comment, values outside their documented range are clamped back on load, and edits hot-reload while the server runs.

# Prints the Gloss splash screen during startup.
splashScreen = true
# Sends anonymous bStats usage metrics.
metrics = true
```

Every table below is emitted the same way. Each key has its own comment line before it.

**Canonicalization.** Startup and explicit importer writes parse, normalize, re-serialize, and write the file back when the canonical result differs. That is how out-of-range numbers are clamped into the file, missing keys reappear, and comments regenerate after an upgrade. Automatic hotload and `/gloss reload` normalize only the captured in-memory value; they never rewrite a file an editor or FTP client may still be replacing.

**Hot reload.** The same watchdog that checks the data folders also checks `config.toml` at `[hotload] watchIntervalTicks`. Ordinary passes only drain native file events; an idle pass does not reread the file. A pending stability check or the 6-second exact-content reconciliation captures immutable bytes and compares their SHA-256, so atomic replacements, FTP saves, and same-size edits with preserved timestamps still apply. Automatic work is queued into at most one completed batch every 3 seconds, with one latest-state trailing pass when more saves arrive. A hash guard suppresses startup or importer writes, so they do not loop into another reload. `/gloss reload` remains immediate.

**Failure behavior differs between boot and reload.**

- At startup, Gloss replaces an unreadable or invalid `config.toml` with a fresh default file. A warning names the reason. Enable continues.
- On hot reload and on `/gloss reload`, Gloss refuses an invalid file. Gloss logs `config.toml is invalid; keeping the last good configuration.` Nothing changes. The previously loaded configuration stays live. No service is touched.

A file larger than 2 MiB is treated as invalid. Gloss does not parse it.

**`/gloss reload`** (permission `gloss.admin`) reads the file immediately and cycles every configured service. Automatic hotload compares section snapshots and cycles only the services whose section changed. Both paths parse passively without rewriting the source file.

## Root keys

| Key | Default | Notes |
|---|---|---|
| `splashScreen` | `true` | Print the console splash banner during startup. `false` suppresses it for clean startups. A failed enable always prints it |
| `metrics` | `true` | Send anonymous bStats usage metrics |

> Metrics report under bStats plugin id `33525`. If you set this to `false`, all submission stops.
{.is-info}

## `[features]`

Master switches. An effective off state stops that subsystem from rendering or listening. For most kinds the documents still load, still hot-reload and are still editable by command. `emoji` and `animations` shut down completely while off and can start on a later reload. `panels` and `previews` instead decide service construction once during enable; when either is off at startup, none of its documents are loaded.

| Key | Default | Gates |
|---|---|---|
| `holograms` | `true` | The hologram engine |
| `boards` | `true` | Scoreboard sidebars |
| `tablist` | `true` | Tablist header/footer and list-name management |
| `emoji` | `true` | Emoji replacement in chat and rendered content |
| `animations` | `true` | Text animations |
| `chatBubbles` | `true` | Chat bubbles above players |
| `damageIndicators` | `true` | Floating damage and heal indicators |
| `drops` | `true` | Custom names on dropped item stacks |
| `realDrops` | `true` | Native display-backed dropped-item models, motion, landing, and labels |
| `menus` | `true` | Holographic menus |
| `panels` | `true` | World-anchored panels |
| `previews` | `true` | Look-at container previews |
| `motd` | `false` | The custom server list MOTD |

`motd` is the only feature that ships off. Gloss reads `panels` and `previews` once during enable. The panel service and the preview registry start only when their feature is on at that moment.

Shipped defaults follow the toggle. A feature that is off extracts nothing and leaves no folder behind, which is why a stock data folder has no `motd.json` and a server with previews off has no `previews/`. Turning a feature on extracts its defaults on that reload, except for `previews`, which needs the restart described above. See [Getting Started](/gloss/01-getting-started).

## `[hotload]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `watchIntervalTicks` | `5` | 1 – 200 | Ticks between polls of every watched file and folder. Changing it restarts the watchdog on reload |

## `[holograms]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `stackDistance` | `0.26` | 0.05 – 2.0 | Vertical distance in blocks between stacked temporary holograms, and the value exposed to the API as the stack spread |
| `updateIntervalTicks` | `10` | 1 – 200 | Ticks between ordinary persistent hologram refreshes; clock-driven expressions and named animations automatically sample every tick |
| `viewRange` | `48.0` | 4.0 – 128.0 | Distance in blocks at which holograms become visible, and the radius within which personalized metadata is sent |
| `perViewerPlaceholders` | `true` | — | Render complete placeholder, function and expression tokens per viewing player instead of once globally |
| `temporaryUpdateIntervalTicks` | `2` | 1 – 20 | Ticks between refreshes of temporary holograms (bubbles, indicators, API temporaries) |
| `interpolatedMotion` | `true` | — | Smooths moving temporary holograms between drive ticks via display teleport interpolation and smooths BubbleStyle scale/rotation through display transformation interpolation, using durations matched to `temporaryUpdateIntervalTicks`. It does not reduce the update rate. Unsupported interpolation controls fall back to immediate updates |
| `textArtMaxWidth` | `48` | 8 – 128 | Maximum character width of `/gloss hologram rendertext` output |
| `highFrequencyAnimations` | `true` | — | Drive animation clips faster than 20 fps from the dedicated `Gloss Animator` thread with sub-tick packet updates. Off restores the tick-bounded behavior exactly |
| `maxAnimationFps` | `120` | 1 – 240 | Frame-rate ceiling of the high-frequency animator loop. Sets its adaptive floor to `1000 / fps` ms (at least 4 ms) |
| `animationPacketBudget` | `20000` | 100 – 1000000 | Hologram text-metadata recipients per second, shared by animated targets, personalized updates and personalized clears. Large aggregate audiences degrade animation frame rate proportionally |

A non-finite `stackDistance` or `viewRange` falls back to its default. A finite value outside its documented range is clamped. See [Holograms](/gloss/04-holograms).

## `[boards]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `updateIntervalTicks` | `20` | 1 – 200 | Ticks between ordinary scoreboard refreshes; active clock-driven boards automatically use a separate every-tick driver |

## `[tablist]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `updateIntervalTicks` | `40` | 1 – 400 | Ticks between ordinary tablist refreshes. Animated header/footer text samples all recipients every tick; animated list-name formats and API overrides fast-tick only the players selecting them |

The header, footer and per-group list-name formats are not here. They are in `tablist.json`. See [Tablist & Server List MOTD](/gloss/06-tablist-motd).

## `[groups]`

| Key | Default | Meaning |
|---|---|---|
| `useVault` | `true` | Resolve player groups through Vault when it is installed. `false` skips Vault entirely, so no player resolves a group |

Gloss resolves groups live through Vault only. There is no `groups/` directory. There is no group inspector command. See [Scoreboards & Groups](/gloss/05-scoreboards-groups).

## `[emoji]`

| Key | Default | Meaning |
|---|---|---|
| `emojiSpecificPermissions` | `false` | Require a per-emoji permission instead of the global emoji permission for chat replacement |
| `tabComplete` | `true` | Offer emoji triggers in chat tab completion |

## `[text]`

Stage gates for the rendering pipeline. Neither applies to chat messages.

| Key | Default | Meaning |
|---|---|---|
| `placeholders` | `true` | Resolve PlaceholderAPI placeholders in rendered text. `false` leaves `%...%` tokens raw |
| `functions` | `true` | Resolve `\|function\|` expressions, including `\|animation.<id>\|`. `false` leaves the tokens raw |

## `[chat]`

| Key | Default | Meaning |
|---|---|---|
| `color` | `true` | Translate color codes in player chat for players holding `gloss.chat.color` |

## `[chatBubbles]`

| Key | Default | Meaning |
|---|---|---|
| `blacklistWorlds` | `[]` | World folder names where chat bubbles never appear. Null entries are dropped. No case folding is applied, so match the folder name exactly |

Bubble wrapping, appearance, lifetime and expression-driven motion are per-style, in schema-2 `bubbles/<id>.json`. See [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops).

## `[damageIndicators]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `randomThrowForce` | `0.08` | 0.0 – 2.0 | Random sideways force applied to a spawned indicator |
| `initialUpForce` | `0.13` | 0.0 – 2.0 | Initial upward force applied to a spawned indicator |
| `gravityFactor` | `0.0093` | 0.0 – 1.0 | Gravity pull applied to an indicator each step |
| `maxPerSecond` | `40` | 1 – 1000 | Indicators spawned per second before new ones are dropped |
| `maxMsAlive` | `3000` | 250 – 30000 | Milliseconds an indicator stays alive |
| `damagePrefix` | `"&c&l"` | — | Color-code prefix on damage numbers. A null value restores the default |
| `healPrefix` | `"&a&l"` | — | Color-code prefix on heal numbers. A null value restores the default |
| `decimals` | `0` | 0 – 2 | Decimal places shown on indicator numbers |
| `showHeals` | `true` | — | Show heal indicators as well as damage indicators |

The live-indicator admission limit is derived from `maxPerSecond * maxMsAlive`, rounded up to a
whole indicator, and hard-capped at 2,048. The defaults admit 120 simultaneous indicators. Once
full, Gloss drops new indicators until an existing one expires or is destroyed.

## `[drops]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `nameFormat` | `"&7{count}x {type}"` | — | Name format for dropped stacks. `{count}` and `{type}` are replaced. A null value restores the default |
| `bundleFormat` | `"&7Bundle &8(&7{total} items&8): &7{contents}"` | — | Name format for a dropped bundle carrying stacks. `{total}` and `{contents}` are replaced. A null value restores the default. An empty bundle falls back to `nameFormat` |
| `bundleEntryLimit` | `3` | 1 – 10 | Bundle content entries listed before the rest collapse into a `+N more` suffix |
| `bundleVerticalLabels` | `true` | — | Use one multiline TextDisplay for bundle labels while real drops are active |
| `bundleHeaderFormat` | `"&eBundle &8(&e{total} items&8)"` | — | First vertical bundle line; `{total}` is replaced |
| `bundleEntryFormat` | `"&7- &f{count}x {type}"` | — | One vertical line per material; `{count}` and `{type}` are replaced |
| `bundleMoreFormat` | `"&8+{remaining} more"` | — | Final line for hidden material types; `{remaining}` is replaced |
| `preserveCustomNames` | `true` | — | Leave custom names other plugins already set on dropped item entities untouched. Gloss tracks its own labels with a persistent data key |
| `useItemDisplayNames` | `false` | — | Opt in to using an item's display name from its item meta as `{type}` instead of the pretty material name |

## `real-drops/default.json`

`[features] realDrops` is the only real-drop setting in `config.toml`. The complete presentation profile lives in `plugins/Gloss/real-drops/default.json`, is extracted when the feature is enabled, and hot-reloads without a full config reload. The web editor's **Real drops** document exposes every field below and exports directly to that path.

### `limits`

| Key | Default | Range | Meaning |
|---|---:|---|---|
| `updateIntervalTicks` | `2` | 1 – 20 | Airborne carrier-position and transformation cadence; client interpolation smooths the interval |
| `settledPollIntervalTicks` | `20` | 2 – 200 | Movement and stack-change poll cadence after consecutive stable ground samples; landing slides retain the moving cadence |
| `maxVisualsPerStack` | `3` | 1 – 5 | Maximum one-count display models used to suggest stack size |
| `maxVisualsPerChunk` | `128` | 8 – 1024 | Shared chunk budget for item models and labels; an item stays vanilla-visible if its complete presentation cannot fit |
| `viewRange` | `32.0` | 4 – 128 | Item-model tracking range in blocks |
| `spread` | `0.18` | 0 – 1 | Separation in blocks between additional stack models |

The chunk budget is complemented by a fixed server-wide ceiling of 2,048 active presentations.
An item rejected by either bound keeps its native model and visible fallback name and receives no
real-drop update loop.

### `scale`

| Key | Default | Range | Meaning |
|---|---:|---|---|
| `defaultScale` | `0.4` | 0.05 – 2 | Ordinary three-dimensional block model scale |
| `flatItems` | `0.65` | 0.05 – 2 | Non-block ItemDisplay scale |
| `thinBlocks` | `0.45` | 0.05 – 2 | Slab, carpet, pressure-plate, and snow-layer model scale |

### `motion`

| Key | Default | Range | Meaning |
|---|---:|---|---|
| `tumble` | `true` | — | Rotate airborne models |
| `speedMultiplier` | `1.35` | 0.1 – 4 | Multiplier applied to all three authored tumble speeds; `1` uses the axis values unchanged |
| `degreesPerSecondX` | `160.0` | -1440 – 1440 | Base X-axis tumble speed |
| `degreesPerSecondY` | `120.0` | -1440 – 1440 | Base Y-axis tumble speed |
| `degreesPerSecondZ` | `100.0` | -1440 – 1440 | Base Z-axis tumble speed |
| `variance` | `0.2` | 0 – 1 | Stable per-item variation applied to each configured speed |
| `changeOnBounce` | `true` | — | Select another deterministic spin after an upward bounce |
| `velocityInfluence` | `0.35` | 0 – 4 | Increase angular speed from the authoritative item's real throw velocity |
| `submergedSpinMultiplier` | `0.35` | 0 – 1 | Angular-speed multiplier while submerged |
| `groundRollMultiplier` | `1.0` | 0 – 4 | Rotation generated from actual supported travel; `0` slides and `1` rolls at the model radius |

### `landing`

| Key | Default | Range | Meaning |
|---|---:|---|---|
| `mode` | `"NATURAL"` | `NATURAL`, `FLAT`, `UPRIGHT` | Grounded pose policy; NATURAL block models may settle on any of six faces |
| `tiltDegrees` | `10.0` | 0 – 45 | Maximum in-face variation for stationary/rebuilt NATURAL block models; momentum landings preserve their physical heading |
| `randomYaw` | `true` | — | Give direct landing modes and stationary/rebuilt models a stable UUID-derived yaw |
| `transitionTicks` | `4` | 0 – 20 | Client interpolation duration between continuous animation samples |
| `faceAttraction` | `0.55` | 0 – 1 | Portion of the remaining face-alignment angle removed per nearly-still sample |
| `movingFaceAttraction` | `0.15` | 0 – 1 | Face attraction retained while rolling; lower values preserve momentum longer |
| `alignmentDegrees` | `0.5` | 0.05 – 10 | Subvisual tolerance for the final exact face alignment |
| `settleDelayTicks` | `4` | 0 – 100 | Stable ticks required before sparse settled polling |

### `labels`

| Key | Default | Range | Meaning |
|---|---:|---|---|
| `enabled` | `true` | — | Mirror the effective item name through one TextDisplay |
| `yOffset` | `0.55` | 0 – 4 | Label height above the model in blocks |
| `scale` | `0.85` | 0.1 – 4 | TextDisplay scale |
| `viewRange` | `32.0` | 4 – 128 | Label tracking range in blocks |
| `billboard` | `"CENTER"` | `CENTER`, `FIXED`, `HORIZONTAL`, `VERTICAL` | Billboard constraint |
| `seeThrough` | `true` | — | Draw the label through blocks |
| `shadow` | `true` | — | Draw the text shadow |
| `background` | `true` | — | Draw the configured full background |
| `backgroundRed` | `0` | 0 – 255 | Background red channel |
| `backgroundGreen` | `0` | 0 – 255 | Background green channel |
| `backgroundBlue` | `0` | 0 – 255 | Background blue channel |
| `backgroundAlpha` | `80` | 0 – 255 | Background alpha channel |

### `filters`

| Key | Default | Meaning |
|---|---|---|
| `disabledWorlds` | `[]` | Case-insensitive world folder names that retain vanilla item rendering |
| `materialBlacklist` | `["BEDROCK", "BARRIER"]` | Case-insensitive material names that retain vanilla item rendering |
| `onlyPlayerDrops` | `false` | Require the item entity to carry a non-null thrower UUID |

### `physics`

| Key | Default | Range | Meaning |
|---|---:|---|---|
| `enabled` | `false` | — | Permit Gloss to modify the authoritative item entity |
| `gravityMultiplier` | `1.0` | 0 – 4 | Gravity scale; `0` clears vertical velocity and gravity while active |
| `bounce` | `0.0` | 0 – 0.9 | Restitution applied from the measured downward impact speed |
| `waterBuoyancy` | `0.0` | 0 – 1 | Additional upward velocity while submerged |
| `waterDrag` | `0.0` | 0 – 1 | Fraction of velocity removed per submerged tick |

### `script`

The optional advanced modifier compiles expression-driven `offset`, `rotation`, `scale`, `glow`, and `visible` outputs. It exposes `phase`, `stateTime`, and `impactSpeed` alongside motion, fluid, material, light, and stack inputs. Script output composes over the typed animation timeline: offsets and rotations add, scales multiply, visibility combines, and a non-zero script glow overrides the timeline glow. Expressions without `index` evaluate once per stack sample; static settled plans are not reevaluated until animation state changes. Scripted offsets remain visual-only and do not move the pickup entity.

### `animation`

`animation.enabled` activates ordered animation profiles. Each profile has an `id`, integer `priority`, material glob list, and clips. Higher priority profiles match first; declaration order resolves equal priority.

Clips specify a `trigger`, `durationTicks`, `loop`, and ordered tracks. Triggers include `SPAWN`, every runtime phase, and `IMPACT`, `BOUNCE`, `ENTER_FLUID`, `EXIT_FLUID`, `START_ROLL`, `SETTLE`, and `WAKE`. Targets are `OFFSET_X/Y/Z`, `ROTATION_X/Y/Z`, `SCALE_X/Y/Z`, `GLOW`, `VISIBLE`, `PHYSICS`, and `LIGHT_LEVEL`. Every track carries scalar keyframes with `tick`, numeric `value`, optional `materialMap`, and `LINEAR`, `HOLD`, `EASE_IN`, `EASE_OUT`, `EASE_IN_OUT`, or `BACK_OUT` easing. `REPLACE` works on every target, `ADD` is valid for offsets and rotations, and `MULTIPLY` is valid for scales.

`materialProperties` is a map of named material maps. Each exact or glob material entry supplies `glow` as numeric ARGB and `lightLevel` from 0 through 15; `GLOW` and `LIGHT_LEVEL` keyframes can name the map and retain their literal value as the fallback. `PHYSICS` values below `0.5` hold the item and preserve its incoming velocity, while values at or above `0.5` release it. `LIGHT_LEVEL` applies display brightness and an air-only temporary light block, capped at eight active lights per chunk and moved no faster than every four ticks.

Real drops use a non-persistent `BlockDisplay` carrier for placeable materials and `ItemDisplay` for true items, with additional models and the label mounted to it. Only the carrier receives position updates. Turning the feature off removes Gloss-owned displays, temporary lights, and restores native item and name visibility. See [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops) for lifecycle, performance, and React bundle integration details.

## `[commands]`

| Key | Default | Meaning |
|---|---|---|
| `sounds` | `true` | Play player command feedback and the coalesced administrator chime after a successful automatic hotload batch. Console senders never get sounds |

## `[debug]`

| Key | Default | Meaning |
|---|---|---|
| `hitbox` | `false` | Render menu hitbox debug outlines for every session |
| `position` | `false` | Render menu position debug markers for every session |
| `animator` | `false` | Log the high-frequency animator's settled interval, target count and send count every 10 seconds |

All three apply the moment the config reloads. See [Components & Hitboxes](/gloss/10-components-hitboxes) and [Holograms](/gloss/04-holograms).

## `[editor]`

| Key | Default | Meaning |
|---|---|---|
| `builderUrl` | `"https://gloss.volmitsoftware.com"` | Base URL of the hosted web editor |

`builderUrl` is sanitized on every load. Gloss trims the value. It then
rejects the value unless it starts with `http://` or `https://`. The
value must also contain no character at or below a space, and none of
`'`, `"`, `<`, `>` or `\`. A rejected value is replaced with the default.
There is no partial repair.

> Both editor hostnames moved off the retired HoloUI names. The builder default is `gloss.volmitsoftware.com`. The sync endpoint default is `sync.gloss.volmitsoftware.com/v2`. If a host is not reachable yet, point `builderUrl` at your own build of the editor.
{.is-info}

## `[editor.sync]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | — | Enable live editor sync sessions through the relay |
| `endpoint` | `"https://sync.gloss.volmitsoftware.com/v2"` | — | Relay endpoint URL |
| `createToken` | `""` | — | Relay session creation token |
| `sessionMinutes` | `60` | 5 – 1440 | Minutes an editor sync session stays alive |
| `pollSeconds` | `3` | 1 – 60 | Seconds between relay polls during an active session |
| `maxProjectMiB` | `8` | 1 – 32 | Maximum editor sync project size in mebibytes |

`endpoint` is sanitized strictly. A value that is not already stripped of surrounding whitespace is rejected outright. Trailing slashes are removed. The URI is normalized. It must then satisfy all of the following, or the default is restored:

- it parses as an absolute URI with a scheme and a host
- no user info, no query string and no fragment
- scheme `https`, or scheme `http` with host `localhost`, `127.0.0.1`, `::1` or `[::1]`
- a path ending in `/v2`, containing none of `//`, `/../` or `/./`
- a rebuilt, lowercase-scheme, lowercase-host form no longer than 1024 characters

The stored value is that rebuilt form. The endpoint you read back may differ in case from what you typed.

`createToken` is sanitized separately. Null or blank stays empty. That is not a problem. Anything else must already be free of surrounding whitespace, be 22 to 128 characters long, and consist only of `A-Z`, `a-z`, `0-9`, `_` and `-`. A value that fails any of those is blanked. Gloss logs `editor.sync.createToken is invalid; live editor session creation will use no token.` Session creation then proceeds untokened. It does not fail.

See [Web Editor & Sync](/gloss/18-web-editor).

## `[preview]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `lookDistance` | `10.0` | 1.0 – 24.0 | Distance in blocks the look-at raycast reaches for container previews |
| `scale` | `0.65` | 0.25 – 4.0 | Base render scale of container previews |

## `[menus]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `uiScale` | `1.0` | 0.25 – 4.0 | Global render scale multiplier for holographic menus and panels |

If you change `scale` or `uiScale`, Gloss invalidates the item provider cache. It then refreshes every open menu session and every live panel on reload.

## `[items]`

| Key | Default | Meaning |
|---|---|---|
| `customItems` | `true` | Enable custom item icons resolved through installed item plugins |
| `customItemProviders` | `[]` | Provider allowlist by provider or plugin name. An empty list allows every provider |

Allowlist entries are trimmed, lowercased and de-duplicated on load. The file shows the normalized form. If you change either key, Gloss reloads the provider registry on the next config reload. See [Custom Items & Item Providers](/gloss/14-custom-items).

## `[playerHeads]`

Settings for JSON `playerHead` menu icons. Profile resolution is asynchronous; it never blocks a
menu tick or performs network work on the calling thread.

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | — | Resolve real player profiles. Off renders every player-head icon as the configured fallback and makes no outbound profile request |
| `cacheMinutes` | `360` | 1 – 10080 | Minutes a resolved profile remains cached |
| `unknownCacheMinutes` | `10` | 1 – 1440 | Minutes a confirmed nonexistent name remains cached |
| `maxCachedProfiles` | `2048` | 16 – 65536 | Settled cache ceiling; expired and nearest-expiry entries are removed first. Size this at least to the number of distinct player heads expected in the active menu and panel working set |
| `unknownFallbackItem` | `"minecraft:skeleton_skull"` | block material id | Block shown for invalid or confirmed-unknown names and while resolution is disabled. An unknown, air or non-block material falls back to `minecraft:skeleton_skull` |

Names must be 1–16 ASCII letters, digits or underscores. An invalid name or unresolved placeholder
uses the fallback without starting a request. The first render of a fresh valid name is an unowned
player head while the lookup runs; a later icon refresh applies the resolved texture. Confirmed
misses use `unknownCacheMinutes`; transient failures and an overloaded resolution queue retry after
one minute.

An online player is resolved directly from the live Bukkit profile without an outbound update.
Offline lookups have a 15-second timeout, at most 16 run concurrently, and at most 1024 wait in the
queue. In-flight cache entries are shared by all viewers and are not evicted, so the map may briefly
exceed `maxCachedProfiles`; completion immediately evicts settled entries back to the ceiling.
Changing any value in this section replaces the profile service and clears its cache. See
[Icons](/gloss/11-icons) for the authored icon contract.

## `[integration]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `sampleIntervalTicks` | `20` | 1 – 200 | Ticks between samples of the metrics other Volmit plugins publish, for `\|metric.<key>\|` text tokens and preview metric variables |

The integration bridge only samples metric keys something has asked for. This interval costs nothing on a server whose content never mentions a metric. If you change it, Gloss restarts the sampler on the next config reload. See [Expressions & Placeholders](/gloss/13-expressions-placeholders) for the tokens and variables it feeds. See [Runtime Architecture](/gloss/20-runtime-architecture) for how discovery works.

## What is no longer in configuration

`config.yml` does not exist. Pre-merger Gloss used it. `/gloss import legacy` now migrates and retires the file. It overlays the mechanical keys onto `config.toml`. It moves the content keys into the JSON documents. It renames the original to `config.yml.imported`. The old HoloUi `settings.json` is overlaid the same way. Gloss does not read it as a live file.

Three groups of settings moved out of configuration. They are now content documents:

| Was a config key | Now lives in | Documented on |
|---|---|---|
| `tablist.header`, `tablist.footer`, `tablist.use-header-footers`, `tablist.group-list-names` | `tablist.json` | [Tablist & Server List MOTD](/gloss/06-tablist-motd) |
| `motd.texts` | `motd.json` | [Tablist & Server List MOTD](/gloss/06-tablist-motd) |
| `chat-bubbles.message.*`, `word-wrap-break-chars`, `max-time-alive`, `follow-players`, `hide-own-messages` | `bubbles/<id>.json` | [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops) |

The `groups/` YAML directory is retired as well. Group membership is resolved live through Vault. Per-group tablist names and default boards are now fields inside `tablist.json` and each board document.

The former `line-stagger-ticks` and `fly-away` switches have no direct schema-2 keys. One wrapped message is now one multiline entity, and translation, scale, rotation and opacity are authored as BubbleStyle motion expressions. During one-time legacy `config.yml` import, line stagger is discarded; fly-away on keeps the shipped late-fly motion, while off writes identity motion. Prefix, offset, wrap, lifetime, follow and hide still map directly.
