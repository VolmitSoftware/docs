---
title: "Noise Atlas"
description: "Visual catalog of every Iris noise style, with 2D, 3D, zoom, and octave comparisons"
published: true
date: 2026-09-05T23:22:08.042Z
tags: "iris, noise, generators"
editor: markdown
dateCreated: 2026-09-05T22:50:17.493Z
---
This atlas shows all 186 built-in noise styles sampled directly from Iris. Each diagram uses the same seed and coordinate window. The fifteen pattern styles also have comparisons for height, octave detail, and zoom.

[Download the complete noise atlas (PDF)](/iris-assets/noise/iris-noise-atlas.pdf). The PDF contains all 186 styles in 2D and 3D, plus fifteen pattern comparisons. Style names are searchable.

For configuration fields and complete generator examples, see [Generators, Noise & Expressions](/iris/14-generators-noise).

## Read the diagrams

- Black means 0, white means 1, and gray means an intermediate value. Each panel uses this same range without contrast stretching.
- Every panel covers 384 by 384 blocks in the X/Z plane. Atlas panels use `zoom: 1` and each style's preset octave count.
- The 3D panels use Y=37.25. These are horizontal slices through the field, not terrain screenshots or perspective views.
- The style seed is `1337`, passed directly to the style sampler. A world seed also passes through generation seed derivation and layer salts.
- Samples start at X=-191.875 and Z=-191.625, with 1.5 blocks between pixels. Fine scatter and interpolation can look different at other resolutions.
- These diagrams use Iris 4.1.0-26.2. They show noise values before biome height bands, generator compositing, or block placement.

The common 64-block base scale describes the underlying lattice, carrier, or root shape. Patterns retain different visual wavelengths. `STATIC` remains unscaled scatter, and `FLAT` remains constant.

## Pattern comparisons

Each comparison has four panels: default 2D, a 3D slice, three octaves, and doubled zoom. Larger zoom enlarges the existing features. More octaves overlay smaller features.

### GYROID

Warped ridges trace a maze in 2D. In 3D, they form curved sheets with varying thickness.

![GYROID: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/gyroid-comparison.png)

[Open the GYROID comparison at full size](/iris-assets/noise/gyroid-comparison.png).

### QUASICRYSTAL

Fivefold wave interference produces rosettes and nested contours. Height changes the wave phases and the contour network.

![QUASICRYSTAL: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/quasicrystal-comparison.png)

[Open the QUASICRYSTAL comparison at full size](/iris-assets/noise/quasicrystal-comparison.png).

### TRUCHET

Quarter-circle ribbons join across tiles to form paths and loops. The ribbon field shifts continuously with height.

![TRUCHET: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/truchet-comparison.png)

[Open the TRUCHET comparison at full size](/iris-assets/noise/truchet-comparison.png).

### CRATER

Scattered bowls have raised rims. The 3D field extends these profiles into spherical shells, so slices show different ring sizes and depths.

![CRATER: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/crater-comparison.png)

[Open the CRATER comparison at full size](/iris-assets/noise/crater-comparison.png).

### VORTEX

Spiral eddies overlap around seeded centers. Their arms rotate with height to form winding funnels.

![VORTEX: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/vortex-comparison.png)

[Open the VORTEX comparison at full size](/iris-assets/noise/vortex-comparison.png).

### DUNE

Crescent dunes have long windward slopes and steep lee slopes. Low ripples fill the spaces between dunes.

![DUNE: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/dune-comparison.png)

[Open the DUNE comparison at full size](/iris-assets/noise/dune-comparison.png).

### STRATA

Folded bands suggest layered stone. Broad layers contain finer laminae, and height changes the fold pattern.

![STRATA: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/strata-comparison.png)

[Open the STRATA comparison at full size](/iris-assets/noise/strata-comparison.png).

### WOOD

Elongated rings form knots among directional grain. Height changes the ring positions and grain phase.

![WOOD: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/wood-comparison.png)

[Open the WOOD comparison at full size](/iris-assets/noise/wood-comparison.png).

### GABOR

Compact oriented wave packets form patches of directional ripples. The packets occupy three-dimensional neighborhoods.

![GABOR: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/gabor-comparison.png)

[Open the GABOR comparison at full size](/iris-assets/noise/gabor-comparison.png).

### MARBLE

Narrow dark veins separate smooth stone regions. Coordinate distortion bends the veins through the volume.

![MARBLE: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/marble-comparison.png)

[Open the MARBLE comparison at full size](/iris-assets/noise/marble-comparison.png).

### SCALES

Staggered semicircular grooves form overlapping scales. Seeded shading varies between scales, and height shifts the surface.

![SCALES: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/scales-comparison.png)

[Open the SCALES comparison at full size](/iris-assets/noise/scales-comparison.png).

### CHLADNI

