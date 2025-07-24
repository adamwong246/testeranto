import { Ibdd_in, Ibdd_out } from "../../CoreTypes";
import { BaseBuilder } from "../basebuilder";
export type I = Ibdd_in<{}, // iinput
BaseBuilder<any, any, any, any, any, any>, // isubject
BaseBuilder<any, any, any, any, any, any>, // istore
BaseBuilder<any, any, any, any, any, any>, // iselection
() => BaseBuilder<any, any, any, any, any, any>, // given
(store: any) => any, // when
(store: any) => any>;
export type O = Ibdd_out<{
    Default: [string];
}, {
    Default: [];
}, {}, // No whens in these tests
{
    initializedProperly: [];
    specsGenerated: [];
    jobsCreated: [];
}>;
