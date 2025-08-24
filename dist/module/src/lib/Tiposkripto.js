/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defaultTestResourceRequirement, DefaultAdapter, } from "./index.js";
import { BaseGiven } from "./BaseGiven";
import { BaseWhen } from "./BaseWhen.js";
import { BaseThen } from "./BaseThen.js";
import { BaseSuite } from "./BaseSuite";
export default class Tiposkripto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testAdapter = {}, uberCatcher = (cb) => cb()) {
        this.artifacts = [];
        const fullAdapter = DefaultAdapter(testAdapter);
        // Create classy implementations
        const classySuites = Object.entries(testImplementation.suites).reduce((a, [key], index) => {
            a[key] = (somestring, givens) => {
                return new (class extends BaseSuite {
                    afterAll(store, artifactory, pm) {
                        return fullAdapter.afterAll(store, pm);
                    }
                    assertThat(t) {
                        return fullAdapter.assertThis(t);
                    }
                    async setup(s, artifactory, tr, pm) {
                        var _a, _b;
                        return ((_b = (_a = fullAdapter.beforeAll) === null || _a === void 0 ? void 0 : _a.call(fullAdapter, s, tr, pm)) !== null && _b !== void 0 ? _b : s);
                    }
                })(somestring, index, givens);
            };
            return a;
        }, {});
        const classyGivens = Object.entries(testImplementation.givens).reduce((a, [key, g]) => {
            a[key] = (name, features, whens, thens, gcb, initialValues) => {
                return new (class extends BaseGiven {
                    constructor() {
                        super(...arguments);
                        this.uberCatcher = uberCatcher;
                    }
                    async givenThat(subject, testResource, artifactory, initializer, initialValues, pm) {
                        return fullAdapter.beforeEach(subject, initializer, testResource, initialValues, pm);
                    }
                    afterEach(store, key, artifactory, pm) {
                        return Promise.resolve(fullAdapter.afterEach(store, key, pm));
                    }
                })(name, features, whens, thens, testImplementation.givens[key], initialValues);
            };
            return a;
        }, {});
        const classyWhens = Object.entries(testImplementation.whens).reduce((a, [key, whEn]) => {
            a[key] = (...payload) => {
                return new (class extends BaseWhen {
                    async andWhen(store, whenCB, testResource, pm) {
                        return await fullAdapter.andWhen(store, whenCB, testResource, pm);
                    }
                })(`${key}: ${payload && payload.toString()}`, whEn(...payload));
            };
            return a;
        }, {});
        const classyThens = Object.entries(testImplementation.thens).reduce((a, [key, thEn]) => {
            a[key] = (...args) => {
                return new (class extends BaseThen {
                    async butThen(store, thenCB, testResource, pm) {
                        return await fullAdapter.butThen(store, thenCB, testResource, pm);
                    }
                })(`${key}: ${args && args.toString()}`, thEn(...args));
            };
            return a;
        }, {});
        // Set up the overrides
        this.suitesOverrides = classySuites;
        this.givenOverides = classyGivens;
        this.whenOverides = classyWhens;
        this.thenOverides = classyThens;
        this.testResourceRequirement = testResourceRequirement;
        this.testSpecification = testSpecification;
        // Generate specs
        this.specs = testSpecification(this.Suites(), this.Given(), this.When(), this.Then());
        // Create test jobs
        this.testJobs = this.specs.map((suite) => {
            const suiteRunner = (suite) => async (puppetMaster, tLog) => {
                try {
                    const x = await suite.run(input, puppetMaster.testResourceConfiguration, (fPath, value) => puppetMaster.testArtiFactoryfileWriter(tLog, (p) => {
                        this.artifacts.push(p);
                    })(puppetMaster.testResourceConfiguration.fs + "/" + fPath, value), tLog, puppetMaster);
                    return x;
                }
                catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            };
            const runner = suiteRunner(suite);
            return {
                test: suite,
                toObj: () => {
                    return suite.toObj();
                },
                runner,
                receiveTestResourceConfig: async function (puppetMaster) {
                    const tLog = async (...l) => {
                        //
                    };
                    try {
                        const suiteDone = await runner(puppetMaster, tLog);
                        const fails = suiteDone.fails;
                        await puppetMaster.writeFileSync(`tests.json`, JSON.stringify(this.toObj(), null, 2), "test");
                        return {
                            failed: fails > 0,
                            fails,
                            artifacts: this.artifacts || [],
                            features: suiteDone.features(),
                        };
                    }
                    catch (e) {
                        console.error(e.stack);
                        return {
                            failed: true,
                            fails: -1,
                            artifacts: this.artifacts || [],
                            features: [],
                        };
                    }
                },
            };
        });
    }
    Specs() {
        return this.specs;
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
    // Add a method to access test jobs which can be used by receiveTestResourceConfig
    getTestJobs() {
        return this.testJobs;
    }
}
