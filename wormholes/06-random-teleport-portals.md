---
title: "Random Teleport Portals"
description: "RTP type, editor options, safety, and rotation"
published: true
date: 2026-08-21T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

An RTP portal is a frame portal whose type is `RTP`. It samples a safe landing
in a configured world and radius band, then projects and teleports travelers
under rotation, lease, and allocation rules. Configuration lives on the portal
JSON under `rtp` (`RtpSettings`). In game, set Type to RTP, then open
**Random Destination** on the portal home menu.

## Switch type and open the editor

1. Open the portal menu on a constructed portal.
2. Set type to **RTP** (needs management access for that portal and
   `wormholes.portals.portal`).
3. Open **Random Destination** to run `RtpPortalEditor`.

Editor pages: Overview, Destination, Landing, Routing, Effects, numeric entry,
and manual-action confirmation. Overview links to Destination / Landing /
Routing / Effects, **Reset defaults**, and back to the portal menu.

## Settings apply immediately

Editor changes apply immediately on the portal source region. There is no
staged draft or Apply Changes batch. A successful mutation refreshes the menu
with an applied notification. A revision mismatch reloads the live settings.
Manual rerolls, private-pool rebuilds, and Reset defaults need their
confirmation actions.

## Default RtpSettings

Built by `RtpSettings.builder(world)` / `defaults(world)`:

| Field | Default |
|-------|---------|
| Target world | Source portal world |
| Center mode | `PORTAL_RELATIVE` |
| Custom center | none |
| Minimum radius | **512** |
| Maximum radius | **4096** (must be greater than minimum) |
| Vertical mode | `SURFACE` |
| Lower Y | `world.minHeight + 1` |
| Upper Y | `world.maxHeight - 2` |
| Preferred Y | `clamp(seaLevel + 1, lowerY, upperY)` |
| Allocation | `SHARED` |
| Rotation | `ON_TRAVERSAL` |
| Cycle duration | **300000** ms (300 s). Clamp 15 s–86400 s |
| Lease idle | **30000** ms (30 s). Clamp 5 s–600 s |
| Private release | **15000** ms (15 s). Clamp 5 s–300 s |
| Rim enabled | **true** |
| Sound enabled | **true** |
| Target biome | none (any biome) |

## Enums

### Center — `RtpCenterMode`

| Value | Meaning |
|-------|---------|
| `PORTAL_RELATIVE` | Uses the source portal center's numeric X/Z as the annulus origin in the target world. Coordinates are copied unchanged; target spawn and dimensional scaling are not used. |
| `CUSTOM` | Uses stored `customCenterX` / `customCenterZ` as the annulus origin in the target world (both required when CUSTOM). |

### Vertical — `RtpVerticalMode`

| Value | Meaning |
|-------|---------|
| `SURFACE` | Land on validated terrain surface (see safety). |
| `PREFERRED_AVERAGE` | Use preferred Y within lower/upper bounds during sampling. |

### Allocation — `RtpAllocationMode`

| Value | Meaning |
|-------|---------|
| `SHARED` | One active destination shared by the portal's viewers/travelers, plus a distinct prepared standby column. Initial READY requires both. |
| `PER_PLAYER` | Per-player destinations and private reservation pool behavior. |

### Shared rotation — `RtpRotationMode`

These choices apply while allocation is `SHARED`. `PER_PLAYER` always rotates
each private reservation on `cycleDurationMillis`. The editor labels that field
**Private rotation** and hides the shared rotation choices.

| Value | Meaning |
|-------|---------|
| `STATIC` | Destination stays until manually changed or settings force a rebuild. Explicit Static remains static. |
| `TIMED` | Reroll on cycle timer (`cycleDurationMillis`). |
| `ON_TRAVERSAL` | Default. Reroll after successful trip (shared path). |

## Editor surfaces

| Page | Controls |
|------|----------|
| Destination | Paged target world list. Center mode PORTAL_RELATIVE or CUSTOM, with custom X/Z when custom. Min and max radius. Reset center and target to the portal-relative source world. Target Biome opens the biome picker |
| Biome | Paged biome picker for the target world (Iris pack biomes on Iris worlds, vanilla registry biomes otherwise), Any Biome to clear the preference |
| Landing | SURFACE / PREFERRED_AVERAGE, surface policy info, lower/upper/preferred Y |
| Routing | SHARED / PER_PLAYER. Shared STATIC / TIMED / ON_TRAVERSAL choices. Shared timed or private rotation interval. Lease idle. Private release. Manual reroll/pool rebuild |
| Effects | Rim on/off, portal-specific sound on/off |

Numeric fields use decrease/increase steps and optional typed entry. Radii, Y,
timings, and coordinates are clamped by editor and `RtpSettings` limits (radius
max 30_000_000. Cycle/lease/reservation bounds as above).

## Surface safety rules

`RtpSafetyValidator` rejects candidates that fail any of the following:

- Destination world key mismatch with the snapshot world.
- Zero-size entity envelopes, attached entities, vehicles or passengers, and
  envelopes larger than 8 blocks on any axis.
- Feet/body outside world height bounds or world border.
- Nether roof band: envelope top within **5** blocks of the nether logical
  ceiling.
- Missing, invalid, or too many region/chunk snapshots (max **4** chunks,
  **4** regions for the envelope).
- Support block missing, liquid (water/lava/bubble column), a built-in hazard,
  or tree-part support/body when `surfaceMode` is true.
- Body collision with solid collision boxes in the feet-to-top envelope.
- Incomplete support coverage under the footprint (End → `END_VOID`. Otherwise
  `UNSUPPORTED`).

