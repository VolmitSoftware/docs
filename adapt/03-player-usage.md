---
title: "Player Usage"
description: "Open the Adapt menu and learn or remove adaptations"
published: true
date: 2026-09-28T10:36:37.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

The menu opens on a side-click of `adaptActivatorBlock` (default bookshelf), or with `/adapt gui` and `adapt.gui`.

The click registers when the player is not sneaking, both hands are empty or hold non-block items, the face is a side unless `adaptActivatorAllowVerticalFaces` is true, and protectors allow the interaction. The menu still opens in a blacklisted world. XP and adaptations stay off there.

A skill appears after the player has XP, knowledge, or a learned adaptation in it. `guiShowAllSkills` lists every enabled skill that player may use.

Buying a level charges each step from the current level to the selected level: knowledge, one power per level, and Vault currency when `learningEconomy.enabled` is true. The first purchase of a `permanent` adaptation needs a second click within six seconds. Unlearn returns that knowledge and the configured Vault refund. `permanent` adaptations and `hardcoreNoRefunds` return nothing.

Passive adaptations run after purchase. Active adaptations use the trigger on their skill page. Active level 0 does not run. The gates are in [Concepts](/adapt/02-concepts).

The main menu shows skill level, knowledge, master level, and used power. Owned levels show an enchantment glint. Right-click Previous or Next jumps five pages. `guiBackButton` shows Back.

Every adaptation has an enable switch and any additional personal controls along the bottom of its level screen. Each skill screen also has a master switch that suppresses your adaptations in that skill while preserving their individual choices. The skill pages list input modes, filters, personal limits, and other supported controls.

Left-click a control to cycle forward and right-click to cycle backward. Glass panes show On in lime and Off in red; mode items show the current choice in their lore. Controls update in the same open inventory. Changes, resets, locked choices, and control-page navigation have distinct quiet sound feedback for you, subject to your effects setting and server sound settings.

Gray controls are server-controlled or not yet unlocked. Lore shows level requirements and unavailable choices. Reset to server defaults clears the current adaptation's personal overrides; resetting a skill's master switch preserves its child settings. Turning an adaptation off preserves learned levels and spent knowledge or power. Your choices never change another player's settings. See [player preference policy](/adapt/01-installation-configuration#player-preferences).

`/adapt effects` with `adapt.effects` toggles that player's particles and sounds.

Menu layout and icons: [GUI](/adapt/06-gui-customization).
