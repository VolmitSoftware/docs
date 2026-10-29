---
title: "Optics Demonstrations"
description: "Run the standalone Optics scene plugin and compare first-person renderer recordings"
published: true
date: 2026-10-29T19:18:51.000Z
tags: "optics, api, demos"
editor: markdown
dateCreated: 2026-10-11T16:20:00.000Z
---

OpticsDemo is a separate Paper plugin that shows a fixed virtual destination through animated Optics apertures. It includes Optics and supports standard Minecraft clients through per-player block packets. With the matching Wormholes client mod, the same scene uses the Crisp renderer and the ClientView stream. Neither path requires a resource pack.

## Install and run

Use Java 25 and Paper for Minecraft 26.2 or 26.3. Build the plugin from the Optics source root:

```sh
./gradlew -p demo build
```

Install `demo/build/libs/OpticsDemo-0.1.0.jar` in the server's `plugins` directory and restart the server. Join with a matching Minecraft client. For Crisp rendering, install the matching Wormholes Fabric client jar; the server needs only OpticsDemo. As an operator, run:

```text
/opticsdemo list
/opticsdemo setup
/opticsdemo play grow-vanish
/opticsdemo stop
```

Setup places you at a fixed first-person viewing position in the demo stage. Your movement and look remain fixed while the session is active. Stop removes the displayed scene and restores your saved player settings and return location. The stage remains available for another session.

## Commands and permissions

| Command | Action |
|---|---|
| `/opticsdemo list` | List scene IDs, durations and descriptions |
| `/opticsdemo setup [player]` | Enter the viewing stage |
| `/opticsdemo preview <scene> [player]` | Hold the scene's first sample |
| `/opticsdemo play <scene> [player]` | Start or restart its animation |
| `/opticsdemo status [player]` | Show scene, progress, completion and selected projection backend |
| `/opticsdemo stop [player]` | Remove the scene and leave the session |

Players need `opticsdemo.use`. Targeting another player also requires `opticsdemo.others`. Both permissions default to operators. The console must name an online target player. Up to four players can have separate sessions.

Playback retains the last frame until stop or another preview or play command. Starting the same camera again keeps its position. The plugin uses the dedicated `optics_demo_stage` world and stores its ownership in the plugin configuration.

## Scene catalog

| Scene ID | Seconds | Visible effect |
|---|---:|---|
| `grow-vanish` | 11 | Small aperture grows, holds, shrinks and disappears |
| `axis-scale` | 14 | Independent width, height and virtual destination depth |
| `continuous-spin` | 16 | Four full rotations with a tip marker |
| `eased-motion` | 12 | Position, rotation and scale interpolation |
| `easing-comparison` | 12 | Linear and smoother-step motion with matched endpoints |
| `keyframe-loop` | 18 | A closed keyframe route repeated three times |
| `boolean-masks` | 16 | Union, intersection, subtraction and a ring hole |
| `shape-morph` | 12 | Continuous interpolation between compatible star shapes |
| `affine-shear` | 12 | Aperture and virtual destination shear |
| `linked-transform` | 10 | Linked destination mapping beside a direct control |
| `mirror-transform` | 10 | Lateral reflection of asymmetric landmarks |
| `masked-crossing` | 12 | Accepted ring crossing and rejected center-hole crossing |

## What the scenes demonstrate

The host samples Optics clips, shapes and transforms. Standard projection maps destination blocks into the source block grid and sends changes only to the viewing player. Its edges and motion follow whole blocks. Details can disappear when a transform makes them thinner than one source block. Crisp uses a geometric aperture with the sampled pose, mask and destination transform over streamed terrain, preserving continuous rotation, independent scaling and shear. Block-aligned portal definitions retain their separate crossing rules.

The reflection scene reverses the virtual view along X. The crossing scene moves markers through the library's exact acceptance and endpoint mapping; it does not teleport the player. Both backends use the same fixed voxel destination. Applications supply live or remote world content through the [world and plate contracts](/optics/07-world-views-and-plates) and the [ClientView stream](/optics/10-clientview-and-client-geometry).

The recordings compare standard block-packet projection with the Wormholes client mod's Crisp renderer on Minecraft 26.2 and 26.3. Select a client tab below. Each clip uses the same fixed first-person camera and virtual destination.

Capture instrumentation keeps each client hidden and records its GPU frames. The standard client has no gameplay or renderer mod. All footage is silent.

## Minecraft 26.2

### Grow vanish

<div class="wormholes-demo" data-demo="grow-vanish-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/grow-vanish-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Grow vanish, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/grow-vanish-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Grow vanish, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Axis scale

<div class="wormholes-demo" data-demo="axis-scale-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/axis-scale-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Axis scale, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/axis-scale-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Axis scale, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Continuous spin

<div class="wormholes-demo" data-demo="continuous-spin-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/continuous-spin-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Continuous spin, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/continuous-spin-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Continuous spin, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Eased motion

<div class="wormholes-demo" data-demo="eased-motion-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/eased-motion-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Eased motion, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/eased-motion-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Eased motion, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Easing comparison

