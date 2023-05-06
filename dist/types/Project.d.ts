import pm2 from "pm2";
import { TesterantoFeatures } from "./Features";
import { ICollateMode } from "./IBaseConfig";
import { IBaseConfig } from "./index.js";
export declare type IRunTimes = `node` | `electron`;
export declare type ITestTypes = [f: string, r: IRunTimes][];
declare type IPm2Process = {
    process: {
        namespace: string;
        versioning: object;
        name: string;
        pm_id: number;
    };
    data: {
        testResourceRequirement: {
            ports: number;
        };
    };
    at: string;
};
export default class Scheduler {
    project: ITProject;
    ports: Record<string, string>;
    jobs: Record<string, {
        aborter: () => any;
        cancellablePromise: string;
    }>;
    queue: IPm2Process[];
    spinCycle: number;
    spinAnimation: string;
    pm2: typeof pm2;
    summary: Record<string, boolean | undefined>;
    mode: `up` | `down`;
    constructor(project: ITProject);
    private checkForShutDown;
    abort(pm2Proc: IPm2Process): Promise<void>;
    private spinner;
    private push;
    private pop;
    private releaseTestResources;
    shutdown(): void;
}
export declare class ITProject {
    buildMode: "on" | "off" | "watch";
    clearScreen: boolean;
    collateEntry: string;
    collateMode: ICollateMode;
    features: TesterantoFeatures;
    loaders: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: string[];
    runMode: boolean;
    tests: ITestTypes;
    getEntryPoints(runtime?: IRunTimes): ITestTypes;
    constructor(config: IBaseConfig);
}
export {};
