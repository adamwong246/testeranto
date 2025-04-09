import React from "react";
export const testInterface = {
    andWhen: async (s, whenCB) => {
        await whenCB(s());
        return new Promise((resolve, rej) => {
            resolve(React.createElement(s));
        });
    },
    butThen: async (subject, thenCB) => {
        await thenCB(subject());
        return new Promise((resolve, rej) => {
            resolve(React.createElement(subject));
        });
    },
};
// export type IWhenShape = any;
// export type IThenShape = any;
// export type InitialState = unknown;
// export type IInput = () => JSX.Element;
// export type ISelection = CElement<any, any>;
// export type IStore = CElement<any, any>;
// export type ISubject = CElement<any, any>;
// export type ITestImpl<
//   I extends Ibdd_in<
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown
//   >,
//   O extends Ibdd_out<
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>
//   >
// > = ITestImplementation<I, O>;
// export type ITestSpec<
//   I extends Ibdd_in<
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown
//   >,
//   O extends Ibdd_out<
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>
//   >
// > = ITestSpecification<I, O>;