Standing waves form bright nodal lines and plate-like figures. Height changes the balance between the two standing modes.

![CHLADNI: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/chladni-comparison.png)

[Open the CHLADNI comparison at full size](/iris-assets/noise/chladni-comparison.png).

### KALEIDOSCOPE

Mirrored wedges form local rosettes. Each motif fades to zero at its circular boundary and changes with height.

![KALEIDOSCOPE: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/kaleidoscope-comparison.png)

[Open the KALEIDOSCOPE comparison at full size](/iris-assets/noise/kaleidoscope-comparison.png).

### MENGER_SPONGE

Three recursive subdivisions remove cubic voids. Solid regions return 1 and empty regions return 0, with intentionally sharp boundaries.

![MENGER_SPONGE: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/menger_sponge-comparison.png)

[Open the MENGER_SPONGE comparison at full size](/iris-assets/noise/menger_sponge-comparison.png).

### CIRCUIT

Orthogonal tracks connect through tile ports and ring pads. The circuit field shifts continuously with height.

![CIRCUIT: default 2D, 3D at Y=37.25, three octaves, and zoom 2](/iris-assets/noise/circuit-comparison.png)

[Open the CIRCUIT comparison at full size](/iris-assets/noise/circuit-comparison.png).

## All styles

The panels follow the Studio style-list order. Each section shows 2D samples and links to the corresponding 3D sheet. The names below each sheet also support text search.

### Sheet 01

![2D noise samples, sheet 1: STATIC through CLOVER_BILINEAR_STARCAST_6](/iris-assets/noise/atlas-2d-01.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-01.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-01.png)

Styles: `STATIC`, `STATIC_BILINEAR`, `STATIC_BICUBIC`, `STATIC_HERMITE`, `IRIS`, `CLOVER`, `CLOVER_STARCAST_3`, `CLOVER_STARCAST_6`, `CLOVER_STARCAST_9`, `CLOVER_STARCAST_12`, `CLOVER_BILINEAR_STARCAST_3`, `CLOVER_BILINEAR_STARCAST_6`.

### Sheet 02

![2D noise samples, sheet 2: CLOVER_BILINEAR_STARCAST_9 through CELLULAR](/iris-assets/noise/atlas-2d-02.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-02.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-02.png)

Styles: `CLOVER_BILINEAR_STARCAST_9`, `CLOVER_BILINEAR_STARCAST_12`, `CLOVER_HERMITE_STARCAST_3`, `CLOVER_HERMITE_STARCAST_6`, `CLOVER_HERMITE_STARCAST_9`, `CLOVER_HERMITE_STARCAST_12`, `CLOVER_BILINEAR`, `CLOVER_BICUBIC`, `CLOVER_HERMITE`, `VASCULAR`, `FLAT`, `CELLULAR`.

### Sheet 03

![2D noise samples, sheet 3: CELLULAR_STARCAST_3 through CELLULAR_HERMITE_STARCAST_12](/iris-assets/noise/atlas-2d-03.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-03.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-03.png)

Styles: `CELLULAR_STARCAST_3`, `CELLULAR_STARCAST_6`, `CELLULAR_STARCAST_9`, `CELLULAR_STARCAST_12`, `CELLULAR_BILINEAR_STARCAST_3`, `CELLULAR_BILINEAR_STARCAST_6`, `CELLULAR_BILINEAR_STARCAST_9`, `CELLULAR_BILINEAR_STARCAST_12`, `CELLULAR_HERMITE_STARCAST_3`, `CELLULAR_HERMITE_STARCAST_6`, `CELLULAR_HERMITE_STARCAST_9`, `CELLULAR_HERMITE_STARCAST_12`.

### Sheet 04

![2D noise samples, sheet 4: CELLULAR_BILINEAR through NOWHERE_HEXAGON](/iris-assets/noise/atlas-2d-04.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-04.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-04.png)

Styles: `CELLULAR_BILINEAR`, `CELLULAR_BICUBIC`, `CELLULAR_HERMITE`, `HEXAGON`, `HEX_JAMES`, `HEX_SIMPLEX`, `HEX_RANDOM_SIZE`, `SIERPINSKI_TRIANGLE`, `NOWHERE`, `NOWHERE_CELLULAR`, `NOWHERE_CLOVER`, `NOWHERE_HEXAGON`.

### Sheet 05

![2D noise samples, sheet 5: NOWHERE_HEX_JAMES through IRIS_THICK](/iris-assets/noise/atlas-2d-05.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-05.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-05.png)

Styles: `NOWHERE_HEX_JAMES`, `NOWHERE_HEX_SIMPLEX`, `NOWHERE_HEX_RANDOM_SIZE`, `NOWHERE_SIERPINSKI_TRIANGLE`, `NOWHERE_SIMPLEX`, `NOWHERE_GLOB`, `NOWHERE_VASCULAR`, `NOWHERE_CUBIC`, `NOWHERE_SUPERFRACTAL`, `NOWHERE_FRACTAL`, `IRIS_DOUBLE`, `IRIS_THICK`.

