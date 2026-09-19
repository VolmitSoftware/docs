---
title: "Emoji, Text & Animations"
description: "Format Gloss text, add emoji, and reuse text animations"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss uses one text pipeline for holograms, scoreboards, tablists, menu text, bubble prefixes, drop labels, and the MOTD. Emoji files live in `plugins/Gloss/emoji/`; animation files live in `plugins/Gloss/animations/`.

`/gloss web edit emoji <id>` and `/gloss web edit animation <id>` open focused live editor sessions; `/gloss web workspace` includes both document families.

The Velocity edition reads the same emoji and animation documents from its own `emoji/` and `animations/` folders, so the same ids resolve on both sides of a network. Proxy text has no PlaceholderAPI or world context, so `show` there is a proxy expression. See [Velocity Proxy](/gloss/27-velocity).

## Visibility

Emoji and animation documents accept `show`, defaulting to `true`. A boolean expression uses the player supplied to text rendering; chat emoji uses the sender. Existing `enabled` and permission checks still apply. A hidden emoji leaves its token or trigger unchanged; a hidden animation renders an empty string. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

Sender visibility for chat emoji is sampled every 10 ticks. Until the first sample, the token stays as typed.

## The text pipeline

Gloss renders text in this order:

1. **Functions.** `|name|` tokens are replaced by the value of the registered function `name`. Skipped when `[text] functions = false` or the string contains no `|`.
2. **Inline expressions.** Each `{{ expression }}` block evaluates against time, server state, viewer values, PlaceholderAPI or integration metrics as available.
3. **Placeholders.** PlaceholderAPI resolves the string. This runs **only when a viewer is present** and `[text] placeholders = true`. Skipped when the string contains no `%`.
4. **Emoji.** `:id:` tokens and emoji triggers become glyphs. Skipped when `[features] emoji = false`.
5. **Colors.** `[RRGGBB]` bracket hex first, then `&` legacy codes.

A static surface has no viewer, so player expressions and PlaceholderAPI values stay unresolved. Per-player holograms, scoreboards, tablists, menus, panels, previews and bubble prefixes use the viewing player. Chat message text is not processed a second time inside a bubble.

In-world text can mark ranges for particle layers. Rendered values cannot create new ranges, and range tags cannot nest. See [Particle Layers](/gloss/25-particle-layers).

### Functions

A function token is a name between two pipe characters, such as `|animation.rainbow|`. A name with no registered function is left in the string exactly as written, pipes included. A function that throws or returns nothing renders as an empty string, and a throwing one logs `Text function |<name>| failed: ...` once per name.

Gloss registers two families. There is no public API for registering a third:

| Family | Registered by | One token per |
|---|---|---|
| `\|animation.<id>\|` | The animation service | Loaded animation document |
| `\|metric.<key>\|` | The integration bridge | Metric another installed Volmit plugin publishes |

A metric token such as `|metric.adapt.player-sessions|` renders compactly: `42`, `3.14`, `128.5` below a thousand, then `1.2K`, `1.5M`, `2B`, `3.5T`. An unavailable metric renders empty, and a token from a plugin that is not installed stays unchanged. Installing or disabling a publisher mid-session starts or stops its tokens without a restart. See [Expressions & Placeholders](/gloss/13-expressions-placeholders).

### Colors

| Syntax | Rule |
|---|---|
| `&` codes | Standard legacy translation (`&d`, `&l`, `&r`, and the rest) |
| `[RRGGBB]` | Exactly six hex digits with `]` immediately after. `[ff00aa]Gloss` works, `[f0a]` and `[ff00aaa]` are left untouched |

Bracket hex is case-insensitive and converted before `&` codes, and both can appear in the same line. Players receive colors, decorations, click actions and hover text; consoles receive readable plain text.

### Chat

Player chat uses only two stages:

1. Emoji, when `[features] emoji = true` **and** the sender holds `gloss.emoji.use`.
2. Colors, when `[chat] color = true` **and** the sender holds `gloss.chat.color`.

Functions and placeholders are not applied to chat. Bubbles reuse the final formatted message, so unauthorized raw color codes stay literal.

### Menu, panel and preview text

