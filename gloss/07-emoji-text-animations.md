---
title: "Emoji, Text & Animations"
description: "Gloss documentation: Emoji, Text & Animations"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss content text goes through one text pipeline. That includes hologram lines, board titles and lines, tablist text, drop labels and the MOTD. Emoji and animations are enveloped JSON documents in `plugins/Gloss/emoji/` and `plugins/Gloss/animations/` that plug into that pipeline. Player chat gets a shorter version of it.

Menu, panel and container-preview text is the exception. It keeps its own inherited text handling and runs only the emoji and color stages. `|function|` tokens never resolve there. See [Expressions & Placeholders](/gloss/13-expressions-placeholders).

## The text pipeline

`text/TextPipeline.java` renders a raw string in exactly five stages, in this order:

1. **Functions.** `|name|` tokens are replaced by the value of the registered function `name`. Skipped entirely when `[text] functions = false`. Short-circuited when the string contains no `|`.
2. **Inline expressions.** Each `{{ expression }}` block evaluates against time, server state, viewer values, PlaceholderAPI or integration metrics as available.
3. **Placeholders.** PlaceholderAPI resolves the string. This stage runs **only when a viewer is present** and `[text] placeholders = true`. Short-circuited when the string contains no `%`.
4. **Emoji.** `:id:` tokens and emoji triggers are replaced with their glyphs. Skipped when `[features] emoji = false`, because the emoji service is what installs this stage.
5. **Colors.** `[RRGGBB]` bracket hex first, then `&` legacy codes.

A "static" render is the same pipeline with no viewer. Player-backed parts of stages 2 and 3 never run. Shared holograms, temporary holograms (chat bubbles and damage indicators), drop labels and the MOTD all render statically. Placeholder tokens in those surfaces stay as written. Per-viewer holograms, boards and the tablist pass a viewer and do resolve placeholders.

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

### Menu, panel and preview text

Menu and panel text icons, and container preview labels, run their own short pipeline rather than the four-stage one:

| Surface | Stages, in order |
|---|---|
| Menu and panel text icons | PlaceholderAPI (as the menu renderer already did) → emoji → colors → MiniMessage |
| Container preview labels | Expression evaluation → emoji → MiniMessage |

That is what makes `:heart:` and a `<3` trigger work in a menu label, a panel row and a preview label. Two consequences are deliberate:

- **Functions never run there.** A literal `|` in a menu label is just a pipe character. A token that looks like `|animation.rainbow|` stays as written. Menu content is authored text. It is never scanned for function tokens. Nothing in a label can be corrupted by one.
- **No extra placeholder pass.** Menus keep exactly the one PlaceholderAPI pass the menu renderer always did. Preview labels get none, because a preview label is an expression result, not a template.

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
  "frameIntervalMs": 500,
  "frames": [
    "&c",
    "&6",
    "&a",
    "&b"
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

`rainbow.json` is the only shipped animation. Its frames contain only color codes, so
`|animation.rainbow|&lONLINE` changes the following text's color without inserting a word. Like
emoji, it is re-extracted whenever the file is missing. On startup Gloss also replaces the exact
older shipped file whose four frames were `&cGloss`, `&6Gloss`, `&aGloss` and `&bGloss`. Any edited
or merely reformatted copy is preserved as user content; use `/gloss animations reset name=rainbow`
when that copy should be replaced deliberately.

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

`|animation.<id>|` works anywhere the text pipeline runs: hologram lines, board titles and lines, tablist header, footer and name formats, `[drops] nameFormat` and MOTD lines. It does **not** work in menu or panel documents. Those do not run the pipeline.

The frame is chosen from the server clock at render time. Two surfaces
that show the same animation always show the same frame. How often the
change is *visible* is bounded by the consuming surface refresh
interval, not by `frameIntervalMs`. Holograms use
`[holograms] updateIntervalTicks` (default 10, so 500 ms). Boards use
`[boards] updateIntervalTicks` (default 20). The tablist uses
`[tablist] updateIntervalTicks` (default 40). If you set
`frameIntervalMs` below the consuming interval, frames are skipped.

Hologram lines are the exception. A clip faster than 20 fps (`frameIntervalMs` below 50) is driven by the dedicated high-frequency animator thread at up to `[holograms] maxAnimationFps` (default 120). It sends sub-tick text updates as packets instead of waiting for the tick refresh. Clips at 20 fps or below stay tick-driven everywhere. See [Holograms](/gloss/04-holograms) for the mechanics and the `highFrequencyAnimations`, `maxAnimationFps` and `animationPacketBudget` knobs.

Frame text is substituted before inline expressions, PlaceholderAPI, emoji and colors. `&` codes,
bracket hex and `:emoji:` tokens inside a frame all work. Inline expressions can also animate text
directly without a named animation document; see [Expressions & Placeholders](/gloss/13-expressions-placeholders).

### Commands

```
/gloss animations list [page=1]
/gloss animations reset [name=*]
```

`animation` is an alias for `animations`. `list` prints the loaded animation ids fifteen per page behind a count header and the shared pager footer. It needs no permission. `reset` needs `gloss.animations.reset` (op) and restores `rainbow.json` from the jar.

> `/gloss animations reset` overwrites `animations/rainbow.json`. Only shipped ids are affected. Your own animation files are never touched.
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
