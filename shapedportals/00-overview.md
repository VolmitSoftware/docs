---
title: "Shaped Portals — Overview"
description: "Shape rules, managed portal lifecycle, commands, and permissions"
published: true
date: 2026-08-29T03:51:03.000Z
tags: "shapedportals, portals, commands, permissions"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Shaped Portals runs only when vanilla has not already created a normal portal.
It tests both vertical axes, validates one closed connected interior, exposes a
cancelable Bukkit creation event, and registers the completed surface for later
integrity checks.

## Valid shapes

A shaped portal must have:

- one vertical surface in the X or Z plane;
- one orthogonally connected interior;
- a complete boundary made from configured frame materials;
- only configured replaceable materials in its interior;
- an interior within the configured block, width, and height limits; and
- all cells owned by one active Folia region during creation.

The outline may curve, step, widen, narrow, contain concave corners, or surround
frame-material islands. Diagonal contact does not connect interior cells. A
shape valid in both axes is rejected as ambiguous.

Default frames accept `OBSIDIAN` and `CRYING_OBSIDIAN`. Default interiors accept
air variants, fire, and soul fire. The default interior range is 2–256 blocks,
with independent 64-block width and height limits. Hard safety ceilings prevent
configuration from raising the search above 4,096 cells or 512 blocks per
dimension.

## Creation lifecycle

1. A permitted ignition cause produces fire inside a frame.
2. A bounded vertical eligibility check requires the ignition column to reach a
   configured lower frame boundary. Ordinary terrain fires stop here without
   feedback, deduplication, or attempt and rejection statistics.
3. The plugin waits one tick so vanilla portal creation takes priority.
4. If the ignition block is already `NETHER_PORTAL`, no shaped attempt runs.
5. Both vertical planes are scanned iteratively on the owning region thread.
6. A `PortalCreateEvent` with reason `FIRE` is fired with the proposed blocks.
7. The shape is scanned again after the event to reject concurrent frame edits.
8. The portal is registered and the native portal blocks are placed without
   initial neighbor physics.
9. The registry is written asynchronously to `portals.json`.

Once active, vanilla handles collision, dimension travel, coordinate scaling,
destination search, and return-portal construction.

## Commands

| Command | Result |
|---|---|
| `/sp` | Open the localized, paginated help menu |
| `/sp status` | Show creation state, registry counts, attempt totals, and scheduler mode in the shared help-menu layout |
| `/sp config` | Open the in-game configuration editor |
| `/sp language [locale]` | Select an available repository or custom locale, or omit it to open the interactive picker |
| `/sp debug` | Save a comprehensive diagnostic report and optionally upload it to mclo.gs |
| `/sp portals [page]` | List every managed portal with coordinates, clickable teleport shortcuts, and a note when its recorded frame uses materials no longer allowed for new portals |
| `/sp teleport [UUID/prefix]` | Teleport to safe standing space beside a managed portal; authorized operators can repeat an unsafe result to confirm a forced landing |

The full-height 54-slot category editor exposes every persisted setting and a
paginated Languages workspace. Boolean values toggle on
click, numeric values support increment, decrement, shift acceleration, and
exact chat entry, while text and list settings use a 60-second cancellable chat
prompt. Clicking the Language setting or running `/sp language` opens the same
paginated Director-style menu. The editor-origin picker retains its cancellable
typed prompt; the command-origin picker has no timer or chat capture. Every hoverable row
shows the locale identifier and its full language name; clicking it selects the
locale only after any required repository download verifies successfully, and
command-driven selection never opens the configuration inventory. Managed portal
listings and `/sp status` use the same unnumbered banner, arrow-marked entries,
and footer pagination as Adapt and React command help, with Rift's readable purple
palette. The Languages workspace lets operators select any available locale and
edit every registered message. Tooltips render and wrap a bounded preview instead
of exposing one long raw template, and chat editing uses the same Director banner,
arrow rows, and footer with visually matched top and bottom rails plus a formatted
current-value preview. It atomically edits
the same `languages/<locale>.toml` file that the runtime loads and preserves its
localized instruction and placeholder header. The prompt lists every placeholder
valid for that message, and the save result shows the formatted previous and new
values. `config.toml` remains available for file-based
administration, but no setting requires leaving the in-game editor.

The General page includes the enabled-by-default anonymous bStats switch for
plugin ID `33267`. Toggling it starts or stops ShapedPortals metrics immediately;
the global bStats opt-out remains available in `plugins/bStats/config.yml`.

ShapedPortals also exposes six read-only runtime metrics to React through the
shared VolmLib integration bridge. This is separate from bStats and sends
nothing outside the server. Install ShapedPortals' included **ShapedPortals Runtime**
Plugin API Pack to add managed-portal, interior-cell, creation-rate,
rejection-rate, and success-percentage samplers to React.

Command results always remain in chat so they can be reviewed, and sender-facing
message defaults include the optional `{prefix}` token. Removing that token from
one locale entry suppresses the prefix only for that message. Players
may also receive configurable short action-bar, title, boss-bar, and sound
feedback. Action bars use VolmLib's cooperative segment compositor, titles are
shown only after winning the shared title claim, and boss bars use a dedicated
short-lived ShapedPortals lane with explicit cleanup.

## Permissions

| Permission | Default | Purpose |
|---|---:|---|
| `shapedportals.create` | Everyone | Ignite shaped portals when permission enforcement is enabled |
| `shapedportals.command` | Everyone | View help and status |
| `shapedportals.config` | Operators | Use the in-game editor |
| `shapedportals.debug` | Operators | Create local diagnostic reports and use the configured upload option |
| `shapedportals.portals` | Operators | List managed portal identities, locations, and creation details |
| `shapedportals.teleport` | Operators | Teleport to verified safe standing space beside a managed portal |
| `shapedportals.teleport.unsafe` | Operators | Confirm a forced landing when no safe standing space exists; also requires `shapedportals.teleport` |

Next: [Installation & Configuration](/shapedportals/01-installation-configuration)
