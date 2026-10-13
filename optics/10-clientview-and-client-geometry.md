---
title: "ClientView and Client Geometry"
description: "Optics wire protocol, sessions, capabilities, plates, mesh sections and client helpers"
published: true
date: 2026-10-13T16:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-11T16:00:00.000Z
---

ClientView streams portal geometry and captured content to a compatible consumer. Optics supplies protocol values, codecs, sessions and client geometry helpers. The host supplies transport, world capture and rendering.

## Client and renderer requirements

The current wire version is **9**, from `ViewStreamLimits.WIRE_VERSION`. The handshake requires matching wire and Minecraft data versions. A client brand identifies a handshake category, but does not establish renderer compatibility.

An unmodified Minecraft client does not decode ClientView messages. A host can use ordinary server output for blocks, entities or display geometry without this protocol. A compatible client must negotiate capabilities before the host sends their content.

The library does not contain a Minecraft renderer, client mod, shader adapter or live destination level. It supplies data that a host renderer can use. A demonstration of sampled geometry or a virtual scene does not establish arbitrary live-world portal rendering.

## Host platform and options

`ViewStreamPlatform<O, B>` combines the transport, endpoints, entity source, scene source, plate handoffs, lane executor, state-string conversion and Minecraft data version. It also supplies platform capability bits, clock, warnings, extensions and a hooks factory.

| Interface | Host responsibility |
|---|---|
| `ViewStreamTransport<O>` | Send byte payloads and flush output |
| `ViewStreamEndpoints<O, B>` | Capture interested endpoints, geometry, plates, mesh sections and nested contexts |
| `EntityFrameSource<O>` | Capture full/delta entity frames and transient events |
| `ViewStreamScene<O>` | Capture environment, atmosphere, affine samples and optional effect extensions |
| `PlateHandoffs<B>` | Publish local plate offers for a shared-memory consumer |
| `ViewStreamHooksFactory<O, B>` | Create per-session extension hooks |

Entity, scene and handoff interfaces supply `none()` implementations. `ViewStreamHooks.none()` supplies no extension handling. Optional platform providers default to those implementations.

`ViewStreamOptions` controls enabled state, configuration handshake, hello grace, maximum frame bytes, acknowledgement window, brick cache, light, entity frames, zero copy and standby prestream. It also controls statistics, client mirror/recursion, interest grace and withheld capabilities.

Hello grace clamps to 0..5000 milliseconds. Frame size clamps to 64..1024 KiB. The acknowledgement window clamps to 0..255. Interest grace is non-negative, with a default constant of five ticks.

## Handshake

`ViewStreamHandshake.Policy` supplies enabled state, data version, server capabilities, frame size, hello grace, tick rate, acknowledgement window and zero-copy policy. `defaults(dataVersion)` uses the library defaults.

1. Send `Offer` with wire/data versions, capabilities, frame limit and optional local nonce.
2. Build or receive `Hello` with client capabilities, memory budget, brand and nonce echo.
3. Call `onHello(hello, nowMillis, capacityAvailable)`.
4. Send the returned `Accept` or `Decline` when present.

`Accept` contains session id, settled capabilities, tick rate, frame limit, hash salt and acknowledgement window. Decline reasons are wire mismatch, data-version mismatch, disabled state or capacity.

Capabilities are the supported intersection, with extension dependency settlement. Zero copy also requires an exact non-zero nonce echo and an enabled policy.

`brand`, `onPong`, `onDeadline` and `waiting` handle grace and vanilla classification. The states are `INIT`, `OFFERED`, `CLIENT_VIEW`, `VANILLA` and `DECLINED`. A valid late hello can switch a vanilla fallback to ClientView.

## Capabilities

Use `ViewStreamCapability.of`, `intersection`, `decode`, `mask` and `in` to manage negotiated bits.

| Capability | Supported content or behavior |
|---|---|
| `PLATES` | Captured block plates |
| `BRICK_CACHE` | Hash manifests and brick reuse |
| `DEST_LIGHT` | Destination light layers |
| `ENTITY_FRAMES`, `ENTITY_EVENTS` | Persistent entity state and transient animations |
| `ATMOSPHERE` | Destination environment/atmosphere messages |
| `ZERO_COPY` | Same-process plate handoffs after nonce confirmation |
| `CLIENT_RECURSION`, `CLIENT_MIRROR` | Client nested-view and reflection processing |
| `CONFIG_PHASE` | Configuration-phase negotiation |
| `LINK_UNCOMPRESSED` | Uncompressed link support |
| `VIEW_STATS` | Client view-statistics reports |
| `MESH_RENDER` | Section mesh content |
| `LOCAL_MESH` | Client-reported resident-world sections/entities |
| `MESH_REUSE` | Resolved mesh-content reuse |
| `AFFINE_PORTALS` | Sampled affine aperture and destination-view transforms; requires `PLATES` and `MESH_RENDER` |

