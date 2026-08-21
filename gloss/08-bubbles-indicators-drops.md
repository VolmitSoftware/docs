---
title: "Chat Bubbles, Indicators & Drops"
description: "Gloss documentation: Chat Bubbles, Indicators & Drops"
published: true
date: 2026-08-21T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Chat bubbles float a player message above their head. Damage indicators throw the applied health delta off an entity. Drop labels identify item entities, while real drops replace their vanilla client model with grounded and tumbling display entities. Bubbles and indicators use temporary holograms; dropped-item presentation has its own display-carrier lifecycle.

## Chat bubbles

### Style documents

Bubble styles live in `plugins/Gloss/bubbles/`, one enveloped JSON file per style. The id is the file name with `.json` removed. `default.json` ships in the jar. It is extracted whenever it is missing and `[features] chatBubbles` is on, so a server that leaves bubbles off never grows a `bubbles/` folder. If you delete it, it comes back on the next reload or restart. On enable, Gloss atomically replaces the exact byte-identical former schema-1 default, the former 700 ms schema-2 default and the short-lived grey-edge schema-2 default with the file below. Any edited or reformatted copy is preserved.

`plugins/Gloss/bubbles/default.json` as shipped:

```json
{
  "schemaVersion": 2,
  "revision": 1,
  "prefix": "&7",
  "offset": [0, 0.3, 0],
  "wordWrapChars": 32,
  "maxAliveMs": 5000,
  "followPlayer": true,
  "hideOwn": true,
  "motion": {
    "translation": {
      "x": "0",
      "y": "10 * pow(clamp((ageMs - lifetimeMs + 2000) / 2000, 0, 1), 16)",
      "z": "0"
    },
    "scale": {"x": "1", "y": "1", "z": "1"},
    "rotation": {"x": "0", "y": "0", "z": "0"},
    "opacity": "1"
  },
  "shimmer": {
    "spawn": true,
    "flyAway": true,
    "color": "#ffffff",
    "width": 3,
    "durationMs": 700,
    "spawnDelayMs": 400,
    "flyAwayLeadMs": 700
  }
}
```

| Key | Default when absent | Clamp / notes |
|---|---|---|
| `schemaVersion` | required | Must be `2`, otherwise `unsupported bubbles schemaVersion: <n>` |
| `revision` | required | `1` to `9007199254740991` |
| `prefix` | `"&7"` | Authored text prepended to the already-formatted chat message. `null` or absent becomes `"&7"`. An explicit `""` stays empty |
| `offset` | `[0.0, 0.3, 0.0]` | Literal `[x, y, z]` added to the speaker's eye position before stack and motion translation. There is no hidden base lift. The full offset remains applied while a bubble follows its speaker |
| `wordWrapChars` | `0` clamped to `8` | Visible characters per wrapped row. Color and format codes do not consume the width. Clamped to `8`..`128` |
| `maxAliveMs` | `0` clamped to `500` | Milliseconds a bubble lives. Clamped to `500`..`60000` |
| `followPlayer` | `false` | When true the bubble tracks the speaker. When false it stays where it spawned |
| `hideOwn` | `false` | When true the speaker cannot see their own bubbles |
| `motion` | shipped late-fly motion shown above | Expression-driven translation, scale, rotation and opacity over the bubble lifetime; see below |
| `shimmer` | shipped shine shown above | One solid white three-glyph wave crosses the complete wrapped message after a short delay, then crosses it again during fly-away; see below |
| `select` | absent | Auto-match rules, see below. Absent means the style never auto-matches |

`followPlayer` and `hideOwn` are primitive booleans. An absent key is `false`. That is unlike `prefix`, `offset` and `motion`, which have real fallbacks. Write the booleans explicitly in every style you author. Schema 2 has no top-level `flyAway` or `lineStaggerTicks` keys; authored motion replaces the fixed fly-away switch, and one message now appears as one multiline display. The unrelated `shimmer.flyAway` switch below is a shine option, not a motion one.

