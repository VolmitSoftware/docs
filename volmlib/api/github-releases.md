---
title: "GitHub release checks"
description: "Shared update notifications, command reports, caching, and GitHub release checks"
published: true
date: 2026-10-08T22:01:05.173Z
tags: "volmlib, api, github, updates"
editor: markdown
dateCreated: 2026-09-11T01:22:00.000Z
---

VolmLib combines update notices from registered plugins into one message and provides `/volmit plugins updates` for a combined report. Checks read GitHub release metadata asynchronously. They never download or install plugin JARs.

## Registering a Bukkit plugin

Keep one `BukkitUpdateService` registration for each plugin's enabled lifetime:

```java
BukkitUpdateService updates = BukkitUpdateService.register(plugin,
        new BukkitUpdateService.Options("VolmitSoftware", "ShapedPortals", "shapedportals.update",
                () -> configService.runtime().updateNotifications()));
```

Call `updates.reconfigure()` after installing configuration changes and `updates.close()` during shutdown. The enabled supplier must read a thread-safe configuration snapshot. Disabling stops that plugin's checks, clears its cache, and invalidates queued notices. Closing unregisters its provider and listener.

Providers communicate through Bukkit's service registry using Java maps, strings, suppliers, functions, and futures. Separate relocated copies of VolmLib can participate without casting each other's classes. One registered provider coordinates join notifications; another takes over when it closes. Player delivery uses the entity scheduler and rechecks connection, permission, registration, and configuration.

Only plugins that register this service participate. Older plugins' independent notifiers are not automatically absorbed. ShapedPortals, React, Adapt, BileTools, HiddenOre, Iris (Bukkit), GamemodeSwitcher, Rift, Wormholes, and Gloss register it through their update-notification settings. Checks default to enabled; existing explicit opt-outs remain respected.

## Commands and permissions

`/volmit plugins updates` checks all registered providers visible to the sender and produces one Director-formatted report matching the shared command menus. The report groups plugins under status headings with counts, showing available updates first. Player rows show plugin names; hover for full versions and error details. Updates have a separate `[View release]` link; other plugin names link to their release when one is available. Disabled checks, unavailable releases, incomparable versions, and failures have their own groups. A failed refresh retains previous release metadata and labels it cached. Console rows retain inline details and plain release URLs. Combined update messages use shared English text. No command installs updates.

Operators and holders of `volmit.update` can see all registered providers. A plugin's own update permission grants access to that provider. `volmit.update` defaults to operators. Disabled checks remain disabled even for a manual command.

The shared `/volmit` command is supplied by `BukkitLanguageSwitcher`. Register that service as part of plugin setup. Its tools menu and completion include updates. A current command owner can replace a recognized older Volmit command owner; foreign commands are preserved. The automatic join notice uses the green Director theme in two lines, without clearing chat or adding a banner or footer. The first line shows the update count; the second shows up to three permitted plugin names, a remaining count when needed, and a clickable `[View updates]` control. Hover shows every included plugin name. Only confirmed updates appear, and the control opens the combined report.

## Standalone checker

`GitHubReleaseChecker` is available to non-Bukkit consumers. Construct it with `new GitHubReleaseChecker(new GitHubReleaseChecker.Options(owner, repository, installedVersion, logger))`. The checker starts disabled.

| Method | Behavior |
|---|---|
| `setEnabled(boolean)` | Starts a check when enabled; disables and clears pending/cached state when false |
| `check()` | Shares an active request or returns the cached newer release as `Optional<Release>` |
| `checkReport(boolean fresh)` | Returns a structured report; `true` requests a refresh when the cooldown permits |
| `snapshot()` | Returns the most recently accepted report without network access |
| `close()` | Permanently disables the checker and stops its worker |

`Report` contains `status`, optional `release`, `error`, `checkedMillis`, and `lastSuccessMillis`. Status is `DISABLED`, `NO_RELEASE`, `CURRENT`, `UPDATE`, `UNKNOWN`, or `FAILED`. Before the first result, the snapshot remains `DISABLED`; callers needing a completed result should await `checkReport`.

## Requests and failures

Each checker reads `/repos/<owner>/<repository>/releases/latest` on a daemon worker. Concurrent callers share its active request. Successful automatic checks repeat after one hour plus up to ten percent jitter. Manual refreshes are limited to once per minute per checker and cannot bypass a failure cooldown.

Failures retain the last successful release and cached update. Retry delays grow from one minute to one hour, with jitter. HTTP 403/429 responses respect `Retry-After` and GitHub's rate-limit reset header, bounded to seven days. Consecutive failures log once until a successful check resets logging. Re-enabling a disabled checker starts a new request.

Requests have ten-second connection/read timeouts, a thirty-second elapsed budget checked during body reads, a 1 MiB response limit, and no redirects. Synchronous DNS resolution may outlast that budget. Returned release URLs must use HTTPS on `github.com` under the configured repository. No authentication token or asset download is used. GitHub's unauthenticated limits apply to the server's public IP, including other servers sharing that IP.

A combined report waits up to thirty-five seconds per provider; one provider's failure does not discard other results. Canceling a caller's future does not cancel another caller's check.

## Version policy

Drafts and GitHub prereleases are excluded. Numeric components compare numerically, with an optional `v` prefix and missing trailing components treated as zero. `2.0` equals `2.0.0`; `2.10.0` is newer than `2.9.0`.

Minecraft compatibility suffixes are ignored, including a final `.x` wildcard such as `-26.x` or `-1.20.1-26.x`: `2.0.0-1.20.1-26.2` compares as `2.0.0`. Build metadata after `+` does not order versions. A stable release supersedes an installed version with the same numeric core and a recognized `alpha`, `beta`, `rc`, `snapshot`, or `dev` suffix. Other suffixes produce `UNKNOWN` rather than claiming an update. This does not establish Minecraft compatibility; review the release before installing.

See [ShapedPortals update notifications](/shapedportals/03-compatibility-operations#update-notifications) and [Shared localization](/volmlib/api/localization) for consumer configuration and shared command ownership.
