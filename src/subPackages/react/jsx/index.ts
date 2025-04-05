import { CElement } from "react";
import React from "react";

import {
  Ibdd_in,
  Ibdd_out,
  IPartialInterface,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";

export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = () => JSX.Element;
export type ISelection = CElement<any, any>;
export type IStore = CElement<any, any>;
export type ISubject = CElement<any, any>;

export type ITestImpl<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = ITestImplementation<I, O>;

export type ITestSpec<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = ITestSpecification<I, O>;

export const testInterface: IPartialInterface<any> = {
  // beforeAll: async (proto, testResource, artificer, pm): Promise<IStore> => {
  //   return React.createElement(proto);
  //   // return new Promise((resolve, rej) => {
  //   //   resolve(x());
  //   // });
  // },
  // beforeEach: async (subject, initializer, artificer): Promise<IStore> => {
  //   return new Promise((resolve, rej) => {
  //     resolve(React.createElement(subject));
  //   });
  // },
  andWhen: async (s: IStore, whenCB): Promise<IStore> => {
    await whenCB(s());
    return new Promise((resolve, rej) => {
      resolve(React.createElement(s));
    });
    // return whenCB(s);
  },
  butThen: async (subject, thenCB) => {
    await thenCB(subject());
    return new Promise((resolve, rej) => {
      resolve(React.createElement(subject));
    });
  },
};
