---
title: "Emoji, Text & Animations"
description: "Gloss documentation: Emoji, Text & Animations"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss authored display text uses one viewer-aware text capability contract. Holograms, boards, tablists, menu and panel labels and messages, bubble prefixes, drop labels and the MOTD all use the shared pipeline. Container previews use the same expression runtime as a whole-field DSL. Emoji and animations are enveloped JSON documents in `plugins/Gloss/emoji/` and `plugins/Gloss/animations/`. Player chat gets a deliberately shorter, non-executable path.

## The text pipeline

`text/TextPipeline.java` renders a raw string in exactly five stages, in this order:

1. **Functions.** `|name|` tokens are replaced by the value of the registered function `name`. Skipped entirely when `[text] functions = false`. Short-circuited when the string contains no `|`.
2. **Inline expressions.** Each `{{ expression }}` block evaluates against time, server state, viewer values, PlaceholderAPI or integration metrics as available.
3. **Placeholders.** PlaceholderAPI resolves the string. This stage runs **only when a viewer is present** and `[text] placeholders = true`. Short-circuited when the string contains no `%`.
4. **Emoji.** `:id:` tokens and emoji triggers are replaced with their glyphs. Skipped when `[features] emoji = false`, because the emoji service is what installs this stage.
5. **Colors.** `[RRGGBB]` bracket hex first, then `&` legacy codes.

A "static" render is the same pipeline with no viewer. Player-backed parts of stages 2 and 3 never run. Shared and temporary holograms, damage indicators, drop labels and the MOTD render statically. Native `time.*` and `server.*` variables, server-native PAPI aliases and explicit `papi`/`metric` fallbacks remain truthful there; raw player placeholders stay written. Per-viewer holograms, boards, tablists, menus, panels, preview cards and BubbleStyle prefixes pass a viewer. The player message beside a bubble prefix is already-rendered chat content and is not scanned again for functions, expressions, placeholders, emoji or colors.

### Functions

A function token is a name between two pipe characters. Example: `|animation.rainbow|`.

- A name with no registered function is left in the string exactly as written, pipes included.
- A function that throws renders as an empty string and logs one warning per function name (`Text function |<name>| failed: ...`). The warning is not repeated until the function is registered again or `/gloss reload` runs.
- A function that returns `null` renders as an empty string.

Gloss registers two families of functions. There is no public API for registering a third:

| Family | Registered by | One token per |
|---|---|---|
| `\|animation.<id>\|` | The animation service | Loaded animation document |
| `\|metric.<key>\|` | The integration bridge | Metric another installed Volmit plugin publishes |

#### `|metric.<key>|`

The integration bridge discovers every plugin that publishes the shared Volmit integration contract on the Bukkit services manager — Adapt, Iris, React, Wormholes, HiddenOre, BileTools. It handshakes with it. It registers one text function per metric key it advertises. The key is the plugin own dotted key. A token looks like `|metric.adapt.player-sessions|` or `|metric.iris.generation-time|`.

Rendered values are formatted compactly: `42`, `3.14`, `128.5` below a thousand, then `1.2K`, `1.5M`, `2B`, `3.5T`.

Three things render as **nothing at all** — an empty string, exactly like any other function that has no value:

- a metric the sampler has not reached yet. Nothing is sampled until something asks for it. The first render of a token after a restart is empty. The value appears one `[integration] sampleIntervalTicks` later. That warm-up is one interval, not one tick
- a metric the publishing plugin currently reports as unavailable
- a plugin that is not installed. Its keys are never registered. `|metric.foo.bar|` is an unknown function and stays in the line verbatim, pipes included. That is the same rule as any other unknown token.

Discovery re-runs whenever a plugin enables or disables. If you install a plugin mid-session, its tokens start working without a restart. If you disable one, they stop. See [Runtime Architecture](/gloss/20-runtime-architecture) for the bridge own lifecycle. See [Expressions & Placeholders](/gloss/13-expressions-placeholders) for the matching preview variables.

### Colors

Two syntaxes work anywhere colors apply:

| Syntax | Rule |
|---|---|
| `&` codes | Standard legacy translation (`&d`, `&l`, `&r`, and the rest) |
| `[RRGGBB]` | Exactly six hex digits with `]` immediately after. `[ff00aa]Gloss` works, `[f0a]` and `[ff00aaa]` are left untouched |

