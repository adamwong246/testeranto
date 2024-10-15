import { IBaseTest, ITestImplementation, ITestInterface, ITestSpecification, IUtils } from "../Types";
import puppeteer from "puppeteer-core";

import {
  DefaultTestInterface,
  ILogWriter,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITestArtifactory,
  ITestArtificer,
  ITestJob,
  defaultTestResourceRequirement
} from "./index.js";
import { BaseSuite, BaseGiven, BaseWhen, BaseThen, BaseCheck } from "./abstractBase";
import { ClassBuilder } from "./classBuilder";

export default abstract class Testeranto<
  ITestShape extends IBaseTest,
> extends ClassBuilder<
  ITestShape
> {
  constructor(
    input: ITestShape['iinput'],
    testSpecification: ITestSpecification<ITestShape>,
    testImplementation: ITestImplementation<ITestShape, object>,
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    logWriter: ILogWriter,
    testInterface: Partial<ITestInterface<ITestShape>>,
    utils: IUtils
  ) {

    const fullTestInterface = DefaultTestInterface(testInterface);

    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<
        ITestShape
      > {

        assertThat(t) {
          fullTestInterface.assertThis(t);
        }

        async setup(
          s: ITestShape['iinput'],
          artifactory: ITestArtifactory,
          tr,
          // utils: ITestInterface<ITestShape>
        ): Promise<
          ITestShape['isubject']
        > {
          return (fullTestInterface.beforeAll || (async (
            input: ITestShape['iinput'],
            artifactory: ITestArtifactory,
            tr,
            // utils: ITestInterface<ITestShape>
          ) => input as any))(
            s,
            this.testResourceConfiguration,
            artifactory
          );
        }
      } as any,

      class Given extends BaseGiven<
        ITestShape
      > {

        async givenThat(subject, testResource, artifactory, initializer) {
          return fullTestInterface.beforeEach(
            subject,
            initializer,
            (fPath: string, value: unknown) =>
              // TODO does not work?
              artifactory(`beforeEach/${fPath}`, value),
            testResource,
            this.initialValues,
            // utils,
          );
        }

        afterEach(
          store: ITestShape['istore'],
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(fullTestInterface.afterEach(store, key, (fPath: string, value: unknown) =>
              artifactory(`after/${fPath}`, value)))
          );
        }
        afterAll(store, artifactory) {
          return fullTestInterface.afterAll(store, (fPath: string, value: unknown) =>
          // TODO does not work?
          { artifactory(`afterAll4-${this.name}/${fPath}`, value) },
            utils
          );
        }
      } as any,

      class When extends BaseWhen<
        ITestShape
      > {
        async andWhen(store, whenCB, testResource) {
          return await fullTestInterface.andWhen(store, whenCB, testResource);
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
          return await fullTestInterface.butThen(
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
          return fullTestInterface.beforeEach(
            subject,
            this.initialValues,
            (fPath: string, value: unknown) => artifactory(`before/${fPath}`, value),
            testResourceConfiguration,
            this.initialValues
          );
        }

        afterEach(
          store: ITestShape['istore'],
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(fullTestInterface.afterEach(store, key, (fPath: string, value: unknown) =>
              // TODO does not work?
              artifactory(`afterEach2-${this.name}/${fPath}`, value)))
          );
        }
      } as any,

      testResourceRequirement,
      logWriter,
      utils
    );
  }

  abstract receiveTestResourceConfig(t: ITestJob, partialTestResource: ITTestResourceConfiguration);

}
