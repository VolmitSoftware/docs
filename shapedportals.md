---
title: "Shaped Portals"
description: "Build custom-shaped Nether and End portals and manage them in-game"
published: true
date: 2026-09-01T00:00:00.000Z
tags: "shapedportals, portals, folia, configuration"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<section aria-label="Shaped Portals introduction" style="overflow:hidden;padding:clamp(1.5rem,4vw,3rem);border:1px solid rgba(255,255,255,.14);border-radius:18px;background:linear-gradient(132deg,#100919 0%,#2b123c 62%,#541877 100%);color:#fff;box-shadow:0 18px 42px rgba(35,12,50,.24)">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:clamp(1.25rem,4vw,3rem);align-items:center">
    <div style="max-width:720px">
      <span style="font-size:.78rem;font-weight:800;letter-spacing:.04em;color:#d8b4fe">Native Nether and End portals</span>
      <h2 style="margin:.55rem 0 .7rem;font-size:clamp(2.35rem,6vw,4.3rem);line-height:1;letter-spacing:-.04em">Build the shape you want.</h2>
      <p style="max-width:650px;margin:0;font-size:clamp(1rem,2.2vw,1.2rem);line-height:1.6;color:rgba(255,255,255,.84)">Create upright Nether portals or horizontal End portals with custom outlines and sizes. Minecraft still controls travel and destination creation.</p>
      <nav aria-label="Get started" style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:1.4rem">
        <a href="/shapedportals/00-overview#build-your-first-portal" style="display:inline-block;padding:.75rem 1rem;border-radius:9px;background:#fff;color:#3b0d55;font-weight:800;text-decoration:none">Build your first portal →</a>
        <a href="/shapedportals/03-compatibility-operations#platform-matrix" style="color:#fff;font-weight:700;text-underline-offset:.2em">Check requirements</a>
      </nav>
      <p style="margin:1.15rem 0 0;font-size:.86rem;color:rgba(255,255,255,.72)">Spigot 1.20.1+ · Paper and Folia · Java 17 bytecode</p>
    </div>
    <img src="/home-assets/shapedportals.jpg" alt="Shaped Portals logo" width="180" height="180" style="display:block;width:min(34vw,180px);height:auto;justify-self:center;border-radius:16px;filter:drop-shadow(0 14px 20px rgba(0,0,0,.42))">
  </div>
</section>

<<<<<<< Updated upstream
## Start here

<section aria-label="Getting started" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;align-items:start">
  <div style="padding:1.25rem 1.35rem;border-left:4px solid #a855f7;background:rgba(168,85,247,.06)">
    <h3 style="margin:0 0 .55rem">Build your first portal</h3>
    <p style="margin:0 0 .85rem;line-height:1.6;opacity:.82">Follow the short build guide for either portal type, then use the same page to find commands, teleport controls, and permissions.</p>
    <a href="/shapedportals/00-overview" style="font-weight:800;text-underline-offset:.18em">Open the getting-started guide →</a>
  </div>
  <div style="padding:.2rem 0 .2rem 1rem">
    <h3 style="margin:0 0 .55rem">What Shaped Portals changes</h3>
    <p style="margin:0;line-height:1.6;opacity:.82">The plugin changes which frames can activate and keeps its managed portal surfaces intact. It does not pair portals, choose destinations, or replace vanilla travel.</p>
  </div>
</section>

## Portal types

| Detail | Nether portals | End portals |
|---|---|---|
| **Orientation** | Upright on the X or Z plane | Horizontal on the X/Z plane |
| **Boundary** | Configured frame materials | Fully eyed End Portal Frames |
| **Activation** | Light an allowed interior block | Insert the final Eye of Ender |
| **Default interior** | 2–256 connected blocks | 1–256 connected blocks |

{.dense}

Both types place native portal blocks. Shaped Nether portals use Minecraft's normal Nether travel, and shaped End portals use Minecraft's normal End travel.

## Find the right guide

