import { DefaultAdapter } from "./index.js";
import { BaseGiven } from "./BaseGiven";
import { BaseSuite } from "./BaseSuite";
import { BaseThen } from "./BaseThen";
import { BaseWhen } from "./BaseWhen";
import { defaultTestResourceRequirement } from "./types.js";
export default class BaseTiposkripto {
    constructor(webOrNode, input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testAdapter = {}, testResourceConfiguration, wsPort = "3456", wsHost = "localhost") {
        this.totalTests = 0;
        this.artifacts = [];
        this.testResourceConfiguration = testResourceConfiguration;
        const fullAdapter = DefaultAdapter(testAdapter);
        if (!testImplementation.suites ||
            typeof testImplementation.suites !== "object") {
            throw new Error(`testImplementation.suites must be an object, got ${typeof testImplementation.suites}: ${JSON.stringify(testImplementation.suites)}`);
        }
        const classySuites = Object.entries(testImplementation.suites).reduce((a, [key], index) => {
            a[key] = (somestring, givens) => {
                return new (class extends BaseSuite {
                    afterAll(store) {
                        return fullAdapter.afterAll(store);
                    }
                    assertThat(t) {
                        return fullAdapter.assertThis(t);
                    }
                    async setup(s, tr) {
                        var _a, _b;
                        return ((_b = (_a = fullAdapter.beforeAll) === null || _a === void 0 ? void 0 : _a.call(fullAdapter, s, tr)) !== null && _b !== void 0 ? _b : s);
                    }
                })(somestring, index, givens);
            };
            return a;
        }, {});
        const classyGivens = Object.entries(testImplementation.givens).reduce((a, [key, g]) => {
            a[key] = (features, whens, thens, gcb, initialValues) => {
                // WTF
                // Ensure parameters are arrays and create copies to avoid reference issues
                const safeFeatures = Array.isArray(features) ? [...features] : [];
                const safeWhens = Array.isArray(whens) ? [...whens] : [];
                const safeThens = Array.isArray(thens) ? [...thens] : [];
                return new (class extends BaseGiven {
                    async givenThat(subject, testResource, initializer, initialValues) {
                        return fullAdapter.beforeEach(subject, initializer, testResource, initialValues);
                    }
                    afterEach(store, key) {
                        return Promise.resolve(fullAdapter.afterEach(store, key));
                    }
                })(safeFeatures, safeWhens, safeThens, testImplementation.givens[key], initialValues);
            };
            return a;
        }, {});
        const classyWhens = Object.entries(testImplementation.whens).reduce((a, [key, whEn]) => {
            a[key] = (...payload) => {
                const whenInstance = new (class extends BaseWhen {
                    async andWhen(store, whenCB, testResource) {
                        return await fullAdapter.andWhen(store, whenCB, testResource);
                    }
                })(`${key}: ${payload && payload.toString()}`, whEn(...payload));
                return whenInstance;
            };
            return a;
        }, {});
        const classyThens = Object.entries(testImplementation.thens).reduce((a, [key, thEn]) => {
            a[key] = (...args) => {
                const thenInstance = new (class extends BaseThen {
                    async butThen(store, thenCB, testResource) {
                        return await fullAdapter.butThen(store, thenCB, testResource);
                    }
                })(`${key}: ${args && args.toString()}`, thEn(...args));
                return thenInstance;
            };
            return a;
        }, {});
        this.suitesOverrides = classySuites;
        this.givenOverrides = classyGivens;
        this.whenOverrides = classyWhens;
        this.thenOverrides = classyThens;
        this.testResourceRequirement = testResourceRequirement;
        this.testSpecification = testSpecification;
        this.specs = testSpecification(this.Suites(), this.Given(), this.When(), this.Then());
        this.totalTests = this.calculateTotalTests();
        this.testJobs = this.specs.map((suite) => {
            const suiteRunner = (suite) => async (testResourceConfiguration) => {
                try {
                    const x = await suite.run(input, testResourceConfiguration || {
                        name: suite.name,
                        fs: process.cwd(),
                        ports: [],
                        timeout: 30000,
                        retries: 3,
                        environment: {},
                    });
                    return x;
                }
                catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            };
            const runner = suiteRunner(suite);
            const totalTests = this.totalTests;
            const testJob = {
                test: suite,
                toObj: () => {
                    return suite.toObj();
                },
                runner,
                receiveTestResourceConfig: async (testResourceConfiguration) => {
                    try {
                        const suiteDone = await runner(testResourceConfiguration);
                        const fails = suiteDone.fails;
                        return {
                            failed: fails > 0,
                            fails,
                            artifacts: [], // this.artifacts is not accessible here
                            features: suiteDone.features(),
                            tests: 0,
                            runTimeTests: totalTests,
                            testJob: testJob.toObj(),
                        };
                    }
                    catch (e) {
                        console.error(e.stack);
                        return {
                            failed: true,
                            fails: -1,
                            artifacts: [],
                            features: [],
                            tests: 0,
                            runTimeTests: -1,
                            testJob: testJob.toObj(),
                        };
                    }
                },
            };
            return testJob;
        });
        this.testJobs[0].receiveTestResourceConfig(testResourceConfiguration).then((results) => {
            // The actual path is determined by the concrete implementation (Node.ts or Web.ts)
            // They will write to the correct pattern: testeranto/reports/allTests/example/${runtime}.Calculator.test.ts.json
            // We just pass a placeholder filename webOrNode
            this.writeFileSync(`testeranto/reports/allTests/example/${webOrNode}/Calculator.test.ts.json`, JSON.stringify(results));
        });
    }
    async receiveTestResourceConfig(testResourceConfig) {
        if (this.testJobs && this.testJobs.length > 0) {
            return this.testJobs[0].receiveTestResourceConfig(testResourceConfig);
        }
        else {
            throw new Error("No test jobs available");
        }
    }
    Specs() {
        return this.specs;
    }
    Suites() {
        if (!this.suitesOverrides) {
            throw new Error(`suitesOverrides is undefined. classySuites: ${JSON.stringify(Object.keys(this.suitesOverrides || {}))}`);
        }
        return this.suitesOverrides;
    }
    Given() {
        return this.givenOverrides;
    }
    When() {
        return this.whenOverrides;
    }
    Then() {
        return this.thenOverrides;
    }
    // Add a method to access test jobs which can be used by receiveTestResourceConfig
    getTestJobs() {
        return this.testJobs;
    }
    calculateTotalTests() {
        let total = 0;
        for (const suite of this.specs) {
            if (suite && typeof suite === "object") {
                // Access the givens property which should be a record of test names to BaseGiven instances
                // The givens property is typically on the suite instance
                if ("givens" in suite) {
                    const givens = suite.givens;
                    if (givens && typeof givens === "object") {
                        total += Object.keys(givens).length;
                    }
                }
            }
        }
        return total;
    }
}
