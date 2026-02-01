export class BaseGiven {
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
    async afterEach(store, key, artifactory) {
        return store;
    }
    async give(subject, key, testResourceConfiguration, tester, artifactory, suiteNdx) {
        this.key = key;
        this.fails = 0; // Initialize fail count for this given
        const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
        try {
            // Ensure addArtifact is properly bound to 'this'
            const addArtifact = this.addArtifact.bind(this);
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, this.initialValues);
            this.status = true;
        }
        catch (e) {
            this.status = false;
            this.failed = true;
            this.fails++; // Increment fail count
            this.error = e.stack;
        }
        try {
            const whens = this.whens || [];
            for (const [thenNdx, thenStep] of this.thens.entries()) {
                try {
                    const t = await thenStep.test(this.store, testResourceConfiguration, `suite-${suiteNdx}/given-${key}/then-${thenNdx}`);
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
        }
        finally {
            try {
                const addArtifact = this.addArtifact.bind(this);
                await this.afterEach(this.store, this.key);
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
