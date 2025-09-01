"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWhen = void 0;
const pmProxy_js_1 = require("./pmProxy.js");
class BaseWhen {
    addArtifact(path) {
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
            error: this.error
                ? `${this.error.name}: ${this.error.message}\n${this.error.stack}`
                : null,
            artifacts: this.artifacts || [],
        };
        console.log(`[TOOBJ] Serializing ${this.constructor.name} with artifacts:`, obj.artifacts);
        return obj;
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        try {
            // tLog(" When:", this.name);
            // Ensure addArtifact is properly bound to 'this'
            const addArtifact = this.addArtifact.bind(this);
            const proxiedPm = (0, pmProxy_js_1.andWhenProxy)(pm, filepath, addArtifact);
            // (proxiedPm as any).currentStep = this;
            const result = await this.andWhen(store, this.whenCB, testResourceConfiguration, proxiedPm);
            return result;
        }
        catch (e) {
            console.error("[ERROR] When step failed:", this.name.toString(), e.toString());
            this.error = e;
            throw e;
        }
    }
}
exports.BaseWhen = BaseWhen;
