---
title: Beta storage and download reporting
description: Set plugin storage limits and review completed beta downloads
published: true
date: 2026-10-30T21:00:00.000Z
tags: ascendant, beta, storage, privacy
editor: markdown
dateCreated: 2026-10-29T01:34:00.000Z
---

Open **Beta builds**, select **Manage** for a plugin, then use **Storage** or **Downloads**. Reports require staff view permission for that plugin. Changing quotas or history retention requires an owner or administrator with configuration permission.

## Storage limits

Each plugin starts without a storage quota. Set a limit of up to 1 TiB and a warning threshold between 50% and 100%; the default warning threshold is 80%. Storage usage measures the actual sizes of retained JARs, including drafts and withdrawn builds.

The server enforces the quota during upload and checks it again before storing a build. **Upload builds** lists any JAR that does not fit as not added. Every upload path uses the same limit. Concurrent uploads cannot commit more than the saved allowance.

Lowering a quota below existing usage preserves those builds and blocks additional storage. Increase the quota or use the existing retention and reviewed cleanup controls to free space. Pinning, publication and active download protections still apply to deletion. A plugin quota does not reserve disk space or replace the host's free-space checks.

## Download totals

The Downloads tab records completed server responses from the tester portal and private Discord download links. It shows requests, JARs and artifact bytes, plus counts for retained builds and files. Failed authorization, link creation and interrupted transfers do not count.

A build ZIP counts as one request and the number of JARs it contains. An all-plugins ZIP increments each included plugin once. Byte totals sum JAR sizes and exclude ZIP headers. A completed server response does not prove that the member installed or opened the files; these are transfer counts, not unique people.

Collection starts with this reporting feature. Historical downloads are not reconstructed. Anonymous lifetime totals remain when old builds are removed; build and file details exist only while their artifacts remain in the catalog. If a counter write fails after a response finishes, the server logs the failure and that transfer may be absent from the report.

## Optional access history

Member history is off by default. Set retention to 1–30 days to keep recent Discord member IDs, completion times, download kinds, build IDs, file counts and artifact byte totals. History stores no IP addresses, session tokens or private download URLs. At most 1,000 entries are kept per plugin, displayed in pages of 25.

Setting retention to zero clears recorded member history. Shortening retention removes entries outside the new window. Expiry runs on startup, every fifteen minutes while the service runs, and during storage transactions. Anonymous totals remain available when member history is off.

Backup archives can contain history that existed when the snapshot was created; their own retention controls govern those copies. Restoring a backup clears download history and disables history collection. Restore keeps the highest available anonymous counters and never reintroduces current-only artifacts.

See [Off-host backups](/ascendant/06-offhost-backups) for encrypted storage and restore checks.
