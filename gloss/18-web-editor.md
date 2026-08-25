---
title: "Web Editor & Sync"
description: "Gloss documentation: Web Editor & Sync"
published: true
date: 2026-08-24
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss has a companion browser editor for authoring its JSON documents on a calibrated canvas. The
plugin does not ship or host it. Gloss can open one runtime document for focused editing or mirror
its complete editor-authored workspace through an outbound-only live-sync relay.

This page covers the editor, focused and workspace sessions, the v3 sync protocol and the schema
files in the plugin repository.

## What the editor is

The editor is a separate browser application. It needs no account. It keeps its workspace in
browser storage. It exports the same JSON files the plugin reads. It can open, edit and export twelve
Gloss document kinds locally:

hologram menus, container previews, panels, holograms, animations, scoreboards, MOTD, emoji, bubble
styles, damage indicators, tablist and Real Drops.

Everything above works offline as file editing. Export from the editor. Drop the file into
`plugins/Gloss/`. The hot reload described in [Data Files & Hot Reload](/gloss/03-data-files) picks
it up.

## Browser language

The language button in the top-right command row switches the complete editor immediately. It
supports `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`,
`nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`. The choice is local to
the browser under `gloss.locale`; it does not edit the server's `plugins/Gloss/language.yml`.

On a first visit the editor selects the first supported entry in the browser language list,
including a base-language match, then falls back to `en_US`. A valid stored choice wins on later
visits. The HTML language, page title, description and installable-app manifest follow the active
catalog, including a language-specific installed name and description. `he_IL` uses right-to-left
document direction; every other supported locale uses left-to-right direction. Protocol values,
identifiers, file names and player names remain isolated left-to-right inputs in every locale.

Translator-facing catalogs are ordinary JSON files at `HUI-Web-Editor/l10n/<locale>.json`; the
matching files under `web/languages/` are generated deployment copies. Each catalog separates
normal `messages`, context-specific `contexts`, locale-aware `plurals` and the plugin-owned
`previewMessages`; translators edit only the source values and retain the keys, named placeholders
and embedded protocol tokens. An unsupported or invalid
candidate is never partially applied: a live switch keeps the current catalog, while initial
startup falls back to English. The selected editor locale also selects the matching Gloss
`gloss.preview.*` templates used by container-preview `lang()` simulation, without changing the
authored document.

The editor uses square, seam-based, IntelliJ-style chrome. Its upper command row identifies the
active document and keeps the primary **Import** and **Export** file actions labelled. The lower
context row carries permanent compact selectors that name the current document-kind scope and view.
Selecting a kind, or `All`, scopes the whole shell: the library rail lists only those documents and
hides folders holding none of them, the heading counts what is in scope, creating a document
defaults to that kind, and an empty rail names the kind it is empty of. The mode persists between
visits and follows the documents you open.

Every kind has the same four views. **Visual** is that kind's editing surface. **Preview** frames
the same surface inside a Minecraft game screen — a scoreboard anchored to the right edge the way
the client draws it, the tablist as the tab overlay, the MOTD as a server list entry, bubbles over
a player, damage and healing indicators arcing from a target, emoji in chat, holograms and
animations in the world. **Code** is the document JSON, and
**Split** puts the surface and the JSON side by side. The chosen view is remembered per kind.
Panels keep all four buttons visible and say why Preview, Code and Split do not apply to them
rather than hiding the buttons.

The editor imports, validates, previews and exports the runtime's current conditional formats:
board schema 2, tablist schema 2, bubble schema 3, damage-indicator schema 2 and real-drop schema 2.
Those versions are hard breaks. The editor does not silently convert older documents; rewrite them
to the current contract or begin from a current template.

The Import action detects menus, previews, holograms, animations, scoreboards, MOTD, emoji, bubble
styles, damage-indicator settings, tablists and real-drop settings from their JSON shape, previews validation issues, and replaces the active
document only after confirmation; dropping a JSON file creates a new document instead. Export has
one download action plus Copy JSON, names `motd.json` and `tablist.json` canonically, and shows the
exact runtime destination for every other kind. The same actions remain searchable in the command
palette, and Mod+S opens Export. Secondary commands live in **More**; as the command row narrows,
complete action groups move into that same menu, remain available exactly once, and never duplicate
a visible command. The active kind and view stay named in their permanent selectors. Command-bar
and canvas chrome never use horizontal scrolling to conceal actions; compact controls and
deterministic **More** handoffs keep every command reachable instead.

On phones the command and context tiers remain two distinct rows. Labelled **Files** and **Inspect**
controls open the Library and Inspector drawers, and touch targets are enlarged across the command
bar, canvas and preview tools, library, inspector and dialogs. A touch drag beginning on empty canvas
pans the workspace instead of starting a selection marquee. Either drawer dismisses from its scrim
or the Escape key. The command rows and canvas toolbar retain their current-state labels without
horizontal action scrollers. The Gloss cube is used for the application mark, favicons and install
icons.

