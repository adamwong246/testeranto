export class BaseSuite {
    constructor(name, index, givens = {}, checks = []) {
        this.name = name;
        this.index = index;
        this.givens = givens;
        this.checks = checks;
        this.fails = [];
    }
    toObj() {
        return {
            name: this.name,
            givens: Object.keys(this.givens).map((k) => this.givens[k].toObj()),
            fails: this.fails,
        };
    }
    setup(s, artifactory, tr, pm) {
        // console.log("marl11");
        return new Promise((res) => res(s));
    }
    assertThat(t) {
        // console.log("base assertThat")
        return t;
    }
    async run(input, testResourceConfiguration, artifactory, tLog, pm) {
        this.testResourceConfiguration = testResourceConfiguration;
        tLog("test resources: ", JSON.stringify(testResourceConfiguration));
        const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
        const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, pm);
        console.log("\nSuite:", this.index, this.name);
        tLog("\nSuite:", this.index, this.name);
        for (const k of Object.keys(this.givens)) {
            const giver = this.givens[k];
            try {
                this.store = await giver.give(subject, k, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm);
            }
            catch (e) {
                console.error(e);
                this.fails.push(giver);
                return this;
            }
        }
        for (const [ndx, thater] of this.checks.entries()) {
            await thater.check(subject, thater.name, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm);
        }
        // @TODO fix me
        for (const k of Object.keys(this.givens)) {
            const giver = this.givens[k];
            // const pm2 = 1;
            // console.log("mark4", pm2);
            try {
                giver.afterAll(this.store, artifactory, pm);
            }
            catch (e) {
                console.error(e);
                this.fails.push(giver);
                return this;
            }
        }
        ////////////////
        return this;
    }
}
export class BaseGiven {
    constructor(name, features, whens, thens, givenCB, initialValues) {
        this.name = name;
        this.features = features;
        this.whens = whens;
        this.thens = thens;
        this.givenCB = givenCB;
        this.initialValues = initialValues;
    }
    beforeAll(store, artifactory) {
        return store;
    }
    afterAll(store, artifactory, pm) {
        return store;
    }
    toObj() {
        return {
            name: this.name,
            whens: this.whens.map((w) => w.toObj()),
            thens: this.thens.map((t) => t.toObj()),
            error: this.error ? [this.error, this.error.stack] : null,
            features: this.features,
        };
    }
    async afterEach(store, key, artifactory, pm) {
        return store;
    }
    async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm) {
        tLog(`\n Given: ${this.name}`);
        const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
        try {
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, pm);
            // tLog(`\n Given this.store`, this.store);
            for (const whenStep of this.whens) {
                await whenStep.test(this.store, testResourceConfiguration, tLog, pm);
            }
            for (const thenStep of this.thens) {
                const t = await thenStep.test(this.store, testResourceConfiguration, tLog, pm);
                tester(t);
            }
        }
        catch (e) {
            this.error = e;
            tLog(e);
            tLog("\u0007"); // bell
            // throw e;
        }
        finally {
            try {
                await this.afterEach(this.store, key, givenArtifactory, pm);
            }
            catch (e) {
                console.error("afterEach failed! no error will be recorded!", e);
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
        return {
            name: this.name,
            error: this.error,
        };
    }
    async test(store, testResourceConfiguration, tLog, pm) {
        tLog(" When:", this.name);
        try {
            return await this.andWhen(store, this.whenCB, testResourceConfiguration);
        }
        catch (e) {
            this.error = true;
            throw e;
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
    async test(store, testResourceConfiguration, tLog, pm) {
        tLog(" Then:", this.name);
        try {
            const x = await this.butThen(store, this.thenCB, testResourceConfiguration);
            return x;
        }
        catch (e) {
            console.log("test failed", e);
            this.error = true;
            throw e;
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
    async afterEach(store, key, cb, pm) {
        return;
    }
    async check(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm) {
        tLog(`\n Check: ${this.name}`);
        const store = await this.checkThat(subject, testResourceConfiguration, artifactory);
        await this.checkCB(Object.entries(this.whens).reduce((a, [key, when]) => {
            a[key] = async (payload) => {
                return await when(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog, pm);
            };
            return a;
        }, {}), Object.entries(this.thens).reduce((a, [key, then]) => {
            a[key] = async (payload) => {
                const t = await then(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog, pm);
                tester(t);
            };
            return a;
        }, {}));
        await this.afterEach(store, key, () => { }, pm);
        return;
    }
}
