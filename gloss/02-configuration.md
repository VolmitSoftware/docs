---
title: "Configuration"
description: "Gloss documentation: Configuration"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---

Every runtime setting lives in `plugins/Gloss/config.toml`. Gloss generates the file with a comment above each knob. It rewrites the file on load so the values on disk are the values in effect. It watches the file while the server runs. A save reloads Gloss. Content such as tablist text, MOTD lines and bubble styling is not in this file. That content lives in JSON documents. See [Data Files & Hot Reload](/gloss/03-data-files).

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

**Canonicalization.** Every load parses the file, normalizes it, re-serialises it, and writes it back when the result differs from the disk file. That is how out-of-range numbers get clamped into the file. That is how missing keys reappear. That is how comments regenerate after an upgrade. What you read back is what Gloss uses.

**Hot reload.** The same watchdog that polls the data folders also polls `config.toml` at `[hotload] watchIntervalTicks`. When the file timestamp and size change, Gloss reads the file again and reloads every service in place. A hash guard suppresses Gloss canonicalization writes. A rewrite does not loop into another reload.

**Failure behavior differs between boot and reload.**

- At startup, Gloss replaces an unreadable or invalid `config.toml` with a fresh default file. A warning names the reason. Enable continues.
- On hot reload and on `/gloss reload`, Gloss refuses an invalid file. Gloss logs `config.toml is invalid; keeping the last good configuration.` Nothing changes. The previously loaded configuration stays live. No service is touched.

A file larger than 2 MiB is treated as invalid. Gloss does not parse it.

**`/gloss reload`** (permission `gloss.admin`) reads the file again and reloads services exactly as the watcher does. Use it when you want the reload at once rather than within the next poll.

## Root keys

| Key | Default | Notes |
|---|---|---|
| `splashScreen` | `true` | Print the console splash banner during startup. `false` suppresses it for clean startups. A failed enable always prints it |
| `metrics` | `true` | Send anonymous bStats usage metrics |

> Metrics report under bStats plugin id `33525`. If you set this to `false`, all submission stops.
{.is-info}

## `[features]`

Master switches. If you turn one off, that subsystem stops rendering or listening. Its documents still load. They still hot-reload. Its commands still edit them.

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
| `menus` | `true` | Holographic menus |
| `panels` | `true` | World-anchored panels |
| `previews` | `true` | Look-at container previews |
| `motd` | `false` | The custom server list MOTD |

`motd` is the only feature that ships off. Gloss reads `panels` and `previews` once during enable. The panel service and the preview registry start only when their feature is on at that moment.

## `[hotload]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `watchIntervalTicks` | `5` | 1 – 200 | Ticks between polls of every watched file and folder. Changing it restarts the watchdog on reload |

## `[holograms]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `stackDistance` | `0.26` | 0.05 – 2.0 | Vertical distance in blocks between stacked temporary holograms, and the value exposed to the API as the stack spread |
| `updateIntervalTicks` | `10` | 1 – 200 | Ticks between persistent hologram text refreshes |
| `viewRange` | `48.0` | 4.0 – 128.0 | Distance in blocks at which holograms become visible, and the radius within which per-viewer copies are rendered |
| `perViewerPlaceholders` | `true` | — | Render complete placeholder, function and expression tokens per viewing player instead of once globally |
| `temporaryUpdateIntervalTicks` | `2` | 1 – 20 | Ticks between refreshes of temporary holograms (bubbles, indicators, API temporaries) |
| `interpolatedMotion` | `true` | — | Smooths moving temporary holograms between drive ticks via display teleport interpolation and smooths BubbleStyle scale/rotation through display transformation interpolation, using durations matched to `temporaryUpdateIntervalTicks`. It does not reduce the update rate. Unsupported interpolation controls fall back to immediate updates |
| `textArtMaxWidth` | `48` | 8 – 128 | Maximum character width of `/gloss hologram rendertext` output |
| `highFrequencyAnimations` | `true` | — | Drive animation clips faster than 20 fps from the dedicated `Gloss Animator` thread with sub-tick packet updates. Off restores the tick-bounded behavior exactly |
| `maxAnimationFps` | `120` | 1 – 240 | Frame-rate ceiling of the high-frequency animator loop. Sets its adaptive floor to `1000 / fps` ms (at least 4 ms) |
| `animationPacketBudget` | `20000` | 100 – 1000000 | Animation text packets per second allowed across each animated display's audience. Large audiences degrade the effective frame rate proportionally |

A non-finite `stackDistance` or `viewRange` falls back to its default. It does not clamp. See [Holograms](/gloss/04-holograms).

## `[boards]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `updateIntervalTicks` | `20` | 1 – 200 | Ticks between scoreboard refreshes |

## `[tablist]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `updateIntervalTicks` | `40` | 1 – 400 | Ticks between tablist refreshes |

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

## `[drops]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `nameFormat` | `"&7{count}x {type}"` | — | Name format for dropped stacks. `{count}` and `{type}` are replaced. A null value restores the default |
| `bundleFormat` | `"&7Bundle &8(&7{total} items&8): &7{contents}"` | — | Name format for a dropped bundle carrying stacks. `{total}` and `{contents}` are replaced. A null value restores the default. An empty bundle falls back to `nameFormat` |
| `bundleEntryLimit` | `3` | 1 – 10 | Bundle content entries listed before the rest collapse into a `+N more` suffix |
| `preserveCustomNames` | `true` | — | Leave custom names other plugins already set on dropped item entities untouched. Gloss tracks its own labels with a persistent data key |
| `useItemDisplayNames` | `true` | — | Use an item's display name from its item meta as `{type}` instead of the pretty material name |

## `[commands]`

| Key | Default | Meaning |
|---|---|---|
| `sounds` | `true` | Play feedback sounds when command output is delivered to a player. Console senders never get sounds |

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
