---
title: "API - Adaptations"
description: "Defining an adaptation: config, costs, requirements, levels, preferences, stat lines, recipes, custom items, HUD, pulses and threading"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

An adaptation extends `SimpleAdaptation<C>`, where `C` extends `AdaptationConfig`. A skill registers its own adaptations with `registerAdaptation` ([Skills and XP](/adapt/43-api-skills)); an addon adds one to another addon's skill with `ContentRegistrar.adaptation` ([Addons](/adapt/42-api-addons)). Which skill an adaptation belongs to is decided by where it is registered, never by its id.

The example's five adaptations each show one kind:

| Class | Kind |
|---|---|
| `Prospect` | An active ability with a cooldown, HUD status and effects |
| `CoreSample` | A block-break effect with a preference and a requirement on a built-in adaptation |
| `GeodeLens` | A custom item and the recipe that unlocks with the adaptation |
| `StoneSkin` | A passive bonus kept up on a timer |
| `Aftershock` | An adaptation on the built-in Pickaxes skill |

## Prospect

Sneak and right-click stone with a pickaxe to mark nearby ore, then wait out the cooldown. `Prospect.java`:

```java
package com.example.geology;

import art.arcane.adapt.api.config.ConfigDoc;
import art.arcane.adapt.api.content.AdaptationConfig;
import art.arcane.adapt.api.content.Cooldowns;
import art.arcane.adapt.api.content.SimpleAdaptation;
import art.arcane.adapt.api.content.StatLines;
import art.arcane.adapt.api.fx.FxPriority;
import art.arcane.adapt.api.fx.Particles;
import art.arcane.adapt.api.fx.Sounds;
import art.arcane.adapt.api.hud.HudStatus;
import art.arcane.adapt.api.text.Format;
import art.arcane.adapt.platform.entity.PlayerRef;
import art.arcane.adapt.platform.event.Handle;
import art.arcane.adapt.platform.event.player.InteractAction;
import art.arcane.adapt.platform.event.player.PlayerInteractEvent;
import art.arcane.adapt.platform.value.Id;
import art.arcane.adapt.platform.world.BlockRef;
import art.arcane.adapt.platform.world.WorldRef;

import java.util.ArrayList;
import java.util.List;

public final class Prospect extends SimpleAdaptation<Prospect.Config> {
  public static final Id ID = Id.of(GeologyAddon.NAMESPACE, "geology/prospect");
  public static final String USES_STAT = "example.geology.prospects";

  private final Cooldowns cooldowns = cooldowns();

  public Prospect() {
    super(ID);
    registerConfiguration(Config.class);
    setIcon(Id.minecraft("spyglass"));
  }

  @Override
  public void addStats(int level, StatLines lines) {
    statLore(lines, Format.f(radius(level, false)), 1);
    statLore(lines, Format.duration(cooldown(level), 1), 2);
  }

  @Handle
  public void on(PlayerInteractEvent event) {
    PlayerRef player = event.player();
    if (event.action() != InteractAction.RIGHT_CLICK_BLOCK || !player.isSneaking() || !Rocks.isPickaxe(event.item())) {
      return;
    }
    int level = getActiveLevel(player);
    if (level <= 0) {
      return;
    }
    long cooldown = cooldown(level);
    if (!cooldowns.isReady(player.uuid(), cooldown)) {
      return;
    }
    cooldowns.mark(player.uuid());
    HudStatus.cooldown(player, this, cooldown);
    List<BlockRef> ores = scan(event.clickedBlock(), radius(level, GeodeLens.holds(player)));
    for (BlockRef found : ores.subList(0, Math.min(ores.size(), getConfig().maxMarkers))) {
      fx(found.location().add(0.5D, 0.5D, 0.5D), FxPriority.GAMEPLAY).only(player).burst(Particles.WAX_OFF, 6, 0.3D);
    }
    fx(player.location(), FxPriority.GAMEPLAY).sound(Sounds.BLOCK_AMETHYST_BLOCK_CHIME, 0.8F, ores.isEmpty() ? 0.6F : 1.4F);
    HudStatus.show(player, this, text("hud.found").with("count", ores.size()));
    addStat(player, USES_STAT, 1D);
  }

  private static List<BlockRef> scan(BlockRef center, int radius) {
    WorldRef world = center.world();
    List<BlockRef> ores = new ArrayList<>();
    for (int x = -radius; x <= radius; x++) {
      for (int y = -radius; y <= radius; y++) {
        for (int z = -radius; z <= radius; z++) {
          BlockRef block = world.blockAt(center.x() + x, center.y() + y, center.z() + z);
          if (Rocks.isOre(block.type())) {
            ores.add(block);
          }
        }
      }
    }
    return ores;
  }

  private int radius(int level, boolean lens) {
    int radius = getConfig().baseRadius + getConfig().radiusPerLevel * level;
    return lens ? radius * 2 : radius;
  }

  private long cooldown(int level) {
    return Math.max(getConfig().minimumCooldownMillis, getConfig().cooldownMillis - getConfig().cooldownCutPerLevel * level);
  }

  public static final class Config extends AdaptationConfig {
    @ConfigDoc("Scan radius in blocks before levels.")
    public int baseRadius = 2;
    @ConfigDoc("Scan radius added per level.")
    public int radiusPerLevel = 1;
    @ConfigDoc("Cooldown in milliseconds before levels.")
    public long cooldownMillis = 30000L;
    @ConfigDoc("Milliseconds taken off the cooldown per level.")
    public long cooldownCutPerLevel = 4000L;
    @ConfigDoc("Shortest possible cooldown in milliseconds.")
    public long minimumCooldownMillis = 8000L;
    @ConfigDoc("Most ore blocks marked with particles per use.")
    public int maxMarkers = 24;

    public Config() {
      baseCost = 3;
      initialCost = 2;
      costFactor = 0.5D;
      maxLevel = 5;
    }
  }
}
```

