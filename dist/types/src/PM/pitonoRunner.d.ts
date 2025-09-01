import { ITestconfig } from '../lib';
export declare class PitonoRunner {
    private config;
    private testName;
    constructor(config: ITestconfig, testName: string);
    run(): Promise<void>;
}
