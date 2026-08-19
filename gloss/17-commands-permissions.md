---
title: "Commands & Permissions"
description: "Gloss documentation: Commands & Permissions"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss registers three root commands. It mounts every feature under `/gloss` as a subtree. The
command tree is built with Director. Arguments are keyed (`name=value`). The tree supplies its own
paged help.

This page is the reference for the node names, arguments, permissions and defaults. The behavior
behind each command lives on the feature page it belongs to.

## Root commands

| Command | Aliases | What it is |
|---|---|---|
| `/gloss` | `gl`, `glo`, `gg` | The whole tree. Every subtree below is reachable as `/gloss <subtree> <node>` |
| `/hologram` | `holo`, `h` | A shortcut that prefixes `hologram`, so `/hologram create id` is `/gloss hologram create id` |
| `/board` | `sb`, `bd` | A shortcut that prefixes `board`, so `/board list` is `/gloss board list` |

The same three names and aliases are declared in both `plugin.yml` and `paper-plugin.yml`. Gloss
binds whichever registration path the server offers. The spellings are identical on Spigot, Paper
and Folia.

Inside the tree the `hologram` node also answers to `holo` and `h`. The `board` node also answers to
`boards`, `sb` and `bd`. `/gloss holo create id` and `/gloss boards list` both work. `boards` is
only reachable through `/gloss`. The root command is registered as `board` alone.

Direct leaves on `/gloss`:

| Node | Arguments | Permission | Notes |
|---|---|---|---|
| `status` | none | `gloss.admin` | Prints hologram, temporary-hologram, entity, board, emoji, animation, bubble, indicator and drop counts |
| `reload` | none | `gloss.admin` | Runs the full `reloadAll` cycle. A broken `config.toml` is refused and the last good configuration stays live |
| `version` | none | none beyond the base gate | Prints the plugin version and the supported Minecraft range `26.1.2 - 26.2` |

## Who can run anything at all

Before Director sees the arguments, Gloss checks a single gate. The sender must hold at least one of
the 39 command permissions listed in `GlossCommandService.BASE_COMMAND_PERMISSIONS`. A sender
holding none of them gets the "no permission" message and the failure chime for `/gloss`,
`/hologram` and `/board` alike. Tab completion returns an empty list.

`gloss.emoji.use` is in that list and defaults to `true`. Ordinary players pass the gate by default.
They are then stopped by the per-node permission check on anything they may not run. Removing
`gloss.emoji.use` from a group removes the whole command tree from tab completion for that group.

## Argument style

Gloss uses keyed arguments. A parameter that has a default value is optional and must be written
`name=value`. Required parameters may be given positionally in declaration order. A stray positional
value where a keyed one is expected is rejected. The sender gets the usage line.

```
/gloss hologram move spawn y=1.5
/gloss board reset name=default
/gloss emoji list page=3
/gloss hologram rendertext banner "GLOSS" scale=2
```

### Multi-word values

A keyed value that spans several words is written in brackets. `key=[...]` collects everything up to
the closing `]` into one value and strips the brackets:

```
/gloss hologram addline id=123 text=[This is an example.]
```

binds `text` to `This is an example.`. The closing `]` must end its word. A `]` in the middle of a
word is part of the value. Inline hex colors like `text=[ff0000]Red` keep working unchanged.

A bare color code — a single bracketed value of exactly six hex digits, like `text=[ff0000]` — is
kept literal rather than stripped. Doubling the brackets escapes them: `text=[[literal brackets]]`
binds `[literal brackets]`. `text=[]` binds an empty value. Opening a bracket without closing it is
an error naming the parameter that is missing its `]`.

### The scoped positional pre-pass

Six subtrees carry a normalization pre-pass ported from HoloUi so that the old positional spellings
keep working: `menu` (`menus`), `panel` (`panels`), `preview` (`previews`), `item` (`items`), `sync`
and `import`. The pre-pass lives in `GlossCommandService.normalizePositionalArgs`. It runs on the
routed argument array before the permission gate and before Director. It only fires when the first
argument names one of those roots. `/gloss hologram move spawn 1.5` is still a hard error.

