import { beforeAllProxy, afterAllProxy } from "./pmProxy";
export class BaseSuite {
    constructor(name, index, givens = {}) {
        const suiteName = name || "testSuite"; // Ensure name is never undefined
        if (!suiteName) {
            throw new Error("BaseSuite requires a non-empty name");
        }
        console.log("[DEBUG] BaseSuite constructor - name:", suiteName, "index:", index);
        this.name = suiteName;
        this.index = index;
        this.givens = givens;
        this.fails = 0;
        console.log("[DEBUG] BaseSuite initialized:", this.name, this.index);
        console.log("[DEBUG] BaseSuite givens:", Object.keys(givens));
    }
    features() {
        try {
            const features = Object.keys(this.givens)
                .map((k) => this.givens[k].features)
                .flat()
                .filter((value, index, array) => {
                return array.indexOf(value) === index;
            });
            console.debug("[DEBUG] Features extracted:", features);
            return features || [];
        }
        catch (e) {
            console.error("[ERROR] Failed to extract features:", e);
            return [];
        }
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
        const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, beforeAllProxy(pm, sNdx.toString()));
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
            this.afterAll(this.store, artifactory, afterAllProxy(pm, sNdx.toString()));
        }
        catch (e) {
            console.error(e);
            // this.fails.push(this);
            // return this;
        }
        return this;
    }
}
