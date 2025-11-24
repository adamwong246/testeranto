/* eslint-disable @typescript-eslint/no-explicit-any */
import esbuild from "esbuild";
import { IBuiltConfig } from "../../Types.js";
import { PM_2_WithTCP } from "./PM_2_WithTCP.js";

export abstract class PM_WithBuild extends PM_2_WithTCP {
  currentBuildResolve: (() => void) | null = null;
  currentBuildReject: ((error: any) => void) | null = null;

  async startBuildProcess(
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
          const command = `esbuild ${runtime} for ${self.projectName}`;

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
              self.projectName,
              runtime as any
            );
          }

          console.log(
            `Starting ${runtime} build for ${entryPointKeys.length} entry points`
          );
          // Broadcast build start event
          if (self.webSocketBroadcastMessage) {
            self.webSocketBroadcastMessage({
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
          if (self.webSocketBroadcastMessage) {
            self.webSocketBroadcastMessage(event);
          }

          // Clear the current build handlers
          self.currentBuildResolve = null;
          self.currentBuildReject = null;
        });
      },
    };

    // Get the base config and add our tracking plugin
    const baseConfig = configer(this.configs, entryPointKeys, this.projectName);
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
      if (this.webSocketBroadcastMessage) {
        this.webSocketBroadcastMessage({
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
}
