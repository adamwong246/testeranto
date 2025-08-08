/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Ibdd_in, Ibdd_out } from "../../../CoreTypes";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { IPM } from "../../../lib/types";

export type IInput = {
  children: React.ReactNode;
};

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

export type O = Ibdd_out<
  {
    Default: [string];
    Layout: [string];
  },
  {
    Default: [];
    WithChildren: [React.ReactNode];
  },
  {},
  {
    RendersContainer: [];
    HasMainContent: [];
    HasFooter: [];
    HasSettingsButton: [];
    HasTesterantoLink: [];
    takeScreenshot: [string];
  }
>;

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
    takeScreenshot: (name: string) => (s: IStore, pm: IPM) => Promise<IStore>;
  }
>;
