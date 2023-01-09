import CancelablePromise from 'cancelable-promise';
import { TesterantoFeatures } from '../Features';
import { ITTestResourceRequirement } from '../types';
export declare class Scheduler {
    featureTestJoin: Record<string, any>;
    testerantoFeatures: TesterantoFeatures;
    ports: Record<string, string>;
    jobs: Record<string, {
        aborter: () => any;
        cancellablePromise: CancelablePromise<unknown>;
    }>;
    queue: {
        key: string;
        aborter: () => any;
        getCancellablePromise: (testResource: any) => CancelablePromise<unknown>;
        testResourceRequired: ITTestResourceRequirement;
    }[];
    testSrcMd5s: object;
    featureSrcMd5: string;
    spinCycle: number;
    spinAnimation: string;
    constructor(portsToUse: string[]);
    abort(key: any): Promise<void>;
    launch(): void;
    testFileTouched(key: any, distFile: any, className: any, hash: any): void;
    featureFileTouched(distFile: any, hash: any): void;
    private setFeatures;
    private dumpNetworks;
    private dumpNetworksDags;
    private regenerateReports;
    private spinner;
    private push;
    private pop;
    private startJob;
}
