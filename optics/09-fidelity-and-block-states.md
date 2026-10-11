---
title: "Fidelity and Block States"
description: "Optics destination lighting, biomes, weather, sounds, block entities and rotated state properties"
published: true
date: 2026-10-11T17:27:43.915Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-11T16:00:00.000Z
---

Fidelity APIs carry destination appearance through projected content. They cover lighting, biome tint, weather, sound and selected block-entity data. Hosts supply capture and output, so a policy flag alone does not establish client support.

## FidelityOptions and client profiles

`FidelityOptions` supplies entity velocity epsilon, biome dominance, Bedrock controls, acoustics radius and a sound rate cap per observer. The record does not supply an output adapter.

`ClientProfiles<O>` combines a host detector, client brand, observer identity and fidelity settings. `profile(player)` returns a `BedrockProfile`, `forget`/`clear` release state, and `bedrockViewers` reports the retained count.

`BedrockProfile.JAVA` permits Java profile output. `forBedrock(fidelity)` selects display-entity, light and entity-cap restrictions. `withholdsDisplays` and `entityLimit` apply those limits. The Bedrock block batch limit is 64.

These profiles describe host restrictions. They do not implement a Bedrock transport or guarantee equivalent rendering.

## Atmosphere and biomes

| AtmosphereMode | Policy |
|---|---|
| `OFF` | No atmosphere relay |
| `TINT` | Destination biome tint |
| `TINT_LIGHT` | Tint and promoted skylight |
| `FULL` | Tint, promoted skylight, fog plate and weather relay |

`configName`, `parse(name, fallback)` and `next` support host controls. `tintsBiomes`, `promotesSkyLight`, `usesFogPlate` and `relaysWeather` report selected behavior.

`AtmosphereChannel.update(scan, fidelity)` derives biome overrides from claims and destination content. Its `Scan` carries claims, destination and the claims-changed flag. `disable` and `isActive` manage channel state.

`BiomeClaimSet` combines overrides from multiple portals and retains local biome data for restoration. `apply` and `release` return changed `ChunkBiomes` records. `current`, `claimsChunk`, `retintedCells` and `isEmpty` expose the result.

Call `invalidateLocalColumn` or `refreshLocalColumn` when host biome data changes. `clear` releases retained state. Send resulting chunks through `WorldOutput.biomes`.

`FogPlatePolicy.applies(enabled, mode)` requires an enabled fog plate and `FULL` atmosphere. `shellState` selects light-blue stained glass, netherrack or end stone for the three standard dimensions. A custom dimension returns no shell state.

## Destination light

`LightOverlay` merges projected claims with local light baselines and sends changed light sections through `WorldOutput`. Its constructor receives output, world changes and metrics.

| Method | Use |
|---|---|
| `apply` | Update projected lighting from claims and host policies |
| `revert` | Restore local lighting for the observer |
| `refreshBaseline`, `mergeBaselines` | Preserve host light packet baselines |
| `invalidateChunk`, `discardChunk`, `discardUnsentChunks` | Manage changed or unavailable columns |
| `localLightSender` | Supply explicit local light restoration |
| `isIdle`, `hasPendingUpdates`, `discard` | Inspect or release state |

`ChunkLight` carries chunk coordinates, block/sky masks and nibble layers. `lightingSectionBudget`, `selectSections`, `removeSections`, section-range helpers and `writeLightNibble` support bounded host output.

`ContentView.packLight`, `unpackSkyLight` and `unpackBlockLight` use four bits per sky/block value. `SkyMath.computeSkyDarken` derives darkness from day time and optional storm/thunder. `weatherDarken` adjusts a clear-sky value.

