---
title: "Emoji, Text & Animations"
description: "Format Gloss text, add emoji, and reuse text animations"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss uses one text pipeline for holograms, scoreboards, tablists, menu text, bubble prefixes, drop labels, and the MOTD. Emoji files live in `plugins/Gloss/emoji/`; animation files live in `plugins/Gloss/animations/`.

`/gloss web edit emoji <id>` and `/gloss web edit animation <id>` open focused live editor
sessions; `/gloss web workspace` includes both document families.

## The text pipeline

Gloss renders text in this order:

1. **Functions.** `|name|` tokens are replaced by the value of the registered function `name`. Skipped entirely when `[text] functions = false`. Short-circuited when the string contains no `|`.
2. **Inline expressions.** Each `{{ expression }}` block evaluates against time, server state, viewer values, PlaceholderAPI or integration metrics as available.
3. **Placeholders.** PlaceholderAPI resolves the string. This stage runs **only when a viewer is present** and `[text] placeholders = true`. Short-circuited when the string contains no `%`.
4. **Emoji.** `:id:` tokens and emoji triggers are replaced with their glyphs. Skipped when `[features] emoji = false`, because the emoji service is what installs this stage.
5. **Colors.** `[RRGGBB]` bracket hex first, then `&` legacy codes.

A static surface has no viewer, so player expressions and PlaceholderAPI values remain unresolved. Per-player holograms, scoreboards, tablists, menus, panels, previews, and bubble prefixes use the viewing player. Chat message text is not processed a second time inside a bubble.

In-world text can mark ranges for particle layers. Rendered values cannot create new ranges, and range tags cannot nest. See [Particle Layers](/gloss/25-particle-layers).

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

Installed Volmit plugins can publish metric functions such as `|metric.adapt.player-sessions|`.

Rendered values are formatted compactly: `42`, `3.14`, `128.5` below a thousand, then `1.2K`, `1.5M`, `2B`, `3.5T`.

An unavailable metric renders as an empty string. A token from a plugin that is not installed remains unchanged.

If you install a plugin mid-session, its tokens start working without a restart. If you disable one, they stop. See [Expressions & Placeholders](/gloss/13-expressions-placeholders) for the matching preview variables.

### Colors

Two syntaxes work anywhere colors apply:

| Syntax | Rule |
|---|---|
| `&` codes | Standard legacy translation (`&d`, `&l`, `&r`, and the rest) |
| `[RRGGBB]` | Exactly six hex digits with `]` immediately after. `[ff00aa]Gloss` works, `[f0a]` and `[ff00aaa]` are left untouched |

Bracket hex is case-insensitive and is converted before `&` codes. Both can appear in the same line.

Players receive colors, decorations, click actions, and hover text. Consoles receive readable plain text when rich formatting is unavailable.

### Chat

Player chat uses only two stages:

1. Emoji, when `[features] emoji = true` **and** the sender holds `gloss.emoji.use`.
2. Colors, when `[chat] color = true` **and** the sender holds `gloss.chat.color`.

Functions and placeholders are not applied to chat. Bubbles reuse the final formatted message, so unauthorized raw color codes remain literal.

### Menu, panel and preview text

Menu and panel text icons and `message` actions run the same five visible-text stages as scoreboards with the session player as viewer. Toggle conditions use the same renderer before their case-insensitive comparison. Text icons re-render complete placeholder, function and inline-expression sources at their configured `refreshTicks` cadence. Menu and panel particle layers also retain configured particle ranges on text icons; message actions do not create an in-world particle surface.

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
| `schemaVersion` | yes | Must be `1`. Any other version is silently ignored |
| `revision` | yes | `1` to `9007199254740991` |
| `trigger` | no | A literal string that also expands to the glyph. `null` or absent becomes `""`, which means token-only |
| `emoji` | yes | The replacement text. Blank or absent rejects the file with `emoji document requires an emoji value` |
| `enabled` | no | **Absent means `true`.** Only an explicit `"enabled": false` turns an emoji off |

Every emoji is always usable as `:<id>:`, whether or not it has a trigger. A trigger is an additional, shorter spelling.

