import { IBaseConfig, IRunTime } from "./lib/types.js";
export declare class ITProject {
    config: IBaseConfig;
    mode: `up` | `down`;
    constructor(config: IBaseConfig);
    getSecondaryEndpointsPoints(runtime?: IRunTime): string[];
}