Documents may live directly at the workspace root; folders are optional organization rather than a
required `Unfiled` container. The Library creation row has a labelled **Folder** action and a **New
document** menu whose entries name each document kind. Library documents and folders, menu
components and container-preview elements expose the same management actions through right-click
and a touch-accessible actions button. These menus include the applicable rename, duplicate, move,
link and confirmed delete operations without being clipped by a pane edge.

New, imported and duplicated runtime documents and menu components allocate readable identifiers
without overwriting an existing one. The first copy keeps its requested id, then conflicts advance
case-insensitively as `id-02`, `id-03` and onward; requesting an already numbered id continues that
sequence. Container-preview elements remain ordered by array position because their runtime format
has no element-id field.

The container-preview inspector exposes the complete match and variant targeting surface, including
blocks, entities, special target, priority, variables and preserved extension keys. Card and match
extension keys are editable there as well; code view remains available for direct JSON authoring.

Every inspector field carries help. The long tail is generated from the JSON Schema files in the
plugin repository; a field whose schema wording is silent or hides a runtime trap gets a
hand-written note instead, each one citing the plugin source line it was read from. A field that
has a default shows it with a one-click reset, inspector sections collapse and remember it, colour
fields open a colour picker, and a field measured in ticks or milliseconds shows the equivalent in
seconds as you type. The text-icon colour picker inserts one MiniMessage colour tag after the
selection is committed; dragging inside the native picker does not insert its intermediate colours.

Random showcases are contextual. Right-click a library document and choose `Create random <kind>`
to replace that document's JSON with a valid editable example while preserving its identity,
folder and runtime id. Right-click a menu component or container-preview element to randomize that
component in place without moving, renaming or changing its type. The generators build bounded
feature-showcase documents rather than changing a few
values on one fixed preset. Menu results choose one complete network hub, named-destination
wayfinder, player-tools panel or workspace menu navigator. Each menu uses one mood, fixed billboard,
palette, click-feedback policy, hover curve and button-anchored hitbox family; every label matches its
exact connect, teleport, command or navigation action. Player-status toggles explicitly say that
their PlaceholderAPI condition is sampled at open, and their true/false copy matches that condition.
The navigator names actual menu ids already present in the workspace, while a workspace without
targets gets explicit Home, Back and Close controls. At most one local image, animated image or
custom item becomes a branded header ornament. Exhaustive icon, action, trigger, source, navigation,
easing and anchor coverage remains in component-level randomization, where it cannot make a whole
menu incoherent. Player and server values use Gloss's native
getters; optional PAPI expansion data and integration metrics are demonstrated with explicit
fallbacks rather than used for values Gloss already owns. Random scoreboards vary their complete
base presentation, automatic-selection condition, conditional variants and 1.20.3+ hidden-number
setting. Their generated color sequences and
the fixed scoreboard showcase author their own visible rates while runtime and preview both sample
clock-driven text every 50 ms. Random tablists choose compact, welcome, status, event, community or staff structures,
compose one to five header and footer rows independently, author conditional header/footer and list-name variants, and
choose among all ten animation families. Their authored expressions choose the visible rate while
the runtime and editor sample clock-driven expressions and named animations every 50 ms. Holograms vary occlusion, billboard
mode and authored yaw and pitch; animations choose among rainbow, marquee, timeline, typewriter,
flash/pulse, wipe, scanner, scramble/decode, odometer and wave/chase while covering every playback
mode; emoji cover token-only,
shorthand, literal and compound Unicode forms. Generated tablists keep both conditional surfaces enabled,
include complete base presentations, and refuse to reproduce the document they replace.
The recurring staff names are scattered easter eggs rather than a fixed script.
MOTDs deliberately use only viewer-free time and server values: the status response is sent
before the same request's latency is measured, so a current-ping conditional MOTD cannot exist.
Random container previews choose among all 14 shipped target families: beehive, brewing stand,
cauldron, chest, chiseled bookshelf, dispenser, ender chest, furnace, furnace minecart, hopper,
jukebox, locked, minecart and shelf. Each produces a distinct editable layout with appropriate
simulated state, variants, bounded repeats, explicit depth, framed or bare cards, conditional
visibility, backed labels and live expressions spanning the runtime's arithmetic, interpolation,
color, time, player, inventory, PlaceholderAPI and metric functions. Occupied slots render their actual catalog item
texture instead of an abbreviation tile. The fixed furnace expression-lab template remains
available as the complete teaching sample, and every random result remains valid runtime JSON
rather than an editor-only animation.
Random Real Drops documents regenerate a complete coherent behavior instead of only moving
sliders: each result chooses compatible physics, script expressions, material maps, profiles,
clips, triggers, tracks, easing, and keyframes within bounded preview and runtime budgets.
Random holograms immediately refresh the open stage. Random BubbleStyle documents exercise
visible-character wrapping, multiline formatting, bounded lifetime, offset, follow/hide behavior,
optional priority/condition selection, independently enabled shimmer passes and procedural translation,
scale, rotation and opacity expressions. Their motion families include editable fly-up, fade,
shrink, orbit and arcing behavior. The bubble inspector exposes the shimmer's two pass switches,
solid RGB band color, visible-glyph width, sweep duration, spawn delay and departure lead, plus an
`Original Gloss` preset. That preset waits 400 ms, moves one solid-white three-glyph band across the
complete multiline block over 700 ms, and repeats the same bounded pass during the final 700 ms of
fly-away. Wrapped rows share one continuous band instead of starting independent shimmers. Prefix
functions and expressions resolve before the preview applies that band, so raw authored formatting
never flashes during the first sweep. Multiline message blocks reserve their measured line height
and do not overlap adjacent bubbles in the stack. The
preview uses `requestAnimationFrame` and the server uses its high-frequency packet animator so long
wrapped messages refresh smoothly. Minecraft samples an MOTD animation frame when it answers each server-list request rather
than continuously redrawing an already displayed row. The MOTD editor therefore holds that sampled
frame still; **Refresh** samples the current wall-clock frame again, and choosing another entry
represents another ping. Each replacement is one undo step.

