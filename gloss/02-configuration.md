---
title: "Configuration"
description: "Configure Gloss features, rendering, editor sync, previews, and integrations"
published: true
date: 2026-10-07T15:46:35Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

Feature switches and general settings live in `plugins/Gloss/gloss.toml`. JSON documents hold content such as tablist text, MOTD lines, bubble styles, damage indicators, and real drops. See [Data Files & Hot Reload](/gloss/03-data-files).

A valid save reloads. Invalid TOML keeps the current settings. A startup load rewrites the file and drops custom comments. Values outside their range are clamped. Settings marked restart-only still need a restart.

## Root keys

| Key | Default | Notes |
|---|---|---|
| `language` | `"en_US"` | Server default for players without a personal override. Official translations download when selected; custom IDs use their local file with English fallback. Blank values become `en_US`. Select defaults or player overrides with `/gloss language` |
| `metrics` | `true` | Send anonymous bStats usage metrics |
| `splashScreen` | `true` | Console banner. A failed enable still prints it |

## Markers and moving anchors

`[markers]` sets world-marker limits and the moving-anchor samples shared with native waypoints.

| Key | Default | Meaning |
| --- | --- | --- |
| `maxPerViewer` | `12` | Nearest world markers retained per viewer, 1–64 |
| `viewRange` | `256` | Maximum world-marker distance in blocks, 16–1024 |
| `anchorSnapshotTicks` | `2` | Minimum interval between location captures on the followed entity's owner, 1–1200 ticks |
| `anchorMaxAgeTicks` | `100` | Maximum sample age while waiting for a capture, from `anchorSnapshotTicks` to 12000 ticks |
| `anchorCacheEntries` | `4096` | Maximum cached moving anchors shared across viewers, 16–65536 |

Following anchors appear after their first location capture. Missing, retired, or expired anchors hide until a fresh capture succeeds. Fixed anchors do not use the sample cache.

`[waypoints]` controls native locator-bar updates independently of world-marker entities.

| Key | Default | Meaning |
| --- | --- | --- |
| `maxPerViewer` | `16` | Nearest native waypoints retained per viewer, 1–64 |
| `refreshTicks` | `20` | Update interval, 1–1200 ticks |
| `positionThreshold` | `1.0` | Movement in blocks required before sending a new position, 0–64; native positions use whole blocks |
| `azimuthThreshold` | `0.017` | Bearing change in radians required before sending a new direction, 0–π |

Changing color, style, or exact-position/bearing mode always updates the entry. Pending transport failures retain the previous sent state and retry on the next refresh.


## Sky operations

`[sky]` controls per-viewer time, weather, and world-border updates. Sky actions are serialized per viewer; player changes occur after recovery state is saved. Restoration has a reserved path even when new-claim capacity is exhausted.

| Key | Default | Range and meaning |
| --- | --- | --- |
| `fadeIntervalTicks` | `2` | `1`–`200`; ticks between fade updates |
| `maxPendingPerViewer` | `64` | `1`–`1024`; queued claims/releases for one viewer; excess requests are refused |
| `maxPendingOperations` | `1024` | `16`–`65536`; queued claims/releases across viewers; cleanup requests have separate reserved admission |

Claims and releases keep their submission order. A refused owner task remains pending for retry; shutdown leaves a recovery record when restoration cannot run. The persistence-worker queue is created at plugin startup, so restart after increasing `maxPendingOperations` to raise that queue's physical capacity.

## Image preparation

`[images]` controls local assets under `images/`. Menu icons show a checkerboard while an asset prepares and refresh when it is ready. Image changes invalidate the affected asset; changed limits apply to subsequent preparation. MOTD icons still require a 64 by 64 PNG regardless of these limits.

| Key | Default | Range and meaning |
| --- | --- | --- |
| `maxFileBytes` | `16777216` | `1024`–`268435456`; maximum encoded source bytes |
| `maxPixels` | `16777216` | `256`–`67108864`; maximum source width multiplied by height |
| `maxDimension` | `4096` | `16`–`8192`; maximum source width or height |
| `rasterMaxDimension` | `16` | `1`–`128`; maximum width and height for text raster icons |
| `cacheBytes` | `67108864` | `1048576`–`1073741824`; maximum estimated retained preparation weight; least recently used entries are evicted |
| `maxEntries` | `256` | `1`–`4096`; maximum retained asset results, including refused files |
| `maxPending` | `128` | `1`–`4096`; maximum pending preparation jobs, with a separate equally bounded retry set |
| `workerThreads` | `1` | `1`–`4`; concurrent preparation workers; restart to change |