Bracket hex is case-insensitive and is converted before `&` codes. Both can appear in the same line.

### Chat

Player chat does **not** use the four-stage pipeline. `AsyncPlayerChatEvent` is handled at `HIGH` priority (cancelled events ignored) and gets two stages only:

1. Emoji, when `[features] emoji = true` **and** the sender holds `gloss.emoji.use`.
2. Colors, when `[chat] color = true` **and** the sender holds `gloss.chat.color`.

Functions and placeholders are never applied to chat. Rewriting the chat message at `HIGH` means other plugins listening at `HIGHEST` or `MONITOR` see the already-substituted text.

Chat bubbles consume that final message rather than reconstructing it. Translated legacy colors, RGB sequences and decorations remain in the bubble and remain active across its wrapped rows. Raw `&` codes that were not authorized and translated by the chat color stage stay literal. This keeps the bubble visually aligned with chat without turning the bubble renderer into a second permission-bypassing color pass.

### Menu, panel and preview text

Menu and panel text icons and `message` actions run the same five-stage pipeline as scoreboards with the session player as viewer. Toggle conditions use the same renderer before their case-insensitive comparison. Text icons re-render complete placeholder, function and inline-expression sources at their configured `refreshTicks` cadence.

Container preview fields use whole-field expressions rather than `{{ }}` delimiters:

| Surface | Stages, in order |
|---|---|
| Menu and panel text icons/messages | functions → inline expressions → PlaceholderAPI → emoji → colors → MiniMessage |
| Container preview labels/card titles | preview expression evaluation → emoji → MiniMessage |

Preview expressions expose their target-specific furnace, inventory, entity and provider variables plus the standard `time.*`, `server.*` and `player.*` variables and `papi`, `papiNumber` and `metric` functions. A block, entity, ender-chest or locked preview has its viewing player. A console/static diagnostic does not; player values then require an explicit fallback.

Colors still come from MiniMessage tags in menu and preview documents. The color stage that runs ahead of it translates `&` codes and `[RRGGBB]` bracket hex into MiniMessage own syntax first. Both spellings work in a menu label.

## Emoji

### The emoji document

One JSON file per emoji in `plugins/Gloss/emoji/`. The id is the file name with `.json` removed. There is no id key inside the document. Only files directly inside `emoji/` are read, and only `.json` files.

`plugins/Gloss/emoji/heart.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "trigger": "<3",
  "emoji": "U+2764;",
  "enabled": true
}
```

| Key | Required | Notes |
|---|---|---|
| `schemaVersion` | yes | Must be `1`. Anything else rejects the file with `unsupported emoji schemaVersion: <n>` |
| `revision` | yes | `1` to `9007199254740991` |
| `trigger` | no | A literal string that also expands to the glyph. `null` or absent becomes `""`, which means token-only |
| `emoji` | yes | The replacement text. Blank or absent rejects the file with `emoji document requires an emoji value` |
| `enabled` | no | **Absent means `true`.** Only an explicit `"enabled": false` turns an emoji off |

Every emoji is always usable as `:<id>:`, whether or not it has a trigger. A trigger is an additional, shorter spelling.

`emoji` is passed through the `U+<hex>;` escape decoder. The hex run is everything between `U+` and the next `;`, any length. An unparseable value becomes `?`. A trailing `U+<hex>` with no `;` is kept literally if it does not parse. A string with no `U` character at all is used verbatim. A pasted glyph or a resource-pack private-use character works directly.

Emoji replacement text is a literal fragment, not executable authored code. Function, expression and placeholder-looking text introduced by an emoji value is not scanned again. This is required because player chat may invoke emoji triggers; chat can never use an emoji document to execute operator-side expressions or bypass permissions.

### Shipped defaults

67 emoji documents ship inside the jar. They are extracted into `emoji/`
whenever a file of that name is missing. This runs on every enable and
on every `/gloss reload`, not only on first run. If you delete a shipped
emoji file, it comes back on the next reload or restart. To turn a
shipped emoji off, set `"enabled": false` in its file and leave the file
in place.

