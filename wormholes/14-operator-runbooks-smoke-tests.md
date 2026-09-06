---
title: "Operator Runbooks & Smoke Tests"
description: "Repeatable checks for install, portals, projection, RTP, doors, networking, and recovery"
published: true
date: 2026-09-06T00:00:00.000Z
tags: "wormholes"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---
Use these checks after installing or updating Wormholes.

## First portal

1. Build a supported frame and create a portal.
2. Open its menu with the Portal Wand and confirm its name and type.
3. Link or configure its destination.
4. Walk through it and confirm the destination is safe and correct.

See [Building Portals](/wormholes/03-building-portals) and [Commands & Permissions](/wormholes/09-commands-permissions).

## Operator access bypass

1. Set a linked portal to `LOCKED` and use a blacklist or whitelist state that
   rejects an ordinary player.
2. Confirm the ordinary player is rejected.
3. Op that player and confirm local travel succeeds in both directions.
4. For gateways, repeat against an incoming-disabled remote destination and
   confirm the op is admitted.
5. Enable mirror mode and confirm travel remains locked for the op.

## Projection

Stand where the source view should be visible and confirm the selected projection mode updates. If it does not, check the portal's mode, quality preset, distance limits, and required packet integration.

## Cross-server travel

Use matching Wormholes builds on both servers. Export and import current codes in both directions before testing.

1. Check the public and private game endpoints with `/wh network status` and `/wh network doctor`.
2. Connect with `/wh server connect <name>` before linking gateway portals.
3. Link two gateways and walk through in both directions.
4. Confirm the destination position and the source arrival receipt in verbose logs.
5. Repeat from a client on the server machine and from another LAN machine.
6. Repeat from an Internet client if the route is public.
7. Stop the destination and confirm a traveler remains on the source server with a failure notice.
8. Configure a wrong game port and confirm endpoint verification prevents disconnection.
9. Restore the route and confirm travel recovers without recreating the gateways.
10. Retreat during a delayed connection check and confirm no later transfer occurs.

For two servers on one machine, use distinct game ports and server names. Check the actual raw listener ports when both request 8901. Test public-to-private port mapping separately from a configuration where both ports match.

For a private remote server, verify the client's VPN or proxy path. A ready Wormholes peer connection alone does not prove client access. Test explicit client CIDRs when LAN clients cannot use the public address.

Test native `accepts-transfers=true` after a restart. Also test the compatibility path with native acceptance disabled and `auto-accept-transfers=true`. Neither mode bypasses authentication, whitelist, player limits, or proxy forwarding.

For repeated transfers, inspect destination login logs for connection-throttle rejections. Test two clients behind the same public IP when that topology matters.

Source logs distinguish endpoint rejection, destination placement failure, and unconfirmed arrival. Completed-transfer statistics count confirmed arrivals. Costs commit at dispatch, and a later connection failure does not automatically refund them.

See [Cross-Server Networking](/wormholes/10-cross-server-networking).

### Automated cross-server QA for maintainers

The scenario at `WormholesPlugin/src/test/gameplay/cross-server-transfer.mjs` keeps one observer connected while a separate traveler changes servers. It checks four command transfers and four frame crossings, including transfer packets, UUID continuity, destination placement, and unexpected disconnects.

Build the separate fixture after building Wormholes. From the WormholesPlugin root, run:

```bash
./gradlew -p src/test/gameplay/fixture \
  -PwormholesJar="$PWD/build/libs/Wormholes-2.0.4-26.2.jar" jar
```

Use two disposable, isolated Multiplexor instances with distinct game ports and server names. Prepare offline authentication through `gameplay prepare` while stopped. Install matching Wormholes jars and `src/test/gameplay/fixture/build/libs/WormholesTransferFixture-1.0.0.jar` on both instances. The production build excludes the fixture.

Start both servers and wait for readiness. Set the test worlds to peaceful difficulty. Give `GateTraveler` and `GateKeeper` operator status on both servers. The fixture clears blocks at X/Z 1 through 14 and Y 101 through 107. It builds a platform at Y 100 and creates a gateway. It disables projection for the test portals.

Run through Multiplexor, with the scenario path resolved from the WormholesPlugin checkout:

```bash
WORMHOLES_DEST_PORT=25568 ./start.sh --consumer plugin gameplay run \
  /absolute/path/WormholesPlugin/src/test/gameplay/cross-server-transfer.mjs \
  source-instance --username GateObserver --timeout 300 --json
```

| Environment variable | Meaning |
| --- | --- |
| `WORMHOLES_DEST_PORT` | Required destination Minecraft port |
| `WORMHOLES_DEST_HOST` | Destination client host; defaults to the source host |
| `WORMHOLES_SOURCE_NAME` | Source Wormholes server name; defaults to `link-a` |
| `WORMHOLES_DEST_NAME` | Destination Wormholes server name; defaults to `link-b` |
| `WORMHOLES_NATIVE_TRANSFER` | Set `true` when both servers have native `accepts-transfers=true`; otherwise expect the compatibility path |
| `WORMHOLES_REFUSAL` | Set `wrong-endpoint` or `offline` to run a rejection check using existing linked servers |
| `WORMHOLES_COMMAND_ROUNDS` | Command round trips; defaults to 2 |
| `WORMHOLES_GATEWAY_ROUNDS` | Gateway round trips; defaults to 2 |
| `WORMHOLES_RELOAD` | Set `true` to reload both plugins and check peer readiness before transfers |
| `WORMHOLES_JAR_SHA256` | Optional deployed-jar checksum to record in the report; verify both deployed files separately |

The normal run exchanges current server and portal codes. Restart both servers between native and compatibility acceptance tests. Disable both raw listeners and UDS to test game-port transport. For rejection tests, first misconfigure the destination client route or stop the destination. Restore the route afterward.

For a reload check with one command round trip, set `WORMHOLES_RELOAD=true`, `WORMHOLES_COMMAND_ROUNDS=1`, and `WORMHOLES_GATEWAY_ROUNDS=0`. Each round count accepts zero through ten. At least one round must remain enabled. The report requires a source arrival confirmation for every completed transfer, no new handoff failures, and no pending transfers.

Match each JSON report with destination login logs and source arrival confirmations. Check that the viewer URL matches its state file and closes after the run. Stop and delete the disposable instances when verification ends. This test does not prove Internet reachability, client rendering, proxy authentication, or behavior behind shared public IPs.

## Blackout and projection checks

1. Move along the aperture edges and inspect the far, side, floor, and ceiling seals.
2. Repeat at oblique angles, near a chunk boundary, and with large projection depth.
3. Check for seams, flicker, missing panels, unwanted shadows, and exposed local scenery.
4. Change blackout color and move while the mesh changes.
5. Change equipment on a visible destination entity and confirm the projection refreshes.
6. Relink an open portal while an observer stands still and confirm the old view disappears.

Protocol bots can verify entity packets and traversal. A Minecraft client must verify blackout appearance and movement quality. Use a representative active workload for profiler comparisons.

## Recovery

Back up Wormholes data before resets or manual restoration. If a reload leaves portals, projections, or tasks in an inconsistent state, restart the server instead of repeating the reload.

To check persistence, stop a server with at least one saved portal. Restart it and confirm the portal loads with the same destination and settings.
