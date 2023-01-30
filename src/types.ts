import { DirectedGraph } from 'graphology';

import { BaseGiven, BaseCheck, BaseSuite, BaseFeature, BaseWhen, BaseThen } from "./BaseClasses";

export type ITTestResourceRequirement = {
  "ports": number
};
export type ITTestResource = {
  "ports": number[]
};

export type IT_FeatureNetwork = { name: string, graph: DirectedGraph };

export type IT = {
  toObj(): object;
  aborter: () => any;
  name: string;
  givens: BaseGiven<unknown, unknown, unknown, unknown>[];
  checks: BaseCheck<unknown, unknown, unknown, unknown, ITTestShape>[];
};

export type ITestJob = [filename: string, classname: string]
//   {
//   toObj(): object;
//   test: IT;
//   runner: (testResurce?) => unknown;
//   testResource: ITTestResourceRequirement;
// };

export type ITestResults = Promise<{
  test: IT;

}>[];

export type Modify<T, R> = Omit<T, keyof R> & R;

export type ITTestShape = {
  suites;
  givens;
  whens;
  thens;
  checks;
};

export type ITestSpecification<ITestShape extends ITTestShape> = (
  Suite: {
    [K in keyof ITestShape["suites"]]: (
      name: string,
      givens: BaseGiven<unknown, unknown, unknown, unknown>[],
      checks: BaseCheck<unknown, unknown, unknown, unknown, ITestShape>[]
    ) => BaseSuite<unknown, unknown, unknown, unknown, unknown, ITestShape>;
  },
  Given: {
    [K in keyof ITestShape["givens"]]: (
      features: BaseFeature[],
      whens: BaseWhen<unknown, unknown, unknown>[],
      thens: BaseThen<unknown, unknown, unknown>[],
      ...xtras: ITestShape["givens"][K]
    ) => BaseGiven<unknown, unknown, unknown, unknown>;
  },
  When: {
    [K in keyof ITestShape["whens"]]: (
      ...xtras: ITestShape["whens"][K]
    ) => BaseWhen<unknown, unknown, unknown>;
  },
  Then: {
    [K in keyof ITestShape["thens"]]: (
      ...xtras: ITestShape["thens"][K]
    ) => BaseThen<unknown, unknown, unknown>;
  },
  Check: {
    [K in keyof ITestShape["checks"]]: (

      name: string,
      features: BaseFeature[],
      callbackA: (
        whens: {
          [K in keyof ITestShape["whens"]]: (...unknown) => BaseWhen<unknown, unknown, unknown>
        },
        thens: {
          [K in keyof ITestShape["thens"]]: (...unknown) => BaseThen<unknown, unknown, unknown>
        },

      ) => unknown,
      // whens: BaseWhen<unknown, unknown, unknown>[],
      // thens: BaseThen<unknown, unknown, unknown>[],

      ...xtras: ITestShape["checks"][K]
    ) => BaseCheck<unknown, unknown, unknown, unknown, ITestShape>;
  }
) => any[];

export type ITestImplementation<
  IState,
  ISelection,
  IWhenShape,
  IThenShape,
  ITestShape extends ITTestShape
> = {
  Suites: {
    [K in keyof ITestShape["suites"]]: string;
  };
  Givens: {
    [K in keyof ITestShape["givens"]]: (
      ...Ig: ITestShape["givens"][K]
    ) => IState;
  };
  Whens: {
    [K in keyof ITestShape["whens"]]: (
      ...Iw: ITestShape["whens"][K]
    ) => (zel: ISelection) => IWhenShape;
  };
  Thens: {
    [K in keyof ITestShape["thens"]]: (
      ...It: ITestShape["thens"][K]
    ) => (ssel: ISelection) => IThenShape;
  };
  Checks: {
    [K in keyof ITestShape["checks"]]: (
      ...Ic: ITestShape["checks"][K]
    ) => IState;
  };
};