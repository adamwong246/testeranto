import { Ibdd_in_any } from "../../src/CoreTypes";
import { BaseWhen } from "../BaseWhen";
export declare class MockWhen<I extends Ibdd_in_any> extends BaseWhen<I> {
    constructor(name: string, whenCB: (x: I["iselection"]) => I["then"]);
    andWhen(store: I["istore"], whenCB: (x: I["iselection"]) => I["then"], testResource: any): Promise<I["istore"]>;
}
