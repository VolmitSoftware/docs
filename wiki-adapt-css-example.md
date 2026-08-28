---
title: "Adapt — Complete CSS Page Example"
description: "A responsive Wiki.js landing page built from verified Adapt documentation and source"
published: true
date: 2026-08-27T00:00:00.000Z
tags: "meta, wikijs, css, layouts, adapt, examples"
editor: markdown
dateCreated: 2026-08-27T00:00:00.000Z
---

This page demonstrates a complete plugin landing page rather than an isolated
component. It uses Adapt's real content model, current requirements, routes,
and visual identity. The layout stays useful as ordinary documentation:
navigation cards have real destinations, claims are verifiable, and important
setup information is visible without reading the whole page.

> The rendered sections use raw HTML with inline CSS so the example remains
> self-contained in Git. Wiki.js must allow HTML and retain inline `style`
> attributes. The final section includes optional scoped CSS for interactive
> states that inline styles cannot express.
{.is-info}

<nav aria-label="Page sections" style="display:flex;gap:.55rem;flex-wrap:wrap;margin:1.25rem 0 1.5rem">
  <a href="#progression" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">Progression</a>
  <a href="#play-styles" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">Play styles</a>
  <a href="#start-here" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">Start here</a>
  <a href="#operators" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">Operators</a>
  <a href="#implementation" style="padding:.48rem .78rem;border:1px solid rgba(127,127,127,.28);border-radius:999px;color:inherit;text-decoration:none">CSS notes</a>
</nav>

<section aria-label="Adapt introduction" style="position:relative;isolation:isolate;overflow:hidden;padding:clamp(1.5rem,5vw,4.25rem);border:1px solid rgba(255,255,255,.12);border-radius:26px;background:radial-gradient(circle at 82% 18%,rgba(239,57,62,.28),transparent 27%),radial-gradient(circle at 13% 88%,rgba(175,24,30,.24),transparent 25%),linear-gradient(135deg,#0e0d0f 0%,#211416 54%,#480f13 100%);color:#fff;box-shadow:0 24px 60px rgba(28,8,10,.28)">
  <div aria-hidden="true" style="position:absolute;z-index:-1;right:-110px;bottom:-150px;width:380px;height:380px;border:1px solid rgba(255,255,255,.08);transform:rotate(45deg)"></div>
  <div aria-hidden="true" style="position:absolute;z-index:-1;right:7%;bottom:-190px;width:380px;height:380px;border:1px solid rgba(239,57,62,.18);transform:rotate(45deg)"></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(1.5rem,4vw,3.5rem);align-items:center">
    <div style="max-width:720px">
      <span style="display:inline-block;padding:.34rem .68rem;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.07);font-size:.74rem;font-weight:800;letter-spacing:.11em">PASSIVE SKILLS · ACTIVE CHOICES</span>
      <h2 style="margin:.75rem 0 .7rem;font-size:clamp(3rem,9vw,6.2rem);line-height:.88;letter-spacing:-.055em">Adapt.</h2>
      <p style="max-width:650px;margin:0;font-size:clamp(1.05rem,2.5vw,1.38rem);line-height:1.65;color:rgba(255,255,255,.84)">Skills that grow with the way you play. Earn knowledge through normal Minecraft activity, then shape a loadout of abilities that feels like yours.</p>
      <div style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.6rem">
        <a href="/adapt/03-player-usage" style="display:inline-block;padding:.82rem 1.08rem;border-radius:10px;background:#d82f35;color:#fff;font-weight:800;text-decoration:none;box-shadow:0 9px 25px rgba(239,57,62,.24)">Start playing →</a>
        <a href="/adapt/01-installation-configuration" style="display:inline-block;padding:.82rem 1.08rem;border:1px solid rgba(255,255,255,.32);border-radius:10px;color:#fff;font-weight:700;text-decoration:none;background:rgba(255,255,255,.04)">Install Adapt</a>
      </div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.4rem;color:rgba(255,255,255,.78);font-size:.84rem">
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.07)">Paper</span>
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.07)">Purpur</span>
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.07)">Folia</span>
        <span style="padding:.32rem .6rem;border-radius:999px;background:rgba(255,255,255,.07)">Java 25</span>
      </div>
    </div>
    <div style="display:grid;place-items:center;min-height:250px">
      <div style="display:grid;place-items:center;width:min(72vw,290px);aspect-ratio:1;border:1px solid rgba(255,255,255,.12);border-radius:32%;background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.015));transform:rotate(8deg);box-shadow:inset 0 0 60px rgba(239,57,62,.09),0 25px 50px rgba(0,0,0,.32)">
        <img src="/home-assets/adapt.png" alt="Adapt logo" width="230" height="202" style="width:80%;height:auto;object-fit:contain;transform:rotate(-8deg);filter:drop-shadow(0 18px 20px rgba(0,0,0,.4))">
      </div>
    </div>
  </div>
