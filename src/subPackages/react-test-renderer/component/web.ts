import { Ibdd_in, Ibdd_out } from "../../../Types.js";
import Testeranto from "../../../Web.js";

import { IImpl, ISpec, IInput } from "./index.js";
import { testInterface } from "./interface";

export default <
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  testImplementations: IImpl<I, O>,
  testSpecifications: ISpec<I, O>,
  testInput: IInput<any, any>
) =>
  Testeranto<I, O>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
