import { ITTestResourceConfiguration, ITestArtifactory } from ".";
import { Ibdd_in_any, Ibdd_out_any } from "../CoreTypes";
import { IGivens } from "./BaseGiven";
import { IPM } from "./types";
/**
 * Represents a collection of test suites keyed by their names.
 * Suites are organized as named collections because:
 * - Tests are typically grouped into logical suites (e.g., by feature, component)
 * - Suites may have different configurations or setup requirements
 * - Named suites allow for selective test execution and better reporting
 * - This supports the hierarchical structure of test organization
 */
export type ISuites<I extends Ibdd_in_any, O extends Ibdd_out_any> = Record<string, BaseSuite<I, O>>;
export declare abstract class BaseSuite<I extends Ibdd_in_any, O extends Ibdd_out_any> {
    name: string;
    givens: IGivens<I>;
    store: I["istore"];
    testResourceConfiguration: ITTestResourceConfiguration;
    index: number;
    failed: boolean;
    fails: number;
    artifacts: string[];
    addArtifact(path: string): void;
    constructor(name: string, index: number, givens?: IGivens<I>);
    features(): any[];
    toObj(): {
        name: string;
        givens: {
            key: string;
            whens: any[];
            thens: any[];
            error: (string | Error | undefined)[] | null;
            failed: boolean;
            features: string[];
            artifacts: string[];
            status: boolean | undefined;
        }[];
        fails: number;
        failed: boolean;
        features: any[];
        artifacts: string[];
    };
    setup(s: I["iinput"], artifactory: ITestArtifactory, tr: ITTestResourceConfiguration, pm: IPM): Promise<I["isubject"]>;
    assertThat(t: Awaited<I["then"]> | undefined): boolean;
    afterAll(store: I["istore"], artifactory: ITestArtifactory, pm: IPM): I["istore"];
    run(input: I["iinput"], testResourceConfiguration: ITTestResourceConfiguration, artifactory: (fPath: string, value: unknown) => void, tLog: (...string: any[]) => void, pm: IPM): Promise<BaseSuite<I, O>>;
}
