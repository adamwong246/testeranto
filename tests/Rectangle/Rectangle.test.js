var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import assert from "assert";
import { Testeranto, } from "testeranto";
import Rectangle from "./Rectangle";
export const RectangleTesteranto = Testeranto(Rectangle.prototype, (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("Testing the Rectangle class", [
            Given.Default([`hello`], [When.setWidth(4), When.setHeight(9)], [Then.getWidth(4), Then.getHeight(9)]),
            Given.WidthOfOneAndHeightOfOne([], [When.setWidth(4), When.setHeight(5)], [
                Then.getWidth(4),
                Then.getHeight(5),
                Then.area(20),
                Then.AreaPlusCircumference(38),
            ]),
            Given.WidthOfOneAndHeightOfOne([`hola`], [When.setHeight(4), When.setWidth(3)], [Then.area(12)]),
            Given.WidthOfOneAndHeightOfOne([`hola`], [
                When.setHeight(3),
                When.setWidth(4),
                When.setHeight(5),
                When.setWidth(6),
            ], [Then.area(30), Then.circumference(22)]),
            Given.WidthOfOneAndHeightOfOne([`gutentag`, `aloha`], [When.setHeight(3), When.setWidth(4)], [
                Then.getHeight(3),
                Then.getWidth(4),
                Then.area(12),
                Then.circumference(14),
            ]),
            Given.WidthOfOneAndHeightOfOne([`hello`], [When.setHeight(33), When.setWidth(34)], [
                Then.getHeight(33),
            ]),
        ], [
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
        ]),
    ];
}, {
    Suites: {
        Default: "a default suite",
    },
    Givens: {
        Default: () => new Rectangle(),
        WidthOfOneAndHeightOfOne: () => new Rectangle(1, 1),
        WidthAndHeightOf: (width, height) => new Rectangle(width, height),
    },
    Whens: {
        HeightIsPubliclySetTo: (height) => (rectangle) => (rectangle.height = height),
        WidthIsPubliclySetTo: (width) => (rectangle) => (rectangle.width = width),
        setWidth: (width) => (rectangle) => rectangle.setWidth(width),
        setHeight: (height) => (rectangle) => rectangle.setHeight(height),
    },
    Thens: {
        AreaPlusCircumference: (combined) => (rectangle) => {
            assert.equal(rectangle.area() + rectangle.circumference(), combined);
        },
        getWidth: (width) => (rectangle) => assert.equal(rectangle.width, width),
        getHeight: (height) => (rectangle) => assert.equal(rectangle.height, height),
        area: (area) => (rectangle) => assert.equal(rectangle.area(), area),
        prototype: (name) => (rectangle) => assert.equal(1, 1),
        // throw new Error("Function not implemented.")
        circumference: (circumference) => (rectangle) => assert.equal(rectangle.circumference(), circumference),
    },
    Checks: {
        /* @ts-ignore:next-line */
        AnEmptyState: () => {
            return {};
        },
    },
}, { ports: 0 }, {
    andWhen: function (renderer, actioner) {
        return __awaiter(this, void 0, void 0, function* () {
            actioner()(renderer);
            return renderer;
        });
    },
});
