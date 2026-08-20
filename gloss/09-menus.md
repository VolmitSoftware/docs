---
title: "Hologram Menus"
description: "Gloss documentation: Hologram Menus"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

A hologram menu is a JSON document under `plugins/Gloss/menus/`. It describes a floating panel of text, images, items and clickable buttons. A player opens one and gets a private packet-only copy. No entity exists on the server and nobody else can see it.

The same document also supplies the content of a world-anchored panel. This page covers discovery, ids, the top-level document fields, the session model and the in-game authoring commands. See [Components & Hitboxes](/gloss/10-components-hitboxes), [Icons](/gloss/11-icons) and [Actions](/gloss/12-actions) for the payloads.

## Where menu documents live

```
plugins/Gloss/menus/     menu documents
plugins/Gloss/images/    image assets referenced by textImage and animatedTextImage icons
```

Both directories are created on first enable if they are missing. Neither is seeded with content. A fresh install has no menus until you create one.

Menus are discovered recursively. A file is accepted when every one of these holds:

- the file name ends in `.json`, matched case-insensitively, so `Shop.JSON` is accepted
- it resolves inside `menus/` after normalisation
- it is a regular file and every directory above it is a real directory
- no path segment starts with `.`
- neither the file nor any directory on the way to it is a symbolic link

Anything else is ignored. The boot scan and both hot-reload watchers share the same predicate. A nested menu behaves the same at startup and at runtime. The boot scan registers menus in id order.

### The menu id

The id is the file path relative to `menus/` with the final five characters (`.json`) removed. The platform separator is rewritten to `/`. Case is preserved.

| File | Menu id |
|---|---|
| `menus/shop.json` | `shop` |
| `menus/main_menu.json` | `main_menu` |
| `menus/Shop.JSON` | `Shop` |
| `menus/shops/weapons/main.json` | `shops/weapons/main` |

Ids are case sensitive. They are what `/gloss menu open <id>` takes. They are what a panel root-menu setting points at. They are what a `navigate` action targets. They are what the API `menuIds()` returns.

**There is no `id` key.** The document body cannot name itself. The loader assigns the path-derived id after parsing. A JSON `"id"` member is an unknown key that Gson discards. If you rename or move the file, you rename the menu.

Every id must satisfy the portable id contract. This is enforced at load, not merely by the writers:

- at most 255 characters in total
- slash-separated segments of at most 64 characters each
- every segment matching `[A-Za-z0-9][A-Za-z0-9._-]*`
- no backslashes, no empty segment, no `.` and no `..` segment

A file whose derived id breaks any of those rules fails to parse and is skipped with a logged error. Name directories and files with plain ASCII. Avoid spaces.

> HoloUi accepted a non-portable id as a personal menu and only rejected it at command or editor time. Gloss rejects it at load. A menu file with a space or a non-ASCII character in its path that worked before the merger will not register.
{.is-warning}

### No envelope, and what `revision` means here

Menus and container previews are the two document kinds that did **not** get the `{"schemaVersion": 1, "revision": N}` envelope described in [Data Files & Hot Reload](/gloss/03-data-files). A menu document is exactly the shape below and nothing else.

Gloss still tracks a revision for menus. It is the SHA-256 hash of the file raw text. Nothing writes it into the file. It is used two ways:

- the hot-reload watcher only republishes a changed file when its hash differs from the registered one, so touching a file without editing it does nothing
- every content command sends the hash it read as an expected value. The write is refused if the file changed underneath it. Gloss then reports `menu content revision conflict` with both hashes abbreviated to their first 12 characters

## The menu document

`plugins/Gloss/menus/hello.json`, menu id `hello`:

```json
{
  "offset": [0, 1.5, 2],
  "components": [
    {
      "id": "greeting",
      "offset": [0, 0, 0],
      "data": {
        "type": "decoration",
        "icon": {
          "type": "text",
          "text": "&aHello, %player_name%"
        }
      }
    }
  ]
}
```

`vector3` throughout the format is a JSON array of exactly three numbers, `[x, y, z]`. The object form `{"x": …}` is not accepted.