The host must capture available light and preserve real local baselines. `SOURCE`, `LOCAL` and `FULL_BRIGHT` block claims choose the light policy. See [07 - World Views and Plates](/optics/07-world-views-and-plates#overlapping-block-claims).

## Weather

`WeatherRelay.plan(storm, thunder, biomeKey, tick)` chooses a `Burst` with precipitation type and count. Bursts use a five-tick interval and at most 24 particles.

`spawn(emission, output, observer)` selects projected air claims through the supplied air predicate and random source. `Emission` contains the claims and burst. `WorldOutput.weather` performs the host particle output.

This relay emits precipitation effects near projected content. It does not change the destination's weather or replace the host client's weather renderer.

## Sounds

| AcousticsProfile | Admitted classes |
|---|---|
| `OFF` | None |
| `AMBIENT` | Ambient |
| `AMBIENT_EVENTS` | Ambient and world events |
| `FULL` | Ambient, world and entity events |

`AcousticsBridge` maps a `SoundEvent` from a destination into observer-local `Playback` values. `Options` supplies output, observer ids and fidelity settings. The host captures real sound events and selects the applicable acoustics policy when registering destination context.

| Method | Use |
|---|---|
| `noteDestination` | Register a local destination view |
| `noteRemoteDestination` | Register a remote peer and portal destination |
| `onEvent`, `onRemoteSound` | Relay captured local or remote events |
| `tickAmbient`, `ambientBed` | Supply periodic ambient sound |
| `hasDestinationWorld` | Check whether a world has listeners |
| `forgetPortal`, `forgetObserver`, `clear` | Release context |

A destination context expires after 10000 milliseconds without renewal. Ambient updates use an 80-tick interval. Fidelity options bound relay radius and per-observer event rate. `WorldOutput.sound` sends the playback.

## Block-entity data

`BlockEntitySample(typeKey, nbt)` stores an encoded tag payload with a 2048-byte limit. `write`/`read` and `encode`/`decode` serialize samples. It does not parse a platform NBT type itself.

`BlockEntityMaterials.isCandidate`, `typeKey`, `isContainerType` and `allowed` classify blocks and enforce the host whitelist/container policy.

`BlockEntitySanitizer.sanitize(typeKey, tag, options)` selects permitted data through `TagAccess<T>`. `Options` contains whitelist, container permission and tag access. The containers option allows container block-entity types, not their contents. Sanitization strips identity and position, locks, loot tables, inventory/item/book data and slot lists. `sanitize` returns `null` for missing or disallowed input, failed encoding, or an encoded payload above 2048 bytes. Implement names, lookup, compounds, list traversal, put, contains and encoding in the host adapter.

`BlockEntityLayer.update(desired, localLookup)` compares projected and local samples. `flush(observer, budget, output, ...)` sends bounded output, with optional eligibility filters. `BlockEntityLookup` supplies local restoration data.

`restoreCell`, `discardCell`, invalidation methods and `retireAll` manage ownership and restoration. `pendingCount`/`hasPending` report queued output. `clear` drops retained state.

## Block-state orientation

`StateProperties` is an immutable set of string properties. Use `of(map)` or `parse(text)`, read values by index or name, and return replacements with `with(name, value)`.

```java
StateProperties properties = StateProperties.parse("[facing=north,half=top]");
StateProperties mapped = BlockStateRules.apply(properties, permutation);
```

`permutation` is an `AxisPermutation` from a portal map. `BlockStateRules.affects` tests whether properties contain a handled directional field. Unknown properties remain unchanged.

| Property group | Mapping |
|---|---|
| `facing`, `vertical_direction`, `axis`, `rotation` | Cardinal directions, world axes and 16-step rotation |
| Direction-named connection properties | Move supported connection values between faces |
| `shape`, rail directions and ascending tracks | Rotate compatible track names and reflect left/right shapes |
| `orientation` | Map paired front/top directions |
| `hinge`, `side_chain`, `type`, `half`, `face`, `attachment`, `hanging` | Apply the supported reflection and upside-down value swaps |

`StateRewriteCache<B>` bridges a host property reader and writer to cached `rewrites(block)` and `apply(block, permutation)` results. `TrackShape.fromSerializedName`, `serializedName` and `map` handle rail-shape names.

These rules transform discrete cardinal state. They do not convert arbitrary-angle `Affine` rotations into new Minecraft block states.
