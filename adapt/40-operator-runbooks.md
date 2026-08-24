---
title: "Operator Runbooks"
description: "Adapt documentation: Operator Runbooks"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-12T00:00:00.000Z
---
These are the checks worth running before you trust an Adapt install with a real player base. Each section is a short procedure you can follow on a throwaway server. Run them with a disposable player on an isolated Paper or Folia instance. Several steps delete progression on purpose.

A clean startup, working live gameplay, correct cross-server behavior, and a clean shutdown are four separate things. In SQL mode, enablement proves the initial connection and InnoDB schema gate passed; it does not prove the database remains reachable. A later database or profile failure leaves the Minecraft player connected but makes Adapt inert for that player rather than admitting an empty or unfenced profile. A working session says nothing about whether queued player data reached storage on the way down.

Check with a non-op account whose permissions are written out explicitly. Operator status quietly satisfies almost every gate in the plugin. It will hide a missing grant until a real player hits it.

## First install or upgrade

1. Confirm Java 25 and a Paper, Purpur, or Folia server on the Minecraft 26.1 API line, then put the shaded Adapt jar in `plugins/`.
2. For an upgrade, stop the server first and back up `plugins/Adapt/` plus the SQL database if you use one.
3. Start once. Confirm the plugin enables, `plugins/Adapt/adapt.toml` and the skill and adaptation TOML files are generated and loaded, and no version binding error appears.
4. Read the rest of the boot log. Check the optional integration lines and config summary. Treat
   `plugins/Adapt/data/players/<uuid>.json.pending-sql` as fenced SQL recovery
   and `<uuid>.json.pending-delete` as local-mode delete recovery; neither is a
   disposable temporary file.
5. Join in Survival and right-click the side of a bookshelf with neither hand holding a placeable block. The skills menu should open. Sneaking, clicking the top or bottom face, or holding a placeable block in either hand should do nothing.
6. Stop cleanly. Confirm no persistence flush, Redis close, SQL close, or scheduler error on the way down.

Normal console output is limited to startup and shutdown state, administrative changes, hotload results, and actionable warnings or failures. Routine profile activation and per-action gameplay diagnostics appear only while `verbose` is enabled; ordinary joins and successful ability use are quiet by default.

## Progression and permissions

1. Earn XP in one skill and check its XP, level, and knowledge against the formulas in [02 - Concepts](/adapt/02-concepts) and [05 - Configuration Math](/adapt/05-configuration-math).
2. Learn and then unlearn a cheap adaptation. Watch the prerequisite, knowledge cost, power cost, world blacklist, the separate flat `adapt.use.<skillNameWithoutHyphens>` and `adapt.use.<adaptationNameWithoutHyphens>` grants, refund, and recipe book behavior on both halves. For example, Air Dash uses `adapt.use.agilityairdash`, not a nested skill-and-adaptation node.
3. Run `/adapt help`, `/adapt help 2`, and `/adapt ?`. Only commands that account can actually run should be listed.
4. As an administrator holding `adapt.gui`, run `/adapt gui target=skill:<name> force=true` and `/adapt gui target=adaptation:<id> force=true`. The menu should open, and `force` should bypass only the target's use permission. An adaptation disabled in config stays closed either way.
5. Use `/adapt clear` on a disposable profile only. Use `/adapt reset` only after backing that profile up. It needs `adapt.clear` and a second run to confirm.
6. Reset an offline player as well as an online one. An online reset initiated on the hosting backend swaps the live data so the player keeps playing; the SQL path rotates and adopts its new fence before activating the empty profile. A local-mode offline reset deletes the JSON behind the purge guard. SQL purge deletes `ADAPT_DATA` while atomically retaining a rotated fence tombstone, and SQL reset writes default JSON. A reset notice received by another backend retires only that backend's older Adapt runtime instead of sharing the new ownership credential: its Minecraft player remains connected with Adapt inert and must reconnect.

## Items, recipes, and brewing

1. Give an experience orb and a knowledge orb, throw each one, and confirm the encoded skill and amount are applied exactly once.
2. Learn Crafting: Backpacks, craft the eight-leather and center-chest recipe, and exercise both slot mode and bundle mode at the configured capacity.
3. Confirm that only an empty backpack cycles mode when crafted alone. Confirm
   that a backpack cannot go directly inside another. Confirm that configured
   indirect nesting is refused. Confirm that a deposit past the byte ceiling is
   refused. Confirm that contents survive a close, a quit and rejoin, a restart,
   the death and drop policy, and a forced inventory interruption.
4. Learn one crafting adaptation and confirm its recipe is discovered in the recipe book, then unlearn it and confirm the discovery is removed.
5. Brew one weak and one strong custom potion end to end. Check the exact base
   potion, exact ingredient, enough fuel, and the owning adaptation. Check the
   full 320-tick timer, ingredient and fuel consumption, and all three bottle
   slots converting. Change an input mid-brew and confirm the task cancels.
