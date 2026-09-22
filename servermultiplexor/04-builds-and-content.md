---
title: "Builds and content"
description: "Server build caches, shared drop-ins, addons, and managed downloads"
published: true
date: 2026-09-21T00:00:00.000Z
tags: "servermultiplexor"
editor: markdown
dateCreated: 2026-09-21T00:00:00.000Z
---

Cache server builds and install plugins or mods through shared drop-ins, per-instance addon selections, or managed content downloads. Commands use the active consumer unless stated otherwise.

## Server builds

| Command | Behavior |
|---------|--------------|
| `build <type> [--mc <v>] [--loader <v>] [--installer <v>] [--force]` | Download/build a jar, refresh upstream, and prune superseded builds. Without `--mc`, fall back to the next supported version if the newest advertised version has no artifact (common for Folia). Spigot reuses cache only when it matches the resolved Jenkins build; failed lookup or `--force` runs BuildTools. |
| `build latest <type>` | Print the latest supported MC version for `<type>`. |
| `build versions [type]` | Print all supported versions. |
| `build cache-info [type] [--mc <v>]` | Machine-readable jar-cache report: one `<type>\t<jar>\t<ageSeconds>` line per cached jar, newest first. Drives the wizard's automatic refresh decisions and its "builds updated" footer. |
| `build list` | Show what's in the active profile's cache. |
| `build list-all [type]` | Show cache contents across profiles. |
| `build test-latest [--spigot-mc <v>]` | Sanity-check the latest of every type with up to four concurrent builds, spigot included. `--spigot-mc` pins spigot to its own version, since it lags the others on a fresh Minecraft release. |
| `build prune [all\|type]` | Sweep every consumer's build cache: drop superseded jars and remove leftover BuildTools work directories. Builds prune themselves, so this is only needed to clean up history. |

Minecraft 26.3 uses the same discovery/download commands; each upstream controls availability. NeoForge maps loader `26.3.0.7-beta` to game `26.3` and selects the exact game version. Explicit versions and cache filters match fully: `26.3` cannot select `26.3.1`. Available alpha/beta builds may be selected.

Caches retain the newest jar per Minecraft version plus every jar still used by an instance. Successful builds remove superseded builds of the same version; other versions stay cached. Instances remain pinned until updated.

BuildTools checks the Java selected in consumer runtime settings before compiling. Combined output goes to `state/build-logs/`; failures report exit code, relevant stdout/stderr, and log path. Its temporary decompiled-source directories are roughly 700 MB each. Successful compiles remove their directory; `build prune` clears interrupted leftovers.

```bash
./start.sh --consumer plugin build paper --mc 26.3
```

## Upstream repositories

| Command | Behavior |
|---------|--------------|
| `repos sync [all\|paper\|purpur\|folia\|canvas\|leaf]` | Clone or pull upstream repos used for version discovery, with up to four repos concurrently for `all`. Build commands resolve metadata over HTTP, so this is mostly used for Spigot/BuildTools. |

## Plugin and mod drop-ins

The two namespaces are mirrors. Use `plugins` when the active consumer is `plugin`; use `mods` for any of the mod consumers. Both refuse the wrong consumer.

| Command | Behavior |
|---------|--------------|
| `plugins show-source` (or `mods show-source`) | Print the absolute dropin folder. |
| `plugins sync [instance\|--all] [--clean]` | Authoritatively copy dropins into one instance or every instance, replacing same-name local jars. `--clean` clears existing jars first. Isolated instances are skipped with `[SKIP]`. `mods sync` on Mohist refreshes every persisted source, including tracked plugin dropins. |
| `plugins copy <isolated-instance> --artifact <dropin.jar> [...]` | Copy only the selected drop-in jars into an existing isolated instance without subscribing it to automatic sync. The `mods` form behaves the same way for mod consumers. |
| `plugins watch-start` | Start a background daemon that re-syncs whenever a dropin jar changes. Untouched previously synchronized jars update automatically; locally modified jars are preserved with a warning. |
| `plugins watch-stop` | Stop the watcher daemon. |
| `plugins watch-status` | Print whether the watcher is running. |
| `plugins iris-packs-path` | Print the shared Iris packs directory (`plugin` consumer only). |
| `plugins iris-packs-link [instance\|--all]` | Symlink the shared Iris packs into an instance's `plugins/iris/packs`. Isolated instances are skipped. |

