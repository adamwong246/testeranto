import { IStore } from "../SubPackages/react/jsx";
import {
  IBaseTest,
  ITestSpecification,
  ITestImplementation,
} from "../Types.js";

import { ITestInterface, IUtils } from "./types.js";
import {
  DefaultTestInterface,
  ILogWriter,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITestArtifactory,
  ITestJob,
  defaultTestResourceRequirement,
} from "./index.js";
import {
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
  BaseCheck,
} from "./abstractBase.js";
import { ClassBuilder } from "./classBuilder.js";

export default abstract class Testeranto<
  ITestShape extends IBaseTest
> extends ClassBuilder<ITestShape> {
  constructor(
    input: ITestShape["iinput"],
    testSpecification: ITestSpecification<ITestShape>,
    testImplementation: ITestImplementation<ITestShape, object>,
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    logWriter: ILogWriter,
    testInterface: Partial<ITestInterface<ITestShape>>
  ) {
    const fullTestInterface = DefaultTestInterface(testInterface);

    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<ITestShape> {
        assertThat(t) {
          fullTestInterface.assertThis(t);
        }

        async setup(
          s: ITestShape["iinput"],
          artifactory: ITestArtifactory,
          tr,
          utils
        ): Promise<ITestShape["isubject"]> {
          return (
            fullTestInterface.beforeAll ||
            (async (
              input: ITestShape["iinput"],
              artifactory: ITestArtifactory,
              tr,
              utils: ITestInterface<ITestShape>
            ) => input as any)
          )(s, this.testResourceConfiguration, artifactory, utils);
        }
      } as any,

      class Given extends BaseGiven<ITestShape> {
        async givenThat(subject, testResource, artifactory, initializer) {
          return fullTestInterface.beforeEach(
            subject,
            initializer,
            (fPath: string, value: unknown) =>
              // TODO does not work?
              artifactory(`beforeEach/${fPath}`, value),
            testResource,
            this.initialValues
            // utils,
          );
        }

        afterEach(
          store: ITestShape["istore"],
          key: string,
          artifactory,
          utils
        ): Promise<unknown> {
          return new Promise((res) =>
            res(
              fullTestInterface.afterEach(
                store,
                key,
                (fPath: string, value: unknown) =>
                  artifactory(`after/${fPath}`, value),
                utils
              )
            )
          );
        }
        afterAll(store: IStore, artifactory: ITestArtifactory, utils: IUtils) {
          return fullTestInterface.afterAll(
            store,
            (fPath: string, value: unknown) =>
              // TODO does not work?
              {
                artifactory(`afterAll4-${this.name}/${fPath}`, value);
              },
            utils
          );
        }
      } as any,

      class When extends BaseWhen<ITestShape> {
        async andWhen(store, whenCB, testResource) {
          return await fullTestInterface.andWhen(store, whenCB, testResource);
        }
      } as any,

      class Then extends BaseThen<ITestShape> {
        async butThen(
          store: any,
          thenCB,
          testResourceConfiguration?: any
        ): Promise<ITestShape["iselection"]> {
          return await fullTestInterface.butThen(
            store,
            thenCB,
            testResourceConfiguration
          );
        }
      } as any,

      class Check extends BaseCheck<ITestShape> {
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
          return fullTestInterface.beforeEach(
            subject,
            this.initialValues,
            (fPath: string, value: unknown) =>
              artifactory(`before/${fPath}`, value),
            testResourceConfiguration,
            this.initialValues
          );
        }

        afterEach(
          store: ITestShape["istore"],
          key: string,
          artifactory,
          utils
        ): Promise<unknown> {
          return new Promise((res) =>
            res(
              fullTestInterface.afterEach(
                store,
                key,
                (fPath: string, value: unknown) =>
                  // TODO does not work?
                  artifactory(`afterEach2-${this.name}/${fPath}`, value),
                utils
              )
            )
          );
        }
      } as any,

      testResourceRequirement,
      logWriter
    );
  }

  abstract receiveTestResourceConfig(
    t: ITestJob,
    partialTestResource: ITTestResourceConfiguration,
    utils: IUtils
  );
}
