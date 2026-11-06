---
title: "Bastion: Protection settings"
description: Building permissions, creature spawning, items, damage, and travel
published: true
date: 2026-11-06T00:00:00.000Z
tags: bastion, protection, permissions
editor: markdown
dateCreated: 2026-10-16T22:25:16.000Z
---

Claim protection settings control actions inside full-height claimed columns. Open the selected claim's management menu and choose its protection settings, or use the commands below. Claim ownership and the `MANAGE_FLAGS` role permission determine who can change settings; command access also requires `bastion.manage`.

Anchor hoppers remain blocked unless the claim owner enables automatic refueling in the anchor menu. The exception applies only to configured fuel entering the registered barrel from a hopper and inventory inside the same claim and child plot. Vanilla fuels must have no metadata; custom items are accepted only when their registered provider authenticates them. Extraction, other items, pending receipts, and transfers across land boundaries stay blocked.

## Change a rule

`/bastion flag <flag> <true|false|default>` sets a claim rule or removes its explicit override. The menu shows 28 rules per page and distinguishes explicit settings, defaults, and building inheritance. Clicking cycles through default, allow, deny, then default again. Changes save to the claim journal and appear in claim activity.

`true` allows the named action. For a damage rule, it allows that damage; `false` prevents it. Allowing an action does not bypass another applicable protection, claim ban, lock, or child-plot access check.

## Find rules

Claim, plot, server-land and world-policy editors share search and an explicit-overrides filter. Search matches canonical rule names and your translated flag labels without treating punctuation as patterns. Creature and spawn-reason searches use their displayed Bukkit names. The chat prompt accepts up to 64 characters; `reset` clears the search and `cancel` returns to the previous view. Prompts expire after 60 seconds and are cancelled by commands, another inventory, or disconnecting.

Flag categories are Building, Interaction, Combat, Movement, Environment and Spawning. **Explicit rules only** shows settings saved at the current scope, including explicit denials. It does not list inherited values. Filters stay active while paging and editing, and returning from a spawn browser restores the flag view. Opening another scope starts a fresh view.

## Permission conditions

Each explicit player-action flag can have one optional permission condition. Open **Permission rules** from its protection editor, or use `/bastion rules` at the claim or plot. Choose the flag, allow/deny value, permission node, and **Has permission** or **Lacks permission**, then review and confirm. The same editor is available for global/world claim and wilderness defaults through `/bastion policy`.

A matching condition applies that scope's saved value. A nonmatching condition skips it and continues through normal inheritance, including same-scope `BUILD` fallback for `BREAK` and `PLACE`. Each scope has at most one condition per flag, so scope order and the specific flag determine precedence. Conditions do not override ownership or trust grants, claim bans, visitor locks, or paid-plot access. Public parent rules still do not grant plot membership.

Changing a flag's allow/deny value retains its condition. Resetting the flag removes both. Removing only the condition requires confirmation and makes the saved flag value unconditional. Stale reviews cannot replace a newer value or condition. The condition browser can show only flags with local conditions; ordinary flag editors also show the effective value for their viewer.

Conditions support player-bound flags, including hunger and damage. They are unavailable for `MOB_SPAWN`, `PASSIVE_MOB_SPAWN`, `FIRE`, `EXPLOSIONS`, `MOB_GRIEF`, and `LEAF_DECAY`. Damage and hunger retain their existing effect rules: a ban or lock does not grant damage immunity. Flight keeps its separate trust, permission and platform requirements.

Permission nodes use Bukkit's permission checks, including provider/default behavior. Nodes are normalized to lowercase, contain 1–128 ASCII letters, numbers, dots, underscores, hyphens or asterisks, and start with a letter or number. All claims, plots and defaults together may use at most 256 distinct nodes. Invalid additions are rejected before publication.

Direct actions check current permissions. Projectiles capture the configured nodes at launch and keep that snapshot through impact and lingering-cloud checks; land rules are still evaluated at the affected positions. Pearl teleport checks use the player's current permissions at departure and arrival. A newly configured node absent from a projectile snapshot matches neither **Has** nor **Lacks**. Actorless actions and remote pet owners without a safe player context likewise cannot satisfy a permission condition.

