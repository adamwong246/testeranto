import WebSocket from 'ws';
import { TesterantoFeatures } from "./Features";
import { IBaseConfig, ICollateMode } from "./IBaseConfig";
import { ITTestResourceRequirement } from './core';
export declare type IRunTime = `node` | `web`;
export declare type IRunTimes = {
    runtime: IRunTime;
    entrypoint: string;
}[];
export declare type ITestTypes = [
    string,
    IRunTime,
    ITestTypes[]
];
declare type IScehdulerProtocols = `ipc` | `ws`;
export default class Scheduler {
    private spinCycle;
    private spinAnimation;
    project: ITProject;
    ports: Record<string, string>;
    jobs: Record<string, {
        aborter: () => any;
        cancellablePromise: string;
    }>;
    resourceQueue: {
        requirement: ITTestResourceRequirement;
        protocol: IScehdulerProtocols;
    }[];
    summary: Record<string, boolean | undefined>;
    mode: `up` | `down`;
    websockets: Record<string, WebSocket>;
    constructor(project: ITProject);
    shutdown(): void;
    private spinner;
    private requestResource;
    private releaseTestResources;
    private mainLoop;
    private tick;
    private allocateViaWs;
    private allocateViaIpc;
}
export declare class ITProjectTests {
}
export declare class ITProject {
    buildMode: "on" | "off" | "watch";
    clearScreen: boolean;
    collateEntry: string;
    collateMode: ICollateMode;
    loaders: any[];
    minify: boolean;
    outbase: string;
    outdir: string;
    ports: string[];
    runMode: boolean;
    __dirname: string;
    tests: ITestTypes[];
    features: TesterantoFeatures;
    getSecondaryEndpointsPoints(runtime?: IRunTime): string[];
    constructor(config: IBaseConfig);
}
export {};
