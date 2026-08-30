---
title: "Player Usage"
description: "Adapt documentation: Player Usage"
published: true
date: 2026-08-29T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

You do not sign up for anything in Adapt. Play normally. The skills you use gain levels on their own. When a skill gains a level, it pays knowledge that you spend on adaptations.

Everything you spend happens in one menu. Right-click a bookshelf. The skills list opens. Pick a skill. Pick an adaptation. Click the level you want. There is no command a player has to learn.

Two things limit you. Knowledge is per skill. Knowledge earned in Pickaxes only buys Pickaxes adaptations. Ability power is shared across your whole account. It grows with your master level. Every adaptation level you hold costs one point of it. Running out of power means choosing what to drop, not grinding more.

A brand-new player opens the menu and sees nothing. That is normal. Skills appear in the list once you have earned XP, knowledge, or a level in them. The menu gains entries as you play.

## Getting started

1. Play. Mine, fight, sprint, craft, brew, fish, tame. Each activity feeds its own skill line.
2. Watch your action bar. XP, skill-level, and master-level messages appear there while `actionbarNotifyXp`, `actionbarNotifyLevel`, and `actionbarNotifyMasterLevel` are on.
3. Once a skill has leveled at least once, find a bookshelf.
4. Right-click it while standing, with an empty hand or a non-block item. The menu opens.
5. Click the skill you want to spend in.
6. Click an adaptation to open its level list.
7. Click the level you want to buy. If you can afford its knowledge, power, and any configured Vault price, you learn it right there.
8. Go use it. Passive adaptations work immediately. The rest need the gesture described in that skill's doc.

## Opening the menu

### The activator block

The default activator is a bookshelf. All of the following must be true or nothing happens:

1. Right-click the block. Left-click does not work.
2. Do not sneak. Sneak-right-click is used by other features.
3. Hit a side face. Top and bottom faces work only when `adaptActivatorAllowVerticalFaces` is on.
4. Hold nothing, or hold an item that is not a placeable block, in both your main hand and your off hand. Holding a block means you are trying to build, so Adapt stays out of the way.
5. The protection plugins on the server must allow you to interact at that spot.

The click is cancelled once the menu opens, so the bookshelf does nothing else. The menu itself opens even in a world listed in `blacklistedWorlds`. Those worlds block the XP and the adaptation effects, not the menu.

### The command

`/adapt gui` opens the same menu and needs the `adapt.gui` permission. It can also open a specific skill or adaptation page directly, and staff can open a page for another player. See [04 - Commands & Permissions](/adapt/04-commands-permissions).

## Reading the skills menu

The window title shows your master level, your used power, and your maximum power. That is the budget line to watch.

Each skill icon shows the skill name with its current level and a short description. It also shows the knowledge you have banked in that line. It shows the total adaptation levels you are holding in it. Skills you have never touched are hidden unless the server turns on `guiShowAllSkills`.

The bottom row is navigation. If there is more than one page you get first, previous, next, and last buttons. Right-click of previous or next jumps five pages. The middle slot holds the page counter, or the mutations button when mutations are enabled for you. Inside a skill or an adaptation, that middle slot becomes a back arrow while `guiBackButton` is on.

## Learning an adaptation

1. Open a skill and click an adaptation. Every level from 1 to its maximum gets its own icon.
2. Read the icon lore. It lists the knowledge price and the power the level costs. It lists the money price if the server charges Vault currency. It lists the ability's numbers at that level.
3. Levels you already own are shown with an enchant glint.
4. Click the level you want. Buying level 4 from level 0 charges the sum of levels 1 through 4 in knowledge and 4 in power.
5. If the adaptation is marked permanent, the first click only asks for confirmation. Click the same level again within 6 seconds to commit. Normal players cannot later unlearn it; an administrative bypass can lower it without a refund.
6. On success the menu closes and reopens with the new level, and a short title tells you what you learned.

A click that does nothing but play a dull thud means you could not afford it. You may lack knowledge in that line, free power, or the configured Vault funds.

## Unlearning

Click a level you already own to drop back to the level below it. Knowledge comes back at the same price you paid. Any Vault money comes back at the server's configured refund percentage. If the server runs `hardcoreNoRefunds` you get nothing back, so think before you buy. Permanent adaptations refuse normal unlearning; an administrative bypass can lower one without paying any refund.

## Using what you learned

Most adaptations need no input. Others have a gesture: sneaking, jumping, breaking a block, drawing a bow, right-clicking with a particular item. Each skill doc lists the exact trigger for every one of its adaptations under `11` through `33`.

An adaptation that is learned can still stay silent. It does nothing while you are in spectator mode. It does nothing while you are in creative mode on a server that has not enabled `allowAdaptationsInCreative`. It does nothing in a blacklisted world. It does nothing inside a region or claim that denies the action. It does nothing when another plugin denies the use through Adapt's ability API. It also stays silent when Adapt could not safely load or claim your profile.

Some adaptations create items: backpacks, chalk wands, time bottles, bound rift objects. Those items only do their special thing for someone who has the owning adaptation. Experience and knowledge orbs are different. They are admin-made snowballs. Anyone with a ready Adapt profile can throw one to collect the reward stored inside it, with no adaptation needed; Adapt refuses the custom launch and awards nothing while the profile is unavailable. See [36 - Items, Orbs & Bound Objects](/adapt/36-items-orbs-bound-objects).