### Sheet 06

![2D noise samples, sheet 6: IRIS_HALF through PERLIN_IRIS_THICK](/iris-assets/noise/atlas-2d-06.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-06.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-06.png)

Styles: `IRIS_HALF`, `SIMPLEX`, `FRACTAL_SMOKE`, `VASCULAR_THIN`, `SIMPLEX_CELLS`, `SIMPLEX_VASCULAR`, `FRACTAL_WATER`, `PERLIN`, `PERLIN_IRIS`, `PERLIN_IRIS_HALF`, `PERLIN_IRIS_DOUBLE`, `PERLIN_IRIS_THICK`.

### Sheet 07

![2D noise samples, sheet 7: FRACTAL_BILLOW_PERLIN through FRACTAL_HEX_JAMES](/iris-assets/noise/atlas-2d-07.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-07.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-07.png)

Styles: `FRACTAL_BILLOW_PERLIN`, `BIOCTAVE_FRACTAL_BILLOW_PERLIN`, `FRACTAL_BILLOW_SIMPLEX`, `FRACTAL_FBM_SIMPLEX`, `FRACTAL_BILLOW_IRIS`, `FRACTAL_FBM_IRIS`, `FRACTAL_BILLOW_IRIS_HALF`, `FRACTAL_FBM_IRIS_HALF`, `FRACTAL_BILLOW_IRIS_THICK`, `FRACTAL_FBM_IRIS_THICK`, `FRACTAL_HEXAGON`, `FRACTAL_HEX_JAMES`.

### Sheet 08

![2D noise samples, sheet 8: FRACTAL_HEX_SIMPLEX through QUADOCTAVE_FRACTAL_BILLOW_SIMPLEX](/iris-assets/noise/atlas-2d-08.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-08.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-08.png)

Styles: `FRACTAL_HEX_SIMPLEX`, `FRACTAL_HEX_RANDOM_SIZE`, `FRACTAL_SIERPINSKI_TRIANGLE`, `FRACTAL_RM_SIMPLEX`, `BIOCTAVE_FRACTAL_BILLOW_SIMPLEX`, `BIOCTAVE_FRACTAL_FBM_SIMPLEX`, `BIOCTAVE_FRACTAL_RM_SIMPLEX`, `TRIOCTAVE_FRACTAL_RM_SIMPLEX`, `TRIOCTAVE_FRACTAL_BILLOW_SIMPLEX`, `TRIOCTAVE_FRACTAL_FBM_SIMPLEX`, `QUADOCTAVE_FRACTAL_RM_SIMPLEX`, `QUADOCTAVE_FRACTAL_BILLOW_SIMPLEX`.

### Sheet 09

![2D noise samples, sheet 9: QUADOCTAVE_FRACTAL_FBM_SIMPLEX through OCTOCTAVE_FRACTAL_BILLOW_SIMPLEX](/iris-assets/noise/atlas-2d-09.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-09.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-09.png)

Styles: `QUADOCTAVE_FRACTAL_FBM_SIMPLEX`, `QUINTOCTAVE_FRACTAL_RM_SIMPLEX`, `QUINTOCTAVE_FRACTAL_BILLOW_SIMPLEX`, `QUINTOCTAVE_FRACTAL_FBM_SIMPLEX`, `SEXOCTAVE_FRACTAL_RM_SIMPLEX`, `SEXOCTAVE_FRACTAL_BILLOW_SIMPLEX`, `SEXOCTAVE_FRACTAL_FBM_SIMPLEX`, `SEPTOCTAVE_FRACTAL_RM_SIMPLEX`, `SEPTOCTAVE_FRACTAL_BILLOW_SIMPLEX`, `SEPTOCTAVE_FRACTAL_FBM_SIMPLEX`, `OCTOCTAVE_FRACTAL_RM_SIMPLEX`, `OCTOCTAVE_FRACTAL_BILLOW_SIMPLEX`.

### Sheet 10

![2D noise samples, sheet 10: OCTOCTAVE_FRACTAL_FBM_SIMPLEX through SEXOCTAVE_SIMPLEX](/iris-assets/noise/atlas-2d-10.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-10.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-10.png)