## Per-instance addons

Bundled entries are server plugins; Forge, Fabric, NeoForge, and Mohist accept explicitly compatible custom entries.

| Addons | Eligible server types | Installed filenames |
|---|---|---|
| EssentialsX core, FastAsyncWorldEdit (FAWE) | Paper, Purpur, Leaf, Spigot | `EssentialsX.jar`, `FastAsyncWorldEdit.jar` |
| BlueMap, ViaVersion, ViaBackwards, ProtocolLib | Above plus Folia and Canvas | `BlueMap.jar`, `ViaVersion.jar`, `ViaBackwards.jar`, `ProtocolLib.jar` |

Platform eligibility is checked first. Modrinth requires an exact published Minecraft match and stable release, preferring Paper artifacts for Paper derivatives.

Creation records the Minecraft version before imported jars are renamed. Existing instances also detect it from canonical jar filenames or symlink targets. `--mc` overrides detection. `addons list --json` reports `minecraft` and `versionRequired`; missing version metadata is distinct from platform incompatibility.

| Command | Behavior |
|---------|--------------|
| `addons catalog [--json]` | List the bundled and workspace-local catalog; print the custom registry path in text mode. |
| `addons list [instance] [--mc <version>] [--json]` | Show selected addons and platform eligibility. Uses the active instance if omitted. |
| `addons set [instance] (--select <id,id,...>\|--none) [--mc <version>]` | Apply the complete checked selection, automatically including declared dependencies. Requires a stopped server. |
| `addons update [instance] [--mc <version>]` | Refresh the selected addons from their configured sources. Requires a stopped server. |

### Installation and updates

Metadata/download/hash preparation runs up to four at a time; dependencies and final installation remain ordered. Staged jars are validated before commit, including Modrinth and available GitHub asset hashes. Addons install directly into instance `plugins/` or `mods/`, including isolated instances; shared drop-ins are unchanged.

| Action | Result |
|---|---|
| Install | Replace matching jars and version/platform variants (for example `ViaVersion-5.11.0.jar`) with one plain filename. Back up replacements until commit and restore on failure. Replacing a symlink leaves its source untouched. |
| Save selection | Record selections and downloaded checksums in `.multiplexor-addons.json`; preserve configuration folders and unrelated jars. |
| Manually replace an addon jar | An unchanged selection keeps it; `addons update` replaces it from the source; unchecking removes it. |
| Drop-in sync, including `--clean` | Preserve selected addons and skip matching source filenames. |
| Factory reset | Clear jars and selection. Clone and backup preserve both. |

### Bundled source selection

