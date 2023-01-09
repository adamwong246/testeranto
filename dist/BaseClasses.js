import { mapValues } from "lodash";
export class BaseFeature {
    constructor(name) {
        this.name = name;
    }
}
export class BaseSuite {
    constructor(name, givens = [], checks = []) {
        this.name = name;
        this.givens = givens;
        this.checks = checks;
        this.fails = [];
    }
    async aborter() {
        this.aborted = true;
        await Promise.all((this.givens || []).map((g, ndx) => g.aborter(ndx)));
    }
    toObj() {
        return {
            name: this.name,
            givens: this.givens.map((g) => g.toObj()),
            fails: this.fails
        };
    }
    setup(s) {
        return new Promise((res) => res(s));
    }
    test(t) {
        return t;
    }
    async run(input, testResourceConfiguration) {
        const subject = await this.setup(input);
        // console.log("\nSuite:", this.name, testResourceConfiguration);
        for (const [ndx, giver] of this.givens.entries()) {
            try {
                if (!this.aborted) {
                    this.store = await giver.give(subject, ndx, testResourceConfiguration, this.test);
                }
            }
            catch (e) {
                console.error(e);
                this.fails.push(giver);
                return false;
            }
        }
        for (const [ndx, thater] of this.checks.entries()) {
            await thater.check(subject, ndx, testResourceConfiguration, this.test);
        }
        return true;
    }
}
class TestArtifact {
    constructor(binary) {
        this.binary = binary;
    }
}
export class BaseGiven {
    constructor(name, features, whens, thens) {
        this.artifactSaver = {
            png: (testArtifact) => this.saveTestArtifact('afterEach', new TestArtifact(testArtifact))
        };
        this.name = name;
        this.features = features;
        this.whens = whens;
        this.thens = thens;
        this.testArtifacts = {};
    }
    toObj() {
        return {
            name: this.name,
            whens: this.whens.map((w) => w.toObj()),
            thens: this.thens.map((t) => t.toObj()),
            errors: this.error
        };
    }
    saveTestArtifact(k, testArtifact) {
        if (!this.testArtifacts[k]) {
            this.testArtifacts[k] = [];
        }
        this.testArtifacts[k].push(testArtifact);
    }
    async aborter(ndx) {
        this.abort = true;
        return Promise.all([
            ...this.whens.map((w, ndx) => new Promise((res) => res(w.aborter()))),
            ...this.thens.map((t, ndx) => new Promise((res) => res(t.aborter()))),
        ])
            .then(async () => {
            return await this.afterEach(this.store, ndx, this.artifactSaver);
        });
    }
    async afterEach(store, ndx, cb) {
        return;
    }
    async give(subject, index, testResourceConfiguration, tester) {
        console.log(`\n Given: ${this.name}`);
        try {
            if (!this.abort) {
                this.store = await this.givenThat(subject, testResourceConfiguration);
            }
            for (const whenStep of this.whens) {
                await whenStep.test(this.store, testResourceConfiguration);
            }
            for (const thenStep of this.thens) {
                const t = await thenStep.test(this.store, testResourceConfiguration);
                tester(t);
            }
        }
        catch (e) {
            this.error = e;
            console.log('\u0007'); // bell
            throw e;
        }
        finally {
            try {
                await this.afterEach(this.store, index, this.artifactSaver);
            }
            catch (_a) {
                console.error("afterEach failed! no error will be recorded!");
            }
        }
        return this.store;
    }
}
export class BaseWhen {
    constructor(name, actioner) {
        this.name = name;
        this.actioner = actioner;
    }
    toObj() {
        return {
            name: this.name,
            error: this.error,
        };
    }
    aborter() {
        this.abort = true;
        return this.abort;
    }
    async test(store, testResourceConfiguration) {
        console.log(" When:", this.name);
        if (!this.abort) {
            try {
                return await this.andWhen(store, this.actioner, testResourceConfiguration);
            }
            catch (e) {
                this.error = true;
                throw e;
            }
        }
    }
}
export class BaseThen {
    constructor(name, thenCB) {
        this.name = name;
        this.thenCB = thenCB;
    }
    toObj() {
        return {
            name: this.name,
            error: this.error,
        };
    }
    aborter() {
        this.abort = true;
        return this.abort;
    }
    async test(store, testResourceConfiguration) {
        if (!this.abort) {
            console.log(" Then:", this.name);
            try {
                return await this.thenCB(await this.butThen(store, testResourceConfiguration));
            }
            catch (e) {
                this.error = true;
                throw e;
            }
        }
    }
}
export class BaseCheck {
    constructor(name, features, checkCB, whens, thens) {
        this.name = name;
        this.features = features;
        this.checkCB = checkCB;
        this.whens = whens;
        this.thens = thens;
    }
    async afterEach(store, ndx, cb) {
        return;
    }
    async check(subject, ndx, testResourceConfiguration, tester) {
        console.log(`\n Check: ${this.name}`);
        const store = await this.checkThat(subject, testResourceConfiguration);
        await this.checkCB(mapValues(this.whens, (when) => {
            return async (payload) => {
                return await when(payload, testResourceConfiguration).test(store, testResourceConfiguration);
            };
        }), mapValues(this.thens, (then) => {
            return async (payload) => {
                const t = await then(payload, testResourceConfiguration).test(store, testResourceConfiguration);
                tester(t);
            };
        }));
        await this.afterEach(store, ndx);
        return;
    }
}
