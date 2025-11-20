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
        if (typeof path !== "string") {
            throw new Error(`[ARTIFACT ERROR] Expected string, got ${typeof path}: ${JSON.stringify(path)}`);
        }
        const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
        this.artifacts.push(normalizedPath);
    }
    toObj() {
        const obj = {
            name: this.name,
            error: this.error,
            artifacts: this.artifacts,
            status: this.status,
        };
        return obj;
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        // Ensure addArtifact is properly bound to 'this'
        const addArtifact = this.addArtifact.bind(this);
        const proxiedPm = butThenProxy(pm, filepath, addArtifact);
        try {
            const x = await this.butThen(store, async (s) => {
                try {
                    if (typeof this.thenCB === "function") {
                        const result = await this.thenCB(s, proxiedPm);
                        return result;
                    }
                    else {
                        return this.thenCB;
                    }
                }
                catch (e) {
                    // Mark this then step as failed
                    this.error = true;
                    // Re-throw to be caught by the outer catch block
                    throw e;
                }
            }, testResourceConfiguration, proxiedPm);
            this.status = true;
            return x;
        }
        catch (e) {
            this.status = false;
            this.error = true;
            throw e;
        }
    }
}