There is no config table for bubble styles. `config.toml` carries exactly one bubble knob, `[chatBubbles] blacklistWorlds` (default `[]`). That is a list of world folder names matched exactly and case-sensitively. A speaker in a listed world produces no bubbles at all.

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
| `worlds` | Glob patterns matched against the speaker's world folder name. `*` matches any run of characters. `?` matches one. Everything else is literal and the match is case-sensitive and whole-string. An empty or absent list means any world |
| `groups` | Group names, trimmed and lowercased on load, matched case-insensitively against the speaker's primary Vault group. An empty or absent list means any group |
| `priority` | Integer, default `0`. Higher wins |

`worlds` and `groups` are ANDed. Both conditions must hold. An empty list satisfies its own condition.

Primary groups come from Vault. A `groups` list only ever matches when `[groups] useVault = true` and a Vault permission provider is installed. Without one the primary group is unknown. Any style with a non-empty `groups` list is skipped. See [Scoreboards & Groups](/gloss/05-scoreboards-groups).

### Style resolution

For each chat message Gloss resolves one style, in this order:

1. **The player's explicit choice.** Used only when the player has chosen a style, that style id still exists on disk, **and** the player holds `gloss.bubbles.style.<id>`. Any of the three failing drops straight to step 2 with no message.
2. **The best matching `select`.** Every style that has a `select` block and whose block matches the speaker world and primary group is a candidate. The highest `priority` wins. Ties are broken by the lexicographically smallest style id.
3. **`default`.** Used when nothing matched and a style with the id `default` exists.
4. **Built-in fallback.** With no `default` on disk, Gloss uses the shipped schema-2 values shown above: prefix `&7`, offset `[0, 0.3, 0]`, wrap 32, 5000 ms, follow and hide-own on, and the late upward motion expression. Bubbles never stop working because a file is missing.

Two consequences worth stating plainly:

- **A style with no `select` block never auto-matches.** It can only be reached by an explicit `/gloss bubbles style <id>` or by being named `default`. This is the way to publish a style that is opt-in only.
- **An empty `select` matches everyone.** `"select": {}` or `"select": {"priority": 5}` has no world and no group condition. Both conditions pass. The style becomes a server-wide auto-match at that priority.

The style is resolved **once per chat message**, before the text is wrapped. The whole message uses it. If you edit a style file, or a player changes their choice, the change applies from the next message onward. Bubbles already in flight keep the values they were spawned with.

### From message to bubbles

The bubble hook runs on `AsyncPlayerChatEvent` at `MONITOR` priority, after Gloss has applied its chat emoji and permitted color stages. Bubbles preserve that final message formatting. For example, `&1Hello!!!` reaches the bubble as blue text when the chat color stage translated it; an unauthorized raw `&1` stays literal instead of gaining color only in the bubble.

Wrapping counts visible characters and keeps legacy color, hex and decoration state. It breaks on word boundaries when possible and hard-cuts only a single word longer than `wordWrapChars`. The wrapped rows are joined with newlines, left-aligned and sent to one `TextDisplay`, so one chat message is one aligned multiline entity and one background block rather than several independently moving bubbles.

The authored `prefix` is rendered separately through the full text pipeline with the speaker as viewer and prepended to the already-formatted message. It therefore supports `|function|`, `{{ player.* }}`, `papi`, raw PlaceholderAPI tokens, emoji and colors just like a scoreboard. Dynamic prefixes refresh on the speaker entity thread while the bubble lives. Player chat itself is not reinterpreted as Gloss code. The resulting bubble lives for `maxAliveMs` milliseconds. Immediately before spawn, Gloss re-checks that chat bubbles are enabled, the speaker is online and outside a blacklisted world, and the speaker still holds `gloss.bubbles.send`.

### Shimmer

`shimmer` is the original Gloss shine presented as two explicit high-frequency passes. It changes live text color, not particles. The shipped wave is a solid white three-glyph band. The active legacy or RGB color and text decorations are restored immediately after every highlighted glyph.

The wrapped message is one continuous visible-glyph stream. A band crossing a line boundary lights the end of one row and the start of the next, so a five-line bubble still has exactly one shimmer rather than five independently phased waves. The server moves the band from the first to the last visible glyph over `durationMs`; longer messages therefore update more frequently instead of moving at a fixed slow glyph rate.

The shipped first pass waits 400 ms after chat, then crosses the full block over 700 ms. The second begins 700 ms before expiry and crosses it again while the default late-fly motion is active. Between those windows the text is unchanged.