</section>

<section aria-label="Adapt at a glance" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;margin-top:1rem;border:1px solid rgba(127,127,127,.24);border-radius:16px;overflow:hidden;background:rgba(127,127,127,.2)">
  <div style="padding:1.15rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit">
    <strong style="display:block;font-size:clamp(1.65rem,4vw,2.3rem);line-height:1;color:#d82f35">23</strong>
    <span style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:800;letter-spacing:.08em;opacity:.68">SKILL LINES</span>
  </div>
  <div style="padding:1.15rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit">
    <strong style="display:block;font-size:clamp(1.65rem,4vw,2.3rem);line-height:1;color:#d82f35">312</strong>
    <span style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:800;letter-spacing:.08em;opacity:.68">DECLARED ADAPTATIONS</span>
  </div>
  <div style="padding:1.15rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit">
    <strong style="display:block;font-size:clamp(1.25rem,3vw,1.7rem);line-height:1.15;color:#d82f35">2.0.0-26.2</strong>
    <span style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:800;letter-spacing:.08em;opacity:.68">PLUGIN BUILD</span>
  </div>
  <div style="padding:1.15rem;background:var(--v-background-base,rgba(127,127,127,.07));color:inherit">
    <strong style="display:block;font-size:clamp(1.25rem,3vw,1.7rem);line-height:1.15;color:#d82f35">Play-driven</strong>
    <span style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:800;letter-spacing:.08em;opacity:.68">LEVEL THROUGH PLAY</span>
  </div>
</section>

## Progression that starts with play {#progression}

Adapt does not ask players to choose a class before they understand the
server. The things they already do reveal the skill lines that fit them.

<section aria-label="Adapt progression loop" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.8rem">
  <article style="position:relative;padding:1.15rem;border:1px solid rgba(127,127,127,.25);border-radius:14px;background:rgba(127,127,127,.055)">
    <span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#242124;color:#fff;font-weight:900">1</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.03rem">Play normally</h3>
    <p style="margin:0;line-height:1.55;opacity:.76">Mine, sprint, build, fight, brew, explore, tame, or work underwater.</p>
  </article>
  <article style="position:relative;padding:1.15rem;border:1px solid rgba(127,127,127,.25);border-radius:14px;background:rgba(127,127,127,.055)">
    <span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#6e2427;color:#fff;font-weight:900">2</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.03rem">Grow a skill</h3>
    <p style="margin:0;line-height:1.55;opacity:.76">Matching activity awards XP to its own line and raises that skill's level.</p>
  </article>
  <article style="position:relative;padding:1.15rem;border:1px solid rgba(127,127,127,.25);border-radius:14px;background:rgba(127,127,127,.055)">
    <span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#aa272c;color:#fff;font-weight:900">3</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.03rem">Earn knowledge</h3>
    <p style="margin:0;line-height:1.55;opacity:.76">Skill levels pay knowledge that can be spent inside that same skill line.</p>
  </article>
  <article style="position:relative;padding:1.15rem;border:1px solid rgba(216,47,53,.35);border-radius:14px;background:rgba(216,47,53,.08)">
    <span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:9px;background:#d82f35;color:#fff;font-weight:900">4</span>
    <h3 style="margin:.8rem 0 .35rem;font-size:1.03rem">Shape a loadout</h3>
    <p style="margin:0;line-height:1.55;opacity:.8">Spend knowledge and shared ability power on the adaptations you want to carry.</p>
  </article>
</section>

