import { TesterantoFeatures } from "./index.mjs";
declare type ITProject = {
    tests: string[];
    features: TesterantoFeatures;
    ports: string[];
    watchMode: boolean;
    loaders: any[];
    resultsdir: string;
    minify: boolean;
    outbase: string;
    outdir: string;
    clearScreen: boolean;
};
declare const _default: (project: ITProject) => Promise<void>;
export default _default;
