import Testeranto from "testeranto/src/Node";

import Rectangle from "../../src/Rectangle";
import {
  RectangleTesterantoBaseInterface,
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestImplementation,
  RectangleTesterantoBaseTestSpecification,
} from "../../src/Rectangle.test";

export const RectangleTesteranto = Testeranto(
  RectangleTesterantoBasePrototype,
  RectangleTesterantoBaseTestSpecification,
  RectangleTesterantoBaseTestImplementation,
  {
    asd: 1,

    afterAll: async function (renderer, actioner) {
      // console.log("goodbye");
      // whyIsNodeStillRunning();
    },
    ...RectangleTesterantoBaseInterface
  },
);

export { };
