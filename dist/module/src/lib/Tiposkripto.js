/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseGiven } from "./BaseGiven";
import { BaseSuite } from "./BaseSuite";
import { BaseThen } from "./BaseThen.js";
import { BaseWhen } from "./BaseWhen.js";
import { DefaultAdapter, defaultTestResourceRequirement, } from "./index.js";
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
            a[key] = (
            // name: string,
            features, whens, thens, gcb, initialValues) => {
                // Debug the parameters being passed - check if features contains when-like objects
                // console.log(`[Tiposkripto] Creating Given ${key} with:`);
                // console.log(`  name: ${name}`);
                // console.log(`  features:`, features);
                // console.log(`  whens:`, whens);
                // console.log(`  thens:`, thens);
                // Ensure parameters are arrays and create copies to avoid reference issues
                const safeFeatures = Array.isArray(features) ? [...features] : [];
                const safeWhens = Array.isArray(whens) ? [...whens] : [];
                const safeThens = Array.isArray(thens) ? [...thens] : [];
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
                })(
                // name,
                safeFeatures, safeWhens, safeThens, testImplementation.givens[key], initialValues);
            };
            return a;
        }, {});
        const classyWhens = Object.entries(testImplementation.whens).reduce((a, [key, whEn]) => {
            a[key] = (...payload) => {
                const whenInstance = new (class extends BaseWhen {
                    async andWhen(store, whenCB, testResource, pm) {
                        return await fullAdapter.andWhen(store, whenCB, testResource, pm);
                    }
                })(`${key}: ${payload && payload.toString()}`, whEn(...payload));
                // console.log(`[Tiposkripto] Created When ${key}:`, whenInstance.name);
                return whenInstance;
            };
            return a;
        }, {});
        const classyThens = Object.entries(testImplementation.thens).reduce((a, [key, thEn]) => {
            a[key] = (...args) => {
                const thenInstance = new (class extends BaseThen {
                    async butThen(store, thenCB, testResource, pm) {
                        return await fullAdapter.butThen(store, thenCB, testResource, pm);
                    }
                })(`${key}: ${args && args.toString()}`, thEn(...args));
                // console.log(`[Tiposkripto] Created Then ${key}:`, thenInstance.name);
                return thenInstance;
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
        this.totalTests = this.calculateTotalTests();
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
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const tLog = async (...l) => {
                        //
                    };
                    try {
                        const suiteDone = await runner(puppetMaster, tLog);
                        const fails = suiteDone.fails;
                        // Always use PM.writeFileSync to write tests.json, not direct filesystem access
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
