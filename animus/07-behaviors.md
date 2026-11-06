---
title: "Animus: Behaviors"
description: "JSON behavior documents, triggers, built-in capabilities, packs and state"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, behaviors, triggers, dialogue, quests, packs"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

A behavior is a JSON document that tells an NPC what to do. Plugin-wide budgets for behaviors live in `config.toml`. A behavior named `reference:module-sequence` lives at `plugins/Animus/behaviors/reference/module-sequence.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "reference:module-sequence",
  "entry": "main",
  "routines": {
    "main": {
      "type": "repeat",
      "count": 3,
      "body": {
        "type": "sequence",
        "steps": [
          {"type": "action", "capability": "reference:hello", "arguments": {}},
          {"type": "wait", "ticks": 20}
        ]
      }
    }
  }
}
```

This example calls `reference:hello`, a capability from a [Java module](/animus/99-java-modules-api). Its action returns a JSON message to the engine and sends nothing to players. For actions that reach the world and players without any module, see [built-in capabilities](#built-in-capabilities).

## Documents

Each namespace and path segment of an ID uses 1-64 lowercase ASCII letters, digits, `_` or `-`, and the complete ID is limited to 256 characters. Nested paths are allowed. Empty path segments, dots, backslashes and reserved Windows device names are rejected. An ID must match its file path exactly.

`revision` is a positive 64-bit number. Any change to the file's bytes, including whitespace, needs a revision greater than the last accepted one. `/animus behaviors validate` checks files without publishing anything or changing files, and `/animus behaviors reload` publishes the accepted programs. An invalid edit keeps the last valid program running and reports the rejected fields. The same ID in two files selects no winner, and a missing source disables that behavior. Animus never deletes behavior files or the data of missing modules.

Each accepted program gets a last-valid checkpoint, so these rules hold across restarts:

- A malformed or stale source after a restart keeps the last accepted program and reports its field errors in the startup log and through `/animus behaviors validate`. A changed source still needs a revision higher than the checkpoint.
- A source deleted while the server is stopped stays deleted. Its checkpoint is removed at the next catalog load, so a later malformed file at that path has nothing to fall back on.
- A source deleted while the server runs makes the program unavailable and removes its checkpoint the same way.
- A source that Animus deletes itself (an import rollback, an editor delete or undo, `/animus rollback`) is forgotten with its checkpoint in the following reload, so nothing reports it missing.
- An unusable checkpoint is reported as a warning and ignored. It never stops startup, and a valid source replaces it.

See [storage and recovery](/animus/12-storage-recovery) for the files.

Restarts never resume work in progress. Declared persistent variables survive. Execution stacks, execution variables, transient variables and waits do not, and an interrupted behavior does not continue.

## Nodes

| Node | Fields and behavior |
| --- | --- |
| `sequence` | `steps`: ordered child nodes. |
| `action` | `capability`, optional object `arguments`, optional `bindings`, `expressions` and `templates`; waits for the capability's result. |
| `condition` | Either `capability` with optional `arguments`, `bindings`, `expressions` and `templates`, or an `expression`; plus `then` and optional `else`. |
| `wait` | Integer `ticks` from 1 to 72,000. |
| `repeat` | `count`: a literal from 0 to 128 or an operand. Optional `maximum` (1 to 1,024, default 128) and `index`. A `body`. |
| `foreach` | `list`: an operand giving a list or map. `as`, optional `index`, `key` and `maximum` (1 to 1,024, default 128). A `body`. |
| `while` | `expression`, optional `maximum` passes (1 to 1,024, default 128) and a `body`. |
| `break` | No fields. Leaves the innermost loop. |
| `continue` | No fields. Starts the innermost loop's next pass. |
| `parallel` | One to eight independent `branches`, then join. |
| `call` | `routine`: a reusable routine in this document. Optional `arguments` and `result`. |
| `return` | Optional `value`. Ends the current routine. |
| `set` | `variable` and a `value`: a literal of the variable's type or an [operand](#operands). |

## Variables

Variables declare `type`, `initial` and optional `scope`. The types are:

| `type` | Values | `initial` |
| --- | --- | --- |
| `boolean` | `true` or `false` | A JSON boolean. |
| `integer` | Signed 64-bit whole numbers | A JSON number with no fraction. |
| `decimal` | Finite numbers | A JSON number. |
| `string` | Valid UTF-8 text up to 4,096 bytes | A JSON string. |
| `list` | Up to 256 values of any type, in order | A JSON array. |
| `map` | Up to 256 entries keyed by text of 1 to 256 characters, kept in insertion order | A JSON object. |
| `any` | A value of any of the types above | Any JSON value except `null`. |

Lists and maps nest at most eight levels deep, and the JSON text of a list or map is at most 4,096 UTF-8 bytes. Inside a list or map, and wherever JSON is read as a value of type `any`, a number without a fraction or exponent is an integer and every other number is a decimal. `null` is never a value. When a value is written as JSON, a decimal always keeps its point or exponent (`2.0`, never `2`). A variable declared `any` holds whatever was last written to it, with that value's own type.

At most 128 variables can be declared. `player`, `npc`, `server`, `context`, `true` and `false` are reserved and cannot be variable names. [Expressions](#expressions) can read variables whose names start with a letter and use only lowercase letters, digits and `_`; a name with `-` is still a valid variable, but only `{"variable": ...}` can read it. No behavior can read another player's variables.

```json
"variables": {
  "attempts": {"type": "integer", "initial": 0},
  "mood": {"type": "string", "initial": "calm", "scope": "npc", "lifetime": "transient"},
  "introduced": {"type": "boolean", "initial": false, "scope": "player", "lifetime": "persistent"},
  "trust": {"type": "decimal", "initial": 0.5, "scope": "relationship", "lifetime": "persistent"},
  "phase": {"type": "integer", "initial": 1, "scope": "global", "lifetime": "persistent"}
}
```

| `scope` | One value per | Needs a player |
| --- | --- | --- |
| `execution` (default) | Run of the behavior. Declares no `lifetime`. | No |
| `npc` | Behavior and NPC UUID | No |
| `player` | Behavior and player UUID | Yes |
| `relationship` | Behavior, NPC UUID and player UUID | Yes |
| `global` | Behavior | No |

Every scope other than `execution` needs a `lifetime`: `transient` values last until the server stops, and `persistent` values are stored. Scope and lifetime words are exact, and the compiler names the field it rejects, such as `$.variables.trust.lifetime`. All scopes belong to one behavior ID, so two behaviors never share a variable by name. A variable keeps its `initial` value until something writes it, and an unwritten variable takes no storage.

A run with no player cannot start a behavior that declares a `player` or `relationship` variable. It is refused with `behavior-state-player-required` and the variable's field. Reads see the most recent write from any run. There is no compare-and-set, so the last write wins when runs of the same behavior write the same key. A preview run reads stored values and never writes them.

If a new revision changes a stored variable's type, the stored value is neither converted nor discarded. Runs for that subject are refused with `behavior-state-type-mismatch` until the declaration is restored or the state is purged. A variable declared `any` accepts a stored value of every type. Removing a declaration leaves its stored value in place, still counted against the state budgets. Changing only the `lifetime` selects a different key.

### Parallel branches

Parallel branches start with independent copies of the current variables, scoped ones included, and keep those copies: a branch sees its own writes and no one else's until the join. Writes to different variables merge on join. Two branches writing the same variable fail with a conflict, even when they write the same value. The conflict cannot roll back side effects that already happened.

Outside a parallel node a `set` of a scoped variable takes effect immediately. Inside one, it stays private to the branch and becomes visible to other runs only when the outermost join completes, when all the branches' scoped writes apply together or not at all. A conflict, a budget refusal at the join, a cancellation or a failure before the join discards the branches' scoped writes. Writes already applied outside the parallel node are not undone when the run later fails.

### Bindings

Action and condition arguments can bind declared variables into `null` placeholders:

```json
{
  "type": "action",
  "capability": "example:record",
  "arguments": {"amount": null},
  "bindings": {"/amount": {"variable": "amount"}}
}
```

This shape needs a module that provides `example:record` and a declared `amount` variable. Binding keys are JSON Pointers resolved when the document compiles. They cannot create keys, extend arrays, overlap, or replace a value that is not `null`. When the action runs, the variable's current value becomes JSON of the same type: a list becomes an array and a map an object. Other variables are not passed. The final argument object must fit within 64 KiB of UTF-8 and pass the capability's schema before the capability runs.

`expressions` and `templates` fill placeholders the same way, keyed by JSON Pointer, with an [expression](#expressions) or a [template](#templates) instead of a variable:

```json
{
  "type": "action",
  "capability": "animus:say",
  "arguments": {"text": null},
  "templates": {"/text": "{{ player.name }}, you have visited {{ visits }} times."}
}
```

A pointer may appear in only one of `bindings`, `expressions` and `templates`, and the three together hold at most 32 entries. They are evaluated when the action runs. An expression result is written as JSON: a whole number becomes an integer, other numbers decimals, lists arrays and maps objects. A template result is a string.

### Module argument schemas

Java modules describe their arguments with a bounded subset of JSON Schema 2020-12: types, `enum` and `const`, numeric and size constraints, object `properties`, `required` and `additionalProperties`, array `items` and `prefixItems`, and the basic combinators and conditionals. References, `pattern`, `format` and other keywords fail module registration with a field diagnostic. See [Java modules and API](/animus/99-java-modules-api).

### Document limits

A document is limited to 256 KiB of source, 2,048 nodes, a depth of 32, 32 routines and 128 variables. Bindings add at most 32 slots with 16 pointer segments each. The catalog holds at most 1,024 documents, 4,096 folder entries, a folder depth of eight and 16 MiB of source in total; these are the `[behaviors.catalog]` settings below.

## Operands

Wherever the language takes a value (`set`'s `value`, a computed `repeat` `count`, `foreach`'s `list`, `call` `arguments` and `return`'s `value`), it accepts a literal or an operand object:

| Operand | Value |
| --- | --- |
| A JSON literal | That value, of the target's type. |
| `{"variable": "name"}` | A declared variable. Its declared type must match the target unless one of them is `any`. |
| `{"expression": "..."}` | An [expression](#expressions). |
| `{"template": "..."}` | A [template](#templates); the target must be `string` or `any`. |

An object whose only key is `variable`, `expression` or `template` is an operand. For a `map` or `any` target, an object with more keys is a map literal; a map whose only key is one of those words is written as an expression instead.

The result is converted to the target's declared type: a `string` takes any value as text, an `integer` takes a whole number within ±2^53, a `decimal` takes a number, a `boolean` takes only `true` or `false`, a `list` takes a list, a `map` takes a map and `any` takes anything. A result that cannot be converted, or that exceeds the value bounds, ends the run as FAILED with `behavior-expression-type` and the operand's field.

## Expressions

Expressions use the same grammar as [GUI expressions](/animus/11-guis-holograms-menus#expressions): numbers, quoted strings, `true` and `false`, list literals such as `[1, 2]`, function calls, `!`, `-`, `+ - * / %`, comparisons, `==`, `!=`, `&&`, `||` and `a ? b : c`. Numbers are decimals while an expression runs; an integer variable enters as a number. `+` joins text when either side is text. `==` compares two numbers, two strings or two booleans; use `same` for loose comparison. An expression is at most 4,096 characters. A `condition` or `while` expression must give `true` or `false`; text such as `'true'` is not accepted, so wrap it in `truthy` when that is meant.

```json
{"type": "condition", "expression": "visits >= 3 && !has_flag('player', 'thanked')",
 "then": {"type": "action", "capability": "animus:say", "arguments": {"text": "Thank you for coming back."}}}
```

An expression reads:

| Name | Value |
| --- | --- |
| A declared variable, such as `visits` | Its current value. A dotted name reads map keys: `item.name` is key `name` of the map `item`. |
| `player.<fact>` | `name`, `uuid`, `online`, `health`, `max_health`, `food`, `level`, `world`, `x`, `y`, `z`, `location`, `gamemode`, `op`, `sneaking`, `flying`, `item_in_hand`, `item_in_hand_amount` of the run's player. |
| `npc.<fact>` | `name`, `id`, `citizens_id`, `uuid`, `spawned`, `health`, `world`, `x`, `y`, `z`, `location` of the run's NPC. `citizens_id` is the numeric Citizens id of an NPC imported from Citizens, such as `284` for `citizens-284`, and the Animus id of any other NPC. |
| `server.<fact>` | `online_players` (a number), `players` (the online players' UUIDs, at most 1,024), `max_players`, `tick`, `time_millis`. |
| `context.<key>` | A value of the event that started the run, such as `context.message`. |

`location` is the text `x,y,z,world` with coordinates rounded to two decimals. `player.world`, `npc.world` and `context.world` all name a world the same way: by its name on Bukkit, such as `world_nether`, and by its dimension key on mod servers, such as `minecraft:the_nether`. To compare a world with one written in a definition, use `same_world`, which accepts either form on both platforms. Facts come from snapshots the platform refreshes on its own threads, so reading one never touches the world and may trail it by a few ticks. An unknown variable, an unknown fact name or a bare `player`, `npc`, `server` or `context` fails compilation with the field. A fact or context key the run does not have fails the run with a message starting `fact-unavailable`, for example `player.name` in a run with no player.

Functions, in addition to the GUI ones such as `min`, `max`, `round`, `len`, `contains`, `lower` and `upper`:

| Function | Result |
| --- | --- |
| `get(listOrMap, indexOrKey[, default])` | The item at a 0-based index or key. Without a default, a missing item fails. |
| `has(map, key)`, `keys(map)`, `values(map)` | Whether the key exists; the keys; the values. |
| `put(map, key, value)`, `remove(listOrMap, indexOrKey)` | A new map with the entry set; a new list or map without the item. |
| `append(list, value)`, `insert(list, index, value)` | A new list with the value added at the end or at the index. |
| `index_of(list, value)`, `first(list)`, `last(list)` | The 0-based index, or -1 when absent; the first or last item. |
| `slice(listOrText, from, to)`, `reverse(listOrText)` | Items or characters from `from` up to but not including `to`; reversed. |
| `sort(list)`, `sum(list)`, `join(list, separator)` | Numbers or text in order; the total of numbers; items joined as text. |
| `split(text, separator)`, `range(from, to)` | Text cut at each separator; whole numbers from `from` to `to` inclusive, at most 256. |
| `trim(text)`, `replace(text, find, with)`, `starts_with(text, prefix)`, `ends_with(text, suffix)` | Text without surrounding spaces; every `find` replaced; prefix and suffix tests. |
| `num(x)`, `int(x)`, `text(x)` | A number from a number or numeric text, otherwise a failure; that number rounded toward zero; any value as text. |
| `truthy(x)` | True for `true`, the text `true` in any case, and numbers other than zero. |
| `same(a, b)` | Equal as numbers when both are numbers or numeric text, otherwise equal as text ignoring case. |
| `same_world(a, b)` | Both name the same loaded world. Each side may be a Bukkit world name, a world UUID on Bukkit or a dimension key such as `minecraft:the_nether`. A world that is not loaded is compared as text, ignoring case. The Denizen importer writes this for any comparison with a world. |
| `random(min, max)`, `random_decimal()`, `chance(percent)`, `pick(list)` | A whole number from `min` to `max` inclusive; a number from 0 up to 1; true with that percent chance; a random item. |
| `flag(scope, name[, default])`, `has_flag(scope, name)`, `quest(scope, name)` | A [flag](#flags-and-quests) of this behavior's namespace, which without a default must be set; whether it is set; a quest stage, 0 when unset. `scope` is `'player'`, `'npc'`, `'relationship'` or `'global'`. |
| `players(x)` | The player UUIDs in a list or a single value, in order and without repeats, at most 100. Items written `p@<uuid>`, as Denizen stores players, count too; anything else is skipped. |
| `player_info(player)` | Another online player's facts as a map with the `player.<fact>` keys; an empty map when that player is offline. |
| `player_flag(player, name[, default])`, `player_has_flag(player, name)` | A `player` flag of this namespace for another player, read as `flag` and `has_flag` read the run's player. |

Collection functions return new values and never change a variable; write the result with `set`. Lists and maps hold at most 256 items. One evaluation takes at most 4,096 steps, counting each part of the expression and each item a function walks, and builds text of at most 65,536 characters. Strings, lists and maps it produces must still fit the value bounds before they are stored or sent. A failure ends the run as FAILED with the reason `expression-failed:<field>:<message>` and a `behavior-expression-failed` diagnostic.

## Templates

A template is text with `{{ expression }}` holes. Each hole's value becomes text, the way GUI text shows it: whole numbers without a point, lists as `[a, b]`. A literal `{{` is written `{{ '{{' }}`. A hole ends at the first `}}` outside a quoted string, and a template is at most 4,096 characters.

## Loops

A `repeat` with a literal `count` runs that many times. An operand `count` is computed once when the loop starts; below 0 it runs no passes, and above `maximum` the run fails with `behavior-loop-bound`. `index` names a declared execution variable of type `integer`, `decimal` or `any` that receives the 0-based pass number.

```json
{"type": "foreach", "list": {"variable": "rewards"}, "as": "reward", "index": "i",
 "body": {"type": "action", "capability": "animus:say", "arguments": {"text": null},
          "templates": {"/text": "Reward {{ i + 1 }}: {{ reward }}"}}}
```

`foreach` evaluates `list` once when it starts. For a list, `as` receives each item and `index` its position. For a map, `as` receives each value, `key` each key and `index` the position, in insertion order; `key` is unchanged for a list. `as`, `index` and `key` must be declared execution variables; `key` is `string` or `any`, and each item is converted to the type of `as`. A list or map with more items than `maximum` fails the run with `behavior-loop-bound`.

`while` checks its `expression` before every pass and stops when it is false. The expression must give `true` or `false`. When it is still true after `maximum` passes, the run fails with `behavior-loop-bound`.

`break` leaves the innermost loop and `continue` starts its next pass. Both must sit inside a `repeat`, `foreach` or `while` body of the same routine, and not inside a `parallel` branch within that loop; otherwise compilation fails. Every pass of a loop counts one step against the run's step budget, plus the steps of its body.

## Calls and return

```json
{"type": "call", "routine": "price", "arguments": {"item": {"variable": "chosen"}}, "result": "cost"}
```

`arguments` assigns declared variables, each from a literal or an operand, before the routine starts. `result` names a declared variable that receives the value of the routine's `return`. Execution variables are shared by every routine of a run, so the routine reads `item` directly and can change any variable its caller sees.

`return` ends the routine that the innermost `call` started. With `value`, the value is converted to the type of the call's `result`; without `value`, or without a `result`, the result variable keeps its value. A `return` in the routine a run started with completes the run. `return` cannot sit inside a `parallel` branch.

## Automatic triggers

A behavior document can declare `triggers`. An NPC runs them when its definition lists the behavior in its `behaviors` array, such as `"behaviors": ["example:greeter"]`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "example:greeter",
  "entry": "main",
  "routines": {
    "main": {"type": "action", "capability": "example:wave"},
    "farewell": {"type": "action", "capability": "example:bow"}
  },
  "triggers": [
    {"id": "click", "event": "interaction", "cooldownTicks": 40},
    {"id": "near", "event": "proximity", "phase": "enter", "radius": 8},
    {"id": "away", "event": "proximity", "phase": "leave", "radius": 8, "routine": "farewell"},
    {"id": "clock", "event": "timer", "intervalTicks": 1200}
  ]
}
```

This example needs a module that provides `example:wave` and `example:bow`. Every trigger has a unique `id` and an `event`. Optional `routine` starts that routine instead of `entry`. Optional `cooldownTicks` (0 to 72,000) overrides the configured default. A document holds at most 32 triggers. Compilation stops at the first invalid field and reports its path, such as `$.triggers[1].radius`.

| `event` | Other fields | Fires when |
| --- | --- | --- |
| `interaction` | Optional `action`: `interact` (default), `attack` or `any`. Optional `consume`: an expression checked as the click arrives. | A viewer's hit passes server validation and no listener cancels `VirtualNpcInteractionEvent`. When `consume` holds, shops, hiring, GUIs, riding and selection do not see the click. |
| `proximity` | `phase`: `enter` or `leave`. `radius`: above 0, at most 64 blocks. | A viewer crosses that radius. Leaving needs half a block of extra distance. |
| `spawn` | None. | The NPC is first presented. At startup it waits for the first behavior catalog. |
| `despawn` | None. | A spawned NPC is despawned. It runs against the new dormant definition. |
| `damage` | None. | The NPC's health falls. |
| `death` | None. | The NPC's health reaches zero. No despawn trigger follows a death. `say`, `play-sound` and `spawn-particle` still come from where the NPC fell; actions that need a living body are unavailable until it respawns. |
| `waypoint` | Optional `waypoint`: -1 to 4,095. | The NPC arrives at a route point; -1 is a manually requested destination. Without the field, any arrival fires. |
| `timer` | `intervalTicks`: 1 to 72,000; 20 to 72,000 in a server behavior. | The interval passes while the NPC is active, or while the server runs in a [server behavior](#server-behaviors). |
| `dialogue_choice` | `dialogue`. Optional `choice`. | A viewer's click on that prompt from this NPC passes validation. |
| `module` | `key`: a `namespace:name` trigger. | The owning module publishes that trigger. In a server behavior, any publish of that key fires it. |
| `build_finished` | None. | A build this NPC leads or helps with places its last block. See [building](/animus/09-building). |
| `build_paused` | None. | A build this NPC works on is paused by command, or starts waiting for unloaded terrain, materials or an active builder. |
| `animation_finished` | Optional `animation`: an animation id such as `town:golem/wave`. | A clip started by `animus:play-animation` reaches its end: a `once` clip stops and a `hold` clip starts holding its last frame. Looping clips and the rig's own idle and walk clips never fire it. |
| `player_join` | Optional `first`: `true` fires only on a player's first join, `false` only for returning players. | A player joins. Server behaviors only. |
| `player_quit` | None. | A player leaves. Server behaviors only. |
| `player_chat` | Optional `pattern` (up to 256 characters): matched against the whole message, ignoring case, where `*` matches any text. | A player sends a chat message. Server behaviors only. |
| `command` | `name`, optional `aliases` (up to 8), `permission`, `description`, `usage` | Someone runs the command Animus registers for it. See [commands](#server-commands). Server behaviors only. |
| `server_start` | None. | Behaviors first load after the server starts. Server behaviors only. |
| `player_death` | None. | A player dies. Server behaviors only. |
| `player_respawn` | None. | A player respawns. Server behaviors only. |
| `player_world_change` | Optional `from`, `to`: world names. | A player moves to another world. Server behaviors only. |
| `player_area` | `phase`: `enter` or `leave`. `area`: a name. `world`. One of `cuboid` (two corner blocks, `[x1, y1, z1, x2, y2, z2]`, both included) or `ellipsoid` (`[x, y, z, rx, ry, rz]`). | A player enters or leaves the area. Server behaviors only. See [world events](#world-events). |
| `player_inventory_open` | Optional `inventory`, `cancel`. | A player opens an inventory. Server behaviors only. |
| `player_inventory_close` | Optional `inventory`. | A player closes an inventory. Server behaviors only. |
| `player_inventory_click` | Optional `inventory`, `click`, `item`, `cancel`. | A player clicks a slot of an open inventory. Server behaviors only. |
| `player_item_drop` | Optional `item`, `cancel`. | A player drops an item, picks one up, or finishes eating or drinking one. Server behaviors only. |
| `player_item_pickup` | Optional `item`, `cancel`. | A player drops an item, picks one up, or finishes eating or drinking one. Server behaviors only. |
| `player_item_consume` | Optional `item`, `cancel`. | A player drops an item, picks one up, or finishes eating or drinking one. Server behaviors only. |
| `player_block_click` | Optional `block`, `click` (`left` or `right`), `cancel`. | A player clicks a block. Clicks in the air are not reported. Server behaviors only. |
| `player_block_place` | Optional `block`, `cancel`. | A player places or breaks a block. Server behaviors only. |
| `player_block_break` | Optional `block`, `cancel`. | A player places or breaks a block. Server behaviors only. |
| `player_damaged` | Optional `cause` (a damage type such as `fall`), `damager` (an entity type), `cancel`. | A player takes damage. Server behaviors only. |
| `player_damage_entity` | Optional `entity`, `cancel`. | A player hits a living entity. NPCs are not entities: a hit on an NPC is its `interaction` with `action: attack`. Server behaviors only. |
| `player_kill` | Optional `entity`. | A player kills a living entity. Server behaviors only. |
| `projectile_launch` | Optional `projectile`, `shooter`, `cancel`. | A projectile such as an arrow, snowball, ender pearl or trident is launched, by a player, a mob, a dispenser or a command. Server behaviors only. |
| `projectile_hit` | Optional `projectile`, `shooter`, `entity`, `block`, `cancel`. | A projectile hits an entity or a block. NPCs are not entities, so projectiles pass through them. Server behaviors only. |
| `entity_shoot_bow` | Optional `shooter`, `bow`, `projectile`, `cancel`. | A player or mob shoots a bow or crossbow. Server behaviors only. |

Interaction, proximity and dialogue runs carry the viewer's UUID, and module runs carry the UUID the module supplied. The other events carry no player. Triggers pass no other event data to the routine. Trigger-started runs use the same variables as manual runs, and `player` and `relationship` variables resolve from the triggering player. Every routine a behavior's triggers start shares that behavior's variables.

A trigger with no player cannot start a behavior that declares a `player` or `relationship` variable. That start is counted under `START_FAILED`, and `/animus behaviors triggers` shows the most recent refusal with its field. Spawn, despawn, damage, death, waypoint and timer triggers never have a player, so `/animus behaviors validate` warns with `behavior-trigger-needs-player` on each such trigger in that behavior. The behavior is still accepted, since its other triggers may work. A `module` trigger depends on what its module supplies and is not flagged.

Only active NPCs fire triggers. Dormant NPCs, including applied imports that are not spawned yet, fire nothing, and previews never fire triggers. Editing an active NPC's definition is neither a despawn nor a spawn. A player disconnecting fires no `leave`. Deleting an NPC fires no `despawn`, because no definition remains to run against. Stopping the server fires nothing.

Replacing the behavior, editing or despawning the NPC, or making the behavior unavailable cancels its running executions and drops its queued starts. Cancellation cannot undo an action that already happened. A `module` trigger whose module is missing makes the whole behavior unavailable.

Timers, cooldowns and queue lifetimes count behavior ticks, about 50 ms each with the default `tickMillis`. Cooldowns apply per trigger on each NPC, not per player: a second player entering a `proximity` radius during the cooldown does not fire it.

On Folia, triggers run on the region that owns each NPC, damage and death triggers included. Where the NPC runtime is unavailable, or when `behaviors.triggers.enabled` is false, `/animus behaviors triggers` shows `UNAVAILABLE` with the reason, nothing runs, and module publishes return `UNAVAILABLE` with the same reason. Manual runs still work there.

### Trigger settings

These defaults live under `[behaviors.triggers]` in `config.toml` and apply when the file is saved. Turning triggers off drops queued triggers that have not started; running ones finish.

```toml
[behaviors.triggers]
enabled = true
eventQueue = 256
eventsPerTick = 32
startsPerTick = 8
maximumQueued = 128
queuePerNpc = 4
queuePerTrigger = 2
queueLifetimeTicks = 100
concurrentTotal = 32
concurrentPerNpc = 2
concurrentPerTrigger = 1
defaultCooldownTicks = 20
npcCooldownTicks = 0
maximumBindings = 4096
maximumTimers = 1024
minimumTimerTicks = 20
maximumProximityRadius = 32
proximityIntervalTicks = 5
proximityViewersPerTick = 16
proximityCandidates = 32
proximityTrackedPerViewer = 64
```

An event that finds its cooldown running is suppressed. An event that finds a full queue is dropped. A start waiting on a concurrency limit stays queued until `queueLifetimeTicks`, then is dropped. All of these are counted. A timer below `minimumTimerTicks`, a radius above `maximumProximityRadius`, and bindings or timers beyond their maximums stay unbound and are listed as diagnostics. When `concurrentTotal` is below `behaviors.engine.executions`, the difference stays free for manual runs.

A valid click on [`animus:choices`](#dialogue-choices) publishes the dialogue event. `dialogue` matches the prompt's `id` and `choice` matches the option's `id`.

## Server behaviors

A behavior with `"server": true` belongs to the whole server instead of an NPC. It is what imported Denizen world and command scripts become:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "town:welcome",
  "server": true,
  "entry": "main",
  "variables": {"visits": {"type": "integer", "initial": 0, "scope": "player", "lifetime": "persistent"}},
  "routines": {
    "main": {"type": "action", "capability": "animus:title", "arguments": {"title": "Welcome to town"}},
    "spawn": {"type": "action", "capability": "animus:teleport", "arguments": {"x": 0, "y": 64, "z": 0, "world": "world"}}
  },
  "triggers": [
    {"id": "hello", "event": "player_join", "first": true},
    {"id": "spawn", "event": "command", "name": "spawn", "aliases": ["hub"], "permission": "town.spawn", "routine": "spawn"}
  ]
}
```

A server behavior runs only when it is listed in `server-behaviors.json` at the top of the plugin folder:

```json
{"schemaVersion": 1, "behaviors": ["town:welcome"]}
```

The list holds at most 256 ids. It is read at startup and by `/animus behaviors reload`. A listed id that is missing, unavailable or not a server behavior is reported and skipped. Removing an id cancels that behavior's running runs, as replacing a behavior does. Accepting the `denizen` review of `/animus import citizens preview` adds the imported server behaviors to this file, and rolling the import back removes them.

The web editor edits this list as the Server behaviors list document: add, remove and reorder the workspace's server behaviors, then apply it with the `apply:behaviors` scope. The list has no `revision`. The Server behavior switch in a behavior's Document section sets `"server": true` and raises any timer below 20 ticks to 20.

A server behavior has no NPC. It may declare only `execution`, `player` and `global` variables, and it may use only these events: `player_join`, `player_quit`, `player_chat`, `command`, `server_start`, `timer`, `player_death`, `player_respawn`, `player_world_change`, `module` and the [world events](#world-events). NPC behaviors cannot use the player and server events. Capabilities that need an NPC refuse a server run with `no-npc`: `say`, `look`, `navigate`, `stop-navigation`, `play-recording`, `resume-patrol`, `set-appearance`, `set-equipment`, `combat-control`, `build`, `play-animation`, `stop-animation`, `choices`, `npc-state`, `player-in-range`, flags and quests with `npc` or `relationship` scope, sounds and particles `at` the NPC, and teleports of or to the NPC.

Every event except `server_start` and `timer` carries the player, and the projectile events carry it when a player shot, so `player` variables and the player capabilities work from it. Runs see the event's details as `context`: `message` for chat and death, `first` for joins, `from` and `to` for world changes, and `command`, `alias`, `args` (the words after the command) and `raw_args` for commands. Cooldowns of player events apply per trigger and player, so one player's cooldown never holds back another. Other cooldowns apply per trigger.

### World events

The `player_area`, inventory, item, block, combat and projectile events report what happens in the world. Each carries the player (a projectile event only when a player shot) and passes these `context` keys:

| Event | `context` |
| --- | --- |
| `player_area` | `area`, `world`, `phase` (`enter` or `leave`) and `cause`: `join` for the first check after a player joins, `quit` when they leave the server, `move` otherwise. |
| `player_inventory_open`, `player_inventory_close` | `inventory_type`: a lowercase type such as `chest`, `player`, `furnace`, `workbench` or `hopper`. |
| `player_inventory_click` | `inventory_type`; `click`: `left`, `right`, `shift_left`, `shift_right`, `middle`, `number_key`, `double_click`, `drop`, `control_drop` and so on; `slot`: the raw slot from 0, or -1 outside the window; `item`: the clicked item's key. |
| `player_item_drop`, `player_item_pickup`, `player_item_consume` | `item`, a key such as `minecraft:bread`, and `amount`. |
| `player_block_click`, `player_block_place`, `player_block_break` | `block`, a key; `world`, `x`, `y`, `z` and `location` (`x,y,z,world`). A click adds `click` (`left` or `right`) and `hand` (`main_hand` or `off_hand`). |
| `player_damaged` | `cause`, the damage type such as `fall`, `lava` or `player_attack`; `damage`; `damager`, the attacker's entity type, or empty. |
| `player_damage_entity` | `entity`, the entity type; `entity_uuid`; `cause`; `damage`. |
| `player_kill` | `entity` and `entity_uuid`. |
| `projectile_launch` | `projectile`, the projectile's entity type, and `projectile_uuid`; `shooter`, the shooter's entity type, and `shooter_uuid`, both empty for none; `world`, `x`, `y`, `z` and `location` where it was launched. |
| `projectile_hit` | `projectile`, `projectile_uuid`, `shooter` and `shooter_uuid`; `entity` and `entity_uuid` of the entity hit, or `block` of the block hit, the other empty; `world`, `x`, `y`, `z` and `location` of the block hit, or of the projectile when it hit an entity. |
| `entity_shoot_bow` | `shooter` and `shooter_uuid`; `bow`, the weapon's item key; `projectile` and `projectile_uuid`; `force`, how far a player drew a bow from 0 to 1, and 1 for crossbows and mobs; `hand` (`main_hand` or `off_hand`); `world`, `x`, `y`, `z` and `location` of the shooter. A multishot crossbow reports each projectile. |

The `inventory`, `click`, `item`, `block`, `cause`, `damager`, `entity`, `projectile`, `shooter` and `bow` fields filter on these values. A filter ignores case, `*` matches any text, and a filter without a namespace matches the name after it: `*_log` matches `minecraft:oak_log`. `*` also matches an empty value, while `*:*` matches any key, so `"entity": "*:*"` fires only for hits on an entity. Events that no enabled trigger's filters match are dropped where they happen and take no queue slot, so frequent events such as block clicks and damage cost one comparison per trigger.

`cancel` is an expression checked on the event's own thread as it happens, over flags, facts and `context`, with no variables. When it holds for a trigger that matches, the event is cancelled: the inventory stays closed, the click is undone, the item stays put, the block stays or is not placed, the damage does not happen, the projectile is not launched or passes as if nothing was hit, or the bow does not shoot. The trigger's run starts either way. A failing expression does not cancel. Closing an inventory, a kill and area events cannot be cancelled.

Areas are checked from the player snapshots every 10 ticks, so a player who crosses a corner in less than half a second may not be seen inside it. Every trigger that names the same `area` in the same `world` shares one area; another shape under that name is refused with `server-area-conflict`. At most `maximumAreas` areas are tracked; triggers past it are refused with `server-area-capacity`.

On Paper, Spigot and Folia these events come from the Bukkit events, at `HIGH` priority for the cancellable ones and with events other plugins cancelled left out; on Folia they run on the region that owns the player, or the projectile or shooter for the projectile events. On Fabric, Forge and NeoForge they come from the server's own code paths. Fake players of other mods are left out. On Forge, a modded menu opened through Forge's own menu call does not report `player_inventory_open`. On Fabric, Forge and NeoForge, `entity_shoot_bow` reports players, skeletons and mobs with crossbows; other mobs' ranged attacks report only `projectile_launch`. Projectiles NPCs fire in combat never report any of the projectile events.

### Player lists

An action of a run reaches one player: the run's player, or the one its `player` argument names. To reach several, loop over a list of UUIDs and fill `player` from the loop variable. The loop variable must be declared, here as `"variables": {"target": {"type": "any", "initial": ""}}`:

```json
{"type": "foreach", "list": {"expression": "players(server.players)"}, "as": "target", "maximum": 100,
 "body": {"type": "condition", "expression": "player_has_flag(target, 'alerts')",
          "then": {"type": "action", "capability": "animus:title", "arguments": {"title": "Storm", "player": null}, "expressions": {"/player": "target"}}}}
```

`players` keeps at most 100 players, so one loop never sends more than 100 actions.

### Server commands

Each enabled `command` trigger registers a command with the server. `name` and each alias are 1 to 32 lowercase letters, digits, `_` or `-`, written without a slash. The server checks `permission` before the trigger fires; without one, everyone may run it. The console may run it too, and then the run has no player. A name the server or another plugin or mod already owns is refused with a diagnostic and stays unregistered; a taken alias is left out. Two enabled behaviors cannot register the same name. At most 64 commands are registered, and a command is removed when its behavior is no longer enabled.

On Paper, Spigot and Folia the commands join the server's command map under the `animus:` fallback prefix. On Fabric, Forge and NeoForge they join the server's command tree, with everything after the name passed as one argument.

### Threads and limits

Platform listeners only publish events into a bounded queue. Player actions of a server run go to that player's owner, which on Folia is the player's own scheduler; broadcasts and console commands go to the global owner. `/animus behaviors triggers` lists server triggers after the NPC triggers, with their counts, drops and diagnostics.

These defaults live under `[behaviors.server]` in `config.toml` and require restart:

```toml
[behaviors.server]
enabled = true
eventQueue = 512
eventsPerTick = 64
startsPerTick = 16
queuePerTrigger = 64
concurrentPerTrigger = 8
concurrentTotal = 32
defaultCooldownTicks = 0
minimumTimerTicks = 20
maximumCommands = 64
maximumAreas = 256
```

`maximumAreas` (0 to 4,096) caps the areas `player_area` triggers track.

As with NPC triggers, overflow is dropped and counted, and a queued start waiting longer than 100 ticks is dropped. A timer below `minimumTimerTicks` stays unbound and is listed as a diagnostic. With `enabled = false`, server behaviors show `UNAVAILABLE` and nothing runs.

## Built-in capabilities

Behaviors can use the `animus:` capabilities below with no Java module installed. They use the same registry and schema checks as module capabilities. `/animus modules capabilities` lists them after any module capabilities, and it and `/animus modules status` count the two separately. Unknown argument fields are rejected. Coordinates are absolute and use the NPC's current world.

This greeter faces the player who started it, asks a question, and records that they met:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "town:greeter",
  "entry": "main",
  "routines": {
    "main": {
      "type": "condition",
      "capability": "animus:player-in-range",
      "arguments": {"radius": 8},
      "then": {
        "type": "sequence",
        "steps": [
          {"type": "action", "capability": "animus:look", "arguments": {"target": "player"}},
          {"type": "action", "capability": "animus:say", "arguments": {"text": "Welcome to town."}},
          {"type": "action", "capability": "animus:choices", "arguments": {
            "id": "greeting",
            "prompt": "Do you need directions?",
            "options": [{"id": "yes", "text": "Yes, please"}, {"id": "no", "text": "No, thanks"}]
          }},
          {"type": "action", "capability": "animus:set-flag", "arguments": {"name": "met-guard", "scope": "relationship"}}
        ]
      }
    }
  }
}
```

### Conditions

| Capability | Arguments | True when |
| --- | --- | --- |
| `animus:has-permission` | `permission` | The triggering player holds the permission. False with no triggering player. |
| `animus:npc-state` | At least one of `spawned`, `minimumHealth`, `maximumHealth` | The NPC matches all of them. A dormant or removed NPC has `spawned` false and health 0. |
| `animus:player-in-range` | `radius` (1-64), optional `anyPlayer` | The triggering player, or any player with `anyPlayer`, is within the radius in the NPC's world. |
| `animus:flag-state` | `name`, optional `scope`, optional `value` (default true: any JSON value, including a list or map) | The flag has exactly that value: `3` never equals `3.0` or `"3"`. An unset or expired flag is false: it equals `false` and nothing else. |
| `animus:quest-state` | `name`, optional `scope`, at least one of `equals`, `atLeast`, `atMost` | The stage matches all of them. An unset quest is stage 0. |

### Actions

| Capability | Arguments | Result |
| --- | --- | --- |
| `animus:say` | `text` (up to 1,024 characters), optional `audience`, `radius`, `player` | Sends `Name » text`. Text is [formatted](#text-formatting). Each `{player_name}` becomes the triggering player's name. |
| `animus:message` | `text` (up to 1,024 characters), optional `to`: `trigger` (default), `all`, `world` or `console`, optional `player` with `trigger` | Sends [formatted](#text-formatting) text with no speaker name to the triggering player, every online player, the players in the NPC's world (the triggering player's world in a server behavior) or the console. Reports `delivered`. |
| `animus:title` | At least one of `title` and `subtitle` (each up to 256 characters), optional `fadeIn`, `stay`, `fadeOut` (0-72,000 ticks; defaults 10, 70 and 20), `player` | Shows a title to the player. |
| `animus:actionbar` | `text` (up to 256 characters), optional `player` | Shows the text above the player's hotbar. |
| `animus:choices` | `id`, `prompt`, `options` (1-8 of `id` and `text`, each with optional `color`, `hover`, `style`), optional `lifetimeSeconds` (1-600) | Shows the prompt and a row of coloured answer buttons to the triggering player. Completes when shown and does not wait for the answer. |
| `animus:command` | `command` (no leading slash), optional `as`: `console` (default) or `player`, optional `player` | Runs the command. Each `{player}` becomes the triggering player's UUID, which vanilla selectors accept, such as `clear {player} minecraft:emerald 1`. Each `{player_name}` becomes their current name. Requires the [allow-list](#commands). |
| `animus:navigate` | Either `x`, `y`, `z` with optional `mode` (`walk`, `swim`, `fly`) and `speed` (1-5), or `route`. Optional `wait`, and with it `timeoutTicks` (20-12,000, default 1,200). | Starts a route or follows `routes/<route>.json`. Completes when requested unless `wait` is true; see [walking a patrol](#walking-a-patrol). The [movement](/animus/05-movement-mounts-riding) limits apply. |
| `animus:stop-navigation` | None | Stops any route, including a playing recording. Reports `stopped`. |
| `animus:play-recording` | `recording` (an id under `recordings/`), optional `playback` (`once`, `pingpong` or the default `loop`), `wait`, and with it `timeoutTicks` (20-12,000, default 1,200). `wait` needs `playback: once`. | Plays a [performance recording](/animus/19-performance-recordings) on the NPC. Completes when started unless `wait` is true, then at the last frame, with the same failures as [walking a patrol](#walking-a-patrol). Unavailable when `[recordings]` is disabled. |
| `animus:resume-patrol` | None | Restarts the NPC's declared route or recording, continuing from where combat, a manual navigate or a stop interrupted it. Reports `resumed`, or `nothing-to-resume` when there is none. |
| `animus:look` | Either `x`, `y`, `z`, or `"target": "player"` | Turns the NPC. The target must be within 64 blocks in the same world. |
| `animus:pose` | `pose`: a name from the definition's `poses` | Turns the NPC to the yaw and pitch of that named pose. A name the definition does not declare is refused. |
| `animus:set-appearance` | Any of `name` (up to 16 characters) and `skin` (a skin file hash), or `"reset": true` | Shows a new name on any body, or a skin on a player body. Viewers receive a fresh body. |
| `animus:set-equipment` | `slot` (`main_hand`, `off_hand`, `head`, `chest`, `legs`, `feet`, `body`), optional `item` | Shows the item, such as `minecraft:iron_sword`. Without `item`, clears the slot. Equipment declared in the definition returns after a restart or a definition change. |
| `animus:play-sound` | `sound`, optional `volume` (0-4), `pitch` (0.5-2), `audience`, `radius`, `at`: `npc` (default) or `player`, `player` | Plays the sound at the NPC, or at the player, for its audience only. Server behaviors always play at the player. |
| `animus:spawn-particle` | `particle`, optional `count` (1-64), `spread` (0-8), `audience`, `radius`, `at`: `npc` (default) or `player`, `player` | Shows the particle at the NPC, or at the player, to its audience only. Server behaviors always show it at the player. Particles that need extra data are rejected. |
| `animus:teleport` | Optional `target`: `player` (default) or `npc`. Either `x`, `y`, `z` with optional `world`, `yaw` (-360-360), `pitch` (-90-90), or `to`: `npc` or `player`. Optional `player`. | Teleports the player or the NPC. Without `world` the target stays in its world. Reports `teleported`. On Folia a teleport the platform cannot make is refused with its reason. |
| `animus:give-item` | `item` (such as `minecraft:bread`), optional `amount` (1-6,400, default 1), `name`, `lore` (up to 16 lines), `player` | Gives the items; what does not fit drops at the player's feet. Reports `given`. |
| `animus:take-item` | `item`, optional `amount` (1-6,400, default 1), `player` | Takes up to that many. Reports `taken`, never more than the player held. |
| `animus:give-book` | `title` and `author` (each up to 32 characters), `pages` (1-50, each up to 1,024 characters and [formatted](#text-formatting)), optional `player` | Gives a written book. Reports `given`. |
| `animus:build` | `operation` (`start`, `pause`, `resume`, `cancel`, `undo`). For `start` only: `schematic` (a file in the `schematics` folder; without it the NPC's saved `animus:builder` section is used), `x`, `y`, `z` (all or none; none builds where the NPC stands), `rotation` (0, 90, 180 or 270), `mirror` (`none`, `x`, `z`), `anchor` (`center`, `corner`, `schematic`), `pattern`, `materials` (`creative`, `donate`), `excavate`, `ignoreAir`, `ignoreLiquids` | Drives the NPC's [build](/animus/09-building). A start answers once the schematic starts loading; loading errors go to the server log. Protection still applies. Unavailable on Folia. |
| `animus:play-animation` | `animation` (an id under `animations/`), optional `speed` (0.25-4, default 1), `loop` (`once`, `loop`, `pingpong`, `hold`), `layer` (0-3, default 0) | Plays a clip of the NPC's [rig](/animus/06-rigs-animations). Higher layers blend over lower ones. Refused when the NPC has no rig or the clip animates another rig. |
| `animus:stop-animation` | Optional `layer` (0-3; without it every played layer stops), `fadeTicks` (0-40) | Stops played clips. Layer 0 returns to the rig's `idle` clip, or `walk` while the NPC walks. |
| `animus:combat-control` | `operation` (`enable`, `disable`, `target`, `release`, `guard`), `target` (an entity or NPC UUID, or `player` for the triggering player): required for `target`, optional for `guard`, refused otherwise | Drives the [combat module](/animus/08-combat#behaviors-and-commands). Needs enabled combat settings; protection still applies. |
| `animus:open-shop` | `shop` (a shop id such as `town:baker`), optional `player` | Opens the [shop](/animus/10-shops) for the triggering player. Reports `delivered` 0 when they are offline. |
| `animus:open-gui` | `gui`, optional `kind`: `inventory` (default), `menu`, `shop` or `gloss`, optional `player` | Opens the [chest GUI](/animus/11-guis-holograms-menus), [holographic menu](/animus/11-guis-holograms-menus#holographic-menus) or shop with that id for the triggering player. `gloss` opens a Gloss menu by its Gloss id, such as `lobby/main`, and refuses as `gloss-unavailable` when Gloss is not installed. |
| `animus:set-flag` | `name`, optional `scope`, and either optional `value` (default true: any JSON value, including a list or map) with optional `expireSeconds` (1-31,536,000), or `"clear": true` | Sets the flag, which reads as unset once `expireSeconds` pass. `clear` unsets it. A value outside the value bounds is refused with `flag-value-unsupported`. |
| `animus:set-quest-state` | `name`, optional `scope`, and either `value` or `random` (1-1,000,000) | Sets the stage to `value`, or to a random stage from 0 up to but not including `random`. `"random": 3` picks 0, 1 or 2. |
| `animus:advance-quest-state` | `name`, optional `scope`, `by` (default 1), `maximum` | Adds to the stage without passing `maximum`. Reports `value`. |

`audience` is `trigger` (default) or `nearby`; `radius` applies to `nearby`, from 1 to 64 with a default of 16. `player` is the UUID of an online player the capability addresses instead of the triggering player; a capability with `player` needs no triggering player. In a preview, `player`, `audience: nearby` and messages to anyone other than the triggering player are refused, and teleports and items always are. `scope` is `player` (default), `npc`, `relationship` or `global`. A capability that addresses the triggering player fails with `no-triggering-player` when the run has none, as with `/animus behaviors run` from the console. Text that uses `{player_name}` needs a triggering player too, even with the `nearby` audience; it fails with `player-name-unknown` when the server does not know the player's name.

Appearance and equipment changes last until a restart or until the NPC's definition changes, and they do not edit the definition. Changing the definition during a run cancels that run, which is why these actions do not write to the file.

### Flags and quests

Flags and quest stages are stored behavior state. `scope` defaults to `player`, so a quest follows the player from NPC to NPC. Use `relationship` for a value between one player and one NPC, `npc` for one NPC, and `global` for the whole namespace.

Flags and quests belong to the behavior's namespace rather than to one behavior: `town:greeter` and `town:quest/gatekeeper` see the same `main` quest, and `harbor:greeter` sees its own. A `name` uses lowercase letters, digits, `_` or `-`, up to 64 characters. Flags and quests have separate names. Calling one directly with `/animus modules action` is refused with `no-behavior-namespace`.

A flag holds a value of any type, like a variable declared `any`; a quest stage is an integer. Expressions read both with `flag`, `has_flag` and `quest`. A flag can expire: from its expiry time it reads as unset, and the owner removes expired flags in the background, at most 256 per behavior tick, after which they no longer count against the budgets. Writing a flag again without an expiry clears the old one, and writing it with an expiry that has already passed unsets it at once. Expiry is stored as epoch milliseconds beside the value, so it continues across restarts.

The `[behaviors.state]` budgets apply, and a write over a budget fails its run with the same diagnostics as a variable. One namespace holds at most 128 flags and 128 quests per subject. Values are stored as `animus:flags/<namespace>` and `animus:quests/<namespace>`, which behaviors cannot use as their own IDs. To remove them, use `/animus behaviors state purge`, for example `state purge behavior animus:quests/town`; the `npc`, `player`, `relationship` and `all` forms reach them too.

### Walking a patrol

With `"wait": true`, `animus:navigate` completes on arrival, so steps run one after another:

```json
{"type": "repeat", "count": 8, "body": {"type": "sequence", "steps": [
  {"type": "action", "capability": "animus:navigate", "arguments": {"x": 10, "y": 64, "z": 4, "wait": true}},
  {"type": "wait", "ticks": 40},
  {"type": "action", "capability": "animus:navigate", "arguments": {"x": 16, "y": 64, "z": 4, "wait": true}},
  {"type": "wait", "ticks": 40}
]}}
```

The run fails with a diagnostic if the route ends any other way:

| Code | Cause |
| --- | --- |
| `navigation-blocked`, `navigation-failed` | Something blocks the path, or no path exists. |
| `navigation-unavailable` | Terrain is not loaded. A waiting route stops rather than retrying, and the same applies to a failed route read. |
| `navigation-cancelled` | Another route replaced this one, the route was stopped, or the NPC was despawned or replaced. |
| `navigation-timeout` | `timeoutTicks` passed; the route stops and the message gives its last status. Ticks are server ticks. |
| `navigation-invalid` | A reusable route point is out of range, or the route has `loop` set, which never finishes. |

Cancelling the run stops the route. With a reusable `route`, the action completes at the last point.

A waiting action holds one slot of `behaviors.engine.inFlight` and one of `modules.maximumInvocations` while the NPC walks, and other actions wait when `inFlight` is used up. `behaviors.actions.navigationWaits` caps waiting actions at 8 by default so walkers cannot starve everything else; past that, the action fails as `navigation-wait-capacity`. Raise it along with `inFlight` for more walkers.

### Unavailable and invalid

These are reported differently, so a problem with the file is not confused with a problem with the server:

- **Invalid**: literal arguments fail the capability's checks, and `/animus behaviors validate` reports `behavior-arguments-invalid`. An invalid edit keeps the previous accepted program. Arguments filled from variables, expressions or templates are checked when the action runs.
- **Unavailable**: the program is accepted but cannot run here, reported as `behavior-capability-unavailable` with the reason. This covers a missing module, a server without the NPC runtime, and a command without a grant.

On Folia, actions run on the region that owns the NPC; an NPC waiting for its chunk to load refuses them as unavailable. Messages, sounds, particles, choices and commands for a player another region owns are handed to that player's scheduler and not awaited, so a rejected player command is not reported there. `nearby` audiences include only players on the NPC's region, and `animus:has-permission` and looking at a player fail with `player-in-other-region` for a player on another region. See [Folia](/animus/15-folia).

### Text formatting

Everything an NPC says, every prompt and answer, combat greetings and warnings, build and shop messages, hologram lines and names use one formatter on every platform. It reads:

- `&` colour and style codes (`&a`, `&l`), `&#RRGGBB`, `&x&R&R&G&G&B&B` and Gloss's `[RRGGBB]` hex colours;
- section codes (`§a`) and backslash-u escapes such as `❤`;
- the MiniMessage tags the [chest GUI](/animus/11-guis-holograms-menus) reads: colour names (`<green>`), `<#RRGGBB>`, `<color:...>`, `<bold>`, `<italic>`, `<underlined>`, `<strikethrough>`, `<obfuscated>`, `<reset>` and their closing tags.

Unicode symbols such as `❤`, `⚔` and `✔` show as written. A speaker without its own colour is shown in Animus pink (`#FF5FA8`) and spoken text in white.

### Dialogue choices

Each answer is a bracketed button, `[ Yes ]`, with hover text. An option may set `color` (a name such as `green`, a code such as `a`, or `#RRGGBB`), `hover` (up to 256 characters; `\n` starts a new line) and `style` (`bold`, `italic`, `underlined` or `plain`). Without them, an answer whose id is `yes`, `accept`, `agree`, `ok`, `sure`, `confirm`, `hire`, `buy` or `deal` is green, an answer whose id is `no`, `pass`, `cancel`, `decline`, `leave`, `later`, `goodbye` or a similar word is red (when there is more than one answer), the rest take Animus pink, light pink, white, deep pink and grey in order, and the hover reads "Click to choose this answer".

```json
{"id": "rumours", "text": "Heard any rumours?", "color": "gold", "hover": "&7Ask what the regulars whisper about", "style": "bold"}
```

Each prompt has a random single-use token. A click runs `/animus choice <token> <option>`, which any player may send and which does nothing without a matching prompt. A click is rejected unless the token is live, it comes from the player who was asked, the option exists, the NPC is still spawned and the player is within 64 blocks. Every rejection shows the same message and publishes nothing. A rejected click from the wrong player, on an unknown option or from too far away leaves the prompt open for its rightful answer. A new prompt from the same NPC to the same player replaces the earlier one.

An accepted click starts any matching [`dialogue_choice` trigger](#automatic-triggers) with the clicking player, then fires `VirtualNpcDialogueChoiceEvent`. The NPC needs the behavior in its `behaviors` list, and the trigger's cooldown and queue limits apply. This pairs a question with its answer:

```json
"routines": {
  "main": {"type": "action", "capability": "animus:choices", "arguments": {"id": "greeting", "prompt": "Need directions?", "options": [{"id": "yes", "text": "Yes"}, {"id": "no", "text": "No"}]}},
  "directions": {"type": "action", "capability": "animus:say", "arguments": {"text": "The market is north."}}
},
"triggers": [{"id": "asked", "event": "dialogue_choice", "dialogue": "greeting", "choice": "yes", "routine": "directions"}]
```

### Commands

Commands are denied by default. A behavior can use `animus:command` only when its exact ID or its namespace is listed in `config.toml`. Each run logs the behavior ID, the NPC UUID, the sender and the command. Commands never run in a preview, and `/animus modules action` cannot reach them.

> Anyone who can edit an allow-listed behavior can run console commands. Grant as narrowly as you can.
{.is-warning}

```toml
[behaviors.actions]
actionsPerTick = 32
actionsPerNpcPerTick = 4
queuedActions = 256
pendingChoices = 256
choiceLifetimeSeconds = 60
commandBehaviors = ["town:gate/open"]
commandNamespaces = []
navigationWaits = 8
```

Accepted ranges are 1-256 actions per tick, 1-64 per NPC per tick and no more than the tick budget, 1-1,024 queued actions, 1-4,096 pending choices and a choice lifetime of 1-600 seconds. Each list holds at most 256 entries, and `navigationWaits` accepts 1-64. The values shown are the defaults, except the example `commandBehaviors` entry, which is empty by default. Changes apply when `config.toml` is saved. [Shops](/animus/10-shops) and [chest GUIs](/animus/11-guis-holograms-menus) that run commands use the same allow-list.

### Limits and previews

World and player work waits in a bounded queue and runs on the thread that owns the NPC. Past the per-tick or per-NPC budget, an action waits for a later tick. A full queue fails the action as `BUSY`, which ends that run. Waiting counts toward the module invocation deadline (`modules.invocationTimeoutMillis`), except for `animus:navigate` with `wait`, which has its own timeout. An action that misses the deadline fails its run and is dropped without running. Built-in capabilities are never suspended the way a misbehaving Java module is.

A preview run refuses `command`, `combat-control`, `build`, `navigate`, `stop-navigation`, `play-recording`, `resume-patrol`, `look`, `set-appearance`, `set-equipment`, `choices`, `open-shop`, `open-gui` and every flag or quest write. `say`, `play-sound` and `spawn-particle` work in a preview only for the viewer's own `trigger` audience. Conditions read normally.

## Packs

A pack keeps related behaviors together under `packs/<pack-id>/`:

```none
packs/town/
  pack.json
  behaviors/town/greeter.json
  behaviors/town/gate/open.json
```

A behavior in a pack follows the same rules as one under `behaviors/`: `town:greeter` lives at `packs/town/behaviors/town/greeter.json`, and its ID must match that path. An ID may live in one place only. The same ID in two packs, or in a pack and under `behaviors/`, selects no winner and both are unavailable. Moving a behavior from `behaviors/` into a pack, or between packs, keeps its ID and its stored state. The pack ID and its namespaces are separate names, so one pack can hold several namespaces.

```json
{
  "schemaVersion": 1,
  "id": "town",
  "name": "Town",
  "version": "1.2.0",
  "description": "Greeters and gate keepers for the town.",
  "modules": {
    "gatekeeper": {"required": true, "configuration": {"openTicks": 200}}
  }
}
```

`id` must match the directory name. `name`, `version` and `description` are for people. `modules` names the Java modules the pack uses; `required` is true unless set to false, and `configuration` is the module's own object, kept as written. Animus reads `pack.json` and never rewrites it.

`/animus behaviors reload` loads new, changed and removed packs without a restart, under the revision rules above. A pack directory without `pack.json` is reported as `pack-manifest-missing`, and an unreadable or mismatched one as `pack-manifest-invalid`. Neither loads new behaviors from that pack, while behaviors it had already accepted keep their last valid program.

When a required module is not installed or not active, every behavior in the pack stays accepted but is unavailable, reported as `pack-module-unavailable`, and its manifest, configuration, sources and stored state stay untouched. Installing the module and reloading makes them available again with no edits. An optional module only affects the behaviors that call its capabilities. Only `pack.json` and `behaviors/` are read; anything else in a pack, such as example NPC definitions, is left alone.

## Schemas and editor support

`/animus behaviors schema` writes generated files under `plugins/Animus/schemas/`:

| File | Contents |
| --- | --- |
| `behavior.schema.json` | JSON Schema 2020-12 for behavior documents, including every capability registered on the server, with its arguments. |
| `npc.schema.json` | NPC definitions and their built-in `modules` settings. |
| `pack.schema.json` | Pack manifests. |
| `completions.json` | Capability IDs with kind, description, whether they need an NPC (`reach`) and each argument's type, range, allowed values and whether it is required; trigger events with their fields, reach and the `context` keys of server events; node types; variable types, scopes and lifetimes; and the expression language: roots, facts, flag scopes and functions. |

The files come from the same registry the server validates with, so they list built-in capabilities and those of the Java modules loaded at the time. Run the command again after adding a module. Each file is limited to 2 MiB and the set to 4 MiB; a larger result is refused and nothing is written. The converter's `schema` command writes the same files with built-in capabilities only.

Point an editor at them by path. In Visual Studio Code, for example:

```json
"json.schemas": [
  {"fileMatch": ["**/behaviors/**/*.json"], "url": "./schemas/behavior.schema.json"},
  {"fileMatch": ["**/npcs/**/*.json"], "url": "./schemas/npc.schema.json"},
  {"fileMatch": ["**/packs/*/pack.json"], "url": "./schemas/pack.schema.json"}
]
```

The schema catches most mistakes as you type, and the compiler has the final word. Some rules need the whole document or a capability's own checks and are left to `/animus behaviors validate`: that `entry`, `call` and trigger routines exist, that `set` names a declared variable of a matching type, that expressions name declared variables and known facts, that `break`, `continue` and `return` sit where they may, that trigger IDs are unique, the characters of a flag or quest `name`, a command's leading slash and repeated choice option IDs. Arguments filled by `bindings`, `expressions` or `templates` are checked when the action runs.

`behavior.schema.json` also knows what `"server": true` changes: with it, a trigger must use a server event, a timer needs at least 20 ticks and variables may use only `execution`, `player` and `global` scopes; without it, triggers must use NPC events. In the web editor, expressions and templates are checked as you type against the same roots, facts and functions the server compiles, so a field that checks clean there compiles on the server.

Diagnostics say what a position accepts. A misspelled field lists the allowed fields and suggests the nearest one, such as `unsupported field for action; allowed: type, capability, arguments, bindings, expressions, templates; did you mean capability?`, and the same holds for node types, trigger events, routines, variables, argument names and capability IDs. Value problems name the expected type, range, choices or alternatives.

## Checking behaviors offline

The converter checks a directory without a server, using the same catalog, compiler and built-in capability checks:

```sh
converter validate-behaviors /path/to/Animus
converter validate-behaviors /path/to/packs/shop
converter schema /path/to/output
```

The directory may be a data folder, with `behaviors/`, `packs/` and `npcs/`, or a single pack. It only reads: no checkpoints, locks or state are written. It reports each problem with its file, code and field, checks NPC definitions under `npcs/` and in packs, and exits with status 1 when anything is invalid. It cannot check:

- Java module capabilities, their arguments and their triggers, since only built-in capabilities are known offline. Each one used is listed.
- Whether a pack's required modules are installed.
- The command allow-list, and platform rules such as which Folia region owns a player.
- Revisions against programs a server already accepted. A changed file there still needs a higher revision.
- Arguments filled from variables, expressions or templates.
- Worlds, coordinates, reusable routes, skins, permissions, sounds, particles, items and whether a player is present.

## Moving imported flags and assignments

Imported NPCs keep their Denizen flags, assignments and trigger records as preserved data. When the Denizen folder is beside the Citizens save, the import converts the scripts and flag values itself; see [Denizen](/animus/13-migrating-from-citizens#denizen). For what it keeps, or for logic you rewrite by hand, write a behavior and add it to the NPC's `behaviors` list. The concepts map like this:

| Imported | Behavior |
| --- | --- |
| Assignment script | A behavior document listed in the NPC's `behaviors`. |
| Click trigger | An `interaction` trigger. Damage, proximity and spawn triggers map to `damage`, `proximity` and `spawn`. |
| Chat trigger | `animus:choices` with a `dialogue_choice` trigger per answer. Free-typed chat has no equivalent. |
| `on assignment` | A routine run by a `spawn` trigger behind an NPC flag, so it runs once per NPC. |
| Player flag | `animus:set-flag` and `animus:flag-state` with `"scope": "player"`, or `flag('player', name, default)` and `has_flag('player', name)` in an expression. The value can be any JSON value, and `expireSeconds` makes it expire. |
| NPC flag | The same with `"scope": "npc"`. A flag about one player and one NPC uses `"scope": "relationship"`. |
| Server flag | The same with `"scope": "global"`. |
| Numbered quest step | `animus:set-quest-state`, `animus:advance-quest-state` and `animus:quest-state`. |
| Definitions and tags | Execution variables and expressions; tags in text are `{{ expression }}` holes. |
| `if`, `choose`, `foreach`, `while`, `repeat` | `condition` with an `expression`, `foreach`, `while` and `repeat`, with `break` and `continue`. |
| Task with definitions, procedure | `call` with `arguments` and `result`; the routine ends with `return`. |
| `world` and `command` scripts | A [server behavior](#server-behaviors) (`"server": true`) with server triggers such as `player_join`, `timer` and `command`. |
| `inventory` script | A [chest GUI](/animus/11-guis-holograms-menus) opened by `animus:open-gui`. |
| `narrate`, `announce` or `chat` | `animus:message`, or `animus:say` for the NPC speaking. |
| `execute` | `animus:command`, behind the allow-list. |
| Cancelling or changing an event with `determine`, and other commands with no action | No equivalent. |

The Denizen import copies every flag value, typed and with its expiry, into the `denizen` namespace; a hand-written behavior in another namespace starts from unset flags. Flags and quest stages belong to the behavior's namespace, so every behavior in that namespace shares them.

A click-and-answer dialogue:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "harbor:ferryman",
  "entry": "main",
  "routines": {
    "main": {"type": "sequence", "steps": [
      {"type": "action", "capability": "animus:look", "arguments": {"target": "player"}},
      {"type": "action", "capability": "animus:choices", "arguments": {
        "id": "ferry", "prompt": "Need a crossing?",
        "options": [{"id": "yes", "text": "Yes, please"}, {"id": "no", "text": "No, thanks"}]
      }}
    ]},
    "cross": {"type": "action", "capability": "animus:say", "arguments": {"text": "Climb aboard. We leave at dusk."}},
    "decline": {"type": "action", "capability": "animus:say", "arguments": {"text": "Suit yourself."}}
  },
  "triggers": [
    {"id": "click", "event": "interaction", "cooldownTicks": 40},
    {"id": "yes", "event": "dialogue_choice", "dialogue": "ferry", "choice": "yes", "routine": "cross"},
    {"id": "no", "event": "dialogue_choice", "dialogue": "ferry", "choice": "no", "routine": "decline"}
  ]
}
```

A quest whose step was a numbered player flag:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "harbor:nets",
  "entry": "main",
  "routines": {
    "main": {"type": "condition", "capability": "animus:quest-state", "arguments": {"name": "nets", "equals": 0},
      "then": {"type": "sequence", "steps": [
        {"type": "action", "capability": "animus:say", "arguments": {"text": "Bring me three nets from the shed, would you?"}},
        {"type": "action", "capability": "animus:set-quest-state", "arguments": {"name": "nets", "value": 1}}
      ]},
      "else": {"type": "condition", "capability": "animus:quest-state", "arguments": {"name": "nets", "atMost": 1},
        "then": {"type": "action", "capability": "animus:say", "arguments": {"text": "The shed is behind the inn."}},
        "else": {"type": "action", "capability": "animus:say", "arguments": {"text": "Thanks again for the nets."}}
      }
    }
  },
  "triggers": [{"id": "click", "event": "interaction"}]
}
```

Another behavior in the `harbor` namespace, such as the shed keeper's, can move the quest on with `{"type": "action", "capability": "animus:advance-quest-state", "arguments": {"name": "nets", "maximum": 2}}`.

Player, NPC and server flags with a permission check, as a gate keeper:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "harbor:gatekeeper",
  "entry": "main",
  "variables": {
    "greeting": {"type": "string", "initial": "Halt.", "scope": "npc", "lifetime": "persistent"}
  },
  "routines": {
    "main": {"type": "condition", "capability": "animus:flag-state", "arguments": {"name": "lockdown", "scope": "global"},
      "then": {"type": "action", "capability": "animus:say", "arguments": {"text": "The harbor is closed."}},
      "else": {"type": "condition", "capability": "animus:has-permission", "arguments": {"permission": "harbor.dock"},
        "then": {"type": "sequence", "steps": [
          {"type": "action", "capability": "animus:say", "arguments": {"text": null}, "bindings": {"/text": {"variable": "greeting"}}},
          {"type": "action", "capability": "animus:set-flag", "arguments": {"name": "visited-harbor"}},
          {"type": "action", "capability": "animus:set-flag", "arguments": {"name": "busy", "scope": "npc"}}
        ]},
        "else": {"type": "action", "capability": "animus:say", "arguments": {"text": "Dock workers only."}}
      }
    },
    "lock": {"type": "action", "capability": "animus:set-flag", "arguments": {"name": "lockdown", "scope": "global"}}
  },
  "triggers": [
    {"id": "click", "event": "interaction"},
    {"id": "hit", "event": "damage", "routine": "lock", "cooldownTicks": 200}
  ]
}
```

`visited-harbor` uses the default player scope, `busy` belongs to this NPC, and `lockdown` is shared by the whole `harbor` namespace. The NPC-scoped `greeting` variable holds this NPC's greeting text.

## Commands

All behavior commands need `animus.admin`:

| Command | Result |
| --- | --- |
| `/animus behaviors status` | Catalog state, running work, held calls, delivery counts and failures. |
| `/animus behaviors list [page]` | Up to 20 sources per page, with availability, accepted and observed revisions and accepted hashes. |
| `/animus behaviors validate [behavior-id]` | Scan and compile without replacing accepted programs or changing source files. With an ID, show only that behavior's problems. |
| `/animus behaviors reload` | Publish validated sources, including packs; an invalid edit keeps the previous accepted program. Rereads `server-behaviors.json`. |
| `/animus behaviors schema` | Write the generated [schemas and completions](#schemas-and-editor-support) under `schemas/`. |
| `/animus behaviors packs` | Each pack with its manifest state and any missing required modules. |
| `/animus behaviors run <npc-id> <behavior-id>` | Start a manual run against the NPC's current definition and the accepted program. Returns an execution UUID. |
| `/animus behaviors inspect <execution-uuid>` | Show an active or recently finished run: source identity, waits, diagnostics and recent steps. |
| `/animus behaviors trace <npc-id-or-uuid>` | Show each active run of that NPC, manual or trigger-started, with its origin, waits and last step, plus its last four finished runs. Use `inspect` for one run's full recent steps. A deleted NPC's UUID still works while its runs are retained. |
| `/animus behaviors cancel <execution-uuid>` | Cancel that run and its pending calls. |
| `/animus behaviors triggers [page]` | Trigger availability and totals, drop reasons, binding problems and up to 20 bindings with last fired, fired, active, queued, suppressed and dropped counts. [Server behavior](#server-behaviors) triggers follow the NPC triggers. |
| `/animus behaviors state status` | Stored and transient key counts against their budgets, documents waiting to be written, write failures, and each invalid stored file with its reason. |
| `/animus behaviors state purge behavior <behavior-id>` | Remove every variable of that behavior. |
| `/animus behaviors state purge npc <npc-id-or-uuid>` | Remove that NPC's `npc` and `relationship` variables across all behaviors. |
| `/animus behaviors state purge player <player-uuid>` | Remove that player's `player` and `relationship` variables across all behaviors. |
| `/animus behaviors state purge relationship <npc-id-or-uuid> <player-uuid>` | Remove the variables of that one pair. |
| `/animus behaviors state purge all confirm` | Remove all stored and transient variables, including invalid or unrecognized stored files. |

While a catalog scan is pending, further catalog commands report busy. A run started from the console carries no player. A run started by a player carries that player's UUID as the triggering player, which grants no extra authority.

### Manual runs

Each NPC allows one active manual run at a time, dormant NPCs included. Trigger-started runs are counted separately under their own budgets. A manual run is tied to the exact definition and program it started with: replacing, deleting or despawning the definition cancels it, and so does a reload of the NPC file even when nothing changed. An unchanged behavior keeps running across a catalog reload. Accepting a new revision of the behavior cancels runs of the earlier program, while a rejected edit leaves them running on the previous valid program.

Cancellation cannot undo an action that already happened or forcibly stop a running Java module call.

### State lifetime

Variables are never removed implicitly. Deleting or disabling a behavior, deleting an NPC, or losing a module leaves the state in place, so restoring the same behavior ID or NPC UUID finds it again. A cloned NPC gets a new UUID and no state. Removal happens only through `state purge`. A running behavior whose state is purged reads its `initial` values from then on and can write new ones.

### Traces

Each run keeps a fixed number of recent steps, set by `traceEntries`, and its report lists current waits, such as `condition:example:allowed@$.routines.main` or `tick:1200@$.routines.main.steps[1]`. Java plugins read the same views through `BehaviorRuntime.observe(uuid)` and `observeNpc(idOrUuid)`; see [Java modules and API](/animus/99-java-modules-api).

## Settings

These defaults live in `config.toml` and apply when the file is saved. A lowered cap never stops running work or drops queued work: new work waits, or is refused as busy, until usage falls below the new cap. A running execution keeps the step, lifetime, call-depth and trace budgets it started with. Stored state over a lowered state cap is kept, and only new keys or bytes are refused. With `enabled = false`, new runs and trigger events are refused while running executions finish. Changing a catalog limit reloads the catalog. Comments and unknown settings in the file are kept, and omitted values use the defaults.

```toml
[behaviors]
enabled = true
maximumOperations = 64
operationsPerTick = 8
tickMillis = 50
deliveryBudgetMillis = 250

[behaviors.engine]
executions = 64
fibers = 128
inFlight = 16
workPerTick = 256
totalSteps = 4096
lifetimeTicks = 20000
callDepth = 8
traceEntries = 64
historyEntries = 64

[behaviors.catalog]
maximumDocuments = 1024
maximumEntries = 4096
maximumDepth = 8
maximumDocumentBytes = 262144
maximumAggregateBytes = 16777216
maximumCapabilityChecks = 8192

[behaviors.server]
enabled = true
eventQueue = 512
eventsPerTick = 64
startsPerTick = 16
queuePerTrigger = 64
concurrentPerTrigger = 8
concurrentTotal = 32
defaultCooldownTicks = 0
minimumTimerTicks = 20
maximumCommands = 64

[behaviors.state]
maximumKeys = 65536
maximumTransientKeys = 65536
maximumValueBytes = 4096
maximumBytes = 16777216
flushMillis = 5000
```

`maximumKeys` and `maximumTransientKeys` cap the stored and transient variables that hold a written value, up to 1,048,576. `maximumValueBytes` caps one string value, up to 4,096 bytes. `maximumBytes` caps the size of each lifetime's values and names, up to 256 MiB. One behavior holds at most 128 keys per subject. A write over a budget fails that run with `behavior-state-key-budget`, `behavior-state-byte-budget` or `behavior-state-value-size` naming the variable, and writes nothing. Lowering a budget below existing data keeps the data: overwrites still work, and only growth is refused. `flushMillis` is the longest a changed value waits in memory before it is written, from 100 to 300,000.

Wait durations count behavior ticks of `tickMillis` each, not world ticks. A busy server can make a wait last longer in real time.
