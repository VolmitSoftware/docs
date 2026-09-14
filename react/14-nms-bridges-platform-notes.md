---
title: "NMS Bridges & Platform Notes"
description: "React documentation: NMS Bridges & Platform Notes"
published: true
date: 2026-09-14T00:38:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Some React features need a bridge for the running Minecraft version. If no compatible bridge is available, those features stay passive or measurement-only.

## Check bridge status

Run `/react bridge status`. Startup logs also report whether React found a compatible bridge.

On Folia, `chunk-tickets` uses the native bridge to count a locked ticket snapshot without chunk access. It needs no bytecode instrumentation. An unavailable bridge leaves this metric unavailable. See [10 - Samplers & Metrics](/react/10-samplers-metrics).
