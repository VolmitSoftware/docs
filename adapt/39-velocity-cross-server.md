---
title: "Cross-Server SQL & Redis"
description: "Adapt documentation: Cross-Server SQL & Redis"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Adapt coordinates cross-server player progression directly between backend servers. SQL is the authority and Redis carries request-correlated snapshots for the exact SQL owner being replaced. There is no proxy companion; remove any old Adapt jar from the proxy.

This path is active only when `sql.enabled` and `redis.enabled` are both true. Every participating backend must use the same SQL schema and Redis service. A backend with Redis disabled uses fenced SQL alone and cannot recover an uncommitted in-memory handoff snapshot from another backend.

## Ownership and handoff

`ADAPT_DATA` stores canonical player JSON. `ADAPT_DATA_FENCE` stores the current owner token, epoch, committed sequence, and any effective predecessor. Both tables must use InnoDB. A backend claims a player before constructing the runtime; login fails rather than creating an unfenced SQL-backed player when claim or adoption cannot be verified.

When a claimed row has a predecessor, the destination subscribes to a request-specific reply channel and publishes the same request up to three times during a 250 ms window. The request names the player, request id, predecessor owner token, and predecessor epoch. Only a snapshot matching that exact fence can participate in adoption. At most eight candidate fences are retained, the highest sequence for the expected fence wins, and equal-sequence conflicting JSON is rejected.

The source handles the request on the player's owning entity scheduler. If its live runtime owns the requested fence, it freezes that runtime, removes transient region grants, advances the snapshot sequence, and stages the snapshot in Redis for 60 seconds before publishing the direct reply. Repeated requests reuse the retired snapshot. The destination also checks the exact staged key after the reply window, so a completed stage survives lost pub/sub replies or a source failure. Successful SQL adoption writes the new owner at sequence 1 and asynchronously deletes the staged predecessor record.

SQL adoption also considers a matching in-process pending write and a valid `ADAPT_SQL_RECOVERY_V1` file. Those sources still require the claimed predecessor fence. Old raw-JSON `.pending-sql` files and every pre-fence `.pending-delete` file found in SQL mode are preserved and rejected for operator reconciliation. `.pending-delete` is valid only in local JSON mode.

## Reset and purge

SQL reset and purge rotate the owner token and advance the epoch transactionally. Redis notices contain only the player, operation id, new epoch, and purge flag; ownership credentials are never shared between backends. Receivers remember the epoch as a stale-claim watermark and retire and disconnect any older live runtime. A rejected owner-scheduler dispatch invalidates the old fence immediately so that runtime cannot keep writing.

## Setting it up

1. Stop every backend and back up the shared Adapt database plus each `plugins/Adapt/` directory.
2. Remove any obsolete Adapt or Velocity companion jar from the proxy. Install the same current shaded Adapt jar on every backend.
3. Configure identical SQL and Redis endpoints on every backend. Set `sql.enabled = true` and `redis.enabled = true`.
4. Lock Redis down with network rules and ACL credentials. Adapt exposes no TLS, Redis database-number, or channel-name setting.
5. Start one disposable backend first. Confirm both SQL tables exist and use InnoDB, then complete a player login, save, quit, and reload.
6. Start the remaining backends. Confirm SQL initialization and Redis subscription on each one, with no recovery or decoding errors.
7. Move a disposable player between two backends. Compare skill XP, knowledge, learned adaptations, effect preferences, and mutation equipment after each hop.
8. Test a reset and purge with backed-up disposable profiles. Confirm stale-owner writes are fenced and an older live session is disconnected.

The `Adapt:data:v2` format is a hard break. Stop the whole network and replace every backend jar in one maintenance window. Mixed versions cannot exchange snapshots, and there is no compatibility decoder or proxy-side bridge.

## Fixed Redis surfaces

| Surface | Purpose |
|---|---|
| `Adapt:data:v2` | Fenced transfer requests and epoch-only reset or purge notices |
| `Adapt:data:v2:reply:<request-id>` | Request-scoped direct snapshot replies |
| `Adapt:data:v2:stage:<player>:<owner>:<epoch>` | Exact-fence staged snapshot with a 60-second TTL |

The channel family and staging prefix are fixed. Separate Adapt networks sharing one Redis service can observe each other's traffic even though fence validation rejects unrelated player ownership. Use separate Redis services or network boundaries.

Snapshot JSON is strict UTF-8 and may contain at most 16,777,215 encoded bytes, matching MySQL `MEDIUMTEXT`. The staged record adds a fixed 60-byte binary header. Staged reads check the Redis length before fetching and then validate the header, player, owner, epoch, sequence, payload length, and UTF-8. Invalid or unavailable staging reads fail the handoff instead of silently accepting uncertain state.

## Failure boundaries

Redis staging closes the lost-reply window only after `SETEX` completes. A source process failure after its runtime freezes but before that asynchronous write completes can still lose the final uncommitted delta. A staging failure followed by lost direct replies has the same limitation. Once staging succeeds, the exact predecessor is recoverable for 60 seconds; after the TTL, SQL and any matching fenced recovery envelope remain the available authorities.

If Redis is intentionally disabled, the destination adopts from committed SQL and matching local fenced recovery only. If Redis is enabled but transfer verification errors, login fails closed. A healthy Redis publish is not proof of a complete handoff; verify the adopted profile and SQL fence on the destination.

| Symptom | What to check |
|---|---|
| Backend fails during Redis initialization | Redis host, port, ACL credentials, reachability, and the full backend exception |
| Transfer verification rejects login | Redis subscription and staging connection, exact predecessor fence, staged-record validation, and backend exceptions |
| Stale data after a switch | Shared SQL identity, both InnoDB tables, Redis enablement on both backends, source shutdown timing, and matching `.pending-sql` recovery |
| Decode errors after an update | At least one backend still uses the pre-v2 frame; stop the network and replace every backend jar together |
| Traffic from an unrelated network | Multiple Adapt networks share the fixed channel family; isolate their Redis services |

## Backend Redis config

| Key | Default | What it does |
|---|---|---|
| `redis.enabled` | `false` | Enables fenced handoff only when SQL is also enabled |
| `redis.host` | `"127.0.0.1"` | Redis address used by pub/sub and transfer staging |
| `redis.port` | `6379` | Redis TCP port |
| `redis.username` | `""` | Redis ACL username; credentials attach when username or password is non-empty |
| `redis.password` | `""` | Redis password; stored in the backend configuration as plain text |

SQL and Redis settings are restart-bound. Hotloading the core config does not reconnect either service.

## See also

- [01 - Installation & Configuration](/adapt/01-installation-configuration)
- [38 - Runtime Architecture](/adapt/38-runtime-architecture)
- [40 - Operator Runbooks](/adapt/40-operator-runbooks)
