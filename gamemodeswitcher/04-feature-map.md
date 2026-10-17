---
title: "GamemodeSwitcher: Features and roadmap"
description: "Current features, release checks, and remaining work in priority order"
published: true
date: 2026-10-14T00:00:00.000Z
tags: "gamemodeswitcher, features, roadmap"
editor: markdown
dateCreated: 2026-10-13T00:00:00.000Z
---

GamemodeSwitcher supports Minecraft 26.1–26.3, including patch releases, on Java 25. Startup rejects other versions before downloading libraries. Spigot, Paper, Purpur, Leaf, Folia, and Canvas are target platforms; the verification notes below identify what has been tested.

## Implemented

| Area | Features |
| --- | --- |
| Switching | All four modes through commands, key gestures, and an inventory selector. |
| Gestures | Double offhand swap, sneaking double swap, and three sneak presses to leave Spectator. Destinations and timing are configurable; players rebind keys in Minecraft. |
| Restrictions | Per-mode permissions, disabled worlds, cooldowns, global enablement, and optional empty hands for gestures. Other plugins can cancel mode changes. |
| Personal settings | Saved gesture opt-out and separate chat, action-bar, title, and sound mutes. |
| Feedback | Configurable messages, titles, action bars, and sound. Titles and action bars default on. Feedback never opens the selector automatically. |
| Spectator sessions (P1/P2) | Optional previous-mode restoration and return to the entry location. Sessions survive reconnects/restarts; death or external mode changes end them. |
| Return safety | Unsafe returns are allowed by default. Turning them off checks ground, clearance, and world borders, including for existing sessions. Permissions and disabled worlds still apply. |
| Sound picker (P3) | Five presets, previews, and custom sound keys. Previewing keeps the current gamemode. |
| Configuration | Shared editor for all settings, validated input, stale-save protection, and one prefixed save confirmation. Configuration and installed translations reload automatically. |
| Languages | Built-in English, 17 GitHub catalogs pinned to a verified published revision, personal selection, translation editor, variable comments, and English-only fallback. Some published translations need the updates below. |
| Commands | Director help, status, debug dump, debug version, and a hidden `/gsw version` alias. |
| Operations | Optional bStats with ID 33967, GitHub release notices, a startup splash, and Folia-aware scheduling. |
| Distribution | Shared VolmLib pruning/shrinking, compact release packing, downloaded Gson/TOML/Adventure/bStats, bytecode and packaging checks, and `BUILDS` output. |

Previous-mode restoration and return-to-origin both default off. Allowing unsafe returns does not enable either feature.

## Next in order

The first two entries concern reference-plugin alignment. The remaining entries cover verification and proposed features. P numbers are stable identifiers from the earlier roadmap.

1. **Publish the latest translations.** Downloads now use verified revision `fe6047e14d87e10da3b45b6e196da741496979d8`. Publish the newer local text and advance that pin. The published catalogs lack the update-notification setting's two labels and contain older support text; affected entries use current English. Keep installed files and local edits intact.

2. **Add suite health and metrics integration (R1).** Expose plugin health, heartbeat, and useful switch/session counters through the shared Volmit suite contract. ShapedPortals has this capability; GSW currently has bStats and update notices. This is an optional operator feature.

3. **Complete compatibility testing (P4).** Test current artifacts across the target server families, with fresh library downloads and cached restarts. Add Multiverse cases for gamemode inventories, cancelled switches, reconnects, and Spectator returns. Check inventory, armor, offhand, ender chest, and location. Multiverse's optional last-location handling can affect return destinations. [Configuration](https://mvplugins.org/inventories/reference/configuration-file/) · [Inventory shares](https://mvplugins.org/inventories/reference/shares-list/)

4. **Explain failed switches (P6).** Add a small, bounded history of switch results and an operator view of the player's effective restrictions and Spectator session. Distinguish permission, cooldown, world, and cancellation failures without console spam. Report a cancelling plugin only when it can be identified reliably.

