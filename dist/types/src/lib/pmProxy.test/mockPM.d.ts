import { MockPMBase } from "./mockPMBase";
export declare class MockPM extends MockPMBase {
    server: any;
    constructor(configs?: any);
    start(): Promise<void>;
    stop(): Promise<void>;
    launchSideCar(n: number): Promise<[number, any]>;
    stopSideCar(n: number): Promise<any>;
    writeFileSync(path: string, content: string): Promise<boolean>;
}
