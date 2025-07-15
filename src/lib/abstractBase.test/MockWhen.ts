import { BaseWhen } from "../abstractBase";
import { Ibdd_in_any } from "../../CoreTypes";

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
    return whenCB(store);
  }
}
