import { Ibdd_in, Ibdd_out } from "../../CoreTypes";
export type I = Ibdd_in<{}, // iinput
{}, // isubject
{
    testStore: {
        value: string;
    };
    error?: Error;
}, // istore
{
    testSelection: {
        selected: boolean;
    };
}, // iselection
() => {
    testStore: {
        value: string;
    };
}, // given
(store: any) => any, // when
(store: any) => any>;
export type O = Ibdd_out<{
    Default: [string];
}, // Suites
{
    Default: [];
    WithError: [];
}, // Givens
{
    modifyStore: [string];
    throwError: [];
}, // Whens
{
    verifyStore: [string];
    verifyError: [string];
}, // Thens
{
    Default: [];
}>;