Of those six roots, only `menu`, `panel` and `preview` actually have rewrites. `item`, `sync` and
`import` are in scope but have no positional forms to rewrite. None of their parameters are
optional.

| Written | Executed |
|---|---|
| `/gloss menu` | `menu list` |
| `/gloss panel` | `panel list` |
| `/gloss preview` | `preview list` |
| `/gloss menu open <id>` | `menu open menu=<id>` |
| `/gloss preview reset <name>` | `preview reset name=<name>` |
| `/gloss panel list <page>` | `panel list page=<page>` |
| `/gloss panel near <radius>` | `panel near radius=<radius>` |
| `/gloss panel create <board> <menu>` | `panel create <board> menu=<menu>` |

A second rule joins everything from a fixed position to the end of the line into one keyed argument.
Multi-word text, icon values and image paths need no quotes on `menu` and `panel`:

| Node | Joined from | Bound as |
|---|---|---|
| `menu create <id> <text...>` | argument 4 | `text=` |
| `menu\|panel addrow` | argument 4 | `text=` |
| `menu\|panel insertrow`, `setrow` | argument 5 | `text=` |
| `menu\|panel seticon`, `style` | argument 6 | `value=` |
| `menu\|panel image` | argument 4 | `path=` |

An explicit `text=`, `value=` or `path=` prefix is detected and not doubled. `help`, `?` and
`help=<n>` are never treated as bare values. A help request inside a scoped subtree still resolves
to help. Tab completion applies the same rewrites. It then strips the injected `menu=`, `name=`,
`radius=` or `page=` prefix back off the suggestions. Completion looks positional too.

Everywhere else — `hologram`, `board`, `emoji`, `animations`, `bubbles`, `tablist`, `motd` — keyed
arguments are the only accepted form for optional parameters.

## `/gloss hologram`

Also reachable as `/hologram`. Covered in [Holograms](/gloss/04-holograms).

| Node | Arguments | Permission | Notes |
|---|---|---|---|
| `create` | `<id>` | `gloss.holograms.create` | Player only. Seeds from the shipped baseline at your position |
| `rendertext` | `<id> <text> [scale=1]` | `gloss.holograms.create` | Player only. Rasterizes text into block-art lines |
| `addline` | `<id> <text>` | `gloss.holograms.edit` | Appends one line |
| `setline` | `<id> <line> <text>` | `gloss.holograms.edit` | Line numbers start at 1 |
| `removeline` | `<id> <line>` | `gloss.holograms.edit` | |
| `clear` | `<id>` | `gloss.holograms.edit` | Removes every line |
| `delete` | `<id>` | `gloss.holograms.delete` | |
| `movehere` | `<id>` | `gloss.holograms.move` | Player only |
| `move` | `<id> [x=0] [y=0] [z=0]` | `gloss.holograms.move` | Relative block offsets |
| `tp` | `<id>` | `gloss.holograms.teleport` | Player only |
| `list` | `[page=1]` | none beyond the base gate | Clickable list. Clicking teleports. Fifteen per page |
| `info` | `<id>` | none beyond the base gate | Location and raw lines |

## `/gloss board`

Gloss scoreboards, not panels. Also reachable as `/board`. Covered in
[Scoreboards & Groups](/gloss/05-scoreboards-groups).