`cacheBytes` limits retained preparation results, not total JVM memory. Active menu sessions retain the rows they display, and each worker temporarily holds a bounded encoded source and decoded image. An asset whose prepared weight exceeds the cache limit is refused. Larger rasters still consume one display entity per row and obey the visibility limits.

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
| `nametags` | `false` | Permission-selected prefixes, name colors, and suffixes from `nametags/` |
| `nameplates` | `false` | Holographic player nameplates from `nameplates/` |
| `channels` | `false` | Chat channel formats, mentions, and notification sounds from `channels/` |

`motd`, `connections`, `nametags`, `nameplates`, and `channels` default to disabled.

Gloss extracts bundled documents only for enabled features. Enabling most features later extracts their
defaults on reload; previews require the restart noted above. See [Getting Started](/gloss/01-getting-started).

## `[hotload]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `watchIntervalTicks` | `5` | 1 – 200 | Ticks between polls of every watched file and folder. Changing it restarts the watchdog on reload |

## `[holograms]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `viewRange` | `48.0` | 4.0 – 128.0 | Default range for temporary API holograms; persistent documents use their own `viewDistance` |
| `perViewerPlaceholders` | `true` | Not applicable | Render complete placeholder, function and expression tokens per viewing player instead of once globally |
| `temporaryUpdateIntervalTicks` | `2` | 1 – 20 | Ticks between refreshes of temporary holograms (bubbles, indicators, entity overlays, drop labels, and API temporaries) |
| `interpolatedMotion` | `true` | Not applicable | Smooths moving temporary holograms between drive ticks via display teleport interpolation and smooths BubbleStyle scale/rotation through display transformation interpolation, using durations matched to `temporaryUpdateIntervalTicks`. It does not reduce the update rate. Unsupported interpolation controls fall back to immediate updates |
| `highFrequencyAnimations` | `true` | Not applicable | Drive animation clips faster than 20 fps from the dedicated `Gloss Animator` thread with sub-tick packet updates. Off restores the tick-bounded behavior exactly |
| `maxAnimationFps` | `120` | 1 – 240 | Frame-rate ceiling of the high-frequency animator loop. Sets its adaptive floor to `1000 / fps` ms (at least 4 ms) |
| `animationPacketBudget` | `20000` | 100 – 1000000 | Hologram text-metadata recipients per second, shared by animated targets, personalized updates and personalized clears. Large aggregate audiences degrade animation frame rate proportionally |

A non-finite `viewRange` falls back to its default. A finite value outside its documented range is clamped. See [Holograms](/gloss/04-holograms).

## `[imports]`

Legacy Gloss, HoloUi, FeatherBoard, AnimatedScoreboard and TAB header/footer previews capture these limits when prepared. Applying uses the captured source and destination contents; changing these settings requires a new preview.

| Key | Default | Range | Meaning |
|---|---:|---:|---|
| `maxFileBytes` | `16777216` | 1024 – 268435456 | Maximum bytes in one source file or observed destination |
| `maxPreviewBytes` | `134217728` | `maxFileBytes` – 1073741824 | Maximum retained source and staged replacement bytes in one preview |
| `maxFiles` | `4096` | 1 – 65536 | Maximum source and destination paths retained by one preview, including missing destinations |
| `previewLifetimeSeconds` | `600` | 1 – 86400 | Reviewed preview lifetime; captured when the preview becomes available |
| `maxPreparedPreviews` | `8` | 1 – 1024 | Maximum reviewed previews across all senders and supported document import formats |
| `maxCachedBytes` | `268435456` | `maxPreviewBytes` – 1073741824 | Maximum retained source and staged bytes across reviewed previews |

A preview that exceeds a limit cannot apply. All current project documents count toward whole-project validation, and staged replacements count separately from their original bytes. Converted documents use the resulting preset catalog regardless of staging order. When the reviewed-preview cache is full, a new preview is refused without evicting another sender’s reviewed content. Applying, expiry or shutdown releases its cached data; idle previews expire without another command.

## `[visibility]`

These reloadable limits govern display copies visible to players across holograms, menus, panels, previews, markers, beams, interaction hitboxes and dropped-item cosmetics. Each entity shown to each viewer consumes one unit. A complete menu, image or preview group must fit before it appears; required interaction targets follow its admission.

