---
title: "API - Commands"
description: "Adding subcommands below /adapt: AdaptCommand, typed arguments, completion, permissions, threading and removal"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

An addon adds commands below `/adapt` with `ContentRegistrar.command(AdaptCommand)`. A command uses the same words on Paper, Purpur, Folia, Spigot, Fabric, Forge and NeoForge, appears in Adapt's help pages, completes with tab, and leaves with its addon. Commands live below `/adapt` only; the API does not add root commands such as `/geology`.

## The example command

`GeologyAddon` registers one command group, built by `GeologyConsole`:

```java
GeologyConsole console = new GeologyConsole(this::handle, this::notes);
registrar.listener(console);
registrar.command(console.command());
```

The console gets the addon's own handle, kept from `install`, for its `uninstall` subcommand, and the field notes section the last `register` declared, for its `notes` subcommand.

`/adapt geology` holds one subcommand per action, all for operators. From `GeologyConsole.java`, three of its arguments and three of its subcommands:

```java
static final String PERMISSION = "example.geology.admin";

private static final CommandArgument<Id> ADAPTATION =
    CommandArgument.required("adaptation", ArgumentTypes.adaptation(), Text.key(key("argument.adaptation")));
private static final CommandArgument<Integer> LEVEL =
    CommandArgument.required("level", ArgumentTypes.integer(1, 100), Text.key(key("argument.level")));
private static final CommandArgument<Boolean> FORCE =
    CommandArgument.optional("force", ArgumentTypes.bool(), Text.key(key("argument.force")));

public AdaptCommand command() {
  return AdaptCommand.named("geology")
      .help(Text.key(key("geology")))
      .permission(PERMISSION)
      .then(action("status", (PlayerRef player, PlayerProfile profile, CommandInvocation invocation) ->
          status(player, profile, profile.skill(GeologyAddon.GEOLOGY))).build())
      .then(action("learn", (PlayerRef player, PlayerProfile profile, CommandInvocation invocation) -> {
        LearnOptions options = invocation.find(FORCE).orElse(false) ? LearnOptions.forced() : LearnOptions.paying();
        LearnResult result = profile.learn(invocation.get(ADAPTATION), invocation.get(LEVEL), options);
        return "status=" + result.status() + " from=" + result.fromLevel() + " to=" + result.toLevel()
            + " knowledge=" + result.knowledge();
      }).argument(ADAPTATION).argument(LEVEL).argument(FORCE).build())
      .then(AdaptCommand.named("uninstall")
          .help(Text.key(key("uninstall")))
          .executes((CommandInvocation invocation) -> handle.get().ifPresent(AddonHandle::uninstall))
          .build())
      .build();
}
```

Each player action is built by one helper, which moves to the player's thread before it touches the profile:

```java
private static AdaptCommand.Builder action(String name, Reply reply) {
  return AdaptCommand.named(name)
      .help(Text.key(key(name)))
      .playerOnly()
      .executes((CommandInvocation invocation) -> {
        PlayerRef player = invocation.caller().player().orElseThrow();
        AdaptApi.scheduler().runEntity(player, () -> invocation.caller().send(Text.literal("GEOLOGY " + name + " "
            + reply.answer(player, AdaptApi.players().require(player), invocation))));
      });
}

private static String key(String path) {
  return GeologyAddon.NAMESPACE + ".command." + path;
}
```

`Reply` is the example's own functional interface for an action that answers with one line. A player runs `/adapt geology learn example:geology/prospect 3`, and `/adapt geology` alone shows the group's help page.

## Commands and groups

An `AdaptCommand` is either a group of further commands, built with `then`, or a command that runs, built with `executes`. `AdaptCommand.named(name)` starts one.

| Builder | Declares |
|---|---|
| `named(name)` | The word. Lower case `[a-z0-9][a-z0-9_-]*` |
| `alias(word)` | Another word for the same command, under the same rules |
| `help(Text)` | Required. The line in the help menu, usually a key in the addon's messages |
| `permission(node)` | A permission the caller needs for this command and everything below it, starting with `<namespace>.`. Operators have it by default |
| `permission(node, PermissionDefault)` | The same with another default, such as `PermissionDefault.TRUE` for every player |
| `playerOnly()` | Only a player may run it; the console is told so |
| `argument(CommandArgument)` | The next argument of a command that runs |
| `then(AdaptCommand)` | A command of this group |
| `executes(CommandAction)` | What the command does when it runs |

