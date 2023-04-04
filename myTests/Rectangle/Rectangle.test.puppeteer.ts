import Testeranto from "testeranto/src/core-puppeteer";

import Rectangle from "./Rectangle";
import {
  Input,
  IRectangleTestShape,
  RectangleTesterantoBaseInterface,
  RectangleTesterantoBaseKey,
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseTestSpecification,
  ThenShape,
  WhenShape
} from "./Rectangle.test";

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
  RectangleTesterantoBaseKey

);

export { };