| Node | Arguments | Permission | Notes |
|---|---|---|---|
| `create` | `<id>` | `gloss.boards.create` | Seeds a title and one placeholder line |
| `delete` | `<id>` | `gloss.boards.delete` | |
| `title` | `<id> <text>` | `gloss.boards.edit` | |
| `addline` | `<id> <text>` | `gloss.boards.edit` | |
| `setline` | `<id> <line> <text>` | `gloss.boards.edit` | Line numbers start at 1 |
| `removeline` | `<id> <line>` | `gloss.boards.edit` | |
| `primary` | `<id> [enabled=true]` | `gloss.boards.edit` | Marks the fallback board |
| `permission` | `<id> <node>` | `gloss.boards.edit` | `node=default` clears the gate |
| `reset` | `[name=*]` | `gloss.boards.edit` | Restores shipped board documents |
| `show` | `<id>` | `gloss.boards.show` | Player only |
| `hide` | none | `gloss.boards.hide` | Player only |
| `list` | `[page=1]` | none beyond the base gate | Clickable list. Clicking runs `info`. Fifteen per page |
| `info` | `<id>` | none beyond the base gate | Title, primary flag, permission and lines |

## `/gloss emoji`, `animations`, `bubbles`, `tablist`, `motd`

Covered in [Emoji, Text & Animations](/gloss/07-emoji-text-animations),
[Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops) and
[Tablist & Server List MOTD](/gloss/06-tablist-motd).

| Node | Arguments | Permission | Notes |
|---|---|---|---|
| `emoji list` | `[page=1]` | `gloss.emoji.use` | Forty-five per page, three glyphs per line. Clicking suggests `:id:` in chat |
| `emoji reset` | `[name=*]` | `gloss.emoji.reset` | Restores shipped emoji documents |
| `animations list` | `[page=1]` | none beyond the base gate | Plain list of animation ids, fifteen per page |
| `animations reset` | `[name=*]` | `gloss.animations.reset` | |
| `bubbles style` | `<style>` | `gloss.bubbles.style` | Player only. `style=clear` returns to automatic selection |
| `bubbles reset` | `[name=*]` | `gloss.bubbles.reset` | |
| `tablist reset` | none | `gloss.tablist.reset` | Always resets the singleton document |
| `motd reset` | none | `gloss.motd.reset` | Always resets the singleton document |

`animations` also answers to `animation`. `bubbles` answers to `bubble`.

Choosing a style with `bubbles style` only takes effect if the player also holds
`gloss.bubbles.style.<styleId>`. The resolution order is on the bubbles page.

## `/gloss menu`

Hologram menus. Also answers to `/gloss menus`. Covered in [Hologram Menus](/gloss/09-menus),
[Components & Hitboxes](/gloss/10-components-hitboxes) and [Icons](/gloss/11-icons).

| Node | Arguments | Permission | Notes |
|---|---|---|---|
| `list` | `[page=1]` | `gloss.menus.list` | Clickable list. Clicking opens the menu. Fifteen per page |
| `open` | `[menu=*]` | `gloss.menus.open` plus `gloss.open.<menuId>` | Player only unless `menu=*`, which falls through to `list` and re-checks `gloss.menus.list` |
| `back` | none | `gloss.menus.back` | Player only |
| `close` | none | `gloss.menus.close` | Player only |
| `move` | none | `gloss.menus.move` | Player only. Moves your open session to your position |
| `create` | `<hologram> [text=]` | `gloss.menus.create` **and** `gloss.panels` | Player only. Creates a panel plus a same-id menu at your position |
| `new` | `<menu>` | `gloss.menus.edit` | Creates a blank menu document from the shipped baseline |
| `copy` | `<menu> <newMenu>` | `gloss.menus.edit` | |
| `edit` | `<menu>` | `gloss.menus.edit` | Opens the menu in the web editor. Live sync also needs `gloss.sync` |
| `builder` | none | `gloss.menus.builder` | Prints the configured `[editor] builderUrl` |
| `addrow` | `<menu> <text>` | `gloss.menus.edit` | |
| `insertrow` | `<menu> <row> <text>` | `gloss.menus.edit` | Rows are one-based |
| `setrow` | `<menu> <row> <text>` | `gloss.menus.edit` | |
| `removerow` | `<menu> <row>` | `gloss.menus.edit` | |
| `offsetrow` | `<menu> <row> <x> <y> <z>` | `gloss.menus.edit` | Absolute or `~`-relative |
| `seticon` | `<menu> <row> <type> <value>` | `gloss.menus.edit` | Types: `text`, `image`, `animated`, `item`, `block`, `customItem`, `entity` |
| `style` | `<menu> <row> <property> <value>` | `gloss.menus.edit` | `value=*` clears the property |
| `image` | `<menu> <path>` | `gloss.menus.edit` | Replaces the menu with one centered image from `images/` |

