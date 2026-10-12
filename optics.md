---
title: "Optics"
description: "Java reference for portal geometry, masks, animation, projection and ClientView"
published: true
date: 2026-10-12T01:06:17.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

Optics is a Java 25 library for portal geometry, animation and projection. Wormholes includes it in every distribution. Other applications depend on `art.arcane:optics` and supply their own world access, output and rendering.

These pages describe the library API. Library support for an effect does not imply that Wormholes exposes that effect as a setting or command.

| Item | Reference |
|---|---|
| Dependency | `art.arcane:optics:<opticsVersion>` |
| Version | `opticsVersion` in the source repository's `gradle.properties` |
| Platform | Pure Java, with Fastutil and no Minecraft or mod-loader types |
| Source | [VolmitSoftware/Optics](https://github.com/VolmitSoftware/Optics) |

- [00 - Overview *Dependencies, packages and integration boundaries*](/optics/00-overview)
- [01 - Frames and Transforms *Rigid maps, scale, free rotation, affine transforms and camera orientation*](/optics/01-frames-and-transforms)
- [02 - Shapes *Presets, boolean masks, paths, fit, raster, mesh and boundary outputs*](/optics/02-shapes)
- [03 - Animation *Lerp, easing, keyframes, timelines, motion and grow-and-vanish effects*](/optics/03-animation)
- [04 - Portals *Definitions, block-aligned size and rotation, links and registry queries*](/optics/04-portals)
- [05 - Apertures and Crossing *Geometry descriptors, crossing, arrival rules, percentage scale and directional gravity*](/optics/05-apertures-and-crossing)
- [06 - Projection and Visibility *Sampling, view volumes, occlusion, nested views and cadence*](/optics/06-projection-and-visibility)
- [07 - World Views and Plates *World access, section captures, shared plates and overlapping claims*](/optics/07-world-views-and-plates)
- [08 - Entity Projection *Snapshots, movement, metadata, maps, names and relationships*](/optics/08-entity-projection)
- [09 - Fidelity and Block States *Light, biomes, weather, sound, block entities and orientation rules*](/optics/09-fidelity-and-block-states)
- [10 - ClientView and Client Geometry *Handshake, messages, capabilities, streaming and client helpers*](/optics/10-clientview-and-client-geometry)
- [11 - Math and Host Interfaces *Vectors, colors, bounds, packed keys, scheduling, scale and gravity access*](/optics/11-math-and-host-interfaces)
- [12 - Demonstrations *Standalone scene plugin and first-person renderer comparisons*](/optics/12-demonstrations)
{.links-list}