The image and animated-image icon inspectors accept PNG, JPEG, WebP and GIF uploads directly.
Oversized uploads are aspect-fit to the 16-pixel text-image ceiling automatically instead of requiring a
separate resize step. A GIF is resized frame by frame, expanded into ordered PNG paths under
`plugins/Gloss/images/` and attached to an `animatedTextImage` component, up to 128 imported frames.
The image manager can also import a 64x32, 64x64 or proportional high-resolution Minecraft skin:
it combines the face and translucent hat layer into an 8x8 pixel head under `images/heads/`. The
frame speed remains an editable Gloss tick interval. On a holographic-menu canvas, right-clicking or
pressing Shift+F10 opens creation at that exact snapped position for text, images, GIFs, pixel heads,
living entities, items, blocks, buttons and toggles. Media creation opens the same image manager and
inserts the chosen static or animated asset as one undoable component edit. A standalone hologram
document remains a text-display line list; mixed icon components belong to menu documents. Living-
entity icons use real Minecraft entity sprites instead of geometric stand-ins. A standalone hologram's Presentation section exposes `seeThrough`, enabled by default, so the authored JSON and server agree on whether terrain occludes the text. The **Damage indicators** document provides a target-stage renderer and GUI controls for the complete schema-2 `damage-indicators/default.json` profile: admission and lifetime limits, damage/healing gate conditions, complete conditional variants, amount formatting, offsets, continuous launch velocity and acceleration, spin, scale, fade timing and the per-viewer audience condition. Its transport selects damage or healing independently, loops the selected type automatically at the authored lifetime, advances to a new deterministic seeded trajectory on each cycle, and retains replay and pause. A damage-only **Critical hit** control changes the sample's exact Paper critical flag so conditional critical variants can be inspected. The sample supplies the complete event, subject, source and viewer role surface; a false style or audience condition displays `condition false` instead of leaving an unexplained blank stage. **Randomize** procedurally replaces the complete singleton JSON as one undoable edit with valid varied limits, conditions, a critical-damage variant, a large-heal variant, presentations and audience rules guaranteed to include the default sample viewer. Position, rotation, scale and opacity use the plugin's same closed-form elapsed-time equations, so the preview remains stable at different browser frame rates. It does not reproduce Minecraft's TextDisplay rasterization, depth, occlusion, tracking or packet interpolation, which still require in-game validation. The **Real drops** document provides a live item-stage preview and GUI controls for the complete schema-2 `real-drops/default.json` profile: fallback presentation, conditional variants, viewer audience, update budgets, density, model scales, throw-momentum tumble, submerged spin, distance-driven ground roll, face attraction and stable delay, entity physics, advanced modifiers, labels, filters, and typed keyframe animation profiles. Placeable samples use textured six-face block geometry with material-specific bounds; only true items use the item-sprite renderer. Showcase drops default to one item and use only occasional two- or three-item stacks, keeping the model readable instead of demonstrating large inventory counts. The stage shadow is a circular disc on the ground plane, so camera perspective produces the ellipse naturally instead of stretching a screen-space shadow. The animation inspector authors material property maps, profile priority and globs, trigger clips, tracks, blend/easing, and keyframes for scale pulses, hovering, glow/light, physics handoff, spiral rotation, visibility, and offsets. Its transport includes stepping and timeline scrubbing with the current animation phase visible. The code editor schema covers the same contract. Its export path is fixed to `plugins/Gloss/real-drops/default.json`; the master `[features] realDrops` boolean remains in `gloss.toml`.
The bundled Java 26.2 item/block catalog contains 1,691 materials and 1,644 textured atlas entries;
the entity catalog contains 91 living renders using Java 26.2 textures and the renderer's latest
supported 26.1 geometry definitions. Maintainers refresh both catalogs with
`dart run tool/refresh_minecraft_media.dart` and explicit client, Paper-source and renderer inputs.
The 3D preview keeps living-entity sprites on the runtime's raw-entity orientation: body yaw and
pitch follow the menu, while panel roll applies only to the anchor and an interactive component's
logical click plane. Entity decorations remain non-clickable, and the runtime uses a private
collision-never client team rather than creating a physical world entity.
Buttons and toggles expose hover travel, duration and easing together in the inspector. The 3D
preview uses the same 0-to-40-tick entry and exit animation as the server, applies effective
`uiScale` once, and moves only the visual while the authored click plane remains fixed. Both
clickable types can use the same custom hitbox controls; a toggle custom hitbox stays stable when
its true and false icons differ. Whole-menu random examples use one restrained hover and hitbox
policy; randomizing an individual component remains the field-surface laboratory for all easing,
duration and anchor combinations. Menu text in the canvas and
3D preview runs the full Gloss pipeline for workspace animations, emoji, expressions, native
player/server samples and optional PAPI fallbacks, using each icon's runtime refresh interval.

