---
title: "API - Mutations"
description: "Mutating players' skills, mutation kits and blocks, upgrades and tools, the default kit, pair content, mutated ids and missing providers. Experimental"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

> The whole `art.arcane.adapt.api.mutation` package, `MutationResult`, `SkillMutateEvent`, `SkillUnmutateEvent`, and the mutation members of `SimpleSkill`, `Skill`, `ContentCatalog`, `ContentRegistrar` and `PlayerProfile` are experimental: they carry `@ApiStatus.Experimental` and may change in a minor version while the mutation system is tuned. Everything on this page runs, the same way for built-in and addon skills.
{.is-info}

A mutation merges two of a player's skills into one mutated skill line. How players use mutations is described in [Mutations](/adapt/35-mutations).

Any two skills merge, in either order, with no table naming the pair. Each skill brings a kit of six blocks; the five adaptations of a mutation are assembled from the two kits by fixed recipes. A skill without a kit gets one Adapt generates. Pair-specific content, a hand-made signature, a hand-written description or a name, is optional and registered separately.

## Mutating a player's skills

The example merges Geology with another skill both ways. From `GeologyConsole.java`, `/adapt geology mutate <partner>` makes Geology the lead and `/adapt geology lead <partner>` makes it the partner:

```java
MutationResult result = profile.mutate(GeologyAddon.GEOLOGY, invocation.get(PARTNER));
return "status=" + result.status() + " pair=" + result.pair().map(Object::toString).orElse("none");
```

```java
MutationResult result = profile.mutate(invocation.get(PARTNER), GeologyAddon.GEOLOGY);
```

`mutate(lead, partner)` merges the two skills into a mutation that `lead` leads. `unmutate(skill)` splits the mutation the skill is part of and refunds its adaptations; `skill` may be either parent. `mutations()` lists the player's pairs and `mutationOf(skill)` finds the pair a skill is in. Call them from the thread that owns the player. Each fires `SkillMutateEvent` or `SkillUnmutateEvent` first, and a listener can cancel it.

`/adapt geology mutation` reports the player's Geology mutation:

```java
Optional<SkillPair> pair = profile.mutationOf(GeologyAddon.GEOLOGY);
if (pair.isEmpty()) {
  return "pair=none";
}
SkillProgress line = profile.skill(pair.get().lead());
```

| `MutationResult.Status` | Meaning |
|---|---|
| `MUTATED`, `UNMUTATED` | Done; `pair()` holds the pair |
| `UNKNOWN_SKILL` | An id is not a registered skill |
| `UNAVAILABLE_SKILL` | A skill is disabled or vetoed |
| `SAME_SKILL` | Lead and partner are the same |
| `ALREADY_MUTATED` | A skill is already part of a mutation |
| `NOT_MUTATED` | `unmutate` named a skill that is in no mutation |
| `LEVEL_TOO_LOW` | A skill is below the server's required level |
| `LIMIT_REACHED` | The player has the most mutations the server allows |
| `CANCELLED` | A listener cancelled the event |

## Pairs, slots and ids

A `SkillPair` is a lead and a partner, both single-segment skill ids. `(a, b)` and `(b, a)` are different mutations: the lead gives the mutation its noun and emblem, the partner its adjective and trim. `involves(skill)` and `other(skill)` answer for either parent.

| Form | Example |
|---|---|
| `pair.id()`, the mutated skill | `<lead ns>:mutated/<lead path>/<partner ns>/<partner path>`, such as `example:mutated/geology/adapt/pickaxe` |
| `pair.child(path)`, content the pair owns | `example:mutated/geology/adapt/pickaxe/graft` for the Graft adaptation |
| `Signature.id(slot)` | The mutated skill id followed by `/signature/<recipe>`, whichever addon registers it |
| `pair.key()`, the line in the player's save | `<lead>+<partner>` with both ids in full, such as `example:geology+adapt:pickaxe`. `SkillPair.parse(key)` reads one back, and is empty for anything that is not two different skill ids |
| `BlockKey.id()`, a skill's block | `<skill>/block/<slot>`, such as `example:geology/block/fuel` |

Mutated ids are never parsed; they only name content. The `+` of a line key cannot occur in an id, so a line key splits without knowing any skill.

Every mutation owns five adaptations, one per `Recipe`:

| `Recipe` | Built from |
|---|---|
| `GRAFT` | The lead's Trigger sets off the partner's Strike |
| `ECHO` | The partner's Trigger sets off the lead's Strike |
| `BARTER` | A gesture pays the partner's Fuel for the lead's Boon |
| `ATTUNEMENT` | While the lead's State holds, the partner's Boon is granted on an interval |
| `CONVERGENCE` | The lead's Trigger while the partner's State holds runs both Strikes |

A `MutationSlot` is a pair and a recipe, and `adaptationKey()` is the recipe name in lower case. `AdaptApi.content().mutated(slot)` returns the adaptation a slot holds, its signature if one is registered, once the pair's mutated skill is built.

## Kits

A kit is everything one skill brings to a mutation, built with `MutationKit.builder()` and passed once to `registerMutationKit` in the skill's constructor. Geology's, from `GeologyKit.java`:

```java
public static MutationKit create() {
  String skill = TextKeys.skill(GeologyAddon.GEOLOGY);
  return MutationKit.builder()
      .words(Text.key(skill + ".mutated.noun"), Text.key(skill + ".mutated.adjective"))
      .trigger(TriggerKind.WORK, Trigger::new)
      .strikes(FightStrike::new, WorkStrike::new)
      .boon(Boon::new)
      .fuel(Fuel::new)
      .state(State::new)
      .sounds(SoundPalette.of(Sounds.BLOCK_STONE_BREAK, Sounds.BLOCK_DEEPSLATE_BREAK,
          Sounds.BLOCK_AMETHYST_BLOCK_CHIME, Sounds.BLOCK_STONE_HIT))
      .tint(Rgb.of(0x8A6F4E))
      .build();
}
```

| Builder call | Required | Declares |
|---|---|---|
| `trigger(TriggerKind, factory)` | Yes | The Trigger block, and whether it is a `FIGHT`, `WORK` or `EITHER` action |
| `strikes(fight, work)` | Yes | The fight and work Strike blocks |
| `boon(factory)` | Yes | The Boon block |
| `fuel(factory)` | Yes | The Fuel block |
| `state(factory)` | Yes | The State block |
| `sounds(SoundPalette)` | Yes | Fight, work and boon cues and a quiet tick, mixed with the other parent's when a mutated adaptation fires |
| `words(noun, adjective)` | No | The mutation's name parts; by default the messages `<skill key>.mutated.noun` and `.mutated.adjective` |
| `tint(Rgb)` | No | Colour of mutated tiles; by default the skill's colour |
| `upgrade(id, factory, sources, fuses)` | No | An upgraded adaptation that stands in for `sources`, adaptations of the same skill, and keeps the code of those in `fuses` running |
| `toolUpgrade(id, factory, sources, fuses)` | No | The same for an upgrade that hands the player a craftable tool; it is priced a little higher |
| `reserve(first, more...)` | No | Barter gestures the skill's own abilities already use, which no Barter of this skill uses |

Setting a block slot a second time throws `IllegalStateException` at once. `build()` throws `IllegalStateException` when a block is missing, and `NullPointerException` when the trigger or the sounds are missing.

The mutated tile draws the lead's `textures/gui/emblem/<path>.png` under the partner's `textures/gui/trim/<path>.png`, each from its own addon's [asset bundle](/adapt/46-api-art-themes#asset-bundle), and generates either from the kit's tint when it is absent.

### The default kit

A skill that registers no kit gets one Adapt generates. Its Trigger is earning that skill's XP, its Strikes are a short Weakness and Slowness or a short Haste, its Boon a little Regeneration, its Fuel a little hunger, and its State having earned the skill's XP in the last few seconds. Its words are the skill's name, its tint the skill's colour, and it has no upgrades and reserves no gesture. Its six blocks are real blocks with the ids `<skill>/block/<slot>` and their own config files, so a kit-less skill still mutates with any other.

## Blocks

Each block is a class extending one of `TriggerBlock`, `StrikeBlock` (with `StrikeForm.FIGHT` or `WORK`), `BoonBlock`, `FuelBlock` or `StateBlock`, each taking the skill's id in its constructor. A block listens, ticks and loads config like an adaptation, but no player learns it: it runs for a player who holds a mutated adaptation built from it, has one level, and never pays skill XP. Its config extends `MutationBlock.Config`, and its one-line phrase, which generated descriptions are assembled from, is the message `<skill key>.block.<slot>` (`TextKeys.block(skill, slot)`).

Geology's Trigger fires when a player who holds a mutated adaptation breaks natural stone. From `GeologyKit.java`:

