import { beforeAllProxy, afterAllProxy } from "./pmProxy";
export class BaseSuite {
    addArtifact(path) {
        console.log("Suite addArtifact", path);
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
            return features || [];
        }
        catch (e) {
            console.error("[ERROR] Failed to extract features:", JSON.stringify(e));
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
        console.log("mark19");
        this.testResourceConfiguration = testResourceConfiguration;
        // tLog("test resources: ", JSON.stringify(testResourceConfiguration));
        const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
        // console.log("\nSuite:", this.index, this.name);
        tLog("\nSuite:", this.index, this.name);
        const sNdx = this.index;
        // const sName = this.name;
        const proxiedPm = beforeAllProxy(pm, sNdx.toString(), this);
        // (proxiedPm as any).currentStep = this;
        const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, proxiedPm);
        console.log("mark40");
        for (const [gKey, g] of Object.entries(this.givens)) {
            // console.log("mark22", gKey);
            const giver = this.givens[gKey];
            console.log("mark44");
            this.store = await giver
                .give(subject, gKey, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm, sNdx)
                .catch((e) => {
                console.log("mark42");
                this.failed = true;
                this.fails = this.fails + 1;
                throw e;
            });
            console.log("mark43");
        }
        console.log("mark41");
        try {
            const afterAllPm = afterAllProxy(pm, sNdx.toString(), this);
            // (afterAllPm as any).currentStep = this;
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
