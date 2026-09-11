---
title: "Native spawn-protection checks"
description: "Query the server's spawn-protection decision across Bukkit implementation boundaries"
published: true
date: 2026-09-05T14:21:00.000Z
tags: "volmlib, api, bukkit, protection, compatibility"
editor: markdown
dateCreated: 2026-09-05T14:10:53.000Z
---

`art.arcane.volmlib.util.bukkit.BukkitSpawnProtection` in the optional `native-bukkit` module queries the server's native spawn-protection decision. It binds CraftBukkit accessors and the native protection method once, then uses cached method handles. Delegating the decision preserves the server version's dimension rules, operator handling, and configured radius.

## Dependency

This utility is separate from `shared`, so plugins using only the shared module do not package its native-server references. Add `com.github.VolmitSoftware.VolmLib:native-bukkit` with the same version as the shared dependency, or substitute that coordinate with `project(':native-bukkit')` in a local VolmLib composite build. Shade and relocate it alongside the shared module when needed. Bukkit itself remains a server-provided dependency.

## Use

Create one instance for the consuming plugin or service:

```java
BukkitSpawnProtection protection = BukkitSpawnProtection.create(server);
```

On the thread owning both the player and target block, query the decision before changing a block:

```java
BukkitSpawnProtection.Decision decision = protection.check(player, block);
```

| Result | Meaning |
| --- | --- |
| `ALLOWED` | Native spawn protection permits this block change, or a verified public bypass applies. |
| `PROTECTED` | The native server rejects this target for this player. |
| `UNSUPPORTED` | A native decision is unavailable and no verified public bypass applies. |

This checks native spawn protection only. Consumers must still apply their own policy, protection events, region ownership, chunk checks, and inventory conservation. Recheck before mutation when callbacks can change relevant state. The utility neither schedules work nor loads chunks.

## Capability and failure handling

`supported()` reports whether the native binding remains available. Always use `check(...)` for the actual permission decision: a disabled spawn radius, operator player, or empty operator list still permits the verified bypass when binding is unavailable.

Missing accessors, incompatible signatures, and native invocation failures mark that instance unavailable and log one contextual failure with the full cause through the server logger. Consumers should pause affected block changes on `UNSUPPORTED` and expose that state to operators. They may keep unrelated features available.

The binding recognizes mapped and Spigot-shaped native types and validates exact public method signatures. It does not assume that every server fork exposes those bindings. Fixture tests prove binding and failure behavior; server runtime verification remains necessary for a consuming plugin.

See [VolmLib API](/volmlib/api) for dependency, shading, and threading conventions.
