---
title: "API - Skills and XP"
description: "Defining a skill with SimpleSkill, its config, tool checks, XP sources, the XP guide, advancements, learner pulses and ticking"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

A skill extends `SimpleSkill<C>`, where `C` is its config class. Register it with `ContentRegistrar.skill` ([Addons](/adapt/42-api-addons)).

## The geology skill

`GeologySkill`, from `examples/example-content`:

```java
package com.example.geology;

import art.arcane.adapt.api.advancement.AdaptAdvancement;
import art.arcane.adapt.api.config.ConfigDoc;
import art.arcane.adapt.api.content.SimpleSkill;
import art.arcane.adapt.api.content.SkillConfig;
import art.arcane.adapt.api.content.XpSource;
import art.arcane.adapt.api.text.Text;
import art.arcane.adapt.api.text.TextKeys;
import art.arcane.adapt.platform.advancement.AdvancementFrame;
import art.arcane.adapt.platform.advancement.AdvancementVisibility;
import art.arcane.adapt.platform.entity.PlayerRef;
import art.arcane.adapt.platform.event.EventPriority;
import art.arcane.adapt.platform.event.Handle;
import art.arcane.adapt.platform.event.block.BlockBreakEvent;
import art.arcane.adapt.platform.value.Id;
import art.arcane.adapt.platform.value.Rgb;

import java.util.List;

public final class GeologySkill extends SimpleSkill<GeologySkill.Config> {
  public static final String ROCKS_STAT = "example.geology.rocks";
  private static final String ROCKS_ADVANCEMENT = "geology_rocks_100";

  private final XpSource stone = xpSource("stone");
  private final XpSource ore = xpSource("ore");

  public GeologySkill() {
    super(GeologyAddon.GEOLOGY);
    registerConfiguration(Config.class);
    setColor(Rgb.of(0x8A6F4E));
    setIcon(Id.minecraft("tuff"));
    registerAdaptation(StoneSkin.ID, StoneSkin::new);
    registerAdaptation(Prospect.ID, Prospect::new);
    registerAdaptation(CoreSample.ID, CoreSample::new);
    registerAdaptation(GeodeLens.ID, GeodeLens::new);
    registerGroup(text("group.field"), List.of(StoneSkin.ID, Prospect.ID, CoreSample.ID));
    registerGroup(text("group.workshop"), List.of(GeodeLens.ID));
    xpNote(text("xp_note"));
    registerAdvancement(AdaptAdvancement.builder()
        .key(ROCKS_ADVANCEMENT)
        .icon(Id.minecraft("cobblestone"))
        .title(Text.key(TextKeys.advancement(GeologyAddon.GEOLOGY, ROCKS_ADVANCEMENT) + ".title"))
        .description(Text.key(TextKeys.advancement(GeologyAddon.GEOLOGY, ROCKS_ADVANCEMENT) + ".description"))
        .frame(AdvancementFrame.TASK)
        .visibility(AdvancementVisibility.VANILLA)
        .build());
    registerMilestone(ROCKS_ADVANCEMENT, ROCKS_STAT, 100D, () -> getConfig().milestoneReward);
    registerMutationKit(GeologyKit.create());
  }

  @Handle(priority = EventPriority.MONITOR)
  public void on(BlockBreakEvent event) {
    PlayerRef player = event.player();
    Id type = event.block().type();
    shouldReturnForPlayer(player, event, () -> {
      if (Rocks.isOre(type)) {
        ore.award(player, event.block().center(), getConfig().oreXp, type.path());
      } else if (Rocks.isStone(type)) {
        stone.award(player, event.block().center(), getConfig().stoneXp, type.path());
        addStat(player, ROCKS_STAT, 1D);
      }
    });
  }

  public static final class Config extends SkillConfig {
    @ConfigDoc("XP for each block of natural stone broken.")
    public double stoneXp = 4D;
    @ConfigDoc("XP for each ore block broken.")
    public double oreXp = 18D;
    @ConfigDoc("XP paid once for breaking 100 stone.")
    public double milestoneReward = 250D;
  }
}
```

`Rocks` is a helper of the example that tests block and item tags through `AdaptApi.platform().host().registries()`.

