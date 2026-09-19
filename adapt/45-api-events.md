---
title: "API - Events"
description: "Listen for ability, teleport, brewing, and cost events"
published: true
date: 2026-09-19T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Adapt fires Bukkit events for ability use, adaptation teleports, charged activations, and completed brewing recipes.

## Deny an adaptation

```java
@EventHandler
public void onUse(AdaptAdaptationUseEvent event) {
    if (blocked.contains(event.getPlayer().getUniqueId())) {
        event.setCancelled(true);
    }
}
```

`AdaptAdaptationUseEvent` fires before an adaptation runs. Cancelling it prevents the effect, cooldown, XP, and cost.

## Deny a teleport

```java
@EventHandler
public void onTeleport(AdaptAdaptationTeleportEvent event) {
    if (!claims.canEnter(event.getPlayer(), event.getTo())) {
        event.setCancelled(true);
    }
}
```

This event is only for teleports initiated by Adapt.

## Brewing

`AdaptBrewCompleteEvent` reports a completed Adapt brewing recipe and provides the brewer, block, recipe, and result. It is observational.

## Ability cost events

- `AdaptAbilityActivateEvent` can cancel a pending charged activation.
- `AdaptAbilityActivatedEvent` reports the final outcome.

Events run on the thread that owns the affected player or block. Avoid blocking work in listeners.

## Bukkit events Adapt listens to

Which vanilla Bukkit events each adaptation hooks, and at what priority. You need this only when
another plugin has to run before or after Adapt on the same event. Nothing here is configurable.

Coverage is partial: the six skills below declare their listeners explicitly. The remaining skills
hook the events their triggers imply, described in prose on their own pages.

### Enchanting

| Adaptation | Bukkit events |
|---|---|
| Quick-Click Enchant (`enchanting-quick-enchant`) | `InventoryClickEvent` (HIGHEST) |
| Lapis Return (`enchanting-lapis-return`) | `EnchantItemEvent` (`MONITOR`, cancelled events ignored) |
| XP Return (`enchanting-xp-return`) | `EnchantItemEvent` (MONITOR, cancelled events ignored) |
| Anvil Savant (`enchanting-anvil-savant`) | `PrepareAnvilEvent` (HIGHEST), `InventoryClickEvent` (MONITOR) |
| Offer Reroll (`enchanting-offer-reroll`) | `PlayerInteractEvent` (HIGHEST) |
| Bookshelf Attunement (`enchanting-bookshelf-attunement`) | `PrepareItemEnchantEvent` (HIGHEST), `EnchantItemEvent` (MONITOR, effects only) |
| Grindstone Recovery (`enchanting-grindstone-recovery`) | `InventoryClickEvent` (HIGHEST, cancelled events ignored) |
| Curse Cleansing (`enchanting-curse-cleansing`) | `InventoryClickEvent` (LOWEST, cancelled events ignored) |
| Tome Rebinding (`enchanting-tome-rebinding`) | `PlayerDropItemEvent` (HIGHEST, cancelled events ignored) |
| Soul Link (`enchanting-soul-link`) | `PlayerInteractEvent` (HIGHEST, also receives cancelled events), `PlayerDeathEvent` (HIGH), `PlayerRespawnEvent` (MONITOR), `PlayerJoinEvent` (MONITOR), `PlayerQuitEvent` (MONITOR) |
| Arcane Siphon (`enchanting-arcane-siphon`) | `EntityDeathEvent` (HIGH, cancelled events ignored) |
| Rune Sight (`enchanting-rune-sight`) | `PrepareItemEnchantEvent` (MONITOR) |
| Infusion Transfer (`enchanting-infusion-transfer`) | `InventoryClickEvent` (HIGHEST, cancelled events ignored) |
| Echo of Knowledge (`enchanting-echo-of-knowledge`) | `PlayerExpChangeEvent` (MONITOR) |

### Excavation

