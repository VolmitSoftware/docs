---
title: "Pregeneration"
description: "Iris documentation: Pregeneration"
published: true
date: 2026-09-23T10:00:00.000Z
tags: "iris"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Pregeneration creates chunks before players explore them. Each job covers a square around a center coordinate, with the radius measured in blocks. Iris runs one pregeneration job at a time per server.

## Start

On Bukkit, Paper, Purpur, Leaf, or Folia:

```text
/iris pregen start radius=2000 world=myworld center=0,0 gui=false
```

This generates a square extending 2,000 blocks from the center in each direction. Use a smaller radius for your first run, and make sure the server has enough free disk space for the area.

Pregeneration automatically prepares hydrology as needed and reuses matching saved plans. It uses the world's saved terrain and cave sampling settings; the pregeneration command does not change terrain detail. Choose [terrain sampling intervals](/iris/11-dimensions#terrain-sampling) before creating a new world if changed terrain is acceptable. The radius sets the requested area, not a world border; neighboring chunks needed to complete that area can also generate.

| Parameter | Default | Use |
|---|---|---|
| `radius` | Required | Radius in blocks; must be greater than zero |
| `world` | Your current world | World to pregenerate; specify it from console |
| `center` | `0,0` | Block X/Z coordinates; players can use `me` to center on their position |
| `gui` | `true` | Show the desktop progress window when the server has a graphical desktop; use `false` on a headless server |
| `serial` | `false` | Generate one chunk at a time; requires a Paper-compatible server |

On Paper-family servers other than Folia, nonserial pregeneration can temporarily increase native generation workers when the JVM heap is at least 16 GiB. The target is twice the available CPU count, capped at 32 without reducing the usual CPU-sized target or larger existing pools. Iris restores the original pool size after the job drains.

Keep every edge of the requested area within ±29,999,984 blocks. Chunk boundaries can make the generated area slightly larger than the requested square.

The command root also accepts `/iris pregenerate`.

## Check progress

```text
/iris pregen status
```

Status reports the world, completed and total chunks, progress, generation rate, elapsed time, estimated time remaining, and pause state. Failed chunks are reported separately when present. Check the final console summary for the completed and failed counts.

## Pause, resume, or stop

```text
/iris pregen pause
/iris pregen resume
/iris pregen stop
```

`pause` and `resume` are aliases for the same toggle. Either command pauses a running job or resumes a paused job; the reply confirms the resulting state.

`stop` cancels the job after active chunk work finishes. Wait for `/iris pregen status` to report no active job before starting another. Closing the desktop progress window leaves generation running.

## Offline region generation

The standalone Java 25 exporter creates fresh Minecraft 26.3 terrain checkpoints without running a Minecraft server. A checkpoint contains MCA terrain and the matching Iris pack, seed history, and persistent generation data. The server must still complete native features, population, lighting, entities, and scheduled ticks before the chunks are ready for play. Live plugin events do not run during export. Use vanilla Minecraft registries plus the supplied Iris pack; additional server datapacks are not loaded.

Use matching Iris and VolmLib source checkouts, with VolmLib beside Iris so the build resolves shared sources locally. Build the distribution from the Iris checkout:

```sh
./gradlew :adapters:bukkit:nms:v26_3_R1:installOffline
adapters/bukkit/nms/v26_3_R1/build/install/iris-offline/bin/iris-offline --help
```

Keep `bin/` and `lib/` together when moving the installed distribution. Invoke the launcher by its full path or add its `bin/` directory to `PATH`. It accepts these positional arguments:

```text
iris-offline pack dimension seed chunkX chunkZ width regionsX regionsZ parallelism spigot worldName levelKey noiseSettings output
```

For example, this exports chunks X/Z 0–63 as four 32×32 windows:

```sh
iris-offline /srv/packs/overworld overworld 12345 0 0 32 2 2 16 /srv/server/spigot.yml world_iris_frontier iris:frontier minecraft:overworld /srv/exports/frontier
```

`pack` is the pack directory and `dimension` is its dimension key. `chunkX` and `chunkZ` are chunk coordinates. `width` accepts 1–32 and `parallelism` accepts 1–32; `regionsX` and `regionsZ` must be positive. The launcher defaults to an 8 GiB maximum heap; set `JAVA_OPTS` for additional JVM options. `output` must be a new absolute directory whose parent already exists. Its filesystem must support atomic directory moves and directory synchronization; unsupported directory synchronization fails before terrain generation starts. Neighboring prerequisite chunks are included around the requested area.

Chunk compression also follows `parallelism`, up to eight workers. Lower values reduce concurrent compression work and its memory use.

Use the intended server's Spigot configuration, exact world name, native dimension key, and noise-settings key. Keep the server and exporter on the same Iris and Minecraft builds. The successful output is `native-terrain-checkpoint/`; its `checkpoint.properties` reports `status=minecraft:terrain` and `complete=false`. An `incomplete/` directory is unfinished output and must not be imported.

To import, create a fresh Iris world with the same pack, dimension, seed, world name, and native dimension key, then stop the server. Back up that world's generated data, then remove its `iris/`, `region/`, `entities/`, and `poi/` directories. Copy the checkpoint's `world/iris/` and `world/region/` into that world together; leave `entities/` and `poi/` absent so the server rebuilds them during native completion. Keep the server-created world metadata and native dimension registration. Do not combine the checkpoint with an existing played world or replace either directory independently.

Restart the server and pregenerate the exported area to finish native generation. For the example above:

```text
/iris pregen start radius=512 world=world_iris_frontier center=512,512 gui=false
```

Wait for the job to finish with zero failures before using the world. Regular pregeneration completes saved terrain checkpoints and skips chunks already saved at full generation status.

## Fabric, Forge, and NeoForge

Use the dimension identifier after the radius:

```text
/iris pregen start 2000 irisworldgen:myworld at 0 0
```

The radius accepts values from `1` to `100000`. Add `gui` for the desktop window, `sync` for one chunk at a time, or `nocache` to disable pregeneration caching. These flags can be combined in any order after the coordinates.

Use `/iris pregen status`, `/iris pregen pause`, `/iris pregen resume`, and `/iris pregen stop` to manage the job.

See [Configuration](/iris/03-configuration) for pregeneration settings, [Commands & Permissions](/iris/04-commands-permissions) for command access, and [Performance Tuning](/iris/33-performance-tuning) for configuration options.
