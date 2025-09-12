/* eslint-disable @typescript-eslint/no-explicit-any */
import esbuild from "esbuild";

import { IBuiltConfig } from "../Types.js";
import esbuildNodeConfiger from "../esbuildConfigs/node.js";
import esbuildWebConfiger from "../esbuildConfigs/web.js";
import esbuildImportConfiger from "../esbuildConfigs/pure.js";
import { getRunnables } from "../utils.js";

import { PM_WithWebSocket } from "./PM_WithWebSocket.js";

// import golingvuBuild from "./golingvuBuild";

export abstract class PM_WithBuild extends PM_WithWebSocket {
  configs: IBuiltConfig;
  name: string;
  mode: "once" | "dev";
  currentBuildResolve: (() => void) | null = null;
  currentBuildReject: ((error: any) => void) | null = null;

  constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev") {
    super(configs);
    this.configs = configs;
    this.name = name;
    this.mode = mode;
  }

  async startBuildProcesses(): Promise<void> {
    const { nodeEntryPoints, webEntryPoints, pureEntryPoints } = getRunnables(
      this.configs.tests,
      this.name
    );

    console.log(`Starting build processes for ${this.name}...`);
    console.log(`  Node entry points: ${Object.keys(nodeEntryPoints).length}`);
    console.log(`  Web entry points: ${Object.keys(webEntryPoints).length}`);
    console.log(`  Pure entry points: ${Object.keys(pureEntryPoints).length}`);

    // Start all build processes (only node, web, pure)
    await Promise.all([
      this.startBuildProcess(esbuildNodeConfiger, nodeEntryPoints, "node"),
      this.startBuildProcess(esbuildWebConfiger, webEntryPoints, "web"),
      this.startBuildProcess(esbuildImportConfiger, pureEntryPoints, "pure"),
    ]);
  }

  private async startBuildProcess(
    configer: (
      config: IBuiltConfig,
      entryPoints: string[],
      testName: string
    ) => any,
    entryPoints: Record<string, string>,
    runtime: string
  ): Promise<void> {
    const entryPointKeys = Object.keys(entryPoints);
    if (entryPointKeys.length === 0) return;

    // Store reference to 'this' for use in the plugin
    const self = this;

    // Create a custom plugin to track build processes
    const buildProcessTrackerPlugin = {
      name: "build-process-tracker",
      setup(build) {
        build.onStart(() => {
          const processId = `build-${runtime}-${Date.now()}`;
          const command = `esbuild ${runtime} for ${self.name}`;

          // Create a promise that will resolve when the build completes
          const buildPromise = new Promise<void>((resolve, reject) => {
            // Store resolve and reject functions to call them in onEnd
            self.currentBuildResolve = resolve;
            self.currentBuildReject = reject;
          });

          // Add to process manager
          if (self.addPromiseProcess) {
            self.addPromiseProcess(
              processId,
              buildPromise,
              command,
              "build-time",
              self.name,
              runtime as any
            );
          }

          console.log(
            `Starting ${runtime} build for ${entryPointKeys.length} entry points`
          );
          // Broadcast build start event
          if (self.broadcast) {
            self.broadcast({
              type: "buildEvent",
              event: "start",
              runtime,
              timestamp: new Date().toISOString(),
              entryPoints: entryPointKeys.length,
              processId,
            });
          }
        });

        build.onEnd((result) => {
          const event = {
            type: "buildEvent",
            event: result.errors.length > 0 ? "error" : "success",
            runtime,
            timestamp: new Date().toISOString(),
            errors: result.errors.length,
            warnings: result.warnings.length,
          };

          if (result.errors.length > 0) {
            console.error(
              `Build ${runtime} failed with ${result.errors.length} errors`
            );
            if (self.currentBuildReject) {
              self.currentBuildReject(
                new Error(`Build failed with ${result.errors.length} errors`)
              );
            }
          } else {
            console.log(`Build ${runtime} completed successfully`);
            if (self.currentBuildResolve) {
              self.currentBuildResolve();
            }
          }

          // Broadcast build result event
          if (self.broadcast) {
            self.broadcast(event);
          }

          // Clear the current build handlers
          self.currentBuildResolve = null;
          self.currentBuildReject = null;
        });
      },
    };

    // Get the base config and add our tracking plugin
    const baseConfig = configer(this.configs, entryPointKeys, this.name);
    const configWithPlugin = {
      ...baseConfig,
      plugins: [...(baseConfig.plugins || []), buildProcessTrackerPlugin],
    };

    try {
      // Always build first, then watch if in dev mode
      if (this.mode === "dev") {
        const ctx = await esbuild.context(configWithPlugin);
        // Build once and then watch
        await ctx.rebuild();
        await ctx.watch();
      } else {
        // In once mode, just build
        const result = await esbuild.build(configWithPlugin);
        if (result.errors.length === 0) {
          console.log(`Successfully built ${runtime} bundle`);
        }
      }
    } catch (error) {
      console.error(`Failed to build ${runtime}:`, error);
      // Broadcast error event
      if (this.broadcast) {
        this.broadcast({
          type: "buildEvent",
          event: "error",
          runtime,
          timestamp: new Date().toISOString(),
          errors: 1,
          warnings: 0,
          message: error.message,
        });
      }
      throw error;
    }
  }

  abstract onBuildDone(): void;
}
