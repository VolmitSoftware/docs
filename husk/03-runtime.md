---
title: "Husk - Running the example"
description: "Install the example artifact, inspect startup, and configure its status command"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "husk, commands, configuration"
editor: markdown
dateCreated: 2026-10-15T03:00:00.000Z
---

Install the CraftBukkit jar in a supported Spigot, Paper, or Folia server's `plugins` directory, or install the matching loader/Minecraft jar in `mods`. Use Java 17 for Minecraft 1.20.1, Java 21 for 1.21.1, and Java 25 for 26.x. NeoForge 1.20.1 uses the Forge 1.20.1 jar; NeoForge 1.21.1 has its own jar. Fabric's three required API modules and the used VolmLib libraries are included in the artifact.

## Startup and commands

Successful startup prints the Volmit-style splash with the project identity, exact supported Minecraft releases, and runtime details. The command is available to players and console without an additional permission:

```text
/husk
/husk status
```

Both forms report the project version, platform, Minecraft version, and configured message. Changing `projectId` before building changes the command name. The example registers server behavior and can run in dedicated or integrated mod servers; it does not require client rendering hooks or custom packets.

## Configuration

The first startup writes `config.json` in the plugin data folder on Bukkit or `config/husk/` on mod loaders:

```json
{
  "statusMessage": "Hello from Husk"
}
```

`statusMessage` must be a nonblank JSON string. Edit the file while the server is stopped and restart to load the new value. Commands use the startup snapshot without reading the file on each request.

An invalid configuration prevents the runtime from starting and preserves the file. Startup errors include their cause in the server log. The runtime closes during plugin disable or server stop and creates a fresh runtime when an integrated server starts again.

## Uninstalling

The example stores only `config.json`. It writes nothing to worlds, entities, or player data.

1. Stop the server.
2. Delete the jar: `Husk v<version> [CraftBukkit] 1.20.1-26.3.jar` from `plugins/`, or the loader jar, such as `Husk v<version> [Fabric] 26.3+0.19.5.jar`, from `mods/`.
3. Delete `plugins/Husk/` on Spigot, Paper, or Folia, or `config/husk/` on Fabric, Forge, or NeoForge.
4. If a client has the mod jar for single-player, remove it from that client's `mods/` folder and delete `config/husk/` in the same game directory.

A project built from the template uses its own names: the jar and Bukkit data folder follow `projectName`, and the mod configuration folder follows `projectId`. To start fresh, complete these steps and install the jar again; the first start writes a new `config.json`.
