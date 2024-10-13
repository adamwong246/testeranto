import { ITTestResourceRequest, ITestJob, ITTestResourceConfiguration, ITLog } from ".";
import { IBaseTest } from "../Types";
import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven } from "./abstractBase";

export abstract class BaseBuilder<
  ITestShape extends IBaseTest,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions,

> {

  assertThis: (t: any) => {

  }

  testResourceRequirement: ITTestResourceRequest;
  artifacts: Promise<unknown>[] = [];
  testJobs: ITestJob[];

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      index: number,
      givens: IGivens<
        ITestShape
      >,
      checks: BaseCheck<
        ITestShape
      >[]
    ) => BaseSuite<
      ITestShape
    >
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      name: string,
      features: string[],
      whens: BaseWhen<
        ITestShape
      >[],
      thens: BaseThen<
        ITestShape
      >[],
      gcb,
    ) => BaseGiven<
      ITestShape
    >
  >;

  whenOverides: Record<
    keyof WhenExtensions,
    (any) => BaseWhen<
      ITestShape
    >
  >;

  thenOverides: Record<
    keyof ThenExtensions,
    (
      selection: ITestShape['iselection'],
      expectation: any
    ) => BaseThen<
      ITestShape
    >
  >;

  checkOverides: Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      ...xtraArgs
    ) => BaseCheck<
      ITestShape
    >
  >;

  constructor(
    public readonly input: ITestShape['iinput'],
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        index: number,
        givens: IGivens<
          ITestShape
        >,
        checks: BaseCheck<
          ITestShape
        >[]
      ) => BaseSuite<
        ITestShape
      >
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        name: string,
        features: string[],
        whens: BaseWhen<
          ITestShape
        >[],
        thens: BaseThen<
          ITestShape
        >[],
        gcb,
      ) => BaseGiven<
        ITestShape
      >
    >,

    whenOverides: Record<
      keyof WhenExtensions,
      (c: any) => BaseWhen<
        ITestShape
      >
    >,

    thenOverides: Record<
      keyof ThenExtensions,
      (
        selection: ITestShape['iselection'],
        expectation: any
      ) => BaseThen<
        ITestShape
      >
    >,

    checkOverides: Record<
      keyof CheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any,
        ...xtraArgs
      ) => BaseCheck<
        ITestShape
      >
    >,
    logWriter,
    testResourceRequirement,
    testSpecification,
  ) {
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;

    const suites = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then(),
      this.Check(),
      logWriter
    );

    const suiteRunner =
      (suite: BaseSuite<
        ITestShape
      >) =>
        async (
          testResourceConfiguration: ITTestResourceConfiguration,
          tLog: ITLog
        ): Promise<BaseSuite<
          ITestShape
        >> => {
          return await suite.run(
            input,
            testResourceConfiguration,
            (
              fPath: string,
              value: unknown
            ) =>
              logWriter.testArtiFactoryfileWriter(tLog, (p: Promise<void>) => {
                artifacts.push(p);
              })(
                testResourceConfiguration.fs + "/" + fPath,
                value
              ),
            tLog
          );
        };

    const artifacts = this.artifacts;

    this.testJobs = suites.map((suite) => {
      const runner = suiteRunner(suite);

      return {
        test: suite,
        testResourceRequirement,

        toObj: () => {
          return suite.toObj();
        },

        runner,

        receiveTestResourceConfig: async function (
          testResourceConfiguration = {
            name: "",
            fs: ".",
            ports: [],
            scheduled: false
          }
        ) {
          console.log(
            `testResourceConfiguration ${JSON.stringify(
              testResourceConfiguration,
              null,
              2
            )}`
          );

          await logWriter.mkdirSync(testResourceConfiguration.fs);

          const logFilePath = (
            `${testResourceConfiguration.fs}/log.txt`
          );

          const access = await logWriter.createWriteStream(logFilePath);

          const tLog = (...l: string[]) => {
            console.log(...l);
            access.write(`${l.toString()}\n`);
          };
          const suiteDone: BaseSuite<
            ITestShape
          > = await runner(testResourceConfiguration, tLog);
          const resultsFilePath = (
            `${testResourceConfiguration.fs}/results.json`
          );

          logWriter.writeFileSync(
            resultsFilePath,
            JSON.stringify(suiteDone.toObj(), null, 2)
          );

          const logPromise = new Promise((res, rej) => {
            access.on("finish", () => { res(true); });
          })
          access.end();

          const numberOfFailures = Object.keys(suiteDone.givens).filter(
            (k) => {
              // console.log(`suiteDone.givens[k].error`, suiteDone.givens[k].error);
              return suiteDone.givens[k].error
            }
          ).length;
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);
          return {
            failed: numberOfFailures,
            artifacts,
            logPromise
          };
        },
      };
    });
  }

  Suites() {
    return this.suitesOverrides;
  }

  Given(): Record<
    keyof GivenExtensions,
    (
      name: string,
      features: string[],
      whens: BaseWhen<
        ITestShape
      >[],
      thens: BaseThen<
        ITestShape
      >[],
      gcb,
    ) => BaseGiven<
      ITestShape
    >
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof WhenExtensions,
    (arg0: ITestShape['istore'], ...arg1: any) =>
      BaseWhen<
        ITestShape
      >
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof ThenExtensions,
    (
      selection: ITestShape['iselection'],
      expectation: any
    ) => BaseThen<
      ITestShape
    >
  > {
    return this.thenOverides;
  }

  Check(): Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      whens,
      thens
    ) => BaseCheck<
      ITestShape
    >
  > {
    return this.checkOverides;
  }
}