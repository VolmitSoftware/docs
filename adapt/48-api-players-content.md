---
title: "API - Players and Content"
description: "ContentCatalog, vetoes, PlayerProfile, SkillProgress, learning, XP awards and boosts, orphaned progress, and server settings"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

Anything an admin can do to content or to a player's progress, an addon can do through the API. Adapt's own commands and menus use the same interfaces. The example's `/adapt geology` subcommands ([Commands](/adapt/53-api-commands)) drive most of what this page describes.

## The content catalog

`AdaptApi.content()` returns the `ContentCatalog` of the running core. It lists Adapt's built-in content and every addon's on the same terms.

| Method | Returns |
|---|---|
| `skill(id)`, `skills()` | A skill by id, or every registered skill in registration order, disabled and vetoed ones included |
| `adaptation(id)`, `adaptations()` | An adaptation by id, or every learnable adaptation in skill then registration order |
| `item(id)`, `items()` | Registered custom items, each id once: those addons registered directly, then those of adaptations, upgrades, mutation blocks and signatures. Mutation tools are not listed |
| `owner(id)` | The namespace of the addon that registered an id |
| `revision()` | A number that rises on every change to the catalog |
| `vetoes()` | The vetoes in force |
| `mutated(slot)` | The adaptation a mutation slot holds, its signature if one is registered, once the pair is built. Experimental, see [Mutations](/adapt/47-api-mutations#pairs-slots-and-ids) |

The instances returned are the live ones Adapt ticks and sends events to. A config reload or an addon refresh replaces them, so look content up again after a `CatalogChangedEvent` instead of keeping it.

The example's `/adapt geology catalog` checks that Aftershock landed on the built-in Pickaxes skill. From `GeologyConsole.java`:

```java
boolean onPickaxe = catalog.skill(GeologyAddon.PICKAXE)
    .map((Skill<?> skill) -> skill.getAdaptations().stream().anyMatch((Adaptation<?> adaptation) -> adaptation.getId().equals(Aftershock.ID)))
    .orElse(false);
```

`catalog.owner(Aftershock.ID)` is `example`, while `catalog.owner(GeologyAddon.PICKAXE)` is `adapt`.

## Vetoes

An addon can block a skill or adaptation of any addon while the server runs, in its own name, through the handle `install` returned:

```java
ContentVeto veto = handle.veto(Id.adapt("rift/blink"));
veto.lift();
```

While a veto stands, the content is treated as disabled: hidden from menus, not learnable, and inactive for players who hold it. Players keep what they learned. A veto is never saved. It ends when it is lifted, when the addon that placed it is refreshed or uninstalled, or when the core stops.

`veto` throws `IllegalArgumentException` when the addon is no longer installed or the id is not registered, and `IllegalStateException` when no core runs or the server forbids vetoes on that namespace. Admins forbid them with `addons.vetoProtectedNamespaces` in `adapt.toml`, see [Installation and configuration](/adapt/01-installation-configuration#addons).

## Players

`AdaptApi.players()` returns the `PlayerDirectory`. Only online players have a profile.

| Method | Returns |
|---|---|
| `find(player)`, `find(uuid)` | The profile of an online player whose data has loaded |
| `require(player)` | The profile, or `IllegalStateException` while the data is still loading shortly after the player joins |
| `online()` | Every loaded profile |
| `boost(multiplier, millis)` | Multiplies the XP every player earns for a time, on top of each player's own boosts |
| `peek(uuid, section)` | One of your addon's data sections of any player, online or not, read from the save. Experimental. Reading an offline player's save can block, so call it off the server thread and do not change what it returns |
| `isDebugging(uuid)` | Whether an admin turned on `/adapt debug` for the player. Experimental |

A `PlayerProfile` is one online player's progress and the only way to change it. Every change fires the matching [progress event](/adapt/49-api-events#progress-events) first and does nothing when a listener cancels it.

A method that changes progress, such as learning, mutating, XP, knowledge, stats, boosts, grants, orphans, resets, food and writes through `skill(id)` and `preferences()`, throws `IllegalStateException` when called off the thread that owns the player: the server thread on Bukkit and modded servers, the player's region thread on Folia. Reads, `discover`, `discoverChunk`, the saves and `section` do not check the thread, and a read from another thread may see a change half made.

A profile belongs to one session of the player. When they leave, or their data is handed to another server, `isReady()` turns false and the profile is detached: reads return the data as it was then, changes reach only that stale copy, `requestSave()` does nothing and `checkpoint()` fails, while `saveNow()` writes the stale copy over anything saved since. Do not keep a profile past logout; look the player up again with `find(uuid)`.

| Method | Does |
|---|---|
| `player()`, `uuid()`, `isReady()` | The player, and whether their data is ready; false while it is being claimed or handed to another server |
| `skill(id)`, `skills()` | The player's line in a skill, or every line with progress |
| `level(adaptation)` | The learned level, 0 when not learned or not registered |
| `learn(adaptation, level, options)`, `unlearn(adaptation, level, options)` | Raises or lowers an adaptation |
| `power()`, `maxPower()` | Power in use and the most the player may use |
| `preferences()` | The player's preference choices |
| `stat(name)`, `addStat(name, amount)` | Stat counters, which milestones watch |
| `isGranted(owner, key)`, `grant(owner, key)` | An advancement by the id of the content that registered it and its key, see [advancements](/adapt/43-api-skills#advancements-and-milestones). `grant` is false when it was already granted or advancements are off |
| `boost(multiplier, millis)` | Multiplies all XP the player earns for a time |
| `boost(source, multiplier, millis)`, `endBoosts(source)` | A boost held under a source, such as the giving adaptation's id, which `endBoosts` takes back before it runs out |
| `mutate`, `unmutate`, `mutations`, `mutationOf` | Mutations. Experimental, see [Mutations](/adapt/47-api-mutations) |
| `orphans()`, `refundOrphans(namespace)`, `purgeOrphans(namespace)` | Saved progress of addons that are not installed |
| `clearXp()`, `clearKnowledge()`, `clearAdaptations()`, `clearStats()`, `clearDiscoveries()` | Clears one part of the profile. Orphans are kept |
| `reset()` | Wipes all progress in registered content. Orphans are kept |

The example's command actions run on the player's thread and get the profile with `AdaptApi.players().require(player)`.

### Your own data in the player's save

A `PlayerSection` is a block of an addon's own data kept in each player's save, next to Adapt's progress. The addon declares it in `register` with `ContentRegistrar.playerSection(path, type, initial)`, which records the addon as the section's owner and `type` as its value type. The id is `<namespace>:<path>` and is file content, so it never changes. The example counts the field notes a player writes:

```java
public final class FieldNotes {
  public int entries;
}
```

```java
notes = registrar.playerSection("field_notes", FieldNotes.class, FieldNotes::new);
```

The returned object is the permission to read the section. `profile.section(section)` and `PlayerDirectory.peek(uuid, section)` accept only an object a registrar handed out for an installed addon, and throw `IllegalStateException` for a section no installed addon declared or one an addon made itself, naming the section, its owner and the caller. To let another addon read a section, pass it the object. Each core start returns the same object for the same path and type, so it can be kept in a field across starts; the example keeps it on `GeologyAddon`. Its `/adapt geology notes` writes one note, from `GeologyConsole.java`:

```java
FieldNotes written = profile.section(section);
written.entries++;
profile.requestSave();
return "entries=" + written.entries + " section=" + section.id();
```

`profile.section(section)` is the live value: the one in use, else the saved one, else a fresh one from `initial`. Its fields are written with the rest of the player file as a JSON object under the full id, so keep it a plain class of numbers, strings, lists, maps and other plain classes. After a change, `profile.requestSave()` saves the player soon, `saveNow()` at once, and `checkpoint()` returns a future that completes when the save is written. One id holds one type: a live value of another type, or a saved value that does not read as the type, throws `IllegalStateException` naming the section. A section no installed addon declares stays in the save untouched. Player sections are experimental.

### Values per block

A `BlockSlice` is one kind of value an addon keeps per block in the world's own block data, outside the block: the world's mantle data on Bukkit, a per-dimension saved data file on modded. Declare it in `register` with `ContentRegistrar.blockSlice(path, type, codec)`; its `BlockSlice.Codec` writes one value to a `DataOutputStream` and reads it back in full. Read and write values with `BlockStore.get`, `set`, `remove` and `forEach`, which need a running core and a loaded world, and throw `IllegalStateException` for a slice no installed addon declares.

Each value is stored as the bytes its codec writes, under the slice id, so any number of addons may declare any number of slices on every platform, and two slices may share a value type. When the addon is installed again, its new declaration replaces the old one, and a slice object from the earlier install keeps working with the new codec as long as the id and the type name stay the same. Values of a slice no installed addon declares stay in the world data untouched. Block slices are experimental.

Other profile methods for content that records discoveries or food: `discover(kind, key)` and `discoverChunk(world, x, z)` report whether the player sees something for the first time; `consumeFood(cost, minimumFood)` pays an ability's hunger cost.

## Skill progress

`profile.skill(id)` returns a live `SkillProgress`; reads reflect later changes. A skill the player never touched reads as level 0 with no XP.

| Method | Does |
|---|---|
| `level()`, `xp()`, `xpToNextLevel()`, `knowledge()` | The line's level, total XP, XP missing for the next level, and unspent knowledge |
| `adaptations()` | Learned adaptations of the line and their levels |
| `isAvailable()` | Whether the line can change: its skill is registered and enabled, and for a mutated line both parents are registered |
| `award(XpAward)` | Grants XP. Fires `SkillXpEvent`; `xp()` and `level()` include the grant when it returns. `SkillLevelUpEvent` and the level-up knowledge follow on the player's next progress update, once per level gained |
| `setLevel(level)` | Sets the level by granting or removing exactly the XP it takes |
| `addKnowledge(amount)` | Adds knowledge, or removes it for a negative amount, never below 0. Fires `KnowledgeEvent` |
| `reset()` | Unlearns everything in the line without refund and sets XP and knowledge to 0 |

The write methods throw `IllegalStateException` on a line that is not available.

An `XpAward` describes the XP to grant:

| Factory | Award |
|---|---|
| `XpAward.of(amount)` | Administrative: granted exactly, with the player notified |
| `XpAward.gameplay(amount, source)` | Gameplay XP from a named source; multipliers and anti-farm rules apply |
| `.silent()` | The same award with no ticker line or sound |
| `.at(loc)` | Where the XP was earned, for the floating number and area effects |
| `.from(label)` | Another source label |

The amount must be positive and finite, and the source at most 160 characters. The example's `/adapt geology xp <amount>`, from `GeologyConsole.java`:

```java
SkillProgress progress = profile.skill(GeologyAddon.GEOLOGY);
progress.award(XpAward.of(invocation.get(AMOUNT)).from("console"));
return "xp=" + progress.xp() + " level=" + progress.level();
```

## Learning and unlearning

`/adapt geology learn <adaptation> <level> [force]` and `unlearn <adaptation>`, from `GeologyConsole.java`:

```java
LearnOptions options = invocation.find(FORCE).orElse(false) ? LearnOptions.forced() : LearnOptions.paying();
LearnResult result = profile.learn(invocation.get(ADAPTATION), invocation.get(LEVEL), options);
```

```java
"status=" + profile.unlearn(invocation.get(ADAPTATION), 0, LearnOptions.forced()).status()
```

`learn` raises an adaptation to a level above the current one; `unlearn` lowers it to a level below, and 0 drops it.

| `LearnOptions` | Behaviour |
|---|---|
| `paying()` | What a player clicking the menu gets: knowledge, power and the learning economy are charged and every rule applies |
| `forced()` | What an admin command does: nothing is charged or refunded, and power and permanence are not checked. Requirements still apply |
| `.quietly()` | The same, with no sound, toast or message for the player |

`LearnResult` holds the `status()`, `fromLevel()`, `toLevel()` and the `knowledge()` spent or refunded. `succeeded()` is true for `LEARNED` and `UNLEARNED`. A `switch` over `LearnResult.Status` needs a `default` branch, since a minor version may add statuses.

| Status | Meaning |
|---|---|
| `NO_CHANGE` | The target level is the current level, or on the wrong side of it |
| `UNAVAILABLE` | The id is not a registered, enabled adaptation, or its skill line is not available to the player |
| `INSUFFICIENT_POWER`, `INSUFFICIENT_KNOWLEDGE`, `INSUFFICIENT_FUNDS` | The player cannot pay |
| `ECONOMY_UNAVAILABLE`, `ECONOMY_FAILED` | The learning economy could not charge |
| `PERMANENT` | The adaptation is permanent and cannot be unlearned |
| `REQUIREMENTS_MISSING` | A required adaptation is not learned at the needed level. Core Sample answers this until the player holds `adapt:pickaxe/gem_polish` at level 1 |
| `REQUIRED_BY_DEPENDENTS` | Another learned adaptation requires this one at its current level |
| `CANCELLED` | A listener cancelled the event |

## Preferences

`profile.preferences()` returns the player's `PreferenceStore`, keyed by the id of the skill or adaptation that declares each preference. `/adapt geology delivery <drop|inventory>`, from `GeologyConsole.java`:

```java
"set=" + profile.preferences().set(CoreSample.ID, CoreSample.DELIVERY, invocation.get(DELIVERY)) + " now="
    + profile.preferences().get(CoreSample.ID, CoreSample.DELIVERY)
```

| Method | Does |
|---|---|
| `get(owner, preference)` | The value in effect: the saved choice if the server permits it at the player's level, else the default |
| `saved(owner, name)` | The saved choice by name, permitted or not |
| `set(owner, preference, value)`, `set(owner, name, value)` | Saves a choice; false when the owner has no such preference, the value is not a choice, or the server does not permit it |
| `clear(owner, name)` | Removes the saved choice |

## Orphaned progress

Saved progress whose addon is not installed stays in the player's save untouched and counts toward nothing until the addon returns. `orphans()` lists it as `OrphanedLine` values. A mutated line with a missing parent is listed too, suspended until the parent returns ([Mutations](/adapt/47-api-mutations#when-a-provider-is-missing)). With the example uninstalled, a player who played Geology and learned Aftershock has two: the whole `example:geology` line, and `example:pickaxe/aftershock` alone inside the `adapt:pickaxe` line.

| Accessor | Holds |
|---|---|
| `line()` | The saved line: `OrphanedLine.Line` with the skill id, or `OrphanedLine.Pair` with the `SkillPair` of a mutated line. `Key` is sealed to these two |
| `adaptation()` | The orphaned adaptation when only that is missing, inside a line whose skill is still registered; empty for a whole line |
| `namespace()` | The namespace whose addon would bring it back |
| `xp()` | XP of an orphaned line; 0 for a single adaptation |
| `knowledge()` | Knowledge held in an orphaned line; for a single adaptation, the knowledge its levels cost, which a refund returns |
| `adaptations()` | Learned levels inside an orphaned line |

A single orphaned adaptation stands for that adaptation alone. The line that holds it, here the player's Pickaxes XP, level, knowledge and other adaptations, is never part of the orphan.

`refundOrphans(namespace)` deletes the namespace's orphaned adaptations that sit inside registered lines and returns to those lines exactly the knowledge the player paid for them; levels a region grant gave return nothing. It returns the knowledge refunded. Whole orphaned lines are left for `purgeOrphans(namespace)`, which deletes every orphan of the namespace without refund, splitting mutations with a missing parent first, and returns how many it deleted. Admins do the same with [`/adapt orphans list|refund|purge`](/adapt/04-commands-permissions#orphaned-progress).

## Server settings

`AdaptApi.settings()` is a read-only view of `adapt.toml` for content that should follow the server's choices the way the built-in skills do.

| Method | True when |
|---|---|
| `advancements()` | Advancements are registered and granted at all |
| `adaptationsInCreative()` | Adaptations act for players in creative mode |
| `particles()`, `sounds()` | World effects may show particles or play sounds; each component narrows this with its own switch |
| `progressionSounds()` | Level-up and learn cues play their sounds |
| `isGrowthBlacklisted(block)` | The admin excluded the block from every growth effect |
| `hungerEffectPausesHunterAdaptations()` | Adaptations that act on hunger and damage stay off while the player has the Hunger effect |
| `hardcoreResetOnDeath()` | A player's death wipes their Adapt progress |
| `hardcoreNoRefunds()` | Unlearning refunds nothing |
| `customModels()` | Items and menu icons get the custom models of `models.toml` |
| `menuBackButton()` | Menus with a parent menu show a Back button |
| `escapeClosesAllMenus()` | Escape closes every open Adapt menu instead of returning to the parent |

`activatorBlockName()` names the block that opens the Adapt menu, for help text, and `overchargeStrength()`, which is experimental, is the multiplier an upgrade's overcharge puts on its effect.
