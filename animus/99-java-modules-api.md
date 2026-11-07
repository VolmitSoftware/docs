---
title: "Animus: Java Modules and API"
description: "Trusted Java modules, the animus-api contract, interaction notices, import converters and integration hooks"
published: true
date: 2026-11-05T00:00:00.000Z
tags: "animus, api, modules, developers, integration"
editor: markdown
dateCreated: 2026-11-05T00:00:00.000Z
---

Trusted Java modules add actions, conditions, triggers, import converters and integration hooks to Animus. A module compiles against the standalone `animus-api` artifact (Java 25, no other dependencies) and loads from the Animus data folder at startup. The public package is `art.arcane.animus.api`. The current API version is 1.1.0.

The [reference module](https://github.com/VolmitSoftware/Animus/tree/master/examples/modules/reference) is a complete example: it registers a `reference:hello` action, counts interactions, and provides a protection hook.

## Depending on the API

Through JitPack:

```groovy
repositories {
    maven { url = 'https://jitpack.io' }
}
dependencies {
    compileOnly 'com.github.VolmitSoftware.Animus:animus-api:<tag or commit>'
}
```

To build the API locally instead, run this in an Animus checkout with Java 25:

```sh
./gradlew :animus-api:publishToMavenLocal
```

This writes `art.arcane.animus:animus-api:<version>` to `~/.m2/repository`, with sources and JavaDoc jars. Add `mavenLocal()` to the module build and depend on it with `compileOnly`.

Compile against only the API and the JDK, and leave the API classes out of the module jar.

## Installing a module

Put module jars directly in `plugins/Animus/modules/` (`config/animus/modules/` on [mod servers](/animus/16-mod-servers)) and restart the server. Modules load once per server start, in dependency order. Adding, removing or replacing a jar needs a restart; `/animus reload` and [live apply](/animus/03-configuration#live-apply) do not reload Java classes. A module jar is not a Bukkit plugin and has no `plugin.yml`.

Each jar contains a generated `animus-module.json`:

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

It must match `TrustedModule.manifest()` exactly, or the module is refused before it enables. Platforms are `SPIGOT`, `PAPER`, `FOLIA`, `FABRIC`, `FORGE` and `NEOFORGE`. The `animus` namespace is reserved for [built-in capabilities](/animus/07-behaviors), which stay available when `modules.enabled` is false.

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
| `modules.invocationTimeoutMillis` | 1-60000 | A call past this deadline is asked to cancel, reported as a timeout, and its module is suspended |
| `modules.deliveryBudgetMillis` | 1-60000 | Module callbacks slower than this are reported |

Delivery budgets only report slow callbacks; they do not interrupt Java code. When a module is suspended, capabilities that depend on it become unavailable. These settings apply live: a lower limit lets running work finish and answers new calls with `BUSY` until usage drops.

## Commands

```none
/animus modules list [page=1]
/animus modules action <capability> <npc> <input>
/animus modules condition <capability> <npc> <input>
```

These require `animus.admin`; every module command is listed under [commands](/animus/02-commands-permissions#java-modules). `action` and `condition` call a registered capability on an existing NPC with a JSON argument object, for example `/animus modules action reference:hello guard {}`. They grant no console-command privilege, so `animus:command` cannot be called from here. `status` lists loaded modules, their lifecycle phase, outstanding work, bound hooks and converters, dropped interaction notices and hook failures.

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
| `UNAVAILABLE` | Dispatch cannot run here, such as on Folia; the reason is included |

Trigger events carry no payload.

Handlers run on two bounded module workers with a deadline. A call holds its slot until the handler and its synchronous result listeners finish, including after a timeout. There is no per-module fairness or forced preemption.

## Definitions

`DefinitionService` reads and replaces NPC definitions asynchronously. Snapshots are immutable and carry a revision and hash token. A replacement is a full JSON document that keeps the UUID, readable id and folder, and names the revision it was based on. Animus validates it before writing, raises the revision and keeps unmodified unknown module settings. A stale token is a conflict. The API cannot spawn NPCs: replacement definitions must be dormant, and spawning goes through `/animus spawn`.

Commands, imports and API edits share one file queue, so each validation and save completes before the next starts. API results are delivered on separate workers. Blocking both result workers uses up the shared admission budget and causes `BUSY` answers, but cannot stall a save in progress. A timeout or cancellation of a module action does not undo a definition edit that already saved; check the accepted revision when recovering from an interrupted action.

## API versions and compatibility

`AnimusApi.API_VERSION` is the contract version. The published artifact version follows it.

- A major version may remove or change contracts. A module declares the majors it supports in `ApiRange`, and the loader refuses it on any other major.
- A minor version only adds types and methods that the engine implements, such as new `ModuleContext` methods. A module built against 1.0 runs unchanged on every 1.x engine.
- A module that calls a 1.1 addition and also declares support for older 1.x engines must check `AnimusApi.API_VERSION.minor()` at enable time. The constant is read from the running engine.
- Modules never implement `ModuleContext`, `DefinitionService` or the registrars, so the engine can add methods to them in a minor version.

Interaction notices, import converters and integration hooks require API 1.1.

## Interaction notices

`context.onInteraction(listener)` subscribes during enable, at most 8 listeners per module. Each accepted NPC click becomes one immutable `InteractionNotice`: the NPC handle, player UUID, `ATTACK` or `INTERACT`, distance, a preview flag and a sequence number.

Notices are sent only after the platform's checks and any `VirtualNpcInteractionEvent` listeners accept the click. Listeners cannot cancel the click; on Bukkit, cancellation stays with that event. Notices run as module work on the same workers, slots and deadline as actions. A listener that throws fails only that notice, and a listener past the deadline suspends its module. When a module has no free slot, the notice is dropped and counted in `/animus modules status`. Notices can arrive out of order; use `sequence` to order them.

Paper, Spigot, Folia, Fabric, Forge and NeoForge all send notices. Notices with `preview=true` come only from the packet and Folia preview bodies, which have no definition.

## Import converters

`context.imports().converter(descriptor, converter)` registers a converter under the module's namespace. A converter has an id (`namespace:name`), the source plugin's name, `detect` and `convert`. Both run on the module workers with the module deadline. They must not wait for a definition change to finish, because the import keeps other file work waiting until it returns. Raise `modules.invocationTimeoutMillis` for large files.

```none
/animus import preview <inbox-file> [converter=<namespace:name>]
```

A Citizens `.yml` saves file uses the built-in Citizens converter. For any other file, or with `converter=`, the named converter runs. Without `converter=`, the one converter whose `detect` recognizes the file runs; when none or several recognize it, the command lists the reasons.

The converter's records go into the same reviewed bundle under `imports/<import-id>/` as a Citizens import: `report.json`, per-record reports, and dormant definitions named `<namespace>-<name>-<sourceId>`. `/animus import apply`, `import stage` with `reject`, `replace` or `duplicate`, and `import apply-plan` then work as they do for Citizens; see [migrating from Citizens](/animus/13-migrating-from-citizens). Animus sets the id, revision, `spawned=false` and migration provenance, keeps a valid `uuid` or derives a stable one from the converter and source id, and disables imported combat and patrols until they are reviewed. Records that fail validation are listed in `report.json` and block apply. Module imports cannot include skins.

## Integration hooks

`context.integrations()` registers extension points that Animus calls. One module may provide each point; a second provider fails to enable.

| Point | Called for | Combined with the platform |
|---|---|---|
| `protection` | NPC combat (`NPC_ATTACK`, `PLAYER_ATTACK`, `MOB_ATTACK`, `MOB_CONTROL`), NPC build block changes (`BLOCK_PLACE`, `BLOCK_BREAK`) and doors, fence gates and trapdoors an NPC opens on its route (`BLOCK_USE`) | Both must allow: WorldGuard on Bukkit, nothing on mod servers |
| `economy` | Shop and GUI money prices | Used only where the platform has no provider: always on mod servers, and on Bukkit without Vault |

Hooks run synchronously on the thread that needs the answer, so they must be quick, nonblocking and thread-safe. A throw or a null answer denies the action or refuses the payment. A call past the module deadline suspends the module. A provider whose module is suspended or stopped fails closed: protection denies and money prices are refused. Hooks take effect once modules finish enabling at startup.

## Shutdown

Shutdown stops new work at once. Queued file work is cancelled, and a save already in progress finishes first. Registrations are revoked and dependencies and resources are cleaned up in reverse order. `/animus modules status` shows `STOPPING` until cleanup and every tracked callback have returned.

## Missing modules

A missing or refused module never deletes its JSON settings or its behaviors' stored state, but that configuration does not run until the module is back. A [pack](/animus/07-behaviors) that needs a module names it in its `pack.json`. While that module is missing, the pack's behaviors are unavailable, and the manifest, including the module's `configuration`, is kept as written.
