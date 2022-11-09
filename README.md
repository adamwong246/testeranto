# testeranto.ts
## teeny tiny tightly-typed typescript tests

"Testeranto" (a pun based on the language "esperanto") is a Typescript testing framework. It is a way of specifing stateful logic, lifting that knowledge out of your codebase into a high-level cucumber-like specification. Testeranto is NOT for testing pure functions- it is designed only to address _stateful_ logic. 

Testeranto is pure typescript that adds zero dependencies. You are free to use any other testing, or test-reporting, frameworks you'd like in conjunction.

Typescript makes it very easy to implement your testeranto interfaces, of which you will need 1 for each class or type signature. Each will consist 4 simple classes, corresponding to Suite, Given, When, and Then cucumber steps. 

### Examples

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

#### some typed boilerplate
```
const RectangleTesteranto = {
  suite: {
    default: (
      description: string,
      rectangle: Rectangle,
      givens: IGiven,
    ) => new Suiter(description, rectangle, givens)
  },
  given: {
    WidthOfOneAndHeightOfOne: (
      feature: string,
      whens: IWhen,
      thens: IThen
    ) => {
      return new ClassyGiven(`width of 1 and height of 1`, whens, thens, feature, new Rectangle(1, 1))
    },
    WidthAndHeightOf: (
      width: number,
      height: number,
      feature: string,
      whens: IWhen,
      thens: IThen
    ) => new ClassyGiven(`width of "${width} and height of "${height}"`, whens, thens, feature, new Rectangle(height, width)),
    Default: (
      feature: string,
      whens: IWhen,
      thens: IThen
    ) => new ClassyGiven(`default width and height`, whens, thens, feature, new Rectangle())
  },

  when: {
    WidthIsPubliclySetTo: (width: number) =>
      new Whener(`the width is set to "${width}"`, (rectangle) =>
        rectangle.width = width
      ),
    HeightIsPubliclySetTo: (height: number) =>
      new Whener(`the height is set to "${height}"`, (rectangle) =>
        rectangle.height = height
      ),
    WidthIsSetTo: (width: number) =>
      new Whener(`the width is set to "${width}"`, (rectangle) =>
        rectangle.setWidth(width)
      ),
    HeightIsSetTo: (height: number) =>
      new Whener(`the height is set to "${height}"`, (rectangle) =>
        rectangle.setHeight(height)
      )
  },

  then: {
    WidthIs: (width: number) =>
      new Thener(`the width is "${width}"`, (rectangle) =>
        assert.equal(rectangle.width, width)
      ),
    HeightIs: (height: number) =>
      new Thener(`the height is "${height}"`, (rectangle) =>
        assert.equal(rectangle.height, height)
      ),
    AreaIs: (area: number) =>
      new Thener(`the area is "${area}"`, (rectangle) =>
        assert.equal(rectangle.area(), area)
      ),
    CircumferenceIs: (circumference: number) =>
      new Thener(`the circumference is "${circumference}"`, (rectangle) =>
        assert.equal(rectangle.circumference(), circumference)
      )
  },
}
```

#### Your tests in stakeholder-friendly language
```
RectangleSuite(`testing the Rectangle class`, (Rectangle.prototype), [
    Given.WidthOfOneAndHeightOfOne(`Set the width`, [
      When.WidthIsSetTo(3),
    ], [
      Then.WidthIs(3),
    ]),

    Given.WidthOfOneAndHeightOfOne(`Set the height`, [
      When.HeightIsSetTo(4),
    ], [
      Then.HeightIs(4),
    ]),

    Given.WidthOfOneAndHeightOfOne(`Check the area`, [
      When.HeightIsSetTo(4),
      When.WidthIsSetTo(3),
    ], [
      Then.AreaIs(12),
    ]),

    Given.WidthOfOneAndHeightOfOne(`Check the area and circumference`, [
      When.HeightIsSetTo(3),
      When.WidthIsSetTo(4),
      When.HeightIsSetTo(5),
      When.WidthIsSetTo(6),
    ], [
      Then.AreaIs(30),
      Then.CircumferenceIs(22)
    ]),

    Given.WidthOfOneAndHeightOfOne(`Check the area and circumference after publicly setting`, [
      When.HeightIsPubliclySetTo(3),
      When.WidthIsPubliclySetTo(4),
    ], [
      Then.AreaIs(12),
      Then.CircumferenceIs(14),
    ]),

    Given.WidthAndHeightOf(3, 5, `Set the height and width by constructor, then check the are and circumference`, [], [
      Then.AreaIs(15),
      Then.CircumferenceIs(16),
    ]),

    Given.Default('the default constructor', [], [
      Then.AreaIs(4),
      Then.CircumferenceIs(8),
      Then.WidthIs(2),
      Then.HeightIs(2),
    ])

  ]).run();
```

There are more examples in the `tests` folder!

- [Testing a Redux store](/tests/Redux+Reselect+React/LoginStore.test.ts)
- [Testing a Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginSelector.test.ts)
- [Testing a React Component with Reselect Selector based on a Redux store](/tests/Redux+Reselect+React/LoginPage.test.ts)