<section aria-label="Knowledge and power explained" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin-top:1rem">
  <article style="padding:clamp(1.2rem,3vw,1.8rem);border-radius:17px;background:linear-gradient(145deg,rgba(216,47,53,.14),rgba(216,47,53,.035));border:1px solid rgba(216,47,53,.3)">
    <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;opacity:.72">KNOWLEDGE</span>
    <h3 style="margin:.4rem 0 .55rem">Can I afford it?</h3>
    <p style="margin:0 0 1rem;line-height:1.6">Knowledge belongs to one skill. Pickaxes knowledge buys Pickaxes adaptations; it cannot be moved to Ranged or Agility.</p>
    <div style="height:8px;border-radius:999px;background:rgba(127,127,127,.16);overflow:hidden"><div style="width:72%;height:100%;border-radius:999px;background:linear-gradient(90deg,#861c21,#ef393e)"></div></div>
    <small style="display:block;margin-top:.45rem;opacity:.68">Earned automatically as that skill levels</small>
  </article>
  <article style="padding:clamp(1.2rem,3vw,1.8rem);border-radius:17px;background:linear-gradient(145deg,rgba(48,46,49,.14),rgba(48,46,49,.035));border:1px solid rgba(127,127,127,.28)">
    <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;opacity:.68">ABILITY POWER</span>
    <h3 style="margin:.4rem 0 .55rem">Can I carry it?</h3>
    <p style="margin:0 0 1rem;line-height:1.6">Power is shared across the account. Every learned adaptation level uses one point, so a build always involves choices.</p>
    <div style="height:8px;border-radius:999px;background:rgba(127,127,127,.16);overflow:hidden"><div style="width:54%;height:100%;border-radius:999px;background:linear-gradient(90deg,#242124,#777176)"></div></div>
    <small style="display:block;margin-top:.45rem;opacity:.68">Default budget: floor(master level × 0.65)</small>
  </article>
</section>

[Understand skills, knowledge, and power →](/adapt/02-concepts)

## Find your play style {#play-styles}

The complete catalog contains twenty-three lines. These groups are starting
points, not classes; a player can progress in any combination.

<section aria-label="Adapt play styles" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:.9rem">
  <article style="padding:1.15rem;border-top:4px solid #42a95c;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">↟</span>
    <h3 style="margin:.6rem 0 .3rem">Move</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Build momentum on land, in the air, and underwater.</p>
    <a href="/adapt/11-skill-agility">Agility</a> · <a href="/adapt/23-skill-kinetics">Kinetics</a> · <a href="/adapt/28-skill-seaborne">Seaborne</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #d82f35;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">⚔</span>
    <h3 style="margin:.6rem 0 .3rem">Fight</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Specialize in weapon rhythm, defense, range, or bare hands.</p>
    <a href="/adapt/30-skill-swords">Swords</a> · <a href="/adapt/26-skill-ranged">Ranged</a> · <a href="/adapt/14-skill-blocking">Blocking</a> · <a href="/adapt/33-skill-unarmed">Unarmed</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #d89a2f;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">◆</span>
    <h3 style="margin:.6rem 0 .3rem">Gather</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Turn mining, chopping, and excavation into specialized toolkits.</p>
    <a href="/adapt/25-skill-pickaxes">Pickaxes</a> · <a href="/adapt/13-skill-axes">Axes</a> · <a href="/adapt/20-skill-excavation">Excavation</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #7a62c8;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">✦</span>
    <h3 style="margin:.6rem 0 .3rem">Create</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Build, craft, brew, and enchant with deeper utility.</p>
    <a href="/adapt/12-skill-architect">Architect</a> · <a href="/adapt/17-skill-crafting">Crafting</a> · <a href="/adapt/15-skill-brewing">Brewing</a> · <a href="/adapt/19-skill-enchanting">Enchanting</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #3198a8;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">⌖</span>
    <h3 style="margin:.6rem 0 .3rem">Explore</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Reward discovery, dimensional travel, and mastery of time.</p>
    <a href="/adapt/18-skill-discovery">Discovery</a> · <a href="/adapt/27-skill-rift">Rift</a> · <a href="/adapt/24-skill-nether">Nether</a> · <a href="/adapt/16-skill-chronos">Chronos</a>
  </article>
  <article style="padding:1.15rem;border-top:4px solid #96577f;border-radius:14px;background:rgba(127,127,127,.06);border-right:1px solid rgba(127,127,127,.22);border-bottom:1px solid rgba(127,127,127,.22);border-left:1px solid rgba(127,127,127,.22)">
    <span aria-hidden="true" style="font-size:1.6rem">♧</span>
    <h3 style="margin:.6rem 0 .3rem">Survive</h3>
    <p style="margin:0 0 .8rem;line-height:1.5;opacity:.75">Grow through farming, companions, hunting, stealth, and adversity.</p>
    <a href="/adapt/21-skill-herbalism">Herbalism</a> · <a href="/adapt/31-skill-taming">Taming</a> · <a href="/adapt/22-skill-hunter">Hunter</a> · <a href="/adapt/29-skill-stealth">Stealth</a> · <a href="/adapt/32-skill-tragoul">TragOul</a>
  </article>
