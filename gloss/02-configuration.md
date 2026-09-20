---
title: "Configuration"
description: "Configure Gloss features, rendering, editor sync, previews, and integrations"
published: true
date: 2026-09-20T02:20:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

Feature switches and general settings live in `plugins/Gloss/gloss.toml`. JSON documents hold content such as tablist text, MOTD lines, bubble styles, damage indicators, and real drops. See [Data Files & Hot Reload](/gloss/03-data-files).

## The file model

`gloss.toml` documents each setting above its value:

```toml
# Configuration - gloss
# This file is canonicalized on load; comments and new keys may update automatically.
#
# Gloss runtime configuration. Every knob is emitted with a comment, values outside their documented range are clamped back on load, and edits hot-reload while the server runs.

# Server-wide locale used for in-game text. Blank values fall back to en_US; edit messages in languages/<locale>.toml.
language = "en_US"
# Sends anonymous bStats usage metrics.
metrics = true
# Prints the Gloss splash screen during startup.
splashScreen = true
```

Each key has a comment. Changes reload automatically, and invalid changes leave the current settings active. Settings marked restart-only still require a restart.

## Root keys

| Key | Default | Notes |
|---|---|---|
| `language` | `"en_US"` | Server default for players without a personal override. Official translations download when selected; custom IDs use their local file with English fallback. Blank values become `en_US`. Select defaults or player overrides with `/gloss language` |
| `metrics` | `true` | Send anonymous bStats usage metrics |
| `splashScreen` | `true` | Print the console splash banner during startup. `false` suppresses it for clean startups. A failed enable always prints it |

> Set `metrics = false` to disable anonymous bStats reporting.
{.is-info}

## `[features]`

These keys enable or disable each feature. Most document-backed features still load and can be edited
while disabled. `emoji` and `animations` can restart on reload. Enabling `panels` or `previews` after
startup requires a server restart.

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
| `connections` | `false` | Join and leave messages from `connections.json` |
| `particles` | `true` | Viewer-targeted particle layers on supported in-world renders |

`motd` and `connections` are the only features disabled by default.

Gloss extracts bundled documents only for enabled features. Enabling most features later extracts their
defaults on reload; previews require the restart noted above. See [Getting Started](/gloss/01-getting-started).

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
| `perViewerPlaceholders` | `true` | Not applicable | Render complete placeholder, function and expression tokens per viewing player instead of once globally |
| `temporaryUpdateIntervalTicks` | `2` | 1 – 20 | Ticks between refreshes of temporary holograms (bubbles, indicators, entity overlays, drop labels, and API temporaries) |
| `interpolatedMotion` | `true` | Not applicable | Smooths moving temporary holograms between drive ticks via display teleport interpolation and smooths BubbleStyle scale/rotation through display transformation interpolation, using durations matched to `temporaryUpdateIntervalTicks`. It does not reduce the update rate. Unsupported interpolation controls fall back to immediate updates |
| `highFrequencyAnimations` | `true` | Not applicable | Drive animation clips faster than 20 fps from the dedicated `Gloss Animator` thread with sub-tick packet updates. Off restores the tick-bounded behavior exactly |
| `maxAnimationFps` | `120` | 1 – 240 | Frame-rate ceiling of the high-frequency animator loop. Sets its adaptive floor to `1000 / fps` ms (at least 4 ms) |
| `animationPacketBudget` | `20000` | 100 – 1000000 | Hologram text-metadata recipients per second, shared by animated targets, personalized updates and personalized clears. Large aggregate audiences degrade animation frame rate proportionally |

A non-finite `stackDistance` or `viewRange` falls back to its default. A finite value outside its documented range is clamped. See [Holograms](/gloss/04-holograms).

## `[particles]`

These ceilings are shared by particle layers on holograms, temporary holograms, bubbles, indicators, menus, panels, previews and dropped-item presentations. See [Particle Layers](/gloss/25-particle-layers) for the document format.

| Key | Default | Range | Meaning |
|---|---:|---:|---|
| `viewRange` | `48.0` | 4.0 – 128.0 | Independent maximum distance in blocks between a viewer and a particle-layer origin |
| `samplesPerViewerPerTick` | `128` | 1 – 4096 | Particle points admitted for one viewer during one tick |
| `samplesPerTick` | `4096` | 16 – 65536 | Particle points admitted server-wide during one tick |
| `maxCachedSamplesPerLayer` | `512` | 4 – 4096 | Maximum local geometry points sampled for one layer |