| Key | Default | Range | Meaning |
|---|---:|---:|---|
| `perServer` | `65536` | 1 – 10000000 | Total visible entity copies across all viewers and surfaces |
| `perViewer` | `1024` | 1 – 1000000 | Visible entity copies for one viewer |
| `admission` | `reject` | `reject`, `fifo` | Immediate retries or ordered turns for waiting viewer/surface pairs |
| `maxPending` | `4096` | 1 – 65536 | Maximum waiting viewer/surface pairs in FIFO mode |
| `queueTimeoutTicks` | `100` | 1 – 72000 | Turn lifetime measured from the first refusal; retries do not extend it |

`[visibility.defaults]` supplies the policy for each surface. Add `[[visibility.surfaces]]` with a unique `surface` name and a `[visibility.surfaces.limits]` table to override it.

Surface names are `hologram`, `panel`, `menu`, `preview`, `bubble`, `indicator`, `drop`, `overlay`, `particle`, `marker`, `nameplate`, `waypoint`, and `surface`. Beam and hitbox handles use their owning feature's surface.

| Policy key | Default | Range | Meaning |
|---|---:|---:|---|
| `perServer` | `16384` | 1 – 10000000 | Copies from this surface across all viewers |
| `perViewer` | `512` | 1 – 1000000 | Copies from this surface for one viewer |
| `reservedPerViewer` | `0` | 0 – surface `perViewer` | Viewer capacity kept available to this surface; all reservations together must fit the global viewer limit |
| `reservedPerServer` | `0` | 0 – surface `perServer` | Server capacity kept available to this surface; all reservations together must fit the global server limit |
| `fullDistance` | `32` | 0 – 1000000 | Maximum distance in blocks for full detail |
| `reducedDistance` | `64` | `fullDistance` – 1000000 | Maximum distance for reduced detail; farther admitted displays use minimal detail |
| `cullDistance` | `128` | `reducedDistance` – 1000000 | Maximum governed visibility distance |

Reduced detail suppresses optional particles, boxes, and marker beams and edges. Minimal detail also suppresses marker icons. Distances beyond `cullDistance` hide the governed group. A group that exceeds capacity stays hidden and retries on its feature's next refresh; growth that no longer fits removes its visible copy. A refused dropped-item cosmetic leaves the actual vanilla item visible and preserves pickup and physics.

In `fifo` mode, a refused viewer/surface pair receives one waiting turn. New admissions and growth wait until that pair succeeds or its turn expires; current displays remain visible. A blocked first turn can leave capacity unused until it expires. An expired request may retry at the end of the queue. A full queue refuses additional turns. Shrinking or removing displays always returns capacity, including after lower limits are reloaded. Cleanup does not join the admission queue.

`/gloss status` reports current governed entity copies, viewers holding allocations, cumulative admissions and refusals, waiting pairs, expired turns, and groups awaiting cleanup. Refusals count admission attempts, including retries. Capacity stays reserved until cleanup succeeds or the viewer disconnects.

## `[particles]`

These ceilings are shared by particle layers on holograms, temporary holograms, bubbles, indicators, menus, panels, previews and dropped-item presentations. See [Particle Layers](/gloss/25-particle-layers) for the document format.

| Key | Default | Range | Meaning |
|---|---:|---:|---|
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
| `snapshotReadLimit` | `4096` | 16 – 65536 | Maximum distinct captured field and provider values per player for tablist conditions and text |

The conditional header, footer and list-name presentations are not here. They are in schema-2 `tablist.json`. See [Tablist](/gloss/06-tablist).

## `[motd]`

`snapshotRefreshTicks` controls how often server-list text and server-state snapshots are prepared. The default is 20 ticks; values are clamped to 1–1200. Entry selection, icons, player-count policy and pause-menu links are defined in `motd.json`.

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
| `viewRange` | `48` | 4 – 128 | Maximum indicator viewing distance in blocks |
| `debounceMs` | `150` | 0 – 60000 | Coalescing delay in milliseconds |

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

## `real-drops/default.json`

Real Drops settings live in `plugins/Gloss/real-drops/default.json`, a schema-4 file with a base
`presentation`, conditional `variants` and an `audience.when`. It reloads automatically and opens
in the web editor with `/gloss web edit real-drops default`.

