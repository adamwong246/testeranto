import { IBaseTest, ITestSpecification } from "./Types";
import {
  BaseWhen,
  BaseThen,
  BaseCheck,
  BaseSuite,
  BaseGiven,
  ClassBuilder
} from "./base.js";
import {
  ILogWriter,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITestArtificer,
  ITestJob,
  defaultTestResourceRequirement
} from "./lib.js";

export default abstract class Testeranto<
  ITestShape extends IBaseTest,
> extends ClassBuilder<
  ITestShape
> {
  constructor(
    input: ITestShape['iinput'],
    testSpecification: ITestSpecification<
      ITestShape
    >,
    testImplementation,
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    logWriter: ILogWriter,

    beforeAll: (
      input: ITestShape['iinput'],
      artificer: ITestArtificer,
      testResource: ITTestResourceConfiguration
    ) => Promise<ITestShape['isubject']>,
    beforeEach: (
      subject: ITestShape['isubject'],
      initializer,
      testResource: ITTestResourceConfiguration,
      artificer: ITestArtificer,
      initialValues
    ) => Promise<ITestShape['istore']>,
    afterEach: (
      store: ITestShape['istore'],
      key: string,
      artificer: ITestArtificer
    ) => Promise<unknown>,
    afterAll: (
      store: ITestShape['istore'],
      artificer: ITestArtificer
    ) => any,
    butThen: (
      s: ITestShape['istore'],
      thenCB,
      testResource: ITTestResourceConfiguration,
    ) => any,
    andWhen: (
      store: ITestShape['istore'],
      whenCB,
      testResource: ITTestResourceConfiguration
    ) => Promise<ITestShape['iselection']>,
    assertThis: (
      a: any
    ) => any,
  ) {
    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<
        ITestShape
      > {

        assertThat(t) {
          assertThis(t);
        }

        async setup(s: ITestShape['iinput'], artifactory): Promise<
          ITestShape['isubject']
        > {
          return (beforeAll || (async (
            input: ITestShape['iinput'],
            artificer: ITestArtificer,
          ) => input as any))(
            s,
            artifactory,
            this.testResourceConfiguration
          );
        }
      } as any,

      class Given extends BaseGiven<
        ITestShape
      > {

        async givenThat(subject, testResource, artifactory, initializer) {
          return beforeEach(
            subject,
            initializer,
            testResource,
            (fPath: string, value: unknown) =>
              // TODO does not work?
              artifactory(`beforeEach/${fPath}`, value),
            this.initialValues
          );
        }

        afterEach(
          store: ITestShape['istore'],
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(afterEach(store, key, (fPath: string, value: unknown) =>
              artifactory(`after/${fPath}`, value)))
          );
        }
        afterAll(store, artifactory) {
          return afterAll(store, (fPath: string, value: unknown) =>
            // TODO does not work?
            artifactory(`afterAll4-${this.name}/${fPath}`, value));
        }
      } as any,

      class When extends BaseWhen<
        ITestShape
      > {
        async andWhen(store, whenCB, testResource) {
          return await andWhen(store, whenCB, testResource);
        }
      } as any,

      class Then extends BaseThen<
        ITestShape
      > {

        async butThen(
          store: any,
          thenCB,
          testResourceConfiguration?: any
        ): Promise<ITestShape['iselection']> {
          return await butThen(
            store,
            thenCB,
            testResourceConfiguration);
        }
      } as any,

      class Check extends BaseCheck<
        ITestShape
      > {
        initialValues: any;

        constructor(
          name: string,
          features: string[],
          checkCallback: (a, b) => any,
          whens,
          thens,
          initialValues: any
        ) {
          super(name, features, checkCallback, whens, thens);
          this.initialValues = initialValues;
        }

        async checkThat(subject, testResourceConfiguration, artifactory) {
          return beforeEach(
            subject,
            this.initialValues,
            testResourceConfiguration,
            (fPath: string, value: unknown) => artifactory(`before/${fPath}`, value),
            this.initialValues
          );
        }

        afterEach(
          store: ITestShape['istore'],
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(afterEach(store, key, (fPath: string, value: unknown) =>
              // TODO does not work?
              artifactory(`afterEach2-${this.name}/${fPath}`, value)))
          );
        }
      } as any,

      testResourceRequirement,
      logWriter
    );
  }

  // abstract receiveTestResourceConfigUnscheduled(t: ITestJob, partialTestResource: ITTestResourceConfiguration);
  abstract receiveTestResourceConfig(t: ITestJob, partialTestResource: ITTestResourceConfiguration);

}