Example global claim rule:

```toml
[protection.claims.flags]
BREAK = true

[protection.claims.conditions.BREAK]
permission = "server.builder"
expected = true
```

`conditions` is available beside `flags` in every configuration scope. A condition requires an explicit flag value in that scope. Claim and plot conditions are saved with their land data. Splits copy conditions; merges require matching policies.

## Explain access

`/bastion why <flag>` explains the result at your current X/Z column. It identifies ownership, active trust, bans, locks, occupancy restrictions or a protection rule. Rule decisions include the deciding flag, scope and matching permission condition. A missing condition match therefore shows the fallback rule that actually decided the result.

Integration rules can further restrict an allowed action. An extension denial identifies its provider and rule ID. Debug dumps list registered rules and faults; a quarantined rule uses its provider's declared failure policy until it is closed and registered again. See the [protection API](/bastion/09-api#protection-extensions) for limits and recovery.

This is a location check, not a prediction for every interaction. A target in another column, a projectile's launch state, departure rules, entry checks or another plugin can add restrictions. Flight also reports its separate eligibility.

## Building and trust

`BREAK` and `PLACE` independently control breaking and placing. Unset values inherit the claim's `BUILD` setting. `BUILD` remains the broader permission for building tools and block transformations.

`BREAK` also controls filling buckets and harvesting blocks. `PLACE` also controls emptying buckets. Placing against an interactive container follows ordinary sneak-placement behavior; permission to place blocks does not grant access to the container.

Trust roles can grant `BREAK`, `PLACE`, or both. A `BUILD` grant includes both, while either individual grant does not grant `BUILD`. Owners retain building access. Child-plot membership and parent bans still apply; a public parent setting does not grant building access inside someone else's child plot.

## Containers, mobs, fire and explosions

`CONTAINER` covers chests, barrels, shulker boxes, furnaces, hoppers, dispensers, droppers, brewing stands, crafters, lecterns, chiseled bookshelves, shelves, jukeboxes, decorated pots, flower pots, beehives and bee nests, composters, and signs. Clicking, dyeing, glowing and editing a sign all need `CONTAINER`; waxing it needs `BUILD`. Note blocks, cakes, candles and other plain interactive blocks stay under `INTERACT`.

`MOB_GRIEF` covers block changes by endermen, ravagers, withers and wither skulls, the ender dragon, silverfish, door-breaking mobs, and crop-eating rabbits and foxes. It also covers mobs trampling farmland or turtle eggs, mobs picking up items that no player threw (allays never pick up items in a protected claim), and damage to vehicles, item frames, paintings and armor stands with no player behind it. Falling sand and gravel, sheep, villagers, snow golems, iron golems and mobs fighting each other are unaffected. Items and mobs can trigger pressure plates and tripwires unless a player threw the item and lacks `REDSTONE` there.

Any non-player block change from another claim, child plot or wilderness column is blocked regardless of these rules. A falling block cannot land in a different claim, plot or wilderness area from the one it started falling in, and melons and pumpkins cannot grow from a stem across a border.

`FIRE` controls fire that starts or spreads without a player: lava, lightning, fire spread and burning. A player who can build may light campfires, candles, portals and fires with flint and steel or fire charges. TNT and TNT minecarts remember where they were primed or placed, and fireballs and wind charges where they were launched. Their explosions and blast damage cannot reach a claim, plot or wilderness area other than that origin, even when the claim allows `EXPLOSIONS`. Blasts that break item frames and paintings follow `EXPLOSIONS`.

## Creature spawning

`MOB_SPAWN` controls hostile creatures that implement Bukkit's `Enemy` classification. `PASSIVE_MOB_SPAWN` controls other creatures. Both allow spawning by default.

The settings menu opens separate paginated lists for creature types and spawn reasons. The command uses Bukkit enum names:

```text
/bastion spawnrule type COW deny
/bastion spawnrule reason SPAWNER deny
/bastion spawnrule type COW default
```

An explicit creature-type rule replaces its category setting. A denied spawn reason blocks spawning even when the creature type is allowed; allowing a reason does not override a denied creature type. Default removes that entry. Claims store at most 256 creature-type entries and 64 reason entries.

