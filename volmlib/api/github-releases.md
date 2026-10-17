---
title: "Update notifications"
description: "Shared GitHub release checks, join notices, /volmit plugins updates, per-plugin settings, and the release-check API"
published: true
date: 2026-10-17T00:00:00.000Z
tags: "volmlib, api, github, updates"
editor: markdown
dateCreated: 2026-09-11T01:22:00.000Z
---

Volmit plugins on Bukkit-based servers (Paper, Spigot, Folia) check their latest stable GitHub release and tell permitted players and console when a newer version exists. Every participating plugin contributes to one combined join notice and one `/volmit plugins updates` report. Checks only read release information; nothing is downloaded or installed.

## Participating plugins

| Plugin | Settings file | Key | Default | Permission | Applies |
|---|---|---|---|---|---|
| Adapt | `plugins/Adapt/adapt.toml` | `autoUpdateCheck` | `true` | `adapt.update` | On save |
| Foundation | `plugins/Foundation/config.toml` | `runtime.updateNotifications` | `true` | `foundation.update` | On save while `runtime.hotReload` is on |
| GamemodeSwitcher | `plugins/GamemodeSwitcher/config.toml` | `general.update-notifications` | `true` | `gamemodeswitcher.update` | On save |
| BileTools | `plugins/BileTools/biletools.yml` | `update-notifications` | `true` | `biletools.update` | Immediately from `/bile config`; file edits on BileTools reload or restart |
| Gloss | `plugins/Gloss/gloss.toml` | `updateNotifications` | `true` | `gloss.update` | On save |
| HiddenOre | `plugins/HiddenOre/hiddenore.toml` | `update_notifications` | `true` | `hiddenore.update` | On save |
| Iris | `plugins/Iris/iris.json` | `general.updateNotifications` | `true` | `iris.update` | On save or `/iris reload` |
| React | `plugins/React/react.toml` | `updateNotifications` | `true` | `react.update` | On save |
| Rift | `plugins/Rift/config.toml` | `updateNotifications` | `true` | `rift.update` | On save |
| Wormholes | `plugins/Wormholes/wormholes.toml` | `update-notifications` | `true` | `wormholes.update` | On save |

