---
title: "Husk - Running the example"
description: "Install the example artifact, inspect startup, and configure its status command"
published: true
date: 2026-10-15T03:00:00.000Z
tags: "husk, commands, configuration"
editor: markdown
dateCreated: 2026-10-15T03:00:00.000Z
---

Install the CraftBukkit jar in a supported Spigot, Paper, or Folia server's `plugins` directory, or install the matching loader/Minecraft jar in `mods`. Use Java 25. Fabric's three required API modules and the used VolmLib libraries are included in the artifact.

## Startup and commands

Successful startup prints the Volmit-style splash with the project identity and runtime details. The command is available to players and console without an additional permission:

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
