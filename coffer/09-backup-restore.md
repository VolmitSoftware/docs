---
title: Coffer coordinated backup and restore
description: Verified stopped-server snapshots and restoration into a new server directory
published: true
date: 2026-10-19T00:00:00.000Z
tags: coffer, backups, recovery
editor: markdown
dateCreated: 2026-10-19T00:00:00.000Z
---

Coffer 0.7.0 includes a Java 25 command-line tool in the plugin JAR. It snapshots a stopped server's complete directory and restores a verified copy into a new directory. World containers, entities, player data, plugin data, settings, and Coffer journals, receipts, fences, and recovery decisions travel together.

## Supported scope

Stop the entire Minecraft process before creating a snapshot. Empty player lists, disabled Coffer, `/save-all`, and paused Coffer commands do not stop every world or plugin writer. The tool acquires native world session locks and Coffer's storage lock while copying; a running server refuses the operation.

All server data must reside beneath the supplied server directory, with the standard `plugins/Coffer/storage` location and a relative, contained `level-name` in `server.properties`. Linked files, symbolic links, directory junctions, external world roots, and non-regular files are refused. External databases, remote services, and files outside the server directory are outside the snapshot and require separate coordination. Other programs must not edit the stopped server or the snapshot during these operations.

The snapshot contains the whole tree, including server/plugin JARs, library caches, logs, and private configuration. It is not encrypted. The tool excludes only its own `.coffer-backup.lock` coordination file; existing native and storage lock-file bytes remain part of the snapshot.

## Create and verify

Run these commands in a terminal. Quote paths containing spaces. The destination's parent must exist, and the destination itself must be new and outside the source server directory.

```powershell
java -jar Coffer.jar backup create --server "C:\Minecraft\server" --destination "C:\Minecraft\backups\snapshot-001"
java -jar Coffer.jar backup verify --snapshot "C:\Minecraft\backups\snapshot-001\snapshot"
```

Creation publishes `snapshot-001/snapshot`, containing `manifest.coffer` and the copied `server` tree. Verification checks the exact file/directory set, file lengths, and SHA-256 checksums against the bounded manifest. It rejects missing, extra, changed, or unsafe paths. Retain the reported `manifest-sha256` for restore confirmation; a checksum detects changes and is not an authenticity signature.

The format accepts at most 100,000 entries, a 64 MiB manifest, 1 TiB per file, and 16 TiB total file content. Paths are bounded to 64 components, 255 characters per component, and 4,096 UTF-8 bytes overall, use normalized Unicode, and reject case collisions and Windows-reserved names. Copies preserve empty directories, modification times to millisecond precision, and POSIX permission bits where available; a destination unable to preserve recorded POSIX permissions is refused. Filesystem ACLs, owners, Windows hidden/system/read-only flags, extended attributes, and platform-specific alternate streams are outside this format; destination filesystem defaults apply.

Pending transactions and accepted recovery decisions are valid snapshot contents. They are preserved unchanged, and the normal join-recovery rules still apply after restoration. Creating a snapshot does not repair corrupt source records.

Hard-linked aliases within the tree are refused. Where Java does not expose file identity keys, the tool compares files sharing size, creation time, and modification time with the filesystem's same-file check. That fallback allows at most 256 files per matching metadata group and 100,000 comparisons per tree scan; exceeding either limit refuses the operation.

## Restore

Verify the intended snapshot, review its manifest hash, and supply that complete hash to restore:

```powershell
java -jar Coffer.jar backup restore --snapshot "C:\Minecraft\backups\snapshot-001\snapshot" --destination "C:\Minecraft\restored-001" --confirm <manifest-sha256>
```

The tool stages and verifies the complete restored tree before publishing `restored-001/server`. It refuses an existing destination and never merges with or overwrites the original server. A wrong confirmation hash or changed snapshot cannot publish a restored server.

The restore container retains `manifest.coffer`. Verify the completed restore before launching it:

```powershell
java -jar Coffer.jar backup verify --snapshot "C:\Minecraft\restored-001"
```

Keep the original server stopped when starting its restored copy. Point the launcher at the published `server` directory and check any machine-specific absolute paths, ports, or external integration settings before starting it. Server-manager registration and launcher wiring belong to that manager. Check Coffer's storage readiness, affected player inventories, vaults, and pending recovery state after startup; retain the original server until the restored copy has been accepted.

Restoration rolls world and player progress back to the selected snapshot along with vault state. Do not combine a restored player inventory with newer world containers or newer vault files. Running the original and restored server as simultaneous copies is outside this recovery workflow.

## Failure and durability

The tool reserves the destination container exclusively. Until staging and validation finish, the published `snapshot` or `server` child does not exist. Failures before publication leave staging evidence in that container and leave the original server untouched. An interruption after publication can leave a complete result even without a success message; verify the published snapshot or restore container before retrying. Use a fresh destination for another attempt; an incomplete staging directory is not a server to launch or a snapshot to restore.

The final directory publication requires an atomic move on the destination filesystem. Copied files are flushed before publication. `DURABILITY_UNCERTAIN` means publication succeeded but directory flushing could not confirm host power-loss durability; verify the published result before deciding whether to retry. A successful process-interruption test does not prove power-loss safety.

| Exit code | Meaning |
| --- | --- |
| `0` | Help, successful verification, or successful publication; inspect the separate durability result |
| `1` | Operational failure, with the full exception on standard error |
| `2` | Invalid command or arguments; no operation submitted |

Use `java -jar Coffer.jar backup help` for command syntax. There is no in-game backup/restore command, automatic retention, scheduled capture, incremental format, or in-place replacement. See the [feature map](/coffer/04-feature-map) for build and Paper/Folia validation evidence.
