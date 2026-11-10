---
title: "Animus: Quests"
description: "Built-in quests with givers, stages, objectives, rewards, a journal and behavior hooks"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, quests, npc, behaviors, journal"
editor: markdown
dateCreated: 2026-11-09T00:00:00.000Z
---

Animus has a small quest system for servers without a quest plugin. A quest is a JSON file: NPCs that offer it, ordered stages of objectives, and rewards. Players accept it from the giver's chat buttons, follow it in the `/quests` journal, and turn it in for the reward. Behaviors read and move the same quest stages, and react when a quest starts, moves on or completes.

Quest files live in `plugins/Animus/quests/` (`config/animus/quests/` on mod servers). A file at `town/herbs.json` has the id `town:herbs`, and its `id` field must say so. Quest names use lowercase letters, digits, `_` and `-`, without folders below the namespace.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "town:herbs",
  "title": "&aHerbs for the healer",
  "description": "The healer is out of wheat for her poultices, and zombies keep trampling the fields.",
  "icon": {"id": "minecraft:wheat"},
  "givers": ["healer"],
  "turnIn": "healer",
  "repeat": {"mode": "daily"},
  "stages": [
    {
      "description": "Ask the farmer where the wheat went.",
      "objectives": [
        {"type": "talk", "npc": "farmer", "description": "Talk to the farmer"}
      ]
    },
    {
      "description": "Bring wheat to the healer and clear the fields.",
      "order": "any",
      "objectives": [
        {"type": "bring", "npc": "healer", "item": {"id": "minecraft:wheat"}, "amount": 3},
        {"type": "kill", "entity": "minecraft:zombie", "amount": 2}
      ]
    }
  ],
  "rewards": {
    "items": [{"item": {"id": "minecraft:bread"}, "amount": 5}],
    "experience": 50,
    "money": 25,
    "flags": [{"name": "helped_healer"}]
  },
  "messages": {
    "offer": "Could you help me with the harvest?",
    "complete": "Thank you, {player}. The village is in your debt."
  }
}
```

`givers` and `turnIn` name NPCs by id, as in `/animus list`. The quest loads even when an NPC does not exist yet; it starts working once the NPC is created.

## Taking a quest

<div class="animus-demo">
<p><strong>Native quest</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/36-native-quest-ingame.webm" aria-label="Taking a quest from the Healer, completing its talk, wheat and fight objectives, turning it in and seeing it finished in the journal" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

An NPC with a quest the player can take shows a yellow `!` above its head to that player. Right-clicking it says the quest's title, the giver speaks the `offer` message (or the description), and **[ Accept ]** and **[ Decline ]** buttons follow, in the same style as [dialogue choices](/animus/07-behaviors#dialogue-choices). The buttons work for two minutes. A giver with several quests offers the first one the player can take, by id.

Once a quest is active, the chat lists the stage and its objectives, and each counted objective shows its progress on the action bar. A gold `?` marks every NPC the player should talk to, bring items to, or turn the quest in at. Markers show for NPCs within 48 blocks.

A right-click on an NPC goes to quests first when the NPC has something for the player: an objective, a turn-in or an offer. Otherwise the click goes on to the NPC's shop or GUI, so a quest giver can also be a shopkeeper. A sneaking player with `animus.admin` selects the NPC instead.

When the last stage is done, a quest with `turnIn` waits until the player right-clicks that NPC; one without `turnIn` completes at once. Completion pays the rewards and says the `complete` message.

`/quests` opens the journal: a chest window with the player's active quests, their current stage and objective counts, and a **Finished** tab with each finished quest and when a repeatable one comes back.

## Quest fields

| Field | Meaning |
|---|---|
| `schemaVersion` | Always 1. |
| `revision` | Raise it with every edit. Editor applies do it for you. |
| `id` | `namespace:name`, matching the file. |
| `title` | Shown in the offer, messages and journal; `&` codes and MiniMessage. |
| `description` | Offer text and journal lore. |
| `icon` | Journal icon, an item such as `{"id": "minecraft:wheat"}`. Defaults to a writable book. |
| `givers` | Up to 16 NPC ids that offer the quest. Without givers, only a command or a behavior starts it. |
| `turnIn` | The NPC to return to after the last stage. |
| `requirements` | What a player needs before a giver offers it; see below. |
| `repeat` | `{"mode": "never"}` (default), `{"mode": "cooldown", "seconds": 3600}`, or `{"mode": "daily"}`, which allows the quest again after the server's local midnight. |
| `stages` | 1 to 32 stages, done in order. |
| `rewards` | What completion pays; see below. |
| `messages` | `offer`, `accept`, `decline` and `complete`, each replacing the default line. `{player}` becomes the player's name and `{quest}` the title. |

`requirements` takes any of:

| Field | Meaning |
|---|---|
| `permission` | A permission node the player must hold. |
| `quests` | Quest ids the player must have finished at least once. |
| `condition` | A [behavior expression](/animus/07-behaviors#expressions) that must be true, such as `flag('player', 'helped_mayor')` or `quest('player', 'intro') >= 2`. Flags and quests are those of the quest's namespace; `context.quest` is the quest id. |

## Stages and objectives

<div class="animus-demo">
<p><strong>Quest editor</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/11-quest-editor-editor.webm" aria-label="Making a quest with stages and objectives in the web editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A stage has a `description`, its `objectives` (1 to 16), and an `order`: `any` (default) counts every objective at once, `ordered` counts them one after another. Each objective has a `type`, an optional `id` (unique in the stage) and an optional `description` for the journal; without one, Animus writes a line such as `Bring 3 wheat to Healer`.

| `type` | Fields | Done when |
|---|---|---|
| `talk` | `npc` | The player right-clicks the NPC. |
| `bring` | `npc`, `item`, `amount` | The player right-clicks the NPC with the items. Animus takes what the player carries, up to what is still missing, so the items can come in several trips. |
| `kill` | `entity` or `npc`, `amount` | The player kills that many mobs of the entity type, such as `minecraft:zombie`. With `npc`, the player defeats that NPC, which must be [killable](/animus/08-combat#health-and-death). |
| `reach` | `world`, `x`, `y`, `z`, `radius` (1 to 256, default 3) | The player stands within the radius. Checked every half second. |
| `collect` | `item`, `amount` | The player holds that many items. Nothing is taken, and the count follows the inventory until the stage is done. |
| `custom` | `id`, `amount` | A behavior's `animus:quest-objective` action or `/animus quest objective` adds to it. |

`amount` defaults to 1. An `item` is `{"id": "minecraft:wheat"}` with an optional `components` string in command syntax; without `components` any item of that id counts, with it the item must match exactly.

## Rewards

<div class="animus-demo">
<p><strong>Quest rewards and apply</strong> Browser editor.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/editor/12-quest-rewards-apply-editor.webm" aria-label="Setting quest rewards and applying the quest to a paired server" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

| Field | Paid |
|---|---|
| `items` | Up to 27 `{"item": {...}, "amount": n}` entries. What does not fit in the inventory drops at the player's feet. |
| `money` | Through the server economy, as [shop prices](/animus/10-shops#money) are: Vault on Paper and Spigot. With no economy the money is skipped and the server log says so. |
| `experience` | Experience points. |
| `commands` | Up to 16 `{"command": "...", "as": "console"}` entries, without the slash; `as` is `console` (default) or `player`, and `{player}` becomes the player's name. A quest with commands loads only when its id or namespace is on the command allow-list under `[behaviors.actions]` in `config.toml`, as with shops. |
| `flags` | Up to 16 `{"name": "...", "value": true, "scope": "player"}` entries, set as [behavior flags](/animus/07-behaviors#flags-and-quests) of the quest's namespace. `value` defaults to true and `scope` (`player` or `global`) to `player`. |

## Behaviors

A quest's stage is behavior quest state. The quest `town:herbs` is the quest `herbs` of the `town` namespace for each player, so any `town` behavior reads it with `quest('player', 'herbs')` and the `animus:quest-state` condition. The value is 0 before the quest starts, 1 to N while stage 1 to N is active, and N + 1 once it is finished. A behavior that writes the value with `animus:set-quest-state` moves the quest: 0 abandons it, 1 to N moves it to that stage with fresh counts, and N + 1 completes it with its rewards.

| Hook | Use |
|---|---|
| `quest_started`, `quest_stage`, `quest_completed` | Server behavior triggers, with an optional `quest` filter. Runs read `context.quest`, `context.stage` and `context.title`. |
| `animus:start-quest`, `animus:advance-quest`, `animus:complete-quest` | Start, move on or complete a quest for the triggering player, with messages, rewards and triggers. |
| `animus:quest-objective` | Count a `custom` objective. |
| `animus:quest-status` | True when the player's quest is `none`, `active`, `ready` or `finished`. |

See [built-in capabilities](/animus/07-behaviors#built-in-capabilities) for their arguments. A [server behavior](/animus/07-behaviors#server-behaviors) that shows a title when a player finishes the quest, once it is listed in `server-behaviors.json`:

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "id": "town:herbs-done",
  "server": true,
  "entry": "main",
  "routines": {
    "main": {"type": "action", "capability": "animus:title", "arguments": {"title": "&aThe healer thanks you"}}
  },
  "triggers": [{"id": "done", "event": "quest_completed", "quest": "town:herbs"}]
}
```