| Key | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `offset` | `vector3` | yes | none | Position of the menu center relative to the session anchor. Never scaled by `uiScale` |
| `components` | array of component | yes | none | The elements of the menu. A single component object is accepted in place of a one-element array |
| `lockPosition` | boolean | no | `false` | Freeze the viewer in place while the menu is open |
| `followPlayer` | boolean | no | `false` | Re-anchor the menu to the viewer on every accepted move, adopting their yaw |
| `maxDistance` | number | no | `6.0E7` | Blocks between viewer and menu center before the menu closes. Clamped to `[0, 6.0E7]`. `null` or absent gives `6.0E7` |
| `closeOnDeath` | boolean | no | `false` | Close on `PlayerDeathEvent` |
| `closeOnTeleport` | boolean | no | `false` | Close on `PlayerTeleportEvent` |

`offset` and `components` are required in the sense that the menu cannot be opened without them. They are not checked at load. A document missing either one registers cleanly and then throws when a player tries to open it. The failure closes the attempted session and is logged with the menu id.

### Offset semantics

`offset` is read in the menu own frame, not in world axes:

| Axis | Direction |
|---|---|
| `+X` | to the viewing side's right |
| `+Y` | up |
| `+Z` | forward, away from the viewing side |

The session transform owns the anchor, facing yaw, pitch, roll and scale. It mirrors X, applies roll around Z, then pitch around X, then the negated facing yaw around Y:

```java
Vector worldOffset = new Vector(-offset.getX(), offset.getY(), offset.getZ())
    .rotateAroundZ(Math.toRadians(roll))
    .rotateAroundX(Math.toRadians(pitch))
    .rotateAroundY(Math.toRadians(-facingYaw));
Location menuOrigin = anchor.clone().add(worldOffset);
```

A personal session anchors at the player **feet** location with zero pitch and zero roll. It captures their eye yaw at open. A panel supplies its full stored transform. A panel-hosted menu can carry pitch and roll as well.

The menu offset is **not** multiplied by `uiScale`. Component offsets are. If you raise `uiScale`, the components spread apart around a center that does not move.

### Range, freezing and following

`lockPosition` constrains the player. `followPlayer` constrains the menu. They are independent axes. A document may set neither, either or both.

With `lockPosition` on, `PlayerMoveEvent` has its destination X, Y and Z rewritten back to the origin. Any non-zero velocity is zeroed. Rotation is untouched. The player can still look around. This branch runs before the range check. A frozen player is never closed out for distance. A menu that is both frozen and following still adopts the allowed look yaw.

With neither flag set the menu stays put in the world while the player walks away from it, up to `maxDistance`. The check is

```
menuOrigin.distanceSquared(playerLocation) <= maxDistance * maxDistance + offsetLengthSquared
```

so the effective walk-away radius is slightly larger than the configured number by the squared length of the menu offset. Any world change fails the check outright. The comparison requires the player location and the menu center to be in the same world.

`closeOnDeath` closes on death. Independently of that flag, respawning re-runs the range check. An in-range respawn location moves or re-anchors the menu. An out-of-range or cross-world one closes it. `closeOnTeleport` closes on teleport. When it is off, an in-range teleport moves the menu with the player. An out-of-range or cross-world teleport still closes it.

`/gloss menu move` re-anchors an open session to your current position. It is translation only. It does not change the facing. It does not change either flag. It does not write anything into the file.

These five lifecycle keys govern personal sessions only. A panel uses its own transform, follow target, view and interaction ranges and viewer lifecycle instead. They neither move, freeze, range-close nor death-close a panel view. The `offset`, components, icons, actions and navigation still define what the panel renders. See [Panels](/gloss/16-panels).

## The session model

If you open a menu, Gloss creates one session bound to one player. Everything it draws is a packet-only display entity sent to that player alone. Nothing is spawned server-side. Nothing is written to the region files. No other player can see it. A player has at most one open menu session. If you open a second, it replaces the first. The first closes with reason `REPLACED`.

Sessions tick once per tick. Each tick drains any pending API icon updates, then ticks every component. Animated images advance a frame. Text icons re-resolve their placeholders when due. Clickable components run their hover test.

