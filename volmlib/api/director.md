---
title: "Director commands"
description: "Hidden command shortcuts, themed version output, component-safe menu delivery, and chat-line menu pages"
published: true
date: 2026-10-25T00:00:00.000Z
tags: "volmlib, api, commands"
editor: markdown
dateCreated: 2026-09-11T01:43:00.510Z
---

Director builds executable command trees from `@Director` annotations. Help and tab completion use the same command metadata.

## UUID parameters

Director parses `java.util.UUID` parameters through its standard registry. Required UUID arguments accept positional or keyed input, and optional UUID arguments use a keyed value or their declared default. Values use the full 36-character UUID form; hexadecimal letters may be uppercase or lowercase, and surrounding whitespace is ignored. Invalid or abbreviated UUIDs produce normal argument feedback without invoking the command.

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

`DirectorMiniMenu.deliver(sender, page, theme, resolver, permitted)` accepts a node predicate for permission-filtered help. It filters before paginating player entries and clamps the requested page to the remaining pages. Console delivery lists every permitted entry without pagination; the caller must still check permission to open the requested command group and execute its commands.

## Menu pages

Each player page of help or a content menu fits in the 20 chat lines visible with chat open at default settings (`DirectorMiniMenu.CHAT_LINE_COUNT`). The title banner, the Back line, and the page bar take one line each, and each entry takes the number of lines it occupies after chat wraps it at the default 320-pixel chat width. A page holds as many entries as fit, up to its page size. The page bar shortens its rule to fit its previous and next buttons, so it stays on one line. Players with a shorter chat height, a narrower chat width, or a larger chat scale see fewer lines.

| Item | Contract |
|---|---|
| `DirectorHelpPage(node, entries, pageIndex, pageSize)` | All visible entries of a command group, the zero-based requested page, and the most entries a page may hold. `resolveHelp(...)` uses `MAX_ENTRIES_PER_PAGE` (18) |
| `DirectorHelpPage.withEntries(entries)` | The same request with a filtered entry list |
| `helpWindow(page, theme, resolver)` | The `ContentPage` that `render(...)` shows for a help request |
| `ContentMenu.page()` | The `ContentPage` that `renderContent(...)` shows, counting the Back line when `parentCommand` is set |
| `paginate(entries, requestedPage, pageSize, reservedLines)` | Pages MiniMessage entries into the chat lines left after `reservedLines`. An entry taller than that space gets a page of its own |
| `paginate(itemCount, requestedPage, pageSize)` | Pages by entry count only, for callers that render a fixed number of single-line rows |
| `chatRows(line)` | The chat lines one MiniMessage line occupies. A blank line occupies none |

Requested pages clamp to the first and last page. The measurement uses the default Minecraft font widths and counts each character outside ASCII as 9 pixels wide.
