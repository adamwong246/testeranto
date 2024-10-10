"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassBuilder = exports.BaseBuilder = exports.BaseCheck = exports.BaseThen = exports.BaseWhen = exports.BaseGiven = exports.BaseSuite = void 0;
class BaseSuite {
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
    setup(s, artifactory) {
        return new Promise((res) => res(s));
    }
    test(t) {
        return t;
    }
    async run(input, testResourceConfiguration, artifactory, tLog) {
        this.testResourceConfiguration = testResourceConfiguration;
        const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
        const subject = await this.setup(input, suiteArtifactory);
        tLog("\nSuite:", this.index, this.name);
        for (const k of Object.keys(this.givens)) {
            const giver = this.givens[k];
            try {
                this.store = await giver.give(subject, k, testResourceConfiguration, this.test, suiteArtifactory, tLog);
            }
            catch (e) {
                console.error(e);
                this.fails.push(giver);
                return this;
            }
        }
        for (const [ndx, thater] of this.checks.entries()) {
            await thater.check(subject, thater.name, testResourceConfiguration, this.test, suiteArtifactory, tLog);
        }
        // @TODO fix me
        for (const k of Object.keys(this.givens)) {
            const giver = this.givens[k];
            giver.afterAll(this.store, artifactory);
        }
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
    beforeAll(store, artifactory) {
        return store;
    }
    afterAll(store, artifactory) {
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
    async afterEach(store, key, artifactory) {
        return store;
    }
    async give(subject, key, testResourceConfiguration, tester, artifactory, tLog) {
        tLog(`\n Given: ${this.name}`);
        const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
        try {
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB);
            // tLog(`\n Given this.store`, this.store);
            for (const whenStep of this.whens) {
                await whenStep.test(this.store, testResourceConfiguration, tLog);
            }
            for (const thenStep of this.thens) {
                const t = await thenStep.test(this.store, testResourceConfiguration, tLog);
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
                await this.afterEach(this.store, key, givenArtifactory);
            }
            catch (e) {
                console.error("afterEach failed! no error will be recorded!", e);
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
    async test(store, testResourceConfiguration, tLog) {
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
exports.BaseWhen = BaseWhen;
class BaseThen {
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
    async test(store, testResourceConfiguration, tLog) {
        tLog(" Then:", this.name);
        try {
            const x = this.thenCB(await this.butThen(store, testResourceConfiguration));
            return x;
        }
        catch (e) {
            console.log("test failed", e);
            this.error = true;
            throw e;
        }
    }
}
exports.BaseThen = BaseThen;
class BaseCheck {
    constructor(name, features, checkCB, whens, thens) {
        this.name = name;
        this.features = features;
        this.checkCB = checkCB;
        this.whens = whens;
        this.thens = thens;
    }
    async afterEach(store, key, cb) {
        return;
    }
    async check(subject, key, testResourceConfiguration, tester, artifactory, tLog) {
        tLog(`\n Check: ${this.name}`);
        const store = await this.checkThat(subject, testResourceConfiguration, artifactory);
        await this.checkCB(Object.entries(this.whens).reduce((a, [key, when]) => {
            a[key] = async (payload) => {
                return await when(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog);
            };
            return a;
        }, {}), Object.entries(this.thens).reduce((a, [key, then]) => {
            a[key] = async (payload) => {
                const t = await then(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog);
                tester(t);
            };
            return a;
        }, {}));
        await this.afterEach(store, key);
        return;
    }
}
exports.BaseCheck = BaseCheck;
class BaseBuilder {
    constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, logWriter, testResourceRequirement, testSpecification) {
        this.input = input;
        this.artifacts = [];
        this.testResourceRequirement = testResourceRequirement;
        this.suitesOverrides = suitesOverrides;
        this.givenOverides = givenOverides;
        this.whenOverides = whenOverides;
        this.thenOverides = thenOverides;
        this.checkOverides = checkOverides;
        const suites = testSpecification(this.Suites(), this.Given(), this.When(), this.Then(), this.Check(), logWriter);
        const suiteRunner = (suite) => async (testResourceConfiguration, tLog) => {
            return await suite.run(input, testResourceConfiguration, (fPath, value) => logWriter.testArtiFactoryfileWriter(tLog, (p) => {
                artifacts.push(p);
            })(testResourceConfiguration.fs + "/" + fPath, value), tLog);
        };
        const artifacts = this.artifacts;
        this.testJobs = suites.map((suite) => {
            const runner = suiteRunner(suite);
            return {
                test: suite,
                testResourceRequirement,
                toObj: () => {
                    return suite.toObj();
                },
                runner,
                receiveTestResourceConfig: async function (testResourceConfiguration = {
                    name: "",
                    fs: ".",
                    ports: [],
                    scheduled: false
                }) {
                    console.log(`testResourceConfiguration ${JSON.stringify(testResourceConfiguration, null, 2)}`);
                    await logWriter.mkdirSync(testResourceConfiguration.fs);
                    const logFilePath = (`${testResourceConfiguration.fs}/log.txt`);
                    const access = await logWriter.createWriteStream(logFilePath);
                    const tLog = (...l) => {
                        console.log(...l);
                        access.write(`${l.toString()}\n`);
                    };
                    const suiteDone = await runner(testResourceConfiguration, tLog);
                    const resultsFilePath = (`${testResourceConfiguration.fs}/results.json`);
                    logWriter.writeFileSync(resultsFilePath, JSON.stringify(suiteDone.toObj(), null, 2));
                    const logPromise = new Promise((res, rej) => {
                        access.on("finish", () => { res(true); });
                    });
                    access.end();
                    const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
                        // console.log(`suiteDone.givens[k].error`, suiteDone.givens[k].error);
                        return suiteDone.givens[k].error;
                    }).length;
                    console.log(`exiting gracefully with ${numberOfFailures} failures.`);
                    return {
                        failed: numberOfFailures,
                        artifacts,
                        logPromise
                    };
                },
            };
        });
    }
    Suites() {
        return this.suitesOverrides;
    }
    Given() {
        return this.givenOverides;
    }
    When() {
        return this.whenOverides;
    }
    Then() {
        return this.thenOverides;
    }
    Check() {
        return this.checkOverides;
    }
}
exports.BaseBuilder = BaseBuilder;
class ClassBuilder extends BaseBuilder {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement, logWriter) {
        const classySuites = Object.entries(testImplementation.Suites).reduce((a, [key], index) => {
            a[key] = (somestring, givens, checks) => {
                return new suiteKlasser.prototype.constructor(somestring, index, givens, checks);
            };
            return a;
        }, {});
        const classyGivens = Object.entries(testImplementation.Givens)
            .reduce((a, [key, givEn]) => {
            a[key] = (features, whens, thens, givEn) => {
                return new (givenKlasser.prototype).constructor(key, features, whens, thens, testImplementation.Givens[key], givEn);
            };
            return a;
        }, {});
        const classyWhens = Object.entries(testImplementation.Whens).reduce((a, [key, whEn]) => {
            a[key] = (payload) => {
                return new whenKlasser.prototype.constructor(`${whEn.name}: ${payload && payload.toString()}`, whEn(payload));
            };
            return a;
        }, {});
        const classyThens = Object.entries(testImplementation.Thens).reduce((a, [key, thEn]) => {
            a[key] = (expected, x) => {
                return new thenKlasser.prototype.constructor(`${thEn.name}: ${expected && expected.toString()}`, thEn(expected));
            };
            return a;
        }, {});
        const classyChecks = Object.entries(testImplementation.Checks).reduce((a, [key, z]) => {
            a[key] = (somestring, features, callback) => {
                return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
            };
            return a;
        }, {});
        super(input, classySuites, classyGivens, classyWhens, classyThens, classyChecks, logWriter, testResourceRequirement, testSpecification);
    }
}
exports.ClassBuilder = ClassBuilder;