`AFFINE_PORTALS` is capability bit 16 (`1L << 16`). `ViewStreamCodec.settle` removes it when either `PLATES` or `MESH_RENDER` is missing. `PortalAffine` uses clientbound message id 21.

Bits 32..63 belong to extensions. `extension(index)` selects one of those 32 bits. Do not assume a declared capability is negotiated for a particular session.

## Session lifecycle

`ViewStreamSessionRegistry` owns sessions for observer UUIDs. `open`, `session`, `sessions` and `stats` provide lookup. `forget` and `shutdown` release sessions. Before shutting down an active host, call `runtimeEnabled(false)` to send a `SessionReset(DISABLED)` that removes client projection state, then call `shutdown`. `configure` replaces options, and `runtimeEnabled` controls runtime availability.

A `ViewStreamSession` has a `ViewStreamSessionState`: `VANILLA`, `PENDING` or `CLIENT_VIEW`. `offer(phase)` starts negotiation in `ViewStreamPhase.CONFIGURATION` or `PLAY`. `brand`, `pong`, `expire` and `awaitingHello` expose handshake progress.

| Session method | Use |
|---|---|
| `receive`, `receiveAt` | Decode and admit inbound payloads |
| `tick(serverTick)` | Advance session output and interest |
| `send`, `burst` | Send a negotiated message or effect extension |
| `owns(portal)`, `holdsVanilla` | Report endpoint/session output ownership |
| `caps`, `nativeRendererSelected`, `effectsReceiver` | Inspect the negotiated output path |
| `endpointGeometry`, `hooks` | Read current geometry and extension hooks |
| `reset`, `end` | Reset or close session state with a reason |
| `stats` | Inspect sent bytes, groups, acknowledgements, stale messages and client statistics |

`ViewStreamInbound` reports the admission result. `ViewStreamSessionStats` supplies session and traffic counters plus the last `ViewStats` message.

`awaitHandshake()` blocks until handshake settlement. Do not call it from a game tick, entity callback or region thread that must remain responsive.

## Message reference

`ViewStreamMessage` contains the typed message records. Its `Projection` subtype identifies built-in projection messages, while `Extension` carries host payloads. `ViewStreamMessageType` maps ids to names and directions.

| Direction | Message records | Purpose |
|---|---|---|
| Server to client | `Offer`, `Accept`, `Decline` | Negotiate the session |
| Server to client | `Palette`, `Portal`, `PortalDrop` | Define state ids and revisioned geometry, or retire a portal key |
| Server to client | `PortalAffine` | Update a portal's affine pose, destination mapping and raw shape without replacing its destination mesh |
| Server to client | `PlateBegin`, `PlateBricks`, `PlateEnd` | Transfer a revisioned plate |
| Server to client | `PlatePatch` | Apply full, sparse or clear brick changes |
| Server to client | `PlateHandle` | Reference a local zero-copy plate |
| Server to client | `MeshBegin`, `MeshSection`, `MeshDrop`, `MeshReuse` | Define, update, retire or reuse revisioned mesh sections |
| Server to client | `EntityFrame`, `EntityEvent` | Transfer snapshots/presence and animations |
| Server to client | `Atmosphere`, `Environment` | Transfer time/weather or complete destination environment |
| Server to client | `SessionReset` | Reset negotiated projection state |
| Client to server | `Hello` | Respond to an offer |
| Client to server | `BrickMiss`, `PlateRefused` | Request missing bricks or reject a plate |
| Client to server | `Ack`, `ViewStats` | Acknowledge output and report client measurements |
| Client to server | `MeshAck`, `MeshLocal`, `MeshCached` | Acknowledge sections and report resident/cached content |

`ViewStreamMessage.PatchOp` values are represented by `FullOp`, `SparseOp` and `ClearOp` in `ViewStreamMessage`. A sparse op stores paired cell indices and palette ids. Apply it only to the matching prior revision.

`BrickMiss.Plate` contains portal key, plate revision and a missing-brick bitset. `MeshCoordinate` and `MeshClaim` identify resident sections or content-hash claims. Generation, revision and sequence fields belong to their current context.

`EntityFrame` can update the present-id set independently of its snapshots. `Atmosphere` flags identify time, weather, restore and sky-darkness fields. `Environment` carries the complete `EnvironmentState` value.

