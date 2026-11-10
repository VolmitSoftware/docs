---
title: "Animus: Model Engine"
description: "Show Model Engine models on NPCs, map NPC states to model animations and import modelled Citizens NPCs"
published: true
date: 2026-11-09T00:00:00.000Z
tags: "animus, modelengine, models, animations, integration"
editor: markdown
dateCreated: 2026-11-09T00:00:00.000Z
---

With Model Engine 4 installed on Paper or Spigot, an NPC can show a Model Engine model in place of its body. The model stands where the NPC stands, turns with it, walks when it walks and plays an animation for each thing the NPC does. Each player sees the model only while they see the NPC. Without Model Engine the setting is kept and the NPC shows its own body; on Folia the NPC shows its own body too.

Animus draws the model itself, so the NPC needs no Citizens trait and no Model Engine command. Models come from Model Engine's own `blueprints` folder and resource pack, as for any other Model Engine model.

## Giving an NPC a model

<div class="animus-demo">
<p><strong>Model Engine NPC</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/31-model-engine-ingame.webm" aria-label="Giving an NPC a Model Engine knight that walks, waves and swings" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The model is the `animus:modelengine` module of the NPC's definition:

```json
"modules": {
  "animus:modelengine": {
    "model": "drake",
    "scale": 1.5,
    "nametagBone": "tag_name",
    "states": {"walk": "run", "interact": "wave"}
  }
}
```

| Field | Accepted values |
|---|---|
| `model` | Required. The Model Engine model id: 1-64 letters, digits, `_`, `-`, `.` or `/`. |
| `enabled` | `false` keeps the settings and shows the body instead. Default `true`. |
| `scale` | 0.0625-16. Scales the model and its hitbox. Default 1. |
| `showBody` | `true` also shows the NPC's own body. Default `false`. |
| `hitbox` | `false` ignores clicks on the model's hitbox. Default `true`. |
| `nametagBone` | A nametag bone of the model, such as `tag_name` or `name`, with or without its `tag_` prefix. It shows the NPC's name, with `&` color codes. |
| `states` | The animation to play for a state, by its name in the model. See [states](#states). |

A malformed module is refused at spawn with its field named, for example `$.modules.animus:modelengine.scale: expected 0.0625..16`. An NPC shows either a [rig](/animus/06-rigs-animations) or a Model Engine model; a definition with both is refused. A model id Model Engine does not have leaves the NPC on its own body, and the console names the id once.

The same settings can be set one at a time with [`/animus npc model`](/animus/02-commands-permissions#status-and-npc-management), and the [web editor](/animus/14-web-editor) lists `animus:modelengine` with the other modules of an NPC. A change applies as other definition edits do: viewers get the new model within a second.

```none
/animus npc model drake model drake
/animus npc model drake scale 1.5
/animus npc model drake walk run
/animus npc model drake show-body on
/animus npc model drake
/animus npc model drake model reset
```

`/animus npc model <npc>` with nothing else shows the module as stored. `reset` removes one setting, and `model reset` removes the whole module.

## States

| State | Played when | Default animation |
|---|---|---|
| `idle` | The NPC stands still | `idle` |
| `walk` | The NPC moves, on a route, by navigation or in combat | `walk` |
| `attack` | The NPC swings its arm, as in a melee attack or a build step | `attack` |
| `hurt` | The NPC takes damage. The model also flashes red | `hurt` |
| `death` | The NPC dies | `death` |
| `interact` | A player right-clicks the NPC | none |

A state the model has no animation for plays nothing. Idle and walk follow Model Engine's own state rules for the model; attack, hurt, death and interact play over whatever is running.

## The body, name and clicks

With `showBody` off, the body is invisible to every viewer and shows no equipment and no hurt flash of its own. The name and hologram lines still show above where the body stands. To show the name on the model instead, set `nametagBone` and hide the body's name with `"nameplate": {"visible": false}`.

A click on the model's hitbox counts as a click on the NPC when the player is in reach and can see it, as for a body: behaviors, shops, GUIs, hiring, combat and the [wand](/animus/21-in-game-toolkit#the-wand) all see it. The invisible body keeps its own hitbox as well, so a model without a hitbox is still clicked where the body stands.

## Importing modelled Citizens NPCs

The [Citizens import](/animus/13-migrating-from-citizens) converts Model Engine's `meg_model` trait, as saved by Model Engine 4 or by Model Engine 3, into `animus:modelengine`:

| Model Engine data | Animus |
|---|---|
| The model on the NPC | `model`. Animus shows one model; with several, the first is kept and the import warns with the others' ids |
| Model scale | `scale`, when it is within 0.0625-16 |
| Base entity visible | `showBody` |
| Renamed idle, walk and death states (Model Engine 3) | `states` |

Trait data that names no model, or a model id Animus cannot store, is kept in `citizens:review` with a warning, and the NPC keeps its body. The converted NPC needs Model Engine and the same model on the Animus server to show it.
