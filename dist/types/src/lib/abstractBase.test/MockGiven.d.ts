import { BaseGiven, BaseThen, BaseWhen } from "../abstractBase";
import { Ibdd_in_any } from "../../CoreTypes";
export declare class MockGiven<I extends Ibdd_in_any> extends BaseGiven<I> {
    constructor(name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[], givenCB: I["given"], initialValues: any);
    givenThat(subject: I["isubject"], testResourceConfiguration: any, artifactory: any, givenCB: I["given"], initialValues: any, pm: any): Promise<I["istore"]>;
    uberCatcher(e: Error): void;
}
