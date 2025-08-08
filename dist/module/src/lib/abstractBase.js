/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEachProxy, andWhenProxy, beforeEachProxy, butThenProxy, } from "./pmProxy.js";
export class BaseGiven {
    addArtifact(path) {
        console.log("Given addArtifact", path);
        const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
        this.artifacts.push(normalizedPath);
    }
    constructor(name, features, whens, thens, givenCB, initialValues) {
        this.artifacts = [];
        this.name = name;
        this.features = features;
        this.whens = whens;
        this.thens = thens;
        this.givenCB = givenCB;
        this.initialValues = initialValues;
    }
    beforeAll(store) {
        return store;
    }
    toObj() {
        return {
            key: this.key,
            name: this.name,
            whens: this.whens.map((w) => {
                if (w && w.toObj)
                    return w.toObj();
                console.error("w is not as expected!", JSON.stringify(w));
                return {};
            }),
            thens: this.thens.map((t) => t.toObj()),
            error: this.error ? [this.error, this.error.stack] : null,
            failed: this.failed,
            features: this.features,
            artifacts: this.artifacts,
        };
    }
    async afterEach(store, key, artifactory, pm) {
        return store;
    }
    async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm, suiteNdx) {
        this.key = key;
        tLog(`\n ${this.key}`);
        tLog(`\n Given: ${this.name}`);
        const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
        this.uberCatcher((e) => {
            console.error(e.toString());
            this.error = e.error;
            tLog(e.stack);
        });
        try {
            const proxiedPm = beforeEachProxy(pm, suiteNdx.toString(), this.addArtifact.bind(this));
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, this.initialValues, proxiedPm);
        }
        catch (e) {
            // console.error("Given failure: ", e.stack);
            this.failed = true;
            this.error = e.stack;
            // throw e;
        }
        try {
            // tLog(`\n Given this.store`, this.store);
            for (const [whenNdx, whenStep] of this.whens.entries()) {
                await whenStep.test(this.store, testResourceConfiguration, tLog, pm, `suite-${suiteNdx}/given-${key}/when/${whenNdx}`);
            }
            for (const [thenNdx, thenStep] of this.thens.entries()) {
                const t = await thenStep.test(this.store, testResourceConfiguration, tLog, pm, `suite-${suiteNdx}/given-${key}/then-${thenNdx}`);
                tester(t);
            }
        }
        catch (e) {
            this.error = e.stack;
            this.failed = true;
            // tLog(e.stack);
            // throw e;
        }
        finally {
            try {
                const proxiedPm = afterEachProxy(pm, suiteNdx.toString(), key, this.addArtifact.bind(this));
                // (proxiedPm as any).currentStep = this;
                await this.afterEach(this.store, this.key, givenArtifactory, proxiedPm);
            }
            catch (e) {
                this.failed = e;
                throw e;
                // this.error = e.message;
            }
        }
        return this.store;
    }
}
export class BaseWhen {
    addArtifact(path) {
        console.log("When addArtifact", path);
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
            const proxiedPm = andWhenProxy(pm, filepath, this.addArtifact.bind(this));
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
export class BaseThen {
    constructor(name, thenCB) {
        this.artifacts = [];
        this.name = name;
        this.thenCB = thenCB;
        this.error = false;
        this.artifacts = [];
    }
    addArtifact(path) {
        console.log("Then addArtifact", path);
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
        const proxiedPm = butThenProxy(pm, filepath, this.addArtifact.bind(this));
        return this.butThen(store, async (s) => {
            try {
                if (typeof this.thenCB === "function") {
                    return await this.thenCB(s, proxiedPm);
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
