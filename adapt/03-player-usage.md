---
title: "Player Usage"
description: "Open the Adapt menu and learn or remove adaptations"
published: true
date: 2026-09-28T20:00:00.000Z
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

Adaptations with personal controls show them along the bottom of their level screen. Rift Blink offers enable/disable, phasing, Distance/Verticality targeting, and an optional level-2 Reactive mode with a direction choice. Left-click a control to cycle forward and right-click to cycle backward. Glass panes show On in lime and Off in red; mode items show the current choice in their lore. Only the changed controls update, keeping the same menu open.

Gray controls are server-controlled or not yet unlocked. Lore shows level requirements and unavailable choices. Reset to server defaults clears that adaptation's personal overrides. Your settings do not change another player's skill, and turning Blink off does not refund knowledge or power. See [Rift Blink](/adapt/27-skill-rift#rift-blink-rift-blink).

`/adapt effects` with `adapt.effects` toggles that player's particles and sounds.

When Mutations are enabled, the main menu has a Mutations button. Slot changes need a fresh activator click. See [Mutations](/adapt/34-mutations-overview).

Menu layout and icons: [GUI](/adapt/06-gui-customization).
