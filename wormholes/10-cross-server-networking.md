---
title: "Cross-Server Networking"
description: "Codes, trust, handoff, transfer modes, and doctor"
published: true
date: 2026-08-23T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes links servers by exchanging pasteable codes, then stores routes
under `routes/` and public keys under `trust/`. It then runs a version-matched
sideband peer protocol. Player handoff is admission-gated and rate-limited
before the client is transferred. Eligible non-player entities use a separate
snapshot-and-ack path.

## Enable and auto-enable

| Setting | Default | Role |
|---------|---------|------|
| `[network] enabled` | `false` | Master switch for cross-server networking |
| Import / export | — | Sets `enabled = true`, persists config, and starts `NetworkManager` if not running |

Manual enable: set `enabled = true` in
`plugins/Wormholes/config/wormholes.toml` and reload or restart. Codes also
enable networking without a separate edit (see `ImportExportService`).

Other network keys:
[01 - Installation & Configuration](/wormholes/01-installation-configuration)
(`[network]` and nested tables).

## Codes

| Kind | Prefix | Source | Contents (encoded) |
|------|--------|--------|---------------------|
| Server | `WHS1.` | `/wormholes server export` | Server name, advertise host, fallback hosts, wormhole port, game port, public key |
| Portal | `WHP5.` | Gateway portal Export UI | Same host/key material plus portal UUID and portal name |

Encoding is URL-safe Base64 after the prefix. Invalid codes reject with a
message naming both prefixes.

### Import

| Command | Effect |
|---------|--------|
| `/wormholes server import <code>` | Accepts `WHS1.` or `WHP5.` |
| `/wormholes network import <code>` | Alias of `server import`. Same `importCode` path |

Import of a **server** code saves route + trust only. Import of a **portal**
code from chat saves route + trust and reports the remote portal name. Linking
a local gateway to that remote portal is done through the portal Link UI. When
import is invoked with a portal context from the UI, `linkRemote` is applied
immediately.

Export of either kind also enables network and starts it. Server export to a
player is click-to-copy. Console prints the raw code.

### Identity collision

Importing a code whose server name equals this server’s local name is rejected
(same-server portal or same identity).

## Storage

```
plugins/Wormholes/
  routes/peers.properties   PeerEntry fields learned from codes / links
  trust/peers.properties    Trusted peer public keys
  identity/                 Local key material for the wire handshake
```

| Action | Storage impact |
|--------|----------------|
| Import code | `trustPeer` + `savePeer` (route) |
| `/wormholes server remove <name>` | Deletes route and trusted key. Drops remote portal registry entries for that peer |
| TOFU re-trust | Online peer that still has this server may re-register if `trust-on-first-use` remains true. Remove on **both** servers to fully forget |

Peers are **not** configured as `[[peers]]` inside `wormholes.toml`.

## Trust on first use

| `trust-on-first-use` | Behavior |
|----------------------|----------|
| `true` (default) | Unknown peer with no stored key may be trusted on first connection/sideband if policy allows |
| `false` | Unknown peer with no route/trust entry is rejected until an import (or prior trust) stores a key |

If a stored key exists and the peer presents a different key, the connection is
rejected (key change). Import overwrites trust via `trustOrReplace`.

The local identity is an Ed25519 key pair stored as `identity/server.identity`,
with repaired compatibility mirrors at `identity/server.key` and
`identity/server.pub`. Private files are owner-only where POSIX permissions
are available. `/wormholes network status` and import/export messages expose
the public-key fingerprint for comparison. Back up the identity with the
route/trust state. Deleting or replacing it changes this server's fingerprint.
Peers with the old key will reject it until trust is deliberately replaced. The
signatures authenticate peer identity and message ownership. They do not
encrypt the sideband connection.

## Raw peer admission

TCP and Unix-domain listeners share a hard ceiling of 128 inbound connections
that have not completed their peer handshake. A connection releases its slot
when it becomes ready, fails, or closes; ready peers and outbound dial/reconnect
attempts do not consume the ceiling. Excess connections and connections that
arrive while the network is stopping are closed immediately. Each admitted raw
connection uses named Java 25 virtual reader and writer threads.

## Transfer mode

`[network] transfer-mode` (`PlayerTransfer.resolveMethod`):

