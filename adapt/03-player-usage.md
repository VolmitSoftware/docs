---
title: "Player Usage"
description: "Open the Adapt menu and learn or remove adaptations"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Open the menu by clicking a side of the activator block, which is a bookshelf by default. You can also use `/adapt gui` with the `adapt.gui` permission.

## Open and navigate the menu

The block click opens the menu when all of these conditions hold:

- You are not sneaking.
- Each hand is empty or holds a non-block item.
- You click a side face, unless `adaptActivatorAllowVerticalFaces` also permits the top and bottom.
- Protection plugins allow the interaction.

The server selects the block with `adaptActivatorBlock`. The menu still opens in a blacklisted world, but XP and adaptations stay off there.

A skill appears after the player has XP, knowledge, or a learned adaptation in it. `guiShowAllSkills` lists every enabled skill that player may use.

The main menu shows skill level, knowledge, master level, and used power. Owned levels show an enchantment glint. Right-click **Previous** or **Next** to jump five pages. `guiBackButton` controls whether **Back** appears.

## Learn and unlearn adaptations

Buying levels charges knowledge and one power for each level between your current and selected levels. Vault currency also applies when `learningEconomy.enabled` is true. The first purchase of a `permanent` adaptation needs a second click within six seconds.

Unlearning returns the knowledge and configured Vault refund. Permanent adaptations cannot be unlearned by players. With `hardcoreNoRefunds`, unlearning returns neither knowledge nor currency.

An adaptation with prerequisites shows a **Requires:** line for each one on every level. Green lines are met. Red lines name an adaptation and level you must learn first. You cannot unlearn an adaptation below a level that another of your learned adaptations requires; the message names those adaptations so you can unlearn them first.

Passive adaptations run after purchase. Active adaptations use the trigger on their skill page. Active level 0 does not run. The gates are in [Concepts](/adapt/02-concepts).

## Personal settings

When the server permits personal settings, every adaptation has an enable switch and any additional personal controls along the bottom of its level screen. Each skill screen also has a master switch that suppresses your adaptations in that skill while preserving their individual choices. The skill pages list input modes, filters, personal limits, and other supported controls. When `playerSettingsEnabled` is `false`, these controls and resets are hidden and server defaults apply. You can still learn and unlearn under the normal rules.

Left-click a control to cycle forward. Right-click to cycle backward. Glass panes show **On** in lime and **Off** in red. Mode items show the current choice in their lore. Controls update without closing the inventory.

Changes, resets, locked choices, and control-page navigation have distinct quiet sounds. Your effects preference and the server sound settings control whether you hear them.

Gray controls are server-controlled or not yet unlocked. Lore shows level requirements and unavailable choices.

**Reset to server defaults** clears the current adaptation's personal overrides. Resetting a skill's master switch preserves its adaptation settings. Turning an adaptation off preserves learned levels and spent knowledge or power. Your choices affect only your player. See [player preference policy](/adapt/01-installation-configuration#player-preferences).

Last Rites, Hourglass Guard, and Void Skin each offer a **Death-save priority** control: First, Normal, or Last. Adapt applies damage modifiers and Borrowed Time before checking whether a hit is lethal, then tries eligible saves in your chosen order. Equal priorities use Last Rites, then Hourglass Guard, then Void Skin. Only the winning save spends its cooldown or pearl; unavailable saves fall through to the next choice. Existing Hourglass protection or a pending Void Skin escape does not spend another save. Cooldowns keep counting while you are offline and survive reconnects, restarts, reloads, unlearning, and changes to these controls.

`/adapt effects` with `adapt.effects` toggles that player's particles and sounds.

Menu layout and icons: [GUI](/adapt/06-gui-customization).