The template picker includes an Everything showcase menu, a furnace expression lab using all four
container-preview element types, the shipped defaults, a scoreboard with one row for each animation
effect, and richer examples for every Gloss document
kind, all four animation modes, and matching templates for rainbow, marquee, timeline, typewriter,
flash, wipe, scanner, decode, odometer and wave. Time-driven single-frame effects repaint live and
pause with their sampled expression time. All ten shipped animations are available to previews
even when no workspace animation document exists, matching a clean server installation. The
60-step RGB `rainbow` gradient and the randomized rainbow variant use dense continuous hues instead
of short legacy-color cycles; the other randomized variants author their matching expression helper
directly into the generated document. A color-only frame is shown against the preview-only word
`RAINBOW`, making its actual color visible without adding that word to the document or server output.
The library rail carries a labelled
**Workspace actions** menu holding workspace-bundle Import and Export and `Erase all local data`;
none of the three sit in the document creation row any more. The erase confirmation shows the
affected document and folder counts and offers a workspace-bundle backup first. A completed erase
leaves the workspace genuinely empty and does not recreate `my-menu`.

Menu and container-preview surfaces retain their own fit, reset and zoom tools. The scoreboard
preview is centered in the editor while retaining the runtime's descending 15-to-1 scores, 15-row
cap, single-line normalization, 32-unit title and 16-unit prefix plus 16-unit suffix fitting. It uses
an intrinsic, internally right-aligned Minecraft sidebar; a preview-only control can place it over
the Minecraft scene backdrop in the client's right-side position. Scoreboard, MOTD,
chat-bubble and tablist previews have independent 50%-200% zoom controls. The hologram stage
supports both wheel zoom and visible zoom/reset buttons for touch use. These controls affect only
the editor preview and never alter the exported document.

Rendered text on every surface carries Minecraft's own text shadow. A board with an empty title
falls back to the board id, which is what the plugin does. The per-board hidden-number option says
plainly that a client older than 1.20.3 still draws the numbers. A text animation can be played and
paused on every surface, not only on the menu canvas. Expression previews give `select` and
`palette` the server's signed 64-bit index wrapping, so real epoch-time expressions select the same
frame in the editor and at runtime. Condition inspectors and simulators cover the same expression
language, role variables, functions, priority ordering and lexical id tie-breaks as the plugin. The
board simulator resolves both the selected board and its selected presentation; the tablist,
bubble, damage-indicator and real-drop surfaces expose their corresponding conditional layers.

Hover and keyboard-focus help is rendered in a viewport-level overlay. Tooltips flip and clamp at
screen edges instead of being cut off by the library, inspector, canvas, preview or dialog bounds.

## Live sync scopes

Every editor-authored runtime document kind can be opened individually or included in a full
workspace session.

| Document kind | Wire kind | Focused command |
|---|---|---|
| Hologram menu | `menu` | `/gloss web edit menu <id>` |
| Panel | `panel` | `/gloss web edit panel <id>` |
| Container preview | `container-preview` | `/gloss web edit container-preview <id>` |
| Hologram | `hologram` | `/gloss web edit hologram <id>` |
| Animation | `animation` | `/gloss web edit animation <id>` |
| Scoreboard | `scoreboard` | `/gloss web edit scoreboard <id>` |
| MOTD | `motd` | `/gloss web edit motd motd` |
| Emoji | `emoji` | `/gloss web edit emoji <id>` |
| Bubble style | `bubble-style` | `/gloss web edit bubble-style <id>` |
| Damage indicators | `damage-indicators` | `/gloss web edit damage-indicators default` |
| Tablist | `tablist` | `/gloss web edit tablist tablist` |
| Real Drops | `real-drops` | `/gloss web edit real-drops default` |

`/gloss web workspace` opens an exact mirror of all twelve kinds and every file under `images/`.
Publishing that scope can create, replace and delete runtime documents and images. Gloss config,
localization, player state, preview scales, generated custom-item catalogs, sync credentials,
import receipts and transaction journals or backups remain server-local.

