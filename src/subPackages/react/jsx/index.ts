import { CElement } from "react";

import {
  IBaseTest,
  IPartialInterface,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types";
import React from "react";

export type IWhenShape = any;
export type IThenShape = any;
export type InitialState = unknown;
export type IInput = () => JSX.Element;
export type ISelection = CElement<any, any>;
export type IStore = CElement<any, any>;
export type ISubject = CElement<any, any>;

export type ITestImpl<ITestShape extends IBaseTest> =
  ITestImplementation<ITestShape>;

export type ITestSpec<ITestShape extends IBaseTest> =
  ITestSpecification<ITestShape>;

export const testInterface: IPartialInterface<any> = {
  // beforeAll: async (proto, testResource, artificer, pm): Promise<IStore> => {
  //   return React.createElement(proto);
  //   // return new Promise((resolve, rej) => {
  //   //   resolve(x());
  //   // });
  // },
  beforeEach: async (subject, initializer, artificer): Promise<IStore> => {
    return new Promise((resolve, rej) => {
      const x = React.createElement(subject);
      console.log("react-element", x);
      resolve(x);
    });
  },
  andWhen: function (s: IStore, whenCB): Promise<ISelection> {
    return whenCB(s);
  },
};