</section>

<p style="text-align:center;margin-top:1.25rem"><a href="/adapt/10-skills-catalog" style="display:inline-block;padding:.72rem 1rem;border-radius:9px;background:#242124;color:#fff;font-weight:800;text-decoration:none">Browse all 23 skills and 312 adaptations →</a></p>

## Designed around the player {#player-experience}

<section aria-label="Adapt player experience" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(255px,1fr));gap:1rem">
  <article style="overflow:hidden;border:1px solid rgba(127,127,127,.25);border-radius:17px;background:rgba(127,127,127,.045)">
    <div style="padding:1.15rem;background:linear-gradient(135deg,#221f22,#441619);color:#fff">
      <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;color:#ff686c">DISCOVER</span>
      <h3 style="margin:.35rem 0 0">Skills reveal themselves</h3>
    </div>
    <p style="padding:1.15rem;margin:0;line-height:1.6">New players see the skills they have actually touched. The menu grows with their play instead of presenting a wall of unfamiliar choices.</p>
  </article>
  <article style="overflow:hidden;border:1px solid rgba(127,127,127,.25);border-radius:17px;background:rgba(127,127,127,.045)">
    <div style="padding:1.15rem;background:linear-gradient(135deg,#221f22,#441619);color:#fff">
      <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;color:#ff686c">CHOOSE</span>
      <h3 style="margin:.35rem 0 0">The menu is the interface</h3>
    </div>
    <p style="padding:1.15rem;margin:0;line-height:1.6">Right-click the side of the configured activator block—a bookshelf by default—to inspect skills, spend knowledge, and manage adaptation levels.</p>
  </article>
  <article style="overflow:hidden;border:1px solid rgba(127,127,127,.25);border-radius:17px;background:rgba(127,127,127,.045)">
    <div style="padding:1.15rem;background:linear-gradient(135deg,#221f22,#441619);color:#fff">
      <span style="font-size:.75rem;font-weight:900;letter-spacing:.09em;color:#ff686c">USE</span>
      <h3 style="margin:.35rem 0 0">Passive where it should be</h3>
    </div>
    <p style="padding:1.15rem;margin:0;line-height:1.6">Many adaptations work immediately. Active abilities use gestures that fit the action: sprint, jump, sneak, block, draw, break, or interact.</p>
  </article>
</section>

## Choose the shortest path {#start-here}

<section aria-label="Adapt documentation paths" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:1rem;align-items:stretch">
  <article style="display:flex;flex-direction:column;padding:1.25rem;border:1px solid rgba(216,47,53,.34);border-radius:17px;background:linear-gradient(145deg,rgba(216,47,53,.12),rgba(216,47,53,.025))">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.72">PLAYERS</span>
    <h3 style="margin:.45rem 0 .5rem">Learn by doing</h3>
    <p style="margin:0 0 1rem;line-height:1.58;opacity:.78">Open the menu, understand the two budgets, then find the exact trigger for an adaptation.</p>
    <ol style="padding-left:1.2rem;line-height:1.75">
      <li><a href="/adapt/03-player-usage">Player usage</a></li>
      <li><a href="/adapt/02-concepts">Progression concepts</a></li>
      <li><a href="/adapt/10-skills-catalog">Skills catalog</a></li>
    </ol>
  </article>
  <article style="display:flex;flex-direction:column;padding:1.25rem;border:1px solid rgba(127,127,127,.27);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.65">SERVER OPERATORS</span>
    <h3 style="margin:.45rem 0 .5rem">Install with intent</h3>
    <p style="margin:0 0 1rem;line-height:1.58;opacity:.78">Install the jar, decide the permission model, tune progression, then verify protection behavior.</p>
    <ol style="padding-left:1.2rem;line-height:1.75">
      <li><a href="/adapt/01-installation-configuration">Installation & configuration</a></li>
      <li><a href="/adapt/04-commands-permissions">Commands & permissions</a></li>
      <li><a href="/adapt/40-operator-runbooks">Operator runbooks</a></li>
    </ol>
  </article>
  <article style="display:flex;flex-direction:column;padding:1.25rem;border:1px solid rgba(127,127,127,.27);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.65">PLUGIN DEVELOPERS</span>
    <h3 style="margin:.45rem 0 .5rem">Integrate without bypassing progression</h3>
    <p style="margin:0 0 1rem;line-height:1.58;opacity:.78">Query skills, deny or price ability use, register protectors, and listen for activation outcomes.</p>
    <ol style="padding-left:1.2rem;line-height:1.75">
      <li><a href="/adapt/41-api-getting-started">API setup</a></li>
      <li><a href="/adapt/43-api-ability-use-policy">Ability-use policy</a></li>
      <li><a href="/adapt/45-api-events">Events</a></li>
    </ol>
  </article>
