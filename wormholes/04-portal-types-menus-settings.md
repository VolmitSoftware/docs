---
title: "Portal Types, Menus, and Settings"
description: "Types, menus, travel, access, costs, and cosmetics"
published: true
date: 2026-10-08T12:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Each frame portal has menus for type, orientation, destination, settings, cost, and appearance. The defaults below apply to a new portal. Nearby portal discoveries are recorded without a chat message. Rules: [Concepts](/wormholes/02-concepts). Construction: [Building portals](/wormholes/03-building-portals).

## Default settings

| Setting | Default | Notes |
|---------|---------|-------|
| `projectionMode` | `ON` | Toggle on home menu |
| `renderMode` | `VENTICULAR` | PanOptic / Venticular cycle |
| `mirrorMode` | `false` | Set from type menu |
| `mirrorRotation` | `0°` | Floor and ceiling mirrors: 90° steps. Wall mirrors: 0° / 180° for every player, including the client mod |
| `permissionMode` | `BLACKLIST` | See Access |
| `outgoingTraversalsEnabled` | `true` | Travel mode `BOTH` |
| `incomingTraversalsEnabled` | `true` | Travel mode `BOTH` |
| Network view quality | `STANDARD` | Depth 64, heartbeat 60, entity interval 10, grace 30s |
| `networkViewLateralPad` | `48` | Clamped 0–64 (not in preset table. Persists) |
| `networkViewFallbackBlock` | `minecraft:air` | Invalid chat input resets to air |
| `blackoutBackground` | `false` | |
| `blackoutColor` | `BLACK` | Concrete color enum |
| `activationRange` | `0` | `0` = use global `Settings.PROJECTION_RANGE` (default 48) |
| `ambientStyle` | `SPARKS` | `SPARKS` / `OUTLINE` / `CORNERS` / `OFF` |
| `ambientColor` | `0xB969FF` | RGB 0–0xFFFFFF |
| `surfaceSkin` | empty | No skin |
| `apertureShape` | `full` | Settings menu **Aperture shape**. Never copied by Settings sync |
| Traveller scale | `off`, range `0.25`–`4` | Transit menu. Never copied by Settings sync |
| `publicLookLabel` | `false` | Off keeps look subtitles portal-tool only |
| `travelCost` | free (`null`) | Free / vanilla item / Vault |
| `settingsSyncEnabled` | `true` | Broadcast settings to linked/remote when applicable |

### Network view quality presets

Cycle order: Standard → Performance → Balanced → Cinematic → Custom → Standard.

| Preset | Depth | Heartbeat (ticks) | Entity interval (ticks) | Unsubscribe grace (s) |
|--------|-------|-------------------|-------------------------|------------------------|
| `STANDARD` | 64 | 60 | 10 | 30 |
| `PERFORMANCE` | 32 | 100 | 20 | 10 |
| `BALANCED` | 64 | 40 | 5 | 30 |
| `CINEMATIC` | 96 | 20 | 2 | 45 |
| `CUSTOM` | operator-set | operator-set | operator-set | operator-set |

Custom clamps when you edit numbers: depth 1–128, heartbeat 2–600, entity
interval 2–600, grace 5–600. Menu step controls use smaller UI steps (for
example depth ±4/±16).

If you select a non-custom preset, Wormholes overwrites depth, heartbeat,
entity interval, and grace to that preset. Values that match no preset resolve
as `CUSTOM` on load.

### Activation range

- `0` means the global projection range from config (`projection.range`, default 48
  blocks).
- Positive values are clamped to **8–256** blocks.

### Settings sync

Settings Sync copies supported changes to linked local portals and gateways. When disabled, edits stay local. `publicLookLabel`, the aperture shape, and the Transit menu's traveller scale are never copied.

## Per-portal permission node

Node: `wormholes.portal.<key>`. The access key starts from the sanitized portal name and remains stable when the portal is renamed. Set it with `/wh access key <portal> <key>` or the Access menu. With `[access] legacy-name-node-enabled = true` (default), the current name-derived node is also accepted as an alias.

The key is the portal name lowercased, with anything outside `a-z`, `0-9`, `.`, `-` and `_`
replaced by an underscore. An empty result becomes `unnamed`.

