import assert from "assert";

import { TesterantoClassicFactory } from "../../index";

import Rectangle from "./Rectangle";

const RectangleTesteranto = TesterantoClassicFactory<
  Rectangle,
  {
    Default;
  },
  {
    Default;
    WidthOfOneAndHeightOfOne;
    WidthAndHeightOf: [number, number];
  },
  {
    HeightIsPubliclySetTo: [number];
    WidthIsPubliclySetTo: [number];
    setWidth: [number];
    setHeight: [number];
  },
  {
    AreaPlusCircumference: [number];
    circumference: [number];
    getWidth: [number];
    getHeight: [number];
    area: [number];
    prototype: [string];
  },
  {
    Default;
  }
>(Rectangle, (Suite, Given, When, Then, Check) => {
  const RectangleSuite = Suite.Default;
  console.log(Suite);
  // process.exit(0);
  return [
    RectangleSuite(
      [
        Given.Default(
          [When.setWidth(4), When.setHeight(9)],

          [Then.getWidth(4), Then.getHeight(9)]
        ),

        Given.WidthOfOneAndHeightOfOne(
          [When.setWidth(4), When.setHeight(5)],
          [
            Then.getWidth(4),
            Then.getHeight(5),
            Then.area(20),
            Then.AreaPlusCircumference(38),
          ]
        ),
        Given.WidthOfOneAndHeightOfOne(
          [When.setHeight(4), When.setWidth(3)],
          [Then.area(12)]
        ),
        Given.WidthOfOneAndHeightOfOne(
          [
            When.setHeight(3),
            When.setWidth(4),
            When.setHeight(5),
            When.setWidth(6),
          ],
          [Then.area(30), Then.circumference(22)]
        ),
        Given.WidthOfOneAndHeightOfOne(
          [When.setHeight(3), When.setWidth(4)],
          [
            Then.getHeight(3),
            Then.getWidth(4),
            Then.area(12),
            Then.circumference(14),
          ]
        ),
      ],

      [
        // Check.Default(
        //   "imperative style",
        //   async ({ PostToAdd }, { TheNumberIs }) => {
        //     const a = await PostToAdd(2);
        //     const b = parseInt(await PostToAdd(3));
        //     await TheNumberIs(b);
        //     await PostToAdd(2);
        //     await TheNumberIs(7);
        //     await PostToAdd(3);
        //     await TheNumberIs(10);
        //     assert.equal(await PostToAdd(-15), -5);
        //     await TheNumberIs(-5);
        //   }
        // ),
      ]
    ),
  ];
});

export default async () =>
  await RectangleTesteranto.run(
    {
      Default: "some default Suite",
    },
    {
      Default: () => new Rectangle(),
      WidthOfOneAndHeightOfOne: () => new Rectangle(1, 1),
      WidthAndHeightOf: (width, height) => new Rectangle(width, height),
    },
    {
      HeightIsPubliclySetTo: (rectangle, height) => (rectangle.height = height),
      WidthIsPubliclySetTo: (rectangle, width) => (rectangle.width = width),
      setWidth: (rectangle, width) => rectangle.setWidth(width),
      setHeight: (rectangle, height) => rectangle.setHeight(height),
    },
    {
      AreaPlusCircumference: (rectangle, combined: number) => {
        assert.equal(rectangle.area() + rectangle.circumference(), combined);
      },
      getWidth: function (rectangle, width: number): void {
        assert.equal(rectangle.width, width);
      },
      getHeight: function (rectangle, height: number): void {
        assert.equal(rectangle.height, height);
      },
      area: function (rectangle, area: number): void {
        assert.equal(rectangle.area(), area);
      },
      prototype: function (rectangle, name: string): void {
        // throw new Error("Function not implemented.");
      },
      circumference: function (
        rectangle: Rectangle,
        circumference: number
      ): void {
        assert.equal(rectangle.circumference(), circumference);
      },
    },
    {
      // Checks go here
    }
  );
