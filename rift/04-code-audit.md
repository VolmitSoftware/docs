---
title: "Rift — Code Audit"
description: "Source-level safety, compatibility, lifecycle, and persistence findings for Rift 2.0.2"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "rift, audit, security, legacy"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

This is a static source and build-configuration review of Rift 2.0.2 at commit
[`26a5324`](https://github.com/VolmitSoftware/Rift/tree/26a532424716da8a708cd16e83917614065cd64d),
performed 27 August 2026. The review covered command authorization, filesystem
operations, world lifecycle, persistence, startup, server internals, build
dependencies, and test coverage.

The audit did not execute the plugin inside a Minecraft server. The repository
has no automated tests. Its Gradle script was exercised on a non-17 JVM and
correctly terminated because it requires Java 17 exactly; a full artifact build
was not reproduced in this environment.

## Findings

| ID | Severity | Finding | Impact |
|---|---|---|---|
| RIFT-01 | Critical | `/rift delete` recursively deletes an unchecked user-supplied filesystem path | A holder of `rift.admin` can erase non-world server directories; traversal, symlinks, and world-container boundaries are not checked |
| RIFT-02 | High | `RiftConfig.instance` is read but never assigned; `save()` serializes that null static field | Deletion tracking is lost, `config.json` becomes `null`, and the next startup can fail |
| RIFT-03 | High | Startup casts the server to CraftBukkit `v1_19_R1` and registers against an internal dispatcher | The plugin is tied to one server revision and can fail before commands register on other builds |
| RIFT-04 | High | Managed-world startup loops over every loaded world not equal to the target and calls `createWorld()` for the same target | A managed world may be requested repeatedly; the condition tests existing worlds rather than whether the target is already loaded |
| RIFT-05 | Medium | Persisted seed, environment, and type are not reapplied; imported type remains the default | Restarted worlds may not be reconstructed from the state the JSON appears to preserve |
| RIFT-06 | Medium | Unload has no primary-world guard and ignores chunk-unload and world-unload results | Players may be sent to an unsuitable destination and Rift can report success after failure |
| RIFT-07 | Medium | Create/load/import mix supplied paths, relative `File` comparisons, and base names | Existing-world detection can be unreliable and path-like input may refer to different locations in different steps |
| RIFT-08 | Low | Generator probing calls arbitrary plugins without per-plugin error handling; list scanning assumes `listFiles()` succeeds | One integration or filesystem error can abort command output |

## Detail and remediation

### RIFT-01 — constrain destructive operations

Resolve both the world container and candidate with canonical or real paths,
reject targets outside the container, reject symlinks and `..`, require a valid
loaded/managed world identity, block primary worlds, and use a two-step
confirmation. A recoverable move-to-quarantine workflow is safer than immediate
recursive deletion.

### RIFT-02 — repair configuration ownership

Assign the parsed/default object to the singleton exactly once and serialize
`this` or that validated instance. Treat JSON `null`, missing collections, and
malformed data as invalid. Write to a temporary file and atomically replace the
old file so a crash cannot truncate configuration.

### RIFT-03 — remove internal command registration

Declare commands and permissions in `plugin.yml` or use a supported Paper API.
Avoid CraftBukkit revision packages and NMS types. Explicit declarations would
also give permission plugins stable metadata and defaults.

### RIFT-04/RIFT-05 — make lifecycle state authoritative

Lookup the target world once by stable name or canonical folder. If absent,
construct one `WorldCreator` and apply the stored seed, environment, type, and
generator. Persist the actual created world's complete state, validate every
record on load, and quarantine corrupt records instead of overwriting them with
an `undefined` default.

### RIFT-06/RIFT-07 — validate every transition

Separate world names from filesystem paths. Check the return value of every
unload/delete operation, choose an explicit evacuation world, refuse to unload
it, and report partial failure accurately.

## Release readiness

The audited revision should remain classified as legacy until RIFT-01 through
RIFT-05 are fixed and covered by automated tests. Minimum coverage should include
path traversal and symlinks, primary-world protection, failed unloads, corrupt
and `null` JSON, multi-world startup, generator absence, exact persisted world
attributes, and compatibility without NMS imports.

Return to [Rift World Manager](/rift).
