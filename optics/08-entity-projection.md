---
title: "Entity Projection"
description: "Optics entity snapshots, projected identities, movement, metadata, maps and relationships"
published: true
date: 2026-10-12T02:24:00.764Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-11T16:00:00.000Z
---

Entity projection converts captured entity state into a portal view. The host supplies entity discovery, visibility, profiles and output. Optics calculates transformed state and maintains projected identities, but does not spawn platform entities itself.

## Capture and output contracts

| Interface | Host responsibility |
|---|---|
| `EntityFeed<O, W, V, E>` | Capture snapshots, find local entities, check observer visibility and supply profiles, state versions and map availability |
| `EntityOutput<O, R, T, V, E>` | Allocate ids and send spawn, state, motion, head look, velocity, relationships, destroy, player info, labels, teams and maps |
| `MetadataAccess<D>` | Read and replace host metadata values, directions, names, skin parts and map ids |

The output adapter also provides entity type queries, host positions, local hide/show, observer identity/availability and warnings. `EntityProfile` stores the profile name, texture value and texture signature.

`CandidateCache<W, E>.nearby(query, now)` caches local entity candidates. Its `Query` supplies portal id, world, center, range and cache ticks. `InterestIndex<T>` maps source entity ids to active projection targets. Use `activate`, `replace`, `deactivate` and `close` as targets change.

## EntitySnapshot and deltas

`EntitySnapshot` carries identity, type, position, height, look vector, yaw/pitch, velocity, ground state, player profile, vehicle/leash ids and payload bytes. Metadata, equipment and map data use host-supplied encodings. `EntityVisualMetadata` adds a typed gravity and scale header around opaque entity metadata.

`EntitySnapshot.full(...)` normalizes absent profile strings and payload arrays. `isPlayer`, `hasTextures` and `isFull` describe the snapshot. `write` and `read` serialize its fields through data streams.

| Encoding property | Value |
|---|---|
| Position quantum | 1/4096 block |
| Look-vector scale | 32767 |
| Velocity scale | 1024 |
| Height scale | 100, with an encoded maximum of 2.55 blocks |
| Angle representation | One byte per angle |
| Sequence representation | Low 16 bits |

Use the `quantize`/`dequantize`, unit, velocity, height and angle helpers when implementing a matching consumer. Quantized snapshots do not preserve arbitrary floating-point precision.

`MODE_FULL`, `MODE_DELTA` and the `FIELD_*` bitmask describe present fields. `EntityDeltaCodec.computeMask` compares snapshots. `buildDelta` emits changed fields, and `applyDelta` merges incoming fields with known state. The host must manage snapshot sequence and availability.

`EntityRelationship` stores an entity id, vehicle id, passenger list and leash-holder id. `EntityAnimation.animation` and `hurt` create transient animation events separately from persistent state.

## Visual metadata header

`EntityVisualMetadata(gravity, effectiveScale, data)` carries the source entity's cardinal gravity frame, effective scale and opaque host metadata bytes. `encode()` writes the header followed by those bytes. `decode(encoded)` reads the same format. The constructor and `data()` copy payload arrays. Equality compares payload contents.

| Offset | Encoding | Value |
|---|---|---|
| 0 | Unsigned byte | Proper `AxisPermutation` orientation index |
| 1 | Big-endian double | Finite positive effective scale |
| 9 | Remaining bytes | Host entity metadata |

The header occupies `HEADER_BYTES`, currently 9 bytes. The frame must be a proper rotation. The payload may be empty while the header still supplies visual state. An empty outer `EntitySnapshot.metadata()` means absence of metadata. Hosts handle that absence before calling `decode`.

Wormholes Bukkit and native hosts use this header for streamed native-client entities. Bukkit captures `GravityFrame.WORLD` and the living entity's complete scale attribute value. Native hosts capture the current gravity frame and effective scale. The native consumer removes the header before reading the host metadata, then applies gravity and scale to its model. Source metadata changes, gravity changes and effective scale changes must invalidate capture reuse.

Native model snapshots keep body yaw and pitch local to the captured gravity frame. Their look vector remains in world coordinates. Convert that vector into the local frame when selecting the head angle.

Use `withData(updatedData)` when patching item-frame rotation, upside-down appearance or other host metadata fields. It retains gravity and effective scale. The header stays inside the existing metadata payload, so `EntitySnapshot` fields and the outer stream message shape do not change.

## Geometry projection

`EntityProjection.project` maps a snapshot through an `OpticTransform`, an `EntityPath` or a `ViewWindow`. Bounds and frustum overloads apply visibility checks. Its sampled fields expose projected position, velocity, yaw/pitch and metadata transform.