These rules act when creatures spawn. They do not remove existing creatures or control nonliving entity creation. Split claims copy spawning policy. Merges require matching spawn rules and retain the destination policy; ownership transfer retains it.

## Player activities

| Rules | Behavior |
| --- | --- |
| `ITEM_DROP`, `ITEM_PICKUP` | Control player-initiated drops and ground-item pickups at both affected positions; death loot and hopper rules remain separate |
| `HUNGER_LOSS` | Prevents food-level decreases when denied; food gains still work |
| `ENDER_PEARL`, `CHORUS_FRUIT`, `PORTAL` | Check applicable travel at departure and destination, in addition to destination entry protection |
| `POTION_DRINK` | Controls drinking potions |
| `POTION_SPLASH` | Controls splash and lingering potions at their source and affected targets; existing combat protection still applies |

These rules allow their named activities by default and also apply to claim owners. Use and consumption are checked before spending an item where the server supplies a cancellable event. A denied arrival does not guarantee a refund for an item already consumed. Denied potion targets receive none of that potion's effects; unrelated effects already active on them are left alone.

Administrator bypass is captured when a consumable projectile launches and retained by its lingering cloud. Changing that permission afterward does not revoke the captured potion-policy bypass; existing combat checks remain separate. Actorless dispenser potions use the claim's environmental potion setting. A lingering cloud without a player source does not affect players or entities in a different claim, child plot, or wilderness area than the column where its potion was launched.

Portal frames generated by lighting or by a linked nether portal require `BUILD` at every frame block; a paired portal cannot be created inside a claim the traveller cannot build in. Players without `INTERACT` cannot push boats or minecarts that are inside a claim.

Paper reports chorus travel through its general consumable-teleport cause. On that platform, custom consumables using the same cause also follow `CHORUS_FRUIT` policy.

## Player environmental damage

The following rules allow damage by default. Deny a rule to prevent that cause of player damage inside the claim:

| Rules | Causes |
| --- | --- |
| `DAMAGE_FALL`, `DAMAGE_FLY_INTO_WALL` | Falling and flying into a wall |
| `DAMAGE_DROWNING`, `DAMAGE_SUFFOCATION`, `DAMAGE_STARVATION` | Drowning, suffocation, starvation |
| `DAMAGE_FIRE`, `DAMAGE_LAVA`, `DAMAGE_HOT_FLOOR` | Fire, burning ticks, lava, hot floors |
| `DAMAGE_CONTACT`, `DAMAGE_FREEZING`, `DAMAGE_LIGHTNING` | Contact, freezing, lightning |
| `DAMAGE_POISON`, `DAMAGE_WITHER`, `DAMAGE_MAGIC` | Poison, wither, magic |
| `DAMAGE_CRAMMING`, `DAMAGE_FALLING_BLOCK`, `DAMAGE_DRYOUT` | Entity crowding, falling blocks, drying out |

These settings use claim environmental policy, including for owners and banned players. A ban by itself never grants damage immunity. PvP and explosion protection remain separate. Void, administrative kill, world-border, attack, and unlisted damage causes are not governed by these rules.

## World defaults and inheritance

`/bastion policy` opens staff controls for global defaults and loaded worlds. Claim defaults and wilderness defaults are separate. Rules use this order:

1. Explicit child-plot rule, when inside a plot.
2. Explicit claim rule.
3. The world's claim defaults.
4. Global claim defaults.
5. The built-in rule default.

Unclaimed land uses world wilderness defaults, global wilderness defaults, then allows the action. Wilderness therefore stays unrestricted until configured. At each scope, unset `BREAK` and `PLACE` use that scope's `BUILD` before checking the next scope. Creature types and spawn reasons inherit independently; an inherited reason denial still blocks an allowed type.

Menus show the effective value and its source. Resetting a rule removes only its local override. Defaults are hot-reloadable in `config.toml`; invalid edits leave the active configuration unchanged. World entries use full world UUIDs, so renaming a world does not reassign its policy. The editor displays loaded world names and saves their UUIDs.

```toml
[protection.claims.flags]
PVP = false

[protection.wilderness.flags]
FIRE = false

[[protection.worlds]]
world = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"

[protection.worlds.claims.flags]
MOB_SPAWN = false

[protection.worlds.wilderness.entityTypes]
CREEPER = false
```