The shipped set starts with `heart` (the only one with a trigger, `<3`).
It also includes `airplane`, `mail`, `cut`, `pencil`, `nib`, `check`,
`thickcheck`, `cross`, `thickcross`, `star`, `darkstarstar`,
`snowflake`, `sparkle` and `sun`. Arrow ids are `left`, `right`, `up`,
`down`, `leftright`, `updown`, `upleft`, `upright`, `downright` and
`downleft`. Other ids are `tapedrive`, `thickplus`, `lineplus`,
`opencross`, `thickopencross`, `maltcross`, `starofdavid`, `heavystar`,
`blackdiamond`, and `vbar1` to `vbar3`. Circled digits are `1` to `10`,
`1t` to `10t` and `1h` to `10h`.

Your own emoji files are never touched by the extraction. Ids that are not in the shipped list are never re-created.

### Replacement order

`EmojiService` sorts every loaded emoji by document id using plain string ordering (digits before uppercase, uppercase before lowercase). `EmojiReplacer` walks that sorted list in order. For each entry it replaces the trigger first, then the `:id:` token, across the whole string, before it moves to the next entry.

Because the passes are sequential, **order matters whenever one trigger contains another**. If `smile.json` has trigger `:)` and `smilebig.json` has trigger `:))`, `smile` sorts first. `:))` is consumed as `:)` followed by a leftover `)`. `smilebig` never fires. The same applies in reverse. Give the longer trigger the id that sorts first and it wins.

The only lever an operator has over this is the id, which is the file name. Rename the file that must run first so it sorts earlier. A numeric or letter prefix such as `00-smilebig.json` is the usual fix. Note that the id is also the chat token. A rename changes `:smilebig:` to `:00-smilebig:`.

Token collisions are not a problem. `:1:` cannot match inside `:10:` because the tokens are delimited on both sides. Only bare triggers overlap.

A later entry can also match text that an earlier entry produced, since each pass runs over the current string. This rarely matters with real glyphs. It is worth knowing if an emoji output is plain ASCII.

Disabled emoji are dropped before the replacer is built. They cost nothing. They are invisible to replacement, `/gloss emoji list` and tab completion.

### Permissions

By default a single node gates emoji in chat: `gloss.emoji.use`, granted to everyone. Emoji in holograms, boards, tablist text, drop labels and the MOTD are not permission-gated at all. They render whenever `[features] emoji` is on.

If you set `[emoji] emojiSpecificPermissions = true`, Gloss adds a per-emoji check **on top of** `gloss.emoji.use`, and only for chat. The node is `gloss.emoji.<id>` — the prefix `gloss.emoji.` plus the document id. An emoji the sender lacks the node for is skipped entirely for that message. The token or trigger stays in the text as typed.

> `gloss.emoji.<id>` shares its namespace with the declared nodes `gloss.emoji.use` and `gloss.emoji.reset`. An emoji whose file is named `use.json` or `reset.json` would be gated by one of those. Avoid those two ids.
{.is-warning}

Per-emoji nodes are not declared in `plugin.yml`. An ungranted node behaves as op-only until a permission plugin grants it.

### Tab completion

With `[emoji] tabComplete = true` (the default) on a Paper-family
server, chat words that start with `:` offer matching tokens. The match
uses enabled emoji tokens and is case-insensitive. Command arguments
are not affected. The whole feature is absent on Spigot because it is
built on Paper `AsyncTabCompleteEvent`. Gloss looks the class up
reflectively and skips registration when it is not there.

The listener re-reads `[features] emoji` and `[emoji] tabComplete` on every event. If you turn either off, the change takes effect as soon as the config change lands. If you turn `tabComplete` back **on**, you need a full restart. The listener is registered once when the chat service enables. `/gloss reload` does not re-run that registration.

### Commands

```
/gloss emoji list [page=1]
/gloss emoji reset [name=*]
```

`list` prints a page of 45 enabled emoji, three to a line. A full page occupies 19 chat lines including the banner, page status, next-page action and bottom bar. Each glyph is clickable to insert its `:id:` token into your chat input. It needs `gloss.emoji.use`. The page closes with a `Page X/Y` line. When there is more to see, it also shows the full `Next page` command. Out-of-range page numbers are clamped to the first or last page.

`reset` rewrites shipped emoji documents from the jar and needs `gloss.emoji.reset` (op). `name=*` (the default) restores all 67. A single name restores just that one. A trailing `.json` on the name is accepted.

> `/gloss emoji reset` overwrites the target files on disk. Edits to a shipped emoji id are lost. Ids that are not in the shipped list are untouched.
{.is-warning}

