---
title: "Optics"
description: "Portal geometry, shape masks, animation and projection math library"
published: true
date: 2026-10-08T12:00:00.000Z
tags: "optics, api"
editor: markdown
dateCreated: 2026-10-08T12:00:00.000Z
---

Optics is a Java library, not a server plugin. There is no jar to install: Wormholes ships its own copy inside every distribution, and other projects build against the Maven coordinates below.

These pages are for developers building against it.

| | |
|---|---|
| What it is | A pure Java 25 library with no Minecraft, Bukkit or mod-loader types |
| Install | Nothing to install for Wormholes. Other projects depend on `art.arcane:optics` |
| Version | `opticsVersion` in the repository's `gradle.properties` |
| Provides | Portal frames and rigid transforms, affine and quaternion math, aperture shape masks, a sampled animation model, a portal definition and registry API, and the scan, plate, occlusion, entity and view-stream machinery behind Wormholes projection |
| Source | [github.com/VolmitSoftware/Optics](https://github.com/VolmitSoftware/Optics) |

- [Overview *Packages, build, and the rules a consumer can rely on*](/optics/00-overview)
- [Frames and transforms *Frame, OpticTransform, Similarity, Affine, Quaternion, LookTransfer*](/optics/01-frames-and-transforms)
- [Shapes *Unit space, fit modes, presets, text grammar, raster, mesh and outline outputs*](/optics/02-shapes)
- [Animation *Easing, clips, tracks, timelines and the animator*](/optics/03-animation)
- [Portals *Definitions, links, registry and crossing queries*](/optics/04-portals)
{.links-list}
