/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEachProxy, beforeEachProxy } from "./pmProxy.js";
export class BaseGiven {
    addArtifact(path) {
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
            // Ensure addArtifact is properly bound to 'this'
            const addArtifact = this.addArtifact.bind(this);
            const proxiedPm = beforeEachProxy(pm, suiteNdx.toString(), addArtifact);
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
                // Ensure addArtifact is properly bound to 'this'
                const addArtifact = this.addArtifact.bind(this);
                const proxiedPm = afterEachProxy(pm, suiteNdx.toString(), key, addArtifact);
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