The scan reads every block in the cube at once on the event's thread, which is fine for Prospect's small radius. A wider search belongs in a [block scan](/adapt/50-api-abilities-protection#block-scans), which spreads its reads over ticks.

## The constructor

| Call | Declares |
|---|---|
| `super(id)` | The adaptation's id, in the namespace of the addon that registers it |
| `registerConfiguration(Config.class)` | The config class. Call it first |
| `setIcon(Id item)` | An item icon with the adaptation's sprite by convention. `setIcon(Icon)` sets any [icon](/adapt/46-api-art-themes#icons) |
| `registerRecipe(RecipeSpec)` | A recipe only players who learned the adaptation can craft |
| `registerBrewingRecipe(BrewingRecipe)` | A brewing recipe only stands owned by a learner brew |
| `registerItem(CustomItem.Definition)` | A custom item the adaptation makes or uses; returns the definition |
| `registerAdvancement`, `registerMilestone` | As for a skill, see [advancements](/adapt/43-api-skills#advancements-and-milestones) |
| `needs(PlatformNeed...)` | What the adaptation needs from the Minecraft version |
| `pulseOwners(cadence, pulse)` | A periodic call for each online player who learned it, see [pulses](#pulses-and-ticking) |
| `setNameText(Text)`, `setDescriptionText(Text)` | Replace the conventional `.name` and `.description` messages |

`text("hud.found")` is the message `example.adaptation.geology.prospect.hud.found`, below the adaptation's [convention key](/adapt/45-api-text#convention-keys).

## Config, costs and requirements

The file is `adaptations/<namespace>/<path>.toml` in Adapt's data folder, `adaptations/example/geology/prospect.toml` for Prospect and `adaptations/example/pickaxe/aftershock.toml` for Aftershock. Set prices in the config's no-argument constructor, so an admin can change them.

| `AdaptationConfig` field | Default | Effect |
|---|---|---|
| `enabled` | `true` | `false` disables the adaptation |
| `permanent` | `false` | `true` stops players from unlearning it once bought |
| `baseCost` | `4` | Knowledge base cost of a level |
| `initialCost` | `2` | Extra knowledge for level 1 |
| `costFactor` | `0.45` | Growth of the cost per level |
| `maxLevel` | `5` | Highest level |
| `requires` | empty | Adaptations the player must hold first |
| `showParticles`, `showSounds` | `true` | The adaptation's own effect switches |
| `setInterval` | `0` | Milliseconds between ticks; `0` keeps the adaptation's own interval |
| `playerPreferences` | empty | Server policies for its player preferences |

One level costs `max(1, baseCost + baseCost * level * costFactor)` knowledge, plus `initialCost` at level 1. `getCostFor(level)` gives one step and `getCostFor(level, fromLevel)` a range, which is also what unlearning refunds. Holding an adaptation uses one power at any level: `getPowerCostFor(level, fromLevel)` is 1 when the player starts holding it, -1 when they drop it, and 0 otherwise.

Each `requires` entry is `<namespace>:<path>@<level>`. Core Sample needs the built-in Gem Polish at level 1:

```java
public Config() {
  baseCost = 3;
  initialCost = 1;
  costFactor = 0.45D;
  maxLevel = 5;
  requires = new ArrayList<>(List.of("adapt:pickaxe/gem_polish@1"));
}
```

An entry without a namespace is in the namespace of the adaptation that lists it: `geology/prospect@2` in an `example` adaptation's config means `example:geology/prospect@2`. Name the namespace to require another addon's or a built-in adaptation. Learning or raising the adaptation is refused with `REQUIREMENTS_MISSING` until every entry is met, and the required adaptations cannot be unlearned below that level while this one is held. `getRequirements()` returns the parsed entries, and `AdaptationRequirement.parse(entry, namespace)` parses one. Malformed entries are skipped with a logged warning.

## Learned and active levels

The learned level is what the player bought. The active level is the learned level when the adaptation may act for the player now, and 0 otherwise: the adaptation and its skill are enabled, the player has it switched on and holds its use permission, they are in an allowed world and game mode, and no conflicting adaptation is active. Gameplay code asks for an active level.

| Method | Returns |
|---|---|
| `getLevel(player)` | The learned level, capped by `maxLevel` |
| `getActiveLevel(player)`, `hasActiveAdaptation(player)` | The active level, or whether it is above 0 |
| `getActiveSurvivalLevel(player)` | The active level in survival or adventure only |
| `getActiveDeathLevel(player)` | The active level for a player who may be dead, for adaptations that prevent a death |
| `getActiveInteractLevel(player, loc)` | The active level when protections let the player interact at `loc` |
| `getActiveBlockBreakLevel(player, loc)`, `getActiveBlockPlaceLevel(player, loc)` | The same for breaking or placing |
| `getActiveDamageLevel(attacker, target)` | The active level when protections let the attacker damage `target` |
| `getActiveSiblingLevel(player, id)` | The active level of another adaptation of the same skill |

Core Sample and Aftershock react to a block break, so they ask for the level the protections allow there:

```java
int level = getActiveBlockBreakLevel(player, event.block().location());
```

`resolveMeleeContext(event)`, `resolveAttackContext(event)` and `resolveProjectileContext(event)` turn an `EntityDamageByEntityEvent` into the attacker, target, weapon or projectile and active level, or null when the adaptation may not act. `resolveInteractContext`, `resolveBlockBreakContext` and `resolveBlockPlaceContext` do the same for a block action.

`withActiveLevel(player, event, action)` runs `action` with the active level on the player's thread when that level is above 0 and the event is not cancelled. `withAdaptedPlayer` does the same for any learned level, and `withPlayerThread` only moves to the player's thread.

Call `canUse(player)` once per activation, right before the effect. It fires `AdaptationUseEvent` and asks every registered ability policy ([Abilities, protection and world](/adapt/50-api-abilities-protection)). Passive effects that never call it are not reported to policies.

### Raising the level an adaptation acts at

Override the protected `effectiveLevel(PlayerRef player, int activeLevel)` when something besides the learned level decides how strong the adaptation is, such as an item or an upgrade the player holds. `activeLevel` is the level Adapt resolved, 0 when the player has not learned the adaptation or it may not act now. The result, kept within 0 and `maxLevel`, is what `getActiveLevel`, `getActiveSurvivalLevel`, `getActiveDeathLevel`, `hasActiveAdaptation`, `withAdaptedPlayer` and `withActiveLevel` return.

```java
@Override
protected int effectiveLevel(PlayerRef player, int activeLevel) {
  return activeLevel > 0 && GeodeLens.holds(player) ? activeLevel + 1 : activeLevel;
}
```

A player who has not learned the adaptation still receives its move and jump handlers while this returns more than 0. A raised level still answers to the requirement or game mode the query names. The block and target queries, `getActiveBlockBreakLevel`, `getActiveDamageLevel` and the like, keep the resolved level, because their protection checks decide them. Read other adaptations through their active level, so their own checks apply. The default returns `activeLevel`.

## Player preferences

A preference is a choice each player makes for the adaptation: a toggle, a mode, a strength. Declare it once as a constant and return it from `getPlayerPreferences()`. Keep `CommonPreferences.ENABLED` in the list; it is the switch every adaptation has, and `isPlayerEnabled(player)` reads it. From `CoreSample.java`:

```java
public static final PlayerPreference<Delivery> DELIVERY = PlayerPreference.of("delivery", Delivery.class, Delivery.DROP,
    List.of(new PlayerPreference.Choice<>(Delivery.DROP, Id.minecraft("dropper"), 1),
        new PlayerPreference.Choice<>(Delivery.INVENTORY, Id.minecraft("chest"), 2)));

@Override
public List<PlayerPreference<?>> getPlayerPreferences() {
  return List.of(CommonPreferences.ENABLED, DELIVERY);
}
```

The inventory choice unlocks at Core Sample level 2. Neither the preference nor its choices carry a label, so their text comes from the convention keys below. The handler reads the player's choice with `preference(player, DELIVERY)`:

```java
ItemRef sample = AdaptApi.platform().host().items().create(pick(), 1);
if (preference(player, DELIVERY) == Delivery.INVENTORY) {
  safeGiveItem(player, sample);
} else {
  event.block().world().dropItemNaturally(event.block().location().add(0.5D, 0.5D, 0.5D).position(), sample);
}
```

| Factory | Makes |
|---|---|
| `CommonPreferences.toggle(id)` | An on/off choice that starts on |
| `CommonPreferences.toggle(id, Toggle.OFF)` | One that starts off |
| `CommonPreferences.scale(id)` | Full, half or quarter strength; `Scale.multiplier()` gives 1, 0.5 or 0.25 |
| `PlayerPreference.of(id, MyEnum.class, MyEnum.DEFAULT)` | A choice of every constant of an enum, each from level 1 |
| `PlayerPreference.of(id, type, default, choices)` | Explicit `Choice` values with labels, icons and the level that unlocks each |

`preference(player, PREF)` returns the value in effect, and `preferenceEnabled(player, toggle)` is true when a toggle is on. Each preference id matches `[a-z][a-z0-9-]*`.

Labels come from one of three places:

| Label | Shown |
|---|---|
| None | The convention key below the owner's key: `<owner key>.preference.<id>.name` for the preference, and `<owner key>.preference.<id>.choice.<value>` for each choice, the value in lower case |
| A key, `Text.key(...)` in `labelled` or a `Choice` | That message |
| A literal, `Text.literal(...)` | As written, in every language |

The owner key is the message key of the adaptation or skill that declares the preference, `example.adaptation.geology.core_sample` for Core Sample, so Delivery reads `example.adaptation.geology.core_sample.preference.delivery.name`, `.choice.drop` and `.choice.inventory`. Write the choices as a table of their own, since Adapt's TOML reader takes no dotted keys. In the example's `en_US.toml`:

```toml
[adaptation.geology.core_sample.preference.delivery]
name = "Where samples go"

[adaptation.geology.core_sample.preference.delivery.choice]
drop = "Drop on the ground"
inventory = "Straight to inventory"
```

 The choices of `toggle` and `scale` carry the shared keys `adapt.preferences.on`, `.off`, `.full`, `.half` and `.quarter`, which Adapt translates; only the preference's own label follows the convention.

An admin locks or restricts each preference in the config's `playerPreferences` map, keyed by preference id: `playerEditable`, `defaultValue` and `allowedValues`. Override `getPlayerPreferenceGroups()` to show many toggles behind one button with `PreferenceToggleGroup`, at most 45 toggles a group.

## Stat lines

`addStats(level, lines)` adds the lines shown under the description for one level, in the viewer's language.

| Helper | Adds |
|---|---|
| `statLore(lines, value, n)` | `+ <value> <label>`, the label being the message `lore<n>` of the adaptation |
| `statLore(lines, prefixColor, prefix, value, n)` | The same with another prefix |
| `statLore(lines, prefixColor, prefix, value, labelColor, label)` | Any prefix, colours and `Text` label |
| `unlockLore(lines, label)` | A line naming something the level unlocks, without a value |
| `lines.addLore(String)` | A finished line with `TextFormat` codes |

A floating-point value is cut to two decimals. `Format` formats numbers the same on every server locale: `Format.pc(0.125, 1)` is `12.5%`, `Format.f(12500L)` is `12,500`, `Format.duration(30000L)` is `30 seconds`, `Format.toRoman(4)` is `IV`. Prospect shows its radius with `Format.f` and its cooldown with `Format.duration(millis, 1)`.

## Recipes and custom items

Geode Lens registers a custom item and the shaped recipe for it. `GeodeLens.java`:

```java
public static final Id ITEM = Id.of(GeologyAddon.NAMESPACE, "geode_lens");
public static final CustomItem.Definition<CustomItem.Plain> LENS = CustomItem.builder(ITEM, Id.minecraft("amethyst_shard"))
    .maxStackSize(1)
    .build();

public GeodeLens() {
  super(ID);
  registerConfiguration(Config.class);
  setIcon(Id.minecraft("amethyst_shard"));
  registerItem(LENS);
  registerRecipe(RecipeSpec.shaped(Id.of(GeologyAddon.NAMESPACE, "geode_lens"),
      List.of(" A ", "AGA", " A "),
      Map.of('A', Ingredient.of(Id.minecraft("amethyst_shard")), 'G', Ingredient.of(Id.minecraft("glass_pane"))),
      LENS.create(1)));
}

public static boolean holds(PlayerRef player) {
  return LENS.is(player.inventory().offHand());
}
```

`registerRecipe` takes a `RecipeSpec`, made with `RecipeSpec.shaped`, `shapeless`, `cooking` (furnace, smoker, blast furnace, campfire), `stonecutting` or `smithing`. `withRequiredLevel(level)` returns a copy that needs that adaptation level before the recipe enters a player's recipe book and before a crafting grid lets them take the result; without it the level is 1. Each recipe validation message names the recipe key. `Ingredient.of(id)` matches one item type; `Ingredient.AnyOf`, `Tag`, `Exact` and `Matching` cover the rest.

A custom item is a vanilla base item that carries an id and typed data. `CustomItem.builder(id, baseItem)` makes an item without data, `CustomItem.builder(id, baseItem, codec, defaultData)` one with data in a `DataCodec` from `DataCodecs`.

| Builder | Effect |
|---|---|
| `allow(first, more...)` | Vanilla uses of the base item every stack keeps. Without it the item refuses all of them |
| `allowPerStack(rule)` | Decides the kept uses per stack |
| `recognisedBy(rule)` | Also recognises stacks made outside `create` |
| `consumableBy(rule)` | Which recipes may take the item as an ingredient. By default, recipes in the item's own namespace |
| `itemModel(Id)` | The resource pack model; by default `<namespace>:item/<path>` |
| `ownCooldownGroup()` | A cooldown group of its own, keyed by the item's id, so its cooldown never greys out the plain base item or another addon's item |
| `maxStackSize(int)` | 1 to 99 |

`VanillaUse` names what the guard refuses: `PLACE`, `USE`, `CONSUME`, `DISPENSE`, `FURNACE`, `WORKSTATION`, `INSERT`, `ENTITY`, `TRADE`. The Geode Lens allows none, so no vanilla station, villager or recipe outside the `example` namespace takes it.

`ItemCooldowns.forItem(definition)` drives the cooldown of an item built with `ownCooldownGroup()`, and throws `IllegalArgumentException` for an item without one; it is experimental.

On a definition, `create(amount)` and `create(data)` make stacks, `is(stack)` recognises one, and `read(stack)` and `write(stack, data)` access its data. Adapt names the item from `<namespace>.item.<path>.name` and adds `.lore1`, `.lore2` and on. Register an item used by an adaptation with `registerItem`; register an item that belongs to no adaptation with `ContentRegistrar.item`.

An adaptation that lets its learners brew potion mixes returns them from `getMixingRecipes()` as `MixingRecipe` values, so recipe views list them with its other recipes. It is experimental.

### Recipes an admin can change

A `ShapedRecipeConfig` field puts a shaped recipe in the config file with its defaults, so an admin can rewrite the grid, the ingredients and the result, or switch the recipe off. Register what it parses to:

```java
public ShapedRecipeConfig lensRecipe = new ShapedRecipeConfig()
    .rows(" A ", "AGA", " A ").key('A', "AMETHYST_SHARD").key('G', "GLASS_PANE").result("SPYGLASS", 1);
```

```java
getConfig().lensRecipe.toRecipe(Id.of(GeologyAddon.NAMESPACE, "geode_lens")).ifPresent(this::registerRecipe);
```

`toRecipe(key)` is empty when the recipe is disabled or does not parse, and each problem is logged as a warning naming the key. Ingredients are material names such as `AMETHYST_SHARD` or item tags such as `#planks`. The recipe key is in the addon's namespace.

## Saved values and HUD

`setStorage(player, key, value)` saves a string, number or boolean with the player's data, and `getStorage(player, key, fallback)` reads it, with typed forms such as `getStorageInt` and `getStorageBoolean`. `setStorage(player, key, null)` removes it.

| Helper | Shows |
|---|---|
| `HudStatus.show(player, this, text)` | A short line above the hotbar. Adapt arbitrates the action bar, so use this instead of sending action bar text |
| `HudStatus.ambient(player, this, message)`, `clearAmbient(player, this)` | A low-priority line that stays until cleared |
| `HudStatus.cooldown(player, this, millis)` | A cooldown glyph that starts now. Cooldowns under one second draw nothing and return false |
| `cooldowns.mark(uuid, millis)` | Starts a cooldown and shows its glyph. `mark(uuid)` starts one without a glyph |
| `HudStatus.charges(...)`, `toggle(...)` | Charge pips or an on/off glyph |
| `HudStatus.duration(uuid, this, startedAt, millis)` | A running effect; a duration of 0 runs until cleared |
| `HudStatus.duration(uuid, this, startedAt, millis, stacks, maxStacks)` | A running effect that also counts stacks, such as 3 of 5 |
| `HudStatus.clear(uuid, this, glyph)` | Removes one glyph |
| `Toast.of(icon, title, body).show(player)` | A themed card on a native client, a vanilla toast elsewhere |

Prospect marks its cooldown without a glyph and draws the glyph with `HudStatus.cooldown`. Glyph calls return false and do nothing for a player without the Adapt client mod; `HudStatus.capable(uuid)` tells whether the player's client draws them.

## Damage and death saves

Damage handlers that postpone damage instead of changing it implement `DamageDeferral`. An adaptation that keeps a player alive through a lethal hit implements `DeathSave`: Adapt runs the `EntityDamageEvent` handlers its content registers at `HIGHEST` priority in a fixed order, and only while the hit would still kill a player does it run the death saves, by the player's `DEATH_SAVE_PRIORITY` choice and then `defaultOrder()`. Saves share a cooldown through a `DeathSaveSlot`: `DeathSaveSlot.of(id)` names it and `activate(player, now, millis)` claims it.

Damage an ability deals to others goes through `AbilityDamage`, see [Abilities, protection and world](/adapt/50-api-abilities-protection#ability-damage).

## Pulses and ticking

`pulseOwners(cadenceMillis, pulse)` calls `pulse` for each online player who has learned the adaptation, about once every cadence per player, on that player's thread. Adapt spreads players over ticks and skips players whose data is not loaded. The cadence is a `LongSupplier` read before each pulse, so a config value can change it while the server runs. Call it from the constructor; the pulse stops when the adaptation unregisters.

```java
pulseOwners(() -> 1000L, this::reconcile);
```

A pulse runs only for players who hold the adaptation, so the line above would keep Stone Skin's armor up but never take it away from a player who unlearns it. `StoneSkin.java` ticks over every online player instead:

```java
@Override
public void onTick() {
  for (PlayerRef player : AdaptApi.platform().host().onlinePlayers()) {
    AdaptApi.scheduler().runEntity(player, () -> reconcile(player));
  }
}

@Override
public void unregister() {
  for (PlayerRef player : AdaptApi.platform().host().onlinePlayers()) {
    AdaptApi.scheduler().runEntity(player, () -> AdaptAttributeService.get().removeAll(player, getId().toString()));
  }
  super.unregister();
}

private void reconcile(PlayerRef player) {
  int level = getActiveLevel(player);
  if (level > 0) {
    AdaptAttributeService.get().apply(player, getId().toString(), SLOT, Attributes.ARMOR, armor(level),
        AttributeOperation.ADD_VALUE);
  } else {
    AdaptAttributeService.get().remove(player, getId().toString(), SLOT, Attributes.ARMOR);
  }
}
```

Its constructor sets `setInterval(1000L)`, so `onTick` runs once a second. `AdaptAttributeService` is experimental.

Override `usesLearnerBoundTicking()` to return true for an adaptation whose `onTick` only matters while a learner is online; Adapt then skips ticks while nobody online has learned it. `learnedCandidates(now)` lists the profiles of online learners.

## Threading

On Paper, Purpur, Spigot, Fabric, Forge and NeoForge, all gameplay runs on the server thread. On Folia, each region of the world has its own thread, and an entity or block may only be touched from the thread that owns it. Write every adaptation for Folia and it runs everywhere.

- A `@Handle` method runs on the thread that fired the event. The event's own player, entity and block belong to that thread, so the handler may touch them directly.
- Anything else, such as another player or a block in another chunk, may belong to another region. Check with `AdaptApi.scheduler().owns(entity)` or `owns(location)`, or move the work there with `runEntity(entity, task)` or `runAt(location, task)`.
- `onTick()` runs on the global region thread, which owns no entity. Schedule per-player work from it with `runEntity`, as Stone Skin does.
- Pulses, `withPlayerThread`, `withAdaptedPlayer`, `withActiveLevel` and the `shouldReturnForPlayer` forms that take an action run on the player's thread. On Folia that may be a later tick.
- Call `PlayerProfile` methods from the thread that owns the player: a method that changes progress throws `IllegalStateException` anywhere else. Progress events are fired there.
- `runAsync` work must not touch world, entity or player state. It returns a `TaskHandle`; cancelling it before the task starts keeps the task from running.
- Keep a player's or entity's `uuid()` across ticks, not the reference.