| Mode | Effect without OP or `*` bypass |
|------|---------------------------|
| `BLACKLIST` | Holding the node **blocks** use |
| `WHITELIST` | Holding the node **allows** use |

When the name alias is enabled, either node counts. A scoped wildcard grant that matches the node can block an ordinary player in `BLACKLIST` mode. The literal `*` permission bypasses this check. Public portals normally use `BLACKLIST` without granting the matching nodes to ordinary travelers. Restricted portals use `WHITELIST` with explicit grants. Check effective permissions on both backends for cross-server travel.

Access roles and groups add another gate. A `DENIED` role refuses the player. Adding a trusted player role makes the role list a whitelist. Trusted players, the owner, and players with an allowed group node pass that gate. These access grants also satisfy the frame permission gate. Direction checks still apply. Land-claim and integration checks can also reject travel.

OP players and holders of the literal `*` permission bypass portal roles, permission mode, and outgoing/incoming direction restrictions. A gateway carries source-side privilege for that crossing, even when the destination grants neither OP nor `*`. It does not change destination permissions. The return trip uses permissions on the server the player leaves. Mirror mode remains travel locked. Portal topology, cooldowns, RTP safety, configured travel costs, and
external integration decisions are not bypassed. Cycle permission mode in
Settings. The whitelist/blacklist node is **players only**. Non-player entities
always pass the portal permission check.

## Home menu

Open the home menu with a wand look-click, or sneak and right-click the frame
with an empty hand
([03 - Building Portals](/wormholes/03-building-portals)). You must be owner
or admin.

| Control | Action |
|---------|--------|
| Placard | Name, type/mode, facing, destination or RTP summary |
| Destination | Local destination list. Gateway pair submenu. Or RTP editor when type is RTP |
| Rename Portal | Chat name prompt |
| Projection | Cycle `ON` / `OFF` |
| Settings | Opens settings menu |
| Orientation | Facing / flip / rotate submenu |
| Mode | Type and mirror submenu |
| Delete Portal | **Shift-left-click** to destroy the portal |

Managed dimensional portals refuse destination and type changes with managed
notices.

## Destination menu

<div class="wormholes-demo" data-demo="portal-linking">
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/portal-linking-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/portal-linking-standard-observer.webm" aria-label="No client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/portal-linking-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/portal-linking-clientview-observer.webm" aria-label="Client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

To connect two framed portals, build both openings first. You must be able to manage both portals to create the return link with **Link and return**.

1. Aim at the first portal with the Portal Wand and click to open its home menu. Select **Rename Portal** and enter a name such as `Garden Arch` in chat. Name the second portal `Sun Court` in the same way.
2. At Garden Arch, open **Destination** and left-click **Sun Court**. Garden Arch now points to Sun Court.
3. Reopen Garden Arch's **Destination** menu and choose **Link and return**. Sun Court now points back to Garden Arch, creating a reciprocal pair.
4. Close the menu and look through Garden Arch. With **Projection** set to `ON` and the surface clear, the opening shows the scene at Sun Court. Walk through the opening, turn around at the destination, and walk back through its portal to return.

