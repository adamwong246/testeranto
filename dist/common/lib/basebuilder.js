"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBuilder = void 0;
class BaseBuilder {
    constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, logWriter, testResourceRequirement, testSpecification) {
        this.input = input;
        this.artifacts = [];
        this.artifacts = [];
        this.testResourceRequirement = testResourceRequirement;
        this.suitesOverrides = suitesOverrides;
        this.givenOverides = givenOverides;
        this.whenOverides = whenOverides;
        this.thenOverides = thenOverides;
        this.checkOverides = checkOverides;
        this.testSpecification = testSpecification;
        this.specs = testSpecification(this.Suites(), this.Given(), this.When(), this.Then(), this.Check());
        const suiteRunner = (suite, utils) => async (testResourceConfiguration, tLog, utils) => {
            return await suite.run(input, testResourceConfiguration, (fPath, value) => logWriter.testArtiFactoryfileWriter(tLog, (p) => {
                this.artifacts.push(p);
            })(testResourceConfiguration.fs + "/" + fPath, value), tLog, utils);
        };
        this.testJobs = this.specs.map((suite, utils) => {
            const runner = suiteRunner(suite, utils);
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
                    scheduled: false,
                }, y) {
                    console.log(`testResourceConfiguration ${JSON.stringify(testResourceConfiguration, null, 2)}`);
                    // await logWriter.mkdirSync(testResourceConfiguration.fs);
                    //  if (!fs.existsSync(destFolder)) {
                    //    fs.mkdirSync(destFolder, { recursive: true });
                    //  }
                    logWriter.writeFileSync(`${testResourceConfiguration.fs}/tests.json`, JSON.stringify(this.toObj(), null, 2));
                    const logFilePath = `${testResourceConfiguration.fs}/log.txt`;
                    const access = await logWriter.createWriteStream(logFilePath);
                    const tLog = (...l) => {
                        // console.log(...l);
                        access.write(`${l.toString()}\n`);
                    };
                    const suiteDone = await runner(testResourceConfiguration, tLog, y);
                    const logPromise = new Promise((res, rej) => {
                        access.on("finish", () => {
                            res(true);
                        });
                    });
                    access.end();
                    const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
                        return suiteDone.givens[k].error;
                    }).length;
                    logWriter.writeFileSync(`${testResourceConfiguration.fs}/exitcode`, numberOfFailures.toString());
                    console.log(`exiting gracefully with ${numberOfFailures} failures.`);
                    return {
                        failed: numberOfFailures,
                        artifacts: this.artifacts || [],
                        logPromise,
                    };
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
    Check() {
        return this.checkOverides;
    }
}
exports.BaseBuilder = BaseBuilder;
