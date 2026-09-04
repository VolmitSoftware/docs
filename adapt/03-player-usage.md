---
title: "Player Usage"
description: "Open Adapt, gain skill levels, and learn or remove adaptations"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Skills level up as you play. Each skill awards its own knowledge, which you spend on adaptations from the Adapt menu.

## Open the menu

Right-click the side of the configured activator block. The default is a bookshelf.

The menu opens when:

- you are not sneaking;
- both hands are empty or hold non-block items;
- you click a side face, unless the server enables vertical faces; and
- protection plugins allow interaction at that location.

The menu can open in a blacklisted world, but XP and adaptation effects remain disabled there.

`/adapt gui` opens the same menu if you have `adapt.gui`. See [Commands and Permissions](/adapt/04-commands-permissions).

## Earn progress

Activities award XP to their matching skills. Mining raises Pickaxes, movement raises Agility, and combat raises weapon or defense skills. The [Skills Catalog](/adapt/10-skills-catalog) lists every skill and links to its XP sources.

When a skill gains a level:

- that skill receives knowledge;
- the player's master level gains progress; and
- the master level increases the shared ability power limit.

Knowledge cannot move between skills. Every learned adaptation level uses one ability power unless a region granted it.

New players may see an empty skills menu. By default, a skill appears after the player earns XP, knowledge, or an adaptation in it. Servers can show every enabled skill with `guiShowAllSkills`.

## Learn an adaptation

1. Open a skill from the main menu.
2. Select an adaptation.
3. Choose the level you want.
4. Check the knowledge, power, and optional Vault price.
5. Click the level to buy it.

Buying several levels at once charges every level between the current and selected levels. A permanent adaptation asks for a second click within six seconds before the first purchase.

The menu shows a dull sound when a purchase fails. Common causes are insufficient knowledge, insufficient ability power, or insufficient Vault funds.

## Unlearn an adaptation

Click a level you already own to drop to the previous level. Adapt returns its knowledge cost and any configured Vault refund.

Permanent adaptations cannot be removed by a player. When `hardcoreNoRefunds` is enabled, unlearning returns neither knowledge nor money.

## Use an adaptation

Passive adaptations begin working after purchase. Active adaptations may require sneaking, jumping, attacking, breaking a block, or using a specific item. Each skill page lists the exact trigger.

An adaptation does not run when:

- it or its skill is disabled;
- the player has not learned it;
- the world or game mode is blocked;
- the player lacks its `adapt.use` permission;
- a configured adaptation conflict applies;
- a protection plugin denies the action; or
- another plugin denies it through Adapt's ability API.

If Adapt cannot safely load a player's profile, Minecraft login still succeeds but Adapt remains unavailable. Menus, progression, abilities, mutations, custom brewing, and custom orbs stay inactive until the storage issue is fixed and the player reconnects.

## Menu controls

The main menu shows skill level, stored knowledge, master level, and used ability power. Adaptation levels already owned have an enchantment glint.

The bottom row contains page controls. Right-click Previous or Next to jump five pages. Child menus show a back button when `guiBackButton` is enabled.

`/adapt effects on|off` controls your Adapt particles and sounds. It requires `adapt.effects`, which players receive by default.

When Mutations are enabled, the main menu includes a Mutations button. Players must return to the activator block before changing a mutation slot. See [Mutations Overview](/adapt/34-mutations-overview).

## Related guides

- [Concepts](/adapt/02-concepts) explains knowledge, master level, and ability power.
- [GUI Customization](/adapt/06-gui-customization) covers menu icons, order, and size.
- [Items, Orbs and Bound Objects](/adapt/36-items-orbs-bound-objects) covers special items.
- [Configuration Math](/adapt/05-configuration-math) documents progression formulas.
