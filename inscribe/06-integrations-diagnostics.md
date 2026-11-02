---
title: "Inscribe: Integrations and diagnostics"
description: "Economy, debug reports, release notices, and metrics"
published: true
date: 2026-11-02T00:00:00.000Z
tags: "inscribe, integrations, diagnostics"
editor: markdown
dateCreated: 2026-10-08T00:00:00.000Z
---

Experience payments work without another plugin. Money payments, release notices, and metrics use the integrations below.

## Economy

Money payments require Vault and an economy provider. Folia also requires `pricing.allowEconomyOnFolia = true` and a provider that supports region threads.

Refused payments leave items unchanged. Both menus recheck their session after a withdrawal. If a provider closes or replaces the menu, Inscribe requests a refund and keeps the items as they were. Unexpected payment errors and failed refunds log full exception details to the server console. Reconcile the provider balance before the player retries.

## Debug reports

Run `/inscribe debug dump` for a local report, or `/inscribe debug version` for the installed version.

Reports include server and plugin versions, scheduler, hot reload settings, merge and repair-cost options, prices, rule count, active menus, queued actions, language-source state, update settings, and bStats state.

Uploads require both `debug.uploadEnabled = true` (the default) and an explicit `/inscribe debug dump upload=true`. Otherwise the command writes only to `plugins/Inscribe/debug/`. Uploads go to mclo.gs through the shared diagnostic service.

## Release notifications

`general.updateNotifications = true` enables GitHub release checks for [VolmitSoftware/Inscribe](https://github.com/VolmitSoftware/Inscribe). Authorized operators receive the shared Volmit update notice, and `/volmit plugins updates` shows release status and links. Nothing is installed automatically.

The notifier uses `inscribe.update` or the shared `volmit.update` permission. Changing the setting takes effect after a settings-editor edit or a saved file change. A repository with no stable release reports that state and offers no update.

## bStats

Inscribe uses service ID `34581` with standard usage statistics and no custom charts. `metrics.enabled = true` is the default. Changing it through the settings editor or a saved file change starts or stops the local client.

The shared `plugins/bStats/config.yml` opt-out also applies. Restart the server, or toggle Inscribe metrics off and on, after changing that shared file.

## Related pages

- [Configuration *All settings and defaults*](/inscribe/03-configuration)
- [Capabilities *Transfer, pricing, and administration controls*](/inscribe/07-feature-map)
{.links-list}
