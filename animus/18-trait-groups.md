---
title: "Animus: Trait Groups"
description: "Shared settings that many NPCs take from one file, with merge rules, commands and the Citizens import option"
published: true
date: 2026-11-10T00:00:00.000Z
tags: "animus, npcs, groups, definitions, citizens"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

A trait group is a file of [definition](/animus/04-npc-definitions) values that several NPCs share. Each NPC lists the groups it takes, and its own fields still win. Change the group file and every NPC that lists it changes with it.

## Group file

Groups live at `groups/<id>.json` in the Animus data folder (`plugins/Animus/` on Bukkit, `config/animus/` on [mod servers](/animus/16-mod-servers)).

```json
{
  "schemaVersion": 2,
  "revision": 1,
  "id": "town-guards",
  "description": "Watch uniform, look-close and the route",
  "values": {
    "modules": {
      "animus:look-close": {"range": 12},
      "animus:navigation": {"enabled": true, "route": "town-walk"}
    },
    "behaviors": ["town:greeting"],
    "equipment": {"head": {"id": "minecraft:iron_helmet"}},
    "nameplate": {"visible": true},
    "teamColor": "gold",
    "skins": ["<sha256>", "<sha256>"]
  }
}
```

| Field | Required | Accepted values |
|---|---|---|
| `schemaVersion` | Yes | `2`. |
| `revision` | Yes | Integer of at least 1. |
| `id` | Yes | 1-64 lowercase letters, digits, `_` or `-`, starting with a letter or digit. Matches the file name. |
| `description` | No | At most 256 characters. Shown by `/animus groups list`. |
| `values` | Yes | Any definition field except the identity and state fields listed below, plus `skins`. For example `modules`, `behaviors`, `tags`, `equipment`, `inventory`, `hologram`, `nameplate`, `pose`, `poses`, `movement`, `rig`, `armorStand`, `horse`, `llama`, `glowing`, `teamColor`, `baby`, `usingItem`, `listed`, `gravity`, `attributes` and `skin`. |
| `values.skins` | No | 1-64 skin hashes. Each NPC takes one of them, chosen from its UUID, so the same NPC always gets the same skin. |

Identity and state fields are refused inside `values`: `schemaVersion`, `revision`, `uuid`, `id`, `group`, `name`, `type`, `spawned`, `position`, `owner`, `migration` and `groups`, for example `$.values.name: not allowed in a group`. A group cannot list other groups. Values are checked with the same rules as an NPC, so a bad item fails the group file, as in `$.values.equipment.head.count: expected integer 1..99`. A group file is at most 256 KiB.

## Listing groups on an NPC

```json
"groups": ["town-guards", "harbor"]
```

An NPC lists 1-16 group ids, without repeats. Each must name an existing group file: creating or editing an NPC that names a missing group is refused with `$.groups[0]: unknown group town-guards`.

## Merge rules

The definition an NPC runs with, its effective definition, is built from its groups in list order, then its own fields:

- Objects merge key by key, at every depth. An NPC that sets `"modules": {"animus:look-close": {"range": 6}}` changes only `range` and keeps the rest of the group's look-close settings.
- `attributes` merge attribute by attribute, and `minecraft:scale` counts as `scale`, so a group may set `scale` and an NPC change only `movement_speed`. The web editor's effective view names the source of each attribute.
- `behaviors` and `tags` append in order, without duplicates.
- Every other array and every plain value replaces. Later groups win over earlier ones, and the NPC wins over every group.
- A `skins` pool sets the NPC's `skin`, unless the NPC sets `skin` itself.

There is no way to remove a group key from one NPC. Set an explicit value instead, such as `{"enabled": false}`.

The effective definition is checked as a whole. A combination that is invalid, such as a group's armor stand settings on a player body, is refused with the usual field error. The file you edit stays the NPC's own definition; groups never write into it.

## Live edits and missing groups

Saving a group file applies it within about a second, like any [hand edit](/animus/04-npc-definitions#hand-edits-apply-live), and every NPC that lists it is rebuilt with its new values. An invalid group edit is refused with its field error and the last valid version stays in use.

When a group file is deleted, or a group edit makes some NPC's combination invalid, those NPCs keep their last valid effective definition. `/animus inspect` shows `group problem:` with the reason, `/animus status` counts them among the file problems, and the server log reports each problem once. Restore the group or remove it from the NPCs to clear it.

## Inspecting

`/animus inspect <id>` lists the NPC's groups on its first line. **[JSON]** copies the NPC's own JSON and **[Merged]** the effective JSON. **[Details]** on the second line says where each field came from:

```none
behaviors from npc
equipment from town-guards
modules.animus:look-close from harbor
teamColor from harbor
```

## Commands

All of these need `animus.npc.edit`, which `animus.admin` grants; see [commands](/animus/02-commands-permissions#trait-groups) for the full list. The two that change NPCs:

```none
/animus groups assign <group> [folder=] [tag=] [ids=]
/animus groups unassign <group> [folder=] [tag=] [ids=]
```

`assign` adds the trait group to the end of each matching NPC's `groups`. `unassign` removes it; an NPC left with no trait groups loses the field.

Give assign and unassign exactly one of `folder=<npc-folder>`, which matches the NPC folder under `npcs/`, `tag=<tag>`, an effective tag, or `ids=a,b`, a comma-separated list of NPC ids in which `@selected` is your selected NPC. Assign and unassign save every matching NPC as one change with one rollback transaction, and refuse the whole change if any result is invalid. The reply reads `Assigned watch to 12 NPCs, 3 unchanged; tx <id>`. A trait group saved a moment ago is known once its [live apply](/animus/03-configuration#live-apply) line appears.

```none
/animus groups assign town-guards folder=world/town
/animus groups unassign town-guards ids=@selected,smith
```

## Citizens import

Add `factor-groups=true` to the import preview, or `--factor-groups` to the converter's `preview`:

```none
/animus import citizens preview factor-groups=true
converter preview /path/to/saves.yml /path/to/Animus --factor-groups
```

After conversion, every set of two or more NPCs whose `modules` (apart from `citizens:review`), `behaviors`, `equipment`, `hologram`, `nameplate`, `pose`, `movement`, `glowing` and `teamColor` are identical becomes one group, `groups/citizens-<8 hex>.json`. Those fields move out of the member NPCs, which list the group instead, so each NPC still runs exactly what conversion made. The preview lists each group with its member count. Accepting a review category also accepts it in these groups, and rollback removes them with the rest of the import. Without the option nothing changes. See [migrating from Citizens](/animus/13-migrating-from-citizens).

## Web editor

<div class="animus-demo">
<p><strong>Trait groups</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/04-trait-groups-editor.webm" aria-label="Creating a trait group and assigning it to three NPCs" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The [web editor](/animus/14-web-editor) edits group files in the same parts as an NPC, with the same checks as a saved file. An NPC's Effective part shows its effective definition with the source of each value, and the NPC browser assigns and unassigns a group by selection, folder or tag as one change. An NPC saved from the editor with a missing group is refused.

## In game

<div class="animus-demo">
<p><strong>Trait groups</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/14-trait-groups-ingame.webm" aria-label="Assigning a trait group and making a new one" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The [toolkit](/animus/21-in-game-toolkit#trait-groups) creates, renames, describes and deletes groups from a chest window, and assigns them to the wand selection. A rename repoints every member and a delete unassigns every member, each in the same transaction as the group file, so one **[Undo]** reverts both.
