---
title: "Shaped Portals"
description: "Build custom-shaped Nether and End portals and manage them in-game"
published: true
date: 2026-09-01T00:00:00.000Z
tags: "shapedportals, portals, folia, configuration"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

<style>
.sp-home { max-width: 1120px; margin: 0 auto; line-height: 1.65; }
.sp-home * { box-sizing: border-box; }
.sp-home .sp-hero { display: grid; grid-template-columns: 1.1fr 1fr; gap: 2.5rem; align-items: center; padding: 1.5rem 0 2rem; }
.sp-home .sp-identity { display: flex; gap: .8rem; align-items: center; margin-bottom: 1.25rem; font-weight: 600; }
.sp-home .sp-identity img { width: 56px; height: 56px; object-fit: contain; border-radius: 10px; background: #08060b; }
.sp-home .sp-hero h2 { margin: 0 0 1rem; padding: 0; border: 0; font-size: clamp(1.8rem, 3.5vw, 2.75rem); line-height: 1.15; letter-spacing: -.025em; }
.sp-home .sp-hero p { margin: 0 0 1.4rem; max-width: 38rem; }
.sp-home .sp-actions { display: flex; flex-wrap: wrap; gap: .65rem; }
.sp-home .sp-actions a { padding: .6rem .95rem; border: 1px solid rgba(127,127,127,.35); border-radius: 7px; color: inherit; text-decoration: none; font-weight: 600; }
.sp-home .sp-actions .sp-primary { background: #7135aa; border-color: #7135aa; color: #fff; }
.sp-home .sp-actions a:hover { background: rgba(146,93,198,.12); }
.sp-home .sp-actions .sp-primary:hover { background: #59258c; }
.sp-home a:focus-visible { outline: 3px solid #a66bdd; outline-offset: 4px; }
.sp-home .sp-media { min-width: 0; min-height: 250px; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .6rem; border: 1px dashed rgba(127,127,127,.5); border-radius: 10px; background: rgba(146,93,198,.05); text-align: center; }
.sp-home .sp-media span { max-width: 25rem; font-size: .9rem; }
.sp-home .sp-section { margin: 2rem 0; }
.sp-home .sp-section h2 { margin: 0 0 1rem; padding: 0; border: 0; font-size: 1.4rem; }
.sp-home .sp-steps { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 1rem; padding: 0; list-style: none; }
.sp-home .sp-steps li { min-width: 0; padding: 1.2rem; border: 1px solid rgba(127,127,127,.25); border-radius: 8px; }
.sp-home .sp-steps strong { display: block; margin-bottom: .45rem; font-size: 1.05rem; }
.sp-home .sp-steps p { margin: 0; font-size: .95rem; }
.sp-home .sp-number { display: inline-grid; place-items: center; width: 1.65rem; height: 1.65rem; margin-right: .4rem; border-radius: 5px; background: rgba(146,93,198,.14); font-size: .85rem; }
.sp-home .sp-note { margin: 1rem 0; padding: .8rem 1rem; border: 1px solid rgba(127,127,127,.25); border-radius: 7px; font-size: .92rem; }
.sp-home .sp-guides { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .75rem; }
.sp-home .sp-guides a { display: block; min-width: 0; padding: 1rem 1.15rem; border: 1px solid rgba(127,127,127,.25); border-radius: 8px; color: inherit; text-decoration: none; }
.sp-home .sp-guides a:hover { border-color: #9861c9; background: rgba(146,93,198,.06); }
.sp-home .sp-guides strong { display: block; margin-bottom: .15rem; }
.sp-home .sp-guides span { font-size: .9rem; }
.sp-home .sp-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; padding: 1.3rem 0; margin-top: 2rem; border-top: 1px solid rgba(127,127,127,.25); font-size: .9rem; }
.sp-home .sp-footer nav { display: flex; flex-wrap: wrap; gap: 1rem; }
@media (max-width: 760px) {
  .sp-home .sp-hero { grid-template-columns: 1fr; gap: 1.5rem; }
  .sp-home .sp-steps, .sp-home .sp-guides { grid-template-columns: 1fr; }
  .sp-home .sp-media { min-height: 190px; padding: 1.5rem; }
}
</style>

<div class="sp-home">
<section class="sp-hero" aria-label="About Shaped Portals">
<div>
<div class="sp-identity"><img src="/home-assets/shapedportals.jpg" alt="Shaped Portals logo" width="56" height="56"><span>Shaped Portals</span></div>
<h2>Custom-shaped<br>Nether &amp; End portals</h2>
<p>Build vertical Nether portals or horizontal End portals with non-vanilla sizes and outlines. Keep normal Minecraft travel, and manage every portal rule from an in-game menu.</p>
<nav class="sp-actions" aria-label="Get started"><a class="sp-primary" href="/shapedportals/00-overview#build-your-first-portal">Build a portal</a><a href="/shapedportals/01-installation-configuration">Install &amp; configure</a></nav>
</div>
<div class="sp-media"><strong>Choose Nether or End</strong><span>Light a closed vertical Nether frame, or finish a fully eyed horizontal End Portal Frame boundary.</span></div>
</section>
<section class="sp-section" aria-labelledby="sp-first-portal">
<h2 id="sp-first-portal">Your first portal</h2>
<ol class="sp-steps">
<li><strong><span class="sp-number">1</span> Build for the Nether</strong><p>Close an upright frame around 2 to 256 connected interior blocks, then light the inside.</p></li>
<li><strong><span class="sp-number">2</span> Build for the End</strong><p>Close a horizontal End Portal Frame boundary around 1 to 256 connected cells, then insert every eye.</p></li>
<li><strong><span class="sp-number">3</span> Use native travel</strong><p>The placed portal blocks keep normal Minecraft travel. Shaped Portals does not choose or pair destinations.</p></li>
</ol>
<p class="sp-note">Shaped Portals changes the Nether and End frames you can build. It does not add custom destinations or linked networks.</p>
</section>
<section class="sp-section" aria-labelledby="sp-guides">
<h2 id="sp-guides">Find what you need</h2>
<nav class="sp-guides" aria-label="Shaped Portals documentation">
<a href="/shapedportals/00-overview#commands"><strong>Commands &amp; permissions</strong><span>Quick command reference, defaults, and teleport access.</span></a>
<a href="/shapedportals/01-installation-configuration"><strong>Installation &amp; configuration</strong><span>Server setup, the in-game editor, and every setting.</span></a>
<a href="/shapedportals/02-portal-behavior-events"><strong>Portal behavior</strong><span>Frame changes, repairs, protection plugins, and saved portals.</span></a>
<a href="/shapedportals/02-portal-behavior-events#troubleshooting"><strong>Something not working?</strong><span>Check ignition, permissions, disappearing blocks, and travel.</span></a>
<a href="/shapedportals/03-compatibility-operations"><strong>Compatibility</strong><span>Supported servers, Java versions, Folia limits, and React integration.</span></a>
<a href="/shapedportals/04-architecture-limits"><strong>Developer reference</strong><span>Geometry, persistence, region ownership, native mechanics, and build details.</span></a>
</nav>
</section>
<footer class="sp-footer"><span>Root commands: <code>/shapedportals</code>, <code>/shapedportal</code>, and <code>/sp</code></span><nav aria-label="Support and downloads"><a href="https://www.spigotmc.org/resources/shaped-portals.95595/">Download</a><a href="https://volmitsoftware.com/discord">Discord</a><a href="https://github.com/VolmitSoftware/ShapedPortals">Source</a></nav></footer>
</div>
