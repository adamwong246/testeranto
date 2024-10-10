import WebSocket from 'ws';
import { TesterantoFeatures } from "./Features.js";
import { IBaseConfig, IRunTime, ITestTypes } from "./Types";
import { ITTestResourceRequirement } from "./lib.js";
declare type ISchedulerProtocols = `ipc` | `ws`;
export declare class ITProject {
    clearScreen: boolean;
    devMode: boolean;
    exitCodes: Record<number, string>;
    features: TesterantoFeatures;
    mode: `up` | `down`;
    ports: Record<string, string>;
    tests: ITestTypes[];
    websockets: Record<string, WebSocket>;
    resourceQueue: {
        requirement: ITTestResourceRequirement;
        protocol: ISchedulerProtocols;
    }[];
    private spinCycle;
    private spinAnimation;
    constructor(config: IBaseConfig);
    requestResource(requirement: ITTestResourceRequirement, protocol: ISchedulerProtocols): void;
    getSecondaryEndpointsPoints(runtime?: IRunTime): string[];
    initiateShutdown(reason: string): void;
    private shutdown;
    private spinner;
    private releaseTestResourceWs;
    private releaseTestResourcePm2;
    private allocateViaWs;
    private allocateViaIpc;
    private mainLoop;
}
export {};
