---
title: "Shaped Portals — Compatibility & Operations"
description: "Platform limits, plugin interoperability, performance, and a production checklist"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "shapedportals, compatibility, operations, legacy"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Shaped Portals 1.0 is historical Bukkit code. It declares API 1.17 and its
published listing names 1.17–1.19 as tested. No current Paper, Spigot, or Folia
compatibility is established by the audited repository.

## Platform matrix

| Platform | Status |
|---|---|
| Spigot 1.17–1.19 | Historical listed test range; verify your exact build |
| Paper 1.17–1.19 | May load through Bukkit compatibility; not established by tests |
| Current Paper/Spigot | Unverified |
| Folia | Unsupported; no Folia declaration and unsafe global/async Bukkit access |

The jar's `api-version: 1.17` prevents it from loading on older servers. A newer
server accepting that API version does not guarantee behavioral compatibility.

## Threading and performance

The frame scan is scheduled asynchronously, but it calls Bukkit `World` and
`Block` methods while off the main server thread. Bukkit does not make arbitrary
world access thread-safe. This can race chunk unloads and other block changes,
and it violates Folia's region ownership model.

`maxNetherPortalBlocks` limits how far an open or oversized interior is normally
explored, but it does not make those calls thread-safe. Raising the limit also
increases recursive depth and the risk of stack exhaustion.

## Interoperability checklist

Before production use, test all of these on a server copy:

- normal vanilla rectangular portal creation;
- a valid non-rectangular portal in both axes;
- a portal with crying obsidian enabled and disabled;
- a frame above the configured size limit;
- a frame open to outside air;
- ignition in a region where fire placement is denied;
- a plugin that cancels `PortalCreateEvent`;
- server restart with valid, malformed, and restored configuration;
- concurrent chunk unload or teleport activity around the frame; and
- Nether travel and return-portal behavior in every affected world.

## Production recommendation

Do not treat this revision as production-ready on modern servers without first
fixing the asynchronous Bukkit access and cancelled-event handling. If it must
run in a legacy environment, keep the default size limit, maintain current
backups, use a staging server, and monitor the console for asynchronous access
warnings and event exceptions.

Next: [Code Audit](/shapedportals/04-code-audit)