> `/gloss menu create` and `/gloss menu new` do different things. `create` writes a new menu document
> *and* a persistent panel that places it, so it requires both halves: `gloss.menus.create` for the menu
> and `gloss.panels` for the panel. `new` makes a blank menu document only, and is gated by
> `gloss.menus.edit`. Anyone holding the `gloss.menus` parent already has `gloss.menus.create`.
{.is-info}

The style properties accepted by `style` are `billboard`, `shadow`, `seeThrough`, `textAlignment`,
`backgroundArgb`, `textOpacity`, `lineWidth`, `brightness`, `viewRange`, `shadowRadius`, `shadowStrength`,
`cullingWidth`, `cullingHeight`, `glowColor`, `scale`, `scaleX`, `scaleY` and `scaleZ`.

## `/gloss panel`

World-anchored panels. Also answers to `/gloss panels`. Covered in [Panels](/gloss/16-panels).

Every node below is gated by `gloss.panels`, except `web`, which is gated by `gloss.panels.editweb`.

| Node | Arguments | Notes |
|---|---|---|
| `list` | `[page=1]` | Fifteen entries per page |
| `reload` | none | Re-reads the panel files from disk |
| `near` | `[radius=64]` `[page=1]` | Player only. Horizontal search radius, fifteen entries per page |
| `info` | `<board>` | Full state of one panel |
| `create` | `<board> [menu=*]` | Player only. `menu=*` means a menu whose id equals the panel id. That menu must already exist |
| `delete` (`remove`) | `<board>` | |
| `rename` | `<board> <newBoard>` | |
| `copy` | `<board> <newBoard>` | |
| `move` | `<board> <x> <y> <z>` | Absolute or `~`-relative |
| `here` (`movehere`, `tphere`) | `<board>` | Player only |
| `teleport` (`tp`) | `<board>` | Player only |
| `rotate` | `<board> <yaw> <pitch> <roll>` | Absolute or `~`-relative |
| `scale` | `<board> <scale>` | Absolute or `~`-relative |
| `align` | `<board> <reference> <axes>` | `axes` is `x`, `y`, `z`, `xy`, `xz`, `yz` or `xyz` |
| `menu` (`root`) | `<board> <menu>` | Sets the root menu. The menu must be loaded |
| `addrow` | `<board> <text>` | Mutates the panel's root menu |
| `insertrow` | `<board> <row> <text>` | |
| `setrow` | `<board> <row> <text>` | |
| `removerow` | `<board> <row>` | |
| `offsetrow` | `<board> <row> <x> <y> <z>` | |
| `seticon` | `<board> <row> <type> <value>` | Same icon types as `/gloss menu seticon` |
| `style` | `<board> <row> <property> <value>` | `value=*` clears the property |
| `image` | `<board> <path>` | |
| `ranges` | `<board> <viewRange> <interactionRange>` | Both must be positive |
| `visibility` | `<board> <mode> <viewPermission> <interactPermission>` | `mode` is `public`, `permission` or `hidden`.`-` clears a permission |
| `permissions` | `<board> <viewPermission> <interactPermission>` | `-` clears a permission |
| `follow` | `<board> <player> <rotation>` | `rotation` is `fixed`, `yaw` or `full`. The target must be online |
| `unfollow` | `<board>` | |
| `edit` | `<board>` | Player only. Starts a staged edit session |
| `save` | none | Player only. Commits your staged edit |
| `cancel` | none | Player only. Discards your staged edit |
| `web` (`editweb`, `webedit`) | `<board>` | `gloss.panels.editweb`. Live sync also needs `gloss.sync` |

