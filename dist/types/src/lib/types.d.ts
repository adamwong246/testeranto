import { Ibdd_in, Ibdd_out } from "../Types";
import { IGivens, BaseCheck, BaseSuite, BaseGiven, BaseWhen, BaseThen } from "./abstractBase";
export type ITestCheckCallback<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = {
    [K in keyof O["checks"]]: (name: string, features: string[], callbackA: (whens: {
        [K in keyof O["whens"]]: (...unknown: any[]) => BaseWhen<I>;
    }, thens: {
        [K in keyof O["thens"]]: (...unknown: any[]) => BaseThen<I>;
    }) => Promise<any>, ...xtrasA: O["checks"][K]) => BaseCheck<I, O>;
};
export type ISuiteKlasser<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = (name: string, index: number, givens: IGivens<I>, checks: BaseCheck<I, O>[]) => BaseSuite<I, O>;
export type IGivenKlasser<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>> = (name: any, features: any, whens: any, thens: any, givenCB: any) => BaseGiven<I>;
export type IWhenKlasser<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>> = (s: any, o: any) => BaseWhen<I>;
export type IThenKlasser<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>> = (s: any, o: any) => BaseThen<I>;
export type ICheckKlasser<I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = (n: any, f: any, cb: any, w: any, t: any) => BaseCheck<I, O>;