## Animated affine views

Negotiate `AFFINE_PORTALS` with `PLATES` and `MESH_RENDER` before sending `PortalAffine(int portalKey, long sampleRevision, Affine apertureToSource, Affine sourceToDestination, ShapeDescriptor shape)`. Publish the portal key before its sample. The constructor requires a positive key, a non-negative revision, non-null transforms/shape, finite matrix components and an absolute determinant of at least `1e-12` for each transform. Hosts assign increasing revisions. Consumers decide whether a sample is stale.

The first matrix places the raw local shape plane in the observer's source world. The second maps source-world points into destination-world coordinates.

Implement `ViewStreamScene.affine(O observer, UUID endpoint, int key, long tick, boolean full)`. The default returns `null`, which emits no affine sample. Return the supplied key and resend current values when `full` requests a complete scene. Automatic affine capture applies to ordinary mesh slots. This interface has no nested-affine capture hook.

The host samples its timelines and sends changed poses or masks. The client does not execute a timeline program. Keep the static portal descriptor and destination mesh generation stable during animation. Position, rotation, independent axis scale, shear and reflection then change the view while retaining its destination terrain. Shape changes update the aperture geometry. Drop a vanished portal instead of sending a singular visible pose.

Affine samples require a consumer that implements the negotiated protocol and a host that supplies matching transport, destination content and rendering. For an unmodified client, the host must provide its own block/entity/display output or another supported fallback.

## Framing, codecs and limits

`ViewStreamCodec` encodes server/client messages and decodes matching payloads. `encodeS2C` accepts sequence, flags and optional deflate. `decodeS2C` returns an `S2CFrame`. `last()` identifies the final frame in a group.

Serverbound headers use one byte. Clientbound headers use six bytes. `ViewStreamReader` and `ViewStreamWriter` supply bounded scalar, string, byte-array, long-array and varint operations. `expectEnd` rejects unread trailing data, and malformed input raises `ViewStreamProtocolException`.

| Limit | Value |
|---|---|
| Default clientbound frame limit | 512 KiB |
| Negotiated clientbound range | 64..1024 KiB |
| Maximum serverbound payload | 32767 bytes |
| Serverbound rate | 512 messages per second |
| Violation window | Three violations within 10000 milliseconds |
| Maximum string | 256 encoded bytes |
| Brick edge/cells | 16 / 4096 |
| Maximum bricks per plate | 65535 |
| Maximum palette size | 1048576 entries |
| Maximum entities per frame | 255 snapshots and 1024 present ids |
| Maximum entity visual payload | 16 KiB |
| Maximum aperture mask | 1024 words |
| Maximum nested geometry entries | 16 |

`ViewStreamLimits` also defines geometry-depth, mirror, brick, light, block-entity, patch and report limits. Codec validation can be stricter than a value constructor. Use the codec instead of writing unchecked payloads.

## Palettes, bricks and plates

`SessionPalette` assigns ids to canonical state strings. Reserved ids are air `0`, occluded `1` and backing `2`. `id`, `lookup`, `state`, `entries` and `size` manage the dictionary.

`SessionPalette.Cursor.pending(referencedIds)` returns definitions not yet sent by that cursor. Send palette definitions before content references. `reset` starts a fresh cursor.

`Brick` stores one section using empty, single-state or local-palette encoding. `BrickCodec.pack`, `unpack` and `unpackInto` convert 4096 palette ids. Codec read/write and body methods serialize the section, with optional light and block entities.

`Brick.withLight`, `withBlockEntities`, `withIndex` and `stripped` return adjusted bricks. `sameCells` and `sameExtras` compare content and additional data separately. `BlockEntityCell` stores a section-local cell index and payload.

`PlateSectionBox.snap` maps cell bounds to section bounds. Its index/coordinate methods resolve a brick's section location. `PlateBegin` carries those bounds, actual cell bounds, backing state and optional brick hashes.

`PlateOffer`, `PlateHandoffs` and `PlateHandoff` describe local shared-memory publication. A handoff expires after 30 seconds. Its handle only has meaning to the host that can resolve it. It is not a remote-network pointer.

## Mesh sections and biomes

`MeshPlan.bounds`, `capacity` and `visible` select mesh sections for geometry and an observer eye. Each `Section` provides distance, clipping bounds and a `Coordinate`.

`ViewStreamEndpoints.meshSection` and `nestedMeshSection` capture section plates. The queued hooks report incomplete capture. `meshChanges` supplies change tracking, while `meshEye`, `nestedEye` and `meshDistanceBlocks` define the section view.

