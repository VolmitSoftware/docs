---
title: "Director commands"
description: "Hidden command shortcuts, themed version output, and component-safe menu delivery"
published: true
date: 2026-10-03T18:00:00.000Z
tags: "volmlib, api, commands"
editor: markdown
dateCreated: 2026-09-11T01:43:00.510Z
---

Director builds executable command trees from `@Director` annotations. Help and tab completion use the same command metadata.

## Parameter defaults

`@Param` without `defaultValue` declares a required argument. Set `defaultValue` explicitly to make the argument optional; Director parses that value with the parameter's normal type handler when the caller omits it. An explicit `defaultValue = ""` is an optional empty string, while numeric and boolean defaults use their usual textual forms.

```java
@Director("open")
public void open(
    @Param(name = "name") String name,
    @Param(name = "args", defaultValue = "") String args,
    @Param(name = "page", defaultValue = "1") int page
) {
    openDocument(name, args, page);
}
```

`open showcase` invokes this method with `name = "showcase"`, `args = ""`, and `page = 1`. Callers can supply optional values by name, for example `open showcase args=featured page=2`. `Param.NO_DEFAULT` is reserved for annotation metadata that represents an absent default; do not use it as an authored parameter value.

## Hidden commands

`@Director(hidden = true)` leaves a command or group executable but omits it from player help, console help, help-page counts, visual command trees, and command-name suggestions. The default is `false`. Hidden commands retain their normal permission and sender checks.

A plugin can expose `debug version` in its debug group and add a hidden root `version` method that invokes the same action. Aliases on that hidden method remain executable.

## Version output

`DirectorMiniMenu.version(pluginName, version, theme)` returns a single MiniMessage string containing `PluginName v<version>`. It escapes the supplied text and applies the theme's `primaryLeft` and `primaryRight` gradient, matching the Director help title without borders, a prefix, or blank lines.

Pass the installed plugin descriptor's name and version and the same resolved `DirectorMiniMenu.Theme` used by the plugin's help menu. Deserialize the returned MiniMessage into a component and send it with `ComponentMessenger.send(...)` to preserve rich formatting on supported Bukkit platforms.

## Menu delivery

`DirectorMiniMenu.render(...)` and `renderContent(...)` produce MiniMessage. Menu delivery deserializes that completed markup directly, preserving literal ampersands, RGB-like brackets, escaped tags, hover text, and clipboard or URL payloads. Supply content entries as MiniMessage; `ComponentText.literal(value).miniMessage()` safely includes external text in an entry.
