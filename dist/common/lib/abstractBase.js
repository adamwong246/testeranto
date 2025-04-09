"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCheck = exports.BaseThen = exports.BaseWhen = exports.BaseGiven = exports.BaseSuite = void 0;
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
        const sName = this.name;
        const beforeAllProxy = new Proxy(pm, {
            get(target, prop, receiver) {
                if (prop === "customScreenShot") {
                    return (opts, p) => target.customScreenShot(Object.assign(Object.assign({}, opts), { 
                        // path: `${filepath}/${opts.path}`,
                        path: `suite-${sNdx}/beforeAll/${opts.path}` }), p);
                }
                if (prop === "writeFileSync") {
                    return (fp, contents) => target[prop](`suite-${sNdx}/beforeAll/${fp}`, contents);
                }
                /* @ts-ignore:next-line */
                return Reflect.get(...arguments);
            },
        });
        const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, beforeAllProxy);
        for (const [gKey, g] of Object.entries(this.givens)) {
            const giver = this.givens[gKey];
            try {
                this.store = await giver.give(subject, gKey, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm, sNdx);
            }
            catch (e) {
                this.failed = true;
                this.fails = this.fails + 1;
                // console.error(e);
                // this.fails.push(giver);
                // return this;
            }
        }
        for (const [ndx, thater] of this.checks.entries()) {
            await thater.check(subject, thater.name, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm);
        }
        try {
            this.afterAll(this.store, artifactory, 
            // afterAllProxy
            pm);
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
            whens: this.whens.map((w) => w.toObj()),
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
        const beforeEachProxy = new Proxy(pm, {
            get(target, prop, receiver) {
                if (prop === "writeFileSync") {
                    return (fp, contents) => target[prop](`suite-${suiteNdx}/given-${key}/when/beforeEach/${fp}`, contents);
                }
                if (prop === "customScreenShot") {
                    return (opts, p) => target.customScreenShot(Object.assign(Object.assign({}, opts), { path: `suite-${suiteNdx}/given-${key}/when/beforeEach/${opts.path}` }), p);
                }
                if (prop === "screencast") {
                    return (opts, p) => target.screencast(Object.assign(Object.assign({}, opts), { path: `suite-${suiteNdx}/given-${key}/when/beforeEach/${opts.path}` }), p);
                }
                /* @ts-ignore:next-line */
                return Reflect.get(...arguments);
            },
        });
        this.uberCatcher((e) => {
            console.error(e);
            this.error = e.error;
            tLog(e.stack);
        });
        try {
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, this.initialValues, beforeEachProxy);
        }
        catch (e) {
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
            }
        }
        catch (e) {
            // this.error = e;
            this.failed = true;
            tLog(e.stack);
            throw e;
        }
        finally {
            try {
                const afterEachProxy = new Proxy(pm, {
                    get(target, prop, receiver) {
                        if (prop === "customScreenShot") {
                            return (opts, p) => target.customScreenShot(Object.assign(Object.assign({}, opts), { path: `suite-${suiteNdx}/given-${key}/afterEach/${opts.path}` }), p);
                        }
                        if (prop === "writeFileSync") {
                            return (fp, contents) => target[prop](`suite-${suiteNdx}/given-${key}/afterEach/${fp}`, contents);
                        }
                        /* @ts-ignore:next-line */
                        return Reflect.get(...arguments);
                    },
                });
                await this.afterEach(this.store, this.key, givenArtifactory, 
                // pm
                afterEachProxy);
            }
            catch (e) {
                this.failed = e;
                throw e;
                // console.error("afterEach failed!", e);
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
        return {
            name: this.name,
            error: this.error,
        };
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        tLog(" When:", this.name);
        const andWhenProxy = new Proxy(pm, {
            get(target, prop, receiver) {
                if (prop === "customScreenShot") {
                    return (opts, p) => target.customScreenShot(Object.assign(Object.assign({}, opts), { path: `${filepath}/${opts.path}` }), p);
                }
                if (prop === "writeFileSync") {
                    return (fp, contents) => target[prop](`${filepath}/andWhen/${fp}`, contents);
                }
                /* @ts-ignore:next-line */
                return Reflect.get(...arguments);
            },
        });
        return await this.andWhen(store, this.whenCB, testResourceConfiguration, andWhenProxy).catch((e) => {
            this.error = true;
            // throw e;
        });
        // try {
        //   return await this.andWhen(
        //     store,
        //     this.whenCB,
        //     testResourceConfiguration,
        //     andWhenProxy
        //   );
        // } catch (e) {
        //   this.error = true;
        //   throw e;
        // }
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
        this.go = async (s) => {
            tLog(" Then!!!:", this.name);
            try {
                await this.thenCB(s);
            }
            catch (e) {
                console.log("test failed 1", e);
                this.error = e;
                throw e;
            }
        };
        try {
            const butThenProxy = new Proxy(pm, {
                get(target, prop, receiver) {
                    if (prop === "customScreenShot") {
                        return (opts, p) => target.customScreenShot(Object.assign(Object.assign({}, opts), { path: `${filepath}/${opts.path}` }), p);
                    }
                    if (prop === "writeFileSync") {
                        return (fp, contents) => target[prop](`${filepath}/${fp}`, contents);
                    }
                    /* @ts-ignore:next-line */
                    return Reflect.get(...arguments);
                },
            });
            return this.butThen(store, this.go, testResourceConfiguration, butThenProxy).catch((e) => {
                this.error = e;
                throw e;
            });
        }
        catch (e) {
            console.log("test failed 2", e);
            this.error = e;
            throw e;
        }
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
            functionAsString: this.checkCB.toString(),
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
