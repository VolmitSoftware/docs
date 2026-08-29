---
title: "Shaped Portals — Installation & Configuration"
description: "Installation, typed TOML, hot reload, language files, and the in-game editor"
published: true
date: 2026-08-29T18:50:52.000Z
tags: "shapedportals, installation, configuration, hot-reload"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

Version 2.0 uses one Java 17 artifact with a Bukkit 1.20 API floor. First start
creates a documented TOML configuration and generated English language file,
makes 17 verified repository translations available on demand, and creates the portal store
as soon as the first managed portal is written.

## Install

1. Stop the server and back it up.
2. Put `ShapedPortals-2.0.0.jar` in `plugins/`.
3. Start the server and confirm the enable line reports the expected Bukkit or
   Folia scheduler.
4. Review `plugins/ShapedPortals/config.toml`.
5. Test vanilla and shaped portals in an isolated area before production use.

## Live configuration behavior

The runtime uses an immutable validated snapshot. File watching and parsing run
off the gameplay thread. A stable edit installs only after both `config.toml`
and the selected language file validate; otherwise the last known good pair
remains active and the complete exception is logged.

`config.toml` and the currently active language file are watched automatically;
inactive locale files do not trigger runtime reloads. There is no manual reload
command. GUI edits are written on a dedicated I/O worker, validate the complete typed configuration, atomically
replace `config.toml`, suppress their own duplicate watch event, and return the
result on the player's owning scheduler in the same Director banner, arrow-row,
and footer layout as command help. A repository language selection first
downloads, parses, and validates the requested catalog. Configuration persistence
and language activation are one serialized transaction, so a concurrent watcher
reload cannot restore an older locale. The
locale is persisted only after that succeeds, so transport or validation failure
leaves both `config.toml` and the active language unchanged. The player-facing
failure identifies the locale they attempted to select instead of the setting's
generic display name. Invalid files are never replaced with defaults.

## Settings

| Key | Default | Behavior |
|---|---:|---|
| `general.enabled` | `true` | Allows new shaped portal creation; existing records remain maintained |
| `general.language` | `"en_US"` | Selects the directly editable `languages/<locale>.toml`; path characters are rejected |
| `general.requireCreatePermission` | `true` | Requires `shapedportals.create` from player igniters |
| `general.failureFeedback` | `true` | Explains rejected portal candidates to player igniters; unrelated terrain fires are ignored silently |
| `metrics.enabled` | `true` | Enables anonymous bStats metrics for plugin ID `33267`; changes apply immediately and the global bStats opt-out remains authoritative |
| `portal.minimumInteriorBlocks` | `2` | Smallest connected interior |
| `portal.maximumInteriorBlocks` | `256` | Largest connected interior; hard maximum 4,096 |
| `portal.maximumWidth` | `64` | Largest horizontal interior span; hard maximum 512 |
| `portal.maximumHeight` | `64` | Largest vertical interior span; hard maximum 512 |
| `portal.frameMaterials` | `OBSIDIAN`, `CRYING_OBSIDIAN` | Complete boundary materials accepted for new portals |
| `portal.interiorMaterials` | air variants, `FIRE`, `SOUL_FIRE` | Replaceable creation and repair cells |
| `portal.ignitionCauses` | `FLINT_AND_STEEL`, `FIREBALL`, `PLACED_FIRE` | Accepted Bukkit ignition causes |
| `portal.allowedWorlds` | empty | Optional case-insensitive allow-list |
| `portal.deniedWorlds` | empty | Case-insensitive deny-list; takes priority |
| `portal.deduplicationMillis` | `1500` | Coalesces duplicate events at one block |
| `effects.creationSound` | `true` | Plays a sound only after successful commit |
| `effects.creationSoundType` | `minecraft:block.end_portal.spawn` | Bukkit sound identifier or namespaced key |
| `effects.creationSoundVolume` | `0.6` | Range 0.0–4.0 |
| `effects.creationSoundPitch` | `0.67` | Range 0.5–2.0 |
| `hotReload.enabled` | `true` | Watches the active config and language files |
| `hotReload.pollIntervalMillis` | `1000` | Watch poll interval; range 250–60,000 ms |
| `hotReload.cooldownMillis` | `1500` | Stable-edit debounce; range 250–60,000 ms |
| `hotReload.notifyOperators` | `true` | Sends permission-filtered cooperative action-bar results after automatic reloads |
| `integrity.enabled` | `true` | Repairs or deactivates managed portal records |
| `integrity.checkIntervalTicks` | `200` | Periodic sweep interval; range 20–72,000 ticks |
| `integrity.maximumChecksPerCycle` | `32` | Bounded records queued per sweep; range 1–1,024 |
| `presentation.splashScreen` | `true` | Prints the console startup banner after services are ready |
| `presentation.commandSounds` | `true` | Plays themed success or failure sounds for player commands |
| `presentation.commandOverlays` | `ACTION_BAR` | Optional command overlays: `ACTION_BAR`, `TITLE`, `BOSS_BAR`; chat always remains enabled |
| `presentation.portalNotices` | `ACTION_BAR` | Portal notice channels: `CHAT`, `ACTION_BAR`, `TITLE`, `BOSS_BAR`; empty disables notices |
| `presentation.overlayDurationTicks` | `50` | Transient overlay lifetime; range 10–600 ticks |
| `presentation.titleFadeInTicks` | `5` | Title fade in; range 0–200 ticks |
| `presentation.titleStayTicks` | `30` | Title visible time; range 1–600 ticks |
| `presentation.titleFadeOutTicks` | `10` | Title fade out; range 0–200 ticks |
| `debug.uploadEnabled` | `true` | Upload locally saved `/sp debug` reports to the public mclo.gs service and return a clickable link |

