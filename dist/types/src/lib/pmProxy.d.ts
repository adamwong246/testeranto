import { IPM } from "./types";
export declare const butThenProxy: (pm: IPM, filepath: string) => IPM;
export declare const andWhenProxy: (pm: IPM, filepath: string) => IPM;
export declare const afterEachProxy: (pm: IPM, suite: string, given: string) => IPM;
export declare const beforeEachProxy: (pm: IPM, suite: string) => IPM;
export declare const beforeAllProxy: (pm: IPM, suite: string) => IPM;
export declare const afterAllProxy: (pm: IPM, suite: string) => IPM;
