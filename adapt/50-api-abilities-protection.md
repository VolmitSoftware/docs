---
title: "API - Abilities, Protection and World"
description: "Ability policies, cost providers, paying costs, protectors, ability damage, minions, integrations, block owners, block scans and build batches"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

Other plugins and mods can decide when adaptations may act, what their abilities cost, and where they may change the world. None of these hooks can grant an adaptation a player has not learned. The second half of this page covers the tools content uses to act like the built-in skills: damage in a player's name, minions, integrations with other plugins, and budgeted world edits.

`AdaptApi.abilities()` and `AdaptApi.protection()` are available at any time, also before Adapt has started, and a registration holds across core restarts until it is removed. An addon registers with its namespace: uninstalling the addon then removes the hook on every platform, and a refresh keeps it. A plugin that is not an addon registers without a namespace and unregisters the hook itself.

## Ability use policies

A policy decides whether a player may use an ability right now: a region, a minigame, a combat tag. Adapt asks every policy in scope on each check and activation, on the thread that owns the player, so a policy must be fast. Every policy in scope must allow a use.

Three checks are answered without calling a policy, by the server's use-policy failure mode, which denies by default: a check made off the thread that owns the player, a check made while a policy is being asked (a policy that triggers another ability check), and any check after the policy was quarantined for failing repeatedly. A policy that throws or returns null counts as failed. Each of these cases is logged once per policy.

```java
public final class DuelPolicy implements AbilityUsePolicy {
  private final Set<UUID> dueling = ConcurrentHashMap.newKeySet();

  public void setDueling(UUID player, boolean active) {
    if (active) {
      dueling.add(player);
    } else {
      dueling.remove(player);
    }
  }

  @Override
  public AbilityUseDecision evaluate(AbilityContext context) {
    return dueling.contains(context.player().uuid())
        ? AbilityUseDecision.deny("Abilities are off during a duel")
        : AbilityUseDecision.allow();
  }

  @Override
  public AbilityScope scope() {
    return AbilityScope.skills(Id.adapt("rift"), Id.adapt("agility"));
  }
}
```

```java
DuelPolicy policy = new DuelPolicy();
AdaptApi.abilities().registerPolicy(GeologyAddon.NAMESPACE, policy);
```

| `AbilityContext` | Holds |
|---|---|
| `activationId()` | The same for the check, the charge and the settle or refund of one activation |
| `ability()`, `skill()`, `level()` | The adaptation, its skill and the player's level in it |
| `phase()` | `CHECK` when nothing happens yet, `ACTIVATE` when it fires |
| `player()`, `origin()` | The player, and where the ability acts when it has a place |

`AbilityScope.everything()` is the default. `AbilityScope.abilities(ids...)` limits a hook to adaptations, and `AbilityScope.skills(ids...)` to every adaptation of skills. `providerId()` names the hook in logs and in the reason shown for a denial; by default it is the class name.

