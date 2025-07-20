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
          [
            // Then.TheResourceIsClaimed("test")
          ]
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
    IClaimTheResource: (resource) => async (i, tr, p) => {
      fetch(`http://localhost:${tr.ports[0]}/claim?${resource}`);
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
    TheResourceIsClaimed: (resource) => async (z, u) => {
      throw new Error("Function not implemented.");
    },
    TheResourceIsUnClaimed: function (
      It_0: string
    ): (ssel: any, utils: PM) => any {
      throw new Error("Function not implemented.");
    },
  },
};

const testInterface: IPartialNodeInterface<I> = {
  // assertThis: function (x: any) {
  //   throw new Error("Function not implemented.");
  // },
  // andWhen: function (store: any, whenCB: any, testResource: ITTestResourceConfiguration, pm: IPM): Promise<any> {
  //   throw new Error("Function not implemented.");
  // },
  // butThen: function (store: any, thenCB: any, testResource: ITTestResourceConfiguration, pm: IPM): Promise<any> {
  //   throw new Error("Function not implemented.");
  // },
  // afterAll: function (store: any, pm: IPM) {
  //   throw new Error("Function not implemented.");
  // },
  // afterEach: function (store: any, key: string, pm: IPM): Promise<unknown> {
  //   throw new Error("Function not implemented.");
  // },
  // beforeAll: function (input: Express, testResource: ITTestResourceConfiguration, pm: IPM): Promise<any> {
  //   throw new Error("Function not implemented.");
  // },
  beforeEach: async (
    subject,
    initializer: (c?: any) => any,
    testResource: ITTestResourceConfiguration,
    initialValues: any,
    pm: IPM
  ) => {
    return subject(testResource.ports[0]);
  },
};

export default Testeranto(
  appFactory,
  specification,
  implementation,
  testInterface
);
