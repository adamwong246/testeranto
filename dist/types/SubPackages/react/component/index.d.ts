import React from "react";
import { Ibdd_in, IPartialInterface } from "../../../Types";
export type I = Ibdd_in<typeof React.Component, React.CElement<any, any>, React.CElement<any, any>, React.CElement<any, any>, unknown, () => (s: React.CElement<any, any>) => any, unknown>;
export declare const reactInterfacer: (testInput: I["iinput"]) => IPartialInterface<I>;
