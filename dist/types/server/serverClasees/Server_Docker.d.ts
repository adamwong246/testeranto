import { IRunTime, ITestconfigV2 } from "../../Types";
import { IMode } from "../types";
import { Server_WS } from "./Server_WS";
export type IService = any;
export interface IDockerComposeResult {
    exitCode: number;
    out: string;
    err: string;
    data: any;
}
export declare class Server_Docker extends Server_WS {
    private logProcesses;
    constructor(configs: ITestconfigV2, mode: IMode);
    BaseCompose(services: any): {
        services: any;
        volumes: {
            node_modules: {
                driver: string;
            };
        };
        networks: {
            allTests_network: {
                driver: string;
            };
        };
    };
    staticTestDockerComposeFile(runtime: IRunTime, container_name: string, command: string): {
        build: {
            context: string;
            dockerfile: string;
        };
        container_name: string;
        environment: {};
        working_dir: string;
        command: string;
        networks: string[];
    };
    bddTestDockerComposeFile(runtime: IRunTime, container_name: string, command: string): any;
    aiderDockerComposeFile(container_name: string): {
        build: {
            context: string;
            dockerfile: string;
        };
        container_name: string;
        environment: {};
        working_dir: string;
        command: string;
        networks: string[];
    };
    generateServices(): Record<string, any>;
    autogenerateStamp(x: string): string;
    getUpCommand(): string;
    getDownCommand(): string;
    getPsCommand(): string;
    getLogsCommand(serviceName?: string, tail?: number): string;
    getConfigServicesCommand(): string;
    getBuildCommand(): string;
    getStartCommand(): string;
    private startServiceLogging;
    private captureContainerExitCode;
    start(): Promise<void>;
    private captureExistingLogs;
    private waitForContainerHealthy;
    stop(): Promise<void>;
    setupDockerCompose(): Promise<void>;
    writeComposeFile(services: Record<string, IService>): void;
    private exec;
    spawnPromise(command: string): Promise<number>;
    DC_upAll(): Promise<IDockerComposeResult>;
    DC_down(): Promise<IDockerComposeResult>;
    DC_ps(): Promise<IDockerComposeResult>;
    DC_logs(serviceName: string, options?: {
        follow?: boolean;
        tail?: number;
    }): Promise<IDockerComposeResult>;
    DC_configServices(): Promise<IDockerComposeResult>;
    DC_start(): Promise<any>;
    DC_build(): Promise<any>;
    getProcessSummary(): any;
    private getRuntimeFromName;
}