| Adaptation | Bukkit events |
|---|---|
| Hasty Excavator (`excavation-haste`) | `BlockDamageEvent` (HIGHEST, cancelled events ignored) |
| Super-Seeing Spelunker! (`excavation-spelunker`) | `PlayerToggleSneakEvent` (HIGH), `EntityRemoveEvent` (MONITOR), `PlayerQuitEvent` |
| OMNI - T.O.O.L. (`excavation-omnitool`) | `EntityDamageByEntityEvent` (HIGH), `BlockBreakEvent` (HIGH), `PlayerInteractEvent` (HIGH), `BlockDamageEvent` (HIGH), `PlayerDropItemEvent` (HIGHEST), `InventoryClickEvent` (HIGHEST) |
| Shovel Drop-To-Inventory (`excavation-drop-to-inventory`) | `BlockDropItemEvent` (HIGHEST) |
| Seismic Ping (`excavation-seismic-ping`) | `BlockBreakEvent` (HIGHEST, cancelled events ignored), `PlayerQuitEvent` |
| Tunneler (`excavation-tunneler`) | `BlockBreakEvent` (HIGHEST, cancelled events ignored) |
| Treasure Hunter (`excavation-treasure-hunter`) | `BlockBreakEvent` (HIGHEST, cancelled events ignored) |
| Soft Fall (`excavation-soft-fall`) | `EntityDamageEvent` (HIGHEST) |
| Earth Mover (`excavation-earth-mover`) | `PlayerInteractEvent` (HIGHEST) |
| Burrow (`excavation-burrow`) | `PlayerInteractEvent` (MONITOR, also receives cancelled events) |
| Grave Digger (`excavation-grave-digger`) | `BlockBreakEvent` (HIGHEST, cancelled events ignored), `EntityDeathEvent` (MONITOR, effects only) |
| Mudlark (`excavation-mudlark`) | `BlockDamageEvent` (HIGHEST), `BlockBreakEvent` (HIGHEST, cancelled events ignored) |
| Skill XP and stats | `BlockBreakEvent` with a shovel in the main hand. Any block counts, not only soft ground. XP is `blockValue` run through the world's earnings multiplier, and is skipped when XP provenance marks the block as already farmed.; `EntityDamageByEntityEvent` with a shovel in the main hand, when `getXpForAttackingWithTools` is true and the victim is a valid damageable entity. XP is `axeDamageXPMultiplier * damage`. |

### Herbalism

| Adaptation | Bukkit events |
|---|---|
| Growth Aura (`herbalism-growth-aura`) | `PlayerQuitEvent`. The work itself runs on the adaptation tick |
| Harvest & Replant (`herbalism-replant`) | `PlayerInteractEvent` (MONITOR, cancelled events ignored) |
| Hungry Shield (`herbalism-hungry-shield`) | `EntityDamageEvent` (HIGHEST) |
| Herbalist's Hippo (`herbalism-hippo`) | `PlayerItemConsumeEvent` (NORMAL) |
| Hoe Drop-To-Inventory (`herbalism-drop-to-inventory`) | `BlockDropItemEvent` (HIGHEST) |
| Herbalist's Luck (`herbalism-luck`) | `BlockDropItemEvent` (NORMAL) |
| Herbalist's Myconid (`herbalism-myconid`) | `CraftItemEvent` (MONITOR) |
| Herbalist's Terralid (`herbalism-terralid`) | `CraftItemEvent` (MONITOR) |
| Mushroom Maker (`herbalism-mushroom-blocks`) | `CraftItemEvent` (MONITOR) |
| Webby Creator (`herbalism-cobweb`) | `CraftItemEvent` (MONITOR) |
| Seed Sower (`herbalism-seed-sower`) | `PlayerInteractEvent` (MONITOR, also receives cancelled events) |
| Compost Cascade (`herbalism-compost-cascade`) | `PlayerInteractEvent` (MONITOR, cancelled events ignored) |
| Rooted Footing (`herbalism-rooted-footing`) | `PlayerInteractEvent` (HIGHEST, `PHYSICAL` action only), `EntityDamageEvent` (HIGH) |
| Bee Shepherd (`herbalism-bee-shepherd`) | `PlayerQuitEvent`. The work itself runs on the adaptation tick |
| Spore Bloom (`herbalism-spore-bloom`) | `BlockPlaceEvent` (MONITOR, cancelled events ignored) |

### Pickaxes

| Adaptation | Bukkit events |
|---|---|
| Ore Chisel (`pickaxe-chisel`) | `PlayerInteractEvent` (`on`, MONITOR) |
| Veinminer (`pickaxe-veinminer`) | `BlockBreakEvent` (`on`, HIGH) |
| Autosmelt (`pickaxe-autosmelt`) | `BlockDropItemEvent` (`on`, MONITOR) |
| Pickaxe Drop-To-Inventory (`pickaxe-drop-to-inventory`) | `BlockDropItemEvent` (`on`, MONITOR) |
| Pickaxe Silk-Spawner (`pickaxe-silk-spawner`) | `BlockDropItemEvent` (`onBlockDropPrepare`, HIGH). `BlockDropItemEvent` (`onBlockDropCommit`, MONITOR) |
| Quarry Sense (`pickaxe-quarry-sense`) | `PlayerInteractEvent` (`on`, HIGHEST). `PlayerQuitEvent` (`on`) |
| Tunnel Bore (`pickaxe-tunnel-bore`) | `BlockBreakEvent` (`on`, HIGHEST) |
| Deep Core (`pickaxe-deep-core`) | `BlockDamageEvent` (`on`, HIGHEST). `BlockBreakEvent` (`on`, MONITOR) |
| Obsidian Rush (`pickaxe-obsidian-rush`) | `BlockDamageEvent` (`on`, HIGHEST). `BlockBreakEvent` (`on`, MONITOR) |
| Unbreakable Pact (`pickaxe-unbreakable-pact`) | `PlayerItemDamageEvent` (`on`, HIGHEST) |
| Repair Rhythm (`pickaxe-repair-rhythm`) | `BlockBreakEvent` (`on`, MONITOR, cancelled events ignored) to arm the proc. `PlayerItemDamageEvent` (`on`, HIGHEST) to commit after vanilla wear, with a one-tick fallback when no wear event fires |
| Trophy Polish (`pickaxe-gem-polish`) | `BlockBreakEvent` (`MONITOR`, cancelled events ignored) |
| Stone Skin (`pickaxe-stone-skin`) | `BlockBreakEvent` (`on`, HIGHEST) |

