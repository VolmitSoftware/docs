---
title: "API - Plugin API Packs"
description: "Folder-backed community metric definitions for React"
published: true
date: 2026-08-28T07:55:00.000Z
tags: "react"
editor: markdown
dateCreated: 2026-08-28T00:00:00.000Z
---

Plugin API packs let an operator add metrics for another installed plugin without compiling Java. Each pack is one strict TOML file under `plugins/React/plugin-apis/`; React validates it, creates ordinary samplers, and exposes their values to monitors, history, PlaceholderAPI, and React Web.

This is not unrestricted access to every private field or method in another plugin. A metric must already be available through React's metric bridge, a numeric PlaceholderAPI placeholder, a supported Oraxen query, or a public Bukkit event that React can count.

## Operator workflow

1. Obtain a `.toml` pack from a source you trust.
2. Read its `targetPlugin`, `targetVersions`, source types, and `trusted` flag.
3. Place it in `plugins/React/plugin-apis/`, or paste it into **Plugin API Packs** in React Web with an admin token.
4. Wait up to three seconds or run `/react plugin-api reload`.
5. Run `/react plugin-api status` or inspect React Web for target compatibility, individual metric availability, failures, and quarantine state.

React creates the folder and installs the Adapt, PlaceholderAPI Server, and Oraxen examples only when the folder does not exist. Deleting or replacing one of those files is permanent; React does not recreate it on later scans.

File replacement is atomic through React Web. A changed valid pack replaces its prior runtime. An invalid edit reports a validation error and leaves the last valid runtime active. Deleting a file retires its samplers and event listeners. The directory accepts at most 32 `.toml` files and 256 metrics in total.

## Pack schema

The only accepted schema is `react.plugin-api/v1`. React does not read older schemas, aliases, JSON, YAML, nested directories, or migrated keys. Unknown keys fail validation.

```toml
schema = "react.plugin-api/v1"
id = "community.example"
version = "1.0.0"
name = "Example Metrics"
authors = ["Example Author"]
enabled = true
trusted = false
targetPlugin = "ExamplePlugin"
targetVersions = ["1.4.*", "1.5.0"]

[[metrics]]
id = "work-rate"
displayName = "Work Rate"
kind = "rate"
unit = " operations/s"
icon = "CLOCK"
decimals = 1
sampleEveryMs = 1000
staleAfterMs = 15000

[metrics.source]
type = "integration"
pluginId = "example"
key = "example.work.total"
foliaSafe = true

[metrics.transform]
mode = "delta-per-second"
scale = 1.0
offset = 0.0
minimum = 0.0
```

### Root fields

| Field | Required | Rules |
|---|---:|---|
| `schema` | yes | Exactly `react.plugin-api/v1` |
| `id` | yes | 2–48 lowercase letters, digits, `.`, `_`, or `-`; must begin with a letter or digit |
| `version` | yes | Pack author's version, at most 32 characters |
| `name` | yes | Display name, at most 64 characters |
| `authors` | no | Up to eight non-empty names, each at most 64 characters |
| `enabled` | no | Defaults to `true`; a disabled pack registers no samplers |
| `trusted` | no | Defaults to `false`; must be `true` for PlaceholderAPI sources |
| `targetPlugin` | yes | Bukkit plugin name whose enabled state and version gate the whole pack |
| `targetVersions` | no | Up to 32 exact versions or prefix patterns ending in `*`; empty accepts every version |
| `metrics` | yes | Between one and 24 metric tables |

`targetVersions = ["*"]` accepts every target version. `1.4.*` accepts strings beginning with `1.4.`. No semantic-version interpretation or range syntax is applied.

### Metric fields

| Field | Required | Rules |
|---|---:|---|
| `id` | yes | Unique within the pack; lowercase letters, digits, `_`, and `-` |
| `displayName` | yes | Sampler display name, at most 64 characters |
| `kind` | yes | `gauge`, `counter`, `bytes`, `rate`, `percent`, or `millis` |
| `unit` | no | Display suffix, at most 16 characters |
| `icon` | yes | Bukkit material name used by in-game sampler views |
| `decimals` | no | 0–4; defaults by metric kind |
| `sampleEveryMs` | no | 1,000–10,000 ms; defaults to 1,000 ms |
| `staleAfterMs` | no | At least `sampleEveryMs`, at most 60,000 ms; defaults to 15,000 ms |
| `source` | yes | One source table described below |
| `transform` | no | Optional value conversion |

The sampler id is deterministic: `plugin-api-<pack-id>-<metric-id>`, with punctuation normalized to hyphens. Pack samplers use the normal React sampler registry. They therefore appear in the live metrics catalog, durable history, monitor configuration, maps that accept global samplers, React's `%react_…%` PlaceholderAPI surface, and the web metrics explorer.

## Source types

### React integration metrics

```toml
[metrics.source]
type = "integration"
pluginId = "adapt"
key = "adapt.ability-ops"
foliaSafe = true
```

