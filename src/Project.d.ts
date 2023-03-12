import { TesterantoFeatures } from "./Features";
import pm2 from 'pm2';
import { ICollateMode } from "./IBaseConfig";
import { IBaseConfig } from "./index.mjs";
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
    getEntryPoints(): string[];
    constructor(config: IBaseConfig);
}
export {};