Navigation keeps a per-player history stack and a recorded root menu. A `navigate` action can push, replace, go back or go home. `/gloss menu back` reopens the previous entry. If the player quits, Gloss closes the session and clears the history.

If you set `[features] menus = false` in `config.toml`, every open path refuses. `/gloss menu open`, `navigate` actions and the API all decline without a message. Documents still load and hot-reload. The content commands still edit them. Nothing opens.

## Text inside menus

Menu and panel text uses the same viewer-aware text pipeline as scoreboards before the menu subsystem converts it to a MiniMessage component.

For a text icon, each line of the `text` value — split on `\n` — is rendered in this order:

1. **Functions**, including `|animation.<id>|` and `|metric.<key>|`, when `[text] functions` is on.
2. **Inline expressions**, including direct `player.*`/`server.*` getters and `papi`, `papiNumber` and `metric` calls.
3. **PlaceholderAPI**, resolved against the viewing player when `[text] placeholders` is on.
4. **Emoji.** `:heart:` and configured triggers are replaced with their glyphs.
5. **Legacy and bracket-hex colors**, followed by MiniMessage parsing.

Because a placeholder is resolved per viewer, two players looking at
the same menu id see two different renderings. A text icon re-resolves
its dynamic text every `refreshTicks` (default `10`, `0` disables the
refresh, maximum `1200`). It does this when the source has a complete `%name%`,
`|function|` or `{{ expression }}` token. A refresh that throws
keeps the previously rendered text and logs once per session.

A toggle `condition` uses the same full viewer-aware renderer, but only once when the session is constructed. A `message` action renders through the same pipeline each time it fires. See [Components & Hitboxes](/gloss/10-components-hitboxes).

## Parsing

Menu documents are parsed with the lenient Gson instance shared across VolmLib.

- Unquoted keys, single-quoted strings and trailing commas are accepted.
- Unknown keys are silently ignored, so a `"$schema"` member added for editor tooling is harmless.
- A single object is accepted where an array is expected, for `components`, `actions`, `trueActions` and `falseActions`. `"components": {…}` parses the same as `"components": [{…}]`.

Validation at load time is limited to what the record constructors
check. Those checks cover the id contract, the `type` discriminators,
and hitbox width and height pairing and sign. They also cover
`refreshTicks` bounds, entity icon dimension bounds and the
display-style ranges. Everything else — a missing `offset`, a missing
`components`, a component with no `data` — surfaces when a player opens
the menu.

### Parse failures

A zero-byte file logs `Menu config "<id>.json" is empty, ignoring.` and is skipped. Any other failure logs `An error occurred while parsing menu config "<id>.json":` with a stack trace. In both cases the previously registered definition, if there was one, stays live. A bad edit does not delete a working menu. It just stops applying until the file parses again. A failed file never partially registers.

## Hot reload

Menus and images are watched by the menu subsystem own pair of tasks, not by the `DataWatchdog` that covers the enveloped document kinds. The intervals are fixed. `[hotload] watchIntervalTicks` does not change them.

| Interval | Detects | Effect |
|---|---|---|
| 5 ticks | modified files, plus created and deleted paths | the file is re-parsed. If the content hash changed, matching personal sessions close with `DEFINITION_RELOADED`, the viewer gets an action-bar notice and an experience-orb pickup sound, the registry entry is replaced, and any panel showing that menu reloads it |
| 20 ticks | created and deleted paths | created files are parsed and registered. Deleting a file unregisters its id and closes matching sessions silently |

Both passes apply the same recursive filter. If you create a directory, Gloss registers every accepted file beneath it. If you delete a directory, Gloss unregisters every menu id under that path prefix, one by one.

Changes under `images/` do not reload menu documents. They refresh the visuals of open sessions and panel views on the same cadence. An edited PNG appears without reopening anything.

> If you delete a menu file, Gloss unregisters the menu at once and closes anyone viewing it. There is no undo and no backup for a hand-deleted file.
{.is-warning}

## Configuration

