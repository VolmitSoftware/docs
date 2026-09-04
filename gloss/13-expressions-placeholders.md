---
title: "Expressions & Placeholders"
description: "Use placeholders, conditions, inline expressions, and preview expressions in Gloss"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss supports PlaceholderAPI tokens, named text functions, inline expressions, conditions, bubble
motion expressions, and container-preview expressions. Each syntax works only on the surfaces listed
below.

## Which system applies where

| System | Syntax | Applies to |
|---|---|---|
| PlaceholderAPI | `%expansion_key%` | Per-viewer hologram lines, board titles and lines, tablist header, footer and name formats, menu and panel text icons, menu and panel toggle conditions, menu `message` actions |
| Text pipeline functions | `\|name\|` | Hologram lines, board titles and lines, tablist text, menu/panel text and messages, `[drops] nameFormat`, MOTD lines, configured chat-bubble prefixes, and damage indicators |
| Inline text expressions | `{{ expression }}` | Every configured text-pipeline surface above; player/PAPI values require a player-backed surface |
| Particle text ranges | `<particles:name>...</particles>` | Configured text on particle-capable in-world holograms, menus, panels, previews, indicators, and drop labels |
| Conditions | bare boolean expression, no delimiter | Scoreboard selection and variants, tablist variants, bubble-style selection, damage/healing styles and audiences, Real Drops variants and audiences |
| Bubble motion expressions | bare expression source, no delimiter | BubbleStyle schema-4 `motion.translation`, `motion.scale`, `motion.rotation` and `motion.opacity` fields |
| Preview expression DSL | bare expression source, no delimiter | Container preview documents in `plugins/Gloss/previews/` only |

Action commands, icon values, component ids, panel transforms, emoji triggers, and preview selectors
stay as written.

Bubble chat text keeps the emoji and color formatting already applied to the message. Gloss does not
reinterpret it as a function or expression. Only the bubble style's `prefix` and `motion` fields use
configured expressions.

Particle tags are read before functions, inline expressions, and PlaceholderAPI. Dynamic text inside
a tagged range inherits that range, but rendered values cannot add tags. Tags cannot nest. See
[Particle Layers](/gloss/25-particle-layers).

### Bubble motion context