| Surface | Stages, in order |
|---|---|
| Menu and panel text icons/messages | functions → inline expressions → PlaceholderAPI → emoji → colors → MiniMessage |
| Container preview labels/card titles | preview expression evaluation → emoji → MiniMessage |

Menu and panel text uses the session player as viewer, and toggle conditions use the same renderer before their case-insensitive comparison. Container preview fields are whole-field expressions with no `{{ }}` delimiter; see [Container Previews](/gloss/15-container-previews).

Colors in menu and preview documents end up as MiniMessage tags, and the color stage translates `&` codes and `[RRGGBB]` hex into that syntax first, so both spellings work in a menu label.

## Emoji

### The emoji document

One JSON file per emoji in `plugins/Gloss/emoji/`. The id is the file name with `.json` removed, there is no id key inside, and only `.json` files directly inside `emoji/` are read.

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

`emoji` is passed through the `U+<hex>;` escape decoder, where the hex run is everything between `U+` and the next `;`. An unparseable value becomes `?`, a string with no `U` at all is used verbatim, and a pasted glyph or resource-pack private-use character works directly.

Emoji replacement text is a literal fragment, never rescanned, so player chat cannot use an emoji document to run operator-side expressions or bypass permissions.

### Defaults

Gloss includes 67 emoji documents. Missing bundled files return after a reload or restart, so set `"enabled": false` instead of deleting one. Files with your own ids are never touched.

### Replacement order

Gloss applies emoji in file-id order, which matters only when one bare trigger contains another — rename the longer trigger's file so it sorts first. Disabled emoji do not appear in replacement, `/gloss emoji list`, or tab completion.

### Permissions

By default one node gates emoji in chat: `gloss.emoji.use`, granted to everyone. Emoji in holograms, boards, tablist text, drop labels and the MOTD are not permission-gated at all and render whenever `[features] emoji` is on.

`[emoji] emojiSpecificPermissions = true` adds a per-emoji check after `gloss.emoji.use`, only for chat. The node is `gloss.emoji.<id>`, and a sender without it keeps the token or trigger unchanged. These nodes are operator-only until a permission plugin grants them.

> `gloss.emoji.<id>` shares its namespace with the declared nodes `gloss.emoji.use` and `gloss.emoji.reset`. An emoji whose file is named `use.json` or `reset.json` would be gated by one of those. Avoid those two ids.
{.is-warning}

### Tab completion

With `[emoji] tabComplete = true` (the default), Paper-family servers suggest enabled emoji tokens for chat words beginning with `:`. Matching is case-insensitive and does not affect command arguments. Spigot does not support this. Turning it off applies on reload; turning it back on requires a restart.

### Commands

```
/gloss emoji list [page=1]
/gloss emoji reset [name=*]
```

`list` shows enabled emoji and needs `gloss.emoji.use`. Click a glyph to insert its `:id:` token. `reset` rewrites included emoji documents from the jar and needs `gloss.emoji.reset` (op); `name=*` restores all 67, a single name restores one, and a trailing `.json` is accepted.

> `/gloss emoji reset` overwrites the target files on disk. Edits to an included emoji id are lost. Ids that are not in the included list are untouched.
{.is-warning}

### Turning emoji off

`[features] emoji = false` stops the emoji service entirely: no defaults extracted, no documents loaded, no emoji stage, and `/gloss emoji list` empty. Tokens stay as written and chat is left alone. `/gloss emoji reset` still works, because it writes files rather than reading loaded state.

## Animations

An animation is a list of frame strings that advances on wall-clock time, exposed to the text pipeline as `|animation.<id>|`.

### The animation document

One JSON file per animation in `plugins/Gloss/animations/`. The id comes from the file name.

`plugins/Gloss/animations/rainbow.json` (included, 60 frames):

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
    "...",
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

`|animation.rainbow|&lONLINE` colors the text that follows it. Gloss also includes `marquee`, `timeline`, `typewriter`, `flash`, `wipe`, `scanner`, `decode`, `odometer` and `wave`; use their animation tokens or call the matching expression helper below. Extracted files are never overwritten — use `/gloss animations reset name=rainbow` to restore a bundled copy.

An RGB frame expands to a full legacy hex sequence after the pipeline, and every surface receives it as component text.

### Reusable animation helpers