| Key | Default | Clamp / notes |
|---|---|---|
| `spawn` | `true` | Run one bounded pass after `spawnDelayMs` |
| `flyAway` | `true` | Run a second bounded pass beginning `flyAwayLeadMs` before expiry |
| `color` | `"#ffffff"` | Color applied to every lit glyph. Strict `#RRGGBB`; invalid values reject the style |
| `width` | `3` | Highlighted visible glyphs, clamped to `1`..`16` |
| `durationMs` | `700` | Milliseconds for one complete pass across the whole multiline block, clamped to `100`..`10000` |
| `spawnDelayMs` | `400` | Delay before the spawn pass starts, clamped to `0`..`60000` |
| `flyAwayLeadMs` | `700` | Departure starts this many milliseconds before expiry, clamped to `0`..`60000` |

A missing `shimmer` block uses all defaults above, so the shipped and built-in fallback styles visibly shine twice. With `spawn` and `flyAway` both `false` nothing shines at all. The spawn pass starts at `spawnDelayMs`; the fly-away pass starts at `max(0, maxAliveMs - flyAwayLeadMs)` and wins if the windows overlap. Each pass stops after `durationMs`. Shimmer timing and the `motion` expressions are independent, so the band can travel while the text flies, fades, shrinks, rotates or follows any other authored motion curve.

Frames come from the same high-frequency async packet animator that drives sub-tick text animations, up to `[holograms] maxAnimationFps` (shipped `120`), not from the temporary-hologram driver. With `[holograms] highFrequencyAnimations = false` the band falls back to the configured temporary-hologram interval, shipped as two ticks, and is visibly coarser.

> Exact untouched former shipped defaults are atomically upgraded to the delayed two-pass style. Edited or reformatted styles remain operator-owned; set `spawnDelayMs` to `400`, `durationMs` to `700`, and `flyAway` to `true` to opt in.
{.is-info}

### Motion

Every live message has a base position at the speaker's eye plus `offset`, then adds only the space required by newer wrapped messages and the evaluated motion translation. The newest message has no hidden stack lift, so the shipped `[0, 0.3, 0]` begins exactly 0.3 blocks above the eye anchor. New messages push older messages up by `[holograms] stackDistance` (default `0.26`) per wrapped row. With `followPlayer` on, the speaker eye and the complete configured offset are resampled together; with it off, that base is captured when the message spawns.

`motion` contains four expression surfaces:

```json
"motion": {
  "translation": {"x": "0", "y": "4 * t", "z": "0"},
  "scale": {"x": "1 - 0.65 * t", "y": "1 - 0.65 * t", "z": "1"},
  "rotation": {"x": "0", "y": "0", "z": "360 * t"},
  "opacity": "1 - smoothstep(0.65, 1, t)"
}
```

`translation.x/y/z` add blocks to the base position and clamp to `-64`..`64`. `scale.x/y/z` are display-size multipliers clamped to `0`..`16`. `rotation.x/y/z` are finite degrees normalized modulo 360. `opacity` is normalized and clamped from `0` (transparent) to `1` (opaque). Each expression source is limited to 512 characters. Expressions are compiled with the style and evaluated on the temporary-hologram cadence. The available variables are:

| Variable | Value |
|---|---|
| `t` | Normalized lifetime progress from `0` at spawn to `1` at expiry |
| `remaining` | Normalized lifetime remaining, `1 - t` |
| `ageMs` | Milliseconds since this bubble spawned |
| `lifetimeMs` | Effective `maxAliveMs` |
| `stackIndex` | This message's zero-based position in the speaker's live bubble stack |
| `stackCount` | Number of live message bubbles for the speaker |
| `lineCount` | Number of wrapped text rows in this one display |
| `stackY` | Vertical stack lift already assigned to this message |
| `seed` | Stable per-bubble numeric seed for deterministic variation |
| `pi` | Mathematical π |

The normal Gloss arithmetic, comparison, ternary and math functions are available, including `sin`, `cos`, `clamp`, `lerp`, `pow` and `smoothstep`. A fly-up is `translation.y = "4 * t"`; a fade is `opacity = "1 - t"`; a shrink uses `1 - t` on the scale axes; and an arc that rises before ending below its start can use `translation.y = "16 * t * (1 - t) - 4 * t"`. The shipped default reproduces the former late fly-away curve as an ordinary `translation.y` expression, so it can now be edited or replaced.

