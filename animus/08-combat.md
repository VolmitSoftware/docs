---
title: "Animus: Combat"
description: "The combat module: target rules, weapons, guards, protection and limits"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, combat, guards, worldguard, sentinel"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

An NPC fights when its definition enables `modules["animus:combat"]`. The NPC body stays virtual: it is never a world entity, it never appears as an attacker in Bukkit events, and only server-side rules decide what it does.

Combat runs on Spigot and Paper 26.1.2, 26.2 and 26.3, and on Fabric, NeoForge and Forge servers, where no protection adapter is installed and mob control is unavailable; see [mod servers](/animus/16-mod-servers). On Folia each combat NPC runs on the region that owns it; see [Folia](/animus/15-folia) for what differs there.

## Health and death

`modules["animus:health"]` is the only place for an NPC's health, armor, death, drops, experience and respawn, whether or not it fights. An NPC without it cannot be hurt. On its own it needs no combat settings and never looks for targets or hits back:

```json
"modules": {
  "animus:health": {
    "killable": true,
    "maximumHealth": 30,
    "invulnerableTicks": 10,
    "knockback": true,
    "regenerate": true,
    "regenerateTicks": 100,
    "sources": ["players", "mobs", "npcs", "projectiles"],
    "attackerPermission": "town.hit.villagers",
    "showHealth": true,
    "protectFromRange": 0,
    "protectedFromIgnored": false,
    "death": {"drops": [{"item": {"id": "minecraft:emerald", "count": 1}, "maxCount": 3, "chance": 0.5}], "experience": 5, "dropEquipment": false},
    "respawn": {"afterDeath": "respawn", "delayTicks": 200, "points": [{"world": "world", "x": 10, "y": 64, "z": 4}], "order": "in_order"}
  }
}
```

