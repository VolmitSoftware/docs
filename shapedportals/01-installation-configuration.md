---
title: "Shaped Portals: Installation & Configuration"
description: "Install the plugin, use the in-game editor, and find every setting"
published: true
date: 2026-08-30T00:00:00.000Z
tags: "shapedportals, installation, configuration, hot-reload"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<style>
.sp-reference { max-width: 1120px; margin: 0 auto; line-height: 1.7; }
.sp-reference h2 { margin-top: 2.4rem; padding-bottom: .5rem; border-bottom: 1px solid rgba(127,127,127,.25); font-size: 1.5rem; scroll-margin-top: 5rem; }
.sp-reference h3 { margin-top: 1.6rem; scroll-margin-top: 5rem; }
.sp-reference .sp-nav { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0 0 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(127,127,127,.25); }
.sp-reference .sp-nav a { display: block; padding: .4rem .75rem; border: 1px solid transparent; border-radius: 6px; text-decoration: none; color: inherit; font-size: .9rem; }
.sp-reference .sp-nav a:hover, .sp-reference .sp-nav a[aria-current="page"] { background: rgba(146,93,198,.12); border-color: rgba(146,93,198,.35); }
.sp-reference a:focus-visible, .sp-reference summary:focus-visible { outline: 3px solid #a66bdd; outline-offset: 3px; }
.sp-reference table { width: 100%; display: table; table-layout: fixed; border-collapse: collapse; font-size: .93rem; }
.sp-reference th, .sp-reference td { padding: .8rem; vertical-align: top; text-align: left; overflow-wrap: anywhere; border: 1px solid rgba(127,127,127,.22); }
.sp-reference th:first-child { width: 32%; }
.sp-reference .sp-commands th:first-child { width: 35%; }
.sp-reference .sp-commands th:last-child { width: 20%; }
.sp-reference .sp-permissions th:first-child { width: 40%; }
.sp-reference .sp-permissions th:nth-child(2) { width: 18%; }
.sp-reference .sp-settings th:first-child { width: 35%; }
.sp-reference .sp-settings th:nth-child(2) { width: 22%; }
.sp-reference th { background: rgba(146,93,198,.09); }
.sp-reference td code { white-space: normal; overflow-wrap: anywhere; }
.sp-reference pre { max-width: 100%; overflow-x: auto; }
.sp-reference .sp-media { min-height: 170px; margin: 1.3rem 0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: .4rem; border: 1px dashed rgba(127,127,127,.5); border-radius: 8px; background: rgba(146,93,198,.04); text-align: center; }
.sp-reference .sp-media span { max-width: 42rem; font-size: .9rem; }
.sp-reference blockquote, .sp-reference .sp-caution { margin: 1.3rem 0; padding: .9rem 1.1rem; border: 1px solid rgba(127,127,127,.35); border-radius: 6px; background: rgba(127,127,127,.05); color: inherit; }
.sp-reference blockquote p, .sp-reference .sp-caution p { margin: 0; }
.sp-reference details { margin: 1rem 0; padding: .85rem 1rem; border: 1px solid rgba(127,127,127,.3); border-radius: 6px; }
.sp-reference summary { cursor: pointer; font-weight: 600; }
.sp-reference details[open] summary { margin-bottom: .8rem; }
.sp-reference .sp-related { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid rgba(127,127,127,.25); }
@media (max-width: 600px) {
  .sp-reference table, .sp-reference tbody { display: block; }
  .sp-reference thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .sp-reference tr { display: block; margin: .7rem 0; padding: .3rem 0; border: 1px solid rgba(127,127,127,.25); border-radius: 6px; }
  .sp-reference td { display: block; width: auto; padding: .4rem .8rem; border: 0; font-size: .92rem; }
  .sp-reference td:first-child { font-weight: 600; }
  .sp-reference td::before { font-weight: 600; }
  .sp-reference .sp-commands td:nth-child(3)::before { content: "Run from: "; }
  .sp-reference .sp-permissions td:nth-child(2)::before, .sp-reference .sp-settings td:nth-child(2)::before { content: "Default: "; }
  .sp-reference .sp-nav { gap: .15rem; }
  .sp-reference .sp-nav a { padding: .4rem .5rem; }
}
</style>

<div class="sp-reference">
<nav class="sp-nav" aria-label="Shaped Portals guides"><a href="/shapedportals">Home</a><a href="/shapedportals/00-overview">Build &amp; commands</a><a href="/shapedportals/01-installation-configuration" aria-current="page">Configuration</a><a href="/shapedportals/02-portal-behavior-events">Portal behavior</a><a href="/shapedportals/03-compatibility-operations">Server setup</a></nav>

Install the plugin, open its in-game editor, or edit the TOML file directly. Every setting is available in-game, and file changes reload automatically by default.

[Install](#install) · [In-game editor](#complete-in-game-editor) · [Settings](#settings) · [Languages](#language-files)

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

Changes apply when the configuration loads. Turning off creation does not remove existing portals. Frame-material changes affect new portals; existing ones keep their recorded boundary requirements.

### General

| Setting | Default | What it changes |
|---|---|---|
| `general.enabled` | `true` | Allows new shaped portal creation; existing records remain maintained |
| `general.language` | `"en_US"` | Selects the directly editable `languages/<locale>.toml`; path characters are rejected |
| `general.requireCreatePermission` | `true` | Requires `shapedportals.create` from player igniters |
| `general.failureFeedback` | `true` | Explains rejected portal candidates to player igniters; unrelated terrain fires are ignored silently |

{.sp-settings}

### Portal rules

| Setting | Default | What it changes |
|---|---|---|
| `portal.minimumInteriorBlocks` | `2` | Smallest connected interior; range 1 to 4,096 |
| `portal.maximumInteriorBlocks` | `256` | Largest connected interior; at least the minimum and no more than 4,096 |
| `portal.maximumWidth` | `64` | Largest horizontal interior span; range 1 to 512 blocks |
| `portal.maximumHeight` | `64` | Largest vertical interior span; range 1 to 512 blocks |
| `portal.frameMaterials` | `OBSIDIAN`, `CRYING_OBSIDIAN` | Complete boundary materials accepted for new portals |
| `portal.interiorMaterials` | air variants, `FIRE`, `SOUL_FIRE` | Replaceable creation and repair cells |
| `portal.ignitionCauses` | `FLINT_AND_STEEL`, `FIREBALL`, `PLACED_FIRE` | Accepted Bukkit ignition causes |
| `portal.allowedWorlds` | empty | Optional case-insensitive allow-list |
| `portal.deniedWorlds` | empty | Case-insensitive deny-list; takes priority |
| `portal.deduplicationMillis` | `1500` | Coalesces duplicate events at one block; range 0 to 60,000 ms |

{.sp-settings}

Material lists must contain block materials, must not overlap, and cannot include `NETHER_PORTAL` as a replaceable interior. Both dimensions and total area must fit the configured limits. Denied worlds take priority over allowed worlds; an empty allow-list permits any world not denied.

Removing a material from `portal.frameMaterials` does not disable existing portals. Their entries in `/sp portals` identify recorded materials no longer allowed for new frames.

### Effects

| Setting | Default | What it changes |
|---|---|---|
| `effects.creationSound` | `true` | Plays a sound only after successful commit |
| `effects.creationSoundType` | `minecraft:block.end_portal.spawn` | Bukkit sound identifier or namespaced key |
| `effects.creationSoundVolume` | `0.6` | Range 0.0–4.0 |
| `effects.creationSoundPitch` | `0.67` | Range 0.5–2.0 |

{.sp-settings}

### Hot reload

| Setting | Default | What it changes |
|---|---|---|
| `hotReload.enabled` | `true` | Watches the active config and language files |
| `hotReload.pollIntervalMillis` | `1000` | Watch poll interval; range 250–60,000 ms |
| `hotReload.cooldownMillis` | `1500` | Stable-edit debounce; range 250–60,000 ms |
| `hotReload.notifyOperators` | `true` | Sends permission-filtered cooperative action-bar results after automatic reloads |

{.sp-settings}

### Integrity

| Setting | Default | What it changes |
|---|---|---|
| `integrity.enabled` | `true` | Repairs or deactivates managed portal records |
| `integrity.checkIntervalTicks` | `200` | Periodic sweep interval; range 20–72,000 ticks |
| `integrity.maximumChecksPerCycle` | `32` | Bounded records queued per sweep; range 1–1,024 |

{.sp-settings}

Integrity checks skip unloaded portal chunks. See [Repair-based integrity](/shapedportals/02-portal-behavior-events#repair-based-integrity) before changing these options.

### Presentation

| Setting | Default | What it changes |
|---|---|---|
| `presentation.splashScreen` | `true` | Shows the console banner during startup |
| `presentation.commandSounds` | `true` | Plays themed success or failure sounds for player commands |
| `presentation.commandOverlays` | `ACTION_BAR` | Optional command overlays: `ACTION_BAR`, `TITLE`, `BOSS_BAR`; chat always remains enabled |
| `presentation.portalNotices` | `ACTION_BAR` | Portal notice channels: `CHAT`, `ACTION_BAR`, `TITLE`, `BOSS_BAR`; empty disables notices |
| `presentation.overlayDurationTicks` | `50` | Transient overlay lifetime; range 10–600 ticks |
| `presentation.titleFadeInTicks` | `5` | Title fade in; range 0–200 ticks |
| `presentation.titleStayTicks` | `30` | Title visible time; range 1–600 ticks |
| `presentation.titleFadeOutTicks` | `10` | Title fade out; range 0–200 ticks |

{.sp-settings}

Command results stay in chat even when an extra overlay is enabled. Action bars and titles cooperate with other VolmLib plugins; boss bars are short-lived and cleaned up automatically.

### Anonymous metrics

| Setting | Default | What it changes |
|---|---|---|
| `metrics.enabled` | `true` | Enables anonymous bStats metrics for plugin ID `33267`; changes apply immediately and the global bStats opt-out remains authoritative |

{.sp-settings}

The global opt-out in `plugins/bStats/config.yml` takes priority. [React integration](/shapedportals/03-compatibility-operations#react-plugin-api-pack) is separate.

### Diagnostic reports

| Setting | Default | What it changes |
|---|---|---|
| `debug.uploadEnabled` | `true` | Upload locally saved `/sp debug` reports to the public mclo.gs service and return a clickable link |

{.sp-settings}

**Uploads are public.** Disable this setting before running `/sp debug` for local-only reports. See [Diagnostic command and privacy notes](/shapedportals/00-overview#create-a-diagnostic-report).

Reports contain server, plugin, configuration, portal, performance, and system details. A local copy is saved before upload.

## Language files

Run `/sp language` to select a language, or use Languages inside `/sp config` to edit its messages.

Available locales:

`en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`, `he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`, `ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, `zh_TW`.

### Select a language

The picker shows locale IDs and language names. Missing repository translations download only when selected or opened for editing. Selection completes only after validation succeeds; a failed download keeps the current language.

Installed files work offline and are not replaced automatically. You can also create a custom locale based on English.

### Edit messages

1. Open `/sp config` and choose Languages.
2. Select a locale and left-click a message.
3. Type the replacement in chat, keeping its required placeholders. Use `\n` for a line break.
4. Check the saved result, which shows the previous and new values.

Editing the active locale applies immediately. Editing a different locale updates its file without switching languages.

### Colors and placeholders

Messages accept classic colors such as `&c`, formatting such as `&l`, RGB colors, and MiniMessage. Each language file's header explains the available placeholders.

`runtime.prefix` sets the prefix. Remove the optional `{prefix}` token from an individual message to hide it there. Other placeholders required by that message must stay intact.

Missing messages fall back to English. Invalid formatting or missing required placeholders rejects the edit and keeps the last working language file.

<div class="sp-related"><a href="/shapedportals/00-overview">Commands &amp; permissions</a> · <a href="/shapedportals/02-portal-behavior-events">Portal behavior &amp; troubleshooting</a></div>

</div>
