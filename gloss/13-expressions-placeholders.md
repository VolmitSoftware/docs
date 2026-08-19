---
title: "Expressions & Placeholders"
description: "Gloss documentation: Expressions & Placeholders"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss contains three separate substitution systems that are often confused for one another. PlaceholderAPI
substitution fills `%expansion_key%` tokens from another plugin. The text pipeline's function stage fills
`|name|` tokens from a small registry Gloss owns. The preview expression DSL is a real little language, and
it exists only inside container preview documents. They do not interoperate: an expression cannot read a
PlaceholderAPI placeholder, no menu field is parsed as an expression, and `|function|` tokens are not
touched inside menu or panel documents.

## Which system applies where

| System | Syntax | Applies to |
|---|---|---|
| PlaceholderAPI | `%expansion_key%` | Per-viewer hologram lines, board titles and lines, tablist header, footer and name formats, menu and panel text icons, menu and panel toggle conditions, menu `message` actions |
| Text pipeline functions | `\|name\|` | Hologram lines, board titles and lines, tablist text, `[drops] nameFormat`, MOTD lines, chat bubbles and damage indicators |
| Preview expression DSL | bare expression source, no delimiter | Container preview documents in `plugins/Gloss/previews/` only |

Nothing else in Gloss is substituted. Action commands, item icons, image icons, component ids, panel
transforms, emoji `trigger` values and every `match`/`variants` selector in a preview document are used
exactly as written.

## PlaceholderAPI substitution

### In rendered text

Every string that goes through the text pipeline (`text/TextPipeline.java`) hits the placeholder stage
second, after functions and before emoji and colors. That stage runs only when all three of these hold:

- `[text] placeholders` is `true` (the default),
- the render carries a viewer, and
- the string contains at least one `%`.

A render with no viewer is a static render, and static renders skip the stage entirely. That is what
separates the surfaces:

| Surface | Viewer | Placeholders resolve |
|---|---|---|
| Per-viewer hologram lines | the player the copy belongs to | yes |
| Shared hologram lines | none | no |
| Board title and lines | the board's holder | yes |
| Tablist header, footer, name formats | the player being formatted | yes |
| `[drops] nameFormat` | none | no |
| MOTD lines | none | no |
| Chat bubbles, damage indicators | none | no |

A hologram switches to per-viewer rendering when any of its lines contains a `%` and
`[holograms] perViewerPlaceholders` is `true` (the default). Setting that knob to `false` forces every
hologram to render once for everybody, which means lines with `%` render with the tokens still in them.
See [Holograms](/gloss/04-holograms).

### In menu and panel documents

Menu documents do not use the text pipeline at all. They call PlaceholderAPI directly, in three places:

| Field | Where | When it expands |
|---|---|---|
| text icon `text` | any text icon in a menu or panel | at icon construction, then every `refreshTicks` while the icon is on screen |
| toggle `condition` | toggle component | once, in the toggle's constructor |
| `message` action `message` | menu action | every time the action fires |

Because these bypass the pipeline, they are **not** governed by `[text] placeholders`. Turning that knob
off silences placeholders in holograms, boards, the tablist and the MOTD, and changes nothing in menus or
panels.

A panel's visible content is the menu document named by its `rootMenuId`, so the two menu fields above
behave identically in panels. See [Hologram Menus](/gloss/09-menus),
[Components & Hitboxes](/gloss/10-components-hitboxes), [Icons](/gloss/11-icons) and [Panels](/gloss/16-panels).

#### Text icon refresh

A text icon splits its `text` on `\n` and expands each line separately when the icon is built.
`refreshTicks` then controls periodic re-expansion:

- omitted, the value is `10` ticks;
- the accepted range is `0` to `1200`, and a value outside it rejects the document with
  `refreshTicks must be between 0 and 1200`;
- `0` disables refreshing, so the icon keeps whatever it rendered at construction.

Refreshing is also skipped when the source text holds no paired `%…%` token, so static text costs nothing
however low `refreshTicks` is set. When a refresh produces different text the display's name is updated in
place; a changed line count respawns that icon, and either path rebuilds its click geometry. A refresh that
throws keeps the previous text and logs once per icon, naming the menu and the player; the next successful
refresh re-arms that warning.

#### Toggle conditions

A toggle's state is `setPlaceholders(player, condition)` compared to `expectedValue` with
`equalsIgnoreCase`.

