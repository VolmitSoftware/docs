---
title: "Cross-Server Networking"
description: "Codes, trust, handoff, transfer modes, and doctor"
published: true
date: 2026-09-06T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Wormholes links servers through pasteable codes. It stores routes under `routes/` and trusted public keys under `trust/`. Linked servers must run compatible Minecraft and Wormholes versions.

## Enable and auto-enable

| Setting | Default | Role |
|---------|---------|------|
| `[network] enabled` | `false` | Master switch for cross-server networking |
| Import / export | Not applicable | Sets `enabled = true`, persists config, and starts `NetworkManager` if not running |

Manual enable: set `enabled = true` in
`plugins/Wormholes/wormholes.toml` and reload or restart. Importing or exporting a code also enables networking.

Other network keys:
[01 - Installation & Configuration](/wormholes/01-installation-configuration)
(`[network]` and nested tables).

## Codes

| Kind | Prefix | Source | Contents (encoded) |
|------|--------|--------|---------------------|
| Server | `WHS2.` | `/wormholes server export` | Server name, raw peer endpoint, public and private game endpoints, public key |
| Portal | `WHP6.` | Gateway portal Export UI | Same endpoint/key material plus portal UUID and portal name |

Encoding is URL-safe Base64 after the prefix. Invalid codes reject with a
message naming both prefixes.

### Import

| Command | Effect |
|---------|--------|
| `/wormholes server import <code>` | Accepts `WHS2.` or `WHP6.` |
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
Peers with the old key will reject it until trust is deliberately replaced. The signatures authenticate peer handshakes and status envelopes. They do not encrypt the connection. Raw frames after the handshake have no per-frame authentication, so protect raw transport with a trusted network or VPN.

## Raw peer admission

TCP and Unix-domain listeners allow up to 128 inbound connections that have not completed a handshake. Excess connections close immediately. Ready peers and outbound reconnects do not use this limit.

## Transfer mode

`[network] transfer-mode` selects how players move between servers:

| Mode | Selection |
|------|-----------|
| `auto` (default) | **PROXY** for a name in `proxy-servers` or a peer route with `useProxy`, otherwise **DIRECT** |
| `proxy` | Always BungeeCord plugin message `Connect` on channel `BungeeCord` with peer name |
| `direct` | Paper `player.transfer(host, port)` to resolved game host/port |

Use `proxy-servers` to mix proxy backends and direct destinations:

```toml
[network]
transfer-mode = "auto"
proxy-servers = ["lobby", "survival"]
```

Explicit `direct` or `proxy` mode overrides this list. Names must match the imported destination and the proxy server configuration. Imports preserve each endpoint as a host and port pair. Direct transfer requires a client protocol from Minecraft 1.20.5 or later.

## Network endpoints

Each server advertises three independent endpoints:

| Endpoint | Used by | Configuration |
|----------|---------|---------------|
| Raw peer | Wormholes servers for replication and control | `advertise-host-override`, actual bound `listen-port` |
| Public game | Players and game-port sideband | `game-host-override`, `game-port-override` |
| Private game | Verified same-machine or LAN routes | `private-game-host-override`, `private-game-port-override` |

Blank game host uses the advertised host. Blank private host uses a concrete `server-ip` bind address, otherwise the detected LAN address. A zero game-port override uses the actual Bukkit game port. Set the public game-port override to the external port when NAT maps it to another internal port.

A peer handshake never replaces the public game port with the internal game port. Signed status replies also advertise the current raw listener port. This repairs raw routes when another process occupies the preferred port.

### Direct endpoint selection

An explicit `client-routes` entry takes priority. The longest matching client CIDR selects the destination host and port for that server.

Without an explicit route, automatic selection uses these rules:

| Client and peer context | Selection |
|-------------------------|-----------|
| Loopback client with verified same-machine endpoint | Verified private endpoint |
| LAN client and verified private destination on the same source-interface subnet | Verified private endpoint |
| LAN client with only a loopback destination | Do not send the client to its own computer |
| Other client with a public endpoint | Public endpoint |
| Private destination outside the known client network | Reject unless an explicit client route supplies the address |

A private IP alone does not prove that two machines share a network. Link-local addresses need an explicit usable route. Endpoint selection performs no DNS lookup on the player thread.

Before admission, an asynchronous probe checks the selected game endpoint. The response must match the stored key, peer name, request nonce, Minecraft version, and wire version. Probes do not trust new keys, mark peers ready, or consume sideband queues.

