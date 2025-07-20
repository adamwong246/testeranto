/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEachProxy, andWhenProxy, beforeEachProxy, butThenProxy, } from "./pmProxy.js";
export class BaseGiven {
    constructor(name, features, whens, thens, givenCB, initialValues) {
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
                console.error("w is not as expected!", w);
                return {};
            }),
            thens: this.thens.map((t) => t.toObj()),
            error: this.error ? [this.error, this.error.stack] : null,
            failed: this.failed,
            features: this.features,
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
            console.error(e);
            this.error = e.error;
            tLog(e.stack);
        });
        try {
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, this.initialValues, beforeEachProxy(pm, suiteNdx.toString()));
        }
        catch (e) {
            console.error("failure 4 ", e);
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
                await this.afterEach(this.store, this.key, givenArtifactory, afterEachProxy(pm, suiteNdx.toString(), key));
            }
            catch (e) {
                console.error("afterEach failed!", e);
                this.failed = e;
                throw e;
                // this.error = e.message;
            }
        }
        return this.store;
    }
}
export class BaseWhen {
    constructor(name, whenCB) {
        this.name = name;
        this.whenCB = whenCB;
    }
    toObj() {
        console.log("toObj error", this.error);
        return {
            name: this.name,
            error: this.error && this.error.name + this.error.stack,
        };
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        tLog(" When:", this.name);
        return await this.andWhen(store, this.whenCB, testResourceConfiguration, andWhenProxy(pm, filepath)).catch((e) => {
            this.error = e;
            throw e;
        });
    }
}
export class BaseThen {
    constructor(name, thenCB) {
        this.name = name;
        this.thenCB = thenCB;
        this.error = false;
    }
    toObj() {
        return {
            name: this.name,
            error: this.error,
        };
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        return this.butThen(store, async (s) => {
            tLog(" Then!!!:", this.name);
            if (typeof this.thenCB === "function") {
                return await this.thenCB(s);
            }
            else {
                return this.thenCB;
            }
        }, testResourceConfiguration, butThenProxy(pm, filepath)).catch((e) => {
            this.error = e;
            throw e;
        });
    }
}
