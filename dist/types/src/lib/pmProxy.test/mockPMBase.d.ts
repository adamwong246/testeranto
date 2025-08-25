import { Browser } from "puppeteer-core";
import { IBuiltConfig } from "../index";
import { PM_Base } from "../../PM/base";
export declare class MockPMBase implements PM_Base {
    browser: Browser;
    configs: IBuiltConfig;
    calls: Record<string, any[]>;
    testResourceConfiguration: any;
    constructor(configs?: IBuiltConfig);
    protected trackCall(method: string, args: any, { if:  }: {
        if: any;
    }): any;
}