Material names must resolve to block materials. Frame and interior lists may not
overlap, and `NETHER_PORTAL` is prohibited as a replaceable interior material.
Every successful portal records the material at each frame coordinate. Removing
a material from the active configuration therefore affects only new creation;
existing portals retain their recorded frame requirements and are annotated in
`/sp portals` when their material is no longer allowed for new portals.

## Language files

Each installed locale has one authoritative file at
`languages/<locale>.toml`. English is generated only when its file is missing;
afterward both manual changes and in-game edits remain in that same file. ShapedPortals
offers `en_US`, `de_DE`, `es_ES`, `fi_FI`, `fr_FR`,
`he_IL`, `it_IT`, `ja-JP`, `ko_KR`, `lt_LT`, `nl_NL`, `pl_PL`, `pt_PT`,
`ru_RU`, `tr_TR`, `vi_VI`, `zh_CN`, and `zh_TW`.

The jar contains the supported locale names and follows the repository's `main`
language directory instead of embedding the 17 translation files. A non-English
locale downloads the latest `src/main/resources/languages/<locale>.toml` only when
it is selected or opened in the Languages editor and the corresponding local file
does not exist. Downloads are bounded, strict UTF-8, validated for every message
required by the running jar, and atomically installed at that direct path without
replacing a file created or edited during the transfer. Extra keys added by newer
plugin versions are ignored by older jars. Once installed, the local file works
offline and is never automatically refreshed or overwritten. Missing, corrupt, unavailable, or
rejected content leaves code-owned English or the last-good snapshot active and
never prevents plugin enablement. The console identifies the locale and full source
URL when a transfer starts, then reports only the locale and validated file's
absolute destination when installation finishes. A failed fetch identifies both the locale and complete
source URL, and immediate duplicate requests for that locale are suppressed for 30 seconds.
Concurrent requests for the same locale share one transfer and every waiting
selection receives the verified result.

Resolution order is the selected direct file, then code-owned English. Message
IDs are laid out as native TOML tables such as `[runtime]`,
`[command.feedback.reload]`, and `[portal.navigation.list]`, matching Adapt's
sectioned catalogs. Files may be complete or sparse. Manual edits are left
byte-for-byte unchanged during normal loading and hot reload; saving through the
language GUI canonicalizes the TOML tables into leaf sections with column-zero
assignments while preserving the leading comment block, values, and unknown
entries. A typed custom locale is seeded from English and then behaves like any
other direct language file.

