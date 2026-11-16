---
title: "Animus: Java Modules and API"
description: "The NPC service for Bukkit plugins and trusted Java modules: creating, editing and driving NPCs, definition modules, events, capabilities, import converters and integration hooks"
published: true
date: 2026-11-15T00:00:00.000Z
tags: "animus, api, modules, developers, integration"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Animus has its own API for other plugins. A Bukkit plugin or a trusted Java module can create, edit, remove and drive NPCs, add its own data and hooks to NPC definitions the way Citizens plugins added traits, and listen to NPC events. Java modules also add behavior actions, conditions, triggers, import converters and integration hooks.

The API comes in two artifacts. `animus-api` (package `art.arcane.animus.api`, Java 25, no other dependencies) holds the platform-neutral contracts: the NPC service, definitions, capabilities and modules. `animus-bukkit-api` (packages `art.arcane.animus.bukkit.api` and `art.arcane.animus.bukkit.event`) adds the Bukkit service lookup and the NPC events. The current API version is 1.3.0.

Two examples show the API in use:

- The [example plugin](https://github.com/VolmitSoftware/Animus/tree/master/examples/plugins/npc-demo) is a Bukkit plugin built on the public API alone. It makes a temporary NPC that walks and talks, cancels left clicks, counts right clicks in its own definition module, and saves a persistent NPC to sit on.
- The [reference module](https://github.com/VolmitSoftware/Animus/tree/master/examples/modules/reference) is a Java module. It registers a `reference:hello` action and counts interactions. It registers no protection or economy hook, because only one module can provide each and an example that claimed one would keep a real provider from enabling.

## Depending on the API

Through JitPack:

```groovy
repositories {
    maven { url = 'https://jitpack.io' }
}
dependencies {
    compileOnly 'com.github.VolmitSoftware.Animus:animus-api:<tag>'
    // Bukkit plugins only:
    compileOnly 'com.github.VolmitSoftware.Animus:animus-bukkit-api:<tag>'
}
```

Use an API tag such as `api-1.3.0` for `<tag>`; a commit hash also works. A Bukkit plugin needs both artifacts, a Java module only `animus-api`.

To build the API locally instead, run this in an Animus checkout with Java 25:

```sh
./gradlew :animus-api:publishToMavenLocal :animus-bukkit-api:publishToMavenLocal
```

This writes `art.arcane.animus:animus-api:1.3.0-SNAPSHOT` and `art.arcane.animus:animus-bukkit-api:1.3.0-SNAPSHOT` to `~/.m2/repository`, with sources and JavaDoc jars. Add `mavenLocal()` to your build and depend on them with `compileOnly`.

The API classes ship inside the Animus plugin and mod jars, so leave them out of your own jar. A Bukkit plugin adds `depend: [Animus]` to its `plugin.yml`, or `softdepend: [Animus]` and checks that the service is there before using it.

## NPC service

`NpcService` creates, edits, removes and drives NPCs for one plugin or Java module:

| Holder | How it gets the service |
|---|---|
| A Bukkit plugin | `Bukkit.getServicesManager().load(AnimusNpcs.class).service(this)` |
| A Java module | `context.npcs()` in `enable` |

Each plugin and module gets its own service, and the same plugin gets the same object every time. What a service makes belongs to its plugin or module: its temporary NPCs, its definition modules, the NPCs it hid from players and its follows all end when the plugin disables or the module stops. From then on its service answers `UNAVAILABLE`. A Java module's service also answers `UNAVAILABLE` while the module is suspended. `AnimusNpcs.service` throws `IllegalStateException` when Animus is still starting or did not start, or when the plugin is not enabled.

```java
public final class Greeter extends JavaPlugin {
    private NpcService npcs;

    @Override public void onEnable() {
        npcs = getServer().getServicesManager().load(AnimusNpcs.class).service(this);
    }

    /** A temporary NPC beside the player walks to a point, then speaks. */
    void greet(Player player, Location start, Location goal) {
        NpcSpec spec = NpcSpec.builder().name("&bGuide").location(BukkitNpcs.location(start)).build();
        npcs.createTemporary(spec).thenCompose(created -> {
            if (created.status() != Outcome.Status.OK) return CompletableFuture.completedFuture(null);
            NpcHandle npc = created.value().orElseThrow().npc();
            return npcs.navigate(npc, BukkitNpcs.location(goal), 0)
                    .thenCompose(arrived -> npcs.speak(npc, "&aThis way!", Audience.within(16), NpcService.Speech.BOTH));
        });
    }
}
```

`BukkitNpcs` converts between Bukkit types and the service's own: `location(Location)` and `location(NpcLocation)` (when the world is loaded), and `item(ItemStack)` for an `ItemSpec` with the stack's id, count and components.

`AnimusNpcs` also looks NPCs up at once, from any thread: by id (`byKey`), by UUID (`byUuid`), by display name ignoring case and colours (`byName`), and all of them in id order (`all`). Each `NpcInfo` holds the UUID, id, folder, display name and whether it is spawned. Temporary NPCs are included. These answers come from the loaded definitions, not from where an NPC stands now; `npcs.state(npc)` gives that.

## Creating and editing NPCs

An `NpcSpec` holds the parts of a definition a plugin sets. Every setter is optional, and building never fails; the service checks the result as the web editor does and answers `INVALID` with one diagnostic per problem.

| Builder call | Definition field |
|---|---|
| `id("guard")` | `id`: 1-64 lowercase letters, digits, `_` or `-` |
| `group("town")` | `group`: the folder under `npcs/` |
| `type("minecraft:villager")` | `type`, the body |
| `name("&6Guard")` | `name`, with `&` colour codes |
| `location(NpcLocation.of("world", x, y, z).facing(yaw, pitch))` | `position`; a world UUID is written as the world's name |
| `spawned(false)` | `spawned` |
| `skin(SkinSource.player("Notch"))` | `skin`, as a saved skin file; see [skins](#skins) |
| `pose(NpcSpec.Pose.SITTING)` | `pose` |
| `equip(NpcSpec.Slot.MAIN_HAND, ItemSpec.of("minecraft:iron_sword"))`, `unequip(slot)` | `equipment` |
| `module("shop:prices", "{\"tier\":2}")`, `removeModule(key)` | one key of `modules` |
| `json("{\"hologram\":{\"lines\":[\"Open daily\"]}}")` | any other top-level field |

Raw `json` fields are laid down first and the typed parts over them. A raw field set to `null` is removed, and `uuid`, `revision` and `schemaVersion` are refused because Animus writes them.

| Method | Result |
|---|---|
| `create(spec)` | A persistent NPC, saved under `npcs/<group>/<id>.json` like one made in game. It needs an id and a location. |
| `createTemporary(spec)` | A temporary NPC that is never saved. It needs a location; without an id it gets one such as `temp-1a2b3c4d`. |
| `edit(npc, changes)` | Applies only the parts set in `changes` to the NPC's current definition. The id and folder cannot change. |
| `updateModule(npc, key, change)` | Changes one module's data from what it holds at that moment. |
| `remove(npc)` | Deletes a persistent NPC's file, or forgets a temporary NPC. |
| `state(npc)` | `NpcState`: id, whether it is temporary and which plugin or module made it (`owner()`), whether its body is active, and where it stands (its definition's facing). |

New NPCs default to a `minecraft:player` body, their id as the name, the `npcs/` folder itself and `spawned: true`. For a spawned NPC, `create` and `createTemporary` complete once its body is active, so the next call can drive it; one whose chunk is still loading completes after five seconds, saved but not yet active, which `state` shows. An id another NPC already has, saved or temporary, answers `CONFLICT`. A body type the server cannot show, an invalid field, a plugin module that refuses its data, and a spawned NPC the server could not show (for example in a world that is not loaded) answer `INVALID`, and nothing is saved.

A persistent NPC's changes are saved through the same file queue as commands and the web editor, as one transaction each. The console names each one with the command that reverts it, such as `plugin:Shops created guard; /animus undo 3f9a1c2b reverts it`; run that from the console or as an admin. `updateModule` saves quietly, without a console line.

A temporary NPC behaves like a saved one: behaviors, modules, clicks, combat and events all apply. It disappears on restart and when the plugin that made it disables. File commands such as `/animus delete` refuse it with `<id> is a temporary NPC from <plugin>; it has no file`. A saved NPC that later takes its id or UUID ends it.

An NPC a plugin makes is a server NPC unless its `json` names an `owner`, the UUID of the player who owns it. An owned NPC, saved or temporary, is held to the same rules as one the player made: anything it would newly do that needs an `animus.owned.*` node its owner lacks answers `INVALID` with the reason, its behaviors check the owner's nodes again as they run, and a temporary one counts toward that player's limit. A plugin may put its own definition modules on an NPC a player owns freely: it answers for what its module does, and the `owner` in the definition that `npcs.definitions().find(npc)` returns lets it check the player itself. See [NPCs players own](/animus/02-commands-permissions#npcs-players-own).

`updateModule` hands the module's current data (a JSON object, or empty when the NPC has none) to a function on the file queue and saves what it returns, or removes the module for an empty answer. Two updates never lose each other, which suits counters. Keep the function quick. A change to a plugin's own module data leaves the NPC's body and its running behaviors alone, so a counter saved from a click hook does not stop the behavior the same click started.

### Skins

A skin comes from a `SkinSource`:

| Source | How Animus gets the textures |
|---|---|
| `SkinSource.player("Notch")` | Looked up on Mojang; `NOT_FOUND` when no account has the name, `UNAVAILABLE` when Mojang cannot be reached |
| `SkinSource.image(url)`, `new SkinSource.Image(url, true)` for slim arms | Signed through MineSkin with `[skins] mineskinKey`; `UNAVAILABLE` when signing fails |
| `SkinSource.texture(value, signature)` | Used as given; an empty signature saves it unsigned, and Animus signs it through MineSkin once a definition wears it |

Each skin is saved once as a skin file under `skins/`, which other NPCs and the web editor can then use. Skins need a `minecraft:player` body.

## Driving NPCs

These methods change only the live NPC, except `mount` and `dismount`. A restart, a reload or an edit of its definition shows the definition again. Unless the table says otherwise, the NPC must be active: an inactive one answers `UNAVAILABLE`, and a UUID no NPC has answers `NOT_FOUND`.

| Method | What it does | Notes |
|---|---|---|
| `teleport(npc, location)` | Moves the NPC onto clear ground and turns it to the location's facing | The destination must be loaded and clear, and the NPC must not ride, sit on a seat or carry anyone; otherwise `UNAVAILABLE`. On Folia a destination another region holds is checked by that region and the NPC is handed over to it, saved and temporary NPCs alike; a destination in another world answers `UNAVAILABLE` there |
| `navigate(npc, location, speed)` | Walks the NPC to a point in its own world | Speed is 1 to 5 blocks per second, or 0 for 2. Completes with where it arrived; `FAILED` when the way is blocked or no path is found, `CANCELLED` when `stop`, another route, a follow, a definition change or a despawn ends it |
| `follow(npc, entity, distance)` | Keeps the NPC walking after a player, mob or NPC, `distance` (1 to 16) blocks short | Runs until something ends it: `CANCELLED` for `stop`, `navigate` or another follow, `NOT_FOUND` once the target has been gone or out of reach for five seconds or the NPC was removed, `UNAVAILABLE` when the NPC stops being active. On Folia a mob is followed while it is in the NPC's region |
| `stop(npc)` | Stops the NPC's route, follow or patrol where it stands | |
| `lookAt(npc, location)`, `lookAt(npc, entity)` | Turns the NPC toward a point, player, mob or NPC in its world within 64 blocks | A target further away answers `INVALID`; an entity Animus cannot find (on Folia, outside the NPC's region) answers `NOT_FOUND` |
| `speak(npc, text, audience, speech)` | Says up to 1024 characters with `&` colour codes, in chat (`CHAT`), a speech bubble (`BUBBLE`) or both (`BOTH`) | `Audience.player(uuid)`, `Audience.within(radius)` (1 to 128 blocks) or `Audience.everyone()`. Players the NPC is hidden from hear nothing. The bubble shows the first 256 characters for five seconds to everyone who sees the NPC. Answers how many players got the chat line. On Bukkit, speech reaches the `hear` triggers of NPCs near it |
| `gesture(npc, gesture)` | Plays `SWING`, `SWING_OFFHAND`, `HURT`, `CRIT`, `MAGIC_CRIT`, `USE_ITEM` or `STOP_USING_ITEM` once | |
| `pose(npc, pose)` | Holds a body pose until the NPC moves | `INVALID` for a pose its body cannot take: every body stands, living bodies other than the ender dragon sit, and the other poses need a player body |
| `playAnimation(npc, name)` | Plays one animation of the NPC's [rig](/animus/06-rigs-animations) once | `UNAVAILABLE` without a rig, `INVALID` for an animation the rig does not have |
| `equip(npc, slot, item)` | Puts an item in a slot, or empties it with an empty item | `INVALID` for an item the server does not know or a slot the body has no use for |
| `skin(npc, source)` | Shows the live NPC in another skin | The definition keeps its own skin. A texture needs its signature here; an unsigned one answers `INVALID` |
| `mount(npc, vehicle)`, `dismount(npc)` | Puts the NPC on another NPC or a real entity, or takes it off | These change the definition's `animus:mount` module: saved for a persistent NPC, so it stays mounted after a restart while the vehicle exists. They work while the NPC is inactive. A real entity must be loaded, and on Folia in the NPC's region |
| `seat(npc, player)` | Seats an online player on the NPC, as clicking a seat does | Skips the seat's permission, empty-hand and sitting-toggle checks, and the seat does not end when the player lacks the permission. The checks that keep the player safe still apply: a dead, sleeping or riding player, a full seat, another world, or region entry denied. On Folia the player must be in the NPC's region |
| `unseat(player)` | Gets the player off any NPC they sit on or ride | `true` when they were seated or riding |
| `startBehavior(npc, behavior, player, variables)` | Starts one run of a behavior, as `/animus behaviors run` does | Expressions read each variable as `context.<name>`: at most 32 names of letters, digits and `_`, with text values up to 1024 characters. One manual run per NPC at a time; a second answers `BUSY`. Answers the run's UUID |
| `stopBehavior(run)` | Cancels a run | `true` when it was still going |
| `flag(flag)`, `setFlag(flag, json)` | Reads or writes a flag in behavior state | See [flags](#flags) |
| `show(npc, player, shown)` | Hides the NPC from one player, or shows it again | A hidden NPC is gone for that player alone: no body, speech, sounds, particles or triggers. It lasts until the plugin shows it, the player leaves or the plugin disables, and works while the NPC is inactive |
| `run(npc, work)` | Runs `work` on the thread that owns the NPC, where the blocks and entities around it may be used | Completes after it ran; `FAILED` when it threw |

### Flags

A `Flag` names one value in behavior state, the same values `animus:set-flag` and `animus:flag-state` use. Flags belong to a behavior namespace: the behaviors `town:greet` and `town:farewell` share the flags of namespace `town`, so a plugin that names `town` reads and writes what those behaviors see.

```java
Flag greeted = Flag.relationship("town", "greeted", npc, player.getUniqueId());
npcs.setFlag(greeted, Optional.of("true"));
npcs.flag(greeted).thenAccept(value -> ...);   // Optional.of("true"), or empty when unset or expired
```

`Flag.npc`, `Flag.player`, `Flag.relationship` and `Flag.global` pick the scope. Values are JSON (`true`, `3`, `"gold"`, lists and objects within the behavior value bounds); `null` is refused, and an empty value unsets the flag. Flags are saved as behaviors save them.

## Definition modules

A plugin or Java module can add its own module to NPC definitions. A module owns one key in a definition's `modules` object, keeps its data there as a JSON object, and gets hooks for the NPCs that carry the key.

```java
NpcModules.Descriptor clicks = new NpcModules.Descriptor(new Capabilities.Key("shop", "visits"), "Counts visits", 0);
npcs.modules().register(clicks, new NpcModules.Module() {
    @Override public List<Diagnostic> validate(String data) { return List.of(); }
    @Override public void clicked(NpcModules.Context npc, UUID player, boolean attack) {
        npcs.updateModule(npc.npc(), "shop:visits", data -> Optional.of("{\"count\":" + (count(data) + 1) + "}"));
    }
});
```

The descriptor names the key, a description and a tick interval (1 to 1200 ticks, or 0 for no tick hook). The namespaces `animus`, `minecraft`, `mythic`, `citizens`, `shopkeepers` and `denizen` are reserved, and one plugin or module holds each key: a second registration answers `CONFLICT`. A registration lasts until that plugin disables or that module stops.

Every hook is optional:

| Hook | When it runs | Thread |
|---|---|---|
| `validate(data)` | Before Animus saves a definition whose data for this key changed, from the service, commands or the web editor. An `ERROR` diagnostic refuses the save, with the field reported as `$.modules.<key>.<field>`; a validator that throws refuses it too | Any thread; keep it quick and free of side effects |
| `spawned(npc)` | The NPC became active: it spawned, loaded with its chunk or came back after dying | The NPC's thread |
| `clicked(npc, player, attack)` | A player clicked the NPC and no `VirtualNpcInteractionEvent` listener cancelled it, after the click's behavior trigger, whether or not a behavior used the click | The clicking player's thread |
| `ticked(npc)` | Every tick interval while the NPC is active | The NPC's thread |

Each hook gets an `NpcModules.Context`: the NPC, its id, whether it is temporary, and the module's data as it was when the hook was called. Hooks must not wait on a service result; start the work and return. A hook that throws is reported in the console once a minute and does not stop the others.

Changing only a plugin module's data leaves the live NPC as it is: it is not shown again, and its route, seats and runtime changes carry on. Data for a key no plugin has registered is kept unchanged, so it survives while its plugin is missing.

## Threads

Every service method may be called from any thread and returns at once; none waits for the answer. Work that touches an NPC runs on the thread that owns it: the main thread on Paper, Spigot and mod servers, the NPC's region on Folia. File work runs on the shared file queue.

Every stage the service returns completes on an Animus worker thread, never on a server thread, so a callback that runs then must not touch players, entities or blocks directly. Schedule that work where the target is owned (on Bukkit, the entity's, region's or main thread's scheduler), or use `run` for work beside the NPC. As with any `CompletionStage`, a non-async callback added after the stage completed runs at once on the thread that adds it. Never call `join()` or `get()` on a server thread: the work it waits for may need that thread.

## Results

Every answer is an `Outcome` with a status and diagnostics. Expected refusals are outcomes, never exceptions; a null argument is a programming error and throws `NullPointerException`.

| Status | Meaning |
|---|---|
| `OK` | Done; the value is present |
| `INVALID` | Bad input, with one diagnostic per problem naming its field |
| `NOT_FOUND` | No NPC, player, entity, account or behavior with that name or UUID |
| `CONFLICT` | An id is taken, or the definition changed since it was read |
| `UNAVAILABLE` | Not possible now: the NPC is not active, the plugin or module stopped, a feature is off or this platform lacks it |
| `BUSY` | Animus's queues are full; try again later |
| `CANCELLED` | Stopped before it finished, such as a walk replaced by another |
| `FAILED` | Something went wrong; the diagnostic says what |
| `TIMED_OUT` | A Java module call ran past its deadline |

## Bukkit events

Events live in `art.arcane.animus.bukkit.event`. `getNpcId()` is the NPC's UUID and `getNpcKey()` its id.

| Event | Fired when | Cancelling it |
|---|---|---|
| `VirtualNpcInteractionEvent` | A player clicks or hits an NPC, after reach and sight checks | Stops the click: no behavior trigger, module click hook, shop, GUI, ride or seat, and no damage from the player's hit |
| `VirtualNpcDamageEvent` | An NPC is about to damage a player or mob | Stops the hit; `setDamage` changes it |
| `VirtualNpcDamagedByMobEvent` | A mob controlled by `/animus combat mob` is about to damage an NPC | Stops the hit |
| `VirtualNpcDialogueChoiceEvent` | A player picks a dialogue choice, before the behavior hears it | Drops the answer, so the `dialogue_choice` trigger does not fire; the prompt is used up either way |
| `VirtualNpcSpawnEvent` | An NPC becomes active, or comes back after dying | Not cancellable |
| `VirtualNpcDespawnEvent` | An active NPC is despawned, deleted or replaced by another UUID | Not cancellable |
| `VirtualNpcDeathEvent` | An NPC's health reaches zero; carries the killer when known | Not cancellable |
| `VirtualNpcWaypointEvent` | An NPC reaches a route waypoint; carries the route, index and position | Not cancellable |
| `VirtualNpcProjectileHitEvent` | A real projectile flies into an NPC's hitbox; `isStopped()` when combat let it strike the body | Not cancellable |
| `VirtualNpcContactEvent` | A real entity starts to touch an NPC's hitbox, `TOP` standing on it or `SIDE` | Not cancellable |
| `VirtualNpcVehicleBumpEvent` | A moving minecart or boat runs into an NPC's hitbox | Not cancellable |
| `VirtualNpcItemDropEvent` | A player or mob drops an item within three blocks of an NPC, or throws it into its hitbox | Not cancellable |
| `VirtualNpcLeashEvent` | A player leading a mob right-clicks an NPC (`TIE`), or a mob on a lead is led within three blocks (`PASS`) | Not cancellable |

Events fire on the thread that owns the NPC: the main thread on Paper and Spigot, and the NPC's region on Folia. The interaction, dialogue choice and `TIE` lead events fire on the player's thread, and the projectile event on the projectile's. The projectile, contact, vehicle, item and lead events are what Animus [senses](/animus/07-behaviors#sensed-triggers) around an NPC, since the server reports nothing about a body that is only packets: each fires once per entity, and only while a player is near the NPC. While a plugin listens for the contact, vehicle, item or lead events, every NPC a player is near is looked at, within the `entity` budgets of `[behaviors.triggers]`. Spawn, despawn and death events are marked asynchronous if they ever fire off a server thread. No world entity stands behind an NPC, so read positions from the event, as an `NpcPosition` with `toLocation()`.

## Platforms

| Platform | What it offers |
|---|---|
| Paper and Spigot | Everything on this page |
| Folia | Everything, with region limits: `teleport` stays within the NPC's world (other regions are fine), `seat` needs the player in the NPC's region, and a followed mob is followed while it is in the NPC's region. Speech to a radius or everyone also reaches players other regions own, found by where their region last saw them |
| Fabric, Forge and NeoForge | The platform-neutral `NpcService` to Java modules through `context.npcs()`. There is no `AnimusNpcs` and no Bukkit events; Java modules get interaction notices and module hooks instead. Speech does not reach `hear` triggers, and `teleport` works in any loaded world |

## Installing a module

Put module jars directly in `plugins/Animus/modules/` (`config/animus/modules/` on [mod servers](/animus/16-mod-servers)) and restart the server. Modules load once per server start, in dependency order. Adding, removing or replacing a jar needs a restart; `/animus reload` and [live apply](/animus/03-configuration#live-apply) do not reload Java classes. A module jar is not a Bukkit plugin and has no `plugin.yml`.

Each jar contains an `animus-module.json` at its root. Animus does not generate it; write it yourself, or have your build write it:

```json
{
  "schemaVersion": 1,
  "id": "reference",
  "version": "1.0.0",
  "api": {"minimumMajor": 1, "maximumMajor": 1},
  "platforms": ["SPIGOT", "PAPER", "FOLIA"],
  "dependencies": [],
  "main": "example.animus.reference.ReferenceModule",
  "exports": []
}
```

`api` may also hold `minimumMinor`, the lowest minor of `minimumMajor` the module needs: `{"minimumMajor": 1, "maximumMajor": 1, "minimumMinor": 3}` refuses a 1.2 engine with `requires API 1.3 or newer within 1.x`. In Java the same range is `ApiRange.atLeast(new Version(1, 3, 0))`.

Its `id`, `version`, `api`, `platforms` and `dependencies` must match what `TrustedModule.manifest()` returns, or the module is refused before it enables. `main` names the module's entry class and `exports` the packages its dependents may see; they appear only in this file. Platforms are `SPIGOT`, `PAPER`, `FOLIA`, `FABRIC`, `FORGE` and `NEOFORGE`. The `animus` namespace is reserved for [built-in capabilities](/animus/07-behaviors), which stay available when `modules.enabled` is false.

A module's NPC service is `context.npcs()`. Its temporary NPCs and definition modules end when the module stops, and the service answers `UNAVAILABLE` while the module is suspended.

```java
@Override public void enable(ModuleContext context) {
    NpcService npcs = context.npcs();
    npcs.modules().register(new NpcModules.Descriptor(new Capabilities.Key("reference", "visits"), "Counts visits", 0), new NpcModules.Module() {
        @Override public void spawned(NpcModules.Context npc) { /* the NPC's thread */ }
    });
}
```

### Archive limits

Discovery accepts at most 64 archives and 4096 directory entries. Each jar may be at most 16 MiB compressed and 32 MiB expanded, with at most 8 MiB per entry, a 64 KiB manifest and 4096 entries. Across all jars, at most 128 MiB expanded and 16384 entries. Invalid archives count toward these limits.

Symlinked paths, duplicate entries, bundled Animus or API classes, nested jars, multi-release jars and external manifest class paths are refused. Metadata and dependencies are checked before any module code runs, and one refused module does not stop independent modules from loading.

### Class access and trust

A module sees the API, the JDK, its own classes and the packages its direct dependencies export. Animus internals, Bukkit, NMS and bundled libraries are not reachable through ordinary class loading. This keeps modules compatible across platforms; it is not a security sandbox. Modules run with full process privileges, so install only modules you trust.

Register resources acquired during enable with `ModuleContext.onClose` so they are released in reverse order, and keep callbacks nonblocking. Threads a module starts on its own are the module's responsibility.

## Settings

```toml
[files]
maximumOperations = 32
deliveryBudgetMillis = 250

[modules]
enabled = true
maximumInvocations = 64
invocationTimeoutMillis = 1000
deliveryBudgetMillis = 250
```

| Setting | Range | Meaning |
|---|---|---|
| `files.maximumOperations` | 1-128 | Admitted commands, imports, reads and API operations at once, including API results whose listeners are still running |
| `files.deliveryBudgetMillis` | 1-60000 | Result callbacks slower than this are reported |
| `modules.enabled` | Boolean | `false` stops new work going to Java modules; built-in actions keep working. `true` resumes them, loading them first if the server started with modules off |
| `modules.maximumInvocations` | 1-256 | Module calls running at once |
| `modules.invocationTimeoutMillis` | 1-60000 | A call past this deadline is asked to cancel and reported as a timeout. An action, condition, converter or notice past it suspends its module; [hooks](#integration-hooks) suspend only when they overrun repeatedly |
| `modules.deliveryBudgetMillis` | 1-60000 | Module callbacks slower than this are reported |

Delivery budgets only report slow callbacks; they do not interrupt Java code. When a module is suspended, capabilities that depend on it become unavailable until it resumes; `/animus modules resume <module>` resumes it at once. These settings apply live: a lower limit lets running work finish and answers new calls with `BUSY` until usage drops.

## Commands

```none
/animus modules status
/animus modules list [page=1]
/animus modules capabilities [page=1]
/animus modules action <capability> <npc> <input>
/animus modules condition <capability> <npc> <input>
/animus modules resume <module>
```

These require `animus.behaviors`, which `animus.admin` grants; every module command is listed under [commands](/animus/02-commands-permissions#java-modules). `action` and `condition` call a registered capability on an existing NPC with a JSON argument object, for example `/animus modules action reference:hello guard {}`. They grant no console-command privilege, so `animus:command` cannot be called from here. `status` lists loaded modules, their lifecycle phase, outstanding work, bound hooks and converters, dropped interaction notices and hook failures. `resume` brings a suspended module back now; `list` shows each module's state and why it is suspended.

## Capabilities

`context.registrations()` registers actions, conditions and triggers under the module's namespace. Each capability declares a JSON schema for its arguments. Schemas compile once at registration, and arguments are validated before the handler runs. Types, `enum` and `const`, basic numeric, size, object and array constraints, and combinators are supported. References, regex, `format` and other keywords fail registration. `/animus behaviors schema` includes the capabilities of every module loaded at that moment. See [behaviors](/animus/07-behaviors) for how JSON behaviors call them.

`Capabilities.Invocation.behavior()` names the JSON behavior making a call.

A module fires a trigger it registered with `context.triggers().publish(key, npc, player)`. The call is thread-safe and does not block:

| Result | Meaning |
|---|---|
| `OK(true)` | The event was queued |
| `OK(false)` | The NPC is dormant or has no bound triggers |
| `BUSY` | Dropped because the queue is full |
| `NOT_FOUND` | This module did not register that trigger |
| `UNAVAILABLE` | Dispatch cannot run, for example while triggers are turned off; the reason is included |

Trigger events carry no payload.

Handlers run on two bounded module workers with a deadline. A call holds its slot until the handler and its synchronous result listeners finish, including after a timeout. There is no per-module fairness or forced preemption.

## Definitions

`npcs().definitions()` reads and replaces whole definitions, saved and temporary, against a token. Snapshots are immutable and carry a revision and hash token; a temporary NPC's token is its in-memory revision and the hash of its JSON. A replacement is a full JSON document that keeps the UUID, readable id and folder, and names the revision it was based on. Animus validates it before writing, raises the revision and keeps unmodified unknown module settings. A stale token is a conflict.

A replacement may spawn an NPC or change a live one. Before it is written, Animus checks that the server can show it, as the web editor does when it spawns an NPC; a definition it could not show answers `INVALID` with the reason (code `activation-refused`), and nothing is saved. A dormant replacement, or one that changes only the revision or plugin module data, is written without that check.

`resolve(id)` finds the handle of the NPC with a readable id such as `guard`, for a module configured by id. `list(group, page)` pages through NPCs in id order, 100 per page, each with its handle, id, folder and whether it is spawned; pass `Optional.of("world/town")` for one folder or `Optional.empty()` for all. Both use the same file queue as reads.

Commands, imports and API edits share one file queue, so each validation and save completes before the next starts. API results are delivered on separate workers. Blocking both result workers uses up the shared admission budget and causes `BUSY` answers, but cannot stall a save in progress. A timeout or cancellation of a module action does not undo a definition edit that already saved; check the accepted revision when recovering from an interrupted action.

## API versions and compatibility

`AnimusApi.API_VERSION` is the contract version. The published artifact version follows it.

- A major version may remove or change contracts. A module declares the majors it supports in `ApiRange`, and the loader refuses it on any other major.
- A minor version normally stays binary compatible: a module built against 1.0 runs unchanged on every 1.x engine. The Animus build checks each API change against the last released tag, which is now `api-1.3.0`.
- A minor version can add types, and methods on interfaces the engine implements: `ModuleContext`, `DefinitionService`, `NpcService` and the registrars.
- Interfaces a module implements gain only `default` methods in a minor version. These are `TrustedModule`, `Capabilities.Action`, `Capabilities.Condition`, `InteractionNotice.Listener`, `ImportConverters.Converter`, `Integrations.Protection`, `Integrations.Economy` and `NpcModules.Module`.
- Enums can gain constants in a minor version, for example `Integrations.ProtectionAction`, `Outcome.Status`, `Platform` and `Capabilities.Kind`. Give every `switch` over them a `default` branch. An exhaustive switch without one throws when it meets a constant added later.
- A module that calls a newer addition declares that minor with `minimumMinor` (see [installing a module](#installing-a-module)), or checks `AnimusApi.API_VERSION.minor()` at enable time when it also supports older engines. The constant is read from the running engine.

1.3 broke the minor rule once: `ModuleContext.definitions()` became `ModuleContext.npcs().definitions()`. A module built against 1.2 or earlier that reads definitions needs a rebuild; one that does not still loads. Bukkit plugins built against the 1.2 `animus-bukkit-api` keep working, since `AnimusNpcs` only gained `service`.

Interaction notices, import converters and integration hooks require API 1.1. `BLOCK_USE`, `DefinitionService.resolve` and `list`, and `minimumMinor` require API 1.2. The NPC service, definition modules, edits that spawn NPCs and the cancellable dialogue choice event require API 1.3.

## Interaction notices

`context.onInteraction(listener)` subscribes during enable, at most 8 listeners per module. Each accepted NPC click becomes one immutable `InteractionNotice`: the NPC handle, player UUID, `ATTACK` or `INTERACT`, distance, a preview flag and a sequence number.

Notices are sent only after the platform's checks and any `VirtualNpcInteractionEvent` listeners accept the click. Listeners cannot cancel the click; on Bukkit, cancellation stays with that event. Notices run as module work on the same workers, slots and deadline as actions. A listener that throws fails only that notice, and a listener past the deadline suspends its module. When a module has no free slot, the notice is dropped and counted in `/animus modules status`. Notices can arrive out of order; use `sequence` to order them.

Paper, Spigot, Folia, Fabric, Forge and NeoForge all send notices. Notices with `preview=true` come only from the packet and Folia preview bodies, which have no definition. A [definition module's](#definition-modules) click hook is the synchronous counterpart: it runs on the player's thread for the NPCs that carry its key.

## Import converters

`context.imports().converter(descriptor, converter)` registers a converter under the module's namespace. A converter has an id (`namespace:name`), the source plugin's name, `detect` and `convert`. Both run on the module workers with the module deadline. They must not wait for a definition change to finish, because the import keeps other file work waiting until it returns. Raise `modules.invocationTimeoutMillis` for large files.

```none
/animus import preview <inbox-file> [converter=<namespace:name>]
```

A Citizens `.yml` saves file uses the built-in Citizens converter. For any other file, or with `converter=`, the named converter runs. Without `converter=`, the one converter whose `detect` recognizes the file runs; when none or several recognize it, the command lists the reasons.

The converter's records go into the same reviewed bundle under `imports/<import-id>/` as a Citizens import: `report.json`, per-record reports, and definitions named `<namespace>-<name>-<sourceId>`. `/animus import apply`, `import stage` with `reject`, `replace` or `duplicate`, and `import apply-plan` then work as they do for Citizens; see [migrating from Citizens](/animus/13-migrating-from-citizens). Animus sets the id, revision and migration provenance, keeps a valid `uuid` or derives a stable one from the converter and source id, and keeps the converter's `spawned` (`true` when the record leaves it out). Combat and patrols run as the converter wrote them. Records that fail validation are listed in `report.json` and block apply. Module imports cannot include skins.

## Integration hooks

`context.integrations()` registers extension points that Animus calls. One module may provide each point; a second provider fails to enable.

| Point | Called for | Combined with the platform |
|---|---|---|
| `protection` | NPC combat (`NPC_ATTACK`, `PLAYER_ATTACK`, `MOB_ATTACK`, `MOB_CONTROL`), NPC build block changes (`BLOCK_PLACE`, `BLOCK_BREAK`) and doors, fence gates and trapdoors an NPC opens on its route (`BLOCK_USE`) | Both must allow: WorldGuard on Bukkit, nothing on mod servers |
| `economy` | Shop, GUI and `animus:charge` money prices | Used only where the platform has no provider: always on mod servers, and on Bukkit without Vault |

Hooks run synchronously on the thread that needs the answer, so they must be quick, nonblocking and thread-safe. A throw or a null answer denies the action or refuses the payment. A provider whose module is suspended or stopped fails closed: protection denies and money prices are refused. Hooks take effect once modules finish enabling at startup.

`BLOCK_USE` arrived in API 1.2. A protection hook that throws or answers null on it, as an exhaustive switch built against 1.1 does, allows the door as servers before 1.2 did. The console says so once per module.

One slow hook call does not suspend its module, since a lag spike or a garbage collection pause can hold any call up. Each call past `modules.invocationTimeoutMillis` is logged, and the third within 60 seconds suspends the module. It resumes on its own after a cool-off of 30 seconds, which doubles with each further suspension up to 15 minutes and starts over after an hour without one. The console names the module and the cool-off, and `/animus modules list` shows it. Run `/animus modules resume <module>` to bring it back sooner.

## Shutdown

Shutdown stops new work at once. Queued file work is cancelled, and a save already in progress finishes first. Every plugin's and module's temporary NPCs, definition modules and follows end. Registrations are revoked and dependencies and resources are cleaned up in reverse order. `/animus modules status` shows `STOPPING` until cleanup and every tracked callback have returned.

## Missing modules

A missing or refused module never deletes its JSON settings or its behaviors' stored state, but that configuration does not run until the module is back. A [pack](/animus/07-behaviors) that needs a module names it in its `pack.json`. While that module is missing, the pack's behaviors are unavailable, and the manifest, including the module's `configuration`, is kept as written. A missing plugin's definition module data stays in each definition the same way.