6. Have another plugin cancel an ingredient-slot click, then separately walk away from the stand before Adapt's one-tick-later handling runs. Neither case may move the cursor item or start a brew.
7. Change `value.baseValue` or a `value.valueMultipliers` entry, hotload the core config, and confirm a consuming adaptation uses the rebuilt value instead of the old `value-cache.json` data.
8. On Folia only: change an adaptation's enabled flag while players are online and confirm Adapt logs that it is deferring recipe registration. Empty the server and confirm registration then completes.

## Protection and integrations

1. Start with no optional plugins installed at all and confirm Adapt still enables.
2. For each installed protector, test a denied location through a normal adaptation and through the bookshelf activator. Toggle its `protectorSupport.*` key, hotload the core config, and confirm it joins or leaves the default-active set.
3. Test an adaptation-level `enabledProtectors` or `disabledProtectors` override by exact protector name. A protector whose plugin is absent must not be enabled by config alone.
4. With WorldGuard, deny `use-adaptations` and `adapt-xp` separately. The first should gate ability use and the second should zero location XP.
5. If installed, test the exact surfaces listed in
   [09 - Integrations](/adapt/09-integrations). Cover PlaceholderAPI keys and
   offline expiry, Vault charge and refund failure, and HiddenOre block rewards.
   Also cover Iris tree-feller routing, AdvancedChests with Rift Access, and
   MagicCosmetics armor slots.
6. In an event-driven claim denial such as GriefPrevention, confirm a Reliquary Portkey can neither bind nor remotely open the container. Repeat on a double chest with only one half denied. Neither half may open. Every held chunk ticket must release when the attempt ends or the view closes.
7. Link two Rift Conduit containers. Change protection once before a deferred bind stage and once before a flow reaches its partner. A denied bind must roll back and denied-flow items must return to the source.
8. Deny pickup events for Drop-To-Inventory, Fetch Shot, Item Snatch, Taming Fetch, Void Magnet, and Compost Cascade. The original item entity must survive with no success XP and no statistic.
9. Deny a ray-targeted Time In A Bottle or Compost Cascade use, and a passive Accelerate crop or station target. The target block, station progress, stored time, and cooldown must all be untouched.
10. Deny one secondary Axe Chop and one secondary Pickaxe Veinminer block. Axe
    Chop must apply no wear or cooldown for the refused log. The denied
    Veinminer block must not count toward its success statistic or its
    aggregate effect.

## Config and localization

1. Make one reversible edit in each hotloaded family: `adapt.toml`, a skill file, an adaptation file, `models.toml`, `mutations.toml`, and a locale override. Confirm the behavior changes without a restart, and that malformed TOML is rejected with an error rather than corrupting the file already in memory.
2. Change a restart-bound setting (SQL, Redis, metrics, or plugin load order) and confirm nothing claims it reloaded live. Restart before you accept it. Ability API policy settings are core-hotloaded and should change without a restart.
3. On an upgrade from an older nested or JSON config layout, retain a backup, let Adapt generate the current root TOML files, and transfer the settings you still want by hand. Confirm only `plugins/Adapt/adapt.toml`, `models.toml`, `mutations.toml`, `skills/*.toml`, and `adaptations/*.toml` affect runtime; there is no migration command.
4. Override one localization key, delete the override, and confirm the bundled string comes back. Confirm an override file larger than 2 MiB is rejected.
5. Change a GUI entry and verify the slot, item, name, and lore, while confirming that gameplay costs and gates did not move with it.

## SQL persistence and recovery

1. Test local JSON first. Earn progression, quit, stop cleanly, restart, and confirm the same state comes back.
2. Enable SQL against a disposable database. Confirm `ADAPT_DATA` and `ADAPT_DATA_FENCE` both exist and report `ENGINE=InnoDB`, then complete a player round trip. To test the hard gate, convert a disposable table to MyISAM and confirm Adapt refuses to enable with the exact recovery commands. Back up the schema, run `ALTER TABLE ADAPT_DATA ENGINE=InnoDB;` and `ALTER TABLE ADAPT_DATA_FENCE ENGINE=InnoDB;`, and restart.
3. Interrupt SQL during a save and let the bounded retries fail. Confirm `plugins/Adapt/data/players/<uuid>.json.pending-sql` appears without requiring a clean stop and begins with `ADAPT_SQL_RECOVERY_V1`. Restore SQL, log in that player, and confirm only the snapshot matching the claimed predecessor fence is adopted and the file is removed after commit.
4. Put an old raw-JSON `.pending-sql` file beside a backed-up disposable profile. Confirm the Minecraft login succeeds, the file is preserved, and Adapt stays unavailable: `%adapt_available%` is `false`, per-player values are `---`, and XP, commands, skills, adaptations, mutations, brewing, and custom orbs do nothing. Stop every backend, compare the SQL row, backup, and recovery payload, choose the authoritative profile, delete only the incompatible file after reconciliation, then restart and reconnect. Do not rename raw JSON into the new envelope.
5. In local JSON mode, corrupt a backed-up disposable player's JSON. Confirm the Minecraft login succeeds, the corrupt file remains untouched, no empty replacement is saved, and Adapt stays unavailable through the bounded online retries. Restore the authoritative file and reconnect.
6. Reset an online SQL profile on its hosting backend and purge an offline SQL profile. Confirm each operation rotates the owner token and advances the epoch in one transaction, sends a Redis reset notice when enabled, and does not create `.pending-delete`. Confirm the hosting backend adopts the new fence and replaces the online profile live. Attempt a write with the retired token and confirm SQL rejects it. Separately deliver the notice to an older runtime on another backend and confirm that Minecraft session remains connected with Adapt inactive until reconnect.
7. In local mode, interrupt a reset or purge and confirm `.pending-delete` suppresses stale JSON. If a fresh save follows, confirm the revisioned delete-then-save journal restores it after restart. Malformed journals must be preserved and load-guarded.
8. Confirm both a local-mode online reset and a hosting-backend SQL online reset replace the active profile in place, and only exercise resets against backed-up disposable records.