`[features] particles = false` stops every product particle layer without changing its source document. Layer geometry, cadence and particle type remain in each owning JSON document or API object.

## `[boards]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `updateIntervalTicks` | `20` | 1 – 200 | Ticks between ordinary scoreboard condition evaluation and refreshes; active clock-driven boards automatically use a separate every-tick driver |

## `[tablist]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `updateIntervalTicks` | `40` | 1 – 400 | Ticks between ordinary tablist condition evaluation and refreshes. Animated header/footer text samples all recipients every tick; animated selected list-name formats and API overrides fast-tick only their players |

The conditional header, footer and list-name presentations are not here. They are in schema-2 `tablist.json`. See [Tablist](/gloss/06-tablist).

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

Bubble wrapping, appearance, lifetime, conditional selection, expression-driven motion and particle layers are per-style, in schema-5 `bubbles/<id>.json`. See [Chat Bubbles](/gloss/08-chat-bubbles).

## `damage-indicators/default.json`

Nearby persistent health bars use the separate schema-2 `entity-overlays/default.json` document. They are enabled by default and have their own `enabled` switch. See [Entity Overlays](/gloss/20-entity-overlays) for range, segments, names, hit feedback, React counts, and Adapt Insight settings.

Damage-indicator settings live in `plugins/Gloss/damage-indicators/default.json`. The schema-4 file
contains `limits`, `damage`, `healing`, and `audience`, reloads automatically, and is available in the
web editor.

### `limits`

| Key | Default | Range | Meaning |
|---|---:|---|---|
| `maxPerSecond` | `40` | 1 – 1000 | Indicators admitted by the server-wide sliding one-second window |
| `lifetimeMs` | `3000` | 250 – 30000 | Lifetime of each indicator in milliseconds |
| `minimumDelta` | `0.009` | 0 – 1000 | Applied health delta at or below which no indicator is spawned |
| `decimals` | `0` | 0 – 4 | Decimal places used for the `{amount}` value |

The live-indicator admission limit is derived from `maxPerSecond * lifetimeMs / 1000`, rounded up
to a whole indicator, and hard-capped at 2,048. The defaults admit 120 simultaneous indicators.
Once full, Gloss drops new indicators until an existing one expires or is destroyed.

### `damage` and `healing`

Both blocks have the same shape: a base `when`, a complete base `presentation`, and complete
conditional `variants`. A false base condition disables that event type. Otherwise the matching
variant with the greatest priority wins, equal priorities sort by lexical id, and no variant match
uses the base presentation. `presentation.format` is rendered by the Gloss text pipeline after
`{amount}` is replaced, and `presentation.offset` is an `[x, y, z]` block-space vector from the
affected entity.

| Key | Damage default | Healing default | Meaning |
|---|---|---|---|
| `when` | `"true"` | `"true"` | Condition that gates this event type |
| `presentation.format` | `"&c&l{amount}"` | `"&a&l{amount}"` | Configured indicator text; optional `{amount}` inserts the formatted health delta |
| `presentation.offset` | `[0, 0.7, 0]` | `[0, -0.1, 0]` | Spawn offset from the entity; each finite component is clamped to -32 – 32 |
| `variants` | `[]` | `[]` | Complete presentations selected by `priority` and `when` |

Each presentation accepts the shared `style` and `box` objects for display settings and decorations. Motion scale and opacity multiply those authored settings. See [Display styling](/gloss/08b-damage-indicators).

Each presentation also carries `motion`:

| Key | Damage default | Healing default | Range | Meaning |
|---|---:|---:|---|---|
| `horizontalSpeed` | `0.8` | `0.45` | 0 – 16 blocks/second | Random horizontal launch speed |
| `verticalSpeed` | `1.3` | `0.65` | -16 – 16 blocks/second | Initial vertical speed |
| `verticalAcceleration` | `-0.93` | `0.05` | -32 – 32 blocks/second² | Constant vertical acceleration |
| `spinDegreesPerSecond` | `0` | `0` | -1440 – 1440 | Constant display spin |