The UUID above is an example. Each scope has `flags`, `entityTypes`, and `spawnReasons` maps. Names use Bukkit enums; the configuration validates supported living creature types and spawn reasons. Configuration accepts at most 256 world entries, 256 creature entries per scope, and 64 reason entries per scope.

## Child-plot rules

Plot protection controls require the parent claim's `MANAGE_FLAGS` authority. Plot tenants do not gain this permission automatically. Environmental and activity rules can inherit from the parent or be overridden locally. Inherited public building rules do not bypass a plot's separate trust: a local plot allow is required to grant public member actions, and bans, locks, occupancy and rental checks still apply. Member-action rules cannot be changed while a plot has paid occupancy or a purchase hold. Public member-action overrides saved before a sale or rental remain stored but do not grant visitor access during occupancy.

## Server-owned land

`/bastion server menu` opens staff management for full-height server claims and their plots. Server land has no player owner; creating it grants no personal ownership to the staff member. It consumes no player claim allowance or quota and pays no power upkeep. Geometry limits and overlap checks still apply.

Staff can create, expand, release, rename, remove and change protection settings through the server controls. Server land cannot be transferred to players, sold, rented, merged, split, fueled or given an anchor. Existing player claims cannot be converted to server ownership.

Claim flight still requires trusted claim land and a supported platform; wilderness defaults and permission conditions do not enable wilderness flight.

## Server-zone game modes

Select server land, then use `/bastion server gamemode` or **Zone game mode** in its management menu. Choose Survival, Creative, Adventure, Spectator or **No override**, then confirm. New server land starts with no override. The summary shows the current policy. Cancelling leaves it unchanged; changed claims or revoked staff permissions invalidate an open review. Only server-owned claims can have a game-mode policy, and it covers their exact full-height columns, including child plots.

Bastion remembers the mode before entry and keeps that original while a player moves between adjacent mode zones. Leaving all mode zones, removing the policy or deleting the land restores it. Policy changes also reach players who stand still. Join, teleport, world change and respawn checks use the player's actual position. `bastion.gamemode.bypass` skips this policy and ends an existing mode session; it is not granted to operators by default.

An accepted game-mode change from another plugin or administrator takes priority. Bastion stops enforcing zone modes until the player leaves all enabled mode zones, and it does not overwrite that external mode on exit. If another plugin cancels a zone mode change, Bastion likewise stops retrying until exit. If restoration is cancelled, Bastion retains a recovery marker and retries at the next join or enable rather than repeatedly firing changes.

Quit restores Bastion-owned mode changes. Player data also records the original and last applied modes so the next enable or join can recover an unfinished session without overwriting a later external change. During disable, Bastion restores players only where the current thread owns them. Folia's global disable callback cannot guarantee that ownership or schedule work after plugin disable; affected players retain their current mode and a recovery marker until Bastion is enabled again or they rejoin with it enabled. The console reports the deferred count. This feature does not isolate inventories or remove items acquired in Creative mode.

## Denial feedback

`/bastion feedback` requires `bastion.policy`. It controls the default delivery channel, a shared per-player cooldown, and channel overrides for individual actions or `ENTRY`. Channels are `CHAT`, `ACTION_BAR`, `TITLE`, and `NONE`. These settings apply server-wide; they do not change whether an action is allowed.

The default is chat with a two-second cooldown. Alternating blocked actions shares that cooldown. Messages use the player's selected language and identify the attempted action; entry denials have separate wording. Prevented environmental damage does not generate a denial message. This is action feedback, not a deciding-rule explanation.

```toml
[feedback]
defaultChannel = "CHAT"
cooldownMillis = 2000

[feedback.channels]
BREAK = "ACTION_BAR"
ENTRY = "TITLE"
```

The menu cycles cooldown presets of 1, 2, 5 and 10 seconds. TOML accepts 250–60,000 milliseconds. Resetting an action channel restores the default channel. Invalid values retain the active configuration; stale menu edits require reopening.

[Commands and permissions](/bastion/02-commands) · [Capabilities](/bastion/08-feature-map) · [Bastion](/bastion)