| Mode | Selection |
|------|-----------|
| `auto` (default) | **PROXY** if peer `useProxy` is true, else **DIRECT** |
| `proxy` | Always BungeeCord plugin message `Connect` on channel `BungeeCord` with peer name |
| `direct` | Paper `player.transfer(host, port)` to resolved game host/port |

Peer `useProxy` is stored on the route entry when set. Imports set host/port
from the code (default public game port 25565 if game port missing).

## Endpoint selection (direct handoff)

`PeerEndpointResolver` + handoff path:

| Player context | Host choice |
|----------------|-------------|
| Internet / non-local client | First of: `publicHost`, then `host`, then comma-separated `fallbackHosts` (`gameHosts` order) |
| Local client (loopback / site-local / link-local / ULA) **and** a verified private/local host from an active private connection | That verified private host |
| Localhost alone | Does **not** make a separately hosted peer’s private address valid without verification |

Game-port sideband tries fallbacks when a raw socket was never established.
It remembers the endpoint that answered for player handoff. Imported portal
codes carry public and LAN candidates in the code payload (up to four fallback
hosts).

`advertise-host-override` forces the host written into export codes when
non-blank.

## Handoff admission

Before the source dispatches the client, the destination must grant a
rate-limited admission lease for that transfer.

Destination checks include:

- Live destination portal can receive (open, not mirror-only, incoming
  traversals enabled)
- Selected transfer method is supported
- Profile passes ban and whitelist gates (ops exempt from whitelist)
- Online players + pending arrivals stay under the player limit
- Direct transfer support: native Paper transfers or compatibility path

| Outcome | Result |
|---------|--------|
| Deny / timeout / cooldown | Traveler returned to the source-facing side of the portal (not left in-plane / not orphaned disconnect) |
| Accept | Reservation held until destination portal teleport succeeds. Transient placement failures retry then fall back to destination spawn |

### Rate limits

| Source | Value |
|--------|--------|
| Interval | `max(1000 ms, teleport-cooldown-millis)` (`TraversalAdmissionPolicy.handoffRateLimitMillis`) |
| Scope | Per-player outbound and destination admission rate limiters |
| Failure | Penalty re-applies the interval. Denials can carry `retryAfterMillis` |

### Handoff timeout

`[network] handoff-timeout-ms` (default `5000`, normalized to 50–60000 ms)
bounds the admission/request window.

## Paper transfers and auto-accept

| Mechanism | Setting | Notes |
|-----------|---------|--------|
| Native Paper | `accepts-transfers=true` in **destination** `server.properties` + restart | Required for first-class transfer handshakes |
| Compatibility | `[network] auto-accept-transfers = true` (default) | `TransferGate` rewrites TRANSFER intention handshakes to LOGIN when network is enabled |

Destination support is treated as true when `autoAcceptTransfers` **or** the
platform reports accepting transfers. Direct transfers fail admission with
“destination does not accept direct transfers” when neither path is active.

## Wire protocol

| Constant | Value |
|----------|--------|
| `WireCodec.PROTOCOL_VERSION` | **19** |
| Signed status-sideband envelope | **6** |

Handshake Hello and signed game-port status-sideband envelopes carry the wire
protocol, Minecraft, and Wormholes versions. Raw and sideband admission require
an exact match for all three before the peer can become trusted, discovered, or
ready. Envelope **6** is a hard break: envelope 5 is rejected before its frames
are decoded, and an envelope 6 packet with an incompatible wire protocol is
rejected during admission. Upgrade every linked server to the same Wormholes
build and restart them together; no persisted network data needs to be deleted.

Optional compression and dictionary negotiation ride the same wire once Hello
succeeds (`[network.transport]`).

## Remote portal views

An interested observer subscribes the linked peer to the gateway portal's
block and entity stream. The source retains the session's chunks, sends an
initial bulk snapshot, then publishes diffs, entity state, and world time until
the last observer stops touching the view. Initial bulk delivery across every
session shares one fair global pump capped at eight chunk-column starts every
two ticks; failed partial delivery resets and retries instead of publishing an
incomplete ready state. Ongoing entity snapshots use a separate fair global
queue capped at eight new captures and eight captures in flight every two
ticks. Animation and hurt events use the captured entity-to-session membership
instead of checking every remote-view session.

