# testeranto.ts
## teeny tiny tightly-typed typescript tests

Testeranto.ts a Typescript testing framework. It is a way of specifing stateful logic, lifting that knowledge out of your stakeholder's head and into a high-level strongly-typed specification. Testeranto can test any statefull code, from individual javascript classes to entire services, all with the stakeholder-friendly gherkin-like syntax we all know and love. Most testing frameworks focus either on the small-scale (unit tests) or the large-scale (integration tests, E2E tests) but testeranto brings them all under 1 tent, providing 1 type interface for all your tests. 

Testeranto is NOT for testing stateless, or "pure", functions- it is designed only to address _stateful_ logic. Testeranto is made to test individual classes as well as more complex pieces of code but it's not designed to address functions themselves.

Testeranto is pure Typescript with zero dependencies. You are free to use any other testing, or test-reporting, frameworks you'd like in conjunction.

---

### Example 1 - Testing a single class with TesterantoClassic

If you want to test a single javascript class, you can use `TesterantoClassic` class to skip some boilerplate. 

#### a plain old javascript class

```
class Rectangle {

  height: number;
  width: number;

  constructor(height: number = 2, width: number = 2) {
    this.height = height;
    this.width = width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  setWidth(width: number) {
    this.width = width;
  }

  area(): number {
    return this.width * this.height;
  }

  circumference(): number {
    return (this.width * 2) + (this.height * 2);
  }
};

export default Rectangle;
```

#### a little boilerplate
```
const RectangleTesteranto = new TesterantoClassic<
  Rectangle,
  {
    WidthOfOneAndHeightOfOne: (
      feature: string,
      whens: ClassyWhen<Rectangle>[],
      thens: ClassyThen<Rectangle>[]
    ) => ClassyGiven<Rectangle>,
    WidthAndHeightOf: (
      feature: string,
      whens: ClassyWhen<Rectangle>[],
      thens: ClassyThen<Rectangle>[]
    ) => ClassyGiven<Rectangle>,
  }, {
    HeightIsPubliclySetTo: (height: number) => ClassyWhen<Rectangle>
    WidthIsPubliclySetTo: (width: number) => ClassyWhen<Rectangle>
  }, {
    AreaPlusCircumference: (combined: number) => ClassyThen<Rectangle>
  }
>(
  Rectangle,
  {
    WidthOfOneAndHeightOfOne: (feature, whens, thens) =>
      new ClassyGiven(`width of 1 and height of 1`, whens, thens, feature, new Rectangle(1, 1)
      ),
    WidthAndHeightOf: (feature, whens, thens, width, height,) =>
      new ClassyGiven(`width of "${width} and height of "${height}"`, whens, thens, feature, new Rectangle(height, width)),
  },
  {
    HeightIsPubliclySetTo: (height: number) =>
      new ClassyWhen(`the height is set to "${height}"`, (rectangle) =>
        rectangle.height = height
      ),
    WidthIsPubliclySetTo: (width: number) =>
      new ClassyWhen(`the width is set to "${width}"`, (rectangle) =>
        rectangle.width = width
      ),
  },
  {
    AreaPlusCircumference: (combined: number) =>
      new ClassyThen(`the area+circumference is "${combined}"`, (rectangle) =>
        assert.equal(rectangle.area() + rectangle.circumference(), combined)
      ),
  },
)
```

#### Your tests in stakeholder-friendly language
```
RectangleSuite([
  Given.Default('hello testeranto', [
    When.setWidth(4),
    When.setHeight(9)
  ], [
    Then.AreaPlusCircumference(62)
  ]),
  Given.WidthOfOneAndHeightOfOne(`Check the area`,
    [
      When.setWidth(4),
      When.setHeight(5),
    ],
    [
      Then.getWidth(4),
      Then.getHeight(5),
      Then.area(20),
      Then.AreaPlusCircumference(38)
    ]
  ),
  Given.WidthOfOneAndHeightOfOne(`Check the area`, [
    When.setHeight(4),
    When.setWidth(3)
  ], [
    Then.area(12),
  ]),
  Given.WidthOfOneAndHeightOfOne(`Check the area and circumference`, [
    When.setHeight(3),
    When.setWidth(4),
    When.setHeight(5),
    When.setWidth(6),
  ], [
    Then.area(30),
    Then.circumference(22)
  ]),
  Given.WidthOfOneAndHeightOfOne(`Check the area and circumference after publicly setting`, [
    When.setHeight(3),
    When.setWidth(4),
  ], [
    Then.getHeight(3),
    Then.getWidth(4),
    Then.area(12),
    Then.circumference(14),
  ]),
  Given.WidthAndHeightOf(`Set the height and width by constructor, then check the are and circumference`, [
  ], [
    Then.area(15),
    Then.circumference(16),
  ], 3, 5),
  Given.Default('the default constructor', [], [
    Then.area(4),
    Then.circumference(8),
    Then.getWidth(2),
    Then.getHeight(2),
  ]),
]).test();
```


There are more examples in the `tests` folder!

- [Testing a Redux store](/tests/Redux+Reselect+React/LoginStore.test.ts)
- [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
- [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginPage.test.ts)