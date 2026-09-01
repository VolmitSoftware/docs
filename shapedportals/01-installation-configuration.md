---
title: "Shaped Portals: Installation and configuration"
description: "Install the plugin, use the in-game editor, and find every setting"
published: true
date: 2026-09-01T00:00:00.000Z
tags: "shapedportals, installation, configuration, hot-reload"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<nav aria-label="Breadcrumb" style="display:flex;align-items:center;gap:.45rem;margin:0 0 1.5rem;padding:0 0 .85rem;border-bottom:1px solid rgba(127,127,127,.25);font-size:.9rem"><a href="/shapedportals" style="font-weight:700;text-underline-offset:.18em">Shaped Portals</a><span aria-hidden="true" style="opacity:.45">/</span><span aria-current="page" style="opacity:.72">Installation and configuration</span></nav>

Install the plugin, open its in-game editor, or edit the TOML file directly. Every setting is available in-game, and file changes reload automatically by default.

- [Install](#install)
- [In-game editor](#complete-in-game-editor)
- [Settings](#settings)
- [Languages](#language-files)
{.grid-list}

## Install

1. Stop the server and make a backup.
2. Place the Shaped Portals jar in `plugins/`.
3. Start the server and check that Shaped Portals enables without errors.
4. Run `/sp status`, then `/sp config` in-game to review the settings.
5. [Build a test portal](/shapedportals/00-overview#build-your-first-portal).

The plugin supports Spigot 1.20.1 and newer compatible servers. See [Compatibility](/shapedportals/03-compatibility-operations) for Java and Folia requirements.

### Where files live

All paths below are inside `plugins/ShapedPortals/`.

| Path | Purpose |
|---|---|
| `config.toml` | All plugin settings |
| `languages/en_US.toml` | Editable English messages, created on first start |
| `languages/<locale>.toml` | Installed translations and custom languages |
| `portals.json` | Managed portal records, created after the first saved portal |
| `debug/` | Locally saved diagnostic reports |

Do not edit `portals.json` while the server is running. Keep it with your world backups.

## In-game editor

Run `/sp config` with `shapedportals.config`. Choose General, Portal Rules, Effects, Hot Reload, Integrity, Presentation, Diagnostics, or Languages.

| Control | Action |
|---|---|
| Boolean | Click to toggle |
| Number | Left-click to increase; right-click to decrease |
| Larger adjustment | Hold Shift for 10 times the normal step |
| Exact number | Press the drop key, normally Q, then type the value in chat |
| Text or list | Click, then enter the new value in chat |
| List input | Separate entries with commas; use `none` to clear the list |
| Cancel chat entry | Type `cancel`, or wait 60 seconds without saving |

Changes are validated and saved to the same files used by the server. Invalid values leave the previous settings active.

## Live configuration behavior

By default, changes to `config.toml` and the selected language file load automatically.

- Invalid edits keep the last working settings and log the error.
- Changes from `/sp config` apply immediately.
- If hot reload is disabled, use the editor's reload control or restart the server.

## Settings

The keys below use `section.setting` notation: `portal.maximumWidth` is `maximumWidth` under `[portal]` in TOML.

Changes apply when the configuration loads. Turning off creation does not remove existing portals. Nether frame-material changes affect new portals; existing records stay active and keep a per-coordinate material snapshot for status reporting.

### General

| Setting | Default | What it changes |
|---|---|---|
| `general.enabled` | `true` | Allows new shaped portal creation; existing records remain maintained |
| `general.language` | `"en_US"` | Selects the directly editable `languages/<locale>.toml`; path characters are rejected |
| `general.requireCreatePermission` | `true` | Requires `shapedportals.create` from players creating Nether or End portals |
| `general.failureFeedback` | `true` | Explains recognized rejected candidates; unrelated fires and incomplete End frames are ignored silently |

{.dense}

### Portal rules

| Setting | Default | What it changes |
|---|---|---|
| `portal.minimumInteriorBlocks` | `2` | Smallest connected interior; range 1 to 4,096 |
| `portal.maximumInteriorBlocks` | `256` | Largest connected interior; at least the minimum and no more than 4,096 |
| `portal.maximumWidth` | `64` | Largest horizontal interior span; range 1 to 512 blocks |
| `portal.maximumHeight` | `64` | Largest vertical interior span; range 1 to 512 blocks |
| `portal.frameMaterials` | `OBSIDIAN`, `CRYING_OBSIDIAN` | Complete boundary materials accepted for new Nether portals |
| `portal.interiorMaterials` | air variants, `FIRE`, `SOUL_FIRE` | Replaceable Nether creation and repair cells |
| `portal.ignitionCauses` | `FLINT_AND_STEEL`, `FIREBALL`, `PLACED_FIRE` | Accepted Bukkit ignition causes |
| `portal.allowedWorlds` | empty | Optional case-insensitive allow-list |
| `portal.deniedWorlds` | empty | Case-insensitive deny-list; takes priority |
| `portal.deduplicationMillis` | `1500` | Coalesces duplicate events at one block; range 0 to 60,000 ms |
| `portal.endPortalCreation` | `true` | Enables managed non-vanilla End portal creation from a completed eyed frame |
| `portal.endMinimumInteriorBlocks` | `1` | Smallest connected horizontal End interior; range 1 to 4,096 |
| `portal.endMaximumInteriorBlocks` | `256` | Largest connected horizontal End interior; range 1 to 4,096 |
| `portal.endMaximumWidth` | `64` | Largest X span; range 1 to 512 blocks |
| `portal.endMaximumLength` | `64` | Largest Z span; range 1 to 512 blocks |
| `portal.endInteriorMaterials` | air variants | Replaceable End creation and repair cells; `END_PORTAL` is recognized automatically |

{.dense}

Material lists must contain block materials. Nether frame and interior lists must not overlap, and `NETHER_PORTAL` is not replaceable. End interiors cannot include `END_PORTAL`, `END_PORTAL_FRAME`, or `NETHER_PORTAL`. Both dimensions and total area must fit the configured limits. Denied worlds take priority over allowed worlds; an empty allow-list permits any world not denied.

End frame material is fixed to `END_PORTAL_FRAME`, and every recorded frame must keep its eye. The End settings control the horizontal interior and its limits; they do not change vanilla 3×3 activation.

Removing a material from `portal.frameMaterials` does not disable existing portals. Their entries in `/sp portals` identify recorded materials no longer allowed for new frames.

### Effects

| Setting | Default | What it changes |
|---|---|---|
| `effects.creationSound` | `true` | Plays the Nether sound only after successful commit |
| `effects.creationSoundType` | `minecraft:block.portal.trigger` | Nether Bukkit sound identifier or namespaced key |
| `effects.creationSoundVolume` | `0.6` | Nether volume; range 0.0–4.0 |
| `effects.creationSoundPitch` | `0.67` | Nether pitch; range 0.5–2.0 |
| `effects.endCreationSound` | `true` | Plays the End sound only after successful custom creation |
| `effects.endCreationSoundType` | `minecraft:block.end_portal.spawn` | End Bukkit sound identifier or namespaced key |
| `effects.endCreationSoundVolume` | `0.8` | End volume; range 0.0–4.0 |
| `effects.endCreationSoundPitch` | `1.0` | End pitch; range 0.5–2.0 |

{.dense}

### Hot reload

| Setting | Default | What it changes |
|---|---|---|
| `hotReload.enabled` | `true` | Watches the active config and language files |
| `hotReload.pollIntervalMillis` | `1000` | Watch poll interval; range 250–60,000 ms |
| `hotReload.cooldownMillis` | `1500` | Stable-edit debounce; range 250–60,000 ms |
| `hotReload.notifyOperators` | `true` | Sends permission-filtered cooperative action-bar results after automatic reloads |

{.dense}

### Integrity

| Setting | Default | What it changes |
|---|---|---|
| `integrity.enabled` | `true` | Repairs or deactivates managed portal records |
| `integrity.checkIntervalTicks` | `200` | Periodic sweep interval; range 20–72,000 ticks |
| `integrity.maximumChecksPerCycle` | `32` | Bounded records queued per sweep; range 1–1,024 |

{.dense}

Integrity checks skip unloaded portal chunks. See [Repair-based integrity](/shapedportals/02-portal-behavior-events#repair-based-integrity) before changing these options.

### Presentation

| Setting | Default | What it changes |
|---|---|---|
| `presentation.splashScreen` | `true` | Shows the console banner during startup |
| `presentation.commandSounds` | `true` | Plays themed success or failure sounds for player commands |
| `presentation.commandOverlays` | `ACTION_BAR` | Optional command overlays: `ACTION_BAR`, `TITLE`, `BOSS_BAR`; chat always remains enabled |
| `presentation.portalNotices` | `ACTION_BAR` | Portal rejection channels: `CHAT`, `ACTION_BAR`, `TITLE`, `BOSS_BAR`; empty disables notices |
| `presentation.netherCreationNotices` | `ACTION_BAR` | Successful Nether creation channels; empty disables the message |
| `presentation.endCreationNotices` | `ACTION_BAR` | Successful End creation channels; empty disables the message |
| `presentation.overlayDurationTicks` | `50` | Transient overlay lifetime; range 10–600 ticks |
| `presentation.titleFadeInTicks` | `5` | Title fade in; range 0–200 ticks |
| `presentation.titleStayTicks` | `30` | Title visible time; range 1–600 ticks |
| `presentation.titleFadeOutTicks` | `10` | Title fade out; range 0–200 ticks |

{.dense}

Command results stay in chat even when an extra overlay is enabled. Creation notice text and the type-specific title heading are edited under Languages in the GUI. Action bars and titles cooperate with other VolmLib plugins; boss bars are short-lived and cleaned up automatically.

### Anonymous metrics

| Setting | Default | What it changes |
|---|---|---|
| `metrics.enabled` | `true` | Enables anonymous bStats metrics for plugin ID `33267`; changes apply immediately and the global bStats opt-out remains authoritative |

{.dense}

The global opt-out in `plugins/bStats/config.yml` takes priority. [React integration](/shapedportals/03-compatibility-operations#react-plugin-api-pack) is separate.

### Diagnostic reports

| Setting | Default | What it changes |
|---|---|---|
| `debug.uploadEnabled` | `true` | Upload locally saved `/sp debug` reports to the public mclo.gs service and return a clickable link |

{.dense}

**Uploads are public.** Disable this setting before running `/sp debug` for local-only reports. See [Diagnostic command and privacy notes](/shapedportals/00-overview#create-a-diagnostic-report).

Reports contain server, plugin, configuration, portal, performance, and system details. A local copy is saved before upload.

## Language files

Run `/sp language` to select a language, or use Languages inside `/sp config` to edit its messages.

Available locales:

`en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, `zh_TW`.

### Select a language

The picker shows locale IDs and language names. Missing repository translations download only when selected or opened for editing. The console logs the source URL before transfer and the installed path afterward. Selection completes only after validation succeeds; a failed download keeps the current language.

Installed files work offline and are not replaced automatically. You can also create a custom locale based on English.

### Edit messages

1. Open `/sp config` and choose Languages.
2. Select a locale and left-click a message.
3. Type the replacement in chat, keeping its required placeholders. Use `\n` for a line break.
4. Check the saved result, which shows the previous and new values.

Editing the active locale applies immediately. Editing a different locale updates its file without switching languages. Changes are written directly to `languages/<locale>.toml`; there is no separate overrides file or folder.

### Colors and placeholders

Messages accept classic colors such as `&c`, formatting such as `&l`, RGB colors, and MiniMessage. Each language file's header explains the available placeholders.

`runtime.prefix` sets the prefix. Remove the optional `{prefix}` token from an individual message to hide it there. Other placeholders required by that message must stay intact.

Missing messages fall back to English. Invalid formatting or missing required placeholders rejects the edit and keeps the last working language file.

## Related pages

- [Build and command *Portal creation, commands, and permissions*](/shapedportals/00-overview)
- [Portal behavior *Integrity, protection plugins, and troubleshooting*](/shapedportals/02-portal-behavior-events)
- [Developer reference *Geometry, persistence, and build details*](/shapedportals/04-architecture-limits)
{.links-list}
