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
    "the default BaseBuilder": [];
    "a BaseBuilder with TestInput": [];
    "a BaseBuilder with Test Resource Requirements": [];
}, {}, // No whens in these tests
{
    "it is initialized": [];
    "it generates TestSpecifications": [];
    "it creates jobs": [];
    "it tracks artifacts": [];
}>;
