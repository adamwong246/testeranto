export declare type ICollateMode = "on" | "off" | "watch" | `serve` | `watch+serve` | `dev`;
export declare type IBaseConfig = {
    clearScreen: boolean;
    collateMode: ICollateMode;
    loaders: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: string[];
    collateEntry: string;
    runMode: boolean;
    buildMode: "on" | "off" | "watch";
    __dirname: string;
    tests: string;
    features: string;
};