Shipped messages use classic `&0`–`&f` colors and `&k`–`&r` formatting, such
as `&c` for red and `&l` for bold. Custom values also accept `&#RRGGBB`,
compact `&xRRGGBB`, expanded `&x&R&R&G&G&B&B`, bracket RGB such as
`[6f35c5]`, direct section codes, and optional MiniMessage tags including gradients.
Prefix `&` or `[` with `\` when the marker should be displayed literally.
Retired and otherwise unknown keys are ignored and left untouched.
Wrong types for current keys, placeholder drift, placeholders inside MiniMessage
tags, or invalid markup reject only that reload and leave the last valid language
active. Publisher-owned downloads are stricter and must contain the exact current
catalog. Untrusted user and world substitutions are escaped before
rendering, including legacy color markers, so they cannot inject click, hover,
or formatting actions.

`runtime.prefix` defines the global prefix text. Sender-facing message defaults
place `{prefix}` directly where that prefix should appear. The token is optional:
remove it from any individual message to suppress the prefix only for that
message. HUD, GUI-label, help-row, portal-card, and hover entries omit it by
default so cooperative overlays and menus remain uncluttered. All other
message-specific placeholders remain required.

The generated English file and each repository source have a leading
comment block that documents every placeholder known to the current catalog,
explains its value, and states that a placeholder is valid only in messages
where it is already present.

The General editor combines the repository manifest choices with safe custom
`.toml` files discovered directly in `languages/`. Clicking Active language locale or
running `/sp language` opens the same paginated Director-style chat menu, marks
the current selection, and provides hoverable click-to-select entries showing
both locale identifiers and full language names. The editor-origin picker keeps
a 60-second typed-input prompt and returns to the editor only for typed completion,
cancellation, or timeout. The command-origin picker has no prompt or timer, and
clicking or entering `/sp language <locale>` never opens the configuration GUI.
All selection paths wait for a required repository download before changing the
configuration, then apply the selected locale automatically without requiring a
second click. Selecting a locale does not proactively write the other catalogs.

## Complete in-game editor

`/sp config` opens a 54-slot General, Portal Rules, Effects, Hot Reload, Integrity,
Presentation, Diagnostics, and Languages menu. All 35 persisted configuration fields are present. Lists accept
comma-separated values and the word `none` for an empty list. Text and exact
numeric prompts may be cancelled with `cancel` and expire without changing the
configuration after 60 seconds. The language field uses the clickable and typed
locale picker described above. Whole-config validation prevents an individual
edit from installing an invalid material, sound, channel, range, or list.

The Languages section is a separate paginated editor for the complete registered
message catalog, including plugin and shared command/help messages. Select a locale,
then left-click a message ID and type its replacement in chat; `\n` inserts a line
break. Each item uses a bounded, legacy-format-aware multiline preview so long
templates do not create screen-wide tooltips. Clicking an item opens a Director-style
chat prompt whose header rail is sized to the same visual width as its footer, with
the message ID and its current value rendered with the selected
locale's formatting, the exact sorted `{placeholder}` tokens available to that
message, representative placeholder labels, and the cancellation instruction.
After a successful edit, the Director result reports both the formatted previous
value and the formatted installed value. The value is markup- and placeholder-validated before the selected
`languages/<locale>.toml` is atomically updated. If the repository locale has not
been installed, opening it first downloads and verifies that one file. Editing the
active locale installs the validated result immediately; editing another locale
changes its file without selecting it. GUI-owned writes are excluded from the
hot-reload watcher so one edit produces one installation and one result message.

## Anonymous metrics

ShapedPortals uses bStats plugin ID `33267`. `metrics.enabled` is an additional
plugin-local opt-out and is enabled by default; changing it through the General
editor or file watching starts or stops the metrics runtime without
a restart. The upstream global switch in `plugins/bStats/config.yml` is still
checked by the official Metrics implementation and overrides the local setting.
Only the standard bStats platform and plugin payload is submitted; ShapedPortals
does not register custom charts. The bundled single-file Metrics source is kept
identical to the official upstream file except for its package declaration.

## Diagnostic reports

`/sp debug` first captures an immutable Bukkit and ShapedPortals snapshot on the
global scheduler, then renders, hashes, writes, and optionally uploads the
report off the gameplay thread. Every run saves a timestamped text file under
`plugins/ShapedPortals/debug/`; only one report may be generated at a time.

The report includes server and API versions, operating rules, scheduler task
counts, TPS and MSPT, plugin metadata, portal-registry aggregates and per-record
health data, loaded and unavailable portal-world reference counts, bounded
creation-rejection reasons, service state, effective settings, the language-source
reference and selected source-file state, JVM/process/charset/time-zone
state, heap and memory pools, garbage collectors, CPU load and time, physical and
virtual memory, swap, file descriptors, filesystem capacity, selected
language/config/store metadata and SHA-256 hashes, and the plugin artifact
filename, size, timestamp, and SHA-256.

`debug.uploadEnabled` is enabled by default for newly generated configurations.
Existing configurations retain their saved value. Running `/sp debug` always
saves the report locally first, then sends the same report over HTTPS to the
public third-party mclo.gs service and returns a clickable link when upload is
enabled. Disable the setting in the Diagnostics editor or `config.toml` for
local-only reports. A failed upload never removes the local file. ShapedPortals
does not retain the service deletion credential, so an uploaded report cannot
be removed through the plugin.

## Build from source

The Gradle 9.5.1 wrapper runs with the workspace JDK 25 toolchain and emits Java
17 bytecode:

```text
./gradlew build
```

The shaded plugin is `build/libs/ShapedPortals-2.0.0.jar`. `check` also compiles
the source against current Paper 26.1.2 and Spigot 26.2 APIs, then verifies that
every shaded class remains Java 17 bytecode, VolmLib was relocated, no locale
TOML was packaged, and the generated remote-source manifest matches all 17
repository TOML sources. The manifest pins the current Git commit while hashing
the working locale sources, so a distributable build must use a commit where
those exact files are already available from the public repository.

Next: [Portal Behavior & Events](/shapedportals/02-portal-behavior-events)