Bubble motion uses the same operators and numeric function library documented below, including `pow` and `smoothstep`, but has its own bounded runtime scope. It exposes `t`, `remaining`, `ageMs`, `lifetimeMs`, `stackIndex`, `stackCount`, `lineCount`, `stackY`, `seed` and `pi`. Translation results are blocks clamped to `-64`..`64`; scale multipliers clamp to `0`..`16`; rotations are finite degrees normalized modulo 360; opacity clamps to `0`..`1`; and each source is limited to 512 characters. See [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops#motion) for the field layout and examples.

## Conditional documents

A condition is the complete JSON string in a `when` field. It has no `{{ }}` wrapper and must
evaluate to a boolean. Gloss parses and type-checks it when the document loads. A syntax or known
type error rejects that document; a missing runtime value, unavailable integration, or evaluation
failure treats that one condition as `false` and leaves the rest of the feature running.

```json
"when": "viewer.world == 'world_nether' && viewer.health < 5"
```

Conditions use the literals, parentheses, arrays, ternary operator, arithmetic, comparisons,
`!`, `&&` and `||` documented below. There is no truthiness conversion: `viewer.health` is a number,
not a condition by itself. String equality and every string helper are case-sensitive.

### Selection and fallback

Every conditional list follows one deterministic rule: the matching entry with the greatest
integer `priority` wins, and equal priorities use the lexicographically smallest `id`. A variant is
a complete presentation and never merges with the base presentation. When no variant matches, the
base presentation is used. Scoreboard documents add one outer contest: only boards whose
`select.when` is true enter it, using `select.priority` and then board id; no match means no sidebar.

### Roles and shared variables

`viewer`, `subject`, and `source` identify the entity a value describes. Scoreboards and tablist
headers use the player as both `viewer` and `subject`. List-name variants and bubble selection use the
player as `subject`. Damage and Real Drops conditions use the affected entity or item as `subject`;
audience checks also receive a live `viewer`. `player.*` is an alias for `viewer.*`.

The live entity fields below exist under each available role:

| Suffix | Type | Meaning |
|---|---|---|
| `name`, `uuid`, `type`, `world` | string | Entity identity, namespaced type key without the namespace, and world folder name |
| `x`, `y`, `z`, `blockX`, `blockY`, `blockZ`, `yaw`, `pitch` | number | Current or event-snapshot pose |
| `dead`, `onGround`, `inWater` | boolean | Entity state |
| `fireTicks`, `freezeTicks`, `ticksLived` | number | Bukkit counters |
| `health`, `maxHealth`, `healthPercent`, `absorption` | number | Damageable-entity state |
| `ai`, `gliding`, `swimming`, `invisible` | boolean | Living-entity state |
| `op`, `online`, `sneaking`, `sprinting`, `flying`, `allowFlight` | boolean | Player-only state |
| `food`, `saturation`, `level`, `experience`, `totalExperience`, `ping`, `clientViewDistance` | number | Player-only state |
| `gameMode`, `locale`, `group` | string | Lowercase game mode, client locale and Vault primary group |

`world.name`, `world.uuid`, `world.environment`, `world.difficulty`, `world.time`,
`world.fullTime`, `world.storm`, `world.thundering`, `world.pvp` and `world.players` describe the
condition location's world. `viewer.world` is already the world-name string; it is not an object, so
write `viewer.world == 'world'` or `world.name == 'world'`, not `viewer.world.name`.

Calendar values are `time.epochMs`, `time.hour`, `time.minute`, `time.second`, `time.dayOfWeek`
(Monday 1 through Sunday 7), `time.dayOfMonth` and `time.month`. The standard text scope also
supplies `time.ms`, `time.seconds`, `time.ticks`, `server.online`, `server.maxPlayers` and
`server.tps`.

### Condition functions

Arity is exact in conditions; the explicit fallback is required for PAPI and metric calls.

| Function | Result | Behavior |
|---|---|---|
| `oneOf(value, ['a', 'b'])` | boolean | Exact string membership |
| `contains(value, part)` | boolean | Exact substring test |
| `startsWith(value, prefix)` / `endsWith(value, suffix)` | boolean | Exact prefix or suffix test |
| `matchesGlob(value, pattern)` | boolean | Whole-string glob; `*` matches any run and `?` one character |
| `hasPermission(role, node)` | boolean | Tests a live player role |
| `inGroup(role, group)` | boolean | Case-insensitive comparison with a live player's Vault primary group |
| `inRegion(role, region)` | boolean | Tests a live entity role through the optional WorldGuard hook |
| `papi(role, key, fallback)` | string | Resolves PlaceholderAPI for a live player role; otherwise returns the string fallback |
| `papiNumber(role, key, fallback)` | number | Numeric PlaceholderAPI result or numeric fallback |
| `metric(key, fallback)` | number | Demand-driven integration metric or numeric fallback |

The normal math, conversion, color and animation-expression functions remain available, but the
complete condition must still return a boolean. A role function needs a live role. Immutable
`source.*` fields captured for damage and drop events do not turn that source into a live player for
`hasPermission`, `inGroup` or PAPI.

Public global React samplers use `react.sampler.<sampler-id>`. For example,
`metric('react.sampler.ticks-per-second', 20) < 18` reads React's global TPS sampler. Chunk and player
samplers are not available through this bridge.

### Surface-specific values and cadence

| Surface | Additional values | Evaluation |
|---|---|---|
| Scoreboard `select.when` and variants | live viewer/player values | Every `[boards] updateIntervalTicks`; manual sticky selection fixes the board id but its variant still updates |
| Tablist header/footer variants | live viewer/player values | Every ordinary or shared fast tablist refresh |
| Tablist list-name variants | live subject/player values | Every ordinary or selected fast tablist refresh |
| Bubble-style `select.when` | live speaker values | Once per chat message |
| Damage/healing style and variants | `event.*`, immutable `subject.*` and `source.*` | On the affected entity's owning thread after the applied health delta is known |
| Damage audience | live `viewer.*` plus the immutable event snapshot | At spawn and when that viewer joins, respawns, changes world or crosses a chunk boundary while the indicator lives |
| Real Drops variants | `drop.*`, `event.*`, immutable subject/source/world values | On the item-owning thread when its presentation is selected |
| Real Drops audience | live `viewer.*` plus the immutable item snapshot | Per nearby viewer while the presentation reconciles |

Damage events add `event.type`, `event.cause`, `event.amount`, `event.reportedAmount`,
`event.damage`, `event.healing`, `event.critical`, `event.criticalKnown` and
`event.directSourceType`. Paper and Paper-derived servers supply their exact critical-hit flag;
Spigot supplies `false` for both critical fields on entity damage because its API cannot make that
determination. Healing and non-entity damage are known non-critical. Use
`event.criticalKnown && event.critical` when a variant must match only an authoritative critical hit.
The direct Bukkit damager is captured
only when owned by the affected entity's current region; otherwise `source.*` and
`event.directSourceType` use their defaults. A projectile is never followed to a remote shooter.
Real Drops adds the complete `drop.*`
catalog documented on [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops#real-drops),
plus `event.type` and `event.playerDrop`.

## PlaceholderAPI substitution

### In rendered text

The text pipeline runs functions first, inline expressions second, and PlaceholderAPI third. Emoji
and colors run last.

The placeholder stage runs only when all three conditions hold:

- `[text] placeholders` is `true` (the default),
- the render has a viewer, and
- the string contains at least one `%`.

A render without a viewer skips PlaceholderAPI substitution:

| Surface | Viewer | Placeholders resolve |
|---|---|---|
| Personalized hologram lines | the player receiving metadata for the shared entity | yes |
| Shared hologram lines | none | no |
| Board title and lines | the board's holder | yes |
| Tablist header, footer, name formats | the player being formatted | yes |
| Menu/panel text, conditions and messages | the session player | yes |
| Container preview expressions | the preview viewer, except console/static diagnostics | `papi(...)` calls only; raw `%...%` is modulo syntax |
| BubbleStyle prefix | the speaker | yes |
| `[drops] nameFormat` | none | no |
| MOTD lines | none | no |
| Damage indicators | none | no |

A hologram renders per viewer when a line contains a complete `%name%`, `|function|`, or viewer-backed
`{{ expression }}` token and `[holograms] perViewerPlaceholders` is `true`.

If you set that key to `false`, every hologram renders once for all viewers. Lines with `%` then keep
the tokens. See [Holograms](/gloss/04-holograms).

### In menu and panel documents

Menu documents use the same full viewer-aware renderer in three places:

| Field | Where | When it expands |
|---|---|---|
| text icon `text` | any text icon in a menu or panel | when opened, then every `refreshTicks` while visible |
| toggle `condition` | toggle component | once when opened |
| `message` action `message` | menu action | every time the action fires |

These fields honor `[text] functions` and `[text] placeholders` exactly like boards and tablists.

A panel shows the menu document that `rootMenuId` names. Those fields behave the same in panels. See
[Hologram Menus](/gloss/09-menus), [Components & Hitboxes](/gloss/10-components-hitboxes),
[Icons](/gloss/11-icons) and [Panels](/gloss/16-panels).

#### Text icon refresh

A text icon splits its `text` on `\n`. It expands each line when the icon is built. `refreshTicks`
then controls later re-expansion:

- omitted, the value is `10` ticks.
- the accepted range is `0` to `1200`, and a value outside it rejects the document with
  `refreshTicks must be between 0 and 1200`.
- `0` disables refreshing, so the icon keeps its initial text.

Refresh is skipped when the source text has no complete `%name%`, `|function|` or `{{ expression }}` token. Static text costs nothing at
any `refreshTicks` value.

When a refresh produces different text, the display name updates in place. A changed line count
respawns that icon. Either path rebuilds the click geometry. If a refresh throws, Gloss keeps the
previous text. Gloss logs once per icon and names the menu and the player. The next successful
refresh re-arms that warning.

#### Toggle conditions

A toggle state is the full rendered `condition` compared to `expectedValue` with
`equalsIgnoreCase`.

- The comparison is case-insensitive, unlike expression string equality.
- A condition with no dynamic token is compared as a literal, so
  `"condition": "yes"` with `"expectedValue": "YES"` is a toggle that always starts on.
- The condition is read once when the toggle opens. Clicking it flips the stored state and runs
  `trueActions` or `falseActions`. It never re-reads the condition.

### Why the MOTD cannot resolve placeholders

A server-list ping happens before a player joins, so player placeholders have no viewer to resolve against. They remain unchanged in the MOTD.

Functions, viewer-free inline expressions, emoji and colors still apply to the MOTD. Native
`time.*` and `server.*` variables, server aliases such as `papi('server_online')`, and explicit
fallbacks work. Player values do not. See
[Tablist & Server List MOTD](/gloss/06-tablist-motd).

The current round-trip latency cannot affect the MOTD either. The server sends its status response,
including the MOTD, before the protocol's ping/pong measurement exists. A later or previous-session
latency estimate would be different data, not the ping being answered.

### Substitution behavior

Gloss leaves the input unchanged when there is no player, no `%` token, or no enabled PlaceholderAPI
plugin. A late PlaceholderAPI enable becomes available shortly without a Gloss reload. Failed lookups
leave the token unresolved and log one warning.

## The `gloss` expansion

Gloss publishes a PlaceholderAPI expansion named `gloss`. Keys use `%gloss_<key>%`.

The key part is lowercased before lookup. `%gloss_MENU.ID%` resolves the same as `%gloss_menu.id%`.

| Placeholder | Value |
|---|---|
| `%gloss_available%` | Always `true`. Its presence is how a consumer detects that Gloss is running |
| `%gloss_menu.open%` | `true` when the player currently has a menu session open, otherwise `false` |
| `%gloss_menu.id%` | The id of the open menu, or `---` when no menu is open |

These are the only Gloss placeholders.

An unknown key resolves to `null`. PlaceholderAPI then leaves the token in the text as written.
`%gloss_nonsense%` comes out as `%gloss_nonsense%`, not as an empty string.

If a resolver fails, Gloss returns `---` and logs the key once, up to 64 distinct keys.

The expansion is registered during enable. Registration runs only when PlaceholderAPI is already an
enabled plugin at that moment. Unlike the consumer side, registration is not retried. If
PlaceholderAPI enables after Gloss, the expansion stays unregistered until the next server start.

`%gloss_menu.id%` and `%gloss_menu.open%` are available to the opened menu's toggle conditions and
text icons.

The API side of this is covered in [API: Placeholders](/gloss/23-api-placeholders).

## Text pipeline functions

A function token is a name between two pipe characters, such as `|animation.rainbow|`. Later pipeline
stages also process the function's result.

- The whole stage is skipped when `[text] functions` is `false`, when the string contains no `|`, or when
  no functions are registered at all.
- A name with no registered function is left in place, pipes included. Scanning then resumes from that
  closing pipe, so it can serve as the opening pipe of the next candidate.
- A function that returns `null` renders as an empty string.
- A function that throws renders as an empty string and logs one warning per function name
  (`Text function |<name>| failed: ...`). That warning is not repeated until the function is registered
  again or `/gloss reload` runs.

### The function catalog

Gloss registers animation and integration-metric functions. Other plugins cannot register another
family.

`|animation.<id>|` reads a loaded animation document. Frames use the server clock, so every surface
shows the same frame at the same time.

If you set `[features] animations = false`, Gloss unregisters the family. Those tokens then survive
the stage and appear as written. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations).

`|metric.<key>|` represents one token per metric that another installed Volmit plugin publishes. The
integration bridge registers them. The key is the publishing plugin's own dotted key. The token
reads `|metric.adapt.player-sessions|`.

Values render in compact form (`42`, `3.14`, `1.2K`, `1.5M`, `2B`, `3.5T`). A metric that is
unavailable, or that has not been sampled yet, renders as an empty string. A key that belongs to a
plugin that is not installed is never registered. That token stays in the line as written.

Gloss's own `gloss.*` metrics are available to React, not through `|metric.|` tokens.

### Demand-driven sampling

Gloss samples an integration metric only while a token or preview is using it. Demand expires 60
seconds after the last request, and the least recently used keys are removed when more than 256 are
requested.

- **One interval of warm-up.** The first render of a token asks for the key and gets an empty
  string. The value appears on the next sampler pass, `[integration] sampleIntervalTicks` later
  (default 20 ticks). The same holds after a `/gloss reload` and after a plugin enables or disables.
- **No idle sampling.** Gloss does not call another plugin's sampler when no content uses its metrics.

### Menus and panels

Menu and panel text icons, toggle conditions and `message` actions receive the session player and
use the same function, inline-expression, PlaceholderAPI, emoji and color facilities as boards.
Text icons refresh complete dynamic tokens at `refreshTicks`; conditions render once per session;
messages render each time the action fires.

## Inline text expressions

Write an expression between `{{` and `}}` anywhere the text pipeline runs. Function tokens resolve
first, then inline expressions, PlaceholderAPI, emoji and colors. A malformed expression stays
visible as written and logs once, so a typo does not silently erase the surrounding line.

```text
{{ hex(mix(#FF55FF, #55FFFF, (sin(time.seconds * 2) + 1) / 2)) }}&lLIVE
&7Player &f{{ player.name }}
&7Health &a{{ bar(player.health, 20, 10, '■', '□') }}
&7TPS &a{{ fixed(server.tps, 1) }}
&7Rank {{ papi('vault_prefix', '&7Member') }}
&7Tick &f{{ fixed(metric('react.tick-ms', 1000 / server.tps), 1) }}ms
```

Built-in live variables are `time.ms`, `time.seconds`, `time.ticks`, `server.online`,
`server.maxPlayers`, `server.tps`, `player.name`, `player.ping`, `player.health`, and `player.level`.
They do not require another plugin. `player.*` requires a viewer, so it does not work in MOTDs or
other static renders.

`papi(...)` and `papiNumber(...)` use PlaceholderAPI first when a viewer and the expansion are
available. If the token remains unresolved, Gloss supplies native fallbacks for `player_name`,
`player_ping`, `player_health`, `player_level`, `server_online`, `server_max_players` and
`server_tps`; surrounding `%` signs are optional. The player aliases still require a viewer, while
the server aliases work on viewer-free surfaces. Other PAPI keys need a viewer or an explicit typed
fallback. The former `react.tps` metric key resolves to Gloss's native `server.tps`; new content
should use `server.tps` directly.

Use built-in variables for Gloss values, PAPI for expansion-specific values, and `metric` for values
published by integrations. Optional sources accept a fallback as the second argument. Without a
fallback, missing or invalid values remain errors.

| Function | Result |
|---|---|
| `papi('vault_prefix', '&7Member')` | Resolves a PlaceholderAPI key; surrounding `%` are optional. The optional string fallback is used when it cannot resolve |
| `papiNumber('vault_eco_balance', 0)` | Resolves PAPI and parses its first numeric value for math. The optional numeric fallback covers an absent expansion or non-numeric answer |
| `metric('react.tick-ms', 1000 / server.tps)` | Reads a numeric integration metric and activates demand-driven sampling. The optional numeric fallback covers an absent publisher or unsampled key |
| `select(list, index)` | Floors the index to a signed 64-bit value, wraps it and returns any list entry |
| `number(value)` | Parses the first number from a number or formatted string |
| `bar(value, maximum, width, filled, empty)` | Builds a clamped 1–64-character progress bar |
| `hex(color)` | Converts an expression color to `[RRGGBB]` for the later color stage |
| `align(text, width, mode)` | Pads visible text to 1–16384 character cells using `left`, `center`/`middle` or `right`, without truncating longer content |
| `marquee(text, width, step)` | Scrolls plain text through a fixed-width window |
| `timeline([[text, seconds], ...], elapsedSeconds)` | Loops independently timed text scenes |
| `typewriter(text, step, holdSteps)` | Types, holds and erases plain text |
| `flash(first, second, step)` | Alternates complete snippets |
| `wipe(text, step)` | Reveals and hides plain text at stable width |
| `scanner(text, baseStyle, highlightStyle, step)` | Moves a formatting highlight across text |
| `scramble(text, step)` | Resolves deterministic randomized glyphs into text |
| `odometer(from, to, progress, digits)` | Interpolates and zero-pads a whole number |
| `wave(text, styles, step)` | Chases formatting styles across text |

The math, ternary, string, color, and list functions below also apply. Inline expressions update at
the consuming surface's refresh rate. Time expressions can animate without an animation document;
`|animation.<id>|` remains useful for reusable frame sets.

A surface cannot show frames between its refreshes. By default, boards refresh every 20 ticks and
tablists every 40 ticks. Use `floor(time.seconds)` for one-second board steps or
`floor(time.seconds / 2)` for two-second tablist steps.

The animation helpers are bounded, stateless string transforms. Pass `floor(time.seconds / 2)` as
the step for content intended to remain visible on the default tablist cadence. Character-transform
helpers require plain single-line input so they cannot split a color token or common combined glyph. See
[Emoji, Text & Animations](/gloss/07-emoji-text-animations) for signatures, limits and the composed
timeline example.

`align` is a layout helper rather than an animation. It counts visible Unicode code points while
ignoring legacy and bracket-hex formatting, then adds spaces without terminating content that is
already wider than the requested width. Alignment is character-cell based, not proportional-font
pixel measurement. Raw PlaceholderAPI substitution happens after inline expressions; use
`align(papi('key', ''), 20, 'right')` when the resolved placeholder width must be counted.

## The preview expression DSL

Container preview expressions occupy an entire field and can read target state such as furnace cook
time. They also support `time.*`, `server.*`, `player.*`, `papi`, `papiNumber`, and `metric`. Static
validation and console dumps have no player, so player values need a fallback there.

The lexer has no `%…%` form. A bare `%` is the modulo operator. A `%` inside a string literal is an
ordinary character.

Use `papi('key', 'fallback')` for a PlaceholderAPI expansion or register a `PreviewStateProvider`
and read `<namespace>.<key>` for typed live state. See [API: Previews](/gloss/24-api-previews). The
document format is documented in [Container Previews](/gloss/15-container-previews).

### Furnace expressions at a glance

This element repeats cells across a furnace progress gauge. Its color follows the furnace state:

```json
{
  "type": "cell",
  "repeat": { "count": "vars.segments", "var": "i" },
  "x": "round((i - (vars.segments - 1) / 2) * vars.segmentGap)",
  "size": "vars.segmentSize",
  "color": "cookTime > 0 && cookTimeTotal > 0 ? (i < ceil(cookTime / cookTimeTotal * vars.segments) ? mix(vars.fill, vars.pulse, (sin(time / vars.pulseRate + i) + 1) / 2) : vars.wellColor) : vars.wellColor"
}
```

The division guard handles an idle furnace with a zero total. `vars.*` values are document constants;
`cookTime`, `cookTimeTotal`, and `time` are live values; `i` exists only inside the repeat.

Labels can combine the same values with inventory functions and localization:

```json
{
  "type": "label",
  "text": "occupied(0) ? '&f' + readable(item(0)) + ' ×' + str(count(0)) + '  &7' + (cookTimeTotal > 0 ? bar(cookTime, cookTimeTotal, 12, '■', '□') : '□□□□□□□□□□□□') : '&c' + lang('gloss.preview.state.no_input')"
}
```

See the [furnace expression walkthrough](/gloss/15-container-previews#furnace-expression-walkthrough)
for a complete example.

### Expression-capable fields

Every field in a preview document falls into one of three forms.

| Form | Accepts | Fields |
|---|---|---|
| number or expression | a JSON number, or a JSON string parsed as an expression | `elements[].x`, `.y`, `.z`, `.width`, `.height`, `.size`, `.index`, `.color`, `.wellColor`, `.background`, `elements[].repeat.count` |
| boolean or expression | a JSON boolean, or a JSON string parsed as an expression | `elements[].visible`, `card.framed` |
| expression only | always a string, always parsed as an expression | `elements[].text`, `card.title`, `card.accent` |

Fields that are never expressions: `match.*` and `variants[].*` selectors, `elements[].type`,
`elements[].repeat.var` and `card.minHalfWidth`. A required numeric field rejects both an absent key and an
explicit `null`. An optional one falls back to its default.

`match.vars` and `variants[].vars` accept JSON numbers, booleans, and strings. They are not expressions.
A string beginning with `#` is parsed as an ARGB color; an invalid color is a compile error. Other
color-like strings, such as `"<#F2A535>"`, remain text.

### There is no delimiter

An expression field's string value is the whole expression source. No `${…}`, `%…%` or other wrapper
starts evaluation. None of those wrappers suppress it.

- `"width": 64` is the number 64. `"width": "64"` is an expression that happens to be a literal.
- In the three expression-only fields, literal text needs inner quotes: `"text": "'Idle'"`. Writing
  `"text": "Idle"` parses as a reference to a variable named `Idle` and fails to compile.
- A JSON number in an expression-only field binds to its text form, so `"text": 5` compiles as the number 5.

### Evaluation cadence

Expressions without variables or function calls are evaluated when the document loads. Other fields
are evaluated when the preview opens. Only the fields below continue updating every four ticks.

| Field | Evaluated |
|---|---|
| `elements[].color` on a `cell` | live, every four ticks |
| `elements[].text` on a `label` | live, every four ticks, unless it folded to a constant, in which case the Component is parsed once and reused |
| Everything else, including `panel` and `slot` colors, `wellColor`, `index`, `background`, `visible`, `repeat.count`, `card.framed`, `card.title` and `card.accent` | once, per build |

Because folding happens at load, a constant expression that throws is a load error. `"x": "1 / 0"`
rejects the whole document.

### Runtime values

Values can be numbers, strings, booleans, or lists. There is no null, integer type, or truthiness
conversion. Operators reject incompatible types.

### Literals

| Literal | Syntax | Value |
|---|---|---|
| Number | `123`, `3.5` | `Double`. No exponent notation, no leading `.`, and no sign. A leading `-` is the unary operator |
| Color | `#RGB`, `#RRGGBB`, `#AARRGGBB` | `Double` holding the unsigned 32-bit ARGB. `#RGB` doubles each nibble and prepends alpha `FF`. `#RRGGBB` prepends alpha `FF`. `#AARRGGBB` is taken as written. Any other hex-digit count is `bad hex length` |
| String | `'text'` or `"text"` | `String`. Escapes are `\\`, `\'`, `\"` and `\n`. Anything else after a backslash is `unrecognized escape sequence`. A missing closing quote is `unterminated string` |
| Boolean | `true`, `false` | `Boolean` |
| Array | `[a, b, c]`, `[]` | `List<Object>`. Useful only as a `palette` argument. There is no indexing syntax or list operator, and stringifying a list is an error |

Identifiers match `[A-Za-z_][A-Za-z0-9_]*` and may be dotted, as in `inventory.size`. A `.` continues
an identifier only when the next character is a letter or `_`. Call names may not be dotted, which is
`call names cannot be dotted`.

### Operators and precedence

Lowest to highest. Every binary level is left-associative. The ternary is right-associative.

| # | Level | Operators | Operands | Result |
|---|---|---|---|---|
| 1 | Ternary | `c ? a : b` | condition boolean, branches any | branch type |
| 2 | Or | `\|\|` | boolean | boolean |
| 3 | And | `&&` | boolean | boolean |
| 4 | Equality | `==` `!=` | number/number, string/string, boolean/boolean | boolean |
| 5 | Relational | `<` `<=` `>` `>=` | number | boolean |
| 6 | Additive | `+` `-` | number, or string for `+` | number or string |
| 7 | Multiplicative | `*` `/` `%` | number | number |
| 8 | Unary prefix | `-` `!` | number / boolean | number / boolean |
| 9 | Primary | literal, `( )`, `[ ]`, variable, call | | |

`&&` and `||` short-circuit. When the left operand decides the result, the right operand is not
evaluated at all. Its variables and calls are never resolved. The ternary evaluates only the branch
it takes. Equality across mismatched types is an error (`cannot compare number and string`), not
`false`.

### Strings and `+`

`+` concatenates when either operand is a `String`. It adds numerically otherwise. Both sides convert
with one shared rule. `str(x)` also applies that rule:

| Value | Text |
|---|---|
| `String` | unchanged |
| A finite `Double` equal to `Math.rint(x)` | integer form, so `54.0` renders `54` and `1e9` renders `1000000000` |
| Any other `Double` | `Double.toString`, so `3.5` renders `3.5` |
| `Boolean` | `true` / `false` |
| `List` | error: `cannot convert list to string` |

String equality is exact and case-sensitive. The relational operators reject strings.

### `%` versus `mod`, and division by zero

`%` is Java's remainder. Its sign follows the left operand. `mod(a, b)` is floor-mod,
`a - floor(a / b) * b`. `7 % 3` and `mod(7, 3)` both give `2`. `-1 % 3` gives `-1`. `mod(-1, 3)`
gives `2`. Use `mod` when you want a non-negative wrap.

A zero right operand throws `division by zero` in `/`, `%` and `mod` alike. `mod` guards this
deliberately rather than producing `NaN`. The two remainder operations then agree.

### Colors

A color is an unsigned 32-bit ARGB number. Channel order is alpha, red, green, then blue.

`#RGB` and `#RRGGBB` are opaque because the parser prefixes `FF`. Only `#AARRGGBB` carries its own
alpha. `rgb()` likewise packs an opaque alpha. `argb()` and `alpha()` set it explicitly. A plain JSON
number in a color field with no high byte set is fully transparent.

## The function library

Arity is exact. A mismatch throws `<name> expects <n> argument(s), got <m>`. A wrong argument type
throws `<name> argument <1-based index> must be a number`, `... a string` or `... a list`.

| Function | Arity | Arguments | Returns | Behavior |
|---|---|---|---|---|
| `clamp(x, lo, hi)` | 3 | number ×3 | number | `min(max(x, lo), hi)` |
| `lerp(a, b, t)` | 3 | number ×3 | number | `a + (b - a) * t`. `t` is not clamped |
| `min(a, b)` | 2 | number ×2 | number | Smaller of the two |
| `max(a, b)` | 2 | number ×2 | number | Larger of the two |
| `floor(x)` | 1 | number | number | Largest integer not greater than `x` |
| `ceil(x)` | 1 | number | number | Smallest integer not less than `x` |
| `round(x)` | 1 | number | number | `floor(x + 0.5)`, so `round(-2.5)` is `-2` |
| `abs(x)` | 1 | number | number | Absolute value |
| `mod(a, b)` | 2 | number ×2 | number | Floor-mod. `b == 0` throws `division by zero` |
| `sin(x)` | 1 | number, radians | number | Sine |
| `cos(x)` | 1 | number, radians | number | Cosine |
| `pow(base, exponent)` | 2 | number ×2 | number | `base` raised to `exponent` |
| `smoothstep(edge0, edge1, x)` | 3 | number ×3 | number | Clamps `(x - edge0) / (edge1 - edge0)` to `0`..`1`, then applies `t²(3 - 2t)` |
| `rgb(r, g, b)` | 3 | number ×3 | color | Opaque color. Channels rounded and clamped to `[0, 255]`, alpha forced to `FF` |
| `argb(a, r, g, b)` | 4 | number ×4 | color | As `rgb`, with an explicit alpha channel |
| `alpha(color, a)` | 2 | color, number | color | Replaces only the alpha byte. `a` is rounded and clamped to `[0, 255]` |
| `mix(c1, c2, t)` | 3 | color, color, number | color | Per-channel blend including alpha, `round(a + (b - a) * t)`, with `t` clamped to `[0, 1]` |
| `palette(list, index)` | 2 | list of numbers, number | number | Floors the index to a signed 64-bit value, then returns `list[floorMod(index, size)]`. An empty list throws `palette list must not be empty`. A non-number entry throws `palette list entries must be numbers` |
| `select(list, index)` | 2 | list, number | any list entry | Floors the index to a signed 64-bit value, then returns `list[floorMod(index, size)]`. An empty list throws `select list must not be empty` |
| `str(x)` | 1 | number, string or boolean | string | The stringify rule above |
| `fixed(x, digits)` | 2 | number, whole number in `[0, 20]` | string | Root-locale `%.<digits>f`. Fractional, negative or `> 20` digits throw |
| `plain(s)` | 1 | string | string | Removes legacy codes matching `&[0-9A-Fa-fK-Ok-oRr]`. Every other `&` survives |
| `readable(s)` | 1 | string | string | Lowercases, splits on `_`, upper-cases each segment's first character and joins with spaces, so `IRON_ORE` becomes `Iron Ore` |
| `align(s, width, mode)` | 3 | string, whole number in `[1, 16384]`, string | string | Pads visible code points using `left`, `center`, `middle` or `right`; formatting does not consume width and longer content is returned whole |

### Preview context functions

These preview functions resolve before the shared library and are available in every preview document.

| Function | Arity | Arguments | Returns | Behavior |
|---|---|---|---|---|
| `lang(key, ...)` | 1 or more | string key, then any values | string | Resolves `key` through the current viewer’s language when a viewer is available, otherwise the server default. Positional arguments bind onto the resolved English template's `{placeholder}` names in first-appearance order. Extras are named `arg<n>` and go unused. Values are stringified with `str` and inserted as untrusted text, so a container name cannot smuggle in color codes. An id the catalog does not declare fails the label with `lang: Unknown message key: <id>` |
| `count(slot)` | 1 | number | number | Stack size in that slot of the previewed inventory. `0` for an empty slot, an out-of-range index, or no inventory |
| `occupied(slot)` | 1 | number | boolean | Whether that slot holds a non-empty stack |
| `item(slot)` | 1 | number | string | Material id in that slot, such as `IRON_ORE`, or `""` when the slot is empty, out of range, or there is no inventory. Pair with `readable(item(0))` for display text |
| `papi(key, fallback?)` | 1 or 2 | string key, optional string fallback | string | Same PlaceholderAPI-first and native-fallback behavior as inline text expressions |
| `papiNumber(key, fallback?)` | 1 or 2 | string key, optional numeric fallback | number | Numeric PlaceholderAPI/native value for preview math |
| `metric(key, fallback?)` | 1 or 2 | string key, optional numeric fallback | number | Reads a demanded integration metric |

Slot indexes are floored. Calling `lang` with no argument, or with a non-string first argument,
throws. Localization keys are covered in [Localization](/gloss/19-localization).

> Function **names** are not checked at compile time; only their arguments are. An unknown name throws
> `unknown function: <name>` when the expression runs. Since any call makes an expression non-constant, a
> misspelled function never fails at load. It fails at build or at refresh.
{.is-warning}

## Variables

### Resolution order

1. An element carrying a `repeat` wraps the scope so the loop variable name answers exactly, and everything
   else delegates to the parent.
2. A name starting with `vars.` reads the document's injected constants: `match.vars` with the matching
   variant's `vars` merged over them.
3. Everything else reads the sampled state snapshot, which contains the built-in variables for the target's category plus
   every registered provider namespace, merged flat as `<namespace>.<key>`.
4. A name absent from preview state delegates to the standard text expression scope for `time.*`,
   `server.*`, `player.*` and integration metrics.

Gloss samples preview state when first needed and refreshes it once per game tick. Viewerless or
worldless previews use a wall-clock tick counter.

### Built-in variables

The `universal` group is published in every context: `time`, `blockType` and `customName`. The
`inventory` group, `inventory.size` and `inventory.occupied`, is published whenever the target has an
inventory.

Exactly one category group is published on top of those. The group is chosen at context construction
from the block state, entity or inventory type: `furnace`, `brewing`, `beehive`, `cauldron`,
`jukebox`, `inventory` or `static`.

The full target-state catalog with types and fallback values is in
[Container Previews](/gloss/15-container-previews). Preview expressions also publish
`time.ms`, `time.seconds`, `time.ticks`, `server.online`, `server.maxPlayers`, `server.tps`,
`player.name`, `player.ping`, `player.health` and `player.level`. The `player.*` values are absent in
viewerless static/console contexts rather than invented.

### Document variables and repeat variables

`vars.<name>` reads a constant from `match.vars` or from a variant's `vars`. Document variables are
reachable only under the `vars.` prefix. They can never shadow a built-in name. A built-in name can
never shadow them.

Repeat variables are bare identifiers. The default name is `i`. The values are `0` through
`count - 1` as numbers. `repeat.var` must be a valid identifier. It may not be `vars` or any
catalogued name. That collision would make the loop variable unreachable.

### Provider namespaces

Registered `PreviewStateProvider` values use `<namespace>.<key>` and must be numbers, strings, or
booleans. Unsupported values are ignored.

A provider whose namespace collides with a built-in group is dropped whole. Gloss warns about it
once. A provider that throws is skipped. Gloss warns about it once per namespace.

### Metrics from other plugins

Integration metrics are preview variables under their native dotted names.
`|metric.adapt.player-sessions|` in text becomes `adapt.player-sessions` in a preview expression.

The namespace is the first segment of the metric key. A plugin that publishes `iris.generation-time`
occupies the `iris` namespace. The built-in collision rule applies to it like any other provider.

Reading a metric keeps it sampled while the preview is open. Sampling stops 60 seconds after the last
use.

The one-interval warm-up applies here too. It is sharper than in text. A preview expression that
references a variable that is not yet present fails to evaluate.

During warm-up the label reports `label text: unknown variable: adapt.player-sessions` and renders
empty. From the next sampler pass on it renders normally. A metric the publishing plugin reports as
unavailable behaves the same way. The variable is absent. It is not invented as zero.

### Compile-time checking

| Reference | Result |
|---|---|
| A catalogued built-in name | accepted |
| `vars.<declared>` | accepted |
| `vars.<undeclared>` | compile error `unknown variable: vars.<name>` |
| A bare name in the enclosing repeat scope | accepted |
| Any other bare name | compile error `unknown variable: <name>` |
| A dotted name whose prefix is a reserved built-in namespace | Compile error because a provider can never fill it |
| A dotted name whose prefix is not reserved | warning `references provider namespace '<name>', not verifiable at parse time`. Resolved, or failed, at runtime |

## Limits and errors

| Guard | Value | Behavior |
|---|---|---|
| Parser recursion depth | 256 | `expression too deeply nested`. Parenthesised, bracketed and call-argument sub-expressions re-enter the ternary production, so they count against the cap |
| Constant `repeat.count` | 1024 | Load error naming the cap |
| Live `repeat.count` | 1024 | Truncated at render, with a message |
| Total compiled templates | 4096 | Load error naming the cap |

Parse errors carry the 0-based source character index. They are reported with the field path. An
example is `elements[3].color: unexpected token at 7`. Evaluation errors carry no position. They are
reported without that suffix.

A document that fails to load logs `previews/<name>.json: <detail>` at `WARNING` and is not
registered. The next matching document is used instead, or none. Render-time failures never take a
frame down. The failing element is skipped or falls back. The rest of the document still renders.
The per-failure fallbacks are listed in [Container Previews](/gloss/15-container-previews).

## Reference

| Config key | Default | Effect |
|---|---|---|
| `[text] placeholders` | `true` | PlaceholderAPI stage of the text pipeline, including menus and panels |
| `[text] functions` | `true` | `\|function\|` stage of the text pipeline |
| `[holograms] perViewerPlaceholders` | `true` | Lets holograms with complete dynamic tokens render per viewer |
| `[features] animations` | `true` | Registers the `\|animation.<id>\|` functions |
| `[features] previews` | `true` | Container previews, and therefore the expression DSL |

| Placeholder | Value when unset |
|---|---|
| `%gloss_available%` | always `true` |
| `%gloss_menu.open%` | `false` |
| `%gloss_menu.id%` | `---` |

Related pages: [Holograms](/gloss/04-holograms),
[Emoji, Text & Animations](/gloss/07-emoji-text-animations),
[Hologram Menus](/gloss/09-menus),
[Icons](/gloss/11-icons),
[Container Previews](/gloss/15-container-previews),
[API: Placeholders](/gloss/23-api-placeholders),
[API: Previews](/gloss/24-api-previews).
