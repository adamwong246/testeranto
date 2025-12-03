/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import ReactDom from "react-dom/client";

import { Ibdd_in, Ibdd_out } from "../../../CoreTypes";
import { IProjectPageViewProps } from "../ProjectPageView";

export type IInput = IProjectPageViewProps;

export type ISelection = {
  htmlElement: HTMLElement;
  reactElement: React.ReactElement;
  domRoot: ReactDom.Root;
};

export type IStore = ISelection;

export type ISubject = {
  htmlElement: HTMLElement;
  domRoot: ReactDom.Root;
};

export type I = Ibdd_in<
  IInput,
  ISubject,
  ISelection,
  IStore,
  (s: IStore) => IStore,
  (s: IStore) => IStore,
  {
    hasContainerFluid: () => (s: IStore) => IStore;
    hasNavBar: () => (s: IStore) => IStore;
    hasNavBarTitle: () => (s: IStore) => IStore;
    hasTestTable: () => (s: IStore) => IStore;
    rendersTestSuite1: () => (s: IStore) => IStore;
    rendersTestSuite2: () => (s: IStore) => IStore;
    unhappyPath: () => (s: IStore) => IStore;
    takeScreenshot: (name: string) => (s: IStore, pm: any) => Promise<IStore>;
  }
>;

// export type I = Ibdd_in<
//   null,
//   IProjectPageViewProps,
//   IProjectPageViewProps & { container?: HTMLElement },
//   IProjectPageViewProps & { container?: HTMLElement },
//   (...args: any[]) => IProjectPageViewProps,
//   () => (
//     props: IProjectPageViewProps,
//     utils: any
//   ) => IProjectPageViewProps & { container?: HTMLElement },
//   () => (
//     state: IProjectPageViewProps & { container?: HTMLElement }
//   ) => IProjectPageViewProps & { container?: HTMLElement }
// >;

export type O = Ibdd_out<
  {
    Default: [string];
  },
  {
    Default: [];
    WithError: [];
    Navigation: [];
  },
  {},
  {
    hasContainerFluid: [];
    hasNavBar: [];
    hasNavBarTitle: [];
    hasTestTable: [];
    rendersTestSuite1: [];
    rendersTestSuite2: [];
    unhappyPath: [];
    takeScreenshot: [string];
  }
>;

export type M = {
  givens: {
    [K in keyof O["givens"]]: (...args: any[]) => IProjectPageViewProps;
  };
  whens: {
    [K in keyof O["whens"]]: (
      ...args: any[]
    ) => (
      props: IProjectPageViewProps,
      utils: any
    ) => IProjectPageViewProps & { container?: HTMLElement };
  };
  thens: {
    [K in keyof O["thens"]]: (
      ...args: any[]
    ) => (
      state: IProjectPageViewProps & { container?: HTMLElement }
    ) => IProjectPageViewProps & { container?: HTMLElement };
  };
};
