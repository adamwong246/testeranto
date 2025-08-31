"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_WithBuild = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const esbuild_1 = __importDefault(require("esbuild"));
const node_js_1 = __importDefault(require("../esbuildConfigs/node.js"));
const web_js_1 = __importDefault(require("../esbuildConfigs/web.js"));
const pure_js_1 = __importDefault(require("../esbuildConfigs/pure.js"));
const utils_js_1 = require("../utils.js");
const PM_WithWebSocket_js_1 = require("./PM_WithWebSocket.js");
class PM_WithBuild extends PM_WithWebSocket_js_1.PM_WithWebSocket {
    constructor(configs, name, mode) {
        super(configs);
        this.currentBuildResolve = null;
        this.currentBuildReject = null;
        this.configs = configs;
        this.name = name;
        this.mode = mode;
    }
    async startBuildProcesses() {
        const { nodeEntryPoints, webEntryPoints, pureEntryPoints } = (0, utils_js_1.getRunnables)(this.configs.tests, this.name);
        console.log(`Starting build processes for ${this.name}...`);
        console.log(`  Node entry points: ${Object.keys(nodeEntryPoints).length}`);
        console.log(`  Web entry points: ${Object.keys(webEntryPoints).length}`);
        console.log(`  Pure entry points: ${Object.keys(pureEntryPoints).length}`);
        // Start all build processes (only node, web, pure)
        await Promise.all([
            this.startBuildProcess(node_js_1.default, nodeEntryPoints, "node"),
            this.startBuildProcess(web_js_1.default, webEntryPoints, "web"),
            this.startBuildProcess(pure_js_1.default, pureEntryPoints, "pure"),
        ]);
    }
    async startBuildProcess(configer, entryPoints, runtime) {
        const entryPointKeys = Object.keys(entryPoints);
        if (entryPointKeys.length === 0)
            return;
        // Store reference to 'this' for use in the plugin
        const self = this;
        // Create a custom plugin to track build processes
        const buildProcessTrackerPlugin = {
            name: 'build-process-tracker',
            setup(build) {
                build.onStart(() => {
                    const processId = `build-${runtime}-${Date.now()}`;
                    const command = `esbuild ${runtime} for ${self.name}`;
                    // Create a promise that will resolve when the build completes
                    const buildPromise = new Promise((resolve, reject) => {
                        // Store resolve and reject functions to call them in onEnd
                        self.currentBuildResolve = resolve;
                        self.currentBuildReject = reject;
                    });
                    // Add to process manager
                    if (self.addPromiseProcess) {
                        self.addPromiseProcess(processId, buildPromise, command, "build-time", self.name, runtime);
                    }
                    console.log(`Starting ${runtime} build for ${entryPointKeys.length} entry points`);
                    // Broadcast build start event
                    if (self.broadcast) {
                        self.broadcast({
                            type: "buildEvent",
                            event: "start",
                            runtime,
                            timestamp: new Date().toISOString(),
                            entryPoints: entryPointKeys.length,
                            processId
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
                        warnings: result.warnings.length
                    };
                    if (result.errors.length > 0) {
                        console.error(`Build ${runtime} failed with ${result.errors.length} errors`);
                        if (self.currentBuildReject) {
                            self.currentBuildReject(new Error(`Build failed with ${result.errors.length} errors`));
                        }
                    }
                    else {
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
            }
        };
        // Get the base config and add our tracking plugin
        const baseConfig = configer(this.configs, entryPointKeys, this.name);
        const configWithPlugin = Object.assign(Object.assign({}, baseConfig), { plugins: [...(baseConfig.plugins || []), buildProcessTrackerPlugin] });
        try {
            const ctx = await esbuild_1.default.context(configWithPlugin);
            if (this.mode === "dev") {
                // In dev mode, start watching - each rebuild will be tracked as a separate process
                await ctx.watch();
            }
            else {
                // In once mode, do a single build which will be tracked by the plugin
                const result = await ctx.rebuild();
                await ctx.dispose();
            }
        }
        catch (error) {
            console.error(`Failed to start ${runtime} build context:`, error);
            // Broadcast error event
            if (this.broadcast) {
                this.broadcast({
                    type: "buildEvent",
                    event: "error",
                    runtime,
                    timestamp: new Date().toISOString(),
                    errors: 1,
                    warnings: 0,
                    message: error.message
                });
            }
        }
    }
}
exports.PM_WithBuild = PM_WithBuild;
