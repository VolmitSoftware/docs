---
title: "GitHub release checks"
description: "Asynchronous stable-release detection, version comparison, caching, and shutdown"
published: true
date: 2026-09-11T01:22:00.000Z
tags: "volmlib, api, github, updates"
editor: markdown
dateCreated: 2026-09-11T01:22:00.000Z
---

`art.arcane.volmlib.util.update.GitHubReleaseChecker` checks a repository's latest stable GitHub release and returns it only when its numeric plugin version is newer than the installed version. It reads release metadata asynchronously, caches results, and never downloads or installs release assets.

## Construction and methods

Construct the checker with `new GitHubReleaseChecker(new GitHubReleaseChecker.Options(owner, repository, installedVersion, logger))`. The four options are required; owner and repository must be single repository path components. The checker starts disabled and makes no request until enabled.

| Method or type | Contract |
|---|---|
| `setEnabled(boolean enabled)` | Enabling starts a check; disabling clears cached results, cancels scheduled work, and completes pending checks with `Optional.empty()` |
| `CompletableFuture<Optional<Release>> check()` | Returns the cached result or a future for the current request; disabled or closed checkers return an already-completed empty result |
| `Release(String tagName, String url)` | Contains the GitHub tag and validated HTTPS release-page URL |
| `close()` | Permanently disables the checker, clears results, and shuts down its worker; repeated calls have no effect |

Repeatedly applying the current enabled state preserves the existing cache and schedule. Re-enabling after disabling starts a fresh request. Enabling a closed checker has no effect.

## Requests and caching

The checker reads `https://api.github.com/repos/<owner>/<repository>/releases/latest` on one dedicated daemon worker. Concurrent `check()` calls share the active request; cancelling one caller's future does not cancel the shared request. Each completed request schedules the next refresh one hour later, including unsuccessful checks.

Requests use 10-second connection and read timeouts, a 1 MiB response limit, and no redirects. A returned release URL must use HTTPS on `github.com` and identify a release under the configured repository. The checker sends no authentication token and fetches no assets.

A missing release (HTTP 404), draft, prerelease, equal or older version, or unrecognized version returns `Optional.empty()`. Other HTTP failures, network errors, and invalid response data also complete with an empty result and clear any previously cached update. The checker logs the first consecutive failure with its stack trace, suppresses repeated failures until a successful check, and retries at the next hourly refresh.

## Version comparison

Versions accept an optional `v` or `V` prefix followed by dot-separated nonnegative integers. Text after `-` or `+` is ignored. Components compare numerically, with missing trailing components treated as zero; `2.0` and `2.0.0` are equal, and `2.10.0` is newer than `2.9.0`.

For example, `2.0.0-1.20.1-26.2` compares as `2.0.0`. This supports plugin versions that append a Minecraft compatibility range, but does not verify that a release supports the consumer's server version. Version strings that do not match the numeric format, or exceed 256 characters, cannot produce an update result.

## Consumer lifecycle and player delivery

Keep the checker for the plugin's enabled lifetime, apply the current configuration with `setEnabled(...)`, and call `close()` during shutdown. Disabling or closing fences late request results so they cannot repopulate the cache or complete pending callers with a release.

Future callbacks may run on the worker or inline for an already-completed cached result. The checker does not access Bukkit or schedule player messages. Consumers must apply permission and configuration checks, deliver messages on each player's owning scheduler, and reject callbacks for disconnected players or an obsolete plugin/configuration lifecycle.

ShapedPortals uses this checker for [join-time update notices](/shapedportals/03-compatibility-operations#update-notifications). See [VolmLib API](/volmlib/api) for dependency and relocation conventions.