</section>

## Operator snapshot {#operators}

<section aria-label="Adapt operator requirements" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:1rem">
  <article style="padding:1.25rem;border-radius:17px;background:#191719;color:#fff;box-shadow:inset 4px 0 0 #ef393e">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;color:#ff686c">INSTALL</span>
    <h3 style="margin:.4rem 0 .65rem">One backend plugin jar</h3>
    <p style="margin:0;line-height:1.6;color:rgba(255,255,255,.77)">Place the shaded jar in <code style="color:#fff">plugins/</code> on each Paper, Purpur, or Folia backend. Adapt does not go on the proxy.</p>
    <div style="display:flex;gap:.45rem;flex-wrap:wrap;margin-top:1rem;font-size:.8rem">
      <span style="padding:.3rem .55rem;border-radius:999px;background:rgba(255,255,255,.08)">Bukkit API 26.1</span>
      <span style="padding:.3rem .55rem;border-radius:999px;background:rgba(255,255,255,.08)">Java 25</span>
      <span style="padding:.3rem .55rem;border-radius:999px;background:rgba(255,255,255,.08)">Folia supported</span>
    </div>
  </article>
  <article style="padding:1.25rem;border:1px solid rgba(127,127,127,.26);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.68">CONFIGURE</span>
    <h3 style="margin:.4rem 0 .65rem">Most gameplay settings hot-reload</h3>
    <p style="margin:0;line-height:1.6;opacity:.77">Adapt watches its root, skill, adaptation, and mutation TOML. Invalid edits are rejected while the active configuration keeps running.</p>
    <p style="margin:.8rem 0 0;font-size:.88rem"><strong>Restart for:</strong> SQL, Redis, metrics, update checks, and integration discovery.</p>
  </article>
  <article style="padding:1.25rem;border:1px solid rgba(127,127,127,.26);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.68">AUTHORIZE</span>
    <h3 style="margin:.4rem 0 .65rem">Commands are staff-gated</h3>
    <p style="margin:0;line-height:1.6;opacity:.77"><code>adapt.main</code> gates the entire command tree. Gameplay use nodes default to true, while administrative command nodes default to operators.</p>
    <p style="margin:.8rem 0 0;font-size:.88rem">Normal player progression does not require commands.</p>
  </article>
  <article style="padding:1.25rem;border:1px solid rgba(127,127,127,.26);border-radius:17px;background:rgba(127,127,127,.055)">
    <span style="font-size:.74rem;font-weight:900;letter-spacing:.09em;opacity:.68">EXPAND</span>
    <h3 style="margin:.4rem 0 .65rem">Mutations are separate and opt-in</h3>
    <p style="margin:0;line-height:1.6;opacity:.77">The late-game Mutation system starts disabled. It has two slots, domain requirements, switch cooldowns, and combat locking.</p>
    <p style="margin:.8rem 0 0"><a href="/adapt/34-mutations-overview">Review Mutations before enabling →</a></p>
  </article>
</section>

### Optional integrations

<section aria-label="Adapt integrations" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:.8rem">
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.24);border-radius:13px;background:rgba(127,127,127,.045)">
    <strong style="display:block;margin-bottom:.45rem">Protection</strong>
    <span style="line-height:1.6;opacity:.75">WorldGuard, Factions, ChestProtect, Residence, GriefDefender, GriefPrevention, LockettePro</span>
  </article>
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.24);border-radius:13px;background:rgba(127,127,127,.045)">
    <strong style="display:block;margin-bottom:.45rem">Economy & display</strong>
    <span style="line-height:1.6;opacity:.75">Vault pricing and refunds, plus PlaceholderAPI snapshots for scoreboards and interfaces</span>
  </article>
  <article style="padding:1rem;border:1px solid rgba(127,127,127,.24);border-radius:13px;background:rgba(127,127,127,.045)">
    <strong style="display:block;margin-bottom:.45rem">Gameplay bridges</strong>
    <span style="line-height:1.6;opacity:.75">HiddenOre, Iris, AdvancedChests, and MagicCosmetics alter only the relevant abilities</span>
  </article>