The source can sometimes reach a private game address but cannot connect through its own public NAT address. In that case, a signed response from the same destination's verified private endpoint can allow the selected public endpoint. This checks destination availability. It cannot prove that the client can reach the public address. A wrong or unauthenticated responder at the selected address still rejects the transfer.

The source stores the selected endpoint for that handoff. Discovery updates cannot change its host or port between admission and dispatch.

### Same machine

Use distinct server names and game ports. Both servers can request raw port 8901. The second listener selects another free port and advertises that port.

For testing with a client on the server machine:

```toml
[network]
server-name = "survival"
advertise-host-override = "127.0.0.1"
game-host-override = "127.0.0.1"
private-game-host-override = "127.0.0.1"
game-port-override = 0
private-game-port-override = 0
```

For clients on other computers, advertise a reachable LAN or public game address. Do not advertise loopback as their destination.

### Public NAT and LAN clients

On a destination whose internal port is 25566 and public port is 30002:

```toml
[network]
server-name = "survival"
game-host-override = "play.example.net"
game-port-override = 30002
private-game-host-override = "192.168.1.20"
private-game-port-override = 25566
```

On a source that needs an explicit LAN route:

```toml
[[network.client-routes]]
server = "survival"
client-cidr = "192.168.1.0/24"
host = "192.168.1.20"
port = 25566
```

Use the same route mechanism for VPN subnets, routed private networks, containers, and split DNS. Entries match the client address that the source server sees. Behind a proxy, configure routes for the forwarding behavior in use.

### Remote and non-forwarded servers

A direct transfer instructs the player's client to open a new connection. The destination therefore needs a game endpoint reachable from that client. Opening only the raw Wormholes port does not provide player access.

A non-forwarded server can serve local or VPN clients that can reach its private address. Internet clients need a forwarded game port, a reachable proxy with backend access, or a suitable tunnel/VPN. Wormholes does not open router ports or relay Minecraft client connections through the raw peer channel.

## Handoff admission

Gateway travel and `/wormholes server connect` use the same admission path. Before dispatch, the destination must grant a rate-limited lease for that player.

Destination checks include:

- Live destination portal is open and not mirror-only. Incoming traversals must be enabled for non-op players. Ops bypass that direction flag
- Selected transfer method is supported
- Direct source and destination use the same authentication mode
- Offline direct login preserves the supplied player UUID. Forwarded identities require the configured proxy path
- Profile passes ban and whitelist gates (ops exempt from whitelist)
- Online players + pending arrivals stay under the player limit
- Direct transfer support: native Paper transfers or compatibility path
- Portal arrivals have loaded the destination chunk and its eight neighbors

| Outcome | Result |
|---------|--------|
| Deny / timeout / cooldown | Traveler returned to the source-facing side of the portal (not left in-plane / not orphaned disconnect) |
| Accept | Reservation remains active until portal placement succeeds, or the normal join completes for a server command |

### Rate limits

| Source | Value |
|--------|--------|
| Interval | `max(1000 ms, teleport-cooldown-millis)` (`TraversalAdmissionPolicy.handoffRateLimitMillis`) |
| Scope | Per-player outbound and destination admission rate limiters |
| Failure | Penalty re-applies the interval. Denials can carry `retryAfterMillis` |

### Handoff timeout

`[network] handoff-timeout-ms` (default `5000`, normalized to 50 through 60000 ms)
sets the base source deadline. Direct handoffs add 7000 ms for endpoint verification, giving verification and admission a combined 12-second deadline by default. The source hold uses that combined deadline and cancels on retreat, world change, scheduler retirement, or expiry. The existing 30-second local in-flight limit can cancel a longer configured hold.

After dispatch, the source waits up to 60 seconds for an arrival receipt. Only a confirmed arrival increments the completed transfer count. Lost receipts trigger one status query per second. The destination retains terminal receipts for 120 seconds.

Portal placement retries transient failures up to five times. Destination access is checked again after the asynchronous teleport. A denied arrival requests a new admitted return trip when possible. Otherwise, the player remains at the destination and receives a failure notice.

If a traveler reconnects while destination placement is pending, the new session can resume the active reservation. Callbacks from the retired session cannot change the new placement or its arrival receipt.

Costs commit when the source dispatches the transfer. Rejected dispatches refund the reservation. A later client connection failure is reported separately and does not automatically refund a committed cost.

## Paper transfers and auto-accept