Each plugin checks the release page of its own repository under [github.com/VolmitSoftware](https://github.com/VolmitSoftware). Turning a setting off stops that plugin's checks, clears its stored result, and removes it from join notices; `/volmit plugins updates` then lists it under **Checks disabled**. Turning the setting on starts a new check.

Iris and Wormholes on Fabric, Forge, and NeoForge keep the same key in their settings file, but it has no effect there: mod-loader servers make no update checks. Shaped Portals checks its releases separately and is not part of the combined notice or report; see [Shaped Portals update notifications](/shapedportals/03-compatibility-operations#update-notifications).

## Permissions

| Permission | Default | Grants |
|---|---|---|
| `volmit.update` | `op` | Notices and report entries for every participating plugin |
| `<plugin>.update` | `op` | Notices and report entries for that plugin only, such as `iris.update` |

Operators always have access. A player receives join notices and report entries only for the plugins they have access to.

## Release checks

When a plugin enables with its setting on, it requests the latest release of its repository from GitHub, then checks again about every hour. Drafts and prereleases are ignored.

After a failed check, the plugin retries after one minute and doubles the delay after each further failure, up to one hour. When GitHub answers with a rate limit or access restriction (HTTP 403 or 429), the next request waits at least until GitHub's reset time, up to seven days. The console prints one warning naming the repository and the retry delay; repeated failures stay quiet until a check succeeds. Available updates are not printed to the console; run `/volmit plugins updates` from the console to list them.

Versions compare numerically by dot-separated parts, with an optional leading `v`. `2.10.0` is newer than `2.9.0`, and `2.0` equals `2.0.0`. A trailing Minecraft range is ignored, so `4.1.0-1.21.1-26.2` compares as `4.1.0`; a rebuild for a different Minecraft range is not an update. An installed prerelease such as `4.1.0-beta.2` is older than the `4.1.0` release. Other version formats are reported as **Version unknown** and never produce a notice.

## Join notice

About one second after a player joins, they receive one combined notice when at least one plugin they have access to has a newer release. The notice counts the available updates and names up to three plugins, followed by `+N more` when there are more. Clicking it runs `/volmit plugins updates`.

```none
Volmit • 2 plugin updates available
  Gloss, Iris  [View updates]
```

The notice uses the latest stored results and does not start a new request.

## `/volmit plugins updates`

Players and console can run `/volmit plugins updates`. The `/volmit plugins` menu shows an **Updates** entry to anyone with access to at least one participating plugin. A sender without access to any plugin receives `No registered update providers are available to you.`

The command requests a fresh check for each listed plugin unless a check finished within the last minute or a retry delay is still running; in those cases it shows the stored result. It waits up to 35 seconds for each plugin and lists slower checks under **Check failed**.

Results are grouped in this order:

| Group | Meaning |
|---|---|
| Updates available | A newer stable release exists |
| Check failed | The latest request failed. The entry shows the error and the last known release, marked `(cached)` |
| Version unknown | The installed version or the release tag cannot be compared |
| Up to date | The installed version matches the latest release or is newer |
| No stable release | The repository has no published stable release |
| Checks disabled | The plugin's update setting is off |

Players hover a plugin name for its installed and latest versions. Plugins with an update show a `[View release]` link to the GitHub release page; other plugins with a known release open that page when their name is clicked. Console receives one line per plugin with the installed version, the latest version when known, the state, and the release URL when known:

```none
Updates available (1)
  ⇀ Iris 4.0.2 -> 4.1.0: update available https://github.com/VolmitSoftware/Iris/releases/tag/4.1.0
```

## Registering a plugin

`art.arcane.volmlib.util.update.BukkitUpdateService` adds a Bukkit plugin to the combined notice and report:

```java
BukkitUpdateService updates = BukkitUpdateService.register(this, new BukkitUpdateService.Options(
        "VolmitSoftware", "ExamplePlugin", "exampleplugin.update", () -> settings.updateNotifications()));
```

| Method | Contract |
|---|---|
| `register(Plugin plugin, Options options)` | Registers the plugin and starts checking when `options.enabled()` returns `true`. Adds `volmit.update` with an `op` default when no plugin has declared it |
| `reconfigure()` | Re-reads `options.enabled()` and starts or stops checks. Call it after every configuration change |
| `close()` | Stops checks and removes the plugin from notices and reports. Call it during shutdown |

All four options are required. Declare the plugin's own permission in `plugin.yml`. Plugins that shade separate VolmLib copies still share one notice and one report. The `/volmit plugins updates` command is provided by the shared `/volmit` command owner; see [Shared localization](/volmlib/api/localization).

## Release checker

`art.arcane.volmlib.util.update.GitHubReleaseChecker` checks a repository's latest stable GitHub release without Bukkit. Construct it with `new GitHubReleaseChecker(new GitHubReleaseChecker.Options(owner, repository, installedVersion, logger))`. The four options are required; owner and repository must be single repository path components. The checker starts disabled and makes no request until enabled.

| Method or type | Contract |
|---|---|
| `setEnabled(boolean enabled)` | Enabling starts a check; disabling clears cached results, cancels scheduled work, and completes pending checks with `Optional.empty()` |
| `CompletableFuture<Optional<Release>> check()` | Returns the cached update or a future for the current request; disabled or closed checkers return an already-completed empty result |
| `CompletableFuture<Report> checkReport(boolean fresh)` | Returns the report after the current or cached check. `fresh` starts a new request unless one is pending or the request backoff has not elapsed |
| `Report snapshot()` | Returns the latest report without starting a request |
| `Report(Status status, Release release, String error, long checkedMillis, long lastSuccessMillis)` | Result state, latest known release, failure message, and epoch-millisecond timestamps |
| `Status` | `DISABLED`, `NO_RELEASE`, `CURRENT`, `UPDATE`, `UNKNOWN`, or `FAILED` |
| `Release(String tagName, String url)` | Contains the GitHub tag and validated HTTPS release-page URL |
| `close()` | Permanently disables the checker, clears results, and stops background work; repeated calls have no effect |

Repeatedly applying the current enabled state preserves the existing cache and schedule. Re-enabling after disabling starts a fresh request. Enabling a closed checker has no effect.

The checker reads `https://api.github.com/repos/<owner>/<repository>/releases/latest`. Concurrent calls share the active request; cancelling one caller's future does not cancel the shared request. A successful request schedules the next refresh after one hour, plus up to 10% random spread. A forced `checkReport(true)` request is accepted one minute after a successful check.

Requests use 10-second connection and read timeouts, a 30-second total deadline, a 1 MiB response limit, and no redirects. A returned release URL must use HTTPS on `github.com` and identify a release under the configured repository. The checker sends no authentication token and fetches no assets.

A missing release (HTTP 404), draft, or prerelease produces `NO_RELEASE`. A release that is not newer produces `CURRENT`, and uncomparable versions produce `UNKNOWN`; `check()` returns `Optional.empty()` for all three. Network errors, HTTP failures, and invalid response data produce `FAILED` and keep the previously cached update and release. Failures retry after one minute, doubling up to one hour; HTTP 403 and 429 responses wait for `Retry-After` or `X-RateLimit-Reset`, up to seven days. The checker logs the first consecutive failure with its stack trace and retry delay, then suppresses repeated failures until a successful check.

Versions accept an optional `v` or `V` prefix followed by dot-separated nonnegative integers, compared numerically with missing trailing components treated as zero. A comparable version may add a numeric Minecraft range (`-1.21.1-26.2`, with `.x` wildcards), a prerelease suffix beginning with `alpha`, `beta`, `rc`, `snapshot`, or `dev`, and `+` build metadata. Ranges and build metadata are ignored, and an installed prerelease is older than the equal stable version. Versions in other formats, or longer than 256 characters, cannot produce an update. The comparison does not verify that a release supports the consumer's server version.

Keep the checker for the plugin's enabled lifetime, apply the current configuration with `setEnabled(...)`, and call `close()` during shutdown. Disabling or closing fences late request results so they cannot repopulate the cache or complete pending callers with a release. Future callbacks may run on the checker's thread or inline for a cached result. The checker does not access Bukkit or schedule player messages; consumers must apply permission and configuration checks and deliver messages on each player's owning scheduler.

Shaped Portals uses this checker directly for its [join-time update notices](/shapedportals/03-compatibility-operations#update-notifications). See [VolmLib API](/volmlib/api) for dependency and relocation conventions.
