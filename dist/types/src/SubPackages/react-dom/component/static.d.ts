import React, { ReactNode } from "react";
import { Ibdd_in } from "../../../Types";
type IInput = typeof React.Component;
export type ISelection = ReactNode;
export type IStore = ReactNode;
export type ISubject = ReactNode;
export type I = Ibdd_in<IInput, ISubject, IStore, ISelection, unknown, (s: IStore) => IStore, unknown>;
export declare const testInterfacer: (testInput: any) => any;
export {};