### Ranged

| Adaptation | Bukkit events |
|---|---|
| Force Shot (`ranged-force`) | `ProjectileLaunchEvent` (`on`, NORMAL). `EntityDamageByEntityEvent` (`on`, NORMAL) |
| Arrow Piercing (`ranged-piercing`) | `ProjectileLaunchEvent` (`on`, NORMAL). `EntityDamageByEntityEvent` (`on`, HIGHEST) |
| Arrow Recovery (`ranged-recovery`) | `EntityShootBowEvent` (`onEntityShootBow`, NORMAL). `ProjectileHitEvent` (`onProjectileHit`, NORMAL) |
| Lunge Shot (`ranged-lunge-shot`) | `ProjectileLaunchEvent` (`on`, NORMAL) |
| Web Snare (`ranged-webshot`) | `ProjectileLaunchEvent` (`on`, MONITOR). `ProjectileHitEvent` (`on`, NORMAL). `EntityRemoveEvent` (`on`, MONITOR). `ChunkLoadEvent` (`on`, MONITOR). `BlockPistonExtendEvent` (`on`, HIGHEST). `BlockPistonRetractEvent` (`on`, HIGHEST). `BlockExplodeEvent` (`on`, HIGHEST). `BlockBreakEvent` (`on`, HIGHEST). `EntityExplodeEvent` (`on`, HIGHEST) |
| Trajectory Sight (`ranged-trajectory-sight`) | `PlayerQuitEvent`, `PlayerChangedWorldEvent`, `PlayerDeathEvent`, `PlayerDropItemEvent`, `PlayerInteractEvent`, `PlayerItemHeldEvent`, `PlayerSwapHandItemsEvent`, `PlayerToggleSneakEvent`, `EntityShootBowEvent`, `ProjectileLaunchEvent`, `EntityDeathEvent` (all `on`). `PlayerStopUsingItemEvent` via a companion listener registered only when the Paper class exists |
| Floaters (`ranged-floaters`) | `ProjectileLaunchEvent` (`on`, MONITOR). `EntityDamageByEntityEvent` (`on`, MONITOR) |
| Pinning Shot (`ranged-pinning-shot`) | `ProjectileLaunchEvent` (`on`, MONITOR). `EntityDamageByEntityEvent` (`on`, MONITOR) |
| Ricochet Bolt (`ranged-ricochet-bolt`) | `ProjectileLaunchEvent` (`on`, MONITOR). `ProjectileHitEvent` (`on`, HIGHEST). `EntityDamageByEntityEvent` (`on`, HIGHEST). `EntityDeathEvent` (`on`, NORMAL) |
| Fetch Shot (`ranged-fetch-shot`) | `ProjectileHitEvent` (`on`, MONITOR) |
| Heavy Draw (`ranged-heavy-draw`) | `ProjectileLaunchEvent` (`on`, HIGH). `EntityDamageByEntityEvent` (`on`, HIGHEST) |
| Heartseeker (`ranged-heartseeker`) | `PlayerInteractEvent` (`on`, MONITOR). `EntityShootBowEvent` (`on`, LOWEST). `EntityAddToWorldEvent` (`on`). `ProjectileHitEvent` (`on`). `EntityDamageByEntityEvent` (`on`). `EntityRemoveEvent` (`on`). `PlayerQuitEvent` (`on`) |

### Rift

| Adaptation | Bukkit events |
|---|---|
| Rift Resistance (`rift-resist`) | `PlayerInteractEvent` (`on`, HIGHEST) |
| Remote Access (`rift-access`) | `PlayerInteractEvent`, `BlockBurnEvent`, `BlockPistonRetractEvent`, `BlockPistonExtendEvent`, `BlockExplodeEvent`, `EntityExplodeEvent`, `BlockBreakEvent`, `InventoryCloseEvent`, `PlayerQuitEvent`, `ChunkUnloadEvent` (all `on`) |
| Easy Enderchest (`rift-enderchest`) | `PlayerInteractEvent` (`on`, NORMAL) |
| Rift Gate (`rift-gate`) | `PlayerInteractEvent` (`on`). `PlayerQuitEvent` (`on`). `PlayerJoinEvent` (`on`) |
| Rift Blink (`rift-blink`) | `PlayerMoveEvent` (`on`, MONITOR) |
| Anti-Levitation (`rift-descent`) | `PlayerToggleSneakEvent` (`on`, HIGHEST) |
| Rift Visage (`rift-visage`) | `EntityTargetEvent` (`onEntityTarget`, NORMAL) |
| Ender Taglock (`rift-ender-taglock`) | `EntityDamageByEntityEvent` (`on`, HIGHEST). `PlayerInteractEvent` (`on`, HIGHEST, receives cancelled events). `PlayerTeleportEvent` (`on`). `ProjectileHitEvent` (`on`). `PlayerQuitEvent` (`on`) |
| Inflated Pocket Dimension (`rift-inflated-pocket-dimension`) | `PlayerInteractEvent` (`on`). `BlockPlaceEvent` (`on`). `PlayerDropItemEvent` (`on`) |
| Void Magnet (`rift-void-magnet`) | `PlayerToggleSneakEvent` (`on`). `PlayerQuitEvent` (`on`) |
| Void Skin (`rift-void-skin`) | `EntityDamageEvent` (`on`, HIGHEST). `PlayerQuitEvent` (`on`). `PlayerJoinEvent` (`on`) |
| Pearl Rebound (`rift-pearl-rebound`) | `ProjectileLaunchEvent` (`on`). `ProjectileHitEvent` (`on`, HIGH). `EntityDamageEvent` (`on`, LOWEST) |
| Rift Conduit (`rift-conduit`) | `PlayerInteractEvent` (`on`). `InventoryCloseEvent` (`on`, MONITOR). `PlayerQuitEvent` (`on`). `PlayerJoinEvent` (`on`) |

