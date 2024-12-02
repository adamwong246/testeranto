export class BaseBuilder {
    constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, testResourceRequirement, testSpecification
    // puppetMaster: PM
    ) {
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
        // this.puppetMaster = puppetMaster;
        this.specs = testSpecification(this.Suites(), this.Given(), this.When(), this.Then(), this.Check());
        this.testJobs = this.specs.map((suite) => {
            const suiteRunner = (suite) => async (
            // testResourceConfiguration: ITTestResourceConfiguration,
            puppetMaster, tLog) => {
                await puppetMaster.startPuppeteer({
                    browserWSEndpoint: puppetMaster.testResourceConfiguration.browserWSEndpoint,
                }, puppetMaster.testResourceConfiguration.fs);
                return await suite.run(input, puppetMaster.testResourceConfiguration, (fPath, value) => puppetMaster.testArtiFactoryfileWriter(tLog, (p) => {
                    this.artifacts.push(p);
                })(puppetMaster.testResourceConfiguration.fs + "/" + fPath, value), tLog, puppetMaster);
            };
            const runner = suiteRunner(suite);
            return {
                test: suite,
                // testResourceRequirement,
                toObj: () => {
                    return suite.toObj();
                },
                runner,
                receiveTestResourceConfig: async function (
                // testResourceConfiguration = {
                //   name: "",
                //   fs: ".",
                //   ports: [],
                //   browserWSEndpoint: "",
                // },
                puppetMaster) {
                    // console.log(
                    //   `testResourceConfiguration! ${JSON.stringify(
                    //     testResourceConfiguration,
                    //     null,
                    //     2
                    //   )}`
                    // );
                    // console.log("puppetMaster", puppetMaster);
                    await puppetMaster
                        .mkdirSync();
                    //  if (!puppetMaster.existsSync(destFolder)) {
                    //    puppetMaster.mkdirSync(destFolder, { recursive: true });
                    //  }
                    puppetMaster.writeFileSync(
                    // puppetMaster.testResourceConfiguration.fs + `/tests.json`,
                    `tests.json`, JSON.stringify(this.toObj(), null, 2));
                    const logFilePath = "log.txt";
                    // puppetMaster.testResourceConfiguration.fs + `/log.txt`;
                    const access = await puppetMaster.createWriteStream(logFilePath);
                    // console.log("access", access);
                    const tLog = (...l) => {
                        // access.write(`${l.toString()}\n`);
                        // console.log("tLog", l);
                        puppetMaster.write(access, `${l.toString()}\n`);
                    };
                    // console.log("runner", runner);
                    const suiteDone = await runner(puppetMaster, tLog);
                    // console.log("suiteDone", suiteDone);
                    const logPromise = new Promise((res, rej) => {
                        // res(true);
                        // access.on("finish", () => {
                        //   res(true);
                        // });
                        puppetMaster.end(access);
                        res(true);
                    });
                    // access.end();
                    const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
                        return suiteDone.givens[k].error;
                    }).length;
                    puppetMaster.writeFileSync(
                    // puppetMaster.testResourceConfiguration.fs + `/exitcode`,
                    `exitcode`, numberOfFailures.toString());
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
