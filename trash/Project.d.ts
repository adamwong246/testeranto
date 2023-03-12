import pm2 from 'pm2';
import { TesterantoFeatures } from "../Features";
declare type IPm2Process = {
    process: {
        namespace: string;
        versioning: object;
        name: string;
        pm_id: number;
    };
    data: {
        testResource: {
            ports: number;
        };
    };
    at: string;
};
export declare class Scheduler {
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
export declare type IBaseConfig = {
    clearScreen: boolean;
    features: TesterantoFeatures;
    loaders: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: Set<string>;
    resultsdir: string;
    runMode: boolean;
    tests: Set<string>;
    watchMode: boolean;
};
export declare class ITProject {
    clearScreen: boolean;
    features: TesterantoFeatures;
    loaders: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: Set<string>;
    resultsdir: string;
    runMode: boolean;
    tests: Set<string>;
    watchMode: boolean;
    getEntryPoints(): string[];
    constructor(config: IBaseConfig);
}
export {};
