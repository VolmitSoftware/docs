---
title: "Shaped Portals — Installation & Configuration"
description: "Install Shaped Portals 1.0 and configure its complete JSON settings"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "shapedportals, installation, configuration, legacy"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Version 1.0 declares Bukkit API 1.17. Its published resource page lists Minecraft
1.17 through 1.19 as tested. Treat later server versions as unverified.

## Install

1. Stop the server and make a backup.
2. Obtain a trusted 1.0 jar from the
   [published resource](https://www.spigotmc.org/resources/shaped-portals.95595/)
   or build the audited source.
3. Put the jar in `plugins/`.
4. Start the server once. The plugin creates
   `plugins/ShapedPortals/config.json` during initialization.
5. Stop the server, review the generated settings, and start normally.
6. Test vanilla and custom frames inside and outside every protected region.

Do not use a plugin hot-loader or `/reload`.

## Configuration

The complete default file is:

```json
{
  "creationSounds": true,
  "enablePortals": true,
  "allowCryingObsidian": true,
  "maxNetherPortalBlocks": 32
}
```

| Key | Default | Meaning |
|---|---:|---|
| `creationSounds` | `true` | Plays a low-pitched End-portal-spawn sound for portal creation events with blocks |
| `enablePortals` | `true` | Enables the plugin's fallback shaped-Nether-portal creation |
| `allowCryingObsidian` | `true` | Lets crying obsidian act as valid frame material |
| `maxNetherPortalBlocks` | `32` | Approximate maximum connected interior cells to fill |

`creationSounds` applies to the plugin's general `PortalCreateEvent` listener,
not only to shaped portals. It can therefore add the sound to vanilla portal
creation as well.

## Edit safely

1. Stop the server.
2. Copy the current JSON file somewhere safe.
3. Keep valid JSON: lowercase booleans, a positive integer, commas between
   fields, and no trailing comma.
4. Start the server and inspect the console before testing a portal.

There is no reload command. The file is read only when the plugin object is
initialized, and it is rewritten in pretty-printed form immediately afterward.

> Parse and write errors are silently ignored. A JSON value of `null` is accepted
> as a null configuration and later causes portal event handlers to fail. If the
> plugin behaves unexpectedly, stop the server and restore the exact default
> object above rather than using `null` or an empty file.
{.is-warning}

## Build from source

The audited revision uses Gradle Wrapper 7.1. A clean build was reproduced with
JDK 11 on 27 August 2026:

```text
git clone https://github.com/VolmitSoftware/ShapedPortals.git
cd ShapedPortals
git checkout 30e3b4eea5852ffa879d8371d556cd4b9b9fdbe7
./gradlew clean build
```

On Windows, run `gradlew.bat clean build`. The output is
`build/libs/ShapedPortals-1.0.jar`. Gradle 7.1 cannot itself run on very new JDKs;
for example, the audit environment's JDK 25 failed before evaluating the build.
The repository has no automated tests.

Next: [Portal Behavior & Events](/shapedportals/02-portal-behavior-events)