`project(..., window, ..., secret, naming)` returns a `Projected` snapshot with projected identity and player naming. `nativeModel` supplies a projected snapshot for host-native model rendering. `opaque(secret, id)` derives a projected id, and `feetInto` maps an entity's feet while accounting for height.

Projected identity is a view identity. It does not grant access to the source entity or move that entity in the destination world.

## Traveller model orientation

Use `TravellerState.modelTransform()` for a traveller whose gravity frame differs from world-down. It returns an `Affine` from model-local coordinates to the world, anchored at the traveller's feet. Model-local `+Y` is up and `+Z` is forward. The transform combines body yaw, the proper gravity rotation and uniform traveller scale.

Pose body and head angles are local to gravity. Keep their independent animation and angle history when drawing the model and its equipment. `TravellerState.camera()` supplies world look and screen-up, while `eyePosition(height)` includes scale along gravity-up. The host must carry gravity state alongside entity snapshots and apply it to its renderer. `EntitySnapshot` does not assign physical gravity to an entity.

## SnapshotProjector

Construct `SnapshotProjector` with a `SpoofRegistry`, feed, output and a fidelity-settings supplier. Its `Pass` supplies the endpoint path, destination view, snapshots, bounds, occlusion and limits needed for one update.

`projectRemoteVisual` and `projectSnapshotVisual` project individual snapshots. `apply(observer, pass)` processes a complete pass. `EntityRange`, `Spawn`, `Label` and `State` are typed request/output records for host adapters.

`SnapshotProjector.fullyHidden` uses entity occlusion before output. Supply correct hanging and item-frame classification through the output adapter. The host remains responsible for packet or renderer support for each entity type.

## Projected identity and movement

`SpoofRegistry<O, R>` stores one `SpoofedEntity` per source id. Mark entities visible during a pass, then call `destroyHidden` to retire absent ones. `destroyAll` and `destroySingle` release output explicitly.

| Registry operation | Use |
|---|---|
| `track`, `get`, `contains`, `sourceIds`, `livingId` | Manage projected identities |
| `clearVisible`, `markVisible` | Record the current visible set |
| `syncMotion`, `syncHeadLook` | Send position/rotation and head updates |
| `applyRelationships` | Rebuild passenger and leash references using projected ids |
| `commitDestroyed`, `clear` | Finalize retirement or clear stored state |

`SpoofRegistry.Motion` reports relative movement or teleport movement through `MotionKind`. `SpoofedEntity.updatePosition` and `updateLabelPosition` return movement changes. Rotation, velocity, metadata transform and map update methods report whether output changed.

`SpoofedEntity.create` allocates entity and optional label ids. The state tracks profiles, labels, payload signatures, passengers, leash holder, map content and refresh cooldowns. Use its setters and refresh methods to retain the adapter's last sent state.

`EntityRecovery` coordinates teardown and recovery through a scheduler and a `Teardown` record. `markPending`, `pending`, `recovered`, `clearPending` and `teardown` manage that lifecycle.

## Names and inverted models

`PlayerNaming` selects projected profile names, synthetic names and label text. Profile names have a 16-character limit. Its constructor supplies the neutral name and synthetic profile prefix.

`PlayerNames` retains and releases host team entries. It recognizes `Dinnerbone` and `Grumm` as inverted-model names and supplies label height. `removeTeam` releases output, while `forget` clears retained name state.

`MetadataPatcher.upsideDownPlayer` and `upsideDownEntity` adapt inversion metadata through `MetadataAccess`. `signature` supplies a comparison signature. Exact model appearance depends on the host output and client renderer.

## Item frames and maps

`ItemFrameTransform.of(sourceFacing, transform)` derives the facing/rotation mapping. `spawnData`, `targetFacing`, `transformRotation`, `isReversed` and `anchorInto` supply hanging-entity output values.

`ItemFrameMetadata.transformMetadata` changes item-frame metadata through the host adapter. `mapId` extracts a source map reference.

`MapSnapshot` contains a 128×128 pixel map, source id, scale, tracking and locked state. Scale must be 0..4, and the pixel array must contain 16384 bytes. `encode`/`decode` serialize it, while `mirrorHorizontally` reverses its pixels.

`MapRelay.project` and `send` choose a virtual map id or strip an unusable id. `Options` supplies the source id, metadata transform and force flag. `Projection` reports the replacement id and whether the host must remove the source map reference.

## Streamed entity frames

For the stream path, implement `EntityScenes` and use `EntityFrames`. `EntityFrameTarget` selects portal identity, full/delta output and observer suppression. See [10 - ClientView and Client Geometry](/optics/10-clientview-and-client-geometry#entity-and-environment-frames).

Projected snapshots, fake packet entities and host-native models are separate output choices. An implementation can support one without supporting the others.