5. **Add optional WorldGuard restrictions (P5).** Let regions allow or deny GSW switching, with defined per-mode rules and a bypass permission. Test overlapping regions and return destinations. WorldGuard's game-mode flag applies a mode on region entry; GSW needs a separate request policy. [Region flags](https://worldguard.enginehub.org/en/latest/regions/flags/) · [Custom flags](https://worldguard.enginehub.org/en/latest/developer/regions/custom-flags/)

6. **Add optional combat-tag restrictions (P8).** Read combat state from a supported plugin and block switches with a clear reason. Define bypass and Spectator-exit behavior, then test missing dependencies and expired tags. [CombatLogX API](https://github.com/SirBlobman/CombatLogX/blob/main/api/README.MD)

7. **Allow staff and console to target another player (P7).** Add a GSW command with separate staff permissions, target restrictions, feedback, and session handling. Run changes on the target player's scheduler and handle disconnects.

8. **Add temporary switching locks (P9).** Let staff lock a player's GSW gestures, commands, and selector with a reason and optional expiry. Define persistence and Spectator-return exceptions. The lock would apply to GSW, not unrelated plugins or vanilla commands.

9. **Add optional native dialogs (P10).** Offer settings forms with checkboxes, choices, text fields, and sliders where supported. Keep inventory menus elsewhere, translate the forms, and check permissions again on submission. Open forms only through explicit navigation. [Paper dialogs](https://docs.papermc.io/paper/dev/dialogs/)

10. **Improve safe-return checks (A3).** When unsafe returns are disabled, accept safe slabs, stairs, and harmless vegetation using collision and hazard checks. The current checks reject some usable locations conservatively.

WorldGuard and combat integrations must check their dependencies' platform support. A Folia-safe GSW scheduler cannot make an incompatible dependency safe. [Paper/Folia development guide](https://docs.papermc.io/paper/dev/folia-support/)

## Verification

The current October 14 artifact passed 95 tests and the build checks below. Older runtime results describe earlier artifacts; they do not establish current gameplay coverage across all target servers.

| Recorded run | Result |
| --- | --- |
| October 14 catalog checks | All 17 catalog URLs at the pinned revision were reachable. Each has 328 message keys; current local catalogs have 330. |
| October 14 runtime attempts | Unrelated missing Multiplexor metadata blocked Paper 26.3 build 181 and Paper 26.1.2 build 74 before startup. No gameplay assertions ran and no viewer opened. The temporary instances were removed. |
| October 14 build | 88 unit tests and 7 packaged-runtime tests passed. Paper/Spigot 26.3 compilation, required/forbidden contents, and bundled/downloaded Java 25 bytecode checks passed. Packed JAR: 797,058 bytes. |
| October 13 build | 85 unit tests and 5 packaged-runtime tests passed, with Paper/Spigot 26.3 compilation and packaging checks. |
| October 13 Paper 26.3 | Java 25.0.1 startup from an empty dependency cache and shutdown passed. Unrelated test-instance metadata blocked the cached restart. |
| October 13 gameplay attempt | The installed harness rejected protocol 26.3 before joining; no gameplay assertions ran. |
| September 20 Paper/Folia 26.1.2 | 12 passing steps covered unsafe-return settings, restrictions, and editor feedback. |
| Earlier feature tests | 18 passing feature/restart steps on Paper 26.1.1 and Spigot/Folia 26.1.2. Folia 26.2 had startup/status/shutdown evidence only. |

Local reports live under `GamemodeSwitcher/build/test-results/`, `build/reports/packaging/`, and `build/qa/`. They may be absent in a fresh checkout. Reusable gameplay scenarios live in `GamemodeSwitcher/qa/`. Check current bot protocol support before the next gameplay run.

## Product boundaries

Keep automatic reload, English-only fallback, and explicit menu opening. Gesture types stay fixed; players rebind their underlying Minecraft keys. Dedicated plugins continue to own inventory separation, vanish, and combat tagging. Minecraft releases beyond 26.3 need an explicit support update and validation.

[Installation and configuration](/gamemodeswitcher/01-installation-configuration) · [Commands and permissions](/gamemodeswitcher/02-commands-permissions) · [Gestures and operations](/gamemodeswitcher/03-gestures-operations)
