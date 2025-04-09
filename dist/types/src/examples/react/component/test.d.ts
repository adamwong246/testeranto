import { ITestSpecification, IT } from "../../../Types";
import { Ibdd_out } from "../../../Types";
import { IProps, IState } from ".";
export type O = Ibdd_out<{
    Default: [string];
}, {
    AnEmptyState: [];
}, {
    IClickTheButton: [];
    IClickTheHeader: [];
}, {
    ThePropsIs: [IProps];
    TheStatusIs: [IState];
}, {
    AnEmptyState: any;
}>;
export declare const specification: ITestSpecification<IT, O>;
