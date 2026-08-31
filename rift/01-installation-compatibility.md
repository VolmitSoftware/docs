---
title: "Rift — Installation & Compatibility"
description: "Server range, Java requirements, source build, and Folia capability limits"
published: true
date: 2026-08-28T00:00:00.000Z
tags: "rift, installation, compatibility, java, folia"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Rift supports Spigot, Paper, Purpur, and Folia from Minecraft 1.20.1 onward. Use Java 17 or the newer version required by your server.

## Install

1. Stop the server and back up its worlds and `plugins/Rift/`.
2. Put the Rift jar in `plugins/`.
3. Start the server.
4. Run `/rift doctor`.
5. Test world creation and recovery with a disposable world before managing production worlds.

Rift includes VolmLib. External world generators are optional; `vanilla` and `void` are built in.

## Folia

Folia supports Rift's listing, information, teleport, configuration, diagnostics, auto-load settings, and protection settings.

Folia does not currently support the dynamic world APIs required for create, import, load, unload, quarantine, or restore. Rift disables those commands there.

Next: [Commands & Permissions](/rift/02-commands-permissions)
