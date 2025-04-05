import Testeranto from "../../../Node.js";
import { Ibdd_in, Ibdd_out } from "../../../Types.js";

import { IImpl, ISpec, IInput } from "./index.js";
import { testInterface } from "./interface.js";

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
  >,
  IProps,
  IState
>(
  testImplementations: IImpl<I, O>,
  testSpecifications: ISpec<I, O>,
  testInput: IInput<IProps, IState>
) =>
  Testeranto<I, O>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
