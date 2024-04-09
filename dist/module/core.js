import { BaseWhen, BaseThen, BaseCheck, BaseSuite, BaseGiven } from "./base";
import { defaultTestResourceRequirement } from "./lib";
class BaseBuilder {
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
class ClassBuilder {
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
                // const f = testImplementation.Givens[key](...xtrasW);
                return new givenKlasser.prototype.constructor(key, features, whens, thens, ((phunkshun) => {
                })(testImplementation.Givens[key]));
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
        const classyTesteranto = new (class extends BaseBuilder {
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
}
export default class Testeranto extends ClassBuilder {
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
