---
title: "Pregeneration"
description: "Iris documentation: Pregeneration"
published: true
date: 2026-10-07T00:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Pregeneration creates chunks before players explore them. Each job covers a square around a center coordinate, with the radius measured in blocks. Iris runs one pregeneration job at a time per server.

Iris limits concurrent chunk requests and retained generation data according to the Java heap. When memory is under pressure, it pauses new requests while active work finishes and saved data is released. A larger requested area increases the work and disk space needed, rather than reserving memory for the whole area.

Asynchronous jobs can start chunks in the next MCA region while requests from the previous region are still finishing. Chunk concurrency and memory limits apply to the whole job across these regions.

## Start

On Bukkit, Paper, Purpur, Leaf, or Folia:

```text
/iris pregen start radius=2000 world=myworld center=0,0 gui=false
```

This generates a square extending 2,000 blocks from the center in each direction. The radius does not set a world border.

| Parameter | Default | Use |
|---|---|---|
| `radius` | Required | Radius in blocks; must be greater than zero |
| `world` | Your current world | World to pregenerate; specify it from console |
| `center` | `0,0` | Block X/Z coordinates; players can use `me` to center on their position |
| `gui` | `true` | Show the desktop progress window when the server has a graphical desktop; use `false` on a headless server |
| `serial` | `false` | Generate one chunk at a time; requires a Paper-compatible server |

Keep every edge of the requested area within ±29,999,984 blocks. Chunk boundaries can make the generated area slightly larger than the requested square.

The command root also accepts `/iris pregenerate`.

## Check progress

```text
/iris pregen status
```

Status reports the world, completed and total chunks, progress, generation rate, elapsed time, estimated time remaining, and pause state. Failed chunks are reported separately when present. Check the final console summary for the completed and failed counts.

Slow generation tasks produce a warning and continue waiting for their required terrain data. River planning errors are logged and retried while the job remains active. Chunks wait for complete river plans; exceeding a warning interval does not discard a chunk or omit its rivers, caves, or objects.

A chunk generation error on a Paper-family server halts the server's chunk system, so the job aborts at once, reports the failing chunk, and counts its outstanding requests as failed instead of waiting for them. When the job is stopped or the server shuts down, requests that have not completed within 60 seconds are counted as failed and regenerate on the next run. Fix the reported error, then rerun the job.

## Pause, resume, or stop

```text
/iris pregen pause
/iris pregen resume
/iris pregen stop
```

`pause` and `resume` are aliases for the same toggle. Either command pauses a running job or resumes a paused job; the reply confirms the resulting state.

`stop` cancels the job after active chunk work finishes. Wait for `/iris pregen status` to report no active job before starting another. Closing the desktop progress window leaves generation running.

## Fabric, Forge, and NeoForge

Use the dimension identifier after the radius:

```text
/iris pregen start 2000 irisworldgen:myworld at 0 0
```

The radius accepts values from `1` to `100000`. Add `gui` for the desktop window, `sync` for one chunk at a time, or `nocache` to disable pregeneration caching. These flags can be combined in any order after the coordinates.

Use `/iris pregen status`, `/iris pregen pause`, `/iris pregen resume`, and `/iris pregen stop` to manage the job.

See [Configuration](/iris/03-configuration) for pregeneration settings and [Commands & Permissions](/iris/04-commands-permissions) for command access.
