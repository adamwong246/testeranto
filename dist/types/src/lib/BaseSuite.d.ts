import { ITTestResourceConfiguration, ITestArtifactory } from ".";
import { Ibdd_in_any, Ibdd_out_any } from "../CoreTypes";
import { IGivens, BaseCheck } from "./abstractBase";
import { IPM } from "./types";
export declare abstract class BaseSuite<I extends Ibdd_in_any, O extends Ibdd_out_any> {
    name: string;
    givens: IGivens<I>;
    checks: BaseCheck<I>[];
    store: I["istore"];
    testResourceConfiguration: ITTestResourceConfiguration;
    index: number;
    failed: boolean;
    fails: number;
    constructor(name: string, index: number, givens?: IGivens<I>, checks?: BaseCheck<I>[]);
    features(): string[];
    toObj(): {
        name: string;
        givens: {
            key: string;
            name: string;
            whens: {}[];
            thens: {
                name: string;
                error: boolean;
            }[];
            error: (string | Error | undefined)[] | null;
            failed: boolean;
            features: string[];
        }[];
        checks: any[];
        fails: number;
        failed: boolean;
        features: string[];
    };
    setup(s: I["iinput"], artifactory: ITestArtifactory, tr: ITTestResourceConfiguration, pm: IPM): Promise<I["isubject"]>;
    assertThat(t: Awaited<I["then"]> | undefined): boolean;
    afterAll(store: I["istore"], artifactory: ITestArtifactory, pm: IPM): I["istore"];
    run(input: I["iinput"], testResourceConfiguration: ITTestResourceConfiguration, artifactory: (fPath: string, value: unknown) => void, tLog: (...string: any[]) => void, pm: IPM): Promise<BaseSuite<I, O>>;
}
