import { IPartialInterface } from "testeranto/src/Types";
import { IRectangleTestShape } from "./Rectangle.test.shape";

export const RectangleTesterantoBaseInterface: IPartialInterface<IRectangleTestShape> =
  {
    beforeEach: async (subject, initializer, art, tr, initialValues) => {
      return subject;
    },
    andWhen: async function (renderer, actioner) {
      actioner(renderer);
      return renderer;
    },
    butThen: (s, t, tr) => {
      return t(s);
    },
  };
