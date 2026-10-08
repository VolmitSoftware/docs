---
title: "Damage Indicators"
description: "Show damage and healing numbers beside entities"
published: true
date: 2026-10-08T00:27:49.396Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

Gloss can show a floating number beside an entity when it takes damage or heals.

Open the editor with `/gloss web edit damage-indicators default`. The profile is schema 4.

The indicator document accepts `show`, defaulting to `true`. It combines with `audience.when` for
each viewer and uses the same event snapshot. Dynamic conditions are reevaluated while an indicator
is alive; hidden indicators cannot outlive their normal lifetime. See [Show conditions](/gloss/13-expressions-placeholders#show-conditions).

The reloadable `[temporaryDisplays] maxActiveIndicators` setting limits concurrent damage and healing indicators across the server. The authored rate and lifetime can impose a lower active limit, and per-viewer visibility budgets still apply; see [Configuration](/gloss/02-configuration).

## Profile document

Damage and healing share `plugins/Gloss/damage-indicators/default.json`. Gloss creates it while the feature is enabled and reloads valid edits automatically.

The included document is:

```json
{
  "schemaVersion": 4,
  "revision": 1,
  "limits": {
    "maxPerSecond": 40,
    "lifetimeMs": 3000,
    "minimumDelta": 0.009,
    "decimals": 0
  },
  "damage": {
    "when": "true",
    "presentation": {
      "format": "&c&l{amount}",
      "offset": [0, 0.7, 0],
      "motion": {
        "horizontalSpeed": 0.8,
        "verticalSpeed": 1.3,
        "verticalAcceleration": -0.93,
        "spinDegreesPerSecond": 0
      },
      "transform": {
        "startScale": 1,
        "endScale": 0.82,
        "fadeStartFraction": 0.68
      },
      "particleLayers": []
    },
    "variants": []
  },
  "healing": {
    "when": "true",
    "presentation": {
      "format": "&a&l{amount}",
      "offset": [0, -0.1, 0],
      "motion": {
        "horizontalSpeed": 0.45,
        "verticalSpeed": 0.65,
        "verticalAcceleration": 0.05,
        "spinDegreesPerSecond": 0
      },
      "transform": {
        "startScale": 1,
        "endScale": 1.1,
        "fadeStartFraction": 0.62
      },
      "particleLayers": []
    },
    "variants": []
  },
  "audience": {
    "when": "hasPermission('viewer', 'gloss.indicators.show')"
  }
}
```

`limits.viewRange` sets viewing distance in blocks (default 48, range 4–128), and `limits.debounceMs` sets the minimum time between starting samples for the same target (default 150 milliseconds, range 0–60000). The limits are clamped when the document loads:

| Key | Range |
|---|---|
| `maxPerSecond` | `1`..`1000` |
| `lifetimeMs` | `250`..`30000` |
| `minimumDelta` | `0`..`1000` |
| `decimals` | `0`..`4` |
| `aggregationTicks` | `1`..`200`, default `2`; ticks from the first admitted event to the net-health reading |
| `maxPendingSamples` | `1`..`16384`, default `256`; simultaneous targets awaiting a health reading |

The base `when` condition enables each event type. The matching variant with the highest priority wins; ties use the lexicographically smallest ID. `format` accepts any authored label, icon text, formatting, function, expression, or animation. Include `{amount}` where the numeric change belongs; it is optional. `{cause}` inserts the readable damage cause, `{source}` the attacker name, and `{target}` the affected entity name. `offset` is measured from the affected entity and clamps each axis to `-32`..`32`.

Each base or variant presentation accepts full shared `style` and `box` settings. Omitted styles use center billboard, see-through text and unit XYZ scale. Style scale multiplies the indicator transform, and style opacity multiplies its fade; boxes follow motion, rotation, visibility and expiry. See [Display style and boxes](/gloss/11-icons#display-style-and-boxes).

For a text-only hit label, a presentation can use `"format": "<gold>HIT</gold>"` with no `{amount}` token. To add a frame, include `"box": {"enabled": true, "padding": 4, "borderWidth": 1}` in that same presentation. Set the presentation's `style` explicitly when changing billboard, independent scale axes, brightness, alignment, or text opacity. These fields apply equally to the base presentation and every conditional variant.

Each base or variant presentation also accepts `refresh`: optional `contentTicks`, `visibilityTicks`, and `motionTicks`, each from 1 to 1200 ticks. These control dynamic text reevaluation, viewer condition checks, and lifetime motion sampling independently. Omitted fields use the normal temporary-display cadence; updates cannot run faster than `[holograms] temporaryUpdateIntervalTicks`. Particle emission, named animation playback, and expiry retain their own clocks.

Each presentation can include particle layers that follow the indicator. A named span can limit particles to part of the format. See [Particle Layers](/gloss/25-particle-layers).

Motion fields use continuous units rather than per-tick impulses:

| Key | Range |
|---|---|
| `horizontalSpeed` | `0`..`16` blocks per second |
| `verticalSpeed` | `-16`..`16` blocks per second |
| `verticalAcceleration` | `-32`..`32` blocks per second squared |
| `spinDegreesPerSecond` | `-1440`..`1440` |

Gloss chooses a random horizontal direction when the indicator spawns. The fields above control its path and rotation over time.

`transform.startScale` and `transform.endScale` accept `0`..`16` and interpolate linearly
over the indicator lifetime. Opacity stays full until `fadeStartFraction` (`0`..`1`), then falls
linearly to zero at expiry. World, entity, source, cause and amount filtering belongs in `when`
conditions rather than a separate disabled-world list.

## Runtime behavior

<div class="gloss-demo" data-demo="damage-healing-pov">
<p><strong>Damage and healing indicators</strong> Minecraft client. Silent capture.</p>
<video src="/gloss-assets/demos/damage-healing-pov.webm" aria-label="Damage and healing indicators, first person" autoplay muted loop playsinline controls preload="metadata"></video>
<video src="/gloss-assets/demos/damage-healing-observer.webm" aria-label="Damage and healing indicators, third person" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The number is the health actually applied, not the raw event amount — armor, resistance, absorption and other plugins are all accounted for. An event neutralized to zero produces no indicator.

Events on a target during `aggregationTicks` share one net-health sample. Event metadata and the damage or healing direction come from the first admitted event. Opposing health changes cancel within that window; a net change in the opposite direction produces no indicator for that sample. Increasing the window delays the number. New targets are omitted while `maxPendingSamples` is full.

A change at or below `limits.minimumDelta` is discarded, and `limits.maxPerSecond`
caps the rate. The defaults allow about 120 indicators on screen at once; past that, new ones are
dropped. `limits.decimals` sets the displayed precision.

Reloading the profile clears current indicators; new ones use the updated presentation.

Conditions can read event values, the affected entity as `subject`, the direct damager as `source` when available, world and time values, PlaceholderAPI, and metrics. See [Expressions & Placeholders](/gloss/13-expressions-placeholders).

Paper-derived servers provide the exact `event.critical` value. Spigot sets `event.critical` and `event.criticalKnown` to `false`. Use `event.criticalKnown && event.critical` for a portable critical-hit condition.

`audience.when` decides which nearby players see an indicator. The default requires `gloss.indicators.show`.

## Web renderer

<div class="gloss-demo" data-demo="damage-indicators-editor">
<p><strong>Damage indicator authoring</strong> Browser editor. Silent capture. Browser editing and previews; game rendering is shown in the Minecraft client clips.</p>
<video src="/gloss-assets/demos/damage-indicators-editor.webm" aria-label="Damage indicator authoring, browser editor" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

The indicator stage previews damage, healing, criticals, motion, scale and fading against a rigged target. Check the final look in Minecraft — browser text and camera rendering differ from the client.

## Commands and permissions

| Permission | Default | Grants |
|---|---|---|
| `gloss.indicators.show` | `true` | This player sees damage and heal indicators |
| `gloss.indicators.reset` | `op` | `/gloss indicators reset`, which restores the default file |

`/gloss web edit damage-indicators default` opens the document. Disabling `[features] damageIndicators` removes current indicators and stops new ones; enabling it again does not require a restart.

## Reference

Indicators have no command subtree; they are configured entirely from the profile document.

The indicator profile is schema 4. Changes apply live; an invalid file is logged and the
last valid version stays active. See [Data Files & Hot Reload](/gloss/03-data-files).

See also [Chat Bubbles](/gloss/08-chat-bubbles) and [Drop Labels](/gloss/08c-drop-labels).
