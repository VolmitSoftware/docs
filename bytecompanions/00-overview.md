---
title: "ByteCompanions: Overview"
description: "What ByteCompanions does, the first steps after installing it, and the most used commands"
published: true
date: 2026-10-15T00:00:00.000Z
tags: "bytecompanions, overview"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

ByteCompanions adds cosmetic companions that follow players. Each companion is a client-side armor stand built from vanilla blocks, equipment, dyed armor, or player heads, so no resource pack is needed. This page summarizes the plugin and points to the first things to do after installing it.

## What it does

Players browse a collection, equip companions they have permission for, save outfits, name their companions, choose particle effects, and ask a companion to pet, wave, sit, stay, or come back. Companions have no combat, pathfinding, or mounting behavior.

Operators get eight starter companions, a setup menu that applies a cosmetic or survival profile, Companion Studio for editing definitions in game, and optional feature packs: attribute modifiers, experience and loot buffs, potion effects, static decorations, companion levels with purchasable upgrades, and timed boosters. Every file under the data folder hot reloads when saved.

## First three things to do

1. Start the server once and wait for the ready line in the console. The first start downloads the plugin's libraries into `plugins/ByteCompanions/.libs/` and writes `config.toml`, the eight starter companions, the feature files, and `languages/en_US.toml`.
2. Run `/bytecompanions setup` as an operator and apply the cosmetic or survival profile. Cosmetic keeps attributes, buffs, and potion effects off. Survival turns them on.
3. Grant players `bytecompanions.companion.<id>` for each companion they may equip. The command and menu permissions default to everyone; the companion and particle permissions do not.

## Most used commands

| Command | What it does | Run from |
|---|---|---|
| `/bytecompanions menu [companion]` | Opens the collection, or the dashboard of the named or only equipped companion | Player |
| `/bytecompanions spawn <companion>` | Equips a companion | Player |
| `/bytecompanions despawn [companion]` | Removes one or every equipped companion | Player |
| `/bytecompanions status` | Shows configuration, runtime counts, features, storage, integrations, and compatibility | Console or player |
| `/bytecompanions config` | Opens the in-game configuration editor | Player |
{.dense}

## Related pages

- [Installation *Requirements, first start, and file locations*](/bytecompanions/01-installation)
- [Commands and permissions *Every command and permission node*](/bytecompanions/02-commands-permissions)
{.links-list}