### Chronos

| Adaptation | Bukkit events |
|---|---|
| Time In A Bottle (`chronos-time-bottle`) | `PlayerQuitEvent` (`on`): clears charge state; `CraftItemEvent` (`on`): rejects the craft without a Swiftness Potion; `PlayerItemConsumeEvent` (`on`); `PlayerInteractEvent` (`on`): block or air click; `PlayerInteractEntityEvent` (`on`): right-click on an entity |
| Aberrant Touch (`chronos-aberrant-touch`) | `EntityDamageByEntityEvent` (`on`): melee or projectile hit |
| Instant Recall (`chronos-instant-recall`) | `PlayerQuitEvent` (`on`); `PlayerJoinEvent` (`on`); `PlayerTeleportEvent` (`on`); `PlayerChangedWorldEvent` (`on`); `PlayerInteractEvent` (`on`): click triggers; `PlayerToggleSneakEvent` (`on`): single-sneak trigger; `EntityDamageEvent` (`on`); `PlayerMoveEvent` (`on`): snapshot capture; `PlayerMoveEvent` (`onDoubleJumpMove`): double-jump trigger |
| Time Bomb (`chronos-time-bomb`) | `PlayerQuitEvent` (`on`); `PlayerJoinEvent` (`on`); `PlayerInteractEvent` (`on`): right-click air or block, for the cooldown gate; `ProjectileLaunchEvent` (`on`): arms the thrown bomb; `LingeringPotionSplashEvent` (`on`): opens the field; `EntitiesLoadEvent` (`on`): sweeps stale frozen stamps |
| Temporal Echo (`chronos-temporal-echo`) | `ProjectileLaunchEvent` (`on`): records the shot to replay; `ProjectileHitEvent` (`on`): scores the echo hit |
| Stasis Field (`chronos-stasis-field`) | `PlayerQuitEvent` (`on`); `EntityRemoveEvent` (`on`): drops bookkeeping for removed frozen entities; `PlayerInteractEvent` (`on`): sneak plus right-click cast |
| Rewind (`chronos-rewind`) | `PlayerQuitEvent` (`on`); `PlayerSwapHandItemsEvent` (`on`): mark and rewind gesture |
| Borrowed Time (`chronos-borrowed-time`) | `PlayerQuitEvent` (`on`); `PlayerJoinEvent` (`on`); `PlayerDeathEvent` (`on`): clears outstanding debt; `EntityDamageEvent` (`on`): defers part of the hit |
| Overtime (`chronos-overtime`) | `PlayerQuitEvent` (`on`); `EntityPotionEffectEvent` (`onHarmfulEffect`): shortens harmful effects at max level; `EntityPotionEffectEvent` (`on`): extends beneficial effects |
| Accelerate (`chronos-accelerate`) | `PlayerQuitEvent` (`on`) |
| Hourglass Guard (`chronos-hourglass-guard`) | `PlayerQuitEvent` (`on`); `EntityDamageEvent` (`on`): intercepts the killing blow |
| Pocket Watch (`chronos-pocket-watch`) | `PlayerQuitEvent` (`on`) |
| Deja Vu (`chronos-deja-vu`) | `EntityDamageEvent` (`on`): absorbs repeats of a familiar damage cause |

### Crafting