`emoji` is passed through the `U+<hex>;` escape decoder. The hex run is everything between `U+` and the next `;`, any length. An unparseable value becomes `?`. A trailing `U+<hex>` with no `;` is kept literally if it does not parse. A string with no `U` character at all is used verbatim. A pasted glyph or a resource-pack private-use character works directly.

Emoji replacement text is a literal fragment, not executable configuration. Function, expression and placeholder-looking text introduced by an emoji value is not scanned again. This prevents player chat from using an emoji document to execute operator-side expressions or bypass permissions.

### Defaults

Gloss includes 67 emoji documents. Missing bundled files return after a reload or restart. Set `"enabled": false` instead of deleting one. Files with your own IDs are not touched.

### Replacement order

Gloss applies emoji in file-ID order. This matters only when one bare trigger contains another. Rename the longer trigger's file so it sorts first. Disabled emoji do not appear in replacement, `/gloss emoji list`, or tab completion.

### Permissions

By default a single node gates emoji in chat: `gloss.emoji.use`, granted to everyone. Emoji in holograms, boards, tablist text, drop labels and the MOTD are not permission-gated at all. They render whenever `[features] emoji` is on.

If you set `[emoji] emojiSpecificPermissions = true`, Gloss adds a per-emoji check after `gloss.emoji.use`, only for chat. The node is the `gloss.emoji.` prefix plus the document id: `gloss.emoji.<id>`. If the sender lacks that node, Gloss skips the emoji and leaves the token or trigger unchanged.

> `gloss.emoji.<id>` shares its namespace with the declared nodes `gloss.emoji.use` and `gloss.emoji.reset`. An emoji whose file is named `use.json` or `reset.json` would be gated by one of those. Avoid those two ids.
{.is-warning}

Per-emoji permissions are operator-only until a permission plugin grants them.

### Tab completion

With `[emoji] tabComplete = true` (the default), Paper-family servers suggest enabled emoji tokens for chat words beginning with `:`. Matching is case-insensitive and does not affect command arguments. Spigot does not support this feature.

Turning tab completion off applies on reload. Turning it back on requires a restart.

### Commands

```
/gloss emoji list [page=1]
/gloss emoji reset [name=*]
```

`list` shows enabled emoji. Click a glyph to insert its `:id:` token. It needs `gloss.emoji.use`.

`reset` rewrites included emoji documents from the jar and needs `gloss.emoji.reset` (op). `name=*` (the default) restores all 67. A single name restores just that one. A trailing `.json` on the name is accepted.

> `/gloss emoji reset` overwrites the target files on disk. Edits to an included emoji id are lost. Ids that are not in the included list are untouched.
{.is-warning}

### Turning emoji off

`[features] emoji = false` stops the emoji service from enabling at all. No defaults are extracted. No documents load. The replacement stage is removed from the text pipeline. Chat is not touched. `/gloss emoji list` reports an empty list. `/gloss emoji reset` still works, because it writes files rather than reading loaded state.

## Animations

An animation is a list of frame strings that advances on wall-clock time. It is exposed to the text pipeline as `|animation.<id>|`.

### The animation document

One JSON file per animation in `plugins/Gloss/animations/`. The id comes from the file name.

`plugins/Gloss/animations/rainbow.json` (included):

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
| `schemaVersion` | yes | Must be `1`. Any other version is silently ignored |
| `revision` | yes | `1` to `9007199254740991` |
| `mode` | yes | One of the four constants below. Matched case-insensitively and stored lowercase. Blank or absent gives `animation requires a mode`. Anything else gives `unknown animation mode: <value>` |
| `frameIntervalMs` | yes | Milliseconds per frame, clamped to `1`..`60000` |
| `frames` | yes | At least one string, otherwise `animation requires at least one frame`. A `null` entry becomes `""` |

`rainbow.json` contains 60 color frames at 53 milliseconds per frame. `|animation.rainbow|&lONLINE` colors the text that follows it. Use `/gloss animations reset name=rainbow` to restore the bundled copy.