An unsafe, corrupt, timed-out, or unclaimable profile never prevents you from joining the Minecraft server. Adapt stays unavailable for that session instead: its menus and player-scoped commands refuse the action, and XP, knowledge, skills, adaptations, mutations, custom brewing, and custom orbs remain inactive without creating an empty replacement profile. Adapt makes three bounded online retries; if recovery still fails, reconnect after the operator has fixed the storage problem.

## Other things worth knowing

`/adapt effects` toggles whether you personally see Adapt's particles and sounds. Add `on` or `off` to set it explicitly. It only hides effects that the server and the individual adaptation already allow.

If the server enabled mutations and you have `adapt.mutations`, the middle button on the skills menu bottom row opens the mutation menu. `/adapt mutations menu` does the same. You can read that menu anywhere. You can only equip or change a mutation while still near the activator block you opened. See [34 - Mutations Overview](/adapt/34-mutations-overview).

Logging in after time away grants a temporary XP boost sized from how long you were gone. A welcome toast tells you the amount and the duration.

## Reference

### Activator block rules

| Requirement | Detail |
|---|---|
| Action | Right-click the block |
| Sneaking | Must not be sneaking |
| Block face | Side faces only unless `adaptActivatorAllowVerticalFaces = true` |
| Main hand | Empty or a non-block item |
| Off hand | Empty or a non-block item |
| Block type | Must match `adaptActivatorBlock`, default `BOOKSHELF`. Unknown, non-block, and air configuration values fall back to `BOOKSHELF` |
| Protection | Every default protector must allow interaction at that location |
| Result | Event cancelled, page-turn and enchantment-table sounds, crit and enchantment particles, skills menu opens |

`adaptActivatorBlockName` (default `a Bookshelf`) only changes the wording in messages. It does not change which block works.

### Player-facing commands

`/adapt gui` needs `adapt.gui` (default op). `/adapt effects` needs `adapt.effects` (default true). `/adapt mutations menu` needs `adapt.mutations` (default true). Admin shortcuts that bypass the normal earn-and-spend path are `/adapt determine` (`adapt.determine`), `/adapt claim-skill`, and `/adapt claim-adaptation`. See [04 - Commands & Permissions](/adapt/04-commands-permissions).

### Menu behavior knobs

| Key | Default | What it does |
|---|---|---|
| `guiShowAllSkills` | `false` | Lists every enabled skill even at zero progress. Display only. Permissions still apply |
| `gui.skillsGuiRows` | `0` | Rows in the skills window. 0 auto-sizes to the contents. 1-6 forces a size and pages the rest |
| `guiBackButton` | `true` | Shows a back arrow in the middle of the navigation row of child menus |
| `escClosesAllGuis` | `false` | False reopens the parent menu when you press Escape. True closes the whole stack |
| `learnUnlearnButtonDelayTicks` | `14` | Ticks between the menu closing and reopening after a learn or unlearn. 0 also suppresses the title toast |
| `actionbarNotifyXp` | `true` | Shows aggregated skill XP gains on the action bar |
| `actionbarNotifyLevel` | `true` | Shows skill-level notifications on the action bar |
| `actionbarNotifyMasterLevel` | `true` | Shows the master-level and maximum-power notifications on the action bar |
| `actionbarXpDurationMillis` | `1500` | XP ticker lifetime, clamped to 100-60000 milliseconds |
| `actionbarLevelDurationMillis` | `2500` | Skill-level and master-level notification lifetime, clamped to 100-60000 milliseconds |
| `progressionSoundsEnabled` | `true` | Plays progression sounds independently of the three visual switches |
| `loginBonus` / `welcomeMessage` | `true` | Grant the returning-player XP boost, and show the toast that reports it |
| `hardcoreNoRefunds` | `false` | Unlearning returns no knowledge and no money |
| `learningEconomy.enabled` | `false` | Also charges Vault currency when learning |
| `learningEconomy.moneyPerKnowledge` | `1.0` | Currency charged per point of knowledge spent |
| `learningEconomy.refundPercent` | `100.0` | Percentage of the paid money returned when unlearning |

Other timings follow. The permanent-learn confirmation window is 6 seconds. Right-click of previous or next jumps 5 pages. The returning-player boost is offline time divided by 12, capped at 1 hour. It is worth 10 to 25 percent extra XP. It is skipped under 5 minutes. Mutation bookshelf access uses `bookshelfTokenMillis` (60000) and `bookshelfMaximumDistance` (8) from `mutations.toml`.

### Gates checked every time an adaptation fires

1. Learned level 1 or higher.
2. World not in `blacklistedWorlds`.
3. Not spectator. Not creative unless `allowAdaptationsInCreative`.
4. Every registered protector allows the action at your location.
5. The adaptation's `adapt.use` node, which defaults to true and only blocks when explicitly denied. Operators bypass it.
6. No conflicting adaptation from `adaptationUsageConflicts` is learned.
7. No plugin denies through `AdaptAdaptationUseEvent` or an `AbilityUsePolicy`.

## See also

- [02 - Concepts](/adapt/02-concepts) for the XP, knowledge, and power model
- [04 - Commands & Permissions](/adapt/04-commands-permissions) for every command and permission node
- [05 - Configuration Math](/adapt/05-configuration-math) for the curves and formulas
- [06 - GUI Customization](/adapt/06-gui-customization) for menu icons, ordering, and size
- [10 - Skills Catalog](/adapt/10-skills-catalog) for the index of all skills and adaptations
- `11`-`33` (`NN - Skill - <Name>.md`) for one skill's XP sources and every adaptation trigger
- [36 - Items, Orbs & Bound Objects](/adapt/36-items-orbs-bound-objects) for orbs and adaptation-created items