A staged edit session is discarded automatically when the player quits.

## `/gloss preview`

Container preview documents. Also answers to `/gloss previews`. Covered in
[Container Previews](/gloss/15-container-previews).

| Node | Arguments | Permission | Notes |
|---|---|---|---|
| `list` | `[page=1]` | `gloss.previews` | Names plus each document's block, entity, special and priority match summary, fifteen per page |
| `reset` | `[name=*]` | `gloss.previews.reset` | Runs asynchronously. Restores shipped documents without deleting extra user documents that shadow them |
| `dump` | `<name>` | `gloss.previews.dump` | Builds the document once and prints panel, cell, slot and label counts plus up to three build errors |

For a player, `dump` uses the block you are looking at when that block matches the document.
Otherwise it builds against statics. Console always builds against statics. `gloss.preview` —
singular — is a different node and does not gate any command. It controls whether a player sees
previews at all.

## `/gloss item`

Custom item providers. Also answers to `/gloss items`. Covered in
[Custom Items & Item Providers](/gloss/14-custom-items).

| Node | Arguments | Permission | Notes |
|---|---|---|---|
| `status` | `[page=1]` | `gloss.items` | One line per provider with its plugin and state, thirteen per page. Holders of `gloss.items.export` also get a clickable export hint |
| `export` | none | `gloss.items.export` | Writes the catalog asynchronously and reports the item count, provider count and path when it finishes |

Both refuse with a message when `[items] customItems` is off. `export` refuses while a previous
export is still running.

## `/gloss sync`

Web editor sync sessions. Every node is gated by `gloss.sync`. Covered in
[Web Editor & Sync](/gloss/18-web-editor).

| Node | Arguments | Notes |
|---|---|---|
| `list` | `[page=1]` | Active sessions with kind, subject, seconds to expiry, last publication revision and pending state, fifteen per page |
| `status` | `<session>` | The same fields for one session |
| `revoke` | `<session>` | Revokes the capability |
| `pull` (`poll`) | `<session>` | Polls the relay immediately |

Session ids are displayed abbreviated to 12 characters. `status`, `revoke` and `pull` accept either
the exact id or a unique prefix of at least 12 characters. A shorter prefix is not resolved. An
ambiguous prefix is rejected.

## `/gloss import`

| Node | Arguments | Permission | Notes |
|---|---|---|---|
| `preview` (`dry-run`, `dryrun`) | `<source>` | `gloss.import` | Non-destructive plan for a third-party hologram plugin's data |
| `apply` | `<source>` | `gloss.import.apply` | Applies that plan without overwriting anything Gloss already owns |
| `holoui` | none | `gloss.import` | Copies HoloUi data from `plugins/holoui`, then reloads |
| `legacy` | none | `gloss.import` | Migrates pre-merger Gloss data files to the enveloped shapes, then reloads |

`source` is one of `gholo`, `decent-holograms`, `holographic-displays` or `fancy-holograms`. Each
accepts short aliases: `files` for `gholo`, `decent` for `decent-holograms`, `hd` for
`holographic-displays` and `fancy` for `fancy-holograms`.

> `/gloss import holoui` always runs in force mode: it re-copies and overwrites anything an earlier HoloUi
> import already placed. It takes no arguments and has no confirmation step. It never modifies the source
> folder, and never copies `editor-sync-sessions.json`.
{.is-warning}

Both `preview` and `apply` refuse while an import is already in flight. They report at most twelve
detail lines before summarizing the rest.

## Permissions

Every node defaults to `op` except `gloss.emoji.use`, `gloss.bubbles.send` and
`gloss.indicators.show`, which default to `true`.

