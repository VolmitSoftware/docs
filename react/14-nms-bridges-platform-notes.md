---
title: "NMS Bridges & Platform Notes"
description: "React documentation: NMS Bridges & Platform Notes"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Some React features need a bridge for the running Minecraft version. If no compatible bridge is available, those features stay passive or measurement-only.

## Check bridge status

Run `/react bridge status`. Startup logs also report whether React found a compatible bridge.

Test bridge-dependent features after every Minecraft or server update. Use `/react dev verify` only on a disposable world because it runs a falling-block probe.
