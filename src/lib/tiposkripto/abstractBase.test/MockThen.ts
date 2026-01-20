import { Ibdd_in_any } from "../../../CoreTypes";
import { BaseThen } from "../BaseThen";

export class MockThen<I extends Ibdd_in_any> extends BaseThen<I> {
  constructor(
    name: string,
    thenCB: (val: I["iselection"]) => Promise<I["then"]>
  ) {
    super(name, thenCB);
  }

  async butThen(
    store: I["istore"],
    thenCB: (s: I["iselection"]) => Promise<I["isubject"]>,
    testResourceConfiguration: any
  ): Promise<I["iselection"]> {
    // The thenCB expects a selection, not the store directly
    // We need to extract the selection from the store
    const selection = { testSelection: (store as any).testSelection };
    return thenCB(selection as any);
  }
}