- The comparison is case-insensitive, unlike expression string equality.
- A `condition` with no `%` is never sent to PlaceholderAPI; it is compared as a literal, so
  `"condition": "yes"` with `"expectedValue": "YES"` is a toggle that always starts on.
- The condition is read once, in the constructor. Clicking a toggle flips the stored state and runs
  `trueActions` or `falseActions`; it never re-reads the condition.

### Why the MOTD cannot resolve placeholders

`MotdService` handles `ServerListPingEvent`, and that event carries no `Player` — a server list ping happens
before anyone has joined. The service therefore calls `renderStatic`, which is `render(null, text)`, and the
pipeline guards the placeholder stage on `viewer != null`. There is nobody to resolve `%player_name%`
against, so the stage is skipped and the token reaches the client as written.

Functions, emoji and colors still apply to the MOTD, because none of those need a viewer. See
[Tablist & Server List MOTD](/gloss/06-tablist-motd).

### Substitution behaviour

Gloss resolves placeholders through VolmLib's `Placeholders` helper, which returns the input unchanged
when the player is `null`, when the text contains no `%`, or when PlaceholderAPI is not an enabled plugin.
The `PlaceholderAPI#setPlaceholders` method handle is re-probed at most once a second, so definition-side
expansion starts working shortly after a late-enabling PlaceholderAPI comes up, with no reload needed. A
lookup failure and an invocation failure each log one warning and then serve the text unresolved.

## The `gloss` expansion

Gloss also publishes its own PlaceholderAPI expansion so other plugins can read Gloss state. The identifier
is `gloss`, so every key is written `%gloss_<key>%`. The key part is lowercased before lookup, so
`%gloss_MENU.ID%` resolves the same as `%gloss_menu.id%`.

| Placeholder | Value |
|---|---|
| `%gloss_available%` | Always `true`. Its presence is how a consumer detects that Gloss is running |
| `%gloss_menu.open%` | `true` when the player currently has a menu session open, otherwise `false` |
| `%gloss_menu.id%` | The id of the open menu, or `---` when no menu is open |

Those three are the whole expansion. There are no hologram, board, tablist, emoji or preview placeholders.

An unknown key resolves to `null`, which PlaceholderAPI renders by leaving the token in the text exactly as
written — `%gloss_nonsense%` comes out as `%gloss_nonsense%`, not as an empty string. A key whose resolver
throws returns `---` and logs one warning naming that key, up to 64 distinct keys.

The expansion is registered during enable and only when PlaceholderAPI is already an enabled plugin at that
moment. Unlike the consumer side, registration is not retried, so a PlaceholderAPI that enables after Gloss
leaves the expansion unregistered until the next server start. Because a menu id is captured into the
session store before a menu's components are constructed, `%gloss_menu.id%` and `%gloss_menu.open%` are
already correct inside that menu's own toggle conditions and text icons.

The API side of this is covered in [API: Placeholders](/gloss/23-api-placeholders).

## Text pipeline functions

A function token is a name between two pipe characters, for example `|animation.rainbow|`. The function
stage runs first in the pipeline, before placeholders, emoji and colors, so anything a function returns is
itself subject to the later stages.

- The whole stage is skipped when `[text] functions` is `false`, when the string contains no `|`, or when
  no functions are registered at all.
- A name with no registered function is left in place, pipes included. Scanning then resumes from that
  closing pipe, so it can serve as the opening pipe of the next candidate.
- A function that returns `null` renders as an empty string.
- A function that throws renders as an empty string and logs one warning per function name
  (`Text function |<name>| failed: ...`). That warning is not repeated until the function is registered
  again or `/gloss reload` runs.

### The function catalog

Gloss registers two families, and there is no public API for adding a third.

`|animation.<id>|` — one token per loaded animation document, registered by `AnimationService`. The frame
is picked from the server clock at render time, so every surface showing the same animation shows the same
frame. Setting `[features] animations = false` unregisters the family, after which those tokens survive the
stage and appear literally. See [Emoji, Text & Animations](/gloss/07-emoji-text-animations).

`|metric.<key>|` — one token per metric another installed Volmit plugin publishes, registered by the
integration bridge. The key is the publishing plugin's own dotted key, so the token reads
`|metric.adapt.player-sessions|`. Values render compactly (`42`, `3.14`, `1.2K`, `1.5M`, `2B`, `3.5T`); a
metric that is unavailable, or that has not been sampled yet, renders as an empty string. A key belonging
to a plugin that is not installed is never registered, so its token stays in the line verbatim.

