---
title: "Hologram Menus"
description: "Gloss documentation: Hologram Menus"
published: true
date: 2026-08-26
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

While `[features] menus` is enabled, Gloss extracts one inert `menus/default.json` starter. It is never displayed until a player opens it or a panel refers to it. `images/` remains operator-owned and appears only when you put an image file in it. Disabling menus before first boot leaves `menus/` absent; enabling them later extracts the starter on that config reload.

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

Menu edits save automatically. If another editor changed the same menu first, Gloss refuses the stale write so no work is overwritten.

## The menu document

`plugins/Gloss/menus/hello.json`, menu id `hello`:

```json
{
  "offset": [0, 1.5, 2],
  "particleLayers": [],
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
| `particleLayers` | array of particle layer | no | `[]` | Viewer-targeted particles attached to the projection, components or marked text ranges |
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

If you set `[features] menus = false` in `gloss.toml`, every open path refuses. `/gloss menu open`, `navigate` actions and the API all decline without a message. Documents still load and hot-reload. The content commands still edit them. Nothing opens.

## Text inside menus

Menu and panel text uses the same viewer-aware text pipeline as scoreboards before the menu subsystem converts it to a MiniMessage component.

For a text icon, each line of the `text` value is split on `\n` and rendered in this order:

1. **Functions**, including `|animation.<id>|` and `|metric.<key>|`, when `[text] functions` is on.
2. **Inline expressions**, including direct `player.*`/`server.*` getters and `papi`, `papiNumber` and `metric` calls.
3. **PlaceholderAPI**, resolved against the viewing player when `[text] placeholders` is on.
4. **Emoji.** `:heart:` and configured triggers are replaced with their glyphs.
5. **Legacy and bracket-hex colors**, followed by MiniMessage parsing.

Because a placeholder is resolved per viewer, two players looking at
the same menu id see two different renderings. An explicit `refreshTicks` value controls the
refresh exactly (`0` disables it, maximum `1200`). When the key is omitted, ordinary dynamic text
uses 10 ticks while clock-driven expressions and complete named-animation tokens use one tick.
The icon refreshes when the source has a complete `%name%`,
`|function|` or `{{ expression }}` token. A refresh that throws
keeps the previously rendered text and logs once per session.

A toggle `condition` uses the same full viewer-aware renderer, but only once when the session is constructed. A `message` action renders through the same pipeline each time it fires. See [Components & Hitboxes](/gloss/10-components-hitboxes).

## Particle layers

`particleLayers` is a top-level menu field. A layer can target the whole `projection`, one
`component`, all menu `text`, a one-based text `line`, an authored `span`, or `local` coordinates.
For component-scoped work, `target.component` is the component id. Text, line and span targets can
also set `target.component` to restrict the match to one text icon. Panels use the same menu field
and apply the panel's complete world transform to it.

Layers are emitted only to the viewer who owns that menu or panel view. They do not use the
world-broadcast debug-overlay path described on the components page. The full layer contract,
including frame, line, box and per-letter examples, is in
[Particle Layers](/gloss/25-particle-layers).

## Parsing

Menu documents are parsed with the lenient Gson instance shared across VolmLib.

- Unquoted keys and single-quoted strings are accepted. A trailing comma in an object is rejected. A
  trailing separator in an array is read as a `null` element, so use standard JSON rather than relying
  on that lenient edge case.
- Unknown keys are silently ignored, so a `"$schema"` member added for editor tooling is harmless.
- A single object is accepted where an array is expected, for `components`, `actions`, `trueActions` and `falseActions`. `"components": {…}` parses the same as `"components": [{…}]`.

Validation at load time is limited to what the record constructors
check. Those checks cover the id contract, the `type` discriminators,
and hitbox width and height pairing and sign. They also cover
`refreshTicks` bounds, entity icon dimension bounds and the
display-style ranges. Other errors, including a missing `offset`, a missing
`components`, or a component with no `data`, surface when a player opens
the menu.

### Parse failures

A failed file keeps the previously registered definition live and never partially registers. Automatic watching waits for the same invalid bytes on two separate passes before logging one `menus/<id>.json: <reason>` warning. A zero-byte truncate followed by valid replacement bytes therefore reloads without a false warning; a stable zero-byte file reports `menu document must not be empty` on the second observation.

## Hot reload

`menus/` is a document registry on the shared `DataWatchdog` pass, like `holograms/` and `boards/`. `images/` is a second entry on the same pass. Both request checks at `[hotload] watchIntervalTicks` (default 5), while completed automatic passes remain subject to the shared 3-second cooldown.

| Entry | Effect |
|---|---|
| `menus` | Changed, created and deleted files are reported by one folder walk. A file whose content hash actually differs is re-parsed and its registry entry replaced, matching personal sessions close with `DEFINITION_RELOADED`, the viewer gets an action-bar notice, and any panel showing that menu reloads it. A deletion enters a 3-second grace period before its id is unregistered and matching sessions close silently |
| `images` | A changed, added or removed image refreshes the visuals of open sessions and panel views |

All successful automatic entries in one watchdog batch produce one additional action-bar summary and one Gloss success chime for online `gloss.admin` players. `[commands] sounds` can silence that chime without hiding the summary.

The walk applies the same recursive filter as the boot scan, so subdirectories are covered. If you create a directory, Gloss registers every accepted file beneath it. If you delete a directory, Gloss unregisters every menu id under that path prefix, one by one.

Changes under `images/` do not reload menu documents. Because icons are rebuilt on refresh, an edited PNG appears without reopening anything.

> If you delete a menu file, Gloss waits 3 seconds before unregistering it and closing anyone viewing it. Restoring the path during that grace cancels the unload; after the grace there is no backup for a hand-deleted file.
{.is-warning}

## Configuration

| Key | Default | Effect |
|---|---|---|
| `[features] menus` | `true` | When `false`, no menu can be opened by command, action or API |
| `[menus] uiScale` | `1.0` | Global render scale multiplier for menus and panels. Clamped to `0.25` – `4.0` |

`uiScale` multiplies component offsets, icon geometry and hitbox dimensions. It does not multiply the menu-level `offset`. If you change it in `gloss.toml`, the change takes effect on the next hot reload without reopening. Open sessions and panel views rebuild their visuals in place.

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
| `list`, `open`, `back`, `close`, `move` | Session and navigation control. They do not write |

Row numbers are one-based and count components in document order. `seticon` with an image type verifies the file exists under `images/` before writing. `style` writes into the icon `style` object and removes the object entirely when the last property is cleared.

Writes are queued through a single-threaded mutation service. Two commands against the same menu are serialized. Each one reports its resulting revision. If the file changed on disk between the read and the write, the command reports a revision conflict and writes nothing.

`/gloss web edit menu <menu>` opens one menu in a restricted live web session.
`/gloss web workspace` opens every editor-authored runtime document and image.

> `/gloss menu create` and `/gloss menu new` are different commands. `create` makes a persistent world-anchored panel plus its root menu, is player only, and is gated by `gloss.panels`. `new` makes a blank menu document only and is gated by `gloss.menus.edit`.
{.is-info}

### The shipped default and creation baseline

Gloss extracts the jar's `defaults/menus/default.json` as `plugins/Gloss/menus/default.json` when menus are enabled and that file is missing. Existing bytes are never overwritten. `/gloss menu new` reads the same resource, keeping every new blank menu aligned with the shipped starter.

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
        "icon": { "type": "text", "text": "&6&lGloss Menu" }
      }
    },
    {
      "id": "body",
      "offset": [0.0, 0.05, 0.0],
      "data": {
        "type": "decoration",
        "icon": { "type": "text", "text": "&7Edit menus/default.json or use the web editor." }
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

`/gloss menu create` does not use this baseline. It writes a smaller document with one vertical-billboard decoration at `offset` `[0, 1.7, 0]` because a panel supplies its own placement. If you pass no `text=`, the label is `&f` followed by the panel id.

## Permissions

| Node | Checked when |
|---|---|
| `gloss.menus.list` | `/gloss menu list`, and the `menu open menu=*` form which falls through to it |
| `gloss.menus.open` | `/gloss menu open` with a real id |
| `gloss.menus.back` / `.close` / `.move` | The matching command |
| `gloss.menus.edit` | `new`, `copy` and every content node |
| `gloss.menus.create` and `gloss.panels` | `/gloss menu create` |
| `gloss.open.<menuId>` | Opening that specific menu |

### `gloss.open.<menuId>`

Opening a menu also requires `gloss.open.<menuId>`. It is operator-only until a permission plugin grants it. A menu id containing `/` produces a node containing `/`, for example `gloss.open.shops/weapons/main`.

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

The advisory schema and runtime can disagree. Runtime coercion accepts some files the schema rejects, including single-object collections and lenient JSON. The schema can also accept files that fail at runtime because it does not model open-time nullability rules or the API-only `itemStack` icon type.

`schema/gloss-preview.schema.json` sits beside it and is unrelated. It describes container preview documents, covered in [Container Previews](/gloss/15-container-previews).

## Migrating from HoloUi

The document format is unchanged. Menu files copied out of `plugins/holoui/menus/` load in Gloss as they are. `/gloss import holoui` copies them into `plugins/Gloss/menus/` for you.

What changed around them:

- the folder is `plugins/Gloss/menus/`, not `plugins/holoui/menus/`
- the commands are `/gloss menu …`, and `/holoui menu create` is now `/gloss menu new`
- the permissions are `gloss.menus.*` and `gloss.open.<menuId>`
- `uiScale` is `[menus] uiScale` in `gloss.toml`, not `UI_SCALE` in `settings.json`
- HoloUi world-anchored **boards** are Gloss **panels**. `/gloss board` is the scoreboard tree and has nothing to do with menus
- the id contract is enforced at load, so a menu path that HoloUi tolerated may now be refused

The command and permission mapping tables are in [Commands & Permissions](/gloss/17-commands-permissions).
