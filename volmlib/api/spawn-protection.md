---
title: "Native spawn-protection checks"
description: "Query the server's spawn-protection decision across Bukkit implementation boundaries"
published: true
date: 2026-09-20T04:21:21.395Z
tags: "volmlib, api, bukkit, protection, compatibility"
editor: markdown
dateCreated: 2026-09-05T14:10:53.000Z
---

`art.arcane.volmlib.nativelib.protection.SpawnProtection` queries the server's native spawn-protection decision. It binds CraftBukkit accessors and the native protection method once, then uses cached method handles. Delegating the decision preserves the server version's dimension rules, operator handling, and configured radius.

## Dependency

Bundle `native-api`, `native-common`, and the version modules your plugin supports. Use the same VolmLib release for each module. See [Native server access](/volmlib/api/native-access) for dependency coordinates, shading, and capability selection.

## Use

Create one instance for the consuming plugin or service:

```java
SpawnProtectionAccess access = NativeAdapters.require(SpawnProtectionAccess.class);
SpawnProtection protection = access.create(server);
```

On the thread owning both the player and target block, query the decision before changing a block:

```java
SpawnProtection.Decision decision = protection.check(player, block);
```

| Result | Meaning |
| --- | --- |
| `ALLOWED` | Native spawn protection permits this block change, or a verified public bypass applies. |
| `PROTECTED` | The native server rejects this target for this player. |
| `UNSUPPORTED` | A native decision is unavailable and no verified public bypass applies. |

This checks native spawn protection only. Consumers must still apply their own policy, protection events, region ownership, chunk checks, and inventory conservation. Recheck before mutation when callbacks can change relevant state. The utility neither schedules work nor loads chunks.

## Capability and failure handling

`NativeAdapters.find(SpawnProtectionAccess.class)` checks whether a version provider is available. On a created instance, `supported()` reports whether the native binding remains available. Always use `check(...)` for the actual permission decision: a disabled spawn radius, operator player, or empty operator list still permits the verified bypass when binding is unavailable.

Missing accessors, incompatible signatures, and native invocation failures mark that instance unavailable and log one contextual failure with the full cause through the server logger. Consumers should pause affected block changes on `UNSUPPORTED` and expose that state to operators. They may keep unrelated features available.

The binding recognizes mapped and Spigot-shaped native types and validates exact public method signatures. It does not assume that every server fork exposes those bindings.

See [VolmLib API](/volmlib/api) for dependency, shading, and threading conventions.