The recordings show a deepslate frame in a garden connected to a sandstone frame in a courtyard elsewhere in the same world. The **No client mod** view uses standard projection; the **Client mod** view uses [ClientView](/wormholes/05-projection-modes-settings#clientview).

Blocked for RTP, mirror mode, and managed dimensional portals.

The list is paged: 45 destinations per page across five rows. The bottom row
holds a Sort button and a page indicator with the total destination count.
Previous Page and Next Page arrows appear only when another page exists.
Left-clicking Sort cycles the ordering:

| Sort mode | Order |
|-----------|-------|
| Smart | Linked destination first, then locals by distance, then remote gateways (open first) |
| Name | Portal name A-Z |
| World | World or server name, then portal name |
| Distance | Nearest first. Remote and cross-world entries sort last |

Smart is the default. Sort mode and page reset each time the menu opens.

**Non-gateway:** lists other non-gateway local portals that are generic
destinations, in any loaded world. Left-click links or unlinks this portal
only.

**Gateway:** lists other local gateways in any loaded world, then remote
gateway entries (server name, coords, open/closed). Gateway home destination
control opens a pair menu:

| Pair control | Action |
|--------------|--------|
| Export | Print invite/export code to chat |
| Choose destination | Open destination list (local gateways + remotes) |
| Import | Chat prompt for peer invite code |

Same-world links store `LOCAL`. Cross-world same-server links store
`DIMENSIONAL`. Remotes store `UNIVERSAL`. Ordinary destination selection is one-way: A→B does not create B→A. Select a return destination at B separately, or use **Link and return** at A after selecting a local destination. That control appears only when you own both portals or have administrator access to both. Deleting one end of a reciprocal pair clears its paired return link.

Cross-server handoff detail:
[10 - Cross-Server Networking](/wormholes/10-cross-server-networking).

Linked frame arrivals preserve the traveler's position relative to the portal, including movement beyond the plane during the crossing. Position and velocity rotate with the linked frames. The configured momentum policy controls outgoing velocity, including very slow movement.

Crossing is tested against the whole movement since the last check. Teleports, reconnects, respawns, and destination changes reset that history.

## Type menu

<div class="wormholes-demo" data-demo="mirrors">
<p><strong>Mirrors</strong> Reflect the player and rotate the reflected image.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/mirrors-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/mirrors-standard-observer.webm" aria-label="No client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/mirrors-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/mirrors-clientview-observer.webm" aria-label="Client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

<div class="wormholes-demo" data-demo="gateways">
<p><strong>Travel between worlds</strong> View and enter a gateway to another world.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/gateways-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/gateways-standard-observer.webm" aria-label="No client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/gateways-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/gateways-clientview-observer.webm" aria-label="Client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

Options: `PORTAL`, `WORMHOLE`, `GATEWAY`, `RTP`, and **Mirror**.

| Choice | Effect |
|--------|--------|
| Portal / Wormhole / Gateway / RTP | Sets type and disables mirror mode if it was on. Switching to or from `RTP` force-closes the portal until RTP is READY or a new tunnel is set. |
| Mirror | Enables mirror mode (travel locked. Tunnel cleared). Right-click rotates the mirror image clockwise. Shift-right-click rotates counterclockwise. |

Floor and ceiling mirrors rotate in 90° steps. Wall mirrors switch between 0° and 180° for every player, including players running the client mod. These controls rotate the reflected image; they do not change the portal's facing or allow travel through a mirror.

RTP editor entry lives on the home destination control when type is RTP
([06 - Random Teleport Portals](/wormholes/06-random-teleport-portals)).

Menu descriptions (localized): Portal = basic linkable. Wormhole = linkable
with viewport projection. Gateway = cross-network. RTP = local random teleport.
Mirror = reflect local world with travel locked. Runtime projection capability
is still ON/OFF for all types
([02 - Concepts](/wormholes/02-concepts)).

## Settings menu

| Control | Behavior |
|---------|----------|
| Permission mode | Cycle blacklist/whitelist. Shows node |
| Travel direction | Cycle BOTH / OUTBOUND / INBOUND / LOCKED (disabled under mirror / managed) |
| Stream quality | Cycle network view presets. Shift-left opens advanced layout with custom numbers |
| Settings sync | Toggle on/off |
| Blackout | Left toggles background. Right opens color picker (16 concrete colors) |
| Ambient particles | Left cycles style. Right opens RGB/dye color menu |
| Surface skin | Menu control for skin display/clear (in-world apply in `03`) |
| Aperture shape | Left cycles the presets, right rotates the shape 45°, shift-right resets to `full`. See [Aperture shape](#aperture-shape) |
| Activation range | ±8 / ±32 steps. Below 8 snaps to global (`0`) |
| Render mode | Cycle PanOptic / Venticular |
| Public look label | Toggle whether nearby players without a portal tool see this portal's name while looking at it. Off by default |
| Travel cost | Opens cost menu |
| Fallback block | Chat block-state string (custom quality layout / advanced) |
| More settings | Opens Access, Fidelity, Transit, Network, and other available portal controls |

Select More settings, then Access, to edit player roles, allowed groups, the stable permission key, and public-directory visibility.

Custom quality expands the window to show depth, full-refresh ticks, entity
interval, and view grace editors.

Portal-tool holders always retain the route subtitle, including the linked
destination or active progress text. A player without a portal tool sees only
the portal name, and only when Public Look Label is On.

## Aperture shape

The aperture shape is the outline of the opening inside the built frame. A new portal uses `full`, the whole rectangle of built cells. Any other shape is fitted to that rectangle, scaled to its shorter side and centred, and masks it: only cells at least half inside the shape stay open. The built cells themselves are kept, so `full` restores the original opening at any time. A shape that would leave no cell open is refused; the menu shows the refused shape under the control and the command reports it.

The **Aperture shape** control in the Settings menu cycles the presets `full`, `circle`, `rounded`, `polygon` (a hexagon), `star`, `flower`, `heart`, `feather`, and `ring` on left-click, rotates the current shape by 45° on right-click, and resets to `full` on shift-right-click. Its lore shows the current shape text and the number of open cells. Any shape the text grammar can express, including custom polygons, splines, paths, and boolean combinations, is set with `/wormholes admin portals shape`; see [Aperture shape text](/wormholes/09-commands-permissions#aperture-shape-text) and the [shape grammar](/optics/02-shapes#text-grammar). The stored text is canonical, for example `circle(radius=1)`.

Travel is judged against the exact shape on every platform, not the cell approximation: a wall portal tests the traveller's eye position, a floor or ceiling portal tests the crossing point. Players with the client mod see the destination clipped to the shape with a smooth edge; standard projection and vanilla clients see the open cells. See [Shaped apertures](/wormholes/05-projection-modes-settings#shaped-apertures). The `OUTLINE` ambient style traces the shape. The shape is stored per portal, turns with the frame when the frame is rotated or flipped, and is never copied to linked portals by Settings sync. It is distinct from the [Shaped Portals](/shapedportals) integration, which supplies irregular built openings for vanilla Nether portals; an aperture shape masks a Wormholes frame however it was built.

## Fidelity menu

Open **Settings → More settings → Fidelity** to change this portal's projection. Left-click a control to cycle its value; shift-left-click restores the server default.

| Control | Choices and effect |
|---------|--------------------|
| Atmosphere | `off`, `tint`, `tint_light`, `full`. Adds destination biome colors, lighting, and weather according to the enabled server channels. See [Destination colors and lighting](/wormholes/05-projection-modes-settings#optional-destination-colors-and-lighting). |
| Acoustics | `off` disables relayed sounds; `ambient` admits ambient sounds; `ambient_events` adds world-event sounds; `full` also admits entity sounds. |
| Detail | `near`, `balanced`, `far`. Selects the distance profile for projection detail. |
| Block entities | Toggles supported block-entity contents in the projected view. |

## Transit menu

<div class="wormholes-demo" data-demo="arrival-orientation">
<p><strong>Arrival orientation</strong> Compare frame, look, snap, and mirror policies at a rotated exit.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/arrival-orientation-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/arrival-orientation-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

<div class="wormholes-demo" data-demo="momentum">
<p><strong>Traversal momentum</strong> Compare preserved, scaled, and zero velocity on arrival.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/momentum-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/momentum-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

<div class="wormholes-demo" data-demo="membrane-bounce">
<p><strong>Membrane and bounce</strong> Pass through the permitted face, then compare rejected entry and bounce.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/membrane-bounce-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/membrane-bounce-standard-observer.webm" aria-label="No client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/membrane-bounce-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/membrane-bounce-clientview-observer.webm" aria-label="Client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

Open **Settings → More settings → Transit** to control movement through this portal and arrival effects. These settings apply when traveling; the separate [Orientation menu](/wormholes/04-portal-types-menus-settings#orientation-menu) changes the portal frame itself.

**Momentum** cycles through `preserve`, `scale`, `clamp`, `zero`, and `impulse`. Right-click opens a chat prompt for the scale factor, from 0 to 10.

| Mode | Exit movement |
|------|---------------|
| `preserve` | Keeps entry velocity after rotating it through the linked frames. |
| `scale` | Multiplies that velocity by the factor, subject to the configured speed ceiling. |
| `clamp` | Limits that velocity to the configured speed ceiling. |
| `zero` | Clears exit velocity. |
| `impulse` | Adds the configured impulse vector. The menu does not edit that vector. |

**Orientation** cycles the direction a traveler faces on arrival:

| Mode | Arrival view |
|------|--------------|
| `frame` | Carries the full look through the linked frames: yaw and pitch, and the body and head facing of players and entities. Looking straight down into a floor portal whose exit faces up arrives looking straight up; a floor portal exiting through a wall arrives level, facing out of the exit. |
| `look` | Preserves the traveler's absolute look direction. |
| `snap` | Faces straight out of the exit. |
| `mirror` | Reflects the frame-transformed look across the exit plane, facing back toward the portal. |

All four modes apply on teleport, prepared, and seamless crossings. With `[transit] gravity-flip-enabled = true` (default `false`), `frame`, `snap`, and `mirror` arrivals through an exit that points up or down are turned upright, forward and screen-up together; `look` ignores the flip. A pair whose frames are twisted relative to each other leaves a camera tilt on arrival, which the client mod eases back to level over `camera-roll-ease-seconds` (default `0.35`). See [`[transit]`](/wormholes/01-installation-configuration#transit) and the [client mod](/wormholes/01-installation-configuration#client-mod) settings.

**Traveller scale** maps travel between portals of different sizes. The rule of the portal a traveller enters applies, so set it on both ends of a pair that should work in both directions; Settings sync never copies it. Left-click cycles the mode, right-click opens a chat prompt for the minimum size factor, and shift-right-click one for the maximum (defaults `0.25` and `4`, kept within `0.0625`–`16`).

| Mode | Effect on arrival |
|------|-------------------|
| `off` | 1:1. Position and velocity carry over unscaled. Default. |
| `motion` | Position and velocity are multiplied by the pair's size ratio: a 3×3 portal into a 9×9 is ×3, and the way back is ×1/3. The traveller's size is unchanged. |
| `ratio` | As `motion`, and the traveller's size is multiplied by the ratio as well, through a `wormholes:portal_scale` modifier on the scale attribute, clamped to the minimum and maximum. Crossing back through a pair that uses `ratio` at both ends restores the original size. |

Random teleport portals and cross-server gateways, including Nexus members on other servers, never scale. A `ratio` rule on a fall loop between two portals compounds on every pass until it reaches the clamp; use `off` or `motion` for loops. Players with the client mod see a scaled pair's destination at the matching scale, while standard projection stays a 1:1 window. `/wormholes admin portals scale` sets the rule by command and `/wormholes admin scale reset` restores entities that kept a portal scale; see [Commands & Permissions](/wormholes/09-commands-permissions).

**Membrane** permits entry from the front and pushes travelers away from the back. **Bounce** pushes travelers back instead of transporting them, from either side. Left-click either control to toggle it.

**Transition cues** accepts a threshold particle key on left-click and an arrival sound key on right-click, entered in chat. An empty value, `-`, `none`, or `default` restores the default cue. Shift-left-click sets arrival-mask duration from 0 to 200 ticks; an empty value or `-1` restores the default duration. With the client mod, [seamless crossings and ready prepared arrivals](/wormholes/05-projection-modes-settings#travel-with-the-client-mod) skip these travel cues and the mask for the traveler; bystanders keep the normal effects.

## Travel cost menu

| Mode | How to set | Requirement |
|------|------------|-------------|
| Free | Select free | Default |
| Vanilla item | Capture held item template. Set quantity | Quantity adjustable ±1 / ±8 |
| Vault | Chat amount | Soft-depend Vault economy available |

Invalid stored travel cost loads as free and logs a warning. Third-party
`TraversalCostProvider` is separate
([21 - API - Traversal Cost & Events](/wormholes/21-api-traversal-cost-events))
and gated by `[main] traversal-api-enabled`.

Vanilla-item and Vault charges commit only after successful travel. Failed travel refunds the reserved item or balance.

## Orientation menu

<div class="wormholes-demo" data-demo="portal-orientation">
<p><strong>Portal orientation</strong> Flip the portal face and rotate its frame.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/portal-orientation-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/portal-orientation-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

| Control | Effect |
|---------|--------|
| Direction | Cycle facing |
| Flip face | Reverse the front face while retaining the frame's screen-up direction |
| Rotate CCW | Separate button. Rotates the frame counter-clockwise |
| Rotate CW | Separate button. Rotates the frame clockwise |

These controls affect which way travelers face and how projection maps space.
Mirror image rotation is on the type-menu Mirror control (right / shift-right),
not these buttons.

## Cosmetics and blackout

<div class="wormholes-demo" data-demo="ambient-particles">
<p><strong>Ambient particles and color</strong> Choose a particle style, dye color, and custom RGB color.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/ambient-particles-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/ambient-particles-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

Active portal surfaces do not emit repeating portal or lava ambience. Projection synchronization is silent. Deliberate open, close, and traversal effects retain their sounds.

Rune construction draws the consumed blocks inward before the opening burst. A selection-built aperture plays an inward particle spiral followed by the burst. A portal gaining a valid destination plays its opening effect; unlinking plays a cracking glass pane and shards. These effects also run on Fabric, Forge, and NeoForge. `[main] enable-particles = false` suppresses effect displays and particles; sound is controlled separately by `portal-sound-volume-multiplier` and the RTP portal's sound setting.

| Ambient style | Icon material (menu) |
|---------------|----------------------|
| `SPARKS` | Firework star |
| `OUTLINE` | Blaze rod |
| `CORNERS` | End rod |
| `OFF` | Glass |

`SPARKS` sends each burst as one particle packet around a random aperture cell. `[render] ambient-particle-interval-ticks` (default 1) spaces bursts that many ticks apart, and each burst carries the sparks of the skipped ticks, so the average density stays the same.

Ambient RGB controls change a channel by 8 per click or 32 while shifting. The
color picker also provides 16 dye presets. Left-click the surface-skin control
to clear the skin. Right-click it to open the Glass/Clear choices. Setting or clearing a skin requires `wormholes.admin`, including through these menu controls.

Native ClientView ignores blackout, including its color and full-bright lighting. Standard projection and explicit block-packets mode place a concrete-colored background at the far boundary of the projected view, along the padded outer edge, only where the whole block stays clear of the opening. Opaque destination blocks stay as they are. An opaque surface skin blocks projection.

## Nexus networks and dialing

<div class="wormholes-demo" data-demo="network-dialing">
<p><strong>Nexus dialing</strong> Dial two addresses, link each return portal, and travel both ways.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/network-dialing-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/network-dialing-standard-observer.webm" aria-label="No client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/network-dialing-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/wormholes-assets/demos/network-dialing-clientview-observer.webm" aria-label="Client mod, third person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

<div class="wormholes-demo" data-demo="redstone-control">
<p><strong>Redstone dialing</strong> Configure the input action and use a lever to change destinations.</p>
<div class="wormholes-demo-variant" data-client="standard">
<p>No client mod</p>
<video src="/wormholes-assets/demos/redstone-control-standard-pov.webm" aria-label="No client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
<div class="wormholes-demo-variant" data-client="clientview">
<p>Client mod</p>
<video src="/wormholes-assets/demos/redstone-control-clientview-pov.webm" aria-label="Client mod, first person demonstration" autoplay muted loop playsinline controls preload="metadata"></video>
</div>
</div>

Select More settings, then **Network**, to create or join a named network. Members have unique addresses, optional public visibility, a topology, and a hub. Managers can change addresses, link reciprocal portals, choose routing policies, and configure redstone controls. Players with travel access can open the paged dial menu by sneaking and using an empty main hand on the portal. Sneaking while changing hotbar slots cycles the destination.

Manual dialing changes the projected destination and observes the network's dial cooldown. A sticky dial remains selected; an expiring dial returns to the hub when its timer ends. Per-player, weighted, scheduled, and return routing choose from the configured destination entries; per-traveler routes do not replace the portal's projected link. Return routing remembers the portal a traveler actually used.

A destination entry identifies a local portal UUID, a network address, or a remote server and portal. Entries can carry a weight, a time window, and a label. Configure policies and explicit entries with the Nexus portal commands in [Commands & Permissions](/wormholes/09-commands-permissions).

Redstone controls use a block offset from the aperture center. A rising edge can open, close, or lock travel, or dial the next or previous member. Comparator output can report portal state or traversal count; select the action and output from the Nexus menu or use the `wire` command.