| Adaptation | Bukkit events |
|---|---|
| Deconstruction (`crafting-deconstruction`) | `PlayerInteractEvent` (`MONITOR`, ignore cancelled): sneak plus right-click with shears, ray-traced up to six blocks |
| Crafting XP (`crafting-xp`) | `CraftItemEvent` (`MONITOR`, cancelled events ignored): taking a committed craft result |
| Craftable Leather (`crafting-leather`) | `PlayerInteractEvent` (`on`): rotten flesh onto a `CAMPFIRE` |
| Craftable Skulls (`crafting-skulls`) | `CraftItemEvent` (`on`): taking a skull recipe result |
| Backpacks (`crafting-backpacks`) | `PlayerInteractEvent` (`on`): opens the backpack; `InventoryClickEvent` (`on`); `InventoryDragEvent` (`on`); `InventoryCloseEvent` (`on`); `PlayerDeathEvent` (`on`); `PlayerQuitEvent` (`on`); `PlayerItemHeldEvent` (`on`); `PlayerDropItemEvent` (`on`); `PlayerSwapHandItemsEvent` (`on`); `PrepareItemCraftEvent` (`on`): mode cycle preview; `CraftItemEvent` (`on`): craft and mode cycle |
| Portable Tables (`crafting-stations`) | `PlayerInteractEvent` (`on`): right-click air, left-click air, or left-click block |
| Ore Reconstruction (`crafting-reconstruction`) | `CraftItemEvent` (`on`): taking a craft result |
| Bulk Artisan (`crafting-bulk-artisan`) | `CraftItemEvent` (`on`): shift-click on a craft result |
| Thrifty Hands (`crafting-thrifty-hands`) | `CraftItemEvent` (`on`): taking a craft result |
| Masterwork (`crafting-masterwork`) | `CraftItemEvent` (HIGHEST, cancelled events ignored): starts the roll and a shift-click batch.; `ItemCraftedEvent` (MONITOR): counts each actual output and arms the next independent batch roll.; `PrepareItemCraftEvent` (HIGHEST): supplies the cached roll for the next shift-crafted output without rerolling repeated preview callbacks. |
| Compactor (`crafting-compactor`) | `PlayerSwapHandItemsEvent` (`on`): the compact gesture; `PlayerJoinEvent` (`on`): level normalization |
| Tinkerer (`crafting-tinkerer`) | `CraftItemEvent` (`on`): grid repair of two matching tools |
| Provisioner (`crafting-provisioner`) | `CraftItemEvent` (`on`): crafted food; `FurnaceSmeltEvent` (`on`): cooked food |
| Artisan's Signature (`crafting-signature`) | `CraftItemEvent` (`on`): stamps the result; `PlayerInteractEntityEvent` (`on`): right-click on a villager |

### Discovery

| Adaptation | Bukkit events |
|---|---|
| Experimental Unity (`discovery-unity`) | `PlayerExpChangeEvent` (`on`): vanilla experience gained |
| World Armor (`discovery-world-armor`) | `PlayerJoinEvent` (`on`) |
| Experimental Resistance (`discovery-xp-resist`) | `EntityDamageEvent` (`on`): only when the hit would cross the health threshold |
| Villager Attraction (`discovery-villager-att`) | `PlayerInteractEntityEvent` (`on`): rolls the proc on a main-hand villager interaction. Offhand duplicates are ignored; `InventoryOpenEvent` (`on`): activates the trade session and schedules validation one tick later, after the merchant view opens; `PlayerTradeEvent` (`on`); `InventoryCloseEvent` (`on`): restores the original offers |
| Better Mending (`discovery-better-mending`) | `PlayerInteractEvent` (`on`): sneak plus left-click, air or block, main hand only |
| Cartographer Pulse (`discovery-cartographer-pulse`) | `PlayerInteractEvent` (`on`): sneak plus right-click with a `COMPASS` in the main hand; `PlayerQuitEvent` (`on`) |
| Insight (`discovery-insight`) | `PlayerMoveEvent` (`on`): prioritizes the learner's next target inspection.; `PlayerQuitEvent` (`on`): clears the learner's Insight contribution.; `PluginEnableEvent` and `ServiceRegisterEvent` (`on`): reconnect to Gloss and apply the current restriction. |
| Field Notes (`discovery-field-notes`) | `EntityDeathEvent` (`on`): records the species and pays the first-kill bounty; `EntityDamageByEntityEvent` (`on`): applies the banked species damage bonus |
| Relic Appraiser (`discovery-relic-appraiser`) | `PlayerInteractEvent` (`on`): sneak plus right-click, air or block, main hand only; `BlockPlaceEvent` (`on`, `MONITOR`, ignores cancelled): stores an appraised head or skull snapshot after placement commits; `BlockDropItemEvent` (`on`, `LOWEST`, ignores cancelled): restores the snapshot onto the matching committed block drop before drop routers |
| Sixth Sense (`discovery-sixth-sense`) | `PlayerQuitEvent` (`on`); `PlayerMoveEvent` (`onMove`): clears cached HUD state after the adaptation is unlearned or disabled. |
| Keen Eye (`discovery-keen-eye`) | `PlayerQuitEvent` (`on`) |

### Seaborne

