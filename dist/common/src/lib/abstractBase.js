"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCheck = exports.BaseThen = exports.BaseWhen = exports.BaseGiven = exports.BaseSuite = void 0;
const pmProxy_js_1 = require("./pmProxy.js");
class BaseSuite {
    constructor(name, index, givens = {}, checks = []) {
        this.name = name;
        this.index = index;
        this.givens = givens;
        this.checks = checks;
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
        const checks = Object.keys(this.checks).map((k) => this.checks[k].toObj());
        return {
            name: this.name,
            givens,
            checks,
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
        const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, (0, pmProxy_js_1.beforeAllProxy)(pm, sNdx.toString()));
        for (const [gKey, g] of Object.entries(this.givens)) {
            const giver = this.givens[gKey];
            try {
                this.store = await giver.give(subject, gKey, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm, sNdx);
            }
            catch (e) {
                this.failed = true;
                this.fails = this.fails + 1;
                console.error(e);
                // this.fails.push(giver);
                // return this;
            }
        }
        for (const [ndx, thater] of this.checks.entries()) {
            await thater.check(subject, thater.name, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm);
        }
        try {
            this.afterAll(this.store, artifactory, (0, pmProxy_js_1.afterAllProxy)(pm, sNdx.toString()));
        }
        catch (e) {
            console.error(e);
            // this.fails.push(this);
            // return this;
        }
        // @TODO fix me
        // for (const k of Object.keys(this.givens)) {
        //   const giver = this.givens[k];
        //   try {
        //     giver.afterAll(this.store, artifactory, pm);
        //   } catch (e) {
        //     console.error(e);
        //     this.fails.push(giver);
        //     return this;
        //   }
        // }
        ////////////////
        return this;
    }
}
exports.BaseSuite = BaseSuite;
class BaseGiven {
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
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, this.initialValues, (0, pmProxy_js_1.beforeEachProxy)(pm, suiteNdx.toString()));
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
                await this.afterEach(this.store, this.key, givenArtifactory, (0, pmProxy_js_1.afterEachProxy)(pm, suiteNdx.toString(), key));
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
exports.BaseGiven = BaseGiven;
class BaseWhen {
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
        return await this.andWhen(store, this.whenCB, testResourceConfiguration, (0, pmProxy_js_1.andWhenProxy)(pm, filepath)).catch((e) => {
            console.log("MARK9", e);
            this.error = e;
            throw e;
        });
    }
}
exports.BaseWhen = BaseWhen;
class BaseThen {
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
        }, testResourceConfiguration, (0, pmProxy_js_1.butThenProxy)(pm, filepath)).catch((e) => {
            console.log("test failed 3", e);
            this.error = e;
            throw e;
        });
    }
    check() { }
}
exports.BaseThen = BaseThen;
class BaseCheck {
    constructor(name, features, checker, x, checkCB) {
        this.name = name;
        this.features = features;
        this.checkCB = checkCB;
        this.checker = checker;
    }
    toObj() {
        return {
            key: this.key,
            name: this.name,
            // functionAsString: this.checkCB.toString(),
            features: this.features,
        };
    }
    async afterEach(store, key, artifactory, pm) {
        return store;
    }
    beforeAll(store) {
        return store;
    }
    async check(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm) {
        this.key = key;
        tLog(`\n Check: ${this.name}`);
        this.store = await this.checkThat(subject, testResourceConfiguration, artifactory, this.checkCB, this.initialValues, pm);
        await this.checker(this.store, pm);
        return;
    }
}
exports.BaseCheck = BaseCheck;
