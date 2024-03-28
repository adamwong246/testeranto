export declare type IBaseConfig = {
    clearScreen: boolean;
    devMode: boolean;
    features: string;
    plugins: any[];
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
