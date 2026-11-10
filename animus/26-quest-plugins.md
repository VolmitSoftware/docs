---
title: "Animus: Quest plugins"
description: "Animus NPCs in Quests, BeautyQuests and BetonQuest, and relinking quests made for Citizens NPCs"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, quests, beautyquests, betonquest, citizens, migration, integration"
editor: markdown
dateCreated: 2026-11-09T00:00:00.000Z
---

Animus NPCs work in three quest plugins: they give quests, start conversations, and count as talk, delivery and kill targets. Install the quest plugin beside Animus and start the server; each integration starts on its own when its plugin is installed, and Animus runs the same without them. None of them needs Citizens. For quests written as Animus documents, without another plugin, see [quests](/animus/38-quests).

| Plugin | Versions | Servers | What works with Animus NPCs |
|---|---|---|---|
| [Quests](https://www.spigotmc.org/resources/quests.3711/) by PikaMug | 5.3 | Paper and Spigot | Quest givers, talk, delivery and kill objectives, quest markers |
| [BeautyQuests](https://github.com/SkytAsul/BeautyQuests) | 2.2 | Paper | Starter NPCs, quest pools, talk, item and kill stages |
| BetonQuest | 3.0 or newer | Paper | The `animus` NPC type, `npc_conversations`, `npcinteract`, `npcrange`, `npcdistance`, `npclocation`, `npcteleport`, `hide_npcs`, NPC holograms and the `animusnpckill` objective |

Animus logs `Linked Quests` or `Linked BeautyQuests` when it joins those two. Another plugin also called Quests, by LMBishop, is not linked.

A Citizens server keeps its quests when it switches: see [after a Citizens import](#after-a-citizens-import).

## How quest plugins see Animus NPCs

- A right click on an NPC is a right click in the quest plugin, and a left click is a left click. Sneaking turns them into the shift clicks BeautyQuests can tell apart.
- The NPC's name in quest messages is its display name without colors.
- Quest markers and distance checks use where the NPC stands, or its saved position while it is despawned.
- A kill objective counts when a player kills the NPC, with a hit or a projectile, for the player who struck the last blow. Only an NPC with a killable [health module](/animus/08-combat#health-and-death) can die, for example after `/animus npc health bandit killable on`.
- A despawned NPC still exists for the quest plugin, so quests that name it keep loading.
- When a quest plugin takes a click, for example to start a quest or a conversation, the NPC's own [interaction triggers](/animus/07-behaviors), shop or GUI do not also run for that click.
- Reloading Animus with a plugin manager links it to the quest plugins again, with the same NPCs. A quest plugin reloaded on its own is linked again only after a server restart or an Animus reload.

## Quests

<div class="animus-demo">
<p><strong>Quests plugin on Animus NPCs</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/41-quests-plugin-ingame.webm" aria-label="Completing a Quests plugin quest given and finished on Animus NPCs" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Quests names NPCs by UUID. An Animus NPC's UUID is the `uuid` in its [definition](/animus/04-npc-definitions), and an NPC imported from Citizens keeps the UUID it had there.

Quests and Animus both have a `/quests` command, and Quests keeps it. Players open the Animus [journal](/animus/38-quests#taking-a-quest) with `/questlog` or `/animus:quests` instead.

| Quests setting | Works with Animus NPCs |
|---|---|
| NPC to start the quest (`npc-giver-uuid`) | Yes |
| Talk to NPCs (`npc-uuids-to-talk-to`) | Yes |
| Deliver items to NPCs (`npc-delivery-uuids`) | Yes; the player clicks the NPC holding the items |
| Kill NPCs (`npc-uuids-to-kill`) | Yes |
| Quest markers above giver NPCs (`npc-effects` in `config.yml`) | Yes |
| Ride NPC condition (`ride-npc-uuid`) | No; riding an Animus NPC does not count as riding an entity |

In the in-game quest editor, choose a click option for an NPC prompt and click the Animus NPC; the editor stores its UUID. A quest file can also name it directly:

```yaml
quests:
  bread:
    name: Bread Run
    ask-message: Bring the baker some bread.
    finish-message: Thank you.
    npc-giver-uuid: 263febba-40d5-44cb-bbc8-ee0d9c51658f
    stages:
      ordered:
        '1':
          items-to-deliver:
          - ==: org.bukkit.inventory.ItemStack
            type: BREAD
          npc-delivery-uuids:
          - 263febba-40d5-44cb-bbc8-ee0d9c51658f
          delivery-messages:
          - Thanks, that smells good.
```

## BeautyQuests

Animus adds an NPC source named `animus` to BeautyQuests, so an Animus NPC is saved as `animus#<npc id>`, such as `animus#baker`. When BeautyQuests asks for an NPC, click the Animus NPC.

| BeautyQuests feature | Works with Animus NPCs |
|---|---|
| Starter NPC of a quest, and NPC of a quest pool | Yes |
| Talk to an NPC stage, with its dialog | Yes |
| Bring back items stage | Yes |
| Kill mobs stage | Yes; choose **Animus NPC** in the mob list, then click the NPC |
| Particles and holograms above quest NPCs | No; BeautyQuests draws them only over server entities |
| Creating an NPC from the BeautyQuests menu | No; make the NPC with Animus, then pick it |

BeautyQuests cancels the clicks it answers. Add `dont cancel npc click: true` to BeautyQuests' `config.yml` to let the NPC's own behaviors, shop or GUI run as well.

## BetonQuest

<div class="animus-demo">
<p><strong>BetonQuest on an imported NPC</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/42-betonquest-ingame.webm" aria-label="Relinking a BetonQuest package to an imported NPC" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

Name an Animus NPC in a package's `npcs` section with the `animus` type and the NPC id:

```yaml
npcs:
  innkeeper: "animus innkeeper"
  guards: "animus Guard byName"
npc_conversations:
  innkeeper: innTalk
```

`animus <id>` is one NPC. `animus <name> byName` is every NPC whose display name matches, ignoring case and colors. BetonQuest then uses the key on the left everywhere it takes an NPC, such as `npcinteract innkeeper` or `npcdistance innkeeper 5`.

A right click on the NPC starts its `npc_conversations` conversation and counts for `npcinteract`. A left click counts when BetonQuest's `npc.accept_left_click` setting is on.

`npcteleport` saves the NPC's new position, as `/animus npc move` does. `hide_npcs` hides an NPC from one player at a time: that player neither sees it nor fires its triggers, and everyone else still does.

BetonQuest's `npckill` objective counts Citizens NPCs only. Use `animusnpckill` for Animus NPCs:

```yaml
objectives:
  killBandit: "animusnpckill bandit amount:3 actions:reward"
```

## After a Citizens import

Quest files written while the server ran Citizens name Citizens NPCs. After a [Citizens import](/animus/13-migrating-from-citizens), point them at the imported NPCs, one plugin at a time:

```none
/animus import quests preview
/animus import quests apply
```

The command for each plugin is `import quests`, `import beautyquests` or `import betonquest`, and each shows in help and completion only while its plugin runs.

`preview` lists each reference it would change and changes nothing. `apply` keeps a copy of every file it changes under `plugins/Animus/imports/links/<plugin>/originals/` and then rewrites only the lines that name a Citizens NPC; comments and every other line stay as they were. Each step writes its full list to `plugins/Animus/imports/links/<plugin>/report.json`. Afterwards, restart the server or reload the plugin: `/questadmin reload`, `/beautyquests reload data` or `/betonquest reload`. BeautyQuests and BetonQuest both use `/bq` as a short alias, so on a server with both, write the full command names.

| Plugin | Changes | Left alone |
|---|---|---|
| Quests | `npc-giver-id`, `npc-ids-to-talk-to`, `npc-delivery-ids`, `npc-ids-to-kill` and `ride-npc` (Citizens ids) become the same key with `uuid` in place of `id`, holding the imported NPC's UUID | The UUID keys, since an imported NPC keeps its Citizens UUID |
| BeautyQuests | `citizens#7`, or a bare `7` from older versions, in `npcID`, `starterNPC` and `starterID` becomes `animus#citizens-7`; a kill target `factoryName: citizensNPC` with `value: '7'` becomes `factoryName: animusNPC` with `value: citizens-7` | |
| BetonQuest | `citizens <number>` in `npcs` becomes `animus citizens-<number>`; `citizens <name> byName` becomes `animus <name> byName`; `npckill` on a relinked NPC becomes `animusnpckill` | `npcs` written on one line, `npcmove` and `npcstop` |

Animus reads these files:

- Quests: `plugins/Quests/storage/quests.yml` and `plugins/Quests/storage/conditions.yml`, and `quests.yml` and `conditions.yml` directly in `plugins/Quests/`
- BeautyQuests: `plugins/BeautyQuests/questPools.yml` and every `.yml` file under `plugins/BeautyQuests/quests/`
- BetonQuest: every `.yml` file under `plugins/BetonQuest/QuestPackages/`

A reference to a Citizens NPC that was not imported stays as it was and is reported. `apply` refuses to run again until the previous relink is rolled back; to link an NPC imported later, roll back and apply again.

### Rolling back

```none
/animus import quests rollback
```

Rollback puts back every file as it was before `apply`, from the copies in `originals/`. A file edited since stops the rollback: it names the file, restores nothing, and leaves the copies in `originals/` for you to merge by hand. When you [roll back the Citizens import](/animus/13-migrating-from-citizens#rolling-back) to return to Citizens, roll the quest links back too, so the quest files name Citizens NPCs again.
