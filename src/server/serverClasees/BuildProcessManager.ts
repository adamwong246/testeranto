/* eslint-disable @typescript-eslint/no-explicit-any */

import esbuild from "esbuild";
import { IBuiltConfig } from "../../lib";

export class BuildProcessManager {
  private currentBuildResolve: (() => void) | null = null;
  private currentBuildReject: ((error: any) => void) | null = null;

  constructor(
    private projectName: string,
    private configs: IBuiltConfig,
    private mode: string,
    private webSocketBroadcastMessage?: (message: any) => void,
    private addPromiseProcess?: (
      processId: string,
      promise: Promise<any>,
      command: string,
      category: string,
      projectName: string,
      runtime: string
    ) => void
  ) {}

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
    const baseConfig = configer(
      this.configs,
      entryPointKeys,
      this.projectName,
      this.configs.buildDir
    );
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

        // Note: For web runtime, we don't serve files via esbuild
        // Server_TCP handles serving web test files

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

  // Add monitoring support for build processes
  addBuildLogEntry = (
    processId: string,
    message: string,
    level: "info" | "warn" | "error" = "info"
  ) => {
    // This would be called from build plugins to add log entries
    // For now, we'll just log to console
    const prefix = `[${new Date().toISOString()}] [build:${level}]`;
    console.log(`${prefix} ${message}`);

    // Broadcast to monitoring if available
    if (this.webSocketBroadcastMessage) {
      this.webSocketBroadcastMessage({
        type: "buildLog",
        processId,
        level,
        message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}
