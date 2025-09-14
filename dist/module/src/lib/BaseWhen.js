/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { andWhenProxy } from "./pmProxy.js";
export class BaseWhen {
    addArtifact(path) {
        if (typeof path !== "string") {
            throw new Error(`[ARTIFACT ERROR] Expected string, got ${typeof path}: ${JSON.stringify(path)}`);
        }
        const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
        this.artifacts.push(normalizedPath);
    }
    constructor(name, whenCB) {
        this.artifacts = [];
        this.name = name;
        this.whenCB = whenCB;
    }
    toObj() {
        const obj = {
            name: this.name,
            status: this.status,
            error: this.error
                ? `${this.error.name}: ${this.error.message}\n${this.error.stack}`
                : null,
            artifacts: this.artifacts,
        };
        return obj;
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        try {
            // Ensure addArtifact is properly bound to 'this'
            const addArtifact = this.addArtifact.bind(this);
            const proxiedPm = andWhenProxy(pm, filepath, addArtifact);
            const result = await this.andWhen(store, this.whenCB, testResourceConfiguration, proxiedPm);
            this.status = true;
            return result;
        }
        catch (e) {
            this.status = false;
            this.error = e;
            throw e;
        }
    }
}
