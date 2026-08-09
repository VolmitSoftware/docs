---
title: React — Installation
description: Requirements and setup for React
published: true
date: 2026-08-09T00:00:00.000Z
tags: react, installation
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Server software | Paper or a Paper fork |
| Java | JDK 17+ |

React downloads runtime libraries on first start, including Adventure, Caffeine, fastutil,
Procyon, Spoon, and Java-WebSocket. First boot needs outbound network access and will be
slower than later ones.

## Install

1. Drop `React-x.x.x.jar` into `plugins/`.
2. Start the server and let the libraries download.
3. Configs appear in `plugins/React/`.

## First steps

```
/react monitor
```

Turns on the action-bar readout. Configure which metrics it shows with:

```
/react config monitor
```

To find what is actually costing you:

```
/react chunk worst
```

Reports the most expensive chunk on the server or in a world — usually a mob farm, a hopper
chain, or a redstone clock.

## Before changing anything

Run the benchmarks to establish a baseline:

```
/react environment info
/react benchmark cpu-benchmark
/react benchmark memory-benchmark
/react benchmark drive-benchmark
```

> Benchmark numbers are indicative, not authoritative. They are useful for comparing two
> machines under the same conditions, not for absolute claims about hardware.

## Building from source

React requires **JDK 17**:

```
git clone https://github.com/VolmitSoftware/React.git
cd React
./gradlew setup   # first build only, for MC 1.18+
./gradlew React
```

The jar lands in `React/build/`.