```java
public static final class Trigger extends TriggerBlock<MutationBlock.Config> {
  public Trigger() {
    super(GeologyAddon.GEOLOGY);
    registerConfiguration(MutationBlock.Config.class);
    setIcon(Id.minecraft("stone"));
  }

  @Handle(priority = EventPriority.MONITOR)
  public void on(BlockBreakEvent event) {
    PlayerRef player = event.player();
    if (hasActiveAdaptation(player) && Rocks.isStone(event.block().type())) {
      fire(player, null, event.block().location(), false);
    }
  }
}
```

Its work Strike grants Haste that grows with the mutated adaptation's level:

```java
@Override
public Outcome strike(BlockUse use) {
  addPotionStacks(use.player(), HASTE, 0, (int) use.scaled(40D, 160D), false);
  return Outcome.INSTANT;
}
```

| Block | Implements |
|---|---|
| `TriggerBlock` | `@Handle` methods that call `fire(player, target, at, farmed)` or `fireKill(killer, victim)` once the action happened |
| `StrikeBlock` | `Outcome strike(BlockUse use)` |
| `BoonBlock` | `Outcome grant(BlockUse use)` |
| `FuelBlock` | `canPay(BlockUse use)` and `pay(BlockUse use)`; Geology's Fuel pays with `payHunger(use, 1)` |
| `StateBlock` | `holds(PlayerRef player)`; Geology's holds while the player has a pickaxe in the main hand |

A `BlockUse` carries the player, the mutated adaptation that runs, its slot and level, the target of a fight Strike or the location of a work Strike, the skill that started the run, and the adaptation a Fuel charges through. `power()` runs from 0 at level 1 to 1 at the top level, and `scaled(atFirst, atTop)` lies on that line. An `Outcome` is `MISSED`, `INSTANT`, or `lasting(entity, ticks)` for an effect the engine plays the quiet tick for.

`Mutations.farmed(player, entity)`, `farmed(block)` and `farmedHarvest(crop)` tell a block whether its action came from a spawner, a placed block, bone meal or the like, which the `farmed` argument of `fire` passes on.

## Upgrades and tools

A `SkillUpgrade` is a stronger adaptation that stands in for its sources once its skill is mutated. It is declared in the kit with `upgrade` or `toolUpgrade`, and its id must match the declaration, conventionally `<skill>/upgrade/<slug>`. It ticks, listens and loads config like any adaptation, but its level is 0 for every player who has not mutated that skill. Its config extends `SkillUpgrade.Config`, or `SkillUpgrade.ToolConfig` for a tool upgrade.

The kit's `UpgradeDeclaration` lists both sets. A player who learns an upgrade stops holding its `sources`, and what they unlocked, such as recipes, brewing and kept settings, reads the level the upgrade lends. `fuses` names the sources whose own code keeps running for that player: every level and active-level query of such an original reads the level the upgrade lends. A source left out of `fuses` stays at 0 for that player, for an upgrade that replaces it with code of its own, and another upgrade may still fuse it. A name in `fuses` that is not one of the sources throws `IllegalArgumentException`. Code that a source unlocked reads its level through `Mutations.level(original, levelOf)` instead of its own level alone, `Mutations.fused(original)` tells whether any upgrade of the skill fuses it, `Mutations.landed(original, player)` tells the fusing upgrades an effect landed, and `Mutations.strength(original, player)` is the multiplier a held upgrade puts on what the original grants.

| `SkillUpgrade` | Does |
|---|---|
| `declareOvercharge()` | Call in the constructor: the upgrade may spend the partner skill's Fuel for a stronger effect. It then needs the message `<upgrade key>.overcharge` and gets the `OVERCHARGE` preference |
| `overcharge(player)` | When the effect fires: pays the partner's Fuel and returns the server's overcharge strength, or 1 when the player has it off or cannot pay |
| `registerTool(tool)` | Hands out a `MutationTool` |
| `upgradePreferences()` | The upgrade's own preferences, in place of `getPlayerPreferences()` |
| `getSources()`, `isSource(original)` | The originals it stands in for |
| `getFuses()`, `fuses(original)` | The sources whose code keeps running at the level it lends |
| `lend(original, level)` | The level it lends a source at its own `level`: the source's top level at the upgrade's top level, one less for each level short of it, never below 1 |

