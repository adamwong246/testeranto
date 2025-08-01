/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { IncomingMessage, Server, ServerResponse } from "http";

import {
  Ibdd_in,
  Ibdd_out,
  ITestAdapter,
  ITestImplementation,
  ITestSpecification,
} from "../CoreTypes";
import testeranto from "../Node";
import { ReportServerOfPort } from "../ReportServerLib";
import { PM } from "../PM";
import { ITTestResourceConfiguration } from "../lib";
import { IPM } from "../lib/types";
import { PM_Node } from "../PM/node";
import { util } from "chai";

type O = Ibdd_out<
  { Default: [] },
  {
    "the http server which is used in development": [];
  },
  // There are no "whens", it is a stateless server.
  {},
  {
    "the frontpage looks good": [];
    "the projects page looks good": [];
    "a project page looks good": [];
    "a test page looks good": [];
  }
>;

const specification: ITestSpecification<I, O> = (Suite, Given, When, Then) => [
  Suite.Default("the http server which is used in development", {
    initialization: Given["the http server which is used in development"](
      ["It should serve the front page", "It should serve the ReportApp"],
      [],
      [
        Then["the frontpage looks good"](),
        // Then["the projects page looks good"](),
        // Then["a project page looks good"](),
        // Then["a test page looks good"](),
      ]
    ),
  }),
];

const implementation: ITestImplementation<I, O, M> = {
  suites: {
    Default: "the http server which is used in  development",
  },

  givens: {
    "the http server which is used in development": function (
      subject
    ): Server<typeof IncomingMessage, typeof ServerResponse> {
      // throw new Error("Function not implemented.");
      return subject;
    },
  },

  // There are no "whens", it is a stateless server.
  whens: {},

  thens: {
    "the frontpage looks good": async (port, utils) => {
      // throw new Error("Function not implemented.");

      // utils.newPage(`localhost:${port}`);
      debugger;
      const page = await utils.newPage();
      utils.goto(page, `localhost:${port}`);
      utils.customScreenShot({ path: `frontpage.png` }, page);

      return;
    },

    "the projects page looks good": function (): (
      port,
      utils: PM
    ) => Server<typeof IncomingMessage, typeof ServerResponse> {
      throw new Error("Function not implemented.");
    },
    "a project page looks good": function (): (
      port,
      utils: PM
    ) => Server<typeof IncomingMessage, typeof ServerResponse> {
      throw new Error("Function not implemented.");
    },
    "a test page looks good": function (): (
      port,
      utils: PM
    ) => Server<typeof IncomingMessage, typeof ServerResponse> {
      throw new Error("Function not implemented.");
    },
  },
};

const adapter: ITestAdapter<I> = {
  assertThis: function (
    x: Server<typeof IncomingMessage, typeof ServerResponse>
  ) {
    throw new Error("Function not implemented.");
  },
  andWhen: function (
    store: Server<typeof IncomingMessage, typeof ServerResponse>,
    whenCB: Server<typeof IncomingMessage, typeof ServerResponse>,
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<Server<typeof IncomingMessage, typeof ServerResponse>> {
    throw new Error("Function not implemented.");
  },
  butThen: function (
    store: Server<typeof IncomingMessage, typeof ServerResponse>,
    thenCB: Server<typeof IncomingMessage, typeof ServerResponse>,
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<Server<typeof IncomingMessage, typeof ServerResponse>> {
    throw new Error("Function not implemented.");
  },
  afterAll: function (
    store: Server<typeof IncomingMessage, typeof ServerResponse>,
    pm: IPM
  ) {
    throw new Error("Function not implemented.");
  },
  afterEach: function (
    store: Server<typeof IncomingMessage, typeof ServerResponse>,
    key: string,
    pm: IPM
  ): Promise<unknown> {
    throw new Error("Function not implemented.");
  },
  beforeAll: async function (
    input: (
      port: number
    ) => Server<typeof IncomingMessage, typeof ServerResponse>,
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<number> {
    await new Promise((res, rej) => input(testResource.ports[0]));
    return testResource.ports[0];
  },
  beforeEach: function (
    subject: number,
    initializer: (
      c?: any
    ) => Server<typeof IncomingMessage, typeof ServerResponse>,
    testResource: ITTestResourceConfiguration,
    initialValues: any,
    pm: IPM
  ): Promise<Server<typeof IncomingMessage, typeof ServerResponse>> {
    throw new Error("Function not implemented.");
  },
};

type I = Ibdd_in<
  (port: number) => Server<typeof IncomingMessage, typeof ServerResponse>,
  number,
  Server<typeof IncomingMessage, typeof ServerResponse>,
  // Server<typeof IncomingMessage, typeof ServerResponse>,
  number,
  Server<typeof IncomingMessage, typeof ServerResponse>,
  Server<typeof IncomingMessage, typeof ServerResponse>,
  Server<typeof IncomingMessage, typeof ServerResponse>
>;

type M = {
  givens: {
    [K in keyof O["givens"]]: (...args: any[]) => IProjectPageViewProps;
  };
  whens: {
    [K in keyof O["whens"]]: (
      ...args: any[]
    ) => (
      props: IProjectPageViewProps,
      utils: any
    ) => IProjectPageViewProps & { container?: HTMLElement };
  };
  thens: {
    [K in keyof O["thens"]]: (port: number, pm: PM_Node) => void;
  };
};

export default testeranto<I, O, M>(
  ReportServerOfPort,
  specification,
  implementation,
  adapter
);
