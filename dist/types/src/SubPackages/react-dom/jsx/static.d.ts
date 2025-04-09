import { Ibdd_in, IPartialInterface } from "../../../Types";
import { IInput, ISelection, IStore } from ".";
import { IPM } from "../../../lib/types";
export type I = Ibdd_in<IInput, HTMLElement, ISelection, IStore, unknown, (s: HTMLElement, p: IPM) => any, (s: HTMLElement, p: IPM) => any>;
export declare const testInterface: IPartialInterface<I>;