Position and presentation are re-evaluated on the temporary hologram driver, which ticks every `[holograms] temporaryUpdateIntervalTicks` (default `2`). Teleport and transformation interpolation smooth supported changes between those evaluations.

`hideOwn` adds the speaker to the bubble viewer exclusion list. Everyone except the speaker sees it.

### Commands and permissions

```
/gloss bubbles style <style>
/gloss bubbles style clear
/gloss bubbles reset [name=*]
```

`bubble` is an alias for `bubbles`. `style` is player-only and needs `gloss.bubbles.style` (op by default). Tab completion offers `clear` plus every style id on disk. A style id that does not exist on disk is rejected with an unknown-style message. `clear` removes the stored choice and returns the player to automatic selection.

> `/gloss bubbles style <id>` checks only `gloss.bubbles.style`. It does **not** check `gloss.bubbles.style.<id>`. That node is tested at resolution time. A player can store a choice they are not permitted to use. Their bubbles will silently fall back to automatic selection with no further message.
{.is-info}

`reset` needs `gloss.bubbles.reset` (op) and rewrites shipped bubble style documents from the jar.

> `/gloss bubbles reset` overwrites `bubbles/default.json`. Edits to that file are lost. Style ids you created yourself are never touched.
{.is-warning}

| Permission | Default | Grants |
|---|---|---|
| `gloss.bubbles.send` | `true` | This player's chat messages spawn bubbles |
| `gloss.bubbles.style` | `op` | `/gloss bubbles style` |
| `gloss.bubbles.style.<id>` | undeclared (op) | Actually using style `<id>` once chosen |
| `gloss.bubbles.reset` | `op` | `/gloss bubbles reset` |

`gloss.bubbles.style.<id>` is dynamic and not declared in `plugin.yml`. It behaves as op-only until a permission plugin grants it.

### Stored player choices

Player choices are stored in `plugins/Gloss/bubble-styles.json`, a flat object of player UUID to style id, pretty-printed with the keys sorted:

```json
{
  "0b1d5f6e-9a2c-4d18-9f3a-77c1f2a4b901": "vip",
  "3c8a1e44-51f7-4a90-8d22-b6e0c9d13455": "neon"
}
```

The file is written whenever a player sets or clears a style. It is read once when the service enables. On load, entries with a blank value or an unparseable UUID are skipped silently. If you delete the file, every player returns to automatic selection.

### Turning bubbles off

`[features] chatBubbles = false` stops the chat hook and the per-tick eye sampler. It destroys every live bubble. Style documents still load. They still hot-reload. `/gloss bubbles style` still records a choice. Nothing renders.

## Damage and heal indicators

Gloss listens to `EntityDamageEvent` and `EntityRegainHealthEvent` at `MONITOR` priority, ignoring cancelled events, on living entities only. `EntityRegainHealthEvent` is ignored entirely when `[damageIndicators] showHeals = false`.

The number shown is the **actual applied health delta**, not the event raw amount. Health is read when the event fires. It is read again 2 ticks later on the entity own thread. The difference is what spawns. Armor, resistance, absorption ordering and other plugins modifications are therefore included by construction. A damage event another plugin neutralises produces no indicator.

Filtering before an indicator spawns:

- A per-entity 3-tick debounce coalesces bursts. One entity produces at most one indicator per 3 ticks.
- A delta with an absolute value of `0.009` or less is discarded.
- A server-wide sliding window drops anything over `[damageIndicators] maxPerSecond`.

Damage numbers spawn `0.7` blocks above the entity location with `damagePrefix`. Heal numbers spawn `0.1` blocks below it with `healPrefix`. Both scatter horizontally by up to `randomThrowForce` in each direction and pop upward by `initialUpForce`. Damage numbers then fall by `gravityFactor` per driver step. Heal numbers instead rise by `gravityFactor` divided by 19.5 per step. Steps happen on the temporary hologram driver, every `[holograms] temporaryUpdateIntervalTicks` (default `2`).

The value is formatted by `decimals`. `0` prints a rounded whole number. `1` or `2` print that many decimal places.

