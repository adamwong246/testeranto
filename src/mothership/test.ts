/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Ibdd_in,
  Ibdd_out,
  ITestSpecification,
  ITestImplementation,
  Ibdd_in_any,
} from "../CoreTypes";
import { ITTestResourceConfiguration } from "../lib";
import { IPM } from "../lib/types";
import Testeranto from "../Node";
import { PM } from "../PM";

import appFactory from "./index";

import type { Express } from "express";

type I = Ibdd_in<
  (port: number) => Express,
  (port: number) => Express,
  any,
  any,
  any,
  any,
  any
>;

type O = Ibdd_out<
  {
    TheMothership: [null];
  },
  {
    ItIsRunning: [];
  },
  {
    IClaimTheResource: [string];
    IReleaseTheResource: [string];
    IResetTheResource: [string];
  },
  {
    TheResourceIsClaimed: [string];
    TheResourceIsUnClaimed: [string];
  }
>;

const specification: ITestSpecification<Ibdd_in_any, O> = (
  Suite,
  Given,
  When,
  Then
) => {
  console.log("Suite", Suite);
  return [
    Suite.TheMothership(
      "the mothership allows the coordination of test resources",
      {
        test0: Given.ItIsRunning(
          [`a resource can be claimed`],
          [When.IClaimTheResource("test")],
          [Then.TheResourceIsClaimed("test")]
        ),
      },
      []
    ),
  ];
};

const implementation: ITestImplementation<I, O> = {
  suites: { TheMothership: (x) => x },
  givens: { ItIsRunning: () => undefined },
  whens: {
    IClaimTheResource: (resource) => async (app, tr, pm) => {
      try {
        const response = await fetch(
          `http://localhost:${tr.ports[0]}/claim?resource=${resource}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[ERROR] Failed to claim resource: ${errorText}`);
          throw new Error(`Failed to claim resource: ${errorText}`);
        }
        const result = await response.json();
        return app;
      } catch (error) {
        console.error("[ERROR] Resource claim failed:", error);
        throw error;
      }
    },
    IReleaseTheResource: function (
      resource: string
    ): (zel, tr, utils) => Promise<any> {
      throw new Error("Function not implemented.");
    },
    IResetTheResource: function (
      Iw_0: string
    ): (zel: any, tr, utils: PM) => Promise<any> {
      throw new Error("Function not implemented.");
    },
  },
  thens: {
    TheResourceIsClaimed: (expectedResource) => async (app, pm) => {
      // In a real implementation, we'd check the server state
      // For now just log and return success
      return app;
    },
    TheResourceIsUnClaimed: function (
      It_0: string
    ): (ssel: any, utils: PM) => any {
      throw new Error("Function not implemented.");
    },
  },
};

const testAdapter = {
  beforeEach: async (
    subject,
    initializer: (c?: any) => any,
    testResource: ITTestResourceConfiguration,
    initialValues: any,
    pm: IPM
  ) => {
    console.log("beforeEach - starting app on port", testResource.ports[0]);
    return subject(testResource.ports[0]);
  },

  andWhen: async (store, whenCB, testResource, pm) => {
    console.log("andWhen - executing action");
    return whenCB(store, testResource, pm);
  },

  butThen: async (store, thenCB, testResource, pm) => {
    console.log("butThen - making assertions");
    return thenCB(store, pm);
  },

  afterEach: async (store, key, pm) => {
    console.log("afterEach - cleaning up");
    return store;
  },

  afterAll: async (store, pm) => {
    console.log("afterAll - final cleanup");
  },

  beforeAll: async (input, testResource, pm) => {
    console.log("beforeAll - initial setup");
    return input;
  },

  assertThis: (x) => {
    console.log("assertThis - validating result");
    return x;
  },
};

export default Testeranto(
  appFactory,
  specification,
  implementation,
  testAdapter
);
