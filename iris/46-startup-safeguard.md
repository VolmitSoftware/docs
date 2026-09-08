---
title: "Startup Safeguard"
description: "Iris documentation: Startup Safeguard"
published: true
date: 2026-09-08T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-08T00:00:00.000Z
---
On Bukkit-family servers Iris runs a fixed list of startup checks while it enables, then prints a mode banner summarizing them. The mode is Stable, Warning, or Danger. It also tints the `[Iris]` log prefix and the startup splash, so the console color is a symptom, not the diagnosis — read the banner and the check output above it.

The safeguard is Bukkit-only. Fabric, Forge, and NeoForge run no startup checks and have no mode.

## Modes

| Mode | Banner | Meaning |
|---|---|---|
| Stable | `0 Conflicts found` then `Iris is running Stable` | Every check passed. |
| Warning | `<n> Issues found` then `Iris is running in Warning Mode` | At least one check reported a non-fatal problem. Iris continues startup normally with reduced guarantees. |
| Danger | `<n> Issues found` then `Iris is running in Danger Mode` | At least one check failed at error severity. |

The Warning banner is followed by `Some startup checks need attention. Review the messages above for tuning suggestions.` and `Iris will continue startup normally.` The Danger banner is followed by `Critical startup checks failed. Review and resolve the errors above as soon as possible.`

`<n>` counts checks that did not return Stable, not the number of printed lines. A check that prints informational advice while still returning Stable is not counted.

The mode is the highest severity any single check reached. One Danger result puts the whole boot in Danger Mode even when everything else passed.

## The checks

Checks run in this order. Each one prints a heading line and indented detail lines; the headings below are the exact strings to search the console or `logs/latest.log` for.

| Check | Console heading | Mode | What the failure means |
|---|---|---|---|
| Memory | `Low Memory` | Warning | Process memory is 2 GB or less. Iris asks for 3 GB or more. Between 2 GB and 3 GB the check stays Stable and prints `Memory Recommendation` as advice. Measured from the JVM maximum heap, not host RAM |
| Incompatibilities | `Dynmap` | Warning | Dynmap is installed. Iris recommends BlueMap instead |
| Incompatibilities | `Stratos` | Warning | Another world generator is installed. Iris does not run alongside one |
| Software | `Unsupported Server Software` | Warning | The server is not Canvas, Folia, Purpur, Pufferfish, Leaf, Paper, Spigot, or Bukkit. Iris runs but the platform is untested |
| Version | `Server Version` | Danger | The NMS binding for this Minecraft version could not be bound. The detail line carries the bind failure and the versions this jar supports |
| Version | `NMS Disabled` | Danger | `general.disableNMS` is `true`, so Iris holds a no-op binding and cannot create or initialize a world. See [03 - Configuration](/iris/03-configuration) |
| Injection | `Java Agent` | Danger | The bundled `agent.jar` could not be prepared, or attaching it to the running JVM failed. This marks the runtime invalid |
| Injection | `Code Injection` | Danger | The agent attached but server code injection returned failure. This marks the runtime invalid |
| Dimension Types | `Dimension Types` | Danger | The dimension types the installed packs need were not registered. Usually a missing restart after a pack or datapack change |
| Disk Space | `Insufficient Disk Space` | Warning | The level root has 3 GB or less free. Iris needs 3 GB to operate |
| Java | `Unsupported Java version` | Warning | The runtime is older than Java 25. Java 26 and newer stay Stable with a `Java Runtime` note that Iris is tested primarily on Java 25 |
| Java | `Java Runtime` | Warning | `java.version` could not be parsed at all |

A check that throws instead of returning a result prints `Error while running task <id>` with the exception, and the full stack trace is reported separately. That is Warning severity for every check except `injection`, which is Danger and marks the runtime invalid.

## What Danger Mode blocks

Danger Mode by itself is a severity label. What actually locks Iris down is the runtime-invalid state, and only the `injection` check sets it:

- **Agent unavailable.** The lock reason is `Iris Java agent is unavailable. Add -javaagent:<path to plugins/Iris/agent.jar> to the JVM arguments before -jar and restart the server.`
- **Injection returned failure, or the check threw.** The lock reason is `Iris runtime injection failed. Resolve the startup errors and restart the server.`