Visibility is decided once, at spawn. If every online player holds `gloss.indicators.show`, nothing is computed at all. Otherwise Gloss walks the players within `[holograms] viewRange` of the entity and excludes the ones that do **not** hold the permission. Players further away than that are not in the set, because they cannot see the display anyway.

That set is never revisited. A player who walks into range while an indicator is still alive sees it, permission or not. This is deliberate: indicators live at most `maxMsAlive` (default `3000`, three seconds) and re-scanning the audience every driver step for a three-second display costs more than the leak is worth. If you need the permission enforced strictly, lower `maxMsAlive`.

| Config key | Default | Range |
|---|---|---|
| `[features] damageIndicators` | `true` | on/off for the whole feature |
| `[damageIndicators] randomThrowForce` | `0.08` | `0.0`..`2.0` |
| `[damageIndicators] initialUpForce` | `0.13` | `0.0`..`2.0` |
| `[damageIndicators] gravityFactor` | `0.0093` | `0.0`..`1.0` |
| `[damageIndicators] maxPerSecond` | `40` | `1`..`1000` |
| `[damageIndicators] maxMsAlive` | `3000` | `250`..`30000` |
| `[damageIndicators] damagePrefix` | `"&c&l"` | any string. Blank restores the default |
| `[damageIndicators] healPrefix` | `"&a&l"` | any string. Blank restores the default |
| `[damageIndicators] decimals` | `0` | `0`..`2` |
| `[damageIndicators] showHeals` | `true` | heal indicators in addition to damage |

| Permission | Default | Grants |
|---|---|---|
| `gloss.indicators.show` | `true` | This player sees damage and heal indicators |

There are no indicator commands. If you set `[features] damageIndicators = false`, Gloss unregisters the listeners and destroys every live indicator. If you turn it back on, Gloss re-registers them without a restart.

## Dropped item labels

With `[features] drops = true` (the default) every item entity that spawns gets a visible custom name built from `[drops] nameFormat`:

| Token | Replaced with |
|---|---|
| `{count}` | The stack size |
| `{type}` | The item's display name from its item meta when it has one and `[drops] useItemDisplayNames` is on (the default). Otherwise the material name lowercased with underscores turned into spaces, so `DIAMOND_SWORD` becomes `diamond sword` |

The shipped default is `"&7{count}x {type}"`, giving `64x cobblestone` — or `1x Excalibur` for a renamed sword. If `[drops] useItemDisplayNames = false`, Gloss always labels by material. A null `nameFormat` restores the default on load; an explicit empty string stays empty.

### Bundles

A dropped `BUNDLE` whose `BundleMeta` carries stacks keeps a horizontal fallback name from `[drops] bundleFormat`. A merged React super-stack therefore describes its contents rather than retaining the target item that existed before the merge:

| Token | Replaced with |
|---|---|
| `{total}` | The summed amount of every stack inside the bundle |
| `{contents}` | The rendered content list |

Contents are aggregated by material. Every stack of the same type is summed into one entry. They are ordered largest amount first; ties use the material name. `[drops] bundleEntryLimit` defaults to `3` and clamps to 1 – 10. The remainder counts hidden material types, not hidden items.

With `[features] realDrops = true` and `[drops] bundleVerticalLabels = true`, the visible display is vertical. `[drops] bundleHeaderFormat`, `bundleEntryFormat`, and `bundleMoreFormat` produce:

```
Bundle (12 items)
- 5x stone
- 4x dirt
- 2x oak log
+1 more
```

A bundle with no contents, or whose stacks are all empty, falls back to `nameFormat` and is named `1x bundle`. The horizontal fallback remains on the hidden item entity, so turning real drops off immediately returns to a readable vanilla nametag.

React supplies its own header, entry, remainder, and entry-limit values for flagged super-stack bundles. It refreshes immediately after a merge or partial hopper pickup, removes the presentation before deleting a source entity, republishes loaded bundles, and reconciles sampled bundles at most once per entity per 30 seconds. Gloss still owns aggregation, text rendering, display creation, thread routing, and cleanup.

Every line is rendered statically through the text pipeline. Colors, bracket hex, emoji and static `|function|` tokens work. Viewer placeholders do not resolve. The `ItemStack` is untouched.

