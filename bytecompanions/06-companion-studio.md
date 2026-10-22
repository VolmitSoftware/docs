---
title: "ByteCompanions: Companion Studio"
description: "Editing companion definitions and base bonuses in game, previews, drafts, and saving"
published: true
date: 2026-10-15T00:00:00.000Z
tags: "bytecompanions, studio"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Companion Studio edits the shared companion definitions and their base bonuses from inside the game. `/bytecompanions edit <companion>` opens it for one definition; `/bytecompanions edit` resumes your draft or lets you choose one. It needs `bytecompanions.command.edit`, which defaults to operators. Studio changes server files, not a player's personal selection.

## Workflow

1. Pick a category: Appearance & Name, Equipment & Colors, Movement & Animation, Built-in Particles, Attribute Bonuses, Potion Bonuses, or XP & Reward Bonuses.
2. Click a field. Booleans toggle, numbers step, listed values cycle, and free values prompt in chat. A chat prompt expires after 60 seconds, accepts at most 256 characters, and `cancel` returns without changing the draft. Sending any command cancels a pending prompt.
3. Use the presets to add or remove movement animations, built-in particle effects, attribute and potion bonuses, and reward buffs. Attribute and potion fields also offer Remove this bonus.
4. Choose Preview in the world to see the draft privately. A preview lasts five minutes and refreshes after every valid edit. It equips nothing and grants no bonuses or XP.
5. Choose Review & Save, read the changed fields page by page (27 per page), and confirm Save for everyone. The save validates the candidate, writes the changed files, and reloads the runtime. Other editors close and online players' data reloads.

## Copying a companion

Copy as a new companion on the Studio home page asks for an unused ID of 1 to 64 lowercase letters, digits, underscores, or hyphens. The copy takes the current draft's appearance, equipment, animations, and per-companion attribute, potion, and buff entries. It stays in memory until Save for everyone creates its file. Copies do not get progression tracks, upgrade tiers, or any player's permission; configure those separately.

IDs that already exist, or that already appear in bonus or progression configuration, are rejected.

## What each category edits

| Category | Fields |
|---|---|
| Appearance & Name | Model, exclusive flag, menu item material and name, lore lines, custom name, scale, small, visible, arms, base plate, marker, custom name visibility |
| Equipment & Colors | Material, custom model data, and existing item fields per slot; an RGB color for leather items |
| Movement & Animation | Existing animation parameters per channel plus four presets: formation following, hovering, looking at the owner, and walking swings |
| Built-in Particles | Toggles for the post-tracking particle effects; colors are fixed |
| Attribute Bonuses | Attribute, amount, and operation entries in `features/attributes/config.toml` |
| Potion Bonuses | Effect, amplifier, priority, and stack mode entries in `features/effects/config.toml` |
| XP & Reward Bonuses | Enabled, operation, value, and cooldown for the eight buff categories in `features/buffs/config.toml` |

Long encoded head textures still need a text editor. Studio does not change feature switches, progression tracks, upgrade prices, or boosters.

## Drafts

One administrator holds one draft at a time. Closing the menu keeps it; an inactive draft is discarded after 15 minutes. Reset draft restores the values captured when editing began. Discard draft drops the changes and stops the preview. Disconnecting or a runtime reload discards the draft. If a save fails and the previous runtime is restored, the draft is offered again in the reopened editor.

## Validation

Every field change passes content validation before it enters the draft. Saving rechecks the root configuration and the edited files and refuses to overwrite a newer edit; reopen Studio when that happens. A failed installation restores the previous files and runtime.

Validation checks vanilla materials and whether an item provider plugin is enabled. It cannot prove that a Nexo or ItemsAdder ID resolves; an unknown ID shows as air. Check the preview before saving.

## Related pages

- [Companions and collections *Definition files, categories, and variants*](/bytecompanions/05-companions-and-collections)
- [Particles and features *The feature files Studio writes*](/bytecompanions/08-particles-and-features)
- [Integrations *Nexo and ItemsAdder item IDs*](/bytecompanions/09-integrations)
{.links-list}
