import { ITestSpecification } from "testeranto/src/Types";

import type {
  IProps,
  IState,
} from ".";

export type IClassicalComponentSpec = {

  iinput: void,
  isubject: void,
  istore: void,
  iselection: any,

  when: void,
  then: void,
  given: (x) => (y) => void,

  suites: {
    Default: string;
  };
  givens: {
    AnEmptyState: [];
  };
  whens: {
    IClickTheButton: [];
  };
  thens: {
    ThePropsIs: [IProps];
    TheStatusIs: [IState];
  };
  checks: {
    AnEmptyState;
  };
};

export const ClassicalComponentSpec: ITestSpecification<
  IClassicalComponentSpec
> =
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "a classical react component",
        {
          "test0": Given.AnEmptyState(
            ["test"],
            [],
            [
              Then.ThePropsIs(['{"foo":"bar"}']),
              Then.TheStatusIs({ count: 0 })
            ]
          ),
          "test1": Given.AnEmptyState(
            ["test"],
            [When.IClickTheButton()],
            [Then.ThePropsIs(['{"foo":"bar"}']), Then.TheStatusIs({ count: 1 })]
          ),
          "test2": Given.AnEmptyState(
            ["test"],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
            ],
            [Then.TheStatusIs({ count: 6 })]
          ),
          "test3": Given.AnEmptyState(
            ["test"],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
            ],
            [Then.TheStatusIs({ count: 22 })]
          )
        },
        []
      ),
    ];
  }
