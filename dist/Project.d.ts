import { TesterantoFeatures } from "./Features";
declare type InArray<T, X> = T extends readonly [X, ...infer _Rest] ? true : T extends readonly [X] ? true : T extends readonly [infer _, ...infer Rest] ? InArray<Rest, X> : false;
declare type UniqueArray<T> = T extends readonly [infer X, ...infer Rest] ? InArray<Rest, X> extends true ? ['Encountered value with duplicates:', X] : readonly [X, ...UniqueArray<Rest>] : T;
export declare type IBaseConfig = {
    clearScreen: boolean;
    features: TesterantoFeatures;
    loaders: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: UniqueArray<string>;
    resultsdir: string;
    runMode: boolean;
    tests: UniqueArray<string>;
    watchMode: boolean;
};
export declare class ITProject {
    clearScreen: boolean;
    features: TesterantoFeatures;
    loaders: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: UniqueArray<string>;
    resultsdir: string;
    runMode: boolean;
    tests: UniqueArray<string>;
    watchMode: boolean;
    getEntryPoints(): string[];
    constructor(config: IBaseConfig);
}
export {};