Styles: `OCTOCTAVE_FRACTAL_FBM_SIMPLEX`, `NONOCTAVE_FRACTAL_RM_SIMPLEX`, `NONOCTAVE_FRACTAL_BILLOW_SIMPLEX`, `NONOCTAVE_FRACTAL_FBM_SIMPLEX`, `VIGOCTAVE_FRACTAL_RM_SIMPLEX`, `VIGOCTAVE_FRACTAL_BILLOW_SIMPLEX`, `VIGOCTAVE_FRACTAL_FBM_SIMPLEX`, `BIOCTAVE_SIMPLEX`, `TRIOCTAVE_SIMPLEX`, `QUADOCTAVE_SIMPLEX`, `QUINTOCTAVE_SIMPLEX`, `SEXOCTAVE_SIMPLEX`.

### Sheet 11

![2D noise samples, sheet 11: SEPTOCTAVE_SIMPLEX through FRACTAL_CUBIC_IRIS](/iris-assets/noise/atlas-2d-11.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-11.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-11.png)

Styles: `SEPTOCTAVE_SIMPLEX`, `OCTOCTAVE_SIMPLEX`, `NONOCTAVE_SIMPLEX`, `VIGOCTAVE_SIMPLEX`, `GLOB`, `GLOB_IRIS`, `GLOB_IRIS_HALF`, `GLOB_IRIS_DOUBLE`, `GLOB_IRIS_THICK`, `CUBIC`, `FRACTAL_CUBIC`, `FRACTAL_CUBIC_IRIS`.

### Sheet 12

![2D noise samples, sheet 12: FRACTAL_CUBIC_IRIS_THICK through HEXAGON_IRIS_DOUBLE](/iris-assets/noise/atlas-2d-12.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-12.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-12.png)

Styles: `FRACTAL_CUBIC_IRIS_THICK`, `FRACTAL_CUBIC_IRIS_HALF`, `FRACTAL_CUBIC_IRIS_DOUBLE`, `BIOCTAVE_FRACTAL_CUBIC`, `TRIOCTAVE_FRACTAL_CUBIC`, `QUADOCTAVE_FRACTAL_CUBIC`, `CUBIC_IRIS`, `CUBIC_IRIS_HALF`, `CUBIC_IRIS_DOUBLE`, `CUBIC_IRIS_THICK`, `HEXAGON_IRIS`, `HEXAGON_IRIS_DOUBLE`.

### Sheet 13

![2D noise samples, sheet 13: HEXAGON_IRIS_THICK through HEX_RANDOM_SIZE_IRIS_DOUBLE](/iris-assets/noise/atlas-2d-13.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-13.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-13.png)

Styles: `HEXAGON_IRIS_THICK`, `HEXAGON_IRIS_HALF`, `HEX_JAMES_IRIS`, `HEX_JAMES_IRIS_DOUBLE`, `HEX_JAMES_IRIS_THICK`, `HEX_JAMES_IRIS_HALF`, `HEX_SIMPLEX_IRIS`, `HEX_SIMPLEX_IRIS_DOUBLE`, `HEX_SIMPLEX_IRIS_THICK`, `HEX_SIMPLEX_IRIS_HALF`, `HEX_RANDOM_SIZE_IRIS`, `HEX_RANDOM_SIZE_IRIS_DOUBLE`.

### Sheet 14

![2D noise samples, sheet 14: HEX_RANDOM_SIZE_IRIS_THICK through VASCULAR_IRIS](/iris-assets/noise/atlas-2d-14.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-14.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-14.png)

Styles: `HEX_RANDOM_SIZE_IRIS_THICK`, `HEX_RANDOM_SIZE_IRIS_HALF`, `CELLULAR_IRIS`, `CELLULAR_IRIS_THICK`, `CELLULAR_IRIS_DOUBLE`, `CELLULAR_IRIS_HALF`, `CELLULAR_HEIGHT`, `CELLULAR_HEIGHT_IRIS`, `CELLULAR_HEIGHT_IRIS_DOUBLE`, `CELLULAR_HEIGHT_IRIS_THICK`, `CELLULAR_HEIGHT_IRIS_HALF`, `VASCULAR_IRIS`.

### Sheet 15

![2D noise samples, sheet 15: VASCULAR_IRIS_DOUBLE through GABOR](/iris-assets/noise/atlas-2d-15.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-15.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-15.png)

Styles: `VASCULAR_IRIS_DOUBLE`, `VASCULAR_IRIS_THICK`, `VASCULAR_IRIS_HALF`, `GYROID`, `QUASICRYSTAL`, `TRUCHET`, `CRATER`, `VORTEX`, `DUNE`, `STRATA`, `WOOD`, `GABOR`.

### Sheet 16

![2D noise samples, sheet 16: MARBLE through CIRCUIT](/iris-assets/noise/atlas-2d-16.png)

[Open 2D at full size](/iris-assets/noise/atlas-2d-16.png) · [Open the matching 3D slice](/iris-assets/noise/atlas-3d-16.png)

Styles: `MARBLE`, `SCALES`, `CHLADNI`, `KALEIDOSCOPE`, `MENGER_SPONGE`, `CIRCUIT`.