Position and spin use elapsed time, independent of the temporary-hologram refresh interval.

Each presentation also carries `transform`:

| Key | Damage default | Healing default | Range | Meaning |
|---|---:|---:|---|---|
| `startScale` | `1` | `1` | 0 – 16 | Scale at spawn |
| `endScale` | `0.82` | `1.1` | 0 – 16 | Scale at expiry |
| `fadeStartFraction` | `0.68` | `0.62` | 0 – 1 | Normalized lifetime fraction at which opacity begins falling toward zero |

### `audience`

| Key | Default | Meaning |
|---|---|---|
| `when` | `"hasPermission('viewer', 'gloss.indicators.show')"` | Per-viewer visibility condition |

Damage conditions can use applied-delta event values plus immutable affected-entity and direct-damager snapshots. Audience conditions use a live viewer. World filters, permissions, groups, regions, PlaceholderAPI values and React samplers all use the shared language in [Expressions & Placeholders](/gloss/13-expressions-placeholders).

## `[drops]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `show` | `"true"` | Boolean or expression string | Per-viewer label visibility; accepts `show = false` or `show = "world.time > 12000"`. Gloss normalizes it to a quoted expression string. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions) |
| `nameFormat` | `"&7{count}x {type}"` | Not applicable | Name format for dropped stacks. `{count}` and `{type}` are replaced. A null value restores the default |
| `bundleFormat` | `"&7Bundle &8(&7{total} items&8): &7{contents}"` | Not applicable | Name format for a dropped bundle carrying stacks. `{total}` and `{contents}` are replaced. A null value restores the default. An empty bundle falls back to `nameFormat` |
| `bundleEntryLimit` | `3` | 1 – 10 | Bundle content entries listed before the rest collapse into a `+N more` suffix |
| `bundleVerticalLabels` | `true` | Not applicable | Use one multiline TextDisplay for bundle labels while real drops are active |
| `bundleHeaderFormat` | `"&eBundle &8(&e{total} items&8)"` | Not applicable | First vertical bundle line; `{total}` is replaced |
| `bundleEntryFormat` | `"&7- &f{count}x {type}"` | Not applicable | One vertical line per material; `{count}` and `{type}` are replaced |
| `bundleMoreFormat` | `"&8+{remaining} more"` | Not applicable | Final line for hidden material types; `{remaining}` is replaced |
| `preserveCustomNames` | `true` | Not applicable | Leave custom names other plugins already set on dropped item entities untouched. Gloss tracks its own labels with a persistent data key |
| `useItemDisplayNames` | `false` | Not applicable | Opt in to using an item's display name from its item meta as `{type}` instead of the pretty material name |

## `real-drops/default.json`

Real Drops settings live in `plugins/Gloss/real-drops/default.json`, a schema-4 file with a base
`presentation`, conditional `variants` and an `audience.when`. It reloads automatically and opens
in the web editor with `/gloss web edit real-drops default`.