## The constructor

The constructor declares the skill. Adapt runs it again after every config reload, so it must not change the world, schedule tasks or keep references elsewhere. Everything the skill does happens later, in `@Handle` methods, pulses and `onTick()`.

| Call | Declares |
|---|---|
| `super(id)` | The skill's id: one path segment, in the addon's namespace. Throws outside a supplier Adapt is running |
| `registerConfiguration(Config.class)` | The config class. Call it first; `getConfig()` works from the next line |
| `setColor(Rgb)` | The colour of the skill's name, and the base of a generated theme. `skillColor` in the config overrides it |
| `setIcon(Id item)` | An item icon with the skill's sprite by convention. `setIcon(Icon)` sets any [icon](/adapt/46-api-art-themes#icons) |
| `registerAdaptation(Id, Supplier)` | An adaptation of this skill. Adapt builds it after the constructor returns |
| `registerGroup(Text, List<Id>)` | A labelled row on the skill's pages. Adaptations in no group follow the last group |
| `xpSource(key)`, `xpSource(key, Text)` | A way to earn XP, and its line in the XP guide. Call from a field initialiser or the constructor |
| `xpNote(Text)` | A guide line that belongs to no source |
| `registerRecipe(RecipeSpec)` | A recipe every player can craft while the skill is enabled |
| `registerAdvancement(AdaptAdvancement)` | An advancement in the skill's tab |
| `registerMilestone(...)` | An advancement and XP granted when a stat reaches a goal |
| `setAdvancementBackground(Id)` | The texture behind the skill's advancement tab |
| `needs(PlatformNeed...)` | What the skill needs from the Minecraft version; the skill is left out where a need is missing |
| `pulseLearners(cadence, pulse)` | A periodic call for every online player, see [learner pulses](#learner-pulses) |
| `registerMutationKit(MutationKit)` | What the skill brings to a mutation. Experimental, see [Mutations](/adapt/47-api-mutations) |

The skill's name, description and other strings come from the addon's message bundle by convention keys ([Text and translations](/adapt/45-api-text)). `text("group.field")` is the message `example.skill.geology.group.field`.

## Config

Skill configs extend `SkillConfig` and add public fields with defaults. The file is `skills/<namespace>/<path>.toml` in Adapt's data folder, `skills/example/geology.toml` here. Adapt writes it with the defaults on first start and reloads it when it changes. A config class needs a public no-argument constructor.

| `SkillConfig` field | Default | Effect |
|---|---|---|
| `enabled` | `true` | `false` removes the skill from menus and stops its XP and adaptations |
| `skillColor` | `""` | `#RRGGBB` overrides the colour the skill was written with |
| `minXp` | `100` | XP below which an award is not shown to the player |
| `setInterval` | `0` | Milliseconds between ticks; `0` keeps the skill's own interval |
| `playerPreferences` | empty | Server policies for the skill's player preferences |

Annotate fields to document them:

| Annotation | Target | Effect |
|---|---|---|
| `@ConfigDoc(value, impact)` | Field | The comment above the field in the TOML file, and the English of the field's config menu description, which bundles translate ([Text](/adapt/45-api-text#convention-keys)) |
| `@ConfigAdvanced` | Field | Hides the field behind the menu's advanced toggle |
| `@ConfigDescription(value)` | Class | Written at the top of the generated file |

Read fields through `getConfig()` each time. A reload builds a new config object, and usually a new skill instance. Override `normalizeLoadedConfig(C)` to clamp or repair values before a config goes live, and `onConfigReload(C previous, C current)` to react after; `previous` is null on the first load.

## Handlers

A skill listens with `@Handle` methods on itself, the same way as any [event listener](/adapt/49-api-events). Adapt subscribes them while the instance is live.

Guard player handlers with one of the `shouldReturnForPlayer` forms. They skip players for whom the skill must do nothing: the skill is disabled, the player's data is not loaded yet, they lack the use permission, their world is blacklisted, or they are in creative or spectator.

| Form | Use |
|---|---|
| `shouldReturnForPlayer(player)` | Returns true when the handler should stop |
| `shouldReturnForPlayer(player, action)` | Runs `action` on the player's thread unless the player is skipped |
| `shouldReturnForPlayer(player, event, action)` | As above, and also skips a cancelled event |
| `shouldReturnForWorld(world)` | True when the skill is disabled or the world is blacklisted |

A skill or adaptation handler does not receive an event another handler cancelled unless the method is marked `@ReceiveCancelledEvents`. `PlayerInteractEvent` is the exception, see [Events](/adapt/49-api-events#subscribing).

## Tool checks

`Tools` answers what kind of tool a stack is the way Pickaxes, Axes and Excavation do, modded tools included, by the rules in [Modded tools and blocks](/adapt/01-installation-configuration#modded-tools-and-blocks). The kinds are the `ToolKind` constants `PICKAXE`, `AXE`, `SHOVEL`, `HOE` and `SWORD`. All four types are experimental.

| Call | Answers |
|---|---|
| `Tools.is(item, kind)` | True when the stack counts as `kind` |
| `Tools.match(item, kind)` | The `ToolMatch` rule that decided: `EXCLUDED`, `BROKEN`, `OPERATOR`, `TAG`, `CAPABILITY`, `BEHAVIOUR`, `VANILLA` or `NONE` |
| `Tools.kindsOf(item)` | Every kind the stack counts as |
| `Tools.serves(item, block, kind)` | True when breaking `block` with the stack is `kind`'s work, so a multi-tool feeds the skill the block belongs to |
| `Tools.rules(kind)` | The `ToolRules` in force for `kind`; `blockXp(block)` is the XP an operator listed for a block |

Excavation's break handler, shortened:

```java
@Handle(priority = EventPriority.MONITOR)
public void on(BlockBreakEvent e) {
  PlayerRef p = e.player();
  if (!Tools.serves(p.inventory().mainHand(), e.block().state(), ToolKind.SHOVEL)) {
    return;
  }
  shouldReturnForPlayer(p, e, () -> {
    Id blockType = e.block().type();
    OptionalDouble listed = Tools.rules(ToolKind.SHOVEL).blockXp(blockType);
    double v = listed.isPresent() ? listed.getAsDouble() : blockValue(blockType);
    dig.award(p, e.block().center(), blockXP(e.block(), v));
  });
}
```

`Tools` is in `art.arcane.adapt.api.item` with `ToolMatch` and `ToolRules`; `ToolKind` is in `art.arcane.adapt.platform.item`. A `switch` over `ToolKind` needs a default branch, since minor versions may add kinds.

## XP sources and the XP guide

Each `xpSource(key)` declares one way to earn XP and adds a line to the skill's "Earning XP" guide. The line is the message `<skill key>.xp.<key>`, here `example.skill.geology.xp.stone` and `.xp.ore`. `xpSource(key, guide)` takes the line as a `Text` instead, and sources declared with equal guide texts share one line. `xpNote(text)` adds a line with no source; Geology's says that placed blocks pay nothing. Guide lines appear in declaration order, each once.

| `XpSource` method | Grants |
|---|---|
| `award(player, amount)` | XP at the player's position, with the floating number and the ticker line |
| `award(player, amount, detail)` | The same, under a reward key with a detail |
| `award(player, at, amount)` | XP earned at the location `at` |
| `award(player, at, amount, detail)` | The same, with a detail |
| `awardSilent(player, at, amount)` | XP without the ticker line, keeping the floating number at `at` |
| `awardSilent(player, amount)` | XP with nothing shown |
| `awardSilent(player, amount, detail)` | The same, with a detail |

Every award carries a reward key, `<skill id>:<key>`, or `<skill id>:<key>:<detail>` when a detail is given. Geology passes the block's path as the detail, so breaking stone pays under `example:geology:stone:stone`. Anti-farm bookkeeping and `SkillXpEvent.source()` read it.

XP from a source is gameplay XP: the server's multipliers and anti-farm rules apply before the player receives it. An amount below the config's `minXp` is granted without being shown.

`Skill` also has `xp`, `xpS` and `xpSilent` overloads that take a reward key directly, and `xp(Loc at, double amount, int radius, long durationMillis)`, which leaves XP in the world for every player within `radius` to share for `durationMillis`.

To grant XP from outside a skill, use `SkillProgress.award(XpAward)` ([Players and content](/adapt/48-api-players-content#skill-progress)).

## Advancements and milestones

`registerAdvancement` adds an advancement to the skill's tab. Its key is unique within the addon; the advancement is `adapt:content/<namespace>/<key>`, so two addons may use the same key. Geology's is `adapt:content/example/geology_rocks_100`. A title or description left unset is looked up as `<namespace>.advancement.<key>.title` and `.description`; Geology sets both explicitly to those same keys through `TextKeys.advancement`.

| `AdaptAdvancement.Builder` | Default |
|---|---|
| `key(String)` | Required. `[a-z0-9][a-z0-9_/-]*` |
| `icon(Id)`, `icon(Icon)` | Emerald. The advancement screen and its toasts draw only the icon's item |
| `title(Text)`, `description(Text)` | Convention keys |
| `frame(AdvancementFrame)` | `TASK`. Also `GOAL`, `CHALLENGE` |
| `visibility(AdvancementVisibility)` | `VANILLA` |
| `toast(boolean)` | `false`. Whether a vanilla client shows a toast; native clients always get Adapt's toast |
| `announce(boolean)` | `false`. Whether granting it is announced in chat |
| `child(AdaptAdvancement)` | Advancements below this one |

A milestone grants an advancement and skill XP once a player's stat counter reaches a goal. `addStat(player, stat, amount)` raises the counter and checks milestones; `statOf(player, stat)` reads it. `registerMilestone(key, stat, goal, reward)` takes the reward as a number or as a `DoubleSupplier` read when the milestone completes, so it can come from config, as Geology's `milestoneReward` does.

Grant an advancement from the skill's own code with `grantOnce(player, key)`, or from anywhere with `PlayerProfile.grant(owner, key)`, where `owner` is the id of the content that registered it; `isGranted(owner, key)` reads it. All three take the key as written in the builder. Advancements are skipped when the server turns them off.

## Learner pulses

`pulseLearners(cadenceMillis, pulse)` calls `pulse` for every online player whose data has loaded, about once every cadence per player, on that player's thread. The second argument is the time since that player's last pulse of this skill, at most four cadences, so a stalled server does not pay out a burst. The cadence is a `LongSupplier` read before each pulse, so a config value can change it while the server runs. Call it from the constructor; the pulse stops when the skill unregisters.

```java
pulseLearners(() -> 5000L, (PlayerRef player, long elapsedMillis) -> {
  if (player.isSneaking()) {
    stone.awardSilent(player, elapsedMillis / 1000D);
  }
});
```

The pulse is a `LearnerPulse`, `void pulse(PlayerRef player, long elapsedMillis)`. For a per-player effect of one adaptation, use its `pulseOwners` instead, which runs only for players who learned it ([Adaptations](/adapt/44-api-adaptations#pulses-and-ticking)).

## Ticking

Override `onTick()` for work on a timer that is not per player. Adapt calls it every `getInterval()` milliseconds while `hasTickDemand()` returns true; only a class that overrides `onTick()` is ticked.

| Method | Effect |
|---|---|
| `setInterval(millis)` | Sets the interval. Values below 50 become 50 |
| `burst(ticks)` | Ticks every server tick for the next `ticks` ticks |
| `retick()` | Ticks once on the next server tick |
| `hasTickDemand()` | Override to return false while nobody could be affected |

On Folia, `onTick()` runs on the global region thread. Touch an entity or block only from a task scheduled on its own region through `AdaptApi.scheduler()`, see [threading](/adapt/44-api-adaptations#threading).

## Per-player state

| Helper | Gives |
|---|---|
| `playerState()` | A `Map<UUID, V>` Adapt clears for players who leave. Call from a field initialiser |
| `cooldowns()` | Per-player cooldown timestamps. Call from a field initialiser |
| `getPlayer(player)` | The `PlayerProfile` of an online player whose data has loaded, or null |

Override `onRuntimeActivated()` for work once the instance is live, before its first event, and `unregister()` (calling `super.unregister()`) to release what the instance holds when Adapt retires it.
