import assert from "assert";
import {
  ClassySuite,
  ClassyGiven,
  ClassyWhen,
  ClassyThen
} from "../../index";

import Rectangle from "./Rectangle";

type IThen = ClassyThen<Rectangle>[];
type IWhen = ClassyWhen<Rectangle>[];
type IGiven = ClassyGiven<Rectangle>[];
const Thener = ClassyThen<Rectangle>;
const Whener = ClassyWhen<Rectangle>;
const Suiter = ClassySuite<Rectangle>

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

const RectangleSuite = RectangleTesteranto.suite.default;
const Given = RectangleTesteranto.given;
const When = RectangleTesteranto.when;
const Then = RectangleTesteranto.then;

export default () => {
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
      new Thener(`the height is 2"`, (rectangle) =>
        assert.equal(rectangle.height, 2)
      ),
      // (rectangle) =>
      //   assert.equal(rectangle.height, 2)
    ])

  ]).run();
}