import Tiposkripto from "../Tiposkripto";
import { Ibdd_in_any, Ibdd_out_any, ITestImplementation, ITestSpecification, ITestAdapter } from "../../CoreTypes";
import { ITTestResourceRequest, IFinalResults } from "..";
/**
 * Concrete implementation of Tiposkripto for testing purposes
 */
export declare class MockTiposkripto<I extends Ibdd_in_any, O extends Ibdd_out_any, M = unknown> extends Tiposkripto<I, O, M> {
    specs: any[];
    testJobs: any[];
    artifacts: any[];
    testResourceRequirement: ITTestResourceRequest;
    testAdapter: Partial<ITestAdapter<I>>;
    features: string[];
    private testImplementation;
    constructor(input: I["iinput"], testSpecification: ITestSpecification<I, O>, testImplementation: ITestImplementation<I, O, M>, testResourceRequirement: ITTestResourceRequest | undefined, testAdapter: Partial<ITestAdapter<I>>, uberCatcher?: (cb: () => void) => void);
    private extractFeaturesFromSpecification;
    receiveTestResourceConfig(partialTestResource: string): Promise<IFinalResults>;
}
