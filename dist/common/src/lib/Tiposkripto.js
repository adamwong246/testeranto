"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
const BaseGiven_1 = require("./BaseGiven");
const BaseWhen_js_1 = require("./BaseWhen.js");
const BaseThen_js_1 = require("./BaseThen.js");
const BaseSuite_1 = require("./BaseSuite");
class Tiposkripto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = index_js_1.defaultTestResourceRequirement, testAdapter = {}, uberCatcher = (cb) => cb()) {
        this.artifacts = [];
        const fullAdapter = (0, index_js_1.DefaultAdapter)(testAdapter);
        // Create classy implementations
        const classySuites = Object.entries(testImplementation.suites).reduce((a, [key], index) => {
            a[key] = (somestring, givens) => {
                return new (class extends BaseSuite_1.BaseSuite {
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
                return new (class extends BaseGiven_1.BaseGiven {
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
                return new (class extends BaseWhen_js_1.BaseWhen {
                    async andWhen(store, whenCB, testResource, pm) {
                        return await fullAdapter.andWhen(store, whenCB, testResource, pm);
                    }
                })(`${key}: ${payload && payload.toString()}`, whEn(...payload));
            };
            return a;
        }, {});
        const classyThens = Object.entries(testImplementation.thens).reduce((a, [key, thEn]) => {
            a[key] = (...args) => {
                return new (class extends BaseThen_js_1.BaseThen {
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
        // Calculate total number of tests (sum of all Givens across all Suites)
        // Each suite should have a 'givens' property that's a record of test names to BaseGiven instances
        this.totalTests = this.calculateTotalTests();
        console.log(`Total tests calculated: ${this.totalTests}`);
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
                            tests: 0, // Keep existing field
                            runTimeTests: this.totalTests, // Add the total number of tests
                        };
                    }
                    catch (e) {
                        console.error(e.stack);
                        return {
                            failed: true,
                            fails: -1,
                            artifacts: this.artifacts || [],
                            features: [],
                            tests: 0, // Keep existing field
                            runTimeTests: -1, // Set to -1 on hard error
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
    calculateTotalTests() {
        let total = 0;
        for (const suite of this.specs) {
            if (suite && typeof suite === 'object') {
                // Access the givens property which should be a record of test names to BaseGiven instances
                // The givens property is typically on the suite instance
                if ('givens' in suite) {
                    const givens = suite.givens;
                    if (givens && typeof givens === 'object') {
                        total += Object.keys(givens).length;
                    }
                }
            }
        }
        return total;
    }
}
exports.default = Tiposkripto;
