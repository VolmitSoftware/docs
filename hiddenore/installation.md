---
title: "HiddenOre: Installation"
description: "Requirements and first-run setup"
published: true
date: 2026-09-10T03:05:07.654Z
tags: "hiddenore, installation"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

HiddenOre supports Paper, Purpur, and Folia on Java 25.

## Install

1. Put the HiddenOre jar in `plugins/`.
2. Start the server once.
3. Edit `plugins/HiddenOre/hiddenore.toml`.
4. Save changes and check the server console for validation errors.

PlaceholderAPI is optional.

## Choose the drop mode

HiddenOre can replace ore drops, add bonus drops, or leave vanilla drops unchanged. Configure each ore in `hiddenore.toml`, then test with a normal player before enabling it for everyone.

## Language

Set `language` in `hiddenore.toml` to select the server default. Edit `plugins/HiddenOre/languages/<locale>.toml` to customize individual messages. Saved edits apply automatically.

## Troubleshooting

Check the server console for configuration errors. Invalid configuration updates keep the previous settings active.
