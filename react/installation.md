---
title: React — Installation
description: Requirements and setup for React
published: true
date: 2026-08-19T00:00:00.000Z
tags: react, installation
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

## Requirements

| | |
|---|---|
| Server software | Paper or a Paper fork |
| Java | JDK 17+ |

React downloads runtime libraries on first start. Those libraries include Adventure, Caffeine, fastutil, Procyon, Spoon, and Java-WebSocket. First boot needs outbound network access. First boot is slower than later boots.

## Install

1. Copy `React-x.x.x.jar` into `plugins/`.
2. Start the server. Let the libraries download.
3. Configs appear in `plugins/React/`.

## First steps

```
/react monitor
```

This command turns on the action-bar readout. Configure which metrics it shows with:

```
/react config monitor
```

To find what costs time:

```
/react chunk worst
```

This command reports the most expensive chunk on the server or in a world. The cause is usually a mob farm, a hopper chain, or a redstone clock.

## Before changing anything

Run the benchmarks to establish a baseline:

```
/react environment info
/react benchmark cpu-benchmark
/react benchmark memory-benchmark
/react benchmark drive-benchmark
```

> Benchmark numbers are indicative, not authoritative. They help you compare two machines under the same conditions. Do not use them for absolute claims about hardware.

## Building from source

React requires **JDK 17**:

```
git clone https://github.com/VolmitSoftware/React.git
cd React
./gradlew setup   # first build only, for MC 1.18+
./gradlew React
```

The jar lands in `React/build/`.