Gloss also includes `marquee`, `timeline`, `typewriter`, `flash`, `wipe`, `scanner`, `decode`, `odometer`, and `wave`. Use their named animation tokens or call the matching expression helper.

Gloss does not overwrite extracted files. Use the relevant reset command to restore a bundled example.

The RGB frame expands to a full legacy hex sequence after the text pipeline. Holograms, MOTDs,
tablists, bubbles and scoreboards all receive it as component text. Modern scoreboard titles and
rows are sent whole rather than through the retired prefix/suffix character budget.

### Reusable animation helpers

Each helper receives an explicit step, elapsed time, or progress value and returns the same result for the same inputs.

| Helper | Result |
|---|---|
| `align(text, width, mode)` | Pads visible text to 1–16384 character cells using `left`, `center`, `middle` or `right`; longer text is never truncated |
| `marquee(text, width, step)` | Scrolls text left through a 1–64-character window |
| `timeline([[text, seconds], ...], elapsedSeconds)` | Loops through 1–64 scenes, each with its own positive duration |
| `typewriter(text, step, holdSteps)` | Types, holds and erases text |
| `flash(first, second, step)` | Alternates two complete snippets, including their formatting |
| `wipe(text, step)` | Reveals and hides text while preserving its width |
| `scanner(text, baseStyle, highlightStyle, step)` | Moves one highlighted character across the text |
| `scramble(text, step)` | Deterministically resolves randomized glyphs into the target text |
| `odometer(from, to, progress, digits)` | Interpolates safe whole numbers and zero-pads to 1–16 digits |
| `wave(text, styles, step)` | Chases 1–16 color/style prefixes across the characters |

`align` ignores legacy and bracket-hex formatting when it counts visible Unicode code points.
`middle` is an alias for `center`. Its padding is character-cell based, so proportional and custom
fonts can remain visually uneven. It never provides marquee-style termination: content longer than
the requested width is returned whole.

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

Legacy `&k` obfuscation works on every configured text-pipeline surface. End it with `&r` or any later
color code. Gloss also scopes every logical line with a reset so obfuscation cannot leak into the
next scoreboard row, hologram line or MOTD line. Keep formatting outside a character-transform
helper, for example `&k{{ marquee('MAGIC', 5, floor(time.seconds * 4)) }}&r`; placing `&k` inside the
helper's text argument is rejected because the helper accepts plain text.

The included examples advance four steps per second. Animated boards, tablists, persistent holograms,
and menu text with no explicit `refreshTicks` sample clock-driven expressions and named animations
every tick, while each expression still controls when its visible state changes. The one-frame included examples use a
nominal `frameIntervalMs` of 1000; their expression time, not that frame interval, determines the
result.

The web editor can create editable examples using the included animation helpers.

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

Frames are selected from server time, so the same animation stays synchronized across surfaces. Each surface's refresh rate limits the visible frame rate.

Holograms can display clips above 20 fps when high-frequency animations are enabled. See [Holograms](/gloss/04-holograms).

Frame text is substituted before inline expressions, PlaceholderAPI, emoji and colors. `&` codes,
bracket hex and `:emoji:` tokens inside a frame all work. Inline expressions can also animate text
directly without a named animation document; see [Expressions & Placeholders](/gloss/13-expressions-placeholders).

### Commands

```
/gloss animations list [page=1]
/gloss animations reset [name=*]
```

`animation` is an alias for `animations`. `list` shows the loaded animation ids and needs no permission. `reset` needs `gloss.animations.reset` (op) and restores the ten included animation documents.

> `/gloss animations reset` overwrites the ten included animation ids. Your own animation files are never touched.
{.is-warning}

### Turning animations off

`[features] animations = false` stops the service from enabling. No defaults are extracted. No documents load. No `|animation.<id>|` functions are registered. Those tokens then survive the function stage untouched and appear literally in rendered text. `/gloss animations list` reports an empty list.

## Hot reload

Gloss watches both folders for changes. Invalid edits are logged while the last valid document remains active. See [Data Files & Hot Reload](/gloss/03-data-files).

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