`build()` throws `IllegalStateException` when the help text is missing, when a command both runs and has subcommands or does neither, when a group takes arguments, and when two subcommands share a word.

`/adapt <group>` and `/adapt <group> help` show a group's help page, listing each subcommand with its help line and arguments. Words are matched the way Adapt's own commands are, so a close misspelling still finds its command.

## Arguments

`CommandArgument.required(name, type, help)` and `CommandArgument.optional(name, type, help)` declare one typed argument. Declare each once as a constant and read its value in the action:

| `CommandInvocation` | Gives |
|---|---|
| `get(argument)` | The value of a required argument, or of an optional one that was given. Throws `IllegalStateException` for an optional one that was left out |
| `find(argument)` | The value, empty when an optional argument was left out |
| `caller()` | Who ran the command |
| `path()` | The words that led here, such as `[adapt, geology, learn]` |

The name matches `[a-z][a-z0-9_-]*`. Optional arguments come after every required one, and an argument that takes the rest of the line comes last; `argument` throws `IllegalArgumentException` otherwise, and for two arguments with the same name.

A caller gives arguments in order, or by name as `name=value`, or both. Named values are matched first and the remaining words fill the other arguments in order, so these run the same:

```none
/adapt geology learn example:geology/prospect 3 true
/adapt geology learn level=3 adaptation=example:geology/prospect force=true
```

A value that does not parse, a missing required argument, or a word left over after the last argument stops the command before it runs and tells the caller which argument was wrong. `/adapt geology learn example:geology/prospect 0` answers that `0` cannot be converted into an Integer for `level`.

## Argument types

`ArgumentTypes` has the types Adapt's own commands use:

| Type | Value |
|---|---|
| `word()` | One word, as typed |
| `text()` | Every remaining word, joined by single spaces. Last argument only |
| `integer(min, max)` | A whole number from `min` to `max`, both included |
| `decimal(min, max)` | A finite number from `min` to `max` |
| `bool()` | `true` or `false`, in any case |
| `choice(first, more...)` | One of fixed words, in any case; the value is the word as declared |
| `enumeration(Type.class)` | A constant of an enum, typed in any case and offered in lower case |
| `onlinePlayer()` | An online player by name |
| `skill()` | An installed skill id, built-in skills included; a bare path is in `adapt` |
| `adaptation()` | An installed adaptation id, built-in ones included; a bare id is in `adapt` |

For anything else implement `ArgumentType<T>`: `valueType()` names the value's class in the help menu, `parse(caller, text)` returns the value or empty when the text is not one, `suggest(caller, typed)` returns the values to offer, and `consumesRest()` returns true for a type that takes every remaining word.

## Completion

Tab completion offers the subcommand words of a group, then the values of the next argument from its type's `suggest`, keeping those that start with what the caller typed. After `name=` it offers that argument's values. A caller without a command's permission is offered no values for its arguments.

## Permissions

A command's permission covers the command and everything below it, and the console has every permission. A caller without it is told which permission is missing. Every node a command or one of its subcommands names must start with the addon's namespace and a dot, `<namespace>.`; a node outside it rejects the addon, and the reason names the command and the node. Adapt registers every node a command or one of its subcommands names, with its default, when the addon is applied, and unregisters it when the addon is removed. The example's `example.geology.admin` defaults to operators.

`CommandCaller` gives `name()`, `player()` (empty for the console), `hasPermission(node)` for finer checks inside an action, and `send(Text)`, which sends a message in the caller's language and is safe from any thread.

## Threading

An action runs on the server's global thread, as Adapt's own commands do. On Folia that is the global region thread, which owns no player, so work on a player goes through `AdaptApi.scheduler().runEntity`, as the example's `action` helper does. An exception thrown from an action is reported to the caller and logged, and never reaches the platform.

## Words and removal

A command's words must not be taken by Adapt's own top-level commands, such as `help`, or by another addon's commands. A clash rejects the addon, and the reason names the word and the addon that holds it.

Commands follow their addon. `handle.uninstall()`, a refresh and a core stop remove them, with their permission nodes; a refresh and the next core start add them back from `register`. Every platform routes `/adapt <words>` to the same place, so a command an addon adds on a Bukkit server answers the same way on Fabric, Forge and NeoForge.
