---
title: Beta build history, storage and download reporting
description: Number beta builds, show their GitHub changes, set storage limits and review completed beta downloads
published: true
date: 2026-11-07T21:30:00.000Z
tags: ascendant, beta, storage, privacy
editor: markdown
dateCreated: 2026-10-29T01:34:00.000Z
---

Open **Beta builds**, select **Manage** for a plugin, then use **Builds**, **Storage** or **Downloads**. Reports require staff view permission for that plugin. Editing build notes requires publish permission. Changing quotas or retention requires an owner or administrator with configuration permission.

## Build numbers

Every published build gets a number that counts up per plugin and is never reused, reset or lowered, including when the plugin version changes. Imported builds keep the uploaded filename with the counter at the end: `Iris v3.1.4.jar` becomes `Iris v3.1.4-beta12.jar` and the build version becomes `v3.1.4-build12`. Drafts receive a number when they are first published.

Builds that existed before numbering receive numbers in publish order on first start, beginning above the highest `-buildN` suffix already used, so earlier names are not repeated. Restoring a backup keeps the higher of the restored and current counters.

## Build history

The tester portal lists every published build of the selected plugin, newest first, ten per page, with the current build marked. Each build shows its number, version, publish date and download links, then its first five commits with author and short SHA; longer lists and the notes and checksums expand on request. **Report an issue** files feedback against the current build. Withdrawn builds and drafts are not listed for testers.

Staff can edit the changelog, testing notes and an optional commit SHA on any build from **Builds** with **Edit notes**. Notes cannot change while a build is being announced.

## GitHub changes

Ascendant lists the public GitHub commits that landed between a build and the one before it. The repository comes from the plugin's GitHub product link; without one, Ascendant uses `VolmitSoftware/<plugin name without spaces>`. When both builds have a commit SHA, it uses GitHub's compare view and the list is exact. Otherwise it lists commits on the default branch between the two upload times.

Results are cached in the beta directory under `changes/`. Cached lists refresh at most once an hour using conditional requests, and stop refreshing once they are exact or a week old. Up to 100 commits are listed per build, with a GitHub compare link for the rest. The oldest build in the history has no earlier build to compare.

GitHub allows 60 unauthenticated requests per hour. Set `BETA_GITHUB_TOKEN` to a read-only token to raise that limit. When GitHub rate limits, cannot be reached or rejects a request, the history shows any saved list with its date, or a short reason, and retries later with increasing delays up to six hours. Pages never wait more than a few seconds for GitHub.

## Retention

Each plugin keeps every build's JARs by default. Set **Previous builds that keep their JARs** to limit stored files. On publish or save, older published and withdrawn builds beyond that number lose their JARs but stay in the build history with their number, changes and notes; their downloads show that the JARs were removed. Drafts, the current build, pinned builds and builds in use keep their JARs.

**Builds kept in history** sets how many build records each plugin keeps, from 2 to 2000; the default is 2000. When the history is full, the next upload drops the oldest build that has no JARs. If every stored build still has JARs, the upload is refused until retention or a reviewed deletion frees a record. **Storage** shows how many builds are in the history and how many still have JARs.

The number of previous builds that keep JARs must be at least 2 below the history limit, so a full history always has room for the next upload. Lowering the history limit removes the oldest builds without JARs at once, and the review shows how many. The save is refused if more builds would still store JARs than the new limit holds.

Deleting selected builds removes their JARs and keeps published and withdrawn builds in the history. Selected drafts are removed completely. A build without JARs cannot be selected again or republished.

## Storage limits

Each plugin starts without a storage quota. Set a limit of up to 1 TiB and a warning threshold between 50% and 100%; the default warning threshold is 80%. Storage usage measures the actual sizes of stored JARs, including drafts and withdrawn builds.

The server enforces the quota during upload and checks it again before storing a build. **Upload builds** lists any JAR that does not fit as not added. Every upload path uses the same limit. Concurrent uploads cannot commit more than the saved allowance.

Lowering a quota below existing usage preserves those builds and blocks additional storage. Increase the quota or use retention and reviewed deletion to free space. Pinning, publication and active download protections still apply to deletion. A plugin quota does not reserve disk space or replace the host's free-space checks.

## Download totals

The Downloads tab records completed server responses from the tester portal and private Discord download links. It shows requests, JARs and artifact bytes, plus counts for stored builds and files. Failed authorization, link creation and interrupted transfers do not count.

A build ZIP counts as one request and the number of JARs it contains. An all-plugins ZIP increments each included plugin once. Byte totals sum JAR sizes and exclude ZIP headers. A completed server response does not prove that the member installed or opened the files; these are transfer counts, not unique people.

Collection starts with this reporting feature. Historical downloads are not reconstructed. Anonymous lifetime totals remain when JARs are removed; build and file details exist only while their artifacts remain in the catalog. If a counter write fails after a response finishes, the server logs the failure and that transfer may be absent from the report.

## Optional access history

Member history is off by default. Set retention to 1–30 days to keep recent Discord member IDs, completion times, download kinds, build IDs, file counts and artifact byte totals. History stores no IP addresses, session tokens or private download URLs. At most 1,000 entries are kept per plugin, displayed in pages of 25.

Setting retention to zero clears recorded member history. Shortening retention removes entries outside the new window. Expiry runs on startup, every fifteen minutes while the service runs, and during storage transactions. Anonymous totals remain available when member history is off.

Backup archives can contain history that existed when the snapshot was created; their own retention controls govern those copies. Restoring a backup clears download history and disables history collection. Restore keeps the highest available anonymous counters and never reintroduces current-only artifacts.

## Beta update messages

Testers turn private messages on or off with the **Beta update messages** button on the beta downloads panel. When builds become current betas, each subscribed tester gets one silent message covering the builds they can download and whose Plugin or Modded update role from **Products** they hold.

Publishes are gathered until no new build has been published for 2 minutes, or for at most 10 minutes while builds keep arriving, so a mass upload sends one message. The message lists each build with its emoji, name and version, its platforms on a subtext line, and a link to the beta panel. Builds that are already current when the dashboard starts or beta settings change are recorded without messages.

See [Off-host backups](/ascendant/06-offhost-backups) for encrypted storage and restore checks.