| Key | Default | Effect |
|---|---|---|
| `[features] menus` | `true` | When `false`, no menu can be opened by command, action or API |
| `[menus] uiScale` | `1.0` | Global render scale multiplier for menus and panels. Clamped to `0.25` – `4.0` |

`uiScale` multiplies component offsets, icon geometry and hitbox dimensions. It does not multiply the menu-level `offset`. If you change it in `config.toml`, the change takes effect on the next hot reload without reopening. Open sessions and panel views rebuild their visuals in place.

`[debug] hitbox` and `[debug] position` draw particle overlays for open sessions and are also applied live. They are described in [Components & Hitboxes](/gloss/10-components-hitboxes).

See [Configuration](/gloss/02-configuration) for the whole knob surface.

## Authoring menus in game

Every node below is reachable as `/gloss menu …` or `/gloss menus …`. The full argument and permission reference is in [Commands & Permissions](/gloss/17-commands-permissions). This section covers what the nodes do to a document.

```
/gloss menu new shops/weapons
/gloss menu addrow shops/weapons &6Buy a sword
/gloss menu seticon shops/weapons 1 item minecraft:iron_sword
/gloss menu style shops/weapons 1 billboard vertical
/gloss menu offsetrow shops/weapons 1 0 ~0.25 0
```

| Node | What it writes |
|---|---|
| `new <menu>` | Creates a new file from the shipped blank baseline. Fails if the id already exists |
| `copy <menu> <newMenu>` | Copies an existing document to a new id |
| `addrow <menu> <text>` | Appends a text decoration component, offset one row spacing below the last |
| `insertrow <menu> <row> <text>` | Inserts a text decoration at a one-based row |
| `setrow <menu> <row> <text>` | Replaces that row's text. Only `button` and `decoration` rows have one editable icon |
| `removerow <menu> <row>` | Deletes the row |
| `offsetrow <menu> <row> <x> <y> <z>` | Rewrites that component's `offset`. Each coordinate is absolute, or `~`-relative to the current value |
| `seticon <menu> <row> <type> <value>` | Replaces the row's icon. Types: `text`, `image`, `animated`, `item`, `block`, `customItem`, `entity` |
| `style <menu> <row> <property> <value>` | Sets one display-style property on the row's icon. `value=*` clears it. Entity icons have no display style |
| `image <menu> <path>` | Replaces the entire component list with one centered image component |
| `create <hologram> [text=]` | Creates a **panel** plus a same-id menu at your position |
| `edit <menu>` | Hands the document to the web editor, with live sync when available |
| `list`, `open`, `back`, `close`, `move`, `builder` | Session and navigation control. They do not write |

Row numbers are one-based and count components in document order. `seticon` with an image type verifies the file exists under `images/` before writing. `style` writes into the icon `style` object and removes the object entirely when the last property is cleared.

Writes are queued through a single-threaded mutation service. Two commands against the same menu are serialized. Each one reports its resulting revision. If the file changed on disk between the read and the write, the command reports a revision conflict and writes nothing.

> `/gloss menu create` and `/gloss menu new` are different commands. `create` makes a persistent world-anchored panel plus its root menu, is player only, and is gated by `gloss.panels`. `new` makes a blank menu document only and is gated by `gloss.menus.edit`.
{.is-info}

### The shipped baseline

`/gloss menu new` seeds the document from `baselines/menu-blank.json` inside the jar. That baseline is read on demand. It is **never** extracted to the data folder. There is no baseline file to edit.

```json
{
  "offset": [0.0, 1.7, 2.5],
  "lockPosition": false,
  "followPlayer": false,
  "closeOnDeath": true,
  "closeOnTeleport": true,
  "components": [
    {
      "id": "title",
      "offset": [0.0, 0.35, 0.0],
      "data": {
        "type": "decoration",
        "icon": { "type": "text", "text": "&6&lHologram" }
      }
    },
    {
      "id": "body",
      "offset": [0.0, 0.05, 0.0],
      "data": {
        "type": "decoration",
        "icon": { "type": "text", "text": "&7Edit this with /gloss menu or the web editor." }
      }
    },
    {
      "id": "close",
      "offset": [0.0, -0.35, 0.0],
      "data": {
        "type": "button",
        "highlightModifier": 0.05,
        "icon": { "type": "text", "text": "&cClose" },
        "actions": [
          { "type": "sound", "sound": "ui.button.click", "source": "master", "volume": 1.0, "pitch": 1.0 },
          { "type": "navigate", "mode": "close" }
        ]
      }
    }
  ]
}
```

