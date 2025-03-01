import { IBaseConfig, IRunTime } from "./lib/types.js";
export declare class ITProject {
    config: IBaseConfig;
    mode: `up` | `down`;
    constructor(configs: IBaseConfig);
    getSecondaryEndpointsPoints(runtime?: IRunTime): string[];
}