[ProtocolLib](https://github.com/dmulloy2/ProtocolLib) uses these artifacts:

| Minecraft | Artifact |
|---|---|
| Through 1.21.8 | Stable `5.4.0` |
| 1.21.9–1.21.11; 26.1–26.1.2 | Official `dev-build` Spigot-compatible jar, including on Paper |
| 26.2 | Paper artifact on Paper derivatives; Spigot artifact on Spigot |

Development entries display **ProtocolLib (development)**. The modern Paper artifact requires Paper API 26.2 and cannot replace older-version jars. Unknown newer versions require a catalog update.

EssentialsX prefers stable compatible Modrinth releases. For 26.2/26.3 without one, it uses the core jar from [official CI](https://ci.ender.zone/job/EssentialsX/) with declared [26.2](https://github.com/EssentialsX/Essentials/pull/6561)/[26.3](https://github.com/EssentialsX/Essentials/pull/6624) support, labeled **EssentialsX (development fallback)**. The successful build number is pinned before download. On 26.3, EssentialsX, BlueMap, ViaVersion, and ViaBackwards have compatible sources; FAWE/ProtocolLib remain unavailable pending verified upstream builds.

BlueMap uses the latest stable exact-version platform artifact from [Modrinth](https://modrinth.com/plugin/bluemap). First start creates `plugins/BlueMap/`. Before rendering, accept the stated Mojang download terms and set `accept-download: true` in `core.conf`. Its web server defaults to `8100`; assign unique `webserver.conf` ports for concurrent instances.

### Custom addon catalog

Create `.multiplexor/addons.json` in the workspace. Entries are added alongside the bundled catalog and cannot reuse an existing ID. No code changes or recompilation are needed:

```json
{
  "addons": [
    {
      "id": "my-plugin",
      "name": "My Plugin",
      "fileName": "MyPlugin.jar",
      "description": "My local development plugin",
      "kind": "plugin",
      "serverTypes": ["paper", "purpur"],
      "source": {"type": "file", "path": "external/MyPlugin.jar"}
    },
    {
      "id": "fabric-api",
      "name": "Fabric API",
      "kind": "mod",
      "serverTypes": ["fabric"],
      "source": {"type": "modrinth", "project": "P7dR8mSH"}
    }
  ]
}
```

| Entry field | Rule |
|---|---|
| `id`, `name`, `kind`, `serverTypes`, `source` | Required; `kind` is `plugin` or `mod`. |
| `fileName` | Optional plain jar basename; defaults to `<id>.jar`. No two entries may target the same file. |
| `dependencies` | Optional catalog IDs installed first. Unknown/cyclic IDs are rejected. Modrinth-required dependencies need catalog entries and explicit inclusion here. |
| `filePrefixes` | Equivalent filenames replaced locally and skipped during drop-in sync; for example `["MyPlugin-"]`. Matching requires a version/platform suffix boundary, so `WorldEdit` does not match `WorldEditCUI`. |
| `sources` | Ordered alternatives to a single `source`. |

| Source type | Fields |
|-------------|--------|
| `modrinth` | `project`: project ID or slug; optional `versionId` pins an exact stable version and `loaders` overrides the ordered loader preferences for a verified universal jar. Chooses stable versions for the instance's Minecraft version. |
| `github` | `repo`: `owner/repo`; `asset`: exact jar filename; optional `tag` (defaults to `latest`) and `label` such as `development`. |
| `jenkins` | `url`: job URL; `artifactPattern`: regular expression matching exactly one published jar filename; optional `label`. Downloads from a numbered successful build. |
| `url` | `url`: direct HTTP(S) jar URL; optional `sha256` and `version`. |
| `file` | `path`: local jar, absolute or relative to the workspace. `addons update` recopies it. |

Each source may restrict `serverTypes` and `minecraftVersions` to exact lists. Use these with known-compatible URL/file/GitHub/Jenkins artifacts; these providers lack standardized Minecraft compatibility metadata. Ordered `sources` fall through when Modrinth has no compatible stable release; network errors, malformed metadata, and checksum failures stop installation.

Bundled definitions: `MultiplexorApp/lib/services/addons/builtin_addons.dart`. CLI and wizard share catalog validation, source resolution, and installation modules.

## Managed content

Content and addons share release selection and artifact verification. Modrinth installation requires an explicit `--mc` or Minecraft metadata on the active instance. Selection retains the requested loader and exact Minecraft version; it never broadens the search to unrelated loaders. Downloads must be valid jars, and Modrinth downloads must match their upstream checksum.

Install, update, and remove stage file and lockfile changes before commit. A failed download or commit restores the previous files and manifest. A filename collision with unmanaged content is rejected.

| Command | Behavior |
|---------|--------------|
| `content search <query>` | Search Modrinth for plugin content under the plugin consumer, or mod content under mod consumers. |
| `content install <modrinth-slug\|url> [--mc <v>] [--loader <loader>] [--name <alias>] [--file <filename.jar>] [--sync]` | Download a compatible Modrinth jar or direct jar URL into the active consumer's dropin source and record it in `content-lock.yaml`. |
| `content list` | List managed content entries. |
| `content update [name\|--all] [--sync]` | Re-download managed content, preserving recorded MC/loader compatibility. |
| `content remove <name>` | Remove the manifest entry and downloaded jar. |
| `content sync [instance\|--all] [--clean]` | Reuse the normal plugin/mod sync pipeline for managed and manually added jars. |

## Examples

Install managed content into shared drop-ins and sync it:

```bash
./start.sh content search luckperms
./start.sh content install luckperms --mc 1.21.11 --sync
./start.sh plugins watch-start
```

Select per-instance addons while stopped. ViaBackwards also selects ViaVersion:

```bash
./start.sh runtime stop lobby
./start.sh addons set lobby --select essentialsx,fawe,bluemap,viabackwards,protocollib
./start.sh addons list lobby
./start.sh runtime start lobby
```

Refresh or clear the selection while stopped:

```bash
./start.sh runtime stop lobby
./start.sh addons update lobby
./start.sh addons set lobby --none
```

[ServerMultiplexor documentation](/servermultiplexor)
