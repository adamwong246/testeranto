import WebSocket from 'ws';
import { TesterantoFeatures } from "./Features";
import { IBaseConfig, ICollateMode } from "./IBaseConfig";
import { ITTestResourceRequirement } from './core';
export declare type IRunTime = `node` | `electron` | `puppeteer`;
export declare type IRunTimes = {
    runtime: IRunTime;
    entrypoint: string;
}[];
export declare type ITestTypes = [string, IRunTime];
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
    tests: ITestTypes[];
    __dirname: string;
    getSecondaryEndpointsPoints(runtime?: IRunTime): string[];
    constructor(config: IBaseConfig);
}
export {};