Gloss also publishes its own 19 `gloss.*` metrics outward through the same services manager for React to
sample. Those are not readable from a `|metric.|` token — the bridge deliberately skips its own
registration, because a plugin reading its own metrics through the bridge would be a loop.

### Demand-driven sampling

The bridge samples nothing on its own schedule. A metric is sampled only while something has recently
asked for it — a `|metric.<key>|` token that was rendered, or a preview whose provider namespace was read.
A key stays in that recently-requested set for 60 seconds after its last request, then drops out and stops
being sampled; the set is capped at 256 keys, and when it overflows the least recently requested keys are
dropped first.

Two consequences follow, and both are normal:

- **One interval of warm-up.** The first render of a token asks for the key and gets an empty string; the
  value appears on the next sampler pass, `[integration] sampleIntervalTicks` later (default 20 ticks).
  The same holds after a `/gloss reload` and after a plugin enables or disables.
- **Nothing is sampled on an idle server.** A server whose content mentions no metric never calls another
  plugin's sampler at all.

### Not available in menus or panels

Menu and panel text is built by `TextUtils.parse`, which translates legacy `&` codes into MiniMessage tags
and deserializes the result. It never calls the text pipeline's function stage. `|function|` tokens,
`|animation.<id>|` and `|metric.<key>|` included, are therefore inert in menu documents: they render as
literal text, pipes and all, and a stray `|` in a label can never be mistaken for a token.

Menu, panel and preview text does get the emoji and color stages, so `:heart:` and a `<3` trigger resolve
in a menu label, a panel row and a preview label. See
[Emoji, Text & Animations](/gloss/07-emoji-text-animations).

## The preview expression DSL

Container preview documents in `plugins/Gloss/previews/` are the only consumer of the expression language,
and they are the only Gloss document kind that never calls PlaceholderAPI. The lexer has no `%…%` form at
all — a bare `%` is the modulo operator, and a `%` inside a string literal is an ordinary character. To
surface external data in a preview, register a `PreviewStateProvider` and read `<namespace>.<key>`; see
[API: Previews](/gloss/24-api-previews). The document format itself is documented in
[Container Previews](/gloss/15-container-previews).

### Expression-capable fields

Every field in a preview document falls into one of three forms.

| Form | Accepts | Fields |
|---|---|---|
| number or expression | a JSON number, or a JSON string parsed as an expression | `elements[].x`, `.y`, `.z`, `.width`, `.height`, `.size`, `.index`, `.color`, `.wellColor`, `.background`, `elements[].repeat.count` |
| boolean or expression | a JSON boolean, or a JSON string parsed as an expression | `elements[].visible`, `card.framed` |
| expression only | always a string, always parsed as an expression | `elements[].text`, `card.title`, `card.accent` |

Fields that are never expressions: `match.*` and `variants[].*` selectors, `elements[].type`,
`elements[].repeat.var` and `card.minHalfWidth`. A required numeric field rejects both an absent key and an
explicit `null`; an optional one falls back to its default.

`match.vars` and `variants[].vars` values are JSON primitives converted to `Double`, `Boolean` or `String`
and are never parsed as expressions. The one exception is a string whose first character is `#`: it is read
with the expression colour-literal grammar and stored as the resulting unsigned ARGB number, so a variant
can carry `"accent": "#FFB02E26"` without losing the alpha byte to a signed int. A leading `#` that is not a
valid colour literal is a compile error, not a string. A tag like `"<#F2A535>"` is plain text, because it
does not lead with the hash.

### There is no delimiter

An expression field's string value is the expression source in its entirety. No `${…}`, `%…%` or other
wrapper starts evaluation, and none suppresses it.

- `"width": 64` is the number 64. `"width": "64"` is an expression that happens to be a literal.
- In the three expression-only fields, literal text needs inner quotes: `"text": "'Idle'"`. Writing
  `"text": "Idle"` parses as a reference to a variable named `Idle` and fails to compile.
- A JSON number in an expression-only field binds to its text form, so `"text": 5` compiles as the number 5.

### Evaluation cadence

Constant expressions — those containing no variable reference and no function call anywhere in the tree —
are evaluated at document load and the result is stored. Everything else is evaluated when the preview is
built, which happens once when the preview opens. Only two fields stay live: the renderer polls them every
four ticks while the preview is on screen.

