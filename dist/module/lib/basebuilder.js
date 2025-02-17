export class BaseBuilder {
    constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, testResourceRequirement, testSpecification) {
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
        this.testJobs = this.specs.map((suite) => {
            const suiteRunner = (suite) => async (puppetMaster, tLog) => {
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
                toObj: () => {
                    return suite.toObj();
                },
                runner,
                receiveTestResourceConfig: async function (puppetMaster) {
                    await puppetMaster.mkdirSync();
                    const logFilePath = "log.txt";
                    const access = await puppetMaster.createWriteStream(logFilePath);
                    const tLog = (...l) => {
                        puppetMaster.write(access, `${l.toString()}\n`);
                    };
                    const suiteDone = await runner(puppetMaster, tLog);
                    const logPromise = new Promise((res, rej) => {
                        puppetMaster.end(access);
                        res(true);
                    });
                    const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
                        return suiteDone.givens[k].error;
                    }).length;
                    puppetMaster.writeFileSync(`exitcode`, numberOfFailures.toString());
                    puppetMaster.writeFileSync(`tests.json`, JSON.stringify(this.toObj(), null, 2));
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
