---
title: "Startup Safeguard"
description: "Iris documentation: Startup Safeguard"
published: true
date: 2026-09-11T01:50:21.000Z
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
| Memory | `Low Memory` | Warning | The JVM maximum heap is 2 GB or less. Iris asks for 3 GB or more. Between 2 GB and 3 GB the check stays Stable and prints `Memory Recommendation` as advice. The detail line reads `- JVM maximum heap: <n> MB`; it is not host RAM |
| Incompatibilities | `Dynmap` | Warning | Dynmap is installed. Iris recommends BlueMap instead. Matched against every registered plugin name without regard to case |
| Incompatibilities | `Stratos` | Warning | Another world generator is installed. Iris does not run alongside one. Matched against every registered plugin name without regard to case |
| Software | `Unsupported Server Software` | Warning | The server is not Canvas, Folia, Purpur, Pufferfish, Leaf, Paper, Spigot, or Bukkit. Iris runs but the platform is untested |
| Version | `Server Version` | Danger | The NMS binding for this Minecraft version could not be bound. The detail line carries the bind failure and the versions this jar supports |
| Version | `NMS Disabled` | Danger | `general.disableNMS` is `true`, so Iris holds a no-op binding and cannot create or initialize a world. See [03 - Configuration](/iris/03-configuration) |
| Injection | `Runtime Injection` | Stable | `general.eagerRuntimeInjection` is `false` (the default), so the agent and the code injection are installed the first time a world Iris generates is about to load. The detail line reads `- Deferred to the first world load. Set general.eagerRuntimeInjection to verify it during startup.` Nothing is verified at startup; a failed install then locks the runtime with the same reasons below |
| Injection | `Java Agent` | Danger | With `general.eagerRuntimeInjection` on: the bundled `agent.jar` could not be prepared, or attaching it to the running JVM failed |
| Injection | `Code Injection` | Danger | With `general.eagerRuntimeInjection` on: the agent attached but server code injection returned failure, or Iris has no usable NMS binding |
| Dimension Types | `Dimension Types` | Danger | The dimension types the installed packs need were not registered. Usually a missing restart after a pack or datapack change. The same heading also appears with `- Dimension types could not be checked because Iris has no NMS binding.` when the binding failed, and that variant locks with the NMS reason instead |
| Disk Space | `Insufficient Disk Space` | Warning | The level root has 3 GB or less free. Iris needs 3 GB to operate |
| Java | `Unsupported Java version` | Warning | The runtime is older than Java 25. Java 26 and newer stay Stable with a `Java Runtime` note that Iris is tested primarily on Java 25 |
| Java | `Java Runtime` | Warning | `java.version` could not be parsed at all |

A check that throws instead of returning a result prints `Error while running task <id>` with the exception, and the full stack trace is reported separately. Each check declares whether its own failure is advisory or critical: `memory`, `incompatibilities`, `software`, `diskSpace` and `java` are advisory and a throw is Warning; `version`, `injection` and `dimensionTypes` are critical and a throw is Danger.

## What Danger Mode blocks

Danger is the lock. Any check that reaches Danger marks the runtime invalid, and the first one to do so supplies the reason:

- **NMS binding unusable** (`Server Version`, `NMS Disabled`, injection skipped for want of a binding, the dimension-type check finding no binding, or the version check throwing). `Iris cannot use this server's NMS runtime. Resolve the Server Version or NMS Disabled error above and restart the server.`
- **Agent unavailable.** `Iris Java agent is unavailable. Add -javaagent:<path to plugins/Iris/agent.jar> to the JVM arguments before -jar and restart the server.`
- **Injection returned failure, or the injection check threw.** `Iris runtime injection failed. Resolve the startup errors and restart the server.`
- **Dimension types missing, or the dimension-type check threw.** `Iris dimension types were not registered. Restart the server so the registries reload.`

A critical check that throws and declares no reason of its own would fall back to `An Iris startup check failed. Resolve the startup errors and restart the server.` All three critical checks declare one, so that text is a backstop rather than something you should expect to see.

While the runtime is invalid:

- **Player login is refused.** Every login is disallowed with the lock reason plus `Check the server console, correct the reported Iris state, and restart.`
- **World creation is refused.** `/iris create` and world replacement staging fail with `Iris world creation is locked: <reason>`.
- **Studio open is refused.** `force=true` does not bypass a runtime failure.
- **Existing Iris worlds do not generate.** Each configured Iris world logs `Keeping configured Iris world '<world>' generation-locked: <reason>` and is bound to a non-generating refusal that throws `Iris generation for '<world>' remains locked: <reason>` on any generation call. The refusal is deliberate: it stops CraftBukkit substituting the vanilla generator and writing vanilla terrain into that world's region files.

A boot that enables into a locked runtime states it once more after the banner: `Iris enabled with a locked runtime: <reason>`, followed by `Every configured Iris world is generation-locked and refuses to generate terrain until this is resolved and the server restarts.` when the server has Iris world storage, or `This server has no Iris world storage, so nothing is generation-locked; world creation and player login stay refused until this is resolved.` when it does not. Iris does not stop the server in that case; the non-generating refusal already prevents vanilla terrain.

With the default deferred injection there is no `Java Agent` or `Code Injection` heading in the banner block, because nothing was attempted yet. The install runs when the first Iris world loads, and a failure there logs `Iris runtime injection is unavailable: <reason>` at error level and locks the runtime with the same reason from that moment on. The banner is already printed by then, so a boot that looked Stable can still end up locked — the deferred line, not the banner, is what tells you.

`general.disableNMS` and a missing dimension type are Danger and therefore lock, exactly like an injection failure.

Warning Mode gates nothing.

The same lock is shared with external datapack and dimension-pack validation, so a login kick or a locked world can also come from those. See [01 - Installation & Platforms](/iris/01-installation-platforms) for the datapack and pack cases.

## Diagnose

1. Read the banner. It tells you the mode and how many checks are involved.
2. Read the check output printed immediately above it, matching the headings in the table above.
3. Look for `Injecting Bukkit`. It is logged when code injection begins, so a `Java Agent` heading means Iris never got that far, and a `Code Injection` heading after it means injection itself failed.
4. `Installing Java Agent...` appears only when Iris has to attach the agent dynamically. A server already started with `-javaagent` skips that step and logs nothing for it.
5. `[Attach Listener/ERROR]` and `[STDERR]` lines around the dynamic attach come from the JVM, not from Iris. Iris logs a note saying so.
6. Run `/iris debug dump` for a report to attach to a support request. It uploads to mclo.gs by default; `/iris debug dump upload=false` writes it to `plugins/Iris/debug/` only. It requires `iris.debugdump`, which is checked independently of `iris.all`. Alongside the general plugin and server state, the report carries the safeguard results: a `Startup safeguard: <mode> (<n> issues)` line, then one `<check id>: <mode>` line per check in run order, each followed by that check's diagnostic lines. The check ids are `memory`, `incompatibilities`, `software`, `version`, `injection`, `dimensionTypes`, `diskSpace`, and `java`.

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