| Field | Evaluated |
|---|---|
| `elements[].color` on a `cell` | live, every four ticks |
| `elements[].text` on a `label` | live, every four ticks, unless it folded to a constant, in which case the Component is parsed once and reused |
| Everything else, including `panel` and `slot` colours, `wellColor`, `index`, `background`, `visible`, `repeat.count`, `card.framed`, `card.title` and `card.accent` | once, per build |

Because folding happens at load, a constant expression that throws is a load error. `"x": "1 / 0"` rejects
the whole document.

### Runtime values

`Double`, `String`, `Boolean` and `List<Object>`. There is no null, no integer type and no truthiness
coercion: every operator that needs a number, a boolean or a string rejects the other types with an error
such as `expected number, got string`.

### Literals

| Literal | Syntax | Value |
|---|---|---|
| Number | `123`, `3.5` | `Double`. No exponent notation, no leading `.`, no sign — a leading `-` is the unary operator |
| Colour | `#RGB`, `#RRGGBB`, `#AARRGGBB` | `Double` holding the unsigned 32-bit ARGB. `#RGB` doubles each nibble and prepends alpha `FF`; `#RRGGBB` prepends alpha `FF`; `#AARRGGBB` is taken as written. Any other hex-digit count is `bad hex length` |
| String | `'text'` or `"text"` | `String`. Escapes are `\\`, `\'`, `\"` and `\n`. Anything else after a backslash is `unrecognized escape sequence`; a missing closing quote is `unterminated string` |
| Boolean | `true`, `false` | `Boolean` |
| Array | `[a, b, c]`, `[]` | `List<Object>`. Useful only as a `palette` argument — there is no indexing syntax, no list operators, and stringifying a list is an error |

Identifiers match `[A-Za-z_][A-Za-z0-9_]*` and may be dotted, as in `inventory.size`. A `.` continues an
identifier only when the next character is a letter or `_`. Call names may not be dotted, which is
`call names cannot be dotted`.

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

`&&` and `||` short-circuit: when the left operand decides the result the right operand is not evaluated at
all, and its variables and calls are never resolved. The ternary evaluates only the branch it takes.
Equality across mismatched types is an error (`cannot compare number and string`), not `false`.

### Strings and `+`

`+` concatenates when either operand is a `String` and adds numerically otherwise. Both sides convert with
one shared rule, which `str(x)` also applies:

| Value | Text |
|---|---|
| `String` | unchanged |
| A finite `Double` equal to `Math.rint(x)` | integer form, so `54.0` renders `54` and `1e9` renders `1000000000` |
| Any other `Double` | `Double.toString`, so `3.5` renders `3.5` |
| `Boolean` | `true` / `false` |
| `List` | error: `cannot convert list to string` |

String equality is exact and case-sensitive. The relational operators reject strings.

### `%` versus `mod`, and division by zero

`%` is Java's remainder, whose sign follows the left operand. `mod(a, b)` is floor-mod,
`a - floor(a / b) * b`. `7 % 3` and `mod(7, 3)` both give `2`, but `-1 % 3` gives `-1` while `mod(-1, 3)`
gives `2`. Use `mod` when you want a non-negative wrap.

A zero right operand throws `division by zero` in `/`, `%` and `mod` alike. `mod` guards this deliberately
rather than producing `NaN`, so the two remainder operations agree.

### Colours

A colour is the unsigned 32-bit ARGB value carried as a `Double`, channel order alpha, red, green, blue
from the most to the least significant byte. Colour fields are read back as `(int) (long) value`, which
reinterprets that unsigned double as a signed int, so `#FFFFFFFF` becomes `-1` rather than saturating.

`#RGB` and `#RRGGBB` are opaque because the parser prefixes `FF`; only `#AARRGGBB` carries its own alpha.
`rgb()` likewise packs an opaque alpha, while `argb()` and `alpha()` set it explicitly. A plain JSON number
in a colour field with no high byte set is fully transparent.

## The function library

Arity is exact. A mismatch throws `<name> expects <n> argument(s), got <m>`, and a wrong argument type
throws `<name> argument <1-based index> must be a number`, `... a string` or `... a list`.

