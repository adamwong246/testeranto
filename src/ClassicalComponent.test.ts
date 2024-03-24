import type { IProps, IState } from "./ClassicalComponent";


export type IClassicalComponentTesteranto = {
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
}

export const testSpecification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "a classical react component",
      {
        "test0": Given.AnEmptyState(
          ["test"],
          [],
          [
            Then.ThePropsIs({ children: [] }),
            Then.TheStatusIs({ count: 0 })
          ]
        ),
        // "test1": Given.AnEmptyState(
        //   ["test"],
        //   [When.IClickTheButton()],
        //   [Then.ThePropsIs({ children: [] }), Then.TheStatusIs({ count: 1 })]
        // ),
        // "test2": Given.AnEmptyState(
        //   ["test"],
        //   [
        //     When.IClickTheButton(),
        //     When.IClickTheButton(),
        //     When.IClickTheButton(),
        //     When.IClickTheButton(),
        //     When.IClickTheButton(),
        //     When.IClickTheButton(),
        //   ],
        //   [Then.TheStatusIs({ count: 6 })]
        // ),
        // "test3": Given.AnEmptyState(
        //   ["test"],
        //   [
        //     When.IClickTheButton(),
        //     When.IClickTheButton(),
        //   ],
        //   [Then.TheStatusIs({ count: 2 })]
        // )
      },
      []
    ),
  ];
}