| Field | Meaning |
| --- | --- |
| `killable` | Players, mobs, NPCs and their projectiles can hurt and kill it. Off by default. A Sentinel import sets it from `invincible`, and it applies once the import's combat review is accepted. |
| `maximumHealth` | 1-2048. Left out, the `max_health` [attribute](/animus/04-npc-definitions#attributes), or 20. An NPC starts at full health each time it becomes active; a definition change keeps current health, lowering it only to fit a smaller maximum. |
| `armor`, `armorFromEquipment` | A 0-1 share of each hit, or the worn pieces as for combat. Left out, the `armor` and `armor_toughness` attributes apply as vanilla armor points. |
| `invulnerableTicks` | 0-100, default 10. Hits during this time after a hit do nothing. |
| `knockback` | Default `true`. A hit pushes the NPC back, less by the `knockback_resistance` attribute, onto clear ground only. |
| `regenerate`, `regenerateTicks` | Heals 1 health each `regenerateTicks` (1-72,000, default 100). Off by default. |
| `sources` | What can hurt it: `players` (melee), `mobs` (controlled mobs), `npcs` (other NPCs' melee), `projectiles` (shots from players, mobs and combat NPCs), `fire`, `lava` and `fall`. Left out, the first four. `fire`, `lava` and `fall` count only when listed. |
| `attackerPermission` | A player needs this node to hurt it. |
| `showHealth` | The player who hits it sees its name and health above the hotbar. |
| `protectFromRange` | 0-256, default 0. Only attackers this close can hurt it; 0 means any distance. |
| `protectedFromIgnored` | Anything the combat module's `ignores` matches cannot hurt it. Needs `animus:combat`. |
| `death.drops` | Up to 32 items, each with an `item` (id, `count` and `components` as in [equipment](/animus/04-npc-definitions#appearance-text-and-inventory)), an optional `maxCount` and a `chance` (0-1, default 1). Between `count` and `maxCount` items drop, rolled evenly. |
| `death.experience`, `death.dropEquipment` | Experience orbs, and whether the items it wears and holds drop too, with their components. |
| `respawn.afterDeath` | `respawn` (default), `permadeath`, or `delete`, which deletes the definition when it dies; see [deletion on death](#deletion-on-death). |
| `respawn.delayTicks` | 0-72,000, default 100. |
| `respawn.points`, `respawn.order` | Up to 16 points, taken `in_order` (default), at `random` or the `nearest` to where it fell. With no points it comes back at its own definition position. |
| `dead` | Written by Animus when a permadeath NPC dies. Setting it to `false` revives it. |

Every hit asks [protection](#protection) first, as combat hits do, so WorldGuard's `pvp` flag and other region rules apply. Fire, lava and falls have no attacker and skip protection. Each hit shows every viewer the vanilla hurt flash and plays the body's own hurt sound; a death plays its death sound and the body falls over, and it disappears after a second, as a mob does. The sounds are the client's own for the body type: a horse, llama, turtle, frog or armadillo sounds like itself and an armor stand plays its hit and break sounds. A player body flinches and falls like a player.

On death, drops and experience fall where it died, the player who dealt the last blow, or shot the projectile that did, gets a mob kill on their statistics, and the `death` [behavior trigger](/animus/07-behaviors#automatic-triggers) runs with the killer as its player. A behavior gives commands, rewards or messages on death with `animus:command` or `animus:message` from that trigger; `context.killer` and `context.killer_type` say who it was.

After a respawn delay it comes back at full health at its next point and walks back to its post, as combat NPCs do after a fight; a patrolling NPC picks up its route from the first point. With `permadeath` it stays dead: after its fall has played, Animus sets `dead` to `true` in its definition as one transaction. The definition is kept, the NPC is not shown, and a restart keeps it dead. `/animus npc revive <npc>`, **Revive** in the toolkit's Manage screen or the editor's Revive button clears the mark, and it spawns at its definition position. On an NPC that is merely waiting to respawn, revive brings it back at once.

### Projectiles and the environment

Arrows, spectral and tipped arrows, tridents, snowballs, eggs, small and large fireballs, wither skulls and splash or lingering potions fired by a player or a mob strike a killable NPC's body, which follows its `scale`. Each tick, every such projectile's last move is tested against nearby NPC bodies. A hit counts as a `projectiles` hit by the shooter, so protection, `attackerPermission`, hurt feedback and kill credit follow the shooter.

| Projectile | Damage | Afterwards |
| --- | --- | --- |
| Arrow | Vanilla: its speed times its base damage, plus Power, rounded up; a critical arrow (a fully drawn bow or a crossbow) adds a random bonus | Thuds and is gone; a Piercing arrow keeps flying through as many bodies as vanilla |
| Trident | 8 | Bounces back and drops, then returns with Loyalty |
| Snowball, egg | None; it pushes the NPC | Gone |
| Small fireball | 5, and an NPC that lists `fire` burns for 5 seconds | Gone |
| Large fireball, wither skull | 6 and 8 | Bursts where it hit, without breaking blocks |
| Splash or lingering potion | Harming deals 6 per level and Healing heals 4 per level to the NPC it hit | Drops and breaks at the NPC's feet, so its effects reach real entities as vanilla |

An NPC that lists `lava` takes 4 damage every half second while its body touches lava. One that lists `fire` takes 1 every half second in fire. Both set the body burning, which every viewer sees: 15 seconds after lava and 8 after fire. A burning NPC that lists `fire` takes 1 a second once out of them, and water puts it out. Armor reduces lava and fire damage, not the burn.

An NPC that lists `fall` takes fall damage when an idle fall lands: the blocks past its `safe_fall_distance` attribute (3 by default) times `fall_damage_multiplier`, rounded up, with no armor. Landing in water or on a ladder, vine or scaffolding breaks the fall. Only Animus's own falls count, the ones a walking NPC takes when the block under it goes or before a route leg starts; a route that walks down a drop never hurts. `invulnerableTicks` applies to all three.

A combat NPC is killable only with `animus:health` and `killable: true`; the combat module has no health, defense, death or respawn settings. A combat NPC that cannot be hurt is never chosen as a target by other NPCs, and hits on it are reported as protected. Health runs inside the combat module, so `[combat] enabled = false` in `config.toml` turns it off too. On an imported NPC, health waits for the same review as its combat.

Holograms bound to an NPC can show its health at all times with `npc.health`; see [holograms](/animus/11-guis-holograms-menus).

## Settings

Settings live in the NPC definition as JSON. Every section and field is optional, and the defaults target nothing, so `{"enabled": true}` alone makes an NPC that fights back but never starts a fight. Add [`animus:health`](#health-and-death) to let it be hurt. `enabled` must be the JSON value `true`. An imported NPC also needs `"reviewAccepted": true`. Unknown keys and out-of-range values are rejected with the exact field, such as `$.modules.animus:combat.melee.reach`, and the definition is refused like any other invalid edit.

```json
"modules": {
  "animus:combat": {
    "enabled": true,
    "targets": {"categories": ["monsters"], "entityTypes": ["minecraft:pillager"], "players": ["Griefer"], "npcs": ["bandit"], "squads": ["raiders"]},
    "ignores": {"categories": ["animals"], "owner": true},
    "avoids": {"entityTypes": ["minecraft:creeper"]},
    "targeting": {"scanRange": 16, "scanIntervalTicks": 10, "reactionTicks": 0, "memoryTicks": 60, "retainTarget": false, "fightBack": true, "lineOfSight": "required"},
    "avoidance": {"range": 10, "fleeWhenAttacked": false, "returnPoint": {"world": "world", "x": 0, "y": 64, "z": 0}},
    "squad": {"name": "town", "alertRange": 16},
    "guard": {"player": "00000000-0000-0000-0000-000000000001", "followDistance": 7, "pointRange": 4, "assist": false, "catchUpDistance": 24, "replanDistance": 1.5},
    "pursuit": {"closeChase": true, "rangedChase": false, "speed": 4, "giveUpRange": 32, "leashRange": 64, "returnToPost": true, "teleportWhenStuck": false, "replanTicks": 20, "region": "castle"},
    "melee": {"enabled": true, "damage": 4, "reach": 3, "cooldownTicks": 20, "knockback": 0.4, "fromEquipment": false, "weaponDamage": {"minecraft:stick": 6}},
    "ranged": {"enabled": true, "weapon": "arrow", "damage": 3, "range": 24, "minimumRange": 4, "cooldownTicks": 40, "velocity": 1.6, "inaccuracy": 0, "safeShot": true, "knockback": 0.2, "fromEquipment": false, "useAmmo": false},
    "greetings": {"friendly": "Welcome to town.", "hostile": "Leave now.", "range": 10, "cooldownTicks": 100},
    "victimDrops": true
  },
  "animus:health": {"killable": true, "maximumHealth": 40, "armor": 0.2, "regenerate": true, "respawn": {"delayTicks": 100}}
}
```

| Section | Meaning |
| --- | --- |
| `targets`, `ignores`, `avoids` | Rule lists; see [target rules](#target-rules). An ignore always beats a target. |
| `targeting` | `scanRange` 1-256 blocks, limited further by `maximumScanRange` in `config.toml`. `lineOfSight` is `required`, `ignored` or `field_of_view` (a 140-degree cone in front of the NPC, plus line of sight). `memoryTicks` keeps a target that went behind a wall. `reactionTicks` delays the first attack on a new target. `retainTarget` keeps the current target when a closer one appears. `fightBack` targets whoever hurts the NPC. |
| `avoidance` | The NPC runs from anything in `avoids` within `range`, toward `returnPoint` when set. `fleeWhenAttacked` makes it run from attackers instead of fighting. |
| `squad` | Members never target each other or each other's guarded player. A member that picks a target alerts idle members within `alertRange`. |
| `guard` | Either `player` or `npc` (a UUID). Once farther than `followDistance` (1-64, default 7), the guard walks to a point `pointRange` (0-16, default 4) behind its charge, against the way the charge last moved, and walks faster when more than twice `followDistance` behind. It replans when the charge moved more than `replanDistance` (0.25-16, default 1.5) since the last plan or the plan is `replanTicks` old, at most every 5 ticks. Beyond `catchUpDistance` (0-256, default 24; 0 turns it off), in another world or after a teleport, it stops fighting and teleports to clear ground beside its charge. It attacks whatever hurts its charge and never targets it. With `assist`, it also attacks whatever its charge attacks. |
| `pursuit` | `speed` is 1-10 blocks per second, limited further by `maximumSpeed` in `config.toml`. A target farther than `giveUpRange` (at most 256) is dropped. `leashRange` is measured from where the fight began; past it the NPC drops the target and, with `returnToPost`, walks back before its patrol resumes. `teleportWhenStuck` moves the NPC to its goal after three refused path requests. `region` names a protection region: targets outside it are not chosen, and a target that leaves it is dropped (checked every 10 ticks). |
| `melee` | Every hit swings the NPC's main arm for everyone who sees it. Reach is measured from the NPC's body center to the nearest point of the target's bounds, at most 6 blocks. `fromEquipment` takes damage from the definition's `main_hand` item (see [equipment](#equipment)). `weaponDamage` maps a held item to its damage and replaces any other damage, for melee and ranged, while that item is held. |
| `ranged` | `weapon` is `arrow`, `spectral_arrow`, `trident`, `snowball`, `egg`, `fireball`, `small_fireball`, `wither_skull`, `llama_spit` or `potion`. A potion needs `effect`; see [weapons](#weapons). An NPC with `arrow`, `spectral_arrow` or `trident` holds its weapon drawn while a target is in range and lowers it when the fight ends; any other weapon is thrown with an arm swing. `minimumRange` makes the NPC switch to melee or walk closer. `safeShot` holds fire when a friend is in the line and makes a shot that hits anything other than its target do nothing. `fromEquipment` and `useAmmo` are described below. |
| `greetings` | When a player the NPC can see comes within `range` (1-64), it says `hostile` to a player it would target and `friendly` to anyone else, as `[NPC name]: text` in that player's chat. A player is spoken to again only after leaving range and coming back, and at most once per `cooldownTicks`. Either line may be left out. |

| `victimDrops` | Default `true`. `false` stops mobs killed by this NPC from dropping loot or experience. |

The NPC's [attributes](/animus/04-npc-definitions#attributes) fill what the module leaves out: `attack_damage`, `attack_knockback` and `attack_speed` the melee hit, `follow_range` the scan range and `movement_speed` the chase speed. `max_health`, `armor`, `armor_toughness` and `knockback_resistance` fill `animus:health`. A field the module sets always wins.

A combat NPC that respawns comes back with full ammunition and no target, and the spawn trigger fires again. If that is away from its post and `pursuit.returnToPost` is on, it walks back to the post as it does after a fight.

Current health, targets, cooldowns, ammunition and greeting memory are runtime state. They are never written into the definition and do not survive a restart or despawn.

`"targetableByMobs": true` in the module lets nearby hostile mobs attack the NPC; see [limits](#limits).

## Target rules

A rule list matches a candidate when any one rule matches it.

| Rule | Matches |
| --- | --- |
| `categories` | `players`, `npcs`, `mobs`, `monsters` and `animals` |
| `entityTypes` | Namespaced entity types such as `minecraft:zombie` |
| `players`, `npcs`, `names`, `squads` | Player names or UUIDs, NPC IDs or display names, custom mob names, other NPCs' squads. Names ignore case. |
| `owner` | `true` matches the player in the definition's `owner` field |
| `patterns` | `players`, `npcs` and `names` lists of regular expressions, matched anywhere in the name and ignoring case. A mob with no custom name is matched by its type, such as `zombie`. |
| `items` | `mainHand`, `offHand` and `worn` lists of patterns matched against item ids such as `minecraft:diamond_sword`. An empty hand holds `minecraft:air`. |
| `healthAbove`, `healthBelow` | Percentage of the target's maximum health |
| `permissions` | Permission nodes an online player has |
| `groups` | Permission groups an online player is in, read as the permission `group.<name>` that permission plugins grant to members |
| `effects` | Status effect ids such as `minecraft:strength` |
| `all` | Rule sets that one candidate must match completely: every rule listed in the set, such as a player holding a sword |
| `together` | Groups of 2-8 rule sets. A group matches when different candidates in range match each set at the same scan; then every member is a target. |
| `events` | `kinds` of fights nearby: `player_hurts_player`, `player_hurts_mob`, `mob_hurts_mob`, `player_hurts_npc` and `npc_hurts_npc`. `playerAttacks` (a player hurt something matching that rule set) and `anyAttacks` (a player or mob hurt something matching it). The one who started the fight becomes a target, or a threat in `avoids`. |
| `chat` | Text that, found in a nearby player's chat message (ignoring case), makes that player a target |

Operators hold every permission node that no plugin defines, on Bukkit and on mod servers, so they match `permissions` and `groups` rules unless a permission plugin says otherwise. A `together` group is filled from the nearest candidates first.

`together`, `events` and `chat` are allowed in `targets` and `avoids`; `ignores` refuses them. Sets inside `all`, `together` and `events` hold only the plain rules above. A fight or chat message counts only when its source is within `scanRange` (or `avoidance.range` for avoids), visible under the NPC's `lineOfSight` rule and not ignored. An NPC already fighting keeps its target.

A pattern is at most 128 characters, and an invalid one is refused with its field, such as `$.modules.animus:combat.targets.patterns.players[1]: invalid pattern`. Matching reads at most 256 characters of a name and stops after a fixed number of steps, so no pattern can stall the server.

## Weapons

Every ranged weapon is a real projectile with no shooter. It is not saved with the chunk and cannot be picked up. A shot applies damage at most once, through whichever comes first: a hit on an NPC, a hit on an entity or block, expiry after `helperLifetimeTicks`, or the projectile disappearing or its chunk unloading. Every projectile an NPC owns is removed when it disengages, dies, despawns or loses combat, and every projectile is removed when the plugin stops. Because a projectile has no shooter, no player or mob is credited with its hit or a kill; `VirtualNpcDamageEvent` names the NPC that fired it.

The projectile's own damage, explosion, splash, fire and hatching never happen. Fireballs and skulls never break blocks. Arrows, tridents, snowballs, eggs and potions arc with gravity, so the shot is aimed higher with distance; fireballs, skulls and spit fly straight.

A `potion` applies its effect once to whatever it hits:

```json
"ranged": {"enabled": true, "weapon": "potion", "effect": {"id": "minecraft:instant_health", "amplifier": 1, "durationTicks": 1}, "range": 12, "cooldownTicks": 40}
```

A helpful effect (instant health, regeneration, speed, strength, resistance, fire resistance, absorption, health boost, saturation, night vision, water breathing, invisibility, jump boost, haste, luck, slow falling, conduit power, dolphin's grace, hero of the village) is not an attack: it needs no protection check, it may land on the NPC's charge or squad, and an NPC with such a weapon never uses melee. Any other effect is an attack and passes protection like a hit. On another combat NPC, instant health heals 4 times 2 to the amplifier and instant damage deals 6 times 2 to the amplifier through its defense; other effects do nothing to NPCs. A healer is a potion NPC whose targets select the players it should help, for example `"targets": {"all": [{"categories": ["players"], "healthBelow": 50}]}`.

With `useAmmo`, each shot uses one matching item counted from the definition's stored inventory: arrows (plain, tipped or spectral) for `arrow`, the item itself for `spectral_arrow`, `trident`, `snowball` and `egg`, fire charges for fireballs, wither skeleton skulls for `wither_skull`, and splash or lingering potions for `potion`. `llama_spit` needs none. The count is runtime state: the stored inventory is never changed, the count starts again when the NPC respawns, the definition changes or the server restarts, and an NPC with none left stops shooting and uses melee or closes in. `/animus combat status npc=<npc-id>` shows `ammunition=<count>`.

## Equipment

`melee.fromEquipment` reads the `main_hand` item of the definition's `equipment`:

| Held item | Damage |
| --- | --- |
| Netherite, diamond, iron, copper and stone, golden or wooden sword | 8, 7, 6, 5 and 4 |
| Axes | 10 netherite, 9 diamond, iron, copper and stone, 7 golden and wooden |
| Trident | 8 |
| Mace | 6 |
| Bow or crossbow | 1 |
| Anything else or nothing | 1 |

`ranged.fromEquipment` gives 6 for a bow or crossbow and otherwise the same table. `armorFromEquipment` in `animus:health` adds the worn `head`, `chest`, `legs` and `feet` pieces: a full diamond or netherite set is 0.8, iron 0.6, chainmail 0.48, golden 0.44, copper 0.4 and leather 0.28; the total is at most 0.8. Enchantments and item components are not read.

## Who can hurt whom

| Attacker | Victim | How |
| --- | --- | --- |
| NPC | Player or mob | Bukkit damage with a damage location and no causing entity. `VirtualNpcDamageEvent` can cancel or change it first. |
| NPC | NPC | Virtual damage applied by Animus. |
| Player | NPC | A hit that passed the reach, line-of-sight and rate checks. The amount is the player's attack damage attribute scaled by attack charge, like vanilla. Enchantments and potions are not added. |
| Controlled mob | NPC | `/animus combat mob`, or a mob drawn by `targetableByMobs`, subject to the NPC's health settings. Zombies, husks, drowned, zombie villagers and vindicators. |
| Projectile from an NPC | Player or mob | The projectile's own effect is cancelled and the hit is applied once through the combat module. |
| Projectile from an NPC | NPC | Projectiles pass through virtual bodies, so each flight segment is tested against nearby NPC bounds. |
| Projectile from a player or mob | NPC | The same flight test, against NPCs that take `projectiles`. See [projectiles and the environment](#projectiles-and-the-environment). |

An NPC without a killable `animus:health` module cannot be hurt by any of these. Every hit, in every direction, asks protection first, then applies armor and the other health settings, then changes health exactly once. Damage and death of an NPC fire the `damage` and `death` [behavior triggers](/animus/07-behaviors#automatic-triggers).

## Deletion on death

An NPC whose `animus:health` has `"respawn": {"afterDeath": "delete"}` processes its death normally (drops, experience, the `death` trigger), and then its definition is deleted as one ordinary transaction, the same as `/animus delete`. The server log names the transaction:

```none
Combat NPC guard died and was deleted (animus:health afterDeath delete); undo with /animus rollback <transaction>
```

`/animus rollback <transaction>` restores the definition exactly. If the definition was already deleted or replaced, nothing happens. `/animus combat status` counts deletions as `deleted-on-death`.

## Protection

Protection answers allow or deny for each hit. If it fails or gives no answer, the hit is denied and counted under `protection-failures` in `/animus combat status`.

An NPC also asks protection before it chooses a target and every 10 ticks while it chases one, so it does not chase a target it may not hit. When protection refuses a target, or a melee or projectile hit on it is denied or cancelled by `VirtualNpcDamageEvent`, the fight ends at once, mid-swing or mid-chase, as if the target were lost: the NPC stops and, with `returnToPost`, walks back to its post. It then leaves that target alone for 5 seconds, including `fightBack`, squad alerts and fights it witnesses. `/animus combat target` and the `target` operation try the target again at once. An NPC that cannot be hurt and an invulnerable entity are never chosen as targets.

With WorldGuard installed, Animus reads its region flags. NPCs have no WorldGuard identity and are checked as non-members; players are checked as themselves.

| Hit | Flag that must not be denied |
| --- | --- |
| Anything hurting a player or an NPC | `pvp`, where both sides stand. A player in an `invincible` region is never hurt. |
| An NPC hurting an animal | `damage-animals` where the animal stands |
| A mob hurting or being controlled against an NPC | `mob-damage` where the NPC stands |

Hits on monsters are not limited by WorldGuard. If WorldGuard is installed but disabled, at startup or later, or its API cannot be used, every hit is denied. Region membership, region priorities and other plugins' protection are not consulted except through these flags.

`pursuit.region` is a WorldGuard region in the NPC's world. Where no protection plugin provides regions (servers without WorldGuard, and every mod server), or the region does not exist, the region leash cannot be checked: the NPC fights within its normal ranges, the server log says so once per NPC, and `/animus combat status` counts it as `region-unavailable`.

## Behaviors and commands

The built-in [`animus:combat-control`](/animus/07-behaviors#actions) action drives combat at runtime:

| `operation` | `target` | Effect |
| --- | --- | --- |
| `enable` | None | Clears a disengage, so rules choose targets again. |
| `disable` | None | Drops the target, removes the NPC's projectiles and stops rule targeting until `enable`. Damage still reaches the NPC. |
| `target` | Required | Attacks this player, mob or combat NPC regardless of rules, within `giveUpRange` and `leashRange`. |
| `release` | None | Drops the current target; rules keep running. |
| `guard` | Optional | Guards this player or NPC; without `target`, stops guarding. Replaces the definition's guard until despawn. |

`target` is a UUID, or `player` for the player who started the run, so a hire dialogue can guard whoever answered it. The action fails with a reason when the NPC has no enabled combat, is dead, or the target is not available in its world. Use the `damage` and `death` triggers to react to fights.

Administrators have the same operations as `/animus combat` commands, which need `animus.admin`; see [commands](/animus/02-commands-permissions#combat) for the full list. The ones you use most:

```none
/animus combat status npc=guard
/animus combat target guard <uuid>
/animus combat guard guard stop
```

### Manual attack and mob control

Two more commands act on an active NPC directly, outside its target rules:

```none
/animus combat attack <npc> <target> [damage=1]
/animus combat mob <npc> <mob>
/animus combat mob <npc> stop
```

`combat attack` makes the NPC hit a loaded player or mob once. The hit uses Bukkit damage with no attacking entity, fires `VirtualNpcDamageEvent`, which can cancel it, and asks protection like any other hit. Reach, world, loaded chunks and line of sight are checked again after the event. The command reports the damage applied and the target's health.

`combat mob` makes a loaded zombie, husk, drowned, zombie villager or vindicator attack the NPC. Its own goals, targeting and path are paused while it is controlled and restored when it is released, the NPC despawns or dies, or the plugin stops. `VirtualNpcDamagedByMobEvent` can cancel the damage, and the NPC's defense applies. Mob control works on Paper, Spigot and Folia; on mod servers the command says it is unavailable.

On an imported NPC, both commands work only after its combat settings are accepted (`enabled` and `reviewAccepted` both `true`).

## Work limits

Plugin settings are TOML and apply when the file is saved:

```toml
[combat]
enabled = true
maximumNpcs = 256
brainsPerTick = 48
targetScansPerTick = 8
scanCandidates = 32
scanCells = 32
squadAlertsPerTick = 8
pathRequestsPerTick = 2
maximumHelpers = 64
helpersPerNpc = 4
helperUpdatesPerTick = 32
helperLifetimeTicks = 100
idleSleepTicks = 40
eventsPerTick = 8
maximumScanRange = 100
maximumSpeed = 8
```

Every NPC with accepted combat is a combatant, up to 10,000. `maximumNpcs` (1-4096) is how many of them fight or scan at once. A guard with nothing to fight and no player within its scan range plus 16 blocks sleeps: it does not scan, holds no slot, and checks again every `idleSleepTicks`. When every slot is taken, guards that want one wait in line and get the next free slot in the order they asked. A guard that only scans gives its slot to the next one in line after each scan, while a guard that fights keeps it until the fight ends. The console says once when guards start waiting and once when a slot is free again. `/animus combat status` shows `fighting-or-scanning=<used>/<maximumNpcs>`, `waiting`, `sleeping` and `peak-waiting`. `/animus import citizens review` and `accept` say when more guards are accepted than may fight at once.

Each tick wakes at most `brainsPerTick` NPCs and runs at most `targetScansPerTick` target scans, each looking at no more than `scanCandidates` entities and `scanCells` chunks. An NPC that finds nothing doubles its wait between scans up to `idleSleepTicks`; damage, an alert or an operation wakes it at once. Scans read loaded chunks only and never load terrain.

`maximumHelpers` caps live projectiles across the server and `helpersPerNpc` per NPC; `helperLifetimeTicks` is how long a projectile flies before it is removed. Fights and chat messages wait in a queue of 64, and at most `eventsPerTick` (1-64) are examined per tick; a message that finds the queue full is dropped and counted as `dropped-events`. `maximumScanRange` (16-256) caps every NPC's `scanRange`, and `maximumSpeed` (1-10 blocks per second) caps every `pursuit.speed`.

## Limits

- Movement uses the NPC navigator: walking only, on full blocks, at most 30 blocks per path request. A path that fails after it was accepted is not reported back, so such a target is dropped only by give-up range, leash or line-of-sight memory.
- Knockback and stuck teleports move an NPC only onto loaded, clear, supported ground.
- A route resumes from its first point after a fight.
- Lightning, ender pearls, shulker bullets, evoker fangs and gun plugins are not weapons. Item display names, lore and whole-inventory contents are not target rules.
- Greetings and target rules see only what one scan saw: at most `scanCandidates` entities, and idle NPCs scan less often.
- Player melee damage against NPCs ignores enchantments, potions and critical hits. Projectile damage reads Power, critical arrows and the potion's level, and nothing else: no Impaling, Punch, Flame or tipped arrow effects.
- A projectile is followed for at most a minute of flight and at most 2,048 at once; one fired by a dispenser or with no shooter passes through NPC bodies. A struck projectile is used up even when protection, `attackerPermission` or invulnerability stops the damage.
- Virtual bodies never drown or suffocate, and magma blocks, campfires, cactus and sweet berry bushes do not hurt them. Fire-immune body types burn like any other; leave `fire` and `lava` out for them.
- Current health is runtime state: a restart or despawn brings a living NPC back at full health, and an NPC waiting to respawn comes back at once. Only a permadeath is kept.
- The hurt and death animations use one generic damage type, so a player body's hurt sound never varies with the cause.
- Real mobs fight an NPC only through mob control: `/animus combat mob`, or `targetableByMobs`. With `"targetableByMobs": true` in the module, every second the NPC draws up to 3 zombies, husks, drowned, zombie villagers or vindicators within 16 blocks that have no target of their own and can see it. Each walks to the NPC and attacks with its own attack damage every second for up to 10 seconds, showing its own attack animation, then gets its own goals, path and target back. Brain-driven and ranged mobs (piglins, skeletons) are not drawn. This works on Paper and Spigot only; on Folia and mod servers the setting does nothing.

Settings imported from Sentinel are described in [migrating from Citizens](/animus/13-migrating-from-citizens#sentinel-settings).