`/gloss menu create` does not use this baseline. It writes a much smaller document — one decoration with a vertical billboard, at `offset` `[0, 1.7, 0]` — because a panel supplies its own placement. If you pass no `text=`, the label is `&f` followed by the panel id.

## Permissions

| Node | Checked when |
|---|---|
| `gloss.menus.list` | `/gloss menu list`, and the `menu open menu=*` form which falls through to it |
| `gloss.menus.open` | `/gloss menu open` with a real id |
| `gloss.menus.back` / `.close` / `.move` | The matching command |
| `gloss.menus.edit` | `new`, `copy`, `edit` and every content node |
| `gloss.menus.builder` | `/gloss menu builder` |
| `gloss.panels` | `/gloss menu create` |
| `gloss.open.<menuId>` | Opening that specific menu |

`gloss.menus.create` is declared in `plugin.yml` but nothing checks it. It is a dead node. Grant `gloss.panels` instead.

### `gloss.open.<menuId>`

Every open path tests `gloss.open.<menuId>` in addition to whatever gate got the player there. The node is built at runtime from the id. It is not declared in `plugin.yml`. Bukkit treats it as op-only until a permission plugin grants it. A menu id containing `/` produces a node containing `/`, for example `gloss.open.shops/weapons/main`.

It is checked on:

- `/gloss menu open`, after `gloss.menus.open`
- a `navigate` action, in a personal session and on a panel alike
- `GlossAPI` open calls
- opening a submenu from a panel

It is **not** checked by `/gloss menu list`, which lists every configured menu. It is **not** checked for a panel own root menu. A viewer who is allowed to see and interact with a panel gets its root menu without needing the per-menu node. Submenus reached from that root do require it.

Grant `gloss.open.*` to a group to let it open everything. Grant individual nodes to gate menus one by one.

## The JSON schema

`schema/gloss.schema.json` in the plugin repository is a JSON Schema 2020-12 document with `$id` `https://volmit.com/gloss/schema.json`. It is **not** bundled into the jar. It is **not** read at runtime. It is **not** applied by the loader. It exists for editor tooling. Point your IDE JSON schema mapping at it, or add a `"$schema"` key to a menu file, which the parser ignores.

Its top-level `required` is `["offset", "components"]` and its properties are `offset`, `lockPosition`, `followPlayer`, `maxDistance`, `closeOnDeath`, `closeOnTeleport` and `components`.

Because the schema is advisory rather than enforced, the two can disagree in both directions. Files the schema rejects can still load, because runtime coercion is broader — single-object collections and lenient JSON are the common cases. Files the schema accepts can still fail, because the schema does not model the open-time nullability rules or the API-only `itemStack` icon type.

`schema/gloss-preview.schema.json` sits beside it and is unrelated. It describes container preview documents, covered in [Container Previews](/gloss/15-container-previews).

## Migrating from HoloUi

The document format is unchanged. Menu files copied out of `plugins/holoui/menus/` load in Gloss as they are. `/gloss import holoui` copies them into `plugins/Gloss/menus/` for you.

What changed around them:

- the folder is `plugins/Gloss/menus/`, not `plugins/holoui/menus/`
- the commands are `/gloss menu …`, and `/holoui menu create` is now `/gloss menu new`
- the permissions are `gloss.menus.*` and `gloss.open.<menuId>`
- `uiScale` is `[menus] uiScale` in `config.toml`, not `UI_SCALE` in `settings.json`
- HoloUi world-anchored **boards** are Gloss **panels**. `/gloss board` is the scoreboard tree and has nothing to do with menus
- the id contract is enforced at load, so a menu path that HoloUi tolerated may now be refused

The command and permission mapping tables are in [Commands & Permissions](/gloss/17-commands-permissions).
