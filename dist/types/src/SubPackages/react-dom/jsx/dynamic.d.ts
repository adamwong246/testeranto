import { Ibdd_in, IPartialInterface } from "../../../Types";
import { IInput, ISelection, IStore, IWhenShape, IThenShape } from ".";
export type ISubject = HTMLElement;
export type I = Ibdd_in<IInput, ISubject, ISelection, IStore, unknown, IWhenShape, IThenShape>;
export declare const testInterfacer: (testInput: I["iinput"]) => IPartialInterface<I>;
