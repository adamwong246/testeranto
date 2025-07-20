"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSuite = void 0;
const pmProxy_1 = require("./pmProxy");
class BaseSuite {
    constructor(name, index, givens = {}) {
        this.name = name;
        this.index = index;
        this.givens = givens;
        this.fails = 0;
    }
    features() {
        const features = Object.keys(this.givens)
            .map((k) => this.givens[k].features)
            .flat()
            .filter((value, index, array) => {
            return array.indexOf(value) === index;
        });
        return features || [];
    }
    toObj() {
        const givens = Object.keys(this.givens).map((k) => this.givens[k].toObj());
        return {
            name: this.name,
            givens,
            fails: this.fails,
            failed: this.failed,
            features: this.features(),
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
        tLog("\nSuite:", this.index, this.name);
        const sNdx = this.index;
        // const sName = this.name;
        const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, (0, pmProxy_1.beforeAllProxy)(pm, sNdx.toString()));
        for (const [gKey, g] of Object.entries(this.givens)) {
            const giver = this.givens[gKey];
            this.store = await giver
                .give(subject, gKey, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm, sNdx)
                .catch((e) => {
                this.failed = true;
                this.fails = this.fails + 1;
                console.error("Given error 1:", e);
                throw e;
            });
        }
        try {
            this.afterAll(this.store, artifactory, (0, pmProxy_1.afterAllProxy)(pm, sNdx.toString()));
        }
        catch (e) {
            console.error(e);
            // this.fails.push(this);
            // return this;
        }
        return this;
    }
}
exports.BaseSuite = BaseSuite;
