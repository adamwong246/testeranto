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
        // const f = this.specs[0].features;
        this.testJobs = this.specs.map((suite) => {
            const suiteRunner = (suite) => async (puppetMaster, tLog) => {
                const puppeteerBrowser = await puppetMaster.startPuppeteer({
                    browserWSEndpoint: puppetMaster.testResourceConfiguration.browserWSEndpoint,
                }, puppetMaster.testResourceConfiguration.fs);
                const x = await suite.run(input, puppetMaster.testResourceConfiguration, (fPath, value) => puppetMaster.testArtiFactoryfileWriter(tLog, (p) => {
                    this.artifacts.push(p);
                })(puppetMaster.testResourceConfiguration.fs + "/" + fPath, value), tLog, puppetMaster);
                // await puppetMaster.browser.disconnect();
                // puppeteerBrowser.close();
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
                    // if (numberOfFailures > 0) {
                    //   puppetMaster.writeFileSync(
                    //     `prompt`,
                    //     `
                    //     aider --message "make a script that prints hello" hello.js
                    //     `
                    //   );
                    // }
                    puppetMaster.writeFileSync(`tests.json`, JSON.stringify(this.toObj(), null, 2));
                    console.log(`exiting gracefully with ${numberOfFailures} failures.`);
                    return {
                        failed: numberOfFailures,
                        artifacts: this.artifacts || [],
                        logPromise,
                        features: suiteDone.features(),
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