## Mutations

1. Enable mutations and one profile at a time. Restart when you change deployment-bound state, then use `/adapt mutations menu` and the admin discovery and equip commands.
2. Verify discovery chance, unlock requirements, slot count, consent mode, and
   allowed worlds. Verify combat lock, cooldowns, resource costs, and
   profile-specific settings. Compare them against
   [34 - Mutations Overview](/adapt/34-mutations-overview) and
   [35 - Mutations Catalog](/adapt/35-mutations-catalog).
3. Test `EXPLICIT`, `PARTY`, `FRIEND`, and `DISABLED` consent with separate players. `FRIEND` currently has no friendship provider behind it, so it accepts nobody.
4. Confirm `%adapt_mutation.enabled%`, `%adapt_mutation.slot-1%`, `%adapt_mutation.slot-1-id%`, and a type key such as `%adapt_mutation.gale-lung.state%`.

## Cross-server handoff

1. Put identical SQL and Redis settings on two disposable backends as described in [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server). Remove any obsolete Adapt companion jar from the proxy.
2. Verify SQL ownership startup and each backend's `Adapt:data:v2` Redis subscription as separate facts.
3. Change progression and mutation equipment on backend A, switch normally, connect to backend B, and compare the whole profile.
4. With Redis still enabled, make transfer staging unavailable and confirm the destination Minecraft login remains connected while Adapt fails closed, publishes no player snapshot, and makes only its bounded online retries. Then disable Redis on both backends, restart them, reconnect, and confirm switching uses committed SQL plus matching fenced recovery only.
5. Drop every request-scoped pub/sub reply after a source stage succeeds. Confirm the destination recovers the exact predecessor from the 60-second staged key, adopts it into SQL, and acknowledges the key with `DEL`.

## Folia and lifecycle

1. On Folia, open and navigate menus. Use movement, combat, and block abilities
   in more than one region. Use custom brewing and backpack inventories.
   Teleport, die and respawn, and quit and rejoin.
2. Read the whole console afterwards for async world, entity, or inventory access, region ownership complaints, rejected scheduler tasks, listener failures, and stack traces.
3. Stop the server with recently changed player data and an active optional integration. Confirm the persistence queue flushes inside its 30 second allowance and every client and service closes cleanly.

## Reference

### Fixed values these checks depend on

| Item | Value |
|---|---|
| Custom brew duration | 320 ticks for every registered recipe |
| Locale override size limit | 2 MiB |
| Shutdown flush allowance | 30 s |
| SQL save batch | Up to 128 profiles after a 25 ms gather window |
| SQL claim batch | Up to 128 profiles after a 25 ms gather window |
| Online profile recovery | Three retries after 2 s, 4 s, and 8 s, each plus deterministic 0-19 tick jitter; four total claim cycles |
| Redis predecessor wait | 250 ms |
| Redis transfer requests | Up to 3 identical requests in the predecessor window |
| Redis staged transfer TTL | 60 s |
| Redis snapshot JSON limit | 16,777,215 UTF-8 bytes |
| JDBC connect, socket, and validation timeout cap | 5 seconds each |
| Default activator | `BOOKSHELF`, side faces only, both hands free of placeable blocks, not sneaking |
| `/adapt reset` | `adapt.clear`, confirmed by running it twice |

## See also

- [01 - Installation & Configuration](/adapt/01-installation-configuration)
- [04 - Commands & Permissions](/adapt/04-commands-permissions)
- [08 - Protection & Region Policy](/adapt/08-protection-region-policy)
- [34 - Mutations Overview](/adapt/34-mutations-overview)
- [39 - Cross-Server SQL & Redis](/adapt/39-velocity-cross-server)