### Turning emoji off

`[features] emoji = false` stops the emoji service from enabling at all. No defaults are extracted. No documents load. The replacement stage is removed from the text pipeline. Chat is not touched. `/gloss emoji list` reports an empty list. `/gloss emoji reset` still works, because it writes files rather than reading loaded state.

## Animations

An animation is a list of frame strings that advances on wall-clock time. It is exposed to the text pipeline as `|animation.<id>|`.

### The animation document

One JSON file per animation in `plugins/Gloss/animations/`. The id comes from the file name.

`plugins/Gloss/animations/rainbow.json` (shipped):

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "mode": "ascend",
  "frameIntervalMs": 53,
  "frames": [
    "[FF0000]",
    "[FF1A00]",
    "[FF3300]",
    "[FF4D00]",
    "[FF6600]",
    "[FF8000]",
    "[FF9900]",
    "[FFB300]",
    "[FFCC00]",
    "[FFE600]",
    "[FFFF00]",
    "[E5FF00]",
    "[CCFF00]",
    "[B2FF00]",
    "[99FF00]",
    "[7FFF00]",
    "[66FF00]",
    "[4CFF00]",
    "[33FF00]",
    "[19FF00]",
    "[00FF00]",
    "[00FF1A]",
    "[00FF33]",
    "[00FF4D]",
    "[00FF66]",
    "[00FF80]",
    "[00FF99]",
    "[00FFB3]",
    "[00FFCC]",
    "[00FFE6]",
    "[00FFFF]",
    "[00E5FF]",
    "[00CCFF]",
    "[00B2FF]",
    "[0099FF]",
    "[007FFF]",
    "[0066FF]",
    "[004CFF]",
    "[0033FF]",
    "[0019FF]",
    "[0000FF]",
    "[1A00FF]",
    "[3300FF]",
    "[4D00FF]",
    "[6600FF]",
    "[8000FF]",
    "[9900FF]",
    "[B300FF]",
    "[CC00FF]",
    "[E600FF]",
    "[FF00FF]",
    "[FF00E5]",
    "[FF00CC]",
    "[FF00B2]",
    "[FF0099]",
    "[FF007F]",
    "[FF0066]",
    "[FF004C]",
    "[FF0033]",
    "[FF0019]"
  ]
}
```

| Key | Required | Notes |
|---|---|---|
| `schemaVersion` | yes | Must be `1`, otherwise `unsupported animations schemaVersion: <n>` |
| `revision` | yes | `1` to `9007199254740991` |
| `mode` | yes | One of the four constants below. Matched case-insensitively and stored lowercase. Blank or absent gives `animation requires a mode`. Anything else gives `unknown animation mode: <value>` |
| `frameIntervalMs` | yes | Milliseconds per frame, clamped to `1`..`60000` |
| `frames` | yes | At least one string, otherwise `animation requires at least one frame`. A `null` entry becomes `""` |

`rainbow.json` walks the complete RGB hue wheel through 60
color-only frames at 53 milliseconds per frame, so the transition is a smooth 3.18-second gradient
rather than a small legacy-color cycle. The non-round cycle keeps three-second status pollers from
repeatedly sampling the same MOTD color. `|animation.rainbow|&lONLINE` changes the
following text's color without inserting a word. Like emoji, it is re-extracted whenever the file
is missing. On startup Gloss also replaces any exact unchanged prior shipped file: the original
four `Gloss`-prefixed frames, the later four color-only frames, and the phase-locked 60-frame 50 ms
gradient. Any edited or merely reformatted copy is preserved as user content; use `/gloss animations
reset name=rainbow` when that copy should be replaced deliberately.

Gloss also ships `marquee`, `timeline`, `typewriter`, `flash`, `wipe`, `scanner`, `decode`,
`odometer` and `wave`. Each is a scoreboard-safe example built from a reusable inline-expression
helper. Use `|animation.marquee|` to play the shipped example, or call `marquee(...)` directly to
animate your own text.

Already extracted examples are not rewritten when their authored step rate changes. Delete those
files or run `/gloss animations reset` to regenerate the current defaults. The same rule applies to
`boards/animation-showcase.json` through `/gloss board reset name=animation-showcase`.

The RGB frame expands to a full legacy hex sequence after the text pipeline. That is appropriate
for holograms, MOTDs, tablists, bubbles and other component text. A sidebar row has the stricter
32-unit team-prefix/suffix budget documented in [Scoreboards & Groups](/gloss/05-scoreboards-groups),
so generated scoreboard examples use a compact animated glyph instead of spending that row's budget
on the RGB prefix. The editor's scoreboard validator shows the exact delivered result if a custom
board references `rainbow` directly.

### Reusable animation helpers

Every helper is pure and receives an explicit step, elapsed time or progress value. Nothing starts a
hidden task or keeps per-player state; two surfaces given the same arguments return the same text.

| Helper | Result |
|---|---|
| `marquee(text, width, step)` | Scrolls text left through a 1–64-character window |
| `timeline([[text, seconds], ...], elapsedSeconds)` | Loops through 1–64 scenes, each with its own positive duration |
| `typewriter(text, step, holdSteps)` | Types, holds and erases text |
| `flash(first, second, step)` | Alternates two complete snippets, including their formatting |
| `wipe(text, step)` | Reveals and hides text while preserving its width |
| `scanner(text, baseStyle, highlightStyle, step)` | Moves one highlighted character across the text |
| `scramble(text, step)` | Deterministically resolves randomized glyphs into the target text |
| `odometer(from, to, progress, digits)` | Interpolates safe whole numbers and zero-pads to 1–16 digits |
| `wave(text, styles, step)` | Chases 1–16 color/style prefixes across the characters |

This timeline scrolls a welcome message, flashes a boost notice, then replaces it with an event
message:

```text
{{ timeline([
  ['&b' + marquee('WELCOME', 10, floor(time.seconds * 4)), 4],
  [flash('&a&lBOOSTED', '&7BOOSTED', floor(time.seconds * 4)), 4],
  ['&bEVENT LIVE', 4]
], time.seconds) }}
```

`marquee`, `typewriter`, `wipe`, `scanner`, `scramble` and `wave` transform characters. Their text
argument must therefore be plain, single-line text; put color outside that argument or use the
dedicated style arguments. Formatting tokens and common multi-code-point sequences such as flags,
skin-tone modifiers and joined emoji are rejected instead of being split. PlaceholderAPI tokens are
also rejected; resolve them first with `papi(...)` and pass that result to the helper. `scanner` and
`wave` styles must start with a legacy color/reset or
`[RRGGBB]` and may contain one additional formatting code. Text is bounded to 256 characters, or 64
for the per-character styled helpers. Timeline duration is bounded to one hour.

The shipped examples advance four steps per second. Animated boards, tablists, persistent holograms,
and menu text with no explicit `refreshTicks` sample clock-driven expressions and named animations
every tick, while each expression still controls when its visible state changes. The one-frame shipped examples use a
nominal `frameIntervalMs` of 1000; their expression time, not that frame interval, determines the
result.

The web editor's **Randomize** action for an animation document chooses across the complete shipped
set: rainbow, marquee, timeline, typewriter, flash/pulse, wipe, scanner, scramble/decode, odometer
and wave/chase. The generated document contains ordinary editable frames and helper expressions;
it does not depend on editor-only playback behavior.

### Modes

The `AnimationMode` constants, from `animation/AnimationMode.java`:

| `mode` | Behavior |
|---|---|
| `ascend` | Frames play forward and wrap: `0, 1, 2, 3, 0, 1, ...` |
| `descend` | Frames play backward and wrap: `3, 2, 1, 0, 3, 2, ...` |
| `ascend_descend` | Ping-pong over a cycle of `2N` steps, so the first and last frame each hold for two intervals: `0, 1, 2, 3, 3, 2, 1, 0, ...` |
| `random` | The frame index is a hash of the current interval number and the animation id. Deterministic, so every surface and every viewer agrees, but the order is scrambled and a frame can repeat |

A single-frame animation always renders that frame, whatever the mode.

### Using an animation

`|animation.<id>|` works anywhere the text pipeline runs: hologram lines, board titles and lines,
tablist header, footer and name formats, menu and panel text, `[drops] nameFormat` and MOTD lines.
Container-preview live labels call the expression helpers directly; they do not resolve a named
animation token.

The frame is chosen from the server clock at render time. Two surfaces
that show the same animation always show the same frame. How often the
change is *visible* is bounded by the consuming surface sampler, not by `frameIntervalMs`. Active
boards, tablists and persistent holograms containing clock variables or named animations sample once
per tick. Menu and panel text does the same when `refreshTicks` is omitted; an explicit value wins.
Static, PlaceholderAPI, metric, player and server-only text retains the configured ordinary cadence.
If you set `frameIntervalMs` below 50 ms outside the hologram fast path, frames are skipped.

Hologram lines are the exception. A clip faster than 20 fps (`frameIntervalMs` below 50) is driven by the dedicated high-frequency animator thread at up to `[holograms] maxAnimationFps` (default 120). It sends sub-tick text updates as packets instead of waiting for the tick refresh. Clips at 20 fps or below stay tick-driven everywhere. See [Holograms](/gloss/04-holograms) for the mechanics and the `highFrequencyAnimations`, `maxAnimationFps` and `animationPacketBudget` knobs.

Frame text is substituted before inline expressions, PlaceholderAPI, emoji and colors. `&` codes,
bracket hex and `:emoji:` tokens inside a frame all work. Inline expressions can also animate text
directly without a named animation document; see [Expressions & Placeholders](/gloss/13-expressions-placeholders).

### Commands

```
/gloss animations list [page=1]
/gloss animations reset [name=*]
```

`animation` is an alias for `animations`. `list` prints the loaded animation ids fifteen per page behind a count header and the shared pager footer. It needs no permission. `reset` needs `gloss.animations.reset` (op) and restores the ten shipped animation documents from the jar.

> `/gloss animations reset` overwrites the ten shipped animation ids. Only shipped ids are affected. Your own animation files are never touched.
{.is-warning}

### Turning animations off

`[features] animations = false` stops the service from enabling. No defaults are extracted. No documents load. No `|animation.<id>|` functions are registered. Those tokens then survive the function stage untouched and appear literally in rendered text. `/gloss animations list` reports an empty list.

## Hot reload

`emoji/` and `animations/` are both watched by the shared `DataWatchdog` at `[hotload] watchIntervalTicks` (default 5 ticks). If you add, edit, rename or delete a file, the change applies without a command. A document that fails to parse is logged and skipped. The copy already in memory keeps working until the file parses again. `/gloss reload` re-runs both services from scratch. See [Data Files & Hot Reload](/gloss/03-data-files).

## Reference

| Command | Arguments | Permission |
|---|---|---|
| `/gloss emoji list` | `[page=1]` | `gloss.emoji.use` |
| `/gloss emoji reset` | `[name=*]` | `gloss.emoji.reset` |
| `/gloss animations list` | `[page=1]` | none |
| `/gloss animations reset` | `[name=*]` | `gloss.animations.reset` |

Optional arguments must be written as `key=value`. A stray positional value is rejected.

| Permission | Default | Grants |
|---|---|---|
| `gloss.emoji.use` | `true` | Emoji replacement in chat, and `/gloss emoji list` |
| `gloss.emoji.<id>` | undeclared (op) | That one emoji in chat, only when `[emoji] emojiSpecificPermissions = true` |
| `gloss.emoji.reset` | `op` | `/gloss emoji reset` |
| `gloss.animations.reset` | `op` | `/gloss animations reset` |
| `gloss.chat.color` | `op` | Color codes in the sender's own chat messages |

| Config key | Default | Effect |
|---|---|---|
| `[features] emoji` | `true` | Emoji service, emoji stage of the pipeline, chat emoji |
| `[features] animations` | `true` | Animation service and `\|animation.<id>\|` functions |
| `[emoji] emojiSpecificPermissions` | `false` | Requires `gloss.emoji.<id>` per emoji in chat |
| `[emoji] tabComplete` | `true` | Paper chat tab completion for `:` tokens |
| `[text] placeholders` | `true` | PlaceholderAPI stage of the pipeline |
| `[text] functions` | `true` | `\|function\|` stage of the pipeline, including `\|metric.<key>\|` |
| `[chat] color` | `true` | Color-code translation in chat, with `gloss.chat.color` |
| `[integration] sampleIntervalTicks` | `20` | Ticks between samples backing `\|metric.<key>\|` |

Related pages: [Holograms](/gloss/04-holograms), [Scoreboards & Groups](/gloss/05-scoreboards-groups), [Tablist & Server List MOTD](/gloss/06-tablist-motd), [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops), [Expressions & Placeholders](/gloss/13-expressions-placeholders).
