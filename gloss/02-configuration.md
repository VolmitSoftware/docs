---
title: "Configuration"
description: "Gloss documentation: Configuration"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-18T00:00:00.000Z
---
Every runtime setting lives in `plugins/Gloss/config.toml`. The file is generated with a comment above
each knob, rewritten on load so the values on disk are the values in effect, and watched while the
server runs — saving it reloads Gloss. Content such as tablist text, MOTD lines and bubble styling is
not in this file; it lives in JSON documents covered on [Data Files & Hot Reload](/gloss/03-data-files).

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

Every table below is emitted the same way, each key preceded by its own comment line.

**Canonicalisation.** Every load parses the file, normalises it, re-serialises it, and writes it back
when the result differs from what was on disk. That is how out-of-range numbers get clamped into the
file, how missing keys reappear, and how comments regenerate after an upgrade. What you read back is
what Gloss is actually using.

**Hot reload.** `config.toml` is polled by the same watchdog that polls the data folders, at
`[hotload] watchIntervalTicks`. When the file's timestamp and size change, Gloss re-reads it and
reloads every service in place. A hash guard suppresses Gloss's own canonicalisation writes, so a
rewrite does not loop back into another reload.

**Failure behaviour differs between boot and reload.**

- At startup an unreadable or invalid `config.toml` is replaced with a fresh default file, a warning
  names the reason, and enable continues.
- On hot reload and on `/gloss reload` an invalid file is refused. Gloss logs
  `config.toml is invalid; keeping the last good configuration.` and nothing changes — the previously
  loaded configuration stays live and no service is touched.

A file larger than 2 MiB is treated as invalid without being parsed.

**`/gloss reload`** (permission `gloss.admin`) re-reads the file and reloads services exactly as the
watcher does. It is only needed when you want the reload to happen immediately rather than within the
next poll.

## Root keys

| Key | Default | Notes |
|---|---|---|
| `splashScreen` | `true` | Print the console splash banner during startup. `false` suppresses it for clean startups; a failed enable always prints it |
| `metrics` | `true` | Send anonymous bStats usage metrics |

> Metrics report under bStats plugin id `33525`. Setting this to `false` stops all submission.
{.is-info}

## `[features]`

Master switches. Turning one off stops that subsystem rendering or listening; its documents still
load, still hot-reload, and its commands still edit them.

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

`motd` is the only feature that ships off. `panels` and `previews` are read once during enable — the
panel service and the preview registry only start when their feature is on at that moment.

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
| `perViewerPlaceholders` | `true` | — | Resolve placeholders per viewing player instead of once globally |
| `temporaryUpdateIntervalTicks` | `2` | 1 – 20 | Ticks between refreshes of temporary holograms (bubbles, indicators, API temporaries) |
| `textArtMaxWidth` | `48` | 8 – 128 | Maximum character width of `/gloss hologram rendertext` output |

A non-finite `stackDistance` or `viewRange` falls back to its default rather than clamping. See
[Holograms](/gloss/04-holograms).

## `[boards]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `updateIntervalTicks` | `20` | 1 – 200 | Ticks between scoreboard refreshes |

## `[tablist]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `updateIntervalTicks` | `40` | 1 – 400 | Ticks between tablist refreshes |

The header, footer and per-group list-name formats are not here. They are in `tablist.json` — see
[Tablist & Server List MOTD](/gloss/06-tablist-motd).

## `[groups]`

| Key | Default | Meaning |
|---|---|---|
| `useVault` | `true` | Resolve player groups through Vault when it is installed. `false` skips Vault entirely, so no player resolves a group |

Groups are resolved live through Vault only. There is no `groups/` directory and no group inspector
command; see [Scoreboards & Groups](/gloss/05-scoreboards-groups).

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
| `blacklistWorlds` | `[]` | World folder names where chat bubbles never appear. Null entries are dropped; no case folding is applied, so match the folder name exactly |

Bubble appearance and timing are per-style, in `bubbles/<id>.json` — see
[Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops).

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
| `nameFormat` | `"&7{count}x {type}"` | — | Name format for dropped stacks; `{count}` and `{type}` are replaced. A null value restores the default |
| `bundleFormat` | `"&7Bundle &8(&7{total} items&8): &7{contents}"` | — | Name format for a dropped bundle carrying stacks; `{total}` and `{contents}` are replaced. A null value restores the default. An empty bundle falls back to `nameFormat` |
| `bundleEntryLimit` | `3` | 1 – 10 | Bundle content entries listed before the rest collapse into a `+N more` suffix |

## `[commands]`

