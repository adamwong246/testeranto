/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Do not add logging to this file as it is used by the pure runtime.

import type {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestImplementation,
  ITestAdapter,
  ITestSpecification,
} from "../CoreTypes";

import {
  DefaultAdapter,
  IFinalResults,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITestArtifactory,
  defaultTestResourceRequirement,
} from "./index.js";
import { BaseGiven, BaseWhen, BaseThen } from "./abstractBase.js";
import { ClassBuilder } from "./classBuilder.js";
import { IPM } from "./types";
import { BaseSuite } from "./BaseSuite.js";

export default abstract class TesterantoCore<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  M
> extends ClassBuilder<I, O, M> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M> & {
      suites: Record<string, any>;
      givens: Record<string, any>;
      whens: Record<string, any>;
      thens: Record<string, any>;
    },
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    testAdapter: Partial<ITestAdapter<I>>,
    uberCatcher: (cb: () => void) => void
  ) {
    const fullAdapter = DefaultAdapter(testAdapter);

    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<I, O> {
        afterAll(store: I["istore"], artifactory: ITestArtifactory, pm: IPM) {
          return fullAdapter.afterAll(store, pm);
        }

        assertThat(t: Awaited<I["then"]>): boolean {
          return fullAdapter.assertThis(t);
        }

        async setup(
          s: I["iinput"],
          artifactory: ITestArtifactory,
          tr: ITTestResourceConfiguration,
          pm: IPM
        ): Promise<I["isubject"]> {
          return (
            fullAdapter.beforeAll ||
            (async (
              input: I["iinput"],
              artifactory: ITestArtifactory,
              tr,
              pm: IPM
            ) => input as any)
          )(
            s,
            this.testResourceConfiguration,
            // artifactory,
            pm
          );
        }
      } as any,

      class Given extends BaseGiven<I> {
        uberCatcher = uberCatcher;

        async givenThat(
          subject,
          testResource,
          artifactory,
          initializer,
          initialValues,
          pm
        ) {
          return fullAdapter.beforeEach(
            subject,
            initializer,
            testResource,
            initialValues,
            pm
          );
        }

        afterEach(
          store: I["istore"],
          key: string,
          artifactory,
          pm
        ): Promise<unknown> {
          return new Promise((res) =>
            res(fullAdapter.afterEach(store, key, pm))
          );
        }
        s;
      } as any,

      class When extends BaseWhen<I> {
        async andWhen(store, whenCB, testResource, pm) {
          return await fullAdapter.andWhen(store, whenCB, testResource, pm);
        }
      } as any,

      class Then extends BaseThen<I> {
        async butThen(
          store: any,
          thenCB,
          testResource: any,
          pm: IPM
        ): Promise<I["iselection"]> {
          return await fullAdapter.butThen(store, thenCB, testResource, pm);
        }
      } as any,

      testResourceRequirement
    );
  }

  abstract receiveTestResourceConfig(
    partialTestResource: string
  ): Promise<IFinalResults>;
}
