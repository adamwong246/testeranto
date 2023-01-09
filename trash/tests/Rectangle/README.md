# Testing a single class with `TesterantoClassic`

If you want to test a single javascript class, you can use `TesterantoClassic` class to skip some boilerplate. 

## a plain old javascript class

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

## a little boilerplate
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

## the tests
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
  ]
)
```