Every key, default and range is on [Drop Labels](/gloss/08c-drop-labels#real-drops).

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

`builderUrl` must begin with `http://` or `https://` and cannot contain spaces or unsafe URL
characters. Invalid values reset to the default.

## `[editor.sync]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | Not applicable | Enable live editor sync sessions through the relay |
| `endpoint` | `"https://sync.gloss.volmitsoftware.com/v3"` | Not applicable | Relay endpoint URL |
| `createToken` | `""` | Not applicable | Relay session creation token |
| `sessionMinutes` | `60` | 5 – 1440 | Minutes an editor sync session stays alive |
| `pollSeconds` | `3` | 1 – 60 | Seconds between relay polls during an active session |
| `maxProjectMiB` | `8` | 1 – 32 | Maximum editor sync project size in mebibytes |

`endpoint` must satisfy all of these rules. Invalid values reset to the default:

- it parses as an absolute URI with a scheme and a host
- no user info, no query string and no fragment
- scheme `https`, or scheme `http` with host `localhost`, `127.0.0.1`, `::1` or `[::1]`
- a path ending in `/v3`, containing none of `//`, `/../` or `/./`
- a rebuilt, lowercase-scheme, lowercase-host form no longer than 1024 characters

Gloss normalizes the scheme, host, and trailing slash before storing the endpoint.

`createToken` is sanitized separately. Null or blank stays empty. Anything else must already be free of surrounding whitespace, be 22 to 128 characters long, and consist only of `A-Z`, `a-z`, `0-9`, `_` and `-`. A value that fails any of those is blanked. Gloss logs `editor.sync.createToken is invalid; live editor session creation will use no token.` A custom relay that admits anonymous creation receives the untokened request. The official endpoint instead refuses session creation locally and tells the command sender to configure `[editor.sync] createToken`.

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

Gloss trims, lowercases, and removes duplicate allowlist entries. Changes apply on the next config
reload. See [Custom Items & Item Providers](/gloss/14-custom-items).

## `[playerHeads]`

Settings for JSON `playerHead` menu icons. Profile lookups run asynchronously.

| Key | Default | Range | Meaning |
|---|---|---|---|
| `enabled` | `true` | Not applicable | Resolve real player profiles. Off renders every player-head icon as the configured fallback and makes no outbound profile request |
| `cacheMinutes` | `360` | 1 – 10080 | Minutes a resolved profile remains cached |
| `unknownCacheMinutes` | `10` | 1 – 1440 | Minutes a confirmed nonexistent name remains cached |
| `maxCachedProfiles` | `2048` | 16 – 65536 | Settled cache ceiling; expired and nearest-expiry entries are removed first. Size this at least to the number of distinct player heads expected in the active menu and panel working set |
| `unknownFallbackItem` | `"minecraft:skeleton_skull"` | block material id | Block shown for invalid or confirmed-unknown names and while resolution is disabled. An unknown, air or non-block material falls back to `minecraft:skeleton_skull` |

Names must be 1–16 ASCII letters, digits or underscores. An invalid name or unresolved placeholder
uses the fallback without starting a request. The first render of a fresh valid name is an unowned
player head while the lookup runs; a later icon refresh applies the resolved texture. Confirmed
misses use `unknownCacheMinutes`; transient failures and an overloaded resolution queue retry after
one minute.

Online profiles update immediately. Offline lookups time out after 15 seconds.

## `[integration]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `sampleIntervalTicks` | `20` | 1 – 200 | Ticks between samples of the metrics other Volmit plugins publish, for `\|metric.<key>\|` text tokens and preview metric variables |

The integration bridge only samples metric keys used by loaded content. Changes apply on the next config reload. See [Expressions & Placeholders](/gloss/13-expressions-placeholders) for its tokens and variables.

## What is no longer in configuration

Gloss no longer reads `config.yml` or HoloUi `settings.json` as live configuration. Use
`/gloss import legacy` to copy supported settings, bubble content, and MOTD content into current files.

Three groups of settings moved out of configuration. They are now content documents:

| Was a config key | Now lives in | Documented on |
|---|---|---|
| `tablist.header`, `tablist.footer`, `tablist.use-header-footers`, `tablist.group-list-names` | `tablist.json` | [Tablist](/gloss/06-tablist) |
| `motd.texts` | `motd.json` | [Tablist](/gloss/06-tablist) |
| `chat-bubbles.message.*`, `word-wrap-break-chars`, `max-time-alive`, `follow-players`, `hide-own-messages` | `bubbles/<id>.json` | [Chat Bubbles](/gloss/08-chat-bubbles) |

The `groups/` YAML directory is retired as well. Group membership is resolved live through Vault. Board schema 2 and tablist schema 2 express group-dependent behavior as ordinary conditions; `/gloss import legacy` does not convert old boards, groups or tablist formats.

A bubble document renders one wrapped message as one multiline entity; translation, scale, rotation and opacity use its motion expressions. Supported prefix, offset, wrap, lifetime, follow and hide values can be imported into the current default document.

## Glyph pack format

Set `[forge].packFormat` to `0` to select the resource-pack format for the running server: `84` on Minecraft 26.1.2, `88` on 26.2, and `97` on 26.3. A positive value overrides this selection. Generated packs use `min_format` and `max_format` for format 65 or newer; an integer upper bound accepts all minor versions within that major format, including 26.3's format 97.1.
