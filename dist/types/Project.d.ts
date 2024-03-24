import WebSocket from 'ws';
import { TesterantoFeatures } from "./Features";
import { IBaseConfig } from "./IBaseConfig";
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
export declare class ITProject {
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
    clearScreen: boolean;
    devMode: boolean;
    tests: ITestTypes[];
    features: TesterantoFeatures;
    private spinCycle;
    private spinAnimation;
    constructor(config: IBaseConfig);
    getSecondaryEndpointsPoints(runtime?: IRunTime): string[];
    initiateShutdown(reason: string): void;
    shutdown(): void;
    private spinner;
    private requestResource;
    private releaseTestResources;
    private allocateViaWs;
    private allocateViaIpc;
    private mainLoop;
}
export {};