Dirty replicated chunks rotate through a global limit of 64 drains per tick.
On Folia, each chunk has at most one owning-region drain in flight; rejected or
retired work remains eligible for a later pass, and a rejected global drain
cycle retries after one second.

The per-portal network-view preset controls block depth, resample heartbeat,
entity interval, and unsubscribe grace; exact values and custom clamps are in
[04 - Portal Types, Menus & Settings](/wormholes/04-portal-types-menus-settings).
After the grace expires, Wormholes sends `ViewUnsubscribe`, releases replication
state, and removes the remote cache. A view with no data resends its subscription
at most once every five seconds. Raw peers negotiate optional Zstandard
compression and dictionaries; status-sideband frames use bounded whole-envelope
compression and are intended for lower-volume fallback transport.

## Non-player entity transfer

Eligible non-player entities entering a `UNIVERSAL` gateway are transferred as
Bukkit `EntitySnapshot` data rather than as player handoffs. The source
snapshot is capped at **256 KiB**. The destination recreates the entity at the
exit, then applies the portal's relative position, look, and velocity
transform.

Destination admission requires a live open exit with inbound traversal enabled
and a type not listed in `[network] entity-transfer-deny-types`
(comma-separated Bukkit entity type names, case-insensitive). A transfer-ID
ledger suppresses duplicate creation. Accepted ACKs are retried. The source
entity is removed only after an accepted ACK. Send failure, denial, timeout, or
scheduler rejection restores the source entity's captured transit state. Late
accepted ACKs use tombstones to remove a restored duplicate.

Players never use this snapshot path. Their profile, capacity, transfer-method,
and client-handoff rules remain the player path described above.

## Server connect and list

Permission: `wormholes.admin.network`. Player-only for connect.

| Command | Effect |
|---------|--------|
| `/wormholes server connect <name>` | Transfer yourself to a linked server (`ServerConnectService`) |
| `/wh server <name>` | Same connect path when the second argument has no `=` |
| `/wormholes server list` | Linked servers with ready/offline plus game address |

Unknown names are rejected. A peer that is not reachable reports not-ready and
points at `/wh network status`.

## Operator workflow

1. On server A: `/wormholes server export` → copy `WHS1.…`
2. On server B: `/wormholes server import <code>` (`network import` is an alias)
3. Reverse export/import so both sides have routes and trust (one-way import
   creates a route on the importer only)
4. Make sure `accepts-transfers=true` (or rely on auto-accept) on destinations
   that receive direct transfers
5. Open the game port and the actual raw peer port reported by
   `/wormholes network status`. `listen-port` must be 1–65535; an invalid value
   is canonicalized to 8901. The listener tries the configured port through the
   next 50 valid ports, capped at 65535, when ports are busy. Reserve the
   configured port or permit the reported bound port/range.
6. Link gateways: portal Export (`WHP5.…`) on one side, import + Link menu on
   the other
7. Verify: `/wormholes network status`, `/wormholes server list`,
   `/wormholes network doctor`

## Troubleshooting

| Command | Use |
|---------|-----|
| `/wormholes network status` | Listen address or outbound-only, fingerprint, peer state + RTT + last error. Auto-runs doctor when any listed peer is not `CONNECTED`. |
| `/wormholes network doctor` | Free-form diagnostic lines when peers fail to connect |
| `/wormholes debug` | Toggle one-second projection/network/queue/peer/handoff telemetry to **console** on both servers while reproducing a failed handoff. Toggle again to stop |
| `/wormholes stats` | Path to live snapshot file (network/view state) |

Direct transfer debug lines include client address, LAN classification,
selected `host:port`, and configured endpoints. The destination logs
transfer-gate handshake rewrite when auto-accept runs.

For an entity-transfer denial check, add a Bukkit entity type name to
`entity-transfer-deny-types` and verify the source entity is restored. The
TRANSFERS and failure sections in the stats snapshot include both player
handoffs and entity transfers.

## Related docs

- [01 - Installation & Configuration](/wormholes/01-installation-configuration) — full `[network]` key tables
- [09 - Commands & Permissions](/wormholes/09-commands-permissions) — permission nodes for network/server
- [04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings) — gateway link UI
- [13 - Runtime Architecture](/wormholes/13-runtime-architecture) — managers and storage
