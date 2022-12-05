import fs from "fs";
import { mapValues } from "lodash";
export class BaseSuite {
    constructor(name, givens = [], checks = []) {
        this.name = name;
        this.givens = givens;
        this.checks = checks;
    }
    async run(subject, testResourceConfiguration) {
        console.log("\nSuite:", this.name, testResourceConfiguration);
        for (const [ndx, givenThat] of this.givens.entries()) {
            await givenThat.give(subject, ndx, testResourceConfiguration);
        }
        for (const [ndx, checkThat] of this.checks.entries()) {
            await checkThat.check(subject, ndx, testResourceConfiguration);
        }
    }
}
export class BaseGiven {
    constructor(name, whens, thens) {
        this.name = name;
        this.whens = whens;
        this.thens = thens;
    }
    async teardown(subject, ndx) {
        return subject;
    }
    async give(subject, index, testResourceConfiguration) {
        console.log(`\n Given: ${this.name}`);
        const store = await this.givenThat(subject, testResourceConfiguration);
        for (const whenStep of this.whens) {
            await whenStep.test(store, testResourceConfiguration);
        }
        for (const thenStep of this.thens) {
            await thenStep.test(store, testResourceConfiguration);
        }
        await this.teardown(store, index);
        return;
    }
}
export class BaseWhen {
    constructor(name, actioner) {
        this.name = name;
        this.actioner = actioner;
    }
    async test(store, testResourceConfiguration) {
        console.log(" When:", this.name);
        return await this.andWhen(store, this.actioner, testResourceConfiguration);
    }
}
export class BaseThen {
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }
    async test(store, testResourceConfiguration) {
        console.log(" Then:", this.name);
        return this.callback(await this.butThen(store, testResourceConfiguration));
    }
}
export class BaseCheck {
    constructor(feature, callback, whens, thens) {
        this.feature = feature;
        this.callback = callback;
        this.whens = whens;
        this.thens = thens;
    }
    async teardown(subject) {
        return subject;
    }
    async check(subject, ndx, testResourceConfiguration) {
        console.log(`\n - \nCheck: ${this.feature}`);
        const store = await this.checkThat(subject, testResourceConfiguration);
        await this.callback(mapValues(this.whens, (when) => {
            return async (payload) => {
                return await when(payload, testResourceConfiguration).test(store, testResourceConfiguration);
            };
        }), mapValues(this.thens, (then) => {
            return async (payload) => {
                return await then(payload, testResourceConfiguration).test(store, testResourceConfiguration);
            };
        }));
        await this.teardown(store);
        return;
    }
}
//////////////////////////////////////////////////////////////////////////////////
class TesterantoBasic {
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
export class ClassySuite extends BaseSuite {
}
export class ClassyGiven extends BaseGiven {
    constructor(name, whens, thens, thing) {
        super(name, whens, thens);
        this.thing = thing;
    }
    givenThat() {
        return this.thing;
    }
}
export class ClassyWhen extends BaseWhen {
    andWhen(thing) {
        return this.actioner(thing);
    }
}
export class ClassyThen extends BaseThen {
    butThen(thing) {
        return thing;
    }
}
export class ClassyCheck extends BaseCheck {
    constructor(feature, callback, whens, thens, thing) {
        super(feature, callback, whens, thens);
        this.thing = thing;
    }
    checkThat() {
        return this.thing;
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////
export class TesterantoInterface {
}
export class Testeranto {
    constructor(testImplementation, testSpecification, store, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResource) {
        const classySuites = mapValues(testImplementation.Suites, (suite) => {
            return (somestring, givens, checks) => {
                return suiteKlasser(somestring, givens, checks);
            };
        });
        const classyGivens = mapValues(testImplementation.Givens, (z) => {
            return (feature, whens, thens, ...xtrasW) => {
                return givenKlasser(feature, whens, thens, z(...xtrasW));
            };
        });
        const classyWhens = mapValues(testImplementation.Whens, (whEn) => {
            return (payload) => {
                return whenKlasser(`${whEn.name}: ${payload && payload.toString()}`, whEn(payload));
            };
        });
        const classyThens = mapValues(testImplementation.Thens, (thEn) => {
            return (expected, x) => {
                return thenKlasser(`${thEn.name}: ${expected && expected.toString()}`, thEn(expected));
            };
        });
        const classyChecks = mapValues(testImplementation.Checks, (z) => {
            return (somestring, callback) => {
                return checkKlasser(somestring, callback, classyWhens, classyThens);
            };
        });
        class MetaTesteranto extends TesterantoBasic {
        }
        const classyTesteranto = new MetaTesteranto(store, classySuites, classyGivens, classyWhens, classyThens, classyChecks);
        const t = testSpecification(
        /* @ts-ignore:next-line */
        classyTesteranto.Suites(), classyTesteranto.Given(), classyTesteranto.When(), classyTesteranto.Then(), classyTesteranto.Check());
        return t.map((tt) => {
            return {
                test: tt,
                testResource,
                runner: async (testResourceConfiguration) => {
                    await tt.run(store, testResourceConfiguration[testResource]);
                },
            };
        });
    }
}
const processPortyTests = async (tests, ports) => {
    let testsStack = tests;
    return (await Promise.all(ports.map(async (port) => {
        return await new Promise((res, rej) => {
            const popper = async (payload) => {
                if (testsStack.length === 0) {
                    res(payload);
                }
                else {
                    const suite = testsStack.pop();
                    try {
                        await (suite === null || suite === void 0 ? void 0 : suite.runner({ port }));
                        popper([
                            ...payload,
                            {
                                test: suite === null || suite === void 0 ? void 0 : suite.test,
                                status: "pass",
                            },
                        ]);
                    }
                    catch (e) {
                        console.error(e);
                        popper([
                            ...payload,
                            {
                                test: suite === null || suite === void 0 ? void 0 : suite.test,
                                status: e,
                            },
                        ]);
                    }
                }
            };
            popper([]);
        });
    }))).flat();
};
export const reporter = async (tests, testResources) => {
    Promise.all(tests).then(async (x) => {
        const suites = x.flat();
        const testsWithoutResources = suites
            .filter((s) => !s.testResource)
            .map(async (suite) => {
            let status;
            try {
                await suite.runner({});
                status = "pass";
            }
            catch (e) {
                console.error(e);
                status = e;
            }
            return {
                test: suite.test,
                status,
            };
        });
        const portTestresults = await processPortyTests(suites.filter((s) => s.testResource === "port"), testResources.ports);
        Promise.all([...testsWithoutResources, ...portTestresults]).then((result) => {
            fs.writeFile("./dist/testerantoResults.txt", JSON.stringify(result, null, 2), (err) => {
                if (err) {
                    console.error(err);
                }
                const failures = result.filter((r) => r.status != "pass");
                if (failures.length) {
                    console.warn(`❌ You have failing tests: ${JSON.stringify(failures.map((f) => f.test.name))}`);
                    process.exit(-1);
                }
                else {
                    console.log("✅ All tests passed ");
                    process.exit(0);
                }
            });
        });
    });
};