Each helper takes an explicit step, elapsed time or progress value and returns the same result for the same inputs.

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

This timeline scrolls a welcome message, flashes a boost notice, then replaces it with an event message:

```text
{{ timeline([
  ['&b' + marquee('WELCOME', 10, floor(time.seconds * 4)), 4],
  [flash('&a&lBOOSTED', '&7BOOSTED', floor(time.seconds * 4)), 4],
  ['&bEVENT LIVE', 4]
], time.seconds) }}
```

`marquee`, `typewriter`, `wipe`, `scanner`, `scramble` and `wave` transform characters, so their text argument must be plain single-line text — put color outside it or use the dedicated style arguments. Formatting tokens, multi-code-point sequences such as flags and joined emoji, and PlaceholderAPI tokens are rejected rather than split; resolve placeholders first with `papi(...)` and pass the result in. `scanner` and `wave` styles must start with a legacy color/reset or `[RRGGBB]` and may carry one more formatting code. Text is bounded to 256 characters, or 64 for the per-character helpers, and timeline duration to one hour.

`align` counts visible code points and ignores legacy and bracket-hex formatting; `middle` is an alias for `center`. Padding is character-cell based, so proportional and custom fonts can still look uneven, and content longer than the requested width is returned whole.

Legacy `&k` obfuscation works on every text-pipeline surface. End it with `&r` or a later color code. Gloss scopes every logical line with a reset so obfuscation cannot leak into the next scoreboard row, hologram line or MOTD line. Keep `&k` outside a character-transform helper, as in `&k{{ marquee('MAGIC', 5, floor(time.seconds * 4)) }}&r`.

Pass `floor(time.seconds / 2)` as the step for content that must stay visible on the default tablist cadence. Animated boards, tablists, persistent holograms and menu text with no explicit `refreshTicks` sample clock-driven expressions and named animations every tick, while each expression still decides when its visible state changes.

### Modes

| `mode` | Behavior |
|---|---|
| `ascend` | Frames play forward and wrap: `0, 1, 2, 3, 0, 1, ...` |
| `descend` | Frames play backward and wrap: `3, 2, 1, 0, 3, 2, ...` |
| `ascend_descend` | Ping-pong over a cycle of `2N` steps, so the first and last frame each hold for two intervals: `0, 1, 2, 3, 3, 2, 1, 0, ...` |
| `random` | Scrambled but deterministic, so every surface and viewer agrees. A frame can repeat |

A single-frame animation always renders that frame, whatever the mode.

### Using an animation

`|animation.<id>|` works anywhere the text pipeline runs: hologram lines, board titles and lines, tablist header, footer and name formats, menu and panel text, `[drops] nameFormat` and MOTD lines. Container-preview labels call the expression helpers directly instead.

Frames are selected from server time, so the same animation stays synchronized across surfaces, and each surface's refresh rate limits the visible frame rate. Holograms can play clips above 20 fps; see [Holograms](/gloss/04-holograms).

Frame text is substituted before inline expressions, PlaceholderAPI, emoji and colors, so `&` codes, bracket hex and `:emoji:` tokens inside a frame all work. Inline expressions can animate text without a named animation document; see [Expressions & Placeholders](/gloss/13-expressions-placeholders).

### Commands

```
/gloss animations list [page=1]
/gloss animations reset [name=*]
```

`animation` is an alias for `animations`. `list` shows the loaded ids and needs no permission. `reset` needs `gloss.animations.reset` (op) and restores the ten included documents.

> `/gloss animations reset` overwrites the ten included animation ids. Your own animation files are never touched.
{.is-warning}

### Turning animations off

`[features] animations = false` stops the service, so no defaults are extracted, no documents load, and no `|animation.<id>|` functions are registered. Those tokens then appear literally in rendered text and `/gloss animations list` is empty.

## Hot reload

Gloss watches both folders. An invalid edit is logged and the last valid document stays active. See [Data Files & Hot Reload](/gloss/03-data-files).

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

Related pages: [Holograms](/gloss/04-holograms), [Scoreboards & Groups](/gloss/05-scoreboards-groups), [Tablist](/gloss/06-tablist), [Chat Bubbles](/gloss/08-chat-bubbles), [Expressions & Placeholders](/gloss/13-expressions-placeholders).
