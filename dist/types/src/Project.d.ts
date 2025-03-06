import { IBaseConfig, IRunTime } from "./lib/types.js";
export declare class ITProject {
    config: IBaseConfig;
    mode: `DEV` | `PROD`;
    nodeDone: boolean;
    webDone: boolean;
    constructor(configs: IBaseConfig);
    onNodeDone: () => void;
    onWebDone: () => void;
    onDone: () => void;
    getSecondaryEndpointsPoints(runtime?: IRunTime): string[];
}
