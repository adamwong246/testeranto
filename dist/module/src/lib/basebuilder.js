/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class BaseBuilder {
    constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, testResourceRequirement, testSpecification) {
        this.artifacts = [];
        this.artifacts = [];
        this.testResourceRequirement = testResourceRequirement;
        this.suitesOverrides = suitesOverrides;
        this.givenOverides = givenOverides;
        this.whenOverides = whenOverides;
        this.thenOverides = thenOverides;
        this.testSpecification = testSpecification;
        this.specs = testSpecification(this.Suites(), this.Given(), this.When(), this.Then());
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
                    // const logFilePath = "logs.txt";
                    // const access: number = await puppetMaster.createWriteStream(
                    //   logFilePath
                    // );
                    // deprecated?
                    const tLog = async (...l) => {
                        //
                    };
                    try {
                        const suiteDone = await runner(puppetMaster, tLog);
                        const fails = suiteDone.fails;
                        await puppetMaster.writeFileSync([
                            `bdd_errors.txt`,
                            fails.toString(),
                        ]);
                        await puppetMaster.writeFileSync([
                            `tests.json`,
                            JSON.stringify(this.toObj(), null, 2),
                        ]);
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
                    // const logPromise = new Promise(async (res) => {
                    //   await puppetMaster.end(access);
                    //   res(true);
                    // });
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
}
