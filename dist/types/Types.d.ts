export declare type IBaseConfig = {
    __dirname: string;
    clearScreen: boolean;
    devMode: boolean;
    features: string;
    loaders: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: string[];
    tests: string;
};
export declare type IRunTime = `node` | `web`;
export declare type ITestTypes = [
    string,
    IRunTime,
    ITestTypes[]
];