| Key | Default | Meaning |
|---|---|---|
| `sounds` | `true` | Play feedback sounds when command output is delivered to a player. Console senders never get sounds |

## `[debug]`

| Key | Default | Meaning |
|---|---|---|
| `hitbox` | `false` | Render menu hitbox debug outlines for every session |
| `position` | `false` | Render menu position debug markers for every session |

Both apply to live sessions the moment the config reloads — see
[Components & Hitboxes](/gloss/10-components-hitboxes).

## `[editor]`

| Key | Default | Meaning |
|---|---|---|
| `builderUrl` | `"https://gloss.volmitsoftware.com"` | Base URL of the hosted web editor |

`builderUrl` is sanitized on every load. The value is trimmed, then rejected unless it starts with
`http://` or `https://` and contains no character at or below a space and none of `'`, `"`, `<`, `>`
or `\`. A rejected value is silently replaced with the default; there is no partial repair.

> Both editor hostnames moved off the retired HoloUI names: the builder default is
> `gloss.volmitsoftware.com` and the sync endpoint default is `sync.gloss.volmitsoftware.com/v2`. If a
> host is not reachable yet, point `builderUrl` at your own build of the editor.
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

`endpoint` is sanitized strictly. A value that is not already stripped of surrounding whitespace is
rejected outright. Trailing slashes are removed, the URI is normalised, and it must then satisfy all
of the following, or the default is restored:

- it parses as an absolute URI with a scheme and a host;
- no user info, no query string and no fragment;
- scheme `https`, or scheme `http` with host `localhost`, `127.0.0.1`, `::1` or `[::1]`;
- a path ending in `/v2`, containing none of `//`, `/../` or `/./`;
- a rebuilt, lowercase-scheme, lowercase-host form no longer than 1024 characters.

The stored value is that rebuilt form, so the endpoint you read back may differ in case from what you
typed.

`createToken` is sanitized separately. Null or blank stays empty and is not a problem. Anything else
must already be free of surrounding whitespace, be 22 to 128 characters long, and consist only of
`A-Z`, `a-z`, `0-9`, `_` and `-`. A value failing any of those is blanked and logged as
`editor.sync.createToken is invalid; live editor session creation will use no token.` — session
creation then proceeds untokened rather than failing.

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

Changing `scale` or `uiScale` invalidates the item provider cache and refreshes every open menu
session and every live panel on reload.

## `[items]`

| Key | Default | Meaning |
|---|---|---|
| `customItems` | `true` | Enable custom item icons resolved through installed item plugins |
| `customItemProviders` | `[]` | Provider allowlist by provider or plugin name. An empty list allows every provider |

Allowlist entries are trimmed, lowercased and de-duplicated on load, so the file shows the normalised
form. Changing either key reloads the provider registry on the next config reload. See
[Custom Items & Item Providers](/gloss/14-custom-items).

## `[integration]`

| Key | Default | Range | Meaning |
|---|---|---|---|
| `sampleIntervalTicks` | `20` | 1 – 200 | Ticks between samples of the metrics other Volmit plugins publish, for `\|metric.<key>\|` text tokens and preview metric variables |

The integration bridge only samples metric keys something has actually asked for, so this interval
costs nothing on a server whose content never mentions a metric. Changing it restarts the sampler on
the next config reload. See [Expressions & Placeholders](/gloss/13-expressions-placeholders) for the
tokens and variables it feeds, and [Runtime Architecture](/gloss/20-runtime-architecture) for how
discovery works.

## What is no longer in configuration

`config.yml` does not exist. Pre-merger Gloss used it; the file is now migrated and retired by
`/gloss import legacy`, which overlays its mechanical keys onto `config.toml`, moves its content keys
into the JSON documents, and renames the original to `config.yml.imported`. The old HoloUi
`settings.json` is likewise overlaid rather than read.

Three groups of settings moved out of configuration entirely and are now content documents:

| Was a config key | Now lives in | Documented on |
|---|---|---|
| `tablist.header`, `tablist.footer`, `tablist.use-header-footers`, `tablist.group-list-names` | `tablist.json` | [Tablist & Server List MOTD](/gloss/06-tablist-motd) |
| `motd.texts` | `motd.json` | [Tablist & Server List MOTD](/gloss/06-tablist-motd) |
| `chat-bubbles.message.*`, `word-wrap-break-chars`, `max-time-alive`, `line-stagger-ticks`, `fly-away`, `follow-players`, `hide-own-messages` | `bubbles/<id>.json` | [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops) |

The `groups/` YAML directory is retired as well. Group membership is resolved live through Vault, and
per-group tablist names and default boards are now fields inside `tablist.json` and each board
document.