This reads the cached metric published through React's cross-plugin metric bridge. It never calls the target plugin from the sampler. `pluginId` and `key` must match the publisher exactly. Use this source when a plugin already implements React metric publishing; see [18 - API - Metric Publishing](/react/18-api-metric-publishing).

### PlaceholderAPI

```toml
trusted = true

[metrics.source]
type = "placeholder"
placeholder = "%server_online%"
foliaSafe = true
```

The value must be one complete `%placeholder%` token. React removes legacy color codes, an optional leading `*`, and an optional trailing `%`, then accepts only one finite decimal number. Literal unresolved placeholders, labels such as `20 players`, `NaN`, and infinite values are unavailable.

Placeholder expansions execute code owned by their expansion. Some expansions perform sound, JavaScript, database, or other side-effecting work. For that reason every pack containing a PlaceholderAPI source must explicitly set `trusted = true`. Review the expansion and pack before installation. On Folia, React evaluates a placeholder only when that source also declares `foliaSafe = true`; the pack author is responsible for verifying the expansion's thread behavior.

The bundled server example uses `%server_online%`, `%server_tps_1%`, and `%server_ram_used%`. These require PlaceholderAPI and its Server expansion, normally installed with `papi ecloud download Server` followed by the expansion's required reload. PlaceholderAPI usage is documented by the [PlaceholderAPI developer guide](https://wiki.placeholderapi.com/developers/using-placeholderapi/) and the available Server keys are listed in its [placeholder catalog](https://wiki.placeholderapi.com/users/placeholder-list/minecraft/).

### Oraxen queries

```toml
[metrics.source]
type = "oraxen"
key = "items"
foliaSafe = true
```

The Oraxen source is deliberately allowlisted. `key` must be `items`, `blocks`, or `furniture`. React reads the sizes returned by Oraxen's public item-name, block-id, or furniture-id collections. It does not accept arbitrary class or method names. See the [Oraxen API documentation](https://docs.oraxen.com/developers/api).

### Bukkit event counters

```toml
[metrics.source]
type = "event-counter"
eventClass = "io.th0rgal.oraxen.api.events.furniture.OraxenFurniturePlaceEvent"
foliaSafe = true
```

React loads the named class from the target plugin's classloader and requires it to extend Bukkit `Event`. It registers a `MONITOR` listener with cancelled events ignored and increments a counter in memory. The counter begins at zero when the pack activates and resets when React or the pack reloads. Removing the pack unregisters its listener.

An event counter is observational. Pack authors must not treat a `MONITOR` count as permission to change the event or as a durable business total.

## Transforms

| Field | Default | Behavior |
|---|---:|---|
| `mode` | `value` | `value` uses the current source value. `delta-per-second` converts a monotonically increasing counter into a per-second rate. |
| `scale` | `1.0` | Multiplies the value after the mode conversion. |
| `offset` | `0.0` | Adds to the scaled value. |
| `minimum` | none | Clamps the final value upward. |
| `maximum` | none | Clamps the final value downward. |

All transform numbers must be finite and `minimum` cannot exceed `maximum`. `delta-per-second` needs two samples before it becomes available. A decreasing source counter resets that baseline instead of publishing a negative rate.

## Availability and containment

Collectors run on React's global server scheduling path and samplers only read the resulting cache. A target that is absent, disabled, or outside `targetVersions` makes its pack unavailable without fabricating zeroes. A successful value becomes stale after `staleAfterMs` and then appears unavailable until another successful sample arrives.

React records the last sample time, collector duration, accepted count, failure count, and reason for every metric. A source that throws five consecutive times is quarantined until that pack is reloaded. Collection taking at least 50 ms is logged as slow at most once per minute per metric. Failures include their full stack trace on the first failure and when quarantine is reached.

Pack limits are containment boundaries rather than throughput targets:

- 256 KiB maximum UTF-8 file size
- 32 pack files
- 24 metrics per pack
- 256 active catalog metrics
- 1–10 second collection intervals
- 60 second maximum staleness interval

## Bundled examples

### Adapt Earth Mover

The Adapt example uses integration keys already published by Adapt. It reports Earth Mover execution rate, execution time, and guard-check rate:

```toml
[metrics.source]
type = "integration"
pluginId = "adapt"
key = "adapt.ability-detail.excavation-earth-mover.execution-ops"
foliaSafe = true
```

The other exact keys are `adapt.ability-detail.excavation-earth-mover.execution-timing-ms` and `adapt.ability-detail.excavation-earth-mover.guard-checks`. These are rolling Adapt measurements. If Adapt stops publishing one, React marks it unavailable rather than retaining it as zero.

### PlaceholderAPI Server

The PlaceholderAPI example demonstrates a trusted numeric expansion pack. It targets the `PlaceholderAPI` plugin and reads online players, one-minute TPS, and used RAM through the Server expansion.

### Oraxen Runtime

The Oraxen example reports registered item, block, and furniture counts through the curated Oraxen query source. It also counts `OraxenFurniturePlaceEvent` events since the pack activated. Save the following complete file as `plugins/React/plugin-apis/oraxen-runtime.toml`:

