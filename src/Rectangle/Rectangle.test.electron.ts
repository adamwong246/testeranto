import Testeranto from "testeranto/src/Web";

import Rectangle from "../../src/Rectangle";
import {
  Input,
  IRectangleTestShape,
  RectangleTesterantoBaseInterface,
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseTestSpecification,
  ThenShape,
  WhenShape
} from "../../src/Rectangle.test";

export const RectangleTesteranto = Testeranto<
  IRectangleTestShape,
  Input,
  Input,
  Rectangle,
  Rectangle,
  WhenShape,
  ThenShape,
  unknown
>(
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseInterface,
);

export { };
