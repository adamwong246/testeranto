import renderer from "react-test-renderer";
import assert from "assert";

import { ITTestShape, ITestImplementation, ITestSpecification } from "testeranto/src/core";

import Testeranto from "testeranto/src/SubPackages/react-test-renderer/jsx/node";

import ReactStateAndHook, { IProps } from "./ReactStateAndHook";
import { WhenShape, ThenShape } from "./Rectangle.test";

type ISpec = {
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
} & ITTestShape;

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

const Implementation = {
  Suites: {
    Default: "a default suite",
  },

  Givens: {
    Default: () => { return },
  },

  Whens: {
    IClick: () => (rtr) =>
      rtr.root.findByType("button").props.onClick(),
  },

  Thens: {
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

  Checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    },
  },
} as ITestImplementation<
  IProps,
  renderer.ReactTestRenderer,
  WhenShape,
  ThenShape,
  ISpec
>;

export const ClassicalComponentReactTestRendererTesteranto = Testeranto(
  Implementation,
  Specification,
  ReactStateAndHook
);