An adaptation asks the policies through `canUse(player)` ([Adaptations](/adapt/44-api-adaptations#learned-and-active-levels)), which also fires `AdaptationUseEvent`.

## Cost providers

A cost provider replaces or waives what an ability costs: mana instead of hunger, money instead of items. For each cost, Adapt asks every provider in scope, in registration order, to `quote` it.

| `AbilityQuote` | Result |
|---|---|
| `pass()` | The provider has no opinion |
| `waived(description)` | This provider charges nothing, and Adapt's default cost is skipped |
| `payable(description)` | The provider takes its own price, and Adapt's default cost is skipped |
| `insufficient(description)` | The player cannot pay; the ability does not fire |
| `denied(reason)` | The provider refuses the use |

The first `insufficient` or `denied` quote stops the asking and refuses the use. Otherwise every provider that quoted `payable` is charged: Adapt calls `reserve` on each in turn, and when one fails, the reservations before it are refunded and the ability does not fire. When every provider passed, the ability's default cost applies.

`withPrice(amount, unit)` attaches a price to a quote. After `reserve` returns `AbilityReservation.reserved(receipt)`, Adapt later calls `commit(receipt)` when the ability went through or `refund(receipt, reason)` when it did not.

```java
public final class ManaCost implements AbilityCostProvider {
  private final Map<UUID, Integer> mana = new ConcurrentHashMap<>();

  @Override
  public AbilityQuote quote(AbilityCostContext context) {
    if (context.kind() != AbilityCostKind.HUNGER) {
      return AbilityQuote.pass();
    }
    int price = context.defaultAmount() * 5;
    int held = mana.getOrDefault(context.ability().player().uuid(), 0);
    return held >= price
        ? AbilityQuote.payable("Mana").withPrice(price, "mana")
        : AbilityQuote.insufficient("Not enough mana");
  }

  @Override
  public AbilityReservation reserve(AbilityCostContext context, AbilityQuote quote) {
    UUID player = context.ability().player().uuid();
    int price = (int) quote.amount().orElse(0L);
    int held = mana.getOrDefault(player, 0);
    if (held < price) {
      return AbilityReservation.failed("Not enough mana");
    }
    mana.put(player, held - price);
    return AbilityReservation.reserved(new ManaReceipt(player, price));
  }

  @Override
  public void refund(AbilityReceipt receipt, AbilityRefundReason reason) {
    if (receipt instanceof ManaReceipt paid) {
      mana.merge(paid.player(), paid.amount(), Integer::sum);
    }
  }

  private record ManaReceipt(UUID player, int amount) implements AbilityReceipt {
  }
}
```

```java
AdaptApi.abilities().registerCostProvider(GeologyAddon.NAMESPACE, new ManaCost());
```

`AbilityCostContext` holds the `AbilityContext`, the `costKey` that names the cost within the ability, the `kind` (`ITEM`, `HUNGER`, `HEALTH`, `DURABILITY`, `VANILLA_EXPERIENCE`), one unit of the default item for an item cost, and the `defaultAmount`. `scope()` limits a provider as it limits a policy.

The server controls how failures in policies and providers are handled with the `abilityApi` keys in `adapt.toml`, see [Installation and configuration](/adapt/01-installation-configuration).

## Paying costs from an adaptation

An adaptation takes each cost through its own helpers, so cost providers see it. The helper runs the `AbilityDefaultCost` when no provider takes over, and returns false when the cost could not be paid; the ability must not fire then.

```java
boolean paid = payHungerCost(player, "cast", 2, () -> {
  player.setFoodLevel(Math.max(0, player.foodLevel() - 2));
  return true;
});
if (!paid) {
  return;
}
```

| Helper | Cost |
|---|---|
| `payCost(player, key, kind, unit, amount, defaultCost)` | Any kind |
| `payItemCost`, `payHungerCost`, `payHealthCost`, `payDurabilityCost`, `payExperienceCost` | One kind |
| `payCostDeferred(...)`, `payItemCostDeferred(...)` | A cost that is final only once the ability went through. Returns an `AbilityCharge` |
| `settleCost(activationId)`, `refundCost(activationId, reason)` | Finishes or returns a deferred charge |

`damageHand`, `damageOffHand` and `applyPlayerDamage` on an adaptation are durability and health costs taken the same way.

## Protectors

A protector is a land or region protection that adaptations respect. Adapt asks it before an adaptation breaks, places, damages or opens anything for a player.

```java
public final class SpawnProtector implements Protector {
  @Override
  public String name() {
    return "example-spawn";
  }

  @Override
  public boolean enabledByDefault() {
    return true;
  }

  @Override
  public boolean allows(ProtectionCheck check, PlayerRef player, Loc location, EntityRef victim, Id adaptation) {
    boolean nearSpawn = Math.abs(location.x()) < 32.0D && Math.abs(location.z()) < 32.0D;
    return switch (check) {
      case PVE -> true;
      case BLOCK_BREAK, BLOCK_PLACE, PVP, INTERACT, ACCESS_CHEST, REGION -> !nearSpawn;
      default -> false;
    };
  }
}
```

```java
AdaptApi.protection().register(GeologyAddon.NAMESPACE, new SpawnProtector());
```

`name()` must be unique; `register` throws `IllegalArgumentException` for a name already registered. `AdaptApi.protection().names()` lists the registered names. Only the code that registered a protector holds the instance, so only it can `unregister` it; an addon's protectors also leave with the addon. Admins switch protectors on or off per adaptation by that name, see [Protection and regions](/adapt/08-protection-region-policy). `enabledByDefault()` decides whether adaptations respect it when their config says nothing. `victim` is the entity about to be damaged for `PVP` and `PVE` checks, when one is known, and null otherwise. `adaptation` is the adaptation acting for the player, and null for a check made for no adaptation.

A protector must deny a check it does not know, since a minor version may add `ProtectionCheck` constants; the `default` branch above does that. A protector that throws counts as a denial and is logged with its name.

| `ProtectionCheck`, in `art.arcane.adapt.platform.protection` | Asked before |
|---|---|
| `BLOCK_BREAK`, `BLOCK_PLACE` | Breaking or placing a block |
| `PVP`, `PVE` | Damaging a player or another entity |
| `INTERACT` | Using a block |
| `ACCESS_CHEST` | Opening a container |
| `REGION` | Acting at a place at all |

Inside an adaptation, `allows(check, player, location, victim)` asks every protector the adaptation respects, and `canBlockBreak`, `canBlockPlace`, `canPVP`, `canPVE`, `canInteract`, `canAccessChest` and `checkRegion` are its short forms. `canDamageTarget(attacker, target)` also refuses the actor's own pets, minions, golems and teammates. The `getActive...Level` forms that take a location or target fold these checks into the level ([Adaptations](/adapt/44-api-adaptations#learned-and-active-levels)).

`AdaptApi.platform().protection()`, the `ProtectionHost`, answers through the same registered protectors on every platform, and works on the thread that owns the actor. `allows(actor, check, at, adaptation)` and `allowsDamage(actor, target, adaptation)` take the adaptation's id or null. With an installed adaptation the answer is that adaptation's own, from the protectors its config enables, and `allowsDamage` also refuses protected friendlies: displays, invulnerable entities and the actor's own pets. Without one, every protector enabled by default must allow the action. Both are false when the actor is offline or the world is not loaded.

The platform's own rules are protectors too: on Bukkit one for each protection plugin Adapt integrates with, and on Fabric, Forge and NeoForge one named `claims`. It covers spawn protection, the world border, build height, adventure mode, the PVP rule, team friendly fire and the loader's cancellable break event that claim mods veto. With a claim mod loaded (FTB Chunks, Open Parties and Claims, Flan, Cadmus or Get Off My Lawn), a modded platform reports `Capability.PROTECTION_PLUGINS`.

`ProtectionProbes`, which is experimental, asks the server's other protection plugins through the platform's own events before an adaptation acts on a block or item, for example `attemptBlockBreakProbe(player, block)` or `attemptContainerOpen(player, blocks)`. Call probes on the thread that owns the target.

## Ability damage

`AbilityDamage.deal(target, amount, source)` deals damage an ability does in a player's name, such as a shockwave or a thrown block. The server reports it as that player's attack, so protection, kill credit and combat XP treat it as theirs, but no adaptation reads it as a melee hit: melee upgrades, on-hit effects and attack contexts skip it. Call it on the target's thread.

```java
AbilityDamage.deal(target, 4D, player);
```

`AbilityDamage.dealing()` is true on the thread that is dealing ability damage right now, for a damage handler of your own that must skip it.

## Minions

`Minions` and `MinionKind` are experimental. A minion is an entity that fights or works for a player. Every adaptation treats a minion as friendly and pays no kill reward for it, Adapt's own minions and those of every registered `MinionKind` alike. A kind recognises its entities and names the owner, usually from data the summoning adaptation stored on the entity:

```java
public final class GolemKind implements MinionKind {
  static final DataKey<String> OWNER = DataKey.of(Id.of(GeologyAddon.NAMESPACE, "golem_owner"), DataCodecs.STRING);

  @Override
  public boolean matches(EntityRef entity) {
    return entity.data().has(OWNER);
  }

  @Override
  public UUID ownerOf(EntityRef entity) {
    String owner = entity.data().get(OWNER);
    return owner == null ? null : UUID.fromString(owner);
  }
}
```

```java
ServiceRegistration golems = Minions.register(new GolemKind());
```

Adapt calls a kind often, on the entity's thread, so keep it a cheap data lookup. `register` works at any time and lasts until `withdraw()`, across core restarts; withdraw it when your plugin or mod shuts down.

| `Minions` | Answers |
|---|---|
| `isMinion(entity)` | Whether the entity is anyone's minion |
| `ownerOf(entity)` | The owning player, or empty |
| `sameOwner(a, b)` | Whether both are minions of the same player |
| `mayAttack(policy, owner, target)` | Whether a minion of `owner` may attack `target`: never the owner, a minion, the owner's pets, or anything `policy.canDamageTarget` refuses for the owner |

The queries need a running core.

## Integrations

`Integrations`, `HiddenVein` and `TreeFelling` are experimental. `Integrations` answers what Adapt learns from the platform and from the plugins it integrates with, so content behaves like the built-in skills around them. Each answer falls back to a neutral one where the platform or the plugin is absent: nothing is marked, shielded or hidden, every player is real and every teleport goes through. It needs a running core.

| Method | Answers |
|---|---|
| `isServerPlayer(player)` | False for fake players: mod fake players, NPC plugin players, spoofed handles |
| `isShielded(entity)` | True for entities an adaptation must leave alone: NPCs, marker armour stands, minions |
| `marked(entity, marker)` | Whether another plugin marked the entity, such as `NPC`, `shopitem` or `hologram` on Bukkit |
| `input(player)` | The movement keys the player's client last reported; empty where the platform cannot read them |
| `announceTeleport(player, source, from, to)` | Lets other plugins cancel or redirect a teleport an adaptation is about to make. Teleport to the returned location; empty means a listener cancelled it |
| `hiddenVeins(origin, radius)`, `hiddenVeinSiblings(block)` | HiddenOre veins near a point, as `HiddenVein` records, or the other blocks of one vein; empty without HiddenOre |
| `treeFellingAvailable()`, `isTreeBlock(block)` | Whether Iris fells trees on this server, and whether a block is part of a tree it can fell |
| `isFellingBreak(event)` | True for a break Iris makes itself while felling; break handlers should skip it |
| `fellTree(event, durabilityPreservationChance, felling)` | Asks Iris to fell the tree of the broken block. False when Iris is absent or declined |

A `TreeFelling` passed to `fellTree` is called on the felling player's thread while Iris breaks the logs: `onActivationAccepted()` once Iris takes the job, then `reserveLogCost()`, `commitLogCost()` and `refundLogCost()` for each log, and `requiresSneaking()` to say whether Iris only fells while the player sneaks.

## Block owners

`BlockOwners` records the player a block belongs to, such as the brewer of a brewing stand, in the world's block data so it survives restarts. Adapt's Brewing reads the same record.

```java
BlockOwners.setOwner(block, player.uuid());
Optional<UUID> owner = BlockOwners.owner(block);
BlockOwners.clearOwner(block);
```

On a platform without persistent block data nothing is kept, and every block reads as unowned.

## Block scans

A `BlockScan` searches around a point for the nearest matching blocks, spread over ticks under a server-wide read budget and run on the thread that owns each chunk. Every block within the dense radius is read, nearest shell first; beyond it, blocks out to the radius are read in an order drawn from the seed until the samples are spent. Matches at the same distance come lowest y first, then x, then z, so a scan with a fixed seed over an unchanged world finds the same blocks each time. A scan still running after 100 ticks completes with what it found.

Prospect reads its small cube at once; a wider search in the same adaptation would be:

```java
BlockScan.around(player.location()).radius(24).denseRadius(6).maxSamples(6000).maxResults(getConfig().maxMarkers)
    .matching(Rocks::isOre)
    .onComplete((BlockScan.Result result) -> AdaptApi.scheduler().runEntity(player, () ->
        HudStatus.show(player, this, text("hud.found").with("count", result.matches().size()))))
    .build()
    .submit(this, player.uuid());
```

| `BlockScan.Builder` | Sets |
|---|---|
| `radius(blocks)` | The farthest a match may be |
| `denseRadius(blocks)` | Out to this distance every block is read; capped by the radius |
| `maxSamples(reads)` | The most blocks the scan reads in total |
| `maxResults(matches)` | The most matches returned. Default 1 |
| `seed(seed)` | The order of the reads beyond the dense radius. A fresh random seed by default |
| `supply(List<Supplied>)` | Matches the caller knows of without the world showing them, such as hidden ore veins, made with `BlockScan.Supplied.at(x, y, z, block, distanceSquared)`; they compete with found blocks by distance |
| `matching(Predicate<Id>)` | Matches by block type, the cheapest test |
| `matchingBlocks(Predicate<BlockRef>)` | Matches by the block itself, for tests that need its state; runs on the chunk's thread and wins over `matching` |
| `onComplete(Consumer<Result>)` | Required. Receives the result |

`submit(owner, player)` starts the scan and returns its id. One owner keeps at most one scan per player: a new one cancels the old. `BlockScan.cancel(owner, player)` stops a scan without completing it, and `BlockScan.cancelAll(owner)` belongs in the owner's `unregister()`.

The `Result` holds the scan id, the world, the matches nearest first, and `budgetExpired()`, true when the scan ran out of time before it spent its samples. A `Match` has the block's coordinates, its type, its squared distance, `supplied()` for a match from `supply`, and `center(world)`. Adapt creates both; they are interfaces, so read them through their accessors. The result arrives on the global tick, so hop to the player's thread before touching the player or the world, as above.

## Build batches

A `BuildBatch` is a multi-block edit an adaptation makes for a player: placed and broken a few blocks per tick, every block through the player's protection checks and real place or break events, every placed block paid for, and the batch kept for undo if asked.

```java
BuildBatch.Builder batch = BuildBatch.of(this, player)
    .pace(4)
    .undoable(3)
    .onDone((BuildResult result) -> HudStatus.show(player, this, Text.literal(result.placed() + " placed, " + result.stop())));
for (BlockRef block : column) {
  batch.place(block, state);
}
BuildBatches.start(batch.build());
```

| `BuildBatch.Builder` | Adds |
|---|---|
| `place(block, state)` | Places `state`, paid with one of the item that places it; skipped when the state has no item |
| `place(block, state, unit)` | Places `state`, paid with one item like `unit` |
| `breakBlock(block, durability)` | Breaks the block as the player with the held tool, charging `durability` more to it |
| `breakWith(block, durability, tool)` | The same, stopping the batch when the held tool no longer passes `tool` |
| `limit(blocks)` | At most this many blocks change |
| `pace(perTick)` | Steps tried per tick, before the server-wide cap. Default 4 |
| `payFrom(BuildPayment)` | Pays from elsewhere, such as `BuildPayment.container(inventory, owner)`. By default the player pays: main hand, off hand, then the rest of the inventory |
| `undoable(batches)` | Records placed blocks for undo, keeping the newest `batches` batches of this owner for the player |
| `onDone(callback)` | Runs on the player's thread when the batch ends, however it ends |

`BuildBatches` runs one batch or undo at a time per player, under a server-wide budget of blocks per tick. `start(batch)` is false when the player already runs one or the batch is empty. `undo(player, owners, maxAgeMillis, pace, redoMillis, done)` undoes the player's newest undoable batch of one of `owners` and refunds what it placed; with `redoMillis` above 0, `redo(player, owner, near, radius, pace, done)` can place it back once. `isRunning(player)`, `cancel(player)` and `undoable(player)` complete the set.

A `BuildResult` counts what was `placed`, `broken`, `undone` and `skipped`, lists the blocks, and says why it stopped:

| `BuildResult.Stop` | Meaning |
|---|---|
| `DONE` | Every step ran |
| `PROTECTED` | A protection plugin, region rule or place event refused a block |
| `NO_ITEMS` | No item was left to pay for the next block |
| `TOOL_WORN` | The next break would have broken the held tool |
| `LIMIT` | The batch reached its block limit |
| `OUT_OF_REACH` | The next block is outside what this thread may change, in another Folia region |
| `CANCELLED` | The player left or the batch was cancelled |
