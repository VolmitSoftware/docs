---
title: "Impulse diagnostics"
description: "Read status and create diagnostic reports"
published: true
date: 2026-10-23T00:00:00.000Z
tags: "impulse"
editor: markdown
dateCreated: 2026-10-22T00:00:00.000Z
---

Impulse supplies status, version, and debug commands for operators.

## Status and version

`/impulse status` reports loaded machines, action counts, failures, compatibility, and service state. `/impulse debug version` shows the installed plugin version. `/impulse version` is a hidden alias.

## Debug reports

```none
/impulse debug dump upload=false
```

This saves a report locally and prints its path. Use `upload=true` to request an upload; `debug.uploadEnabled` must allow it. The command defaults to requesting an upload and requires `impulse.debug`.

Reports include server and plugin information, configuration, language state, machine counters, and service details. They do not replace inspecting a particular machine's controls and inventory.

## Machine controls

Open the machine to see its last action result and effective tier settings. Upgrades show the next tier's settings before payment. The displayed settings reflect the active configuration.

Machine results and status labels use the viewer's selected language. A result distinguishes normal waiting states, missing inputs, full storage, protection denials, unavailable owners or regions, disabled tiers, and action failures. Console reports use the server language.

## Working-area preview

Select the spyglass in machine controls to show the current tier's working area for five seconds. Only the requesting player receives the particles. Choppers outline their full block cube; harvesters show their three crop layers; grinders, collectors, and shearers show their search radius; breakers, placers, and launchers mark the block in front.

The preview describes geometry, not permission to act on every target. Protection, loaded chunks, region ownership, input, and target eligibility still apply. Repeated clicks have a five-second cooldown; leaving the world or disconnecting stops the preview.