A `MutationTool<D>` is a craftable item an upgrade or signature hands out, built from a `CustomItem.Definition<D>`, its owner and the owner level it needs. It implements `recipes()` and `use(ToolUse)`; its recipes need the owner at that level, and a click with it reaches `use` only for a player who holds the owner at that level. `create(data)`, `read(stack)`, `write(stack, data)` and `is(stack)` work its stacks. A tool whose pair is not registered on the server behaves as its plain base item.

## Pair content

Pair content replaces what the recipes generate for one pair. Register it in `AdaptAddon.register`; either parent may belong to any addon. The example registers none, so Geology and Pickaxes mutate from their kits alone; the samples below show what it would add for that pair.

| `ContentRegistrar` | Registers |
|---|---|
| `signature(lead, partner, recipe, factory)` | The hand-made effect of one slot, replacing the adaptation its recipe would generate. The factory takes the `MutationSlot` |
| `pairText(lead, partner, recipe, PairText)` | A hand-written description of one slot, and optionally the blocks it runs. Ignored for a slot that has a signature |
| `pairName(lead, partner, Text)` | The mutation's name in place of the partner's adjective and the lead's noun |

```java
registrar.pairName(GeologyAddon.GEOLOGY, GeologyAddon.PICKAXE, Text.key("example.pair.quarrying"));
registrar.pairText(GeologyAddon.GEOLOGY, GeologyAddon.PICKAXE, Recipe.GRAFT,
    PairText.of(Text.key("example.pair.quarrying.graft")));
```

Each slot takes one signature and one text, and each pair one name, across every installed addon. A second claimant is refused when it installs, and the refusal names both namespaces. A claim for a pair whose other parent is not installed waits and applies when it is; uninstalling the claiming addon withdraws its claims.

`PairText.of(description)` replaces the description only. `PairText.recentState(description, seconds)` also lets the State count when it held at any point in the last `seconds`, and `withBlocks(blocks)` runs other blocks, given as `BlockKey` values, instead of the recipe's.

A signature extends `Signature<C>`, where `C` extends `Signature.Config`. Its constructor takes the slot and passes it to `super`. It implements `Outcome run(BlockUse use)` and calls `fire(player, target, at, farmed)` from its `@Handle` methods once its action happened; the engine then checks the level, the cooldown and the farm rule, runs `run` and plays the pair's sounds. A Barter or Attunement signature needs no handler: the engine fires it on the pair's gesture or interval.

```java
public final class Quarry extends Signature<Signature.Config> {
  public Quarry(MutationSlot slot) {
    super(slot);
    registerConfiguration(Signature.Config.class);
  }

  @Handle(priority = EventPriority.MONITOR)
  public void on(BlockBreakEvent event) {
    if (Rocks.isOre(event.block().type())) {
      fire(event.player(), null, event.block().location(), false);
    }
  }

  @Override
  public Outcome run(BlockUse use) {
    giveExp(use.player(), (int) use.scaled(4D, 12D));
    return Outcome.INSTANT;
  }
}
```

```java
registrar.signature(GeologyAddon.GEOLOGY, GeologyAddon.PICKAXE, Recipe.CONVERGENCE, Quarry::new);
```

No player learns a signature: its level for a player is their level in the mutated adaptation it replaces, which keeps the recipe's price, level count and power slot. `paysOut()` returns true for an effect that gives items, XP, healing, repairs or growth, which then does not run for a farmed action; `cooldownMillis(level)` defaults to the recipe's cooldown; `addSignatureStats(level, lines)` adds stat lines. Adapt builds the pair of every registered signature when the core starts, so its listeners and recipes are live before anyone mutates.

Pair messages are in the registering addon's bundle, below `TextKeys.pair(namespace, slot)`: `<namespace>.pair.<lead>.<partner>.<recipe>` with both ids dotted, such as `example.pair.example.geology.adapt.pickaxe.convergence`. A signature reads `.name`, `.description` and its stat labels `.lore1`, `.lore2` there.

## When a provider is missing

Uninstalling the addon of either parent suspends the mutated line. The player's save keeps it, untouched; it counts toward nothing and is listed by `PlayerProfile.orphans()` ([Players and content](/adapt/48-api-players-content#orphaned-progress)). Installing the addon again resumes it.

An admin splits a suspended line with `/adapt unmutate <player> <skill>`, which gives the parent that is still installed its line back, or through `PlayerProfile.unmutate`. `purgeOrphans(namespace)` and `/adapt orphans purge` split a suspended line first and then delete the missing parent's part.
