---
title: "Animus: MythicMobs"
description: "NPCs made from Mythic mob types, their mob skills, the mythic:cast-skill action and Animus NPCs in Mythic skill files"
published: true
date: 2026-11-10T00:00:00.000Z
tags: "animus, mythicmobs, mythic, skills, integration, citizens"
editor: markdown
dateCreated: 2026-11-09T00:00:00.000Z
---

With [MythicMobs](https://mythiccraft.io) 5 installed on a Paper, Spigot or Folia server, an NPC can take its look from a Mythic mob type, run that mob's skills on its own events, and cast any Mythic skill from a [behavior](/animus/07-behaviors). Mythic skill files can aim at Animus NPCs too. The free and premium MythicMobs builds both work. Without MythicMobs, Animus runs as usual and keeps the `mythic:mob` module as written.

## Making an NPC from a mob

<div class="animus-demo">
<p><strong>Mythic mob with a Model Engine model</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/32-mythic-model-ingame.webm" aria-label="Making an NPC from a MythicMobs mob that shows its Model Engine model" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```
/animus mythic king SkeletonKing
```

`/animus mythic <id> <mythic-mob>` takes the same values as `create`, such as `folder`, `x y z` or `spawned=false`. Tab completion lists the loaded mob types. The command shows in help and completion only while MythicMobs runs. The new NPC takes these from the mob file:

| Mob field | Becomes |
|---|---|
| `Type` | The body type, such as `minecraft:skeleton` for `SKELETON`. A type the server cannot show becomes a `minecraft:player` body, and the reply says so. |
| `Display` | The NPC's name, unless the command gives `name=`. |
| `Equipment` | The NPC's [equipment](/animus/04-npc-definitions#appearance-text-and-inventory). Both `GOLDEN_HELMET HEAD` and `GOLDEN_HELMET:4` slot forms work, and a Mythic item keeps its name, lore and other components. A slot the body cannot show is left out and reported. |
| `Options.Glowing` | `"glowing": true`. |
| `Options.Baby`, `Options.Adult: false`, a negative `Options.Age`, or a `BABY_` type | `"baby": true` on a body that has a baby form. |
| `Disguise` | The NPC's [`disguise`](/animus/34-libsdisguises), drawn while LibsDisguises is installed. `player:Notch` is written as `player Notch`. |
| A `model{mid=...}` skill | The `animus:modelengine` module with that `model`, so the NPC shows the Model Engine model. |
| The mob type itself | The `mythic:mob` module below. |

The look is copied once. Afterwards the NPC's own fields can change freely, and a later edit to the Mythic mob file does not change them. `/animus mythic` refuses a mob type MythicMobs has not loaded, naming it.

## The mythic:mob module

```json
"modules": {
  "mythic:mob": {"mob": "SkeletonKing"}
}
```

| Field | Default | Meaning |
|---|---|---|
| `mob` | required | The Mythic mob type whose skills the NPC runs: 1 to 64 letters, digits, `_`, `.` or `-`. |
| `enabled` | `true` | `false` keeps the module but runs none of the mob's skills. |

`/animus mythic` writes this module. In the [web editor](/animus/14-web-editor) it appears under the NPC's **Modules**, and while the server reports MythicMobs, **Add a known module** adds it to any NPC.

## Mob skills on NPC events

<div class="animus-demo">
<p><strong>Mythic skills on an NPC</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/33-mythic-skills-ingame.webm" aria-label="A Skeleton King NPC running its Mythic timer, click and damage skills" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

While the module is enabled and the NPC is spawned, the mob's own skills run on the matching NPC events:

| Mythic trigger | Runs when | Trigger entity |
|---|---|---|
| `~onSpawn` | The NPC becomes active: spawned, loaded or respawned | None |
| `~onInteract` | A player right-clicks the NPC | The player |
| `~onDamaged` | A player left-clicks the NPC | The player |
| `~onAttack` | The NPC hits an entity in [combat](/animus/08-combat) | The entity hit |
| `~onDeath` | The NPC's health reaches zero | The killer, when it is a loaded entity |
| `~onTimer:<ticks>` | Every that many ticks while the NPC is spawned. An edit that binds, changes or removes the mob starts, changes or stops the timers without a respawn. | None |

The NPC is the skill's caster, standing where the NPC stands. `@trigger`, `@PlayersInRadius`, `@origin` and the other location and area targeters work from there. `<caster.name>` is the NPC's name, and skill cooldowns count per NPC. An NPC has no Minecraft entity, so mechanics aimed at `@self`, such as a potion or damage on the caster, do nothing.

## The mythic:cast-skill action

`mythic:cast-skill` casts any Mythic skill from a behavior:

```json
{"type": "action", "capability": "mythic:cast-skill", "arguments": {"skill": "BlessingSkill"}}
```

| Argument | Default | Meaning |
|---|---|---|
| `skill` | required | A Mythic skill name, 1 to 128 characters. A behavior naming a skill MythicMobs has not loaded is refused when it loads. |
| `caster` | `npc` | `npc` casts from where the NPC stands, with the NPC as caster and the triggering player as trigger and target. `player` casts it as the triggering player, as `/mm test cast` does, without that command's permission. |
| `power` | `1` | Skill power, 0.01 to 100. |

The action reports `cast`: `false` when the skill's own conditions or cooldown stopped it. A despawned NPC, or `caster: player` without an online triggering player, fails the action. A [preview](/animus/07-behaviors) casts nothing. The action is available while MythicMobs is enabled. A skill can run commands, so the action runs only in behaviors on the command allow list, as `animus:command` does: list the behavior in `commandBehaviors`, or its namespace in `commandNamespaces`, under `[behaviors.actions]` in `config.toml`.

## Animus NPCs in Mythic skill files

| Name | Kind | Meaning |
|---|---|---|
| `@AnimusNPC{npc=king}` | Targeter | Where the NPC with id `king` stands now. Nothing while it is despawned. |
| `animusnpc{npc=king}` | Condition | The skill's caster is the NPC with id `king`. Without `npc`, any Animus NPC. |

Both also take the NPC id as `id=` or `n=`, such as `@AnimusNPC{n=king}`.

```yaml
KingAura:
  Conditions:
  - animusnpc{npc=king} true
  Skills:
  - effect:particles{p=flame;a=20} @AnimusNPC{npc=king}
```

Mythic mobs never target Animus NPCs with entity targeters, since NPCs are not entities.

## Citizens NPCs that cast Mythic skills

A Citizens command that casts a Mythic skill as the clicking player, `mm test cast <skill>` with `player: true` or `op: true`, imports as `mythic:cast-skill` with `"caster": "player"`, and the import report says so. Like command behaviors, these casts stay denied until the behavior is on the command allow list. The same command run from the console stays an `animus:command`. See [migrating from Citizens](/animus/13-migrating-from-citizens#commands).
