import { TesterantoFeatures } from "./Features";
export declare type ICollateMode = 'on' | 'off' | 'watch' | `serve` | `watch+serve`;
export declare type IBaseConfig = {
    clearScreen: boolean;
    collateMode: ICollateMode;
    features: TesterantoFeatures;
    loaders: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: string[];
    collateEntry: string;
    resultsdir: string;
    runMode: boolean;
    tests: string[];
    buildMode: 'on' | 'off' | 'watch';
};
