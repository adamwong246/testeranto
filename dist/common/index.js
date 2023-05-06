"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TesterantoLevelOne = exports.TesterantoLevelZero = exports.BaseCheck = exports.BaseThen = exports.BaseWhen = exports.BaseGiven = exports.BaseSuite = exports.ITProject = exports.TesterantoGraphUndirected = exports.TesterantoGraphDirectedAcyclic = exports.TesterantoGraphDirected = exports.TesterantoFeatures = exports.BaseFeature = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Features_js_1 = require("./Features.js");
Object.defineProperty(exports, "BaseFeature", { enumerable: true, get: function () { return Features_js_1.BaseFeature; } });
Object.defineProperty(exports, "TesterantoFeatures", { enumerable: true, get: function () { return Features_js_1.TesterantoFeatures; } });
Object.defineProperty(exports, "TesterantoGraphDirected", { enumerable: true, get: function () { return Features_js_1.TesterantoGraphDirected; } });
Object.defineProperty(exports, "TesterantoGraphDirectedAcyclic", { enumerable: true, get: function () { return Features_js_1.TesterantoGraphDirectedAcyclic; } });
Object.defineProperty(exports, "TesterantoGraphUndirected", { enumerable: true, get: function () { return Features_js_1.TesterantoGraphUndirected; } });
const Project_js_1 = require("./Project.js");
Object.defineProperty(exports, "ITProject", { enumerable: true, get: function () { return Project_js_1.ITProject; } });
const defaultTestResource = { fs: ".", ports: [] };
const defaultTestResourceRequirement = {
    fs: ".",
    ports: 0,
};
const fPaths = [];
const testArtiFactoryfileWriter = (tLog) => (fp) => (givenNdx) => (key, value) => {
    tLog("testArtiFactory =>", key);
    const fPath = `${fp}/${givenNdx}/${key}`;
    const cleanPath = path_1.default.resolve(fPath);
    fPaths.push(cleanPath.replace(process.cwd(), ``));
    const targetDir = cleanPath.split("/").slice(0, -1).join("/");
    fs_1.default.mkdir(targetDir, { recursive: true }, async (error) => {
        if (error) {
            console.error(`❗️testArtiFactory failed`, targetDir, error);
        }
        fs_1.default.writeFileSync(path_1.default.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"), fPaths.join(`\n`), {
            encoding: "utf-8",
        });
        if (Buffer.isBuffer(value)) {
            fs_1.default.writeFileSync(fPath, value, "binary");
        }
        else if (`string` === typeof value) {
            fs_1.default.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8",
            });
        }
        else {
            /* @ts-ignore:next-line */
            const pipeStream = value;
            var myFile = fs_1.default.createWriteStream(fPath);
            pipeStream.pipe(myFile);
            pipeStream.on("close", () => {
                myFile.close();
            });
        }
    });
};
class BaseSuite {
    constructor(name, givens = [], checks = []) {
        this.name = name;
        this.givens = givens;
        this.checks = checks;
        this.fails = [];
    }
    toObj() {
        return {
            name: this.name,
            givens: this.givens.map((g) => g.toObj()),
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
        const subject = await this.setup(input, artifactory("-1"));
        tLog("\nSuite:", this.name, testResourceConfiguration);
        for (const [ndx, giver] of this.givens.entries()) {
            try {
                this.store = await giver.give(subject, ndx, testResourceConfiguration, this.test, artifactory(ndx.toString()), tLog);
            }
            catch (e) {
                console.error(e);
                this.fails.push(giver);
                return this;
            }
        }
        for (const [ndx, thater] of this.checks.entries()) {
            await thater.check(subject, ndx, testResourceConfiguration, this.test, artifactory, tLog);
        }
        // @TODO fix me
        for (const [ndx, giver] of this.givens.entries()) {
            giver.afterAll(this.store, artifactory);
        }
        ////////////////
        return this;
    }
}
exports.BaseSuite = BaseSuite;
///////////////////////////////////////////////////////////////////////////////////////////////////////////
class BaseGiven {
    constructor(name, features, whens, thens) {
        this.name = name;
        this.features = features;
        this.whens = whens;
        this.thens = thens;
    }
    afterAll(store, artifactory) {
        return;
    }
    toObj() {
        return {
            name: this.name,
            whens: this.whens.map((w) => w.toObj()),
            thens: this.thens.map((t) => t.toObj()),
            errors: this.error,
            features: this.features,
        };
    }
    async afterEach(store, ndx, artifactory) {
        return;
    }
    async give(subject, index, testResourceConfiguration, tester, artifactory, tLog) {
        tLog(`\n Given: ${this.name}`);
        try {
            this.store = await this.givenThat(subject, testResourceConfiguration, artifactory);
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
            tLog("\u0007"); // bell
            // throw e;
        }
        finally {
            try {
                await this.afterEach(this.store, index, artifactory);
            }
            catch (_a) {
                console.error("afterEach failed! no error will be recorded!");
            }
        }
        return this.store;
    }
}
exports.BaseGiven = BaseGiven;
class BaseWhen {
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
            return this.thenCB(await this.butThen(store, testResourceConfiguration));
        }
        catch (e) {
            console.log("wtf");
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
exports.BaseThen = BaseThen;
class BaseCheck {
    constructor(name, features, checkCB, whens, thens) {
        this.name = name;
        this.features = features;
        this.checkCB = checkCB;
        this.whens = whens;
        this.thens = thens;
    }
    async afterEach(store, ndx, cb) {
        return;
    }
    async check(subject, ndx, testResourceConfiguration, tester, artifactory, tLog) {
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
        await this.afterEach(store, ndx);
        return;
    }
}
exports.BaseCheck = BaseCheck;
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
exports.TesterantoLevelZero = TesterantoLevelZero;
class TesterantoLevelOne {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement, nameKey) {
        const classySuites = Object.entries(testImplementation.Suites).reduce((a, [key]) => {
            a[key] = (somestring, givens, checks) => {
                return new suiteKlasser.prototype.constructor(somestring, givens, checks);
            };
            return a;
        }, {});
        const classyGivens = Object.entries(testImplementation.Givens).reduce((a, [key, z]) => {
            a[key] = (features, whens, thens, ...xtrasW) => {
                return new givenKlasser.prototype.constructor(z.name, features, whens, thens, z(...xtrasW));
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
        classyTesteranto.Suites(), classyTesteranto.Given(), classyTesteranto.When(), classyTesteranto.Then(), classyTesteranto.Check());
        const suiteRunner = (suite) => (testResourceConfiguration, tLog) => {
            return suite.run(input, testResourceConfiguration, testArtiFactoryfileWriter(tLog)(testResourceConfiguration.fs + "/"), tLog);
        };
        /* @ts-ignore:next-line */
        const toReturn = suites.map((suite) => {
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
                    await fs_1.default.mkdirSync(testResourceConfiguration.fs, { recursive: true });
                    const logFilePath = path_1.default.resolve(`${testResourceConfiguration.fs}/log.txt`);
                    var access = fs_1.default.createWriteStream(logFilePath);
                    const tLog = (...l) => {
                        console.log(...l);
                        access.write(`${l.toString()}\n`);
                    };
                    const suiteDone = await runner(testResourceConfiguration, tLog);
                    const resultsFilePath = path_1.default.resolve(`${testResourceConfiguration.fs}/results.json`);
                    fs_1.default.writeFileSync(resultsFilePath, JSON.stringify(suiteDone.toObj(), null, 2));
                    access.close();
                    const numberOfFailures = suiteDone.givens.filter((g) => g.error).length;
                    console.log(`exiting gracefully with ${numberOfFailures} failures.`);
                    process.exitCode = numberOfFailures;
                },
            };
        });
        return toReturn;
    }
}
exports.TesterantoLevelOne = TesterantoLevelOne;
exports.default = async (input, testSpecification, testImplementation, testInterface, nameKey, testResourceRequirement = defaultTestResourceRequirement) => {
    const butThen = testInterface.butThen || (async (a) => a);
    const { andWhen } = testInterface;
    const actionHandler = testInterface.actionHandler ||
        function (b) {
            return b;
        };
    const assertioner = testInterface.assertioner || (async (t) => t);
    const beforeAll = testInterface.beforeAll || (async (input) => input);
    const beforeEach = testInterface.beforeEach ||
        async function (subject, initialValues, testResource) {
            return subject;
        };
    const afterEach = testInterface.afterEach || (async (s) => s);
    const afterAll = testInterface.afterAll || ((store) => undefined);
    class MrT extends TesterantoLevelOne {
        constructor() {
            super(testImplementation, 
            /* @ts-ignore:next-line */
            testSpecification, input, class extends BaseSuite {
                async setup(s, artifactory) {
                    return beforeAll(s, artifactory);
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
                    return beforeEach(subject, this.initialValues, testResource, artifactory);
                }
                afterEach(store, ndx, artifactory) {
                    return new Promise((res) => res(afterEach(store, ndx, artifactory)));
                }
                afterAll(store, artifactory) {
                    return afterAll(store, artifactory);
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
                    return beforeEach(subject, this.initialValues, testResourceConfiguration, artifactory);
                }
                afterEach(store, ndx, artifactory) {
                    return new Promise((res) => res(afterEach(store, ndx, artifactory)));
                }
            }, testResourceRequirement, nameKey);
        }
    }
    const mrt = new MrT();
    const t = mrt[0];
    console.log("mark 3", process.argv);
    const testResourceArg = process.argv[2] || `{}`;
    console.log("mark 2", testResourceArg);
    // process.exit();
    try {
        console.log("mark", testResourceArg);
        const partialTestResource = JSON.parse(testResourceArg);
        if (partialTestResource.fs && partialTestResource.ports) {
            await t.receiveTestResourceConfig(partialTestResource);
            // process.exit(0); // :-)
        }
        else {
            console.log("test configuration is incomplete");
            if (process.send) {
                console.log("requesting test resources from pm2 ...", testResourceRequirement);
                /* @ts-ignore:next-line */
                process.send({
                    type: "testeranto:hola",
                    data: {
                        testResourceRequirement,
                    },
                });
                console.log("awaiting test resources from pm2...");
                process.on("message", async function (packet) {
                    console.log("message: ", packet);
                    const resourcesFromPm2 = packet.data.testResourceConfiguration;
                    const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
                    console.log("secondTestResource", secondTestResource);
                    if (await t.receiveTestResourceConfig(secondTestResource)) {
                        /* @ts-ignore:next-line */
                        process.send({
                            type: "testeranto:adios",
                            data: {
                                testResourceConfiguration: mrt[0].test.testResourceConfiguration,
                                results: mrt[0].toObj(),
                            },
                        }, (err) => {
                            if (!err) {
                                console.log(`✅`);
                            }
                            else {
                                console.error(`❗️`, err);
                            }
                            // process.exit(0); // :-)
                        });
                    }
                });
            }
            else {
                console.log("Pass run-time test resources by STDIN");
                process.stdin.on("data", async (data) => {
                    console.log("data: ", data);
                    const resourcesFromStdin = JSON.parse(data.toString());
                    const secondTestResource = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(resourcesFromStdin))), JSON.parse(JSON.stringify(partialTestResource)));
                    await t.receiveTestResourceConfig(secondTestResource);
                    // process.exit(0); // :-)
                });
            }
        }
    }
    catch (e) {
        console.error(`the test resource passed by command-line argument "${process.argv[2]}" was malformed.`);
        console.error(e);
        process.exit(-1);
    }
};