| Function | Arity | Arguments | Returns | Behaviour |
|---|---|---|---|---|
| `clamp(x, lo, hi)` | 3 | number ×3 | number | `min(max(x, lo), hi)` |
| `lerp(a, b, t)` | 3 | number ×3 | number | `a + (b - a) * t`; `t` is not clamped |
| `min(a, b)` | 2 | number ×2 | number | Smaller of the two |
| `max(a, b)` | 2 | number ×2 | number | Larger of the two |
| `floor(x)` | 1 | number | number | Largest integer not greater than `x` |
| `ceil(x)` | 1 | number | number | Smallest integer not less than `x` |
| `round(x)` | 1 | number | number | `floor(x + 0.5)`, so `round(-2.5)` is `-2` |
| `abs(x)` | 1 | number | number | Absolute value |
| `mod(a, b)` | 2 | number ×2 | number | Floor-mod; `b == 0` throws `division by zero` |
| `sin(x)` | 1 | number, radians | number | Sine |
| `cos(x)` | 1 | number, radians | number | Cosine |
| `rgb(r, g, b)` | 3 | number ×3 | colour | Opaque colour; channels rounded and clamped to `[0, 255]`, alpha forced to `FF` |
| `argb(a, r, g, b)` | 4 | number ×4 | colour | As `rgb`, with an explicit alpha channel |
| `alpha(color, a)` | 2 | colour, number | colour | Replaces only the alpha byte; `a` rounded and clamped to `[0, 255]` |
| `mix(c1, c2, t)` | 3 | colour, colour, number | colour | Per-channel blend including alpha, `round(a + (b - a) * t)`, with `t` clamped to `[0, 1]` |
| `palette(list, index)` | 2 | list of numbers, number | number | `list[floorMod(floor(index), size)]`. An empty list throws `palette list must not be empty`; a non-number entry throws `palette list entries must be numbers` |
| `str(x)` | 1 | number, string or boolean | string | The stringify rule above |
| `fixed(x, digits)` | 2 | number, whole number in `[0, 20]` | string | Root-locale `%.<digits>f`. Fractional, negative or `> 20` digits throw |
| `plain(s)` | 1 | string | string | Removes legacy codes matching `&[0-9A-Fa-fK-Ok-oRr]`; every other `&` survives |
| `readable(s)` | 1 | string | string | Lowercases, splits on `_`, upper-cases each segment's first character and joins with spaces, so `IRON_ORE` becomes `Iron Ore` |

### Preview context functions

These four resolve before the library, so a same-named library function would be shadowed. None collide
today. All four are available in every preview document.

| Function | Arity | Arguments | Returns | Behaviour |
|---|---|---|---|---|
| `lang(key, ...)` | 1 or more | string key, then any values | string | Resolves `key` through the global localization table. Positional arguments bind onto the resolved English template's `{placeholder}` names in first-appearance order; extras are named `arg<n>` and go unused. Values are stringified with `str` and inserted as untrusted text, so a container name cannot smuggle in colour codes. An id the catalog does not declare fails the label with `lang: Unknown message key: <id>` |
| `count(slot)` | 1 | number | number | Stack size in that slot of the previewed inventory; `0` for an empty slot, an out-of-range index, or no inventory |
| `occupied(slot)` | 1 | number | boolean | Whether that slot holds a non-empty stack |
| `item(slot)` | 1 | number | string | Material id in that slot, such as `IRON_ORE`, or `""` when the slot is empty, out of range, or there is no inventory. Pair with `readable(item(0))` for display text |

Slot indexes are floored. Calling `lang` with no argument, or with a non-string first argument, throws.
Localization keys are covered in [Localization](/gloss/19-localization).

> Function **names** are not checked at compile time — only their arguments are. An unknown name throws
> `unknown function: <name>` when the expression runs. Since any call makes an expression non-constant, a
> misspelled function never fails at load; it fails at build or at refresh.
{.is-warning}

## Variables

### Resolution order

1. An element carrying a `repeat` wraps the scope so the loop variable name answers exactly, and everything
   else delegates to the parent.
2. A name starting with `vars.` reads the document's injected constants: `match.vars` with the matching
   variant's `vars` merged over them.
3. Everything else reads the sampled state snapshot — the built-in variables for the target's category plus
   every registered provider namespace, merged flat as `<namespace>.<key>`.

The snapshot is sampled lazily on the first lookup and re-sampled whenever the world's game time changes,
so one refresh reads each server getter once no matter how many expressions reference it. A context with no
world, such as a bare ender-chest inventory or a static preview, uses a wall-clock tick counter instead.

### Built-in variables