```toml
schema = "react.plugin-api/v1"
id = "example.oraxen-runtime"
version = "1.0.0"
name = "Oraxen Runtime"
authors = ["Volmit Software"]
enabled = true
trusted = false
targetPlugin = "Oraxen"
targetVersions = ["*"]

[[metrics]]
id = "items"
displayName = "Oraxen Items"
kind = "gauge"
unit = " items"
icon = "DIAMOND_SWORD"
decimals = 0
sampleEveryMs = 5000
staleAfterMs = 30000

[metrics.source]
type = "oraxen"
key = "items"
foliaSafe = true

[[metrics]]
id = "blocks"
displayName = "Oraxen Blocks"
kind = "gauge"
unit = " blocks"
icon = "NOTE_BLOCK"
decimals = 0
sampleEveryMs = 5000
staleAfterMs = 30000

[metrics.source]
type = "oraxen"
key = "blocks"
foliaSafe = true

[[metrics]]
id = "furniture"
displayName = "Oraxen Furniture"
kind = "gauge"
unit = " entries"
icon = "ITEM_FRAME"
decimals = 0
sampleEveryMs = 5000
staleAfterMs = 30000

[metrics.source]
type = "oraxen"
key = "furniture"
foliaSafe = true

[[metrics]]
id = "furniture-placements"
displayName = "Oraxen Furniture Placements"
kind = "counter"
unit = " placements"
icon = "ARMOR_STAND"
decimals = 0
sampleEveryMs = 1000
staleAfterMs = 15000

[metrics.source]
type = "event-counter"
eventClass = "io.th0rgal.oraxen.api.events.furniture.OraxenFurniturePlaceEvent"
foliaSafe = true
```

This creates `plugin-api-example-oraxen-runtime-items`, `plugin-api-example-oraxen-runtime-blocks`, `plugin-api-example-oraxen-runtime-furniture`, and `plugin-api-example-oraxen-runtime-furniture-placements`. The first three samplers are gauges. The placement counter starts at zero whenever React or the pack reloads and is not a durable lifetime total. React detects the new file within three seconds; `/react plugin-api reload` applies it immediately and `/react plugin-api status` reports its target and metric state.

## React Web and HTTP API

The per-server **Plugin API Packs** screen appears under **System**. Every authenticated role can inspect installed packs, raw definitions, target versions, trust state, validation errors, source provenance, sampler ids, availability, sampling counts, failures, and quarantine. Only an admin token on a live connection can validate, install, replace, or delete a pack. Deletion requires a second confirmation click.

| Method | Endpoint | Scope | Result |
|---|---|---|---|
| `GET` | `/api/v1/plugin-api-packs` | `read` when protected reads are enabled | Catalog, folder, runtime status, raw TOML, and validation errors |
| `GET` | `/api/v1/plugin-api-packs/{id}` | `read` when protected reads are enabled | One active pack |
| `POST` | `/api/v1/plugin-api-packs/validate` | `admin` | Validates `{ "content": "…" }` without installing it |
| `PUT` | `/api/v1/plugin-api-packs/{id}` | `admin` | Atomically installs or replaces a pack; path id must equal the TOML id |
| `DELETE` | `/api/v1/plugin-api-packs/{id}` | `admin` | Retires and removes an active pack |

Mutation requests use the normal authenticated monotonic replay counter. Accepted installs and removals are written to the React Web audit log and reported to online operators without including the submitted TOML.

## Authoring and distribution

- Choose a stable pack id under a community or organization namespace.
- Pin `targetVersions` when a source depends on a particular plugin API or placeholder contract.
- Prefer React integration metrics because they are cached, typed at the publisher boundary, and do not execute arbitrary expansion code.
- Use event counters for public Bukkit events, not private implementation classes.
- Set `trusted = true` only when the pack needs PlaceholderAPI and document the exact expansion dependency.
- State whether a counter resets with React, the target plugin, or neither.
- Test target-missing, target-version mismatch, first-sample warmup, stale data, reload, deletion, and Folia behavior before sharing the file.
- Distribute the TOML file itself. Do not bundle executable jars, scripts, secrets, tokens, or server paths with a pack.

## Troubleshooting

| State or reason | Meaning |
|---|---|
| `target-plugin-not-enabled` | `targetPlugin` is absent or disabled |
| `target-version-not-listed` | The installed version does not match `targetVersions` |
| `waiting-for-first-sample` | The target is compatible but no source value has succeeded yet |
| `source-unavailable` | The bridge key, placeholder, or supported query returned no finite value |
| `transform-warming-up` | `delta-per-second` has only its first counter sample |
| `stale` | No successful sample arrived within `staleAfterMs` |
| `event-registration-failed` | The event class was missing, inaccessible, or not a Bukkit event |
| `quarantined-after-5-failures` | The collector threw five consecutive times; correct the pack and reload it |
| `sampler-id-conflict` | Another sampler already owns the generated id |

Validation errors name the rejected file. Correct the current `react.plugin-api/v1` TOML directly; React has no legacy migration or compatibility mode.
