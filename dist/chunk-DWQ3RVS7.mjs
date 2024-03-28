import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/ClassicalComponent.test.ts
var testSpecification = (Suite, Given, When, Then, Check) => {
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
        "test1": Given.AnEmptyState(
          ["test"],
          [When.IClickTheButton()],
          [Then.ThePropsIs({ children: [] }), Then.TheStatusIs({ count: 1 })]
        ),
        "test2": Given.AnEmptyState(
          ["test"],
          [
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton()
          ],
          [Then.TheStatusIs({ count: 6 })]
        ),
        "test3": Given.AnEmptyState(
          ["test"],
          [
            When.IClickTheButton(),
            When.IClickTheButton()
          ],
          [Then.TheStatusIs({ count: 2 })]
        )
      },
      []
    )
  ];
};

export {
  testSpecification
};