The listener runs at `MONITOR` and makes the native fallback name visible. Gloss marks every entity
it names with `gloss:drop_name` and stores the matching rendered value in `gloss:drop_name_value`.
With `[drops] preserveCustomNames = true` (the default), an existing foreign name is left untouched.
If another plugin replaces a formerly Gloss-owned name, the stored value no longer matches; Gloss
relinquishes its stale marker instead of reclaiming the name. Setting the option to `false` restores
unconditional overwrite.

Spawn, vanilla merge, pickup, hopper pickup, despawn, entity load, and entity unload are coordinated at `MONITOR`. Full removal destroys the attached presentation. Partial pickup refreshes one tick later, after the server has replaced the remaining stack. All world and entity work runs on the owning entity or region thread.

### Real drops

`[features] realDrops = true` is the default. Gloss leaves the real `Item` entity in place as the authority for physics, despawn, merging, and pickup and hides only that entity from client tracking. One non-persistent `ItemDisplay` in explicit `FIXED` render mode follows the item as the visible carrier; additional stack models and the optional `TextDisplay` label ride that carrier as passengers. Gloss moves only the carrier at the configured cadence, so a multi-model labelled stack still costs one position update instead of one per display. This feature uses Bukkit display entities and the Gloss scheduler; it does not use ProtocolLib or a new packet dependency.

The feature switch remains `[features] realDrops` in `config.toml`. Every presentation setting below lives in the hot-reloading `plugins/Gloss/real-drops/default.json` document and is editable under **Real drops** in the web editor. Airborne models update their carrier position and transformation every `limits.updateIntervalTicks`; every changed tumble or landing target restarts client interpolation across that interval instead of snapping between samples. After ground contact, Gloss keeps the fast cadence while horizontal velocity remains and until the same grounded rotation has naturally reached a flush face, so the display follows the real item's short ground slide continuously. It switches to `limits.settledPollIntervalTicks` only after both motion and pose are stable. The three authored axis speeds are multiplied by `motion.speedMultiplier`, which ships at `1.35`; setting it to `1` uses the axis values unchanged. A stack uses one to five one-count models as a size cue, bounded by `limits.maxVisualsPerStack`; it never creates one display per carried item. The per-chunk budget counts both item models and labels. If the complete initial presentation does not fit, Gloss leaves that item vanilla-visible.

| Key | Default | Range / behavior |
|---|---:|---|
| `[features] realDrops` | `true` | Enables the complete physical presentation |
| `limits.updateIntervalTicks` | `2` | Airborne transformation cadence; 1 – 20 |
| `limits.settledPollIntervalTicks` | `20` | Grounded state and stack check; 2 – 200 |
| `limits.maxVisualsPerStack` | `3` | Item models per stack; 1 – 5 |
| `limits.maxVisualsPerChunk` | `128` | Gloss-owned item and text displays per chunk; 8 – 1024 |
| `limits.viewRange` | `32.0` | Item-model tracking range; 4 – 128 blocks |
| `limits.spread` | `0.18` | Separation of additional stack models; 0 – 1 block |
| `scale.defaultScale` | `0.4` | Ordinary three-dimensional block models; 0.05 – 2 |
| `scale.flatItems` | `0.65` | Non-block items and vanilla sprite-modeled placeable items, including doors, rails, signs, panes, torches, and plants; 0.05 – 2 |
| `scale.thinBlocks` | `0.45` | Slabs, carpets, pressure plates, and snow layers; 0.05 – 2 |
| `motion.tumble` | `true` | Rotates airborne models |
| `motion.speedMultiplier` | `1.35` | Multiplies all three axis speeds; 0.1 – 4 |
| `motion.degreesPerSecondX` | `160.0` | X speed; -1440 – 1440 |
| `motion.degreesPerSecondY` | `120.0` | Y speed; -1440 – 1440 |
| `motion.degreesPerSecondZ` | `100.0` | Z speed; -1440 – 1440 |
| `motion.variance` | `0.2` | Deterministic per-item speed variation; 0 – 1 |
| `motion.changeOnBounce` | `true` | Selects another deterministic spin after an upward bounce |
| `landing.mode` | `"NATURAL"` | `NATURAL`, `FLAT`, or `UPRIGHT` |
| `landing.tiltDegrees` | `10.0` | Maximum in-face variation for stationary/rebuilt NATURAL blocks; momentum landings preserve their physical heading; 0 – 45 degrees |
| `landing.randomYaw` | `true` | Gives direct landing modes and stationary/rebuilt models a stable yaw |
| `landing.transitionTicks` | `4` | Client interpolation for the final carrier movement and landing pose; 0 – 20 |
| `labels.enabled` | `true` | Mirrors the effective drop name through one TextDisplay |
| `labels.yOffset` | `0.55` | Label translation above the model; 0 – 4 blocks |
| `labels.scale` | `0.85` | Label scale; 0.1 – 4 |
| `labels.viewRange` | `32.0` | Label tracking range; 4 – 128 blocks |
| `labels.billboard` | `"CENTER"` | `CENTER`, `FIXED`, `HORIZONTAL`, or `VERTICAL` |
| `labels.seeThrough` | `true` | Draws through blocks when on |
| `labels.shadow` | `true` | Draws the glyph shadow |
| `labels.background` | `true` | Enables the full label background |
| `labels.backgroundRed/Green/Blue/Alpha` | `0/0/0/80` | Channels clamp to 0 – 255 |
| `filters.disabledWorlds` | `[]` | Case-insensitive world folder names that retain vanilla rendering |
| `filters.materialBlacklist` | `["BEDROCK", "BARRIER"]` | Case-insensitive material names that retain vanilla rendering |
| `filters.onlyPlayerDrops` | `false` | Requires a non-null item thrower UUID |