`MeshSection` combines one brick, backing state, coordinates, revision and `SectionBiomes`. `MeshHash.hash` uses a dictionary identity. `MeshHash.resolved` hashes resolved state strings with a supplied epoch for reuse across dictionaries.

`SectionBiomes` stores an optional palette and an 8×8×8 biome grid. Multi-entry palettes use 1024 bytes of little-endian 16-bit indices. `cell(x, y, z)` includes eight blocks of padding around a section. `biome(cell)` resolves a key, and `NONE` identifies unavailable biome content.

`MeshLocal` reports available resident sections and entity ids. `MeshCached` reports hash claims, and `MeshReuse` selects cached content. These reports require their negotiated capability and current generation/sequence.

## Entity and environment frames

`EntityScenes.sceneKey` identifies the captured scene. `capture` returns snapshots, and `visible` applies observer filtering. `projectedId` maps source ids into projected identities.

Implement `isObserver(observer, visual)` to identify the observer's snapshot. `observerVisible(observer, portal)` defaults to false. Return true when the view should include the observer despite `EntityFrameTarget.hideObserver`.

`EntityFrames` creates full/delta frames and tracks presence. It rotates snapshot delivery across eligible entities when a frame reaches its limit, so continuously changing entities do not starve later entries. When a scene disappears, the next frame clears its previous presence, including on a full-frame request. `event` records a transient animation, while `events` returns portal-specific event messages. `forget(observer)` releases retained state. `EntityFrameTarget` supplies portal id/key and full/observer flags.

`EnvironmentState` stores game time, sky, fog, lighting, clouds, display transform, dimension, world context and scale. `Sky` includes skybox, celestial angles, stars, sunrise, moon phase and weather. `Fog` includes land, sky, cloud and water distances/colors.

`Dimension` includes height, skylight, cardinal-lighting policy, horizon and end flashes. `World` includes dimension/biome keys, clock time, sea level, light, logical height, ceiling, ambient light, eye medium and fixed-time state. `Color` and `ColorAlpha` provide bounded channel values.

`withTransform` and `withScale` return adjusted environments. `EnvironmentStateCodec` reads/writes complete environments and rigid transforms. The consumer chooses how its renderer applies this data.

## Geometry metadata and extensions

`ViewStreamEndpoints.geometryMetadata(observer, portalId, context)` runs on the owning host capture context. `GeometryMetadataContext` supplies portal key, aperture geometry and negotiated capabilities.

Capture immutable values there. Return a `GeometryMetadata` callback that builds messages from the wire geometry revision without reading live world or entity state. The session emits these messages after the matching `Portal` descriptor and before its content. The default returns no messages.

`ViewStreamExtension<X>` supplies a message-id range, directions, type, names, codec and capability bits. `requires` describes capability dependencies, `coalesce` can merge payloads, and `wrap` creates a `ViewStreamMessage.Extension`.

`ViewStreamHooks` handles inbound extensions, ticks extension output and receives reset/close callbacks. Check settled capabilities before sending. Unknown or unnegotiated extension support cannot be assumed.

## Client geometry helpers

| API | Consumer task |
|---|---|
| `ClientSweep` | Select cells inside the observer's portal cone and produce entered, exited and reshelled cell lists |
| `ClientCellRules` | Resolve blackout, backing, projected air and keep-real behavior |
| `ClientOverlapResolver` | Select the winning portal for a cell, with incumbent hysteresis |
| `LightSampler` | Supply packed light values from consumer-accessible content |
| `PlateLight` | Fill brick light from a plate/window, with optional full brightness |
| `PlateLight.Cache` | Reuse light sources for plates |

`ClientSweep.sweep` receives eye position and velocity. Inspect `applied`, `shell`, `appliedKeys`, `appliedCount`, `eyeDot` and `eyeFrontSide`. `reconfigure` replaces geometry/bounds, and `clear` releases state. The default hysteresis is 0.25 blocks.

`ClientCellRules.Policy.of(geometry, backingState)` supplies policy values. `evaluate` returns a palette id or `KEEP_REAL = -1`. A shell can use blackout data, occluded/backing values use their configured stand-ins, and shadow air can retain real content.

`ClientOverlapResolver.Contender` carries portal key, plane distance and mask-air status. Non-mask-air output outranks mask air. Distance and portal key resolve remaining priority, while the configured incumbent margin limits displacement.

These helpers produce geometry and decisions. The consumer must apply blocks, manage render objects, restore real content and release per-view state.
