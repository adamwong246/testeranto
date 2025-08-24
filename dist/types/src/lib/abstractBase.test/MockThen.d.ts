import { Ibdd_in_any } from "../../CoreTypes";
import { BaseThen } from "../BaseThen";
export declare class MockThen<I extends Ibdd_in_any> extends BaseThen<I> {
    constructor(name: string, thenCB: (val: I["iselection"]) => Promise<I["then"]>);
    butThen(store: I["istore"], thenCB: (s: I["iselection"]) => Promise<I["isubject"]>, testResourceConfiguration: any, pm: any): Promise<I["iselection"]>;
}
