---
title: "Animus Tutorial: Movement"
description: "Capture routes, walk NPCs by command, record a performance and set up mounts and riding"
published: true
date: 2026-11-08T00:00:00.000Z
tags: "animus, tutorial, routes, recordings, mounts, riding"
editor: markdown
dateCreated: 2026-11-08T00:00:00.000Z
---

This is the second part of the Animus tutorial. It makes NPCs move: routes you walk yourself, one-off walks by command, performances recorded from your own moves, and NPCs that ride or carry each other and players. It uses the greeter and trader from [the first part](/animus/22-tutorial-first-npc).

## 1. Capture a route

A route is a list of points an NPC walks. The quickest way to make one is to walk it yourself: start a capture, then drop a point wherever you stand. The file is saved under `routes/` and any number of NPCs can use it. [Routes](/animus/05-movement-mounts-riding#routes) covers every route setting.

<div class="animus-demo">
<p><strong>Route capture</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/15-route-capture-ingame.webm" aria-label="Walking a path and dropping four route points" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In the palette, click **Routes**, then **Capture a route**. The window closes, and the first point is where you stand.
- Walk to the next place. Hold the wand and tap sneak to drop a point. Green sparks mark each point, and an orange flame marks the newest.
- Open **Routes** again and right-click **Capture** to check the points.
- Click **Save route**. It saves `routes/wp-<your name>.json` as a looping walk.

## 2. Put a route on an NPC

A left click on a route in the list puts it on the selected NPCs, and they start walking at once. Sneak-click a route to open its settings. Each change there is one transaction with **[Undo]**. [Routes in the toolkit](/animus/21-in-game-toolkit#routes) lists every setting.

<div class="animus-demo">
<p><strong>Route settings</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/16-route-settings-ingame.webm" aria-label="Putting a route on the trader and changing its speed, order and mode" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the trader, then click **Routes** in the palette.
- Left-click a route to put it on the selection.
- Sneak-click the route. **Speed** steps by 0.5 blocks a second, **Order** cycles `sequence`, `pingpong`, `random` and `wander`, and **Mode** cycles `walk`, `swim` and `fly`.
- Click **Stop moving** to stop the selection.

## 3. Walk an NPC by command

The navigation commands send an active NPC somewhere once, without a route file. Leave out the point to send it to you; `~` and `^` count from where you stand. A manual walk overrides the NPC's route until its definition is applied again. [Manual navigation](/animus/05-movement-mounts-riding#manual-navigation) has every option.

<div class="animus-demo">
<p><strong>Navigation commands</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/17-navigation-command-ingame.webm" aria-label="Walking an NPC to the player and turning it to face him" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

```none
/animus navigation go greeter ^ ^ ^2
/animus navigation look greeter
/animus navigation status greeter
/animus navigation stop greeter
```

`^ ^ ^2` is two blocks in front of you. `status` shows where the NPC is heading and where it is now.

## 4. Record a performance

A recording saves your own moves: walking, jumps, sneaking, arm swings and the doors you open. An NPC can replay it later. Start a recording, move, then stop it to save `recordings/<id>.json`. **Preview** plays it back once as a ghost that only you see. [Performance recordings](/animus/19-performance-recordings) covers limits and the ghost.

<div class="animus-demo">
<p><strong>Recording</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/18-recording-ingame.webm" aria-label="Recording a short performance and previewing it as a ghost" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- In the palette, click **Recordings**, then **Start recording**, and type `wave-dance`. The window closes, and where you stand becomes the origin.
- Move around, jump and sneak.
- Open **Recordings** and click **Stop recording**.
- Sneak-click the new entry and click **Preview**.

```none
/animus record start wave-dance
/animus record stop
/animus record preview wave-dance
```

## 5. Play a recording on an NPC

A left click on a recording plays it on the selected NPCs. A right click steps their playback through `once`, `loop` and `pingpong`, shown in the entry's lore. A recording replaces any route the NPC had. [Playing a recording](/animus/19-performance-recordings#playing-a-recording-on-an-npc) has the details.

<div class="animus-demo">
<p><strong>Recording playback</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/19-recording-playback-ingame.webm" aria-label="The greeter replaying the recording and changing its playback mode" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the greeter, then click **Recordings** in the palette.
- Left-click `wave-dance` to play it on the selection.
- Right-click it to change the playback.

For a clean loop, end the recording close to where you started it.

## 6. Seat one NPC on another

An NPC can ride another NPC, such as a baker on a cart horse. **Mounts** acts on the first selected NPC and shows what it rides and what rides it. [Mounted NPCs](/animus/05-movement-mounts-riding#mounted-npcs) lists the limits.

<div class="animus-demo">
<p><strong>Mounts</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/20-mounts-ingame.webm" aria-label="Seating an NPC on a horse NPC and dismounting it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the rider, then click **Mounts** in the palette.
- Click **Ride another NPC**. The window closes.
- Click the vehicle NPC with the wand.
- Open **Mounts** again and click **Dismount** to take the rider off.

## 7. Let players ride an NPC

A player can ride an NPC whose riding module is on. The player right-clicks the NPC with an empty hand to mount, steers with the movement keys and sneaks to get off. Riding needs `animus.ride`, which operators have by default, unless the NPC names another permission. [Riding an NPC](/animus/05-movement-mounts-riding#riding-an-npc) covers speed, leash and lifetime.

<div class="animus-demo">
<p><strong>Riding</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/21-riding-ingame.webm" aria-label="Changing a horse NPC's riding speed and riding it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Select the NPC, then click **Mounts** and **Riding**.
- Turn on **Enabled** and change **Speed**.
- Click **Save**.
- Right-click the NPC with an empty hand to ride it. Sneak to get off.

```none
/animus ride status
```

Next: [conversations, shops and combat](/animus/24-tutorial-interaction).