## Hosting and URLs

Two independent addresses are configured. Neither is served by the plugin.

| Key | Default | What it points at |
|---|---|---|
| `[editor] builderUrl` | `https://gloss.volmitsoftware.com` | The browser editor itself |
| `[editor.sync] endpoint` | `https://sync.gloss.volmitsoftware.com/v3` | The relay that brokers live sessions |

The hosted editor moved off the retired HoloUi hostname onto `gloss.volmitsoftware.com`. The relay
default moved with it. Gloss neither ships nor hosts either service. It cannot guarantee that
either address is reachable from your network. If it is not, point `builderUrl` at a build you host
yourself. Point `[editor.sync] endpoint` at your own relay.

`builderUrl` is sanitized on every config load. It must begin with `http://` or `https://`. It must
contain no whitespace, quote, apostrophe, `<`, `>` or `\`. Anything else silently restores the
default. Beyond that it is free-form. `https://editor.example.com/gloss` and `http://127.0.0.1:8080`
are both accepted.

`endpoint` is stricter. It must be `https`, or `http` to `localhost`, `127.0.0.1` or `::1`. It must
carry no userinfo, query or fragment. Its path must end in `/v3` and contain no `//`, `/./` or
`/../`. The normalized form must be at most 1024 characters. A value failing any of those is
replaced by the default. Scheme and host are lowercased. Trailing slashes are trimmed on write.

Gloss never accepts an inbound web connection. Every exchange is an outbound HTTPS request the
plugin makes to the relay.

## Command surface

The web workflow is rooted at one command tree.

| Command | What it does |
|---|---|
| `/gloss web open` | Opens the configured editor without a server workspace |
| `/gloss web edit <kind> <id>` | Opens one live, restricted runtime subject |
| `/gloss web workspace` | Opens the complete live editor-authored workspace |
| `/gloss web sessions ...` | Lists, inspects, pulls or revokes live capabilities |

`open` is the offline authoring path. The `edit` and `workspace` commands require live sync and fail
clearly when session creation is unavailable; they never fall back to a one-way document link.
Browser autosave remains local in every scope. Only **Publish to Server** sends changes to Gloss.

## Live sync sessions

A live session is a capability brokered by a relay. Gloss polls the relay, applies validated
publications to disk and acknowledges them. The editor talks to the same relay from the browser.
The two never connect directly.

### Configuration

| Key | Default | Range and notes |
|---|---|---|
| `[editor.sync] enabled` | `true` | Turns the live path off. Live edit and workspace commands fail until it is enabled |
| `[editor.sync] endpoint` | `https://sync.gloss.volmitsoftware.com/v3` | Validated as described above |
| `[editor.sync] createToken` | `""` | 22 to 128 characters of `A-Z a-z 0-9 _ -`. Anything else is blanked with a warning |
| `[editor.sync] sessionMinutes` | `60` | Clamped 5..1440. Requested session lifetime |
| `[editor.sync] pollSeconds` | `3` | Clamped 1..60. Delay between relay polls |
| `[editor.sync] maxProjectMiB` | `8` | Clamped 1..32. Cap on one canonical project |

All six live in `gloss.toml` and hot reload with it. See [Configuration](/gloss/02-configuration).

When `endpoint` is still the shipped default and `createToken` is blank, session creation is refused
before any request is sent, with `the official editor sync relay requires editorSyncCreateToken`. No
static secret ships in Gloss. Out of the box live edit and workspace commands fail until an
operator supplies a token or points the endpoint at a relay that admits anonymous creation.

### The capability link

A successful create returns a link of this form:

```
<builderUrl>/#/sync/<sessionId>/<editorToken>?relay=<unpadded-base64url-endpoint>
```

The session id, the editor token and the relay address all sit in the URL fragment. They are not
sent to the editor's web server. They do not appear in ordinary access logs or referrer headers.

> Whoever holds that link can publish changes to your server until the session expires or is revoked.
> Treat the whole link as a secret.
{.is-danger}

A player is given Open Editor and Copy Link buttons rather than the raw URL. Senders who also hold
`gloss.web.sessions` receive a Revoke button that runs `/gloss web sessions revoke` for that
session. The capability is never pasted into player chat where others can read it. Console gets the
bare URL, preceded by an explicit warning that it can publish to the server until revoked or
expired.

The editor token is the browser's credential. A separate **server token** never leaves the server.
It is stored locally. It is what Gloss uses to poll, acknowledge and revoke.

### The session store

Sessions live in `plugins/Gloss/editor-sync-sessions.json`. The file holds `version`, `1`, and a
`sessions` array. Each entry carries `sessionId`, `serverToken`, `endpoint`, `kind`, `subjectId`,
`expiresAt`, `lastPublicationRevision`, `baseProject` and an optional `pendingAck`.