`NATURAL` carries an ordinary three-dimensional block's airborne quaternion directly through impact. Real horizontal ground travel continues rotating it face-to-face, while a continuous gravity component tips the currently lowest face toward the surface; that attraction strengthens as vanilla friction removes momentum. There is no later face-selection or correction phase: the same rotation reaches flush before Gloss permits settled polling. The model rises by its rotated vertical extent throughout the motion, so no face or corner intersects the surface. Extra stack-copy rotation turns only around the surface normal and cannot lift an edge. Thin horizontal blocks remain level, while non-block items and sprite-modeled placeable items lie flush with the surface. Sprite recognition covers the vanilla placeable items whose supported 26.1.2–26.2 client models inherit the generated-item geometry, including doors, rails, signs, panes, torches, and plants. `FLAT` lays every model down. `UPRIGHT` removes pitch and roll. Airborne tumble directions, offsets, and variation derive from the item UUID and remain stable until a configured bounce change. Custom resource packs can replace client model geometry that the server cannot inspect; those models retain their base material classification. Drop labels ship see-through so cave walls do not occlude the name; set `labels.seeThrough` to `false` for ordinary depth-tested text.

Presentations are removed on merge, pickup, despawn, entity unload, feature reload, and plugin shutdown. New `ItemSpawnEvent` entities reconcile one entity tick after the event, when Bukkit marks them valid; loaded items are rebuilt after enable and entity load. Persistent ownership and restore markers heal an item after an interrupted lifecycle; Gloss restores the prior native visibility and name visibility before rebuilding or falling back. The display carrier and its passengers are non-persistent.

If `[features] drops = false`, Gloss removes its owned custom names as loaded items reconcile. Real-drop models can remain active without labels. A foreign visible custom name is still preserved and mirrored when `[drops] preserveCustomNames = true`. If `[features] realDrops = false`, attached displays are destroyed and native item/name visibility is restored. Both `config.toml` and the real-drop document hot-reload.

## Reference

| Command | Arguments | Permission |
|---|---|---|
| `/gloss bubbles style` | `<style>` (a style id, or `clear`) | `gloss.bubbles.style` |
| `/gloss bubbles reset` | `[name=*]` | `gloss.bubbles.reset` |

Optional arguments must be written as `key=value`. A stray positional value is rejected. Indicators and drop labels have no commands.

`bubbles/` is watched by the shared `DataWatchdog` at `[hotload] watchIntervalTicks` (default 5 ticks). If you add, edit, rename or delete a style file, the change applies live. A style document that fails to parse is logged and skipped. The copy already in memory keeps working. See [Data Files & Hot Reload](/gloss/03-data-files). For the temporary holograms all of this is built on, see [Holograms](/gloss/04-holograms).
