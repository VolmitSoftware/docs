---
title: "Expressions & Placeholders"
description: "Use placeholders, conditions, inline expressions, and preview expressions in Gloss"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss has several text systems. Each one works only on the surfaces listed below.

## Which system applies where

| System | Syntax | Applies to |
|---|---|---|
| PlaceholderAPI | `%expansion_key%` | Per-viewer hologram lines, entity-overlay templates, board titles and lines, tablist text, menu/panel text and conditions, menu messages, configured bubble prefixes, and personalized indicator/drop-label text |
| Text pipeline functions | `\|name\|` | Hologram lines, entity-overlay templates, board titles and lines, tablist text, menu/panel text and messages, drop-label formats, MOTD lines, configured chat-bubble prefixes, and damage indicators |
| Inline text expressions | `{{ expression }}` | Every configured text-pipeline surface above; player/PAPI values require a player-backed surface |
| Particle text ranges | `<particles:name>...</particles>` | Configured text on particle-capable in-world holograms, menus, panels, previews, indicators, and drop labels |
| Show conditions | boolean or boolean expression string | Display visibility; see [Show conditions](#show-conditions) |
| Conditions | bare boolean expression, no delimiter | Scoreboard selection and variants, tablist variants, bubble-style selection, damage/healing styles and audiences, Real Drops variants and audiences |
| Bubble motion expressions | bare expression source, no delimiter | BubbleStyle schema-5 `motion.translation`, `motion.scale`, `motion.rotation` and `motion.opacity` fields |
| Preview expression DSL | bare expression source, no delimiter | Container preview documents in `plugins/Gloss/previews/` only |

Action commands, icon values, component ids, panel transforms, emoji triggers, and preview selectors
stay as written. Bubble chat text keeps the emoji and colors already applied to the message; only a
bubble style's `prefix` and `motion` fields take expressions. Motion uses the operators and numeric
functions below, including `pow` and `smoothstep`, over its own variable set documented on
[Chat Bubbles](/gloss/08-chat-bubbles#motion).

Particle tags are read before functions, expressions and PlaceholderAPI. Dynamic text inside a
tagged range inherits it, rendered values cannot add tags, and tags cannot nest. See
[Particle Layers](/gloss/25-particle-layers).

## Show conditions

`show` takes a JSON boolean or a string holding a boolean expression, and defaults to `true`. It is
an extra gate: feature switches, `enabled`, `when`, permissions, ranges and audience rules still
apply. Each line below is one alternative value for the same field.

```json
"show": false
"show": "world.name != 'world_nether'"
"show": "world.time > 12000"
"show": "world.name == 'survival' && world.time > 12000"
"show": "viewer.sneaking"
"show": "papi('viewer', 'key', 'false') == 'true'"
```

`world.time` is Minecraft time of day in ticks; `time.hour` is calendar time. Wrapping the whole
expression in `{{ }}` is accepted but optional. A raw `%placeholder%` is not a condition — use
`papi` or `papiNumber`. Drop labels use `[drops] show` in `gloss.toml`, which takes the same
booleans and expression strings and is normalized to a quoted string.

Invalid syntax or a non-boolean type rejects the document at load. A runtime failure hides that
surface for that one evaluation.

| Surface | Field | Context and effect |
|---|---|---|
| Scoreboard | document `show` | Live viewer; gates automatic and sticky boards on the selection pass. A hidden sticky board keeps its selected id and returns when true |
| Persistent hologram | document `show` | Live viewer; gates text and particles during updates, including otherwise static holograms |
| Entity overlay | document `show`, `lines[].show` | Live viewer plus captured entity values and Insight state; the document gate controls the pane, and row gates control its contents |
| Tablist | document `show`, `headerFooter.show`, `listNames.show` | Player being formatted; top-level and section gates both apply. Hidden headers/footers clear, including API overrides; hidden list-name formatting resets to the player's name |
| MOTD | document `show` | Evaluated per ping without a viewer or world; false leaves the ping response unchanged |
| Emoji | document `show` | Async chat reads the sender's visibility snapshot, sampled every 10 ticks. False or a missing snapshot leaves the token unchanged |
| Animation | document `show` | Player supplied to text rendering; false makes the animation token render empty |
| Bubble style | document `show` | Each live viewer of the selected style's bubble; combines with `hideOwn` and other viewer rules |
| Damage/healing indicators | document `show` | Live viewer plus event snapshot; combines with `audience.when` while the indicator lives |
| Real Drops | document `show` | Live viewer plus item snapshot; combines with the selected presentation and audience rules |
| Drop labels | `[drops] show` in `gloss.toml` | Live viewer plus item snapshot; hides the label without removing the item |
| Menu | document `show`, `components[].show` | Session viewer; gates update while the session remains open, and hidden components cannot receive clicks |
| Panel | document `show` | Panel viewer; also requires the current menu and component gates and existing panel access rules |
| Container preview | document `show`, `card.show`, `elements[].show` | Preview DSL context; visibility updates every four ticks while open |

For viewer-backed surfaces, `world.*` describes that viewer's world. Indicator and drop conditions
use their event or item snapshot. The MOTD has no player, so use `server.*` and `time.*` there.

Preview `show` uses the preview DSL below, not the role functions. Its `world.name` and `world.time`
come from the preview target's world. Write `"show": "cookTime > 0"`, or declare `"display": true`
in `match.vars` and write `"show": "vars.display"`. Preview PAPI takes no role argument:
`papi('key', 'false') == 'true'`. `card.show` gates the frame and title chrome and also requires
`card.framed`; `elements[].show` also requires that element's `visible`; a false document `show`
hides the whole preview and its particles without selecting a different document.

## Conditional documents

A condition is the complete JSON string in a `when` field, with no wrapper, and must evaluate to a
boolean. A syntax or type error rejects that document at load. A missing runtime value or failed
evaluation treats that one condition as `false` and leaves the rest of the feature running.

```json
"when": "viewer.world == 'world_nether' && viewer.health < 5"
```

There is no truthiness conversion: `viewer.health` is a number, not a condition by itself. String
equality and every string helper are case-sensitive.

### Selection and fallback

The matching entry with the greatest integer `priority` wins; equal priorities use the
lexicographically smallest `id`. A variant is a complete presentation and never merges with the
base. When no variant matches, the base presentation is used. Scoreboards add one outer contest:
only boards whose `show` and `select.when` are true enter it, ranked by `select.priority` then board
id, and no match means no sidebar.

### Roles and shared variables

`viewer`, `subject` and `source` identify the entity a value describes, and `player.*` is an alias
for `viewer.*`. Scoreboards and tablist headers use the player as both `viewer` and `subject`.
List-name variants and bubble selection use the player as `subject`. Damage and Real Drops
conditions use the affected entity or item as `subject`, and audience checks also receive a live
`viewer`.

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
condition location's world. `viewer.world` is already the world-name string, so write
`viewer.world == 'world'` or `world.name == 'world'`, never `viewer.world.name`.

Calendar values are `time.epochMs`, `time.hour`, `time.minute`, `time.second`, `time.dayOfWeek`
(Monday 1 through Sunday 7), `time.dayOfMonth` and `time.month`. The standard text scope also
supplies `time.ms`, `time.seconds`, `time.ticks`, `server.online`, `server.maxPlayers` and
`server.tps`.

### Condition functions

Arity is exact, and the explicit fallback is required for PAPI and metric calls.

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
| `metric(key, fallback)` | number | Integration metric or numeric fallback |

The math, conversion, color and animation functions are available too, but the complete condition
must still return a boolean. A role function needs a live role: the immutable `source.*` fields
captured for damage and drop events do not make that source a live player for `hasPermission`,
`inGroup` or PAPI.

Public global React samplers are `react.sampler.<sampler-id>`, as in
`metric('react.sampler.ticks-per-second', 20) < 18`. Chunk and player samplers are not bridged.

### Surface-specific values and cadence

| Surface | Additional values | Evaluation |
|---|---|---|
| Scoreboard `select.when` and variants | live viewer/player values | Every `[boards] updateIntervalTicks`; manual sticky selection fixes the board id but its variant still updates |
| Tablist header/footer variants | live viewer/player values | Every ordinary or shared fast tablist refresh |
| Tablist list-name variants | live subject/player values | Every ordinary or selected fast tablist refresh |
| Bubble-style `select.when` | live speaker values | Once per chat message |
| Damage/healing style and variants | `event.*`, immutable `subject.*` and `source.*` | Once the applied health delta is known |
| Damage audience | live `viewer.*` plus the immutable event snapshot | At spawn and on viewer tracking changes; a dynamic `show` also reevaluates while the indicator lives |
| Real Drops variants | `drop.*`, `event.*`, immutable subject/source/world values | When the item's presentation is selected |
| Real Drops audience | live `viewer.*` plus the immutable item snapshot | Per nearby viewer while the presentation reconciles |

Damage events add `event.type`, `event.cause`, `event.amount`, `event.reportedAmount`,
`event.damage`, `event.healing`, `event.critical`, `event.criticalKnown` and
`event.directSourceType`. Real Drops adds `event.type`, `event.playerDrop` and the complete `drop.*`
catalog on [Drop Labels](/gloss/08c-drop-labels#real-drops).

> Spigot reports `false` for both critical fields on entity damage because its API cannot determine
> the flag; Paper and Paper-derived servers report it exactly. Use
> `event.criticalKnown && event.critical` when a variant must match only an authoritative critical
> hit. A projectile is never followed back to a remote shooter, and `source.*` defaults when the
> damager is not owned by the affected entity's region.
{.is-warning}

## PlaceholderAPI substitution

The text pipeline runs functions first, inline expressions second, PlaceholderAPI third, then emoji
and colors. The placeholder stage runs only when `[text] placeholders` is `true`, the render has a
viewer, and the string contains a `%`.

| Surface | Viewer | Placeholders resolve |
|---|---|---|
| Personalized hologram lines | the player receiving metadata for the shared entity | yes |
| Shared hologram lines | none | no |
| Entity-overlay templates | the player viewing the pane | yes |
| Board title and lines | the board's holder | yes |
| Tablist header, footer, name formats | the player being formatted | yes |
| Menu/panel text, conditions and messages | the session player | yes |
| Container preview expressions | the preview viewer, except console/static diagnostics | `papi(...)` calls only; raw `%...%` is modulo syntax |
| BubbleStyle prefix | the speaker | yes |
| Drop-label formats | the player viewing the label | yes, when personalized hologram text is enabled |
| MOTD lines | none | no |
| Damage indicators | the player viewing the indicator | yes, when personalized hologram text is enabled |

A hologram line renders per viewer when it contains a complete `%name%`, `|function|` or
viewer-backed `{{ expression }}` token and `[holograms] perViewerPlaceholders` is `true`. Setting
that key to `false` keeps the text shared, tokens included, unless a dynamic `show` needs per-viewer
rendering; it also governs indicator and drop-label text. Entity-overlay templates always evaluate
for their viewer. See [Holograms](/gloss/04-holograms).

With no player, no `%` token, or no enabled PlaceholderAPI plugin, the text is returned unchanged. A
failed lookup leaves the token as written and logs one warning. A late PlaceholderAPI enable becomes
available without a Gloss reload.

### In menu and panel documents

| Field | Where | When it expands |
|---|---|---|
| text icon `text` | any text icon in a menu or panel | when opened, then every `refreshTicks` while visible |
| toggle `condition` | toggle component | once when opened |
| `message` action `message` | menu action | every time the action fires |

These fields honor `[text] functions` and `[text] placeholders` like boards and tablists, and behave
the same inside the menu that a panel's `rootMenuId` names. See [Hologram Menus](/gloss/09-menus),
[Components & Hitboxes](/gloss/10-components-hitboxes), [Icons](/gloss/11-icons) and
[Panels](/gloss/16-panels).

`refreshTicks` defaults to `10` and accepts `0` to `1200`; `0` keeps the icon's initial text, and a
value outside the range rejects the document with `refreshTicks must be between 0 and 1200`. Text
with no dynamic token is never re-expanded. A changed line count respawns the icon, and a refresh
that throws keeps the previous text and logs once per icon.

A toggle compares its fully rendered `condition` to `expectedValue` with `equalsIgnoreCase`, so that
one match is case-insensitive unlike expression `==`. The condition is read once when the toggle
opens and never re-read; clicking flips the stored state and runs `trueActions` or `falseActions`.

### Why the MOTD cannot resolve placeholders

A server-list ping has no player, so `%player_*%` tokens stay raw in the MOTD. Functions,
viewer-free inline expressions, emoji and colors still apply, as do `time.*`, `server.*` and server
aliases such as `papi('server_online')`. See [Server List MOTD](/gloss/06b-server-list-motd).

## The `gloss` expansion

Gloss publishes a PlaceholderAPI expansion named `gloss`. Keys are `%gloss_<key>%` and are
lowercased before lookup, so `%gloss_MENU.ID%` resolves the same as `%gloss_menu.id%`.

| Placeholder | Value |
|---|---|
| `%gloss_available%` | Always `true`. Its presence is how a consumer detects that Gloss is running |
| `%gloss_menu.open%` | `true` when the player currently has a menu session open, otherwise `false` |
| `%gloss_menu.id%` | The id of the open menu, or `---` when no menu is open |

These are the only Gloss placeholders. An unknown key resolves to `null`, so `%gloss_nonsense%`
comes out as written rather than empty. A failing resolver returns `---` and logs the key once, up
to 64 distinct keys. Both menu keys are available to the open menu's toggle conditions and text
icons.

> The expansion registers during enable and is never retried. If PlaceholderAPI enables after Gloss,
> the expansion stays unregistered until the next server start.
{.is-warning}

The API side is covered in [API: Placeholders](/gloss/23-api-placeholders).

## Text pipeline functions

A function token is a name between two pipe characters, such as `|animation.rainbow|`. Later
pipeline stages also process the result. The stage is skipped when `[text] functions` is `false` or
the string has no `|`. An unregistered name is left in place, pipes included, and that closing pipe
can open the next candidate. A function that returns nothing renders as an empty string; one that
throws renders empty and logs `Text function |<name>| failed: ...` once per name.

`|animation.<id>|` reads a loaded animation document. Frames come from the server clock, so every
surface shows the same frame at the same time. `[features] animations = false` unregisters the
family and leaves the tokens as written. See
[Emoji, Text & Animations](/gloss/07-emoji-text-animations).

`|metric.<key>|` reads a metric published by another installed Volmit plugin, under that plugin's
own dotted key, as in `|metric.adapt.player-sessions|`. Values render compact (`42`, `3.14`, `1.2K`,
`1.5M`, `2B`, `3.5T`). A key whose publishing plugin is not installed is never registered and stays
in the line. A token is empty on its first render and fills in on the next sampler pass,
`[integration] sampleIntervalTicks` later (default 20). Sampling stops 60 seconds after the last
use. Gloss's own `gloss.*` metrics are published to React, not through `|metric.|` tokens.

## Inline text expressions

Write an expression between `{{` and `}}` anywhere the text pipeline runs. A malformed expression
stays visible as written and logs once, so a typo does not silently erase the line.

```text
{{ hex(mix(#FF55FF, #55FFFF, (sin(time.seconds * 2) + 1) / 2)) }}&lLIVE
&7Player &f{{ player.name }}
&7Health &a{{ bar(player.health, 20, 10, '■', '□') }}
&7TPS &a{{ fixed(server.tps, 1) }}
&7Rank {{ papi('vault_prefix', '&7Member') }}
&7Tick &f{{ fixed(metric('react.tick-ms', 1000 / server.tps), 1) }}ms
```

Built-in live variables are `time.ms`, `time.seconds`, `time.ticks`, `server.online`,
`server.maxPlayers`, `server.tps`, `player.name`, `player.ping`, `player.health` and `player.level`.
They need no other plugin. `player.*` requires a viewer, so it does not work in MOTDs or other
static renders.

`papi(...)` and `papiNumber(...)` try PlaceholderAPI first. If the token stays unresolved, Gloss
supplies native fallbacks for `player_name`, `player_ping`, `player_health`, `player_level`,
`server_online`, `server_max_players` and `server_tps`, with the surrounding `%` optional. Other
PAPI keys need a viewer or an explicit typed fallback. The former `react.tps` metric key resolves to
the native `server.tps`; use `server.tps` directly in new content.

| Function | Result |
|---|---|
| `papi('vault_prefix', '&7Member')` | Resolves a PlaceholderAPI key; surrounding `%` are optional. The optional string fallback is used when it cannot resolve |
| `papiNumber('vault_eco_balance', 0)` | Resolves PAPI and parses its first numeric value for math. The optional numeric fallback covers an absent expansion or non-numeric answer |
| `metric('react.tick-ms', 1000 / server.tps)` | Reads a numeric integration metric and starts sampling it. The optional numeric fallback covers an absent publisher or unsampled key |
| `select(list, index)` | Wraps the floored index and returns any list entry |
| `number(value)` | Parses the first number from a number or formatted string |
| `bar(value, maximum, width, filled, empty)` | Builds a clamped 1–64-character progress bar |
| `hex(color)` | Converts an expression color to `[RRGGBB]` for the later color stage |
| `align(text, width, mode)` | Pads visible text to 1–16384 character cells using `left`, `center`/`middle` or `right`, without truncating longer content |

The math, ternary, string, color and list functions below also apply. The animation helpers —
`marquee`, `timeline`, `typewriter`, `flash`, `wipe`, `scanner`, `scramble`, `odometer` and `wave` —
are documented with their signatures and limits on
[Emoji, Text & Animations](/gloss/07-emoji-text-animations#reusable-animation-helpers).

Inline expressions update at the consuming surface's refresh rate, and a surface cannot show frames
between refreshes. Boards refresh every 20 ticks and tablists every 40 by default, so use
`floor(time.seconds)` for one-second board steps and `floor(time.seconds / 2)` for two-second
tablist steps. Raw PlaceholderAPI substitution happens after inline expressions, so use
`align(papi('key', ''), 20, 'right')` when the resolved width must be counted.

## The preview expression DSL

A preview expression fills an entire JSON field and can read target state such as furnace cook time.
It also supports `time.*`, `server.*`, `player.*`, `papi`, `papiNumber` and `metric`; static
validation and console dumps have no player, so those values need a fallback there. There is no
`%…%` form — a bare `%` is the modulo operator, and a `%` inside a string is an ordinary character.

Use `papi('key', 'fallback')` for a PlaceholderAPI expansion, or register a `PreviewStateProvider`
and read `<namespace>.<key>` for typed live state. See [API: Previews](/gloss/24-api-previews) and
[Container Previews](/gloss/15-container-previews).

### Furnace expressions at a glance

This element repeats cells across a furnace progress gauge, coloring them from the furnace state:

```json
{
  "type": "cell",
  "repeat": { "count": "vars.segments", "var": "i" },
  "x": "round((i - (vars.segments - 1) / 2) * vars.segmentGap)",
  "size": "vars.segmentSize",
  "color": "cookTime > 0 && cookTimeTotal > 0 ? (i < ceil(cookTime / cookTimeTotal * vars.segments) ? mix(vars.fill, vars.pulse, (sin(time / vars.pulseRate + i) + 1) / 2) : vars.wellColor) : vars.wellColor"
}
```

The division guard handles an idle furnace with a zero total. `vars.*` values are document
constants; `cookTime`, `cookTimeTotal` and `time` are live; `i` exists only inside the repeat.

Labels can combine the same values with inventory functions and localization:

```json
{
  "type": "label",
  "text": "occupied(0) ? '&f' + readable(item(0)) + ' ×' + str(count(0)) + '  &7' + (cookTimeTotal > 0 ? bar(cookTime, cookTimeTotal, 12, '■', '□') : '□□□□□□□□□□□□') : '&c' + lang('gloss.preview.state.no_input')"
}
```

See the [furnace expression walkthrough](/gloss/15-container-previews#furnace-expression-walkthrough)
for a complete document.

### Expression-capable fields

| Form | Accepts | Fields |
|---|---|---|
| number or expression | a JSON number, or a JSON string parsed as an expression | `elements[].x`, `.y`, `.z`, `.width`, `.height`, `.size`, `.index`, `.color`, `.wellColor`, `.background`, `elements[].repeat.count` |
| boolean or expression | a JSON boolean, or a JSON string parsed as an expression | `show`, `card.show`, `elements[].show`, `elements[].visible`, `card.framed` |
| expression only | always a string, always parsed as an expression | `elements[].text`, `card.title`, `card.accent` |

Never expressions: `match.*` and `variants[].*` selectors, `elements[].type`,
`elements[].repeat.var` and `card.minHalfWidth`. A required numeric field rejects both an absent key
and an explicit `null`; an optional one falls back to its default.

`match.vars` and `variants[].vars` accept JSON numbers, booleans and strings, not expressions. A
string beginning with `#` is parsed as an ARGB color, and an invalid color is a compile error. Other
color-like strings, such as `"<#F2A535>"`, remain text.

### There is no delimiter

An expression field's string value is the whole expression source. No `${…}` or `%…%` starts or
suppresses evaluation.

- `"width": 64` is the number 64. `"width": "64"` is an expression that happens to be a literal.
- In the three expression-only fields, literal text needs inner quotes: `"text": "'Idle'"`. Writing
  `"text": "Idle"` parses as a variable named `Idle` and fails to compile.
- A JSON number in an expression-only field binds to its text form, so `"text": 5` compiles as 5.

### Evaluation cadence

Expressions with no variable or function call are folded when the document loads, so a constant
expression that throws is a load error: `"x": "1 / 0"` rejects the whole document. A `cell` color, a
`label` text, and every visibility field then update live every four ticks, and a visibility change
rebuilds the layout. Everything else is computed when the card is built.

### Literals

Values are numbers, strings, booleans or lists. There is no null and no truthiness conversion, and
operators reject mismatched types.

| Literal | Syntax | Value |
|---|---|---|
| Number | `123`, `3.5` | No exponent notation, no leading `.`, and no sign. A leading `-` is the unary operator |
| Color | `#RGB`, `#RRGGBB`, `#AARRGGBB` | Unsigned 32-bit ARGB. `#RGB` doubles each nibble; `#RGB` and `#RRGGBB` prepend alpha `FF`. Any other hex-digit count is an error |
| String | `'text'` or `"text"` | Escapes are `\\`, `\'`, `\"` and `\n`. Anything else after a backslash is an error |
| Boolean | `true`, `false` | As written |
| Array | `[a, b, c]`, `[]` | Useful only as a `palette` or `select` argument. There is no indexing syntax, and stringifying a list is an error |

Identifiers match `[A-Za-z_][A-Za-z0-9_]*` and may be dotted, as in `inventory.size`. A `.`
continues an identifier only when the next character is a letter or `_`. Call names may not be
dotted.

### Operators and precedence

Lowest to highest. Every binary level is left-associative; the ternary is right-associative.

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

`&&`, `||` and the ternary short-circuit, so the unused side is never resolved. Comparing mismatched
types is an error, not `false`.

`+` concatenates when either side is a string and adds numerically otherwise. `str(x)` uses the same
rule: a whole number drops its decimal, so `54.0` prints `54` and `1e9` prints `1000000000`, while
`3.5` prints `3.5`. String equality is exact and case-sensitive, and the relational operators reject
strings.

`%` is Java's remainder and takes the sign of the left operand; `mod(a, b)` is floor-mod. `-1 % 3` is
`-1` and `mod(-1, 3)` is `2`, so use `mod` when you want a non-negative wrap. A zero right operand
throws `division by zero` in `/`, `%` and `mod` alike, never `NaN`.

Colors are unsigned 32-bit ARGB numbers, alpha first. `#RGB`, `#RRGGBB` and `rgb()` are opaque; only
`#AARRGGBB`, `argb()` and `alpha()` set alpha. A plain number in a color field with no high byte is
fully transparent.

## The function library

Arity is exact. A mismatch throws `<name> expects <n> argument(s), got <m>`, and a wrong type names
the 1-based argument index.

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
| `rgb(r, g, b)` | 3 | number ×3 | color | Opaque color. Channels rounded and clamped to `[0, 255]` |
| `argb(a, r, g, b)` | 4 | number ×4 | color | As `rgb`, with an explicit alpha channel |
| `alpha(color, a)` | 2 | color, number | color | Replaces only the alpha byte, rounded and clamped to `[0, 255]` |
| `mix(c1, c2, t)` | 3 | color, color, number | color | Per-channel blend including alpha, with `t` clamped to `[0, 1]` |
| `palette(list, index)` | 2 | list of numbers, number | number | Wraps the floored index over the list. An empty list or a non-number entry throws |
| `select(list, index)` | 2 | list, number | any list entry | Wraps the floored index over the list. An empty list throws |
| `str(x)` | 1 | number, string or boolean | string | The stringify rule above |
| `fixed(x, digits)` | 2 | number, whole number in `[0, 20]` | string | Root-locale `%.<digits>f`. Fractional, negative or `> 20` digits throw |
| `plain(s)` | 1 | string | string | Removes legacy codes matching `&[0-9A-Fa-fK-Ok-oRr]`. Every other `&` survives |
| `readable(s)` | 1 | string | string | `IRON_ORE` becomes `Iron Ore` |
| `align(s, width, mode)` | 3 | string, whole number in `[1, 16384]`, string | string | Pads visible code points using `left`, `center`, `middle` or `right`; formatting does not consume width and longer content is returned whole |

### Preview context functions

These resolve before the shared library and exist in every preview document.

| Function | Arity | Arguments | Returns | Behavior |
|---|---|---|---|---|
| `lang(key, ...)` | 1 or more | string key, then any values | string | Resolves `key` in the viewer's language, or the server default. Positional arguments bind to the English template's `{placeholder}` names in order; extras are named `arg<n>` and unused. Values are inserted as untrusted text, so a container name cannot smuggle in color codes. An undeclared id fails the label with `lang: Unknown message key: <id>` |
| `count(slot)` | 1 | number | number | Stack size in that slot, or `0` for an empty or out-of-range slot |
| `occupied(slot)` | 1 | number | boolean | Whether that slot holds a non-empty stack |
| `item(slot)` | 1 | number | string | Material id such as `IRON_ORE`, or `""` when empty or out of range. Pair with `readable(item(0))` |
| `papi(key, fallback?)` | 1 or 2 | string key, optional string fallback | string | Same PlaceholderAPI-first behavior as inline text expressions |
| `papiNumber(key, fallback?)` | 1 or 2 | string key, optional numeric fallback | number | Numeric PAPI or native value for preview math |
| `metric(key, fallback?)` | 1 or 2 | string key, optional numeric fallback | number | Reads a demanded integration metric |

Slot indexes are floored. Localization keys are covered in [Localization](/gloss/19-localization).

## Variables

An unknown variable is a load error. An unknown function name is not caught until the expression
runs, and any call makes an expression non-constant, so a misspelled function fails at build or
refresh rather than at load.

### Built-in variables

The `universal` group — `time`, `blockType` and `customName` — is published in every context. The
`inventory` group, `inventory.size` and `inventory.occupied`, is published whenever the target has an
inventory. Exactly one category group is published on top of those, chosen from the block state,
entity or inventory type: `furnace`, `brewing`, `beehive`, `cauldron`, `jukebox`, `inventory` or
`static`. The full catalog with types and fallback values is in
[Container Previews](/gloss/15-container-previews).

`world.name` and `world.time` are the preview target's world folder name and time of day. Previews
also publish `time.ms`, `time.seconds`, `time.ticks`, `server.online`, `server.maxPlayers`,
`server.tps`, `player.name`, `player.ping`, `player.health` and `player.level`. The `player.*` values
are absent in viewerless static or console contexts rather than invented.

### Document variables and repeat variables

`vars.<name>` reads a constant from `match.vars` or a variant's `vars`. Document variables are
reachable only under the `vars.` prefix, and built-ins and document variables can never shadow each
other.

Repeat variables are bare identifiers, default name `i`, taking values `0` through `count - 1`.
`repeat.var` must be a valid identifier and may not be `vars` or any catalogued name.

### Provider namespaces and metrics

A registered `PreviewStateProvider` publishes `<namespace>.<key>` numbers, strings or booleans;
other values are ignored. A provider whose namespace collides with a built-in group is dropped
whole, and one that throws is skipped, each with one warning.

Integration metrics are preview variables under their native dotted names, so
`|metric.adapt.player-sessions|` in text is `adapt.player-sessions` in a preview expression. The
first segment is the namespace, so a plugin publishing `iris.generation-time` occupies the `iris`
namespace and follows the same collision rule.

The one-interval warm-up is sharper here than in text: until the first sample the variable is
absent, so the label reports `label text: unknown variable: adapt.player-sessions` and renders
empty. A metric the publisher reports as unavailable behaves the same. It is never invented as zero.

## Limits and errors

A preview document allows 256 nesting levels, 1024 copies per `repeat`, and 4096 compiled templates.
A constant `repeat.count` over the cap is a load error; a live one is truncated at render with a
message.

Parse errors carry the field path and a 0-based character index, as in
`elements[3].color: unexpected token at 7`. A document that fails to load logs
`previews/<name>.json: <detail>` at `WARNING` and is not registered, so the next matching document
is used, or none. A render-time failure skips or falls back on that one element and leaves the rest
of the card rendering; the per-failure fallbacks are listed in
[Container Previews](/gloss/15-container-previews).

## Reference

| Config key | Default | Effect |
|---|---|---|
| `[text] placeholders` | `true` | PlaceholderAPI stage of the text pipeline, including menus and panels |
| `[text] functions` | `true` | `\|function\|` stage of the text pipeline |
| `[holograms] perViewerPlaceholders` | `true` | Lets holograms with complete dynamic tokens render per viewer |
| `[features] animations` | `true` | Registers the `\|animation.<id>\|` functions |
| `[features] previews` | `true` | Container previews, and therefore the expression DSL |

Related pages: [Holograms](/gloss/04-holograms),
[Emoji, Text & Animations](/gloss/07-emoji-text-animations),
[Hologram Menus](/gloss/09-menus),
[Icons](/gloss/11-icons),
[Container Previews](/gloss/15-container-previews),
[API: Placeholders](/gloss/23-api-placeholders),
[API: Previews](/gloss/24-api-previews).
