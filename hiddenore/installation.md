---
title: "HiddenOre: Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-09-04T00:00:00.000Z
tags: "hiddenore, installation"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

HiddenOre supports Paper, Purpur, and Folia on Java 25.

## Install

1. Put the HiddenOre jar in `plugins/`.
2. Start the server once.
3. Edit `plugins/HiddenOre/config.toml`.
4. Use `/hiddenore reload` after manual edits.

PlaceholderAPI is optional.

## Choose the drop mode

HiddenOre can replace ore drops, add bonus drops, or leave vanilla drops unchanged. Configure each ore in `config.toml`, then test with a normal player before enabling it for everyone.

## Language

Set the locale in `config.toml`. Edit the active language file to override individual messages.

## Troubleshooting

Use `/hiddenore status` to confirm the plugin and current configuration. Invalid reloads keep the previous settings active and report the problem in the console.
