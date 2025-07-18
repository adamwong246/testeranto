import type { Ibdd_in_any, Ibdd_out_any } from "../CoreTypes";
import { PM_Node } from "../PM/node";
import { PM_Pure } from "../PM/pure";
import { PM_Web } from "../PM/web";
import { IGivens, BaseCheck, BaseGiven, BaseWhen, BaseThen } from "./abstractBase";
import { BaseSuite } from "./BaseSuite";
export type IPM = PM_Node | PM_Web | PM_Pure;
export type TestPhase = "beforeAll" | "beforeEach" | "test" | "afterEach" | "afterAll";
export type TestError = {
    phase: TestPhase;
    error: Error;
    testName: string;
    timestamp: number;
    stackTrace?: string;
    additionalInfo?: Record<string, unknown>;
    isRetryable?: boolean;
};
export type ITestCheckCallback<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
    [K in keyof O["checks"]]: (name: string, features: string[], checkCallback: (store: I["istore"], pm: IPM) => Promise<O["checks"][K]>, ...xtrasA: O["checks"][K]) => BaseCheck<I>;
};
export type ISuiteKlasser<I extends Ibdd_in_any, O extends Ibdd_out_any> = (name: string, index: number, givens: IGivens<I>, checks: BaseCheck<I>[]) => BaseSuite<I, O>;
export type IGivenKlasser<I extends Ibdd_in_any> = (name: any, features: any, whens: any, thens: any, givenCB: any) => BaseGiven<I>;
export type IWhenKlasser<I extends Ibdd_in_any> = (s: any, o: any) => BaseWhen<I>;
export type IThenKlasser<I extends Ibdd_in_any> = (s: any, o: any) => BaseThen<I>;
export type ICheckKlasser<I extends Ibdd_in_any> = (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<I>;
