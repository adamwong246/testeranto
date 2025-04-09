import { CElement } from "react";
import React from "react";

import { Ibdd_in, IPartialInterface } from "../../../Types";

export type I = Ibdd_in<
  () => JSX.Element,
  CElement<any, any>,
  CElement<any, any>,
  CElement<any, any>,
  any,
  () => (s: React.CElement<any, any>) => any,
  any
>;

export const testInterface: IPartialInterface<any> = {
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