| Node | Default | Grants |
|---|---|---|
| `gloss.*` | op | Every node below |
| `gloss.admin` | op | `/gloss status`, `/gloss reload`, and the five reset nodes as children |
| `gloss.holograms` | op | The five hologram children |
| `gloss.holograms.create` | op | `hologram create`, `hologram rendertext` |
| `gloss.holograms.edit` | op | `addline`, `setline`, `removeline`, `clear` |
| `gloss.holograms.delete` | op | `hologram delete` |
| `gloss.holograms.move` | op | `hologram move`, `hologram movehere` |
| `gloss.holograms.teleport` | op | `hologram tp` |
| `gloss.boards` | op | The five scoreboard children |
| `gloss.boards.create` | op | `board create` |
| `gloss.boards.edit` | op | `title`, `addline`, `setline`, `removeline`, `primary`, `permission`, `reset` |
| `gloss.boards.delete` | op | `board delete` |
| `gloss.boards.show` | op | `board show` |
| `gloss.boards.hide` | op | `board hide` |
| `gloss.menus` | op | The eight menu children |
| `gloss.menus.list` | op | `menu list`, and the `menu open menu=*` form |
| `gloss.menus.open` | op | `menu open` |
| `gloss.menus.close` | op | `menu close` |
| `gloss.menus.move` | op | `menu move` |
| `gloss.menus.back` | op | `menu back` |
| `gloss.menus.create` | op | `menu create`, together with `gloss.panels` — the command writes both a menu and a panel |
| `gloss.menus.edit` | op | `menu edit`, `new`, `copy` and every menu content node |
| `gloss.menus.builder` | op | `menu builder` |
| `gloss.panels` | op | Every `/gloss panel` node except `web`, plus the panel half of `/gloss menu create` |
| `gloss.panels.editweb` | op | `panel web` |
| `gloss.preview` | op | Seeing container previews at all, and adjusting their scale with sneak plus hotbar scroll. Not a command permission |
| `gloss.previews` | op | `preview list`, plus the two children |
| `gloss.previews.reset` | op | `preview reset` |
| `gloss.previews.dump` | op | `preview dump` |
| `gloss.items` | op | `item status`, plus the export child |
| `gloss.items.export` | op | `item export` |
| `gloss.sync` | op | Every `/gloss sync` node, and the live-sync path of `menu edit` and `panel web` |
| `gloss.import` | op | `import preview`, `import holoui`, `import legacy`, plus the apply child |
| `gloss.import.apply` | op | `import apply` |
| `gloss.emoji.use` | **true** | Emoji replacement in this player's chat, and `/gloss emoji list` |
| `gloss.emoji.reset` | op | `emoji reset` |
| `gloss.animations.reset` | op | `animations reset` |
| `gloss.chat.color` | op | Color codes in this player's chat |
| `gloss.bubbles.send` | **true** | This player's chat messages render as chat bubbles |
| `gloss.bubbles.style` | op | `/gloss bubbles style` |
| `gloss.bubbles.reset` | op | `bubbles reset` |
| `gloss.tablist.reset` | op | `tablist reset` |
| `gloss.motd.reset` | op | `motd reset` |
| `gloss.indicators.show` | **true** | This player sees damage and heal indicators |

`gloss.bubbles.reset`, `gloss.emoji.reset`, `gloss.animations.reset`, `gloss.tablist.reset` and
`gloss.motd.reset` are reached through `gloss.admin` rather than being direct children of `gloss.*`.

### Dynamic nodes

These are built at runtime from document ids. They are not declared in `plugin.yml`. An undeclared
permission has no registered default. Bukkit treats it as op-only until a permission plugin grants
it.

| Node | Checked when | See |
|---|---|---|
| `gloss.open.<menuId>` | A player opens a menu, by command, by clicking a panel, or through the API | [Hologram Menus](/gloss/09-menus) |
| `gloss.bubbles.style.<styleId>` | Resolving which bubble style a player gets, including their explicit choice | [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops) |
| `gloss.board.<permission>` | Auto-selecting a scoreboard, where `<permission>` is the board document's `permission` value. The value `default` means unrestricted and is never turned into a node | [Scoreboards & Groups](/gloss/05-scoreboards-groups) |
| `gloss.emoji.<emojiId>` | Replacing one emoji, and only when `[emoji] emojiSpecificPermissions` is `true` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |

