import type { Ibdd_in_any } from "../CoreTypes";
import { ITLog } from ".";
import { IPM } from "./types.js";
export declare abstract class BaseWhen<I extends Ibdd_in_any> {
    name: string;
    whenCB: (x: I["iselection"]) => I["then"];
    error: Error;
    artifacts: string[];
    status: boolean | undefined;
    addArtifact(path: string): void;
    constructor(name: string, whenCB: (xyz: I["iselection"]) => I["then"]);
    abstract andWhen(store: I["istore"], whenCB: (x: I["iselection"]) => I["then"], testResource: any, pm: IPM): Promise<any>;
    toObj(): {
        name: string;
        status: boolean | undefined;
        error: string | null;
        artifacts: string[];
    };
    test(store: I["istore"], testResourceConfiguration: any, tLog: ITLog, pm: IPM, filepath: string): Promise<any>;
}
/**
 * Represents a collection of When actions keyed by their names.
 * Whens are typically part of Given definitions rather than standalone collections,
 * but this type exists for consistency and potential future use cases where:
 * - When actions might need to be reused across multiple Given conditions
 * - Dynamic composition of test steps is required
 * - Advanced test patterns need to reference When actions by name
 */
export type IWhens<I extends Ibdd_in_any> = Record<string, BaseWhen<I>>;
