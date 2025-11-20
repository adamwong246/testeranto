"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGiven = void 0;
const pmProxy_js_1 = require("./pmProxy.js");
class BaseGiven {
    addArtifact(path) {
        if (typeof path !== "string") {
            throw new Error(`[ARTIFACT ERROR] Expected string, got ${typeof path}: ${JSON.stringify(path)}`);
        }
        const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
        this.artifacts.push(normalizedPath);
    }
    constructor(features, whens, thens, givenCB, initialValues) {
        this.artifacts = [];
        this.features = features;
        this.whens = whens;
        this.thens = thens;
        this.givenCB = givenCB;
        this.initialValues = initialValues;
        this.fails = 0; // Initialize fail count
    }
    beforeAll(store) {
        return store;
    }
    toObj() {
        return {
            key: this.key,
            whens: (this.whens || []).map((w) => {
                if (w && w.toObj)
                    return w.toObj();
                console.error("When step is not as expected!", JSON.stringify(w));
                return {};
            }),
            thens: (this.thens || []).map((t) => (t && t.toObj ? t.toObj() : {})),
            error: this.error ? [this.error, this.error.stack] : null,
            failed: this.failed,
            features: this.features || [],
            artifacts: this.artifacts,
            status: this.status,
        };
    }
    async afterEach(store, key, artifactory, pm) {
        return store;
    }
    async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm, suiteNdx) {
        this.key = key;
        this.fails = 0; // Initialize fail count for this given
        tLog(`\n ${this.key}`);
        tLog(`\n Given: ${this.key}`);
        const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
        this.uberCatcher((e) => {
            console.error(e.toString());
            this.error = e.error;
            tLog(e.stack);
        });
        try {
            // Ensure addArtifact is properly bound to 'this'
            const addArtifact = this.addArtifact.bind(this);
            const proxiedPm = (0, pmProxy_js_1.beforeEachProxy)(pm, suiteNdx.toString(), addArtifact);
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, this.initialValues, proxiedPm);
            this.status = true;
        }
        catch (e) {
            this.status = false;
            // console.error("Given failure: ", e.stack);
            this.failed = true;
            this.fails++; // Increment fail count
            this.error = e.stack;
            // throw e;
        }
        try {
            const whens = this.whens || [];
            // console.log(`[BaseGiven.give] Number of when steps: ${whens.length}`);
            // if (whens.length > 0) {
            //   // console.log(`[BaseGiven.give] When steps exist, let's process them`);
            //   for (const [whenNdx, whenStep] of whens.entries()) {
            //     // console.log(
            //     //   `[BaseGiven.give] Processing when step ${whenNdx}:`,
            //     //   whenStep?.name
            //     // );
            //     // console.log(`[BaseGiven.give] Store before when step:`, this.store);
            //     // console.log(`[BaseGiven.give] When step instance:`, whenStep);
            //     // Check if this is actually a then step that was incorrectly placed in whens
            //     // if (
            //     //   whenStep &&
            //     //   whenStep.name &&
            //     //   whenStep.name.startsWith("result:")
            //     // ) {
            //     //   // console.error(
            //     //   //   `[BaseGiven.give] ERROR: Found then step "${whenStep.name}" in whens array!`
            //     //   // );
            //     //   // Move it to thens array
            //     //   this.thens.push(whenStep);
            //     //   // console.log(
            //     //   //   `[BaseGiven.give] Moved "${whenStep.name}" from whens to thens`
            //     //   // );
            //     //   continue; // Skip processing as a when step
            //     // }
            //     // // Check if whenStep exists and whenStep.test is a function
            //     // if (whenStep && typeof whenStep.test === "function") {
            //     //   try {
            //     //     // Update the store with the result of the when step
            //     //     this.store = await whenStep.test(
            //     //       this.store,
            //     //       testResourceConfiguration,
            //     //       tLog,
            //     //       pm,
            //     //       `suite-${suiteNdx}/given-${key}/when/${whenNdx}`
            //     //     );
            //     //     // console.log(
            //     //     //   `[BaseGiven.give] Store after when step ${whenNdx}:`,
            //     //     //   this.store
            //     //     // );
            //     //   } catch (e) {
            //     //     // console.error(
            //     //     //   `[BaseGiven.give] Error in when step ${whenNdx}:`,
            //     //     //   e
            //     //     // );
            //     //     this.failed = true;
            //     //     this.fails++; // Increment fail count
            //     //     throw e;
            //     //   }
            //     // } else {
            //     //   // console.error(
            //     //   //   `[BaseGiven.give] whenStep.test is not a function:`,
            //     //   //   typeof whenStep?.test
            //     //   // );
            //     //   this.failed = true;
            //     //   this.fails++; // Increment fail count
            //     //   throw new Error(`When step ${whenNdx} does not have a test method`);
            //     // }
            //   }
            // } else {
            //   console.log(`[BaseGiven.give] No when steps to process`);
            // }
            for (const [thenNdx, thenStep] of this.thens.entries()) {
                try {
                    const t = await thenStep.test(this.store, testResourceConfiguration, tLog, pm, `suite-${suiteNdx}/given-${key}/then-${thenNdx}`);
                    // If the test doesn't throw, it passed
                    tester(t);
                }
                catch (e) {
                    // Mark the given as failed if any then step fails
                    this.failed = true;
                    this.fails++; // Increment fail count
                    // Re-throw to propagate the error
                    throw e;
                }
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
                const addArtifact = this.addArtifact.bind(this);
                const proxiedPm = (0, pmProxy_js_1.afterEachProxy)(pm, suiteNdx.toString(), key, addArtifact);
                // (proxiedPm as any).currentStep = this;
                await this.afterEach(this.store, this.key, givenArtifactory, proxiedPm);
            }
            catch (e) {
                this.failed = true;
                this.fails++; // Increment fail count
                throw e;
                // this.error = e.message;
            }
        }
        return this.store;
    }
}
exports.BaseGiven = BaseGiven;