| Mechanism | Setting | Notes |
|-----------|---------|--------|
| Native Paper | `accepts-transfers=true` in **destination** `server.properties` + restart | Required for first-class transfer handshakes |
| Compatibility | `[network] auto-accept-transfers = true` (default) | `TransferGate` rewrites TRANSFER to LOGIN only when native transfer acceptance is disabled |

Native acceptance preserves Paper’s transferred-player flag. Compatibility rewriting still uses the normal login and authentication checks. Proxy forwarding requirements remain active.

Destination support is treated as true when `autoAcceptTransfers` **or** the
platform reports accepting transfers. Direct transfers fail admission with
“destination does not accept direct transfers” when neither path is active.

## Wire protocol

| Constant | Value |
|----------|--------|
| `WireCodec.PROTOCOL_VERSION` | **20** |
| Signed status-sideband envelope | **7** |
| Route entry format | **2** |

Raw handshakes and signed sideband envelopes require matching Minecraft, Wormholes, and wire versions. Handshake signatures bind the full Hello/Challenge transcript, including endpoints, versions, and compression fields.

Upgrade all linked servers together. Export and import fresh `WHS2.` or `WHP6.` codes on both sides to populate the current endpoint format. Keep each server's identity and trust files. Existing gateway targets remain identified by peer name and portal UUID.

Optional compression and dictionary negotiation ride the same wire once Hello
succeeds (`[network.transport]`).

## Remote portal views

When a player views a gateway, the linked server sends an initial block and entity snapshot, followed by changes and world time. Failed partial snapshots retry instead of becoming ready with missing data.

The per-portal network-view preset controls block depth, resample heartbeat,
entity interval, and unsubscribe grace. Exact values and custom clamps are in
[04 - Portal Types, Menus & Settings](/wormholes/04-portal-types-menus-settings).
After the grace period, Wormholes releases the remote view. Raw peers can use Zstandard compression. Status-sideband transport is the lower-volume fallback.

## Non-player entity transfer

Eligible non-player entities entering a `UNIVERSAL` gateway are transferred as
Bukkit `EntitySnapshot` data rather than as player handoffs. The source
snapshot is capped at **256 KiB**. The destination recreates the entity at the
exit, then applies the portal's relative position, look, and velocity
transform.

The destination must have an open receiving portal, allow inbound travel, and accept the entity type. Add blocked Bukkit entity types to `[network] entity-transfer-deny-types`. Wormholes removes the source only after the destination accepts it. Failure restores the source entity.

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

1. On server A: `/wormholes server export` → copy `WHS2.…`
2. On server B: `/wormholes server import <code>` (`network import` is an alias)
3. Reverse export/import so both sides have routes and trust (one-way import
   creates a route on the importer only)
4. Make sure `accepts-transfers=true` (or rely on auto-accept) on destinations
   that receive direct transfers
5. Expose the game endpoint to the intended clients. For raw replication, open the actual peer port reported by
   `/wormholes network status`. `listen-port` must be 1 through 65535. An invalid value
   is canonicalized to 8901. The listener tries the configured port through the
   next 50 valid ports, capped at 65535, when ports are busy. Reserve the
   configured port or permit the reported bound port/range.
6. Link gateways: portal Export (`WHP6.…`) on one side, import + Link menu on
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

Verbose logging adds endpoint, handoff, admission, and arrival details while reproducing a problem. Ordinary joins remain quiet.

`HANDOFF_ENDPOINT_REJECTED` means the game endpoint failed verification before dispatch. `HANDOFF_ARRIVAL_FAILED` means the destination reported a placement failure. `HANDOFF_ARRIVAL_UNCONFIRMED` means no receipt arrived within 60 seconds. Check both server logs for client login rejection or a lost control connection.

Native and compatibility transfers still use the destination connection throttle. Rapid return trips or players sharing one public IP can encounter that throttle. Diagnose the destination login message before changing server policy. A backend that requires Velocity or Bungee forwarding needs the configured proxy transfer path.

For an entity-transfer denial check, add a Bukkit entity type name to
`entity-transfer-deny-types` and verify the source entity is restored. The
TRANSFERS and failure sections in the stats snapshot include both player
handoffs and entity transfers.

## Related docs

- [01 - Installation & Configuration](/wormholes/01-installation-configuration), full `[network]` key tables
- [09 - Commands & Permissions](/wormholes/09-commands-permissions), permission nodes for network and server commands
- [04 - Portal Types Menus & Settings](/wormholes/04-portal-types-menus-settings), gateway link UI