| Adaptation | Bukkit events |
|---|---|
| Dolphin's Grace (`seaborne-speed`) | `PlayerMoveEvent` (`MONITOR`, ignore cancelled) — starts, refreshes, and ends the swim session; `PlayerTeleportEvent` (`MONITOR`, ignore cancelled) — ends the swim session; `PlayerQuitEvent` (`LOWEST`) — ends the swim session |
| Fisher's Fantasy (`seaborne-fishers-fantasy`) | `PlayerFishEvent` (`MONITOR`, cancelled events ignored) — on `CAUGHT_FISH` only |
| Turtle's Vision (`seaborne-turtles-vision`) | `EntityPotionEffectEvent` (`MONITOR`, ignore cancelled) — drops ownership when something else changes the player's Night Vision; `PlayerQuitEvent` (`MONITOR`) — clears managed Night Vision and state |
| Turtle Miner (`seaborne-turtles-mining-speed`) | `BlockBreakEvent` (`MONITOR`, ignore cancelled) — counts blocks broken while in water and plays effects; `BlockDamageEvent` (`MONITOR`, ignore cancelled) — activates the mining modifiers immediately when mining starts; `PlayerMoveEvent` (`MONITOR`, ignore cancelled) — immediately clears compensation on landing or surfacing. Block damage and passive refresh reapply it when floating; `PlayerQuitEvent` (`MONITOR`) — clears local managed state. The shared attribute service removes the transient modifiers |
| Tidecaller (`seaborne-tidecaller`) | `PlayerToggleSneakEvent` (`HIGHEST`, ignore cancelled) — sneak trigger; `PlayerAnimationEvent` (`HIGHEST`, ignore cancelled) — arm swing trigger; `PlayerQuitEvent` (`MONITOR`) — clears pending teleport dash state |
| Pressure Diver (`seaborne-pressure-diver`) | `EntityDamageEvent` (`HIGHEST`, ignore cancelled) — scales incoming damage down while deep enough; `PlayerMoveEvent` (`MONITOR`, ignore cancelled, `@RunsWithoutLearnedAdaptation`) — arms and disarms depth tracking; `BlockBreakEvent` (`MONITOR`, ignore cancelled) — counts blocks mined while the deep state is active; `PlayerQuitEvent` — clears depth state |
| Coral Gardener (`seaborne-coral-gardener`) | `BlockPlaceEvent` (`MONITOR`, ignore cancelled) — pays reef XP and starts the fade timer for coral; `BlockFadeEvent` (`MONITOR`, ignore cancelled) — cancels the fade while the timer is still running; `PlayerInteractEvent` (`MONITOR`, ignore cancelled) — bone meal growth on right-click |
| Deep Salvager (`seaborne-deep-salvager`) | `InventoryOpenEvent` (`MONITOR`) — bonus treasure roll; `PlayerQuitEvent` (`MONITOR`) — cancels scans and clears the viewer's block displays |
| Ink Veil (`seaborne-ink-veil`) | `EntityDamageEvent` (`MONITOR`, ignore cancelled) — fires the burst when the damaged player is in water; `EntityTargetLivingEntityEvent` (`HIGHEST`, ignore cancelled) — blocks drowned and guardian retargeting during concealment; `PlayerQuitEvent` (`MONITOR`) — clears concealment state |
| Trident Mastery (`seaborne-trident-mastery`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — applies the damage bonus; `ProjectileLaunchEvent` (`MONITOR`, ignore cancelled) — stamps the trident and starts recall |
| Fish Whisperer (`seaborne-fish-whisperer`) | `EntityDamageByEntityEvent` (`MONITOR`, ignore cancelled) — recruits dolphins and axolotls onto the victim |
| Hydro Jet (`seaborne-hydro-jet`) | `PlayerToggleSneakEvent` (`HIGHEST`, ignore cancelled) — fires the jet when the player starts sneaking while swimming; `PlayerQuitEvent` — clears stored charges |
| Brine Skin (`seaborne-brine-skin`) | `EntityDamageEvent` (`HIGHEST`, ignore cancelled) — applies the damage reduction |

### Stealth

| Adaptation | Bukkit events |
|---|---|
| Stealth (`stealth-silent-step`) | `PlayerToggleSneakEvent` (`MONITOR`) — starts or stops the concealment session; `PlayerMoveEvent` (`MONITOR`, `@RunsWithoutLearnedAdaptation`) — restarts a session after a state change and clears leftover concealment; `EntityTargetLivingEntityEvent` (`HIGHEST`, ignore cancelled) — cancels targeting on concealed players and nulls existing targets; `EntityDamageByEntityEvent` (`HIGHEST`) — applies the backstab multiplier; `PlayerQuitEvent` (`MONITOR`) — clears the session |
| Sneak Speed (`stealth-speed`) | `PlayerToggleSneakEvent` — starts a session on sneak, ends it on stand unless crawling; `PlayerMoveEvent` — starts a session for a sneaking or crawling player that has none; `PlayerDeathEvent` — clears state; `PlayerQuitEvent` — clears state |
| Item Snatch (`stealth-snatch`) | `PlayerToggleSneakEvent` (`MONITOR`, ignore cancelled) — snatches immediately and opens a repeating session; `PlayerQuitEvent` (`MONITOR`) — closes the session |
| Ghost's Armor (`stealth-ghost-armor`) | `EntityDamageEvent` (`HIGHEST`, ignore cancelled) — consumes the whole buffer on an armor-respecting hit; `PlayerJoinEvent` (`MONITOR`) — starts the charge session; `PlayerRespawnEvent` (`MONITOR`) — restarts the charge session; `PlayerMoveEvent` (`MONITOR`) — starts a session if none exists, re-checked at most every 5000 ms; `PlayerDeathEvent` (`MONITOR`) — clears the session and the armor modifier; `PlayerQuitEvent` (`MONITOR`) — clears the session and the armor modifier |
| Stealth Vision (`stealth-vision`) | `PlayerToggleSneakEvent` — begins or ends the sight session; `EntityPotionEffectEvent` (`LOWEST`, ignore cancelled, `onBlindness`) — cancels Blindness being added or changed on a sneaking learner; `EntityPotionEffectEvent` (`MONITOR`, ignore cancelled) — drops ownership when something else changes the player's Night Vision; `PlayerQuitEvent` (`LOWEST`) — clears tracked state and owned outlines |
| Enderveil (`stealth-enderveil`) | `EntityTargetLivingEntityEvent` (`LOWEST`, ignore cancelled, `onTarget`) — cancels enderman targeting; `EndermanAttackPlayerEvent` (`LOWEST`, ignore cancelled, reflective handler, `onTarget`) — cancels direct enderman aggression; `PlayerQuitEvent` (`MONITOR`) — stops the ambient particle session |
| Shadow Decoy (`stealth-shadow-decoy`) | `PlayerToggleSneakEvent` (`HIGHEST`, ignore cancelled) — spawns the decoy when sneaking ends; `EntityDamageEvent` (`HIGHEST`) — cancels all damage to the decoy anchor and plays hit feedback; `PlayerAnimationEvent` (`HIGHEST`, ignore cancelled) — ray traces attack swings against the decoy; `PlayerQuitEvent` (`MONITOR`) — removes active decoys and cooldown state |
| Shadowmeld (`stealth-shadowmeld`) | `PlayerToggleSneakEvent` (`MONITOR`) — opens the meld session on sneak, ends it on stand; `EntityTargetLivingEntityEvent` (`LOWEST`, ignore cancelled) — cancels targeting on a melded player; `EntityDamageByEntityEvent` (`MONITOR`, ignore cancelled, `onAct`) — breaks the meld when the player attacks; `EntityDamageEvent` (`MONITOR`, ignore cancelled, `onHurt`) — breaks the meld on any damage with final damage above 0; `PlayerInteractEvent` (`onInteract`) — breaks the meld on any interaction; `PlayerQuitEvent` (`LOWEST`) — ends the session |
| Smoke Pellet (`stealth-smoke-pellet`) | `PlayerToggleSneakEvent` (`NORMAL`, ignore cancelled) — consumes gunpowder and casts the cloud; `EntityTargetLivingEntityEvent` (`HIGHEST`, ignore cancelled) — cancels targeting on a concealed player and clears the mob's target; `PlayerQuitEvent` (`MONITOR`) — clears concealment state |
| Cutpurse (`stealth-cutpurse`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — rolls the steal |
| Trap Sense (`stealth-trap-sense`) | `PlayerToggleSneakEvent` (`MONITOR`) — opens or closes the scan session and caches the sculk suppression state; `BlockReceiveGameEvent` (`HIGHEST`, ignore cancelled) — suppresses movement vibrations reaching sculk blocks; `PlayerQuitEvent` (`MONITOR`) — cancels scans and clears the viewer's block displays |
| Assassinate (`stealth-assassinate`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — replaces the damage with an execution |
| Decoy Swap (`stealth-decoy-swap`) | `PlayerToggleSneakEvent` (`MONITOR`) — detects the double tap and starts the swap; `PlayerQuitEvent` (`MONITOR`) — clears double-tap and cooldown state |
| Umbral Recovery (`stealth-umbral-recovery`) | `EntityDeathEvent` (`MONITOR`) — runs the recovery when the killer was sneaking |

### Swords

| Adaptation | Bukkit events |
|---|---|
| Machete (`sword-machete`) | `PlayerInteractEvent` — fires on `LEFT_CLICK_AIR` or `LEFT_CLICK_BLOCK` with the main hand |
| Poisoned Blade (`sword-poison-blade`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — applies poison; `EntityDeathEvent` (`MONITOR`, ignore cancelled) — credits a poison kill |
| Bloody Blade (`sword-bloody-blade`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — starts the bleed; `EntityDeathEvent` (`MONITOR`, ignore cancelled) — credits a bleed kill |
| Dual Wield Stance (`sword-dual-wield`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — applies the multiplier |
| Executioner's Edge (`sword-executioners-edge`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — applies the bonus |
| Riposte Window (`sword-riposte-window`) | `EntityDamageByEntityEvent` at `HIGHEST` ignores cancelled events. It arms the window when the damaged entity is a learner blocking with a shield. It spends the window when the damager is a learner with an armed window. |
| Crimson Cyclone (`sword-crimson-cyclone`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — fires the cyclone on a critical sword hit |
| Lunge Strike (`sword-lunge-strike`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — fires the lunge on a sprinting sword hit |
| Blade Flow (`sword-blade-flow`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — adds a stack; `EntityDamageEvent` (`MONITOR`, ignore cancelled) — clears all stacks when the learner takes damage with final damage above 0 |
| Duelist's Focus (`sword-duelists-focus`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — handles both the offensive bonus and the defensive reduction |
| Whetstone Ritual (`sword-whetstone-ritual`) | `PlayerInteractEvent` (`HIGHEST`, ignore cancelled, also receives cancelled events) — runs the ritual on a sneaking main-hand right-click on a `GRINDSTONE` |
| Crescent Guard (`sword-crescent-guard`) | `EntityDeathEvent` (`MONITOR`) — grants the guard when the killer holds a sword |
| Hamstring (`sword-hamstring`) | `EntityDamageByEntityEvent` (`HIGHEST`, ignore cancelled) — applies the slow |
| Heirloom Edge (`sword-heirloom-edge`) | `PrepareAnvilEvent` (`HIGH`) — stamps the renamed sword as an heirloom; `EntityDeathEvent` (`MONITOR`) — banks kill progress onto the held heirloom |

### Taming

| Adaptation | Bukkit events |
|---|---|
| Mounted Tactics (`tame-mounted-tactics`) | `PlayerMoveEvent` and `PlayerToggleSprintEvent` refresh the mounted state.; `EntityMountEvent` and `EntityDismountEvent` (reflective handlers) start and clear it.; `PlayerQuitEvent`, `PlayerDeathEvent`, and `PlayerGameModeChangeEvent` strip mount buffs.; `EntityDeathEvent` counts mounted kills.; `EntityDamageByEntityEvent` applies the damage bonus when you attack and the reduction when you are hit. |

### Tragoul

| Adaptation | Bukkit events |
|---|---|
| Skeletal Servant (`tragoul-skeletal-servant`) | `PlayerInteractEvent`: sneak plus right-click with a bone summons.; `EntityTargetLivingEntityEvent`: keeps servants on your mark.; `EntityDamageByEntityEvent` at LOWEST: cancels servant damage aimed at you or at anything that is not your mark.; `EntityDamageByEntityEvent` as `onCombatPerks`: runs inherited TragOul perks for servant hits and updates the pack's mark from your own combat.; `EntityDeathEvent`: a dying servant drops nothing and grants no XP.; `EntityDeathEvent` as `onServantKill`: routes servant kills into Corpse Explosion.; `EntitiesUnloadEvent`, `PlayerQuitEvent`, `PlayerDeathEvent`: release the pack. |

### Unarmed

| Adaptation | Bukkit events |
|---|---|
| Battering Charge (`unarmed-battering-charge`) | `EntityDamageByEntityEvent` applies the impact. `EntityDeathEvent` counts kills within 2 seconds of a charge hit. `PlayerMoveEvent` samples horizontal movement and updates the primed trail. `PlayerToggleSprintEvent` primes or drops the charge. |
| Combo Chain (`unarmed-combo-chain`) | `EntityDamageByEntityEvent` builds the combo, or drops it if the main hand holds a melee tool. `PlayerInteractEvent` drops the combo when a left-click lands on nothing after the grace window. |
| Meditation (`unarmed-meditation`) | `EntityDamageByEntityEvent` starts the lockout and ends the session for any combat as attacker or victim. `PlayerToggleSneakEvent` starts and stops sessions. `PlayerQuitEvent` cleans up the absorption capacity modifier. |

### Other listeners

| Where | Bukkit events |
|---|---|
| Ghast Ward (`nether-ghast-ward`) | `EntityDamageByEntityEvent` (HIGHEST) for ghast fireballs and wither skeleton arrows; `EntityDamageEvent` (HIGH) for `ENTITY_EXPLOSION` and `BLOCK_EXPLOSION`, skipped when the damager was already handled as a ghast fireball. Nether-environment worlds only |
| Alpha's Command (`taming-alphas-command`) | `PlayerInteractEvent` — sneak plus left-click with a bone, raycast for the target; `EntityDamageByEntityEvent` — sneak melee with a bone, cancels the hit and commands instead; `PlayerQuitEvent` — clears glow and focus state |
| Drop to Inventory (`hunter-drop-to-inv`) | `BlockDropItemEvent` — requires a sword from `ItemListings.toolSwords` in the main hand, an allowed interact context and a passing block-break check; `EntityDeathEvent` — any mob you killed, no held-item requirement |
| Hunter: Adrenaline (`hunter-adrenaline`) | `EntityDamageEvent` |
| Hunter: Predator Focus (`hunter-predator-focus`) | `EntityDamageByEntityEvent` (player is the direct damager) |
| Hunter: Big Game Hunter (`hunter-big-game`) | `EntityDamageByEntityEvent` (player is the direct damager), `EntityDeathEvent` |
| Axes: Iris Feller (`axe-iris-feller`) | `BlockBreakEvent` (HIGH, cancelled events ignored) |
| HiddenOre bridge | `HiddenOreDropsEvent` |