## Commands and permissions

Players need `animus.quests.use`, which everyone has by default, to take quests and open `/quests`. Staff commands under `/animus quest` need `animus.quests`, which `animus.admin` grants:

```none
/animus quest list
/animus quest progress <player>
/animus quest start <quest> [player=] [force=false]
/animus quest stage <quest> [stage=] [player=]
/animus quest complete <quest> [player=] [rewards=true]
/animus quest reset <player> [quest=all]
```

See [commands](/animus/02-commands-permissions#quests) for the full list. With [live apply](/animus/03-configuration#live-apply) on, a changed quest file reloads by itself; otherwise run `/animus quest reload`.

## Storage and platforms

Each player's quests are saved in `plugins/Animus/state/quests/<uuid>.json` two seconds after a change and at shutdown, so progress survives restarts. A damaged file is set aside as `<name>.bad-<time>`, and that player starts without quests. Stage values live in behavior state with the rest of the namespace's quests. `/animus quest reset` clears both.

Quests run the same on Paper, Spigot, Folia and the mod loaders. On Folia, quest work runs on the player's region, and a kill counts on the killer's region. On mod servers, use `/animus quest journal` for the journal; the economy is the one a [Java module](/animus/99-java-modules-api) provides, and NPC kill objectives do not count.

The [web editor](/animus/14-web-editor) edits quests as the Quest document type.
