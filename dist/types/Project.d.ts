import { IBaseConfig, IRunTime } from "./Types";
export declare class ITProject {
    config: IBaseConfig;
    mode: `up` | `down`;
    constructor(config: IBaseConfig);
    getSecondaryEndpointsPoints(runtime?: IRunTime): string[];
    initiateShutdown(reason: string): void;
}
