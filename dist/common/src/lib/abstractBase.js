"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseThen = exports.BaseWhen = exports.BaseGiven = void 0;
const pmProxy_js_1 = require("./pmProxy.js");
class BaseGiven {
    addArtifact(path) {
        console.log(`[Artifact] Adding to ${this.constructor.name}:`, path);
        this.artifacts.push(path);
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
                console.error("w is not as expected!", w.toString());
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
            const proxiedPm = (0, pmProxy_js_1.beforeEachProxy)(pm, suiteNdx.toString());
            console.log(`[Given] Setting currentStep for beforeEach:`, this.name);
            proxiedPm.currentStep = this;
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, this.initialValues, proxiedPm);
        }
        catch (e) {
            console.error("Given failure: ", e.toString());
            this.error = e;
            throw e;
        }
        try {
            // tLog(`\n Given this.store`, this.store);
            for (const [whenNdx, whenStep] of this.whens.entries()) {
                await whenStep.test(this.store, testResourceConfiguration, tLog, pm, `suite-${suiteNdx}/given-${key}/when/${whenNdx}`);
            }
            for (const [thenNdx, thenStep] of this.thens.entries()) {
                const t = await thenStep.test(this.store, testResourceConfiguration, tLog, pm, `suite-${suiteNdx}/given-${key}/then-${thenNdx}`);
                tester(t);
                // ((t) => {
                //   return tester(t);
                // })();
            }
        }
        catch (e) {
            this.failed = true;
            tLog(e.stack);
            throw e;
        }
        finally {
            try {
                await this.afterEach(this.store, this.key, givenArtifactory, (0, pmProxy_js_1.afterEachProxy)(pm, suiteNdx.toString(), key));
            }
            catch (e) {
                console.error("afterEach failed!", e.toString());
                this.failed = e;
                throw e;
                // this.error = e.message;
            }
        }
        return this.store;
    }
}
exports.BaseGiven = BaseGiven;
class BaseWhen {
    constructor(name, whenCB) {
        this.artifacts = [];
        this.name = name;
        this.whenCB = whenCB;
    }
    toObj() {
        console.log("toObj error", this.error);
        if (this.error) {
            return {
                name: this.name,
                error: this.error && this.error.name + this.error.stack,
                artifacts: this.artifacts,
            };
        }
        else {
            return {
                name: this.name,
                artifacts: this.artifacts,
            };
        }
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        try {
            tLog(" When:", this.name);
            console.debug("[DEBUG] Executing When step:", this.name.toString());
            const proxiedPm = (0, pmProxy_js_1.andWhenProxy)(pm, filepath);
            console.log(`[When] Setting currentStep for andWhen:`, this.name);
            proxiedPm.currentStep = this;
            const result = await this.andWhen(store, this.whenCB, testResourceConfiguration, proxiedPm);
            console.debug("[DEBUG] When step completed:", this.name.toString());
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
class BaseThen {
    constructor(name, thenCB) {
        this.artifacts = [];
        this.name = name;
        this.thenCB = thenCB;
        this.error = false;
    }
    toObj() {
        return {
            name: this.name,
            error: this.error,
            artifacts: this.artifacts,
        };
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        const proxiedPm = (0, pmProxy_js_1.butThenProxy)(pm, filepath);
        console.log(`[Then] Setting currentStep for butThen:`, this.name);
        proxiedPm.currentStep = this;
        return this.butThen(store, async (s) => {
            if (typeof this.thenCB === "function") {
                return await this.thenCB(s, proxiedPm);
            }
            else {
                return this.thenCB;
            }
        }, testResourceConfiguration, (0, pmProxy_js_1.butThenProxy)(pm, filepath)).catch((e) => {
            this.error = e.toString();
            // throw e;
        });
    }
}
exports.BaseThen = BaseThen;
