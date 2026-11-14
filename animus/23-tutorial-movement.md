---
title: "Animus Tutorial: Movement"
description: "Make routes by walking them, send NPCs on trips, record your movement and set up mounts and riding"
published: true
date: 2026-11-12T00:00:00.000Z
tags: "animus, tutorial, routes, recordings, mounts, riding"
editor: markdown
dateCreated: 2026-11-08T00:00:00.000Z
---

This is the second part of the Animus tutorial. It makes NPCs move: routes you walk yourself, one-off trips by command, recordings of your own movement, and NPCs that ride or carry each other and players. It uses the greeter and trader from [the first part](/animus/22-tutorial-first-npc).

An NPC moves by a route or by a recording, both under **Movement** on its screen:

- **Route**: walks point to point. The NPC walks from one point to the next and finds its own way between them.
- **Recording**: replays what you did, exactly: steps, looks, sneaks and arm swings.

## 1. Make a route

The quickest way to make a route is to walk it yourself and drop a point wherever the NPC should go. The file is saved under `routes/` and any number of NPCs can use it. [Routes](/animus/05-movement-mounts-riding#routes) covers every route setting.

<div class="animus-demo">
<p><strong>Route capture</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/15-route-capture-ingame.webm" aria-label="Making the Plaza loop route for the trader by dropping four points with the wand" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Right-click the trader with the wand, then click **Movement**, **Route** and **New route**.
- Type `Plaza loop` and click the result paper. The window closes.
- Walk to the first place, hold the wand and tap sneak to drop a point. Green sparks mark each point, and a flame marks the newest. Drop three or four points.
- After each point, chat shows the count and its buttons, such as `3 points [Add] [Undo] [Save] [Cancel]`. Click **[Save]**.

The route is saved as `routes/plaza-loop.json`, a looping walk, and the trader starts walking it. Its Movement screen opens and reads "walks route Plaza loop".

## 2. Change a route

A click on a route in the list puts it on the selected NPCs. A right-click opens its details, where each change goes to every NPC on the route, with **[Undo]** in chat. [Route details](/animus/21-in-game-toolkit#route-details) lists every setting.

<div class="animus-demo">
<p><strong>Route settings</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/16-route-settings-ingame.webm" aria-label="Putting a route on the trader, changing its speed, order and mode, then stopping it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On the trader's Movement screen, click **Route** and right-click **Plaza loop**.
- Click **Speed** to walk 0.5 blocks a second faster; right-click it to slow down.
- Click **Order** to step through **In order**, **Back and forth**, **Random** and **Wander**, and **Mode** for **Walk**, **Swim** and **Fly**.
- Click **Back** twice, then **Stand still** twice to stop the trader and take the route off.

## 3. Send an NPC on a trip

A trip is one walk to a place, started by a command and not saved. Leave out the point to send the NPC to you; `~` and `^` count from where you stand. A trip overrides the NPC's route until its definition is applied again. [Manual navigation](/animus/05-movement-mounts-riding#manual-navigation) has every option.

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

`^ ^ ^2` is two blocks in front of you. `status` shows where the NPC is walking and how far it got.

## 4. Make a recording

A recording saves your own movement: walking, jumps, sneaking, arm swings and the doors you open. An NPC replays it exactly. **Preview** plays it back once as a ghost only you see. [Recordings](/animus/19-performance-recordings) covers limits and the ghost.

<div class="animus-demo">
<p><strong>Recording</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/18-recording-ingame.webm" aria-label="Recording a short performance for the greeter and previewing it as a ghost" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Right-click the greeter with the wand, then click **Movement**, **Recording** and **New recording**.
- Type `wave-dance` and click the result paper. The window closes, chat says the recording copies what you hold and wear, and a countdown of 3 seconds runs above the hotbar. Where you stand when it ends is the start of the recording.
- Move around, jump and sneak.
- Click **[Stop and save]** in chat. The recording is saved as `recordings/wave-dance.json` and put on the greeter, and its Movement screen opens.
- Click **Recording**, right-click `wave-dance` and click **Preview**.

```none
/animus record start wave-dance
/animus record stop
/animus record preview wave-dance
```

## 5. Change how a recording repeats

A click on a recording in the list puts it on the selected NPCs, replacing any route they had. Its details set how they repeat it. [Playing a recording](/animus/19-performance-recordings#playing-a-recording-on-an-npc) has the details.

<div class="animus-demo">
<p><strong>Recording playback</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/19-recording-playback-ingame.webm" aria-label="The greeter replaying the recording and changing how it repeats" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On the greeter's Movement screen, click **Recording** and right-click `wave-dance`.
- Click **Playback** to step through **Once**, **Loop** and **Back and forth**.

For a clean loop, end the recording close to where you started it.

## 6. Seat one NPC on another

An NPC can ride another NPC. Here the greeter rides the trader, the llama from the first part. **Mounts and riding** is in Advanced mode; switch with the **Mode** lever on the NPC screen. It acts on the first selected NPC and shows what it rides and what rides it. [Mounted NPCs](/animus/05-movement-mounts-riding#mounted-npcs) lists the limits.

<div class="animus-demo">
<p><strong>Mounts</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/20-mounts-ingame.webm" aria-label="Seating the greeter on the trader and dismounting it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- On the greeter's Movement screen, click **Mounts and riding**.
- Click **Ride another NPC**. The window closes.
- Click the trader with the wand.
- Open **Mounts and riding** again and click **Dismount** twice to take the greeter off.

## 7. Let players ride an NPC

A player can ride an NPC whose riding is on. The player right-clicks the NPC with an empty hand to get on, steers with the movement keys and sneaks to get off. Riding needs `animus.ride`, which operators have by default, unless the NPC names another permission. [Riding an NPC](/animus/05-movement-mounts-riding#riding-an-npc) covers speed, leash and lifetime.

<div class="animus-demo">
<p><strong>Riding</strong> Minecraft client.</p>
<video src="https://media.volmitsoftware.com/animus-assets/tutorial/in-game/21-riding-ingame.webm" aria-label="Turning on riding for the trader, raising its speed and riding it" autoplay muted loop playsinline controls preload="metadata"></video>
</div>

- Right-click the trader with the wand, then click **Movement**, **Mounts and riding** and **Riding**.
- Click **Enabled** to turn it on and click **Speed** to raise it.
- Click **Save**.
- Close the window and right-click the trader with an empty hand to ride it. Sneak to get off.

```none
/animus ride status
```

Next: [conversations, shops and combat](/animus/24-tutorial-interaction).
