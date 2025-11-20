"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSuite = void 0;
const pmProxy_1 = require("./pmProxy");
class BaseSuite {
    addArtifact(path) {
        if (typeof path !== "string") {
            throw new Error(`[ARTIFACT ERROR] Expected string, got ${typeof path}: ${JSON.stringify(path)}`);
        }
        const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
        this.artifacts.push(normalizedPath);
    }
    constructor(name, index, givens = {}) {
        this.artifacts = [];
        const suiteName = name || "testSuite"; // Ensure name is never undefined
        if (!suiteName) {
            throw new Error("BaseSuite requires a non-empty name");
        }
        this.name = suiteName;
        this.index = index;
        this.givens = givens;
        this.fails = 0;
    }
    features() {
        try {
            const features = Object.keys(this.givens)
                .map((k) => this.givens[k].features)
                .flat()
                .filter((value, index, array) => {
                return array.indexOf(value) === index;
            });
            // Convert all features to strings
            const stringFeatures = features.map((feature) => {
                if (typeof feature === "string") {
                    return feature;
                }
                else if (feature && typeof feature === "object") {
                    return feature.name || JSON.stringify(feature);
                }
                else {
                    return String(feature);
                }
            });
            return stringFeatures || [];
        }
        catch (e) {
            console.error("[ERROR] Failed to extract features:", JSON.stringify(e));
            return [];
        }
    }
    toObj() {
        const givens = Object.keys(this.givens).map((k) => {
            const givenObj = this.givens[k].toObj();
            // Ensure given features are strings
            // if (givenObj.features) {
            //   givenObj.features = givenObj.features.map(feature => {
            //     return feature;
            //     // if (typeof feature === 'string') {
            //     //   return feature;
            //     // } else if (feature && typeof feature === 'object') {
            //     //   return feature.name || JSON.stringify(feature);
            //     // } else {
            //     //   return String(feature);
            //     // }
            //   });
            // }
            return givenObj;
        });
        return {
            name: this.name,
            givens,
            fails: this.fails,
            failed: this.failed,
            features: this.features(),
            artifacts: this.artifacts
                ? this.artifacts.filter((art) => typeof art === "string")
                : [],
        };
    }
    setup(s, artifactory, tr, pm) {
        return new Promise((res) => res(s));
    }
    assertThat(t) {
        return !!t;
    }
    afterAll(store, artifactory, pm) {
        return store;
    }
    async run(input, testResourceConfiguration, artifactory, tLog, pm) {
        this.testResourceConfiguration = testResourceConfiguration;
        // tLog("test resources: ", JSON.stringify(testResourceConfiguration));
        const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
        // console.log("\nSuite:", this.index, this.name);
        // tLog("\nSuite:", this.index, this.name);
        const sNdx = this.index;
        // Ensure addArtifact is properly bound to 'this'
        const addArtifact = this.addArtifact.bind(this);
        const proxiedPm = (0, pmProxy_1.beforeAllProxy)(pm, sNdx.toString(), addArtifact);
        const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, proxiedPm);
        for (const [gKey, g] of Object.entries(this.givens)) {
            const giver = this.givens[gKey];
            try {
                this.store = await giver.give(subject, gKey, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm, sNdx);
                // Add the number of failures from this given to the suite's total
                this.fails += giver.fails || 0;
            }
            catch (e) {
                this.failed = true;
                // Add 1 to fails for the caught error
                this.fails += 1;
                // Also add any failures from the given itself
                if (giver.fails) {
                    this.fails += giver.fails;
                }
                console.error(`Error in given ${gKey}:`, e);
                // Don't re-throw to continue with other givens
            }
        }
        // Mark the suite as failed if there are any failures
        if (this.fails > 0) {
            this.failed = true;
        }
        try {
            // Ensure addArtifact is properly bound to 'this'
            const addArtifact = this.addArtifact.bind(this);
            const afterAllPm = (0, pmProxy_1.afterAllProxy)(pm, sNdx.toString(), addArtifact);
            this.afterAll(this.store, artifactory, afterAllPm);
        }
        catch (e) {
            console.error(JSON.stringify(e));
            // this.fails.push(this);
            // return this;
        }
        return this;
    }
}
exports.BaseSuite = BaseSuite;
