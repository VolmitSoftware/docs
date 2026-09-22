---
title: "Startup Safeguard"
description: "Iris documentation: Startup Safeguard"
published: true
date: 2026-09-21T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-09-08T00:00:00.000Z
---
Iris reports a startup mode on Bukkit-family servers. Check the console for any required configuration change or restart before opening worlds. Fabric, Forge and NeoForge do not use this safeguard.

## Modes

| Mode | Console banner | Effect |
|------|----------------|--------|
| Stable | `Iris is running Stable` | Startup checks passed |
| Warning | `Iris is running in Warning Mode` | Startup continues; review the listed issues |
| Danger | `Iris is running in Danger Mode` | Iris locks world operations until the reported problem is corrected and the server restarts |

Warning Mode does not block commands or generation. A Stable startup does not guarantee that later world loading will succeed; follow any subsequent error or restart prompt.

## The checks

| Console heading | Required action |
|-----------------|-----------------|
| `Server Version` | Use a Minecraft and server version supported by your Iris build. See [01 - Installation & Platforms](/iris/01-installation-platforms) |
| `NMS Disabled` | Set `general.disableNMS` to `false` in `iris.json`, then restart |
| `Java Agent` | Follow the agent setup in [01 - Installation & Platforms](/iris/01-installation-platforms). When instructed, add `-javaagent:plugins/Iris/agent.jar` before `-jar` in the startup command |
| `Code Injection` | Check that your Iris build supports the server version and resolve the reported startup error before restarting |
| `Dimension Types` | Restart after installing or changing the pack's required datapack content |
| `Unsupported Java version` or `Java Runtime` | Use Java 25; see the installation requirements |
| `Low Memory` or `Memory Recommendation` | Review the server requirements in [01 - Installation & Platforms](/iris/01-installation-platforms) |
| `Insufficient Disk Space` | Free space on the drive containing the world save |
| `Dynmap` | Review the compatibility warning; Iris recommends BlueMap |
| `Stratos` | Remove the conflicting world generator |
| `Unsupported Server Software` | Use a supported server listed in the installation guide |

`general.eagerRuntimeInjection=true` checks native server integration during startup. With the default `false`, Iris prepares it when the first Iris world loads. Changing this setting requires a restart; see [03 - Configuration](/iris/03-configuration).

## What Danger Mode blocks

While Iris reports a locked runtime:

- Player login is refused with the lock reason.
- World creation and replacement are refused.
- Studio opening is refused, including `force=true`.
- Existing Iris worlds cannot generate new terrain.

Iris leaves the server running so you can read the errors and correct its configuration. Datapack validation can also lock world loading. Follow the reason shown in the console, then perform a full server restart. `/iris reload` does not clear the lock or rerun startup checks.

## View status and save a report

Read the startup banner and the issues printed above it. To save a local support report, run:

```text
/iris debug dump upload=false
```

The report is written under `plugins/Iris/debug/`. Omitting `upload=false` uploads the report to mclo.gs. This command requires `iris.debugdump`, checked separately from `iris.all`. See [04 - Commands & Permissions](/iris/04-commands-permissions).

## Applying changes

Stop the server, apply the configuration or startup-command changes requested by the error, then start it again. If a pack change requires new dimension types, complete that restart before retrying world creation or Studio.

Do not delete dimension files to bypass a lock. Keep world backups before changing server versions or replacing world content.

## Related

- [01 - Installation & Platforms](/iris/01-installation-platforms)
- [03 - Configuration](/iris/03-configuration)
- [04 - Commands & Permissions](/iris/04-commands-permissions)
- [30 - Platform Differences](/iris/30-platform-differences)
