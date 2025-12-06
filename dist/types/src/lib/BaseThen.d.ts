import type { Ibdd_in_any } from "../CoreTypes";
import { ITLog, ITTestResourceConfiguration } from ".";
import { IPM } from "./types.js";
export declare abstract class BaseThen<I extends Ibdd_in_any> {
    name: string;
    thenCB: (storeState: I["iselection"], pm: IPM) => Promise<I["then"]>;
    error: boolean;
    artifacts: string[];
    status: boolean | undefined;
    constructor(name: string, thenCB: (val: I["iselection"]) => Promise<I["then"]>);
    addArtifact(path: string): void;
    toObj(): {
        name: string;
        error: boolean;
        artifacts: string[];
        status: boolean | undefined;
    };
    abstract butThen(store: I["istore"], thenCB: (s: I["iselection"]) => Promise<I["isubject"]>, testResourceConfiguration: ITTestResourceConfiguration, pm: IPM): Promise<I["iselection"]>;
    test(store: I["istore"], testResourceConfiguration: any, tLog: ITLog, pm: IPM, filepath: string): Promise<I["then"] | undefined>;
}
/**
 * Represents a collection of Then assertions keyed by their names.
 * Thens are typically part of Given definitions rather than standalone collections,
 * but this type exists for consistency and potential future use cases where:
 * - Assertions might need to be reused or composed dynamically
 * - Custom assertion libraries could benefit from named assertion collections
 * - Advanced validation patterns require named Then conditions
 */
export type IThens<I extends Ibdd_in_any> = Record<string, BaseThen<I>>;