> This file contains live bearer credentials. Never copy it to another server, never commit it, never
> paste it into a support channel. Gloss writes it atomically and restricts it to owner read/write
> where the filesystem supports POSIX permissions, and the HoloUi importer refuses to copy it.
{.is-danger}

Gloss refuses to use the store if it is a symbolic link. It also refuses if any ancestor of the data
directory is a symlink or missing, or if the file exceeds 80 MiB. A malformed entry is quarantined
— kept verbatim in the file, excluded from polling, and logged — rather than discarding the whole
store.

If the store is replaced but its durability cannot be confirmed, Gloss marks persistence unhealthy.
It logs at `SEVERE`. It pauses new sessions and publication pulls until the server is restarted.

### Polling and expiry

One background task polls every active session on a fixed delay of `pollSeconds`. A failing poll
backs that session off exponentially. The delay starts at the larger of `pollSeconds` and 3 seconds.
It doubles per consecutive failure. It is capped at 300 seconds. It carries up to ten percent
jitter derived from the session id. A successful poll clears the backoff. Each failure logs the
session, its subject and the retry delay.

An expired session is removed on the next pass. Gloss stores at most 32 active sessions and 64 MiB
of canonical project bytes across all of them. A create that would exceed either is refused.

Every outbound relay exchange has a 20-second total deadline. Response bodies are size-capped
before parsing.

### Commands

Every node is gated by `gloss.web.sessions`.

| Command | What it does |
|---|---|
| `/gloss web sessions list` | Every active session with its kind, subject, seconds to expiry, last publication revision and pending state |
| `/gloss web sessions status <session>` | The same fields for one session |
| `/gloss web sessions revoke <session>` | Revokes the capability at the relay and drops the session locally |
| `/gloss web sessions pull <session>` | Polls that session immediately instead of waiting for the next tick |

Session ids are displayed abbreviated to their first 12 characters. `status`, `revoke` and `pull`
accept either the exact id or a unique prefix of at least 12
characters. A shorter prefix does not resolve. An ambiguous one is rejected.

`revoke` refuses while that session is processing a publication. `pull` reports that the session is
already being polled rather than queueing a second poll. The full command tree and its permissions
are on [Commands & Permissions](/gloss/17-commands-permissions). The panel commands a session edits
are on [Panels](/gloss/16-panels).

## Protocol v3

A sync project is one JSON object. `format` is `gloss-sync-project` and `version` is `3`.

```json
{
  "format": "gloss-sync-project",
  "version": 3,
  "kind": "workspace",
  "subjectId": "workspace",
  "documents": [
    { "kind": "animation", "id": "rainbow", "revision": 4, "json": "{ ... }" },
    { "kind": "menu", "id": "spawn-hub", "json": "{ ... }" },
    { "kind": "panel", "id": "spawn-hub", "revision": 8, "json": "{ ... }" }
  ],
  "images": [ { "path": "sync/spawn-hub/icon.png", "data": "data:image/png;base64,..." } ],
  "constraints": {
    "subjectId": "workspace",
    "documentKinds": ["animation", "bubble-style", "container-preview", "damage-indicators", "emoji", "hologram", "menu", "motd", "panel", "real-drops", "scoreboard", "tablist"],
    "createDocumentKinds": ["animation", "bubble-style", "container-preview", "damage-indicators", "emoji", "hologram", "menu", "motd", "panel", "real-drops", "scoreboard", "tablist"],
    "allowDeletes": true
  },
  "warnings": [],
  "baseRevision": "sha256:<64 lowercase hex characters>"
}
```

### The documents array

Each document entry is `{kind, id, json}` or `{kind, id, revision, json}` — no other field
combination is accepted.

| Rule | Value |
|---|---|
| Entries per project | 0 to 512 for a workspace; at least 1 for a focused session |
| Ordering | sorted by kind, then id. Out-of-order is rejected |
| Uniqueness | one entry per (kind, id) pair |
| `id` length | at most 256 characters |
| `json` size | at most 2 MiB of UTF-8 |
| `revision` | optional. When present, an integer from 1 to 9007199254740991 |

`kind` is an open slug on the wire, matching `^[a-z][a-z0-9-]{0,31}$`. The relay never interprets
it. It is kind-agnostic and stores whatever slug the editor sends. Gloss handles `animation`,
`bubble-style`, `container-preview`, `damage-indicators`, `emoji`, `hologram`, `menu`, `motd`,
`panel`, `real-drops`, `scoreboard` and `tablist`. `panel` is the wire name for a world-anchored
panel.

A panel entry's `json` must already be canonical JSON text. A panel document whose text does not
re-canonicalize to itself is refused.

### Canonical text and hashing

`baseRevision` is `sha256:` followed by 64 lowercase hex characters. It is the SHA-256 of the UTF-8
canonical form of the project with only the root `baseRevision` key removed. Canonical form is:

