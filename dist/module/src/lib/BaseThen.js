/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { butThenProxy } from "./pmProxy.js";
export class BaseThen {
    constructor(name, thenCB) {
        this.artifacts = [];
        this.name = name;
        this.thenCB = thenCB;
        this.error = false;
        this.artifacts = [];
    }
    addArtifact(path) {
        const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
        this.artifacts.push(normalizedPath);
    }
    toObj() {
        const obj = {
            name: this.name,
            error: this.error,
            artifacts: this.artifacts,
        };
        return obj;
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        // Ensure addArtifact is properly bound to 'this'
        const addArtifact = this.addArtifact.bind(this);
        const proxiedPm = butThenProxy(pm, filepath, addArtifact);
        return this.butThen(store, async (s) => {
            try {
                if (typeof this.thenCB === "function") {
                    // Add debug logging to see what's being passed to thenCB
                    // Check if the thenCB is spreading the arguments incorrectly
                    // Wrap the proxy to see what's happening when writeFileSync is called
                    const wrappedPm = new Proxy(proxiedPm, {
                        get: (target, prop, receiver) => {
                            if (prop === "writeFileSync") {
                                return (...args) => {
                                    console.log(`[DEBUG] writeFileSync called with args:`, args);
                                    return target[prop](...args);
                                };
                            }
                            return target[prop];
                        },
                    });
                    const result = await this.thenCB(s, wrappedPm);
                    return result;
                }
                else {
                    return this.thenCB;
                }
            }
            catch (e) {
                console.error(e.stack);
            }
        }, testResourceConfiguration, proxiedPm).catch((e) => {
            this.error = e.stack;
            // throw e;
        });
    }
}