The `universal` group is published in every context: `time`, `blockType` and `customName`. The `inventory`
group, `inventory.size` and `inventory.occupied`, is published whenever the target has an inventory. Exactly
one category group is published on top of those, chosen at context construction from the block state, entity
or inventory type: `furnace`, `brewing`, `beehive`, `cauldron`, `jukebox`, `inventory` or `static`.

The full catalog with types and fallback values is in [Container Previews](/gloss/15-container-previews).
There is no player name, player world, server or time-of-day built-in. The viewing player is passed to
`PreviewStateProvider#snapshot` but is not published as a variable.

### Document variables and repeat variables

`vars.<name>` reads a constant from `match.vars` or from a variant's `vars`. Document variables are
reachable only under the `vars.` prefix, so they can never shadow, or be shadowed by, a built-in name.

Repeat variables are bare identifiers. The default name is `i`, and the values are `0` through `count - 1`
as numbers. `repeat.var` must be a valid identifier and may not be `vars` or any catalogued name, which
would make the loop variable unreachable.

### Provider namespaces

Values from a registered `PreviewStateProvider` are merged as `<namespace>.<key>` and narrowed to number,
string or boolean; any other numeric type widens to a number, and anything else is dropped. A provider
whose namespace collides with a built-in group is dropped whole and warned about once. A provider that
throws is skipped and warned about once per namespace.

### Metrics from other plugins

The integration bridge registers one provider per plugin whose metrics it discovered, so every metric key
is also a preview variable under its own native dotted name: `|metric.adapt.player-sessions|` in a
hologram line is `adapt.player-sessions` in a preview expression. The namespace is the first segment of
the metric key, so a plugin publishing `iris.generation-time` occupies the `iris` namespace and the
built-in collision rule applies to it like any other provider.

Reading a namespace marks its keys as requested, so a preview document is a first-class consumer: a
document that references `adapt.player-sessions` keeps that metric sampled while the preview is being
drawn, and it stops being sampled 60 seconds after the last preview closes.

The one-interval warm-up applies here too, and it is sharper than in text because a preview expression
that references a variable which is not yet present fails to evaluate. During warm-up the label reports
`label text: unknown variable: adapt.player-sessions` and renders empty; from the next sampler pass on it
renders normally. A metric the publishing plugin reports as unavailable behaves the same way — the
variable is simply absent rather than being invented as zero.

### Compile-time checking

| Reference | Result |
|---|---|
| A catalogued built-in name | accepted |
| `vars.<declared>` | accepted |
| `vars.<undeclared>` | compile error `unknown variable: vars.<name>` |
| A bare name in the enclosing repeat scope | accepted |
| Any other bare name | compile error `unknown variable: <name>` |
| A dotted name whose prefix is a reserved built-in namespace | compile error — a provider can never fill it, so it is a typo |
| A dotted name whose prefix is not reserved | warning `references provider namespace '<name>', not verifiable at parse time`; resolved, or failed, at runtime |

## Limits and errors

| Guard | Value | Behaviour |
|---|---|---|
| Parser recursion depth | 256 | `expression too deeply nested`. Parenthesised, bracketed and call-argument sub-expressions re-enter the ternary production, so they count against the cap |
| Constant `repeat.count` | 1024 | Load error naming the cap |
| Live `repeat.count` | 1024 | Truncated at render, with a message |
| Total compiled templates | 4096 | Load error naming the cap |

The depth cap exists because pathological input like 5000 nested parentheses would recurse the JVM stack
into a `StackOverflowError`, which is an `Error` rather than an `ExprException` and would escape the
document loader's guard.

Parse errors carry the 0-based source character index and are reported with the field path, for example
`elements[3].color: unexpected token at 7`. Evaluation errors carry no position and are reported without
that suffix. A document that fails to load logs `previews/<name>.json: <detail>` at `WARNING` and is not
registered; the next matching document, or none, is used instead. Render-time failures never take a frame
down — the failing element is skipped or falls back and the rest of the document still renders. The
per-failure fallbacks are listed in [Container Previews](/gloss/15-container-previews).

## Reference

| Config key | Default | Effect |
|---|---|---|
| `[text] placeholders` | `true` | PlaceholderAPI stage of the text pipeline. Does not affect menus or panels |
| `[text] functions` | `true` | `\|function\|` stage of the text pipeline |
| `[holograms] perViewerPlaceholders` | `true` | Lets a hologram containing `%` render per viewer so placeholders resolve |
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