<nav aria-label="Shaped Portals documentation" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;margin-top:.25rem">
  <section style="padding-left:1rem;border-left:3px solid #a855f7">
    <h3 style="margin:.05rem 0 .75rem">Build and use</h3>
    <p style="margin:0 0 .9rem"><a href="/shapedportals/00-overview" style="font-weight:800">Getting started</a><br><span style="opacity:.74">Build Nether and End portals, use commands, visit saved portals, and check permissions.</span></p>
  </section>
  <section style="padding-left:1rem;border-left:3px solid #a855f7">
    <h3 style="margin:.05rem 0 .75rem">Configure and operate</h3>
    <p style="margin:0 0 .9rem"><a href="/shapedportals/01-installation-configuration" style="font-weight:800">Installation and configuration</a><br><span style="opacity:.74">Install the plugin, use the editor, manage languages, and find every setting.</span></p>
    <p style="margin:0 0 .9rem"><a href="/shapedportals/02-portal-behavior-events" style="font-weight:800">Portal behavior and troubleshooting</a><br><span style="opacity:.74">Understand repairs, saved records, protection hooks, and common failures.</span></p>
    <p style="margin:0"><a href="/shapedportals/03-compatibility-operations" style="font-weight:800">Compatibility and diagnostics</a><br><span style="opacity:.74">Check platforms, Java versions, Folia limits, debug reports, and React metrics.</span></p>
  </section>
  <section style="padding-left:1rem;border-left:3px solid #a855f7">
    <h3 style="margin:.05rem 0 .75rem">Develop and integrate</h3>
    <p style="margin:0 0 .9rem"><a href="/shapedportals/04-architecture-limits" style="font-weight:800">Developer reference</a><br><span style="opacity:.74">Review geometry, persistence, event contracts, region ownership, and builds.</span></p>
    <p style="margin:0"><a href="https://github.com/VolmitSoftware/ShapedPortals" style="font-weight:800">Source and issues</a><br><span style="opacity:.74">Browse the implementation or report a reproducible problem.</span></p>
  </section>
=======
<div class="sp-home">
<section class="sp-hero" aria-label="About Shaped Portals">
<div>
<div class="sp-identity"><img src="/home-assets/shapedportals.jpg" alt="Shaped Portals logo" width="56" height="56"><span>Shaped Portals</span></div>
<h2>Custom-shaped<br>Nether &amp; End portals</h2>
<p>Build vertical Nether portals or horizontal End portals with non-vanilla sizes and outlines. Keep normal Minecraft travel, and manage every portal rule from an in-game menu.</p>
<nav class="sp-actions" aria-label="Get started"><a class="sp-primary" href="/shapedportals/00-overview#build-your-first-portal">Build a portal</a><a href="/shapedportals/01-installation-configuration">Install &amp; configure</a></nav>
</div>
<div class="sp-media"><strong>Gameplay video goes here</strong><span>Build an irregular frame, light it, and walk through the finished portal.</span></div>
</section>
<section class="sp-section" aria-labelledby="sp-first-portal">
<h2 id="sp-first-portal">Your first portal</h2>
<ol class="sp-steps">
<li><strong><span class="sp-number">1</span> Build a frame</strong><p>Use obsidian or crying obsidian. Keep the frame upright, closed, and in one flat plane.</p></li>
<li><strong><span class="sp-number">2</span> Light the inside</strong><p>Use flint and steel inside the frame. By default, the connected interior can contain 2 to 256 blocks.</p></li>
<li><strong><span class="sp-number">3</span> Step through</strong><p>Travel works like a normal Nether portal. The destination portal may still be a rectangle.</p></li>
</ol>
<p class="sp-note"><strong>Shape, not routing.</strong> Shaped Portals changes the Nether and End frames you can build. It does not add custom destinations or linked networks.</p>
</section>
<section class="sp-section" aria-labelledby="sp-guides">
<h2 id="sp-guides">Find what you need</h2>
<nav class="sp-guides" aria-label="Shaped Portals documentation">
<a href="/shapedportals/00-overview#commands"><strong>Commands &amp; permissions</strong><span>Quick command reference, defaults, and teleport access.</span></a>
<a href="/shapedportals/01-installation-configuration"><strong>Installation &amp; configuration</strong><span>Server setup, the in-game editor, and every setting.</span></a>
<a href="/shapedportals/02-portal-behavior-events"><strong>Portal behavior</strong><span>Frame changes, repairs, protection plugins, and saved portals.</span></a>
<a href="/shapedportals/02-portal-behavior-events#troubleshooting"><strong>Something not working?</strong><span>Check ignition, permissions, disappearing blocks, and travel.</span></a>
<a href="/shapedportals/03-compatibility-operations"><strong>Compatibility &amp; operations</strong><span>Server requirements, Folia limits, and React integration.</span></a>
<a href="/shapedportals/04-architecture-limits"><strong>Developer reference</strong><span>Geometry, persistence, events, and region ownership.</span></a>
>>>>>>> Stashed changes
</nav>

<section aria-label="Commands and support" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:1.75rem;padding:1rem 0;border-top:1px solid rgba(127,127,127,.25);border-bottom:1px solid rgba(127,127,127,.25)">
  <div><strong>Command aliases</strong><br><span style="opacity:.75"><code>/shapedportals</code> · <code>/shapedportal</code> · <code>/sp</code></span></div>
  <nav aria-label="Support and downloads" style="display:flex;gap:1rem;flex-wrap:wrap"><a href="https://www.spigotmc.org/resources/shaped-portals.95595/">Download</a><a href="https://volmitsoftware.com/discord">Discord</a><a href="https://github.com/VolmitSoftware/ShapedPortals">GitHub</a></nav>
</section>