It also holds the drop label text: `presentation.labels.format`, per-material `names`, `useItemDisplayNames`, `show`, `preserveCustomNames`, and the `bundle` formats. Every key, default and range is on [Drop Labels](/gloss/08c-drop-labels#real-drops).

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

## `[menus]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `uiScale` | `1.0` | 0.25 – 4.0 | Global render scale multiplier for holographic menus and panels |

If you change `uiScale`, Gloss invalidates the item provider cache. It then refreshes every open menu session and every live panel on reload.

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
| `maxSampleAgeMs` | `5000` | 0 – 86400000 | Maximum age of a provider's sample; zero disables timestamp expiry |
| `retainUnavailableMs` | `0` | 0 – 86400000 | Retain the last successful value for this many milliseconds after its last successful collection when a provider becomes unavailable; zero clears it immediately |
| `errorRetryTicks` | `100` | 1 – 12000 | Delay before retrying a provider that throws during sampling |
| `unavailableText` | `""` | Up to 1024 characters | Text for a registered metric without an available value; numeric expressions and preview variables remain absent |

The integration bridge only samples metric keys used by loaded content. Retention also obeys `maxSampleAgeMs`; an expired sample cannot be retained. Changes apply on the next config reload and clear cached values until the next sample. See [Expressions & Placeholders](/gloss/13-expressions-placeholders) for its tokens and variables.

Tablist text is `tablist.json`. MOTD lines are `motd.json`. Bubble layout is `bubbles/<id>.json`. Group conditions use Vault and the document `select` rules. `/gloss import legacy mode=preview` previews supported older settings and content; `/gloss import legacy mode=apply` publishes the validated conversion.

## `[nametags]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `refreshIntervalTicks` | `20` | `1` to `200` | Ticks between overhead nametag selection and permission refreshes |
| `snapshotReadLimit` | `4096` | `16` to `65536` | Maximum distinct captured field and provider values per player used by nametag conditions and text |
| `viewerRange` | `64.0` | `1.0` to `512.0` | Maximum distance in blocks for viewer-dependent nametags |
| `maxSubjectsPerViewer` | `32` | `1` to `10000` | Maximum nearest subjects considered for viewer-dependent nametags |

Assignments, priorities, and styles are in [nametag documents](/gloss/20-entity-overlays#permission-selected-nametags). Each other text surface uses its own refresh cadence.


## `[nameplates]`

| Key | Default | Meaning |
|---|---|---|
| `viewerRange` | `0.0` | Nameplate radius in blocks, `0` to `64`; `0` inherits the entity-overlay document’s `range` |
| `maxSubjectsPerViewer` | `0` | Nearest player subjects per viewer, `0` to `256`; `0` shares the entity-overlay document’s population limit |
| `refreshIntervalTicks` | `0` | Nameplate update interval, `0` to `200`; `0` inherits the entity-overlay document’s interval |

An explicit nameplate population limit is separate from the mob overlay limit. The entity-overlay document’s `maxActiveOverlays` and the visibility governor still bound combined display admission. Nameplate documents configure health segments, relationship colors, and wearer visibility in their `presentation`.

## `[teams]`

Nametags, player nameplates, mob-label suppression and colored glow share one team per viewer and entry. Minecraft permits an entry to belong to only one team.

| Key | Default | Values and meaning |
|---|---|---|
| `foreignPolicy` | `"yield"` | `yield` keeps an observed external team's membership; `override` assigns the Gloss team and restores observed external membership when Gloss releases the entry |
| `visibilityPolicy` | `"intersection"` | `intersection` combines all visibility restrictions; `priority` uses the strongest layer's visibility rule |
| `collisionPolicy` | `"intersection"` | `intersection` combines all collision restrictions; `priority` uses the strongest layer's collision rule |
| `whiteIsUnspecified` | `true` | Allows a lower-priority nonwhite color when the stronger layer requests white |
| `layerPriorities` | `glow = 3`, `nameplate = 2`, `entity-overlay = 2`, `nametag = 1` | Purpose-to-priority map; values clamp to -1000000..1000000 and unknown purposes use zero |

Higher priorities win, with purpose names breaking ties alphabetically. Prefix and suffix each use the strongest nonempty value. Under `intersection`, opposing own-team and other-team restrictions combine to `never`. Under `yield`, an external team can prevent Gloss prefixes, glow colors, or vanilla-label suppression from appearing until it releases that entry. Use `override` only when Gloss should control these client fields. Team names beginning `gls_t_` are reserved for Gloss. External membership is learned from team packets observed while Gloss is enabled.

## `[glow]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `sweepIntervalTicks` | `20` | 1–200 | Time between expiry and configured distance checks |
| `viewerRange` | `0` | 0–512 | Maximum distance in blocks; zero imposes no distance limit |
| `maxTargetsPerViewer` | `1024` | 1–65536 | Maximum distinct tagged targets per viewer; further requests fail explicitly |

A distance-hidden tag remains assigned and reappears when the target returns in range before its lifetime expires. Expiry checks do not change a target's natural server-wide glow. Disabling the glow feature releases all Gloss glow claims.