</section>

[Read the integration behavior and failure modes →](/adapt/09-integrations)

<section aria-label="Adapt support links" style="position:relative;overflow:hidden;margin-top:2rem;padding:clamp(1.4rem,4vw,2.4rem);border-radius:20px;background:linear-gradient(120deg,#76191d,#d82f35);color:#fff">
  <div aria-hidden="true" style="position:absolute;right:-55px;top:-80px;width:220px;height:220px;border:38px solid rgba(255,255,255,.07);transform:rotate(25deg)"></div>
  <div style="position:relative;display:flex;justify-content:space-between;align-items:center;gap:1.25rem;flex-wrap:wrap">
    <div style="max-width:650px">
      <span style="font-size:.74rem;font-weight:900;letter-spacing:.1em;color:rgba(255,255,255,.72)">READY FOR THE FULL REFERENCE?</span>
      <h2 style="margin:.4rem 0 .45rem;font-size:clamp(1.6rem,4vw,2.5rem)">Build a progression system players discover naturally.</h2>
      <p style="margin:0;color:rgba(255,255,255,.82)">Start with installation, browse every skill, or join the Volmit community for support.</p>
    </div>
    <div style="display:flex;gap:.65rem;flex-wrap:wrap">
      <a href="/adapt" style="padding:.75rem 1rem;border-radius:9px;background:#fff;color:#72161a;font-weight:800;text-decoration:none">Adapt documentation</a>
      <a href="https://volmitsoftware.com/discord" style="padding:.75rem 1rem;border:1px solid rgba(255,255,255,.4);border-radius:9px;color:#fff;font-weight:800;text-decoration:none">Discord</a>
      <a href="https://github.com/VolmitSoftware/Adapt" style="padding:.75rem 1rem;border:1px solid rgba(255,255,255,.4);border-radius:9px;color:#fff;font-weight:800;text-decoration:none">Source</a>
    </div>
  </div>
</section>

## Implementation notes {#implementation}

### Visual system

| Token | Value | Use |
|---|---|---|
| Adapt red | `#d82f35` | Primary actions, active steps, important numbers |
| Bright red | `#ef393e` | Decorative glow, borders, and large accents |
| Charcoal | `#191719` | Hero, operator cards, grounded contrast |
| Neutral surface | `rgba(127,127,127,.055)` | Theme-tolerant cards |
| Neutral border | `rgba(127,127,127,.25)` | Separation in light and dark themes |
| Large radius | `17px`–`26px` | Branded panels and hero |
{.dense}

The page uses the red and charcoal identity visible in Adapt's logo and store
art. Red is reserved for hierarchy and action; most cards remain neutral so a
long documentation page does not become visually exhausting.

### Responsive strategy

Every major multi-column region uses the same intrinsic grid pattern:

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
gap: 1rem;
```

Cards create as many columns as fit and stack when their minimum width no
longer fits. `clamp()` scales hero spacing and typography without a breakpoint.
Action rows use `flex-wrap`, and code-like values live inside elements that can
wrap instead of forcing horizontal page overflow.

### Optional scoped interaction CSS

Inline styles cannot define `:hover`, `:focus-visible`, or reduced-motion
preferences. The following can be placed in the Wiki.js CSS Override when the
page wrapper uses `class="adapt-showcase"`. The prefix keeps the rules from
changing unrelated documentation.

```css
.adapt-showcase {
  --adapt-red: #d82f35;
}

.adapt-showcase a {
  text-underline-offset: 0.18em;
}

.adapt-showcase a:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
  box-shadow: 0 0 0 6px #72161a;
}

@media (prefers-reduced-motion: no-preference) {
  .adapt-showcase .interactive-card {
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease;
  }

  .adapt-showcase .interactive-card:hover {
    transform: translateY(-3px);
    border-color: rgba(216, 47, 53, 0.55);
    box-shadow: 0 12px 28px rgba(36, 12, 14, 0.14);
  }
}
```

Hover is decorative only. Links, headings, descriptions, and actions remain
visible without it. The fixed dark panels declare their own text colors; all
neutral panels inherit the active Wiki.js theme color.

For additional individual components and alternative page structures, see the
[Wiki.js CSS & Layout Gallery](/wiki-css-layout-examples).
