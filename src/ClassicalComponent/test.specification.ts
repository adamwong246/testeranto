import { ITestSpecification } from "testeranto/src/Types";

import { IClassicalComponentSpec } from "./test.shape";

export const ClassicalComponentSpec: ITestSpecification<
  IClassicalComponentSpec
> = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "a classical react component",
      {
        test0: Given.AnEmptyState(
          [`67ae06bac3c5fa5a98a08e32`],
          [
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheHeader(),
            // When.IClickTheButton(),
          ],
          [Then.ThePropsIs({ children: [] }), Then.TheStatusIs({ count: 3 })]
        ),
        test1: Given.AnEmptyState(
          [`67ae06bac3c5fa5a98a08e32`],
          [When.IClickTheButton()],
          [Then.ThePropsIs({ children: [] }), Then.TheStatusIs({ count: 1 })]
        ),
        test2: Given.AnEmptyState(
          [`67ae06bac3c5fa5a98a08e32`],
          [
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
          ],
          [Then.TheStatusIs({ count: 9 })]
        ),
        test3: Given.AnEmptyState(
          [`67ae06bac3c5fa5a98a08e32`],
          [When.IClickTheButton(), When.IClickTheButton()],
          [Then.TheStatusIs({ count: 2 })]
        ),
      },
      []
    ),
  ];
};