<div class="wormholes-demo" data-demo="easing-comparison-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/easing-comparison-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Easing comparison, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/easing-comparison-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Easing comparison, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Keyframe loop

<div class="wormholes-demo" data-demo="keyframe-loop-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/keyframe-loop-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Keyframe loop, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/keyframe-loop-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Keyframe loop, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Boolean masks

<div class="wormholes-demo" data-demo="boolean-masks-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/boolean-masks-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Boolean masks, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/boolean-masks-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Boolean masks, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Shape morph

<div class="wormholes-demo" data-demo="shape-morph-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/shape-morph-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Shape morph, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/shape-morph-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Shape morph, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Affine shear

<div class="wormholes-demo" data-demo="affine-shear-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/affine-shear-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Affine shear, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/affine-shear-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Affine shear, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Linked transform

<div class="wormholes-demo" data-demo="linked-transform-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/linked-transform-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Linked transform, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/linked-transform-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Linked transform, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Mirror transform

<div class="wormholes-demo" data-demo="mirror-transform-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/mirror-transform-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Mirror transform, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/mirror-transform-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Mirror transform, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

### Masked crossing

<div class="wormholes-demo" data-demo="masked-crossing-26.2" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/masked-crossing-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Masked crossing, Minecraft 26.2, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.2/masked-crossing-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Masked crossing, Minecraft 26.2, Crisp client mod, first person"></video>
</div>
</div>

## Minecraft 26.3

### Grow vanish

<div class="wormholes-demo" data-demo="grow-vanish-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/grow-vanish-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Grow vanish, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/grow-vanish-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Grow vanish, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Axis scale

<div class="wormholes-demo" data-demo="axis-scale-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/axis-scale-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Axis scale, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/axis-scale-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Axis scale, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Continuous spin

<div class="wormholes-demo" data-demo="continuous-spin-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/continuous-spin-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Continuous spin, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/continuous-spin-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Continuous spin, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Eased motion

<div class="wormholes-demo" data-demo="eased-motion-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/eased-motion-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Eased motion, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/eased-motion-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Eased motion, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Easing comparison

<div class="wormholes-demo" data-demo="easing-comparison-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/easing-comparison-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Easing comparison, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/easing-comparison-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Easing comparison, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Keyframe loop

<div class="wormholes-demo" data-demo="keyframe-loop-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/keyframe-loop-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Keyframe loop, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/keyframe-loop-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Keyframe loop, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Boolean masks

<div class="wormholes-demo" data-demo="boolean-masks-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/boolean-masks-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Boolean masks, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/boolean-masks-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Boolean masks, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Shape morph

<div class="wormholes-demo" data-demo="shape-morph-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/shape-morph-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Shape morph, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/shape-morph-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Shape morph, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Affine shear

<div class="wormholes-demo" data-demo="affine-shear-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/affine-shear-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Affine shear, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/affine-shear-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Affine shear, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Linked transform

<div class="wormholes-demo" data-demo="linked-transform-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/linked-transform-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Linked transform, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/linked-transform-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Linked transform, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Mirror transform

<div class="wormholes-demo" data-demo="mirror-transform-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/mirror-transform-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Mirror transform, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/mirror-transform-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Mirror transform, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

### Masked crossing

<div class="wormholes-demo" data-demo="masked-crossing-26.3" data-standard-label="No client mod" data-clientview-label="Crisp client mod" data-tab-label="Renderer for this demonstration">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/masked-crossing-unmodded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Masked crossing, Minecraft 26.3, No client mod, first person"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Crisp client mod</p>
<video src="https://media.volmitsoftware.com/optics-assets/demos/26.3/masked-crossing-modded-pov.webm" controls autoplay muted loop playsinline preload="metadata" aria-label="Masked crossing, Minecraft 26.3, Crisp client mod, first person"></video>
</div>
</div>

## Uninstalling

OpticsDemo keeps its configuration in `plugins/OpticsDemo/` and its stage in the `optics_demo_stage` world. It stores nothing on players, items, or other worlds, and its scene displays are not saved.

1. End every active session with `/opticsdemo stop [player]`. Stopping restores each player's game mode, flight, gravity, invulnerability, time, weather, and location. A session also ends when its player leaves or the server stops.
2. Stop the server and delete the OpticsDemo jar from `plugins/`.
3. Delete `plugins/OpticsDemo/`, which records the stage world it owns.
4. Delete the `optics_demo_stage/` world folder in the server's world container, which is the server folder by default.
5. Players who installed the Wormholes client jar only for Crisp rendering can remove it; see [Uninstalling Wormholes](/wormholes/01-installation-configuration#uninstalling).

> Deleting `optics_demo_stage/` permanently removes the stage world. Back it up first if you changed it.
{.is-warning}

To start fresh, delete `plugins/OpticsDemo/` and `optics_demo_stage/` together while the server is stopped. OpticsDemo refuses to use an existing `optics_demo_stage` folder that its configuration does not record. The next `/opticsdemo setup` creates a new stage.
