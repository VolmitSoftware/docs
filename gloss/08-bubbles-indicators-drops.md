---
title: "Chat Bubbles, Indicators & Drops"
description: "Gloss documentation: Chat Bubbles, Indicators & Drops"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Three small features share one mechanism. Chat bubbles float a player's message above their head, damage
indicators throw the applied health delta off an entity, and drop labels name item entities on the ground.
Bubbles and indicators are built on temporary holograms, so they are never written to disk and never
resolve placeholders. Drop labels are a plain listener on the item entity's custom name.

## Chat bubbles

### Style documents

Bubble styles live in `plugins/Gloss/bubbles/`, one enveloped JSON file per style. The id is the file name
with `.json` removed. `default.json` ships in the jar and is extracted whenever it is missing, so deleting
it brings it back on the next reload or restart.

`plugins/Gloss/bubbles/default.json` as shipped:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "prefix": "&7",
  "offset": [0.0, 1.0, 0.0],
  "wordWrapChars": 32,
  "lineStaggerTicks": 5,
  "maxAliveMs": 5000,
  "flyAway": true,
  "followPlayer": true,
  "hideOwn": true
}
```

| Key | Default when absent | Clamp / notes |
|---|---|---|
| `schemaVersion` | required | Must be `1`, otherwise `unsupported bubbles schemaVersion: <n>` |
| `revision` | required | `1` to `9007199254740991` |
| `prefix` | `"&7"` | Prepended to every bubble line before rendering. `null` or absent becomes `"&7"`; an explicit `""` stays empty and the bubble renders with no leading color |
| `offset` | `[0.0, 1.0, 0.0]` | `[x, y, z]` added to the speaker's eye position when the bubble spawns |
| `wordWrapChars` | `0` clamped to `8` | Characters per wrapped line. Clamped to `8`..`128` |
| `lineStaggerTicks` | `0` | Ticks between successive lines of one message. Clamped to `0`..`40`; `0` spawns every line at once |
| `maxAliveMs` | `0` clamped to `500` | Milliseconds a bubble lives. Clamped to `500`..`60000` |
| `flyAway` | `false` | When true the bubble accelerates upward during its last 2 seconds |
| `followPlayer` | `false` | When true the bubble tracks the speaker; when false it stays where it spawned |
| `hideOwn` | `false` | When true the speaker cannot see their own bubbles |
| `select` | absent | Auto-match rules, see below. Absent means the style never auto-matches |

`flyAway`, `followPlayer` and `hideOwn` are primitive booleans, so an absent key is `false` — unlike
`prefix` and `offset`, which have real fallbacks. Write them out explicitly in every style you author.

There is no config table for bubble styles. `config.toml` carries exactly one bubble knob,
`[chatBubbles] blacklistWorlds` (default `[]`), a list of world folder names matched exactly and
case-sensitively; a speaker in a listed world produces no bubbles at all.

### The `select` block

```json
"select": {
  "worlds": ["survival", "resource_*"],
  "groups": ["vip", "admin"],
  "priority": 10
}
```

| Key | Notes |
|---|---|
| `worlds` | Glob patterns matched against the speaker's world folder name. `*` matches any run of characters, `?` matches one; everything else is literal and the match is case-sensitive and whole-string. An empty or absent list means any world |
| `groups` | Group names, trimmed and lowercased on load, matched case-insensitively against the speaker's primary Vault group. An empty or absent list means any group |
| `priority` | Integer, default `0`. Higher wins |

`worlds` and `groups` are ANDed: both conditions must hold. An empty list satisfies its own condition.

Primary groups come from Vault, so a `groups` list only ever matches when `[groups] useVault = true` and a
Vault permission provider is installed. Without one the primary group is unknown and any style with a
non-empty `groups` list is skipped. See [Scoreboards & Groups](/gloss/05-scoreboards-groups).

### Style resolution

For each chat message Gloss resolves one style, in this order:

1. **The player's explicit choice.** Used only when the player has chosen a style, that style id still
   exists on disk, **and** the player holds `gloss.bubbles.style.<id>`. Any of the three failing drops
   straight to step 2 with no message.
2. **The best matching `select`.** Every style that has a `select` block and whose block matches the
   speaker's world and primary group is a candidate. The highest `priority` wins; ties are broken by the
   lexicographically smallest style id.
3. **`default`.** Used when nothing matched and a style with the id `default` exists.
4. **Built-in fallback.** With no `default` on disk, Gloss uses its compiled-in values — prefix `&7`,
   offset `[0, 1, 0]`, wrap 32, stagger 5, 5000 ms, `flyAway`, `followPlayer` and `hideOwn` all on. Bubbles
   never stop working because a file is missing.

Two consequences worth stating plainly:

- **A style with no `select` block never auto-matches.** It can only be reached by an explicit
  `/gloss bubbles style <id>` or by being named `default`. This is the way to publish a style that is
  opt-in only.
- **An empty `select` matches everyone.** `"select": {}` or `"select": {"priority": 5}` has no world and
  no group condition, so both conditions pass and the style becomes a server-wide auto-match at that
  priority.

The style is resolved **once per chat message**, before the lines are wrapped, and the whole message's
bubbles use it. Editing a style file, or a player changing their choice, therefore applies from the next
message onward — bubbles already in flight keep the values they were spawned with.

### From message to bubbles

The bubble hook runs on `AsyncPlayerChatEvent` at `MONITOR` priority, after Gloss has already applied its
own chat emoji and color stages, so bubbles show whatever the final chat text is.

1. Formatted section-sign color sequences are stripped from the message. Raw `&` codes that chat did not
   translate — because `[chat] color` is off, or the sender lacks `gloss.chat.color` — survive the strip
   and are colorized when the bubble line renders.
2. The text is wrapped at `wordWrapChars`, breaking on word boundaries. A single word longer than the
   limit is cut at exactly `wordWrapChars` characters. Blank lines are dropped.
3. Line `n` spawns after `lineStaggerTicks * n` ticks, so the first line appears immediately.

Each line spawns as its own temporary hologram at the speaker's eye position plus `offset`, prefixed with
`prefix`, living `maxAliveMs` milliseconds. At that point three conditions are re-checked and any of them
cancels the spawn: `[features] chatBubbles` still on, the speaker still online and not in a blacklisted
world, and the speaker still holding `gloss.bubbles.send`.

Bubble text renders statically, so `prefix` colors, bracket hex, emoji and `|function|` tokens all work,
but placeholders are not resolved. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations).

### Motion

Every live bubble sits at its base position plus a lift of `0.86` blocks, plus one
`[holograms] stackDistance` (default `0.26`) for each bubble stacked below it, plus the fly-away lift. New
bubbles push older ones up.

With `followPlayer` on, the base is the speaker's current eye position, resampled every tick, and `offset`
is **not** re-applied — it only shapes where the bubble first appears. With `followPlayer` off, the base is
the position captured at spawn, offset included, and the bubble stays there.

With `flyAway` on, the last 2000 ms of a bubble's life add an upward lift that starts at zero and eases to
10 blocks with a sharp curve at the very end. With `flyAway` off, the bubble holds its stack position until
it vanishes.

Positions are re-evaluated on the temporary hologram driver, which ticks every
`[holograms] temporaryUpdateIntervalTicks` (default `2`).

`hideOwn` adds the speaker to the bubble's viewer exclusion list, so everyone except the speaker sees it.

### Commands and permissions

```
/gloss bubbles style <style>
/gloss bubbles style clear
/gloss bubbles reset [name=*]
```

`bubble` is an alias for `bubbles`. `style` is player-only and needs `gloss.bubbles.style` (op by default).
Tab completion offers `clear` plus every style id on disk. A style id that does not exist on disk is
rejected with an unknown-style message; `clear` removes the stored choice and returns the player to
automatic selection.

> `/gloss bubbles style <id>` checks only `gloss.bubbles.style`. It does **not** check
> `gloss.bubbles.style.<id>` — that node is tested at resolution time. A player can store a choice they
> are not permitted to use, and their bubbles will silently fall back to automatic selection with no
> further message.
{.is-info}

`reset` needs `gloss.bubbles.reset` (op) and rewrites shipped bubble style documents from the jar.

> `/gloss bubbles reset` overwrites `bubbles/default.json`. Edits to that file are lost. Style ids you
> created yourself are never touched.
{.is-warning}

| Permission | Default | Grants |
|---|---|---|
| `gloss.bubbles.send` | `true` | This player's chat messages spawn bubbles |
| `gloss.bubbles.style` | `op` | `/gloss bubbles style` |
| `gloss.bubbles.style.<id>` | undeclared (op) | Actually using style `<id>` once chosen |
| `gloss.bubbles.reset` | `op` | `/gloss bubbles reset` |

`gloss.bubbles.style.<id>` is dynamic and not declared in `plugin.yml`, so it behaves as op-only until a
permission plugin grants it.

### Stored player choices

Player choices are stored in `plugins/Gloss/bubble-styles.json`, a flat object of player UUID to style id,
pretty-printed with the keys sorted:

```json
{
  "0b1d5f6e-9a2c-4d18-9f3a-77c1f2a4b901": "vip",
  "3c8a1e44-51f7-4a90-8d22-b6e0c9d13455": "neon"
}
```

The file is written whenever a player sets or clears a style and read once when the service enables. On
load, entries with a blank value or an unparseable UUID are skipped silently. Deleting the file resets
every player to automatic selection.

### Turning bubbles off

`[features] chatBubbles = false` stops the chat hook and the per-tick eye sampler and destroys every live
bubble. Style documents still load, still hot-reload, and `/gloss bubbles style` still records a choice —
nothing renders.

## Damage and heal indicators

Gloss listens to `EntityDamageEvent` and `EntityRegainHealthEvent` at `MONITOR` priority, ignoring
cancelled events, on living entities only. `EntityRegainHealthEvent` is ignored entirely when
`[damageIndicators] showHeals = false`.

The number shown is the **actual applied health delta**, not the event's raw amount. Health is read when
the event fires and read again 2 ticks later on the entity's own thread, and the difference is what
spawns. Armor, resistance, absorption ordering and other plugins' modifications are therefore included by
construction, and a damage event another plugin neutralises produces no indicator.

Filtering before an indicator spawns:

- A per-entity 3-tick debounce coalesces bursts, so one entity produces at most one indicator per 3 ticks.
- A delta with an absolute value of `0.009` or less is discarded.
- A server-wide sliding window drops anything over `[damageIndicators] maxPerSecond`.

Damage numbers spawn `0.7` blocks above the entity's location with `damagePrefix`; heal numbers spawn
`0.1` blocks below it with `healPrefix`. Both scatter horizontally by up to `randomThrowForce` in each
direction and pop upward by `initialUpForce`. Damage numbers then fall by `gravityFactor` per driver step;
heal numbers instead rise by `gravityFactor` divided by 19.5 per step. Steps happen on the temporary
hologram driver, every `[holograms] temporaryUpdateIntervalTicks` (default `2`).

The value is formatted by `decimals`: `0` prints a rounded whole number, `1` or `2` print that many
decimal places.

Visibility is decided once, at spawn: every online player in the entity's world who does **not** hold
`gloss.indicators.show` is excluded from that indicator. Players who enter the world afterwards see it.

| Config key | Default | Range |
|---|---|---|
| `[features] damageIndicators` | `true` | on/off for the whole feature |
| `[damageIndicators] randomThrowForce` | `0.08` | `0.0`..`2.0` |
| `[damageIndicators] initialUpForce` | `0.13` | `0.0`..`2.0` |
| `[damageIndicators] gravityFactor` | `0.0093` | `0.0`..`1.0` |
| `[damageIndicators] maxPerSecond` | `40` | `1`..`1000` |
| `[damageIndicators] maxMsAlive` | `3000` | `250`..`30000` |
| `[damageIndicators] damagePrefix` | `"&c&l"` | any string; blank restores the default |
| `[damageIndicators] healPrefix` | `"&a&l"` | any string; blank restores the default |
| `[damageIndicators] decimals` | `0` | `0`..`2` |
| `[damageIndicators] showHeals` | `true` | heal indicators in addition to damage |

| Permission | Default | Grants |
|---|---|---|
| `gloss.indicators.show` | `true` | This player sees damage and heal indicators |

There are no indicator commands. Setting `[features] damageIndicators = false` unregisters the listeners
and destroys every live indicator; turning it back on re-registers them without a restart.

## Dropped item labels

With `[features] drops = true` (the default) every item entity that spawns gets a visible custom name built
from `[drops] nameFormat`:

| Token | Replaced with |
|---|---|
| `{count}` | The stack size |
| `{type}` | The material name lowercased with underscores turned into spaces, so `DIAMOND_SWORD` becomes `diamond sword` |

The shipped default is `"&7{count}x {type}"`, giving `64x cobblestone`. A blank value restores that
default on load.

### Bundles

A dropped `BUNDLE` whose `BundleMeta` carries stacks is named from `[drops] bundleFormat` instead, so a
merged super-stack reads as its contents rather than as one bundle:

| Token | Replaced with |
|---|---|
| `{total}` | The summed amount of every stack inside the bundle |
| `{contents}` | The rendered content list |

Contents are aggregated by material — every stack of the same type is summed into one entry — and ordered
largest amount first, ties broken by type name. `[drops] bundleEntryLimit` (default `3`, clamped to
1 – 10) caps how many entries are listed; the rest collapse into a `+N more` suffix counting the entries
that were left off, not the items. The shipped default gives:

```
Bundle (12 items): 5x stone, 4x dirt, +2 more
```

A bundle with no contents, or one whose stacks are all empty, falls back to `nameFormat` and is named
`1x bundle` like any other item. This is what makes React's merged ground drops readable — React packs
nearby stacks into a `BUNDLE` with the originals in `BundleMeta`, which the plain `{count}x {type}` format
could only ever name after the bundle itself.

The formatted string is rendered statically through the text pipeline, so colors, bracket hex, emoji and
`|animation.<id>|` tokens work; placeholders do not resolve. Only the ground entity's display name changes
— the `ItemStack` itself is untouched, so picking the item up gives an unmodified item.

Naming is unconditional: the listener runs at `MONITOR` and overwrites whatever custom name another
plugin put on the item entity, and it always forces the name visible. The name is built from the
material, never from the `ItemStack`'s own display name, so a custom-named item still labels as its
material.

Both `ItemSpawnEvent` and `ItemMergeEvent` are handled at `MONITOR` priority, ignoring cancelled events.
When two stacks merge on the ground the surviving entity is renamed with the combined count and the
absorbed entity is dropped from tracking, so the label never goes stale after a merge.

Label visibility distance is the client's own entity name render distance. There is no radius setting.

Setting `[features] drops = false` unregisters the listener so no new labels are applied, but names already
written onto existing item entities stay until those entities despawn.

## Reference

| Command | Arguments | Permission |
|---|---|---|
| `/gloss bubbles style` | `<style>` (a style id, or `clear`) | `gloss.bubbles.style` |
| `/gloss bubbles reset` | `[name=*]` | `gloss.bubbles.reset` |

Optional arguments must be written as `key=value`; a stray positional value is rejected. Indicators and
drop labels have no commands.

`bubbles/` is watched by the shared `DataWatchdog` at `[hotload] watchIntervalTicks` (default 5 ticks), so
adding, editing, renaming and deleting style files all apply live. A style document that fails to parse is
logged and skipped while the copy already in memory keeps working. See
[Data Files & Hot Reload](/gloss/03-data-files) and, for the temporary holograms all of this is built on,
[Holograms](/gloss/04-holograms).