While the runtime is invalid:

- **Player login is refused.** Every login is disallowed with the lock reason plus `Check the server console, correct the reported Iris state, and restart.`
- **World creation is refused.** `/iris create` and world replacement staging fail with `Iris world creation is locked: <reason>`.
- **Studio open is refused.** `force=true` does not bypass a runtime failure.
- **Existing Iris worlds do not generate.** Each configured Iris world logs `Keeping configured Iris world '<world>' generation-locked: <reason>` and is bound to a non-generating refusal that throws `Iris generation for '<world>' remains locked: <reason>` on any generation call. The refusal is deliberate: it stops CraftBukkit substituting the vanilla generator and writing vanilla terrain into that world's region files. A server whose startup worlds include an Iris world therefore fails at level load instead of booting with corrupted terrain.

A Danger result from `version` or `dimensionTypes` does not set the runtime lock. Those failures still stop world creation on their own path — a no-op NMS binding refuses to initialize a world, and missing dimension types fail dimension compilation — but login and existing worlds are not gated by them.

Warning Mode gates nothing. Startup continues and worlds generate; the check output is the record of what is degraded.

The same lock is shared with external datapack and dimension-pack validation, so a login kick or a locked world can also come from those. See [01 - Installation & Platforms](/iris/01-installation-platforms) for the datapack and pack cases.

## Diagnose

1. Read the banner. It tells you the mode and how many checks are involved.
2. Read the check output printed immediately above it, matching the headings in the table above.
3. Look for `Injecting Bukkit`. It is logged when code injection begins, so a `Java Agent` heading means Iris never got that far, and a `Code Injection` heading after it means injection itself failed.
4. `Installing Java Agent...` appears only when Iris has to attach the agent dynamically. A server already started with `-javaagent` skips that step and logs nothing for it.
5. `[Attach Listener/ERROR]` and `[STDERR]` lines around the dynamic attach come from the JVM, not from Iris. Iris logs a note saying so.
6. Run `/iris debugdump` for a report to attach to a support request. It uploads to mclo.gs by default; `/iris debugdump upload=false` writes it to `plugins/Iris/debug/` only. It requires `iris.debugdump`, which is checked independently of `iris.all`. The report captures general plugin and server state, not the safeguard check results — for those, quote the console lines.

The banner is printed once per enable. It is not re-evaluated on `/iris reload`, and there is no command that re-prints it; restart the server to re-run the checks.

## Recover

- **Java Agent.** Stop the server, confirm `plugins/Iris/agent.jar` exists, and add `-javaagent:plugins/Iris/agent.jar` before `-jar` in the startup command. Dynamic attachment also needs `-XX:+EnableDynamicAgentLoading` and a host that permits JVM attachment; loading the agent at JVM startup avoids the attachment step entirely. Full procedure in [01 - Installation & Platforms](/iris/01-installation-platforms).
- **Code Injection.** Keep the complete startup stack trace and check the Iris and server version combination before retrying.
- **Server Version.** Use a Minecraft version this Iris build binds. The detail line names the supported range.
- **NMS Disabled.** Set `general.disableNMS` to `false` and restart. It is a diagnostic escape hatch, not a compatibility switch.
- **Dimension Types.** Restart once so the registries reload. If it survives a clean restart, treat it as a defect and collect the console output.
- **Low Memory, Insufficient Disk Space, Unsupported Java version.** Fix the host: raise the heap, free space on the level root volume, or move to Java 25.
- **Dynmap, Stratos, Unsupported Server Software.** Remove the conflicting plugin or move to a supported server, or accept that Iris runs unverified against it.

Never work around a lock by deleting files from a dimension root. Restore from backup instead; see [31 - Operator Runbooks](/iris/31-operator-runbooks).

## Related

- [01 - Installation & Platforms](/iris/01-installation-platforms)
- [03 - Configuration](/iris/03-configuration)
- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [30 - Platform Differences](/iris/30-platform-differences)
- [31 - Operator Runbooks](/iris/31-operator-runbooks)