`gloss.open.<menuId>` is checked in addition to `gloss.menus.open`. It is not applied to `menu
list`. Every configured menu id appears in the list. The per-menu node is only tested on open.

## List paging

Every multi-entry list takes an optional `page=<n>`: `hologram list`, `board list`, `emoji list`,
`animations list`, `menu list`, `panel list`, `panel near`, `preview list`, `item status` and
`sync list`. Text lists show fifteen entries per page. `item status` reserves two additional lines
for its summary and export action, so it shows thirteen. `emoji list` shows forty-five, three glyphs
to a line. These limits keep a full player menu within nineteen chat lines, including its top and
bottom chrome.

Every one of them prints its own header, then the entries, then the same two-line footer:

```
Page 1/2 - showing 1-45 of 67
Next page: /gloss emoji list page=2
```

The `Next page` line only appears when a further page exists. It prints the command in full so it
works from the console. In chat it is also clickable. `page` is clamped rather than rejected.
`page=0` and any page past the end land on the first and last page respectively.

`/gloss panel list <n>` still works as a positional shorthand for `panel list page=<n>`. Every other
list takes the keyed form only.

## Help output

`help`, `?` and `help=<page>` resolve to a paged menu of the node's children. The root fits up to
seventeen entries; submenus fit sixteen because they also render a back action. Both stay within
nineteen lines including the top and bottom bars. The token can appear at any depth. A bare `help` followed by a number is normalized into
`help=<number>` before resolution. All of these work:

```
/gloss
/gloss help
/gloss help 2
/gloss panel help
/gloss panel help 3
/gloss menu ?
/hologram help
```

`/gloss` with no arguments prints the root help page. A group name with no leaf — `/gloss emoji`,
`/gloss bubbles` — prints that group's help. The group node is not itself invocable. The three
groups covered by the positional pre-pass are the exception: `/gloss menu`, `/gloss panel` and
`/gloss preview` are rewritten into their `list` node and execute instead of printing help.

Pages are one-based for the reader and clamped to the available range. Help resolution happens after
the base permission gate. A sender who fails that gate gets the permission message rather than help.

## Command sounds

`[commands] sounds` in `config.toml` (default `true`) controls the outcome chime. Chimes only play
for player senders. Console never hears anything.

| Outcome | Sound |
|---|---|
| Node handled | The Gloss theme's success sound, volume 0.5, pitch 1.5 |
| Help page delivered | The success sound, volume 0.4, pitch 1.0 |
| Base permission gate failed, or Director could not handle the input | The theme's error sound, volume 0.4, pitch 0.6 |

The chime reflects whether Director dispatched the node. It does not reflect whether the command's
own logic succeeded. A per-node permission denial still gets the success chime.

Two commands finish long after dispatch returns. They report their real outcome with a second,
louder tone. `/gloss menu create` is suppressed from the automatic chime so it plays only
its own success or error tone. `/gloss item export` keeps the dispatch chime and adds
its completion tone once the catalog is written.

Turning `sounds` off silences every chime Gloss plays, the two self-reported completion tones
included. See [Configuration](/gloss/02-configuration).

## Migrating from HoloUi

> This section is a migration aid for servers coming from HoloUi. The `holoui` root command and all its
> aliases are gone, and no `holoui.*` permission node is read by Gloss. Update your permission groups and
> any command blocks, NPC click actions or scripts before the first restart on Gloss.
{.is-warning}

### Commands