- object keys sorted lexicographically, array order preserved
- strings quoted with ordinary JSON escapes, `\u00xx` only for control characters and lone surrogates
- numbers by IEEE-754 value — zero is `0`, values from `0.000001` up to `1e21` in plain decimal,
  anything outside that in lowercase exponent form, and non-finite numbers rejected

A project whose `baseRevision` does not equal the hash of its own content is rejected before
anything else happens.

### Structural and asset limits

| Limit | Value |
|---|---|
| Whole canonical project | `[editor.sync] maxProjectMiB`, 1 to 32 MiB |
| JSON nesting depth | 64 |
| JSON nodes | 200,000 |
| Characters in one string | 2,000,000 |
| Characters in one property name | 256 |
| Documents | 0 to 512 in workspace scope |
| Bytes per document | 2 MiB |
| Image assets | 512 |
| Bytes per image | 512 KiB |
| Workspace image dimensions | at most 4,096 by 4,096 and 16,777,216 pixels per image |
| Workspace image pixels | 67,108,864 across the project |
| Menu-referenced image dimensions | at most 16 by 16 and 256 pixels per image |
| Menu render pixels and rows | 262,144 pixels and 4,096 rows across the project |
| Warnings | 256, each at most 512 characters |

Image data arrives as a base64 data URL. The declared media type must be one of `image/png`,
`image/jpeg`, `image/gif`, `image/webp` or `image/bmp`. It must match what the leading bytes
actually are. Workspace sessions retain every safe file under `images/`, including files not
currently referenced by a menu. The stricter 16 by 16 render limit applies to images referenced by
menu text-image components, matching the runtime renderer.

### Constraints and what a session may change

`constraints` is captured when the session opens. It is immutable for its lifetime. A publication
that alters it is rejected with `sync publication cannot change its capability constraints`.

- `documentKinds` lists the kinds that may be replaced. `createDocumentKinds` lists the kinds a
  publication may add. Both arrays are sorted, unique wire slugs.
- A menu session may publish only its own subject menu and may not create additional documents.
- A panel session must publish exactly its subject panel document. Its menu set is the root menu plus
  every loaded menu reachable from it. Traversal follows `navigate` actions in `push`, `replace` or
  absent mode. It also follows `command` actions with an absent or `player` source that run a
  canonical menu-open command.
  Traversal is cycle-safe and capped at 256 menus. A referenced menu that is not loaded becomes a
  project warning rather than a failure. Only a missing **root** menu fails the session.
- New menus in a panel session must sit under `constraints.newMenuPrefix`, and must be reachable from
  the panel root. That prefix is the root menu's parent path, so a root of `shops/main` gives
  `shops/` and a root of `spawn-hub` gives `spawn-hub/`.
- New images must sit under `constraints.newImagePrefix` — `sync/<panelId>/` for a panel session,
  `sync/menus/<menuId>/` for a menu session.
- Other focused sessions may replace only their subject document and may not create or delete files.
- A workspace session carries all twelve kinds in both kind arrays, has `allowDeletes: true`, and
  can create, replace and delete any safe runtime document or image in the mirrored workspace.
- The panel's `id`, `uuid`, `schemaVersion` and `revision` are server-owned. The editor sees the
  revision it opened with. Gloss assigns the next one on publication.

### Publication outcomes

Gloss polls for a pending publication, validates it, and acknowledges it with exactly one of three
statuses.

| Status | When | What the server does |
|---|---|---|
| `applied` | Everything validated and committed | Creates, replaces and deletes the requested files, reloads changed runtime kinds, and returns the exact fresh server snapshot |
| `conflict` | The server project moved since the session opened, so `baseRevision` no longer matches | Changes nothing and returns the current server snapshot for the editor to rebase on |
| `rejected` | The payload failed validation, or the subject no longer exists | Changes nothing and returns the reason |

Acknowledgement is idempotent and is retried. A session with an unsent acknowledgement reconciles
it on the next poll before fetching anything new.

### Relay surface

For an operator running their own relay, these are the four calls Gloss makes against
`<endpoint>`. Each carries the server token as a bearer credential except the create call, which
carries `createToken` when one is configured.

| Call | Expected |
|---|---|
| `POST /sessions` with `{protocol, expiresInSeconds, snapshot}` | `201` and `{protocol, sessionId, editorToken, serverToken, expiresAt, baseRevision}` |
| `GET /sessions/<id>/publication?after=<revision>` | `200` with a pending publication, or `204` when there is none |
| `POST /sessions/<id>/publication/<revision>/ack` | `200` |
| `DELETE /sessions/<id>` | `200`, `204`, `404` or `410` |

Gloss validates the response shape strictly. The exchange fails on unknown or missing fields, or
on a session id that does not match. It fails on a capability outside 22..128 characters of
`[A-Za-z0-9_-]`. It fails on a `baseRevision` that is not a SHA-256 revision, or on an expiry
outside the requested window.

## Durable publication

An `applied` publication is not a loose set of file writes. Gloss stages it as one journaled
transaction under the same persistence coordinator the in-game writers and file watchers use. A
command edit cannot interleave with a publication.

