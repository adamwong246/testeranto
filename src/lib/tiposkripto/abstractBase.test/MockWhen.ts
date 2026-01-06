/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Ibdd_in_any } from "../../CoreTypes";
import { BaseWhen } from "../BaseWhen";

export class MockWhen<I extends Ibdd_in_any> extends BaseWhen<I> {
  constructor(name: string, whenCB: (x: I["iselection"]) => I["then"]) {
    super(name, whenCB);
  }

  async andWhen(
    store: I["istore"],
    whenCB: (x: I["iselection"]) => I["then"],
    testResource: any,
    pm: any
  ): Promise<I["istore"]> {
    // The whenCB returns a function that takes the store
    const result = whenCB(store as any);
    if (typeof result === 'function') {
      return result(store);
    }
    return result;
  }
}
