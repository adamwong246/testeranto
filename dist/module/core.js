const defaultTestResource = { name: "", fs: ".", ports: [] };
export const defaultTestResourceRequirement = {
    ports: 0
};
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////
export class BaseGiven {
    constructor(name, features, whens, thens) {
        this.name = name;
        this.features = features;
        this.whens = whens;
        this.thens = thens;
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
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory);
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
    async test(store, testResourceConfiguration, tLog) {
        tLog(" When:", this.name);
        try {
            return await this.andWhen(store, this.actioner, testResourceConfiguration);
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
    async test(store, testResourceConfiguration, tLog) {
        tLog(" Then:", this.name);
        try {
            return this.thenCB(await this.butThen(store, testResourceConfiguration));
        }
        catch (e) {
            console.log("test failed", e);
            this.error = true;
            throw e;
        }
        // try {
        //   return await (this.thenCB(
        //     await (async () => {
        //       try {
        //         return await (
        //           (() => {
        //             try {
        //               return this.butThen(store, testResourceConfiguration)
        //             } catch (e) {
        //               this.error = true;
        //               throw e
        //             }
        //           })()
        //         );
        //       } catch (e) {
        //         this.error = true;
        //         throw e
        //       }
        //     })()
        //   ));
        // } catch (e) {
        //   this.error = true;
        //   throw e
        // }
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////
class TesterantoLevelZero {
    constructor(cc, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides) {
        this.cc = cc;
        this.constructorator = cc;
        this.suitesOverrides = suitesOverrides;
        this.givenOverides = givenOverides;
        this.whenOverides = whenOverides;
        this.thenOverides = thenOverides;
        this.checkOverides = checkOverides;
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////
class TesterantoLevelOne {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement, logWriter) {
        this.artifacts = [];
        const classySuites = Object.entries(testImplementation.Suites).reduce((a, [key], index) => {
            a[key] = (somestring, givens, checks) => {
                return new suiteKlasser.prototype.constructor(somestring, index, givens, checks);
            };
            return a;
        }, {});
        const classyGivens = Object.keys(testImplementation.Givens)
            .reduce((a, key) => {
            a[key] = (features, whens, thens, ...xtrasW) => {
                return new givenKlasser.prototype.constructor(key, features, whens, thens, testImplementation.Givens[key](...xtrasW));
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
        const classyTesteranto = new (class extends TesterantoLevelZero {
        })(input, classySuites, classyGivens, classyWhens, classyThens, classyChecks);
        const suites = testSpecification(
        /* @ts-ignore:next-line */
        classyTesteranto.Suites(), classyTesteranto.Given(), classyTesteranto.When(), classyTesteranto.Then(), classyTesteranto.Check(), logWriter);
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
                receiveTestResourceConfig: async function (testResourceConfiguration = defaultTestResource) {
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
}
////////////////////////////////////////////////////////////////////////////////////////////////
export default class TesterantoLevelTwo extends TesterantoLevelOne {
    constructor(input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement, assertioner, beforeEach, afterEach, afterAll, butThen, andWhen, actionHandler, logWriter) {
        super(testImplementation, testSpecification, input, class extends BaseSuite {
            async setup(s, artifactory) {
                return (testInterface.beforeAll || (async (input, artificer) => input))(s, artifactory, this.testResourceConfiguration);
            }
            test(t) {
                return assertioner(t);
            }
        }, class Given extends BaseGiven {
            constructor(name, features, whens, thens, initialValues) {
                super(name, features, whens, thens);
                this.initialValues = initialValues;
            }
            async givenThat(subject, testResource, artifactory) {
                return beforeEach(subject, this.initialValues, testResource, (fPath, value) => 
                // TODO does not work?
                artifactory(`beforeEach/${fPath}`, value));
            }
            afterEach(store, key, artifactory) {
                return new Promise((res) => res(afterEach(store, key, (fPath, value) => artifactory(`after/${fPath}`, value))));
            }
            afterAll(store, artifactory) {
                return afterAll(store, (fPath, value) => 
                // TODO does not work?
                artifactory(`afterAll4-${this.name}/${fPath}`, value));
            }
        }, class When extends BaseWhen {
            constructor(name, actioner, payload) {
                super(name, (store) => {
                    return actionHandler(actioner);
                });
                this.payload = payload;
            }
            async andWhen(store, actioner, testResource) {
                return await andWhen(store, actioner, testResource);
            }
        }, class Then extends BaseThen {
            constructor(name, callback) {
                super(name, callback);
            }
            async butThen(store, testResourceConfiguration) {
                return await butThen(store, this.thenCB, testResourceConfiguration);
            }
        }, class Check extends BaseCheck {
            constructor(name, features, checkCallback, whens, thens, initialValues) {
                super(name, features, checkCallback, whens, thens);
                this.initialValues = initialValues;
            }
            async checkThat(subject, testResourceConfiguration, artifactory) {
                return beforeEach(subject, this.initialValues, testResourceConfiguration, (fPath, value) => artifactory(`before/${fPath}`, value));
            }
            afterEach(store, key, artifactory) {
                return new Promise((res) => res(afterEach(store, key, (fPath, value) => 
                // TODO does not work?
                artifactory(`afterEach2-${this.name}/${fPath}`, value))));
            }
        }, testResourceRequirement, logWriter);
    }
}
