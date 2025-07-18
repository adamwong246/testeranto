"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBuilder = void 0;
class BaseBuilder {
    constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, testResourceRequirement, testSpecification) {
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
        this.testJobs = this.specs.map((suite) => {
            const suiteRunner = (suite) => async (puppetMaster, tLog) => {
                const x = await suite.run(input, puppetMaster.testResourceConfiguration, (fPath, value) => puppetMaster.testArtiFactoryfileWriter(tLog, (p) => {
                    this.artifacts.push(p);
                })(puppetMaster.testResourceConfiguration.fs + "/" + fPath, value), tLog, puppetMaster);
                return x;
            };
            const runner = suiteRunner(suite);
            return {
                test: suite,
                toObj: () => {
                    return suite.toObj();
                },
                runner,
                receiveTestResourceConfig: async function (puppetMaster) {
                    const logFilePath = "log.txt";
                    const access = await puppetMaster.createWriteStream(logFilePath);
                    // deprecated?
                    const tLog = async (...l) => {
                        //
                    };
                    const suiteDone = await runner(puppetMaster, tLog);
                    const logPromise = new Promise(async (res) => {
                        await puppetMaster.end(access);
                        res(true);
                    });
                    const fails = suiteDone.fails;
                    await puppetMaster.writeFileSync(`bdd_errors.txt`, fails.toString());
                    //           await puppetMaster.writeFileSync(
                    //             `index.html`,
                    //             `
                    // <!DOCTYPE html>
                    // <html lang="en">
                    // <head>
                    //   <meta name="description" content="Webpage description goes here" />
                    //   <meta charset="utf-8" />
                    //   <title>kokomoBay - testeranto</title>
                    //   <meta name="viewport" content="width=device-width, initial-scale=1" />
                    //   <meta name="author" content="" />
                    //   <link rel="stylesheet" href="/kokomoBay/testeranto/TestReport.css" />
                    //   <script src="/kokomoBay/testeranto/TestReport.js"></script>
                    // </head>
                    // <body>
                    //   <div id="root"/>
                    // </body>
                    //             `
                    //           );
                    await puppetMaster.writeFileSync(`tests.json`, JSON.stringify(this.toObj(), null, 2));
                    return {
                        failed: fails > 0,
                        fails,
                        artifacts: this.artifacts || [],
                        logPromise,
                        features: suiteDone.features(),
                    };
                },
            };
        });
    }
    // testsJson() {
    //   puppetMaster.writeFileSync(
    //     `tests.json`,
    //     JSON.stringify({ features: suiteDone.features() }, null, 2)
    //   );
    // }
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
