---
title: "BileTools Plugin Integration API"
description: "Cooperative reload, native Paper declarations, and Velocity resource ownership"
published: true
date: 2026-10-07T13:56:34.824Z
tags: "biletools, api"
editor: markdown
dateCreated: 2026-10-07T13:33:23.977Z
---

Plugins can participate in reload preparation and explicitly associate proxy resources with their owner. Use the Bukkit or Velocity contract for the platform your plugin runs on. Plugin code remains responsible for external state and resources the server does not track.

## Bukkit reload participation

Implement VolmLib's `ReloadAware` on the main plugin class. Preparation returns a readiness result, cancellation resumes reversible preparation, and committed cleanup returns a stage that completes when teardown work has finished. Separate classloaders and relocated VolmLib copies are supported through the explicit contract.

BileTools validates the proposed plugin identities and required dependencies before invoking preparation. Missing dependencies, required-dependency cycles, self-dependencies, and identity conflicts refuse the operation before any callback runs.

See [Cooperative plugin reload](/volmlib/api/reloading) for the method signatures, cancellation rules, and Folia scheduling requirements. `/bile inspect <plugin>` reports whether BileTools recognizes participation.

## Native Paper author contract

Experimental native runtime loading is available only on Paper 26.3 build 142, with regionized threading disabled. The server must identify itself as Paper, and its required runtime capabilities must be available. Other builds and forks require a restart for native plugins.

Declare the capabilities your plugin actually supports in `paper-plugin.yml`:

```yaml
biletools:
  runtime-load: true
  runtime-bootstrap: true
  runtime-classpath: true
```

`runtime-load` opts into the native path. A declared `bootstrapper` additionally requires `runtime-bootstrap`, and a declared `loader` requires `runtime-classpath`. Each value must be a YAML boolean; omitted flags are false. Omit the optional flags when your plugin has no corresponding entrypoint.

A runtime bootstrapper and classpath loader must tolerate repeated invocation after server startup. Do not opt in when they modify startup-only registries or depend on the original boot sequence. Native runtime participation permits the Paper `COMMANDS` lifecycle event; other lifecycle registrations require a restart. Command lifecycle callbacks and command ownership are cleaned up with the native plugin.

The flags express the author's contract, not a promise that arbitrary bootstrap effects can be undone. Recovery cannot reverse configuration, database, world, or external-service changes.

## Velocity reload participation

Compile against BileTools without shading its proxy API, and declare a required Velocity dependency on plugin id `biletools`. Implement `com.volmit.bile.velocity.api.ReloadParticipant` on the object registered as your plugin instance.

```java
CompletionStage<ReloadPreparation> prepareReload(UnloadReason reason);
CompletionStage<Void> cancelReload();
CompletionStage<Void> commitReload(UnloadReason reason);
```

Import `ReloadPreparation` from `com.volmit.bile.velocity.api` and `UnloadReason` from `com.volmit.bile.velocity`. Reasons are `HOT_RELOAD`, `HOT_UNLOAD`, and `DEPENDENT`. Return `ReloadPreparation.readyToUnload()` after reversible preparation finishes, or `ReloadPreparation.refuse(reason)` to refuse with an operator-readable reason.

`prepareReload` and `cancelReload` are required; `commitReload` defaults to an already completed stage. Cancel must resume preparation when another group member refuses or a preparation fails. Irreversible cleanup belongs in commit or the scoped shutdown handler. Make shutdown cleanup safe after a completed commit.

Callbacks run on BileTools' lifecycle worker. Return a stage for asynchronous work and complete it only when the work has settled. The proxy's configured operation deadline reports timeout without allowing teardown to race an unfinished callback. A timeout does not interrupt your callback; it must still finish so the worker can leave quarantine.

## Velocity channel ownership

Declare the required `biletools` dependency and register channels after BileTools has initialized:

```java
PluginContainer container = proxy.getPluginManager().getPlugin("biletools").orElseThrow();
BileVelocity bile = (BileVelocity) container.getInstance().orElseThrow();
ChannelIdentifier channel = MinecraftChannelIdentifier.create("example", "updates");
bile.ownedResources().registerChannel(this, channel);
```

`PluginContainer` comes from `com.velocitypowered.api.plugin`, the channel types from `com.velocitypowered.api.proxy.messages`, and `BileVelocity` from `com.volmit.bile.velocity`. Pass your registered plugin instance as the owner.

BileTools releases a channel when its last tracked owner unloads and the registration is still the exact exclusive registration it created. It preserves existing or replaced registrations and channels still claimed by another plugin. Channels registered directly through the proxy without an ownership claim remain the plugin's responsibility.

`/bile inspect <id>` reports exclusive and shared or ambiguous tracked channels, owned commands, scheduled tasks, recovery availability, and lifecycle capabilities. Packet cleanup targets classloader-owned packet classes and suppliers; it does not replace cleanup of external protocol libraries or private hooks.