Two working directories sit in the data folder:

| Path | Contents |
|---|---|
| `editor-sync-transactions/` | In-flight transactions: `journal.json`, a `stage/` tree and a `backup/` tree |
| `editor-sync-backups/` | Archived transactions, pruned to the most recent 20 |

Neither directory exists until a publication actually runs; recovery at enable creates neither. The
`backup/` tree is created by the first replacement or deletion of an existing file, so a
publication carrying only new documents archives no backup directory at all. Archiving prunes empty
directories on the way out, so an archived transaction holds only the files it really staged or
replaced.

Each transaction records the state it reached — `prepared`, `publishing`, `published`, `committed`
or `rolledback`. Every replaced file is hash-checked against the snapshot taken when the session
opened. A target that changed independently since then aborts the transaction rather than
overwriting the change.

Recovery runs at enable, before the config manager and any service start. A `committed` transaction
is archived. Anything else is rolled back from its backup tree, marked `rolledback` and archived.
Unjournaled leftovers are validated and cleaned. If recovery cannot complete, Gloss refuses to
enable rather than starting on an inconsistent data folder.

The journal records every staged write and delete so recovery restores the pre-publication
workspace exactly. Two failure modes are surfaced rather than swallowed. If commit succeeded but
backup cleanup did not, it is logged as a warning and retried at the next startup. If the commit
marker itself could not be made durable, the session is flagged as needing restart recovery. Its
relay acknowledgement is paused. `/gloss web sessions pull` on it reports that the session requires
server restart recovery.

A publication holds the single write permit for the whole store, so a publication that never
finishes would park the menu hot-reload watcher, the panel queue and every later write behind it for
the life of the server. Two guards prevent that. A transaction left open longer than two minutes is
force-aborted and the permit is released, logged at `SEVERE`:

```text
An external persistence transaction was never closed within 120000 ms and has been force-aborted.
Editor sync or panel creation left the store locked; the affected publication did not complete and
must be retried.
```

The check runs on the hot-reload watchdog's own IO thread rather than on a timer, so the lease is
reclaimed within one poll of the deadline even when the server thread is the thread that is stuck.
Separately, a menu publication queued behind the permit gives up after 30 seconds instead of waiting
forever. In both cases the write does not silently half-apply — it is abandoned, and it must be
retried. Project JSON is parsed off the server thread and only the publish hops back, so a large
project no longer stalls the tick while it is read.

> Do not hand-edit, move or delete `editor-sync-transactions/` or `editor-sync-backups/` while the
> server is running. They are the rollback record for a publication in flight.
{.is-warning}

Neither directory is copied by the HoloUi importer. See [Data Files & Hot Reload](/gloss/03-data-files).

## The JSON Schema files

The Gloss repository carries four hand-maintained JSON Schema 2020-12 files:

| File | Describes |
|---|---|
| `schema/gloss.schema.json` | A hologram menu document and all its components, icons and actions |
| `schema/gloss-preview.schema.json` | A container preview document |
| `schema/gloss-damage-indicators.schema.json` | The singleton damage and healing indicator profile |
| `schema/gloss-real-drops.schema.json` | The singleton display-backed drop profile |

They are documentation grade only. No build step generates them. The plugin never loads them. They
are not written into `plugins/Gloss/`. They exist so an
editor or IDE can offer completion and so the format has a readable reference.

**The Java parser is the format's source of truth.** A key that does not exist in Java does not
exist, whatever a schema says. The parser enforces rules JSON Schema cannot express. Where a schema
and the runtime disagree, the runtime wins. The schema is the thing that is wrong. The behavior
pages — [Hologram Menus](/gloss/09-menus), [Components & Hitboxes](/gloss/10-components-hitboxes),
[Icons](/gloss/11-icons), [Actions](/gloss/12-actions) and
[Container Previews](/gloss/15-container-previews) plus
[Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops) — take precedence over both.

## The custom item catalog

`/gloss item export` writes `plugins/Gloss/custom-items.json`. That file is what the editor reads.
It offers custom-item id completion, an approximate sprite and a warning when a referenced id is
not in the export.

```json
{
  "version": 1,
  "generated": 1755561600000,
  "providers": ["itemsadder", "oraxen"],
  "items": [
    { "provider": "itemsadder", "id": "myblocks:ruby", "name": "Ruby", "material": "diamond" }
  ]
}
```

Ids are probed by actually resolving them and dropped on failure. The catalog never advertises an
id the server cannot produce. Output is at most 10,000 items per provider. The export runs
asynchronously and needs `gloss.items.export`. It refuses while a previous export is still running.
Both `/gloss item` nodes refuse entirely when `[items] customItems` is off.

The catalog is optional. Custom-item icons export correctly without it. It is not uploaded
anywhere. You load the file into the editor yourself. It is also regenerable at any time. That is
why the HoloUi importer skips it rather than copying it. See
[Custom Items & Item Providers](/gloss/14-custom-items).
