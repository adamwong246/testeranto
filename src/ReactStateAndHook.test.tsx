import assert from "assert";

import type {
  ITestSpecification,
  ITestImplementation,
} from "testeranto/src/Types";

import Testeranto from "testeranto/src/SubPackages/react-test-renderer/jsx/node";

import ReactStateAndHook from "./ReactStateAndHook";

type ISpec = {
  iinput: any,
  isubject: any,
  istore: any,
  iselection: any,

  when: (rectangle: any) => unknown,
  then: unknown,
  given: (x) => unknown,

  suites: {
    Default: string;
  },
  givens: {
    Default;
  },
  whens: {
    IClick: [];
  },
  thens: {
    TheCounterIs: [number];
  },
  checks: {
    Default;
  }
};

const Specification: ITestSpecification<ISpec> =
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the ReactStateAndHook element",
        {
          "test0": Given.Default(
            [`hello`],
            [],
            [Then.TheCounterIs(0)]
          ),
          "test1": Given.Default(
            [`hello`],
            [When.IClick()],
            [Then.TheCounterIs(1)]
          ),
          "test2": Given.Default(
            [`hello`],
            [When.IClick(), When.IClick(), When.IClick()],
            [Then.TheCounterIs(3)]
          ),
          "test3": Given.Default(
            [`hello`],
            [When.IClick()],
            [Then.TheCounterIs(1)]
          ),
        },
        []
      ),
    ];
  };

const Implementation: ITestImplementation<
  ISpec, {
    givens: {
      [K in keyof ISpec["givens"]]: (
        ...Iw: ISpec["givens"][K]
      ) => void;
    }
  }
> = {
  suites: {
    Default: "a default suite",
  },

  givens: {
    Default: () => { return },
  },

  whens: {
    IClick: () => (rtr) =>
      rtr.root.findByType("button").props.onClick(),
  },

  thens: {
    TheCounterIs: (counter) => (rtr) => {
      return assert.deepEqual(
        (rtr.toJSON() as { children: object[] }).children[0],
        {
          type: 'pre',
          props: {},
          children: [
            JSON.stringify(counter)
          ]
        }
      )
    },
  },

  checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    },
  },
};

export const ClassicalComponentReactTestRendererTesteranto = Testeranto(
  Implementation,
  Specification,
  ReactStateAndHook
);
