---
title: "Animus: LibsDisguises"
description: "NPCs that look like a LibsDisguises disguise, what each disguise option becomes, and importing the disguises Citizens NPCs wore"
published: true
date: 2026-11-10T00:00:00.000Z
tags: "animus, npcs, libsdisguises, disguises, citizens"
editor: markdown
dateCreated: 2026-11-09T00:00:00.000Z
---

With [LibsDisguises](https://www.spigotmc.org/resources/libs-disguises-free.81/) installed on Paper, Spigot or Folia, an NPC can look like any disguise LibsDisguises reads: a disguise as `/disguise` takes it, such as `zombie setBaby true`, `player Notch` or `horse setColor BLACK`, or the name of a custom disguise saved in LibsDisguises' `disguises.yml`. LibsDisguises reads the text with its own parser, and Animus shows the result as the NPC's own body, for each player who sees it. LibsDisguises needs [PacketEvents](https://modrinth.com/plugin/packetevents) installed beside it.

## Setting a disguise

<div class="animus-demo">
<p><strong>LibsDisguises bodies</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/34-disguises-ingame.webm" aria-label="Player NPCs turning into a baby zombie, sand, a diamond, a pig, an emerald and text" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

A disguise is the `disguise` field of the [definition](/animus/04-npc-definitions):

```json
"disguise": "zombie setBaby true setItemInMainHand iron_sword"
```

From the game or the console:

```text
/animus npc disguise guard "zombie setBaby true"
/animus npc disguise guard knight
/animus npc disguise guard
/animus npc disguise guard reset
```

The first sets a disguise from text; quote it when it has spaces. The second uses the custom disguise named `knight`. With no disguise given, the command shows the disguise, the body it gives and the options that body leaves out. `reset` removes it. Text LibsDisguises cannot read is refused with LibsDisguises' reason, and nothing is saved. The command needs `animus.npc.edit`.

In the [web editor](/animus/14-web-editor), the **Disguise** field sits in the NPC's **Body** section. A [trait group](/animus/18-trait-groups) may hold a `disguise` for every NPC that lists it.

The file keeps the NPC's own `type`, `name` and body fields. The disguise's values replace them in the NPC that is shown, so removing the disguise brings the NPC's own body back. `/animus inspect` shows the disguised body type, and **[JSON]** copies the file as stored.

## What a disguise becomes

| Disguise option | NPC field |
| --- | --- |
| The disguise type, such as `zombie` or `horse` | `type` |
| `player <name>`, `setName`, `setNameVisible` | `type: minecraft:player`, `name` and `nameplate.visible` |
| `setSkin`, or the skin of the named player | A skin document in `skins/`, set as `skin` |
| `setDisplayedInTab` | `listed` |
| `setCustomName`, `setCustomNameVisible` | `name` and `nameplate.visible` |
| `setBaby` | `baby` |
| `setGlowing`, `setGlowColor` | `glowing` and `teamColor` |
| `setNoGravity` | `gravity: false` |
| `setSneaking`, `setSwimming`, `setSleeping` and the matching `setEntityPose` | `pose` |
| `setRightClicking`, `setMainHandRaised` | `usingItem` |
| `setArmor`, `setHelmet`, `setChestplate`, `setLeggings`, `setBoots`, `setItemInMainHand`, `setItemInOffHand` | `equipment`, with the item's components |
| `setScale` | `attributes.scale` |
| A horse's `setColor` and `setStyle` | `horse.color` and `horse.markings` |
| A llama's `setColor`, `setCarryingChest` and `setCarpet` | `llama.variant`, `llama.chest` and a carpet in the `body` slot |
| A frog's `setVariant`, an armadillo's `setState` | `frog.variant`, `armadillo.state` |
| An ender dragon's `setPhase` 10, or 5 to 7 | `dragon.phase` `hovering`, or `sitting` |
| An armor stand's `setSmall`, `setShowArms`, `setNoBasePlate`, `setInvisible` and part angles | `armorStand` |

Equipment slots, a pose or body settings the new body cannot show are left out, as they would be for that body type in a file. Options that only change how the disguise acts for a disguised player, such as `setViewSelfDisguise` or `setReplaceSounds`, change nothing an NPC shows and are ignored.

Any other option is left out of the NPC's body: for example `setBurning`, `setSprinting`, `setInvisible` on a body other than an armor stand, `setUpsideDown`, `setMarker`, particles and potion effects, a player's skin layers, and a dragon phase other than those above. `/animus npc disguise <npc>` and the server log name the options left out, in LibsDisguises' words, such as `disguise options not shown: setBurning`.

A disguise that shows a block, an item or text fills that body's [settings](/animus/04-npc-definitions#body-settings): `falling_block` and `block_display` take their block, `item` and `item_display` their item, and `text_display` its text. `area_effect_cloud`, `marker` and `interaction` disguises show nothing and are refused, and so are custom entity types from mods.

### Player disguises

A player disguise takes the skin LibsDisguises has for the named player, or the one given with `setSkin`. When LibsDisguises still has to fetch it from Mojang, the NPC shows a player body without that skin and takes the skin once it arrives. The skin is saved as `skins/<sha256>.json`, labelled with the disguise's name.

### Custom disguises

A custom disguise is read again whenever its text in `disguises.yml` changes, the next time Animus loads the NPC. After `/savedisguise` or an edit to `disguises.yml`, `/animus reload` shows the new look.

## Without LibsDisguises

When LibsDisguises is not installed, or a disguise cannot be read, the NPC shows its own `type` and body fields, and the `disguise` field stays in the file. Without LibsDisguises, `/animus npc disguise` is left out of help and completion, and typed anyway it answers that it needs LibsDisguises. When LibsDisguises cannot read a disguise, `/animus npc disguise <npc>` shows why, and the server log names it. On [mod servers](/animus/16-mod-servers) the field is kept and never shown.

## Citizens NPCs

The [Citizens import](/animus/13-migrating-from-citizens) gives an NPC the disguise it wore through LibsDisguises, as its `disguise` field. Animus reads, in this order, the first disguise found for the NPC's UUID:

| Source | What is read |
| --- | --- |
| `imports/libsdisguises/SavedDisguises/<uuid>` and `plugins/LibsDisguises/SavedDisguises/<uuid>` | The first disguise in the file LibsDisguises saved for that entity |
| `imports/libsdisguises/scripts/`, `plugins/Denizen/scripts/` and `plugins/Skript/scripts/` | A line that runs `disguiseplayer`, `disguiseuuid` or one of their aliases for the NPC's UUID written out, such as `execute as_server "disguiseplayer <uuid> zombie setBaby true"` |

A Citizens player NPC's entity has a UUID of its own, the NPC's UUID with version 2; Animus looks for both. A saved file in LibsDisguises' old, non-text format, and a script line whose disguise holds placeholders such as `<npc.name>` or `%player%`, are not imported; the import preview lists each one under its warnings. Each NPC that takes a disguise gets a warning naming where it came from.

The imported NPC shows the disguise while LibsDisguises is installed on the Animus server.