Built-in hazard materials include fire, soul fire, powder snow, cactus, magma,
sweet berry bush, and wither rose. They also include pointed dripstone, cobweb,
nether portal, end portal, end gateway, and lit campfire or lit soul campfire. Surface mode rejects
tree-structure landings. Clear ground under a high canopy can still pass when
support and body checks succeed. Liquids and waterlogged aquatic landings fail.
The Iris integration rejects terrain probes that Iris identifies as fluid and
can reject enforced biome mismatches before a candidate chunk is generated.
Travel uses the same entity envelope that passed validation.

## Target biome

The Destination page's Target Biome control opens a paged biome picker. On an
Iris world the picker lists the pack's reachable biomes by load key. On other
worlds it lists the vanilla biome registry, including datapack biomes. **Any
Biome** clears the preference.

The preference is soft. During a search campaign the first 24 of the 32
candidate attempts require a biome match. Later attempts accept any safe
landing. Every attempt after two consecutive failed campaigns also accepts any
safe landing. A portal whose biome does not exist inside the radius band still
resolves. It does not search forever.

A match compares the stored key against the vanilla biome key at the candidate
column, namespace optional (`swamp` matches `minecraft:swamp`). On Iris worlds
the Iris biome load key and the biome's vanilla derivative both match. The
check runs through the Iris engine before any chunk is loaded. Non-Iris worlds
check the biome after the candidate chunk loads. Surface mode samples the
biome at the surface. `PREFERRED_AVERAGE` samples at the preferred Y, so 3D
cave biomes are targetable. Changing the target biome changes the route
identity: existing destinations are discarded and resampled.

## Sampling and retry limits

Horizontal coordinates are sampled uniformly by area within the configured
annulus, not uniformly by radius. The sampled integer block column is produced
by flooring X/Z, so its block center can differ from a configured radius
boundary by less than one block. Pocket worlds are excluded from the target-world
list. `PREFERRED_AVERAGE` probes the preferred Y first, then alternates upward
and downward inside the bounds. Surface mode uses a separate Nether scan that
avoids the roof band.

Candidate attempts run serially. A search campaign starts at most 32 candidates
and runs for at most 30 seconds. This lets a cold Iris chunk finish generation
instead of discarding it after five seconds and sampling another new chunk. A
timed-out preparation is cancelled and its Wormholes chunk leases are released.
A campaign that cannot publish a safe destination enters exponential retry
backoff, from one second up to 30 seconds. The existing READY view stays
published during refill or authorization work until a replacement can be shown
safely.

During refills, rerolls, and authorization checks, the last READY projection
can stay online until a replacement is published. Idle lease grace
(`leaseIdleMillis`, default 30 s) reduces cold churn when observers briefly
leave the view AABB.

## Runtime behavior notes

- New RTP portals with default rotation **ON_TRAVERSAL** reroll the shared
  destination after a successful trip.
- Shared routing prepares an active destination and a distinct standby. The
  portal becomes READY only when both are retained, allowing a rotation to
  promote the standby without exposing an unprepared route.
- A route edit is not treated as active until its runtime registration succeeds.
  Failed registration stays closed and retries, so the editor cannot show new
  radii while travel continues through an older route.
- Per-player allocation rotates reservations on the cycle duration and uses
  private release timing for reservation teardown. The saved shared rotation
  choice remains available if allocation switches back to SHARED.
- Per-player routing keeps at most 16 prepared or assigned destinations and
  reserves two free spares when capacity permits.
- Rim feedback and portal-specific sounds are independently togglable. Muting
  sounds does not disable particles.
- Rim feedback is yellow while preparing. It is red for closing or a
  two-second failure indication. It is green for ready static/on-traversal
  routes. Timed routes use a green-to-yellow-to-red timer. Per-player routes
  use their actual timed runtime mode for this display.
- Travelers keep look/movement orientation from the side they entered.

## WorldGuard destination access

If WorldGuard is installed and enabled, the RTP service checks the `ENTRY` flag
for that player. The check runs at each prepared destination before Wormholes
publishes or uses it. WorldGuard bypass passes. An entry denial rejects the
destination. If WorldGuard is missing, Wormholes allows the destination. If the
plugin is installed but disabled, or the reflective check fails, Wormholes
reports an RTP integration failure. It does not allow the destination in
silence.

## PlaceholderAPI RTP states

Keys (portal-scoped. See
[12 - PlaceholderAPI](/wormholes/12-placeholderapi)):

| Key | Values |
|-----|--------|
| `%wormholes_rtp.state%` | `rerolling`, `warming`, `ready`, `cooldown`, `idle`. `---` when the portal is not RTP or not registered with RTP runtime |
| `%wormholes_rtp.cooldown%` | Seconds until the next destination search is allowed (two-decimal style numeric). Unavailable when not RTP |

Priority in `WormholesPortalSnapshot.rtpState`:

1. not RTP / not registered → unavailable  
2. `rerolling`  
3. `warming` (searching)  
4. `ready`  
5. `cooldown` if cooldown millis remain, else `idle`

## Cross-references

- Portal types and menus: [04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings)
- Projection of RTP destinations: [05 - Projection Modes & Settings](/wormholes/05-projection-modes-settings)
- Commands: [09 - Commands & Permissions](/wormholes/09-commands-permissions)
- Smoke checklist: [14 - Operator Runbooks & Smoke Tests](/wormholes/14-operator-runbooks-smoke-tests)