| Retired HoloUi command | Gloss replacement |
|---|---|
| `/holoui help` | `/gloss help` |
| `/holoui create <id> [text]` | `/gloss menu create <id> [text=...]` |
| `/holoui list` | `/gloss menu list` |
| `/holoui open [<id>]` | `/gloss menu open [menu=<id>]` |
| `/holoui back` | `/gloss menu back` |
| `/holoui close` | `/gloss menu close` |
| `/holoui move` | `/gloss menu move` |
| `/holoui builder` | `/gloss menu builder` |
| `/holoui edit <menu>` | `/gloss menu edit <menu>` |
| `/holoui menu create <menu>` | `/gloss menu new <menu>` |
| `/holoui menu copy <menu> <newMenu>` | `/gloss menu copy <menu> <newMenu>` |
| `/holoui menu addrow\|insertrow\|setrow\|removerow\|offsetrow\|seticon\|style\|image ...` | `/gloss menu <same node> ...` |
| `/holoui board ...` | `/gloss panel ...` — every board node keeps its name and arguments |
| `/holoui board web\|editweb\|webedit <board>` | `/gloss panel web <board>` |
| `/holoui preview list\|reset\|dump ...` | `/gloss preview <same node> ...` |
| `/holoui item status\|export` | `/gloss item <same node>` |
| `/holoui sync list\|status\|revoke\|pull\|poll ...` | `/gloss sync <same node> ...` |
| `/holoui import preview\|dry-run\|dryrun <source>` | `/gloss import preview <source>` |
| `/holoui import apply <source>` | `/gloss import apply <source>` |

Two renames are easy to trip over:

- HoloUi's world-anchored **boards** are Gloss **panels**. `/gloss board` is the scoreboard tree, which
  HoloUi never had. Anything that used to be `/holoui board ...` is now `/gloss panel ...`.
- HoloUi's `/holoui create` made a board plus a menu. That is `/gloss menu create`. HoloUi's
  `/holoui menu create` made a blank menu document. That is `/gloss menu new`. The word `create` moved.

### Permissions

| Retired HoloUi node | Gloss replacement |
|---|---|
| `holoui.command` | No direct equivalent. Gloss admits a sender who holds any one of its command permissions |
| `holoui.command.list` | `gloss.menus.list` |
| `holoui.command.open` | `gloss.menus.open` |
| `holoui.command.back` | `gloss.menus.back` |
| `holoui.command.close` | `gloss.menus.close` |
| `holoui.command.move` | `gloss.menus.move` |
| `holoui.command.builder` | `gloss.menus.builder` |
| `holoui.command.edit` | `gloss.menus.edit` |
| `holoui.command.menus` | `gloss.menus.edit` |
| `holoui.command.boards` | `gloss.panels` (also needed by `/gloss menu create`, alongside `gloss.menus.create`) |
| `holoui.command.boards.editweb` | `gloss.panels.editweb` |
| `holoui.command.previews` | `gloss.previews` |
| `holoui.command.previews.reset` | `gloss.previews.reset` |
| `holoui.command.previews.dump` | `gloss.previews.dump` |
| `holoui.command.items` | `gloss.items` |
| `holoui.command.items.export` | `gloss.items.export` |
| `holoui.command.sync` | `gloss.sync` |
| `holoui.command.import` | `gloss.import` |
| `holoui.command.import.apply` | `gloss.import.apply` |
| `holoui.open.<menuId>` | `gloss.open.<menuId>` |
| `holoui.preview` | `gloss.preview` |

There is no `gloss.*` equivalent of HoloUi's `holoui.command` root gate. Granting `gloss.*` is the
closest single node. Granting `gloss.panels` and `gloss.menus` reproduces most of what a HoloUi
builder group held.

Everything on the Gloss side of the tree — holograms, scoreboards, emoji, animations, chat bubbles,
damage indicators, drops, tablist and MOTD — has no HoloUi ancestor. Those nodes have no migration
row. Those nodes are new to operators arriving from HoloUi.

The data-side migration, including what `/gloss import holoui` copies and where it puts it, is
covered in [Getting Started](/gloss/01-getting-started) and
[Data Files & Hot Reload](/gloss/03-data-files).
