---
title: "NMS Bridges & Platform Notes"
description: "React documentation: NMS Bridges & Platform Notes"
published: true
date: 2026-09-20T04:21:21.395Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Some React features need a bridge for the running Minecraft version. If no compatible bridge is available, those features stay passive or measurement-only.

Minecraft 26.1.2, 26.2, and 26.3 have bundled bridges. The server version selects the matching bridge automatically. Furnace and brewing batching, hopper coalescing, falling-block handling, and explosion batching remain available on 26.3.

## Check bridge status

Run `/react bridge status` to inspect native capability availability. Startup logs also report whether React found a compatible bridge. An available version does not guarantee that every optional capability is present.

On Folia, `chunk-tickets` uses the native bridge to count a locked ticket snapshot without chunk access. It needs no bytecode instrumentation. An unavailable bridge leaves this metric unavailable. See [10 - Samplers & Metrics](/react/10-samplers-metrics).
