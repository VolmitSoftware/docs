---
title: "Director commands"
description: "Hidden command shortcuts and themed plugin version output"
published: true
date: 2026-09-11T01:43:00.510Z
tags: "volmlib, api, commands"
editor: markdown
dateCreated: 2026-09-11T01:43:00.510Z
---

Director builds executable command trees from `@Director` annotations. Help and tab completion use the same command metadata.

## Hidden commands

`@Director(hidden = true)` leaves a command or group executable but omits it from player help, console help, help-page counts, visual command trees, and command-name suggestions. The default is `false`. Hidden commands retain their normal permission and sender checks.

A plugin can expose `debug version` in its debug group and add a hidden root `version` method that invokes the same action. Aliases on that hidden method remain executable.

## Version output

`DirectorMiniMenu.version(pluginName, version, theme)` returns a single MiniMessage string containing `PluginName v<version>`. It escapes the supplied text and applies the theme's `primaryLeft` and `primaryRight` gradient, matching the Director help title without borders, a prefix, or blank lines.

Pass the installed plugin descriptor's name and version and the same resolved `DirectorMiniMenu.Theme` used by the plugin's help menu. Send the result with `ComponentMessenger.sendMarkup(sender, markup)` to preserve rich formatting on supported Bukkit platforms.
